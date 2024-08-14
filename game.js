const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let paddleWidth = 150;
let paddleHeight = 20;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballDX = 3;
let ballDY = -3;
let gravity = 0.2;
let bounceFactor = 0.7;

let rightPressed = false;
let leftPressed = false;

let playerScore = 0;
let opponentScore = 0;
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
    ctx.fillText("Player: " + tennisScore(playerScore), 8, 20);
    ctx.fillText("Opponent: " + tennisScore(opponentScore), 8, 40);
    ctx.fillText("Player Games Won: " + playerGamesWon, 8, 60);
    ctx.fillText("Opponent Games Won: " + opponentGamesWon, 8, 80);
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
    ballY = canvas.height - 50;
    ballDX = 3;
    ballDY = -3;
}

function updateScore(winner) {
    if (winner === 'player') {
        playerScore++;
    } else {
        opponentScore++;
    }

    if (playerScore >= 4 && playerScore - opponentScore >= 2) {
        playerGamesWon++;
        playerScore = 0;
        opponentScore = 0;
    } else if (opponentScore >= 4 && opponentScore - playerScore >= 2) {
        opponentGamesWon++;
        playerScore = 0;
        opponentScore = 0;
    }
}

function simulateBallPhysics() {
    ballDY += gravity;
    ballX += ballDX;
    ballY += ballDY;

    // Ball bounces off the ground
    if (ballY + ballRadius > canvas.height - paddleHeight - 10) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY * bounceFactor;
            updateScore('player');
        } else {
            resetBall();
            updateScore('opponent');
        }
    }

    // Ball hits the top wall
    if (ballY - ballRadius < 0) {
        ballDY = -ballDY;
    }

    // Ball hits the side walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballDX = -ballDX;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawBall();
    drawScore();
    simulateBallPhysics();

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}

draw();
