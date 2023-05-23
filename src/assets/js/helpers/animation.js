import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AOS from "aos";
import { Utils } from "./utils";

export class Animation {

  static timerUpdateDebounce = null;

  /**
   * Setup animations stuff
   */
  static init() {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    if (Utils.isDebug) {
      console.log("Init animations stuff ...");
      if (!window.gsap) {
        console.log("Adding gsap to window ...");
        window.gsap = gsap;
        window.ScrollTrigger = ScrollTrigger;
        window.ScrollToPlugin = ScrollToPlugin;
      }
    }

  }

  static updateAll() {
    const debounceMs = 100;

    if (this.timerUpdateDebounce) {
      clearTimeout(this.timerUpdateDebounce);
      this.timerUpdateDebounce = null;
    }
    this.timerUpdateDebounce = setTimeout(function () {
      if (Utils.isDebug) {
        console.log("Updating animations ...");
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, debounceMs);
  }
}
