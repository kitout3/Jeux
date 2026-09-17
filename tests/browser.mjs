import {chromium,webkit} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
import {createGame,dispatch,chooseAI,validateSave} from '../engine.js';
const root=resolve('.'),key='quetes_anomalies_plateau_v1',errors=[];
const server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root+'/')&&path!==root)throw Error('path');const file=path===root?root+'/index.html':path;const body=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp'}[extname(file)]||'application/octet-stream'));res.end(body);}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(ok=>server.listen(4173,'127.0.0.1',ok));
await mkdir('qa',{recursive:true});
const fixture=(ai=false)=>createGame({players:[{hero:'chevalier',name:'Alice <b>X</b>',ai:false},{hero:'marchand',name:'Bob',ai}],pace:'short'},8);
try{
 for(const [browserType,label,viewport]of [[chromium,'desktop',{width:1440,height:1000}],[webkit,'mobile',{width:390,height:844}]]){
  const browser=await browserType.launch({headless:true}),context=await browser.newContext({viewport,acceptDownloads:true,isMobile:label==='mobile',hasTouch:label==='mobile'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(label+': '+e.message));
  await page.goto('http://127.0.0.1:4173/');await page.getByRole('button',{name:'Commencer l’aventure'}).waitFor();assert.ok(await page.locator('.map-preview').evaluate(i=>i.complete&&i.naturalWidth>0));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'setup overflow '+label);
  await page.screenshot({path:'qa/'+label+'-setup.png',fullPage:true});
  await page.getByRole('button',{name:'À plusieurs · même écran',exact:true}).click();await page.locator('#name-0').fill('Alice');await page.getByRole('button',{name:'Commencer l’aventure'}).click();await page.getByRole('button',{name:'Lancer le déplacement'}).waitFor();assert.equal(await page.locator('.space').count(),48);
  await page.getByRole('button',{name:'Règles',exact:true}).click();await page.getByText('Paramètres de cette adaptation',{exact:true}).waitFor();await page.getByRole('button',{name:'Fermer',exact:true}).click();
  const saved=fixture(false);await page.evaluate(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key,saved});await page.reload();await page.getByRole('button',{name:'Reprendre la partie'}).click();
  assert.ok((await page.locator('.player-name').first().textContent()).includes('Alice <b>X</b>'));assert.equal(await page.locator('.player-name b').count(),0);
  await page.getByRole('button',{name:'Lancer le déplacement'}).click();
  for(let i=0;i<20&&await page.locator('dialog[open]').count();i++){const d=page.locator('dialog');const a=d.locator('[data-action]:not([disabled])').first();if(await a.count())await a.click();else break;}
  assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('quetes_anomalies_plateau_v1')).turn.moved));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'game overflow '+label);
  await page.locator('[data-ui="tab"][data-tab="quests"]').click();assert.ok(await page.locator('.action-panel .action-card').count());
  await page.locator('[data-ui="tab"][data-tab="objectives"]').click();await page.getByRole('button',{name:'Acheter · 9 Or',exact:true}).click();
  await page.locator('[data-ui="tab"][data-tab="combat"]').click();const attack=page.locator('.action-panel [data-action*="attack"]:not([disabled])').first();if(await attack.count())await attack.click();
  for(let i=0;i<20&&await page.locator('dialog[open]').count();i++){const a=page.locator('dialog [data-action]:not([disabled])').first();if(await a.count())await a.click();else break;}
  await page.screenshot({path:'qa/'+label+'-actions.png',fullPage:true});
  const exportPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter',exact:true}).click();const download=await exportPromise;assert.ok(download.suggestedFilename().endsWith('.json'));
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);validateSave(before);
  await page.reload();await page.getByRole('button',{name:'Reprendre la partie'}).click();const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert.deepEqual(after,before);
  await page.getByRole('button',{name:/Terminer mon tour|Passer au joueur suivant/}).click();await page.getByRole('button',{name:'Je suis prêt'}).waitFor();await page.getByRole('button',{name:'Je suis prêt'}).click();
  if(label==='mobile'){await page.getByRole('button',{name:'Plateau',exact:true}).click();await page.getByRole('button',{name:'+ Zoom',exact:true}).click();assert.ok(await page.locator('.board-window').evaluate(w=>w.scrollWidth>w.clientWidth));}
  await page.screenshot({path:'qa/'+label+'-plateau.png',fullPage:true});
  await page.getByRole('button',{name:'Menu',exact:true}).click();await page.locator('#import-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":1}')});await page.getByRole('alert').filter({hasText:'Import impossible'}).waitFor();assert.ok(await page.getByRole('button',{name:'Reprendre la partie'}).count());
  let final=fixture(true);final.players[0].ai=true;while(!final.finished)final=dispatch(final,chooseAI(final));final.players[0].ai=false;await page.evaluate(({key,final})=>localStorage.setItem(key,JSON.stringify(final)),{key,final});await page.reload();await page.getByRole('button',{name:'Voir le classement',exact:true}).click();await page.getByRole('heading',{name:'Le royaume a choisi'}).waitFor();assert.equal(await page.locator('.result-rank').count(),2);
  await context.close();await browser.close();console.log(label+' : création, déplacement, cartes, objectif, combat, sauvegarde, export, tour suivant, import refusé et classement OK');
 }
 assert.deepEqual(errors,[]);console.log('Aucune erreur JavaScript.');
}finally{server.close();}
