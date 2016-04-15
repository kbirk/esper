(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var ColorTexture2D = require('../../src/core/ColorTexture2D');
    var ImageLoader = require('../../src/util/ImageLoader');
    require('webgl-mock');
    var _load;
    var canvas;
    var gl;
    var data;
    var width;
    var height;

    var potImage = new HTMLImageElement( 256, 256 );
    var npotImage = new HTMLImageElement( 300, 300 );

    describe('ColorTexture2D', function() {

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
                    new ColorTexture2D({
                        width: width,
                        height: height
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a string URL `src` argument', function( done ) {
                try {
                    new ColorTexture2D({
                        src: 'path/to/image',
                    }, function() {
                        done();
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should execute callback function passing an error as first argument if a URL `src` results in an error', function( done ) {
                var load = ImageLoader.load;
                var err = new Error( 'error' );
                ImageLoader.load = function( opts ) {
                    setTimeout( function() {
                        opts.error( err );
                    }, 100 );
                };
                new ColorTexture2D({
                    src: 'path/to/image',
                }, function( e ) {
                    assert( e === err );
                    ImageLoader.load = load;
                    done();
                });
            });
            it('should accept a canvas type `src` argument', function() {
                try {
                    new ColorTexture2D({
                        src: potImage
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept non-POT images if POT texture is not required', function() {
                try {
                    new ColorTexture2D({
                        src: npotImage,
                        mipMap: false,
                        wrap: 'CLAMP_TO_EDGE'
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should convert non-POT images to POT images if POT texture is required', function() {
                try {
                    new ColorTexture2D({
                        src: npotImage,
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept generic `wrap` and `filter` parameters', function() {
                try {
                    new ColorTexture2D({
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
                    var tex = new ColorTexture2D({
                        width: width,
                        height: height,
                        minFilter: 'NEAREST',
                        magFilter: 'NEAREST',
                        wrapS: 'CLAMP_TO_EDGE',
                        wrapT: 'CLAMP_TO_EDGE'
                    });
                    assert( tex.minFilter === 'NEAREST' );
                    assert( tex.magFilter === 'NEAREST' );
                    assert( tex.wrapS === 'CLAMP_TO_EDGE' );
                    assert( tex.wrapT === 'CLAMP_TO_EDGE' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should default `wrapS` and `wrapT` parameters to `REPEAT`', function() {
                var tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.wrapS === 'REPEAT' );
                assert( tex.wrapT === 'REPEAT' );
            });
            it('should default `minFilter` and `magFilter` parameters to `LINEAR` with mip-mapping disabled', function() {
                var tex = new ColorTexture2D({
                    width: width,
                    height: height,
                    mipMap: false
                });
                assert( tex.minFilter === 'LINEAR' );
                assert( tex.magFilter === 'LINEAR' );
            });
            it('should default `minFilter` to `LINEAR_MIPMAP_LINEAR` and `magFilter` to `LINEAR` with mip-mapping enabled', function() {
                var tex = new ColorTexture2D({
                    src: potImage
                });
                assert( tex.minFilter === 'LINEAR_MIPMAP_LINEAR' );
                assert( tex.magFilter === 'LINEAR' );
            });
            it('should accept `mipMap`, `invertY`, and `preMultiplyAlpha` boolean parameters`', function() {
                var tex = new ColorTexture2D({
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
            it('should default `mipMap` to `true` for textures instantiated with `data`, `image`, or `url` argument', function( done ) {
                var tex0 = new ColorTexture2D({
                    src: data,
                    width: width,
                    height: height
                });
                assert( tex0.mipMap );
                var tex1 = new ColorTexture2D({
                    src: potImage
                });
                assert( tex1.mipMap );
                var tex2 = new ColorTexture2D({
                    src: 'path/to/image'
                }, function() {
                    assert( tex2.mipMap );
                    done();
                });
            });
            it('should default `mipMap` to `false` for textures without `data`, `image`, or `url` argument', function() {
                var tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert( !tex.mipMap );
            });
            it('should default `invertY` to `true`', function() {
                var tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.invertY );
            });
            it('should default `preMultiplyAlpha` to `true`', function() {
                var tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.preMultiplyAlpha );
            });
            it('should accept `format`, and `type` options`', function() {
                try {
                    new ColorTexture2D({
                        src: data,
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
                var tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.format === 'RGBA' );
            });
        });

    });

}());
