const curry = require('ramda/src/curry')
const partial = require('ramda/src/partial')
const both = require('ramda/src/both')
const filter = require('ramda/src/filter')
const propEq = require('ramda/src/propEq')
const pathEq = require('ramda/src/pathEq')
const viewPath = require('./viewPath')
const slugify = require('underscore.string/slugify')

module.exports = curry(function (container, status, input) {
  return new Promise((resolve, reject) => {
    const items = input['item']

    const filterFn = both(propEq('wp:post_type', 'post'), propEq('wp:status', status))
    const filtered = filter(filterFn, items)

    const posts = container[status] = filtered.reduce(partial(_extractPost, [container]), {})

    console.log(`Extracted [${Object.keys(posts).length}] posts for [${status}]`)
    resolve(input)
  })
})

function _extractPost (container, accumulator, post) {
  if (post['wp:status'] === 'trash') {
    return accumulator
  }

  const key = post['wp:post_id']

  const path = container.site.extractPath(post['link'])
  const title = _extractTitle(post)
  const slug = _extractSlug(post, title)

  const date = post['wp:post_date_gmt']
  const author = container.authors.resolve(post['dc:creator'])
  const contents = post['content:encoded']

  const categories = container.categories.resolve(_extractCategories(post['category']))
  const tags = _extractTags(post['category'])

  const featuredImage = _extractThumbnailId(post)

  accumulator[key] = {
    path,
    title,
    date,
    slug,
    author,
    contents,
    categories,
    tags,
    featuredImage,
  }
  // if (key === '338') {
  //   console.log(accumulator[key], post)
  // }

  return accumulator
}

function _extractCategories (input) {
  input = Array.isArray(input) ? input : [input]
  return input.filter(pathEq(['$', 'domain'], 'category'))
    .map(viewPath(['$', 'nicename']))
}

function _extractTags (input) {
  input = Array.isArray(input) ? input : [input]
  return input.filter(pathEq(['$', 'domain'], 'post_tag'))
    .map(viewPath(['_']))
}

function _extractThumbnailId (post) {
  let metadata = post['wp:postmeta']
  metadata = Array.isArray(metadata) ? metadata : [metadata]
  return metadata.filter(propEq('wp:meta_key', '_thumbnail_id'))
    .reduce((acc, thumb) => {
      if (acc) {
        console.warn(`That's weird, this post has more than one _thumbnail_id [${post['wp:post_id']}]`)
        return acc
      }
      return thumb['wp:meta_value']
    }, null)
}

function _extractTitle (post) {
  const title = post['title']
  if (title) { return title }

  const key = post['wp:post_id']
  if (key === '338') {
    // handle simon baker
    return 'Steal This Style: Simon Baker'
  }
  console.warn('Missing title for', key, post)
}

function _extractSlug (post, title) {
  const slug = post['wp:post_name']
  if (slug && slug !== post['wp:post_id']) {
    return slug
  }
  return slugify(title)
}
