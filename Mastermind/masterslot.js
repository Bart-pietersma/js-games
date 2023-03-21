customElements.define("master-slot" , class MasterSlot extends HTMLElement{
    constructor(){
        super();
        this.init = true;
    }

    connectedCallback(){
        if(this.init){
            //setup layout
            this.setAttribute("color" , "");
            // add klick listners
            this.addEventListener("click", e => this.leftClick(e));
            this.addEventListener("contextmenu", e => this.rigtClick(e));
            this.init = false;
        }        
    }

    get active(){
        return this.row.hasAttribute("active");
    }

    get color(){
        return +this.getAttribute('color');
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
    get row(){
        return this.closestElement("master-row");
    }

    changeColor(operator = 1){
        let index = this.color + operator;
        if(index < 1)index = this.board.colorCount -1;
        else if(index +1 > this.board.colors.length) index = 0;
        console.log(index);
        this.style.backgroundColor = this.board.colors[index];
        this.setAttribute('color', index);
    }

    leftClick(e){
        if(this.active){
            this.changeColor();
        }
    }
    rigtClick(e){
        e.preventDefault() ;
        if(this.active){
            this.changeColor(-1);
        }
    }
});
