const path = require("path");

module.exports = {
  mode: "production",
  entry: "./lib/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              babelrc: false,
              configFile: false,
              presets: [require.resolve("@wordpress/babel-preset-default")],
            },
          },
        ],
      },
    ],
  },
  externals: {
    react: "react",
  },
  resolve: {
    extensions: [".js"],
  },
};
