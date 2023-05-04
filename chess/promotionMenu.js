import { importCss } from "./functions.js";
class promotionMenu extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        importCss('chess-piece.css');

        this.setAttribute('promotion','queen,rook,bishop,knight');
        this.constructRadioButton(this.optionAttr);
    }

    get optionAttr(){
        return Array.from(this.attributes).map(attr =>{
            if(!(attr.name == 'id' || attr.name == 'class')) return attr;
        }).filter(n => n)[0];
    }

    constructRadioButton(attr){
        console.log(attr.name);
        attr.value.split(",").map(value =>{
            const input = document.createElement("input")
            input.id = attr.name+value;
            input.type = "radio";
            input.name = attr.name;
            input.checked = value == 'queen'? true : false;
            input.value = value;
            this.append(input);
            const label = document.createElement('label');
            label.htmlFor = attr.name+value;
            label.textContent = value;
            this.append(label);
        });
    }

    //todo make Button

}
customElements.define('promotion-menu', promotionMenu);
export {promotionMenu};