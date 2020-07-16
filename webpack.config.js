const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DevLatestPlugin = require("./lib/dev-latest-plugin");

module.exports = {
  entry: {
    index: path.resolve(__dirname, "src/index.js")
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new DevLatestPlugin({
      port: 8090
    })
  ]
};
