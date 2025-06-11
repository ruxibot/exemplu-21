import {socket} from "./socket.js"
import { drawGame } from "./draw-game.js";
socket.on("connect", () => {
  console.log("Connected to server");
  console.log("ID: " + socket.id);
});
/* window.addEventListener("beforeunload", () => {
    socket.disconnect();
  }); */

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

let gameState="waiting"; // waiting,  in-game
const info = document.getElementById("info");
const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
game.style.display = "none";
const inputName = document.getElementById("username");
const joinButton = document.getElementById("join");
const room = document.getElementById("room");
const hero = document.getElementById("hero");
const playerList = document.getElementById("player-list");
const message=document.getElementById("message");
const countdown=document.getElementById("countdown")
joinButton.addEventListener("click", () => {
  const username = inputName.value;
  socket.emit("join", { username });
  inputName.disabled = true;
  joinButton.disabled = true;
});
socket.on("waiting", () => {
  message.textContent = "Waiting for players...";
});

socket.on("start-game", ({roomId, role, name}) => {
  let color="blue"
  info.textContent = name;
  room.textContent = roomId;
  if (role === "player1") {
    color="blue"
  } else if (role === "player2") {
    color="red"
  }
  
  

  hero.textContent = `You are paddle ${color}.  Your name: ${
    name || "Anonymous"
  }  `
});



socket.on("start-game", () => {
  message.textContent = "Game will start soon.";
countdown.style.display = "block";
countdown.textContent = "3";
setTimeout(() => {
  countdown.textContent = "2";
}, 1000);
setTimeout(() => {
  countdown.textContent = "1";
}, 2000);
setTimeout(() => {
  countdown.style.display = "none";
  game.style.display = "block";
  lobby.style.display = "none";
}, 3000);
});

socket.on("update-ball", (ball) => {
  drawGame(ball);
  
})
