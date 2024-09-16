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
    }
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }

  move(currentTime, bullets) {
    if (this.type === 1) {
      // Comportamiento para tipo 1
      // Verificar si ha pasado suficiente tiempo para cambiar de dirección
      if (
        currentTime - this.lastDirectionChangeTime >=
        this.directionChangeInterval
      ) {
        this.directionX = Math.random() < 0.5 ? -1 : 1;
        this.lastDirectionChangeTime = currentTime;
        this.directionChangeInterval = Math.random() * 1000 + 2000;
      }

      // Movimiento del enemigo hacia abajo
      this.y += this.speed;

      // Movimiento horizontal
      this.x += this.directionX * (this.speed * 0.5);

      // Cambiar dirección si toca los bordes
      if (this.x <= 0 || this.x + this.width >= this.canvasWidth) {
        this.directionX *= -1;
      }
    } else if (this.type === 2) {
      // Comportamiento para tipo 2
      if (this.moveState === "initial") {
        // Movimiento inicial hacia abajo
        this.y += this.verticalMoveSpeed;

        // Cambiar a movimiento horizontal después de un tiempo
        if (currentTime - this.moveStartTime >= this.horizontalMoveDuration) {
          this.moveState = "movingHorizontal";
          this.moveStartTime = currentTime;
          this.horizontalMoveDuration = Math.random() * 2000 + 3000;
        }
      } else if (this.moveState === "movingHorizontal") {
        // Movimiento horizontal
        this.x += this.directionX * (this.speed * 0.5);

        // Cambiar dirección horizontal si toca los bordes
        if (this.x <= 0 || this.x + this.width >= this.canvasWidth) {
          this.directionX *= -1;
        }

        // Cambiar a movimiento vertical después de un tiempo
        if (currentTime - this.moveStartTime >= this.horizontalMoveDuration) {
          this.moveState = "movingDown";
          this.moveStartTime = currentTime;
          this.verticalMoveSpeed = Math.random() * 2 + 1; 
        }
      } else if (this.moveState === "movingDown") {
        // Movimiento vertical hacia abajo
        this.y += this.verticalMoveSpeed;

        // Cambiar a movimiento horizontal nuevamente después de un tiempo
        if (currentTime - this.moveStartTime >= this.horizontalMoveDuration) {
          this.moveState = "movingHorizontal";
          this.moveStartTime = currentTime;
          this.horizontalMoveDuration = Math.random() * 2000 + 3000;
          this.directionX = Math.random() < 0.5 ? -1 : 1; 
        }
      }
    }

    // Verificar si el enemigo se sale del canvas
    if (this.y > this.canvasHeight) {
      this.y = -this.height; 
    }

    if (
      this.canShoot &&
      currentTime - this.lastShootTime > this.shootCooldown
    ) {
      this.shoot(bullets);
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
