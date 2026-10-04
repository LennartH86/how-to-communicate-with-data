# How to Communicate with Data — Agent Guidelines

## What this repo is

A single-page HTML slide deck for the talk "How to Communicate with Data" by Lennart Heuckendorf, Solution Engineer at Veezoo: a journey through data visualization history, visual encoding, answering data questions with reliable AI, and data storytelling. No build step, no framework — plain HTML, CSS and vanilla JS with D3. The deck is styled in the Veezoo brand (see below).

## Structure

```
index.html          All 33 slides as <section class="slide" id="slide-N"> blocks, plus the fixed nav UI
css/styles.css      Brand tokens (:root), hero/mesh backgrounds, typography, components, per-slide layout
js/navigation.js    Slide navigation, keyboard control, CSS-transform scaling to the viewport
js/map.js           D3 world map with customer-visit markers (slide 2)
js/anscombe.js      Anscombe's quartet table and scatter plots (slides 12–13)
js/datasaurus.js    Datasaurus Dozen table and scatter grid (slides 14–15)
js/charts.js        Car-sales table + line chart (slide 16) and highlighted monthly bars (slide 19)
js/numbers.js       Number-grid pre-attentive demo, "count the twos" (slide 18)
data/*.json         Datasets for the Anscombe and Datasaurus slides
assets/images/      Veezoo logo + favicon mark, profile photo, QR code, Newman squiggle
```

## Running it

Serve the folder and open it in a browser, for example:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000. (Opening `index.html` directly from disk breaks the `fetch()` of the JSON datasets in Chrome.) Navigate with Arrow keys, Space, PageUp/PageDown, Home/End; the URL hash (`#slide-N`) deep-links to a slide and survives a refresh.

The deck needs internet access at presentation time: D3, topojson-client and the world atlas load from jsDelivr, the fonts from Google Fonts, the historical charts from Wikimedia Commons, and slides 3, 21, 22 and 29 embed YouTube and Vimeo iframes. Images have `onerror` fallbacks but the embeds do not.

**Before a talk:** slide 24 ("Live demo") links to `https://app.veezoo.com`. Point that `href` at the demo workspace you present from, and check that the QR code on slide 23 still leads to the current survey.

## Brand

The stylesheet follows the veezoo.com design system (the `brand-doc` skill in the `veezoo-ai/website` repo is the source of truth):

- **Colours:** accent `#00b4d8` (light `#48cae4`, dark `#0096c7`), text `#111827` / `#6b7280` / `#9ca3af`, surfaces `#ffffff` / `#f9fafb` / `#f3f4f6`, borders `#e5e7eb` / `#d1d5db`. All exposed as CSS variables in `:root` — use the variables, don't hardcode.
- **Fonts:** Outfit for hero headlines (`--font-hero`), DM Sans for headings (`--font-display`), Inter for body (`--font-body`). Loaded from Google Fonts in `<head>`.
- **Backgrounds:** `.hero-bg` is the signature Veezoo look (light mesh + cyan/purple/teal blobs + glass panels + blueprint grid + paper grain), used on the title, the Part 2 transition and the thank-you slide. Each hero slide carries one empty `<div class="hero-layers">` that hosts the texture layers. `.mesh-bg` is the subtle mesh-only variant for card-heavy slides. The hero is always light with dark text — never a dark background.
- **Components:** `.card` (white, 1px border, 16px radius, soft shadow), `.icon-card`, `.callout` (accent left border), `.btn` / `.btn-outline` (pills), `.toggle-btn` (pill toggles used by the interactive slides), `.chip`, `.badge-*`, `.data-table` inside `.table-frame`.
- **Slide heads:** `.slide-head` > `.eyebrow` (uppercase kicker) + `.section-title` (optionally `.sm`) + `.section-lead`. Accent words inside titles use `<span class="text-gradient">`.
- **Chart palette:** categorical series in fixed order `--series-1` cyan `#00b4d8`, `--series-2` violet `#7c3aed`, `--series-3` amber `#f59e0b` (validated for colour-vision deficiency); extremes highlight cyan vs red `#ef4444`; grid lines `#e5e7eb`; neutral marks `#d1d5db`. Chart text stays in ink colours, a coloured marker carries series identity.
- A small Veezoo logo (`#brand-mark`) sits bottom-left on every slide except the title and the Veezoo video slide. Keep content clear of that corner (`.slide-center` reserves the bottom padding for it).

## Conventions

- Each JS file is an IIFE that renders lazily on the `slidechange` event; keep new interactive slides in the same pattern (one module per topic, `'use strict'`, render-once guards). `navigation.js` re-fires the initial event on the next tick so deep links render.
- Slides are numbered by their `id`. Commit messages reference the slide they touch, e.g. `Slide 29: move Veezoo overlay card to lower right corner`.
- Copy style: sentence case for headings and buttons, no emoji in UI text, avoid em-dashes in new copy (restructure the sentence instead).
- Keep the deck self-contained: new assets go in `assets/`, new data in `data/`, no bundlers or package managers.
- Renumbering slides means updating the `id`s, the slide numbers in `js/*.js` (event handlers and header comments), and the structure table above.

## Skills

Claude Code skills live in `.claude/skills/` (standard format: one folder per skill with a `SKILL.md`). There are none yet.

## Veezoo OS

This repo is a Veezoo OS project. Its project note is `How to Communicate with Data.md`
at the repo root. Shared knowledge notes live in `veezoo-os/`
(Obsidian markdown, YAML frontmatter encouraged). Only write content there
that is intended for everyone with access to this repo.
