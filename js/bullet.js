export class Bullet {
  constructor(x, y, width, height, speed, imageSrcs, direction = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.images = imageSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    this.imageIndex = 0;
    this.animationInterval = 100;
    this.lastFrameTime = 0;
  }

  draw(ctx, currentTime) {
    if (currentTime - this.lastFrameTime > this.animationInterval) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length; // Cambiar de imagen
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

  move() {
    if (this.direction === 0) {
      this.y -= this.speed; // Movimiento hacia arriba
    } else if (this.direction === 1) {
      this.x += this.speed; // Movimiento hacia la derecha
    } else if (this.direction === -1) {
      this.x -= this.speed; // Movimiento hacia la izquierda
    } else if (this.direction === 2) {
      this.y += this.speed; // Movimiento hacia abajo
    }
  }
}
