export class Explosion {
    constructor(x, y, width, height, imageSrcs) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.images = imageSrcs.map((src) => {
        const img = new Image();
        img.src = src;
        return img;
      });
  
      this.imageIndex = 0;
      this.animationInterval = 50;
      this.lastFrameTime = 0;
      this.finished = false; // Para marcar si la animación ha terminado
    }
  
    draw(ctx, currentTime) {
      if (currentTime - this.lastFrameTime > this.animationInterval) {
        this.imageIndex++;
        this.lastFrameTime = currentTime;
  
        // Si ha llegado al final de las imágenes de la explosión, marcarla como terminada
        if (this.imageIndex >= this.images.length) {
          this.finished = true;
        }
      }
  
      // Dibujar la imagen actual de la explosión
      if (!this.finished) {
        ctx.drawImage(
          this.images[this.imageIndex],
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
    }
  }
  