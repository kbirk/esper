( function() {

    'use strict';

    var gulp = require('gulp');
    var runSequence = require('run-sequence');
    var uglify = require('gulp-uglify');
    var buffer = require('vinyl-buffer');
    var source = require('vinyl-source-stream');
    var browserify = require('browserify');
    var istanbul = require('gulp-istanbul');
    var mocha = require('gulp-mocha');
    var del = require('del');
    var jshint = require('gulp-jshint');
    var coveralls = require('gulp-coveralls');

    var project = 'esper';
    var paths = {
        root: 'src/exports.js',
        src: 'src/**/*.js',
        tests: 'test/**/*.js',
        build: 'build'
    };

    function handleError( err ) {
        console.error( err );
        this.emit( 'end' );
    }

    function handleErrorTimeout( err ) {
        console.error( err );
        setTimeout( function() {
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
        var b = browserify( root, {
            debug: !minify,
            standalone: project
        });
        return ( minify ) ? bundleMin( b, output ) : bundle( b, output );
    }

    gulp.task('clean', function () {
        del([ 'build/*']);
    });

    gulp.task('lint', function() {
        return gulp.src( paths.src )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('jshint-stylish') );
    });

    gulp.task('test', function() {
        return gulp.src( paths.src )
            .pipe( istanbul({ includeUntested: false }) ) // Covering files
            .pipe( istanbul.hookRequire() )
            .on( 'finish', function () {
                return gulp.src([ paths.tests ])
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

    gulp.task('build', function( done ) {
        runSequence(
            [ 'clean', 'lint' ],
            [ 'build-js', 'build-min-js' ],
            done );
    });

    gulp.task('default', [ 'build' ], function() {
    });

}());
