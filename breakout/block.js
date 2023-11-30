class BreakoutBlock extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      console.log('Element connected to the DOM');
      // You can perform additional actions when the element is connected to the DOM
    }
  }
  
  // Define the custom element
  customElements.define('breakout-block', BreakoutBlock);
  export{BreakoutBlock};
  

      // Get game elements
      const ball = document.getElementById("ball");
      const paddle = document.getElementById("paddle");
      const blocks = document.querySelectorAll(".block");
   
      // Initial ball position and speed
      let ballX = 240;
      let ballY = 150;
      let ballSpeedX = 2;
      let ballSpeedY = -2;
   
      // Paddle configuration
      let paddleWidth = 80;
   
      // Set the initial left position of the paddle using JavaScript
      paddle.style.left = (480 - paddleWidth) / 2 + "px"; 
   
      // Keyboard input
      let rightPressed = false;
      let leftPressed = false;
   
      // Event listeners for keyboard input
      document.addEventListener("keydown", keyDownHandler);
      document.addEventListener("keyup", keyUpHandler);
   
      // Functions to handle keyboard input
      function keyDownHandler(e) {
          if (e.key == "Right" || e.key == "ArrowRight") {
              rightPressed = true;
          } else if (e.key == "Left" || e.key == "ArrowLeft") {
              leftPressed = true;
          }
      }
   
      function keyUpHandler(e) {
          if (e.key == "Right" || e.key == "ArrowRight") {
              rightPressed = false;
          } else if (e.key == "Left" || e.key == "ArrowLeft") {
              leftPressed = false;
          }
      }
   
   //!main loop
      function updateGame() {
          // Move the paddle based on keyboard input
          if (rightPressed && paddle.offsetLeft < 400) {
              paddle.style.left = paddle.offsetLeft + 5 + "px";
          } else if (leftPressed && paddle.offsetLeft > 0) {
              paddle.style.left = paddle.offsetLeft - 5 + "px";
          }
   
          // Update the ball position
          ballX += ballSpeedX;
          ballY += ballSpeedY;
   
          // Bounce off the walls
          if (ballX + ballSpeedX > 460 || ballX + ballSpeedX < 0) {
              ballSpeedX = -ballSpeedX;
          }
          if (ballY + ballSpeedY < 0) {
              ballSpeedY = -ballSpeedY;
          }
   
          // Check if the ball hits the paddle
          if (
              ballY + ballSpeedY > 290 &&
              ballY + ballSpeedY < 300 &&
              ballX + ballSpeedX > paddle.offsetLeft &&
              ballX + ballSpeedX < paddle.offsetLeft + paddleWidth
          ) {
              ballSpeedY = -ballSpeedY;
          }
   
          // Check for collisions with blocks
          for (let i = 0; i < blocks.length; i++) {
              if (
                  ballY + ballSpeedY < blocks[i].offsetTop + blocks[i].offsetHeight &&
                  ballY + ballSpeedY + 20 > blocks[i].offsetTop &&
                  ballX + ballSpeedX < blocks[i].offsetLeft + blocks[i].offsetWidth &&
                  ballX + ballSpeedX + 20 > blocks[i].offsetLeft
              ) {
                  // Collision with a block
                  ballSpeedY = -ballSpeedY;
                  blocks[i].style.display = "none"; // Hide the block
              }
          }
   
          // Game over if the ball goes below the paddle
          if (ballY + ballSpeedY > 320) {
              // alert("Game Over");
              // document.location.reload();
          }
   
          // Update the ball position on the screen
          ball.style.left = ballX + "px";
          ball.style.top = ballY + "px";
   
          // Repeat the updateGame function
          requestAnimationFrame(updateGame);
      }
   
      // Call the updateGame function to start the game
      updateGame();
   