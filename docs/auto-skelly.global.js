"use strict";(()=>{var k="auto-skelly-styles",v=`
.skelly-placeholder {
  display: block;
  box-sizing: border-box;
  background-color: var(--skelly-color, #e3e3e3);
}

.skelly-bar {
  box-sizing: border-box;
  background-color: var(--skelly-color, #e3e3e3);
  border-radius: 5px;
}

@media (prefers-reduced-motion: no-preference) {
  .skelly-anim-pulse {
    animation: skelly-pulse var(--skelly-duration, 2s) infinite ease-in-out;
  }

  .skelly-anim-extraPulse {
    animation: skelly-extra-pulse var(--skelly-duration, 2s) infinite;
  }

  .skelly-anim-gradient {
    animation: skelly-gradient var(--skelly-duration, 5s) ease infinite;
  }
}

.skelly-anim-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
}

@keyframes skelly-pulse {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}

@keyframes skelly-extra-pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

@keyframes skelly-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`;function b(n){if(n.getElementById(k))return;let e=n.createElement("style");e.id=k,e.textContent=v,n.head.appendChild(e)}var E=".skelly-text, .skelly-image, .skelly-circle, .skelly-button";function R(n){let e=n;if(e.nodeType===9)return e;let t=e.ownerDocument;if(!t)throw new Error("AutoSkelly: unable to resolve a document from the given root");return t}function L(n){return n.classList.contains("skelly-text")?"text":n.classList.contains("skelly-image")?"image":n.classList.contains("skelly-circle")?"circle":n.classList.contains("skelly-button")?"button":null}function w(n){if(!n)return!1;let e=n.match(/[\d.]+/g);return e?e.some(t=>parseFloat(t)!==0):!1}function A(n){switch(n){case"text":case"button":return"5px";case"circle":return"50%";default:return"0"}}function p(n,e){let t=n.borderRadius;return w(t)?t:A(e)}function M(n,e){n.style.marginTop=e.marginTop,n.style.marginRight=e.marginRight,n.style.marginBottom=e.marginBottom,n.style.marginLeft=e.marginLeft}function N(n){let e=parseFloat(n.fontSize)||16,t=n.lineHeight;if(!t||t==="normal")return e*1.2;if(t.endsWith("px")){let s=parseFloat(t);return Number.isNaN(s)?e*1.2:s}let i=parseFloat(t);return Number.isNaN(i)?e*1.2:i*e}function S(n,e,t){if(t.width>0)return`${t.width}px`;if(n==="image"&&e.tagName==="IMG"){let i=e.getAttribute("width");if(i)return`${i}px`}return"100%"}function C(n,e,t){if(t.height>0)return{height:`${t.height}px`};if(n==="image"){if(e.tagName==="IMG"){let i=e.getAttribute("height");if(i)return{height:`${i}px`}}return{aspectRatio:"16 / 9"}}return{height:"2.5em"}}function D(n){let e=Math.max(n.width,n.height);return e>0?`${e}px`:"3em"}function B(n,e){let t=n.createElement("div");return t.setAttribute("data-skelly-placeholder",""),t.setAttribute("aria-hidden","true"),t.classList.add("skelly-placeholder",`skelly-shape-${e}`),t}function x(n,e){let t=[];n.classList.forEach(i=>{i.startsWith("skelly-anim-")&&t.push(i)}),t.forEach(i=>n.classList.remove(i)),e!=="none"&&n.classList.add(`skelly-anim-${e}`)}function T(n,e,t,i,s,r,a){let c=Math.max(2,Math.round(t/i)),o=.6*i,y=.4*i;e.style.display="flex",e.style.flexDirection="column",e.style.gap=`${y}px`,e.style.height=`${t}px`,e.style.backgroundColor="transparent";for(let h=0;h<c;h++){let l=n.createElement("div");l.classList.add("skelly-bar"),a!=="none"&&l.classList.add(`skelly-anim-${a}`),l.style.setProperty("--skelly-color",r),l.style.height=`${o}px`,l.style.width=h===c-1?"60%":"100%",l.style.borderRadius=s,e.appendChild(l)}}var m=class{constructor(e={}){this.records=[];this.originalToRecord=new Map;this.parentBusyCounts=new Map;this.color=e.color??"#e3e3e3",this.animation=e.animation??"pulse",this.defaultRoot=e.root??(typeof document<"u"?document:void 0)}apply(e=this.defaultRoot??(typeof document<"u"?document:void 0)){if(!e)return;let t=R(e);b(t),e.querySelectorAll(E).forEach(s=>{if(s.hasAttribute("data-skelly-placeholder")||this.originalToRecord.has(s))return;let r=L(s);if(!r)return;let a=s.getBoundingClientRect(),c=getComputedStyle(s),o=B(t,r);if(M(o,c),r==="circle"){let d=D(a);o.style.width=d,o.style.height=d,o.style.borderRadius=p(c,"circle"),o.style.setProperty("--skelly-color",this.color),this.animation!=="none"&&o.classList.add(`skelly-anim-${this.animation}`)}else if(r==="text"){let d=S("text",s,a),u=N(c),g=p(c,"text");o.style.width=d,a.height>=2*u?T(t,o,a.height,u,g,this.color,this.animation):(o.style.height=a.height>0?`${a.height}px`:"1em",o.style.borderRadius=g,o.style.setProperty("--skelly-color",this.color),this.animation!=="none"&&o.classList.add(`skelly-anim-${this.animation}`))}else{let d=S(r,s,a),u=C(r,s,a);o.style.width=d,u.height&&(o.style.height=u.height),u.aspectRatio&&(o.style.aspectRatio=u.aspectRatio),o.style.borderRadius=p(c,r),o.style.setProperty("--skelly-color",this.color),this.animation!=="none"&&o.classList.add(`skelly-anim-${this.animation}`)}let y=s.parentNode;if(!y)return;y.insertBefore(o,s);let h=s.style.display;s.style.display="none";let l=s.parentElement;this.markBusy(l);let f={original:s,placeholder:o,parent:y,priorInlineDisplay:h,ariaBusyParent:l};this.records.push(f),this.originalToRecord.set(s,f)})}remove(e){(e?this.records.filter(i=>e.contains(i.original)):this.records.slice()).forEach(i=>this.restore(i))}setTheme(e){e.color!==void 0&&(this.color=e.color),e.animation!==void 0&&(this.animation=e.animation),this.records.forEach(t=>{let{placeholder:i}=t;i.style.setProperty("--skelly-color",this.color);let s=i.querySelectorAll(".skelly-bar");s.length>0?s.forEach(r=>{r.style.setProperty("--skelly-color",this.color),x(r,this.animation)}):x(i,this.animation)})}get active(){return this.records.length>0}restore(e){e.placeholder.parentNode?.removeChild(e.placeholder),e.original.style.display=e.priorInlineDisplay,this.originalToRecord.delete(e.original);let t=this.records.indexOf(e);t!==-1&&this.records.splice(t,1),this.unmarkBusy(e.ariaBusyParent)}markBusy(e){if(!e)return;let t=this.parentBusyCounts.get(e)??0;t===0&&e.setAttribute("aria-busy","true"),this.parentBusyCounts.set(e,t+1)}unmarkBusy(e){if(!e)return;let t=this.parentBusyCounts.get(e);t!==void 0&&(t<=1?(this.parentBusyCounts.delete(e),e.removeAttribute("aria-busy")):this.parentBusyCounts.set(e,t-1))}};if(typeof document<"u"){let n=document.currentScript;if(n&&n.hasAttribute("data-skelly-auto")){let e=()=>{new m().apply()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e()}}window.AutoSkelly=m;})();
//# sourceMappingURL=auto-skelly.global.js.map