/**
 * Anscombe Quartet — Table (Slide 11) and Scatter Plot (Slide 12)
 */
(function () {
  'use strict';

  let data = null;
  let regressionVisible = false;
  let tableRendered = false;
  let scatterRendered = false;

  async function loadData() {
    if (data) return data;
    const resp = await fetch('data/anscombe.json');
    data = await resp.json();
    return data;
  }

  // ── Table (Slide 11) ──────────────────────────────────────────────────────
  async function renderTable() {
    if (tableRendered) return;
    const container = document.getElementById('anscombe-table-container');
    if (!container) return;
    const d = await loadData();
    tableRendered = true;

    // Build combined table: rows are observations, columns are dataset pairs
    const n = d.datasets[0].points.length;
    let html = `<table class="data-table"><thead><tr>
      <th>n</th>
      <th>I — x</th><th>I — y</th>
      <th>II — x</th><th>II — y</th>
      <th>III — x</th><th>III — y</th>
      <th>IV — x</th><th>IV — y</th>
    </tr></thead><tbody>`;

    for (let i = 0; i < n; i++) {
      const row = d.datasets.map(ds => ds.points[i]);
      html += `<tr>
        <td><strong>${i + 1}</strong></td>
        ${row.map(p => `<td>${p.x}</td><td>${p.y.toFixed(2)}</td>`).join('')}
      </tr>`;
    }

    // Stats row
    html += `<tr style="border-top:2px solid var(--border);background:rgba(0,212,224,0.08)">
      <td style="font-weight:700">Stats</td>
      <td colspan="2" style="font-size:17px;color:var(--text-muted)">
        Mean x=9.0, Mean y≈7.50<br>Var x=11.0, Var y≈4.12<br>Corr≈0.816
      </td>
      <td colspan="2" style="font-size:17px;color:var(--text-muted)">
        Mean x=9.0, Mean y≈7.50<br>Var x=11.0, Var y≈4.12<br>Corr≈0.816
      </td>
      <td colspan="2" style="font-size:17px;color:var(--text-muted)">
        Mean x=9.0, Mean y≈7.50<br>Var x=11.0, Var y≈4.12<br>Corr≈0.816
      </td>
      <td colspan="2" style="font-size:17px;color:var(--text-muted)">
        Mean x=9.0, Mean y≈7.50<br>Var x=11.0, Var y≈4.12<br>Corr≈0.816
      </td>
    </tr>`;
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // ── Scatter (Slide 12) ────────────────────────────────────────────────────
  async function renderScatter() {
    if (scatterRendered) return;
    const container = document.getElementById('anscombe-scatter');
    if (!container || typeof d3 === 'undefined') return;
    const d = await loadData();
    scatterRendered = true;

    const panelW = 400, panelH = 280;
    const margin = { top: 20, right: 20, bottom: 40, left: 44 };
    const innerW = panelW - margin.left - margin.right;
    const innerH = panelH - margin.top - margin.bottom;

    container.innerHTML = '';

    d.datasets.forEach(ds => {
      const wrapper = document.createElement('div');
      wrapper.className = 'anscombe-panel';

      const title = document.createElement('div');
      title.className = 'anscombe-panel-title';
      title.textContent = ds.label;
      wrapper.appendChild(title);

      const svg = d3.select(wrapper)
        .append('svg')
        .attr('width', panelW)
        .attr('height', panelH);

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xExt = [0, 20];
      const yExt = [2, 14];

      const xScale = d3.scaleLinear().domain(xExt).range([0, innerW]);
      const yScale = d3.scaleLinear().domain(yExt).range([innerH, 0]);

      // Axes
      g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).ticks(6).tickSize(-innerH))
        .call(ax => ax.select('.domain').remove())
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

      g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerW))
        .call(ax => ax.select('.domain').remove())
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

      // Regression line
      const regLine = g.append('line')
        .attr('class', 'reg-line')
        .attr('x1', xScale(0))
        .attr('y1', yScale(3 + 0.5 * 0))
        .attr('x2', xScale(20))
        .attr('y2', yScale(3 + 0.5 * 20))
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '8,4')
        .attr('opacity', regressionVisible ? 1 : 0);

      // Points
      g.selectAll('.dot')
        .data(ds.points)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', p => xScale(p.x))
        .attr('cy', p => yScale(p.y))
        .attr('r', 6)
        .attr('fill', '#00d4e0')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('opacity', 0.85);

      container.appendChild(wrapper);

      // Store ref for toggle
      wrapper._regLine = regLine;
    });

    // Toggle button
    const btn = document.getElementById('toggle-regression');
    if (btn) {
      btn.addEventListener('click', () => {
        regressionVisible = !regressionVisible;
        btn.classList.toggle('active', regressionVisible);
        btn.textContent = regressionVisible ? '✓ Hide Regression Lines' : 'Show Regression Lines';
        container.querySelectorAll('.reg-line').forEach(line => {
          d3.select(line).attr('opacity', regressionVisible ? 1 : 0);
        });
      });
    }
  }

  // ── Event listeners ───────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 12) renderTable();
      if (e.detail.slide === 13) {
        if (typeof d3 !== 'undefined') {
          renderScatter();
        } else {
          setTimeout(renderScatter, 300);
        }
      }
    });
  });
})();
