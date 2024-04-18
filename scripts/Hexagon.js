class Hexagon {
  constructor(game, x, y, r, disabled = false) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.r = r;
    this.side = 6;
    this.a = (2 * Math.PI) / this.side;
    this.disabled = disabled;
    this.child = {};
  }
  draw() {
    this.game.ctx.beginPath();
    for (let i = 0; i < this.side; i++) {
      this.game.ctx.lineTo(
        this.x + this.r * Math.sin(this.a * i),
        this.y + this.r * Math.cos(this.a * i)
      );
    }
    this.game.ctx.closePath();
    this.game.ctx.strokeStyle = "silver";
    this.game.ctx.stroke();
    if (this.disabled) {
      this.game.ctx.fillStyle = "darkgray";
      this.game.ctx.fill();
    }
  }
}
