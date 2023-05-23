import { Utils } from "./utils";

export class Component {

  static library = {};
  static classNameSkip = 'js-component--skip';
  static classNameLoaded = 'js-component--loaded';

  static get getLibrary(){
    return this.library;
  }

  static initAll(selectorTarget = `[data-js-component]:not(.${this.classNameSkip},.${this.classNameLoaded})`, root = document) {
    root.querySelectorAll(selectorTarget).forEach((el, i) => {
      this.init(el);
    });

    let defaultLoadedClassName = `${Utils.getVarNS()}-components-loaded`;
    let loadedClassName = Utils.getNS()?.config?.appLoadedClassName;

    if (!loadedClassName) {
      console.warn(`${Utils.getVarNS(true)}: 'appLoadedClassName' configuration not found, assuming '${defaultLoadedClassName}'.`);
    }

    document.body.classList.add(loadedClassName ?? defaultLoadedClassName);
  }

  static init(el) {
    const name = el.dataset.jsComponent;

    if (name in this.library) {
      try {
        el.classList.remove(this.classNameLoaded);
        el.instance = new this.library[name](el);
        if ('onBoot' in el.instance.constructor && typeof el.instance.constructor['onBoot'] === 'function' && !this.didBoot(this.library[name].cssClass)) {
          el.instance.constructor.onBoot();
        }
        el.classList.add(this.classNameLoaded);
      } catch (error) {
        console.error(error);
      }
    }
  }

  static register(name, component) {
    return this.library[name] = component;
  }

  static enable(el) {
    const hasSkipClassname = el.classList.contains(this.classNameSkip);
    if (hasSkipClassname) {
      return el.classList.remove(this.classNameSkip);
    }
    return hasSkipClassname;
  }

  static didBoot(componentCssClass, root = document) {
    return root.querySelectorAll(`.${componentCssClass}.${this.classNameLoaded}`).length > 0;
  }

}
