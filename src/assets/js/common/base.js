//App Classes
import { DataLayer } from "./classes/datalayer";

// Helpers
import { Component } from "../helpers/component";
import { Device } from "../helpers/device";
import { Observe } from "../helpers/observe";
import { Utils } from "../helpers/utils";
import { UI } from "../helpers/ui";

//Vendor Helpers
import { BootstrapHelper } from "../helpers/vendors/bootstrap";
import { FancyboxSetup } from "../helpers/vendors/fancybox";
import { AirDatePickerSetup } from "../helpers/vendors/airdatepicker";

//Modules
import { Tabs } from "../modules/tabs";
import { SelectLink } from "../modules/select-link";
import "../modules/match-height";

const Base = () => {

  Utils.credits();

  if (Utils.isDebug) {
    console.log("isIOS: ", Device.isIOS);
    console.log("isSafari: ", Device.isSafari);
  }

  if (Device.isIOS) {
    document.body.classList.add(`is-ios`);
  }

  if (Device.isSafari) {
    document.body.classList.add(`is-safari`);
  }

  if (Device.isTouch) {
    document.body.classList.add(`is-touch`);
  }

  // Creates a general purpose  "InView" observer (runs once per element when attached)
  Observe.handlers.InViewOnce = Observe.create();

  // Converts breakpoint config value strings to numbers
  ((bp) => {
    Object.keys(bp).forEach((k) => (bp[k] = parseFloat(bp[k])));
  })(Utils.getNS().config.breakpoints);

  Utils.getNS().mqoMd = matchMedia(
    `(min-width:${Utils.getNS().config.breakpoints.md}px)`
  );

  Utils.getNS().isMobile = !Utils.getNS().mqoMd.matches;

  document.addEventListener("DOMContentLoaded", () => {

    //Setting up DataLayer
    if( Utils.getNS().config.dataLayer ) {
      new DataLayer(Utils.getNS().config.dataLayer?.endPoint);
    }

    // Inits the helper module who lazy-load the images
    //Lazyload.init();

    // Moves/Clones elements in DOM
    Utils.prependChildrens();

    // Inits the components in page
    Component.initAll();

    //Modules
    Tabs.init();
    SelectLink.init();
    //StickyElements.init();
    //Spoilers.init();

    //Load vendor helpers
    FancyboxSetup.init();
    BootstrapHelper.init();
    AirDatePickerSetup.init();

    //Boot UI functionalities
    UI.setupActionEvents();
    UI.setupUIEvents();
    UI.setFooterSticky();
    UI.fakeHrefs();
    //Watchers
    UI.overlayWatcher();
    UI.hashScrollWatcher();

    if (Utils.isDebug) {
      console.log(`DOM LOAD END`);
    }

  });

};

export default Base;
