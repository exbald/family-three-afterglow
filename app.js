// Sunny Miles — warm, friendly running tracker
(function () {
  'use strict';

  var PATH = location.pathname;
  var RUNS_KEY = PATH + ':runs';
  var GOAL_KEY = PATH + ':goal';

  // ---- state ----
  var runs = [];
  var goal = 15;
  var pendingKm = 3.0;

  // ---- date helpers ----
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function dateToStr(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function todayStr() {
    return dateToStr(new Date());
  }

  function parseDate(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function addDays(d, n) {
    var x = new Date(d.getTime());
    x.setDate(x.getDate() + n);
    return x;
  }

  function mondayOf(d) {
    var x = new Date(d.getTime());
    var day = x.getDay();
    var diff = day === 0 ? 6 : day - 1;
    x.setDate(x.getDate() - diff);
    return x;
  }

  // ---- storage ----
  function load() {
    try {
      var raw = localStorage.getItem(RUNS_KEY);
      if (raw) {
        runs = JSON.parse(raw) || [];
      } else {
        seedSample();
      }
      var g = localStorage.getItem(GOAL_KEY);
      if (g) goal = +g;
    } catch (e) {
      runs = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
      localStorage.setItem(GOAL_KEY, String(goal));
    } catch (e) { /* private mode */ }
  }

  // Believable sample data so the first open is never empty.
  function seedSample() {
    runs = [];
    var today = new Date();
    var plan = [4.2, 0, 6.1, 0, 3.4, 5.0, 2.8, 0, 7.5, 0, 4.6, 3.2, 0, 5.5, 6.3, 0, 4.1, 3.8];
    for (var i = plan.length - 1; i >= 0; i--) {
      var km = plan[i];
      if (km > 0) {
        runs.push({ date: dateToStr(addDays(today, -i)), km: km, id: Date.now() + i });
      }
    }
    save();
  }

  // ---- calculations ----
  function kmOn(dateStr) {
    var total = 0;
    for (var i = 0; i < runs.length; i++) {
      if (runs[i].date === dateStr) total += runs[i].km;
    }
    return total;
  }

  function weekStart() {
    return mondayOf(new Date());
  }

  function weekTotals() {
    var mon = weekStart();
    var out = [];
    for (var i = 0; i < 7; i++) {
      out.push(kmOn(dateToStr(addDays(mon, i))));
    }
    return out;
  }

  function weekSum(totals) {
    var s = 0;
    for (var i = 0; i < totals.length; i++) s += totals[i];
    return Math.round(s * 10) / 10;
  }

  // Consecutive days with a run, ending today (or yesterday if today has none).
  function streak() {
    var t = todayStr();
    if (kmOn(t) <= 0 && kmOn(dateToStr(addDays(new Date(), -1))) <= 0) return 0;
    var start = kmOn(t) > 0 ? new Date() : addDays(new Date(), -1);
    var count = 0;
    while (kmOn(dateToStr(start)) > 0) {
      count++;
      start = addDays(start, -1);
    }
    return count;
  }

  // ---- rendering ----
  var $ = function (id) { return document.getElementById(id); };
  var CHEERS = [
    'You did it! 🎉',
    'Great pace out there! 🏃',
    'Every step counts! 💛',
    'Boom — strong run! 💪',
    'Way to go! 🌟',
    'Look at you go! ✨',
    'That’s the spirit! 🔥'
  ];

  function fmt(n) { return (Math.round(n * 10) / 10).toString(); }

  function cheer() {
    return CHEERS[Math.floor(Math.random() * CHEERS.length)];
  }

  function render() {
    renderStats();
    renderChart();
    renderRuns();
  }

  function renderStats() {
    var totals = weekTotals();
    var sum = weekSum(totals);
    $('week-total').textContent = fmt(sum);
    $('goal-text').textContent = 'Goal ' + goal + ' km';
    var pct = Math.min(100, Math.round((sum / goal) * 100));
    var bar = $('goal-bar');
    var fill = $('goal-fill');
    fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', pct);
    var msg = $('goal-message');
    var wasReached = bar.classList.contains('reached');
    var reached = sum >= goal;
    bar.classList.toggle('reached', reached);
    if (reached) {
      msg.textContent = 'Weekly goal smashed! 🎉';
      if (!wasReached && renderStats._init) celebrate('Weekly goal smashed! 🎉');
    } else {
      var left = Math.round((goal - sum) * 10) / 10;
      msg.textContent = fmt(left) + ' km to go — you’ve got this!';
    }
    renderStats._init = true;

    var s = streak();
    $('streak').textContent = s;
    $('streak-sub').textContent = s === 1 ? 'day in a row' : 'days in a row';
    var greet = s >= 3 ? 'That streak is on fire! 🔥' : 'Let’s get moving today!';
    if (kmOn(todayStr()) > 0) greet = 'Today’s run is in the bag! ✅';
    $('greeting').textContent = greet;
  }

  function renderChart() {
    var chart = $('chart');
    chart.innerHTML = '';
    var totals = weekTotals();
    var mon = weekStart();
    var names = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    var fullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var max = 0, maxIdx = 0;
    for (var i = 0; i < 7; i++) {
      if (totals[i] > max) { max = totals[i]; maxIdx = i; }
    }
    var todayIdx = Math.round((new Date() - mon) / 86400000);
    for (var j = 0; j < 7; j++) {
      var col = document.createElement('div');
      col.className = 'bar-col';
      var val = document.createElement('span');
      val.className = 'bar-value';
      var v = totals[j];
      if (v > 0) {
        val.textContent = fmt(v);
        val.style.visibility = 'visible';
      } else {
        val.style.visibility = 'hidden';
      }
      if (j !== maxIdx) val.style.visibility = 'hidden';
      col.appendChild(val);
      var bar = document.createElement('div');
      bar.className = 'bar' + (v === 0 ? ' zero' : '');
      var h = max > 0 ? (v / max) * 100 : 0;
      bar.style.height = v === 0 ? '' : Math.max(8, h) + '%';
      bar.setAttribute('data-day', fullNames[j] + ': ' + fmt(v) + ' km');
      bar.setAttribute('tabindex', '0');
      bar.setAttribute('role', 'listitem');
      col.appendChild(bar);
      var lbl = document.createElement('span');
      lbl.className = 'day-label' + (j === todayIdx ? ' today' : ' ');
      lbl.textContent = names[j];
      col.appendChild(lbl);
      chart.appendChild(col);
    }
  }

  function renderRuns() {
    var list = $('runs-list');
    list.innerHTML = '';
    var sorted = runs.slice().sort(function (a, b) {
      return b.date < a.date ? -1 : b.date > a.date ? 1 : b.id - a.id;
    });
    var recent = sorted.slice(0, 8);
    if (recent.length === 0) {
      var li = document.createElement('li');
      li.className = 'empty-note';
      li.textContent = 'No runs yet — your first one is waiting!';
      list.appendChild(li);
    }
    for (var i = 0; i < recent.length; i++) {
      var r = recent[i];
      var li = document.createElement('li');
      var d = parseDate(r.date);
      var label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      li.innerHTML = '<span class="run-date">' + label + '</span>' +
        '<span class="run-dist">' + fmt(r.km) + ' km</span>';
      var del = document.createElement('button');
      del.className = 'run-del';
      del.textContent = '✕';
      del.setAttribute('aria-label', 'Delete ' + fmt(r.km) + ' km run on ' + label);
      del.addEventListener('click', function (run) {
        return function () {
          runs = runs.filter(function (x) { return x.id !== run.id; });
          save();
          render();
          toast('Run removed');
        };
      }(r));
      li.appendChild(del);
      list.appendChild(li);
    }
  }

  // ---- tooltip ----
  function tipFor(el) {
    return el.getAttribute('data-day') || '';
  }

  function showTip(bar, col) {
    var tip = $('chart-tip');
    tip.textContent = tipFor(bar);
    tip.hidden = false;
    var wrap = document.querySelector('.chart-wrap') || $('chart').parentElement;
    var cr = bar.getBoundingClientRect();
    var wr = wrap.getBoundingClientRect();
    tip.style.left = (cr.left - wr.left + cr.width / 2) + 'px';
    tip.style.top = (cr.top - wr.top) + 'px';
  }

  function hideTip() {
    $('chart-tip').hidden = true;
  }

  // ---- log / delete ----
  function logRun() {
    var km = Math.round(pendingKm * 10) / 10;
    if (km <= 0) return;
    var alreadyToday = kmOn(todayStr()) > 0;
    var streakBefore = streak();
    runs.push({ date: todayStr(), km: km, id: Date.now() });
    save();
    render();
    var msgs = [cheer()];
    if (!alreadyToday) {
      var s = streak();
      if (s >= 2 && s > streakBefore) msgs.push(s + '-day streak! 🔥');
    }
    var sum = weekSum(weekTotals());
    if (sum >= goal) msgs.push('Weekly goal smashed! 🎉');
    celebrate(msgs.join(' — '));
    pendingKm = 3.0;
    $('distance').textContent = '3.0';
  }

  function celebrate(message) {
    toast(message);
    confetti();
  }

  function toast(text) {
    var t = $('toast');
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      t.classList.remove('show');
    }, 2600);
  }

  function confetti() {
    var layer = $('confetti');
    var colors = ['#e8590c', '#ffd43b', '#2f9e44', '#ff8fab', '#74c0fc'];
    for (var i = 0; i < 36; i++) {
      var bit = document.createElement('div');
      bit.className = 'confetti-bit';
      bit.style.left = Math.random() * 100 + 'vw';
      bit.style.background = colors[i % colors.length];
      bit.style.animationDelay = (Math.random() * 0.4) + 's';
      layer.appendChild(bit);
    }
    clearTimeout(confetti._timer);
    confetti._timer = setTimeout(function () {
      layer.innerHTML = '';
    }, 2200);
  }

  // ---- wiring ----
  function bind() {
    $('dist-minus').addEventListener('click', function () {
      pendingKm = Math.max(0.5, Math.round((pendingKm - 0.5) * 10) / 10);
      $('distance').textContent = fmt(pendingKm);
    });
    $('dist-plus').addEventListener('click', function () {
      pendingKm = Math.min(99, Math.round((pendingKm + 0.5) * 10) / 10);
      $('distance').textContent = fmt(pendingKm);
    });
    var quicks = document.querySelectorAll('#quick-row button');
    for (var i = 0; i < quicks.length; i++) {
      quicks[i].addEventListener('click', function () {
        pendingKm = +this.getAttribute('data-quick');
        $('distance').textContent = fmt(pendingKm);
      });
    }
    $('log-btn').addEventListener('click', logRun);

    $('goal-minus').addEventListener('click', function () {
      goal = Math.max(5, goal - 5);
      save();
      render();
    });
    $('goal-plus').addEventListener('click', function () {
      goal = Math.min(200, goal + 5);
      save();
      render();
    });

    // Chart tooltip: hover, focus and tap.
    var chart = $('chart');
    chart.addEventListener('mouseover', function (e) {
      if (e.target.classList.contains('bar')) showTip(e.target);
    });
    chart.addEventListener('mouseout', hideTip);
    chart.addEventListener('focusin', function (e) {
      if (e.target.classList.contains('bar')) showTip(e.target);
    });
    chart.addEventListener('click', function (e) {
      if (!e.target.classList) return;
      if (e.target.classList.contains('bar')) {
        showTip(e.target);
        clearTimeout(chart._tipTimer);
        chart._tipTimer = setTimeout(hideTip, 1800);
      }
    });
  }

  // ---- init ----
  load();
  bind();
  render();
})();
