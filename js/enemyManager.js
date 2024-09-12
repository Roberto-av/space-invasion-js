import { Enemy } from "./enemy.js";

export class EnemyManager {
  constructor(imageSrc, canvasWidth, canvasHeight, level) {
    this.imageSrc = imageSrc;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.level = level;
    this.enemies = [];
    this.maxActiveEnemies = 3;
    this.spawnRate = 1000;
    this.totalEnemies = 0;
    this.init();
  }

  init() {
    // Crear enemigos de acuerdo al nivel
    setInterval(() => {
      if (this.enemies.length < this.maxActiveEnemies && this.totalEnemies < this.level * 30) {
        this.createEnemy();
      }
    }, this.spawnRate);
  }

  createEnemy() {
    const x = Math.random() * (this.canvasWidth - 100) + 50;
    const enemy = new Enemy(x, 0, 50, 50, 1 + this.level * 0.5, this.imageSrc, this.canvasWidth, this.canvasHeight);
    this.enemies.push(enemy);
    this.totalEnemies++;
  }

  updateEnemies(ctx) {
    this.enemies.forEach((enemy, index) => {
      enemy.move();
      enemy.draw(ctx);

      // Eliminar enemigos que salieron del canvas
      if (enemy.y > this.canvasHeight) {
        this.enemies.splice(index, 1);
      }
    });
  }

  levelUp(newLevel) {
    this.level = newLevel;
    this.maxActiveEnemies = 3 + newLevel;
    this.totalEnemies = 0;
  }
}
