(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var State = require('./State');
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
     * If the provided image dimensions are not powers of two, it will redraw
     * the image to the next highest power of two.
     * @private
     *
     * @param {HTMLImageElement} image - The image object.
     *
     * @returns {HTMLImageElement} The new image object.
     */
    function ensurePowerOfTwo( image ) {
        if ( !Util.isPowerOfTwo( image.width ) ||
            !Util.isPowerOfTwo( image.height ) ) {
            var canvas = document.createElement( 'canvas' );
            canvas.width = Util.nextHighestPowerOfTwo( image.width );
            canvas.height = Util.nextHighestPowerOfTwo( image.height );
            var ctx = canvas.getContext('2d');
            ctx.drawImage(
                image,
                0, 0,
                image.width, image.height,
                0, 0,
                canvas.width, canvas.height );
            return canvas;
        }
        return image;
    }

    /**
     * Returns a function to load and buffer a given cube map face.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map object.
     * @param {String} url - The url to load the image.
     * @param {String} face - The face identification string.
     *
     * @returns {Function} The resulting function.
     */
    function loadAndBufferImage( cubeMap, url, face ) {
        return function( done ) {
            ImageLoader.load({
                url: url,
                success: function( image ) {
                    cubeMap.bufferFaceData( face, image );
                    done( null );
                },
                error: function( err ) {
                    done( err, null );
                }
            });
        };
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
        this.gl = WebGLContext.get();
        this.texture = this.gl.createTexture();
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
        this.type = DEFAULT_TYPE;
        // create cube map based on input
        if ( spec.images ) {
            // multiple Image objects
            Object.keys( spec.images ).forEach( function( key ) {
                // buffer face texture
                that.bufferFaceData( key, spec.images[ key ] );
            });
            this.setParameters( this );
        } else if ( spec.urls ) {
            // multiple urls
            var jobs = {};
            Object.keys( spec.urls ).forEach( function( key ) {
                // add job to map
                jobs[ key ] = loadAndBufferImage( that, spec.urls[ key ], key );
            });
            Async.parallel( jobs, function( err ) {
                if ( err ) {
                    if ( callback ) {
                        callback( err, null );
                    }
                    return;
                }
                that.setParameters( that );
                if ( callback ) {
                    callback( null, that );
                }
            });
        } else {
            // arraybuffer
            FACES.forEach( function( face ) {
                var data = ( spec.data ? spec.data[face] : spec.data ) || null;
                that.bufferFaceData( face, data, spec.width, spec.height );
            });
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
        }
        // if this texture is already bound, no need to rebind
        if ( State.textureCubeMaps.top( location ) !== this ) {
            var gl = this.gl;
            gl.activeTexture( gl[ 'TEXTURE' + location ] );
            gl.bindTexture( gl.TEXTURE_CUBE_MAP, this.texture );
        }
        // add to stack under the texture unit
        State.textureCubeMaps.push( location, this );
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
        }
        if ( State.textureCubeMaps.top( location ) !== this ) {
            console.warn( 'The current texture is not the top most element on the stack. Command ignored.' );
            return this;
        }
        State.textureCubeMaps.pop( location );
        var gl;
        var top = State.textureCubeMaps.top( location );
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
     * @param {String} face - The face identification string.
     * @param {ImageData|ArrayBufferView|HTMLImageElement} data - The data.
     * @param {number} width - The width of the data.
     * @param {number} height - The height of the data.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.bufferFaceData = function( face, data, width, height ) {
        var gl = this.gl;
        var faceTarget = gl[ FACE_TARGETS[ face ] ];
        if ( !faceTarget ) {
            console.warn( 'Invalid face enumeration `' + face + '` provided, ' + 'command ignored.' );
            return this;
        }
        // buffer face texture
        this.push();
        // invert y if specified
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, this.invertY );
        // premultiply alpha if specified
        gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.preMultiplyAlpha );
        if ( data instanceof HTMLImageElement ) {
            // from image
            this.images = this.images || {};
            this.images[ face ] = ensurePowerOfTwo( data );
            gl.texImage2D(
                faceTarget,
                0, // level
                gl[ this.format ], // webgl requires format === internalFormat
                gl[ this.format ],
                gl[ this.type ],
                this.images[ face ] );
        } else {
            // from arraybuffer
            this.data = this.data || {};
            this.data[ face ] = data;
            this.width = width || this.width;
            this.height = height || this.height;
            gl.texImage2D(
                faceTarget,
                0, // level
                gl[ this.format ], // webgl requires format === internalFormat
                this.width,
                this.height,
                0, // border, must be 0
                gl[ this.format ],
                gl[ this.type ],
                data );
        }
        // only generate mipmaps if all faces are buffered
        this.bufferedFaces = this.bufferedFaces || {};
        this.bufferedFaces[ face ] = true;
        // once all faces are buffered
        if ( this.mipMap &&
            this.bufferedFaces['-x'] && this.bufferedFaces['+x'] &&
            this.bufferedFaces['-y'] && this.bufferedFaces['+y'] &&
            this.bufferedFaces['-z'] && this.bufferedFaces['+z'] ) {
            // generate mipmaps once all faces are buffered
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
                console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`, command ignored.' );
            }
        }
        // set wrap T parameter
        param = params.wrapT || params.wrap;
        if ( param ) {
            if ( WRAP_MODES[ param ] ) {
                this.wrapT = param;
                gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl[ this.wrapT ] );
            } else {
                console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`, command ignored.' );
            }
        }
        // set mag filter parameter
        param = params.magFilter || params.filter;
        if ( param ) {
            if ( MAG_FILTERS[ param ] ) {
                this.magFilter = param;
                gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl[ this.magFilter ] );
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
                    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[ this.minFilter ] );
                } else  {
                    console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`, command ignored.' );
                }
            } else {
                if ( MIN_FILTERS[ param ] ) {
                    this.minFilter = param;
                    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[ this.minFilter ] );
                } else {
                    console.warn( 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`, command ignored.' );
                }
            }
        }
        this.pop();
        return this;
    };

    module.exports = TextureCubeMap;

}());
