const parseXml = require('./parseXml')
const viewPath = require('./viewPath')
const extractSiteData = require('./extractSiteData')
const extractCategories = require('./extractCategories')
const extractAuthors = require('./extractAuthors')
const extractAttachments = require('./extractAttachments')
const extractPosts = require('./extractPosts')
const always = require('ramda/src/always')

module.exports = function (input) {
  const data = {}

  return parseXml(input)
    .then(viewPath(['rss', 'channel']))

    .then(extractSiteData(data))
    .then(extractCategories(data))
    .then(extractAuthors(data))
    .then(extractAttachments(data))
    .then(extractPosts(data, 'publish'))
    .then(extractPosts(data, 'draft'))
    .then(always(data))
}
