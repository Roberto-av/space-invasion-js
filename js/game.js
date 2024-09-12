import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Bullet } from "./bullet.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const playerWidth = 64;
const playerHeight = 64;
const enemyImgSrc = "img/enemigos-dib.png";

// Crear el jugador
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
let enemies = [];
let score = 0;

function createEnemy() {
  const x = Math.random() * (canvas.width - 50);
  const enemy = new Enemy(
    x,
    0,
    50,
    50,
    1,
    enemyImgSrc,
    canvas.width,
    canvas.height
  );
  enemies.push(enemy);
}

function checkCollision() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.height + bullet.y > enemy.y
      ) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score++;
      }
    });
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

let lastTime = 0;
function update(time = 0) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw(ctx);
  player.move(deltaTime);

  bullets.forEach((bullet) => {
    bullet.draw(ctx);
    bullet.move();
  });

  enemies.forEach((enemy) => {
    enemy.draw(ctx);
    enemy.move();
  });

  checkCollision();
  drawScore();

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  player.handleKeyDown(e, bullets);
});

document.addEventListener("keyup", (e) => {
  player.handleKeyUp(e);
});

setInterval(createEnemy, 1000);

update();
