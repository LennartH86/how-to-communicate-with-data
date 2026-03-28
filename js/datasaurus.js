/**
 * Datasaurus Dozen — Table (Slide 13) and Scatter Grid (Slide 14)
 */
(function () {
  'use strict';

  let data = null;
  let dsRegressionVisible = false;
  let dsTableRendered = false;
  let dsScatterRendered = false;
  let dinoHighlighted = false;

  async function loadData() {
    if (data) return data;
    const resp = await fetch('data/datasaurus.json');
    data = await resp.json();
    return data;
  }

  // ── Simple linear regression ──────────────────────────────────────────────
  function linReg(points) {
    const n = points.length;
    const sumX  = points.reduce((a, p) => a + p.x, 0);
    const sumY  = points.reduce((a, p) => a + p.y, 0);
    const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
    const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
    const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }

  function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
  function sd(arr) {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
  }

  // ── Table (Slide 13) ──────────────────────────────────────────────────────
  async function renderTable() {
    if (dsTableRendered) return;
    const container = document.getElementById('datasaurus-table-container');
    if (!container) return;
    const d = await loadData();
    dsTableRendered = true;

    let html = `<div style="max-height:780px;overflow-y:auto;border-radius:12px;border:2px solid var(--border)">
    <table class="data-table" style="font-size:19px">
      <thead>
        <tr>
          <th style="text-align:left;padding-left:32px">Dataset</th>
          <th>Mean X</th><th>Mean Y</th>
          <th>SD X</th><th>SD Y</th>
          <th>Correlation</th>
        </tr>
      </thead>
      <tbody>`;

    d.datasets.forEach(ds => {
      const xs = ds.points.map(p => p.x);
      const ys = ds.points.map(p => p.y);
      const mx = mean(xs).toFixed(2);
      const my = mean(ys).toFixed(2);
      const sx = sd(xs).toFixed(2);
      const sy = sd(ys).toFixed(2);
      const reg = linReg(ds.points);
      const corr = (reg.slope * sx / sy).toFixed(3);

      html += `<tr>
        <td style="font-weight:700;text-align:left;padding-left:32px">${ds.label}</td>
        <td>${mx}</td><td>${my}</td>
        <td>${sx}</td><td>${sy}</td>
        <td>${corr}</td>
      </tr>`;
    });

    html += `</tbody></table></div>`;

    html += `<p style="margin-top:24px;font-size:20px;color:var(--text-muted);text-align:center">
      <strong>All 13 datasets share nearly identical summary statistics</strong> — yet they look completely different when visualised.
    </p>`;

    container.innerHTML = html;
  }

  // ── Scatter Grid (Slide 14) ───────────────────────────────────────────────
  async function renderScatter() {
    if (dsScatterRendered) return;
    const container = document.getElementById('datasaurus-scatter');
    if (!container || typeof d3 === 'undefined') return;
    const d = await loadData();
    dsScatterRendered = true;

    const panelW = 390, panelH = 200;
    const margin = { top: 10, right: 12, bottom: 28, left: 36 };
    const innerW = panelW - margin.left - margin.right;
    const innerH = panelH - margin.top - margin.bottom;

    container.innerHTML = '';

    // Render all datasets except dino first (dino is shown via button)
    const nonDino = d.datasets.filter(ds => ds.name !== 'dino');
    const dino    = d.datasets.find(ds => ds.name === 'dino');

    [...nonDino, dino].forEach((ds, idx) => {
      const isDino = ds.name === 'dino';

      const wrapper = document.createElement('div');
      wrapper.className = 'ds-panel' + (isDino ? ' dino-panel' : '');
      wrapper.dataset.name = ds.name;
      if (isDino) {
        wrapper.style.display = 'none'; // hidden until button clicked
      }

      const title = document.createElement('div');
      title.className = 'ds-panel-title';
      title.textContent = ds.label;
      wrapper.appendChild(title);

      const svg = d3.select(wrapper)
        .append('svg')
        .attr('width', panelW)
        .attr('height', panelH);

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xExt = d3.extent(ds.points, p => p.x);
      const yExt = d3.extent(ds.points, p => p.y);
      const xPad = (xExt[1] - xExt[0]) * 0.1;
      const yPad = (yExt[1] - yExt[0]) * 0.1;

      const xScale = d3.scaleLinear()
        .domain([xExt[0] - xPad, xExt[1] + xPad]).range([0, innerW]);
      const yScale = d3.scaleLinear()
        .domain([yExt[0] - yPad, yExt[1] + yPad]).range([innerH, 0]);

      g.append('g').attr('class', 'axis')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).ticks(4).tickSize(-innerH))
        .call(ax => ax.select('.domain').remove())
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

      g.append('g').attr('class', 'axis')
        .call(d3.axisLeft(yScale).ticks(4).tickSize(-innerW))
        .call(ax => ax.select('.domain').remove())
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

      // Regression line
      const reg = linReg(ds.points);
      const x0 = xExt[0] - xPad, x1 = xExt[1] + xPad;
      g.append('line')
        .attr('class', 'reg-line ds-reg-line')
        .attr('x1', xScale(x0)).attr('y1', yScale(reg.slope * x0 + reg.intercept))
        .attr('x2', xScale(x1)).attr('y2', yScale(reg.slope * x1 + reg.intercept))
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,3')
        .attr('opacity', dsRegressionVisible ? 1 : 0);

      // Points
      g.selectAll('.dot')
        .data(ds.points)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', p => xScale(p.x))
        .attr('cy', p => yScale(p.y))
        .attr('r', isDino ? 3.5 : 4)
        .attr('fill', isDino ? '#00d4e0' : '#0ea5e9')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8);

      container.appendChild(wrapper);
    });

    // Toggle regression button
    const regBtn = document.getElementById('toggle-ds-regression');
    if (regBtn) {
      regBtn.addEventListener('click', () => {
        dsRegressionVisible = !dsRegressionVisible;
        regBtn.classList.toggle('active', dsRegressionVisible);
        regBtn.textContent = dsRegressionVisible ? '✓ Hide Regression Lines' : 'Show Regression Lines';
        container.querySelectorAll('.ds-reg-line').forEach(line => {
          d3.select(line).attr('opacity', dsRegressionVisible ? 1 : 0);
        });
      });
    }

    // Show dino button
    const dinoBtn = document.getElementById('show-dino');
    if (dinoBtn) {
      dinoBtn.addEventListener('click', () => {
        dinoHighlighted = !dinoHighlighted;
        const dinoPanel = container.querySelector('.dino-panel');
        if (dinoPanel) {
          dinoPanel.style.display = dinoHighlighted ? '' : 'none';
        }
        dinoBtn.classList.toggle('active', dinoHighlighted);
        dinoBtn.textContent = dinoHighlighted ? '🦕 Hide Dinosaur' : '🦕 Show Dinosaur';
      });
    }
  }

  // ── Event Listeners ───────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 13) renderTable();
      if (e.detail.slide === 14) {
        if (typeof d3 !== 'undefined') renderScatter();
        else setTimeout(renderScatter, 300);
      }
    });
  });
})();
