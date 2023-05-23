import { Utils } from "../helpers/utils";
import { StoreManager } from "../helpers/store";

/*
    If you ever need to make something "sticky"
    this class should do the trick.
*/

export class StickyElements{

    static prefix = "zaux";
    static moduleName = "stickyElements";
    static selectorName = `data-${this.prefix}-sticky-element`;
    static selector = `[${this.selectorName}]`;
    static contentSelectorName = `data-${this.prefix}-sticky-content`;
    static startSelectorName = `data-${this.prefix}-sticky-start`;
    static endSelectorName = `data-${this.prefix}-sticky-end`;
    static contentSelector = `[${this.contentSelectorName}]`;
    static startSelector = `[${this.startSelectorName}]`;
    static endSelector = `[${this.endSelectorName}]`;
    static adjustOffsetDelay = 2000;
    

    static init(){
        if( Utils.isDebug ){
            console.log(`Module "${this.moduleName}" started...`);
        }
        if (document.querySelectorAll(this.selector).length > 0) {
            document.querySelectorAll(this.selector).forEach(element => {
                var startMarker = element.querySelector(this.startSelector);
                var endMarker = element.querySelector(this.endSelector);
                var content = element.querySelector(this.contentSelector);
                content.style.position = "relative";

                var updateContentPosition = () => {
                    var contentTotalOffset = content.clientHeight + content.offsetTop;
                    if (window.scrollY + StoreManager.getState("appHeader").instance.height() > startMarker.offsetTop) {
                        if ((content.offsetTop >= startMarker.offsetTop) && (window.scrollY + window.innerHeight < endMarker.offsetTop)) {
                            content.style.top = window.scrollY + "px";
                        }else {
                            //content.style.top = (endMarker.offsetTop - content.clientHeight) + "px";
                            /*
                            setTimeout(() => {
                                content.style.transition = "all 0.1s ease-out";
                                content.style.top = (endMarker.offsetTop - content.clientHeight) + "px";
                                content.style.transition = "";
                            }, this.adjustOffsetDelay );
                            */
                        }
                    }else{
                        content.style.top = "0px";
                    }
                    requestAnimationFrame(updateContentPosition);
                };

                updateContentPosition();
            });
        }
    }

}