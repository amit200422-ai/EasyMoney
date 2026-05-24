// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPYX5IGfEf6aHMjUNAaComLa_PLYc9jQA",
  authDomain: "save-it-7be2b.firebaseapp.com",
  databaseURL: "https://save-it-7be2b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "save-it-7be2b",
  storageBucket: "save-it-7be2b.firebasestorage.app",
  messagingSenderId: "673388819190",
  appId: "1:673388819190:web:9d9137c37280f4684672d7",
  measurementId: "G-LPHXYNC2QY"
};

let db, auth, provider, userKey;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  auth = firebase.auth();
  provider = new firebase.auth.GoogleAuthProvider();
  userKey = null;
} catch(e) {
  console.warn('Firebase initialization error:', e);
  // Fallback to guest mode if Firebase fails
  db = null;
  auth = null;
  provider = null;
  userKey = 'guest';
}

// Show loading screen
function showLoading() {
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.id = 'loading-screen';
  loadingScreen.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">טוען נתונים...</div>
  `;
  document.body.appendChild(loadingScreen);
}

// Hide loading screen
function hideLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.remove();
  }
}

// Show login screen
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  hideLoading();
}

// Show app
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  hideLoading();
  window.firebaseReady = true;
  if (window._initPending) { 
    window._initPending(); 
    window._initPending = null; 
  }
}

// Firebase save function
window.firebaseSave = async function(data) {
  if (!userKey) return;
  try {
    await db.ref(userKey).set(data);
  } catch(e) {
    console.error('Firebase save error:', e);
  }
};

// Firebase load function
window.firebaseLoad = async function() {
  if (!userKey) return null;
  try {
    const s = await db.ref(userKey).get();
    if (s.exists()) return s.val();
  } catch(e) {
    console.error('Firebase load error:', e);
  }
  return null;
};

// Google login
window.doGoogleLogin = async function() {
  try {
    await auth.signInWithPopup(provider);
  } catch(e) {
    alert('שגיאה בכניסה: ' + e.message);
  }
};

// Sign out
window.doSignOut = async function() {
  await auth.signOut();
  location.reload();
};

// Guest mode
window.doGuest = function() {
  userKey = 'guest';
  showApp();
};

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    userKey = 'users/' + user.uid;
    const ub = document.getElementById('ubar');
    if (ub) {
      ub.style.display = 'flex';
      ub.innerHTML = (user.photoURL?'<img src="'+user.photoURL+'">':'') + '<span>' + (user.displayName||user.email).split(' ')[0] + '</span><span style="opacity:.4;margin-right:4px">| יציאה</span>';
    }
    showApp();
  } else {
    showLogin();
  }
});

// Show loading screen immediately on page load
document.addEventListener('DOMContentLoaded', function() {
  showLoading();
});

// PWA
try{const mf={name:'כסף חכם',short_name:'כסף חכם',start_url:'/',display:'standalone',background_color:'#0B1120',theme_color:'#00E5A0'};const mb=new Blob([JSON.stringify(mf)],{type:'application/json'});const ml=document.getElementById('pwa-manifest');if(ml)ml.href=URL.createObjectURL(mb);}catch(e){}

const CAT={food:'אוכל',transport:'תחבורה',housing:'דיור',utilities:'חשבונות',health:'בריאות',entertainment:'בידור',salary:'משכורת',freelance:'פרילנס',savings:'חיסכון',other:'אחר'};
const CPILL={food:'p-food',transport:'p-transport',housing:'p-housing',utilities:'p-utilities',health:'p-health',entertainment:'p-entertainment',salary:'p-salary',freelance:'p-freelance',savings:'p-savings',other:'p-other'};
const ITYPE={pension:'פנסיה/גמל',stock:'מניות/ETF',realestate:'נדל"ן',savings_plan:'חיסכון',crypto:'קריפטו',other:'אחר'};
const ICOLOR={pension:'#00E5A0',stock:'#4D9FFF',realestate:'#FFB830',savings_plan:'#B97FFF',crypto:'#FF5370',other:'#8BA4BE'};
const COLORS=['#00E5A0','#4D9FFF','#FFB830','#B97FFF','#FF5370','#FF77AA','#00B37D','#1D6FAA'];
const USD=3.7;
let txns=[],budgets={},savGoal=10000,recurring=[],investments=[];
let editId=null,updId=null;
let mCh=null,dCh=null,tCh=null,sDon=null,sPerf=null,nwDon=null;

const DTXNS=[
  {id:1,type:'income',desc:'משכורת אפריל',amount:12000,cat:'salary',date:'2026-04-01'},
  {id:2,type:'income',desc:'פרויקט פרילנס',amount:2500,cat:'freelance',date:'2026-04-05'},
  {id:3,type:'expense',desc:'שכר דירה',amount:3500,cat:'housing',date:'2026-04-02'},
  {id:4,type:'expense',desc:'חשמל ומים',amount:350,cat:'utilities',date:'2026-04-03'},
  {id:5,type:'expense',desc:'סופר',amount:800,cat:'food',date:'2026-04-08'},
  {id:6,type:'expense',desc:'דלק',amount:300,cat:'transport',date:'2026-04-07'},
  {id:7,type:'savings',desc:'חיסכון חודשי',amount:1500,cat:'savings',date:'2026-04-04'},
  {id:8,type:'expense',desc:'מסעדה',amount:220,cat:'food',date:'2026-04-10'},
  {id:9,type:'expense',desc:'נטפליקס',amount:90,cat:'entertainment',date:'2026-04-06'},
  {id:10,type:'expense',desc:'תרופות',amount:150,cat:'health',date:'2026-04-09'},
  {id:11,type:'income',desc:'משכורת מרץ',amount:12000,cat:'salary',date:'2026-03-01'},
  {id:12,type:'expense',desc:'שכר דירה מרץ',amount:3500,cat:'housing',date:'2026-03-02'},
  {id:13,type:'expense',desc:'קניות מרץ',amount:950,cat:'food',date:'2026-03-10'},
  {id:14,type:'savings',desc:'חיסכון מרץ',amount:1000,cat:'savings',date:'2026-03-05'},
  {id:15,type:'expense',desc:'ביטוח רכב',amount:600,cat:'transport',date:'2026-03-15'},
  {id:16,type:'income',desc:'משכורת פברואר',amount:12000,cat:'salary',date:'2026-02-01'},
  {id:17,type:'expense',desc:'שכר דירה פברואר',amount:3500,cat:'housing',date:'2026-02-02'},
  {id:18,type:'savings',desc:'חיסכון פברואר',amount:1200,cat:'savings',date:'2026-02-04'},
  {id:19,type:'expense',desc:'קניות פברואר',amount:700,cat:'food',date:'2026-02-12'},
  {id:20,type:'income',desc:'משכורת ינואר',amount:11500,cat:'salary',date:'2026-01-01'},
  {id:21,type:'expense',desc:'שכר דירה ינואר',amount:3500,cat:'housing',date:'2026-01-02'},
  {id:22,type:'expense',desc:'בידור ינואר',amount:400,cat:'entertainment',date:'2026-01-20'}
];
const DREC=[{id:1,desc:'שכר דירה',amount:3500,cat:'housing',day:1},{id:2,desc:'נטפליקס',amount:55,cat:'entertainment',day:5},{id:3,desc:'ספוטיפיי',amount:35,cat:'entertainment',day:5}];
const DINV=[
  {id:1,name:'קרן פנסיה',type:'pension',currency:'ILS',cost:45000,history:[{month:'2026-02',value:47000},{month:'2026-03',value:48200},{month:'2026-04',value:49500}]},
  {id:2,name:'תיק מניות',type:'stock',currency:'ILS',cost:20000,history:[{month:'2026-02',value:21500},{month:'2026-03',value:20800},{month:'2026-04',value:22300}]},
  {id:3,name:'קרן השתלמות',type:'savings_plan',currency:'ILS',cost:15000,history:[{month:'2026-02',value:15800},{month:'2026-03',value:16100},{month:'2026-04',value:16400}]}
];

// ─── CHECKING ACCOUNT ─────────────────────────────────────────────────────
var checkingData={bank:'מזרחי טפחות',opening:0,openingDate:''};
function loadChecking(){try{var s=localStorage.getItem('kc3_ck');if(s)checkingData=JSON.parse(s);}catch(e){}}
function saveCheckingLocal(){try{localStorage.setItem('kc3_ck',JSON.stringify(checkingData));}catch(e){}}

function openCheckingModal(){
  document.getElementById('ck-bank-sel').value=checkingData.bank||'מזרחי טפחות';
  document.getElementById('ck-opening').value=checkingData.opening||'';
  document.getElementById('ck-date').value=checkingData.openingDate||new Date().toISOString().split('T')[0];
  document.getElementById('checking-modal').classList.add('show');
}
function saveChecking(){
  checkingData.bank=document.getElementById('ck-bank-sel').value;
  checkingData.opening=parseFloat(document.getElementById('ck-opening').value)||0;
  checkingData.openingDate=document.getElementById('ck-date').value;
  saveCheckingLocal();save();closeModal('checking-modal');renderCheckingBalance();
  toast('✓ יתרת עו"ש עודכנה','green');
}
function renderCheckingBalance(){
  var card=document.getElementById('checking-card');
  if(!card)return;
  if(!checkingData.opening){card.style.display='none';return;}
  card.style.display='block';
  var od=checkingData.openingDate;
  var rel=txns.filter(function(t){return !od||t.date>=od;});
  var inc=rel.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var exp=rel.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  var sav=rel.filter(function(t){return t.type==='savings';}).reduce(function(s,t){return s+t.amount;},0);
  var bal=checkingData.opening+inc-exp-sav;
  document.getElementById('ck-bank-name').textContent=checkingData.bank;
  document.getElementById('ck-bal').textContent=fmt(bal);
  document.getElementById('ck-bal').style.color=bal>=0?'white':'#FF5370';
  document.getElementById('ck-inc').textContent='+'+fmt(inc);
  document.getElementById('ck-exp').textContent='-'+fmt(exp);
  document.getElementById('ck-sav').textContent='-'+fmt(sav);
  document.getElementById('ck-sub').textContent=od?'יתרת פתיחה '+checkingData.opening.toLocaleString('he-IL')+'₪ בתאריך '+od:'';
}
// ─── LOCK SCREEN — מושבת, משתמשים בGoogle Auth בלבד ─────────────────────
function initLock(){ /* Google Auth מטפל בזיהוי */ }
function checkLock(){ }

function save(){
  try{localStorage.setItem('kc3_t',JSON.stringify(txns));localStorage.setItem('kc3_b',JSON.stringify(budgets));localStorage.setItem('kc3_g',String(savGoal));localStorage.setItem('kc3_r',JSON.stringify(recurring));localStorage.setItem('kc3_i',JSON.stringify(investments));}catch(e){}
  // Save to Firebase
  if(window.firebaseSave){
    window.firebaseSave({txns,budgets,savGoal,recurring,investments,checkingData,subscriptions});
  }
}
function load(){
  try{
    const t=localStorage.getItem('kc3_t');txns=t?JSON.parse(t):JSON.parse(JSON.stringify(DTXNS));
    const b=localStorage.getItem('kc3_b');budgets=b?JSON.parse(b):{};
    const g=localStorage.getItem('kc3_g');savGoal=g?parseFloat(g):10000;
    const r=localStorage.getItem('kc3_r');recurring=r?JSON.parse(r):JSON.parse(JSON.stringify(DREC));
    const i=localStorage.getItem('kc3_i');investments=i?JSON.parse(i):JSON.parse(JSON.stringify(DINV));
    const ck=localStorage.getItem('kc3_ck');if(ck&&typeof checkingData!=='undefined')checkingData=JSON.parse(ck);
  }catch(e){txns=JSON.parse(JSON.stringify(DTXNS));recurring=JSON.parse(JSON.stringify(DREC));investments=JSON.parse(JSON.stringify(DINV));budgets={};}
}

function fmt(n){return '₪'+Math.round(n).toLocaleString('he-IL');}
function mk(d){return d.slice(0,7);}
function nowMk(){return new Date().toISOString().slice(0,7);}
function mTxns(m){return txns.filter(t=>mk(t.date)===m);}
function getDashMonth(){
  const sel=document.getElementById('dash-month');
  if(!sel) return nowMk();
  const v=sel.value;
  if(v==='current') return nowMk();
  return v; // 'all' or specific month like '2026-03'
}
function curMt(){
  const m=getDashMonth();
  if(m==='all') return txns;
  return mTxns(m);
}
function heM(ym){if(!ym)return'';const p=ym.split('-');return['','ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'][parseInt(p[1])]+' '+p[0];}
function iCurVal(inv){if(!inv.history||!inv.history.length)return inv.cost||0;return inv.history[inv.history.length-1].value||0;}
function iPnL(inv){return iCurVal(inv)-(inv.cost||0);}
function iPct(inv){const c=inv.cost||0;return c>0?Math.round(iPnL(inv)/c*1000)/10:0;}
function iILS(inv){const v=iCurVal(inv);return inv.currency==='USD'?v*USD:v;}

function toast(msg,color){const t=document.getElementById('toast');t.textContent=msg;t.style.borderColor=color==='green'?'rgba(0,229,160,.3)':color==='red'?'rgba(255,83,112,.3)':'rgba(255,184,48,.3)';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);}
function closeModal(id){document.getElementById(id).classList.remove('show');}

function nav(page,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ni,.mn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  if(btn)btn.classList.add('active');
  const fns={monthly:()=>{buildMonthly();buildDonut();renderCmpSec();},budget:renderBudget,savings:renderSavings,recurring:renderRecurring,stocks:()=>{renderStocks();buildStkCharts();},networth:renderNetWorth,analysis:()=>{renderInsights();buildTrend();populateCmp();renderCmp();renderAllTop5();},tips:renderTips,import:()=>{selectBank('isracard');},subscriptions:()=>{renderSubscriptions(subscriptions);}};
  if(fns[page])setTimeout(fns[page],50);
}

function renderAll(){populateDashMonth();renderCheckingBalance();renderBalance();renderMainStats();renderDashCats();renderDashTop5();renderRecent();renderTxns();renderSavings();renderRecurring();renderBudget();renderTips();populateMonthFilter();save();}

function renderBalance(){
  const mt=curMt();
  const inc=mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const exp=mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const sav=mt.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0);
  const dm=getDashMonth();
  const isAll=dm==='all';
  const period=isAll?'כל הזמנים':(dm===nowMk()?'החודש':heM(dm));
  document.getElementById('bs').innerHTML=
    '<div class="bal ba"><div class="bl">מאזן לפני חיסכון</div><div class="bv">'+fmt(inc-exp)+'</div><div class="bs">הכנסות פחות הוצאות — '+period+'</div></div>'+
    '<div class="bal bb"><div class="bl">הועבר לחיסכון</div><div class="bv">'+fmt(sav)+'</div><div class="bs">'+period+'</div></div>'+
    '<div class="bal bc"><div class="bl">מאזן לאחר חיסכון</div><div class="bv">'+fmt(inc-exp-sav)+'</div><div class="bs">נטו פנוי</div></div>';
}

function renderMainStats(){const mt=curMt();const inc=mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);const exp=mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);const allSav=txns.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0);const inv=investments.reduce((s,i)=>s+iILS(i),0);document.getElementById('ms').innerHTML='<div class="sc sc-glow"><div class="sl">הכנסות החודש</div><div class="sv g">'+fmt(inc)+'</div></div><div class="sc"><div class="sl">הוצאות החודש</div><div class="sv r">'+fmt(exp)+'</div></div><div class="sc"><div class="sl">כיס חיסכון</div><div class="sv b">'+fmt(allSav)+'</div></div><div class="sc"><div class="sl">תיק השקעות</div><div class="sv a">'+fmt(inv)+'</div></div>';}

function renderDashCats(){renderCatBars('d-cats',curMt().filter(t=>t.type==='expense'),'#00E5A0');}

function renderDashTop5(){const top=curMt().filter(t=>t.type==='expense').sort((a,b)=>b.amount-a.amount).slice(0,5);const el=document.getElementById('d-top5');if(!top.length){el.innerHTML='<div style="text-align:center;padding:1.5rem;color:var(--t3);font-size:13px">אין הוצאות החודש</div>';return;}el.innerHTML=top.map((t,i)=>'<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)"><span style="font-size:11px;color:var(--t3);font-weight:700;min-width:18px">#'+(i+1)+'</span><span class="pill '+(CPILL[t.cat]||'p-other')+'">'+(CAT[t.cat]||t.cat)+'</span><span style="flex:1;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+t.desc+'</span><span style="font-weight:700;color:var(--red)">'+fmt(t.amount)+'</span></div>').join('');}

function renderRecent(){const rows=[...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);document.getElementById('d-recent').innerHTML=rows.map(t=>txnRow(t,false)).join('');}

function renderCatBars(elId,list,color){const totals={};list.forEach(t=>{totals[t.cat]=(totals[t.cat]||0)+t.amount;});const total=Object.values(totals).reduce((s,v)=>s+v,0)||1;const sorted=Object.entries(totals).sort((a,b)=>b[1]-a[1]);const el=document.getElementById(elId);if(!el)return;if(!sorted.length){el.innerHTML='<div style="text-align:center;padding:1rem;color:var(--t3);font-size:13px">אין נתונים</div>';return;}el.innerHTML=sorted.map(([cat,amt])=>'<div class="cbl"><span class="can">'+(CAT[cat]||cat)+'</span><div class="cbg"><div class="cbb" style="width:'+Math.round(amt/total*100)+'%;background:'+color+'"></div></div><span class="cav">'+fmt(amt)+'</span><span class="cap">'+Math.round(amt/total*100)+'%</span></div>').join('');}

function txnRow(t,editable){const isRec=recurring.some(r=>r.desc===t.desc);return'<tr><td><span class="pill '+(CPILL[t.cat]||'p-other')+'">'+(CAT[t.cat]||t.cat)+'</span>'+(isRec?'<span class="rec-pill">קבועה</span>':'')+'</td><td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+t.desc+'</td><td style="color:var(--t3)">'+t.date.slice(5).replace('-','/')+'</td><td style="font-weight:700;color:'+(t.type==='income'?'var(--green)':t.type==='savings'?'var(--amber)':'var(--red)')+'">'+(t.type==='income'?'+':'−')+fmt(t.amount)+'</td>'+(editable?'<td><button class="btn-ic" onclick="openEdit('+t.id+')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="btn-del" onclick="delTxn('+t.id+')">×</button></td>':'<td></td>')+'</tr>';}

function renderTxns(){const ft=document.getElementById('f-type').value,fc=document.getElementById('f-cat').value,fm=document.getElementById('f-mon').value,s=(document.getElementById('srch').value||'').toLowerCase();let list=[...txns].sort((a,b)=>new Date(b.date)-new Date(a.date));if(ft!=='all')list=list.filter(t=>t.type===ft);if(fc!=='all')list=list.filter(t=>t.cat===fc);if(fm!=='all')list=list.filter(t=>mk(t.date)===fm);if(s)list=list.filter(t=>t.desc.toLowerCase().includes(s)||(CAT[t.cat]||'').includes(s));const tbody=document.getElementById('txn-tbody');tbody.innerHTML=list.length?list.map(t=>txnRow(t,true)).join(''):'<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--t3)">אין תנועות</td></tr>';}

function onDashMonthChange(){
  renderAll();
}

function populateDashMonth(){
  const months=[...new Set(txns.map(t=>mk(t.date)))].sort().reverse();
  const sel=document.getElementById('dash-month');
  if(!sel)return;
  const cur=sel.value;
  const curNow=nowMk();
  sel.innerHTML=
    '<option value="current">📅 '+heM(curNow)+' (נוכחי)</option>'+
    '<option value="all">🗓 כל הזמנים</option>'+
    '<optgroup label="──────────────">'+
    months.filter(m=>m!==curNow).map(m=>'<option value="'+m+'">'+heM(m)+'</option>').join('')+
    '</optgroup>';
  // Restore selection if still valid
  if(cur && (cur==='all' || months.includes(cur))){
    sel.value=cur;
  } else {
    sel.value='current';
  }
}
function populateMonthFilter(){const months=[...new Set(txns.map(t=>mk(t.date)))].sort().reverse();const sel=document.getElementById('f-mon');const cur=sel.value;sel.innerHTML='<option value="all">כל החודשים</option>'+months.map(m=>'<option value="'+m+'">'+heM(m)+'</option>').join('');if(cur)sel.value=cur;}

function addTxn(){const desc=document.getElementById('t-desc').value.trim(),amount=parseFloat(document.getElementById('t-amt').value),type=document.getElementById('t-type').value,cat=document.getElementById('t-cat').value,date=document.getElementById('t-date').value;if(!desc||!amount||amount<=0||!date){toast('יש למלא את כל השדות','amber');return;}txns.push({id:Date.now(),type,desc,amount,cat,date});document.getElementById('t-desc').value='';document.getElementById('t-amt').value='';toast('✓ תנועה נוספה','green');renderAll();}
function delTxn(id){txns=txns.filter(t=>t.id!==id);renderAll();}
function openEdit(id){const t=txns.find(x=>x.id===id);if(!t)return;editId=id;document.getElementById('ed-desc').value=t.desc;document.getElementById('ed-amt').value=t.amount;document.getElementById('ed-date').value=t.date;document.getElementById('ed-cat').value=t.cat;document.getElementById('edit-modal').classList.add('show');}
function saveEdit(){const t=txns.find(x=>x.id===editId);if(!t)return;t.desc=document.getElementById('ed-desc').value;t.amount=parseFloat(document.getElementById('ed-amt').value)||t.amount;t.date=document.getElementById('ed-date').value;t.cat=document.getElementById('ed-cat').value;closeModal('edit-modal');renderAll();toast('✓ תנועה עודכנה','green');}

function buildMonthly(){const n=parseInt(document.getElementById('mon-range').value)||6,now=new Date(),months=[],labels=[],HE=['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];for(let i=n-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'));labels.push(HE[d.getMonth()]);}const incs=[],exps=[],bals=[];months.forEach(m=>{const mt=mTxns(m);const ic=mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);const ex=mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);incs.push(ic);exps.push(ex);bals.push(ic-ex);});const ctx=document.getElementById('mon-chart').getContext('2d');if(mCh)mCh.destroy();mCh=new Chart(ctx,{data:{labels,datasets:[{type:'bar',label:'הכנסות',data:incs,backgroundColor:'rgba(0,229,160,.65)',borderRadius:5,order:2},{type:'bar',label:'הוצאות',data:exps,backgroundColor:'rgba(255,83,112,.65)',borderRadius:5,order:2},{type:'line',label:'מאזן',data:bals,borderColor:'#4D9FFF',backgroundColor:'transparent',pointBackgroundColor:'#4D9FFF',pointRadius:4,tension:0.4,order:1,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'₪'+Math.round(v/1000)+'K',font:{size:10},color:'#4A6480'},grid:{color:'rgba(255,255,255,.04)'},border:{display:false}},x:{ticks:{font:{size:11},color:'#4A6480'},grid:{display:false},border:{display:false}}}}});}

function buildDonut(){const mt=curMt().filter(t=>t.type==='expense'),totals={};mt.forEach(t=>{totals[t.cat]=(totals[t.cat]||0)+t.amount;});const keys=Object.keys(totals),vals=Object.values(totals),total=vals.reduce((s,v)=>s+v,0)||1;const ctx=document.getElementById('donut-chart').getContext('2d');if(dCh)dCh.destroy();if(!keys.length)return;dCh=new Chart(ctx,{type:'doughnut',data:{labels:keys.map(k=>CAT[k]||k),datasets:[{data:vals,backgroundColor:COLORS.slice(0,keys.length),borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:'65%'}});document.getElementById('donut-leg').innerHTML=keys.map((k,i)=>'<div class="dli"><span class="dd" style="background:'+COLORS[i%COLORS.length]+'"></span><span>'+(CAT[k]||k)+'</span><span style="margin-right:auto;font-weight:700">'+Math.round(vals[i]/total*100)+'%</span></div>').join('');}

function renderCmpSec(){const now=new Date(),tMk=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0'),prev=new Date(now.getFullYear(),now.getMonth()-1,1),pMk=prev.getFullYear()+'-'+String(prev.getMonth()+1).padStart(2,'0');const s=m=>({inc:mTxns(m).filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),exp:mTxns(m).filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)});const a=s(tMk),b=s(pMk),di=b.inc>0?Math.round((a.inc-b.inc)/b.inc*100):0,de=b.exp>0?Math.round((a.exp-b.exp)/b.exp*100):0;document.getElementById('cmp-sec').innerHTML='<div style="font-size:12px;color:var(--t2);margin-bottom:12px">החודש מול חודש שעבר</div><div style="display:flex;flex-direction:column;gap:10px"><div style="display:flex;justify-content:space-between;align-items:center;font-size:13px"><span>הכנסות</span><div style="display:flex;gap:8px;align-items:center"><span style="font-weight:700">'+fmt(a.inc)+'</span><span class="chg '+(di>=0?'cup':'cdn')+'">'+(di>=0?'+':'')+di+'%</span></div></div><div style="display:flex;justify-content:space-between;align-items:center;font-size:13px"><span>הוצאות</span><div style="display:flex;gap:8px;align-items:center"><span style="font-weight:700">'+fmt(a.exp)+'</span><span class="chg '+(de<=0?'cup':'cdn')+'">'+(de>=0?'+':'')+de+'%</span></div></div></div>';}

function renderBudget(){const mt=curMt(),now=new Date(),day=now.getDate(),dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();const rows=['food','transport','housing','utilities','health','entertainment','other'].filter(c=>budgets[c]).map(c=>{const spent=mt.filter(t=>t.type==='expense'&&t.cat===c).reduce((s,t)=>s+t.amount,0),bud=budgets[c],pct=Math.min(100,Math.round(spent/bud*100)),over=spent>bud;return'<div class="budrow"><span class="pill '+(CPILL[c]||'p-other')+'" style="min-width:70px">'+(CAT[c]||c)+'</span><div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px"><span>'+fmt(spent)+' / '+fmt(bud)+'</span><span style="font-weight:700;color:'+(over?'var(--red)':'var(--t2)')+'">'+pct+'%'+(over?' ⚠':'')+'</span></div><div class="budbg"><div class="budb" style="width:'+pct+'%;background:'+(over?'var(--red)':'var(--green)')+'"></div></div></div></div>';});document.getElementById('bud-list').innerHTML=rows.length?rows.join(''):'<div style="text-align:center;padding:2rem;color:var(--t3);font-size:13px">לא הוגדרו תקציבים</div>';const expSF=mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),rate=day>0?expSF/day:0,proj=Math.round(rate*dim),incM=mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);document.getElementById('forecast').innerHTML='<div style="font-size:13px;margin-bottom:6px">קצב יומי: <strong>'+fmt(Math.round(rate))+'</strong></div><div style="font-size:13px;margin-bottom:6px">חיזוי סוף חודש: <strong style="color:'+(proj>incM?'var(--red)':'var(--green)')+'">'+fmt(proj)+'</strong></div><div style="font-size:12px;color:var(--t3)">'+(proj>incM?'⚠ הוצאות צפויות לחרוג מהכנסות':'✓ הוצאות בגבולות')+'</div>';}
function saveBudget(){const cat=document.getElementById('bud-cat').value,amt=parseFloat(document.getElementById('bud-amt').value);if(!cat||!amt||amt<=0)return;budgets[cat]=amt;document.getElementById('bud-amt').value='';save();renderBudget();toast('✓ תקציב נשמר','green');}

function renderSavings(){const total=txns.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0);document.getElementById('sav-big').textContent=fmt(total);const pct=Math.min(100,Math.round(total/savGoal*100));document.getElementById('sav-pg').style.width=pct+'%';document.getElementById('sav-gl').textContent='יעד: '+fmt(savGoal)+' ('+pct+'%)';document.getElementById('sav-gi').value=savGoal;const mExp=curMt().filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),em=mExp>0?Math.round(total/mExp*10)/10:0;document.getElementById('emergency').textContent='קרן חירום: '+em+' חודשי הוצאות שמורים (מומלץ: 3-6 חודשים)';const mSav=curMt().filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0),rem=savGoal-total,fc=document.getElementById('sav-fc');if(mSav>0&&rem>0)fc.innerHTML='<div style="font-size:13px">בקצב '+fmt(mSav)+'/חודש — תגיע ליעד בעוד <strong style="color:var(--green)">'+Math.ceil(rem/mSav)+' חודשים</strong></div>';else if(rem<=0)fc.innerHTML='<div style="font-size:14px;font-weight:700;color:var(--green)">🎉 הגעת ליעד!</div>';else fc.innerHTML='<div style="font-size:13px;color:var(--t3)">הוסף חיסכון החודש לחיזוי</div>';const hist=[...txns].filter(t=>t.type==='savings').sort((a,b)=>new Date(b.date)-new Date(a.date));document.getElementById('sav-tbody').innerHTML=hist.length?hist.map(t=>txnRow(t,true)).join(''):'<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--t3)">אין תנועות חיסכון</td></tr>';}
function setSavGoal(){const v=parseFloat(document.getElementById('sav-gi').value);if(v>0){savGoal=v;save();renderSavings();toast('✓ יעד נשמר','green');}}

function renderRecurring(){const el=document.getElementById('rec-list');el.innerHTML=recurring.length?'<div class="card" style="padding:0;overflow:hidden"><table class="tbl"><thead><tr><th>תיאור</th><th>קטגוריה</th><th>יום</th><th>סכום</th><th></th></tr></thead><tbody>'+recurring.map(r=>'<tr><td style="font-weight:500">'+r.desc+'</td><td><span class="pill '+(CPILL[r.cat]||'p-other')+'">'+(CAT[r.cat]||r.cat)+'</span></td><td style="color:var(--t2)">'+r.day+'</td><td style="font-weight:700;color:var(--red)">'+fmt(r.amount)+'</td><td><button class="btn-del" onclick="delRec('+r.id+')">×</button></td></tr>').join('')+'</tbody></table></div>':'<div style="text-align:center;padding:2rem;color:var(--t3);font-size:13px">אין הוצאות קבועות</div>';document.getElementById('rec-sum').innerHTML='<div style="font-size:14px;font-weight:700">סה"כ: <span style="color:var(--red)">'+fmt(recurring.reduce((s,r)=>s+r.amount,0))+'</span>/חודש</div>';}
function addRecurring(){const desc=document.getElementById('rec-desc').value.trim(),amount=parseFloat(document.getElementById('rec-amt').value),cat=document.getElementById('rec-cat').value,day=parseInt(document.getElementById('rec-day').value)||1;if(!desc||!amount)return;recurring.push({id:Date.now(),desc,amount,cat,day});document.getElementById('rec-desc').value='';document.getElementById('rec-amt').value='';save();renderRecurring();toast('✓ נוסף','green');}
function delRec(id){recurring=recurring.filter(r=>r.id!==id);save();renderRecurring();}
function applyRecurring(){const today=nowMk(),added=[];recurring.forEach(r=>{const date=today+'-'+String(Math.min(r.day,28)).padStart(2,'0');if(!txns.some(t=>t.desc===r.desc&&mk(t.date)===today)){txns.push({id:Date.now()+Math.random(),type:'expense',desc:r.desc,amount:r.amount,cat:r.cat,date});added.push(r.desc);}});renderAll();toast(added.length?'✓ נוספו '+added.length+' הוצאות':'כל ההוצאות הקבועות כבר קיימות',added.length?'green':'amber');}

function openAddInv(){document.getElementById('inv-name').value='';document.getElementById('inv-cost').value='';document.getElementById('inv-value').value='';document.getElementById('inv-month').value=nowMk();document.getElementById('inv-modal').classList.add('show');}
function saveInv(){const name=document.getElementById('inv-name').value.trim(),type=document.getElementById('inv-type').value,currency=document.getElementById('inv-cur').value,cost=parseFloat(document.getElementById('inv-cost').value)||0,value=parseFloat(document.getElementById('inv-value').value)||0,month=document.getElementById('inv-month').value||nowMk();if(!name||!value){toast('יש למלא שם ושווי','amber');return;}let inv=investments.find(i=>i.name===name);if(inv){if(!inv.history)inv.history=[];const ex=inv.history.find(h=>h.month===month);if(ex)ex.value=value;else inv.history.push({month,value});inv.history.sort((a,b)=>a.month.localeCompare(b.month));if(cost>0)inv.cost=cost;}else{investments.push({id:Date.now(),name,type,currency,cost:cost||value,history:[{month,value}]});}closeModal('inv-modal');save();renderStocks();buildStkCharts();toast('✓ השקעה עודכנה','green');}

function openUpd(id){const inv=investments.find(i=>i.id===id);if(!inv)return;updId=id;document.getElementById('upd-name').textContent=inv.name;document.getElementById('upd-val').value=iCurVal(inv);document.getElementById('upd-mon').value=nowMk();document.getElementById('upd-modal').classList.add('show');}
function saveUpd(){const inv=investments.find(i=>i.id===updId);if(!inv)return;const value=parseFloat(document.getElementById('upd-val').value)||0,month=document.getElementById('upd-mon').value||nowMk();if(!inv.history)inv.history=[];const ex=inv.history.find(h=>h.month===month);if(ex)ex.value=value;else inv.history.push({month,value});inv.history.sort((a,b)=>a.month.localeCompare(b.month));closeModal('upd-modal');save();renderStocks();buildStkCharts();toast('✓ שווי עודכן ל-'+fmt(value),'green');}
function delInv(id){if(!confirm('למחוק?'))return;investments=investments.filter(i=>i.id!==id);save();renderStocks();buildStkCharts();}

function renderStocks(){const totVal=investments.reduce((s,i)=>s+iILS(i),0),totCost=investments.reduce((s,i)=>s+(i.cost||0),0),totPnL=totVal-totCost,pct=totCost>0?Math.round(totPnL/totCost*1000)/10:0;document.getElementById('stk-stats').innerHTML='<div class="sc sc-acc"><div class="sl">שווי תיק כולל</div><div class="sv b">'+fmt(totVal)+'</div><div class="ss">'+investments.length+' השקעות</div></div><div class="sc"><div class="sl">עלות קנייה</div><div class="sv">'+fmt(totCost)+'</div></div><div class="sc"><div class="sl">רווח/הפסד</div><div class="sv '+(totPnL>=0?'g':'r')+'">'+(totPnL>=0?'+':'')+fmt(totPnL)+'</div><div class="ss" style="color:'+(totPnL>=0?'var(--green)':'var(--red)')+'">'+(pct>=0?'+':'')+pct+'%</div></div>';
  const el=document.getElementById('stk-list');
  if(!investments.length){el.innerHTML='<div style="text-align:center;padding:3rem;color:var(--t3);font-size:13px">אין השקעות. לחץ "+ הוסף / עדכן" להתחלה.</div>';return;}
  el.innerHTML=investments.map(inv=>{
    const curVal=iCurVal(inv),pnl=iPnL(inv),pct=iPct(inv),color=ICOLOR[inv.type]||'#8BA4BE',hist=inv.history||[];
    let mChgHTML='';
    if(hist.length>=2){const last=hist[hist.length-1].value,prev=hist[hist.length-2].value,mPct=prev>0?Math.round((last-prev)/prev*1000)/10:0;mChgHTML='<span class="chg '+(mPct>=0?'cup':'cdn')+'">'+(mPct>=0?'+':'')+mPct+'% החודש</span>';}
    const histRows=hist.slice(-6).reverse().map((h,i,arr)=>{const prv=arr[i+1];const chg=prv?Math.round((h.value-prv.value)/prv.value*1000)/10:null;return'<div class="me"><span class="ml">'+heM(h.month)+'</span><span class="mv">'+fmt(h.value)+'</span>'+(chg!==null?'<span class="mc" style="color:'+(chg>=0?'var(--green)':'var(--red)')+'">'+(chg>=0?'+':'')+chg+'%</span>':'<span class="mc" style="color:var(--t3)">—</span>')+'</div>';}).join('');
    return'<div class="inv-card"><div class="inv-hdr"><div><div style="font-size:14px;font-weight:700">'+inv.name+'</div><div style="font-size:11px;color:var(--t3);margin-top:2px">'+(ITYPE[inv.type]||inv.type)+'</div></div><div style="display:flex;align-items:center;gap:10px">'+mChgHTML+'<button class="btn btn-sm" onclick="openUpd('+inv.id+')" style="font-size:11px">עדכן שווי</button><button class="btn-del" onclick="delInv('+inv.id+')">×</button></div></div><div class="inv-body"><div class="inv-grid"><div class="inv-stat"><div class="inv-sl">שווי נוכחי</div><div class="inv-sv" style="color:'+color+'">'+fmt(curVal)+'</div></div><div class="inv-stat"><div class="inv-sl">עלות קנייה</div><div class="inv-sv">'+fmt(inv.cost||0)+'</div></div><div class="inv-stat"><div class="inv-sl">רווח/הפסד</div><div class="inv-sv" style="color:'+(pnl>=0?'var(--green)':'var(--red)')+'">'+(pnl>=0?'+':'')+fmt(pnl)+'</div></div><div class="inv-stat"><div class="inv-sl">% שינוי</div><div class="inv-sv"><span class="chg '+(pct>=0?'cup':'cdn')+'">'+(pct>=0?'+':'')+pct+'%</span></div></div></div>'+(hist.length?'<div class="ct" style="margin-bottom:.5rem">היסטוריה חודשית</div>'+histRows:'')+'</div></div>';
  }).join('');}

function buildStkCharts(){const byType={};investments.forEach(i=>{byType[i.type]=(byType[i.type]||0)+iILS(i);});const keys=Object.keys(byType),vals=Object.values(byType),colors=keys.map(k=>ICOLOR[k]||'#8BA4BE'),total=vals.reduce((s,v)=>s+v,0)||1;const c1=document.getElementById('stk-donut')?.getContext('2d');if(c1){if(sDon)sDon.destroy();if(keys.length){sDon=new Chart(c1,{type:'doughnut',data:{labels:keys.map(k=>ITYPE[k]||k),datasets:[{data:vals,backgroundColor:colors,borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:'65%'}});document.getElementById('stk-dleg').innerHTML=keys.map((k,i)=>'<div class="dli"><span class="dd" style="background:'+colors[i]+'"></span><span>'+(ITYPE[k]||k)+'</span><span style="margin-right:auto;font-weight:700">'+Math.round(vals[i]/total*100)+'%</span></div>').join('');}}
  const c2=document.getElementById('stk-perf')?.getContext('2d');if(c2){if(sPerf)sPerf.destroy();const allM=[...new Set(investments.flatMap(i=>(i.history||[]).map(h=>h.month)))].sort().slice(-12);if(allM.length>1){const tots=allM.map(m=>investments.reduce((s,i)=>{const h=(i.history||[]).find(h=>h.month===m);const cv=iCurVal(i);return s+(h?(i.currency==='USD'?h.value*USD:h.value):(i.currency==='USD'?cv*USD:cv));},0));const HE=['','ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];sPerf=new Chart(c2,{type:'line',data:{labels:allM.map(m=>{const p=m.split('-');return HE[parseInt(p[1])]+' '+p[0].slice(2);}),datasets:[{data:tots,borderColor:'#4D9FFF',backgroundColor:'rgba(77,159,255,.08)',fill:true,pointBackgroundColor:'#4D9FFF',pointRadius:4,tension:0.4,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'₪'+Math.round(v/1000)+'K',font:{size:10},color:'#4A6480'},grid:{color:'rgba(255,255,255,.04)'},border:{display:false}},x:{ticks:{font:{size:10},color:'#4A6480'},grid:{display:false},border:{display:false}}}}});}}}

function renderNetWorth(){const allSav=txns.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0),stkVal=investments.reduce((s,i)=>s+iILS(i),0),stkCost=investments.reduce((s,i)=>s+(i.cost||0),0),mt=curMt(),cash=Math.max(0,mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)-mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)-mt.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0)),total=allSav+stkVal+cash,stkPnL=stkVal-stkCost;document.getElementById('nw-stats').innerHTML='<div class="sc sc-glow"><div class="sl">שווי נטו כולל</div><div class="sv g">'+fmt(total)+'</div><div class="ss">כל הנכסים ביחד</div></div><div class="sc"><div class="sl">רווח השקעות</div><div class="sv '+(stkPnL>=0?'g':'r')+'">'+(stkPnL>=0?'+':'')+fmt(stkPnL)+'</div></div><div class="sc"><div class="sl">% השקעות מהנכסים</div><div class="sv">'+(total>0?Math.round(stkVal/total*100):0)+'%</div></div>';
  // עו"ש דינמי
  var ckBal=cash;
  if(typeof checkingData!=='undefined'&&checkingData.opening){
    var od=checkingData.openingDate;
    var rel=txns.filter(function(t){return !od||t.date>=od;});
    var ckI=rel.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
    var ckE=rel.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
    var ckS=rel.filter(function(t){return t.type==='savings';}).reduce(function(s,t){return s+t.amount;},0);
    ckBal=checkingData.opening+ckI-ckE-ckS;
  }
  const items=[{label:'כיס חיסכון',value:allSav,color:'#00E5A0',sub:'כסף שהפרשת לחיסכון'},{label:'תיק השקעות',value:stkVal,color:'#4D9FFF',sub:investments.length+' השקעות'},{label:'עו"ש',value:ckBal,color:'#FFB830',sub:typeof checkingData!=='undefined'&&checkingData.bank?checkingData.bank:'יתרה דינמית'}];
  document.getElementById('nw-breakdown').innerHTML=items.map(item=>{const pct=total>0?Math.round(item.value/total*100):0;return'<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px"><span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:'+item.color+';margin-left:8px"></span>'+item.label+'</span><span><strong>'+fmt(item.value)+'</strong> <span style="color:var(--t3)">('+pct+'%)</span></span></div><div class="cbg"><div class="cbb" style="width:'+pct+'%;background:'+item.color+'"></div></div><div style="font-size:11px;color:var(--t3);margin-top:3px">'+item.sub+'</div></div>';}).join('');
  const c=document.getElementById('nw-donut')?.getContext('2d');if(c){if(nwDon)nwDon.destroy();const vals=items.map(i=>Math.max(0,i.value));if(vals.some(v=>v>0)){nwDon=new Chart(c,{type:'doughnut',data:{labels:items.map(i=>i.label),datasets:[{data:vals,backgroundColor:items.map(i=>i.color),borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:'65%'}});document.getElementById('nw-dleg').innerHTML=items.map(item=>'<div class="dli"><span class="dd" style="background:'+item.color+'"></span><span>'+item.label+'</span><span style="margin-right:auto;font-weight:700">'+fmt(item.value)+'</span></div>').join('');}}
  document.getElementById('nw-detail').innerHTML='<div style="display:flex;flex-direction:column;gap:8px;font-size:13px"><div style="display:flex;justify-content:space-between;padding:10px 12px;background:rgba(0,229,160,.08);border-radius:var(--rs);border:1px solid rgba(0,229,160,.15)"><span style="color:var(--green);font-weight:700">סה"כ נכסים</span><strong style="color:var(--green)">'+fmt(total)+'</strong></div>'+items.map(i=>'<div style="display:flex;justify-content:space-between;padding:10px 12px;background:var(--bg3);border-radius:var(--rs)"><span style="color:var(--t2)">'+i.label+'</span><span style="font-weight:700">'+fmt(i.value)+'</span></div>').join('')+'<div style="display:flex;justify-content:space-between;padding:10px 12px;background:rgba('+(stkPnL>=0?'0,229,160':'255,83,112')+',.08);border-radius:var(--rs)"><span style="font-weight:700;color:'+(stkPnL>=0?'var(--green)':'var(--red)')+'">רווח/הפסד השקעות</span><strong style="color:'+(stkPnL>=0?'var(--green)':'var(--red)')+'">'+(stkPnL>=0?'+':'')+fmt(stkPnL)+'</strong></div></div>';}

function renderInsights(){const mt=curMt(),inc=mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),exp=mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),allSav=txns.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0),now=new Date(),day=now.getDate(),rate=day>0?exp/day:0,proj=Math.round(rate*new Date(now.getFullYear(),now.getMonth()+1,0).getDate()),n=6,months=[];for(let i=0;i<n;i++){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'));}const avgExp=Math.round(months.reduce((s,m)=>s+mTxns(m).filter(t=>t.type==='expense').reduce((ss,t)=>ss+t.amount,0),0)/n),savPct=inc>0?Math.round(allSav/inc*100):0;document.getElementById('ins-grid').innerHTML='<div class="ins"><div class="ins-l">יחס חיסכון</div><div class="ins-v" style="color:'+(savPct>=20?'var(--green)':'var(--amber)')+'">'+savPct+'%</div><div class="ins-s">מומלץ: 20%+</div></div><div class="ins"><div class="ins-l">ממוצע הוצאות</div><div class="ins-v">'+fmt(avgExp)+'</div><div class="ins-s">6 חודשים אחרונים</div></div><div class="ins"><div class="ins-l">חיזוי הוצאות</div><div class="ins-v" style="color:'+(proj>inc?'var(--red)':'var(--green)')+'">'+fmt(proj)+'</div><div class="ins-s">לפי קצב יומי</div></div><div class="ins"><div class="ins-l">קרן חירום</div><div class="ins-v">'+(exp>0?Math.round(allSav/exp*10)/10:0)+' חודשים</div><div class="ins-s">מומלץ: 3-6</div></div>';}

function buildTrend(){const cat=document.getElementById('tr-cat').value,now=new Date(),months=[],labels=[],HE=['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'));labels.push(HE[d.getMonth()]);}const data=months.map(m=>mTxns(m).filter(t=>t.type==='expense'&&t.cat===cat).reduce((s,t)=>s+t.amount,0));const ctx=document.getElementById('tr-chart').getContext('2d');if(tCh)tCh.destroy();tCh=new Chart(ctx,{type:'line',data:{labels,datasets:[{data,borderColor:'var(--red)',backgroundColor:'rgba(255,83,112,.08)',fill:true,pointBackgroundColor:'var(--red)',pointRadius:4,tension:0.4,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'₪'+v.toLocaleString('he-IL'),font:{size:10},color:'#4A6480'},grid:{color:'rgba(255,255,255,.04)'},border:{display:false}},x:{ticks:{font:{size:11},color:'#4A6480'},grid:{display:false},border:{display:false}}}}});}
function populateCmp(){const months=[...new Set(txns.map(t=>mk(t.date)))].sort().reverse();const opts=months.map(m=>'<option value="'+m+'">'+heM(m)+'</option>').join('');document.getElementById('cmp-a').innerHTML=opts;document.getElementById('cmp-b').innerHTML=opts;if(months.length>1)document.getElementById('cmp-b').selectedIndex=1;renderCmp();}
function renderCmp(){const a=document.getElementById('cmp-a')?.value,b=document.getElementById('cmp-b')?.value;if(!a||!b)return;const s=m=>({inc:mTxns(m).filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),exp:mTxns(m).filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),sav:mTxns(m).filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0)});const sa=s(a),sb=s(b);const row=(lbl,va,vb)=>{const diff=va-vb;return'<div style="display:grid;grid-template-columns:80px 1fr 1fr 65px;gap:6px;align-items:center;font-size:12px;padding:6px 0;border-bottom:1px solid var(--border)"><span style="color:var(--t2)">'+lbl+'</span><span style="font-weight:700">'+fmt(va)+'</span><span style="font-weight:700">'+fmt(vb)+'</span><span class="chg '+(diff>=0?'cup':'cdn')+'">'+(diff>=0?'+':'')+fmt(Math.abs(diff))+'</span></div>';};document.getElementById('cmp-detail').innerHTML='<div style="display:grid;grid-template-columns:80px 1fr 1fr 65px;gap:6px;font-size:10px;color:var(--t3);margin-bottom:4px;font-weight:700;text-transform:uppercase"><span></span><span>'+heM(a)+'</span><span>'+heM(b)+'</span><span>הפרש</span></div>'+row('הכנסות',sa.inc,sb.inc)+row('הוצאות',sa.exp,sb.exp)+row('חיסכון',sa.sav,sb.sav);}
function renderAllTop5(){document.getElementById('all-top5').innerHTML=txns.filter(t=>t.type==='expense').sort((a,b)=>b.amount-a.amount).slice(0,5).map((t,i)=>'<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-weight:800;color:var(--t3);min-width:20px">#'+(i+1)+'</span><span class="pill '+(CPILL[t.cat]||'p-other')+'">'+(CAT[t.cat]||t.cat)+'</span><span style="flex:1;font-size:13px">'+t.desc+'</span><span style="color:var(--t2);font-size:11px">'+t.date.slice(0,7)+'</span><span style="font-weight:700;color:var(--red)">'+fmt(t.amount)+'</span></div>').join('');}

function renderTips(){const mt=curMt(),inc=mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),exp=mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),sav=mt.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0),allSav=txns.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0),food=mt.filter(t=>t.cat==='food').reduce((s,t)=>s+t.amount,0),ent=mt.filter(t=>t.cat==='entertainment').reduce((s,t)=>s+t.amount,0),invT=investments.reduce((s,i)=>s+iILS(i),0),tips=[];
  if(exp>inc)tips.push({type:'warn',icon:'⚠️',t:'גירעון חודשי',b:'הוצאות ('+fmt(exp)+') עולות על הכנסות ('+fmt(inc)+'). גירעון של '+fmt(exp-inc)+'.'});
  if(inc>0){const p=Math.round(sav/inc*100);if(p<20)tips.push({type:'info',icon:'💡',t:'הגדל חיסכון',b:'אתה חוסך '+p+'% מהכנסתך. מומלץ לשאוף ל-20%. נדרש עוד '+fmt(inc*0.2-sav)+' החודש.'});else tips.push({type:'ok',icon:'✅',t:'יחס חיסכון מצוין',b:'חוסך '+p+'% — שמור על הקצב!'});}
  if(inc>0&&food>inc*0.15)tips.push({type:'info',icon:'🍽️',t:'הוצאות אוכל גבוהות',b:'השקעת '+fmt(food)+' על אוכל ('+Math.round(food/inc*100)+'%). תכנון ארוחות עשוי לחסוך 20-30%.'});
  if(ent>600)tips.push({type:'info',icon:'📺',t:'בדוק מנויים',b:'בידור עלה '+fmt(ent)+' החודש. שקול לבטל מנויים שאינם בשימוש.'});
  const em=exp>0?Math.round(allSav/exp*10)/10:0;
  if(em<3)tips.push({type:'info',icon:'🛡️',t:'קרן חירום נמוכה',b:'יש לך '+em+' חודשי הוצאות. מומלץ להגיע ל-3-6 חודשים.'});
  else tips.push({type:'ok',icon:'🛡️',t:'קרן חירום טובה',b:'יש לך '+em+' חודשי הוצאות שמורים — מצוין!'});
  if(invT>0){const p=allSav+invT>0?Math.round(invT/(allSav+invT)*100):0;tips.push({type:'ok',icon:'📈',t:'תיק השקעות פעיל',b:'שווי '+fmt(invT)+' — '+p+'% מסך החיסכון וההשקעות.'});}
  const ob=Object.entries(budgets).filter(([c,bud])=>mt.filter(t=>t.type==='expense'&&t.cat===c).reduce((s,t)=>s+t.amount,0)>bud);
  if(ob.length)tips.push({type:'warn',icon:'🚨',t:'חריגת תקציב',b:'חרגת מהתקציב ב: '+ob.map(([c])=>CAT[c]).join(', ')});
  if(!tips.length)tips.push({type:'ok',icon:'🎯',t:'הכל נראה טוב',b:'הוסף עוד תנועות לקבלת ניתוח מפורט.'});
  document.getElementById('tips-list').innerHTML=tips.map(tip=>'<div class="tip '+tip.type+'"><div class="tip-icon">'+tip.icon+'</div><div><div class="tip-t">'+tip.t+'</div><div class="tip-b">'+tip.b+'</div></div></div>').join('');}

// ─── CREDIT CARD IMPORT ──────────────────────────────────────────────────────
let selectedBank = 'isracard';
let pendingImport = [];
const CAT_MAP_IMP = {
  'מסעדה':'food','קפה':'food','אוכל':'food','מינימרקט':'food','סופר':'food','שוק':'food',
  'רמי לוי':'food','שופרסל':'food','מגה':'food','יינות ביתן':'food','ויקטורי':'food',
  'מקדונלד':'food','בורגר':'food','פיצה':'food','ארומה':'food','קפה גרג':'food',
  'דלק':'transport','סונול':'transport','פז':'transport','דור אלון':'transport',
  'רב קו':'transport','גט':'transport','אוטובוס':'transport','רכבת':'transport',
  'נטפליקס':'entertainment','ספוטיפיי':'entertainment','apple':'entertainment',
  'גוגל':'entertainment','disney':'entertainment','hbo':'entertainment','youtube':'entertainment',
  'פלאפון':'utilities','סלקום':'utilities','פרטנר':'utilities','הוט':'utilities',
  'בזק':'utilities','חשמל':'utilities','מים':'utilities','ארנונה':'utilities','גז':'utilities',
  'שכירות':'housing','דיור':'housing','ועד בית':'utilities',
  'בית מרקחת':'health','סופר פארם':'health','רופא':'health','קופת חולים':'health',
  'מכבי':'health','לאומית':'health','כללית':'health',
  'אמזון':'other','aliexpress':'other','זארה':'other'
};
function autoCatImp(desc) {
  const d = (desc||'').toLowerCase();
  for (const [k,v] of Object.entries(CAT_MAP_IMP)) {
    if (d.includes(k.toLowerCase())) return v;
  }
  return 'other';
}
function selectBank(bank) {
  selectedBank = bank;
  document.querySelectorAll('[id^="bank-"]').forEach(b => {
    b.style.background=''; b.style.color=''; b.style.borderColor='';
  });
  const btn = document.getElementById('bank-'+bank);
  if (btn) { btn.style.background='var(--gl)'; btn.style.color='var(--green)'; btn.style.borderColor='var(--green)'; }
}
function impDragOver(e) { e.preventDefault(); document.getElementById('imp-drop').classList.add('dragover'); }
function impDragLeave(e) { document.getElementById('imp-drop').classList.remove('dragover'); }
function impDrop(e) {
  e.preventDefault();
  document.getElementById('imp-drop').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processImpFile(file);
}
function handleImpFile(input) {
  const file = input.files[0];
  if (file) processImpFile(file);
  input.value='';
}
// ── סיווג אוטומטי ─────────────────────────────────────────────────────────
const CAT_RULES = [
  // אוכל ומסעדות
  {words:['מסעדה','ארומה','קפה','רסטורנט','resturant','restaurant','פיצה','סושי','בורגר','מקדונלד','שווארמה','פלאפל','מאפיה','מאפה','לחם','בייקרי','bakery','cafe','coffee','אוכל','גרג','קנטקי','KFC','subway','סאבווי','גולדה','מגנוליה','BUTI','אנבה','ANAVA','בר '],cat:'food'},
  // סופרמרקט וקניות מזון
  {words:['שופרסל','רמי לוי','ויקטורי','יינות ביתן','מגה','מינימרקט','סופר','super','יוחננוף','AM:PM','סיטי','מחסני','שוק','ירקות','פירות'],cat:'food'},
  // תחבורה ודלק
  {words:['דלק','סונול','פז','דור אלון','תן פלוס','רב קו','גט','אוטובוס','רכבת','WAZE','פרקינג','חניה','parking','צומת','שלמה שרותי','GETT','UBER','אובר','מונית','taxi'],cat:'transport'},
  // ביטוח ורכב
  {words:['ביטוח','insurance','חובה','מקיף','רישוי','טסט','מוסך','garage'],cat:'transport'},
  // בידור ומנויים דיגיטליים
  {words:['נטפליקס','netflix','ספוטיפיי','spotify','apple','אפל','גוגל','google','disney','HBO','youtube','יוטיוב','HOT','yes','פריים','prime','paramount','DEEZER','WIX','CANVA','ZOOM','איוונטים','זאפה','AMPHITHEATER','אמפי','תיאטרון','סינמה','קולנוע','בילוי','concert'],cat:'entertainment'},
  // חשבונות ותשתיות
  {words:['חשמל','מים','גז','ועד','ארנונה','בזק','HOT','012','013','סלקום','פרטנר','פלאפון','019','חברת','תשתית'],cat:'utilities'},
  // דיור ושכירות
  {words:['שכירות','שכר דירה','דיור','משכנתא','mortgage','rent'],cat:'housing'},
  // בריאות ורפואה
  {words:['בית מרקחת','סופר פארם','super-pharm','pharmacy','רופא','קופת חולים','מכבי','כללית','לאומית','בי״כ','קליניק','clinic','בית חולים','hospital','תרופה','רפואי','health','dental','שיניים','אופטיקה','opt'],cat:'health'},
  // קניות וביגוד
  {words:['זארה','ZARA','H&M','מנגו','MANGO','FOX','פוקס','GOLF','גולף','CASTRO','קסטרו','TERMINAL X','RENUAR','רנואר','ACE','מחסן','HOME CENTER','IKEA','איקאה'],cat:'other'},
  // עמלות בנק
  {words:['עמלה','דמי כרטיס','דמי ניהול','ריבית','מזרחי','לאומי','פועלים','דיסקונט','בינלאומי'],cat:'other'},
];

function autoCatImp(desc) {
  const d = (desc||'').toLowerCase();
  for (const rule of CAT_RULES) {
    for (const w of rule.words) {
      if (d.includes(w.toLowerCase())) return rule.cat;
    }
  }
  return 'other';
}

async function processImpFile(file) {
  const status = document.getElementById('imp-status');
  status.textContent = '⏳ קורא את הקובץ...';
  document.getElementById('imp-preview').style.display = 'none';
  try {
    const buf = await file.arrayBuffer();
    let results = [];

    if (file.name.toLowerCase().endsWith('.csv')) {
      let text = '';
      for (const enc of ['windows-1255','utf-8','iso-8859-8']) {
        try { text = new TextDecoder(enc).decode(buf); if (/[\u05d0-\u05ea]/.test(text)) break; } catch(e){}
      }
      const rows = text.split(/\r?\n/).map(l => l.split(',').map(c => c.replace(/^"|"$/g,'').trim()));
      results = parseIsracardRows(rows);
    } else {
      const wb = XLSX.read(buf, {type:'array', codepage:1255});
      for (const name of wb.SheetNames) {
        const ws = wb.Sheets[name];
        // raw:true שומר מספרים כמספרים ולא כטקסט
        const rows = XLSX.utils.sheet_to_json(ws, {header:1, raw:true, defval:''});
        results = results.concat(parseIsracardRows(rows));
      }
    }

    if (!results.length) {
      status.textContent = '⚠ לא נמצאו עסקאות. ודא שהקובץ הוא פירוט עסקאות מישראכרט/אמריקן אקספרס.';
      return;
    }
    // Sort by date descending
    results.sort((a,b) => b.date.localeCompare(a.date));
    pendingImport = results;
    status.textContent = '';
    renderImpPreview(results);
  } catch(e) {
    status.textContent = '❌ שגיאה: ' + e.message;
    console.error(e);
  }
}

// Parser מדויק לפורמט ישראכרט — מבוסס על הקובץ האמיתי
// שורה 19: כותרת "עסקאות למועד חיוב" — עמודות: תאריך | שם בית עסק | סכום עסקה | מטבע | סכום חיוב | ...
// שורה 12: "עסקאות שטרם נקלטו" — מדלגים עליהן לפי בקשה
function parseIsracardRows(rows) {
  const results = [];
  const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/;
  const SKIP_DESC = ['סה"כ','total','שם בית עסק','תאריך רכישה','עסקאות שטרם','עסקאות שבוצעו'];

  let inChargeSection = false;

  for (const row of rows) {
    if (!row || row.length < 2) continue;
    const c0 = String(row[0]||'').trim();
    const c1 = String(row[1]||'').trim();

    // זיהוי תחילת קטע "עסקאות למועד חיוב" — רק אלה מעניינות אותנו
    if (c0.includes('עסקאות למועד חיוב')) { inChargeSection = true; continue; }
    // עצירה בסוף הקטע
    if (inChargeSection && (c0.includes('עסקאות שבוצעו') || c0.includes('עסקאות שטרם'))) { inChargeSection = false; continue; }

    if (!inChargeSection) continue;

    // דלג על שורות כותרת וסיכום
    if (SKIP_DESC.some(s => c1.includes(s) || c0.includes(s))) continue;

    // עמודה 0 = תאריך
    if (!DATE_RE.test(c0)) continue;

    const date = normDate(c0);
    const desc = c1.trim();
    if (!desc || desc.length < 2) continue;

    // עמודה E (index 4) = סכום חיוב בשקלים — אם ריק, קח עמודה C (index 2)
    let amount = 0;
    const rawAmt = row[4] !== '' && row[4] !== null && row[4] !== undefined ? row[4] : row[2];
    const n = parseFloat(String(rawAmt).replace(/[,\s₪]/g,''));
    if (!isNaN(n) && n > 0) amount = n;

    if (!amount) continue;

    results.push({
      desc,
      amount,
      date,
      cat: autoCatImp(desc),
      type: 'expense'
    });
  }
  return results;
}

function normDate(str) {
  const p = str.split(/[\/\-.]/);
  if (p.length < 3) return new Date().toISOString().split('T')[0];
  let [d,m,y] = p;
  if (y.length === 2) y = '20' + y;
  return y.padStart(4,'20') + '-' + m.padStart(2,'0') + '-' + d.padStart(2,'0');
}

function renderImpPreview(items) {
  document.getElementById('imp-count').textContent = items.length;
  document.getElementById('imp-preview').style.display = 'block';
  const el = document.getElementById('imp-rows');
  // Summary by category
  const catTotals = {};
  items.forEach(t => { catTotals[t.cat] = (catTotals[t.cat]||0) + t.amount; });
  const summaryHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border)">' +
    Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) =>
      '<span class="pill '+(CPILL[cat]||'p-other')+'">'+(CAT[cat]||cat)+' — ₪'+Math.round(amt).toLocaleString('he-IL')+'</span>'
    ).join('') + '</div>';
  el.innerHTML = summaryHTML + items.map((t,i) =>
    '<div class="imp-row">' +
    '<span class="imp-date">'+t.date.slice(5).replace('-','/')+'</span>' +
    '<span class="imp-desc">'+t.desc+'</span>' +
    '<select onchange="pendingImport['+i+'].cat=this.value" style="padding:3px 7px;border:1px solid var(--border2);border-radius:6px;background:var(--bg3);color:var(--t1);font-size:11px;font-family:\'Heebo\',sans-serif">' +
    Object.entries(CAT).map(([k,v])=>'<option value="'+k+'"'+(k===t.cat?' selected':'')+'>'+v+'</option>').join('') +
    '</select>' +
    '<span class="imp-amt">−₪'+t.amount.toLocaleString('he-IL')+'</span>' +
    '</div>'
  ).join('');
}

function confirmImp() {
  let added=0;
  pendingImport.forEach(t => {
    const exists=txns.some(x=>x.desc===t.desc&&x.date===t.date&&Math.abs(x.amount-t.amount)<1);
    if(!exists){txns.push({id:Date.now()+Math.random(),...t});added++;}
  });
  pendingImport=[];
  document.getElementById('imp-preview').style.display='none';
  renderAll();
  toast('✓ יובאו '+added+' עסקאות!','green');
  // Auto scan subscriptions after import
  setTimeout(scanSubscriptions, 500);
}

function cancelImp() {
  pendingImport=[];
  document.getElementById('imp-preview').style.display='none';
}
// ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────────
let subscriptions = [];

function loadSubs(){
  try{const s=localStorage.getItem('kc3_subs');if(s)subscriptions=JSON.parse(s);}catch(e){}
}
function saveSubs(){try{localStorage.setItem('kc3_subs',JSON.stringify(subscriptions));}catch(e){}}

function openAddSub(id){
  if(id){
    const s=subscriptions.find(x=>x.id===id);
    if(!s)return;
    document.getElementById('sub-edit-id').value=id;
    document.getElementById('sub-name').value=s.name;
    document.getElementById('sub-price').value=s.price;
    document.getElementById('sub-cat').value=s.cat||'entertainment';
    document.getElementById('sub-day').value=s.day||'';
    document.getElementById('sub-exp').value=s.exp||'';
    document.getElementById('sub-note').value=s.note||'';
  } else {
    document.getElementById('sub-edit-id').value='';
    document.getElementById('sub-name').value='';
    document.getElementById('sub-price').value='';
    document.getElementById('sub-cat').value='entertainment';
    document.getElementById('sub-day').value='';
    document.getElementById('sub-exp').value='';
    document.getElementById('sub-note').value='';
  }
  document.getElementById('sub-modal').classList.add('show');
  setTimeout(()=>document.getElementById('sub-name').focus(),100);
}

function saveSub(){
  const name=document.getElementById('sub-name').value.trim();
  const price=parseFloat(document.getElementById('sub-price').value)||0;
  if(!name||!price){toast('יש למלא שם ומחיר','amber');return;}
  const id=document.getElementById('sub-edit-id').value;
  const sub={
    id:id||String(Date.now()),
    name,price,
    cat:document.getElementById('sub-cat').value,
    day:document.getElementById('sub-day').value,
    exp:document.getElementById('sub-exp').value,
    note:document.getElementById('sub-note').value,
    active:true,
    added:new Date().toISOString().split('T')[0]
  };
  if(id){const idx=subscriptions.findIndex(x=>x.id===id);if(idx>=0)subscriptions[idx]=sub;else subscriptions.push(sub);}
  else subscriptions.push(sub);
  saveSubs();closeModal('sub-modal');renderSubscriptions(subscriptions);
  toast('✓ מנוי נשמר','green');
}

function delSub(id){
  subscriptions=subscriptions.filter(s=>s.id!==id);
  saveSubs();renderSubscriptions(subscriptions);
}

function toggleSub(id){
  const s=subscriptions.find(x=>x.id===id);
  if(s){s.active=!s.active;saveSubs();renderSubscriptions(subscriptions);}
}

function scanSubscriptions() {
  const map={};
  txns.filter(t=>t.type==='expense').forEach(t=>{
    const k=t.desc.trim().toLowerCase();
    if(!map[k]) map[k]={desc:t.desc,cat:t.cat,amounts:[],dates:[]};
    map[k].amounts.push(t.amount); map[k].dates.push(t.date);
  });
  const subs=Object.values(map).filter(s=>{
    if(s.dates.length<2) return false;
    const avg=s.amounts.reduce((a,b)=>a+b,0)/s.amounts.length;
    return s.amounts.every(a=>Math.abs(a-avg)/avg<0.12);
  }).sort((a,b)=>b.dates.length-a.dates.length);
  renderSubscriptions(subs);
}
function renderSubscriptions(subs) {
  const el=document.getElementById('sub-list');
  const allSubs = subscriptions.length > 0 ? subscriptions : [];
  const ICONS={entertainment:'📺',utilities:'⚡',health:'💊',food:'🍽️',transport:'🚗',other:'🔄'};
  const today=new Date();

  // Stats
  const totalMonthly=allSubs.filter(s=>s.active).reduce((t,s)=>t+s.price,0);
  const totalYearly=totalMonthly*12;
  const expiringSoon=allSubs.filter(s=>{
    if(!s.exp)return false;
    const d=new Date(s.exp);
    const diff=(d-today)/(1000*60*60*24);
    return diff>0&&diff<=30;
  });
  document.getElementById('sub-stats').innerHTML=
    '<div class="sc"><div class="sl">עלות חודשית</div><div class="sv r">'+fmt(totalMonthly)+'</div><div class="ss">כל המנויים הפעילים</div></div>'+
    '<div class="sc"><div class="sl">עלות שנתית</div><div class="sv r">'+fmt(totalYearly)+'</div></div>'+
    '<div class="sc"><div class="sl">מספר מנויים</div><div class="sv">'+allSubs.filter(s=>s.active).length+'</div><div class="ss">'+allSubs.filter(s=>!s.active).length+' לא פעילים</div></div>';

  if(!allSubs.length){
    el.innerHTML='<div class="card" style="text-align:center;padding:3rem;color:var(--t3)"><div style="font-size:2rem;margin-bottom:.75rem">📋</div><div style="font-size:14px;font-weight:600;margin-bottom:6px">אין מנויים עדיין</div><div style="font-size:13px">לחץ "+ הוסף מנוי" כדי להתחיל לעקוב</div></div>';
    return;
  }

  // Sort: active first, then by price
  const sorted=[...allSubs].sort((a,b)=>(b.active?1:0)-(a.active?1:0)||b.price-a.price);

  el.innerHTML=sorted.map(s=>{
    const icon=ICONS[s.cat]||'🔄';
    const catLbl=CAT[s.cat]||s.cat;
    let expHTML='';
    if(s.exp){
      const d=new Date(s.exp);
      const diff=Math.round((d-today)/(1000*60*60*24));
      if(diff<0) expHTML='<span style="font-size:11px;color:var(--red);font-weight:700">פג תוקף!</span>';
      else if(diff<=30) expHTML='<span style="font-size:11px;color:var(--amber);font-weight:700">פג תוקף בעוד '+diff+' ימים</span>';
      else expHTML='<span style="font-size:11px;color:var(--t3)">תוקף: '+s.exp+'</span>';
    }
    return '<div class="card" style="margin-bottom:.75rem;opacity:'+(s.active?'1':'.5')+'">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<div style="font-size:1.8rem;flex-shrink:0">'+icon+'</div>' +
      '<div style="flex:1;min-width:0">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
      '<span style="font-size:14px;font-weight:700">'+s.name+'</span>' +
      '<span class="pill '+(CPILL[s.cat]||'p-other')+'">'+catLbl+'</span>' +
      (s.active?'<span style="font-size:10px;font-weight:700;background:rgba(0,229,160,.15);color:var(--green);padding:2px 7px;border-radius:99px">פעיל</span>':'<span style="font-size:10px;background:var(--bg3);color:var(--t3);padding:2px 7px;border-radius:99px">מושהה</span>') +
      '</div>' +
      '<div style="display:flex;gap:12px;align-items:center;margin-top:5px;flex-wrap:wrap">' +
      '<span style="font-size:15px;font-weight:800;color:var(--red)">₪'+s.price+'/חודש</span>' +
      (s.day?'<span style="font-size:12px;color:var(--t2)">חיוב: ה-'+s.day+' בחודש</span>':'') +
      expHTML +
      (s.note?'<span style="font-size:12px;color:var(--t3)">'+s.note+'</span>':'') +
      '</div></div>' +
      '<div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">' +
      '<button class="btn btn-sm btn-ic" onclick="openAddSub(\'' + s.id + '\')" style="font-size:11px">✏️ ערוך</button>' +
      '<button class="btn btn-sm" onclick="toggleSub(\'' + s.id + '\')" style="font-size:11px;color:var(--amber);">'+(s.active?'⏸ השהה':'▶ הפעל')+'</button>' +
      '<button class="btn btn-sm btn-r" onclick="delSub(\'' + s.id + '\')" style="font-size:11px">🗑 מחק</button>' +
      '</div></div></div>';
  }).join('');
}

function changePass() {
  const p1 = document.getElementById('new-pass').value;
  const p2 = document.getElementById('new-pass2').value;
  if (!p1 || p1.length < 4) { toast('הסיסמה חייבת להיות לפחות 4 תווים', 'amber'); return; }
  if (p1 !== p2) { toast('הסיסמאות אינן תאמות', 'red'); return; }
  localStorage.setItem('kc3_pass', p1);
  document.getElementById('new-pass').value = '';
  document.getElementById('new-pass2').value = '';
  toast('✓ סיסמה שונתה בהצלחה', 'green');
}

function resetAll(){if(!confirm('בטוח? כל הנתונים ימחקו!'))return;localStorage.clear();txns=[];budgets={};savGoal=10000;recurring=[];investments=[];renderAll();renderStocks();buildStkCharts();toast('✓ כל הנתונים נמחקו','amber');}
function resetTxns(){if(!confirm('למחוק את כל התנועות?'))return;txns=[];renderAll();toast('✓ תנועות נמחקו','amber');}
function resetInv(){if(!confirm('למחוק את כל ההשקעות?'))return;investments=[];save();renderStocks();buildStkCharts();toast('✓ השקעות נמחקו','amber');}

function exportXlsx(){const rows=[...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(t=>({'תאריך':t.date,'סוג':t.type==='income'?'הכנסה':t.type==='savings'?'חיסכון':'הוצאה','תיאור':t.desc,'קטגוריה':CAT[t.cat]||t.cat,'סכום':t.amount}));const ws=XLSX.utils.json_to_sheet(rows,{header:['תאריך','סוג','תיאור','קטגוריה','סכום']});const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'תנועות');const mt=curMt(),inc=mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),exp=mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),sav=mt.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0),invT=investments.reduce((s,i)=>s+iILS(i),0),allSav=txns.filter(t=>t.type==='savings').reduce((s,t)=>s+t.amount,0);const ws2=XLSX.utils.json_to_sheet([{'שדה':'הכנסות','סכום':inc},{'שדה':'הוצאות','סכום':exp},{'שדה':'חיסכון','סכום':sav},{'שדה':'מאזן לפני חיסכון','סכום':inc-exp},{'שדה':'מאזן אחרי חיסכון','סכום':inc-exp-sav},{'שדה':'חיסכון כולל','סכום':allSav},{'שדה':'השקעות','סכום':invT},{'שדה':'שווי נטו','סכום':allSav+invT}]);XLSX.utils.book_append_sheet(wb,ws2,'סיכום');if(investments.length){const iR=investments.map(i=>({'שם':i.name,'סוג':ITYPE[i.type]||i.type,'עלות':i.cost||0,'שווי נוכחי':iCurVal(i),'רווח/הפסד':iPnL(i),'%':iPct(i)}));XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(iR),'השקעות');}XLSX.writeFile(wb,'כסף_חכם_'+new Date().toISOString().slice(0,10)+'.xlsx');}

let isDark=true;
function toggleTheme(){isDark=!isDark;if(!isDark){document.documentElement.style.setProperty('--bg','#F0F4F8');document.documentElement.style.setProperty('--bg2','#E8EDF2');document.documentElement.style.setProperty('--bg3','#DDE3EA');document.documentElement.style.setProperty('--card','#FFFFFF');document.documentElement.style.setProperty('--card2','#F5F7FA');document.documentElement.style.setProperty('--border','rgba(0,0,0,0.08)');document.documentElement.style.setProperty('--border2','rgba(0,0,0,0.15)');document.documentElement.style.setProperty('--t1','#0F172A');document.documentElement.style.setProperty('--t2','#475569');document.documentElement.style.setProperty('--t3','#94A3B8');document.documentElement.style.setProperty('--green','#059669');document.documentElement.style.setProperty('--gd','#047857');document.documentElement.style.setProperty('--gl','rgba(5,150,105,0.08)');document.documentElement.style.setProperty('--gll','rgba(5,150,105,0.04)');document.documentElement.style.setProperty('--red','#DC2626');document.documentElement.style.setProperty('--blue','#1D4ED8');document.documentElement.style.setProperty('--amber','#D97706');document.getElementById('theme-lbl').textContent='מצב כהה';localStorage.setItem('kc3_th','light');}else{document.documentElement.removeAttribute('style');document.getElementById('theme-lbl').textContent='מצב בהיר';localStorage.setItem('kc3_th','dark');}Chart.defaults.color=isDark?'#4A6480':'#64748B';}

// ─── INITIALIZATION ─────────────────────────────────────────────────────────
async function initApp(){
  loadChecking();
  loadSubs();
  initLock();

  if(localStorage.getItem('kc3_th')==='light'){isDark=true;toggleTheme();}
  const today=new Date();
  document.getElementById('t-date').value=today.toISOString().split('T')[0];
  document.getElementById('inv-month').value=nowMk();
  document.getElementById('upd-mon').value=nowMk();
  const days=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  document.getElementById('dash-date').textContent=days[today.getDay()]+', '+today.toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'});
  Chart.defaults.color='#4A6480';
  document.querySelectorAll('.modal-bg').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show');}));

  // Load data based on auth state
  // If user is authenticated (userKey starts with 'users/'), load from Firebase
  // If guest mode (userKey === 'guest'), load from localStorage with demo data fallback
  let loaded = false;
  
  if (userKey && userKey.startsWith('users/')) {
    // Authenticated user - load from Firebase (this is the source of truth)
    if(window.firebaseLoad){
      try{
        const fbData = await window.firebaseLoad();
        if(fbData && fbData.txns){
          // Firebase data is the source of truth for authenticated users
          txns = fbData.txns || [];
          budgets = fbData.budgets || {};
          savGoal = fbData.savGoal || 10000;
          recurring = fbData.recurring || [];
          investments = fbData.investments || [];
          if(fbData.checkingData) checkingData = fbData.checkingData;
          if(fbData.subscriptions) subscriptions = fbData.subscriptions;
          // Sync to localStorage for offline access
          try{
            localStorage.setItem('kc3_t',JSON.stringify(txns));
            localStorage.setItem('kc3_b',JSON.stringify(budgets));
            localStorage.setItem('kc3_g',String(savGoal));
            localStorage.setItem('kc3_r',JSON.stringify(recurring));
            localStorage.setItem('kc3_i',JSON.stringify(investments));
            localStorage.setItem('kc3_ck',JSON.stringify(checkingData));
            localStorage.setItem('kc3_subs',JSON.stringify(subscriptions));
          }catch(e){}
          loaded = true;
          const si=document.createElement('div');
          si.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,229,160,0.15);border:1px solid rgba(0,229,160,0.3);color:#00E5A0;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;z-index:999;direction:rtl;white-space:nowrap';
          si.textContent='☁️ סונכרן מהענן';
          document.body.appendChild(si);
          setTimeout(()=>si.remove(),2000);
        }
      }catch(e){ 
        console.warn('Firebase load error:',e); 
      }
    }
  } else if (userKey === 'guest') {
    // Guest mode - load from localStorage with demo data fallback
    load();
    loaded = true;
  }

  // If still not loaded, use demo data
  if(!loaded) load();

  renderAll();
}

// Initialize app immediately
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});
