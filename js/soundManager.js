export class SoundManager {
  constructor() {
    this.backgroundMusic = new Audio("sonidos/fondo/neon-gaming-128925.mp3");
    this.shootSound = new Audio("sonidos/disparos/scifi002.mp3");
    this.explosionSound = new Audio("sonidos/explosion/007131711_prev.mp3");

    // Configurar volumen y bucle
    this.backgroundMusic.volume = 0.2;
    this.backgroundMusic.loop = true;

    this.shootSound.volume = 0.5;
    this.explosionSound.volume = 0.7;
  }

  playExplosionSound() {
    this.explosionSound.currentTime = 0;
    this.explosionSound.play();
    setTimeout(() => {
      this.explosionSound.pause();
      this.explosionSound.currentTime = 0;
    }, 300);
  }

  playShootSound() {
    this.shootSound.currentTime = 0;
    this.shootSound.play();
  }
}
