# Boston Builds

A responsive, static civic budget explorer for residents and community groups. Uses the adopted FY2027–2031 City of Boston Capital Plan: 325 unique project records, $4,470,029,155 in lifetime project budgets. This differs from the City's narrative summary; the discrepancy is documented in the site.

## Run

`npm start` serves http://localhost:3000. There are no runtime dependencies or API keys. `npm run build` copies the complete static site into `dist/`. The site also works by opening `index.html` directly. Google Fonts is optional; system fonts are the fallback.

## Data

- Official budget API: https://data.boston.gov/api/3/action/datastore_search?resource_id=c62d666e-27ea-4c03-9cb1-d3a81a1fb641&limit=10000
- Source metadata: https://data.boston.gov/api/3/action/package_show?id=capital-budget
- Geography: https://gis.bostonplans.org/hosting/rest/services/Hosted/Boston_Neighborhood_Boundaries/FeatureServer/5
- Context and expenditure cutoff: https://www.boston.gov/departments/budget/fy27-31-capital-plan

Retrieved September 22, 2026; budget source updated August 3, 2026. Raw responses and generated CSV are retained under `data/`. `python scripts/prepare_data.py` validates unique IDs, record count, and per-project funding reconciliation before rebuilding `data/snapshot.js`. This is a static snapshot, not a live service. To update, replace the archived official responses after reviewing schema and release changes, then run the preparation script. The displayed source date and fiscal-year text must also be reviewed.

The map uses real planning polygons, with a documented name crosswalk. It does not geocode construction sites or distribute shared budgets. No demographic equity inference is made. Financial measures use source fields without imputation. See the site methodology for detailed definitions, missing data, and known quality issues.

## Validation

`npm install` installs Playwright for browser checks. `npm test` starts a temporary local server and tests desktop/mobile rendering, financial totals, filtering, empty states, project details, comparison, exports, keyboard operation and console errors using installed Microsoft Edge. Set `BROWSER_EXECUTABLE` if Edge is installed elsewhere.
