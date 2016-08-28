(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let ColorTexture2D = require('../../src/core/ColorTexture2D');
    let ImageLoader = require('../../src/util/ImageLoader');
    require('webgl-mock');
    let _load;
    let canvas;
    let gl;
    let data;
    let width;
    let height;

    let potImage = new HTMLImageElement(256, 256);
    let npotImage = new HTMLImageElement(300, 300);

    describe('ColorTexture2D', function() {

        before(function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get(canvas);
            _load = ImageLoader.load;
            ImageLoader.load = function(opts) {
                setTimeout(function() {
                    opts.success(potImage);
                }, 100);
            };
            global.document = {
                createElement: function() {
                    return new HTMLCanvasElement();
                }
            };
        });

        after(function() {
            WebGLContext.remove(canvas);
            canvas = null;
            gl = null;
            ImageLoader.load = _load;
            global.document = undefined;
        });

        beforeEach(function() {
            let dim = Math.pow(2, Math.floor(Math.random() * 4) + 1);
            data = new Uint8Array(dim * dim * 4);
            for (let i = 0; i<dim * dim * 4; i++) {
                data[i] = 255;
            }
            width = dim;
            height = dim;
        });

        afterEach(function() {
            data = null;
            width = null;
            height = null;
        });

        describe('#constructor()', function() {
            it('should be provided `width` and `height` arguments', function() {
                new ColorTexture2D({
                    width: width,
                    height: height
                });
            });
            it('should accept a string URL `src` argument', function(done) {
                // coverage, for no supplied callback branch
                new ColorTexture2D({
                    src: 'path/to/image',
                });
                new ColorTexture2D({
                    src: 'path/to/image',
                }, function() {
                    done();
                });
            });
            it('should execute callback function passing an error as first argument if a URL `src` results in an error', function(done) {
                let load = ImageLoader.load;
                let err = new Error('error');
                ImageLoader.load = function(opts) {
                    setTimeout(function() {
                        opts.error(err);
                    }, 100);
                };
                // coverage, for no supplied callback branch
                new ColorTexture2D({
                    src: 'path/to/image',
                });
                new ColorTexture2D({
                    src: 'path/to/image',
                }, function(e) {
                    ImageLoader.load = load;
                    assert(e === err);
                    done();
                });
            });
            it('should accept a canvas type `src` argument', function() {
                new ColorTexture2D({
                    src: potImage
                });
            });
            it('should accept non-POT images if POT texture is not required', function() {
                new ColorTexture2D({
                    src: npotImage,
                    mipMap: false,
                    wrap: 'CLAMP_TO_EDGE'
                });
            });
            it('should convert non-POT images to POT images if POT texture is required', function() {
                new ColorTexture2D({
                    src: npotImage,
                });
            });
            it('should accept generic `wrap` and `filter` parameters', function() {
                new ColorTexture2D({
                    width: width,
                    height: height,
                    filter: 'LINEAR',
                    wrap: 'REPEAT'
                });
            });
            it('should accept `wrapS`, `wrapT`, `minFilter`, and `magFilter` parameters', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height,
                    minFilter: 'NEAREST',
                    magFilter: 'NEAREST',
                    wrapS: 'CLAMP_TO_EDGE',
                    wrapT: 'CLAMP_TO_EDGE'
                });
                assert(tex.minFilter === 'NEAREST');
                assert(tex.magFilter === 'NEAREST');
                assert(tex.wrapS === 'CLAMP_TO_EDGE');
                assert(tex.wrapT === 'CLAMP_TO_EDGE');
            });
            it('should default `wrapS` and `wrapT` parameters to `REPEAT`', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.wrapS === 'REPEAT');
                assert(tex.wrapT === 'REPEAT');
            });
            it('should default `minFilter` and `magFilter` parameters to `LINEAR` with mip-mapping disabled', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height,
                    mipMap: false
                });
                assert(tex.minFilter === 'LINEAR');
                assert(tex.magFilter === 'LINEAR');
            });
            it('should default `minFilter` to `LINEAR_MIPMAP_LINEAR` and `magFilter` to `LINEAR` with mip-mapping enabled', function() {
                let tex = new ColorTexture2D({
                    src: potImage
                });
                assert(tex.minFilter === 'LINEAR_MIPMAP_LINEAR');
                assert(tex.magFilter === 'LINEAR');
            });
            it('should accept `mipMap`, `invertY`, and `preMultiplyAlpha` boolean parameters`', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height,
                    mipMap: false,
                    invertY: false,
                    preMultiplyAlpha: false
                });
                assert(tex.mipMap === false);
                assert(tex.invertY === false);
                assert(tex.preMultiplyAlpha === false);
            });
            it('should default `mipMap` to `true` for textures instantiated with `data`, `image`, or `url` argument', function(done) {
                let tex0 = new ColorTexture2D({
                    src: data,
                    width: width,
                    height: height
                });
                assert(tex0.mipMap);
                let tex1 = new ColorTexture2D({
                    src: potImage
                });
                assert(tex1.mipMap);
                let tex2 = new ColorTexture2D({
                    src: 'path/to/image'
                }, function() {
                    assert(tex2.mipMap);
                    done();
                });
            });
            it('should default `mipMap` to `false` for textures without `data`, `image`, or `url` argument', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert(!tex.mipMap);
            });
            it('should default `invertY` to `true`', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.invertY);
            });
            it('should default `preMultiplyAlpha` to `true`', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.preMultiplyAlpha);
            });
            it('should accept `format`, and `type` options`', function() {
                new ColorTexture2D({
                    src: data,
                    width: width,
                    height: height,
                    format: 'RGBA',
                    type: 'UNSIGNED_BYTE',
                    premultiplyAlpha: false
                });
            });
            it('should default `format` to `RGBA`', function() {
                let tex = new ColorTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.format === 'RGBA');
            });
        });

    });

}());
