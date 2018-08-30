module.exports = function (input) {
  return Object.keys(input)
    .sort()
    .reduce((result, key) => {
      result[key] = input[key]
      return result
    }, {})
}
