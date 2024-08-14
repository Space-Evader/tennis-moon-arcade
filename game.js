const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
let player;
let ball;
let score = 0;
let scoreText;

function preload() {
    this.load.image('ball', 'ball.png');
    this.load.image('paddle', 'paddle.png');
    this.load.image('background', 'background.png');
}

function create() {
    // Add background
    this.add.image(400, 300, 'background');

    // Create player paddle
    player = this.physics.add.image(400, 550, 'paddle').setImmovable();
    player.body.collideWorldBounds = true;

    // Create ball
    ball = this.physics.add.image(400, 300, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(150, 150);

    // Set up collision between ball and paddle
    this.physics.add.collider(ball, player, hitPaddle, null, this);

    // Set up input control
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
}

function update() {
    // Paddle movement
    if (this.cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
        player.setVelocityX(300);
    } else {
        player.setVelocityX(0);
    }

    // Check if ball is lost (ball goes below the paddle)
    if (ball.y > 600) {
        resetBall();
    }
}

function hitPaddle(ball, player) {
    // Increase score
    score += 10;
    scoreText.setText('Score: ' + score);

    // Add a bit of randomness to ball bounce angle
    let diff = 0;
    if (ball.x < player.x) {
        diff = player.x - ball.x;
        ball.setVelocityX(-10 * diff);
    } else if (ball.x > player.x) {
        diff = ball.x - player.x;
        ball.setVelocityX(10 * diff);
    }
}

function resetBall() {
    // Reset the ball to the center and reduce score
    ball.setPosition(400, 300);
    ball.setVelocity(150, 150);
    score -= 20;
    scoreText.setText('Score: ' + score);
}
