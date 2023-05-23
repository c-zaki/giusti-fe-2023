import { StoreManager } from "../../assets/js/helpers/store";
import { Utils } from "../../assets/js/helpers/utils";

export class Toast {
    cssClass = "c-toast";
    cssClassActive = "--active";
    cssClassHidden = "--hidden";
    cssClassShow = "--show";
    cssClassShowing = "--showing";
    cssClassHiding = "--hiding";
    contentSelector = "[data-text-content]";
    hideDelay = 500;
    closeTimeOut = 5000;
    lock = false;

    constructor(el = null) {
        this.el = el;
        this.init();
    }

    clean(){
        this.el.querySelector(this.contentSelector).textContent = "";
        this.el.classList.forEach( className => {
            if( className.includes("theme") ){
                this.el.classList.remove(className);
            }
        });
    }

    show(message, type = "standard"){
        if( this.lock == false ){
            this.clean();
            this.lock = true;
            this.el.querySelector(this.contentSelector).textContent = message;
            this.el.classList.remove(this.cssClassHidden);
            this.el.classList.add(this.cssClassActive);
            this.el.classList.add(this.cssClass + "--theme-" + type);
            setTimeout(() => {
                this.el.classList.add(this.cssClassShow);
            }, this.hideDelay);
            setTimeout(() => {
                this.hide();
            }, this.closeTimeOut);
        }
    }

    hide(){
        this.el.classList.add(this.cssClassHiding);
        setTimeout(() => {
            this.el.classList.remove(this.cssClassShow);
            this.el.classList.remove(this.cssClassHiding);
            this.lock = false;
        }, this.hideDelay);
        setTimeout(() => {
            this.el.classList.remove(this.cssClassActive);
            this.el.classList.add(this.cssClassHidden);
        }, this.hideDelay + 500);
    }

    init(){
        //Register the component as the app toast
        StoreManager.setState("appToast", this.el);
    }

}