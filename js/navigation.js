/**
 * Slide navigation, keyboard control, and CSS-transform scaling
 */
(function () {
  'use strict';

  let currentSlide = 1;
  let totalSlides = 0;
  let isTransitioning = false;

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    const slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;

    // Read slide from URL hash
    const hash = window.location.hash;
    if (hash && hash.startsWith('#slide-')) {
      const n = parseInt(hash.replace('#slide-', ''), 10);
      if (n >= 1 && n <= totalSlides) currentSlide = n;
    }

    showSlide(currentSlide, false);
    applyScale();

    // Events
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', applyScale);
    document.getElementById('nav-prev').addEventListener('click', prevSlide);
    document.getElementById('nav-next').addEventListener('click', nextSlide);

    // Click to navigate (left half = prev, right half = next)
    document.getElementById('presentation').addEventListener('click', onPresentationClick);
  }

  // ── Scale ─────────────────────────────────────────────────────────────────
  function applyScale() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleX = vw / 1920;
    const scaleY = vh / 1080;
    const scale = Math.min(scaleX, scaleY);
    document.documentElement.style.setProperty('--slide-scale', scale);

    // Center the scaled presentation
    const scaledW = 1920 * scale;
    const scaledH = 1080 * scale;
    const offsetX = (vw - scaledW) / 2;
    const offsetY = (vh - scaledH) / 2;

    const pres = document.getElementById('presentation');
    pres.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

    // Scale the fixed UI elements too
    const navUI = document.getElementById('nav-ui');
    const counter = document.getElementById('slide-counter');
    if (navUI) {
      navUI.style.bottom = offsetY + 'px';
      navUI.style.left = offsetX + 'px';
      navUI.style.width = scaledW + 'px';
    }
    if (counter) {
      counter.style.top = offsetY + 'px';
      counter.style.right = (vw - offsetX - scaledW) + 'px';
      counter.style.fontSize = Math.round(20 * scale) + 'px';
    }

    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    if (navPrev) {
      navPrev.style.left = (offsetX + 24 * scale) + 'px';
      navPrev.style.width = Math.round(56 * scale) + 'px';
      navPrev.style.height = Math.round(56 * scale) + 'px';
      navPrev.style.fontSize = Math.round(22 * scale) + 'px';
    }
    if (navNext) {
      navNext.style.right = (vw - offsetX - scaledW + 24 * scale) + 'px';
      navNext.style.width = Math.round(56 * scale) + 'px';
      navNext.style.height = Math.round(56 * scale) + 'px';
      navNext.style.fontSize = Math.round(22 * scale) + 'px';
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function showSlide(n, animate = true) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
      s.classList.toggle('active', i + 1 === n);
    });

    // Update counter
    const counter = document.getElementById('slide-counter');
    if (counter) counter.textContent = n + ' / ' + totalSlides;

    // Update progress bar
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = ((n / totalSlides) * 100) + '%';

    // Update hash
    history.replaceState(null, null, '#slide-' + n);

    // Fire init event for slide-specific JS
    const event = new CustomEvent('slidechange', { detail: { slide: n } });
    document.dispatchEvent(event);
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      currentSlide++;
      showSlide(currentSlide);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      currentSlide--;
      showSlide(currentSlide);
    }
  }

  function goToSlide(n) {
    if (n >= 1 && n <= totalSlides) {
      currentSlide = n;
      showSlide(currentSlide);
    }
  }

  // ── Events ────────────────────────────────────────────────────────────────
  function onKeyDown(e) {
    // Don't hijack input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;
    }
  }

  function onPresentationClick(e) {
    // Don't navigate when clicking interactive elements
    const tag = e.target.tagName.toLowerCase();
    if (['button', 'a', 'input', 'select', 'textarea', 'label'].includes(tag)) return;
    if (e.target.closest('button, a, input, select, .toggle-btn, iframe, .tableauPlaceholder')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;

    if (relX > 0.5) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  // ── Expose API ────────────────────────────────────────────────────────────
  window.SlideNav = { next: nextSlide, prev: prevSlide, go: goToSlide };

  // ── Start ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
