import { Utils } from "./utils";

export class StoreManager{

    constructor(){
        this.#boot();
    }

    #boot(){
        Utils.getNS().store = {};
    }

    static setState(entryName, value){
        Utils.getNS().store[entryName] = value;
    }

    static getState(entryName){
        return Utils.getNS().store[entryName];
    }

}