import {VERSION,STATS,RES,BOARD,BIOMES,HEROES,BOSSES,OBJECTIVES,QUESTS,ANOMALIES} from './data.js';
const keys=Object.keys(STATS),rs=Object.keys(RES),copy=x=>JSON.parse(JSON.stringify(x)),fail=m=>{throw Error(m)},empty=()=>Object.fromEntries(rs.map(k=>[k,0]));
export function random(s,n){s.rng=(Math.imul(1664525,s.rng)+1013904223)>>>0;return Math.floor(s.rng/4294967296*n);}
function shuffle(s,a){a=[...a];for(let i=a.length-1;i>0;i--){const j=random(s,i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function log(s,text,kind='info'){s.log.unshift({id:++s.serial,round:s.round,text,kind});s.log=s.log.slice(0,120);}
export const active=s=>s.players[s.current];
export const decisionPlayer=s=>s.players[s.pending[0]?.chooser??s.current];
export const totalVP=s=>s.players.reduce((n,p)=>n+p.vp,0);
export const statValue=(p,k)=>p.stats[k]+p.effects.filter(e=>e.stat===k).reduce((n,e)=>n+e.sign*(p.hero==='heretique'?-1:1),0);
export function reachable(s,p,b){const d=Math.abs(BOARD[p.pos].biome-b);return d===0||(p.hero==='arbaletrier'&&(d===1||d===3));}
function reset(s){s.turn={moved:false,attacks:0,retry:null,skill:false,fury:false,exchanges:0,location:false};s.phase='move';s.moveDie=null;s.lastRoll=null;}
export function createGame(config,seed=Date.now()){
 if(!Array.isArray(config.players)||config.players.length<2||config.players.length>6)fail('Choisissez entre 2 et 6 personnages.');
 if(new Set(config.players.map(p=>p.hero)).size!==config.players.length)fail('Chaque personnage doit être unique.');
 const s={version:VERSION,id:'partie-'+Date.now(),rng:seed>>>0,serial:0,current:0,round:1,phase:'move',players:[],territories:{},bosses:[],objectives:[],traps:[],vault:{...empty(),vp:0},pending:[],questDeck:[],questDiscard:[],anomalyDeck:[],anomalyDiscard:[],log:[],fresque:0,threshold:0,ending:false,finished:false,goal:config.players.length*(config.pace==='long'?15:config.pace==='short'?6:10),turn:{}};
 s.questDeck=shuffle(s,QUESTS.map(q=>q.id));s.anomalyDeck=shuffle(s,ANOMALIES.map(c=>c.id));
 s.players=config.players.map((p,id)=>{
  const h=HEROES[p.hero];if(!h)fail('Personnage inconnu.');
  const stats=p.stats||Object.fromEntries(keys.map((k,i)=>[k,h.stats[i]]));
  if(keys.map(k=>stats[k]).sort((a,b)=>a-b).join(',')!=='-2,-1,0,0,1,2')fail('Répartissez une fois −2, −1, 0, 0, +1 et +2.');
  return {id,name:String(p.name||'Joueur '+(id+1)).trim().slice(0,28)||'Joueur '+(id+1),hero:p.hero,ai:!!p.ai,hp:h.hp,maxHp:h.hp,pos:0,camp:0,stats:copy(stats),effects:[],res:{...empty(),or:10},vp:0,potion:true,skillLocked:false,purses:p.hero==='marchand'?1:0,quests:[],hunts:0,charities:0,kills:0,laps:0,towerTiers:[]};
 });
 for(const p of s.players){drawQuest(s,p);drawQuest(s,p);}reset(s);log(s,'Les portes de la Cité s’ouvrent. La partie commence.','good');return s;
}
function drawQuest(s,p){if(!s.questDeck.length){s.questDeck=shuffle(s,s.questDiscard);s.questDiscard=[];}if(s.questDeck.length)p.quests.push(s.questDeck.pop());else log(s,'Toutes les quêtes sont déjà entre les mains des joueurs.');}
function drawAnomaly(s){if(!s.anomalyDeck.length){s.anomalyDeck=shuffle(s,s.anomalyDiscard);s.anomalyDiscard=[];}return s.anomalyDeck.pop();}
function queueCard(s,id){const c=drawAnomaly(s);if(c!==undefined)s.pending.push({kind:'anomaly',chooser:id,cards:[c]});}
function award(s,p,n,reason){p.vp+=n;log(s,p.name+' : +'+n+' PV · '+reason,'good');}
function milestones(s){
 s.fresque=Math.max(s.fresque,totalVP(s));const t=Math.floor(s.fresque/10);
 while(s.threshold<t){s.threshold++;const cards=[];for(let i=0;i<s.players.length;i++){const c=drawAnomaly(s);if(c!==undefined)cards.push(c);}if(cards.length)s.pending.push({kind:'alteration',chooser:s.current,cards,remaining:s.players.map((_,i)=>(s.current+i)%s.players.length),level:s.threshold*10});log(s,'L’Altération s’éveille : palier '+s.threshold*10+'.','event');}
 if(s.fresque>=s.goal)s.ending=true;if(s.ending&&!s.pending.length){s.finished=true;s.phase='finished';log(s,'La fresque est achevée. Place au décompte final.','event');}
}
function transfer(s,from,to){const r=rs.filter(k=>from.res[k]>0);if(r.length){const k=r[random(s,r.length)];from.res[k]--;to.res[k]++;log(s,to.name+' prend 1 '+RES[k].name+' à '+from.name+'.');}}
function damage(s,p,n,killer=null){
 const lost=Math.min(p.hp,Math.max(0,n));p.hp-=lost;if(lost&&killer&&killer.id!==p.id)transfer(s,p,killer);
 if(p.hp===0){
  if(killer&&killer.id!==p.id){const terr=Object.entries(s.territories).find(([,t])=>t.owner===p.id);if(terr){terr[1].owner=killer.id;log(s,killer.name+' reçoit '+BOARD[+terr[0]].name+' après l’élimination.','good');}if(killer.hero==='heretique'&&p.vp>0){p.vp--;killer.vp++;log(s,killer.name+' vole 1 PV supplémentaire.');}killer.kills++;}
  const cost=Math.min(1,p.vp);p.vp-=cost;s.vault.vp+=cost;p.pos=p.camp;p.hp=Math.ceil(p.maxHp/2);s.pending.push({kind:'death',chooser:p.id});
  if(p.id===s.current){s.phase='done';s.turn.attacks=2;s.turn.retry=null;}
  log(s,p.name+' tombe au combat : retour au dernier campement'+(cost?', 1 PV placé dans la chambre forte.':'.'),'bad');
 }return lost;
}
function status(s,p,sign){const stat=keys[random(s,6)];p.effects.push({stat,sign});log(s,(sign>0?'Bénédiction':'Malédiction')+' : '+p.name+', '+STATS[stat]+(sign>0?' +1':' −1')+(p.hero==='heretique'?' (effet inversé)':''),sign>0?'good':'bad');if(sign>0)for(const v of s.players.filter(x=>x.hero==='vicaire'))queueCard(s,v.id);}
function camp(s,p,power){
 if(power==='heal')p.hp=Math.min(p.maxHp,p.hp+4);else if(power==='potion')p.potion=true;else if(power==='cleanse')p.effects=p.effects.filter(e=>e.sign*(p.hero==='heretique'?-1:1)>0);else if(power==='skill')p.skillLocked=false;else fail('Pouvoir inconnu.');
 log(s,p.name+' utilise le campement : '+({heal:'soin +4',potion:'potion rechargée',cleanse:'effets négatifs dissipés',skill:'compétence rechargée'}[power])+'.','good');
}
function passStart(s,p){p.laps++;award(s,p,1,'passage au Départ');p.skillLocked=false;if(p.hero==='marchand')p.purses++;let n=0;for(const [id,t]of Object.entries(s.territories))if(t.owner===p.id){p.res[BIOMES[BOARD[+id].biome].resource]+=t.level;n+=t.level;}if(n)log(s,p.name+' récolte '+n+' ressources de ses territoires.','good');}
function move(s){
 if(s.phase!=='move'||s.turn.moved)fail('Déplacement déjà effectué.');const p=active(s),die=random(s,10)+1;s.moveDie=die;s.turn.moved=true;s.phase='act';log(s,p.name+' lance le D10 : '+die+'.');
 if(die===10){const gain=[];for(const k of rs){if(s.vault[k])gain.push(s.vault[k]+' '+RES[k].name);p.res[k]+=s.vault[k];s.vault[k]=0;}log(s,'Critique ! '+(gain.length?'Chambre forte : '+gain.join(', ')+'.':'La réserve de ressources est vide.'),'good');}
 for(let i=0;i<die;i++){p.pos=(p.pos+1)%48;if(p.pos===0)passStart(s,p);if(['start','camp'].includes(BOARD[p.pos].type))p.camp=p.pos;const trap=s.traps.find(t=>t.pos===p.pos&&t.owner!==p.id);if(trap){s.traps=s.traps.filter(t=>t!==trap);log(s,p.name+' traverse un piège : 3 dégâts.','bad');damage(s,p,3,s.players[trap.owner]);if(s.phase==='done')return;}}
 const tile=BOARD[p.pos];log(s,p.name+' arrive : '+tile.name+' · '+BIOMES[tile.biome].short+'.');
 if(tile.type==='anomaly')queueCard(s,p.id);if(tile.type==='quest'){drawQuest(s,p);log(s,p.name+' reçoit une quête.');}if(tile.type==='resource'){const k=BIOMES[tile.biome].resource,n=k==='or'?3:k==='cuivre'?2:1;p.res[k]+=n;log(s,p.name+' récolte '+n+' '+RES[k].name+'.','good');}
}
function info(s,kind,id,p=active(s)){
 if(kind==='territory'){const b=BOARD[id],t=s.territories[id];if(!b||b.type!=='territory')fail('Territoire invalide.');if(t?.altar&&t.owner!==p.id)fail('Territoire protégé par un autel.');return {kind,id:+id,name:b.name,biome:b.biome,difficulty:b.difficulty+(t?.level||1)-1,neutral:!t,owned:t?.owner===p.id};}
 if(kind==='hunt'){const q=QUESTS.find(q=>q.id===id&&q.type==='hunt');if(!q||!p.quests.includes(id))fail('Quête indisponible.');return {...q,kind,name:q.title};}
 if(kind==='boss'){const b=BOSSES.find(b=>b.id===+id);if(!b||s.bosses.some(x=>x.id===b.id))fail('Boss indisponible.');if(Object.entries(s.territories).filter(([id,t])=>t.owner===p.id&&BOARD[+id].biome===b.biome).length<2)fail('Deux territoires du biome sont requis.');return {...b,kind};}
 if(kind==='player'){const target=s.players[id];if(!target||target.id===p.id)fail('Adversaire invalide.');return {kind,id:target.id,name:target.name,biome:BOARD[target.pos].biome};}fail('Cible inconnue.');
}
function validateAttack(s,kind,id){const p=active(s),t=info(s,kind,id);if(s.phase!=='act')fail('Déplacez-vous avant d’attaquer.');if(s.turn.attacks&&!(s.turn.retry&&s.turn.retry.kind===kind&&String(s.turn.retry.id)===String(id)))fail('Attaque déjà utilisée.');if(!reachable(s,p,t.biome))fail('Cible hors de portée.');return t;}
function attack(s,a){
 const p=active(s),t=validateAttack(s,a.kind,a.id);let stat;if(a.stat){if(p.hero!=='heretique'||!keys.includes(a.stat)||p.hp<=1)fail('Choix de statistique indisponible.');p.hp--;stat=a.stat;}else stat=keys[random(s,6)];
 const dice=[random(s,10)+1];if(s.turn.fury){dice.push(random(s,10)+1);s.turn.fury=false;}
 const modifier=statValue(p,stat),bonus=p.hero==='chevalier'&&t.neutral?1:0,total=dice.reduce((a,b)=>a+b,0)+modifier+bonus,critical=dice.includes(10),ranged=BOARD[p.pos].biome!==t.biome;let targetTotal=t.difficulty,defenderDie=null;
 if(a.kind==='player'){defenderDie=random(s,10)+1;targetTotal=defenderDie+statValue(s.players[t.id],stat);}
 const win=a.kind==='player'?total>targetTotal:total>=targetTotal;s.turn.attacks++;s.turn.retry=null;if(p.hero==='hommebete'&&critical)p.potion=true;
 s.lastRoll={dice,stat,modifier,bonus,total,targetTotal,defenderDie,win,critical,target:t.name};
 log(s,p.name+' attaque '+t.name+' : '+dice.join(' + ')+' '+(modifier>=0?'+':'')+modifier+(bonus?' +1':'')+' ('+STATS[stat]+') = '+total+', contre '+targetTotal+'. '+(win?'Réussite.':'Échec.'),win?'good':'bad');
 if(win){
  if(a.kind==='territory'){const owned=s.territories[t.id];if(!owned){s.territories[t.id]={owner:p.id,level:1,altar:false};p.res[BIOMES[t.biome].resource]++;award(s,p,1,'conquête');}else if(owned.owner===p.id){owned.level++;log(s,t.name+' passe au niveau '+owned.level+'.','good');}else if(critical||p.hero==='chevalier'){owned.owner=p.id;log(s,p.name+' conquiert '+t.name+'.','good');}else{transfer(s,s.players[owned.owner],p);log(s,'Territoire pillé. Un critique est nécessaire pour le capturer.');}}
  if(a.kind==='hunt'){p.quests=p.quests.filter(id=>id!==t.id);s.questDiscard.push(t.id);p.hunts++;award(s,p,t.reward,'quête de chasse');}
  if(a.kind==='boss'){s.bosses.push({id:t.id,owner:p.id});award(s,p,t.reward,t.name);}
  if(a.kind==='player')damage(s,s.players[t.id],total-targetTotal,p);
 }else{if(!ranged){if(a.kind==='player'){if(total<targetTotal)damage(s,p,1,s.players[t.id]);}else damage(s,p,targetTotal-total);}if(p.hero==='hommebete'&&s.turn.attacks===1&&s.phase!=='done')s.turn.retry={kind:a.kind,id:t.id};}
}
function buy(s,id){const p=active(s);if(p.hero!=='marchand')fail('Seul le Marchand peut acheter.');const t=validateAttack(s,'territory',id);if(t.owned||p.res.or<t.difficulty)fail('Achat indisponible.');p.res.or-=t.difficulty;s.vault.or+=t.difficulty;s.turn.attacks++;s.turn.retry=null;if(s.territories[t.id])s.territories[t.id].owner=p.id;else{s.territories[t.id]={owner:p.id,level:1,altar:false};award(s,p,1,'achat d’un territoire');p.res[BIOMES[t.biome].resource]++;}log(s,p.name+' achète '+t.name+' pour '+t.difficulty+' Or.','good');}
function skill(s,a){
 const p=active(s);if(p.hero==='marchand'){if(!p.purses)fail('Aucune bourse disponible.');p.purses--;p.res.or+=4;log(s,p.name+' ouvre une bourse : +4 Or.','good');return;}
 if(s.turn.skill||p.skillLocked)fail('Compétence indisponible.');
 if(p.hero==='arbaletrier'){if(s.traps.some(t=>t.pos===p.pos))fail('Un piège occupe déjà cette case.');s.traps.push({pos:p.pos,owner:p.id});log(s,p.name+' pose un piège sur la case '+(p.pos+1)+'.');}
 else if(p.hero==='chevalier'){const t=s.territories[a.id];if(!t||t.owner!==p.id||t.altar)fail('Choisissez un territoire possédé sans autel.');t.level++;t.altar=true;log(s,p.name+' érige un autel sur '+BOARD[a.id].name+'.','good');}
 else if(p.hero==='hommebete'){if(s.turn.attacks&&!s.turn.retry)fail('Attaque déjà utilisée.');s.turn.fury=true;log(s,p.name+' entre en fureur : deux D10 à sa prochaine attaque.','good');}
 else{const t=s.players[a.id];if(!t)fail('Cible invalide.');if(p.hero==='vicaire'){if(t.id!==p.id){const n=Math.min(4,t.res.or);t.res.or-=n;p.res.or+=n;}status(s,t,1);}else{if(t.id===p.id)fail('Choisissez un adversaire.');status(s,t,-1);const n=damage(s,t,3,p);p.hp=Math.min(p.maxHp,p.hp+n);log(s,p.name+' vole '+n+' points de vie à '+t.name+'.','bad');}}
 s.turn.skill=true;
}
function charity(s,id){const p=active(s),q=QUESTS.find(q=>q.id===id&&q.type==='charity');if(!q||!p.quests.includes(id)||p.res[q.resource]<q.amount)fail('Quête de charité indisponible.');p.res[q.resource]-=q.amount;s.vault[q.resource]+=q.amount;p.quests=p.quests.filter(x=>x!==id);s.questDiscard.push(id);p.charities++;award(s,p,q.reward,'quête de charité');}
function objective(s,id){const p=active(s),o=OBJECTIVES.find(o=>o.id===id);if(!o||s.objectives.includes(id)||p.res[id]<o.cost)fail('Objectif indisponible.');p.res[id]-=o.cost;s.vault[id]+=o.cost;s.objectives.push(id);award(s,p,3,'objectif '+RES[id].name);}
export function exchangeAmounts(give,take){if(!RES[give]||!RES[take]||give===take)fail('Choisissez deux ressources différentes.');const gcd=(a,b)=>b?gcd(b,a%b):a,g=gcd(RES[give].value,RES[take].value);return {give:RES[take].value/g,take:RES[give].value/g};}
function exchange(s,a){const p=active(s),t=s.players[a.id],n=exchangeAmounts(a.give,a.take);if(!t||t.id===p.id||s.turn.exchanges>=(p.hero==='marchand'?2:1)||p.res[a.give]<n.give||t.res[a.take]<n.take)fail('Échange indisponible : vérifiez les réserves et la limite par tour.');p.res[a.give]-=n.give;t.res[a.give]+=n.give;t.res[a.take]-=n.take;p.res[a.take]+=n.take;s.turn.exchanges++;log(s,p.name+' échange '+n.give+' '+RES[a.give].name+' contre '+n.take+' '+RES[a.take].name+' avec '+t.name+'.');}
function anomaly(s,a){
 const d=s.pending[0],p=s.players[d.chooser];if(!d.cards.includes(a.id))fail('Cette carte n’est pas proposée.');const c=ANOMALIES[a.id];
 if(a.global&&(d.kind!=='alteration'||p.vp<2))fail('L’extension à tous coûte 2 PV.');if(a.target!==undefined&&(p.hero!=='vicaire'||!s.players[a.target]))fail('Redirection indisponible.');
 let targets=[s.players[(p.id+(c.target==='next'?1:c.target==='previous'?s.players.length-1:0))%s.players.length]];
 if(a.target!==undefined)targets=[s.players[a.target]];if(a.global){p.vp-=2;s.vault.vp+=2;targets=[...s.players];}
 s.anomalyDiscard.push(c.id);if(d.kind==='alteration'){d.cards=d.cards.filter(id=>id!==a.id);d.remaining.shift();if(d.remaining.length&&d.cards.length)d.chooser=d.remaining[0];else s.pending.shift();}else s.pending.shift();
 for(const t of targets){log(s,c.title+' → '+t.name+'.',c.sign>0?'good':'bad');if(c.effect==='resource'){if(c.amount>0)t.res[c.resource]+=c.amount;else{const n=Math.min(t.res[c.resource],-c.amount);t.res[c.resource]-=n;s.vault[c.resource]+=n;}}if(c.effect==='health'){if(c.amount>0)t.hp=Math.min(t.maxHp,t.hp+c.amount);else damage(s,t,-c.amount);}if(c.effect==='skill')t.skillLocked=c.sign<0;if(c.effect==='potion')t.potion=c.sign>0;if(c.effect==='status')status(s,t,c.sign);}
}
export function dispatch(state,a){
 const s=copy(state);if(s.finished)fail('La partie est terminée.');
 if(s.pending.length){const d=s.pending[0];if(d.kind==='death'&&a.type==='revive'){camp(s,s.players[d.chooser],a.power);s.pending.shift();}else if(d.kind!=='death'&&a.type==='anomaly')anomaly(s,a);else fail('Résolvez d’abord l’événement.');milestones(s);return s;}
 if(s.phase==='done'&&a.type!=='end')fail('Le tour est terminé.');
 if(a.type==='move')move(s);
 else if(a.type==='end'){if(!s.turn.moved&&s.phase!=='done')fail('Lancez d’abord le déplacement.');s.current=(s.current+1)%s.players.length;if(!s.current)s.round++;reset(s);log(s,'Au tour de '+active(s).name+'.');}
 else{
  if(!['move','act'].includes(s.phase))fail('Action indisponible.');const p=active(s),tile=BOARD[p.pos];
  switch(a.type){
   case 'attack':attack(s,a);break;case 'buy':buy(s,a.id);break;case 'skill':skill(s,a);break;case 'charity':charity(s,a.id);break;case 'objective':objective(s,a.id);break;case 'exchange':exchange(s,a);break;
   case 'potion':if(!p.potion||p.hp===p.maxHp)fail('Potion indisponible ou santé maximale.');p.potion=false;p.hp=Math.min(p.maxHp,p.hp+4);log(s,p.name+' boit une potion : +4 vie.','good');break;
   case 'camp':if(s.phase!=='act'||!['start','camp'].includes(tile.type)||s.turn.location||p.res.or<2)fail('Un service par arrivée au camp, pour 2 Or.');camp(s,p,a.power);p.res.or-=2;s.vault.or+=2;s.turn.location=true;break;
   case 'obelisk':if(s.phase!=='act'||tile.type!=='obelisk'||s.turn.location||p.res.or<2)fail('Obélisque indisponible.');p.res.or-=2;s.vault.or+=2;p.skillLocked=false;s.turn.location=true;log(s,p.name+' recharge sa compétence à l’obélisque.');break;
   case 'tower':{const n=Number(a.tier);if(s.phase!=='act'||tile.type!=='tower'||s.turn.location||![1,2,3].includes(n)||p.towerTiers.includes(n)||p.res.or<n*2)fail('Don à la tour indisponible.');p.res.or-=n*2;s.vault.or+=n*2;p.towerTiers.push(n);p.charities++;s.turn.location=true;award(s,p,n===1?0:1,'tour de garde');break;}
   default:fail('Action inconnue.');
  }
 }milestones(s);return s;
}
export function targets(s){const result=[];const tryAdd=(kind,id)=>{try{result.push(validateAttack(s,kind,id));}catch{}};for(const b of BOARD.filter(t=>t.type==='territory'))tryAdd('territory',b.id);for(const q of active(s).quests)tryAdd('hunt',q);for(const b of BOSSES)tryAdd('boss',b.id);for(const p of s.players)tryAdd('player',p.id);return result;}
export function score(s){
 const rows=s.players.map(p=>({id:p.id,name:p.name,hero:p.hero,base:p.vp,monopolies:[],character:0,total:p.vp}));
 for(const r of rs){const max=Math.max(...s.players.map(p=>p.res[r])),leaders=s.players.filter(p=>p.res[r]===max);if(max>0&&leaders.length===1){rows[leaders[0].id].monopolies.push(r);rows[leaders[0].id].total+=3;}}
 for(const r of rows){const p=s.players[r.id];r.character=p.hero==='chevalier'?Object.values(s.territories).filter(t=>t.owner===p.id).length:p.hero==='arbaletrier'?p.hunts:p.hero==='vicaire'?p.charities:p.hero==='marchand'?r.monopolies.length:p.hero==='hommebete'?s.bosses.filter(b=>b.owner===p.id).length:0;r.total+=r.character;}return rows.sort((a,b)=>b.total-a.total);
}
export function chooseAI(s){
 if(s.finished)return null;const p=decisionPlayer(s),d=s.pending[0];
 if(d){if(d.kind==='death')return {type:'revive',power:p.hp<p.maxHp?'heal':'potion'};const value=id=>{const c=ANOMALIES[id],target=(p.id+(c.target==='next'?1:c.target==='previous'?s.players.length-1:0))%s.players.length;return c.sign*(target===p.id?2:-1);};const id=[...d.cards].sort((a,b)=>value(b)-value(a))[0],c=ANOMALIES[id];return {type:'anomaly',id,...(p.hero==='vicaire'?{target:c.sign>0?p.id:s.players.find(x=>x.id!==p.id).id}:{})};}
 if(s.phase==='done')return {type:'end'};if(p.hp<=p.maxHp-4&&p.potion)return {type:'potion'};if(p.purses)return {type:'skill'};
 for(const id of p.quests){const q=QUESTS.find(q=>q.id===id);if(q.type==='charity'&&p.res[q.resource]>=q.amount)return {type:'charity',id};}for(const o of OBJECTIVES)if(!s.objectives.includes(o.id)&&p.res[o.id]>=o.cost)return {type:'objective',id:o.id};
 if(s.phase==='move')return {type:'move'};
 if(!s.turn.skill&&!p.skillLocked){if(p.hero==='hommebete'&&(!s.turn.attacks||s.turn.retry))return {type:'skill'};if(p.hero==='chevalier'){const t=Object.entries(s.territories).find(([,t])=>t.owner===p.id&&!t.altar);if(t)return {type:'skill',id:+t[0]};}if(p.hero==='arbaletrier'&&!s.traps.some(t=>t.pos===p.pos))return {type:'skill'};if(p.hero==='vicaire')return {type:'skill',id:p.id};if(p.hero==='heretique')return {type:'skill',id:s.players.filter(x=>x.id!==p.id).sort((a,b)=>a.hp-b.hp)[0].id};}
 if(['camp','start'].includes(BOARD[p.pos].type)&&!s.turn.location&&p.res.or>=2&&(p.hp<=p.maxHp-3||!p.potion))return {type:'camp',power:p.hp<=p.maxHp-3?'heal':'potion'};
 const ts=targets(s).filter(t=>t.kind!=='player');if(ts.length){const value=t=>(t.kind==='hunt'?10+t.reward*2:t.kind==='boss'?6+t.reward*2:t.neutral?12:t.owned?1:3)-t.difficulty;ts.sort((a,b)=>value(b)-value(a));const t=ts[0];if(p.hero==='marchand'&&t.kind==='territory'&&!t.owned&&p.res.or>=t.difficulty)return {type:'buy',id:t.id};return {type:'attack',kind:t.kind,id:t.id,...(p.hero==='heretique'&&p.hp>4?{stat:keys.reduce((b,k)=>statValue(p,k)>statValue(p,b)?k:b,keys[0])}:{})};}
 return {type:'end'};
}
export function validateSave(input){
 if(!input||typeof input!=='object')fail('Sauvegarde invalide.');const s=copy(input),int=(n,min=0,max=100000)=>Number.isInteger(n)&&n>=min&&n<=max,err=()=>fail('Sauvegarde incompatible ou endommagée.');
 if(s.version!==VERSION||!Array.isArray(s.players)||s.players.length<2||s.players.length>6||!int(s.current,0,s.players.length-1)||!int(s.rng,0,4294967295)||!int(s.round,1)||!int(s.goal,1)||!int(s.fresque)||!int(s.threshold)||!int(s.serial)||!['move','act','done','finished'].includes(s.phase))err();
 if(new Set(s.players.map(p=>p.hero)).size!==s.players.length)err();
 for(const [i,p]of s.players.entries()){
  if(!p||p.id!==i||!HEROES[p.hero]||typeof p.name!=='string'||!p.name.trim()||p.name.length>28||typeof p.ai!=='boolean'||p.maxHp!==HEROES[p.hero].hp||!int(p.hp,1,p.maxHp)||!int(p.pos,0,47)||!int(p.camp,0,47)||!['camp','start'].includes(BOARD[p.camp].type))err();
  if(!p.stats||keys.map(k=>p.stats[k]).sort((a,b)=>a-b).join(',')!=='-2,-1,0,0,1,2'||!p.res||rs.some(k=>!int(p.res[k])))err();
  for(const k of ['vp','purses','hunts','charities','kills','laps'])if(!int(p[k]))err();for(const k of ['potion','skillLocked'])if(typeof p[k]!=='boolean')err();
  if(!Array.isArray(p.effects)||p.effects.length>500||p.effects.some(e=>!keys.includes(e.stat)||![1,-1].includes(e.sign))||!Array.isArray(p.quests)||p.quests.some(id=>!QUESTS.some(q=>q.id===id))||!Array.isArray(p.towerTiers)||p.towerTiers.some(n=>![1,2,3].includes(n)))err();
 }
 for(const k of ['questDeck','questDiscard','anomalyDeck','anomalyDiscard','log','pending','traps','bosses','objectives'])if(!Array.isArray(s[k])||s[k].length>500)err();
 if(!s.territories||typeof s.territories!=='object'||Array.isArray(s.territories)||!s.vault||[...rs,'vp'].some(k=>!int(s.vault[k])))err();
 for(const [id,t]of Object.entries(s.territories))if(BOARD[+id]?.type!=='territory'||!int(t.owner,0,s.players.length-1)||!int(t.level,1)||typeof t.altar!=='boolean')err();
 for(const d of s.pending){if(!['death','anomaly','alteration'].includes(d.kind)||!int(d.chooser,0,s.players.length-1))err();if(d.kind!=='death'&&(!Array.isArray(d.cards)||!d.cards.length||d.cards.some(id=>!int(id,0,47))))err();if(d.kind==='alteration'&&(!Array.isArray(d.remaining)||!d.remaining.length||d.remaining[0]!==d.chooser||d.remaining.some(id=>!int(id,0,s.players.length-1))||!int(d.level,1)))err();}
 for(const id of [...s.questDeck,...s.questDiscard])if(!QUESTS.some(q=>q.id===id))err();
 for(const id of [...s.anomalyDeck,...s.anomalyDiscard])if(!int(id,0,47))err();
 const qIds=[...s.questDeck,...s.questDiscard,...s.players.flatMap(p=>p.quests)];if(qIds.length!==QUESTS.length||new Set(qIds).size!==QUESTS.length)err();
 const cIds=[...s.anomalyDeck,...s.anomalyDiscard,...s.pending.flatMap(d=>d.cards||[])];if(cIds.length!==ANOMALIES.length||new Set(cIds).size!==ANOMALIES.length)err();
 for(const t of s.traps)if(!int(t.pos,0,47)||!int(t.owner,0,s.players.length-1))err();
 for(const b of s.bosses)if(!BOSSES.some(x=>x.id===b.id)||!int(b.owner,0,s.players.length-1))err();
 if(s.objectives.some(id=>!OBJECTIVES.some(o=>o.id===id))||new Set(s.objectives).size!==s.objectives.length)err();
 if(!s.turn||!int(s.turn.attacks,0,2)||!int(s.turn.exchanges,0,2)||['moved','skill','fury','location'].some(k=>typeof s.turn[k]!=='boolean'))err();
 if(s.turn.retry&&(!['territory','hunt','boss','player'].includes(s.turn.retry.kind)||s.turn.attacks!==1||active(s).hero!=='hommebete'))err();
 if(s.moveDie!==null&&!int(s.moveDie,1,10))err();
 if(s.lastRoll){const r=s.lastRoll;if(!Array.isArray(r.dice)||r.dice.length<1||r.dice.length>2||r.dice.some(n=>!int(n,1,10))||!keys.includes(r.stat)||!Number.isFinite(r.modifier)||!Number.isFinite(r.bonus)||!Number.isFinite(r.total)||!Number.isFinite(r.targetTotal)||typeof r.target!=='string'||r.target.length>100||typeof r.win!=='boolean'||typeof r.critical!=='boolean')err();}
 if(s.log.some(e=>typeof e.text!=='string'||e.text.length>1000||!['info','good','bad','event'].includes(e.kind)||!int(e.round,1)))err();
 if(typeof s.finished!=='boolean'||typeof s.ending!=='boolean'||s.finished!==(s.phase==='finished')||(s.finished&&s.pending.length))err();
 return s;
}
