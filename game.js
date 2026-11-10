// Long Live the Empire: game flow and rendering. Content and tuning live in data.js.

const app = document.getElementById('app');
const SEAT_ORDER = ['ruler', 'general', 'scholar', 'envoy'];
const BEST_KEY = 'lle_best_years';
let state = null;

// ---------- helpers ----------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtYear = (y) => (y < 0 ? `${-y} BC` : `${y} AD`);
const fmtNum = (n) => n.toLocaleString('en-US');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Small seeded random generator, so a daily game deals everyone the same hand and the same luck.
function seededRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Daily number: 1 on launch day, counted in the player's local calendar days.
function dailyNumber() {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - Date.UTC(2026, 10, 9)) / 86400000) + 1;
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(state.rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function saveBest(years) {
  try { localStorage.setItem(BEST_KEY, String(years)); } catch { /* storage unavailable */ }
}

// Current strength of whoever holds a seat. Empty seats are run by a weak steward.
function seatStrength(seat) {
  const held = state.seats[seat];
  if (!held) return DATA.stewardStrength;
  const faded = held.leader.rating - DATA.fade(state.era - held.since);
  const linked = activeLinks()
    .filter((l) => l.a === held.leader.name || l.b === held.leader.name)
    .reduce((sum, l) => sum + (l.type === 'bond' ? 1 : -1), 0);
  return Math.max(1, Math.min(10, faded + linked));
}

// Bonds and rivalries where both leaders currently hold a seat.
function activeLinks() {
  const seated = Object.values(state.seats).map((s) => s.leader.name);
  return EXTRA.links.filter((l) => seated.includes(l.a) && seated.includes(l.b));
}
function seatHolder(seat) {
  const held = state.seats[seat];
  return held ? held.leader.name : 'a nameless steward';
}

function pips(n) {
  let out = '';
  for (let i = 1; i <= 10; i++) out += `<i class="${i <= n ? 'on' : ''}"></i>`;
  return `<span class="pips">${out}</span>`;
}

function wikiLink(page, label) {
  const url = EXTRA.wikiBase + encodeURIComponent(page).replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')');
  return `<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`;
}

function learnMore(leader) {
  const x = EXTRA.leaders[leader.name];
  if (!x) return '';
  return `<details class="more">
    <summary>Learn more</summary>
    <p>${esc(x.more)}</p>
    <p>${wikiLink(x.wiki, 'Read the full story on Wikipedia')}</p>
  </details>`;
}

function render(html) {
  app.innerHTML = `<div class="fade-in" style="display:contents">${html}</div>`;
  window.scrollTo(0, 0);
}

// ---------- shared top bar ----------

function hud(openSeat) {
  const era = DATA.eras[state.era];
  let pillars = '';
  for (let i = 0; i < DATA.startStability; i++) {
    pillars += `<span class="${i < state.stability ? '' : 'lost'}">🏛️</span>`;
  }
  const track = DATA.eras.map((_, i) => {
    const r = state.results[i];
    const cls = r === true ? 'win' : r === false ? 'loss' : i === state.era ? 'now' : '';
    return `<i class="${cls}"></i>`;
  }).join('');
  const seats = SEAT_ORDER.map((key) => {
    const s = DATA.seats[key];
    const held = state.seats[key];
    const who = held ? held.leader.name : 'Steward';
    return `<div class="seat ${key === openSeat ? 'open' : ''}">
      <div>${s.icon}</div>
      <div class="who">${esc(who)}</div>
      <div class="str ${held ? 'gold' : 'muted'}">${seatStrength(key)}</div>
    </div>`;
  }).join('');
  return `<div class="hud">
    <div class="hud-row">
      <span class="era-label">${era.label}</span>
      <span class="pillars" aria-label="Stability ${state.stability} of ${DATA.startStability}">${pillars}</span>
    </div>
    <div class="track">${track}</div>
    <div class="seats">${seats}</div>
  </div>`;
}

// ---------- screens ----------

function showTitle() {
  const best = loadBest();
  render(`<div class="title-screen">
    <div>
      <div class="crest">🏛️</div>
      <h1>Long Live<br>the Empire</h1>
      <p class="muted" style="margin-top:8px">Guide one empire through 2,400 years of real history.</p>
    </div>
    <p class="goal"><b>Your goal:</b> keep the empire alive for as many years as you can.</p>
    <ol class="steps">
      <li>Each age, fill an empty seat with a real leader.</li>
      <li>Send your leaders to face history's crises.</li>
      <li>Three failures and the empire falls.</li>
    </ol>
    <div style="display:grid;gap:10px">
      <input id="empire-name" type="text" maxlength="24" placeholder="Name your empire" autocomplete="off">
      <button class="primary" id="daily">Play today's empire · #${dailyNumber()}</button>
      <button class="ghost" id="free">Free play</button>
      <p class="muted small center">Today's empire deals everyone the same leaders and the same luck.${best ? `<br>Your longest reign: ${fmtNum(best)} years` : ''}</p>
    </div>
    <details class="more howto">
      <summary>How to play</summary>
    <ul class="rules">
      <li><span>👑</span><span><b>Your leaders are your defence.</b> The empire has four seats: Ruler, General, Scholar and Envoy. Whoever sits in them is who you send when disaster comes.</span></li>
      <li><span>❓</span><span><b>Each age, fill one seat</b> with a real person from that time. You can't see how good they were until you choose, so what you know matters.</span></li>
      <li><span>🔥</span><span><b>Then history strikes.</b> Pick which leader answers the crisis. The stronger they are, the better your odds. Fail three times and the empire falls.</span></li>
      <li><span>⏳</span><span><b>Legacies fade.</b> A leader's strength drops as the centuries pass, until you replace them.</span></li>
      <li><span>🤝</span><span><b>History connects them.</b> Some leaders really were allies or enemies. Seat them together to discover hidden bonds and rivalries.</span></li>
    </ul>
    </details>
  </div>`);
  const nameOf = () => document.getElementById('empire-name').value.trim() || 'the Nameless';
  document.getElementById('daily').onclick = () => startGame(nameOf(), dailyNumber());
  document.getElementById('free').onclick = () => startGame(nameOf(), 0);
}

// daily = today's daily number, or 0 for free play.
function startGame(name, daily) {
  state = {
    name,
    daily,
    rng: daily ? seededRng(daily * 7919) : Math.random,
    era: 0,
    stability: DATA.startStability,
    seats: {},        // seat key -> { leader, since }
    results: [],      // per era: true = crisis survived, false = failed
    picks: [],        // per era: { leader, best }
    fall: null,       // { year, title, holder, lose }
    shown: null,
  };
  showPick();
}

function showPick() {
  const era = DATA.eras[state.era];
  const seat = DATA.seats[era.seat];
  state.shown = shuffle(era.leaders).slice(0, 3);
  const leaving = state.seats[era.seat];
  const cards = state.shown.map((l, i) => `<button class="card" data-i="${i}">
    <span class="name">${esc(l.name)}</span>
    <span class="meta">${esc(l.title)} · ${esc(l.place)}</span>
    <span class="meta">${esc(l.lived)}</span>
  </button>`).join('');
  render(`${hud(era.seat)}
    <div>
      <h2>${seat.icon} Choose your ${seat.name}</h2>
      <p class="muted small" style="margin-top:4px">${leaving
        ? `${esc(leaving.leader.name)}'s legacy has faded to strength ${seatStrength(era.seat)}. Time for a successor.`
        : `Only a weak steward (strength ${DATA.stewardStrength}) holds this seat.`}</p>
    </div>
    <div class="why">
      <p><b>Why it matters.</b> ${EXTRA.seatJobs[era.seat]} The stronger they really were, the better your odds when you send them to face a crisis.</p>
      <p class="omen">🔥 <b>Trouble ahead:</b> ${esc(EXTRA.crises[state.era].omen)}</p>
    </div>
    <p class="muted small">Who was best at the job? Their strength is revealed after you choose.</p>
    <div class="cards">${cards}</div>`);
  app.querySelectorAll('.card').forEach((b) => { b.onclick = () => choose(Number(b.dataset.i)); });
}

function choose(index) {
  const era = DATA.eras[state.era];
  const leader = state.shown[index];
  const best = state.shown.reduce((a, b) => (b.rating > a.rating ? b : a));
  state.seats[era.seat] = { leader, since: state.era };
  state.picks[state.era] = { leader, best };

  let verdict;
  if (leader.rating >= best.rating) verdict = `<span class="gold">The strongest choice of the age.</span>`;
  else if (best.rating - leader.rating === 1) verdict = `A sound choice, though ${esc(best.name)} was a shade stronger.`;
  else verdict = `You passed over ${esc(best.name)}.`;

  const links = activeLinks()
    .filter((l) => l.a === leader.name || l.b === leader.name)
    .map((l) => {
      const other = l.a === leader.name ? l.b : l.a;
      const bond = l.type === 'bond';
      return `<div class="link ${l.type}">
        <b>${bond ? '🤝 A bond' : '⚡ A rivalry'} with ${esc(other)}.</b> ${esc(l.text)}
        <span class="effect">${bond ? '+1' : '−1'} strength to both while they serve together.</span>
      </div>`;
    }).join('');

  const cards = state.shown.map((l, i) => `<div class="card revealed crisis-box ${i === index ? 'chosen' : ''}">
    ${i === index ? '<span class="tag">Your choice</span>' : ''}
    <span class="name">${esc(l.name)}</span>
    <span class="meta">${esc(l.title)} · ${esc(l.place)} · ${esc(l.lived)}</span>
    <span class="rating">${pips(l.rating)}<b>${l.rating}/10</b></span>
    <span class="fact">${esc(l.fact)}</span>
    ${learnMore(l)}
  </div>`).join('');

  render(`${hud(era.seat)}
    <div>
      <p class="verdict">${verdict}</p>
      <p class="muted small">${esc(leader.name)} is now your ${DATA.seats[era.seat].name} at strength ${seatStrength(era.seat)} out of 10.</p>
    </div>
    ${links}
    <div class="cards">${cards}</div>
    <button class="primary" id="next">Continue</button>`);
  document.getElementById('next').onclick = showCrisis;
}

function showCrisis() {
  const era = DATA.eras[state.era];
  const c = era.crisis;
  const options = c.options.map((o, i) => {
    const s = DATA.seats[o.seat];
    return `<button class="option" data-i="${i}">
      <span>${s.icon} <b>${esc(o.label)}</b></span>
      <span class="by">${s.name}: ${esc(cap(seatHolder(o.seat)))} · strength ${seatStrength(o.seat)}</span>
    </button>`;
  }).join('');
  render(`${hud()}
    <div class="crisis-box">
      <span class="year">${fmtYear(c.year)}</span>
      <h2>${esc(c.title)}</h2>
      <p>${esc(c.text)}</p>
    </div>
    <p class="muted small">Who answers it? Strength matters, and so does whether the approach suits the threat.</p>
    <div class="cards">${options}</div>`);
  app.querySelectorAll('.option').forEach((b) => { b.onclick = () => resolve(Number(b.dataset.i)); });
}

function resolve(index) {
  const era = DATA.eras[state.era];
  const c = era.crisis;
  const o = c.options[index];
  const strength = seatStrength(o.seat);
  const p = DATA.chance(strength, o.mod, state.era);
  const won = state.rng() < p;
  const holder = seatHolder(o.seat);

  state.results[state.era] = won;
  if (!won) state.stability -= 1;
  const fallen = state.stability <= 0;
  if (fallen) state.fall = { year: c.year, title: c.title, holder, lose: o.lose };
  const last = state.era === DATA.eras.length - 1;

  const fit = o.mod > 0 ? 'a good fit for this threat' : o.mod === 0 ? 'a fair fit for this threat' : o.mod === -1 ? 'a risky answer to this threat' : 'a poor fit for this threat';

  render(`${hud()}
    <div class="crisis-box">
      <span class="year">${fmtYear(c.year)} · ${esc(c.title)}</span>
      <p class="result ${won ? 'win' : 'loss'}">${won ? '✓' : '✗'} ${esc(cap(holder))} ${esc(won ? o.win : o.lose)}</p>
      <p class="muted small">Strength ${strength}, and ${fit}: ${Math.round(p * 100)}% chance.${won ? '' : fallen ? ' The last pillar falls.' : ' The empire loses a pillar.'}</p>
    </div>
    <div class="learn"><b class="gold">What really happened.</b> ${esc(c.fact)}
      <p style="margin-top:6px">${wikiLink(EXTRA.crises[state.era].wiki, 'Read the full story on Wikipedia')}</p></div>
    <div class="spacer"></div>
    <button class="primary" id="next">${fallen ? 'See how it ended' : last ? 'See your legacy' : 'On to the next age'}</button>`);
  document.getElementById('next').onclick = () => {
    if (fallen || last) return showEnd();
    state.era += 1;
    showPick();
  };
}

function showEnd() {
  const survived = !state.fall;
  const endYear = survived ? DATA.endYear : state.fall.year;
  const years = endYear - DATA.startYear;
  const founder = state.picks[0].leader.name;
  const greatest = state.picks.reduce((a, b) => (b.leader.rating > a.leader.rating ? b : a)).leader.name;
  const sharp = state.picks.filter((p) => p.leader.rating >= p.best.rating).length;
  const squares = state.results.map((r) => (r ? '🟩' : '🟥')).join('');

  const best = loadBest();
  const record = years > best;
  if (record) saveBest(years);

  const story = survived
    ? `Founded under ${founder}. Still standing in ${fmtYear(DATA.endYear)}: the empire that never fell.`
    : `Founded under ${founder}. Undone in ${fmtYear(state.fall.year)}, when ${state.fall.holder} ${state.fall.lose}`;

  const shareText = [
    state.daily ? `Long Live the Empire · Daily #${state.daily}` : 'Long Live the Empire',
    `🏛️ The Empire of ${state.name}`,
    `${fmtYear(DATA.startYear)} → ${fmtYear(endYear)} · ${fmtNum(years)} years`,
    squares,
    survived ? 'The empire that never fell.' : `Fell to: ${state.fall.title}`,
    'How long would yours last?',
  ].join('\n');

  render(`<div class="epitaph">
      <p class="muted small">${state.daily ? `DAILY #${state.daily} · ` : ''}${survived ? 'STILL STANDING' : 'HERE LIES'}</p>
      <h2>The Empire of ${esc(state.name)}</h2>
      <p class="muted">${fmtYear(DATA.startYear)} – ${fmtYear(endYear)}</p>
      <p class="years">${fmtNum(years)}</p>
      <p class="muted small" style="margin-top:-6px">years${record && best ? ' · a new record' : ''}</p>
      <p class="squares">${squares}</p>
      <p class="serif">${esc(story)}</p>
    </div>
    <p class="muted small center">Greatest servant: <span class="gold">${esc(greatest)}</span><br>
      You found the strongest candidate in ${sharp} of ${state.picks.length} successions.</p>
    <div class="spacer"></div>
    <button class="primary" id="share">Share your empire</button>
    <button class="ghost" id="again">${state.daily ? 'Keep playing in free play' : 'Found a new empire'}</button>
    <p class="muted small center" id="share-note"></p>`);

  document.getElementById('again').onclick = () => startGame(state.name, 0);
  document.getElementById('share').onclick = async () => {
    const note = document.getElementById('share-note');
    const text = `${shareText}\n${location.href}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        note.textContent = 'Copied. Paste it anywhere.';
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return; // share sheet dismissed
      note.textContent = shareText;
      note.style.whiteSpace = 'pre-line';
    }
  };
}

showTitle();
