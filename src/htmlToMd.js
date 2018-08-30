const Turndown = require('turndown')

const turndown = new Turndown({
   headingStyle: "atx",
   // keep linkStyle as "inlined" because forestry.io editor will remove them anyway
     // linkStyle: "referenced", // inlined | referenced
     // linkReferenceStyle: "full" // full, collapsed, or shortcut
})
.addRule('handleStyleDecoration', {
  filter: function (node, options) {
    // init this rule
    const _has = (this._has = {})
    // first check to see if bold or italic
    const style = node.getAttribute('style')
    _has.bold = /font-weight: ?bold;?/.test(style)
    _has.italic = /font-style: ?italic;?/.test(style)
    _has.underline = /text-decoration: ?underline;?/.test(style)
    return _has.bold || _has.italic || _has.underline
  },
  replacement: function (content, node, options) {
    const { strongDelimiter, emDelimiter } = options
    const { bold, italic, underline } = this._has
    const delimiters = [
      bold || underline ? strongDelimiter : '',
      italic ? emDelimiter : ''
    ]
    let result = `${delimiters.join('')}${content}${delimiters.reverse().join('')}`
    // check to see if the style attribute is part of an <a>
    if (node.nodeName.toLowerCase() === 'a') {
      result = turndown.options.rules.inlineLink.replacement(result, node, options)
    }
    return result
  }
})

// modify strong rule to remove it when inside of a <h#> tag
turndown.options.rules.strong.replacement = function (content, node, options) {
  if (node.parentNode.tagName.match(/^H\d{1}$/)) {
    return content
  }
  if (!content.trim()) return ''
  return options.strongDelimiter + content + options.strongDelimiter
}
// rules.strong = {
//   filter: ['strong', 'b'],
//   replacement: function (content, node, options) {
//     if (!content.trim()) return ''
//     return options.strongDelimiter + content + options.strongDelimiter
//   }
// }

module.exports = function (input) {
  return turndown.turndown(input)
}
