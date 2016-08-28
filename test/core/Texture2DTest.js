(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let Texture2D = require('../../src/core/Texture2D');
    require('webgl-mock');
    let canvas;
    let gl;
    let data;
    let width;
    let height;

    describe('Texture2D', function() {

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
                new Texture2D({
                    width: width,
                    height: height
                });
            });
            it('should throw an exception if `width` is missing or invalid', function() {
                let result = false;
                try {
                    new Texture2D();
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    new Texture2D({
                        width: null,
                        height: height
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    new Texture2D({
                        width: -23,
                        height: height
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    new Texture2D({
                        width: 'invalid',
                        height: height
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if data is not of canvas type, texture requires POT, and `height` is not POT', function() {
                let result = false;
                try {
                    new Texture2D({
                        src: data,
                        width: width,
                        height: 123
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if data is not of canvas type, texture requires POT, and `width` is not POT', function() {
                let result = false;
                try {
                    new Texture2D({
                        src: data,
                        width: 123,
                        height: height
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if `height` is missing or invalid', function() {
                let result = false;
                try {
                    new Texture2D({
                        width: width
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: null
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: -23
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: 'invalid'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should accept generic `wrap` and `filter` parameters', function() {
                new Texture2D({
                    width: width,
                    height: height,
                    filter: 'LINEAR',
                    wrap: 'REPEAT'
                });
            });
            it('should accept `wrapS`, `wrapT`, `minFilter`, and `magFilter` parameters', function() {
                new Texture2D({
                    width: width,
                    height: height,
                    minFilter: 'LINEAR',
                    magFilter: 'LINEAR',
                    wrapS: 'REPEAT',
                    wrapT: 'REPEAT'
                });
            });
            it('should default `wrapS` and `wrapT` parameters to `REPEAT`', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert(tex.wrapS === 'REPEAT');
                assert(tex.wrapT === 'REPEAT');
            });
            it('should default `minFilter` and `magFilter` parameters to `LINEAR` with mip-mapping disabled', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height,
                    mipMap: false
                });
                assert(tex.minFilter === 'LINEAR');
                assert(tex.magFilter === 'LINEAR');
            });
            it('should default `minFilter` to `LINEAR_MIPMAP_LINEAR` and `magFilter` to `LINEAR` with mip-mapping enabled', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert(tex.minFilter === 'LINEAR_MIPMAP_LINEAR');
                assert(tex.magFilter === 'LINEAR');
            });
            it('should accept `mipMap`, `invertY`, and `preMultiplyAlpha` boolean parameters`', function() {
                let tex = new Texture2D({
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
            it('should default `mipMap` to `true`', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert(tex.mipMap);
            });
            it('should default `invertY` to `true`', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert(tex.invertY);
            });
            it('should default `preMultiplyAlpha` to `true`', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert(tex.preMultiplyAlpha);
            });
            it('should accept `format`, and `type` options`', function() {
                new Texture2D({
                    src: data,
                    width: width,
                    height: height,
                    format: 'RGBA',
                    type: 'UNSIGNED_BYTE',
                    premultiplyAlpha: false
                });
            });
            it('should default `format` to `RGBA`', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert(tex.format === 'RGBA');
            });
            it('should throw exception if `format` is `DEPTH_COMPONENT` or `DEPTH_STENCIL` but not supported by extension', function() {
                let check = WebGLContext.checkExtension;
                WebGLContext.checkExtension = function() {
                    return false;
                };
                let result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        format: 'DEPTH_COMPONENT'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        format: 'DEPTH_STENCIL'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                WebGLContext.checkExtension = check;
            });
            it('should default `type` to `UNSIGNED_BYTE`', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                assert(tex.type === 'UNSIGNED_BYTE');
            });
            it('should throw exception if `type` is `FLOAT` but not supported by extension', function() {
                let check = WebGLContext.checkExtension;
                WebGLContext.checkExtension = function() {
                    return false;
                };
                let result = false;
                try {
                    new Texture2D({
                        width: width,
                        height: height,
                        type: 'FLOAT'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                WebGLContext.checkExtension = check;
            });
        });

        describe('#bufferData()', function() {
            it('should accept a `null` argument', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData(null);
            });
            it('should accept an Array argument', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData(new Array(data));
            });
            it('should cast an Array to the corresponding ArrayBufferView based on the `type`', function() {
                let tex0 = new Texture2D({
                    width: width,
                    height: height,
                    type: 'UNSIGNED_SHORT'
                });
                tex0.bufferData(new Array(data));
                let tex1 = new Texture2D({
                    width: width,
                    height: height,
                    type: 'UNSIGNED_INT'
                });
                tex1.bufferData(new Array(data));
                let tex2 = new Texture2D({
                    width: width,
                    height: height,
                    type: 'FLOAT'
                });
                tex2.bufferData(new Array(data));
            });
            it('should accept a Uint8Array argument', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData(new Uint8Array());
            });
            it('should accept a Uint16Array argument', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData(new Uint16Array());
            });
            it('should accept a Uint32Array argument', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData(new Uint32Array());
            });
            it('should accept a Float32Array argument', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bufferData(new Float32Array());
            });
            it('should throw an exception if the argument is not an Array, ArrayBuffer, ArrayBufferView, ImageData, HTMLImageElement, HTMLCanvasElement, HTMLVideoElement or null', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                let result = false;
                try {
                    tex.bufferData('derp');
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#setParameters()', function() {
            it('should accept `wrap`, `wrapS`, and `wrapT` parameters', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.setParameters({
                    wrap: 'CLAMP_TO_EDGE'
                });
                assert(tex.wrapS === 'CLAMP_TO_EDGE');
                assert(tex.wrapT === 'CLAMP_TO_EDGE');
                tex.setParameters({
                    wrapS: 'REPEAT',
                    wrapT: 'REPEAT'
                });
                assert(tex.wrapS === 'REPEAT');
                assert(tex.wrapT === 'REPEAT');
            });
            it('should accept `filter`, `minFilter`, and `magFilter` parameters', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height,
                    mipMap: false
                });
                tex.setParameters({
                    filter: 'NEAREST'
                });
                assert(tex.minFilter === 'NEAREST');
                assert(tex.magFilter === 'NEAREST');
                tex.setParameters({
                    minFilter: 'LINEAR',
                    magFilter: 'LINEAR'
                });
                assert(tex.minFilter === 'LINEAR');
                assert(tex.minFilter === 'LINEAR');
            });
            it('should default `minFilter` suffix to `_MIPMAP_LINEAR` if mip-mapping enabled', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.setParameters({
                    filter: 'NEAREST'
                });
                assert(tex.minFilter === 'NEAREST_MIPMAP_LINEAR');
                tex.setParameters({
                    minFilter: 'LINEAR'
                });
                assert(tex.minFilter === 'LINEAR_MIPMAP_LINEAR');
            });
            it('should throw an exception if parameter values are invalid', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                let result = false;
                try {
                    tex.setParameters({
                        filter: 'invalid'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.setParameters({
                        minFilter: 'invalid'
                    });
                } catch(err) {
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
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.setParameters({
                        magFilter: 'invalid'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.setParameters({
                        wrap: 'invalid'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.setParameters({
                        wrapS: 'invalid'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.setParameters({
                        wrapT: 'invalid'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#bind()', function() {
            it('should bind the texture to a provided unit', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bind(0);
                tex.unbind();
            });
            it('should default unit to 0 if not provided', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bind();
                tex.unbind();
            });
            it('should throw an exception if unit is not valid', function() {
                var tex = new Texture2D({
                    width: width,
                    height: height
                });
                var result = false;
                try {
                    tex.bind('invalid');
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.bind(-1);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#unbind()', function() {
            it('should unbind the texture', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                tex.bind(0);
                tex.unbind();
            });
        });

        describe('#resize()', function() {
            it('should resize the underlying buffer', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                let nWidth = width / 2;
                let nHeight = height / 2;
                tex.resize(nWidth, nHeight);
                assert(tex.width === nWidth);
                assert(tex.height === nHeight);
            });
            it('should throw an exception if the `width` is missing or invalid', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                let result = false;
                try {
                    tex.resize(undefined, 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.resize(null, 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.resize(-14, 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.resize('invalid', 200);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if the `height` is missing or invalid', function() {
                let tex = new Texture2D({
                    width: width,
                    height: height
                });
                let result = false;
                try {
                    tex.resize(200, undefined);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.resize(200, null);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.resize(200, -14);
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    tex.resize(200, 'invalid');
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

    });

}());
