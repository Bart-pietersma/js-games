const ball = document.querySelector('.ball');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const gameContainer = document.querySelector('.game-container');
const leftScoreElement = document.getElementById('leftScore');
const rightScoreElement = document.getElementById('rightScore');

const gameWidth = 600;
const gameHeight = 400;
const paddleWidth = 10;
const paddleHeight = 80;
const paddleSpeed = gameHeight/paddleHeight*1.5;
const ballSize = 20;

let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballSpeedX = 5;
let ballSpeedY = 2;
let ballSpeedIncrement = 1;
let rightPaddleY = gameHeight / 2 - paddleHeight / 2;
let leftPaddleY = gameHeight / 2 - paddleHeight / 2;
let leftScore = 0;
let rightScore = 0;
let isGamePaused = false;
let isUpKeyPressed = false;
let isDownKeyPressed = false;
let isUpLeftKeyPressed = false;
let isDownLeftKeyPressed = false;
function update() {
    if (isGamePaused) {
        return;
    }

    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top and bottom
    if (ballY < 0 || ballY > gameHeight - ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    // Bounce off paddles
    if (
        (ballX < paddleWidth && ballY + ballSize / 2 > leftPaddleY && ballY - ballSize / 2 < leftPaddleY + paddleHeight) ||
        (ballX > gameWidth - paddleWidth - ballSize && ballY + ballSize / 2 > rightPaddleY && ballY - ballSize / 2 < rightPaddleY + paddleHeight)
    ) {
        const paddle = ballX < gameWidth / 2 ? leftPaddle : rightPaddle;
        const paddleCenterY = paddle.offsetTop + paddle.offsetHeight / 2;
        const relativeIntersectY = ballY - paddleCenterY;
        const normalizedRelativeIntersectY = (relativeIntersectY / (paddleHeight / 2));


        // Adjust ballSpeedY based on the angle of attack
        ballSpeedY = normalizedRelativeIntersectY * 5; // You can adjust the multiplier for the desired effect
        ballSpeedX = -ballSpeedX;
        ballSpeedX > 0 ? ballSpeedX += ballSpeedIncrement : ballSpeedX -= ballSpeedIncrement; // Increase speed after collision
    }

    // Check for scoring
    if (ballX < 0) {
        // Right player scores
        rightScore++;
        updateScoreboard();
        resetBall();
    } else if (ballX > gameWidth) {
        // Left player scores
        leftScore++;
        updateScoreboard();
        resetBall();
    }

    // Update ball position on the screen
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Update right paddle position
    if (isUpLeftKeyPressed && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    }
    if (isDownLeftKeyPressed && leftPaddleY < gameHeight - paddleHeight) {
        leftPaddleY += paddleSpeed;
    }

    if (isUpKeyPressed && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    }
    if (isDownKeyPressed && rightPaddleY < gameHeight - paddleHeight) {
        rightPaddleY += paddleSpeed;
    }

    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
    
}

function resetBall() {
    ballX = 300;
    ballY = 200;
    ballSpeedX = -5; // Reset speed
    ballSpeedY = 2;
}

function updateScoreboard() {
    leftScoreElement.textContent = leftScore;
    rightScoreElement.textContent = rightScore;
}

// Function to handle keydown events for the right paddle
function handleKeyDown(e) {
    if (isGamePaused) {
        return;
    }

    if (e.keyCode === 38) {
        isUpKeyPressed = true;
    } else if (e.keyCode === 40) {
        isDownKeyPressed = true;
    }
    if (e.keyCode === 87) { // W key
        isUpLeftKeyPressed = true;
    } else if (e.keyCode === 83) { // S key
        isDownLeftKeyPressed = true;
    }
}

// Function to handle keyup events for the right paddle
function handleKeyUp(e) {
    if (isGamePaused) {
        return;
    }

    if (e.keyCode === 38) {
        isUpKeyPressed = false;
    } else if (e.keyCode === 40) {
        isDownKeyPressed = false;
    }
    if (e.keyCode === 87) { // W key
        isUpLeftKeyPressed = false;
    } else if (e.keyCode === 83) { // S key
        isDownLeftKeyPressed = false;
    }
}

// Event listeners for keydown and keyup events
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Function to update the left paddle position based on the mouse position
function updateLeftPaddle(e) {
    if (isGamePaused) {
        return;
    }

    const mouseY = e.clientY - gameContainer.getBoundingClientRect().top - leftPaddle.offsetHeight / 2;
    leftPaddle.style.top = Math.min(320, Math.max(0, mouseY)) + 'px';
}

// Event listener to update the left paddle position when the mouse is moved
gameContainer.addEventListener('mousemove', updateLeftPaddle);

// Event listener to pause the game when the mouse leaves the game container
gameContainer.addEventListener('mouseleave', () => {
    isGamePaused = true;
});

// Event listener to resume the game when the mouse enters the game container
gameContainer.addEventListener('mouseenter', () => {
    isGamePaused = false;
    // Reset the paddles to their initial positions
    leftPaddle.style.top = '160px';
    rightPaddle.style.top = '160px';
});

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
