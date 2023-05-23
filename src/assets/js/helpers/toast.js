import { Utils } from "./utils";

export class ToastHelper{

    static show(message, type = "standard"){
        var toastElement = Utils.getNS().store.appToast.instance || null;
        if( toastElement !== null ){
            toastElement.show(message, type);
        }
    }

    static clean(){
        var toastElement = Utils.getNS().store.appToast.instance || null;
        if( toastElement !== null ){
            toastElement.clean();
        }
    }

    static hide(){
        var toastElement = Utils.getNS().store.appToast.instance || null;
        if( toastElement !== null ){
            toastElement.hide();
        }
    }

}