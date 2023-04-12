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
        console.log(this.secret);
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

            const colorShowDiv = document.createElement("div");
            colorShowDiv.id = "colorShowDiv";
            this.colors.map(color =>{
                const div = document.createElement('div');
                div.style.backgroundColor = color;
                colorShowDiv.append(div);
            });
            this.append(colorShowDiv);
            this.init = false;
        }
    }

    makeRandomColors(){
        const array = []
        while(array.length < this.colorCount){
            const color = "#" + Math.floor(Math.random()*16777215).toString(16);
            if(color.length == 7) array.push(color);
        }
        return array;
    }

    makeSecretCode(){
       const numbers = [];
        while(numbers.length < this.slots){
            const i = Math.floor(Math.random() * this.colorCount);
            if(numbers.indexOf(i) == -1) numbers.push(i);
            else{
                // now we have a repeat check if numbers have less than maximum alowed
               if(numbers.map(color =>{if(color === i)return 1;}).length <= this.slots /2)numbers.push(i);
            }
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
            if(this.secret[i] == col)corect ++
            else if(this.secret.includes(col)) color ++;
            i++
        });
        if(corect == this.slots)this.win();
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
        this.lost();
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
        return Math.round(this.slots * 1.5);
    }

    get activeRow(){
        return this.querySelector(`[active]`);
    }

    win(){
        window.alert("u won");
    }
    lost(){
        window.alert("u lost");
    }
    
});

