export class Enemy {
    constructor(x, y, width, height, speed, imageSrcs, canvasWidth, canvasHeight) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.imageIndex = 0;
      this.images = imageSrcs.map(src => {
        const img = new Image();
        img.src = src;
        return img;
      });
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.animationInterval = 400;
      this.lastFrameTime = 0;
    }
  
    move() {
      this.y += this.speed;
    }
  
    draw(ctx, currentTime) {
      if (currentTime - this.lastFrameTime > this.animationInterval) {
        this.imageIndex = (this.imageIndex + 1) % this.images.length;
        this.lastFrameTime = currentTime;
      }
  
      ctx.drawImage(this.images[this.imageIndex], this.x, this.y, this.width, this.height);
    }
  }
  