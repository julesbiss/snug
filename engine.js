/* SNUG design engine.
   Turns a project type, the things to store and the measured zones into three furniture plans
   (Économique, Équilibrée, Optimale). Pure rules, no network: the same input always gives the same plans.
   Plans use the app's format: modules → colonnes (left to right) → cases (bottom to top), all in mm. */
(function (root) {
'use strict';
const T = 18; // panel thickness
const num = (v, d = 0) => { const n = +v; return Number.isFinite(n) ? n : d; };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const R5 = (v) => Math.round(v / 5) * 5;

/* ---------- what can be stored, per project ----------
   h, w, d : clear height, minimum width and depth needed (mm)
   type    : case type, or types[] per variant (Économique, Équilibrée, Optimale)
   pos     : where it goes in a column: bas (heavy, low), mid, haut (rarely used, high)
   kind    : 'top' = stands on the furniture, 'flag' = yes/no option */
const ITEMS = {
  tv: [
    { id: 'tv', nom: 'Télévision', hint: 'posée sur le meuble', kind: 'top', def: 1, max: 1 },
    { id: 'platine', nom: 'Platine vinyle', hint: 'posée sur le dessus', kind: 'top', def: 1, max: 1 },
    { id: 'box', nom: 'Box internet ou décodeur', hint: 'niche ventilée, passe-câble', h: 130, hMin: 110, w: 300, d: 250, type: 'ouvert', pos: 'mid', vent: 1, cable: 1, def: 1, max: 3, label: 'box' },
    { id: 'ampli', nom: 'Ampli ou lecteur', hint: 'niche ventilée de 44 cm', h: 180, hMin: 150, w: 440, d: 380, type: 'ouvert', pos: 'mid', vent: 1, cable: 1, def: 1, max: 3, label: 'ampli' },
    { id: 'console', nom: 'Console de jeux', hint: 'niche ventilée', h: 160, hMin: 130, w: 400, d: 330, type: 'ouvert', pos: 'mid', vent: 1, cable: 1, def: 0, max: 3, label: 'console' },
    { id: 'enceinte', nom: 'Enceinte', hint: 'niche de 28 cm', h: 280, hMin: 240, w: 220, d: 250, type: 'ouvert', pos: 'mid', def: 0, max: 4, label: 'enceinte' },
    { id: 'vinyles', nom: 'Bac à vinyles', hint: 'niche de 33 cm', h: 330, w: 330, d: 330, type: 'ouvert', pos: 'bas', def: 1, max: 6, label: 'vinyles' },
    { id: 'livres', nom: 'Niche à livres', hint: '26 cm de haut', h: 260, w: 300, d: 220, type: 'ouvert', pos: 'mid', def: 0, max: 8, label: 'livres' },
    { id: 'tiroirs', nom: 'Tiroir', hint: 'jeux, câbles, télécommandes', h: 150, hMin: 110, w: 350, d: 300, type: 'tiroir', pos: 'bas', def: 0, max: 8, label: 'tiroir' },
    { id: 'caisses', nom: 'Caisse de vin en tiroir', hint: 'glisse sur patins', h: 200, hMin: 180, w: 360, d: 300, type: 'caisse', pos: 'bas', def: 3, max: 8, label: 'caisse' },
    { id: 'ferme', nom: 'Rangement fermé', hint: 'derrière une porte', h: 300, w: 400, d: 300, type: 'porte', pos: 'bas', def: 0, max: 6, label: 'placard' },
    { id: 'robot', nom: 'Le robot aspirateur passe dessous', kind: 'flag', def: 1 }],
  dressing: [
    { id: 'penderie_l', nom: 'Penderie longue', hint: 'robes, manteaux · 150 cm', h: 1500, w: 500, d: 550, types: ['ouvert', 'ouvert', 'porte'], pos: 'bas', rod: 1, def: 1, max: 4, label: 'penderie' },
    { id: 'penderie_c', nom: 'Penderie courte', hint: 'chemises, vestes · 100 cm', h: 1000, w: 500, d: 550, types: ['ouvert', 'ouvert', 'porte'], pos: 'bas', rod: 1, def: 2, max: 6, label: 'penderie' },
    { id: 'pulls', nom: 'Étagère à pulls', hint: '32 cm de haut', h: 320, w: 400, d: 350, type: 'ouvert', pos: 'mid', def: 3, max: 12, label: 'pulls' },
    { id: 'tiroirs', nom: 'Tiroir', hint: 'sous-vêtements, accessoires', h: 200, w: 400, d: 400, type: 'tiroir', pos: 'bas', def: 3, max: 12, label: 'tiroir' },
    { id: 'chaussures', nom: 'Étagère à chaussures', hint: '19 cm de haut', h: 190, w: 400, d: 300, types: ['ouvert', 'ouvert', 'abattant'], pos: 'bas', def: 1, max: 6, label: 'chaussures' },
    { id: 'valises', nom: 'Casier à valises', hint: 'tout en haut · 42 cm', h: 420, w: 500, d: 400, types: ['ouvert', 'ouvert', 'porte'], pos: 'haut', def: 1, max: 4, label: 'valises' },
    { id: 'linge', nom: 'Placard à linge', hint: 'draps, serviettes', h: 600, w: 400, d: 350, type: 'porte', pos: 'mid', def: 0, max: 4, label: 'linge' },
    { id: 'caisses', nom: 'Bac de rangement', hint: 'glisse sur patins', h: 260, w: 330, d: 300, type: 'caisse', pos: 'bas', def: 0, max: 8, label: 'bac' },
    { id: 'robot', nom: 'Le robot aspirateur passe dessous', kind: 'flag', def: 0 }],
  biblio: [
    { id: 'poches', nom: 'Étagère livres de poche', hint: '22 cm de haut', h: 220, w: 300, d: 180, type: 'ouvert', pos: 'mid', def: 2, max: 16, label: 'poches' },
    { id: 'livres', nom: 'Étagère grands livres', hint: '33 cm de haut', h: 330, w: 300, d: 250, type: 'ouvert', pos: 'mid', def: 4, max: 16, label: 'livres' },
    { id: 'beaux', nom: 'BD et beaux livres', hint: '38 cm de haut', h: 380, w: 300, d: 270, type: 'ouvert', pos: 'bas', def: 1, max: 8, label: 'beaux livres' },
    { id: 'vinyles', nom: 'Bac à vinyles', hint: 'niche de 33 cm', h: 340, w: 330, d: 320, type: 'ouvert', pos: 'bas', def: 0, max: 6, label: 'vinyles' },
    { id: 'deco', nom: 'Niche déco', hint: 'plantes, objets', h: 350, w: 300, d: 200, type: 'ouvert', pos: 'haut', def: 1, max: 6, label: 'déco' },
    { id: 'ferme', nom: 'Rangement fermé', hint: 'derrière une porte', h: 400, w: 400, d: 280, type: 'porte', pos: 'bas', def: 1, max: 6, label: 'placard' },
    { id: 'tiroirs', nom: 'Tiroir', hint: '18 cm de haut', h: 180, w: 350, d: 250, type: 'tiroir', pos: 'bas', def: 0, max: 8, label: 'tiroir' },
    { id: 'caisses', nom: 'Bac ou caisse', hint: 'glisse sur patins', h: 260, w: 330, d: 280, type: 'caisse', pos: 'bas', def: 0, max: 8, label: 'bac' },
    { id: 'robot', nom: 'Le robot aspirateur passe dessous', kind: 'flag', def: 0 }],
  escalier: [
    { id: 'aspirateur', nom: 'Aspirateur balai', hint: 'placard de 125 cm', h: 1250, w: 350, d: 300, type: 'porte', pos: 'bas', def: 1, max: 2, label: 'aspirateur' },
    { id: 'balais', nom: 'Balais et serpillière', hint: 'placard de 140 cm', h: 1400, w: 300, d: 250, type: 'porte', pos: 'bas', def: 0, max: 2, label: 'balais' },
    { id: 'manteaux', nom: 'Penderie à manteaux', hint: '100 cm, derrière une porte', h: 1000, w: 500, d: 500, type: 'porte', pos: 'bas', rod: 1, def: 1, max: 3, label: 'manteaux' },
    { id: 'chaussures', nom: 'Étagère à chaussures', hint: '19 cm de haut', h: 190, w: 400, d: 300, types: ['ouvert', 'ouvert', 'abattant'], pos: 'bas', def: 2, max: 8, label: 'chaussures' },
    { id: 'tiroirs', nom: 'Tiroir', hint: '18 cm de haut', h: 180, w: 400, d: 400, type: 'tiroir', pos: 'bas', def: 2, max: 10, label: 'tiroir' },
    { id: 'etageres', nom: 'Étagère', hint: 'conserves, produits ménagers', h: 300, w: 300, d: 250, types: ['ouvert', 'porte', 'porte'], pos: 'mid', def: 1, max: 12, label: 'étagère' },
    { id: 'caisses', nom: 'Bac ou caisse', hint: 'glisse sur patins', h: 260, w: 330, d: 300, type: 'caisse', pos: 'bas', def: 0, max: 8, label: 'bac' },
    { id: 'ferme', nom: 'Placard', hint: '50 cm, derrière une porte', h: 500, w: 400, d: 300, type: 'porte', pos: 'mid', def: 0, max: 6, label: 'placard' },
    { id: 'pente', nom: 'Côté le plus bas de l’escalier', kind: 'choice', def: 'aucune', options: [['aucune', 'Pas de pente'], ['gauche', 'À gauche'], ['droite', 'À droite']] },
    { id: 'h_bas', nom: 'Hauteur côté bas', hint: 'mm, sous la marche la plus basse', kind: 'number', def: 900, when: (it) => it.pente && it.pente !== 'aucune' }],
  bureau: [
    { id: 'tiroirs', nom: 'Tiroir', hint: 'fournitures, papiers', h: 150, w: 350, d: 400, type: 'tiroir', pos: 'mid', def: 3, max: 8, label: 'tiroir' },
    { id: 'classeurs', nom: 'Tiroir à dossiers suspendus', hint: '30 cm de haut', h: 300, w: 380, d: 420, type: 'tiroir', pos: 'bas', def: 0, max: 3, label: 'dossiers' },
    { id: 'imprimante', nom: 'Niche imprimante', hint: 'ventilée, passe-câble', h: 260, w: 400, d: 380, type: 'ouvert', pos: 'bas', vent: 1, cable: 1, def: 0, max: 2, label: 'imprimante' },
    { id: 'livres', nom: 'Étagère livres', hint: '30 cm de haut', h: 300, w: 300, d: 250, type: 'ouvert', pos: 'mid', def: 0, max: 6, label: 'livres' },
    { id: 'ferme', nom: 'Rangement fermé', hint: 'derrière une porte', h: 300, w: 350, d: 300, type: 'porte', pos: 'bas', def: 0, max: 4, label: 'placard' },
    { id: 'robot', nom: 'Le robot aspirateur passe dessous', kind: 'flag', def: 0 }],
  autre: [
    { id: 'etageres', nom: 'Étagère ouverte', hint: '30 cm de haut', h: 300, w: 300, d: 200, type: 'ouvert', pos: 'mid', def: 3, max: 16, label: 'étagère' },
    { id: 'tiroirs', nom: 'Tiroir', hint: '18 cm de haut', h: 180, w: 350, d: 300, type: 'tiroir', pos: 'bas', def: 2, max: 12, label: 'tiroir' },
    { id: 'ferme', nom: 'Rangement fermé', hint: 'derrière une porte', h: 400, w: 350, d: 300, type: 'porte', pos: 'bas', def: 1, max: 8, label: 'placard' },
    { id: 'caisses', nom: 'Bac ou caisse', hint: 'glisse sur patins', h: 260, w: 330, d: 280, type: 'caisse', pos: 'bas', def: 0, max: 8, label: 'bac' },
    { id: 'penderie', nom: 'Penderie', hint: '100 cm', h: 1000, w: 500, d: 520, types: ['ouvert', 'ouvert', 'porte'], pos: 'bas', rod: 1, def: 0, max: 4, label: 'penderie' },
    { id: 'deco', nom: 'Niche déco', hint: '35 cm de haut', h: 350, w: 300, d: 200, type: 'ouvert', pos: 'haut', def: 0, max: 6, label: 'déco' },
    { id: 'robot', nom: 'Le robot aspirateur passe dessous', kind: 'flag', def: 0 }],
};

/* ---------- project rules ---------- */
const PP = {
  tv: { depth: 450, Hcap: 900, target: 650, filler: 'rangement', niche: 300 },
  dressing: { depth: 600, target: 900, filler: 'pulls', niche: 340 },
  biblio: { depth: 320, target: 800, filler: 'livres', niche: 330 },
  escalier: { depth: 600, target: 600, filler: 'étagère', niche: 330 },
  bureau: { depth: 638, target: 450, filler: 'rangement', niche: 280, deskH: 750 },
  autre: { depth: 500, target: 700, filler: '', niche: 330 },
};

/* ---------- caissons sold ready-made (dimensions and prices are estimates, links search the shop) ---------- */
const SYSTEMS = [
  { id: 'besta', nom: 'IKEA BESTÅ', shop: 'IKEA', depth: 400, legs: 1, wall: 1, projects: ['tv', 'biblio', 'bureau', 'autre', 'escalier'],
    sizes: [[600, 380], [600, 640], [600, 1280], [600, 1920], [1200, 380], [1200, 640]], k: [15, 0.00009], shelf: 10, front: 60 },
  { id: 'eket', nom: 'IKEA EKET', shop: 'IKEA', depth: 350, legs: 1, wall: 1, projects: ['tv', 'biblio', 'escalier', 'autre'],
    sizes: [[350, 350], [700, 350], [1050, 350], [700, 700], [1050, 700]], k: [8, 0.00011], shelf: 8, front: 55 },
  { id: 'billy', nom: 'IKEA BILLY', shop: 'IKEA', depth: 280, legs: 0, wall: 0, projects: ['biblio'],
    sizes: [[400, 1060], [800, 1060], [400, 2020], [800, 2020], [400, 2370], [800, 2370]], k: [12, 0.00003], shelf: 8, front: 50 },
  { id: 'pax', nom: 'IKEA PAX', shop: 'IKEA', depth: 580, legs: 0, wall: 0, projects: ['dressing'],
    sizes: [[500, 2010], [750, 2010], [1000, 2010], [500, 2360], [750, 2360], [1000, 2360]], k: [30, 0.000045], shelf: 12, front: 55 },
  { id: 'platsa', nom: 'IKEA PLATSA', shop: 'IKEA', depth: 420, legs: 1, wall: 1, projects: ['escalier', 'dressing', 'autre', 'tv'],
    sizes: [[400, 400], [600, 400], [800, 400], [600, 600], [800, 600], [600, 1200], [800, 1200], [600, 1800], [800, 1800]], k: [15, 0.00007], shelf: 10, front: 55 },
  { id: 'atomia', nom: 'Castorama GoodHome Atomia', shop: 'Castorama', depth: 580, legs: 0, wall: 0, projects: ['dressing', 'escalier'],
    sizes: [[500, 1875], [750, 1875], [1000, 1875], [500, 2250], [750, 2250], [1000, 2250]], k: [35, 0.00004], shelf: 12, front: 50 },
  { id: 'goodhome', nom: 'Castorama GoodHome caisson bas', shop: 'Castorama', depth: 570, legs: 1, plinth: 1, wall: 0, projects: ['bureau', 'escalier', 'autre'],
    sizes: [[300, 720], [400, 720], [500, 720], [600, 720], [800, 720], [1000, 720]], k: [28, 0.00005], shelf: 9, front: 50 },
  { id: 'delinia', nom: 'Leroy Merlin Delinia ID caisson bas', shop: 'Leroy Merlin', depth: 560, legs: 1, plinth: 1, wall: 0, projects: ['escalier', 'autre', 'bureau'],
    sizes: [[300, 768], [400, 768], [450, 768], [600, 768], [800, 768]], k: [30, 0.00005], shelf: 9, front: 55 },
  { id: 'metod', nom: 'IKEA METOD élément mural', shop: 'IKEA', depth: 370, legs: 0, wall: 1, wallOnly: 1, projects: ['autre', 'escalier', 'bureau', 'tv'],
    sizes: [[400, 400], [600, 400], [800, 400], [400, 600], [600, 600], [800, 600], [400, 800], [600, 800], [800, 800], [400, 1000], [600, 1000]], k: [18, 0.00005], shelf: 9, front: 55 },
];
const PREF = {
  tv: ['besta', 'eket', 'platsa', 'metod'], dressing: ['pax', 'atomia', 'platsa'], biblio: ['billy', 'besta', 'eket'],
  escalier: ['platsa', 'goodhome', 'delinia', 'besta', 'eket', 'atomia', 'metod'], bureau: ['besta', 'goodhome', 'delinia', 'metod'],
  autre: ['besta', 'platsa', 'goodhome', 'delinia', 'eket', 'metod'],
};
const sysPrice = (s, w, h) => Math.round(s.k[0] + w * h * s.k[1]);
const cm = (v) => String(Math.round(v / 10));

/* ---------- finishes per style (Économique, Équilibrée, Optimale) ---------- */
const AMBIANCES = [['bois', 'Bois naturel', 'Pin, chêne, huilé'], ['blanc_bois', 'Blanc et bois', 'Lumineux, scandinave'], ['couleur', 'Couleur', 'Sauge, lin, bleu nuit'], ['sombre', 'Sombre', 'Noir, noyer, chêne fumé']];
const F = (structure, facades, plateau, poignee, finition_poignee, pieds) => ({ structure, facades, plateau, poignee, finition_poignee, pieds });
const AMB = {
  bois: [F('pin', 'pin', 'pin', 'bouton_bois', 'bois', 'carre_bois'), F('pin', 'chene', 'chene', 'barre_fine', 'noir', 'fuseau'), F('chene', 'chene', 'chene', 'cannelee', 'laiton', 'compas')],
  blanc_bois: [F('blanc', 'blanc', 'pin', 'cuvette', 'inox', 'carre_bois'), F('blanc', 'chene_clair', 'chene_clair', 'barre_fine', 'noir', 'metal_noir'), F('blanc', 'chene', 'chene', 'barre_tube', 'laiton', 'cylindre_laiton')],
  couleur: [F('blanc', 'sauge', 'pin', 'bouton_rond', 'blanc', 'carre_bois'), F('lin', 'sauge', 'chene_clair', 'champignon', 'laiton', 'fuseau'), F('lin', 'bleu_nuit', 'chene', 'barre_longue', 'laiton', 'cylindre_laiton')],
  sombre: [F('noir', 'noir', 'chene_fume', 'barre_plate', 'noir', 'metal_noir'), F('noir', 'chene_fume', 'chene_fume', 'barre_fine', 'noir', 'epingle'), F('noir', 'noyer', 'noyer', 'cannelee', 'laiton', 'cylindre_laiton')],
};
const CAISSON_COLOR = { bois: 'chene_clair', blanc_bois: 'blanc', couleur: 'blanc', sombre: 'noir' };
const FIN_NAMES = { chene_clair: 'chêne clair', chene: 'chêne', chene_fume: 'chêne fumé', noyer: 'noyer', pin: 'pin', bouleau: 'bouleau', teck: 'teck', blanc: 'blanc', lin: 'lin', argile: 'gris argile', sauge: 'vert sauge', bleu_nuit: 'bleu nuit', terracotta: 'terracotta', noir: 'noir' };

const FAB_MAP = { standard: ['caissons', 'caissons', 'caissons'], mixte: ['caissons', 'caissons', 'panneaux'], sur_mesure: ['panneaux', 'panneaux', 'panneaux'] };
const NOMS = ['Économique', 'Équilibrée', 'Optimale'];
const POS = { bas: 0, mid: 1, haut: 2 };
const TYPE_RANK = { caisse: 0, tiroir: 0, abattant: 1, porte: 1, ouvert: 2 };

function itemsOf(project) { return ITEMS[project] || ITEMS.autre; }
function defaults(project) { const o = {}; itemsOf(project).forEach((i) => { o[i.id] = i.def; }); return o; }

/* ---------- the best mix of ready-made widths for a given width ---------- */
function bestWidths(widths, W, nWant) {
  const step = 10, max = Math.floor(W / step), ws = [...new Set(widths)].sort((a, b) => a - b);
  const prev = new Map(); prev.set('0|0', null);
  let frontier = [[0, 0]];
  for (let c = 0; c < 14 && frontier.length; c++) {
    const next = [];
    frontier.forEach(([s, cnt]) => ws.forEach((w) => {
      const s2 = s + Math.round(w / step); if (s2 > max) return; const k = `${s2}|${cnt + 1}`;
      if (!prev.has(k)) { prev.set(k, [`${s}|${cnt}`, w]); next.push([s2, cnt + 1]); }
    }));
    frontier = next;
  }
  let best = null, bestScore = -Infinity;
  prev.forEach((_, k) => {
    const [s, c] = k.split('|').map(Number); if (!c) return;
    const score = s * step - 70 * Math.abs(c - nWant);
    if (score > bestScore) { bestScore = score; best = k; }
  });
  if (!best) return null;
  const out = []; let k = best; while (prev.get(k)) { const [p, w] = prev.get(k); out.push(w); k = p; }
  out.sort((a, b) => a - b);
  const sym = []; out.forEach((w, i) => (i % 2 ? sym.push(w) : sym.unshift(w)));
  return sym;
}

/* ---------- per-variant decisions ---------- */
function legsFor(ctx, spec, tall, sys) {
  if (spec.raised) return 0;
  if (ctx.project === 'bureau' && spec.desk) return null; // decided with the desk height
  if (sys && !sys.legs) return 0;
  let l = sys && sys.plinth ? 100 : (tall ? 80 : 110);
  if (ctx.robot) l = Math.max(l, 120);
  return l;
}
function topFor(vi, tall, desk) { return desk ? [26, 30, 38][vi] : tall ? [18, 18, 26][vi] : [18, 26, 36][vi]; }

/* No cabinet fits this zone: for each eligible system, the smallest change of the zone (depth, height, width)
   that would let its modules in; keep the one asking the least, and say it in plain words. */
function caissonNeeds(ctx, spec, vi) {
  const opts = [];
  SYSTEMS.forEach((s) => {
    if (!s.projects.includes(ctx.project)) return;
    if (ctx.shops.size && !ctx.shops.has(s.shop)) return;
    if (spec.raised && !s.wall) return;
    if (!spec.raised && s.wallOnly) return;
    const needC = s.depth + 20;
    const hs = [...new Set(s.sizes.map((z) => z[1]))].filter((h) => !(ctx.project === 'tv' && h > 800)).sort((a, b) => a - b);
    if (!hs.length) return;
    const hNeed = hs.map((h) => { const tall = h > 1100, legs = spec.desk ? 0 : legsFor(ctx, spec, tall, s), topT = topFor(vi, tall, !!spec.desk); return legs + h + topT; });
    const needB = Math.min(...hNeed), needA = Math.min(...s.sizes.map((z) => z[0]));
    const dC = Math.max(0, needC - spec.Cmax), dB = Math.max(0, needB - spec.Hmax), dA = Math.max(0, needA - spec.Wmax);
    if (!dC && !dB && !dA) return; // it should have fitted: the blocking rule is elsewhere (desk, wall), say nothing
    opts.push({ sys: s, needC, needB, needA, dC, dB, dA, cost: dC + dB + dA });
  });
  if (!opts.length) return null;
  opts.sort((a, b) => a.cost - b.cost);
  const o = opts[0], mm = (v) => Math.round(v).toLocaleString('fr-FR') + ' mm';
  const parts = [];
  if (o.dC) parts.push(`une profondeur d’au moins ${mm(o.needC)} (vous avez ${mm(spec.Cmax)})`);
  if (o.dB) parts.push(`une hauteur d’au moins ${mm(o.needB)} (vous avez ${mm(spec.Hmax)})`);
  if (o.dA) parts.push(`une largeur d’au moins ${mm(o.needA)} (vous avez ${mm(spec.Wmax)})`);
  const alt = opts.slice(1, 3).map((x) => `${x.sys.nom} (${[x.dC && 'profondeur ' + mm(x.needC), x.dB && 'hauteur ' + mm(x.needB), x.dA && 'largeur ' + mm(x.needA)].filter(Boolean).join(', ')})`);
  return { zone: spec.zone, sys: o.sys.id, nom: o.sys.nom, A: o.dA ? o.needA : null, B: o.dB ? o.needB : null, C: o.dC ? o.needC : null,
    text: `Zone ${spec.zone} : aucun caisson tout fait ne rentre, cette partie est prévue en panneaux découpés. Le plus proche de vos cotes est ${o.sys.nom} : il faudrait ${parts.join(' et ')}.${alt.length ? ' Autres pistes : ' + alt.join(' ; ') + '.' : ''}` };
}
function pickSystem(ctx, spec, vi, nWant) {
  const cands = [];
  SYSTEMS.forEach((s) => {
    if (!s.projects.includes(ctx.project)) return;
    if (ctx.shops.size && !ctx.shops.has(s.shop)) return;
    if (!ctx.mix && ctx.magasin && s.shop !== ctx.magasin && ctx.shops.size && ctx.shops.has(ctx.magasin) && SYSTEMS.some((o) => o.shop === ctx.magasin && o.projects.includes(ctx.project))) return;
    if (spec.raised && !s.wall) return;
    if (!spec.raised && s.wallOnly) return;
    if (s.depth + 20 > spec.Cmax) return;
    const tallGuess = spec.Hmax > 1200;
    const heights = [...new Set(s.sizes.map((z) => z[1]))].sort((a, b) => b - a);
    for (const h of heights) {
      let legs, topT;
      if (spec.desk) {
        topT = topFor(vi, false, true); legs = PP.bureau.deskH - h - topT;
        if (legs > 0 && legs < 40) legs = 0; // a desk a few mm lower is better than tiny feet
        if (legs < 0 || legs > 160 || (legs > 0 && !s.legs)) continue;
      } else {
        const tall = h > 1100; legs = legsFor(ctx, spec, tall, s); topT = topFor(vi, tall, false);
        if (legs + h + topT > spec.Hmax) continue;
        if (ctx.project === 'tv' && h > 800) continue;
        if (!tallGuess && h > 1100) continue;
      }
      const ws = s.sizes.filter((z) => z[1] === h).map((z) => z[0]);
      const Wav = spec.desk ? spec.Wmax - Math.max(650, spec.Wmax * .45) : spec.Wmax;
      if (Wav < Math.min(...ws)) continue;
      const widths = bestWidths(ws, Wav, spec.desk ? (Wav > 900 ? 2 : 1) : nWant);
      if (!widths) continue;
      const sum = widths.reduce((a, b) => a + b, 0);
      const cover = sum / Wav, hFill = (legs + h + topT) / spec.Hmax;
      const price = widths.reduce((a, w) => a + sysPrice(s, w, h), 0);
      cands.push({ sys: s, h, legs, topT, widths, sum, cover, hFill, price, perVol: price / (sum * h) });
      break;
    }
  });
  if (!cands.length) return null;
  const pref = PREF[ctx.project] || [];
  const usable = cands.filter((c) => c.cover > .7 && (spec.desk || c.hFill > .45));
  const list = usable.length ? usable : cands;
  if (vi === 0) list.sort((a, b) => a.perVol - b.perVol);
  else list.sort((a, b) => (pref.indexOf(a.sys.id) + 99 * (pref.indexOf(a.sys.id) < 0)) - (pref.indexOf(b.sys.id) + 99 * (pref.indexOf(b.sys.id) < 0)) || b.cover - a.cover);
  return list[0];
}

/* ---------- slicing the zones into modules ---------- */
function specsFor(ctx) {
  const out = [];
  let deskDone = false;
  const order = ctx.zones.map((z, i) => i);
  if (ctx.project === 'bureau') order.sort((a, b) => num(ctx.zones[b].A) - num(ctx.zones[a].A));
  const desk = new Set();
  if (ctx.project === 'bureau') for (const i of order) { const z = ctx.zones[i]; if (!deskDone && num(z.B) >= 700 && !(num(z.D) > 0) && num(z.A) >= 800) { desk.add(i); deskDone = true; } }
  ctx.zones.forEach((z, zi) => {
    const A = num(z.A), B = num(z.B), C = num(z.C), raised = num(z.D) > 0;
    const base = { zone: zi + 1, Wmax: Math.max(300, A - 10), Hmax: B, Cmax: C, raised, desk: desk.has(zi) };
    const pente = ctx.items.pente;
    if (ctx.project === 'escalier' && pente && pente !== 'aucune' && !raised && A >= 900) {
      const hLow = clamp(num(ctx.items.h_bas, 900), 300, B), k = clamp(Math.round(A / 750), 2, 4), w = (A - 10) / k;
      for (let j = 0; j < k; j++) {
        const lowEdge = pente === 'gauche' ? j * w : (k - j - 1) * w; // the lower edge of this slice, measured from the low side
        const hAt = hLow + (B - hLow) * (lowEdge / (A - 10));
        out.push({ ...base, Wmax: R5(w - 10), Hmax: Math.max(300, R5(hAt - 20)), decalage: R5(j * w + 5), slice: j });
      }
    } else out.push(base);
  });
  return out;
}

/* ---------- one variant ---------- */
function buildVariant(ctx, vi) {
  const notes = [];
  let fabWanted = (FAB_MAP[ctx.fab] || FAB_MAP.mixte)[vi];
  const specs = specsFor(ctx);
  const slotsAll = [];
  itemsOf(ctx.project).forEach((it) => {
    if (it.kind) return;
    const n = clamp(Math.round(num(ctx.items[it.id])), 0, it.max || 20);
    for (let k = 0; k < n; k++) slotsAll.push({ it, h: it.h, hMin: it.hMin, w: it.w, d: it.d, type: it.types ? it.types[vi] : it.type, pos: it.pos, rod: !!it.rod, label: it.label, vent: it.vent, cable: it.cable });
  });
  // objects the user added by hand: name, clear height and width, how it is closed
  (ctx.custom || []).forEach((c) => {
    const n = clamp(Math.round(num(c.n)), 0, 20), h = clamp(num(c.h), 60, 2400), w = clamp(num(c.w), 100, 1200);
    const type = ['ouvert', 'porte', 'tiroir', 'caisse', 'abattant'].includes(c.type) ? c.type : 'ouvert';
    const it = { nom: String(c.nom || 'Objet').slice(0, 40) };
    for (let k = 0; k < n; k++) slotsAll.push({ it, h, w, d: clamp(num(c.d, 250), 100, 700), type, pos: h > 900 ? 'bas' : 'mid', rod: false, label: it.nom.toLowerCase().slice(0, 16) });
  });

  let mods = null, unplaced = [], extra = 0, fellBack = false;
  for (let iter = 0; iter < 8; iter++) {
    const r = layoutAll(ctx, vi, specs, fabWanted, slotsAll, extra);
    if (r.fallback) fellBack = true;
    const better = !mods || r.unplaced.length < unplaced.length;
    if (better) { mods = r.mods; unplaced = r.unplaced; }
    if (!r.unplaced.length || !r.canGrow) break;
    extra++;
  }
  let caissonFix = null;
  if (fellBack) {
    // Which measure blocks the ready-made cabinets, and the nearest values that would let one in: the user
    // asked for "100 % caissons" and must get a plain answer, not cut panels by surprise.
    const fixes = specs.map((spec) => caissonNeeds(ctx, spec, vi)).filter(Boolean);
    if (fixes.length) { caissonFix = fixes; fixes.forEach((f) => notes.push(f.text)); }
    else { const shops = [...ctx.shops].filter((x) => x !== 'Autoriser le mélange'); notes.push(`Aucune gamme de caissons tout faits pour ce type de meuble chez ${shops.length ? shops.join(' ou ') : 'ces magasins'} : cette partie est prévue en panneaux découpés. Cochez un autre magasin à l’étape Profil pour y accéder.`); }
  }
  if (unplaced.length) {
    // say WHY each object does not fit: too tall, too wide, or simply no room left
    const cols = mods.flatMap((m) => m.colonnes.filter((c) => !c.knee));
    const maxH = Math.max(0, ...cols.map((c) => c.Hin)), maxW = Math.max(0, ...cols.map((c) => c.inner));
    const by = new Map();
    unplaced.forEach((s) => { const k = s.it.nom; const g = by.get(k) || { n: 0, s }; g.n++; by.set(k, g); });
    const mm = (v) => Math.round(v).toLocaleString('fr-FR') + ' mm';
    by.forEach(({ n, s }, nom) => {
      const what = (n > 1 ? n + ' × ' : '') + nom.toLowerCase();
      const hNeed = s.hMin || s.h;
      if (hNeed > maxH) notes.push(`Impossible de loger ${what} : il faut ${mm(hNeed)} de haut, la plus grande case possible fait ${mm(maxH)}.`);
      else if (s.w * .92 > maxW) notes.push(`Impossible de loger ${what} : il faut ${mm(s.w)} de large, les colonnes font ${mm(maxW)}.`);
      else notes.push(`Plus de place pour ${what} : agrandissez une zone, dessinez-en une autre ou retirez un objet.`);
    });
  }
  const tooDeep = new Map();
  mods.forEach((m) => m._slots.forEach((s) => { if (s.d > m.profondeur_mm) tooDeep.set(s.it.nom, [s.d, m.profondeur_mm]); }));
  tooDeep.forEach(([need, have], nom) => notes.push(`${nom} : il faut environ ${need} mm de profondeur, le meuble fait ${have} mm.`));
  const left = new Map(); mods.forEach((m) => { if (m._leftover >= 60) left.set(m.zone, (left.get(m.zone) || 0) + m._leftover); });
  left.forEach((mm, zone) => { if (mm >= 100) notes.push(`Zone ${zone} : il reste ${mm} mm de large à côté des caissons, à combler avec une étagère sur mesure ou une joue de finition.`); });
  if (ctx.robot && mods.some((m) => !m._raised && m.pieds_mm < 100)) notes.push('Le robot aspirateur ne passera pas sous les éléments posés directement au sol.');
  const anyPanels = mods.some((m) => m.fabrication === 'panneaux');
  if (anyPanels && ctx.level === 'debutant') notes.push('Faites faire les découpes en magasin : elles sont comptées dans la liste de courses.');

  // finishes
  const amb = AMB[ctx.ambiance] || AMB.bois;
  const fin = { ...amb[vi] };
  const allCais = mods.every((m) => m.fabrication === 'caissons');
  if (allCais) fin.structure = CAISSON_COLOR[ctx.ambiance] || 'blanc';
  const tallAny = mods.some((m) => m.hauteur_mm > 1200), plinthAny = mods.some((m) => m._plinth);
  if ((tallAny || plinthAny) && !ctx.robot) fin.pieds = vi === 0 && !plinthAny ? fin.pieds : 'socle';
  if (plinthAny && !ctx.robot) fin.pieds = 'plinthe';

  // shopping lines for what only the plan knows: ready-made caissons and their extra shelves
  const liste = [], group = new Map();
  mods.forEach((m) => m.colonnes.forEach((c) => {
    if (!c._sys) return;
    const k = c.ref; const g = group.get(k) || { qte: 0, sys: c._sys, w: c._w, h: c._h, shelves: 0 }; g.qte++; g.shelves += Math.max(0, c.cases.length - 1); group.set(k, g);
  }));
  group.forEach((g, ref) => {
    liste.push({ qte: g.qte, article: ref, enseigne: g.sys.shop, recherche: `${g.sys.nom.replace(/^(IKEA|Castorama|Leroy Merlin)\s+/, '')} ${cm(g.w)}x${cm(g.sys.depth)}x${cm(g.h)}`, detail: 'caisson du commerce', prix: g.qte * sysPrice(g.sys, g.w, g.h) });
  });
  const shelvesBy = new Map(); group.forEach((g) => { if (g.shelves) shelvesBy.set(g.sys, (shelvesBy.get(g.sys) || 0) + g.shelves); });
  shelvesBy.forEach((n, s) => liste.push({ qte: n, article: `Tablette supplémentaire ${s.nom}`, enseigne: s.shop, recherche: `${s.nom.replace(/^(IKEA|Castorama|Leroy Merlin)\s+/, '')} tablette`, detail: 'à la largeur des caissons', prix: n * s.shelf }));

  // text
  const placed = mods.flatMap((m) => m._slots);
  const sysUsed = [...new Set(mods.flatMap((m) => m.colonnes.map((c) => c._sys && c._sys.nom)).filter(Boolean))];
  const nCais = mods.reduce((n, m) => n + m.colonnes.filter((c) => c._sys).length, 0);
  const structTxt = allCais && nCais ? `${nCais} caisson${nCais > 1 ? 's' : ''} ${sysUsed.join(' et ')}` : anyPanels && mods.some((m) => m.fabrication === 'caissons')
    ? `Caissons ${sysUsed.join(' et ')} et panneaux sur mesure` : `Structure en ${FIN_NAMES[fin.structure] || fin.structure} découpée aux cotes exactes`;
  const tops = itemsOf(ctx.project).filter((it) => it.kind === 'top' && num(ctx.items[it.id]) > 0).map((it) => it.nom.toLowerCase());
  const resume = `${structTxt}, plateau ${FIN_NAMES[fin.plateau] || fin.plateau}${ctx.project === 'bureau' ? ' pour le plan de travail' : ''} : ${contentText(placed, mods)}${tops.length ? `, ${joinFr(tops)} sur le dessus` : ''}.`;

  const fronts = mods.reduce((n, m) => n + m.colonnes.reduce((a, c) => a + c.cases.filter((k) => k.type !== 'ouvert').length, 0), 0);
  const parts = mods.reduce((n, m) => n + m.colonnes.reduce((a, c) => a + c.cases.length, 0) + m.colonnes.length + 4, 0);
  let hours = allCais ? 1 + mods.reduce((n, m) => n + m.colonnes.filter((c) => c._sys).length * (m.hauteur_mm > 1200 ? 1.5 : .75), 0) + fronts * .3 : 2 + parts * .15 + fronts * .45 + (anyPanels ? 2 : 0);
  if (mods.length > 1) hours += 1;
  const duree = hours <= 4.5 ? 'une demi-journée' : hours <= 8 ? 'une journée' : hours <= 16 ? 'un week-end' : 'deux week-ends';
  let difficulte = allCais ? (fronts > 8 ? 2 : 1) : 2;
  if (anyPanels && (vi === 2 || mods.some((m) => m.hauteur_mm > 1800 || m.largeur_mm > 2600))) difficulte = 3;

  return {
    nom: NOMS[vi], resume, duree, difficulte, enseignes: [], magasin: ctx.magasin,
    tv: ctx.project === 'tv' && num(ctx.items.tv) > 0, finitions: fin, systeme: allCais && vi === 0 && sysUsed.length === 1 ? { nom: sysUsed[0], shop: mods[0].colonnes.find((c) => c._sys)._sys.shop, front: mods[0].colonnes.find((c) => c._sys)._sys.front } : null,
    modules: mods.map(clean), liste, attention: notes.join(' '), caissonFix,
  };
}
const joinFr = (a) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' et ' + a[a.length - 1]);
function contentText(slots, mods) {
  const open = [], counts = { tiroir: 0, caisse: 0, porte: 0, abattant: 0 }; let rods = 0;
  slots.forEach((s) => { if (s.rod) rods++; else if (s.type === 'ouvert') open.push(s.label); else counts[s.type]++; });
  const out = [];
  if (rods) out.push(`${rods} penderie${rods > 1 ? 's' : ''}`);
  const o = {}; open.forEach((l) => { o[l] = (o[l] || 0) + 1; });
  const ol = Object.entries(o).map(([l, c]) => (c > 1 ? `${c} niches ${l}` : l));
  if (ol.length) out.push(`${joinFr(ol)} en ouvert`);
  if (counts.tiroir) out.push(`${counts.tiroir} tiroir${counts.tiroir > 1 ? 's' : ''}`);
  if (counts.caisse) out.push(`${counts.caisse} caisse${counts.caisse > 1 ? 's' : ''} qui se tirent`);
  if (counts.abattant) out.push(`${counts.abattant} abattant${counts.abattant > 1 ? 's' : ''}`);
  if (counts.porte) out.push(`${counts.porte} rangement${counts.porte > 1 ? 's' : ''} derrière une porte`);
  const fill = mods.reduce((n, m) => n + m.colonnes.reduce((a, c) => a + c.cases.filter((k) => k._filler).length, 0), 0);
  if (fill) out.push(`${fill} espace${fill > 1 ? 's' : ''} en plus`);
  return out.length ? joinFr(out) : 'des étagères';
}
function clean(m) {
  const o = { ...m }; Object.keys(o).forEach((k) => { if (k[0] === '_') delete o[k]; });
  o.colonnes = m.colonnes.map((c) => { const r = { largeur_mm: c.largeur_mm, ref: c.ref || '', cases: c.cases.map((k) => { const q = { hauteur_mm: k.hauteur_mm, type: k.type, contenu: k.contenu }; if (k.tringle) q.tringle = true; return q; }) }; if (c.vide) r.vide = true; return r; });
  return o;
}

/* ---------- geometry of every module, then filling the columns ---------- */
function layoutAll(ctx, vi, specs, fabWanted, slotsAll, extra) {
  let fallback = false, canGrow = false;
  const P = PP[ctx.project] || PP.autre;
  const mods = specs.map((spec) => {
    const target = P.target * [1.15, 1, .85][vi];
    let fab = fabWanted, sys = null, pick = null;
    if (fab === 'caissons') {
      const nWant = Math.max(1, Math.round(spec.Wmax / target)) + extra;
      pick = pickSystem(ctx, spec, vi, nWant);
      if (!pick) { fab = 'panneaux'; fallback = true; } else sys = pick.sys;
    }
    const m = { zone: spec.zone, fabrication: fab, _raised: spec.raised, _slots: [], _leftover: 0 };
    if (spec.decalage != null) m.decalage_mm = spec.decalage;
    let cols;
    if (sys) {
      m.pieds_mm = pick.legs; m.epaisseur_plateau_mm = pick.topT; m.profondeur_mm = sys.depth;
      m.hauteur_mm = pick.legs + pick.h + pick.topT; m._plinth = !!sys.plinth;
      cols = pick.widths.map((w) => ({ largeur_mm: w, ref: `${sys.nom} caisson ${cm(w)} x ${cm(sys.depth)} x ${cm(pick.h)} cm`, _sys: sys, _w: w, _h: pick.h, inner: w - 2 * T, cases: [] }));
      if (spec.desk) {
        const knee = Math.max(600, spec.Wmax - pick.sum);
        const kc = { largeur_mm: knee, ref: '', vide: true, inner: knee, knee: true, cases: [] };
        if (cols.length > 1) cols.splice(1, 0, kc); else cols.unshift(kc);
        m.largeur_mm = pick.sum + knee;
      } else { m.largeur_mm = pick.sum; m._leftover = R5(spec.Wmax - pick.sum); }
      if (pick.widths.length < 10) canGrow = true;
    } else {
      const tall = spec.Hmax > 1200 && !spec.desk;
      m.largeur_mm = R5(spec.Wmax);
      if (spec.desk) {
        m.hauteur_mm = Math.min(spec.Hmax, P.deskH || 750); m.pieds_mm = 0; m.epaisseur_plateau_mm = topFor(vi, false, true);
      } else {
        m.hauteur_mm = R5(Math.min(spec.Hmax - (spec.Hmax > 1500 ? 15 : 0), P.Hcap || 99999));
        m.pieds_mm = legsFor(ctx, spec, tall, null); m.epaisseur_plateau_mm = topFor(vi, tall, false);
      }
      m.profondeur_mm = R5(clamp(Math.min(spec.Cmax - 20, P.depth), 150, 900));
      const innerW = m.largeur_mm - 2 * T;
      if (spec.desk) {
        const sw = 420, nS = innerW >= 1700 ? 2 : innerW >= 1100 ? 1 : 0;
        const knee = innerW - nS * sw - nS * T;
        const st = () => ({ largeur_mm: sw, inner: sw, cases: [] });
        const kc = { largeur_mm: knee, inner: knee, knee: true, cases: [] };
        cols = nS === 2 ? [st(), kc, st()] : nS === 1 ? [kc, st()] : [kc];
      } else {
        let n = Math.max(1, Math.round(innerW / target)) + extra;
        const maxN = Math.max(1, Math.floor((innerW + T) / (300 + T)));
        if (n >= maxN) n = maxN; else canGrow = true;
        const w = (innerW - (n - 1) * T) / n;
        cols = Array.from({ length: n }, () => ({ largeur_mm: R5(w), inner: w, cases: [] }));
      }
    }
    m.colonnes = cols;
    m._Hin = m.hauteur_mm - m.epaisseur_plateau_mm - m.pieds_mm - T;
    cols.forEach((c) => { c.used = 0; c.Hin = m._Hin; c.mod = m; });
    return m;
  });

  // fill: several packing strategies are tried, the one that stores the most wins
  const cols = mods.flatMap((m) => m.colonnes.filter((c) => !c.knee));
  const strategies = [
    { sort: (a, b) => (b.h - a.h), pick: 'roomy' },
    { sort: (a, b) => (b.rod - a.rod) || (b.h - a.h), pick: 'roomy' },
    { sort: (a, b) => (b.h - a.h), pick: 'tight' },
    { sort: (a, b) => (b.rod - a.rod) || (POS[a.pos] - POS[b.pos]) || (b.h - a.h), pick: 'tight' },
    { sort: (a, b) => (b.rod - a.rod) || (a.h - b.h), pick: 'tight' },
    { sort: (a, b) => (b.rod - a.rod) || (b.h - a.h), pick: 'tight', compact: 1 },
    { sort: (a, b) => (b.rod - a.rod) || (b.h - a.h), pick: 'roomy', compact: 1 }];
  let best = null;
  strategies.forEach((st) => {
    const state = cols.map(() => ({ used: 0, cases: [] }));
    const left = [];
    [...slotsAll].sort(st.sort).forEach((s) => {
      for (const hTry of s.hMin && s.hMin < s.h ? (st.compact ? [s.hMin] : [s.h, s.hMin]) : [s.h]) {
        let bi = -1, bestScore = -Infinity;
        cols.forEach((c, ci) => {
          if (c.inner < s.w * .92) return;
          const cs = state[ci], need = hTry + (cs.cases.length ? T : 0), rem = c.Hin - cs.used;
          if (need > rem) return;
          const after = rem - need;
          let score = st.pick === 'roomy' ? rem : -after;
          if (s.rod) score += c.inner * 4;
          if (s.d > c.mod.profondeur_mm) score -= 1e5;
          if (score > bestScore) { bestScore = score; bi = ci; }
        });
        if (bi >= 0) { const cs = state[bi]; cs.used += hTry + (cs.cases.length ? T : 0); cs.cases.push({ s, h: hTry }); return; }
      }
      left.push(s);
    });
    const lost = left.reduce((a, s) => a + s.h, 0);
    // prefer storing everything, then items spread over more columns (nicer to look at)
    const spread = state.filter((x) => x.cases.length).length;
    const key = left.length * 1e7 + lost * 10 - spread;
    if (!best || key < best.key) best = { key, state, left };
  });
  const unplaced = best.left;
  cols.forEach((c, ci) => {
    const cs = best.state[ci]; c.used = cs.used;
    c.cases = cs.cases.map(({ s, h }) => ({ hauteur_mm: h, type: s.type, contenu: s.label, tringle: s.rod, _slot: s }));
    cs.cases.forEach(({ s }) => c.mod._slots.push(s));
  });

  // order each column bottom → top, then fill what is left
  const P2 = PP[ctx.project] || PP.autre;
  mods.forEach((m) => {
    const tallM = m.hauteur_mm > 1200;
    m.colonnes.forEach((c, ci) => {
      if (c.knee) { c.cases = [{ hauteur_mm: m._Hin, type: 'ouvert', contenu: 'assise' }]; return; }
      c.cases.sort((a, b) => (POS[a._slot.pos] - POS[b._slot.pos]) || (TYPE_RANK[a.type] - TYPE_RANK[b.type]) || (b.hauteur_mm - a.hauteur_mm));
      let rem = c.Hin - c.used;
      const firstHigh = c.cases.findIndex((k) => k._slot.pos === 'haut');
      const at = firstHigh < 0 ? c.cases.length : firstHigh;
      const yStart = c.cases.slice(0, at).reduce((a, k) => a + k.hauteur_mm + T, 0);
      const fill = [];
      const space = c.cases.length ? rem - T : rem; // room for new cases, after the shelf that separates them
      if (space >= 180) {
        let closed = 0;
        const closeTop = m.colonnes.length && ctx.project === 'bureau' ? (vi ? 99999 : 0) : tallM ? [0, 800, 1000][vi] : 0;
        if (closeTop > yStart) closed = Math.min(space, closeTop - yStart);
        if (closed < 200) closed = 0;
        let open = space - closed;
        if (closed && open > 0 && open < 180) { closed = space; open = 0; }
        if (closed && open >= 180) open -= T;
        if (closed) {
          if (ctx.project === 'bureau' && closed > 320) {
            const k = Math.max(1, Math.round((closed + T) / (200 + T))), hh = (closed - (k - 1) * T) / k;
            for (let i = 0; i < k; i++) fill.push({ hauteur_mm: hh, type: 'tiroir', contenu: 'tiroir', _filler: 1 });
          } else fill.push({ hauteur_mm: closed, type: closed <= 260 ? 'tiroir' : 'porte', contenu: closed <= 260 ? 'tiroir' : 'placard', _filler: 1 });
        }
        if (open >= 150) {
          let k = Math.max(1, Math.round((open + T) / (P2.niche + T)));
          while (k > 1 && (open - (k - 1) * T) / k < 160) k--;
          const hh = (open - (k - 1) * T) / k;
          for (let i = 0; i < k; i++) {
            let type = 'ouvert', label = P2.filler;
            if (!tallM && !closed) {
              if (vi === 1 && hh <= 220) { type = 'tiroir'; label = 'tiroir'; }
              if (vi === 2) { if (hh <= 260) { type = 'tiroir'; label = 'tiroir'; } else if ((ci + i) % 2 === 0) { type = 'porte'; label = 'placard'; } }
            }
            if (ctx.project === 'bureau' && vi > 0) { type = hh <= 320 ? 'tiroir' : 'porte'; label = type === 'tiroir' ? 'tiroir' : 'placard'; }
            fill.push({ hauteur_mm: hh, type, contenu: label, _filler: 1 });
          }
        } else if (open > 0 && fill.length) fill[fill.length - 1].hauteur_mm += open + (closed ? T : 0);
        c.cases.splice(at, 0, ...fill);
      } else if (rem > 0 && c.cases.length) {
        const tgt = c.cases.find((k) => k.type === 'ouvert' && !k.tringle) || c.cases.find((k) => k.tringle) || c.cases[c.cases.length - 1];
        tgt.hauteur_mm += rem;
      } else if (!c.cases.length) c.cases.push({ hauteur_mm: c.Hin, type: 'ouvert', contenu: P2.filler, _filler: 1 });
      // exact heights: the cases and shelves add up to the column's inner height
      const sum = c.cases.reduce((a, k) => a + k.hauteur_mm, 0) + (c.cases.length - 1) * T;
      if (Math.abs(sum - c.Hin) > .5) c.cases[c.cases.length - 1].hauteur_mm += c.Hin - sum;
      c.cases.forEach((k) => { k.hauteur_mm = Math.round(k.hauteur_mm * 10) / 10; });
    });
    m.details = detailsFor(ctx, m);
  });
  return { mods, unplaced, canGrow, fallback };
}

function detailsFor(ctx, m) {
  const out = [], W = m.largeur_mm, divT = m.fabrication === 'caissons' ? 2 * T : T;
  const innerW = W - 2 * T - (m.colonnes.length - 1) * divT, sumW = m.colonnes.reduce((a, c) => a + c.largeur_mm, 0);
  let x = T; const y0 = m.pieds_mm + T;
  let backCables = 0;
  m.colonnes.forEach((c) => {
    const cw = innerW * c.largeur_mm / sumW; let y = y0;
    c.cases.forEach((k) => {
      const s = k._slot;
      if (s && s.cable && backCables < 3 && !out.some((d) => d.type === 'passe_cable' && Math.abs(d.x_mm - (x + cw / 2)) < cw / 2)) {
        out.push({ type: 'passe_cable', face: 'arriere', x_mm: Math.round(x + cw / 2), y_mm: Math.round(y + k.hauteur_mm / 2), diametre_mm: 60 }); backCables++;
      }
      if (s && s.vent) out.push({ type: 'aeration', face: 'arriere', x_mm: Math.round(x + cw / 2), y_mm: Math.round(y + k.hauteur_mm * .7), largeur_mm: Math.round(Math.min(220, cw * .6)), hauteur_mm: 50 });
      y += k.hauteur_mm + T;
    });
    if (c.knee && ctx.project === 'bureau') out.push({ type: 'passe_cable', face: 'plateau', x_mm: Math.round(x + cw / 2), y_mm: 60, diametre_mm: 60 });
    x += cw + divT;
  });
  if (ctx.project === 'tv' && !m._raised && (num(ctx.items.tv) > 0 || num(ctx.items.platine) > 0)) out.push({ type: 'passe_cable', face: 'plateau', x_mm: Math.round(W / 2), y_mm: 60, diametre_mm: 60 });
  out.push({ type: 'fixation_murale' });
  return out;
}

/* ---------- entry point ---------- */
function design(input) {
  const project = ITEMS[input.project] ? input.project : 'autre';
  const items = { ...defaults(project), ...(input.items || {}) };
  const shopsIn = new Set((input.shops || []).filter((s) => s !== 'Autoriser le mélange'));
  const mix = (input.shops || []).includes('Autoriser le mélange') || !input.shops;
  const magasin = shopsIn.has('Leroy Merlin') || !shopsIn.size ? 'Leroy Merlin' : shopsIn.has('Castorama') ? 'Castorama' : 'Leroy Merlin';
  const zones = (input.zones || []).filter((z) => num(z.A) > 0 && num(z.B) > 0 && num(z.C) > 0);
  if (!zones.length) throw new Error('no_zone');
  const ctx = { project, items, custom: Array.isArray(input.custom) ? input.custom : [], zones, fab: input.fab || 'mixte', level: input.level || 'bricoleur', tools: new Set(input.tools || []), shops: shopsIn, mix, magasin,
    ambiance: AMB[input.ambiance] ? input.ambiance : 'bois', robot: !!num(items.robot) };
  return [0, 1, 2].map((vi) => buildVariant(ctx, vi));
}

const API = { ITEMS, PROJECT_RULES: PP, SYSTEMS, AMBIANCES, defaults, itemsOf, design };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else root.SnugEngine = API;
})(typeof window !== 'undefined' ? window : globalThis);
