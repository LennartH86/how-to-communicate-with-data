# How to Communicate with Data: agent guidelines

## What this repo is

A single-page HTML slide deck for the 3-hour sessions "How to Communicate with Data" by Lennart Heuckendorf, Solution Engineer at Veezoo, for an MBA audience: data visualization history, how we see data, why an AI's answer on company data is only as good as the definitions behind it (with a live demo and a hands-on), and research-backed visual best practices. No build step, no framework: plain HTML, CSS and vanilla JS with D3. The deck is styled in the Veezoo brand (see below). Veezoo appears as Lennart's employer and, together with Tableau, as one of the two tools used in the hands-on; never as a pitch.

`PROPOSAL-v3-ai-first.md` documents the reasoning behind the current structure and the source register for every number on the "Asking an AI" slides.

## Structure

```
index.html          All 44 slides (43 in the Tableau track) as <section class="slide" id="slide-N"> blocks, plus the fixed nav UI
css/styles.css      Brand tokens (:root), hero/mesh backgrounds, typography, components, per-slide layout
js/navigation.js    Slide navigation, keyboard control, CSS-transform scaling, session track from ?track=
js/map.js           D3 world map with customer-visit markers (slide 2)
js/anscombe.js      Anscombe's quartet table and scatter plots (slides 14–15)
js/datasaurus.js    Datasaurus Dozen table and scatter grid (slides 16–17)
js/charts.js        GDP-growth table + line chart (slide 18) and world-growth bars with highlighted extremes (slide 22)
js/numbers.js       Number-grid pre-attentive demo, "count the twos" (slide 20)
js/semantics.js     "Asking an AI" block: accuracy cliff chart (slide 28), country-definition picker (slide 29)
js/survey.js        Live survey results on slide 31: polls the shared response sheet, hit rate vs random guessing
js/bestpractices.js Click-to-switch examples on the visual best-practice slides (35–39), class-based
data/*.json         Anscombe and Datasaurus datasets, gdp-growth.json (World Bank, slides 18 and 22), ai-accuracy.json (slide 28)
demo/               Survey pipeline: BigQuery DDL, Apps Script, README with the pre-session checklist
assets/images/      Veezoo logo + favicon mark, profile photo, QR code
Research/           Paper dossier behind the best-practice slides, brand references in Research/brand/
```

Slide order: 1 title · 2 about · 3 video · 4 agenda · 5 learnings · 6 two roles (analyst, business user) · 7 Part 1 divider · 8–11 historical charts · 12 encoding lesson · 13 Part 2 divider · 14–17 Anscombe and Datasaurus · 18 GDP growth challenge (table vs chart vs AI) · 19 pre-attentive divider · 20 count the 2s · 21 what just happened · 22 highlight the extremes · 23 toolkit · 24–25 videos · 26 Part 3 divider · 27 just ask · 28–30 asking an AI (cliff, definitions, vendor voices) · 31 survey QR + live results · 32 live demo divider · 33 analytics workflow · 34 Part 4 divider · 35–39 best practices · 40 which role today · 41 hands-on (Veezoo track only) · 42 summary · 43 resources · 44 thank you.

**Two session tracks.** `index.html?track=veezoo` (default) is the session where the hands-on runs in Veezoo; `index.html?track=tableau` is the session where another instructor runs the hands-on in Tableau. The track only changes copy and one slide: elements with `data-track` are shown in their track only, slide 40 highlights the role practised that day, and slide 41 (the Veezoo hands-on) exists only in the Veezoo track, so the Tableau track has 43 slides and hands over to the other instructor on slide 40. The narrative behind it: the analyst builds recurring, curated content (Parts 1, 2, 4), the business user asks the day's questions directly (Part 3); slide 6 introduces the two roles without naming tools, slide 40 names Tableau and Veezoo as the two tools in use.

## Running it

Serve the folder and open it in a browser, for example:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000. (Opening `index.html` directly from disk breaks the `fetch()` of the JSON datasets in Chrome.) Navigate with Arrow keys, Space, PageUp/PageDown, Home/End; the URL hash (`#slide-N`) deep-links to a slide and survives a refresh. `.claude/launch.json` has a `deck` entry that attaches the Claude browser preview to a server you start yourself (the preview helper cannot read `~/Documents`, so it cannot spawn the server).

The deck needs internet access at presentation time: D3, topojson-client and the world atlas load from jsDelivr, the fonts from Google Fonts, the historical charts from Wikimedia Commons, slides 3, 24 and 25 embed YouTube iframes, and slide 31 polls the shared survey sheet. `data/gdp-growth.json` is a static snapshot of World Bank data (indicator NY.GDP.MKTP.KD.ZG); refresh it with the API call noted in the file's `source` field if the series should be current. Images have `onerror` fallbacks but the embeds do not.

**Before a session:** open the deck with the right `?track=`, follow the checklist in `demo/README.md` (QR on slide 31, sheet shared, live panel says "Live"), put the hands-on access link on slide 41 for the Veezoo track (it currently says "arrive by email"), verify the paraphrased Snowflake quote on slide 30 against the original blog post, hard-reload the browser (Cmd+Shift+R) so no cached scripts linger, and keep the demo workspace open in another tab (the demo runs outside the deck).

## Brand

The stylesheet follows the veezoo.com design system (the `brand-doc` skill in the `veezoo-ai/website` repo is the source of truth; copies live in `Research/brand/`):

- **Colours:** accent `#00b4d8` (light `#48cae4`, dark `#0096c7`), text `#111827` / `#6b7280` / `#9ca3af`, surfaces `#ffffff` / `#f9fafb` / `#f3f4f6`, borders `#e5e7eb` / `#d1d5db`. All exposed as CSS variables in `:root`. Use the variables, don't hardcode.
- **Fonts:** Outfit for hero headlines (`--font-hero`), DM Sans for headings (`--font-display`), Inter for body (`--font-body`). Loaded from Google Fonts in `<head>`.
- **Backgrounds:** `.hero-bg` is the signature Veezoo look (light mesh + cyan/purple/teal blobs + glass panels + blueprint grid + paper grain), used on the title, the part dividers (7, 13, 19, 26, 34), the live-demo divider and the thank-you slide. Each hero slide carries one empty `<div class="hero-layers">` that hosts the texture layers; dividers add `.hero-divider` for the centred layout. `.mesh-bg` is the subtle mesh-only variant for card-heavy slides. The hero is always light with dark text, never a dark background.
- **Components:** `.card` (white, 1px border, 16px radius, soft shadow), `.icon-card`, `.callout` (accent left border), `.btn` / `.btn-outline` (pills), `.toggle-btn` (pill toggles used by the interactive slides), `.chip`, `.badge-*`, `.data-table` inside `.table-frame`.
- **Slide heads:** `.slide-head` > `.eyebrow` (uppercase kicker) + `.section-title` (optionally `.sm`) + `.section-lead`. Accent words inside titles use `<span class="text-gradient">`. The "Asking an AI" slides use `.ai-wrap` with `.slide-head.left` and a `.sources` footer.
- **Chart palette:** categorical series in fixed order `--series-1` cyan `#00b4d8`, `--series-2` violet `#7c3aed`, `--series-3` amber `#f59e0b` (validated for colour-vision deficiency); extremes and "silently wrong" highlight cyan vs red `#ef4444`; grid lines `#e5e7eb`; neutral marks `#d1d5db`. Chart text stays in ink colours, a coloured marker carries series identity.
- The Veezoo logo appears only on the title slide and the resources card; there is no persistent brand mark on the slides. Veezoo and Tableau are named as tools only on slides 40, 41 and 43.

## Conventions

- Each JS file is an IIFE that renders lazily on the `slidechange` event; keep new interactive slides in the same pattern (one module per topic, `'use strict'`, render-once guards). `navigation.js` re-fires the initial event on the next tick so deep links render.
- Slides are numbered by their `id`. Commit messages reference the slide they touch, e.g. `Slide 29: add the what-is-a-country card`.
- Copy style: sentence case for headings and buttons, no emoji in UI text, avoid em-dashes in new copy (restructure the sentence instead). Do not say on any slide where the best-practice rules come from ("research-backed", "45 studies"); the rules stand on their own and the sources sit in the slide footers. On the "Asking an AI" slides, no technical vocabulary (SQL, knowledge graph, ontology, semantic layer, benchmark names) outside the `.sources` footers; the audience is MBA students.
- Every number on the "Asking an AI" slides needs a dated source in the footer. The source register in `PROPOSAL-v3-ai-first.md` section 7 says which figures are verified (its slide numbers are from an earlier numbering).
- Keep the deck self-contained: new assets go in `assets/`, new data in `data/`, no bundlers or package managers.
- Renumbering slides means updating the `id`s, the slide numbers in `js/*.js` (event handlers and header comments), the `#slide-counter` text, and the structure table above.

## Skills

Claude Code skills live in `.claude/skills/` (standard format: one folder per skill with a `SKILL.md`). There are none yet.

## Veezoo OS

This repo is a Veezoo OS project. Its project note is `How to Communicate with Data.md`
at the repo root (on `main`). Shared knowledge notes live in `veezoo-os/`
(Obsidian markdown, YAML frontmatter encouraged). Only write content there
that is intended for everyone with access to this repo.
