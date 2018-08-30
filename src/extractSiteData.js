const curry = require('ramda/src/curry')

module.exports = curry(function (container, input) {
  return new Promise((resolve) => {
    const baseUrl = input['wp:base_blog_url']
    function extractPath (url) {
      return url.replace(baseUrl, '')
    }
    container.site = { baseUrl, extractPath }
    resolve(input)
  })
})
