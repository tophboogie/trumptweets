var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var autoprefixer = require('autoprefixer')
module.exports = {
  entry: "./frontend/dev/jsx/app.jsx",
  output: {
    path: __dirname + "/frontend/prod",
    filename: "bundle.js"
  },
  devtool: "source-map",
  module: {
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
