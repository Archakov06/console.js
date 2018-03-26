!function(){"use strict";var r=function(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild},s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},t=function(){function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),n=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},l=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},o=function(){function e(){a(this,e)}return t(e,[{key:"render",value:function(){return r(this.template)}},{key:"bind",value:function(){}},{key:"template",get:function(){}},{key:"el",get:function(){return this._el||(this._el=this.render(),this.bind(this._el)),this._el}}]),e}(),i="log",c="dir",d="preview",v="prop",h="error",u={FUNCTION:"function",OBJECT:"object",ARRAY:"array",PRIMITIVE:"primitive"},_="item-head",p="item_pointer",y="item-head_show",f="entry-container_braced",m="entry-container_oversize",g="item-head-info",w="item-head-elements",E="item-head-elements_show",b="item-content-container",k="item-content-container_show",C="item-head-elements-length",O="item-head-elements-length_show",T=function(e){function i(e,t){a(this,i);var n=l(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return e.parentView&&(n._parentView=e.parentView,n._rootViewType=e.parentView._rootViewType),n._viewType=null,n._console=t,n._value=e.val,n._mode=e.mode,n._type=e.type,n._isOpened=!1,n._currentDepth="number"==typeof e.depth?e.depth:1,n}return n(i,o),t(i,[{key:"_getHeadErrorContent",value:function(){return{elOrStr:this._value.toString(),isShowConstructor:!1,isShowElements:!0}}},{key:"_toggleContent",value:function(){this._proxiedContentEl||(this._proxiedContentEl=r('<div class="item-content entry-container entry-container_type_'+this._viewType+'"></div>'),this._proxiedContentEl.appendChild(this.createContent(this.value,!1).fragment),this._contentContainerEl.appendChild(this._proxiedContentEl)),this._contentContainerEl.classList.toggle(k)}},{key:"_hideContent",value:function(){this._proxiedContentEl.style.display="none"}},{key:"_additionHeadClickHandler",value:function(){}},{key:"_setHeadClickHandler",value:function(e){var t=this;this._setCursorPointer(),e.addEventListener("click",function(e){e.preventDefault(),t._toggleContent(),t._additionHeadClickHandler()})}},{key:"_setCursorPointer",value:function(){this.el.classList.add(p)}},{key:"value",get:function(){return this._value}},{key:"mode",get:function(){return this._mode}},{key:"nextNestingLevel",get:function(){return this._currentDepth+1}},{key:"_isAutoExpandNeeded",get:function(){if(!this._isAutoExpandNeededProxied){var e=!1;this._parentView&&this._parentView._isAutoExpandNeeded?e=!0:Object.keys(this.value).length>=this._console.params[this._rootViewType].minFieldsToExpand&&(e=!0),null!==this._viewType&&this._currentDepth<=this._console.params[this._rootViewType].expandDepth&&e&&!this._console.params[this._rootViewType].exclude.includes(this._viewType)&&(this._isAutoExpandNeededProxied=!0)}return this._isAutoExpandNeededProxied}}],[{key:"createEntryEl",value:function(e,t,n){var i=r('<span class="entry-container__entry">  '+(n?"":'<span class="entry-container__key">'+e+"</span>")+'<span class="entry-container__value-container"></span></span>');return i.querySelector(".entry-container__value-container").appendChild(t),i}}]),i}(),x=function(e){function r(e,t){a(this,r);var n=l(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e,t));return e.parentView||(n._rootViewType=u.OBJECT),n._viewType=u.OBJECT,n._entries=new Map,n._isOpened=!1,n}return n(r,T),t(r,[{key:"bind",value:function(){var e=this.el.querySelector("."+_),t=e.querySelector("."+w),n=e.querySelector("."+g);this._contentContainerEl=this.el.querySelector("."+b);var i=this._getHeadContent(),r=i.elOrStr,o=i.isShowConstructor,s=i.isShowElements,a=i.isBraced,l=i.isOpeningDisabled,c=i.isOversize,u=i.isStringified;a&&t.classList.add(f),c&&t.classList.add(m),o&&n.classList.add(y),s&&(r instanceof HTMLElement||r instanceof DocumentFragment?t.appendChild(r):t.innerHTML=r,t.classList.add(E)),this._mode===h&&u&&this.el.classList.add(this._mode),this._mode!==d&&(l||(this._isAutoExpandNeeded&&this._toggleContent(),this._setHeadClickHandler(e)))}},{key:"_getHeadContent",value:function(){return this._mode===c?this._getHeadDirContent():this._mode===i||this._mode===v||this._mode===h?this._getHeadLogContent():this._mode===d?this._getHeadPreviewContent():""}},{key:"_getHeadPreviewContent",value:function(){return"[object Object]"===Object.prototype.toString.call(this.value)?{elOrStr:"...",isShowConstructor:!1,isShowElements:!0,isBraced:!0}:this._getHeadDirContent()}},{key:"_getHeadLogContent",value:function(){var e=void 0,t=!1,n=!0,i=!1,r=!1,o=!1;if(this.value instanceof HTMLElement)return this._getHeadDirContent();if(this.value instanceof Error)n=!1,e=this.value.toString(),o=!0;else if(this.value instanceof Number){e=this._console.createTypedView(Number.parseInt(this.value,10),d,this.nextNestingLevel,this).el,t=!0}else if(this.value instanceof String){e=this._console.createTypedView(this.value.toString(),d,this.nextNestingLevel,this).el,t=!0}else if(this.value instanceof Date)e=this.value.toString(),o=!0,n=!1;else if(this.value instanceof RegExp)e="/"+this.value.source+"/"+this.value.flags,i=!0,n=!1;else{var s=this.createContent(this.value,!0);e=s.fragment,r=s.isOversize,this.value.constructor!==Object&&(t=!0)}return{elOrStr:e,isShowConstructor:t,isShowElements:!0,isBraced:n,isOpeningDisabled:i,isOversize:r,isStringified:o}}},{key:"_getHeadDirContent",value:function(){var e=void 0,t=!1,n=!0;if(this.value instanceof HTMLElement){var i=this.value.tagName.toLowerCase();i+=this.value.id,this.value.classList.length&&(i+="."+Array.prototype.join.call(this.value.classList,".")),e=i}else this.value instanceof Date?e=this.value.toString():this.value instanceof RegExp?e="/"+this.value.source+"/"+this.value.flags:this.value instanceof Error?e=this.value.toString():(e=this.value,t=!0,n=!1);return{elOrStr:e,isShowConstructor:t,isShowElements:n,isBraced:!1}}},{key:"createContent",value:function(e,t){var n=document.createDocumentFragment(),i=new Set;for(var r in e){if(t&&i.size===this._console.params[this._viewType].maxFieldsInHead)return{fragment:n,isOversize:!0};i.add(r);var o=e[r];try{n.appendChild(this._createObjectEntryEl(r,o,t))}catch(e){}}var s=!0,a=!1,l=void 0;try{for(var c,u=Object.getOwnPropertyNames(e)[Symbol.iterator]();!(s=(c=u.next()).done);s=!0){var d=c.value;if(!i.has(d)){if(t&&i.size===this._console.params[this._viewType].maxFieldsInHead)return{fragment:n,isOversize:!0};i.add(d);var h=e[d];try{n.appendChild(this._createObjectEntryEl(d,h,t))}catch(e){}}}}catch(e){a=!0,l=e}finally{try{!s&&u.return&&u.return()}finally{if(a)throw l}}return{fragment:n,isOversize:!1}}},{key:"_createObjectEntryEl",value:function(e,t,n){var i=this._console.createTypedView(t,n?d:v,this.nextNestingLevel,this);return r.createEntryEl(e,i.el)}},{key:"template",get:function(){return'<div class="console__item item item_object">  <div class="'+_+'">\n    <span class="'+g+'">'+this.value.constructor.name+'</span>\n    <div class="'+w+' entry-container entry-container_head entry-container_type_object"></div>\n  </div>\n  <div class="'+b+'"></div>\n</div>'}}]),r}(),S=function(e){function o(e,t){a(this,o);var n=l(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,t));return e.parentView||(n._rootViewType=u.ARRAY),n._viewType=u.ARRAY,n._elements=new Map,n._isOpened=!1,n}return n(o,T),t(o,[{key:"bind",value:function(){this._contentContainerEl=this.el.querySelector("."+b),this.headEl=this.el.querySelector("."+_),this.headInfoEl=this.headEl.querySelector("."+g),this.headElementsEl=this.headEl.querySelector("."+w),this.headElementsLengthEl=this.headEl.querySelector("."+C);var e=this._getHeadContent(),t=e.isShowConstructor,n=e.isShowElements,i=e.isShowLength;t&&this._toggleConstructor(this.headInfoEl,!0),n&&(this.headElementsEl.appendChild(this.createContent(this.value,!0).fragment),this._toggleHeadElements(this.headElementsEl,!0)),i&&this._toggleLength(this.headElementsLengthEl,!0),this._mode!==d&&(this._isAutoExpandNeeded&&this._toggleContent(),this._setHeadClickHandler(this.headEl))}},{key:"_additionHeadClickHandler",value:function(){this._mode===v&&(this._toggleConstructor(),this._toggleHeadElements())}},{key:"_toggleConstructor",value:function(){this.headInfoEl.classList.toggle(y)}},{key:"_toggleLength",value:function(){this.headElementsLengthEl.classList.toggle(O)}},{key:"_toggleHeadElements",value:function(){this.headElementsEl.classList.toggle(E)}},{key:"_getHeadContent",value:function(){var e=!1,t=!0,n=1<this.value.length;if(this._mode===c)e=!0,t=!1;else if(this._mode===d)t=!1,n=e=!0;else if(this._mode===h)return this._getHeadErrorContent();return{isShowConstructor:e,isShowElements:t,isShowLength:n}}},{key:"createContent",value:function(e,t){var n=Object.keys(e),i=new Set,r=document.createDocumentFragment(),o=!0,s=!1,a=void 0;try{for(var l,c=n[Symbol.iterator]();!(o=(l=c.next()).done);o=!0){var u=l.value;i.add(u);var d=e[u];r.appendChild(this._createArrayEntryEl(u,d,t))}}catch(e){s=!0,a=e}finally{try{!o&&c.return&&c.return()}finally{if(s)throw a}}var h=!0,p=!1,v=void 0;try{for(var _,y=Object.getOwnPropertyNames(e)[Symbol.iterator]();!(h=(_=y.next()).done);h=!0){var f=_.value;if(!i.has(f)&&(!t||-1!==n.indexOf(f))){d=e[f];r.appendChild(this._createArrayEntryEl(f,d,t))}}}catch(e){p=!0,v=e}finally{try{!h&&y.return&&y.return()}finally{if(p)throw v}}return{fragment:r}}},{key:"_createArrayEntryEl",value:function(e,t,n){var i=Number.isNaN(Number.parseInt(e,10)),r=this._console.createTypedView(t,n?d:v,this.nextNestingLevel,this);return o.createEntryEl(e,r.el,n?!i:n)}},{key:"template",get:function(){return'<div class="console__item item item_array">\n  <div class="'+_+'">\n    <span class="'+g+'">'+this.value.constructor.name+'</span>\n    <span class="'+C+'">'+this.value.length+'</span>\n    <div class="'+w+' entry-container entry-container_head entry-container_braced entry-container_type_array"></div>\n  </div>\n  <div class="'+b+'"></div>\n</div>'}}]),o}(),H="plain",L="arrow",N="class",j=function(e){function p(e,t){a(this,p);var n=l(this,(p.__proto__||Object.getPrototypeOf(p)).call(this,e,t));return e.parentView||(n._rootViewType=u.FUNCTION),n._viewType=u.FUNCTION,n._isOpened=!1,n._fnType=p.checkFnType(n.value),n}return n(p,T),t(p,[{key:"bind",value:function(){if(this._mode===c||this._mode===v){this._contentContainerEl=this.el.querySelector("."+b);var e=this.el.querySelector("."+_);this._isAutoExpandNeeded&&this._toggleContent(),this._setHeadClickHandler(e)}}},{key:"_getHeadPropMarkup",value:function(){var e=this.parseFunction(this.value),t=e.name,n=e.params,i=e.lines.join("\n"),r="<span>"+(this._fnType===N?"class ":"")+(this._fnType===H?"f ":"")+(t||"")+(this._fnType!==N?"("+n.join(", ")+")":"")+(this._fnType===L?" => ":" ");return this._fnType!==N&&(r+="{"+(i.length<=43?i:"...")+"}"),r+="</span>"}},{key:"_getHeadDirMarkup",value:function(){var e=this.parseFunction(this.value),t=e.name,n=e.params;return"  <span>  "+(this._fnType===N?"class ":"")+"  "+(this._fnType===H?"f ":"")+"  "+(t||"")+"  "+(this._fnType!==N?"("+n.join(", ")+")":"")+"</span>"}},{key:"_getLogMarkup",value:function(){return"<pre>"+this.value.toString()+"</pre>"}},{key:"parseParams",value:function(e){var t=e.indexOf("("),n=e.indexOf(")"),i=e.substring(t+1,n).trim();return i?i.split(",").map(function(e){return e.trim()}):[]}},{key:"parseName",value:function(e){var t=void 0;this._fnType===N?t="{":this._fnType===H&&(t="(");var n=void 0,i=new RegExp("(?:class|function)\\s+(\\w+)\\s*(?:\\"+t+")").exec(e);return null!==i&&(n=i[1]),n}},{key:"parseBody",value:function(e){var t=e.indexOf("{"),n=e.lastIndexOf("}"),i=e.substring(t+1,n).trim();return i?i.split("\n").map(function(e){return e.trim()}):[]}},{key:"parseFunction",value:function(e){var t=void 0;return"string"!=typeof e&&(t=e.toString()),{name:e.name,params:this.parseParams(t),lines:this.parseBody(t)}}},{key:"createContent",value:function(e){var t=document.createDocumentFragment(),n=Object.keys(e).concat(["name","prototype","caller","arguments","length","__proto__"]),i=!0,r=!1,o=void 0;try{for(var s,a=n[Symbol.iterator]();!(i=(s=a.next()).done);i=!0){var l=s.value,c=void 0;try{var u=e[l];if(void 0===u)continue;c=u}catch(e){continue}var d=this._console.createTypedView(c,v,this.nextNestingLevel,this),h=p.createEntryEl(l,d.el);t.appendChild(h)}}catch(e){r=!0,o=e}finally{try{!i&&a.return&&a.return()}finally{if(r)throw o}}return{fragment:t}}},{key:"template",get:function(){var e='<div class="console__item item item_function '+(this._mode===h?""+this._mode:"")+'">';switch(this._mode){case d:e+="f";break;case v:e+='<div class="'+_+'">'+this._getHeadPropMarkup()+'</div><div class="'+b+' entry-container"></div>';break;case c:e+='<div class="'+_+'">'+this._getHeadDirMarkup()+'</div><div class="'+b+' entry-container"></div>';break;case i:case h:e+=this._getLogMarkup()}return e+="</div>"}}],[{key:"checkFnType",value:function(e){var t=e.toString(),n=t.indexOf("("),i=t.indexOf("class"),r=t.indexOf("=>");return-1!==i&&i<n?N:-1!==r&&n<r?L:H}}]),p}(),P="string_collapsed",V=function(e){function i(e,t){a(this,i);var n=l(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,e,t));return n._viewType=u.PRIMITIVE,n}return n(i,T),t(i,[{key:"bind",value:function(){var t=this;this.mode===v&&"string"===this.type&&(this._setCursorPointer(),this.el.addEventListener("click",function(e){e.preventDefault(),t.el.classList.toggle(P)}))}},{key:"escapeHtml",value:function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}},{key:"template",get:function(){var e=this._type,t=this.value,n="";switch("string"!==e&&"symbol"!==e||("symbol"===e&&(t=t.toString()),t=this.escapeHtml(t)),e){case"undefined":case"null":case"boolean":n='<div class="console__item item item_primitive '+e+'">'+t+"</div>";break;case"number":n=Number.isNaN(t)?'<div class="console__item item item_primitive NaN">NaN</div>':t===1/0||t===-1/0?'<div class="console__item item item_primitive number">'+(t===-1/0?"-":"")+"Infinity</div>":'<div class="console__item item item_primitive '+e+'">'+t+"</div>";break;case"string":n='<pre class="console__item item item_primitive string '+(this.mode===v?P:"")+" "+(this.mode===h?""+this.mode:"")+'">'+t+"</pre>";break;case"symbol":n='<div class="console__item item item_primitive symbol">'+t+"</div>";break;case"object":if(null===t){n='<div class="console__item item item_primitive null">'+t+"</div>";break}}return n}}]),i}(),F=function(){function n(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};if(a(this,n),!e)throw new Error("Console is not inited!");this._container=e,this.params={object:this._parseParams(t.object,"object"),array:this._parseParams(t.array,"array"),function:this._parseParams(t.function,"function")}}return t(n,[{key:"_parseParams",value:function(e,t){if(e?("number"==typeof e.expandDepth&&0<e.expandDepth&&(e.minFieldsToExpand="number"==typeof e.minFieldsToExpand&&0<e.minFieldsToExpand?e.minFieldsToExpand:0),e.maxFieldsInHead="number"==typeof e.maxFieldsInHead&&0<e.maxFieldsInHead?e.maxFieldsInHead:5):(e={},"object"===t&&(e.maxFieldsInHead=5)),Array.isArray(e.exclude)){var n=[];for(var i in u)if(u.hasOwnProperty(i)){var r=u[i];n.push(r)}if(!e.exclude.every(function(e){return n.includes(e)}))throw new Error("Provided type to exclude is not in available types")}else e.exclude=[];return e}},{key:"onlog",value:function(){}},{key:"ondir",value:function(){}},{key:"onerror",value:function(){}},{key:"log",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];this._container.appendChild(this._getRowEl(t,i)),this.onlog()}},{key:"error",value:function(e){var t=r('<div class="console__row console__row_error"></div>');t.appendChild(this.createTypedView(e,h).el),this._container.appendChild(t),this.onerror()}},{key:"dir",value:function(e){var t=r('<div class="console__row"></div>');t.appendChild(this.createTypedView(e,c).el),this._container.appendChild(t),this.ondir()}},{key:"clean",value:function(){this._container.innerHTML=""}},{key:"createTypedView",value:function(e,t,n,i){var r={val:e,mode:t,depth:n,parentView:i,type:void 0===e?"undefined":s(e)},o=void 0;switch(r.type){case"function":o=new j(r,this);break;case"object":o=null!==e?Array.isArray(e)?new S(r,this):new x(r,this):new V(r,this);break;default:o=new V(r,this)}return o}},{key:"_getRowEl",value:function(e,t){var n=this,i=r('<div class="console__row"></div>');return e.forEach(function(e){i.appendChild(n.createTypedView(e,t).el)}),i}},{key:"extend",value:function(e){return e.log=this.log,e.info=this.log,e.error=this.error,e.warn=this.error,e.dir=this.dir,e}},{key:"sourceLog",get:function(){return this._container.innerHTML}}]),n}(),A=[],e=function(e){A.push(e.error)};window.addEventListener("error",e),window.console.warn=e,window.console.error=e;var D=[],I=function(){D.push.apply(D,arguments)},M=[];window.console.info=I,window.console.log=I,window.console.dir=function(e){M.push(e)};window.addEventListener("DOMContentLoaded",function(){var e;!function(){var e=window.document.createElement("div");e.classList.add("console"),window.document.body.appendChild(e);var t=new F(e);t.extend(window.console),A.forEach(function(e){t.error(e)}),D.forEach(function(e){t.log(e)}),M.forEach(function(e){t.dir(e)}),window.addEventListener("error",function(e){e.error&&t.error(e.error)})}(),(e=window.document.createElement("link")).rel="stylesheet",e.href="//htmlacademy.github.io/console.js/css/style.css",window.document.head.appendChild(e)})}();
//# sourceMappingURL=index-silent.js.map
