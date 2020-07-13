const HtmlWebpackPlugin = require("html-webpack-plugin");

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
          // Tell webpack to move on
          cb(null, data);
        }
      );
    });
  }
}

module.exports = DevLatestPlugin;
