import { SceneManager } from './core/SceneManager';
import { PdbParser, type Atom } from './parser/PdbParser';
import { MoleculeRenderer, type ColorMode } from './renderer/MoleculeRenderer';
import { t, applyStatic, initLang, setLang, getLang, type Lang } from './i18n';
import './style.css';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

interface AfMeta { uniprotDescription?: string; gene?: string; organismScientificName?: string }
interface Source { text: string; name: string; predicted: boolean; kind: 'pdb' | 'alphafold' | 'file'; id: string; meta?: AfMeta }
interface RawInfo { name?: string; gene?: string; org?: string; method?: string; fn?: string }
type Item = [label: string, text: string];

async function getText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
  return res.text();
}

/** 4 caracteres (1UBQ) -> RCSB PDB; otro formato (P69905) -> AlphaFold DB por UniProt. */
async function fetchById(raw: string): Promise<Source> {
  const id = raw.trim().split(/\s+/)[0].toUpperCase();
  if (/^[0-9][A-Z0-9]{3}$/.test(id)) {
    const text = await getText(`https://files.rcsb.org/download/${id}.pdb`);
    return { text, name: id, predicted: false, kind: 'pdb', id };
  }
  const meta = JSON.parse(await getText(`https://alphafold.ebi.ac.uk/api/prediction/${id}`));
  const entry = Array.isArray(meta) ? meta[0] : meta;
  if (!entry?.pdbUrl) throw new Error(t('noAf'));
  const text = await getText(entry.pdbUrl);
  return { text, name: `AlphaFold ${id}`, predicted: true, kind: 'alphafold', id, meta: entry as AfMeta };
}

/** Datos oficiales de RCSB, AlphaFold DB y UniProt (en inglés). */
async function fetchInfo(src: Source): Promise<RawInfo> {
  const info: RawInfo = {};
  if (src.kind === 'pdb') {
    const d = JSON.parse(await getText(`https://data.rcsb.org/rest/v1/core/entry/${src.id}`));
    info.name = d.struct?.title;
    const method = d.exptl?.[0]?.method;
    const res = d.rcsb_entry_info?.resolution_combined?.[0];
    if (method) info.method = res ? `${method} (${res} Å)` : method;
  } else if (src.kind === 'alphafold') {
    info.name = src.meta?.uniprotDescription;
    info.gene = src.meta?.gene;
    info.org = src.meta?.organismScientificName;
    try {
      const u = JSON.parse(await getText(`https://rest.uniprot.org/uniprotkb/${src.id}.json`));
      const fn = u.comments?.find((c: { commentType: string }) => c.commentType === 'FUNCTION');
      const text: string | undefined = fn?.texts?.[0]?.value;
      if (text) info.fn = text.length > 380 ? text.slice(0, 380) + '…' : text;
    } catch { /* la función es opcional */ }
  }
  return info;
}

/** Traducción automática gratuita (MyMemory). Devuelve null si falla; entonces se muestra el inglés. */
const trCache = new Map<string, string>();
async function translate(text: string, lang: Lang): Promise<string | null> {
  if (lang === 'en') return text;
  const key = `${lang}|${text}`;
  const hit = trCache.get(key);
  if (hit) return hit;
  try {
    const d = JSON.parse(await getText(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`));
    const out: string | undefined = d.responseData?.translatedText;
    if (!out || Number(d.responseStatus) !== 200) return null;
    trCache.set(key, out);
    return out;
  } catch { return null; }
}

/** Resumen calculado con los datos reales del archivo. */
function summarize(atoms: Atom[], src: Source): Item[] {
  const cas = atoms.filter((a) => a.name === 'CA' && !a.isHet);
  const ch = new Set(atoms.map((a) => a.chain)).size;
  const counts = t('counts', { aa: cas.length, ch, at: atoms.length });
  if (!src.predicted || cas.length === 0) {
    return [[t('l_sum'), (src.kind === 'pdb' ? `${t('exp')} ` : '') + counts]];
  }
  const mean = cas.reduce((s, a) => s + a.bFactor, 0) / cas.length;
  const g = Math.round((100 * cas.filter((a) => a.bFactor > 70).length) / cas.length);
  const lv = t(mean > 90 ? 'lv1' : mean > 70 ? 'lv2' : mean > 50 ? 'lv3' : 'lv4');
  return [
    [t('l_sum'), `${t('pred')} ${counts}`],
    [t('l_conf'), t('confTxt', { m: mean.toFixed(0), lv, g })],
  ];
}

function renderCard(items: Item[]): void {
  const card = $('info-card');
  card.replaceChildren();
  for (const [label, text] of items) {
    const p = document.createElement('p');
    const b = document.createElement('b');
    b.textContent = `${label}: `;
    p.append(b, text);
    card.appendChild(p);
  }
}

function init(): void {
  const status = $('status');
  const modeSelect = $<HTMLSelectElement>('color-mode');
  const langSelect = $<HTMLSelectElement>('lang-select');
  const manager = new SceneManager('canvas-container');
  const renderer = new MoleculeRenderer(manager.scene);
  let predicted = false;
  let loaded = false;
  let renderId = 0;
  let cur: { src: Source; atoms: Atom[]; info: RawInfo } | null = null;
  let statusFn: () => string = () => t('loading');

  const setStatus = (fn: () => string) => { statusFn = fn; status.textContent = fn(); };
  const refreshLabels = () => {
    applyStatic();
    $('conf-option').textContent = t(predicted ? 'conf_pl' : 'conf_b');
    status.textContent = statusFn();
  };

  const renderInfo = async () => {
    if (!cur) return;
    const myId = ++renderId;
    const { src, atoms, info } = cur;
    const head: Item[] = [];
    if (info.name) head.push([t('l_name'), info.name]);
    if (info.gene) head.push([t('l_gene'), info.gene]);
    if (info.org) head.push([t('l_org'), info.org]);
    if (info.method) head.push([t('l_method'), info.method]);
    const tail = summarize(atoms, src);
    renderCard([...head, ...tail]);
    if (!info.fn) return;
    const lang = getLang();
    const tr = await translate(info.fn, lang);
    if (myId !== renderId) return;
    const origin = t(lang === 'en' ? 'fnSrc' : tr ? 'fnTr' : 'fnEn');
    renderCard([...head, [`${t('l_fn')} (${origin})`, tr ?? info.fn], ...tail]);
  };

  const show = (src: Source) => {
    predicted = src.predicted;
    const atoms = PdbParser.parse(src.text);
    if (atoms.length === 0) throw new Error(t('noAtoms'));
    renderer.load(atoms, modeSelect.value as ColorMode, predicted, PdbParser.parseSecondary(src.text));
    renderer.setRibbonVisible($<HTMLInputElement>('show-ribbon').checked);
    renderer.setAtomsVisible($<HTMLInputElement>('show-atoms').checked);
    renderer.setBackboneVisible($<HTMLInputElement>('show-backbone').checked);
    manager.fitToRadius(renderer.radius);
    $('stat-atoms').textContent = atoms.length.toLocaleString();
    $('stat-chains').textContent = String(new Set(atoms.map((a) => a.chain)).size);
    loaded = true;
    setStatus(() => t('showing', { n: src.name }));
    refreshLabels();

    const mine = { src, atoms, info: {} as RawInfo };
    cur = mine;
    void renderInfo();
    fetchInfo(src)
      .then((info) => { if (cur === mine) { mine.info = info; void renderInfo(); } })
      .catch(() => { /* sin red: se queda el resumen local */ });
  };

  const run = async (task: () => Promise<Source>) => {
    setStatus(() => t('loading'));
    try { show(await task()); }
    catch (e) { const m = (e as Error).message; setStatus(() => t('error', { m })); console.error(e); }
  };

  langSelect.addEventListener('change', () => {
    setLang(langSelect.value as Lang);
    refreshLabels();
    void renderInfo();
  });
  $('load-btn').addEventListener('click', () => {
    const id = $<HTMLInputElement>('id-input').value;
    if (id.trim()) void run(() => fetchById(id));
  });
  $('id-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('load-btn').click(); });
  $<HTMLInputElement>('pdb-file-input').addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      void run(async () => ({
        text: await file.text(), name: file.name, kind: 'file' as const, id: file.name,
        predicted: /^AF-/i.test(file.name),
      }));
    }
  });
  modeSelect.addEventListener('change', () => { if (loaded) renderer.recolor(modeSelect.value as ColorMode, predicted); });
  $<HTMLInputElement>('show-atoms').addEventListener('change', (e) => renderer.setAtomsVisible((e.target as HTMLInputElement).checked));
  $<HTMLInputElement>('show-backbone').addEventListener('change', (e) => renderer.setBackboneVisible((e.target as HTMLInputElement).checked));
  $<HTMLInputElement>('show-ribbon').addEventListener('change', (e) => renderer.setRibbonVisible((e.target as HTMLInputElement).checked));

  langSelect.value = initLang();
  refreshLabels();
  manager.start((fps) => { $('stat-fps').textContent = String(fps); });
  void run(() => fetchById('1UBQ'));
}

init();
