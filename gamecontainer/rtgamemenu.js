/*
need to be menu with buttens to instance the game provided in the src and the joingame if multi is true


           titel
        ------------
           speel
        samen spelen

*/

class RtGameMenu extends HTMLElement{
    constructor(name,src,multi = false){
        super()

    }

    connectedCallback(){

    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    makebuttons(){
        
    }




}
customElements.define('rt-game-menu', RtGameMenu);

export {RtGameMenu};
console.log('container.js loaded');