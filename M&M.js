const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let dog, dogImg, obstacles, score, gameOver, obstacleInterval;

// Obstacle image
const obstacleImg = new Image();
obstacleImg.src = "images/bone.png";

// Reset game
function resetGame(choice) {
  dog = { x: 50, y: 220, width: 50, height: 50, dy: 0, gravity: 1.5, jumpPower: -20, grounded: true };
  obstacles = [];
  score = 0;
  gameOver = false;
  dogImg = new Image();

  if (choice === "mango") {
    dogImg.src = "images/mango.jpg";
  } else {
    dogImg.src = "images/mocha.jpg";
  }
}

// Start game
function startGame(choice) {
  document.getElementById("characterSelect").style.display = "none";
  canvas.style.display = "block";

  resetGame(choice);

  if (obstacleInterval) clearInterval(obstacleInterval);

  obstacleInterval = setInterval(() => {
    if (!gameOver) {
      obstacles.push({ x: canvas.width, y: 240, width: 40, height: 40 });
    }
  }, 2000);

  requestAnimationFrame(gameLoop);
}

// Jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && dog && dog.grounded && !gameOver) {
    dog.dy = dog.jumpPower;
    dog.grounded = false;
  }
});

// Restart
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyR" && gameOver) {
    document.getElementById("characterSelect").style.display = "block";
    canvas.style.display = "none";
  }
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, 120);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + score, canvas.width / 2, 160);
    ctx.fillText("Press R to Restart", canvas.width / 2, 200);
    return;
  }

  // Ground
  ctx.fillStyle = "#6c4c3f";
  ctx.fillRect(0, 270, canvas.width, 30);

  // Dog physics
  dog.y += dog.dy;
  if (dog.y + dog.height >= 270) {
    dog.y = 220;
    dog.dy = 0;
    dog.grounded = true;
  } else {
    dog.dy += dog.gravity;
  }

  // Draw dog (Mango or Mocha)
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

  // Draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 6;
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

    // Collision
    if (
      dog.x < obs.x + obs.width &&
      dog.x + dog.width > obs.x &&
      dog.y < obs.y + obs.height &&
      dog.height + dog.y > obs.y
    ) {
      gameOver = true;
      clearInterval(obstacleInterval);
    }
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.x > -obs.width);

  // Score
  score++;
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 20, 30);

  requestAnimationFrame(gameLoop);
}
