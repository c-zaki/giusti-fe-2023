import JustValidate from "just-validate";
import { Utils } from "../../assets/js/helpers/utils";
import { Ajax } from "../../assets/js/helpers/ajax";
import { Translation } from "../../assets/js/helpers/translation";
import { StoreManager } from "../../assets/js/helpers/store";
import { ToastHelper } from "../../assets/js/helpers/toast";

export class Form {

    cssClass = "c-form";
    cssFormFieldClass = `${this.cssClass}__field`;
    validationPotClass = `${this.cssClass}__validation-pot`;
    validationMode = "just-validate";
    fieldWrapperSelectorName = "data-field-wrapper";
    fieldWrapperSelector = `[${this.fieldWrapperSelectorName}]`;
    skipClensingAttrName = `data-skip-clensing`;
    locked = false;
    coolDown = 10000;
    validator = null;
    validatorConfig = {};
    config = {
        "sendMode" : "sync",
        "cleanOnceSent" : true,
        "messages" : {
            "sendSuccess" : Translation.translate("zaux_form_send_success"),
            "errorNotSent" : Translation.translate("zaux_form_send_error"),
            "tryLater" : Translation.translate("zaux_form_try_later")
        }
    };
    loaderSelector = "[data-loader]";
    loader = null;
    loaderActiveClass = "--active";


    constructor(el = null) {
        this.el = el;

        if( this.el.hasAttribute("data-validation-mode") ){
            this.validationMode = this.el.getAttribute("data-validation-mode");
        }

        if( this.el.hasAttribute("data-config") ){
            var customConfig = JSON.parse(this.el.getAttribute("data-config"));
            this.config = Utils.arrayReplaceRecursive(this.config, customConfig);
        }

        switch( this.validationMode ){
            case "just-validate":
                //@see https://just-validate.dev/docs/instance for all available options
                if( this.el.hasAttribute("data-just-validate-config") ){
                    this.validatorConfig = JSON.parse(this.el.getAttribute('data-validation-config') );
                }else{
                    this.validatorConfig = {
                        errorFieldCssClass : [this.cssFormFieldClass + "--error"],
                        successFieldCssClass : [this.cssFormFieldClass + "--success"],
                        errorLabelCssClass : [this.cssClass + "__validation-label--error"],
                        successLabelCssClass : [this.cssClass + "__validation-label--success"],
                        focusInvalidField : true,
                        lockForm : true,
                        validateBeforeSubmitting : true,
                    };
                }
            break;
        }

        this.loader = document.querySelector(this.loaderSelector) || null;
        this.init();
    }

    showLoader(){
        if( this.loader !== null){
            this.loader.classList.add(this.loaderActiveClass);
        }
    }

    hideLoader(){
        if( this.loader !== null ){
            this.loader.classList.remove(this.loaderActiveClass);
        }
    }

    lockSend(){
        if( this.locked == false ){
            this.locked = true;
            setTimeout(() => {
                this.locked = false;
            }, this.coolDown);
        }
    }

    handleFormValidation(outCome){
        if( this.locked == true ){ 
            ToastHelper.show(this.config.messages.tryLater, "error");
            return; 
        }
        this.lockSend();
        switch( outCome ){
            case "success":
                if( this.config.sendMode == "async" ){
                    this.showLoader();
                    try{
                        Ajax.post(
                            this.el.action,
                            new FormData(this.el),
                            "formData"
                        ).then( response => {
                            if( Utils.isDebug ){
                                console.log("Response from form:");
                                console.log(response);
                            }
                            this.hideLoader();
                            if( response ){
                                if( response.message !== undefined && response.message !== false ){
                                    ToastHelper.show(response.message.text, response.message.type);
                                    if( response.message.type == "success"){
                                        this.cleanFields();
                                    }
                                }else{
                                    ToastHelper.show(this.config.messages.sendSuccess, "success");
                                    this.cleanFields();
                                }
                            }else{
                                ToastHelper.show(this.config.messages.errorNotSent, "error");
                            }
                        });
                    }catch(e){
                        this.hideLoader();
                        ToastHelper.show(this.config.messages.errorNotSent, "error");
                        console.log(e);
                    }
                }else{
                    this.el.submit();
                }
            break;  
        }
    }

    cleanFields(){
        if( this.config.cleanOnceSent == true ){
            this.el.querySelectorAll("[class*=__field]").forEach( element => {
                if( !element.hasAttribute("data-skip-clensing") ){
                    if( element.tagName !== "SELECT" ){
                        if( element.type == "checkbox" ){
                            element.checked = false;
                        }else{
                            element.value = "";
                        }
                    }
                }
            });
        }
    }

    init(){
        //Supports multiple validation modes if implemented. By Default just-validate is active
        switch( this.validationMode ) {
            case "just-validate":
                this.el.setAttribute("novalidate","novalidate");
                this.validator = new JustValidate(this.el, this.validatorConfig);
                
                //Validator setup
                this.el.querySelectorAll("input:not([type=submit], textarea)").forEach( element => {

                    var rules = [];
                    var needsValidation = false;
                    var inputType = "";
                    var ruleObj = {};
                    var extraOpts = {};

                    //Check if it's required
                    if( element.hasAttribute("required") ){
                        ruleObj.rule = "required";
                        ruleObj.errorMessage = Translation.translate("zaux_field_required");
                        if( element.hasAttribute("data-required-msg") ){
                            ruleObj.errorMessage = element.getAttribute("data-required-msg");
                        }
                        rules.push(ruleObj);
                        needsValidation = true;
                    }

                    if( element.getAttribute("type") ){
                        inputType = element.getAttribute("type");
                        switch( inputType ){
                            case "email":
                                ruleObj = {};
                                ruleObj.rule = "email";
                                ruleObj.errorMessage = Translation.translate("zaux_email_format_invalid");
                                if( element.hasAttribute("data-format-msg") ){
                                    ruleObj.errorMessage = element.getAttribute("data-format-msg");
                                }
                                rules.push(ruleObj);
                                needsValidation = true;
                            break;
                        }
                    }

                    //If validation is needed for the field we add the previously determined rules
                    if( needsValidation ){
                        //Change validation message location if a validation "pot" is present
                        if( element.closest(`.${this.cssFormFieldClass}-wrap, ${this.fieldWrapperSelector}`) ){
                            var wrapper = element.closest(`.${this.cssFormFieldClass}-wrap`);
                            if( wrapper.querySelector(`.${this.validationPotClass}`) ){
                                extraOpts.errorsContainer = wrapper.querySelector(`.${this.validationPotClass}`);
                            }
                        }
                        this.validator.addField(element, rules, extraOpts);
                    }

                });
                
                this.validator.onSuccess(() => { this.handleFormValidation("success") });
                //this.validator.onFail(() => { this.handleFormValidation("failure") });
                
            break;
        }

    }

}       