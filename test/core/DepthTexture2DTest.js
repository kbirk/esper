(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let DepthTexture2D = require('../../src/core/DepthTexture2D');
    require('webgl-mock');
    let canvas;
    let gl;
    let data;
    let width;
    let height;

    describe('DepthTexture2D', function() {

        before(function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get(canvas);
        });

        after(function() {
            WebGLContext.remove(canvas);
            canvas = null;
            gl = null;
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
                new DepthTexture2D({
                    width: width,
                    height: height
                });
            });
            it('should accept generic `wrap` and `filter` parameters', function() {
                new DepthTexture2D({
                    width: width,
                    height: height,
                    filter: 'LINEAR',
                    wrap: 'REPEAT'
                });
            });
            it('should accept `wrapS`, `wrapT`, `minFilter`, and `magFilter` parameters', function() {
                let tex = new DepthTexture2D({
                    width: width,
                    height: height,
                    minFilter: 'LINEAR',
                    magFilter: 'LINEAR',
                    wrapS: 'REPEAT',
                    wrapT: 'REPEAT'
                });
                assert(tex.minFilter === 'LINEAR');
                assert(tex.magFilter === 'LINEAR');
                assert(tex.wrapS === 'REPEAT');
                assert(tex.wrapT === 'REPEAT');
            });
            it('should default `wrapS` and `wrapT` parameters to `CLAMP_TO_EDGE`', function() {
                let tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.wrapS === 'CLAMP_TO_EDGE');
                assert(tex.wrapT === 'CLAMP_TO_EDGE');
            });
            it('should default `minFilter` and `magFilter` parameters to `LINEAR`', function() {
                let tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.minFilter === 'LINEAR');
                assert(tex.magFilter === 'LINEAR');
            });
            it('should accept `format`, and `type` options`', function() {
                new DepthTexture2D({
                    width: width,
                    height: height,
                    format: 'RGBA',
                    type: 'UNSIGNED_BYTE'
                });
            });
            it('should set `type` to `UNSIGNED_INT_24_8_WEBGL` if `format` is `DEPTH_STENCIL`', function() {
                let tex = new DepthTexture2D({
                    width: width,
                    height: height,
                    format: 'DEPTH_STENCIL'
                });
                assert(tex.type === 'UNSIGNED_INT_24_8_WEBGL');
            });
            it('should default `format` to `DEPTH_COMPONENT`', function() {
                let tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.format === 'DEPTH_COMPONENT');
            });
            it('should default `type` to `UNSIGNED_BYTE`', function() {
                let tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert(tex.type === 'UNSIGNED_INT');
            });
        });

    });

}());
