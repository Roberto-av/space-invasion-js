export function drawStartButton(ctx, canvasWidth, canvasHeight) {
    // Botón de fondo con degradado
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = canvasWidth / 2 - buttonWidth / 2;
    const buttonY = canvasHeight / 2 - buttonHeight / 2;
    
    // Crear un degradado
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
    gradient.addColorStop(0, '#ff7e5f');
    gradient.addColorStop(1, '#feb47b');
  
    // Dibujar el botón
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
    ctx.fill();
    
    // Añadir borde
    ctx.strokeStyle = '#333'; 
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Añadir sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    
    // Dibujar el texto
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Jugar', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    
    // Restaurar sombra
    ctx.shadowColor = 'transparent';
  }
  