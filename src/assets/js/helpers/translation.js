import { Utils } from "./utils";

export class Translation {

    static translate(key){
        try{
            var strings = Utils.getNS()?.lang;
            return strings[key] || key;
        }catch(e){
            console.log("Error while retrieving translation, details below:");
            console.log(e);
        }
    }

}