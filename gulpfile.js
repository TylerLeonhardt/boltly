

var gulp   = require('gulp'),
	sass   = require('gulp-ruby-sass'),
	concat = require('gulp-concat'),
	babel  = require('gulp-babel');



var path = {
	misc: [{
		src: ['src/assets/svg/*.svg'],
		dst: 'dist/assets/svg'
	},{
		src: ['src/views/*.html'],
		dst: 'dist/views/'
	},{
		src: ['src/index.html'],
		dst: 'dist/'
	}],
	js: [{
		src: [ 'src/js/app.js'],
		dst: 'dist/js/',
		name: 'app.js'
	},{
		src: [ 'src/js/controllers/*.js'],
		dst: 'dist/js/',
		name: 'controllers.js'
	}, {
		src: [ 'src/js/services/*.js'],
		dst: 'dist/js/',
		name: 'services.js'
	}],
	sass: [{
		src: ['src/sass/*.scss'],
		dst: 'dist/style/',
		name: 'style.css'
	}]
}


gulp.task('misc',function() {
	var sec;
	for(var i in path.misc) {
		sec = path.misc[i];

		gulp.src(sec.src)
			.pipe(gulp.dest(sec.dst));
	}
});


gulp.task('js',function() {
	var sec;
	for(var i in path.js) {
		sec = path.js[i];

		gulp.src(sec.src)
			.pipe(concat(sec.name))
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(gulp.dest(sec.dst));
	}
});


gulp.task('sass',function() {
	var sec;
	for(var i in path.sass) {
		sec = path.sass[i];

		sass(sec.src, {
			// style: 'compressed',
			lineNumbers: false
		})
			.on('error', sass.logError)
			.pipe(concat(sec.name))
			.pipe(gulp.dest(sec.dst));
	}
});

function source() {
	if( arguments.length == 0 ) return [];
	var key = arguments[0],
		array = [];
	for(var i in path[key]) {
		array = array.concat(path[key][i].src);
	}
	for(var i = 1; i < arguments.length; i++) {
		array.push(arguments[i]);
	}
	return array;
}


gulp.task('watch', function(){
	var t = ['js', 'misc', 'sass'];
	for(var i in t) {
		gulp.run(t[i]);
	}	

	gulp.watch(source('misc'), ['misc']);
	gulp.watch(source('js'), ['js']);
	gulp.watch(source('sass'), ['sass']);
});


gulp.task('default', ['watch']);
