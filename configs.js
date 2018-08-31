const path = require('path')

const root = __dirname
const dest = './_output'

const input = {
  src: './import',
  file: 'input.xml'
}

const webpack = {
  entry: {
    main: path.resolve(root, 'src', 'devServer.js')
  },
  output: {
    path: path.resolve(root, dest)
  },
  devServer: {
    contentBase: path.resolve(root, input.src),
  }
}

// configs.clean = {
//   src: [
//     path.resolve(configs.dest, '_data/!(site).yml'),
//     path.resolve(configs.dest, '+(drafts|posts)')
//   ]
// }

module.exports = {
  root,
  dest,
  input,
  webpack
}
