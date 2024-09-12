export class Enemy {
    constructor(x, y, width, height, speed, imageSrc, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += this.speed;
    }
}
