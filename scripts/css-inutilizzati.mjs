// Toglie dai CSS le regole i cui selettori usano classi che non compaiono in nessun file sorgente.
// Uso: node scripts/css-inutilizzati.mjs --dry (solo misura) oppure senza opzioni (riscrive i file). Intervento 18 del 17/11/2026.
import fs from 'node:fs';import path from 'node:path';import postcss from 'postcss';
const DRY=process.argv.includes('--dry');
const files=['src/app/globals.css','src/components/home/tre-momenti.css','src/components/sezioni/sezioni.css','src/components/wow/wow.css','src/components/sezioni/carta.css'];
function walk(d,o=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(/\.(tsx?|mjs|cjs|js|md|mdx|json)$/.test(f))o.push(p)}return o}
const corpus=walk('src').map(f=>fs.readFileSync(f,'utf8')).join('\n');
const lits=[...corpus.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g)].map(m=>m[1]||m[2]||m[3]||"").join("\n");const tokens=new Set(lits.match(/[A-Za-z0-9_-]+/g));
// prefissi dinamici: `foo-${x}` oppure "foo-" + x
const prefixes=new Set();
for(const m of corpus.matchAll(/([A-Za-z][A-Za-z0-9_-]*-)\$\{/g))prefixes.add(m[1]);
for(const m of corpus.matchAll(/([A-Za-z][A-Za-z0-9_-]*-)["'`]\s*\+/g))prefixes.add(m[1]);
const isUsed=c=>tokens.has(c)||[...prefixes].some(p=>c.startsWith(p));
const dead=new Set();let before=0,after=0;
for(const f of files){
  const src=fs.readFileSync(f,'utf8');before+=src.length;
  const root=postcss.parse(src);
  root.walkRules(rule=>{
    if(rule.parent&&rule.parent.type==='atrule'&&/keyframes/.test(rule.parent.name))return;
    const keep=rule.selectors.filter(sel=>{
      const s=sel.replace(/:(not|where|is|has)\(([^()]|\([^()]*\))*\)/g,m=>m.startsWith(':not')?'':m);
      const cls=[...s.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)].map(m=>m[1].replace(/\\/g,''));
      const bad=cls.filter(c=>!isUsed(c));bad.forEach(c=>dead.add(c));
      return bad.length===0;
    });
    if(keep.length===0)rule.remove();else if(keep.length!==rule.selectors.length)rule.selectors=keep;
  });
  let ch=true;while(ch){ch=false;root.walk(n=>{if((n.type==='atrule'||n.type==='rule')&&n.nodes&&n.nodes.length===0&&!/^(import|layer)$/.test(n.name||'')){n.remove();ch=true}})}
  // keyframes non più citati
  const out0=root.toString();
  root.walkAtRules(/keyframes/,a=>{const n=a.params.trim();const re=new RegExp('animation[^;{}]*\\b'+n+'\\b');if(!re.test(out0)&&!files.some(g=>g!==f&&re.test(fs.readFileSync(g,'utf8')))&&!tokens.has(n)){a.remove()}});
  const out=root.toString();after+=out.length;
  console.log(f,src.length,'->',out.length);
  if(!DRY)fs.writeFileSync(f,out);
}
console.log('totale',before,'->',after,Math.round((1-after/before)*100)+'%','classi morte',dead.size);
fs.writeFileSync('/tmp/css-classi-morte.txt',[...dead].sort().join('\n'));
