const Vinyl = require('vinyl')

module.exports = function (stream, path, contents) {
  const files = typeof path === 'string'
    ? [{ path, contents }]
    : path

  while (files.length) {
    let { path, contents } = files.shift()
    contents = typeof contents === 'string' ? Buffer.from(contents) : contents
    stream.push(new Vinyl({ path, contents }))
  }
}
