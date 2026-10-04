/**
 * Visual Best Practices (Slides 22–26): clicking a rule shows its example
 */
(function () {
  'use strict';

  function select(rule) {
    const slide = rule.closest('.bp-slide');
    const i = rule.dataset.ex;
    slide.querySelectorAll('.bp-rule').forEach(r => r.classList.toggle('is-active', r === rule));
    slide.querySelectorAll('.bp-ex').forEach(ex => ex.classList.toggle('is-active', ex.dataset.ex === i));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bp-rule').forEach(rule => {
      rule.addEventListener('click', () => select(rule));
      rule.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); select(rule); }
      });
    });
  });
})();
