const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebSocket = require("ws");
const simpleGit = require("simple-git");
const fs = require("fs");

const defaultOptions = {
  port: 8090,
  duration: 5000 // ping 时间周期
};

class DevLatestPlugin {
  constructor(options) {
    this.wss = new WebSocket.Server(Object.assign(defaultOptions, options));
    this.git = simpleGit();
    this.options = options;
  }
  getHash() {
    return new Promise((resolve, reject) => {
      this.git.log((err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  apply(compiler) {
    console.log(compiler.options.mode);
    compiler.hooks.compilation.tap("DevLatestPlugin", compilation => {
      console.log("The compiler is starting a new compilation...");
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        "DevLatestPlugin", // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          this.getHash().then(res => {
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

          this.wss.on("connection", ws => {
            ws.on("message", message => {
              console.log("received: %s", message);
              ws.send("yeah");
            });
            this.git.log((err, data) => {
              ws.send(data.all.shift().hash);
            });
            setInterval(() => {
              this.git.log((err, data) => {
                ws.send(data.all.shift().hash);
              });
            }, this.options.duration);
          });
        }
      );
    });
  }
}

module.exports = DevLatestPlugin;
