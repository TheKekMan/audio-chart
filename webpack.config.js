const Path = require("path");
const HtmlWebpack = require("html-webpack-plugin");

module.exports = () => {
  return {
    entry: "./src/index.tsx",
    resolve: {
      extensions: [".tsx", ".js", ".ts"],
      modules: ["node_modules", "src"],
    },
    output: {
      path: Path.resolve(__dirname, "build"),
      filename: "index_bundle.js",
      publicPath: "/",
    },
    module: {
      rules: [
        { test: /\.(js)$/, use: "babel-loader" },
        { test: /\.(css)$/, use: ["style-loader", "css-loader"] },
        {
          test: /\.(png|jpg)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ["babel-loader", "react-svg-loader"],
        },
        {
          test: /\.(tsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                [
                  "@babel/preset-typescript",
                  {
                    runtime: "automatic",
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    mode: "development",
    plugins: [
      new HtmlWebpack({
        template: "./public/index.html",
      }),
    ],
  };
};
