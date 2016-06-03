(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    require('webgl-mock');

    describe('WebGLContext', function() {

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
                var result = false;
                try {
                    WebGLContext.get( null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
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
                WebGLContext.remove( canvas0 );
                WebGLContext.remove( canvas1 );
            });
        });

        describe('#bind()', function() {
            it('should throw an exception if no argument is passed', function() {
                var result = false;
                try {
                    WebGLContext.bind();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                var result = false;
                try {
                    WebGLContext.bind( null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
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
                var result = false;
                try {
                    WebGLContext.remove();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                var result = false;
                try {
                    WebGLContext.remove( null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should remove the context', function() {
                var canvas = new HTMLCanvasElement();
                var gl = WebGLContext.get( canvas );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
                var result = false;
                try {
                    WebGLContext.get();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should unbind the removed context if it is currently bound', function() {
                var canvas = new HTMLCanvasElement();
                var gl = WebGLContext.get( canvas );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
                var result = false;
                try {
                    WebGLContext.get();
                } catch( err ) {
                    result = true;
                }
                assert( result );
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
            it('should throw an exception if no context is referenced', function() {
                var result = false;
                try {
                    WebGLContext.supportedExtensions();
                } catch( err ) {
                    result = true;
                }
                assert( result );
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
            it('should throw an exception if no context is referenced', function() {
                var result = false;
                try {
                    WebGLContext.unsupportedExtensions();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#checkExtension()', function() {
            it('should return a bool for whether or not the extension is support', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var supported = WebGLContext.supportedExtensions();
                var unsupported = WebGLContext.unsupportedExtensions();
                supported.forEach( function( ext ) {
                    var isSupported = WebGLContext.checkExtension( ext );
                    assert( typeof isSupported === 'boolean' );
                    assert( isSupported );
                });
                unsupported.forEach( function( ext ) {
                    var isSupported = WebGLContext.checkExtension( ext );
                    assert( typeof isSupported === 'boolean' );
                    assert( !isSupported );
                });
                WebGLContext.remove( canvas );
            });
            it('should query an unbound context if provided', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var isSupported = WebGLContext.checkExtension( canvas, 'randomExt');
                assert( typeof isSupported === 'boolean' );
                WebGLContext.remove( canvas );
            });
            it('should return throw an exception if no context is referenced', function() {
                var result = false;
                try {
                    WebGLContext.checkExtension();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#getExtension()', function() {
            it('should return an extension if it exists', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var supported = WebGLContext.supportedExtensions();
                supported.forEach( function( ext ) {
                    var instance = WebGLContext.getExtension( ext );
                    assert( instance !== null );
                });
                WebGLContext.remove( canvas );
            });
            it('should return null if it doesnt exist', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var unsupported = WebGLContext.unsupportedExtensions();
                unsupported.forEach( function( ext ) {
                    var instance = WebGLContext.getExtension( ext );
                    assert( instance === null );
                });
                WebGLContext.remove( canvas );
            });
            it('should query an unbound context if provided', function() {
                var canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                var instance = WebGLContext.getExtension( canvas, 'randomExt');
                assert( instance === null );
                WebGLContext.remove( canvas );
            });
            it('should return throw an exception if no context is referenced', function() {
                var result = false;
                try {
                    WebGLContext.getExtension();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

    });

}());
