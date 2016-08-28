(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    require('webgl-mock');

    describe('WebGLContext', function() {

        describe('#get()', function() {
            it('should return a WebGLRenderingContext when given a HTMLCanvasElement', function() {
                let canvas = new HTMLCanvasElement();
                let gl = WebGLContext.get( canvas );
                assert( gl instanceof WebGLRenderingContext );
                WebGLContext.remove( canvas );
            });
            it('should return a WebGLRenderingContext when given an id string referencing a HTMLCanvasElement', function() {
                let canvas = new HTMLCanvasElement();
                global.document = {
                    getElementById: function() {
                        return canvas;
                    }
                };
                let gl = WebGLContext.get( 'test-id' );
                assert( gl instanceof WebGLRenderingContext );
                WebGLContext.remove( canvas );
                global.document = undefined;
            });
            it('should return a WebGLRenderingContext when given an selector string referencing a HTMLCanvasElement', function() {
                let canvas = new HTMLCanvasElement();
                global.document = {
                    getElementById: function() {
                        return undefined;
                    },
                    querySelector: function() {
                        return canvas;
                    }
                };
                let gl = WebGLContext.get( '.test-class' );
                assert( gl instanceof WebGLRenderingContext );
                WebGLContext.remove( canvas );
                global.document = undefined;
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                let result = false;
                try {
                    WebGLContext.get( null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should return the previously created context if no argument is provided', function() {
                let canvas = new HTMLCanvasElement();
                let gl = WebGLContext.get( canvas );
                assert( gl instanceof WebGLRenderingContext );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
            });
            it('should bind the most recently created context', function() {
                let canvas0 = new HTMLCanvasElement();
                let canvas1 = new HTMLCanvasElement();
                let gl0 = WebGLContext.get( canvas0 );
                assert( gl0 === WebGLContext.get( canvas0 ) );
                let gl1 = WebGLContext.get( canvas1 );
                assert( gl1 === WebGLContext.get( canvas1 ) );
                WebGLContext.remove( canvas0 );
                WebGLContext.remove( canvas1 );
            });
        });

        describe('#bind()', function() {
            it('should throw an exception if no argument is passed', function() {
                let result = false;
                try {
                    WebGLContext.bind();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                let result = false;
                try {
                    WebGLContext.bind( null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should bind the context as the current implicit context', function() {
                let canvas0 = new HTMLCanvasElement();
                let canvas1 = new HTMLCanvasElement();
                let gl0 = WebGLContext.get( canvas0 );
                assert( gl0 === WebGLContext.get() );
                let gl1 = WebGLContext.get( canvas1 );
                assert( gl1 === WebGLContext.get() );
                WebGLContext.bind( canvas0 );
                assert( gl0 === WebGLContext.get() );
                WebGLContext.remove( canvas0 );
                WebGLContext.remove( canvas1 );
            });
        });

        describe('#remove()', function() {
            it('should throw an exception if no argument is passed', function() {
                let result = false;
                try {
                    WebGLContext.remove();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if no canvas element can be referenced from the argument', function() {
                let result = false;
                try {
                    WebGLContext.remove( null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should remove the context', function() {
                let canvas = new HTMLCanvasElement();
                let gl = WebGLContext.get( canvas );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
                let result = false;
                try {
                    WebGLContext.get();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should unbind the removed context if it is currently bound', function() {
                let canvas = new HTMLCanvasElement();
                let gl = WebGLContext.get( canvas );
                assert( gl === WebGLContext.get() );
                WebGLContext.remove( canvas );
                let result = false;
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
                let canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                let exts = WebGLContext.supportedExtensions();
                assert( exts instanceof Array );
                WebGLContext.remove( canvas );
            });
            it('should throw an exception if no context is referenced', function() {
                let result = false;
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
                let canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                let exts = WebGLContext.unsupportedExtensions();
                assert( exts instanceof Array );
                WebGLContext.remove( canvas );
            });
            it('should throw an exception if no context is referenced', function() {
                let result = false;
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
                let canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                let supported = WebGLContext.supportedExtensions();
                let unsupported = WebGLContext.unsupportedExtensions();
                supported.forEach( function( ext ) {
                    let isSupported = WebGLContext.checkExtension( ext );
                    assert( typeof isSupported === 'boolean' );
                    assert( isSupported );
                });
                unsupported.forEach( function( ext ) {
                    let isSupported = WebGLContext.checkExtension( ext );
                    assert( typeof isSupported === 'boolean' );
                    assert( !isSupported );
                });
                WebGLContext.remove( canvas );
            });
            it('should query an unbound context if provided', function() {
                let canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                let isSupported = WebGLContext.checkExtension( canvas, 'randomExt');
                assert( typeof isSupported === 'boolean' );
                WebGLContext.remove( canvas );
            });
            it('should return throw an exception if no context is referenced', function() {
                let result = false;
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
                let canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                let supported = WebGLContext.supportedExtensions();
                supported.forEach( function( ext ) {
                    let instance = WebGLContext.getExtension( ext );
                    assert( instance !== null );
                });
                WebGLContext.remove( canvas );
            });
            it('should return null if it doesnt exist', function() {
                let canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                let unsupported = WebGLContext.unsupportedExtensions();
                unsupported.forEach( function( ext ) {
                    let instance = WebGLContext.getExtension( ext );
                    assert( instance === null );
                });
                WebGLContext.remove( canvas );
            });
            it('should query an unbound context if provided', function() {
                let canvas = new HTMLCanvasElement();
                WebGLContext.get( canvas );
                let instance = WebGLContext.getExtension( canvas, 'randomExt');
                assert( instance === null );
                WebGLContext.remove( canvas );
            });
            it('should return throw an exception if no context is referenced', function() {
                let result = false;
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
