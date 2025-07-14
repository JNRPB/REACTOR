

export function initFxCanvas(gameArea) {
  const canvas = document.getElementById("fxCanvas");
  const ctx = canvas.getContext("2d");

  window.fxCanvas = canvas;
  window.fxCtx = ctx;
  window.fxParticles = [];

  function resizeCanvas() {
    canvas.width = gameArea.clientWidth;
    canvas.height = gameArea.clientHeight;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}
