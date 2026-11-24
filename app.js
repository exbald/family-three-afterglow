"use strict";
const KEY = location.pathname + ":kmlog:runs";
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const ACCENT = cssVar("--accent") || "#ff8c3a";
const MARK = cssVar("--mark") || "#a3552a";
const $ = id => document.getElementById(id);
const fmt = n => n.toFixed(1);

function loadRuns() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : null;
    if (Array.isArray(arr)) return arr;
  } catch (e) { /* ignore */ }
  return null;
}
function saveRuns(runs) { try { localStorage.setItem(KEY, JSON.stringify(runs)); } catch (e) { /* ignore */ } }

/* Local calendar dates (not UTC), so "today" matches the runner's clock. */
const pad2 = n => String(n).padStart(2, "0");
function iso(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
function fromISO(s) { const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function weekStart(dateStr) {
  const d = fromISO(dateStr);
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  return iso(addDays(d, -dow));
}
function daysAgoISO(n) { return iso(addDays(new Date(), -n)); }
function pretty(s) { return fromISO(s).toLocaleDateString(undefined, { day: "numeric", month: "short" }); }

/* ---- seed: believable sample data so the first open is never empty ---- */
function seed() {
  let s = 42;
  const rand = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const runs = [];
  for (let w = 12; w >= 1; w--) {
    const count = 3 + Math.floor(rand() * 2);
    const slots = [0, 2, 4, 6];
    for (let i = 0; i < count; i++) {
      const ws = weekStart(daysAgoISO(w * 7 - 1));
      const slot = slots[i];
      const date = iso(addDays(fromISO(ws), slot));
      const base = 5 + w * 0.3 + rand() * 3;
      let km = base + (slot === 6 ? 4 : 0);
      km = Math.max(3, Math.round(km * 10) / 10);
      const pace = 5.4 + rand() * 0.9;
      const min = Math.round(km * pace);
      runs.push({ id: "seed-" + w + "-" + i, date, km, min });
    }
  }
  const recent = [[0, 5.2, 27], [1, 8.0, 42], [2, 4.5, 24]];
  for (const r of recent) {
    runs.push({ id: "recent-" + r[0], date: daysAgoISO(r[0]), km: r[1], min: r[2] });
  }
  return runs;
}

/* ---- stats ---- */
function weekKm(runs, ws) {
  let sum = 0;
  for (const r of runs) if (weekStart(r.date) === ws) sum += r.km;
  return sum;
}
function currentStreak(runs) {
  const days = new Set(runs.map(r => r.date));
  let streak = 0;
  let d = daysAgoISO(0);
  if (!days.has(d)) d = daysAgoISO(1);
  if (!days.has(d)) return 0;
  while (days.has(d)) {
    streak++;
    d = iso(addDays(fromISO(d), -1));
  }
  return streak;
}

/* One short encouraging line under the streak counter. */
function cheerLine(streak, ranToday) {
  if (streak === 0) return "A clean page today — even a short one counts.";
  if (streak === 1) return "One day down. Tomorrow is where a streak begins.";
  if (streak >= 21) return "<b>" + streak + " days strong</b> — that's a habit now.";
  if (streak >= 7) return "<b>" + streak + " days strong</b>. A full week and counting.";
  if (!ranToday) return "<b>" + streak + " days so far</b> — today's run keeps it alive.";
  return "<b>" + streak + " days strong</b>. Keep the glow going.";
}

/* ---- live streak clock (hours/minutes/seconds until it can break) ---- */
function updateClock(runs) {
  const now = new Date();
  const runDays = new Set(runs.map(r => r.date));
  const today = iso(now);
  const clock = $("clock");
  const cap = $("streakCap");
  const secsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const left = 86400 - secsToday;
  const hh = pad2(Math.floor(left / 3600));
  const mm = pad2(Math.floor((left % 3600) / 60));
  const ss = pad2(left % 60);
  clock.textContent = hh + ":" + mm + ":" + ss;
  if (runDays.has(today)) {
    clock.className = "clock";
    cap.innerHTML = 'run logged today — streak <b>safe</b> until midnight';
  } else {
    clock.className = "clock warn";
    cap.innerHTML = 'until streak breaks — <b>log a run today</b>';
  }
}

/* ---- chart ---- */
const WEEKS_SHOWN = 12;
let lastWeeks = [];
let tipBound = false;
function renderChart(runs) {
  const svg = $("chart");
  const W = 640, H = 220;
  const pad = { l: 34, r: 8, t: 16, b: 24 };
  const weeks = [];
  const curWS = weekStart(daysAgoISO(0));
  for (let i = WEEKS_SHOWN - 1; i >= 0; i--) {
    const ws = weekStart(daysAgoISO(i * 7));
    weeks.push({ ws, km: weekKm(runs, ws), count: runs.filter(r => weekStart(r.date) === ws).length });
  }
  const maxKm = Math.max.apply(null, weeks.map(w => w.km).concat([10]));
  const niceMax = Math.ceil(maxKm / 10) * 10;
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const band = plotW / weeks.length;
  const barW = Math.max(10, Math.min(28, band * 0.55));
  let out = [];
  for (let g = 0; g <= 2; g++) {
    const v = niceMax / 2 * g;
    const y = pad.t + plotH * (1 - v / niceMax);
    out.push('<line x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)" stroke-width="1"/>');
    out.push('<text x="' + (pad.l - 6) + '" y="' + (y + 3) + '" text-anchor="end" fill="var(--ink-3)" font-size="10">' + Math.round(v) + '</text>');
  }
  weeks.forEach(function (wk, i) {
    const x = pad.l + band * i + (band - barW) / 2;
    const h = niceMax ? wk.km / niceMax * plotH : 0;
    const y = pad.t + plotH - h;
    const cur = wk.ws === curWS;
    const fill = cur ? ACCENT : MARK;
    const r = Math.min(6, h / 2);
    if (wk.km > 0) {
      out.push('<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(0, h).toFixed(1) + '" rx="' + r.toFixed(1) + '" fill="' + fill + '"/>');
    } else {
      out.push('<line x1="' + x.toFixed(1) + '" x2="' + (x + barW).toFixed(1) + '" y1="' + (pad.t + plotH) + '" y2="' + (pad.t + plotH) + '" stroke="var(--ink-3)" stroke-width="2"/>');
    }
    if (cur) {
      out.push('<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" fill="' + ACCENT + '" font-size="11" font-weight="900">' + fmt(wk.km) + '</text>');
    }
    out.push('<text x="' + (pad.l + band * i + band / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" fill="var(--ink-3)" font-size="10">' + pretty(wk.ws) + '</text>');
    out.push('<rect class="hit" data-i="' + i + '" x="' + (pad.l + band * i).toFixed(1) + '" y="' + pad.t + '" width="' + band.toFixed(1) + '" height="' + plotH + '" fill="transparent"/>');
  });
  svg.innerHTML = out.join("");
  lastWeeks = weeks;
  if (tipBound) return;
  tipBound = true;
  const tip = $("tooltip");
  function onPoint(e) {
    const t = e.target;
    if (t.classList && t.classList.contains("hit") && typeof e.clientX === "number") {
      const wk = lastWeeks[+t.getAttribute("data-i")];
      if (!wk) return;
      const end = iso(addDays(fromISO(wk.ws), 6));
      tip.innerHTML = '<div class="t-label">' + pretty(wk.ws) + " → " + pretty(end) + '</div>' +
        '<div class="t-value"><em>' + fmt(wk.km) + ' km</em> · ' + wk.count + (wk.count === 1 ? ' run' : ' runs') + '</div>';
      tip.style.left = Math.min(e.clientX + 12, window.innerWidth - 160) + "px";
      tip.style.top = (e.clientY - 14) + "px";
      tip.style.display = "block";
    } else {
      tip.style.display = "none";
    }
  }
  svg.addEventListener("mousemove", onPoint);
  svg.addEventListener("click", onPoint);
  svg.addEventListener("mouseleave", function () { tip.style.display = "none"; });
}

/* ---- run list ---- */
function paceStr(r) {
  const p = r.min / r.km;
  const m = Math.floor(p);
  return m + ":" + pad2(Math.round((p - m) * 60)) + "/km";
}
function timeStr(min) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? h + ":" + pad2(m) + "h" : m + "m";
}
function renderList(runs) {
  const el = $("runList");
  const sorted = runs.slice().sort(function (a, b) { return b.date < a.date ? -1 : b.date > a.date ? 1 : b.id < a.id ? -1 : 1; });
  const show = sorted.slice(0, 15);
  if (!show.length) {
    el.innerHTML = '<div class="empty">No runs yet — log your first one.</div>';
  } else {
    el.innerHTML = show.map(function (r) {
      return '<div class="run">' +
        '<span class="d">' + pretty(r.date) + '</span>' +
        '<span class="km">' + fmt(r.km) + '</span>' +
        '<span class="time">' + timeStr(r.min) + '</span>' +
        '<span class="pace">' + paceStr(r) + '</span>' +
        '<button class="del" data-id="' + r.id + '" aria-label="delete run">DEL</button>' +
        '</div>';
    }).join("");
  }
}

/* ---- render all ---- */
function renderAll(runs) {
  const today = daysAgoISO(0);
  const curWS = weekStart(today);
  const lastWS = weekStart(daysAgoISO(7));
  const wk = weekKm(runs, curWS);
  const lw = weekKm(runs, lastWS);
  $("weekKm").textContent = fmt(wk);
  const sub = $("weekSub");
  if (lw > 0) {
    const diff = wk - lw;
    const sign = diff >= 0 ? "+" : "−";
    sub.textContent = sign + fmt(Math.abs(diff)) + " km vs last week";
    sub.className = "sub" + (diff >= 0 ? " up" : "");
  } else {
    sub.textContent = "no data for last week";
  }
  const streak = currentStreak(runs);
  const ranToday = runs.some(r => r.date === today);
  $("streak").textContent = streak;
  $("streakCheer").innerHTML = cheerLine(streak, ranToday);
  let avg = 0;
  for (let i = 1; i <= 4; i++) avg += weekKm(runs, weekStart(daysAgoISO(i * 7)));
  $("avgKm").textContent = fmt(avg / 4);
  const total = runs.reduce(function (s, r) { return s + r.km; }, 0);
  $("totalKm").textContent = fmt(total);
  $("totalSub").textContent = runs.length + " runs";
  $("today").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  $("chartRange").textContent = WEEKS_SHOWN + " weeks";
  renderChart(runs);
  renderList(runs);
}

function init() {
  let runs = loadRuns();
  if (!runs) {
    runs = seed();
    saveRuns(runs);
  }
  renderAll(runs);
  updateClock(runs);
  setInterval(function () { updateClock(runs); }, 1000);
  $("fDate").value = daysAgoISO(0);
  $("addForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const date = $("fDate").value;
    const km = parseFloat($("fKm").value);
    const min = parseFloat($("fMin").value);
    const msg = $("msg");
    if (!date || !(km > 0) || !(min > 0)) {
      msg.textContent = "fill date, km, minutes";
      msg.className = "msg err";
      return;
    }
    runs.push({ id: "run-" + Date.now(), date, km: Math.round(km * 10) / 10, min: Math.round(min) });
    saveRuns(runs);
    renderAll(runs);
    updateClock(runs);
    msg.textContent = "run added";
    msg.className = "msg ok";
    $("fKm").value = "";
    $("fMin").value = "";
  });
  $("runList").addEventListener("click", function (e) {
    const btn = e.target.closest(".del");
    if (!btn) return;
    runs = runs.filter(function (r) { return r.id !== btn.dataset.id; });
    saveRuns(runs);
    renderAll(runs);
    updateClock(runs);
  });
}

init();
