const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const courtLeft = 100;  // Left boundary of the tennis court in the image
const courtRight = canvas.width - 100;  // Right boundary
const courtTop = 100;  // Top boundary
const courtBottom = canvas.height - 100;  // Bottom boundary

let paddleWidth = 100;
let paddleHeight = 20;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 3;
let ballDY = 3;

let rightPressed = false;
let leftPressed = false;

let playerScore = 0;
let gameScore = [0, 0];  // Store current game score [player, opponent]
let playerGamesWon = 0;
let opponentGamesWon = 0;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + tennisScore(gameScore[0]), 8, 20);
    ctx.fillText("Games Won: " + playerGamesWon, 8, 40);
    ctx.fillText("Opponent Games Won: " + opponentGamesWon, 8, 60);
}

function tennisScore(points) {
    switch (points) {
        case 0: return "0";
        case 1: return "15";
        case 2: return "30";
        case 3: return "40";
        case 4: return "Adv";
        default: return "Game";
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = 3;
    ballDY = 3;
}

function updateScore(winner) {
    if (winner === 'player') {
        gameScore[0]++;
    } else {
        gameScore[1]++;
    }

    if (gameScore[0] >= 4 && gameScore[0] - gameScore[1] >= 2) {
        playerGamesWon++;
        gameScore = [0, 0];  // Reset game score
    } else if (gameScore[1] >= 4 && gameScore[1] - gameScore[0] >= 2) {
        opponentGamesWon++;
        gameScore = [0, 0];  // Reset game score
    }
}

function collisionDetection() {
    // Ball hits bottom, the player loses the point
    if (ballY + ballDY > courtBottom - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
            updateScore('player');
        } else {
            resetBall();
            updateScore('opponent');
        }
    }

    // Ball hits top or sides, bounce back
    if (ballY + ballDY < courtTop + ballRadius) {
        ballDY = -ballDY;
    }
    if (ballX + ballDX > courtRight - ballRadius || ballX + ballDX < courtLeft + ballRadius) {
        ballDX = -ballDX;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawBall();
    drawScore();
    collisionDetection();

    ballX += ballDX;
    ballY += ballDY;

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}

draw();
