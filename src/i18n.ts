export type Lang = 'es' | 'en' | 'pt' | 'fr';
export const LANGS: Lang[] = ['es', 'en', 'pt', 'fr'];

const D: Record<Lang, Record<string, string>> = {
  es: {
    data: 'Datos:', ss: 'Estructura secundaria', ribbon: 'Cinta (hélices y hojas)', lang: 'Idioma', ph: 'PDB (1UBQ) o UniProt (P69905)', load: 'Cargar', file: 'Archivo .pdb', color: 'Color',
    conf_pl: 'Confianza pLDDT (AlphaFold)', conf_b: 'Factor B (agitación térmica)', element: 'Elemento (CPK)',
    residue: 'Tipo de aminoácido', chain: 'Cadena', atoms: 'Átomos', backbone: 'Esqueleto (CA)',
    nAtoms: 'Átomos', nChains: 'Cadenas', loading: 'Cargando...', showing: 'Mostrando {n}', error: 'Error: {m}',
    noAtoms: 'No se encontraron átomos en el archivo', noAf: 'AlphaFold no devolvió un PDB para ese ID',
    l_name: 'Nombre', l_gene: 'Gen', l_org: 'Organismo', l_fn: 'Función', l_method: 'Método', l_sum: 'Resumen', l_conf: 'Confianza',
    exp: 'Estructura experimental.', pred: 'Predicción de AlphaFold.',
    counts: 'Aminoácidos: {aa} · Cadenas: {ch} · Átomos: {at}.',
    confTxt: 'pLDDT medio {m} ({lv}); el {g}% de los aminoácidos supera 70.',
    lv1: 'muy alta', lv2: 'alta', lv3: 'baja', lv4: 'muy baja',
    fnSrc: 'UniProt', fnTr: 'UniProt, traducción automática', fnEn: 'UniProt, en inglés',
  },
  en: {
    data: 'Data:', ss: 'Secondary structure', ribbon: 'Ribbon (helices and sheets)', lang: 'Language', ph: 'PDB (1UBQ) or UniProt (P69905)', load: 'Load', file: '.pdb file', color: 'Color',
    conf_pl: 'pLDDT confidence (AlphaFold)', conf_b: 'B-factor (thermal motion)', element: 'Element (CPK)',
    residue: 'Amino acid type', chain: 'Chain', atoms: 'Atoms', backbone: 'Backbone (CA)',
    nAtoms: 'Atoms', nChains: 'Chains', loading: 'Loading...', showing: 'Showing {n}', error: 'Error: {m}',
    noAtoms: 'No atoms found in the file', noAf: 'AlphaFold returned no PDB for that ID',
    l_name: 'Name', l_gene: 'Gene', l_org: 'Organism', l_fn: 'Function', l_method: 'Method', l_sum: 'Summary', l_conf: 'Confidence',
    exp: 'Experimental structure.', pred: 'AlphaFold prediction.',
    counts: 'Residues: {aa} · Chains: {ch} · Atoms: {at}.',
    confTxt: 'mean pLDDT {m} ({lv}); {g}% of residues score above 70.',
    lv1: 'very high', lv2: 'high', lv3: 'low', lv4: 'very low',
    fnSrc: 'UniProt', fnTr: 'UniProt', fnEn: 'UniProt',
  },
  pt: {
    data: 'Dados:', ss: 'Estrutura secundária', ribbon: 'Fita (hélices e folhas)', lang: 'Idioma', ph: 'PDB (1UBQ) ou UniProt (P69905)', load: 'Carregar', file: 'Arquivo .pdb', color: 'Cor',
    conf_pl: 'Confiança pLDDT (AlphaFold)', conf_b: 'Fator B (agitação térmica)', element: 'Elemento (CPK)',
    residue: 'Tipo de aminoácido', chain: 'Cadeia', atoms: 'Átomos', backbone: 'Esqueleto (CA)',
    nAtoms: 'Átomos', nChains: 'Cadeias', loading: 'Carregando...', showing: 'Mostrando {n}', error: 'Erro: {m}',
    noAtoms: 'Nenhum átomo encontrado no arquivo', noAf: 'O AlphaFold não retornou um PDB para esse ID',
    l_name: 'Nome', l_gene: 'Gene', l_org: 'Organismo', l_fn: 'Função', l_method: 'Método', l_sum: 'Resumo', l_conf: 'Confiança',
    exp: 'Estrutura experimental.', pred: 'Predição do AlphaFold.',
    counts: 'Aminoácidos: {aa} · Cadeias: {ch} · Átomos: {at}.',
    confTxt: 'pLDDT médio {m} ({lv}); {g}% dos aminoácidos superam 70.',
    lv1: 'muito alta', lv2: 'alta', lv3: 'baixa', lv4: 'muito baixa',
    fnSrc: 'UniProt', fnTr: 'UniProt, tradução automática', fnEn: 'UniProt, em inglês',
  },
  fr: {
    data: 'Données :', ss: 'Structure secondaire', ribbon: 'Ruban (hélices et feuillets)', lang: 'Langue', ph: 'PDB (1UBQ) ou UniProt (P69905)', load: 'Charger', file: 'Fichier .pdb', color: 'Couleur',
    conf_pl: 'Confiance pLDDT (AlphaFold)', conf_b: 'Facteur B (agitation thermique)', element: 'Élément (CPK)',
    residue: "Type d'acide aminé", chain: 'Chaîne', atoms: 'Atomes', backbone: 'Squelette (CA)',
    nAtoms: 'Atomes', nChains: 'Chaînes', loading: 'Chargement...', showing: 'Affichage de {n}', error: 'Erreur : {m}',
    noAtoms: 'Aucun atome trouvé dans le fichier', noAf: "AlphaFold n'a renvoyé aucun PDB pour cet ID",
    l_name: 'Nom', l_gene: 'Gène', l_org: 'Organisme', l_fn: 'Fonction', l_method: 'Méthode', l_sum: 'Résumé', l_conf: 'Confiance',
    exp: 'Structure expérimentale.', pred: 'Prédiction AlphaFold.',
    counts: 'Acides aminés : {aa} · Chaînes : {ch} · Atomes : {at}.',
    confTxt: 'pLDDT moyen {m} ({lv}) ; {g} % des acides aminés dépassent 70.',
    lv1: 'très élevée', lv2: 'élevée', lv3: 'faible', lv4: 'très faible',
    fnSrc: 'UniProt', fnTr: 'UniProt, traduction automatique', fnEn: 'UniProt, en anglais',
  },
};

let cur: Lang = 'es';
export const getLang = (): Lang => cur;

export function setLang(l: Lang): void {
  cur = l;
  document.documentElement.lang = l;
  try { localStorage.setItem('lang', l); } catch { /* sin almacenamiento */ }
}

export function initLang(): Lang {
  let saved: string | null = null;
  try { saved = localStorage.getItem('lang'); } catch { /* sin almacenamiento */ }
  const guess = saved ?? navigator.language.slice(0, 2);
  setLang((LANGS as string[]).includes(guess) ? (guess as Lang) : 'en');
  return cur;
}

export function t(key: string, vars: Record<string, string | number> = {}): string {
  let s = D[cur][key] ?? D.en[key] ?? key;
  for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]));
  return s;
}

export function applyStatic(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((e) => { e.textContent = t(e.dataset.i18n!); });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-ph]').forEach((e) => { e.placeholder = t(e.dataset.i18nPh!); });
}
