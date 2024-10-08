import { Enemy } from "./enemy.js";

export class EnemyManager {
  constructor(canvasWidth, canvasHeight, width, height, level) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = width;
    this.height = height;
    this.level = level;
    this.enemies = [];
    this.bullets = [];
    this.maxActiveEnemies = 3;
    this.spawnRate = 1000;
    this.totalEnemies = 0;
    this.timeElapsed = 0;
    this.bossSpawnTime = 120000;
    this.bossAppearanceTime = 0; 
    this.bossAppearanceInterval = 60000; 
    this.bossSpawned = false; 
    this.imageSrcs = [
      "img/enemigos/1/enemigo-1-r.png",
      "img/enemigos/1/enemigo-1-m.png",
    ];
  }

  init(playerLevel) {
    setInterval(() => {
      this.timeElapsed += this.spawnRate;
      const currentTime = Date.now();

      if (this.bossSpawned) {
        // Verifica si es momento de hacer reaparecer el jefe
        if (currentTime - this.bossAppearanceTime >= this.bossAppearanceInterval) {
          this.createBoss(true); 
          this.bossSpawned = true;
          this.bossAppearanceTime = currentTime;
        }
      } else if (this.timeElapsed >= this.bossSpawnTime) {
        if (!this.enemies.some(enemy => enemy.type === 3)) {
          this.createBoss(); 
          this.bossSpawned = true;
          this.bossAppearanceTime = currentTime; 
        }
      }

      if (this.enemies.length < this.maxActiveEnemies + playerLevel) {
        const chance = Math.random();
        if (chance > 0.8) {
          this.createEnemy(2);
        } else {
          this.createEnemy(1);
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
      this.imageSrcs = [
        "img/enemigos/2/enemigo-2-r-m.png",
        "img/enemigos/2/enemigo-2-m-r.png",
      ];
      health = 2;
      canShoot = true;
      speed = 2 + this.level * 0.3;
    } else {
      this.imageSrcs = [
        "img/enemigos/1/enemigo-1-r.png",
        "img/enemigos/1/enemigo-1-m.png",
      ];
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

  createBoss(increasedFireRate = false) {
    const x = Math.random() * (this.canvasWidth - this.width);
    const bossImageSrcs = [
      "img/enemigos/mini-boss/enemigo-mini-jefe-1-r.png",
      "img/enemigos/mini-boss/enemigo-mini-jefe-1-m.png",
    ];

    const boss = new Enemy(
      x,
      0,
      this.width * 2,
      this.height * 2,
      1,
      bossImageSrcs,
      this.canvasWidth,
      this.canvasHeight,
      3,
      20,
      true
    );

    if (increasedFireRate) {
      boss.bossShootCooldown = 500; 
    }

    this.enemies.push(boss);
  }

  updateEnemies(ctx, bullets) {
    const currentTime = Date.now();
    this.bullets = bullets;
    this.enemies.forEach((enemy, index) => {
      enemy.move(currentTime, bullets);
      enemy.draw(ctx, currentTime);

      if (enemy.y > this.canvasHeight || enemy.health <= 0) {
        this.enemies.splice(index, 1);
        this.totalEnemies++;

        if (enemy.type === 3) {
          this.bossSpawned = false;
          this.bossAppearanceTime = currentTime;
        }
      }
    });
  }
}
