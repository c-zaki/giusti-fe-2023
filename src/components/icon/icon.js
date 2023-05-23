export class Icon {
  cssClass = "c-icon";
  xlinkPrefix = "icon-";
  iconIdleClass = "--icon-idle";
  iconActiveClass = "--icon-active";
  iconSwitchingClass = "--icon-switching";
  iconClassSwitchDelay = 500;

  constructor(el = null) {
    this.el = el; 
  }

  iconSwitch(iconSwitchConfig){
      if( this.el.classList.contains(this.iconIdleClass ) ){
          this.el.classList.add(this.iconSwitchingClass);
          setTimeout(() => {
              this.el.classList.remove(this.iconIdleClass);  
              this.el.classList.remove(this.iconSwitchingClass);
              this.el.classList.add(this.iconActiveClass);
              this.changeIcon(iconSwitchConfig.active);
          }, this.iconClassSwitchDelay);
      }else if( this.el.classList.contains(this.iconActiveClass ) ){
          this.el.classList.remove(this.iconActiveClass);
          this.el.classList.add(this.iconSwitchingClass);
          setTimeout(() => {
              this.el.classList.remove(this.iconSwitchingClass);
              this.el.classList.add(this.iconIdleClass);
              this.changeIcon(iconSwitchConfig.idle);
          }, this.iconClassSwitchDelay);
      }else{
          this.el.classList.add(this.iconIdleClass);
          this.el.classList.add(this.iconSwitchingClass);
          setTimeout(() => {
              this.el.classList.remove(this.iconIdleClass);  
              this.el.classList.remove(this.iconSwitchingClass);
              this.el.classList.add(this.iconActiveClass);
              this.changeIcon(iconSwitchConfig.active);
          }, this.iconClassSwitchDelay);
      }
  }

  changeIcon(iconName) {
    var useElement = this.el.querySelector("use");
    var iconHref = useElement.getAttribute("xlink:href");
    iconHref = iconHref.split('#').shift();
    useElement.setAttribute("xlink:href", iconHref + "#" + this.xlinkPrefix + iconName );
  }

}