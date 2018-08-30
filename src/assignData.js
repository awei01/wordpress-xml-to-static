const curry = require('ramda/src/curry')

module.exports = curry(function (container, data) {
  Object.assign(container, data)
})
