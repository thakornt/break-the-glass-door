// CI guard: every inline script in the built page must parse.
const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync(process.argv[2] || 'index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) { console.error('no inline scripts found'); process.exit(1); }
scripts.forEach((s, i) => new vm.Script(s, { filename: `inline-${i}.js` }));
console.log(`OK  ${scripts.length} inline scripts parse`);
