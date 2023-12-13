/*
ball
size 
speed x
spped y

*/

class PongBall extends HTMLElement {
    constructor(unit,velocity) {
      super();
      this.style.height = unit+'px';
      this.style.width = unit+'px';
      this.velocity = velocity;
      this.speedX = velocity/2;
      this.speedY = velocity/2;
      this.size = unit ;
    }
  
    connectedCallback() {
      console.log('Element connected to the DOM');
      //center ball in the middle and 2/3 from top  
      this.setStartLocation()
    }
    
    setStartLocation(){
      this.style.left = Math.round((this.parentElement.width - this.clientWidth) /2)+'px';
        this.style.top = Math.round((this.parentElement.height - this.clientHeight) /3) *2+'px';
    }

    get x(){
      return +this.style.left.substring(0,this.style.left.length-2);
    }

    get y(){
      return +this.style.top.substring(0,this.style.top.length-2);
    }

    get nextX(){
      return  this.x +  this.speedX;
    }

    get nextY(){
      return this.y + this.speedY;
    }

    get sideX() {
      return this.nextX +(this.right?this.size +0 : -0);
    }
  
    get sideY(){
      return this.nextY +(this.bottom? this.size +0:-0);
    }

    get nextCood(){
      const bount = this.getBoundingClientRect();
      const x = Math.round(bount.left + (this.right?this.size : 0));
      const y = Math.round(bount.top + (this.bottom? this.size:0));
      return [x,y];
    }
  
    get left(){
      return this.speedX < 0? true : false;
    }
    get right (){
      return this.speedX > 0? true : false;
    }
    get top (){
      return this.speedY < 0? true : false;
    }
    get bottom(){
      return this.speedY > 0? true : false;
    }

  }



  
  // Define the custom element
  customElements.define('pong-ball', PongBall);
  
export{PongBall};