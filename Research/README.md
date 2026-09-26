# Research – How to communicate with data

Candidate literature for the deck: empirical studies that quantify how people perceive, remember and act on data visualizations.

- **paper-picker.html** – open in a browser. Filter by topic, venue, era and audience, tick papers, then use "Export picks" (Markdown in weekly-papers `favorites.md` format, CSV, or an ID list).
- **papers.json** – the same 115 entries as raw data.

## Scope (as agreed 2026-09-26)
- Core: 2016–2026, IEEE VIS/TVCG, ACM CHI, EuroVis/CGF, plus a few psychology journals. Classics before 2016 are tagged separately.
- Mostly empirical work (crowdsourced, lab and eye-tracking studies), plus a few reviews for orientation.
- Audiences: general public and business decision makers.

## Verification
- All titles, years, venues and DOIs were resolved via OpenAlex, Crossref or Semantic Scholar.
- `basis: abstract` means the finding paraphrases the paper's abstract. `basis: memory` (6 papers) means the finding comes from prior knowledge and must be checked before citing.
- Possible next step: download the picks and summarize them with the weekly-papers pipeline (fetch → summarize → push to Capacities).
