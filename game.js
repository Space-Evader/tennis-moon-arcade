const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let paddleWidth = 150;
let paddleHeight = 20;
let playerPaddleX = (canvas.width - paddleWidth) / 2;
let opponentPaddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;

let rightPressed = false;
let leftPressed = false;

let playerScore = 0;
let opponentScore = 0;

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

function drawPaddle(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, paddleWidth, paddleHeight);
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
    ctx.fillText("Player: " + playerScore, 8, 20);
    ctx.fillText("Opponent: " + opponentScore, 8, 40);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = 2;
    ballDY = -2;
}

function moveOpponentPaddle() {
    if (ballX > opponentPaddleX + paddleWidth / 2) {
        opponentPaddleX += 3;  // Move to the right
    } else if (ballX < opponentPaddleX + paddleWidth / 2) {
        opponentPaddleX -= 3;  // Move to the left
    }
}

function updateBall() {
    ballX += ballDX;
    ballY += ballDY;

    // Ball bounces off the walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballDX = -ballDX;
    }

    // Ball bounces off the player's paddle
    if (ballY + ballRadius > canvas.height - paddleHeight - 10) {
        if (ballX > playerPaddleX && ballX < playerPaddleX + paddleWidth) {
            ballDY = -ballDY;
        } else {
            opponentScore++;
            resetBall();
        }
    }

    // Ball bounces off the opponent's paddle
    if (ballY - ballRadius < paddleHeight + 10) {
        if (ballX > opponentPaddleX && ballX < opponentPaddleX + paddleWidth) {
            ballDY = -ballDY;
        } else {
            playerScore++;
            resetBall();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle(playerPaddleX, canvas.height - paddleHeight - 10);
    drawPaddle(opponentPaddleX, 10);  // Opponent's paddle at the top
    drawBall();
    drawScore();

    updateBall();
    moveOpponentPaddle();

    if (rightPressed && playerPaddleX < canvas.width - paddleWidth) {
        playerPaddleX += 7;
    } else if (leftPressed && playerPaddleX > 0) {
        playerPaddleX -= 7;
    }

    requestAnimationFrame(draw);
}

draw();
