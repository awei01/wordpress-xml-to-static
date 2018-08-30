const fetch = require('isomorphic-fetch')

module.exports = function (url) {
  return fetch(url)
    .then((response) => {
      return response.text()
    })
}
