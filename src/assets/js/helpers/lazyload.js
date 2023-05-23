import { Utils } from "./utils";
import { Device } from "./device";

export class Lazyload {
  static supportsLoadingAttr = "loading" in HTMLImageElement.prototype;

  /**
   * Contains a reference to the LazySizes's config JSON
   *
   * @static
   * @memberof Lazyload
   */
  static lsc = null;

  /**
   * @see https://github.com/aFarkas/lazysizes
   */
  static init() {
    this.lsc = window.lazySizesConfig = window.lazySizesConfig || {};
    this.lsc.loadedClass = "-is-loaded";
    this.lsc.lazyClass = "lazyload";

    this.check();

    if (!this.supportsLoadingAttr && window.lazySizes === undefined) {
      let s = document.createElement("script");
      s.src = Utils.getNS().config.helpers.lazyload.fallbackLibUrl;
      s.async = true;
      document.body.appendChild(s);
    }
  }

  static isImgLoaded(el) {
    return el.complete && el.naturalHeight !== 0;
  }

  static check(targetRoot, selector) {
    const initLazyClass = "-in-lazy";

    targetRoot = targetRoot || document;
    selector = selector || "[loading=lazy]:not(." + initLazyClass + ")";

    targetRoot.querySelectorAll(selector).forEach((el) => {
      el.classList.add(initLazyClass);
      if (!Lazyload.isImgLoaded(el)) {
        el.onload = function () {
          Lazyload.applyLoadCssClasses(this);
        };
      } else {
        Lazyload.applyLoadCssClasses(el);
      }

      if( Device.isSafari || Device.isFirefox ){
        Lazyload.applyLoadCssClasses(el);
      }

      if (this.supportsLoadingAttr) {
        Lazyload.setupSrcs(el);
      } else {
        el.classList.add(Lazyload.lsc.lazyClass);
      }
    });
  }

  static applyLoadCssClasses(el) {
    el.classList.add(Lazyload.lsc.loadedClass);
    el.parentNode.classList.add(Lazyload.lsc.loadedClass);
  }

  static setupSrcs(el) {
    if (el.dataset.src !== undefined) {
      el.setAttribute("src", el.dataset.src);
    }
    if (el.dataset.srcset !== undefined) {
      el.setAttribute("srcset", el.dataset.srcset);
    }
    if( el.parentNode.tagName.toLowerCase() == "picture"){
      if( el.parentNode.querySelectorAll("source[data-srcset]").length > 0){
        el.parentNode.querySelectorAll("source[data-srcset]").forEach( element => {
          element.setAttribute("srcset", element.dataset.srcset);
        });
      }
    }
  }

  static forceLoad(el) {
    if (
      el instanceof HTMLImageElement &&
      !el.classList.contains(this.lsc.loadedClass)
    ) {
      Lazyload.setupSrcs(el);
      el.classList.add(this.lsc.loadedClass);
      el.parentNode.classList.add(this.lsc.loadedClass);
      return true;
    }
    return false;
  }
}
