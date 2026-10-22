# Live demo pipeline: Google Form → BigQuery → Veezoo

The audience answers the 13 Gapminder questions on their phones (slide 31). Every
submission lands in BigQuery within seconds, Veezoo answers questions about the room's
answers, and slide 31 shows the answers arriving live. Nothing is hosted outside Google:
the form writes a Google Sheet, an Apps Script on that sheet streams each row to
BigQuery under Lennart's @veezoo.com account, and the deck reads the shared sheet.

```
Form (forms.gle/v77nsv62g1EzY73G9)
  └─ response sheet 1_xMRD0uRkYt_HaGlDXuvAQ6KM_t2LRzJ_aPZhNlLitI
       ├─ Apps Script (survey-to-bigquery.gs) ──► demos-467314.gapminder_test.survey_responses ──► view survey_answers ──► Veezoo
       └─ shared "anyone with the link" ───────► js/survey.js on slide 31 (live counter, correct share per question, random-guess line)
```

## The data behind the answers: `gapminder_data`

`demos-467314.gapminder_test.gapminder_data` holds the Gapminder country indicators that answer the 13 questions: 273 countries and territories, years 1800 to 2100 (rows after 2024 are Gapminder projections, flagged `is_projection`), 82,173 rows. Copied on 2026-10-07 from Snowflake `GAPMINDER.PUBLIC.DATA` (account be95772.eu-central-2, key-pair login as `heucken`), decimal commas converted to numbers, 698 empty rows dropped. Columns: `population`, `life_expectancy`, `child_mortality_per_1000`, `children_per_woman`, `daily_income_per_person`, `co2_emission_per_capita`, `vaccinated_1year_olds_pct`, `girls_primary_completion_pct`, plus the Gapminder groupings `income_3groups`, `world_4region`, `world_6region`, `west_and_rest`, `unhcr_region`.

Coverage per indicator: life expectancy, child mortality, children per woman and daily income are Gapminder throughout (observed to about 2024, projected to 2100, `is_projection` true after 2024); population likewise, with the 2025 value replaced by the World Bank's observed figure; CO2 per capita was Gapminder to 2022 and is filled from the World Bank for 2023 and 2024; girls' primary completion is sparse in Gapminder and filled from the World Bank where missing (latest 2025); vaccination ends 2020 and has no World Bank equivalent. Filled cells carry `source = 'gapminder+worldbank'`. World Bank values for CO2 and population were scaled to Gapminder's level in the last common year per country, so the series do not jump at the seam (the raw sources differ by about 20 percent for CO2 because of different estimation methods). Gapminder's own 2023 and 2024 values were deliberately not overwritten.

## World Bank aggregates: `worldbank_aggregates` (added 2026-10-22)

Veezoo's Gapminder knowledge graph (`internaldemo.app.veezoo.com`, id `gapminder`) answers the
survey questions Lennart usually picks (1 girls finishing primary school, 4 world life expectancy,
9 vaccinated one-year-olds) from this table, not from the per-country rows: a plain average over
countries weights Tuvalu like China (world life expectancy 73.0 unweighted vs 73.5 official).
`demos-467314.gapminder_test.worldbank_aggregates` holds the World Bank's own population-weighted
figures for World, the income groups (low, lower middle, upper middle, middle, high) and seven
regions, 1990 to 2025, loaded from api.worldbank.org: population, life expectancy, measles and
DPT immunization of one-year-olds, girls' and overall primary completion, child mortality, children
per woman, extreme poverty (below 3.00 USD a day, 2021 prices), access to electricity, expected
years of school for girls (ends 2019). The API returns the income groups twice (country codes
LIC/HIC/LMC/UMC and income-level codes XM/XD/XN/XT, the latter carrying the completion rates);
the loader folds them into one row per group and year.

In Veezoo the table is the class **World Bank Figure** (`Worldbank_Aggregates`, file in
`gapminder-vkl/`): nested class Group (World by default via `default_filter`, name a group to
change it), Year, and the indicators as numbers with units, descriptions and synonyms. The
per-country class was renamed **Country Figure** with a description that points world and group
questions to World Bank Figure; its daily income is a number now (it was a class with 2,624
entities) and the raw column labels (World 4region, Income 3groups) have readable names.

Checked in the chat on 2026-10-22, each answered from World Bank Figure without naming it:

| Survey question | Question as asked | Answer |
|---|---|---|
| 1 | How many girls finish primary school in low-income countries? | 61 % (2023), up from 33 % in 1990 |
| 4 | What is the life expectancy of the world today? | 73.5 years (2024), regions as context |
| 9 | How many of the world's one-year-old children are vaccinated? | 84 % (2024, measles) |

Also answerable now: 2 (population by income group, Country Figure), 3 (extreme poverty worldwide:
30 % in 2004, 10 % in 2024), 8 (population by continent), 12 (access to electricity, 92 % in 2024).
Not in the data: 5 (children in 2100, only total population), 6, 7, 10 (only expected years of
school), 11, 13. The internal demo instance took about a minute per answer on 2026-10-22; ask the
first question before the audience looks at the screen.

## Files

- `bigquery-survey.sql`: dataset `gapminder_test` (EU) in project `demos-467314`, tables `survey_questions` (13 questions with correct answers) and `survey_responses` (one row per submission, partitioned by `session_date`), view `survey_answers` (one row per response and question with `is_correct`). Applied on 2026-10-05; re-running is safe (the responses table is `CREATE IF NOT EXISTS`).
- `survey-to-bigquery.gs`: the Apps Script. Streaming insert per submission, plus `backfillFromSheet` as a repair tool.
- `../js/survey.js`: the live panel on slide 31. Reads the sheet's gviz CSV endpoint every 5 seconds, no credentials.

## One-time setup (Lennart, about 15 minutes)

1. **Share the response sheet** "Anyone with the link: Viewer". Needed for the live panel only; the Apps Script does not need it.
2. **Rights:** the @veezoo.com account needs *BigQuery Data Editor* on `demos-467314.gapminder_test` (or on the project). Ask whoever administers `demos-467314`.
3. **Apps Script:** done on 2026-10-06. Open the response sheet, Extensions → Apps Script; `Code.gs` holds `survey-to-bigquery.gs`, `appsscript.json` enables the BigQuery advanced service (the Services "+" dialog did nothing, the manifest did the job), the on-form-submit trigger is installed. If `Code.gs` is updated, paste the new file and save; no deploy step is needed, triggers run the saved code. After adding a scope, run `setupTrigger` once more so the consent screen can grant it; triggers cannot ask for consent themselves.
4. **Test:** done on 2026-10-06, a submission arrived in BigQuery within seconds as `source = 'apps_script'`. To re-check, use `SELECT source, COUNT(*) FROM gapminder_test.survey_responses GROUP BY 1` (a plain `COUNT(*)` can come back from BigQuery's result cache).
5. **Backfill:** already done on 2026-10-05 with the service account: the 184 answers copied from the old survey are in `survey_responses` with `source = 'backfill'` and their original `session_date`s (13 sessions from 2024-10-07 to 2026-04-02), so they stay out of "today" by default. `backfillFromSheet` in the script is the repair tool for rows the trigger missed (for example while a service was not enabled); it compares submission times and inserts only what is missing.
6. **Veezoo:** connect `demos-467314.gapminder_test`. Model `survey_answers` as concept *Answer* (dimensions Question = `question_short`, Session = `session_date`, Chosen option = `chosen_answer`; flag Correct = `is_correct`; measure Hit rate = share of correct) and `survey_questions` as *Question*. Add the option texts as synonyms. Default filter: `session_date = today`.
7. **Cache check:** submit an answer, ask Veezoo "how many answers today", submit another, ask again. If the number does not move, find out how long Veezoo caches query results and plan the demo around it.

## Before every session

Block two hours on the morning of the session (first done 2026-10-30) and go through all four parts.

**Deck**
- Open the public deck with the right track, `?track=veezoo` (hands-on in Veezoo) or `?track=tableau` (hands-on in Tableau with another instructor), and hard-reload (Cmd+Shift+R) so no cached scripts linger. The counter says 44 (43 in the Tableau track).
- Slide 31: the status line must say *Live · updated …*, not *Sheet not readable yet*. Submit one answer from the phone and watch the counter move. Regenerate `assets/images/qr-code.png` if the form link changed (it shows `forms.gle/v77nsv62g1EzY73G9`).
- Slide 41 (Veezoo track): the access details are the real ones, not "arrive by email".
- Click through once with the arrow keys; the videos on slides 3, 24 and 25 load.

**Demo, run it once end to end** (Veezoo track; see `global-bike/README.md` for the story)
- Rebuild the data if it was not built for this date: `python3 demo/global-bike/build_global_bike.py <day before the session>`. "Last month" must return data.
- Ask the opening sequence (bikes assembled vs sold per month, scatter, red above 1 %) and the starting question "Revenue vs budget revenue by sales organization, January to October 2026". US West must stand out.
- Drill the root cause once yourself (region year over year, dealers in US West, SoCal per month against last year) and check the saved agent's back-test still fires.

**Hands-on material**
- Open the "read me first" canvas as a student: text readable, widgets load, the copy-paste questions work.
- Log in with one student account in a private window and ask one question.
- The board with the saved charts and the one "management rework" example slide are ready.

**Room and tabs**
- Tabs: deck, Global Bike chat, board, explainer canvas, Studio, student view in a private window. The live demo (slide 32) runs in the Veezoo tab.
- Charger, HDMI adapter, phone with the survey QR tested on the venue Wi-Fi, repo copy of the knowledge graph in `demo/global-bike/vkl/` in case a class file needs restoring.
- Column order assumption: the sheet has the timestamp in column A and the 13 answers in form order in columns B to N. Both the Apps Script and `js/survey.js` rely on that order, not on header texts. If the form is ever reordered, update `QUESTION_KEYS` in the script and `QUESTIONS` in `js/survey.js`.

## Demo script for slide 31

1. Audience scans, answers arrive, the counter climbs. The per-question bars and the overall hit rate stay hidden behind "Show the results" so nobody sees the room being wrong while still answering.
2. "Show the results": bars fill with the share of correct answers per question, and the overall hit rate ("32 % of all answers correct") sits next to the counter the whole time.
3. "Compare with guessing": a line marks 33 percent (one right answer in three options) on every bar, bars at or below it turn red, and the overall number turns red if the room is at or below random guessing. Most rooms do worse than guessing on most questions. That is the Gapminder point, and the bridge to the demo: "Let's see what the world actually looks like."
4. "All sessions" switches from today's answers to every answer ever collected (184 from 13 earlier sessions) in case the room is small.

Whether the room's answers are also analysed in Veezoo is optional; slide 31 carries the point on its own. The BigQuery pipeline stays in place for the case that it is.

## Known limits

- Streaming inserts cannot be deleted for about 90 minutes. Do not try to truncate the table before a session; filter by `session_date` instead.
- The gviz CSV endpoint is cached by Google for a few seconds at most, but a sheet shared with the link is readable by anyone with the link. The answers are anonymous, so this is acceptable; do not add free-text or name fields to the form.
- The live panel counts "today" in the browser's local time; the Apps Script writes `session_date` in Europe/Zurich time. For a session in another time zone, adjust both.
