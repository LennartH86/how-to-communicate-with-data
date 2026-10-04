# Proposal v3: the "why AI gets company data wrong" block, deck coherency, Veezoo restyle

Status: implemented on 2026-10-04 (commits 4c226a6 and b4e9ddc on `ai-first-rework`). Kept as the record of the reasoning and as the source register for the numbers on slides 26 to 28.

Audience: **MBA business students.** Consequence for everything below: no SQL, no "text-to-SQL", no "knowledge graph", no "ontology", no "semantic layer", no architecture diagrams, no benchmark names on the slides. Those words may appear only in source footnotes and speaker notes. The argument is made in business language: definitions, trust, "what is a customer".

Research behind this document: `~/Documents/academic-papers/output/` (1,837 extracted text-to-SQL / KG papers, anchor paper Cube `arxiv_2604.25149`), `~/Documents/sales-toolkit/`, `~/Documents/veezoo-work/competition/` (vendor admissions, the "Executable, plausible, incorrect" chart), and the `veezoo-ai/website` brand-doc skill (copied to `Research/brand/`).

---

## 0. Read this first

1. **This branch predates the Veezoo restyle on `main`.** `ai-first-rework` forked at `6fbcc0c`. `main` then got `f2c1233`, which carries the complete brand system (tokens, `.hero-bg` / `.mesh-bg` / `.hero-layers`, `#brand-mark`, `.slide-head`, `.card`, `.callout`, `.btn`, `--series-*`, the deep-link fix in `navigation.js`, `CLAUDE.md`, `assets/images/veezoo-mark.svg`). This branch still has the old white / `#00d4e0` / Inter-only stylesheet. Both branches rewrote `index.html` and `styles.css`, so a `git merge main` would conflict everywhere. **Port main's CSS and assets onto this branch by hand (section 5), do not merge.**
2. **The AI argument in the deck is currently two slides of icon cards (25, 26)** that assert "AI hallucinates" and "we need reliable AI" without an example, a number or a reason. The three slides in section 2 replace the assertion with a reason the audience can retell.
3. **Slide-number mechanics are friendly.** All number-keyed JS (map 2, anscombe 13/14, datasaurus 15/16, charts 17/20, numbers 19) sits before slide 22. Every structural change happens from slide 24 onward, so **no JS slide numbers change**. Only CSS id selectors and HTML banners for the old slides 24, 28, 37, 38, 39 move.

Decisions taken by Lennart (2026-10-04):
- Veezoo appears only as employer (title, bio, thank-you), never as product. No demo line, no resources card.
- Both videos (22, 23) stay. Slide 21 (pre-attentive toolkit) stays. The workflow slide (old 28) stays.
- The demo stays happy-path; the hands-on carries the "ask something it cannot know" experience.
- The capacity anecdote (AAH / AAK / AE) is not used.
- Vendor-voices slide: build it, judge it in the deck.
- Brand is ported from `main` by hand.

---

## 1. The thesis in one paragraph (what the block must land, in the audience's words)

Everyone in the room has pasted a spreadsheet into a chatbot and got a good answer. So why not point the chatbot at the company's data? Because the demo and the company are different worlds. On a clean demo database the AI is right nine times out of ten. On a real, grown company data landscape it is right six times out of ten, and the other four answers do not look wrong: they come back as a number, a chart, a confident sentence. The reason is simple and not technical: the data tells the AI what exists (a column called `customers`, a column called `revenue`) but not what it means (is a customer someone who signed up, who paid once, who is active this month, who has not churned? Is revenue gross or net, with or without cancellations, in which fiscal period?). The AI has to guess, and a guess that produces a number is indistinguishable from knowledge. The fix is not a smarter model: the research shows that switching models barely moves the needle, while writing down what the data means moves it a lot. The practical takeaway for a business user is one habit: before you trust a number from an AI, ask it to show you the definition behind it. If it cannot, you are looking at a guess.

Slide-level narrative: **Demo vs reality (what) → "What is a customer?" (why) → The vendors say it themselves (proof) → Live demo → Hands-on where you check the definition.**

---

## 2. New block: three slides, "Why the chatbot that nails your spreadsheet fails on company data"

Position: inside Part 3, after the merged "Just ask" slide and before the survey QR and the live demo (v3 slides 26, 27, 28; see section 3). Shared grammar: eyebrow `Asking an AI · 1 / 3`, `2 / 3`, `3 / 3`, mirroring the `Visual Best Practices · n / 5` eyebrows. Each slide has a `.bp-sources`-style footer in `--text-3` with dated citations; the footer is where the benchmark and paper names live, nowhere else.

### Slide 26 (new): "The AI did not get worse. The data got real."

**Purpose.** Replace "AI hallucinates" with a picture: demo-grade accuracy does not survive contact with a real company. One chart, one sentence.

**Layout.** `.slide-head.left`: eyebrow, title, lead "On a demo database the AI is right nine times out of ten. On a grown company data landscape, four answers in ten are wrong, and they still come back as numbers." Body: D3 chart on the left two thirds, one `.callout` on the right third. No toggles (the "same model" variant from the earlier draft is dropped as too technical).

**Chart: "Correct vs silently wrong".** Horizontal stacked bars, five rows, segments *Correct* (`--series-1`) and *Wrong, but delivered as an answer* (`--red`). Row labels in business language; benchmark names only in the footer. Data from Lennart's own 2026-08-07 chart (`competition/competition-slides/sources/viz_executable-plausible-incorrect_2026-08-07.md`), rebuilt in D3 in the deck palette.

| Row label (on slide) | Correct | Silently wrong | Footer source |
|---|---|---|---|
| Demo database | 92% | 7% | Spider |
| Fully documented data warehouse | 79% | 21% | Spider 2.0-Snow |
| Typical company data warehouse | 70% | 29% | Spider 2.0-AIFunc |
| Specialist department data | 63% | 37% | BiomedSQL |
| Grown data landscape | 59% | 41% | DS-NL2SQL |

Animate the bars in on first render (same reveal pattern as slide 20). Label the two segments once, at the top, not in a legend box. Method line under the chart, small: "Best reported result per study, frontier AI models, 2024 to 2026. Silently wrong = the answer ran and returned a number, and the number was wrong."

**Callout (right).** Title: **"The failure is not an error message."** Body: "In four out of five failures the AI picked the wrong table, the wrong join or the wrong filter. The answer still arrived: a number, a chart, a confident sentence. Nothing told the user anything had gone wrong." (Shen et al. 2025 via Cube §2.1; NL2SQLBench 2026.)

**Speaker note (HTML comment).** "Every one of these systems had the full description of the database: every table, every column, every type. What it did not have is what the columns mean. Hold that thought for the next slide."

**Footer.** Lei et al. 2025 · Chen et al. 2024 · Rumiantsau & Fokeev 2026 (arXiv:2604.25149) · Shen et al. 2025 · Spider 2.0-AIFunc 2026 · BiomedSQL 2025 · DS-NL2SQL 2025.

**Files.** `data/ai-accuracy.json` (five rows), `js/semantics.js` (IIFE, `'use strict'`, renders on `slidechange` for slide 26, render-once guard, same shape as `anscombe.js`).

### Slide 27 (new): "A wrong answer looks exactly like a right one"

**Purpose.** Make the reason tangible with an example every MBA has argued about in a meeting: what counts as a customer. Then give the one-sentence fix and the one habit that follows from it.

**Layout.** `.slide-head.left`: eyebrow `· 2 / 3`, title, lead "The data says what exists. It does not say what it means." Body in two columns: left (55%) the interactive "What is a customer?" card, right (45%) the "Revenue means one thing, not forty" list and the takeaway callout.

**Left: "How many countries are there?"** One `.card` styled as a question with four answer rows underneath, each a `.toggle-btn`-like pill with a definition and a number. All four are real and all four are right. Click any pill and its number grows large in the card header (plain JS count-up), with the definition under it in `--text-2`:

| Definition | Count |
|---|---|
| UN member states | 193 |
| UN members plus observer states (Vatican, Palestine) | 195 |
| National Olympic Committees | 206 |
| ISO 3166 country codes | 249 |

Caption under the pills: **"Same world. Same question. Four right answers. An AI picks one and does not tell you which."** The example is deliberately the demo's domain: Gapminder and the World Bank each make their own choice here (World Bank: 217 economies), which the demo can pick up. Footer: UN, IOC, ISO 3166-1, World Bank, 2026.

**Right, top: "Revenue means one thing, not forty."** Four short rows in a `.card`, each a definition decision a human analyst would make without noticing, written as plain questions:

1. Gross or net of discounts?
2. With or without cancelled orders?
3. Booked when ordered, shipped or paid?
4. Calendar year or fiscal year?

Below the list, one evidence line in `--text-2`: "In a study of real company questions, 96 percent needed knowledge that was written down nowhere in the data. The best AI system got 16 percent right. Human analysts: 84 percent." (EntSQL 2026, footer.)

**Right, bottom: takeaway `.callout`** (accent left border, this is the sentence people should write down): **"Someone has to write down what the data means. Before you trust an AI's number, ask it: show me the definition behind this."** Second line, smaller: "If it can show you, you can act on the answer. If it cannot, you are looking at a guess." This is the exact check the hands-on (slide 38) asks for.

**Speaker note.** "The research is unambiguous on one point: switching to a bigger, more expensive model barely changes these results. Writing down what the data means changes them a lot. In one study three different frontier models landed within five points of each other, and a four-page document of definitions lifted all three by twenty." (Cube 2026, Table 1.) Say it, do not put it on the slide.

**Footer.** EntSQL 2026 (arXiv:2606.03363) · Rumiantsau & Fokeev 2026 · Sequeda et al. 2023 · UN · IOC · ISO 3166-1 · World Bank.

### Slide 28 (new): "You do not have to take my word for it"

**Purpose.** Vendor-neutral proof from the platforms themselves. Builds the credibility of slides 26 and 27 without the speaker arguing. Lennart will judge in the deck whether it stays.

**Layout.** `.slide-head`: eyebrow `· 3 / 3`, title, lead "The companies selling AI on company data say the same thing." Three `.callout` quote cards in a row, no logos, company and year in the attribution line only, a large `"` in `--accent-soft` behind each.

1. *"Agents are only as good as the context they have. Without a shared definition of what the business actually means, even a capable agent will guess."* Databricks, 2026.
2. *"Over 90 percent accuracy on the academic test. 51 percent on our own business questions."* Snowflake engineering, 2024 (paraphrased; verify the exact sentence before the talk).
3. *"The hardest task is understanding the database contents. After that, writing the query is generally straightforward."* AT&T research, 2025.

Bottom line, `font-hero`, centred: **"The question is not how smart the AI is. It is whether it is allowed to guess."**

**Speaker note.** "Every data platform shipped a 'definitions layer' in the last eighteen months for exactly this reason. Which brings us to the demo: let's see what an answer looks like when the definition is one click away." Advance to the survey QR.

**Footer.** Databricks Genie Ontology announcement, Aug 2026 · Snowflake engineering blog, 2024 · AT&T, arXiv:2505.19988, 2025.

---

## 3. v3 slide order and the actions per slide

Legend: **keep** = unchanged apart from restyle; **rewrite** = same slot, new copy or layout; **new**; **move**; **cut**.

| v3 # | Old # | Slide | Action |
|---|---|---|---|
| 1 | 1 | Title | keep; full `.hero-bg` |
| 2 | 2 | About me + map | rewrite bio order: lead with Veezoo and AI analytics, Tableau becomes "13 years of dashboards before that". Reorder skill chips accordingly. |
| 3 | 3 | Video, Rosling | keep (the hook) |
| 4 | 4 | Agenda | rewrite to match the deck (3.1) |
| 5 | 5 | What you will learn | rewrite learning 3 (3.1) |
| 6 | 6 | Part 1 divider | keep copy; convert to `.hero-bg` divider |
| 7–10 | 7–10 | Minard, Nightingale, Snow, Hamburg | keep |
| 11 | 11 | Visual encoding | rewrite: it repeats the bullets of 7–10. Turn it into the lesson: four encodings (position, length/area, colour, small multiples), each with "used by" and "why it worked", pointing forward to Part 2. |
| 12 | 12 | Part 2 divider | rewrite: give it a title like Part 1 ("Part 2 · How we see data") and the shared `.hero-bg` divider class instead of private `#slide-12` CSS. |
| 13–16 | 13–16 | Anscombe, Datasaurus | keep. Button text "Show the dinosaur" instead of the 🦕 emoji. Add one lead sentence on 16: "Anything that only sees the table sees thirteen identical datasets. So do you, until you plot them." (bridge to Part 3) |
| 17 | 17 | Car sales challenge | rewrite the three approach cards as a bridge: Manual / Ask an AI / Chart. Fix the AI example question so it matches the slide question. New AI badge: "Right on 36 rows. Hold that thought for Part 3." Remove the 📋 📈 🤖 emoji. |
| 18–21 | 18–21 | Pre-attentive block incl. toolkit | keep (Lennart: 21 stays). Remove 👁️ emoji on 18 if present. |
| 22 | 22 | Video, The art of data visualization | keep |
| 23 | 23 | Video, The beauty of data visualization | keep |
| 24 | new | **Part 3 divider** | new `.hero-bg` divider: eyebrow "Part 3", title "Asking an AI", lead "Plain language is the new interface to data. The question is whether you can trust the answer." |
| 25 | 25+26 | **Just ask** | merge the two icon-card slides into one: left "The promise" (Just ask · Instant answers · No learning curve), right "The catch" (Sounds right · You've caught it making things up · Blind trust?). Use `.icon-card` from main. Lead: "Everyone has pasted a spreadsheet into a chatbot. It worked. So why not point it at the company's data?" This is the question 26–28 answer. |
| 26 | new | **Demo vs reality** | section 2 |
| 27 | new | **What is a customer?** | section 2 |
| 28 | new | **Vendor voices** | section 2 |
| 29 | 24 | Survey QR | **move** here, right before the demo it feeds. Rewrite copy: "Our World in Data needs your data" is a leftover; the demo uses Gapminder and World Bank. Make it "Before the demo: three questions about the world" and confirm the QR points at the current survey. |
| 30 | 27 | Live demo divider | keep; convert to `.hero-bg`. No product mention. Add the demo URL as `href` per CLAUDE.md. Optional: a toggle revealing three screenshots of expected answers as an offline fallback. |
| 31 | 28 | Analytics workflow | keep the cycle (Lennart). Replace the emoji in the SVG circles with stroke icons, fix the title wrap ("…but you own each one" currently breaks onto a lonely second line), re-caption: "AI can run Get data, Explore and Insight for you. Question and Act stay yours. Checking the definition is what lets you skip re-checking the middle." |
| cut | 29 | Design process squiggle | **cut**. "We genuinely trust humans more than machines" contradicts the talk, and the trust point is now made on 27. |
| 32 | 30 | Part 4 divider | rewrite the eyebrow to "Part 4 · Visual best practices" (currently labelled "How to tell a data story", which it is not). Convert `.bp-opener` to the shared `.hero-bg` divider. |
| 33–37 | 31–35 | Best practices 1–5 | keep. Density: shrink per-rule source lines to `--text-3` 14px or hide behind a "Sources" toggle. Add the missing Don't/Do tags on example 0 of the chart-choice slide and example 3 of the audience slide. Check the "Lee et al. 2026" citation. Change "45 studies" on the divider to the real count (about 31 distinct papers) or to "the research". |
| 38 | 36 | Hands-on | rewrite step 2 ("check"): "Open the explanation behind the number. Does the definition match what you meant? Then ask something the system cannot know, and watch what it does." Show the access URL or a QR, not just "arrives by email". |
| 39 | 37 | What you learned | rewrite card 3 to the new learning 3 (3.1). |
| 40 | 38 | Explore further | keep Gapminder and World Bank; **drop the Veezoo card**. |
| 41 | 39 | Thank you | keep; full `.hero-bg` |

Net: 39 → 41 slides.

### 3.1 Agenda and learnings rewrite

Agenda (slide 4), four cards:

1. **A beautiful science.** Four charts from the 1800s that answered hard questions. (Part 1)
2. **How we see data.** Anscombe, the Datasaurus, and what your eyes notice before you think. (Part 2)
3. **Asking an AI.** Why the chatbot that nails your spreadsheet fails on company data, and the one question that protects you. Live demo. (Part 3)
4. **Showing it right.** 25 research-backed rules for charts people actually understand, then your turn. (Part 4 + hands-on)

Learnings (slide 5, mirrored on 39):

1. The chart is the analysis: the same numbers tell different stories, and a picture is often the fastest reliable path to the answer.
2. Perception has rules: position beats colour, outliers pop in 250 milliseconds, and the reader's task picks the chart.
3. **An AI's answer is only as good as the definitions behind the data.** Before you trust a number, ask for the definition behind it. If it cannot show one, it guessed.

### 3.2 Dividers

Four parts, four identical dividers (`.hero-bg` + `.hero-layers`, eyebrow "Part N", `font-hero` title, one lead sentence), plus title, live-demo and thank-you heroes. Today each part opens differently. Making them identical is the cheapest coherency win.

---

## 4. Further improvement proposals

**A. Offline fallback.** The deck needs the network for D3, fonts, Wikimedia images and three YouTube embeds. Screenshots of the demo answers behind a toggle on slide 30, and a poster image per video with click-to-load.

**B. "Everyone is converging" timeline.** If slide 28 works, a compact grey-text timeline (dbt Semantic Layer 2022 → Snowflake 2024 → Databricks Metric Views 2025 → Databricks "Ontology" 2026) could sit under the quotes. Only if it does not crowd the slide.

**C. Copy sweep.** Apply the CLAUDE.md rules across the deck: sentence case titles (currently Title Case everywhere), no emoji in UI text (🦕 📋 📈 👁️ 🤖 📱 and the five in the workflow SVG), restructure sentences instead of em-dashes. Do this in the restyle pass.

**D. Dead code.** Remove unused CSS (`.text-slide`, `.workflow-*`, `#slide-37 .summary-*`, `#slide-38 .link-*`, `.qr-label`, `.thanks-eyebrow`, `.slide-label`), the `.tableauPlaceholder` branch in `navigation.js`, and the unused `assets/images/tableau-*.png`.

---

## 5. Restyle plan: port the Veezoo brand system from `main`

Everything needed exists on `main` and in `Research/brand/`:

- `Research/brand/veezoo-brand-doc.md`: canonical brand doc (from `veezoo-ai/website/.claude/skills/brand-doc/SKILL.md`).
- `Research/brand/veezoo-brand-css.md`: drop-in CSS for standalone HTML pages.
- `Research/brand/hero-background-reference.html`: static reproduction of the website hero (mesh, blobs, glass panels, grid, grain).
- `Research/brand/grain.png`: grain texture tile (160×160, tile at 80px).
- `CLAUDE.md` (now on this branch): documents how the tokens are used in this deck.

- `git show main:css/styles.css`, `git show main:index.html`, `git show main:assets/images/veezoo-mark.svg`, `git show main:js/navigation.js`.

### 5.1 Tokens: old → new

| This branch | Brand (main) | Note |
|---|---|---|
| `--accent #00d4e0` | `--accent #00b4d8` | brand cyan |
| `--accent2 #0ea5e9` | `--accent-light #48cae4` | |
| `--accent-dark #00a8b5` | `--accent-dark #0096c7` | |
| (none) | `--accent-soft rgba(0,180,216,.10)` | icon tiles, active pills |
| `--surface #f5f7fa`, `--surface2 #edf0f5` | `--bg-2 #f9fafb`, `--bg-3 #f3f4f6` | |
| `--border #e2e6ed` | `--border #e5e7eb`, `--border-2 #d1d5db` | |
| `--text-muted #6b7280` | `--text-2 #6b7280`, `--text-3 #9ca3af` | add third ink |
| `--font 'Inter'` | `--font-body` Inter, `--font-display` DM Sans, `--font-hero` Outfit | Google Fonts `<link>` in `<head>`, remove the CSS `@import` |
| `--radius 12px`, `--radius-lg 20px` | `--radius 16px`, `--radius-sm 12px`, `--pill 9999px` | |
| `--shadow`, `--shadow-lg` | `--shadow-sm/md/lg/xl`, `--shadow-callout`, `--shadow-accent` | |
| `--red #ef4444`, `--green #22c55e`, `--orange #f97316` | `--red #ef4444`, `--red-dark #b91c1c`, `--green #16a34a`, `--amber #f59e0b`, `--violet #7c3aed`, `--teal #0fbdb2` | |
| (none) | `--series-1 #00b4d8`, `--series-2 #7c3aed`, `--series-3 #f59e0b`, `--grid-line #e5e7eb`, `--mark-neutral #d1d5db`, `--mark-dim #e5e7eb` | chart palette; `charts.js` hardcodes `#00d4e0 #0ea5e9 #22c55e` today |
| `html, body` letterbox `#1a1a2e` | `#111827` | neutral dark outside the canvas; brand is never dark on-slide |

### 5.2 Steps, in the order that keeps the deck working at every commit

1. **Port tokens additively.** Paste main's `:root` into `styles.css`, add temporary aliases so nothing breaks: `--accent2: var(--accent-light); --surface: var(--bg-2); --surface2: var(--bg-3); --text-muted: var(--text-2); --font: var(--font-body); --shadow: var(--shadow-md); --radius-lg: var(--radius);`. Swap the `@import` for the three-family Google Fonts `<link>` from `CLAUDE-from-main.md`. Commit: "Styles: port Veezoo brand tokens and fonts from main".
2. **Port backgrounds and components.** Copy from main's `styles.css`: `.mesh-bg`, `.hero-bg`, `.hero-layers` (+ `::before`/`::after`), `#brand-mark`, `.eyebrow`, `.section-title`, `.text-gradient`, `.slide-head`, `.card`, `.icon-card`, `.callout`, `.btn`, `.btn-outline`, `.toggle-btn`, `.chip`, `.table-frame`, `.data-table`. Add `assets/images/veezoo-mark.svg` and the `<div id="brand-mark">` markup from main's `index.html` (bottom-left on every slide except title and video slides; `.slide-center` reserves bottom padding). Drop the 8px `.slide-header` cyan bar as main did. Commit: "Styles: port hero/mesh backgrounds and brand components".
3. **Build section 3 and the new slides of section 2 with the new components.** Commit per slide or block, e.g. "Slides 26–28: add the asking-an-AI block".
4. **Sweep the old slides.** Replace inline-styled sections (old 25, 26, 37, 38) with `.card` / `.icon-card` grids; convert all dividers to `.hero-bg`; replace hardcoded hexes in inline SVGs (`#00d4e0`, `#4b5563`, `#f0feff`, `#f0f6ff`, `#dc2626`, `#16a34a`, `#d97706`, `#fee2e2`, `#dcfce7`, `#fef3c7`) with tokens; point `charts.js` and the best-practice SVGs at `--series-*` and `--red`; apply the copy rules. Remove the step-1 aliases once grep finds no users. Commit: "Restyle remaining slides in the Veezoo brand".
5. **Port the deep-link fix** from main's `navigation.js` (the `setTimeout(..., 0)` re-dispatch of `slidechange` after DOMContentLoaded, lines 26–32 on main). Without it, opening `#slide-13` to `#slide-20` or `#slide-26` directly renders empty charts.
6. **Bring `CLAUDE.md` onto the branch** from `Research/brand/CLAUDE-from-main.md`; update the structure table to v3 (41 slides), add `js/semantics.js` and `data/ai-accuracy.json`, and the pre-talk checklist (demo URL on slide 30, survey QR on slide 29, verify the Snowflake quote on slide 28).

### 5.3 Brand rules the new slides must respect

From `veezoo-brand-doc.md`: light backgrounds only, dark text; `.hero-bg` is the signature (mesh + three large asymmetric blobs + glass stripes + blueprint grid + grain), never small symmetric blobs; cards white with 1px `--border`, 16px radius, `--shadow-sm`; eyebrows uppercase, `--accent-dark`, letter-spacing 0.14em; headlines DM Sans semibold with tight tracking, hero titles Outfit; one accent word per title in `.text-gradient`; stroke icons 18–24px in a 48px `--accent-soft` tile; no em-dashes, no exclamation marks, sentence case for buttons; chart text in ink colours, series identity carried by a coloured marker; cyan vs `--red` for the correct / silently-wrong contrast on slide 26.

---

## 6. Renumbering checklist for the implementer

- **HTML:** `<!-- ── SLIDE N -->` banners and `id="slide-N"` for everything from old 24 onward, per section 3. Inline `style=` attributes on old 25, 26, 37, 38 go away when they move to component classes.
- **CSS id selectors:** `#slide-24` → `#slide-29` (QR), `#slide-28` → `#slide-31` (workflow), `#slide-29` removed, `#slide-37/38/39` → `#slide-39/40/41`. Fix stale CSS comments while there ("Slide 3: Agenda" is `#slide-4`, "slides 29–34" are now 33–37, etc.).
- **JS:** no number changes. Add `js/semantics.js` for slide 26 and the count-up on 27. Fix stale header comments in `anscombe.js`, `datasaurus.js`, `charts.js`, `numbers.js`, `bestpractices.js`.
- **`#slide-counter`** initial text "1 / 39" → "1 / 41".
- **`CLAUDE.md`** structure table.
- Commit messages reference slides by new number, e.g. "Slide 27: add the what-is-a-customer card".

---

## 7. Source register and verification status

On-slide numbers are limited to the five accuracy bars (26), the EntSQL line (27) and the three quotes (28). Everything else lives in speaker notes or footers. Use only rows marked **verified** or **in corpus** without further checking.

| Claim | Number | Source | Status |
|---|---|---|---|
| "Correct vs silently wrong" bars | 92/79/70/63/59% correct | own chart 2026-08-07, `competition-slides/sources/viz_executable-plausible-incorrect_2026-08-07.md` | own work; method is best configuration per study |
| Schema and semantic errors dominate | >80% of execution failures | Shen et al. 2025 via Cube §2.1, arXiv:2604.25149 | secondary, verify |
| Wrong-but-executable dominates | qualitative | NL2SQLBench 2026, arXiv:2604.16493 | in corpus |
| EntSQL | 96% need external knowledge; best 15.9%; humans 84% | arXiv:2606.03363 | in corpus (`academic-papers/output/fulltext/arxiv_2606.03363.md`) |
| Model choice vs definitions (speaker note) | three models within ~5 pp; +17 to +23 pp with a 4 KB definitions doc | Cube Table 1, §5.2 | in corpus; vendor paper with LLM judge |
| data.world ontology (footer only) | 16.7% → 54.2% | Sequeda et al. 2023, arXiv:2311.07509 | cited in Cube; verify primary |
| Databricks quote | verbatim | Genie Ontology launch blog, Aug 2026 | in `competition-slides/databricks-genie-2026-09.md`; **verify wording against the blog** |
| Snowflake GPT-4o | 90%+ vs 51% | Snowflake engineering blog 2024 | quoted in competition folder; **find URL, verify exact sentence** |
| AT&T quote | verbatim | arXiv:2505.19988 p.12 | in corpus |
| Country counts on slide 27 | 193 UN members / 195 with observers / 206 NOCs / 249 ISO codes / 217 World Bank economies | UN, IOC, ISO 3166-1, World Bank | public facts; re-check before the talk (NOC count changes rarely) |
| "40–55% on realistic enterprise schemas" | | sales-toolkit Marcos file | **unsourced, do not use** |
| Snowflake 47/83/23 context-layer figures | | buyer's guide in material index | **no primary URL, do not use** |

---

## 8. Decisions (all open questions resolved, 2026-10-04)

- **Format: a 3-hour session**, not a conference talk. Nothing needs cutting; all 41 slides are built, including 28. Implication for the implementer: the deck is a workshop spine, so the live demo (30) and hands-on (38) slides should be self-explanatory enough to stay on screen for 20 to 40 minutes each (large type, the task visible at a glance, access URL or QR on 38). Consider a small "Break" hero slide the speaker can jump to (`#slide-break`, outside the numbered flow, reachable by a key such as `b`); optional.
- **Letterbox** behind the canvas: `#111827`.
- **Slide 27 example:** real country counts (section 2), not invented customer numbers.
- Earlier: Veezoo as employer only; both videos stay; slides 21 and 31 stay; demo happy-path, hands-on carries the refusal moment; anecdote not used; brand ported from `main` by hand.

The proposal is ready for implementation in the order of section 5.2.
