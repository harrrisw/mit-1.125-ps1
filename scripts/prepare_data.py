"""Build the browser snapshot from archived City of Boston source responses."""
import csv, json, pathlib, collections
ROOT = pathlib.Path(__file__).resolve().parents[1]
raw = json.loads((ROOT/'data/capital-records.json').read_text())['result']
rows = raw['records']
assert len(rows) == raw['total'] == len({r['Proj ID'] for r in rows})
def n(r, *keys):
    return sum(int(r[k]) for k in keys)
projects = []
for r in rows:
    for key in ['Proj ID','Project_Name','Scope_Of_Work','Department','PM_Department','Project_Status','Neighborhood']:
        assert isinstance(r[key], str) and r[key].strip(), f'Missing {key}: {r.get("Proj ID")}'
    projects.append(dict(id=r['Proj ID'], name=r['Project_Name'], description=r['Scope_Of_Work'],
        department=r['Department'], manager=r['PM_Department'], status=r['Project_Status'], neighborhood=r['Neighborhood'],
        budget=n(r,'Total_Project_Budget'), spent=n(r,'GO_Expended','OC_Expended','Grant_Expended'),
        funds=[n(r,'Authorization_Existing','Authorization_FY','Authorization_Future'),n(r,'OC_Existing','OC_FY','OC_Future'),n(r,'Grant_Existing','Grant_FY','Grant_Future'),n(r,'External_Funds')]))
    assert sum(projects[-1]['funds']) == projects[-1]['budget'], r['Proj ID']
geo=json.loads((ROOT/'data/neighborhoods.geojson').read_text())
out=dict(projects=projects,geo=geo, retrieved='2026-09-22', updated='2026-08-03')
(ROOT/'data/snapshot.js').write_text('window.BOSTON_DATA = '+json.dumps(out,separators=(',',':'))+';',encoding='utf-8')
with (ROOT/'data/capital-plan.csv').open('w',newline='',encoding='utf-8') as f:
    writer=csv.DictWriter(f,fieldnames=list(rows[0])); writer.writeheader(); writer.writerows(rows)
print(f'Validated {len(projects)} unique projects; budget ${sum(p["budget"] for p in projects):,}; all funding totals reconcile.')
