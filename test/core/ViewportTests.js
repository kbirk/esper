(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var Viewport = require('../../src/core/Viewport');
    require('webgl-mock');
    var canvas;
    var gl;

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
            it('should accept an object with `width`, `height`, `x`, and `y` numberic arguments', function() {
                var viewport = new Viewport({
                    width: 100,
                    height: 200,
                    x: 20,
                    y: 30
                });
                assert( viewport.width === 100 );
                assert( viewport.height === 200 );
                assert( viewport.x === 20 );
                assert( viewport.y === 30 );
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
                var viewport = new Viewport();
                assert( gl.canvas.width === viewport.width );
                assert( gl.canvas.height === viewport.height );
            });
            it('should default `x` and `y` to 0', function() {
                var viewport = new Viewport();
                assert( viewport.x === 0 );
                assert( viewport.y === 0 );
            });
        });

        describe('#resize()', function() {
            it('should resize the underlying context canvas element', function() {
                var viewport = new Viewport();
                viewport.resize( 100, 200 );
                assert( viewport.width === 100 );
                assert( viewport.height === 200 );
                assert( gl.canvas.width === 100 );
                assert( gl.canvas.height === 200 );
            });
            it('should throw an exception if the `width` is missing or invalid', function() {
                var viewport = new Viewport();
                var result = false;
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
                var viewport = new Viewport();
                var result = false;
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

        describe('#offset()', function() {
            it('should resize the underlying context canvas element', function() {
                var viewport = new Viewport();
                viewport.offset( 10, 20 );
                assert( viewport.x === 10 );
                assert( viewport.y === 20 );
                assert( gl.canvas.width === viewport.width + viewport.x );
                assert( gl.canvas.height === viewport.height + viewport.y );
            });
            it('should throw an exception if the `x` is missing or invalid', function() {
                var viewport = new Viewport();
                var result = false;
                try {
                    viewport.offset( undefined, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.offset( null, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.offset( 'invalid', 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `y` is missing or invalid', function() {
                var viewport = new Viewport();
                var result = false;
                try {
                    viewport.offset( 200, undefined );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.offset( 200, null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.offset( 200, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#push()', function() {
            it('should push the viewport on the stack', function() {
                var viewport = new Viewport();
                viewport.push();
                viewport.push();
                viewport.pop();
                viewport.pop();
            });
            it('should accept `width`, `height`, `x`, and `y` overrides', function() {
                var viewport = new Viewport();
                viewport.push( 10, 10, 100, 200 );
                viewport.pop();
            });
            it('should not resize the viewport object or underlying canvas from overrides', function() {
                var viewport = new Viewport({
                    width: 500,
                    height: 500
                });
                viewport.push( 0, 0, 100, 200 );
                assert( viewport.width === 500 );
                assert( viewport.height === 500 );
                assert( gl.canvas.width === 500 );
                assert( gl.canvas.height === 500 );
                viewport.pop();
            });
            it('should default `x` and `y` to 0', function() {
                var viewport = new Viewport();
                assert( viewport.x === 0 );
                assert( viewport.y === 0 );
            });
            it('should throw an exception if the `x` is invalid', function() {
                var viewport = new Viewport();
                var result = false;
                try {
                    viewport.push( null, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.push( 'invalid', 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `y` is invalid', function() {
                var viewport = new Viewport();
                var result = false;
                try {
                    viewport.push( 200, null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.push( 200, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `width` is invalid', function() {
                var viewport = new Viewport();
                var result = false;
                try {
                    viewport.push( 0, 0, null, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.push( 0, 0, 'invalid', 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `height` is invalid', function() {
                var viewport = new Viewport();
                var result = false;
                try {
                    viewport.push( 0, 0, 200, null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    viewport.push( 0, 0, 200, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#pop()', function() {
            it('should pop the viewport off the stack', function() {
                var viewport = new Viewport();
                viewport.push();
                viewport.pop();
            });
            it('should throw an exception if there viewport is not the top of the stack', function() {
                var viewport = new Viewport();
                var result = false;
                try {
                    viewport.pop();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });
    });

}());
