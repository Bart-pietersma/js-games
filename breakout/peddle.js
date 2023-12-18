class Peddle extends HTMLElement {
    constructor(width,height) {
      super();
      this.style.width = width+'px';
      this.style.height = height+'px';


    }
  
    connectedCallback() {
      this.setStartlocation()
    }

    setStartlocation(){
      this.style.left = (this.parentElement.width - this.clientWidth) /2 +'px'
    }



    get left(){
      return +this.style.left.substring(0,this.style.left.length-2);
    }

    handleCollision(ball){
      //find the impactpoint eg 49
      const impactpoint = ball.sideX - this.left;
      //make the impact point a nmbr range from -1 to 1;
      let range = 0.0;
      let halfbar = this.clientWidth/2;
      if (impactpoint < halfbar){
        //we hit left side of peddlle so range nmb is -1 to 0;
        range = (1-impactpoint  / halfbar)*-1;
        if(range <-0.9) range = -0.9;
      }
      else{
        //hit the right side of the peddle so range is 0 to 1;
        range = (impactpoint - halfbar) /halfbar ; 
        if(range > 0.9)range = 0.9;
      }
      ball.speedX = ball.velocity * range > ball.velocity-1? ball.velocity-1 : ball.velocity * range ;
      ball.speedY = (ball.velocity - Math.abs(ball.speedX)) *-1;
    }

}
  
  // Define the custom element
  customElements.define('game-peddle', Peddle);
  export{Peddle};