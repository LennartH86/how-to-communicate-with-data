/**
 * GDP growth table + line chart (Slide 17) and world growth bar chart with
 * highlighted extremes (Slide 21). Data: data/gdp-growth.json (World Bank).
 */
(function () {
  'use strict';

  // Series shown in the challenge, in brand series order
  const SERIES = [
    { key: 'DEU', name: 'Germany',       color: '#00b4d8' },
    { key: 'USA', name: 'United States', color: '#7c3aed' },
    { key: 'JPN', name: 'Japan',         color: '#f59e0b' }
  ];
  const LEAD = SERIES[0]; // the series the question is about

  let data = null;
  let tableRendered  = false;
  let chartRendered  = false;
  let barRendered    = false;
  let answerRevealed = false;
  let tabsInitialized = false;

  async function loadData() {
    if (data) return data;
    const resp = await fetch('data/gdp-growth.json');
    data = await resp.json();
    return data;
  }

  const fmt = v => (v > 0 ? '+' : '') + v.toFixed(1) + ' %';
  const leads = row => SERIES.slice(1).every(s => row[LEAD.key] > row[s.key]);

  // ── Slide 17: Table ───────────────────────────────────────────────────────
  async function renderTable(revealed) {
    const container = document.getElementById('gdp-table-container');
    if (!container) return;
    const d = await loadData();
    tableRendered = true;

    const winYears = [];
    let html = `<div class="table-frame" style="overflow-y:auto">
      <table class="data-table" style="font-size:18px;min-width:760px">
        <thead><tr><th style="text-align:left;padding-left:24px">Year</th>`;
    SERIES.forEach(s => { html += `<th>${s.name}</th>`; });
    html += `</tr></thead><tbody>`;

    d.rows.forEach(row => {
      const win = leads(row);
      if (win) winYears.push(row.year);
      html += `<tr${revealed && win ? ' class="is-highlight"' : ''}>`;
      html += `<td style="font-weight:600;text-align:left;padding-left:24px">${row.year}</td>`;
      SERIES.forEach((s, j) => {
        const hl = revealed && win && j === 0;
        html += `<td style="${hl ? 'font-weight:800;color:var(--accent-dark);' : ''}">${fmt(row[s.key])}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;

    if (revealed) {
      html += `<p style="margin-top:14px;font-size:20px;color:var(--text-2);text-align:center">
        <strong style="color:var(--accent-dark)">${LEAD.name} grew faster than both in ${winYears.length} of ${d.rows.length} years: ${winYears.join(', ')}</strong>
      </p>`;
    }
    container.innerHTML = html;
  }

  // ── Slide 17: Line chart ──────────────────────────────────────────────────
  async function renderLineChart() {
    if (chartRendered) return;
    const container = document.getElementById('gdp-chart-container');
    if (!container || typeof d3 === 'undefined') return;
    const d = await loadData();
    chartRendered = true;

    const width  = 1500;
    const height = 420;
    const margin = { top: 20, right: 150, bottom: 48, left: 70 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const years = d.rows.map(r => r.year);

    const svg = d3.select(container).append('svg')
      .attr('width', '100%').attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().domain(years).range([0, innerW]).padding(0.3);
    const allVals = d.rows.flatMap(r => SERIES.map(s => r[s.key]));
    const y = d3.scaleLinear()
      .domain([Math.floor(d3.min(allVals)) - 0.5, Math.ceil(d3.max(allVals)) + 0.5])
      .range([innerH, 0]);

    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(6).tickSize(-innerW).tickFormat(v => (v > 0 ? '+' : '') + v + ' %'))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'));

    // zero line in ink so recessions read as "below zero"
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', '#9ca3af').attr('stroke-width', 1.5);

    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSize(0).tickValues(years.filter(yr => yr % 5 === 0)))
      .call(ax => ax.select('.domain').attr('stroke', '#e5e7eb'))
      .selectAll('text').attr('font-size', 14).attr('dy', '1.2em');

    const line = d3.line().x(r => x(r.year)).curve(d3.curveLinear);

    // end labels: push apart when two series end at almost the same value
    const last = d.rows[d.rows.length - 1];
    const labelY = {};
    SERIES.map(s => ({ key: s.key, y: y(last[s.key]) }))
      .sort((a, b) => a.y - b.y)
      .forEach((item, i, arr) => {
        const prev = i > 0 ? labelY[arr[i - 1].key] : -Infinity;
        labelY[item.key] = Math.max(item.y, prev + 22);
      });

    SERIES.forEach(s => {
      g.append('path').datum(d.rows)
        .attr('fill', 'none').attr('stroke', s.color).attr('stroke-width', 3)
        .attr('d', line.y(r => y(r[s.key])));
      g.selectAll(null).data(d.rows).enter().append('circle')
        .attr('cx', r => x(r.year)).attr('cy', r => y(r[s.key]))
        .attr('r', 3.5).attr('fill', s.color).attr('stroke', 'white').attr('stroke-width', 1.5);

      // end label: coloured marker carries identity, text stays in ink
      g.append('circle').attr('cx', x(last.year) + 18).attr('cy', labelY[s.key]).attr('r', 5).attr('fill', s.color);
      g.append('text').attr('x', x(last.year) + 30).attr('y', labelY[s.key] + 5)
        .attr('font-size', 16).attr('font-weight', 600).attr('fill', '#111827').text(s.name);
    });
  }

  // ── Slide 21: World growth per year, highlight best and worst ────────────
  async function renderBarChart() {
    if (barRendered) return;
    const container = document.getElementById('gdp-bar-chart');
    if (!container || typeof d3 === 'undefined') return;
    const d = await loadData();
    barRendered = true;

    const rows = d.rows.map(r => ({ year: r.year, value: r.WLD }));
    const maxVal = d3.max(rows, r => r.value);
    const minVal = d3.min(rows, r => r.value);

    const width  = 1600;
    const height = 540;
    const margin = { top: 24, right: 40, bottom: 72, left: 72 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(container).append('svg')
      .attr('width', '100%').attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(rows.map(r => r.year)).range([0, innerW]).padding(0.3);
    const y = d3.scaleLinear().domain([Math.floor(minVal) - 0.5, Math.ceil(maxVal) + 0.5]).range([innerH, 0]);

    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(6).tickSize(-innerW).tickFormat(v => (v > 0 ? '+' : '') + v + ' %'))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'));
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', '#9ca3af').attr('stroke-width', 1.5);
    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSize(0).tickValues(rows.map(r => r.year).filter(yr => yr % 5 === 0)))
      .call(ax => ax.select('.domain').attr('stroke', '#e5e7eb'))
      .selectAll('text').attr('font-size', 15).attr('font-weight', 600).attr('dy', '1.2em');

    const bars = g.selectAll('.bar').data(rows).enter().append('rect')
      .attr('x', r => x(r.year))
      .attr('y', r => Math.min(y(0), y(r.value)))
      .attr('width', x.bandwidth())
      .attr('height', r => Math.abs(y(r.value) - y(0)))
      .attr('rx', 5)
      .attr('fill', '#d1d5db').attr('opacity', 0.85);

    // value labels for the extremes, hidden until highlighted
    const labels = g.selectAll('.extreme').data(rows.filter(r => r.value === maxVal || r.value === minVal))
      .enter().append('text')
      .attr('x', r => x(r.year) + x.bandwidth() / 2)
      .attr('y', r => r.value > 0 ? y(r.value) - 10 : y(r.value) + 22)
      .attr('text-anchor', 'middle').attr('font-size', 17).attr('font-weight', 700)
      .attr('fill', '#111827').attr('opacity', 0)
      .text(r => `${r.year}: ${fmt(r.value)}`);

    const legendData = [
      { color: '#00b4d8', label: 'Strongest year' },
      { color: '#ef4444', label: 'Weakest year' }
    ];
    const legendG = svg.append('g').attr('transform', `translate(${margin.left},${height - 16})`).attr('opacity', 0);
    legendData.forEach((item, i) => {
      const lx = i * 240;
      legendG.append('rect').attr('x', lx).attr('y', 0).attr('width', 18).attr('height', 18).attr('rx', 4).attr('fill', item.color);
      legendG.append('text').attr('x', lx + 26).attr('y', 14).attr('font-size', 17).attr('fill', '#6b7280').text(item.label);
    });

    let on = false;
    const btn = document.getElementById('toggle-bar-highlight');
    if (btn) {
      btn.addEventListener('click', () => {
        on = !on;
        btn.classList.toggle('active', on);
        btn.textContent = on ? 'Remove highlight' : 'Highlight the extremes';
        bars.transition().duration(400)
          .attr('fill', r => !on ? '#d1d5db' : r.value === maxVal ? '#00b4d8' : r.value === minVal ? '#ef4444' : '#e5e7eb')
          .attr('opacity', r => !on ? 0.85 : (r.value === maxVal || r.value === minVal) ? 1 : 0.35);
        labels.transition().duration(400).attr('opacity', on ? 1 : 0);
        legendG.transition().duration(400).attr('opacity', on ? 1 : 0);
      });
    }
  }

  // ── Slide 17: tabs, reveal, approaches ───────────────────────────────────
  function initTabs() {
    if (tabsInitialized) return;
    tabsInitialized = true;
    const tableBtn  = document.getElementById('tab-table');
    const chartBtn  = document.getElementById('tab-chart');
    const revealBtn = document.getElementById('reveal-answer');
    const tableEl   = document.getElementById('gdp-table-container');
    const chartEl   = document.getElementById('gdp-chart-container');
    if (!tableBtn || !chartBtn) return;

    const showTable = () => {
      tableBtn.classList.add('active'); chartBtn.classList.remove('active');
      if (tableEl) tableEl.style.display = '';
      if (chartEl) chartEl.style.display = 'none';
    };
    tableBtn.addEventListener('click', showTable);
    chartBtn.addEventListener('click', () => {
      chartBtn.classList.add('active'); tableBtn.classList.remove('active');
      if (chartEl) chartEl.style.display = '';
      if (tableEl) tableEl.style.display = 'none';
      renderLineChart();
    });

    const approachBtn   = document.getElementById('show-approaches');
    const approachCards = document.getElementById('approach-cards');
    if (tableEl) tableEl.style.maxHeight = '560px';
    if (approachBtn && approachCards) {
      approachBtn.addEventListener('click', () => {
        const visible = approachCards.style.display !== 'none';
        approachCards.style.display = visible ? 'none' : '';
        approachBtn.classList.toggle('active', !visible);
        approachBtn.textContent = visible ? 'Show approaches' : 'Hide approaches';
        if (tableEl) tableEl.style.maxHeight = visible ? '560px' : '300px';
      });
    }

    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        answerRevealed = !answerRevealed;
        revealBtn.classList.toggle('active', answerRevealed);
        revealBtn.textContent = answerRevealed ? 'Hide answer' : 'Reveal answer';
        renderTable(answerRevealed);
        showTable();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 17) {
        if (!tableRendered) renderTable(false);
        initTabs();
      }
      if (e.detail.slide === 21) {
        if (typeof d3 !== 'undefined') renderBarChart();
        else setTimeout(renderBarChart, 300);
      }
    });
  });
})();
