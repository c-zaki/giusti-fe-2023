import { on } from "delegated-events";
import { StoreManager } from "../../assets/js/helpers/store";

export class Header {
  cssClass = "c-header";
  cssClassNavMainActive = "zaux-navmain-active";
  cssClassSearchOpen = this.cssClass + "--search-open";
  scrollMode = false;
  scrollModeTheme = "alt1";
  scrollModeClass = this.cssClass + "--compact";
  forcedCompactClass = this.cssClass + "--forced-compact";
  forcedCompact = false;
  scrollModeManualTrigger = false;
  compactMode = false;
  variableSetDelay = 500;

  constructor(el = null) {
    this.el = el; 
    if(this.el.classList.contains(this.forcedCompactClass)){
      this.forcedCompact = true;
    }
    this.init();
  }

  get navMainActive() {
    return document.body.classList.contains(this.cssClassNavMainActive);
  }

  set navMainActive(value) {
    document.body.classList[value === true ? 'add' : 'remove'](this.cssClassNavMainActive);
  }

  setCssVariables(){
    var sheet = document.styleSheets[0];
    document.documentElement.style.setProperty("--header-height", `${this.el.clientHeight}px`);
  }

  setHeaderTheme(theme){
    this.removeHeaderThemes();
    this.el.classList.add(this.cssClass + "--" + "theme-" + theme);
  }

  removeHeaderTheme(theme){
    this.el.classList.remove(this.cssClass + "--" + "theme-" + theme);
  }

  removeHeaderThemes(){
    this.el.classList.forEach( (element, index) => {
      if( element.indexOf("theme") > 0 ){
        this.el.classList.remove(element);
      }
    });
  }

  activateCompactMode(){
    this.compactMode = true;
    this.setHeaderTheme(this.scrollModeTheme);
    this.el.classList.add(this.scrollModeClass);
    //this.setCssVariables();
  }

  disableCompactMode(){
    this.compactMode = false;
    this.removeHeaderTheme(this.scrollModeTheme);
    this.el.classList.remove(this.scrollModeClass);
    //this.setCssVariables();
  }

  scrollMarkerWatcher(){
    var scrollMarkerSelector = "[data-header-scroll-marker]";
    var headerHeight = this.el.offsetHeight;
    if( document.querySelectorAll(scrollMarkerSelector).length > 0 ){
      var scrollMarker = document.querySelectorAll(scrollMarkerSelector)[0];
      var scrollMarkerOffsetTop = scrollMarker.offsetTop;
      var scrollMarkerOffsetHeight = scrollMarker.offsetHeight;
      window.addEventListener( "scroll", event => {
        if( (window.scrollY + headerHeight) > ( scrollMarkerOffsetTop + scrollMarkerOffsetHeight - 50 ) ){
          this.scrollMode = true;
          if( this.compactMode == false ){
            this.activateCompactMode();
          }
        }else{
          this.scrollMode = false;
          if( this.compactMode == true ){
            this.disableCompactMode();
          }
        }
      });
    }
  }

  /**
   * Return the Header's height
   *
   * @readonly
   * @static
   * @memberof Header
   */
  static get height() {
    return this.el.clientHeight - 2;
  }
  

  init(){
    setTimeout(() => {
      this.setCssVariables();
    }, this.variableSetDelay);
    window.addEventListener("resize", () => { this.setCssVariables() } );
    StoreManager.setState("appHeader", this.el);
    this.scrollMarkerWatcher();
  }

}