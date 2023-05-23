import { Utils } from "./utils";
import { ZEvents } from "./events";

export class UI{

    static setFooterSticky(){
        
        function stickyFooterWatch(){
            var stickyFooterElementSrc = document.querySelector("#zaux-content-wrapper");
            if( stickyFooterElementSrc !== null ){
                //stickyFooterElementSrc.style.border = "5px solid red";
                var config = stickyFooterElementSrc.getAttribute("data-settings");

                //Check if config is present or not
                if( config !== null ){
                    config = JSON.parse(config);
                }
                //If sticky footer is enabled in the configuration we boot it
                if( config.stickyFooter == true ){
                    var header = document.querySelector(".c-header");
                    var footer = document.querySelector(".c-footer");
                    stickyFooterElementSrc.style.minHeight = (window.innerHeight + header.clientHeight) - (footer.clientHeight) + "px";
                }
            }
        }

        stickyFooterWatch();
        window.addEventListener("resize",stickyFooterWatch);
        
    }

    static overlayWatcher(){
        
        document.querySelectorAll(".modal").forEach( (element) => {
            element.addEventListener('shown.bs.modal', () => {
                ZEvents.triggerEvent("ui","overlayShown");
            });
        });
    }

    static hashScrollWatcher(){
        
        document.querySelectorAll("a[href^='#']").forEach( element => {
            let elementID = element.getAttribute("href");
            if( elementID == "#" ){ return; }
            if( document.querySelector(elementID) ){
                let targetElement = document.querySelector(elementID);
                element.addEventListener("click", (e) => {
                    e.preventDefault();
                    let verticalOffset = 0;
                    if( document.querySelector(elementID).getAttribute("data-scroll-offset") ){
                        verticalOffset = parseInt(document.querySelector(elementID).getAttribute("data-scroll-offset"));
                    }
                    
                    //Checks if header is position fixed and interfers with element's visibility
                    if( document.querySelector("header") ){
                        var headerPosition = window.getComputedStyle(document.querySelector('header')).getPropertyValue('position');
                        if( headerPosition == "fixed" ){
                            verticalOffset += document.querySelector("header").clientHeight;
                        }
                    }

                    window.scrollTo(
                        {
                            top : targetElement.offsetTop - verticalOffset,
                            behavior : "smooth"
                        }
                    );
                } );

            }
        });
    }

    static setupActionEvents(){
        ZEvents.addCustomEvent("actions", "actionLoading", "actionLoading");
        ZEvents.addCustomEvent("actions", "actionSuccess", "actionSuccess");
        ZEvents.addCustomEvent("actions", "actionError", "actionError");
    }

    static setupUIEvents(){
        ZEvents.addCustomEvent("ui", "overlayShown", `overlay.shown`);
        ZEvents.addCustomEvent("ui", "overlayHideAll", `overlay.hideAll`);
        ZEvents.addCustomEvent("ui", "offcanvasShown", "offcanvas.shown");
        ZEvents.addCustomEvent("ui", "offcanvasClosed", "offcanvas.closed");
    }

    static fakeHrefs(){
        document.querySelectorAll(`[data-${Utils.getVarNS()}-href]`).forEach( element => {
            element.addEventListener("click", (e) => {
                var link = element.getAttribute(`data-${Utils.getVarNS()}-href`);
                window.location.href = link;
            });
        });
    }
    
}