export class Utils {

  static credits() {
    console.log(`%c     ______     ______     __  __     __
    /\\___  \\   /\\  __ \\   /\\ \\/ /    /\\ \\
    \\/_/  /__  \\ \\  __ \\  \\ \\  _"-.  \\ \\ \\
      /\\_____\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\_\\
      \\/_____/   \\/_/\\/_/   \\/_/\\/_/   \\/_/

        Creative Digital Agency —— zaki.it

              Communicate. Better.\n`, "font-family:monospace;color:#cd2d45;");
  }

  static getVarNS(capitalized = false, namespaceName = 'zaux') {
    return capitalized ? this.capitalize(namespaceName) : namespaceName;
  }

  static getNS() {
    return window[this.getVarNS()] = window[this.getVarNS()] || {};
  }

  static get isDebug() {
    return Utils.getNS().config.debug === true;
  }

  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static arrayReplaceRecursive(arr, replaceArr) {
    for (var key in replaceArr) {
      if (replaceArr.hasOwnProperty(key)) {
        if (typeof replaceArr[key] === "object" && replaceArr[key] !== null) {
          if (typeof arr[key] === "undefined") {
            arr[key] = replaceArr[key];
          } else {
            arr[key] = this.arrayReplaceRecursive(arr[key], replaceArr[key]);
          }
        } else {
          arr[key] = replaceArr[key];
        }
      }
    }
    return arr;
  }

  /*!
   * Sanitize and encode all HTML in a user-submitted string
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {String} str  The user-submitted string
   * @return {String} str  The sanitized string
   */
  static sanitize(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };


  static prependChildrens() {
    [...document.querySelectorAll('[data-prepend-childs-to]')].forEach((parentEl) => {
      [...parentEl.children].reverse().forEach((srcEl) => {
        [...document.querySelectorAll(parentEl.dataset.prependChildsTo)].forEach((destEl) => {
          destEl.prepend(
            parentEl.matches('[data-prepend-clone="true"]') ? srcEl.cloneNode(true) : srcEl
          );
        });
      });
    });
  }

  static isElementCovered(element){
    const rect = element.getBoundingClientRect();
    const point = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const elementAtPoint = document.elementFromPoint(point.x, point.y);
    if( elementAtPoint !== element ){
      return elementAtPoint;
    }else{
      return false;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} mqo
   * @param {*} fn
   * @returns
   * @memberof Events
   */
   static onMqChange(mqo, fn) {
    try {
      // Chrome & Firefox
      return mqo.addEventListener('change', fn) || true;
    } catch (e) {
      try {
        // Safari
        return mqo.addListener(fn) || true;
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  }

}
