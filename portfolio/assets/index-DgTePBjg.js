import{c as re,r as d,u as W,j as e,a as le,E as ce,B as de,C as ue,b as me,V as he,d as pe,R as L,e as ve}from"./r3f-r2eW9cVa.js";import{f as ie,Q as $,c as E,X as fe,Y as V,h as F,w as q,Z as X,_ as ge,$ as xe,a0 as we,j as ye}from"./three-BiGOkUty.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();const ae=[{id:"prism",index:"00",label:"PRISM",nav:"INDEX",kicker:"Portfolio 2026",prismState:"hero"},{id:"white-light",index:"01",label:"WHITE LIGHT",nav:"ABOUT",kicker:"All colours, reconverged",prismState:"converge"},{id:"spectrum",index:"02",label:"SPECTRUM",nav:"WORK",kicker:"Selected works",prismState:"disperse"},{id:"beyond",index:"03",label:"BEYOND",nav:"BEYOND",kicker:"Other facets",prismState:"orbit"},{id:"refraction",index:"04",label:"REFRACTION CONTINUES",nav:"CONTACT",kicker:"Ending / Contact",prismState:"ending"}],be=ae.filter(s=>s.id!=="prism"),M={year:"2026",thesis:"Design refracts the ordinary into possibilities.",narrative:"ONE LIGHT / MULTIPLE SPECTRUMS",chain:["LIGHT","PRISM","REFRACTION","SPECTRUM"]},T={profile:{name:"张睿",title:"AI 产品设计师 · 视觉 / 交互",objective:"字节跳动 / 抖音集团 · 广告业务 AI 产品设计（实习生）",intro:"清华美院科普信息设计硕士（AI 辅助设计 / 多模态交互方向，GPA 3.9/4.0），兼具 AI 产品体验、UI/UX 与视觉设计复合能力。"},education:[{school:"清华大学美术学院",degree:"科普信息设计 · 硕士（在读）",period:"2024.09 – 2027.06",note:"GPA 3.9/4.0；研究方向：用户体验设计、人工智能辅助设计、多模态交互与沉浸式体验设计。"},{school:"江南大学设计学院",degree:"视觉传达设计 · 学士",period:"2019.09 – 2023.06",note:"优秀毕业设计；学业一等奖学金、校三好学生等荣誉。"}],skills:[{group:"产品体验",items:["用户研究","竞品分析","信息架构","交互流程","可用性分析","设计走查","PRD"]},{group:"视觉动效",items:["移动端 UI（iOS / Android 设计体系）","组件规范","视觉系统","交互动效（After Effects）","信息可视化","三维视觉"]},{group:"设计工具",items:["Figma（组件化协作）","Photoshop","Illustrator","After Effects","Premiere","Blender"]},{group:"AI 能力",items:["ChatGPT","Claude","Codex","Gemini","即梦","WorkBuddy","结构化 Prompt","模型体验评测","AI Coding","H5 交互原型"]}],projects:[{id:"bytedance-douyin",index:"01",title:"字节跳动 · 抖音",company:"字节跳动",wavelength:"ORANGE",nm:605,color:"#ff7a18",colorSecondary:"#ffc53d",glow:"rgba(255, 122, 24, 0.55)",character:{drift:.9,dispersion:1,bloom:1.05,rotation:.9},discipline:"AI 产品设计 / 视觉",year:"2025",role:"视觉设计实习生",summary:"抖音政务运营中台 — 结合 AIGC 的视觉系统与 H5 体验设计，深入理解抖音产品矩阵与营销玩法。",overview:"负责政务与文旅活动的视觉系统与 H5 体验设计，结合 AIGC 完成创意扩展与快速迭代，深入理解抖音产品矩阵与内容 / 营销玩法，推动 10+ 活动页面上线。",problem:"政务与文旅活动频密、创意迭代快，传统设计产能难以匹配运营节奏。",process:"搭建可复用的 AIGC 创意模板；参与活动 KV、互动 H5 与落地页全流程设计，打通「创意 → 产出 → 上线」链路。",outcome:"沉淀可复用模板，提升运营侧内容产出效率，推动 10+ 活动页面上线。"},{id:"alibaba-tongyi",index:"02",title:"阿里巴巴 · 通义万相",company:"阿里巴巴",wavelength:"WHITE + VIOLET",nm:420,color:"#f4f5f7",colorSecondary:"#8b5cff",glow:"rgba(190, 175, 255, 0.5)",character:{drift:.7,dispersion:1.25,bloom:1.15,rotation:.75},discipline:"AI 视觉 / 模型体验",year:"2025",role:"AI 视觉美学实习生",summary:"通义万相文生图 / 图像编辑 — 模型「模型 × 人」交互体验与数据体系，结构化 Prompt 与 Agent 评测。",overview:"参与通义万相文生图 / 图像编辑模型的体验与数据体系优化，构建 SFT 多维数据标签并整理 8.3 亿张训练数据；设计「捏脸」「调色盘」等功能与结构化 Prompt 体系，推进模型能力向用户可用产品转化。",problem:"生成模型能力强但用户难用、可控性差，需要把模型能力翻译为可感知的产品交互。",process:"设计功能级交互与结构化 Prompt 体系；参与 Agent 体验评测，完成 100+ 组样本测试并编写 2.6 版本 Prompt 指南。",outcome:"围绕生成稳定性、真实性与可控性推进体验优化，建立对 AI 能力边界的系统性认知。"},{id:"tencent-news",index:"03",title:"腾讯新闻",company:"腾讯",wavelength:"SKY BLUE",nm:480,color:"#46b7ff",colorSecondary:"#38c8ff",glow:"rgba(70, 183, 255, 0.5)",character:{drift:1.15,dispersion:.85,bloom:1,rotation:1.2},discipline:"C 端产品体验设计",year:"2026",role:"产品体验设计实习生",summary:"任务中心改版 — 从概念到落地的完整 C 端设计交付，改版后周日均 PV 提升约 13%。",overview:"负责任务中心信息架构、任务流程、积分反馈及移动端视觉升级，协同产品 / 研发推动 7/16 上线；改版后周日均页面进入 PV 由约 1.95 万提升至 2.27 万（增长约 13%）。",problem:"原有任务中心入口浅、任务链路断裂，用户参与与积分消耗偏低。",process:"重构信息架构与任务流程，设计积分反馈闭环与移动端视觉；以转盘抽奖验证完整交互链路（入口→抽奖→反馈→记录→异常）。",outcome:"近 30 天累计抽奖 6,400+ 次，推动积分净消耗 9.26 万，完整交付从概念到落地。"},{id:"chinatelcom-aigc",index:"04",title:"中国电信 · AIGC 营销",company:"中国电信",wavelength:"BLACK + DEEP PURPLE",nm:400,color:"#7a2bff",colorSecondary:"#2a1050",glow:"rgba(122, 43, 255, 0.42)",character:{drift:.5,dispersion:1.35,bloom:.82,rotation:.55},discipline:"AIGC 活动 / 产品体验",year:"2025",role:"活动策划 / 产品体验设计师",summary:"广博会 / 元旦 / 春节线上活动 — 结合天翼云图 AIGC 的营销互动玩法，与广告 / 商业化业务高度契合。",overview:"参与广博会、元旦及春节线上活动，结合天翼云图 AIGC 完成蛇年 IP、3D 直播场景、H5 与抽奖机制设计，探索 AI 营销互动玩法。",problem:"传统营销活动创意产能有限，难以在节庆高频节点快速产出差异化内容。",process:"以天翼云图 AIGC 驱动 IP 与场景生成，设计 H5 与抽奖机制，形成可复用的 AI 营销互动模板。",outcome:"探索出 AI 营销互动范式，与广告 / 商业化业务高度契合，可直接迁移至电商与品牌增长场景。"},{id:"tencent-aigc-show",index:"05",title:"腾讯互娱 · AIGC 沉浸展厅",company:"腾讯互娱",wavelength:"PINK",nm:520,color:"#ff5fa8",colorSecondary:"#ff3fd0",glow:"rgba(255, 95, 168, 0.52)",character:{drift:1.35,dispersion:1.1,bloom:1.2,rotation:1.35},discipline:"沉浸式 / 原生 AI 交互",year:"2025",role:"交互设计师",summary:"AIGC 生成内容 × 多模态交互的沉浸式展项，《情绪合成器》入选 IEEE VR 2025 Gallery。",overview:"围绕 AIGC 生成内容与人机交互设计沉浸式展项，以脑电、面部表情等多模态数据驱动视觉生成；《情绪合成器》入选 IEEE VR 2025 Gallery 并以第一作者发表论文。",problem:"原生 AI 产品的交互范式尚不成熟，需要探索「人 → 模型 → 生成物」的新型反馈回路。",process:"以多模态生理信号作为输入，驱动实时视觉生成，沉淀对「原生 AI 产品交互范式」的设计思考。",outcome:"形成可演示的沉浸式 AI 交互范式，并以第一作者发表 IEEE VR 2025 论文，体现「AI + 设计」的独立探索。"},{id:"wechat-status",index:"06",title:"微信「状态」优化",company:"腾讯 WXG",wavelength:"RED",nm:660,color:"#ff2d3e",colorSecondary:"#ff7a18",glow:"rgba(255, 45, 62, 0.5)",character:{drift:1,dispersion:1.15,bloom:1.1,rotation:1},discipline:"产品 / 交互原型",year:"2024",role:"产品经理训练营",summary:"微信「状态」功能优化 — 用户研究到原型验证的完整产品设计流程。",overview:"围绕低频使用与表达场景单一问题开展用户访谈与需求拆解，完成信息架构、交互原型及 PRD，形成「用户研究 — 功能设计 — 原型验证」完整流程。",problem:"微信「状态」使用频率低、表达场景单一，缺乏持续使用的动机。",process:"通过用户访谈拆解需求，重构信息架构与交互原型，输出可验证的 PRD 与高保真原型。",outcome:"形成端到端的产品设计方法论，强化从用户研究到原型验证的闭环能力。"}],awards:["清华大学梅贻琦奖学金","IEEE VR 2025 第一作者论文 & Gallery 入选","HRI 2025 LBR 论文收录","「学院派奖」全国最高奖","KTK 靳埭强设计奖优秀奖","其他设计竞赛获奖 30+"],papers:[{title:"《情绪合成器》",venue:"IEEE VR 2025 Gallery",role:"第一作者",note:"以脑电、面部表情等多模态数据驱动视觉生成的沉浸式展项，入选 Gallery 并发表论文。"},{title:"HRI 2025 LBR",venue:"ACM/IEEE HRI",role:"论文收录",note:"人机交互方向 Late-Breaking Report 论文收录。"}],contact:{email:"1277929459@qq.com",phone:"13067018267",location:"北京"}},k=T.projects.map(s=>({id:s.id,index:s.index,title:s.title,wavelength:s.wavelength,nm:s.nm,color:s.color,colorSecondary:s.colorSecondary,glow:s.glow,character:s.character,discipline:s.discipline,year:s.year,role:s.role,summary:s.summary,cover:null,overview:s.overview,problem:s.problem,process:s.process,outcome:s.outcome})),U={id:"white",color:"#f4f5f7",colorSecondary:"#8b5cff",glow:"rgba(244, 245, 247, 0.5)",character:{drift:1,dispersion:1,bloom:1,rotation:1}},K=s=>k.find(t=>t.id===s)||null,g={x:0,y:0,sx:0,sy:0,vel:0,inside:!0};function je(){if(typeof window>"u")return"high";const s=window.innerWidth,t=navigator.deviceMemory||navigator.hardwareConcurrency||8,i=window.matchMedia("(pointer: coarse)").matches;return window.matchMedia("(prefers-reduced-motion: reduce)").matches||i||s<820||t<=4?"low":s<1400||t<=6?"mid":"high"}const z={high:{dpr:[1,1.75],samples:4,transmission:!0,slices:9,bloom:!0,grain:!0},mid:{dpr:[1,1.4],samples:2,transmission:!0,slices:6,bloom:!0,grain:!0},low:{dpr:[1,1.2],samples:0,transmission:!1,slices:4,bloom:!1,grain:!1}},Q={hero:{x:.92,y:.05,z:.1},converge:{x:1.35,y:.12,z:-.55},disperse:{x:-.2,y:.2,z:-.3},project:{x:-1.55,y:.55,z:-.85},orbit:{x:1.15,y:-.3,z:-.65},ending:{x:0,y:0,z:.25}},x=re((s,t)=>({booted:!1,progress:0,tier:"high",reducedMotion:!1,setBooted:i=>s({booted:i}),setProgress:i=>s({progress:i}),setTier:i=>s({tier:i}),setReducedMotion:i=>s({reducedMotion:i}),view:"index",activeSection:"prism",activeProject:null,transitioning:!1,prismState:"hero",scroll:0,dispersion:1,setActiveSection:i=>{if(t().activeSection===i)return;const o=ae.find(a=>a.id===i);s({activeSection:i,prismState:t().view==="project"?"project":o?.prismState||"hero"})},setScroll:i=>s({scroll:i}),light:U,applyLight:i=>{const o=document.documentElement;o.style.setProperty("--spectrum-primary",i.color),o.style.setProperty("--spectrum-secondary",i.colorSecondary),o.style.setProperty("--spectrum-glow",i.glow),s({light:i})},curtainPhase:"idle",curtainColor:U.color,pendingView:null,pendingProject:null,indexScrollY:0,openProject:i=>{const o=K(i);!o||t().transitioning||(t().applyLight(o),s({transitioning:!0,curtainPhase:"in",curtainColor:o.color,pendingView:"project",pendingProject:i,indexScrollY:t().view==="index"?window.scrollY:t().indexScrollY}))},closeProject:()=>{t().transitioning||s({transitioning:!0,curtainPhase:"in",curtainColor:U.color,pendingView:"index",pendingProject:null})},commitPending:()=>{const{pendingView:i,pendingProject:o}=t();i==="project"?s({view:"project",activeProject:o,prismState:"project",activeSection:"spectrum",curtainPhase:"hold"}):(t().applyLight(U),s({view:"index",activeProject:null,prismState:"disperse",activeSection:"spectrum",curtainPhase:"hold"}))},setCurtainPhase:i=>s({curtainPhase:i}),endTransition:()=>s({transitioning:!1,curtainPhase:"idle",pendingView:null,pendingProject:null}),hoveredProject:null,setHoveredProject:i=>{if(t().view==="project")return;s({hoveredProject:i});const o=i?K(i):null;t().applyLight(o||U)}})),O=()=>x.getState();function Ne(){d.useEffect(()=>{let s=0,t=0,i=0;const o=r=>{g.x=r.clientX/window.innerWidth*2-1,g.y=-(r.clientY/window.innerHeight*2-1),g.inside=!0},a=()=>{g.inside=!1,g.x=0,g.y=0},n=r=>{const c=r.touches[0];c&&(g.x=c.clientX/window.innerWidth*2-1,g.y=-(c.clientY/window.innerHeight*2-1))},l=()=>{g.sx+=(g.x-g.sx)*.045,g.sy+=(g.y-g.sy)*.045;const r=Math.hypot(g.sx-t,g.sy-i);g.vel+=(Math.min(r*26,1)-g.vel)*.09,t=g.sx,i=g.sy,s=requestAnimationFrame(l)};return s=requestAnimationFrame(l),window.addEventListener("pointermove",o,{passive:!0}),window.addEventListener("pointerleave",a),window.addEventListener("touchmove",n,{passive:!0}),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",o),window.removeEventListener("pointerleave",a),window.removeEventListener("touchmove",n)}},[])}function Se(){const s=x(t=>t.setScroll);d.useEffect(()=>{let t=0;const i=()=>{t=0;const a=document.documentElement.scrollHeight-window.innerHeight;s(a>0?Math.min(window.scrollY/a,1):0)},o=()=>{t||(t=requestAnimationFrame(i))};return window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o),i(),()=>{window.removeEventListener("scroll",o),window.removeEventListener("resize",o),cancelAnimationFrame(t)}},[s])}function Z(s,t="smooth"){const i=document.querySelector(`[data-section="${s}"]`);return i?(i.scrollIntoView({behavior:t,block:"start"}),!0):!1}function Ee(s=!0){const t=x(i=>i.setActiveSection);d.useEffect(()=>{if(!s)return;const i=Array.from(document.querySelectorAll("[data-section]"));if(!i.length)return;const o=new IntersectionObserver(a=>{const n=a.filter(l=>l.isIntersecting).sort((l,r)=>r.intersectionRatio-l.intersectionRatio)[0];n&&t(n.target.dataset.section)},{rootMargin:"-42% 0px -42% 0px",threshold:[0,.15,.4,.75,1]});return i.forEach(a=>o.observe(a)),()=>o.disconnect()},[s,t])}function G(s,{threshold:t=.22,once:i=!0}={}){const[o,a]=d.useState(!1);return d.useEffect(()=>{const n=s.current;if(!n)return;const l=new IntersectionObserver(([r])=>{r.isIntersecting?(a(!0),i&&l.disconnect()):i||a(!1)},{threshold:t,rootMargin:"0px 0px -8% 0px"});return l.observe(n),()=>l.disconnect()},[s,t,i]),o}function Ie(){const s=x(i=>i.setTier),t=x(i=>i.setReducedMotion);d.useEffect(()=>{const i=window.matchMedia("(prefers-reduced-motion: reduce)"),o=()=>{s(je()),t(i.matches)};o(),i.addEventListener("change",o);let a;const n=()=>{clearTimeout(a),a=setTimeout(o,250)};return window.addEventListener("resize",n),()=>{i.removeEventListener("change",o),window.removeEventListener("resize",n),clearTimeout(a)}},[s,t])}const C=[[1,0],[.6,.4],[.14,.86],[-.04,1],[-.46,.68],[-1,0]],J=3;function ne({radialSegments:s,width:t,depth:i,height:o,twist:a}){const n=Math.max(3,s),l=Math.PI*2;return C.map(([r,c],m)=>{const h=[];for(let u=0;u<n;u++){const w=u/n*l+m*a;h.push(new E(Math.cos(w)*c*t,r*(o/2),Math.sin(w)*c*i))}return h})}function Pe({radialSegments:s=12,width:t=1,depth:i=.55,height:o=1.72,twist:a=.09}={}){const n=Math.max(3,s),l=ne({radialSegments:n,width:t,depth:i,height:o,twist:a}),r=[],c=[],m=[],h=(p,y,b)=>{const v=new E().crossVectors(new E().subVectors(y,p),new E().subVectors(b,p));if(v.lengthSq()<1e-10)return new E(0,1,0);v.normalize();const f=new E().add(p).add(y).add(b).multiplyScalar(1/3);return v.dot(new E(f.x,0,f.z))<0&&v.negate(),v},u=(p,y,b,v,f,j)=>{const P=h(p,y,b);r.push(p.x,p.y,p.z,y.x,y.y,y.z,b.x,b.y,b.z);for(let S=0;S<3;S++)c.push(P.x,P.y,P.z);m.push(v[0],v[1],f[0],f[1],j[0],j[1])};for(let p=0;p<C.length-1;p++){const y=C[p][1],b=C[p+1][1],v=p/(C.length-1),f=(p+1)/(C.length-1);for(let j=0;j<n;j++){const P=(j+1)%n,S=j/n,I=(j+1)/n,N=l[p][j],B=l[p][P],A=l[p+1][j],_=l[p+1][P];y===0?u(A,_,N,[S,f],[I,f],[S,v]):b===0?u(N,B,A,[S,v],[I,v],[S,f]):(u(N,B,_,[S,v],[I,v],[I,f]),u(N,_,A,[S,v],[I,f],[S,f]))}}const w=new ie;return w.setAttribute("position",new $(r,3)),w.setAttribute("normal",new $(c,3)),w.setAttribute("uv",new $(m,2)),w.computeBoundingSphere(),w.computeBoundingBox(),w}function Te({radialSegments:s=12,width:t=1,depth:i=.55,height:o=1.72,twist:a=.09}={}){const n=Math.max(3,s),l=ne({radialSegments:n,width:t,depth:i,height:o,twist:a}),r=[],c=(h,u)=>r.push(h.x,h.y,h.z,u.x,u.y,u.z);for(let h=0;h<n;h++)for(let u=0;u<C.length-1;u++)c(l[u][h],l[u+1][h]);for(let h=0;h<n;h++)c(l[J][h],l[J][(h+1)%n]);const m=new ie;return m.setAttribute("position",new $(r,3)),m}const ee={radialSegments:12,width:.78,depth:.44,height:1.48,twist:.09},Me=`
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vPosW;
  varying vec3 vPosL;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    vPosL = position;
    /* flat facet normals come straight from geometry — no smoothing */
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,ke=`
  precision highp float;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vPosW;
  varying vec3 vPosL;

  uniform float uTime;
  uniform float uDispersion;   // strength of the RGB split
  uniform float uHover;        // 0..1 hover lift
  uniform float uClarity;      // master alpha — how present the glass is
  uniform vec3  uKeyDir;       // direction of the incoming white beam
  uniform vec3  uTint;         // active wavelength (white on the index)
  uniform float uTintMix;

  /* spectral ramp used for the dispersion fringe */
  vec3 spectral(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 r = vec3(1.00, 0.22, 0.28);
    vec3 o = vec3(1.00, 0.62, 0.20);
    vec3 y = vec3(1.00, 0.95, 0.55);
    vec3 c = vec3(0.35, 0.90, 1.00);
    vec3 b = vec3(0.28, 0.48, 1.00);
    vec3 v = vec3(0.62, 0.40, 1.00);
    if (t < 0.2)      return mix(r, o, t / 0.2);
    else if (t < 0.4) return mix(o, y, (t - 0.2) / 0.2);
    else if (t < 0.6) return mix(y, c, (t - 0.4) / 0.2);
    else if (t < 0.8) return mix(c, b, (t - 0.6) / 0.2);
    else              return mix(b, v, (t - 0.8) / 0.2);
  }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    float ndv = abs(dot(N, V));

    /* ---- 1. fresnel: the defining quality of transparent glass ---- */
    float fres = pow(1.0 - ndv, 3.2);

    /* ---- 2. facet specular: one crisp highlight per flat face ---- */
    vec3 L = normalize(uKeyDir);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 220.0);
    /* secondary wider lobe so facets read even when off-angle */
    float spec2 = pow(max(dot(N, H), 0.0), 26.0) * 0.16;

    /* ---- 3. chromatic dispersion along the refraction vector ---- */
    float disp = uDispersion * (1.0 + uHover * 0.9);
    vec3 R = refract(-V, N, 0.66);
    /* sample position along the refracted ray drives the hue split */
    float band = R.x * 1.6 + R.y * 0.7 + vPosL.y * 0.5;
    vec3 fringe = spectral(fract(band * 0.5 + 0.5)) * fres * disp;

    /* ---- 4. internal caustics: faint trapped-light banding ---- */
    float caustic = sin(vPosL.y * 22.0 + vPosL.x * 14.0 + uTime * 0.35) * 0.5 + 0.5;
    caustic = pow(caustic, 4.0) * 0.09 * (1.0 - ndv);

    /* ---- 5. edge accent: thin bright line right at the silhouette ---- */
    float rim = smoothstep(0.82, 1.0, 1.0 - ndv);

    /* ---- compose ---- */
    vec3 col = vec3(0.0);
    col += vec3(0.34, 0.44, 0.70) * fres * 0.8;    // cool glass body
    col += fringe * 1.25;                          // dispersion
    col += vec3(1.0) * spec * 3.2;                 // hard facet highlights
    col += vec3(0.88, 0.94, 1.0) * spec2 * 1.6;
    col += vec3(0.55, 0.70, 1.0) * caustic * 1.4;
    col += vec3(1.0) * rim * 0.42;

    /* fold toward the active project wavelength */
    col = mix(col, col * uTint * 1.35, uTintMix);

    /* hover lifts the whole optic slightly */
    col *= (1.0 + uHover * 0.35);

    /* alpha: glass is mostly invisible, present at rim / highlight / fringe */
    float a = fres * 0.72 + spec * 2.0 + rim * 0.42 + caustic * 1.8
            + length(fringe) * 0.5;
    a = clamp(a, 0.0, 1.0) * uClarity;

    gl_FragColor = vec4(col, a);
  }
`,Re=()=>({uTime:{value:0},uDispersion:{value:.85},uHover:{value:0},uClarity:{value:1},uKeyDir:{value:null},uTint:{value:null},uTintMix:{value:0}}),te={hero:{scale:1,tilt:0},converge:{scale:.74,tilt:-.18},disperse:{scale:.92,tilt:.1},project:{scale:.34,tilt:.28},orbit:{scale:.62,tilt:-.34},ending:{scale:1.06,tilt:0}};function Ae({ready:s}){const t=d.useRef(),i=d.useRef(),o=d.useRef(),[a,n]=d.useState(!1),l=d.useMemo(()=>Pe(ee),[]),r=d.useMemo(()=>Te(ee),[]),c=d.useMemo(()=>{const u=Re();return u.uKeyDir.value=new E(-1,.18,.55).normalize(),u.uTint.value=new E(1,1,1),u},[]),m=d.useMemo(()=>new fe({color:new F("#dce6ff"),transparent:!0,opacity:.07,blending:V,depthWrite:!1}),[]),h=d.useMemo(()=>new F,[]);return W(({clock:u},w)=>{if(!t.current||!s)return;const p=u.getElapsedTime(),y=O(),b=te[y.prismState]||te.hero,v=1-Math.pow(.0015,Math.min(w,.05)),f=t.current,j=g.sy*.14+b.tilt,P=g.sx*.22;f.rotation.x+=(j-f.rotation.x)*v*.4,f.rotation.y+=(P-f.rotation.y)*v*.4,f.rotation.y+=w*.05,f.rotation.z=Math.sin(p*.16)*.03,f.position.y=Math.sin(p*.32)*.035,f.position.x=Math.sin(p*.21)*.018;const S=b.scale*(a?1.04:1);if(f.scale.setScalar(f.scale.x+(S-f.scale.x)*v*.4),o.current){const N=o.current.uniforms;N.uTime.value=p,N.uHover.value+=((a?1:0)-N.uHover.value)*v*.25;const B=.85+g.vel*.35;N.uDispersion.value+=(B-N.uDispersion.value)*v*.2;const A=y.light;A&&A.id!=="white"?(h.set(A.color),N.uTint.value.set(h.r,h.g,h.b),N.uTintMix.value+=(.55-N.uTintMix.value)*v*.2):N.uTintMix.value+=(0-N.uTintMix.value)*v*.2}const I=(a?.2:.07)+g.vel*.05;m.opacity+=(I-m.opacity)*v*.3,i.current&&(i.current.rotation.copy(f.rotation),i.current.position.copy(f.position),i.current.scale.copy(f.scale))}),s?e.jsxs("group",{children:[e.jsx("mesh",{ref:t,geometry:l,onPointerOver:()=>n(!0),onPointerOut:()=>n(!1),children:e.jsx("shaderMaterial",{ref:o,vertexShader:Me,fragmentShader:ke,uniforms:c,transparent:!0,depthWrite:!1,blending:V,side:q})}),e.jsx("lineSegments",{ref:i,geometry:r,material:m})]}):null}const Ce=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Le=`
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uThickness;   // core thickness, 0..1
  uniform float uPointer;
  uniform vec3  uColor;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float axis = abs(vUv.y - 0.5) * 2.0;

    // hard-ish core with a wide volumetric halo
    float core = 1.0 - smoothstep(0.0, uThickness, axis);
    float halo = exp(-axis * 5.2) * 0.34;

    // brightens as it approaches the crystal (x → 1)
    float approach = mix(0.42, 1.0, pow(vUv.x, 1.7));

    // travelling energy along the beam, extremely subtle
    float pulse = sin((vUv.x * 2.2 - uTime * 0.22) * 6.2831) * 0.5 + 0.5;
    pulse = 0.86 + pow(pulse, 4.0) * 0.2;

    // fade in from the void at the far left
    float birth = smoothstep(0.0, 0.22, vUv.x);
    // fade out right before the surface so the beam never clips the mesh
    float entry = 1.0 - smoothstep(0.88, 1.0, vUv.x);

    float a = (core * 0.85 + halo) * approach * pulse * birth * entry;
    a *= uIntensity * (0.9 + uPointer * 0.18);

    float g = (hash(vUv * 480.0 + uTime) - 0.5) * 0.03;
    vec3 col = uColor + g;

    gl_FragColor = vec4(col * a, a * 0.9);
  }
`,Oe=()=>({uTime:{value:0},uIntensity:{value:1},uThickness:{value:.16},uPointer:{value:0},uColor:{value:new E(1,1,1)}});function Ge(){const s=d.useRef(),t=d.useMemo(()=>Oe(),[]),i=d.useMemo(()=>new X(2.4,.7,1,1),[]);return W(({clock:o})=>{if(!s.current)return;const a=o.getElapsedTime(),n=O(),l=g,r=s.current.uniforms;switch(r.uTime.value=a,r.uPointer.value=l.vel,n.prismState){case"hero":r.uIntensity.value=1;break;case"converge":r.uIntensity.value=1.3;break;case"disperse":r.uIntensity.value=.85;break;case"project":r.uIntensity.value=.5;break;case"orbit":r.uIntensity.value=.6;break;case"ending":r.uIntensity.value=.9;break;default:r.uIntensity.value=1}n.prismState==="converge"&&(r.uThickness.value=.3+Math.sin(a*.5)*.08)}),e.jsx("mesh",{position:[-1.35,0,-.08],rotation:[0,0,0],geometry:i,children:e.jsx("shaderMaterial",{ref:s,vertexShader:Ce,fragmentShader:Le,uniforms:t,transparent:!0,depthWrite:!1,blending:V,side:q})})}const Ue=`
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,De=`
  precision highp float;

  varying vec2 vUv;
  varying vec3 vPos;

  uniform float uTime;
  uniform float uDispersion;   // 0 = collapsed white, 1 = full spectrum
  uniform float uIntensity;    // master opacity
  uniform float uSlices;       // lamella count (0 = continuous field)
  uniform float uSliceSharp;   // hardness of each lamella edge
  uniform float uPointer;      // smoothed pointer influence
  uniform float uSpread;       // vertical spread of the cone
  uniform float uTintMix;      // 0 = full rainbow, 1 = single wavelength
  uniform vec3  uTint;         // active project wavelength
  uniform float uScanline;     // vertical scanning band strength
  uniform float uGrain;

  /**
   * Spectral ramp: warm → narrow pale seam → cool.
   *
   * The pale band in the middle is kept deliberately THIN. A wide white core
   * plus additive blending plus bloom compounds into a blown-out white blob
   * that swallows the colour either side of it. Saturated hues have to run
   * almost all the way through the centre for the dispersion to read.
   */
  vec3 spectralRamp(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 red     = vec3(1.00, 0.18, 0.24);
    vec3 orange  = vec3(1.00, 0.48, 0.10);
    vec3 amber   = vec3(1.00, 0.80, 0.30);
    vec3 warmW   = vec3(1.00, 0.90, 0.78);
    vec3 coolW   = vec3(0.82, 0.90, 1.00);
    vec3 cyan    = vec3(0.22, 0.78, 1.00);
    vec3 blue    = vec3(0.18, 0.42, 1.00);
    vec3 violet  = vec3(0.54, 0.36, 1.00);
    vec3 magenta = vec3(1.00, 0.25, 0.82);

    vec3 c;
    if      (t < 0.140) c = mix(magenta, red,    smoothstep(0.0,   0.140, t));
    else if (t < 0.290) c = mix(red,     orange, smoothstep(0.140, 0.290, t));
    else if (t < 0.430) c = mix(orange,  amber,  smoothstep(0.290, 0.430, t));
    else if (t < 0.488) c = mix(amber,   warmW,  smoothstep(0.430, 0.488, t));
    else if (t < 0.512) c = mix(warmW,   coolW,  smoothstep(0.488, 0.512, t));
    else if (t < 0.570) c = mix(coolW,   cyan,   smoothstep(0.512, 0.570, t));
    else if (t < 0.720) c = mix(cyan,    blue,   smoothstep(0.570, 0.720, t));
    else if (t < 0.870) c = mix(blue,    violet, smoothstep(0.720, 0.870, t));
    else                c = mix(violet,  magenta,smoothstep(0.870, 1.000, t));
    return c;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;

    // ---- 1. cone geometry: light leaves the prism at the left edge ----
    float travel = uv.x;                          // 0 at prism, 1 far field
    float axis   = uv.y - 0.5;

    // the beam opens up as it travels; spread eased, never linear
    float openness = pow(travel, 0.72) * uSpread * mix(0.34, 1.0, uDispersion);
    float halfCone = 0.028 + openness;

    // soft cone mask, feathered — air, not a hard triangle
    float across = abs(axis) / max(halfCone, 1e-4);
    float cone = 1.0 - smoothstep(0.35, 1.0, across);

    // ---- 2. spectral position across the cone ----
    // slight drift + noise so it breathes instead of looking like a gradient
    float wobble = (noise(vec2(uv.x * 2.6, uTime * 0.06)) - 0.5) * 0.16;
    float t = 0.5 + (axis / max(halfCone, 1e-4)) * 0.5 * mix(0.12, 1.0, uDispersion) + wobble * uDispersion;

    vec3 col = spectralRamp(t);

    // when a project wavelength is active, fold the rainbow toward that hue
    col = mix(col, uTint * (0.65 + 0.6 * (1.0 - abs(axis) / max(halfCone, 1e-4))), uTintMix);

    // Near the prism the light is still white — dispersion accumulates with
    // distance. Kept short and weak: a long, strong white core reads as a solid
    // blob glued to the crystal instead of light leaving it.
    float whiteCore = 1.0 - smoothstep(0.0, 0.11 + 0.1 * (1.0 - uDispersion), travel);
    col = mix(col, vec3(1.0), whiteCore * 0.34);

    // ---- 3. lamellae: translucent slices cutting the light ----
    float lam = 1.0;
    if (uSlices > 0.5) {
      float sx = uv.x * uSlices;
      float cell = fract(sx);
      // each slice: bright leading edge, body, dark gap → layered sequence
      float edge = smoothstep(0.0, 0.06 * uSliceSharp, cell)
                 * (1.0 - smoothstep(0.62, 0.98, cell));
      float body = mix(0.42, 1.0, edge);
      // stepped offset so slices feel stacked in depth, not tiled flat
      float depthStep = floor(sx);
      float stagger = 1.0 - depthStep / max(uSlices, 1.0) * 0.35;
      lam = body * stagger;
      // specular line on each leading edge — restrained, these stack additively
      lam += (1.0 - smoothstep(0.0, 0.022, cell)) * 0.3;
    }

    // ---- 4. slow scanning band — "light being parsed" ----
    float scan = sin((uv.x * 3.4 - uTime * 0.16) * 6.2831) * 0.5 + 0.5;
    scan = pow(scan, 3.0) * uScanline;

    // ---- 5. falloff + bloom shaping ----
    // Emission ramp: light has to *leave* the crystal before it is visible.
    // Without this the field starts at full brightness flush against the mesh
    // and reads as a white blob stuck to it.
    float emerge = smoothstep(0.0, 0.10, travel);

    float nearGlow = exp(-travel * 4.6) * 0.3;                // hot spot at exit
    /* Fade out well before the plane's edge. If this reaches zero only at
       travel = 1.0 the falloff lands exactly on the geometry boundary and the
       light ends in a visible straight cut. */
    float farFade  = 1.0 - smoothstep(0.34, 0.88, travel);
    /* same reasoning vertically — feather inside the plane, not at its edge */
    float verticalSoft = 1.0 - smoothstep(0.42, 0.92, abs(axis) * 2.0);

    float a = cone * farFade * verticalSoft;
    a *= (0.55 + lam * 0.75);
    a += nearGlow * cone;
    a += scan * cone * 0.35;
    a *= emerge;

    // pointer adds a touch of energy, never a jump
    a *= (0.86 + uPointer * 0.28);
    a *= uIntensity;

    /* Guard against the plane's own boundary.
       Any mask still non-zero at the geometry edge gets cut off square, which
       shows up as a rectangular crop of the light floating in the black. This
       feathers the whole field inward from all four edges — belt and braces on
       top of the cone falloff above. */
    float edgeX = smoothstep(0.0, 0.04, uv.x) * (1.0 - smoothstep(0.72, 0.99, uv.x));
    float edgeY = smoothstep(0.0, 0.09, uv.y) * (1.0 - smoothstep(0.91, 1.0, uv.y));
    a *= edgeX * edgeY;

    // ---- 6. grain, kills banding in the wide soft areas ----
    float g = (hash(uv * 620.0 + uTime * 0.7) - 0.5) * uGrain;
    col += g;

    // additive light: colour scales with alpha so it reads as glow on black
    gl_FragColor = vec4(max(col, 0.0) * a, a * 0.92);
  }
`,Ve=()=>({uTime:{value:0},uDispersion:{value:1},uIntensity:{value:1},uSlices:{value:9},uSliceSharp:{value:1},uPointer:{value:0},uSpread:{value:.42},uTintMix:{value:0},uTint:{value:new E(1,1,1)},uScanline:{value:.35},uGrain:{value:.045}});function Fe(){const s=d.useRef(),t=d.useMemo(()=>Ve(),[]),i=d.useMemo(()=>new X(3.4,2.2,1,1),[]);return W(({clock:o})=>{if(!s.current)return;const a=o.getElapsedTime(),n=O(),l=g,r=s.current.uniforms;switch(r.uTime.value=a,r.uPointer.value=l.vel,n.prismState){case"hero":r.uDispersion.value=1;break;case"converge":r.uDispersion.value=.08;break;case"disperse":r.uDispersion.value=1.15;break;case"project":r.uDispersion.value=.7;break;case"orbit":r.uDispersion.value=.9;break;case"ending":r.uDispersion.value=.3;break;default:r.uDispersion.value=1}switch(n.prismState){case"hero":r.uIntensity.value=1;break;case"converge":r.uIntensity.value=.25;break;case"disperse":r.uIntensity.value=1.1;break;case"project":r.uIntensity.value=.8;break;case"orbit":r.uIntensity.value=.7;break;case"ending":r.uIntensity.value=.5;break;default:r.uIntensity.value=1}if(n.light&&n.light.id!=="white"){const m=new F(n.light.color);r.uTint.value.set(m.r,m.g,m.b),r.uTintMix.value=n.prismState==="project"?.75:.25}else r.uTintMix.value=0;const c=z[n.tier]||z.mid;r.uSlices.value=c.slices||6}),e.jsx("mesh",{position:[1.62,0,-.14],rotation:[0,0,0],geometry:i,children:e.jsx("shaderMaterial",{ref:s,vertexShader:Ue,fragmentShader:De,uniforms:t,transparent:!0,depthWrite:!1,blending:V,side:q})})}const ze=`
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,He=`
  precision highp float;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uEdge;      // edge-light strength
  uniform float uFringe;    // chromatic aberration on the edges
  uniform vec3  uTint;
  uniform float uIndex;     // 0..1 position in the stack

  void main() {
    // fresnel: glass is only visible where it turns away from you
    float f = pow(1.0 - abs(dot(vNormalW, vViewDir)), 3.1);

    // crisp specular lines along the four borders
    float bx = min(vUv.x, 1.0 - vUv.x);
    float by = min(vUv.y, 1.0 - vUv.y);
    float border = (1.0 - smoothstep(0.0, 0.012, bx)) + (1.0 - smoothstep(0.0, 0.018, by));
    border = clamp(border, 0.0, 1.0);

    // top edge catches more light than the bottom — reads as a real sheet
    float topLit = (1.0 - smoothstep(0.0, 0.14, 1.0 - vUv.y)) * 0.7;

    // faint vertical grain, like ribbed/fluted glass
    float flute = sin(vUv.x * 128.0) * 0.5 + 0.5;
    flute = 0.86 + flute * 0.14;

    vec3 col = uTint;
    // chromatic fringe: warm on one border, cool on the other
    col += vec3(uFringe, 0.0, -uFringe * 0.6) * (1.0 - smoothstep(0.0, 0.05, vUv.x));
    col += vec3(-uFringe * 0.6, 0.0, uFringe) * (1.0 - smoothstep(0.0, 0.05, 1.0 - vUv.x));

    float a = (f * 0.5 + border * uEdge + topLit * uEdge * 0.8) * flute;
    // deeper sheets in the stack fade — depth without fog cost
    a *= mix(1.0, 0.42, uIndex);

    /* Fade the top and bottom of each sheet. Without this the sheets terminate
       hard where the geometry ends, and any part extending past the spectrum
       cone reads as a stray coloured rectangle sitting in the black. */
    float vFade = smoothstep(0.0, 0.22, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
    a *= vFade;

    a *= uOpacity;

    gl_FragColor = vec4(col * a, a);
  }
`,We=()=>({uTime:{value:0},uOpacity:{value:1},uEdge:{value:.5},uFringe:{value:.25},uTint:{value:new E(.86,.9,1)},uIndex:{value:0}}),Be={hero:1,converge:.16,disperse:1.15,project:.55,orbit:.7,ending:.34};function $e({index:s,total:t,x:i,y:o,z:a,width:n,height:l,rotY:r}){const c=d.useRef(),m=d.useMemo(()=>We(),[]),h=d.useMemo(()=>new X(n,l,1,1),[n,l]),u=d.useMemo(()=>{const p=t>1?s/(t-1):0,y=new F;return y.setHSL(.58-p*.5,.42,.86),y},[s,t]),w=d.useMemo(()=>new F,[]);return W(({clock:p},y)=>{const b=c.current;if(!b)return;const v=b.uniforms,f=p.getElapsedTime(),j=O(),P=1-Math.pow(.002,Math.min(y,.05));v.uTime.value=f,v.uIndex.value=t>1?s/(t-1):0;const S=Be[j.prismState]??1;v.uOpacity.value+=(S-v.uOpacity.value)*P*.25,v.uEdge.value=.46+Math.sin(f*.42+s*.55)*.13,v.uFringe.value=.2+Math.sin(f*.31+s*.72)*.09;const I=j.light;I&&I.id!=="white"?w.set(I.color).lerp(u,.45):w.copy(u),v.uTint.value.set(w.r,w.g,w.b)}),e.jsx("mesh",{position:[i,o,a],rotation:[0,r,0],geometry:h,children:e.jsx("shaderMaterial",{ref:c,vertexShader:ze,fragmentShader:He,uniforms:m,transparent:!0,depthWrite:!1,blending:V,side:q})})}function Ye(){const s=x(o=>o.tier),t=(z[s]||z.high).slices||9,i=d.useMemo(()=>{const o=[];for(let a=0;a<t;a++){const n=t>1?a/(t-1):0,l=a*.6180339887%1-.5;o.push({index:a,total:t,x:.72+n*2.35,y:Math.sin(n*Math.PI)*.06+l*.04,z:-n*.42+l*.08,width:.05+Math.abs(l)*.05,height:.5+n*1.1,rotY:l*.12})}return o},[t]);return e.jsx("group",{children:i.map(o=>e.jsx($e,{...o},o.index))})}function qe(){const t=document.createElement("canvas");t.width=512,t.height=512/2;const i=t.getContext("2d");i.fillStyle="#04050a",i.fillRect(0,0,t.width,t.height);const o=i.createLinearGradient(0,0,0,t.height);o.addColorStop(0,"#0d1430"),o.addColorStop(.5,"#070a18"),o.addColorStop(1,"#03040a"),i.fillStyle=o,i.fillRect(0,0,t.width,t.height);const a=(l,r,c,m,h)=>{const u=i.createRadialGradient(l,r,0,l,r,c);u.addColorStop(0,m),u.addColorStop(1,"rgba(0,0,0,0)"),i.globalAlpha=h,i.fillStyle=u,i.beginPath(),i.arc(l,r,c,0,Math.PI*2),i.fill(),i.globalAlpha=1};a(t.width*.15,t.height*.5,t.width*.035,"#ffffff",1),a(t.width*.15,t.height*.5,t.width*.12,"#aebbe8",.16),a(t.width*.63,t.height*.3,t.width*.1,"#7fb4ff",.3),a(t.width*.82,t.height*.58,t.width*.075,"#ff7a3c",.3),a(t.width*.92,t.height*.44,t.width*.065,"#c65cff",.28),a(t.width*.73,t.height*.68,t.width*.06,"#39d8ff",.26),i.globalAlpha=.85,i.fillStyle="#ffffff",i.fillRect(t.width*.06,t.height*.44,t.width*.012,t.height*.13),i.globalAlpha=.3,i.fillRect(t.width*.42,t.height*.12,t.width*.006,t.height*.3),i.globalAlpha=.12,i.fillRect(0,t.height*.18,t.width,1.5),i.globalAlpha=1;const n=new xe(t);return n.mapping=we,n.colorSpace=ye,n.needsUpdate=!0,n}function _e(){const{gl:s,scene:t}=le(),i=d.useMemo(()=>{const o=qe(),a=new ge(s);a.compileEquirectangularShader();const n=a.fromEquirectangular(o);return o.dispose(),a.dispose(),n.texture},[s]);return d.useEffect(()=>(t.environment=i,t.background=null,()=>{t.environment=null}),[t,i]),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.05,color:"#161d38"}),e.jsx("directionalLight",{position:[-4,.6,2.4],intensity:1.1,color:"#ffffff"}),e.jsx("directionalLight",{position:[3.2,1.8,-2.2],intensity:.4,color:"#8fb8ff"})]})}function Ke(){return x(t=>t.tier)==="low"?null:e.jsxs(ce,{multisampling:0,disableNormalPass:!0,children:[e.jsx(de,{intensity:.5,luminanceThreshold:.34,luminanceSmoothing:.68,mipmapBlur:!0,radius:.66}),e.jsx(ue,{offset:[6e-4,9e-4],radialModulation:!0,modulationOffset:.42,blendFunction:me.NORMAL}),e.jsx(he,{offset:.28,darkness:.62,eskil:!1})]})}function Xe({ready:s}){const t=d.useRef();return W((i,o)=>{if(!t.current)return;const a=O(),n=Q[a.prismState]||Q.hero,l=1-Math.pow(.001,Math.min(o,.05)),r=t.current;r.position.x+=(n.x-r.position.x)*l*.55,r.position.y+=(n.y-r.position.y)*l*.55,r.position.z+=(n.z-r.position.z)*l*.55;const c=g.sx*.06,m=g.sy*.04;r.rotation.y+=(c-r.rotation.y)*l*.35,r.rotation.x+=(-m-r.rotation.x)*l*.35}),e.jsxs(e.Fragment,{children:[e.jsx(_e,{}),e.jsxs("group",{ref:t,children:[e.jsx(Ge,{}),e.jsx(Ae,{ready:s}),e.jsx(Fe,{}),e.jsx(Ye,{})]}),e.jsx(Ke,{})]})}const Qe={position:[0,.1,3.8],fov:45,near:.1,far:50};function Ze({ready:s}){return e.jsx("div",{className:"scene-canvas","aria-hidden":"true",children:e.jsx(pe,{gl:{antialias:!0,alpha:!0,powerPreference:"high-performance",stencil:!1,depth:!0},dpr:z[O().tier]?.dpr||[1,1.5],camera:Qe,children:e.jsx(d.Suspense,{fallback:null,children:e.jsx(Xe,{ready:s})})})})}function Je(){const s=x(r=>r.activeSection),t=x(r=>r.setActiveSection),i=x(r=>r.prismState),o=x(r=>r.view),a=x(r=>r.transitioning),n=x(r=>r.closeProject),l=d.useCallback(r=>{if(!a){if(o==="project"){n();const c=(m=0)=>{Z(r,"instant")?t(r):m<30&&requestAnimationFrame(()=>c(m+1))};setTimeout(()=>c(),640);return}Z(r),t(r)}},[o,a,n,t]);return e.jsx("nav",{className:"nav",role:"navigation","aria-label":"Main",children:e.jsxs("div",{className:"nav-inner",children:[e.jsx("button",{className:"nav-brand",onClick:()=>l("prism"),"aria-label":"Back to PRISM",children:e.jsx("span",{className:"t-pixel",children:"PRISM"})}),e.jsx("ul",{className:"nav-links",children:be.map(r=>e.jsx("li",{children:e.jsxs("button",{className:`nav-link ${o==="index"&&s===r.id?"is-active":""}`,onClick:()=>l(r.id),children:[e.jsx("span",{className:"nav-index",children:r.index}),e.jsx("span",{className:"nav-label",children:r.nav})]})},r.id))}),e.jsx("span",{className:"nav-state t-mono",children:i})]})})}function et(){const s=x(t=>t.progress);return e.jsx("div",{className:"loader",role:"status",children:e.jsxs("div",{className:"loader-inner",children:[e.jsx("p",{className:"t-label loader-kicker",children:M.narrative}),e.jsx("h1",{className:"t-display loader-title",children:"PRISM"}),e.jsx("div",{className:"loader-bar",children:e.jsx("div",{className:"loader-fill",style:{width:`${s*100}%`}})}),e.jsxs("span",{className:"t-micro loader-progress",children:[Math.round(s*100),"%"]})]})})}const tt=620,st=240,it=700;function at(){const s=x(n=>n.transitioning),t=x(n=>n.curtainPhase),i=x(n=>n.curtainColor),o=d.useRef([]),a=d.useRef(!1);return d.useEffect(()=>{if(!s){a.current=!1,o.current.forEach(clearTimeout),o.current=[];return}if(a.current)return;a.current=!0;const{commitPending:n,setCurtainPhase:l,endTransition:r}=x.getState(),c=(m,h)=>o.current.push(setTimeout(m,h));c(()=>{const m=x.getState().pendingView;n();const h=m==="index"?x.getState().indexScrollY:0;window.scrollTo({top:h,behavior:"instant"}),c(()=>{l("out"),c(()=>r(),it)},st)},tt)},[s]),d.useEffect(()=>()=>o.current.forEach(clearTimeout),[]),s?e.jsxs("div",{className:`transition-curtain curtain-${t}`,style:{"--curtain-color":i},"aria-hidden":"true",children:[e.jsx("div",{className:"curtain-glass"}),e.jsx("div",{className:"curtain-edge"})]}):null}const Y=new Set;let D=0,se=!1;function oe(){const s=window.innerHeight;Y.forEach(t=>{const i=t.el;if(!i)return;const o=i.getBoundingClientRect();if(o.bottom<-s*.5||o.top>s*1.5)return;const a=(o.top+o.height/2-s/2)/s,n=a*t.speed*100;i.style.transform=t.scale?`translate3d(0, ${n}px, 0) scale(${1+Math.abs(a)*t.scale})`:`translate3d(0, ${n}px, 0)`}),D=requestAnimationFrame(oe)}function nt(s){return se=window.matchMedia("(prefers-reduced-motion: reduce)").matches,se?()=>{}:(Y.add(s),D||(D=requestAnimationFrame(oe)),()=>{Y.delete(s),Y.size===0&&(cancelAnimationFrame(D),D=0)})}function R(s=-.1,t=0){const i=d.useRef(null);return d.useEffect(()=>{const o=i.current;if(!o)return;o.style.willChange="transform";const a=nt({el:o,speed:s,scale:t});return()=>{a(),o.style.willChange="",o.style.transform=""}},[s,t]),i}function H({as:s="p",text:t="",className:i="",stagger:o=.045,delay:a=0,once:n=!0,threshold:l=.25}){const r=d.useRef(null),[c,m]=d.useState(!1),h=d.useMemo(()=>String(t).split(/(\s+)/),[t]);return d.useEffect(()=>{const u=r.current;if(!u)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){m(!0);return}const w=new IntersectionObserver(([p])=>{p.isIntersecting?(m(!0),n&&w.disconnect()):n||m(!1)},{threshold:l,rootMargin:"0px 0px -10% 0px"});return w.observe(u),()=>w.disconnect()},[n,l]),e.jsx(s,{ref:r,className:`split-text ${c?"is-lit":""} ${i}`,children:h.map((u,w)=>{if(/^\s+$/.test(u))return" ";const p=h.slice(0,w).filter(y=>!/^\s+$/.test(y)).length;return e.jsx("span",{className:"split-word",children:e.jsx("span",{className:"split-inner",style:{transitionDelay:`${a+p*o}s`},children:u})},`${u}-${w}`)})})}function ot(){const s=d.useRef(null),t=G(s,{threshold:.05}),i=R(-.055),o=R(.075),a=R(-.03);return e.jsx("section",{className:"section section-hero","data-section":"prism",id:"prism",children:e.jsxs("div",{className:`hero-stack ${t?"is-shown":""}`,ref:s,children:[e.jsx("div",{className:"hero-line hero-line-top",ref:i,children:e.jsx("span",{className:"mega-title",children:"PRISM"})}),e.jsx("div",{className:"hero-line hero-line-bottom",ref:o,children:e.jsx("span",{className:"mega-title is-outline",children:"SPECTRUM"})}),e.jsxs("div",{className:"hero-meta",ref:a,children:[e.jsx("p",{className:"t-label hero-kicker",children:M.narrative}),e.jsx("span",{className:"t-mono hero-year",children:M.year})]}),e.jsx(H,{as:"p",className:"t-lead hero-thesis is-dim",text:M.thesis,stagger:.055,delay:.35}),e.jsx("div",{className:"hero-chain",children:M.chain.map((n,l)=>e.jsxs(L.Fragment,{children:[e.jsx("span",{className:"t-pixel chain-node",children:n}),l<M.chain.length-1&&e.jsx("span",{className:"chain-arrow",children:"→"})]},n))}),e.jsxs("div",{className:"hero-scroll",children:[e.jsx("span",{className:"t-micro",children:"Scroll to refract"}),e.jsx("div",{className:"scroll-line"})]})]})})}function rt(){const s=d.useRef(null),t=G(s,{threshold:.15}),i=R(-.05),o=R(.035),{profile:a,education:n,skills:l,contact:r}=T;return e.jsx("section",{className:"section section-about","data-section":"white-light",id:"white-light",children:e.jsxs("div",{className:"bleed",children:[e.jsx("div",{className:"mega-row",ref:i,children:e.jsx("span",{className:"mega-title is-outline",children:"WHITE LIGHT"})}),e.jsxs("div",{className:`grid12 about-grid ${t?"is-shown":""}`,ref:s,children:[e.jsxs("div",{className:"about-header grid-span-12",children:[e.jsx("p",{className:"t-label",children:"01"}),e.jsx("p",{className:"t-body u-mute about-kicker",children:"All colours, reconverged."})]}),e.jsxs("div",{className:"about-statement grid-span-7",children:[e.jsx(H,{as:"h3",className:"t-h2 about-claim",text:"我不是单一的颜色。",stagger:.05}),e.jsx(H,{as:"p",className:"t-lead is-dim about-elaboration",text:a.intro,stagger:.012,delay:.25})]}),e.jsxs("div",{className:"about-blocks grid-span-5",ref:o,children:[e.jsxs("div",{className:"glass about-placeholder",children:[e.jsx("span",{className:"t-label",children:"INTRODUCTION"}),e.jsxs("p",{className:"t-small about-name",children:[a.name," · ",a.title]}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["求职意向：",a.objective]})]}),e.jsxs("div",{className:"glass about-placeholder",children:[e.jsx("span",{className:"t-label",children:"EDUCATION"}),n.map(c=>e.jsxs("div",{className:"cv-block",children:[e.jsxs("p",{className:"t-small cv-line",children:[e.jsx("span",{className:"cv-k",children:c.school})," · ",c.degree]}),e.jsx("p",{className:"t-micro u-dim cv-meta",children:c.period}),e.jsx("p",{className:"t-small u-dim cv-line",children:c.note})]},c.school))]}),e.jsxs("div",{className:"glass about-placeholder",children:[e.jsx("span",{className:"t-label",children:"SKILLS / SPECTRUM"}),l.map(c=>e.jsxs("p",{className:"t-small u-dim cv-line",children:[e.jsxs("span",{className:"cv-k",children:[c.group,"："]}),c.items.join("、")]},c.group))]}),e.jsxs("div",{className:"glass about-placeholder",children:[e.jsx("span",{className:"t-label",children:"CONTACT"}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["邮箱：",r.email]}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["电话：",r.phone]}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["城市：",r.location]})]})]})]})]})})}function lt({project:s,index:t}){const{setHoveredProject:i,openProject:o}=x(),a=L.useRef(null),n=G(a,{threshold:.18}),l=R(t%2===0?-.045:.045);return e.jsx("div",{className:"card-drift",ref:l,children:e.jsxs("article",{ref:a,className:`project-card glass ${n?"is-shown":""}`,style:{"--project-color":s.color,"--project-glow":s.glow,transitionDelay:`${t%3*.09}s`},onMouseEnter:()=>i(s.id),onMouseLeave:()=>i(null),onClick:()=>o(s.id),"data-project-id":s.id,role:"button",tabIndex:0,"aria-label":`${s.title} — ${s.wavelength}`,children:[e.jsxs("div",{className:"card-header",children:[e.jsx("span",{className:"t-pixel card-index",children:s.index}),e.jsx("span",{className:"t-micro card-wavelength",style:{color:s.color},children:s.wavelength}),e.jsxs("span",{className:"t-micro card-nm",children:[s.nm,"nm"]})]}),e.jsx("h3",{className:"t-h2 card-title",children:s.title}),e.jsxs("div",{className:"card-body",children:[e.jsx("p",{className:"t-small u-dim card-discipline",children:s.discipline}),e.jsx("p",{className:"t-small u-dim card-year",children:s.year}),e.jsx("p",{className:"t-body u-mute card-summary",children:s.summary})]}),e.jsx("div",{className:"card-spectrum-bar",style:{background:`linear-gradient(90deg, ${s.color}00, ${s.color}, ${s.colorSecondary}, ${s.color}00)`}}),e.jsx("div",{className:"card-glow",style:{background:`radial-gradient(ellipse at 50% 80%, ${s.glow}, transparent 70%)`}})]})})}function ct(){const s=L.useRef(null),t=G(s,{threshold:.1}),i=R(-.05);return e.jsx("section",{className:"section section-work","data-section":"spectrum",id:"spectrum",children:e.jsxs("div",{className:"bleed",children:[e.jsx("div",{className:"mega-row",ref:i,children:e.jsx("span",{className:"mega-title is-spectral",children:"SPECTRUM"})}),e.jsxs("div",{className:`work-wrap ${t?"is-shown":""}`,ref:s,children:[e.jsxs("div",{className:"work-header",children:[e.jsx("p",{className:"t-label",children:"02"}),e.jsx("p",{className:"t-body u-mute work-kicker",children:"Selected works — six wavelengths in one universe."})]}),e.jsx("div",{className:"project-grid",children:k.map((o,a)=>e.jsx(lt,{project:o,index:a},o.id))})]})]})})}function dt(){const s=L.useRef(null),t=G(s,{threshold:.15}),i=R(-.05),o=T.skills.find(n=>n.group==="AI 能力"),a=T.skills.find(n=>n.group==="产品体验");return e.jsx("section",{className:"section section-beyond","data-section":"beyond",id:"beyond",children:e.jsxs("div",{className:"bleed",children:[e.jsx("div",{className:"mega-row",ref:i,children:e.jsx("span",{className:"mega-title is-outline",children:"BEYOND"})}),e.jsxs("div",{className:`beyond-grid grid12 ${t?"is-shown":""}`,ref:s,children:[e.jsxs("div",{className:"beyond-header grid-span-12",children:[e.jsx("p",{className:"t-label",children:"03"}),e.jsx("p",{className:"t-body u-mute beyond-kicker",children:"Other facets."})]}),e.jsxs("div",{className:"beyond-content grid-span-8",children:[e.jsxs("div",{className:"glass-lg beyond-block",children:[e.jsx("span",{className:"t-label",children:"Interests & Explorations"}),e.jsxs("p",{className:"t-small u-dim cv-line",children:[e.jsx("span",{className:"cv-k",children:"AI 工具链："}),o?o.items.join("、"):""]}),e.jsxs("p",{className:"t-small u-dim cv-line",children:[e.jsx("span",{className:"cv-k",children:"产品方法："}),a?a.items.join("、"):""]}),e.jsx("p",{className:"t-small u-dim cv-line",children:"持续关注原生 AI 产品的交互范式与行业前沿，把 AI 用于需求分析、创意探索与原型 Coding。"})]}),e.jsxs("div",{className:"glass beyond-block",children:[e.jsx("span",{className:"t-label",children:"Writing & Research"}),T.papers.map(n=>e.jsxs("div",{className:"cv-block",children:[e.jsxs("p",{className:"t-small cv-line",children:[e.jsx("span",{className:"cv-k",children:n.title})," · ",n.venue,"（",n.role,"）"]}),e.jsx("p",{className:"t-small u-dim cv-line",children:n.note})]},n.title)),e.jsxs("p",{className:"t-small u-dim cv-line cv-sub",children:[e.jsx("span",{className:"cv-k",children:"获奖："}),T.awards.join("；")]})]})]}),e.jsxs("div",{className:"beyond-sidebar grid-span-4",children:[e.jsxs("div",{className:"glass beyond-stat",children:[e.jsx("span",{className:"t-display stat-value",children:T.papers.length}),e.jsx("span",{className:"t-micro stat-label",children:"学术论文"})]}),e.jsxs("div",{className:"glass beyond-stat",children:[e.jsx("span",{className:"t-display stat-value",children:T.awards.length}),e.jsx("span",{className:"t-micro stat-label",children:"主要荣誉"})]})]})]})]})})}function ut(){const s=L.useRef(null),t=G(s,{threshold:.2}),{contact:i,profile:o}=T;return e.jsx("section",{className:"section section-contact","data-section":"refraction",id:"refraction",children:e.jsx("div",{className:"bleed",children:e.jsxs("div",{className:`contact-wrap ${t?"is-shown":""}`,ref:s,children:[e.jsxs("div",{className:"contact-header",children:[e.jsx("p",{className:"t-label",children:"04"}),e.jsx(H,{as:"h2",className:"t-h1 contact-title",text:"REFRACTION CONTINUES",stagger:.07}),e.jsx(H,{as:"p",className:"t-lead is-dim contact-kicker",text:o.name+" · "+o.title,stagger:.03,delay:.3})]}),e.jsxs("div",{className:"contact-body grid12",children:[e.jsxs("div",{className:"glass-lg contact-block grid-span-6",children:[e.jsx("span",{className:"t-label",children:"Get in touch"}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["邮箱：",i.email]}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["电话：",i.phone]}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["城市：",i.location]}),e.jsxs("p",{className:"t-small u-dim cv-line",children:["求职意向：",o.objective]})]}),e.jsxs("div",{className:"contact-closure grid-span-6",children:[e.jsx("p",{className:"t-display",style:{opacity:.5},children:"—"}),e.jsx("p",{className:"t-mono u-dim",style:{marginTop:"1em"},children:M.narrative}),e.jsx("div",{className:"contact-chain",children:[...M.chain].reverse().map((a,n)=>e.jsxs(L.Fragment,{children:[e.jsx("span",{className:"t-pixel",children:a}),n<M.chain.length-1&&e.jsx("span",{className:"u-dim",children:"←"})]},a))})]})]})]})})})}function mt(){const s=x(c=>c.activeProject),t=x(c=>c.closeProject),i=x(c=>c.openProject),o=d.useRef(null),a=K(s);if(d.useEffect(()=>{const c=m=>{m.key==="Escape"&&t()};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[t]),!a)return null;const n=k.findIndex(c=>c.id===a.id),l=k[(n-1+k.length)%k.length],r=k[(n+1)%k.length];return e.jsxs("article",{className:"project-view",ref:o,"data-project-view":a.id,children:[e.jsxs("button",{className:"project-back t-micro",onClick:t,children:[e.jsx("span",{className:"back-arrow","aria-hidden":"true",children:"←"}),e.jsx("span",{children:"SPECTRUM INDEX"})]}),e.jsxs("header",{className:"project-hero bleed",children:[e.jsxs("div",{className:"project-hero-meta",children:[e.jsx("span",{className:"t-pixel project-index",children:a.index}),e.jsx("span",{className:"t-micro project-wavelength",children:a.wavelength}),e.jsxs("span",{className:"t-micro u-dim project-nm",children:[a.nm,"nm"]})]}),e.jsx("h1",{className:"t-display project-title",children:a.title}),e.jsx("div",{className:"project-spectrum-band","aria-hidden":"true",children:e.jsx("span",{className:"band-fill"})}),e.jsxs("dl",{className:"project-facts",children:[e.jsxs("div",{className:"fact",children:[e.jsx("dt",{className:"t-micro u-dim",children:"DISCIPLINE"}),e.jsx("dd",{className:"t-small",children:a.discipline})]}),e.jsxs("div",{className:"fact",children:[e.jsx("dt",{className:"t-micro u-dim",children:"YEAR"}),e.jsx("dd",{className:"t-small",children:a.year})]}),e.jsxs("div",{className:"fact",children:[e.jsx("dt",{className:"t-micro u-dim",children:"ROLE"}),e.jsx("dd",{className:"t-small",children:a.role})]})]})]}),e.jsxs("div",{className:"project-body bleed",children:[e.jsxs("section",{className:"project-block",children:[e.jsx("p",{className:"t-label u-dim",children:"OVERVIEW"}),e.jsx("p",{className:"t-lead project-summary",children:a.overview||a.summary})]}),e.jsx("figure",{className:"project-media glass","aria-label":"Project cover placeholder",children:e.jsx("span",{className:"t-micro u-dim",children:"COVER IMAGE — to be provided"})}),e.jsxs("div",{className:"project-media-pair",children:[e.jsx("figure",{className:"project-media glass is-half",children:e.jsx("span",{className:"t-micro u-dim",children:"IMAGE — to be provided"})}),e.jsx("figure",{className:"project-media glass is-half",children:e.jsx("span",{className:"t-micro u-dim",children:"IMAGE — to be provided"})})]}),[{label:"PROBLEM",text:a.problem},{label:"PROCESS",text:a.process},{label:"OUTCOME",text:a.outcome}].map(({label:c,text:m})=>e.jsxs("section",{className:"project-block",children:[e.jsx("p",{className:"t-label u-dim",children:c}),e.jsx("p",{className:"t-body u-mute",children:m||"Placeholder — content to be provided."})]},c))]}),e.jsxs("nav",{className:"project-nav bleed","aria-label":"Project navigation",children:[e.jsxs("button",{className:"project-nav-item",onClick:()=>i(l.id),style:{"--nav-color":l.color},children:[e.jsx("span",{className:"t-micro u-dim",children:"PREVIOUS WAVELENGTH"}),e.jsx("span",{className:"t-h3",children:l.title}),e.jsx("span",{className:"t-micro nav-wl",children:l.wavelength})]}),e.jsxs("button",{className:"project-nav-item is-next",onClick:()=>i(r.id),style:{"--nav-color":r.color},children:[e.jsx("span",{className:"t-micro u-dim",children:"NEXT WAVELENGTH"}),e.jsx("span",{className:"t-h3",children:r.title}),e.jsx("span",{className:"t-micro nav-wl",children:r.wavelength})]})]})]})}function ht(){const s=x(n=>n.booted),t=x(n=>n.setBooted),i=x(n=>n.view),[o,a]=d.useState(!1);return Ne(),Se(),Ee(i==="index"),Ie(),d.useEffect(()=>{const n=setTimeout(()=>{t(!0),setTimeout(()=>a(!0),600)},1200);return()=>clearTimeout(n)},[t]),e.jsxs(e.Fragment,{children:[e.jsx(Ze,{ready:o}),e.jsxs("div",{className:"site","data-site":!0,"data-view":i,children:[e.jsx("a",{href:"#main",className:"skip-link",children:"Skip to content"}),e.jsx(Je,{}),e.jsx("main",{id:"main",children:i==="project"?e.jsx(mt,{}):e.jsxs(e.Fragment,{children:[e.jsx(ot,{}),e.jsx(rt,{}),e.jsx(ct,{}),e.jsx(dt,{}),e.jsx(ut,{})]})})]}),!s&&e.jsx(et,{}),e.jsx(at,{})]})}ve.createRoot(document.getElementById("root")).render(e.jsx(ht,{}));
