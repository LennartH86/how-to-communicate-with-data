# Live demo pipeline: Google Form → BigQuery → Veezoo

The audience answers the 13 Gapminder questions on their phones (slide 30). Every
submission lands in BigQuery within seconds, Veezoo answers questions about the room's
answers, and slide 30 shows the answers arriving live. Nothing is hosted outside Google:
the form writes a Google Sheet, an Apps Script on that sheet streams each row to
BigQuery under Lennart's @veezoo.com account, and the deck reads the shared sheet.

```
Form (forms.gle/v77nsv62g1EzY73G9)
  └─ response sheet 1_xMRD0uRkYt_HaGlDXuvAQ6KM_t2LRzJ_aPZhNlLitI
       ├─ Apps Script (survey-to-bigquery.gs) ──► demos-467314.gapminder_test.survey_responses ──► view survey_answers ──► Veezoo
       └─ shared "anyone with the link" ───────► js/survey.js on slide 30 (live counter, correct share per question)
```

## Files

- `bigquery-survey.sql`: dataset `gapminder_test` (EU) in project `demos-467314`, tables `survey_questions` (13 questions with correct answers) and `survey_responses` (one row per submission, partitioned by `session_date`), view `survey_answers` (one row per response and question with `is_correct`). Applied on 2026-10-05; re-running is safe (the responses table is `CREATE IF NOT EXISTS`).
- `survey-to-bigquery.gs`: the Apps Script. Streaming insert per submission, plus `backfillFromSheet` as a repair tool.
- `../js/survey.js`: the live panel on slide 30. Reads the sheet's gviz CSV endpoint every 5 seconds, no credentials.

## One-time setup (Lennart, about 15 minutes)

1. **Share the response sheet** "Anyone with the link: Viewer". Needed for the live panel only; the Apps Script does not need it.
2. **Rights:** the @veezoo.com account needs *BigQuery Data Editor* on `demos-467314.gapminder_test` (or on the project). Ask whoever administers `demos-467314`.
3. **Apps Script:** open the response sheet, Extensions → Apps Script, paste `survey-to-bigquery.gs` as `Code.gs`. Services (+) → add *BigQuery API*. Run `setupTrigger` once and accept the consent screen. If the consent screen refuses, the Workspace admin has to allow Apps Script to use the BigQuery API for the org.
4. **Test:** submit one answer in the form, then in BigQuery `SELECT * FROM gapminder_test.survey_responses ORDER BY submitted_at DESC LIMIT 5`. The row should be there within seconds, `source = 'apps_script'`.
5. **Backfill:** already done on 2026-10-05 with the service account: the 184 answers copied from the old survey are in `survey_responses` with `source = 'backfill'` and their original `session_date`s (13 sessions from 2024-10-07 to 2026-04-02), so they stay out of "today" by default. `backfillFromSheet` in the script exists only in case the sheet gets rows that the trigger missed; it skips rows already present.
6. **Veezoo:** connect `demos-467314.gapminder_test`. Model `survey_answers` as concept *Answer* (dimensions Question = `question_short`, Session = `session_date`, Chosen option = `chosen_answer`; flag Correct = `is_correct`; measure Hit rate = share of correct) and `survey_questions` as *Question*. Add the option texts as synonyms. Default filter: `session_date = today`.
7. **Cache check:** submit an answer, ask Veezoo "how many answers today", submit another, ask again. If the number does not move, find out how long Veezoo caches query results and plan the demo around it.

## Before every session

- Regenerate `assets/images/qr-code.png` if the form link changed (slide 30 shows `forms.gle/v77nsv62g1EzY73G9`).
- Open slide 30 once before the audience arrives: the status line must say *Live · updated …*, not *Sheet not readable yet*.
- Keep the Veezoo workspace open in another tab; the live demo (slide 31) runs there.
- Column order assumption: the sheet has the timestamp in column A and the 13 answers in form order in columns B to N. Both the Apps Script and `js/survey.js` rely on that order, not on header texts. If the form is ever reordered, update `QUESTION_KEYS` in the script and `QUESTIONS` in `js/survey.js`.

## Demo script for slide 30

1. Audience scans, answers arrive, the counter climbs.
2. Bars fill with the share of correct answers per question.
3. "Reveal the chimpanzee": a line at 33 percent appears on every bar, questions below it turn red. Most rooms lose to the chimpanzee on most questions. That is the Gapminder point, and the bridge to Veezoo: "Let's see what the world actually looks like."

## Known limits

- Streaming inserts cannot be deleted for about 90 minutes. Do not try to truncate the table before a session; filter by `session_date` instead.
- The gviz CSV endpoint is cached by Google for a few seconds at most, but a sheet shared with the link is readable by anyone with the link. The answers are anonymous, so this is acceptable; do not add free-text or name fields to the form.
- The live panel counts "today" in the browser's local time; the Apps Script writes `session_date` in Europe/Zurich time. For a session in another time zone, adjust both.
