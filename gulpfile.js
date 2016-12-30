// Build simpl.js.

const argv = require('yargs').argv;
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const del = require('del');

let env = argv.env || 'prod';
let isDev = env === 'dev';
console.log("Environment (specify with --env when calling gulp): " + env);

let tsProject = typescript.createProject('tsconfig.json');

gulp.task('compile', function() {
  let stream = tsProject.src();
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
  let mainFile = 'build/simpl.js';
  let bundleFileName = 'simpl.bundle.js';

  let stream = browserify({
    entries: mainFile,
    standalone: 'simpl',
    debug: isDev,
  }).transform('babelify', {
    presets: [ 'es2015' ],
  }).bundle().pipe(source(bundleFileName)).pipe(buffer());
  if (!isDev) {
    stream = stream.pipe(sourcemaps.init({
      loadMaps: true,
    })).pipe(uglify());
  }
  return stream
    .on('error', gutil.log)
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  del.sync(['build']);
});

gulp.task('default', [ 'bundle' ]);
