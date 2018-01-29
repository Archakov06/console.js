!function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},n=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),i=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},o=function(){function e(){t(this,e)}return n(e,[{key:"render",value:function(){return O(this.template)}},{key:"bind",value:function(){}},{key:"template",get:function(){}},{key:"el",get:function(){return this._el||(this._el=this.render(),this.bind(this._el)),this._el}}]),e}(),a=function(e){function a(e,n,i){t(this,a);var o=r(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return o._value=e,o._type=n,o._isPrimitive=i,o}return i(a,o),n(a,[{key:"value",get:function(){return this._value}},{key:"type",get:function(){return this._type}},{key:"isPrimitive",get:function(){return this._isPrimitive}}]),a}(),s="log",l="dir",c="preview",u="prop",_="error",d="console__item-head",p="console__item-head_size",h="console__item-head_elements",y="console__item-content-container",v=function(e){function o(e,n){t(this,o);var i=r(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,"object",!1));return i._mode=n,i._entries=new Map,i._isOpened=!1,i}return i(o,a),n(o,[{key:"bind",value:function(){var e=this,t=this.el.querySelector("."+d);this._contentContainerEl=this.el.querySelector("."+y);var n=this._getHeadContent();n instanceof HTMLElement||n instanceof DocumentFragment?t.appendChild(n):t.innerHTML=n,this._mode!==c&&this._mode!==_&&t.addEventListener("click",function(){e._isOpened?e._hideContent():e._showContent(),e._isOpened=!e._isOpened})}},{key:"_showContent",value:function(){this._proxiedContentEl||(this._proxiedContentEl=O('<div class="console__item-content"></div>'),this._proxiedContentEl.appendChild(this.createContent(this.value,!1)),this._contentContainerEl.appendChild(this._proxiedContentEl),this._displayVal=this._proxiedContentEl.style.display),this._proxiedContentEl.style.display=this._displayVal}},{key:"_hideContent",value:function(){this._proxiedContentEl.style.display="none"}},{key:"_getHeadContent",value:function(){return"[object Object]"===Object.prototype.toString.call(this.value)?this._mode!==c?this.createContent(this.value,!0):"...":this._mode===l?this._getHeadDirContent():this._mode===s?this._getHeadDirContent():this._mode===c?this._getHeadDirContent():this._mode===_?this._getHeadErrorContent():""}},{key:"_getHeadPreviewContent",value:function(){}},{key:"_getHeadLogContent",value:function(){}},{key:"_getHeadErrorContent",value:function(){return"<pre>"+this.value.stack+"</pre>"}},{key:"_getHeadDirContent",value:function(){if(this.value instanceof HTMLElement){var e=this.value.tagName.toLowerCase();return this.value.classList.length&&(e+="."+Array.prototype.join.call(this.value.classList,".")),e}return this.value instanceof Error?this.value.stack:this.value.constructor.name}},{key:"createContent",value:function(e,t){var n=document.createDocumentFragment(),i=new Set;for(var r in e){i.add(r);var a=e[r],s=w(a,t?c:u),l=o.createEntryEl(r,s.el);n.appendChild(l)}var _=!0,d=!1,p=void 0;try{for(var h,y=Object.getOwnPropertyNames(e)[Symbol.iterator]();!(_=(h=y.next()).done);_=!0){var v=h.value;if(!i.has(v)){var f=e[v],m=w(f,t?c:u),g=o.createEntryEl(v,m.el);n.appendChild(g)}}}catch(e){d=!0,p=e}finally{try{!_&&y.return&&y.return()}finally{if(d)throw p}}return n}},{key:"template",get:function(){return'\n<div class="console__item object '+Object.prototype.toString.call(this.value).slice(8,-1)+" "+(this._mode===_?""+this._mode:"")+'">  <div class="'+d+'"></div>  <div class="'+y+'"></div></div>'}}],[{key:"createEntryEl",value:function(e,t){var n=O('<span class="object__entry object-entry">\n  <span class="object-entry__key">'+e+'</span><span class="object-entry__value-container"></span>\n</span>');return n.querySelector(".object-entry__value-container").appendChild(t),n}}]),o}(),f=function(e){function o(e,n){t(this,o);var i=r(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,"array",!1));return i._arr=e,i._mode=n,i._elements=new Map,i._isOpened=!1,i}return i(o,a),n(o,[{key:"bind",value:function(){var e=this;if(this._mode!==c){this._contentContainerEl=this.el.querySelector("."+y);var t=this.el.querySelector("."+d);t.appendChild(this.createContent(this.value,!0)),t.addEventListener("click",function(){e._isOpened?e._hideContent():e._showContent(),e._isOpened=!e._isOpened})}}},{key:"_showContent",value:function(){this._proxiedContentEl||(this._proxiedContentEl=O('<div class="console__item-content"></div>'),this._proxiedContentEl.appendChild(this.createContent(this.value,!1)),this._contentContainerEl.appendChild(this._proxiedContentEl),this._displayVal=this._proxiedContentEl.style.display),this._proxiedContentEl.style.display=this._displayVal}},{key:"_hideContent",value:function(){this._proxiedContentEl.style.display="none"}},{key:"createContent",value:function(e,t){var n=Object.getOwnPropertyNames(e),i=Object.keys(e),r=document.createDocumentFragment(),a=!0,s=!1,u=void 0;try{for(var _,d=n[Symbol.iterator]();!(a=(_=d.next()).done);a=!0){var p=_.value,h=e[p],y=i.indexOf(p),v=Number.isNaN(Number.parseInt(p,10));if(!t||-1!==y){var f=w(h,t?c:l),m=o.createEntryEl(p,f.el,t?!v:t);r.appendChild(m)}}}catch(e){s=!0,u=e}finally{try{!a&&d.return&&d.return()}finally{if(s)throw u}}return r}},{key:"template",get:function(){return'<div class="console__item array">\n  <div class="'+d+" "+(this._mode===c?p:h)+'">'+(this._mode===c?"Array("+this._arr.length+")":"")+'</div>  <div class="'+y+'"></div>\n</div>'}}],[{key:"createEntryEl",value:function(e,t,n){var i=O('<span class="array__entry array-entry">  '+(n?"":'<span class="array-entry__key">'+e+"</span>")+'<span class="array-entry__value-container"></span></span>');return i.querySelector(".array-entry__value-container").appendChild(t),i}}]),o}(),m="plain",g="arrow",C="class",b=function(e){function o(e,n){t(this,o);var i=r(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,"function",!1));return i._mode=n,i._isOpened=!1,i._fnType=o.checkFnType(e),i}return i(o,a),n(o,[{key:"bind",value:function(){var e=this;this._mode===l&&(this._contentContainerEl=this.el.querySelector("."+y),this.el.querySelector("."+d).addEventListener("click",function(){e._isOpened?e._hideContent():e._showContent(),e._isOpened=!e._isOpened}))}},{key:"_showContent",value:function(){this._proxiedContentEl||(this._proxiedContentEl=O('<div class="console__item-content"></div>'),this._contentContainerEl.appendChild(this._proxiedContentEl),this._displayVal=this._proxiedContentEl.style.display),this._proxiedContentEl.style.display=this._displayVal}},{key:"_hideContent",value:function(){this._proxiedContentEl.style.display="none"}},{key:"_getHeadPropMarkup",value:function(){var e=this._parseFunction(this.value),t=e.name,n=e.params,i=e.lines.join("\n"),r="<span>"+(this._fnType===C?"class ":"")+(this._fnType===m?"f ":"")+(t||"")+(this._fnType!==C?"("+n.join(", ")+")":"")+(this._fnType===g?" => ":" ");return this._fnType!==C&&(r+="{  "+(i.length<=43?i:"...")+"}"),r+="</span>"}},{key:"_getHeadDirMarkup",value:function(){var e=this._parseFunction(this.value),t=e.name,n=e.params;return"  <span>  "+(this._fnType===C?"class ":"")+"  "+(this._fnType===m?"f ":"")+"  "+(t||"")+"  "+(this._fnType!==C?"("+n.join(", ")+")":"")+"</span>"}},{key:"_getLogMarkup",value:function(){return"<pre>"+this.value.toString()+"</pre>"}},{key:"_parseParams",value:function(e){var t=e.indexOf("("),n=e.indexOf(")"),i=e.substring(t+1,n).trim();return i?i.split(",").map(function(e){return e.trim()}):[]}},{key:"_parseName",value:function(e){var t=void 0;this._fnType===C?t="{":this._fnType===m&&(t="(");var n=void 0,i=new RegExp("(?:class|function)\\s+(\\w+)\\s*(?:\\"+t+")").exec(e);return null!==i&&(n=i[1]),n}},{key:"_parseBody",value:function(e){var t=e.indexOf("{"),n=e.lastIndexOf("}"),i=e.substring(t+1,n).trim();return i?i.split("\n").map(function(e){return e.trim()}):[]}},{key:"_parseFunction",value:function(e){var t=void 0;return"string"!=typeof e&&(t=e.toString()),{name:e.name,params:this._parseParams(t),lines:this._parseBody(t)}}},{key:"createContent",value:function(e){var t=document.createDocumentFragment(),n=!0,i=!1,r=void 0;try{for(var a,s=["name","prototype","caller","arguments","length","__proto__"][Symbol.iterator]();!(n=(a=s.next()).done);n=!0){var c=a.value,u=void 0;try{u=e[c]}catch(e){continue}var _=w(u,l),d=o.createEntryEl(c,_.el);t.appendChild(d)}}catch(e){i=!0,r=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw r}}return t}},{key:"template",get:function(){var e='<div class="console__item function">';switch(this._mode){case c:e+="f";break;case u:e+='<div class="'+d+'">'+this._getHeadPropMarkup()+'</div><div class="'+y+'"></div>';break;case l:e+='<div class="'+d+'">'+this._getHeadDirMarkup()+'</div><div class="'+y+'"></div>';break;case s:e+=this._getLogMarkup()}return e+="</div>"}}],[{key:"checkFnType",value:function(e){var t=e.toString(),n=t.indexOf("("),i=t.indexOf("class"),r=t.indexOf("=>");return-1!==i&&i<n?C:-1!==r&&r>n?g:m}},{key:"createEntryEl",value:function(e,t){var n=O('<span class="object__entry object-entry">\n  <span class="object-entry__key">'+e+'</span><span class="object-entry__value-container"></span>\n</span>');return n.querySelector(".object-entry__value-container").appendChild(t),n}}]),o}(),k="string_collapsed",E=function(e){function o(e,n,i){t(this,o);var a=r(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,i,!0));return a._mode=n,a}return i(o,a),n(o,[{key:"bind",value:function(){var e=this;this._mode===u&&"string"===this.type&&this.el.addEventListener("click",function(t){t.preventDefault(),e.el.classList.toggle(k)})}},{key:"escapeHtml",value:function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}},{key:"template",get:function(){var e=this.type,t=this.value,n="";switch("string"!==e&&"symbol"!==e||("symbol"===e&&(t=t.toString()),t=this.escapeHtml(t)),e){case"undefined":case"null":case"boolean":n='<div class="console__item console__item_primitive '+e+'">'+t+"</div>";break;case"number":n=isNaN(t)?'<div class="console__item console__item_primitive NaN">NaN</div>':t===1/0||t===-1/0?'<div class="console__item console__item_primitive number">'+(t===-1/0?"-":"")+"Infinity</div>":'<div class="console__item console__item_primitive '+e+'">'+t+"</div>";break;case"string":n='<pre class="console__item console__item_primitive string '+(this._mode===u?k:"")+'">'+t+"</pre>";break;case"symbol":n='<div class="console__item console__item_primitive '+e+'">'+t+"</div>";break;case"object":if(null===t){n='<div class="console__item console__item_primitive null">'+t+"</div>";break}}return n}}]),o}(),O=function(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild},w=function(t,n){var i=void 0,r=void 0===t?"undefined":e(t);switch(r){case"function":i=new b(t,n);break;case"object":i=null!==t?Array.isArray(t)?new f(t,n):new v(t,n):new E(t,n,r);break;default:i=new E(t,n,r)}return i},j="log",x="dir",S="error",H=function(e,t){var n=O('<div class="console__row"></div>');return e.forEach(function(e){n.appendChild(w(e,t).el)}),n};window.jsConsole=function(e){if(!e)throw Error("Console is not inited!");var t={log:function(){for(var n=arguments.length,i=Array(n),r=0;r<n;r++)i[r]=arguments[r];e.appendChild(H(i,j)),"function"==typeof t.onlog&&t.onlog(i)},error:function(t){var n=O('<div class="console__row"></div>');t instanceof Error?n.appendChild(w(t,S).el):n.appendChild(w(new Error(t),S).el),e.appendChild(n)},clean:function(){e.innerHTML=""},getLogSource:function(){return e.innerHTML},dir:function(){for(var n=arguments.length,i=Array(n),r=0;r<n;r++)i[r]=arguments[r];e.appendChild(H(i,x)),"function"==typeof t.onlog&&t.onlog(i)},extend:function(e){return e.log=t.log,e.info=t.log,e.error=t.error,e.warn=t.error,e.dir=t.dir,e}};return t}(document.querySelector(".console"))}();
//# sourceMappingURL=index.js.map
