import { Bullet } from "./bullet.js";

export class Player {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    canvasWidth,
    canvasHeight,
    shootSound
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.dx = 0;
    this.dy = 0;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image = new Image();
    this.image.src = "img/nave.png";
    this.keys = {};
    this.lastShotTime = 0;
    this.shootInterval = 800;
    this.shootSound = shootSound;
    this.lives = 3;
    this.maxLives = 3;
    this.maxBullets = 1;
    this.bulletPositions = [{ x: this.x + this.width / 2 - 10, y: this.y }];
    this.canShootSideways = false;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  loseLife() {
    this.lives--;
  }

  gainLife() {
    this.lives++;
    this.maxLives++;
  }

  isAlive() {
    return this.lives > 0;
  }

  handleKeyDown(e, bullets) {
    if (!this.keys[e.key]) {
      this.keys[e.key] = true;

      if (e.key === "Enter") {
        this.updateBulletPositions();
        this.shoot(bullets);
      }
    }
  }

  handleKeyUp(e) {
    // Limpiar la tecla al soltarla
    if (this.keys[e.key]) {
      this.keys[e.key] = false;
    }
  }

  move(deltaTime) {
    if (this.keys["d"] || this.keys["D"]) {
      this.dx = this.speed * deltaTime;
    } else if (this.keys["a"] || this.keys["A"]) {
      this.dx = -this.speed * deltaTime;
    } else {
      this.dx = 0;
    }

    if (this.keys["w"] || this.keys["W"]) {
      this.dy = -this.speed * deltaTime;
    } else if (this.keys["s"] || this.keys["S"]) {
      this.dy = this.speed * deltaTime;
    } else {
      this.dy = 0;
    }

    this.x += this.dx;
    this.y += this.dy;

    // Limitar los bordes del canvas
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvasWidth)
      this.x = this.canvasWidth - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > this.canvasHeight)
      this.y = this.canvasHeight - this.height;
  }

  updateBulletPositions() {
    this.bulletPositions = [];

    if (this.canShootSideways) {
      this.bulletPositions.push({ x: this.x, y: this.y }); // Posición horizonal izquierda
      this.bulletPositions.push({ x: this.x + this.width, y: this.y }); // Posición horizonal derecha
    }

    if (this.maxBullets >= 1) {
      this.bulletPositions.push({ x: this.x + this.width / 2 - 10, y: this.y });
    }

    if (this.maxBullets >= 2) {
      this.bulletPositions = [
        { x: this.x + 1, y: this.y }, // Posición izquierda
        { x: this.x + this.width - 20, y: this.y }, // Posición derecha
      ];

      if (this.canShootSideways) {
        this.bulletPositions.push({ x: this.x, y: this.y }); // Posición horizonal izquierda
        this.bulletPositions.push({ x: this.x + this.width, y: this.y }); // Posición horizonal derecha
      }
    }

    if (this.maxBullets >= 3) {
      this.bulletPositions = [
        { x: this.x + this.width / 2 - 10, y: this.y }, // Posición central
        { x: this.x + 1, y: this.y }, // Posición izquierda
        { x: this.x + this.width - 20, y: this.y }, // Posición derecha
      ];

      if (this.canShootSideways) {
        this.bulletPositions.push({ x: this.x, y: this.y }); // Posición horizonal izquierda
        this.bulletPositions.push({ x: this.x + this.width, y: this.y }); // Posición horizonal derecha
      }
    }

    if (this.maxBullets > 3) {
      for (let i = 0; i < this.maxBullets - 3; i++) {
        this.bulletPositions.push({
          x: this.x + Math.random() * (this.width - 20),
          y: this.y,
        });
      }
    }
  }

  shoot(bullets) {
    const currentTime = performance.now();

    if (currentTime - this.lastShotTime >= this.shootInterval) {
      // Conjunto de imágenes para balas verticales
      const bulletImages = [
        "img/bullets/vertical/bullet-1-1.png",
        "img/bullets/vertical/bullet-1-2.png",
        "img/bullets/vertical/bullet-1-3.png",
        "img/bullets/vertical/bullet-1-4.png",
      ];

      // Conjunto de imágenes para balas horizontales hacia la derecha
      const bulletImagesHorizontalDerecha = [
        "img/bullets/horizontal/derecha/bullet-1-h-d-1.png",
        "img/bullets/horizontal/derecha/bullet-1-h-d-2.png",
        "img/bullets/horizontal/derecha/bullet-1-h-d-3.png",
        "img/bullets/horizontal/derecha/bullet-1-h-d-4.png",
      ];

      // Conjunto de imágenes para balas horizontales hacia la izquierda
      const bulletImagesHorizontalIzquierda = [
        "img/bullets/horizontal/izquierda/bullet-1-h-i-1.png",
        "img/bullets/horizontal/izquierda/bullet-1-h-i-2.png",
        "img/bullets/horizontal/izquierda/bullet-1-h-i-3.png",
        "img/bullets/horizontal/izquierda/bullet-1-h-i-4.png",
      ];

      this.bulletPositions.forEach((pos) => {
        let direction = 0; // Disparo vertical por defecto
        let currentBulletImages = bulletImages;
        let bulletWidth = 20;
        let bulletHeight = 40;

        if (pos.x === this.x) {
          // Bala hacia la izquierda
          direction = -1;
          currentBulletImages = bulletImagesHorizontalIzquierda;
          bulletWidth = 40;
          bulletHeight = 20;
        } else if (pos.x === this.x + this.width) {
          // Bala hacia la derecha
          direction = 1;
          currentBulletImages = bulletImagesHorizontalDerecha;
          bulletWidth = 40;
          bulletHeight = 20;
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

      this.lastShotTime = currentTime;
      this.playShootSound();
    }
  }

  playShootSound() {
    this.shootSound.currentTime = 0;
    this.shootSound.play();
  }

  aumentarNumeroBalas() {
    this.maxBullets++;
  }

  activarDisparoLateral() {
    this.canShootSideways = true;
  }

  recuperarTodasLasVidas() {
    this.lives = this.maxLives;
  }
}
