var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var autoprefixer = require('autoprefixer')
var path = require('path')
module.exports = {
  entry: path.join(__dirname, "/frontend/dev/jsx/app.jsx"),
  output: {
    path: path.join(__dirname, "/frontend/prod"),
    filename: "bundle.js"
  },
  devtool: "source-map",
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
  postcss: [
    autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3'] })
  ],
  plugins: [
    new HtmlWebpackPlugin({template: 'frontend/dev/index.html'}),
    new ExtractTextPlugin('./style.css')
  ]
}
