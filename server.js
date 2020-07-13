const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const simpleGit = require("simple-git");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
  const readStream = fs.createReadStream("./heartbeat.js");
  readStream.pipe(res);
});

server.listen(3000);

// const wss = new WebSocket.Server({ port: 8090 });

// wss.on("connection", function connection(ws) {
//   ws.on("message", function incoming(message) {
//     console.log("received: %s", message);
//     ws.send("yeah");
//   });
// });

// const git = simpleGit();
// setInterval(() => {
//   git.log((err, data) => {
//     console.log(data.all.pop().hash);
//   });
// }, 5000);
