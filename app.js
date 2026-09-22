'use strict';
const {projects,geo}=window.BOSTON_DATA;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'$'+(Math.abs(n)>=1e9?(n/1e9).toFixed(2)+'B':Math.abs(n)>=1e6?(n/1e6).toFixed(1)+'M':Math.abs(n)>=1e3?(n/1e3).toFixed(0)+'K':n.toLocaleString('en-US'));
const fullMoney=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const sum=(rows,key='budget')=>rows.reduce((s,p)=>s+p[key],0);
const group=(rows,key,value='budget')=>Object.entries(rows.reduce((acc,p)=>(acc[p[key]]=(acc[p[key]]||0)+(value==='count'?1:p[value]),acc),{})).sort((a,b)=>b[1]-a[1]);
const shortDepartment=d=>({'Boston Public Schools':'Boston Public Schools','Public Works Department':'Public Works','Parks and Recreation Department':'Parks & Recreation','Property Management Department':'Property Management','Boston Public Library':'Boston Public Library','Transportation Department':'Transportation','Boston Centers for Youth and Families':'Youth & Family Centers','Department of Innovation and Technology':'Innovation & Technology',"Mayor's Office of Housing":'Housing','Public Health Commission':'Public Health'}[d]||d.replace(' Department',''));
let filtered=[],page=1,showAll=false; const pageSize=8;
for(const [id,key] of [['neighborhood','neighborhood'],['department','department'],['status','status']]){
  [...new Set(projects.map(p=>p[key]))].sort().forEach(v=>$(id).add(new Option(v,v)));
  $(id).addEventListener('change',()=>{page=1;render();});
}
function selectedRows(){return projects.filter(p=>(!$('neighborhood').value||p.neighborhood===$('neighborhood').value)&&(!$('department').value||p.department===$('department').value)&&(!$('status').value||p.status===$('status').value)&&(!searchText()||[p.name,p.description,p.id,p.neighborhood,p.department].join(' ').toLowerCase().includes(searchText())));}
function searchText(){return $('search').value.trim().toLowerCase();}
function setFilter(id,value){$(id).value=$(id).value===value?'':value;page=1;render();}
function render(){
  filtered=selectedRows();
  $('total-budget').textContent=money(sum(filtered)); $('total-projects').textContent=filtered.length.toLocaleString(); $('total-spent').textContent=money(sum(filtered,'spent'));
  $('construction-count').textContent=filtered.filter(p=>p.status==='In Construction').length;
  $('departments-count').textContent=`Across ${new Set(filtered.map(p=>p.department)).size} city departments`;
  const names=[$('neighborhood').value||'All Boston',$('department').value&&shortDepartment($('department').value),$('status').value,searchText()&&`Search: “${$('search').value.trim()}”`].filter(Boolean);
  $('selection').textContent=names.join(' · ')+` · ${filtered.length} projects`;
  renderDepartments();renderStatus();renderFunding();renderMap();renderTable();
}
function renderDepartments(){
  const rows=group(filtered,'department');
  $('department-chart').innerHTML=rows.length?rows.slice(0,showAll?99:6).map(([name,value])=>`<button class="bar-row" data-department="${esc(name)}" aria-label="Filter to ${esc(name)}, ${esc(fullMoney(value))}"><span class="bar-top"><span>${esc(shortDepartment(name))}</span><strong>${money(value)}</strong></span><span class="bar-track"><span class="bar-fill" style="width:${rows[0][1]?value/rows[0][1]*100:0}%"></span></span></button>`).join(''):'<p class="empty">No projects match these filters.</p>';
  $('all-departments').textContent=showAll?'Show top 6 departments ↑':`View all ${rows.length} departments ↓`;
  $('all-departments').hidden=rows.length<=6;
  $('department-chart').querySelectorAll('button').forEach(b=>b.onclick=()=>setFilter('department',b.dataset.department));
}
function renderStatus(){
  const rows=group(filtered,'status','count');
  $('status-chart').innerHTML=rows.length?'<div class="status-bars">'+rows.map(([name,count])=>`<button class="status-row" data-status="${esc(name)}" aria-label="Filter to ${esc(name)}, ${count} projects"><div><span>${esc(name)}</span><strong>${count}</strong></div><span class="bar-track"><span class="bar-fill" style="width:${count/rows[0][1]*100}%"></span></span></button>`).join('')+'</div>':'<p class="empty">No matching project statuses.</p>';
  $('status-chart').querySelectorAll('button').forEach(b=>b.onclick=()=>setFilter('status',b.dataset.status));
}
const fundingNames=['City capital','Other City funds','Grants','External funds'],fundingColors=['#28765a','#85ab81','#c2d1a5','#d7ad77'];
function renderFunding(){
  const values=fundingNames.map((_,i)=>filtered.reduce((s,p)=>s+p.funds[i],0)),total=values.reduce((a,b)=>a+b,0);let at=0;
  const stops=values.map((v,i)=>{const start=at;at+=total?v/total*100:0;return `${fundingColors[i]} ${start}% ${at}%`;});
  $('funding-donut').style.background=total?`conic-gradient(${stops.join(',')})`:'#edf0e8';
  $('city-share').textContent=total?Math.round(values[0]/total*100)+'%':'—';
  $('funding-legend').innerHTML=values.map((v,i)=>`<div class="funding-item"><i style="background:${fundingColors[i]}"></i><span>${fundingNames[i]}</span><strong title="${fullMoney(v)}">${money(v)}</strong></div>`).join('');
}
const mappedName=name=>({'Allston':'Allston / Brighton','Brighton':'Allston / Brighton','Downtown':'Downtown / Government Center','Fenway':'Fenway / Kenmore','South Boston Waterfront':'South Boston'}[name]||name);
const polys=f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
const mainFeatures=geo.features.filter(f=>f.properties.name!=='Harbor Islands');
const mainPoints=mainFeatures.flatMap(f=>polys(f).flat(2));
function projector(points,box){const xs=points.map(p=>p[0]*Math.cos(42.3*Math.PI/180)),ys=points.map(p=>-p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);const scale=Math.min(box.w/(maxX-minX),box.h/(maxY-minY));return p=>[box.x+(box.w-(maxX-minX)*scale)/2+(p[0]*Math.cos(42.3*Math.PI/180)-minX)*scale,box.y+(box.h-(maxY-minY)*scale)/2+(-p[1]-minY)*scale];}
const project=projector(mainPoints,{x:20,y:12,w:455,h:355});
const island=geo.features.find(f=>f.properties.name==='Harbor Islands');
const islandProject=projector(polys(island).flat(2),{x:445,y:245,w:108,h:70});
function pathData(feature,projection){return polys(feature).map(poly=>poly.map(ring=>ring.map((p,i)=>{const [x,y]=projection(p);return (i?'L':'M')+x.toFixed(2)+','+y.toFixed(2);}).join('')+'Z').join('')).join('');}
function mapColor(value,max){if(!value||!max)return '#e4e6e1';const t=Math.sqrt(value/max);return `rgb(${Math.round(225-199*t)},${Math.round(234-128*t)},${Math.round(208-131*t)})`;}
function renderMap(){
  const budgets=Object.fromEntries(group(filtered,'neighborhood'));
  const max=Math.max(0,...Object.entries(budgets).filter(([n])=>!['Citywide','Multiple Neighborhoods'].includes(n)).map(([,v])=>v));
  const known=new Set(projects.map(p=>p.neighborhood));
  let html='<rect class="inset-box" x="437" y="230" width="126" height="104" rx="5"/><text x="446" y="325" class="map-inset-label">HARBOR ISLANDS · INSET</text>';
  html+=geo.features.map(f=>{const name=f.properties.name,key=mappedName(name),value=budgets[key]||0,matched=known.has(key);return `<path class="map-shape ${$('neighborhood').value===key?'selected':''}" d="${pathData(f,name==='Harbor Islands'?islandProject:project)}" fill="${mapColor(value,max)}" fill-rule="evenodd" data-neighborhood="${esc(key)}" data-display="${esc(name)}" tabindex="${matched?'0':'-1'}" role="${matched?'button':'img'}" aria-label="${esc(name)}: ${matched?fullMoney(value):'no matching budget label'}${name!==key?'; shared budget label '+esc(key):''}" ${matched?'':'aria-disabled="true"'}><title>${esc(name)} · ${matched?fullMoney(value):'No matching budget label'}${name!==key?' (shared '+esc(key)+' total)':''}</title></path>`;}).join('');
  const labels=[['Allston',[-71.13,42.36]],['Brighton',[-71.16,42.346]],['Charlestown',[-71.063,42.381]],['East Boston',[-71.015,42.377]],['Roxbury',[-71.087,42.324]],['Dorchester',[-71.063,42.296]],['Jamaica Plain',[-71.119,42.311]],['Roslindale',[-71.13,42.279]],['West Roxbury',[-71.167,42.281]],['Hyde Park',[-71.126,42.25]],['Mattapan',[-71.092,42.275]],['South Boston',[-71.04,42.334]]];
  html+=labels.map(([n,p])=>{const [x,y]=project(p);return `<text class="map-label" x="${x}" y="${y}" text-anchor="middle">${n}</text>`;}).join('');
  $('map').innerHTML=html;
  const defaultInfo=()=>{$('map-info').innerHTML='<strong>'+esc($('neighborhood').value||'Boston, neighborhood by neighborhood')+'</strong><span>'+($('neighborhood').value?fullMoney(budgets[$('neighborhood').value]||0)+' · selected project budgets':'Color shows total project budgets')+'</span>';};defaultInfo();
  $('map').querySelectorAll('[role="button"]').forEach(path=>{
    const key=path.dataset.neighborhood;
    const info=()=>{$('map-info').innerHTML=`<strong>${esc(path.dataset.display)}</strong><span>${money(budgets[key]||0)} · ${filtered.filter(p=>p.neighborhood===key).length} projects${key!==path.dataset.display?' · shared '+esc(key)+' total':''}</span>`;};
    path.onmouseenter=info;path.onfocus=info;path.onmouseleave=defaultInfo;path.onblur=defaultInfo;
    path.onclick=()=>setFilter('neighborhood',key);path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setFilter('neighborhood',key);$('neighborhood').focus();}};
  });
  const shared=filtered.filter(p=>['Citywide','Multiple Neighborhoods'].includes(p.neighborhood));
  $('shared-note').textContent=`${money(sum(shared))} in ${shared.length} citywide or multi-neighborhood projects is included in totals, but not allocated on the map. Colors show neighborhood totals, not construction sites.`;
}
function renderTable(){
  const sorted=[...filtered].sort((a,b)=>$('sort').value==='name'?a.name.localeCompare(b.name):b[$('sort').value]-a[$('sort').value]);
  const pages=Math.max(1,Math.ceil(sorted.length/pageSize));page=Math.min(page,pages);
  const current=sorted.slice((page-1)*pageSize,page*pageSize);
  $('project-count').textContent=filtered.length;
  $('project-rows').innerHTML=current.length?current.map(p=>`<tr><td><button class="project-name" data-id="${esc(p.id)}">${esc(p.name)}</button><small>${esc(shortDepartment(p.department))}</small></td><td>${esc(p.neighborhood)}</td><td><span class="status-tag ${p.status==='In Construction'?'construction':p.status==='In Design'?'design':p.status==='Study Underway'?'study':''}">${esc(p.status)}</span></td><td class="numeric" title="${fullMoney(p.budget)}"><strong>${money(p.budget)}</strong></td><td class="numeric" title="${fullMoney(p.spent)}">${money(p.spent)}</td><td><button class="arrow-button" data-id="${esc(p.id)}" aria-label="Details for ${esc(p.name)}">↗</button></td></tr>`).join(''):'<tr><td colspan="6" class="empty">No projects match your search. Try a different keyword or reset the filters.</td></tr>';
  $('project-rows').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openProject(b.dataset.id));
  $('page-info').textContent=sorted.length?`Showing ${(page-1)*pageSize+1}–${Math.min(page*pageSize,sorted.length)} of ${sorted.length} projects`:'0 projects';
  $('page-number').textContent=`${page} / ${pages}`;$('previous').disabled=page===1;$('next').disabled=page===pages;
}
function openProject(id){
  const p=projects.find(p=>p.id===id);
  $('dialog-content').innerHTML=`<div class="section-kicker">CAPITAL PROJECT · ${esc(p.id)}</div><h2 id="dialog-title">${esc(p.name)}</h2><p class="dialog-desc">${esc(p.description)}</p>${id==='CCC25010'?'<p class="detail-warning">Source-quality flag: this record is named Grove Hall but assigned to Hyde Park. Location has not been independently verified.</p>':''}<dl class="detail-grid"><div><dt>Neighborhood (source label)</dt><dd>${esc(p.neighborhood)}</dd></div><div><dt>Published project status</dt><dd>${esc(p.status)}</dd></div><div><dt>Lifetime project budget</dt><dd>${fullMoney(p.budget)}</dd></div><div><dt>Reported spending through FY25</dt><dd>${fullMoney(p.spent)}</dd></div><div><dt>Owning department</dt><dd>${esc(p.department)}</dd></div><div><dt>Managing department</dt><dd>${esc(p.manager)}</dd></div></dl><h3>Funding breakdown</h3>${p.funds.map((v,i)=>`<div class="funding-item"><i style="background:${fundingColors[i]}"></i><span>${fundingNames[i]}</span><strong>${fullMoney(v)}</strong></div>`).join('')}<p class="detail-callout">A budget is a plan, not proof of completed work. Reported spending excludes external-fund expenditure. The source does not supply verified site coordinates, completion dates, or contractor payments.</p><a class="outline-button" href="https://data.boston.gov/dataset/capital-budget/resource/c62d666e-27ea-4c03-9cb1-d3a81a1fb641" target="_blank" rel="noopener">View official source ↗</a>`;
  $('project-dialog').showModal();
}
function renderComparison(){
  const a=projects.filter(p=>p.neighborhood===$('compare-a').value),b=projects.filter(p=>p.neighborhood===$('compare-b').value);
  $('comparison').innerHTML=`<div class="comparison-grid"><span class="comparison-label">MEASURE</span><strong>${esc($('compare-a').value)}</strong><strong>${esc($('compare-b').value)}</strong><span class="comparison-label">Lifetime project budgets</span><strong class="comparison-number">${money(sum(a))}</strong><strong class="comparison-number">${money(sum(b))}</strong><span class="comparison-label">Projects in the plan</span><strong>${a.length}</strong><strong>${b.length}</strong><span class="comparison-label">In construction</span><strong>${a.filter(p=>p.status==='In Construction').length}</strong><strong>${b.filter(p=>p.status==='In Construction').length}</strong><span class="comparison-label">Spent through FY25</span><strong>${money(sum(a,'spent'))}</strong><strong>${money(sum(b,'spent'))}</strong></div>`;
}
for(const id of ['compare-a','compare-b']){[...new Set(projects.map(p=>p.neighborhood))].filter(n=>!['Citywide','Multiple Neighborhoods'].includes(n)).sort().forEach(n=>$(id).add(new Option(n,n)));$(id).onchange=renderComparison;}
$('compare-a').value='Roxbury';$('compare-b').value='Dorchester';
const total=sum(projects),schools=projects.filter(p=>['Boston Public Schools','Public Works Department'].includes(p.department)),shared=projects.filter(p=>['Citywide','Multiple Neighborhoods'].includes(p.neighborhood)),early=projects.filter(p=>['To Be Scheduled','New Project'].includes(p.status));
$('insight-cards').innerHTML=[
  [Math.round(sum(schools)/total*100)+'%','Schools and streets lead the plan.',`${money(sum(schools))} sits in Boston Public Schools and Public Works project budgets. Together, these two departments account for more than half of all lifetime investment.`,'Focus oversight where the dollars are.','Ask these departments to publish quarterly cost and milestone updates for their largest projects.'],
  [(sum(shared)/total*100).toFixed(1)+'%','Shared investments change the picture.',`${money(sum(shared))} spans ${shared.length} citywide or multi-neighborhood projects. Comparing local allocations alone misses about half the plan.`,'Ask who benefits, not just where.','Request service-area and beneficiary breakdowns before using neighborhood totals to set equity priorities.'],
  [String(early.length),'Some projects are still taking shape.',`${early.length} projects totaling ${money(sum(early))} are labeled “New Project” or “To Be Scheduled.” These labels identify planning questions, not proven delays.`,'Make the next milestone visible.','Ask for a named project owner, a next decision date, and a public engagement opportunity for unscheduled work.']
].map(([n,title,text,action,rec])=>`<article class="insight-card"><div class="insight-number">${n}</div><h3>${title}</h3><p>${text}</p><div class="recommendation"><strong>AN ACTION RESIDENTS CAN TAKE</strong><b>${action}</b><br>${rec}</div></article>`).join('');
$('reset').onclick=()=>{for(const id of ['neighborhood','department','status','search'])$(id).value='';page=1;render();};
$('search').oninput=()=>{page=1;render();};$('sort').onchange=()=>{page=1;renderTable();};
$('all-departments').onclick=()=>{showAll=!showAll;renderDepartments();};
$('previous').onclick=()=>{page--;renderTable();};$('next').onclick=()=>{page++;renderTable();};
document.querySelector('.dialog-close').onclick=()=>$('project-dialog').close();
$('project-dialog').onclick=e=>{if(e.target===$('project-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}};
$('export').onclick=()=>{
  const headers=['Project ID','Project name','Department','Neighborhood','Status','Lifetime budget USD','Reported spending through FY25 USD','City capital USD','Other City USD','Grants USD','External funds USD','Scope of work'];
  const cell=v=>'"'+String(v).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
  const csv=[headers,...filtered.map(p=>[p.id,p.name,p.department,p.neighborhood,p.status,p.budget,p.spent,...p.funds,p.description])].map(r=>r.map(cell).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='boston-builds-filtered-projects.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('toast').textContent=`Exported ${filtered.length} project records`;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',3500);
};
document.querySelectorAll('.header nav a').forEach(a=>a.onclick=()=>{document.querySelectorAll('.header nav a').forEach(n=>n.classList.toggle('active',a===n));});
render();renderComparison();
