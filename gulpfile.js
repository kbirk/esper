( function() {

    'use strict';

    let gulp = require('gulp');
    let runSequence = require('run-sequence');
    let uglify = require('gulp-uglify');
    let buffer = require('vinyl-buffer');
    let source = require('vinyl-source-stream');
    let browserify = require('browserify');
    let istanbul = require('gulp-istanbul');
    let mocha = require('gulp-mocha');
    let del = require('del');
    let jshint = require('gulp-jshint');
    let coveralls = require('gulp-coveralls');
    let shell = require('gulp-shell');
	let babel = require('babelify');

    let project = 'esper';
    let paths = {
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

    function handleError( err ) {
        console.error( err );
        this.emit( 'end' );
    }

    function handleErrorTimeout( err ) {
        console.error( err );
        setTimeout( () => {
            // set delay for full mocha error message
            process.exit( 1 );
        });
    }

    function bundle( b, output ) {
        return b.bundle()
            .on( 'error', handleError )
            .pipe( source( output ) )
            .pipe( gulp.dest( paths.build ) );
    }

    function bundleMin( b, output ) {
        return b.bundle()
            .on( 'error', handleError )
            .pipe( source( output ) )
            .pipe( buffer() )
            .pipe( uglify() )
            .pipe( gulp.dest( paths.build ) );
    }

    function build( root, output, minify ) {
        let b = browserify( root, {
            debug: !minify,
            standalone: project
        }).transform(babel, {
            presets: [ 'es2015' ]
        });
        return ( minify ) ? bundleMin( b, output ) : bundle( b, output );
    }

    gulp.task('clean', function( done ) {
        del.sync( paths.build );
        done();
    });

    gulp.task('lint', function() {
        return gulp.src( paths.src )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('jshint-stylish') );
    });

    gulp.task('test', function() {
        // return gulp.src( paths.tests )
        //     .pipe( mocha({ reporter: 'list' })
        //         .on( 'error', handleErrorTimeout ) ); // print mocha error message
        return gulp.src( paths.coverage )
            .pipe( istanbul({ includeUntested: false }) ) // Covering files
            .pipe( istanbul.hookRequire() )
            .on( 'finish', () => {
                return gulp.src( paths.tests )
                    .pipe( mocha({ reporter: 'list' })
                        .on( 'error', handleErrorTimeout ) ) // print mocha error message
                    .pipe( istanbul.writeReports() ); // Creating the reports after tests runned
            });
    });

    gulp.task('coveralls', function() {
        return gulp.src('./coverage/**/lcov.info')
            .pipe( coveralls() );
    });

    gulp.task('build-min-js', function() {
        return build( paths.root, project + '.min.js', true );
    });

    gulp.task('build-js', function() {
        return build( paths.root, project + '.js', false );
    });

    gulp.task('docs', shell.task([
      './node_modules/.bin/jsdoc ' + paths.docs + ' --readme README.md --destination docs --template node_modules/minami'
    ]));

    gulp.task('build', function( done ) {
        runSequence(
            [ 'clean', 'lint' ],
            [ 'build-js', 'build-min-js', 'docs' ],
            done );
    });

    gulp.task('default', [ 'build' ], function() {
    });

}());
