import { Utils } from "../../assets/js/helpers/utils";
import { ZEvents } from "../../assets/js/helpers/events";
import { ToastHelper } from "../../assets/js/helpers/toast";
import { Translation } from "../../assets/js/helpers/translation";

export class Button {
    iconElement = null;
    loadingClass = "--loading";

    constructor(el = null) {
        this.el = el; 
        if( el.querySelectorAll("[class*=__icon]").length > 0){
            this.iconElement = el.querySelector("[class*=__icon]");
        }
        this.init();
    }

    changeIcon(iconName){
        if( this.iconElement !== null && this.iconElement.instance ){
            this.iconElement.instance.changeIcon(iconName);
        }
    }

    iconSwitch(iconSwitchConfig){
        if( this.iconElement !== null && this.iconElement.instance ){
            this.iconElement.instance.iconSwitch(iconSwitchConfig);
        }
    }
    
    init(){

        //Data layer events support
        if( typeof Utils.getNS().dataLayer !== "undefined" ){
            if( this.el.hasAttribute( Utils.getNS().dataLayer.dataLayerEventSelectorName ) ){
                var dataLayer = Utils.getNS().dataLayer;
                this.el.addEventListener( ZEvents.getCustomEventName(dataLayer.dataLayerConfig.eventsGroup, dataLayer.dataLayerEvents.sentLoading ), e => {
                    this.el.classList.add(this.loadingClass);
                });
                this.el.addEventListener( ZEvents.getCustomEventName(dataLayer.dataLayerConfig.eventsGroup, dataLayer.dataLayerEvents.sentSuccess ), e => {
                    this.el.classList.remove(this.loadingClass);
                    if( this.el.hasAttribute("data-icon-switch") ){
                        var iconSwitchConfig = JSON.parse(this.el.getAttribute("data-icon-switch"));
                        this.iconSwitch(iconSwitchConfig);
                    }
                } );
                this.el.addEventListener( ZEvents.getCustomEventName(dataLayer.dataLayerConfig.eventsGroup, dataLayer.dataLayerEvents.sentFail ), e => {
                    this.el.classList.remove(this.loadingClass);
                    ToastHelper.show(Translation.translate("zaux_datalayer_call_error"), "error");
                });
            }
        }

        if( this.el.hasAttribute("data-icon-switch") ){
            var iconSwitchConfig = JSON.parse(this.el.getAttribute("data-icon-switch"));
            //If direct is set it immediately changes the icon
            if( iconSwitchConfig.direct == true ){
                this.el.addEventListener("click", (e) =>{
                    this.iconSwitch(iconSwitchConfig);
                });
            }
        }

    }

}