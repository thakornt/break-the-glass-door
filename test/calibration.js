const C=require('../src/core.js'), O=require('../src/objects.js');
function run(me,v,spec,g,u=0.5,vv=0.45,N=150){let b=0,ex;for(let i=0;i<N;i++){const glass={type:g[0],t:g[1],flaws:[]};ex=C.simulateImpact({me,v0:v,spec,next:O.NEXT,objState:{},glass,hidden:C.sampleGlassStrength(g[0]),u,v:vv});if(ex.glassBroken)b++;}
 return `${(100*b/N).toFixed(0).padStart(3)}% F=${(ex.Fmax/1e3).toFixed(1)}kN σ=${(ex.sigMax/1e6).toFixed(0)} cone=${(ex.coneDepth*1e3).toFixed(2)}mm ct=${(ex.contactTime*1e3).toFixed(2)}ms ${ex.destroyed?'[obj broke]':''}${ex.switched?'[caster]':''}`;}
const ball={id:'ball',kind:'hertz',Eo:200e9,nuo:0.3,R:0.019,area:'sphere',pc:2e9,hard:true};
console.log('--- ECE R43 227g ball 2m');
for(const g of [['tempered',0.004],['tempered',0.005],['annealed',0.004],['annealed',0.006]]) console.log(g.join(''),run(0.227,Math.sqrt(2*9.81*2),ball,g,0.5,0.5));
console.log('--- EN12600');
for(const g of [['annealed',0.006],['tempered',0.008],['tempered',0.010]]) for(const h of [0.19,0.45,1.2]) console.log(g.join(''),h,run(50,Math.sqrt(2*9.81*h),O.EN12600,g,0.5,0.5));
console.log('--- office objects max swing, center');
for(const o of O.OBJECTS) for(const f of o.faces){ const v=O.vMaxFor(f.mass??o.mass,f); for(const g of [['annealed',0.006],['tempered',0.010]]) console.log(f.id.padEnd(16),g.join('').padEnd(12),'v='+v.toFixed(1),run((f.mass??o.mass)*(f.feff??o.feff),v,f,g)); }
