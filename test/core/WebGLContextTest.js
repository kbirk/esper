(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    require('webgl-mock');
    var _warn;
    var _error;

    describe('WebGLContext', function() {

        beforeEach( function() {
            _warn = console.warn;
            _error = console.error;
            console.warn = function() {};
            console.error = function() {};
        });

        afterEach( function() {
            console.warn = _warn;
            console.error = _error;
        });

        describe('#get()', function() {
            it('should return a WebGLRenderingContext when given a HTMLCanvasElement', function() {
                var canvas = new HTMLCanvasElement();
                var gl = WebGLContext.get( canvas );
                assert( gl instanceof WebGLRenderingContext );
                WebGLContext.remove( canvas );
            });
            it('should return a WebGLRenderingContext when given an id string referencing a HTMLCanvasElement', function() {
                var canvas = new HTMLCanvasElement();
                global.document = {
                    getElementById: function() {
                        return canvas;
                    }
                };
                var gl = WebGLContext.get( 'test-id' );
                assert( gl instanceof WebGLRenderingContext );
                WebGLContext.remove( canvas );
                global.document = undefined;
            });
            it('should return a WebGLRenderingContext when given an selector string referencing a HTMLCanvasElement', function() {
                var canvas = new HTMLCanvasElement();
                global.document = {
                    getElementById: function() {
                        return undefined;
                    },
                    querySelector: function() {
                        return canvas;
                    }
                };
                var gl = WebGLContext.get( '.test-class' );
                assert( gl instanceof WebGLRenderingContext );
                WebGLContext.remove( canvas );
                global.document = undefined;
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                try {
                    WebGLContext.get( null );
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
            it('should return the previously created context if no argument is provided', function() {
                var canvas = new HTMLCanvasElement();
                var gl = WebGLContext.get( canvas );
                assert( gl instanceof WebGLRenderingContext );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
            });
            it('should bind the most recently created context', function() {
                var canvas0 = new HTMLCanvasElement();
                var canvas1 = new HTMLCanvasElement();
                var gl0 = WebGLContext.get( canvas0 );
                assert( gl0 === WebGLContext.get( canvas0 ) );
                var gl1 = WebGLContext.get( canvas1 );
                assert( gl1 === WebGLContext.get( canvas1 ) );
            });
        });

        describe('#bind()', function() {
            it('should throw an exception if no argument is passed', function() {
                try {
                    WebGLContext.bind();
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                try {
                    WebGLContext.bind( null );
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
            it('should bind the context as the current implicit context', function() {
                var canvas0 = new HTMLCanvasElement();
                var canvas1 = new HTMLCanvasElement();
                var gl0 = WebGLContext.get( canvas0 );
                assert( gl0 === WebGLContext.get() );
                var gl1 = WebGLContext.get( canvas1 );
                assert( gl1 === WebGLContext.get() );
                WebGLContext.bind( canvas0 );
                assert( gl0 === WebGLContext.get() );
                WebGLContext.remove( canvas0 );
                WebGLContext.remove( canvas1 );
            });
        });

        describe('#remove()', function() {
            it('should throw an exception if no argument is passed', function() {
                try {
                    WebGLContext.remove();
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                try {
                    WebGLContext.remove( null );
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
            it('should remove the context', function() {
                var canvas = new HTMLCanvasElement();
                var gl = WebGLContext.get( canvas );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
                try {
                    WebGLContext.get();
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
            it('should unbind the removed context if it is currently bound', function() {
                var canvas = new HTMLCanvasElement();
                var gl = WebGLContext.get( canvas );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
                try {
                    WebGLContext.get();
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
        });

        describe('#supportedExtensions()', function() {
            it('should return an array of supported extensions', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var exts = WebGLContext.supportedExtensions();
                assert( exts instanceof Array );
                WebGLContext.remove( canvas );
            });
            it('should return an empty array if no context is referenced', function() {
                var exts = WebGLContext.supportedExtensions();
                assert( exts instanceof Array );
                assert( exts.length === 0 );
            });
        });

        describe('#unsupportedExtensions()', function() {
            it('should return an array of unsupported extensions', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var exts = WebGLContext.unsupportedExtensions();
                assert( exts instanceof Array );
                WebGLContext.remove( canvas );
            });
            it('should return an empty array if no context is referenced', function() {
                var exts = WebGLContext.unsupportedExtensions();
                assert( exts instanceof Array );
                assert( exts.length === 0 );
            });
        });

        describe('#checkExtension()', function() {
            it('should a bool for whether or not the extension is support', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var isSupported = WebGLContext.checkExtension('randomExt');
                assert( typeof isSupported === 'boolean' );
                WebGLContext.remove( canvas );
            });
            it('should query an unbound context if provided', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var isSupported = WebGLContext.checkExtension( canvas, 'randomExt');
                assert( typeof isSupported === 'boolean' );
                WebGLContext.remove( canvas );
            });
            it('should return false if there is no context to check', function() {
                var isSupported = WebGLContext.checkExtension();
                assert( typeof isSupported === 'boolean' );
                assert( isSupported === false );
            });
        });

    });

}());
