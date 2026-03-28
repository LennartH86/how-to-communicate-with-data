/**
 * Datasaurus Dozen — Table (Slide 13) and Scatter Grid (Slide 14)
 */
(function () {
  'use strict';

  let data = null;
  let dsRegressionVisible = false;
  let dsTableRendered = false;
  let dsScatterRendered = false;
  let dinoVisible = false;

  // ── Global regression (same for ALL datasets — that's the point) ──────────
  // slope = r * (sd_y / sd_x) = -0.064 * (26.93 / 16.76)
  // intercept = mean_y - slope * mean_x
  const GLOBAL_SLOPE     = -0.064 * (26.93 / 16.76);   // ≈ -0.1028
  const GLOBAL_INTERCEPT = 47.83 - GLOBAL_SLOPE * 54.26; // ≈ 53.41

  // Fixed axes so regression visually matches across all panels
  const X_DOMAIN = [0, 110];
  const Y_DOMAIN = [0, 110];

  async function loadData() {
    if (data) return data;
    const resp = await fetch('data/datasaurus.json');
    data = await resp.json();
    return data;
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
      html += `<tr>
        <td style="font-weight:700;text-align:left;padding-left:32px">${ds.label}</td>
        <td>${mx}</td><td>${my}</td>
        <td>${sx}</td><td>${sy}</td>
        <td>${(-0.064).toFixed(3)}</td>
      </tr>`;
    });

    html += `</tbody></table></div>
    <p style="margin-top:24px;font-size:20px;color:var(--text-muted);text-align:center">
      <strong>All 13 datasets share nearly identical summary statistics</strong> — yet they look completely different when visualised.
    </p>`;

    container.innerHTML = html;
  }

  // ── Draw a single scatter panel ───────────────────────────────────────────
  function drawPanel(container, ds, panelW, panelH, margin) {
    const innerW = panelW - margin.left - margin.right;
    const innerH = panelH - margin.top - margin.bottom;

    const wrapper = document.createElement('div');
    wrapper.className = 'ds-panel';
    wrapper.dataset.name = ds.name;

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

    const xScale = d3.scaleLinear().domain(X_DOMAIN).range([0, innerW]);
    const yScale = d3.scaleLinear().domain(Y_DOMAIN).range([innerH, 0]);

    // Grid lines
    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).ticks(4).tickSize(-innerH))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(4).tickSize(-innerW))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    // Global regression line — identical on every panel
    const rx0 = X_DOMAIN[0], rx1 = X_DOMAIN[1];
    g.append('line')
      .attr('class', 'ds-reg-line')
      .attr('x1', xScale(rx0)).attr('y1', yScale(GLOBAL_SLOPE * rx0 + GLOBAL_INTERCEPT))
      .attr('x2', xScale(rx1)).attr('y2', yScale(GLOBAL_SLOPE * rx1 + GLOBAL_INTERCEPT))
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,3')
      .attr('opacity', dsRegressionVisible ? 1 : 0);

    // Data points
    g.selectAll('.dot')
      .data(ds.points)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', p => xScale(p.x))
      .attr('cy', p => yScale(p.y))
      .attr('r', panelW > 600 ? 5 : 4)
      .attr('fill', ds.name === 'dino' ? '#00d4e0' : '#0ea5e9')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.85);

    container.appendChild(wrapper);
    return wrapper;
  }

  // ── Scatter Grid (Slide 14) ───────────────────────────────────────────────
  async function renderScatter() {
    if (dsScatterRendered) return;
    const grid    = document.getElementById('datasaurus-scatter');
    const featured = document.getElementById('dino-featured');
    if (!grid || !featured || typeof d3 === 'undefined') return;
    const d = await loadData();
    dsScatterRendered = true;

    // Panel sizes for the 12-dataset grid
    const panelW = 390, panelH = 200;
    const margin  = { top: 10, right: 12, bottom: 28, left: 36 };

    // Panel size for the featured dino (wider + taller)
    const dinoW = 860, dinoH = 260;
    const dinoMargin = { top: 16, right: 20, bottom: 36, left: 48 };

    grid.innerHTML    = '';
    featured.innerHTML = '';

    const dino    = d.datasets.find(ds => ds.name === 'dino');
    const nonDino = d.datasets.filter(ds => ds.name !== 'dino');

    // Render featured dino panel
    if (dino) {
      const dinoWrapper = drawPanel(featured, dino, dinoW, dinoH, dinoMargin);
      dinoWrapper.style.cssText = `
        border: 3px solid var(--accent);
        border-radius: 12px;
        overflow: hidden;
        display: inline-block;
      `;
    }

    // Render 12 non-dino datasets in the grid
    nonDino.forEach(ds => drawPanel(grid, ds, panelW, panelH, margin));

    // ── Button: toggle regression lines ──────────────────────────────────────
    const regBtn = document.getElementById('toggle-ds-regression');
    if (regBtn) {
      regBtn.addEventListener('click', () => {
        dsRegressionVisible = !dsRegressionVisible;
        regBtn.classList.toggle('active', dsRegressionVisible);
        regBtn.textContent = dsRegressionVisible ? '✓ Hide Regression Lines' : 'Show Regression Lines';
        // Update all reg lines in both grid and featured panel
        [grid, featured].forEach(el => {
          el.querySelectorAll('.ds-reg-line').forEach(line => {
            d3.select(line).attr('opacity', dsRegressionVisible ? 1 : 0);
          });
        });
      });
    }

    // ── Button: show / hide dino ──────────────────────────────────────────────
    const dinoBtn = document.getElementById('show-dino');
    if (dinoBtn) {
      dinoBtn.addEventListener('click', () => {
        dinoVisible = !dinoVisible;
        featured.style.display = dinoVisible ? 'flex' : 'none';
        dinoBtn.classList.toggle('active', dinoVisible);
        dinoBtn.textContent = dinoVisible ? '🦕 Hide Dinosaur' : '🦕 Show Dinosaur';
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
