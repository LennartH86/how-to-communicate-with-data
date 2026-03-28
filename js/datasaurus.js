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

  // ── Global regression — identical on EVERY panel (that's the point) ───────
  // slope = r × (sd_y / sd_x) = -0.064 × (26.93 / 16.76) ≈ -0.103
  // intercept = mean_y − slope × mean_x ≈ 53.41
  const SLOPE     = -0.064 * (26.93 / 16.76);
  const INTERCEPT = 47.83 - SLOPE * 54.26;

  // Fixed equal data range on both axes → square plot area looks square
  const DOMAIN = [0, 110];

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
      <thead><tr>
        <th style="text-align:left;padding-left:32px">Dataset</th>
        <th>Mean X</th><th>Mean Y</th><th>SD X</th><th>SD Y</th><th>Correlation</th>
      </tr></thead><tbody>`;

    d.datasets.forEach(ds => {
      const xs = ds.points.map(p => p.x);
      const ys = ds.points.map(p => p.y);
      html += `<tr>
        <td style="font-weight:700;text-align:left;padding-left:32px">${ds.label}</td>
        <td>${mean(xs).toFixed(2)}</td><td>${mean(ys).toFixed(2)}</td>
        <td>${sd(xs).toFixed(2)}</td><td>${sd(ys).toFixed(2)}</td>
        <td>${(-0.064).toFixed(3)}</td>
      </tr>`;
    });

    html += `</tbody></table></div>
    <p style="margin-top:24px;font-size:20px;color:var(--text-muted);text-align:center">
      <strong>All 13 datasets share nearly identical summary statistics</strong> — yet they look completely different when visualised.
    </p>`;
    container.innerHTML = html;
  }

  // ── Draw one scatter panel ─────────────────────────────────────────────────
  // Margins are symmetric left/right and top/bottom so the inner plot is square
  // when panelW === panelH.
  function drawPanel(parentEl, ds, size, margin, isDino) {
    const inner = size - margin.h; // same as size - margin.v because symmetric

    const wrapper = document.createElement('div');
    wrapper.className = 'ds-panel' + (isDino ? ' ds-panel-dino' : '');
    wrapper.dataset.name = ds.name;

    const title = document.createElement('div');
    title.className = 'ds-panel-title';
    title.textContent = ds.label;
    wrapper.appendChild(title);

    const svg = d3.select(wrapper).append('svg')
      .attr('width',  size)
      .attr('height', size);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain(DOMAIN).range([0, inner]);
    const yScale = d3.scaleLinear().domain(DOMAIN).range([inner, 0]);

    // Grid lines
    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${inner})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(-inner))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-inner))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    // Regression line — global, identical on all panels
    g.append('line')
      .attr('class', 'ds-reg-line')
      .attr('x1', xScale(DOMAIN[0])).attr('y1', yScale(SLOPE * DOMAIN[0] + INTERCEPT))
      .attr('x2', xScale(DOMAIN[1])).attr('y2', yScale(SLOPE * DOMAIN[1] + INTERCEPT))
      .attr('stroke', '#ef4444')
      .attr('stroke-width', isDino ? 3 : 2)
      .attr('stroke-dasharray', '7,4')
      .attr('opacity', dsRegressionVisible ? 1 : 0);

    // Data points
    g.selectAll('.dot').data(ds.points).enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', p => xScale(p.x))
      .attr('cy', p => yScale(p.y))
      .attr('r', isDino ? 5 : 4)
      .attr('fill', isDino ? '#00d4e0' : '#0ea5e9')
      .attr('stroke', 'white')
      .attr('stroke-width', isDino ? 1.5 : 1)
      .attr('opacity', 0.85);

    parentEl.appendChild(wrapper);
  }

  // ── Scatter (Slide 14) ────────────────────────────────────────────────────
  async function renderScatter() {
    if (dsScatterRendered) return;
    const grid     = document.getElementById('datasaurus-scatter');
    const dinoCont = document.getElementById('dino-featured');
    if (!grid || !dinoCont || typeof d3 === 'undefined') return;
    const d = await loadData();
    dsScatterRendered = true;

    // ── Grid panels: square at 240px, symmetric margins ─────────────────────
    // margin.left = margin.right = 30, margin.top = margin.bottom = 24
    // → horizontal span = 60, vertical span = 48  … almost square inner area
    // Make them fully square: use same total margin on both axes
    // total margin = 56 on each axis → inner = 240 - 56 = 184px square
    const GRID_SIZE = 240;
    const GM = { left: 36, right: 20, top: 20, bottom: 36, h: 56, v: 56 };

    // ── Dino panel: large centered square ───────────────────────────────────
    // Available height for dino: ~840px; width: 1760px → use 800px square
    const DINO_SIZE = 780;
    const DM = { left: 56, right: 24, top: 24, bottom: 56, h: 80, v: 80 };

    grid.innerHTML     = '';
    dinoCont.innerHTML = '';

    const dino    = d.datasets.find(ds => ds.name === 'dino');
    const nonDino = d.datasets.filter(ds => ds.name !== 'dino');

    // Render 12 non-dino panels into the grid
    nonDino.forEach(ds => drawPanel(grid, ds, GRID_SIZE, GM, false));

    // Render the large dino panel into its container
    if (dino) drawPanel(dinoCont, dino, DINO_SIZE, DM, true);

    // ── Regression toggle ────────────────────────────────────────────────────
    const regBtn = document.getElementById('toggle-ds-regression');
    if (regBtn) {
      regBtn.addEventListener('click', () => {
        dsRegressionVisible = !dsRegressionVisible;
        regBtn.classList.toggle('active', dsRegressionVisible);
        regBtn.textContent = dsRegressionVisible ? '✓ Hide Regression Lines' : 'Show Regression Lines';
        document.querySelectorAll('.ds-reg-line').forEach(line => {
          d3.select(line).attr('opacity', dsRegressionVisible ? 1 : 0);
        });
      });
    }

    // ── Dino toggle: hide grid, show dino centered ───────────────────────────
    const dinoBtn = document.getElementById('show-dino');
    if (dinoBtn) {
      dinoBtn.addEventListener('click', () => {
        dinoVisible = !dinoVisible;
        grid.style.display     = dinoVisible ? 'none' : 'grid';
        dinoCont.style.display = dinoVisible ? 'flex'  : 'none';
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
