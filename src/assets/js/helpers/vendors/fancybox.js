//Vendors
import { Fancybox } from "@fancyapps/ui/dist/fancybox.umd";


export class FancyboxSetup{

    static init(){
        //Loading vendors
        Fancybox.bind("[data-fancybox]");
    }

}