export const DATA=[
 ["2008/09",23405],["2009/10",26009],["2010/11",24531],["2011/12",31627],["2012/13",47274],["2013/14",36266],
 ["2014/15",42963],["2015/16",35512],["2016/17",36506],["2017/18",25219],["2019",19477],["2020",24947],
 ["2021",42207],["2022",58315],["2023",39572],["2024",92415],["2025",82858],["2026",88649]];
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const prog=(t,a,b)=>clamp((t-a)/(b-a));
export const out3=x=>1-Math.pow(1-x,3);
export const outBack=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
export const inOut=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
export const K=n=>"$"+(n/1000).toFixed(1)+"K";
export const money=n=>"$"+Math.round(n).toLocaleString("en-US");
/* fade and slide an element in from t=a */
export function rise(el,t,a,dur=.7,dist=40){const p=out3(prog(t,a,a+dur));el.style.opacity=p;el.style.translate=`0 ${(1-p)*dist}px`;return p}
export const fontsReady=()=>document.fonts.ready.then(()=>Promise.all([...document.fonts].map(f=>f.load().catch(()=>{}))));
