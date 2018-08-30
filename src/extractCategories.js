const curry = require('ramda/src/curry')
const partial = require('ramda/src/partial')
const difference = require('ramda/src/difference')

module.exports = curry(function (container, input) {
  return new Promise((resolve, reject) => {
    const items = input['wp:category']
    const categories = container.categories = items.reduce(_extractCategory, {})
    const keys = Object.keys(categories)
    console.log(`Extracted [${keys.length}] categories [${keys.join(' | ')}]`)

    // define a resolve function
    function resolveValidCategories (input) {
      input = Array.isArray(input) ? input : [input]
      const diff = difference(input, keys)
      if (diff.length) {
        console.warn(`Found some invalid categories [${diff}]`)
      }
      return input
    }
    Object.defineProperty(categories, 'resolve', { value: resolveValidCategories })

    resolve(input)
  })
})

function _extractCategory (accumulator, item) {
  const slug = item['wp:category_nicename']
  accumulator[slug] = {
    slug,
    name: item['wp:cat_name']
  }
  return accumulator
}
