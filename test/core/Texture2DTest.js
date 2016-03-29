(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var Texture2D = require('../../src/core/Texture2D');
    require('webgl-mock');
    var canvas;
    var gl;
    var data;
    var width;
    var height;

    describe('Texture2D', function() {

        before( function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get( canvas );
        });

        after( function() {
            WebGLContext.remove( canvas );
            canvas = null;
            gl = null;
        });

        beforeEach( function() {
            var dim = Math.pow(2, Math.floor( Math.random() * 4 ) + 1 );
            data = new Uint8Array( dim * dim * 4 );
            for ( var i = 0; i<dim * dim * 4; i++ ) {
                data[i] = 255;
            }
            width = dim;
            height = dim;
        });

        afterEach( function() {
            data = null;
            width = null;
            height = null;
        });

        describe('#constructor()', function() {
            it('should be provided `width` and `height` arguments', function() {
                try {
                    new Texture2D({
                        width: width,
                        height: height
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if `width` is missing or invalid', function() {
                var result = false;
                try {
                    new Texture2D();
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new Texture2D({
                        width: null,
                        height: height
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new Texture2D({
                        width: -23,
                        height: height
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new Texture2D({
                        width: 'invalid',
                        height: height
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if `height` is missing or invalid', function() {
                var result = false;
                try {
                    new Texture2D({
                        width: width
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: null
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: -23
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept generic `wrap` and `filter` parameters', function() {
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        filter: 'LINEAR',
                        wrap: 'REPEAT'
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept `wrapS`, `wrapT`, `minFilter`, and `magFilter` parameters', function() {
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        minFilter: 'LINEAR',
                        magFilter: 'LINEAR',
                        wrapS: 'REPEAT',
                        wrapT: 'REPEAT'
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should default `wrapS` and `wrapT` parameters to `REPEAT`', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert( tex.wrapS === 'REPEAT' );
                assert( tex.wrapT === 'REPEAT' );
            });
            it('should default `minFilter` and `magFilter` parameters to `LINEAR` with mip-mapping disabled', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height,
                    mipMap: false
                });
                assert( tex.minFilter === 'LINEAR' );
                assert( tex.magFilter === 'LINEAR' );
            });
            it('should default `minFilter` to `LINEAR_MIPMAP_LINEAR` and `magFilter` to `LINEAR` with mip-mapping enabled', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert( tex.minFilter === 'LINEAR_MIPMAP_LINEAR' );
                assert( tex.magFilter === 'LINEAR' );
            });
            it('should accept `mipMap`, `invertY`, and `preMultiplyAlpha` boolean parameters`', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height,
                    mipMap: false,
                    invertY: false,
                    preMultiplyAlpha: false
                });
                assert( tex.mipMap === false );
                assert( tex.invertY === false );
                assert( tex.preMultiplyAlpha === false );
            });
            it('should default `mipMap` to `true`', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert( tex.mipMap );
            });
            it('should default `invertY` to `true`', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert( tex.invertY );
            });
            it('should default `preMultiplyAlpha` to `true`', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert( tex.preMultiplyAlpha );
            });
            it('should accept `format`, and `type` options`', function() {
                try {
                    new Texture2D({
                        data: data,
                        width: width,
                        height: height,
                        format: 'RGBA',
                        type: 'UNSIGNED_BYTE',
                        premultiplyAlpha: false
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should default `format` to `RGBA`', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert( tex.format === 'RGBA' );
            });
            it('should throw exception if `format` is `DEPTH_COMPONENT` or `DEPTH_STENCIL` but not supported by extension', function() {
                var check = WebGLContext.checkExtension;
                WebGLContext.checkExtension = function() {
                    return false;
                };
                var result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        format: 'DEPTH_COMPONENT'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        format: 'DEPTH_STENCIL'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                WebGLContext.checkExtension = check;
            });
            it('should default `type` to `UNSIGNED_BYTE`', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert( tex.type === 'UNSIGNED_BYTE' );
            });
            it('should throw exception if `type` is `FLOAT` but not supported by extension', function() {
                var check = WebGLContext.checkExtension;
                WebGLContext.checkExtension = function() {
                    return false;
                };
                var result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        type: 'FLOAT'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                WebGLContext.checkExtension = check;
            });
        });

        describe('#bufferData()', function() {
            it('should accept a `null` argument', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData( null );
            });
            it('should accept an Array argument', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData( new Array( data ) );
            });
            it('should cast an Array to the corresponding ArrayBufferView based on the `type`', function() {
                var tex0 = new Texture2D({
                    width: width,
                    height: height,
                    type: 'UNSIGNED_SHORT'
                });
                tex0.bufferData( new Array( data ) );
                var tex1 = new Texture2D({
                    width: width,
                    height: height,
                    type: 'UNSIGNED_INT'
                });
                tex1.bufferData( new Array( data ) );
                var tex2 = new Texture2D({
                    width: width,
                    height: height,
                    type: 'FLOAT'
                });
                tex2.bufferData( new Array( data ) );
            });
            it('should accept a Uint8Array argument', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData( new Uint8Array() );
            });
            it('should accept a Uint16Array argument', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData( new Uint16Array() );
            });
            it('should accept a Uint32Array argument', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData( new Uint32Array() );
            });
            it('should accept a Float32Array argument', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData( new Float32Array() );
            });
            it('should throw an exception if the argument is not an Array, ArrayBuffer, ArrayBufferView, or null', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.bufferData( 'derp' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#setParameters()', function() {
            it('should accept `wrap`, `wrapS`, and `wrapT` parameters', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                try {
                    tex.setParameters({
                        wrap: 'CLAMP_TO_EDGE'
                    });
                    assert( tex.wrapS === 'CLAMP_TO_EDGE' );
                    assert( tex.wrapT === 'CLAMP_TO_EDGE' );
                    tex.setParameters({
                        wrapS: 'REPEAT',
                        wrapT: 'REPEAT'
                    });
                    assert( tex.wrapS === 'REPEAT' );
                    assert( tex.wrapT === 'REPEAT' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept `filter`, `minFilter`, and `magFilter` parameters', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height,
                    mipMap: false
                });
                try {
                    tex.setParameters({
                        filter: 'NEAREST'
                    });
                    assert( tex.minFilter === 'NEAREST' );
                    assert( tex.magFilter === 'NEAREST' );
                    tex.setParameters({
                        minFilter: 'LINEAR',
                        magFilter: 'LINEAR'
                    });
                    assert( tex.minFilter === 'LINEAR' );
                    assert( tex.minFilter === 'LINEAR' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should default `minFilter` suffix to `_MIPMAP_LINEAR` if mip-mapping enabled', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                try {
                    tex.setParameters({
                        filter: 'NEAREST'
                    });
                    assert( tex.minFilter === 'NEAREST_MIPMAP_LINEAR' );
                    tex.setParameters({
                        minFilter: 'LINEAR'
                    });
                    assert( tex.minFilter === 'LINEAR_MIPMAP_LINEAR' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if parameter values are invalid', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.setParameters({
                        filter: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.setParameters({
                        minFilter: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                result = false;
                tex = new Texture2D({
                    width: width,
                    height: height,
                    mipMap: false
                });
                try {
                    tex.setParameters({
                        minFilter: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.setParameters({
                        magFilter: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.setParameters({
                        wrap: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.setParameters({
                        wrapS: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.setParameters({
                        wrapT: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#push()', function() {
            it('should push the texture onto the stack for a provided unit', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.push( 0 );
                tex.pop( 0 );
            });
            it('should default unit to 0 if not provided', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.push();
                tex.pop();
            });
            it('should throw an exception if unit is not valid', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.push( 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.push( -1 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#pop()', function() {
            it('should pop the texture off the stack for a provided unit', function() {
                var tex0 = new Texture2D({
                    width: width,
                    height: height
                });
                var tex1 = new Texture2D({
                    width: width,
                    height: height
                });
                tex0.push( 0 );
                tex1.push( 0 );
                tex1.pop( 0 );
                tex0.pop( 0 );
            });
            it('should default unit to 0 if not provided', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.push();
                tex.push();
                tex.pop();
                tex.pop();
            });
            it('should throw an exception if the texture is not the top of the stack', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.pop( 0 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if unit is not valid', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.push( 0 );
                var result = false;
                try {
                    tex.pop( 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.pop( -1 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                tex.pop( 0 );
            });
        });

        describe('#resize()', function() {
            it('should resize the underlying data', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.resize( width / 2, height / 2 );
            });
            it('should throw an exception if the `width` is missing or invalid', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.resize( undefined, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.resize( null, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.resize( -14, 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.resize( 'invalid', 200 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the `height` is missing or invalid', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.resize( 200, undefined );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.resize( 200, null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.resize( 200, -14 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    tex.resize( 200, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

    });

}());
