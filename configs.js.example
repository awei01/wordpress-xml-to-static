const path = require('path')

const root = __dirname
const dest = './_output'

const input = {
  dir: './import',
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
    contentBase: path.resolve(root, input.dir),
  }
}

const clean = {
  src: [
    path.resolve(dest, '_data/!(site).yml'),
    path.resolve(dest, '+(drafts|posts)')
  ]
}

const postProcess = (input) => {
  return input
}

const build = {
  src: path.resolve(input.dir, input.file),
  authors: {
    dest: '_data/authors.yml'
  },
  categories: {
    dest: '_data/categories.yml'
  },
  draft: {
    dest: 'drafts',
    postProcess
  },
  publish: {
    dest: 'posts',
    postProcess
  },
}

module.exports = {
  root,
  dest,
  input,
  webpack,
  gulp: {
    clean,
    build
  }
}
