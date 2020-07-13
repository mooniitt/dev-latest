const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DevLatestPlugin = require("./dev-latest-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [new HtmlWebpackPlugin(), new DevLatestPlugin()]
};
