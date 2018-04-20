const path = require('path');
const webpack = require("webpack");
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  // Where to start bundling
  entry: {
    app: "./resources/js/app.js",
    materialize: "./resources/js/materialize.js",
  },

  // Where to output
  output: {
    // Output to the same directory
    path: __dirname + '/public/javascripts',

    // Capture name from the entry using a pattern
    filename: "[name].js",
  },

  // How to resolve encountered imports
  // module: {
  //   rules: [
  //     {
  //       test: /\.scss$/,
  //       use: [
  //         {loader: "style-loader"}, // creates style nodes from JS strings
  //         {loader: "css-loader"}, // translates CSS into CommonJS
  //         {loader: "sass-loader"}, // compiles Sass to CSS
  //       ],
  //     },
  //     {
  //       test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
  //       loader: 'url-loader',
  //       options: {
  //         name: 'fonts/[name].[ext]',
  //         limit: 50,
  //       },
  //     },
  //     {
  //       test: /\.js$/,
  //       use: "babel-loader", //use this for ES6 features
  //       exclude: /node_modules/,
  //     },
  //   ],
  // },

  // // What extra processing to perform
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "common",
          chunks: "initial",
          minChunks: 2,
          minSize: 0, 
        }
      }
    },
    occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
  }

  // // Adjust module resolution algorithm
  // resolve: {
  //   alias: { },
  // },
};