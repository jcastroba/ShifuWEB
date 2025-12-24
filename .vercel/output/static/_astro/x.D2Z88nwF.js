import{a as R,r as p}from"./index.eCxJ45ll.js";var _={exports:{}},u={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h;function C(){if(h)return u;h=1;var o=R(),r=Symbol.for("react.element"),n=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,a=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function l(c,e,d){var t,m={},y=null,k=null;d!==void 0&&(y=""+d),e.key!==void 0&&(y=""+e.key),e.ref!==void 0&&(k=e.ref);for(t in e)s.call(e,t)&&!i.hasOwnProperty(t)&&(m[t]=e[t]);if(c&&c.defaultProps)for(t in e=c.defaultProps,e)m[t]===void 0&&(m[t]=e[t]);return{$$typeof:r,type:c,key:y,ref:k,props:m,_owner:a.current}}return u.Fragment=n,u.jsx=l,u.jsxs=l,u}var x;function w(){return x||(x=1,_.exports=C()),_.exports}var q=w();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=o=>o.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),v=(...o)=>o.filter((r,n,s)=>!!r&&r.trim()!==""&&s.indexOf(r)===n).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var b={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=p.forwardRef(({color:o="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:s,className:a="",children:i,iconNode:l,...c},e)=>p.createElement("svg",{ref:e,...b,width:r,height:r,stroke:o,strokeWidth:s?Number(n)*24/Number(r):n,className:v("lucide",a),...c},[...l.map(([d,t])=>p.createElement(d,t)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=(o,r)=>{const n=p.forwardRef(({className:s,...a},i)=>p.createElement(E,{ref:i,iconNode:r,className:v(`lucide-${g(o)}`,s),...a}));return n.displayName=`${o}`,n};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],A=f("Calendar",N);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],B=f("CircleCheckBig",O);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],I=f("Clock",$);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],J=f("X",j);export{B as C,J as X,I as a,A as b,f as c,q as j};
