# Global Bike: the hands-on dataset

BigQuery dataset `demos-467314.global_bike` (EU), built by `build_global_bike.py` from the SAP UCC
Global Bike sales data (2007 to 2016, 24 dealers, 29 products; the source file lives in the
git-ignored `hands-on/` folder). The build is deterministic; re-run the script to rebuild.

## What was done to the source

- **Shifted by about ten years** (2007–2016 → 2017–2026) so the story plays "now".
- **"Today" is the real date.** The builder shifts every date by a whole number of days so the
  actuals end on `AS_OF` (default: yesterday; pass a date as the first argument). Veezoo has no
  setting that fixes the current date, so re-run the builder on the eve of every session; the
  rest of the current year is covered by budget and forecast, and the planted signals move
  along, so relative questions ("last month", "last 3 months") always hit them.
- **Master data fixed:** encoding errors in two German dealer names, duplicate dealer rows
  removed, sales-org names spelled out (US East, US West, Germany North, Germany South).
- **Added from the story:** two plants (Dallas supplies US dealers, Heidelberg the German ones)
  with monthly assembly capacity; dealer size tier and "dealer since" year.
- **Added for management tracking:** monthly budget per sales org and category for 2025 and
  2026 (previous year × growth target; US West carries an ambitious +10 percent), and a rolling
  forecast as of 30 September for Q4 2026 (last year's months × this year's run rate).
- **Two planted signals for the agent exercise**, both in the months before "today":
  - *Peachtree Bikes (US East):* discount rate climbs from ~3 percent in April to ~9 percent in
    the month of `AS_OF` (the last five months of actuals).
  - *SoCal Bikes (US West):* about 65 percent fewer orders in the last four months of actuals; visible only against the same months a year earlier.

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
| `forecast` | sales org × category × month | month of `AS_OF` to December, `forecast_version = AS_OF` |

## Knowledge graph in Veezoo

The knowledge graph `global-bike` on app.veezoo.com is modelled around business concepts, not tables.
The class files as saved in Veezoo Studio on 2026-10-09 live in `vkl/` (Studio reformats and reorders
on save, so whitespace and class order there may differ); `vkl/entities/Dealer_Size.vkl` is the one
hand-edited entities file (ordinal order). Modelling follows the Veezoo academy (think in business
concepts, properties, subclasses, hierarchies, links) and the KG auditor checklist in `veezoo-ai/agents`.

**Classes** (name shown to users, file in brackets):

| Class | Grain | Notes |
|---|---|---|
| Order Line (`Sales_Order_Lines`) | one product on one order | all amounts; `quantity_of: Product`, so "how many bikes were sold" sums the quantity; local-currency amounts and the line number are hidden |
| Order (`Order` in the same file) | one sales order | promoted from the order-line table (same table, keyed by order number, entities not synced); carries Order Date (`event_date`), Currency and "placed by" Dealer; `extends onto.Order` |
| Dealer (`Customers`) | one dealer | `extends onto.Customer`; Dealer Size is an ordinal class (Small < Medium < Large); Dealer Since is a year-typed date ("dealers onboarded before 2012") |
| Sales Organization (`Sales_Org`, in the Customers file) | one of four | own table, code as synonym (`UE00`), Country |
| Product (`Products`) | one product | `extends onto.Product`; subclasses Bike and Accessory defined on the category's division; Unit Margin and Unit Margin % as row-level numbers; List Price `extends onto.Price` |
| Product Category (`Category`, in the Products file) | one of six | own table, Division as nested class (Bicycles or Accessories) |
| Plant (`Plants`) | one of two | code as synonym, Opening Year as date |
| Plant Production (`Plant_Capacity`) | one plant and month | Spare Capacity, Overtime Month boolean (negated name "Regular Month") |
| Budget, Forecast | sales org x category x month | `event_date` on the month, price-per-unit measures |

**Ontologies used:** onto.Order, onto.Order_Date, onto.Customer, onto.Product, onto.Revenue,
onto.Discount, onto.Profit, onto.Price, onto.City, onto.Country, onto.ID, onto.Currency.USD,
onto.Percentage. All were accepted by Studio; onto.Quantity and onto.Cost were not tried.

**Measures:** Revenue, Discount, Net Revenue, Cost of Goods, Gross Margin (numbers), Gross Margin %,
Discount Rate, Cost Ratio, Average Selling Price (net revenue per unit), Number of Orders
(`count(this.of_Order)`), Average Order Value, Units per Order, Unit Margin, Unit Margin %, Budgeted
Price per Unit, Forecast Price per Unit, Capacity Utilization, Utilization incl. Overtime, Spare
Capacity. Every class, attribute, relationship and measure has a description and synonyms (English
plus the German terms an MBA room in Switzerland or Germany might use).

**Checked in the chat on 2026-10-09:** "How many bikes were sold in 2026" (36,807, via the Bike
subclass and quantity), orders and average order value per month, gross margin % by dealer size
(sorted Small, Medium, Large), dealers onboarded before 2012, accessories vs bikes per quarter,
overtime months of Heidelberg; earlier: revenue by sales organization, revenue vs budget by category,
Peachtree Bikes discount rate per month (3 % to 9 %), capacity utilization per plant. The SoCal drop
is visible only against the prior year (with `AS_OF` 2026-10-20: July to September 2026 are 137, 118,
194 units vs 568, 261, 454 in 2025), so the agent should compare with the same months a year earlier.

**Not modelled on purpose:** budget attainment as a cross-fact measure (sales org x category x month
vs order lines); Veezoo answers "revenue vs budget by category" side by side, and the academy
recommends a ground truth for such cross-fact calculations if a single number is wanted. No class
carries onto.Location beyond City and Country, so "where" questions stay unambiguous.

**Before every session:** run `python3 demo/global-bike/build_global_bike.py` (actuals end yesterday) and, if the descriptions in Studio still name a date, update them from `vkl/`. The planted signals move with the data.

**Editing Studio files from the Claude browser:** the clipboard is blocked and `execCommand('insertText')`
triggers the editor's auto-indent. What works: find the Monaco editor instance through the React fiber of
`.react-monaco-editor-container` (walk `memoizedState` for an object with `getModel`), call
`getModel().setValue(text)`, then click SAVE and SYNC and confirm the dialog. Entities of a deleted
nested class stay as orphan files under `classes/<Class>/entities/` and must be deleted by hand.

## Demo questions, canvas challenge and agent

See the session plan in the chat of 2026-10-07 (to be moved here once agreed): seven questions
that each produce a chart to be reworked for management, a 15-minute canvas challenge with four
roles (US West, Germany South, E-Bike product lead, CFO), and an agent built live on the two
planted signals.
