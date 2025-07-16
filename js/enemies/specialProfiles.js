export const sniper = {
    x: 200,
    y: 300,
    width: 40,
    height: 40,
    isProtected: true,
    canShoot: false,
    draw(ctx) {
        ctx.fillStyle = this.isProtected ? "blue" : "red";  // Blue if shielded, red if vulnerable
    ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.isProtected){
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }
    }
}

export function spawnSniper(activeSnipers) {
    return {
            x: 200,
    y: 300,
    width: 40,
    height: 40,
    isProtected: true,
    canShoot: false,
        draw(ctx) {
        ctx.fillStyle = this.isProtected ? "blue" : "red";  // Blue if shielded, red if vulnerable
    ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.isProtected){
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }
    },
     
    }


 
}