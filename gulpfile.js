( function() {

    "use strict";

    var gulp = require('gulp'),
        runSequence = require('run-sequence'),
        source;

    function bundle( b, output ) {
        source = source || require('vinyl-source-stream');
        return b.bundle()
            .on( 'error', function( err ) {
                console.log( err );
                this.emit( 'end' );
            })
            .pipe( source( output ) )
            .pipe( gulp.dest( 'build' ) );
    }

    function bundleMin( b, output ) {
        var buffer = require('vinyl-buffer'),
            uglify = require('gulp-uglify');
        source = source || require('vinyl-source-stream');
        return b.bundle()
            .on( 'error', function( err ) {
                console.log( err );
                this.emit( 'end' );
            })
            .pipe( source( output ) )
            .pipe( buffer() )
            .pipe( uglify() )
            .pipe( gulp.dest( 'build' ) );
    }

    function build( root, output, minify ) {
        var browserify = require('browserify'),
            b = browserify( root, {
                debug: !minify,
                standalone: 'esper'
            });
        return ( minify ) ? bundleMin( b, output ) : bundle( b, output );
    }

    function handleError( err ) {
        console.error( err.toString() );
        setTimeout( function() {
            // set delay for full mocha error message
            process.exit( 1 );
        });
    }

    gulp.task('clean', function () {
        var del = require('del');
        del([ 'build/*']);
    });

    gulp.task('lint', function() {
        var jshint = require('gulp-jshint');
        return gulp.src( './src/**/*.js' )
            .pipe( jshint() )
            .pipe( jshint('.jshintrc') )
            .pipe( jshint.reporter('jshint-stylish') );
    });

    gulp.task('test', function() {
        var istanbul = require('gulp-istanbul'),
            mocha = require('gulp-mocha');
        return gulp.src( './src/**/*.js' )
            .pipe( istanbul( { includeUntested: false } ) ) // Covering files
            .pipe( istanbul.hookRequire() )
            .on( 'finish', function () {
                return gulp.src( [ './test/**/*.js' ] )
                    .pipe( mocha( { reporter: 'list' } )
                        .on( 'error', handleError ) ) // print mocha error message
                    .pipe( istanbul.writeReports() ); // Creating the reports after tests runned
            });
    });

    gulp.task('coveralls', function() {
        var coveralls = require('gulp-coveralls');
        return gulp.src('./coverage/**/lcov.info')
            .pipe( coveralls() );
    });

    gulp.task('build-min-js', function() {
        return build( './src/exports.js', 'esper.min.js', true );
    });

    gulp.task('build-js', function() {
        return build( './src/exports.js', 'esper.js', false );
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
