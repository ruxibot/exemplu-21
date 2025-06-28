import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.8.1/dist/socket.io.esm.min.js";
const socket = io("http://192.168.83.167:4004", {
  transports: ["websocket"],
  upgrade: false,
});
// const socket = io("http://localhost:4004");
console.log(socket);

//canvas si info
const info = document.getElementById("info");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gameOverScreen = document.getElementById("gameOverScreen");
const winnerText = document.getElementById("winnerText");
let gameOver = false;

//resize
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

let myPlayer = "";
let myRoom = "";
let lastTimestamp = 0;


const ball = {
  x: 800,
  y: 450,
  radius: 18,
};
const player1 = {
  x: 0,
  y: 450,
  width: 30,
  height: 100,
  score: 0,
};
const player2 = {
  x: 1600 - 30,
  y: 450,
  width: 30,
  height: 100,
  score: 0,
};

//keys
const keys = {};
window.addEventListener("keydown", (e) => {
  if (myPlayer && myRoom) {
    if (e.key == "ArrowUp") {
      keys["ArrowUp"] = true;
      socket.emit("player-keys", { roomId: myRoom, role: myPlayer, keys });
    }
    if (e.key == "ArrowDown") {
      keys["ArrowDown"] = true;
      socket.emit("player-keys", { roomId: myRoom, role: myPlayer, keys });
    }
    //console.log("keys", keys);
  }
});
window.addEventListener("keyup", (e) => {
  if (myPlayer && myRoom) {
    if (e.key == "ArrowUp") {
      delete keys["ArrowUp"];
      socket.emit("player-keys", { roomId: myRoom, role: myPlayer, keys });
    }
    if (e.key == "ArrowDown") {
      delete keys["ArrowDown"];
      socket.emit("player-keys", { roomId: myRoom, role: myPlayer, keys });
    }
    //console.log("keys", keys);
  }
});

socket.on("connect", () => {
  console.log("Connected to server");
  console.log("ID: " + socket.id);
});

socket.on("waiting", () => {
  console.log("waiting");
  info.textContent = "Waiting for opponent...";
});

socket.on("start-game", (data) => {
  const { roomId, role } = data;
  myPlayer = role;
  myRoom = roomId;
  console.log("start game", data);
  info.textContent = `Game will start soon. Room ID: ${roomId} Your role: ${role}`;
  
});

socket.on("update", (data) => {
  //console.log("update", data);
  const { room, timestamp } = data;
  if (!myRoom) return;
  if (myRoom !== room.id) return;
  if (timestamp <= lastTimestamp) {
    console.log("old update", lastTimestamp,timestamp);
    return;
  }
  lastTimestamp = timestamp;
  //console.log("in game update", data);
  info.textContent = `In game update! Room ID: ${
    room.id
  } Your role: ${myPlayer} Player: ${room.players[myPlayer].socketId.slice(
    -4
  )}`;
  ball.x = room.ball.x;
  ball.y = room.ball.y;
  player1.x = room.players.player1.x;
  player1.y = room.players.player1.y;
  player2.x = room.players.player2.x;
  player2.y = room.players.player2.y;
  player1.score = room.players.player1.score;
  player2.score = room.players.player2.score;
});

socket.on("end-game", (data) => {
  console.log("end game", data);
  setTimeout(() => {
    gameOver=true;
  },300)
  
  if (data === myPlayer) {
    winnerText.textContent = "Ai câștigat!";
  } else {
    winnerText.textContent = "Ai pierdut!";
  }
  gameOverScreen.classList.remove("hidden");
});


function loop() {
  if (gameOver) {
    return;
  }
  ctx.clearRect(0, 0, baseWidth, baseHeight);
  if (image.complete) {
    ctx.drawImage(image, 0, 0, baseWidth, baseHeight);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = "bold 50px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${player1.score}`, 800 - 100, 70);
  ctx.fillText(`${player2.score}`, 800 + 100, 70);
  requestAnimationFrame(loop);
}

loop();
