const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const baseWidth = 1600;
const baseHeight = 900;
function resizeCanvas() {
  const rect = document.body.getBoundingClientRect();
  const scale = Math.min(rect.width / baseWidth, rect.height / baseHeight);
  canvas.style.width = `${baseWidth * scale}px`;
  canvas.style.height = `${baseHeight * scale}px`;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
//keys
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  delete keys[e.key];
});
//teren
const image = new Image();
image.src = "teren.png";

const teren = {
  left: 0,
  right: 1600,
  top: 20,
  bottom: 900 - 20,
};

const ball = {
  x: 800,
  y: 450,
  radius: 20,
  vx: 5,
  vy: 5,
  color: "yellow",
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  },
  update: function () {
    this.x += this.vx;
    this.y += this.vy;
    //gol in poarta oponent
    if (this.x < teren.left - this.radius) {
      this.x = 800;
      this.y = 450;
      this.vx *= -1;
      player.score += 1;
    }
    //respins de oponent - ciocnire cu oponent
    if (
      this.x < teren.left + this.radius + opponent.width &&
      this.y + this.radius > opponent.y &&
      this.y - this.radius < opponent.y + opponent.height
    ) {
      this.x = teren.left + this.radius + opponent.width;
      this.vx *= -1;
    }
    //gol in poarta player
    if (this.x > teren.right - this.radius) {
      this.x = 800;
      this.y = 450;
      this.vx *= -1;
      opponent.score += 1;
    }
    //respins de player - ciocnire cu player
    if (
      this.x > teren.right - this.radius - player.width &&
      this.y + this.radius > player.y &&
      this.y - this.radius < player.y + player.height
    ) {
      this.x = teren.right - this.radius - player.width;
      this.vx *= -1;
    }
    //respins de teren sus
    if (this.y < teren.top + this.radius) {
      this.y = teren.top + this.radius;
      this.vy *= -1;
    }
    //respins de teren jos
    if (this.y > teren.bottom - this.radius) {
      this.y = teren.bottom - this.radius;
      this.vy *= -1;
    }
  },
};
//player si opponent
const opponent = {
  x: 0,
  y: 450 - 75,
  width: 30,
  height: 150,
  speed: 5,
  color: "rgb(18, 22, 215)",
  score: 0,
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  update: function () {
    //console.log(keys);
    if (keys["w"]) {
      this.y -= this.speed;
      if (this.y < teren.top) {
        this.y = teren.top;
      }
    }
    if (keys["s"]) {
      this.y += this.speed;
      if (this.y > teren.bottom - this.height) {
        this.y = teren.bottom - this.height;
      }
    }
  },
};

const player = {
  x: 1600 - 30,
  y: 450 - 75,
  width: 30,
  height: 150,
  speed: 5,
  color: "rgb(215, 18, 18)",
  score: 0,
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },

  update: function () {
    if (keys["ArrowUp"]) {
      this.y -= this.speed;
      if (this.y < teren.top) {
        this.y = teren.top;
      }
    }
    if (keys["ArrowDown"]) {
      this.y += this.speed;
      if (this.y > teren.bottom - this.height) {
        this.y = teren.bottom - this.height;
      }
    }
  },
};

const score = {
  draw: function () {
    ctx.fillStyle = "black";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${player.score}`, 800 + 100, 70);
    ctx.fillText(`${opponent.score}`, 800 - 100, 70);
  },
};

//loop game
function gameLoop() {
  ctx.clearRect(0, 0, baseWidth, baseHeight);
  if (image.complete) {
    ctx.drawImage(image, 0, 0, baseWidth, baseHeight);
  }
  player.update();
  opponent.update();
  ball.update();
  opponent.draw();
  player.draw();
  ball.draw();
  score.draw();

  requestAnimationFrame(gameLoop);
}
gameLoop();
