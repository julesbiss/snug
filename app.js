(() => {
const $ = (s) => document.querySelector(s);
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const num = (...v) => { for (const x of v) { if (x === null || x === undefined || x === '') continue; const n = +x; if (Number.isFinite(n)) return n; } return 0; };
const pos = (...v) => { for (const x of v) { const n = +x; if (Number.isFinite(n) && n > 0) return n; } return 0; };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const R0 = (v) => Math.round(v);

/* ================= catalogues ================= */
const FIN = [
  { id: 'chene_clair', nom: 'Chêne clair', c: '#CFA772', g: '#A87E4C', wood: 1 },
  { id: 'chene', nom: 'Chêne naturel', c: '#B98A55', g: '#8E6438', wood: 1 },
  { id: 'chene_fume', nom: 'Chêne fumé', c: '#7B5636', g: '#553A22', wood: 1 },
  { id: 'noyer', nom: 'Noyer', c: '#6E4C34', g: '#4A3020', wood: 1 },
  { id: 'pin', nom: 'Pin naturel', c: '#E3C291', g: '#C49A62', wood: 1 },
  { id: 'bouleau', nom: 'Bouleau', c: '#E9D3AE', g: '#CDB085', wood: 1 },
  { id: 'teck', nom: 'Teck', c: '#9E6B3D', g: '#734A26', wood: 1 },
  { id: 'blanc', nom: 'Blanc mat', c: '#F1EFEA' },
  { id: 'lin', nom: 'Lin', c: '#E3DACA' },
  { id: 'argile', nom: 'Gris argile', c: '#A9A39A' },
  { id: 'sauge', nom: 'Vert sauge', c: '#9BAA8F' },
  { id: 'bleu_nuit', nom: 'Bleu nuit', c: '#27334B' },
  { id: 'terracotta', nom: 'Terracotta', c: '#B5643F' },
  { id: 'noir', nom: 'Noir mat', c: '#262626' }];
const HFIN = [
  { id: 'noir', nom: 'Noir mat', c: '#1F1F1F', metal: .3, rough: .55 },
  { id: 'laiton', nom: 'Laiton', c: '#C9A24A', metal: 1, rough: .28 },
  { id: 'chrome', nom: 'Chromé', c: '#E6E8EA', metal: 1, rough: .08 },
  { id: 'inox', nom: 'Inox brossé', c: '#B9BDC1', metal: 1, rough: .38 },
  { id: 'cuivre', nom: 'Cuivre', c: '#C47A4E', metal: 1, rough: .3 },
  { id: 'blanc', nom: 'Blanc', c: '#F2F1EE', metal: 0, rough: .35 },
  { id: 'bois', nom: 'Bois', c: '#A87A4F', metal: 0, rough: .7, wood: 1 }];
const HANDLES = [
  { id: 'barre_fine', nom: 'Barre fine 128', cat: 'Barres', shape: 'bar', L: 140, r: 5, ent: 128, prix: 6 },
  { id: 'barre_tube', nom: 'Barre tube 192', cat: 'Barres', shape: 'bar', L: 204, r: 7, ent: 192, prix: 8 },
  { id: 'barre_longue', nom: 'Barre longue 320', cat: 'Barres', shape: 'bar', L: 332, r: 6, ent: 320, prix: 12 },
  { id: 'barre_plate', nom: 'Barre plate 160', cat: 'Barres', shape: 'flat', L: 172, ent: 160, prix: 9 },
  { id: 'cannelee', nom: 'Barre cannelée 160', cat: 'Barres', shape: 'bar', L: 172, r: 8, seg: 10, ent: 160, prix: 14 },
  { id: 'arc', nom: 'Poignée arc 96', cat: 'Barres', shape: 'arc', L: 110, ent: 96, prix: 7 },
  { id: 'tbar', nom: 'Poignée en T', cat: 'Barres', shape: 'tbar', ent: 0, prix: 6 },
  { id: 'bouton_rond', nom: 'Bouton rond', cat: 'Boutons', shape: 'knob', ent: 0, prix: 4 },
  { id: 'bouton_carre', nom: 'Bouton carré', cat: 'Boutons', shape: 'knobsq', ent: 0, prix: 5 },
  { id: 'champignon', nom: 'Bouton champignon', cat: 'Boutons', shape: 'mush', ent: 0, prix: 5 },
  { id: 'boule', nom: 'Bouton boule', cat: 'Boutons', shape: 'ball', ent: 0, prix: 5 },
  { id: 'bouton_bois', nom: 'Bouton bois', cat: 'Boutons', shape: 'knob', ent: 0, prix: 4 },
  { id: 'ceramique', nom: 'Bouton céramique', cat: 'Boutons', shape: 'ball', ent: 0, prix: 7 },
  { id: 'coquille', nom: 'Coquille', cat: 'Coquilles et anneaux', shape: 'shell', ent: 64, prix: 7 },
  { id: 'anneau', nom: 'Anneau', cat: 'Coquilles et anneaux', shape: 'ring', ent: 0, prix: 9 },
  { id: 'retro', nom: 'Tirette rétro', cat: 'Coquilles et anneaux', shape: 'drop', ent: 64, prix: 10 },
  { id: 'cuir', nom: 'Tirette cuir', cat: 'Coquilles et anneaux', shape: 'leather', ent: 0, prix: 9 },
  { id: 'cuvette', nom: 'Cuvette encastrée', cat: 'Intégrées', shape: 'recess', ent: 0, prix: 6 },
  { id: 'gorge', nom: 'Profil gorge alu', cat: 'Intégrées', shape: 'gorge', top: 1, ent: 0, prix: 15 },
  { id: 'prise_main', nom: 'Prise de main découpée', cat: 'Intégrées', shape: 'cut', top: 1, ent: 0, prix: 0 },
  { id: 'push', nom: 'Sans poignée (push)', cat: 'Intégrées', shape: 'none', ent: 0, prix: 8 }];
const FEET = [
  { id: 'carre_bois', nom: 'Carré bois', shape: 'square', mat: 'wood', prix: 5 },
  { id: 'fuseau', nom: 'Fuseau bois', shape: 'taper', mat: 'wood', prix: 7 },
  { id: 'compas', nom: 'Compas incliné', shape: 'splay', mat: 'wood', prix: 9 },
  { id: 'cylindre_laiton', nom: 'Cylindre laiton', shape: 'cyl', mat: 'laiton', prix: 12 },
  { id: 'metal_noir', nom: 'Métal noir fin', shape: 'thin', mat: 'noir', prix: 8 },
  { id: 'epingle', nom: 'Épingle', shape: 'hairpin', mat: 'noir', prix: 11 },
  { id: 'roulettes', nom: 'Roulettes', shape: 'caster', mat: 'noir', prix: 6 },
  { id: 'socle', nom: 'Socle en retrait', shape: 'plinth', hidden: 1, inset: 60, prix: 4 },
  { id: 'plinthe', nom: 'Plinthe affleurante', shape: 'plinth', hidden: 1, inset: 0, prix: 4 }];
const HW = {
  A: { nom: 'Vis à bois 4 × 40 mm', rech: 'vis bois 4 x 40', pack: 200, pp: 9, unit: 'boîte de 200' },
  B: { nom: 'Vis à bois 4 × 16 mm', rech: 'vis bois 4 x 16', pack: 200, pp: 7, unit: 'boîte de 200' },
  C: { nom: 'Pointes 1,6 × 20 mm pour le dos', rech: 'pointe tête plate 20 mm', pack: 250, pp: 4, unit: 'boîte de 250' },
  D: { nom: 'Charnière invisible Ø 35 mm avec embase', rech: 'charnière invisible 35 mm amortisseur', pack: 2, pp: 9, unit: 'lot de 2' },
  E: { nom: 'Équerre d’assemblage 30 mm', rech: 'équerre assemblage meuble 30 mm', pack: 10, pp: 6, unit: 'lot de 10' },
  F: { nom: 'Compas d’abattant', rech: 'compas abattant meuble', pack: 2, pp: 15, unit: 'paire' },
  G: { nom: 'Coulisses de tiroir à billes (paire)', rech: 'coulisse tiroir billes', pack: 1, pp: 14, unit: 'paire' },
  J: { nom: 'Passe-câble Ø 60 mm', rech: 'passe câble 60 mm meuble', pack: 1, pp: 4, unit: 'pièce' },
  K: { nom: 'Fixation anti-basculement', rech: 'fixation anti basculement meuble', pack: 2, pp: 6, unit: 'lot de 2' },
  P: { nom: 'Patins feutre adhésifs', rech: 'patin feutre adhésif', pack: 16, pp: 4, unit: 'lot de 16' },
  V: { nom: 'Vis de jonction de caissons', rech: 'vis de jonction meuble', pack: 10, pp: 5, unit: 'lot de 10' },
  T: { nom: 'Tringle de penderie ovale 1,5 m avec 2 supports', rech: 'tringle penderie ovale 150 cm supports', pack: 1, pp: 15, unit: 'kit' },
  W: { nom: 'Vérin de réglage pour plinthe', rech: 'vérin réglable meuble plinthe', pack: 4, pp: 8, unit: 'lot de 4' }};
const finById = (id) => FIN.find((f) => f.id === id) || FIN[4];
const hfinById = (id) => HFIN.find((f) => f.id === id) || HFIN[0];
const handleById = (id) => HANDLES.find((h) => h.id === id) || HANDLES[0];
const feetById = (id) => FEET.find((f) => f.id === id) || FEET[0];
const PROJECTS = [['tv', 'Meuble TV', 'Bas, multimédia', 'M4 30h40v8H4z M8 38v3 M40 38v3 M12 8h24v15H12z M20 23v7 M28 23v7'],
  ['dressing', 'Dressing', 'Penderie, tiroirs', 'M24 9a3 3 0 1 1 3 3l-3 2 M24 14L6 25h36z M10 31h28 M10 36h28'],
  ['biblio', 'Bibliothèque', 'Étagères, niches', 'M8 6v36 M40 6v36 M8 17h32 M8 29h32 M8 41h32 M13 17V9 M17 17V10 M21 17V8 M30 29v-8l4 1v7'],
  ['escalier', 'Sous escalier', 'Placard, tiroirs', 'M6 42h36V8 M6 42v-8h9v-8h9v-8h9v-8h9 M14 42V34'],
  ['bureau', 'Bureau', 'Plan + rangements', 'M4 18h40 M8 18v22 M40 18v22 M28 18v22 M28 26h12 M28 33h12 M18 8h8v10'],
  ['autre', 'Autre projet', 'Étagères, tiroirs, placard', 'M8 8h32v32H8z M8 24h32 M24 8v32 M14 30h4 M30 30h4']];
const ICON = (d, s = 28) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const HANGER = 'M24 8a3 3 0 1 1 3 3l-3 2 M24 13L8 22h32z';
const ITEM_ICONS = {
  tv: 'M6 10h36v24H6z M18 40h12 M24 34v6', platine: 'M6 12h36v26H6z M11 25a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M18.5 25a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0 M36 16v14l-6 4',
  box: 'M8 18h32v12H8z M13 24h.01 M18 24h.01 M28 24h7 M30 18l3-6', ampli: 'M5 16h38v16H5z M10 24a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M30 24a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M21 22h6 M21 26h6',
  console: 'M12 16h24a8 8 0 0 1 8 8v2a6 6 0 0 1-11 3l-2-3H17l-2 3a6 6 0 0 1-11-3v-2a8 8 0 0 1 8-8z M14 21v6 M11 24h6 M33 23h.01 M36 26h.01',
  enceinte: 'M14 6h20v36H14z M18 30a6 6 0 1 0 12 0a6 6 0 1 0 -12 0 M21 15a3 3 0 1 0 6 0a3 3 0 1 0 -6 0', vinyles: 'M10 20h28v20H10z M16 20a8 8 0 0 1 16 0 M10 28h28',
  livres: 'M8 40V10h6v30 M14 40V14h6v26 M22 40l4-28 6 1-4 28z M6 40h36', poches: 'M10 40V20h5v20 M15 40V22h5v18 M20 40V18h5v22 M28 40l3-16 4 1-3 15z M6 40h36',
  beaux: 'M6 30h36v10H6z M9 21h30v9H9z M12 13h24v8H12z', deco: 'M16 30h16l-2 10H18z M24 30V18 M24 22c-6 0-9-4-9-9 6 0 9 4 9 9z M24 18c4 0 7-3 7-7-4 0-7 3-7 7z',
  tiroirs: 'M6 14h36v20H6z M18 24h12 M8 34v4 M40 34v4', caisses: 'M6 16h36v22H6z M6 24h36 M6 31h36 M18 20h12',
  ferme: 'M10 6h28v36H10z M24 6v36 M20 22v4 M28 22v4', linge: 'M8 32h32v8H8z M8 24h32v8H8z M8 16h32v8H8z M33 16v24',
  penderie_l: HANGER + ' M14 22v20h20V22', penderie_c: HANGER + ' M14 22v11h20V22', penderie: HANGER + ' M14 22v11h20V22', manteaux: HANGER + ' M14 22v20h20V22 M24 22v20',
  pulls: 'M8 31h32v8H8z M10 23h28v8H10z M12 15h24v8H12z', chaussures: 'M6 28h14l6-4 8 2 8 4v8H6z M6 34h36', valises: 'M10 16h28v24H10z M18 16v-6h12v6 M18 22v12 M30 22v12',
  aspirateur: 'M30 6v28 M30 34l-14 6h20v-6z M26 10h8v10h-8z', balais: 'M24 6v22 M16 28h16l4 12H12z M20 34v6 M28 34v6',
  etageres: 'M8 8v32 M40 8v32 M8 18h32 M8 30h32 M8 40h32', classeurs: 'M8 14h14l4 4h14v22H8z M8 22h32', imprimante: 'M14 8h20v10H14z M8 18h32v14H8z M14 28h20v12H14z M34 23h.01' };
const FABS = [['standard','Tout faits','Caissons du commerce, presque pas de découpe'],['mixte','Mixte','Caissons du commerce + plateau sur mesure'],['sur_mesure','Sur mesure','Panneaux découpés aux cotes exactes']];
const LEVELS = [['debutant','Débutant','Je monte un meuble en kit'],['bricoleur','Bricoleur','Je perce et je fixe'],['expert','Expert','Je découpe moi-même']];
const TOOLS = ['Visseuse','Perceuse','Niveau','Scie sauteuse','Scie circulaire','Ponceuse','Défonceuse'];
const SHOPS = ['IKEA','Leroy Merlin','Castorama','But','Autoriser le mélange'];
const VARIANTS = [
  { nom: 'Économique', desc: "le moins cher possible : un maximum d'éléments standard, peu ou pas de découpe" },
  { nom: 'Équilibrée', desc: 'le meilleur compromis entre prix, rangement et finitions' },
  { nom: 'Optimale', desc: "l'espace exploité au centimètre, plus de sur-mesure et de beaux matériaux" }];
const TYPES = ['ouvert', 'porte', 'tiroir', 'caisse', 'abattant'];
const DEFZ = { x: .1, y: .42, w: .8, h: .4, A: 2450, B: 620, C: 440, D: 0 };
const STORE_KEY = 'atelier.projets.v1';

const S = {
  step: 0, photo: null, photoData: null, example: true, project: 'tv', fab: 'mixte',
  zones: [], sel: 0, redraw: null,
  level: 'bricoleur', tools: new Set(['Visseuse', 'Perceuse', 'Niveau']), shops: new Set(['IKEA', 'Leroy Merlin', 'Castorama', 'Autoriser le mélange']),
  result: [null, null, null], custom: [null, null, null], active: -1, genZones: null, itemsBy: {}, customBy: {}, ambiance: 'bois', drawMode: false, selCell: null,
  view: '3d', hcat: 'Toutes',
  hits: [], keys2d: [], anim2d: false, pane: 'modele', ntab: 'steps', nstep: 0, notice: null, projId: null, projName: '' };

/* ================= textures and lighting ================= */
const TEX = {}, DURL = {};
function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hexRGB(h) { const n = parseInt(String(h).replace('#', ''), 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function periodicNoise(seed) {
  const r = rng(seed), a = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  const P = new Uint8Array(512); for (let i = 0; i < 512; i++) P[i] = a[i & 255];
  const V = new Float32Array(256); for (let i = 0; i < 256; i++) V[i] = r();
  const lat = (i, j, px, py) => { i = ((i % px) + px) % px; j = ((j % py) + py) % py; return V[P[(i & 255) + P[j & 255]]]; };
  const n = (x, y, px, py) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, sx = xf * xf * (3 - 2 * xf), sy = yf * yf * (3 - 2 * yf);
    const a0 = lat(xi, yi, px, py), a1 = lat(xi + 1, yi, px, py), b0 = lat(xi, yi + 1, px, py), b1 = lat(xi + 1, yi + 1, px, py);
    const top = a0 + (a1 - a0) * sx, bot = b0 + (b1 - b0) * sx; return top + (bot - top) * sy;
  };
  return (x, y, px, py, oct) => { let s = 0, amp = .5, f = 1, norm = 0; for (let o = 0; o < oct; o++) { s += amp * n(x * f, y * f, px * f, py * f); norm += amp; amp *= .5; f *= 2; } return s / norm; };
}
/* Tileable wood: long fibres along u, growth rings warped by noise, slow colour drift; paint: fine roller texture */
function woodPixel(fb, u, v, A, B, tint) {
  // Real oak: a broad cathedral figure (rings slowly crossing the board, strongly warped along the length),
  // low contrast, plus fine straight pores. The old version drew tight parallel stripes, which read as "3D".
  const warp = fb(u * 1, v * 2, 1, 2, 3), low = fb(u, v, 1, 1, 2), fib = fb(u * 8, v * 128, 8, 128, 2), pores = fb(u * 4, v * 256, 4, 256, 1);
  const ring = Math.sin(2 * Math.PI * (v * 6 + warp * 2.2 + (u - .5) * (u - .5) * 1.5)), band = Math.pow(.5 + .5 * ring, 2.5);
  const t = clamp(band * .22 + (low - .5) * .35 + (fib - .5) * .18 + (pores - .5) * .08 + .3, 0, 1), lum = (1 + (low - .5) * .08 - (pores > .72 ? .05 : 0)) * (tint || 1);
  return [(A[0] + (B[0] - A[0]) * t) * lum, (A[1] + (B[1] - A[1]) * t) * lum, (A[2] + (B[2] - A[2]) * t) * lum];
}
function texCanvas(f, size) {
  const N = size || 512, key = f.id + '|' + N; if (TEX[key]) return TEX[key];
  const c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); const img = g.createImageData(N, N), d = img.data;
  const fb = periodicNoise(hashStr(f.id)), A = hexRGB(f.c), B = hexRGB(f.g || f.c);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = x / N, v = y / N, i = (y * N + x) * 4;
    let col;
    if (f.wood) col = woodPixel(fb, u, v, A, B);
    else { const nn = fb(u * 6, v * 6, 6, 6, 3), sp = fb(u * 64, v * 64, 64, 64, 1), lum = 1 + (nn - .5) * .07 + (sp - .5) * .05; col = [A[0] * lum, A[1] * lum, A[2] * lum]; }
    d[i] = clamp(col[0], 0, 255); d[i + 1] = clamp(col[1], 0, 255); d[i + 2] = clamp(col[2], 0, 255); d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0); TEX[key] = c; return c;
}
function parquetCanvas() {
  if (TEX._parquet) return TEX._parquet;
  const N = 512, rows = 6, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); const img = g.createImageData(N, N), d = img.data;
  const fb = periodicNoise(77), A = hexRGB('#B88F63'), B = hexRGB('#87603C'), rh = N / rows;
  for (let y = 0; y < N; y++) {
    const row = Math.floor(y / rh), off = ((row * 0.37) % 1) * N, vy = (y % rh) / rh;
    for (let x = 0; x < N; x++) {
      const xx = (x + off) % N, plank = Math.floor(xx / (N / 2)), seed = (row * 7 + plank * 13) % 17, tint = .9 + (seed / 17) * .2;
      const col = woodPixel(fb, x / N, ((row + vy * .9) / rows + seed * .031) % 1, A, B, tint);
      const joint = (y % rh) < 1.2 || (xx % (N / 2)) < 1.2 ? .55 : 1, i = (y * N + x) * 4;
      d[i] = clamp(col[0] * joint, 0, 255); d[i + 1] = clamp(col[1] * joint, 0, 255); d[i + 2] = clamp(col[2] * joint, 0, 255); d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0); TEX._parquet = c; return c;
}
function plasterCanvas() {
  if (TEX._plaster) return TEX._plaster;
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); const img = g.createImageData(N, N), d = img.data; const fb = periodicNoise(91), A = hexRGB('#ECE7DF');
  for (let i = 0, y = 0; y < N; y++) for (let x = 0; x < N; x++, i += 4) { const l = 1 + (fb(x / N * 4, y / N * 4, 4, 4, 4) - .5) * .06; d[i] = A[0] * l; d[i + 1] = A[1] * l; d[i + 2] = A[2] * l; d[i + 3] = 255; }
  g.putImageData(img, 0, 0); TEX._plaster = c; return c;
}
function contactCanvas() {
  if (TEX._contact) return TEX._contact;
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(.6, 'rgba(0,0,0,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); TEX._contact = c; return c;
}
function texURL(f) { return DURL[f.id] || (DURL[f.id] = texCanvas(f, 128).toDataURL('image/jpeg', .85)); }
function shade(hex, f) { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); const n = m ? parseInt(m[1], 16) : 0xC8A273; const k = (v) => clamp(Math.round(v * f), 0, 255); return `rgb(${k((n >> 16) & 255)},${k((n >> 8) & 255)},${k(n & 255)})`; }
function envCanvas() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(.42, '#ECE7DF'); gr.addColorStop(.55, '#B6A795'); gr.addColorStop(1, '#4E4339');
  g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  g.fillStyle = '#FFFFFF'; g.fillRect(48, 38, 80, 62); g.fillRect(300, 26, 120, 72); g.fillStyle = '#FFF4E2'; g.fillRect(200, 8, 50, 20);
  return c;
}
function makeEnv(renderer) {
  // A small photo studio rendered once into the reflection map: bright softboxes on a grey room. Unlike a flat
  // gradient it carries real highlights (values above white), which is what makes varnish, paint and metal read as real.
  try {
    const sc = new THREE.Scene(), geo = new THREE.BoxGeometry(1, 1, 1);
    const box = (w, h, d, x, y, z, c, k, side) => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(c).convertSRGBToLinear().multiplyScalar(k), side: side || THREE.FrontSide })); m.scale.set(w, h, d); m.position.set(x, y, z); sc.add(m); return m; };
    box(12, 6, 12, 0, 2.5, 0, '#BDB7AF', 1, THREE.BackSide);
    box(12, .1, 12, 0, -.45, 0, '#8E8172', 1);
    box(5.5, .05, 4.5, 0, 5.4, 1.2, '#FFFFFF', 11);
    box(.05, 3.2, 4.5, -5.9, 2.6, 1.8, '#FFF0DC', 8);
    box(.05, 2.2, 3, 5.9, 2.2, 1, '#DCE6FF', 2.2);
    box(5, 3, .05, 0, 2.6, 5.9, '#FFFFFF', 2.6);
    const pm = new THREE.PMREMGenerator(renderer), rt = pm.fromScene(sc, .035, .1, 40); pm.dispose(); geo.dispose(); sc.traverse((o) => { if (o.material) o.material.dispose(); });
    return rt.texture;
  } catch {
    try { const tex = new THREE.CanvasTexture(envCanvas()); tex.mapping = THREE.EquirectangularReflectionMapping; tex.encoding = THREE.sRGBEncoding;
      const pm = new THREE.PMREMGenerator(renderer); const rt = pm.fromEquirectangular(tex); pm.dispose(); tex.dispose(); return rt.texture; } catch { return null; }
  }
}
/* Soft darkening where panels meet (inside a case, the light never reaches the corners): the cue the eye uses most to tell a real object from a drawing */
function aoCanvas() {
  if (TEX._ao) return TEX._ao;
  const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), img = g.createImageData(N, N), d = img.data;
  for (let y = 0, i = 0; y < N; y++) for (let x = 0; x < N; x++, i += 4) {
    const u = x / (N - 1), v = y / (N - 1), e = Math.min(u, 1 - u, v * 1.25, (1 - v) * .8), t = clamp(e / .3, 0, 1), sm = t * t * (3 - 2 * t);
    d[i] = 26; d[i + 1] = 18; d[i + 2] = 12; d[i + 3] = 255 * (.05 + .4 * (1 - sm));
  }
  g.putImageData(img, 0, 0); TEX._ao = c; return c;
}

/* ================= example photo ================= */
function examplePhoto() {
  // No photo yet: a quiet, empty wall to draw on (no fake objects).
  const c = document.createElement('canvas'); c.width = 1200; c.height = 840; const g = c.getContext('2d');
  const wall = g.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#E9E5DE'); wall.addColorStop(1, '#DDD8CF'); g.fillStyle = wall; g.fillRect(0, 0, 1200, 660);
  const fl = g.createLinearGradient(0, 660, 0, 840); fl.addColorStop(0, '#C9B9A2'); fl.addColorStop(1, '#B7A58C'); g.fillStyle = fl; g.fillRect(0, 660, 1200, 180);
  g.fillStyle = '#F4F1EC'; g.fillRect(0, 648, 1200, 14);
  g.strokeStyle = 'rgba(0,0,0,.06)'; g.lineWidth = 2; for (let x = -200; x < 1400; x += 150) { g.beginPath(); g.moveTo(x, 662); g.lineTo(x - 90, 840); g.stroke(); }
  const img = new Image(); img.src = c.toDataURL('image/jpeg', .9); return img;
}

/* ================= canvas helpers ================= */
function fitCanvas(cv) {
  const img = S.photo; if (!img || !img.naturalWidth) return;
  const W = 1000, H = Math.round(W * img.naturalHeight / img.naturalWidth);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
}
function photoCache(W, H) { // the photo, once, at the size of the canvas: redrawing a 12-megapixel image at every finger move is what made dragging stutter
  const c = S._pc; if (c && c.img === S.photo && c.W === W && c.H === H) return c.cv;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; cv.getContext('2d').drawImage(S.photo, 0, 0, W, H); S._pc = { img: S.photo, W, H, cv }; return cv;
}
function drawPhoto(cv) {
  fitCanvas(cv); const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height);
  if (S.photo && S.photo.naturalWidth) g.drawImage(photoCache(cv.width, cv.height), 0, 0);
  return g;
}
function rr(g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
function head(g, x1, y1, x2, y2, s) { const a = Math.atan2(y2 - y1, x2 - x1); g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - s * Math.cos(a - .45), y2 - s * Math.sin(a - .45)); g.lineTo(x2 - s * Math.cos(a + .45), y2 - s * Math.sin(a + .45)); g.closePath(); g.fill(); }
function arrow(g, x1, y1, x2, y2, s) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); head(g, x1, y1, x2, y2, s); head(g, x2, y2, x1, y1, s); }
function badge(g, x, y, t, r) {
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = '#0E0F11'; g.fill(); g.lineWidth = r * .16; g.strokeStyle = '#E9B26B'; g.stroke();
  g.fillStyle = '#E9B26B'; g.font = `700 ${Math.round(r * 1.05)}px "Geist", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x, y + r * .06); g.restore();
}
/* Zones on the photo: the selected one has round handles in its corners and labelled dimensions that can be tapped. */
const fmtMM = (v) => (pos(v) ? R0(pos(v)).toLocaleString('fr-FR') : '?');
function pill(g, x, y, txt, k, strong) {
  g.font = `700 ${Math.round(12.5 * k)}px "Geist", system-ui, sans-serif`;
  const w = g.measureText(txt).width + 16 * k, h = 24 * k;
  g.fillStyle = strong ? '#E9B26B' : 'rgba(14,15,17,.85)'; rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fill();
  if (!strong) { g.strokeStyle = '#E9B26B'; g.lineWidth = 1.2 * k; g.stroke(); }
  g.fillStyle = strong ? '#17130C' : '#F2F1EE'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, x, y + .5 * k);
  return { x: x - w / 2, y: y - h / 2, w, h };
}
/* ================= zones in perspective =================
   A zone is the rectangle of wall the furniture stands against, as seen in the photo: 4 free corners
   (z.q, normalised, top-left → top-right → bottom-right → bottom-left) plus a depth pulled toward the viewer.
   From the shape of that rectangle SNUG recovers the camera (focal length, position), hence the real
   proportions of the space: one typed measure gives the two others, and the furniture is later rendered
   in the photo with the very same camera. z.x/z.y/z.w/z.h stay the bounding box of the 4 corners. */
const R10 = (v) => Math.round(v / 10) * 10;
function zq(z) { return z.q || (z.q = [[z.x, z.y], [z.x + z.w, z.y], [z.x + z.w, z.y + z.h], [z.x, z.y + z.h]]); }
function zBox(z) { const q = zq(z), xs = q.map((p) => p[0]), ys = q.map((p) => p[1]); z.x = Math.min(...xs); z.y = Math.min(...ys); z.w = Math.max(...xs) - z.x; z.h = Math.max(...ys) - z.y; }
function zMan(z) { return z.man || (z.man = { A: !!pos(z.A), B: !!pos(z.B), C: !!pos(z.C) }); }
function zDepth(z) { const m = zMan(z); return m.C && pos(z.C) && pos(z.A) ? clamp(pos(z.C) / pos(z.A), .02, 3) : (z.dr || (z.dr = pos(z.C) && pos(z.A) ? pos(z.C) / pos(z.A) : .22)); }
function zonePose(z, W, H, fForce) {
  const [p0, p1, p2, p3] = zq(z).map(([x, y]) => [x * W - W / 2, y * H - H / 2]);
  // homography of the unit square onto the 4 corners (Heckbert)
  const dx1 = p1[0] - p2[0], dx2 = p3[0] - p2[0], sx = p0[0] - p1[0] + p2[0] - p3[0];
  const dy1 = p1[1] - p2[1], dy2 = p3[1] - p2[1], sy = p0[1] - p1[1] + p2[1] - p3[1];
  const den = dx1 * dy2 - dx2 * dy1 || 1e-9, g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
  const a = p1[0] - p0[0] + g * p1[0], b = p3[0] - p0[0] + h * p3[0], c = p0[0];
  const d = p1[1] - p0[1] + g * p1[1], e = p3[1] - p0[1] + h * p3[1], f0 = p0[1];
  const long = Math.max(W, H); let f = fForce || (long / 2) / Math.tan(34.5 * Math.PI / 180);
  // both directions of the rectangle converge: they are perpendicular in reality, which gives the focal length
  if (!fForce && Math.abs(g) * long > .05 && Math.abs(h) * long > .05) { const f2 = -(a * b + d * e) / (g * h); if (f2 > 0) f = clamp(Math.sqrt(f2), long * .62, long * .98); }
  const n1 = [a / f, d / f, g], n2 = [b / f, e / f, h], l1 = Math.hypot(...n1) || 1e-9, l2 = Math.hypot(...n2) || 1e-9;
  const r1 = n1.map((v) => v / l1); let r2 = n2.map((v) => v / l2); const dt = r1[0] * r2[0] + r1[1] * r2[1] + r1[2] * r2[2];
  r2 = r2.map((v, i) => v - dt * r1[i]); const l = Math.hypot(...r2) || 1e-9; r2 = r2.map((v) => v / l);
  const r3 = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]];
  // o: top-left corner, r1: along the width, r2: downward, r3: into the wall — camera axes (x right, y down, z forward), in units of the width A
  return { f, ratio: clamp(l2 / l1, .02, 50), o: [c / f / l1, f0 / f / l1, 1 / l1], r1, r2, r3, W, H };
}
// point of the box: s along the width (0..1), t down the height (0..1), c toward the viewer (in widths) → canvas pixel
function zonePt(P, s, t, c) {
  const X = P.o[0] + s * P.r1[0] + t * P.ratio * P.r2[0] - c * P.r3[0], Y = P.o[1] + s * P.r1[1] + t * P.ratio * P.r2[1] - c * P.r3[1], Z = Math.max(1e-4, P.o[2] + s * P.r1[2] + t * P.ratio * P.r2[2] - c * P.r3[2]);
  return [P.W / 2 + P.f * X / Z, P.H / 2 + P.f * Y / Z];
}
function zone3(P, s, t, c) { return [0, 1, 2].map((i) => P.o[i] + s * P.r1[i] + t * P.ratio * P.r2[i] - c * P.r3[i]); }
// one typed measure is enough: the others follow from the photo (and stay editable)
function zoneAuto(z) {
  const cv = $('#cv1'), P = zonePose(z, cv.width, cv.height), m = zMan(z), dr = zDepth(z);
  const A = m.A && pos(z.A), B = m.B && pos(z.B), C = m.C && pos(z.C), base = A || (B ? B / P.ratio : 0) || (C ? C / dr : 0);
  if (!base) { ['A', 'B', 'C'].forEach((k) => { if (!m[k]) z[k] = ''; }); return; }
  if (!m.A) z.A = R10(base); if (!m.B) z.B = R10(base * P.ratio); if (!m.C) z.C = R10(base * dr);
}
function syncZoneInputs(i) {
  const z = S.zones[i]; if (!z) return; const m = zMan(z);
  ['A', 'B', 'C'].forEach((k) => { const inp = $(`#z${i}${k}`); if (!inp) return; if (document.activeElement !== inp) inp.value = z[k]; const auto = !m[k] && pos(z[k]); inp.closest('.cote').classList.toggle('auto', !!auto); });
}
function drawZonesOn(g, W, H, zones, sel, full, k) {
  k = k || 1; const hits = []; const GOLD = '#E9B26B';
  const path = (pts) => { g.beginPath(); pts.forEach(([a, b], j) => (j ? g.lineTo(a, b) : g.moveTo(a, b))); g.closePath(); };
  zones.forEach((z, i) => {
    const on = !full && i === sel, P = zonePose(z, W, H), dr = zDepth(z), m = zMan(z);
    const B4 = [[0, 0], [1, 0], [1, 1], [0, 1]], bk = B4.map(([s, t]) => zonePt(P, s, t, 0)), fr = B4.map(([s, t]) => zonePt(P, s, t, dr));
    g.save(); g.lineJoin = 'round';
    // The furniture as a solid, translucent block standing against the wall: only the faces turned toward
    // the camera are painted (top lighter, sides darker), hidden edges stay thin and dashed.
    const c3 = (pts) => pts.reduce((a, [s, t, c]) => { const v = zone3(P, s, t, c); return [a[0] + v[0] / 4, a[1] + v[1] / 4, a[2] + v[2] / 4]; }, [0, 0, 0]);
    const F = (n, sign, st3, pts, tone) => { const ctr = c3(st3); return { vis: sign * (n[0] * ctr[0] + n[1] * ctr[1] + n[2] * ctr[2]) < 0, pts, tone }; };
    const q3 = (c) => B4.map(([s, t]) => [s, t, c]);
    const faces = [
      F(P.r2, 1, [[0, 1, 0], [1, 1, 0], [1, 1, dr], [0, 1, dr]], [bk[3], bk[2], fr[2], fr[3]], 'rgba(120,80,35,A)'),
      F(P.r1, -1, [[0, 0, 0], [0, 1, 0], [0, 1, dr], [0, 0, dr]], [bk[0], bk[3], fr[3], fr[0]], 'rgba(196,140,72,A)'),
      F(P.r1, 1, [[1, 0, 0], [1, 1, 0], [1, 1, dr], [1, 0, dr]], [bk[1], bk[2], fr[2], fr[1]], 'rgba(196,140,72,A)'),
      F(P.r2, -1, [[0, 0, 0], [1, 0, 0], [1, 0, dr], [0, 0, dr]], [bk[0], bk[1], fr[1], fr[0]], 'rgba(255,222,170,A)'),
      F(P.r3, -1, q3(dr), fr, 'rgba(233,178,107,A)')];
    const al = on ? 1 : .6;
    path([bk[3], bk[2], fr[2], fr[3]]); g.fillStyle = `rgba(0,0,0,${.2 * al})`; g.fill(); // where it stands on the floor
    g.setLineDash([5 * k, 5 * k]); g.strokeStyle = `rgba(233,178,107,${.55 * al})`; g.lineWidth = 1.1 * k;
    path(bk); g.stroke(); path(fr); g.stroke(); bk.forEach((pt, j) => { g.beginPath(); g.moveTo(...pt); g.lineTo(...fr[j]); g.stroke(); }); g.setLineDash([]);
    faces.filter((f) => f.vis).forEach((f, j) => { path(f.pts); g.fillStyle = f.tone.replace('A', String((f.tone.includes('255,222') ? .5 : f.tone.includes('196,') ? .46 : .34) * al)); g.fill(); g.strokeStyle = on ? GOLD : 'rgba(233,178,107,.8)'; g.lineWidth = (on ? 2 : 1.4) * k; g.stroke(); });
    // number
    const r = 10 * k, nx = (fr[0][0] * 3 + fr[2][0]) / 4, ny = (fr[0][1] * 3 + fr[2][1]) / 4;
    g.fillStyle = on ? GOLD : 'rgba(233,178,107,.85)'; g.beginPath(); g.arc(nx, ny, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#17130C'; g.font = `700 ${Math.round(12 * k)}px "Geist", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(i + 1), nx, ny + .5 * k);
    if (on) {
      // the 4 corners on the wall
      bk.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 9 * k, 0, Math.PI * 2); g.fillStyle = 'rgba(14,15,17,.75)'; g.fill(); g.strokeStyle = GOLD; g.lineWidth = 2.4 * k; g.stroke(); g.beginPath(); g.arc(x, y, 2.6 * k, 0, Math.PI * 2); g.fillStyle = GOLD; g.fill(); });
      // depth handle: the front corner that sits best inside the photo
      const inside = ([x, y]) => x > 24 * k && x < W - 24 * k && y > 24 * k && y < H - 24 * k;
      const hi = [3, 2, 0, 1].find((j) => inside(fr[j])); const hj = hi === undefined ? 3 : hi, hp = [clamp(fr[hj][0], 16 * k, W - 16 * k), clamp(fr[hj][1], 16 * k, H - 16 * k)];
      z._dh = { j: hj, x: hp[0], y: hp[1] };
      g.beginPath(); g.arc(hp[0], hp[1], 11 * k, 0, Math.PI * 2); g.fillStyle = GOLD; g.fill(); g.strokeStyle = '#17130C'; g.lineWidth = 2 * k;
      const ux = hp[0] - bk[hj][0], uy = hp[1] - bk[hj][1], ul = Math.hypot(ux, uy) || 1, ax = ux / ul * 5 * k, ay = uy / ul * 5 * k;
      g.beginPath(); g.moveTo(hp[0] - ax, hp[1] - ay); g.lineTo(hp[0] + ax, hp[1] + ay); g.moveTo(hp[0] + ax - ay * .7 - ax * .6, hp[1] + ay + ax * .7 - ay * .6); g.lineTo(hp[0] + ax, hp[1] + ay); g.lineTo(hp[0] + ax + ay * .7 - ax * .6, hp[1] + ay - ax * .7 - ay * .6); g.stroke();
      // measures: A under the front, B beside it, C along the depth
      const lbl = (key) => `${key}  ${!m[key] && pos(z[key]) ? '≈ ' : ''}${fmtMM(z[key])}`, mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const pa = mid(fr[3], fr[2]), pb = mid(fr[1], fr[2]), oj = hj === 3 ? 2 : hj === 2 ? 3 : hj === 0 ? 1 : 0, pc = mid(bk[oj], fr[oj]);
      // labels step aside from the corners, the handle and each other
      const busy = [...bk.map(([x, y]) => ({ x: x - 16 * k, y: y - 16 * k, w: 32 * k, h: 32 * k })), { x: hp[0] - 18 * k, y: hp[1] - 18 * k, w: 36 * k, h: 36 * k }];
      const put = (key, x, y, txt, strong, dirY) => {
        g.font = `700 ${Math.round(12.5 * k)}px "Geist", system-ui, sans-serif`; const w = g.measureText(txt).width + 16 * k, h = 24 * k;
        x = clamp(x, w / 2 + 4 * k, W - w / 2 - 4 * k); y = clamp(y, h / 2 + 4 * k, H - h / 2 - 4 * k);
        for (let n = 0; n < 8 && busy.some((r) => x - w / 2 < r.x + r.w && x + w / 2 > r.x && y - h / 2 < r.y + r.h && y + h / 2 > r.y); n++) y = clamp(y + dirY * 14 * k, h / 2 + 4 * k, H - h / 2 - 4 * k);
        const r = pill(g, x, y, txt, k, strong); busy.push(r); hits.push({ zone: i, key, r });
      };
      put('A', pa[0], pa[1] + 22 * k, lbl('A'), !pos(z.A), 1);
      put('B', pb[0] + (fr[1][0] >= fr[0][0] ? 1 : -1) * 34 * k, pb[1], lbl('B'), !pos(z.B), -1);
      put('C', pc[0], pc[1], lbl('C'), !pos(z.C), -1);
      const topY = Math.min(bk[0][1], bk[1][1], fr[0][1], fr[1][1]), cxm = (bk[0][0] + bk[1][0]) / 2;
      put('del', cxm, topY - 24 * k > 16 * k ? topY - 24 * k : Math.max(bk[2][1], fr[2][1]) - 44 * k, '✕  Supprimer', false, -1);
    }
    g.restore();
  });
  return hits;
}
function drawCotes() {
  const cv = $('#cv1'); const g = drawPhoto(cv); const W = cv.width, H = cv.height, k = W / Math.max(200, cv.clientWidth || 360);
  S.zoneLabels = drawZonesOn(g, W, H, S.zones, S.sel, false, k) || [];
  const d = S.drawRect;
  if (d) { g.save(); g.fillStyle = 'rgba(233,178,107,.14)'; g.strokeStyle = '#E9B26B'; g.lineWidth = 2 * k; g.setLineDash([7 * k, 5 * k]); const x = Math.min(d.x0, d.x1) * W, y = Math.min(d.y0, d.y1) * H, w = Math.abs(d.x1 - d.x0) * W, h = Math.abs(d.y1 - d.y0) * H; g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h); g.restore(); }
  const lp = S.loupe;
  if (lp && S.photo && S.photo.naturalWidth) { // magnifier above the finger, to land a corner precisely
    const R = Math.min(64 * k, H * .24), Z = 2.4, px = lp.x * W, py = lp.y * H, cx = px < W / 2 ? W - R - 8 * k : R + 8 * k, cy = py < H / 2 ? H - R - 8 * k : R + 8 * k; // in the opposite corner of the photo, never under the finger
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
    g.fillStyle = '#0E0F11'; g.fillRect(cx - R, cy - R, R * 2, R * 2);
    { const nw = S.photo.naturalWidth, nh = S.photo.naturalHeight, hw2 = R / Z; g.drawImage(S.photo, (px - hw2) / W * nw, (py - hw2) / H * nh, 2 * hw2 / W * nw, 2 * hw2 / H * nh, cx - R, cy - R, 2 * R, 2 * R); }
    g.translate(cx, cy); g.scale(Z, Z); g.translate(-px, -py);
    const z = S.zones[S.sel]; if (z) { g.strokeStyle = '#E9B26B'; g.lineWidth = 1.4 * k / Z; g.beginPath(); zq(z).forEach(([a, b], j) => (j ? g.lineTo(a * W, b * H) : g.moveTo(a * W, b * H))); g.closePath(); g.stroke(); }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.restore(); g.save();
    g.strokeStyle = '#E9B26B'; g.lineWidth = 3 * k; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.2 * k; g.beginPath(); g.moveTo(cx - 12 * k, cy); g.lineTo(cx - 3 * k, cy); g.moveTo(cx + 3 * k, cy); g.lineTo(cx + 12 * k, cy); g.moveTo(cx, cy - 12 * k); g.lineTo(cx, cy - 3 * k); g.moveTo(cx, cy + 3 * k); g.lineTo(cx, cy + 12 * k); g.stroke(); g.restore();
  }
}

/* ================= zones ================= */
// "Dessiner" arms the photo: one diagonal stroke of the finger creates the zone. Then each corner moves freely
// (with a magnifier), the round handle pulls the depth, and the whole box moves when dragged by its middle.
function setDrawing(on) {
  S.drawing = !!on; S.drawRect = null;
  $('.zphoto').classList.toggle('drawing', S.drawing); $('#drawBanner').hidden = !S.drawing; $('#drawStart').hidden = S.drawing || S.zones.length > 0;
  if (S.drawing) $('.zphoto').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
(function () {
  const cv = $('#cv1'); let act = null, raf = 0, rafCb = null;
  const queueDraw = (cb) => { if (cb) rafCb = cb; if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (rafCb) { rafCb(); rafCb = null; } drawCotes(); }); }; // one redraw per screen frame, however fast the finger moves
  const pt = (cx, cy) => { const r = cv.getBoundingClientRect(); return { x: clamp((cx - r.left) / r.width, 0, 1), y: clamp((cy - r.top) / r.height, 0, 1), sx: cv.width / r.width, rx: cx - r.left, ry: cy - r.top }; };
  const inPoly = (x, y, q) => { let c = false; for (let i = 0, j = q.length - 1; i < q.length; j = i++) if ((q[i][1] > y) !== (q[j][1] > y) && x < (q[j][0] - q[i][0]) * (y - q[i][1]) / (q[j][1] - q[i][1]) + q[i][0]) c = !c; return c; };
  function hitTest(cx, cy) {
    const p = pt(cx, cy), k = p.sx, X = p.rx * k, Y = p.ry * k, W = cv.width, H = cv.height;
    const z = S.zones[S.sel];
    if (z) { // corners first: they must stay reachable even under a label
      const q = zq(z); let best = -1, bd = 24 * k;
      q.forEach(([a, b], j) => { const d = Math.hypot(X - a * W, Y - b * H); if (d < bd) { bd = d; best = j; } });
      if (best >= 0) return { type: 'corner', c: best, i: S.sel };
      if (z._dh && Math.hypot(X - z._dh.x, Y - z._dh.y) < 24 * k) return { type: 'depth', i: S.sel };
    }
    for (const l of S.zoneLabels || []) if (X >= l.r.x - 4 * k && X <= l.r.x + l.r.w + 4 * k && Y >= l.r.y - 6 * k && Y <= l.r.y + l.r.h + 6 * k) return { type: 'label', l };
    for (let i = S.zones.length - 1; i >= 0; i--) {
      const zz = S.zones[i], P = zonePose(zz, W, H), dr = zDepth(zz), B4 = [[0, 0], [1, 0], [1, 1], [0, 1]];
      if (inPoly(X, Y, B4.map(([s, t]) => zonePt(P, s, t, dr))) || inPoly(X, Y, B4.map(([s, t]) => zonePt(P, s, t, 0)))) return { type: 'move', i };
    }
    return null;
  }
  // the page scrolls normally, except when drawing or when the finger lands on a zone
  cv.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (S.drawing || (t && hitTest(t.clientX, t.clientY))) e.preventDefault(); }, { passive: false });
  cv.addEventListener('pointerdown', (e) => {
    if (S.drawing) { const p = pt(e.clientX, e.clientY); act = { h: { type: 'draw' } }; S.drawRect = { x0: p.x, y0: p.y, x1: p.x, y1: p.y }; cv.setPointerCapture(e.pointerId); return; }
    const h = hitTest(e.clientX, e.clientY); if (!h) return;
    if (h.type === 'label') { act = { h, x0: e.clientX, y0: e.clientY }; return; }
    if (h.i !== S.sel) { S.sel = h.i; renderZones(); }
    const z = S.zones[h.i]; act = { h, start: pt(e.clientX, e.clientY), q0: zq(z).map((c) => [...c]), x0: e.clientX, y0: e.clientY };
    cv.setPointerCapture(e.pointerId); S.zonesTouched = true; $('.zonetip').hidden = true;
    if (h.type === 'corner') S.loupe = { x: z.q[h.c][0], y: z.q[h.c][1] };
    drawCotes();
  });
  cv.addEventListener('pointermove', (e) => {
    if (!act || act.h.type === 'label') return; const p = pt(e.clientX, e.clientY);
    if (act.h.type === 'draw') { S.drawRect.x1 = p.x; S.drawRect.y1 = p.y; queueDraw(); return; }
    const z = S.zones[act.h.i], dx = p.x - act.start.x, dy = p.y - act.start.y;
    if (act.h.type === 'move') {
      const xs = act.q0.map((c) => c[0]), ys = act.q0.map((c) => c[1]), mx = clamp(dx, -Math.min(...xs), 1 - Math.max(...xs)), my = clamp(dy, -Math.min(...ys), 1 - Math.max(...ys));
      z.q = act.q0.map(([a, b]) => [a + mx, b + my]);
    } else if (act.h.type === 'corner') {
      // the corner follows the finger; it only stops where the outline would fold over itself
      const c = act.h.c, q = act.q0.map((v) => [...v]); q[c] = [clamp(act.q0[c][0] + dx, 0, 1), clamp(act.q0[c][1] + dy, 0, 1)];
      const W = cv.width, H = cv.height, cr = (o, a, b) => ((a[0] - o[0]) * W) * ((b[1] - o[1]) * H) - ((a[1] - o[1]) * H) * ((b[0] - o[0]) * W);
      if ([0, 1, 2, 3].every((j) => cr(q[j], q[(j + 1) % 4], q[(j + 2) % 4]) > W * H * .0004)) z.q = q;
      S.loupe = { x: z.q[c][0], y: z.q[c][1] };
    } else if (act.h.type === 'depth') {
      // slide along the real depth direction: the closest point of that line to the finger
      const W = cv.width, H = cv.height, P = zonePose(z, W, H), [s, t] = [[0, 0], [1, 0], [1, 1], [0, 1]][z._dh.j], X = p.rx * p.sx, Y = p.ry * p.sx;
      let best = z.dr || .22, bd = Infinity; for (let c = .03; c <= 1.6; c += .01) { const [a, b] = zonePt(P, s, t, c), d = Math.hypot(a - X, b - Y); if (d < bd) { bd = d; best = c; } }
      z.dr = best; zMan(z).C = false;
    }
    zBox(z); zoneAuto(z); const zi = act.h.i; queueDraw(() => syncZoneInputs(zi));
  });
  const end = (e) => {
    if (!act) return; const a = act; act = null; S.loupe = null;
    if (a.h.type === 'draw') {
      const d = S.drawRect; S.drawRect = null;
      if (e.type === 'pointerup' && d && Math.abs(d.x1 - d.x0) > .08 && Math.abs(d.y1 - d.y0) > .05) {
        const x = Math.min(d.x0, d.x1), y = Math.min(d.y0, d.y1), w = Math.abs(d.x1 - d.x0), h = Math.abs(d.y1 - d.y0);
        S.zones.push({ x, y, w, h, q: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], A: '', B: '', C: '', D: 0, man: {}, dr: .22 }); S.sel = S.zones.length - 1; S.zonesTouched = false;
        setDrawing(false); renderZones(); drawCotes(); return;
      }
      drawCotes(); if (e.type === 'pointerup') toast('Glissez le doigt en diagonale, d’un coin à l’autre'); return;
    }
    if (a.h.type === 'label' && e.type === 'pointerup' && Math.hypot(e.clientX - a.x0, e.clientY - a.y0) < 10 && a.h.l.key === 'del') {
      S.zones.splice(a.h.l.zone, 1); S.zonesTouched = true; S.sel = clamp(S.sel, 0, Math.max(0, S.zones.length - 1)); renderZones(); drawCotes(); toast('Zone supprimée'); return;
    }
    if (a.h.type === 'label' && e.type === 'pointerup' && Math.hypot(e.clientX - a.x0, e.clientY - a.y0) < 10) {
      S.sel = a.h.l.zone; renderZones(); drawCotes();
      const inp = $(`#z${a.h.l.zone}${a.h.l.key}`); if (inp) { inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => inp.focus(), 300); }
      return;
    }
    drawCotes();
  };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  $('#drawBtn').onclick = () => setDrawing(true);
  $('#drawStart').onclick = () => setDrawing(true);
  $('#drawCancel').onclick = () => setDrawing(false);
})();
const DIM_SVG = `<svg class="dimsvg" viewBox="0 0 300 186" role="img" aria-label="A largeur, B hauteur, C profondeur, D hauteur au-dessus du sol">
  <line x1="8" y1="176" x2="292" y2="176" stroke="#4A4E55" stroke-width="2"/>
  <path d="M62 40 L92 16 L236 16 L206 40 Z" fill="#1F2227" stroke="#C9CACD" stroke-width="2" stroke-linejoin="round"/>
  <path d="M206 40 L236 16 L236 90 L206 114 Z" fill="#191B1F" stroke="#C9CACD" stroke-width="2" stroke-linejoin="round"/>
  <rect x="62" y="40" width="144" height="74" fill="#24272D" stroke="#C9CACD" stroke-width="2"/>
  <g stroke="#E9B26B" stroke-width="2.4" fill="#E9B26B" stroke-linecap="round">
    <line x1="64" y1="130" x2="204" y2="130"/><path d="M64 130l8-5v10z M204 130l-8-5v10z" stroke="none"/>
    <line x1="44" y1="42" x2="44" y2="112"/><path d="M44 42l-5 8h10z M44 112l-5-8h10z" stroke="none"/>
    <line x1="246" y1="94" x2="268" y2="76"/><path d="M246 94l9-1-5-7z M268 76l-9 1 5 7z" stroke="none"/>
    <line x1="222" y1="108" x2="222" y2="172" stroke-dasharray="4 4"/><path d="M222 172l-5-8h10z M222 108l-5 8h10z" stroke="none"/>
  </g>
  <g font-family="Geist, sans-serif" font-weight="700" font-size="15" text-anchor="middle">
    <circle cx="134" cy="130" r="12" fill="#0E0F11" stroke="#E9B26B" stroke-width="2"/><text x="134" y="135" fill="#E9B26B">A</text>
    <circle cx="44" cy="77" r="12" fill="#0E0F11" stroke="#E9B26B" stroke-width="2"/><text x="44" y="82" fill="#E9B26B">B</text>
    <circle cx="278" cy="68" r="12" fill="#0E0F11" stroke="#E9B26B" stroke-width="2"/><text x="278" y="73" fill="#E9B26B">C</text>
    <circle cx="246" cy="146" r="12" fill="#0E0F11" stroke="#E9B26B" stroke-width="2"/><text x="246" y="151" fill="#E9B26B">D</text>
  </g></svg>`;
const DIMS = [['A', 'Largeur', 'La place disponible, d’un bord à l’autre'], ['B', 'Hauteur', 'La hauteur maximale du meuble'],
  ['C', 'Profondeur', 'Depuis le mur, sans gêner le passage'], ['D', 'Hauteur au-dessus du sol', '0 si le meuble est posé au sol']];
function renderZones() {
  const box = $('#zoneList'); box.innerHTML = '';
  $('#drawStart').hidden = S.drawing || S.zones.length > 0; $('#drawBtn').hidden = !S.zones.length;
  $('#zoneHint').textContent = !S.zones.length ? '' : S.zones.length > 1 ? `${S.zones.length} zones : chacune devient un module. Touchez une zone pour la sélectionner.` : '';
  $('.zonetip').hidden = !S.zones.length || !!S.zonesTouched;
  S.zones.forEach((z, i) => {
    const card = document.createElement('div'); card.className = 'card zonecard' + (i === S.sel ? ' sel' : '');
    card.innerHTML = `<div class="zhead"><span class="znum">${i + 1}</span><b>Zone ${i + 1}</b><span class="sp"></span><button type="button" class="link danger" data-act="del">Supprimer</button></div>${i === 0 || i === S.sel ? DIM_SVG : ''}<p class="onemeasure"><b>Une seule mesure suffit.</b> Entrez la largeur, la hauteur ou la profondeur : SNUG calcule les deux autres d’après la photo. Vous pouvez les corriger au mètre.</p><div class="cotes"></div>`;
    const ct = card.querySelector('.cotes');
    DIMS.forEach(([k, l, sub]) => {
      const id = `z${i}${k}`; const row = document.createElement('div'); row.className = 'cote';
      row.innerHTML = `<span class="k">${k}</span><label for="${id}"><b>${l}</b><small>${sub}</small></label><span class="u"><em class="autotag">calculé</em><input id="${id}" type="number" inputmode="numeric" min="0" placeholder="0"><span>mm</span></span>`;
      const inp = row.querySelector('input'); inp.value = z[k]; if (z.est && +z.est[k] > 0) inp.placeholder = '≈ ' + Math.round(+z.est[k]);
      inp.addEventListener('input', () => { z[k] = inp.value; if (k !== 'D') { zMan(z)[k] = !!pos(inp.value); zoneAuto(z); syncZoneInputs(i); } drawCotes(); });
      inp.addEventListener('focus', () => { if (S.sel !== i) { S.sel = i; drawCotes(); document.querySelectorAll('.zonecard').forEach((c, j) => c.classList.toggle('sel', j === i)); } });
      ct.appendChild(row);
    });
    card.querySelector('[data-act=del]').onclick = () => { S.zones.splice(i, 1); S.zonesTouched = true; S.sel = clamp(S.sel, 0, Math.max(0, S.zones.length - 1)); renderZones(); drawCotes(); };
    box.appendChild(card); syncZoneInputs(i);
  });
}
const zonesOk = () => S.zones.length > 0 && S.zones.every((z) => pos(z.A) && pos(z.B) && pos(z.C));

/* ================= profile options ================= */
function optButtons(el, list, getOn, onPick, imgOf) {
  el.innerHTML = '';
  list.forEach(([id, name, hint, icon]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'opt' + (imgOf ? ' withimg' : ''); b.innerHTML = (imgOf ? `<img class="oprev" alt="" src="${imgOf(id)}" loading="lazy">` : icon ? `<i class="oi">${ICON(icon, 30)}</i>` : '') + '<b></b><span></span>';
    b.querySelector('b').textContent = name; b.querySelector('span').textContent = hint; b.setAttribute('aria-pressed', String(getOn(id)));
    b.onclick = () => { onPick(id); optButtons(el, list, getOn, onPick, imgOf); }; el.appendChild(b);
  });
}
function chipButtons(el, list, set) {
  el.innerHTML = '';
  list.forEach((name) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = name; b.setAttribute('aria-pressed', String(set.has(name)));
    b.onclick = () => { set.has(name) ? set.delete(name) : set.add(name); b.setAttribute('aria-pressed', String(set.has(name))); }; el.appendChild(b);
  });
}
function renderOptions() {
  optButtons($('#projects'), PROJECTS, (id) => S.project === id, (id) => { S.project = id; renderItems(); }, (id) => `previews/${id}.jpg`);
  optButtons($('#ambiances'), ENG.AMBIANCES, (id) => S.ambiance === id, (id) => { S.ambiance = id; });
  optButtons($('#fabs'), FABS, (id) => S.fab === id, (id) => { S.fab = id; });
  optButtons($('#levels'), LEVELS, (id) => S.level === id, (id) => { S.level = id; });
  chipButtons($('#tools'), TOOLS, S.tools);
  chipButtons($('#shops'), SHOPS, S.shops);
  renderItems();
}

/* ================= photo ================= */
function photoDataOf(img) {
  try { const W = Math.min(900, img.naturalWidth), H = Math.round(W * img.naturalHeight / img.naturalWidth); const c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').drawImage(img, 0, 0, W, H); return c.toDataURL('image/jpeg', .72); } catch { return null; }
}
function setPhoto(img, example, after) {
  S.photo = img; S.example = example; S.photoData = null;
  const go = () => { if (!example) S.photoData = photoDataOf(img); drawPhoto($('#cv0')); if (S.step === 1) drawCotes(); if (after) after(); };
  if (img.complete && img.naturalWidth) go(); else img.onload = go;
  $('#photoBadge').textContent = example ? 'Sans photo' : 'Votre photo';
  document.querySelector('.photo.hero').classList.toggle('isEmpty', !!example);
  $('#photoLbl').lastChild.textContent = example ? 'Prendre une photo' : 'Changer de photo';
}
$('#photoIn').addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const img = new Image(); img.src = URL.createObjectURL(f);
  S.zones = []; S.sel = 0; S.aiNotes = []; renderAiNotes(); setPhoto(img, false, () => aiPhoto()); renderZones();
});

/* ================= navigation ================= */
function show(step) {
  S.step = step;
  document.querySelectorAll('[data-step]').forEach((s) => { s.hidden = +s.dataset.step !== step; });
  document.querySelectorAll('.steps button').forEach((b) => { const n = +b.dataset.go; b.className = n === step ? 'on' : (n < step ? 'done' : ''); });
  $('#backBtn').hidden = step === 0;
  $('#nextBtn').textContent = step === 3 ? 'Voir mes 3 meubles' : (step === 4 ? 'Nouveau projet' : 'Continuer');
  $('#backBtn').textContent = 'Retour';
  if (step === 0) drawPhoto($('#cv0'));
  if (step === 1) { if (!S.zones.length && S.example && !S.zonesTouched) S.zones.push({ x: .12, y: .4, w: .76, h: .38, A: '', B: '', C: '', D: 0, man: {}, dr: .22 }); setDrawing(false); renderZones(); requestAnimationFrame(drawCotes); }
  if (step === 2) renderItems();
  if (step === 4 && currentProp()) renderResult(); else stopLoop();
  if (step !== 4) { S.selCell = null; $('#cellSheet').hidden = true; }
  updateBar();
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('.steps button').forEach((b) => b.addEventListener('click', () => { const n = +b.dataset.go; if (n < 4 || S.result.some(Boolean)) show(n); }));
$('#backBtn').onclick = () => { if (S.step === 4 && currentProp()) { const i = PANES.findIndex((x) => x[0] === S.pane); if (i > 0) return goPane(PANES[i - 1][0], -1); } show(Math.max(0, S.step - 1)); };
$('#nextBtn').onclick = () => {
  if (S.step === 1 && !zonesOk()) {
    $('#zoneErr').textContent = S.zones.length ? 'Donnez au moins une mesure pour chaque zone (largeur, hauteur ou profondeur).' : 'Dessinez au moins une zone sur la photo.';
    $('#zoneErr').hidden = false; return;
  }
  $('#zoneErr').hidden = true;
  if (S.step < 3) return show(S.step + 1);
  if (S.step === 3) { show(4); generate(); return; }
  if (S.step === 4 && currentProp()) { const i = PANES.findIndex((x) => x[0] === S.pane); if (i < PANES.length - 1) return goPane(PANES[i + 1][0], 1); $('#saveBtn').click(); window.scrollTo({ top: 0 }); return; }
  newProject();
};
function newProject() {
  S.result = [null, null, null]; S.projId = null; S.projName = ''; $('#result').hidden = true; $('#errBox').hidden = true; S.pane = 'modele'; show(0);
}
$('#newBtn').onclick = newProject;

/* ================= geometry (mm, origin = bottom-left-back of the module) ================= */
function zoneFor(m, mi) { const zs = S.genZones || S.zones; const k = (parseInt(m && m.zone, 10) || 0) - 1; return zs[k] || zs[mi] || null; }
function layoutModule(m, z) {
  z = z || DEFZ;
  const W = pos(m.largeur_mm, z.A, 1000), H = pos(m.hauteur_mm, z.B, 600), D = pos(m.profondeur_mm, z.C, 400);
  const t = 18, legs = clamp(num(m.pieds_mm), 0, H * .5), topT = clamp(pos(m.epaisseur_plateau_mm, 18), 12, 60);
  const caissons = m.fabrication === 'caissons', divT = caissons ? 2 * t : t;
  const cols = Array.isArray(m.colonnes) && m.colonnes.length ? m.colonnes : [{ largeur_mm: W, cases: [{ hauteur_mm: H, type: 'ouvert' }] }];
  const innerW = W - 2 * t - (cols.length - 1) * divT;
  const sumW = cols.reduce((s, c) => s + pos(c && c.largeur_mm, 1), 0);
  const y0 = legs + t, y1 = H - topT;
  const cells = [], dividers = [], shelves = [], boxes = [];
  let x = t;
  cols.forEach((c, ci) => {
    const cw = innerW * pos(c && c.largeur_mm, 1) / sumW;
    if (!(c && c.vide)) boxes.push({ x0: x - t, x1: x + cw + t, ref: (c && c.ref) || '' });
    const cases = c && Array.isArray(c.cases) && c.cases.length ? c.cases : [{ hauteur_mm: 1, type: 'ouvert' }];
    const innerH = (y1 - y0) - (cases.length - 1) * t;
    const sumH = cases.reduce((s, k) => s + pos(k && k.hauteur_mm, 1), 0);
    let y = y0;
    cases.forEach((k, ri) => {
      const ch = innerH * pos(k && k.hauteur_mm, 1) / sumH;
      const type = TYPES.includes(k && k.type) ? k.type : 'ouvert';
      cells.push({ x, y, w: cw, h: ch, type, contenu: (k && k.contenu) || '', rod: !!(k && k.tringle), key: `${ci}-${ri}`, col: ci, ncols: cols.length });
      y += ch; if (ri < cases.length - 1) { shelves.push({ x, w: cw, y }); y += t; }
    });
    x += cw; if (ci < cols.length - 1) { dividers.push(x); x += divT; }
  });
  const details = (Array.isArray(m.details) ? m.details : []).filter((d) => d && d.type).map((d) => {
    if (d.type === 'passe_cable') return { type: d.type, face: d.face === 'plateau' ? 'plateau' : 'arriere', x: clamp(num(d.x_mm, W / 2), 40, W - 40), y: d.face === 'plateau' ? clamp(num(d.y_mm, 60), 40, D - 40) : clamp(num(d.y_mm, y0 + 80), y0 + 40, y1 - 40), dia: clamp(pos(d.diametre_mm, 60), 30, 100) };
    if (d.type === 'aeration') return { type: d.type, x: clamp(num(d.x_mm, W / 4), 60, W - 60), y: clamp(num(d.y_mm, (y0 + y1) / 2), y0 + 30, y1 - 30), w: clamp(pos(d.largeur_mm, 200), 60, W * .6), h: clamp(pos(d.hauteur_mm, 60), 20, 200) };
    if (d.type === 'fixation_murale') return { type: d.type };
    return null;
  }).filter(Boolean);
  return { W, H, D, t, divT, legs, topT, y0, y1, cells, dividers, shelves, caissons, boxes, details, raised: num(z.D) > 0 };
}
function legXs(L) { const n = Math.max(2, Math.round(L.W / 800) + 1); return Array.from({ length: n }, (_, k) => 20 + (L.W - 90) * k / (n - 1)); }
function frontsOf(L, mi) {
  const out = [], gap = 3;
  L.cells.forEach((c) => {
    if (c.type === 'ouvert') return;
    const fx = c.x + gap, fy = c.y + gap, fw = c.w - 2 * gap, fh = c.h - 2 * gap;
    if (c.type === 'porte') {
      if (fw > 650) { out.push({ kind: 'porte', c, side: 'L', x: fx, y: fy, w: fw / 2 - 1, h: fh, k: 0 }); out.push({ kind: 'porte', c, side: 'R', x: fx + fw / 2 + 1, y: fy, w: fw / 2 - 1, h: fh, k: 1 }); }
      else out.push({ kind: 'porte', c, side: (c.col < c.ncols / 2 || c.ncols === 1) ? 'L' : 'R', x: fx, y: fy, w: fw, h: fh, k: 0 });
    } else if (c.type === 'caisse') {
      const cw = Math.min(fw - 20, 520), ch = Math.max(60, Math.min(fh - 10, 260)), cd = Math.max(150, Math.min(L.D - 40, 340));
      out.push({ kind: 'caisse', c, x: fx + (fw - cw) / 2, y: fy, w: cw, h: ch, d: cd, k: 0 });
    } else out.push({ kind: c.type, c, x: fx, y: fy, w: fw, h: fh, k: 0 });
  });
  out.forEach((f) => { f.key = `${S.active}:${mi}:${f.c.key}:${f.k}`; });
  return out;
}
function frontsCount(p) { return (p.modules || []).reduce((n, m, mi) => n + frontsOf(layoutModule(m, zoneFor(m, mi)), mi).length, 0); }
function getSt(key) { return E.state[key] || (E.state[key] = { t: 0, target: 0 }); }
/* Handle drilling points on a front, in module coordinates (z = front face) */
function handleHoles(f, h, D) {
  if (['none', 'gorge', 'cut', 'recess'].includes(h.shape)) return [];
  const face = f.kind === 'caisse' ? D - 14 : D + 18;
  const vert = f.kind === 'porte';
  const cx = vert ? (f.side === 'L' ? f.x + f.w - 40 : f.x + 40) : f.x + f.w / 2;
  const cy = vert ? f.y + f.h / 2 : (f.kind === 'caisse' ? f.y + f.h - 50 : f.y + f.h * .62);
  if (!h.ent) return [[cx, cy, face]];
  return vert ? [[cx, cy - h.ent / 2, face], [cx, cy + h.ent / 2, face]] : [[cx - h.ent / 2, cy, face], [cx + h.ent / 2, cy, face]];
}

/* ================= what to store (step 1) ================= */
const ENG = window.SnugEngine;
function projectName() { return (PROJECTS.find((p) => p[0] === S.project) || [, 'Meuble'])[1]; }
function curItems() {
  if (!S.itemsBy[S.project]) { const d = ENG.defaults(S.project); ENG.itemsOf(S.project).forEach((i) => { if (i.kind !== 'choice' && i.kind !== 'number') d[i.id] = 0; }); S.itemsBy[S.project] = d; }
  return S.itemsBy[S.project];
}
function curCustom() { return S.customBy[S.project] || (S.customBy[S.project] = []); }
function robotWanted() { return !!num(curItems().robot); }
function renderItems() {
  const box = $('#itemList'), opts = $('#itemOpts'); box.innerHTML = ''; opts.innerHTML = '';
  const it = curItems(), w = Math.max(0, ...S.zones.map((z) => pos(z.A)));
  $('#itemsEyebrow').textContent = projectName() + (w ? ` · ${(w / 1000).toFixed(2).replace('.', ',')} m` : '');
  ENG.itemsOf(S.project).forEach((d) => {
    if (d.kind === 'flag') {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'switchrow'; b.setAttribute('role', 'switch');
      b.innerHTML = '<span><b></b><small></small></span><i aria-hidden="true"></i>';
      b.querySelector('b').textContent = d.id === 'robot' ? 'Robot aspirateur' : d.nom; b.querySelector('small').textContent = d.id === 'robot' ? 'Garder 12 cm sous le meuble' : '';
      const upd = () => b.setAttribute('aria-checked', String(!!num(it[d.id]))); upd();
      b.onclick = () => { it[d.id] = num(it[d.id]) ? 0 : 1; upd(); }; opts.appendChild(b); return;
    }
    if (d.kind === 'choice') {
      const wrap = document.createElement('div'); wrap.className = 'col tight';
      const l = document.createElement('p'); l.className = 'sublbl'; l.textContent = d.nom; const row = document.createElement('div'); row.className = 'seg'; row.setAttribute('role', 'group');
      d.options.forEach(([id, name]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = name; b.setAttribute('aria-pressed', String(it[d.id] === id)); b.onclick = () => { it[d.id] = id; renderItems(); }; row.appendChild(b); });
      wrap.append(l, row); opts.appendChild(wrap); return;
    }
    if (d.kind === 'number') {
      if (d.when && !d.when(it)) return;
      const row = document.createElement('div'); row.className = 'card'; const id = 'opt_' + d.id;
      row.innerHTML = `<div class="cote"><span class="k">↘</span><label for="${id}"></label><span class="u"><input id="${id}" type="number" inputmode="numeric" min="0"><span class="muted small">mm</span></span></div>`;
      row.querySelector('label').textContent = d.nom; const inp = row.querySelector('input'); inp.value = it[d.id]; inp.oninput = () => { it[d.id] = inp.value; };
      opts.appendChild(row); return;
    }
    const max = d.max || (d.kind === 'top' ? 1 : 20);
    const tile = document.createElement('div'); tile.className = 'tile';
    tile.innerHTML = `<button type="button" class="add">${ICON(ITEM_ICONS[d.id] || ITEM_ICONS.etageres, 34)}<b></b></button><span class="cnt"></span><button type="button" class="minus">−</button>`;
    const add = tile.querySelector('.add'), minus = tile.querySelector('.minus'), cnt = tile.querySelector('.cnt');
    tile.querySelector('b').textContent = d.nom; add.title = d.hint || ''; minus.setAttribute('aria-label', `Retirer : ${d.nom}`);
    const upd = () => { const v = clamp(num(it[d.id]), 0, max); it[d.id] = v; tile.classList.toggle('on', v > 0); cnt.textContent = max === 1 ? '✓' : '×' + v;
      add.setAttribute('aria-label', `${d.nom}${d.hint ? ', ' + d.hint : ''} : ${v} ${max === 1 ? (v ? 'oui' : 'non') : ''}`.trim()); };
    add.onclick = () => { const v = num(it[d.id]); it[d.id] = max === 1 ? (v ? 0 : 1) : Math.min(max, v + 1); upd(); };
    minus.onclick = () => { it[d.id] = Math.max(0, num(it[d.id]) - 1); upd(); };
    const zoneH = Math.max(0, ...S.zones.map((z) => pos(z.B))), need = d.hMin || d.h;
    const tooTall = zoneH > 0 && need && need > zoneH - 120;
    if (tooTall) { tile.classList.add('warn'); tile.insertAdjacentHTML('beforeend', '<span class="wtag">Trop haut</span>'); add.title = `Il faut environ ${need} mm de haut ; votre zone fait ${zoneH} mm.`; }
    const add0 = add.onclick; add.onclick = () => { add0(); if (tooTall && num(it[d.id]) > 0) toast(`${d.nom} : il faut environ ${need.toLocaleString('fr-FR')} mm de haut, votre zone fait ${zoneH.toLocaleString('fr-FR')} mm.`); };
    upd(); box.appendChild(tile);
  });
  // objects added by hand
  curCustom().forEach((c, ci) => {
    const tile = document.createElement('div'); tile.className = 'tile on custom';
    tile.innerHTML = `<button type="button" class="add">${ICON('M8 14h32v24H8z M8 22h32 M20 18h8', 34)}<b></b><small></small></button><span class="cnt"></span><button type="button" class="minus">−</button>`;
    tile.querySelector('b').textContent = c.nom; tile.querySelector('small').textContent = `${Math.round(c.h / 10)} × ${Math.round(c.w / 10)} cm`;
    const cnt = tile.querySelector('.cnt'); const upd = () => { cnt.textContent = '×' + c.n; };
    tile.querySelector('.add').onclick = () => { c.n = Math.min(20, c.n + 1); upd(); };
    tile.querySelector('.minus').setAttribute('aria-label', `Retirer : ${c.nom}`);
    tile.querySelector('.minus').onclick = () => { c.n -= 1; if (c.n <= 0) { curCustom().splice(ci, 1); renderItems(); } else upd(); };
    upd(); box.appendChild(tile);
  });
  const addTile = document.createElement('div'); addTile.className = 'tile addnew';
  addTile.innerHTML = `<button type="button" class="add">${ICON('M24 12v24 M12 24h24', 30)}<b>Autre objet</b></button>`;
  addTile.querySelector('.add').onclick = () => { $('#customForm').hidden = false; $('#cNom').focus(); };
  box.appendChild(addTile);
  opts.hidden = !opts.children.length;
}

/* ================= optional AI helper (Google Gemini free tier, through api/assist) =================
   It only prepares what the rules engine computes: project type, objects, zone. Without a key the app works as before. */
const SPARK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>';
async function aiCall(body) {
  let res; try { res = await fetch('api/assist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); } catch { throw { code: 'offline' }; }
  let d = null; try { d = await res.json(); } catch { throw { code: 'upstream_error' }; }
  if (!res.ok || !d || d.code) throw { code: (d && d.code) || 'upstream_error', detail: d && d.detail }; return d;
}
const aiCopy = (code) => code === 'rate_limited' ? 'Le quota gratuit du jour est atteint. Réessayez plus tard ou continuez sans l’IA.'
  : code === 'offline' ? 'Pas de connexion : continuez sans l’IA.' : 'L’IA n’a pas pu répondre. Continuez sans elle, ou réessayez.';
function aiCatalogue(only) {
  const o = {}; PROJECTS.forEach(([id]) => { if (only && id !== only) return; o[id] = ENG.itemsOf(id).map((d) => ({ id: d.id, nom: d.nom, kind: d.kind || '', max: d.max || 1, options: d.options ? d.options.map((x) => x[0]) : undefined })); });
  return o;
}
async function aiPing() {
  try { const d = await aiCall({ task: 'ping' }); S.ai = !!d.ok; } catch { S.ai = false; }
  $('#aiText').hidden = !S.ai;
}
function aiCard(el, html) { el.hidden = false; el.innerHTML = html; }
async function aiPhoto() {
  const el = $('#aiPhoto'); if (!S.ai || S.example || !S.photoData) { el.hidden = true; return; }
  aiCard(el, `<div class="aihead">${SPARK}<b>Analyse de la photo…</b></div><div class="shimmer"></div>`);
  const shot = S.photo;
  try {
    const d = await aiCall({ task: 'photo', image: S.photoData.split(',')[1], catalogue: aiCatalogue() });
    if (S.photo !== shot) return;
    const r = d.result || {}, proj = PROJECTS.find((x) => x[0] === r.projet);
    const objs = Object.entries(r.objets || {}).filter(([k, v]) => proj && ENG.itemsOf(proj[0]).some((i) => i.id === k && !i.kind) && +v > 0);
    const z = r.zone || {}, zoneOk = [z.x, z.y, z.w, z.h].every((v) => Number.isFinite(+v)) && +z.w > .05 && +z.h > .05;
    const notes = (Array.isArray(r.remarques) ? r.remarques : []).slice(0, 4).map(String);
    const lines = [];
    if (proj) lines.push(`<li>Projet : <b>${proj[1]}</b></li>`);
    if (objs.length) lines.push(`<li>Déjà là : ${objs.map(([k, v]) => { const it = ENG.itemsOf(proj[0]).find((i) => i.id === k); return (+v > 1 ? v + ' × ' : '') + it.nom.toLowerCase(); }).join(', ')}</li>`);
    if (zoneOk) lines.push('<li>Zone du meuble tracée sur la photo</li>');
    notes.forEach((n) => lines.push(`<li class="muted">${n.replace(/[<>&]/g, '')}</li>`));
    if (!lines.length) { aiCard(el, `<div class="aihead">${SPARK}<b>Rien de particulier repéré</b></div>`); return; }
    aiCard(el, `<div class="aihead">${SPARK}<b>Repéré par l’IA</b></div><ul class="ailist">${lines.join('')}</ul><div class="rowb"><span class="muted small">Vous gardez la main ensuite.</span><button type="button" class="btn primary sm" id="aiApply">Appliquer</button></div>`);
    $('#aiApply').onclick = () => {
      if (proj) S.project = proj[0];
      const it = curItems(); objs.forEach(([k, v]) => { const def = ENG.itemsOf(S.project).find((i) => i.id === k); it[k] = Math.min(def.max || 1, Math.round(+v)); });
      if (zoneOk) { const c = (v) => clamp(+v, 0, 1); const zz = { x: c(z.x), y: c(z.y), w: Math.min(c(z.w), 1 - c(z.x)), h: Math.min(c(z.h), 1 - c(z.y)), A: '', B: '', C: '', D: 0, est: r.estimation_mm || null }; S.zones = [zz]; S.sel = 0; }
      S.aiNotes = notes; renderAiNotes(); renderOptions();
      aiCard(el, `<div class="aihead">${SPARK}<b>Suggestions appliquées</b></div><p class="muted small">Il reste à mesurer : les valeurs grisées sont des estimations.</p>`);
      toast('Suggestions de l’IA appliquées');
    };
  } catch (e) { if (S.photo === shot) aiCard(el, `<div class="aihead">${SPARK}<b>Analyse indisponible</b></div><p class="muted small">${aiCopy(e && e.code)}</p>${e && e.detail ? `<p class="mono muted small">${String(e.detail).replace(/[<>&]/g, '')}</p>` : ''}`); }
}
function renderAiNotes() {
  const el = $('#aiNotes'); const n = S.aiNotes || [];
  el.hidden = !n.length; el.innerHTML = n.length ? `${SPARK}<span>${n.map((x) => x.replace(/[<>&]/g, '')).join(' · ')}</span>` : '';
}
async function aiText() {
  const txt = $('#aiIn').value.trim(), out = $('#aiOut'), btn = $('#aiGo'); if (!txt) { $('#aiIn').focus(); return; }
  btn.disabled = true; btn.textContent = 'Lecture…'; out.hidden = false; out.className = 'small muted'; out.textContent = 'L’IA lit votre demande…';
  const proj = S.project;
  try {
    const d = await aiCall({ task: 'text', project: proj, text: txt, items: aiCatalogue(proj)[proj], current: curItems() });
    if (S.project !== proj) return;
    const r = d.result || {}, it = curItems(), changed = [];
    Object.entries(r.items || {}).forEach(([k, v]) => {
      const def = ENG.itemsOf(proj).find((i) => i.id === k); if (!def) return;
      if (def.kind === 'choice') { if (def.options.some((o) => o[0] === v)) it[k] = v; }
      else if (def.kind === 'number') { if (+v > 0) it[k] = Math.round(+v); }
      else { const n = clamp(Math.round(+v || 0), 0, def.kind === 'flag' ? 1 : (def.max || 1)); if (n !== num(it[k])) changed.push(def.nom); it[k] = n; }
    });
    renderItems();
    out.className = 'small soft'; out.textContent = [r.resume || (changed.length ? 'Mis à jour : ' + changed.join(', ') + '.' : 'Rien à changer.'), r.non_compris ? 'Pas pris en compte : ' + r.non_compris : ''].filter(Boolean).join(' ');
  } catch (e) { out.className = 'small warn'; out.textContent = aiCopy(e && e.code); }
  btn.disabled = false; btn.textContent = 'Comprendre';
}
$('#aiGo').onclick = aiText;
document.querySelectorAll('#cType button').forEach((b) => { b.onclick = () => document.querySelectorAll('#cType button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); });
$('#cCancel').onclick = () => { $('#customForm').hidden = true; };
$('#cAdd').onclick = () => {
  const nom = $('#cNom').value.trim(), h = num($('#cH').value) * 10, w = num($('#cW').value) * 10;
  const type = (document.querySelector('#cType button[aria-pressed="true"]') || {}).dataset?.t || 'ouvert';
  if (!nom || h < 50 || w < 80) { $('#cErr').hidden = false; return; }
  $('#cErr').hidden = true; curCustom().push({ nom, h, w, type, n: 1 });
  ['#cNom', '#cH', '#cW'].forEach((q) => { $(q).value = ''; }); $('#customForm').hidden = true; renderItems();
};

/* ================= photorealistic render (Cloudflare Workers AI free allowance, through api/render) ================= */
S.real = {}; S.realOn = false; S.render = false;
async function renderPing() {
  try { const r = await fetch('api/render', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"task":"ping"}' }); const d = await r.json(); S.render = !!d.ok; } catch { S.render = false; }
  updateRealBtn();
}
function realKey() { return [S.active, JSON.stringify(S.custom[S.active] || {}), S.photo ? S.photo.src.slice(-48) : '', JSON.stringify(S.genZones || [])].join('|'); }
function updateRealBtn() {
  const b = $('#realBtn'); b.hidden = !(S.render && S.view === 'photo' && currentProp());
  const has = !!S.real[realKey()], on = S.realOn && has;
  b.querySelector('span').textContent = on ? 'Aperçu' : 'Réaliste'; b.setAttribute('aria-pressed', String(on));
  const img = $('#realImg'); img.hidden = !(S.view === 'photo' && on); $('#cv3').hidden = !img.hidden ? true : false; if (on) img.src = S.real[realKey()];
}
function shrinkTo(src, max) {
  const w0 = src.naturalWidth || src.width, h0 = src.naturalHeight || src.height, k = Math.min(1, max / Math.max(w0, h0));
  const c = document.createElement('canvas'); c.width = Math.round(w0 * k); c.height = Math.round(h0 * k); c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', .88).split(',')[1];
}
function productShot() {
  init3D(); if (!E.ok) return null;
  build3D(); const keep = { ...E.orbit, target: E.orbit.target.clone() }, W = 496, H = 372;
  E.r.setSize(W, H, false); E.cam.aspect = W / H; E.cam.updateProjectionMatrix(); frame();
  const ob = E.orbit, sp = Math.sin(ob.phi);
  E.cam.position.set(ob.target.x + ob.r * sp * Math.sin(ob.theta), ob.target.y + ob.r * Math.cos(ob.phi), ob.target.z + ob.r * sp * Math.cos(ob.theta));
  E.cam.lookAt(ob.target); E.r.render(E.scene, E.cam);
  const out = shrinkTo($('#cv3d'), 504);
  Object.assign(E.orbit, keep); resize3D(); E.dirty = true;
  return out;
}
const PROJ_EN = { tv: 'a low TV cabinet', dressing: 'a wardrobe', biblio: 'a bookcase', escalier: 'an under-stairs storage unit', bureau: 'a desk with drawers', autre: 'a storage unit' };
async function makeReal() {
  const key = realKey();
  if (S.real[key]) { S.realOn = !S.realOn; updateRealBtn(); return; }
  const wait = $('#realWait'), btn = $('#realBtn'); if (!wait.hidden) return;
  wait.hidden = false; $('#realMsg').textContent = 'Création du rendu réaliste… environ 20 secondes';
  try {
    const product = productShot(); drawPhotoView(true);
    if (!product || !S.photo) throw { code: 'upstream_error' };
    const Ls = currentProp().modules.map((m, mi) => layoutModule(m, zoneFor(m, mi)));
    const W = Ls.reduce((a, L) => a + L.W, 0), Hm = Math.max(...Ls.map((L) => L.H));
    const asp = S.photo.naturalHeight / S.photo.naturalWidth, ow = asp <= 1 ? 1024 : Math.round(1024 / asp), oh = asp <= 1 ? Math.round(1024 * asp) : 1024;
    const res = await fetch('api/render', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
      images: [shrinkTo(S.photo, 504), shrinkTo($('#cv3'), 504), product], width: ow, height: oh,
      hint: `${PROJ_EN[S.project] || 'a storage unit'} about ${R0(W)} mm wide and ${R0(Hm)} mm high` }) });
    const d = await res.json().catch(() => null);
    if (!d || !d.ok) throw { code: (d && d.code) || 'upstream_error', detail: d && d.detail };
    S.real[key] = 'data:image/png;base64,' + d.image; S.realOn = true; wait.hidden = true; updateRealBtn();
  } catch (e) {
    $('#realMsg').textContent = (e && e.code === 'rate_limited' ? 'Le quota gratuit du jour est atteint. Réessayez demain.' : 'Le rendu réaliste n’a pas pu être créé. Réessayez dans un moment.') + (e && e.detail ? ` (${String(e.detail).slice(0, 120)})` : '');
    setTimeout(() => { wait.hidden = true; }, 6000);
  }
  btn.blur();
}
$('#realBtn').onclick = makeReal;

/* ================= PDF: shopping list and assembly notice, with clickable links ================= */
let PDFLIB = null;
function loadPdfLib() {
  if (window.jspdf) return Promise.resolve(window.jspdf);
  return PDFLIB || (PDFLIB = new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; sc.onload = () => res(window.jspdf); sc.onerror = () => { PDFLIB = null; rej(new Error('pdf')); }; document.head.appendChild(sc); }));
}
// the PDF's built-in fonts only know Latin-1 characters
const pdfTxt = (t) => String(t ?? '').replace(/[  ]/g, ' ').replace(/≈/g, 'env.').replace(/[→↗]/g, '->').replace(/←/g, '<-').replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
  .replace(/€/g, 'EUR').replace(/œ/g, 'oe').replace(/Œ/g, 'OE').replace(/…/g, '...').replace(/[–—]/g, '-').replace(/Å/g, 'A').replace(/å/g, 'a').replace(/[^\x00-\xFF]/g, '');
async function makePdf(kind) {
  const p = currentProp(), cu = S.custom[S.active]; if (!p || !cu) return;
  toast('Préparation du PDF…');
  let lib; try { lib = await loadPdfLib(); } catch { toast('Connexion nécessaire pour créer le PDF.'); return; }
  const doc = new lib.jsPDF({ unit: 'mm', format: 'a4' }), PW = 210, M = 16, CW = PW - 2 * M; let y = M;
  const ink = [21, 23, 26], mute = [110, 114, 122], gold = [176, 120, 40];
  const need = (h) => { if (y + h > 297 - M) { doc.addPage(); y = M; } };
  const text = (t, size, opt = {}) => { doc.setFont('helvetica', opt.bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...(opt.color || ink));
    const lines = doc.splitTextToSize(pdfTxt(t), opt.w || CW); const lh = size * .42; need(lines.length * lh); doc.text(lines, opt.x || M, y + lh * .8); y += lines.length * lh + (opt.after ?? 1.5); };
  const rule = () => { need(4); doc.setDrawColor(220, 222, 226); doc.line(M, y, PW - M, y); y += 4; };
  const N = noticeFor(p, cu), lines = linesFor(S.active), total = lines.reduce((a, l) => a + l.prix, 0);
  const Ls = p.modules.map((m, mi) => layoutModule(m, zoneFor(m, mi)));
  // cover
  text('SNUG', 9, { bold: true, color: gold, after: 1 });
  text(`${projectName()} · version ${p.nom}`, 20, { bold: true, after: 2 });
  text(`${new Date().toLocaleDateString('fr-FR')} · ${Ls.map((L) => `${R0(L.W)} × ${R0(L.H)} × ${R0(L.D)} mm`).join(', ')}`, 10, { color: mute, after: 4 });
  try { const img = productShot(); if (img) { const h = CW * 372 / 496; need(h); doc.addImage('data:image/jpeg;base64,' + img, 'JPEG', M, y, CW, h); y += h + 4; } } catch {}
  text(`Prix estimé : ${eur(total)} · Durée : ${p.duree || '-'} · Difficulté : ${['Facile', 'Moyen', 'Avancé'][clamp(Math.round(+p.difficulte || 2), 1, 3) - 1]}`, 11, { bold: true, after: 2 });
  if (p.resume) text(p.resume, 10, { after: 2 });
  if (p.attention) text('Attention : ' + p.attention, 9.5, { color: [150, 80, 10], after: 2 });
  if (kind !== 'notice') {
    if (kind === 'all') { doc.addPage(); y = M; } else { y += 4; }
    text('Liste de courses', 16, { bold: true, after: 1 });
    text('Touchez « Ouvrir chez … » pour voir le produit. Prix estimés, à vérifier.', 9, { color: mute, after: 4 });
    lines.forEach((l) => {
      const art = doc.splitTextToSize(pdfTxt(`${l.qte} × ${l.article}`), CW - 30); need(art.length * 4.6 + 12);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(...ink); doc.text(art, M, y + 4);
      doc.setFont('helvetica', 'normal'); doc.text(pdfTxt(eur(l.prix)), PW - M, y + 4, { align: 'right' }); y += art.length * 4.6;
      doc.setFontSize(9); doc.setTextColor(...mute); doc.text(pdfTxt([l.enseigne, l.detail].filter(Boolean).join(' · ')).slice(0, 110), M, y + 3.5); y += 4.6;
      doc.setTextColor(...gold); doc.textWithLink(pdfTxt(`Ouvrir chez ${l.enseigne || 'le vendeur'} ->`), M, y + 3.5, { url: shopUrl(l.enseigne, l.recherche) }); y += 6.5;
      doc.setDrawColor(235, 236, 239); doc.line(M, y, PW - M, y); y += 3;
    });
    need(10); doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...ink); doc.text('Total estimé', M, y + 5); doc.text(pdfTxt(eur(total)), PW - M, y + 5, { align: 'right' }); y += 10;
  }
  if (kind !== 'list') {
    doc.addPage(); y = M;
    text('Notice de montage', 16, { bold: true, after: 3 });
    text('Pièces', 12, { bold: true, after: 1 });
    N.parts.forEach((x) => text(`${x.code}  ${x.nom} — ${x.dims}`, 9.5, { after: .6 }));
    y += 3; text('Quincaillerie', 12, { bold: true, after: 1 });
    Object.keys(N.hw).sort().forEach((c) => text(`${c}  ${hwName(c, cu)} — ${N.hw[c]}`, 9.5, { after: .6 }));
    y += 3; text('Outils', 12, { bold: true, after: 1 }); text(N.tools.join(', '), 9.5, { after: 4 });
    const keep = S.nstep;
    N.steps.forEach((st, i) => {
      doc.addPage(); y = M;
      text(`Étape ${i + 1} sur ${N.steps.length}`, 9, { color: gold, bold: true, after: 1 });
      text(st.title, 15, { bold: true, after: 3 });
      try { S.nstep = i; renderStep(); const im = $('#stepCv').toDataURL('image/jpeg', .86); const h = CW * 660 / 900; need(h); doc.addImage(im, 'JPEG', M, y, CW, h); y += h + 4; } catch {}
      if (st.news.length) text('Pièces : ' + st.news.map((c) => { const q = N.parts.find((x) => x.code === c); return q ? `${c} ${q.nom}` : c; }).join(', '), 9.5, { color: mute });
      if (st.hw.length) text('Quincaillerie : ' + st.hw.map(([c, q]) => `${q} × ${c} (${hwName(c, cu)})`).join(', '), 9.5, { color: mute });
      if (st.tools.length) text('Outils : ' + st.tools.join(', '), 9.5, { color: mute, after: 3 });
      st.text.forEach((t, k) => text(`${k + 1}. ${t}`, 11, { after: 2 }));
      st.links.forEach((l) => { need(6); doc.setFontSize(10); doc.setTextColor(...gold); doc.textWithLink(pdfTxt(l.label + ' ->'), M, y + 4, { url: l.url }); y += 6; });
    });
    S.nstep = keep; if (S.pane === 'notice') renderNotice();
  }
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(...mute); doc.text(pdfTxt(`SNUG · ${projectName()} · ${i}/${pages}`), PW - M, 297 - 8, { align: 'right' }); }
  const name = `SNUG ${projectName()} ${p.nom} - ${kind === 'list' ? 'liste de courses' : kind === 'notice' ? 'notice' : 'dossier'}.pdf`.replace(/[\/\\:]/g, '-');
  const blob = doc.output('blob'), file = new File([blob], name, { type: 'application/pdf' });
  // on a phone, the share sheet offers "Save to Files"; elsewhere the file is downloaded
  if (matchMedia('(pointer: coarse)').matches && navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  toast('PDF enregistré');
}
$('#pdfList').onclick = () => makePdf('list');
$('#pdfNotice').onclick = () => makePdf('notice');
$('#pdfAll').onclick = () => makePdf('all');
// Result screen: the 3D view scrolls away with the page; a small button in the sticky bar brings it back.
$('#to3d').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.addEventListener('scroll', () => {
  if (S.step !== 4) return; const st = $('#cfgTop').getBoundingClientRect().bottom < 40;
  $('#to3d').hidden = !st; document.querySelector('.navbar').classList.toggle('stuck', st);
}, { passive: true });

/* ================= editing a case of the 3D model: type, hanging rail, shelf, merge, move ================= */
const CELL_TYPES = [['ouvert', 'Ouvert', 'M8 10h32v28H8z'], ['porte', 'Porte', 'M10 6h28v36H10z M32 22v4'], ['tiroir', 'Tiroir', 'M6 14h36v20H6z M18 24h12'],
  ['caisse', 'Caisse', 'M6 16h36v22H6z M6 24h36 M6 31h36'], ['abattant', 'Abattant', 'M8 12h32v24H8z M8 36l-4 6 M40 36l4 6 M18 30h12']];
function cellCtx(ref) {
  const p = currentProp(); if (!p || !ref) return null;
  const m = p.modules[ref.mi]; const col = m && m.colonnes && m.colonnes[ref.ci]; const k = col && col.cases && col.cases[ref.ri];
  if (!k) return null;
  const L = layoutModule(m, zoneFor(m, ref.mi)); const c = L.cells.find((x) => x.key === `${ref.ci}-${ref.ri}`);
  return c ? { p, m, col, k, L, c } : null;
}
function cellRules(L, c) {
  const w = c.w, h = c.h, D = L.D, mm = (v) => `${R0(v).toLocaleString('fr-FR')} mm`;
  return {
    ouvert: '', porte: h < 150 || w < 150 ? `Case trop petite pour une porte (${mm(w)} × ${mm(h)}, il faut 150 mm minimum).` : '',
    tiroir: h < 80 ? `Case trop basse pour un tiroir : ${mm(h)}, il faut 80 mm minimum.` : h > 450 ? `Case trop haute pour un tiroir : ${mm(h)}, 450 mm maximum. Ajoutez d’abord une étagère.` : w > 1000 ? `Case trop large pour un tiroir : ${mm(w)}, 1 000 mm maximum.` : '',
    caisse: h < 140 ? `Case trop basse pour une caisse : ${mm(h)}, il faut 140 mm minimum.` : D < 250 ? `Meuble pas assez profond pour une caisse : ${mm(D)}, il faut 250 mm.` : '',
    abattant: h < 200 ? `Case trop basse pour un abattant : ${mm(h)}, il faut 200 mm minimum.` : h > 800 ? `Case trop haute pour un abattant : ${mm(h)}, 800 mm maximum.` : '',
    tringle: h < 900 ? `Il faut au moins 900 mm de haut pour une penderie : cette case fait ${mm(h)}. Fusionnez-la avec la case du dessus ou du dessous.` : D < 480 ? `Il faut au moins 480 mm de profondeur pour une penderie : le meuble fait ${mm(D)}.` : '',
    split: h < 2 * 120 + 18 ? `Case trop basse pour être coupée en deux : ${mm(h)}.` : '',
  };
}
function openCell(ref) { S.selCell = ref; S.cellMsg = ''; if (window.scrollY > 40) window.scrollTo({ top: 0, behavior: 'smooth' }); setEditMode(false, true); renderCell(); if (E.inited) build3D(); }
// "Modifier" mode: frames every case and explains that a case can be touched. Shown once automatically.
function setEditMode(on, quiet) {
  S.showCells = !!on; $('#editBtn').setAttribute('aria-pressed', String(S.showCells)); $('#editTip').hidden = !S.showCells;
  clearTimeout(S.editT); if (on) S.editT = setTimeout(() => setEditMode(false), 6000);
  if (!quiet && E.inited && S.view === '3d') build3D();
}
$('#editBtn').onclick = () => { if (S.view !== '3d') { S.view = '3d'; renderView(); } setEditMode(!S.showCells); };
function closeCell() { if (!S.selCell) return; S.selCell = null; $('#cellSheet').hidden = true; if (E.inited) build3D(); }
function renderCell() {
  const X = cellCtx(S.selCell), el = $('#cellSheet'); if (!X) { el.hidden = true; return; }
  const { col, k, L, c } = X, rules = cellRules(L, c), n = col.cases.length;
  const where = n === 1 ? 'seule case' : X.k === col.cases[0] ? 'en bas' : X.k === col.cases[n - 1] ? 'en haut' : `case ${S.selCell.ri + 1} sur ${n}`;
  const btn = (id, label, extra = '') => `<button type="button" class="cbtn${extra}" data-op="${id}">${label}</button>`;
  el.innerHTML = `<div class="rowb"><div><b>Colonne ${S.selCell.ci + 1} · ${where}</b><p class="mono muted small">${R0(c.w)} × ${R0(c.h)} mm${k.contenu ? ' · ' + String(k.contenu).replace(/[<>&]/g, '') : ''}</p></div><button type="button" class="ibtn" id="cellClose" aria-label="Fermer">✕</button></div>
    <div class="ctypes" role="group" aria-label="Façade">${CELL_TYPES.map(([id, nom, ic]) => `<button type="button" data-op="type:${id}" aria-pressed="${k.type === id}" class="${rules[id] ? 'no' : ''}">${ICON(ic, 26)}<span>${nom}</span></button>`).join('')}</div>
    <div class="cmore"${S.cellMore ? '' : ' hidden'}><button type="button" class="switchrow small${rules.tringle && !k.tringle ? ' no' : ''}" role="switch" aria-checked="${!!k.tringle}" data-op="tringle"><span><b>Penderie</b><small>Une tringle pour suspendre des vêtements</small></span><i aria-hidden="true"></i></button>
    <div class="cops">${btn('split', 'Ajouter une étagère', rules.split ? ' no' : '')}${S.selCell.ri < n - 1 ? btn('mergeUp', 'Fusionner avec le dessus') : ''}${S.selCell.ri > 0 ? btn('mergeDown', 'Fusionner avec le dessous') : ''}${S.selCell.ri < n - 1 ? btn('up', 'Monter') : ''}${S.selCell.ri > 0 ? btn('down', 'Descendre') : ''}${S.selCell.ci > 0 ? btn('left', '← Colonne') : ''}${S.selCell.ci < X.m.colonnes.length - 1 ? btn('right', 'Colonne →') : ''}</div></div>
    <button type="button" class="cmorebtn" id="cellMore">${S.cellMore ? 'Moins d’options' : 'Étagère, penderie, déplacer…'}</button>
    <p class="cmsg${S.cellMsg ? '' : ' empty'}" aria-live="polite">${S.cellMsg || ''}</p>`;
  el.hidden = false;
  $('#cellClose').onclick = closeCell;
  $('#cellMore').onclick = () => { S.cellMore = !S.cellMore; renderCell(); };
  el.querySelectorAll('[data-op]').forEach((b) => { b.onclick = () => cellOp(b.dataset.op); });
}
function cellOp(op) {
  const X = cellCtx(S.selCell); if (!X) return; const { col, k, L, c } = X, rules = cellRules(L, c), ref = S.selCell, cs = col.cases, T = 18;
  const say = (m) => { S.cellMsg = m; renderCell(); };
  if (op.startsWith('type:')) { const t = op.slice(5); if (rules[t]) return say(rules[t]); k.type = t; if (t !== 'ouvert' && k.contenu === 'rangement') k.contenu = ''; }
  else if (op === 'tringle') { if (!k.tringle && rules.tringle) return say(rules.tringle); k.tringle = !k.tringle; if (k.tringle && !k.contenu) k.contenu = 'penderie'; }
  else if (op === 'split') { if (rules.split) return say(rules.split); const h = (num(k.hauteur_mm) - T) / 2; cs.splice(ref.ri, 1, { ...k, hauteur_mm: h, tringle: false }, { hauteur_mm: h, type: 'ouvert', contenu: '' }); }
  else if (op === 'mergeUp' || op === 'mergeDown') {
    const j = op === 'mergeUp' ? ref.ri + 1 : ref.ri - 1, o = cs[j]; if (!o) return;
    const merged = { ...k, hauteur_mm: num(k.hauteur_mm) + num(o.hauteur_mm) + T, tringle: !!(k.tringle || o.tringle) };
    cs.splice(Math.min(ref.ri, j), 2, merged); ref.ri = Math.min(ref.ri, j);
  } else if (op === 'up' || op === 'down') { const j = op === 'up' ? ref.ri + 1 : ref.ri - 1; [cs[ref.ri], cs[j]] = [cs[j], cs[ref.ri]]; ref.ri = j; }
  else if (op === 'left' || op === 'right') { const cols = X.m.colonnes, j = op === 'left' ? ref.ci - 1 : ref.ci + 1; [cols[ref.ci], cols[j]] = [cols[j], cols[ref.ci]]; ref.ci = j; }
  X.p.edited = true; E.state = {}; S.cellMsg = ''; try { localStorage.setItem('snug.edited', '1'); } catch {}
  refreshAll(); if (E.inited) build3D(); renderCell(); renderTabs();
  renderWarn(X.p);
}

/* The warnings of a proposal. When the user asked for ready-made cabinets and none fits, the first card says which
   measure blocks and offers to set the zone to the nearest values that would work, then designs again. */
function renderWarn(p) {
  const el = $('#pWarn'); el.innerHTML = ''; el.hidden = !p.attention;
  if (!p.attention) return;
  const fix = Array.isArray(p.caissonFix) ? p.caissonFix : [];
  const rest = fix.length ? fix.reduce((t, f) => t.replace(f.text, ''), p.attention).replace(/\s+/g, ' ').trim() : p.attention;
  fix.forEach((f) => {
    const card = document.createElement('div'); card.className = 'fixcard';
    const need = [f.C && ['C', 'profondeur', f.C], f.B && ['B', 'hauteur', f.B], f.A && ['A', 'largeur', f.A]].filter(Boolean);
    card.innerHTML = `<b>Pas de caisson tout fait dans la zone ${f.zone}</b><p>Le plus proche de vos cotes : <b>${escH(f.nom)}</b>. Il faudrait ${need.map(([k, l, v]) => `${l} <b>${Math.round(v).toLocaleString('fr-FR')} mm</b> (${k})`).join(' et ')}. En attendant, cette partie est prévue en panneaux découpés.</p>
      <div class="rowb"><button type="button" class="btn primary sm fixApply">Reprendre avec ces cotes</button><button type="button" class="btn ghost sm fixEdit">Revoir mes cotes</button></div>`;
    card.querySelector('.fixApply').onclick = () => { const z = S.zones[f.zone - 1]; if (!z) return; const m = zMan(z); if (f.A) { z.A = f.A; m.A = true; } if (f.B) { z.B = f.B; m.B = true; } if (f.C) { z.C = f.C; m.C = true; } toast('Cotes ajustées pour un caisson tout fait'); generate(); };
    card.querySelector('.fixEdit').onclick = () => { show(1); S.sel = f.zone - 1; renderZones(); drawCotes(); };
    el.appendChild(card);
  });
  if (rest) { const t = document.createElement('div'); t.textContent = 'Attention : ' + rest; el.appendChild(t); }
}

/* ================= design: the rules engine computes the three proposals on the phone ================= */
function initCustom(i) {
  const f = (S.result[i] && S.result[i].finitions) || {}; const ok = (list, id, d) => list.some((x) => x.id === id) ? id : d;
  S.custom[i] = { structure: ok(FIN, f.structure, 'pin'), facades: ok(FIN, f.facades, 'chene'), plateau: ok(FIN, f.plateau, 'chene'),
    poignee: ok(HANDLES, f.poignee, 'barre_fine'), hfin: ok(HFIN, f.finition_poignee, 'noir'), pieds: ok(FEET, f.pieds, 'carre_bois') };
}
function abortAll() {}
function generate() {
  S.result = [null, null, null]; S.custom = [null, null, null]; S.active = -1; E.framed = false; E.state = {}; S.nstep = 0;
  S.genZones = S.zones.map((z) => ({ ...z }));
  $('#propTabs').innerHTML = ''; $('#errBox').hidden = true;
  try {
    S.result = ENG.design({ project: S.project, items: curItems(), custom: curCustom(), zones: S.genZones, fab: S.fab, level: S.level, tools: [...S.tools], shops: [...S.shops], ambiance: S.ambiance });
    S.result.forEach((_, i) => initCustom(i));
    S.active = 1; renderResult();
  } catch (e) {
    if (window.SNUG_DEBUG) console.error('generate', e);
    $('#result').hidden = true; $('#errBox').textContent = 'Impossible de concevoir ce meuble avec ces cotes. Vérifiez la largeur, la hauteur et la profondeur de chaque zone.'; $('#errBox').hidden = false;
  }
}

/* ================= notice: parts, hardware, steps (computed from the plan) ================= */
const mmTxt = (...v) => v.map((x) => Math.round(x)).join(' × ') + ' mm';
function noticeFor(p, cu) {
  const multi = p.modules.length > 1, hwTot = {}, tools = new Set(['Mètre ruban', 'Crayon', 'Équerre de menuisier', 'Visseuse', 'Embout PZ2']);
  const steps = [], partsAll = [], mods = [];
  const h = handleById(cu.poignee), feet = feetById(cu.pieds);
  const T_ = (...t) => t.forEach((x) => tools.add(x));
  p.modules.forEach((m, mi) => {
    const z = zoneFor(m, mi) || DEFZ, L = layoutModule(m, z), fr = frontsOf(L, mi), W = L.W, D = L.D, t = L.t;
    const pre = multi ? `${mi + 1}-` : ''; let n = 0; const parts = [];
    const P = (nom, dims, box, role, extra) => { const o = { code: pre + (++n), nom, dims, box, role, mod: mi, ...(extra || {}) }; parts.push(o); return o; };
    const hw = {}; const H = (c, q) => { if (!q) return; hw[c] = (hw[c] || 0) + q; hwTot[c] = (hwTot[c] || 0) + q; };
    const mod = { mi, L, parts, label: multi ? `Module ${mi + 1} · ` : '' };
    const legsOn = L.legs > 0 && !L.raised, hidden = legsOn && feet.hidden;
    const legBoxes = legsOn && !hidden ? legXs(L).flatMap((x) => [[x, 0, 40, 50, L.legs, 50], [x, 0, D - 90, 50, L.legs, 50]]) : [];
    const nLegs = legsOn ? legXs(L).length * 2 : 0;
    let fond = null, cg = null, cd = null; const divs = [], shel = [], cais = [];
    if (!L.caissons) {
      fond = P('Fond', mmTxt(W, D - 6, t), [0, L.legs, 6, W, t, D - 6], 'struct');
      cg = P('Côté gauche', mmTxt(L.y1 - L.y0, D - 6, t), [0, L.y0, 6, t, L.y1 - L.y0, D - 6], 'struct');
      cd = P('Côté droit', mmTxt(L.y1 - L.y0, D - 6, t), [W - t, L.y0, 6, t, L.y1 - L.y0, D - 6], 'struct');
      L.dividers.forEach((x, i) => divs.push(P(`Séparation ${i + 1}`, mmTxt(L.y1 - L.y0, D - 6, t), [x, L.y0, 6, L.divT, L.y1 - L.y0, D - 6], 'struct', { xpos: x })));
      L.shelves.forEach((s, i) => shel.push(P(`Étagère ${i + 1}`, mmTxt(s.w, D - 26, t), [s.x, s.y, 6, s.w, t, D - 26], 'struct', { s })));
    } else {
      L.boxes.forEach((b, i) => cais.push(P(b.ref || `Caisson ${i + 1}`, mmTxt(b.x1 - b.x0, L.y1 - L.legs, D - 6), [b.x0, L.legs, 6, b.x1 - b.x0, L.y1 - L.legs, D - 6], 'caisson', { ref: b.ref })));
    }
    const dos = !L.caissons ? P('Dos, panneau 5 mm', mmTxt(W, L.y1 - L.legs, 5), [0, L.legs, 0, W, L.y1 - L.legs, 6], 'dos') : null;
    const plat = P('Plateau', mmTxt(W + 0, D + 12, L.topT), [0, L.H - L.topT, 0, W, L.topT, D + 12], 'plateau');
    const plinth = hidden ? P(feet.inset ? 'Socle en retrait' : 'Plinthe', mmTxt(W - 2 * feet.inset, L.legs, 18), [feet.inset, 0, D - 18 - feet.inset, W - 2 * feet.inset, L.legs, 18], 'plinthe') : null;
    const fronts = fr.map((f, i) => {
      const nom = { porte: 'Porte', tiroir: 'Façade de tiroir', abattant: 'Abattant', caisse: 'Caisse' }[f.kind];
      return f.kind === 'caisse' ? P(`${nom} ${i + 1}`, mmTxt(f.w, f.h, f.d), [f.x, f.y, D - f.d - 14, f.w, f.h, f.d], 'caisse', { f })
        : P(`${nom} ${i + 1}`, mmTxt(f.w, f.h, 18), [f.x, f.y, D, f.w, f.h, 18], 'facade', { f });
    });
    const dboxes = fr.filter((f) => f.kind === 'tiroir').map((f, i) => { const bd = Math.max(100, D - 70), bh = Math.max(40, Math.min(f.h - 30, 180)); return P(`Caisson de tiroir ${i + 1} (4 pièces)`, mmTxt(f.w - 40, bd, bh), [f.x + 20, f.y + 10, D - bd, f.w - 40, bh, bd], 'tiroirbox', { f }); });
    let shown = [];
    const st = (o) => { const news = (o.add || []).map((x) => x.code); const show = shown.concat(news); shown = show; steps.push({ mod, title: mod.label + o.title, show, news, explode: o.explode || null, extra: o.extra || [], markers: o.markers || [], hw: o.hw || [], tools: o.tools || [], text: o.text || [], links: o.links || [], view: o.view || 'front', all: !!o.all }); T_(...(o.tools || [])); };
    const legExtra = (isNew) => legBoxes.map((b) => ({ box: b, isNew }));
    // 1 — pieces
    st({ title: 'Vérifier les pièces', all: true, text: [
      'Étalez les pièces sur un carton ou une couverture pour ne pas les rayer.',
      'Vérifiez chaque pièce avec l’onglet Pièces : chaque repère est noté au crayon au dos de la pièce.',
      'Triez la quincaillerie par lettre (onglet Quincaillerie) dans des petits bols.'], extra: legExtra(false) });
    if (!L.caissons) {
      if (legsOn) {
        const q = hidden ? nLegs : nLegs; H(hidden ? 'W' : 'I', q); H('B', q * 4);
        st({ title: hidden ? 'Poser les vérins sous le fond' : 'Visser les pieds sous le fond', add: [fond], view: 'below', explode: null, extra: legExtra(true),
          markers: legXs(L).flatMap((x) => [[x + 25, L.legs, 65], [x + 25, L.legs, D - 65]]).map((p_) => ({ p: p_, c: hidden ? 'W' : 'I' })),
          hw: [[hidden ? 'W' : 'I', q], ['B', q * 4]], tools: ['Visseuse', 'Foret bois 3 mm'],
          text: hidden ? [`Retournez le fond ${fond.code}, face visible contre le sol.`, `Vissez ${q} vérins W à 40 mm des bords, chacun avec 4 vis B. Ils porteront le meuble derrière la plinthe.`]
            : [`Retournez le fond ${fond.code}, face visible contre le sol.`, `Placez les ${q} pieds « ${feet.nom.toLowerCase()} » à 20 mm des bords : ${legXs(L).length} à l’avant, ${legXs(L).length} à l’arrière.`, 'Pré-percez à 3 mm, puis vissez chaque pied avec 4 vis B.'] });
      }
      const sideMk = [t / 2, W - t / 2].flatMap((x) => [50, D / 2, D - 56].map((zz) => ({ p: [x, L.legs, zz], c: 'A', d: [0, 1, 0] })));
      H('A', 6);
      st({ title: 'Fixer les côtés sur le fond', add: [cg, cd], explode: [0, 220, 0], view: 'below', markers: sideMk, hw: [['A', 6]], tools: ['Foret bois 3 mm', 'Serre-joints'], extra: legExtra(false),
        text: [`Remettez le fond ${fond.code} à l’endroit.`, `Pré-percez le fond à 3 mm, à 9 mm du bord gauche et du bord droit : 3 trous de chaque côté, à 50 mm de l’avant, au milieu et à 50 mm de l’arrière.`,
          `Posez le côté gauche ${cg.code} et le côté droit ${cd.code} sur le fond, chants arrière alignés. Maintenez-les avec un serre-joint.`, 'Vissez par-dessous avec 3 vis A par côté, puis contrôlez l’équerre.'] });
      if (divs.length) {
        H('A', divs.length * 3);
        st({ title: 'Fixer les séparations', add: divs, explode: [0, 220, 0], hw: [['A', divs.length * 3]], tools: ['Foret bois 3 mm'], extra: legExtra(false),
          view: 'below', markers: divs.flatMap((d) => [50, D / 2, D - 56].map((zz) => ({ p: [d.xpos + L.divT / 2, L.legs, zz], c: 'A', d: [0, 1, 0] }))),
          text: [`Tracez l’axe de chaque séparation sur le fond : ${divs.map((d) => `${d.code} à ${R0(d.xpos + L.divT / 2)} mm du bord gauche`).join(', ')}.`, 'Pré-percez 3 trous par séparation sur l’axe, à 50 mm de l’avant, au milieu et à 50 mm de l’arrière.', 'Posez chaque séparation et vissez par-dessous avec 3 vis A.'] });
      }
      if (shel.length) {
        H('A', shel.length * 4);
        st({ title: 'Poser les étagères', add: shel, explode: [0, 0, 260], hw: [['A', shel.length * 4]], tools: ['Foret bois 3 mm', 'Niveau à bulle'], extra: legExtra(false),
          markers: shel.flatMap((o) => [[o.s.x - t, 1], [o.s.x + o.s.w + t, -1]].flatMap(([x, sx]) => [50, D - 76].map((zz) => ({ p: [x, o.s.y + t / 2, zz], c: 'A', d: [sx, 0, 0] })))),
          text: [`Tracez la hauteur de chaque étagère sur les montants : ${shel.map((o) => `${o.code} à ${R0(o.s.y - L.y0)} mm au-dessus du fond`).join(', ')}.`, 'Pré-percez 2 trous de chaque côté, à 50 mm de l’avant et de l’arrière, au milieu de l’épaisseur de l’étagère.', 'Glissez chaque étagère et vissez avec 2 vis A de chaque côté.'] });
      }
      const nC = Math.ceil(2 * (W + L.y1 - L.legs) / 150) + divs.length * 4; H('C', nC);
      st({ title: 'Poser le dos', add: [dos], explode: [0, 0, -240], view: 'back', hw: [['C', nC]], tools: ['Marteau'], extra: legExtra(false),
        markers: [[30, L.legs + 30], [W / 2, L.legs + 30], [W - 30, L.legs + 30], [30, L.y1 - 30], [W / 2, L.y1 - 30], [W - 30, L.y1 - 30]].map(([x, y]) => ({ p: [x, y, 0], c: 'C', d: [0, 0, 1] })),
        text: ['Mesurez les deux diagonales du meuble : elles doivent être égales, sinon poussez un angle jusqu’à ce qu’elles le soient.', `Posez le dos ${dos.code} à l’arrière, bord à bord.`, `Clouez-le avec ${nC} pointes C, une tous les 15 cm sur le pourtour et sur chaque séparation.`] });
    } else {
      st({ title: 'Monter les caissons', add: cais, explode: [0, 0, 0], tools: ['Visseuse', 'Marteau'],
        text: cais.map((c) => `Montez le caisson ${c.code} « ${c.nom} » en suivant sa notice d’origine, sans fixer les façades.`).concat(['Gardez les vis et taquets fournis avec chaque caisson : ils ne sont pas comptés dans la quincaillerie ci-dessous.']),
        links: cais.filter((c) => c.ref).map((c) => ({ label: `Notice et fiche : ${c.ref}`, url: shopUrl(/ikea/i.test(c.ref) ? 'IKEA' : (/castorama/i.test(c.ref) ? 'Castorama' : 'Leroy Merlin'), c.ref) })) });
      if (cais.length > 1) {
        const q = (cais.length - 1) * 4; H('V', q);
        st({ title: 'Assembler les caissons entre eux', explode: null, hw: [['V', q]], tools: ['Perceuse', 'Foret bois 5 mm', 'Serre-joints'],
          markers: L.dividers.flatMap((x) => [[L.y0 + 60, 80], [L.y0 + 60, D - 80], [L.y1 - 60, 80], [L.y1 - 60, D - 80]].map(([y, zz]) => ({ p: [x + L.divT / 2, y, zz], c: 'V' }))),
          text: ['Alignez les caissons côte à côte, faces avant au même niveau. Serrez-les deux à deux avec des serre-joints.', 'Percez à 5 mm à travers les deux côtés accolés, à 60 mm des angles : 4 trous par jonction.', `Assemblez avec ${q} vis de jonction V.`] });
      }
      if (legsOn) {
        const q = nLegs; H(hidden ? 'W' : 'I', q); H('B', q * 4);
        st({ title: hidden ? 'Poser les vérins' : 'Poser les pieds', view: 'below', extra: legExtra(true), hw: [[hidden ? 'W' : 'I', q], ['B', q * 4]], tools: ['Foret bois 3 mm'],
          markers: legXs(L).flatMap((x) => [[x + 25, L.legs, 65], [x + 25, L.legs, D - 65]]).map((p_) => ({ p: p_, c: hidden ? 'W' : 'I' })),
          text: ['Couchez l’ensemble des caissons sur le dos, sur une couverture.', hidden ? `Vissez ${q} vérins W sous les caissons à 40 mm des bords, 4 vis B chacun.` : `Vissez ${q} pieds « ${feet.nom.toLowerCase()} » sous les caissons à 20 mm des bords, 4 vis B chacun.`, 'Relevez le meuble.'] });
      }
    }
    const verts = L.caissons ? L.boxes.map((b) => b.x0 + t / 2).concat([W - t / 2]) : [t / 2, W - t / 2].concat(L.dividers.map((x) => x + L.divT / 2));
    const nE = verts.length * 2; H('E', nE); H('B', nE * 4);
    st({ title: 'Fixer le plateau', add: [plat], explode: [0, 240, 0], hw: [['E', nE], ['B', nE * 4]], tools: ['Foret bois 3 mm'], extra: legExtra(false),
      markers: verts.flatMap((x) => [80, D - 80].map((zz) => ({ p: [x, L.y1 - 15, zz], c: 'E' }))),
      text: [`Vissez 2 équerres E en haut de chaque montant, à 80 mm de l’avant et de l’arrière, avec 2 vis B dans le montant.`, `Posez le plateau ${plat.code} : il dépasse de 12 mm à l’avant et affleure à l’arrière. Centrez-le en largeur.`,
        `Vissez par-dessous à travers les équerres avec 2 vis B chacune${finById(cu.plateau).wood ? ', en utilisant les trous oblongs : le bois massif travaille' : ''}.`] });
    if (plinth) {
      H('B', 4);
      st({ title: feet.inset ? 'Poser le socle en retrait' : 'Poser la plinthe', add: [plinth], explode: [0, 0, 200], hw: [['B', 4]],
        markers: [[feet.inset + 60, L.legs / 2], [W - feet.inset - 60, L.legs / 2]].map(([x, y]) => ({ p: [x, y, D - feet.inset], c: 'B', follow: 1 })),
        text: ['Réglez les vérins pour que le meuble soit de niveau.', `Fixez ${plinth.nom.toLowerCase()} ${plinth.code} ${feet.inset ? `à ${feet.inset} mm en retrait de l’avant` : 'au ras de l’avant'} avec des petites équerres et des vis B.`] });
    }
    const doors = fronts.filter((x) => x.f && x.f.kind === 'porte');
    if (doors.length) {
      const nD = doors.reduce((s, d) => s + (d.f.h > 900 ? 3 : 2), 0); H('D', nD);
      st({ title: 'Poser les portes', add: doors, explode: [0, 0, 240], hw: [['D', nD]], tools: ['Perceuse', 'Mèche Forstner 35 mm', 'Tournevis cruciforme'], extra: legExtra(false),
        markers: doors.flatMap((d) => { const f = d.f, x = f.side === 'L' ? f.x + 22 : f.x + f.w - 22; const ys = f.h > 900 ? [f.y + 100, f.y + f.h / 2, f.y + f.h - 100] : [f.y + 100, f.y + f.h - 100]; return ys.map((y) => ({ p: [x, y, D + 18], c: 'D', follow: 1 })); }),
        text: [`Sur chaque porte (${doors.map((d) => d.code).join(', ')}), percez ${doors[0].f.h > 900 ? '3' : '2'} logements Ø 35 mm à la mèche Forstner, profondeur 12 mm, centre à 22 mm du bord côté charnière, à 100 mm du haut et du bas.`,
          'Vissez les charnières D dans les logements, puis les embases sur le montant, alignées sur les charnières.', 'Clipsez les portes et réglez les vis des charnières pour un jeu régulier de 3 mm.'] });
    }
    const flaps = fronts.filter((x) => x.f && x.f.kind === 'abattant');
    if (flaps.length) {
      H('D', flaps.length * 2); H('F', flaps.length);
      st({ title: 'Poser les abattants', add: flaps, explode: [0, 0, 240], hw: [['D', flaps.length * 2], ['F', flaps.length]], tools: ['Perceuse', 'Mèche Forstner 35 mm'],
        markers: flaps.flatMap((d) => [[d.f.x + 100, d.f.y + 22], [d.f.x + d.f.w - 100, d.f.y + 22]].map(([x, y]) => ({ p: [x, y, D + 18], c: 'D', follow: 1 }))),
        text: ['Percez 2 logements Ø 35 mm sur le chant bas de chaque abattant, à 100 mm des bords.', 'Posez les charnières D, puis un compas F de chaque côté pour retenir l’abattant ouvert.'] });
    }
    const drawers = fronts.filter((x) => x.f && x.f.kind === 'tiroir');
    if (drawers.length) {
      H('G', drawers.length); H('A', drawers.length * 8); H('B', drawers.length * 4);
      st({ title: 'Monter et poser les tiroirs', add: dboxes.concat(drawers), explode: [0, 0, 280], hw: [['G', drawers.length], ['A', drawers.length * 8], ['B', drawers.length * 4]], tools: ['Foret bois 3 mm'], extra: legExtra(false),
        markers: drawers.flatMap((d) => [d.f.c.x + 2, d.f.c.x + d.f.c.w - 2].map((x) => ({ p: [x, d.f.c.y + 30, D / 2], c: 'G' }))),
        text: ['Assemblez chaque caisson de tiroir (2 côtés, arrière, fond) avec 2 vis A par angle.',
          `Vissez les coulisses G sur les montants, à 30 mm au-dessus du bas de chaque case, à 2 mm en retrait de l’avant (vis fournies).`,
          `Fixez la façade (${drawers.map((d) => d.code).join(', ')}) sur son caisson par l’intérieur avec 4 vis B, en laissant 3 mm de jeu tout autour.`] });
    }
    const crates = fronts.filter((x) => x.role === 'caisse');
    if (crates.length) {
      H('P', crates.length * 4);
      st({ title: 'Placer les caisses', add: crates, explode: [0, 0, 280], hw: [['P', crates.length * 4]], extra: legExtra(false),
        text: ['Collez 4 patins feutre P sous chaque caisse : elles glisseront sans rayer.', `Glissez les caisses ${crates.map((c) => c.code).join(', ')} dans leurs cases.`] });
    }
    if (fronts.length && h.shape !== 'none') {
      const holes = fronts.flatMap((x) => handleHoles(x.f, h, D));
      const dTxt = h.shape === 'gorge' ? ['Vissez le profil gorge sur le chant haut de chaque façade, avec les vis fournies.']
        : h.shape === 'cut' ? ['Faites usiner une prise de main de 110 × 26 mm sur le chant haut de chaque façade (service découpe), ou à la défonceuse avec une fraise demi-ronde.']
        : h.shape === 'recess' ? ['Percez un logement Ø 40 mm, profondeur 12 mm à la mèche Forstner, à 40 mm du bord côté ouverture. Collez la cuvette.']
        : [h.ent ? `Tracez les trous de chaque poignée avec un gabarit : entraxe ${h.ent} mm.` : 'Tracez le trou de chaque bouton.',
          'Portes : à 40 mm du bord côté ouverture, à mi-hauteur. Tiroirs : centré, aux deux tiers de la hauteur. Caisses : centré, à 50 mm du haut.',
          'Percez Ø 4,5 mm de part en part, sur une cale martyre pour ne pas éclater le bois, puis vissez chaque poignée (vis fournies).'];
      H('H', fronts.length);
      st({ title: 'Poser les poignées', hw: [['H', fronts.length]], tools: h.shape === 'cut' ? ['Défonceuse'] : ['Perceuse', 'Foret bois 4,5 mm', 'Gabarit de perçage'], extra: legExtra(false),
        markers: holes.map((p_) => ({ p: p_, c: 'H' })), text: dTxt });
    }
    const rods = L.cells.filter((c) => c.rod);
    if (rods.length) {
      H('T', rods.length); H('B', rods.length * 4);
      st({ title: 'Poser les tringles', hw: [['T', rods.length], ['B', rods.length * 4]], tools: ['Scie à métaux', 'Foret bois 3 mm'], extra: legExtra(false),
        markers: rods.flatMap((c) => [c.x + 6, c.x + c.w - 6].map((x) => ({ p: [x, c.y + c.h - 60, D / 2], c: 'T' }))),
        text: [`Recoupez chaque tringle T à la scie à métaux : ${rods.map((c) => `${R0(c.w - 4)} mm`).join(', ')}.`,
          `Vissez les supports sur les montants, à 60 mm sous le haut de la case et à ${R0(D / 2)} mm du fond, avec 2 vis B chacun.`, 'Posez la tringle dans ses supports, puis vérifiez le niveau.'] });
    }
    const pcs = L.details.filter((d) => d.type === 'passe_cable'), aer = L.details.filter((d) => d.type === 'aeration');
    if (pcs.length || aer.length) {
      H('J', pcs.length);
      st({ title: 'Passe-câbles et aérations', view: pcs.some((d) => d.face === 'arriere') || aer.length ? 'back' : 'front', hw: [['J', pcs.length]], tools: ['Perceuse', 'Scie cloche Ø 60 mm'].concat(aer.length ? ['Scie sauteuse'] : []), extra: legExtra(false),
        markers: pcs.map((d) => ({ p: d.face === 'plateau' ? [d.x, L.H, d.y] : [d.x, d.y, 0], c: 'J' })).concat(aer.map((d) => ({ p: [d.x, d.y, 0], c: '≡' }))),
        text: pcs.map((d) => d.face === 'plateau' ? `Plateau : percez Ø ${d.dia} mm à la scie cloche, centre à ${R0(d.x)} mm du bord gauche et ${R0(d.y)} mm du bord arrière. Emboîtez le passe-câble J.` : `Dos : percez Ø ${d.dia} mm à la scie cloche, centre à ${R0(d.x)} mm du bord gauche et ${R0(d.y)} mm du bas du meuble. Emboîtez le passe-câble J.`)
          .concat(aer.map((d) => `Aération : découpez des fentes sur ${R0(d.w)} × ${R0(d.h)} mm dans le dos, centrées à ${R0(d.x)} mm du bord gauche et ${R0(d.y)} mm du bas (perçages Ø 10 mm en ligne, ou scie sauteuse).`)) });
    }
    mods.push(mod); partsAll.push(...parts);
    const fins = new Map(); [['structure', 'structure'], ['plateau', 'plateau'], ['facades', 'façades']].forEach(([k, lab]) => { if (!fins.has(cu[k])) fins.set(cu[k], []); fins.get(cu[k]).push(lab); });
    st({ title: 'Finitions', tools: ['Ponceuse ou cale à poncer', 'Papier abrasif grain 180', 'Pinceau ou chiffon'], extra: legExtra(false),
      text: ['Poncez toutes les faces visibles au grain 180 dans le sens du fil, puis dépoussiérez.'].concat([...fins].map(([id, labs]) => { const f = finById(id); return f.id === 'blanc' ? `${labs.join(', ')} : mélaminé blanc déjà fini, essuyez simplement.` : f.wood ? `${labs.join(', ')} : appliquez l’huile ${f.id === 'pin' || f.id === 'bouleau' ? 'incolore' : 'teintée ' + f.nom.toLowerCase()} en 2 couches, 6 h de séchage entre les deux.` : `${labs.join(', ')} : sous-couche, puis 2 couches de peinture ${f.nom.toLowerCase()}, 4 h de séchage entre les deux.`; })) });
    H('K', 2);
    st({ title: 'Mettre en place et fixer au mur', view: 'back', hw: [['K', 2]], tools: ['Niveau à bulle', 'Perceuse', 'Foret adapté au mur 6 mm', 'Chevilles adaptées au mur'], extra: legExtra(false),
      markers: [[W * .2, L.y1 - 30, 0], [W * .8, L.y1 - 30, 0]].map((p_) => ({ p: p_, c: 'K' })),
      text: [L.raised ? `Tracez au mur la ligne du dessous du meuble à ${R0(num(z.D))} mm du sol, au niveau.` : `Placez le meuble et vérifiez le niveau${hidden ? ' : réglez les vérins' : ''}.`, 'Vissez 2 fixations anti-basculement K en haut du dos, à 20 % et 80 % de la largeur, puis fixez-les au mur avec des chevilles adaptées (placo, brique ou béton).',
        feet.hidden && robotWanted() ? 'Attention : avec des pieds cachés, le robot aspirateur ne passera plus sous le meuble.' : ''].filter(Boolean) });
  });
  if (multi) steps.push({ mod: null, title: 'Assembler les modules', show: [], news: [], markers: [], hw: [], tools: [], extra: [], text: ['Placez les modules à leur emplacement, dans l’ordre des zones dessinées sur la photo.', 'Contrôlez l’alignement des façades et des plateaux, puis serrez les fixations murales.'] });
  return { steps, parts: partsAll, mods, hw: hwTot, tools: [...tools] };
}

/* ================= results: list, tabs, customisation ================= */
function currentProp() { return S.active >= 0 ? S.result[S.active] : null; }
const eur = (n) => (Math.round((+n || 0) * 100) / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: (+n % 1) ? 2 : 0 });
function shopUrl(enseigne, q) {
  // Straight to the shop's own site: its search page, already filled with the article. (A real product page replaces
  // this link whenever api/products finds one.) Sizes like "250 x 60" are dropped: shop searches choke on them.
  const e = (enseigne || '').toLowerCase();
  const words = String(q || '').replace(/IKEA |Leroy Merlin |Castorama |But /gi, '').trim();
  const plain = encodeURIComponent(words.replace(/\b\d{2,}\s*[x×]\s*\d{2,}(?:\s*[x×]\s*\d{2,})?\s*(?:cm|mm)?(?=\s|$)/gi, ' ').replace(/\s+/g, ' ').trim() || words);
  if (e.includes('ikea')) return 'https://www.ikea.com/fr/fr/search/?q=' + encodeURIComponent(words);
  if (e.includes('leroy')) return 'https://www.leroymerlin.fr/search?q=' + plain;
  if (e.includes('casto')) return 'https://www.castorama.fr/search?term=' + plain;
  return 'https://www.google.com/search?q=' + encodeURIComponent(e.includes('but') ? `${words} site:but.fr` : `${enseigne || ''} ${words}`.trim());
}
function hwName(c, cu) { if (c === 'H') { const h = handleById(cu.poignee); return `Poignée ${h.nom}, ${hfinById(cu.hfin).nom.toLowerCase()}`; } if (c === 'I') return `Pied ${feetById(cu.pieds).nom.toLowerCase()}`; return (HW[c] || {}).nom || c; }
/* Materials bought by the sheet or by the board: estimated from the parts of the notice, so they follow the plan and the finishes */
const SHEETS = {
  pin: { nom: 'Panneau pin lamellé-collé 18 mm, 250 × 60 cm', rech: 'panneau pin lamellé collé 18 mm 250 x 60', L: 2500, l: 600, prix: 42.9 },
  chene: { nom: 'Panneau chêne lamellé-collé 18 mm, 250 × 60 cm', rech: 'panneau chêne lamellé collé 18 mm', L: 2500, l: 600, prix: 119 },
  noyer: { nom: 'Panneau plaqué noyer 19 mm, 250 × 122 cm', rech: 'panneau plaqué noyer 19 mm', L: 2500, l: 1220, prix: 169 },
  bouleau: { nom: 'Contreplaqué bouleau 18 mm, 250 × 125 cm', rech: 'contreplaqué bouleau 18 mm', L: 2500, l: 1250, prix: 89 },
  blanc: { nom: 'Panneau mélaminé blanc 18 mm, 250 × 122 cm', rech: 'panneau mélaminé blanc 18 mm 250 x 122', L: 2500, l: 1220, prix: 39 },
  mdf: { nom: 'Panneau MDF 19 mm à peindre, 250 × 122 cm', rech: 'panneau mdf 19 mm 250 x 122', L: 2500, l: 1220, prix: 45 },
  ply12: { nom: 'Contreplaqué peuplier 12 mm, 250 × 122 cm', rech: 'contreplaqué peuplier 12 mm', L: 2500, l: 1220, prix: 39 },
  ply5: { nom: 'Contreplaqué peuplier 5 mm, 250 × 122 cm', rech: 'contreplaqué peuplier 5 mm', L: 2500, l: 1220, prix: 19 },
};
const sheetKey = (finId) => ({ pin: 'pin', chene_clair: 'chene', chene: 'chene', chene_fume: 'chene', teck: 'noyer', noyer: 'noyer', bouleau: 'bouleau', blanc: 'blanc' }[finId] || 'mdf');
function boardFor(finId, th) {
  const k = sheetKey(finId);
  if (k === 'pin') return th <= 20 ? SHEETS.pin : { nom: 'Plan de travail pin massif 28 mm, 250 × 65 cm', rech: 'plan de travail pin massif 28 mm', L: 2500, l: 650, prix: 79 };
  if (k === 'chene') return th <= 28 ? { nom: 'Plan de travail chêne massif 26 mm, 250 × 65 cm', rech: 'plan de travail chêne massif 26 mm 250 x 65', L: 2500, l: 650, prix: 99 }
    : { nom: 'Plan de travail chêne lamellé 38 mm, 300 × 65 cm', rech: 'plan de travail chêne lamellé 38 mm 300 x 65', L: 3000, l: 650, prix: 329 };
  if (k === 'noyer') return { nom: 'Plan de travail noyer massif 38 mm, 300 × 65 cm', rech: 'plan de travail noyer massif', L: 3000, l: 650, prix: 389 };
  if (k === 'bouleau') return SHEETS.bouleau;
  if (k === 'blanc') return th <= 20 ? SHEETS.blanc : { nom: 'Plan de travail stratifié blanc 38 mm, 300 × 65 cm', rech: 'plan de travail stratifié blanc 38 mm', L: 3000, l: 650, prix: 69 };
  return th <= 20 ? SHEETS.mdf : { nom: 'Panneau MDF 30 mm à peindre, 250 × 122 cm', rech: 'panneau mdf 30 mm', L: 2500, l: 1220, prix: 79 };
}
const faceArea = (b) => { const d = [b[3], b[4], b[5]].sort((x, y) => y - x); return d[0] * d[1] / 1e6; };
function materialLines(p, cu, N, mg) {
  const out = [], sheets = new Map();
  const add = (sh, m2, what) => { const g = sheets.get(sh) || { m2: 0, what: new Set() }; g.m2 += m2; what.forEach((w) => g.what.add(w)); sheets.set(sh, g); };
  const by = (role) => N.parts.filter((x) => x.role === role);
  const struct = by('struct'), fronts = by('facade'), boxes = by('tiroirbox'), backs = by('dos');
  if (struct.length) add(SHEETS[sheetKey(cu.structure)], struct.reduce((a, x) => a + faceArea(x.box), 0), ['structure']);
  if (fronts.length) {
    if (p.systeme) { const m2 = fronts.reduce((a, x) => a + faceArea(x.box), 0); out.push({ qte: fronts.length, article: `Façades ${p.systeme.nom} (portes et tiroirs)`, enseigne: p.systeme.shop, recherche: `${p.systeme.nom.replace(/^IKEA\s+/, '')} façade`, detail: 'aux tailles des caissons, à recouper si besoin', prix: Math.max(fronts.length * 15, m2 * p.systeme.front) }); }
    else add(SHEETS[sheetKey(cu.facades)], fronts.reduce((a, x) => a + faceArea(x.box), 0), ['façades']);
  }
  if (boxes.length) add(SHEETS.ply12, boxes.reduce((a, x) => { const [, , , w, h, d] = x.box; return a + (2 * h * d + 2 * w * h + w * d) / 1e6; }, 0), ['caissons de tiroir']);
  if (backs.length) add(SHEETS.ply5, backs.reduce((a, x) => a + faceArea(x.box), 0), ['dos']);
  sheets.forEach((g, sh) => { const q = Math.max(1, Math.ceil(g.m2 * 1.2 / (sh.L * sh.l / 1e6)));
    out.push({ qte: q, article: sh.nom, enseigne: mg, recherche: sh.rech, detail: `${[...g.what].join(', ')} · ${g.m2.toFixed(2).replace('.', ',')} m² + 20 % de chutes`, prix: q * sh.prix }); });
  const tops = new Map();
  by('plateau').forEach((x) => { const [, , , w, th, d] = x.box, b = boardFor(cu.plateau, th);
    const strips = Math.max(1, Math.floor(b.l / Math.max(1, d))), pieces = Math.ceil(w / b.L) * Math.max(1, Math.ceil(d / b.l));
    const g = tops.get(b.nom) || { b, n: 0, cuts: [] }; g.n += Math.ceil(pieces / strips); g.cuts.push(`${R0(w)} × ${R0(d)} mm`); tops.set(b.nom, g); });
  tops.forEach(({ b, ...g }) => out.push({ qte: g.n, article: b.nom, enseigne: mg, recherche: b.rech, detail: `plateau recoupé à ${g.cuts.join(', ')}`, prix: g.n * b.prix }));
  const crates = by('caisse').length;
  if (crates) out.push({ qte: crates, article: 'Caisse en bois de pin, type caisse à vin', enseigne: mg, recherche: 'caisse bois pin rangement', detail: 'si vous n’en avez pas déjà', prix: crates * 12 });
  const saw = S.tools.has('Scie circulaire') || S.tools.has('Scie sauteuse');
  const cuts = struct.length + fronts.length * (p.systeme ? 0 : 1) + boxes.length * 4 + backs.length + by('plateau').length;
  if ((struct.length || (fronts.length && !p.systeme)) && (!saw || S.level === 'debutant')) out.push({ qte: 1, article: `Découpe des panneaux en magasin (≈ ${cuts} coupes)`, enseigne: mg, recherche: 'service découpe bois', detail: 'tarif indicatif, selon le magasin', prix: cuts });
  return out;
}
function linesFor(i) {
  const p = S.result[i], cu = S.custom[i]; if (!p || !cu) return [];
  const mg = p.magasin || 'Leroy Merlin';
  const out = p.liste.map((it) => ({ qte: it.qte, article: it.article || '', enseigne: it.enseigne || '', recherche: it.recherche || it.article || '', detail: it.detail || '', prix: num(it.prix) }));
  const N = noticeFor(p, cu), h = handleById(cu.poignee), feet = feetById(cu.pieds);
  out.push(...materialLines(p, cu, N, mg));
  if (N.hw.H && h.prix > 0) out.push({ qte: N.hw.H, article: hwName('H', cu), enseigne: mg, recherche: `poignée meuble ${h.nom} ${hfinById(cu.hfin).nom}`, detail: 'votre choix, repère H', prix: N.hw.H * h.prix });
  if (N.hw.I) out.push({ qte: N.hw.I, article: hwName('I', cu), enseigne: mg, recherche: `pied meuble ${feet.nom}`, detail: 'votre choix, repère I', prix: N.hw.I * feet.prix });
  if (feet.hidden && N.parts.some((x) => x.role === 'plinthe')) out.push({ qte: 1, article: 'Tablette bois 18 mm pour la plinthe', enseigne: mg, recherche: 'tablette bois 18 mm 250 x 20', detail: 'découpe en magasin', prix: 15 });
  Object.keys(HW).forEach((c) => { const q = N.hw[c]; if (!q) return; const it = HW[c]; const packs = Math.ceil(q / it.pack);
    out.push({ qte: packs, article: `${it.nom}, ${it.unit}`, enseigne: mg, recherche: it.rech, detail: `repère ${c} · ${q} nécessaire${q > 1 ? 's' : ''}`, prix: packs * it.pp }); });
  const allCais = p.modules.every((m) => m.fabrication === 'caissons');
  const used = new Map(); [['structure', 'structure'], ['plateau', 'plateau'], ['facades', 'façades']].forEach(([k, lab]) => {
    if (k === 'structure' && allCais) return; if (k === 'facades' && p.systeme) return; if (k === 'facades' && !N.parts.some((x) => x.role === 'facade')) return;
    const id = cu[k]; if (id === 'blanc') return; if (!used.has(id)) used.set(id, []); used.get(id).push(lab); });
  used.forEach((labs, id) => {
    const f = finById(id), clear = f.id === 'pin' || f.id === 'bouleau';
    out.push(f.wood
      ? { qte: 1, article: `Huile ${clear ? 'incolore' : 'teintée ' + f.nom.toLowerCase()} pour bois, 0,5 L`, enseigne: mg, recherche: `huile bois ${clear ? 'incolore' : 'teintée ' + f.nom}`, detail: labs.join(', '), prix: 22 }
      : { qte: 1, article: `Peinture spéciale meuble ${f.nom.toLowerCase()}, 0,5 L`, enseigne: mg, recherche: `peinture meuble ${f.nom}`, detail: labs.join(', '), prix: 25 });
  });
  return out;
}
function renderTabs() {
  const tabs = $('#propTabs');
  if (!tabs.children.length) VARIANTS.forEach((v, i) => { const b = document.createElement('button'); b.type = 'button'; b.onclick = () => { if (S.result[i] && S.active !== i) { S.active = i; E.framed = false; S.nstep = 0; S.selCell = null; $('#cellSheet').hidden = true; renderResult(); } }; tabs.appendChild(b); });
  [...tabs.children].forEach((b, i) => {
    const ready = !!S.result[i]; b.disabled = !ready; b.setAttribute('aria-pressed', String(i === S.active));
    b.innerHTML = '<span></span><b></b>'; b.querySelector('span').textContent = VARIANTS[i].nom;
    b.querySelector('b').textContent = ready ? eur(linesFor(i).reduce((a, l) => a + l.prix, 0)) : '—';
  });
}
function renderResult() {
  const p = currentProp(); renderTabs(); if (!p) return;
  $('#result').hidden = false; if (S.selCell && !cellCtx(S.selCell)) { S.selCell = null; $('#cellSheet').hidden = true; }
  const d = clamp(Math.round(+p.difficulte || 2), 1, 3); $('#pDiff').textContent = ['Facile', 'Moyen', 'Avancé'][d - 1]; $('#pDiff').className = 'pill d' + d;
  $('#pTime').textContent = p.duree || ''; $('#pResume').textContent = p.resume || '';
  const Ls = p.modules.map((m, mi) => layoutModule(m, zoneFor(m, mi)));
  const wTot = Ls.reduce((a, L) => a + L.W, 0), hMax = Math.max(...Ls.map((L) => L.H)), dMax = Math.max(...Ls.map((L) => L.D));
  $('#pDims').innerHTML = [['Largeur', wTot], ['Hauteur', hMax], ['Prof.', dMax]].map(([k, v]) => `<div><span>${k}</span><b>${R0(v).toLocaleString('fr-FR')}</b></div>`).join('');
  $('#pShops').textContent = `${[...new Set(linesFor(S.active).map((l) => l.enseigne).filter(Boolean))].join(' + ')} · ${Ls.some((L) => L.caissons) ? 'caissons du commerce' : 'panneaux sur mesure'} · ${Ls.map((L) => `${R0(L.W)} × ${R0(L.H)} × ${R0(L.D)} mm`).join(', ')}`;
  const det = Ls.flatMap((L) => L.details).map((x) => x.type === 'passe_cable' ? `passe-câble Ø ${x.dia} mm (${x.face === 'plateau' ? 'plateau' : 'dos'})` : x.type === 'aeration' ? 'aération à l’arrière' : 'fixation anti-basculement');
  $('#pDetails').hidden = !det.length; $('#pDetails').textContent = det.length ? 'Prévu sur le meuble : ' + [...new Set(det)].join(', ') + '.' : '';
  renderWarn(p);
  refreshAll();
  document.querySelectorAll('#panes .pane').forEach((x) => { x.hidden = x.dataset.pane !== S.pane; });
  renderCfgNav();
  renderView();
  let seen = false; try { seen = !!localStorage.getItem('snug.edited'); } catch {}
  if (!seen && !S.tipShown && S.view === '3d') { S.tipShown = true; setTimeout(() => { if (S.step === 4 && !S.selCell) setEditMode(true); }, 900); }
}
const PANES = [['modele', 'Modèle'], ['matieres', 'Matières'], ['pieds', 'Pieds'], ['poignees', 'Poignées'], ['liste', 'Liste de courses'], ['notice', 'Notice']];
function renderCfgNav() {
  const nav = $('#cfgNav'); const cur = PANES.findIndex((x) => x[0] === S.pane);
  if (!nav.children.length) PANES.forEach(([id, label], i) => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = `<i>${i + 1}</i><span></span>`; b.querySelector('span').textContent = label; b.onclick = () => goPane(id, i < PANES.findIndex((x) => x[0] === S.pane) ? -1 : 1); nav.appendChild(b); });
  [...nav.children].forEach((b, i) => { b.classList.toggle('done', i < cur); if (i === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  const on = nav.children[cur]; if (on) nav.scrollTo({ left: on.offsetLeft - nav.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' });
  updateBar();
}
function updateBar() {
  if (S.step !== 4 || !currentProp()) return;
  const i = PANES.findIndex((x) => x[0] === S.pane);
  $('#backBtn').hidden = false; $('#backBtn').textContent = i > 0 ? '← ' + PANES[i - 1][1] : 'Retour';
  $('#nextBtn').textContent = i < PANES.length - 1 ? PANES[i + 1][1] + ' →' : 'Enregistrer';
}
function goPane(id, dir) {
  S.pane = id;
  document.querySelectorAll('#panes .pane').forEach((p) => { const on = p.dataset.pane === id; p.hidden = !on; if (on) { p.classList.toggle('back', dir < 0); p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; } });
  renderCfgNav();
  if (id === 'notice') renderNotice();
  const top = $('#panes').getBoundingClientRect().top + window.scrollY - $('.navbar').offsetHeight - 12;
  if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top) });
}
(function () {
  const el = $('#panes'); let t0 = null;
  el.addEventListener('touchstart', (e) => { const t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY }; }, { passive: true });
  el.addEventListener('touchend', (e) => {
    if (!t0) return; const t = e.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y; t0 = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6 || e.target.closest('.tablewrap,.hgrid,.cfgnav')) return;
    const i = PANES.findIndex((x) => x[0] === S.pane), j = clamp(i + (dx < 0 ? 1 : -1), 0, PANES.length - 1); if (j !== i) goPane(PANES[j][0], dx < 0 ? 1 : -1);
  });
})();
function refreshAll() { S.notice = noticeFor(currentProp(), S.custom[S.active]); renderCustom(); renderList(); if (S.pane === 'notice') renderNotice(); }
function renderList() {
  const lines = linesFor(S.active); const tb = $('#pList'); tb.innerHTML = ''; let tot = 0;
  lines.forEach((it) => {
    tot += it.prix; const tr = document.createElement('tr');
    const a = document.createElement('td'); a.className = 'n'; a.textContent = (it.qte ?? '') + '×';
    const b = document.createElement('td'); b.textContent = it.article;
    const s = document.createElement('span'); s.className = 'sub'; s.textContent = [it.enseigne, it.detail].filter(Boolean).join(' · '); b.appendChild(s);
    const pr = productOf(it);
    if (pr && pr.image) { const im = document.createElement('img'); im.className = 'pthumb'; im.alt = ''; im.loading = 'lazy'; im.referrerPolicy = 'no-referrer'; im.src = pr.image; im.onerror = () => im.remove(); b.prepend(im); }
    if (pr && pr.name) { const pn = document.createElement('span'); pn.className = 'sub pname'; pn.textContent = pr.name + (pr.price ? ` · ${eur(+pr.price)} pièce` : ''); b.appendChild(pn); }
    const l = document.createElement('a'); l.href = linkOf(it); l.target = '_blank'; l.rel = 'noopener'; l.textContent = pr && pr.url ? `Voir le produit chez ${it.enseigne} ↗` : `Chercher chez ${it.enseigne || 'le vendeur'} ↗`; b.appendChild(l);
    const c = document.createElement('td'); c.className = 'n'; c.textContent = eur(it.prix);
    tr.append(a, b, c); tb.appendChild(tr);
  });
  loadProducts(lines);
  const want = lines.filter((it) => /ikea|leroy|casto/i.test(it.enseigne || '')), got = want.filter((it) => productOf(it)).length;
  $('#pPhotos').textContent = !want.length ? '' : got === want.length ? '' : prodBusy ? 'Recherche des photos et des fiches produits…' : S.prodFail ? 'Photos et fiches indisponibles pour le moment (le site du magasin n’a pas répondu). Les liens ouvrent la recherche sur son site.' : `${got} / ${want.length} fiches produits trouvées.`;
  $('#pTotal').textContent = eur(tot); $('#pPrice').textContent = '≈ ' + eur(tot); $('#pPrice2').textContent = '≈ ' + eur(tot);
}
/* Real products for the list (photo, name, price, direct page), found by api/products and kept in this browser. */
const PKEY = 'snug.products.v2'; let PROD = {}; try { PROD = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch { PROD = {}; }
const pkey = (it) => `${(it.enseigne || '').toLowerCase()}|${String(it.recherche || it.article).toLowerCase()}`;
const productOf = (it) => { const v = PROD[pkey(it)]; return v && v.found ? v.found : null; };
const linkOf = (it) => { const p = productOf(it); return p && p.url ? p.url : shopUrl(it.enseigne, it.recherche); };
let prodBusy = false;
async function loadProducts(lines) {
  const want = lines.filter((it) => /ikea|leroy|casto/i.test(it.enseigne || '') && !(PROD[pkey(it)] && (PROD[pkey(it)].found || Date.now() - PROD[pkey(it)].at < 6e5)));
  if (!want.length || prodBusy) return; prodBusy = true;
  try {
    const res = await fetch('api/products', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: want.map((it) => ({ k: pkey(it), shop: it.enseigne, q: String(it.recherche || it.article).replace(/^(IKEA|Leroy Merlin|Castorama)\s+/i, '') })) }) });
    if (!res.ok) { S.prodFail = true; return; } const d = await res.json(); S.prodFail = !(d.results || []).some((r) => r.found);
    (d.results || []).forEach((r) => { PROD[r.k] = { found: r.found, at: Date.now() }; });
    try { localStorage.setItem(PKEY, JSON.stringify(PROD)); } catch {}
    if (S.step === 4 && currentProp()) { renderList(); if (!$('#cartSheet').hidden) renderCart(); }
  } catch { S.prodFail = true; } finally { prodBusy = false; if (S.step === 4 && currentProp()) renderList(); }
}

/* Express basket: SNUG walks through the articles shop by shop. One tap opens the product on the shop's site,
   you tap "Ajouter au panier" there and come back: the article is ticked and the next one is ready.
   Progress is kept in this browser, so it survives the phone reloading the app. */
const CKEY = 'snug.cart.v1'; let CART = {}; try { CART = JSON.parse(localStorage.getItem(CKEY) || '{}') || {}; } catch { CART = {}; }
const saveCart = () => { try { localStorage.setItem(CKEY, JSON.stringify(CART)); } catch {} };
const CART_URL = [[/ikea/i, 'https://www.ikea.com/fr/fr/shoppingcart/'], [/leroy/i, 'https://www.leroymerlin.fr/checkout/cart']];
const cartUrlOf = (sh) => (CART_URL.find(([re]) => re.test(sh)) || [])[1] || '';
const escH = (s) => String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
function cartKey() { return (S.projId || 'courant') + ':' + S.active; }
let cartPending = null, cartUndo = null;
function renderCart() {
  const raw = linesFor(S.active), shops = [...new Set(raw.map((l) => l.enseigne || 'Autre'))];
  const lines = shops.flatMap((sh) => raw.filter((l) => (l.enseigne || 'Autre') === sh));
  const done = CART[cartKey()] || (CART[cartKey()] = {});
  const n = lines.filter((l) => done[pkey(l)] === true).length, left = lines.filter((l) => !done[pkey(l)]).length;
  const cur = lines.find((l) => !done[pkey(l)]);
  const shopDone = (sh) => lines.filter((l) => (l.enseigne || 'Autre') === sh).every((l) => done[pkey(l)]);
  let card = '';
  if (cur) {
    const p = productOf(cur), sh = cur.enseigne || 'Autre', inShop = lines.filter((l) => (l.enseigne || 'Autre') === sh);
    card = `<div class="xcard">
      <p class="mono small xstep">${escH(sh)} · article ${inShop.indexOf(cur) + 1} / ${inShop.length}${shops.length > 1 ? ` · magasin ${shops.indexOf(sh) + 1} / ${shops.length}` : ''}</p>
      <div class="xrow">${p && p.image ? `<img src="${escH(p.image)}" alt="" referrerpolicy="no-referrer">` : '<i></i>'}<div class="ct"><b>${escH(cur.article)}</b>${p && p.name ? `<span>${escH(p.name)}</span>` : ''}<span>${eur(cur.prix)}${p && p.ref ? ' · réf. ' + escH(p.ref) : ''}</span></div></div>
      <div class="xqty"><span>Quantité à ajouter</span><b>${cur.qte}</b></div>
      <a class="btn primary xopen" id="xOpen" href="${escH(linkOf(cur))}" target="_blank" rel="noopener">${p && p.url ? 'Ouvrir le produit' : 'Chercher le produit'} chez ${escH(sh)} ↗</a>
      <p class="muted small">Sur le site, touchez « Ajouter au panier »${cur.qte > 1 ? ` avec la quantité ${cur.qte}` : ''}, puis revenez ici : SNUG coche l’article et prépare le suivant.</p>
      <div class="xsub"><button type="button" class="btn ghost sm" id="xDone">Déjà ajouté</button><button type="button" class="btn ghost sm" id="xSkip">Passer cet article</button></div>
      ${cartUndo ? `<p class="xundo">✓ ${escH(cartUndo.name)} coché <button type="button" id="xUndo">Annuler</button></p>` : ''}
    </div>`;
  }
  const el = $('#cartSheet');
  el.innerHTML = `<div class="in"><div class="rowb"><h1>Panier express</h1><button class="btn ghost sm" id="cartClose">Fermer</button></div>
    <div class="cartprog"><span style="width:${lines.length ? Math.round((lines.length - left) / lines.length * 100) : 0}%"></span></div><p class="mono small">${n} / ${lines.length} articles ajoutés${left ? '' : ' · terminé'}</p>
    ${card}
    ${!left && lines.length ? '<p class="cartdone">Tout est dans vos paniers : il ne reste qu’à les valider sur chaque site.</p>' : ''}
    ${shops.map((sh) => { const cu = cartUrlOf(sh), fin = shopDone(sh);
      return `<div class="cshoph"><h2 class="cshop">${escH(sh)}</h2>${fin && cu ? `<a class="btn primary sm" href="${cu}" target="_blank" rel="noopener">Valider mon panier ↗</a>` : ''}</div>` + lines.filter((l) => (l.enseigne || 'Autre') === sh).map((l) => { const k = pkey(l), p = productOf(l), st = done[k];
      return `<div class="citem${st === true ? ' ok' : st ? ' skip' : ''}${l === cur ? ' now' : ''}">${p && p.image ? `<img src="${escH(p.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '<i></i>'}<div class="ct"><b>${l.qte} × ${escH(l.article)}</b><span>${st === 'skip' ? 'Passé · ' : ''}${eur(l.prix)}</span></div>
        <a class="btn ghost sm" href="${escH(linkOf(l))}" target="_blank" rel="noopener" data-k="${k}">Ouvrir</a><button type="button" class="ccheck" data-k="${escH(k)}" aria-pressed="${st === true}" aria-label="Ajouté au panier">✓</button></div>`; }).join(''); }).join('')}
    ${n || Object.keys(done).length ? '<button type="button" class="btn ghost sm" id="cartReset">Tout recommencer</button>' : ''}</div>`;
  el.hidden = false;
  const mark = (k, v) => { if (v) done[k] = v; else delete done[k]; saveCart(); };
  $('#cartClose').onclick = () => { el.hidden = true; cartPending = null; };
  el.querySelectorAll('.ccheck').forEach((b) => { b.onclick = () => { const k = b.dataset.k; cartUndo = null; mark(k, done[k] === true ? 0 : true); renderCart(); }; });
  el.querySelectorAll('.citem a').forEach((a) => { a.onclick = () => { cartPending = { k: a.dataset.k, at: Date.now(), name: '' }; }; });
  if (cur) {
    const k = pkey(cur);
    $('#xOpen').onclick = () => { cartPending = { k, at: Date.now(), name: cur.article }; };
    $('#xDone').onclick = () => { cartUndo = { k, name: cur.article }; mark(k, true); renderCart(); };
    $('#xSkip').onclick = () => { cartUndo = null; mark(k, 'skip'); renderCart(); };
  }
  if ($('#xUndo')) $('#xUndo').onclick = () => { mark(cartUndo.k, 0); cartUndo = null; renderCart(); };
  if ($('#cartReset')) $('#cartReset').onclick = () => { CART[cartKey()] = {}; cartUndo = null; saveCart(); renderCart(); };
  loadProducts(lines);
}
/* Back from the shop's site: the article that was opened counts as added (with "Annuler" in case it wasn't). */
function cartBack() {
  if (!cartPending || document.visibilityState !== 'visible' || $('#cartSheet').hidden) return;
  const { k, at, name } = cartPending; cartPending = null;
  if (Date.now() - at < 2500) return; // came straight back: nothing was added
  const done = CART[cartKey()] || (CART[cartKey()] = {});
  if (done[k] === true) return;
  done[k] = true; saveCart();
  const l = linesFor(S.active).find((x) => pkey(x) === k);
  cartUndo = { k, name: name || (l ? l.article : 'Article') };
  renderCart(); $('#cartSheet').scrollTop = 0;
}
document.addEventListener('visibilitychange', cartBack);
window.addEventListener('focus', cartBack);
window.addEventListener('pageshow', cartBack);
$('#cartBtn').onclick = () => { cartUndo = null; renderCart(); $('#cartSheet').scrollTop = 0; };
$('#copyBtn').onclick = async () => {
  const p = currentProp(); if (!p) return;
  const txt = `${projectName()} · ${p.nom}\n` + linesFor(S.active).map((it) => `${it.qte}× ${it.article} (${it.enseigne}) ${eur(it.prix)}\n   ${shopUrl(it.enseigne, it.recherche)}`).join('\n');
  try { await navigator.clipboard.writeText(txt); $('#copyBtn').textContent = 'Copiée'; } catch { $('#copyBtn').textContent = 'Copie impossible'; }
  setTimeout(() => { $('#copyBtn').textContent = 'Copier'; }, 1800);
};
function hfinBg(f) {
  if (f.wood) return `url(${texURL(finById('chene'))}) center/cover`;
  if (f.metal > .5) return `linear-gradient(135deg, ${shade(f.c, 1.3)} 0%, ${f.c} 45%, ${shade(f.c, .6)} 100%)`;
  return f.c;
}
function fillSw(group, list, cur) {
  const box = document.querySelector(`.sw[data-group="${group}"]`); box.innerHTML = '';
  list.forEach((f) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'swb'; b.dataset.group = group; b.dataset.id = f.id; b.title = f.nom;
    b.setAttribute('aria-pressed', String(f.id === cur));
    const i = document.createElement('i'); if (group === 'hfin') i.style.background = hfinBg(f); else i.style.backgroundImage = `url(${texURL(f)})`;
    const s = document.createElement('span'); s.textContent = f.nom; b.append(i, s); box.appendChild(b);
  });
}
function handleSVG(h, c, bg) {
  const s = (inner) => `<svg viewBox="0 0 72 44" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="72" height="44" fill="${bg}"/>${inner}</svg>`;
  switch (h.shape) {
    case 'bar': { const L = Math.min(58, 18 + h.L / 7), r = Math.max(2, (h.r || 5) / 2.4); return s(`<rect x="${36 - L / 2}" y="${22 - r}" width="${L}" height="${2 * r}" rx="${r}" fill="${c}"/>`); }
    case 'flat': return s(`<rect x="13" y="19" width="46" height="6" rx="1.5" fill="${c}"/>`);
    case 'arc': return s(`<path d="M22 28 Q36 8 50 28" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`);
    case 'knob': return s(`<circle cx="36" cy="22" r="7.5" fill="${c}"/>`);
    case 'ball': return s(`<circle cx="36" cy="22" r="8" fill="${c}"/>`);
    default: return s(`<circle cx="36" cy="22" r="6" fill="${c}"/>`);
  }
}
function card(group, id, label, price, imgUrl, svg, pressed) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'hcard'; b.dataset.group = group; b.dataset.id = id; b.setAttribute('aria-pressed', String(pressed));
  const ph = document.createElement('span'); ph.className = 'ph';
  if (imgUrl) { const im = document.createElement('img'); im.alt = ''; im.src = imgUrl; ph.appendChild(im); } else ph.innerHTML = svg || '';
  const bb = document.createElement('b'); bb.textContent = label; const pr = document.createElement('span'); pr.className = 'pr'; pr.textContent = price;
  b.append(ph, bb, pr); return b;
}
function renderHandles() {
  const cu = S.custom[S.active]; const cats = ['Toutes', ...new Set(HANDLES.map((h) => h.cat))];
  const cb = $('#hcats'); cb.innerHTML = '';
  cats.forEach((c) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip sm cat'; b.dataset.group = 'hcat'; b.dataset.id = c; b.textContent = c; b.setAttribute('aria-pressed', String(S.hcat === c)); cb.appendChild(b); });
  const grid = $('#hgrid'); grid.innerHTML = ''; const hf = hfinById(cu.hfin), bg = finById(cu.facades).c;
  HANDLES.filter((h) => S.hcat === 'Toutes' || h.cat === S.hcat).forEach((h) => {
    grid.appendChild(card('handle', h.id, h.nom, h.prix ? `${h.prix} € / pièce` : 'Sans supplément', handleThumb(h, cu.hfin, cu.facades), handleSVG(h, hf.c, bg), h.id === cu.poignee));
  });
}
function renderFeet() {
  const cu = S.custom[S.active]; const grid = $('#fgrid'); grid.innerHTML = '';
  FEET.forEach((f) => grid.appendChild(card('feet', f.id, f.nom + (f.hidden ? ' (pieds cachés)' : ''), f.hidden ? 'Plinthe + vérins' : `${f.prix} € / pied`, feetThumb(f, cu.structure), '', f.id === cu.pieds)));
  const robot = robotWanted();
  $('#feetWarn').hidden = !(feetById(cu.pieds).hidden && robot);
  $('#feetWarn').textContent = 'Avec des pieds cachés, le robot aspirateur ne pourra plus passer sous le meuble.';
}
function renderCustom() {
  const cu = S.custom[S.active], p = currentProp(); if (!cu || !p) return;
  const n = frontsCount(p), floorMods = p.modules.some((m, mi) => { const L = layoutModule(m, zoneFor(m, mi)); return L.legs > 0 && !L.raised; });
  fillSw('structure', FIN, cu.structure); fillSw('plateau', FIN, cu.plateau); fillSw('facades', FIN, cu.facades); fillSw('hfin', HFIN, cu.hfin);
  $('#grpFeet').hidden = !floorMods; $('#noFeet').hidden = floorMods; if (floorMods) renderFeet();
  renderHandles();
  $('#lab-structure').textContent = '· ' + finById(cu.structure).nom; $('#lab-plateau').textContent = '· ' + finById(cu.plateau).nom;
  $('#lab-facades').textContent = '· ' + finById(cu.facades).nom; $('#lab-handle').textContent = `· ${handleById(cu.poignee).nom}, ${n} pièce${n > 1 ? 's' : ''}`;
  $('#lab-hfin').textContent = '· ' + hfinById(cu.hfin).nom; $('#lab-feet').textContent = '· ' + feetById(cu.pieds).nom;
}
$('#panes').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-group]'); const cu = S.custom[S.active]; if (!b || !cu) return;
  const grp = b.dataset.group, id = b.dataset.id;
  if (grp === 'hcat') { S.hcat = id; renderHandles(); return; }
  if (grp === 'handle') { cu.poignee = id; if (id === 'bouton_bois') cu.hfin = 'bois'; if (id === 'ceramique') cu.hfin = 'blanc'; }
  else if (grp === 'feet') cu.pieds = id;
  else cu[grp] = id;
  refreshAll(); refreshView();
});

/* ================= photo projection, with doors and drawers that open ================= */
function handle2D(g, h, hf, x, y, w, hh, orient, side, k) {
  if (h.shape === 'none') return;
  if (h.top) { if (h.shape === 'gorge') { g.fillStyle = hf.c; g.fillRect(x + w * .03, y + 1, w * .94, Math.max(2, 12 * k)); } else { g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x + w / 2 - Math.min(110 * k, w * .4) / 2, y + 3, Math.min(110 * k, w * .4), Math.max(3, 24 * k)); } return; }
  const cx = orient === 'v' ? (side === 'L' ? x + w - Math.max(5, 40 * k) : x + Math.max(5, 40 * k)) : x + w / 2;
  const cy = orient === 'v' ? y + hh / 2 : (orient === 'c' ? y + Math.max(6, 50 * k) : y + hh * .38);
  g.fillStyle = h.shape === 'leather' ? '#7A4A2A' : hf.c;
  if (['bar', 'flat', 'arc', 'tbar', 'leather', 'drop', 'shell'].includes(h.shape)) {
    const len = Math.max(6, (h.L || 80) * k), th = Math.max(2, 9 * k);
    if (orient === 'v' && !['tbar', 'drop'].includes(h.shape)) g.fillRect(cx - th / 2, cy - len / 2, th, len); else g.fillRect(cx - len / 2, cy - th / 2, len, th);
  } else { g.beginPath(); g.arc(cx, cy, Math.max(2.5, 15 * k), 0, Math.PI * 2); g.fill(); }
}
function poly(g, pts) { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); }
function drawProjection() {
  const cv = $('#cv3'); const g = drawPhoto(cv); const p = currentProp(), cu = S.custom[S.active]; if (!p || !cu) return;
  const h = handleById(cu.poignee), hf = hfinById(cu.hfin), feet = feetById(cu.pieds);
  const pat = (id) => g.createPattern(texCanvas(finById(id)), 'repeat');
  const pS = pat(cu.structure), pF = pat(cu.facades), pP = pat(cu.plateau), pC = pat('pin');
  const hits = [], keys = [];
  p.modules.forEach((m, mi) => {
    const z = zoneFor(m, mi) || DEFZ; const L = layoutModule(m, z);
    const zr = { x: z.x * cv.width, y: z.y * cv.height, w: z.w * cv.width, h: z.h * cv.height };
    const sx = zr.w / (pos(z.A) || L.W), sy = zr.h / (pos(z.B) || L.H), k = (sx + sy) / 2;
    const left = zr.x + (m.decalage_mm != null ? num(m.decalage_mm) * sx : (zr.w - L.W * sx) / 2), bottom = zr.y + zr.h;
    const R = (x, y, w, hh) => [left + x * sx, bottom - (y + hh) * sy, w * sx, hh * sy];
    const X = (x) => left + x * sx, Y = (y) => bottom - y * sy;
    g.save();
    g.fillStyle = 'rgba(28,22,18,.92)'; g.fillRect(...R(0, L.legs, L.W, L.y1 - L.legs));
    // back details visible inside open cells
    L.details.forEach((d) => {
      if (d.type === 'passe_cable' && d.face === 'arriere') { g.fillStyle = '#4A4038'; g.beginPath(); g.arc(X(d.x), Y(d.y), (d.dia / 2 + 6) * k, 0, Math.PI * 2); g.fill(); g.fillStyle = '#0B0908'; g.beginPath(); g.arc(X(d.x), Y(d.y), d.dia / 2 * k, 0, Math.PI * 2); g.fill(); }
      if (d.type === 'aeration') { g.fillStyle = '#0B0908'; const n = Math.max(2, Math.floor(d.w / 30)); for (let i = 0; i < n; i++) g.fillRect(X(d.x - d.w / 2 + 15 + i * 30) - 7 * k, Y(d.y + d.h / 2), 14 * k, d.h * sy); }
    });
    g.fillStyle = pS;
    // feet or plinth
    if (L.legs > 0 && !L.raised) {
      if (feet.hidden) { g.fillRect(...R(feet.inset, 0, L.W - 2 * feet.inset, L.legs)); if (feet.inset) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(...R(feet.inset, 0, L.W - 2 * feet.inset, L.legs)); } }
      else legXs(L).forEach((lx) => {
        const [x, y, w, hh] = R(lx, 0, 50, L.legs);
        const metal = feet.mat === 'laiton' ? '#B8913F' : feet.mat === 'noir' ? '#1F1F1F' : null; if (metal) g.fillStyle = metal; else g.fillStyle = pS;
        if (feet.shape === 'taper') { poly(g, [[x, y], [x + w, y], [x + w * .72, y + hh], [x + w * .28, y + hh]]); g.fill(); }
        else if (feet.shape === 'splay') { const o = lx < L.W / 2 ? -1 : 1; poly(g, [[x, y], [x + w, y], [x + w * .7 + o * w * .5, y + hh], [x + w * .3 + o * w * .5, y + hh]]); g.fill(); }
        else if (feet.shape === 'thin') g.fillRect(x + w * .3, y, w * .4, hh);
        else if (feet.shape === 'hairpin') { g.strokeStyle = '#1F1F1F'; g.lineWidth = Math.max(1.5, 7 * k); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w / 2, y + hh); g.lineTo(x + w, y); g.stroke(); }
        else if (feet.shape === 'caster') { g.fillRect(x, y, w, Math.max(2, 6 * sy)); g.fillStyle = '#1F1F1F'; g.beginPath(); g.arc(x + w / 2, y + hh - Math.min(hh * .42, 32 * sy), Math.min(hh * .42, 32 * sy), 0, Math.PI * 2); g.fill(); }
        else g.fillRect(x, y, w, hh);
        g.fillStyle = pS;
      });
    }
    g.fillRect(...R(0, L.legs, L.W, L.t)); g.fillRect(...R(0, L.y0, L.t, L.y1 - L.y0)); g.fillRect(...R(L.W - L.t, L.y0, L.t, L.y1 - L.y0));
    L.dividers.forEach((x) => g.fillRect(...R(x, L.y0, L.divT, L.y1 - L.y0)));
    L.shelves.forEach((s) => g.fillRect(...R(s.x, s.y, s.w, L.t)));
    L.cells.forEach((c) => {
      if (c.rod) { const [rx, ry, rw] = R(c.x + 10, c.y + c.h - 60, c.w - 20, 0); g.fillStyle = '#B9BDC1'; g.fillRect(rx, ry - Math.max(2, 12 * k), rw, Math.max(2, 12 * k)); }
      if (c.type !== 'ouvert' || !c.contenu || c.rod) return; const [x, y, w, hh] = R(c.x, c.y, c.w, c.h);
      if (w > 50 && hh > 18) { g.fillStyle = 'rgba(255,255,255,.85)'; g.font = `600 ${clamp(hh / 5, 11, 16)}px "Geist", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(c.contenu).slice(0, Math.floor(w / 8)), x + w / 2, y + hh / 2); }
    });
    frontsOf(L, mi).forEach((f) => {
      const st = getSt(f.key), t = st.t; keys.push(f.key);
      const [x, y, w, hh] = R(f.x, f.y, f.w, f.h);
      if (t > .02 && f.c.contenu && f.kind !== 'caisse') { g.fillStyle = 'rgba(255,255,255,.8)'; g.font = `600 ${clamp(hh / 6, 10, 14)}px "Geist", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(f.c.contenu).slice(0, Math.floor(w / 8)), x + w / 2, y + hh / 2); }
      g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1;
      let bb = [x, y, x + w, y + hh];
      if (f.kind === 'porte') {
        const a = t * 1.75, hx = f.side === 'L' ? x : x + w, dir = f.side === 'L' ? 1 : -1, fx = hx + dir * w * Math.cos(a), gr = hh * .12 * Math.sin(a);
        g.fillStyle = pF; poly(g, [[hx, y], [fx, y - gr], [fx, y + hh + gr], [hx, y + hh]]); g.fill(); g.stroke();
        if (t < .05) handle2D(g, h, hf, x, y, w, hh, 'v', f.side, k);
        bb = [Math.min(x, fx), y - gr, Math.max(x + w, fx), y + hh + gr];
      } else if (f.kind === 'abattant') {
        const a = t * 1.45, top = y + hh - hh * Math.cos(a), gw = w * .08 * Math.sin(a);
        g.fillStyle = pF; poly(g, [[x, y + hh], [x + w, y + hh], [x + w + gw, Math.min(top, y + hh - 3)], [x - gw, Math.min(top, y + hh - 3)]]); g.fill(); g.stroke();
        if (t < .05) handle2D(g, h, hf, x, y, w, hh, 'h', 'C', k);
      } else {
        const sc = 1 + .1 * t, dy = hh * .2 * t, nw = w * sc, nh = hh * sc, nx = x - (nw - w) / 2, ny = y + dy;
        if (t > .02) {
          g.fillStyle = f.kind === 'caisse' ? pC : pS; poly(g, [[x + w * .03, y + hh * .1], [x + w * .97, y + hh * .1], [nx + nw * .97, ny + 2], [nx + nw * .03, ny + 2]]); g.fill();
          g.fillStyle = 'rgba(15,12,10,.75)'; poly(g, [[x + w * .1, y + hh * .14], [x + w * .9, y + hh * .14], [nx + nw * .9, ny + 3], [nx + nw * .1, ny + 3]]); g.fill();
        }
        g.fillStyle = f.kind === 'caisse' ? pC : pF; g.fillRect(nx, ny, nw, nh); g.strokeRect(nx, ny, nw, nh);
        handle2D(g, h, hf, nx, ny, nw, nh, f.kind === 'caisse' ? 'c' : 'h', 'C', k * sc);
        bb = [nx, y, nx + nw, ny + nh];
      }
      hits.push({ x0: bb[0], y0: bb[1], x1: bb[2], y1: bb[3], key: f.key });
    });
    const [tx, ty, tw, th] = R(-6, L.H - L.topT, L.W + 12, L.topT);
    g.fillStyle = pP; g.fillRect(tx, ty, tw, Math.max(3, th)); g.strokeStyle = 'rgba(0,0,0,.3)'; g.strokeRect(tx, ty, tw, Math.max(3, th));
    L.details.filter((d) => d.type === 'passe_cable' && d.face === 'plateau').forEach((d) => { g.fillStyle = '#111'; g.beginPath(); g.ellipse(X(d.x), ty + 1, d.dia / 2 * sx, Math.max(2, d.dia * .12 * sy), 0, 0, Math.PI * 2); g.fill(); });
    g.restore();
  });
  S.hits = hits; S.keys2d = keys;
}
(function () {
  const cv = $('#cv3'); let down = null;
  cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) { down = null; return; } down = null;
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * cv.width / r.width, y = (e.clientY - r.top) * cv.height / r.height;
    if (PH.ok && PH.scene) {
      const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(x / cv.width * 2 - 1, -(y / cv.height) * 2 + 1), PH.cam);
      const hit = ray.intersectObjects(PH.picks, false)[0], o = hit && hit.object.userData.owner;
      if (o) { const st = getSt(o.userData.key); st.target = st.target > .5 ? 0 : 1; updateOpenBtn(); anim2D(); }
      return;
    }
    for (let i = S.hits.length - 1; i >= 0; i--) { const hb = S.hits[i]; if (x >= hb.x0 && x <= hb.x1 && y >= hb.y0 && y <= hb.y1) { const st = getSt(hb.key); st.target = st.target > .5 ? 0 : 1; updateOpenBtn(); anim2D(); break; } }
  });
})();
function anim2D() {
  if (S.anim2d) return; S.anim2d = true;
  const step = () => {
    let moving = false;
    if (PH.ok && PH.scene) { moving = applyOpens(PH.opens, true); if (S.view === 'photo') drawPhotoView(false); }
    else { S.keys2d.forEach((k) => { const st = getSt(k), d = st.target - st.t; if (Math.abs(d) > .004) { st.t += d * .2; moving = true; } else st.t = st.target; }); if (S.view === 'photo') drawProjection(); }
    if (moving && S.view === 'photo') requestAnimationFrame(step); else S.anim2d = false;
  };
  requestAnimationFrame(step);
}

/* ================= 3D view ================= */
const E = { ok: typeof THREE !== 'undefined', inited: false, running: false, framed: false, state: {}, opens: [], picks: [], mats: {} };
function lin(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }
function woodTex(id) { const t = new THREE.CanvasTexture(texCanvas(finById(id), 512)); t.anisotropy = 8; t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
function mat(id) {
  if (E.mats[id]) return E.mats[id]; let m;
  if (id.startsWith('h:')) { const hf = hfinById(id.slice(2)); m = hf.wood ? new THREE.MeshStandardMaterial({ map: woodTex('chene'), roughness: .65 }) : new THREE.MeshStandardMaterial({ color: lin(hf.c), metalness: hf.metal, roughness: hf.rough }); }
  else if (id === 'leather') m = new THREE.MeshStandardMaterial({ color: lin('#7A4A2A'), roughness: .75 });
  else if (id === 'dark') m = new THREE.MeshStandardMaterial({ color: 0x141110, roughness: .9 });
  else { const f = finById(id); m = f.wood ? new THREE.MeshStandardMaterial({ map: woodTex(f.id), roughness: .46, envMapIntensity: .8, vertexColors: true }) : new THREE.MeshStandardMaterial({ color: lin(f.c), roughness: .4, envMapIntensity: .95, map: woodTex(f.id), vertexColors: true }); if (!f.wood) m.color = new THREE.Color(0xffffff); }
  return (E.mats[id] = m);
}
const TILE = 640;
function uvBox(geo, w, h, d, seed) {
  const uv = geo.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]], ox = (seed * .37) % 1, oy = (seed * .61) % 1;
  for (let f = 0; f < 6; f++) { const [U, V] = dims[f], rot = V > U * 1.15; for (let k = 0; k < 4; k++) { const i = f * 4 + k, u = uv.getX(i), v = uv.getY(i); if (rot) uv.setXY(i, v * V / (TILE * 2.2) + ox, u * U / TILE + oy); else uv.setXY(i, u * U / (TILE * 2.2) + ox, v * V / TILE + oy); } }
  uv.needsUpdate = true;
}
function bx(w, h, d, m, x, y, z, parent) {
  const geo = new THREE.BoxGeometry(Math.max(w, 1), Math.max(h, 1), Math.max(d, 1)); uvBox(geo, Math.max(w, 1), Math.max(h, 1), Math.max(d, 1), Math.abs(x * 13 + y * 7 + z * 3) % 97 / 97);
  // each panel comes from a different part of the board: a slight, fixed shift of tone per panel keeps them from looking cloned
  if (m.vertexColors) { const seed = Math.abs(Math.round(x * 7 + y * 3 + z * 11 + w)) % 1000, r = rng(seed), lum = .95 + r() * .1, warm = .99 + r() * .02, n = geo.attributes.position.count, col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { col[i * 3] = lum * warm; col[i * 3 + 1] = lum; col[i * 3 + 2] = lum / warm; } geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  const me = new THREE.Mesh(geo, m);
  me.position.set(x + w / 2, y + h / 2, z + d / 2); me.castShadow = true; me.receiveShadow = true; parent.add(me); return me;
}
function makeHandle(h, m, orient, fw) {
  const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner); const H90 = Math.PI / 2;
  const cyl = (r, len, seg) => new THREE.CylinderGeometry(r, r, len, seg || 24);
  const A = (geo, mm, x, y, z, rx, ry, rz) => { const me = new THREE.Mesh(geo, mm); me.position.set(x, y, z); me.rotation.set(rx || 0, ry || 0, rz || 0); me.castShadow = true; inner.add(me); return me; };
  switch (h.shape) {
    case 'bar': { const L = h.L, r = h.r || 5, so = L / 2 - Math.min(14, L * .12); A(cyl(r, L, h.seg), m, 0, 0, 24); A(new THREE.SphereGeometry(r, 16, 10), m, 0, L / 2, 24); A(new THREE.SphereGeometry(r, 16, 10), m, 0, -L / 2, 24); A(cyl(3.5, 24), m, 0, so, 12, H90); A(cyl(3.5, 24), m, 0, -so, 12, H90); break; }
    case 'flat': { const L = h.L; A(new THREE.BoxGeometry(9, L, 6), m, 0, 0, 22); A(cyl(3.5, 22), m, 0, L / 2 - 12, 11, H90); A(cyl(3.5, 22), m, 0, -(L / 2 - 12), 11, H90); break; }
    case 'arc': { const tor = new THREE.Mesh(new THREE.TorusGeometry(h.L / 2, 4, 12, 32, Math.PI), m); tor.rotation.z = -H90; tor.castShadow = true; const w = new THREE.Group(); w.rotation.y = -H90; w.add(tor); inner.add(w); break; }
    case 'tbar': A(cyl(4.5, 24), m, 0, 0, 12, H90); A(cyl(5, 60), m, 0, 0, 26, 0, 0, H90); A(new THREE.SphereGeometry(5, 12, 8), m, 30, 0, 26); A(new THREE.SphereGeometry(5, 12, 8), m, -30, 0, 26); break;
    case 'knob': A(cyl(6, 14), m, 0, 0, 7, H90); A(cyl(15, 8), m, 0, 0, 16, H90); A(new THREE.SphereGeometry(15, 24, 10, 0, Math.PI * 2, 0, H90 * .6), m, 0, 0, 20, H90); break;
    case 'knobsq': A(new THREE.BoxGeometry(12, 12, 10), m, 0, 0, 5); A(new THREE.BoxGeometry(26, 26, 10), m, 0, 0, 15); break;
    case 'mush': A(cyl(5, 16), m, 0, 0, 8, H90); A(new THREE.SphereGeometry(20, 24, 12, 0, Math.PI * 2, 0, H90), m, 0, 0, 16, H90); break;
    case 'ball': A(cyl(5, 10), m, 0, 0, 5, H90); A(new THREE.SphereGeometry(15, 24, 16), m, 0, 0, 22); break;
    case 'shell': { const me = A(new THREE.CylinderGeometry(17, 17, 70, 24, 1, false, -H90, Math.PI), m, 0, 0, 0); me.scale.z = .55; break; }
    case 'ring': A(cyl(7, 12), m, 0, 0, 6, H90); A(new THREE.TorusGeometry(17, 2.6, 10, 32), m, 0, -19, 13); break;
    case 'drop': A(cyl(5, 14), m, -30, 0, 7, H90); A(cyl(5, 14), m, 30, 0, 7, H90); A(new THREE.TorusGeometry(30, 3, 10, 24, Math.PI), m, 0, 0, 14, 0, 0, Math.PI); break;
    case 'leather': A(new THREE.BoxGeometry(24, 95, 4), mat('leather'), 0, -10, 2); A(new THREE.SphereGeometry(4, 12, 8), m, 0, 28, 5); break;
    case 'recess': A(cyl(20, 2.5), mat('dark'), 0, 0, .6, H90); A(new THREE.TorusGeometry(20, 2.2, 10, 32), m, 0, 0, 1); break;
    case 'gorge': A(new THREE.BoxGeometry(fw * .94, 14, 14), m, 0, 0, 6); break;
    case 'cut': A(new THREE.BoxGeometry(Math.min(110, fw * .4), 26, 2), mat('dark'), 0, 0, .6); break;
    default: break;
  }
  if (orient === 'h' && !['gorge', 'cut', 'drop', 'leather', 'tbar'].includes(h.shape)) inner.rotation.z = H90;
  return g;
}
function leg3D(G, f, L, mS, x, z, h) {
  const cx = x + 25, cz = z + 25, m = f.mat === 'wood' ? mS : mat('h:' + (f.mat === 'laiton' ? 'laiton' : 'noir'));
  const add = (geo, px, py, pz, rz, mm) => { const me = new THREE.Mesh(geo, mm || m); me.position.set(px, py, pz); me.rotation.set(0, 0, rz || 0); me.castShadow = true; G.add(me); return me; };
  switch (f.shape) {
    case 'taper': add(new THREE.CylinderGeometry(22, 13, h, 24), cx, h / 2, cz); break;
    case 'splay': { const o = cx < L.W / 2 ? -1 : 1; add(new THREE.CylinderGeometry(20, 12, h * 1.04, 24), cx + o * h * .09, h / 2, cz, o * .18); break; }
    case 'cyl': add(new THREE.CylinderGeometry(20, 20, h, 32), cx, h / 2, cz); break;
    case 'thin': add(new THREE.BoxGeometry(22, h, 22), cx, h / 2, cz); break;
    case 'hairpin': { const a = Math.atan2(25, h), len = h / Math.cos(a); add(new THREE.CylinderGeometry(4, 4, len, 10), cx - 12.5, h / 2, cz, a); add(new THREE.CylinderGeometry(4, 4, len, 10), cx + 12.5, h / 2, cz, -a); add(new THREE.BoxGeometry(60, 4, 40), cx, h - 2, cz); break; }
    case 'caster': { const wr = Math.min(h * .42, 32); add(new THREE.BoxGeometry(50, 6, 50), cx, h - 3, cz); add(new THREE.BoxGeometry(8, Math.max(1, h - 6 - wr), 30), cx, (h - 6 + wr) / 2, cz); const w = add(new THREE.CylinderGeometry(wr, wr, 18, 24), cx, wr, cz, Math.PI / 2, mat('dark')); w.rotation.set(0, 0, Math.PI / 2); break; }
    default: add(new THREE.BoxGeometry(45, h, 45), cx, h / 2, cz);
  }
}
function init3D() {
  if (E.inited || !E.ok) return;
  try {
    const cv = $('#cv3d');
    E.r = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    E.r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    E.r.outputEncoding = THREE.sRGBEncoding; E.r.shadowMap.enabled = true; E.r.shadowMap.type = THREE.PCFSoftShadowMap;
    E.r.toneMapping = THREE.ACESFilmicToneMapping; E.r.toneMappingExposure = .8; E.r.physicallyCorrectLights = false;
    E.scene = new THREE.Scene(); E.cam = new THREE.PerspectiveCamera(35, 4 / 3, .05, 60);
    E.env = makeEnv(E.r); if (E.env) E.scene.environment = E.env;
    E.hemi = new THREE.HemisphereLight(0xfffaf2, 0x8a8178, .3); E.scene.add(E.hemi); E.scene.fog = new THREE.Fog(0xDAD5CE, 8, 16);
    const spot = new THREE.SpotLight(0xffe7c7, .35, 0, .6, .85, 1); spot.position.set(.4, 3.6, 3.4); spot.target.position.set(0, .3, 0); E.scene.add(spot, spot.target);
    const dl = new THREE.DirectionalLight(0xfff1e0, .95); dl.position.set(-2.2, 3.6, 2.6); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048); dl.shadow.radius = 5; dl.shadow.normalBias = .004;
    Object.assign(dl.shadow.camera, { left: -3.5, right: 3.5, top: 3, bottom: -1, near: .5, far: 12 }); dl.shadow.bias = -0.0008; E.scene.add(dl);
    E.key = dl; E.keyPos = dl.position.clone();
    // the light of the whole room, sampled one direction per frame while the view is still (see renderFrame)
    const sky = new THREE.DirectionalLight(0xf7f4ef, 0); sky.castShadow = true; sky.shadow.mapSize.set(1024, 1024); sky.shadow.bias = -0.0012; sky.shadow.normalBias = .006;
    Object.assign(sky.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: .5, far: 14 }); E.scene.add(sky, sky.target); E.sky = sky; E.acc = accInit(E.r);
    const tx = (c, rep) => { const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t; };
    E.floorMat = new THREE.MeshStandardMaterial({ map: tx(plasterCanvas(), [10, 10]), color: 0xA8A198, roughness: .55, envMapIntensity: .22 });
    E.wallMat = new THREE.MeshStandardMaterial({ map: tx(plasterCanvas(), [6, 2]), color: 0xE2DDD6, roughness: .95, envMapIntensity: .35 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), E.floorMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; E.scene.add(floor);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), E.wallMat); wall.position.set(0, 2.5, 0); wall.receiveShadow = true; E.scene.add(wall);
    const sk = new THREE.Mesh(new THREE.BoxGeometry(14, .07, .012), new THREE.MeshStandardMaterial({ color: 0xF1EEE9, roughness: .5 })); sk.position.set(0, .035, .006); sk.receiveShadow = true; sk.castShadow = true; E.scene.add(sk);
    E.root = new THREE.Group(); E.root.scale.setScalar(.001); E.scene.add(E.root);
    E.orbit = { theta: .32, phi: 1.2, r: 4, target: new THREE.Vector3(0, .3, .2) }; E.ray = new THREE.Raycaster();
    const ptrs = new Map(); let down = null, pinch = 0;
    const dist = () => { const a = [...ptrs.values()]; return a.length < 2 ? 0 : (Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1); };
    cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 1) down = { x: e.clientX, y: e.clientY, moved: false }; else { if (down) down.moved = true; pinch = dist(); } });
    cv.addEventListener('pointermove', (e) => {
      const p = ptrs.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      if (ptrs.size === 2) { const d = dist(); if (pinch) E.orbit.r = clamp(E.orbit.r * pinch / d, .6, 12); pinch = d; return; }
      if (down) { if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) down.moved = true; if (down.moved) { E.orbit.theta -= dx * .008; E.orbit.phi = clamp(E.orbit.phi - dy * .006, .2, 1.52); } }
    });
    const up = (e) => { if (!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = 0; if (ptrs.size === 0) { if (down && !down.moved && e.type === 'pointerup') pick(e); down = null; } };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', (e) => { e.preventDefault(); E.orbit.r = clamp(E.orbit.r * (1 + e.deltaY * .0012), .6, 12); }, { passive: false });
    if (window.ResizeObserver) new ResizeObserver(resize3D).observe($('#stage3d'));
    E.inited = true;
  } catch (err) { E.ok = false; S.view = 'photo'; }
}
function resize3D() {
  if (!E.r) return; const w = $('#stage3d').clientWidth || 340, h = Math.round(Math.min(440, window.innerHeight * .46, w * .95));
  E.r.setSize(w, h, false); $('#cv3d').style.height = h + 'px'; E.cam.aspect = w / h; E.cam.updateProjectionMatrix();
}
function pick(e) {
  const rc = $('#cv3d').getBoundingClientRect();
  const v = new THREE.Vector2(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
  E.ray.setFromCamera(v, E.cam);
  const hc = E.ray.intersectObjects(E.cellPicks || [], false)[0];
  const hit = E.ray.intersectObjects(E.picks, false)[0]; const o = hit && hit.object.userData.owner;
  if (o) { const st = getSt(o.userData.key); st.target = st.target > .5 ? 0 : 1; updateOpenBtn(); }
  if (hc) openCell(hc.object.userData.cell); else if (!o) closeCell();
}
const viewKeys = () => S.view === '3d' && E.inited ? E.opens.map((o) => o.userData.key) : S.keys2d;
function updateOpenBtn() { const ks = viewKeys(), b = $('#openAll'); b.hidden = !ks.length; const lab = ks.some((k) => getSt(k).target < .5) ? 'Tout ouvrir' : 'Tout fermer'; b.setAttribute('aria-label', lab); b.title = lab; b.classList.toggle('on', lab === 'Tout fermer'); }
$('#openAll').onclick = () => { const ks = viewKeys(); const open = ks.some((k) => getSt(k).target < .5); ks.forEach((k) => { getSt(k).target = open ? 1 : 0; }); updateOpenBtn(); if (S.view === 'photo') anim2D(); };
$('#recenter').onclick = () => frame();
let REG = null;
function register(obj, parts, data, key) {
  obj.userData = { ...data, key }; getSt(key); const R = REG || E; R.opens.push(obj);
  parts.forEach((p) => p && p.traverse((m) => { if (m.isMesh) { m.userData.owner = obj; R.picks.push(m); } }));
}
function applyOpens(list, step) {
  let moving = false;
  list.forEach((o) => {
    const st = getSt(o.userData.key), u = o.userData;
    if (step) { const dd = st.target - st.t; if (Math.abs(dd) > .003) { st.t += dd * .16; moving = true; } else st.t = st.target; }
    const t = st.t; if (u.kind === 'door') o.rotation.y = u.dir * t * 1.75; else if (u.kind === 'flap') o.rotation.x = t * 1.45; else o.position.z = u.base + t * u.dist;
  });
  return moving;
}
function buildModule(G, L, mi, M, feet) {
  const t = L.t, W = L.W, H = L.H, D = L.D;
  if (L.legs > 0 && !L.raised) {
    if (feet.hidden) { bx(W - 2 * feet.inset, L.legs, 18, M.mS, feet.inset, 0, D - 18 - feet.inset, G); bx(18, L.legs, D - 90, M.mS, feet.inset, 0, 40, G); bx(18, L.legs, D - 90, M.mS, W - feet.inset - 18, 0, 40, G); }
    else legXs(L).forEach((x) => [40, D - 90].forEach((z) => leg3D(G, feet, L, M.mS, x, z, L.legs)));
    const cm = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(contactCanvas()), transparent: true, depthWrite: false, opacity: feet.hidden ? .9 : .65 });
    const cs = new THREE.Mesh(new THREE.PlaneGeometry(W + 260, D + 220), cm); cs.userData.own = true; cs.rotation.x = -Math.PI / 2; cs.position.set(W / 2, 1, D / 2); G.add(cs);
  }
  bx(W, t, D - 6, M.mS, 0, L.legs, 6, G);
  bx(t, L.y1 - L.y0, D - 6, M.mS, 0, L.y0, 6, G); bx(t, L.y1 - L.y0, D - 6, M.mS, W - t, L.y0, 6, G);
  bx(W, L.y1 - L.legs, 6, M.mS, 0, L.legs, 0, G);
  L.dividers.forEach((x) => bx(L.divT, L.y1 - L.y0, D - 6, M.mS, x, L.y0, 6, G));
  L.shelves.forEach((s) => bx(s.w, t, D - 26, M.mS, s.x, s.y, 6, G));
  bx(W, L.topT, D + 12, M.mP, 0, H - L.topT, 0, G);
  frontsOf(L, mi).forEach((f) => addFront(G, f, L, M));
  addDetails(G, L);
  // contact shading inside every case: back panel and floor of the case
  const aoK = REG && REG !== E ? 'aoMatPh' : 'aoMat', aoM = E[aoK] || (E[aoK] = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(aoCanvas()), transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  L.cells.forEach((c) => {
    const bk = new THREE.Mesh(new THREE.PlaneGeometry(c.w, c.h), aoM); bk.position.set(c.x + c.w / 2, c.y + c.h / 2, 6.6); G.add(bk);
    const bt = new THREE.Mesh(new THREE.PlaneGeometry(c.w, D - 10), aoM); bt.rotation.x = -Math.PI / 2; bt.position.set(c.x + c.w / 2, c.y + .8, (D + 6) / 2); G.add(bt);
  });
  // invisible touch targets, one per case, to open the edit menu
  L.cells.forEach((c) => {
    const [ci, ri] = c.key.split('-').map(Number);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(c.w, c.h), new THREE.MeshBasicMaterial()); pl.visible = false;
    pl.position.set(c.x + c.w / 2, c.y + c.h / 2, D + 24); pl.userData.cell = { mi, ci, ri }; G.add(pl); E.cellPicks.push(pl);
    if (S.showCells) { // edit mode: every case gets a gold frame, to show it can be touched
      const gm = new THREE.MeshBasicMaterial({ color: 0xD9962F, toneMapped: false }), b = 10, z = D + 26, cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      [[c.w - 16, b, 0, c.h / 2 - 8], [c.w - 16, b, 0, -c.h / 2 + 8], [b, c.h - 16, c.w / 2 - 8, 0], [b, c.h - 16, -c.w / 2 + 8, 0]].forEach(([w, h, dx, dy]) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), gm); m.position.set(cx + dx, cy + dy, z); G.add(m); });
      const fill = new THREE.Mesh(new THREE.PlaneGeometry(c.w - 16, c.h - 16), new THREE.MeshBasicMaterial({ color: 0xE9B26B, transparent: true, opacity: .16, depthWrite: false, toneMapped: false }));
      fill.position.set(cx, cy, z - 1); G.add(fill);
    }
    const sc = S.selCell;
    if (sc && sc.mi === mi && sc.ci === ci && sc.ri === ri) {
      const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(c.w + 6, c.h + 6, D + 30)), new THREE.LineBasicMaterial({ color: 0xE9B26B }));
      box.position.set(c.x + c.w / 2, c.y + c.h / 2, (D + 30) / 2 + 2); G.add(box);
    }
  });
}
function matsFor(cu) { return { mS: mat(cu.structure), mF: mat(cu.facades), mP: mat(cu.plateau), mH: mat('h:' + cu.hfin), crate: mat('pin'), h: handleById(cu.poignee) }; }
function addFront(G, f, L, M) {
  const D = L.D, ft = 18;
  if (f.kind === 'porte') {
    const piv = new THREE.Group(); piv.position.set(f.side === 'L' ? f.x : f.x + f.w, f.y, D); G.add(piv);
    const panel = bx(f.w, f.h, ft, M.mF, f.side === 'L' ? 0 : -f.w, 0, 0, piv);
    const hg = makeHandle(M.h, M.mH, 'v', f.w);
    if (M.h.top) hg.position.set(f.side === 'L' ? f.w / 2 : -f.w / 2, f.h - 14, ft); else hg.position.set(f.side === 'L' ? f.w - 40 : -(f.w - 40), f.h / 2, ft);
    piv.add(hg); register(piv, [panel, hg], { kind: 'door', dir: f.side === 'L' ? -1 : 1 }, f.key); return;
  }
  if (f.kind === 'abattant') {
    const piv = new THREE.Group(); piv.position.set(f.x, f.y, D); G.add(piv);
    const panel = bx(f.w, f.h, ft, M.mF, 0, 0, 0, piv);
    const hg = makeHandle(M.h, M.mH, 'h', f.w); hg.position.set(f.w / 2, M.h.top ? f.h - 14 : f.h - 40, ft); piv.add(hg);
    register(piv, [panel, hg], { kind: 'flap' }, f.key); return;
  }
  const gr = new THREE.Group(); G.add(gr);
  if (f.kind === 'tiroir') {
    gr.position.set(f.x, f.y, D);
    const panel = bx(f.w, f.h, ft, M.mF, 0, 0, 0, gr);
    const bd = Math.max(100, D - 70), bh = Math.max(40, Math.min(f.h - 30, 180));
    bx(f.w - 40, 12, bd, M.mS, 20, 10, -bd, gr); bx(12, bh, bd, M.mS, 20, 10, -bd, gr); bx(12, bh, bd, M.mS, f.w - 32, 10, -bd, gr); bx(f.w - 40, bh, 12, M.mS, 20, 10, -bd, gr);
    const hg = makeHandle(M.h, M.mH, 'h', f.w); hg.position.set(f.w / 2, M.h.top ? f.h - 14 : f.h * .62, ft); gr.add(hg);
    register(gr, [panel, hg], { kind: 'slide', dist: bd * .75, base: D }, f.key);
  } else {
    const cw = f.w, ch = f.h, cd = f.d, th = 12, base = D - cd - 14; gr.position.set(f.x, f.y, base);
    const front = bx(cw, ch, th, M.crate, 0, 0, cd - th, gr);
    bx(cw, th, cd, M.crate, 0, 0, 0, gr); bx(th, ch, cd, M.crate, 0, 0, 0, gr); bx(th, ch, cd, M.crate, cw - th, 0, 0, gr); bx(cw, ch, th, M.crate, 0, 0, 0, gr);
    let hg;
    if (['none', 'cut'].includes(M.h.shape)) { hg = new THREE.Mesh(new THREE.BoxGeometry(Math.min(90, cw * .3), 22, 2), mat('dark')); hg.position.set(cw / 2, ch - 34, cd + 1); }
    else { hg = makeHandle(M.h, M.mH, 'h', cw); hg.position.set(cw / 2, M.h.top ? ch - 14 : ch - 50, cd); }
    gr.add(hg);
    register(gr, [front, hg], { kind: 'slide', dist: cd * .7, base }, f.key);
  }
}
function addDetails(G, L) {
  L.cells.filter((c) => c.rod).forEach((c) => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, c.w - 8, 16), mat('h:chrome')); rod.rotation.z = Math.PI / 2; rod.position.set(c.x + c.w / 2, c.y + c.h - 60, L.D / 2); rod.castShadow = true; G.add(rod);
    [c.x + 6, c.x + c.w - 6].forEach((x) => { const sup = new THREE.Mesh(new THREE.BoxGeometry(8, 34, 30), mat('h:chrome')); sup.position.set(x, c.y + c.h - 60, L.D / 2); G.add(sup); });
  });
  L.details.forEach((d) => {
    if (d.type === 'passe_cable') {
      const r = d.dia / 2, ring = new THREE.Mesh(new THREE.TorusGeometry(r + 2, 4, 10, 32), mat('h:noir')), hole = new THREE.Mesh(new THREE.CircleGeometry(r, 32), mat('dark'));
      if (d.face === 'plateau') { ring.rotation.x = Math.PI / 2; hole.rotation.x = -Math.PI / 2; ring.position.set(d.x, L.H + 1, d.y); hole.position.set(d.x, L.H + .6, d.y); }
      else { ring.position.set(d.x, d.y, 7); hole.position.set(d.x, d.y, 6.6); }
      G.add(ring, hole);
    } else if (d.type === 'aeration') {
      const n = Math.max(2, Math.floor(d.w / 30));
      for (let i = 0; i < n; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(14, d.h, 1), mat('dark')); s.position.set(d.x - d.w / 2 + 15 + i * 30, d.y, 6.6); G.add(s); }
    } else if (d.type === 'fixation_murale') {
      [L.W * .2, L.W * .8].forEach((x) => { const b = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 3), mat('h:inox')); b.position.set(x, L.y1 - 30, -1.5); G.add(b); });
    }
  });
}
function placeModules(p) {
  const img = S.photo, asp = img && img.naturalWidth ? img.naturalHeight / img.naturalWidth : .7;
  const mods = p.modules.map((m, mi) => { const z = zoneFor(m, mi) || DEFZ; return { m, mi, z, L: layoutModule(m, z) }; });
  const sc = mods.map((o) => ((o.z.w * 1000) / (pos(o.z.A) || o.L.W) + (o.z.h * 1000 * asp) / (pos(o.z.B) || o.L.H)) / 2);
  const s = sc.reduce((a, b) => a + b, 0) / sc.length || .4, minX = Math.min(...mods.map((o) => o.z.x * 1000));
  const placed = [];
  [...mods].sort((a, b) => a.z.x - b.z.x).forEach((o) => {
    let x = (o.z.x * 1000 - minX) / s; const y = num(o.z.D);
    for (let guard = 0, moved = true; moved && guard < 30; guard++) {
      moved = false;
      for (const q of placed) { if (x < q.x + q.L.W && x + o.L.W > q.x && y < q.y + q.L.H && y + o.L.H > q.y) { x = q.x + q.L.W; moved = true; } }
    }
    o.x = x; o.y = y; placed.push(o);
  });
  return mods;
}
function build3D() {
  if (!E.inited) return; const p = currentProp(), cu = S.custom[S.active]; if (!p || !cu) return;
  while (E.root.children.length) { const c = E.root.children.pop(); c.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
  E.picks = []; E.opens = []; E.cellPicks = []; REG = null;
  E.scene.background = lin('#DAD5CE');
  const M = matsFor(cu), feet = feetById(cu.pieds);
  let maxX = 0, maxY = 0, maxD = 0, tvMod = null;
  placeModules(p).forEach((o) => {
    const L = o.L, G = new THREE.Group(); G.position.set(o.x, o.y, 16); E.root.add(G);
    maxX = Math.max(maxX, o.x + L.W); maxY = Math.max(maxY, o.y + L.H); maxD = Math.max(maxD, L.D);
    buildModule(G, L, o.mi, M, feet);
    if (!L.raised && (!tvMod || L.W > tvMod.L.W)) tvMod = { G, L };
  });
  if ((p.tv !== undefined ? p.tv : S.project === 'tv') && tvMod && tvMod.L.W >= 900) {
    const L = tvMod.L, tw = Math.min(1450, L.W * .7), th = tw * .5625, y0 = L.H + 70, cx = L.W * .5, cz = L.D * .45;
    const black = new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: .25, metalness: .2 }); black.userData = {};
    const screen = new THREE.MeshStandardMaterial({ color: 0x07090c, roughness: .22, metalness: .05, emissive: 0x040608, envMapIntensity: .3 });
    const tv = new THREE.Group(); tv.position.set(cx, y0, cz); tvMod.G.add(tv);
    const body = new THREE.Mesh(new THREE.BoxGeometry(tw, th, 28), black); body.position.set(0, th / 2, 0); body.castShadow = true; tv.add(body);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(tw - 14, th - 14), screen); scr.position.set(0, th / 2, 14.5); tv.add(scr);
    [-tw * .36, tw * .36].forEach((x) => { const f = new THREE.Mesh(new THREE.BoxGeometry(14, 70, 180), black); f.position.set(x, -35, 0); f.castShadow = true; tv.add(f); });
    maxY = Math.max(maxY, L.H + 70 + th);
  }
  E.root.position.set(-maxX / 2 * .001, 0, 0);
  E.orbit.target.set(0, maxY / 2 * .001, maxD / 2 * .001); E.ext = { w: maxX * .001, h: maxY * .001 }; E.dirty = true; E.envK = null;
  updateOpenBtn();
}
function frame() {
  if (!E.ext) return; const fov = E.cam.fov * Math.PI / 180;
  const ext = Math.max(E.ext.w / Math.max(E.cam.aspect, .6), E.ext.h * 1.25, .5);
  E.orbit.r = clamp(ext / (2 * Math.tan(fov / 2)) * 1.3, .8, 12); E.orbit.theta = .32; E.orbit.phi = 1.2;
}
/* Progressive render. While you turn the furniture, one quick frame. As soon as the view is still, the app keeps
   rendering it — each frame with the light coming from a slightly different place — and averages the frames:
   shadows turn soft, corners and the inside of the cases darken the way they do in a room, edges become smooth.
   That is how offline renderers get their "photo" look; here it settles in under a second, then rendering stops. */
function accInit(r) {
  try {
    const gl = r.getContext(), ok = r.capabilities.isWebGL2 ? (gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float')) : (gl.getExtension('OES_texture_half_float') && gl.getExtension('EXT_color_buffer_half_float'));
    if (!ok) return null;
    const vs = 'varying vec2 v; void main(){ v = uv; gl_Position = vec4(position.xy, 0., 1.); }', mk = (fs, o) => new THREE.ShaderMaterial(Object.assign({ uniforms: { t: { value: null }, a: { value: 1 } }, vertexShader: vs, fragmentShader: 'uniform sampler2D t; uniform float a; varying vec2 v; void main(){ vec3 c = texture2D(t, v).rgb; ' + fs + ' }', depthTest: false, depthWrite: false }, o || {}));
    const A = { n: 0, max: 48, w: 0, h: 0, sc: new THREE.Scene(), cam: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
    A.add = mk('gl_FragColor = vec4(pow(c, vec3(2.2)), a);', { transparent: true }); A.out = mk('gl_FragColor = vec4(pow(c, vec3(1. / 2.2)), 1.);');
    A.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), A.add); A.quad.frustumCulled = false; A.sc.add(A.quad); return A;
  } catch { return null; }
}
const ACC = { sky: 1.15, env: .45 };
// still view: most of the ambient light comes from the sampled room light (which casts shadows) instead of the reflection map (which cannot)
function envScale(k) {
  if (E.envK === k) return; E.envK = k;
  Object.values(E.mats).concat([E.floorMat, E.wallMat]).forEach((m) => { if (!m || m.envMapIntensity === undefined) return; if (m.userData.env0 === undefined) m.userData.env0 = m.envMapIntensity; m.envMapIntensity = m.userData.env0 * (m.metalness > .5 ? 1 : k); });
}
const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
function renderFrame() {
  const A = E.acc, r = E.r;
  if (!A) { r.render(E.scene, E.cam); return; }
  const w = r.domElement.width, h = r.domElement.height;
  if (A.w !== w || A.h !== h) {
    if (A.rtS) { A.rtS.dispose(); A.rtA.dispose(); }
    const o = { format: THREE.RGBAFormat, encoding: THREE.sRGBEncoding };
    A.rtS = r.capabilities.isWebGL2 ? new THREE.WebGLMultisampleRenderTarget(w, h, o) : new THREE.WebGLRenderTarget(w, h, o);
    A.rtA = new THREE.WebGLRenderTarget(w, h, { format: THREE.RGBAFormat, type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false });
    A.w = w; A.h = h; E.dirty = true;
  }
  if (E.dirty) { A.n = 0; E.dirty = false; }
  if (A.n >= A.max) return; // settled: nothing to draw, the phone rests
  const n = A.n, still = n > 0, tg = E.orbit.target;
  E.sky.target.position.copy(tg); E.sky.shadow.autoUpdate = still;
  if (still) {
    // key light: anywhere on a large softbox; room light: one direction of the half-space in front of the wall
    const u = halton(n, 2), v = halton(n, 3), a = 2 * Math.PI * u, rd = .38 * Math.sqrt(v);
    E.key.position.set(E.keyPos.x + Math.cos(a) * rd, E.keyPos.y + Math.sin(a) * rd * .5, E.keyPos.z + Math.sin(a) * rd);
    const u2 = halton(n, 5), v2 = halton(n, 7), az = Math.PI * (.04 + .92 * u2), el = Math.asin(.12 + .88 * Math.sqrt(v2));
    E.sky.position.set(tg.x + Math.cos(az) * Math.cos(el) * 6, tg.y + Math.sin(el) * 6, tg.z + Math.sin(az) * Math.cos(el) * 6);
    E.sky.intensity = ACC.sky; E.hemi.intensity = .08; if (E.aoMat) E.aoMat.opacity = .2; envScale(ACC.env);
    E.cam.setViewOffset(w, h, halton(n, 2) - .5, halton(n, 3) - .5, w, h);
  } else { E.key.position.copy(E.keyPos); E.sky.intensity = 0; E.hemi.intensity = .3; if (E.aoMat) E.aoMat.opacity = 1; envScale(1); }
  r.setRenderTarget(A.rtS); r.render(E.scene, E.cam); if (still) E.cam.clearViewOffset();
  const ac = r.autoClear; r.autoClear = false;
  A.quad.material = A.add; A.add.uniforms.t.value = A.rtS.texture; A.add.uniforms.a.value = 1 / (n + 1); r.setRenderTarget(A.rtA); r.render(A.sc, A.cam);
  A.quad.material = A.out; A.out.uniforms.t.value = A.rtA.texture; r.setRenderTarget(null); r.render(A.sc, A.cam);
  r.autoClear = ac; A.n++;
}
function loop() {
  if (!E.running) return; requestAnimationFrame(loop);
  const moving = applyOpens(E.opens, true);
  const ob = E.orbit, sp = Math.sin(ob.phi), key = [ob.theta, ob.phi, ob.r, ob.target.x, ob.target.y, ob.target.z].map((v) => v.toFixed(4)).join();
  if (moving || key !== E.camKey) { E.dirty = true; E.camKey = key; }
  E.cam.position.set(ob.target.x + ob.r * sp * Math.sin(ob.theta), ob.target.y + ob.r * Math.cos(ob.phi), ob.target.z + ob.r * sp * Math.cos(ob.theta));
  E.cam.lookAt(ob.target); renderFrame();
}
function startLoop() { if (!E.running && E.inited) { E.running = true; requestAnimationFrame(loop); } }
function stopLoop() { E.running = false; }
function renderView() {
  if (!E.ok) S.view = 'photo';
  $('#viewSeg').hidden = !E.ok;
  function renderView() {
  if (!E.ok) S.view = 'photo';
  $('#viewSeg').hidden = !E.ok;
  document.querySelectorAll('#viewSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === S.view)));
  $('#stage3d').hidden = S.view !== '3d'; $('#stagePhoto').hidden = S.view !== 'photo'; $('#recenter').hidden = S.view !== '3d';
  if (S.view === '3d') {
    init3D(); if (!E.ok) return renderView();
    resize3D(); build3D(); if (!E.framed) { frame(); E.framed = true; } startLoop();
  } else { stopLoop(); drawPhotoView(true); updateOpenBtn(); }
  updateRealBtn();
}
function refreshView() { if (S.view === '3d' && E.inited) build3D(); else { drawPhotoView(true); updateOpenBtn(); } updateRealBtn(); }
const PH = { scene: null, cam: null, opens: [], picks: [], ok: true };
function photoLight() {
  try {
    const c = document.createElement('canvas'); c.width = 24; c.height = 24; const g = c.getContext('2d'); g.drawImage(S.photo, 0, 0, 24, 24); const d = g.getImageData(0, 0, 24, 24).data;
    let top = [0, 0, 0], bot = [0, 0, 0], nt = 0, nb = 0, lum = 0;
    for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) { const i = (y * 24 + x) * 4, r = d[i], gg = d[i + 1], b = d[i + 2]; lum += (.2126 * r + .7152 * gg + .0722 * b) / 255; if (y < 12) { top[0] += r; top[1] += gg; top[2] += b; nt++; } if (y >= 18) { bot[0] += r; bot[1] += gg; bot[2] += b; nb++; } }
    lum /= 576; top = top.map((v) => v / nt / 255); bot = bot.map((v) => v / nb / 255);
    const mx = Math.max(top[0], top[1], top[2], .01), warm = new THREE.Color(.45 + .55 * top[0] / mx, .45 + .55 * top[1] / mx, .45 + .55 * top[2] / mx);
    return { warm, k: clamp(.2 + lum * 1.05, .4, 1.15), sky: new THREE.Color(.5 + top[0] * .5, .5 + top[1] * .5, .5 + top[2] * .5), ground: new THREE.Color(bot[0], bot[1], bot[2]) };
  } catch { return { warm: new THREE.Color(1, .95, .9), k: 1, sky: new THREE.Color(1, 1, 1), ground: new THREE.Color(.5, .45, .4) }; }
}
function buildPhotoScene(Wp, Hp) {
  const p = currentProp(), cu = S.custom[S.active];
  if (PH.scene) disposeScene(PH.scene);
  const sc = new THREE.Scene(); if (T.env) sc.environment = T.env;
  // The camera of the photo, recovered from the first zone (focal length and position): every module is then
  // posed on its own rectangle of wall, so the furniture follows the perspective of the picture.
  const zs = p.modules.map((m, mi) => zoneFor(m, mi) || DEFZ), f = zonePose(zs[0], Wp, Hp).f;
  const cam = new THREE.PerspectiveCamera(2 * Math.atan(Hp / 2 / f) * 180 / Math.PI, Wp / Hp, 10, 80000); cam.position.set(0, 0, 0); cam.lookAt(0, 0, -1); cam.updateMatrixWorld();
  const est = photoLight();
  sc.add(new THREE.HemisphereLight(est.sky, est.ground, .45 * est.k));
  sc.userData.exp = clamp(.55 + est.k * .35, .6, .95); const dl = new THREE.DirectionalLight(est.warm, 1.0 * est.k); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048); dl.shadow.bias = -0.0006; sc.add(dl);
  const M = matsFor(cu), feet = feetById(cu.pieds);
  PH.opens = []; PH.picks = []; REG = PH;
  const V = (v, k) => new THREE.Vector3(v[0] * k, -v[1] * k, -v[2] * k); // camera axes of the photo (y down, z forward) → three.js
  let base = null;
  p.modules.forEach((m, mi) => {
    const z = zs[mi], L = layoutModule(m, z), P = zonePose(z, Wp, Hp, f), A = pos(z.A) || L.W, B = pos(z.B) || A * P.ratio;
    const ex = V(P.r1, 1), ey = V(P.r2, -1), ez = V(P.r3, -1);
    const G = new THREE.Group(); G.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(ex, ey, ez));
    G.position.copy(V(P.o, A)).addScaledVector(ey, -B).addScaledVector(ex, (A - L.W) / 2); sc.add(G);
    buildModule(G, L, mi, M, feet);
    if (!base || (base.L.raised && !L.raised)) base = { G, L };
  });
  REG = null;
  // shadow catchers: the floor under the furniture and the wall behind it, in the furniture's own frame
  const fg = new THREE.Group(); fg.position.copy(base.G.position); fg.quaternion.copy(base.G.quaternion); sc.add(fg);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000), new THREE.ShadowMaterial({ opacity: .42 })); fl.userData.own = true; fl.rotation.x = -Math.PI / 2; fl.position.set(0, base.L.raised ? -2000 : 0, 0); fl.receiveShadow = true; fg.add(fl);
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000), new THREE.ShadowMaterial({ opacity: .22 })); wl.userData.own = true; wl.position.set(0, 0, -2); wl.receiveShadow = true; fg.add(wl);
  fg.updateMatrixWorld(true);
  const bl = base.L; dl.position.copy(fg.localToWorld(new THREE.Vector3(bl.W / 2 - 1700, bl.H + 2600, bl.D + 2200))); dl.target.position.copy(fg.localToWorld(new THREE.Vector3(bl.W / 2, 0, bl.D / 2))); sc.add(dl.target);
  Object.assign(dl.shadow.camera, { left: -4500, right: 4500, top: 4500, bottom: -4500, near: 100, far: 15000 }); dl.shadow.camera.updateProjectionMatrix();
  sc.userData.dl = dl; sc.userData.dlPos = dl.position.clone(); dl.shadow.autoUpdate = false;
  PH.scene = sc; PH.cam = cam;
}
function drawPhotoView(rebuild) {
  const cv = $('#cv3'); const p = currentProp(); if (!p) return;
  const r = PH.ok && E.ok ? thumbR(10, 10) : null;
  if (!r) { PH.ok = false; drawProjection(); return; }
  try {
    const g = drawPhoto(cv), Wp = cv.width, Hp = cv.height;
    if (rebuild || !PH.scene) buildPhotoScene(Wp, Hp);
    applyOpens(PH.opens, false);
    const sc = PH.scene, dl = sc.userData.dl, pos0 = sc.userData.dlPos, N = PH.frames = 6; // a few frames, the light moved a little each time: soft shadows in the photo too
    const under = document.createElement('canvas'); under.width = Wp; under.height = Hp; const ug = under.getContext('2d');
    thumbR(Wp, Hp); r.setClearColor(0x000000, 0); r.toneMappingExposure = sc.userData.exp || .85;
    for (let i = 0; i < N; i++) {
      const a = 2 * Math.PI * halton(i, 2), rd = Math.sqrt(halton(i, 3)) * 900; dl.position.set(pos0.x + Math.cos(a) * rd, pos0.y + Math.sin(a) * rd * .4, pos0.z + Math.sin(a) * rd);
      dl.shadow.needsUpdate = true; r.render(sc, PH.cam); ug.globalAlpha = 1 / (i + 1); ug.drawImage(T.cv, 0, 0, Wp, Hp);
    }
    r.toneMappingExposure = 1; g.drawImage(under, 0, 0);
    S.keys2d = PH.opens.map((o) => o.userData.key); S.hits = [];
  } catch (err) { PH.ok = false; drawProjection(); }
}
document.querySelectorAll('#viewSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === S.view)));
  $('#stage3d').hidden = S.view !== '3d'; $('#stagePhoto').hidden = S.view !== 'photo'; $('#recenter').hidden = S.view !== '3d';
  if (S.view === '3d') {
    init3D(); if (!E.ok) return renderView();
    resize3D(); build3D(); if (!E.framed) { frame(); E.framed = true; } startLoop();
  } else { stopLoop(); drawPhotoView(true); updateOpenBtn(); }
  updateRealBtn();
}
document.querySelectorAll('#viewSeg button').forEach((b) => b.addEventListener('click', () => { S.view = b.dataset.view; renderView(); }));

/* ================= offscreen renders: handle and feet thumbnails, notice illustrations ================= */
const T = { r: null, cv: null, env: null, failed: false, cache: {} };
function thumbR(w, h) {
  if (T.failed || !E.ok) return null;
  try {
    if (!T.r) { T.cv = document.createElement('canvas'); T.r = new THREE.WebGLRenderer({ canvas: T.cv, antialias: true, preserveDrawingBuffer: true, alpha: true }); T.r.outputEncoding = THREE.sRGBEncoding; T.r.shadowMap.enabled = true; T.r.toneMapping = THREE.ACESFilmicToneMapping; T.env = makeEnv(T.r); }
    T.r.setPixelRatio(1); T.r.setSize(w, h, false); return T.r;
  } catch { T.failed = true; return null; }
}
function disposeScene(sc) { sc.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.userData.own) o.material.dispose(); }); }
function photoScene(bg) {
  const sc = new THREE.Scene(); sc.background = lin(bg); if (T.env) sc.environment = T.env;
  sc.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, .3));
  const dl = new THREE.DirectionalLight(0xffffff, .85); dl.castShadow = true; dl.shadow.mapSize.set(1024, 1024); dl.shadow.bias = -0.0005; sc.add(dl); sc.userData.dl = dl; return sc;
}
function handleThumb(h, hfId, facId) {
  const key = `h|${h.id}|${hfId}|${facId}`; if (T.cache[key]) return T.cache[key];
  const r = thumbR(288, 176); if (!r) return null;
  const span = Math.max(h.L || 50, 70), PW = span * 2.1, PH = span * 1.28;
  const sc = photoScene('#EFEBE5'); const dl = sc.userData.dl; dl.position.set(span * .9, span * 1.6, span * 2.2); Object.assign(dl.shadow.camera, { left: -PW, right: PW, top: PW, bottom: -PW, near: 1, far: span * 8 }); dl.shadow.camera.updateProjectionMatrix();
  const pan = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, 18), mat(facId)); pan.position.set(0, 0, -9); pan.receiveShadow = true; sc.add(pan);
  const hg = makeHandle(h, mat('h:' + hfId), 'h', PW); if (h.top) hg.position.set(0, PH / 2 - 14, 0); sc.add(hg);
  const cam = new THREE.PerspectiveCamera(28, 288 / 176, 1, span * 20); cam.position.set(span * .35, span * .45, span * 2.05); cam.lookAt(0, h.top ? PH * .2 : 0, 10);
  r.render(sc, cam); const url = T.cv.toDataURL('image/jpeg', .86); disposeScene(sc); T.cache[key] = url; return url;
}
function feetThumb(f, structId) {
  const key = `f|${f.id}|${structId}`; if (T.cache[key]) return T.cache[key];
  const r = thumbR(288, 176); if (!r) return null;
  const sc = photoScene('#EFEBE5'); const dl = sc.userData.dl; dl.position.set(300, 700, 500); Object.assign(dl.shadow.camera, { left: -600, right: 600, top: 600, bottom: -600, near: 10, far: 2500 }); dl.shadow.camera.updateProjectionMatrix();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.MeshStandardMaterial({ color: lin('#CDB89B'), roughness: .9 })); floor.userData.own = true; floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
  const G = new THREE.Group(); sc.add(G); const L = { W: 520, D: 300, legs: 110 }; const mS = mat(structId);
  bx(L.W, 160, L.D, mS, 0, L.legs, 0, G);
  if (f.hidden) bx(L.W - 2 * f.inset, L.legs, 18, mS, f.inset, 0, L.D - 18 - f.inset, G);
  else [20, L.W - 70].forEach((x) => [40, L.D - 90].forEach((z) => leg3D(G, f, L, mS, x, z, L.legs)));
  const cam = new THREE.PerspectiveCamera(30, 288 / 176, 10, 5000); cam.position.set(-160, 230, 700); cam.lookAt(120, 110, 150);
  r.render(sc, cam); const url = T.cv.toDataURL('image/jpeg', .86); disposeScene(sc); T.cache[key] = url; return url;
}
function hwIcon(g, x, y, c) {
  g.save(); g.strokeStyle = '#15171A'; g.fillStyle = '#15171A'; g.lineWidth = 2;
  if ('ABCV'.includes(c)) { g.fillRect(x - 7, y - 10, 14, 4); g.beginPath(); g.moveTo(x, y - 6); g.lineTo(x, y + 12); g.stroke(); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x - 3, y - 2 + i * 4); g.lineTo(x + 3, y + i * 4); g.stroke(); } }
  else if (c === 'D') { g.beginPath(); g.arc(x - 4, y, 6, 0, Math.PI * 2); g.stroke(); g.strokeRect(x + 2, y - 4, 10, 8); }
  else if (c === 'E') { g.beginPath(); g.moveTo(x - 8, y - 8); g.lineTo(x - 8, y + 8); g.lineTo(x + 8, y + 8); g.stroke(); }
  else if (c === 'G') { g.strokeRect(x - 12, y - 3, 24, 6); g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x + 6, y); g.stroke(); }
  else { g.beginPath(); g.arc(x, y, 7, 0, Math.PI * 2); g.stroke(); }
  g.restore();
}
function renderStep() {
  const N = S.notice; const st = N && N.steps[S.nstep]; const cv = $('#stepCv'); const g = cv.getContext('2d'); const Wc = 900, Hc = 660;
  cv.width = Wc; cv.height = Hc; g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, Wc, Hc);
  if (!st) return;
  const mod = st.mod;
  if (!mod) { g.fillStyle = '#565D6A'; g.font = '600 20px "Geist", system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('Assemblage final des modules', Wc / 2, Hc / 2); return; }
  const r = thumbR(Wc, Hc);
  if (!r) { g.fillStyle = '#565D6A'; g.font = '600 18px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('Illustration indisponible sur cet appareil', Wc / 2, Hc / 2); return; }
  // Drawn like a printed assembly leaflet: white paper, flat tones, bold ink outlines with hidden lines removed,
  // an axonometric view (no perspective) always framed on the whole drawing, cabinets shown open with what is inside.
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0xffffff);
  sc.add(new THREE.AmbientLight(0xffffff, .9)); const dl = new THREE.DirectionalLight(0xffffff, .3); dl.position.set(1.2, 2, 1.6); sc.add(dl);
  const box3 = new THREE.Box3(), news = new Set(st.news), show = new Set(st.all ? mod.parts.map((p) => p.code) : st.show), centers = [];
  const ML = mod.L, lw = Math.max(2.4, Math.hypot(ML.W, ML.H, ML.D) * .0026), unit = new THREE.BoxGeometry(1, 1, 1);
  const ink = [new THREE.MeshBasicMaterial({ color: 0x17191C }), new THREE.MeshBasicMaterial({ color: 0xA8430A })];
  const face = [new THREE.MeshLambertMaterial({ color: 0xF6F5F2 }), new THREE.MeshLambertMaterial({ color: 0xFFD3B4 })];
  const put = (m, sx, sy, sz, x, y, z) => { const me = new THREE.Mesh(unit, m); me.scale.set(sx, sy, sz); me.position.set(x, y, z); sc.add(me); return me; };
  const solid = (x, y, z, w, h, d, n) => {
    w = Math.max(w, 2); h = Math.max(h, 2); d = Math.max(d, 2);
    box3.expandByObject(put(face[n], w, h, d, x + w / 2, y + h / 2, z + d / 2));
    for (const yy of [y, y + h]) for (const zz of [z, z + d]) put(ink[n], w + lw, lw, lw, x + w / 2, yy, zz);
    for (const xx of [x, x + w]) for (const zz of [z, z + d]) put(ink[n], lw, h + lw, lw, xx, y + h / 2, zz);
    for (const xx of [x, x + w]) for (const yy of [y, y + h]) put(ink[n], lw, lw, d + lw, xx, yy, z + d / 2);
  };
  // a cabinet (open at the front) or a drawer box / crate (open at the top), made of its panels
  const hollow = (x, y, z, w, h, d, n, th, open) => {
    solid(x, y, z, th, h, d, n); solid(x + w - th, y, z, th, h, d, n); solid(x + th, y, z, w - 2 * th, th, d, n);
    if (open === 'front') { solid(x + th, y + h - th, z, w - 2 * th, th, d, n); solid(x + th, y + th, z, w - 2 * th, h - 2 * th, 5, n); }
    else { solid(x + th, y + th, z, w - 2 * th, h - th, th, n); solid(x + th, y + th, z + d - th, w - 2 * th, h - th, th, n); }
  };
  const addBox = (b, isNew, off, part) => {
    const n = isNew ? 1 : 0, x = b[0] + off[0], y = b[1] + off[1], z = b[2] + off[2], [, , , w, h, d] = b, role = part && part.role;
    if (role === 'caisson') {
      hollow(x, y, z, w, h, d, n, ML.t, 'front');
      ML.shelves.filter((s) => s.x >= b[0] - 2 && s.x + s.w <= b[0] + w + 2).forEach((s) => solid(s.x + off[0], s.y + off[1], z + 6, s.w, ML.t, d - 26, n));
    } else if (role === 'tiroirbox' || role === 'caisse') hollow(x, y, z, w, h, d, n, 12, 'top');
    else solid(x, y, z, w, h, d, n);
    return new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2);
  };
  // "check the parts": everything spread apart, each part with its mark
  const mid = [ML.W / 2, ML.H / 2, ML.D / 2];
  const spread = (p) => { const b = p.box, c = [b[0] + b[3] / 2, b[1] + b[4] / 2], kx = (c[0] - mid[0]), ky = (c[1] - mid[1]);
    return p.role === 'plateau' ? [0, 300, 0] : p.role === 'dos' ? [0, 0, -340] : p.role === 'plinthe' ? [0, -140, 220] : p.role === 'facade' ? [kx * .3, ky * .35, 460] : p.role === 'caisse' ? [kx * .3, ky * .35, 420]
      : p.role === 'tiroirbox' ? [kx * .3, ky * .35, 200] : p.role === 'caisson' ? [kx * .4, 0, 0] : [kx * .5, ky * .55, 0]; };
  mod.parts.forEach((p) => {
    if (!show.has(p.code)) return; const isNew = news.has(p.code); const off = st.all ? spread(p) : isNew && st.explode ? st.explode : [0, 0, 0];
    const c = addBox(p.box, isNew, off, p); if (isNew || st.all) centers.push({ code: p.code, c, all: !!st.all, final: new THREE.Vector3(p.box[0] + p.box[3] / 2, p.box[1] + p.box[4] / 2, p.box[2] + p.box[5] / 2) });
  });
  st.extra.forEach((b) => addBox(b.box, b.isNew, st.all ? [0, -170, 0] : [0, 0, 0]));
  // hardware: a dark dot where to drill or fix; screws drawn on the axis of their hole, with a dashed guide
  const ex = st.explode || [0, 0, 0], labelAt = {}; let detail = null;
  const dot = new THREE.MeshBasicMaterial({ color: 0x15171A }), metal = new THREE.MeshLambertMaterial({ color: 0x8A8E95 }), hole = new THREE.MeshBasicMaterial({ color: 0x15171A });
  st.markers.forEach((mk) => {
    const f = mk.follow ? ex : [0, 0, 0], P = new THREE.Vector3(mk.p[0] + f[0], mk.p[1] + f[1], mk.p[2] + f[2]);
    if (!mk.d) { const s0 = new THREE.Mesh(new THREE.SphereGeometry(Math.max(7, lw * 2.4), 14, 10), dot); s0.position.copy(P); s0.userData.own = true; sc.add(s0); if (!labelAt[mk.c]) labelAt[mk.c] = P.clone(); return; }
    const d = new THREE.Vector3(...mk.d).normalize(), back = Math.max(0, -(ex[0] * d.x + ex[1] * d.y + ex[2] * d.z));
    const gap = 45 + back, len = mk.c === 'C' ? 20 : 38, tip = P.clone().addScaledVector(d, -gap), headP = tip.clone().addScaledVector(d, -len);
    const hm = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 4, 12), hole); hm.position.copy(P); hm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); sc.add(hm);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 1.2, len, 10), metal); sh.position.copy(tip.clone().add(headP).multiplyScalar(.5)); sh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); sc.add(sh);
    const hd = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 3, 14), metal); hd.position.copy(headP); hd.quaternion.copy(sh.quaternion); sc.add(hd);
    const lg = new THREE.BufferGeometry().setFromPoints([tip, P]); const ln = new THREE.Line(lg, new THREE.LineDashedMaterial({ color: 0xE8590C, dashSize: 8, gapSize: 6 })); ln.computeLineDistances(); sc.add(ln);
    [hm, sh, hd, ln].forEach((o) => { o.userData.own = true; });
    if (!labelAt[mk.c]) labelAt[mk.c] = headP.clone();
    if (!detail) detail = { mid: P.clone().add(headP).multiplyScalar(.5), span: gap + len, d: d.clone() };
  });
  if (box3.isEmpty()) box3.set(new THREE.Vector3(0, 0, 0), new THREE.Vector3(mod.L.W, mod.L.H, mod.L.D));
  const size = box3.getSize(new THREE.Vector3()), ctr = box3.getCenter(new THREE.Vector3());
  const dir = st.view === 'back' ? new THREE.Vector3(-.62, .5, -1) : st.view === 'below' ? new THREE.Vector3(.62, -.7, .95) : new THREE.Vector3(.62, .52, 1);
  dir.normalize(); const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 10, 400000);
  cam.position.copy(ctr).addScaledVector(dir, 60000 + size.length()); cam.lookAt(ctr); cam.updateMatrixWorld(); cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const cx of [box3.min.x, box3.max.x]) for (const cy of [box3.min.y, box3.max.y]) for (const cz of [box3.min.z, box3.max.z]) { const v = new THREE.Vector3(cx, cy, cz).applyMatrix4(cam.matrixWorldInverse); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
  // margins, room for the hardware box at the top, then the frame takes the shape of the picture
  const padX = (x1 - x0) * .07 + 40, padY = (y1 - y0) * .08 + 40; x0 -= padX; x1 += padX; y0 -= padY; y1 += padY + (st.hw.length ? (y1 - y0) * (.07 + .05 * st.hw.length) : 0);
  let hw_ = (x1 - x0) / 2, hh_ = (y1 - y0) / 2; const mx_ = (x0 + x1) / 2, my_ = (y0 + y1) / 2, asp = Wc / Hc;
  if (hw_ / hh_ < asp) hw_ = hh_ * asp; else hh_ = hw_ / asp;
  cam.left = mx_ - hw_; cam.right = mx_ + hw_; cam.top = my_ + hh_; cam.bottom = my_ - hh_;
  cam.updateProjectionMatrix();
  r.render(sc, cam); g.drawImage(T.cv, 0, 0, Wc, Hc);
  if (detail) { // zoomed inset on the first screw: it sits right on the axis of its hole
    const iw = 300, ih = 204, ix = Wc - iw - 12, iy = Hc - ih - 12, cam2 = new THREE.PerspectiveCamera(30, iw / ih, 5, 100000);
    const dd = Math.max(detail.span * 1.6, 220) / (2 * Math.tan(15 * Math.PI / 180));
    // look across the screw axis, with the panels see-through, so the screw and its hole are always visible
    const side = dir.clone().addScaledVector(detail.d, -dir.dot(detail.d)); if (side.lengthSq() < .01) side.set(1, .4, .6); side.normalize();
    cam2.position.copy(detail.mid).addScaledVector(side, dd); cam2.lookAt(detail.mid); cam2.updateMatrixWorld();
    sc.traverse((o) => { if (o.isMesh && o.material && o.material.isMeshLambertMaterial && o.material.color.getHex() !== 0x8A8E95) { o.material.transparent = true; o.material.opacity = .28; o.material.depthWrite = false; } });
    thumbR(iw, ih); r.render(sc, cam2);
    g.save(); g.fillStyle = '#FFFFFF'; g.strokeStyle = '#15171A'; g.lineWidth = 1.5; rr(g, ix, iy, iw, ih, 10); g.fill(); g.save(); g.clip(); g.drawImage(T.cv, ix, iy, iw, ih); g.restore(); rr(g, ix, iy, iw, ih, 10); g.stroke();
    g.fillStyle = '#15171A'; g.font = '700 12px "Geist", system-ui, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText('Détail', ix + 10, iy + 8); g.restore();
    const [mx, my] = (() => { const q = detail.mid.clone().project(cam); return [(q.x + 1) / 2 * Wc, (1 - q.y) / 2 * Hc]; })();
    g.save(); g.strokeStyle = 'rgba(21,23,26,.5)'; g.setLineDash([4, 4]); g.lineWidth = 1.2; g.beginPath(); g.arc(mx, my, 16, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(mx + 12, my + 12); g.lineTo(ix, iy + 20); g.stroke(); g.restore();
  }
  disposeScene(sc); face.concat(ink).forEach((m) => m.dispose());
  const proj = (v) => { const q = v.clone().project(cam); return [(q.x + 1) / 2 * Wc, (1 - q.y) / 2 * Hc]; };
  g.save(); g.strokeStyle = '#E8590C'; g.fillStyle = '#E8590C'; g.lineWidth = 2;
  if (st.explode && !st.all) centers.forEach((o) => { const a = proj(o.c), b = proj(o.final); if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 20) { g.setLineDash([7, 6]); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.setLineDash([]); head(g, a[0], a[1], b[0], b[1], 11); } });
  g.restore();
  const seen = {};
  Object.entries(labelAt).forEach(([c, v]) => { seen[c] = proj(v); });
  Object.entries(seen).forEach(([c, [x, y]]) => { const lx = clamp(x + 26, 20, Wc - 20), ly = clamp(y - 26, 20, Hc - 20); g.strokeStyle = '#15171A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(lx, ly); g.stroke(); badge(g, lx, ly, c, 13); });
  centers.forEach((o) => { const [x, y] = proj(o.c); g.font = '800 16px "Geist Mono", ui-monospace, monospace'; const w = g.measureText(o.code).width + 16; g.fillStyle = '#15171A'; rr(g, x - w / 2, y - 13, w, 26, 6); g.fill(); g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.code, x, y + 1); });
  if (st.hw.length) {
    const rowH = 30, bw = 330, bh = st.hw.length * rowH + 14; g.fillStyle = '#FFFFFF'; g.strokeStyle = '#15171A'; g.lineWidth = 1.5; rr(g, 12, 12, bw, bh, 8); g.fill(); g.stroke();
    st.hw.forEach(([c, q], i) => { const y = 12 + 7 + rowH * i + rowH / 2; hwIcon(g, 34, y, c); g.fillStyle = '#15171A'; g.font = '800 17px "Geist Mono", ui-monospace, monospace'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(`${q} ×`, 58, y); badge(g, 124, y, c, 11); g.font = '600 12px "Geist", system-ui, sans-serif'; g.fillStyle = '#565D6A'; g.fillText(c === 'H' ? 'poignées' : c === 'I' ? 'pieds' : (HW[c] ? (HW[c].nom.length > 26 ? HW[c].nom.slice(0, 25).trim() + '…' : HW[c].nom) : ''), 142, y); });
  }
}
function tagsRow(label, items, cls) { const w = document.createElement('div'); w.className = 'tags'; const l = document.createElement('span'); l.className = 'subh'; l.textContent = label; l.style.width = '100%'; w.appendChild(l); items.forEach((t) => { const s = document.createElement('span'); s.className = 'tag ' + (cls || ''); s.textContent = t; w.appendChild(s); }); return w; }
function renderNotice() {
  const N = S.notice; if (!N) return; const cu = S.custom[S.active];
  document.querySelectorAll('#nTabs button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === S.ntab)));
  $('#nSteps').hidden = S.ntab !== 'steps'; $('#nParts').hidden = S.ntab !== 'parts'; $('#nHw').hidden = S.ntab !== 'hw'; $('#nTools').hidden = S.ntab !== 'tools';
  if (S.ntab === 'steps') {
    S.nstep = clamp(S.nstep, 0, N.steps.length - 1); const st = N.steps[S.nstep];
    $('#sTitle').textContent = st.title; $('#sCount').textContent = `Étape ${S.nstep + 1} sur ${N.steps.length}`;
    const tg = $('#sTags'); tg.innerHTML = '';
    if (st.news.length) tg.appendChild(tagsRow('Pièces', st.news.map((c) => { const p = N.parts.find((x) => x.code === c); return p ? `${c} · ${p.nom}` : c; }), 'code'));
    if (st.hw.length) tg.appendChild(tagsRow('Quincaillerie', st.hw.map(([c, q]) => `${q} × ${c} · ${hwName(c, cu)}`), 'hw'));
    if (st.tools.length) tg.appendChild(tagsRow('Outils', st.tools));
    const ol = $('#sInstr'); ol.innerHTML = ''; st.text.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ol.appendChild(li); });
    const lk = $('#sLinks'); lk.innerHTML = ''; st.links.forEach((l) => { const a = document.createElement('a'); a.href = l.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = l.label + ' ↗'; lk.appendChild(a); lk.appendChild(document.createElement('br')); });
    $('#sPrev').disabled = S.nstep === 0; $('#sNext').disabled = S.nstep >= N.steps.length - 1;
    renderStep();
  } else if (S.ntab === 'parts') {
    const tb = $('#partsBody'); tb.innerHTML = '';
    N.parts.forEach((p) => { const tr = document.createElement('tr'); const a = document.createElement('td'); a.className = 'code'; a.textContent = p.code; const b = document.createElement('td'); b.textContent = p.nom; const c = document.createElement('td'); c.className = 'n'; c.textContent = p.dims; tr.append(a, b, c); tb.appendChild(tr); });
  } else if (S.ntab === 'hw') {
    const tb = $('#hwBody'); tb.innerHTML = '';
    Object.keys(N.hw).sort().forEach((c) => { const tr = document.createElement('tr'); const a = document.createElement('td'); a.className = 'code'; a.textContent = c; const b = document.createElement('td'); b.textContent = hwName(c, cu); const q = document.createElement('td'); q.className = 'n'; q.textContent = N.hw[c]; tr.append(a, b, q); tb.appendChild(tr); });
  } else {
    const tb = $('#toolsBody'); tb.innerHTML = ''; N.tools.forEach((t) => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = t; tb.appendChild(s); });
  }
}
document.querySelectorAll('#nTabs button').forEach((b) => b.addEventListener('click', () => { S.ntab = b.dataset.tab; renderNotice(); }));
$('#sPrev').onclick = () => { S.nstep--; renderNotice(); };
$('#sNext').onclick = () => { S.nstep++; renderNotice(); };

/* ================= saving projects (this browser) ================= */
function readStore() { try { const v = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
function writeStore(list) { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; } catch { return false; } }
let toastT = null;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); }
function snapshot() {
  return { id: S.projId, name: S.projName, savedAt: Date.now(), step: S.step, project: S.project, fab: S.fab, itemsBy: S.itemsBy, customBy: S.customBy, ambiance: S.ambiance,
    zones: S.zones, level: S.level, tools: [...S.tools], shops: [...S.shops], example: S.example, photo: S.example ? null : (S.photoData || (S.photo && photoDataOf(S.photo))),
    result: S.result, custom: S.custom, active: S.active, genZones: S.genZones, view: S.view };
}
function saveProject(name) {
  S.projName = name || `${projectName()} du ${new Date().toLocaleDateString('fr-FR')}`; if (!S.projId) S.projId = 'p' + Date.now().toString(36);
  const snap = snapshot(); snap.id = S.projId;
  const list = readStore().filter((x) => x.id !== S.projId); list.unshift(snap);
  if (writeStore(list)) toast('Projet enregistré'); else toast('Mémoire du navigateur pleine : supprimez un ancien projet.');
}
$('#saveBtn').onclick = () => {
  if (S.projId) { saveProject(S.projName); return; }
  $('#saveName').value = `${projectName()} du ${new Date().toLocaleDateString('fr-FR')}`; $('#saveBar').hidden = false; $('#saveName').focus();
};
$('#saveOk').onclick = () => { saveProject($('#saveName').value.trim()); $('#saveBar').hidden = true; };
$('#saveCancel').onclick = () => { $('#saveBar').hidden = true; };
function loadProject(pj) {
  S.projId = pj.id; S.projName = pj.name || ''; S.project = pj.project || 'tv'; S.fab = pj.fab || 'mixte'; S.level = pj.level || 'bricoleur';
  S.tools = new Set(pj.tools || []); S.shops = new Set(pj.shops || []); S.zones = Array.isArray(pj.zones) ? pj.zones : []; S.sel = 0; S.redraw = null;
  S.itemsBy = pj.itemsBy && typeof pj.itemsBy === 'object' ? pj.itemsBy : {}; S.customBy = pj.customBy && typeof pj.customBy === 'object' ? pj.customBy : {}; S.ambiance = pj.ambiance || 'bois';
  S.result = Array.isArray(pj.result) ? pj.result : [null, null, null]; S.custom = Array.isArray(pj.custom) ? pj.custom : [null, null, null];
  S.active = S.result[pj.active] ? pj.active : S.result.findIndex(Boolean); S.genZones = pj.genZones || null; S.view = pj.view || '3d';
  S.custom = S.custom.map((c, i) => (S.result[i] && !c) ? (initCustom(i), S.custom[i]) : c);
  S.custom.forEach((c) => { if (c && !c.pieds) c.pieds = 'carre_bois'; });
  E.state = {}; E.framed = false; S.nstep = 0;
  $('#propTabs').innerHTML = ''; $('#errBox').hidden = true; $('#result').hidden = true;
  renderOptions();
  const img = pj.photo ? (() => { const i = new Image(); i.src = pj.photo; return i; })() : examplePhoto();
  setPhoto(img, !pj.photo, () => show(S.result.some(Boolean) ? 4 : clamp(num(pj.step), 0, 3)));
  $('#sheet').hidden = true; toast(`Projet « ${S.projName} » ouvert`);
}
function renderProjects() {
  const box = $('#projList'); box.innerHTML = ''; const list = readStore();
  if (!list.length) { const p = document.createElement('p'); p.className = 'muted'; p.textContent = 'Aucun projet enregistré pour l’instant. Utilisez « Enregistrer » en haut de l’écran.'; box.appendChild(p); return; }
  list.forEach((pj) => {
    const c = document.createElement('div'); c.className = 'card proj';
    const im = document.createElement('img'); im.alt = ''; im.src = pj.photo || examplePhoto().src;
    const meta = document.createElement('div'); meta.className = 'meta'; const b = document.createElement('b'); b.textContent = pj.name || 'Projet sans nom';
    const s = document.createElement('span'); s.className = 'muted small'; s.textContent = `${(PROJECTS.find((x) => x[0] === pj.project) || [, 'Projet'])[1]} · ${new Date(pj.savedAt).toLocaleDateString('fr-FR')} · ${(pj.result || []).filter(Boolean).length} proposition(s)`; meta.append(b, s);
    const acts = document.createElement('div'); acts.className = 'acts';
    const o = document.createElement('button'); o.className = 'btn primary sm'; o.textContent = 'Ouvrir'; o.onclick = () => loadProject(pj);
    const d = document.createElement('button'); d.className = 'btn ghost sm'; d.textContent = 'Supprimer';
    d.onclick = () => { if (d.dataset.confirm) { writeStore(readStore().filter((x) => x.id !== pj.id)); if (S.projId === pj.id) { S.projId = null; S.projName = ''; } renderProjects(); } else { d.dataset.confirm = '1'; d.textContent = 'Confirmer'; } };
    acts.append(o, d); c.append(im, meta, acts); box.appendChild(c);
  });
}
$('#projBtn').onclick = () => { renderProjects(); $('#sheet').hidden = false; stopLoop(); };
$('#sheetClose').onclick = () => { $('#sheet').hidden = true; if (S.step === 4 && currentProp() && S.view === '3d') startLoop(); };

aiPing(); renderPing();
renderOptions();
setPhoto(examplePhoto(), true);
renderZones();
show(0);
if (new URLSearchParams(location.search).has('debug')) window.SNUG_DEBUG = { E, S, setPhoto, zonePose, ACC, renderResult, generate };
/* Developer hook used to render the preview pictures of the project cards: ?shot=tv */
(function () {
  const id = new URLSearchParams(location.search).get('shot'); if (!id) return;
  const P = {
    tv: [{ tv: 1, platine: 1, box: 1, ampli: 1, vinyles: 1, caisses: 3 }, [2400, 600, 450]],
    dressing: [{ penderie_l: 1, penderie_c: 2, pulls: 3, tiroirs: 3, chaussures: 1, valises: 1 }, [2400, 2500, 620]],
    biblio: [{ poches: 2, livres: 4, beaux: 1, deco: 2, ferme: 1 }, [2000, 2300, 350]],
    escalier: [{ aspirateur: 1, manteaux: 1, chaussures: 2, tiroirs: 2, etageres: 1, pente: 'gauche', h_bas: 900 }, [2400, 2300, 700]],
    bureau: [{ tiroirs: 3, livres: 1 }, [1700, 2500, 700]],
    autre: [{ etageres: 3, tiroirs: 2, ferme: 1 }, [1200, 900, 450]] }[id];
  if (!P) return;
  S.project = id; S.itemsBy[id] = { ...ENG.defaults(id), ...P[0] }; S.fab = 'sur_mesure'; S.ambiance = 'blanc_bois';
  S.zones = [{ ...DEFZ, A: P[1][0], B: P[1][1], C: P[1][2], D: 0 }];
  show(4); generate(); S.active = 2; renderResult(); document.body.classList.add('shot');
})();
})();
