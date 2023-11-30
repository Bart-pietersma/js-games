/*
ball
size 
speed x
spped y

*/

class PongBall extends HTMLElement {
    constructor(unit,speedx,speedy) {
      super();
      this.style.height = unit+'px';
      this.style.width = unit+'px';
    }
  
    connectedCallback() {
      console.log('Element connected to the DOM');
      //center ball in the middle and 2/3 from top  
      this.setStartLocation()
    }
    
    setStartLocation(){
      this.style.left = (this.parentElement.width - this.clientWidth) /2+'px';
        this.style.top = (this.parentElement.height - this.clientHeight) /3 *2+'px';
    }

    get x(){
      return +this.style.left.substring(0,this.style.left.length-2);
    }

    get y(){
      return +this.style.top.substring(0,this.style.top.length-2);
    }

  }

  
  // Define the custom element
  customElements.define('pong-ball', PongBall);
  
export{PongBall};