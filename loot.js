function spawnRocketLoot(x, y) {
  const loot = document.createElement('img');
  loot.src = 'images/loot/rocket-icon.png';
  loot.alt = 'rocket loot'
  loot.classList.add('loot');
  loot.dataset.type = 'rocket';
  

  loot.style.position = 'absolute';
  loot.style.left = `${x}px`;
  loot.style.top = `${y}px`;
  loot.style.fontSize = '30px';  // bigger for visibility
  loot.style.pointerEvents = 'auto';  // so you can interact if needed
  loot.style.zIndex = 10000;
  
  loot.style.borderRadius = '6px';
  loot.style.padding = '4px 6px';
  loot.style.userSelect = 'none';
  loot.style.transition = 'transform 1s ease-out, opacity 1s';



  // Append to gameArea
  gameArea.appendChild(loot);

  //Wait for a click

  loot.addEventListener('click', () => {
    if (rocketCount < 5) {
        rocketCount += 5;
        updateRocketDisplay();
        loot.remove();
    }
    else if (rocketCount >= 5){return;}
    
  });

  // Animate upward & fade out after slight delay
  setTimeout(() => {
    loot.style.transform = 'translateY(-40px)';
    loot.style.opacity = '0';
  }, 11000);

  // Remove from DOM after animation completes
  setTimeout(() => {
    loot.remove();
  }, 11000);
}
