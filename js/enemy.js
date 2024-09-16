import { Bullet } from "./bullet.js";

export class Enemy {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageSrcs,
    canvasWidth,
    canvasHeight,
    type = 1,
    health = 1,
    canShoot = false
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.images = imageSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.type = type;
    this.health = health;
    this.canShoot = canShoot;
    this.imageIndex = 0;
    this.directionX = Math.random() < 0.5 ? -1 : 1;
    this.animationInterval = 400;
    this.lastFrameTime = 0;
    this.directionChangeInterval = Math.random() * 1000 + 2000;
    this.lastDirectionChangeTime = performance.now();
    this.lastShootTime = 0;
    this.shootCooldown = 2000;
    this.bullets = [];

    if (this.type === 2) {
      this.moveState = "initial";
      this.moveStartTime = performance.now();
      this.horizontalMoveDuration = Math.random() * 2000 + 3000;
      this.verticalMoveSpeed = 1;
    } else if (this.type === 3) {
      // Boss específico
      this.moveState = "initial";
      this.moveStartTime = performance.now();
      this.horizontalMoveDuration = Math.random() * 2000 + 3000;
      this.verticalMoveSpeed = 1;
      this.angle = 0;
      this.angularSpeed = 0.05;
      this.bossShootCooldown = 1000;
      this.maxTimeInInitialState = 3000;
      this.bulletPositions = [];
      this.maxBullets = 6;
    }
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }

  move(currentTime, bullets) {
    if (this.type === 1) {
      // Movimiento para enemigos tipo 1
      if (
        currentTime - this.lastDirectionChangeTime >=
        this.directionChangeInterval
      ) {
        this.directionX = Math.random() < 0.5 ? -1 : 1;
        this.lastDirectionChangeTime = currentTime;
        this.directionChangeInterval = Math.random() * 1000 + 2000;
      }
      this.y += this.speed;
      this.x += this.directionX * (this.speed * 0.5);
      if (this.x <= 0 || this.x + this.width >= this.canvasWidth) {
        this.directionX *= -1;
      }
    } else if (this.type === 2) {
      // Movimiento para enemigos tipo 2
      if (this.moveState === "initial") {
        this.y += this.verticalMoveSpeed;
        if (currentTime - this.moveStartTime >= this.horizontalMoveDuration) {
          this.moveState = "movingHorizontal";
          this.moveStartTime = currentTime;
          this.horizontalMoveDuration = Math.random() * 2000 + 3000;
        }
      } else if (this.moveState === "movingHorizontal") {
        this.x += this.directionX * (this.speed * 0.5);
        if (this.x <= 0 || this.x + this.width >= this.canvasWidth) {
          this.directionX *= -1;
        }
        if (currentTime - this.moveStartTime >= this.horizontalMoveDuration) {
          this.moveState = "movingDown";
          this.moveStartTime = currentTime;
          this.verticalMoveSpeed = Math.random() * 2 + 1;
        }
      } else if (this.moveState === "movingDown") {
        this.y += this.verticalMoveSpeed;
        if (currentTime - this.moveStartTime >= this.horizontalMoveDuration) {
          this.moveState = "movingHorizontal";
          this.moveStartTime = currentTime;
          this.horizontalMoveDuration = Math.random() * 2000 + 3000;
          this.directionX = Math.random() < 0.5 ? -1 : 1;
        }
      }
    } else if (this.type === 3) {
      // Movimiento para el boss
      if (this.moveState === "initial") {
        this.y += this.verticalMoveSpeed;
        if (currentTime - this.moveStartTime >= this.maxTimeInInitialState) {
          this.moveState = "circling";
          this.moveStartTime = currentTime;
        }
      } else if (this.moveState === "circling") {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.angle += this.angularSpeed;

        // Verifica si se encuentra en los límites horizontales
        if (this.x < 0 || this.x + this.width > this.canvasWidth) {
          this.x = Math.max(0, Math.min(this.x, this.canvasWidth - this.width));
          this.angle = -this.angle;
        }

        // Verifica si se encuentra en los límites verticales
        if (this.y < 0 || this.y + this.height > this.canvasHeight) {
          this.y = Math.max(
            0,
            Math.min(this.y, this.canvasHeight - this.height)
          );
          this.angle = Math.PI - this.angle;
        }

        // Asegurar que el jefe no pase demasiado tiempo debajo de la mitad del canvas
        if (this.y > this.canvasHeight / 2) {
          // Si el jefe está mucho tiempo debajo de la mitad, ajusta su ángulo para subirlo
          if (currentTime - this.lastAboveHalfTime > this.forceMoveUpCooldown) {
            this.angle = -Math.abs(this.angle);
            this.lastAboveHalfTime = currentTime;
          }
        } else {
          // Actualiza el tiempo cuando está sobre la mitad del canvas
          this.lastAboveHalfTime = currentTime;
        }
      }
    }

    // Verificar si el enemigo se sale del canvas
    if (this.y > this.canvasHeight) {
      this.y = -this.height;
    }

    // Disparo de balas
    if (
      this.canShoot &&
      currentTime - this.lastShootTime > this.shootCooldown
    ) {
      this.shoot(bullets);
      this.lastShootTime = currentTime;
    }

    // Disparo especial del boss
    if (
      this.type === 3 &&
      currentTime - this.lastShootTime > this.bossShootCooldown
    ) {
      this.updateBulletPositions();
      this.shootSpecial(bullets);
      this.lastShootTime = currentTime;
    }
  }

  shoot(bullets) {
    const bulletImages = [
      "img/bullets/abajo/bullet-n-1-1.png",
      "img/bullets/abajo/bullet-n-1-2.png",
      "img/bullets/abajo/bullet-n-1-3.png",
      "img/bullets/abajo/bullet-n-1-4.png",
    ];

    bullets.push(
      new Bullet(
        this.x + this.width / 2,
        this.y + this.height,
        20,
        40,
        3,
        bulletImages,
        2
      )
    );
  }

  updateBulletPositions() {
    this.bulletPositions = [
      { x: this.x + this.width / 2 - 10, y: this.y }, // Arriba
      { x: this.x + this.width / 2 - 10, y: this.y + this.height }, // Abajo
      { x: this.x, y: this.y + this.height / 2 - 10 }, // Izquierda
      { x: this.x, y: this.y + this.height / 2 - 40 }, // Izquierda arriba
      { x: this.x + this.width, y: this.y + this.height / 2 - 10 }, // Derecha
    ];
  }

  shootSpecial(bullets) {
    const bulletImagesUp = [
      "img/bullets/vertical/boss/bullet-n-1-1.png",
      "img/bullets/vertical/boss/bullet-n-1-2.png",
      "img/bullets/vertical/boss/bullet-n-1-3.png",
      "img/bullets/vertical/boss/bullet-n-1-4.png",
    ];

    const bulletImagesDown = [
      "img/bullets/abajo/bullet-n-1-1.png",
      "img/bullets/abajo/bullet-n-1-2.png",
      "img/bullets/abajo/bullet-n-1-3.png",
      "img/bullets/abajo/bullet-n-1-4.png",
    ];

    const bulletImagesLeft = [
      "img/bullets/horizontal/izquierda/boss/bullet-n-1-1.png",
      "img/bullets/horizontal/izquierda/boss/bullet-n-1-2.png",
      "img/bullets/horizontal/izquierda/boss/bullet-n-1-3.png",
      "img/bullets/horizontal/izquierda/boss/bullet-n-1-4.png",
    ];

    const bulletImagesRight = [
      "img/bullets/horizontal/derecha/boss/bullet-n-1-1.png",
      "img/bullets/horizontal/derecha/boss/bullet-n-1-2.png",
      "img/bullets/horizontal/derecha/boss/bullet-n-1-3.png",
      "img/bullets/horizontal/derecha/boss/bullet-n-1-4.png",
    ];

    this.bulletPositions.forEach((pos) => {
      let direction = 0;
      let currentBulletImages = bulletImagesUp;
      let bulletWidth = 20;
      let bulletHeight = 40;

      // Disparo hacia la izquierda
      if (pos.x === this.x) {
        direction = -1;
        currentBulletImages = bulletImagesLeft;
        bulletWidth = 40;
        bulletHeight = 20;
      }
      // Disparo hacia la derecha
      else if (pos.x === this.x + this.width) {
        direction = 1;
        currentBulletImages = bulletImagesRight;
        bulletWidth = 40;
        bulletHeight = 20;
      }
      // Disparo hacia abajo
      else if (pos.y === this.y + this.height) {
        direction = 2;
        currentBulletImages = bulletImagesDown;
        bulletWidth = 20;
        bulletHeight = 40;
      }

      bullets.push(
        new Bullet(
          pos.x,
          pos.y,
          bulletWidth,
          bulletHeight,
          5,
          currentBulletImages,
          direction
        )
      );
    });
  }

  draw(ctx, currentTime) {
    if (currentTime - this.lastFrameTime > this.animationInterval) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
      this.lastFrameTime = currentTime;
    }

    ctx.drawImage(
      this.images[this.imageIndex],
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
