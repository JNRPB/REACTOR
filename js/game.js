//********************************************************************************************* Start Game */

import { spawnWave } from "./enemies/logic.js";
import { initFxCanvas } from "../fx/setup.js";
import { gameLoop } from "./loop.js";
import { setupMouseTracking } from "./input.js";

import { gameState } from "./state.js";



document.addEventListener("DOMContentLoaded", () => {
  gameState.gameArea = document.getElementById("gameArea");
  initGame();
});

export function initGame() {
  const gameArea = gameState.gameArea;
  const startButton = document.getElementById("startGameBtn");
  const ambientMusic = document.getElementById("ambientMusic");




  

  ambientMusic.volume = 0.15;

  //Default inits

  startButton.addEventListener("click", () => {
    
    
    
    gameState.shieldHealth = 300;
    gameState.reactorHealth = 100;
    gameState.enemiesSpawned = 0;
    gameState.enemiesKilled = 0;
    initFxCanvas(gameArea);
    
    
    
    
    
    spawnWave(gameArea);
    ambientMusic.play().catch(() => {
      console.log("User interaction needed to play audio");
    });
    requestAnimationFrame(gameLoop);
    setupMouseTracking(gameArea, gameState.mouseState);
    startButton.remove();
  });

}
