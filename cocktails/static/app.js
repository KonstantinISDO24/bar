const DRINKS = (window.DRINKS||[]);
const BOTTLED = (window.BOTTLED||[]);
const FLAVORS = ["Сладкий","Кислый","Горький","Острый","Игристый"];
const FLAVOR_CSS = {"Сладкий":"--adel","Кислый":"--delta","Горький":"--bron","Острый":"--flan","Игристый":"--cyan"};
const TAG_CSS = {"Сладкий":"--adel","Кислый":"--delta","Горький":"--bron","Острый":"--flan","Игристый":"--cyan"};

let state={tab:"name",flavor:null,type:null,sel:null,playing:false,query:""};
const listEl=document.getElementById("list");
const detailEl=document.getElementById("detail");
const statusEl=document.getElementById("status");
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const flavorColor=t=>cssv(FLAVOR_CSS[t]||"--dim");

function tagDots(tags){
  // small colored squares; first = flavor color, others tinted
  const pal=[flavorColor(tags[0]), cssv("--cyan2"), cssv("--purple")];
  return tags.map((t,i)=>'<i style="background:'+pal[i%pal.length]+'"></i>').join("");
}

function makeRow(d,idx){
  const ac=flavorColor(d.tags[0]);
  const b=document.createElement("button");
  b.className="row"+(d.bonus?" bn":"")+(state.sel===idx?" sel":"");
  b.style.setProperty("--ac",ac);
  b.innerHTML='<span class="rn">'+String(d.n).padStart(2,"0")+'</span>'+
    '<span class="row-main"><span class="row-name">'+d.ru+'</span><span class="row-en">'+d.en+'</span></span>'+
    '<span class="row-dots">'+tagDots(d.tags)+'</span>';
  b.onclick=()=>selectDrink(idx);
  return b;
}

function renderList(){
  listEl.innerHTML="";
  if(state.query){
    var q=state.query.toLowerCase();
    var res=DRINKS.map(function(d,i){return [d,i];}).filter(function(p){
      return p[0].ru.toLowerCase().indexOf(q)>-1 || p[0].en.toLowerCase().indexOf(q)>-1;});
    var hd=document.createElement("div");hd.className="grouphd";
    hd.textContent="Поиск · "+res.length+" совпадений";listEl.appendChild(hd);
    if(!res.length){var e=document.createElement("div");e.className="grouphd";
      e.style.color="var(--dim)";e.textContent="Ничего не найдено";listEl.appendChild(e);}
    res.forEach(function(p){listEl.appendChild(makeRow(p[0],p[1]));});
    return;
  }
  if(state.tab==="bottled"){
    const hd=document.createElement("div");hd.className="grouphd";hd.textContent="Бутылочные напитки";listEl.appendChild(hd);
    BOTTLED.forEach((b,i)=>{
      const btn=document.createElement("button");btn.className="row";btn.style.setProperty("--ac",cssv("--cyan"));
      btn.innerHTML='<span class="rn">★</span><span class="row-main"><span class="row-name">'+b.ru+'</span><span class="row-en">'+b.en+'</span></span>';
      btn.onclick=()=>showBottled(i);listEl.appendChild(btn);
    });return;
  }
  if(state.tab==="flavor"){
    const chips=document.createElement("div");chips.className="subchips";
    FLAVORS.forEach(f=>{const c=document.createElement("button");c.className="chip"+(state.flavor===f?" active":"");
      c.textContent=f;c.onclick=()=>{state.flavor=(state.flavor===f?null:f);renderList();};chips.appendChild(c);});
    listEl.appendChild(chips);
    DRINKS.map((d,i)=>[d,i]).filter(([d])=>!state.flavor||d.tags[0]===state.flavor).forEach(([d,i])=>listEl.appendChild(makeRow(d,i)));
    return;
  }
  if(state.tab==="type"){
    const chips=document.createElement("div");chips.className="subchips";
    [["canon","Канон бара"],["bonus","Внештатная"]].forEach(([v,t])=>{const c=document.createElement("button");
      c.className="chip"+(state.type===v?" active":"");c.textContent=t;c.onclick=()=>{state.type=(state.type===v?null:v);renderList();};chips.appendChild(c);});
    listEl.appendChild(chips);
    (state.type?[state.type]:["canon","bonus"]).forEach(g=>{
      const hd=document.createElement("div");hd.className="grouphd";hd.textContent=(g==="canon"?"Канон бара":"Внештатная стойка");listEl.appendChild(hd);
      DRINKS.map((d,i)=>[d,i]).filter(([d])=>g==="bonus"?d.bonus:!d.bonus).forEach(([d,i])=>listEl.appendChild(makeRow(d,i)));
    });return;
  }
  DRINKS.map((d,i)=>[d,i]).sort((a,b)=>a[0].ru.localeCompare(b[0].ru,"ru")).forEach(([d,i])=>listEl.appendChild(makeRow(d,i)));
}

function selectDrink(idx){
  state.sel=idx;const d=DRINKS[idx];const ac=flavorColor(d.tags[0]);
  const tags=d.tags.map(t=>'<span class="d-tag'+(d.bonus?' bn':'')+'">'+t+'</span>').join("");
  const recipe=d.recipe.map(r=>'<li>'+r+'</li>').join("");
  const mixline=["A","B","F","D","K"].filter(k=>d.mix[k]).map(k=>{
    const nm={A:"Adelhyde",B:"Bronson",F:"Flanergide",D:"Pwd Delta",K:"Karmotrine"}[k];
    return nm+" "+(k==="K"&&d.opt?"(опц)":d.mix[k]);}).join(" · ");
  detailEl.style.setProperty("--ac",ac);
  detailEl.innerHTML='<div class="d-band"></div>'+
    '<div class="d-en">'+d.en+'</div><div class="d-name">'+d.ru+'</div>'+
    '<div class="d-tags">'+tags+'</div>'+
    '<div class="sec sx-mix" style="border-top:none;padding-top:4px"><h4>Микс BTC</h4><p class="mixline">'+(mixline||"—")+'</p></div>'+
    '<div class="sec"><h4>Реальный рецепт'+(d.based?' · на основе '+d.based:'')+'</h4><ul class="recipe">'+recipe+'</ul>'+
      '<p class="method">'+d.method+'</p><p class="note">'+d.note+'</p></div>'+
    '<div class="sec sx-dos"><h4>Досье</h4><div class="d-en-tag">// origin · '+d.en+'</div><p class="dossier">'+d.dossier+'</p></div>';
  statusEl.textContent="Открыто: "+d.ru+" · "+(d.bonus?"внештатная стойка":"канон бара");
  detailEl.scrollTop=0;renderList();
  if(window.matchMedia("(max-width:560px)").matches) detailEl.scrollIntoView({behavior:"smooth",block:"start"});
}

function showBottled(i){
  state.sel=null;const b=BOTTLED[i];
  detailEl.style.setProperty("--ac",cssv("--cyan"));
  detailEl.innerHTML='<div class="d-band"></div><div class="d-en">'+b.en+'</div><div class="d-name">'+b.ru+'</div>'+
    '<div class="sec" style="border-top:none;padding-top:6px"><p class="dossier">'+b.desc+'</p></div>';
  statusEl.textContent="Открыто: "+b.ru+" · бутылочное";detailEl.scrollTop=0;
}

document.querySelectorAll(".tab").forEach(t=>{t.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");
  state.tab=t.dataset.tab;state.query="";var se=document.getElementById("search");if(se)se.value="";renderList();};});

/* faux music player */
const tracks=["A Neon Glow Lights...","Your Love is a Drug","Friendly Reminder","Every Day is Night","Good Friends","Karma Cab"];
let ti=0;const player=document.getElementById("player");
document.getElementById("playbtn").onclick=function(){state.playing=!state.playing;player.classList.toggle("playing",state.playing);this.textContent=state.playing?"⏸":"▶";};
document.getElementById("next").onclick=()=>{ti=(ti+1)%tracks.length;document.getElementById("track").textContent=tracks[ti];};
document.getElementById("prev").onclick=()=>{ti=(ti-1+tracks.length)%tracks.length;document.getElementById("track").textContent=tracks[ti];};

/* search */
var searchEl=document.getElementById("search");
var clearEl=document.getElementById("searchclear");
if(searchEl){searchEl.addEventListener("input",function(){state.query=this.value.trim();renderList();});}
if(clearEl){clearEl.addEventListener("click",function(){state.query="";if(searchEl){searchEl.value="";searchEl.focus();}renderList();});}

renderList();

/* news ticker (data injected by Django template as window.NEWS) */
(function(){
  var news = window.NEWS || [];
  var track = document.getElementById("ticker");
  if(track && news.length){
    var html = news.map(function(t){return '<span class="ticker-item">'+t+'</span>';}).join("");
    track.innerHTML = html + html; // duplicated for a seamless loop
  }
})();

