import { gameState } from "../state.js";

export function initAbilityButtons(rocketSlot,rocketCountLabel,bouncyBallSlot) {

  

  
  rocketSlot.addEventListener("click", () => {
    if (gameState.rocketCount > 0) gameState.currentAbility = "rocket";
  });

  bouncyBallSlot.addEventListener("click", () => {
    if (gameState.bouncyBallFull) gameState.currentAbility = "bouncyBall";
  });


}

  export function updateRocketDisplay(rocketSlot, rocketCountLabel) {
    rocketCountLabel.textContent = gameState.rocketCount;
    rocketSlot.style.opacity = gameState.rocketCount > 0 ? "1" : "0.4";
  };

  export function updateBouncyBallDisplay(bouncyBallSlot){
    bouncyBallSlot.style.opacity = gameState.bouncyBallFull ? "1" : "0.4";
  };



