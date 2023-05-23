import { Utils } from "../../assets/js/helpers/utils";
import { ZEvents } from "../../assets/js/helpers/events";

export class NavModal1 {

    #bulletList = null;
    #coverElement = null;
    #navType = null;
    #navElement = null;
    #activeClass = "--active";
    #dataNavAttribute = "data-nav";
    #dataNavSelector = `[${this.#dataNavAttribute}]`;
    #coverImgSelectorName = "data-cover-img";
    #logoSelectorName = "data-logo";
    #titleSelectorname = "data-nav-title";
    #coverImgElement = null;
    #logoElement = null;
    #titleElement = null;

    constructor(el = null){
        this.el = el;
        if( this.el.querySelector(this.#dataNavSelector) ){
            this.#navElement = this.el.querySelector(this.#dataNavSelector);
            this.#navType = this.#navElement.getAttribute("data-js-component");
        }
        this.#coverImgElement = this.el.querySelector(`[${this.#coverImgSelectorName}]`) ?? null;
        this.#logoElement = this.el.querySelector(`[${this.#logoSelectorName}]`) ?? null;
        this.#titleElement = this.el.querySelector(`[${this.#titleSelectorname}]`);
    }
    fillNav(data){
        switch(this.#navType){
            case "BulletList":
                if( this.#navElement.instance !== null){
                    if( data.cover !== null ){
                        this.#changeCover(data.cover);
                    }
                    if( data.logo !== null ){
                        this.#hideTitle();
                        this.#changeLogo(data.logo);
                        this.#showLogo();
                    }else{
                        this.#hideLogo();
                        this.#changeTitle(data.title);
                        this.#showTitle();
                    }
                    this.#navElement.instance.replaceList(data.entries);
                }
            break;
        }
    }
    #changeTitle(title){
        this.#titleElement.innerHTML = title;
    }
    #showTitle(){
        this.#titleElement.classList.add(this.#activeClass);
    }
    #hideTitle(){
        this.#titleElement.classList.remove(this.#activeClass);
    }
    #hideLogo(){
        this.#logoElement.classList.remove(this.#activeClass);
    }
    #showLogo(){
        this.#logoElement.classList.add(this.#activeClass);
    }
    #changeCover(cover){ 
        if( this.#coverImgElement !== null && this.#coverImgElement.instance !== null){
            this.#coverImgElement.instance.changeSrc({"src":cover.url});
        }
    }
    #changeLogo(logo){
        if( this.#logoElement !== null && this.#logoElement.instance !== null){
            this.#logoElement.instance.changeSrc({"src": logo});
        }
    }
}