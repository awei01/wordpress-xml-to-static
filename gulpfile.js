const gulp = require('gulp')
const makeFile = require('gulp-file')
const clean = require('gulp-clean')
const path = require('path')
const tap = require('gulp-tap')
const through = require('through2')
const pick = require('ramda/src/pick')
const pipe = require('ramda/src/pipe')
const omit = require('ramda/src/omit')

const processXml = require('./src/processXml')
const pushFilesToStream = require('./src/pushFilesToStream')
const assignData = require('./src/assignData')
const htmlToMd = require('./src/htmlToMd')
const sortObjKeys = require('./src/sortObjKeys')
const objToYaml = require('./src/objToYaml')

const _dirs = {
  src: './input',
  dest: './_output'
}

gulp.task('clean', function () {
  return gulp.src(_dirs.dest, { allowEmpty: true })
    .pipe(clean())
})

gulp.task('process', function () {
  const data = {}
  const written = {}

  return gulp.src(path.resolve(_dirs.src, '*.xml'))
    .pipe(through.obj(function (file, encoding, done) {
      processXml(file.contents.toString())
        .then(assignData(data))
        .then(() => {
          done(null, file)
        })
    }))

    // generate authors file
    .pipe(through.obj(function (file, encoding, done) {
      const dest = 'data/authors.yml'
      if (_ifAlreadyWritten(written, dest, done, file)) { return }

      const contents = pipe(sortObjKeys, objToYaml)(data.authors)
      pushFilesToStream(this, dest, contents)

      _markAsWritten(written, dest, done, file)
    }))

    // generate categories files
    .pipe(through.obj(function (file, encoding, done) {
      const dest = 'data/categories.yml'
      if (_ifAlreadyWritten(written, dest, done, file)) { return }

      const contents = pipe(sortObjKeys, objToYaml)(data.categories)
      pushFilesToStream(this, dest, contents)

      _markAsWritten(written, dest, done, file)
    }))

    // generate drafts folder
    .pipe(through.obj(function (file, encoding, done) {
      const dest = 'drafts'
      if (_ifAlreadyWritten(written, dest, done, file)) { return }

      const files = _makePosts('drafts', data.draft)

      pushFilesToStream(this, files)
      _markAsWritten(written, dest, done, file)
    }))

    // generate posts folder
    .pipe(through.obj(function (file, encoding, done) {
      const dest = 'posts'
      if (_ifAlreadyWritten(written, dest, done, file)) { return }

      const files = _makePosts('posts', data.publish)

      pushFilesToStream(this, files)
      _markAsWritten(written, dest, done, file)
    }))

    // filter out the xml file
    .pipe(through.obj(function (file, encoding, done) {
      done(null, file.extname === '.xml' ? null : file)
    }))
    .pipe(gulp.dest(_dirs.dest))
})

gulp.task('default', gulp.series('clean', 'process'))

function _makePosts (folder, posts) {
  return Object.keys(posts).map((key) => {
    const post = posts[key]
    const meta = omit(['contents', 'date', 'slug'], post)
    const header = `---\n${objToYaml(meta)}---`
    const body = htmlToMd(post.contents)
    const contents = `${header}\n${body}`
    const date = folder === 'drafts'
      ? ''
      : _extractDate(post.date)
    const path = `${folder}/${date}${date ? '-' : ''}${post.slug}.md`
    return { path, contents }
  })
}

function _extractDate (input) {
  return input.slice(0, 10)
}

function _ifAlreadyWritten (cache, key, done, file) {
  if (cache[key]) {
    done(null, file)
    return true
  }
}
function _markAsWritten (cache, key, done, file) {
  cache[key] = true
  done(null, file)
}
