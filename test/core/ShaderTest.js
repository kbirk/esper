(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var Shader = require('../../src/core/Shader');
    var XHRLoader = require('../../src/util/XHRLoader');
    require('webgl-mock');
    var canvas;
    var gl;
    var _warn;
    var _error;
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

        // beforeEach( function() {
        //     _warn = console.warn;
        //     _error = console.error;
        //     console.warn = function() {};
        //     console.error = function() {};
        // });
        //
        // afterEach( function() {
        //     console.warn = _warn;
        //     console.error = _error;
        // });

        describe('#constructor()', function() {
            it('should throw an exception if there is no `vert` argument', function() {
                try {
                    new Shader({
                        frag: frag
                    });
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
            });
            it('should throw an exception if there is no `frag` argument', function() {
                try {
                    new Shader({
                        vert: vert
                    });
                    assert( false );
                } catch( err ) {
                    assert( true );
                }
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
            it('should accept an `attributes` array argument to override attribute indices', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag,
                    attributes: [
                        'aTextureCoord',
                        'aVertexNormal',
                        'aVertexPosition'
                    ]
                });
                assert( shader.attributes.aTextureCoord.index === 0 );
                assert( shader.attributes.aVertexNormal.index === 1 );
                assert( shader.attributes.aVertexPosition.index === 2 );
                assert( shader );
            });
        });

        describe('#push()', function() {
            it('should push the shader onto the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.pop();
            });
        });

        describe('#pop()', function() {
            it('should pop the shader off the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                shader.pop();
            });
            it('should no nothing if this shader is not the top of the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.pop();
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
                shader.pop();
            });
            it('should accept value of of object with `toArray` method', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                var val = {
                    toArray: function() {
                        return identity;
                    }
                };
                shader.push();
                shader.setUniform( 'uModelMatrix', val );
                shader.pop();
            });
            it('should throw an exception if the shader is not the top of the stack', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                try {
                    shader.setUniform( 'uModelMatrix', identity );
                    assert( false );
                } catch ( err ) {
                    assert( true );
                }
            });
            it('should throw an exception if the uniform does not exist', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                try {
                    shader.setUniform('doesNotExist', identity );
                    assert( false );
                } catch ( err ) {
                    assert( true );
                }
                shader.pop();
            });
            it('should throw an exception if the no value is provided', function() {
                var shader = new Shader({
                    vert: vert,
                    frag: frag
                });
                shader.push();
                try {
                    shader.setUniform('uModelMatrix' );
                    assert( false );
                } catch ( err ) {
                    assert( true );
                }
                shader.pop();
            });
        });

    });

}());
