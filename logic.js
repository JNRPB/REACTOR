import { initAbilityButtons } from "./abilities/ui.js";
import { initAbilityFiring } from "./abilities/firing.js";
import { initFxCanvas } from './fx/setup.js';


// In activeEnemiesFile.js
window.activeEnemies = [];
window.fxParticles = [];







window.shieldDisplay = document.getElementById("shieldDisplay");
window.shieldDisplay.textContent = `Shield: ${window.shieldHealth}`;


window.reactorDisplay = document.getElementById("reactorDisplay");
window.reactorDisplay.textContent = `Reactor Health: ${window.reactorHealth}`;


