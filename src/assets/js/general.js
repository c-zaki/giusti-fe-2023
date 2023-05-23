// Common
import { default as init } from "./common/base";

//Vendors
import 'lazysizes';
import { Modal } from "bootstrap";

// Helpers
import { Component } from "./helpers/component";
import { ZEvents } from "./helpers/events";
import { StoreManager } from "./helpers/store";

// Components
import { Img } from "../../components/img/img";
import { Toast } from "../../components/toast/toast";
import { Slider } from "../../components/slider/slider";
import { Header } from "../../components/header/header";
import { NavBar1 } from "../../components/navbar1/navbar1";
import { SearchOverlay } from "../../components/searchoverlay/searchoverlay";
import { OffCanvasNav } from "../../components/offcanvasnav/offcanvasnav";
import { Form } from "../../components/form/form";
import { ShareBtn } from "../../components/sharebtn/sharebtn";
import { Icon } from "../../components/icon/icon";
import { Button } from "../../components/btn/btn";
import { BulletList } from "../../components/bulletlist/bulletlist";
import { NavModal1 } from "../../components/navmodal1/navmodal1";
import { HeaderNav } from "../../components/header/headernav";

//Load app store
const storeManager = new StoreManager();

//Loading events
ZEvents.loadCustomEvents();

// Registering components
Component.register("Header", Header);
Component.register("HeaderNav", HeaderNav);
Component.register("Slider", Slider);
Component.register("NavBar1", NavBar1);
Component.register("OffCanvasNav",OffCanvasNav);
Component.register("Form", Form);
Component.register("Toast", Toast);
Component.register("Icon", Icon);
Component.register("Button", Button);
Component.register("ShareBtn", ShareBtn);
Component.register("SearchOverlay",SearchOverlay);
Component.register("BulletList", BulletList);
Component.register("NavModal1", NavModal1);
Component.register("Img", Img);

init();
