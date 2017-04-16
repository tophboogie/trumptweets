var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var autoprefixer = require('autoprefixer')
var path = require('path')
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin')

module.exports = {
  entry: path.join(__dirname, "/frontend/dev/jsx/app.jsx"),
  output: {
    path: path.join(__dirname, "/frontend/prod"),
    filename: "bundle.js"
  },
  devtool: "eval",
  module: {
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    loaders: [
      {
        test: /\.(jsx|js)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract("css-loader?sourceMap!sass-loader?sourceMap!postcss-loader")
      }
    ]
  },
  sassLoader: {
    includePaths: [
      __dirname + "/node_modules/bootstrap-sass/assets/stylesheets"
    ]
  },
  postcss: [
    autoprefixer({ browsers: [
      "Android 2.3",
      "Android >= 4",
      "Chrome >= 20",
      "Firefox >= 24",
      "Explorer >= 8",
      "iOS >= 6",
      "Opera >= 12",
      "Safari >= 6"
    ] })
  ],
  plugins: [
    new HtmlWebpackPlugin({template: 'frontend/dev/index.html'}),
    new ExtractTextPlugin('./style.css'),
    new webpackUglifyJsPlugin({
      cacheFolder: path.resolve(__dirname, 'cached_uglify'),
      debug: true,
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: true,
      }
    })
  ]
}
