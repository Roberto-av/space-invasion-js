export class Star {
  constructor(x, y, radius, speed, canvasHeight) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.canvasHeight = canvasHeight;
  }

  update() {
    this.y += this.speed;
    if (this.y > this.canvasHeight) {
      this.y = 0;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}
