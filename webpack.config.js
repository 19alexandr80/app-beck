const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.[chunkhash].js",
    path: path.resolve(__dirname, "public"),
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    port: 3000,
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "src", "index.html"),
      // "./src/index.html",
    }),
    new CleanWebpackPlugin(),
  ],
};
