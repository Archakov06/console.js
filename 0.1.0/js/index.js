!function(){"use strict";var g=function(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild},s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},t=function(){function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),n=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},r=function(){function e(){o(this,e)}return t(e,[{key:"render",value:function(){return g(this.template)}},{key:"bind",value:function(){}},{key:"template",get:function(){}},{key:"el",get:function(){return this._el||(this._el=this.render(),this.bind(this._el)),this._el}}]),e}(),l="log",d="dir",m="preview",w="prop",h="error",c={FUNCTION:"function",OBJECT:"object",ARRAY:"array",PRIMITIVE:"primitive"},u="test",_=function(e){function i(e,t){o(this,i);var n=a(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return e.parentView&&(n._parentView=e.parentView,n._rootView=e.parentView._rootView),n._console=t,n._value=e.val,n._mode=e.mode,n._type=e.type,n._propKey=e.propKey,n._currentDepth="number"==typeof e.depth?e.depth:1,n}return n(i,r),t(i,[{key:"afterRender",value:function(){}},{key:"bind",value:function(){if(!this.viewType)throw new Error("this.viewType must be specified");if(!this._rootView)throw new Error("this._rootView must be specified");this._headEl=this.el.querySelector(".head"),this._headContentEl=this.el.querySelector(".head__content"),this._infoEl=this.el.querySelector(".info"),this._contentEl=this.el.querySelector(".item__content"),this.afterRender()}},{key:"_getStateProxyObject",value:function(){return{}}},{key:"_getStateCommonProxyObject",value:function(){var t=this;return{set isShowInfo(e){t.toggleInfoShowed(e)},set isHeadContentShowed(e){t.toggleHeadContentShowed(e)},set isOpeningDisabled(e){t._mode!==m&&t._isOpeningDisabled!==e&&(t.togglePointer(!e),t._addOrRemoveHeadClickHandler(!e),t.state.isContentShowed=!e&&t._isAutoExpandNeeded,t._isOpeningDisabled=e)},get isOpeningDisabled(){return t._isOpeningDisabled},set isContentShowed(e){t.toggleArrowBottom(e),t._isContentShowed=t.toggleContentShowed(e),t._isContentShowed&&0===t._contentEl.childElementCount&&t._contentEl.appendChild(t.createContent(t.value,!1).fragment)},get isContentShowed(){return t._isContentShowed},set isOversized(e){t.toggleHeadContentOversized(e)}}}},{key:"toggleHeadContentBraced",value:function(e){return i.toggleMiddleware(this._headContentEl,"entry-container--braced",e)}},{key:"toggleHeadContentOversized",value:function(e){return i.toggleMiddleware(this._headContentEl,"entry-container--oversize",e)}},{key:"toggleInfoShowed",value:function(e){return!i.toggleMiddleware(this._infoEl,"hidden",!e)}},{key:"toggleHeadContentShowed",value:function(e){return!i.toggleMiddleware(this._headContentEl,"hidden",!e)}},{key:"toggleContentShowed",value:function(e){return!i.toggleMiddleware(this._contentEl,"hidden",!e)}},{key:"toggleError",value:function(e){return i.toggleMiddleware(this.el,h,e)}},{key:"toggleItalic",value:function(e){return i.toggleMiddleware(this._headEl,"italic",e)}},{key:"togglePointer",value:function(e){return i.toggleMiddleware(this._headEl,"item__head--pointer",e)}},{key:"toggleArrowBottom",value:function(e){return i.toggleMiddleware(this._headEl,"item__head--arrow-bottom",e)}},{key:"_getEntriesKeys",value:function(e){var t=this.value,n=Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t)),i=new Set(n);if(this.isShowNotOwn)for(var r in t)e&&!t.hasOwnProperty(r)||i.add(r);if(e){var o=Object.getOwnPropertyDescriptors(t);for(var a in o)void 0!==Object.getOwnPropertyDescriptors(o[a]).get&&i.delete(a)}return this._console.params.env===u&&i.delete("should"),i}},{key:"_additionHeadClickHandler",value:function(){}},{key:"_headClickHandler",value:function(e){e.preventDefault(),this.toggleArrowBottom(),this.state.isContentShowed=!this.state.isContentShowed,this._additionHeadClickHandler()}},{key:"_addOrRemoveHeadClickHandler",value:function(e){this._bindedHeadClickHandler||(this._bindedHeadClickHandler=this._headClickHandler.bind(this)),e?this._headEl.addEventListener("click",this._bindedHeadClickHandler):this._headEl.removeEventListener("click",this._bindedHeadClickHandler)}},{key:"_createEntryEl",value:function(e){var t=e.key,n=e.el,i=e.withoutKey,r=e.keyElClass,o=e.getViewEl,a=g('<span class="entry-container__entry">'+(i?"":'<span class="entry-container__key '+(r||"")+'">'+t.toString()+"</span>")+'<span class="entry-container__value-container"></span></span>'),s=a.querySelector(".entry-container__value-container");if(n)s.appendChild(n);else{s.textContent="(...)",s.classList.add("entry-container__value-container--underscore");s.addEventListener("click",function e(){s.textContent="",s.classList.remove("entry-container__value-container--underscore");var t=void 0;try{t=o(),s.appendChild(t)}catch(e){s.textContent="[Exception: "+e.stack+"]"}s.removeEventListener("click",e)})}return a}},{key:"_createTypedEntryEl",value:function(e){var t=this,n=e.obj,i=e.key,r=e.mode,o=e.withoutKey,a=e.keyElClass,s=e.notCheckDescriptors,l=function(){var e=n[i];return t._console.createTypedView(e,r,t.nextNestingLevel,t,i).el},d=void 0;try{if(s)d=l();else{var h=Object.getOwnPropertyDescriptors(n);i in h&&h[i].get&&"__proto__"!==i||(d=l())}}catch(e){}return this._createEntryEl({key:i,el:d,withoutKey:o,keyElClass:a,getViewEl:l})}},{key:"state",set:function(e){for(var t in this._state||(this._state={},Object.defineProperties(this._state,Object.getOwnPropertyDescriptors(this._getStateCommonProxyObject())),Object.defineProperties(this._state,Object.getOwnPropertyDescriptors(this._getStateProxyObject())),Object.seal(this._state)),e)this._state[t]=e[t]},get:function(){return this._state}},{key:"value",get:function(){return this._value}},{key:"mode",get:function(){return this._mode}},{key:"nextNestingLevel",get:function(){return this._currentDepth+1}},{key:"headContentEntriesKeys",get:function(){return this._headEntriesKeys||(this._headEntriesKeys=this._getEntriesKeys(!0)),this._headEntriesKeys}},{key:"contentEntriesKeys",get:function(){return this._entriesKeys||(this._entriesKeys=this._getEntriesKeys(!1)),this._entriesKeys}},{key:"_isAutoExpandNeeded",get:function(){if(!this._isAutoExpandNeededProxied){this._isAutoExpandNeededProxied=!1;var e=this._console.params[this._rootView.viewType];if(this._currentDepth>e.expandDepth)return this._isAutoExpandNeededProxied;if(this._parentView)e.exclude.includes(this.viewType)||e.excludeProperties.includes(this._propKey)||!this._parentView._isAutoExpandNeeded||(this._isAutoExpandNeededProxied=!0);else{var t=this._getEntriesKeys(!1).size;e.maxFieldsToExpand>=t&&t>=e.minFieldsToExpand&&(this._isAutoExpandNeededProxied=!0)}}return this._isAutoExpandNeededProxied}}],[{key:"toggleMiddleware",value:function(e,t,n){return void 0===n?e.classList.toggle(t):n?(e.classList.add(t),!0):(e.classList.remove(t),!1)}}]),i}(),p=function(e){function r(e,t){o(this,r);var n=a(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e,t));n.viewType=c.OBJECT,e.parentView||(n._rootView=n);var i=Object.prototype.toString.call(n.value);return n._stringTagName=i.substring(8,i.length-1),n._constructorName=n.value.constructor?n.value.constructor.name:null,n}return n(r,_),t(r,[{key:"afterRender",value:function(){var e=this._getHeadContent(),t=e.elOrStr,n=e.stateParams,i=e.isShowNotOwn,r=e.headContentClassName;this._headContent=t,r&&this._headContentEl.classList.add(r),"Object"===this._constructorName&&"Object"!==this._stringTagName?this._infoEl.textContent=this._stringTagName:this._infoEl.textContent=this._constructorName,this.isShowNotOwn=i,this.state=n}},{key:"_getStateProxyObject",value:function(){var t=this;return{set isShowInfo(e){t.toggleInfoShowed(e)},set isHeadContentShowed(e){t._headContentEl.innerHTML||(t._headContent instanceof HTMLElement||t._headContent instanceof DocumentFragment?t._headContentEl.appendChild(t._headContent):t._headContentEl.innerHTML=t._headContent),t.toggleHeadContentShowed(e)},set isBraced(e){t.toggleHeadContentBraced(e)},set isStringified(e){e||t._mode!==l&&t._mode!==h||t._parentView||t.toggleItalic(e),e&&t._mode===h&&t.toggleError(e)}}}},{key:"_getHeadContent",value:function(){var e=void 0;return this._mode===d?e=this._getHeadDirContent():this._mode===l||this._mode===w||this._mode===h?e=this._getHeadLogContent():this._mode===m&&(e=this._getHeadPreviewContent()),e}},{key:"_getHeadPreviewContent",value:function(){return"Object"===this._stringTagName?{elOrStr:"...",stateParams:{isShowInfo:!1,isHeadContentShowed:!0,isBraced:!0}}:this._getHeadDirContent()}},{key:"_getHeadLogContent",value:function(){var e=void 0,t=!1,n=!0,i=!1,r=!1,o=!1,a=void 0;if(this.value instanceof HTMLElement&&Object.getPrototypeOf(this.value).constructor!==HTMLElement)return this._getHeadDirContent();if(this.value instanceof Error)n=!1,e="<pre>"+this.value.stack+"</pre>",o=!0;else if(this.value instanceof Number){e=this._console.createTypedView(Number.parseInt(this.value,10),m,this.nextNestingLevel,this).el,t=!0}else if(this.value instanceof String){e=this._console.createTypedView(this.value.toString(),m,this.nextNestingLevel,this).el,t=!0}else if(this.value instanceof Date)e=this.value.toString(),n=!(o=!0);else if(this.value instanceof RegExp)e="/"+this.value.source+"/"+this.value.flags,a="regexp",n=!(i=!0);else{var s=this.createContent(this.value,!0);e=s.fragment,r=s.isOversized,"Object"===this._stringTagName&&"Object"===this._constructorName&&"__proto__"!==this._propKey||(t=!0)}return{elOrStr:e,headContentClassName:a,stateParams:{isShowInfo:t,isHeadContentShowed:"__proto__"!==this._propKey,isBraced:n,isOpeningDisabled:i,isOversized:r,isStringified:o}}}},{key:"_getHeadDirContent",value:function(){var e=void 0,t=!1,n=!0,i=!1;if(this.value instanceof HTMLElement){var r=this.value.tagName.toLowerCase();r+=this.value.id,this.value.classList.length&&(r+="."+Array.prototype.join.call(this.value.classList,".")),e=r,i=!0}else this.value instanceof Date?e=this.value.toString():this.value instanceof RegExp?e="/"+this.value.source+"/"+this.value.flags:this.value instanceof Error?e=this.value.toString():(e=this.value,n=!(t=!0));return{elOrStr:e,stateParams:{isShowInfo:t,isHeadContentShowed:n,isBraced:!1,isOpeningDisabled:!1},isShowNotOwn:i}}},{key:"createContent",value:function(e,t){var n=document.createDocumentFragment(),i=t?this.headContentEntriesKeys:this.contentEntriesKeys,r=!1,o=0,a=this._console.params[this.viewType].maxFieldsInHead,s=t?m:w,l=!0,d=!1,h=void 0;try{for(var c,u=i[Symbol.iterator]();!(l=(c=u.next()).done);l=!0){var _=c.value;if(t&&o===a){r=!0;break}n.appendChild(this._createTypedEntryEl({obj:e,key:_,mode:s})),o++}}catch(e){d=!0,h=e}finally{try{!l&&u.return&&u.return()}finally{if(d)throw h}}return t||i.has("__proto__")||void 0===this.value.__proto__||n.appendChild(this._createTypedEntryEl({obj:e,key:"__proto__",mode:s,keyElClass:"grey",notCheckDescriptors:!0})),{fragment:n,isOversized:r}}},{key:"template",get:function(){return'<div class="console__item item item--'+this.viewType+'">  <div class="head item__head">    <span class="info head__info hidden"></span>    <div class="head__content entry-container entry-container--head entry-container--'+this.viewType+' hidden"></div>  </div>  <div class="item__content entry-container entry-container--'+this.viewType+' hidden"></div></div>'}}]),r}(),y=function(e){function i(e,t){o(this,i);var n=a(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,e,t));return n.viewType=c.ARRAY,e.parentView||(n._rootView=n),n}return n(i,_),t(i,[{key:"afterRender",value:function(){this._lengthEl=this.el.querySelector(".length"),this.toggleHeadContentBraced(),this._infoEl.textContent=this.value.constructor.name,this.state=this._getStateParams(),this._mode!==l&&this._mode!==h||this._parentView||this.toggleItalic(!0)}},{key:"_getStateProxyObject",value:function(){var r=this;return{set isHeadContentShowed(e){if(e&&0===r._headContentEl.childElementCount){var t=r.createContent(r.value,!0),n=t.fragment,i=t.isOversized;r.state.isOversized=i,r._headContentEl.appendChild(n)}r.toggleHeadContentShowed(e)},set isShowLength(e){r.toggleContentLengthShowed(e)}}}},{key:"toggleContentLengthShowed",value:function(e){return!_.toggleMiddleware(this._lengthEl,"hidden",!e)}},{key:"_additionHeadClickHandler",value:function(){this._mode===w&&"__proto__"!==this._propKey&&(this.state.isShowInfo=this._isContentShowed,this.state.isHeadContentShowed=!this._isContentShowed,this.state.isShowLength=this._isContentShowed||1<this.value.length)}},{key:"_getStateParams",value:function(){var e=!1,t=!0,n=1<this.value.length;return this._mode===d?n=!(t=!(e=!0)):this._mode===m?n=!(t=!(e=!0)):this._mode===w&&(t=!(e=!1),"__proto__"===this._propKey&&(n=!(t=!(e=!0)))),{isShowInfo:e,isHeadContentShowed:t,isShowLength:n,isOpeningDisabled:!1}}},{key:"createContent",value:function(e,t){var n=t?this.headContentEntriesKeys:this.contentEntriesKeys,i=document.createDocumentFragment();n.delete("length");for(var r=!1,o=0,a=this._console.params[this.viewType].maxFieldsInHead,s=t?m:w,l=0,d=e.length;l<d;l++){if(t&&o===a){r=!0;break}var h=l.toString();if(n.has(h))i.appendChild(this._createTypedEntryEl({obj:e,key:l,mode:s,withoutKey:t,notCheckDescriptors:!0})),n.delete(h),o++;else if(t){var c=this._createEntryEl({key:l,el:g("<span>empty</span>"),withoutKey:!0,keyElClass:"grey"});i.appendChild(c),o++}}var u=!0,_=!1,p=void 0;try{for(var y,v=n[Symbol.iterator]();!(u=(y=v.next()).done);u=!0){var f=y.value;if(t&&o===a){r=!0;break}i.appendChild(this._createTypedEntryEl({obj:e,key:f,mode:s,withoutKey:t})),o++}}catch(e){_=!0,p=e}finally{try{!u&&v.return&&v.return()}finally{if(_)throw p}}return t||(i.appendChild(this._createTypedEntryEl({obj:e,key:"length",mode:s,keyElClass:"grey",notCheckDescriptors:!0})),i.appendChild(this._createTypedEntryEl({obj:e,key:"__proto__",mode:s,keyElClass:"grey",notCheckDescriptors:!0}))),{fragment:i,isOversized:r}}},{key:"template",get:function(){return'<div class="console__item item item--'+this.viewType+'">  <div class="head item__head">    <span class="info head__info hidden"></span>    <span class="length head__length hidden">'+this.value.length+'</span>    <div class="head__content entry-container entry-container--head entry-container--'+this.viewType+' hidden"></div>  </div>  <div class="item__content entry-container entry-container--'+this.viewType+' hidden"></div></div>'}}]),i}(),v="plain",f="arrow",k="class",b=["arguments","caller","length","name","prototype","__proto__"],C=function(e){function i(e,t){o(this,i);var n=a(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,e,t));return n.viewType=c.FUNCTION,e.parentView||(n._rootView=n),n._fnType=i.checkFnType(n.value),n}return n(i,_),t(i,[{key:"afterRender",value:function(){var e=this,t={isOpeningDisabled:this._mode!==d&&this._mode!==w};this.state=t,this._mode===l&&this._headContentEl.addEventListener("click",function(){e._headContentEl.classList.toggle("nowrap")})}},{key:"_getInfo",value:function(){var e="";switch(this._fnType){case k:e="class";break;case v:case f:e="f"}return e}},{key:"_getBody",value:function(){var e="";switch(this._mode){case w:e=this._getHeadPropMarkup();break;case d:e=this._getHeadDirMarkup();break;case l:case h:e=this._getHeadLogMarkup()}return e}},{key:"_getHeadPropMarkup",value:function(){var e=this._parseBody(),t=this._parseParams(),n=e.map(function(e){return e.trim()}).join(" "),i=(this.value.name?this.value.name:"")+(this._fnType!==k?"("+t.join(", ")+")":"")+(this._fnType===f?" => ":" ");return this._fnType===f&&(i+=""+(n.length<=43?n:"{...}")),i}},{key:"_getHeadDirMarkup",value:function(){var e=this._parseParams();return(this.value.name?this.value.name:"")+(this._fnType===v?"("+e.join(", ")+")":"")+(this._fnType===f?"()":"")}},{key:"_getHeadLogMarkup",value:function(){var e=this._parseBody(),t=this._parseParams();return(this.value.name&&this._fnType!==f?this.value.name+" ":"")+(this._fnType!==k?"("+t.join(", ")+")":"")+(this._fnType===f?" => ":" ")+e.join("\n")}},{key:"_parseParams",value:function(){var e=this.value.toString(),t=e.indexOf("("),n=e.indexOf(")"),i=e.substring(t+1,n).trim();return i?i.split(",").map(function(e){return e.trim()}):[]}},{key:"_parseBody",value:function(){var e=this.value.toString().trim(),t=[];if(this._fnType===f){var n=e.indexOf("=>");e=e.substring(n+2)}var i=e.indexOf("{"),r=(e=e.substring(i)).split("\n"),o=r.shift(),a=r.filter(function(e){return 0!==e.length}).map(function(e){var t=/^\s+/.exec(e);return t&&t[0].hasOwnProperty("length")?t[0].length:0}),s=Math.min.apply(Math,function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(a));return(t=r.map(function(e){return e.slice(s)})).unshift(o),t}},{key:"createContent",value:function(e){var t=document.createDocumentFragment(),n=this.contentEntriesKeys,i=!0,r=!1,o=void 0;try{for(var a,s=b[Symbol.iterator]();!(i=(a=s.next()).done);i=!0){var l=a.value;n.add(l)}}catch(e){r=!0,o=e}finally{try{!i&&s.return&&s.return()}finally{if(r)throw o}}var d=!0,h=!1,c=void 0;try{for(var u,_=n[Symbol.iterator]();!(d=(u=_.next()).done);d=!0){var p=u.value;t.appendChild(this._createTypedEntryEl({obj:e,key:p,mode:w,keyElClass:b.includes(p)?"grey":null}))}}catch(e){h=!0,c=e}finally{try{!d&&_.return&&_.return()}finally{if(h)throw c}}return{fragment:t}}},{key:"template",get:function(){var e=this._fnType!==f||this._mode===m,t=this._getBody(),n=this._console.params[this.viewType].nowrapOnLog;return'<div class="console__item item item--'+this.viewType+" "+(this._mode===h?"error":"")+'">  <div class="head item__head italic">    <pre class="head__content '+(n?"nowrap":"")+'"><span class="info info--function '+(e?"":"hidden")+'">'+this._getInfo()+"</span>"+(e&&t?" ":"")+this._getBody()+'</pre>  </div>  <div class="item__content entry-container entry-container--'+this.viewType+' hidden"></div></div>'}}],[{key:"checkFnType",value:function(e){var t=e.toString(),n=t.indexOf("("),i=t.indexOf("class"),r=t.indexOf("=>");return-1!==i&&(-1===n||i<n)?k:-1!==r&&n<r?f:v}}]),i}(),E=function(e){function i(e,t){o(this,i);var n=a(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,e,t));return n.viewType=c.PRIMITIVE,n}return n(i,_),t(i,[{key:"bind",value:function(){var t=this;this._mode===w&&"string"===this._type&&this.el.addEventListener("click",function(e){e.preventDefault(),t.el.classList.toggle("nowrap")})}},{key:"escapeHtml",value:function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}},{key:"template",get:function(){var e=this._type,t=this.value,n="";switch("string"!==e&&"symbol"!==e||("symbol"===e&&(t=t.toString()),t=this.escapeHtml(t)),e){case"undefined":case"null":case"boolean":n='<div class="console__item item item--primitive '+e+'">'+t+"</div>";break;case"number":n=Number.isNaN(t)?'<div class="console__item item item--primitive NaN">NaN</div>':t===1/0||t===-1/0?'<div class="console__item item item--primitive number">'+(t===-1/0?"-":"")+"Infinity</div>":'<div class="console__item item item--primitive '+e+'">'+t+"</div>";break;case"string":var i=void 0;i=this._mode===m&&100<t.length?t.substr(0,50)+"..."+t.substr(-50):t,n='<pre class="console__item item item--primitive string '+(this._mode===w||this._mode===m?"nowrap":"")+" "+(this._mode===w?"pointer":"")+" "+(this._mode===h?""+this._mode:"")+'">'+i+"</pre>";break;case"symbol":n='<div class="console__item item item--primitive symbol">'+t+"</div>";break;case"object":if(null===t){n='<div class="console__item item item--primitive null">'+t+"</div>";break}}return n}}]),i}(),e=function(){function i(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};if(o(this,i),!e)throw new Error("Console is not inited!");if(!(e instanceof HTMLElement))throw new TypeError("HTML element must be passed as container");this._views=new Map,this._container=e;var n=this._parseParams(t.common);this.params={object:this._parseParams(Object.assign({},n,t.object)),array:this._parseParams(Object.assign({},n,t.array)),function:this._parseParams(Object.assign({},n,t.function)),env:t.env}}return t(i,[{key:"_parseParams",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};if("number"==typeof e.expandDepth&&0<e.expandDepth&&(e.minFieldsToExpand="number"==typeof e.minFieldsToExpand&&0<e.minFieldsToExpand?e.minFieldsToExpand:0,e.maxFieldsToExpand="number"==typeof e.maxFieldsToExpand&&0<e.maxFieldsToExpand?e.maxFieldsToExpand:Number.POSITIVE_INFINITY),e.maxFieldsInHead="number"==typeof e.maxFieldsInHead&&0<e.maxFieldsInHead?e.maxFieldsInHead:Number.POSITIVE_INFINITY,Array.isArray(e.excludeProperties)||(e.excludeProperties=[]),Array.isArray(e.exclude)){var t=[];for(var n in c)if(c.hasOwnProperty(n)){var i=c[n];t.push(i)}if(!e.exclude.every(function(e){return t.includes(e)}))throw new Error("Provided type to exclude is not in available types")}else e.exclude=[];return e}},{key:"onlog",value:function(){}},{key:"ondir",value:function(){}},{key:"onerror",value:function(){}},{key:"log",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];this._container.appendChild(this._getRowEl(t,l)),this.onlog()}},{key:"error",value:function(e){var t=g('<div class="console__row console__row--error"></div>');t.appendChild(this.createTypedView(e,h).el),this._container.appendChild(t),this.onerror()}},{key:"dir",value:function(e){var t=g('<div class="console__row"></div>');t.appendChild(this.createTypedView(e,d).el),this._container.appendChild(t),this.ondir()}},{key:"clean",value:function(){this._container.innerHTML=""}},{key:"createTypedView",value:function(e,t,n,i,r){var o={val:e,mode:t,depth:n,parentView:i,type:void 0===e?"undefined":s(e),propKey:r},a=void 0;switch(o.type){case"function":a=new C(o,this);break;case"object":a=null!==e?Array.isArray(e)?new y(o,this):new p(o,this):new E(o,this);break;default:a=new E(o,this)}return a}},{key:"_getRowEl",value:function(e,t){var n=this,i=g('<div class="console__row"></div>');return e.forEach(function(e){i.appendChild(n.createTypedView(e,t).el)}),i}},{key:"extend",value:function(e){return e.log=this.log.bind(this),e.info=this.log.bind(this),e.error=this.error.bind(this),e.warn=this.error.bind(this),e.dir=this.dir.bind(this),e}},{key:"sourceLog",get:function(){return this._container.innerHTML}}]),i}();window.Console=e}();
//# sourceMappingURL=index.js.map
