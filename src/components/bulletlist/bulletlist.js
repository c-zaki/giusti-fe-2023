export class BulletList {

    #entryTPL = null;
    #entryTPLSelectorName = "data-tpl-entry";
    #entryTPLSelector = `[${this.#entryTPLSelectorName}]`;
    #entrySelectors = {
        "titleSelectorName" : "data-title",
        "subtitleSelectorName" : "data-subtitle",
        "btnSelectorName" : "data-btn",
        "linkSelectorName" : "data-link"
    };
    
    constructor(el = null) {
        this.el = el;
        this.#loadEntryTPL();
    } 

    #loadEntryTPL(){
        if( this.el.querySelector(this.#entryTPLSelector) ){
            let tplSourceElement = this.el.querySelector(this.#entryTPLSelector);
            this.#entryTPL = tplSourceElement.cloneNode(true);
            this.#entryTPL.removeAttribute(this.#entryTPLSelectorName);
            tplSourceElement.parentNode.removeChild(tplSourceElement);
        }else{
            return false;
        }
    }
    
    #createListEntryNode(data){
        let listEntryNode = this.#entryTPL.cloneNode(true);
        let titleNode = listEntryNode.querySelector(`[${this.#entrySelectors.titleSelectorName}]`);
        let subtitleNode = listEntryNode.querySelector(`[${this.#entrySelectors.subtitleSelectorName}]`);
        let link  = listEntryNode.querySelector(`[${this.#entrySelectors.linkSelectorName}]`);
        titleNode.innerHTML = data.title;
        subtitleNode.innerHTML = data.subTitle;
        link.href = data.url;
        link.title = data.title;
        return listEntryNode;
    }
    
    clearList(){
        this.el.innerHTML = "";
    }

    replaceList(data){
        this.clearList();
        data.forEach( (entry, index) => {
            this.#addToList(entry);
        });
    }

    #addToList(data){
        let newListElement = this.#createListEntryNode(data);
        this.el.appendChild(newListElement);
    }

}