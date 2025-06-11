import {socket} from "./socket.js"
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

socket.on("joined", (data) => {
  info.textContent = data.player.name;
  room.textContent = data.room;

  hero.textContent = `Player ${data.player.id.slice(-4)} Name: ${
    data.player.name || "Anonymous"
  }  Team: ${data.player.team}`;
  message.textContent = "Wait for other players to join the game.";
});

socket.on("queue", (queue) => {
  playerList.innerHTML = "";
  queue.forEach((player) => {
    const playerElement = document.createElement("li");
    playerElement.textContent = `Player ${player.id.slice(-4)} Name: ${
      player.name || "Anonymous"
    }  Team: ${player.team}`;
    playerList.appendChild(playerElement);
  });
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

import "./game.js";
