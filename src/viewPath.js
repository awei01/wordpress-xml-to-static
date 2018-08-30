const lensPath = require('ramda/src/lensPath')
const view = require('ramda/src/view')
const curry = require('ramda/src/curry')

module.exports = curry(function (path, input) {
  const lens = lensPath(path)
  const result = view(lens, input)
  return result
})
