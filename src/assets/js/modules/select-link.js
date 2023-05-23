import { Utils } from "../helpers/utils";

/*
    Implements linkable select inputs,
    attach a url to an option value and get riderected to it when you click on it. Smart stuff.
*/
export class SelectLink{

    static prefix = "zaux";
    static moduleName = "selectLink";
    static selectorName = `data-${this.prefix}-select-link`;
    static selector = `[${this.selectorName}]`;
    

    static init(){
        if( Utils.isDebug ){
            console.log(`Module "${this.moduleName}" started...`);
        }
        if( document.querySelectorAll(this.selector).length > 0 ){
            document.querySelectorAll(this.selector).forEach( (element) => {
                element.onchange = (e) => {
                    var index = e.currentTarget.selectedIndex;
                    var url = e.currentTarget.children[index].value;
                    window.location = url;
                }
            })
        }
    }

}