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
  W: { nom: 'Vérin de réglage pour plinthe', rech: 'vérin réglable meuble plinthe', pack: 4, pp: 8, unit: 'lot de 4' }};
const finById = (id) => FIN.find((f) => f.id === id) || FIN[4];
const hfinById = (id) => HFIN.find((f) => f.id === id) || HFIN[0];
const handleById = (id) => HANDLES.find((h) => h.id === id) || HANDLES[0];
const feetById = (id) => FEET.find((f) => f.id === id) || FEET[0];
const PROJECTS = [['tv','Meuble TV','Bas, multimédia'],['dressing','Dressing','Penderie, tiroirs'],['biblio','Bibliothèque','Étagères, niches'],
  ['escalier','Sous escalier','Placard, tiroirs'],['bureau','Bureau','Plan + rangements'],['autre','Autre projet','Décrivez-le dessous']];
const FABS = [['standard','Tout faits','Caissons du commerce, presque pas de découpe'],['mixte','Mixte','Caissons du commerce + plateau sur mesure'],['sur_mesure','Sur mesure','Panneaux découpés aux cotes exactes']];
const LEVELS = [['debutant','Débutant','Je monte un meuble en kit'],['bricoleur','Bricoleur','Je perce et je fixe'],['expert','Expert','Je découpe moi-même']];
const TOOLS = ['Visseuse','Perceuse','Niveau','Scie sauteuse','Scie circulaire','Ponceuse','Défonceuse'];
const SHOPS = ['IKEA','Leroy Merlin','Castorama','But','Autoriser le mélange'];
const VARIANTS = [
  { nom: 'Économique', desc: "le moins cher possible : un maximum d'éléments standard, peu ou pas de découpe" },
  { nom: 'Équilibrée', desc: 'le meilleur compromis entre prix, rangement et finitions' },
  { nom: 'Optimale', desc: "l'espace exploité au centimètre, plus de sur-mesure et de beaux matériaux" }];
const TYPES = ['ouvert', 'porte', 'tiroir', 'caisse', 'abattant'];
const DENIED = ['not_granted', 'sampling_disabled', 'capability_disabled', 'not_declared', 'capability_removed', 'not_configured'];
const DEFZ = { x: .1, y: .42, w: .8, h: .4, A: 2450, B: 620, C: 440, D: 0 };
const STORE_KEY = 'atelier.projets.v1';

const S = {
  step: 0, photo: null, photoData: null, example: true, project: 'tv', fab: 'mixte',
  zones: [{ ...DEFZ }], sel: 0, redraw: null,
  level: 'bricoleur', tools: new Set(['Visseuse', 'Perceuse', 'Niveau']), shops: new Set(['IKEA', 'Leroy Merlin', 'Castorama', 'Autoriser le mélange']),
  result: [null, null, null], gen: [], rows: [], custom: [null, null, null], active: -1, genZones: null,
  view: '3d', hcat: 'Toutes', demo: false, sample: undefined, ticker: null, images: undefined,
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
  const warp = fb(u * 2, v * 4, 2, 4, 3), streak = fb(u * 3, v * 40, 3, 40, 3), fib = fb(u * 8, v * 128, 8, 128, 2), low = fb(u, v * 2, 1, 2, 2);
  const ring = Math.sin(2 * Math.PI * (v * 5 + warp * 1.7 + streak * .35)), band = Math.pow(.5 + .5 * ring, 3);
  const t = clamp(band * .55 + (streak - .5) * .75 + (fib - .5) * .75 + .08, 0, 1), lum = (1 + (low - .5) * .16) * (tint || 1);
  return [(A[0] + (B[0] - A[0]) * t) * lum, (A[1] + (B[1] - A[1]) * t) * lum, (A[2] + (B[2] - A[2]) * t) * lum];
}
function texCanvas(f, size) {
  const N = size || 256, key = f.id + '|' + N; if (TEX[key]) return TEX[key];
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
  try { const tex = new THREE.CanvasTexture(envCanvas()); tex.mapping = THREE.EquirectangularReflectionMapping; tex.encoding = THREE.sRGBEncoding;
    const pm = new THREE.PMREMGenerator(renderer); const rt = pm.fromEquirectangular(tex); pm.dispose(); tex.dispose(); return rt.texture; } catch { return null; }
}

/* ================= example photo ================= */
function examplePhoto() {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 840; const g = c.getContext('2d');
  g.fillStyle = '#D9D3C7'; g.fillRect(0, 0, 1200, 840);
  g.fillStyle = '#CBC4B6'; g.fillRect(0, 0, 70, 840); g.fillRect(1130, 0, 70, 840);
  g.fillStyle = '#EFEAE1'; g.fillRect(0, 640, 1200, 14);
  g.fillStyle = '#B89C7B'; g.fillRect(0, 654, 1200, 186);
  g.strokeStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < 1300; x += 120) { g.beginPath(); g.moveTo(x, 654); g.lineTo(x - 40, 840); g.stroke(); }
  g.fillStyle = '#1C1D20'; g.fillRect(380, 140, 520, 300); g.fillStyle = '#2E3A4A'; g.fillRect(392, 152, 496, 276);
  g.fillStyle = '#F7F4EE'; g.fillRect(560, 600, 30, 22);
  const img = new Image(); img.src = c.toDataURL('image/jpeg', .85); return img;
}

/* ================= canvas helpers ================= */
function fitCanvas(cv) {
  const img = S.photo; if (!img || !img.naturalWidth) return;
  const W = 1000, H = Math.round(W * img.naturalHeight / img.naturalWidth);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
}
function drawPhoto(cv) {
  fitCanvas(cv); const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height);
  if (S.photo && S.photo.naturalWidth) g.drawImage(S.photo, 0, 0, cv.width, cv.height);
  return g;
}
function rr(g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
function head(g, x1, y1, x2, y2, s) { const a = Math.atan2(y2 - y1, x2 - x1); g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - s * Math.cos(a - .45), y2 - s * Math.sin(a - .45)); g.lineTo(x2 - s * Math.cos(a + .45), y2 - s * Math.sin(a + .45)); g.closePath(); g.fill(); }
function arrow(g, x1, y1, x2, y2, s) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); head(g, x1, y1, x2, y2, s); head(g, x2, y2, x1, y1, s); }
function badge(g, x, y, t, r) {
  r = r || 15; g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = '#FFFFFF'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#E8590C'; g.stroke();
  g.fillStyle = '#15171A'; g.font = `800 ${Math.round(r * 1.1)}px "Plus Jakarta Sans", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x, y + 1); g.restore();
}
/* Arrows are drawn INSIDE each zone with small letter badges, so neighbouring zones never collide. */
function drawZonesOn(g, W, H, zones, sel, full) {
  zones.forEach((z, i) => {
    const x = z.x * W, y = z.y * H, w = z.w * W, h = z.h * H, on = !full && i === sel;
    g.save();
    g.fillStyle = on ? 'rgba(232,89,12,.14)' : 'rgba(232,89,12,.07)'; g.fillRect(x, y, w, h);
    g.setLineDash([12, 8]); g.strokeStyle = '#E8590C'; g.lineWidth = on || full ? 3.5 : 2.5; g.strokeRect(x, y, w, h); g.setLineDash([]);
    if (on) {
      const m = clamp(Math.min(w, h) * .12, 14, 26), hs = clamp(Math.min(w, h) * .08, 8, 14), br = clamp(Math.min(w, h) * .09, 10, 15);
      g.strokeStyle = '#E8590C'; g.fillStyle = '#E8590C'; g.lineWidth = 4;
      arrow(g, x + 8, y + h - m, x + w - m - 8, y + h - m, hs);
      arrow(g, x + w - m, y + 8, x + w - m, y + h - m - 8, hs);
      const dl = clamp(Math.min(w, h) * .3, 18, 70), cx0 = x + m + 4, cy0 = y + h - m - br * 2 - 6;
      arrow(g, cx0, cy0, cx0 + dl, cy0 - dl, hs);
      badge(g, x + (w - m) / 2, y + h - m, 'A', br);
      badge(g, x + w - m, y + (h - m) / 2, 'B', br);
      badge(g, cx0 + dl / 2 + br + 4, cy0 - dl / 2 + br * .4, 'C', br);
    }
    const r = full ? 26 : 15, cx = x + r + 6, cy = y + r + 6;
    g.fillStyle = '#E8590C'; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = `800 ${full ? 28 : 16}px "Plus Jakarta Sans", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(i + 1), cx, cy + 1);
    g.restore();
  });
}
function drawCotes(tmp) {
  const cv = $('#cv1'); const g = drawPhoto(cv); drawZonesOn(g, cv.width, cv.height, S.zones, S.sel, false);
  if (tmp) { g.save(); g.setLineDash([8, 6]); g.strokeStyle = '#E8590C'; g.lineWidth = 3; g.strokeRect(tmp.x * cv.width, tmp.y * cv.height, tmp.w * cv.width, tmp.h * cv.height); g.restore(); }
}

/* ================= zones ================= */
(function () {
  const cv = $('#cv1'); let drag = null;
  const pt = (e) => { const r = cv.getBoundingClientRect(); return { x: clamp((e.clientX - r.left) / r.width, 0, 1), y: clamp((e.clientY - r.top) / r.height, 0, 1) }; };
  const rectOf = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) });
  cv.addEventListener('pointerdown', (e) => { drag = { s: pt(e), c: pt(e) }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => { if (!drag) return; drag.c = pt(e); const r = rectOf(drag.s, drag.c); if (r.w > .02 || r.h > .02) drawCotes(r); });
  const end = (e) => {
    if (!drag) return; const r = rectOf(drag.s, drag.c); const a = drag.s; drag = null;
    if (e.type === 'pointerup' && r.w > .03 && r.h > .03) {
      if (S.redraw !== null && S.zones[S.redraw]) { Object.assign(S.zones[S.redraw], r); S.sel = S.redraw; S.redraw = null; }
      else { S.zones.push({ ...r, A: '', B: '', C: '', D: 0 }); S.sel = S.zones.length - 1; }
      renderZones();
    } else if (e.type === 'pointerup') {
      for (let i = S.zones.length - 1; i >= 0; i--) { const z = S.zones[i]; if (a.x >= z.x && a.x <= z.x + z.w && a.y >= z.y && a.y <= z.y + z.h) { S.sel = i; renderZones(); break; } }
    }
    drawCotes();
  };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
})();
const D_ICON = '<svg width="54" height="44" viewBox="0 0 54 44" aria-hidden="true"><rect x="10" y="4" width="34" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="2" y1="40" x2="52" y2="40" stroke="currentColor" stroke-width="2"/><line x1="27" y1="24" x2="27" y2="38" stroke="#E8590C" stroke-width="2.5"/><path d="M23 27 L27 23 L31 27 M23 35 L27 39 L31 35" fill="none" stroke="#E8590C" stroke-width="2"/></svg>';
function renderZones() {
  const box = $('#zoneList'); box.innerHTML = '';
  $('#zoneHint').textContent = S.redraw !== null ? `Dessinez à nouveau la zone ${S.redraw + 1} sur la photo.`
    : S.zones.length ? `${S.zones.length} zone${S.zones.length > 1 ? 's' : ''}. Glissez sur la photo pour en ajouter une, touchez une zone pour la sélectionner.`
    : 'Glissez le doigt sur la photo pour dessiner votre première zone.';
  S.zones.forEach((z, i) => {
    const card = document.createElement('div'); card.className = 'card zonecard' + (i === S.sel ? ' sel' : '');
    card.innerHTML = `<div class="zhead"><span class="znum">${i + 1}</span><b>Zone ${i + 1}</b><span class="sp"></span><button type="button" class="link" data-act="redraw">Redessiner</button><button type="button" class="link danger" data-act="del">Supprimer</button></div><div class="cotes"></div><p class="dhelp">${D_ICON}<span>D : mettez 0 si le meuble est posé au sol. S'il est fixé au mur, mesurez la hauteur entre le sol et le dessous du meuble.</span></p>`;
    const ct = card.querySelector('.cotes');
    [['A', 'Largeur'], ['B', 'Hauteur'], ['C', 'Profondeur'], ['D', 'Distance sol - dessous du meuble']].forEach(([k, l]) => {
      const id = `z${i}${k}`; const row = document.createElement('div'); row.className = 'cote';
      row.innerHTML = `<span class="k">${k}</span><label for="${id}">${l}</label><span class="u"><input id="${id}" type="number" inputmode="numeric" min="0"><span class="muted small">mm</span></span>`;
      const inp = row.querySelector('input'); inp.value = z[k];
      inp.addEventListener('input', () => { z[k] = inp.value; });
      inp.addEventListener('focus', () => { if (S.sel !== i) { S.sel = i; drawCotes(); document.querySelectorAll('.zonecard').forEach((c, j) => c.classList.toggle('sel', j === i)); } });
      ct.appendChild(row);
    });
    card.querySelector('[data-act=redraw]').onclick = () => { S.redraw = i; S.sel = i; renderZones(); drawCotes(); $('#cv1').scrollIntoView({ block: 'center' }); };
    card.querySelector('[data-act=del]').onclick = () => { S.zones.splice(i, 1); S.sel = clamp(S.sel, 0, Math.max(0, S.zones.length - 1)); S.redraw = null; renderZones(); drawCotes(); };
    box.appendChild(card);
  });
}
const zonesOk = () => S.zones.length > 0 && S.zones.every((z) => pos(z.A) && pos(z.B) && pos(z.C));

/* ================= profile options ================= */
function optButtons(el, list, getOn, onPick) {
  el.innerHTML = '';
  list.forEach(([id, name, hint]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.innerHTML = '<b></b><span></span>';
    b.querySelector('b').textContent = name; b.querySelector('span').textContent = hint; b.setAttribute('aria-pressed', String(getOn(id)));
    b.onclick = () => { onPick(id); optButtons(el, list, getOn, onPick); }; el.appendChild(b);
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
  optButtons($('#projects'), PROJECTS, (id) => S.project === id, (id) => { S.project = id; });
  optButtons($('#fabs'), FABS, (id) => S.fab === id, (id) => { S.fab = id; });
  optButtons($('#levels'), LEVELS, (id) => S.level === id, (id) => { S.level = id; });
  chipButtons($('#tools'), TOOLS, S.tools);
  chipButtons($('#shops'), SHOPS, S.shops);
}

/* ================= photo ================= */
function photoDataOf(img) {
  try { const W = Math.min(900, img.naturalWidth), H = Math.round(W * img.naturalHeight / img.naturalWidth); const c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').drawImage(img, 0, 0, W, H); return c.toDataURL('image/jpeg', .72); } catch { return null; }
}
function setPhoto(img, example, after) {
  S.photo = img; S.example = example; S.photoData = null;
  const go = () => { if (!example) S.photoData = photoDataOf(img); drawPhoto($('#cv0')); if (S.step === 1) drawCotes(); if (after) after(); };
  if (img.complete && img.naturalWidth) go(); else img.onload = go;
  $('#photoBadge').textContent = example ? "Photo d'exemple" : 'Votre photo';
}
$('#photoIn').addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const img = new Image(); img.src = URL.createObjectURL(f);
  S.zones = []; S.sel = 0; S.redraw = null; setPhoto(img, false); renderZones();
  $('#needs').value = ''; $('#obst').value = '';
});

/* ================= navigation ================= */
function show(step) {
  S.step = step;
  document.querySelectorAll('[data-step]').forEach((s) => { s.hidden = +s.dataset.step !== step; });
  document.querySelectorAll('.steps button').forEach((b) => { const n = +b.dataset.go; b.className = n === step ? 'on' : (n < step ? 'done' : ''); });
  $('#backBtn').hidden = step === 0;
  $('#nextBtn').textContent = step === 2 ? 'Voir mes 3 propositions' : (step === 3 ? 'Nouveau projet' : 'Continuer');
  $('#backBtn').textContent = 'Retour';
  if (step === 0) drawPhoto($('#cv0'));
  if (step === 1) { renderZones(); drawCotes(); }
  if (step === 3 && currentProp()) renderResult(); else stopLoop();
  updateBar();
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('.steps button').forEach((b) => b.addEventListener('click', () => { const n = +b.dataset.go; if (n < 3 || S.result.some(Boolean)) show(n); }));
$('#backBtn').onclick = () => { if (S.step === 3 && currentProp()) { const i = PANES.findIndex((x) => x[0] === S.pane); if (i > 0) return goPane(PANES[i - 1][0], -1); } show(Math.max(0, S.step - 1)); };
$('#nextBtn').onclick = () => {
  if (S.step === 1 && !zonesOk()) {
    $('#zoneErr').textContent = S.zones.length ? 'Renseignez la largeur, la hauteur et la profondeur de chaque zone.' : 'Dessinez au moins une zone sur la photo.';
    $('#zoneErr').hidden = false; return;
  }
  $('#zoneErr').hidden = true;
  if (S.step < 2) return show(S.step + 1);
  if (S.step === 2) { show(3); generate(); return; }
  if (S.step === 3 && currentProp()) { const i = PANES.findIndex((x) => x[0] === S.pane); if (i < PANES.length - 1) return goPane(PANES[i + 1][0], 1); $('#saveBtn').click(); window.scrollTo({ top: 0 }); return; }
  newProject();
};
function newProject() {
  abortAll(); S.result = [null, null, null]; S.projId = null; S.projName = ''; $('#result').hidden = true; $('#progBox').hidden = true; $('#errBox').hidden = true; S.pane = 'modele'; show(0);
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
    boxes.push({ x0: x - t, x1: x + cw + t, ref: (c && c.ref) || '' });
    const cases = c && Array.isArray(c.cases) && c.cases.length ? c.cases : [{ hauteur_mm: 1, type: 'ouvert' }];
    const innerH = (y1 - y0) - (cases.length - 1) * t;
    const sumH = cases.reduce((s, k) => s + pos(k && k.hauteur_mm, 1), 0);
    let y = y0;
    cases.forEach((k, ri) => {
      const ch = innerH * pos(k && k.hauteur_mm, 1) / sumH;
      const type = TYPES.includes(k && k.type) ? k.type : 'ouvert';
      cells.push({ x, y, w: cw, h: ch, type, contenu: (k && k.contenu) || '', key: `${ci}-${ri}`, col: ci, ncols: cols.length });
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

/* ================= generation ================= */
function projectName() { return (PROJECTS.find((p) => p[0] === S.project) || [, 'Meuble'])[1]; }
function zonesText() {
  return S.genZones.map((z, i) => `- Zone ${i + 1} : largeur ${pos(z.A)} mm, hauteur ${pos(z.B)} mm, profondeur max ${pos(z.C)} mm, ${num(z.D) > 0 ? `fixée au mur, dessous à ${num(z.D)} mm du sol` : 'posée au sol'}.`).join('\n');
}
function fabRule() {
  if (S.fab === 'standard') return "Fabrication : un maximum de meubles et caissons VENDUS TOUT FAITS par ces enseignes (exemples : IKEA BESTÅ, KALLAX, EKET, METOD, PLATSA ; Leroy Merlin, Castorama, But : caissons bas, meubles bas, étagères cubes). Chaque colonne est un caisson du commerce : donne son nom exact dans \"ref\" et mets \"fabrication\":\"caissons\". Aucune découpe, ou seulement le plateau.";
  if (S.fab === 'mixte') return "Fabrication : caissons du commerce pour la structure (nom exact dans \"ref\" pour chaque colonne, \"fabrication\":\"caissons\"), plateau et finitions sur mesure si utile.";
  return "Fabrication : panneaux découpés aux cotes exactes (\"fabrication\":\"panneaux\"), sans caissons du commerce.";
}
function buildPrompt(i, withImage) {
  const v = VARIANTS[i]; const lvl = (LEVELS.find((l) => l[0] === S.level) || [, 'Bricoleur'])[1];
  return `Tu es concepteur de meubles sur mesure pour particuliers, en France. Conçois UNE proposition de "${projectName()}" : la version "${v.nom}", c'est-à-dire ${v.desc}.
${withImage ? "La photo jointe montre l'espace ; les zones numérotées sont celles que l'utilisateur a dessinées." : ''}
Zones mesurées (chaque zone = un module ; ensemble, elles forment un seul agencement) :
${zonesText()}
À loger : ${$('#needs').value || 'non précisé'}.
Contraintes : ${$('#obst').value || 'aucune'}.
Niveau : ${lvl}. Outils : ${[...S.tools].join(', ') || 'aucun'}. Enseignes acceptées : ${[...S.shops].join(', ') || 'toutes'}. Style souhaité : ${$('#style').value || 'libre'}.
${fabRule()}

Règles :
- Un module par zone, avec "zone" = son numéro. Chaque module laisse 10 à 20 mm de jeu en largeur et ne dépasse jamais les cotes de sa zone. Un module posé au sol a des pieds de 80 à 150 mm.
- Façade vue de face : "colonnes" de gauche à droite (somme des largeurs = largeur du module) ; dans chaque colonne, "cases" de bas en haut (somme des hauteurs + pieds + épaisseur du plateau = hauteur du module). Type de case : "ouvert", "porte", "tiroir", "caisse" (bac ou caisse posée qui se tire) ou "abattant". "contenu" en 1 à 3 mots.
- Chaque proposition a au moins 2 façades (portes, tiroirs, caisses ou abattants).
- "details" : passe-câbles là où passent des câbles (TV, box, prises), aérations derrière les appareils qui chauffent, et "fixation_murale" pour éviter le basculement. x_mm depuis le bord gauche du module ; y_mm depuis le bas du module (face "arriere") ou depuis le bord arrière (face "plateau").
- La liste ne contient que les panneaux, plans de travail, caissons et façades du commerce : l'application ajoute elle-même la quincaillerie (vis, charnières, coulisses, équerres, pieds, poignées, passe-câbles, fixations) et les finitions.
- "recherche" : 3 à 8 mots à taper dans le moteur de recherche du site de l'enseigne pour trouver ce produit précis.
- Prix réalistes en euros TTC ; "prix" = prix total de la ligne.
- "finitions" : choisis parmi ces identifiants. Bois et couleurs : ${FIN.map((f) => f.id).join(', ')}. Poignées : ${HANDLES.map((h) => h.id).join(', ')}. Finition des poignées : ${HFIN.map((f) => f.id).join(', ')}. Pieds : ${FEET.map((f) => f.id).join(', ')}.

Réponds UNIQUEMENT avec ce JSON :
{"nom":"${v.nom}","resume":"1 phrase","duree":"une journée","difficulte":2,"enseignes":["IKEA"],
"finitions":{"structure":"blanc","facades":"chene","plateau":"chene","poignee":"barre_fine","finition_poignee":"noir","pieds":"carre_bois"},
"modules":[{"zone":1,"fabrication":"caissons","largeur_mm":2420,"hauteur_mm":620,"profondeur_mm":440,"pieds_mm":110,"epaisseur_plateau_mm":26,
"colonnes":[{"largeur_mm":600,"ref":"IKEA BESTÅ caisson 60 x 40 x 38 cm","cases":[{"hauteur_mm":280,"type":"porte","contenu":"ampli"},{"hauteur_mm":180,"type":"tiroir","contenu":"câbles"}]}],
"details":[{"type":"passe_cable","face":"arriere","x_mm":1210,"y_mm":300,"diametre_mm":60},{"type":"aeration","face":"arriere","x_mm":300,"y_mm":300,"largeur_mm":200,"hauteur_mm":60},{"type":"fixation_murale"}]}],
"liste":[{"qte":4,"article":"IKEA BESTÅ caisson blanc 60 x 40 x 38 cm","enseigne":"IKEA","recherche":"BESTÅ caisson 60x40x38","detail":"","prix":140}],
"attention":""}
difficulte : 1 facile, 2 moyen, 3 avancé.`;
}
function normalizeProp(d, i) {
  let p = d && Array.isArray(d.propositions) ? d.propositions[0] : d;
  if (!p || typeof p !== 'object') return null;
  if (!Array.isArray(p.modules)) p.modules = p.plan ? [p.plan] : [];
  if (!p.modules.length) return null;
  p.nom = VARIANTS[i].nom; p.liste = Array.isArray(p.liste) ? p.liste : [];
  return p;
}
function initCustom(i) {
  const f = (S.result[i] && S.result[i].finitions) || {}; const ok = (list, id, d) => list.some((x) => x.id === id) ? id : d;
  S.custom[i] = { structure: ok(FIN, f.structure, 'pin'), facades: ok(FIN, f.facades, 'chene'), plateau: ok(FIN, f.plateau, 'chene'),
    poignee: ok(HANDLES, f.poignee, 'barre_fine'), hfin: ok(HFIN, f.finition_poignee, 'noir'), pieds: ok(FEET, f.pieds, 'carre_bois') };
}
function codeCopy(code) {
  if (code === 'not_configured') return "Le serveur n'est pas encore relié à Claude (clé API manquante). Voici un exemple de résultat pour tester le parcours.";
  if (code === 'bad_code') return "Code d'accès manquant ou incorrect. Saisissez le code de test que l'on vous a donné.";
  if (DENIED.includes(code)) return "La conception par Claude n'est pas autorisée sur cette page. Voici un exemple de résultat pour tester le parcours.";
  if (code === 'rate_limited') return 'Trop de demandes pour le moment. Réessayez dans quelques minutes.';
  if (code === 'invalid_json' || code === 'empty_completion') return "Une réponse n'a pas pu être lue. Relancez ce meuble.";
  if (code === 'refused') return 'Cette demande a été refusée. Modifiez la description puis relancez.';
  if (code === 'session_expired') return 'Reconnectez-vous à Claude, puis relancez.';
  if (code === 'images_unavailable' || code === 'image_rejected') return "La photo n'a pas pu être envoyée. Relancez ce meuble.";
  return 'Un meuble a été interrompu. Relancez-le.';
}
/* Calls Claude through the app's own server (api/generate). Same shape as the prototype's sampler:
   json(prompt, {signal, images, onText}) streams the answer and resolves with the parsed JSON. */
const ACCESS_KEY = 'snug.code';
function readCode() { try { return localStorage.getItem(ACCESS_KEY) || ''; } catch { return ''; } }
function blobToBase64(b) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = rej; r.readAsDataURL(b); }); }
function parseLoose(text) {
  try { return JSON.parse(text); } catch {}
  const fence = /```(?:json)?\s*([\s\S]*?)```/.exec(text); if (fence) { try { return JSON.parse(fence[1]); } catch {} }
  const a = text.indexOf('{'), b = text.lastIndexOf('}'); if (a >= 0 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch {} }
  return undefined;
}
const API = {
  async limits() { return { images: { maxCount: 1 } }; },
  async json(prompt, opts = {}) {
    let image;
    if (opts.images) { try { image = await blobToBase64(opts.images); } catch { image = undefined; } }
    let res;
    try {
      res = await fetch('api/generate', { method: 'POST', signal: opts.signal, headers: { 'content-type': 'application/json', 'x-snug-code': readCode() }, body: JSON.stringify({ prompt, image }) });
    } catch (e) { throw { code: e && e.name === 'AbortError' ? 'cancelled' : 'upstream_error' }; }
    if (!res.ok) { let code = 'upstream_error'; try { code = (await res.json()).code || code; } catch {} if (res.status === 429) code = 'rate_limited'; throw { code }; }
    const reader = res.body.getReader(), dec = new TextDecoder(); let text = '';
    try {
      for (;;) { const { done, value } = await reader.read(); if (done) break; text += dec.decode(value, { stream: true }); if (opts.onText && text.trim()) opts.onText({ text }); }
    } catch (e) { throw { code: e && e.name === 'AbortError' ? 'cancelled' : 'upstream_error', text }; }
    const data = parseLoose(text); if (data === undefined) throw { code: 'invalid_json', text }; return data;
  }
};
async function getSample() { return API; }
function exportBlob() {
  const img = S.photo; const c = document.createElement('canvas'); const W = 1000, H = Math.round(1000 * img.naturalHeight / img.naturalWidth);
  c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(img, 0, 0, W, H); drawZonesOn(g, W, H, S.genZones, -1, true);
  return new Promise((r) => c.toBlob((b) => r(b), 'image/jpeg', .85));
}
const expectedChars = () => 1700 + 800 * Math.max(1, (S.genZones || []).length);
function pctOf(g) {
  if (!g) return 0; if (g.status === 'done') return 100; if (!g.start || g.status === 'wait') return 0;
  const think = 18 * (1 - Math.exp(-((Date.now() - g.start) / 1000) / 18));
  if (g.status === 'write') return Math.min(97, Math.max(think, 18) + 79 * Math.min(1, g.chars / expectedChars()));
  if (g.status === 'think') return Math.max(2, think);
  return g.pctMax || 0;
}
const anyRunning = () => S.gen.some((g) => g.status === 'think' || g.status === 'write' || g.status === 'wait');
function abortAll() { (S.gen || []).forEach((g) => g.ctl && g.ctl.abort()); }
function buildProgRows() {
  const box = $('#progRows'); box.innerHTML = '';
  S.rows = VARIANTS.map((v, i) => {
    const el = document.createElement('div'); el.className = 'prow';
    el.innerHTML = '<div class="ptop"><b></b><span class="pst"></span><span class="ppct"></span><button type="button" class="link" hidden>Relancer</button></div><div class="track"><i></i></div>';
    el.querySelector('b').textContent = v.nom;
    const row = { el, st: el.querySelector('.pst'), pct: el.querySelector('.ppct'), bar: el.querySelector('.track i'), retry: el.querySelector('.link') };
    row.retry.onclick = async () => { const sm = await getSample(); if (sm && !S.demo) runOne(sm, i, S.images); };
    box.appendChild(el); return row;
  });
}
function tick() {
  S.gen.forEach((g, i) => {
    g.pctMax = Math.max(g.pctMax || 0, pctOf(g)); const row = S.rows[i]; if (!row) return;
    const off = g.status === 'error' || g.status === 'stopped';
    row.pct.textContent = g.status === 'done' ? '100 %' : off ? '' : `≈ ${Math.round(g.pctMax)} %`;
    row.bar.style.width = (g.status === 'done' ? 100 : g.pctMax) + '%';
    row.st.textContent = { wait: 'En attente', think: 'Réflexion…', write: 'Dessin du plan…', done: 'Terminé ✓', error: 'Interrompu', stopped: 'Arrêté' }[g.status] || '';
    row.retry.hidden = !off || S.demo; row.el.dataset.state = g.status;
  });
  renderTabs();
  const running = anyRunning(); const done = S.gen.filter((g) => g.status === 'done').length;
  $('#stopBtn').hidden = !running;
  $('#progTitle').textContent = running ? `Conception · ${done}/3 meuble${done > 1 ? 's' : ''} terminé${done > 1 ? 's' : ''}` : (done === 3 ? 'Vos 3 meubles sont prêts' : `${done} meuble${done > 1 ? 's' : ''} sur 3 prêt${done > 1 ? 's' : ''}`);
  if (!running) { clearInterval(S.ticker); S.ticker = null; if (done === 3) setTimeout(() => { if (!anyRunning()) $('#progBox').hidden = true; }, 1400); }
}
function startTicker() { if (!S.ticker) S.ticker = setInterval(tick, 250); tick(); }
async function generate() {
  abortAll(); S.demo = false; S.result = [null, null, null]; S.custom = [null, null, null]; S.active = -1; E.framed = false; E.state = {}; S.nstep = 0;
  S.genZones = S.zones.map((z) => ({ ...z }));
  S.gen = VARIANTS.map(() => ({ status: 'wait', chars: 0, pctMax: 0 }));
  $('#propTabs').innerHTML = ''; $('#result').hidden = true; $('#errBox').hidden = true; $('#progBox').hidden = false;
  buildProgRows(); startTicker();
  const sample = await getSample();
  if (!sample) { runDemo("La conception par Claude n'est disponible qu'en ouvrant cette page dans Claude. Voici un exemple de résultat pour tester le parcours."); return; }
  let images; try { const lim = await sample.limits(); if (lim && lim.images) images = await exportBlob(); } catch { images = undefined; }
  S.images = images;
  VARIANTS.forEach((v, i) => runOne(sample, i, images));
}
async function runOne(sample, i, images) {
  const g = { status: 'think', start: Date.now(), chars: 0, pctMax: 0, ctl: new AbortController() }; S.gen[i] = g; startTicker();
  try {
    const data = await sample.json(buildPrompt(i, !!images), { signal: g.ctl.signal, images, cache: false, onText: ({ text }) => { g.status = 'write'; g.chars = text.length; } });
    if (S.gen[i] !== g) return;
    const p = normalizeProp(data, i); if (!p) throw { code: 'invalid_json' };
    S.result[i] = p; initCustom(i); g.status = 'done';
    if (S.active < 0) { S.active = i; E.framed = false; renderResult(); }
  } catch (e) {
    if (S.gen[i] !== g) return;
    const code = e && e.code; g.status = code === 'cancelled' ? 'stopped' : 'error';
    if (DENIED.includes(code) && !S.demo && !S.result.some(Boolean)) { abortAll(); runDemo(codeCopy(code)); return; }
    if (code === 'bad_code') { askCode(); return; }
    if (code && code !== 'cancelled') { $('#errBox').textContent = codeCopy(code); $('#errBox').hidden = false; }
  } finally { if (S.gen[i] === g) tick(); }
}
$('#stopBtn').onclick = abortAll;
function askCode() {
  if ($('#codeBox')) return; abortAll();
  const box = document.createElement('div'); box.className = 'card'; box.id = 'codeBox';
  box.innerHTML = '<label class="lbl" for="codeIn">Code d’accès de test</label><p class="muted small">SNUG est en test privé. Saisissez le code qu’on vous a transmis.</p><div class="rowb"><input id="codeIn" type="text" autocomplete="off"><button class="btn primary sm" id="codeOk">Valider</button></div>';
  $('#progBox').after(box);
  $('#codeIn').value = readCode();
  $('#codeOk').onclick = () => { try { localStorage.setItem(ACCESS_KEY, $('#codeIn').value.trim()); } catch {} box.remove(); generate(); };
}
function runDemo(msg) {
  S.demo = true; $('#errBox').textContent = msg; $('#errBox').hidden = false;
  S.gen = VARIANTS.map(() => ({ status: 'think', start: Date.now() - 30000, chars: 0, pctMax: 0 }));
  buildProgRows(); startTicker();
  const gens = S.gen;
  gens.forEach((g, i) => setTimeout(() => {
    if (S.gen !== gens) return; g.status = 'write';
    const iv = setInterval(() => {
      if (S.gen !== gens) { clearInterval(iv); return; }
      g.chars += expectedChars() / 10;
      if (g.chars >= expectedChars()) { clearInterval(iv); S.result[i] = JSON.parse(JSON.stringify(DEMO[i])); initCustom(i); g.status = 'done'; if (S.active < 0) { S.active = i; E.framed = false; renderResult(); } tick(); }
    }, 110);
  }, 300 + i * 500));
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
      const sideMk = [t / 2, W - t / 2].flatMap((x) => [50, D / 2, D - 56].map((zz) => ({ p: [x, L.legs, zz], c: 'A' })));
      H('A', 6);
      st({ title: 'Fixer les côtés sur le fond', add: [cg, cd], explode: [0, 220, 0], markers: sideMk, hw: [['A', 6]], tools: ['Foret bois 3 mm', 'Serre-joints'], extra: legExtra(false),
        text: [`Remettez le fond ${fond.code} à l’endroit.`, `Pré-percez le fond à 3 mm, à 9 mm du bord gauche et du bord droit : 3 trous de chaque côté, à 50 mm de l’avant, au milieu et à 50 mm de l’arrière.`,
          `Posez le côté gauche ${cg.code} et le côté droit ${cd.code} sur le fond, chants arrière alignés. Maintenez-les avec un serre-joint.`, 'Vissez par-dessous avec 3 vis A par côté, puis contrôlez l’équerre.'] });
      if (divs.length) {
        H('A', divs.length * 3);
        st({ title: 'Fixer les séparations', add: divs, explode: [0, 220, 0], hw: [['A', divs.length * 3]], tools: ['Foret bois 3 mm'], extra: legExtra(false),
          markers: divs.flatMap((d) => [50, D / 2, D - 56].map((zz) => ({ p: [d.xpos + L.divT / 2, L.legs, zz], c: 'A' }))),
          text: [`Tracez l’axe de chaque séparation sur le fond : ${divs.map((d) => `${d.code} à ${R0(d.xpos + L.divT / 2)} mm du bord gauche`).join(', ')}.`, 'Pré-percez 3 trous par séparation sur l’axe, à 50 mm de l’avant, au milieu et à 50 mm de l’arrière.', 'Posez chaque séparation et vissez par-dessous avec 3 vis A.'] });
      }
      if (shel.length) {
        H('A', shel.length * 4);
        st({ title: 'Poser les étagères', add: shel, explode: [0, 0, 260], hw: [['A', shel.length * 4]], tools: ['Foret bois 3 mm', 'Niveau à bulle'], extra: legExtra(false),
          markers: shel.flatMap((o) => [o.s.x - t / 2, o.s.x + o.s.w + t / 2].flatMap((x) => [50, D - 76].map((zz) => ({ p: [x, o.s.y + t / 2, zz], c: 'A' })))),
          text: [`Tracez la hauteur de chaque étagère sur les montants : ${shel.map((o) => `${o.code} à ${R0(o.s.y - L.y0)} mm au-dessus du fond`).join(', ')}.`, 'Pré-percez 2 trous de chaque côté, à 50 mm de l’avant et de l’arrière, au milieu de l’épaisseur de l’étagère.', 'Glissez chaque étagère et vissez avec 2 vis A de chaque côté.'] });
      }
      const nC = Math.ceil(2 * (W + L.y1 - L.legs) / 150) + divs.length * 4; H('C', nC);
      st({ title: 'Poser le dos', add: [dos], explode: [0, 0, -240], view: 'back', hw: [['C', nC]], tools: ['Marteau'], extra: legExtra(false),
        markers: [[30, L.legs + 30], [W / 2, L.legs + 30], [W - 30, L.legs + 30], [30, L.y1 - 30], [W / 2, L.y1 - 30], [W - 30, L.y1 - 30]].map(([x, y]) => ({ p: [x, y, 0], c: 'C' })),
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
        markers: [[feet.inset + 60, L.legs / 2], [W - feet.inset - 60, L.legs / 2]].map(([x, y]) => ({ p: [x, y, D - feet.inset], c: 'B' })),
        text: ['Réglez les vérins pour que le meuble soit de niveau.', `Fixez ${plinth.nom.toLowerCase()} ${plinth.code} ${feet.inset ? `à ${feet.inset} mm en retrait de l’avant` : 'au ras de l’avant'} avec des petites équerres et des vis B.`] });
    }
    const doors = fronts.filter((x) => x.f && x.f.kind === 'porte');
    if (doors.length) {
      const nD = doors.reduce((s, d) => s + (d.f.h > 900 ? 3 : 2), 0); H('D', nD);
      st({ title: 'Poser les portes', add: doors, explode: [0, 0, 240], hw: [['D', nD]], tools: ['Perceuse', 'Mèche Forstner 35 mm', 'Tournevis cruciforme'], extra: legExtra(false),
        markers: doors.flatMap((d) => { const f = d.f, x = f.side === 'L' ? f.x + 22 : f.x + f.w - 22; const ys = f.h > 900 ? [f.y + 100, f.y + f.h / 2, f.y + f.h - 100] : [f.y + 100, f.y + f.h - 100]; return ys.map((y) => ({ p: [x, y, D + 18], c: 'D' })); }),
        text: [`Sur chaque porte (${doors.map((d) => d.code).join(', ')}), percez ${doors[0].f.h > 900 ? '3' : '2'} logements Ø 35 mm à la mèche Forstner, profondeur 12 mm, centre à 22 mm du bord côté charnière, à 100 mm du haut et du bas.`,
          'Vissez les charnières D dans les logements, puis les embases sur le montant, alignées sur les charnières.', 'Clipsez les portes et réglez les vis des charnières pour un jeu régulier de 3 mm.'] });
    }
    const flaps = fronts.filter((x) => x.f && x.f.kind === 'abattant');
    if (flaps.length) {
      H('D', flaps.length * 2); H('F', flaps.length);
      st({ title: 'Poser les abattants', add: flaps, explode: [0, 0, 240], hw: [['D', flaps.length * 2], ['F', flaps.length]], tools: ['Perceuse', 'Mèche Forstner 35 mm'],
        markers: flaps.flatMap((d) => [[d.f.x + 100, d.f.y + 22], [d.f.x + d.f.w - 100, d.f.y + 22]].map(([x, y]) => ({ p: [x, y, D + 18], c: 'D' }))),
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
      text: ['Poncez toutes les faces visibles au grain 180 dans le sens du fil, puis dépoussiérez.'].concat([...fins].map(([id, labs]) => { const f = finById(id); return f.wood ? `${labs.join(', ')} : appliquez l’huile ${f.id === 'pin' || f.id === 'bouleau' ? 'incolore' : 'teintée ' + f.nom.toLowerCase()} en 2 couches, 6 h de séchage entre les deux.` : `${labs.join(', ')} : sous-couche, puis 2 couches de peinture ${f.nom.toLowerCase()}, 4 h de séchage entre les deux.`; })) });
    H('K', 2);
    st({ title: 'Mettre en place et fixer au mur', view: 'back', hw: [['K', 2]], tools: ['Niveau à bulle', 'Perceuse', 'Foret adapté au mur 6 mm', 'Chevilles adaptées au mur'], extra: legExtra(false),
      markers: [[W * .2, L.y1 - 30, 0], [W * .8, L.y1 - 30, 0]].map((p_) => ({ p: p_, c: 'K' })),
      text: [L.raised ? `Tracez au mur la ligne du dessous du meuble à ${R0(num(z.D))} mm du sol, au niveau.` : `Placez le meuble et vérifiez le niveau${hidden ? ' : réglez les vérins' : ''}.`, 'Vissez 2 fixations anti-basculement K en haut du dos, à 20 % et 80 % de la largeur, puis fixez-les au mur avec des chevilles adaptées (placo, brique ou béton).',
        feet.hidden && /robot|aspirateur/i.test($('#needs').value) ? 'Attention : avec des pieds cachés, le robot aspirateur ne passera plus sous le meuble.' : ''].filter(Boolean) });
  });
  if (multi) steps.push({ mod: null, title: 'Assembler les modules', show: [], news: [], markers: [], hw: [], tools: [], extra: [], text: ['Placez les modules à leur emplacement, dans l’ordre des zones dessinées sur la photo.', 'Contrôlez l’alignement des façades et des plateaux, puis serrez les fixations murales.'] });
  return { steps, parts: partsAll, mods, hw: hwTot, tools: [...tools] };
}

/* ================= results: list, tabs, customisation ================= */
function currentProp() { return S.active >= 0 ? S.result[S.active] : null; }
const eur = (n) => (Math.round((+n || 0) * 100) / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: (+n % 1) ? 2 : 0 });
function shopUrl(enseigne, q) {
  const e = (enseigne || '').toLowerCase(), qq = encodeURIComponent(q || '');
  if (e.includes('ikea')) return 'https://www.ikea.com/fr/fr/search/?q=' + qq;
  if (e.includes('leroy')) return 'https://www.leroymerlin.fr/resultats/?q=' + qq;
  if (e.includes('casto')) return 'https://www.castorama.fr/search?term=' + qq;
  return 'https://www.google.com/search?q=' + encodeURIComponent(`${enseigne || ''} ${q || ''}`.trim());
}
function hwName(c, cu) { if (c === 'H') { const h = handleById(cu.poignee); return `Poignée ${h.nom}, ${hfinById(cu.hfin).nom.toLowerCase()}`; } if (c === 'I') return `Pied ${feetById(cu.pieds).nom.toLowerCase()}`; return (HW[c] || {}).nom || c; }
function linesFor(i) {
  const p = S.result[i], cu = S.custom[i]; if (!p || !cu) return [];
  const out = p.liste.map((it) => ({ qte: it.qte, article: it.article || '', enseigne: it.enseigne || '', recherche: it.recherche || it.article || '', detail: it.detail || '', prix: num(it.prix) }));
  const N = noticeFor(p, cu), h = handleById(cu.poignee), feet = feetById(cu.pieds);
  if (N.hw.H && h.prix > 0) out.push({ qte: N.hw.H, article: hwName('H', cu), enseigne: 'Leroy Merlin', recherche: `poignée meuble ${h.nom} ${hfinById(cu.hfin).nom}`, detail: 'votre choix, repère H', prix: N.hw.H * h.prix });
  if (N.hw.I) out.push({ qte: N.hw.I, article: hwName('I', cu), enseigne: 'Leroy Merlin', recherche: `pied meuble ${feet.nom}`, detail: 'votre choix, repère I', prix: N.hw.I * feet.prix });
  if (feet.hidden && N.parts.some((x) => x.role === 'plinthe')) out.push({ qte: 1, article: 'Tablette bois 18 mm pour la plinthe', enseigne: 'Leroy Merlin', recherche: 'tablette bois 18 mm 250 x 20', detail: 'découpe en magasin', prix: 15 });
  Object.keys(HW).forEach((c) => { const q = N.hw[c]; if (!q) return; const it = HW[c]; const packs = Math.ceil(q / it.pack);
    out.push({ qte: packs, article: `${it.nom}, ${it.unit}`, enseigne: 'Leroy Merlin', recherche: it.rech, detail: `repère ${c} · ${q} nécessaire${q > 1 ? 's' : ''}`, prix: packs * it.pp }); });
  const used = new Map(); [['structure', 'structure'], ['plateau', 'plateau'], ['facades', 'façades']].forEach(([k, lab]) => { const id = cu[k]; if (!used.has(id)) used.set(id, []); used.get(id).push(lab); });
  used.forEach((labs, id) => {
    const f = finById(id), clear = f.id === 'pin' || f.id === 'bouleau';
    out.push(f.wood
      ? { qte: 1, article: `Huile ${clear ? 'incolore' : 'teintée ' + f.nom.toLowerCase()} pour bois, 0,5 L`, enseigne: 'Leroy Merlin', recherche: `huile bois ${clear ? 'incolore' : 'teintée ' + f.nom}`, detail: labs.join(', '), prix: 22 }
      : { qte: 1, article: `Peinture spéciale meuble ${f.nom.toLowerCase()}, 0,5 L`, enseigne: 'Leroy Merlin', recherche: `peinture meuble ${f.nom}`, detail: labs.join(', '), prix: 25 });
  });
  return out;
}
function renderTabs() {
  const tabs = $('#propTabs');
  if (!tabs.children.length) VARIANTS.forEach((v, i) => { const b = document.createElement('button'); b.type = 'button'; b.onclick = () => { if (S.result[i] && S.active !== i) { S.active = i; E.framed = false; S.nstep = 0; renderResult(); } }; tabs.appendChild(b); });
  [...tabs.children].forEach((b, i) => {
    const g = S.gen[i], ready = !!S.result[i]; b.disabled = !ready; b.setAttribute('aria-pressed', String(i === S.active));
    b.textContent = ready ? VARIANTS[i].nom : `${VARIANTS[i].nom} · ${g && (g.status === 'error' || g.status === 'stopped') ? '—' : Math.round((g && g.pctMax) || 0) + ' %'}`;
  });
}
function renderResult() {
  const p = currentProp(); renderTabs(); if (!p) return;
  $('#result').hidden = false; $('#resTitle').textContent = `Vos propositions · ${projectName()}`;
  const d = clamp(Math.round(+p.difficulte || 2), 1, 3); $('#pDiff').textContent = ['Facile', 'Moyen', 'Avancé'][d - 1]; $('#pDiff').className = 'pill d' + d;
  $('#pTime').textContent = p.duree || ''; $('#pResume').textContent = p.resume || '';
  const Ls = p.modules.map((m, mi) => layoutModule(m, zoneFor(m, mi)));
  $('#pShops').textContent = `${(p.enseignes || []).join(' + ')} · ${Ls.some((L) => L.caissons) ? 'caissons du commerce' : 'panneaux sur mesure'} · ${Ls.map((L) => `${R0(L.W)} × ${R0(L.H)} × ${R0(L.D)} mm`).join(', ')}`;
  const det = Ls.flatMap((L) => L.details).map((x) => x.type === 'passe_cable' ? `passe-câble Ø ${x.dia} mm (${x.face === 'plateau' ? 'plateau' : 'dos'})` : x.type === 'aeration' ? 'aération à l’arrière' : 'fixation anti-basculement');
  $('#pDetails').hidden = !det.length; $('#pDetails').textContent = det.length ? 'Prévu sur le meuble : ' + [...new Set(det)].join(', ') + '.' : '';
  $('#pWarn').hidden = !p.attention; $('#pWarn').textContent = p.attention ? 'Attention : ' + p.attention : '';
  refreshAll();
  document.querySelectorAll('#panes .pane').forEach((x) => { x.hidden = x.dataset.pane !== S.pane; });
  renderCfgNav();
  renderView();
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
  if (S.step !== 3 || !currentProp()) return;
  const i = PANES.findIndex((x) => x[0] === S.pane);
  $('#backBtn').hidden = false; $('#backBtn').textContent = i > 0 ? '← ' + PANES[i - 1][1] : 'Retour';
  $('#nextBtn').textContent = i < PANES.length - 1 ? PANES[i + 1][1] + ' →' : 'Enregistrer le projet';
}
function goPane(id, dir) {
  S.pane = id;
  document.querySelectorAll('#panes .pane').forEach((p) => { const on = p.dataset.pane === id; p.hidden = !on; if (on) { p.classList.toggle('back', dir < 0); p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; } });
  renderCfgNav();
  if (id === 'notice') renderNotice();
  const top = $('#panes').getBoundingClientRect().top + window.scrollY - $('#cfgTop').offsetHeight - 8;
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
    const l = document.createElement('a'); l.href = shopUrl(it.enseigne, it.recherche); l.target = '_blank'; l.rel = 'noopener'; l.textContent = `Ouvrir chez ${it.enseigne || 'le vendeur'} ↗`; b.appendChild(l);
    const c = document.createElement('td'); c.className = 'n'; c.textContent = eur(it.prix);
    tr.append(a, b, c); tb.appendChild(tr);
  });
  $('#pTotal').textContent = eur(tot); $('#pPrice').textContent = '≈ ' + eur(tot); $('#pPrice2').textContent = '≈ ' + eur(tot);
}
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
  const robot = /robot|aspirateur/i.test($('#needs').value);
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
    const left = zr.x + (zr.w - L.W * sx) / 2, bottom = zr.y + zr.h;
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
      if (c.type !== 'ouvert' || !c.contenu) return; const [x, y, w, hh] = R(c.x, c.y, c.w, c.h);
      if (w > 50 && hh > 18) { g.fillStyle = 'rgba(255,255,255,.85)'; g.font = `600 ${clamp(hh / 5, 11, 16)}px "Plus Jakarta Sans", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(c.contenu).slice(0, Math.floor(w / 8)), x + w / 2, y + hh / 2); }
    });
    frontsOf(L, mi).forEach((f) => {
      const st = getSt(f.key), t = st.t; keys.push(f.key);
      const [x, y, w, hh] = R(f.x, f.y, f.w, f.h);
      if (t > .02 && f.c.contenu && f.kind !== 'caisse') { g.fillStyle = 'rgba(255,255,255,.8)'; g.font = `600 ${clamp(hh / 6, 10, 14)}px "Plus Jakarta Sans", system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(f.c.contenu).slice(0, Math.floor(w / 8)), x + w / 2, y + hh / 2); }
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
  else { const f = finById(id); m = f.wood ? new THREE.MeshStandardMaterial({ map: woodTex(f.id), roughness: .56, envMapIntensity: .45 }) : new THREE.MeshStandardMaterial({ color: lin(f.c), roughness: .62, envMapIntensity: .7, map: woodTex(f.id) }); if (!f.wood) m.color = new THREE.Color(0xffffff); }
  return (E.mats[id] = m);
}
const TILE = 520;
function uvBox(geo, w, h, d, seed) {
  const uv = geo.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]], ox = (seed * .37) % 1, oy = (seed * .61) % 1;
  for (let f = 0; f < 6; f++) { const [U, V] = dims[f], rot = V > U * 1.15; for (let k = 0; k < 4; k++) { const i = f * 4 + k, u = uv.getX(i), v = uv.getY(i); if (rot) uv.setXY(i, v * V / TILE + ox, u * U / TILE + oy); else uv.setXY(i, u * U / TILE + ox, v * V / TILE + oy); } }
  uv.needsUpdate = true;
}
function bx(w, h, d, m, x, y, z, parent) {
  const geo = new THREE.BoxGeometry(Math.max(w, 1), Math.max(h, 1), Math.max(d, 1)); uvBox(geo, Math.max(w, 1), Math.max(h, 1), Math.max(d, 1), Math.abs(x * 13 + y * 7 + z * 3) % 97 / 97);
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
    E.r.toneMapping = THREE.ACESFilmicToneMapping; E.r.toneMappingExposure = .92; E.r.physicallyCorrectLights = false;
    E.scene = new THREE.Scene(); E.cam = new THREE.PerspectiveCamera(35, 4 / 3, .05, 60);
    E.env = makeEnv(E.r); if (E.env) E.scene.environment = E.env;
    E.scene.add(new THREE.HemisphereLight(0xffffff, 0x7d6a55, .35));
    const dl = new THREE.DirectionalLight(0xfff3e6, 1.0); dl.position.set(-1.6, 3.4, 2.8); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048);
    Object.assign(dl.shadow.camera, { left: -3.5, right: 3.5, top: 3, bottom: -1, near: .5, far: 12 }); dl.shadow.bias = -0.0008; E.scene.add(dl);
    const tx = (c, rep) => { const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t; };
    E.floorMat = new THREE.MeshStandardMaterial({ map: tx(parquetCanvas(), [9, 9]), roughness: .55, envMapIntensity: .6 });
    E.wallMat = new THREE.MeshStandardMaterial({ map: tx(plasterCanvas(), [6, 2]), roughness: .95 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), E.floorMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; E.scene.add(floor);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), E.wallMat); wall.position.set(0, 2.5, 0); wall.receiveShadow = true; E.scene.add(wall);
    const base = new THREE.Mesh(new THREE.BoxGeometry(14, .08, .014), new THREE.MeshStandardMaterial({ color: 0xF4F2EE, roughness: .5 })); base.position.set(0, .04, .007); base.receiveShadow = true; E.scene.add(base);
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
  if (!E.r) return; const w = $('#stage3d').clientWidth || 340, h = Math.round(Math.min(300, window.innerHeight * .36, w * .62));
  E.r.setSize(w, h, false); $('#cv3d').style.height = h + 'px'; E.cam.aspect = w / h; E.cam.updateProjectionMatrix();
}
function pick(e) {
  const rc = $('#cv3d').getBoundingClientRect();
  const v = new THREE.Vector2(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
  E.ray.setFromCamera(v, E.cam); const hit = E.ray.intersectObjects(E.picks, false)[0]; const o = hit && hit.object.userData.owner; if (!o) return;
  const st = getSt(o.userData.key); st.target = st.target > .5 ? 0 : 1; updateOpenBtn();
}
const viewKeys = () => S.view === '3d' && E.inited ? E.opens.map((o) => o.userData.key) : S.keys2d;
function updateOpenBtn() { const ks = viewKeys(); $('#openAll').hidden = !ks.length; $('#openAll').textContent = ks.some((k) => getSt(k).target < .5) ? 'Tout ouvrir' : 'Tout fermer'; }
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
  E.picks = []; E.opens = []; REG = null;
  E.scene.background = lin('#E6E1D9');
  const M = matsFor(cu), feet = feetById(cu.pieds);
  let maxX = 0, maxY = 0, maxD = 0, tvMod = null;
  placeModules(p).forEach((o) => {
    const L = o.L, G = new THREE.Group(); G.position.set(o.x, o.y, 16); E.root.add(G);
    maxX = Math.max(maxX, o.x + L.W); maxY = Math.max(maxY, o.y + L.H); maxD = Math.max(maxD, L.D);
    buildModule(G, L, o.mi, M, feet);
    if (!L.raised && (!tvMod || L.W > tvMod.L.W)) tvMod = { G, L };
  });
  if (S.project === 'tv' && tvMod && tvMod.L.W >= 900) {
    const L = tvMod.L, tw = Math.min(1450, L.W * .7), th = tw * .5625, y0 = L.H + 70, cx = L.W * .5, cz = L.D * .45;
    const black = new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: .25, metalness: .2 }); black.userData = {};
    const screen = new THREE.MeshStandardMaterial({ color: 0x0a0e16, roughness: .08, metalness: .1, emissive: 0x060a12 });
    const tv = new THREE.Group(); tv.position.set(cx, y0, cz); tvMod.G.add(tv);
    const body = new THREE.Mesh(new THREE.BoxGeometry(tw, th, 28), black); body.position.set(0, th / 2, 0); body.castShadow = true; tv.add(body);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(tw - 14, th - 14), screen); scr.position.set(0, th / 2, 14.5); tv.add(scr);
    [-tw * .36, tw * .36].forEach((x) => { const f = new THREE.Mesh(new THREE.BoxGeometry(14, 70, 180), black); f.position.set(x, -35, 0); f.castShadow = true; tv.add(f); });
    maxY = Math.max(maxY, L.H + 70 + th);
  }
  E.root.position.set(-maxX / 2 * .001, 0, 0);
  E.orbit.target.set(0, maxY / 2 * .001, maxD / 2 * .001); E.ext = { w: maxX * .001, h: maxY * .001 };
  updateOpenBtn();
}
function frame() {
  if (!E.ext) return; const fov = E.cam.fov * Math.PI / 180;
  const ext = Math.max(E.ext.w / Math.max(E.cam.aspect, .6), E.ext.h * 1.25, .5);
  E.orbit.r = clamp(ext / (2 * Math.tan(fov / 2)) * 1.3, .8, 12); E.orbit.theta = .32; E.orbit.phi = 1.2;
}
function loop() {
  if (!E.running) return; requestAnimationFrame(loop);
  applyOpens(E.opens, true);
  const ob = E.orbit, sp = Math.sin(ob.phi);
  E.cam.position.set(ob.target.x + ob.r * sp * Math.sin(ob.theta), ob.target.y + ob.r * Math.cos(ob.phi), ob.target.z + ob.r * sp * Math.cos(ob.theta));
  E.cam.lookAt(ob.target); E.r.render(E.scene, E.cam);
}
function startLoop() { if (!E.running && E.inited) { E.running = true; requestAnimationFrame(loop); } }
function stopLoop() { E.running = false; }
function renderView() {
  if (!E.ok) S.view = 'photo';
  $('#viewSeg').hidden = !E.ok;
  document.querySelectorAll('#viewSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === S.view)));
  $('#stage3d').hidden = S.view !== '3d'; $('#stagePhoto').hidden = S.view !== 'photo'; $('#recenter').hidden = S.view !== '3d';
  if (S.view === '3d') {
    init3D(); if (!E.ok) return renderView();
    resize3D(); build3D(); if (!E.framed) { frame(); E.framed = true; } startLoop();
  } else { stopLoop(); drawPhotoView(true); updateOpenBtn(); }
}
function refreshView() { if (S.view === '3d' && E.inited) build3D(); else { drawPhotoView(true); updateOpenBtn(); } }
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
  const long = Math.max(Wp, Hp), f = (long / 2) / Math.tan(34.5 * Math.PI / 180);
  const cam = new THREE.PerspectiveCamera(2 * Math.atan(Hp / 2 / f) * 180 / Math.PI, Wp / Hp, 10, 80000); cam.position.set(0, 0, 0); cam.lookAt(0, 0, -1); cam.updateMatrixWorld();
  const est = photoLight();
  sc.add(new THREE.HemisphereLight(est.sky, est.ground, .45 * est.k));
  sc.userData.exp = clamp(.55 + est.k * .35, .6, .95); const dl = new THREE.DirectionalLight(est.warm, 1.0 * est.k); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048); dl.shadow.bias = -0.0006; sc.add(dl);
  const M = matsFor(cu), feet = feetById(cu.pieds);
  PH.opens = []; PH.picks = []; REG = PH;
  let floorY = null, minZ = Infinity, maxZ = -Infinity, cx = 0, topY = -Infinity;
  p.modules.forEach((m, mi) => {
    const z = zoneFor(m, mi) || DEFZ, L = layoutModule(m, z);
    const x0 = z.x * Wp, x1 = (z.x + z.w) * Wp, y1 = (z.y + z.h) * Hp, A = pos(z.A) || L.W;
    const Z = f * A / Math.max(10, x1 - x0), Xl = (x0 - Wp / 2) * Z / f, Yb = -(y1 - Hp / 2) * Z / f;
    const G = new THREE.Group(); G.position.set(Xl + (A - L.W) / 2, Yb, -Z - L.D); sc.add(G);
    buildModule(G, L, mi, M, feet);
    if (!L.raised) floorY = floorY === null ? Yb : Math.min(floorY, Yb);
    minZ = Math.min(minZ, -Z - L.D); maxZ = Math.max(maxZ, -Z); cx += Xl + A / 2; topY = Math.max(topY, Yb + L.H);
  });
  REG = null; cx /= p.modules.length;
  const fy = floorY === null ? topY - 2000 : floorY;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000), new THREE.ShadowMaterial({ opacity: .4 })); fl.userData.own = true; fl.rotation.x = -Math.PI / 2; fl.position.set(cx, fy, minZ); fl.receiveShadow = true; sc.add(fl);
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000), new THREE.ShadowMaterial({ opacity: .22 })); wl.userData.own = true; wl.position.set(cx, fy, minZ - 2); wl.receiveShadow = true; sc.add(wl);
  dl.position.set(cx - 1700, topY + 2600, maxZ + 2200); dl.target.position.set(cx, fy, (minZ + maxZ) / 2); sc.add(dl.target);
  Object.assign(dl.shadow.camera, { left: -4500, right: 4500, top: 4500, bottom: -4500, near: 100, far: 15000 }); dl.shadow.camera.updateProjectionMatrix();
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
    thumbR(Wp, Hp); r.setClearColor(0x000000, 0); r.toneMappingExposure = PH.scene.userData.exp || .85; r.render(PH.scene, PH.cam); r.toneMappingExposure = 1; g.drawImage(T.cv, 0, 0, Wp, Hp);
    S.keys2d = PH.opens.map((o) => o.userData.key); S.hits = [];
  } catch (err) { PH.ok = false; drawProjection(); }
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
  const N = S.notice; const st = N && N.steps[S.nstep]; const cv = $('#stepCv'); const g = cv.getContext('2d'); const Wc = 720, Hc = 480;
  cv.width = Wc; cv.height = Hc; g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, Wc, Hc);
  if (!st) return;
  const mod = st.mod;
  if (!mod) { g.fillStyle = '#565D6A'; g.font = '600 20px "Plus Jakarta Sans", system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('Assemblage final des modules', Wc / 2, Hc / 2); return; }
  const r = thumbR(Wc, Hc);
  if (!r) { g.fillStyle = '#565D6A'; g.font = '600 18px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('Illustration indisponible sur cet appareil', Wc / 2, Hc / 2); return; }
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0xffffff);
  sc.add(new THREE.AmbientLight(0xffffff, .82)); const dl = new THREE.DirectionalLight(0xffffff, .38); dl.position.set(1, 2, 1.5); sc.add(dl);
  const box3 = new THREE.Box3(), news = new Set(st.news), show = new Set(st.all ? mod.parts.map((p) => p.code) : st.show), centers = [];
  const addBox = (b, isNew, off) => {
    const [x, y, z, w, h, d] = b; const geo = new THREE.BoxGeometry(Math.max(w, 2), Math.max(h, 2), Math.max(d, 2));
    const me = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: isNew ? 0xFFD9C2 : 0xF4F3F0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })); me.userData.own = true;
    me.position.set(x + w / 2 + off[0], y + h / 2 + off[1], z + d / 2 + off[2]); sc.add(me);
    const ed = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: isNew ? 0x8A3A0E : 0x2A2A2A })); ed.userData.own = true; ed.position.copy(me.position); sc.add(ed);
    box3.expandByObject(me); return me.position.clone();
  };
  mod.parts.forEach((p) => {
    if (!show.has(p.code)) return; const isNew = news.has(p.code); const off = isNew && st.explode ? st.explode : [0, 0, 0];
    const c = addBox(p.box, isNew, off); if (isNew) centers.push({ code: p.code, c, final: new THREE.Vector3(p.box[0] + p.box[3] / 2, p.box[1] + p.box[4] / 2, p.box[2] + p.box[5] / 2) });
  });
  st.extra.forEach((b) => addBox(b.box, b.isNew, [0, 0, 0]));
  if (box3.isEmpty()) box3.set(new THREE.Vector3(0, 0, 0), new THREE.Vector3(mod.L.W, mod.L.H, mod.L.D));
  const size = box3.getSize(new THREE.Vector3()), ctr = box3.getCenter(new THREE.Vector3());
  const cam = new THREE.PerspectiveCamera(26, Wc / Hc, 10, 100000);
  const dir = st.view === 'back' ? new THREE.Vector3(-.55, .45, -1) : st.view === 'below' ? new THREE.Vector3(.6, -.75, .9) : new THREE.Vector3(.6, .5, 1);
  dir.normalize(); const fitW = Math.max(size.x, size.z) / (Wc / Hc), fitH = size.y * 1.15, dist = Math.max(fitW, fitH, 300) / (2 * Math.tan(13 * Math.PI / 180)) * 1.05 + size.z * .5;
  cam.position.copy(ctr).addScaledVector(dir, dist); cam.lookAt(ctr); cam.updateMatrixWorld();
  r.render(sc, cam); g.drawImage(T.cv, 0, 0, Wc, Hc); disposeScene(sc);
  const proj = (v) => { const q = v.clone().project(cam); return [(q.x + 1) / 2 * Wc, (1 - q.y) / 2 * Hc]; };
  g.save(); g.strokeStyle = '#E8590C'; g.fillStyle = '#E8590C'; g.lineWidth = 2;
  if (st.explode) centers.forEach((o) => { const a = proj(o.c), b = proj(o.final); if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 20) { g.setLineDash([7, 6]); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.setLineDash([]); head(g, a[0], a[1], b[0], b[1], 11); } });
  g.restore();
  const seen = {};
  st.markers.forEach((mk) => { const [x, y] = proj(new THREE.Vector3(...mk.p)); g.fillStyle = '#15171A'; g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.5; g.stroke(); if (!seen[mk.c]) seen[mk.c] = [x, y]; });
  Object.entries(seen).forEach(([c, [x, y]]) => { const lx = clamp(x + 26, 20, Wc - 20), ly = clamp(y - 26, 20, Hc - 20); g.strokeStyle = '#15171A'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(lx, ly); g.stroke(); badge(g, lx, ly, c, 13); });
  centers.forEach((o) => { const [x, y] = proj(o.c); g.font = '800 16px "IBM Plex Mono", ui-monospace, monospace'; const w = g.measureText(o.code).width + 16; g.fillStyle = '#15171A'; rr(g, x - w / 2, y - 13, w, 26, 6); g.fill(); g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.code, x, y + 1); });
  if (st.hw.length) {
    const rowH = 30, bw = 210, bh = st.hw.length * rowH + 14; g.fillStyle = '#FFFFFF'; g.strokeStyle = '#15171A'; g.lineWidth = 1.5; rr(g, 12, 12, bw, bh, 8); g.fill(); g.stroke();
    st.hw.forEach(([c, q], i) => { const y = 12 + 7 + rowH * i + rowH / 2; hwIcon(g, 34, y, c); g.fillStyle = '#15171A'; g.font = '800 17px "IBM Plex Mono", ui-monospace, monospace'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(`${q} ×`, 58, y); badge(g, 124, y, c, 11); g.font = '600 12px "Plus Jakarta Sans", system-ui, sans-serif'; g.fillStyle = '#565D6A'; g.fillText(c === 'H' ? 'poignées' : c === 'I' ? 'pieds' : (HW[c] ? HW[c].nom.split(' ').slice(0, 2).join(' ') : ''), 142, y); });
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
  return { id: S.projId, name: S.projName, savedAt: Date.now(), step: S.step, project: S.project, fab: S.fab, needs: $('#needs').value, obst: $('#obst').value, style: $('#style').value,
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
  abortAll(); S.projId = pj.id; S.projName = pj.name || ''; S.project = pj.project || 'tv'; S.fab = pj.fab || 'mixte'; S.level = pj.level || 'bricoleur';
  S.tools = new Set(pj.tools || []); S.shops = new Set(pj.shops || []); S.zones = Array.isArray(pj.zones) ? pj.zones : []; S.sel = 0; S.redraw = null;
  $('#needs').value = pj.needs || ''; $('#obst').value = pj.obst || ''; $('#style').value = pj.style || '';
  S.result = Array.isArray(pj.result) ? pj.result : [null, null, null]; S.custom = Array.isArray(pj.custom) ? pj.custom : [null, null, null];
  S.active = S.result[pj.active] ? pj.active : S.result.findIndex(Boolean); S.genZones = pj.genZones || null; S.view = pj.view || '3d';
  S.custom = S.custom.map((c, i) => (S.result[i] && !c) ? (initCustom(i), S.custom[i]) : c);
  S.custom.forEach((c) => { if (c && !c.pieds) c.pieds = 'carre_bois'; });
  S.gen = S.result.map((r) => ({ status: r ? 'done' : 'error', pctMax: r ? 100 : 0 }));
  E.state = {}; E.framed = false; S.nstep = 0; S.demo = false;
  $('#propTabs').innerHTML = ''; $('#progBox').hidden = true; $('#errBox').hidden = true; $('#result').hidden = true;
  renderOptions();
  const img = pj.photo ? (() => { const i = new Image(); i.src = pj.photo; return i; })() : examplePhoto();
  setPhoto(img, !pj.photo, () => show(S.result.some(Boolean) ? 3 : clamp(num(pj.step), 0, 2)));
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
$('#sheetClose').onclick = () => { $('#sheet').hidden = true; if (S.step === 3 && currentProp() && S.view === '3d') startLoop(); };

/* ================= example result (shown when Claude is unavailable) ================= */
const caisse = { hauteur_mm: 186, type: 'caisse', contenu: 'caisse de vin' };
const mod = (fab, Hm, topT, cols, details) => ({ zone: 1, fabrication: fab, largeur_mm: 2420, hauteur_mm: Hm, profondeur_mm: 440, pieds_mm: 110, epaisseur_plateau_mm: topT, colonnes: cols, details });
const col = (cases, ref) => ({ largeur_mm: 600, ref: ref || '', cases });
const BESTA = 'IKEA BESTÅ caisson 60 x 40 x 38 cm';
const DEMO = [
  { nom: 'Économique', resume: 'Quatre caissons IKEA BESTÅ tout faits sur pieds bois, un plateau sapin, vos caisses de vin en tiroirs.', duree: 'une demi-journée', difficulte: 1, enseignes: ['IKEA', 'Leroy Merlin'],
    finitions: { structure: 'blanc', facades: 'pin', plateau: 'pin', poignee: 'cuir', finition_poignee: 'laiton', pieds: 'fuseau' },
    modules: [mod('caissons', 530, 18, [col([{ hauteur_mm: 200, type: 'ouvert', contenu: 'ampli' }, caisse], BESTA), col([{ hauteur_mm: 200, type: 'ouvert', contenu: 'box' }, caisse], BESTA), col([{ hauteur_mm: 200, type: 'ouvert', contenu: 'enceinte' }, caisse], BESTA), col([{ hauteur_mm: 200, type: 'ouvert', contenu: 'vinyles' }, caisse], BESTA)],
      [{ type: 'passe_cable', face: 'arriere', x_mm: 1210, y_mm: 230, diametre_mm: 60 }, { type: 'fixation_murale' }])],
    liste: [{ qte: 4, article: 'IKEA BESTÅ caisson blanc 60 x 40 x 38 cm', enseigne: 'IKEA', recherche: 'BESTÅ caisson 60x40x38', prix: 140 },
      { qte: 1, article: 'Tablette sapin lamellé-collé 250 x 60 cm, ép. 18 mm', enseigne: 'Leroy Merlin', recherche: 'tablette sapin lamellé collé 250 x 60', detail: 'recoupée à 2420 x 452 mm', prix: 42.9 }], attention: '' },
  { nom: 'Équilibrée', resume: 'Structure en sapin, plateau chêne massif, un tiroir pour les câbles et vos caisses de vin.', duree: 'une journée', difficulte: 2, enseignes: ['Castorama', 'Leroy Merlin'],
    finitions: { structure: 'pin', facades: 'chene', plateau: 'chene', poignee: 'barre_fine', finition_poignee: 'noir', pieds: 'carre_bois' },
    modules: [mod('panneaux', 620, 26, [col([{ hauteur_mm: 280, type: 'ouvert', contenu: 'ampli' }, caisse]), col([{ hauteur_mm: 120, type: 'tiroir', contenu: 'câbles' }, { hauteur_mm: 150, type: 'ouvert', contenu: 'box' }, caisse]), col([{ hauteur_mm: 280, type: 'ouvert', contenu: 'enceinte' }, caisse]), col([{ hauteur_mm: 280, type: 'ouvert', contenu: 'vinyles' }, caisse])],
      [{ type: 'passe_cable', face: 'arriere', x_mm: 900, y_mm: 230, diametre_mm: 60 }, { type: 'passe_cable', face: 'plateau', x_mm: 1210, y_mm: 60, diametre_mm: 60 }, { type: 'aeration', face: 'arriere', x_mm: 320, y_mm: 280, largeur_mm: 240, hauteur_mm: 60 }, { type: 'fixation_murale' }])],
    liste: [{ qte: 1, article: 'Plan de travail chêne massif 250 x 65 cm, ép. 26 mm', enseigne: 'Castorama', recherche: 'plan de travail chêne massif 250 x 65', detail: 'recoupé à 2420 x 452 mm', prix: 99 },
      { qte: 3, article: 'Tablette sapin lamellé-collé 250 x 60 cm, ép. 18 mm', enseigne: 'Leroy Merlin', recherche: 'tablette sapin lamellé collé 250 x 60', detail: 'découpe en magasin', prix: 128.7 },
      { qte: 1, article: 'Contreplaqué peuplier 5 mm, 250 x 122 cm', enseigne: 'Leroy Merlin', recherche: 'contreplaqué peuplier 5 mm', detail: 'pour le dos et les fonds de tiroir', prix: 19 }], attention: 'Le chêne massif travaille : fixez le plateau avec les trous oblongs des équerres.' },
  { nom: 'Optimale', resume: 'Tout en chêne, deux portes pour cacher l’ampli et la box, un passe-câble sous la TV.', duree: 'un week-end', difficulte: 3, enseignes: ['Leroy Merlin'],
    finitions: { structure: 'chene', facades: 'chene', plateau: 'chene', poignee: 'barre_tube', finition_poignee: 'laiton', pieds: 'compas' },
    modules: [mod('panneaux', 620, 36, [col([{ hauteur_mm: 280, type: 'porte', contenu: 'ampli' }, caisse]), col([{ hauteur_mm: 280, type: 'ouvert', contenu: 'enceinte' }, caisse]), col([{ hauteur_mm: 280, type: 'ouvert', contenu: 'vinyles' }, caisse]), col([{ hauteur_mm: 280, type: 'porte', contenu: 'box' }, caisse])],
      [{ type: 'passe_cable', face: 'plateau', x_mm: 1210, y_mm: 60, diametre_mm: 60 }, { type: 'aeration', face: 'arriere', x_mm: 320, y_mm: 280, largeur_mm: 240, hauteur_mm: 60 }, { type: 'fixation_murale' }])],
    liste: [{ qte: 2, article: 'Plan de travail chêne lamellé huilé 300 x 65 cm, ép. 36 mm', enseigne: 'Leroy Merlin', recherche: 'plan de travail chêne lamellé 300 x 65', detail: 'chutes utilisées en montants', prix: 658 },
      { qte: 1, article: 'Contreplaqué chêne 5 mm, 250 x 122 cm', enseigne: 'Leroy Merlin', recherche: 'contreplaqué chêne 5 mm', detail: 'dos', prix: 45 }], attention: 'Des coupes au rail de guidage sont nécessaires.' }];

renderOptions();
setPhoto(examplePhoto(), true);
renderZones();
show(0);
})();
