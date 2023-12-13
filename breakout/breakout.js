//! stop its not worth the effort

import { PongBall } from "./ball.js";
import { BreakoutBlock } from "./block.js";
import { BreakoutRow } from "./blockrow.js";
import { Peddle } from "./peddle.js";

//container config
const width = 1780;
const height = width / 16 * 9;
const unit = 20;


// Initial ball position and speed
const velocity = 6;
let ballSpeedX = velocity/2;
let ballSpeedY = velocity/2;
const ballSize = unit * 1;

// Paddle configuration
const paddleWidth = unit * 8;
const paddleHeight = unit * 1;
const paddleSpeed = unit / 2;

let isLeftKeyPressed = false;
let isRightKeyPressed = false;

//block configuration
const blockWidth = unit * 4;
const blockHeight = unit * 2;

//temp 
const lvl1 = [3,2,2,1,3,2,2,1,3,2,2,1,3,2,2,1,3,2,2,1,3,2,2];

function areColliding(rectangle, circle) {
  const rect = rectangle.getBoundingClientRect();
  const circleRect = circle.getBoundingClientRect();

  const circleCenterX = circleRect.left + circleRect.width / 2;
  const circleCenterY = circleRect.top + circleRect.height / 2;

  const rectClosestX = Math.max(rect.left, Math.min(circleCenterX, rect.right));
  const rectClosestY = Math.max(rect.top, Math.min(circleCenterY, rect.bottom));

  const distanceX = circleCenterX - rectClosestX;
  const distanceY = circleCenterY - rectClosestY;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  return distance < circleRect.width / 2;
}


class BreakoutContainer extends HTMLElement {
  constructor() {
    super();
    // ball and pedllle
    this.peddlle = new Peddle(paddleWidth, paddleHeight);
    this.ball = new PongBall(ballSize, velocity);
    this.runing = false;

    //set pressed keys to false
    this.isLeftKeyPressed = false;
    this.isRightKeyPressed = false;
  }

  connectedCallback() {
    this.append(...[this.ball, this.peddlle]);
      lvl1.forEach( row =>  {
        this.append(new BreakoutRow(blockWidth,row));
      });

    this.resize();

    //eventlistners
    window.addEventListener('resize', e => this.resize(e));
    document.addEventListener('keydown', e => this.handleKeyDown(e));
    document.addEventListener('keyup', e => this.handleKeyUp(e));


    //start animationloop
    this.mainloop();
  }

 
  mainloop() {
    this.runing = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  stopLoop() {
    this.runing = false;
  }

  animate() {
    if (!this.runing) {
      return;
    }
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // Your loop logic goes here

    //ball movement
    // Update ball position
    let ballX = this.ball.nextX;
    let ballY = this.ball.nextY;

    // console.log(this.elementPoint(ballX +(this.ball.right?ballSize : 0) , ballY +(this.ball.bottom? ballSize:0)).nodeName);

    // Bounce off top
    if (ballY < 0 ) {
     this.ball.speedY = -this.ball.speedY;
    }
    // bounce of sizeds
    else if(ballX < 0 || ballX > this.width - ballSize){
      this.ball.speedX = -this.ball.speedX;
    }
    else if(ballY > this.height - ballSize){
      //we missed and drop below the paddle 
      //todo
     this.ball.speedY = -this.ball.speedY;
    }
    //todo make more genral for blocks bounce of peddle
    else if(this.elementPoint(this.ball.sideX , this.ball.sideY).nodeName != 'BREAKOUT-CONTAINER' ){
      
      //we have a object in our path
      const obstacle = this.elementPoint(this.ball.sideX, this.ball.sideY);
      if(obstacle == this.peddlle){
        //bounse of peddle
        //todo make angle calc
        this.peddlle.handleCollision(this.ball);
        // if(this.ball.bottom) this.ball.speedY = -this.ball.speedY;
      }
      else if(obstacle.nodeName == 'BREAKOUT-BLOCK'){
        obstacle.lives --;
        switch(obstacle.getClosestSide(this.ball.nextCood)){
          case 'top':
            this.ball.speedY = -this.ball.speedY;
          break;
          case 'bottom':
            this.ball.speedY = -this.ball.speedY;
          break;
          case'left':
          this.ball.speedX = -this.ball.speedX;
          break;
          case'right':
          this.ball.speedX = -this.ball.speedX;
          break;
        }
      }
      else if(obstacle.nodeName == 'BREAKOUT-ROW'){

      }
      else{
        console.log('how we enterd here', obstacle);
      }
    }

    // Update ball position on the screen
    this.ball.style.left = ballX + 'px';
    this.ball.style.top = ballY + 'px';

    //end ball movement

    //peddle movement
    //move left
    if (isLeftKeyPressed && !isRightKeyPressed && this.peddlle.left > 0) {
      let change = this.peddlle.left - paddleSpeed;
      if (change < 0) change = 0;
      this.peddlle.style.left = change + 'px';
    }

    //move right
    if (isRightKeyPressed && !isLeftKeyPressed && this.peddlle.left < (this.width - this.peddlle.clientWidth)) {
      let change = this.peddlle.left + paddleSpeed;
      if (change > (this.width - this.peddlle.clientWidth)) change = this.width - this.peddlle.clientWidth;
      this.peddlle.style.left = change + 'px';
    }
    //end peddle movement



    this.lastFrameTime = currentTime;

    // Call requestAnimationFrame recursively
    requestAnimationFrame(() => this.animate());
  }

  elementPoint(x,y){
    const element = document.elementFromPoint(x + this.getBoundingClientRect().left, y + this.getBoundingClientRect().top);
    return element;
  }


  handleKeyDown(e) {
    // check wich key is being hold down
    if (e.keyCode === 37 || e.keyCode === 65) { // arrow left and A key
      isLeftKeyPressed = true;
    }
    else if (e.keyCode === 39 || e.keyCode === 68) { //arrow right and D key
      isRightKeyPressed = true;
    }
    // so we can pause and cuntinu with pressing p
    else if(e.keyCode == 80) this.runing ? this.stopLoop() : this.mainloop();
  }
  handleKeyUp(e) {
    if (e.keyCode === 37 || e.keyCode === 65) { // arrow left and A key
      isLeftKeyPressed = false;
    }
    else if (e.keyCode === 39 || e.keyCode === 68) { //arrow right and D key
      isRightKeyPressed = false;
    }
  }

  resize(e) {
    this.width = Math.floor(this.clientWidth);
    this.height = Math.floor(this.clientHeight);
    //todo more ?
    this.peddlle.setStartlocation();
    this.ball.setStartLocation();
  }
}

// Define the custom element
customElements.define('breakout-container', BreakoutContainer);