/**
 * Google Form -> BigQuery, one streaming insert per submission.
 *
 * Setup (once, in the response Google Sheet, logged in as the @veezoo.com account):
 *   1. Extensions > Apps Script, paste this file as Code.gs.
 *   2. Left sidebar "Services" (+): add "BigQuery API" (identifier BigQuery).
 *   3. Run `setupTrigger` once from the editor, accept the OAuth consent
 *      (Sheets + BigQuery scopes). This installs the on-form-submit trigger.
 *   4. Submit a test response in the form; check `survey_responses` in BigQuery.
 *   5. Run `backfillFromSheet` once to load the rows copied over from the old survey
 *      (safe to re-run: existing response_ids are skipped).
 *
 * The account needs the role BigQuery Data Editor on dataset demos-467314.gapminder_test.
 * No secrets live in this file; the script runs with the account's own OAuth grant.
 */

const PROJECT_ID = 'demos-467314';
const DATASET_ID = 'gapminder_test';
const TABLE_ID = 'survey_responses';

// Column order of the response sheet: timestamp, then the 13 questions in form order.
const QUESTION_KEYS = [
  'q01_girls_primary_school',
  'q02_population_income_level',
  'q03_extreme_poverty_trend',
  'q04_life_expectancy',
  'q05_children_2100',
  'q06_population_growth_reason',
  'q07_disaster_deaths_trend',
  'q08_population_by_continent',
  'q09_vaccinated_children',
  'q10_women_years_in_school',
  'q11_endangered_species',
  'q12_electricity_access',
  'q13_climate_trend'
];

/** Installs the on-form-submit trigger on this spreadsheet (run once). */
function setupTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const exists = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'onFormSubmitToBigQuery');
  if (!exists) {
    ScriptApp.newTrigger('onFormSubmitToBigQuery').forSpreadsheet(ss).onFormSubmit().create();
  }
  Logger.log('Trigger installed. Project %s, dataset %s, table %s', PROJECT_ID, DATASET_ID, TABLE_ID);
}

/** Trigger handler: e.values = [timestamp, answer 1, ..., answer 13]. */
function onFormSubmitToBigQuery(e) {
  const values = e.values;
  const submitted = parseSheetTimestamp_(values[0]);
  const row = buildRow_(values, submitted, 'apps_script', e.range ? e.range.getRow() : null);
  insertRows_([row]);
}

/** One-off: push every existing sheet row that is not yet in BigQuery. */
function backfillFromSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const existing = existingResponseIds_();
  const rows = [];
  for (let i = 1; i < data.length; i++) {            // skip header
    const values = data[i];
    if (!values[0]) continue;                          // empty line
    const submitted = values[0] instanceof Date ? values[0] : parseSheetTimestamp_(values[0]);
    const row = buildRow_(values, submitted, 'backfill', i + 1);
    if (existing.has(row.json.response_id)) continue;
    rows.push(row);
  }
  if (rows.length) insertRows_(rows);
  Logger.log('Backfill: %s rows inserted, %s already present', rows.length, existing.size);
}

// ── helpers ─────────────────────────────────────────────────────────────────

function buildRow_(values, submitted, source, sheetRow) {
  const id = source === 'apps_script'
    ? Utilities.getUuid()
    : 'backfill-' + Utilities.formatDate(submitted, 'UTC', "yyyyMMdd'T'HHmmss") + '-' + sheetRow;
  const json = {
    response_id: id,
    submitted_at: submitted.toISOString(),
    session_date: Utilities.formatDate(submitted, 'Europe/Zurich', 'yyyy-MM-dd'),
    source: source
  };
  QUESTION_KEYS.forEach((key, i) => {
    const v = values[i + 1];
    json[key] = v === undefined || v === null || v === '' ? null : String(v).trim();
  });
  return { insertId: id, json: json };
}

function insertRows_(rows) {
  const resp = BigQuery.Tabledata.insertAll({ rows: rows, skipInvalidRows: false, ignoreUnknownValues: false },
    PROJECT_ID, DATASET_ID, TABLE_ID);
  if (resp.insertErrors && resp.insertErrors.length) {
    throw new Error('BigQuery insert errors: ' + JSON.stringify(resp.insertErrors));
  }
}

function existingResponseIds_() {
  const q = `SELECT response_id FROM \`${PROJECT_ID}.${DATASET_ID}.${TABLE_ID}\` WHERE source = 'backfill'`;
  const res = BigQuery.Jobs.query({ query: q, useLegacySql: false }, PROJECT_ID);
  const ids = new Set();
  (res.rows || []).forEach(r => ids.add(r.f[0].v));
  return ids;
}

/** Sheet timestamps arrive as Date objects in triggers; strings in some locales. */
function parseSheetTimestamp_(v) {
  if (v instanceof Date) return v;
  const d = new Date(v);
  if (!isNaN(d)) return d;
  // German sheet locale: "05.10.2026 14:03:21"
  const m = String(v).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], +m[4] - 2, +m[5], +m[6]));
  return new Date();
}
