const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebSocket = require("ws");
const simpleGit = require("simple-git");

const wss = new WebSocket.Server({ port: 8090 });

class DevLatestPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("DevLatestPlugin", compilation => {
      console.log("The compiler is starting a new compilation...");
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        "DevLatestPlugin", // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          data.bodyTags.push({
            tagName: "script",
            attributes: {
              defer: false,
              //   src: "http://www.zhifuchedao.xyz:3000/"
              src: "http://localhost:3000/"
            }
          });

          const git = simpleGit();

          wss.on("connection", function connection(ws) {
            ws.on("message", function incoming(message) {
              console.log("received: %s", message);
              ws.send("yeah");
            });
            setInterval(() => {
              git.log((err, data) => {
                ws.send(data.all.pop().hash);
              });
            }, 5000);
          });

          cb(null, data);

          // Tell webpack to move on
          // cb(null, data);
        }
      );
    });
  }
}

module.exports = DevLatestPlugin;
