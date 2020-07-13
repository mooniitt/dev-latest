const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebSocket = require("ws");
const simpleGit = require("simple-git");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 8090 });
const git = simpleGit();

function getHash() {
  return new Promise((resolve, reject) => {
    git.log((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

class DevLatestPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("DevLatestPlugin", compilation => {
      console.log("The compiler is starting a new compilation...");
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        "DevLatestPlugin", // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          getHash().then(res => {
            // Manipulate the content
            const jscode = fs.readFileSync("./heartbeat.js");
            data.bodyTags.push({
              tagName: "script",
              attributes: {
                defer: true,
                id: "dev-latest",
                hash: res.all.shift().hash
              },
              innerHTML: jscode
            });
            // Tell webpack to move on
            cb(null, data);
          });

          wss.on("connection", function connection(ws) {
            ws.on("message", function incoming(message) {
              console.log("received: %s", message);
              ws.send("yeah");
            });
            setInterval(() => {
              git.log((err, data) => {
                ws.send(data.all.shift().hash);
              });
            }, 5000);
          });
        }
      );
    });
  }
}

module.exports = DevLatestPlugin;
