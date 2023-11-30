//! stop its not worth the effort

import { PongBall } from "./ball.js";
import { Peddle } from "./peddle.js";

//container config
const width = 1780;
const height = width / 16 * 9;
const unit = 20;


// Initial ball position and speed
const velocity = 4;
let ballSpeedX = 2;
let ballSpeedY = 2;
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


class BreakoutContainer extends HTMLElement {
  constructor() {
    super();
    // ball and pedllle
    this.peddlle = new Peddle(paddleWidth, paddleHeight);
    this.ball = new PongBall(ballSize, ballSpeedX, ballSpeedY);
    this.runing = false;

    //set pressed keys to false
    this.isLeftKeyPressed = false;
    this.isRightKeyPressed = false;
  }

  connectedCallback() {
    this.append(...[this.ball, this.peddlle]);
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
    let ballX = this.ball.x +  ballSpeedX;
    let ballY = this.ball.y + ballSpeedY;

    console.log(this.elementPoint(ballX  , ballY +ballSize).nodeName);

    // Bounce off top and bottom
    if (ballY < 0 ) {
      ballSpeedY = -ballSpeedY;
    }
    // bounce of sizeds
    else if(ballX < 0 || ballX > this.width - ballSize){
      ballSpeedX = -ballSpeedX;
    }
    else if(ballY > this.height - ballSize){
      //we missed and drop below the paddle 
      //todo
    }
    //todo make more genral for blocks bounce of peddle
    else if(this.elementPoint(ballX +ballSize , ballY +ballSize).nodeName != 'BREAKOUT-CONTAINER' ){

      //we have a object in our path
      const obstacle = this.elementPoint(ballX  +ballSize, ballY + ballSize);
      if(obstacle == this.peddlle){
        //bounse of peddle
        //todo make bigger
        ballSpeedY = -ballSpeedY;
      }
      else{
        console.log('how we enterd here');
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