(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var TextureCubeMap = require('../../src/core/TextureCubeMap');
    var ImageLoader = require('../../src/util/ImageLoader');
    require('webgl-mock');
    var _load;
    var canvas;
    var gl;
    var data;
    var width;
    var height;
    var faces;

    var potImage = new Image( 256, 256 );
    var npotImage = new Image( 300, 300 );

    function castTo( faces, Class ) {
        return {
            '+x': new Class( faces['+x'] ),
            '+y': new Class( faces['+y'] ),
            '+z': new Class( faces['+z'] ),
            '-x': new Class( faces['-x'] ),
            '-y': new Class( faces['-y'] ),
            '-z': new Class( faces['-z'] )
        };
    }

    describe('TextureCubeMap', function() {

        before( function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get( canvas );
            _load = ImageLoader.load;
            ImageLoader.load = function( opts ) {
                setTimeout( function() {
                    opts.success( potImage );
                }, 100 );
            };
            global.document = {
                createElement: function() {
                    return new HTMLCanvasElement();
                }
            };
        });

        after( function() {
            WebGLContext.remove( canvas );
            canvas = null;
            gl = null;
            ImageLoader.load = _load;
            global.document = undefined;
        });

        beforeEach( function() {
            var dim = Math.pow(2, Math.floor( Math.random() * 4 ) + 1 );
            data = new Array( dim * dim * 4 );
            for ( var i = 0; i<dim * dim * 4; i++ ) {
                data[i] = 255;
            }
            width = dim;
            height = dim;
            faces = {};
            faces['+x'] = data;
            faces['+y'] = data;
            faces['+z'] = data;
            faces['-x'] = data;
            faces['-y'] = data;
            faces['-z'] = data;
        });

        afterEach( function() {
            data = null;
            width = null;
            height = null;
            faces = null;
        });

        describe('#constructor()', function() {
            it('should be accept an Array type argument complimented with `width` and `height` arguments', function() {
                try {
                    new TextureCubeMap({
                        width: width,
                        height: height,
                        data: data
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should be accept a `null` data argument complimented with `width` and `height` arguments', function() {
                try {
                    new TextureCubeMap({
                        width: width,
                        height: height,
                        data: null
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if `data` argument is not complimented with a valid `width` argument', function() {
                var result = false;
                try {
                    new TextureCubeMap();
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new TextureCubeMap({
                        width: null,
                        height: height
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new TextureCubeMap({
                        width: -23,
                        height: height
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new TextureCubeMap({
                        width: 'invalid',
                        height: height
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if `data` argument is not complimented with a valid `height` argument', function() {
                var result = false;
                try {
                    new TextureCubeMap({
                        width: width
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new TextureCubeMap({
                        width: width,
                        height: null
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new TextureCubeMap({
                        width: width,
                        height: -23
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new TextureCubeMap({
                        width: width,
                        height: 'invalid'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept a `urls` object argument', function( done ) {
                try {
                    new TextureCubeMap({
                        urls: {
                            '+x': 'path/to/x-pos',
                            '+y': 'path/to/y-pos',
                            '+z': 'path/to/z-pos',
                            '-x': 'path/to/x-neg',
                            '-y': 'path/to/y-neg',
                            '-z': 'path/to/z-neg'
                        }
                    }, function() {
                        done();
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should execute callback function passing an error as first argument if a `urls` results in an error', function( done ) {
                var load = ImageLoader.load;
                var err = new Error( 'error' );
                ImageLoader.load = function( opts ) {
                    setTimeout( function() {
                        opts.error( err );
                    }, 100 );
                };
                new TextureCubeMap({
                    urls: {
                        '+x': 'path/to/x-pos',
                        '+y': 'path/to/y-pos',
                        '+z': 'path/to/z-pos',
                        '-x': 'path/to/x-neg',
                        '-y': 'path/to/y-neg',
                        '-z': 'path/to/z-neg'
                    }
                }, function( e ) {
                    assert( e === err );
                    ImageLoader.load = load;
                    done();
                });
            });
            it('should accept an `images` object argument', function() {
                try {
                    new TextureCubeMap({
                        images: {
                            '+x': potImage,
                            '+y': potImage,
                            '+z': potImage,
                            '-x': potImage,
                            '-y': potImage,
                            '-z': potImage
                        }
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept non-POT images if POT texture is not required', function() {
                try {
                    new TextureCubeMap({
                        images: {
                            '+x': npotImage,
                            '+y': npotImage,
                            '+z': npotImage,
                            '-x': npotImage,
                            '-y': npotImage,
                            '-z': npotImage
                        },
                        mipMap: false,
                        wrap: 'CLAMP_TO_EDGE'
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should convert non-POT images to POT images if POT texture is required', function() {
                try {
                    new TextureCubeMap({
                        images: {
                            '+x': npotImage,
                            '+y': npotImage,
                            '+z': npotImage,
                            '-x': npotImage,
                            '-y': npotImage,
                            '-z': npotImage
                        }
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept generic `wrap` and `filter` parameters', function() {
                try {
                    new TextureCubeMap({
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
                    new TextureCubeMap({
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
            it('should default `wrapS` and `wrapT` parameters to `CLAMP_TO_EDGE`', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                assert( tex.wrapS === 'CLAMP_TO_EDGE' );
                assert( tex.wrapT === 'CLAMP_TO_EDGE' );
            });
            it('should default `minFilter` and `magFilter` parameters to `LINEAR` with mip-mapping disabled', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height,
                    mipMap: false
                });
                assert( tex.minFilter === 'LINEAR' );
                assert( tex.magFilter === 'LINEAR' );
            });
            it('should default `minFilter` to `LINEAR_MIPMAP_LINEAR` and `magFilter` to `LINEAR` with mip-mapping enabled', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                assert( tex.minFilter === 'LINEAR_MIPMAP_LINEAR' );
                assert( tex.magFilter === 'LINEAR' );
            });
            it('should accept `mipMap`, `invertY`, and `preMultiplyAlpha` boolean parameters`', function() {
                var tex = new TextureCubeMap({
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
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                assert( tex.mipMap );
            });
            it('should default `invertY` to `true`', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                assert( tex.invertY );
            });
            it('should default `preMultiplyAlpha` to `true`', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                assert( tex.preMultiplyAlpha );
            });
            it('should accept `format`, and `type` options`', function() {
                try {
                    new TextureCubeMap({
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
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                assert( tex.format === 'RGBA' );
            });
            it('should default `type` to `UNSIGNED_BYTE`', function() {
                var tex = new TextureCubeMap({
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
                    new TextureCubeMap({
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
            it('should accept a `faces` object argument of data to buffer', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( faces );
            });
            it('should accept a single `faces` argument of data to buffer all faces with', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( faces['+x'] );
            });
            it('should accept options `width` and `height` arguments', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( faces, width, height );
            });
            it('should throw exception if `width` is invalid', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.bufferData( faces, 'invalid', height );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw exception if `height` is invalid', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.bufferData( faces, width, 'invalid' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw exception if `width` and `height` are not equal', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.bufferData( faces, width * 2, height );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept a `null` argument', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( null );
            });
            it('should accept Array face arguments', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( faces );
            });
            it('should cast an Array to the corresponding ArrayBufferView based on the `type`', function() {
                var tex0 = new TextureCubeMap({
                    width: width,
                    height: height,
                    type: 'UNSIGNED_SHORT'
                });
                tex0.bufferData( faces );
                var tex1 = new TextureCubeMap({
                    width: width,
                    height: height,
                    type: 'UNSIGNED_INT'
                });
                tex1.bufferData( faces );
                var tex2 = new TextureCubeMap({
                    width: width,
                    height: height,
                    type: 'FLOAT'
                });
                tex2.bufferData( faces );
            });
            it('should accept a Uint8Array argument', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( castTo( faces, Uint8Array ) );
            });
            it('should accept a Uint16Array argument', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( castTo( faces, Uint16Array ) );
            });
            it('should accept a Uint32Array argument', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( castTo( faces, Uint32Array ) );
            });
            it('should accept a Float32Array argument', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.bufferData( castTo( faces, Float32Array ) );
            });
            it('should throw an exception if the argument is not an Array, ArrayBuffer, ArrayBufferView, or null', function() {
                var tex = new TextureCubeMap({
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
                var tex = new TextureCubeMap({
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
                var tex = new TextureCubeMap({
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
                var tex = new TextureCubeMap({
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
                var tex = new TextureCubeMap({
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
                tex = new TextureCubeMap({
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
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.push( 0 );
                tex.pop( 0 );
            });
            it('should default unit to 0 if not provided', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.push();
                tex.pop();
            });
            it('should throw an exception if unit is not valid', function() {
                var tex = new TextureCubeMap({
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
                var tex0 = new TextureCubeMap({
                    width: width,
                    height: height
                });
                var tex1 = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex0.push( 0 );
                tex1.push( 0 );
                tex1.pop( 0 );
                tex0.pop( 0 );
            });
            it('should default unit to 0 if not provided', function() {
                var tex = new TextureCubeMap({
                    width: width,
                    height: height
                });
                tex.push();
                tex.push();
                tex.pop();
                tex.pop();
            });
            it('should throw an exception if the texture is not the top of the stack', function() {
                var tex = new TextureCubeMap({
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
                var tex = new TextureCubeMap({
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

    });

}());
