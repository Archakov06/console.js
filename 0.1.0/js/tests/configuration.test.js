(function () {
'use strict';

const getElement = (htmlMarkup) => {
  const div = document.createElement(`div`);
  div.innerHTML = htmlMarkup;
  return div.firstElementChild;
};

class AbstractView {
  constructor() {}

  /**
   * @abstract
   * @return {string}
   */
  get template() {}

  get el() {
    if (!this._el) {
      this._el = this.render();
      this.bind(this._el);
    }
    return this._el;
  }

  render() {
    return getElement(this.template);
  }

  bind() {}
}

/**
 * Console modes
 * @enum {string}
 */
const Mode = {
  LOG: `log`,
  DIR: `dir`,
  PREVIEW: `preview`,
  PROP: `prop`,
  ERROR: `error`
};

/**
 * Viewtypes
 * @enum {string}
 */
const ViewType = {
  FUNCTION: `function`,
  OBJECT: `object`,
  ARRAY: `array`,
  PRIMITIVE: `primitive`
};

/**
 * Console environment
 * @enum {string}
 */
const Env = {
  TEST: `test`
};

/* eslint guard-for-in: "off"*/

class TypeView extends AbstractView {
  constructor(params, cons) {
    super();
    if (params.parentView) {
      this._parentView = params.parentView;
      this._rootView = params.parentView._rootView;
    }
    this._console = cons;
    this._value = params.val;
    this._mode = params.mode;
    this._type = params.type;
    this._propKey = params.propKey;
    this._currentDepth = typeof params.depth === `number` ? params.depth : 1;
  }

  afterRender() {}

  bind() {
    if (!this.viewType) {
      throw new Error(`this.viewType must be specified`);
    }
    if (!this._rootView) {
      throw new Error(`this._rootView must be specified`);
    }
    this._headEl = this.el.querySelector(`.head`);
    this._headContentEl = this.el.querySelector(`.head__content`);
    this._infoEl = this.el.querySelector(`.info`);
    this._contentEl = this.el.querySelector(`.item__content`);

    this.afterRender();
  }

  /**
   * Current state
   * @type {{}}
   * @param {{}} params — object with values which will be assigned throught setters
   */
  set state(params) {
    if (!this._state) {
      this._state = {};
      Object.defineProperties(
          this._state,
          Object.getOwnPropertyDescriptors(this._getStateCommonProxyObject())
      );
      Object.defineProperties(
          this._state,
          Object.getOwnPropertyDescriptors(this._getStateProxyObject())
      );
      Object.seal(this._state);
    }
    for (let key in params) {
      this._state[key] = params[key];
    }
  }

  get state() {
    return this._state;
  }

  /**
   * @abstract
   * @return {{}} if not overriden return object without descriptors
   */
  _getStateProxyObject() {
    return {};
  }

  /**
   * @return {{}} — object that contains descriptors only
   */
  _getStateCommonProxyObject() {
    const self = this;
    return {
      set isShowInfo(bool) {
        self.toggleInfoShowed(bool);
      },
      set isHeadContentShowed(bool) {
        self.toggleHeadContentShowed(bool);
      },
      set isOpeningDisabled(bool) {
        if (self._mode === Mode.PREVIEW || self._isOpeningDisabled === bool) {
          return;
        }
        self.togglePointer(!bool);
        self._addOrRemoveHeadClickHandler(!bool);
        self.state.isContentShowed = !bool && self._isAutoExpandNeeded;
        self._isOpeningDisabled = bool;
      },
      get isOpeningDisabled() {
        return self._isOpeningDisabled;
      },
      set isContentShowed(bool) {
        self.toggleArrowBottom(bool);
        self._isContentShowed = self.toggleContentShowed(bool);
        if (self._isContentShowed && self._contentEl.childElementCount === 0) {
          self._contentEl.appendChild(self.createContent(self.value, false).fragment);
        }
      },
      get isContentShowed() {
        return self._isContentShowed;
      },
      set isOversized(bool) {
        self.toggleHeadContentOversized(bool);
      },
    };
  }

  toggleHeadContentBraced(isEnable) {
    return TypeView.toggleMiddleware(this._headContentEl, `entry-container--braced`, isEnable);
  }

  toggleHeadContentOversized(isEnable) {
    return TypeView.toggleMiddleware(this._headContentEl, `entry-container--oversize`, isEnable);
  }

  toggleInfoShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._infoEl, `hidden`, !isEnable);
  }

  toggleHeadContentShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._headContentEl, `hidden`, !isEnable);
  }

  toggleContentShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._contentEl, `hidden`, !isEnable);
  }

  toggleError(isEnable) {
    return TypeView.toggleMiddleware(this.el, Mode.ERROR, isEnable);
  }

  toggleItalic(isEnable) {
    return TypeView.toggleMiddleware(this._headEl, `italic`, isEnable);
  }

  togglePointer(isEnable) {
    return TypeView.toggleMiddleware(this._headEl, `item__head--pointer`, isEnable);
  }

  toggleArrowBottom(isEnable) {
    return TypeView.toggleMiddleware(this._headEl, `item__head--arrow-bottom`, isEnable);
  }

  /**
   * Value to log
   */
  get value() {
    return this._value;
  }

  /**
   * Log mode
   * @type {Mode}
   */
  get mode() {
    return this._mode;
  }

  get nextNestingLevel() {
    return this._currentDepth + 1;
  }

  /**
   * @param {boolean} inHead — is head entries
   * @return {Set}
   */
  _getEntriesKeys(inHead) {
    const obj = this.value;

    const ownPropertyNamesAndSymbols = Object.getOwnPropertyNames(obj)
        .concat(Object.getOwnPropertySymbols(obj)); // Неперечисляемые свои
    const keys = new Set(ownPropertyNamesAndSymbols);

    if (this.isShowNotOwn) {
      for (let key in obj) {
        if (inHead && !obj.hasOwnProperty(key)) {
          continue;
        }
        keys.add(key);
      }
    }

    if (inHead) {
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      for (let descriptor in descriptors) {
        if (typeof Object.getOwnPropertyDescriptors(descriptors[descriptor]).get !== `undefined`) {
          keys.delete(descriptor);
        }
      }
    }

    if (this._console.params.env === Env.TEST) {
      keys.delete(`should`);
    }

    return keys;
  }

  /**
   * Head content entries keys
   * @type {Set}
   */
  get headContentEntriesKeys() {
    if (!this._headEntriesKeys) {
      this._headEntriesKeys = this._getEntriesKeys(true);
    }
    return this._headEntriesKeys;
  }

  /**
   * Content entries keys
   * @type {Set}
   */
  get contentEntriesKeys() {
    if (!this._entriesKeys) {
      this._entriesKeys = this._getEntriesKeys(false);
    }
    return this._entriesKeys;
  }

  /**
   * Check if autoexpand needed
   * @type {boolean}
   */
  get _isAutoExpandNeeded() {
    if (!this._isAutoExpandNeededProxied) {
      this._isAutoExpandNeededProxied = false;

      const typeParams = this._console.params[this._rootView.viewType];

      if (this._currentDepth > typeParams.expandDepth) {
        return this._isAutoExpandNeededProxied;
      }

      if (this._parentView) {
        if (!typeParams.exclude.includes(this.viewType) &&
        !typeParams.excludeProperties.includes(this._propKey) &&
        this._parentView._isAutoExpandNeeded) {
          this._isAutoExpandNeededProxied = true;
        }
      } else {
        const entriesKeysLength = this._getEntriesKeys(false).size;
        if (typeParams.maxFieldsToExpand >= entriesKeysLength &&
          entriesKeysLength >= typeParams.minFieldsToExpand) {
          this._isAutoExpandNeededProxied = true;
        }
      }
    }
    return this._isAutoExpandNeededProxied;
  }

  _additionHeadClickHandler() {}

  _headClickHandler(evt) {
    evt.preventDefault();
    this.toggleArrowBottom();
    this.state.isContentShowed = !this.state.isContentShowed;
    this._additionHeadClickHandler();
  }

  _addOrRemoveHeadClickHandler(bool) {
    if (!this._bindedHeadClickHandler) {
      this._bindedHeadClickHandler = this._headClickHandler.bind(this);
    }
    if (bool) {
      this._headEl.addEventListener(`click`, this._bindedHeadClickHandler);
    } else {
      this._headEl.removeEventListener(`click`, this._bindedHeadClickHandler);
    }
  }

  /**
   * Create entry element
   * @protected
   * @param {{}} params
   * @param {string} params.key — key, index of array or field name
   * @param {HTMLSpanElement|undefined} params.el — HTML span element to append into container
   * @param {boolean} [params.withoutKey] — create entry without key element
   * @param {string} [params.keyElClass] — CSS class for key element
   * @param {function} [params.getViewEl] — function to get element if so wasn't present while calling this method
   * @return {HTMLSpanElement}
   */
  _createEntryEl({key, el, withoutKey, keyElClass, getViewEl}) {
    const entryEl = getElement(`\
<span class="entry-container__entry">\
${withoutKey ? `` : `<span class="entry-container__key ${keyElClass ? keyElClass : ``}">${key.toString()}</span>`}<span class="entry-container__value-container"></span>\
</span>`);
    const valueContEl = entryEl.querySelector(`.entry-container__value-container`);

    if (el) {
      valueContEl.appendChild(el);
    } else {
      valueContEl.textContent = `(...)`;
      valueContEl.classList.add(`entry-container__value-container--underscore`);
      const insertEl = () => {
        valueContEl.textContent = ``;
        valueContEl.classList.remove(`entry-container__value-container--underscore`);
        let viewEl;
        try {
          viewEl = getViewEl();
          valueContEl.appendChild(viewEl);
        } catch (err) {
          valueContEl.textContent = `[Exception: ${err.stack}]`;
        }
        valueContEl.removeEventListener(`click`, insertEl);
      };
      valueContEl.addEventListener(`click`, insertEl);
    }

    return entryEl;
  }

  /**
   * Create typed entry element
   * @protected
   * @param {{}} params
   * @param {{}} params.obj — object/array/fn
   * @param {string} params.key — key, index of array or field name
   * @param {Mode} params.mode — log mode
   * @param {boolean} [params.withoutKey] — create entry without key element
   * @param {string} [params.keyElClass] — CSS class for key element
   * @return {HTMLSpanElement}
   */
  _createTypedEntryEl({obj, key, mode, withoutKey, keyElClass, notCheckDescriptors}) {
    const getViewEl = () => {
      const val = obj[key];
      return this._console.createTypedView(val, mode, this.nextNestingLevel, this, key).el;
    };
    let el;
    try {
      if (notCheckDescriptors) {
        el = getViewEl();
      } else {
        const descriptors = Object.getOwnPropertyDescriptors(obj);
        if (!(key in descriptors) || !descriptors[key].get || key === `__proto__`) {
          el = getViewEl();
        }
      }
    } catch (err) {}
    return this._createEntryEl({key, el, withoutKey, keyElClass, getViewEl});
  }

  /**
   * Toggle CSS class on element
   * If isEnable not present just toggle, otherwise add or remove
   * @static
   * @param {HTMLElement} el — element to toggle CSS class
   * @param {string} className — CSS class
   * @param {boolean|undefined} isEnable — add/remove if present, otherwise toggle
   * @return {boolean} — added — true, removed — false
   */
  static toggleMiddleware(el, className, isEnable) {
    if (typeof isEnable === `undefined`) {
      return el.classList.toggle(className);
    }
    if (isEnable) {
      el.classList.add(className);
      return true;
    } else {
      el.classList.remove(className);
      return false;
    }
  }
}

/* eslint guard-for-in: "off"*/

class ObjectView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.OBJECT;
    if (!params.parentView) {
      this._rootView = this;
    }
    const stringTag = Object.prototype.toString.call(this.value);
    this._stringTagName = stringTag.substring(8, stringTag.length - 1);
    this._constructorName = this.value.constructor ? this.value.constructor.name : null;
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <span class="info head__info hidden"></span>\
    <div class="head__content entry-container entry-container--head entry-container--${this.viewType} hidden"></div>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  afterRender() {
    const {elOrStr, stateParams, isShowNotOwn, headContentClassName} = this._getHeadContent();
    this._headContent = elOrStr;

    if (headContentClassName) {
      this._headContentEl.classList.add(headContentClassName);
    }

    if (this._constructorName === `Object` && this._stringTagName !== `Object`) {
      this._infoEl.textContent = this._stringTagName;
    } else {
      this._infoEl.textContent = this._constructorName;
    }
    this.isShowNotOwn = isShowNotOwn;
    this.state = stateParams;
  }

  _getStateProxyObject() {
    const self = this;
    return {
      set isShowInfo(bool) {
        self.toggleInfoShowed(bool);
      },
      set isHeadContentShowed(bool) {
        if (!self._headContentEl.innerHTML) {
          if (self._headContent instanceof HTMLElement || self._headContent instanceof DocumentFragment) {
            self._headContentEl.appendChild(self._headContent);
          } else {
            self._headContentEl.innerHTML = self._headContent;
          }
        }
        self.toggleHeadContentShowed(bool);
      },
      set isBraced(bool) {
        self.toggleHeadContentBraced(bool);
      },
      set isStringified(bool) {
        if (!bool && (self._mode === Mode.LOG || self._mode === Mode.ERROR) && !self._parentView) {
          self.toggleItalic(bool);
        }
        if (bool && self._mode === Mode.ERROR) {
          self.toggleError(bool);
        }
      },
    };
  }

  _getHeadContent() {
    let obj;
    if (this._mode === Mode.DIR) {
      obj = this._getHeadDirContent();
    } else if (this._mode === Mode.LOG || this._mode === Mode.PROP || this._mode === Mode.ERROR) {
      obj = this._getHeadLogContent();
    } else if (this._mode === Mode.PREVIEW) {
      obj = this._getHeadPreviewContent();
    }
    return obj;
  }

  _getHeadPreviewContent() {
    if (this._stringTagName === `Object`) {
      return {
        elOrStr: `...`,
        stateParams: {
          isShowInfo: false,
          isHeadContentShowed: true,
          isBraced: true
        }
      };
    }
    return this._getHeadDirContent();
  }

  _getHeadLogContent() {
    let val;
    let isShowInfo = false;
    let isBraced = true;
    let isOpeningDisabled = false;
    let isOversized = false;
    let isStringified = false;
    let headContentClassName;

    if (this.value instanceof HTMLElement && Object.getPrototypeOf(this.value).constructor !== HTMLElement) {
      return this._getHeadDirContent();
    } else if (this.value instanceof Error) {
      isBraced = false;
      val = `<pre>${this.value.stack}</pre>`;
      // isOpeningDisabled = true;
      isStringified = true;
    } else if (this.value instanceof Number) {
      const view = this._console.createTypedView(Number.parseInt(this.value, 10), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowInfo = true;
    } else if (this.value instanceof String) {
      const view = this._console.createTypedView(this.value.toString(), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowInfo = true;
    } else if (this.value instanceof Date) {
      val = this.value.toString();
      isStringified = true;
      isBraced = false;
    } else if (this.value instanceof RegExp) {
      val = `/${this.value.source}/${this.value.flags}`;
      headContentClassName = `regexp`;
      isOpeningDisabled = true;
      isBraced = false;
    } else {
      const obj = this.createContent(this.value, true);
      val = obj.fragment;
      isOversized = obj.isOversized;
      // isOpeningDisabled = this.contentEntriesKeys.size === 0;
      if (this._stringTagName !== `Object` || (
        this._constructorName !== `Object`
      ) || this._propKey === `__proto__`) {
        isShowInfo = true;
      }
    }
    return {
      elOrStr: val,
      headContentClassName,
      stateParams: {
        isShowInfo,
        isHeadContentShowed: this._propKey !== `__proto__`,
        isBraced,
        isOpeningDisabled,
        isOversized,
        isStringified
      }
    };
  }

  _getHeadDirContent() {
    let val;
    let isShowInfo = false;
    let isHeadContentShowed = true;
    let isBraced = false;
    let isShowNotOwn = false;
    if (this.value instanceof HTMLElement) {
      let str = this.value.tagName.toLowerCase();
      str += this.value.id;
      if (this.value.classList.length) {
        str += `.` + Array.prototype.join.call(this.value.classList, `.`);
      }
      val = str;
      isShowNotOwn = true;
    } else if (this.value instanceof Date) {
      val = this.value.toString();
    } else if (this.value instanceof RegExp) {
      val = `/${this.value.source}/${this.value.flags}`;
    } else if (this.value instanceof Error) {
      val = this.value.toString();
    } else {
      val = this.value;
      isShowInfo = true;
      isHeadContentShowed = false;
    }
    return {
      elOrStr: val,
      stateParams: {
        isShowInfo,
        isHeadContentShowed,
        isBraced,
        isOpeningDisabled: false,
      },
      isShowNotOwn
    };
  }

  createContent(obj, inHead) {
    const fragment = document.createDocumentFragment();
    const entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
    let isOversized = false;
    let addedKeysCounter = 0;

    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;
    for (let key of entriesKeys) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      fragment.appendChild(this._createTypedEntryEl({obj, key, mode}));
      addedKeysCounter++;
    }
    if (!inHead && !entriesKeys.has(`__proto__`) && typeof this.value[`__proto__`] !== `undefined`) {
      fragment.appendChild(this._createTypedEntryEl({obj, key: `__proto__`, mode, keyElClass: `grey`, notCheckDescriptors: true}));
    }
    return {fragment, isOversized};
  }
}

const EMPTY = `empty`;

class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.ARRAY;
    if (!params.parentView) {
      this._rootView = this;
    }
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <span class="info head__info hidden"></span>\
    <span class="length head__length hidden">${this.value.length}</span>\
    <div class="head__content entry-container entry-container--head entry-container--${this.viewType} hidden"></div>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  afterRender() {
    this._lengthEl = this.el.querySelector(`.length`);
    this.toggleHeadContentBraced();
    this._infoEl.textContent = this.value.constructor.name;
    this.state = this._getStateParams();

    if ((this._mode === Mode.LOG || this._mode === Mode.ERROR) && !this._parentView) {
      this.toggleItalic(true);
    }
  }

  _getStateProxyObject() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && self._headContentEl.childElementCount === 0) {
          const {fragment, isOversized} = self.createContent(self.value, true);
          self.state.isOversized = isOversized;
          self._headContentEl.appendChild(fragment);
        }
        self.toggleHeadContentShowed(bool);
      },
      set isShowLength(bool) {
        self.toggleContentLengthShowed(bool);
      }
    };
  }

  toggleContentLengthShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._lengthEl, `hidden`, !isEnable);
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode.PROP && this._propKey !== `__proto__`) {
      this.state.isShowInfo = this._isContentShowed;
      this.state.isHeadContentShowed = !this._isContentShowed;
      this.state.isShowLength = this._isContentShowed || this.value.length > 1;
    }
  }

  _getStateParams() {
    let isShowInfo = false;
    let isHeadContentShowed = true;
    let isShowLength = this.value.length > 1;
    if (this._mode === Mode.DIR) {
      isShowInfo = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.PREVIEW) {
      isShowInfo = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.PROP) {
      isShowInfo = false;
      isHeadContentShowed = true;

      if (this._propKey === `__proto__`) {
        isShowInfo = true;
        isHeadContentShowed = false;
        isShowLength = true;
      }
    }
    return {
      isShowInfo,
      isHeadContentShowed,
      isShowLength,
      isOpeningDisabled: false
    };
  }

  createContent(arr, inHead) {
    const entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
    const fragment = document.createDocumentFragment();
    entriesKeys.delete(`length`);
    let isOversized = false;
    let addedKeysCounter = 0;

    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;

    for (let i = 0, l = arr.length; i < l; i++) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      const key = i.toString();
      if (entriesKeys.has(key)) {
        fragment.appendChild(this._createTypedEntryEl({obj: arr, key: i, mode, withoutKey: inHead, notCheckDescriptors: true}));
        entriesKeys.delete(key);
        addedKeysCounter++;
      } else if (inHead) {
        const entryEl = this._createEntryEl({key: i, el: getElement(`<span>${EMPTY}</span>`), withoutKey: true, keyElClass: `grey`});
        fragment.appendChild(entryEl);
        addedKeysCounter++;
      }
    }
    for (let key of entriesKeys) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      fragment.appendChild(this._createTypedEntryEl({obj: arr, key, mode, withoutKey: inHead}));
      addedKeysCounter++;
    }
    if (!inHead) {
      fragment.appendChild(this._createTypedEntryEl({obj: arr, key: `length`, mode, keyElClass: `grey`, notCheckDescriptors: true}));
      fragment.appendChild(this._createTypedEntryEl({obj: arr, key: `__proto__`, mode, keyElClass: `grey`, notCheckDescriptors: true}));
    }
    return {fragment, isOversized};
  }
}

/* eslint no-empty: "off"*/

const MAX_PREVIEW_FN_BODY_LENGTH = 43;

const FnType = {
  PLAIN: `plain`,
  ARROW: `arrow`,
  CLASS: `class`
};

const BUILTIN_FIELDS = [`arguments`, `caller`, `length`, `name`, `prototype`, `__proto__`];

// if .caller not accessed — не выводим
// if prototype undefined — не выводим
// name — если неименованная — получает имя переменной, в которую записана
// если именнованная — то имя ф-ии

class FunctionView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.FUNCTION;
    if (!params.parentView) {
      this._rootView = this;
    }
    this._fnType = FunctionView.checkFnType(this.value);
  }

  get template() {
    const isShowInfo = this._fnType !== FnType.ARROW || this._mode === Mode.PREVIEW;
    const body = this._getBody();
    const nowrapOnLog = this._console.params[this.viewType].nowrapOnLog;

    return `\
<div class="console__item item item--${this.viewType} ${this._mode === Mode.ERROR ? `error` : ``}">\
  <div class="head item__head italic">\
    <pre class="head__content ${nowrapOnLog ? `nowrap` : `` }"><span class="info info--function ${isShowInfo ? `` : `hidden`}">${this._getInfo()}</span>${isShowInfo && body ? ` ` : ``}${this._getBody()}</pre>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  afterRender() {
    const params = {
      isOpeningDisabled: this._mode !== Mode.DIR && this._mode !== Mode.PROP
    };

    this.state = params;

    if (this._mode === Mode.LOG) {
      this._headContentEl.addEventListener(`click`, () => {
        this._headContentEl.classList.toggle(`nowrap`);
      });
    }
  }

  _getInfo() {
    let str = ``;
    switch (this._fnType) {
      case FnType.CLASS:
        str = `class`;
        break;
      case FnType.PLAIN:
      case FnType.ARROW:
        str = `f`;
        break;
    }
    return str;
  }

  _getBody() {
    let str = ``;
    switch (this._mode) {
      case Mode.PROP:
        str = this._getHeadPropMarkup();
        break;
      case Mode.DIR:
        str = this._getHeadDirMarkup();
        break;
      case Mode.LOG:
      case Mode.ERROR:
        str = this._getHeadLogMarkup();
        break;
    }
    return str;
  }

  _getHeadPropMarkup() {
    const bodyLines = this._parseBody();
    const params = this._parseParams();
    const joinedLines = bodyLines.map((str) => str.trim()).join(` `);

    let markup = `\
${this.value.name ? this.value.name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType === FnType.ARROW) {
      markup += `${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `{...}`}`;
    }
    return markup;
  }

  _getHeadDirMarkup() {
    const params = this._parseParams();

    let markup = `\
${this.value.name ? this.value.name : ``}\
${this._fnType === FnType.PLAIN ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? `()` : ``}`;
    return markup;
  }

  _getHeadLogMarkup() {
    const bodyLines = this._parseBody();
    const params = this._parseParams();

    return `\
${this.value.name && this._fnType !== FnType.ARROW ? `${this.value.name} ` : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}${bodyLines.join(`\n`)}`;
  }

  _parseParams() {
    const str = this.value.toString();
    const paramsStart = str.indexOf(`(`);
    const paramsEnd = str.indexOf(`)`);

    const paramsContent = str.substring(paramsStart + 1, paramsEnd).trim();

    return paramsContent ? paramsContent.split(`,`).map((it) => it.trim()) : [];
  }

  _parseBody() {
    let str = this.value.toString().trim();

    let bodyContent = [];
    if (this._fnType === FnType.ARROW) {
      const arrowIndex = str.indexOf(`=>`);
      str = str.substring(arrowIndex + 2);
    }
    const firstBraceIndex = str.indexOf(`{`);
    str = str.substring(firstBraceIndex);
    const lines = str.split(`\n`);
    const firstLine = lines.shift();
    const firstWhitespaceIndexes = lines
        .filter((line) => line.length !== 0)
        .map((line) => {
          const ex = /^\s+/.exec(line);
          if (ex && ex[0].hasOwnProperty(`length`)) {
            return ex[0].length;
          }
          return 0;
        });

    const min = Math.min(...firstWhitespaceIndexes);
    bodyContent = lines.map((line) => line.slice(min));
    bodyContent.unshift(firstLine);
    return bodyContent;
  }


  createContent(fn) {
    const fragment = document.createDocumentFragment();
    const entriesKeys = this.contentEntriesKeys;
    for (let key of BUILTIN_FIELDS) {
      entriesKeys.add(key);
    }
    for (let key of entriesKeys) {
      fragment.appendChild(this._createTypedEntryEl({obj: fn, key, mode: Mode.PROP, keyElClass: BUILTIN_FIELDS.includes(key) ? `grey` : null}));
    }
    return {fragment};
  }

  static checkFnType(fn) {
    const str = fn.toString();
    const firstParenthesisIndex = str.indexOf(`(`);

    const classIndex = str.indexOf(`class`);
    const arrowIndex = str.indexOf(`=>`);
    if (classIndex !== -1 && (firstParenthesisIndex === -1 || classIndex < firstParenthesisIndex)) {
      return FnType.CLASS;
    } else if (arrowIndex !== -1 && arrowIndex > firstParenthesisIndex) {
      return FnType.ARROW;
    }
    return FnType.PLAIN;
  }
}

class PrimitiveView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.PRIMITIVE;
  }

  get template() {
    const type = this._type;
    let value = this.value;
    let html = ``;
    if (type === `string` || type === `symbol`) {
      if (type === `symbol`) {
        value = value.toString();
      }
      value = this.escapeHtml(value);
    }
    switch (type) {
      case `undefined`:
      case `null`:
      case `boolean`:
        html = `<div class="console__item item item--primitive ${type}">${value}</div>`;
        break;

      case `number`:
        if (Number.isNaN(value)) {
          html = `<div class="console__item item item--primitive NaN">NaN</div>`;
        } else if ((value === Infinity || value === -Infinity)) {
          html = `<div class="console__item item item--primitive number">${(value === -Infinity ? `-` : ``)}Infinity</div>`;
        } else {
          html = `<div class="console__item item item--primitive ${type}">${value}</div>`;
        }
        break;

      case `string`:
        let str;
        if (this._mode === Mode.PREVIEW && value.length > 100) {
          str = `${value.substr(0, 50)}...${value.substr(-50)}`;
        } else {
          str = value;
        }
        html = `<pre class="console__item item item--primitive string ${this._mode === Mode.PROP || this._mode === Mode.PREVIEW ? `nowrap` : ``} ${this._mode === Mode.PROP ? `pointer` : ``} ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">${str}</pre>`;
        break;
      case `symbol`:
        html = `<div class="console__item item item--primitive symbol">${value}</div>`;
        break;

      case `object`:
        if (value === null) {
          html = `<div class="console__item item item--primitive null">${value}</div>`;
          break;
        }
    }
    return html;
  }

  bind() {
    if (this._mode === Mode.PROP && this._type === `string`) {
      this.el.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.el.classList.toggle(`nowrap`);
      });
    }
  }

  escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, `&amp;`)
        .replace(/</g, `&lt;`)
        .replace(/>/g, `&gt;`)
        .replace(/"/g, `&quot;`)
        .replace(/'/g, `&#039;`);
  }
}

/**
 * Console
 * @class
 */
class Console {
  /**
   * Initialize console into container
   * @param {HTMLElement} container — console container
   * @param {{}} params — parameters
   * @param {number} params.minFieldsToExpand — min number of fields in obj to expand
   * @param {number} params.maxFieldsInHead — max number of preview fields inside head
   * @param {number} params.expandDepth — level of depth to expand
   * @param {Env} params.env — environment
   **/
  constructor(container, params = {}) {
    if (!container) {
      throw new Error(`Console is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }
    this._views = new Map();
    this._container = container;
    const commonParams = this._parseParams(params.common);
    this.params = {
      object: this._parseParams(Object.assign({}, commonParams, params.object)),
      array: this._parseParams(Object.assign({}, commonParams, params.array)),
      function: this._parseParams(Object.assign({}, commonParams, params.function)),
      env: params.env
    };
  }

  _parseParams(paramsObject = {}) {
    // Set this._expandDepth and this._minFieldsToExpand only if expandDepth provided and > 0
    if (typeof paramsObject.expandDepth === `number` &&
    paramsObject.expandDepth > 0) {

      paramsObject.minFieldsToExpand = (
        typeof paramsObject.minFieldsToExpand === `number` &&
        paramsObject.minFieldsToExpand > 0
      ) ? paramsObject.minFieldsToExpand : 0;

      paramsObject.maxFieldsToExpand = (
        typeof paramsObject.maxFieldsToExpand === `number` &&
        paramsObject.maxFieldsToExpand > 0
      ) ? paramsObject.maxFieldsToExpand : Number.POSITIVE_INFINITY;
    }

    paramsObject.maxFieldsInHead = (
      typeof paramsObject.maxFieldsInHead === `number` &&
      paramsObject.maxFieldsInHead > 0
    ) ? paramsObject.maxFieldsInHead : Number.POSITIVE_INFINITY;

    if (!Array.isArray(paramsObject.excludeProperties)) {
      paramsObject.excludeProperties = [];
    }
    if (!Array.isArray(paramsObject.exclude)) {
      paramsObject.exclude = [];
    } else {
      const availableTypes = [];
      for (let key in ViewType) {
        if (ViewType.hasOwnProperty(key)) {
          const type = ViewType[key];
          availableTypes.push(type);
        }
      }
      if (!paramsObject.exclude.every((type) => availableTypes.includes(type))) {
        throw new Error(`Provided type to exclude is not in available types`);
      }
    }
    return paramsObject;
  }

  /**
   * Subscribe on log event fired
   * @abstract
   **/
  onlog() {}

  /**
   * Subscribe on dir event fired
   * @abstract
   **/
  ondir() {}

  /**
   * Subscribe on error event fired
   * @abstract
   **/
  onerror() {}

  /**
   * Equivalent to console.log
   * Push rest of arguments into container
   */
  log(...rest) {
    this._container.appendChild(this._getRowEl(rest, Mode.LOG));
    this.onlog();
  }

  /**
   * Equivalent to console.error
   * Push single value into conainer
   * @param {*} val — value
   */
  error(val) {
    const el = getElement(`<div class="console__row console__row--error"></div>`);
    el.appendChild(this.createTypedView(val, Mode.ERROR).el);
    this._container.appendChild(el);
    this.onerror();
  }

  /**
   * Equivalent to console.dir
   * Push single value into conainer
   * @param {*} val — value
   */
  dir(val) {
    const el = getElement(`<div class="console__row"></div>`);
    el.appendChild(this.createTypedView(val, Mode.DIR).el);
    this._container.appendChild(el);
    this.ondir();
  }

  /**
   * Clean container
   */
  clean() {
    this._container.innerHTML = ``;
  }

  createTypedView(val, mode, depth, parentView, propKey) {
    const params = {val, mode, depth, parentView, type: typeof val, propKey};
    let view;
    switch (params.type) {
      case `function`:
        view = new FunctionView(params, this);
        break;
      case `object`:
        if (val !== null) {
          if (Array.isArray(val)) {
            view = new ArrayView(params, this);
          } else {
            view = new ObjectView(params, this);
          }
        } else {
          view = new PrimitiveView(params, this);
        }
        break;
      default:
        view = new PrimitiveView(params, this);
        break;
    }
    // this._views.set(view.el, view);
    return view;
  }

  _getRowEl(entries, mode) {
    const el = getElement(`<div class="console__row"></div>`);
    entries.forEach((val) => {
      el.appendChild(this.createTypedView(val, mode).el);
    });
    return el;
  }

  /**
   * get innerHTML of container
   */
  get sourceLog() {
    return this._container.innerHTML;
  }

  /**
   * Extend console
   * @param {{}} consoleObject
   * @return {{}} extended console
   */
  extend(consoleObject) {
    consoleObject.log = this.log.bind(this);
    consoleObject.info = this.log.bind(this);

    consoleObject.error = this.error.bind(this);
    consoleObject.warn = this.error.bind(this);

    consoleObject.dir = this.dir.bind(this);
    return consoleObject;
  }
}

const obj = {};
const arr = [obj];
arr.push(arr);
// arr.fn = fn;
const fn = (bar = 123) => {
  return bar;
};
fn.arr = arr;
fn.obj = obj;
obj.obj = obj;
obj.arr = arr;
obj.fn = fn;

const getLengths = () => {
  const objects = Array.from(
      document.querySelectorAll(`.item--object:not(.hidden) > .item__content.entry-container--object:not(.hidden)`)
  );
  const arrays = Array.from(
      document.querySelectorAll(`.item--array:not(.hidden) > .item__content.entry-container--array:not(.hidden)`)
  );
  const functions = Array.from(
      document.querySelectorAll(`.item--function:not(.hidden) > .item__content.entry-container--function:not(.hidden)`)
  );
  return {
    objLength: objects.length,
    arrLength: arrays.length,
    fnLength: functions.length
  };
};

const getConsole = (container, params) => {
  return new Console(container, Object.assign(params, {env: Env.TEST}));
};

const div = document.createElement(`div`);
div.classList.add(`console`);
document.body.appendChild(div);

let cons = null;

describe(`Check depth object`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root object should be opened on 2 levels`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 3 && arrLength === 1 && fnLength === 1);
  });
  it(`root object should not be opened because of minFieldsToExpand === 4 and obj has 3 fields`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 2,
        minFieldsToExpand: 4
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 4,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.log(obj);
    // console.log(document.querySelector(`.console`).innerHTML);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 13 && arrLength === 0 && fnLength === 65);
  });
  it(`root object should be opened with excluding nested functions`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 5,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 30 && arrLength === 22 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays and functions`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 3,
        exclude: [ViewType.ARRAY, ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths(cons);
    assert(objLength === 5 && arrLength === 0 && fnLength === 0);
  });
});

describe(`Check depth array`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root array should be opened on 2 levels`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    const bool = objLength === 1 && arrLength === 3 && fnLength === 0;
    assert(bool);
  });
  it(`root array should not be opened because of minFieldsToExpand === 4 and array has 2 fields`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 4
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    // console.log(`objLength: ${objLength}, arrLength: ${arrLength}, fnLength: ${fnLength}`);
    assert(objLength === 0 && arrLength === 8 && fnLength === 96);
  });
  it(`root array should be opened with excluding nested functions`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 3,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 6 && arrLength === 6 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects and functions`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 2,
        exclude: [ViewType.OBJECT, ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 3 && fnLength === 0);
  });
});

describe(`Check depth function DIR`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root function should be opened on 4 levels`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 4,
        minFieldsToExpand: 1
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    // console.log(`objLength: ${objLength}, arrLength: ${arrLength}, fnLength: ${fnLength}`);
    assert(objLength === 14 && arrLength === 11 && fnLength === 72);
  });
  it(`root function should not be opened because of minFieldsToExpand === 5 and function has 3 fields`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 2,
        minFieldsToExpand: 5
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root function should be opened with excluding nested objects`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    // console.log(`objLength: ${objLength}, arrLength: ${arrLength}, fnLength: ${fnLength}`);
    assert(objLength === 0 && arrLength === 5 && fnLength === 46);
  });
  it(`root function should be opened with excluding nested arrays`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 3,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 4 && arrLength === 0 && fnLength === 9);
  });
  it(`root function should be opened with excluding nested objects and arrays`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 2,
        exclude: [ViewType.OBJECT, ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 2);
  });
});

describe(`in head of object must be limited number of fields`, () => {
  const localObj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7
  };
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`maxFieldsInHead === 2`, () => {
    cons = getConsole(div, {
      object: {
        maxFieldsInHead: 2
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
    );
    assert(headElementsEl.length === 2);
  });
  it(`maxFieldsInHead === 5`, () => {
    cons = getConsole(div, {
      object: {
        maxFieldsInHead: 5
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
    );
    assert(headElementsEl.length === 5);
  });
  it(`maxFieldsInHead === 8, but object contains 7 fields`, () => {
    cons = getConsole(div, {
      object: {
        maxFieldsInHead: 8
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
    );
    assert(headElementsEl.length === 7);
  });
});

}());

//# sourceMappingURL=configuration.test.js.map
