/**
 * Car sales charts (Slide 15) and quarterly bar chart with highlights (Slide 18)
 */
(function () {
  'use strict';

  // ── Car Sales Data ────────────────────────────────────────────────────────
  const QUARTERS = ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'];
  const MODELS = [
    {
      name: 'Model A (SUV)',
      color: '#00d4e0',
      sales: [4250, 4100, 3980, 4320, 3850, 3720, 3890, 4010]
    },
    {
      name: 'Model B (Sedan)',
      color: '#0ea5e9',
      sales: [3100, 3150, 3200, 3080, 3180, 3220, 3170, 3250]
    },
    {
      name: 'Model C (EV)',
      color: '#22c55e',
      sales: [1200, 1480, 1750, 2100, 2450, 2820, 3150, 3480]
    }
  ];

  let salesTableRendered = false;
  let salesChartRendered = false;
  let barChartRendered   = false;
  let answerRevealed     = false;

  // ── Slide 15: Table ───────────────────────────────────────────────────────
  function renderSalesTable(revealed) {
    const container = document.getElementById('sales-table-container');
    if (!container) return;
    salesTableRendered = true;

    const modelAWins = [];
    let html = `<div style="overflow-x:auto;border-radius:12px;border:2px solid var(--border)">
      <table class="data-table" style="font-size:19px;min-width:900px">
        <thead>
          <tr>
            <th style="text-align:left;padding-left:24px">Quarter</th>`;
    MODELS.forEach(m => {
      html += `<th>${m.name}</th>`;
    });
    html += `</tr></thead><tbody>`;

    QUARTERS.forEach((q, i) => {
      const vals = MODELS.map(m => m.sales[i]);
      const maxVal = Math.max(...vals);
      const maxIdx = vals.indexOf(maxVal);
      const aWins = maxIdx === 0;
      if (aWins) modelAWins.push(q);

      const rowStyle = revealed && aWins ? 'background:rgba(0,212,224,0.08);' : '';
      html += `<tr style="${rowStyle}">`;
      html += `<td style="font-weight:600;text-align:left;padding-left:24px">${q}</td>`;
      vals.forEach((v, j) => {
        const highlight = revealed && aWins && j === 0;
        html += `<td style="${highlight ? 'font-weight:800;color:var(--accent);' : ''}">
          ${v.toLocaleString()}${highlight ? ' ★' : ''}
        </td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    if (revealed) {
      html += `<p style="margin-top:20px;font-size:20px;color:var(--text-muted);text-align:center">
        <strong style="color:var(--accent)">Model A leads in: ${modelAWins.join(', ')}</strong>
      </p>`;
    }
    container.innerHTML = html;
  }

  // ── Slide 15: Line Chart ──────────────────────────────────────────────────
  function renderSalesChart() {
    if (salesChartRendered) return;
    const container = document.getElementById('sales-chart-container');
    if (!container || typeof d3 === 'undefined') return;
    salesChartRendered = true;

    const width = container.clientWidth || 1400;
    const height = 380;
    const margin = { top: 24, right: 160, bottom: 56, left: 80 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scalePoint()
      .domain(QUARTERS)
      .range([0, innerW])
      .padding(0.2);

    const allVals = MODELS.flatMap(m => m.sales);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allVals) * 1.1])
      .range([innerH, 0]);

    // Grid
    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerW)
        .tickFormat(d => (d / 1000).toFixed(0) + 'k'))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale))
      .call(ax => ax.select('.domain').attr('stroke', '#e2e6ed'));

    // Lines
    const line = d3.line()
      .x((d, i) => xScale(QUARTERS[i]))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    MODELS.forEach(model => {
      g.append('path')
        .datum(model.sales)
        .attr('fill', 'none')
        .attr('stroke', model.color)
        .attr('stroke-width', 3)
        .attr('d', line);

      // Dots
      g.selectAll(`.dot-${model.name.replace(/\s+/g, '')}`)
        .data(model.sales)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(QUARTERS[i]))
        .attr('cy', d => yScale(d))
        .attr('r', 5)
        .attr('fill', model.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // Label
      const lastX = xScale(QUARTERS[QUARTERS.length - 1]);
      const lastY = yScale(model.sales[model.sales.length - 1]);
      g.append('text')
        .attr('x', lastX + 16)
        .attr('y', lastY + 5)
        .attr('font-size', 18)
        .attr('font-weight', 700)
        .attr('fill', model.color)
        .text(model.name);
    });

    container.style.display = 'none'; // toggled by tab
  }

  // ── Slide 18: Bar Chart with min/max highlight ────────────────────────────
  function renderBarChart() {
    if (barChartRendered) return;
    const container = document.getElementById('sales-bar-chart');
    if (!container || typeof d3 === 'undefined') return;
    barChartRendered = true;

    // Total sales per quarter
    const totals = QUARTERS.map((q, i) => ({
      quarter: q,
      value: MODELS.reduce((sum, m) => sum + m.sales[i], 0)
    }));

    const maxVal = Math.max(...totals.map(t => t.value));
    const minVal = Math.min(...totals.map(t => t.value));

    const width = container.clientWidth || 1600;
    const height = 580;
    const margin = { top: 40, right: 60, bottom: 80, left: 80 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(QUARTERS)
      .range([0, innerW])
      .padding(0.25);

    const yScale = d3.scaleLinear()
      .domain([0, maxVal * 1.12])
      .range([innerH, 0]);

    // Grid lines
    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerW)
        .tickFormat(d => (d / 1000).toFixed(0) + 'k'))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call(ax => ax.select('.domain').attr('stroke', '#e2e6ed'))
      .selectAll('text')
      .attr('font-size', 20)
      .attr('font-weight', 600)
      .attr('dy', '1.2em');

    // Bars
    g.selectAll('.bar')
      .data(totals)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.quarter))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerH - yScale(d.value))
      .attr('rx', 8)
      .attr('fill', d => {
        if (d.value === maxVal) return '#00d4e0';
        if (d.value === minVal) return '#ef4444';
        return '#e2e6ed';
      })
      .attr('opacity', 0.9);

    // Value labels on top of bars
    g.selectAll('.bar-label')
      .data(totals)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.quarter) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 20)
      .attr('font-weight', 700)
      .attr('fill', d => {
        if (d.value === maxVal) return '#00a8b5';
        if (d.value === minVal) return '#dc2626';
        return '#9ca3af';
      })
      .text(d => (d.value / 1000).toFixed(1) + 'k');

    // Legend
    const legendData = [
      { color: '#00d4e0', label: 'Highest quarter' },
      { color: '#ef4444', label: 'Lowest quarter' },
      { color: '#e2e6ed', label: 'Other quarters' }
    ];
    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left},${height - 24})`);
    legendData.forEach((item, i) => {
      const lx = i * 300;
      legend.append('rect').attr('x', lx).attr('y', 0)
        .attr('width', 20).attr('height', 20).attr('rx', 4).attr('fill', item.color);
      legend.append('text').attr('x', lx + 28).attr('y', 15)
        .attr('font-size', 18).attr('fill', '#374151').text(item.label);
    });
  }

  // ── Slide 15 tabs + reveal ────────────────────────────────────────────────
  function initTabs() {
    const tableBtn  = document.getElementById('tab-table');
    const chartBtn  = document.getElementById('tab-chart');
    const revealBtn = document.getElementById('reveal-answer');
    const tableEl   = document.getElementById('sales-table-container');
    const chartEl   = document.getElementById('sales-chart-container');
    if (!tableBtn || !chartBtn) return;

    tableBtn.addEventListener('click', () => {
      tableBtn.classList.add('active');
      chartBtn.classList.remove('active');
      if (tableEl) tableEl.style.display = '';
      if (chartEl) chartEl.style.display = 'none';
    });

    chartBtn.addEventListener('click', () => {
      chartBtn.classList.add('active');
      tableBtn.classList.remove('active');
      if (chartEl) chartEl.style.display = '';
      if (tableEl) tableEl.style.display = 'none';
      renderSalesChart();
    });

    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        answerRevealed = !answerRevealed;
        revealBtn.classList.toggle('active', answerRevealed);
        revealBtn.textContent = answerRevealed ? '✓ Hide Answer' : 'Reveal Answer';
        // Always re-render the table with new state
        renderSalesTable(answerRevealed);
        // Switch to table view so the highlight is visible
        tableBtn.classList.add('active');
        chartBtn.classList.remove('active');
        if (tableEl) tableEl.style.display = '';
        if (chartEl) chartEl.style.display = 'none';
      });
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 15) {
        if (!salesTableRendered) renderSalesTable(false);
        initTabs();
      }
      if (e.detail.slide === 18) {
        if (typeof d3 !== 'undefined') renderBarChart();
        else setTimeout(renderBarChart, 300);
      }
    });
  });
})();
