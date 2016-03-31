(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');
    var Async = require('../util/Async');
    var Util = require('../util/Util');
    var ImageLoader = require('../util/ImageLoader');
    var FACES = [
        '-x', '+x',
        '-y', '+y',
        '-z', '+z'
    ];
    var FACE_TARGETS = {
        '+z': 'TEXTURE_CUBE_MAP_POSITIVE_Z',
        '-z': 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
        '+x': 'TEXTURE_CUBE_MAP_POSITIVE_X',
        '-x': 'TEXTURE_CUBE_MAP_NEGATIVE_X',
        '+y': 'TEXTURE_CUBE_MAP_POSITIVE_Y',
        '-y': 'TEXTURE_CUBE_MAP_NEGATIVE_Y'
    };
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
    var FORMATS = {
        RGB: true,
        RGBA: true
    };

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
    var DEFAULT_WRAP = 'CLAMP_TO_EDGE';

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
     * Returns true if the texture MUST be a power-of-two. Otherwise return false.
     * @private
     *
     * @param {Object} spec - The texture specification object.
     *
     * @return {bool} - Whether or not the texture must be a power of two.
     */
    function mustBePowerOfTwo( spec ) {
        // According to:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL#Non_power-of-two_textures
        // NPOT textures cannot be used with mipmapping and they must not "repeat"
        return spec.mipMap ||
            spec.wrapS === 'REPEAT' ||
            spec.wrapS === 'MIRRORED_REPEAT' ||
            spec.wrapT === 'REPEAT' ||
            spec.wrapT === 'MIRRORED_REPEAT';
    }

    /**
     * Extracts the underlying data buffer from an image element. If texture must be a POT, resizes the texture.
     * @private
     *
     * @param {Object} spec - The texture specification object.
     * @param {Object} imgs - The map of image objects.
     */
    function getImgData( spec, imgs ) {
        var data = {};
        var width;
        var height;
        // size based on first img
        var img = imgs[ FACES[0] ];
        if ( mustBePowerOfTwo( spec ) ) {
            width = Util.nextHighestPowerOfTwo( img.width );
            height = Util.nextHighestPowerOfTwo( img.height );
        } else {
            width = img.width;
            height = img.height;
        }
        // extract / resize each face
        FACES.forEach( function( face ) {
            var img = imgs[ face ];
            // create an empty canvas element
            var canvas = document.createElement( 'canvas' );
            canvas.width = width;
            canvas.height = height;
            // copy the image contents to the canvas
            var ctx = canvas.getContext( '2d' );
            ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height );
            var imgData = ctx.getImageData( 0, 0, canvas.width, canvas.height ).data;
            // add to face
            data[ face ] = new Uint8Array( imgData );
        });
        // return results
        return {
            data: data,
            width: width,
            height: height
        };
    }

    /**
     * Loads all images from a set of urls.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map object.
     * @param {String} urls - The urls to load the images from.
     * @param {Function} callback - The callback function.
     *
     * @returns {Function} The resulting function.
     */
    function loadImages( cubeMap, urls, callback ) {
        var jobs = {};
        Object.keys( urls ).forEach( function( key ) {
            // add job to map
            jobs[ key ] = function( done ) {
                ImageLoader.load({
                    url: urls[ key ],
                    success: function( image ) {
                        done( null, image );
                    },
                    error: function( err ) {
                        done( err, null );
                    }
                });
            };
        });
        Async.parallel( jobs, callback );
    }

    /**
     * Instantiates a TextureCubeMap object.
     * @class TextureCubeMap
     * @classdesc A texture class to represent a cube map texture.
     *
     * @param {Object} spec - The specification arguments
     *
     * @param {Object} spec.images - The HTMLImageElements to buffer.
     * @param {HTMLImageElement} spec.images[+x] - The positive x image to buffer.
     * @param {HTMLImageElement} spec.images[-x] - The negative x image to buffer.
     * @param {HTMLImageElement} spec.images[+y] - The positive y image to buffer.
     * @param {HTMLImageElement} spec.images[-y] - The negative y image to buffer.
     * @param {HTMLImageElement} spec.images[+z] - The positive z image to buffer.
     * @param {HTMLImageElement} spec.images[-z] - The negative z image to buffer.
     *
     * @param {Object} spec.urls - The HTMLImageElement URLs to buffer.
     * @param {String} spec.urls[+x] - The positive x URL to buffer.
     * @param {String} spec.urls[-x] - The negative x URL to buffer.
     * @param {String} spec.urls[+y] - The positive y URL to buffer.
     * @param {String} spec.urls[-y] - The negative y URL to buffer.
     * @param {String} spec.urls[+z] - The positive z URL to buffer.
     * @param {String} spec.urls[-z] - The negative z URL to buffer.
     *
     * @param {Object} spec.data - The data to buffer.
     * @param {Uint8Array|Float32Array} spec.data[+x] - The positive x data to buffer.
     * @param {Uint8Array|Float32Array} spec.data[-x] - The negative x data to buffer.
     * @param {Uint8Array|Float32Array} spec.data[+y] - The positive y data to buffer.
     * @param {Uint8Array|Float32Array} spec.data[-y] - The negative y data to buffer.
     * @param {Uint8Array|Float32Array} spec.data[+z] - The positive z data to buffer.
     * @param {Uint8Array|Float32Array} spec.data[-z] - The negative z data to buffer.
     *
     * @param {number} width - The width of the faces.
     * @param {number} height - The height of the faces.
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
    function TextureCubeMap( spec, callback ) {
        var that = this;
        var gl = this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( gl );
        this.texture = gl.createTexture();
        // get specific params
        spec.wrapS = spec.wrapS || spec.wrap;
        spec.wrapT = spec.wrapT || spec.wrap;
        spec.minFilter = spec.minFilter || spec.filter;
        spec.magFilter = spec.magFilter || spec.filter;
        // set texture params
        this.wrapS = WRAP_MODES[ spec.wrapS ] ? spec.wrapS : DEFAULT_WRAP;
        this.wrapT = WRAP_MODES[ spec.wrapT ] ? spec.wrapT : DEFAULT_WRAP;
        this.minFilter = MIN_FILTERS[ spec.minFilter ] ? spec.minFilter : DEFAULT_FILTER;
        this.magFilter = MAG_FILTERS[ spec.magFilter ] ? spec.magFilter : DEFAULT_FILTER;
        // set other properties
        this.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
        this.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
        this.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
        // set format and type
        this.format = FORMATS[ spec.format ] ? spec.format : DEFAULT_FORMAT;
        this.type = spec.type || DEFAULT_TYPE;
        if ( this.type === 'FLOAT' && !WebGLContext.checkExtension( 'OES_texture_float' ) ) {
            throw 'Cannot create Texture2D of type `FLOAT` as `OES_texture_float` extension is unsupported';
        }
        // set dimensions
        this.width = 0;
        this.height = 0;
        // create cube map based on input
        if ( spec.images ) {
            // Images
            var res = getImgData( that, spec.images );
            that.bufferData( res.data, res.width, res.height );
            this.setParameters( this );
        } else if ( spec.urls ) {
            // urls
            loadImages( this, spec.urls, function( err, images ) {
                if ( err ) {
                    if ( callback ) {
                        callback( err, null );
                    }
                    return;
                }
                var res = getImgData( that, images );
                that.bufferData( res.data, res.width, res.height );
                that.setParameters( that );
                if ( callback ) {
                    callback( null, that );
                }
            });
        } else {
            // data or null
            if ( typeof spec.width !== 'number' || spec.width <= 0 ) {
                throw '`width` argument is missing or invalid';
            }
            if ( typeof spec.height !== 'number' || spec.height <= 0 ) {
                throw '`height` argument is missing or invalid';
            }
            that.bufferData( spec.data || null, spec.width, spec.height );
            this.setParameters( this );
        }
    }

    /**
     * Binds the texture object and pushes it to the front of the stack.
     * @memberof TextureCubeMap
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.push = function( location ) {
        if ( location === undefined ) {
            location = 0;
        } else if ( !Util.isInteger( location ) || location < 0 ) {
            throw 'Texture unit location is invalid';
        }
        // if this texture is already bound, no need to rebind
        if ( this.state.textureCubeMaps.top( location ) !== this ) {
            var gl = this.gl;
            gl.activeTexture( gl[ 'TEXTURE' + location ] );
            gl.bindTexture( gl.TEXTURE_CUBE_MAP, this.texture );
        }
        // add to stack under the texture unit
        this.state.textureCubeMaps.push( location, this );
        return this;
    };

    /**
     * Unbinds the texture object and binds the texture beneath it on
     * this stack. If there is no underlying texture, unbinds the unit.
     * @memberof TextureCubeMap
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.pop = function( location ) {
        if ( location === undefined ) {
            location = 0;
        } else if ( !Util.isInteger( location ) || location < 0 ) {
            throw 'Texture unit location is invalid';
        }
        var state = this.state;
        if ( state.textureCubeMaps.top( location ) !== this ) {
            throw 'The current texture is not the top most element on the stack';
        }
        state.textureCubeMaps.pop( location );
        var gl;
        var top = state.textureCubeMaps.top( location );
        if ( top ) {
            if ( top !== this ) {
                // bind underlying texture
                gl = top.gl;
                gl.activeTexture( gl[ 'TEXTURE' + location ] );
                gl.bindTexture( gl.TEXTURE_CUBE_MAP, top.texture );
            }
        } else {
            // unbind
            gl = this.gl;
            gl.bindTexture( gl.TEXTURE_CUBE_MAP, null );
        }
        return this;
    };

    /**
     * Buffer data into the respective cube map face.
     * @memberof TextureCubeMap
     *
     * @param {Object||null} faces - The map of face data.
     * @param {number} width - The width of the data.
     * @param {number} height - The height of the data.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.bufferData = function( faces, width, height ) {
        var gl = this.gl;
        // set width and height
        if ( width !== undefined && height !== undefined ) {
            if ( typeof width !== 'number' || width <= 0 ) {
                throw '`width` is invalid';
            }
            if ( typeof height !== 'number' || height <= 0 ) {
                throw '`height` is invalid';
            }
            if ( width !== height ) {
                throw '`width` must be equal to `height`';
            }
            // set width and height
            this.width = width;
            this.height = height;
        }
        // buffer face texture
        this.push();
        // invert y if specified
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, this.invertY );
        // premultiply alpha if specified
        gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.preMultiplyAlpha );
        // buffer each face
        var that = this;
        FACES.forEach( function( face ) {
            var target = FACE_TARGETS[ face ];
            var data = null;
            if ( faces ) {
                data = ( faces[ face ] ) ? faces[ face ] : faces;
            }
            // cast array arg
            if ( data instanceof Array ) {
                if ( that.type === 'UNSIGNED_SHORT' ) {
                    data = new Uint16Array( data );
                } else if ( that.type === 'UNSIGNED_INT' ) {
                    data = new Uint32Array( data );
                } else if ( that.type === 'FLOAT' ) {
                    data = new Float32Array( data );
                } else {
                    data = new Uint8Array( data );
                }
            }
            // set ensure type corresponds to data
            if ( data instanceof Uint8Array ) {
                that.type = 'UNSIGNED_BYTE';
            } else if ( data instanceof Uint16Array ) {
                that.type = 'UNSIGNED_SHORT';
            } else if ( data instanceof Uint32Array ) {
                that.type = 'UNSIGNED_INT';
            } else if ( data instanceof Float32Array ) {
                that.type = 'FLOAT';
            } else if ( data &&
                !( data instanceof ArrayBuffer ) ) {
                throw '`bufferData` requires a null, Array, ArrayBuffer, or ArrayBufferView argument';
            }
            // buffer the data
            gl.texImage2D(
                gl[ target ],
                0, // level
                gl[ that.format ], // webgl requires format === internalFormat
                that.width,
                that.height,
                0, // border, must be 0
                gl[ that.format ],
                gl[ that.type ],
                data );
        });
        // once all faces are buffered
        if ( this.mipMap ) {
            // only generate mipmaps if all faces are buffered
            gl.generateMipmap( gl.TEXTURE_CUBE_MAP );
        }
        this.pop();
        return this;
    };

    /**
     * Set the texture parameters.
     * @memberof TextureCubeMap
     *
     * @param {Object} params - The parameters by name.
     * @param {String} params.wrap - The wrapping type over both S and T dimension.
     * @param {String} params.wrapS - The wrapping type over the S dimension.
     * @param {String} params.wrapT - The wrapping type over the T dimension.
     * @param {String} params.filter - The min / mag filter used during scaling.
     * @param {String} params.minFilter - The minification filter used during scaling.
     * @param {String} params.magFilter - The magnification filter used during scaling.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.setParameters = function( params ) {
        var gl = this.gl;
        this.push();
        // set wrap S parameter
        var param = params.wrapS || params.wrap;
        if ( param ) {
            if ( WRAP_MODES[ param ] ) {
                this.wrapS = param;
                gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl[ this.wrapS ] );
            } else {
                throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`';
            }
        }
        // set wrap T parameter
        param = params.wrapT || params.wrap;
        if ( param ) {
            if ( WRAP_MODES[ param ] ) {
                this.wrapT = param;
                gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl[ this.wrapT ] );
            } else {
                throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`';
            }
        }
        // set mag filter parameter
        param = params.magFilter || params.filter;
        if ( param ) {
            if ( MAG_FILTERS[ param ] ) {
                this.magFilter = param;
                gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl[ this.magFilter ] );
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
                    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[ this.minFilter ] );
                } else  {
                    throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                }
            } else {
                if ( MIN_FILTERS[ param ] ) {
                    this.minFilter = param;
                    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[ this.minFilter ] );
                } else {
                    throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                }
            }
        }
        this.pop();
        return this;
    };

    module.exports = TextureCubeMap;

}());
