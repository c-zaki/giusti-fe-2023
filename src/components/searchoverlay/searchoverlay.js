import { Utils } from "../../assets/js/helpers/utils";
import { StoreManager } from "../../assets/js/helpers/store";
import { Modal } from "bootstrap";
import { ZEvents } from "../../assets/js/helpers/events";

export class SearchOverlay {

    cssClass = "c-searchoverlay";
    isOpen = false;
    isTyping = false;
    origin = false;
    #searchInputSelectorName = "data-search-input";
    #searchInput = null;

    constructor(el = null) {
        this.el = el;
        StoreManager.setState("searchOverlayOpen", false);
        this.#searchInput = this.el.querySelector(`[${this.#searchInputSelectorName}]`) ?? null;
        this.init();
    }

    init(){

        var currentComponent = this;
        
        this.el.addEventListener("show.bs.modal", (e) => {
            ZEvents.triggerEvent("ui","overlayHideAll");
        });

        this.el.addEventListener("shown.bs.modal", (e) => {
            currentComponent.isOpen = true;
            this.origin = e.relatedTarget;
            if( e.relatedTarget.classList.contains("searchbar") ){
                this.origin.classList.toggle("--hide");
            }
            StoreManager.setState("searchOverlayOpen", true);
            if( this.#searchInput ){
                this.#searchInput.focus();
            }
        });
        this.el.addEventListener("hide.bs.modal", () =>{
            currentComponent.el.classList.remove(`${currentComponent.cssClass}--typing`);
            currentComponent.isOpen = false;
            StoreManager.setState("searchOverlayOpen", false );
        });
        
        document.addEventListener(`${Utils.getVarNS()}.overlay.hideAll`, () =>{
            if( currentComponent.isOpen == true ){
                Modal.getInstance(currentComponent.el).hide();
            }
        });

    }

}