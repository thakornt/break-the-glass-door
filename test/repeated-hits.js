const C=require('../src/core.js'), O=require('../src/objects.js');
const get=id=>{const o=O.OBJECTS.find(o=>o.faces.some(f=>f.id===id));return [o,o.faces.find(f=>f.id===id)];};
for (const [id,g,v0,u,vv] of [['teak-corner',['tempered',0.010],2.4,0.5,0.45],['mdf-corner',['tempered',0.010],3.5,0.5,0.45],['ext-rim',['tempered',0.010],2.2,0.5,0.45],['stapler-corner',['tempered',0.010],9,0.5,0.45],['stapler-corner',['tempered',0.010],9,0.06,0.45],['ext-rim',['tempered',0.010],2.0,0.06,0.45],['mug-rim',['annealed',0.006],9,0.5,0.45]]){
  const [o,f]=get(id); const hist={}; const t0=Date.now();
  for(let k=0;k<40;k++){ const glass={type:g[0],t:g[1],flaws:[]}; const hid=C.sampleGlassStrength(g[0]); const st={}; let n=0,broke=false;
    while(n<10 && !broke){ n++; if(st.destroyed){st.destroyed=false;} const r=C.simulateImpact({me:o.mass*o.feff,v0,spec:f,next:O.NEXT,objState:st,glass,hidden:hid,u,v:vv}); broke=r.glassBroken; }
    const key=broke?n:'none'; hist[key]=(hist[key]||0)+1; }
  console.log(id,g.join(''),'v',v0,'u',u,JSON.stringify(hist),(Date.now()-t0)+'ms');
}
