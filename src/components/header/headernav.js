import { on } from "delegated-events";
import { Modal } from "bootstrap";
import { Utils } from "../../assets/js/helpers/utils";
import { ZEvents } from "../../assets/js/helpers/events";

export class HeaderNav {
    
    navElements = null;
    navModalElement = null;
    navModalBSInstance = null;
    activeClass = "--active";
    #modalDelay = 200;
    #locked = false;
    #navModalInstance = null;
    #activeElement = null;
    #subMenuTriggerSelectorName="data-submenu-trigger";
    
    constructor(el = null) {
        this.el = el; 
        this.navModalElement = document.querySelector("#" + this.el.dataset.navmodalId) ?? null;
        this.navModalBSInstance = new Modal(this.navModalElement);
        if( typeof this.navModalElement.instance === "object" && this.navModalElement.instance !== null ){ 
            this.#navModalInstance = this.navModalElement.instance;
        }
        this.init();
    }

    set setModalDelay(delay){
        this.#modalDelay = delay;
    }

    get activeElement(){
        this.el.querySelectorAll("[data-submenu-entry]")?.forEach( element => {
            if(this.#isEntryActive(element)){
                return element;
            }
        });
        return null;
    }
    
    //Initializes menu entries
    #initializeMenuEntries(){
        if( this.el.querySelectorAll("[data-menu-entry]").length > 0 ){
            this.el.querySelectorAll("[data-menu-entry]").forEach( (element) => {
                if( element.querySelector("[data-submenu]") ){
                    element.dataset.hasSubMenu = true;
                }
            });
        }
    }

    //Clears the current active element
    #clearCurrentActiveElement(){
        this.el.querySelectorAll("[data-menu-entry]").forEach( element => {
            element.classList.remove(this.activeClass);            
        });
    }

    //Checks if an entry is active
    #isEntryActive(element){
        return element.classList.contains(this.activeClass);
    }

    //Returns the content of a sub entry as JSON given the HTML Node
    #getSubMenuJSON(menuEntry){
        let json = [];
        let subMenu = menuEntry.querySelector("[data-submenu]") ?? null;
        if( subMenu !== null ){
            let data = {
                "cover" : {
                    "type" : subMenu.dataset.datacovertype ?? "img",
                    "url" : subMenu.dataset.coverImgSrc ?? null
                },
                "title" : subMenu.dataset.submenuTitle ?? null,
                "logo" : subMenu.dataset.logoSrc ?? null,
                "entries" : []
            };
            subMenu.querySelectorAll("[data-submenu-entry]").forEach( (subEntryEl) => {
                data.entries.push(
                        {
                            "url" : subEntryEl.querySelector("[data-link]").href,
                            "title" : subEntryEl.querySelector("[data-title]").innerHTML,
                            "subTitle" : subEntryEl.querySelector("[data-subtitle]").innerHTML
                        }
                    );
                }
            );
            json = data;
        }
        return json;
    }

    //Activates an element
    #activateElement(element){
        this.#clearCurrentActiveElement();
        element.classList.add(this.activeClass);
        this.#activeElement = element;
    }

    //Fills the content of the navigation Modal
    #fillNavModal(target){
        try{
            //Check if instance is present
            if( this.#navModalInstance !== null && target !== null){
                let data = this.#getSubMenuJSON(target);
                if( this.#navModalInstance.fillNav(data) ){
                    return true;
                }else{
                    if(Utils.isDebug){
                        console.log("NavModal error: Menu data is empty");
                    }
                    return false;
                }
            }
        }catch(e){
            console.log(e);
            if( Utils.isDebug){
                console.log("NavModal Error:");
                console.log(e);
            }
        }
    }

    closeSubNav(){
        this.navModalBSInstance.hide();
    }

    init(){
        //Check if navModalElement is
        if( this.navModalElement !== null ){
            //Initialize menu entries
            this.#initializeMenuEntries();
            //Setup what happens on click of a children containing entries
            this.el.querySelectorAll(`[${this.#subMenuTriggerSelectorName}]`).forEach( (element) => {
                element.addEventListener("click", (e) => {
                    e.preventDefault();
                    var target = e.currentTarget.parentNode;
                    //If clicked entry is already active return
                    if(this.#isEntryActive(target)){
                        return;
                    }
                    //Handles the locked state for the active entry to regulate modals behaviour
                    if( this.#locked === false ){
                        this.#fillNavModal(target);
                        this.#activateElement(target);
                        if( !this.navModalElement.classList.contains("show") ){
                            ZEvents.triggerEvent("ui","overlayHideAll");
                            this.navModalBSInstance.show();
                        }
                    }
                });
            });
            this.navModalElement.addEventListener("hide.bs.modal", (e) => {
                if( this.#locked == false ){
                    this.#clearCurrentActiveElement();
                }
            });
            this.navModalElement.addEventListener("show.bs.modal", (e) => {
                this.#locked = false;
            }); 
        }
        document.addEventListener(`${Utils.getVarNS()}.overlay.hideAll`, () =>{
            this.closeSubNav();
        });
    }

}