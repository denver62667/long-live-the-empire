// Long Live the Empire: game flow and rendering. Content and tuning live in data.js.
// Flow: pick a court of four (one per seat), then watch it face a run of crises in date order.

const app = document.getElementById('app');
const SEAT_ORDER = ['ruler', 'general', 'scholar', 'envoy'];
const BEST_KEY = 'lle_best_years';
let state = null;

// ---------- helpers ----------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtYear = (y) => (y < 0 ? `${-y} BC` : `${y} AD`);
const fmtNum = (n) => n.toLocaleString('en-US');

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

function shuffle(list, rng = state.rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
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

// Current strength of whoever holds a seat: their rating, minus 1 for every crisis they
// have already answered, plus or minus any bonds and rivalries at court.
function seatStrength(seat) {
  const held = state.seats[seat];
  const linked = activeLinks()
    .filter((l) => l.a === held.leader.name || l.b === held.leader.name)
    .reduce((sum, l) => sum + (l.type === 'bond' ? 1 : -1), 0);
  return Math.max(1, Math.min(10, held.leader.rating - held.sent + linked));
}

// Bonds and rivalries where both leaders currently hold a seat.
function activeLinks() {
  const seated = Object.values(state.seats).map((s) => s.leader.name);
  return EXTRA.links.filter((l) => seated.includes(l.a) && seated.includes(l.b));
}

// Every candidate for a seat, from every age.
function seatPool(seat) {
  return [
    ...DATA.eras.filter((e) => e.seat === seat).flatMap((e) => e.leaders),
    ...DATA.moreLeaders.filter((l) => l.seat === seat),
  ];
}

// Every crisis, each paired with its Wikipedia page.
function crisisPool() {
  return [
    ...DATA.eras.map((e, i) => ({ c: e.crisis, wiki: EXTRA.crises[i].wiki })),
    ...DATA.moreCrises.map((c) => ({ c, wiki: c.wiki })),
  ];
}

// Deal `size` items from a pool. Free play is a plain random draw. The daily game works
// through a shuffled copy of the whole pool, a slice per day, so nothing comes back until
// the pool has been used up; then the pool is reshuffled for the next cycle.
function deal(list, size, salt) {
  if (!state.daily) return shuffle(list).slice(0, size);
  const days = Math.floor(list.length / size);       // days in one cycle
  const d = state.daily - 1;
  const cycle = Math.floor(d / days);
  const start = (d % days) * size;
  return shuffle(list, seededRng((cycle + 1) * 104729 + salt * 7919)).slice(start, start + size);
}

// Remember today's daily result, so the title screen can show it.
const DAILY_KEY = 'lle_daily';
function loadDaily() {
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_KEY));
    return saved && saved.n === dailyNumber() ? saved : null;
  } catch { return null; }
}
function saveDaily(years) {
  try { localStorage.setItem(DAILY_KEY, JSON.stringify({ n: dailyNumber(), years })); } catch { /* storage unavailable */ }
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

function courtRow(openSeat) {
  const seats = SEAT_ORDER.map((key) => {
    const s = DATA.seats[key];
    const held = state.seats[key];
    return `<div class="seat ${key === openSeat ? 'open' : ''}">
      <div>${s.icon}</div>
      <div class="who">${held ? esc(held.leader.name) : s.name}</div>
      <div class="str ${held ? 'gold' : 'muted'}">${held ? seatStrength(key) : '?'}</div>
    </div>`;
  }).join('');
  return `<div class="seats">${seats}</div>`;
}

function hud() {
  let pillars = '';
  for (let i = 0; i < DATA.startStability; i++) {
    pillars += `<span class="${i < state.stability ? '' : 'lost'}">🏛️</span>`;
  }
  const track = state.crises.map((_, i) => {
    const r = state.results[i];
    const cls = r === true ? 'win' : r === false ? 'loss' : i === state.step ? 'now' : '';
    return `<i class="${cls}"></i>`;
  }).join('');
  return `<div class="hud">
    <div class="hud-row">
      <span class="era-label">Crisis ${state.step + 1} of ${state.crises.length}</span>
      <span class="pillars" aria-label="Stability ${state.stability} of ${DATA.startStability}">${pillars}</span>
    </div>
    <div class="track" style="grid-template-columns:repeat(${state.crises.length},1fr)">${track}</div>
    ${courtRow()}
  </div>`;
}

// ---------- screens ----------

function showTitle() {
  const best = loadBest();
  const today = loadDaily();
  render(`<div class="title-screen">
    <div>
      <div class="crest">🏛️</div>
      <h1>Long Live<br>the Empire</h1>
      <p class="muted" style="margin-top:8px">Pick four leaders from all of history. See if they can hold an empire together.</p>
    </div>
    <p class="goal"><b>Your goal:</b> keep the empire alive for as many years as you can.</p>
    <ol class="steps">
      <li>Pick a Ruler, a General, a Scholar and an Envoy.</li>
      <li>Watch them face ${DATA.crisesPerGame} real crises, from 500 BC to 1900 AD.</li>
      <li>Three failures and the empire falls.</li>
    </ol>
    <div style="display:grid;gap:10px">
      <input id="empire-name" type="text" maxlength="24" placeholder="Name your empire" autocomplete="off">
      <button class="primary" id="daily">${today ? 'Replay' : 'Play'} today's empire · #${dailyNumber()}</button>
      <button class="ghost" id="free">Free play</button>
      <p class="muted small center">${today ? `Today's empire lasted ${fmtNum(today.years)} years. New leaders and new crises arrive at midnight.` : `A new empire every day: new leaders, new crises, the same for everyone.`}${best ? `<br>Your longest reign: ${fmtNum(best)} years` : ''}</p>
    </div>
    <details class="more howto">
      <summary>How to play</summary>
    <ul class="rules">
      <li><span>👑</span><span><b>Pick your court first.</b> For each of the four seats you see three real people, drawn from any century and any part of the world. Choose one.</span></li>
      <li><span>❓</span><span><b>Strength is hidden</b> until you choose, so what you know matters. Then you see how all three really measured up.</span></li>
      <li><span>🔥</span><span><b>Then history strikes.</b> Your court answers each crisis itself, sending whoever has the best odds. The stronger they are, and the better they suit the threat, the better the odds.</span></li>
      <li><span>⏳</span><span><b>Leaders tire.</b> Each crisis a leader answers costs them 1 strength, so one hero cannot carry the empire. All four picks matter.</span></li>
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
    pick: 0,          // which seat is being filled (index into SEAT_ORDER)
    step: 0,          // which crisis is being faced (index into crises)
    crises: [],       // { c, wiki } entries from crisisPool(), in date order
    stability: DATA.startStability,
    seats: {},        // seat key -> { leader, sent }
    results: [],      // per crisis: true = survived, false = failed
    picks: [],        // per seat: { leader, best }
    fall: null,       // { year, title, holder, lose }
    shown: null,
  };
  state.crises = deal(crisisPool(), DATA.crisesPerGame, 99).sort((a, b) => a.c.year - b.c.year);
  showPick();
}

function showPick() {
  const key = SEAT_ORDER[state.pick];
  const seat = DATA.seats[key];
  state.shown = deal(seatPool(key), 3, state.pick + 1);
  const cards = state.shown.map((l, i) => `<button class="card" data-i="${i}">
    <span class="name">${esc(l.name)}</span>
    <span class="meta">${esc(l.title)} · ${esc(l.place)}</span>
    <span class="meta">${esc(l.lived)}</span>
  </button>`).join('');
  render(`${courtRow(key)}
    <div>
      <p class="muted small">Seat ${state.pick + 1} of ${SEAT_ORDER.length}</p>
      <h2>${seat.icon} Choose your ${seat.name}</h2>
      <p class="muted small" style="margin-top:4px">${EXTRA.seatJobs[key]} Who was really the best at it?</p>
    </div>
    <div class="cards">${cards}</div>`);
  app.querySelectorAll('.card').forEach((b) => { b.onclick = () => choose(Number(b.dataset.i)); });
}

function choose(index) {
  const key = SEAT_ORDER[state.pick];
  const leader = state.shown[index];
  const best = state.shown.reduce((a, b) => (b.rating > a.rating ? b : a));
  state.seats[key] = { leader, sent: 0 };
  state.picks[state.pick] = { leader, best };

  let verdict;
  if (leader.rating >= best.rating) verdict = `<span class="gold">The strongest of the three.</span>`;
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

  const last = state.pick === SEAT_ORDER.length - 1;
  const nextLabel = last ? 'Your court is set. Watch history unfold' : `Next: choose your ${DATA.seats[SEAT_ORDER[state.pick + 1]].name}`;

  // The button sits above the cards so nobody has to scroll to move on; the cards are there to browse.
  render(`${courtRow(key)}
    <p class="verdict">${verdict}</p>
    <button class="primary" id="next">${nextLabel}</button>
    ${links}
    <div class="cards">${cards}</div>
    <button class="ghost" id="next-bottom">${nextLabel}</button>`);
  const go = () => {
    if (last) return showChronicle();
    state.pick += 1;
    showPick();
  };
  document.getElementById('next').onclick = go;
  document.getElementById('next-bottom').onclick = go;
}

// The court answers each crisis on its own: it sends whoever has the best odds.
// Everything is decided here, up front; the screen then plays it back one crisis at a time.
function planChronicle() {
  const sent = {};
  SEAT_ORDER.forEach((k) => { sent[k] = 0; });
  const strengthOf = (seat) => {
    state.seats[seat].sent = sent[seat];
    return seatStrength(seat);
  };
  const plan = [];
  let fails = 0;
  for (let step = 0; step < state.crises.length && fails < DATA.startStability; step++) {
    const { c, wiki } = state.crises[step];
    const scored = c.options.map((o) => {
      const strength = strengthOf(o.seat);
      return { o, strength, p: DATA.chance(strength, o.mod, step) };
    });
    const pick = scored.reduce((a, b) => (b.p > a.p ? b : a));
    const won = state.rng() < pick.p;
    if (!won) fails += 1;
    sent[pick.o.seat] += 1;
    plan.push({ wiki, c, o: pick.o, strength: pick.strength, p: pick.p, won, holder: state.seats[pick.o.seat].leader.name });
  }
  SEAT_ORDER.forEach((k) => { state.seats[k].sent = 0; });
  return plan;
}

function showChronicle() {
  const plan = planChronicle();
  const STEP_MS = 1900;
  let shown = 0;
  let timer = null;

  render(`<div id="top" class="sticky">${hud()}</div>
    <p class="muted small">Your court answers each crisis itself, sending whoever has the best odds. Whoever goes comes back 1 weaker.</p>
    <div class="cards" id="log"></div>
    <div id="foot"><button class="ghost" id="skip">Skip to the end</button></div>`);
  const top = document.getElementById('top');
  const log = document.getElementById('log');
  const foot = document.getElementById('foot');

  const revealNext = (scroll) => {
    const e = plan[shown];
    state.step = shown;
    state.results[shown] = e.won;
    state.seats[e.o.seat].sent += 1;
    if (!e.won) state.stability -= 1;
    const fallen = state.stability <= 0;
    if (fallen) state.fall = { year: e.c.year, title: e.c.title, holder: e.holder, lose: e.o.lose };
    shown += 1;

    const seat = DATA.seats[e.o.seat];
    const fit = e.o.mod > 0 ? 'a good fit' : e.o.mod === 0 ? 'a fair fit' : 'a poor fit';
    const card = document.createElement('div');
    card.className = 'crisis-box fade-in';
    card.innerHTML = `<span class="year">${fmtYear(e.c.year)} · ${esc(e.c.title)}</span>
      <p class="small">${esc(e.c.text)}</p>
      <p class="muted small">${seat.icon} ${esc(e.holder)} answers: ${esc(e.o.label.charAt(0).toLowerCase() + e.o.label.slice(1).replace(/\.$/, ''))}. Strength ${e.strength}, ${fit}: ${Math.round(e.p * 100)}% chance.</p>
      <p class="result ${e.won ? 'win' : 'loss'}">${e.won ? '✓' : '✗'} ${esc(e.holder)} ${esc(e.won ? e.o.win : e.o.lose)}</p>
      ${e.won ? '' : `<p class="muted small">${fallen ? 'The last pillar falls.' : 'The empire loses a pillar.'}</p>`}
      <details class="more"><summary>What really happened</summary>
        <p>${esc(e.c.fact)}</p>
        <p>${wikiLink(e.wiki, 'Read the full story on Wikipedia')}</p>
      </details>`;
    log.appendChild(card);
    top.innerHTML = hud();
    if (scroll) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const finish = () => {
    clearTimeout(timer);
    foot.innerHTML = `<button class="primary" id="next">${state.fall ? 'See how it ended' : 'See your legacy'}</button>`;
    document.getElementById('next').onclick = showEnd;
  };

  const tick = () => {
    revealNext(true);
    if (shown >= plan.length) return finish();
    timer = setTimeout(tick, STEP_MS);
  };

  document.getElementById('skip').onclick = () => {
    clearTimeout(timer);
    while (shown < plan.length) revealNext(false);
    finish();
    foot.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  timer = setTimeout(tick, 700);
}

function showEnd() {
  const survived = !state.fall;
  const endYear = survived ? DATA.endYear : state.fall.year;
  const years = endYear - DATA.startYear;
  const ruler = state.seats.ruler.leader.name;
  const greatest = state.picks.reduce((a, b) => (b.leader.rating > a.leader.rating ? b : a)).leader.name;
  const sharp = state.picks.filter((p) => p.leader.rating >= p.best.rating).length;
  const squares = state.results.map((r) => (r ? '🟩' : '🟥')).join('');
  const court = SEAT_ORDER.map((k) => `${DATA.seats[k].icon} ${state.seats[k].leader.name}`);

  const best = loadBest();
  const record = years > best;
  if (record) saveBest(years);
  if (state.daily && !loadDaily()) saveDaily(years);   // keep the first attempt of the day

  const story = survived
    ? `Ruled by ${ruler}. Still standing in ${fmtYear(DATA.endYear)}: the empire that never fell.`
    : `Ruled by ${ruler}. Undone in ${fmtYear(state.fall.year)}, when ${state.fall.holder} ${state.fall.lose}`;

  const shareText = [
    state.daily ? `Long Live the Empire · Daily #${state.daily}` : 'Long Live the Empire',
    `🏛️ The Empire of ${state.name}`,
    `${fmtYear(DATA.startYear)} → ${fmtYear(endYear)} · ${fmtNum(years)} years`,
    squares,
    court.join(' · '),
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
      <p class="muted small">${court.map(esc).join('<br>')}</p>
    </div>
    <p class="muted small center">Greatest servant: <span class="gold">${esc(greatest)}</span><br>
      You picked the strongest candidate for ${sharp} of ${state.picks.length} seats.</p>
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
