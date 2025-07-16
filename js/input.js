
export function setupMouseTracking(gameArea, mouseState) {
  gameArea.addEventListener("mousemove", (e) => {
    const rect = gameArea.getBoundingClientRect();
    mouseState.x = e.clientX - rect.left;
    mouseState.y = e.clientY - rect.top;
  });

  gameArea.addEventListener("mousedown", () => {
    mouseState.isDown = true;
  });

    gameArea.addEventListener("mouseup", () => {
    mouseState.isDown = false;
  });
}
