const curry = require('ramda/src/curry')
const filter = require('ramda/src/filter')
const propEq = require('ramda/src/propEq')

module.exports = curry(function (container, input) {
  return new Promise((resolve, reject) => {
    const items = input['item']

    const filterFn = propEq('wp:post_type', 'attachment')
    const filtered = filter(filterFn, items)

    const attachments = container.attachments = filtered.reduce((accumulator, attachment) => {
      const key = attachment['wp:post_id']
      const path = attachment['wp:attachment_url']
      const parentId = attachment['wp:post_parent']

      if (accumulator[key]) { throw new Error(`Already defined attachment [${key}]`) }

      accumulator[key] = {
        path,
        parentId
      }
      return accumulator
    }, {})

    // attach a resolver
    function resolveAttachment (input) {
      if (!input) { return input }
      const found = attachments[input]
      if (!found) {
        // console.warn(`Cannot resolve attachment [${input}]`)
        return
      }
      return found.path
    }
    Object.defineProperty(attachments, 'resolve', { value: resolveAttachment })

    // console.log(attachments)

    console.log(`Extracted [${Object.keys(attachments).length}] attachments`)
    resolve(input)
  })
})
