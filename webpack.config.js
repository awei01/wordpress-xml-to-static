const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const configs = require('./configs')
const merge = require('webpack-merge')

module.exports = merge({
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  output: {
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
      template: 'src/index.html',
      inject: true
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
  },
  devServer: {
    port: 3000,
    overlay: true,
    inline: true,
  }
}, configs.webpack)
