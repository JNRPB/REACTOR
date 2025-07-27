import { spawnShieldPickupParticles } from "../../fx/particles.js";
import { updateShieldHealthBar } from "../defence/defence.js";
import { gameState } from "../state.js";
import { lootTables } from "./lootTables.js";

export function handleLootDrop(enemy){
    const tableID = enemy.lootTableID;
    const table = lootTables[tableID];

    if (!table) return [];

    const droppedItems = [];

    for (const entry of table) {
        if (entry.guaranteed) {
            droppedItems.push(entry.itemId);
        } else {
            const roll = Math.random() * 100;
            if (roll < entry.dropChance){
                droppedItems.push(entry.itemId);
            }
        }
    }

    return droppedItems;
}

export function renderDrop(itemId, position) {
    
  const drop = document.createElement("div");
  drop.classList.add("pickup", `pickup-${itemId}`);

  // Set position (adjust if needed for centering)
  drop.style.position = "absolute";
  drop.style.left = `${position.x}px`;
  drop.style.top = `${position.y}px`;

  // Optional: drop animation
  drop.style.transition = "transform 0.3s ease-out";
  drop.style.transform = "translateY(-20px)";

  // Append to game area
  const gameArea = document.getElementById("gameArea");
  if (!gameArea) {
    console.warn("Game Area Not Found!!");
    return;
  }
  gameArea.appendChild(drop);

  // Collision/pickup logic
  drop.addEventListener("mouseenter", () => {
    handlePickup(itemId, position);
    drop.remove();
  });
}

function handlePickup(itemId, position) {
  switch (itemId) {
    case "mini_shield_restore":
      gameState.shieldHealth = Math.min(gameState.maxShieldHealth, gameState.shieldHealth + 5);
      updateShieldHealthBar();
      spawnShieldPickupParticles(position.x, position.y);
      break;
    case "shield_restore_25":
      gameState.shieldHealth = Math.min(gameState.maxShieldHealth, gameState.shieldHealth + (gameState.maxShieldHealth * 0.25));
      updateShieldHealthBar();
      spawnShieldPickupParticles(position.x, position.y);
      break;
    case "shield_restore_100":
      gameState.shieldHealth = gameState.maxShieldHealth;
      updateShieldHealthBar();
      spawnShieldPickupParticles(position.x, position.y);
      break;
    case "surge_passifier":
        if(!gameState.abilities.unlocked.includes("surge_passifier")){
      gameState.abilities.unlocked.push("surge_passifier");
      renderAbilitiesPanel();
        }
      // TODO: update UI & flash
      break;
    default:
      console.warn(`Unknown pickup: ${itemId}`);
  }

  // TODO: generic visual and sound
}

