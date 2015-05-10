(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        ShaderParser = require('./ShaderParser'),
        Util = require('../util/Util'),
        XHRLoader = require('../util/XHRLoader'),
        UNIFORM_FUNCTIONS = {
            'bool': 'uniform1i',
            'float': 'uniform1f',
            'int': 'uniform1i',
            'uint': 'unfirom1i',
            'vec2': 'uniform2fv',
            'ivec2': 'uniform2iv',
            'vec3': 'uniform3fv',
            'ivec3': 'uniform3iv',
            'vec4': 'uniform4fv',
            'ivec4': 'uniform4iv',
            'mat2': 'uniformMatrix2fv',
            'mat3': 'uniformMatrix3fv',
            'mat4': 'uniformMatrix4fv',
            'sampler2D': 'uniform1i',
            'samplerCube': 'uniform1i'
        },
        _boundShader = null;

    function getAttributesAndUniformsFromSource( vertSource, fragSource ) {
        var declarations = ShaderParser.parseDeclarations(
                [ vertSource, fragSource ],
                [ 'uniform', 'attribute' ]),
            attributes = {},
            uniforms = {},
            attrCount = 0,
            declaration,
            i;
        // for each declaration in the shader
        for ( i=0; i<declarations.length; i++ ) {
            declaration = declarations[i];
            // check if its an attribute or uniform
            if ( declaration.qualifier === 'attribute' ) {
                // if attribute, store type and index
                attributes[ declaration.name ] = {
                    type: declaration.type,
                    index: attrCount++
                };
            } else if ( declaration.qualifier === 'uniform' ) {
                // if uniform, store type and buffer function name
                uniforms[ declaration.name ] = {
                    type: declaration.type,
                    func: UNIFORM_FUNCTIONS[ declaration.type ]
                };
            }
        }
        return {
            attributes: attributes,
            uniforms: uniforms
        };
    }

    function compileShader( gl, shaderSource, type ) {
        var shader = gl.createShader( type );
        gl.shaderSource( shader, shaderSource );
        gl.compileShader( shader );
        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            console.error( "An error occurred compiling the shaders: " +
                gl.getShaderInfoLog( shader ) );
            return null;
        }
        return shader;
    }

    function bindAttributeLocations( gl, shader ) {
        var attributes = shader.attributes,
            name;
        for ( name in attributes ) {
            if ( attributes.hasOwnProperty( name ) ) {
                // bind the attribute location
                gl.bindAttribLocation( shader.id, attributes[ name ].index, name );
                //console.log( 'Bound vertex attribute \'' + name + '\' to location ' + attributes[ name ].index );
            }
        }
    }

    function getUniformLocations( gl, shader ) {
        var uniforms = shader.uniforms,
            name;
        for ( name in uniforms ) {
            if ( uniforms.hasOwnProperty( name ) ) {
                // get the uniform location
                uniforms[ name ].location = gl.getUniformLocation( shader.id, name );
                //console.log( name + ", " + gl.getUniformLocation( shader.id, name ) + "," );
            }
        }
    }

    function loadShaderSource( url ) {
        return function( done ) {
            XHRLoader.load(
                url,
                {
                    responseType: "text/plain",
                    success: done
                });
        };
    }

    function Shader( spec, callback ) {
        spec = spec || {};
        this.id = 0;
        this.gl = WebGLContext.get();
        this.version = spec.version || '1.00';
        // create the shader
        if ( ShaderParser.isGLSL( spec.vert ) &&
            ShaderParser.isGLSL( spec.frag ) ) {
            // shaders as src text
            this.create( spec );
        } else {
            // shaders as urls
            var that = this;
            Util.async({
                vert: loadShaderSource( spec.vert ),
                frag: loadShaderSource( spec.frag ),
            }, function( shaders ) {
                that.create( shaders );
                callback( that );
            });
        }
    }

    Shader.prototype.create = function( shaders ) {
        // once all shader sources are loaded
        var gl = this.gl,
            vert = shaders.vert,
            frag = shaders.frag,
            fragmentShader = compileShader( gl, frag, gl.FRAGMENT_SHADER ),
            vertexShader = compileShader( gl, vert, gl.VERTEX_SHADER ),
            attributesAndUniforms;
        // parse source for attribute and uniforms
        attributesAndUniforms = getAttributesAndUniformsFromSource( vert, frag );
        // set member attributes
        this.attributes = attributesAndUniforms.attributes;
        this.uniforms = attributesAndUniforms.uniforms;
        // create the shader program
        this.id = gl.createProgram();
        // attach vertex and fragment shaders
        gl.attachShader( this.id, vertexShader );
        gl.attachShader( this.id, fragmentShader );
        // bind vertex attribute locations BEFORE linking
        bindAttributeLocations( gl, this );
        // link shader
        gl.linkProgram( this.id );
        // If creating the shader program failed, alert
        if ( !gl.getProgramParameter( this.id, gl.LINK_STATUS ) ) {
            console.error( "An error occured linking the shader: " +
                gl.getProgramInfoLog( this.id ) );
        }
        // get shader uniform locations
        getUniformLocations( gl, this );
    };

    Shader.prototype.bind = function() {
        // if this shader is already bound, exit early
        if ( _boundShader === this ) {
            return;
        }
        this.gl.useProgram( this.id );
        _boundShader = this;
    };

    Shader.prototype.unbind = function() {
        // if there is no shader bound, exit early
        if ( _boundShader === null ) {
            return;
        }
        this.gl.useProgram( null );
        _boundShader = null;
    };

    Shader.prototype.setUniform = function( uniformName, uniform ) {
        var uniformSpec = this.uniforms[ uniformName ],
            func,
            type,
            location,
            value;
        // ensure that the uniform spec exists for the name
        if ( !uniformSpec ) {
            console.error( 'No uniform found under name"' + uniformName +
                '", command ignored' );
            return;
        }
        // ensure that the uniform argument is defined
        if ( uniform === undefined ) {
            console.error( 'Argument passed for uniform "' + uniformName +
                '" is undefined, command ignored' );
            return;
        }
        // get the uniform location, type, and buffer function
        func = uniformSpec.func;
        type = uniformSpec.type;
        location = uniformSpec.location;
        value = uniform.toArray ? uniform.toArray() : uniform;
        value = ( value instanceof Array ) ? new Float32Array( value ) : value;
        // convert boolean's to 0 or 1
        value = ( typeof value === "boolean" ) ? ( value ? 1 : 0 ) : value;
        // pass the arguments depending on the type
        switch ( type ) {
            case 'mat2':
            case 'mat3':
            case 'mat4':
                this.gl[ func ]( location, false, value );
                break;
            default:
                this.gl[ func ]( location, value );
                break;
        }
    };


    module.exports = Shader;

}());
