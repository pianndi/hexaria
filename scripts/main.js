class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.bound = canvas.getBoundingClientRect();
    this.hexagons = [];
    this.mouse = {
      x: 0,
      y: 0,
    };

    canvas.addEventListener("click", (e) => {
      this.mouse = {
        x: e.clientX - this.bound.left,
        y: e.clientY - this.bound.top,
      };
      this.clickHex(this.mouse.x, this.mouse.y);
    });
    window.addEventListener("resize", () => {
      this.bound = this.canvas.getBoundingClientRect();
    });
  }
  render() {
    this.hexagons.forEach((item) => item.draw());
  }
  generateGrid() {
    const a = (2 * Math.PI) / 6;
    let r = 30;
    for (
      let x = 50;
      x + r * Math.sin(a) < r * 2 * 10 - r;
      x += r * 2 * Math.sin(a)
    ) {
      for (
        let y = 50, j = 0;
        y + r * (1 + Math.cos(a)) < r * 2 * 8 - r * 2;
        y += r * (1 + Math.cos(a)), x += (-1) ** j++ * r * Math.sin(a)
      ) {
        this.hexagons.push(new Hexagon(this, x, y, r));
      }
    }
    for (let i = 0; i < 4; i++) {
      let index = Math.floor(Math.random() * this.hexagons.length);
      this.hexagons[index].disabled = true;
    }
  }
  clickHex(x, y) {
    this.hexagons.forEach((hexagon, i) => {
      // local hex
      hexagon.collide(x, y);
    });
  }
}

function main() {
  const canvas = document.getElementById("cvs");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  const game = new Game(canvas, ctx);
  game.generateGrid();
  console.log(game);

  let lastTime = performance.now();
  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.render();

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

main();
