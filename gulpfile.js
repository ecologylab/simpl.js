// Build simpl.js.

var argv = require('yargs').argv;
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var del = require('del');

var env = argv.env || 'prod';
var isDev = env === 'dev';
console.log("Environment: " + env);

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('compile', function() {
  var stream = tsProject.src();
  if (isDev) {
    stream = stream.pipe(sourcemaps.init());
  }
  stream = stream.pipe(tsProject());
  if (isDev) {
    stream = stream.pipe(sourcemaps.write());
  }
  return stream.pipe(gulp.dest('build'));
});

gulp.task('bundle', [ 'compile' ], function() {
  var mainFile = 'build/simpl.js';
  var bundle = browserify({
    entries: mainFile,
    standalone: 'simpl',
    debug: isDev,
  });

  var bundleFileName = isDev ? 'simpl.bundle.js' : 'simpl.min.js';

  var stream = bundle
    .bundle()
    .pipe(source(bundleFileName))
    .pipe(buffer());
  if (!isDev) {
    stream = stream
      .pipe(babel({
        presets: [ 'es2015' ],
      }))
      .pipe(uglify().on('error', gutil.log));
  }
  return stream
    .on('error', gutil.log)
    .pipe(gulp.dest('build'));
});


gulp.task('default', [ 'bundle' ]);

gulp.task('clean', function() {
  del.sync(['build']);
})