(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let Shader = require('../../src/core/Shader');
    let XHRLoader = require('../../src/util/XHRLoader');
    require('webgl-mock');
    let canvas;
    let gl;
    let _load;

    let vert =
        `
        attribute highp vec3 aVertexPosition;
        attribute highp vec3 aVertexNormal;
        attribute highp vec2 aTextureCoord;
        uniform highp mat4 uViewMatrix;
        uniform highp mat4 uModelMatrix;
        uniform highp mat4 uProjectionMatrix;
        void main() {}
        `;

    let frag =
        `
        uniform highp mat4 uViewMatrix;
        uniform highp vec3 uLightPosition;
        uniform bool uUseTexture;
        uniform highp vec4 uDiffuseColor;
        uniform sampler2D uDiffuseTextureSampler;
        uniform highp vec4 uSpecularColor;
        uniform highp float uSpecularComponent;
        uniform highp mat2 uMat2Array[16];
        uniform highp mat3 uMat3Array[16];
        void main() {}
        `;

    let urls = {
        'path/to/vert': vert,
        'path/to/frag': frag
    };

    let identity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    describe('Shader', function() {

        before(function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get(canvas);
            _load = XHRLoader.load;
            XHRLoader.load = function(opts) {
                setTimeout(function() {
                    opts.success(urls[opts.url]);
                }, 100);
            };
        });

        after(function() {
            WebGLContext.remove(canvas);
            canvas = null;
            gl = null;
            XHRLoader.load = _load;
        });

        describe('#constructor()', function() {
            it('should throw an exception if there is no `vert` argument', function() {
                let result = false;
                try {
                    new Shader();
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if there is no `frag` argument', function() {
                let result = false;
                try {
                    new Shader({
                        vert: vert
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if there is a compilation error', function() {
                let getShaderParameter = gl.getShaderParameter;
                gl.getShaderParameter = function() {
                    return false;
                };
                let result = false;
                try {
                    new Shader({
                        vert: vert,
                        frag: frag
                    });
                } catch(err) {
                    result = true;
                }
                gl.getShaderParameter = getShaderParameter;
                assert(result);
            });
            it('should throw an exception if there is a linking error', function() {
                let getProgramParameter = gl.getProgramParameter;
                gl.getProgramParameter = function() {
                    return false;
                };
                let result = false;
                try {
                    new Shader({
                        vert: vert,
                        frag: frag
                    });
                } catch(err) {
                    result = true;
                }
                gl.getProgramParameter = getProgramParameter;
                assert(result);
            });
            it('should accept shader arguments as glsl source', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                assert(shader);
            });
            it('should accept shader arguments as URLs', function() {
                let shader = new Shader({
                    vert: 'path/to/vert',
                    frag: 'path/to/frag'
                }, function() {
                    assert(shader);
                });
            });
            it('should execute callback function passing an error as first argument if a URL results in an error', function(done) {
                let load = XHRLoader.load;
                let err = new Error('error');
                XHRLoader.load = function(opts) {
                    setTimeout(function() {
                        opts.error(err);
                    }, 100);
                };
                new Shader({
                    vert: 'path/to/vert',
                    frag: 'path/to/frag'
                }, function(e) {
                    XHRLoader.load = load;
                    assert(e === err);
                    done();
                });
            });
            it('should accept an `attributes` array argument to override attribute indices', function() {
                let shader0 = new Shader({
                    vert: vert,
                    frag: frag,
                    attributes: [
                        'aTextureCoord',
                        'aVertexNormal',
                        'aVertexPosition'
                    ]
                });
                assert(shader0.attributes.aTextureCoord.index === 0);
                assert(shader0.attributes.aVertexNormal.index === 1);
                assert(shader0.attributes.aVertexPosition.index === 2);
                let shader1 = new Shader({
                    vert: vert,
                    frag: frag,
                    attributes: [
                        'aTextureCoord',
                        'aVertexPosition'
                    ]
                });
                assert(shader1.attributes.aTextureCoord.index === 0);
                assert(shader1.attributes.aVertexPosition.index === 1);
                assert(shader1.attributes.aVertexNormal.index === 2);
            });
        });

        describe('#use()', function() {
            it('should use the shader', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
            });
        });

        describe('#setUniform()', function() {
            it('should accept value of type `boolean`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniform('uUseTexture', true);
                shader.setUniform('uUseTexture', false);
            });
            it('should accept value of type `number`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniform('uSpecularComponent', 10);
            });
            it('should accept value of type `Array`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniform('uModelMatrix', identity);
            });
            it('should accept value of type `Float32Array`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniform('uModelMatrix', new Float32Array(identity));
                shader.setUniform('uMat2Array', new Float32Array(identity));
                shader.setUniform('uMat3Array', new Float32Array(identity));
            });
            it('should throw an exception if the uniform does not exist', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                let result = false;
                try {
                    shader.setUniform('doesNotExist', identity);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if the value is undefined or null', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                let result = false;
                try {
                    shader.setUniform('uModelMatrix');
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    shader.setUniform('uModelMatrix', null);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#setUniforms()', function() {
            it('should accept value of type `boolean`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniforms({
                    uUseTexture: true
                });
            });
            it('should accept value of type `number`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniforms({
                    uSpecularComponent: 10
                });
            });
            it('should accept value of type `Array`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniforms({
                    uModelMatrix: identity
                });
            });
            it('should accept value of type `Float32Array`', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                shader.setUniforms({
                    uModelMatrix: new Float32Array(identity),
                    uMat2Array: new Float32Array(identity),
                    uMat3Array: new Float32Array(identity)
                });
            });
            it('should throw an exception if the uniform does not exist', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                let result = false;
                try {
                    shader.setUniforms({
                        doesNotExist: identity
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if the value is undefined or null', function() {
                let shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.use();
                let result = false;
                try {
                    shader.setUniforms({
                        uModelMatrix: undefined
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    shader.setUniforms({
                        uViewMatrix: null
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

    });

}());
