(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,17521,e=>{"use strict";let t=(0,e.i(75254).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["default",()=>t])},61911,e=>{"use strict";let t=(0,e.i(75254).default)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);e.s(["Users",()=>t],61911)},15844,33717,98503,41071,e=>{"use strict";let t,a;var s,i=e.i(43476),r=e.i(67228),o=e.i(64119),l=e.i(46932),n=e.i(88653),d=e.i(82373),c=e.i(87951),m=e.i(75254);let p=(0,m.default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);var h=e.i(10980),u=e.i(86311),x=e.i(22016),g=e.i(18566),f=e.i(71645);let b={data:""},y=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,v=/\/\*[^]*?\*\/|  +/g,j=/\n+/g,w=(e,t)=>{let a="",s="",i="";for(let r in e){let o=e[r];"@"==r[0]?"i"==r[1]?a=r+" "+o+";":s+="f"==r[1]?w(o,r):r+"{"+w(o,"k"==r[1]?"":t)+"}":"object"==typeof o?s+=w(o,t?t.replace(/([^,])+/g,e=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):r):null!=o&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=w.p?w.p(r,o):r+":"+o+";")}return a+(t&&i?t+"{"+i+"}":i)+s},k={},N=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+N(e[a]);return t}return e};function S(e){let t,a,s=this||{},i=e.call?e(s.p):e;return((e,t,a,s,i)=>{var r;let o=N(e),l=k[o]||(k[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!k[l]){let t=o!==e?e:(e=>{let t,a,s=[{}];for(;t=y.exec(e.replace(v,""));)t[4]?s.shift():t[3]?(a=t[3].replace(j," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(j," ").trim();return s[0]})(e);k[l]=w(i?{["@keyframes "+l]:t}:t,a?"":"."+l)}let n=a&&k.g?k.g:null;return a&&(k.g=k[l]),r=k[l],n?t.data=t.data.replace(n,r):-1===t.data.indexOf(r)&&(t.data=s?r+t.data:t.data+r),l})(i.unshift?i.raw?(t=[].slice.call(arguments,1),a=s.p,i.reduce((e,s,i)=>{let r=t[i];if(r&&r.call){let e=r(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;r=t?"."+t:e&&"object"==typeof e?e.props?"":w(e,""):!1===e?"":e}return e+s+(null==r?"":r)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||b})(s.target),s.g,s.o,s.k)}S.bind({g:1});let M,$,C,A=S.bind({k:1});function T(e,t){let a=this||{};return function(){let s=arguments;function i(r,o){let l=Object.assign({},r),n=l.className||i.className;a.p=Object.assign({theme:$&&$()},l),a.o=/ *go\d+/.test(n),l.className=S.apply(a,s)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),C&&d[0]&&C(l),M(d,l)}return t?t(i):i}}var D=(e,t)=>"function"==typeof e?e(t):e,z=(t=0,()=>(++t).toString()),L=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},R="default",E=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return E(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let r=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+r}))}}},q=[],V={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},P={},F=(e,t=R)=>{P[t]=E(P[t]||V,e),q.forEach(([e,a])=>{e===t&&a(P[t])})},I=e=>Object.keys(P).forEach(t=>F(e,t)),U=(e=R)=>t=>{F(t,e)},O=e=>(t,a)=>{let s,i=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||z()}))(t,e,a);return U(i.toasterId||(s=i.id,Object.keys(P).find(e=>P[e].toasts.some(e=>e.id===s))))({type:2,toast:i}),i.id},_=(e,t)=>O("blank")(e,t);_.error=O("error"),_.success=O("success"),_.loading=O("loading"),_.custom=O("custom"),_.dismiss=(e,t)=>{let a={type:3,toastId:e};t?U(t)(a):I(a)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let a={type:4,toastId:e};t?U(t)(a):I(a)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,a)=>{let s=_.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?D(t.success,e):void 0;return i?_.success(i,{id:s,...a,...null==a?void 0:a.success}):_.dismiss(s),e}).catch(e=>{let i=t.error?D(t.error,e):void 0;i?_.error(i,{id:s,...a,...null==a?void 0:a.error}):_.dismiss(s)}),e};var B=A`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,H=A`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,W=A`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,G=T("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${W} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,J=A`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,K=T("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${J} 1s linear infinite;
`,Q=A`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Y=A`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Z=T("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Y} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,X=T("div")`
  position: absolute;
`,ee=T("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,et=A`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ea=T("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${et} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,es=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?f.createElement(ea,null,t):t:"blank"===a?null:f.createElement(ee,null,f.createElement(K,{...s}),"loading"!==a&&f.createElement(X,null,"error"===a?f.createElement(G,{...s}):f.createElement(Z,{...s})))},ei=T("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,er=T("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;f.memo(({toast:e,position:t,style:a,children:s})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,i]=L()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${A(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${A(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},r=f.createElement(es,{toast:e}),o=f.createElement(er,{...e.ariaProps},D(e.message,e));return f.createElement(ei,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof s?s({icon:r,message:o}):f.createElement(f.Fragment,null,r,o))}),s=f.createElement,w.p=void 0,M=s,$=void 0,C=void 0,S`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.i(61086);var eo=e.i(27215),el=e.i(59141);e.i(36180);var en=e.i(98925);function ed(){let[e,t]=(0,f.useState)([]),[a,s]=(0,f.useState)(1),r=(0,f.useRef)(null),[o,l]=(0,f.useState)([]),n=(0,g.useRouter)(),d=async e=>{let a=e.target.files;if(!a)return;let s=[],i=[];for(let e=0;e<a.length;e++){let r=a[e],o=`${Date.now()}_${Math.random().toString(36).slice(2,8)}`,n=`uploads/${Date.now()}_${Math.random().toString(36).slice(2,8)}_${r.name}`,d=(0,eo.ref)(el.storage,n);l(e=>[{id:o,name:r.name,type:r.type,progress:0,status:"uploading"},...e]),(0,eo.uploadBytesResumable)(d,r).on("state_changed",e=>{let t=e.totalBytes?Math.round(e.bytesTransferred/e.totalBytes*100):0;l(e=>e.map(e=>e.id===o?{...e,progress:t}:e))},e=>{l(e=>e.map(e=>e.id===o?{...e,status:"error"}:e)),i.push(r.name)},async()=>{try{let e=await (0,eo.getDownloadURL)(d);try{let a=await (0,en.addDoc)((0,en.collection)(el.db,"userUploads"),{name:r.name,url:e,type:r.type,storagePath:n,createdAt:(0,en.serverTimestamp)()});l(t=>t.map(t=>t.id===o?{...t,progress:100,status:"done",url:e,storagePath:n,docId:a.id}:t)),t(t=>[{name:r.name,url:e,type:r.type,id:a.id},...t]),s.push({name:r.name,url:e,type:r.type,id:a.id})}catch(a){l(t=>t.map(t=>t.id===o?{...t,progress:100,status:"done",url:e,storagePath:n}:t)),t(t=>[{name:r.name,url:e,type:r.type},...t]),s.push({name:r.name,url:e,type:r.type})}}catch(e){l(e=>e.map(e=>e.id===o?{...e,status:"error"}:e)),i.push(r.name)}})}s.length>0&&t(e=>[...s,...e]),r.current&&(r.current.value=""),i.length>0&&alert(`Failed to upload: ${i.join(", ")}. Check console for details.`)},c=async e=>{if(!e.url)return alert("No URL for file");if(e.type.startsWith("text/")||e.name.endsWith(".md")){let t=await fetch(e.url);(e=>{if(!("speechSynthesis"in window))return alert("SpeechSynthesis not supported in this browser.");window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e);t.rate=a,window.speechSynthesis.speak(t)})(await t.text());return}e.name.endsWith(".pdf")?alert("PDF reading is not supported in this free client mode. Upload plain text or markdown to enable in-browser reading."):alert("Document reading is supported for plain text and markdown. PDF reading is experimental.")},m=async e=>{try{await (0,en.addDoc)((0,en.collection)(el.db,"captionJobs"),{storagePath:e.url,url:e.url,type:e.type,status:"queued",createdAt:(0,en.serverTimestamp)()}),alert("Caption job enqueued. If server-side transcription is configured it will be processed.")}catch(e){alert("Failed to enqueue caption job")}};return(0,i.jsxs)("div",{className:"p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700",children:[(0,i.jsx)("h4",{className:"font-semibold mb-2",children:"Upload documents & videos"}),(0,i.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400 mb-4",children:"Upload files here. Documents can be read aloud; videos can be enqueued for captioning."}),(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[(0,i.jsx)("input",{ref:r,type:"file",multiple:!0,onChange:d,className:"hidden",id:"upload-input"}),(0,i.jsx)("label",{htmlFor:"upload-input",onClick:()=>r.current?.click(),className:"px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer",children:"Select files"}),(0,i.jsxs)("div",{className:"ml-auto flex items-center gap-2",children:[(0,i.jsx)("label",{className:"text-sm",children:"Reading speed"}),(0,i.jsx)("input",{type:"range",min:.5,max:2,step:.1,value:a,onChange:e=>s(Number(e.target.value))})]})]}),(0,i.jsxs)("div",{className:"mt-4 space-y-2",children:[o.length>0&&(0,i.jsx)("div",{className:"space-y-2 mb-3",children:o.map(e=>(0,i.jsxs)("div",{className:"p-2 bg-gray-50 dark:bg-slate-900 rounded",children:[(0,i.jsxs)("div",{className:"flex items-center justify-between",children:[(0,i.jsx)("div",{className:"text-sm font-medium",children:e.name}),(0,i.jsx)("div",{className:"text-xs text-gray-500",children:"uploading"===e.status?`${e.progress}%`:e.status})]}),(0,i.jsx)("div",{className:"w-full bg-gray-200 dark:bg-slate-800 rounded h-2 mt-2 overflow-hidden",children:(0,i.jsx)("div",{className:"h-2 bg-indigo-600",style:{width:`${e.progress}%`}})})]},e.id))}),e.map((e,t)=>(0,i.jsxs)("div",{className:"flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"font-medium",children:e.name}),(0,i.jsx)("div",{className:"text-xs text-gray-500",children:e.type})]}),(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[(0,i.jsx)("button",{onClick:()=>c(e),className:"px-3 py-1 bg-green-600 text-white rounded text-sm",children:"Read"}),e.type.startsWith("video/")&&(0,i.jsx)(i.Fragment,{children:(0,i.jsx)("button",{onClick:()=>m(e),className:"px-3 py-1 bg-indigo-600 text-white rounded text-sm",children:"Enqueue Captions"})}),(0,i.jsx)("a",{className:"px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded text-sm",href:e.url,target:"_blank",rel:"noreferrer",children:"Open"}),e.id&&(0,i.jsx)("button",{onClick:()=>n.push(`/uploads/viewer/${e.id}`),className:"px-3 py-1 bg-indigo-700 text-white rounded text-sm",children:"Open Viewer"})]})]},t))]})]})}function ec(){let{screenReaderOptimized:e,toggleScreenReader:t}=(0,r.useAccessibilityStore)(),{currentTheme:a}=(0,o.useThemeStore)(),s=(0,g.useRouter)(),[m,b]=(0,f.useState)(!1),[y,v]=(0,f.useState)("");(0,f.useEffect)(()=>{let e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e)return;let t=new e;t.continuous=!0,t.interimResults=!0;try{t.lang="en-US"}catch{}return t.onresult=e=>{if("results"in e){var t;let a=Array.from(e.results).map(e=>e&&e[0]?e[0].transcript:"").join("");v(a),(t=a.toLowerCase()).includes("go to courses")?(s.push("/courses"),b(!1)):t.includes("go to messages")?(s.push("/messages"),b(!1)):t.includes("open document reader")?(s.push("/reader"),b(!1)):t.includes("stop listening")&&(b(!1),_.success("Voice commands deactivated."))}},t.onend=()=>{m&&t.start()},m&&t.start(),()=>{t.stop()}},[m]);let j=[{label:e?"Disable Screen Reader":"Enable Screen Reader",icon:d.Volume2,action:t,color:"from-emerald-600 to-cyan-600",description:"Toggle screen reader compatibility mode."},{label:m?"Deactivate Voice Commands":"Activate Voice Commands",icon:c.Mic,action:()=>{window.SpeechRecognition||window.webkitSpeechRecognition?(b(e=>!e),v(""),_.success(m?"Voice commands deactivated.":'Voice commands activated! Try "Go to courses".')):_.error("Sorry, your browser does not support voice commands.")},color:"from-emerald-600 to-cyan-600",description:"Control the interface with your voice."},{label:"Document Reader",description:"Upload and listen to documents with text-to-speech.",icon:p,color:"from-emerald-600 to-cyan-600"},{label:"Audio-Described Lectures",description:"Access lectures with descriptive audio for visual content.",icon:d.Volume2,href:"/courses?filter=audio-described",color:"from-emerald-600 to-cyan-600"},{label:"Braille Materials",icon:h.BookOpen,href:"/courses?filter=braille",color:"from-emerald-600 to-cyan-600",description:"Find course materials ready for Braille displays."},{label:"Contact a Lecturer",description:"Send a message to any of your lecturers.",icon:u.MessageSquare,href:"/messages",color:"from-emerald-600 to-cyan-600"}];return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.AnimatePresence,{children:m&&(0,i.jsx)(l.motion.div,{initial:{opacity:0,y:-50},animate:{opacity:1,y:0},exit:{opacity:0,y:-50},className:"fixed top-24 left-1/2 -translate-x-1/2 bg-indigo-600/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl z-50 w-full max-w-md",role:"status","aria-live":"assertive",children:(0,i.jsxs)("div",{className:"flex items-center gap-4",children:[(0,i.jsx)(c.Mic,{className:"text-red-500 animate-pulse",size:24}),(0,i.jsxs)("div",{className:"flex-grow",children:[(0,i.jsx)("p",{className:"font-bold",children:"Listening..."}),(0,i.jsx)("p",{className:"text-sm text-white/70 h-5",children:y||'Say a command like "Go to courses"'})]})]})})}),(0,i.jsxs)(l.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},className:"mb-12",children:[(0,i.jsx)("h2",{className:`text-3xl font-bold mb-6 ${"light"===a?"text-black":"text-white"}`,children:"Vision-Assist Dashboard"}),(0,i.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:j.map(e=>(0,i.jsx)(x.default,{href:e.href||"#",className:"group",children:(0,i.jsxs)("div",{onClick:e.action,className:`${"light"===a?"bg-emerald-50 border-emerald-300":"bg-slate-800 border-emerald-600"} p-6 rounded-xl border hover:border-emerald-400 transition-all h-full flex flex-col cursor-pointer bg-gradient-to-br hover:from-emerald-600 ${e.action?"hover:to-cyan-600":"hover:to-emerald-700"}`,children:[(0,i.jsx)("div",{className:"flex-shrink-0 mb-4",children:(0,i.jsx)(e.icon,{size:28,className:`text-black dark:text-white ${m&&e.icon===c.Mic?"text-red-500 animate-pulse":""}`})}),(0,i.jsx)("h4",{className:`font-bold text-xl mb-2 ${"light"===a?"text-black":"text-white"}`,children:e.label}),(0,i.jsx)("p",{className:`${"light"===a?"text-black/70":"text-white/70"} text-sm flex-grow`,children:e.description}),(0,i.jsx)("div",{className:"mt-4 text-black dark:text-white font-medium group-hover:underline",children:e.href?"Access Tool →":"Activate"})]})},e.label))})]}),(0,i.jsxs)(l.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:[(0,i.jsx)("h3",{className:`text-2xl font-bold mb-6 ${"light"===a?"text-black":"text-white"}`,children:"Upcoming Deadlines"}),(0,i.jsx)("div",{className:"space-y-4",children:[{title:"CS101 Project Proposal",due:"in 2 days",course:"Intro to Computer Science"},{title:"MATH203 Problem Set 5",due:"in 4 days",course:"Linear Algebra"},{title:"LIT301 Essay Outline",due:"in 1 week",course:"Modernist Literature"}].map((e,t)=>(0,i.jsxs)("div",{className:`p-4 ${"light"===a?"bg-white border-l-black":"bg-black border-l-white"} rounded-lg border-l-4 flex justify-between items-center`,children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:`font-semibold ${"light"===a?"text-black":"text-white"}`,children:e.title}),(0,i.jsx)("p",{className:`text-xs ${"light"===a?"text-gray-600":"text-gray-400"}`,children:e.course})]}),(0,i.jsx)("div",{className:"text-right",children:(0,i.jsx)("p",{className:"font-bold text-purple-400",children:e.due})})]},t))})]}),(0,i.jsx)("div",{className:"mt-8",children:(0,i.jsx)(ed,{})})]})}e.s(["default",()=>ec],15844);let em=(0,m.default)("captions",[["rect",{width:"18",height:"14",x:"3",y:"5",rx:"2",ry:"2",key:"12ruh7"}],["path",{d:"M7 15h4M15 15h2M7 11h2M13 11h4",key:"1ueiar"}]]),ep=(0,m.default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]),eh=(0,m.default)("video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]);var eu=e.i(61911);let ex=(0,m.default)("hand",[["path",{d:"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",key:"1fvzgz"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",key:"1kc0my"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",key:"10h0bg"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"1s1gnw"}]]);function eg(){let{captionsEnabled:e,toggleCaptions:t,visualAlertsEnabled:a,toggleVisualAlerts:s}=(0,r.useAccessibilityStore)(),o=[{label:e?"Disable Live Captions":"Enable Live Captions",icon:em,action:t,description:"Toggle real-time captions for all audio content."},{label:"Sign-to-Text",icon:ex,href:"/sign-to-text",description:"Translate sign language into text via your camera."},{label:"Text-to-Sign",icon:eh,href:"/text-to-sign",description:"Convert written text into sign language animations."},{label:"Request Interpreter",icon:eu.Users,href:"/accommodation-request?service=Sign%20Language%20Interpretation",description:"Schedule a sign language interpreter for a class."},{label:a?"Disable Visual Alerts":"Enable Visual Alerts",icon:ep,action:s,description:"Receive visual notifications for important alerts."}];return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(l.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},className:"mb-12",children:[(0,i.jsx)("h2",{className:"text-3xl font-bold mb-6",children:"Hearing-Assist Dashboard"}),(0,i.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:o.map(e=>(0,i.jsx)(x.default,{href:e.href||"#",className:"group",children:(0,i.jsxs)("div",{onClick:e.action,className:`bg-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all h-full flex flex-col cursor-pointer bg-gradient-to-br hover:from-slate-800/50 ${e.action?"hover:to-cyan-900/40":"hover:to-slate-900/20"}`,children:[(0,i.jsx)("div",{className:"flex-shrink-0 mb-4",children:(0,i.jsx)(e.icon,{size:28,className:"text-cyan-400"})}),(0,i.jsx)("h4",{className:"font-bold text-xl mb-2",children:e.label}),(0,i.jsx)("p",{className:"text-gray-400 text-sm flex-grow",children:e.description}),(0,i.jsx)("div",{className:"mt-4 text-cyan-400 font-medium group-hover:underline",children:e.href?"Access Tool →":"Activate"})]})},e.label))})]}),(0,i.jsxs)(l.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:[(0,i.jsx)("h3",{className:"text-2xl font-bold mb-6",children:"Scheduled Interpretations"}),(0,i.jsx)("div",{className:"space-y-4",children:[{title:"CHEM101 Lecture",time:"Tomorrow at 10:00 AM",interpreter:"John Doe"},{title:"HIST205 Study Group",time:"Friday at 2:00 PM",interpreter:"Jane Smith"}].map((e,t)=>(0,i.jsxs)("div",{className:"p-4 bg-slate-800/50 rounded-lg border-l-4 border-cyan-500 flex justify-between items-center",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"font-semibold",children:e.title}),(0,i.jsxs)("p",{className:"text-xs text-gray-400",children:["Interpreter: ",e.interpreter]})]}),(0,i.jsx)("div",{className:"text-right",children:(0,i.jsx)("p",{className:"font-bold text-cyan-400",children:e.time})})]},t))})]}),(0,i.jsx)("div",{className:"mt-8",children:(0,i.jsx)(ed,{})})]})}e.s(["default",()=>eg],33717);let ef=(0,m.default)("keyboard",[["path",{d:"M10 8h.01",key:"1r9ogq"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M14 8h.01",key:"1primd"}],["path",{d:"M16 12h.01",key:"1l6xoz"}],["path",{d:"M18 8h.01",key:"emo2bl"}],["path",{d:"M6 8h.01",key:"x9i8wu"}],["path",{d:"M7 16h10",key:"wp8him"}],["path",{d:"M8 12h.01",key:"czm47f"}],["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}]]),eb=(0,m.default)("file-pen-line",[["path",{d:"m18.226 5.226-2.52-2.52A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.351",key:"1k2beg"}],["path",{d:"M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",key:"2t3380"}],["path",{d:"M8 18h1",key:"13wk12"}]]),ey=(0,m.default)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]),ev=(0,m.default)("grid-3x3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);function ej(){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(l.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},className:"mb-12",children:[(0,i.jsx)("h2",{className:"text-3xl font-bold mb-6",children:"Speech-Assist Dashboard"}),(0,i.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[{label:"AAC Communication Board",icon:ev,href:"/aac-board",description:"Use a symbol-based board for communication."},{label:"Text-to-Speech Chat",icon:ey,href:"/messages?feature=text-to-speech",description:"Type messages and have them read aloud in chats."},{label:"Sign-to-Text",icon:ex,href:"/sign-to-text",description:"Communicate using sign language via your camera."},{label:"Video-based Presentations",description:"Submit presentation assignments as pre-recorded videos.",icon:eh,href:"/assignments/submit?type=video"},{label:"Written Q&A Forums",description:"Participate in class discussions through written forums.",icon:eb,href:"/forums"}].map(e=>(0,i.jsx)(x.default,{href:e.href||"#",className:"group",children:(0,i.jsxs)("div",{className:"bg-slate-800/50 p-6 rounded-xl border border-rose-500/20 hover:border-rose-500/50 transition-all h-full flex flex-col cursor-pointer bg-gradient-to-br hover:from-slate-800/50 hover:to-rose-900/40",children:[(0,i.jsx)("div",{className:"flex-shrink-0 mb-4",children:(0,i.jsx)(e.icon,{size:28,className:"text-rose-400"})}),(0,i.jsx)("h4",{className:"font-bold text-xl mb-2",children:e.label}),(0,i.jsx)("p",{className:"text-gray-400 text-sm flex-grow",children:e.description}),(0,i.jsx)("div",{className:"mt-4 text-rose-400 font-medium group-hover:underline",children:"Access Tool →"})]})},e.label))})]}),(0,i.jsxs)(l.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:[(0,i.jsx)("h3",{className:"text-2xl font-bold mb-6",children:"Your Quick Phrases"}),(0,i.jsx)("div",{className:"space-y-4",children:["Can you please repeat that?","I have a question.","Thank you for your help."].map((e,t)=>(0,i.jsxs)("div",{className:"p-4 bg-slate-800/50 rounded-lg border-l-4 border-rose-500 flex justify-between items-center",children:[(0,i.jsx)("p",{className:"font-semibold",children:e}),(0,i.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(e),_.success(`Copied: "${e}"`)},className:"p-2 bg-rose-600 rounded-lg hover:bg-rose-700","aria-label":`Copy phrase: ${e}`,children:(0,i.jsx)(ef,{size:20})})]},t))})]}),(0,i.jsx)("div",{className:"mt-8",children:(0,i.jsx)(ed,{})})]})}e.s(["default",()=>ej],98503);var ew=e.i(39616);let ek=(0,m.default)("life-buoy",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.93 4.93 4.24 4.24",key:"1ymg45"}],["path",{d:"m14.83 9.17 4.24-4.24",key:"1cb5xl"}],["path",{d:"m14.83 14.83 4.24 4.24",key:"q42g0n"}],["path",{d:"m9.17 14.83-4.24 4.24",key:"bqpfvv"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}]]);var eN=e.i(32095),eS=e.i(9200);function eM(){let{currentTheme:e}=(0,o.useThemeStore)(),t=[{label:"View All Courses",icon:eN.GraduationCap,href:"/courses",description:"Browse and enroll in available courses."},{label:"My Assignments",icon:p,href:"/assignments",description:"View upcoming and submitted assignments."},{label:"Request Accommodations",icon:ek,href:"/accommodation-request",description:"Request special accommodations for your courses."},{label:"Contact a Lecturer",description:"Send a message to any of your lecturers for help.",icon:u.MessageSquare,href:"/messages"},{label:"Accessibility Settings",description:"Customize your experience with themes and other options.",icon:ew.Settings,href:"/profile#settings"}],a="light"===e?"bg-blue-50 border-blue-200 hover:border-blue-300":"bg-slate-800/50 border-slate-700/50 hover:border-slate-600/80",s="light"===e?"text-blue-600":"text-slate-400",r="light"===e?"text-gray-700":"text-gray-400",n="light"===e?"text-gray-900":"text-white",d="light"===e?"text-blue-600":"text-slate-400";return(0,i.jsxs)(l.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},className:"mb-12",children:[(0,i.jsx)("h2",{className:`text-3xl font-bold mb-6 ${n}`,children:"Student Dashboard"}),(0,i.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:t.map(e=>(0,i.jsx)(x.default,{href:e.href||"#",className:"group",children:(0,i.jsxs)("div",{className:`${a} p-6 rounded-xl border transition-all h-full flex flex-col cursor-pointer hover:shadow-lg`,children:[(0,i.jsx)("div",{className:"flex-shrink-0 mb-4",children:(0,i.jsx)(e.icon,{size:28,className:s})}),(0,i.jsx)("h4",{className:`font-bold text-xl mb-2 ${n}`,children:e.label}),(0,i.jsx)("p",{className:`${r} text-sm flex-grow`,children:e.description}),(0,i.jsx)("div",{className:`mt-4 ${d} font-medium group-hover:underline`,children:"Access Tool →"})]})},e.label))}),(0,i.jsxs)("div",{className:"mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,i.jsx)("div",{children:(0,i.jsx)(ed,{})}),(0,i.jsx)("div",{children:(0,i.jsxs)("div",{className:`p-4 bg-gradient-to-br ${"light"===e?"from-white to-white":"from-slate-800 to-slate-700"} rounded-xl border`,children:[(0,i.jsx)("h3",{className:"font-semibold mb-2",children:"Live Sign Demo"}),(0,i.jsx)("p",{className:"text-sm text-gray-500 mb-3",children:"Try the sign-language camera demo here."}),(0,i.jsx)(eS.default,{name:"Live Sign Demo"})]})})]})]})}e.s(["default",()=>eM],41071)},64668,e=>{"use strict";var t=e.i(17521);e.s(["LoaderCircle",()=>t.default])}]);