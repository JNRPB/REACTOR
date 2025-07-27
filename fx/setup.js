export function initFxCanvas(gameArea) {
  const canvas = document.getElementById("fxCanvas");
  const ctx = canvas.getContext("2d");

  gameArea.offsetHeight;

  window.fxCanvas = canvas;
  window.fxCtx = ctx;
  window.fxParticles = [];

  function resizeCanvas() {
    canvas.width = gameArea.clientWidth;
    canvas.height = gameArea.clientHeight;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = "5"; // Set appropriately above background, below UI
  }

  resizeCanvas();
}

let bgImage = new Image();
bgImage.src = 'images/bg.jpg'; // or URL

bgImage.onload = () => {
  drawBackground();
};

export function drawBackground() {
  const ctx = window.fxCtx;
  const canvas = window.fxCanvas;
  if (!ctx || !canvas) return;

  // Clear canvas (optional if you want fresh every frame)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw image full size on canvas
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

