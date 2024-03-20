/*
need to be menu with buttens to instance the game provided in the src and the joingame if multi is true


           titel
        ------------
           speel
        samen spelen

*/

class RtGameMenu extends HTMLElement{
    constructor(){
        super()
        const ws = document.ws;
        const attr = document.querySelector(`game-container`).attributes;
        console.log(attr.name.value);

        //make buttons
        const speel = document.createElement(`button`);
        speel.id = 'speelknop';
        speel.textContent = 'speel';
        const samen = document.createElement('button');
        samen.id = `joinknop`;
        samen.textContent='samen speelen';
        speel.onclick = () => {ws.makeGame(attr.name.value,'test',attr.maxplayers.value,attr.boardinfo.value)};
        samen.onclick = () => {};
        this.append(...[speel,samen]);

    }


    connectedCallback(){
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }





}
customElements.define('rt-game-menu', RtGameMenu);

export {RtGameMenu};
console.log('container.js loaded');