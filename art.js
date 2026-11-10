/* Sushi Spin Bar — all artwork is hand-built inline SVG (no image assets). */
const Art = (() => {
  const S = (vb, body) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const shadow = (cx, cy, rx, ry, o = 0.14) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;
  const grains = (pts, fill = '#ece6da') =>
    pts.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.4" transform="rotate(${r} ${x} ${y})" fill="${fill}"/>`).join('');
  const balls = (pts, r = 4.6, fill = '#ff7a00', edge = '#e05a00') =>
    pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${edge}" stroke-width=".8"/><circle cx="${x - 1.5}" cy="${y - 1.6}" r="${r * 0.3}" fill="#fff" opacity=".85"/>`).join('');

  /* ---------------- ingredients ---------------- */
  const ING = {
    rice: () => S('0 0 64 64',
      shadow(32, 58, 19, 3.5) +
      `<ellipse cx="32" cy="31" rx="21" ry="13" fill="#fff"/>` +
      grains([[22, 26, 20], [30, 22, -15], [38, 25, 30], [44, 30, -20], [27, 31, 10], [35, 30, -30], [18, 32, 40]]) +
      `<path d="M9 33 H55 A23 21 0 0 1 9 33Z" fill="#e2574c"/>
       <path d="M9 33 H55" stroke="#b83a30" stroke-width="3" stroke-linecap="round"/>
       <path d="M16 43 Q24 38 32 43 T48 43" stroke="#fff" stroke-width="2.4" fill="none" opacity=".7"/>
       <rect x="24" y="51" width="16" height="5" rx="2.5" fill="#b83a30"/>`),

    salmon: () => S('0 0 64 64',
      shadow(32, 55, 22, 4) +
      `<path d="M6 40 Q8 26 24 21 L50 15 Q60 14 58 26 Q56 38 44 44 L16 50 Q6 50 6 40Z" fill="#ff8a4c"/>
       <g stroke="#ffd7bf" stroke-width="3.2" fill="none" stroke-linecap="round">
         <path d="M11 38 Q20 27 38 20"/><path d="M15 45 Q28 32 52 21"/><path d="M26 46 Q38 37 56 29"/></g>
       <path d="M6 40 Q8 47 16 50 L44 44 Q56 38 58 26" fill="none" stroke="#e8662a" stroke-width="2.5"/>`),

    tuna: () => S('0 0 64 64',
      shadow(32, 56, 23, 4) +
      `<path d="M8 28 L44 17 Q55 15 56 25 L56 39 Q56 46 48 48 L17 54 Q8 55 8 46Z" fill="#b8213c"/>
       <path d="M8 28 L44 17 Q55 15 56 25 L22 36 Q10 39 8 28Z" fill="#e8455e"/>
       <g stroke="#ff8a9b" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8">
         <path d="M16 29 Q26 23 38 21"/><path d="M24 32 Q36 26 48 23"/></g>
       <path d="M14 44 L48 37" stroke="#d6334f" stroke-width="2" stroke-linecap="round"/>`),

    shrimp: () => S('0 0 64 64',
      shadow(32, 56, 18, 3.5) +
      `<path d="M44 15 A17 17 0 1 0 46 47" fill="none" stroke="#ff7b54" stroke-width="13" stroke-linecap="round"/>
       <path d="M44 15 A17 17 0 1 0 46 47" fill="none" stroke="#ffe3d6" stroke-width="13" stroke-dasharray="2.5 7"/>
       <path d="M43 44 L58 46 L54 59 Z" fill="#e8452c"/>
       <path d="M50 49 L55 55" stroke="#ff9a7a" stroke-width="1.5"/>
       <circle cx="41" cy="14" r="2.4" fill="#2a1d1a"/>
       <path d="M44 11 Q52 4 58 6 M44 12 Q54 10 58 12" stroke="#e8452c" stroke-width="1.4" fill="none"/>`),

    cucumber: () => S('0 0 64 64',
      shadow(32, 56, 22, 4) +
      `<circle cx="22" cy="28" r="15" fill="#2f7d3b"/><circle cx="22" cy="28" r="11.5" fill="#a9db7e"/>
       <circle cx="38" cy="36" r="18" fill="#3e9a4c"/><circle cx="38" cy="36" r="14.5" fill="#c9eaa0"/>
       <circle cx="38" cy="36" r="7.5" fill="#e6f6cf"/>
       <g fill="#9bcf6c">${[0, 60, 120, 180, 240, 300].map(a => {
        const x = 38 + Math.cos(a * Math.PI / 180) * 4.8, y = 36 + Math.sin(a * Math.PI / 180) * 4.8;
        return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="1.6" ry="1" transform="rotate(${a} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }).join('')}</g>
       <path d="M27 24 Q32 20 38 21" stroke="#fff" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>`),

    avocado: () => S('0 0 64 64',
      shadow(32, 59, 18, 3.5) +
      `<path d="M32 5 C45 5 53 24 53 38 C53 51 44 59 32 59 C20 59 11 51 11 38 C11 24 19 5 32 5Z" fill="#3c6e2f"/>
       <path d="M32 10 C42 10 49 26 49 38 C49 48 42 55 32 55 C22 55 15 48 15 38 C15 26 22 10 32 10Z" fill="#cfe57f"/>
       <path d="M32 15 C40 15 45 28 45 38 C45 46 40 51 32 51 C24 51 19 46 19 38 C19 28 24 15 32 15Z" fill="#eef6b0"/>
       <circle cx="32" cy="39" r="10" fill="#8a5a2b"/><circle cx="28.5" cy="35.5" r="3" fill="#b8844f"/>`),

    seaweed: () => S('0 0 64 64',
      shadow(32, 57, 22, 4) +
      `<rect x="12" y="10" width="42" height="40" rx="5" fill="#2b5040" transform="rotate(8 32 32)"/>
       <rect x="9" y="13" width="42" height="40" rx="5" fill="#1d3a2b" transform="rotate(-6 32 32)"/>
       <g stroke="#3f7058" stroke-width="1.4" opacity=".7" transform="rotate(-6 32 32)">
         <path d="M14 22 H46"/><path d="M14 30 H46"/><path d="M14 38 H46"/><path d="M14 46 H46"/></g>
       <path d="M13 18 Q20 15 28 16" stroke="#fff" stroke-width="2" fill="none" opacity=".25" stroke-linecap="round"/>`),

    roe: () => S('0 0 64 64',
      `<ellipse cx="32" cy="47" rx="25" ry="10" fill="#2f5ea8"/>
       <ellipse cx="32" cy="44" rx="25" ry="10" fill="#4a7fd1"/>
       <ellipse cx="32" cy="43" rx="19" ry="6.5" fill="#dfe9fa"/>` +
      balls([[22, 40], [32, 41], [42, 40], [27, 33], [37, 33], [32, 25], [19, 34], [45, 34]], 5.2)),

    spicy: () => S('0 0 64 64',
      shadow(32, 58, 14, 3.2) +
      `<rect x="21" y="20" width="22" height="37" rx="8" fill="#e53935"/>
       <rect x="26" y="11" width="12" height="11" rx="3" fill="#fafafa"/>
       <path d="M30 3 L34 3 L33.5 11 L30.5 11Z" fill="#fafafa"/>
       <rect x="24" y="32" width="16" height="15" rx="3.5" fill="#fff3e0"/>
       <path d="M32 34 C37 39 36 44 32 45 C28 44 27 39 32 34Z" fill="#ff7043"/>
       <path d="M32 39 C34 41 34 43 32 44 C30 43 30 41 32 39Z" fill="#ffd54f"/>
       <rect x="24.5" y="22" width="3" height="30" rx="1.5" fill="#fff" opacity=".35"/>`),
  };

  /* ---------------- sushi ---------------- */
  const nigiri = (top, stripe, extra = '') => S('0 0 64 64',
    shadow(32, 52, 24, 5) +
    `<rect x="10" y="29" width="44" height="21" rx="10.5" fill="#fff" stroke="#e8e1d4" stroke-width="1.5"/>` +
    grains([[18, 44, 10], [26, 46, -20], [36, 45, 15], [46, 43, -10]]) +
    `<path d="M6 34 Q7 20 32 19 Q57 20 58 34 Q52 41 32 39 Q12 41 6 34Z" fill="${top}"/>
     <g stroke="${stripe}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9">
       <path d="M14 35 Q18 27 24 22"/><path d="M25 37 Q30 28 36 21"/><path d="M37 37 Q42 28 48 22"/><path d="M48 35 Q52 30 54 26"/></g>
     <path d="M14 27 Q22 22 32 22" stroke="#fff" stroke-width="2.5" fill="none" opacity=".45" stroke-linecap="round"/>` + extra);

  const makiBase = (wall, top, edge = 'none') =>
    shadow(32, 54, 23, 5) +
    `<path d="M9 30 V41 A23 13 0 0 0 55 41 V30Z" fill="${wall}" stroke="${edge}" stroke-width="1.2"/>
     <ellipse cx="32" cy="30" rx="23" ry="13" fill="${top}" stroke="${edge}" stroke-width="1.2"/>`;
  const noriWall = `<path d="M13 46 Q32 53 51 46" stroke="#2c5a40" stroke-width="1.5" fill="none" opacity=".7"/>`;
  const riceTop = `<ellipse cx="32" cy="30" rx="19" ry="10.5" fill="#fff"/>` +
    grains([[20, 29, 20], [25, 24, -10], [40, 24, 15], [45, 30, -20], [26, 36, 10], [39, 36, -15]]);

  const SUSHI = {
    salmon_nigiri: () => nigiri('#ff8a4c', '#ffd7bf'),
    tuna_nigiri: () => nigiri('#d93250', '#f27b8e'),
    shrimp_nigiri: () => nigiri('#ff9d6c', '#fff3ea',
      `<path d="M53 28 L64 17 L63 35 Z" fill="#e8452c"/><path d="M57 26 L62 21 M57 29 L62 29" stroke="#ff9a7a" stroke-width="1.4"/>`),
    salmon_roll: () => S('0 0 64 64', makiBase('#173024', '#22412f') + noriWall + riceTop +
      `<ellipse cx="32" cy="30" rx="8.5" ry="5.2" fill="#ff8a4c"/><path d="M26.5 29 Q32 25.5 37.5 29" stroke="#ffd7bf" stroke-width="1.6" fill="none"/>`),
    cucumber_roll: () => S('0 0 64 64', makiBase('#173024', '#22412f') + noriWall + riceTop +
      `<ellipse cx="32" cy="30" rx="8" ry="5" fill="#3e9a4c"/><ellipse cx="32" cy="30" rx="5.4" ry="3.2" fill="#c9eaa0"/>`),
    spicy_tuna_roll: () => S('0 0 64 64', makiBase('#173024', '#22412f') + noriWall + riceTop +
      `<ellipse cx="32" cy="30" rx="8.5" ry="5.2" fill="#d93250"/>
       <path d="M13 27 Q18 20 23 27 T33 26 T43 26 T52 25" stroke="#ff5a1f" stroke-width="3.2" fill="none" stroke-linecap="round"/>
       <g fill="#fff8e1"><ellipse cx="22" cy="33" rx="1.3" ry=".8"/><ellipse cx="41" cy="34" rx="1.3" ry=".8"/><ellipse cx="36" cy="22" rx="1.3" ry=".8"/></g>
       <g fill="#6cc04a"><circle cx="27" cy="22" r="1.4"/><circle cx="45" cy="29" r="1.4"/></g>`),
    california_roll: () => S('0 0 64 64', makiBase('#fdfbf6', '#ffffff', '#e2dacb') +
      `<g fill="#ff7a1a">${[[13, 38], [18, 44], [25, 47], [33, 48], [41, 47], [48, 43], [52, 37], [16, 26], [24, 20], [33, 18], [43, 20], [50, 26]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5"/>`).join('')}</g>
       <ellipse cx="32" cy="30" rx="14" ry="7.8" fill="#22412f"/><ellipse cx="32" cy="30" rx="12" ry="6.4" fill="#fff"/>
       <ellipse cx="27.5" cy="30" rx="4.2" ry="3" fill="#ff6b6b"/><ellipse cx="27.5" cy="29.2" rx="2.6" ry="1.3" fill="#fff" opacity=".8"/>
       <ellipse cx="35.5" cy="28.6" rx="3.6" ry="2.5" fill="#a5d15a"/><ellipse cx="35" cy="32.2" rx="3" ry="1.7" fill="#3e9a4c"/>`),
    ikura_gunkan: () => S('0 0 64 64',
      shadow(32, 54, 22, 5) +
      `<path d="M11 28 V43 A21 11 0 0 0 53 43 V28Z" fill="#173024"/>
       <ellipse cx="32" cy="28" rx="21" ry="11" fill="#22412f"/><ellipse cx="32" cy="28" rx="18" ry="8.4" fill="#fff"/>` + noriWall +
      balls([[22, 28], [29, 29], [36, 29], [43, 28], [25, 22], [32, 22], [39, 22], [28, 16], [35, 16], [32, 10]], 4.3) +
      `<path d="M44 16 l9 -7 l-2 9z" fill="#4caf50"/>`),
  };

  const plate = (color) => S('0 0 64 36',
    `<ellipse cx="32" cy="21" rx="31" ry="14" fill="#000" opacity=".22"/>
     <ellipse cx="32" cy="18" rx="30" ry="14" fill="${color}"/>
     <ellipse cx="32" cy="16.5" rx="23" ry="9.8" fill="#fff"/>
     <ellipse cx="32" cy="17" rx="16" ry="6.2" fill="#f1f1f1"/>
     <path d="M8 13 Q16 6 28 5" stroke="#fff" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>`);

  /* ---------------- customers ---------------- */
  const HAIR = {
    short: { front: 'M20 52 C16 22 34 13 52 14 C72 15 86 28 80 52 C76 40 70 34 62 31 C54 38 40 37 32 33 C26 38 22 44 20 52Z' },
    spiky: { front: 'M20 50 L13 34 L25 33 L21 19 L35 23 L37 9 L49 19 L58 7 L64 21 L76 13 L76 27 L88 29 L80 50 C74 38 62 32 50 32 C38 32 26 38 20 50Z' },
    bob: {
      back: 'M16 52 C10 12 90 12 84 52 L86 78 C80 82 74 80 72 76 L28 76 C26 80 20 82 14 78Z',
      front: 'M21 48 C20 22 36 16 50 16 C66 16 80 22 79 48 C74 36 68 32 64 30 C58 36 46 36 40 30 C34 34 26 38 21 48Z',
    },
    long: {
      back: 'M15 50 C10 10 90 10 85 50 L90 104 C78 108 70 100 70 92 L30 92 C30 100 22 108 10 104Z',
      front: 'M21 50 C18 20 38 14 54 15 C72 16 82 28 79 50 C76 38 70 30 58 28 C48 38 34 44 21 50Z',
    },
    buns: {
      backExtra: (h) => `<circle cx="25" cy="19" r="11" fill="${h}"/><circle cx="75" cy="19" r="11" fill="${h}"/>`,
      front: 'M21 50 C18 22 34 16 50 16 C66 16 82 22 79 50 C74 38 68 32 60 30 C54 36 44 36 38 30 C30 34 24 40 21 50Z',
    },
    pigtails: {
      backExtra: (h) => `<circle cx="12" cy="60" r="12" fill="${h}"/><circle cx="88" cy="60" r="12" fill="${h}"/>
        <circle cx="19" cy="53" r="3.5" fill="#ffd23f"/><circle cx="81" cy="53" r="3.5" fill="#ffd23f"/>`,
      front: 'M21 48 C20 22 36 16 50 16 C66 16 80 22 79 48 C74 36 66 32 62 30 C58 37 44 37 38 30 C32 34 26 38 21 48Z',
    },
    bald: {
      front: 'M20 58 C16 44 22 38 28 36 L31 52Z M80 58 C84 44 78 38 72 36 L69 52Z',
      shine: true,
    },
    cap: { front: 'M21 50 C20 36 26 30 34 30 L66 30 C74 30 80 36 79 50 C72 42 60 38 50 38 C40 38 28 42 21 50Z' },
  };

  function face(mood, c) {
    const eye = (x) => `<circle cx="${x}" cy="52" r="3.8" fill="#2a1d1a"/><circle cx="${x + 1.3}" cy="50.6" r="1.3" fill="#fff"/>`;
    const blush = (o = 0.55) => `<ellipse cx="31" cy="62" rx="5" ry="3.2" fill="#ff7f93" opacity="${o}"/><ellipse cx="69" cy="62" rx="5" ry="3.2" fill="#ff7f93" opacity="${o}"/>`;
    const st = 'stroke="#7a2e2e" stroke-width="2.6" fill="none" stroke-linecap="round"';
    const brow = 'stroke="#3a2a24" stroke-width="2.6" fill="none" stroke-linecap="round"';
    switch (mood) {
      case 'joy':
        return `<path d="M33 54 Q39 46 45 54" ${st.replace('#7a2e2e', '#2a1d1a')}/><path d="M55 54 Q61 46 67 54" ${st.replace('#7a2e2e', '#2a1d1a')}/>` + blush(0.8) +
          `<path d="M41 61 Q50 76 59 61Z" fill="#7a2e2e"/><path d="M45 67 Q50 72 55 67" fill="#ff7d7d"/>`;
      case 'neutral':
        return eye(39) + eye(61) + blush(0.4) + `<path d="M45 66 H55" ${st}/>`;
      case 'worried':
        return eye(39) + eye(61) + blush(0.3) +
          `<path d="M33 45 L44 41" ${brow}/><path d="M56 41 L67 45" ${brow}/>
           <path d="M43 67 Q46.5 64 50 67 Q53.5 70 57 67" ${st}/>
           <path d="M77 34 C80 40 81 43 78 45 C75 45 74 42 77 34Z" fill="#7cc6ff"/>`;
      case 'angry':
        return eye(39) + eye(61) + `<ellipse cx="31" cy="62" rx="6" ry="3.6" fill="#ff4d4d" opacity=".5"/><ellipse cx="69" cy="62" rx="6" ry="3.6" fill="#ff4d4d" opacity=".5"/>` +
          `<path d="M33 41 L45 46" ${brow}/><path d="M55 46 L67 41" ${brow}/><path d="M43 69 Q50 62 57 69" ${st}/>
           <g stroke="#e53935" stroke-width="2.6" fill="none" stroke-linecap="round" transform="translate(4 -4)">
             <path d="M70 24 Q73 27 70 30"/><path d="M78 24 Q75 27 78 30"/><path d="M71 22 Q74 25 77 22"/><path d="M71 32 Q74 29 77 32"/></g>`;
      default: // happy
        return eye(39) + eye(61) + blush() + `<path d="M43 64 Q50 71 57 64" ${st}/>`;
    }
  }

  function accessory(c) {
    const a = c.accColor || '#333';
    switch (c.acc) {
      case 'glasses':
        return `<g fill="rgba(255,255,255,.22)" stroke="${a}" stroke-width="2.6"><circle cx="39" cy="52" r="8.5"/><circle cx="61" cy="52" r="8.5"/></g>
                <path d="M47.5 51 Q50 49 52.5 51" stroke="${a}" stroke-width="2.4" fill="none"/>`;
      case 'bow':
        return `<g transform="translate(70 21) rotate(18)"><path d="M0 0 L-13 -9 L-13 9Z" fill="${a}"/><path d="M0 0 L13 -9 L13 9Z" fill="${a}"/><circle r="4.5" fill="${a}" stroke="#fff" stroke-width="1.2"/></g>`;
      case 'headband':
        return `<path d="M21 39 C30 29 70 29 79 39 L80 46 C70 36 30 36 20 46Z" fill="${a}"/>
                <path d="M80 40 L90 34 L88 44Z M80 43 L91 47 L84 51Z" fill="${a}"/>`;
      case 'mustache':
        return `<path d="M37 64 C41 57 48 58 50 61.5 C52 58 59 57 63 64 C57 66.5 53 65.5 50 64 C47 65.5 43 66.5 37 64Z" fill="${c.hair}" stroke="#bdbdbd" stroke-width=".8"/>
                <path d="M32 44 Q38 40 45 43 M55 43 Q62 40 68 44" stroke="${c.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
      case 'flower':
        return `<g transform="translate(73 25)">${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-6" rx="4" ry="5.5" fill="${a}" transform="rotate(${r})"/>`).join('')}<circle r="3.6" fill="#ffd23f"/></g>`;
      case 'cap':
        return `<path d="M19 42 C18 10 82 10 81 42 C70 36 30 36 19 42Z" fill="${a}"/>
                <path d="M50 37 C66 31 88 33 96 42 C84 46 66 44 50 42Z" fill="${a}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>
                <circle cx="50" cy="13" r="3" fill="rgba(255,255,255,.6)"/>
                <path d="M30 22 Q40 16 50 16" stroke="#fff" stroke-width="2" opacity=".3" fill="none"/>`;
      default: return '';
    }
  }

  function character(c, mood = 'happy') {
    const h = HAIR[c.style] || HAIR.short;
    return S('0 0 100 110',
      (h.back ? `<path d="${h.back}" fill="${c.hair}"/>` : '') +
      (h.backExtra ? h.backExtra(c.hair) : '') +
      `<path d="M12 112 C14 88 30 80 50 80 C70 80 86 88 88 112Z" fill="${c.shirt}"/>
       <path d="M12 112 C14 88 30 80 50 80" stroke="#fff" stroke-width="3" opacity=".25" fill="none"/>
       <path d="M40 81 L50 93 L60 81Z" fill="#fff" opacity=".9"/>
       <rect x="43" y="69" width="14" height="15" rx="5" fill="${c.skin}"/>
       <rect x="43" y="74" width="14" height="5" fill="#000" opacity=".08"/>
       <circle cx="21" cy="52" r="6.5" fill="${c.skin}"/><circle cx="79" cy="52" r="6.5" fill="${c.skin}"/>
       <circle cx="21" cy="52" r="3" fill="#000" opacity=".07"/><circle cx="79" cy="52" r="3" fill="#000" opacity=".07"/>
       <ellipse cx="50" cy="48" rx="29.5" ry="28.5" fill="${c.skin}"/>` +
      face(mood, c) +
      `<path d="${h.front}" fill="${c.hair}"/>` +
      (h.shine ? `<ellipse cx="40" cy="27" rx="9" ry="4.5" fill="#fff" opacity=".35" transform="rotate(-15 40 27)"/>` : '') +
      accessory(c));
  }

  /* ---------------- chef ---------------- */
  function chef() {
    const skin = '#ffd5b0';
    const st = 'stroke="#2a1d1a" stroke-width="2.6" fill="none" stroke-linecap="round"';
    return S('0 0 120 150', `<g class="chef-wrap">
      <path d="M14 152 C14 108 32 96 60 96 C88 96 106 108 106 152Z" fill="#fff" stroke="#d5dee8" stroke-width="2"/>
      <path d="M44 97 L60 128 L76 97" fill="none" stroke="#1f3b73" stroke-width="6" stroke-linejoin="round"/>
      <path d="M60 128 V152" stroke="#dfe6ee" stroke-width="2"/>
      <rect x="51" y="83" width="18" height="18" rx="7" fill="#efbf96"/>
      <g class="arm-l">
        <path d="M27 110 C14 124 18 136 34 140" stroke="#fff" stroke-width="17" fill="none" stroke-linecap="round"/>
        <path d="M27 110 C14 124 18 136 34 140" stroke="#dfe6ee" stroke-width="17" fill="none" stroke-linecap="round" stroke-dasharray="0 40 4 100" opacity=".9"/>
        <circle cx="36" cy="140" r="7.5" fill="${skin}"/>
      </g>
      <g class="arm-r">
        <path d="M93 110 C106 124 102 136 86 140" stroke="#fff" stroke-width="17" fill="none" stroke-linecap="round"/>
        <path d="M80 138 L58 124 Q56 120 60 120 L84 131Z" fill="#e3eaf0" stroke="#9fb0bf" stroke-width="1.3"/>
        <path d="M62 121 L82 132" stroke="#fff" stroke-width="1.2" opacity=".8"/>
        <rect x="81" y="132" width="12" height="6" rx="2.5" fill="#6d4c41" transform="rotate(32 87 135)"/>
        <circle cx="86" cy="140" r="7.5" fill="${skin}"/>
      </g>
      <circle cx="33" cy="62" r="7" fill="${skin}"/><circle cx="87" cy="62" r="7" fill="${skin}"/>
      <ellipse cx="60" cy="60" rx="27" ry="26" fill="${skin}"/>
      <path d="M33 62 C31 46 38 40 45 39 L42 57Z" fill="#2b1d16"/><path d="M87 62 C89 46 82 40 75 39 L78 57Z" fill="#2b1d16"/>
      <g fill="#fff" stroke="#dbe3ea" stroke-width="2"><circle cx="44" cy="24" r="13"/><circle cx="76" cy="24" r="13"/><circle cx="60" cy="17" r="15"/></g>
      <path d="M36 22 C40 14 50 10 58 12" stroke="#fff" stroke-width="5" fill="none"/>
      <rect x="35" y="28" width="50" height="16" rx="6" fill="#fff" stroke="#dbe3ea" stroke-width="2"/>
      <rect x="35" y="37" width="50" height="4" fill="#e53935"/>
      <ellipse cx="44" cy="70" rx="5" ry="3.2" fill="#ff8a9a" opacity=".55"/><ellipse cx="76" cy="70" rx="5" ry="3.2" fill="#ff8a9a" opacity=".55"/>
      <g class="f-normal">
        <circle cx="50" cy="60" r="3.8" fill="#2a1d1a"/><circle cx="51.3" cy="58.6" r="1.3" fill="#fff"/>
        <circle cx="70" cy="60" r="3.8" fill="#2a1d1a"/><circle cx="71.3" cy="58.6" r="1.3" fill="#fff"/>
        <path d="M52 70 Q60 77 68 70" stroke="#7a2e2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </g>
      <g class="f-happy">
        <path d="M45 62 Q50 55 55 62" ${st}/><path d="M65 62 Q70 55 75 62" ${st}/>
        <path d="M51 68 Q60 81 69 68Z" fill="#7a2e2e"/><path d="M55 74 Q60 78 65 74" fill="#ff7d7d"/>
      </g>
      <g class="f-oops">
        <circle cx="50" cy="61" r="3" fill="#2a1d1a"/><circle cx="70" cy="61" r="3" fill="#2a1d1a"/>
        <path d="M44 53 L55 50 M65 50 L76 53" stroke="#2b1d16" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M52 73 Q56 70 60 73 Q64 76 68 73" stroke="#7a2e2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M86 44 C89 50 90 53 87 55 C84 55 83 52 86 44Z" fill="#7cc6ff"/>
      </g>
    </g>`);
  }

  /* ---------------- UI icons ---------------- */
  const faceIcon = (col, mouth) => S('0 0 24 24',
    `<circle cx="12" cy="12" r="10.5" fill="${col}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
     <circle cx="8.5" cy="10" r="1.5" fill="#3a2a1a"/><circle cx="15.5" cy="10" r="1.5" fill="#3a2a1a"/>
     <path d="${mouth}" stroke="#3a2a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
  const ICONS = {
    coin: () => S('0 0 24 24', `<circle cx="12" cy="13" r="10" fill="#c98a00"/><circle cx="12" cy="11.6" r="10" fill="#ffc21a"/>
      <circle cx="12" cy="11.6" r="7" fill="none" stroke="#ffe27a" stroke-width="1.6"/><rect x="9.6" y="9.2" width="4.8" height="4.8" rx="1" fill="#c98a00"/>`),
    star: () => S('0 0 24 24', `<path d="M12 1.8l3.1 6.4 7 .9-5.1 4.9 1.3 7-6.3-3.4-6.3 3.4 1.3-7L1.9 9.1l7-.9z" fill="#ffd23f" stroke="#e09b00" stroke-width="1.4" stroke-linejoin="round"/>`),
    starEmpty: () => S('0 0 24 24', `<path d="M12 1.8l3.1 6.4 7 .9-5.1 4.9 1.3 7-6.3-3.4-6.3 3.4 1.3-7L1.9 9.1l7-.9z" fill="#e7d3b5" stroke="#c9ad85" stroke-width="1.4" stroke-linejoin="round"/>`),
    clock: () => S('0 0 24 24', `<circle cx="12" cy="12" r="10" fill="#fff" stroke="#5aa9e6" stroke-width="2.4"/><path d="M12 6.5V12l3.6 2.2" stroke="#2b3a55" stroke-width="2.2" fill="none" stroke-linecap="round"/>`),
    heart: () => S('0 0 24 24', `<path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z" fill="#ff4d7d"/><path d="M7 8.5a2.4 2.4 0 0 1 2.6-1.6" stroke="#fff" stroke-width="1.5" fill="none" opacity=".6" stroke-linecap="round"/>`),
    sparkle: () => S('0 0 24 24', `<path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="#fff6a8"/>`),
    pause: () => S('0 0 24 24', `<rect x="6" y="5" width="4.4" height="14" rx="1.6" fill="#7a3d00"/><rect x="13.6" y="5" width="4.4" height="14" rx="1.6" fill="#7a3d00"/>`),
    book: () => S('0 0 24 24', `<path d="M2.5 5.5c3.2-1.6 6.4-1.4 9.5.6v14c-3.1-2-6.3-2.2-9.5-.6z" fill="#fff" stroke="#7a3d00" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M21.5 5.5c-3.2-1.6-6.4-1.4-9.5.6v14c3.1-2 6.3-2.2 9.5-.6z" fill="#ffe9c9" stroke="#7a3d00" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M5 9.5c1.8-.6 3.6-.4 5 .4M5 12.5c1.8-.6 3.6-.4 5 .4M14 9.9c1.4-.8 3.2-1 5-.4" stroke="#c98a55" stroke-width="1.1" fill="none" stroke-linecap="round"/>`),
    soundOn: () => S('0 0 24 24', `<path d="M4 9h4l5-4v14l-5-4H4z" fill="#7a3d00"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#7a3d00" stroke-width="2" fill="none" stroke-linecap="round"/>`),
    soundOff: () => S('0 0 24 24', `<path d="M4 9h4l5-4v14l-5-4H4z" fill="#7a3d00"/><path d="M16 9l5 6M21 9l-5 6" stroke="#c0392b" stroke-width="2.2" stroke-linecap="round"/>`),
    trash: () => S('0 0 24 24', `<path d="M5 7h14l-1.3 13.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8z" fill="#90a4ae"/><rect x="3.5" y="4.5" width="17" height="3" rx="1.5" fill="#607d8b"/>
      <rect x="9.5" y="2.5" width="5" height="2.5" rx="1" fill="#607d8b"/><path d="M9.5 10.5v8M14.5 10.5v8" stroke="#607d8b" stroke-width="1.6" stroke-linecap="round"/>`),
    lock: () => S('0 0 24 24', `<rect x="5" y="10" width="14" height="11" rx="3" fill="#a1887f"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="#a1887f" stroke-width="2.4" fill="none"/><circle cx="12" cy="15.5" r="1.8" fill="#5d4037"/>`),
    person: () => S('0 0 24 24', `<circle cx="12" cy="8" r="4.5" fill="#ff8c42"/><path d="M3.5 21c.6-5 4-7.5 8.5-7.5s7.9 2.5 8.5 7.5z" fill="#ff8c42"/>`),
    close: () => S('0 0 24 24', `<path d="M7 7l10 10M17 7L7 17" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),
    faceGood: () => faceIcon('#7ee36b', 'M7.5 14 Q12 18.5 16.5 14'),
    faceOk: () => faceIcon('#ffd23f', 'M8 15.5 H16'),
    faceBad: () => faceIcon('#ff6b5b', 'M7.5 17 Q12 12.5 16.5 17'),
  };

  const lantern = () => S('0 0 40 72', `
    <line x1="20" y1="0" x2="20" y2="8" stroke="#3a2214" stroke-width="2"/>
    <rect x="11" y="7" width="18" height="6" rx="2" fill="#2b1a10"/>
    <ellipse cx="20" cy="36" rx="18" ry="22" fill="#e53935"/>
    <path d="M6 27 Q20 23 34 27 M3 36 Q20 32 37 36 M6 45 Q20 41 34 45" stroke="#b71c1c" stroke-width="1.5" fill="none"/>
    <ellipse cx="13" cy="30" rx="4" ry="10" fill="#fff" opacity=".2"/>
    <circle cx="20" cy="37" r="8" fill="#fff3c4" opacity=".9"/>
    <path d="M16 37 Q20 31 24 37 Q20 43 16 37Z" fill="#e53935"/>
    <rect x="11" y="56" width="18" height="6" rx="2" fill="#2b1a10"/>
    <path d="M17 62 V72 M20 62 V72 M23 62 V72" stroke="#f2b84b" stroke-width="1.6"/>`);

  return {
    ing: (t) => (ING[t] || ING.rice)(),
    sushi: (id) => (SUSHI[id] || SUSHI.salmon_nigiri)(),
    plate, character, chef, lantern,
    icon: (n) => (ICONS[n] ? ICONS[n]() : ''),
  };
})();
