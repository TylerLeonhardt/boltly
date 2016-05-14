'use strict';

const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const electron = require('gulp-electron');
const packageJson = require('./package.json');
const install = require('gulp-install');

const path = {
  misc: [{
    src: ['src/assets/svg/*.svg'],
    dst: 'app/out/assets/svg',
  }, {
    src: ['src/views/*.html'],
    dst: 'app/out/views/',
  }, {
    src: ['src/index.html'],
    dst: 'app/out/',
  }, {
    src: ['src/js/libs/*.js'],
    dst: 'app/out/js/libs/',
  }, {
    src: ['src/main.js'],
    dst: 'app/out/',
  }],
  js: [{
    src: ['src/js/app.js'],
    dst: 'app/out/js/',
    name: 'app.js',
  }, {
    src: ['src/js/controllers/*.js'],
    dst: 'app/out/js/',
    name: 'controllers.js',
  }, {
    src: ['src/js/directives/*.js'],
    dst: 'app/out/js/',
    name: 'directives.js',
  }, {
    src: ['src/js/services/*.js'],
    dst: 'app/out/js/',
    name: 'services.js',
  }],
  sass: [{
    src: ['src/sass/*.scss'],
    dst: 'app/out/style/',
    name: 'style.css',
  }],
};


gulp.task('misc', () => {
  let sec;
  for (let i in path.misc) {
    if ({}.hasOwnProperty.call(path.misc, i)) {
      sec = path.misc[i];

      gulp.src(sec.src)
        .pipe(gulp.dest(sec.dst));
    }
  }
});


gulp.task('js', () => {
  let sec;
  for (let i in path.js) {
    if ({}.hasOwnProperty.call(path.misc, i)) {
      sec = path.js[i];

      gulp.src(sec.src)
        .pipe(concat(sec.name))
        .pipe(babel({
          presets: ['es2015'],
        }))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest(sec.dst));
    }
  }
});


gulp.task('sass', () => {
  let sec;
  for (let i in path.sass) {
    if ({}.hasOwnProperty.call(path.misc, i)) {
      sec = path.sass[i];

      sass(sec.src, {
        // style: 'compressed',
        lineNumbers: false,
      })
        .on('error', sass.logError)
        .pipe(concat(sec.name))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(sec.dst));
    }
  }
});

gulp.task('install', ['misc'], () => {
  gulp.src(['./dist/package.json'])
  .pipe(install({ production: true }));
});

gulp.task('electron', () => {
  gulp.src('')
  .pipe(electron({
    src: './dist',
    packageJson: packageJson,
    release: './release',
    cache: './cache',
    version: 'v0.37.1',
    packaging: true,
    platforms: ['darwin-x64'],
    platformResources: {
      darwin: {
        CFBundleDisplayName: packageJson.name,
        CFBundleIdentifier: packageJson.name,
        CFBundleName: packageJson.name,
        CFBundleVersion: packageJson.version,
        icon: './dist/boltly_logo_mac.icns',
      },
    },
  }))
  .pipe(gulp.dest(''));
});

function source() {
  if (arguments.length === 0) {
    return [];
  }
  let key = arguments[0],
    array = [];
  for (let i in path[key]) {
    if ({}.hasOwnProperty.call(path.misc, i)) {
      array = array.concat(path[key][i].src);
    }
  }
  for (let i = 1; i < arguments.length; i++) {
    array.push(arguments[i]);
  }
  return array;
}

gulp.task('watch', ['js', 'sass', 'install'], () => {
  gulp.watch(source('misc'), ['misc']);
  gulp.watch(source('js'), ['js']);
  gulp.watch(source('sass'), ['sass']);
});

gulp.task('compile', ['js', 'sass', 'install'], () => {});

gulp.task('default', ['watch']);
