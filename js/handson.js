/**
 * Hands-on slide (Slide 41): two buttons swap the three step cards for
 * the opening line of questioning or the root-cause brief (presenter reminders).
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const slide = document.getElementById('slide-41');
    if (!slide) return;
    const buttons = Array.from(slide.querySelectorAll('.toggle-btn[data-panel]'));
    const labels = { sequence: 'Show the opening sequence', rca: 'Show the root-cause brief' };
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.dataset.panel;
        const wasOpen = slide.classList.contains('show-' + panel);
        slide.classList.remove('show-sequence', 'show-rca');
        buttons.forEach(b => { b.classList.remove('active'); b.textContent = labels[b.dataset.panel]; });
        if (!wasOpen) {
          slide.classList.add('show-' + panel);
          btn.classList.add('active');
          btn.textContent = 'Back to the three steps';
        }
      });
    });
  });
})();
