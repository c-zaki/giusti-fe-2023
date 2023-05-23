import { on } from "delegated-events";
import { Utils } from "../../assets/js/helpers/utils";
import { ZEvents } from "../../assets/js/helpers/events";
import { StoreManager } from "../../assets/js/helpers/store";

export class OffCanvasNav {
  cssClass = "c-offcanvasnav";
  offCanvasSelectorTrigger = "[data-offcanvas-trigger]";
  cssClassBodyOpen = "offcanvas--open";
  isOpen = false;

  constructor(el = null) {
    this.el = el;
    this.init();
  }

  toggle(status){
    switch (status){
        case "open":
            this.isOpen = true;
            this.el.classList.add(`${this.cssClass}--open`);
            document.body.classList.add('overflow-hidden');
            document.body.classList.add(this.cssClassBodyOpen);
            ZEvents.triggerEvent("ui","offcanvasShown");
        break;
        case "close":
            this.isOpen = false;
            this.el.classList.remove(`${this.cssClass}--open`);
            document.body.classList.remove('overflow-hidden');
            document.body.classList.remove(this.cssClassBodyOpen);
            ZEvents.triggerEvent("ui","offcanvasClosed");
        break;
        case "auto":
            if( this.isOpen == false ){
                this.isOpen = true;
                this.el.classList.add(`${this.cssClass}--open`);
                document.body.classList.add('overflow-hidden');
                document.body.classList.add(this.cssClassBodyOpen);
                ZEvents.triggerEvent("ui","offcanvasShown");
            }else{
                this.isOpen = false;
                this.el.classList.remove(`${this.cssClass}--open`);
                document.body.classList.remove('overflow-hidden');
                document.body.classList.remove(this.cssClassBodyOpen);
                ZEvents.triggerEvent("ui","offcanvasClosed");
            }
        break;
    }
    StoreManager.setState("offCanvasOpen", this.isOpen);
  }

  #closeOffCanvasNav(){
    this.toggle("close");
    document.querySelectorAll( this.offCanvasSelectorTrigger).forEach( element => {
        if( element.getAttribute('data-offcanvas-trigger') == this.el.getAttribute('id') ){
            element.classList.remove("is-active");
        }
    });
  }

  init(){

    //Whenever an overlay shown event is fired, hide the off canvas
    document.addEventListener(`${Utils.getVarNS()}.overlay.hideAll`, () =>{
        this.#closeOffCanvasNav();
    });

    on("click", this.offCanvasSelectorTrigger, (e) => {
        if(this.isOpen == false ){
            ZEvents.triggerEvent("ui","overlayHideAll");
        }
        var eventTarget = e.currentTarget;
        var offCanvasName = e.currentTarget.getAttribute('data-offcanvas-trigger');
        if( eventTarget.classList.contains('is-active')){
            eventTarget.classList.remove('is-active');
        }else{
            eventTarget.classList.add('is-active');
        }
        if( this.el.getAttribute('id') == offCanvasName ){
            this.toggle("auto");
        }
    });
  }

}
