import "./masterslot.js";

customElements.define("master-row" , class MasterRow extends HTMLElement{
    constructor(){
        super();
        this.init = true;
    }

    connectedCallback(){
        if(this.init){
            //setup layout
            // importCss("./mastermind.css");
            for(let i = 0 ; i < this.slotCount ; i++){
                this.append(document.createElement("master-slot"));
            }
            this.init = false;
        }
    }

    closestElement(selector, el = this) {
        return (
            (el && el != document && el != window && el.closest(selector)) ||
            this.closestElement(selector, el.getRootNode().host)
        );
    }
    get board() {
        return this.closestElement("master-mind");
    }

    get slotCount(){
        return +this.getAttribute("slots");
    }

    get slots(){
        return Array.from(this.querySelectorAll(`master-slot`));
    }

    get code(){
        return  this.slots.map(slot =>{return this.board.colors[slot.color];});
    }

    toggleActive(bool = !this.hasAttribute("active")){
        return this.toggleAttribute("active" , bool);
    }

    setHints(corect,color){
        this.setAttribute("hint1",color);
        this.setAttribute("hint2",corect );
    }

});