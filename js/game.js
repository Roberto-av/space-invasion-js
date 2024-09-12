import { Player } from "./player.js";
import { EnemyManager } from "./enemyManager.js";
import { Bullet } from "./bullet.js";
import { drawStartButton } from './boton.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const playerWidth = 64;
const playerHeight = 64;
const enemyImgSrc = "img/enemigos-dib.png";

let player = new Player(
  canvas.width / 2 - playerWidth / 2,
  canvas.height - playerHeight - 10,
  playerWidth,
  playerHeight,
  400,
  canvas.width,
  canvas.height
);
let bullets = [];
let score = 0;
let level = 1;
let maxEnemies = 30;
let isPlaying = false;

let enemyManager = new EnemyManager(enemyImgSrc, canvas.width, canvas.height, level);

let buttonBounds = { x: 0, y: 0, width: 200, height: 60 };

// Verificar colisión
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
        score++;
      }
    });
  });
}

function drawScoreAndLevel() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 60, 30);
  ctx.fillText(`Level: ${level}`, canvas.width - 100, 30);
}

// Actualizar juego
let lastTime = 0;
function update(time = 0) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isPlaying) {
    buttonBounds = {
      x: canvas.width / 2 - 100,
      y: canvas.height / 2 - 30,
      width: 200,
      height: 60
    };
    drawStartButton(ctx, canvas.width, canvas.height);
    return;
  }

  player.draw(ctx);
  player.move(deltaTime);

  bullets.forEach((bullet) => {
    bullet.draw(ctx);
    bullet.move();
  });

  enemyManager.updateEnemies(ctx);
  checkCollision();
  drawScoreAndLevel();

  if (score >= maxEnemies) {
    level++;
    maxEnemies += level * 20; 
    enemyManager.levelUp(level);
  }

  requestAnimationFrame(update);
}

canvas.addEventListener("click", (e) => {
  if (!isPlaying &&
    e.offsetX > buttonBounds.x &&
    e.offsetX < buttonBounds.x + buttonBounds.width &&
    e.offsetY > buttonBounds.y &&
    e.offsetY < buttonBounds.y + buttonBounds.height) {
    isPlaying = true;
    enemyManager.init();
    update(); 
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isPlaying) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (mouseX > buttonBounds.x &&
      mouseX < buttonBounds.x + buttonBounds.width &&
      mouseY > buttonBounds.y &&
      mouseY < buttonBounds.y + buttonBounds.height) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default'; 
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (isPlaying) player.handleKeyDown(e, bullets);
});
document.addEventListener("keyup", (e) => {
  if (isPlaying) player.handleKeyUp(e);
});

update();
