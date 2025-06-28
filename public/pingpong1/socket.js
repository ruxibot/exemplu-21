import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.8.1/dist/socket.io.esm.min.js";
export const socket = io("http://192.168.83.167:4001", {
  transports: ["websocket"],
  upgrade: false,
});
//const socket = io("http://localhost:4001");
console.log(socket);
