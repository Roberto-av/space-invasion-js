export class Mejoras {
  constructor(player) {
    this.player = player;
    this.opcionesMejoras = [
      this.vidaExtra.bind(this),
      this.incrementarVelocidadDisparo.bind(this),
      this.aumentarNumeroBalas.bind(this),
      this.aumentarVelocidadNave.bind(this),
      this.recuperarVidas.bind(this),
      this.dispararBalasLado.bind(this),
    ];
  }

  // Seleccionar 3 mejoras aleatorias de la lista
  obtenerMejorasAleatorias() {
    const mejorasAleatorias = [];

    while (mejorasAleatorias.length < 3) {
      const mejoraIndex = Math.floor(
        Math.random() * this.opcionesMejoras.length
      );

      const mejora = this.opcionesMejoras[mejoraIndex];

      if (!mejorasAleatorias.includes(mejora)) {
        mejorasAleatorias.push(mejora);
      }
    }

    return mejorasAleatorias;
  }

  vidaExtra() {
    this.player.gainLife();
  }

  incrementarVelocidadDisparo() {
    this.player.shootInterval -= 100;
  }

  aumentarNumeroBalas() {
    this.player.aumentarNumeroBalas();
  }

  dispararBalasLado() {
    this.player.activarDisparoLateral();
  }

  enemigosArrojanBalas() {
    console.log("Enemigos arrojarán balas");
  }

  lanzarGranadas() {
    console.log("Granadas activadas");
  }

  aumentarVelocidadNave() {
    this.player.speed += 50;
    console.log("Velocidad de la nave aumentada");
  }

  recuperarVidas() {
    this.player.recuperarTodasLasVidas();
  }

  evolucionarNave() {
    console.log("Nave evolucionada");
  }

  armaLegendaria() {
    console.log("Arma legendaria obtenida");
  }
}
