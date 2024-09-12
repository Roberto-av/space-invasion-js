export class Enemy {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageSrcs,
    canvasWidth,
    canvasHeight
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

    // Inicialización de variables para animación y dirección
    this.imageIndex = 0;
    this.directionX = Math.random() < 0.5 ? -1 : 1; // Dirección inicial (izquierda o derecha)
    this.animationInterval = 400;
    this.lastFrameTime = 0;

    // Temporizador para cambiar la dirección
    this.directionChangeInterval = Math.random() * 1000 + 2000;
    this.lastDirectionChangeTime = performance.now();
  }

  move(currentTime) {
    // Verificar si ha pasado suficiente tiempo para cambiar de dirección
    if (
      currentTime - this.lastDirectionChangeTime >=
      this.directionChangeInterval
    ) {
      this.directionX = Math.random() < 0.5 ? -1 : 1; // Cambiar dirección aleatoriamente
      this.lastDirectionChangeTime = currentTime; // Resetear el temporizador
      this.directionChangeInterval = Math.random() * 1000 + 2000;
    }

    // Movimiento del enemigo hacia abajo
    this.y += this.speed;

    // Movimiento horizontal
    this.x += this.directionX * (this.speed * 0.5);

    // Si el enemigo toca los bordes del canvas, cambiar dirección
    if (this.x <= 0 || this.x + this.width >= this.canvasWidth) {
      this.directionX *= -1; // Invertir dirección si toca los bordes
    }
  }

  draw(ctx, currentTime) {
    if (currentTime - this.lastFrameTime > this.animationInterval) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
      this.lastFrameTime = currentTime;
    }

    // Dibujar al enemigo
    ctx.drawImage(
      this.images[this.imageIndex],
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
