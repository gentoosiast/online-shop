const devMode =
  process.env.NODE_ENV === "production" ? "production" : "development";
const path = require("path");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const WebpackPWAManifestPlugin = require("webpack-pwa-manifest");

module.exports = {
  mode: devMode,
  devtool: devMode === "production" ? "source-map" : "eval-source-map",
  entry: {
    index: "./src/index",
  },
  output: {
    clean: devMode === "production",
    filename: "[name].[contenthash].js",
    assetModuleFilename: "./assets/[name].[contenthash][ext][query]",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    port: 5333,
    hot: false,
    client: {
      overlay: true,
      progress: true,
    },
    liveReload: true,
    watchFiles: ["src/*.html"],
  },
  plugins: [
    new ESLintPlugin(),
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: path.resolve("./src/index.html"),
      chunks: ["index"],
    }),
    new WebpackPWAManifestPlugin({
      name: "Online Shop",
      publicPath: "./",
      orientation: "omit",
      icons: [
        {
          src: path.resolve("./src/assets/icon-192.png"),
          destination: "assets",
          sizes: "192x192",
        },
        {
          src: path.resolve("./src/assets/icon-512.png"),
          destination: "assets",
          sizes: "512x512",
        },
      ],
    }),
    new MiniCSSExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new StylelintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          devMode === "production"
            ? MiniCSSExtractPlugin.loader
            : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /favicon\.ico$/,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /\.(avif|jpe?g||png|svg|webp)$/,
        type: "asset",
      },
      {
        test: /\.(mp3|ogg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/media/[name][ext]",
        },
      },
      {
        test: /\.(eot|otf|ttf|woff2?)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
  optimization: {
    minimizer: [`...`, new CSSMinimizerPlugin()],
  },
};
