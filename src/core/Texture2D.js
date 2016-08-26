(function () {

    'use strict';

    let WebGLContext = require('./WebGLContext');
    let WebGLContextState = require('./WebGLContextState');
    let Util = require('../util/Util');
    let MAG_FILTERS = {
        NEAREST: true,
        LINEAR: true
    };
    let MIN_FILTERS = {
        NEAREST: true,
        LINEAR: true,
        NEAREST_MIPMAP_NEAREST: true,
        LINEAR_MIPMAP_NEAREST: true,
        NEAREST_MIPMAP_LINEAR: true,
        LINEAR_MIPMAP_LINEAR: true
    };
    let NON_MIPMAP_MIN_FILTERS = {
        NEAREST: true,
        LINEAR: true,
    };
    let MIPMAP_MIN_FILTERS = {
        NEAREST_MIPMAP_NEAREST: true,
        LINEAR_MIPMAP_NEAREST: true,
        NEAREST_MIPMAP_LINEAR: true,
        LINEAR_MIPMAP_LINEAR: true
    };
    let WRAP_MODES = {
        REPEAT: true,
        MIRRORED_REPEAT: true,
        CLAMP_TO_EDGE: true
    };
    let DEPTH_TYPES = {
        DEPTH_COMPONENT: true,
        DEPTH_STENCIL: true
    };

    /**
     * The default type for textures.
     */
    let DEFAULT_TYPE = 'UNSIGNED_BYTE';

    /**
     * The default format for textures.
     */
    let DEFAULT_FORMAT = 'RGBA';

    /**
     * The default wrap mode for textures.
     */
    let DEFAULT_WRAP = 'REPEAT';

    /**
     * The default min / mag filter for textures.
     */
    let DEFAULT_FILTER = 'LINEAR';

    /**
     * The default for whether alpha premultiplying is enabled.
     */
    let DEFAULT_PREMULTIPLY_ALPHA = true;

    /**
     * The default for whether mipmapping is enabled.
     */
    let DEFAULT_MIPMAP = true;

    /**
     * The default for whether invert-y is enabled.
     */
    let DEFAULT_INVERT_Y = true;

    /**
     * The default mip-mapping filter suffix.
     */
    let DEFAULT_MIPMAP_MIN_FILTER_SUFFIX = '_MIPMAP_LINEAR';

    class Texture2D {

        /**
         * Instantiates a Texture2D object.
         * @class Texture2D
         * @classdesc A texture class to represent a 2D texture.
         *
         * @param {Uint8Array|Uint16Array|Uint32Array|Float32Array|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.src - The data to buffer.
         * @param {number} spec.width - The width of the texture.
         * @param {number} spec.height - The height of the texture.
         * @param {String} spec.wrap - The wrapping type over both S and T dimension.
         * @param {String} spec.wrapS - The wrapping type over the S dimension.
         * @param {String} spec.wrapT - The wrapping type over the T dimension.
         * @param {String} spec.filter - The min / mag filter used during scaling.
         * @param {String} spec.minFilter - The minification filter used during scaling.
         * @param {String} spec.magFilter - The magnification filter used during scaling.
         * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
         * @param {bool} spec.invertY - Whether or not invert-y is enabled.
         * @param {bool} spec.preMultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         */
        constructor( spec = {} ) {
            // get specific params
            spec.wrapS = spec.wrapS || spec.wrap;
            spec.wrapT = spec.wrapT || spec.wrap;
            spec.minFilter = spec.minFilter || spec.filter;
            spec.magFilter = spec.magFilter || spec.filter;
            // empty texture
            this.texture = null;
            // set texture params
            this.wrapS = spec.wrapS || DEFAULT_WRAP;
            this.wrapT = spec.wrapT || DEFAULT_WRAP;
            this.minFilter = spec.minFilter || DEFAULT_FILTER;
            this.magFilter = spec.magFilter || DEFAULT_FILTER;
            // set other properties
            this.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
            this.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
            this.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
            // set format
            this.format = spec.format || DEFAULT_FORMAT;
            if ( DEPTH_TYPES[ this.format ] && !WebGLContext.checkExtension( 'WEBGL_depth_texture' ) ) {
                throw 'Cannot create Texture2D of format `' + this.format + '` as `WEBGL_depth_texture` extension is unsupported';
            }
            // set type
            this.type = spec.type || DEFAULT_TYPE;
            if ( this.type === 'FLOAT' && !WebGLContext.checkExtension( 'OES_texture_float' ) ) {
                throw 'Cannot create Texture2D of type `FLOAT` as `OES_texture_float` extension is unsupported';
            }
            // check size
            if ( !Util.isCanvasType( spec.src ) ) {
                // if not a canvas type, dimensions MUST be specified
                if ( typeof spec.width !== 'number' || spec.width <= 0 ) {
                    throw '`width` argument is missing or invalid';
                }
                if ( typeof spec.height !== 'number' || spec.height <= 0 ) {
                    throw '`height` argument is missing or invalid';
                }
                if ( Util.mustBePowerOfTwo( this ) ) {
                    if ( !Util.isPowerOfTwo( spec.width ) ) {
                        throw 'Parameters require a power-of-two texture, yet provided width of ' + spec.width + ' is not a power of two';
                    }
                    if ( !Util.isPowerOfTwo( spec.height ) ) {
                        throw 'Parameters require a power-of-two texture, yet provided height of ' + spec.height + ' is not a power of two';
                    }
                }
            }
            let gl = this.gl = WebGLContext.get();
            this.state = WebGLContextState.get( gl );
            // buffer the data
            this.bufferData( spec.src || null, spec.width, spec.height );
            this.setParameters( this );
        }

        /**
         * Binds the texture object and pushes it onto the stack.
         * @memberof Texture2D
         *
         * @param {number} location - The texture unit location index. Default to 0.
         *
         * @returns {Texture2D} The texture object, for chaining.
         */
        push( location = 0 ) {
            if ( !Number.isInteger( location ) || location < 0 ) {
                throw 'Texture unit location is invalid';
            }
            // if this texture is already bound, no need to rebind
            if ( this.state.texture2Ds.top( location ) !== this ) {
                let gl = this.gl;
                gl.activeTexture( gl[ 'TEXTURE' + location ] );
                gl.bindTexture( gl.TEXTURE_2D, this.texture );
            }
            // add to stack under the texture unit
            this.state.texture2Ds.push( location, this );
            return this;
        }

        /**
         * Unbinds the texture object and binds the texture beneath it on this stack. If there is no underlying texture, unbinds the unit.
         * @memberof Texture2D
         *
         * @param {number} location - The texture unit location index. Default to 0.
         *
         * @returns {Texture2D} The texture object, for chaining.
         */
        pop( location = 0 ) {
            if ( !Number.isInteger( location ) || location < 0 ) {
                throw 'Texture unit location is invalid';
            }
            let state = this.state;
            if ( state.texture2Ds.top( location ) !== this ) {
                throw 'Texture2D is not the top most element on the stack';
            }
            state.texture2Ds.pop( location );
            let gl;
            let top = state.texture2Ds.top( location );
            if ( top ) {
                if ( top !== this ) {
                    // bind underlying texture
                    gl = top.gl;
                    gl.activeTexture( gl[ 'TEXTURE' + location ] );
                    gl.bindTexture( gl.TEXTURE_2D, top.texture );
                }
            } else {
                // unbind
                gl = this.gl;
                gl.bindTexture( gl.TEXTURE_2D, null );
            }
        }

        /**
         * Buffer data into the texture.
         * @memberof Texture2D
         *
         * @param {Array|ArrayBufferView|null} data - The data array to buffer.
         * @param {number} width - The width of the data.
         * @param {number} height - The height of the data.
         *
         * @returns {Texture2D} The texture object, for chaining.
         */
        bufferData( data, width, height ) {
            let gl = this.gl;
            // create texture object if it doesn't already exist
            if ( !this.texture ) {
                this.texture = gl.createTexture();
            }
            // push onto stack
            this.push();
            // invert y if specified
            gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, this.invertY );
            // premultiply alpha if specified
            gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.preMultiplyAlpha );
            // cast array arg
            if ( data instanceof Array ) {
                if ( this.type === 'UNSIGNED_SHORT' ) {
                    data = new Uint16Array( data );
                } else if ( this.type === 'UNSIGNED_INT' ) {
                    data = new Uint32Array( data );
                } else if ( this.type === 'FLOAT' ) {
                    data = new Float32Array( data );
                } else {
                    data = new Uint8Array( data );
                }
            }
            // set ensure type corresponds to data
            if ( data instanceof Uint8Array ) {
                this.type = 'UNSIGNED_BYTE';
            } else if ( data instanceof Uint16Array ) {
                this.type = 'UNSIGNED_SHORT';
            } else if ( data instanceof Uint32Array ) {
                this.type = 'UNSIGNED_INT';
            } else if ( data instanceof Float32Array ) {
                this.type = 'FLOAT';
            } else if ( data && !( data instanceof ArrayBuffer ) && !Util.isCanvasType( data ) ) {
                throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, `ImageData`, `HTMLImageElement`, `HTMLCanvasElement`, `HTMLVideoElement`, or null';
            }
            if ( Util.isCanvasType( data ) ) {
                // store width and height
                this.width = data.width;
                this.height = data.height;
                // buffer the texture
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0, // mip-map level,
                    gl[ this.format ], // webgl requires format === internalFormat
                    gl[ this.format ],
                    gl[ this.type ],
                    data );
            } else {
                // store width and height
                this.width = width || this.width;
                this.height = height || this.height;
                // buffer the texture data
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0, // mip-map level
                    gl[ this.format ], // webgl requires format === internalFormat
                    this.width,
                    this.height,
                    0, // border, must be 0
                    gl[ this.format ],
                    gl[ this.type ],
                    data );
            }
            // generate mip maps
            if ( this.mipMap ) {
                gl.generateMipmap( gl.TEXTURE_2D );
            }
            // pop off the stack
            this.pop();
            return this;
        }

        /**
         * Set the texture parameters.
         * @memberof Texture2D
         *
         * @param {Object} params - The parameters by name.
         * @param {String} params.wrap - The wrapping type over both S and T dimension.
         * @param {String} params.wrapS - The wrapping type over the S dimension.
         * @param {String} params.wrapT - The wrapping type over the T dimension.
         * @param {String} params.filter - The min / mag filter used during scaling.
         * @param {String} params.minFilter - The minification filter used during scaling.
         * @param {String} params.magFilter - The magnification filter used during scaling.
         *
         * @returns {Texture2D} The texture object, for chaining.
         */
        setParameters( params ) {
            let gl = this.gl;
            this.push();
            // set wrap S parameter
            let param = params.wrapS || params.wrap;
            if ( param ) {
                if ( WRAP_MODES[ param ] ) {
                    this.wrapS = param;
                    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[ this.wrapS ] );
                } else {
                    throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`';
                }
            }
            // set wrap T parameter
            param = params.wrapT || params.wrap;
            if ( param ) {
                if ( WRAP_MODES[ param ] ) {
                    this.wrapT = param;
                    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[ this.wrapT ] );
                } else {
                    throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`';
                }
            }
            // set mag filter parameter
            param = params.magFilter || params.filter;
            if ( param ) {
                if ( MAG_FILTERS[ param ] ) {
                    this.magFilter = param;
                    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[ this.magFilter ] );
                } else {
                    throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MAG_FILTER`';
                }
            }
            // set min filter parameter
            param = params.minFilter || params.filter;
            if ( param ) {
                if ( this.mipMap ) {
                    if ( NON_MIPMAP_MIN_FILTERS[ param ] ) {
                        // upgrade to mip-map min filter
                        param += DEFAULT_MIPMAP_MIN_FILTER_SUFFIX;
                    }
                    if ( MIPMAP_MIN_FILTERS[ param ] ) {
                        this.minFilter = param;
                        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[ this.minFilter ] );
                    } else  {
                        throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                    }
                } else {
                    if ( MIN_FILTERS[ param ] ) {
                        this.minFilter = param;
                        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[ this.minFilter ] );
                    } else {
                        throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                    }
                }
            }
            this.pop();
            return this;
        }

        /**
         * Resize the underlying texture. This clears the texture data.
         * @memberof Texture2D
         *
         * @param {number} width - The new width of the texture.
         * @param {number} height - The new height of the texture.
         *
         * @returns {Texture2D} The texture object, for chaining.
         */
        resize( width, height ) {
            if ( typeof width !== 'number' || ( width <= 0 ) ) {
                throw 'Provided `width` of ' + width + ' is invalid';
            }
            if ( typeof height !== 'number' || ( height <= 0 ) ) {
                throw 'Provided `height` of ' + height + ' is invalid';
            }
            this.bufferData( null, width, height );
            return this;
        }
    }

    module.exports = Texture2D;

}());
