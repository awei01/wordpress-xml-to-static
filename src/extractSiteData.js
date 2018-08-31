const curry = require('ramda/src/curry')

module.exports = curry(function (container, input) {
  return new Promise((resolve) => {
    const baseUrl = input['wp:base_blog_url']
    const site = container.site = { baseUrl }

    function absolutePath (input) {
      return input.replace(baseUrl, '')
    }
    Object.defineProperty(site, 'absolutePath', { value: absolutePath })
    resolve(input)
  })
})
