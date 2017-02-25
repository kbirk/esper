'use strict';

const babel = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const coveralls = require('gulp-coveralls');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const shell = require('gulp-shell');
const uglify = require('gulp-uglify');

const project = 'esper';
const paths = {
	root: 'src/exports.js',
	src: [
		'src/**/*.js'
	],
	tests: [
		'test/**/*.js'
	],
	docs: 'src/core/*.js',
	coverage: [
		'src/**/*.js',
		'!src/util/XHRLoader.js',
		'!src/util/ImageLoader.js'
	],
	build: 'build'
};

function logError(err) {
	if (err instanceof SyntaxError) {
		console.error('Syntax Error:');
		console.error(err.message);
		console.error(err.codeFrame);
	} else {
		console.error(err.message);
	}
}

function handleError(err) {
	logError(err);
	this.emit('end');
}

function handleErrorTimeout(err) {
	logError(err);
	setTimeout(() => {
		// set delay for full mocha error message
		this.emit('end');
	});
}

function bundle(bundler, output) {
	return bundler.bundle()
		.on('error', handleError)
		.pipe(source(output))
		.pipe(gulp.dest(paths.build));
}

function bundleMin(bundler, output) {
	return bundler.bundle()
		.on('error', handleError)
		.pipe(source(output))
		.pipe(buffer())
		.pipe(uglify().on('error', handleError))
		.pipe(gulp.dest(paths.build));
}

function build(root, output, minify) {
	let bundler = browserify(root, {
		debug: !minify,
		standalone: project
	}).transform(babel, {
		presets: [ 'es2015' ]
	});
	return (minify) ? bundleMin(bundler, output) : bundle(bundler, output);
}

gulp.task('clean', () => {
	del.sync(paths.build);
});

gulp.task('clean-docs', () => {
	del.sync('docs');
});

gulp.task('lint', () => {
	return gulp.src(paths.src)
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('coverage', () => {
	return gulp.src(paths.coverage)
		.pipe(istanbul({ includeUntested: false }))
		.pipe(istanbul.hookRequire());
});

gulp.task('test', [ 'coverage' ], () => {
	return gulp.src(paths.tests)
		.pipe(mocha({ reporter: 'list' })
			.on('error', handleErrorTimeout))
		.pipe(istanbul.writeReports());
});

gulp.task('coveralls', () => {
	return gulp.src('./coverage/**/lcov.info')
		.pipe(coveralls());
});

gulp.task('build-min-js', () => {
	return build(paths.root, project + '.min.js', true);
});

gulp.task('build-js', () => {
	return build(paths.root, project + '.js', false);
});

gulp.task('docs', [ 'clean-docs' ], shell.task([
	`./node_modules/.bin/jsdoc ${paths.docs} --readme README.md --destination docs --template node_modules/minami`
]));

gulp.task('build', done => {
	runSequence(
		[ 'clean', 'lint' ],
		[ 'build-js', 'build-min-js', 'docs' ],
		done);
});

gulp.task('default', [ 'build' ], () => {
});
