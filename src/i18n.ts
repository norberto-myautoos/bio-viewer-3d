export type Lang = 'es' | 'en' | 'pt' | 'fr';
export const LANGS: Lang[] = ['es', 'en', 'pt', 'fr'];

const D: Record<Lang, Record<string, string>> = {
  es: {
    data: 'Datos:', srcBtn: 'Fuentes y licencias', srcTitle: 'Fuentes y licencias', srcIndep: 'Independencia', srcIndepTxt: 'Este visor es independiente: no está afiliado ni respaldado por DeepMind, EMBL-EBI, RCSB, wwPDB ni UniProt.', srcData: 'Datos', srcDataTxt: 'Se consultan en vivo a cada proveedor y no se guardan en un servidor; en tu navegador solo queda el idioma elegido. Si activas la traducción automática, el texto de la función se envía a MyMemory.', srcPred: 'Aviso', srcPredTxt: 'Las estructuras de AlphaFold son predicciones computacionales, no estructuras experimentales. Este visor no ofrece diagnóstico ni asesoramiento médico.', srcUpd: 'Correcciones', srcUpdTxt: 'La función, las enfermedades y las variantes provienen de UniProt y se muestran como las publica, sin reinterpretarlas. Para reportar un error o pedir que se retire un dato, abre un Issue en el repositorio de GitHub del proyecto.', trOpt: 'Traducir la función (servicio externo MyMemory)', l_prov: 'Procedencia', provLocal: 'Archivo local del usuario', eduSrc: 'Fuente', eduDis: 'Enfermedades asociadas', eduSites: 'Sitios y variantes (clic para verlos en 3D)', eduClear: 'Quitar resaltado', copyLink: 'Copiar enlace', copied: 'Enlace copiado', est: '(estimada)', disclaimer: "Las estructuras mostradas son modelos para educación e investigación; las de AlphaFold son predicciones computacionales, no estructuras experimentales. Este visor no ofrece diagnóstico ni asesoramiento médico.", examples: 'Ejemplos:', png: 'Exportar imagen HD (PNG)', tAtom: 'Átomo', tChain: 'Cadena', tConf: 'Confianza (pLDDT)', tB: 'Factor B', tSS: 'Estructura', ssH: 'Hélice', ssE: 'Hoja', ssC: 'Lazo', legPl: 'Confianza pLDDT', legB: 'Factor B (bajo → alto)', legSS: 'Estructura secundaria', ss: 'Estructura secundaria', ribbon: 'Cinta (hélices y hojas)', lang: 'Idioma', ph: 'PDB (1UBQ) o UniProt (P69905)', load: 'Cargar', file: 'Archivo .pdb', color: 'Color',
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
    data: 'Data:', srcBtn: 'Sources and licenses', srcTitle: 'Sources and licenses', srcIndep: 'Independence', srcIndepTxt: 'This viewer is independent: it is not affiliated with or endorsed by DeepMind, EMBL-EBI, RCSB, wwPDB or UniProt.', srcData: 'Data', srcDataTxt: 'Fetched live from each provider and not stored on a server; only your chosen language is kept in your browser. If you enable machine translation, the function text is sent to MyMemory.', srcPred: 'Notice', srcPredTxt: 'AlphaFold structures are computational predictions, not experimental structures. This viewer provides no diagnosis or medical advice.', srcUpd: 'Corrections', srcUpdTxt: 'Function, diseases and variants come from UniProt and are shown as published, without reinterpretation. To report an error or request removal of a data item, open an Issue in the project GitHub repository.', trOpt: 'Translate function text (external MyMemory service)', l_prov: 'Provenance', provLocal: 'User local file', eduSrc: 'Source', eduDis: 'Associated diseases', eduSites: 'Sites and variants (click to see in 3D)', eduClear: 'Clear highlight', copyLink: 'Copy link', copied: 'Link copied', est: '(estimated)', disclaimer: "Structures shown are models for education and research; AlphaFold ones are computational predictions, not experimental structures. This viewer provides no diagnosis or medical advice.", examples: 'Examples:', png: 'Export HD image (PNG)', tAtom: 'Atom', tChain: 'Chain', tConf: 'Confidence (pLDDT)', tB: 'B-factor', tSS: 'Structure', ssH: 'Helix', ssE: 'Sheet', ssC: 'Coil', legPl: 'pLDDT confidence', legB: 'B-factor (low → high)', legSS: 'Secondary structure', ss: 'Secondary structure', ribbon: 'Ribbon (helices and sheets)', lang: 'Language', ph: 'PDB (1UBQ) or UniProt (P69905)', load: 'Load', file: '.pdb file', color: 'Color',
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
    data: 'Dados:', srcBtn: 'Fontes e licenças', srcTitle: 'Fontes e licenças', srcIndep: 'Independência', srcIndepTxt: 'Este visualizador é independente: não é afiliado nem endossado por DeepMind, EMBL-EBI, RCSB, wwPDB ou UniProt.', srcData: 'Dados', srcDataTxt: 'São consultados ao vivo em cada provedor e não são guardados em servidor; no navegador fica apenas o idioma escolhido. Se ativar a tradução automática, o texto da função é enviado ao MyMemory.', srcPred: 'Aviso', srcPredTxt: 'As estruturas do AlphaFold são predições computacionais, não estruturas experimentais. Este visualizador não oferece diagnóstico nem aconselhamento médico.', srcUpd: 'Correções', srcUpdTxt: 'Função, doenças e variantes vêm do UniProt e são mostradas como publicadas, sem reinterpretação. Para relatar um erro ou pedir a remoção de um dado, abra uma Issue no repositório GitHub do projeto.', trOpt: 'Traduzir a função (serviço externo MyMemory)', l_prov: 'Procedência', provLocal: 'Arquivo local do usuário', eduSrc: 'Fonte', eduDis: 'Doenças associadas', eduSites: 'Sítios e variantes (clique para ver em 3D)', eduClear: 'Remover destaque', copyLink: 'Copiar link', copied: 'Link copiado', est: '(estimada)', disclaimer: "As estruturas mostradas são modelos para educação e pesquisa; as do AlphaFold são predições computacionais, não estruturas experimentais. Este visualizador não oferece diagnóstico nem aconselhamento médico.", examples: 'Exemplos:', png: 'Exportar imagem HD (PNG)', tAtom: 'Átomo', tChain: 'Cadeia', tConf: 'Confiança (pLDDT)', tB: 'Fator B', tSS: 'Estrutura', ssH: 'Hélice', ssE: 'Folha', ssC: 'Alça', legPl: 'Confiança pLDDT', legB: 'Fator B (baixo → alto)', legSS: 'Estrutura secundária', ss: 'Estrutura secundária', ribbon: 'Fita (hélices e folhas)', lang: 'Idioma', ph: 'PDB (1UBQ) ou UniProt (P69905)', load: 'Carregar', file: 'Arquivo .pdb', color: 'Cor',
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
    data: 'Données :', srcBtn: 'Sources et licences', srcTitle: 'Sources et licences', srcIndep: 'Indépendance', srcIndepTxt: 'Ce visualiseur est indépendant : il n’est ni affilié ni approuvé par DeepMind, EMBL-EBI, RCSB, wwPDB ou UniProt.', srcData: 'Données', srcDataTxt: 'Elles sont consultées en direct auprès de chaque fournisseur et non stockées sur un serveur ; seule la langue choisie reste dans votre navigateur. Si vous activez la traduction automatique, le texte de la fonction est envoyé à MyMemory.', srcPred: 'Avertissement', srcPredTxt: 'Les structures d’AlphaFold sont des prédictions informatiques, pas des structures expérimentales. Ce visualiseur ne fournit ni diagnostic ni conseil médical.', srcUpd: 'Corrections', srcUpdTxt: 'La fonction, les maladies et les variantes proviennent d’UniProt et sont affichées telles que publiées, sans réinterprétation. Pour signaler une erreur ou demander le retrait d’une donnée, ouvrez une Issue dans le dépôt GitHub du projet.', trOpt: 'Traduire la fonction (service externe MyMemory)', l_prov: 'Provenance', provLocal: 'Fichier local de l’utilisateur', eduSrc: 'Source', eduDis: 'Maladies associées', eduSites: 'Sites et variantes (cliquez pour voir en 3D)', eduClear: 'Retirer la surbrillance', copyLink: 'Copier le lien', copied: 'Lien copié', est: '(estimée)', disclaimer: "Les structures affichées sont des modèles à visée éducative et de recherche ; celles d’AlphaFold sont des prédictions informatiques, pas des structures expérimentales. Ce visualiseur ne fournit ni diagnostic ni conseil médical.", examples: 'Exemples :', png: 'Exporter l’image HD (PNG)', tAtom: 'Atome', tChain: 'Chaîne', tConf: 'Confiance (pLDDT)', tB: 'Facteur B', tSS: 'Structure', ssH: 'Hélice', ssE: 'Feuillet', ssC: 'Boucle', legPl: 'Confiance pLDDT', legB: 'Facteur B (faible → élevé)', legSS: 'Structure secondaire', ss: 'Structure secondaire', ribbon: 'Ruban (hélices et feuillets)', lang: 'Langue', ph: 'PDB (1UBQ) ou UniProt (P69905)', load: 'Charger', file: 'Fichier .pdb', color: 'Couleur',
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
