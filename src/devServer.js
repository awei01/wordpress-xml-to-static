const fetchPath = require('./fetchPath')
const processXml = require('./processXml')
const configs = require('../configs')

const data = {}

const start = Date.now()
console.log('Extracting data')

fetchPath(configs.input.file)
  .then(processXml)
  .then(console.log)
  .then(() => {
    const elapsed = Date.now() - start
    console.log(`Completed extraction in [${elapsed} ms]`)
  })
