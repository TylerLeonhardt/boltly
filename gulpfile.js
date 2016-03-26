'use strict';

const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

const path = {
  misc: [{
    src: ['src/assets/svg/*.svg'],
    dst: 'dist/assets/svg',
  }, {
    src: ['src/views/*.html'],
    dst: 'dist/views/',
  }, {
    src: ['src/index.html'],
    dst: 'dist/',
  }, {
    src: ['src/js/libs/*.js'],
    dst: 'dist/js/libs/',
  }],
  js: [{
    src: ['src/js/app.js'],
    dst: 'dist/js/',
    name: 'app.js',
  }, {
    src: ['src/js/controllers/*.js'],
    dst: 'dist/js/',
    name: 'controllers.js',
  }, {
    src: ['src/js/directives/*.js'],
    dst: 'dist/js/',
    name: 'directives.js',
  }, {
    src: ['src/js/services/*.js'],
    dst: 'dist/js/',
    name: 'services.js',
  }],
  sass: [{
    src: ['src/sass/*.scss'],
    dst: 'dist/style/',
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
        .pipe(gulp.dest(sec.dst));
    }
  }
});


gulp.task('sass', () => {
  let sec;
  for(let i in path.sass) {
    if ({}.hasOwnProperty.call(path.misc, i)) {
      sec = path.sass[i];

      sass(sec.src, {
        // style: 'compressed',
        lineNumbers: false,
      })
        .on('error', sass.logError)
        .pipe(concat(sec.name))
        .pipe(gulp.dest(sec.dst));
    }
  }
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


gulp.task('watch', () => {
  const t = ['js', 'misc', 'sass'];
  for (let i in t) {
    gulp.run(t[i]);
  }

  gulp.watch(source('misc'), ['misc']);
  gulp.watch(source('js'), ['js']);
  gulp.watch(source('sass'), ['sass']);
});


gulp.task('default', ['watch']);
