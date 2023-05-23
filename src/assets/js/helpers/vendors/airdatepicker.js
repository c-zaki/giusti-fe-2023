//Vendors
import AirDatepicker from 'air-datepicker';
import { Utils } from '../utils';
import localeEn from 'air-datepicker/locale/en';
import localeIt from 'air-datepicker/locale/it';
import localeFr from 'air-datepicker/locale/fr';
import localeDe from 'air-datepicker/locale/de';


export class AirDatePickerSetup{

    static airDateSelector = "[data-airpicker]";

    static init(){
        document.querySelectorAll(this.airDateSelector).forEach( element => {
            var options = {};
            var activeLocale = localeEn;

            if( element.hasAttribute("data-picker-options") ){
                options = JSON.parse(element.getAttribute("data-picker-options"));
            }

            if(Utils.getNS().config.activeLanguage ){
                switch(Utils.getNS().config.activeLanguage){
                    case "it":
                        activeLocale = localeIt;
                    break;
                    case "en":
                        activeLocale = localeEn;
                    break;
                    case "de":
                        activeLocale = localeDe;
                    break;
                    case "fr":
                        activeLocale = localeFr;
                    break;
                }
            }
            if( options.startDateToday !== undefined ){
                options.minDate = new Date();
                options.startDate = new Date();
                options.disableNavWhenOutOfRange = true;
            }
            options.locale = activeLocale;
            new AirDatepicker(element, options);
        });
    }

}