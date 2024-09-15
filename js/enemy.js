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
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }

  move(currentTime) {
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

    // Manejar disparos del enemigo si puede disparar
    if (this.canShoot && currentTime - this.lastShootTime > this.shootCooldown) {
      this.shoot();
      this.lastShootTime = currentTime;
    }
  }

  shoot() {
    console.log("Enemy disparando balas");
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
