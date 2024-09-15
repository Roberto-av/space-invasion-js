export class SoundManager {
  constructor() {
    this.backgroundMusic = new Audio("sonidos/fondo/neon-gaming-128925.mp3");
    this.shootSound = new Audio("sonidos/disparos/scifi002.mp3");
    this.explosionSound = new Audio("sonidos/explosion/007131711_prev.mp3");
    this.lifeLostSound = new Audio("sonidos/perder-vida/wrong-100536.mp3");
    this.gameOverSound = new Audio(
      "sonidos/game-over/8-bit-video-game-lose-sound-version-1-145828.mp3"
    );

    this.backgroundMusic.volume = 0.2;
    this.backgroundMusic.loop = true;

    this.shootSound.volume = 0.5;
    this.explosionSound.volume = 0.7;
    this.lifeLostSound.volume = 0.2;
    this.gameOverSound.volume = 0.3;
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

  playLifeLostSound() {
    this.lifeLostSound.currentTime = 0;
    this.lifeLostSound.play();
    setTimeout(() => {
      this.lifeLostSound.pause();
      this.lifeLostSound.currentTime = 0;
    }, 500);
  }

  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  playGameOverSound() {
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play();
  }

  stopGameOverSound() {
    this.gameOverSound.pause();
    this.gameOverSound.currentTime = 0;
  }
}
