/**
 * Live survey results (Slide 30): polls the public response sheet every few
 * seconds and shows how many answers arrived and how many were right per question.
 * Reads the sheet's gviz CSV endpoint; the sheet must be shared "anyone with the link".
 */
(function () {
  'use strict';

  const SHEET_ID = '1_xMRD0uRkYt_HaGlDXuvAQ6KM_t2LRzJ_aPZhNlLitI';
  const SHEET_GID = '953166965';
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
  const POLL_MS = 5000;
  const CHIMP = 1 / 3;

  // Form order; correct answers as in demo/bigquery-survey.sql
  const QUESTIONS = [
    { short: 'Girls finishing primary school', correct: '60 percent' },
    { short: 'Where most people live',         correct: 'Middle-income countries' },
    { short: 'Extreme poverty, last 20 years', correct: 'almost halved' },
    { short: 'World life expectancy',          correct: '70 years' },
    { short: 'Children in 2100',               correct: '2 billion' },
    { short: 'Why population grows',           correct: 'There will be more adults (age 15 to 74)' },
    { short: 'Deaths from natural disasters',  correct: 'Decreased to less than half' },
    { short: 'People per continent',           correct: '1B Africa, 1B Americas, 4B Asia, 1B Europe' },
    { short: 'Vaccinated one-year-olds',       correct: '80 percent' },
    { short: "Women's years in school",        correct: '9 years' },
    { short: 'Endangered species since 1996',  correct: 'None of them' },
    { short: 'Access to electricity',          correct: '80 percent' },
    { short: 'Climate in 100 years',           correct: 'get warmer' }
  ];

  let timer = null;
  let built = false;
  let revealed = false;
  let lastCount = -1;
  let sessionOnly = true;

  function build() {
    if (built) return;
    const host = document.getElementById('survey-live');
    if (!host) return;
    built = true;

    host.innerHTML = `
      <div class="live-head">
        <div class="live-stat">
          <div class="live-count" id="live-count">0</div>
          <div class="live-count-label" id="live-count-label">answers so far</div>
        </div>
        <div class="live-stat live-overall">
          <div class="live-count" id="live-overall">–</div>
          <div class="live-count-label">of all answers correct</div>
        </div>
        <div class="live-status" id="live-status">Waiting for the sheet…</div>
      </div>
      <div class="live-rows" id="live-rows"></div>
      <div class="live-foot">
        <span class="live-legend"><i class="ok"></i>share answered correctly</span>
        <span class="live-legend live-ko"><i class="ko"></i>below the chimpanzee</span>
        <span class="live-legend live-chimp" id="live-chimp-legend"><i></i>a chimpanzee: 33 %</span>
        <button class="toggle-btn" id="live-reveal">Reveal the chimpanzee</button>
        <button class="toggle-btn" id="live-scope" title="Only today's answers, or every answer ever collected">Today only</button>
      </div>`;

    const rows = document.getElementById('live-rows');
    QUESTIONS.forEach((q, i) => {
      const row = document.createElement('div');
      row.className = 'live-row';
      row.innerHTML = `
        <span class="live-q"><b>${i + 1}</b>${q.short}</span>
        <span class="live-bar"><i class="live-fill" id="live-fill-${i}"></i><i class="live-mark" id="live-mark-${i}"></i></span>
        <span class="live-pct" id="live-pct-${i}">–</span>`;
      rows.appendChild(row);
    });

    document.getElementById('live-reveal').addEventListener('click', e => {
      revealed = !revealed;
      e.currentTarget.classList.toggle('active', revealed);
      e.currentTarget.textContent = revealed ? 'Hide the chimpanzee' : 'Reveal the chimpanzee';
      host.classList.toggle('revealed', revealed);
    });
    document.getElementById('live-scope').addEventListener('click', e => {
      sessionOnly = !sessionOnly;
      e.currentTarget.textContent = sessionOnly ? 'Today only' : 'All sessions';
      e.currentTarget.classList.toggle('active', !sessionOnly);
      lastCount = -1;
      poll();
    });
  }

  async function poll() {
    const status = document.getElementById('live-status');
    try {
      const resp = await fetch(CSV_URL + '&_=' + Date.now(), { cache: 'no-store' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const text = await resp.text();
      const data = d3.csvParseRows(text);
      render(data);
      status.textContent = 'Live · updated ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      status.classList.remove('is-error');
    } catch (err) {
      status.textContent = 'Sheet not readable yet (share it with "anyone with the link")';
      status.classList.add('is-error');
    }
  }

  function render(data) {
    const body = data.slice(1).filter(r => r[0] && r[0].trim());
    const today = new Date();
    const isToday = r => {
      const d = parseTs(r[0]);
      return d && d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    };
    const rows = sessionOnly ? body.filter(isToday) : body;

    const n = rows.length;
    const countEl = document.getElementById('live-count');
    if (n !== lastCount) {
      animateCount(countEl, lastCount < 0 ? 0 : lastCount, n);
      lastCount = n;
    }
    document.getElementById('live-count-label').textContent =
      (n === 1 ? 'answer' : 'answers') + (sessionOnly ? ' so far today' : ' in total');

    let totalAnswered = 0, totalCorrect = 0;
    QUESTIONS.forEach((q, i) => {
      const answered = rows.filter(r => (r[i + 1] || '').trim());
      const correct = answered.filter(r => r[i + 1].trim() === q.correct).length;
      const share = answered.length ? correct / answered.length : 0;
      totalAnswered += answered.length; totalCorrect += correct;
      const fill = document.getElementById(`live-fill-${i}`);
      fill.style.width = (share * 100).toFixed(1) + '%';
      fill.classList.toggle('below-chimp', answered.length > 0 && share <= CHIMP);
      document.getElementById(`live-mark-${i}`).style.left = (CHIMP * 100).toFixed(1) + '%';
      const pct = document.getElementById(`live-pct-${i}`);
      pct.textContent = answered.length ? Math.round(share * 100) + ' %' : '–';
      pct.classList.toggle('below-chimp', answered.length > 0 && share <= CHIMP);
    });

    // overall hit rate across every answered question, next to the chimpanzee's 33 %
    const overall = document.getElementById('live-overall');
    if (totalAnswered) {
      const rate = totalCorrect / totalAnswered;
      overall.textContent = Math.round(rate * 100) + ' %';
      overall.classList.toggle('below-chimp', rate <= CHIMP);
    } else {
      overall.textContent = '–';
      overall.classList.remove('below-chimp');
    }
  }

  function parseTs(v) {
    const d = new Date(v);
    if (!isNaN(d)) return d;
    const m = String(v).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);   // 05.10.2026 14:03:21
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    const u = String(v).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);   // 10/5/2026 14:03:21 (US sheets)
    if (u) return new Date(+u[3], +u[1] - 1, +u[2]);
    return null;
  }

  function animateCount(el, from, to) {
    const t0 = performance.now(), dur = 600;
    function step(now) {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function start() { build(); poll(); if (!timer) timer = setInterval(poll, POLL_MS); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 30) start(); else stop();
    });
  });
})();
