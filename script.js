const BALL_SPEED_MULTIPLYER = 1.0002;

const Game = {
  scoreboard: document.querySelector('.score.points'),
  leftPaddle: document.querySelector('.paddle.left'),
  rightPaddle: document.querySelector('.paddle.right'),
  ball: document.querySelector('.ball'),
  lastFrameTime: null,
  playerOneScore: 0,
  playerTwoScore: 0,
  leftPaddlePos: 50,
  rightPaddlePos: 50,
  ballX: 0,
  ballY: 0,
  ballXDir: 0,
  ballYDir: 0,
  ballSpeed: 0,
  hue: 200,

  init() {
    // Resets the ball's position and speed
    Game.resetBall();

    // Listens to the mousemove event
    document.addEventListener('mousemove', e => Game.onMouseMove(e));

    // Starts the game loop
    window.requestAnimationFrame(Game.frame);
  },
  
  frame(time) {
    if (Game.lastFrameTime) {
      const timeDelta = time - Game.lastFrameTime;
      
      // Function to be called each frame
      Game.updateColor(timeDelta);
      Game.updateScore();
      Game.updateBall(timeDelta);
      Game.updatePaddle(timeDelta);
    }

    // Stores the current time
    Game.lastFrameTime = time;
    // Request another frame
    window.requestAnimationFrame(Game.frame);
  },

  updateColor(timeDelta) {
    Game.hue += 0.01 * timeDelta;
    if (Game.hue > 360) {
      Game.hue = 0;
    }

    document.documentElement.style.setProperty('--hue', Math.floor(Game.hue));
  },

  updateScore() {
    Game.scoreboard.textContent = `${Game.playerOneScore} | ${Game.playerTwoScore}`;
  },

  resetBall() {
    // Resets the right paddle to the middle of the screen
    Game.rightPaddlePos = 50;

    // Reset the ball to the middle of the screen
    Game.ballX = 50;
    Game.ballY = 50;

    // Resets the ball's speed
    Game.ballSpeed = 0.03;

    // Calculate a random direction for the ball
    Game.ballXDir = 0;
    while (Math.abs(Game.ballXDir) < 0.2 || Math.abs(Game.ballXDir) > 0.8) {
      const direction = Math.random() * 2 * Math.PI;

      Game.ballXDir = Math.cos(direction);
      Game.ballYDir = Math.sin(direction);
    }
  },
  
  updateBall(timeDelta) {
    // Updates the ball's position by the speed
    Game.ballX += Game.ballXDir * Game.ballSpeed * timeDelta;
    Game.ballY += Game.ballYDir * Game.ballSpeed * timeDelta;

    // Increases the ball speed
    Game.ballSpeed *= BALL_SPEED_MULTIPLYER;

    // Set the new position
    Game.ball.style.setProperty('--x', Game.ballX);
    Game.ball.style.setProperty('--y', Game.ballY);
    
    // Check for collisions
    Game.checkBallCollision();
  },

  checkBallCollision() {
    // Get the elements' bounding rect
    const ballRect = Game.ball.getBoundingClientRect();
    const paddleRects = [
      Game.leftPaddle.getBoundingClientRect(),
      Game.rightPaddle.getBoundingClientRect()
    ];

    // Check if the ball colided to the left wall
    if (ballRect.left <= 0) {
      Game.playerTwoScore += 1;
      Game.resetBall();
      return;
    }

    // Check if the ball colided to the right wall
    if (ballRect.right >= window.innerWidth) {
      Game.playerOneScore += 1;
      Game.resetBall();
      return;
    }

    // Check if the ball colided to the top or bottom walls
    if (ballRect.top <= 0 || ballRect.bottom >= window.innerHeight) {
      Game.ballYDir *= -1;
    }

    const paddleColide = paddleRects.some(paddleRect => (
      paddleRect.left <= ballRect.right &&
      paddleRect.right >= ballRect.left &&
      paddleRect.top <= ballRect.bottom &&
      paddleRect.bottom >= ballRect.top
    ));

    // If the ball collided to a paddle, invert the x direction
    if (paddleColide) {
      Game.ballXDir *= -1;
    }
  },

  onMouseMove(e) {
    // Reads the mouse position and updates the left paddle position according to it
    const position = e.clientY;
    const height = window.innerHeight;
    Game.leftPaddlePos = 100 * position / height;
  },

  updatePaddle(timeDelta) {
    // Increments the right paddle position
    Game.rightPaddlePos += 0.005 * timeDelta * (Game.ballY - Game.rightPaddlePos);

    // Assures the position is between 0 and 100
    if (Game.rightPaddlePos < 0) {
      Game.rightPaddlePos = 0;
    }
    if (Game.rightPaddlePos > 100) {
      Game.rightPaddlePos = 100;
    }

    // Apply both paddles' positions
    Game.leftPaddle.style.setProperty('--pos', Game.leftPaddlePos);
    Game.rightPaddle.style.setProperty('--pos', Game.rightPaddlePos);
  }
}

Game.init();