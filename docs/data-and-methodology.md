# Data and methodology

**Boston Builds · MIT 1.125 PS1 · Snapshot collected September 22, 2026**  
[README](../README.md) · [Collected CSV](../data/capital-plan.csv) · [PDF](data-and-methodology.pdf)

## Purpose and sources

The site helps Boston residents and neighborhood groups identify capital projects to follow and questions to raise at budget hearings. It describes planned investment; it does not certify completed construction.

The [Analyze Boston Capital Plan](https://data.boston.gov/dataset/capital-budget), published by the Office of Budget Management and updated August 3, 2026, supplies the adopted FY2027–2031 project table. The CSV contains **325 records and 31 source/API columns**. [Boston Planning’s neighborhood service](https://gis.bostonplans.org/hosting/rest/services/Hosted/Boston_Neighborhood_Boundaries/FeatureServer/5) supplies 26 geographic features. The [City’s plan overview](https://www.boston.gov/departments/budget/fy27-31-capital-plan) establishes context and the FY2025 expenditure cutoff.

## Collection and preparation

Records were downloaded through the CKAN DataStore API; boundaries were retrieved as WGS84 GeoJSON. Raw records, dataset metadata, and geometry are archived in `data/`. The CSV preserves every returned record and column. No records are dropped and no values are imputed. Numeric strings are converted to integer dollars for analysis.

Running `python scripts/prepare_data.py` checks the returned count, unique project IDs, required descriptive fields, and each project’s funding reconciliation before regenerating the CSV and browser snapshot. All 325 funding totals reconcile. These checks establish internal consistency, not independent verification of source accuracy. The site is a static snapshot, not an automatically refreshed service.

## Measures and geography

Amounts are nominal US dollars. Lifetime budgets sum `Total_Project_Budget`, totaling **$4,470,029,155**; this is not FY2027–2031 cash spending. Reported expenditure sums `GO_Expended`, `OC_Expended`, and `Grant_Expended`, totaling **$394,281,678 through FY2025**. External-fund expenditure is unavailable. Funding combines existing, current-year, and future authorizations plus external funds. Status counts retain source labels; no completion percentage is inferred.

Budgets are grouped by department or source neighborhood. Name matching joins combined Allston/Brighton, Downtown/Government Center, Fenway/Kenmore, and South Boston labels to planning polygons. Shared polygon values are never counted twice. Citywide and multi-neighborhood budgets are not geographically apportioned. The map shows neighborhood allocations, not construction-site coordinates; its square-root color scale rescales with filters. Dashboard filters apply together; comparisons and findings have explicitly separate scopes.

## Uncertainty and interpretation

The City overview lists 321 projects and $4.4 billion, unlike the collected table; the discrepancy remains unresolved. Record `CCC25010` names Grove Hall but assigns Hyde Park; both source values are preserved and flagged. Planning boundaries are approximate. Exact addresses, verified completion dates, contractor payments, population, asset condition, and outcomes are absent. Spending and status refer to different time periods. Low spending cannot prove delay; neighborhood totals cannot establish fairness. Independently financed infrastructure may be outside this municipal plan.
