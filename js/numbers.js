/**
 * Number Grid with exactly 11 twos (Slide 17)
 */
(function () {
  'use strict';

  const COLS      = 12;
  const ROWS      = 9;
  const TOTAL     = COLS * ROWS; // 108 cells
  const TWO_COUNT = 11;

  let highlighted = false;
  let rendered    = false;

  function seededRand(seed) {
    let s = seed;
    return function () {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }

  function renderGrid() {
    if (rendered) return;
    const grid = document.getElementById('number-grid');
    if (!grid) return;
    rendered = true;

    const rand = seededRand(42);

    // Fill all cells with non-2 digits (1,3-9)
    const OTHER = [1,3,4,5,6,7,8,9];
    const cells = [];
    for (let i = 0; i < TOTAL; i++) {
      cells.push(OTHER[Math.floor(rand() * OTHER.length)]);
    }

    // Place exactly 11 twos at seeded positions (no duplicates)
    const positions = new Set();
    while (positions.size < TWO_COUNT) {
      positions.add(Math.floor(rand() * TOTAL));
    }
    positions.forEach(pos => { cells[pos] = 2; });

    // Render
    grid.innerHTML = '';
    cells.forEach(digit => {
      const cell = document.createElement('div');
      cell.className = 'num-cell' + (digit === 2 ? ' is-two' : '');
      cell.textContent = digit;
      grid.appendChild(cell);
    });

    // Button wiring
    const btn    = document.getElementById('toggle-highlight');
    const prompt = document.getElementById('grid-prompt');
    if (btn) {
      btn.addEventListener('click', () => {
        highlighted = !highlighted;
        grid.classList.toggle('highlight-off', !highlighted);
        grid.classList.toggle('highlight-on',   highlighted);
        btn.classList.toggle('active', highlighted);
        btn.textContent = highlighted ? '✓ Hide Answer' : 'Reveal Answer';
        if (prompt) {
          prompt.innerHTML = highlighted
            ? `There are <strong style="color:var(--accent)">${TWO_COUNT} twos</strong> in this grid`
            : `How many <strong style="color:var(--accent)">2s</strong> are hidden in this grid?`;
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('slidechange', e => {
      if (e.detail.slide === 17) renderGrid();
    });
  });
})();
