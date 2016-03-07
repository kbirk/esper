(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var ShaderParser = require('./ShaderParser');
    var Async = require('../util/Async');
    var XHRLoader = require('../util/XHRLoader');
    var Stack = require('../util/Stack');
    var UNIFORM_FUNCTIONS = {
        'bool': 'uniform1i',
        'bool[]': 'uniform1iv',
        'float': 'uniform1f',
        'float[]': 'uniform1fv',
        'int': 'uniform1i',
        'int[]': 'uniform1iv',
        'uint': 'uniform1i',
        'uint[]': 'uniform1iv',
        'vec2': 'uniform2fv',
        'vec2[]': 'uniform2fv',
        'ivec2': 'uniform2iv',
        'ivec2[]': 'uniform2iv',
        'vec3': 'uniform3fv',
        'vec3[]': 'uniform3fv',
        'ivec3': 'uniform3iv',
        'ivec3[]': 'uniform3iv',
        'vec4': 'uniform4fv',
        'vec4[]': 'uniform4fv',
        'ivec4': 'uniform4iv',
        'ivec4[]': 'uniform4iv',
        'mat2': 'uniformMatrix2fv',
        'mat2[]': 'uniformMatrix2fv',
        'mat3': 'uniformMatrix3fv',
        'mat3[]': 'uniformMatrix3fv',
        'mat4': 'uniformMatrix4fv',
        'mat4[]': 'uniformMatrix4fv',
        'sampler2D': 'uniform1i',
        'samplerCube': 'uniform1i'
    };
    var _stack = new Stack();
    var _boundShader = null;

    /**
     * Given vertex and fragment shader source, parses the declarations and appends information pertaining to the uniforms and attribtues declared.
     * @private
     *
     * @param {Shader} shader - The shader object.
     * @param {String} vertSource - The vertex shader source.
     * @param {String} fragSource - The fragment shader source.
     *
     * @returns {Object} The attribute and uniform information.
     */
    function setAttributesAndUniforms( shader, vertSource, fragSource ) {
        var declarations = ShaderParser.parseDeclarations(
            [ vertSource, fragSource ],
            [ 'uniform', 'attribute' ]
        );
        var attrCount = 0;
        // for each declaration in the shader
        declarations.forEach( function( declaration ) {
            // check if its an attribute or uniform
            if ( declaration.qualifier === 'attribute' ) {
                // if attribute, store type and index
                shader.attributes[ declaration.name ] = {
                    type: declaration.type,
                    index: attrCount++
                };
            } else if ( declaration.qualifier === 'uniform' ) {
                // if uniform, store type and buffer function name
                shader.uniforms[ declaration.name ] = {
                    type: declaration.type,
                    func: UNIFORM_FUNCTIONS[ declaration.type + (declaration.count > 1 ? '[]' : '') ]
                };
            }
        });
    }

    /**
     * Given a shader source string and shader type, compiles the shader and returns the resulting WebGLShader object.
     * @private
     *
     * @param {WebGLRenderingContext} gl - The webgl rendering context.
     * @param {String} shaderSource - The shader source.
     * @param {String} type - The shader type.
     *
     * @returns {WebGLShader} The compiled shader object.
     */
    function compileShader( gl, shaderSource, type ) {
        var shader = gl.createShader( gl[ type ] );
        gl.shaderSource( shader, shaderSource );
        gl.compileShader( shader );
        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            console.error( 'An error occurred compiling the shaders:', gl.getShaderInfoLog( shader ) );
            return null;
        }
        return shader;
    }

    /**
     * Binds the attribute locations for the Shader object.
     * @private
     *
     * @param {Shader} shader - The Shader object.
     */
    function bindAttributeLocations( shader ) {
        var gl = shader.gl;
        var attributes = shader.attributes;
        Object.keys( attributes ).forEach( function( key ) {
            // bind the attribute location
            gl.bindAttribLocation(
                shader.program,
                attributes[ key ].index,
                key );
        });
    }

    /**
     * Queries the webgl rendering context for the uniform locations.
     * @private
     *
     * @param {Shader} shader - The Shader object.
     */
    function getUniformLocations( shader ) {
        var gl = shader.gl;
        var uniforms = shader.uniforms;
        Object.keys( uniforms ).forEach( function( key ) {
            // get the uniform location
            uniforms[ key ].location = gl.getUniformLocation( shader.program, key );
        });
    }

    /**
     * Returns a function to load shader source from a url.
     * @private
     *
     * @param {String} url - The url to load the resource from.
     *
     * @returns {Function} The function to load the shader source.
     */
    function loadShaderSource( url ) {
        return function( done ) {
            XHRLoader.load({
                url: url,
                responseType: 'text',
                success: function( res ) {
                    console.log();
                    done( null, res );
                },
                error: function( err ) {
                    done( err, null );
                }
            });
        };
    }

    /**
     * Returns a function to pass through the shader source.
     * @private
     *
     * @param {String} source - The source of the shader.
     *
     * @returns {Function} The function to pass through the shader source.
     */
    function passThroughSource( source ) {
        return function( done ) {
            done( null, source );
        };
    }

    /**
     * Returns a function that takes an array of GLSL source strings and URLs, and resolves them into and array of GLSL source.
     * @private
     *
     * @param {Array} sources - The shader sources.
     *
     * @returns - A function to resolve the shader sources.
     */
    function resolveSources( sources ) {
        return function( done ) {
            var jobs = [];
            sources = sources || [];
            sources = ( !( sources instanceof Array ) ) ? [ sources ] : sources;
            sources.forEach( function( source ) {
                if ( ShaderParser.isGLSL( source ) ) {
                    jobs.push( passThroughSource( source ) );
                } else {
                    jobs.push( loadShaderSource( source ) );
                }
            });
            Async.parallel( jobs, done );
        };
    }

    /**
     * Binds the shader object, caching it to prevent unnecessary rebinds.
     * @private
     *
     * @param {Shader} shader - The Shader object to bind.
     */
    function bind( shader ) {
        // if this shader is already bound, exit early
        if ( _boundShader === shader ) {
            return;
        }
        shader.gl.useProgram( shader.program );
        _boundShader = shader;
    }

    /**
     * Unbinds the shader object. Prevents unnecessary unbinding.
     * @private
     *
     * @param {Shader} shader - The Shader object to unbind.
     */
    function unbind( shader ) {
        // if there is no shader bound, exit early
        if ( _boundShader === null ) {
            return;
        }
        shader.gl.useProgram( null );
        _boundShader = null;
    }

    /**
     * Clears the shader attributes due to aborting of initialization.
     * @private
     *
     * @param {Shader} shader - The Shader object.
     */
    function abortShader( shader ) {
        shader.program = null;
        shader.attributes = null;
        shader.uniforms = null;
        return shader;
    }

    /**
     * Instantiates a Shader object.
     * @class Shader
     * @classdesc A shader class to assist in compiling and linking webgl
     * shaders, storing attribute and uniform locations, and buffering uniforms.
     *
     * @param {Object} spec - The shader specification object.
     * @param {String|String[]|Object} spec.common - Sources / URLs to be shared by both vvertex and fragment shaders.
     * @param {String|String[]|Object} spec.vert - The vertex shader sources / URLs.
     * @param {String|String[]|Object} spec.frag - The fragment shader sources / URLs.
     * @param {Function} callback - The callback function to execute once the shader
     *     has been successfully compiled and linked.
     */
    function Shader( spec, callback ) {
        var that = this;
        spec = spec || {};
        this.program = 0;
        this.gl = WebGLContext.get();
        this.version = spec.version || '1.00';
        this.attributes = {};
        this.uniforms = {};
        this.hasLoggedError = false;
        // check source arguments
        if ( !spec.vert ) {
            console.error( 'Vertex shader argument has not been provided, shader initialization aborted.' );
            return;
        }
        if ( !spec.frag ) {
            console.error( 'Fragment shader argument has not been provided, shader initialization aborted.' );
            return;
        }
        // create the shader
        Async.parallel({
            common: resolveSources( spec.common ),
            vert: resolveSources( spec.vert ),
            frag: resolveSources( spec.frag ),
        }, function( err, shaders ) {
            if ( err ) {
                if ( callback ) {
                    callback( err, null );
                }
                return;
            }
            that.create( shaders );
            if ( callback ) {
                callback( null, that );
            }
        });
    }

    /**
     * Creates the shader object from source strings. This includes:
     *    1) Compiling and linking the shader program.
     *    2) Parsing shader source for attribute and uniform information.
     *    3) Binding attribute locations, by order of delcaration.
     *    4) Querying and storing uniform location.
     * @memberof Shader
     *
     * @param {Object} shaders - A map containing sources under 'vert' and
     *     'frag' attributes.
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.create = function( shaders ) {
        // once all shader sources are loaded
        var gl = this.gl;
        var common = shaders.common.join( '' );
        var vert = shaders.vert.join( '' );
        var frag = shaders.frag.join( '' );
        // compile shaders
        var vertexShader = compileShader( gl, common + vert, 'VERTEX_SHADER' );
        var fragmentShader = compileShader( gl, common + frag, 'FRAGMENT_SHADER' );
        if ( !vertexShader || !fragmentShader ) {
            console.error( 'Aborting instantiation of shader due to compilation errors.' );
            return abortShader( this );
        }
        // parse source for attribute and uniforms
        setAttributesAndUniforms( this, vert, frag );
        // create the shader program
        this.program = gl.createProgram();
        // attach vertex and fragment shaders
        gl.attachShader( this.program, vertexShader );
        gl.attachShader( this.program, fragmentShader );
        // bind vertex attribute locations BEFORE linking
        bindAttributeLocations( this );
        // link shader
        gl.linkProgram( this.program );
        // If creating the shader program failed, alert
        if ( !gl.getProgramParameter( this.program, gl.LINK_STATUS ) ) {
            console.error( 'An error occured linking the shader:', gl.getProgramInfoLog( this.program ) );
            console.error( 'Aborting instantiation of shader due to linking errors.' );
            return abortShader( this );
        }
        // get shader uniform locations
        getUniformLocations( this );
        return this;
    };

    /**
     * Binds the shader object and pushes it to the front of the stack.
     * @memberof Shader
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.push = function() {
        _stack.push( this );
        bind( this );
        return this;
    };

    /**
     * Unbinds the shader object and binds the shader beneath it on this stack. If there is no underlying shader, bind the backbuffer.
     * @memberof Shader
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.pop = function() {
        var top;
        _stack.pop();
        top = _stack.top();
        if ( top ) {
            bind( top );
        } else {
            unbind( this );
        }
        return this;
    };

    /**
     * Buffer a uniform value by name.
     * @memberof Shader
     *
     * @param {String} name - The uniform name in the shader source.
     * @param {*} value - The uniform value to buffer.
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.setUniform = function( name, value ) {
        // ensure shader program exists
        if ( !this.program ) {
            if ( !this.hasLoggedError ) {
                console.warn( 'Attempting to use an incomplete shader, command ignored.' );
                this.hasLoggedError = true;
            }
            return;
        }
        // ensure shader is bound
        if ( this !== _boundShader ) {
            console.warn( 'Attempting to set uniform `' + name + '` for an unbound shader, command ignored.' );
            return this;
        }
        var uniform = this.uniforms[ name ];
        // ensure that the uniform spec exists for the name
        if ( !uniform ) {
            console.warn( 'No uniform found under name `' + name + '`, command ignored.' );
            return this;
        }
        // ensure that the uniform argument is defined
        if ( value === undefined ) {
            console.warn( 'Argument passed for uniform `' + name + '` is undefined, command ignored.' );
            return this;
        }
        // if toArray function is present, convert to array
        if ( value.toArray ) {
            value = value.toArray();
        }
        // convert Array to Float32Array
        if ( value instanceof Array ) {
            value = new Float32Array( value );
        }
        // convert boolean's to 0 or 1
        if ( typeof value === 'boolean' ) {
            value = value ? 1 : 0;
        }
        // pass the arguments depending on the type
        switch ( uniform.type ) {
            case 'mat2':
            case 'mat3':
            case 'mat4':
                this.gl[ uniform.func ]( uniform.location, false, value );
                break;
            default:
                this.gl[ uniform.func ]( uniform.location, value );
                break;
        }
        return this;
    };

    module.exports = Shader;

}());
