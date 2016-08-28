(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let Texture2D = require('../../src/core/Texture2D');
    let RenderTarget = require('../../src/core/RenderTarget');
    require('webgl-mock');
    let canvas;
    let gl;

    describe('RenderTarget', function() {

        before(function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get(canvas);
        });

        after(function() {
            WebGLContext.remove(canvas);
            canvas = null;
            gl = null;
        });

        describe('#constructor()', function() {
            it('should accept no arguments', function() {
                new RenderTarget();
            });
        });

        describe('#setColorTarget()', function() {
            it('should accept `texture` and attachment `index` arguments', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256
                });
                target.setColorTarget(texture, 0);
            });
            it('should default attachment `index` to 0 if not provided', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256
                });
                target.setColorTarget(texture);
                target.setColorTarget(texture, 'TEXTURE_CUBE_MAP');
            });
            it('should accept an optional `target` parameter', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256
                });
                target.setColorTarget(texture, 0, 'TEXTURE_CUBE_MAP');
            });
            it('should throw an exception if no `texture` is provided', function() {
                let target = new RenderTarget();
                let result = false;
                try {
                    target.setColorTarget();
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if `index` is invalid', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256
                });
                let result = false;
                try {
                    target.setColorTarget(texture, 'invalid');
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if `target` is invalid', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256
                });
                let result = false;
                try {
                    target.setColorTarget(texture, 0, 'invalid');
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#setDepthTarget()', function() {
            it('should accept `texture` argument', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256,
                    format: 'DEPTH_COMPONENT'
                });
                target.setDepthTarget(texture);
            });
            it('should throw an exception if no `texture` is provided', function() {
                let target = new RenderTarget();
                let result = false;
                try {
                    target.setDepthTarget();
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if `texture` is not of format `DEPTH_COMPONENT` or `DEPTH_STENCIL`', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256
                });
                let result = false;
                try {
                    target.setDepthTarget(texture);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#bind()', function() {
            it('should bind the rendertarget', function() {
                let target = new RenderTarget();
                target.bind();
                target.unbind();
                target.unbind();
                target.unbind();
            });
        });

        describe('#unbind()', function() {
            it('should unbind the rendertarget', function() {
                let target = new RenderTarget();
                target.bind();
                target.unbind();
            });
        });

        describe('#resize()', function() {
            it('should resize the underlying data', function() {
                let target = new RenderTarget();
                let texture = new Texture2D({
                    width: 256,
                    height: 256
                });
                target.setColorTarget(texture);
                target.resize(256, 256);
            });
            it('should throw an exception if the `width` is missing or invalid', function() {
                let target = new RenderTarget();
                let result = false;
                try {
                    target.resize(undefined, 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    target.resize(null, 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    target.resize(-14, 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    target.resize('invalid', 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if the `height` is missing or invalid', function() {
                let target = new RenderTarget();
                let result = false;
                try {
                    target.resize(200, undefined);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    target.resize(200, null);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    target.resize(200, -14);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    target.resize(200, 'invalid');
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

    });

}());
