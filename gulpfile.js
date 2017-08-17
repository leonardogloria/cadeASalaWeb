var es            = require('event-stream')
var _             = require('lodash')
var inject        = require('gulp-inject')
var gulp          = require('gulp')
var fs            = require('fs')
var del           = require('del')
var runSequence   = require('run-sequence')
var plugins       = require('gulp-load-plugins')()
var express       = require('express')
var sass          = require('gulp-sass')
var connectLr     = require('connect-livereload')
var open          = require('open')
var watch         = require('gulp-watch')
var watchSequence = require('gulp-watch-sequence')
var minifyCss     = require('gulp-minify-css')
var concat        = require('gulp-concat')
var uglify        = require('gulp-uglify')
var gulpif        = require('gulp-if')
var clean         = require('gulp-clean')
var livereload    = require('gulp-livereload')
var vinylPaths    = require('vinyl-paths')
var replace       = require('gulp-replace-task')

var isRelease,
    defaultVersion = '0.0.0',
    defaultVersionCode = '001',
    args = require('yargs')
             .alias('e', 'env')
             .argv

var paths = {
  gulpFile:   'gulpfile.js',

  src: {
    assetsFile: 'src/assets.json',
    templates:  ['src/templates/**/**.*'],
    index:      'src/index.html',
    fonts:      ['src/fonts/**.*', 'src/lib/font-awesome/fonts/**.*'],
    imgs:       'src/img/**/**.*',
    path:       'src/',
    scss:       'src/sass/**/**.scss',
    css:        'src/css/**/**.css',
    js:         'src/js/**/**.js'
  },

  dist: {
    templates: 'www/templates',
    scssFiles: 'www/css/**/**.scss',
    cssFiles:  'www/css/**/**.*',
    cssFile:   'www/css/application.css',
    jsFiles:   'www/js/**/**.*',
    jsFile:    'www/js/application.js',
    files: 'www/**/**.*',
    fonts: 'www/fonts',
    path:  'www/',
    imgs:  'www/img',
    css:   'www/css',
    js:    'www/js'
  },

  root: '.',

  config: {
    test:        "config/test.json",
    staging:     "config/staging.json",
    production:  "config/production.json",
    development: "config/development.json"
  }
}

var read = function(path) {
  return fs.readFileSync(path, 'utf8')
}

var parse = function(content) {
  return JSON.parse(content)
}

var availableEnvs = [
  'development',
  'staging',
  'production'
]

// Main tasks

gulp.task('web:run', function (callback) {
  isRelease = false

  livereload.listen()

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveHTML',

    'moveCSS',
    'clearCSS',

    'moveJS',
    'moveAndConcatJS',
    'replaceJS',

    'inject',
    'watch',
    'serve',

    callback
  )
})

gulp.task('clean', function() {
  return gulp.src(paths.dist.files).pipe(vinylPaths(del))
})

/*
 * IMAGES
 */

gulp.task('moveImgs', function() {
  return gulp.src(paths.src.imgs)
             .pipe(gulp.dest(paths.dist.imgs))
})

/*
 * FONTS
 */

gulp.task('moveFonts', function() {
  return gulp.src(paths.src.fonts)
             .pipe(gulp.dest(paths.dist.fonts))
})


/*
 * STYLESHEETS
 */


gulp.task('moveCSS', function() {
  var assetsCSS = parse(read(paths.src.assetsFile)).css

  var sources = _.map(assetsCSS, function(asset) {
    var css  = '.css'
    var sass = '.scss'
    var extension = ''

    var pathWithoutExtension = paths.src.path + asset

    if (fs.existsSync(pathWithoutExtension + css)) {
      extension = css
    } else if (fs.existsSync(pathWithoutExtension + sass)) {
      extension = sass
    } else {
      return ''
    }

    return pathWithoutExtension + extension
  })
  sources.push(paths.src.scss)
  return gulp.src(sources)
             .pipe(sass({
               includePaths: [
                 'src/lib'
               ]
             }).on('error', sass.logError))
             .pipe(gulp.dest(paths.dist.css))
             .pipe(livereload())
})

gulp.task('moveHTML', function() {
  es.concat(
    gulp.src(paths.src.templates)
        .pipe(gulp.dest(paths.dist.templates))
        .pipe(livereload())
  )
})

gulp.task('clearCSS', function() {
  return gulp.src(paths.dist.scssFiles)
             .pipe(vinylPaths(del))
})

gulp.task('concatCSS', function() {
  return gulp.src(paths.dist.cssFiles)
             .pipe(concat('application.css'))
             .pipe(gulp.dest(paths.dist.css))
})

gulp.task('minifyCSS', function() {
  return gulp.src(paths.dist.cssFiles)
             .pipe(cssmin())
             .pipe(gulp.dest(paths.dist.css))
})

/*
 * JAVASCRIPTS
 */

gulp.task('moveJS', function() {
  var assetsJS = parse(read(paths.src.assetsFile)).js

  var sources  = _.map(assetsJS, function(asset) {
    return paths.src.path + asset + '.js'
  })

  return gulp.src(sources)
             .pipe(gulp.dest(paths.dist.js))
             .pipe(livereload())
})

gulp.task('moveAndConcatJS', function() {
  var assetsJS = parse(read(paths.src.assetsFile)).js

  var sources  = _.map(assetsJS, function(asset) {
    return paths.src.path + asset + '.js'
  })

  return gulp.src(sources)
             .pipe(gulpif(args.env === 'production', concat('application.js')))
             .pipe(uglify())
             .pipe(gulp.dest(paths.dist.js))
})

gulp.task('minifyJS', function() {
  return gulp.src(paths.dist.jsFiles)
             .pipe(minifyJS({ mangle: false }))
             .pipe(gulp.dest(paths.dist.js))
})

gulp.task('replaceJS', function() {
  
  var configs = parse(read(paths.config[args.env]))
  //var configs = parse(read(paths.config['production']))


  var patterns = _.map(configs, function(value, key) {
    return { match: key, replacement: value }
  })

  return gulp.src(paths.dist.jsFiles)
             .pipe(replace({ patterns: patterns }))
             .pipe(gulp.dest(paths.dist.js))
})

gulp.task('inject', function() {
  if (isRelease) {
    var srcOptions    = { read: false }
    var injectOptions = { ignorePath: paths.dist.path, addRootSlash: false }

    return gulp.src(paths.src.index)
               .pipe(inject(gulp.src(paths.dist.jsFile,  srcOptions), injectOptions))
               .pipe(inject(gulp.src(paths.dist.cssFile, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  } else {
    var assets = parse(read(paths.src.assetsFile))

    var sourcesCSS = _.map(assets.css, function(asset) {
      return paths.dist.css + '/' + _.last(asset.split('/')) + '.css'
    })
    sourcesCSS.push(paths.dist.cssFile)
    var sourcesJS = _.map(assets.js, function(asset) {
      return paths.dist.js + '/' + _.last(asset.split('/')) + '.js'
    })

    srcOptions    = { base: paths.dist, read: false }
    injectOptions = { ignorePath: paths.dist.path, addRootSlash: false }

    return gulp.src(paths.src.index)
               .pipe(gulpif(args.env !== 'production', inject(gulp.src(sourcesJS,  srcOptions), injectOptions)))
               .pipe(gulpif(args.env === 'production', inject(gulp.src(['www/js/application.js'],  srcOptions), injectOptions)))
               .pipe(inject(gulp.src(sourcesCSS, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  }
})

gulp.task('watch', function() {
  // FONTS
  gulp.watch(paths.src.fonts, function() {
    gulp.start('moveFonts')
  })

  // IMGS
  gulp.watch(paths.src.imgs, function() {
    gulp.start('moveImgs')
  })

  // CSS
  var cssSources = [
    paths.src.css,
    paths.src.scss,
    paths.src.assetsFile
  ]

  gulp.watch(cssSources, function() {
    gulp.start('moveCSS')
  })

  // JS
  var jsSources = [
    paths.src.js,
    paths.src.assetsFile
  ]

  var queue = watchSequence(300)

  watch(
    jsSources,
    { name: 'JS', emitOnGlob: false },
    queue.getHandler('moveJS', 'replaceJS', 'inject')
  );

  // HTML
  var htmlSources = [
    paths.src.index,
    paths.src.templates
  ]

  gulp.watch(htmlSources, function() {
    gulp.start('inject')
    gulp.start('moveHTML')
  })

  // INJECT
  var injectSources = [
    paths.src.assetsFile,
    paths.src.index
  ]

  gulp.watch(injectSources, function() {
    gulp.start('inject')
  })
})

gulp.task('serve', function() {
  express()
    .use(connectLr())
    .use(express.static(paths.dist.path))
    .listen('3100')

  open('http://localhost:' + 3100 + '/')
})

/*
 * TESTS
 */

gulp.task('test:unit', function (done) {
  karma.start({
    singleRun: true,
    configFile: __dirname + '/spec/karma.conf.js'
  }, function () {
    done()
    process.exit(0)
  })
})

gulp.task('test:e2e', function () {
  var commands = [],
      webdriver = 'webdriver-manager start &>/dev/null &',
      protractor = !args.specs ? 'protractor spec/protractor.conf.js' : 'protractor spec/protractor.conf.js --specs ' + args.specs

  commands.push(webdriver)
  commands.push(protractor)

  return gulp.src('').pipe(shell(commands, { PATH: process.env.PATH }))
})