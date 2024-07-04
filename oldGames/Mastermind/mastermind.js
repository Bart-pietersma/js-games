import { importCss } from "../../functions.js";
import "./masterrow.js";
/*

todo add logic so the correct collor but incorect place works when the
*/
class MasterMind extends HTMLElement{
    constructor(){
        super();
        this.init = true;
        //check if we got rows and if not then set default rows and slots
        if(this.rows == 0){
            this.setAttribute('rows',12);
            this.setAttribute('slots',4);
        }
        this.colors = this.generateDistinctColors(this.colorCount);
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
                div.setAttribute('code',color);
                colorShowDiv.append(div);
            });
            this.append(colorShowDiv);
            this.init = false;
        }
    }

    // makeRandomColors(){
    //     const array = []
    //     while(array.length < this.colorCount){
    //         const color = "#" + Math.floor(Math.random()*16777215).toString(16);
    //         if(color.length == 7) array.push(color);
    //     }
    //     return array;
    // }


    generateRandomHSLColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 100; // Full saturation for vibrant colors
        const lightness = 50;   // Mid lightness for balance
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    
     colorDistance(color1, color2) {
        const [h1] = color1.match(/\d+/g).map(Number);
        const [h2] = color2.match(/\d+/g).map(Number);
    
        const dh = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));
        return dh;
    }
    
     generateDistinctColors(numColors, minDistance = 30, maxRetries = 1000) {
        const colors = [];
        let retries = 0;
        
        while (colors.length < numColors && retries < maxRetries) {
            const newColor = this.generateRandomHSLColor();
            if (colors.every(existingColor => this.colorDistance(existingColor, newColor) >= minDistance)) {
                colors.push(newColor);
            } else {
                retries++;
            }
        }
    
        if (colors.length < numColors) {
            console.warn(`Only generated ${colors.length} distinct colors after ${maxRetries} retries.`);
        }
    
        return colors;
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
        //check for corect spot otherwise check if color corect but incorect spot and if color is already in correct check
        const code =this.activeRow.code;
        let corect = [];
        let color = [];
        let i = 0;
        code.map(col =>{
            if(this.secret[i] == col)corect.push(col);
            i++
        });
        if(corect.length == this.slots)this.win();
        else{
            i = 0;
            code.map(col =>{
                console.log(col , this.secret[i]);
                console.log(this.secret[i] != col);
                console.log(this.secret.includes(col));
                //todo add the rules for 2 colors
                if(this.secret[i] != col && !corect.includes(col) && this.secret.includes(col)){
                    color.push(col);
                }
                i++;
            });
            console.log(corect,color);
            this.activeRow.setHints(corect.length,color.length);
            this.changeActiveRow();
        }
    }

    makeButton(){
        const btn = document.createElement('button');
        btn.innerText = `check`;
        btn.onclick = () => document.querySelector('master-mind').checkCode();
        return btn;
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
    
};
customElements.define("master-mind", MasterMind);
export{MasterMind}




// Example usage