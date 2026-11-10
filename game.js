/* Sushi Spin Bar — a sushi restaurant management game.
 * Loop: pick ingredients from the queues → craft on the tray → MAKE → plate rides the belt → serve customers. */
(() => {
  'use strict';

  /* =========================================================
   * Data
   * ======================================================= */
  const INGREDIENTS = {
    rice: { name: 'Rice' }, salmon: { name: 'Salmon' }, tuna: { name: 'Tuna' }, shrimp: { name: 'Shrimp' },
    cucumber: { name: 'Cucumber' }, avocado: { name: 'Avocado' }, seaweed: { name: 'Nori' },
    roe: { name: 'Roe' }, spicy: { name: 'Spicy' },
  };

  const RECIPES = {
    salmon_nigiri:   { name: 'Salmon Nigiri',   ing: ['rice', 'salmon'],                         price: 6,  plate: '#e8505b' },
    tuna_nigiri:     { name: 'Tuna Nigiri',     ing: ['rice', 'tuna'],                           price: 6,  plate: '#3d7dd8' },
    cucumber_roll:   { name: 'Cucumber Roll',   ing: ['rice', 'cucumber', 'seaweed'],            price: 7,  plate: '#9b6ad6' },
    salmon_roll:     { name: 'Salmon Roll',     ing: ['rice', 'salmon', 'seaweed'],              price: 8,  plate: '#2fb380' },
    shrimp_nigiri:   { name: 'Shrimp Nigiri',   ing: ['rice', 'shrimp'],                         price: 7,  plate: '#f2b134' },
    california_roll: { name: 'California Roll', ing: ['rice', 'avocado', 'cucumber', 'seaweed'], price: 11, plate: '#ff8c42' },
    spicy_tuna_roll: { name: 'Spicy Tuna Roll', ing: ['rice', 'tuna', 'spicy', 'seaweed'],       price: 11, plate: '#d84a4a' },
    ikura_gunkan:    { name: 'Ikura Gunkan',    ing: ['rice', 'roe', 'seaweed'],                 price: 9,  plate: '#4bb3d6' },
  };
  const RECIPE_BY_KEY = {};
  for (const [id, r] of Object.entries(RECIPES)) RECIPE_BY_KEY[r.ing.slice().sort().join('+')] = id;

  const L1 = ['salmon_nigiri', 'tuna_nigiri', 'cucumber_roll'];
  const L2 = [...L1, 'salmon_roll'];
  const L3 = [...L2, 'shrimp_nigiri', 'california_roll'];
  const L4 = [...L3, 'spicy_tuna_roll'];
  const L5 = [...L4, 'ikura_gunkan'];
  const LEVELS = [
    { customers: 2, recipes: L1, maxQty: 2, maxTotal: 2, twoChance: 0,   patience: 1.5,  duration: 90,  target: 45,  refill: .9,  flow: 3.5 },
    { customers: 3, recipes: L2, maxQty: 3, maxTotal: 3, twoChance: .35, patience: 1.4,  duration: 100, target: 80,  refill: .75, flow: 3 },
    { customers: 4, recipes: L3, maxQty: 3, maxTotal: 4, twoChance: .4,  patience: 1.35, duration: 110, target: 120, refill: .6,  flow: 2.5 },
    { customers: 5, recipes: L4, maxQty: 3, maxTotal: 4, twoChance: .45, patience: 1.3,  duration: 120, target: 150, refill: .5,  flow: 2.2 },
    { customers: 5, recipes: L5, maxQty: 3, maxTotal: 5, twoChance: .5,  patience: 1.2,  duration: 120, target: 170, refill: .45, flow: 2 },
  ];
  function getLevel(n) {
    const base = LEVELS[Math.min(n, LEVELS.length) - 1];
    const extra = Math.max(0, n - LEVELS.length);
    const L = { ...base, patience: Math.max(.6, base.patience * Math.pow(.94, extra)), target: base.target + extra * 25 };
    L.ingredients = [...new Set(L.recipes.flatMap(id => RECIPES[id].ing))];
    L.newRecipes = n === 1 ? L.recipes.slice() : n <= LEVELS.length ? L.recipes.filter(r => !LEVELS[n - 2].recipes.includes(r)) : [];
    return L;
  }

  const CHARACTERS = [
    { id: 'hana',  name: 'Hana',  skin: '#ffdcc2', hair: '#3b2620', style: 'bob',      shirt: '#ff7aa8', acc: 'bow',      accColor: '#ff3d7f', trait: 1.15 },
    { id: 'kenji', name: 'Kenji', skin: '#f2c59e', hair: '#22222e', style: 'spiky',    shirt: '#3d8bfd', acc: 'headband', accColor: '#ff5a4e', trait: .85 },
    { id: 'mei',   name: 'Mei',   skin: '#ffe2cc', hair: '#6e3426', style: 'buns',     shirt: '#ffc145', acc: null,                            trait: 1.0 },
    { id: 'taro',  name: 'Taro',  skin: '#d9a073', hair: '#2b2b2b', style: 'short',    shirt: '#2fbf71', acc: 'glasses',  accColor: '#333',    trait: 1.05 },
    { id: 'yuki',  name: 'Yuki',  skin: '#fff0e3', hair: '#9fb3ff', style: 'long',     shirt: '#8e7dff', acc: 'flower',   accColor: '#ff8fb1', trait: 1.0 },
    { id: 'jiro',  name: 'Grandpa Jiro', skin: '#f0c8a0', hair: '#eeeeee', style: 'bald', shirt: '#8a6a4f', acc: 'mustache', trait: 1.25 },
    { id: 'sora',  name: 'Sora',  skin: '#c48a5c', hair: '#18181f', style: 'cap',      shirt: '#ff8c42', acc: 'cap',      accColor: '#2c6bed', trait: .85 },
    { id: 'rin',   name: 'Rin',   skin: '#ffd6b5', hair: '#e2574c', style: 'pigtails', shirt: '#4fc3c9', acc: null,                            trait: .95 },
    { id: 'aiko',  name: 'Aiko',  skin: '#8d5a3b', hair: '#20140e', style: 'long',     shirt: '#f25f8c', acc: 'glasses',  accColor: '#5b2333', trait: 1.0 },
    { id: 'ben',   name: 'Ben',   skin: '#ffdec4', hair: '#f2c14e', style: 'short',    shirt: '#6c5ce7', acc: null,                            trait: .9 },
    { id: 'kumi',  name: 'Kumi',  skin: '#a86b45', hair: '#3d2416', style: 'bob',      shirt: '#00b894', acc: 'flower',   accColor: '#ffd23f', trait: 1.05 },
    { id: 'hiro',  name: 'Hiro',  skin: '#f6cfa8', hair: '#5b3a29', style: 'spiky',    shirt: '#e84393', acc: 'glasses',  accColor: '#222',    trait: .95 },
  ];

  // Seat anchor = top-centre of the customer sprite (stage px).
  const SEAT_POS = [
    { x: 225, y: 124, side: 'top' }, { x: 118, y: 124, side: 'top' }, { x: 332, y: 124, side: 'top' },
    { x: 32, y: 290, side: 'left' }, { x: 418, y: 290, side: 'right' },
  ];
  const SEAT_SETS = { 2: [1, 2], 3: [1, 0, 2], 4: [1, 2, 3, 4], 5: [1, 0, 2, 3, 4] };

  const COUNTER = { x: 60, y: 206, w: 330, h: 274, r: 74 };
  const BELT = { x: 92, y: 238, w: 266, h: 210, r: 48 };
  const INNER = { x: 113, y: 259, w: 224, h: 168, r: 30 };
  const BELT_MID_Y = BELT.y + BELT.h / 2;
  const BELT_SPEED = 26;      // px / s
  const NSLOTS = 10;          // plate capacity of the belt
  const BOARD = { x: 225, y: 405 };
  const DROP_POINT = { x: 225, y: BELT.y + BELT.h };

  /* =========================================================
   * Helpers
   * ======================================================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => Math.floor(rand(a, b + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const retrigger = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const setText = (el, v) => { v = String(v); if (el.textContent !== v) el.textContent = v; };
  const miniIcon = t => `<span class="mi">${Art.ing(t)}</span>`;

  const stage = $('#stage');
  let SCALE = 1;
  function fit() {
    SCALE = Math.min(innerWidth / 450, innerHeight / 800);
    stage.style.transform = `translate(-50%, -50%) scale(${SCALE})`;
  }
  addEventListener('resize', fit); fit();
  function toStage(cx, cy) { const r = stage.getBoundingClientRect(); return { x: (cx - r.left) / SCALE, y: (cy - r.top) / SCALE }; }
  function centerOf(el) { const r = el.getBoundingClientRect(); return toStage(r.left + r.width / 2, r.top + r.height / 2); }

  /* =========================================================
   * Persistence
   * ======================================================= */
  const SAVE_KEY = 'sushiSpinBar.v1';
  const save = { unlocked: 1, stars: {}, muted: false };
  try { Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); } catch (e) { /* storage unavailable */ }
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* ignore */ } };

  /* =========================================================
   * Sound (tiny WebAudio synth, no assets)
   * ======================================================= */
  const Sound = {
    ctx: null, muted: !!save.muted,
    ensure() {
      if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    },
    tone(f, d = .12, type = 'sine', v = .12, f2 = null, delay = 0) {
      if (this.muted || !this.ctx) return;
      const c = this.ctx, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + .03);
    },
    pick() { this.tone(620, .08, 'triangle', .1, 900); },
    drop() { this.tone(500, .08, 'sine', .1, 340); },
    err() { this.tone(220, .16, 'square', .05, 150); this.tone(160, .2, 'square', .05, 110, .1); },
    chop() { this.tone(1100, .035, 'square', .035, 500); },
    make() { [523, 659, 784].forEach((f, i) => this.tone(f, .13, 'triangle', .1, null, i * .07)); },
    serve() { this.tone(700, .1, 'sine', .13, 1150); this.tone(1400, .08, 'triangle', .05, null, .06); },
    coin() { this.tone(988, .07, 'square', .05); this.tone(1319, .2, 'square', .05, null, .07); },
    happy() { [659, 784, 988, 1319].forEach((f, i) => this.tone(f, .14, 'triangle', .09, null, i * .08)); },
    angry() { this.tone(300, .35, 'sawtooth', .05, 140); },
    tick() { this.tone(1250, .03, 'square', .03); },
    win() { [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, .22, 'triangle', .1, null, i * .1)); },
    lose() { [392, 330, 262].forEach((f, i) => this.tone(f, .3, 'triangle', .09, null, i * .17)); },
  };

  /* =========================================================
   * Game state
   * ======================================================= */
  const G = {
    running: false, paused: false, session: 0, levelNum: 1, L: null,
    timeLeft: 0, score: 0, coins: 0, combo: 0, outcomes: [], served: 0, walkouts: 0, wasted: 0, made: 0,
    seats: [], queues: [], tray: [], making: false, slots: [], beltOffset: 0, selectedPlate: null,
    tutorial: -1, lastSec: 0, satBand: '',
  };
  let plateSeq = 0;

  // Game-time timers (they freeze while paused).
  let timers = [];
  const after = (sec, fn) => timers.push({ t: sec, fn });
  function runTimers(dt) {
    const due = [];
    timers = timers.filter(tm => { tm.t -= dt; if (tm.t <= 0) { due.push(tm.fn); return false; } return true; });
    due.forEach(f => f());
  }

  /* =========================================================
   * DOM refs + static icons
   * ======================================================= */
  const fxLayer = $('#fx'), beltLayer = $('#beltLayer'), seatLayer = $('#seatLayer'), bubbleLayer = $('#bubbleLayer');
  const chefEl = $('#chef'), boardEl = $('#board'), prepEl = $('#prep'), makeBtn = $('#btnMake'), trashBtn = $('#btnTrash');
  const slotEls = $$('.slot'), overlay = $('#overlay'), toastEl = $('#toast'), hintEl = $('#hint');
  const H = {
    level: $('#hLevel'), score: $('#hScore'), coins: $('#hCoins'), target: $('#hTarget'), time: $('#hTime'),
    timePill: $('#pTime'), coinPill: $('#pCoins'), sat: $('#hSat'), face: $('#hFace'),
  };
  $$('[data-icon]').forEach(el => { el.innerHTML = Art.icon(el.dataset.icon); });
  $$('.lantern').forEach(el => { el.innerHTML = Art.lantern(); });
  chefEl.innerHTML = Art.chef();
  const renderSoundBtn = () => { $('#btnSound').innerHTML = Art.icon(Sound.muted ? 'soundOff' : 'soundOn'); };
  renderSoundBtn();

  /* =========================================================
   * Counter + conveyor belt
   * ======================================================= */
  const rr = ({ x, y, w, h, r }) =>
    `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  const counterSvg = $('#counterSvg');
  counterSvg.innerHTML = `
    <defs>
      <linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eab97f"/><stop offset="1" stop-color="#c88a4f"/></linearGradient>
      <linearGradient id="gInner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7dcb0"/><stop offset="1" stop-color="#e8c08a"/></linearGradient>
      <linearGradient id="gBelt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e9ef"/><stop offset="1" stop-color="#c3ccd6"/></linearGradient>
      <pattern id="pPlank" width="60" height="21" patternUnits="userSpaceOnUse"><path d="M0 20.5 H60" stroke="#b77a43" stroke-opacity=".35"/><path d="M30 0 V20" stroke="#b77a43" stroke-opacity=".18"/></pattern>
    </defs>
    <path d="${rr({ ...COUNTER, y: COUNTER.y + 12 })}" fill="#000" opacity=".28"/>
    <path d="${rr(COUNTER)}" fill="url(#gWood)" stroke="#8a5528" stroke-width="5"/>
    <path d="${rr({ x: COUNTER.x + 6, y: COUNTER.y + 6, w: COUNTER.w - 12, h: COUNTER.h - 12, r: COUNTER.r - 6 })}" fill="none" stroke="#f9dcae" stroke-opacity=".6" stroke-width="2"/>
    <path d="${rr(BELT)}" fill="none" stroke="#3f4752" stroke-width="48"/>
    <path d="${rr(BELT)}" fill="none" stroke="url(#gBelt)" stroke-width="40"/>
    <path id="beltSlats" d="${rr(BELT)}" fill="none" stroke="#a9b4c0" stroke-width="38" stroke-dasharray="3 17"/>
    <path d="${rr({ x: BELT.x - 19, y: BELT.y - 19, w: BELT.w + 38, h: BELT.h + 38, r: BELT.r + 19 })}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
    <path d="${rr(INNER)}" fill="url(#gInner)" stroke="#8a5528" stroke-width="3"/>
    <path d="${rr(INNER)}" fill="url(#pPlank)"/>
    <ellipse cx="225" cy="${INNER.y + 10}" rx="70" ry="4" fill="#fff" opacity=".25"/>`;
  const beltPath = $('#beltSlats');
  const beltLen = beltPath.getTotalLength();

  function slotPos(i, offset = G.beltOffset) {
    const s = (((offset + i * beltLen / NSLOTS) % beltLen) + beltLen) % beltLen;
    return beltPath.getPointAtLength(s);
  }
  function updateBelt(dt) {
    G.beltOffset += BELT_SPEED * dt;
    beltPath.style.strokeDashoffset = -G.beltOffset;
    for (const p of G.slots) if (p && p !== 'reserved') positionPlate(p);
  }
  function positionPlate(p) {
    const pt = slotPos(p.slot);
    p.x = pt.x; p.y = pt.y;
    p.el.style.transform = `translate(${pt.x - 27}px, ${pt.y - 37}px)`;
    p.el.style.zIndex = pt.y < BELT_MID_Y ? 5 : 7;
  }
  function bestFreeSlot(lead) {
    let best = -1, bd = Infinity;
    for (let i = 0; i < NSLOTS; i++) {
      if (G.slots[i]) continue;
      const pt = slotPos(i, G.beltOffset + BELT_SPEED * lead);
      const d = Math.hypot(pt.x - DROP_POINT.x, pt.y - DROP_POINT.y);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  /* =========================================================
   * FX helpers
   * ======================================================= */
  function fly(html, from, to, { dur = 450, size = 44, arc = -50, delay = 0, scaleTo = 1 } = {}) {
    const el = document.createElement('div');
    el.className = 'flyer'; el.innerHTML = html;
    el.style.width = el.style.height = size + 'px';
    el.style.marginLeft = el.style.marginTop = (-size / 2) + 'px';
    el.style.transform = `translate(${from.x}px,${from.y}px)`;
    fxLayer.appendChild(el);
    const mx = (from.x + to.x) / 2, my = Math.min(from.y, to.y) + arc;
    const anim = el.animate([
      { transform: `translate(${from.x}px,${from.y}px) scale(1)` },
      { transform: `translate(${mx}px,${my}px) scale(${(1 + scaleTo) / 2 * 1.1})`, offset: .5 },
      { transform: `translate(${to.x}px,${to.y}px) scale(${scaleTo})` },
    ], { duration: dur, delay, easing: 'ease-in-out', fill: 'both' });
    return anim.finished.then(() => el.remove(), () => el.remove());
  }
  function floatText(html, p, cls = '') {
    const el = document.createElement('div');
    el.className = 'float ' + cls; el.innerHTML = html;
    el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
    fxLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
  const CONFETTI = ['#ff5e7e', '#ffd23f', '#3ec1d3', '#7bd389', '#a78bfa', '#ff8c42'];
  function burst(p, kind = 'confetti', n = 10) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.className = 'pt ' + kind;
      if (kind === 'heart') el.innerHTML = Art.icon('heart');
      else if (kind === 'star') el.innerHTML = Art.icon('sparkle');
      else el.style.background = pick(CONFETTI);
      fxLayer.appendChild(el);
      const a = rand(0, Math.PI * 2), d = rand(30, 85), dx = Math.cos(a) * d, dy = Math.sin(a) * d - 25;
      el.animate([
        { transform: `translate(${p.x}px,${p.y}px) scale(.3)`, opacity: 1 },
        { transform: `translate(${p.x + dx}px,${p.y + dy}px) scale(1) rotate(${rand(-200, 200)}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${p.x + dx * 1.15}px,${p.y + dy + 35}px) scale(.6) rotate(${rand(-300, 300)}deg)`, opacity: 0 },
      ], { duration: rand(650, 1050), easing: 'cubic-bezier(.2,.8,.3,1)' }).finished.then(() => el.remove(), () => el.remove());
    }
  }
  function poof(p) {
    const el = document.createElement('div');
    el.className = 'poof'; el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
    fxLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
  let toastTimer;
  function toast(msg, cls = '') {
    toastEl.innerHTML = msg; toastEl.className = 'show ' + cls;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.className = cls; }, 1700);
  }
  function banner(text) {
    const el = document.createElement('div');
    el.className = 'banner'; el.textContent = text;
    stage.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
  function coinsToHud(from, n) {
    const to = centerOf(H.coinPill.querySelector('.ic'));
    for (let i = 0; i < n; i++) {
      fly(Art.icon('coin'), { x: from.x + rand(-14, 14), y: from.y + rand(-10, 10) }, to, { dur: 650, delay: i * 70, size: 24, arc: -60, scaleTo: .8 })
        .then(() => retrigger(H.coinPill, 'bump'));
    }
  }
  let hintHTML = '';
  function setHint(html) { if (html !== hintHTML) { hintHTML = html; hintEl.innerHTML = html; } }

  /* =========================================================
   * Press / drag helper (works for mouse + touch)
   * ======================================================= */
  function pressable(el, o) {
    el.addEventListener('pointerdown', e => {
      if (!G.running || G.paused) return;
      if (e.button) return;
      e.preventDefault(); e.stopPropagation();
      Sound.ensure();
      const sx = e.clientX, sy = e.clientY;
      let ghost = null;
      const move = ev => {
        if (!ghost) {
          if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 9) return;
          const html = o.drag && o.drag(e);
          if (!html) return;
          ghost = document.createElement('div');
          ghost.className = 'ghost ' + (o.ghostClass || '');
          ghost.innerHTML = html;
          fxLayer.appendChild(ghost);
          o.onDragStart && o.onDragStart();
        }
        const p = toStage(ev.clientX, ev.clientY);
        ghost.style.transform = `translate(${p.x}px,${p.y}px) scale(1.1)`;
      };
      const up = ev => {
        removeEventListener('pointermove', move);
        removeEventListener('pointerup', up);
        removeEventListener('pointercancel', up);
        if (ghost) {
          ghost.remove();
          o.onDrop && o.onDrop(document.elementFromPoint(ev.clientX, ev.clientY));
        } else if (ev.type === 'pointerup') {
          o.onTap && o.onTap(e);
        }
      };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
      addEventListener('pointercancel', up);
    });
  }

  /* =========================================================
   * Ingredient queues
   * ======================================================= */
  // How many of each ingredient the waiting customers still need vs. how many are already in view.
  function stock() {
    const demand = {}, visible = {};
    for (const t of G.L.ingredients) { demand[t] = 0; visible[t] = 0; }
    for (const s of G.seats) {
      const c = s.c;
      if (!c || (c.state !== 'waiting' && c.state !== 'arriving')) continue;
      for (const o of c.order) for (const t of RECIPES[o.id].ing) if (t in demand) demand[t] += o.left;
    }
    for (const q of G.queues) for (const it of q.items) if (it.type in visible) visible[it.type]++;
    for (const t of G.tray) if (t in visible) visible[t]++;
    return { demand, visible };
  }

  // New stock favours whatever the current orders are short of (capped so rice doesn't flood every queue).
  function genIngredient() {
    const pool = G.L.ingredients;
    const { demand, visible } = stock();
    const weights = pool.map(t => .6 + Math.min(3, Math.max(0, demand[t] - visible[t])) * 2.5 + (demand[t] > 0 ? .6 : 0));
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  // The queues slowly roll on their own: a surplus item drops off the top and fresh stock arrives below.
  function flowQueues(dt) {
    G.flowT -= dt;
    if (G.flowT > 0) return;
    G.flowT = G.L.flow;
    const { demand, visible } = stock();
    let best = null, bestSurplus = 0;
    for (const q of G.queues) {
      if (q.items.length < 3) continue;
      const t = q.items[0].type, surplus = visible[t] - demand[t];
      if (surplus > bestSurplus || (surplus === bestSurplus && best && Math.random() < .5)) { best = q; bestSurplus = surplus; }
    }
    if (!best) return;
    const it = best.items.shift();
    it.el.style.transform = 'translateY(-46px) scale(.8)';
    it.el.style.opacity = '0';
    setTimeout(() => it.el.remove(), 300);
    layoutQueue(best);
    pushItem(best);
  }

  function buildQueues() {
    const wrap = $('#queues');
    wrap.innerHTML = '';
    G.queues = [];
    for (let i = 0; i < 5; i++) {
      const col = document.createElement('div');
      col.className = 'qcol';
      wrap.appendChild(col);
      const q = { i, items: [], col };
      G.queues.push(q);
      pressable(col, {
        onTap: e => takeFromQueue(q, itemIndex(q, e)),
        drag: e => { const it = q.items[itemIndex(q, e)]; q.dragIdx = itemIndex(q, e); return it && Art.ing(it.type); },
        ghostClass: 'ing',
        onDrop: t => { if (t && t.closest('#prep')) takeFromQueue(q, q.dragIdx || 0); },
      });
    }
    for (const q of G.queues) for (let k = 0; k < 4; k++) pushItem(q, true);
  }

  function pushItem(q, instant) {
    const type = genIngredient();
    const el = document.createElement('div');
    el.className = 'qitem';
    el.innerHTML = Art.ing(type) + `<span class="qname">${INGREDIENTS[type].name}</span>`;
    q.col.appendChild(el);
    q.items.push({ type, el });
    if (!instant) {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = `translateY(${6 + (q.items.length) * 52 + 20}px)`;
      void el.offsetWidth;
      el.style.transition = '';
      el.style.opacity = '';
    }
    layoutQueue(q);
  }
  function layoutQueue(q) {
    q.items.forEach((it, k) => {
      it.el.style.transform = `translateY(${6 + k * 52}px)`;
      it.el.classList.toggle('top', k === 0);
    });
  }

  // Any visible ingredient can be picked; the ones below slide up to fill the gap.
  function itemIndex(q, e) {
    const el = e && e.target && e.target.closest && e.target.closest('.qitem');
    const k = el ? q.items.findIndex(it => it.el === el) : -1;
    return k < 0 ? 0 : k;
  }
  function takeFromQueue(q, idx = 0) {
    if (!G.running || G.paused) return;
    const it = q.items[idx];
    if (!it) return;
    if (G.tray.length >= 4) {
      toast('Tray is full! Press MAKE or clear it.', 'warn');
      retrigger(prepEl, 'shake'); Sound.err();
      return;
    }
    q.items.splice(idx, 1);
    const from = centerOf(it.el);
    it.el.remove();
    layoutQueue(q);
    const ti = G.tray.length;
    G.tray.push(it.type);
    renderTray(ti);
    fly(Art.ing(it.type), from, centerOf(slotEls[ti]), { dur: 220, size: 40, arc: -30 });
    Sound.pick();
    const sess = G.session;
    after(G.L.refill, () => { if (sess === G.session) pushItem(q); });
  }

  /* =========================================================
   * Prep tray + crafting
   * ======================================================= */
  const matchRecipe = tray => RECIPE_BY_KEY[tray.slice().sort().join('+')] || null;

  function renderTray(landIdx = -1) {
    slotEls.forEach((s, i) => {
      const t = G.tray[i];
      s.innerHTML = t ? `<div class="sitem${i === landIdx ? ' land' : ''}">${Art.ing(t)}</div>` : '';
      s.classList.toggle('filled', !!t);
    });
    const rid = G.tray.length ? matchRecipe(G.tray) : null;
    makeBtn.classList.toggle('ready', !!rid);
    makeBtn.querySelector('.mk-icon').innerHTML = rid ? Art.sushi(rid) : '';
    makeBtn.querySelector('.mk-name').textContent = rid ? RECIPES[rid].name : '';
  }

  slotEls.forEach((s, i) => s.addEventListener('click', () => {
    if (!G.running || G.paused || !G.tray[i]) return;
    poof(centerOf(s));
    G.tray.splice(i, 1);
    renderTray(); Sound.drop();
  }));

  function clearTray() {
    if (!G.running || G.paused || !G.tray.length) return;
    slotEls.forEach((s, i) => { if (G.tray[i]) poof(centerOf(s)); });
    G.tray = [];
    renderTray(); Sound.drop();
  }

  function setChef(state, dur = 0) {
    chefEl.className = state === 'idle' ? '' : state;
    const token = (G.chefToken = (G.chefToken || 0) + 1);
    if (dur) after(dur, () => { if (G.chefToken === token) chefEl.className = ''; });
  }

  function wrongRecipe() {
    retrigger(prepEl, 'shake');
    setChef('oops', .7);
    Sound.err();
    G.combo = 0;
    const tip = G.tray.length < 2 ? 'Every sushi needs at least 2 ingredients.' : 'That combo isn’t a recipe! Tap 📖 for recipes.';
    toast(tip, 'warn');
  }

  function make() {
    if (!G.running || G.paused || G.making) return;
    if (!G.tray.length) { toast('Tap ingredients in the queues first!'); Sound.err(); return; }
    const rid = matchRecipe(G.tray);
    if (!rid) { wrongRecipe(); return; }
    const slot = bestFreeSlot(1.7);
    if (slot < 0) {
      toast('Conveyor belt is full! Serve or trash a plate.', 'warn');
      retrigger(prepEl, 'shake'); Sound.err();
      return;
    }
    G.slots[slot] = 'reserved';
    G.making = true;
    makeBtn.classList.add('busy');
    const sess = G.session;
    const items = G.tray.slice();
    items.forEach((t, i) => fly(Art.ing(t), centerOf(slotEls[i]), BOARD, { dur: 280, delay: i * 60, size: 36, arc: -40, scaleTo: .5 }));
    G.tray = [];
    renderTray();
    setChef('cooking');
    for (let k = 0; k < 5; k++) after(.25 + k * .13, () => Sound.chop());
    after(.9, () => {
      setChef('happy', .7);
      boardEl.innerHTML = `<div class="made">${Art.sushi(rid)}</div>`;
      burst({ x: BOARD.x, y: BOARD.y - 8 }, 'star', 6);
      Sound.make();
    });
    after(1.25, () => {
      boardEl.innerHTML = '';
      G.making = false;
      makeBtn.classList.remove('busy');
      G.made++;
      const to = slotPos(slot, G.beltOffset + BELT_SPEED * .45);
      fly(plateHTML(rid), { x: BOARD.x, y: BOARD.y - 6 }, { x: to.x, y: to.y - 10 }, { dur: 450, size: 54, arc: -30 }).then(() => {
        if (sess !== G.session) return;
        placePlate(slot, rid);
        Sound.drop();
      });
    });
  }

  makeBtn.addEventListener('click', () => { Sound.ensure(); make(); });
  $('#btnClear').addEventListener('click', clearTray);

  /* =========================================================
   * Plates on the belt
   * ======================================================= */
  const plateHTML = rid => `<div class="pl-inner"><div class="pl-dish">${Art.plate(RECIPES[rid].plate)}</div><div class="pl-sushi">${Art.sushi(rid)}</div></div>`;

  function placePlate(slot, rid) {
    const el = document.createElement('div');
    el.className = 'plate pop';
    el.innerHTML = plateHTML(rid);
    beltLayer.appendChild(el);
    const plate = { id: ++plateSeq, rid, slot, el, x: 0, y: 0 };
    G.slots[slot] = plate;
    positionPlate(plate);
    setTimeout(() => el.classList.remove('pop'), 400);
    pressable(el, {
      onTap: () => selectPlate(plate),
      drag: () => plateHTML(rid),
      onDragStart: () => { selectPlate(plate, true); el.classList.add('dragging'); },
      onDrop: t => { el.classList.remove('dragging'); dropPlate(plate, t); },
    });
  }
  const onBelt = p => p && G.slots[p.slot] === p;

  function selectPlate(plate, force) {
    if (!onBelt(plate)) return;
    if (G.selectedPlate === plate && !force) { deselect(); return; }
    deselect();
    G.selectedPlate = plate;
    plate.el.classList.add('selected');
    trashBtn.classList.add('armed');
    Sound.pick();
    if (!G.seats.some(s => wantsPlate(s, plate))) toast(`Nobody is waiting for ${RECIPES[plate.rid].name} right now.`);
  }
  function deselect() {
    if (G.selectedPlate) G.selectedPlate.el.classList.remove('selected');
    G.selectedPlate = null;
    trashBtn.classList.remove('armed');
  }
  function removePlate(plate) {
    if (G.selectedPlate === plate) deselect();
    if (G.slots[plate.slot] === plate) G.slots[plate.slot] = null;
    plate.el.remove();
  }
  function trashPlate(plate) {
    if (!onBelt(plate)) return;
    poof({ x: plate.x, y: plate.y - 10 });
    fly(plateHTML(plate.rid), { x: plate.x, y: plate.y - 10 }, centerOf(trashBtn), { dur: 380, size: 54, arc: -40, scaleTo: .3 });
    removePlate(plate);
    G.wasted++;
    Sound.drop();
  }
  function dropPlate(plate, target) {
    if (!onBelt(plate)) return;
    const seat = target && seatFromEl(target);
    if (seat) serve(plate, seat);
    else if (target && target.closest('#btnTrash')) trashPlate(plate);
  }

  trashBtn.addEventListener('click', () => {
    if (!G.running || G.paused) return;
    if (G.selectedPlate) trashPlate(G.selectedPlate);
    else toast('Select a plate on the belt first, then tap the bin to throw it away.');
  });
  $('#bg').addEventListener('pointerdown', deselect);

  /* =========================================================
   * Customers
   * ======================================================= */
  function buildSeats() {
    seatLayer.innerHTML = '';
    bubbleLayer.innerHTML = '';
    const set = SEAT_SETS[clamp(G.L.customers, 2, 5)];
    G.seats = set.map((si, k) => {
      const pos = SEAT_POS[si];
      const el = document.createElement('div');
      el.className = `customer ${pos.side}`;
      el.style.left = (pos.x - 48) + 'px';
      el.style.top = pos.y + 'px';
      const bub = document.createElement('div');
      bub.className = 'bubble hidden';
      seatLayer.appendChild(el);
      bubbleLayer.appendChild(bub);
      const seat = { k, pos, el, bub, c: null, respawn: .5 + k * 1.4, lastId: null, pbar: null };
      el.addEventListener('click', () => onSeatTap(seat));
      bub.addEventListener('click', () => onSeatTap(seat));
      return seat;
    });
  }
  const seatFromEl = el => {
    const t = el.closest && el.closest('.customer, .bubble');
    return t ? G.seats.find(s => s.el === t || s.bub === t) : null;
  };
  const headPos = seat => ({ x: seat.pos.x, y: seat.pos.y + 45 });

  function makeOrder() {
    const L = G.L;
    const types = (Math.random() < L.twoChance && L.recipes.length > 1) ? 2 : 1;
    const ids = shuffle(L.recipes).slice(0, types);
    let budget = L.maxTotal;
    return ids.map((id, i) => {
      const remainingTypes = ids.length - i - 1;
      const qty = clamp(randi(1, L.maxQty), 1, budget - remainingTypes);
      budget -= qty;
      return { id, qty, left: qty, pending: 0 };
    });
  }

  function spawnCustomer(seat) {
    const busy = new Set(G.seats.filter(s => s.c).map(s => s.c.ch.id));
    let pool = CHARACTERS.filter(c => !busy.has(c.id) && c.id !== seat.lastId);
    if (!pool.length) pool = CHARACTERS;
    const ch = pick(pool);
    const order = makeOrder();
    const n = order.reduce((a, o) => a + o.qty, 0);
    const maxP = (20 + n * 11) * G.L.patience * ch.trait;
    const c = { ch, order, maxP, p: maxP, happy: rand(84, 96), state: 'arriving', mood: '', joyT: 0 };
    seat.c = c;
    seat.lastId = ch.id;
    seat.el.className = `customer ${seat.pos.side} arriving`;
    setMood(seat, 'happy');
    renderBubble(seat);
    seat.bub.classList.add('hidden');
    const sess = G.session;
    after(.55, () => {
      if (sess !== G.session || seat.c !== c) return;
      c.state = 'waiting';
      seat.el.classList.remove('arriving');
      seat.bub.classList.remove('hidden');
      placeBubble(seat);
    });
  }

  function setMood(seat, mood) {
    const c = seat.c;
    if (!c || c.mood === mood) return;
    c.mood = mood;
    seat.el.innerHTML = `<div class="cbody">${Art.character(c.ch, mood)}</div>`;
  }
  function moodFor(c) {
    if (c.happy > 68) return 'happy';
    if (c.happy > 45) return 'neutral';
    if (c.happy > 25) return 'worried';
    return 'angry';
  }

  function renderBubble(seat, popIdx = -1) {
    const c = seat.c;
    seat.bub.innerHTML =
      `<div class="lines">${c.order.map((o, i) => `
        <div class="line${o.left === 0 ? ' done' : ''}${i === popIdx ? ' pop' : ''}" data-i="${i}">
          <div class="bsushi">${Art.sushi(o.id)}</div><b>${o.left === 0 ? '✓' : '×' + o.left}</b>
        </div>`).join('')}</div>
       <div class="pbar"><span></span></div>`;
    seat.pbar = seat.bub.querySelector('.pbar span');
    updatePatienceBar(seat);
    placeBubble(seat);
  }
  function placeBubble(seat) {
    const w = seat.bub.offsetWidth, h = seat.bub.offsetHeight;
    const left = clamp(seat.pos.x - w / 2, 4, 446 - w);
    seat.bub.style.left = left + 'px';
    seat.bub.style.top = (seat.pos.y + 6 - h) + 'px';
    seat.bub.style.setProperty('--tail', clamp(seat.pos.x - left, 16, w - 16) + 'px');
  }
  function updatePatienceBar(seat) {
    const c = seat.c;
    if (!c || !seat.pbar) return;
    const r = clamp(c.p / c.maxP, 0, 1);
    seat.pbar.style.width = (r * 100).toFixed(1) + '%';
    const cls = r > .5 ? '' : r > .25 ? 'mid' : 'low';
    if (seat.pbar.className !== cls) seat.pbar.className = cls;
  }

  const wantsPlate = (seat, plate) => {
    const c = seat.c;
    return !!(c && c.state === 'waiting' && c.order.some(o => o.id === plate.rid && o.left - o.pending > 0));
  };

  function onSeatTap(seat) {
    if (!G.running || G.paused) return;
    if (G.selectedPlate) serve(G.selectedPlate, seat);
    else if (seat.c && seat.c.state === 'waiting') toast('Tap a sushi plate on the belt first, then tap the customer.');
  }

  function serve(plate, seat) {
    if (!onBelt(plate)) return;
    const c = seat.c;
    if (!c || c.state !== 'waiting') { deselect(); return; }
    const idx = c.order.findIndex(o => o.id === plate.rid && o.left - o.pending > 0);
    if (idx < 0) {
      retrigger(seat.bub, 'shake');
      floatText('✗', headPos(seat), 'bad');
      toast(`${c.ch.name} didn’t order ${RECIPES[plate.rid].name}!`, 'warn');
      Sound.err();
      G.combo = 0;
      return;
    }
    const line = c.order[idx];
    line.pending++;
    const from = { x: plate.x, y: plate.y - 10 };
    const lineEl = seat.bub.querySelector(`.line[data-i="${idx}"]`);
    const to = lineEl ? centerOf(lineEl) : headPos(seat);
    removePlate(plate);
    Sound.pick();
    const sess = G.session;
    fly(plateHTML(plate.rid), from, to, { dur: 420, size: 54, arc: -70, scaleTo: .7 }).then(() => {
      if (sess !== G.session) return;
      line.pending = Math.max(0, line.pending - 1);
      if (seat.c !== c || c.state !== 'waiting') return;
      line.left--;
      c.happy = clamp(c.happy + 12, 0, 100);
      c.p = Math.min(c.maxP, c.p + c.maxP * .15);
      G.combo++;
      const pts = 10 + 5 * Math.min(G.combo - 1, 8);
      G.score += pts;
      const hp = headPos(seat);
      floatText('+' + pts, { x: hp.x, y: hp.y - 10 });
      if (G.combo >= 2) floatText(`Combo ×${G.combo}!`, { x: hp.x, y: hp.y + 22 }, 'combo');
      c.joyT = .8;
      c.mood = '';
      setMood(seat, 'joy');
      retrigger(seat.el, 'yum');
      after(.5, () => seat.el.classList.remove('yum'));
      burst(hp, 'heart', 4);
      Sound.serve();
      if (G.tutorial === 2) G.tutorial = 3;
      if (c.order.every(o => o.left === 0)) completeOrder(seat);
      else renderBubble(seat, idx);
    });
  }

  function completeOrder(seat) {
    const c = seat.c;
    c.state = 'done';
    const base = c.order.reduce((a, o) => a + RECIPES[o.id].price * o.qty, 0);
    const tip = Math.round(base * (c.happy / 100) * .6);
    const earned = base + tip;
    G.coins += earned;
    G.score += 25 + Math.round(c.happy / 2);
    G.outcomes.push(Math.round(c.happy));
    G.served++;
    const hp = headPos(seat);
    seat.bub.innerHTML = `<div class="thanks">Arigatō! ♥<span>+${tip} tip</span></div>`;
    placeBubble(seat);
    c.joyT = 99;
    setMood(seat, 'joy');
    seat.el.classList.remove('yum', 'impatient');
    seat.el.classList.add('celebrate');
    burst(hp, 'confetti', 18);
    burst(hp, 'heart', 5);
    floatText(`${Art.icon('coin')}+${earned}`, { x: hp.x, y: hp.y - 34 }, 'coin');
    coinsToHud(hp, Math.min(6, 2 + Math.floor(earned / 8)));
    Sound.happy();
    after(.3, () => Sound.coin());
    after(1.3, () => {
      seat.bub.classList.add('hidden');
      seat.el.classList.remove('celebrate');
      seat.el.classList.add('leaving');
    });
    after(1.9, () => clearSeat(seat));
  }

  function customerLeaves(seat) {
    const c = seat.c;
    c.state = 'angry';
    c.happy = 0;
    setMood(seat, 'angry');
    seat.bub.classList.add('hidden');
    seat.el.classList.remove('impatient', 'yum');
    seat.el.classList.add('storm');
    floatText('Hmph! 💢', headPos(seat), 'bad');
    toast(`${c.ch.name} got tired of waiting and left…`, 'warn');
    Sound.angry();
    G.outcomes.push(0);
    G.walkouts++;
    G.combo = 0;
    after(.9, () => { seat.el.classList.remove('storm'); seat.el.classList.add('leaving'); });
    after(1.5, () => clearSeat(seat));
  }

  function clearSeat(seat) {
    seat.c = null;
    seat.pbar = null;
    seat.el.innerHTML = '';
    seat.el.className = `customer ${seat.pos.side}`;
    seat.bub.className = 'bubble hidden';
    seat.respawn = rand(1.2, 3.2);
  }

  function updateSeats(dt) {
    for (const seat of G.seats) {
      const c = seat.c;
      seat.bub.classList.toggle('wants', !!(G.selectedPlate && wantsPlate(seat, G.selectedPlate)));
      if (!c) {
        seat.respawn -= dt;
        if (seat.respawn <= 0 && G.timeLeft > 8) spawnCustomer(seat);
        continue;
      }
      if (c.state !== 'waiting') continue;
      c.p -= dt;
      c.happy = clamp(c.happy - dt * (70 / c.maxP), 0, 100);
      updatePatienceBar(seat);
      const ratio = c.p / c.maxP;
      seat.el.classList.toggle('impatient', ratio < .25);
      if (c.joyT > 0) c.joyT -= dt;
      else setMood(seat, moodFor(c));
      if (c.p <= 0) customerLeaves(seat);
    }
  }

  /* =========================================================
   * HUD
   * ======================================================= */
  const satisfaction = () => G.outcomes.length ? Math.round(G.outcomes.reduce((a, b) => a + b, 0) / G.outcomes.length) : 100;
  function updateHUD() {
    setText(H.level, G.levelNum);
    setText(H.score, G.score);
    setText(H.coins, G.coins);
    setText(H.target, '/' + G.L.target);
    const t = Math.max(0, Math.ceil(G.timeLeft));
    setText(H.time, `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`);
    H.timePill.classList.toggle('urgent', G.running && G.timeLeft <= 10);
    H.coinPill.classList.toggle('goal', G.coins >= G.L.target);
    const sat = satisfaction();
    H.sat.style.width = sat + '%';
    const band = sat >= 70 ? 'good' : sat >= 40 ? 'ok' : 'bad';
    if (band !== G.satBand) {
      G.satBand = band;
      H.sat.className = band === 'good' ? '' : band;
      H.face.innerHTML = Art.icon(band === 'good' ? 'faceGood' : band === 'ok' ? 'faceOk' : 'faceBad');
    }
  }

  /* =========================================================
   * Tutorial hints (level 1)
   * ======================================================= */
  function updateTutorial() {
    if (G.tutorial < 0) return;
    if (G.tutorial === 0) {
      if (G.tray.length) { G.tutorial = 1; return; }
      const s = G.seats.find(s => s.c && s.c.state === 'waiting');
      if (!s) { setHint('Customers are arriving…'); return; }
      const o = s.c.order.find(o => o.left > 0);
      if (!o) return;
      const r = RECIPES[o.id];
      setHint(`${s.c.ch.name} wants <b>${r.name}</b> = ${r.ing.map(miniIcon).join(' + ')}<br>Tap those ingredients in the queues below`);
    } else if (G.tutorial === 1) {
      if (G.made > 0) { G.tutorial = 2; return; }
      const rid = G.tray.length ? matchRecipe(G.tray) : null;
      setHint(rid ? `That’s <b>${RECIPES[rid].name}</b>! Press the green <b>MAKE</b> button` : 'Collect the rest of the ingredients for the recipe…');
    } else if (G.tutorial === 2) {
      setHint('Tap the sushi plate on the belt, then tap the customer<br>(or drag the plate onto them)');
    } else {
      setHint('Great job! Keep every customer happy ♥');
      G.tutorial = -1;
      after(2.5, () => setHint(''));
    }
  }

  /* =========================================================
   * Level flow
   * ======================================================= */
  function resetBoard() {
    G.session++;
    timers = [];
    fxLayer.innerHTML = '';
    $$('.banner').forEach(b => b.remove());
    $$('.plate', beltLayer).forEach(e => e.remove());
    G.slots = new Array(NSLOTS).fill(null);
    boardEl.innerHTML = '';
    deselect();
    setChef('idle');
    makeBtn.classList.remove('busy');
    setHint('');
  }

  function startLevel(n) {
    resetBoard();
    G.running = false; G.paused = false;
    stage.classList.remove('paused');
    G.levelNum = n;
    G.L = getLevel(n);
    Object.assign(G, {
      timeLeft: G.L.duration, score: 0, coins: 0, combo: 0, outcomes: [], served: 0, walkouts: 0, wasted: 0, made: 0,
      tray: [], making: false, selectedPlate: null, lastSec: 0, satBand: '', flowT: 4,
    });
    buildSeats();
    buildQueues();
    renderTray();
    updateHUD();
    G.tutorial = n === 1 ? 0 : -1;
    showIntro();
  }

  function begin() {
    hideOverlay();
    G.running = true; G.paused = false;
    lastT = performance.now();
    Sound.ensure();
    banner('Irasshaimase!');
  }

  function endLevel() {
    G.running = false;
    G.timeLeft = 0;
    deselect();
    setHint('');
    updateHUD();
    const L = G.L;
    const passed = G.coins >= L.target;
    const stars = passed ? (G.coins >= L.target * 1.8 ? 3 : G.coins >= L.target * 1.4 ? 2 : 1) : 0;
    if (passed) {
      save.unlocked = Math.max(save.unlocked, G.levelNum + 1);
      save.stars[G.levelNum] = Math.max(save.stars[G.levelNum] || 0, stars);
      persist();
    }
    banner('Time’s up!');
    const sess = G.session;
    setTimeout(() => {
      if (sess !== G.session) return;
      passed ? Sound.win() : Sound.lose();
      showResults(passed, stars);
    }, 1300);
  }

  /* =========================================================
   * Pause
   * ======================================================= */
  let frozen = [];
  function pauseGame(screen = 'pause') {
    if (!G.running || G.paused) return;
    G.paused = true;
    stage.classList.add('paused');
    if (document.getAnimations) {
      frozen = document.getAnimations().filter(a => a.playState === 'running' && !(window.CSSAnimation && a instanceof CSSAnimation) && !(window.CSSTransition && a instanceof CSSTransition));
      frozen.forEach(a => a.pause());
    }
    screen === 'book' ? showBook(true) : showPause();
  }
  function resume() {
    if (!G.paused) return;
    G.paused = false;
    stage.classList.remove('paused');
    frozen.forEach(a => { try { a.play(); } catch (e) { /* ignore */ } });
    frozen = [];
    lastT = performance.now();
    hideOverlay();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });

  /* =========================================================
   * Overlays / screens
   * ======================================================= */
  function showOverlay(html) { overlay.innerHTML = html; overlay.classList.add('show'); }
  function hideOverlay() { overlay.classList.remove('show'); overlay.innerHTML = ''; }

  const recipeRow = (id, isNew) => {
    const r = RECIPES[id];
    return `<div class="rrow">${isNew ? '<span class="new">NEW</span>' : ''}
      <div class="rs">${Art.sushi(id)}</div>
      <div class="rinfo"><b>${r.name}</b><div class="ring">${r.ing.map(t => `<span class="ri" title="${INGREDIENTS[t].name}">${Art.ing(t)}</span>`).join('<i>+</i>')}</div></div>
      <div class="rprice">${Art.icon('coin')}${r.price}</div></div>`;
  };
  const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function showMenu() {
    resetBoard();
    G.running = false; G.paused = false;
    stage.classList.remove('paused');
    const maxShown = Math.max(5, save.unlocked);
    const chips = [];
    for (let i = 1; i <= maxShown; i++) {
      const locked = i > save.unlocked, st = save.stars[i] || 0;
      chips.push(locked
        ? `<button class="lchip locked" disabled>${i}<i class="lk">${Art.icon('lock')}</i></button>`
        : `<button class="lchip${i === save.unlocked ? ' current' : ''}" data-act="level" data-level="${i}">${i}
             <span class="st">${[1, 2, 3].map(k => `<i>${Art.icon(k <= st ? 'star' : 'starEmpty')}</i>`).join('')}</span></button>`);
    }
    showOverlay(`<div class="card menu">
      <div class="logo"><span class="l1">Sushi Spin</span><span class="l2">BAR</span></div>
      <div class="menu-art">
        <div class="msushi" style="left:22px;top:30px">${Art.sushi('salmon_nigiri')}</div>
        <div class="msushi" style="right:22px;top:20px;animation-delay:-1s">${Art.sushi('california_roll')}</div>
        <div class="msushi" style="left:52px;top:104px;animation-delay:-.5s">${Art.sushi('ikura_gunkan')}</div>
        <div class="msushi" style="right:50px;top:100px;animation-delay:-1.5s">${Art.sushi('tuna_nigiri')}</div>
        <div class="mchef">${Art.chef()}</div>
      </div>
      <button class="btn big green block" data-act="level" data-level="${save.unlocked}">▶ Play Level ${save.unlocked}</button>
      <div class="levels">${chips.join('')}</div>
      <div class="btn-row"><button class="btn blue" data-act="how">How to play</button><button class="btn" data-act="book-menu">Recipes</button></div>
    </div>`);
  }

  function showHow() {
    showOverlay(`<div class="card">
      <h2>How to Play</h2>
      <div class="how">
        <div class="step"><span class="num">1</span><div>Read each customer’s <b>order bubble</b>: which sushi and how many.</div></div>
        <div class="step"><span class="num">2</span><div>Tap (or drag) an <b>ingredient</b> in the queues to put it on your tray. Everything below slides up and fresh stock arrives at the bottom.</div></div>
        <div class="step"><span class="num">3</span><div>When the tray matches a recipe the <b>MAKE</b> button turns green. Tap it and the chef rolls the sushi onto the belt.</div></div>
        <div class="step"><span class="num">4</span><div>Tap a <b>plate</b> on the belt, then tap the customer who ordered it, or drag it onto them.</div></div>
        <div class="step"><span class="num">5</span><div>Finish whole orders fast for <b>coins + tips</b>. Patience bars run down, and an unhappy customer walks out!</div></div>
        <div class="step"><span class="num">6</span><div>Wrong ingredient? Tap a tray slot to remove it, or ✕ to clear. Unwanted plates go in the <b>bin</b>.</div></div>
      </div>
      <p class="kbd">Keyboard: 1–5 take ingredient · Space make · Backspace clear · Esc pause</p>
      <button class="btn green block" data-act="menu">Got it!</button>
    </div>`);
  }

  function showIntro() {
    const L = G.L;
    showOverlay(`<div class="card">
      <h2>Level ${G.levelNum}</h2>
      <div class="stats">
        <div class="stat"><i class="ic">${Art.icon('person')}</i><b>${L.customers}</b><small>customers</small></div>
        <div class="stat"><i class="ic">${Art.icon('clock')}</i><b>${fmtTime(L.duration)}</b><small>time</small></div>
        <div class="stat"><i class="ic">${Art.icon('coin')}</i><b>${L.target}</b><small>coin goal</small></div>
      </div>
      <h3>Today’s menu</h3>
      <div class="recipes">${L.recipes.map(id => recipeRow(id, L.newRecipes.includes(id) && G.levelNum > 1)).join('')}</div>
      <div class="btn-row"><button class="btn red" data-act="menu">Menu</button><button class="btn big green" data-act="start">Start!</button></div>
    </div>`);
  }

  let bookFrom = 'resume';
  function showBook(fromGame) {
    bookFrom = fromGame === true ? 'resume' : fromGame;
    const list = G.L && bookFrom !== 'menu' ? G.L.recipes : Object.keys(RECIPES);
    showOverlay(`<div class="card">
      <h2>Recipe Book</h2>
      <p>Put these ingredients on the tray (any order), then press MAKE.</p>
      <div class="recipes">${list.map(id => recipeRow(id, false)).join('')}</div>
      <button class="btn green block" data-act="book-close">${bookFrom === 'menu' ? 'Back' : 'Back to the kitchen'}</button>
    </div>`);
  }

  function showPause() {
    showOverlay(`<div class="card">
      <h2>Paused</h2>
      <p>Your customers will wait… for now.</p>
      <button class="btn big green block" data-act="resume">▶ Resume</button>
      <div class="btn-row">
        <button class="btn" data-act="book-pause">Recipes</button>
        <button class="btn blue" data-act="mute">${Sound.muted ? 'Sound: Off' : 'Sound: On'}</button>
      </div>
      <div class="btn-row"><button class="btn red" data-act="restart">Restart</button><button class="btn red" data-act="menu">Quit</button></div>
    </div>`);
  }

  function showResults(passed, stars) {
    const sat = satisfaction();
    showOverlay(`<div class="card">
      <h2>${passed ? 'Level Complete!' : 'Goal Missed'}</h2>
      <div class="big-stars">${[1, 2, 3].map(k => `<i>${Art.icon(k <= stars ? 'star' : 'starEmpty')}</i>`).join('')}</div>
      <p>${passed ? (stars === 3 ? 'Legendary service! The whole street is talking about you.' : 'The customers loved it. Otsukaresama!') : `You needed ${G.L.target} coins. Faster plates mean bigger tips!`}</p>
      <div class="res-rows">
        <div><span>Coins earned</span><b>${G.coins} / ${G.L.target}</b></div>
        <div><span>Score</span><b>${G.score}</b></div>
        <div><span>Orders completed</span><b>${G.served}</b></div>
        <div><span>Customers who walked out</span><b>${G.walkouts}</b></div>
        <div><span>Satisfaction</span><b>${sat}%</b></div>
        <div><span>Plates wasted</span><b>${G.wasted}</b></div>
      </div>
      <div class="btn-row">
        <button class="btn red" data-act="menu">Menu</button>
        <button class="btn blue" data-act="retry">Retry</button>
        ${passed ? `<button class="btn green" data-act="next">Next ▶</button>` : ''}
      </div>
    </div>`);
    if (passed) setTimeout(() => burst({ x: 225, y: 230 }, 'confetti', 30), 300);
  }

  const ACTIONS = {
    level: d => startLevel(+d.level),
    start: () => begin(),
    how: () => showHow(),
    menu: () => showMenu(),
    resume: () => resume(),
    restart: () => startLevel(G.levelNum),
    retry: () => startLevel(G.levelNum),
    next: () => startLevel(G.levelNum + 1),
    mute: () => { toggleMute(); showPause(); },
    'book-pause': () => showBook('pause'),
    'book-menu': () => showBook('menu'),
    'book-close': () => (bookFrom === 'resume' ? resume() : bookFrom === 'pause' ? showPause() : showMenu()),
  };
  overlay.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    Sound.ensure();
    Sound.pick();
    ACTIONS[b.dataset.act] && ACTIONS[b.dataset.act](b.dataset);
  });

  function toggleMute() {
    Sound.muted = !Sound.muted;
    save.muted = Sound.muted;
    persist();
    renderSoundBtn();
  }
  $('#btnPause').addEventListener('click', () => { Sound.ensure(); pauseGame('pause'); });
  $('#btnBook').addEventListener('click', () => { Sound.ensure(); pauseGame('book'); });
  $('#btnSound').addEventListener('click', () => { Sound.ensure(); toggleMute(); if (!Sound.muted) Sound.pick(); });

  addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      if (G.paused) resume(); else pauseGame('pause');
      return;
    }
    if (!G.running || G.paused) return;
    if (e.key >= '1' && e.key <= '5') takeFromQueue(G.queues[+e.key - 1]);
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); Sound.ensure(); make(); }
    else if (e.key === 'Backspace' || e.key === 'Delete') clearTray();
  });

  /* =========================================================
   * Main loop
   * ======================================================= */
  let lastT = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - lastT) / 1000);
    lastT = now;
    if (!G.running || G.paused) return;
    G.timeLeft -= dt;
    runTimers(dt);
    updateBelt(dt);
    flowQueues(dt);
    updateSeats(dt);
    updateTutorial();
    updateHUD();
    const sec = Math.ceil(G.timeLeft);
    if (sec !== G.lastSec) { G.lastSec = sec; if (sec <= 10 && sec > 0) Sound.tick(); }
    if (G.timeLeft <= 0) endLevel();
  }

  // Boot: draw an idle level-1 scene behind the title menu.
  G.L = getLevel(save.unlocked);
  G.levelNum = save.unlocked;
  G.slots = new Array(NSLOTS).fill(null);
  buildSeats();
  buildQueues();
  renderTray();
  updateHUD();
  showMenu();
  requestAnimationFrame(loop);

  // Expose a tiny debug hook for testing in the console.
  window.SushiSpin = { G, startLevel, RECIPES };
})();
