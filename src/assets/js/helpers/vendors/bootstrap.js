export class BootstrapHelper{

    static modalTriggerActiveClass = "--active";

    static init(){
        this.collapseAlternativeText();
        this.enhanceModals();
    }
    static collapseAlternativeText(){
        let labelSelectors = `[class*=__label]`;

        document.querySelectorAll(".accordion-collapse").forEach( element => {
            element.addEventListener("show.bs.collapse", (event) => {
                document.querySelectorAll( `[data-bs-target="#${event.target.id}"]`).forEach( (element) => {
                    if( element.dataset.labelClass !== undefined ){labelSelectors = element.dataset.labelClass;}
                    if( element.dataset.expandedLabel !== undefined ){
                        element.querySelector(labelSelectors).textContent = element.dataset.expandedLabel;
                    }
                });
            });
            element.addEventListener("hide.bs.collapse", (event) => {
                document.querySelectorAll(`[data-bs-target="#${event.target.id}"]`).forEach( (element) => {
                    if( element.dataset.labelClass !== undefined ){labelSelectors = element.dataset.labelClass;}
                    if( element.dataset.collapsedLabel !== undefined ){
                        element.querySelector(labelSelectors).textContent = element.dataset.collapsedLabel;
                    }
                })
            });
        });
    }
    static enhanceModals(){
        
        document.querySelectorAll(".modal").forEach( element => {
            element.addEventListener("show.bs.modal", (e) => {
                //Icons support
                var trigger = e.relatedTarget;
                element.triggerElement = trigger;
                if( trigger ){
                    trigger.classList.add(this.modalTriggerActiveClass);
                    if( trigger.getAttribute("data-icon-switch") !== null && trigger.querySelector("[data-js-component=Icon]") ){
                        if( typeof trigger.querySelector("[data-js-component=Icon]").instance.changeIcon == "function" ){
                            var iconSwitchConfig = JSON.parse(trigger.getAttribute("data-icon-switch"));
                            trigger.querySelector("[data-js-component=Icon]").instance.changeIcon(iconSwitchConfig.active);
                        }
                    }
                }
            });
            element.addEventListener("hide.bs.modal", (e) => {
                if( e.target ){
                    e.target.triggerElement?.classList.remove(this.modalTriggerActiveClass);
                    if( e.target.triggerElement?.getAttribute("data-icon-switch") !== null && e.target.triggerElement?.querySelector("[data-js-component=Icon]") ){
                        if( typeof e.target.triggerElement.querySelector("[data-js-component=Icon]").instance.changeIcon == "function" ){
                            var iconSwitchConfig = JSON.parse(e.target.triggerElement.getAttribute("data-icon-switch"));
                            e.target.triggerElement.querySelector("[data-js-component=Icon]").instance.changeIcon(iconSwitchConfig.idle);
                        }
                    }
                }
            });
        });
    }

}