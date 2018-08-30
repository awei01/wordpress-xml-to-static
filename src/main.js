const fetchPath = require('./fetchPath')
const processXml = require('./processXml')
const data = {}

fetchPath('/input.xml')
  .then(processXml)
  .then(console.log)
