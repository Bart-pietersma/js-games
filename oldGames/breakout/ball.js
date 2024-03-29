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

    get centerCoords(){
      const rect = this.getBoundingClientRect();
      const x = rect.x + rect.width/2;
      const y = rect.y + rect.height/2;
    return {x,y}
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

    get sides(){
      //return 3 corner coords with next locatioin
      const point1 = [this.nextX , this.nextY];
      const point2 = [this.nextX + this.size , this.nextY];
      const point3 = [this.nextX + this.size , this.nextY + this.size];
      const point4 = [this.nextX , this.nextY + this.size];
      const arr = [point1,point2,point3,point4];

      //remove the 4th marker since it wil only spot the ball itself;
      let elementToRemove = ''
      switch(true){
        case this.left && this.top:
          elementToRemove = point3
        break;
        case this.left && this.bottom :
          elementToRemove = point2
        break;
        case this.right && this.top:
          elementToRemove = point4
        break;
        case this.right && this.bottom:
          elementToRemove = point1
        break;
      }

      return arr.filter(item => item !== elementToRemove);
    }

    get coord(){
      let obj = [];

      const bound = this.getBoundingClientRect();
      const r = bound.width/2
      const x = bound.x + r;
      const y = bound.y + r;
      const ass = Math.abs(this.speedX)>Math.abs(this.speedY)? 'x' : 'y';

      // check bigest movement 
      //fill with coords and a extra pixel
      if(this.left && ass == 'x')   obj = [x - r - 1,y];
      if(this.right && ass == 'x')  obj = [x +r +1,y];
      if(this.top && ass == 'y')    obj = [x,y-r-1];
      if(this.bottom && ass == 'y') obj = [x , y+r+1];

      return obj;
    }

    get nextCood(){
      const bount = this.getBoundingClientRect();
      const x = Math.round(bount.left + (this.right?this.size : 0) +this.speedX);
      const y = Math.round(bount.top + (this.bottom? this.size:0) + this.speedY);
      return [x,y];
    }

    get dir(){
      return (this.speedX < 0? 'left.' : 'right.') + (this.speedY < 0? 'top' : 'bottom');
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