# How to Communicate with Data: agent guidelines

## What this repo is

A single-page HTML slide deck for the 3-hour session "How to Communicate with Data" by Lennart Heuckendorf, Solution Engineer at Veezoo, for an MBA audience: data visualization history, how we see data, why an AI's answer on company data is only as good as the definitions behind it (with a live demo and a hands-on), and research-backed visual best practices. No build step, no framework: plain HTML, CSS and vanilla JS with D3. The deck is styled in the Veezoo brand (see below). Veezoo appears only as Lennart's employer, never as a product.

`PROPOSAL-v3-ai-first.md` documents the reasoning behind the current structure and the source register for every number on the "Asking an AI" slides.

## Structure

```
index.html          All 41 slides as <section class="slide" id="slide-N"> blocks, plus the fixed nav UI
css/styles.css      Brand tokens (:root), hero/mesh backgrounds, typography, components, per-slide layout
js/navigation.js    Slide navigation, keyboard control, CSS-transform scaling to the viewport
js/map.js           D3 world map with customer-visit markers (slide 2)
js/anscombe.js      Anscombe's quartet table and scatter plots (slides 13–14)
js/datasaurus.js    Datasaurus Dozen table and scatter grid (slides 15–16)
js/charts.js        Car-sales table + line chart (slide 17) and highlighted monthly bars (slide 20)
js/numbers.js       Number-grid pre-attentive demo, "count the twos" (slide 19)
js/semantics.js     "Asking an AI" block: accuracy cliff chart (slide 26), country-definition picker (slide 27)
js/bestpractices.js Click-to-switch examples on the visual best-practice slides (33–37), class-based
data/*.json         Anscombe and Datasaurus datasets, ai-accuracy.json for the cliff chart
assets/images/      Veezoo logo + favicon mark, profile photo, QR code
Research/           Paper dossier behind the best-practice slides, brand references in Research/brand/
```

Slide order: 1 title · 2 about · 3 video · 4 agenda · 5 learnings · 6 Part 1 divider · 7–10 historical charts · 11 encoding lesson · 12 Part 2 divider · 13–16 Anscombe and Datasaurus · 17 car sales · 18–21 pre-attentive · 22–23 videos · 24 Part 3 divider · 25 just ask · 26–28 asking an AI (cliff, definitions, vendor voices) · 29 survey QR · 30 live demo divider · 31 analytics workflow · 32 Part 4 divider · 33–37 best practices · 38 hands-on · 39 summary · 40 resources · 41 thank you.

## Running it

Serve the folder and open it in a browser, for example:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000. (Opening `index.html` directly from disk breaks the `fetch()` of the JSON datasets in Chrome.) Navigate with Arrow keys, Space, PageUp/PageDown, Home/End; the URL hash (`#slide-N`) deep-links to a slide and survives a refresh. `.claude/launch.json` has a `deck` entry for the Claude browser preview.

The deck needs internet access at presentation time: D3, topojson-client and the world atlas load from jsDelivr, the fonts from Google Fonts, the historical charts from Wikimedia Commons, and slides 3, 22 and 23 embed YouTube iframes. Images have `onerror` fallbacks but the embeds do not.

**Before a session:** check that the QR code on slide 29 still leads to the current survey, put the hands-on access link on slide 38 (it currently says "arrive by email"), verify the paraphrased Snowflake quote on slide 28 against the original blog post, and keep the demo workspace open in another tab (the demo runs outside the deck).

## Brand

The stylesheet follows the veezoo.com design system (the `brand-doc` skill in the `veezoo-ai/website` repo is the source of truth; copies live in `Research/brand/`):

- **Colours:** accent `#00b4d8` (light `#48cae4`, dark `#0096c7`), text `#111827` / `#6b7280` / `#9ca3af`, surfaces `#ffffff` / `#f9fafb` / `#f3f4f6`, borders `#e5e7eb` / `#d1d5db`. All exposed as CSS variables in `:root`. Use the variables, don't hardcode.
- **Fonts:** Outfit for hero headlines (`--font-hero`), DM Sans for headings (`--font-display`), Inter for body (`--font-body`). Loaded from Google Fonts in `<head>`.
- **Backgrounds:** `.hero-bg` is the signature Veezoo look (light mesh + cyan/purple/teal blobs + glass panels + blueprint grid + paper grain), used on the title, the four part dividers, the live-demo divider and the thank-you slide. Each hero slide carries one empty `<div class="hero-layers">` that hosts the texture layers; dividers add `.hero-divider` for the centred layout. `.mesh-bg` is the subtle mesh-only variant for card-heavy slides. The hero is always light with dark text, never a dark background.
- **Components:** `.card` (white, 1px border, 16px radius, soft shadow), `.icon-card`, `.callout` (accent left border), `.btn` / `.btn-outline` (pills), `.toggle-btn` (pill toggles used by the interactive slides), `.chip`, `.badge-*`, `.data-table` inside `.table-frame`.
- **Slide heads:** `.slide-head` > `.eyebrow` (uppercase kicker) + `.section-title` (optionally `.sm`) + `.section-lead`. Accent words inside titles use `<span class="text-gradient">`. The "Asking an AI" slides use `.ai-wrap` with `.slide-head.left` and a `.sources` footer.
- **Chart palette:** categorical series in fixed order `--series-1` cyan `#00b4d8`, `--series-2` violet `#7c3aed`, `--series-3` amber `#f59e0b` (validated for colour-vision deficiency); extremes and "silently wrong" highlight cyan vs red `#ef4444`; grid lines `#e5e7eb`; neutral marks `#d1d5db`. Chart text stays in ink colours, a coloured marker carries series identity.
- A small Veezoo logo (`#brand-mark`) sits bottom-left on every slide except the title and the video slides. Keep content clear of that corner (`.slide-center`, `.ai-wrap` and `.bp-wrap` reserve the bottom padding for it).

## Conventions

- Each JS file is an IIFE that renders lazily on the `slidechange` event; keep new interactive slides in the same pattern (one module per topic, `'use strict'`, render-once guards). `navigation.js` re-fires the initial event on the next tick so deep links render.
- Slides are numbered by their `id`. Commit messages reference the slide they touch, e.g. `Slide 27: add the what-is-a-country card`.
- Copy style: sentence case for headings and buttons, no emoji in UI text, avoid em-dashes in new copy (restructure the sentence instead). On the "Asking an AI" slides, no technical vocabulary (SQL, knowledge graph, ontology, semantic layer, benchmark names) outside the `.sources` footers; the audience is MBA students.
- Every number on the "Asking an AI" slides needs a dated source in the footer. The source register in `PROPOSAL-v3-ai-first.md` section 7 says which figures are verified.
- Keep the deck self-contained: new assets go in `assets/`, new data in `data/`, no bundlers or package managers.
- Renumbering slides means updating the `id`s, the slide numbers in `js/*.js` (event handlers and header comments), the `#slide-counter` text, and the structure table above.

## Skills

Claude Code skills live in `.claude/skills/` (standard format: one folder per skill with a `SKILL.md`). There are none yet.

## Veezoo OS

This repo is a Veezoo OS project. Its project note is `How to Communicate with Data.md`
at the repo root (on `main`). Shared knowledge notes live in `veezoo-os/`
(Obsidian markdown, YAML frontmatter encouraged). Only write content there
that is intended for everyone with access to this repo.
