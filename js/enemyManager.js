import { Enemy } from "./enemy.js";

export class EnemyManager {
  constructor(canvasWidth, canvasHeight, width, height, level) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = width;
    this.height = height;
    this.level = level;
    this.enemies = [];
    this.maxActiveEnemies = 3;
    this.spawnRate = 1000;
    this.totalEnemies = 0;
    this.imageSrcs = ["img/enemigo-1-r.png", "img/enemigo-1-m.png"];
    this.init();
  }

  init() {
    setInterval(() => {
      if (
        this.enemies.length < this.maxActiveEnemies &&
        this.totalEnemies < this.level * 30
      ) {
        this.createEnemy();
      }
    }, this.spawnRate);
  }

  createEnemy() {
    const x = Math.random() * (this.canvasWidth - this.width);
    const enemy = new Enemy(
      x,
      0,
      this.width,
      this.height,
      1 + this.level * 0.5,
      this.imageSrcs,
      this.canvasWidth,
      this.canvasHeight
    );
    this.enemies.push(enemy);
    this.totalEnemies++;
  }

  updateEnemies(ctx) {
    const currentTime = Date.now(); // Obtener el tiempo actual para animación
    this.enemies.forEach((enemy, index) => {
      enemy.move();
      enemy.draw(ctx, currentTime);

      if (enemy.y > this.canvasHeight) {
        this.enemies.splice(index, 1);
      }
    });
  }

  levelUp(newLevel) {
    this.level = newLevel;
    this.maxActiveEnemies = 3 + newLevel;
    this.totalEnemies = 0;

    // Cambiar las imágenes de los enemigos según el nivel
    switch (this.level) {
      case 1:
        this.imageSrcs = [
          "img/enemigo-1-r.png",
          "img/enemigo-1-m.png"
        ];
        break;
      case 2:
        this.imageSrcs = [
          "img/enemigo-2-r.png", 
          "img/enemigo-2-m.png"
        ];
        break;
      case 3:
        this.imageSrcs = [
          "img/enemigo-mini-jefe-1-r.png",
          "img/enemigo-mini-jefe-1-m.png",
        ];
        break;
      default:
        this.imageSrcs = [
          "img/enemigo-mini-jefe-1-r.png",
          "img/enemigo-mini-jefe-1-m.png",
        ];
    }
  }
}
