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
      this.game.ctx.fillStyle = "gray";
      this.game.ctx.fill();
    }
  }
  collide(x, y) {
    // isMouseIn(radius,sides,center[0],center[1],mp.x,mp.y)
    var m = this.r * Math.cos(Math.PI / this.side),
      d = Math.hypot(x - this.x, y - this.y),
      a = Math.atan2(this.y - y, x - this.x);
    const clicked =
      d <= (this.r + m) / 2 + (Math.cos(a * this.side) * (this.r - m)) / 2;
    if (clicked) this.disabled = !this.disabled;
  }
}
