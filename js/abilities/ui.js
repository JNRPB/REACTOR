import { gameState } from "../state.js";

export function renderAbilitiesPanel() {
  const panel = document.getElementById("abilitiesPanel");
  panel.innerHTML = ""; // clear previous content

  const totalSlots = 16; // 8 rows × 2 cols

  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement("div");
    slot.classList.add("abilitySlot");

    if (i < gameState.abilities.unlocked.length) {
      slot.textContent = gameState.abilities.unlocked[i]; // or use icons
    } else {
      slot.textContent = "?";
    }

    panel.appendChild(slot);
  }
}




