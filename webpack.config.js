const devMode =
  process.env.NODE_ENV === "production" ? "production" : "development";
const path = require("path");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { NetlifyPlugin } = require('netlify-webpack-plugin');
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
    publicPath: '/',
  },
  devServer: {
    open: true,
    port: 5333,
    hot: false,
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/index.html' }, // all requests to index.html
      ],
    },
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
    new NetlifyPlugin({
      redirects: [
        {
          from: "/*",
          to: "/index.html",
          status: 200
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          devMode === "production"
            ? MiniCSSExtractPlugin.loader
            : "style-loader",
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              }
            }
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/, /\.module\.css$/],
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
        test: /\.(avif|jpe?g||png|webp)$/,
        type: "asset",
      },
      {
        test: /\.svg$/i,
        type: "asset",
        resourceQuery: { not: [/component/] }, // exclude react component if *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: /component/, // *.svg?component
        use: ['@svgr/webpack'],
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
