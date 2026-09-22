# Boston Builds

**Follow Boston’s public infrastructure investment—from a citywide budget to a project-level question.**

[Public site](https://boston-builds-budget-explorer.harris2004-wang.chatgpt.site/) · [Collected CSV](data/capital-plan.csv) · [Methodology](docs/data-and-methodology.md) · [Reflection](docs/reflection.md)

Boston Builds is an independent civic budget explorer for MIT 1.125 PS1. It connects Boston’s adopted FY2027–2031 Capital Plan with neighborhood geography so residents and community groups can understand allocations, compare projects, and focus public oversight. It is not an official City of Boston website.

## Submission materials

| Deliverable | File or page | Contents |
| --- | --- | --- |
| Working site | [Public Boston Builds website](https://boston-builds-budget-explorer.harris2004-wang.chatgpt.site/) | Interactive charts, map, comparisons, project explorer, findings, recommendations, and source notes; no sign-in required. |
| Collected dataset | [Capital Plan CSV](data/capital-plan.csv) · [Direct CSV download](https://raw.githubusercontent.com/harrrisw/mit-1.125-ps1/main/data/capital-plan.csv) | All 325 records and 31 original API columns, including the API row ID. Opens in Excel or Google Sheets. |
| One-page data and methodology note | [Read the note](docs/data-and-methodology.md) · [Download the one-page PDF](docs/data-and-methodology.pdf) | Sources, collection, preparation, calculations, geography, and limitations. |
| Short reflection | [Read the reflection](docs/reflection.md) | What the evidence supports, what it cannot establish, and implications for recommendations. |
| Field guide | [Data dictionary](docs/data-dictionary.md) | Analysis fields, units, formulas, and retained fields not interpreted by the site. |

This repository contains source code and data, not presentation files.

## Problem, users, and decisions

Public capital plans contain large amounts and technical funding fields, but residents need practical answers: What is planned near me? Which department is responsible? How is a project funded? What should I ask about next?

The intended users are Boston residents, neighborhood associations, and civic groups preparing for budget discussions. The site supports **prioritizing projects for oversight and forming evidence-based questions**. It does not rank neighborhood fairness, certify completion, or assess contractor performance.

A useful workflow is:

1. Select a neighborhood, department, or status.
2. Review allocations, funding sources, and published project stages.
3. Open a project for its scope, responsible departments, budget, and reported spending.
4. Compare two neighborhoods while keeping shared citywide investment in mind.
5. Export a shortlist and ask for a project owner, next milestone, or engagement date.

## Features

- Four indicators: lifetime project budgets, project count, spending through FY2025, and projects labeled “In Construction.”
- Department budget bars, a neighborhood allocation map, status counts, and a funding-source breakdown.
- Combined neighborhood, department, status, and search filters. Search also updates dashboard totals.
- Side-by-side neighborhood comparisons using the full snapshot, independently of dashboard filters.
- Sortable, paginated project listings, project-detail dialogs, and full/filtered CSV downloads.
- Three citywide findings with recommendations; findings remain citywide when filters change.
- Responsive layouts, keyboard-operable map areas, focus indicators, and documented caveats.

**Map interpretation:** polygons show neighborhood allocations, not exact project addresses or construction markers. The source has no site coordinates. Citywide and multi-neighborhood budgets remain in totals but are not distributed across polygons.

## Snapshot and principal findings

**Collected:** September 22, 2026. **Budget dataset updated:** August 3, 2026. **Coverage:** adopted FY2027–2031 plan. The website uses a bundled snapshot; it does not refresh automatically.

| Measure | Result | Interpretation |
| --- | ---: | --- |
| Unique project records | 325 | Records may represent programs rather than individual buildings. |
| Lifetime project budgets | $4,470,029,155 | Includes prior years and future funding; not five-year cash spending. |
| Reported spending through FY2025 | $394,281,678 | City capital, other City, and grants; external expenditure is not supplied. |
| Projects labeled “In Construction” | 78 | Published status, not a live inspection or completion measure. |
| Owning departments | 15 | Distinct departments in the downloaded records. |

Three findings guide the recommendations:

1. **Schools and Public Works hold 54.4% of lifetime budgets** ($2,429,833,574). Their largest projects are useful starting points for cost and milestone oversight.
2. **Citywide and multi-neighborhood records account for 50.5% of budgets** ($2,257,088,705 across 126 records). Request beneficiary and service-area information before using local totals as an equity measure.
3. **60 projects labeled “New Project” or “To Be Scheduled” total $552,797,000.** Ask for named owners, next decision dates, and engagement opportunities. These labels do not prove delay.

The [reflection](docs/reflection.md) explains what these observations do and do not support.

## Sources and provenance

| Source | Use | Archived copy |
| --- | --- | --- |
| [Analyze Boston: Capital Plan](https://data.boston.gov/dataset/capital-budget), Office of Budget Management | Adopted project records, descriptions, financial fields, neighborhoods, and status | [Raw API response](data/capital-records.json), [metadata](data/capital-metadata.json), [CSV](data/capital-plan.csv) |
| [Boston Planning: BPDA Neighborhoods, layer 5](https://gis.bostonplans.org/hosting/rest/services/Hosted/Boston_Neighborhood_Boundaries/FeatureServer/5) | 26 planning boundary features | [GeoJSON](data/neighborhoods.geojson) |
| [Boston.gov: FY27–31 Capital Plan](https://www.boston.gov/departments/budget/fy27-31-capital-plan) | Context, expenditure cutoff, and narrative-summary comparison | Linked page; its HTML is not archived here |

Records were collected through the [CKAN DataStore API](https://data.boston.gov/api/3/action/datastore_search?resource_id=c62d666e-27ea-4c03-9cb1-d3a81a1fb641&limit=10000). The CSV faithfully serializes those records; it is not a separately edited dataset. See the [methodology](docs/data-and-methodology.md) and [field guide](docs/data-dictionary.md).

For spreadsheets, download the raw CSV and import it as UTF-8 comma-separated data. Keep `Proj ID` as text and financial columns as numbers. Amounts are nominal US dollars. Neighborhood labels are not verified addresses.

## Known limitations

- The City overview lists **321 projects and $4.4 billion**, unlike the collected table’s **325 IDs and $4,470,029,155**. The cause has not been reconciled with the City.
- Record `CCC25010` is named “BCYF Grove Hall Community Center” but assigned to Hyde Park. Both fields are retained and the project dialog flags the inconsistency.
- Exact addresses, coordinates, verified completion dates, contractor payments, procurement records, population denominators, asset condition, and outcomes are unavailable in this table.
- Planning boundaries are approximate. Combined budget labels can cover multiple polygons; those amounts are not counted twice in totals.
- Spending through FY2025 and statuses in the adopted plan have different time references. Their difference cannot establish delay, underspending, or overrun.
- Costly assets and citywide programs can dominate totals. Dollars alone do not establish benefit, fairness, or unmet need.
- Independently financed MBTA, state, federal, and other infrastructure may be outside this municipal plan.

## Run locally

Use Node.js 20 or later. There are no runtime package dependencies or API keys.

```powershell
git clone https://github.com/harrrisw/mit-1.125-ps1.git
cd mit-1.125-ps1
npm start
```

Open **http://localhost:3000**. Stop with `Ctrl+C`. `npm run dev` starts the same server. You can also open `index.html` directly because data is bundled in `data/snapshot.js`. Google Fonts is optional; system fonts are the fallback.

## Build and reproduce the data

```powershell
# Regenerate CSV and browser data from archived responses.
python scripts/prepare_data.py

# Package the static website into dist/.
npm run build
```

The preparation script uses Python’s standard library. It checks record count, unique IDs, required descriptive fields, numeric conversion, and each project’s funding reconciliation. It does not drop records, impute values, independently verify source claims, or verify geographic assignments.

The `dist/` output can be served by a static host. `.openai/hosting.json` identifies the existing ChatGPT Site and output directory; deployment requires owner credentials. **Pushing to GitHub does not automatically update the public Site.** Repository documentation is read on GitHub and is not copied into the website by the build script.

To update the snapshot:

1. Retrieve official metadata, complete project records, and geography; archive the responses under `data/`.
2. Review release dates, fiscal years, schema, definitions, completeness, and source discrepancies.
3. Update the dates in `scripts/prepare_data.py` and review fiscal-year labels, notes, and findings throughout the site and documentation.
4. Regenerate, test, inspect, build, commit, and publish the reviewed changes.

The preparation script does **not** download a new release. Re-running it alone does not make the data current.

## Verification

```powershell
npm ci
npm test
```

Browser tests use Playwright and installed Microsoft Edge. The default executable is `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`; set `BROWSER_EXECUTABLE` to another installed compatible Chromium browser if needed.

Checks cover totals, map polygons/legend, chart expansion, combined filters, keyboard selection, limitations disclosure, project details, empty results, pagination, comparisons, CSV contents, JavaScript errors, and horizontal overflow at 320, 390, 768, and 1440 pixels. Screenshots go to the ignored `artifacts/` folder. The public deployment was also checked in a signed-out browser for page loading, filtering, and downloads.

## Repository guide

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Page content, responsive styling, and interactive analysis |
| `data/capital-plan.csv` | Collected table: 325 records and 31 columns |
| `data/capital-records.json`, `data/capital-metadata.json` | Archived records and provenance |
| `data/neighborhoods.geojson` | Archived planning boundaries |
| `data/snapshot.js` | Generated browser data |
| `docs/` | Methodology, reflection, and field guide |
| `scripts/prepare_data.py` | Data transformation and reconciliation |
| `scripts/serve.cjs`, `scripts/build.cjs`, `scripts/test.cjs` | Local server, packaging, and browser checks |
| `.openai/hosting.json` | Existing ChatGPT Site configuration |

## Attribution and reuse

Archived capital dataset metadata identifies the **Open Data Commons Public Domain Dedication and License (PDDL)**. Consult the planning service for geography attribution and terms; do not assume the budget license covers other sources or application code. Credit the City of Boston and Boston Planning for their data. No separate application-code license is included.
