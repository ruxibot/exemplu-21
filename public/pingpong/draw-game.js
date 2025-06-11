import { socket } from "./socket.js";
console.log(socket);

export const drawGame = (b) => {
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
  const image = new Image();
  image.src = "teren.png";

  const teren = {
    left: 0,
    right: 1600,
    top: 20,
    bottom: 900 - 20,
  };

  const ball = {
    x: b.x,
    y: b.y,
    radius: 20,

    color: "yellow",
    draw: function () {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    },
  };

  const player = {
    x: 800 - 100,
    y: 450,
    width: 20,
    height: 100,
    color: "blue",
    draw: function () {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
  };

  const opponent = {
    x: 800 + 100,
    y: 450,
    width: 20,
    height: 100,
    color: "red",
    draw: function () {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
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

/* image.onload = () => {
     ctx.drawImage(image, 0, 0, baseWidth, baseHeight);
} */
  function draw() {
    ctx.clearRect(0, 0, baseWidth, baseHeight);
   
    opponent.draw();
    player.draw();
    ball.draw();
    score.draw();
  }
  draw();
 
};
