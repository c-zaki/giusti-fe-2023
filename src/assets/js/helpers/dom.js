import { Utils } from "./utils";

export class Dom {

  static set bodyScrollEnabled(value) {
    const hasClass = document.body.classList.contains('zaux-block-scroll');
    const state = !value && !hasClass;

    document.body.classList[state === true ? 'add' : 'remove']('zaux-block-scroll');

    if (Utils.isDebug) {
      console.log("bodyScrollEnabled: ", state);
    }

    return state;
  }

  static get bodyScrollEnabled() {
    return !document.body.classList.contains('zaux-block-scroll');
  }

  /*!
   * Get all direct descendant elements that match a selector
   * Dependency: the matches() polyfill: https://vanillajstoolkit.com/polyfills/matches/
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Node}   elem     The element to get direct descendants for
   * @param  {String} selector The selector to match against
   * @return {Array}           The matching direct descendants
   */
  static childrens(elem, selector) {
    return Array.prototype.filter.call(elem.children, function (child) {
      return child.matches(selector);
    });
  };

  /*!
   * Get next sibling of an element that matches a test condition
   * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Node}     elem     The element
   * @param  {Function} callback The test condition
   * @return {Node}              The sibling
  */
  static getNext(elem, callback) {

    // Get the next sibling element
    let sibling = elem.nextElementSibling;

    // If there's no callback, return the first sibling
    if (!callback || typeof callback !== 'function') return sibling;

    // If the sibling matches our test condition, use it
    // If not, jump to the next sibling and continue the loop
    let index = 0;
    while (sibling) {
      if (callback(sibling, index, elem)) return sibling;
      index++;
      sibling = sibling.nextElementSibling;
    }

  }

  /**
   * Get next siblings of an element that matches a test condition
   *
   * @static
   * @param {*} el
   * @param {*} callback
   * @returns
   * @memberof Dom
   */
  static getNextAll(el, callback) {
    let r = [];
    while (el = Dom.getNext(el, callback)) {
      r.push(el);
    }
    return r;
  }

  static getTarget(el, selector) {
    return el.matches(selector) ? el : el.closest(selector);
  }

  static insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
}
