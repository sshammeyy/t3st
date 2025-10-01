const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let dog, dogImg, obstacles, score, gameOver, obstacleInterval, obstacleSpeed;
let floorX = 0;

// Obstacle image
const obstacleImg = new Image();
obstacleImg.src = "images/bone.png";

// Restart button
const restartBtn = document.createElement("button");
restartBtn.innerText = "🔄 Restart";
restartBtn.style.display = "none";
restartBtn.style.padding = "10px 20px";
restartBtn.style.fontSize = "18px";
restartBtn.style.marginTop = "10px";
restartBtn.style.cursor = "pointer";
restartBtn.onclick = restartGame;
document.body.appendChild(restartBtn);

// Reset game
function resetGame(choice) {
  dog = { 
    x: 50, 
    y: 220, 
    width: 50, 
    height: 50, 
    dy: 0, 
    gravity: 1.5, 
    jumpPower: -20, 
    grounded: true 
  };
  obstacles = [];
  score = 0;
  gameOver = false;
  obstacleSpeed = 6;
  floorX = 0;

  dogImg = new Image();
  dogImg.src = choice === "mango" ? "images/mango.jpg" : "images/mocha.jpg";

  restartBtn.style.display = "none";
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

// Jump function
function jump() {
  if (dog && dog.grounded && !gameOver) {
    dog.dy = dog.jumpPower;
    dog.grounded = false;
  }
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
canvas.addEventListener("mousedown", jump);
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); jump(); }, { passive: false });

// Restart with R key
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyR" && gameOver) restartGame();
});

// Restart function
function restartGame() {
  document.getElementById("characterSelect").style.display = "block";
  canvas.style.display = "none";
  resetGame("mango"); // default choice
  loop();
}

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
    restartBtn.style.display = "inline-block";
    return;
  }

  // Move floor
  floorX -= obstacleSpeed;
  if (floorX <= -canvas.width) floorX = 0;

  // Draw moving floor
  ctx.fillStyle = "#6c4c3f";
  ctx.fillRect(floorX, 270, canvas.width, 30);
  ctx.fillRect(floorX + canvas.width, 270, canvas.width, 30);

  // Dog physics
  dog.y += dog.dy;
  if (dog.y + dog.height >= 270) {
    dog.y = 220;
    dog.dy = 0;
    dog.grounded = true;
  } else {
    dog.dy += dog.gravity;
  }

  // Draw dog
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

  // Draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= obstacleSpeed;
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

  // Increase difficulty
  if (score % 200 === 0) obstacleSpeed += 0.5;

  requestAnimationFrame(gameLoop);
}
