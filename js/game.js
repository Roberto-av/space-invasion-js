import { Player } from "./player.js";
import { EnemyManager } from "./enemyManager.js";
import { Explosion } from "./explosion.js";
import { Star } from "./star.js";
import { SoundManager } from "./soundManager.js";
import { Mejoras } from "./mejoras.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

canvas.width = 800;
canvas.height = 600;

const playerWidth = 48;
const playerHeight = 48;
const enemyWidth = 48;
const enemyHeight = 48;

const soundManager = new SoundManager();

let player;
let enemyManager;
let lastTime = 0;
let bullets = [];
let explosions = [];
let stars = [];
let score = 0;
let level = 1;
let maxEnemies = 1;
let isPlaying = false;
let animationFrameId;
let speed = 300;
let gameStarted = false;
let gameOverState = false;
let gameFlagStart = true;
let mejoras

// Funciones principales
function initGame() {
  player = new Player(
    canvas.width / 2 - playerWidth / 2,
    canvas.height - playerHeight - 10,
    playerWidth,
    playerHeight,
    speed,
    canvas.width,
    canvas.height,
    soundManager.shootSound
  );

  mejoras = new Mejoras(player);

  enemyManager = new EnemyManager(
    canvas.width,
    canvas.height,
    enemyWidth,
    enemyHeight,
    level
  );

  bullets = [];
  explosions = [];
  stars = [];
  score = 0;
  level = 1;
  maxEnemies = 1;

  initStars();
}

function update(time = 0) {
  if (!player.isAlive()) return;

  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isPlaying) {
    return;
  }

  updateStars();
  player.draw(ctx);
  player.move(deltaTime);

  bullets.forEach((bullet) => {
    bullet.draw(ctx, time);
    bullet.move();
  });

  enemyManager.updateEnemies(ctx);
  checkCollision();
  drawScoreAndLevel();

  explosions.forEach((explosion, index) => {
    explosion.draw(ctx, time);
    if (explosion.finished) {
      explosions.splice(index, 1);
    }
  });

  if (score >= maxEnemies) {
    levelUp();
  }

  animationFrameId = requestAnimationFrame(update);
}

function resetGame() {
  if (!gameOverState) return;

  cancelAnimationFrame(animationFrameId);

  initGame();
  soundManager.stopBackgroundMusic();
  soundManager.backgroundMusic.play();
  isPlaying = true;
  update();

  restartButton.disabled = true;
  const restartText = document.getElementById("restartText");
  restartText.textContent = "";
  gameOverState = false;
  gameStarted = false;
}

function initStars() {
  for (let i = 0; i < 100; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let radius = Math.random() * 2;
    let speed = Math.random() * 2 + 1;
    stars.push(new Star(x, y, radius, speed, canvas.height));
  }
}

function updateStars() {
  stars.forEach((star) => {
    star.update();
    star.draw(ctx);
  });
}

function checkCollision() {
  bullets.forEach((bullet, bulletIndex) => {
    enemyManager.enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.height + bullet.y > enemy.y
      ) {
        bullets.splice(bulletIndex, 1);
        enemyManager.enemies.splice(enemyIndex, 1);

        const explosionImages = [
          "img/explosion/explosion-1-1.png",
          "img/explosion/explosion-1-2.png",
          "img/explosion/explosion-1-3.png",
          "img/explosion/explosion-1-4.png",
          "img/explosion/explosion-1-5.png",
          "img/explosion/explosion-1-6.png",
          "img/explosion/explosion-1-7.png",
          "img/explosion/explosion-1-8.png",
          "img/explosion/explosion-1-9.png",
          "img/explosion/explosion-1-10.png",
          "img/explosion/explosion-1-11.png",
          "img/explosion/explosion-1-12.png",
        ];
        explosions.push(
          new Explosion(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height,
            explosionImages
          )
        );

        soundManager.playExplosionSound();
        score++;
      }
    });
  });

  enemyManager.enemies.forEach((enemy, enemyIndex) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.height + player.y > enemy.y
    ) {
      enemyManager.enemies.splice(enemyIndex, 1);
      player.loseLife();
      soundManager.playLifeLostSound();
      if (!player.isAlive()) {
        gameOver();
      }
    }
  });
}

function gameOver() {
  isPlaying = false;
  gameOverState = true; 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  soundManager.stopBackgroundMusic();
  soundManager.playGameOverSound();

  ctx.fillStyle = "red";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

  gameFlagStart = false;
  const restartText = document.getElementById("restartText");
  restartText.textContent = "Reiniciar";
  restartText.style.visibility = "visible";

  restartButton.disabled = false;
  restartButton.addEventListener("click", resetGame);
}

function drawScoreAndLevel() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 60, 30);
  ctx.fillText(`Level: ${level}`, canvas.width - 100, 30);
  ctx.fillText(`Lives: ${player.lives}`, canvas.width / 2 - 50, 30);
}

function resetKeys() {
  player.keys = {};
}

function levelUp() {
  level++;
  maxEnemies += level * 3;
  enemyManager.levelUp(level);

  const mejorasDisponibles = mejoras.obtenerMejorasAleatorias();
  const opciones = mejorasDisponibles.map((mejora, index) => `${index + 1}. ${mejora.name}`).join("\n");
  const choice = prompt(`¡Elige una mejora! \n${opciones}`);

  const seleccionada = parseInt(choice) - 1;

  if (mejorasDisponibles[seleccionada]) {
    mejorasDisponibles[seleccionada]();
  }

  resetKeys();

  showTemporaryMessage(`¡HA SUBIDO A NIVEL ${level}!`, 4000);
}

function showTemporaryMessage(message, duration) {
  const titleElement = document.querySelector(".game-title");
  const originalTitle = titleElement.textContent;

  titleElement.textContent = message;
  titleElement.classList.add("shake");

  setTimeout(() => {
    titleElement.textContent = originalTitle;
    titleElement.classList.remove("shake");
  }, duration);
}

startButton.addEventListener("click", () => {
  if (gameFlagStart == true) {
    if (!isPlaying && !gameStarted) {
      gameStarted = true;
      startButton.disabled = true;
      isPlaying = true;
      enemyManager.init();
      soundManager.backgroundMusic.play();
      update();
    }
  }else {
    soundManager.stopGameOverSound();
    resetGame();
  }
});

restartButton.addEventListener("click", () => {
  if (gameOverState) {
    soundManager.stopGameOverSound();
    resetGame();
  }
});

document.addEventListener("keydown", (e) => {
  if (isPlaying) player.handleKeyDown(e, bullets);
});

document.addEventListener("keyup", (e) => {
  if (isPlaying) player.handleKeyUp(e);
});

initGame();
update();
