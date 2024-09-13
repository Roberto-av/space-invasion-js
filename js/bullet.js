export class Bullet {
  constructor(x, y, width, height, speed, imageSrcs) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    // Cargar las imágenes
    this.images = imageSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    this.imageIndex = 0; // Índice de la imagen actual
    this.animationInterval = 100; // Intervalo para cambiar la imagen (100 ms)
    this.lastFrameTime = 0; // Tiempo de la última actualización
  }

  draw(ctx, currentTime) {
    // Actualizar el índice de la imagen si ha pasado el tiempo suficiente
    if (currentTime - this.lastFrameTime > this.animationInterval) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length; // Cambiar de imagen
      this.lastFrameTime = currentTime;
    }

    // Dibujar la imagen actual de la animación
    ctx.drawImage(
      this.images[this.imageIndex],
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  move() {
    this.y -= this.speed;
  }
}
