/**
 * Asking an AI block: accuracy cliff chart (Slide 28) and the
 * "how many countries are there?" definition picker (Slide 29)
 */
(function () {
  'use strict';

  let cliffRendered = false;
  let countriesWired = false;

  // ── Slide 26: correct vs silently wrong, one bar per data landscape ──────
  async function renderCliff() {
    if (cliffRendered) return;
    const container = document.getElementById('cliff-chart');
    if (!container) return;
    cliffRendered = true;

    const resp = await fetch('data/ai-accuracy.json');
    const data = await resp.json();
    const rows = data.rows;

    const css = getComputedStyle(document.documentElement);
    const colCorrect = css.getPropertyValue('--series-1').trim() || '#00b4d8';
    const colWrong   = css.getPropertyValue('--red').trim() || '#ef4444';

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 520;
    const margin = { top: 8, right: 96, bottom: 8, left: 380 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
    const y = d3.scaleBand().domain(rows.map(r => r.label)).range([0, innerH]).padding(0.34);

    const row = g.selectAll('.cliff-row').data(rows).enter().append('g')
      .attr('class', 'cliff-row')
      .attr('transform', d => `translate(0,${y(d.label)})`);

    // labels (business language) with the benchmark in small type underneath
    row.append('text').attr('class', 'row-label')
      .attr('x', -24).attr('y', y.bandwidth() / 2 - 6)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
      .text(d => d.label);
    row.append('text').attr('class', 'row-sub')
      .attr('x', -24).attr('y', y.bandwidth() / 2 + 18)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
      .text(d => d.sub);

    // track
    row.append('rect').attr('x', 0).attr('y', 0).attr('rx', 8)
      .attr('width', innerW).attr('height', y.bandwidth())
      .attr('fill', css.getPropertyValue('--bg-3').trim() || '#f3f4f6');

    // correct segment (animates in from the left)
    const correct = row.append('rect').attr('class', 'bar-correct')
      .attr('x', 0).attr('y', 0).attr('rx', 8)
      .attr('height', y.bandwidth()).attr('width', 0).attr('fill', colCorrect);
    correct.transition().duration(900).delay((d, i) => i * 120).ease(d3.easeCubicOut)
      .attr('width', d => x(d.correct));

    // silently wrong segment (follows the correct bar)
    const wrong = row.append('rect').attr('class', 'bar-wrong')
      .attr('y', 0).attr('rx', 8)
      .attr('height', y.bandwidth())
      .attr('x', d => x(d.correct)).attr('width', 0).attr('fill', colWrong);
    wrong.transition().duration(700).delay((d, i) => 900 + i * 120).ease(d3.easeCubicOut)
      .attr('width', d => x(d.wrong));

    // values
    row.append('text').attr('class', 'bar-val')
      .attr('x', d => x(d.correct) - 16).attr('y', y.bandwidth() / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
      .attr('opacity', 0)
      .text(d => `${d.correct}%`)
      .transition().delay((d, i) => 700 + i * 120).duration(400).attr('opacity', 1);
    // narrow red segments get their label outside the bar, in ink
    row.append('text')
      .attr('class', d => d.wrong < 12 ? 'bar-val dark' : 'bar-val')
      .attr('x', d => d.wrong < 12 ? x(d.correct + d.wrong) + 12 : x(d.correct + d.wrong) - 14)
      .attr('y', y.bandwidth() / 2)
      .attr('text-anchor', d => d.wrong < 12 ? 'start' : 'end').attr('dominant-baseline', 'central')
      .attr('opacity', 0)
      .text(d => `${d.wrong}%`)
      .transition().delay((d, i) => 1500 + i * 120).duration(400).attr('opacity', 1);
  }

  // ── Slide 28: four right answers to "how many countries are there?" ──────
  function wireCountries() {
    if (countriesWired) return;
    const pills = document.querySelectorAll('#slide-29 .def-pill');
    const countEl = document.getElementById('country-count');
    const defEl = document.getElementById('country-def');
    if (!pills.length || !countEl || !defEl) return;
    countriesWired = true;

    let current = 0;
    function show(pill) {
      const target = parseInt(pill.dataset.count, 10);
      pills.forEach(p => p.classList.toggle('active', p === pill));
      defEl.textContent = pill.dataset.def;
      const start = current;
      const t0 = performance.now();
      const dur = 650;
      function step(now) {
        const k = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        countEl.textContent = Math.round(start + (target - start) * e);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      current = target;
    }
    pills.forEach(p => p.addEventListener('click', () => show(p)));
    show(pills[0]);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 28) renderCliff();
      if (e.detail.slide === 29) wireCountries();
    });
  });
})();
