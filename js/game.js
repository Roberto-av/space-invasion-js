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
const menuFontSize = 24;
const soundManager = new SoundManager();

let player;
let enemyManager;
let lastTime = 0;
let bullets = [];
let bulletsEnemies = [];
let explosions = [];
let stars = [];
let score = 0;
let level = 1;
let maxEnemigos = 10;
let contEnemigos = 0;
let isPlaying = false;
let animationFrameId;
let speed = 300;
let gameStarted = false;
let gameOverState = false;
let gameFlagStart = true;
let mejoras;
let startTime = Date.now();
let showUpgradeMenu = false;
let selectedOptionIndex = 0;
let availableUpgrades = [];
let isPaused = false;
let pauseMenuFontSize = 50;

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

  enemyManager.init(level);
  bullets = [];
  bulletsEnemies = [];
  explosions = [];
  stars = [];
  score = 0;
  level = 1;
  maxEnemigos = 10;
  contEnemigos = 0;
  speed = 300;

  initStars();
}

function drawControls() {
  const controls = [
    { text: "Controles:", y: 50 },
    { text: "W, A, S, D: Mover", y: 100 },
    { text: "Enter: Disparar", y: 150 },
  ];

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";

  controls.forEach((control) => {
    ctx.fillText(control.text, canvas.width / 2, control.y);
  });
}

function update(time = 0) {
  if (!player.isAlive()) return;

  if (isPaused) {
    drawPauseMenu();
    return;
  }

  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (showUpgradeMenu) {
    drawUpgradeMenu();
    return;
  }

  if (!isPlaying) {
    drawControls();
    return;
  }

  updateStars();
  player.draw(ctx);
  player.move(deltaTime);

  bullets.forEach((bullet) => {
    bullet.draw(ctx, time);
    bullet.move();
  });

  bulletsEnemies.forEach((bullet) => {
    bullet.draw(ctx, time);
    bullet.move();
  });

  enemyManager.updateEnemies(ctx, bulletsEnemies);
  checkCollision();
  drawScoreAndLevel();

  explosions.forEach((explosion, index) => {
    explosion.draw(ctx, time);
    if (explosion.finished) {
      explosions.splice(index, 1);
    }
  });

  if (contEnemigos >= maxEnemigos) {
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
        soundManager.playExplosionSound();

        if (enemy.takeDamage()) {
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

          score++;
          contEnemigos++;
        }
      }
    });
  });

  enemyManager.bullets.forEach((bullet, bulletIndex) => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.height + bullet.y > player.y
    ) {
      enemyManager.bullets.splice(bulletIndex, 1);
      player.loseLife();
      soundManager.playLifeLostSound();
      if (!player.isAlive()) {
        gameOver();
      }
    }
  });

  enemyManager.enemies.forEach((enemy) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.height + player.y > enemy.y
    ) {
      player.loseLife();
      soundManager.playLifeLostSound();
      if (!player.isAlive()) {
        gameOver();
      }
    }
  });
}

function drawPauseMenu() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = `${pauseMenuFontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
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

  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  ctx.fillText(`Score: ${score}`, 50, 30);
  ctx.fillText(`restantes: ${contEnemigos} / ${maxEnemigos}`, 85, 60);
  ctx.fillText(`Nivel: ${level}`, canvas.width - 100, 30);
  ctx.fillText(`Vidas: ${player.lives} / ${player.maxLives}`, canvas.width / 2 - 50, 30);
  ctx.fillText(`Time: ${formattedTime}`, canvas.width - 100, 60);
}

function resetKeys() {
  player.keys = {};
}

function drawUpgradeMenu() {
  const menuWidth = 300;
  const menuHeight = 200;
  const menuX = canvas.width / 2 - menuWidth / 2;
  const menuY = canvas.height / 2 - menuHeight / 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

  ctx.fillStyle = "white";
  ctx.font = `${menuFontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText("Escoge una mejora", canvas.width / 2, menuY + 40);

  availableUpgrades.forEach((upgrade, index) => {
    ctx.fillStyle = index === selectedOptionIndex ? "yellow" : "white";
    ctx.fillText(upgrade.name, canvas.width / 2, menuY + 80 + index * 40);
  });
}

function levelUp() {
  level++;
  enemyManager.maxActiveEnemies += level + 3;
  contEnemigos = 0;
  showUpgradeMenu = true;

  let incrementoAleatorio = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
  maxEnemigos += incrementoAleatorio;
  player.levelUp();

  availableUpgrades = mejoras
    .obtenerMejorasAleatorias()
    .map((mejora, index) => ({
      name: `${index + 1}. ${mejora.texto}`,
      action: mejora.funcion,
    }));

  showUpgradeMenu = true;
  isPlaying = false;

  resetKeys();
}

startButton.addEventListener("click", () => {
  if (gameFlagStart == true) {
    if (!isPlaying && !gameStarted) {
      gameStarted = true;
      startButton.disabled = true;
      isPlaying = true;
      soundManager.backgroundMusic.play();
      update();
    }
  } else {
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
  if (e.key === "Escape") {
    isPaused = !isPaused;
    soundManager.stopBackgroundMusic();
    if (!isPaused) {
      soundManager.backgroundMusic.play();
      update();
    }
  } else if (showUpgradeMenu) {
    if (e.key === "Enter") {
      if (availableUpgrades[selectedOptionIndex]) {
        availableUpgrades[selectedOptionIndex].action();
        showUpgradeMenu = false;
        isPlaying = true;
        update();
      }
    } else if (e.key === "w") {
      selectedOptionIndex =
        (selectedOptionIndex - 1 + availableUpgrades.length) %
        availableUpgrades.length;
      update();
    } else if (e.key === "s") {
      selectedOptionIndex =
        (selectedOptionIndex + 1) % availableUpgrades.length;
      update();
    }
  } else if (isPlaying) {
    player.handleKeyDown(e, bullets);
  }
});

document.addEventListener("keyup", (e) => {
  if (isPlaying) player.handleKeyUp(e);
});

initGame();
update();
