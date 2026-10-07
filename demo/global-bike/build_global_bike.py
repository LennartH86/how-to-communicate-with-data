#!/usr/bin/env python3
"""
Build the Global Bike hands-on dataset in BigQuery (demos-467314.global_bike).

Source: SAP UCC "Global Bike" sales data 2007-2016 (hands-on/GBI_Case_Data_Data Visualization.xlsx,
not committed). The script shifts every date by SHIFT_YEARS so the data ends "today", adds
budget, forecast, plants and capacity derived from the story, fixes master-data quirks and
plants two signals for the agent exercise. Re-running rebuilds every table (WRITE_TRUNCATE).

    GOOGLE_APPLICATION_CREDENTIALS=~/.config/veezoo-os/credentials/gcp/<key>.json \
      python3 demo/global-bike/build_global_bike.py

"Today" in the Veezoo knowledge graph must be pinned to AS_OF so the demo looks the same on
any real date.
"""
import datetime as dt
import numpy as np
import pandas as pd
from google.cloud import bigquery

SRC = '/Users/lennartheuckendorf/Documents/how-to-communicate-with-data/hands-on/GBI_Case_Data_Data Visualization.xlsx'
PROJECT, DATASET = 'demos-467314', 'global_bike'
SHIFT_YEARS = 10
AS_OF = dt.date(2026, 9, 30)          # the fixed "today": actuals end here, Q4 2026 is open
RNG = np.random.default_rng(2026)

# Signals planted for the agent exercise (both in the last months before AS_OF)
DISCOUNT_DRIFT = {'customer': 'Peachtree Bikes', 'from': (2026, 5), 'to': (2026, 9), 'target_rate': 0.09}
VOLUME_DROP = {'customer': 'Northwest Bikes', 'from': (2026, 7), 'to': (2026, 9), 'keep_share': 0.45}

SALES_ORG_NAMES = {'UE00': 'US East', 'UW00': 'US West', 'DN00': 'Germany North', 'DS00': 'Germany South'}
NAME_FIXES = {'Mnchen': 'München', 'R„dlelland': 'Rädlelland', 'Rdlelland': 'Rädlelland'}


def shift_date(d):
    try:
        return d.replace(year=d.year + SHIFT_YEARS)
    except ValueError:                 # 29 February in a non-leap target year
        return d.replace(year=d.year + SHIFT_YEARS, day=28)


def load_source():
    df = pd.read_excel(SRC, sheet_name='SalesData')
    df['Date'] = pd.to_datetime(df['Date']).dt.date.map(shift_date)
    df['YEAR'] = [d.year for d in df['Date']]
    df['MONTH'] = [d.month for d in df['Date']]
    for col in ('CustDescr', 'City'):
        df[col] = df[col].replace(NAME_FIXES)
    return df


def build(df):
    # ── dimensions ─────────────────────────────────────────────────────────
    customers = (df.groupby(['Customer', 'CustDescr', 'City', 'Country', 'SalesOrg'], as_index=False)
                   .agg(first_order=('Date', 'min'), revenue_usd=('Revenue USD', 'sum')))
    customers['sales_org_name'] = customers['SalesOrg'].map(SALES_ORG_NAMES)
    tiers = pd.qcut(customers['revenue_usd'], [0, .33, .75, 1], labels=['Small', 'Medium', 'Large'])
    customers['dealer_size'] = tiers.astype(str)
    customers['dealer_since'] = [int(d.year) - int(RNG.integers(1, 9)) for d in customers['first_order']]
    customers['plant_id'] = np.where(customers['Country'] == 'US', 'DL00', 'HD00')
    customers = customers.rename(columns={'Customer': 'customer_id', 'CustDescr': 'customer_name', 'City': 'city',
                                          'Country': 'country', 'SalesOrg': 'sales_org'})
    customers = customers[['customer_id', 'customer_name', 'city', 'country', 'sales_org', 'sales_org_name',
                           'dealer_size', 'dealer_since', 'plant_id']]

    unit = df.assign(unit_price=df['Revenue USD'] / df['SalesQuantity'], unit_cost=df['Costs in USD'] / df['SalesQuantity'])
    products = (unit.groupby(['Product', 'ProdDescr', 'ProdCat', 'CatDescr', 'Division'], as_index=False)
                    .agg(list_price_usd=('unit_price', 'median'), unit_cost_usd=('unit_cost', 'median'),
                         first_sold=('Date', 'min')))
    products['division_name'] = products['Division'].map({'BI': 'Bicycles', 'AS': 'Accessories'})
    products['category_name'] = products['CatDescr'].replace({'Accessoire': 'Accessories', 'Roadbike': 'Road Bike'})
    products['list_price_usd'] = products['list_price_usd'].round(2)
    products['unit_cost_usd'] = products['unit_cost_usd'].round(2)
    products['launch_year'] = [d.year for d in products['first_sold']]
    products = products.rename(columns={'Product': 'product_id', 'ProdDescr': 'product_name', 'ProdCat': 'category',
                                        'Division': 'division'})
    products = products[['product_id', 'product_name', 'category', 'category_name', 'division', 'division_name',
                         'list_price_usd', 'unit_cost_usd', 'launch_year']]

    plants = pd.DataFrame([
        {'plant_id': 'DL00', 'plant_name': 'Dallas', 'city': 'Dallas', 'country': 'US', 'assembly_lines': 3, 'opened': 2001},
        {'plant_id': 'HD00', 'plant_name': 'Heidelberg', 'city': 'Heidelberg', 'country': 'DE', 'assembly_lines': 3, 'opened': 2001},
    ])

    # ── fact: shifted order lines up to AS_OF, with the two planted signals ──
    lines = df.merge(customers[['customer_id', 'customer_name']], left_on='Customer', right_on='customer_id', how='left')
    lines = lines[lines['Date'] <= AS_OF].copy()

    # volume drop: a dealer orders far less in the last quarter
    c = lines['customer_name'] == VOLUME_DROP['customer']
    win = c & lines['YEAR'].eq(VOLUME_DROP['from'][0]) & lines['MONTH'].between(VOLUME_DROP['from'][1], VOLUME_DROP['to'][1])
    orders = lines.loc[win, 'OrderNumber'].unique()
    drop = RNG.choice(orders, size=int(len(orders) * (1 - VOLUME_DROP['keep_share'])), replace=False)
    lines = lines[~lines['OrderNumber'].isin(drop)].copy()

    # discount drift: a dealer's discount rate climbs month by month
    c = lines['customer_name'] == DISCOUNT_DRIFT['customer']
    y0, m0 = DISCOUNT_DRIFT['from']; y1, m1 = DISCOUNT_DRIFT['to']
    span = (y1 - y0) * 12 + (m1 - m0)
    base_rate = (lines.loc[c, 'Discount USD'].sum() / lines.loc[c, 'Revenue USD'].sum())
    for i in range(span + 1):
        y, m = y0 + (m0 - 1 + i) // 12, (m0 - 1 + i) % 12 + 1
        rate = base_rate + (DISCOUNT_DRIFT['target_rate'] - base_rate) * (i + 1) / (span + 1)
        sel = c & lines['YEAR'].eq(y) & lines['MONTH'].eq(m)
        lines.loc[sel, 'Discount USD'] = (lines.loc[sel, 'Revenue USD'] * rate).round(2)
        lines.loc[sel, 'Discount'] = (lines.loc[sel, 'Revenue'] * rate).round(2)

    fact = pd.DataFrame({
        'order_number': lines['OrderNumber'], 'order_item': lines['OrderItem'], 'order_date': lines['Date'],
        'customer_id': lines['Customer'], 'product_id': lines['Product'], 'quantity': lines['SalesQuantity'],
        'currency': lines['Currency'], 'revenue_local': lines['Revenue'], 'discount_local': lines['Discount'],
        'revenue_usd': lines['Revenue USD'], 'discount_usd': lines['Discount USD'], 'cost_usd': lines['Costs in USD'],
    })
    fact['net_revenue_usd'] = (fact['revenue_usd'] - fact['discount_usd']).round(2)
    fact['margin_usd'] = (fact['net_revenue_usd'] - fact['cost_usd']).round(2)
    fact = fact.sort_values(['order_date', 'order_number', 'order_item']).reset_index(drop=True)

    # ── monthly actuals by sales org and category, basis for budget and forecast ──
    full = df.merge(customers[['customer_id', 'sales_org']], left_on='Customer', right_on='customer_id', how='left')
    full['month_start'] = [dt.date(d.year, d.month, 1) for d in full['Date']]
    monthly = (full.groupby(['month_start', 'sales_org', 'CatDescr'], as_index=False)
                   .agg(revenue_usd=('Revenue USD', 'sum'), quantity=('SalesQuantity', 'sum')))
    monthly['category'] = monthly['CatDescr'].map(dict(zip(df['CatDescr'], df['ProdCat'])))
    monthly['year'] = [d.year for d in monthly['month_start']]

    # budget: previous year's month × growth target per sales org (US West gets an ambitious target)
    growth = {'UE00': 1.05, 'UW00': 1.10, 'DN00': 1.05, 'DS00': 1.04}
    budget_rows = []
    for year in (AS_OF.year - 1, AS_OF.year):
        prev = monthly[monthly['year'] == year - 1]
        for _, r in prev.iterrows():
            budget_rows.append({'budget_month': dt.date(year, r['month_start'].month, 1), 'sales_org': r['sales_org'],
                                'category': r['category'],
                                'budget_revenue_usd': round(r['revenue_usd'] * growth[r['sales_org']], -2),
                                'budget_quantity': int(round(r['quantity'] * growth[r['sales_org']]))})
    budget = pd.DataFrame(budget_rows)

    # forecast as of AS_OF: open months of the year = last year's month × this year's YTD growth, slight noise
    ytd_now = monthly[(monthly['year'] == AS_OF.year) & (monthly['month_start'] <= AS_OF)].groupby('sales_org')['revenue_usd'].sum()
    ytd_prev = monthly[(monthly['year'] == AS_OF.year - 1) & ([d.month <= AS_OF.month for d in monthly['month_start']])].groupby('sales_org')['revenue_usd'].sum()
    run_rate = (ytd_now / ytd_prev).to_dict()
    fc_rows = []
    for _, r in monthly[monthly['year'] == AS_OF.year - 1].iterrows():
        m = r['month_start'].month
        if m <= AS_OF.month:
            continue
        noise = float(RNG.normal(1.0, 0.03))
        fc_rows.append({'forecast_month': dt.date(AS_OF.year, m, 1), 'sales_org': r['sales_org'], 'category': r['category'],
                        'forecast_revenue_usd': round(r['revenue_usd'] * run_rate[r['sales_org']] * noise, -2),
                        'forecast_quantity': int(round(r['quantity'] * run_rate[r['sales_org']] * noise)),
                        'forecast_version': AS_OF})
    forecast = pd.DataFrame(fc_rows)

    # capacity: bikes assembled per plant and month; capacity set so the season peaks need overtime
    bikes = full[full['Division'] == 'BI'].merge(customers[['customer_id', 'plant_id']], on='customer_id', how='left')
    prod = bikes.groupby(['plant_id', 'month_start'], as_index=False).agg(bikes_assembled=('SalesQuantity', 'sum'))
    p80 = prod.groupby('plant_id')['bikes_assembled'].quantile(0.80).round(-2).to_dict()
    cap_rows = []
    for plant_id in plants['plant_id']:
        for year in range(fact['order_date'].min().year, AS_OF.year + 1):
            for m in range(1, 13):
                month = dt.date(year, m, 1)
                if month > dt.date(AS_OF.year, 12, 1):
                    continue
                base = p80[plant_id]
                assembled = prod[(prod['plant_id'] == plant_id) & (prod['month_start'] == month)]['bikes_assembled'].sum()
                cap_rows.append({'plant_id': plant_id, 'month': month, 'capacity_units': int(base),
                                 'overtime_capacity_units': int(round(base * 1.18)),
                                 'bikes_assembled': int(assembled) if month <= dt.date(AS_OF.year, AS_OF.month, 1) else None})
    capacity = pd.DataFrame(cap_rows)
    return customers, products, plants, fact, budget, forecast, capacity


def main():
    df = load_source()
    customers, products, plants, fact, budget, forecast, capacity = build(df)
    client = bigquery.Client(project=PROJECT)
    ds = bigquery.Dataset(f'{PROJECT}.{DATASET}'); ds.location = 'EU'
    client.create_dataset(ds, exists_ok=True)
    tables = {
        'customers': (customers, 'Independent bicycle dealers (24). plant_id is the plant that supplies them.'),
        'products': (products, 'Global Bike products (29) with category, division, list price and unit cost in USD.'),
        'plants': (plants, 'The two assembly plants from the Global Bike story.'),
        'sales_order_lines': (fact, f'Order lines, dates shifted by {SHIFT_YEARS} years, actuals up to {AS_OF}. net_revenue = revenue - discount, margin = net revenue - cost.'),
        'budget': (budget, f'Monthly revenue and quantity budget per sales org and product category for {AS_OF.year - 1} and {AS_OF.year}.'),
        'forecast': (forecast, f'Rolling forecast as of {AS_OF} for the open months of {AS_OF.year}, per sales org and category.'),
        'plant_capacity': (capacity, 'Monthly assembly capacity per plant (regular and with overtime) and bikes assembled.'),
    }
    for name, (frame, desc) in tables.items():
        job = client.load_table_from_dataframe(frame, f'{PROJECT}.{DATASET}.{name}',
                                               job_config=bigquery.LoadJobConfig(write_disposition='WRITE_TRUNCATE'))
        job.result()
        t = client.get_table(f'{PROJECT}.{DATASET}.{name}'); t.description = desc; client.update_table(t, ['description'])
        print(f'{name:20s} {t.num_rows:8d} rows')
    print(f'as of {AS_OF}; signals: {DISCOUNT_DRIFT["customer"]} discount drift, {VOLUME_DROP["customer"]} volume drop')


if __name__ == '__main__':
    main()
