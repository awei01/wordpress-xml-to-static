const curry = require('ramda/src/curry')
const partial = require('ramda/src/partial')
const contains = require('ramda/src/contains')

module.exports = curry(function (container, input) {
  return new Promise((resolve, reject) => {
    const items = input['wp:author']
    const authors = container.authors = items.reduce(_extractAuthor, {})

    const keys = Object.keys(authors)
    console.log(`Extracted [${keys.length}]`)

    function extractValidAuthor (input) {
      if (!contains(input, keys)) {
        console.warn(`Author [${input}] not found`)
      }
      return input
    }
    // define a lookup method
    Object.defineProperty(authors, 'resolve', { value: extractValidAuthor })

    resolve(input)
  })
})

function _extractAuthor (accumulator, item) {
  // const item = collection[index]
  let username = item['wp:author_login']
  // handle username === 'superuser'
  if (username === 'superuser') { username = 'austin' }
  accumulator[username] = {
    username,
    firstName: item['wp:author_first_name'],
    lastName: item['wp:author_last_name'],
    email: item['wp:author_email'],
  }
  return accumulator
}
