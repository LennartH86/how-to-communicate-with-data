/**
 * Hands-on slide (Slide 41): button that swaps the three steps for the
 * opening line of questioning (three turns and the resulting scatter plot).
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const slide = document.getElementById('slide-41');
    const btn = document.getElementById('handson-toggle');
    if (!slide || !btn) return;
    btn.addEventListener('click', () => {
      const shown = slide.classList.toggle('show-sequence');
      btn.classList.toggle('active', shown);
      btn.textContent = shown ? 'Back to the three steps' : 'Show the opening sequence';
    });
  });
})();
