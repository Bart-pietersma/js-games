import "./masterslot.js";

customElements.define("master-row" , class MasterRow extends HTMLElement{
    constructor(){
        super();
        this.init = true;
        this.hint1 = document.createElement('div');
        this.hint1.toggleAttribute(`hint1`);
        this.hint2 = document.createElement('div');
        this.hint2.toggleAttribute(`hint2`)
    }

    connectedCallback(){
        if(this.init){
            //setup layout
            // importCss("./mastermind.css");
            this.append(this.hint1);
            for(let i = 0 ; i < this.slotCount ; i++){
                this.append(document.createElement("master-slot"));
            }
            this.append(this.hint2);
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
        if(bool){
            //check if the button existest if not make it and place if
            if(!this.board.querySelector('button')){
                this.hint2.append(this.board.makeButton());
            }
            else{
                //button should be in the row bellow animate it to this row
                
            }
        }
        return this.toggleAttribute("active" , bool);
    }

    setHints(corect,color){
        // this.setAttribute("hint1",color);
        // this.setAttribute("hint2",corect );
        this.hint1.innerText = color;
        this.hint2.innerText = corect
    }

});