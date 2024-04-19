class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.bound = canvas.getBoundingClientRect();
    this.hexagons = [];
    this.turn = 1;
    this.number = Math.ceil(Math.random() * 20);
    this.current = new Hexagon(
      this,
      this.canvas.width / 2,
      this.canvas.height - 100,
      22,
      true
    );
    this.total = [0, 0];
    this.current.number = this.number;
    this.current.color = this.turn ? "red" : "blue";
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.disabled = 0;
    this.player1 = "Player";
    this.player2 = "Bot";
    canvas.onmousemove = (e) => {
      if (this.gameOver) return;
      this.mouse = {
        x: e.clientX - this.bound.left,
        y: e.clientY - this.bound.top,
      };
      this.hover(this.mouse.x, this.mouse.y);
    };
    canvas.onclick = (e) => {
      if (this.gameOver) return;
      this.mouse = {
        x: e.clientX - this.bound.left,
        y: e.clientY - this.bound.top,
      };
      this.clickHex(this.mouse.x, this.mouse.y);
    };
    window.onresize = () => {
      this.bound = this.canvas.getBoundingClientRect();
    };
  }
  render() {
    this.hexagons.forEach((item) => item.draw());

    this.current.draw();
    this.ctx.font = "18px Arial";
    this.ctx.fillText(
      "Current: ",
      this.canvas.width / 2 - 55,
      this.height - 98
    );
    this.drawStatus();
  }
  // make a grid hex
  generateGrid() {
    const a = (2 * Math.PI) / 6;
    let r = 35;
    for (
      let x = 60;
      x + r * Math.sin(a) < r * 2 * 10 - r;
      x += r * 2 * Math.sin(a)
    ) {
      for (
        let y = 60, j = 0;
        y + r * (1 + Math.cos(a)) < r * 2 * 8 - r * 2;
        y += r * (1 + Math.cos(a)), x += (-1) ** j++ * r * Math.sin(a)
      ) {
        // this.hexagons.push(
        //   new Hexagon(
        //     this,
        //     x,
        //     y,
        //     r,
        //     false,
        //     this.number,
        //     this.turn ? "red" : "blue"
        //   )
        // );
        this.hexagons.push(new Hexagon(this, x, y, r));
      }
    }
    for (let i = 0; i < 4; i++) {
      let index = Math.floor(Math.random() * this.hexagons.length);
      this.hexagons[index].disabled = true;
    }
    this.disabled = this.hexagons.filter((value) => value.disabled).length;
  }
  clickHex(x, y) {
    let ada = false;
    this.hexagons.forEach((hexagon, i) => {
      // local hex
      if (
        hexagon.collide(x, y) &&
        hexagon.number < this.number &&
        hexagon.color != (this.turn ? "red" : "blue") &&
        !ada
      ) {
        ada = true;
        this.hexagons[i].color = this.turn ? "red" : "blue";
        this.hexagons[i].number = this.number;
        this.total = [0, 0];
        this.hexagons.forEach((item, index) => {
          if (
            this.circleOverlap(item, hexagon) &&
            hexagon.color == item.color &&
            i != index &&
            item.number <= 22
          ) {
            this.hexagons[index].number++;
          }
          this.total[item.color == "red" ? 0 : 1] += item.number;
        });
        this.number = Math.ceil(Math.random() * 20);
        this.turn = !this.turn;
        this.current.number = this.number;
        this.current.color = this.turn ? "red" : "blue";
      }
    });
    this.over();
  }
  hover(x, y) {
    let ada = false;
    this.hexagons.forEach((hexagon, i) => {
      if (
        hexagon.collide(x, y) &&
        hexagon.color != (this.turn ? "red" : "blue") &&
        hexagon.number < this.number &&
        !ada
      ) {
        ada = true;
        this.hexagons[i].hover = true;
      } else {
        this.hexagons[i].hover = false;
      }
    });
  }
  distance(a, b) {
    const distanceX = a.x - b.x;
    const distanceY = a.y - b.y;

    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }
  circleOverlap(a, b) {
    const radii = a.r + b.r;

    return this.distance(a, b) <= radii;
  }
  drawStatus() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.width / 4, this.height - 60, 20, 20);
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(
      this.width / 4 + (this.width / 4) * 2,
      this.height - 60,
      20,
      20
    );
    this.ctx.fillStyle = "silver";
    this.ctx.textAlign = "start";
    this.ctx.fillText(this.player1, this.width / 4 + 25, this.height - 50);
    this.ctx.textAlign = "end";
    this.ctx.fillText(
      this.player2,
      this.width / 4 + (this.width / 4) * 2 - 5,
      this.height - 50
    );
    this.ctx.textAlign = "center";
    this.ctx.font = "bold 30px Arial";
    this.ctx.fillText(this.total[0], this.width / 4 + 10, this.height - 20);
    this.ctx.fillText(
      this.total[1],
      this.width / 4 + (this.width / 4) * 2 + 10,
      this.height - 20
    );
  }
  over() {
    const filled = this.hexagons.filter(
      (value) => !value.disabled && value.number
    ).length;
    this.gameOver = this.hexagons.length - this.disabled == filled;
    if (this.gameOver) {
      const score = {
        player1: {
          name: this.player1,
          score: this.total[0],
        },
        player2: {
          name: this.player2,
          score: this.total[1],
        },
        date: Date.now(),
      };
      const lastScore =
        JSON.parse(localStorage.getItem("leaderboard")) || new Array();
      lastScore.push(score);
      localStorage.setItem("leaderboard", JSON.stringify(lastScore));

      getLeaderboard();
    }
  }
}

function main() {
  getLeaderboard();

  document.querySelector(".container.home").classList.add("hide");
  document.querySelector(".container.game").classList.remove("hide");
  document.querySelector(".alert").classList.add("hide");
  const canvas = document.getElementById("cvs");
  canvas.width = 700;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  const game = new Game(canvas, ctx);
  game.generateGrid();
  game.player1 = document.getElementById("player1").value;
  game.player2 = document.getElementById("player2").value;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.render();
    if (!game.gameOver) {
      requestAnimationFrame(animate);
    } else {
      document.querySelector(".alert").classList.remove("hide");
      //
    }
  }
  requestAnimationFrame(animate);
}

document.querySelectorAll(".close").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.target.parentElement.parentElement.classList.add("hide");
  });
});
document.getElementById("lawan").addEventListener("change", (e) => {
  if (e.target.value == "bot") {
    document.getElementById("player2").disabled = true;
    document.getElementById("player2").value = "Bot";
  } else {
    document.getElementById("player2").disabled = false;
    document.getElementById("player2").value = "";
  }
});
playBtn.addEventListener("click", () => {
  if (
    document.getElementById("player1").value &&
    document.getElementById("player2").value
  ) {
    main();
  }
});

function getLeaderboard() {
  const leaderboard =
    JSON.parse(localStorage.getItem("leaderboard")) || new Array();
  leaderboard.sort((a, b) => b.date - a.date);
  let html = "";
  leaderboard.forEach((item) => {
    html += `
    <div class="item">
            <div>
              <span class="name">${item.player1.name} vs ${item.player2.name}</span>
              <span class="score">${item.player1.score} - ${item.player2.score}</span>
            </div>
            <button>Detail</button>
          </div>
    `;
  });
  document.getElementById("leader").innerHTML = html;
}
