/* eslint guard-for-in: "off"*/
/* eslint no-empty: "off"*/
import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

export default class ObjectView extends TypeView {
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
