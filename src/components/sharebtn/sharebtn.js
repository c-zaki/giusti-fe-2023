import "sharer.js";

export class ShareBtn {

    className = "c-sharebtn";
    toolTipSelector = `.${this.className}__tooltip`;
    shareTriggerSelector = `.${this.className}__share-trigger`;
    showClass = "--show";
    shareTrigger = null;
    toolTip = null;
    hideDelay = 2000;
    hideTimeout;
    offsetCssVarName = "--tooltip-offset";

    constructor(el = null) {
        this.el = el;
        this.toolTip = this.el.querySelector(this.toolTipSelector) || null;
        this.shareTrigger = this.el.querySelector(this.shareTriggerSelector) || null;

        this.toolTip.classList.forEach( className => {
            if( className.includes("--left") || className.includes("--right") ){
                this.el.style.setProperty(this.offsetCssVarName, this.toolTip.clientWidth + "px" );
            }
        });

        this.init();
    }

    #toggleToolTip(){
        if( this.toolTip.classList.contains(this.showClass) ){
            this.toolTip.classList.remove(this.showClass);
        }else{
            this.toolTip.classList.add(this.showClass);
        }
    }

    #showToolTip(){
        this.toolTip.classList.add(this.showClass);
    }

    #hideToolTip(){
        this.toolTip.classList.remove(this.showClass);
    }

    init() {
        window.Sharer.init();
        this.shareTrigger.addEventListener("click", element => {
            this.#toggleToolTip();
        });
        this.el.addEventListener("mouseleave", element => {
            this.hideTimeout = setTimeout(() => {
                this.#hideToolTip();
            }, this.hideDelay);
        });
        this.el.addEventListener("mouseover", element => {
            clearTimeout(this.hideTimeout);
        });
    }
}