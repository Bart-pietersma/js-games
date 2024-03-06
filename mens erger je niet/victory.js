import {importCss , generateRandomHexCode} from "https://rtdb.nl/functions.js";

class VictoryScreen extends HTMLElement{
    constructor(msg = 'pimpelpaars'){
        super();
        this.msg = msg + ' heeft gewonen';
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
        this.append(...this.makeExplosion(420));
    }

    makeConfeti(amount = 120){

      const arr = [];
      for(let i = 0 ; i < amount ; i ++){
        const div = document.createElement('div');
        const style = div.style;
        div.toggleAttribute(`confeti`);
        style.left = Math.floor(Math.random() * 101)+'vw';
        style.top = (Math.floor(Math.random() * 101)-100)+'vh';
        style.backgroundColor = generateRandomHexCode();
        //make the 3 swings
        for(let i = 1 ; i<=3 ; i++){
                let randomNumber = Math.floor(Math.random() * 50) + 1; // Generate a random number between 1 and 50
                const isNegative = Math.random() < 0.5; // 50% chance to be negative
                randomNumber = isNegative ? -randomNumber : randomNumber;
                style.setProperty(`--swing${i}`, randomNumber+"px");
        }
        arr.push(div);
      }
        return arr;
    }

    makeExplosion(amount = 120){
      //make a animate to go from center to a side x , y met 100 om en om de 4 kanten aan te ketsen.
      const arr = [];

      for(let i = 0 ; i < amount; i ++){
        const div = document.createElement('div');
        const style = div.style;
        div.toggleAttribute(`explosion`);
        style.backgroundColor = generateRandomHexCode();
        const randomX =  Math.floor(Math.random() * 2) <1? Math.floor(Math.random() * window.innerWidth/2): Math.floor(Math.random() * window.innerWidth/2) * -1;
        const randomY = Math.floor(Math.random() * 2) <1? Math.floor(Math.random() * window.innerHeight/2): Math.floor(Math.random() * window.innerHeight/2) * -1;
        const sides = ['top', 'right', 'bottom', 'left'];
        const randomSide = sides[Math.floor(Math.random() * sides.length)];
        style.animationDelay = Math.floor(Math.random() * 2500)+'ms'; // Delay in milliseconds
    
        switch (randomSide) {
          case 'top':
            style.setProperty('--x' , +randomX+`px`);
            style.setProperty('--y' , `-55vh`)
            break;
          case 'right':
            style.setProperty(`--x`, `55vw`);
            style.setProperty('--y', randomY+'px');
            break;
          case 'bottom':
            style.setProperty(`--x`, randomX+'px');
            style.setProperty('--y', '55vh');
            break;
          case 'left':
            style.setProperty(`--x`, '-55vw');
            style.setProperty('--y', randomY+'px');
            break;
        }
        arr.push(div);

      }
        return arr
      }
    



}
customElements.define('victory-screen', VictoryScreen);
export {VictoryScreen};