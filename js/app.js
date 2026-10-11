const $=id=>document.getElementById(id),fmt=n=>(n<0?'-':'')+'₹'+Math.abs(Math.round(n)).toLocaleString('en-IN'),cl=(x,a,b)=>Math.max(a,Math.min(b,x));
let S={day:1,bal:10000,habit:0,tx:[],hist:[10000],tab:'home',cat:'Food',surprise:null,
commits:[{n:'Rent share',amt:3000,day:2},{n:'Phone recharge',amt:299,day:8},{n:'Study material',amt:500,day:12}],
subs:[{n:'Spotify',amt:119,day:6,on:true},{n:'Netflix',amt:199,day:10,on:true},{n:'YouTube Premium',amt:129,day:14,on:true},{n:'Cloud storage',amt:75,day:20,on:true}],
goals:[{n:'Emergency fund',e:'🛟',target:1500,saved:0},{n:'Goa trip',e:'🏖️',target:3000,saved:0},{n:'New earbuds',e:'🎧',target:2000,saved:0}]};
let sim={k:'once',amt:1500,g:1};
const SURP=[['Cracked phone screen',1200],['Friend’s birthday dinner',600],['Bike puncture + repair',450],['Urgent doctor visit',800],['Laptop charger died',900]];
const KS={once:'One-time purchase',sub:'New subscription',habit:'Weekly habit',goal:'Save to goal'};

function M(s){
 const left=31-s.day,upc=[...s.commits,...s.subs.filter(x=>x.on)].filter(x=>x.day>s.day).reduce((a,x)=>a+x.amt,0);
 const spent=s.tx.filter(t=>t.k=='spend').reduce((a,t)=>a+t.amt,0),avg=(spent+180*2)/(s.day+2)+s.habit;
 const free=s.bal-upc,allow=Math.max(0,free)/left,proj=free-avg*left,cover=free/Math.max(1,avg*left);
 const risk=Math.round(cl(100*(1.5-cover)/1.1,0,100)),subT=s.subs.filter(x=>x.on).reduce((a,x)=>a+x.amt,0),saved=s.goals.reduce((a,g)=>a+g.saved,0);
 const health=Math.round(40*Math.min(cover,1.5)/1.5+25*Math.min(saved/2000,1)+15*(1-cl(subT/1500,0,1))+20*(proj>=0?1:cl(1+proj/2000,0,1)));
 return{left,upc,avg,free,allow,proj,risk,health,subT,saved,surplus:Math.max(0,proj)};
}
function apply(s,k,a,g){s=structuredClone(s);
 if(k=='once')s.bal-=a;
 if(k=='sub')s.subs.push({n:'New sub',amt:a,day:Math.min(30,s.day+1),on:true});
 if(k=='habit')s.habit+=a/7;
 if(k=='goal'){s.bal-=a;s.goals[g].saved+=a}
 return s}
const rl=r=>r<30?['Low','ok']:r<60?['Medium','wn']:['High','bad'];
const hl=h=>h>=70?['Thriving','ok']:h>=45?['Okay','wn']:['Fragile','bad'];

function ring(h){const c=hl(h)[1],r=34,C=2*Math.PI*r;return `<svg width="86" height="86" viewBox="0 0 86 86"><circle cx="43" cy="43" r="${r}" fill="none" stroke="var(--bd)" stroke-width="9"/><circle cx="43" cy="43" r="${r}" fill="none" stroke="var(--${c})" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C*h/100} ${C}" transform="rotate(-90 43 43)"/><text x="43" y="49" text-anchor="middle" font-size="20" font-weight="800" fill="var(--tx)">${h}</text></svg>`}
function chart(m){const W=320,H=110,x=d=>8+(d-1)/29*(W-16),lo=Math.min(0,m.proj),y=v=>H-10-(v-lo)/(10000-lo)*(H-20);
 const pts=S.hist.map((v,i)=>`${x(i+1)},${y(v)}`).join(' ');
 return `<svg viewBox="0 0 ${W} ${H}" width="100%"><line x1="8" x2="${W-8}" y1="${y(0)}" y2="${y(0)}" stroke="var(--bd)"/><polyline points="${pts}" fill="none" stroke="var(--ac)" stroke-width="3"/><line x1="${x(S.day)}" y1="${y(S.bal)}" x2="${x(30)}" y2="${y(m.proj)}" stroke="${m.proj<0?'var(--bad)':'var(--ok)'}" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="${x(30)}" cy="${y(m.proj)}" r="4" fill="${m.proj<0?'var(--bad)':'var(--ok)'}"/></svg>`}
function coach(m){
 if(m.proj<0)return ['🚨',`At this pace you’ll run out ~${fmt(-m.proj)} short. Trim daily spend to ${fmt(m.allow)} or pause a subscription.`];
 if(m.risk>=30)return ['⚠️',`Runway is tight. Stay under ${fmt(m.allow)}/day to keep a cushion.`];
 if(m.saved<1500)return ['💡',`You’re on track with ${fmt(m.surplus)} projected spare. Park some in your Emergency fund.`];
 return ['🔥','Strong month. Your safety net is growing — keep the streak.']}

function render(){
 const m=M(S),[rt,rc]=rl(m.risk),[ht,hc]=hl(m.health),[ci,ct]=coach(m);let h='';
 if(S.tab=='home'){
  h=`<div class="row" style="margin:4px 0 12px"><div><h1 style="font-size:22px">Paisa Pilot ✈️</h1><div class="mu">Day ${S.day} of 30 · ${m.left} days left</div></div><button onclick="theme()">◐</button></div>
  <div class="card hero"><div class="mu">Balance</div><div class="big">${fmt(S.bal)}</div>
   <div class="row" style="margin-top:8px"><div><div class="mu">Safe to spend today</div><b style="font-size:22px">${fmt(m.allow)}</b></div><div style="text-align:right"><div class="mu">Bills ahead</div><b style="font-size:22px">${fmt(m.upc)}</b></div></div></div>
  <div class="card row"><div><div class="mu">Financial health</div><h2 class="${hc}">${ht}</h2><div class="mu" style="margin-top:6px">Risk: <b class="${rc}">${rt} (${m.risk})</b></div></div>${ring(m.health)}</div>
  <div class="card alert"><b>${ci} Coach</b><div class="mu" style="margin-top:4px;color:var(--tx)">${ct}</div></div>
  <div class="card"><div class="row"><b>Month forecast</b><b class="${m.proj<0?'bad':'ok'}">${fmt(m.proj)} at day 30</b></div>${chart(m)}<div class="mu">Solid = actual · dashed = projection at ~${fmt(m.avg)}/day</div></div>
  <div class="card"><b>Log a spend</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0">${['Food','Transport','Fun','Shopping','Other'].map(c=>`<button class="chip ${S.cat==c?'on':''}" onclick="S.cat='${c}';render()">${c}</button>`).join('')}</div>
   <div class="row"><input type="number" id="qa" placeholder="Amount ₹" min="1"><button class="p" onclick="logSpend()">Add</button></div></div>
  <div class="grid"><button class="p" onclick="next(1)" ${S.day>=30?'disabled':''}>Next day ▶</button><button onclick="next(7)" ${S.day>=30?'disabled':''}>+7 days ⏩</button>
  <button onclick="surprise()">🎲 Surprise expense</button><button onclick="income()">💸 Add ₹500 gig income</button></div>
  ${S.day>=30?`<div class="card" style="margin-top:12px"><b>Month complete 🎉</b><div class="mu">Final balance ${fmt(S.bal)} · Saved ${fmt(m.saved)} · Health ${m.health}/100</div></div>`:''}
  ${sup(m)}`}
 if(S.tab=='sim'){h=`<h2 style="margin:6px 0 4px">Decision simulator</h2><div class="mu" style="margin-bottom:12px">Test a move first. Nothing changes until you commit.</div>
  <div class="card"><div style="display:flex;gap:6px;flex-wrap:wrap">${Object.keys(KS).map(k=>`<button class="chip ${sim.k==k?'on':''}" onclick="sim.k='${k}';render()">${KS[k]}</button>`).join('')}</div>
  ${sim.k=='goal'?`<select style="margin-top:12px" onchange="sim.g=+this.value;simOut()">${S.goals.map((g,i)=>`<option value="${i}" ${sim.g==i?'selected':''}>${g.e} ${g.n}</option>`).join('')}</select>`:''}
  <div class="row" style="margin-top:12px"><b>Amount</b><b id="av" style="font-size:22px">${fmt(sim.amt)}${sim.k=='habit'?'/wk':sim.k=='sub'?'/mo':''}</b></div>
  <input type="range" id="rg" min="50" max="5000" step="50" value="${sim.amt}" oninput="sim.amt=+this.value;$('av').textContent=fmt(sim.amt)+(sim.k=='habit'?'/wk':sim.k=='sub'?'/mo':'');simOut()"></div><div id="so"></div>`}
 if(S.tab=='plan'){h=`<h2 style="margin:6px 0 12px">Plan</h2>
  <div class="card"><b>Commitments</b>${S.commits.map(c=>`<div class="row" style="padding-top:10px"><span>${c.n} <span class="mu">· day ${c.day}${c.day<=S.day?' ✓ paid':''}</span></span><b>${fmt(c.amt)}</b></div>`).join('')}</div>
  <div class="card"><div class="row"><b>Subscriptions</b><span class="mu">${fmt(m.subT)}/mo · ${fmt(m.subT*12)}/yr</span></div>${S.subs.map((c,i)=>`<div class="row" style="padding-top:12px"><span>${c.n} <span class="mu">· ${fmt(c.amt)} · day ${c.day}</span></span><button class="sw ${c.on?'on':''}" onclick="S.subs[${i}].on=!S.subs[${i}].on;render()"></button></div>`).join('')}<div class="mu" style="margin-top:10px">Toggle off to see allowance, risk and health update instantly.</div></div>
  <div class="card"><b>Savings goals</b>${S.goals.map((g,i)=>`<div style="padding-top:14px"><div class="row"><span>${g.e} ${g.n}</span><span class="mu">${fmt(g.saved)} / ${fmt(g.target)}</span></div><div class="bar" style="margin:8px 0"><i style="width:${cl(g.saved/g.target*100,0,100)}%"></i></div><div style="display:flex;gap:6px"><button onclick="save(${i},100)">+₹100</button><button onclick="save(${i},500)">+₹500</button></div></div>`).join('')}</div>`}
 if(S.tab=='log'){h=`<h2 style="margin:6px 0 12px">Activity</h2><div class="card">${S.tx.length?S.tx.slice().reverse().map(t=>`<div class="row" style="padding:8px 0;border-bottom:1px solid var(--bd)"><span>${t.n}<div class="mu">Day ${t.d} · ${t.k}</div></span><b class="${t.amt<0?'ok':''}">${t.amt<0?'+':'−'}${fmt(Math.abs(t.amt))}</b></div>`).join(''):'<div class="mu">No activity yet.</div>'}</div>`}
 $('app').innerHTML=h;
 $('tabs').innerHTML=[['home','🏠','Home'],['sim','🧪','Simulate'],['plan','🎯','Plan'],['log','🧾','Activity']].map(t=>`<button class="${S.tab==t[0]?'on':''}" onclick="S.tab='${t[0]}';render()"><span>${t[1]}</span>${t[2]}</button>`).join('');
 if(S.tab=='sim')simOut();
}
function sup(m){const u=S.surprise;if(!u)return'';const a=apply(S,'once',u[1]),n=M(a),ef=S.goals[0];
 return `<div class="card alert" style="margin-top:12px"><b>⚡ ${u[0]} — ${fmt(u[1])}</b><div class="mu" style="margin:6px 0">Paying from balance: allowance ${fmt(m.allow)} → <b>${fmt(n.allow)}</b>, risk ${m.risk} → <b>${n.risk}</b>.</div><div class="grid"><button class="p" onclick="payS(0)">Pay from balance</button><button onclick="payS(1)" ${ef.saved<=0?'disabled':''}>Use emergency fund (${fmt(ef.saved)})</button></div></div>`}
function simOut(){const b=M(S),s2=apply(S,sim.k,sim.amt,sim.g),a=M(s2),el=$('so');if(!el)return;
 const row=(l,x,y,f,inv)=>{const d=y-x,c=d==0?'':((d>0)!=!!inv?'ok':'bad');return `<tr><td>${l}</td><td>${f(x)}</td><td class="${c}"><b>${f(y)}</b></td></tr>`};
 const g=sim.k=='goal'?S.goals[sim.g]:null,tail=sim.k=='goal'?`${g.e} ${g.n}: ${Math.round(g.saved/g.target*100)}% → ${Math.round(s2.goals[sim.g].saved/g.target*100)}%`:`Month-end spare for goals: ${fmt(b.surplus)} → ${fmt(a.surplus)}`;
 let v=a.risk>=60||a.proj<0?['bad','🛑 Not now — this pushes you into the danger zone.']:a.risk>=30?['wn','⚠️ Doable, but your cushion gets thin.']:['ok','✅ Safe — you can afford this.'];
 if(sim.k=='sub')v[1]+=` Costs ${fmt(sim.amt*12)}/year.`;
 el.innerHTML=`<div class="card"><table><tr><td class="mu">Impact</td><td class="mu">Now</td><td class="mu">After</td></tr>${row('Balance',b.free+b.upc==0?0:S.bal,s2.bal,fmt)}${row('Daily allowance',b.allow,a.allow,fmt)}${row('Month-end forecast',b.proj,a.proj,fmt)}${row('Risk',b.risk,a.risk,x=>x,1)}${row('Health',b.health,a.health,x=>x)}</table>
 <div class="mu" style="margin-top:10px">${tail}</div><div class="verdict ${v[0]}" style="background:var(--bg)">${v[1]}</div>
 <div class="grid" style="margin-top:12px"><button onclick="S.tab='home';render()">Skip it</button><button class="p" onclick="commit()">Commit</button></div></div>`}
function commit(){const k=sim.k,a=sim.amt;
 if(k=='once'){S.bal-=a;S.tx.push({n:'One-time purchase',amt:a,d:S.day,k:'once'})}
 if(k=='sub'){S.subs.push({n:'New sub',amt:a,day:Math.min(30,S.day+1),on:true});S.tx.push({n:'Added subscription',amt:0,d:S.day,k:'plan'})}
 if(k=='habit'){S.habit+=a/7;S.tx.push({n:'New weekly habit',amt:0,d:S.day,k:'plan'})}
 if(k=='goal')save(sim.g,a,1);S.hist[S.day-1]=S.bal;S.tab='home';render()}
function logSpend(){const a=+$('qa').value;if(!a||a<=0)return;S.bal-=a;S.tx.push({n:S.cat,amt:a,d:S.day,k:'spend'});S.hist[S.day-1]=S.bal;render()}
function save(i,a,q){S.bal-=a;S.goals[i].saved+=a;S.tx.push({n:'Saved → '+S.goals[i].n,amt:a,d:S.day,k:'saving'});S.hist[S.day-1]=S.bal;if(!q)render()}
function income(){S.bal+=500;S.tx.push({n:'Gig income',amt:-500,d:S.day,k:'income'});S.hist[S.day-1]=S.bal;render()}
function surprise(){S.surprise=SURP[Math.floor(Math.random()*SURP.length)];render()}
function payS(ef){const u=S.surprise;let a=u[1];if(ef){const t=Math.min(a,S.goals[0].saved);S.goals[0].saved-=t;a-=t;S.tx.push({n:u[0]+' (emergency fund)',amt:t,d:S.day,k:'surprise'})}
 if(a>0){S.bal-=a;S.tx.push({n:u[0],amt:a,d:S.day,k:'surprise'})}S.surprise=null;S.hist[S.day-1]=S.bal;render()}
function next(n){while(n-->0&&S.day<30){S.day++;[...S.commits,...S.subs.filter(x=>x.on)].filter(x=>x.day==S.day).forEach(x=>{S.bal-=x.amt;S.tx.push({n:x.n,amt:x.amt,d:S.day,k:'bill'})});
 S.hist[S.day-1]=S.bal}render()}
function theme(){const r=document.documentElement,d=r.dataset.theme=='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches);r.dataset.theme=d?'light':'dark'}
render();
