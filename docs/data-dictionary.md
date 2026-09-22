# Data dictionary and calculation guide

[Back to the README](../README.md) · [CSV](../data/capital-plan.csv) · [Methodology](data-and-methodology.md)

## File and record structure

`data/capital-plan.csv` is UTF-8 CSV with a header, **325 records**, and **31 columns**. Each record is one capital project or program, keyed by `Proj ID`. It is generated from the archived CKAN API response without removing fields or rows. Monetary values are nominal US dollars. Zero is retained as reported, not treated as a missing value.

These definitions document how the application uses the source fields. The [official dataset page](https://data.boston.gov/dataset/capital-budget) also links the City’s data dictionary.

## Identity, scope, and location

| Source column | Meaning and use |
| --- | --- |
| `_id` | DataStore row identifier; retained for provenance, not the project key. |
| `Proj ID` | Source project identifier; unique across the 325 records. |
| `Department` | Owning department; used in department totals and filters. |
| `Project_Name` | Published project or program name. Names are not assumed unique. |
| `Scope_Of_Work` | Description displayed in details and included in search. |
| `PM_Department` | Managing department displayed in project details. |
| `Project_Status` | Published stage, preserved verbatim. |
| `Neighborhood` | Allocation label: a neighborhood, `Citywide`, or `Multiple Neighborhoods`. Not an address. |

## Funding and expenditure

| Source columns | Application interpretation |
| --- | --- |
| `Total_Project_Budget` | Lifetime project budget used for headline and allocation totals. |
| `Authorization_Existing`, `Authorization_FY`, `Authorization_Future` | City capital funding across existing, current fiscal-year, and future authorizations. |
| `OC_Existing`, `OC_FY`, `OC_Future` | Other City funding. |
| `Grant_Existing`, `Grant_FY`, `Grant_Future` | Grant funding. |
| `External_Funds` | External funding, kept separate. |
| `GO_Expended`, `OC_Expended`, `Grant_Expended` | Reported spending through FY2025; external expenditure is not provided. |

The funding categories reconcile to `Total_Project_Budget` for every record. This is a consistency check, not evidence of disbursement.

## Retained forecast fields

The CSV also preserves nine fields: `Capital_Year_0`, `CapitalYear_1`, `Capital_Year_25`, `OC_Year_0`, `OC_Year_1`, `OCYear_25`, `Grant_Year_0`, `Grant_Year_1`, and `GrantYear_25`.

The site does **not** use these fields to draw yearly spending trends or infer construction dates. Confirm their fiscal-period mapping against the official release-specific dictionary before a separate forecast analysis; do not infer calendar years from suffixes alone.

## Derived measures

```text
City capital = Authorization_Existing + Authorization_FY + Authorization_Future
Other City   = OC_Existing + OC_FY + OC_Future
Grants       = Grant_Existing + Grant_FY + Grant_Future
Funding      = City capital + Other City + Grants + External_Funds
Spent        = GO_Expended + OC_Expended + Grant_Expended
```

Department and neighborhood allocations sum `Total_Project_Budget` over matching records. “In construction” counts only `In Construction`. The school/Public Works finding sums those two owning departments. Shared investment includes `Citywide` and `Multiple Neighborhoods`. Early-stage findings combine `New Project` and `To Be Scheduled`; this is a presentation grouping, not an official delay measure.

K, M, and B denote thousands, millions, and billions. Rounded display values may not sum exactly; the CSV retains whole dollars. Funding percentages use the selected budget total. Narrative findings use all 325 records.

## Geography crosswalk

| Planning polygon name(s) | Budget label |
| --- | --- |
| Allston; Brighton | Allston / Brighton |
| Downtown | Downtown / Government Center |
| Fenway | Fenway / Kenmore |
| South Boston; South Boston Waterfront | South Boston |
| Other matching names | Same source name |
| Longwood; Leather District | No matching budget label |

Displaying a combined amount on two polygons does not divide or duplicate it in financial totals. Citywide and multi-neighborhood projects are excluded from polygon allocation. Harbor Islands uses an inset at a different scale. Gray indicates zero selected budget or no matching label; it does not establish the absence of investment.
