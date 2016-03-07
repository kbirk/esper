(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var Stack = require('../util/Stack');
    var MAG_FILTERS = {
        NEAREST: true,
        LINEAR: true
    };
    var MIN_FILTERS = {
        NEAREST: true,
        LINEAR: true,
        NEAREST_MIPMAP_NEAREST: true,
        LINEAR_MIPMAP_NEAREST: true,
        NEAREST_MIPMAP_LINEAR: true,
        LINEAR_MIPMAP_LINEAR: true
    };
    var NON_MIPMAP_MIN_FILTERS = {
        NEAREST: true,
        LINEAR: true,
    };
    var MIPMAP_MIN_FILTERS = {
        NEAREST_MIPMAP_NEAREST: true,
        LINEAR_MIPMAP_NEAREST: true,
        NEAREST_MIPMAP_LINEAR: true,
        LINEAR_MIPMAP_LINEAR: true
    };
    var WRAP_MODES = {
        REPEAT: true,
        MIRRORED_REPEAT: true,
        CLAMP_TO_EDGE: true
    };
    var _stack = {};
    var _boundTexture = null;

    /**
     * The default type for textures.
     */
    var DEFAULT_TYPE = 'UNSIGNED_BYTE';

    /**
     * The default format for textures.
     */
    var DEFAULT_FORMAT = 'RGBA';

    /**
     * The default wrap mode for textures.
     */
    var DEFAULT_WRAP = 'REPEAT';

    /**
     * The default min / mag filter for textures.
     */
    var DEFAULT_FILTER = 'LINEAR';

    /**
     * The default for whether alpha premultiplying is enabled.
     */
    var DEFAULT_PREMULTIPLY_ALPHA = true;

    /**
     * The default for whether mipmapping is enabled.
     */
    var DEFAULT_MIPMAP = true;

    /**
     * The default for whether invert-y is enabled.
     */
    var DEFAULT_INVERT_Y = true;

    /**
     * The default mip-mapping filter suffix.
     */
    var DEFAULT_MIPMAP_MIN_FILTER_SUFFIX = '_MIPMAP_LINEAR';

    /**
     * Binds the texture object to a location and activates the texture unit while caching it to prevent unnecessary rebinds.
     * @private
     *
     * @param {Texture2D} texture - The Texture2D object to bind.
     * @param {number} location - The texture unit location index.
     */
    function bind( texture, location ) {
        // if this buffer is already bound, exit early
        if ( _boundTexture === texture ) {
            return;
        }
        var gl = texture.gl;
        location = gl[ 'TEXTURE' + location ] || gl.TEXTURE0;
        gl.activeTexture( location );
        gl.bindTexture( gl.TEXTURE_2D, texture.texture );
        _boundTexture = texture;
    }

    /**
     * Unbinds the texture object. Prevents unnecessary unbinding.
     * @private
     *
     * @param {Texture2D} texture - The Texture2D object to unbind.
     */
    function unbind( texture ) {
        // if no buffer is bound, exit early
        if ( _boundTexture === null ) {
            return;
        }
        var gl = texture.gl;
        gl.bindTexture( gl.TEXTURE_2D, null );
        _boundTexture = null;
    }

    /**
     * Instantiates a Texture2D object.
     * @class Texture2D
     * @classdesc A texture class to represent a 2D texture.
     *
     * @param {Uint8Array|Uint16Array|Uint32Array|Float32Array} spec.data - The data to buffer.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
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
    function Texture2D( spec ) {
        this.gl = WebGLContext.get();
        // create texture object
        this.texture = this.gl.createTexture();
        // get specific params
        spec.wrapS = spec.wrapS || spec.wrap;
        spec.wrapT = spec.wrapT || spec.wrap;
        spec.minFilter = spec.minFilter || spec.filter;
        spec.magFilter = spec.magFilter || spec.filter;
        // set texture params
        this.wrapS = spec.wrapS || DEFAULT_WRAP;
        this.wrapT = spec.wrapT || DEFAULT_WRAP;
        this.minFilter = spec.minFilter || DEFAULT_FILTER;
        this.magFilter = spec.magFilter || DEFAULT_FILTER;
        // set other properties
        this.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
        this.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
        this.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
        // set format and type
        this.format = spec.format || DEFAULT_FORMAT;
        this.type = spec.type || DEFAULT_TYPE;
        // buffer the data
        this.bufferData( spec.data || null, spec.width, spec.height );
        this.setParameters( this );
        // if callback is provided, execute it
        if ( spec.callback ) {
            spec.callback( this );
        }
    }

    /**
     * Binds the texture object and pushes it to the front of the stack.
     * @memberof Texture2D
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.push = function( location ) {
        _stack[ location ] = _stack[ location ] || new Stack();
        _stack[ location ].push( this );
        bind( this, location );
        return this;
    };

    /**
     * Unbinds the texture object and binds the texture beneath it on this stack. If there is no underlying texture, unbinds the unit.
     * @memberof Texture2D
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.pop = function( location ) {
        if ( !_stack[ location ] ) {
            console.warn( 'No texture was bound to texture unit `' + location + '`, command ignored.' );
            return this;
        }
        if ( this !== _stack[ location ].top() ) {
            console.warn( 'The current texture is not the top most element on the stack. Command ignored.' );
            return this;
        }
        _stack[ location ].pop();
        var top = _stack[ location ].top();
        if ( top ) {
            bind( top, location );
        } else {
            unbind( this );
        }
        return this;
    };

    /**
     * Buffer data into the texture.
     * @memberof Texture2D
     *
     * @param {ArrayBufferView} data - The data array to buffer.
     * @param {number} width - The width of the data.
     * @param {number} height - The height of the data.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.bufferData = function( data, width, height ) {
        var gl = this.gl;
        this.push();
        // invert y if specified
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, this.invertY );
        // premultiply alpha if specified
        gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.preMultiplyAlpha );
        // store data description
        this.data = data;
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
            this.data );
        // generate mip maps
        if ( this.mipMap ) {
            gl.generateMipmap( gl.TEXTURE_2D );
        }
        this.pop();
        return this;
    };

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
    Texture2D.prototype.setParameters = function( params ) {
        var gl = this.gl;
        this.push();
        // set wrap S parameter
        var param = params.wrapS || params.wrap;
        if ( param ) {
            if ( WRAP_MODES[ param ] ) {
                this.wrapS = param;
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[ this.wrapS ] );
            } else {
                console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`, command ignored.' );
            }
        }
        // set wrap T parameter
        param = params.wrapT || params.wrap;
        if ( param ) {
            if ( WRAP_MODES[ param ] ) {
                this.wrapT = param;
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[ this.wrapT ] );
            } else {
                console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`, command ignored.' );
            }
        }
        // set mag filter parameter
        param = params.magFilter || params.filter;
        if ( param ) {
            if ( MAG_FILTERS[ param ] ) {
                this.magFilter = param;
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[ this.magFilter ] );
            } else {
                console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MAG_FILTER`, command ignored.' );
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
                    console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`, command ignored.' );
                }
            } else {
                if ( MIN_FILTERS[ param ] ) {
                    this.minFilter = param;
                    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[ this.minFilter ] );
                } else {
                    console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`, command ignored.' );
                }
            }
        }
        this.pop();
        return this;
    };

    /**
     * Resize the texture.
     * @memberof Texture2D
     *
     * @param {number} width - The new width of the texture.
     * @param {number} height - The new height of the texture.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.resize = function( width, height ) {
        if ( !width || !height ) {
            console.warn( 'Width or height arguments missing, command ignored.' );
            return this;
        }
        this.bufferData( this.data, width, height );
        return this;
    };

    module.exports = Texture2D;

}());
