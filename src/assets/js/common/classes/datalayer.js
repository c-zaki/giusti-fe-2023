import { Utils } from "../../helpers/utils";
import { Cookies } from "../../helpers/cookies";
import { ZEvents } from "../../helpers/events";
import { Ajax } from "../../helpers/ajax";

export class DataLayer{
    
    #dataLayerEventSelectorName = `data-zaux-datalayer-event`;
    #dataLayerEventSelector = `[${this.#dataLayerEventSelectorName}]`;
    #dataLayerEndPoint = "";
    #dataLayerEventsConfig = {
        "eventsGroup" : "dataLayer",
        "events" : {
            "sentSuccess" : "sentSuccess",
            "sentLoading" : "sentLoading",
            "sentFail" : "sentFail"
        }
    };

    constructor(dataLayerEndpoint = null){
        if( dataLayerEndpoint !== null ){
            this.#dataLayerEndPoint = dataLayerEndpoint;
            this.#init();
            Utils.getNS().dataLayer = this;
        }else{
            console.log("Data layer endpoint has not been set, please specify one in order for it to work");
        }
    }

    get dataLayerEventSelectorName(){
        return this.#dataLayerEventSelectorName;
    }

    get dataLayerEventSelector(){
        return this.#dataLayerEventSelector;
    }

    get dataLayerEvents(){
        return this.#dataLayerEventsConfig.events;
    }

    get dataLayerConfig(){
        return this.#dataLayerEventsConfig;
    }

    #setupEvents(){
        //Event that will be triggered upon success
        ZEvents.addCustomEvent(
            this.#dataLayerEventsConfig.eventsGroup, 
            this.#dataLayerEventsConfig.events.sentSuccess,
            this.#dataLayerEventsConfig.events.sentSuccess 
        );
        //Event that will be triggered upon failure
        ZEvents.addCustomEvent(
            this.#dataLayerEventsConfig.eventsGroup,
            this.#dataLayerEventsConfig.events.sentFail,
            this.#dataLayerEventsConfig.events.sentFail
        );
        //Event that will be triggered while waiting for response
        ZEvents.addCustomEvent(
            this.#dataLayerEventsConfig.eventsGroup,
            this.#dataLayerEventsConfig.events.sentLoading,
            this.#dataLayerEventsConfig.events.Loading
        );
    }

    async #registerEvent(eventData){
        var response = await Ajax.post(
            this.#dataLayerEndPoint,
            {
                "domain" : eventData?.domain,
                "eventName" : eventData?.eventName,
                "data" : JSON.stringify(eventData.data)
            }
        );
        if( response ){
            return response;
        }else{
            return false;
        }
    }

    #bootWatcher(){
        document.querySelectorAll(this.#dataLayerEventSelector).forEach( element => {
            if( element.getAttribute(this.#dataLayerEventSelectorName) == undefined ){ return; }
            var config = JSON.parse(element.getAttribute(this.#dataLayerEventSelectorName));
            switch( config.eventType ){
                case "click":
                    element.addEventListener("click", event => {
                        event.preventDefault();
                        var eventTarget = element;
                        ZEvents.triggerEvent(
                            this.#dataLayerEventsConfig.eventsGroup,
                            this.#dataLayerEventsConfig.events.sentLoading,
                            eventTarget
                        );
                        this.#registerEvent(config).then( response => {
                            if( Utils.isDebug ){
                                console.log("Response content:")
                                console.log(response);
                            }
                            if( response ){
                                if( response.performAction !== undefined ){
                                    switch( response.performAction ){
                                        case "redirect":
                                            window.location.href = response.redirectURI;
                                        break;
                                    }
                                }
                                ZEvents.triggerEvent(
                                    this.#dataLayerEventsConfig.eventsGroup,
                                    this.#dataLayerEventsConfig.events.sentSuccess,
                                    eventTarget
                                );
                            }else{
                                ZEvents.triggerEvent(
                                    this.#dataLayerEventsConfig.eventsGroup,
                                    this.#dataLayerEventsConfig.events.sentFail,
                                    eventTarget
                                );
                            }
                        });
                    });
                break;
            }
        });
    }

    #init(){
        this.#setupEvents();
        this.#bootWatcher();
    }

}