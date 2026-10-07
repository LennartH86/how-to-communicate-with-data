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
  - *Northwest Bikes (US West):* about 55 percent fewer orders in July to September 2026.

## Tables

| Table | Grain | Notes |
|---|---|---|
| `sales_order_lines` | order line | revenue, discount, cost in USD plus local currency; `net_revenue_usd`, `margin_usd` precomputed |
| `customers` | dealer | city, country, `sales_org`, `sales_org_name`, `dealer_size`, `dealer_since`, `plant_id` |
| `products` | product | category, division, `list_price_usd`, `unit_cost_usd`, `launch_year` |
| `plants` | plant | Dallas, Heidelberg |
| `plant_capacity` | plant × month | `capacity_units`, `overtime_capacity_units` (+18 %), `bikes_assembled` |
| `budget` | sales org × category × month | 2025 and 2026 |
| `forecast` | sales org × category × month | Q4 2026, `forecast_version = 2026-09-30` |

## Knowledge graph sketch for Veezoo

Concepts: **Sales order line** (date, order), **Customer** (dealer), **Product**, **Sales org**,
**Plant**, **Budget**, **Forecast**, **Capacity**. Measures: revenue, discount, net revenue, cost,
margin, margin %, quantity, average price, discount rate, budget, forecast, budget attainment,
capacity utilisation. Synonyms: dealer/customer/Händler, sales/revenue/Umsatz, bikes/bicycles,
Germany/DE, USA/US, plan/budget. Fiscal year = calendar year. Today = 2026-09-30.

## Demo questions, canvas challenge and agent

See the session plan in the chat of 2026-10-07 (to be moved here once agreed): seven questions
that each produce a chart to be reworked for management, a 15-minute canvas challenge with four
roles (US West, Germany South, E-Bike product lead, CFO), and an agent built live on the two
planted signals.
