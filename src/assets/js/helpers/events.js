
import { Utils } from "./utils";

export class ZEvents{

    eventOptions = { "trusted" : true, "bubbles" : true, "cancelable" : true };
    
    static loadCustomEvents(){
        Utils.getNS().appEvents = {}; 
    }

    static get customEvents(){
        return Utils.getNS().appEvents;
    }

    static getCustomEventName(eventGroup, eventEntryName){
        //console.log(this.customEvents[eventGroup][eventEntryName]);
        if( this.customEvents[eventGroup][eventEntryName] !== undefined ){
            return this.customEvents[eventGroup][eventEntryName].eventName;
        }
    }

    static triggerEvent(eventGroup, eventName, element = null){
        try{
            if( element == null ){
                document.dispatchEvent( this.customEvents[eventGroup][eventName].eventObj );
            }else{
                element.dispatchEvent( this.customEvents[eventGroup][eventName].eventObj );
            }
        }catch(e){
            console.log(`Error while triggering event, check that the event and corresponding group exists in ${Utils.getVarNS()}.appEvents`)
        }
    }

    static triggerEventOnElement(eventGroup, eventName, element){
        try{
            element.dispatchEvent( this.customEvents[eventGroup][eventName].eventObj );
        }catch(e){
            console.log(`Error while triggering event, check that the event and corresponding group exists in ${Utils.getVarNS()}.appEvents`)
        }
    }

    static addCustomEvent(eventGroup, eventEntryName, eventName){
        if( this.customEvents[eventGroup] == undefined ){
            this.customEvents[eventGroup] = {};
        }
        this.customEvents[eventGroup][eventEntryName] = {
            "eventName" : `${Utils.getVarNS()}.${eventName}`,
            "eventObj" : new CustomEvent(`${Utils.getVarNS()}.${eventName}`, this.eventOptions)
        };
    }

}