/*
need to be menu with buttens to instance the game provided in the src and the joingame if multi is true

make a menu with buttens from the paths json and populate butons with m

*/
//todo change join to id and or make a invite link

class RtGameMenu extends HTMLElement{
    constructor(instantor,paths){
        super()
        const ws = instantor.ws;
        const attr = document.querySelector(`game-container`).attributes;
        console.log(attr.name.value);

        //!testing some stuf

for(const [key ,value] of Object.entries(paths)){
    //make a button with key as name and value as value wich onclick sends event with the path
    const button = document.createElement(`button`);
    button.id = key;
    button.innerText = key;
    button.src = value;
    button.onclick = () => { document.dispatchEvent(new CustomEvent('gameSelected',{detail:value}))};
    this.append(button);
}

    //todo old stuf maby not needed
        //make buttons
        const speel = document.createElement(`button`);
        speel.id = 'speelknop';
        speel.textContent = 'speel';
        const samen = document.createElement('button');
        samen.id = `joinknop`;
        samen.textContent='samen speelen';
        // speel.onclick = () => {ws.makeGame(attr.name.value,'test',attr.maxplayers.value,attr.boardinfo.value)};
        speel.onclick = () => {this.sendEvent()};
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
    sendEvent(){
        const evt = new CustomEvent('soloGame');
        document.dispatchEvent(evt);
    }





}
customElements.define('rt-game-menu', RtGameMenu);

export {RtGameMenu};
console.log('container.js loaded');