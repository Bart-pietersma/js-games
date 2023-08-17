import { MenuButton } from "./customButton.js"

class Menu extends HTMLElement{
    constructor(){
        super()

    }
    
    connectedCallback(){

    }

}

class MainMenu extends Menu {
    constructor(){
        super()
    }

    connectedCallback(){
        this.append(new MenuButton('newgame'));
    }

}
customElements.define(`main-menu`,MainMenu)

class optionmenu extends Menu{
    constructor(arr){
        super()
        //arr with all the optionbuttons
    }


}
customElements.define(`option-menu`,optionmenu);



export {optionmenu,MainMenu};