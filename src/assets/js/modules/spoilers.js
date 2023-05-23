import { Utils } from "../helpers/utils";

/*
    This module can be used to implement "spoilers" to "unveil" content
*/
export class Spoilers{

    static prefix = "zaux";
    static moduleName = "Spoilers";
    static selectorName = `data-${this.prefix}-spoiler`;
    static previewSelectorName = `data-preview`;
    static contentSelectorName = `data-full-content`;
    static selector = `[${this.selectorName}]`;
    static previewSelector = `[${this.previewSelectorName}]`
    static contentSelector = `[${this.contentSelectorName}]`
    static hideClass = "--hide";
    static showClass = "--show";
    

    static init(){
        if( Utils.isDebug ){
            console.log(`Module "${this.moduleName}" started...`);
        }
        if( document.querySelectorAll(this.selector).length > 0 ){
            document.querySelectorAll(this.selector).forEach( (element) => {
                var preview = element.querySelector(this.previewSelector);
                var content = element.querySelector(this.contentSelector);
                preview.addEventListener("click", () => {
                    preview.classList.add(this.hideClass);
                    content.classList.add(this.showClass);
                });
            })
        }
    }

}