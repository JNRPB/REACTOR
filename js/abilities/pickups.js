// js/abilities/pickups.js

export const purifierTotem = {
  x: 400,
  y: 500,
  width: 30,
  height: 40,
  beamActive: true,
  isDragging: false,

  update(mouse, isMouseDown) {
    if (this.isDragging && !isMouseDown) {
      this.isDragging = false;
    } else if (isMouseDown && this._isMouseInside(mouse.x, mouse.y)) {
      this.isDragging = true;
    }

    if (this.isDragging) {
      this.x = mouse.x - this.width / 2;
      // Optional: clamp x/y to bounds
    }
  },

  draw(ctx) {
        console.log("Inside original draw", this.x, this.y, this.width, this.height);

  // Draw the upward beam
  if (this.beamActive) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(this.x, 0, this.width, this.y);
    ctx.restore();
  }

  // Draw the totem base
  ctx.fillStyle = "#6666ff";
  ctx.fillRect(this.x, this.y, this.width, this.height);

  // Draw the core light on the totem
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(this.x + this.width / 4, this.y + 10, this.width / 2, 5);

  }
};

export function createPurifierTotem(x, y) {
  return {
    x,
    y,
    width: 30,
    height: 40,
    beamActive: true,
    isDragging: false,

    update(mouse, isMouseDown) {
      if (this.isDragging && !isMouseDown) {
        this.isDragging = false;
      } else if (isMouseDown && this._isMouseInside(mouse.x, mouse.y)) {
        this.isDragging = true;
      }

      if (this.isDragging) {
        this.x = mouse.x - this.width / 2;
      }
    },

    draw(ctx) {
      if (this.beamActive) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(this.x, 0, this.width, this.y);
        ctx.restore();
      }

      ctx.fillStyle = "#6666ff";
      ctx.fillRect(this.x, this.y, this.width, this.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(this.x + this.width / 4, this.y + 10, this.width / 2, 5);
    },

    _isMouseInside(mx, my) {
      return (
        mx >= this.x &&
        mx <= this.x + this.width &&
        my >= this.y &&
        my <= this.y + this.height
      );
    },

    isEnemyInBeam(enemy) {
      return (
        this.beamActive &&
        enemy.x >= this.x &&
        enemy.x <= this.x + this.width &&
        enemy.y < this.y
      );
    },
  };
}

