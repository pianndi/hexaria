class Hexagon {
  constructor(game, x, y, r, disabled = false) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.r = r;
    this.side = 6;
    this.a = (2 * Math.PI) / this.side;
    this.disabled = disabled;
    this.number = 0;
    this.color = false;
    this.hover = false;
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
      this.game.ctx.fillStyle = "gray";
      this.game.ctx.fill();
    } else {
      if (this.color) {
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fill();
      }
      if (this.number) {
        this.game.ctx.fillStyle = "silver";
        this.game.ctx.font = "20px Arial";
        this.game.ctx.textAlign = "center";
        this.game.ctx.textBaseline = "middle";
        this.game.ctx.fillText(this.number, this.x, this.y);
      }
    }
  }
  collide(x, y) {
    var m = this.r * Math.cos(Math.PI / this.side),
      d = Math.hypot(x - this.x, y - this.y),
      a = Math.atan2(this.y - y, x - this.x);
    const clicked =
      d <= (this.r + m) / 2 + (Math.cos(a * this.side) * (this.r - m)) / 2;
    return clicked;
  }
}
