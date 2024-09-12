import { Bullet } from "./bullet.js";

export class Player {
  constructor(x, y, width, height, speed, canvasWidth, canvasHeight) {
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

  move() {
    this.x += this.dx;
    this.y += this.dy;

    // Limitar los bordes del canvas usando el ancho y alto guardados
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvasWidth)
      this.x = this.canvasWidth - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > this.canvasHeight)
      this.y = this.canvasHeight - this.height;
  }

  shoot(bullets) {
    bullets.push(new Bullet(this.x + this.width / 2 - 2.5, this.y, 5, 10, 7));
  }
}
