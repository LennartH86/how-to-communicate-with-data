/**
 * Car sales charts (Slide 15) and quarterly bar chart with highlights (Slide 18)
 */
(function () {
  'use strict';

  // ── Car Sales Data (monthly, winners vary across all three cars) ──────────
  const MONTHS = [
    'Jan 24','Feb 24','Mar 24','Apr 24','May 24','Jun 24',
    'Jul 24','Aug 24','Sep 24','Oct 24',
    'Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25',
    'Jul 25','Aug 25','Sep 25','Oct 25'
  ];
  // Winners by month: Car2, Car1, Car3, Car3, Car2, Car1, Car2, Car1, Car3, Car2,
  //                   Car1, Car2, Car1, Car3, Car1, Car2, Car1, Car3, Car1, Car2
  const MODELS = [
    {
      name: 'Car 1',
      color: '#00d4e0',
      sales: [2200,3100,1900,2800,3400,4100,2600,3500,1800,3200,4000,2500,3800,2100,3600,2200,3100,2400,3900,2700]
    },
    {
      name: 'Car 2',
      color: '#0ea5e9',
      sales: [2800,1800,2100,1600,3800,2900,3200,2100,2400,3600,2200,3100,2400,1800,2800,3500,2600,1900,2300,3400]
    },
    {
      name: 'Car 3',
      color: '#22c55e',
      sales: [1500,2400,2600,3100,1200,2200,1800,2800,3000,2100,1900,2800,1600,3400,2300,2100,1400,3200,2800,1700]
    }
  ];

  let salesTableRendered = false;
  let salesChartRendered = false;
  let barChartRendered   = false;
  let answerRevealed     = false;
  let tabsInitialized    = false;

  // ── Slide 15: Table ───────────────────────────────────────────────────────
  function renderSalesTable(revealed) {
    const container = document.getElementById('sales-table-container');
    if (!container) return;
    salesTableRendered = true;

    const car1WinMonths = [];
    let html = `<div style="overflow-y:auto;border-radius:12px;border:2px solid var(--border)">
      <table class="data-table" style="font-size:18px;min-width:700px">
        <thead>
          <tr>
            <th style="text-align:left;padding-left:24px">Month</th>`;
    MODELS.forEach(m => {
      html += `<th>${m.name}</th>`;
    });
    html += `</tr></thead><tbody>`;

    MONTHS.forEach((month, i) => {
      const vals = MODELS.map(m => m.sales[i]);
      const maxVal = Math.max(...vals);
      const maxIdx = vals.indexOf(maxVal);
      const car1Wins = maxIdx === 0;
      if (car1Wins) car1WinMonths.push(month);

      const rowStyle = revealed && car1Wins ? 'background:rgba(0,212,224,0.08);' : '';
      html += `<tr style="${rowStyle}">`;
      html += `<td style="font-weight:600;text-align:left;padding-left:24px">${month}</td>`;
      vals.forEach((v, j) => {
        const highlight = revealed && car1Wins && j === 0;
        html += `<td style="${highlight ? 'font-weight:800;color:var(--accent);' : ''}">
          ${v.toLocaleString()}${highlight ? ' ★' : ''}
        </td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    if (revealed) {
      html += `<p style="margin-top:16px;font-size:20px;color:var(--text-muted);text-align:center">
        <strong style="color:var(--accent)">Car 1 leads in ${car1WinMonths.length} of ${MONTHS.length} months: ${car1WinMonths.join(', ')}</strong>
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

    const width  = 1400;
    const height = 380;
    const margin = { top: 24, right: 100, bottom: 56, left: 80 };
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
      .domain(MONTHS)
      .range([0, innerW])
      .padding(0.2);

    const allVals = MODELS.flatMap(m => m.sales);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allVals) * 1.1])
      .range([innerH, 0]);

    // Grid
    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerW)
        .tickFormat(d => (d / 1000).toFixed(1) + 'k'))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call(ax => ax.select('.domain').attr('stroke', '#e2e6ed'))
      .selectAll('text')
        .attr('font-size', 13)
        .attr('dy', '1.2em');

    // One line + dots + label per model
    const line = d3.line()
      .x((d, i) => xScale(MONTHS[i]))
      .y(d => yScale(d))
      .curve(d3.curveLinear);

    MODELS.forEach(model => {
      // Line
      g.append('path')
        .datum(model.sales)
        .attr('fill', 'none')
        .attr('stroke', model.color)
        .attr('stroke-width', 3)
        .attr('d', line);

      // Dots
      g.selectAll(null)
        .data(model.sales)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(MONTHS[i]))
        .attr('cy', d => yScale(d))
        .attr('r', 4)
        .attr('fill', model.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // End label
      const lastX = xScale(MONTHS[MONTHS.length - 1]);
      const lastY = yScale(model.sales[model.sales.length - 1]);
      g.append('text')
        .attr('x', lastX + 10)
        .attr('y', lastY + 5)
        .attr('font-size', 16)
        .attr('font-weight', 700)
        .attr('fill', model.color)
        .text(model.name);
    });
  }

  // ── Slide 18: Bar Chart with min/max highlight ────────────────────────────
  function renderBarChart() {
    if (barChartRendered) return;
    const container = document.getElementById('sales-bar-chart');
    if (!container || typeof d3 === 'undefined') return;
    barChartRendered = true;

    const totals = MONTHS.map((m, i) => ({
      month: m,
      value: MODELS.reduce((sum, model) => sum + model.sales[i], 0)
    }));

    const maxVal = Math.max(...totals.map(t => t.value));
    const minVal = Math.min(...totals.map(t => t.value));

    const width  = 1600;
    const height = 520;
    const margin = { top: 24, right: 60, bottom: 64, left: 72 };
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
      .domain(MONTHS)
      .range([0, innerW])
      .padding(0.28);

    const yScale = d3.scaleLinear()
      .domain([0, maxVal * 1.15])
      .range([innerH, 0]);

    // Grid lines
    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerW)
        .tickFormat(d => (d / 1000).toFixed(0) + 'k'))
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#e2e6ed').attr('stroke-dasharray', '3,3'));

    g.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call(ax => ax.select('.domain').attr('stroke', '#e2e6ed'))
      .selectAll('text')
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .attr('dy', '1.2em');

    // Exaggerate max/min bars so they stand out without colour
    const BOOST  = 40; // max bar this many px taller
    const SHRINK = 40; // min bar this many px shorter
    const barY = d => {
      if (d.value === maxVal) return yScale(d.value) - BOOST;
      if (d.value === minVal) return yScale(d.value) + SHRINK;
      return yScale(d.value);
    };
    const barH = d => {
      if (d.value === maxVal) return innerH - yScale(d.value) + BOOST;
      if (d.value === minVal) return innerH - yScale(d.value) - SHRINK;
      return innerH - yScale(d.value);
    };

    // Bars — all neutral to start
    const bars = g.selectAll('.bar')
      .data(totals)
      .enter()
      .append('rect')
      .attr('class', d => 'bar' + (d.value === maxVal ? ' bar-max' : d.value === minVal ? ' bar-min' : ''))
      .attr('x', d => xScale(d.month))
      .attr('y', barY)
      .attr('width', xScale.bandwidth())
      .attr('height', barH)
      .attr('rx', 8)
      .attr('fill', '#c8d0db')
      .attr('opacity', 0.85);

    // Legend — hidden until highlighted
    const legendData = [
      { color: '#00d4e0', label: 'Highest month' },
      { color: '#ef4444', label: 'Lowest month' }
    ];
    const legendG = svg.append('g')
      .attr('transform', `translate(${margin.left},${height - 20})`)
      .attr('opacity', 0);
    legendData.forEach((item, i) => {
      const lx = i * 260;
      legendG.append('rect').attr('x', lx).attr('y', 0)
        .attr('width', 18).attr('height', 18).attr('rx', 4).attr('fill', item.color);
      legendG.append('text').attr('x', lx + 26).attr('y', 14)
        .attr('font-size', 17).attr('fill', '#374151').text(item.label);
    });

    // Toggle button
    let barsHighlighted = false;
    const btn = document.getElementById('toggle-bar-highlight');
    if (btn) {
      btn.addEventListener('click', () => {
        barsHighlighted = !barsHighlighted;
        btn.classList.toggle('active', barsHighlighted);
        btn.textContent = barsHighlighted ? '✓ Remove Highlight' : 'Highlight Extremes';

        bars.transition().duration(400)
          .attr('fill', d => {
            if (!barsHighlighted) return '#c8d0db';
            if (d.value === maxVal) return '#00d4e0';
            if (d.value === minVal) return '#ef4444';
            return '#dde3ec';
          })
          .attr('opacity', d => {
            if (!barsHighlighted) return 0.85;
            return (d.value === maxVal || d.value === minVal) ? 1 : 0.35;
          })
          .attr('stroke', d => {
            if (!barsHighlighted) return 'none';
            if (d.value === maxVal) return '#00a8b5';
            if (d.value === minVal) return '#b91c1c';
            return 'none';
          })
          .attr('stroke-width', 3);

        legendG.transition().duration(400).attr('opacity', barsHighlighted ? 1 : 0);
      });
    }
  }

  // ── Slide 15 tabs + reveal ────────────────────────────────────────────────
  function initTabs() {
    if (tabsInitialized) return;
    tabsInitialized = true;
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

    const approachBtn   = document.getElementById('show-approaches');
    const approachCards = document.getElementById('approach-cards');
    // Set tall default — approaches are hidden initially
    if (tableEl) tableEl.style.maxHeight = '520px';
    if (approachBtn && approachCards) {
      approachBtn.addEventListener('click', () => {
        const visible = approachCards.style.display !== 'none';
        approachCards.style.display = visible ? 'none' : '';
        approachBtn.classList.toggle('active', !visible);
        approachBtn.textContent = visible ? 'Show Approaches' : '✓ Hide Approaches';
        // Shrink table when approaches shown, expand when hidden
        if (tableEl) tableEl.style.maxHeight = visible ? '520px' : '280px';
        if (chartEl) chartEl.style.maxHeight = visible ? '520px' : '280px';
      });
    }

    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        answerRevealed = !answerRevealed;
        revealBtn.classList.toggle('active', answerRevealed);
        revealBtn.textContent = answerRevealed ? '✓ Hide Answer' : 'Reveal Answer';
        renderSalesTable(answerRevealed);
        // Switch to table view
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
      if (e.detail.slide === 16) {
        if (!salesTableRendered) renderSalesTable(false);
        initTabs();
      }
      if (e.detail.slide === 19) {
        if (typeof d3 !== 'undefined') renderBarChart();
        else setTimeout(renderBarChart, 300);
      }
    });
  });
})();
