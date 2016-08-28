(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let Viewport = require('../../src/core/Viewport');
    require('webgl-mock');
    let canvas;
    let gl;

    describe('Viewport', function() {

        before( function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get( canvas );
        });

        after( function() {
            WebGLContext.remove( canvas );
            canvas = null;
            gl = null;
        });

        describe('#constructor()', function() {
            it('should accept an object with `width`, `height` numeric arguments', function() {
                let viewport = new Viewport({
                    width: 100,
                    height: 200
                });
                assert( viewport.width === 100 );
                assert( viewport.height === 200 );
            });
            it('should resize the underlying context canvas element', function() {
                new Viewport({
                    width: 200,
                    height: 300
                });
                assert( gl.canvas.width === 200 );
                assert( gl.canvas.height === 300 );
            });
            it('should default `width` and `height` to the current size of the canvas element', function() {
                let viewport = new Viewport();
                assert( gl.canvas.width === viewport.width );
                assert( gl.canvas.height === viewport.height );
            });
        });

        describe('#resize()', function() {
            it('should resize the underlying context canvas element', function() {
                let viewport = new Viewport();
                viewport.resize( 100, 200 );
                assert( viewport.width === 100 );
                assert( viewport.height === 200 );
                assert( gl.canvas.width === 100 );
                assert( gl.canvas.height === 200 );
            });
            it('should throw an exception if the `width` is missing or invalid', function() {
                let viewport = new Viewport();
                let result = false;
                try {
                    viewport.resize( undefined, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.resize( null, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.resize( -14, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.resize( 'invalid', 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `height` is missing or invalid', function() {
                let viewport = new Viewport();
                let result = false;
                try {
                    viewport.resize( 200, undefined );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.resize( 200, null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.resize( 200, -14 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.resize( 200, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#set()', function() {
            it('should set the viewport', function() {
                let viewport = new Viewport();
                viewport.set();
            });
            it('should accept `width`, `height`, `x`, and `y` overrides', function() {
                let viewport = new Viewport();
                viewport.set( 10, 10, 100, 200 );
            });
            it('should not resize the viewport object or underlying canvas from overrides', function() {
                let viewport = new Viewport({
                    width: 500,
                    height: 500
                });
                viewport.set( 0, 0, 100, 200 );
                assert( viewport.width === 500 );
                assert( viewport.height === 500 );
                assert( gl.canvas.width === 500 );
                assert( gl.canvas.height === 500 );
            });
            it('should throw an exception if the `x` is invalid', function() {
                let viewport = new Viewport();
                let result = false;
                try {
                    viewport.set( null, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.set( 'invalid', 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `y` is invalid', function() {
                let viewport = new Viewport();
                let result = false;
                try {
                    viewport.set( 200, null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.set( 200, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `width` is invalid', function() {
                let viewport = new Viewport();
                let result = false;
                try {
                    viewport.set( 0, 0, null, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.set( 0, 0, 'invalid', 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `height` is invalid', function() {
                let viewport = new Viewport();
                let result = false;
                try {
                    viewport.set( 0, 0, 200, null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.set( 0, 0, 200, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });
    });

}());
