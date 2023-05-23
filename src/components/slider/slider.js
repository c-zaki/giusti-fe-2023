import Swiper, { EffectFade, Navigation, Pagination, Autoplay, FreeMode, Mousewheel } from "swiper";
import { Lazyload } from "../../assets/js/helpers/lazyload";

export class Slider {
  static cssClass = "c-slider";

  constructor(el = null) {

    this.el = el;

    // Configure Swiper to use modules
    Swiper.use([EffectFade, Navigation, Pagination, Autoplay, FreeMode, Mousewheel]);

    this.defaultConfig = {};
    this.lastEffect = "slide"; // Default Swiper effect

    this.$wrapper = el.querySelector(`.${Slider.cssClass}__wrapper`);
    this.$slider = el.querySelector(`.${Slider.cssClass}__instance`);

    this.init();
  }

  init() {
    
    // Creates the config JSON
    this.config = this.el.dataset.config
      ? { ...this.defaultConfig, ...JSON.parse(this.el.dataset.config) }
      : this.defaultConfig;

    this.setupEffect();

    // Initializes Swiper
    this.slider = new Swiper(this.$slider, this.config);

    this.setupEvents();

  }

  reinit() {
    // `destroy`doesn't works well without a delay
    setTimeout(() => {
      this.slider.destroy();
      this.slider = null;
      this.init();
    }, 16);
  }

  setupEffect() {

    // Setup the correct effect based on the JSON
    if (!this.config.breakpoints && this.config.effect) {
      this.lastEffect = this.config.effect;
    } else if (this.config.breakpoints) {
      for (let i = 0; i < this.breakpointsList.length; i++) {
        const breakpointPx = this.breakpointsList[i];
        if (window.innerWidth >= parseFloat(breakpointPx)) {
          if (typeof this.config.breakpoints[breakpointPx].effect !== 'undefined') {
            this.lastEffect = this.config.breakpoints[breakpointPx].effect;
            break;
          }
        }
      }
    }

    if (this.lastEffect) {
      this.config = { ...this.config, ...{ "effect": this.lastEffect } };
    }
  }

  setupEvents() {
    // Forces the load of the images inside the current slide
    this.slider.on("slideChange", (swiper) => {
      setTimeout(() => {
        const currentSlideEl = swiper.slides[swiper.activeIndex];
        if (currentSlideEl !== undefined) {
          currentSlideEl
            .querySelectorAll('img[loading="lazy"]')
            .forEach((el) => Lazyload.forceLoad(el));
        }
      }, 16);
    });

    // Handles the correct effect in different breakpoints
    this.slider.on('breakpoint', (swiper, breakpointParams) => {
      if (breakpointParams && this.config.reinitOnBreakpoint) {
        if (breakpointParams.effect && breakpointParams.effect !== this.lastEffect) {
          this.reinit();
        }
      }
    });
  }

  get breakpointsList() {
    if (this.config.breakpoints) {
      return Object.keys(this.config.breakpoints).sort().reverse();
    }
    return [];
  }

}
