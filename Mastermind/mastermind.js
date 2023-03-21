import { importCss } from "./functions.js";
import "./masterrow.js";
/*

<mastermind>
    <master-row>
        ::before corect colors
            4x <marker>
        ::after corect collors and place

*/
customElements.define("master-mind", class MasterMind extends HTMLElement{
    constructor(){
        super();
        this.init = true;
        this.colors = this.makeRandomColors();
        this.secret = this.makeSecretCode();
        
    }
    connectedCallback(){
        if(this.init){
            importCss("./mastermind.css");
            //setup layout
            for(let i = 0 ; i < this.rows ; i++){
                const row = document.createElement("master-row");
                row.setAttribute("slots", this.slots);
                this.append(row);
            }
            console.log(this.lastElementChild);
            this.lastElementChild.toggleActive();
            this.init = false;
        }
    }

    makeRandomColors(){
        const array = [];
        for(let i = 0; i< this.colorCount ; i++) {
           array.push("#" + Math.floor(Math.random()*16777215).toString(16));
        }
        return array;
    }

    makeSecretCode(){
       const numbers = [];
        while(numbers.length < this.slots){
            const i = Math.floor(Math.random() * this.colorCount);
            if(numbers.indexOf(i) == -1) numbers.push(i);
        }
        const array = [];
        for(const i of numbers){
            array.push(this.colors[i]);
        }
        return array;
    }

    checkCode(){
        const code =this.activeRow.code;
        let corect = 0;
        let color = 0;
        let i = 0;
        code.map(col =>{
            if(this.secret.includes(col)) color ++;
            if(this.secret[i] == col)corect ++
            i++
        });
        if(corect == this.slots){}//todo winn
        else{
            this.activeRow.setHints(color,corect);
            this.changeActiveRow();
        }
    }

    changeActiveRow(){
       const curent =  this.activeRow;
       const nextRow = this.activeRow.previousElementSibling;
       if(nextRow){
           curent.toggleActive();
           nextRow.toggleActive();
       }else{
        // end of game
        console.log("end of game");
       }
       return nextRow;
    }

    get slots(){
        return +this.getAttribute("slots");
    }
    get rows(){
        return +this.getAttribute("rows");
    }
    get colorCount(){
        return +this.getAttribute("colors");
    }

    get activeRow(){
        return this.querySelector(`[active]`);
    }
    
});

