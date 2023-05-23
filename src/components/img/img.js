export class Img {

    #imgElement = null;

    constructor(el = null){
        this.el = el;
        this.#imgElement = this.el.querySelector("img");
    }

    changeSrc(srcData){
        this.#imgElement.src = srcData.src;
    }

}