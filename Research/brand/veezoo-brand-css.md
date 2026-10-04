# Brand CSS for HTML Artifacts

Copy this entire `<style>` block into any self-contained HTML artifact to get the full Veezoo brand styling. This is a distilled version of the website's CSS — only the tokens and classes needed for marketing content.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
  /* ===== CSS Variables ===== */
  :root {
    --accent-primary: #00b4d8;
    --accent-secondary: #48cae4;
    --accent-dark: #0096c7;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --bg-tertiary: #f3f4f6;
    --border-light: #e5e7eb;
    --border-medium: #d1d5db;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  /* ===== Reset & Base ===== */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--text-primary);
    background: var(--bg-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.625;
  }

  /* ===== Typography ===== */
  .font-hero { font-family: 'Outfit', 'DM Sans', system-ui, sans-serif; }
  .font-display { font-family: 'DM Sans', 'Inter', system-ui, sans-serif; }
  .font-body { font-family: 'Inter', system-ui, sans-serif; }

  h1, h2, h3 {
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  h1 { font-size: 2.25rem; } /* 36px */
  h2 { font-size: 1.875rem; } /* 30px */
  h3 { font-size: 1.5rem; } /* 24px */

  p { line-height: 1.625; }

  /* ===== Text Gradient ===== */
  .text-gradient {
    background-image: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-dark) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ===== Gradient Mesh Background (base layer) ===== */
  .gradient-mesh-bg {
    background-color: #fafafa;
    background-image:
      radial-gradient(at 0% 0%, hsla(250, 50%, 95%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 0%, hsla(280, 45%, 95%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 50%, hsla(220, 50%, 96%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 50%, hsla(260, 40%, 96%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(230, 45%, 95%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 100%, hsla(270, 45%, 95%, 1) 0px, transparent 50%);
    position: relative;
    overflow: hidden;
  }

  /* ===== Hero Background Container =====
     The full Veezoo hero look. ALWAYS light with dark text.
     Layers: mesh base → colorful blobs → glass panels → blueprint grid → noise
  */
  .hero-bg {
    background-color: #fafafa;
    background-image:
      radial-gradient(at 0% 0%, hsla(250, 50%, 95%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 0%, hsla(280, 45%, 95%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 50%, hsla(220, 50%, 96%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 50%, hsla(260, 40%, 96%, 1) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(230, 45%, 95%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 100%, hsla(270, 45%, 95%, 1) 0px, transparent 50%);
    position: relative;
    overflow: hidden;
  }

  /* Colorful gradient blobs - absolutely positioned children of .hero-bg */
  .blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .blob-cyan {
    width: clamp(500px, 50vw, 900px);
    height: clamp(500px, 50vw, 900px);
    top: -10%;
    left: -15%;
    background: radial-gradient(circle, rgba(50, 170, 240, 0.85) 0%, transparent 55%);
  }
  .blob-teal {
    width: clamp(400px, 42vw, 800px);
    height: clamp(400px, 42vw, 800px);
    bottom: -10%;
    right: -15%;
    background: radial-gradient(circle, rgba(60, 170, 220, 0.7) 0%, transparent 60%);
  }
  .blob-purple {
    width: clamp(350px, 35vw, 700px);
    height: clamp(350px, 35vw, 700px);
    top: -5%;
    right: -10%;
    background: radial-gradient(circle, rgba(190, 120, 220, 0.7) 0%, transparent 60%);
  }

  /* Glassmorphism vertical panels */
  .glass-panels {
    position: absolute;
    inset: 0;
    display: flex;
    pointer-events: none;
    -webkit-mask-image: linear-gradient(to bottom, black 0%, black 45%, transparent 75%),
      linear-gradient(90deg, black 0%, black 10%, transparent 40%, transparent 60%, black 90%, black 100%);
    -webkit-mask-composite: source-in;
  }
  .glass-panel {
    height: 100%;
    flex-shrink: 0;
    width: 80px;
    margin-right: 80px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    border-left: 1px solid rgba(255, 255, 255, 0.12);
    border-right: 1px solid rgba(75, 85, 110, 0.08);
  }

  /* Blueprint grid overlay (light theme - gray lines on light bg) */
  .blueprint-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
    background-image:
      linear-gradient(to right, rgba(140, 140, 140, 0.18) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(140, 140, 140, 0.18) 1px, transparent 1px),
      linear-gradient(to right, rgba(160, 160, 160, 0.12) 0.5px, transparent 0.5px),
      linear-gradient(to bottom, rgba(160, 160, 160, 0.12) 0.5px, transparent 0.5px);
    -webkit-mask-image: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 70%, black 85%);
  }

  /* ===== Layout ===== */
  .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
  .section { padding: 64px 0; }

  /* ===== Cards ===== */
  .card {
    background: var(--bg-primary);
    border: 1px solid var(--border-light);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow-sm);
  }

  /* ===== Callout/Quote ===== */
  .callout {
    background: var(--bg-primary);
    border-left: 4px solid var(--accent-primary);
    padding: 24px 32px;
    border-radius: 0 16px 16px 0;
    box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  /* ===== Buttons ===== */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: var(--accent-primary);
    color: white;
    font-weight: 500;
    border-radius: 9999px;
    text-decoration: none;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
  }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: transparent;
    color: var(--accent-primary);
    font-weight: 500;
    border-radius: 9999px;
    text-decoration: none;
    font-size: 0.875rem;
    border: 2px solid var(--accent-primary);
    cursor: pointer;
  }

  /* ===== Metrics Strip ===== */
  .metrics-strip {
    display: flex;
    gap: 32px;
    justify-content: center;
    padding: 32px 0;
  }

  .metric {
    text-align: center;
  }

  .metric-value {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-primary);
    line-height: 1.1;
  }

  .metric-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  /* ===== Feature Grid ===== */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .feature-item {
    padding: 24px;
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(0, 180, 216, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: var(--accent-primary);
  }

  .feature-title {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-weight: 600;
    font-size: 1.125rem;
    margin-bottom: 8px;
  }

  .feature-desc {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.625;
  }

  /* ===== Trust Bar ===== */
  .trust-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 24px 0;
    opacity: 0.6;
  }

  .trust-bar img {
    height: 28px;
    width: auto;
    filter: grayscale(100%);
  }

  /* ===== Editable Fields ===== */
  [contenteditable="true"]:hover {
    outline: 2px dashed var(--accent-secondary);
    outline-offset: 4px;
    border-radius: 4px;
  }

  [contenteditable="true"]:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 4px;
    border-radius: 4px;
  }

  /* ===== Print / A4 Layout ===== */
  .page-a4 {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: white;
    overflow: hidden;
    position: relative;
  }

  .page-thumbnail {
    width: 1280px;
    height: 720px;
    overflow: hidden;
    position: relative;
  }

  @media print {
    .page-a4 { margin: 0; box-shadow: none; }
    [contenteditable="true"]:hover,
    [contenteditable="true"]:focus { outline: none; }
  }
</style>
```

## Usage Notes

- For **A4 one-pagers**, wrap everything in `<div class="page-a4">...</div>`
- For **thumbnails**, use `<div class="page-thumbnail hero-bg">...</div>` with blob children
- The Veezoo hero look is **always LIGHT background with DARK text** — never dark/navy
- For **hero sections**, use `hero-bg` class, then add blob divs, glass panels, and blueprint grid as layers
- All key text elements should have `contentEditable="true"` for in-browser editing
- The metrics strip works best with 3-5 items — adjust `flex` vs `grid` layout as needed
- Text on hero backgrounds should be `color: #111827` (text-primary) or `color: var(--text-secondary)` — NOT white
