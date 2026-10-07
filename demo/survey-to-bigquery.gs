/**
 * Google Form -> BigQuery, one streaming insert per submission.
 *
 * Setup (once, in the response Google Sheet, logged in as the @veezoo.com account):
 *   1. Extensions > Apps Script, paste this file as Code.gs.
 *   2. Left sidebar "Services" (+): add "BigQuery API" (identifier BigQuery).
 *   3. Run `setupTrigger` once from the editor, accept the OAuth consent
 *      (Sheets + BigQuery scopes). This installs the on-form-submit trigger.
 *   4. Submit a test response in the form; check `survey_responses` in BigQuery.
 *   5. If a submission ever fails (see Executions), run `backfillFromSheet`: it inserts
 *      every sheet row whose submission time is not yet in BigQuery.
 *
 * The account needs write access to dataset demos-467314.gapminder_test (project editors have it).
 * If a trigger run fails with "BigQuery is not defined", the BigQuery advanced service is missing:
 * Services (+) > BigQuery API, or add it to appsscript.json; then run setupTrigger again to re-consent.
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
  const row = buildRow_(values, submitted, 'apps_script');
  insertRows_([row]);
}

/** Repair tool: push every sheet row whose submission time is not yet in BigQuery. */
function backfillFromSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const existing = existingTimestamps_();
  const rows = [];
  for (let i = 1; i < data.length; i++) {            // skip header
    const values = data[i];
    if (!values[0]) continue;                          // empty line
    const submitted = values[0] instanceof Date ? values[0] : parseSheetTimestamp_(values[0]);
    if (existing.has(tsKey_(submitted))) continue;
    rows.push(buildRow_(values, submitted, 'backfill'));
  }
  if (rows.length) insertRows_(rows);
  Logger.log('Backfill: %s rows inserted, %s already present', rows.length, existing.size);
}

/** Manual test from the editor: inserts one marked test row and logs the result. */
function testInsert() {
  if (typeof BigQuery === 'undefined') {
    throw new Error('BigQuery service is not enabled: Services (+) > BigQuery API');
  }
  const now = new Date();
  const values = [now].concat(QUESTION_KEYS.map(() => 'test'));
  const row = buildRow_(values, now, 'apps_script_test');
  insertRows_([row]);
  Logger.log('Inserted test row %s into %s.%s.%s', row.json.response_id, PROJECT_ID, DATASET_ID, TABLE_ID);
}

// ── helpers ─────────────────────────────────────────────────────────────────

function buildRow_(values, submitted, source) {
  const id = source.startsWith('apps_script')
    ? Utilities.getUuid()
    : 'backfill-' + Utilities.formatDate(submitted, 'Europe/Zurich', "yyyyMMdd'T'HHmmss");
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

function tsKey_(d) { return Utilities.formatDate(d, 'Europe/Zurich', 'yyyy-MM-dd HH:mm:ss'); }

function existingTimestamps_() {
  const q = `SELECT FORMAT_TIMESTAMP('%Y-%m-%d %H:%M:%S', submitted_at, 'Europe/Zurich') AS ts FROM \`${PROJECT_ID}.${DATASET_ID}.${TABLE_ID}\``;
  const res = BigQuery.Jobs.query({ query: q, useLegacySql: false, maxResults: 10000 }, PROJECT_ID);
  const keys = new Set();
  (res.rows || []).forEach(r => keys.add(r.f[0].v));
  return keys;
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
