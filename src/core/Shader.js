(function () {

    'use strict';

    let WebGLContext = require('./WebGLContext');
    let ShaderParser = require('./ShaderParser');
    let Async = require('../util/Async');
    let XHRLoader = require('../util/XHRLoader');

    let UNIFORM_FUNCTIONS = {
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

    /**
     * Given a map of existing attributes, find the lowest index that is not
     * already used. If the attribute ordering was already provided, use that
     * instead.
     * @private
     *
     * @param {Object} attributes - The existing attributes object.
     * @param {Object} declaration - The attribute declaration object.
     *
     * @return {Number} The attribute index.
     */
    function getAttributeIndex(attributes, declaration) {
        // check if attribute is already declared, if so, use that index
        if (attributes[declaration.name]) {
            return attributes[declaration.name].index;
        }
        // return next available index
        return Object.keys(attributes).length;
    }

    /**
     * Given vertex and fragment shader source, parses the declarations and appends information pertaining to the uniforms and attribtues declared.
     * @private
     *
     * @param {Shader} shader - The shader object.
     * @param {String} vertSource - The vertex shader source.
     * @param {String} fragSource - The fragment shader source.
     *
     * @return {Object} The attribute and uniform information.
     */
    function setAttributesAndUniforms(shader, vertSource, fragSource) {
        let declarations = ShaderParser.parseDeclarations(
            [vertSource, fragSource],
            ['uniform', 'attribute']);
        // for each declaration in the shader
        declarations.forEach(declaration => {
            // check if its an attribute or uniform
            if (declaration.qualifier === 'attribute') {
                // if attribute, store type and index
                let index = getAttributeIndex(shader.attributes, declaration);
                shader.attributes[declaration.name] = {
                    type: declaration.type,
                    index: index
                };
            } else if (declaration.qualifier === 'uniform') {
                // if uniform, store type and buffer function name
                shader.uniforms[declaration.name] = {
                    type: declaration.type,
                    func: UNIFORM_FUNCTIONS[declaration.type + (declaration.count > 1 ? '[]' : '')]
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
     * @return {WebGLShader} The compiled shader object.
     */
    function compileShader(gl, shaderSource, type) {
        let shader = gl.createShader(gl[type]);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw 'An error occurred compiling the shaders:\n' + gl.getShaderInfoLog(shader);
        }
        return shader;
    }

    /**
     * Binds the attribute locations for the Shader object.
     * @private
     *
     * @param {Shader} shader - The Shader object.
     */
    function bindAttributeLocations(shader) {
        let gl = shader.gl;
        let attributes = shader.attributes;
        Object.keys(attributes).forEach(key => {
            // bind the attribute location
            gl.bindAttribLocation(
                shader.program,
                attributes[key].index,
                key);
        });
    }

    /**
     * Queries the webgl rendering context for the uniform locations.
     * @private
     *
     * @param {Shader} shader - The Shader object.
     */
    function getUniformLocations(shader) {
        let gl = shader.gl;
        let uniforms = shader.uniforms;
        Object.keys(uniforms).forEach(key => {
            // get the uniform location
            uniforms[key].location = gl.getUniformLocation(shader.program, key);
        });
    }

    /**
     * Returns a function to load shader source from a url.
     * @private
     *
     * @param {String} url - The url to load the resource from.
     *
     * @return {Function} The function to load the shader source.
     */
    function loadShaderSource(url) {
        return function(done) {
            XHRLoader.load({
                url: url,
                responseType: 'text',
                success: function(res) {
                    done(null, res);
                },
                error: function(err) {
                    done(err, null);
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
     * @return {Function} The function to pass through the shader source.
     */
    function passThroughSource(source) {
        return function(done) {
            done(null, source);
        };
    }

    /**
     * Returns a function that takes an array of GLSL source strings and URLs, and resolves them into and array of GLSL source.
     * @private
     *
     * @param {Array} sources - The shader sources.
     *
     * @return {Function} A function to resolve the shader sources.
     */
    function resolveSources(sources) {
        return function(done) {
            let tasks = [];
            sources = sources || [];
            sources = !Array.isArray(sources) ? [sources] : sources;
            sources.forEach(source => {
                if (ShaderParser.isGLSL(source)) {
                    tasks.push(passThroughSource(source));
                } else {
                    tasks.push(loadShaderSource(source));
                }
            });
            Async.parallel(tasks, done);
        };
    }

    /**
     * Creates the shader program object from source strings. This includes:
     *    1) Compiling and linking the shader program.
     *    2) Parsing shader source for attribute and uniform information.
     *    3) Binding attribute locations, by order of delcaration.
     *    4) Querying and storing uniform location.
     * @private
     *
     * @param {Shader} shader - The Shader object.
     * @param {Object} sources - A map containing sources under 'vert' and 'frag' attributes.
     *
     * @return {Shader} The shader object, for chaining.
     */
    function createProgram(shader, sources) {
        let gl = shader.gl;
        let common = sources.common.join('');
        let vert = sources.vert.join('');
        let frag = sources.frag.join('');
        // compile shaders
        let vertexShader = compileShader(gl, common + vert, 'VERTEX_SHADER');
        let fragmentShader = compileShader(gl, common + frag, 'FRAGMENT_SHADER');
        // parse source for attribute and uniforms
        setAttributesAndUniforms(shader, vert, frag);
        // create the shader program
        shader.program = gl.createProgram();
        // attach vertex and fragment shaders
        gl.attachShader(shader.program, vertexShader);
        gl.attachShader(shader.program, fragmentShader);
        // bind vertex attribute locations BEFORE linking
        bindAttributeLocations(shader);
        // link shader
        gl.linkProgram(shader.program);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shader.program, gl.LINK_STATUS)) {
            throw 'An error occured linking the shader:\n' + gl.getProgramInfoLog(shader.program);
        }
        // get shader uniform locations
        getUniformLocations(shader);
    }

    /**
     * @class Shader
     * @classdesc A shader class to assist in compiling and linking webgl shaders, storing attribute and uniform locations, and buffering uniforms.
     */
    class Shader {

        /**
         * Instantiates a Shader object.
         *
         * @param {Object} spec - The shader specification object.
         * @param {String|String[]|Object} spec.common - Sources / URLs to be shared by both vertex and fragment shaders.
         * @param {String|String[]|Object} spec.vert - The vertex shader sources / URLs.
         * @param {String|String[]|Object} spec.frag - The fragment shader sources / URLs.
         * @param {String[]} spec.attributes - The attribute index orderings.
         * @param {Function} callback - The callback function to execute once the shader has been successfully compiled and linked.
         */
        constructor(spec = {}, callback = null) {
            // check source arguments
            if (!spec.vert) {
                throw 'Vertex shader argument `vert` has not been provided';
            }
            if (!spec.frag) {
                throw 'Fragment shader argument `frag` has not been provided';
            }
            this.program = 0;
            this.gl = WebGLContext.get();
            this.version = spec.version || '1.00';
            this.attributes = {};
            this.uniforms = {};
            // if attribute ordering is provided, use those indices
            if (spec.attributes) {
                spec.attributes.forEach((attr, index) => {
                    this.attributes[attr] = {
                        index: index
                    };
                });
            }
            // create the shader
            Async.parallel({
                common: resolveSources(spec.common),
                vert: resolveSources(spec.vert),
                frag: resolveSources(spec.frag),
            }, (err, sources) => {
                if (err) {
                    if (callback) {
                        setTimeout(() => {
                            callback(err, null);
                        });
                    }
                    return;
                }
                // once all shader sources are loaded
                createProgram(this, sources);
                if (callback) {
                    setTimeout(() => {
                        callback(null, this);
                    });
                }
            });
        }

        /**
         * Binds the shader program for use.
         *
         * @return {Shader} The shader object, for chaining.
         */
        use() {
            // use the shader
            this.gl.useProgram(this.program);
            return this;
        }

        /**
         * Buffer a uniform value by name.
         *
         * @param {String} name - The uniform name in the shader source.
         * @param {*} value - The uniform value to buffer.
         *
         * @return {Shader} - The shader object, for chaining.
         */
        setUniform(name, value) {
            let uniform = this.uniforms[name];
            // ensure that the uniform spec exists for the name
            if (!uniform) {
                throw `No uniform found under name \`${name}\``;
            }
            // check value
            if (value === undefined || value === null) {
                // ensure that the uniform argument is defined
                throw `Value passed for uniform \`${name}\` is undefined or null`;
            } else if (typeof value === 'boolean') {
                // convert boolean's to 0 or 1
                // TODO: is this necessary?
                value = value ? 1 : 0;
            }
            // pass the arguments depending on the type
            // TODO: remove string comparions from here...
            if (uniform.type === 'mat2' || uniform.type === 'mat3' || uniform.type === 'mat4') {
                this.gl[uniform.func](uniform.location, false, value);
            } else {
                this.gl[uniform.func](uniform.location, value);
            }
            return this;
        }

        /**
         * Buffer a map of uniform values.
         *
         * @param {Object} uniforms - The map of uniforms keyed by name.
         *
         * @return {Shader} The shader object, for chaining.
         */
        setUniforms(args) {
            Object.keys(args).forEach(name => {
                this.setUniform(name, args[name]);
            });
            return this;
        }
    }

    module.exports = Shader;

}());
