(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var Shader = require('../../src/core/Shader');
    var XHRLoader = require('../../src/util/XHRLoader');
    require('webgl-mock');
    var canvas;
    var gl;
    var _load;

    var vert = [
        'attribute highp vec3 aVertexPosition;',
        'attribute highp vec3 aVertexNormal;',
        'attribute highp vec2 aTextureCoord;',
        'uniform highp mat4 uViewMatrix;',
        'uniform highp mat4 uModelMatrix;',
        'uniform highp mat4 uProjectionMatrix;',
        'void main() {',
            '...',
        '}'
    ].join('\n');

    var frag = [
        'uniform highp mat4 uViewMatrix;',
        'uniform highp vec3 uLightPosition;',
        'uniform bool uUseTexture;',
        'uniform highp vec4 uDiffuseColor;',
        'uniform sampler2D uDiffuseTextureSampler;',
        'uniform highp vec4 uSpecularColor;',
        'uniform highp float uSpecularComponent;',
        'uniform highp mat2 uMat2Array[16];',
        'uniform highp mat3 uMat3Array[16];',
        'void main() {',
            '...',
        '}'
    ].join('\n');

    var urls = {
        'path/to/vert': vert,
        'path/to/frag': frag
    };

    var identity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    describe('Shader', function() {

        before( function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get( canvas );
            _load = XHRLoader.load;
            XHRLoader.load = function( opts ) {
                setTimeout( function() {
                    opts.success( urls[ opts.url ] );
                }, 100 );
            };
        });

        after( function() {
            WebGLContext.remove( canvas );
            canvas = null;
            gl = null;
            XHRLoader.load = _load;
        });

        describe('#constructor()', function() {
            it('should throw an exception if there is no `vert` argument', function() {
                var result = false;
                try {
                    new Shader();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if there is no `frag` argument', function() {
                var result = false;
                try {
                    new Shader({
                        vert: vert
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if there is a compilation error', function() {
                var getShaderParameter = gl.getShaderParameter;
                gl.getShaderParameter = function() {
                    return false;
                };
                var result = false;
                try {
                    new Shader({
                        vert: vert,
                        frag: frag
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                gl.getShaderParameter = getShaderParameter;
            });
            it('should throw an exception if there is a linking error', function() {
                var getProgramParameter = gl.getProgramParameter;
                gl.getProgramParameter = function() {
                    return false;
                };
                var result = false;
                try {
                    new Shader({
                        vert: vert,
                        frag: frag
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                gl.getProgramParameter = getProgramParameter;
            });
            it('should accept shader arguments as glsl source', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                assert( shader );
            });
            it('should accept shader arguments as URLs', function() {
                var shader = new Shader({
                    vert: 'path/to/vert',
                    frag: 'path/to/frag'
                }, function() {
                    assert( shader );
                });
            });
            it('should execute callback function passing an error as first argument if a URL results in an error', function( done ) {
                var load = XHRLoader.load;
                var err = new Error( 'error' );
                XHRLoader.load = function( opts ) {
                    setTimeout( function() {
                        opts.error( err );
                    }, 100 );
                };
                new Shader({
                    vert: 'path/to/vert',
                    frag: 'path/to/frag'
                }, function( e ) {
                    assert( e === err );
                    XHRLoader.load = load;
                    done();
                });
            });
            it('should accept an `attributes` array argument to override attribute indices', function() {
                var shader0 = new Shader({
                    vert: vert,
                    frag: frag,
                    attributes: [
                        'aTextureCoord',
                        'aVertexNormal',
                        'aVertexPosition'
                    ]
                });
                assert( shader0.attributes.aTextureCoord.index === 0 );
                assert( shader0.attributes.aVertexNormal.index === 1 );
                assert( shader0.attributes.aVertexPosition.index === 2 );
                var shader1 = new Shader({
                    vert: vert,
                    frag: frag,
                    attributes: [
                        'aTextureCoord',
                        'aVertexPosition'
                    ]
                });
                assert( shader1.attributes.aTextureCoord.index === 0 );
                assert( shader1.attributes.aVertexPosition.index === 1 );
                assert( shader1.attributes.aVertexNormal.index === 2 );
            });
        });

        describe('#push()', function() {
            it('should push the shader onto the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.push();
                shader.pop();
                shader.pop();
            });
        });

        describe('#pop()', function() {
            it('should pop the shader off the stack', function() {
                var shader0 = new Shader({
                    vert: vert,
                    frag: frag
                });
                var shader1 = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader0.push();
                shader1.push();
                shader1.pop();
                shader0.pop();
            });
            it('should throw an exception if this shader is not the top of the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                var result = false;
                try {
                    shader.pop();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#setUniform()', function() {
            it('should accept value of type `boolean`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniform( 'uUseTexture', true );
                shader.setUniform( 'uUseTexture', false );
                shader.pop();
            });
            it('should accept value of type `number`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniform( 'uSpecularComponent', 10 );
                shader.pop();
            });
            it('should accept value of type `Array`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniform( 'uModelMatrix', identity );
                shader.pop();
            });
            it('should accept value of type `Float32Array`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniform( 'uModelMatrix', new Float32Array( identity ) );
                shader.setUniform( 'uMat2Array', new Float32Array( identity ) );
                shader.setUniform( 'uMat3Array', new Float32Array( identity ) );
                shader.pop();
            });
            it('should throw an exception if the shader is not the top of the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                var result = false;
                try {
                    shader.setUniform( 'uModelMatrix', identity );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the uniform does not exist', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                var result = false;
                try {
                    shader.setUniform( 'doesNotExist', identity );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                shader.pop();
            });
            it('should throw an exception if the value is undefined or null', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                var result = false;
                try {
                    shader.setUniform( 'uModelMatrix' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    shader.setUniform( 'uModelMatrix', null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                shader.pop();
            });
        });

        describe('#setUniforms()', function() {
            it('should accept value of type `boolean`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniforms({
                    uUseTexture: true
                });
                shader.pop();
            });
            it('should accept value of type `number`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniforms({
                    uSpecularComponent: 10
                });
                shader.pop();
            });
            it('should accept value of type `Array`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniforms({
                    uModelMatrix: identity
                });
                shader.pop();
            });
            it('should accept value of type `Float32Array`', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.setUniforms({
                    uModelMatrix: new Float32Array( identity ),
                    uMat2Array: new Float32Array( identity ),
                    uMat3Array: new Float32Array( identity )
                });
                shader.pop();
            });
            it('should throw an exception if the shader is not the top of the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                var result = false;
                try {
                    shader.setUniforms({
                        uModelMatrix: identity
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the uniform does not exist', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                var result = false;
                try {
                    shader.setUniforms({
                        doesNotExist: identity
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                shader.pop();
            });
            it('should throw an exception if the value is undefined or null', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                var result = false;
                try {
                    shader.setUniforms({
                        uModelMatrix: undefined
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    shader.setUniforms({
                        uViewMatrix: null
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                shader.pop();
            });
        });

    });

}());
