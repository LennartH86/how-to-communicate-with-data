# Global Bike: the hands-on dataset

BigQuery dataset `demos-467314.global_bike` (EU), built by `build_global_bike.py` from the SAP UCC
Global Bike sales data (2007 to 2016, 24 dealers, 29 products; the source file lives in the
git-ignored `hands-on/` folder). The build is deterministic; re-run the script to rebuild.

## What was done to the source

- **Shifted by 10 years** (2007–2016 → 2017–2026) so the story plays "now".
- **"Today" is 30 September 2026** (`AS_OF`). Actuals end there; October to December 2026 are
  open and covered by budget and forecast. Pin "today" to 2026-09-30 in the Veezoo knowledge
  graph so the demo looks identical on any real date.
- **Master data fixed:** encoding errors in two German dealer names, duplicate dealer rows
  removed, sales-org names spelled out (US East, US West, Germany North, Germany South).
- **Added from the story:** two plants (Dallas supplies US dealers, Heidelberg the German ones)
  with monthly assembly capacity; dealer size tier and "dealer since" year.
- **Added for management tracking:** monthly budget per sales org and category for 2025 and
  2026 (previous year × growth target; US West carries an ambitious +10 percent), and a rolling
  forecast as of 30 September for Q4 2026 (last year's months × this year's run rate).
- **Two planted signals for the agent exercise**, both in the months before "today":
  - *Peachtree Bikes (US East):* discount rate climbs from ~3 percent in April to ~9 percent in
    September 2026.
  - *SoCal Bikes (US West):* about 65 percent fewer orders in June to September 2026, in the middle of the season.

## Tables

| Table | Grain | Notes |
|---|---|---|
| `sales_order_lines` | order line | revenue, discount, cost in USD plus local currency; `net_revenue_usd`, `margin_usd` precomputed |
| `customers` | dealer | city, country, `sales_org`, `sales_org_name`, `dealer_size`, `dealer_since`, `plant_id` |
| `products` | product | category, division, `list_price_usd`, `unit_cost_usd`, `launch_year` |
| `plants` | plant | Dallas, Heidelberg |
| `sales_orgs` | sales org | the four sales organizations with `country`, one row each (key table for the Sales Organization class) |
| `product_categories` | category | the six categories with their division, one row each (key table for the Product Category class) |
| `plant_capacity` | plant × month | `capacity_units`, `overtime_capacity_units` (+18 %), `bikes_assembled` |
| `budget` | sales org × category × month | 2025 and 2026 |
| `forecast` | sales org × category × month | Q4 2026, `forecast_version = 2026-09-30` |

## Knowledge graph in Veezoo

The knowledge graph `global-bike` on app.veezoo.com is modelled; the class files as saved in Veezoo
Studio on 2026-10-07 live in `vkl/` (Studio reformats on save, so the indentation there may differ).

- **Classes:** Sales (`sales_order_lines`), Dealer (`customers`), Product (`products`), Sales
  Organization (`sales_orgs`), Product Category (`product_categories`), Plant, Budget, Forecast,
  Plant Capacity. Sales Organization and Product Category are top-level classes on their own one-row-per-value
  tables; basing them on a column of `customers` or `products` gave one entity per row (24 and 29) instead of 4 and 6.
- **Measures:** Revenue, Discount, Net Revenue, Cost, Margin (USD), Margin %, Discount Rate, Average
  Selling Price, Number of Orders, Budget Revenue, Forecast Revenue, Capacity Utilization, Utilization incl. Overtime.
- **Checked in the chat on 2026-10-07:** revenue by sales organization, revenue vs budget by category
  (Veezoo adds the partial-year caveat itself), Peachtree Bikes discount rate per month (3 % to 9 %),
  capacity utilization per plant in Q3 2026, SoCal Bikes quantity per month. The SoCal drop is visible
  only against the prior year (June to September 2026: 89, 107, 181, 7 units vs 684, 289, 406, 347 in 2025),
  so the agent should compare with the same months a year earlier, not look at the trend within 2026.
- **Still to do by Lennart:** pin "today" to 2026-09-30 in the Veezoo configuration. (The schema
  synchronization that failed during the table import was re-run successfully on 2026-10-07.)
- **Editing Studio files from the Claude browser:** the clipboard is blocked and `execCommand('insertText')`
  triggers the editor's auto-indent. What works: find the Monaco editor instance through the React fiber of
  `.react-monaco-editor-container` (walk `memoizedState` for an object with `getModel`), call
  `getModel().setValue(text)`, then click SAVE and SYNC and confirm the dialog.

## Demo questions, canvas challenge and agent

See the session plan in the chat of 2026-10-07 (to be moved here once agreed): seven questions
that each produce a chart to be reworked for management, a 15-minute canvas challenge with four
roles (US West, Germany South, E-Bike product lead, CFO), and an agent built live on the two
planted signals.
