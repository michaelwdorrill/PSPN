// Standalone PSPN repository build: Node built-ins only. Never reads league exports.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'public');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(dir,e.name)):[path.join(dir,e.name)]);
const forbidden=new Set(['human','humanCount','control','tier','tier0','xp','seed','vary','contract','staff','dev','aging','cap','potential','fid','sourceSchool','sourceUrls','privateEvidence','privateEditorialRules','favorite','leastFavorite','biasStrength','voice']);
function audit(o){if(!o||typeof o!=='object')return;for(const[k,v]of Object.entries(o)){assert(!forbidden.has(k),`Non-public field: ${k}`);audit(v);}}
const latest=read(path.join(root,'content/latest.json')),editions=list(path.join(root,'content/editions')).filter(f=>f.endsWith('.json')).map(file=>({file,data:read(file)}));
assert(editions.length,'No editions');fs.mkdirSync(out,{recursive:true});fs.cpSync(path.join(root,'web'),out,{recursive:true});
const shell=fs.readFileSync(path.join(root,'web/index.html'),'utf8'),archive={schema:1,editions:[]};let articles=0;
for(const {data}of editions){audit(data);assert.equal(data.editions.length,1);const e=data.editions[0],rel=`editions/season-${e.season}/week-${e.week}.json`,dest=path.join(out,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(data)+'\n');
 if(e.season===latest.season&&e.week===latest.week)fs.writeFileSync(path.join(out,'edition.json'),JSON.stringify(data)+'\n');
 archive.editions.push({season:e.season,week:e.week,title:`Season ${e.season} · Week ${e.week}`,file:rel,articles:e.articles.map(({id,title,type,author,teams,wordCount})=>({id,title,type,author,teams,wordCount}))});
 for(const a of e.articles){assert(/^[a-z0-9-]+$/.test(a.id));const target=path.join(out,`articles/s${e.season}/w${e.week}/${a.id}.html`);let html=shell.replace('<head>','<head><base href="../../../">').replace('<body>',`<body data-page="article" data-article="${escape(a.id)}" data-season="${e.season}" data-week="${e.week}">`).replace(/<title>.*?<\/title>/,`<title>${escape(a.title)} | PSPN</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(a.dek)}"><meta property="og:title" content="${escape(a.title)}"><meta property="og:description" content="${escape(a.dek)}"><meta property="og:type" content="article">`);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);articles++;}
}
assert(fs.existsSync(path.join(out,'edition.json')),'Latest edition is missing');archive.editions.sort((a,b)=>b.season-a.season||b.week-a.week);fs.writeFileSync(path.join(out,'archive.json'),JSON.stringify(archive,null,2)+'\n');fs.writeFileSync(path.join(out,'.nojekyll'),'');
const current=read(path.join(out,'edition.json')),e=current.editions[0];assert.equal(e.articles.filter(a=>a.type==='recap').length,e.stories.length);assert(e.articles.filter(a=>a.type==='recap').every(a=>a.wordCount>=1300),'Featured recaps must be complete');assert.equal(e.articles.filter(a=>a.type==='column').length,3);assert(e.articles.some(a=>a.type==='power'&&a.rankings.length===32));assert(e.articles.some(a=>a.type==='preview'&&a.matchups.length===e.nextGames.length));assert(e.articles.some(a=>a.type==='draft'));assert(e.predictions.every(g=>g.picks.length===5));
for(const {data}of editions){const str=JSON.stringify(data);for(const m of str.matchAll(/assets\/[a-zA-Z0-9/._-]+\.(?:svg|png|webp|jpg)/g))assert(fs.existsSync(path.join(out,m[0])),`Missing asset ${m[0]}`);}
assert(!fs.readFileSync(path.join(out,'news.js'),'utf8').includes('fetch(\'/'),'Paths must work below a Pages repository prefix');
const canon=read(path.join(root,'content/canon/characters.json')),schools=read(path.join(root,'content/canon/universities.json')).conferences.flatMap(c=>c.schools.map(s=>s.id));assert.equal(new Set(schools).size,136);assert(Object.values(canon.players).every(p=>schools.includes(p.university)&&p.nature));
console.log(JSON.stringify({ok:true,editions:archive.editions.length,articles,currentArticles:e.articles.length,characters:Object.keys(canon.players).length,output:'public'},null,2));
