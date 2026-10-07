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

Coverage per indicator (last year with observed data): population, life expectancy, child mortality, children per woman and daily income run to 2100 with projections; CO2 per capita ends 2022; vaccination ends 2020; girls' primary completion is sparse and ends 2023. The World Bank publishes observed values to 2024 (2025 for population) for comparable indicators, so a refresh is possible if newer observed years matter for the demo.

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

- Regenerate `assets/images/qr-code.png` if the form link changed (slide 31 shows `forms.gle/v77nsv62g1EzY73G9`).
- Open slide 31 once before the audience arrives: the status line must say *Live · updated …*, not *Sheet not readable yet*.
- Keep the Veezoo workspace open in another tab; the live demo (slide 32) runs there.
- Open the deck with the right track: `index.html?track=veezoo` (hands-on in Veezoo) or `index.html?track=tableau` (hands-on in Tableau with another instructor).
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
