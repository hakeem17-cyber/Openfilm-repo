import {DATA,clamp,prog,out3,outBack,inOut,K,rise,fontsReady} from "./lib.js";
/* One chapter of the journey: the 18-year chart, with every bar up to this chapter shown
   and this chapter's bars growing in. Bands shade a stretch of years (COVID, part-time, full-time). */
export function chapter(cfg){
  const W=1060,H=640,top=100000;
  const app=document.getElementById("app");
  const bands=cfg.bands||[];
  app.innerHTML=`
  <div class="left">
    <div class="kick"><span class="num">${String(cfg.n).padStart(2,"0")}</span><span class="tag">${cfg.kicker}</span></div>
    <h1 class="disp ttl">${cfg.title}</h1>
    <p class="sub">${cfg.sub}</p>
    <div class="statbox"><div class="stat disp">${cfg.stat}</div><div class="slab">${cfg.statLabel}</div></div>
  </div>
  <div class="chart">
    ${bands.map(b=>`<div class="band ${b.kind}"><span>${b.label}</span></div>`).join("")}
    <div class="grid">${[0,20,40,60,80,100].map(v=>`<div class="gl" style="bottom:${v/100*H}px"><span>$${v}K</span></div>`).join("")}</div>
    <div class="floor" style="bottom:${80/100*H}px"><span>The new floor · $80K</span></div>
    <div class="bars">${DATA.map((d,i)=>`<div class="col"><div class="b" style="height:${d[1]/top*H}px"><span class="v">${K(d[1])}${i===17?"*":""}</span></div><span class="yl">${d[0]}</span></div>`).join("")}</div>
    <svg class="line" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polyline fill="none" stroke="#2A2B2E" stroke-width="4" stroke-linejoin="round" stroke-dasharray="2 10" stroke-linecap="round"/></svg>
    ${(cfg.notes||[]).map(n=>`<div class="note">${n.text}</div>`).join("")}
    ${cfg.foot?`<p class="cfoot">${cfg.foot}</p>`:""}
  </div>`;
  const cols=[...app.querySelectorAll(".col")],slot=W/DATA.length;
  const cx=i=>i*slot+slot/2, cy=i=>H-DATA[i][1]/top*H;
  const pl=app.querySelector("polyline"),notes=[...app.querySelectorAll(".note")],bandEls=[...app.querySelectorAll(".band")];
  const parts=[...app.querySelector(".left").children];
  const statEl=app.querySelector(".stat"),floorEl=app.querySelector(".floor");
  notes.forEach((el,k)=>{const n=cfg.notes[k];el.style.left=cx(n.i)+"px";el.style.bottom=(H-cy(n.i)+70+(n.dy||0))+"px"});
  bandEls.forEach((el,k)=>{const b=bands[k];el.style.left=(b.from*slot+2)+"px";el.style.width=((b.to-b.from+1)*slot-4)+"px"});
  const D=cfg.duration,span=cfg.to-cfg.from+1;
  return {duration:D,ready:fontsReady(),frame(t){
    parts.forEach((el,k)=>rise(el,t,.15+k*.18));
    if(cfg.countTo!=null){const p=out3(prog(t,1.2,3));statEl.textContent=cfg.countFmt(cfg.countTo*p)}
    cols.forEach((c,i)=>{
      const b=c.querySelector(".b"),v=c.querySelector(".v"),yl=c.querySelector(".yl");
      let s,o,lab;
      if(i<cfg.from){s=1;o=1;lab=0}
      else if(i<=cfg.to){const a=.8+(i-cfg.from)*(1.6/span);s=outBack(prog(t,a,a+.8));o=1;lab=prog(t,a+.5,a+.9)}
      else {s=0;o=0;lab=0}
      const up=DATA[i][1]>=(DATA[i-1]||[0,0])[1];
      b.style.scale=`1 ${Math.max(0,s)}`;b.style.opacity=o;
      b.style.background=i<cfg.from?"#cfc9bd":(i===0?"#8d8f96":(up?"#E8742A":"#3A3B3F"));
      b.style.borderColor=i<cfg.from?"#b9b3a7":"#3A3B3F";
      v.style.opacity=lab;v.style.translate=`-50% ${(1-lab)*12}px`;v.style.scale=`1 ${s>0.05?1/Math.max(s,.05):1}`;
      yl.style.opacity=i>cfg.to?.3:(i<cfg.from?.55:1);yl.style.color=(i>=cfg.from&&i<=cfg.to)?"#C85A14":"#3A3B3F";
    });
    /* trend line through the bar tops, drawn as the bars grow */
    const lp=inOut(prog(t,.9,2.9)),last=Math.max(0,cfg.from-1)+(cfg.to-Math.max(0,cfg.from-1))*lp,pts=[];
    const j=Math.floor(last),f=last-j;
    for(let i=0;i<=j;i++)pts.push([cx(i),cy(i)]);
    if(f>0&&j+1<DATA.length)pts.push([cx(j)+(cx(j+1)-cx(j))*f,cy(j)+(cy(j+1)-cy(j))*f]);
    pl.setAttribute("points",pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" "));
    notes.forEach((el,k)=>{const a=cfg.notes[k].at||3.2;const p=prog(t,a,a+.6);el.style.opacity=clamp(p*2);el.style.scale=String(.7+.3*outBack(p))});
    bandEls.forEach((el,k)=>{const a=bands[k].at??.5,p=out3(prog(t,a,a+.8));el.style.opacity=p;el.style.clipPath=`inset(0 0 0 0)`;el.style.scale=`1 ${.2+.8*p}`});
    if(cfg.floor){const p=out3(prog(t,cfg.floorAt||2.8,(cfg.floorAt||2.8)+1));floorEl.style.opacity=p>0?1:0;floorEl.style.clipPath=`inset(-60px ${(1-p)*100}% -10px 0)`}else floorEl.style.opacity=0;
    const cf=app.querySelector(".cfoot");if(cf)cf.style.opacity=prog(t,3.5,4.2);
    app.style.opacity=1-prog(t,D-.45,D);
  }};
}
