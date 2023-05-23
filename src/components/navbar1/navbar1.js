import { Dom } from "../../assets/js/helpers/dom";

export class NavBar1 {
    static cssClass = "c-navbar1";
    static overflowing = null;
    static timerCheckResize = null;
    static scrollAmount = 200;

    constructor(el = null) {
        const _class = this.constructor;
        this.el = el;
        this.scrollTrack = this.el.querySelector(`.${_class.cssClass}__track`);
        this.scrollElement = this.el.querySelector(`.${_class.cssClass}__scroll`);
        this.btnNext = this.el.querySelector(`.${_class.cssClass}__btn.${_class.cssClass}__btn--next`);
        this.btnPrev = this.el.querySelector(`.${_class.cssClass}__btn.${_class.cssClass}__btn--prev`);
        this.scrollAmount = 200;
        if (this.el.getAttribute("data-offset-scroll")) {
            this.scrollAmount = this.el.getAttribute("data-offset-scroll");
        }
        if( this.el.querySelectorAll('[data-scroll-unit]').length > 0 ){
            this.scrollAmount = this.el.querySelectorAll('[data-scroll-unit]')[0].clientWidth;
        }
        if (this.btnPrev) {
            this.btnPrev.addEventListener("click", () => { this.doScroll("left", this.scrollAmount) });
        }
        if (this.btnNext) {
            this.btnNext.addEventListener("click", () => { this.doScroll("right", this.scrollAmount) });
        }
        this.scrollTrack.addEventListener("wheel", this.onWheel.bind(this) );
        this.scrollTrack.addEventListener("scroll", () => {this.checkOverflow()} );

        this.checkActive();
        this.init();
    }

    onWheel(e) {
        e.preventDefault();
        const isPrev = e.wheelDelta > 0;
        if( this.overflowing ){
            if( isPrev ){
                this.doScroll("left", Math.abs(parseFloat(e.wheelDelta)));
            }else{
                this.doScroll("right", Math.abs(parseFloat(e.wheelDelta)));
            }
        }
    }

    checkActive(){
        if( this.el.querySelectorAll(".--active").length > 0 ){
            var activeElement = this.el.querySelectorAll(".--active")[0];
            setTimeout(() => {
                this.doScroll( "right", activeElement.offsetLeft, "auto" );
            }, 500);
        }
    }

    doScroll(scrollDirection, amount = 200, behavior = "smooth") {
        var scrollValue = amount;
        if (scrollDirection == "left") {
            scrollValue *= -1;
        }
        this.scrollTrack.scroll({
            left: this.scrollTrack.scrollLeft + scrollValue,
            behavior: behavior
        });
        this.checkOverflow();
    }

    /**
     * Return the state overflow state for the scroll track
     *
     * @readonly
     * @static
     * @memberof NavBar1
    */
    static get isOverflowing() {
        return this.overflowing;
    }
    /**
     * Checks whether the scroll track is overflowing or not
     *
     * @readonly
     * @memberof NavBar1
    */
    checkOverflow() {
        if (this.scrollTrack.offsetWidth < this.scrollTrack.scrollWidth - 50) {
            this.el.classList.add(`--scrollable`);
            this.scrollTrack.classList.add(`--overflowing`);
            this.overflowing = true;
        }else{
            this.el.classList.remove(`--scrollable`);
            this.scrollTrack.classList.remove(`--overflowing`);
            this.overflowing = false;
        }
        if( this.scrollTrack.scrollLeft <= 0 ){
            this.el.classList.add("--scroll-left-0");
        }
    }

    recalculateScrollAmount(){
        if( this.el.querySelectorAll('[data-scroll-unit]').length > 0 ){
            this.scrollAmount = this.el.querySelectorAll('[data-scroll-unit]')[0].clientWidth;
        }
    }
    
    init(){
        this.checkOverflow();
        window.addEventListener("resize", () => { this.checkOverflow(); this.recalculateScrollAmount(); } );
    }
}
