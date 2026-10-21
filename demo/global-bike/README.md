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
is visible only against the prior year (built for the session of 2026-10-30 with `AS_OF` 2026-10-29:
July to October 2026 are 97, 124, 224, 27 units vs 645, 323, 403, 316 in 2025), so the agent should
compare with the same months a year earlier. Peachtree's discount rate climbs from 3 % in May to 9 % in October 2026.

**Not modelled on purpose:** budget attainment as a cross-fact measure (sales org x category x month
vs order lines); Veezoo answers "revenue vs budget by category" side by side, and the academy
recommends a ground truth for such cross-fact calculations if a single number is wanted. No class
carries onto.Location beyond City and Country, so "where" questions stay unambiguous.

**Before every session:** run `python3 demo/global-bike/build_global_bike.py <day before the session>` (done on 2026-10-21 for the session of 2026-10-30) and, if the descriptions in Studio still name a date, update them from `vkl/`. The planted signals move with the data.

**Editing Studio files from the Claude browser:** the clipboard is blocked and `execCommand('insertText')`
triggers the editor's auto-indent. What works: find the Monaco editor instance through the React fiber of
`.react-monaco-editor-container` (walk `memoizedState` for an object with `getModel`), call
`getModel().setValue(text)`, then click SAVE and SYNC and confirm the dialog. Entities of a deleted
nested class stay as orphan files under `classes/<Class>/entities/` and must be deleted by hand.

## Demo questions, canvas challenge and agent

Hands-on of 2026-10-30, 90 minutes (Lennart's whiteboard plan): intro and setup 10, knowledge graph and
first line of questioning 10, viz input 5, the students answer one question and present it as a chart
15, slide out of it 5, canvas explanation 5, build the daily canvas 20, discuss results 10, agents on
what they found 10. Three things are prepared: the first line of questioning, the student question,
and a "read me first" canvas that explains the data and the how-tos.

### First line of questioning (verified 2026-10-21)

Three turns in one chat, each building on the previous answer:

1. "For each month show me how many bikes were assembled and how many were sold"
2. "Put this into a scatter plot with one dot by month"
3. "Now color every point red where sold and assembled are more than 1 % apart"

Result: a near-perfect diagonal ("we usually sell what we assemble") with a handful of red dots. The red
dots are real: the months of the planted SoCal Bikes volume drop (bike sales fall, output does not) and
the current month, which has sales but no output yet (shown as "data not available" at x = 0). Point
this out, or ask "excluding the current month" in a fourth turn. Title and subtitle were added by hand
in the chart editor: "We usually sell what we got" / "but at these times not".

The sequence shows the three moves of the session in one minute: ask in business language, change the
form (table to scatter), add the highlight that carries the message.

### The story and the two root-cause chains (figures as of AS_OF 2026-10-29)

Global Bike assembles bikes in Dallas and Heidelberg and sells only through 24 dealers in four sales
organizations. Budgets were set as last year's months plus a growth target (5 % for three regions,
10 % for US West). Plant output is derived from bike sales, so sold and assembled match almost
exactly, except in the planted months. Everything else in the data is the real Global Bike history,
shifted in time.

**Chain 1, volume (the one for a root-cause analysis).** Symptom at the top: US West is far behind
budget in 2026 (11.5 M USD actual vs 18.1 M budget January to October) while the other three regions
are on or above budget. Drill: July to October revenue year over year by region, US West 4.8 M vs
8.6 M, the others flat or up. Drill: by dealer in US West, SoCal Bikes 1.0 M vs 3.2 M, Rocky Mountain
Bikes 1.9 M vs 3.6 M, Northwest Bikes unchanged. Drill: SoCal per month, July to October 2026 are 97,
124, 224, 27 units vs 645, 323, 403, 316 a year earlier; the month-by-month 2026 series alone looks
noisy, the drop appears only against the prior year. The data stops there: it says where and since
when, not why. (Rocky Mountain's decline is in the original data, not planted; it is a useful
confounder: "is it the region or one dealer?" has a two-part answer.) Also visible from the opening
scatter: the months where sold and assembled differ are exactly these.

**Chain 2, margin (subtle at the top, clear at the dealer).** Symptom: US East gross margin % slides
from about 45.8 % in the first half of 2026 to 43.7 % in October while revenue is up; discount rate
3.0 % to 3.9 %. Drill: discount rate by dealer since July, Peachtree Bikes 6.6 % (Beantown 5.0 % is
normal for that large dealer, the rest 3 %). Drill: Peachtree per month, 3 % through May, then 4.2,
5.4, 6.6, 7.8, 9.0 % to October: a straight line, which is the tell of a decision, not of noise.
Extra discount granted May to October: about 70 k USD. Gross revenue does not show it, net revenue
and margin do.

Lennart's starting line for the root-cause analysis is one level above: "Revenue vs budget revenue by
sales organization in 2026" (three regions on budget, US West at 11.5 M vs 18.1 M), then the room finds
out why. Brief: "Find out where the gap comes from, since when, and what you would ask the regional manager." Expected path: region, dealer,
month, prior-year comparison; expected answer: two dealers, one of them (SoCal) collapsing since July,
plus a budget that assumed 10 % growth.

### Student question, explainer canvas, agents

To be filled in after the prep on 2026-10-21 (candidates in the calendar events of that morning).
