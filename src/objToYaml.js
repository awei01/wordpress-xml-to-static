const jsonToYaml = require('json2yaml')

module.exports = function (input) {
  let result = jsonToYaml.stringify(input)
  result = result.replace(/^( ){2}/mg, '') // remove the extra spaces at beginning of lines
  result = result.replace(/^---\s+/, '') // replace the top --- delimiter
  result = result.replace(/"/g, '') // replace all the double quotes
  return result
}
