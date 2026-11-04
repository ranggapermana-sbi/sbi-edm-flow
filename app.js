(function(){
"use strict";
/* ---------- reference data ---------- */
const BRANDS={
  belinn:{name:"Swiss-Belinn",hex:"#ab5987"}, belcourt:{name:"Swiss-Belcourt",hex:"#c2aed3"}, belhotel:{name:"Swiss-Belhotel",hex:"#ee4e31"},
  belboutique:{name:"Swiss-Belboutique",hex:"#fdb814"}, belresort:{name:"Swiss-Belresort",hex:"#1177ad"}, belexpress:{name:"Swiss-Belexpress",hex:"#00a651"},
  belresidences:{name:"Swiss-Belresidences",hex:"#6d6e71"}, maua:{name:"MĀUA",hex:"#c29472"}, zest:{name:"Zest",hex:"#b1d34a"},
  belvillas:{name:"Swiss-Belvillas",hex:"#00a9d2"}, belsuites:{name:"Swiss-Belsuites",hex:"#fdb813"}, grand:{name:"Grand Swiss-Belhotel",hex:"#d8c890"}, bohemia:{name:"Bohemia",hex:"#404041"}
};
const HOTEL_ROWS=`SSVP|Swiss-Belsuites Victoria Park|belsuites
SBAM|Swiss-Belhotel Ambon|belhotel
ZHAM|Zest by Swiss-Belhotel Ambon|zest
SRPE|Swiss-Belresort Pecatu, Bali|belresort
SCSU|Swiss-Belcourt Sunset|belcourt
SEKU|Swiss-Belexpress Kuta, Bali|belexpress
SBKU|Swiss-Belhotel Rainforest, Kuta, Bali|belhotel
SVUM|Swiss-Belvillas Umalas|belvillas
MANP|MĀUA Nusa Penida, Bali by Swiss-Belhotel|maua
SISE|Swiss-Belinn Seminyak|belinn
ATBB|Anagata Tanjung Benoa Bali|belhotel
MAOU|MĀUA Olea, Ubud by Swiss-Belhotel|maua
SSUH|Sima Hotel Sumba|belhotel
SRAU|Ashva Swiss-Belresort Ubud|belresort
SRTA|Swiss-Belresort Belitung|belresort
SVNB|Swiss-Belvillas Solavita Binh Tien|belvillas
SBBR|Swiss-Belhotel Woolloongabba, Brisbane|belhotel
SIDO|Swiss-Belinn Doha|belinn
HSSB|Hanoi Signature by Swiss-Belhotel|belhotel
ETSA|Epic Tower Swiss-Belresidences Hanoi|belresidences
SBPP|Swiss-Belhotel Pangkalpinang|belhotel
SRDA|Swiss-Belresort Dago Heritage, Bandung|belresort
ZHBA|Zest by Swiss-Belhotel Sukajadi, Bandung|zest
SECI|Swiss-Belexpress Cilegon|belexpress
SIMC|Swiss-Belinn Modern Cikande|belinn
SE379|Swiss-Belexpress Rest Area KM 379|belexpress
HCC|Hotel Ciputra Cibubur|belhotel
SICB|Swiss-Belinn Cibitung|belinn
SICI|Swiss-Belinn Cikarang|belinn
SCBO|Swiss-Belcourt Bogor|belcourt
SBBO|Swiss-Belhotel Bogor|belhotel
SIBO|Swiss-Belinn Bogor|belinn
ZHBO|Zest by Swiss-Belhotel Bogor|zest
SE164|Swiss-Belexpress Rest Area KM. 164|belexpress
SE166|Swiss-Belexpress Rest Area KM. 166|belexpress
SE260|Swiss-Belexpress Rest Area KM. 260B|belexpress
SBCR|Swiss-Belhotel Cirebon|belhotel
SIIN|Swiss-Belinn Indramayu|belinn
SECD|Swiss-Belexpress Cideng|belexpress
SBAI|Swiss-Belhotel Airport, Jakarta|belhotel
SBPI|Swiss-Belhotel Pondok Indah, Jakarta|belhotel
SICA|Swiss-Belinn Cawang|belinn
SIKE|Swiss-Belinn Kemayoran|belinn
SISA|Swiss-Belinn Simatupang, Jakarta|belinn
SIWH|Swiss-Belinn Wahid Hasyim|belinn
SAKJ|Swiss-Belresidences Kalibata, Jakarta|belresidences
SARE|Swiss-Belresidences Rasuna Epicentrum|belresidences
ZHAI|Zest by Swiss-Belhotel Airport, Jakarta|zest
SBKA|Swiss-Belhotel Karawang|belhotel
SIMA|Swiss-Belinn Malang|belinn
SBSL|Swiss-Belhotel Solo|belhotel
ZHPS|Zest by Swiss-Belhotel Parang Raja, Solo|zest
SCSR|Swiss-Belcourt Serpong|belcourt
SBSR|Swiss-Belhotel Serpong|belhotel
GBDA|Grand Swiss-Belhotel Darmo|grand
CWS|Hotel Ciputra World Surabaya|grand
SEJS|Swiss-Belexpress Jemursari|belexpress
SIAS|Swiss-Belinn Airport, Surabaya|belinn
SIMY|Swiss-Belinn Manyar|belinn
SISU|Swiss-Belinn Tunjungan|belinn
SQYO|Swiss-Belboutique Yogyakarta|belboutique
SEYO|Swiss-Belexpress Yogyakarta|belexpress
SBYO|Swiss-Belhotel Airport Yogyakarta|belhotel
SIYO|Next Hotel Yogyakarta/ Swiss-Belinn Yogyakarta|belinn
SBBK|Swiss-Belhotel Balikpapan|belhotel
SIBK|Swiss-Belinn Balikpapan|belinn
SBB|Swiss-Belhotel Borneo Banjarmasin|belhotel
LHSB|Lotusa Batulicin by Swiss-Belhotel|belhotel
SBPA|Swiss-Belhotel Danum, Palangka Raya|belhotel
SBBS|Swiss-Belhotel Borneo Samarinda|belhotel
SISI|Swiss-Belinn Singkawang|belinn
SBTK|Swiss-Belhotel Tarakan|belhotel
SCKU|Swiss-Belcourt Kupang|belcourt
SCLO|Swiss-Belcourt Lombok|belcourt
SBCB|Swiss-Belhotel Cendrawasih Biak|belhotel
SEJA|Swiss-Belexpress Jayapura|belexpress
SBJ|Swiss-Belhotel Jayapura|belhotel
SAJF|Swiss-Belresidences Juffair|belresidences
SSAJ|Swiss-Belsuites Admiral Juffair|belsuites
SBMI|Swiss-Belhotel Manokwari|belhotel
SBME|Swiss-Belhotel Merauke|belhotel
SBSO|Swiss-Belhotel Sorong|belhotel
SITM|Swiss-Belinn Timika|belinn
GBHB|Grand Swiss-Belhotel Harbour Bay, Batam|grand
SEKB|Swiss-Belexpress K-Square, Batam|belexpress
SBHB|Swiss-Belhotel Harbour Bay, Batam|belhotel
RISB|Riahi Villas by Swiss-Belhotel, Nirup Island|belvillas
SIB|Swiss-Belinn Baloi Batam|belinn
ZHHB|Zest by Swiss-Belhotel Harbourbay, Batam|zest
SBKN|Swiss-Belhotel Kendari|belhotel
SILU|Swiss-Belinn Luwuk|belinn
LTSB|Lanta Thip House by Swiss-Belhotel|belhotel
SBKT|Swiss-Belhotel Kuantan|belhotel
SQBA|Swiss-Belboutique Bneid Al Gar|belboutique
SIAH|Swiss-Belinn Al Sharq|belinn
SCMK|Swiss-Belcourt Makassar|belcourt
VGSB|Valero Grand Suites by Swiss-Belhotel|belhotel
SBBL|Swiss-Belhotel Blulane|belhotel
GBME|Grand Swiss-Belhotel Melaka|grand
SIMU|Swiss-Belinn Airport Muscat|belinn
NSSB|Nairobi Safari Club by Swiss-Belhotel|belhotel
SINA|Swiss-Belinn Nairobi|belinn
SQNA|Swiss-Belhotel Napier|belhotel
SBNI|Swiss-Belhotel Nizwa, Oman|belhotel
SBMK|Swiss-Belhotel Waterfront Makassar|belhotel
SIMK|Swiss-Belinn Panakkukang Makassar|belinn
SBMD|Swiss-Belhotel Maleosan Manado|belhotel
SBSM|Swiss-Belhotel Sentra Manado|belhotel
SEPA|Swiss-Belexpress Palu|belexpress
SBSP|Swiss-Belhotel Silae Palu|belhotel
SBJA|Swiss-Belhotel Jambi|belhotel
SBLA|Swiss-Belhotel Lampung|belhotel
SIGM|Swiss-Belinn Gajah Mada Medan|belinn
SIMD|Swiss-Belinn Medan|belinn
SIPU|Swiss-Belinn Ska Pekanbaru|belinn
SRCP|Swiss-Belhotel Cirebon|belhotel
SVCP|Swiss-Belvillas Coronet Peak|belvillas
SSPQ|Swiss-Belsuites Pounamu Queenstown|belsuites
SBSE|Swiss-Belhotel Seef|belhotel
TYSB|The York Sydney by Swiss-Belhotel|belhotel
SRTY|Swiss-Belresort Tuyen Lam, Dalat|belresort`;
const HOTELS=HOTEL_ROWS.split("\n").map(l=>{const[code,name,brand]=l.split("|").map(s=>s.trim());return{code,name,brand};}).sort((a,b)=>a.name.localeCompare(b.name));
const HOTEL=Object.fromEntries(HOTELS.map(h=>[h.code,h]));

const MANUAL=[{sec:"",items:[
 ["C1","Hero and offer images are HD (sharp, readable text on the visuals)"],
 ["C2","Footer banner is the latest version from Group Marcomm"],
 ["C3","Hotel address and local phone number in the footer are correct"],
 ["C4","Test email sent with Send Example and every link opens the right page"]
]}];
const MANUAL_IDS=MANUAL.flatMap(g=>g.items.map(i=>i[0]));
const OFFER_LABEL={room:"Room package",fnb:"F&B package",social:"Social event",meeting:"Meeting package"};
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
function el(tag,props,...kids){const e=document.createElement(tag);if(props)for(const[k,v]of Object.entries(props)){if(v==null||v===false)continue;if(k==="class")e.className=v;else if(k==="text")e.textContent=v;else if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?"":v);}for(const k of kids.flat()){if(k==null||k===false)continue;e.append(k instanceof Node?k:document.createTextNode(String(k)));}return e;}
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,3600);}
function nowJkt(){return new Date(Date.now()+7*3600e3).toISOString().slice(0,16);}
/* earliest start: 3 working days (Mon–Fri) after today, Jakarta date */
function minStart(base){const d=new Date((base||nowJkt()).slice(0,10)+"T00:00:00Z");let n=0;while(n<3){d.setUTCDate(d.getUTCDate()+1);const w=d.getUTCDay();if(w!==0&&w!==6)n++;}return d.toISOString().slice(0,10)+"T00:00";}
function addHours(s,h){return new Date(Date.parse(s+":00Z")+h*3.6e6).toISOString().slice(0,16);}
function nowIso(){return new Date().toISOString();}
function hoursBetween(a,b){return(Date.parse(b+":00Z")-Date.parse(a+":00Z"))/3.6e6;}
function dparts(s){const[y,m,d]=s.slice(0,10).split("-");return{y,m:+m,d};}
function expInternal(code,start){if(!code||!start)return"";const p=dparts(start);return`${code} - ${p.d} ${MON[p.m-1]} ${p.y}`;}
function expUtm(code,start){if(!code||!start)return"";const p=dparts(start);return`whizz-edm-${code}-${p.d}${MON[p.m-1]}${p.y}`;}
function fmtDate(s){if(!s)return"—";const p=dparts(s);return`${p.d} ${MON[p.m-1]} ${p.y} ${s.slice(11,16)}`;}
function fmtWhen(iso){if(!iso)return"—";const d=new Date(Date.parse(iso)+7*3600e3).toISOString();return fmtDate(d.slice(0,16));}
function brandOf(code){const h=HOTEL[code];return h?BRANDS[h.brand]:null;}
const ICON={pass:"✓",warn:"!",fail:"✕",todo:"·",info:"i"};
function dot(s){return el("span",{class:"dot s-"+s,"aria-label":s},ICON[s]||"·");}
const STATUS={draft:["Draft","s-todo"],pending:["Submitted","s-warn"],reviewing:["In review","s-warn"],revision:["Needs revision","s-fail"],approved:["Approved","s-pass"],scheduled:["Scheduled","s-pass"]};
const STAGE_IDX={pending:0,reviewing:1,approved:2,scheduled:3,revision:2};
function stepBar(st){if(st==="draft")return null;const i=STAGE_IDX[st];return el("span",{class:"steps","aria-hidden":"true"},[0,1,2,3].map(k=>el("i",{class:k<i||(k===i&&(st==="scheduled"||st==="approved"))?"on":k===i?(st==="revision"?"bad":"now"):""})));}
function stepper(st){const names=["Submitted","In review",st==="revision"?"Needs revision":"Approved","Scheduled"];const i=st==="draft"?-1:STAGE_IDX[st];
  return el("div",{class:"stepper"},names.map((n,k)=>el("div",{class:k<i||(k===i&&(st==="approved"||st==="scheduled"))?"on":k===i?(st==="revision"?"bad":"now"):""},n)));}
function statusPill(st){const[l,c]=STATUS[st]||STATUS.draft;return el("span",{class:"pill "+c},l);}

/* ---------- color + html parsing ---------- */
function normColor(v){if(!v)return null;v=String(v).trim().toLowerCase();let m=v.match(/^#([0-9a-f]{3})\b/);if(m&&v.length===4)return"#"+m[1].split("").map(c=>c+c).join("");m=v.match(/^#([0-9a-f]{6})/);if(m)return"#"+m[1];m=v.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);if(m)return"#"+[m[1],m[2],m[3]].map(n=>(+n).toString(16).padStart(2,"0")).join("");return v;}
function styleProp(node,prop){for(let n=node,i=0;n&&n.nodeType===1&&i<4;n=n.parentElement,i++){const s=n.getAttribute("style")||"";const m=s.match(new RegExp("(?:^|;)\\s*"+prop+"\\s*:\\s*([^;!]+)","i"));if(m)return m[1].trim();if(prop==="background-color"){const b=n.getAttribute("bgcolor");if(b)return b;const m2=s.match(/(?:^|;)\s*background\s*:\s*([^;]+)/i);if(m2){const c=m2[1].match(/#[0-9a-f]{3,6}|rgba?\([^)]+\)/i);if(c)return c[0];}}if(prop==="color"){const c=n.getAttribute("color");if(c)return c;}}return null;}

/* The pasted HTML is rendered in a hidden, script-free frame so colors come from
   the browser's computed styles. Builder emails keep styles in <style> blocks
   (id and class rules), not only inline, so reading attributes alone misses them. */
const checkFrame=el("iframe",{sandbox:"allow-same-origin",title:"HTML check frame","aria-hidden":"true",tabindex:"-1",style:"position:absolute;left:-10000px;top:0;width:700px;height:900px;border:0;visibility:hidden"});
document.body.append(checkFrame);
let htmlCache={key:null,result:null,pendingKey:null};
function loadFrame(html){return new Promise(res=>{let done=false;const fin=()=>{if(done)return;done=true;checkFrame.removeEventListener("load",fin);res(checkFrame.contentDocument);};checkFrame.addEventListener("load",fin);checkFrame.srcdoc=html;setTimeout(fin,5000);});}
const isClear=c=>!c||c==="transparent"||/rgba\([^)]*,\s*0(\.0+)?\s*\)$/.test(c);
function getHtmlResults(html,brandHex){
  if(!html||!html.trim())return form.locked?[{label:"Email HTML",status:"todo",detail:"Paste the HTML of the revised EDM."}]:[{label:"Email HTML",status:"info",detail:"Not pasted. Alt text, title text, links and exact colors are covered only by your manual checklist."}];
  const key=brandHex+"|"+html.length+"|"+html.slice(0,200)+html.slice(-200)+"|"+html;
  if(htmlCache.key===key)return htmlCache.result;
  if(htmlCache.pendingKey!==key){htmlCache.pendingKey=key;
    loadFrame(html).then(async doc=>{let r;try{const probe=await probeImages(doc);r=htmlChecks(doc,checkFrame.contentWindow,html,brandHex,probe);}catch(e){r=[{label:"Email HTML",status:"warn",detail:"The HTML could not be read. Copy it again from the code view."}];}
      if(htmlCache.pendingKey===key){htmlCache={key,result:r,pendingKey:null};refresh();}});}
  return[{label:"Reading the HTML…",status:"todo",detail:""}];
}
/* Loads every image the email uses (outside the frame) to learn whether it loads and its real pixel size.
   Result per src: {ok,w,h}, or null when it did not answer in time (then it is not judged). */
function imgSrcs(doc){return[...new Set([...doc.querySelectorAll("img[src],mj-image[src]")].map(i=>(i.getAttribute("src")||"").trim()).filter(s=>/^https?:\/\//i.test(s)))].slice(0,60);}
function probeImages(doc){return Promise.all(imgSrcs(doc).map(src=>new Promise(res=>{const im=new Image();let done=false;const fin=v=>{if(!done){done=true;res([src,v]);}};
  im.onload=()=>fin({ok:true,w:im.naturalWidth,h:im.naturalHeight});im.onerror=()=>fin({ok:false});setTimeout(()=>fin(null),10000);im.src=src;}))).then(e=>new Map(e)).catch(()=>new Map());}
function htmlChecks(doc,win,html,brandHex,probe){
  const out=[];const brand=normColor(brandHex);const lower=html.toLowerCase();
  const css=n=>win.getComputedStyle(n);
  const colorOf=n=>normColor(css(n).color);
  const attrColor=(n,a)=>{const v=n.getAttribute&&n.getAttribute(a);return v?normColor(v):null;};
  const ownBg=n=>{const c=css(n).backgroundColor;if(!isClear(c))return normColor(c);return attrColor(n,"bgcolor")||attrColor(n,"background-color");};
  const all=[...doc.querySelectorAll("body *")].slice(0,5000);
  /* Whizzmailer can export MJML (mj-* tags) instead of plain HTML; MJML keeps colors and links in attributes */
  const isMjml=!!doc.querySelector("mj-body,mj-section,mj-button,mj-image,mj-text");
  const mjDefault=(tag,attr)=>{for(const sel of[`mj-attributes ${tag}`,"mj-attributes mj-all"]){const d=doc.querySelector(sel);if(d&&d.getAttribute(attr))return d.getAttribute(attr);}return null;};
  const bgs=new Set();all.forEach(n=>{const b=ownBg(n);if(b)bgs.add(b);});if(doc.body){const b=ownBg(doc.body);if(b)bgs.add(b);}
  const hasBg=bgs.has("#fffffb")||lower.includes("fffffb");
  out.push({label:"Background color #fffffb",status:hasBg?"pass":"fail",detail:hasBg?"":"Off-white #fffffb was not found."});
  /* the dark email footer starts at "Follow our social media"; its links are not offer buttons */
  const footStart=all.find(n=>/follow our social media/i.test(n.textContent)&&![...n.children].some(c=>/follow our social media/i.test(c.textContent)));
  const inFooter=a=>footStart&&(footStart.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_FOLLOWING);
  // buttons
  const anchors=[...doc.querySelectorAll("a")].filter(a=>!a.closest("mj-button"));
  const btnBg=a=>{const own=ownBg(a);if(own)return own;const p=a.parentElement;if(p&&p.textContent.trim()===a.textContent.trim()){const pb=ownBg(p);if(pb)return pb;const g=p.parentElement;if(g&&g.textContent.trim()===a.textContent.trim())return ownBg(g);}return null;};
  const page=new Set(["#fffffb","#ffffff"]);
  const buttons=anchors.filter(a=>!inFooter(a)).map(a=>({a,t:a.textContent.trim().replace(/\s+/g," "),bg:btnBg(a)})).filter(b=>b.t&&b.t.length<=30&&((b.bg&&!page.has(b.bg))||/button|btn/i.test((b.a.className||"")+" "+(b.a.id||""))));
  const mjButtons=[...doc.querySelectorAll("mj-button")].filter(b=>!inFooter(b)).map(b=>({a:b,t:b.textContent.trim().replace(/\s+/g," "),bg:normColor(b.getAttribute("background-color")||mjDefault("mj-button","background-color")||"#414141"),href:(b.getAttribute("href")||"").trim()})).filter(b=>b.t);
  buttons.push(...mjButtons);
  if(!buttons.length)out.push({label:"Buttons in brand color",status:"warn",detail:"No buttons were found. Check that Button Blocks were used."});
  else{
    const wrong=buttons.filter(b=>b.bg!==brand);
    out.push({label:"Buttons in brand color "+brandHex,status:wrong.length?"fail":"pass",detail:wrong.length?wrong.map(b=>`"${b.t}" uses ${b.bg||"no color"}`).join("; "):`${buttons.length} button(s) checked.`});
    const texts=buttons.map(b=>b.t);
    const bad=texts.filter(t=>!/^(book now|reserve)$/i.test(t));const caps=texts.filter(t=>/^(book now|reserve)$/i.test(t)&&t!=="Book Now"&&t!=="Reserve");
    out.push({label:"Button text is \"Book Now\" or \"Reserve\"",status:bad.length?"fail":caps.length?"warn":"pass",detail:bad.length?"Not allowed: "+bad.map(t=>`"${t}"`).join(", "):caps.length?"Use title case: "+caps.map(t=>`"${t}"`).join(", "):""});
  }
  // images: plain <img> and MJML <mj-image>
  const nameOfSrc=src=>(src||"").split("/").pop().split("?")[0].slice(0,40)||"image";
  const imgs=[...doc.querySelectorAll("img")].filter(i=>!(+i.getAttribute("width")>0&&+i.getAttribute("width")<=2)).map(i=>({name:nameOfSrc(i.getAttribute("src")),alt:i.getAttribute("alt"),title:i.getAttribute("title"),linked:!!(i.closest("a")||i.closest("mj-image[href]"))}))
    .concat([...doc.querySelectorAll("mj-image")].map(i=>({name:nameOfSrc(i.getAttribute("src")),alt:i.getAttribute("alt"),title:i.getAttribute("title"),linked:!!(i.getAttribute("href")||"").trim()})));
  const noAlt=imgs.filter(i=>!(i.alt||"").trim()),noTitle=imgs.filter(i=>!(i.title||"").trim());
  out.push({label:"Images have alt text",status:noAlt.length?"fail":"pass",detail:noAlt.length?`${noAlt.length} of ${imgs.length} missing, e.g. ${noAlt.slice(0,3).map(i=>i.name).join(", ")}`:`${imgs.length} image(s) checked.`});
  out.push({label:"Images have title text",status:noTitle.length?"fail":"pass",detail:noTitle.length?`${noTitle.length} of ${imgs.length} missing, e.g. ${noTitle.slice(0,3).map(i=>i.name).join(", ")}`:""});
  const unlinked=imgs.filter(i=>!i.linked);
  out.push({label:"Images are hyperlinked",status:unlinked.length?"warn":"pass",detail:unlinked.length?`${unlinked.length} image(s) without a link, e.g. ${unlinked.slice(0,3).map(i=>i.name).join(", ")}. Logo, hero and offer images must link.`:""});
  // links
  const isBadHref=h=>!h||h==="#"||/^javascript:/i.test(h)||/example\.com|your-?link|^https?:\/\/?$/i.test(h);
  const linkItems=anchors.map(a=>({t:a.textContent.trim(),h:(a.getAttribute("href")||"").trim()})).concat(mjButtons.map(b=>({t:b.t,h:b.href})));
  const badLinks=linkItems.filter(l=>isBadHref(l.h));
  out.push({label:"Every link has a real destination",status:badLinks.length?"fail":"pass",detail:badLinks.length?`${badLinks.length} empty or placeholder link(s)`+(badLinks[0].t?`, e.g. "${badLinks[0].t.slice(0,30)}"`:""):`${linkItems.length} link(s) checked.`});
  // SBEC: computed color, inline/attribute colors inside the text, and the color attribute of its MJML text block
  const colorsIn=n=>{const cs=[n,...n.querySelectorAll("*")].flatMap(x=>[colorOf(x),attrColor(x,"color")]);for(let p=n.parentElement,i=0;p&&i<5;p=p.parentElement,i++)cs.push(attrColor(p,"color"));if(isMjml)cs.push(normColor(mjDefault("mj-text","color")||""));return cs.filter(Boolean);};
  const ibs=all.filter(n=>/instant\s*benefits/i.test(n.textContent)&&![...n.children].some(c=>/instant\s*benefits/i.test(c.textContent)));
  if(ibs.length){const cs=ibs.flatMap(colorsIn);const ok=cs.includes(brand);out.push({label:"#instantbenefits in brand color",status:ok?"pass":"fail",detail:ok?"":`Found ${cs[0]||"no color"}, expected ${brandHex}.`});}
  else out.push({label:"#instantbenefits in brand color",status:"warn",detail:"The About SBEC text was not found."});
  const su=anchors.find(a=>/sign\s*up/i.test(a.textContent));
  if(su){const cs=colorsIn(su);const href=su.getAttribute("href")||"";const okC=cs.includes(brand),okH=/swiss-belhotel\.com/i.test(href);out.push({label:"Sign up: brand color, links to swiss-belhotel.com",status:okC&&okH?"pass":"fail",detail:[okC?"":`color ${cs[0]||"none"}, expected ${brandHex}`,okH?"":`links to ${href||"nothing"}`].filter(Boolean).join("; ")});}
  else out.push({label:"Sign up: brand color, links to swiss-belhotel.com",status:"warn",detail:"No Sign up link found."});
  // fonts + misc
  /* fonts: the font actually applied to each piece of text must include Helvetica, Georgia or Arial.
     Text with no font declared at all falls back to the email client's default and is not counted. */
  const okStack=v=>/helvetica|georgia|arial/i.test(v)||/^\s*(inherit|initial|unset|sans-serif|serif)\s*$/i.test(v);
  const fprobe=doc.createElement("span");fprobe.setAttribute("style","all:initial");(doc.body||doc.documentElement).appendChild(fprobe);
  const browserDefault=css(fprobe).fontFamily;fprobe.remove();
  /* for each piece of visible text, the nearest declared font wins: an inline style or an MJML font-family
     attribute on the text or its wrappers; with neither, the font CSS rules applied */
  const declaredFont=n=>{for(let x=n;x&&x.nodeType===1&&x!==doc.body;x=x.parentElement){const st=x.getAttribute("style")||"";const m=st.match(/(?:^|;)\s*font-family\s*:\s*([^;]+)/i);if(m)return m[1];const a=x.getAttribute("font-family");if(a)return a;}return null;};
  const offenders=new Map();
  const walker=doc.createTreeWalker(doc.body||doc.documentElement,NodeFilter.SHOW_TEXT);let tn;
  while((tn=walker.nextNode())){const n=tn.parentElement;if(!n||!tn.textContent.trim())continue;
    if(/^(script|style|title|mj-style|mj-attributes|mj-head)$/i.test(n.tagName)||n.closest("mj-head,mj-attributes,mj-style,style,script"))continue;
    const dec=declaredFont(n);const stack=dec||css(n).fontFamily;
    if(!stack||(!dec&&stack===browserDefault)||okStack(stack))continue;
    const key=stack.replace(/['"]/g,"").trim();if(!offenders.has(key))offenders.set(key,tn.textContent.trim().replace(/\s+/g," ").slice(0,40));}
  const offList=[...offenders.entries()];
  out.push({label:"Fonts are Helvetica / Georgia / Arial",status:offList.length?"warn":"pass",detail:offList.length?offList.slice(0,3).map(([k,t])=>`"${k}"${t?` used for "${t}"`:""}`).join("; ")+".":"Every text uses Helvetica, Georgia or Arial."});
  const hasTitle=lower.includes("5e4501")||all.some(n=>colorOf(n)==="#5e4501");
  out.push({label:"Title color #5e4501 present",status:hasTitle?"pass":"warn",detail:hasTitle?"":"Section titles should be dark brown #5e4501."});
  /* dividers: below the logo, below the main offer button and below the last offer = at least 3 */
  const divs=doc.querySelectorAll("mj-divider").length+doc.querySelectorAll("hr").length+all.filter(n=>!n.closest("mj-divider")&&/border-(top|bottom)\s*:[^;]*(#b4adad|solid)/i.test(n.getAttribute("style")||"")&&!n.textContent.trim()).length;
  out.push({label:"Dividers present (at least 3)",status:divs>=3?"pass":"warn",detail:divs>=3?`${divs} divider(s) found.`:`${divs} divider(s) found. Expected one below the logo, the main offer button and the last offer.`});
  out.push({label:"Unsubscribe link present",status:/unsubscribe/i.test(html)?"pass":"fail",detail:""});

  /* ---------- how the email looks once rendered (no AI needed) ---------- */
  const after=(a,b)=>!!(a&&b&&(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING));
  const findText=re=>all.find(n=>!n.closest("mj-head,style,script,title")&&re.test(n.textContent)&&![...n.children].some(c=>re.test(c.textContent)));
  const exploreEl=findText(/explore\s+more\s+offers/i);
  const sbecEl=findText(/our\s+loyalty\s+program|instant\s*benefits/i);
  const footEl=footStart||findText(/unsubscribe/i);
  const px=v=>{const m=String(v||"").match(/^\s*(\d+(?:\.\d+)?)\s*(px)?\s*$/i);return m?+m[1]:null;};

  // images: every image loads, and none is shown wider than its real size (which looks blurry)
  const mjBodyW=isMjml?(px((doc.querySelector("mj-body")||{getAttribute:()=>null}).getAttribute("width"))||600):600;
  const shownWidth=i=>{
    if(i.tagName.toLowerCase()==="mj-image"){const w=px(i.getAttribute("width"));if(w)return w;
      const col=i.closest("mj-column");const sec=col&&col.parentElement;const cols=sec?Math.max(1,sec.querySelectorAll(":scope > mj-column").length):1;
      const cw=col&&col.getAttribute("width");const colW=cw&&/%$/.test(cw)?mjBodyW*parseFloat(cw)/100:px(cw)||mjBodyW/cols;
      const pad=px(i.getAttribute("padding-left"))!=null?px(i.getAttribute("padding-left"))+px(i.getAttribute("padding-right")||0):(/^\s*0(px)?\s*$/.test(i.getAttribute("padding")||"")?0:50);
      return Math.max(0,colW-pad);}
    return px(i.getAttribute("width"))||px((i.getAttribute("style")||"").match(/(?:^|;)\s*width\s*:\s*([^;]+)/i)?.[1])||Math.round(i.getBoundingClientRect().width)||null;};
  const imgEls=[...doc.querySelectorAll("img[src],mj-image[src]")].filter(i=>/^https?:\/\//i.test(i.getAttribute("src")||""));
  if(probe&&imgEls.length){
    const broken=[],blurry=[];
    imgEls.forEach(i=>{const src=i.getAttribute("src").trim();const p=probe.get(src);if(!p)return;
      if(!p.ok){broken.push(nameOfSrc(src));return;}
      const shown=shownWidth(i);if(!shown||shown<80)return; /* icons and spacers are skipped */
      if(p.w<shown*0.95)blurry.push(`${nameOfSrc(src)} is ${p.w}px wide but shown at ${Math.round(shown)}px`);});
    const uniq=a=>[...new Set(a)];
    out.push({label:"Every image loads",status:broken.length?"fail":"pass",detail:broken.length?`${uniq(broken).length} image(s) did not load: ${uniq(broken).slice(0,3).join(", ")}. Re-upload them in Whizzmailer.`:`${probe.size} image(s) loaded.`});
    out.push({label:"Images are sharp (not stretched)",status:blurry.length?"warn":"pass",detail:blurry.length?uniq(blurry).slice(0,3).join("; ")+". Upload a larger version (ideally twice the shown width).":"No image is shown larger than its real size."});
  }
  // width: emails are about 600px wide so they fit Outlook and phones
  let widest=0;
  if(isMjml)widest=mjBodyW;
  else all.forEach(n=>{if(!/^(table|div|td|center|img)$/i.test(n.tagName))return;const w=px(n.getAttribute("width"))||px((n.getAttribute("style")||"").match(/(?:^|;)\s*(?:max-)?width\s*:\s*([^;]+)/i)?.[1]);if(w&&w>widest)widest=w;});
  const overflow=!isMjml&&doc.documentElement.scrollWidth>(checkFrame.clientWidth||700)+2;
  out.push({label:"Email width about 600px",status:overflow?"fail":widest>640?"warn":"pass",detail:overflow?"The content is wider than the screen and will be cut off in Outlook and on phones.":widest>640?`A block is ${widest}px wide. Keep the email at 600px.`:widest?`Widest block ${widest}px.`:""});
  // overlap: absolute positioning or negative margins break in Gmail and Outlook
  const overlapping=isMjml?[]:all.filter(n=>{const s=css(n);if(s.display==="none"||s.visibility==="hidden"||s.opacity==="0"||s.maxHeight==="0px"||n.getBoundingClientRect().height<=1)return false;
    return/absolute|fixed/.test(s.position)||parseFloat(s.marginTop)<-2||parseFloat(s.marginLeft)<-2;});
  out.push({label:"Nothing overlaps",status:overlapping.length?"warn":"pass",detail:overlapping.length?`${overlapping.length} element(s) are positioned over other content (absolute position or negative margin), e.g. "${(overlapping[0].textContent.trim()||overlapping[0].tagName.toLowerCase()).slice(0,30)}". This often breaks in Gmail and Outlook.`:""});
  // section order: logo/hero at the top, then Explore More Offers, About SBEC, footer
  const firstImg=imgEls[0]||doc.querySelector("img,mj-image");
  if(!exploreEl)out.push({label:"Section order",status:"warn",detail:"The title \"Explore More Offers\" was not found above the other offers."});
  else{const seq=[["the logo and hero image",firstImg],["Explore More Offers",exploreEl],["About SBEC",sbecEl],["the footer",footEl]].filter(x=>x[1]);
    const bad=seq.slice(1).map((x,k)=>[seq[k],x]).filter(([a,b])=>!after(a[1],b[1]));
    out.push({label:"Section order",status:bad.length?"warn":"pass",detail:bad.length?bad.map(([a,b])=>`${b[0]} appears before ${a[0]}`).join("; ")+".":"Logo and hero, Explore More Offers, About SBEC, footer."});}
  // offer descriptions: at most 160 characters each
  if(exploreEl){const BLOCK=/^(p|td|div|li|h[1-6]|mj-text)$/i;const blocks=new Set();
    const w2=doc.createTreeWalker(doc.body||doc.documentElement,NodeFilter.SHOW_TEXT);let x;
    while((x=w2.nextNode())){const n=x.parentElement;if(!n||!x.textContent.trim()||!after(exploreEl,n)||(sbecEl&&!after(n,sbecEl))||(footEl&&!after(n,footEl)))continue;
      let b=n;while(b&&!BLOCK.test(b.tagName))b=b.parentElement;if(b&&b!==exploreEl)blocks.add(b);}
    const long=[...blocks].filter(b=>![...b.querySelectorAll("p,div,td,li,table")].some(c=>c.textContent.trim())).map(b=>b.textContent.trim().replace(/\s+/g," ")).filter(t=>t.length>160);
    out.push({label:"Offer descriptions 160 characters or less",status:long.length?"warn":"pass",detail:long.length?long.slice(0,2).map(t=>`${t.length} characters: "${t.slice(0,50)}…"`).join("; "):""});}
  // prices: show the currency and whether they are nett
  const stopAt=sbecEl||footEl;const parts=[];const w3=doc.createTreeWalker(doc.body||doc.documentElement,NodeFilter.SHOW_TEXT);let y;
  while((y=w3.nextNode())){const n=y.parentElement;if(!n||n.closest("mj-head,style,script,title"))continue;if(stopAt&&!after(n,stopAt)&&n!==stopAt)break;parts.push(y.textContent);}
  const offerText=parts.join(" ").replace(/\s+/g," ");
  const CUR="(?:IDR|Rp\\.?|USD|US\\$|AUD|A\\$|NZD|NZ\\$|SGD|S\\$|MYR|RM|VND|₫|BHD|BD|SAR|AED|PHP|₱|THB|฿|CNY|RMB|¥|EUR|€|GBP|£|\\$)";
  const amounts=[...offerText.matchAll(/\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d+)?\s?(?:k|K|rb|jt|juta|ribu|million)\b/g)];
  const priced=[],bare=[];
  amounts.forEach(m=>{const before=offerText.slice(Math.max(0,m.index-8),m.index),aft=offerText.slice(m.index+m[0].length,m.index+m[0].length+6);
    if(new RegExp(CUR+"\\s?$","i").test(before)||new RegExp("^\\s?"+CUR,"i").test(aft))priced.push(m[0]);else bare.push(m[0].trim());});
  if(!amounts.length)out.push({label:"Prices show currency and nett",status:"pass",detail:"No prices found in the offers."});
  else{const nett=/\bnett?\b|\+\+|incl(?:\.|usive|uding)?\b|excl(?:\.|usive|uding)?\b|subject to|before tax|after tax|tax and service/i.test(offerText);
    const issues=[bare.length?`no currency on ${[...new Set(bare)].slice(0,3).map(t=>`"${t}"`).join(", ")}`:"",nett?"":"say whether prices are nett (or ++ / subject to tax and service)"].filter(Boolean);
    out.push({label:"Prices show currency and nett",status:issues.length?"warn":"pass",detail:issues.length?issues.join("; ")+".":`${amounts.length} price(s) checked.`});}
  return out;
}

function deliveryChecks(f,others){
  const h=HOTEL[f.hotelCode];const out=[];
  if(!h){out.push({label:"Hotel selected",status:"todo",detail:"Choose your hotel first."});return out;}
  const subj=(f.subject||"").trim();
  out.push({label:"Subject",status:!subj?"todo":subj.length>70?"warn":"pass",detail:!subj?"Required.":subj.length>70?`${subj.length} characters; mobile inboxes cut subjects after about 60.`:`${subj.length} characters.`});
  out.push({label:"Preheader text",status:(f.preheader||"").trim()?"pass":"todo",detail:(f.preheader||"").trim()?"":"Add wording that supports the subject."});
  if(!f.start)out.push({label:"Start sending",status:"todo",detail:"Choose the sending date and time."});
  else{const ms=minStart(form.locked?form.baseDate:null);out.push({label:"Start sending at least 3 working days ahead",status:f.start<ms?"fail":"pass",detail:f.start<ms?`Too soon. The earliest start for this request is ${fmtDate(ms).slice(0,-6)}.`:fmtDate(f.start)+" Jakarta time"});}
  if(!f.stop)out.push({label:"Stop sending within 5 days",status:"todo",detail:"Choose the end date and time."});
  else if(f.start){const hrs=hoursBetween(f.start,f.stop);out.push({label:"Stop sending within 5 days",status:hrs<=0||hrs>120?"fail":"pass",detail:hrs<=0?"Stop time must be after the start.":hrs>120?`${(hrs/24).toFixed(1)} days after the start; maximum is 5.`:`${(hrs/24).toFixed(1)} days after the start.`});}
  const ei=expInternal(h.code,f.start),eu=expUtm(h.code,f.start);
  const ii=(f.internal||"").trim(),uu=(f.utm||"").trim();
  out.push({label:"Internal name format",status:!ii||!ei?"todo":ii===ei?"pass":"fail",detail:!ei?"Needs the start date.":ii===ei?ii:`Expected "${ei}"`});
  out.push({label:"UTM campaign name format",status:!uu||!eu?"todo":uu===eu?"pass":"fail",detail:!eu?"Needs the start date.":uu===eu?uu:`Expected "${eu}" (no spaces)`});
  const fr=(f.fromName||"").trim();
  out.push({label:"From name is the complete hotel name",status:!fr?"todo":fr.toLowerCase()===h.name.toLowerCase()?"pass":fr.toLowerCase().includes(h.name.toLowerCase().split(",")[0])?"warn":"fail",detail:!fr?"Required.":fr.toLowerCase()===h.name.toLowerCase()?"":`Expected "${h.name}"`});
  const rt=(f.replyTo||"").trim();const okMail=/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(rt);
  out.push({label:"Reply-to is a hotel email",status:!rt?"todo":!okMail?"fail":/@swiss-belhotel\.com$/i.test(rt)?"pass":"warn",detail:!rt?"Use reservations or another relevant department.":!okMail?"Not a valid email address.":/@swiss-belhotel\.com$/i.test(rt)?"":"Not a swiss-belhotel.com address; check it is the hotel's official email."});
  const pv=(f.previewUrl||"").trim();
  out.push({label:"Whizzmailer preview URL",status:!pv?"todo":/^https:\/\/v2-swiss-belhotel\.whizzmailer\./i.test(pv)?"pass":"fail",detail:!pv?"Toggle Preview URL on and paste the link.":/^https:\/\/v2-swiss-belhotel\.whizzmailer\./i.test(pv)?"":"The link should start with https://v2-swiss-belhotel.whizzmailer."});
  out.push({label:"Main offer is a room package",status:f.offerType==="room"?"pass":"warn",detail:f.offerType==="room"?"":`Main offer is ${OFFER_LABEL[f.offerType]}. The guideline highly recommends a room package; explain in your note if you keep it.`});
  if(f.start){const p=dparts(f.start);const n=quotaFor(h.code,f.start)||0;
    out.push({label:"Monthly limit of 2 EDMs",status:n>=2?"fail":"pass",detail:n>=2?`${h.code} already has ${n} EDMs submitted for ${MON[p.m-1]} ${p.y}.`:`${n} other EDM(s) submitted for ${MON[p.m-1]} ${p.y}.`});}
  return out;
}
function tally(list){const t={pass:0,warn:0,fail:0,todo:0,info:0};list.forEach(c=>t[c.status]++);return t;}

/* ---------- state ---------- */
let db=null,cfg=null,session=null,myId=null,myEmail="",isApprover=false,aiEnabled=false,currentView="submit";
const BUCKET="screenshots";
let subs=new Map(),decisions=new Map();
let form=blankForm();
function blankForm(){return{id:null,files:[],fileUrls:[],screenshotIds:[],uploadedSig:null,ai:null,aiSig:null,checks:{},existing:null,locked:false,baseDate:null};}
/* during a revision only the screenshot, the HTML, the note and the checklist stay editable */
const REVISION_EDITABLE=new Set(["f-shots","f-html","f-note"]);
function applyLock(){F("form").querySelectorAll("input,select,textarea").forEach(n=>{if(!n.id||n.id==="f-hotel")return;if(REVISION_EDITABLE.has(n.id)){n.disabled=false;return;}if(n.id==="f-stop"&&!form.locked)return;n.disabled=!!form.locked;});}
const F=id=>document.getElementById(id);
function readForm(){return{hotelCode:F("f-hotel").value,campaign:F("f-campaign").value.trim(),pic:F("f-pic").value.trim(),picPosition:F("f-picpos").value.trim(),offerType:F("f-offertype").value,subject:F("f-subject").value,preheader:F("f-preheader").value,start:F("f-start").value,stop:F("f-stop").value,internal:F("f-internal").value,utm:F("f-utm").value,fromName:F("f-from").value,replyTo:F("f-replyto").value,previewUrl:F("f-preview").value,html:F("f-html").value,note:F("f-note").value};}
function shotSig(){return form.files.length?form.files.map(f=>f.name+":"+f.size).join("|"):form.screenshotIds.join("|");}

/* ---------- hotel select ---------- */
const sel=F("f-hotel");const hq=F("f-hotel-q");const hLabel=h=>`${h.name} (${h.code})`;
HOTELS.forEach(h=>{sel.append(el("option",{value:h.code},hLabel(h)));F("hotel-list").append(el("option",{value:hLabel(h)}));});
function resolveHotel(text){const t=text.trim();if(!t)return"";const up=t.toUpperCase();if(HOTEL[up])return up;const m=t.match(/\(([A-Z0-9]+)\)\s*$/i);if(m&&HOTEL[m[1].toUpperCase()])return m[1].toUpperCase();const hits=HOTELS.filter(h=>h.name.toLowerCase()===t.toLowerCase());return hits.length===1?hits[0].code:"";}
hq.addEventListener("input",()=>{sel.value=resolveHotel(hq.value);});
hq.addEventListener("change",()=>{const c=resolveHotel(hq.value);sel.value=c;if(c)hq.value=hLabel(HOTEL[c]);});
function syncBrandChip(){const h=HOTEL[sel.value];const c=$("#brandchip");c.replaceChildren();if(!h)return;const b=BRANDS[h.brand];c.append(el("span",{class:"sw",style:"background:"+b.hex}),`${b.name} · button color ${b.hex}`);}

const FORMAT_HINT={"x-internal":["Format: [HOTEL CODE] - DD Mon YYYY (delivery date). Sample: ","SBSE - 06 Jun 2026"],"x-utm":["Format: whizz-edm-[HOTEL CODE]-DDMonYYYY, no spaces. Sample: ","whizz-edm-SBSE-06Jun2026"],"x-from":["Complete hotel name. Sample: ","Swiss-Belhotel Seef, Bahrain"]};
function expectLine(target,value,inputId){const x=F(target);x.replaceChildren();
  if(!value){const[t,ex]=FORMAT_HINT[target]||["",""];x.append(t,el("code",null,ex),target==="x-from"?"":" · Choose the hotel and start date to get the exact value.");return;}
  x.append("Expected ",el("code",null,value),form.locked?null:el("button",{type:"button",class:"btn small",onclick:()=>{F(inputId).value=value;refresh();}},"Use this"));}

/* ---------- inspection rail ---------- */
let aiRunning=null;
function aiStatus(){if(!aiEnabled)return"off";if(!form.ai)return"todo";if(form.aiSig!==shotSig())return"todo";return form.ai.findings.some(x=>x.status==="fail")?"fail":form.ai.findings.some(x=>x.status==="warn")?"warn":"pass";}
function refresh(){
  const f=readForm();const h=HOTEL[f.hotelCode];
  syncBrandChip();
  const ms=minStart(form.locked?form.baseDate:null);F("f-start").min=ms;F("x-start").textContent=form.locked?"Locked during revision. Counted from the first submission.":`At least 3 working days (Mon–Fri) after you submit. Earliest today: ${fmtDate(ms).slice(0,-6)}.`;
  const st=F("f-stop");
  if(f.start){st.disabled=!!form.locked;st.min=addHours(f.start,1);st.max=addHours(f.start,120);if(st.value&&(st.value<st.min||st.value>st.max)){st.value="";f.stop="";}}
  else{st.disabled=true;st.value="";f.stop="";st.removeAttribute("min");st.removeAttribute("max");}
  F("x-stop").textContent=f.start?`Choose between ${fmtDate(st.min)} and ${fmtDate(st.max)}.`:"Choose the start first. Stop must be within 5 days after it.";
  expectLine("x-internal",h?expInternal(h.code,f.start):"","f-internal");
  expectLine("x-utm",h?expUtm(h.code,f.start):"","f-utm");
  expectLine("x-from",h?h.name:"","f-from");
  const others=null;
  const dl=deliveryChecks(f,others);const hl=h?getHtmlResults(f.html,BRANDS[h.brand].hex):[{label:"Email HTML",status:"todo",detail:"Choose your hotel first."}];
  const manualDone=MANUAL_IDS.filter(id=>form.checks[id]).length;
  const aiSt=aiStatus();
  const all=[...dl,...hl.filter(x=>x.status!=="info")];
  const t=tally(all);t.pass+=manualDone;t.todo+=MANUAL_IDS.length-manualDone;
  if(aiSt==="pass")t.pass++;else if(aiSt==="todo")t.todo++;else if(aiSt!=="off")t[aiSt]++;
  const total=t.pass+t.warn+t.fail+t.todo;
  const meter=$("#meter");meter.replaceChildren(...[["pass","--ok"],["warn","--warn"],["fail","--bad"]].map(([k,v])=>el("span",{style:`width:${total?t[k]/total*100:0}%;background:var(${v})`})));
  $("#counts").replaceChildren(el("span",null,`${t.pass} passed`),el("span",null,`${t.fail} to fix`),el("span",null,`${t.warn} to review`),el("span",null,`${t.todo} open`));
  const rail=$("#rail");const open=new Set([...rail.querySelectorAll("details[open]")].map(d=>d.dataset.k));const first=!rail.childElementCount;
  rail.replaceChildren();
  const grp=(k,title,list,extra)=>{const tt=tally(list);const d=el("details",{class:"grp","data-k":k});if(first?k!=="manual":open.has(k))d.open=true;
    d.append(el("summary",null,dot(tt.fail?"fail":tt.todo?"todo":tt.warn?"warn":"pass"),title,el("span",{class:"tally"},`${tt.pass}/${list.filter(x=>x.status!=="info").length||list.length}`)));
    if(list.length)d.append(el("ul",null,list.map(c=>el("li",{class:"ck"},dot(c.status),el("span",null,c.label,c.detail?el("span",{class:"d"},c.detail):null)))));
    if(extra)d.append(extra);rail.append(d);};
  grp("delivery","Whizzmailer settings",dl);
  grp("html","HTML check",hl);
  // AI: shown only when the server has a Claude API key
  if(aiEnabled){
  const aiBox=el("div",{class:"ai-box"});
  const canAi=aiEnabled;const hasShots=form.files.length||form.screenshotIds.length;
  if(!canAi)aiBox.append(el("span",{class:"d"},"The visual check is not set up on this server yet."));
  else if(!hasShots)aiBox.append(el("span",{class:"ck"},dot("todo"),el("span",null,"Add a full-page screenshot to run the visual check.")));
  if(form.ai){const stale=form.aiSig!==shotSig();aiBox.append(el("div",{class:"ai-sum"},stale?"Screenshots changed since the last check. Run it again.":form.ai.summary||""));
    if(!stale)aiBox.append(el("ul",{style:"padding:0"},form.ai.findings.map(x=>el("li",{class:"ck"},dot(x.status),el("span",null,`${x.section}: ${x.check}`,x.detail?el("span",{class:"d"},x.detail):null)))));}
  const aiBtn=el("button",{type:"button",class:"btn small",disabled:!canAi||!hasShots||!h||!!aiRunning,onclick:runAi},aiRunning?"Checking… (up to a minute)":form.ai?"Run visual check again":"Run visual check");
  aiBox.append(el("div",{class:"btnrow"},aiBtn,aiRunning?el("button",{type:"button",class:"btn small",onclick:()=>aiRunning&&aiRunning.abort()},"Stop"):null));
  const aiList=form.ai&&form.aiSig===shotSig()?form.ai.findings:[];
  const aiD=el("details",{class:"grp","data-k":"ai"});if(first||open.has("ai"))aiD.open=true;
  const at=tally(aiList);aiD.append(el("summary",null,dot(aiSt==="off"?"info":aiSt),"Visual check by Claude",el("span",{class:"tally"},aiList.length?`${at.pass}/${aiList.length}`:"not run")),aiBox);rail.append(aiD);
  }
  // manual
  const man=el("details",{class:"grp","data-k":"manual"});if(open.has("manual")||first)man.open=true;
  man.append(el("summary",null,dot(manualDone===MANUAL_IDS.length?"pass":"todo"),"Your checklist",el("span",{class:"tally"},`${manualDone}/${MANUAL_IDS.length}`)));
  const mb=el("div",{class:"manual",style:"padding:0 18px 14px;display:flex;flex-direction:column;gap:10px"});
  MANUAL.forEach(g=>{if(g.sec)mb.append(el("div",{style:"font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:4px"},g.sec));g.items.forEach(([id,txt])=>{const cb=el("input",{type:"checkbox",id:"m-"+id});cb.checked=!!form.checks[id];cb.addEventListener("change",()=>{form.checks[id]=cb.checked;refresh();});mb.append(el("label",{for:"m-"+id},cb,el("span",null,txt)));});});
  man.append(mb);rail.append(man);
  // blockers
  const blk=[];
  if(!h)blk.push("Choose your hotel.");
  if(!f.pic||!f.picPosition)blk.push("Add the PIC name and position.");
  if(!f.campaign)blk.push("Add the campaign name.");
  const dFix=dl.filter(x=>x.status==="fail"||x.status==="todo").length;if(dFix)blk.push(`${dFix} Whizzmailer setting(s) to fill in or fix.`);
  const hFix=hl.filter(x=>x.status==="fail").length;if(hFix)blk.push(`${hFix} HTML check(s) failing.`);if(hl.some(x=>x.status==="todo"))blk.push(form.locked&&!readForm().html.trim()?"Paste the HTML of the revised EDM.":"Wait for the HTML check to finish.");
  if(!form.files.length&&!form.screenshotIds.length)blk.push(form.locked?"Upload the full-page screenshot of the revised EDM.":"Add a full-page screenshot of the email.");
  else if(aiSt==="todo")blk.push("Run the visual check on your current screenshot.");
  if(aiSt==="fail"&&!f.note.trim())blk.push("The visual check found issues: fix them and run it again, or explain in the note why they stay.");
  if(manualDone<MANUAL_IDS.length)blk.push(`${MANUAL_IDS.length-manualDone} checklist item(s) not confirmed.`);
  const warnCount=t.warn;if(!blk.length&&warnCount&&!f.note.trim())blk.push(`${warnCount} item(s) to review: add a short note for the approver.`);
  $("#blockers").replaceChildren(...(blk.length?blk.map(b=>el("li",null,b)):[el("li",{style:"color:var(--ok);list-style:none;margin-left:-18px"},"Everything checks out. Ready to submit.")]));
  const locked=form.existing&&!canEditSub(form.id);
  F("btn-submit").disabled=!!blk.length||!db||locked;F("btn-draft").disabled=!db||!h||locked;
  form._results={delivery:dl,html:hl};
}

/* ---------- AI visual check ---------- */
async function sliceImage(blob,parts){
  try{const bmp=await createImageBitmap(blob);const w=bmp.width,h=bmp.height;const n=Math.max(1,Math.min(parts,Math.ceil(h/(w*1.35))));if(n===1&&w<=1600)return[blob];
    const scale=Math.min(1,1100/w);const segH=Math.ceil(h/n);const out=[];
    for(let i=0;i<n;i++){const sh=Math.min(segH,h-i*segH);const c=document.createElement("canvas");c.width=Math.round(w*scale);c.height=Math.round(sh*scale);c.getContext("2d").drawImage(bmp,0,i*segH,w,sh,0,0,c.width,c.height);out.push(await new Promise(r=>c.toBlob(r,"image/jpeg",0.78)));}
    return out;}catch(e){return[blob];}
}
async function shotBlobs(){if(form.files.length)return form.files;const out=[];for(const p of form.screenshotIds){try{const{data}=await db.storage.from(BUCKET).download(p);if(data)out.push(data);}catch(e){}}return out;}
function blobToBase64(b){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]||"");r.onerror=rej;r.readAsDataURL(b);});}
/* the API takes JPEG slices; a screenshot short enough to stay in one piece is converted here */
async function toJpeg(blob){if(blob.type==="image/jpeg"&&blob.size<900000)return blob;
  try{const bmp=await createImageBitmap(blob);const scale=Math.min(1,1100/bmp.width);const c=document.createElement("canvas");c.width=Math.round(bmp.width*scale);c.height=Math.round(bmp.height*scale);c.getContext("2d").drawImage(bmp,0,0,c.width,c.height);return await new Promise(r=>c.toBlob(r,"image/jpeg",0.78));}catch(e){return blob;}}
async function runAi(){
  const f=readForm();const h=HOTEL[f.hotelCode];if(!aiEnabled||!h)return;
  const ctl=new AbortController();aiRunning=ctl;refresh();
  try{
    const src=await shotBlobs();if(!src.length){toast("Could not read the screenshot. Choose it again.");return;}
    const max=8;const per=Math.max(1,Math.floor(max/src.length));let imgs=[];for(const b of src)imgs.push(...await sliceImage(b,per));imgs=imgs.slice(0,max);
    const b64=[];for(const i of imgs)b64.push(await blobToBase64(await toJpeg(i)));
    if(b64.reduce((a,x)=>a+x.length,0)>4000000){toast("The screenshot is too large to check. Crop the empty margins or save it as JPEG and try again.");return;}
    const b=BRANDS[h.brand];
    /* exact results from the HTML check are passed in so the visual check does not second-guess them by eye */
    const verified=((form._results&&form._results.html)||[]).filter(x=>x.status==="pass").map(x=>x.label);
    const{data:{session:s}}=await db.auth.getSession();
    const r=await fetch("/api/visual-check",{method:"POST",signal:ctl.signal,headers:{"content-type":"application/json",authorization:"Bearer "+(s?s.access_token:"")},
      body:JSON.stringify({images:b64,context:{hotelName:h.name,hotelCode:h.code,brandName:b.name,brandHex:b.hex,campaign:f.campaign,offerLabel:OFFER_LABEL[f.offerType],subject:f.subject,verified}})});
    const res=await r.json().catch(()=>({}));
    if(!r.ok){toast(res.error||"The visual check failed. Try again.");return;}
    const findings=Array.isArray(res.findings)?res.findings:[];
    if(!findings.length){toast("The visual check returned no findings. Try again.");return;}
    const order={fail:0,warn:1,pass:2};findings.sort((a,b)=>order[a.status]-order[b.status]);
    form.ai={summary:String(res.summary||""),findings,at:nowIso()};form.aiSig=shotSig();
  }catch(e){if(!(e&&e.name==="AbortError"))toast("The visual check failed. Check your connection and try again.");}
  finally{aiRunning=null;refresh();}
}

/* ---------- data (Supabase) ----------
   tickets  one row per submission: `summary` for lists, `data` for the full record
   reviews  one row per ticket, written by reviewers only
   storage  bucket "screenshots", files under <user id>/<ticket id>/
   What each person may read or write is enforced by supabase/schema.sql. */
const fullCache=new Map();const quotaCache=new Map();
const ownerOf=id=>{const s=subs.get(id);return s?s.owner:myId;};
function quotaKey(code,start){return`${code}|${start.slice(0,7)}|${form.id||""}`;}
function quotaFor(code,start){if(!db||!session||!code||!start)return null;const k=quotaKey(code,start);if(quotaCache.has(k))return quotaCache.get(k);
  quotaCache.set(k,null);db.rpc("month_count",{p_hotel:code,p_month:start.slice(0,7),p_exclude:form.id||null}).then(({data,error})=>{if(error){quotaCache.delete(k);return;}quotaCache.set(k,data||0);refresh();});return null;}
function rowSummary(r){return{...(r.summary||{}),owner:r.owner,ownerEmail:r.owner_email,ticket:r.ticket,hotelCode:r.hotel_code,start:r.start_at||"",state:r.state,createdAt:r.created_at,updatedAt:r.updated_at,submittedAt:r.submitted_at,firstSubmittedAt:r.first_submitted_at};}
async function getFull(id){const c=fullCache.get(id);const s=subs.get(id);if(c&&(!s||c.updatedAt===s.updatedAt))return c;if(!db)return null;
  const{data,error}=await db.from("tickets").select("*").eq("id",id).maybeSingle();if(error||!data)return null;
  const v={...(data.data||{}),...rowSummary(data)};fullCache.set(id,v);return v;}
async function saveReview(id,obj){const{error}=await db.from("reviews").upsert({ticket_id:id,owner:ownerOf(id),status:obj.status,at:obj.at,data:obj});if(error)throw error;await loadData();}
const LIST_COLS="id,owner,owner_email,ticket,hotel_code,start_at,state,created_at,updated_at,submitted_at,first_submitted_at,summary";
let loading=null;
function loadData(){if(!db||!session)return Promise.resolve();if(loading)return loading;
  loading=(async()=>{
    const[t,r]=await Promise.all([db.from("tickets").select(LIST_COLS).order("updated_at",{ascending:false}).limit(2000),db.from("reviews").select("ticket_id,status,at,data").limit(5000)]);
    if(t.error){toast("Could not load tickets. Reload the page.");return;}
    subs=new Map(t.data.map(x=>[x.id,rowSummary(x)]));
    decisions=new Map((r.data||[]).map(x=>[x.ticket_id,{...(x.data||{}),status:x.status,at:x.at}]));
    renderAll();
  })().finally(()=>{loading=null;});
  return loading;}
/* screenshots are private: each one is shown through a link that expires after an hour */
const signedCache=new Map();
function signedUrl(path){if(!signedCache.has(path))signedCache.set(path,db.storage.from(BUCKET).createSignedUrl(path,3600).then(r=>r.data?r.data.signedUrl:"").catch(()=>""));return signedCache.get(path);}
function storedImg(path,alt){const img=el("img",{alt:alt||"EDM screenshot"});const a=el("a",{target:"_blank",rel:"noopener"},img);if(db)signedUrl(path).then(u=>{if(u){img.src=u;a.href=u;}});return a;}

/* ---------- save / submit ---------- */
function canEditSub(id){if(!id)return true;const s=subs.get(id);if(!s)return true;const st=statusOf(id);return s.owner===myId&&(st==="draft"||st==="revision");}
async function save(submit){
  if(!db||!session){toast("Sign in to save submissions.");return;}
  const f=readForm();const btns=[F("btn-draft"),F("btn-submit")];btns.forEach(b=>b.disabled=true);
  try{
    const id=form.id||("edm-"+Date.now().toString(36)+Math.random().toString(36).slice(2,7));
    if(submit){const{data:n,error:qe}=await db.rpc("month_count",{p_hotel:f.hotelCode,p_month:f.start.slice(0,7),p_exclude:id});
      if(!qe&&n>=2){toast(`${f.hotelCode} already has ${n} EDMs submitted for this month. The limit is 2.`);return;}}
    if(form.files.length&&form.uploadedSig!==shotSig()){
      const fileSig=shotSig();const paths=[];const stamp=Date.now();
      for(const[i,file]of form.files.entries()){const type=/^image\/(png|jpeg|webp)$/.test(file.type)?file.type:"image/png";const ext=type.split("/")[1].replace("jpeg","jpg");const path=`${myId}/${id}/${stamp}-${i+1}.${ext}`;
        const{error}=await db.storage.from(BUCKET).upload(path,file,{contentType:type,upsert:false});if(error)throw Object.assign(new Error(error.message),{where:"upload"});paths.push(path);}
      form.screenshotIds=paths;form.uploadedSig=fileSig;
    }
    const prev=subs.get(id)||{};
    /* keep the screenshots of every earlier submission so the reviewer can compare versions */
    const prevFull=form.existing?await getFull(id).catch(()=>null):null;
    let versions=[...((prevFull&&prevFull.versions)||[])];
    if(prevFull&&prevFull.submittedAt&&(prevFull.screenshotIds||[]).length&&!versions.some(v=>v.at===prevFull.submittedAt)&&prevFull.screenshotIds.join("|")!==form.screenshotIds.join("|"))
      versions.push({at:prevFull.submittedAt,screenshotIds:prevFull.screenshotIds});
    versions=versions.slice(-10);
    const sigStored=form.files.length&&form.uploadedSig===shotSig()&&form.aiSig===shotSig()?form.screenshotIds.join("|"):form.aiSig;
    const html=f.html.length<=150000?f.html:"";
    const now=nowIso();
    const summary={pic:f.pic,picPosition:f.picPosition,campaign:f.campaign,offerType:f.offerType,stop:f.stop,score:null};
    const full={...summary,subject:f.subject,preheader:f.preheader,internal:f.internal,utm:f.utm,fromName:f.fromName,replyTo:f.replyTo,previewUrl:f.previewUrl,html,htmlTooLong:f.html.length>150000,note:f.note,
      checks:form.checks,results:form._results,ai:form.ai,aiSig:sigStored||null,screenshotIds:form.screenshotIds,versions};
    const sc=checkScore(full);summary.score={pass:sc.t.pass,fail:sc.t.fail,n:sc.n};full.score=summary.score;
    const row={id,hotel_code:f.hotelCode,start_at:f.start||null,state:submit?"submitted":"draft",created_at:prev.createdAt||now,updated_at:now,
      submitted_at:submit?now:(prev.submittedAt||null),first_submitted_at:prev.firstSubmittedAt||prev.submittedAt||(submit?now:null),summary,data:full};
    const{error:ue}=await db.from("tickets").upsert(row);if(ue)throw ue;
    let ticket=prev.ticket||null;
    if(submit){const{data:t,error:te}=await db.rpc("assign_ticket",{p_id:id});if(te)throw te;ticket=t;}
    fullCache.delete(id);quotaCache.clear();
    form.id=id;form.existing=true;
    if(form.files.length){form.files=[];form.aiSig=sigStored;}
    await loadData();
    toast(submit?`Submitted as ticket ${ticket}. Track it in Tickets.`:"Draft saved.");
    if(submit){loadIntoForm(null);switchView("queue");}else{F("form-title").textContent="Edit: "+(f.campaign||"draft");}
  }catch(e){console.error(e);toast(e&&e.where==="upload"?"A screenshot could not be uploaded. Use a PNG or JPEG under 20 MB and try again.":"Could not save. Check your connection and try again.");}
  finally{refresh();}
}
async function loadIntoForm(id){
  form=blankForm();F("form").reset();hq.value="";F("revise-banner").hidden=true;applyLock();renderThumbs();
  const s=id?await getFull(id).catch(()=>null):null;
  if(s){form.id=id;form.existing=true;form.checks={...(s.checks||{})};form.ai=s.ai||null;form.aiSig=s.aiSig||null;form.screenshotIds=[...(s.screenshotIds||[])];
    const map={"f-hotel":"hotelCode","f-campaign":"campaign","f-pic":"pic","f-picpos":"picPosition","f-offertype":"offerType","f-subject":"subject","f-preheader":"preheader","f-start":"start","f-stop":"stop","f-internal":"internal","f-utm":"utm","f-from":"fromName","f-replyto":"replyTo","f-preview":"previewUrl","f-html":"html","f-note":"note"};
    for(const[k,v]of Object.entries(map))F(k).value=s[v]||(k==="f-offertype"?"room":"");
    F("f-stop").disabled=false;F("f-stop").value=s.stop||"";
    renderThumbs();hq.value=HOTEL[s.hotelCode]?hLabel(HOTEL[s.hotelCode]):"";F("form-title").textContent="Edit: "+(s.campaign||"draft");
    form.locked=statusOf(id)==="revision";
    /* first time the hotel opens a returned ticket: start the screenshot, HTML and checklist from scratch.
       A revision draft saved after the reviewer's decision keeps what the hotel already redid. */
    const dec=decisions.get(id);
    if(form.locked&&dec&&String(s.updatedAt||"")<String(dec.at||"")){
      form.screenshotIds=[];form.ai=null;form.aiSig=null;form.checks={};F("f-html").value="";renderThumbs();}
    const fs=s.firstSubmittedAt||s.submittedAt;form.baseDate=fs?new Date(Date.parse(fs)+7*3600e3).toISOString().slice(0,16):null;
    if(form.locked){const d=decisions.get(id);const bn=F("revise-banner");bn.replaceChildren(el("b",null,`Revising ticket ${s.ticket||""}`),"Only the screenshot and the email HTML can be changed, so both start empty again together with the checklist. Fix the EDM in Whizzmailer, upload a new full-page screenshot, paste the new HTML, run the visual check, tick the checklist again and resubmit.",d&&d.note?el("div",{style:"margin-top:8px;white-space:pre-wrap"},el("b",{style:"display:inline"},"Reviewer note: "),d.note):null);bn.hidden=false;F("form-title").textContent="Revise: "+(s.campaign||"EDM");}
  }else{F("form-title").textContent="New EDM submission";if(id)toast("Could not open that ticket.");}
  applyLock();refresh();
}
function renderThumbs(){const t=$("#thumbs");form.fileUrls.forEach(u=>URL.revokeObjectURL(u));form.fileUrls=form.files.map(f=>URL.createObjectURL(f));
  t.replaceChildren(...(form.files.length?form.fileUrls.map(u=>el("img",{src:u,alt:"Screenshot preview"})):form.screenshotIds.map(p=>storedImg(p,"Screenshot preview"))));}
F("f-shots").addEventListener("change",e=>{form.files=[...e.target.files];renderThumbs();refresh();});
F("form").addEventListener("input",e=>{if(e.target.id!=="f-shots")refresh();});
F("form").addEventListener("change",e=>{if(e.target.id!=="f-shots")refresh();});
F("form").addEventListener("submit",e=>e.preventDefault());
F("btn-draft").addEventListener("click",()=>save(false));
F("btn-submit").addEventListener("click",()=>save(true));
F("btn-new").addEventListener("click",()=>loadIntoForm(null));

/* ---------- status ---------- */
function statusOf(id){const s=subs.get(id);const d=decisions.get(id);if(!s)return"draft";if(s.state!=="submitted")return d&&d.status==="revision"?"revision":"draft";if(d&&d.at>=s.submittedAt)return d.status;return"pending";}
function checkScore(s){if(s.score&&!s.results)return{t:{pass:s.score.pass,fail:s.score.fail},n:s.score.n};const r=s.results||{};const list=[...(r.delivery||[]),...(r.html||[]).filter(x=>x.status!=="info"),...((s.ai&&s.ai.findings)||[])];const t=tally(list);return{t,n:list.length};}

/* ---------- people ---------- */
const nameOf=v=>!v?"—":(v===myId||v===myEmail)?"You":(String(v).includes("@")?v:"Hotel team");

/* ---------- queue ---------- */
function renderQueue(){
  const q=F("q-search").value.trim().toLowerCase(),st=F("q-status").value;
  const rows=[...subs.entries()].map(([id,s])=>({id,s,st:statusOf(id)})).filter(r=>{const h=HOTEL[r.s.hotelCode];if(st&&r.st!==st)return false;if(q&&!`${r.s.ticket||""} ${r.s.hotelCode} ${h?h.name:""} ${r.s.campaign}`.toLowerCase().includes(q))return false;if(isApprover&&r.st==="draft")return false;return true;})
    .sort((a,b)=>{const o=isApprover?{pending:0,reviewing:1,approved:2,revision:3,draft:4,scheduled:5}:{revision:0,draft:1,pending:2,reviewing:3,approved:4,scheduled:5};return(o[a.st]-o[b.st])||String(b.s.updatedAt).localeCompare(String(a.s.updatedAt));});
  const body=F("q-body");
  if(!rows.length){body.replaceChildren(el("tr",null,el("td",{colspan:"8",class:"empty"},db?(subs.size?"No submission matches these filters.":(isApprover?"No EDM has been submitted yet.":"You have no tickets yet. Submit an EDM to get your first ticket number.")):"Sign in to see your tickets.")));return;}
  body.replaceChildren(...rows.map(({id,s,st})=>{const h=HOTEL[s.hotelCode];const sc=checkScore(s);
    const tr=el("tr",{class:"click",tabindex:"0",onclick:()=>openDetail(id),onkeydown:e=>{if(e.key==="Enter")openDetail(id);}},
      el("td",{class:"ticket"},s.ticket||"—"),el("td",null,statusPill(st),el("div",null,stepBar(st)),st==="revision"&&decisions.get(id)&&decisions.get(id).note?el("div",{style:"font-size:12px;color:var(--muted);max-width:28ch"},"Note: "+decisions.get(id).note.slice(0,90)):null),el("td",null,el("div",null,h?h.name:s.hotelCode),el("div",{class:"code",style:"color:var(--muted)"},s.hotelCode)),el("td",null,s.campaign||"—"),
      el("td",{class:"code"},fmtDate(s.start)),el("td",{class:"num"},sc.n?`${sc.t.pass}/${sc.n}`:"—",sc.t.fail?el("div",{style:"color:var(--bad);font-size:12px"},`${sc.t.fail} fail`):null),
      el("td",null,s.pic?el("div",null,s.pic):nameOf(s.ownerEmail),s.picPosition?el("div",{style:"color:var(--muted);font-size:12px"},s.picPosition):null),el("td",{class:"code"},fmtWhen(s.updatedAt)));return tr;}));
}
["q-search","q-status"].forEach(i=>F(i).addEventListener("input",renderQueue));

/* ---------- detail ---------- */
let openId=null;const recheckCache=new Map();
function openDetail(id){openId=id;
  if(isApprover&&db&&statusOf(id)==="pending"){const prev=decisions.get(id);const entry={status:"reviewing",note:"",by:myEmail,at:nowIso()};
    saveReview(id,{status:"reviewing",note:"",by:myEmail,at:entry.at,history:[...((prev&&prev.history)||[]),entry].slice(-30)}).catch(()=>{});}renderDetail();$("#overlay").hidden=false;$("#drawer").focus&&$("#drawer").focus();}
function closeDetail(){openId=null;$("#overlay").hidden=true;}
$("#overlay").addEventListener("click",e=>{if(e.target.id==="overlay")closeDetail();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&openId)closeDetail();});
function checkList(list){return el("ul",{style:"list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px"},list.map(c=>el("li",{class:"ck"},dot(c.status),el("span",null,(c.section?c.section+": ":"")+(c.label||c.check),c.detail?el("span",{class:"d"},c.detail):null))));}
function renderDetail(){
  const id=openId;const sum=subs.get(id);const dr=$("#drawer");if(!sum){dr.replaceChildren(el("p",null,"This ticket is not available."));return;}
  const full=fullCache.get(id);if(!full)getFull(id).then(v=>{if(v&&openId===id)renderDetail();}).catch(()=>{});
  const s={...(full||{}),...sum};
  const h=HOTEL[s.hotelCode];const b=h?BRANDS[h.brand]:null;const st=statusOf(id);const d=decisions.get(id);
  const r=s.results||{};
  const meta=el("dl",{class:"meta"},...[["Hotel",h?`${h.name} (${h.code})`:s.hotelCode],["Brand",b?`${b.name} · ${b.hex}`:"—"],["Main offer",`${OFFER_LABEL[s.offerType]||"—"}: ${s.campaign||"—"}`],["Send window",`${fmtDate(s.start)} → ${fmtDate(s.stop)}`],["Subject",s.subject||"—"],["Preheader",s.preheader||"—"],["Internal name",s.internal||"—"],["UTM campaign",s.utm||"—"],["From / reply-to",`${s.fromName||"—"} · ${s.replyTo||"—"}`],["PIC",s.pic?`${s.pic}${s.picPosition?", "+s.picPosition:""}`:"—"],["Submitted by",`${nameOf(s.ownerEmail)} · ${fmtWhen(s.submittedAt||s.updatedAt)}`]].map(([k,v])=>el("div",null,el("dt",null,k),el("dd",null,v))));
  const kids=[el("div",{class:"btnrow",style:"justify-content:space-between"},statusPill(st),el("button",{type:"button",class:"btn small",onclick:closeDetail},"Close")),
    el("div",{class:"ticket",style:"margin-top:10px;color:var(--muted)"},s.ticket?"Ticket "+s.ticket:"Draft, no ticket yet"),
    el("h2",{style:"margin-top:2px"},s.campaign||"Untitled EDM"),stepper(st),meta];
  if(!full)kids.push(el("p",{class:"d",style:"color:var(--muted)"},"Loading the full submission…"));
  if(s.previewUrl&&/^https:\/\//.test(s.previewUrl))kids.push(el("p",null,el("a",{href:s.previewUrl,target:"_blank",rel:"noopener"},"Open the Whizzmailer preview ↗")));
  const shotRow=ids=>el("div",{class:"shots"},ids.map(i=>storedImg(i)));
  const vers=s.versions||[];
  if((s.screenshotIds||[]).length)kids.push(el("div",{class:"sec"},el("h3",null,vers.length?`Screenshots · version ${vers.length+1} (current)`:"Screenshots"),shotRow(s.screenshotIds)));
  if(vers.length)kids.push(el("details",{class:"sec"},el("summary",{style:"cursor:pointer;font-weight:600;font-size:13px"},`Earlier versions (${vers.length})`),
    ...vers.map((v,k)=>({v,k})).reverse().map(({v,k})=>el("div",{style:"margin-top:12px"},el("div",{style:"font-size:12px;color:var(--muted);margin-bottom:6px"},`Version ${k+1} · submitted ${fmtWhen(v.at)}`),shotRow(v.screenshotIds||[])))));
  if(s.note)kids.push(el("div",{class:"sec"},el("h3",null,"Note from the hotel"),el("p",{style:"margin:0;white-space:pre-wrap"},s.note)));
  if(s.ai)kids.push(el("div",{class:"sec"},el("h3",null,"Visual check by Claude"),s.ai.summary?el("p",{style:"margin:0 0 8px"},s.ai.summary):null,checkList(s.ai.findings||[])));
  kids.push(el("div",{class:"sec"},el("h3",null,"Whizzmailer settings"),checkList(r.delivery||[])));
  const rr=recheckCache.get(id);const hb=h?BRANDS[h.brand].hex:null;
  kids.push(el("div",{class:"sec"},el("h3",null,"HTML check"),
    s.htmlTooLong?el("p",{class:"d"},"HTML was too long to store; results below were taken at save time."):null,
    rr?el("p",{style:"margin:0 0 8px;font-size:12px;color:var(--muted)"},"Re-checked just now with the current checker (not saved)."):null,
    checkList(rr||r.html||[]),
    s.html&&hb?el("div",{class:"btnrow",style:"margin-top:10px"},el("button",{type:"button",class:"btn small",onclick:async e=>{e.target.disabled=true;e.target.textContent="Checking…";
      try{const d=await loadFrame(s.html);const probe=await probeImages(d);recheckCache.set(id,htmlChecks(d,checkFrame.contentWindow,s.html,hb,probe));htmlCache.key=null;}catch(err){toast("Could not re-check this HTML.");}renderDetail();}},"Re-run HTML check")):null));
  const ck=s.checks||{};kids.push(el("div",{class:"sec"},el("h3",null,`Hotel checklist · ${MANUAL_IDS.filter(i=>ck[i]).length}/${MANUAL_IDS.length} confirmed`),checkList(MANUAL.flatMap(g=>g.items.map(([i,t])=>({label:g.sec?`${g.sec}: ${t}`:t,status:ck[i]?"pass":"todo"}))))));
  if(d&&(d.history||[]).length)kids.push(el("div",{class:"sec"},el("h3",null,"Review history"),el("div",{class:"hist"},d.history.slice().reverse().map(x=>el("div",null,statusPill(x.status)," ",el("span",{class:"code"},fmtWhen(x.at))," · ",nameOf(x.by),x.note?el("div",{style:"white-space:pre-wrap;margin-top:2px"},x.note):null)))));
  if(isApprover&&st!=="draft"){
    const note=el("textarea",{class:"plain",id:"d-note",placeholder:"What should the hotel change? Required when sending back."});
    const act=async(status)=>{if(status==="revision"&&!note.value.trim()){toast("Add a note so the hotel knows what to change.");return;}
      const prev=decisions.get(id);const entry={status,note:note.value.trim(),by:myEmail,at:nowIso()};
      try{await saveReview(id,{status,note:entry.note,by:myEmail,at:entry.at,history:[...((prev&&prev.history)||[]),entry].slice(-30)});toast(status==="approved"?"Approved.":status==="scheduled"?"Marked as scheduled.":"Sent back for revision.");}
      catch(e){toast("Only reviewers from Group Digital Marketing can record a decision.");}};
    if(st==="approved"||st==="scheduled"){note.placeholder="Optional note, e.g. scheduled time in Whizzmailer.";
      kids.push(el("div",{class:"sec"},el("h3",null,st==="scheduled"?"Scheduled in Whizzmailer":"Next: schedule in Whizzmailer"),
        el("p",{style:"margin:0 0 8px;font-size:13px;color:var(--muted)"},st==="scheduled"?"This EDM is scheduled. Send it back only if something must change before it goes out.":`Publish and schedule it in Whizzmailer for ${fmtDate(s.start)}, then mark it here.`),
        note,el("div",{class:"btnrow",style:"margin-top:10px"},st==="approved"?el("button",{type:"button",class:"btn ok",onclick:()=>act("scheduled")},"Mark as scheduled"):null,el("button",{type:"button",class:"btn",onclick:()=>act("revision")},"Send back for revision"))));}
    else kids.push(el("div",{class:"sec"},el("h3",null,"Your decision"),note,el("div",{class:"btnrow",style:"margin-top:10px"},el("button",{type:"button",class:"btn ok",onclick:()=>act("approved")},"Approve"),el("button",{type:"button",class:"btn",onclick:()=>act("revision")},"Send back for revision"))));
  }
  if(canEditSub(id))kids.push(el("div",{class:"btnrow"},el("button",{type:"button",class:"btn primary",onclick:()=>{closeDetail();loadIntoForm(id);switchView("submit");}},st==="revision"?"Revise and resubmit":"Continue editing")));
  dr.replaceChildren(...kids);
}

/* ---------- overview ---------- */
F("o-month").value=nowJkt().slice(0,7);F("o-month").addEventListener("input",renderOverview);
function renderOverview(){
  const ym=F("o-month").value;const all=[...subs.entries()].map(([id,s])=>({id,s,st:statusOf(id)}));
  const inMonth=all.filter(r=>r.s.state==="submitted"&&(r.s.start||"").slice(0,7)===ym);
  const done=st=>st==="approved"||st==="scheduled";
  const decided=all.filter(r=>done(r.st));const ftr=decided.filter(r=>{const d=decisions.get(r.id);return!(d&&(d.history||[]).some(x=>x.status==="revision"));});
  const tiles=[[all.filter(r=>r.st==="pending"||r.st==="reviewing").length,"Submitted or in review (all months)"],[all.filter(r=>r.st==="revision").length,"Sent back for revision"],[all.filter(r=>r.st==="approved").length,"Approved, waiting to be scheduled"],[inMonth.filter(r=>r.st==="scheduled").length,"Scheduled for this month"],[decided.length?Math.round(ftr.length/decided.length*100)+"%":"—","Approved on first review"]];
  F("o-tiles").replaceChildren(...tiles.map(([v,l])=>el("div",{class:"tile"},el("b",null,v),el("span",null,l))));
  const by={};inMonth.forEach(r=>{(by[r.s.hotelCode]=by[r.s.hotelCode]||[]).push(r);});
  const codes=Object.keys(by).sort((a,b)=>(HOTEL[a]?HOTEL[a].name:a).localeCompare(HOTEL[b]?HOTEL[b].name:b));
  F("o-body").replaceChildren(...(codes.length?codes.map(c=>{const h=HOTEL[c];const rs=by[c];const n=rs.length;const b=h?BRANDS[h.brand]:null;
    return el("tr",null,el("td",null,el("div",null,h?h.name:c),el("div",{class:"code",style:"color:var(--muted)"},c)),el("td",null,b?el("span",{class:"brandchip"},el("span",{class:"sw",style:"background:"+b.hex}),b.name):"—"),
      el("td",{class:"num"},n),el("td",null,n>2?el("span",{class:"pill s-fail"},"Over limit"):el("span",{class:"pill s-pass"},"Within limit")),el("td",{class:"num"},rs.filter(r=>done(r.st)).length),el("td",{class:"num"},rs.filter(r=>r.st==="pending"||r.st==="reviewing").length));})
    :[el("tr",null,el("td",{colspan:"6",class:"empty"},"No EDM is scheduled for this month yet."))]));
  const missing=HOTELS.filter(h=>!by[h.code]);
  F("o-missing-sum").textContent=`${missing.length} of ${HOTELS.length} hotels have no EDM scheduled for this month yet`;
  F("o-missing").textContent=missing.map(h=>h.code).join(" · ");
}

/* ---------- guide ---------- */
F("swatches").append(...Object.values(BRANDS).map(b=>el("div",null,el("span",{class:"sw",style:"background:"+b.hex}),b.name,el("span",{class:"code",style:"color:var(--muted)"},b.hex))));

/* ---------- views ---------- */
function switchView(v){currentView=v;document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.view===v?"true":"false"));["submit","queue","overview","guide"].forEach(k=>F("view-"+k).hidden=k!==v);if(v==="queue")renderQueue();if(v==="overview")renderOverview();window.scrollTo(0,0);}
document.querySelectorAll("nav.tabs button").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
const hash=(location.hash||"").slice(1);if(["queue","overview","guide"].includes(hash))switchView(hash);

function renderAll(){refresh();renderQueue();if(!F("view-overview").hidden)renderOverview();if(openId)renderDetail();}
refresh();renderQueue();

/* ---------- sign in (magic link) ---------- */
function setSignedIn(on){
  F("view-login").hidden=on;document.querySelector("nav.tabs").hidden=!on;
  if(on)switchView(currentView||"submit");else{["submit","queue","overview","guide"].forEach(k=>F("view-"+k).hidden=true);closeDetail();}
}
function renderWho(){const w=$("#who");w.replaceChildren();
  if(!session){w.textContent=db?"Signed out":"";return;}
  w.append(el("span",null,`${myEmail} · ${isApprover?"Reviewer":"Hotel team"}`)," ",el("button",{type:"button",class:"btn small",onclick:async()=>{await db.auth.signOut();}},"Sign out"));}
F("login-form").addEventListener("submit",async e=>{e.preventDefault();if(!db)return;
  const email=F("login-email").value.trim();const btn=F("login-btn");const msg=F("login-msg");
  if(!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)){msg.hidden=false;msg.textContent="Enter a valid email address.";return;}
  btn.disabled=true;btn.textContent="Sending…";
  const{error}=await db.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
  btn.disabled=false;btn.textContent="Email me a sign-in link";msg.hidden=false;
  msg.textContent=error?(/rate|limit|seconds/i.test(error.message)?"Too many sign-in emails. Wait a minute and try again.":"Could not send the link: "+error.message)
    :`Check the inbox of ${email} and open the sign-in link in this same browser. It can take a minute to arrive; also check the spam folder.`;});

let lastUser;
async function onSession(s){
  session=s;const uid=s?s.user.id:null;if(uid===lastUser){renderWho();return;}lastUser=uid;
  if(!s){myId=null;myEmail="";isApprover=false;subs=new Map();decisions=new Map();fullCache.clear();renderWho();setSignedIn(false);return;}
  myId=s.user.id;myEmail=s.user.email||"";
  const{data:rv}=await db.rpc("is_reviewer");isApprover=!!rv;
  F("tab-overview").hidden=!isApprover;if(!isApprover&&currentView==="overview")currentView="queue";
  renderWho();setSignedIn(true);await loadData();refresh();
}
(async function init(){
  setSignedIn(false);F("view-login").hidden=true;$("#who").textContent="Loading…";
  try{cfg=await fetch("/api/config",{cache:"no-store"}).then(r=>r.json());}catch(e){cfg=null;}
  if(!cfg||!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase){$("#offline").hidden=false;$("#who").textContent="Not configured";return;}
  aiEnabled=!!cfg.visualCheck;
  db=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});
  db.auth.onAuthStateChange((_e,s)=>{setTimeout(()=>onSession(s),0);});
  const{data:{session:s}}=await db.auth.getSession();await onSession(s);
  setInterval(()=>{if(session&&!document.hidden)loadData();},30000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&session)loadData();});
})();
})();
