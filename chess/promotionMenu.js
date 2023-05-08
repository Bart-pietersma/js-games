import { importCss } from "./functions.js";
class promotionMenu extends HTMLElement{
    constructor(fromCell,toCell){
        super()
        this.fromCell = fromCell;
        this.toCell = toCell;
    }

    connectedCallback(){
        importCss('chess-piece.css');

        this.setAttribute('promotion','queen,rook,bishop,knight');
        this.constructRadioButton(this.optionAttr);
        this.constructButton()
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }

    get board(){
        return this.closestElement('chess-board');
    }

    get optionAttr(){
        return Array.from(this.attributes).map(attr =>{
            if(!(attr.name == 'id' || attr.name == 'class')) return attr;
        }).filter(n => n)[0];
    }

    constructRadioButton(attr){
        attr.value.split(",").map(value =>{
            const input = document.createElement("input")
            input.id = attr.name+value;
            input.type = "radio";
            input.name = attr.name;
            input.checked = value == 'queen'? true : false;
            input.value = value[0] == 'k'? 'n': value[0];
            this.append(input);
            const label = document.createElement('label');
            label.htmlFor = attr.name+value;
            label.textContent = value;
            this.append(label);
        });
    }
    constructButton(){
        const input = document.createElement('input');
        input.type = "button";
        input.onclick = (e =>{this.buttonHandler()});
        input.value = 'submit';
        this.append(input);
    }

    buttonHandler(){
        const promotion = this.querySelector(`input:checked`).value
        this.board.moveHandler(this.toCell,this.fromCell,'click',promotion)
        this.remove();
    }
}
customElements.define('promotion-menu', promotionMenu);
export {promotionMenu};