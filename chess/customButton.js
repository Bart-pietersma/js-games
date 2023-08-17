class MenuButton extends HTMLElement {
    constructor(btntype){
        super()

        switch(btntype){
            case (`newgame` || `newGame`):
                this.id = 'newgame';
                this.innerText = 'new game';
                this.onclick = this.btnNewGame;
            break;
            case 'joinGame':
                this.id = 'newgame';
                this.innerText = 'new game';
                this.onclick = this.btnNewGame;
            break;
        }
    }

    connectedCallback() {

    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    get ws(){
        return this.closestElement(`game-container`).ws;
    }


    //btn functions
    btnNewGame(e){
        //the this for the funtion is button so wen need to pass the button to 
        //send ws call to newgame
        //
        console.log('newgame btn pressed');
        this.ws.makeGame();
    }

}
customElements.define(`custom-button`, MenuButton);
export { MenuButton}