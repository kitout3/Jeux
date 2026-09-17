import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,dispatch,random,active,score,statValue,targets,chooseAI,validateSave,exchangeAmounts} from '../engine.js';
import {HEROES,ANOMALIES} from '../data.js';
const game=(heroes=['chevalier','marchand'])=>createGame({players:heroes.map(hero=>({hero,name:hero,ai:false}))},12);
const ready=s=>{s.phase='act';s.turn.moved=true;return s;};
function pendingCard(s,filter,chooser=0){const id=ANOMALIES.find(filter).id;s.anomalyDeck=s.anomalyDeck.filter(x=>x!==id);s.anomalyDiscard=s.anomalyDiscard.filter(x=>x!==id);s.pending.push({kind:'anomaly',chooser,cards:[id]});return id;}
test('les dés couvrent 1 à 10 et les actions illégales ne mutent pas la partie',()=>{
 let s=game(),before=JSON.stringify(s),values=new Set();for(let i=0;i<1000;i++)values.add(random(s,10)+1);assert.deepEqual([...values].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10]);
 s=game();before=JSON.stringify(s);assert.throws(()=>dispatch(s,{type:'end'}));assert.equal(JSON.stringify(s),before);s=dispatch(s,{type:'move'});assert.ok(s.players[0].pos>=1&&s.players[0].pos<=10);assert.throws(()=>dispatch(s,{type:'move'}));
});
test('répartition valide et six personnages uniques',()=>{
 assert.throws(()=>createGame({players:[{hero:'chevalier'},{hero:'chevalier'}]}));
 assert.throws(()=>createGame({players:[{hero:'chevalier',stats:{force:2,endurance:2,agilite:2,perception:2,intelligence:2,sagesse:2}},{hero:'marchand'}]}));
 assert.equal(validateSave(game()).players.length,2);
});
test('objectif Or : neuf pièces pour trois PV, une seule fois',()=>{
 let s=game();s=dispatch(s,{type:'objective',id:'or'});assert.equal(s.players[0].res.or,1);assert.equal(s.players[0].vp,3);assert.equal(s.vault.or,9);assert.throws(()=>dispatch(s,{type:'objective',id:'or'}));
});
test('monopoles : quatre ressources, trois PV, aucun bonus en cas d’égalité',()=>{
 const s=game();s.players[0].res={or:11,cuivre:2,argent:3,obsidienne:1};s.players[1].res={or:10,cuivre:0,argent:0,obsidienne:0};
 assert.equal(score(s).find(p=>p.id===0).total,12);s.players[1].res.or=11;assert.equal(score(s).find(p=>p.id===0).total,9);
});
test('bonus de fin : chasse, charité, monopole, territoire, boss',()=>{
 const s=createGame({players:Object.keys(HEROES).map(hero=>({hero}))},1);
 s.players[0].hunts=3;s.players[1].charities=2;s.players[3].res.or=11;s.territories[1]={owner:4,level:1,altar:false};s.bosses=[{id:1,owner:5}];
 const rows=score(s);for(const [id,bonus] of [[0,3],[1,2],[3,1],[4,1],[5,1]])assert.equal(rows.find(r=>r.id===id).character,bonus);
});
test('le Marchand ouvre ses bourses et achète un territoire hors boss',()=>{
 let s=ready(game(['marchand','chevalier']));s=dispatch(s,{type:'skill'});assert.equal(s.players[0].res.or,14);assert.equal(s.players[0].purses,0);assert.throws(()=>dispatch(s,{type:'skill'}));
 s=dispatch(s,{type:'buy',id:1});assert.equal(s.territories[1].owner,0);assert.equal(s.turn.attacks,1);assert.equal(s.players[0].res.or,11);assert.throws(()=>dispatch(s,{type:'buy',id:3}));
});
test('autel : +1 niveau et impossibilité de conquérir ou acheter',()=>{
 let s=ready(game());s.territories[1]={owner:0,level:1,altar:false};s=dispatch(s,{type:'skill',id:1});assert.equal(s.territories[1].level,2);assert.equal(s.territories[1].altar,true);
 s=dispatch(s,{type:'end'});s=ready(s);assert.throws(()=>dispatch(s,{type:'buy',id:1}));assert.throws(()=>dispatch(s,{type:'attack',kind:'territory',id:1}));
});
test('le Chevalier reçoit le bonus contre un territoire neutre',()=>{
 let s=ready(game());s=dispatch(s,{type:'attack',kind:'territory',id:1});assert.equal(s.lastRoll.bonus,1);
});
test('portée de l’Arbalétrier et absence de contre-attaque à distance',()=>{
 let s=ready(game(['arbaletrier','chevalier']));assert.ok(targets(s).some(t=>t.id===13));assert.ok(targets(s).some(t=>t.id===37));assert.ok(!targets(s).some(t=>t.id===25));s.players[0].hp=6;s.rng=1;s=dispatch(s,{type:'attack',kind:'territory',id:18});assert.equal(s.players[0].hp,6);
 const other=ready(game());assert.ok(!targets(other).some(t=>t.id===13));
});
test('fureur : deux dés, critique rechargeant la potion',()=>{
 let s=ready(game(['hommebete','chevalier']));s=dispatch(s,{type:'skill'});assert.throws(()=>dispatch(s,{type:'skill'}));s=dispatch(s,{type:'attack',kind:'territory',id:1});assert.equal(s.lastRoll.dice.length,2);
 for(let seed=0;seed<100;seed++){let g=ready(game(['hommebete','chevalier']));g.rng=seed;g.players[0].potion=false;g=dispatch(g,{type:'attack',kind:'territory',id:1});if(g.lastRoll.critical){assert.equal(g.players[0].potion,true);return;}}assert.fail('critique non couvert');
});
test('l’Homme-Bête ne peut retenter que la même cible',()=>{
 for(let seed=0;seed<100;seed++){let s=ready(game(['hommebete','chevalier']));s.rng=seed;s=dispatch(s,{type:'attack',kind:'territory',id:6});if(s.turn.retry){assert.throws(()=>dispatch(s,{type:'attack',kind:'territory',id:1}));s=dispatch(s,{type:'attack',kind:'territory',id:6});assert.equal(s.turn.attacks,2);return;}}assert.fail('relance non couverte');
});
test('l’Hérétique inverse les effets et choisit la statistique contre un point de vie',()=>{
 let s=ready(game(['heretique','chevalier']));s.players[0].effects=[{stat:'force',sign:1},{stat:'agilite',sign:-1}];assert.equal(statValue(s.players[0],'force'),s.players[0].stats.force-1);assert.equal(statValue(s.players[0],'agilite'),s.players[0].stats.agilite+1);
 s=dispatch(s,{type:'attack',kind:'territory',id:1,stat:'intelligence'});assert.equal(s.lastRoll.stat,'intelligence');assert.ok(s.players[0].hp<=7);
});
test('bénédiction du Vicaire : transfert limité et pioche supplémentaire',()=>{
 let s=game(['vicaire','chevalier']);s.players[1].res.or=2;s=dispatch(s,{type:'skill',id:1});assert.equal(s.players[0].res.or,12);assert.equal(s.players[1].res.or,0);assert.equal(s.players[1].effects.length,1);assert.equal(s.pending[0].chooser,0);assert.equal(s.pending[0].kind,'anomaly');
});
test('mort : dernier camp, pénalité, service gratuit et fin immédiate du tour',()=>{
 let s=ready(game());s.players[0].camp=12;s.players[0].pos=15;s.players[0].hp=2;s.players[0].vp=3;const id=pendingCard(s,c=>c.effect==='health'&&c.sign<0&&c.target==='self');s=dispatch(s,{type:'anomaly',id});assert.equal(s.phase,'done');assert.equal(s.players[0].pos,12);assert.equal(s.players[0].vp,2);assert.equal(s.vault.vp,1);assert.equal(s.pending[0].kind,'death');s=dispatch(s,{type:'revive',power:'heal'});assert.equal(s.players[0].hp,9);assert.throws(()=>dispatch(s,{type:'skill'}));s=dispatch(s,{type:'end'});assert.equal(s.current,1);
});
test('critique de déplacement : ressources récupérées, PV laissés en coffre',()=>{
 let s=game();s.vault={or:3,cuivre:2,argent:1,obsidienne:1,vp:4};for(let seed=0;seed<10000;seed++){const g=structuredClone(s);g.rng=seed;if(random(g,10)===9){s.rng=seed;break;}}s=dispatch(s,{type:'move'});assert.equal(s.moveDie,10);assert.equal(s.vault.vp,4);assert.equal(s.vault.or,0);assert.equal(s.players[0].res.or,13);
});
test('piège traversé : interruption avant destination en cas de mort',()=>{
 let s=game(['chevalier','arbaletrier']);s.players[0].hp=2;s.traps=[{pos:1,owner:1}];s=dispatch(s,{type:'move'});assert.equal(s.phase,'done');assert.equal(s.players[0].pos,0);assert.equal(s.traps.length,0);
});
test('échanges : valeur conservée et limite par tour',()=>{
 assert.deepEqual(exchangeAmounts('cuivre','argent'),{give:3,take:2});let s=game();s.players[0].res.cuivre=3;s.players[1].res.argent=2;s=dispatch(s,{type:'exchange',id:1,give:'cuivre',take:'argent'});assert.equal(s.players[0].res.argent,2);assert.equal(s.players[1].res.cuivre,3);assert.throws(()=>dispatch(s,{type:'exchange',id:1,give:'or',take:'cuivre'}));
});
test('Altération : un choix par joueur et extension à tous contre deux PV',()=>{
 let s=game();s.players[0].vp=7;s=dispatch(s,{type:'objective',id:'or'});assert.equal(s.pending[0].kind,'alteration');assert.equal(s.pending[0].cards.length,2);const id=s.pending[0].cards[0];s=dispatch(s,{type:'anomaly',id,global:true});assert.equal(s.vault.vp,2);assert.equal(s.pending[0].chooser,1);assert.equal(s.pending[0].cards.length,1);
});
test('sauvegarde : refus des cartes dupliquées, noms excessifs et états incomplets',()=>{
 const s=game();assert.deepEqual(validateSave(s),s);const bad=structuredClone(s);bad.players[0].name='x'.repeat(29);assert.throws(()=>validateSave(bad));const badDeck=structuredClone(s);badDeck.questDeck[0]=badDeck.questDeck[1];assert.throws(()=>validateSave(badDeck));assert.throws(()=>validateSave({version:1}));const badRoll=structuredClone(s);badRoll.lastRoll={dice:'bad'};assert.throws(()=>validateSave(badRoll));
});
test('parties complètes reproductibles de deux à six personnages',()=>{
 for(let seed=1;seed<=15;seed++){let s=createGame({players:Object.keys(HEROES).slice(0,seed%5+2).map(hero=>({hero,name:hero,ai:true}))},seed),steps=0;while(!s.finished&&steps<3000){const old=JSON.stringify(s);s=dispatch(s,chooseAI(s));assert.notEqual(JSON.stringify(s),old);validateSave(s);steps++;}assert.ok(s.finished,'partie non terminée, graine '+seed);const final=score(s);assert.ok(final.every(r=>Number.isInteger(r.total)&&r.total>=0));assert.throws(()=>dispatch(s,{type:'move'}));}
});
