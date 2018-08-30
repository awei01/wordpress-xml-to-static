const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'main.js')
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  output: {
    // path: where to build on file system
    path: path.resolve(__dirname, 'build'),
    // publicPath: src or href path to file
    // (https://webpack.github.io/docs/configuration.html#output-publicpath)
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
    contentBase: path.resolve(__dirname, 'input'),
    port: 3000,
    overlay: true,
    inline: true,
  }
}
