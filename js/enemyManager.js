// En el archivo de EnemyManager.js

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
    this.timeElapsed = 0;
    this.bossSpawnTime = 120000; // 2 minutos
    this.bossSpawned = false;
    this.imageSrcs = [
      "img/enemigos/1/enemigo-1-r.png",
      "img/enemigos/1/enemigo-1-m.png",
    ];


  }

  init(playerLevel) {
    setInterval(() => {
      this.timeElapsed += this.spawnRate;

      if (this.timeElapsed >= this.bossSpawnTime && !this.bossSpawned) {
        this.createBoss();
        this.bossSpawned = true;
      } else if (this.enemies.length < this.maxActiveEnemies + playerLevel) {
        const chance = Math.random();
        if (chance > 0.8) {
          this.createEnemy(2); // Enemigo fuerte
        } else {
          this.createEnemy(1); // Enemigo básico
        }
      }
    }, this.spawnRate);
  }

  createEnemy(type) {
    const x = Math.random() * (this.canvasWidth - this.width);
    let health = 1;
    let canShoot = false;
    let speed = 1 + this.level * 0.5;

    if (type === 2) {
      // Enemigo fuerte
      health = 2;
      canShoot = true;
      speed = 2;
    }

    const enemy = new Enemy(
      x,
      0,
      this.width,
      this.height,
      speed,
      this.imageSrcs,
      this.canvasWidth,
      this.canvasHeight,
      type,
      health,
      canShoot
    );
    this.enemies.push(enemy);
  }

  createBoss() {
    const x = Math.random() * (this.canvasWidth - this.width);
    const bossImageSrcs = [
      "img/enemigos/mini-boss/enemigo-mini-jefe-1-r.png",
      "img/enemigos/mini-boss/enemigo-mini-jefe-1-m.png",
    ];

    const boss = new Enemy(
      x,
      0,
      this.width * 2, // El mini-jefe será más grande
      this.height * 2,
      1,
      bossImageSrcs,
      this.canvasWidth,
      this.canvasHeight,
      3, // Tipo 3 para el mini-jefe
      20, // 20 disparos para destruirlo
      true // Puede disparar varias balas
    );
    this.enemies.push(boss);
  }

  updateEnemies(ctx) {
    const currentTime = Date.now();
    this.enemies.forEach((enemy, index) => {
      enemy.move(currentTime);
      enemy.draw(ctx, currentTime);
  
      if (enemy.y > this.canvasHeight || enemy.health <= 0) {
        this.enemies.splice(index, 1);
        this.totalEnemies++;
  
      }
    });
  }
}
