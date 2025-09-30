.width, dog.height);

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
