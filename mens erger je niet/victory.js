import {importCss , generateRandomHexCode} from "https://rtdb.nl/functions.js";

class VictoryScreen extends HTMLElement{
    constructor(msg = 'hello test has won'){
        super();
        this.msg = msg;
    }

    connectedCallback(){
        importCss()
        this.build();
    }

    build(){
        // wat is needed 
        // msg display
        //mimicing a alert
        const msgDiv = document.createElement(`div`);
        msgDiv.innerText = this.msg;
        msgDiv.id = 'msg';
        this.append(msgDiv);

        //set confeti
        const arr = [];
        for(let i = 0; i < 120 ; i++){
            arr.push(this.makeConfeti());
        }
        this.append(...arr);
    }

    makeConfeti(){
        const div = document.createElement('div');
        const style = div.style;
        div.toggleAttribute(`confeti`);
        style.left = Math.floor(Math.random() * 101)+'vw';
        style.top = (Math.floor(Math.random() * 51)-50)+'vh';
        style.backgroundColor = generateRandomHexCode();
        //make the 3 swings
        for(let i = 1 ; i<=3 ; i++){
                let randomNumber = Math.floor(Math.random() * 50) + 1; // Generate a random number between 1 and 50
                const isNegative = Math.random() < 0.5; // 50% chance to be negative
                randomNumber = isNegative ? -randomNumber : randomNumber;
                style.setProperty(`--swing${i}`, randomNumber+"px");
        }
        return div;
    }
}
customElements.define('victory-screen', VictoryScreen);
export {VictoryScreen};