import {prog,out3,outBack,rise,fontsReady} from "./lib.js";
import {TIMING} from "./timing.js";
/* A scene of cards, each brought in on the sentence that talks about it.
   cfg: {scene, tag, title, cards:[{big, head, text, cue}], cols, foot} */
export function cards(cfg){
  const tm=TIMING[cfg.scene],D=tm.dur;
  const app=document.getElementById("app");
  app.innerHTML=`<div class="hd"><span class="tag">${cfg.tag}</span><h1 class="disp">${cfg.title}</h1></div>
  <div class="cards" style="grid-template-columns:repeat(${cfg.cols||cfg.cards.length},1fr)">${cfg.cards.map(c=>`<div class="card"><div class="big">${c.big}</div><h3>${c.head}</h3><p>${c.text}</p></div>`).join("")}</div>
  ${cfg.foot?`<p class="foot">${cfg.foot}</p>`:""}`;
  const hd=app.querySelector(".hd"),els=[...app.querySelectorAll(".card")],ft=app.querySelector(".foot");
  return {duration:D,ready:fontsReady(),frame(t){
    rise(hd,t,.15);
    els.forEach((el,k)=>{const a=tm.cues[cfg.cards[k].cue]-.15;const p=prog(t,a,a+.7);el.style.opacity=Math.min(1,p*2.5);el.style.translate=`0 ${(1-out3(p))*60}px`;el.style.scale=String(.9+.1*outBack(p))});
    if(ft)ft.style.opacity=prog(t,tm.cues[0]+1,tm.cues[0]+1.6);
    app.style.opacity=Math.min(prog(t,0,.35),1-prog(t,D-.45,D));
  }};
}
