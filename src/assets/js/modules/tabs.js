import { Utils } from "../helpers/utils";

/*
    Implements tabs and tab groups.
*/
export class Tabs{

    static prefix = "zaux";
    static moduleName = "Tabs";
    static tabSelectorName = `data-${this.prefix}-toggle=tab`;
    static tabSelector = `[${this.tabSelectorName}]`;
    static tabContentSelectorName = `data-${this.prefix}-tab-content`;
    static tabContentSelector = `[${this.tabContentSelectorName}]`;
    static targetSelectorName = `data-${this.prefix}-target`
    static targetSelector = `[${this.targetSelectorName}]`;
    static groupSelectorName = `data-${this.prefix}-group`;
    static activeClass = "--active";
    static showClass = "--show";
    static classSwitchTreshold = 150;

    static init(){
        if( Utils.isDebug ){
            console.log(`Module "${this.moduleName}" started...`);
        }
        if( document.querySelectorAll(this.tabSelector).length > 0 ){
            document.querySelectorAll(this.tabSelector).forEach( element => { 
                element.addEventListener("click", (e) =>{
                    let target = e.currentTarget.getAttribute(this.targetSelectorName);
                    let group = e.currentTarget.getAttribute(this.groupSelectorName);

                    //Clear other tabs style
                    document.querySelectorAll(`${this.tabSelector}[${this.groupSelectorName}=${group}]`).forEach( element => {
                        element.classList.remove(this.activeClass);
                        element.classList.remove(this.showClass);
                        element.setAttribute("aria-selected",false);
                    });

                    //Clear tabs content style
                    document.querySelectorAll(`${this.tabContentSelector}[${this.groupSelectorName}=${group}]`).forEach( element => {
                        element.classList.remove(this.showClass);
                        element.classList.remove(this.activeClass);
                    });

                    e.currentTarget.classList.add(this.activeClass);
                    e.currentTarget.setAttribute("aria-selected",true);
                    if( document.querySelector(target) !== null ){
                        document.querySelector(target).classList.add(this.activeClass);
                        setTimeout(() => {
                            document.querySelector(target).classList.add(this.showClass);
                        }, this.classSwitchTreshold);
                    }
                });
            });
        }
    }
}