/**
 * Number Grid with 2s toggle (Slide 17)
 */
(function () {
  'use strict';

  const GRID_SIZE = 400; // 20×20
  const COLS = 20;
  let highlighted = false;
  let rendered = false;

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
    grid.innerHTML = '';
    grid.classList.add('highlight-off');

    for (let i = 0; i < GRID_SIZE; i++) {
      const digit = Math.floor(rand() * 10);
      const cell = document.createElement('div');
      cell.className = 'num-cell' + (digit === 2 ? ' is-two' : '');
      cell.textContent = digit;
      grid.appendChild(cell);
    }

    // Count 2s for display
    const count = grid.querySelectorAll('.is-two').length;
    const countEl = document.getElementById('two-count');
    if (countEl) countEl.textContent = count;

    // Toggle button
    const btn = document.getElementById('toggle-highlight');
    const prompt = document.getElementById('grid-prompt');
    if (btn) {
      btn.addEventListener('click', () => {
        highlighted = !highlighted;
        grid.classList.toggle('highlight-off', !highlighted);
        btn.classList.toggle('active', highlighted);
        btn.textContent = highlighted ? '✓ Visual Aid ON' : 'Enable Visual Aid';
        if (prompt) {
          prompt.textContent = highlighted
            ? `How many 2s do you count? (Answer: ${count})`
            : 'Count the 2s — how many are there?';
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
