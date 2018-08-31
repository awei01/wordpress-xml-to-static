const gulp = require('gulp')
const makeFile = require('gulp-file')
const clean = require('gulp-clean')
const tap = require('gulp-tap')
const through = require('through2')
const pick = require('ramda/src/pick')
const pipe = require('ramda/src/pipe')
const omit = require('ramda/src/omit')

const processXml = require('./src/processXml')
const pushFilesToStream = require('./src/pushFilesToStream')
const htmlToMd = require('./src/htmlToMd')
const sortObjKeys = require('./src/sortObjKeys')
const objToYaml = require('./src/objToYaml')

const configs = require('./configs')
const gulpConfigs = configs.gulp

const _dirs = {
  src: './input',
  dest: './_output'
}

gulp.task('clean', function () {
  return gulp.src(gulpConfigs.clean.src, { allowEmpty: true })
    .pipe(clean())
})

gulp.task('build', function () {
  const _data = {}
  const _completed = {}
  const _sources = {}

  return gulp.src(gulpConfigs.build.src)
    .pipe(through.obj(function (file, encoding, done) {
      if (file.isNull()) {
        done()
        return
      }
      const step = 'import'
      if (_ifAlreadyCompleted(_completed, step, done, file)) { return }

      console.log(`Extracting from [${file.path}]`)
      processXml(file.contents.toString())
        .then((result) => {
          Object.assign(_data, result)
        })
        .then(() => {
          _sources[file.path] = true
          _markAsCompleted(_completed, step, done, file)
        })
    }))

    // generate authors file
    .pipe(through.obj(function (file, encoding, done) {
      const { dest } = gulpConfigs.build.authors
      if (_ifAlreadyCompleted(_completed, dest, done, file)) { return }

      console.log(`Preparing authors file [${dest}]`)
      const contents = pipe(sortObjKeys, objToYaml)(_data.authors)
      pushFilesToStream(this, dest, contents)

      _markAsCompleted(_completed, dest, done, file)
    }))

    // generate categories files
    .pipe(through.obj(function (file, encoding, done) {
      const { dest } = gulpConfigs.build.categories
      if (_ifAlreadyCompleted(_completed, dest, done, file)) { return }

      console.log(`Preparing categories file [${dest}]`)
      const contents = pipe(sortObjKeys, objToYaml)(_data.categories)
      pushFilesToStream(this, dest, contents)

      _markAsCompleted(_completed, dest, done, file)
    }))

    // generate drafts folder
    .pipe(through.obj(function (file, encoding, done) {
      const { dest } = gulpConfigs.build.draft
      if (_ifAlreadyCompleted(_completed, dest, done, file)) { return }

      console.log(`Preparing draft files [${dest}]`)
      const files = _makePosts(dest, _data.draft)

      pushFilesToStream(this, files)
      _markAsCompleted(_completed, dest, done, file)
    }))

    // generate posts folder
    .pipe(through.obj(function (file, encoding, done) {
      const { dest } = gulpConfigs.build.publish
      if (_ifAlreadyCompleted(_completed, dest, done, file)) { return }

      console.log(`Preparing publish files [${dest}]`)
      const files = _makePosts(dest, _data.publish)

      pushFilesToStream(this, files)
      _markAsCompleted(_completed, dest, done, file)
    }))

    // filter out the input file
    .pipe(through.obj(function (file, encoding, done) {
      if (_sources[file.path]) {
        done()
        return
      }
      done(null, file)
    }))
    .pipe(gulp.dest(_dirs.dest))
})

gulp.task('default', gulp.series('clean', 'build'))

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

function _ifAlreadyCompleted (cache, key, done, file) {
  if (cache[key]) {
    done(null, file)
    return true
  }
}
function _markAsCompleted (cache, key, done, file) {
  cache[key] = true
  done(null, file)
}
