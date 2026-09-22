const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');fs.mkdirSync(out,{recursive:true});
for(const f of ['index.html','styles.css','app.js'])fs.copyFileSync(path.join(root,f),path.join(out,f));
fs.mkdirSync(path.join(out,'data'),{recursive:true});
for(const f of ['snapshot.js','capital-plan.csv','capital-records.json','capital-metadata.json','neighborhoods.geojson'])fs.copyFileSync(path.join(root,'data',f),path.join(out,'data',f));
console.log('Static site built in dist/');
