(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.esper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {

    'use strict';

    var Texture2D = require('./Texture2D');
    var ImageLoader = require('../util/ImageLoader');
    var Util = require('../util/Util');
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
    var WRAP_MODES = {
        REPEAT: true,
        MIRRORED_REPEAT: true,
        CLAMP_TO_EDGE: true
    };
    var TYPES = {
        UNSIGNED_BYTE: true,
        FLOAT: true
    };
    var FORMATS = {
        RGB: true,
        RGBA: true
    };

    /**
     * The default type for color textures.
     */
    var DEFAULT_TYPE = 'UNSIGNED_BYTE';

    /**
     * The default format for color textures.
     */
    var DEFAULT_FORMAT = 'RGBA';

    /**
     * The default wrap mode for color textures.
     */
    var DEFAULT_WRAP = 'REPEAT';

    /**
     * The default min / mag filter for color textures.
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
     * @param {HTMLImageElement} img - The image object.
     */
    function setImgData( spec, img ) {
        // create an empty canvas element
        var canvas = document.createElement( 'canvas' );
        if ( mustBePowerOfTwo( spec ) ) {
            canvas.width = Util.nextHighestPowerOfTwo( img.width );
            canvas.height = Util.nextHighestPowerOfTwo( img.height );
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        // Copy the image contents to the canvas
        var ctx = canvas.getContext( '2d' );
        ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height );
        var data = ctx.getImageData( 0, 0, canvas.width, canvas.height ).data;
        spec.data = new Uint8Array( data );
        spec.width = canvas.width;
        spec.height = canvas.height;
    }

    /**
     * Instantiates a ColorRexture2D object.
     * @class ColorRexture2D
     * @classdesc A texture class to represent a 2D color texture.
     *
     * @param {Object} spec - The specification arguments.
     * @param {Image} spec.image - The HTMLImageElement to buffer.
     * @param {String} spec.url - The HTMLImageElement URL to load and buffer.
     * @param {Uint8Array|Float32Array} spec.data - The data to buffer.
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
     * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
     */
    function ColorRexture2D( spec, callback ) {
        spec = spec || {};
        // get specific params
        spec.wrapS = spec.wrapS || spec.wrap;
        spec.wrapT = spec.wrapT || spec.wrap;
        spec.minFilter = spec.minFilter || spec.filter;
        spec.magFilter = spec.magFilter || spec.filter;
        // set texture params
        spec.wrapS = WRAP_MODES[ spec.wrapS ] ? spec.wrapS : DEFAULT_WRAP;
        spec.wrapT = WRAP_MODES[ spec.wrapT ] ? spec.wrapT : DEFAULT_WRAP;
        spec.minFilter = MIN_FILTERS[ spec.minFilter ] ? spec.minFilter : DEFAULT_FILTER;
        spec.magFilter = MAG_FILTERS[ spec.magFilter ] ? spec.magFilter : DEFAULT_FILTER;
        // set other properties
        spec.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
        spec.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
        spec.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
        // set format
        spec.format = FORMATS[ spec.format ] ? spec.format : DEFAULT_FORMAT;
        // buffer the texture based on argument type
        if ( spec.image ) {
            // use existing Image object
            spec.type = 'UNSIGNED_BYTE';
            setImgData( spec, spec.image );
            Texture2D.call( this, spec );
        } else if ( spec.url ) {
            // request image source from url
            spec.type = 'UNSIGNED_BYTE';
            var that = this;
            ImageLoader.load({
                url: spec.url,
                success: function( image ) {
                    setImgData( spec, image );
                    Texture2D.call( that, spec );
                    if ( callback ) {
                        callback( null, that );
                    }
                },
                error: function( err ) {
                    if ( callback ) {
                        callback( err, null );
                    }
                }
            });
        } else {
            // use arraybuffer
            if ( spec.data === undefined ) {
                // if no data is provided, assume this texture will be rendered
                // to. In this case disable mipmapping, there is no need and it
                // will only introduce very peculiar and difficult to discern
                // rendering phenomena in which the texture 'transforms' at
                // certain angles / distances to the mipmapped (empty) portions.
                spec.mipMap = false;
            }
            spec.type = TYPES[ spec.type ] ? spec.type : DEFAULT_TYPE;
            Texture2D.call( this, spec );
        }
    }

    ColorRexture2D.prototype = Object.create( Texture2D.prototype );

    module.exports = ColorRexture2D;

}());

},{"../util/ImageLoader":17,"../util/Util":20,"./Texture2D":8}],2:[function(require,module,exports){
(function () {

    'use strict';

    var Texture2D = require('./Texture2D');
    var MAG_FILTERS = {
        NEAREST: true,
        LINEAR: true
    };
    var MIN_FILTERS = {
        NEAREST: true,
        LINEAR: true
    };
    var WRAP_MODES = {
        REPEAT: true,
        CLAMP_TO_EDGE: true,
        MIRRORED_REPEAT: true
    };
    var DEPTH_TYPES = {
        UNSIGNED_BYTE: true,
        UNSIGNED_SHORT: true,
        UNSIGNED_INT: true
    };
    var FORMATS = {
        DEPTH_COMPONENT: true,
        DEPTH_STENCIL: true
    };

    /**
     * The default type for depth textures.
     */
    var DEFAULT_TYPE = 'UNSIGNED_INT';

    /**
     * The default format for depth textures.
     */
    var DEFAULT_FORMAT = 'DEPTH_COMPONENT';

    /**
     * The default wrap mode for depth textures.
     */
    var DEFAULT_WRAP = 'CLAMP_TO_EDGE';

    /**
     * The default min / mag filter for depth textures.
     */
    var DEFAULT_FILTER = 'LINEAR';

    /**
     * Instantiates a DepthTexture2D object.
     * @class DepthTexture2D
     * @classdesc A texture class to represent a 2D depth texture.
     *
     * @param {Object} spec - The specification arguments.
     * @param {Uint8Array|Uint16Array|Uint32Array} spec.data - The data to buffer.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     * @param {String} spec.wrap - The wrapping type over both S and T dimension.
     * @param {String} spec.wrapS - The wrapping type over the S dimension.
     * @param {String} spec.wrapT - The wrapping type over the T dimension.
     * @param {String} spec.filter - The min / mag filter used during scaling.
     * @param {String} spec.minFilter - The minification filter used during scaling.
     * @param {String} spec.magFilter - The magnification filter used during scaling.
     * @param {String} spec.format - The texture pixel format.
     * @param {String} spec.type - The texture pixel component type.
     * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
     */
    function DepthTexture2D( spec ) {
        spec = spec || {};
        // get specific params
        spec.wrapS = spec.wrapS || spec.wrap;
        spec.wrapT = spec.wrapT || spec.wrap;
        spec.minFilter = spec.minFilter || spec.filter;
        spec.magFilter = spec.magFilter || spec.filter;
        // set texture params
        spec.wrapS = WRAP_MODES[ spec.wrapS ] ? spec.wrapS : DEFAULT_WRAP;
        spec.wrapT = WRAP_MODES[ spec.wrapT ] ? spec.wrapT : DEFAULT_WRAP;
        spec.minFilter = MIN_FILTERS[ spec.minFilter ] ? spec.minFilter : DEFAULT_FILTER;
        spec.magFilter = MAG_FILTERS[ spec.magFilter ] ? spec.magFilter : DEFAULT_FILTER;
        // set mip-mapping and format
        spec.mipMap = false; // disable mip-mapping
        spec.invertY = false; // no need to invert-y
        spec.preMultiplyAlpha = false; // no alpha to pre-multiply
        spec.format = FORMATS[ spec.format ] ? spec.format : DEFAULT_FORMAT;
        // check if stencil-depth, or just depth
        if ( spec.format === 'DEPTH_STENCIL' ) {
            spec.type = 'UNSIGNED_INT_24_8_WEBGL';
        } else {
            spec.type = DEPTH_TYPES[ spec.type ] ? spec.type : DEFAULT_TYPE;
        }
        Texture2D.call( this, spec );
    }

    DepthTexture2D.prototype = Object.create( Texture2D.prototype );

    module.exports = DepthTexture2D;

}());

},{"./Texture2D":8}],3:[function(require,module,exports){
(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');
    var TYPES = {
        UNSIGNED_SHORT: true,
        UNSIGNED_INT: true
    };
    var MODES = {
        POINTS: true,
        LINES: true,
        LINE_STRIP: true,
        LINE_LOOP: true,
        TRIANGLES: true,
        TRIANGLE_STRIP: true,
        TRIANGLE_FAN: true
    };
    var BYTES_PER_TYPE = {
        UNSIGNED_SHORT: 2,
        UNSIGNED_INT: 4
    };

    /**
     * The default component type.
     */
    var DEFAULT_TYPE = 'UNSIGNED_SHORT';

    /**
     * The default render mode (primitive type).
     */
    var DEFAULT_MODE = 'TRIANGLES';

    /**
     * The default index offset to render from.
     */
    var DEFAULT_OFFSET = 0;

    /**
     * The default count of indices to render.
     */
    var DEFAULT_COUNT = 0;

    /**
     * Instantiates an IndexBuffer object.
     * @class IndexBuffer
     * @classdesc An index buffer object.
     *
     * @param {Uint16Array|Uin32Array|Array} arg - The index data to buffer.
     * @param {Object} options - The rendering options.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The offset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     */
    function IndexBuffer( arg, options ) {
        options = options || {};
        var gl = this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( gl );
        this.buffer = gl.createBuffer();
        this.type = TYPES[ options.type ] ? options.type : DEFAULT_TYPE;
        // check if type is supported
        if ( this.type === 'UNSIGNED_INT' && !WebGLContext.checkExtension( 'OES_element_index_uint' ) ) {
            throw 'Cannot create IndexBuffer of type `UNSIGNED_INT` as extension `OES_element_index_uint` is not supported';
        }
        this.mode = MODES[ options.mode ] ? options.mode : DEFAULT_MODE;
        this.count = ( options.count !== undefined ) ? options.count : DEFAULT_COUNT;
        this.offset = ( options.offset !== undefined ) ? options.offset : DEFAULT_OFFSET;
        this.byteLength = 0;
        if ( arg ) {
            if ( arg instanceof WebGLBuffer ) {
                // WebGLBuffer argument
                if ( options.byteLength === undefined ) {
                    throw 'Argument of type `WebGLBuffer` must be complimented with a corresponding `options.byteLength`';
                }
                this.byteLength = options.byteLength;
                this.buffer = arg;
            } else if ( typeof arg === 'number' ) {
                // byte length argument
                if ( options.type === undefined ) {
                    throw 'Argument of type `number` must be complimented with a corresponding `options.type`';
                }
                this.bufferData( arg );
            } else if ( arg instanceof ArrayBuffer ) {
                // ArrayBuffer arg
                if ( options.type === undefined ) {
                    throw 'Argument of type `ArrayBuffer` must be complimented with a corresponding `options.type`';
                }
                this.bufferData( arg );
            } else {
                // Array or ArrayBufferView argument
                this.bufferData( arg );
            }
        } else {
            if ( options.type === undefined ) {
                throw 'Empty buffer must be complimented with a corresponding `options.type`';
            }
        }
        // ensure there isn't an overflow
        var bufferCount = ( this.byteLength / BYTES_PER_TYPE[ this.type ] );
        if ( this.count + this.offset > bufferCount ) {
            throw 'IndexBuffer `count` of ' + this.count + ' and `offset` of ' + this.offset + ' overflows the total count of the buffer ' + bufferCount;
        }
    }

    /**
     * Upload index data to the GPU.
     * @memberof IndexBuffer
     *
     * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer.
     *
     * @returns {IndexBuffer} The index buffer object for chaining.
     */
    IndexBuffer.prototype.bufferData = function( arg ) {
        var gl = this.gl;
        // cast array to ArrayBufferView based on provided type
        if ( arg instanceof Array ) {
            // check for type support
            if ( this.type === 'UNSIGNED_INT' ) {
                // uint32 is supported
                arg = new Uint32Array( arg );
            } else {
                // buffer to uint16
                arg = new Uint16Array( arg );
            }
        }
        // set ensure type corresponds to data
        if ( arg instanceof Uint16Array ) {
            this.type = 'UNSIGNED_SHORT';
        } else if ( arg instanceof Uint32Array ) {
            this.type = 'UNSIGNED_INT';
        } else if ( !( arg instanceof ArrayBuffer ) && typeof arg !== 'number' ) {
            throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `number`';
        }
        // don't overwrite the count if it is already set
        if ( this.count === DEFAULT_COUNT ) {
            if ( typeof arg === 'number' ) {
                this.count = ( arg / BYTES_PER_TYPE[ this.type ] );
            } else {
                this.count = arg.length;
            }
        }
        // set byte length
        if ( typeof arg === 'number' ) {
            if ( arg % BYTES_PER_TYPE[ this.type ] ) {
                throw 'Byte length must be multiple of ' + BYTES_PER_TYPE[ this.type ];
            }
            this.byteLength = arg;
        } else {
            this.byteLength = arg.length * BYTES_PER_TYPE[ this.type ];
        }
        // buffer the data
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, arg, gl.STATIC_DRAW );
        return this;
    };

    /**
     * Upload partial index data to the GPU.
     * @memberof IndexBuffer
     *
     * @param {Array|ArrayBuffer|ArrayBufferView} array - The array of data to buffer.
     * @param {number} byteOffset - The byte offset at which to buffer.
     *
     * @returns {IndexBuffer} The vertex buffer object for chaining.
     */
    IndexBuffer.prototype.bufferSubData = function( array, byteOffset ) {
        var gl = this.gl;
        if ( this.byteLength === 0 ) {
            throw 'Buffer has not been allocated';
        }
        // cast array to ArrayBufferView based on provided type
        if ( array instanceof Array ) {
            // check for type support
            if ( this.type === 'UNSIGNED_INT' ) {
                // uint32 is supported
                array = new Uint32Array( array );
            } else {
                // buffer to uint16
                array = new Uint16Array( array );
            }
        } else if (
            !( array instanceof Uint16Array ) &&
            !( array instanceof Uint32Array ) &&
            !( array instanceof ArrayBuffer ) ) {
            throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
        }
        byteOffset = ( byteOffset !== undefined ) ? byteOffset : DEFAULT_OFFSET;
        // get the total number of attribute components from pointers
        var byteLength = array.length * BYTES_PER_TYPE[ this.type ];
        if ( byteOffset + byteLength > this.byteLength ) {
            throw 'Argument of length ' + byteLength + ' bytes and offset of ' + byteOffset + ' bytes overflows the buffer length of ' + this.byteLength + ' bytes';
        }
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
        gl.bufferSubData( gl.ELEMENT_ARRAY_BUFFER, byteOffset, array );
        return this;
    };

    /**
     * Execute the draw command for the bound buffer.
     * @memberof IndexBuffer
     *
     * @param {Object} options - The options to pass to 'drawElements'. Optional.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The offset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.draw = function( options ) {
        options = options || {};
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode ];
        var type = gl[ this.type ];
        var offset = ( options.offset !== undefined ) ? options.offset : this.offset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        if ( count === 0 ) {
            throw 'Attempting to draw with a count of 0';
        }
        var bufferCount = this.byteLength / BYTES_PER_TYPE[ this.type ];
        if ( offset + count > this.count ) {
            throw 'Attempting to draw with `count` of ' + count + ' and `offset` of ' + offset + ' which overflows the total count of the buffer (' + bufferCount + ')';
        }
        // if this buffer is already bound, exit early
        if ( this.state.boundIndexBuffer !== this.buffer ) {
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
            this.state.boundIndexBuffer = this.buffer;
        }
        // draw elements
        gl.drawElements( mode, count, type, offset );
        return this;
    };

    module.exports = IndexBuffer;

}());

},{"./WebGLContext":13,"./WebGLContextState":14}],4:[function(require,module,exports){
(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');
    var Util = require('../util/Util');

    var TEXTURE_TARGETS = {
        TEXTURE_2D: true,
        TEXTURE_CUBE_MAP: true
    };

    var DEPTH_FORMATS = {
        DEPTH_COMPONENT: true,
        DEPTH_STENCIL: true
    };

    /**
     * Instantiates a RenderTarget object.
     * @class RenderTarget
     * @classdesc A renderTarget class to allow rendering to textures.
     */
    function RenderTarget() {
        var gl = this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( gl );
        this.framebuffer = gl.createFramebuffer();
        this.textures = {};
    }

    /**
     * Binds the renderTarget object and pushes it to the front of the stack.
     * @memberof RenderTarget
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.push = function() {
        if ( this.state.renderTargets.top() !== this ) {
            var gl = this.gl;
            gl.bindFramebuffer( gl.FRAMEBUFFER, this.framebuffer );
        }
        this.state.renderTargets.push( this );
        return this;
    };

    /**
     * Unbinds the renderTarget object and binds the renderTarget beneath it on this stack. If there is no underlying renderTarget, bind the backbuffer.
     * @memberof RenderTarget
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.pop = function() {
        var state = this.state;
        // if there is no render target bound, exit early
        if ( state.renderTargets.top() !== this ) {
            throw 'The current render target is not the top most element on the stack';
        }
        state.renderTargets.pop();
        var top = state.renderTargets.top();
        var gl;
        if ( top ) {
            gl = top.gl;
            gl.bindFramebuffer( gl.FRAMEBUFFER, top.framebuffer );
        } else {
            gl = this.gl;
            gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        }
        return this;
    };

    /**
     * Attaches the provided texture to the provided attachment location.
     * @memberof RenderTarget
     *
     * @param {Texture2D} texture - The texture to attach.
     * @param {number} index - The attachment index. (optional)
     * @param {String} target - The texture target type. (optional)
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.setColorTarget = function( texture, index, target ) {
        var gl = this.gl;
        if ( !texture ) {
            throw 'Texture argument is missing';
        }
        if ( TEXTURE_TARGETS[ index ] && target === undefined ) {
            target = index;
            index = 0;
        }
        if ( index === undefined ) {
            index = 0;
        } else if ( !Util.isInteger( index ) || index < 0 ) {
            throw 'Texture color attachment index is invalid';
        }
        if ( target && !TEXTURE_TARGETS[ target ] ) {
            throw 'Texture target is invalid';
        }
        this.textures[ 'color' + index ] = texture;
        this.push();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl[ 'COLOR_ATTACHMENT' + index ],
            gl[ target || 'TEXTURE_2D' ],
            texture.texture,
            0 );
        this.pop();
        return this;
    };

    /**
     * Attaches the provided texture to the provided attachment location.
     * @memberof RenderTarget
     *
     * @param {Texture2D} texture - The texture to attach.
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.setDepthTarget = function( texture ) {
        if ( !texture ) {
            throw 'Texture argument is missing';
        }
        if ( !DEPTH_FORMATS[ texture.format ] ) {
            throw 'Provided texture is not of format `DEPTH_COMPONENT` or `DEPTH_STENCIL`';
        }
        var gl = this.gl;
        this.textures.depth = texture;
        this.push();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.TEXTURE_2D,
            texture.texture,
            0 );
        this.pop();
        return this;
    };

    /**
     * Resizes the renderTarget and all attached textures by the provided height and width.
     * @memberof RenderTarget
     *
     * @param {number} width - The new width of the renderTarget.
     * @param {number} height - The new height of the renderTarget.
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.resize = function( width, height ) {
        if ( typeof width !== 'number' || ( width <= 0 ) ) {
            throw 'Provided `width` of ' + width + ' is invalid';
        }
        if ( typeof height !== 'number' || ( height <= 0 ) ) {
            throw 'Provided `height` of ' + height + ' is invalid';
        }
        var textures = this.textures;
        Object.keys( textures ).forEach( function( key ) {
            textures[ key ].resize( width, height );
        });
        return this;
    };

    module.exports = RenderTarget;

}());

},{"../util/Util":20,"./WebGLContext":13,"./WebGLContextState":14}],5:[function(require,module,exports){
(function () {

    'use strict';

    var VertexPackage = require('../core/VertexPackage');
    var VertexBuffer = require('../core/VertexBuffer');
    var IndexBuffer = require('../core/IndexBuffer');

    /**
     * Iterates over all attribute pointers and throws an exception if an index
     * occurs mroe than once.
     * @private
     *
     * @param {Array} vertexBuffers - The array of vertexBuffers.
     */
    function checkIndexCollisions( vertexBuffers ) {
        var indices = {};
        vertexBuffers.forEach( function( buffer ) {
            Object.keys( buffer.pointers ).forEach( function( index ) {
                indices[ index ] = indices[ index ] || 0;
                indices[ index ]++;
            });
        });
        Object.keys( indices ).forEach( function( index ) {
            if ( indices[ index ] > 1 ) {
                throw 'More than one attribute pointer exists for index ' + index;
            }
        });
    }

    /**
     * Instantiates an Renderable object.
     * @class Renderable
     * @classdesc A container for one or more VertexBuffers and an optional IndexBuffer.
     *
     * @param {Object} spec - The renderable specification object.
     * @param {Array|Float32Array} spec.vertices - The vertices to interleave and buffer.
     * @param {VertexBuffer} spec.vertexBuffer - An existing vertex buffer to use.
     * @param {VertexBuffer[]} spec.vertexBuffers - Multiple vertex buffers to use.
     * @param {Array|Uint16Array|Uint32Array} spec.indices - The indices to buffer.
     * @param {IndexBuffer} spec.indexbuffer - An existing index buffer to use.
     * @param {String} spec.mode - The draw mode / primitive type.
     * @param {String} spec.offset - The offset into the drawn buffer.
     * @param {String} spec.count - The number of vertices to draw.
     */
    function Renderable( spec ) {
        spec = spec || {};
        if ( spec.vertexBuffer || spec.vertexBuffers ) {
            // use existing vertex buffer
            this.vertexBuffers = spec.vertexBuffers || [ spec.vertexBuffer ];
        } else if ( spec.vertices ) {
            // create vertex package
            var vertexPackage = new VertexPackage( spec.vertices );
            // create vertex buffer
            this.vertexBuffers = [ new VertexBuffer( vertexPackage ) ];
        } else {
            this.vertexBuffers = [];
        }
        if ( spec.indexBuffer ) {
            // use existing index buffer
            this.indexBuffer = spec.indexBuffer;
        } else if ( spec.indices ) {
            // create index buffer
            this.indexBuffer = new IndexBuffer( spec.indices );
        } else {
            this.indexBuffer = null;
        }
        // check that no attribute indices clash
        checkIndexCollisions( this.vertexBuffers );
        // store rendering options
        this.options = {
            mode: spec.mode,
            offset: spec.offset,
            count: spec.count
        };
    }

    /**
     * Execute the draw command for the underlying buffers.
     * @memberof Renderable
     *
     * @param {Object} options - The options to pass to 'drawElements'. Optional.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The offset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     *
     * @returns {Renderable} Returns the renderable object for chaining.
     */
    Renderable.prototype.draw = function( options ) {
        var overrides = options || {};
        // override options if provided
        overrides.mode = overrides.mode || this.options.mode;
        overrides.offset = ( overrides.offset !== undefined ) ? overrides.offset : this.options.offset;
        overrides.count = ( overrides.count !== undefined ) ? overrides.count : this.options.count;
        // draw the renderable
        if ( this.indexBuffer ) {
            // use index buffer to draw elements
            // bind vertex buffers and enable attribute pointers
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
            });
            // draw primitives using index buffer
            this.indexBuffer.draw( overrides );
            // disable attribute pointers
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.unbind();
            });
            // no advantage to unbinding as there is no stack used
        } else {
            // no index buffer, use draw arrays
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
                vertexBuffer.draw( overrides );
                vertexBuffer.unbind();
            });
        }
        return this;
    };

    module.exports = Renderable;

}());

},{"../core/IndexBuffer":3,"../core/VertexBuffer":10,"../core/VertexPackage":11}],6:[function(require,module,exports){
(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var ShaderParser = require('./ShaderParser');
    var WebGLContextState = require('./WebGLContextState');
    var Async = require('../util/Async');
    var XHRLoader = require('../util/XHRLoader');
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

    /**
     * Given a map of existing attributes, find the lowest index that is not
     * already used. If the attribute ordering was already provided, use that
     * instead.
     * @private
     *
     * @param {Object} attributes - The existing attributes object.
     * @param {Object} declaration - The attribute declaration object.
     *
     * @returns {number} The attribute index.
     */
    function getAttributeIndex( attributes, declaration ) {
        // check if attribute is already declared, if so, use that index
        if ( attributes[ declaration.name ] ) {
            return attributes[ declaration.name ].index;
        }
        // return next available index
        return Object.keys( attributes ).length;
    }

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
        // for each declaration in the shader
        declarations.forEach( function( declaration ) {
            // check if its an attribute or uniform
            if ( declaration.qualifier === 'attribute' ) {
                // if attribute, store type and index
                var index = getAttributeIndex( shader.attributes, declaration );
                shader.attributes[ declaration.name ] = {
                    type: declaration.type,
                    index: index
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
            throw 'An error occurred compiling the shaders:\n' + gl.getShaderInfoLog( shader );
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
     * @returns {Shader} The shader object, for chaining.
     */
    function createProgram( shader, sources ) {
        var gl = shader.gl;
        var common = sources.common.join( '' );
        var vert = sources.vert.join( '' );
        var frag = sources.frag.join( '' );
        // compile shaders
        var vertexShader = compileShader( gl, common + vert, 'VERTEX_SHADER' );
        var fragmentShader = compileShader( gl, common + frag, 'FRAGMENT_SHADER' );
        // parse source for attribute and uniforms
        setAttributesAndUniforms( shader, vert, frag );
        // create the shader program
        shader.program = gl.createProgram();
        // attach vertex and fragment shaders
        gl.attachShader( shader.program, vertexShader );
        gl.attachShader( shader.program, fragmentShader );
        // bind vertex attribute locations BEFORE linking
        bindAttributeLocations( shader );
        // link shader
        gl.linkProgram( shader.program );
        // If creating the shader program failed, alert
        if ( !gl.getProgramParameter( shader.program, gl.LINK_STATUS ) ) {
            throw 'An error occured linking the shader:\n' + gl.getProgramInfoLog( shader.program );
        }
        // get shader uniform locations
        getUniformLocations( shader );
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
     * @param {String[]} spec.attributes - The attribute index orderings.
     * @param {Function} callback - The callback function to execute once the shader
     *     has been successfully compiled and linked.
     */
    function Shader( spec, callback ) {
        var that = this;
        spec = spec || {};
        // check source arguments
        if ( !spec.vert ) {
            throw 'Vertex shader argument has not been provided';
        }
        if ( !spec.frag ) {
            throw 'Fragment shader argument has not been provided';
        }
        this.program = 0;
        this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( this.gl );
        this.version = spec.version || '1.00';
        this.attributes = {};
        this.uniforms = {};
        // if attribute ordering is provided, use those indices
        if ( spec.attributes ) {
            spec.attributes.forEach( function( attr, index ) {
                that.attributes[ attr ] = {
                    index: index
                };
            });
        }
        // create the shader
        Async.parallel({
            common: resolveSources( spec.common ),
            vert: resolveSources( spec.vert ),
            frag: resolveSources( spec.frag ),
        }, function( err, sources ) {
            if ( err ) {
                if ( callback ) {
                    callback( err, null );
                }
                return;
            }
            // once all shader sources are loaded
            createProgram( that, sources );
            if ( callback ) {
                callback( null, that );
            }
        });
    }

    /**
     * Binds the shader object and pushes it to the front of the stack.
     * @memberof Shader
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.push = function() {
        // if this shader is already bound, no need to rebind
        if ( this.state.shaders.top() !== this ) {
            this.gl.useProgram( this.program );
        }
        this.state.shaders.push( this );
        return this;
    };

    /**
     * Unbinds the shader object and binds the shader beneath it on this stack. If there is no underlying shader, bind the backbuffer.
     * @memberof Shader
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.pop = function() {
        var state = this.state;
        // if there is no shader bound, exit early
        if ( state.shaders.top() !== this ) {
            throw 'Shader is not the top most element on the stack';
        }
        // pop shader off stack
        state.shaders.pop();
        // if there is an underlying shader, bind it
        var top = state.shaders.top();
        if ( top && top !== this ) {
            top.gl.useProgram( top.program );
        } else {
            // unbind the shader
            this.gl.useProgram( null );
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
        // ensure shader is bound
        if ( this !== this.state.shaders.top() ) {
            throw 'Attempting to set uniform `' + name + '` for an unbound shader';
        }
        var uniform = this.uniforms[ name ];
        // ensure that the uniform spec exists for the name
        if ( !uniform ) {
            throw 'No uniform found under name `' + name + '`';
        }
        // ensure that the uniform argument is defined
        if ( value === undefined ) {
            throw 'Argument passed for uniform `' + name + '` is undefined';
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

},{"../util/Async":16,"../util/XHRLoader":21,"./ShaderParser":7,"./WebGLContext":13,"./WebGLContextState":14}],7:[function(require,module,exports){
(function () {

    'use strict';

    var PRECISION_QUALIFIERS = {
        highp: true,
        mediump: true,
        lowp: true
    };

    var PRECISION_TYPES = {
        float: 'float',
        vec2: 'float',
        vec3: 'float',
        vec4: 'float',
        ivec2: 'int',
        ivec3: 'int',
        ivec4: 'int',
        int: 'int',
        uint: 'int',
        sampler2D: 'sampler2D',
        samplerCube: 'samplerCube',
    };

    var COMMENTS_REGEXP = /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm;
    var ENDLINE_REGEXP = /(\r\n|\n|\r)/gm;
    var WHITESPACE_REGEXP = /\s{2,}/g;
    var BRACKET_WHITESPACE_REGEXP = /(\s*)(\[)(\s*)(\d+)(\s*)(\])(\s*)/g;
    var NAME_COUNT_REGEXP = /([a-zA-Z_][a-zA-Z0-9_]*)(?:\[(\d+)\])?/;
    var PRECISION_REGEX = /\b(precision)\s+(\w+)\s+(\w+)/;
    var GLSL_REGEXP =  /void\s+main\s*\(\s*(void)*\s*\)\s*/mi;

    /**
     * Removes standard comments from the provided string.
     * @private
     *
     * @param {String} str - The string to strip comments from.
     *
     * @return {String} The commentless string.
     */
    function stripComments( str ) {
        // regex source: https://github.com/moagrius/stripcomments
        return str.replace( COMMENTS_REGEXP, '' );
    }

    /**
     * Converts all whitespace into a single ' ' space character.
     * @private
     *
     * @param {String} str - The string to normalize whitespace from.
     *
     * @return {String} The normalized string.
     */
    function normalizeWhitespace( str ) {
        return str.replace( ENDLINE_REGEXP, ' ' ) // remove line endings
            .replace( WHITESPACE_REGEXP, ' ' ) // normalize whitespace to single ' '
            .replace( BRACKET_WHITESPACE_REGEXP, '$2$4$6' ); // remove whitespace in brackets
    }

    /**
     * Parses the name and count out of a name statement, returning the
     * declaration object.
     * @private
     *
     * @param {String} qualifier - The qualifier string.
     * @param {String} precision - The precision string.
     * @param {String} type - The type string.
     * @param {String} entry - The variable declaration string.
     */
    function parseNameAndCount( qualifier, precision, type, entry ) {
        // determine name and size of variable
        var matches = entry.match( NAME_COUNT_REGEXP );
        var name = matches[1];
        var count = ( matches[2] === undefined ) ? 1 : parseInt( matches[2], 10 );
        return {
            qualifier: qualifier,
            precision: precision,
            type: type,
            name: name,
            count: count
        };
    }

    /**
     * Parses a single 'statement'. A 'statement' is considered any sequence of
     * characters followed by a semi-colon. Therefore, a single 'statement' in
     * this sense could contain several comma separated declarations. Returns
     * all resulting declarations.
     * @private
     *
     * @param {String} statement - The statement to parse.
     * @param {Object} precisions - The current state of global precisions.
     *
     * @returns {Array} The array of parsed declaration objects.
     */
    function parseStatement( statement, precisions ) {
        // split statement on commas
        //
        // [ 'uniform highp mat4 A[10]', 'B', 'C[2]' ]
        //
        var commaSplit = statement.split(',').map( function( elem ) {
            return elem.trim();
        });

        // split declaration header from statement
        //
        // [ 'uniform', 'highp', 'mat4', 'A[10]' ]
        //
        var header = commaSplit.shift().split(' ');

        // qualifier is always first element
        //
        // 'uniform'
        //
        var qualifier = header.shift();

        // precision may or may not be declared
        //
        // 'highp' || (if it was omited) 'mat4'
        //
        var precision = header.shift();
        var type;
        // if not a precision keyword it is the type instead
        if ( !PRECISION_QUALIFIERS[ precision ] ) {
            type = precision;
            precision = precisions[ PRECISION_TYPES[ type ] ];
        } else {
            type = header.shift();
        }

        // last part of header will be the first, and possible only variable name
        //
        // [ 'A[10]', 'B', 'C[2]' ]
        //
        var names = header.concat( commaSplit );
        // if there are other names after a ',' add them as well
        var results = [];
        names.forEach( function( name ) {
            results.push( parseNameAndCount( qualifier, precision, type, name ) );
        });
        return results;
    }

    /**
     * Splits the source string by semi-colons and constructs an array of
     * declaration objects based on the provided qualifier keywords.
     * @private
     *
     * @param {String} source - The shader source string.
     * @param {String|Array} keywords - The qualifier declaration keywords.
     *
     * @returns {Array} The array of qualifier declaration objects.
     */
    function parseSource( source, keywords ) {
        // remove all comments from source
        var commentlessSource = stripComments( source );
        // normalize all whitespace in the source
        var normalized = normalizeWhitespace( commentlessSource );
        // get individual statements ( any sequence ending in ; )
        var statements = normalized.split(';');
        // build regex for parsing statements with targetted keywords
        var keywordStr = keywords.join('|');
        var keywordRegex = new RegExp( '.*\\b(' + keywordStr + ')\\b.*' );
        // parse and store global precision statements and any declarations
        var precisions = {};
        var matched = [];
        // for each statement
        statements.forEach( function( statement ) {
            // check if precision statement
            //
            // [ 'precision highp float', 'precision', 'highp', 'float' ]
            //
            var pmatch = statement.match( PRECISION_REGEX );
            if ( pmatch ) {
                precisions[ pmatch[3] ] = pmatch[2];
                return;
            }
            // check for keywords
            //
            // [ 'uniform float time' ]
            //
            var kmatch = statement.match( keywordRegex );
            if ( kmatch ) {
                // parse statement and add to array
                matched = matched.concat( parseStatement( kmatch[0], precisions ) );
            }
        });
        return matched;
    }

    /**
     * Filters out duplicate declarations present between shaders.
     * @private
     *
     * @param {Array} declarations - The array of declarations.
     *
     * @returns {Array} The filtered array of declarations.
     */
    function filterDuplicatesByName( declarations ) {
        // in cases where the same declarations are present in multiple
        // sources, this function will remove duplicates from the results
        var seen = {};
        return declarations.filter( function( declaration ) {
            if ( seen[ declaration.name ] ) {
                return false;
            }
            seen[ declaration.name ] = true;
            return true;
        });
    }

    module.exports = {

        /**
         * Parses the provided GLSL source, and returns all declaration statements that contain the provided qualifier type. This can be used to extract all attributes and uniform names and types from a shader.
         *
         * For example, when provided a 'uniform' qualifiers, the declaration:
         *
         *     'uniform highp vec3 uSpecularColor;'
         *
         * Would be parsed to:
         *     {
         *         qualifier: 'uniform',
         *         type: 'vec3',
         *         name: 'uSpecularColor',
         *         count: 1
         *     }
         * @param {String|Array} sources - The shader sources.
         * @param {String|Array} qualifiers - The qualifiers to extract.
         *
         * @returns {Array} The array of qualifier declaration statements.
         */
        parseDeclarations: function( sources, qualifiers ) {
            // if no sources or qualifiers are provided, return empty array
            if ( !qualifiers || qualifiers.length === 0 ||
                !sources || sources.length === 0 ) {
                return [];
            }
            sources = ( sources instanceof Array ) ? sources : [ sources ];
            qualifiers = ( qualifiers instanceof Array ) ? qualifiers : [ qualifiers ];
            // parse out targetted declarations
            var declarations = [];
            sources.forEach( function( source ) {
                declarations = declarations.concat( parseSource( source, qualifiers ) );
            });
            // remove duplicates and return
            return filterDuplicatesByName( declarations );
        },

        /**
         * Detects based on the existence of a 'void main() {' statement, if the string is glsl source code.
         *
         * @param {String} str - The input string to test.
         *
         * @returns {boolean} - True if the string is glsl code.
         */
        isGLSL: function( str ) {
            return GLSL_REGEXP.test( str );
        }

    };

}());

},{}],8:[function(require,module,exports){
(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');
    var Util = require('../util/Util');
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
    var DEPTH_TYPES = {
        DEPTH_COMPONENT: true,
        DEPTH_STENCIL: true
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
        spec = spec || {};
        if ( typeof spec.width !== 'number' || spec.width <= 0 ) {
            throw '`width` argument is missing or invalid';
        }
        if ( typeof spec.height !== 'number' || spec.height <= 0 ) {
            throw '`height` argument is missing or invalid';
        }
        var gl = this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( gl );
        // create texture object
        this.texture = gl.createTexture();
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
        // buffer the data
        this.bufferData( spec.data || null, spec.width, spec.height );
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
    Texture2D.prototype.push = function( location ) {
        if ( location === undefined ) {
            location = 0;
        } else if ( !Util.isInteger( location ) || location < 0 ) {
            throw 'Texture unit location is invalid';
        }
        // if this texture is already bound, no need to rebind
        if ( this.state.texture2Ds.top( location ) !== this ) {
            var gl = this.gl;
            gl.activeTexture( gl[ 'TEXTURE' + location ] );
            gl.bindTexture( gl.TEXTURE_2D, this.texture );
        }
        // add to stack under the texture unit
        this.state.texture2Ds.push( location, this );
        return this;
    };

    /**
     * Unbinds the texture object and binds the texture beneath it on this stack. If there is no underlying texture, unbinds the unit.
     * @memberof Texture2D
     *
     * @param {number} location - The texture unit location index. Default to 0.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.pop = function( location ) {
        if ( location === undefined ) {
            location = 0;
        } else if ( !Util.isInteger( location ) || location < 0 ) {
            throw 'Texture unit location is invalid';
        }
        var state = this.state;
        if ( state.texture2Ds.top( location ) !== this ) {
            throw 'Texture2D is not the top most element on the stack';
        }
        state.texture2Ds.pop( location );
        var gl;
        var top = state.texture2Ds.top( location );
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
        } else if ( data && !( data instanceof ArrayBuffer ) ) {
            throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`, or null';
        }
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
        if ( typeof width !== 'number' || ( width <= 0 ) ) {
            throw 'Provided `width` of ' + width + ' is invalid';
        }
        if ( typeof height !== 'number' || ( height <= 0 ) ) {
            throw 'Provided `height` of ' + height + ' is invalid';
        }
        this.bufferData( this.data, width, height );
        return this;
    };

    module.exports = Texture2D;

}());

},{"../util/Util":20,"./WebGLContext":13,"./WebGLContextState":14}],9:[function(require,module,exports){
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
     * Binds the texture object and pushes it to onto the stack.
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
                throw 'Provided `width` of ' + width + ' is invalid';
            }
            if ( typeof height !== 'number' || height <= 0 ) {
                throw 'Provided `height` of ' + height + ' is invalid';
            }
            if ( width !== height ) {
                throw 'Provided `width` must be equal to `height`';
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
                throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or null';
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

},{"../util/Async":16,"../util/ImageLoader":17,"../util/Util":20,"./WebGLContext":13,"./WebGLContextState":14}],10:[function(require,module,exports){
(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');
    var VertexPackage = require('./VertexPackage');
    var MODES = {
        POINTS: true,
        LINES: true,
        LINE_STRIP: true,
        LINE_LOOP: true,
        TRIANGLES: true,
        TRIANGLE_STRIP: true,
        TRIANGLE_FAN: true
    };
    var TYPES = {
        FLOAT: true
    };
    var BYTES_PER_TYPE = {
        FLOAT: 4
    };
    var BYTES_PER_COMPONENT = BYTES_PER_TYPE.FLOAT;
    var SIZES = {
        1: true,
        2: true,
        3: true,
        4: true
    };
    var DEFAULT_MODE = 'TRIANGLES';
    var DEFAULT_OFFSET = 0;
    var DEFAULT_COUNT = 0;

    /**
     * Parse the attribute pointers and determine the stride of the buffer.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {number} - The stride of the buffer.
     */
    function getStride( attributePointers ) {
        // if there is only one attribute pointer assigned to this buffer,
        // there is no need for stride, set to default of 0
        var indices = Object.keys( attributePointers );
        if ( indices.length === 1 ) {
            return 0;
        }
        var maxOffset = 0;
        var byteSizeSum = 0;
        var stride = 0;
        indices.forEach( function( index ) {
            var pointer = attributePointers[ index ];
            var offset = pointer.offset;
            var size = pointer.size;
            var type = pointer.type;
            // track the sum of each attribute size
            byteSizeSum += size * BYTES_PER_TYPE[ type ];
            // track the largest offset to determine the stride of the buffer
            if ( offset > maxOffset ) {
                maxOffset = offset;
                stride = offset + ( size * BYTES_PER_TYPE[ type ] );
            }
        });
        // check if the max offset is greater than or equal to the the sum of
        // the sizes. If so this buffer is not interleaved and does not need a
        // stride.
        if ( maxOffset >= byteSizeSum ) {
            // TODO: test what stride === 0 does for an interleaved buffer of
            // length === 1.
            return 0;
        }
        return stride;
    }

    /**
     * Parse the attribute pointers to ensure they are valid.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {Object} - The validated attribute pointer map.
     */
    function getAttributePointers( attributePointers ) {
        // ensure there are pointers provided
        if ( !attributePointers || Object.keys( attributePointers ).length === 0 ) {
            throw 'VertexBuffer requires attribute pointers to be specified upon instantiation';
        }
        // parse pointers to ensure they are valid
        var pointers = {};
        Object.keys( attributePointers ).forEach( function( key ) {
            var index = parseInt( key, 10 );
            // check that key is an valid integer
            if ( isNaN( index ) ) {
                throw 'Attribute index `' + key + '` does not represent an integer';
            }
            var pointer = attributePointers[key];
            var size = pointer.size;
            var type = pointer.type;
            var offset = pointer.offset;
            // check size
            if ( !SIZES[ size ] ) {
                throw 'Attribute pointer `size` parameter is invalid, must be one of ' +
                    JSON.stringify( Object.keys( SIZES ) );
            }
            // check type
            if ( !TYPES[ type ] ) {
                throw 'Attribute pointer `type` parameter is invalid, must be one of ' +
                    JSON.stringify( Object.keys( TYPES ) );
            }
            pointers[ index ] = {
                size: size,
                type: type,
                offset: ( offset !== undefined ) ? offset : 0
            };
        });
        return pointers;
    }

    /**
     * Return the number of components in the buffer.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {number} - The number of components in the buffer.
     */
    function getNumComponents( attributePointers ) {
        var size = 0;
        Object.keys( attributePointers ).forEach( function( index ) {
            size += attributePointers[ index ].size;
        });
        return size;
    }

    /**
     * Instantiates an VertexBuffer object.
     * @class VertexBuffer
     * @classdesc A vertex buffer object.
     *
     * @param {Array|Float32Array|VertexPackage|number} arg - The buffer or length of the buffer.
     * @param {Object} attributePointers - The array pointer map, or in the case of a vertex package arg, the options.
     * @param {Object} options - The rendering options.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The index offset into the drawn buffer.
     * @param {String} options.count - The number of indices to draw.
     */
    function VertexBuffer( arg, attributePointers, options ) {
        options = options || {};
        var gl = this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( gl );
        this.buffer = gl.createBuffer();
        this.mode = MODES[ options.mode ] ? options.mode : DEFAULT_MODE;
        this.count = ( options.count !== undefined ) ? options.count : DEFAULT_COUNT;
        this.offset = ( options.offset !== undefined ) ? options.offset : DEFAULT_OFFSET;
        this.byteLength = 0;
        // first, set the attribute pointers
        if ( arg instanceof VertexPackage ) {
            // VertexPackage argument, use its attribute pointers
            this.pointers = arg.pointers;
            // shift options arg since there will be no attrib pointers arg
            options = attributePointers || {};
        } else {
            this.pointers = getAttributePointers( attributePointers );
        }
        // set stride
        this.stride = getStride( this.pointers );
        // then buffer the data
        if ( arg ) {
            if ( arg instanceof VertexPackage ) {
                // VertexPackage argument
                this.bufferData( arg.buffer );
            } else if ( arg instanceof WebGLBuffer ) {
                // WebGLBuffer argument
                if ( options.byteLength === undefined ) {
                    throw 'Argument of type `WebGLBuffer` must be complimented with a corresponding `options.byteLength`';
                }
                this.byteLength = options.byteLength;
                this.buffer = arg;
            } else {
                // Array or ArrayBuffer or number argument
                this.bufferData( arg );
            }
        }
        // ensure there isn't an overflow
        var bufferCount = ( this.byteLength / BYTES_PER_COMPONENT ) / getNumComponents( this.pointers );
        if ( this.count + this.offset > bufferCount ) {
            throw 'VertexBuffer `count` of ' + this.count + ' and `offset` of ' + this.offset + ' overflows the total count of the buffer ' + bufferCount;
        }
    }

    /**
     * Upload vertex data to the GPU.
     * @memberof VertexBuffer
     *
     * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer, or size of the buffer in bytes.
     *
     * @returns {VertexBuffer} The vertex buffer object for chaining.
     */
    VertexBuffer.prototype.bufferData = function( arg ) {
        var gl = this.gl;
        if ( arg instanceof Array ) {
            // cast array into ArrayBufferView
            arg = new Float32Array( arg );
        } else if (
            !( arg instanceof ArrayBuffer ) &&
            !( arg instanceof Float32Array ) &&
            typeof arg !== 'number' ) {
            // if not arraybuffer or a numeric size
            throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `number`';
        }
        // don't overwrite the count if it is already set
        if ( this.count === DEFAULT_COUNT ) {
            // get the total number of attribute components from pointers
            var numComponents = getNumComponents( this.pointers );
            // set count based on size of buffer and number of components
            if ( typeof arg === 'number' ) {
                this.count = ( arg / BYTES_PER_COMPONENT ) / numComponents;
            } else {
                this.count = arg.length / numComponents;
            }
        }
        // set byte length
        if ( typeof arg === 'number' ) {
            if ( arg % BYTES_PER_COMPONENT ) {
                throw 'Byte length must be multiple of ' + BYTES_PER_COMPONENT;
            }
            this.byteLength = arg;
        } else {
            this.byteLength = arg.length * BYTES_PER_COMPONENT;
        }
        // buffer the data
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, arg, gl.STATIC_DRAW );
    };

    /**
     * Upload partial vertex data to the GPU.
     * @memberof VertexBuffer
     *
     * @param {Array|ArrayBuffer|ArrayBufferView} array - The array of data to buffer.
     * @param {number} byteOffset - The byte offset at which to buffer.
     *
     * @returns {VertexBuffer} The vertex buffer object for chaining.
     */
    VertexBuffer.prototype.bufferSubData = function( array, byteOffset ) {
        var gl = this.gl;
        if ( this.byteLength === 0 ) {
            throw 'Buffer has not yet been allocated';
        }
        if ( array instanceof Array ) {
            array = new Float32Array( array );
        } else if ( !( array instanceof ArrayBuffer ) && !ArrayBuffer.isView( array ) ) {
            throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
        }
        byteOffset = ( byteOffset !== undefined ) ? byteOffset : DEFAULT_OFFSET;
        // get the total number of attribute components from pointers
        var byteLength = array.length * BYTES_PER_COMPONENT;
        if ( byteOffset + byteLength > this.byteLength ) {
            throw 'Argument of length ' + byteLength + ' bytes and offset of ' + byteOffset + ' bytes overflows the buffer length of ' + this.byteLength + ' bytes';
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
        gl.bufferSubData( gl.ARRAY_BUFFER, byteOffset, array );
        return this;
    };

    /**
     * Binds the vertex buffer object.
     * @memberof VertexBuffer
     *
     * @returns {VertexBuffer} Returns the vertex buffer object for chaining.
     */
    VertexBuffer.prototype.bind = function() {
        var gl = this.gl;
        var state = this.state;
        // cache this vertex buffer
        if ( state.boundVertexBuffer !== this.buffer ) {
            // bind buffer
            gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
            state.boundVertexBuffer = this.buffer;
        }
        var pointers = this.pointers;
        var stride = this.stride;
        Object.keys( pointers ).forEach( function( index ) {
            var pointer = pointers[ index ];
            // set attribute pointer
            gl.vertexAttribPointer(
                index,
                pointer.size,
                gl[ pointer.type ],
                false,
                stride,
                pointer.offset );
            // enable attribute index
            if ( !state.enabledVertexAttributes[ index ] ) {
                gl.enableVertexAttribArray( index );
                state.enabledVertexAttributes[ index ] = true;
            }
        });
        return this;
    };

    /**
     * Unbinds the vertex buffer object.
     * @memberof VertexBuffer
     *
     * @returns {VertexBuffer} Returns the vertex buffer object for chaining.
     */
    VertexBuffer.prototype.unbind = function() {
        var gl = this.gl;
        var state = this.state;
        // only bind if it already isn't bound
        if ( state.boundVertexBuffer !== this.buffer ) {
            // bind buffer
            gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
            state.boundVertexBuffer = this.buffer;
        }
        Object.keys( this.pointers ).forEach( function( index ) {
            // disable attribute index
            if ( state.enabledVertexAttributes[ index ] ) {
                gl.disableVertexAttribArray( index );
                state.enabledVertexAttributes[ index ] = false;
            }
        });
        return this;
    };

    /**
     * Execute the draw command for the bound buffer.
     * @memberof VertexBuffer
     *
     * @param {Object} options - The options to pass to 'drawArrays'. Optional.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The index offset into the drawn buffer.
     * @param {String} options.count - The number of indices to draw.
     *
     * @returns {VertexBuffer} Returns the vertex buffer object for chaining.
     */
    VertexBuffer.prototype.draw = function( options ) {
        options = options || {};
        if ( this.state.boundVertexBuffer !== this.buffer ) {
            throw 'Attempting to draw an unbound VertexBuffer';
        }
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode ];
        var offset = ( options.offset !== undefined ) ? options.offset : this.offset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        if ( count === 0 ) {
            throw 'Attempting to draw with a count of 0';
        }
        var bufferCount = this.byteLength / BYTES_PER_COMPONENT;
        if ( count + offset > bufferCount ) {
            throw 'Attempting to draw with `count` of ' + count + ' and `offset` of ' + offset + ' overflows the total count of the buffer (' + bufferCount + ')';
        }
        // draw elements
        gl.drawArrays( mode, offset, count );
        return this;
    };

    module.exports = VertexBuffer;

}());

},{"./VertexPackage":11,"./WebGLContext":13,"./WebGLContextState":14}],11:[function(require,module,exports){
(function () {

    'use strict';

    var Util = require('../util/Util');
    var COMPONENT_TYPE = 'FLOAT';
    var BYTES_PER_COMPONENT = 4;

    /**
     * Removes invalid attribute arguments. A valid argument must be an Array of length > 0 key by a string representing an int.
     * @private
     *
     * @param {Object} attributes - The map of vertex attributes.
     *
     * @returns {Array} The valid array of arguments.
     */
    function parseAttributeMap( attributes ) {
        var goodAttributes = [];
        Object.keys( attributes ).forEach( function( key ) {
            var index = parseFloat( key );
            // check that key is an valid integer
            if ( !Util.isInteger( index ) || index < 0 ) {
                throw 'Attribute index `' + key + '` does not represent a valid integer';
            }
            var vertices = attributes[key];
            // ensure attribute is valid
            if ( vertices &&
                vertices instanceof Array &&
                vertices.length > 0 ) {
                // add attribute data and index
                goodAttributes.push({
                    index: index,
                    data: vertices
                });
            } else {
                throw 'Error parsing attribute of index `' + key + '`';
            }
        });
        // sort attributes ascending by index
        goodAttributes.sort(function(a,b) {
            return a.index - b.index;
        });
        return goodAttributes;
    }

    /**
     * Returns a component's byte size.
     * @private
     *
     * @param {Object|Array} component - The component to measure.
     *
     * @returns {integer} The byte size of the component.
     */
    function getComponentSize( component ) {
        // check if vector
        if ( component.x !== undefined ) {
            // 1 component vector
            if ( component.y !== undefined ) {
                // 2 component vector
                if ( component.z !== undefined ) {
                    // 3 component vector
                    if ( component.w !== undefined ) {
                        // 4 component vector
                        return 4;
                    }
                    return 3;
                }
                return 2;
            }
            return 1;
        }
        // check if array
        if ( component instanceof Array ) {
            return component.length;
        }
        // default to 1 otherwise
        return 1;
    }

    /**
     * Calculates the type, size, and offset for each attribute in the attribute array along with the length and stride of the package.
     * @private
     *
     * @param {VertexPackage} vertexPackage - The VertexPackage object.
     * @param {Array} attributes - The array of vertex attributes.
     */
    function setPointersAndStride( vertexPackage, attributes ) {
        var shortestArray = Number.MAX_VALUE;
        var offset = 0;
        // clear pointers
        vertexPackage.pointers = {};
        // for each attribute
        attributes.forEach( function( vertices ) {
            // set size to number of components in the attribute
            var size = getComponentSize( vertices.data[0] );
            // length of the package will be the shortest attribute array length
            shortestArray = Math.min( shortestArray, vertices.data.length );
            // store pointer under index
            vertexPackage.pointers[ vertices.index ] = {
                type : COMPONENT_TYPE,
                size : size,
                offset : offset * BYTES_PER_COMPONENT
            };
            // accumulate attribute offset
            offset += size;
        });
        // set stride to total offset
        vertexPackage.stride = offset * BYTES_PER_COMPONENT;
        // set length of package to the shortest attribute array length
        vertexPackage.length = shortestArray;
    }

    /**
     * Fill the arraybuffer with a single component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set1ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            if ( vertex.x !== undefined ) {
                buffer[j] = vertex.x;
            } else if ( vertex[0] !== undefined ) {
                buffer[j] = vertex[0];
            } else {
                buffer[j] = vertex;
            }
        }
    }

    /**
     * Fill the arraybuffer with a double component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set2ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            buffer[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
            buffer[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
        }
    }

    /**
     * Fill the arraybuffer with a triple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set3ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            buffer[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
            buffer[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
            buffer[j+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
        }
    }

    /**
     * Fill the arraybuffer with a quadruple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set4ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            buffer[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
            buffer[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
            buffer[j+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
            buffer[j+3] = ( vertex.w !== undefined ) ? vertex.w : vertex[3];
        }
    }

    /**
     * Instantiates an VertexPackage object.
     * @class VertexPackage
     * @classdesc A vertex package object.
     *
     * @param {Object} attributes - The attributes to interleave keyed by index.
     */
    function VertexPackage( attributes ) {
        if ( attributes !== undefined ) {
            this.set( attributes );
        } else {
            this.buffer = new Float32Array(0);
            this.pointers = {};
        }
    }

    /**
     * Set the data to be interleaved inside the package. This clears any previously existing data.
     *
     * @param {Object} attributes - The attributes to interleaved, keyed by index.
     *
     * @returns {VertexPackage} - The vertex package object, for chaining.
     */
    VertexPackage.prototype.set = function( attributes ) {
        // remove bad attributes
        attributes = parseAttributeMap( attributes );
        // set attribute pointers and stride
        setPointersAndStride( this, attributes );
        // set size of data vector
        var length = this.length;
        var stride = this.stride / BYTES_PER_COMPONENT;
        var pointers = this.pointers;
        var buffer = this.buffer = new Float32Array( length * stride );
        // for each vertex attribute array
        attributes.forEach( function( vertices ) {
            // get the pointer
            var pointer = pointers[ vertices.index ];
            // get the pointers offset
            var offset = pointer.offset / BYTES_PER_COMPONENT;
            // copy vertex data into arraybuffer
            switch ( pointer.size ) {
                case 2:
                    set2ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
                case 3:
                    set3ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
                case 4:
                    set4ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
                default:
                    set1ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
            }
        });
        return this;
    };

    module.exports = VertexPackage;

}());

},{"../util/Util":20}],12:[function(require,module,exports){
(function() {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');

    /**
     * Bind the viewport to the rendering context.
     *
     * @param {Viewport} viewport - The viewport object.
     * @param {number} width - The width override.
     * @param {number} height - The height override.
     * @param {number} x - The horizontal offset.
     * @param {number} y - The vertical offset.
     */
    function set( viewport, x, y, width, height ) {
        var gl = viewport.gl;
        x = ( x !== undefined ) ? x : 0;
        y = ( y !== undefined ) ? y : 0;
        width = ( width !== undefined ) ? width : viewport.width;
        height = ( height !== undefined ) ? height : viewport.height;
        gl.viewport( x, y, width, height );
    }

    /**
     * Instantiates an Viewport object.
     * @class Viewport
     * @classdesc A viewport object.
     *
     * @param {Object} spec - The viewport specification object.
     * @param {number} spec.width - The width of the viewport.
     * @param {number} spec.height - The height of the viewport.
     */
    function Viewport( spec ) {
        spec = spec || {};
        this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( this.gl );
        // set size
        this.resize(
            spec.width || this.gl.canvas.width,
            spec.height || this.gl.canvas.height );
    }

    /**
     * Updates the viewports width and height. This resizes the underlying canvas element.
     * @memberof Viewport
     *
     * @param {number} width - The width of the viewport.
     * @param {number} height - The height of the viewport.
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.resize = function( width, height ) {
        if ( typeof width !== 'number' || ( width <= 0 ) ) {
            throw 'Provided `width` of ' + width + ' is invalid';
        }
        if ( typeof height !== 'number' || ( height <= 0 ) ) {
            throw 'Provided `height` of ' + height + ' is invalid';
        }
        this.width = width;
        this.height = height;
        this.gl.canvas.width = width;
        this.gl.canvas.height = height;
        return this;
    };

    /**
     * Activates the viewport and pushes it onto the stack with the provided arguments. The underlying canvas element is not affected.
     * @memberof Viewport
     *
     * @param {number} width - The width override.
     * @param {number} height - The height override.
     * @param {number} x - The horizontal offset override.
     * @param {number} y - The vertical offset override.
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.push = function( x, y, width, height ) {
        if ( x !== undefined && typeof x !== 'number' ) {
            throw 'Provided `x` of ' + x + ' is invalid';
        }
        if ( y !== undefined && typeof y !== 'number' ) {
            throw 'Provided `y` of ' + y + ' is invalid';
        }
        if ( width !== undefined && ( typeof width !== 'number' || ( width <= 0 ) ) ) {
            throw 'Provided `width` of ' + width + ' is invalid';
        }
        if ( height !== undefined && ( typeof height !== 'number' || ( height <= 0 ) ) ) {
            throw 'Provided `height` of ' + height + ' is invalid';
        }
        this.state.viewports.push({
            viewport: this,
            x: x,
            y: y,
            width: width,
            height: height
        });
        set( this, x, y, width, height );
        return this;
    };

    /**
     * Pops current the viewport object and activates the viewport beneath it.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.pop = function() {
        var state = this.state;
        var top = state.viewports.top();
        if ( !top || this !== top.viewport ) {
            throw 'Viewport is not the top most element on the stack';
        }
        state.viewports.pop();
        top = state.viewports.top();
        if ( top ) {
            set( top.viewport, top.x, top.y, top.width, top.height );
        } else {
            set( this );
        }
        return this;
    };

    module.exports = Viewport;

}());

},{"./WebGLContext":13,"./WebGLContextState":14}],13:[function(require,module,exports){
(function() {

    'use strict';

    var EXTENSIONS = [
        // ratified
        'OES_texture_float',
        'OES_texture_half_float',
        'WEBGL_lose_context',
        'OES_standard_derivatives',
        'OES_vertex_array_object',
        'WEBGL_debug_renderer_info',
        'WEBGL_debug_shaders',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_depth_texture',
        'OES_element_index_uint',
        'EXT_texture_filter_anisotropic',
        'EXT_frag_depth',
        'WEBGL_draw_buffers',
        'ANGLE_instanced_arrays',
        'OES_texture_float_linear',
        'OES_texture_half_float_linear',
        'EXT_blend_minmax',
        'EXT_shader_texture_lod',
        // community
        'WEBGL_compressed_texture_atc',
        'WEBGL_compressed_texture_pvrtc',
        'EXT_color_buffer_half_float',
        'WEBGL_color_buffer_float',
        'EXT_sRGB',
        'WEBGL_compressed_texture_etc1'
    ];
    var _boundContext = null;
    var _contexts = {};

    /**
     * Returns an rfc4122 version 4 compliant UUID.
     * @private
     *
     * @returns {String} The UUID string.
     */
    function getUUID() {
        var replace = function( c ) {
            var r = Math.random() * 16 | 0;
            var v = ( c === 'x' ) ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        };
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, replace );
    }

    /**
     * Returns the id of the HTMLCanvasElement element. If there is no id, it
     * generates one and appends it.
     * @private
     *
     * @param {HTMLCanvasElement} canvas - The Canvas object.
     *
     * @returns {String} The Canvas id string.
     */
    function getId( canvas ) {
        if ( !canvas.id ) {
            canvas.id = getUUID();
        }
        return canvas.id;
    }

    /**
     * Returns a Canvas element object from either an existing object, or identification string.
     * @private
     *
     * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas id or selector string.
     *
     * @returns {HTMLCanvasElement} The Canvas element object.
     */
    function getCanvas( arg ) {
        if ( arg instanceof HTMLCanvasElement ) {
            return arg;
        } else if ( typeof arg === 'string' ) {
            return document.getElementById( arg ) ||
                document.querySelector( arg );
        }
        return null;
    }

    /**
     * Attempts to retreive a wrapped WebGLRenderingContext.
     * @private
     *
     * @param {HTMLCanvasElement} The Canvas element object to create the context under.
     *
     * @returns {Object} The context wrapper.
     */
    function getContextWrapper( arg ) {
        if ( arg === undefined ) {
            if ( _boundContext ) {
                // return last bound context
                return _boundContext;
            }
        } else {
            var canvas = getCanvas( arg );
            if ( canvas ) {
                return _contexts[ getId( canvas ) ];
            }
        }
        // no bound context or argument
        return null;
    }

    /**
     * Attempts to load all known extensions for a provided WebGLRenderingContext. Stores the results in the context wrapper for later queries.
     * @private
     *
     * @param {Object} contextWrapper - The context wrapper.
     */
    function loadExtensions( contextWrapper ) {
        var gl = contextWrapper.gl;
        EXTENSIONS.forEach( function( id ) {
            contextWrapper.extensions[ id ] = gl.getExtension( id );
        });
    }

    /**
     * Attempts to create a WebGLRenderingContext wrapped inside an object which will also store the extension query results.
     * @private
     *
     * @param {HTMLCanvasElement} The Canvas element object to create the context under.
     * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
     *
     * @returns {Object} The context wrapper.
     */
    function createContextWrapper( canvas, options ) {
        var gl = canvas.getContext( 'webgl', options ) || canvas.getContext( 'experimental-webgl', options );
        // wrap context
        var contextWrapper = {
            id: getId( canvas ),
            gl: gl,
            extensions: {}
        };
        // load WebGL extensions
        loadExtensions( contextWrapper );
        // add context wrapper to map
        _contexts[ getId( canvas ) ] = contextWrapper;
        // bind the context
        _boundContext = contextWrapper;
        return contextWrapper;
    }

    module.exports = {

        /**
         * Retrieves an existing WebGL context associated with the provided argument and binds it. While bound, the active context will be used implicitly by any instantiated `esper` constructs.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string.
         *
         * @returns {WebGLContext} This namespace, used for chaining.
         */
        bind: function( arg ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                _boundContext = wrapper;
                return this;
            }
            throw 'No context exists for provided argument `' + arg + '`';
        },

        /**
         * Retrieves an existing WebGL context associated with the provided argument. If no context exists, one is created.
         * During creation attempts to load all extensions found at: https://www.khronos.org/registry/webgl/extensions/.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
         *
         * @returns {WebGLRenderingContext} The WebGLRenderingContext object.
         */
        get: function( arg, options ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
               // return the native WebGLRenderingContext
               return wrapper.gl;
            }
            // get canvas element
            var canvas = getCanvas( arg );
            // try to find or create context
            if ( !canvas ) {
                throw 'Context could not be associated with argument of type `' + ( typeof arg ) + '`';
            }
            // create context
            return createContextWrapper( canvas, options ).gl;
        },

        /**
         * Removes an existing WebGL context object for the provided or currently bound object.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
         *
         * @returns {WebGLRenderingContext} The WebGLRenderingContext object.
         */
        remove: function( arg ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                // delete the context
                delete _contexts[ wrapper.id ];
                // remove if currently bound
                if ( wrapper === _boundContext ) {
                    _boundContext = null;
                }
            } else {
                throw 'Context could not be found or deleted for argument of type `' + ( typeof arg ) + '`';
            }
        },

        /**
         * Returns an array of all supported extensions for the provided or currently bound context object. If no context is bound, it will return an empty array.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         *
         * @returns {Array} All supported extensions.
         */
        supportedExtensions: function( arg ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                var extensions = wrapper.extensions;
                var supported = [];
                Object.keys( extensions ).forEach( function( key ) {
                    if ( extensions[ key ] ) {
                        supported.push( key );
                    }
                });
                return supported;
            }
            throw 'No context is currently bound or could be associated with the provided argument';
        },

        /**
         * Returns an array of all unsupported extensions for the provided or currently bound context object. If no context is bound, it will return an empty array.
         * an empty array.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         *
         * @returns {Array} All unsupported extensions.
         */
        unsupportedExtensions: function( arg ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                var extensions = wrapper.extensions;
                var unsupported = [];
                Object.keys( extensions ).forEach( function( key ) {
                    if ( !extensions[ key ] ) {
                        unsupported.push( key );
                    }
                });
                return unsupported;
            }
            throw 'No context is currently bound or could be associated with the provided argument';
        },

        /**
         * Checks if an extension has been successfully loaded for the provided or currently bound context object.
         * 'false'.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {String} extension - The extension name.
         *
         * @returns {boolean} Whether or not the provided extension has been loaded successfully.
         */
        checkExtension: function( arg, extension ) {
            if ( !extension ) {
                // shift parameters if no canvas arg is provided
                extension = arg;
                arg = undefined;
            }
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                var extensions = wrapper.extensions;
                return extensions[ extension ] ? true : false;
            }
            throw 'No context is currently bound or could be associated with the provided argument';
        }
    };

}());

},{}],14:[function(require,module,exports){
(function() {

    'use strict';

    var Stack = require('../util/Stack');
    var StackMap = require('../util/StackMap');
    var _states = {};

    function WebGLContextState() {
        /**
         * The currently bound vertex buffer.
         * @private
         */
        this.boundVertexBuffer = null;

        /**
         * The currently enabled vertex attributes.
         * @private
         */
        this.enabledVertexAttributes = {
            '0': false,
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '5': false
            // ... others will be added as needed
        };

        /**
         * The currently bound index buffer.
         * @private
         */
        this.boundIndexBuffer = null;

        /**
         * The stack of pushed shaders.
         * @private
         */
        this.shaders = new Stack();

        /**
         * The stack of pushed viewports.
         * @private
         */
        this.viewports = new Stack();

        /**
         * The stack of pushed render targets.
         * @private
         */
        this.renderTargets = new Stack();

        /**
         * The map of stacks pushed texture2Ds, keyed by texture unit index.
         * @private
         */
        this.texture2Ds = new StackMap();

        /**
         * The map of pushed texture2Ds,, keyed by texture unit index.
         * @private
         */
        this.textureCubeMaps = new StackMap();
    }

    module.exports = {

        get: function( gl ) {
            var id = gl.canvas.id;
            if ( !_states[ id ] ) {
                _states[ id ] = new WebGLContextState();
            }
            return _states[ id ];
        }

    };

}());

},{"../util/Stack":18,"../util/StackMap":19}],15:[function(require,module,exports){
(function () {

    'use strict';

    module.exports = {
        IndexBuffer: require('./core/IndexBuffer'),
        Renderable: require('./core/Renderable'),
        RenderTarget: require('./core/RenderTarget'),
        Shader: require('./core/Shader'),
        Texture2D: require('./core/Texture2D'),
        ColorTexture2D: require('./core/ColorTexture2D'),
        DepthTexture2D: require('./core/DepthTexture2D'),
        TextureCubeMap: require('./core/TextureCubeMap'),
        VertexBuffer: require('./core/VertexBuffer'),
        VertexPackage: require('./core/VertexPackage'),
        Viewport: require('./core/Viewport'),
        WebGLContext: require('./core/WebGLContext')
    };

}());

},{"./core/ColorTexture2D":1,"./core/DepthTexture2D":2,"./core/IndexBuffer":3,"./core/RenderTarget":4,"./core/Renderable":5,"./core/Shader":6,"./core/Texture2D":8,"./core/TextureCubeMap":9,"./core/VertexBuffer":10,"./core/VertexPackage":11,"./core/Viewport":12,"./core/WebGLContext":13}],16:[function(require,module,exports){
(function () {

    'use strict';

    function getIterator( arg ) {
        var i = -1;
        var len;
        if ( Array.isArray( arg ) ) {
            len = arg.length;
            return function() {
                i++;
                return i < len ? i : null;
            };
        }
        var keys = Object.keys( arg );
        len = keys.length;
        return function() {
            i++;
            return i < len ? keys[i] : null;
        };
    }

    function once( fn ) {
        return function() {
            if ( fn === null ) {
                return;
            }
            fn.apply( this, arguments );
            fn = null;
        };
    }

    function each( object, iterator, callback ) {
        callback = once( callback );
        var key;
        var completed = 0;

        function done( err ) {
            completed--;
            if ( err ) {
                callback( err );
            } else if ( key === null && completed <= 0 ) {
                // check if key is null in case iterator isn't exhausted and done
                // was resolved synchronously.
                callback( null );
            }
        }

        var iter = getIterator(object);
        while ( ( key = iter() ) !== null ) {
            completed += 1;
            iterator( object[ key ], key, done );
        }
        if ( completed === 0 ) {
            callback( null );
        }
    }

    module.exports = {

        /**
         * Execute a set of functions asynchronously, once all have been
         * completed, execute the provided callback function. Jobs may be passed
         * as an array or object. The callback function will be passed the
         * results in the same format as the tasks. All tasks must have accept
         * and execute a callback function upon completion.
         *
         * @param {Array|Object} tasks - The set of functions to execute.
         * @param {Function} callback - The callback function to be executed upon completion.
         */
        parallel: function (tasks, callback) {
            var results = Array.isArray( tasks ) ? [] : {};
            each( tasks, function( task, key, done ) {
                task( function( err, res ) {
                    results[ key ] = res;
                    done( err );
                });
            }, function( err ) {
                callback( err, results );
            });
        }

    };

}());

},{}],17:[function(require,module,exports){
(function() {

    'use strict';

    module.exports = {

        /**
         * Sends an GET request create an Image object.
         *
         * @param {Object} options - The XHR options.
         * @param {String} options.url - The URL for the resource.
         * @param {Function} options.success - The success callback function.
         * @param {Function} options.error - The error callback function.
         */
        load: function ( options ) {
            var image = new Image();
            image.onload = function() {
                if ( options.success ) {
                    options.success( image );
                }
            };
            image.onerror = function( event ) {
                if ( options.error ) {
                    var err = 'Unable to load image from URL: `' + event.path[0].currentSrc + '`';
                    options.error( err );
                }
            };
            image.src = options.url;
        }
    };

}());

},{}],18:[function(require,module,exports){
(function () {

    'use strict';

    /**
     * Instantiates a stack object.
     * @class Stack
     * @classdesc A stack interface.
     */
    function Stack() {
        this.data = [];
    }

    /**
     * Push a value onto the stack.
     *
     * @param {*} value - The value.
     *
     * @returns The stack object for chaining.
     */
    Stack.prototype.push = function( value ) {
        this.data.push( value );
        return this;
    };

    /**
     * Pop a value off the stack. Returns `undefined` if there is no value on
     * the stack.
     *
     * @param {*} value - The value.
     *
     * @returns The value popped off the stack.
     */
    Stack.prototype.pop = function() {
        return this.data.pop();
    };

    /**
     * Returns the current top of the stack, without removing it. Returns
     * `undefined` if there is no value on the stack.
     *
     * @returns The value at the top of the stack.
     */
    Stack.prototype.top = function() {
        var index = this.data.length - 1;
        if ( index < 0 ) {
            return;
        }
        return this.data[ index ];
    };

    module.exports = Stack;

}());

},{}],19:[function(require,module,exports){
(function () {

    'use strict';

    var Stack = require('./Stack');

    /**
     * Instantiates a map of stack objects.
     * @class StackMap
     * @classdesc A hashmap of stacks.
     */
    function StackMap() {
        this.stacks = {};
    }

    /**
     * Push a value onto the stack under a given key.
     *
     * @param {String} key - The key.
     * @param {*} value - The value to push onto the stack.
     *
     * @returns The stack object for chaining.
     */
    StackMap.prototype.push = function( key, value ) {
        if ( !this.stacks[ key ] ) {
            this.stacks[ key ] = new Stack();
        }
        this.stacks[ key ].push( value );
        return this;
    };

    /**
     * Pop a value off the stack. Returns `undefined` if there is no value on
     * the stack, or there is no stack for the key.
     *
     * @param {String} key - The key.
     * @param {*} value - The value to push onto the stack.
     *
     * @returns The value popped off the stack.
     */
    StackMap.prototype.pop = function( key ) {
        if ( !this.stacks[ key ] ) {
            return;
        }
        return this.stacks[ key ].pop();
    };

    /**
     * Returns the current top of the stack, without removing it. Returns
     * `undefined` if there is no value on the stack or no stack for the key.
     *
     * @param {String} key - The key.
     *
     * @returns The value at the top of the stack.
     */
    StackMap.prototype.top = function( key ) {
        if ( !this.stacks[ key ] ) {
            return;
        }
        return this.stacks[ key ].top();
    };

    module.exports = StackMap;

}());

},{"./Stack":18}],20:[function(require,module,exports){
(function () {

    'use strict';

    module.exports = {

        /**
         * Returns true if the value is a number and is an integer.
         *
         * @param {integer} num - The number to test.
         *
         * @returns {boolean} - Whether or not the value is a number.
         */
        isInteger: function( num ) {
            return typeof num === 'number' && ( num % 1 ) === 0;
        },

        /**
         * Returns true if the provided integer is a power of two.
         *
         * @param {integer} num - The number to test.
         *
         * @returns {boolean} - Whether or not the number is a power of two.
         */
        isPowerOfTwo: function( num ) {
            return ( num !== 0 ) ? ( num & ( num - 1 ) ) === 0 : false;
        },

        /**
         * Returns the next highest power of two for a number.
         *
         * Ex.
         *
         *     200 -> 256
         *     256 -> 256
         *     257 -> 512
         *
         * @param {integer} num - The number to modify.
         *
         * @returns {integer} - Next highest power of two.
         */
        nextHighestPowerOfTwo: function( num ) {
            var i;
            if ( num !== 0 ) {
                num = num-1;
            }
            for ( i=1; i<32; i<<=1 ) {
                num = num | num >> i;
            }
            return num + 1;
        }
    };

}());

},{}],21:[function(require,module,exports){
(function() {

    'use strict';

    module.exports = {

        /**
         * Sends an XMLHttpRequest GET request to the supplied url.
         *
         * @param {Object} options - The XHR options.
         * @param {String} options.url - The URL for the resource.
         * @param {Function} options.success - The success callback function.
         * @param {Function} options.error - The error callback function.
         * @param {Function} options.responseType - The responseType of the XHR.
         */
        load: function ( options ) {
            var request = new XMLHttpRequest();
            request.open( 'GET', options.url, true );
            request.responseType = options.responseType;
            request.onreadystatechange = function() {
                if ( request.readyState === 4 ) {
                    if ( request.status === 200 ) {
                        if ( options.success ) {
                            options.success( request.response );
                        }
                    } else {
                        if ( options.error ) {
                            options.error( 'GET ' + request.responseURL + ' ' + request.status + ' (' + request.statusText + ')' );
                        }
                    }
                }
            };
            request.send();
        }
    };

}());

},{}]},{},[15])(15)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db2xvclRleHR1cmUyRC5qcyIsInNyYy9jb3JlL0RlcHRoVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvSW5kZXhCdWZmZXIuanMiLCJzcmMvY29yZS9SZW5kZXJUYXJnZXQuanMiLCJzcmMvY29yZS9SZW5kZXJhYmxlLmpzIiwic3JjL2NvcmUvU2hhZGVyLmpzIiwic3JjL2NvcmUvU2hhZGVyUGFyc2VyLmpzIiwic3JjL2NvcmUvVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvVGV4dHVyZUN1YmVNYXAuanMiLCJzcmMvY29yZS9WZXJ0ZXhCdWZmZXIuanMiLCJzcmMvY29yZS9WZXJ0ZXhQYWNrYWdlLmpzIiwic3JjL2NvcmUvVmlld3BvcnQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHRTdGF0ZS5qcyIsInNyYy9leHBvcnRzLmpzIiwic3JjL3V0aWwvQXN5bmMuanMiLCJzcmMvdXRpbC9JbWFnZUxvYWRlci5qcyIsInNyYy91dGlsL1N0YWNrLmpzIiwic3JjL3V0aWwvU3RhY2tNYXAuanMiLCJzcmMvdXRpbC9VdGlsLmpzIiwic3JjL3V0aWwvWEhSTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyk7XHJcbiAgICB2YXIgSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL0ltYWdlTG9hZGVyJyk7XHJcbiAgICB2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xyXG4gICAgdmFyIE1BR19GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIE1JTl9GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHZhciBXUkFQX01PREVTID0ge1xyXG4gICAgICAgIFJFUEVBVDogdHJ1ZSxcclxuICAgICAgICBNSVJST1JFRF9SRVBFQVQ6IHRydWUsXHJcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHZhciBUWVBFUyA9IHtcclxuICAgICAgICBVTlNJR05FRF9CWVRFOiB0cnVlLFxyXG4gICAgICAgIEZMT0FUOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIEZPUk1BVFMgPSB7XHJcbiAgICAgICAgUkdCOiB0cnVlLFxyXG4gICAgICAgIFJHQkE6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCB0eXBlIGZvciBjb2xvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9CWVRFJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgY29sb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgY29sb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1dSQVAgPSAnUkVQRUFUJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIGNvbG9yIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIG1pcG1hcHBpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfTUlQTUFQID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGludmVydC15IGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX0lOVkVSVF9ZID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdGV4dHVyZSBNVVNUIGJlIGEgcG93ZXItb2YtdHdvLiBPdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB0ZXh0dXJlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge2Jvb2x9IC0gV2hldGhlciBvciBub3QgdGhlIHRleHR1cmUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3by5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbXVzdEJlUG93ZXJPZlR3byggc3BlYyApIHtcclxuICAgICAgICAvLyBBY2NvcmRpbmcgdG86XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMX0FQSS9UdXRvcmlhbC9Vc2luZ190ZXh0dXJlc19pbl9XZWJHTCNOb25fcG93ZXItb2YtdHdvX3RleHR1cmVzXHJcbiAgICAgICAgLy8gTlBPVCB0ZXh0dXJlcyBjYW5ub3QgYmUgdXNlZCB3aXRoIG1pcG1hcHBpbmcgYW5kIHRoZXkgbXVzdCBub3QgXCJyZXBlYXRcIlxyXG4gICAgICAgIHJldHVybiBzcGVjLm1pcE1hcCB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBTID09PSAnUkVQRUFUJyB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBTID09PSAnTUlSUk9SRURfUkVQRUFUJyB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBUID09PSAnUkVQRUFUJyB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBUID09PSAnTUlSUk9SRURfUkVQRUFUJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4dHJhY3RzIHRoZSB1bmRlcmx5aW5nIGRhdGEgYnVmZmVyIGZyb20gYW4gaW1hZ2UgZWxlbWVudC4gSWYgdGV4dHVyZSBtdXN0IGJlIGEgUE9ULCByZXNpemVzIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB0ZXh0dXJlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWcgLSBUaGUgaW1hZ2Ugb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRJbWdEYXRhKCBzcGVjLCBpbWcgKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IGNhbnZhcyBlbGVtZW50XHJcbiAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdjYW52YXMnICk7XHJcbiAgICAgICAgaWYgKCBtdXN0QmVQb3dlck9mVHdvKCBzcGVjICkgKSB7XHJcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKCBpbWcud2lkdGggKTtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKCBpbWcuaGVpZ2h0ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gaW1nLndpZHRoO1xyXG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ29weSB0aGUgaW1hZ2UgY29udGVudHMgdG8gdGhlIGNhbnZhc1xyXG4gICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoIGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0LCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcclxuICAgICAgICB2YXIgZGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApLmRhdGE7XHJcbiAgICAgICAgc3BlYy5kYXRhID0gbmV3IFVpbnQ4QXJyYXkoIGRhdGEgKTtcclxuICAgICAgICBzcGVjLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgICAgIHNwZWMuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIENvbG9yUmV4dHVyZTJEIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBDb2xvclJleHR1cmUyRFxyXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgMkQgY29sb3IgdGV4dHVyZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSBzcGVjaWZpY2F0aW9uIGFyZ3VtZW50cy5cclxuICAgICAqIEBwYXJhbSB7SW1hZ2V9IHNwZWMuaW1hZ2UgLSBUaGUgSFRNTEltYWdlRWxlbWVudCB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy51cmwgLSBUaGUgSFRNTEltYWdlRWxlbWVudCBVUkwgdG8gbG9hZCBhbmQgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtVaW50OEFycmF5fEZsb2F0MzJBcnJheX0gc3BlYy5kYXRhIC0gVGhlIGRhdGEgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMuaW52ZXJ0WSAtIFdoZXRoZXIgb3Igbm90IGludmVydC15IGlzIGVuYWJsZWQuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMucHJlTXVsdGlwbHlBbHBoYSAtIFdoZXRoZXIgb3Igbm90IGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBiZSBleGVjdXRlZCBpZiB0aGUgZGF0YSBpcyBsb2FkZWQgYXN5bmNocm9ub3VzbHkgdmlhIGEgVVJMLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBDb2xvclJleHR1cmUyRCggc3BlYywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgLy8gZ2V0IHNwZWNpZmljIHBhcmFtc1xyXG4gICAgICAgIHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcclxuICAgICAgICBzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XHJcbiAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcclxuICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xyXG4gICAgICAgIC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xyXG4gICAgICAgIHNwZWMud3JhcFMgPSBXUkFQX01PREVTWyBzcGVjLndyYXBTIF0gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xyXG4gICAgICAgIHNwZWMud3JhcFQgPSBXUkFQX01PREVTWyBzcGVjLndyYXBUIF0gPyBzcGVjLndyYXBUIDogREVGQVVMVF9XUkFQO1xyXG4gICAgICAgIHNwZWMubWluRmlsdGVyID0gTUlOX0ZJTFRFUlNbIHNwZWMubWluRmlsdGVyIF0gPyBzcGVjLm1pbkZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xyXG4gICAgICAgIHNwZWMubWFnRmlsdGVyID0gTUFHX0ZJTFRFUlNbIHNwZWMubWFnRmlsdGVyIF0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xyXG4gICAgICAgIC8vIHNldCBvdGhlciBwcm9wZXJ0aWVzXHJcbiAgICAgICAgc3BlYy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBERUZBVUxUX01JUE1BUDtcclxuICAgICAgICBzcGVjLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IERFRkFVTFRfSU5WRVJUX1k7XHJcbiAgICAgICAgc3BlYy5wcmVNdWx0aXBseUFscGhhID0gc3BlYy5wcmVNdWx0aXBseUFscGhhICE9PSB1bmRlZmluZWQgPyBzcGVjLnByZU11bHRpcGx5QWxwaGEgOiBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBO1xyXG4gICAgICAgIC8vIHNldCBmb3JtYXRcclxuICAgICAgICBzcGVjLmZvcm1hdCA9IEZPUk1BVFNbIHNwZWMuZm9ybWF0IF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBiYXNlZCBvbiBhcmd1bWVudCB0eXBlXHJcbiAgICAgICAgaWYgKCBzcGVjLmltYWdlICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgSW1hZ2Ugb2JqZWN0XHJcbiAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcclxuICAgICAgICAgICAgc2V0SW1nRGF0YSggc3BlYywgc3BlYy5pbWFnZSApO1xyXG4gICAgICAgICAgICBUZXh0dXJlMkQuY2FsbCggdGhpcywgc3BlYyApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNwZWMudXJsICkge1xyXG4gICAgICAgICAgICAvLyByZXF1ZXN0IGltYWdlIHNvdXJjZSBmcm9tIHVybFxyXG4gICAgICAgICAgICBzcGVjLnR5cGUgPSAnVU5TSUdORURfQllURSc7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgSW1hZ2VMb2FkZXIubG9hZCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHNwZWMudXJsLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGltYWdlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldEltZ0RhdGEoIHNwZWMsIGltYWdlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgVGV4dHVyZTJELmNhbGwoIHRoYXQsIHNwZWMgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggbnVsbCwgdGhhdCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGVyciApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggZXJyLCBudWxsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB1c2UgYXJyYXlidWZmZXJcclxuICAgICAgICAgICAgaWYgKCBzcGVjLmRhdGEgPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQsIGFzc3VtZSB0aGlzIHRleHR1cmUgd2lsbCBiZSByZW5kZXJlZFxyXG4gICAgICAgICAgICAgICAgLy8gdG8uIEluIHRoaXMgY2FzZSBkaXNhYmxlIG1pcG1hcHBpbmcsIHRoZXJlIGlzIG5vIG5lZWQgYW5kIGl0XHJcbiAgICAgICAgICAgICAgICAvLyB3aWxsIG9ubHkgaW50cm9kdWNlIHZlcnkgcGVjdWxpYXIgYW5kIGRpZmZpY3VsdCB0byBkaXNjZXJuXHJcbiAgICAgICAgICAgICAgICAvLyByZW5kZXJpbmcgcGhlbm9tZW5hIGluIHdoaWNoIHRoZSB0ZXh0dXJlICd0cmFuc2Zvcm1zJyBhdFxyXG4gICAgICAgICAgICAgICAgLy8gY2VydGFpbiBhbmdsZXMgLyBkaXN0YW5jZXMgdG8gdGhlIG1pcG1hcHBlZCAoZW1wdHkpIHBvcnRpb25zLlxyXG4gICAgICAgICAgICAgICAgc3BlYy5taXBNYXAgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcGVjLnR5cGUgPSBUWVBFU1sgc3BlYy50eXBlIF0gPyBzcGVjLnR5cGUgOiBERUZBVUxUX1RZUEU7XHJcbiAgICAgICAgICAgIFRleHR1cmUyRC5jYWxsKCB0aGlzLCBzcGVjICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIENvbG9yUmV4dHVyZTJELnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFRleHR1cmUyRC5wcm90b3R5cGUgKTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENvbG9yUmV4dHVyZTJEO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyk7XHJcbiAgICB2YXIgTUFHX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVI6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgTUlOX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVI6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgV1JBUF9NT0RFUyA9IHtcclxuICAgICAgICBSRVBFQVQ6IHRydWUsXHJcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZSxcclxuICAgICAgICBNSVJST1JFRF9SRVBFQVQ6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgREVQVEhfVFlQRVMgPSB7XHJcbiAgICAgICAgVU5TSUdORURfQllURTogdHJ1ZSxcclxuICAgICAgICBVTlNJR05FRF9TSE9SVDogdHJ1ZSxcclxuICAgICAgICBVTlNJR05FRF9JTlQ6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgRk9STUFUUyA9IHtcclxuICAgICAgICBERVBUSF9DT01QT05FTlQ6IHRydWUsXHJcbiAgICAgICAgREVQVEhfU1RFTkNJTDogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIGRlcHRoIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0lOVCc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIGRlcHRoIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9GT1JNQVQgPSAnREVQVEhfQ09NUE9ORU5UJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgZGVwdGggdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciBkZXB0aCB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBEZXB0aFRleHR1cmUyRCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgRGVwdGhUZXh0dXJlMkRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIGRlcHRoIHRleHR1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl9IHNwZWMuZGF0YSAtIFRoZSBkYXRhIHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIGlmIHRoZSBkYXRhIGlzIGxvYWRlZCBhc3luY2hyb25vdXNseSB2aWEgYSBVUkwuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIERlcHRoVGV4dHVyZTJEKCBzcGVjICkge1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcclxuICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XHJcbiAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xyXG4gICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XHJcbiAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcclxuICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcclxuICAgICAgICBzcGVjLndyYXBTID0gV1JBUF9NT0RFU1sgc3BlYy53cmFwUyBdID8gc3BlYy53cmFwUyA6IERFRkFVTFRfV1JBUDtcclxuICAgICAgICBzcGVjLndyYXBUID0gV1JBUF9NT0RFU1sgc3BlYy53cmFwVCBdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcclxuICAgICAgICBzcGVjLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTWyBzcGVjLm1pbkZpbHRlciBdID8gc3BlYy5taW5GaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IE1BR19GSUxURVJTWyBzcGVjLm1hZ0ZpbHRlciBdID8gc3BlYy5tYWdGaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICAvLyBzZXQgbWlwLW1hcHBpbmcgYW5kIGZvcm1hdFxyXG4gICAgICAgIHNwZWMubWlwTWFwID0gZmFsc2U7IC8vIGRpc2FibGUgbWlwLW1hcHBpbmdcclxuICAgICAgICBzcGVjLmludmVydFkgPSBmYWxzZTsgLy8gbm8gbmVlZCB0byBpbnZlcnQteVxyXG4gICAgICAgIHNwZWMucHJlTXVsdGlwbHlBbHBoYSA9IGZhbHNlOyAvLyBubyBhbHBoYSB0byBwcmUtbXVsdGlwbHlcclxuICAgICAgICBzcGVjLmZvcm1hdCA9IEZPUk1BVFNbIHNwZWMuZm9ybWF0IF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIHN0ZW5jaWwtZGVwdGgsIG9yIGp1c3QgZGVwdGhcclxuICAgICAgICBpZiAoIHNwZWMuZm9ybWF0ID09PSAnREVQVEhfU1RFTkNJTCcgKSB7XHJcbiAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9JTlRfMjRfOF9XRUJHTCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3BlYy50eXBlID0gREVQVEhfVFlQRVNbIHNwZWMudHlwZSBdID8gc3BlYy50eXBlIDogREVGQVVMVF9UWVBFO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUZXh0dXJlMkQuY2FsbCggdGhpcywgc3BlYyApO1xyXG4gICAgfVxyXG5cclxuICAgIERlcHRoVGV4dHVyZTJELnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFRleHR1cmUyRC5wcm90b3R5cGUgKTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IERlcHRoVGV4dHVyZTJEO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XHJcbiAgICB2YXIgV2ViR0xDb250ZXh0U3RhdGUgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dFN0YXRlJyk7XHJcbiAgICB2YXIgVFlQRVMgPSB7XHJcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IHRydWUsXHJcbiAgICAgICAgVU5TSUdORURfSU5UOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIE1PREVTID0ge1xyXG4gICAgICAgIFBPSU5UUzogdHJ1ZSxcclxuICAgICAgICBMSU5FUzogdHJ1ZSxcclxuICAgICAgICBMSU5FX1NUUklQOiB0cnVlLFxyXG4gICAgICAgIExJTkVfTE9PUDogdHJ1ZSxcclxuICAgICAgICBUUklBTkdMRVM6IHRydWUsXHJcbiAgICAgICAgVFJJQU5HTEVfU1RSSVA6IHRydWUsXHJcbiAgICAgICAgVFJJQU5HTEVfRkFOOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIEJZVEVTX1BFUl9UWVBFID0ge1xyXG4gICAgICAgIFVOU0lHTkVEX1NIT1JUOiAyLFxyXG4gICAgICAgIFVOU0lHTkVEX0lOVDogNFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGNvbXBvbmVudCB0eXBlLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX1NIT1JUJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHJlbmRlciBtb2RlIChwcmltaXRpdmUgdHlwZSkuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX01PREUgPSAnVFJJQU5HTEVTJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGluZGV4IG9mZnNldCB0byByZW5kZXIgZnJvbS5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfT0ZGU0VUID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGNvdW50IG9mIGluZGljZXMgdG8gcmVuZGVyLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9DT1VOVCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW4gSW5kZXhCdWZmZXIgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIEluZGV4QnVmZmVyXHJcbiAgICAgKiBAY2xhc3NkZXNjIEFuIGluZGV4IGJ1ZmZlciBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtVaW50MTZBcnJheXxVaW4zMkFycmF5fEFycmF5fSBhcmcgLSBUaGUgaW5kZXggZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSByZW5kZXJpbmcgb3B0aW9ucy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5vZmZzZXQgLSBUaGUgb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBJbmRleEJ1ZmZlciggYXJnLCBvcHRpb25zICkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFdlYkdMQ29udGV4dFN0YXRlLmdldCggZ2wgKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IFRZUEVTWyBvcHRpb25zLnR5cGUgXSA/IG9wdGlvbnMudHlwZSA6IERFRkFVTFRfVFlQRTtcclxuICAgICAgICAvLyBjaGVjayBpZiB0eXBlIGlzIHN1cHBvcnRlZFxyXG4gICAgICAgIGlmICggdGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJyAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCAnT0VTX2VsZW1lbnRfaW5kZXhfdWludCcgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgSW5kZXhCdWZmZXIgb2YgdHlwZSBgVU5TSUdORURfSU5UYCBhcyBleHRlbnNpb24gYE9FU19lbGVtZW50X2luZGV4X3VpbnRgIGlzIG5vdCBzdXBwb3J0ZWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vZGUgPSBNT0RFU1sgb3B0aW9ucy5tb2RlIF0gPyBvcHRpb25zLm1vZGUgOiBERUZBVUxUX01PREU7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9ICggb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmNvdW50IDogREVGQVVMVF9DT1VOVDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9ICggb3B0aW9ucy5vZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5vZmZzZXQgOiBERUZBVUxUX09GRlNFVDtcclxuICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSAwO1xyXG4gICAgICAgIGlmICggYXJnICkge1xyXG4gICAgICAgICAgICBpZiAoIGFyZyBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyICkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2ViR0xCdWZmZXIgYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5ieXRlTGVuZ3RoID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG9mIHR5cGUgYFdlYkdMQnVmZmVyYCBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy5ieXRlTGVuZ3RoYCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBvcHRpb25zLmJ5dGVMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IGFyZztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBieXRlIGxlbmd0aCBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBgbnVtYmVyYCBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy50eXBlYCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoIGFyZyApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBhcmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciApIHtcclxuICAgICAgICAgICAgICAgIC8vIEFycmF5QnVmZmVyIGFyZ1xyXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBgQXJyYXlCdWZmZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJnICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBcnJheSBvciBBcnJheUJ1ZmZlclZpZXcgYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJnICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0VtcHR5IGJ1ZmZlciBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy50eXBlYCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZW5zdXJlIHRoZXJlIGlzbid0IGFuIG92ZXJmbG93XHJcbiAgICAgICAgdmFyIGJ1ZmZlckNvdW50ID0gKCB0aGlzLmJ5dGVMZW5ndGggLyBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF0gKTtcclxuICAgICAgICBpZiAoIHRoaXMuY291bnQgKyB0aGlzLm9mZnNldCA+IGJ1ZmZlckNvdW50ICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSW5kZXhCdWZmZXIgYGNvdW50YCBvZiAnICsgdGhpcy5jb3VudCArICcgYW5kIGBvZmZzZXRgIG9mICcgKyB0aGlzLm9mZnNldCArICcgb3ZlcmZsb3dzIHRoZSB0b3RhbCBjb3VudCBvZiB0aGUgYnVmZmVyICcgKyBidWZmZXJDb3VudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGxvYWQgaW5kZXggZGF0YSB0byB0aGUgR1BVLlxyXG4gICAgICogQG1lbWJlcm9mIEluZGV4QnVmZmVyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0luZGV4QnVmZmVyfSBUaGUgaW5kZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24oIGFyZyApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIC8vIGNhc3QgYXJyYXkgdG8gQXJyYXlCdWZmZXJWaWV3IGJhc2VkIG9uIHByb3ZpZGVkIHR5cGVcclxuICAgICAgICBpZiAoIGFyZyBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgdHlwZSBzdXBwb3J0XHJcbiAgICAgICAgICAgIGlmICggdGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJyApIHtcclxuICAgICAgICAgICAgICAgIC8vIHVpbnQzMiBpcyBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgIGFyZyA9IG5ldyBVaW50MzJBcnJheSggYXJnICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDE2XHJcbiAgICAgICAgICAgICAgICBhcmcgPSBuZXcgVWludDE2QXJyYXkoIGFyZyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBlbnN1cmUgdHlwZSBjb3JyZXNwb25kcyB0byBkYXRhXHJcbiAgICAgICAgaWYgKCBhcmcgaW5zdGFuY2VvZiBVaW50MTZBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcclxuICAgICAgICB9IGVsc2UgaWYgKCBhcmcgaW5zdGFuY2VvZiBVaW50MzJBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0lOVCc7XHJcbiAgICAgICAgfSBlbHNlIGlmICggISggYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgKSAmJiB0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBgQXJyYXlCdWZmZXJWaWV3YCwgb3IgYG51bWJlcmAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkb24ndCBvdmVyd3JpdGUgdGhlIGNvdW50IGlmIGl0IGlzIGFscmVhZHkgc2V0XHJcbiAgICAgICAgaWYgKCB0aGlzLmNvdW50ID09PSBERUZBVUxUX0NPVU5UICkge1xyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBhcmcgPT09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9ICggYXJnIC8gQllURVNfUEVSX1RZUEVbIHRoaXMudHlwZSBdICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ID0gYXJnLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgYnl0ZSBsZW5ndGhcclxuICAgICAgICBpZiAoIHR5cGVvZiBhcmcgPT09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICBpZiAoIGFyZyAlIEJZVEVTX1BFUl9UWVBFWyB0aGlzLnR5cGUgXSApIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdCeXRlIGxlbmd0aCBtdXN0IGJlIG11bHRpcGxlIG9mICcgKyBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IGFyZy5sZW5ndGggKiBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YVxyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlciApO1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBsb2FkIHBhcnRpYWwgaW5kZXggZGF0YSB0byB0aGUgR1BVLlxyXG4gICAgICogQG1lbWJlcm9mIEluZGV4QnVmZmVyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGFycmF5IC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gVGhlIHZlcnRleCBidWZmZXIgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgSW5kZXhCdWZmZXIucHJvdG90eXBlLmJ1ZmZlclN1YkRhdGEgPSBmdW5jdGlvbiggYXJyYXksIGJ5dGVPZmZzZXQgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICBpZiAoIHRoaXMuYnl0ZUxlbmd0aCA9PT0gMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0J1ZmZlciBoYXMgbm90IGJlZW4gYWxsb2NhdGVkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FzdCBhcnJheSB0byBBcnJheUJ1ZmZlclZpZXcgYmFzZWQgb24gcHJvdmlkZWQgdHlwZVxyXG4gICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHR5cGUgc3VwcG9ydFxyXG4gICAgICAgICAgICBpZiAoIHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1aW50MzIgaXMgc3VwcG9ydGVkXHJcbiAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50MzJBcnJheSggYXJyYXkgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0byB1aW50MTZcclxuICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQxNkFycmF5KCBhcnJheSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgISggYXJyYXkgaW5zdGFuY2VvZiBVaW50MTZBcnJheSApICYmXHJcbiAgICAgICAgICAgICEoIGFycmF5IGluc3RhbmNlb2YgVWludDMyQXJyYXkgKSAmJlxyXG4gICAgICAgICAgICAhKCBhcnJheSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgb3IgYEFycmF5QnVmZmVyVmlld2AnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBieXRlT2Zmc2V0ID0gKCBieXRlT2Zmc2V0ICE9PSB1bmRlZmluZWQgKSA/IGJ5dGVPZmZzZXQgOiBERUZBVUxUX09GRlNFVDtcclxuICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIG51bWJlciBvZiBhdHRyaWJ1dGUgY29tcG9uZW50cyBmcm9tIHBvaW50ZXJzXHJcbiAgICAgICAgdmFyIGJ5dGVMZW5ndGggPSBhcnJheS5sZW5ndGggKiBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF07XHJcbiAgICAgICAgaWYgKCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCA+IHRoaXMuYnl0ZUxlbmd0aCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG9mIGxlbmd0aCAnICsgYnl0ZUxlbmd0aCArICcgYnl0ZXMgYW5kIG9mZnNldCBvZiAnICsgYnl0ZU9mZnNldCArICcgYnl0ZXMgb3ZlcmZsb3dzIHRoZSBidWZmZXIgbGVuZ3RoIG9mICcgKyB0aGlzLmJ5dGVMZW5ndGggKyAnIGJ5dGVzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyICk7XHJcbiAgICAgICAgZ2wuYnVmZmVyU3ViRGF0YSggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ5dGVPZmZzZXQsIGFycmF5ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSB0aGUgZHJhdyBjb21tYW5kIGZvciB0aGUgYm91bmQgYnVmZmVyLlxyXG4gICAgICogQG1lbWJlcm9mIEluZGV4QnVmZmVyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5vZmZzZXQgLSBUaGUgb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgaW5kZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICB2YXIgbW9kZSA9IGdsWyBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIF07XHJcbiAgICAgICAgdmFyIHR5cGUgPSBnbFsgdGhpcy50eXBlIF07XHJcbiAgICAgICAgdmFyIG9mZnNldCA9ICggb3B0aW9ucy5vZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5vZmZzZXQgOiB0aGlzLm9mZnNldDtcclxuICAgICAgICB2YXIgY291bnQgPSAoIG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5jb3VudCA6IHRoaXMuY291bnQ7XHJcbiAgICAgICAgaWYgKCBjb3VudCA9PT0gMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGEgY291bnQgb2YgMCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBidWZmZXJDb3VudCA9IHRoaXMuYnl0ZUxlbmd0aCAvIEJZVEVTX1BFUl9UWVBFWyB0aGlzLnR5cGUgXTtcclxuICAgICAgICBpZiAoIG9mZnNldCArIGNvdW50ID4gdGhpcy5jb3VudCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGBjb3VudGAgb2YgJyArIGNvdW50ICsgJyBhbmQgYG9mZnNldGAgb2YgJyArIG9mZnNldCArICcgd2hpY2ggb3ZlcmZsb3dzIHRoZSB0b3RhbCBjb3VudCBvZiB0aGUgYnVmZmVyICgnICsgYnVmZmVyQ291bnQgKyAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIHRoaXMgYnVmZmVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIHRoaXMuc3RhdGUuYm91bmRJbmRleEJ1ZmZlciAhPT0gdGhpcy5idWZmZXIgKSB7XHJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlciApO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmJvdW5kSW5kZXhCdWZmZXIgPSB0aGlzLmJ1ZmZlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZHJhdyBlbGVtZW50c1xyXG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyggbW9kZSwgY291bnQsIHR5cGUsIG9mZnNldCApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEluZGV4QnVmZmVyO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XHJcbiAgICB2YXIgV2ViR0xDb250ZXh0U3RhdGUgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dFN0YXRlJyk7XHJcbiAgICB2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xyXG5cclxuICAgIHZhciBURVhUVVJFX1RBUkdFVFMgPSB7XHJcbiAgICAgICAgVEVYVFVSRV8yRDogdHJ1ZSxcclxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBERVBUSF9GT1JNQVRTID0ge1xyXG4gICAgICAgIERFUFRIX0NPTVBPTkVOVDogdHJ1ZSxcclxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgUmVuZGVyVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBSZW5kZXJUYXJnZXRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSByZW5kZXJUYXJnZXQgY2xhc3MgdG8gYWxsb3cgcmVuZGVyaW5nIHRvIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBSZW5kZXJUYXJnZXQoKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gV2ViR0xDb250ZXh0U3RhdGUuZ2V0KCBnbCApO1xyXG4gICAgICAgIHRoaXMuZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0IGFuZCBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBzdGFjay5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIHRoaXMuc3RhdGUucmVuZGVyVGFyZ2V0cy50b3AoKSAhPT0gdGhpcyApIHtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgdGhpcy5mcmFtZWJ1ZmZlciApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlLnJlbmRlclRhcmdldHMucHVzaCggdGhpcyApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QgYW5kIGJpbmRzIHRoZSByZW5kZXJUYXJnZXQgYmVuZWF0aCBpdCBvbiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHJlbmRlclRhcmdldCwgYmluZCB0aGUgYmFja2J1ZmZlci5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gcmVuZGVyIHRhcmdldCBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggc3RhdGUucmVuZGVyVGFyZ2V0cy50b3AoKSAhPT0gdGhpcyApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RoZSBjdXJyZW50IHJlbmRlciB0YXJnZXQgaXMgbm90IHRoZSB0b3AgbW9zdCBlbGVtZW50IG9uIHRoZSBzdGFjayc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlLnJlbmRlclRhcmdldHMucG9wKCk7XHJcbiAgICAgICAgdmFyIHRvcCA9IHN0YXRlLnJlbmRlclRhcmdldHMudG9wKCk7XHJcbiAgICAgICAgdmFyIGdsO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBnbCA9IHRvcC5nbDtcclxuICAgICAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgdG9wLmZyYW1lYnVmZmVyICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHRvIHRoZSBwcm92aWRlZCBhdHRhY2htZW50IGxvY2F0aW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIGF0dGFjaG1lbnQgaW5kZXguIChvcHRpb25hbClcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQgdHlwZS4gKG9wdGlvbmFsKVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUuc2V0Q29sb3JUYXJnZXQgPSBmdW5jdGlvbiggdGV4dHVyZSwgaW5kZXgsIHRhcmdldCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGlmICggIXRleHR1cmUgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIGFyZ3VtZW50IGlzIG1pc3NpbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIFRFWFRVUkVfVEFSR0VUU1sgaW5kZXggXSAmJiB0YXJnZXQgPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgdGFyZ2V0ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBpbmRleCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICggIVV0aWwuaXNJbnRlZ2VyKCBpbmRleCApIHx8IGluZGV4IDwgMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgY29sb3IgYXR0YWNobWVudCBpbmRleCBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0YXJnZXQgJiYgIVRFWFRVUkVfVEFSR0VUU1sgdGFyZ2V0IF0gKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHRhcmdldCBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1sgJ2NvbG9yJyArIGluZGV4IF0gPSB0ZXh0dXJlO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxyXG4gICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcclxuICAgICAgICAgICAgZ2xbICdDT0xPUl9BVFRBQ0hNRU5UJyArIGluZGV4IF0sXHJcbiAgICAgICAgICAgIGdsWyB0YXJnZXQgfHwgJ1RFWFRVUkVfMkQnIF0sXHJcbiAgICAgICAgICAgIHRleHR1cmUudGV4dHVyZSxcclxuICAgICAgICAgICAgMCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgdGV4dHVyZSB0byBhdHRhY2guXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5zZXREZXB0aFRhcmdldCA9IGZ1bmN0aW9uKCB0ZXh0dXJlICkge1xyXG4gICAgICAgIGlmICggIXRleHR1cmUgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIGFyZ3VtZW50IGlzIG1pc3NpbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoICFERVBUSF9GT1JNQVRTWyB0ZXh0dXJlLmZvcm1hdCBdICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgdGV4dHVyZSBpcyBub3Qgb2YgZm9ybWF0IGBERVBUSF9DT01QT05FTlRgIG9yIGBERVBUSF9TVEVOQ0lMYCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlcy5kZXB0aCA9IHRleHR1cmU7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXHJcbiAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxyXG4gICAgICAgICAgICBnbC5ERVBUSF9BVFRBQ0hNRU5ULFxyXG4gICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICB0ZXh0dXJlLnRleHR1cmUsXHJcbiAgICAgICAgICAgIDAgKTtcclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2l6ZXMgdGhlIHJlbmRlclRhcmdldCBhbmQgYWxsIGF0dGFjaGVkIHRleHR1cmVzIGJ5IHRoZSBwcm92aWRlZCBoZWlnaHQgYW5kIHdpZHRoLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSBuZXcgd2lkdGggb2YgdGhlIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgbmV3IGhlaWdodCBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgaWYgKCB0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8ICggd2lkdGggPD0gMCApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHdpZHRoYCBvZiAnICsgd2lkdGggKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8ICggaGVpZ2h0IDw9IDAgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGBoZWlnaHRgIG9mICcgKyBoZWlnaHQgKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGV4dHVyZXMgPSB0aGlzLnRleHR1cmVzO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKCB0ZXh0dXJlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XHJcbiAgICAgICAgICAgIHRleHR1cmVzWyBrZXkgXS5yZXNpemUoIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJUYXJnZXQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgVmVydGV4UGFja2FnZSA9IHJlcXVpcmUoJy4uL2NvcmUvVmVydGV4UGFja2FnZScpO1xyXG4gICAgdmFyIFZlcnRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uL2NvcmUvVmVydGV4QnVmZmVyJyk7XHJcbiAgICB2YXIgSW5kZXhCdWZmZXIgPSByZXF1aXJlKCcuLi9jb3JlL0luZGV4QnVmZmVyJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCBhdHRyaWJ1dGUgcG9pbnRlcnMgYW5kIHRocm93cyBhbiBleGNlcHRpb24gaWYgYW4gaW5kZXhcclxuICAgICAqIG9jY3VycyBtcm9lIHRoYW4gb25jZS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGV4QnVmZmVycyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXhCdWZmZXJzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjaGVja0luZGV4Q29sbGlzaW9ucyggdmVydGV4QnVmZmVycyApIHtcclxuICAgICAgICB2YXIgaW5kaWNlcyA9IHt9O1xyXG4gICAgICAgIHZlcnRleEJ1ZmZlcnMuZm9yRWFjaCggZnVuY3Rpb24oIGJ1ZmZlciApIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoIGJ1ZmZlci5wb2ludGVycyApLmZvckVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbIGluZGV4IF0gPSBpbmRpY2VzWyBpbmRleCBdIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzWyBpbmRleCBdKys7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKCBpbmRpY2VzICkuZm9yRWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICBpZiAoIGluZGljZXNbIGluZGV4IF0gPiAxICkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ01vcmUgdGhhbiBvbmUgYXR0cmlidXRlIHBvaW50ZXIgZXhpc3RzIGZvciBpbmRleCAnICsgaW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhbiBSZW5kZXJhYmxlIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBSZW5kZXJhYmxlXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgY29udGFpbmVyIGZvciBvbmUgb3IgbW9yZSBWZXJ0ZXhCdWZmZXJzIGFuZCBhbiBvcHRpb25hbCBJbmRleEJ1ZmZlci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSByZW5kZXJhYmxlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl9IHNwZWMudmVydGljZXMgLSBUaGUgdmVydGljZXMgdG8gaW50ZXJsZWF2ZSBhbmQgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtWZXJ0ZXhCdWZmZXJ9IHNwZWMudmVydGV4QnVmZmVyIC0gQW4gZXhpc3RpbmcgdmVydGV4IGJ1ZmZlciB0byB1c2UuXHJcbiAgICAgKiBAcGFyYW0ge1ZlcnRleEJ1ZmZlcltdfSBzcGVjLnZlcnRleEJ1ZmZlcnMgLSBNdWx0aXBsZSB2ZXJ0ZXggYnVmZmVycyB0byB1c2UuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fSBzcGVjLmluZGljZXMgLSBUaGUgaW5kaWNlcyB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge0luZGV4QnVmZmVyfSBzcGVjLmluZGV4YnVmZmVyIC0gQW4gZXhpc3RpbmcgaW5kZXggYnVmZmVyIHRvIHVzZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5vZmZzZXQgLSBUaGUgb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBSZW5kZXJhYmxlKCBzcGVjICkge1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIGlmICggc3BlYy52ZXJ0ZXhCdWZmZXIgfHwgc3BlYy52ZXJ0ZXhCdWZmZXJzICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgdmVydGV4IGJ1ZmZlclxyXG4gICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBzcGVjLnZlcnRleEJ1ZmZlcnMgfHwgWyBzcGVjLnZlcnRleEJ1ZmZlciBdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNwZWMudmVydGljZXMgKSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB2ZXJ0ZXggcGFja2FnZVxyXG4gICAgICAgICAgICB2YXIgdmVydGV4UGFja2FnZSA9IG5ldyBWZXJ0ZXhQYWNrYWdlKCBzcGVjLnZlcnRpY2VzICk7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB2ZXJ0ZXggYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IFsgbmV3IFZlcnRleEJ1ZmZlciggdmVydGV4UGFja2FnZSApIF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy5pbmRleEJ1ZmZlciApIHtcclxuICAgICAgICAgICAgLy8gdXNlIGV4aXN0aW5nIGluZGV4IGJ1ZmZlclxyXG4gICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gc3BlYy5pbmRleEJ1ZmZlcjtcclxuICAgICAgICB9IGVsc2UgaWYgKCBzcGVjLmluZGljZXMgKSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBpbmRleCBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlciggc3BlYy5pbmRpY2VzICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNoZWNrIHRoYXQgbm8gYXR0cmlidXRlIGluZGljZXMgY2xhc2hcclxuICAgICAgICBjaGVja0luZGV4Q29sbGlzaW9ucyggdGhpcy52ZXJ0ZXhCdWZmZXJzICk7XHJcbiAgICAgICAgLy8gc3RvcmUgcmVuZGVyaW5nIG9wdGlvbnNcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIG1vZGU6IHNwZWMubW9kZSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBzcGVjLm9mZnNldCxcclxuICAgICAgICAgICAgY291bnQ6IHNwZWMuY291bnRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSB0aGUgZHJhdyBjb21tYW5kIGZvciB0aGUgdW5kZXJseWluZyBidWZmZXJzLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlcmFibGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIHBhc3MgdG8gJ2RyYXdFbGVtZW50cycuIE9wdGlvbmFsLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm9mZnNldCAtIFRoZSBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlcmFibGV9IFJldHVybnMgdGhlIHJlbmRlcmFibGUgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyYWJsZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG4gICAgICAgIHZhciBvdmVycmlkZXMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIC8vIG92ZXJyaWRlIG9wdGlvbnMgaWYgcHJvdmlkZWRcclxuICAgICAgICBvdmVycmlkZXMubW9kZSA9IG92ZXJyaWRlcy5tb2RlIHx8IHRoaXMub3B0aW9ucy5tb2RlO1xyXG4gICAgICAgIG92ZXJyaWRlcy5vZmZzZXQgPSAoIG92ZXJyaWRlcy5vZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3ZlcnJpZGVzLm9mZnNldCA6IHRoaXMub3B0aW9ucy5vZmZzZXQ7XHJcbiAgICAgICAgb3ZlcnJpZGVzLmNvdW50ID0gKCBvdmVycmlkZXMuY291bnQgIT09IHVuZGVmaW5lZCApID8gb3ZlcnJpZGVzLmNvdW50IDogdGhpcy5vcHRpb25zLmNvdW50O1xyXG4gICAgICAgIC8vIGRyYXcgdGhlIHJlbmRlcmFibGVcclxuICAgICAgICBpZiAoIHRoaXMuaW5kZXhCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSBpbmRleCBidWZmZXIgdG8gZHJhdyBlbGVtZW50c1xyXG4gICAgICAgICAgICAvLyBiaW5kIHZlcnRleCBidWZmZXJzIGFuZCBlbmFibGUgYXR0cmlidXRlIHBvaW50ZXJzXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLmJpbmQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIGRyYXcgcHJpbWl0aXZlcyB1c2luZyBpbmRleCBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlci5kcmF3KCBvdmVycmlkZXMgKTtcclxuICAgICAgICAgICAgLy8gZGlzYWJsZSBhdHRyaWJ1dGUgcG9pbnRlcnNcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzLmZvckVhY2goIGZ1bmN0aW9uKCB2ZXJ0ZXhCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIudW5iaW5kKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBubyBhZHZhbnRhZ2UgdG8gdW5iaW5kaW5nIGFzIHRoZXJlIGlzIG5vIHN0YWNrIHVzZWRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBubyBpbmRleCBidWZmZXIsIHVzZSBkcmF3IGFycmF5c1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCggZnVuY3Rpb24oIHZlcnRleEJ1ZmZlciApIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5iaW5kKCk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuZHJhdyggb3ZlcnJpZGVzICk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIudW5iaW5kKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJhYmxlO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuICAgIHZhciBTaGFkZXJQYXJzZXIgPSByZXF1aXJlKCcuL1NoYWRlclBhcnNlcicpO1xuICAgIHZhciBXZWJHTENvbnRleHRTdGF0ZSA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0U3RhdGUnKTtcbiAgICB2YXIgQXN5bmMgPSByZXF1aXJlKCcuLi91dGlsL0FzeW5jJyk7XG4gICAgdmFyIFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvWEhSTG9hZGVyJyk7XG4gICAgdmFyIFVOSUZPUk1fRlVOQ1RJT05TID0ge1xuICAgICAgICAnYm9vbCc6ICd1bmlmb3JtMWknLFxuICAgICAgICAnYm9vbFtdJzogJ3VuaWZvcm0xaXYnLFxuICAgICAgICAnZmxvYXQnOiAndW5pZm9ybTFmJyxcbiAgICAgICAgJ2Zsb2F0W10nOiAndW5pZm9ybTFmdicsXG4gICAgICAgICdpbnQnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ2ludFtdJzogJ3VuaWZvcm0xaXYnLFxuICAgICAgICAndWludCc6ICd1bmlmb3JtMWknLFxuICAgICAgICAndWludFtdJzogJ3VuaWZvcm0xaXYnLFxuICAgICAgICAndmVjMic6ICd1bmlmb3JtMmZ2JyxcbiAgICAgICAgJ3ZlYzJbXSc6ICd1bmlmb3JtMmZ2JyxcbiAgICAgICAgJ2l2ZWMyJzogJ3VuaWZvcm0yaXYnLFxuICAgICAgICAnaXZlYzJbXSc6ICd1bmlmb3JtMml2JyxcbiAgICAgICAgJ3ZlYzMnOiAndW5pZm9ybTNmdicsXG4gICAgICAgICd2ZWMzW10nOiAndW5pZm9ybTNmdicsXG4gICAgICAgICdpdmVjMyc6ICd1bmlmb3JtM2l2JyxcbiAgICAgICAgJ2l2ZWMzW10nOiAndW5pZm9ybTNpdicsXG4gICAgICAgICd2ZWM0JzogJ3VuaWZvcm00ZnYnLFxuICAgICAgICAndmVjNFtdJzogJ3VuaWZvcm00ZnYnLFxuICAgICAgICAnaXZlYzQnOiAndW5pZm9ybTRpdicsXG4gICAgICAgICdpdmVjNFtdJzogJ3VuaWZvcm00aXYnLFxuICAgICAgICAnbWF0Mic6ICd1bmlmb3JtTWF0cml4MmZ2JyxcbiAgICAgICAgJ21hdDJbXSc6ICd1bmlmb3JtTWF0cml4MmZ2JyxcbiAgICAgICAgJ21hdDMnOiAndW5pZm9ybU1hdHJpeDNmdicsXG4gICAgICAgICdtYXQzW10nOiAndW5pZm9ybU1hdHJpeDNmdicsXG4gICAgICAgICdtYXQ0JzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuICAgICAgICAnbWF0NFtdJzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuICAgICAgICAnc2FtcGxlcjJEJzogJ3VuaWZvcm0xaScsXG4gICAgICAgICdzYW1wbGVyQ3ViZSc6ICd1bmlmb3JtMWknXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgbWFwIG9mIGV4aXN0aW5nIGF0dHJpYnV0ZXMsIGZpbmQgdGhlIGxvd2VzdCBpbmRleCB0aGF0IGlzIG5vdFxuICAgICAqIGFscmVhZHkgdXNlZC4gSWYgdGhlIGF0dHJpYnV0ZSBvcmRlcmluZyB3YXMgYWxyZWFkeSBwcm92aWRlZCwgdXNlIHRoYXRcbiAgICAgKiBpbnN0ZWFkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBleGlzdGluZyBhdHRyaWJ1dGVzIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVjbGFyYXRpb24gLSBUaGUgYXR0cmlidXRlIGRlY2xhcmF0aW9uIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhdHRyaWJ1dGUgaW5kZXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXR0cmlidXRlSW5kZXgoIGF0dHJpYnV0ZXMsIGRlY2xhcmF0aW9uICkge1xuICAgICAgICAvLyBjaGVjayBpZiBhdHRyaWJ1dGUgaXMgYWxyZWFkeSBkZWNsYXJlZCwgaWYgc28sIHVzZSB0aGF0IGluZGV4XG4gICAgICAgIGlmICggYXR0cmlidXRlc1sgZGVjbGFyYXRpb24ubmFtZSBdICkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNbIGRlY2xhcmF0aW9uLm5hbWUgXS5pbmRleDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gbmV4dCBhdmFpbGFibGUgaW5kZXhcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKCBhdHRyaWJ1dGVzICkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZSwgcGFyc2VzIHRoZSBkZWNsYXJhdGlvbnMgYW5kIGFwcGVuZHMgaW5mb3JtYXRpb24gcGVydGFpbmluZyB0byB0aGUgdW5pZm9ybXMgYW5kIGF0dHJpYnR1ZXMgZGVjbGFyZWQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgc2hhZGVyIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmVydFNvdXJjZSAtIFRoZSB2ZXJ0ZXggc2hhZGVyIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZnJhZ1NvdXJjZSAtIFRoZSBmcmFnbWVudCBzaGFkZXIgc291cmNlLlxuICAgICAqXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXMoIHNoYWRlciwgdmVydFNvdXJjZSwgZnJhZ1NvdXJjZSApIHtcbiAgICAgICAgdmFyIGRlY2xhcmF0aW9ucyA9IFNoYWRlclBhcnNlci5wYXJzZURlY2xhcmF0aW9ucyhcbiAgICAgICAgICAgIFsgdmVydFNvdXJjZSwgZnJhZ1NvdXJjZSBdLFxuICAgICAgICAgICAgWyAndW5pZm9ybScsICdhdHRyaWJ1dGUnIF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gZm9yIGVhY2ggZGVjbGFyYXRpb24gaW4gdGhlIHNoYWRlclxuICAgICAgICBkZWNsYXJhdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGRlY2xhcmF0aW9uICkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXRzIGFuIGF0dHJpYnV0ZSBvciB1bmlmb3JtXG4gICAgICAgICAgICBpZiAoIGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ2F0dHJpYnV0ZScgKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgYXR0cmlidXRlLCBzdG9yZSB0eXBlIGFuZCBpbmRleFxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGdldEF0dHJpYnV0ZUluZGV4KCBzaGFkZXIuYXR0cmlidXRlcywgZGVjbGFyYXRpb24gKTtcbiAgICAgICAgICAgICAgICBzaGFkZXIuYXR0cmlidXRlc1sgZGVjbGFyYXRpb24ubmFtZSBdID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBkZWNsYXJhdGlvbi50eXBlLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmICggZGVjbGFyYXRpb24ucXVhbGlmaWVyID09PSAndW5pZm9ybScgKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdW5pZm9ybSwgc3RvcmUgdHlwZSBhbmQgYnVmZmVyIGZ1bmN0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICBzaGFkZXIudW5pZm9ybXNbIGRlY2xhcmF0aW9uLm5hbWUgXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZnVuYzogVU5JRk9STV9GVU5DVElPTlNbIGRlY2xhcmF0aW9uLnR5cGUgKyAoZGVjbGFyYXRpb24uY291bnQgPiAxID8gJ1tdJyA6ICcnKSBdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBzaGFkZXIgc291cmNlIHN0cmluZyBhbmQgc2hhZGVyIHR5cGUsIGNvbXBpbGVzIHRoZSBzaGFkZXIgYW5kIHJldHVybnMgdGhlIHJlc3VsdGluZyBXZWJHTFNoYWRlciBvYmplY3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBnbCAtIFRoZSB3ZWJnbCByZW5kZXJpbmcgY29udGV4dC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2hhZGVyU291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgc2hhZGVyIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7V2ViR0xTaGFkZXJ9IFRoZSBjb21waWxlZCBzaGFkZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBpbGVTaGFkZXIoIGdsLCBzaGFkZXJTb3VyY2UsIHR5cGUgKSB7XG4gICAgICAgIHZhciBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoIGdsWyB0eXBlIF0gKTtcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKCBzaGFkZXIsIHNoYWRlclNvdXJjZSApO1xuICAgICAgICBnbC5jb21waWxlU2hhZGVyKCBzaGFkZXIgKTtcbiAgICAgICAgaWYgKCAhZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKCBzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTICkgKSB7XG4gICAgICAgICAgICB0aHJvdyAnQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOlxcbicgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKCBzaGFkZXIgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2hhZGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25zIGZvciB0aGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoIHNoYWRlciApIHtcbiAgICAgICAgdmFyIGdsID0gc2hhZGVyLmdsO1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHNoYWRlci5hdHRyaWJ1dGVzO1xuICAgICAgICBPYmplY3Qua2V5cyggYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAgICAgICAvLyBiaW5kIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25cbiAgICAgICAgICAgIGdsLmJpbmRBdHRyaWJMb2NhdGlvbihcbiAgICAgICAgICAgICAgICBzaGFkZXIucHJvZ3JhbSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzWyBrZXkgXS5pbmRleCxcbiAgICAgICAgICAgICAgICBrZXkgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVlcmllcyB0aGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQgZm9yIHRoZSB1bmlmb3JtIGxvY2F0aW9ucy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFVuaWZvcm1Mb2NhdGlvbnMoIHNoYWRlciApIHtcbiAgICAgICAgdmFyIGdsID0gc2hhZGVyLmdsO1xuICAgICAgICB2YXIgdW5pZm9ybXMgPSBzaGFkZXIudW5pZm9ybXM7XG4gICAgICAgIE9iamVjdC5rZXlzKCB1bmlmb3JtcyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIHVuaWZvcm0gbG9jYXRpb25cbiAgICAgICAgICAgIHVuaWZvcm1zWyBrZXkgXS5sb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbiggc2hhZGVyLnByb2dyYW0sIGtleSApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBzaGFkZXIgc291cmNlIGZyb20gYSB1cmwuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIGxvYWQgdGhlIHJlc291cmNlIGZyb20uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBsb2FkIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRTaGFkZXJTb3VyY2UoIHVybCApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xuICAgICAgICAgICAgWEhSTG9hZGVyLmxvYWQoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXMgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoIG51bGwsIHJlcyApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBlcnIgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoIGVyciwgbnVsbCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBwYXNzIHRocm91Z2ggdGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgc291cmNlIG9mIHRoZSBzaGFkZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBwYXNzIHRocm91Z2ggdGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFzc1Rocm91Z2hTb3VyY2UoIHNvdXJjZSApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xuICAgICAgICAgICAgZG9uZSggbnVsbCwgc291cmNlICk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYW4gYXJyYXkgb2YgR0xTTCBzb3VyY2Ugc3RyaW5ncyBhbmQgVVJMcywgYW5kIHJlc29sdmVzIHRoZW0gaW50byBhbmQgYXJyYXkgb2YgR0xTTCBzb3VyY2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZXMgLSBUaGUgc2hhZGVyIHNvdXJjZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyAtIEEgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgc2hhZGVyIHNvdXJjZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVNvdXJjZXMoIHNvdXJjZXMgKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcbiAgICAgICAgICAgIHZhciBqb2JzID0gW107XG4gICAgICAgICAgICBzb3VyY2VzID0gc291cmNlcyB8fCBbXTtcbiAgICAgICAgICAgIHNvdXJjZXMgPSAoICEoIHNvdXJjZXMgaW5zdGFuY2VvZiBBcnJheSApICkgPyBbIHNvdXJjZXMgXSA6IHNvdXJjZXM7XG4gICAgICAgICAgICBzb3VyY2VzLmZvckVhY2goIGZ1bmN0aW9uKCBzb3VyY2UgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBTaGFkZXJQYXJzZXIuaXNHTFNMKCBzb3VyY2UgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgam9icy5wdXNoKCBwYXNzVGhyb3VnaFNvdXJjZSggc291cmNlICkgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goIGxvYWRTaGFkZXJTb3VyY2UoIHNvdXJjZSApICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBBc3luYy5wYXJhbGxlbCggam9icywgZG9uZSApO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIHNoYWRlciBwcm9ncmFtIG9iamVjdCBmcm9tIHNvdXJjZSBzdHJpbmdzLiBUaGlzIGluY2x1ZGVzOlxuICAgICAqICAgIDEpIENvbXBpbGluZyBhbmQgbGlua2luZyB0aGUgc2hhZGVyIHByb2dyYW0uXG4gICAgICogICAgMikgUGFyc2luZyBzaGFkZXIgc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXG4gICAgICogICAgMykgQmluZGluZyBhdHRyaWJ1dGUgbG9jYXRpb25zLCBieSBvcmRlciBvZiBkZWxjYXJhdGlvbi5cbiAgICAgKiAgICA0KSBRdWVyeWluZyBhbmQgc3RvcmluZyB1bmlmb3JtIGxvY2F0aW9uLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZXMgLSBBIG1hcCBjb250YWluaW5nIHNvdXJjZXMgdW5kZXIgJ3ZlcnQnIGFuZCAnZnJhZycgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlUHJvZ3JhbSggc2hhZGVyLCBzb3VyY2VzICkge1xuICAgICAgICB2YXIgZ2wgPSBzaGFkZXIuZ2w7XG4gICAgICAgIHZhciBjb21tb24gPSBzb3VyY2VzLmNvbW1vbi5qb2luKCAnJyApO1xuICAgICAgICB2YXIgdmVydCA9IHNvdXJjZXMudmVydC5qb2luKCAnJyApO1xuICAgICAgICB2YXIgZnJhZyA9IHNvdXJjZXMuZnJhZy5qb2luKCAnJyApO1xuICAgICAgICAvLyBjb21waWxlIHNoYWRlcnNcbiAgICAgICAgdmFyIHZlcnRleFNoYWRlciA9IGNvbXBpbGVTaGFkZXIoIGdsLCBjb21tb24gKyB2ZXJ0LCAnVkVSVEVYX1NIQURFUicgKTtcbiAgICAgICAgdmFyIGZyYWdtZW50U2hhZGVyID0gY29tcGlsZVNoYWRlciggZ2wsIGNvbW1vbiArIGZyYWcsICdGUkFHTUVOVF9TSEFERVInICk7XG4gICAgICAgIC8vIHBhcnNlIHNvdXJjZSBmb3IgYXR0cmlidXRlIGFuZCB1bmlmb3Jtc1xuICAgICAgICBzZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXMoIHNoYWRlciwgdmVydCwgZnJhZyApO1xuICAgICAgICAvLyBjcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXG4gICAgICAgIHNoYWRlci5wcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgICAgICAvLyBhdHRhY2ggdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXJzXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlciggc2hhZGVyLnByb2dyYW0sIHZlcnRleFNoYWRlciApO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoIHNoYWRlci5wcm9ncmFtLCBmcmFnbWVudFNoYWRlciApO1xuICAgICAgICAvLyBiaW5kIHZlcnRleCBhdHRyaWJ1dGUgbG9jYXRpb25zIEJFRk9SRSBsaW5raW5nXG4gICAgICAgIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoIHNoYWRlciApO1xuICAgICAgICAvLyBsaW5rIHNoYWRlclxuICAgICAgICBnbC5saW5rUHJvZ3JhbSggc2hhZGVyLnByb2dyYW0gKTtcbiAgICAgICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcbiAgICAgICAgaWYgKCAhZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlciggc2hhZGVyLnByb2dyYW0sIGdsLkxJTktfU1RBVFVTICkgKSB7XG4gICAgICAgICAgICB0aHJvdyAnQW4gZXJyb3Igb2NjdXJlZCBsaW5raW5nIHRoZSBzaGFkZXI6XFxuJyArIGdsLmdldFByb2dyYW1JbmZvTG9nKCBzaGFkZXIucHJvZ3JhbSApO1xuICAgICAgICB9XG4gICAgICAgIC8vIGdldCBzaGFkZXIgdW5pZm9ybSBsb2NhdGlvbnNcbiAgICAgICAgZ2V0VW5pZm9ybUxvY2F0aW9ucyggc2hhZGVyICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVzIGEgU2hhZGVyIG9iamVjdC5cbiAgICAgKiBAY2xhc3MgU2hhZGVyXG4gICAgICogQGNsYXNzZGVzYyBBIHNoYWRlciBjbGFzcyB0byBhc3Npc3QgaW4gY29tcGlsaW5nIGFuZCBsaW5raW5nIHdlYmdsXG4gICAgICogc2hhZGVycywgc3RvcmluZyBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gbG9jYXRpb25zLCBhbmQgYnVmZmVyaW5nIHVuaWZvcm1zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc2hhZGVyIHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfE9iamVjdH0gc3BlYy5jb21tb24gLSBTb3VyY2VzIC8gVVJMcyB0byBiZSBzaGFyZWQgYnkgYm90aCB2dmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXJzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfE9iamVjdH0gc3BlYy52ZXJ0IC0gVGhlIHZlcnRleCBzaGFkZXIgc291cmNlcyAvIFVSTHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmZyYWcgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZXMgLyBVUkxzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nW119IHNwZWMuYXR0cmlidXRlcyAtIFRoZSBhdHRyaWJ1dGUgaW5kZXggb3JkZXJpbmdzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb25jZSB0aGUgc2hhZGVyXG4gICAgICogICAgIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBjb21waWxlZCBhbmQgbGlua2VkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFNoYWRlciggc3BlYywgY2FsbGJhY2sgKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XG4gICAgICAgIC8vIGNoZWNrIHNvdXJjZSBhcmd1bWVudHNcbiAgICAgICAgaWYgKCAhc3BlYy52ZXJ0ICkge1xuICAgICAgICAgICAgdGhyb3cgJ1ZlcnRleCBzaGFkZXIgYXJndW1lbnQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoICFzcGVjLmZyYWcgKSB7XG4gICAgICAgICAgICB0aHJvdyAnRnJhZ21lbnQgc2hhZGVyIGFyZ3VtZW50IGhhcyBub3QgYmVlbiBwcm92aWRlZCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9ncmFtID0gMDtcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFdlYkdMQ29udGV4dFN0YXRlLmdldCggdGhpcy5nbCApO1xuICAgICAgICB0aGlzLnZlcnNpb24gPSBzcGVjLnZlcnNpb24gfHwgJzEuMDAnO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy51bmlmb3JtcyA9IHt9O1xuICAgICAgICAvLyBpZiBhdHRyaWJ1dGUgb3JkZXJpbmcgaXMgcHJvdmlkZWQsIHVzZSB0aG9zZSBpbmRpY2VzXG4gICAgICAgIGlmICggc3BlYy5hdHRyaWJ1dGVzICkge1xuICAgICAgICAgICAgc3BlYy5hdHRyaWJ1dGVzLmZvckVhY2goIGZ1bmN0aW9uKCBhdHRyLCBpbmRleCApIHtcbiAgICAgICAgICAgICAgICB0aGF0LmF0dHJpYnV0ZXNbIGF0dHIgXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgc2hhZGVyXG4gICAgICAgIEFzeW5jLnBhcmFsbGVsKHtcbiAgICAgICAgICAgIGNvbW1vbjogcmVzb2x2ZVNvdXJjZXMoIHNwZWMuY29tbW9uICksXG4gICAgICAgICAgICB2ZXJ0OiByZXNvbHZlU291cmNlcyggc3BlYy52ZXJ0ICksXG4gICAgICAgICAgICBmcmFnOiByZXNvbHZlU291cmNlcyggc3BlYy5mcmFnICksXG4gICAgICAgIH0sIGZ1bmN0aW9uKCBlcnIsIHNvdXJjZXMgKSB7XG4gICAgICAgICAgICBpZiAoIGVyciApIHtcbiAgICAgICAgICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggZXJyLCBudWxsICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG9uY2UgYWxsIHNoYWRlciBzb3VyY2VzIGFyZSBsb2FkZWRcbiAgICAgICAgICAgIGNyZWF0ZVByb2dyYW0oIHRoYXQsIHNvdXJjZXMgKTtcbiAgICAgICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIG51bGwsIHRoYXQgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgdGhlIHNoYWRlciBvYmplY3QgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIHN0YWNrLlxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgU2hhZGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGlmIHRoaXMgc2hhZGVyIGlzIGFscmVhZHkgYm91bmQsIG5vIG5lZWQgdG8gcmViaW5kXG4gICAgICAgIGlmICggdGhpcy5zdGF0ZS5zaGFkZXJzLnRvcCgpICE9PSB0aGlzICkge1xuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKCB0aGlzLnByb2dyYW0gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlLnNoYWRlcnMucHVzaCggdGhpcyApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVW5iaW5kcyB0aGUgc2hhZGVyIG9iamVjdCBhbmQgYmluZHMgdGhlIHNoYWRlciBiZW5lYXRoIGl0IG9uIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgc2hhZGVyLCBiaW5kIHRoZSBiYWNrYnVmZmVyLlxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgU2hhZGVyLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gc2hhZGVyIGJvdW5kLCBleGl0IGVhcmx5XG4gICAgICAgIGlmICggc3RhdGUuc2hhZGVycy50b3AoKSAhPT0gdGhpcyApIHtcbiAgICAgICAgICAgIHRocm93ICdTaGFkZXIgaXMgbm90IHRoZSB0b3AgbW9zdCBlbGVtZW50IG9uIHRoZSBzdGFjayc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcG9wIHNoYWRlciBvZmYgc3RhY2tcbiAgICAgICAgc3RhdGUuc2hhZGVycy5wb3AoKTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gdW5kZXJseWluZyBzaGFkZXIsIGJpbmQgaXRcbiAgICAgICAgdmFyIHRvcCA9IHN0YXRlLnNoYWRlcnMudG9wKCk7XG4gICAgICAgIGlmICggdG9wICYmIHRvcCAhPT0gdGhpcyApIHtcbiAgICAgICAgICAgIHRvcC5nbC51c2VQcm9ncmFtKCB0b3AucHJvZ3JhbSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdW5iaW5kIHRoZSBzaGFkZXJcbiAgICAgICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSggbnVsbCApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBCdWZmZXIgYSB1bmlmb3JtIHZhbHVlIGJ5IG5hbWUuXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgdW5pZm9ybSBuYW1lIGluIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdW5pZm9ybSB2YWx1ZSB0byBidWZmZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybSA9IGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApIHtcbiAgICAgICAgLy8gZW5zdXJlIHNoYWRlciBpcyBib3VuZFxuICAgICAgICBpZiAoIHRoaXMgIT09IHRoaXMuc3RhdGUuc2hhZGVycy50b3AoKSApIHtcbiAgICAgICAgICAgIHRocm93ICdBdHRlbXB0aW5nIHRvIHNldCB1bmlmb3JtIGAnICsgbmFtZSArICdgIGZvciBhbiB1bmJvdW5kIHNoYWRlcic7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVuaWZvcm0gPSB0aGlzLnVuaWZvcm1zWyBuYW1lIF07XG4gICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZSB1bmlmb3JtIHNwZWMgZXhpc3RzIGZvciB0aGUgbmFtZVxuICAgICAgICBpZiAoICF1bmlmb3JtICkge1xuICAgICAgICAgICAgdGhyb3cgJ05vIHVuaWZvcm0gZm91bmQgdW5kZXIgbmFtZSBgJyArIG5hbWUgKyAnYCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZW5zdXJlIHRoYXQgdGhlIHVuaWZvcm0gYXJndW1lbnQgaXMgZGVmaW5lZFxuICAgICAgICBpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgcGFzc2VkIGZvciB1bmlmb3JtIGAnICsgbmFtZSArICdgIGlzIHVuZGVmaW5lZCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgdG9BcnJheSBmdW5jdGlvbiBpcyBwcmVzZW50LCBjb252ZXJ0IHRvIGFycmF5XG4gICAgICAgIGlmICggdmFsdWUudG9BcnJheSApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9BcnJheSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnZlcnQgQXJyYXkgdG8gRmxvYXQzMkFycmF5XG4gICAgICAgIGlmICggdmFsdWUgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmV3IEZsb2F0MzJBcnJheSggdmFsdWUgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb252ZXJ0IGJvb2xlYW4ncyB0byAwIG9yIDFcbiAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPyAxIDogMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBwYXNzIHRoZSBhcmd1bWVudHMgZGVwZW5kaW5nIG9uIHRoZSB0eXBlXG4gICAgICAgIHN3aXRjaCAoIHVuaWZvcm0udHlwZSApIHtcbiAgICAgICAgICAgIGNhc2UgJ21hdDInOlxuICAgICAgICAgICAgY2FzZSAnbWF0Myc6XG4gICAgICAgICAgICBjYXNlICdtYXQ0JzpcbiAgICAgICAgICAgICAgICB0aGlzLmdsWyB1bmlmb3JtLmZ1bmMgXSggdW5pZm9ybS5sb2NhdGlvbiwgZmFsc2UsIHZhbHVlICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuZ2xbIHVuaWZvcm0uZnVuYyBdKCB1bmlmb3JtLmxvY2F0aW9uLCB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNoYWRlcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBQUkVDSVNJT05fUVVBTElGSUVSUyA9IHtcclxuICAgICAgICBoaWdocDogdHJ1ZSxcclxuICAgICAgICBtZWRpdW1wOiB0cnVlLFxyXG4gICAgICAgIGxvd3A6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFBSRUNJU0lPTl9UWVBFUyA9IHtcclxuICAgICAgICBmbG9hdDogJ2Zsb2F0JyxcclxuICAgICAgICB2ZWMyOiAnZmxvYXQnLFxyXG4gICAgICAgIHZlYzM6ICdmbG9hdCcsXHJcbiAgICAgICAgdmVjNDogJ2Zsb2F0JyxcclxuICAgICAgICBpdmVjMjogJ2ludCcsXHJcbiAgICAgICAgaXZlYzM6ICdpbnQnLFxyXG4gICAgICAgIGl2ZWM0OiAnaW50JyxcclxuICAgICAgICBpbnQ6ICdpbnQnLFxyXG4gICAgICAgIHVpbnQ6ICdpbnQnLFxyXG4gICAgICAgIHNhbXBsZXIyRDogJ3NhbXBsZXIyRCcsXHJcbiAgICAgICAgc2FtcGxlckN1YmU6ICdzYW1wbGVyQ3ViZScsXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBDT01NRU5UU19SRUdFWFAgPSAvKFxcL1xcKihbXFxzXFxTXSo/KVxcKlxcLyl8KFxcL1xcLyguKikkKS9nbTtcclxuICAgIHZhciBFTkRMSU5FX1JFR0VYUCA9IC8oXFxyXFxufFxcbnxcXHIpL2dtO1xyXG4gICAgdmFyIFdISVRFU1BBQ0VfUkVHRVhQID0gL1xcc3syLH0vZztcclxuICAgIHZhciBCUkFDS0VUX1dISVRFU1BBQ0VfUkVHRVhQID0gLyhcXHMqKShcXFspKFxccyopKFxcZCspKFxccyopKFxcXSkoXFxzKikvZztcclxuICAgIHZhciBOQU1FX0NPVU5UX1JFR0VYUCA9IC8oW2EtekEtWl9dW2EtekEtWjAtOV9dKikoPzpcXFsoXFxkKylcXF0pPy87XHJcbiAgICB2YXIgUFJFQ0lTSU9OX1JFR0VYID0gL1xcYihwcmVjaXNpb24pXFxzKyhcXHcrKVxccysoXFx3KykvO1xyXG4gICAgdmFyIEdMU0xfUkVHRVhQID0gIC92b2lkXFxzK21haW5cXHMqXFwoXFxzKih2b2lkKSpcXHMqXFwpXFxzKi9taTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgc3RhbmRhcmQgY29tbWVudHMgZnJvbSB0aGUgcHJvdmlkZWQgc3RyaW5nLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzdHJpcCBjb21tZW50cyBmcm9tLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGNvbW1lbnRsZXNzIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc3RyaXBDb21tZW50cyggc3RyICkge1xyXG4gICAgICAgIC8vIHJlZ2V4IHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL21vYWdyaXVzL3N0cmlwY29tbWVudHNcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoIENPTU1FTlRTX1JFR0VYUCwgJycgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGFsbCB3aGl0ZXNwYWNlIGludG8gYSBzaW5nbGUgJyAnIHNwYWNlIGNoYXJhY3Rlci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gbm9ybWFsaXplIHdoaXRlc3BhY2UgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBub3JtYWxpemVkIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplV2hpdGVzcGFjZSggc3RyICkge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSggRU5ETElORV9SRUdFWFAsICcgJyApIC8vIHJlbW92ZSBsaW5lIGVuZGluZ3NcclxuICAgICAgICAgICAgLnJlcGxhY2UoIFdISVRFU1BBQ0VfUkVHRVhQLCAnICcgKSAvLyBub3JtYWxpemUgd2hpdGVzcGFjZSB0byBzaW5nbGUgJyAnXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCBCUkFDS0VUX1dISVRFU1BBQ0VfUkVHRVhQLCAnJDIkNCQ2JyApOyAvLyByZW1vdmUgd2hpdGVzcGFjZSBpbiBicmFja2V0c1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGFyc2VzIHRoZSBuYW1lIGFuZCBjb3VudCBvdXQgb2YgYSBuYW1lIHN0YXRlbWVudCwgcmV0dXJuaW5nIHRoZVxyXG4gICAgICogZGVjbGFyYXRpb24gb2JqZWN0LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcXVhbGlmaWVyIC0gVGhlIHF1YWxpZmllciBzdHJpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJlY2lzaW9uIC0gVGhlIHByZWNpc2lvbiBzdHJpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbnRyeSAtIFRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlTmFtZUFuZENvdW50KCBxdWFsaWZpZXIsIHByZWNpc2lvbiwgdHlwZSwgZW50cnkgKSB7XHJcbiAgICAgICAgLy8gZGV0ZXJtaW5lIG5hbWUgYW5kIHNpemUgb2YgdmFyaWFibGVcclxuICAgICAgICB2YXIgbWF0Y2hlcyA9IGVudHJ5Lm1hdGNoKCBOQU1FX0NPVU5UX1JFR0VYUCApO1xyXG4gICAgICAgIHZhciBuYW1lID0gbWF0Y2hlc1sxXTtcclxuICAgICAgICB2YXIgY291bnQgPSAoIG1hdGNoZXNbMl0gPT09IHVuZGVmaW5lZCApID8gMSA6IHBhcnNlSW50KCBtYXRjaGVzWzJdLCAxMCApO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHF1YWxpZmllcjogcXVhbGlmaWVyLFxyXG4gICAgICAgICAgICBwcmVjaXNpb246IHByZWNpc2lvbixcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgY291bnQ6IGNvdW50XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyBhIHNpbmdsZSAnc3RhdGVtZW50Jy4gQSAnc3RhdGVtZW50JyBpcyBjb25zaWRlcmVkIGFueSBzZXF1ZW5jZSBvZlxyXG4gICAgICogY2hhcmFjdGVycyBmb2xsb3dlZCBieSBhIHNlbWktY29sb24uIFRoZXJlZm9yZSwgYSBzaW5nbGUgJ3N0YXRlbWVudCcgaW5cclxuICAgICAqIHRoaXMgc2Vuc2UgY291bGQgY29udGFpbiBzZXZlcmFsIGNvbW1hIHNlcGFyYXRlZCBkZWNsYXJhdGlvbnMuIFJldHVybnNcclxuICAgICAqIGFsbCByZXN1bHRpbmcgZGVjbGFyYXRpb25zLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGVtZW50IC0gVGhlIHN0YXRlbWVudCB0byBwYXJzZS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcmVjaXNpb25zIC0gVGhlIGN1cnJlbnQgc3RhdGUgb2YgZ2xvYmFsIHByZWNpc2lvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcGFyc2VkIGRlY2xhcmF0aW9uIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlU3RhdGVtZW50KCBzdGF0ZW1lbnQsIHByZWNpc2lvbnMgKSB7XHJcbiAgICAgICAgLy8gc3BsaXQgc3RhdGVtZW50IG9uIGNvbW1hc1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gWyAndW5pZm9ybSBoaWdocCBtYXQ0IEFbMTBdJywgJ0InLCAnQ1syXScgXVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdmFyIGNvbW1hU3BsaXQgPSBzdGF0ZW1lbnQuc3BsaXQoJywnKS5tYXAoIGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbS50cmltKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHNwbGl0IGRlY2xhcmF0aW9uIGhlYWRlciBmcm9tIHN0YXRlbWVudFxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gWyAndW5pZm9ybScsICdoaWdocCcsICdtYXQ0JywgJ0FbMTBdJyBdXHJcbiAgICAgICAgLy9cclxuICAgICAgICB2YXIgaGVhZGVyID0gY29tbWFTcGxpdC5zaGlmdCgpLnNwbGl0KCcgJyk7XHJcblxyXG4gICAgICAgIC8vIHF1YWxpZmllciBpcyBhbHdheXMgZmlyc3QgZWxlbWVudFxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gJ3VuaWZvcm0nXHJcbiAgICAgICAgLy9cclxuICAgICAgICB2YXIgcXVhbGlmaWVyID0gaGVhZGVyLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgIC8vIHByZWNpc2lvbiBtYXkgb3IgbWF5IG5vdCBiZSBkZWNsYXJlZFxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gJ2hpZ2hwJyB8fCAoaWYgaXQgd2FzIG9taXRlZCkgJ21hdDQnXHJcbiAgICAgICAgLy9cclxuICAgICAgICB2YXIgcHJlY2lzaW9uID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgdmFyIHR5cGU7XHJcbiAgICAgICAgLy8gaWYgbm90IGEgcHJlY2lzaW9uIGtleXdvcmQgaXQgaXMgdGhlIHR5cGUgaW5zdGVhZFxyXG4gICAgICAgIGlmICggIVBSRUNJU0lPTl9RVUFMSUZJRVJTWyBwcmVjaXNpb24gXSApIHtcclxuICAgICAgICAgICAgdHlwZSA9IHByZWNpc2lvbjtcclxuICAgICAgICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uc1sgUFJFQ0lTSU9OX1RZUEVTWyB0eXBlIF0gXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0eXBlID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsYXN0IHBhcnQgb2YgaGVhZGVyIHdpbGwgYmUgdGhlIGZpcnN0LCBhbmQgcG9zc2libGUgb25seSB2YXJpYWJsZSBuYW1lXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBbICdBWzEwXScsICdCJywgJ0NbMl0nIF1cclxuICAgICAgICAvL1xyXG4gICAgICAgIHZhciBuYW1lcyA9IGhlYWRlci5jb25jYXQoIGNvbW1hU3BsaXQgKTtcclxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgb3RoZXIgbmFtZXMgYWZ0ZXIgYSAnLCcgYWRkIHRoZW0gYXMgd2VsbFxyXG4gICAgICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICAgICAgbmFtZXMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCggcGFyc2VOYW1lQW5kQ291bnQoIHF1YWxpZmllciwgcHJlY2lzaW9uLCB0eXBlLCBuYW1lICkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNwbGl0cyB0aGUgc291cmNlIHN0cmluZyBieSBzZW1pLWNvbG9ucyBhbmQgY29uc3RydWN0cyBhbiBhcnJheSBvZlxyXG4gICAgICogZGVjbGFyYXRpb24gb2JqZWN0cyBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgcXVhbGlmaWVyIGtleXdvcmRzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2Ugc3RyaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGtleXdvcmRzIC0gVGhlIHF1YWxpZmllciBkZWNsYXJhdGlvbiBrZXl3b3Jkcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBvZiBxdWFsaWZpZXIgZGVjbGFyYXRpb24gb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGFyc2VTb3VyY2UoIHNvdXJjZSwga2V5d29yZHMgKSB7XHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBjb21tZW50cyBmcm9tIHNvdXJjZVxyXG4gICAgICAgIHZhciBjb21tZW50bGVzc1NvdXJjZSA9IHN0cmlwQ29tbWVudHMoIHNvdXJjZSApO1xyXG4gICAgICAgIC8vIG5vcm1hbGl6ZSBhbGwgd2hpdGVzcGFjZSBpbiB0aGUgc291cmNlXHJcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWQgPSBub3JtYWxpemVXaGl0ZXNwYWNlKCBjb21tZW50bGVzc1NvdXJjZSApO1xyXG4gICAgICAgIC8vIGdldCBpbmRpdmlkdWFsIHN0YXRlbWVudHMgKCBhbnkgc2VxdWVuY2UgZW5kaW5nIGluIDsgKVxyXG4gICAgICAgIHZhciBzdGF0ZW1lbnRzID0gbm9ybWFsaXplZC5zcGxpdCgnOycpO1xyXG4gICAgICAgIC8vIGJ1aWxkIHJlZ2V4IGZvciBwYXJzaW5nIHN0YXRlbWVudHMgd2l0aCB0YXJnZXR0ZWQga2V5d29yZHNcclxuICAgICAgICB2YXIga2V5d29yZFN0ciA9IGtleXdvcmRzLmpvaW4oJ3wnKTtcclxuICAgICAgICB2YXIga2V5d29yZFJlZ2V4ID0gbmV3IFJlZ0V4cCggJy4qXFxcXGIoJyArIGtleXdvcmRTdHIgKyAnKVxcXFxiLionICk7XHJcbiAgICAgICAgLy8gcGFyc2UgYW5kIHN0b3JlIGdsb2JhbCBwcmVjaXNpb24gc3RhdGVtZW50cyBhbmQgYW55IGRlY2xhcmF0aW9uc1xyXG4gICAgICAgIHZhciBwcmVjaXNpb25zID0ge307XHJcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBbXTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBzdGF0ZW1lbnRcclxuICAgICAgICBzdGF0ZW1lbnRzLmZvckVhY2goIGZ1bmN0aW9uKCBzdGF0ZW1lbnQgKSB7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHByZWNpc2lvbiBzdGF0ZW1lbnRcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gWyAncHJlY2lzaW9uIGhpZ2hwIGZsb2F0JywgJ3ByZWNpc2lvbicsICdoaWdocCcsICdmbG9hdCcgXVxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB2YXIgcG1hdGNoID0gc3RhdGVtZW50Lm1hdGNoKCBQUkVDSVNJT05fUkVHRVggKTtcclxuICAgICAgICAgICAgaWYgKCBwbWF0Y2ggKSB7XHJcbiAgICAgICAgICAgICAgICBwcmVjaXNpb25zWyBwbWF0Y2hbM10gXSA9IHBtYXRjaFsyXTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjaGVjayBmb3Iga2V5d29yZHNcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gWyAndW5pZm9ybSBmbG9hdCB0aW1lJyBdXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIHZhciBrbWF0Y2ggPSBzdGF0ZW1lbnQubWF0Y2goIGtleXdvcmRSZWdleCApO1xyXG4gICAgICAgICAgICBpZiAoIGttYXRjaCApIHtcclxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHN0YXRlbWVudCBhbmQgYWRkIHRvIGFycmF5XHJcbiAgICAgICAgICAgICAgICBtYXRjaGVkID0gbWF0Y2hlZC5jb25jYXQoIHBhcnNlU3RhdGVtZW50KCBrbWF0Y2hbMF0sIHByZWNpc2lvbnMgKSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXJzIG91dCBkdXBsaWNhdGUgZGVjbGFyYXRpb25zIHByZXNlbnQgYmV0d2VlbiBzaGFkZXJzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBkZWNsYXJhdGlvbnMgLSBUaGUgYXJyYXkgb2YgZGVjbGFyYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGZpbHRlcmVkIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZmlsdGVyRHVwbGljYXRlc0J5TmFtZSggZGVjbGFyYXRpb25zICkge1xyXG4gICAgICAgIC8vIGluIGNhc2VzIHdoZXJlIHRoZSBzYW1lIGRlY2xhcmF0aW9ucyBhcmUgcHJlc2VudCBpbiBtdWx0aXBsZVxyXG4gICAgICAgIC8vIHNvdXJjZXMsIHRoaXMgZnVuY3Rpb24gd2lsbCByZW1vdmUgZHVwbGljYXRlcyBmcm9tIHRoZSByZXN1bHRzXHJcbiAgICAgICAgdmFyIHNlZW4gPSB7fTtcclxuICAgICAgICByZXR1cm4gZGVjbGFyYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGRlY2xhcmF0aW9uICkge1xyXG4gICAgICAgICAgICBpZiAoIHNlZW5bIGRlY2xhcmF0aW9uLm5hbWUgXSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWVuWyBkZWNsYXJhdGlvbi5uYW1lIF0gPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIHRoZSBwcm92aWRlZCBHTFNMIHNvdXJjZSwgYW5kIHJldHVybnMgYWxsIGRlY2xhcmF0aW9uIHN0YXRlbWVudHMgdGhhdCBjb250YWluIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIgdHlwZS4gVGhpcyBjYW4gYmUgdXNlZCB0byBleHRyYWN0IGFsbCBhdHRyaWJ1dGVzIGFuZCB1bmlmb3JtIG5hbWVzIGFuZCB0eXBlcyBmcm9tIGEgc2hhZGVyLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogRm9yIGV4YW1wbGUsIHdoZW4gcHJvdmlkZWQgYSAndW5pZm9ybScgcXVhbGlmaWVycywgdGhlIGRlY2xhcmF0aW9uOlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogICAgICd1bmlmb3JtIGhpZ2hwIHZlYzMgdVNwZWN1bGFyQ29sb3I7J1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV291bGQgYmUgcGFyc2VkIHRvOlxyXG4gICAgICAgICAqICAgICB7XHJcbiAgICAgICAgICogICAgICAgICBxdWFsaWZpZXI6ICd1bmlmb3JtJyxcclxuICAgICAgICAgKiAgICAgICAgIHR5cGU6ICd2ZWMzJyxcclxuICAgICAgICAgKiAgICAgICAgIG5hbWU6ICd1U3BlY3VsYXJDb2xvcicsXHJcbiAgICAgICAgICogICAgICAgICBjb3VudDogMVxyXG4gICAgICAgICAqICAgICB9XHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHNvdXJjZXMgLSBUaGUgc2hhZGVyIHNvdXJjZXMuXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHF1YWxpZmllcnMgLSBUaGUgcXVhbGlmaWVycyB0byBleHRyYWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIHN0YXRlbWVudHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcGFyc2VEZWNsYXJhdGlvbnM6IGZ1bmN0aW9uKCBzb3VyY2VzLCBxdWFsaWZpZXJzICkge1xyXG4gICAgICAgICAgICAvLyBpZiBubyBzb3VyY2VzIG9yIHF1YWxpZmllcnMgYXJlIHByb3ZpZGVkLCByZXR1cm4gZW1wdHkgYXJyYXlcclxuICAgICAgICAgICAgaWYgKCAhcXVhbGlmaWVycyB8fCBxdWFsaWZpZXJzLmxlbmd0aCA9PT0gMCB8fFxyXG4gICAgICAgICAgICAgICAgIXNvdXJjZXMgfHwgc291cmNlcy5sZW5ndGggPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc291cmNlcyA9ICggc291cmNlcyBpbnN0YW5jZW9mIEFycmF5ICkgPyBzb3VyY2VzIDogWyBzb3VyY2VzIF07XHJcbiAgICAgICAgICAgIHF1YWxpZmllcnMgPSAoIHF1YWxpZmllcnMgaW5zdGFuY2VvZiBBcnJheSApID8gcXVhbGlmaWVycyA6IFsgcXVhbGlmaWVycyBdO1xyXG4gICAgICAgICAgICAvLyBwYXJzZSBvdXQgdGFyZ2V0dGVkIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgICAgICB2YXIgZGVjbGFyYXRpb25zID0gW107XHJcbiAgICAgICAgICAgIHNvdXJjZXMuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucyA9IGRlY2xhcmF0aW9ucy5jb25jYXQoIHBhcnNlU291cmNlKCBzb3VyY2UsIHF1YWxpZmllcnMgKSApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGR1cGxpY2F0ZXMgYW5kIHJldHVyblxyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyRHVwbGljYXRlc0J5TmFtZSggZGVjbGFyYXRpb25zICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGV0ZWN0cyBiYXNlZCBvbiB0aGUgZXhpc3RlbmNlIG9mIGEgJ3ZvaWQgbWFpbigpIHsnIHN0YXRlbWVudCwgaWYgdGhlIHN0cmluZyBpcyBnbHNsIHNvdXJjZSBjb2RlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBpbnB1dCBzdHJpbmcgdG8gdGVzdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIFRydWUgaWYgdGhlIHN0cmluZyBpcyBnbHNsIGNvZGUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNHTFNMOiBmdW5jdGlvbiggc3RyICkge1xyXG4gICAgICAgICAgICByZXR1cm4gR0xTTF9SRUdFWFAudGVzdCggc3RyICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcclxuICAgIHZhciBXZWJHTENvbnRleHRTdGF0ZSA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0U3RhdGUnKTtcclxuICAgIHZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XHJcbiAgICB2YXIgTUFHX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVI6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgTUlOX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVI6IHRydWUsXHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVI6IHRydWUsXHJcbiAgICB9O1xyXG4gICAgdmFyIE1JUE1BUF9NSU5fRklMVEVSUyA9IHtcclxuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXHJcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgV1JBUF9NT0RFUyA9IHtcclxuICAgICAgICBSRVBFQVQ6IHRydWUsXHJcbiAgICAgICAgTUlSUk9SRURfUkVQRUFUOiB0cnVlLFxyXG4gICAgICAgIENMQU1QX1RPX0VER0U6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgREVQVEhfVFlQRVMgPSB7XHJcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxyXG4gICAgICAgIERFUFRIX1NURU5DSUw6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCB0eXBlIGZvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9CWVRFJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1dSQVAgPSAnUkVQRUFUJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIG1pcG1hcHBpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfTUlQTUFQID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGludmVydC15IGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX0lOVkVSVF9ZID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX01JUE1BUF9NSU5fRklMVEVSX1NVRkZJWCA9ICdfTUlQTUFQX0xJTkVBUic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBUZXh0dXJlMkQgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFRleHR1cmUyRFxyXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgMkQgdGV4dHVyZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLmRhdGEgLSBUaGUgZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMubWlwTWFwIC0gV2hldGhlciBvciBub3QgbWlwLW1hcHBpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVNdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVGV4dHVyZTJEKCBzcGVjICkge1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIGlmICggdHlwZW9mIHNwZWMud2lkdGggIT09ICdudW1iZXInIHx8IHNwZWMud2lkdGggPD0gMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ2B3aWR0aGAgYXJndW1lbnQgaXMgbWlzc2luZyBvciBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0eXBlb2Ygc3BlYy5oZWlnaHQgIT09ICdudW1iZXInIHx8IHNwZWMuaGVpZ2h0IDw9IDAgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdgaGVpZ2h0YCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBXZWJHTENvbnRleHRTdGF0ZS5nZXQoIGdsICk7XHJcbiAgICAgICAgLy8gY3JlYXRlIHRleHR1cmUgb2JqZWN0XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcclxuICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XHJcbiAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xyXG4gICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XHJcbiAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcclxuICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcclxuICAgICAgICB0aGlzLndyYXBTID0gc3BlYy53cmFwUyB8fCBERUZBVUxUX1dSQVA7XHJcbiAgICAgICAgdGhpcy53cmFwVCA9IHNwZWMud3JhcFQgfHwgREVGQVVMVF9XUkFQO1xyXG4gICAgICAgIHRoaXMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgREVGQVVMVF9GSUxURVI7XHJcbiAgICAgICAgdGhpcy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICAvLyBzZXQgb3RoZXIgcHJvcGVydGllc1xyXG4gICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogREVGQVVMVF9NSVBNQVA7XHJcbiAgICAgICAgdGhpcy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBERUZBVUxUX0lOVkVSVF9ZO1xyXG4gICAgICAgIHRoaXMucHJlTXVsdGlwbHlBbHBoYSA9IHNwZWMucHJlTXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkID8gc3BlYy5wcmVNdWx0aXBseUFscGhhIDogREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQTtcclxuICAgICAgICAvLyBzZXQgZm9ybWF0XHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBzcGVjLmZvcm1hdCB8fCBERUZBVUxUX0ZPUk1BVDtcclxuICAgICAgICBpZiAoIERFUFRIX1RZUEVTWyB0aGlzLmZvcm1hdCBdICYmICFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oICdXRUJHTF9kZXB0aF90ZXh0dXJlJyApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgZm9ybWF0IGAnICsgdGhpcy5mb3JtYXQgKyAnYCBhcyBgV0VCR0xfZGVwdGhfdGV4dHVyZWAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHR5cGVcclxuICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgREVGQVVMVF9UWVBFO1xyXG4gICAgICAgIGlmICggdGhpcy50eXBlID09PSAnRkxPQVQnICYmICFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oICdPRVNfdGV4dHVyZV9mbG9hdCcgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgVGV4dHVyZTJEIG9mIHR5cGUgYEZMT0FUYCBhcyBgT0VTX3RleHR1cmVfZmxvYXRgIGV4dGVuc2lvbiBpcyB1bnN1cHBvcnRlZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YVxyXG4gICAgICAgIHRoaXMuYnVmZmVyRGF0YSggc3BlYy5kYXRhIHx8IG51bGwsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0ICk7XHJcbiAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKCB0aGlzICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIHB1c2hlcyBpdCBvbnRvIHRoZSBzdGFjay5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LiBEZWZhdWx0IHRvIDAuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmUyRC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICBpZiAoIGxvY2F0aW9uID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKCAhVXRpbC5pc0ludGVnZXIoIGxvY2F0aW9uICkgfHwgbG9jYXRpb24gPCAwICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiB0aGlzIHRleHR1cmUgaXMgYWxyZWFkeSBib3VuZCwgbm8gbmVlZCB0byByZWJpbmRcclxuICAgICAgICBpZiAoIHRoaXMuc3RhdGUudGV4dHVyZTJEcy50b3AoIGxvY2F0aW9uICkgIT09IHRoaXMgKSB7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoIGdsWyAnVEVYVFVSRScgKyBsb2NhdGlvbiBdICk7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYWRkIHRvIHN0YWNrIHVuZGVyIHRoZSB0ZXh0dXJlIHVuaXRcclxuICAgICAgICB0aGlzLnN0YXRlLnRleHR1cmUyRHMucHVzaCggbG9jYXRpb24sIHRoaXMgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCBhbmQgYmluZHMgdGhlIHRleHR1cmUgYmVuZWF0aCBpdCBvbiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHRleHR1cmUsIHVuYmluZHMgdGhlIHVuaXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC4gRGVmYXVsdCB0byAwLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICBpZiAoIGxvY2F0aW9uID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKCAhVXRpbC5pc0ludGVnZXIoIGxvY2F0aW9uICkgfHwgbG9jYXRpb24gPCAwICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGlmICggc3RhdGUudGV4dHVyZTJEcy50b3AoIGxvY2F0aW9uICkgIT09IHRoaXMgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdUZXh0dXJlMkQgaXMgbm90IHRoZSB0b3AgbW9zdCBlbGVtZW50IG9uIHRoZSBzdGFjayc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlLnRleHR1cmUyRHMucG9wKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIHZhciBnbDtcclxuICAgICAgICB2YXIgdG9wID0gc3RhdGUudGV4dHVyZTJEcy50b3AoIGxvY2F0aW9uICk7XHJcbiAgICAgICAgaWYgKCB0b3AgKSB7XHJcbiAgICAgICAgICAgIGlmICggdG9wICE9PSB0aGlzICkge1xyXG4gICAgICAgICAgICAgICAgLy8gYmluZCB1bmRlcmx5aW5nIHRleHR1cmVcclxuICAgICAgICAgICAgICAgIGdsID0gdG9wLmdsO1xyXG4gICAgICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZSggZ2xbICdURVhUVVJFJyArIGxvY2F0aW9uIF0gKTtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCB0b3AudGV4dHVyZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdW5iaW5kXHJcbiAgICAgICAgICAgIGdsID0gdGhpcy5nbDtcclxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVmZmVyIGRhdGEgaW50byB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyVmlld30gZGF0YSAtIFRoZSBkYXRhIGFycmF5IHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLmJ1ZmZlckRhdGEgPSBmdW5jdGlvbiggZGF0YSwgd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIC8vIGludmVydCB5IGlmIHNwZWNpZmllZFxyXG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKCBnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkgKTtcclxuICAgICAgICAvLyBwcmVtdWx0aXBseSBhbHBoYSBpZiBzcGVjaWZpZWRcclxuICAgICAgICBnbC5waXhlbFN0b3JlaSggZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCB0aGlzLnByZU11bHRpcGx5QWxwaGEgKTtcclxuICAgICAgICAvLyBjYXN0IGFycmF5IGFyZ1xyXG4gICAgICAgIGlmICggZGF0YSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICBpZiAoIHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJyApIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDE2QXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJyApIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDMyQXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy50eXBlID09PSAnRkxPQVQnICkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDhBcnJheSggZGF0YSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBlbnN1cmUgdHlwZSBjb3JyZXNwb25kcyB0byBkYXRhXHJcbiAgICAgICAgaWYgKCBkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGRhdGEgaW5zdGFuY2VvZiBVaW50MTZBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcclxuICAgICAgICB9IGVsc2UgaWYgKCBkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9JTlQnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdGTE9BVCc7XHJcbiAgICAgICAgfSBlbHNlIGlmICggZGF0YSAmJiAhKCBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBvciBgQXJyYXlCdWZmZXJWaWV3YCwgb3IgbnVsbCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHN0b3JlIGRhdGEgZGVzY3JpcHRpb25cclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCB0aGlzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChcclxuICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbFxyXG4gICAgICAgICAgICBnbFsgdGhpcy5mb3JtYXQgXSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxyXG4gICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgMCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcclxuICAgICAgICAgICAgZ2xbIHRoaXMuZm9ybWF0IF0sXHJcbiAgICAgICAgICAgIGdsWyB0aGlzLnR5cGUgXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhICk7XHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgbWlwIG1hcHNcclxuICAgICAgICBpZiAoIHRoaXMubWlwTWFwICkge1xyXG4gICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcCggZ2wuVEVYVFVSRV8yRCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzLlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmUyRFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyBieSBuYW1lLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5zZXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24oIHBhcmFtcyApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIC8vIHNldCB3cmFwIFMgcGFyYW1ldGVyXHJcbiAgICAgICAgdmFyIHBhcmFtID0gcGFyYW1zLndyYXBTIHx8IHBhcmFtcy53cmFwO1xyXG4gICAgICAgIGlmICggcGFyYW0gKSB7XHJcbiAgICAgICAgICAgIGlmICggV1JBUF9NT0RFU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcFMgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFsgdGhpcy53cmFwUyBdICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBwYXJhbWV0ZXIgYCcgKyBwYXJhbSArICdgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBgVEVYVFVSRV9XUkFQX1NgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgd3JhcCBUIHBhcmFtZXRlclxyXG4gICAgICAgIHBhcmFtID0gcGFyYW1zLndyYXBUIHx8IHBhcmFtcy53cmFwO1xyXG4gICAgICAgIGlmICggcGFyYW0gKSB7XHJcbiAgICAgICAgICAgIGlmICggV1JBUF9NT0RFU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcFQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFsgdGhpcy53cmFwVCBdICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBwYXJhbWV0ZXIgYCcgKyBwYXJhbSArICdgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBgVEVYVFVSRV9XUkFQX1RgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWFnIGZpbHRlciBwYXJhbWV0ZXJcclxuICAgICAgICBwYXJhbSA9IHBhcmFtcy5tYWdGaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcclxuICAgICAgICBpZiAoIHBhcmFtICkge1xyXG4gICAgICAgICAgICBpZiAoIE1BR19GSUxURVJTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWdGaWx0ZXIgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbIHRoaXMubWFnRmlsdGVyIF0gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX01BR19GSUxURVJgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWluIGZpbHRlciBwYXJhbWV0ZXJcclxuICAgICAgICBwYXJhbSA9IHBhcmFtcy5taW5GaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcclxuICAgICAgICBpZiAoIHBhcmFtICkge1xyXG4gICAgICAgICAgICBpZiAoIHRoaXMubWlwTWFwICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBOT05fTUlQTUFQX01JTl9GSUxURVJTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZ3JhZGUgdG8gbWlwLW1hcCBtaW4gZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW0gKz0gREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIE1JUE1BUF9NSU5fRklMVEVSU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbIHRoaXMubWluRmlsdGVyIF0gKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX01JTl9GSUxURVJgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICggTUlOX0ZJTFRFUlNbIHBhcmFtIF0gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsWyB0aGlzLm1pbkZpbHRlciBdICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX01JTl9GSUxURVJgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2l6ZSB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgbmV3IHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAoIHdpZHRoIDw9IDAgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGB3aWR0aGAgb2YgJyArIHdpZHRoICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCAoIGhlaWdodCA8PSAwICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgaGVpZ2h0YCBvZiAnICsgaGVpZ2h0ICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idWZmZXJEYXRhKCB0aGlzLmRhdGEsIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlMkQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcclxuICAgIHZhciBXZWJHTENvbnRleHRTdGF0ZSA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0U3RhdGUnKTtcclxuICAgIHZhciBBc3luYyA9IHJlcXVpcmUoJy4uL3V0aWwvQXN5bmMnKTtcclxuICAgIHZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XHJcbiAgICB2YXIgSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL0ltYWdlTG9hZGVyJyk7XHJcbiAgICB2YXIgRkFDRVMgPSBbXHJcbiAgICAgICAgJy14JywgJyt4JyxcclxuICAgICAgICAnLXknLCAnK3knLFxyXG4gICAgICAgICcteicsICcreidcclxuICAgIF07XHJcbiAgICB2YXIgRkFDRV9UQVJHRVRTID0ge1xyXG4gICAgICAgICcreic6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1onLFxyXG4gICAgICAgICcteic6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1onLFxyXG4gICAgICAgICcreCc6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gnLFxyXG4gICAgICAgICcteCc6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1gnLFxyXG4gICAgICAgICcreSc6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1knLFxyXG4gICAgICAgICcteSc6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1knXHJcbiAgICB9O1xyXG4gICAgdmFyIE1BR19GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIE1JTl9GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHZhciBOT05fTUlQTUFQX01JTl9GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIHZhciBNSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIFdSQVBfTU9ERVMgPSB7XHJcbiAgICAgICAgUkVQRUFUOiB0cnVlLFxyXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcclxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIEZPUk1BVFMgPSB7XHJcbiAgICAgICAgUkdCOiB0cnVlLFxyXG4gICAgICAgIFJHQkE6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCB0eXBlIGZvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9CWVRFJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX01JUE1BUCA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9JTlZFUlRfWSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaXAtbWFwcGluZyBmaWx0ZXIgc3VmZml4LlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVggPSAnX01JUE1BUF9MSU5FQVInO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXh0dXJlIE1VU1QgYmUgYSBwb3dlci1vZi10d28uIE90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHRleHR1cmUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7Ym9vbH0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgdGV4dHVyZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtdXN0QmVQb3dlck9mVHdvKCBzcGVjICkge1xyXG4gICAgICAgIC8vIEFjY29yZGluZyB0bzpcclxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xfQVBJL1R1dG9yaWFsL1VzaW5nX3RleHR1cmVzX2luX1dlYkdMI05vbl9wb3dlci1vZi10d29fdGV4dHVyZXNcclxuICAgICAgICAvLyBOUE9UIHRleHR1cmVzIGNhbm5vdCBiZSB1c2VkIHdpdGggbWlwbWFwcGluZyBhbmQgdGhleSBtdXN0IG5vdCBcInJlcGVhdFwiXHJcbiAgICAgICAgcmV0dXJuIHNwZWMubWlwTWFwIHx8XHJcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPT09ICdSRVBFQVQnIHx8XHJcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPT09ICdNSVJST1JFRF9SRVBFQVQnIHx8XHJcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPT09ICdSRVBFQVQnIHx8XHJcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPT09ICdNSVJST1JFRF9SRVBFQVQnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXh0cmFjdHMgdGhlIHVuZGVybHlpbmcgZGF0YSBidWZmZXIgZnJvbSBhbiBpbWFnZSBlbGVtZW50LiBJZiB0ZXh0dXJlIG11c3QgYmUgYSBQT1QsIHJlc2l6ZXMgdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHRleHR1cmUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1ncyAtIFRoZSBtYXAgb2YgaW1hZ2Ugb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0SW1nRGF0YSggc3BlYywgaW1ncyApIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHt9O1xyXG4gICAgICAgIHZhciB3aWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0O1xyXG4gICAgICAgIC8vIHNpemUgYmFzZWQgb24gZmlyc3QgaW1nXHJcbiAgICAgICAgdmFyIGltZyA9IGltZ3NbIEZBQ0VTWzBdIF07XHJcbiAgICAgICAgaWYgKCBtdXN0QmVQb3dlck9mVHdvKCBzcGVjICkgKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28oIGltZy53aWR0aCApO1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byggaW1nLmhlaWdodCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gaW1nLndpZHRoO1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBleHRyYWN0IC8gcmVzaXplIGVhY2ggZmFjZVxyXG4gICAgICAgIEZBQ0VTLmZvckVhY2goIGZ1bmN0aW9uKCBmYWNlICkge1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gaW1nc1sgZmFjZSBdO1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgYW4gZW1wdHkgY2FudmFzIGVsZW1lbnRcclxuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdjYW52YXMnICk7XHJcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICAvLyBjb3B5IHRoZSBpbWFnZSBjb250ZW50cyB0byB0aGUgY2FudmFzXHJcbiAgICAgICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKCBpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgIHZhciBpbWdEYXRhID0gY3R4LmdldEltYWdlRGF0YSggMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICkuZGF0YTtcclxuICAgICAgICAgICAgLy8gYWRkIHRvIGZhY2VcclxuICAgICAgICAgICAgZGF0YVsgZmFjZSBdID0gbmV3IFVpbnQ4QXJyYXkoIGltZ0RhdGEgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyByZXR1cm4gcmVzdWx0c1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYWxsIGltYWdlcyBmcm9tIGEgc2V0IG9mIHVybHMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IGN1YmVNYXAgLSBUaGUgY3ViZSBtYXAgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybHMgLSBUaGUgdXJscyB0byBsb2FkIHRoZSBpbWFnZXMgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIHJlc3VsdGluZyBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlcyggY3ViZU1hcCwgdXJscywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGpvYnMgPSB7fTtcclxuICAgICAgICBPYmplY3Qua2V5cyggdXJscyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XHJcbiAgICAgICAgICAgIC8vIGFkZCBqb2IgdG8gbWFwXHJcbiAgICAgICAgICAgIGpvYnNbIGtleSBdID0gZnVuY3Rpb24oIGRvbmUgKSB7XHJcbiAgICAgICAgICAgICAgICBJbWFnZUxvYWRlci5sb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybHNbIGtleSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBpbWFnZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggbnVsbCwgaW1hZ2UgKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggZXJyICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCBlcnIsIG51bGwgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBBc3luYy5wYXJhbGxlbCggam9icywgY2FsbGJhY2sgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmVDdWJlTWFwIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBUZXh0dXJlQ3ViZU1hcFxyXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgY3ViZSBtYXAgdGV4dHVyZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSBzcGVjaWZpY2F0aW9uIGFyZ3VtZW50c1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjLmltYWdlcyAtIFRoZSBIVE1MSW1hZ2VFbGVtZW50cyB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IHNwZWMuaW1hZ2VzWyt4XSAtIFRoZSBwb3NpdGl2ZSB4IGltYWdlIHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gc3BlYy5pbWFnZXNbLXhdIC0gVGhlIG5lZ2F0aXZlIHggaW1hZ2UgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBzcGVjLmltYWdlc1sreV0gLSBUaGUgcG9zaXRpdmUgeSBpbWFnZSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IHNwZWMuaW1hZ2VzWy15XSAtIFRoZSBuZWdhdGl2ZSB5IGltYWdlIHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gc3BlYy5pbWFnZXNbK3pdIC0gVGhlIHBvc2l0aXZlIHogaW1hZ2UgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBzcGVjLmltYWdlc1stel0gLSBUaGUgbmVnYXRpdmUgeiBpbWFnZSB0byBidWZmZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMudXJscyAtIFRoZSBIVE1MSW1hZ2VFbGVtZW50IFVSTHMgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudXJsc1sreF0gLSBUaGUgcG9zaXRpdmUgeCBVUkwgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudXJsc1steF0gLSBUaGUgbmVnYXRpdmUgeCBVUkwgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudXJsc1sreV0gLSBUaGUgcG9zaXRpdmUgeSBVUkwgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudXJsc1steV0gLSBUaGUgbmVnYXRpdmUgeSBVUkwgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudXJsc1srel0gLSBUaGUgcG9zaXRpdmUgeiBVUkwgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudXJsc1stel0gLSBUaGUgbmVnYXRpdmUgeiBVUkwgdG8gYnVmZmVyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjLmRhdGEgLSBUaGUgZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLmRhdGFbK3hdIC0gVGhlIHBvc2l0aXZlIHggZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLmRhdGFbLXhdIC0gVGhlIG5lZ2F0aXZlIHggZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLmRhdGFbK3ldIC0gVGhlIHBvc2l0aXZlIHkgZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLmRhdGFbLXldIC0gVGhlIG5lZ2F0aXZlIHkgZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLmRhdGFbK3pdIC0gVGhlIHBvc2l0aXZlIHogZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLmRhdGFbLXpdIC0gVGhlIG5lZ2F0aXZlIHogZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBmYWNlcy5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBmYWNlcy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMubWlwTWFwIC0gV2hldGhlciBvciBub3QgbWlwLW1hcHBpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVNdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVGV4dHVyZUN1YmVNYXAoIHNwZWMsIGNhbGxiYWNrICkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBXZWJHTENvbnRleHRTdGF0ZS5nZXQoIGdsICk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcclxuICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XHJcbiAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xyXG4gICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XHJcbiAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcclxuICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcclxuICAgICAgICB0aGlzLndyYXBTID0gV1JBUF9NT0RFU1sgc3BlYy53cmFwUyBdID8gc3BlYy53cmFwUyA6IERFRkFVTFRfV1JBUDtcclxuICAgICAgICB0aGlzLndyYXBUID0gV1JBUF9NT0RFU1sgc3BlYy53cmFwVCBdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcclxuICAgICAgICB0aGlzLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTWyBzcGVjLm1pbkZpbHRlciBdID8gc3BlYy5taW5GaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IE1BR19GSUxURVJTWyBzcGVjLm1hZ0ZpbHRlciBdID8gc3BlYy5tYWdGaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICAvLyBzZXQgb3RoZXIgcHJvcGVydGllc1xyXG4gICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogREVGQVVMVF9NSVBNQVA7XHJcbiAgICAgICAgdGhpcy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBERUZBVUxUX0lOVkVSVF9ZO1xyXG4gICAgICAgIHRoaXMucHJlTXVsdGlwbHlBbHBoYSA9IHNwZWMucHJlTXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkID8gc3BlYy5wcmVNdWx0aXBseUFscGhhIDogREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQTtcclxuICAgICAgICAvLyBzZXQgZm9ybWF0IGFuZCB0eXBlXHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBGT1JNQVRTWyBzcGVjLmZvcm1hdCBdID8gc3BlYy5mb3JtYXQgOiBERUZBVUxUX0ZPUk1BVDtcclxuICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgREVGQVVMVF9UWVBFO1xyXG4gICAgICAgIGlmICggdGhpcy50eXBlID09PSAnRkxPQVQnICYmICFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oICdPRVNfdGV4dHVyZV9mbG9hdCcgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgVGV4dHVyZTJEIG9mIHR5cGUgYEZMT0FUYCBhcyBgT0VTX3RleHR1cmVfZmxvYXRgIGV4dGVuc2lvbiBpcyB1bnN1cHBvcnRlZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBkaW1lbnNpb25zXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBjdWJlIG1hcCBiYXNlZCBvbiBpbnB1dFxyXG4gICAgICAgIGlmICggc3BlYy5pbWFnZXMgKSB7XHJcbiAgICAgICAgICAgIC8vIEltYWdlc1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gZ2V0SW1nRGF0YSggdGhhdCwgc3BlYy5pbWFnZXMgKTtcclxuICAgICAgICAgICAgdGhhdC5idWZmZXJEYXRhKCByZXMuZGF0YSwgcmVzLndpZHRoLCByZXMuaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNwZWMudXJscyApIHtcclxuICAgICAgICAgICAgLy8gdXJsc1xyXG4gICAgICAgICAgICBsb2FkSW1hZ2VzKCB0aGlzLCBzcGVjLnVybHMsIGZ1bmN0aW9uKCBlcnIsIGltYWdlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggZXJyICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBlcnIsIG51bGwgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IGdldEltZ0RhdGEoIHRoYXQsIGltYWdlcyApO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5idWZmZXJEYXRhKCByZXMuZGF0YSwgcmVzLndpZHRoLCByZXMuaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnNldFBhcmFtZXRlcnMoIHRoYXQgKTtcclxuICAgICAgICAgICAgICAgIGlmICggY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIG51bGwsIHRoYXQgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZGF0YSBvciBudWxsXHJcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNwZWMud2lkdGggIT09ICdudW1iZXInIHx8IHNwZWMud2lkdGggPD0gMCApIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdgd2lkdGhgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCB0eXBlb2Ygc3BlYy5oZWlnaHQgIT09ICdudW1iZXInIHx8IHNwZWMuaGVpZ2h0IDw9IDAgKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnYGhlaWdodGAgYXJndW1lbnQgaXMgbWlzc2luZyBvciBpbnZhbGlkJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LmJ1ZmZlckRhdGEoIHNwZWMuZGF0YSB8fCBudWxsLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCApO1xyXG4gICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnMoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIHB1c2hlcyBpdCB0byBvbnRvIHRoZSBzdGFjay5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlQ3ViZU1hcFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZUN1YmVNYXAucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XHJcbiAgICAgICAgaWYgKCBsb2NhdGlvbiA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICggIVV0aWwuaXNJbnRlZ2VyKCBsb2NhdGlvbiApIHx8IGxvY2F0aW9uIDwgMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgdW5pdCBsb2NhdGlvbiBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgdGhpcyB0ZXh0dXJlIGlzIGFscmVhZHkgYm91bmQsIG5vIG5lZWQgdG8gcmViaW5kXHJcbiAgICAgICAgaWYgKCB0aGlzLnN0YXRlLnRleHR1cmVDdWJlTWFwcy50b3AoIGxvY2F0aW9uICkgIT09IHRoaXMgKSB7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoIGdsWyAnVEVYVFVSRScgKyBsb2NhdGlvbiBdICk7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLnRleHR1cmUgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYWRkIHRvIHN0YWNrIHVuZGVyIHRoZSB0ZXh0dXJlIHVuaXRcclxuICAgICAgICB0aGlzLnN0YXRlLnRleHR1cmVDdWJlTWFwcy5wdXNoKCBsb2NhdGlvbiwgdGhpcyApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IGFuZCBiaW5kcyB0aGUgdGV4dHVyZSBiZW5lYXRoIGl0IG9uXHJcbiAgICAgKiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHRleHR1cmUsIHVuYmluZHMgdGhlIHVuaXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZUN1YmVNYXBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmVDdWJlTWFwLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XHJcbiAgICAgICAgaWYgKCBsb2NhdGlvbiA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICggIVV0aWwuaXNJbnRlZ2VyKCBsb2NhdGlvbiApIHx8IGxvY2F0aW9uIDwgMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgdW5pdCBsb2NhdGlvbiBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBpZiAoIHN0YXRlLnRleHR1cmVDdWJlTWFwcy50b3AoIGxvY2F0aW9uICkgIT09IHRoaXMgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdUaGUgY3VycmVudCB0ZXh0dXJlIGlzIG5vdCB0aGUgdG9wIG1vc3QgZWxlbWVudCBvbiB0aGUgc3RhY2snO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGF0ZS50ZXh0dXJlQ3ViZU1hcHMucG9wKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIHZhciBnbDtcclxuICAgICAgICB2YXIgdG9wID0gc3RhdGUudGV4dHVyZUN1YmVNYXBzLnRvcCggbG9jYXRpb24gKTtcclxuICAgICAgICBpZiAoIHRvcCApIHtcclxuICAgICAgICAgICAgaWYgKCB0b3AgIT09IHRoaXMgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBiaW5kIHVuZGVybHlpbmcgdGV4dHVyZVxyXG4gICAgICAgICAgICAgICAgZ2wgPSB0b3AuZ2w7XHJcbiAgICAgICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKCBnbFsgJ1RFWFRVUkUnICsgbG9jYXRpb24gXSApO1xyXG4gICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRvcC50ZXh0dXJlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB1bmJpbmRcclxuICAgICAgICAgICAgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSByZXNwZWN0aXZlIGN1YmUgbWFwIGZhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZUN1YmVNYXBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdHx8bnVsbH0gZmFjZXMgLSBUaGUgbWFwIG9mIGZhY2UgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmVDdWJlTWFwLnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24oIGZhY2VzLCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgLy8gc2V0IHdpZHRoIGFuZCBoZWlnaHRcclxuICAgICAgICBpZiAoIHdpZHRoICE9PSB1bmRlZmluZWQgJiYgaGVpZ2h0ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCB3aWR0aCA8PSAwICkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGB3aWR0aGAgb2YgJyArIHdpZHRoICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IGhlaWdodCA8PSAwICkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGBoZWlnaHRgIG9mICcgKyBoZWlnaHQgKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICggd2lkdGggIT09IGhlaWdodCApIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgd2lkdGhgIG11c3QgYmUgZXF1YWwgdG8gYGhlaWdodGAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHNldCB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGJ1ZmZlciBmYWNlIHRleHR1cmVcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICAvLyBpbnZlcnQgeSBpZiBzcGVjaWZpZWRcclxuICAgICAgICBnbC5waXhlbFN0b3JlaSggZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdGhpcy5pbnZlcnRZICk7XHJcbiAgICAgICAgLy8gcHJlbXVsdGlwbHkgYWxwaGEgaWYgc3BlY2lmaWVkXHJcbiAgICAgICAgZ2wucGl4ZWxTdG9yZWkoIGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdGhpcy5wcmVNdWx0aXBseUFscGhhICk7XHJcbiAgICAgICAgLy8gYnVmZmVyIGVhY2ggZmFjZVxyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICBGQUNFUy5mb3JFYWNoKCBmdW5jdGlvbiggZmFjZSApIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IEZBQ0VfVEFSR0VUU1sgZmFjZSBdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICggZmFjZXMgKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gKCBmYWNlc1sgZmFjZSBdICkgPyBmYWNlc1sgZmFjZSBdIDogZmFjZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY2FzdCBhcnJheSBhcmdcclxuICAgICAgICAgICAgaWYgKCBkYXRhIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoYXQudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQxNkFycmF5KCBkYXRhICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGF0LnR5cGUgPT09ICdVTlNJR05FRF9JTlQnICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDMyQXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoYXQudHlwZSA9PT0gJ0ZMT0FUJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IEZsb2F0MzJBcnJheSggZGF0YSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxyXG4gICAgICAgICAgICBpZiAoIGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBkYXRhIGluc3RhbmNlb2YgVWludDE2QXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnR5cGUgPSAnVU5TSUdORURfSU5UJztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIHRoYXQudHlwZSA9ICdGTE9BVCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRhdGEgJiZcclxuICAgICAgICAgICAgICAgICEoIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciApICkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBgQXJyYXlCdWZmZXJWaWV3YCwgb3IgbnVsbCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoXHJcbiAgICAgICAgICAgICAgICBnbFsgdGFyZ2V0IF0sXHJcbiAgICAgICAgICAgICAgICAwLCAvLyBsZXZlbFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoYXQuZm9ybWF0IF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcclxuICAgICAgICAgICAgICAgIHRoYXQud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGF0LmhlaWdodCxcclxuICAgICAgICAgICAgICAgIDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhhdC5mb3JtYXQgXSxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGF0LnR5cGUgXSxcclxuICAgICAgICAgICAgICAgIGRhdGEgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBvbmNlIGFsbCBmYWNlcyBhcmUgYnVmZmVyZWRcclxuICAgICAgICBpZiAoIHRoaXMubWlwTWFwICkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IGdlbmVyYXRlIG1pcG1hcHMgaWYgYWxsIGZhY2VzIGFyZSBidWZmZXJlZFxyXG4gICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcCggZ2wuVEVYVFVSRV9DVUJFX01BUCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzLlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmVDdWJlTWFwXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIGJ5IG5hbWUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmVDdWJlTWFwLnByb3RvdHlwZS5zZXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24oIHBhcmFtcyApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIC8vIHNldCB3cmFwIFMgcGFyYW1ldGVyXHJcbiAgICAgICAgdmFyIHBhcmFtID0gcGFyYW1zLndyYXBTIHx8IHBhcmFtcy53cmFwO1xyXG4gICAgICAgIGlmICggcGFyYW0gKSB7XHJcbiAgICAgICAgICAgIGlmICggV1JBUF9NT0RFU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcFMgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFsgdGhpcy53cmFwUyBdICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBwYXJhbWV0ZXIgYCcgKyBwYXJhbSArICdgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBgVEVYVFVSRV9XUkFQX1NgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgd3JhcCBUIHBhcmFtZXRlclxyXG4gICAgICAgIHBhcmFtID0gcGFyYW1zLndyYXBUIHx8IHBhcmFtcy53cmFwO1xyXG4gICAgICAgIGlmICggcGFyYW0gKSB7XHJcbiAgICAgICAgICAgIGlmICggV1JBUF9NT0RFU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcFQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFsgdGhpcy53cmFwVCBdICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBwYXJhbWV0ZXIgYCcgKyBwYXJhbSArICdgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBgVEVYVFVSRV9XUkFQX1RgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWFnIGZpbHRlciBwYXJhbWV0ZXJcclxuICAgICAgICBwYXJhbSA9IHBhcmFtcy5tYWdGaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcclxuICAgICAgICBpZiAoIHBhcmFtICkge1xyXG4gICAgICAgICAgICBpZiAoIE1BR19GSUxURVJTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWdGaWx0ZXIgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbIHRoaXMubWFnRmlsdGVyIF0gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX01BR19GSUxURVJgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWluIGZpbHRlciBwYXJhbWV0ZXJcclxuICAgICAgICBwYXJhbSA9IHBhcmFtcy5taW5GaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcclxuICAgICAgICBpZiAoIHBhcmFtICkge1xyXG4gICAgICAgICAgICBpZiAoIHRoaXMubWlwTWFwICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBOT05fTUlQTUFQX01JTl9GSUxURVJTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZ3JhZGUgdG8gbWlwLW1hcCBtaW4gZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW0gKz0gREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIE1JUE1BUF9NSU5fRklMVEVSU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbIHRoaXMubWluRmlsdGVyIF0gKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX01JTl9GSUxURVJgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICggTUlOX0ZJTFRFUlNbIHBhcmFtIF0gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsWyB0aGlzLm1pbkZpbHRlciBdICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX01JTl9GSUxURVJgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRleHR1cmVDdWJlTWFwO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuICAgIHZhciBXZWJHTENvbnRleHRTdGF0ZSA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0U3RhdGUnKTtcbiAgICB2YXIgVmVydGV4UGFja2FnZSA9IHJlcXVpcmUoJy4vVmVydGV4UGFja2FnZScpO1xuICAgIHZhciBNT0RFUyA9IHtcbiAgICAgICAgUE9JTlRTOiB0cnVlLFxuICAgICAgICBMSU5FUzogdHJ1ZSxcbiAgICAgICAgTElORV9TVFJJUDogdHJ1ZSxcbiAgICAgICAgTElORV9MT09QOiB0cnVlLFxuICAgICAgICBUUklBTkdMRVM6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX1NUUklQOiB0cnVlLFxuICAgICAgICBUUklBTkdMRV9GQU46IHRydWVcbiAgICB9O1xuICAgIHZhciBUWVBFUyA9IHtcbiAgICAgICAgRkxPQVQ6IHRydWVcbiAgICB9O1xuICAgIHZhciBCWVRFU19QRVJfVFlQRSA9IHtcbiAgICAgICAgRkxPQVQ6IDRcbiAgICB9O1xuICAgIHZhciBCWVRFU19QRVJfQ09NUE9ORU5UID0gQllURVNfUEVSX1RZUEUuRkxPQVQ7XG4gICAgdmFyIFNJWkVTID0ge1xuICAgICAgICAxOiB0cnVlLFxuICAgICAgICAyOiB0cnVlLFxuICAgICAgICAzOiB0cnVlLFxuICAgICAgICA0OiB0cnVlXG4gICAgfTtcbiAgICB2YXIgREVGQVVMVF9NT0RFID0gJ1RSSUFOR0xFUyc7XG4gICAgdmFyIERFRkFVTFRfT0ZGU0VUID0gMDtcbiAgICB2YXIgREVGQVVMVF9DT1VOVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSB0aGUgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCBkZXRlcm1pbmUgdGhlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlUG9pbnRlcnMgLSBUaGUgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTdHJpZGUoIGF0dHJpYnV0ZVBvaW50ZXJzICkge1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBhdHRyaWJ1dGUgcG9pbnRlciBhc3NpZ25lZCB0byB0aGlzIGJ1ZmZlcixcbiAgICAgICAgLy8gdGhlcmUgaXMgbm8gbmVlZCBmb3Igc3RyaWRlLCBzZXQgdG8gZGVmYXVsdCBvZiAwXG4gICAgICAgIHZhciBpbmRpY2VzID0gT2JqZWN0LmtleXMoIGF0dHJpYnV0ZVBvaW50ZXJzICk7XG4gICAgICAgIGlmICggaW5kaWNlcy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF4T2Zmc2V0ID0gMDtcbiAgICAgICAgdmFyIGJ5dGVTaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHN0cmlkZSA9IDA7XG4gICAgICAgIGluZGljZXMuZm9yRWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuICAgICAgICAgICAgdmFyIHBvaW50ZXIgPSBhdHRyaWJ1dGVQb2ludGVyc1sgaW5kZXggXTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBwb2ludGVyLm9mZnNldDtcbiAgICAgICAgICAgIHZhciBzaXplID0gcG9pbnRlci5zaXplO1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBwb2ludGVyLnR5cGU7XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgc3VtIG9mIGVhY2ggYXR0cmlidXRlIHNpemVcbiAgICAgICAgICAgIGJ5dGVTaXplU3VtICs9IHNpemUgKiBCWVRFU19QRVJfVFlQRVsgdHlwZSBdO1xuICAgICAgICAgICAgLy8gdHJhY2sgdGhlIGxhcmdlc3Qgb2Zmc2V0IHRvIGRldGVybWluZSB0aGUgc3RyaWRlIG9mIHRoZSBidWZmZXJcbiAgICAgICAgICAgIGlmICggb2Zmc2V0ID4gbWF4T2Zmc2V0ICkge1xuICAgICAgICAgICAgICAgIG1heE9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgICAgICAgICBzdHJpZGUgPSBvZmZzZXQgKyAoIHNpemUgKiBCWVRFU19QRVJfVFlQRVsgdHlwZSBdICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBjaGVjayBpZiB0aGUgbWF4IG9mZnNldCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHRoZSBzdW0gb2ZcbiAgICAgICAgLy8gdGhlIHNpemVzLiBJZiBzbyB0aGlzIGJ1ZmZlciBpcyBub3QgaW50ZXJsZWF2ZWQgYW5kIGRvZXMgbm90IG5lZWQgYVxuICAgICAgICAvLyBzdHJpZGUuXG4gICAgICAgIGlmICggbWF4T2Zmc2V0ID49IGJ5dGVTaXplU3VtICkge1xuICAgICAgICAgICAgLy8gVE9ETzogdGVzdCB3aGF0IHN0cmlkZSA9PT0gMCBkb2VzIGZvciBhbiBpbnRlcmxlYXZlZCBidWZmZXIgb2ZcbiAgICAgICAgICAgIC8vIGxlbmd0aCA9PT0gMS5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHJpZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIGF0dHJpYnV0ZSBwb2ludGVycyB0byBlbnN1cmUgdGhleSBhcmUgdmFsaWQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVQb2ludGVycyAtIFRoZSBhdHRyaWJ1dGUgcG9pbnRlciBtYXAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0gVGhlIHZhbGlkYXRlZCBhdHRyaWJ1dGUgcG9pbnRlciBtYXAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXR0cmlidXRlUG9pbnRlcnMoIGF0dHJpYnV0ZVBvaW50ZXJzICkge1xuICAgICAgICAvLyBlbnN1cmUgdGhlcmUgYXJlIHBvaW50ZXJzIHByb3ZpZGVkXG4gICAgICAgIGlmICggIWF0dHJpYnV0ZVBvaW50ZXJzIHx8IE9iamVjdC5rZXlzKCBhdHRyaWJ1dGVQb2ludGVycyApLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHRocm93ICdWZXJ0ZXhCdWZmZXIgcmVxdWlyZXMgYXR0cmlidXRlIHBvaW50ZXJzIHRvIGJlIHNwZWNpZmllZCB1cG9uIGluc3RhbnRpYXRpb24nO1xuICAgICAgICB9XG4gICAgICAgIC8vIHBhcnNlIHBvaW50ZXJzIHRvIGVuc3VyZSB0aGV5IGFyZSB2YWxpZFxuICAgICAgICB2YXIgcG9pbnRlcnMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMoIGF0dHJpYnV0ZVBvaW50ZXJzICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCBrZXksIDEwICk7XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IGtleSBpcyBhbiB2YWxpZCBpbnRlZ2VyXG4gICAgICAgICAgICBpZiAoIGlzTmFOKCBpbmRleCApICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdBdHRyaWJ1dGUgaW5kZXggYCcgKyBrZXkgKyAnYCBkb2VzIG5vdCByZXByZXNlbnQgYW4gaW50ZWdlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcG9pbnRlciA9IGF0dHJpYnV0ZVBvaW50ZXJzW2tleV07XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IHBvaW50ZXIuc2l6ZTtcbiAgICAgICAgICAgIHZhciB0eXBlID0gcG9pbnRlci50eXBlO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHBvaW50ZXIub2Zmc2V0O1xuICAgICAgICAgICAgLy8gY2hlY2sgc2l6ZVxuICAgICAgICAgICAgaWYgKCAhU0laRVNbIHNpemUgXSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0cmlidXRlIHBvaW50ZXIgYHNpemVgIHBhcmFtZXRlciBpcyBpbnZhbGlkLCBtdXN0IGJlIG9uZSBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoIE9iamVjdC5rZXlzKCBTSVpFUyApICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0eXBlXG4gICAgICAgICAgICBpZiAoICFUWVBFU1sgdHlwZSBdICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdBdHRyaWJ1dGUgcG9pbnRlciBgdHlwZWAgcGFyYW1ldGVyIGlzIGludmFsaWQsIG11c3QgYmUgb25lIG9mICcgK1xuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSggT2JqZWN0LmtleXMoIFRZUEVTICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvaW50ZXJzWyBpbmRleCBdID0ge1xuICAgICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6ICggb2Zmc2V0ICE9PSB1bmRlZmluZWQgKSA/IG9mZnNldCA6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcG9pbnRlcnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBudW1iZXIgb2YgY29tcG9uZW50cyBpbiB0aGUgYnVmZmVyLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlUG9pbnRlcnMgLSBUaGUgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAtIFRoZSBudW1iZXIgb2YgY29tcG9uZW50cyBpbiB0aGUgYnVmZmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE51bUNvbXBvbmVudHMoIGF0dHJpYnV0ZVBvaW50ZXJzICkge1xuICAgICAgICB2YXIgc2l6ZSA9IDA7XG4gICAgICAgIE9iamVjdC5rZXlzKCBhdHRyaWJ1dGVQb2ludGVycyApLmZvckVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcbiAgICAgICAgICAgIHNpemUgKz0gYXR0cmlidXRlUG9pbnRlcnNbIGluZGV4IF0uc2l6ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlcyBhbiBWZXJ0ZXhCdWZmZXIgb2JqZWN0LlxuICAgICAqIEBjbGFzcyBWZXJ0ZXhCdWZmZXJcbiAgICAgKiBAY2xhc3NkZXNjIEEgdmVydGV4IGJ1ZmZlciBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fEZsb2F0MzJBcnJheXxWZXJ0ZXhQYWNrYWdlfG51bWJlcn0gYXJnIC0gVGhlIGJ1ZmZlciBvciBsZW5ndGggb2YgdGhlIGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlUG9pbnRlcnMgLSBUaGUgYXJyYXkgcG9pbnRlciBtYXAsIG9yIGluIHRoZSBjYXNlIG9mIGEgdmVydGV4IHBhY2thZ2UgYXJnLCB0aGUgb3B0aW9ucy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSByZW5kZXJpbmcgb3B0aW9ucy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm9mZnNldCAtIFRoZSBpbmRleCBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiBpbmRpY2VzIHRvIGRyYXcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gVmVydGV4QnVmZmVyKCBhcmcsIGF0dHJpYnV0ZVBvaW50ZXJzLCBvcHRpb25zICkge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFdlYkdMQ29udGV4dFN0YXRlLmdldCggZ2wgKTtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgICAgdGhpcy5tb2RlID0gTU9ERVNbIG9wdGlvbnMubW9kZSBdID8gb3B0aW9ucy5tb2RlIDogREVGQVVMVF9NT0RFO1xuICAgICAgICB0aGlzLmNvdW50ID0gKCBvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQgKSA/IG9wdGlvbnMuY291bnQgOiBERUZBVUxUX0NPVU5UO1xuICAgICAgICB0aGlzLm9mZnNldCA9ICggb3B0aW9ucy5vZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5vZmZzZXQgOiBERUZBVUxUX09GRlNFVDtcbiAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gMDtcbiAgICAgICAgLy8gZmlyc3QsIHNldCB0aGUgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgIGlmICggYXJnIGluc3RhbmNlb2YgVmVydGV4UGFja2FnZSApIHtcbiAgICAgICAgICAgIC8vIFZlcnRleFBhY2thZ2UgYXJndW1lbnQsIHVzZSBpdHMgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0gYXJnLnBvaW50ZXJzO1xuICAgICAgICAgICAgLy8gc2hpZnQgb3B0aW9ucyBhcmcgc2luY2UgdGhlcmUgd2lsbCBiZSBubyBhdHRyaWIgcG9pbnRlcnMgYXJnXG4gICAgICAgICAgICBvcHRpb25zID0gYXR0cmlidXRlUG9pbnRlcnMgfHwge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0gZ2V0QXR0cmlidXRlUG9pbnRlcnMoIGF0dHJpYnV0ZVBvaW50ZXJzICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IHN0cmlkZVxuICAgICAgICB0aGlzLnN0cmlkZSA9IGdldFN0cmlkZSggdGhpcy5wb2ludGVycyApO1xuICAgICAgICAvLyB0aGVuIGJ1ZmZlciB0aGUgZGF0YVxuICAgICAgICBpZiAoIGFyZyApIHtcbiAgICAgICAgICAgIGlmICggYXJnIGluc3RhbmNlb2YgVmVydGV4UGFja2FnZSApIHtcbiAgICAgICAgICAgICAgICAvLyBWZXJ0ZXhQYWNrYWdlIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBhcmcuYnVmZmVyICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBhcmcgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlciApIHtcbiAgICAgICAgICAgICAgICAvLyBXZWJHTEJ1ZmZlciBhcmd1bWVudFxuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5ieXRlTGVuZ3RoID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBXZWJHTEJ1ZmZlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMuYnl0ZUxlbmd0aGAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBvcHRpb25zLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBhcmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFycmF5IG9yIEFycmF5QnVmZmVyIG9yIG51bWJlciBhcmd1bWVudFxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gZW5zdXJlIHRoZXJlIGlzbid0IGFuIG92ZXJmbG93XG4gICAgICAgIHZhciBidWZmZXJDb3VudCA9ICggdGhpcy5ieXRlTGVuZ3RoIC8gQllURVNfUEVSX0NPTVBPTkVOVCApIC8gZ2V0TnVtQ29tcG9uZW50cyggdGhpcy5wb2ludGVycyApO1xuICAgICAgICBpZiAoIHRoaXMuY291bnQgKyB0aGlzLm9mZnNldCA+IGJ1ZmZlckNvdW50ICkge1xuICAgICAgICAgICAgdGhyb3cgJ1ZlcnRleEJ1ZmZlciBgY291bnRgIG9mICcgKyB0aGlzLmNvdW50ICsgJyBhbmQgYG9mZnNldGAgb2YgJyArIHRoaXMub2Zmc2V0ICsgJyBvdmVyZmxvd3MgdGhlIHRvdGFsIGNvdW50IG9mIHRoZSBidWZmZXIgJyArIGJ1ZmZlckNvdW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBsb2FkIHZlcnRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIsIG9yIHNpemUgb2YgdGhlIGJ1ZmZlciBpbiBieXRlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24oIGFyZyApIHtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICAgICAgaWYgKCBhcmcgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgaW50byBBcnJheUJ1ZmZlclZpZXdcbiAgICAgICAgICAgIGFyZyA9IG5ldyBGbG9hdDMyQXJyYXkoIGFyZyApO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgISggYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgKSAmJlxuICAgICAgICAgICAgISggYXJnIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ICkgJiZcbiAgICAgICAgICAgIHR5cGVvZiBhcmcgIT09ICdudW1iZXInICkge1xuICAgICAgICAgICAgLy8gaWYgbm90IGFycmF5YnVmZmVyIG9yIGEgbnVtZXJpYyBzaXplXG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIGBBcnJheUJ1ZmZlclZpZXdgLCBvciBgbnVtYmVyYCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG9uJ3Qgb3ZlcndyaXRlIHRoZSBjb3VudCBpZiBpdCBpcyBhbHJlYWR5IHNldFxuICAgICAgICBpZiAoIHRoaXMuY291bnQgPT09IERFRkFVTFRfQ09VTlQgKSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIG51bWJlciBvZiBhdHRyaWJ1dGUgY29tcG9uZW50cyBmcm9tIHBvaW50ZXJzXG4gICAgICAgICAgICB2YXIgbnVtQ29tcG9uZW50cyA9IGdldE51bUNvbXBvbmVudHMoIHRoaXMucG9pbnRlcnMgKTtcbiAgICAgICAgICAgIC8vIHNldCBjb3VudCBiYXNlZCBvbiBzaXplIG9mIGJ1ZmZlciBhbmQgbnVtYmVyIG9mIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9ICggYXJnIC8gQllURVNfUEVSX0NPTVBPTkVOVCApIC8gbnVtQ29tcG9uZW50cztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IGFyZy5sZW5ndGggLyBudW1Db21wb25lbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBieXRlIGxlbmd0aFxuICAgICAgICBpZiAoIHR5cGVvZiBhcmcgPT09ICdudW1iZXInICkge1xuICAgICAgICAgICAgaWYgKCBhcmcgJSBCWVRFU19QRVJfQ09NUE9ORU5UICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdCeXRlIGxlbmd0aCBtdXN0IGJlIG11bHRpcGxlIG9mICcgKyBCWVRFU19QRVJfQ09NUE9ORU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnLmxlbmd0aCAqIEJZVEVTX1BFUl9DT01QT05FTlQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcbiAgICAgICAgZ2wuYnVmZmVyRGF0YSggZ2wuQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXICk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwbG9hZCBwYXJ0aWFsIHZlcnRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGFycmF5IC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGF0IHdoaWNoIHRvIGJ1ZmZlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJTdWJEYXRhID0gZnVuY3Rpb24oIGFycmF5LCBieXRlT2Zmc2V0ICkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBpZiAoIHRoaXMuYnl0ZUxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHRocm93ICdCdWZmZXIgaGFzIG5vdCB5ZXQgYmVlbiBhbGxvY2F0ZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgICAgICAgIGFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSggYXJyYXkgKTtcbiAgICAgICAgfSBlbHNlIGlmICggISggYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciApICYmICFBcnJheUJ1ZmZlci5pc1ZpZXcoIGFycmF5ICkgKSB7XG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIG9yIGBBcnJheUJ1ZmZlclZpZXdgJztcbiAgICAgICAgfVxuICAgICAgICBieXRlT2Zmc2V0ID0gKCBieXRlT2Zmc2V0ICE9PSB1bmRlZmluZWQgKSA/IGJ5dGVPZmZzZXQgOiBERUZBVUxUX09GRlNFVDtcbiAgICAgICAgLy8gZ2V0IHRoZSB0b3RhbCBudW1iZXIgb2YgYXR0cmlidXRlIGNvbXBvbmVudHMgZnJvbSBwb2ludGVyc1xuICAgICAgICB2YXIgYnl0ZUxlbmd0aCA9IGFycmF5Lmxlbmd0aCAqIEJZVEVTX1BFUl9DT01QT05FTlQ7XG4gICAgICAgIGlmICggYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGggPiB0aGlzLmJ5dGVMZW5ndGggKSB7XG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgbGVuZ3RoICcgKyBieXRlTGVuZ3RoICsgJyBieXRlcyBhbmQgb2Zmc2V0IG9mICcgKyBieXRlT2Zmc2V0ICsgJyBieXRlcyBvdmVyZmxvd3MgdGhlIGJ1ZmZlciBsZW5ndGggb2YgJyArIHRoaXMuYnl0ZUxlbmd0aCArICcgYnl0ZXMnO1xuICAgICAgICB9XG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcbiAgICAgICAgZ2wuYnVmZmVyU3ViRGF0YSggZ2wuQVJSQVlfQlVGRkVSLCBieXRlT2Zmc2V0LCBhcnJheSApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQmluZHMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICAgICAqIEBtZW1iZXJvZiBWZXJ0ZXhCdWZmZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtWZXJ0ZXhCdWZmZXJ9IFJldHVybnMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0IGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBWZXJ0ZXhCdWZmZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgLy8gY2FjaGUgdGhpcyB2ZXJ0ZXggYnVmZmVyXG4gICAgICAgIGlmICggc3RhdGUuYm91bmRWZXJ0ZXhCdWZmZXIgIT09IHRoaXMuYnVmZmVyICkge1xuICAgICAgICAgICAgLy8gYmluZCBidWZmZXJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcbiAgICAgICAgICAgIHN0YXRlLmJvdW5kVmVydGV4QnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBvaW50ZXJzID0gdGhpcy5wb2ludGVycztcbiAgICAgICAgdmFyIHN0cmlkZSA9IHRoaXMuc3RyaWRlO1xuICAgICAgICBPYmplY3Qua2V5cyggcG9pbnRlcnMgKS5mb3JFYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRlciA9IHBvaW50ZXJzWyBpbmRleCBdO1xuICAgICAgICAgICAgLy8gc2V0IGF0dHJpYnV0ZSBwb2ludGVyXG4gICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIHBvaW50ZXIuc2l6ZSxcbiAgICAgICAgICAgICAgICBnbFsgcG9pbnRlci50eXBlIF0sXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RyaWRlLFxuICAgICAgICAgICAgICAgIHBvaW50ZXIub2Zmc2V0ICk7XG4gICAgICAgICAgICAvLyBlbmFibGUgYXR0cmlidXRlIGluZGV4XG4gICAgICAgICAgICBpZiAoICFzdGF0ZS5lbmFibGVkVmVydGV4QXR0cmlidXRlc1sgaW5kZXggXSApIHtcbiAgICAgICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSggaW5kZXggKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5lbmFibGVkVmVydGV4QXR0cmlidXRlc1sgaW5kZXggXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVW5iaW5kcyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHJldHVybnMge1ZlcnRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIC8vIG9ubHkgYmluZCBpZiBpdCBhbHJlYWR5IGlzbid0IGJvdW5kXG4gICAgICAgIGlmICggc3RhdGUuYm91bmRWZXJ0ZXhCdWZmZXIgIT09IHRoaXMuYnVmZmVyICkge1xuICAgICAgICAgICAgLy8gYmluZCBidWZmZXJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcbiAgICAgICAgICAgIHN0YXRlLmJvdW5kVmVydGV4QnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMucG9pbnRlcnMgKS5mb3JFYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG4gICAgICAgICAgICAvLyBkaXNhYmxlIGF0dHJpYnV0ZSBpbmRleFxuICAgICAgICAgICAgaWYgKCBzdGF0ZS5lbmFibGVkVmVydGV4QXR0cmlidXRlc1sgaW5kZXggXSApIHtcbiAgICAgICAgICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoIGluZGV4ICk7XG4gICAgICAgICAgICAgICAgc3RhdGUuZW5hYmxlZFZlcnRleEF0dHJpYnV0ZXNbIGluZGV4IF0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSBib3VuZCBidWZmZXIuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3QXJyYXlzJy4gT3B0aW9uYWwuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5vZmZzZXQgLSBUaGUgaW5kZXggb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1ZlcnRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgaWYgKCB0aGlzLnN0YXRlLmJvdW5kVmVydGV4QnVmZmVyICE9PSB0aGlzLmJ1ZmZlciApIHtcbiAgICAgICAgICAgIHRocm93ICdBdHRlbXB0aW5nIHRvIGRyYXcgYW4gdW5ib3VuZCBWZXJ0ZXhCdWZmZXInO1xuICAgICAgICB9XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIHZhciBtb2RlID0gZ2xbIG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgXTtcbiAgICAgICAgdmFyIG9mZnNldCA9ICggb3B0aW9ucy5vZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5vZmZzZXQgOiB0aGlzLm9mZnNldDtcbiAgICAgICAgdmFyIGNvdW50ID0gKCBvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQgKSA/IG9wdGlvbnMuY291bnQgOiB0aGlzLmNvdW50O1xuICAgICAgICBpZiAoIGNvdW50ID09PSAwICkge1xuICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGEgY291bnQgb2YgMCc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJ1ZmZlckNvdW50ID0gdGhpcy5ieXRlTGVuZ3RoIC8gQllURVNfUEVSX0NPTVBPTkVOVDtcbiAgICAgICAgaWYgKCBjb3VudCArIG9mZnNldCA+IGJ1ZmZlckNvdW50ICkge1xuICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGBjb3VudGAgb2YgJyArIGNvdW50ICsgJyBhbmQgYG9mZnNldGAgb2YgJyArIG9mZnNldCArICcgb3ZlcmZsb3dzIHRoZSB0b3RhbCBjb3VudCBvZiB0aGUgYnVmZmVyICgnICsgYnVmZmVyQ291bnQgKyAnKSc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZHJhdyBlbGVtZW50c1xuICAgICAgICBnbC5kcmF3QXJyYXlzKCBtb2RlLCBvZmZzZXQsIGNvdW50ICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleEJ1ZmZlcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XHJcbiAgICB2YXIgQ09NUE9ORU5UX1RZUEUgPSAnRkxPQVQnO1xyXG4gICAgdmFyIEJZVEVTX1BFUl9DT01QT05FTlQgPSA0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBsZW5ndGggPiAwIGtleSBieSBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gaW50LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBtYXAgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgdmFsaWQgYXJyYXkgb2YgYXJndW1lbnRzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZUF0dHJpYnV0ZU1hcCggYXR0cmlidXRlcyApIHtcclxuICAgICAgICB2YXIgZ29vZEF0dHJpYnV0ZXMgPSBbXTtcclxuICAgICAgICBPYmplY3Qua2V5cyggYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlRmxvYXQoIGtleSApO1xyXG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IGtleSBpcyBhbiB2YWxpZCBpbnRlZ2VyXHJcbiAgICAgICAgICAgIGlmICggIVV0aWwuaXNJbnRlZ2VyKCBpbmRleCApIHx8IGluZGV4IDwgMCApIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdBdHRyaWJ1dGUgaW5kZXggYCcgKyBrZXkgKyAnYCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWxpZCBpbnRlZ2VyJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdmVydGljZXMgPSBhdHRyaWJ1dGVzW2tleV07XHJcbiAgICAgICAgICAgIC8vIGVuc3VyZSBhdHRyaWJ1dGUgaXMgdmFsaWRcclxuICAgICAgICAgICAgaWYgKCB2ZXJ0aWNlcyAmJlxyXG4gICAgICAgICAgICAgICAgdmVydGljZXMgaW5zdGFuY2VvZiBBcnJheSAmJlxyXG4gICAgICAgICAgICAgICAgdmVydGljZXMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGFkZCBhdHRyaWJ1dGUgZGF0YSBhbmQgaW5kZXhcclxuICAgICAgICAgICAgICAgIGdvb2RBdHRyaWJ1dGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2ZXJ0aWNlc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnRXJyb3IgcGFyc2luZyBhdHRyaWJ1dGUgb2YgaW5kZXggYCcgKyBrZXkgKyAnYCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzb3J0IGF0dHJpYnV0ZXMgYXNjZW5kaW5nIGJ5IGluZGV4XHJcbiAgICAgICAgZ29vZEF0dHJpYnV0ZXMuc29ydChmdW5jdGlvbihhLGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnb29kQXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBjb21wb25lbnQncyBieXRlIHNpemUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50IHRvIG1lYXN1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2ludGVnZXJ9IFRoZSBieXRlIHNpemUgb2YgdGhlIGNvbXBvbmVudC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50U2l6ZSggY29tcG9uZW50ICkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIHZlY3RvclxyXG4gICAgICAgIGlmICggY29tcG9uZW50LnggIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgLy8gMSBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgIGlmICggY29tcG9uZW50LnkgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIC8vIDIgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgaWYgKCBjb21wb25lbnQueiAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDMgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggY29tcG9uZW50LncgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNCBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjaGVjayBpZiBhcnJheVxyXG4gICAgICAgIGlmICggY29tcG9uZW50IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkZWZhdWx0IHRvIDEgb3RoZXJ3aXNlXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSB0eXBlLCBzaXplLCBhbmQgb2Zmc2V0IGZvciBlYWNoIGF0dHJpYnV0ZSBpbiB0aGUgYXR0cmlidXRlIGFycmF5IGFsb25nIHdpdGggdGhlIGxlbmd0aCBhbmQgc3RyaWRlIG9mIHRoZSBwYWNrYWdlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlcnRleFBhY2thZ2V9IHZlcnRleFBhY2thZ2UgLSBUaGUgVmVydGV4UGFja2FnZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIC0gVGhlIGFycmF5IG9mIHZlcnRleCBhdHRyaWJ1dGVzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRQb2ludGVyc0FuZFN0cmlkZSggdmVydGV4UGFja2FnZSwgYXR0cmlidXRlcyApIHtcclxuICAgICAgICB2YXIgc2hvcnRlc3RBcnJheSA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IDA7XHJcbiAgICAgICAgLy8gY2xlYXIgcG9pbnRlcnNcclxuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzID0ge307XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggYXR0cmlidXRlXHJcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGljZXMgKSB7XHJcbiAgICAgICAgICAgIC8vIHNldCBzaXplIHRvIG51bWJlciBvZiBjb21wb25lbnRzIGluIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgdmFyIHNpemUgPSBnZXRDb21wb25lbnRTaXplKCB2ZXJ0aWNlcy5kYXRhWzBdICk7XHJcbiAgICAgICAgICAgIC8vIGxlbmd0aCBvZiB0aGUgcGFja2FnZSB3aWxsIGJlIHRoZSBzaG9ydGVzdCBhdHRyaWJ1dGUgYXJyYXkgbGVuZ3RoXHJcbiAgICAgICAgICAgIHNob3J0ZXN0QXJyYXkgPSBNYXRoLm1pbiggc2hvcnRlc3RBcnJheSwgdmVydGljZXMuZGF0YS5sZW5ndGggKTtcclxuICAgICAgICAgICAgLy8gc3RvcmUgcG9pbnRlciB1bmRlciBpbmRleFxyXG4gICAgICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzWyB2ZXJ0aWNlcy5pbmRleCBdID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA6IENPTVBPTkVOVF9UWVBFLFxyXG4gICAgICAgICAgICAgICAgc2l6ZSA6IHNpemUsXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgOiBvZmZzZXQgKiBCWVRFU19QRVJfQ09NUE9ORU5UXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIGFjY3VtdWxhdGUgYXR0cmlidXRlIG9mZnNldFxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gc2l6ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzZXQgc3RyaWRlIHRvIHRvdGFsIG9mZnNldFxyXG4gICAgICAgIHZlcnRleFBhY2thZ2Uuc3RyaWRlID0gb2Zmc2V0ICogQllURVNfUEVSX0NPTVBPTkVOVDtcclxuICAgICAgICAvLyBzZXQgbGVuZ3RoIG9mIHBhY2thZ2UgdG8gdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcclxuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLmxlbmd0aCA9IHNob3J0ZXN0QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgc2luZ2xlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0cmlkZSAtIFRoZSBvZiBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V0MUNvbXBvbmVudEF0dHIoIGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUgKSB7XHJcbiAgICAgICAgdmFyIHZlcnRleCwgaSwgajtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHZlcnRleCA9IHZlcnRpY2VzW2ldO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XHJcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoIHN0cmlkZSAqIGkgKTtcclxuICAgICAgICAgICAgaWYgKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyW2pdID0gdmVydGV4Lng7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHZlcnRleFswXSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyW2pdID0gdmVydGV4WzBdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyW2pdID0gdmVydGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIGRvdWJsZSBjb21wb25lbnQgYXR0cmlidXRlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdHJpZGUgLSBUaGUgb2Ygc3RyaWRlIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldDJDb21wb25lbnRBdHRyKCBidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlICkge1xyXG4gICAgICAgIHZhciB2ZXJ0ZXgsIGksIGo7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPGxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiB0aGUgYnVmZmVyIHRvIHRoZSBwYXJ0aWN1bGFyIHZlcnRleFxyXG4gICAgICAgICAgICBqID0gb2Zmc2V0ICsgKCBzdHJpZGUgKiBpICk7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltqXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgIGJ1ZmZlcltqKzFdID0gKCB2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgdHJpcGxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0cmlkZSAtIFRoZSBvZiBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V0M0NvbXBvbmVudEF0dHIoIGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUgKSB7XHJcbiAgICAgICAgdmFyIHZlcnRleCwgaSwgajtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHZlcnRleCA9IHZlcnRpY2VzW2ldO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XHJcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoIHN0cmlkZSAqIGkgKTtcclxuICAgICAgICAgICAgYnVmZmVyW2pdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgYnVmZmVyW2orMV0gPSAoIHZlcnRleC55ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xyXG4gICAgICAgICAgICBidWZmZXJbaisyXSA9ICggdmVydGV4LnogIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnogOiB2ZXJ0ZXhbMl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHF1YWRydXBsZSBjb21wb25lbnQgYXR0cmlidXRlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdHJpZGUgLSBUaGUgb2Ygc3RyaWRlIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldDRDb21wb25lbnRBdHRyKCBidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlICkge1xyXG4gICAgICAgIHZhciB2ZXJ0ZXgsIGksIGo7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPGxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiB0aGUgYnVmZmVyIHRvIHRoZSBwYXJ0aWN1bGFyIHZlcnRleFxyXG4gICAgICAgICAgICBqID0gb2Zmc2V0ICsgKCBzdHJpZGUgKiBpICk7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltqXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgIGJ1ZmZlcltqKzFdID0gKCB2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcclxuICAgICAgICAgICAgYnVmZmVyW2orMl0gPSAoIHZlcnRleC56ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xyXG4gICAgICAgICAgICBidWZmZXJbaiszXSA9ICggdmVydGV4LncgIT09IHVuZGVmaW5lZCApID8gdmVydGV4LncgOiB2ZXJ0ZXhbM107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGFuIFZlcnRleFBhY2thZ2Ugb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFZlcnRleFBhY2thZ2VcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB2ZXJ0ZXggcGFja2FnZSBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlcyB0byBpbnRlcmxlYXZlIGtleWVkIGJ5IGluZGV4LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWZXJ0ZXhQYWNrYWdlKCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIGlmICggYXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCggYXR0cmlidXRlcyApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSgwKTtcclxuICAgICAgICAgICAgdGhpcy5wb2ludGVycyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgZGF0YSB0byBiZSBpbnRlcmxlYXZlZCBpbnNpZGUgdGhlIHBhY2thZ2UuIFRoaXMgY2xlYXJzIGFueSBwcmV2aW91c2x5IGV4aXN0aW5nIGRhdGEuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlcyB0byBpbnRlcmxlYXZlZCwga2V5ZWQgYnkgaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlcnRleFBhY2thZ2V9IC0gVGhlIHZlcnRleCBwYWNrYWdlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBWZXJ0ZXhQYWNrYWdlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiggYXR0cmlidXRlcyApIHtcclxuICAgICAgICAvLyByZW1vdmUgYmFkIGF0dHJpYnV0ZXNcclxuICAgICAgICBhdHRyaWJ1dGVzID0gcGFyc2VBdHRyaWJ1dGVNYXAoIGF0dHJpYnV0ZXMgKTtcclxuICAgICAgICAvLyBzZXQgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCBzdHJpZGVcclxuICAgICAgICBzZXRQb2ludGVyc0FuZFN0cmlkZSggdGhpcywgYXR0cmlidXRlcyApO1xyXG4gICAgICAgIC8vIHNldCBzaXplIG9mIGRhdGEgdmVjdG9yXHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBzdHJpZGUgPSB0aGlzLnN0cmlkZSAvIEJZVEVTX1BFUl9DT01QT05FTlQ7XHJcbiAgICAgICAgdmFyIHBvaW50ZXJzID0gdGhpcy5wb2ludGVycztcclxuICAgICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KCBsZW5ndGggKiBzdHJpZGUgKTtcclxuICAgICAgICAvLyBmb3IgZWFjaCB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5XHJcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGljZXMgKSB7XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlclxyXG4gICAgICAgICAgICB2YXIgcG9pbnRlciA9IHBvaW50ZXJzWyB2ZXJ0aWNlcy5pbmRleCBdO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHBvaW50ZXJzIG9mZnNldFxyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gcG9pbnRlci5vZmZzZXQgLyBCWVRFU19QRVJfQ09NUE9ORU5UO1xyXG4gICAgICAgICAgICAvLyBjb3B5IHZlcnRleCBkYXRhIGludG8gYXJyYXlidWZmZXJcclxuICAgICAgICAgICAgc3dpdGNoICggcG9pbnRlci5zaXplICkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHNldDJDb21wb25lbnRBdHRyKCBidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICBzZXQzQ29tcG9uZW50QXR0ciggYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0NENvbXBvbmVudEF0dHIoIGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBzZXQxQ29tcG9uZW50QXR0ciggYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhQYWNrYWdlO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcclxuICAgIHZhciBXZWJHTENvbnRleHRTdGF0ZSA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0U3RhdGUnKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmQgdGhlIHZpZXdwb3J0IHRvIHRoZSByZW5kZXJpbmcgY29udGV4dC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZpZXdwb3J0fSB2aWV3cG9ydCAtIFRoZSB2aWV3cG9ydCBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb3ZlcnJpZGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvdmVycmlkZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIGhvcml6b250YWwgb2Zmc2V0LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgdmVydGljYWwgb2Zmc2V0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXQoIHZpZXdwb3J0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHZpZXdwb3J0LmdsO1xyXG4gICAgICAgIHggPSAoIHggIT09IHVuZGVmaW5lZCApID8geCA6IDA7XHJcbiAgICAgICAgeSA9ICggeSAhPT0gdW5kZWZpbmVkICkgPyB5IDogMDtcclxuICAgICAgICB3aWR0aCA9ICggd2lkdGggIT09IHVuZGVmaW5lZCApID8gd2lkdGggOiB2aWV3cG9ydC53aWR0aDtcclxuICAgICAgICBoZWlnaHQgPSAoIGhlaWdodCAhPT0gdW5kZWZpbmVkICkgPyBoZWlnaHQgOiB2aWV3cG9ydC5oZWlnaHQ7XHJcbiAgICAgICAgZ2wudmlld3BvcnQoIHgsIHksIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhbiBWaWV3cG9ydCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVmlld3BvcnRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB2aWV3cG9ydCBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdmlld3BvcnQgc3BlY2lmaWNhdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVmlld3BvcnQoIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gV2ViR0xDb250ZXh0U3RhdGUuZ2V0KCB0aGlzLmdsICk7XHJcbiAgICAgICAgLy8gc2V0IHNpemVcclxuICAgICAgICB0aGlzLnJlc2l6ZShcclxuICAgICAgICAgICAgc3BlYy53aWR0aCB8fCB0aGlzLmdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgc3BlYy5oZWlnaHQgfHwgdGhpcy5nbC5jYW52YXMuaGVpZ2h0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIHRoZSB2aWV3cG9ydHMgd2lkdGggYW5kIGhlaWdodC4gVGhpcyByZXNpemVzIHRoZSB1bmRlcmx5aW5nIGNhbnZhcyBlbGVtZW50LlxyXG4gICAgICogQG1lbWJlcm9mIFZpZXdwb3J0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVmlld3BvcnQucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAoIHdpZHRoIDw9IDAgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGB3aWR0aGAgb2YgJyArIHdpZHRoICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCAoIGhlaWdodCA8PSAwICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgaGVpZ2h0YCBvZiAnICsgaGVpZ2h0ICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZ2wuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5nbC5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFjdGl2YXRlcyB0aGUgdmlld3BvcnQgYW5kIHB1c2hlcyBpdCBvbnRvIHRoZSBzdGFjayB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHMuIFRoZSB1bmRlcmx5aW5nIGNhbnZhcyBlbGVtZW50IGlzIG5vdCBhZmZlY3RlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWaWV3cG9ydFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG92ZXJyaWRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgaG9yaXpvbnRhbCBvZmZzZXQgb3ZlcnJpZGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZpZXdwb3J0fSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFZpZXdwb3J0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oIHgsIHksIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgaWYgKCB4ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHggIT09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHhgIG9mICcgKyB4ICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB5ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHkgIT09ICdudW1iZXInICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHlgIG9mICcgKyB5ICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB3aWR0aCAhPT0gdW5kZWZpbmVkICYmICggdHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAoIHdpZHRoIDw9IDAgKSApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHdpZHRoYCBvZiAnICsgd2lkdGggKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIGhlaWdodCAhPT0gdW5kZWZpbmVkICYmICggdHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgKCBoZWlnaHQgPD0gMCApICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgaGVpZ2h0YCBvZiAnICsgaGVpZ2h0ICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZS52aWV3cG9ydHMucHVzaCh7XHJcbiAgICAgICAgICAgIHZpZXdwb3J0OiB0aGlzLFxyXG4gICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0KCB0aGlzLCB4LCB5LCB3aWR0aCwgaGVpZ2h0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUG9wcyBjdXJyZW50IHRoZSB2aWV3cG9ydCBvYmplY3QgYW5kIGFjdGl2YXRlcyB0aGUgdmlld3BvcnQgYmVuZWF0aCBpdC5cclxuICAgICAqIEBtZW1iZXJvZiBWaWV3cG9ydFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBWaWV3cG9ydC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB2YXIgdG9wID0gc3RhdGUudmlld3BvcnRzLnRvcCgpO1xyXG4gICAgICAgIGlmICggIXRvcCB8fCB0aGlzICE9PSB0b3Audmlld3BvcnQgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdWaWV3cG9ydCBpcyBub3QgdGhlIHRvcCBtb3N0IGVsZW1lbnQgb24gdGhlIHN0YWNrJztcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhdGUudmlld3BvcnRzLnBvcCgpO1xyXG4gICAgICAgIHRvcCA9IHN0YXRlLnZpZXdwb3J0cy50b3AoKTtcclxuICAgICAgICBpZiAoIHRvcCApIHtcclxuICAgICAgICAgICAgc2V0KCB0b3Audmlld3BvcnQsIHRvcC54LCB0b3AueSwgdG9wLndpZHRoLCB0b3AuaGVpZ2h0ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0KCB0aGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZpZXdwb3J0O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIEVYVEVOU0lPTlMgPSBbXG4gICAgICAgIC8vIHJhdGlmaWVkXG4gICAgICAgICdPRVNfdGV4dHVyZV9mbG9hdCcsXG4gICAgICAgICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0JyxcbiAgICAgICAgJ1dFQkdMX2xvc2VfY29udGV4dCcsXG4gICAgICAgICdPRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgICAnT0VTX3ZlcnRleF9hcnJheV9vYmplY3QnLFxuICAgICAgICAnV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycsXG4gICAgICAgICdXRUJHTF9kZWJ1Z19zaGFkZXJzJyxcbiAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjJyxcbiAgICAgICAgJ1dFQkdMX2RlcHRoX3RleHR1cmUnLFxuICAgICAgICAnT0VTX2VsZW1lbnRfaW5kZXhfdWludCcsXG4gICAgICAgICdFWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMnLFxuICAgICAgICAnRVhUX2ZyYWdfZGVwdGgnLFxuICAgICAgICAnV0VCR0xfZHJhd19idWZmZXJzJyxcbiAgICAgICAgJ0FOR0xFX2luc3RhbmNlZF9hcnJheXMnLFxuICAgICAgICAnT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyJyxcbiAgICAgICAgJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJyxcbiAgICAgICAgJ0VYVF9ibGVuZF9taW5tYXgnLFxuICAgICAgICAnRVhUX3NoYWRlcl90ZXh0dXJlX2xvZCcsXG4gICAgICAgIC8vIGNvbW11bml0eVxuICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2F0YycsXG4gICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMnLFxuICAgICAgICAnRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0JyxcbiAgICAgICAgJ1dFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCcsXG4gICAgICAgICdFWFRfc1JHQicsXG4gICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMSdcbiAgICBdO1xuICAgIHZhciBfYm91bmRDb250ZXh0ID0gbnVsbDtcbiAgICB2YXIgX2NvbnRleHRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIHJmYzQxMjIgdmVyc2lvbiA0IGNvbXBsaWFudCBVVUlELlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVVVJRCBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VVVJRCgpIHtcbiAgICAgICAgdmFyIHJlcGxhY2UgPSBmdW5jdGlvbiggYyApIHtcbiAgICAgICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICAgICAgICAgIHZhciB2ID0gKCBjID09PSAneCcgKSA/IHIgOiAoIHIgJiAweDMgfCAweDggKTtcbiAgICAgICAgICAgIHJldHVybiB2LnRvU3RyaW5nKCAxNiApO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSggL1t4eV0vZywgcmVwbGFjZSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBIVE1MQ2FudmFzRWxlbWVudCBlbGVtZW50LiBJZiB0aGVyZSBpcyBubyBpZCwgaXRcbiAgICAgKiBnZW5lcmF0ZXMgb25lIGFuZCBhcHBlbmRzIGl0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBUaGUgQ2FudmFzIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBDYW52YXMgaWQgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldElkKCBjYW52YXMgKSB7XG4gICAgICAgIGlmICggIWNhbnZhcy5pZCApIHtcbiAgICAgICAgICAgIGNhbnZhcy5pZCA9IGdldFVVSUQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FudmFzLmlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBDYW52YXMgZWxlbWVudCBvYmplY3QgZnJvbSBlaXRoZXIgYW4gZXhpc3Rpbmcgb2JqZWN0LCBvciBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWQgb3Igc2VsZWN0b3Igc3RyaW5nLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENhbnZhcyggYXJnICkge1xuICAgICAgICBpZiAoIGFyZyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50ICkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGFyZyApIHx8XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggYXJnICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gcmV0cmVpdmUgYSB3cmFwcGVkIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdCB0byBjcmVhdGUgdGhlIGNvbnRleHQgdW5kZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgY29udGV4dCB3cmFwcGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENvbnRleHRXcmFwcGVyKCBhcmcgKSB7XG4gICAgICAgIGlmICggYXJnID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICBpZiAoIF9ib3VuZENvbnRleHQgKSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGxhc3QgYm91bmQgY29udGV4dFxuICAgICAgICAgICAgICAgIHJldHVybiBfYm91bmRDb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGdldENhbnZhcyggYXJnICk7XG4gICAgICAgICAgICBpZiAoIGNhbnZhcyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHRzWyBnZXRJZCggY2FudmFzICkgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBubyBib3VuZCBjb250ZXh0IG9yIGFyZ3VtZW50XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYWxsIGtub3duIGV4dGVuc2lvbnMgZm9yIGEgcHJvdmlkZWQgV2ViR0xSZW5kZXJpbmdDb250ZXh0LiBTdG9yZXMgdGhlIHJlc3VsdHMgaW4gdGhlIGNvbnRleHQgd3JhcHBlciBmb3IgbGF0ZXIgcXVlcmllcy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRXcmFwcGVyIC0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkRXh0ZW5zaW9ucyggY29udGV4dFdyYXBwZXIgKSB7XG4gICAgICAgIHZhciBnbCA9IGNvbnRleHRXcmFwcGVyLmdsO1xuICAgICAgICBFWFRFTlNJT05TLmZvckVhY2goIGZ1bmN0aW9uKCBpZCApIHtcbiAgICAgICAgICAgIGNvbnRleHRXcmFwcGVyLmV4dGVuc2lvbnNbIGlkIF0gPSBnbC5nZXRFeHRlbnNpb24oIGlkICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIGNyZWF0ZSBhIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3cmFwcGVkIGluc2lkZSBhbiBvYmplY3Qgd2hpY2ggd2lsbCBhbHNvIHN0b3JlIHRoZSBleHRlbnNpb24gcXVlcnkgcmVzdWx0cy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdCB0byBjcmVhdGUgdGhlIGNvbnRleHQgdW5kZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R9fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBjb250ZXh0IHdyYXBwZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udGV4dFdyYXBwZXIoIGNhbnZhcywgb3B0aW9ucyApIHtcbiAgICAgICAgdmFyIGdsID0gY2FudmFzLmdldENvbnRleHQoICd3ZWJnbCcsIG9wdGlvbnMgKSB8fCBjYW52YXMuZ2V0Q29udGV4dCggJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdGlvbnMgKTtcbiAgICAgICAgLy8gd3JhcCBjb250ZXh0XG4gICAgICAgIHZhciBjb250ZXh0V3JhcHBlciA9IHtcbiAgICAgICAgICAgIGlkOiBnZXRJZCggY2FudmFzICksXG4gICAgICAgICAgICBnbDogZ2wsXG4gICAgICAgICAgICBleHRlbnNpb25zOiB7fVxuICAgICAgICB9O1xuICAgICAgICAvLyBsb2FkIFdlYkdMIGV4dGVuc2lvbnNcbiAgICAgICAgbG9hZEV4dGVuc2lvbnMoIGNvbnRleHRXcmFwcGVyICk7XG4gICAgICAgIC8vIGFkZCBjb250ZXh0IHdyYXBwZXIgdG8gbWFwXG4gICAgICAgIF9jb250ZXh0c1sgZ2V0SWQoIGNhbnZhcyApIF0gPSBjb250ZXh0V3JhcHBlcjtcbiAgICAgICAgLy8gYmluZCB0aGUgY29udGV4dFxuICAgICAgICBfYm91bmRDb250ZXh0ID0gY29udGV4dFdyYXBwZXI7XG4gICAgICAgIHJldHVybiBjb250ZXh0V3JhcHBlcjtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0cmlldmVzIGFuIGV4aXN0aW5nIFdlYkdMIGNvbnRleHQgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudCBhbmQgYmluZHMgaXQuIFdoaWxlIGJvdW5kLCB0aGUgYWN0aXZlIGNvbnRleHQgd2lsbCBiZSB1c2VkIGltcGxpY2l0bHkgYnkgYW55IGluc3RhbnRpYXRlZCBgZXNwZXJgIGNvbnN0cnVjdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7V2ViR0xDb250ZXh0fSBUaGlzIG5hbWVzcGFjZSwgdXNlZCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBiaW5kOiBmdW5jdGlvbiggYXJnICkge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlciggYXJnICk7XG4gICAgICAgICAgICBpZiAoIHdyYXBwZXIgKSB7XG4gICAgICAgICAgICAgICAgX2JvdW5kQ29udGV4dCA9IHdyYXBwZXI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyAnTm8gY29udGV4dCBleGlzdHMgZm9yIHByb3ZpZGVkIGFyZ3VtZW50IGAnICsgYXJnICsgJ2AnO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRyaWV2ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50LiBJZiBubyBjb250ZXh0IGV4aXN0cywgb25lIGlzIGNyZWF0ZWQuXG4gICAgICAgICAqIER1cmluZyBjcmVhdGlvbiBhdHRlbXB0cyB0byBsb2FkIGFsbCBleHRlbnNpb25zIGZvdW5kIGF0OiBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS93ZWJnbC9leHRlbnNpb25zLy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH19IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBUaGUgV2ViR0xSZW5kZXJpbmdDb250ZXh0IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24oIGFyZywgb3B0aW9ucyApIHtcbiAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoIGFyZyApO1xuICAgICAgICAgICAgaWYgKCB3cmFwcGVyICkge1xuICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBuYXRpdmUgV2ViR0xSZW5kZXJpbmdDb250ZXh0XG4gICAgICAgICAgICAgICByZXR1cm4gd3JhcHBlci5nbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGdldCBjYW52YXMgZWxlbWVudFxuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGdldENhbnZhcyggYXJnICk7XG4gICAgICAgICAgICAvLyB0cnkgdG8gZmluZCBvciBjcmVhdGUgY29udGV4dFxuICAgICAgICAgICAgaWYgKCAhY2FudmFzICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdDb250ZXh0IGNvdWxkIG5vdCBiZSBhc3NvY2lhdGVkIHdpdGggYXJndW1lbnQgb2YgdHlwZSBgJyArICggdHlwZW9mIGFyZyApICsgJ2AnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3JlYXRlIGNvbnRleHRcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb250ZXh0V3JhcHBlciggY2FudmFzLCBvcHRpb25zICkuZ2w7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBvYmplY3QgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fX0gb3B0aW9ucyAtIFBhcmFtZXRlcnMgdG8gdGhlIHdlYmdsIGNvbnRleHQsIG9ubHkgdXNlZCBkdXJpbmcgaW5zdGFudGlhdGlvbi4gT3B0aW9uYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiggYXJnICkge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlciggYXJnICk7XG4gICAgICAgICAgICBpZiAoIHdyYXBwZXIgKSB7XG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgZGVsZXRlIF9jb250ZXh0c1sgd3JhcHBlci5pZCBdO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpZiBjdXJyZW50bHkgYm91bmRcbiAgICAgICAgICAgICAgICBpZiAoIHdyYXBwZXIgPT09IF9ib3VuZENvbnRleHQgKSB7XG4gICAgICAgICAgICAgICAgICAgIF9ib3VuZENvbnRleHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NvbnRleHQgY291bGQgbm90IGJlIGZvdW5kIG9yIGRlbGV0ZWQgZm9yIGFyZ3VtZW50IG9mIHR5cGUgYCcgKyAoIHR5cGVvZiBhcmcgKSArICdgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3VwcG9ydGVkIGV4dGVuc2lvbnMgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuIElmIG5vIGNvbnRleHQgaXMgYm91bmQsIGl0IHdpbGwgcmV0dXJuIGFuIGVtcHR5IGFycmF5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gQWxsIHN1cHBvcnRlZCBleHRlbnNpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgc3VwcG9ydGVkRXh0ZW5zaW9uczogZnVuY3Rpb24oIGFyZyApIHtcbiAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoIGFyZyApO1xuICAgICAgICAgICAgaWYgKCB3cmFwcGVyICkge1xuICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuICAgICAgICAgICAgICAgIHZhciBzdXBwb3J0ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyggZXh0ZW5zaW9ucyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggZXh0ZW5zaW9uc1sga2V5IF0gKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwb3J0ZWQucHVzaCgga2V5ICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwcG9ydGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgJ05vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQnO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB1bnN1cHBvcnRlZCBleHRlbnNpb25zIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LiBJZiBubyBjb250ZXh0IGlzIGJvdW5kLCBpdCB3aWxsIHJldHVybiBhbiBlbXB0eSBhcnJheS5cbiAgICAgICAgICogYW4gZW1wdHkgYXJyYXkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBBbGwgdW5zdXBwb3J0ZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIHVuc3VwcG9ydGVkRXh0ZW5zaW9uczogZnVuY3Rpb24oIGFyZyApIHtcbiAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoIGFyZyApO1xuICAgICAgICAgICAgaWYgKCB3cmFwcGVyICkge1xuICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuICAgICAgICAgICAgICAgIHZhciB1bnN1cHBvcnRlZCA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKCBleHRlbnNpb25zICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXh0ZW5zaW9uc1sga2V5IF0gKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bnN1cHBvcnRlZC5wdXNoKCBrZXkgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB1bnN1cHBvcnRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93ICdObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50JztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIGFuIGV4dGVuc2lvbiBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKiAnZmFsc2UnLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb24gLSBUaGUgZXh0ZW5zaW9uIG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvdmlkZWQgZXh0ZW5zaW9uIGhhcyBiZWVuIGxvYWRlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAqL1xuICAgICAgICBjaGVja0V4dGVuc2lvbjogZnVuY3Rpb24oIGFyZywgZXh0ZW5zaW9uICkge1xuICAgICAgICAgICAgaWYgKCAhZXh0ZW5zaW9uICkge1xuICAgICAgICAgICAgICAgIC8vIHNoaWZ0IHBhcmFtZXRlcnMgaWYgbm8gY2FudmFzIGFyZyBpcyBwcm92aWRlZFxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IGFyZztcbiAgICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKCBhcmcgKTtcbiAgICAgICAgICAgIGlmICggd3JhcHBlciApIHtcbiAgICAgICAgICAgICAgICB2YXIgZXh0ZW5zaW9ucyA9IHdyYXBwZXIuZXh0ZW5zaW9ucztcbiAgICAgICAgICAgICAgICByZXR1cm4gZXh0ZW5zaW9uc1sgZXh0ZW5zaW9uIF0gPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyAnTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudCc7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgU3RhY2sgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrJyk7XHJcbiAgICB2YXIgU3RhY2tNYXAgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrTWFwJyk7XHJcbiAgICB2YXIgX3N0YXRlcyA9IHt9O1xyXG5cclxuICAgIGZ1bmN0aW9uIFdlYkdMQ29udGV4dFN0YXRlKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBjdXJyZW50bHkgYm91bmQgdmVydGV4IGJ1ZmZlci5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYm91bmRWZXJ0ZXhCdWZmZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgY3VycmVudGx5IGVuYWJsZWQgdmVydGV4IGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmVuYWJsZWRWZXJ0ZXhBdHRyaWJ1dGVzID0ge1xyXG4gICAgICAgICAgICAnMCc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnMSc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnMic6IGZhbHNlLFxyXG4gICAgICAgICAgICAnMyc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnNCc6IGZhbHNlLFxyXG4gICAgICAgICAgICAnNSc6IGZhbHNlXHJcbiAgICAgICAgICAgIC8vIC4uLiBvdGhlcnMgd2lsbCBiZSBhZGRlZCBhcyBuZWVkZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgY3VycmVudGx5IGJvdW5kIGluZGV4IGJ1ZmZlci5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYm91bmRJbmRleEJ1ZmZlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBzdGFjayBvZiBwdXNoZWQgc2hhZGVycy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2hhZGVycyA9IG5ldyBTdGFjaygpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgc3RhY2sgb2YgcHVzaGVkIHZpZXdwb3J0cy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudmlld3BvcnRzID0gbmV3IFN0YWNrKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBzdGFjayBvZiBwdXNoZWQgcmVuZGVyIHRhcmdldHMuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnJlbmRlclRhcmdldHMgPSBuZXcgU3RhY2soKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG1hcCBvZiBzdGFja3MgcHVzaGVkIHRleHR1cmUyRHMsIGtleWVkIGJ5IHRleHR1cmUgdW5pdCBpbmRleC5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGV4dHVyZTJEcyA9IG5ldyBTdGFja01hcCgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbWFwIG9mIHB1c2hlZCB0ZXh0dXJlMkRzLCwga2V5ZWQgYnkgdGV4dHVyZSB1bml0IGluZGV4LlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZXh0dXJlQ3ViZU1hcHMgPSBuZXcgU3RhY2tNYXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiggZ2wgKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IGdsLmNhbnZhcy5pZDtcclxuICAgICAgICAgICAgaWYgKCAhX3N0YXRlc1sgaWQgXSApIHtcclxuICAgICAgICAgICAgICAgIF9zdGF0ZXNbIGlkIF0gPSBuZXcgV2ViR0xDb250ZXh0U3RhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gX3N0YXRlc1sgaWQgXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgIEluZGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvSW5kZXhCdWZmZXInKSxcclxuICAgICAgICBSZW5kZXJhYmxlOiByZXF1aXJlKCcuL2NvcmUvUmVuZGVyYWJsZScpLFxyXG4gICAgICAgIFJlbmRlclRhcmdldDogcmVxdWlyZSgnLi9jb3JlL1JlbmRlclRhcmdldCcpLFxyXG4gICAgICAgIFNoYWRlcjogcmVxdWlyZSgnLi9jb3JlL1NoYWRlcicpLFxyXG4gICAgICAgIFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL1RleHR1cmUyRCcpLFxyXG4gICAgICAgIENvbG9yVGV4dHVyZTJEOiByZXF1aXJlKCcuL2NvcmUvQ29sb3JUZXh0dXJlMkQnKSxcclxuICAgICAgICBEZXB0aFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL0RlcHRoVGV4dHVyZTJEJyksXHJcbiAgICAgICAgVGV4dHVyZUN1YmVNYXA6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlQ3ViZU1hcCcpLFxyXG4gICAgICAgIFZlcnRleEJ1ZmZlcjogcmVxdWlyZSgnLi9jb3JlL1ZlcnRleEJ1ZmZlcicpLFxyXG4gICAgICAgIFZlcnRleFBhY2thZ2U6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhQYWNrYWdlJyksXHJcbiAgICAgICAgVmlld3BvcnQ6IHJlcXVpcmUoJy4vY29yZS9WaWV3cG9ydCcpLFxyXG4gICAgICAgIFdlYkdMQ29udGV4dDogcmVxdWlyZSgnLi9jb3JlL1dlYkdMQ29udGV4dCcpXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0SXRlcmF0b3IoIGFyZyApIHtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG4gICAgICAgIHZhciBsZW47XHJcbiAgICAgICAgaWYgKCBBcnJheS5pc0FycmF5KCBhcmcgKSApIHtcclxuICAgICAgICAgICAgbGVuID0gYXJnLmxlbmd0aDtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBpIDogbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyggYXJnICk7XHJcbiAgICAgICAgbGVuID0ga2V5cy5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIHJldHVybiBpIDwgbGVuID8ga2V5c1tpXSA6IG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbmNlKCBmbiApIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICggZm4gPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG4gICAgICAgICAgICBmbiA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlYWNoKCBvYmplY3QsIGl0ZXJhdG9yLCBjYWxsYmFjayApIHtcclxuICAgICAgICBjYWxsYmFjayA9IG9uY2UoIGNhbGxiYWNrICk7XHJcbiAgICAgICAgdmFyIGtleTtcclxuICAgICAgICB2YXIgY29tcGxldGVkID0gMDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZG9uZSggZXJyICkge1xyXG4gICAgICAgICAgICBjb21wbGV0ZWQtLTtcclxuICAgICAgICAgICAgaWYgKCBlcnIgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggZXJyICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGtleSA9PT0gbnVsbCAmJiBjb21wbGV0ZWQgPD0gMCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGtleSBpcyBudWxsIGluIGNhc2UgaXRlcmF0b3IgaXNuJ3QgZXhoYXVzdGVkIGFuZCBkb25lXHJcbiAgICAgICAgICAgICAgICAvLyB3YXMgcmVzb2x2ZWQgc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBudWxsICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpdGVyID0gZ2V0SXRlcmF0b3Iob2JqZWN0KTtcclxuICAgICAgICB3aGlsZSAoICgga2V5ID0gaXRlcigpICkgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xyXG4gICAgICAgICAgICBpdGVyYXRvciggb2JqZWN0WyBrZXkgXSwga2V5LCBkb25lICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggY29tcGxldGVkID09PSAwICkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayggbnVsbCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRXhlY3V0ZSBhIHNldCBvZiBmdW5jdGlvbnMgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIGhhdmUgYmVlblxyXG4gICAgICAgICAqIGNvbXBsZXRlZCwgZXhlY3V0ZSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uIEpvYnMgbWF5IGJlIHBhc3NlZFxyXG4gICAgICAgICAqIGFzIGFuIGFycmF5IG9yIG9iamVjdC4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgcGFzc2VkIHRoZVxyXG4gICAgICAgICAqIHJlc3VsdHMgaW4gdGhlIHNhbWUgZm9ybWF0IGFzIHRoZSB0YXNrcy4gQWxsIHRhc2tzIG11c3QgaGF2ZSBhY2NlcHRcclxuICAgICAgICAgKiBhbmQgZXhlY3V0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSB0YXNrcyAtIFRoZSBzZXQgb2YgZnVuY3Rpb25zIHRvIGV4ZWN1dGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHBhcmFsbGVsOiBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gQXJyYXkuaXNBcnJheSggdGFza3MgKSA/IFtdIDoge307XHJcbiAgICAgICAgICAgIGVhY2goIHRhc2tzLCBmdW5jdGlvbiggdGFzaywga2V5LCBkb25lICkge1xyXG4gICAgICAgICAgICAgICAgdGFzayggZnVuY3Rpb24oIGVyciwgcmVzICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbIGtleSBdID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoIGVyciApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCBlcnIgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggZXJyLCByZXN1bHRzICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIEdFVCByZXF1ZXN0IGNyZWF0ZSBhbiBJbWFnZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuc3VjY2VzcyAtIFRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmVycm9yIC0gVGhlIGVycm9yIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZDogZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMuc3VjY2VzcyApIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKCBpbWFnZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5lcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVyciA9ICdVbmFibGUgdG8gbG9hZCBpbWFnZSBmcm9tIFVSTDogYCcgKyBldmVudC5wYXRoWzBdLmN1cnJlbnRTcmMgKyAnYCc7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoIGVyciApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSBvcHRpb25zLnVybDtcbiAgICAgICAgfVxuICAgIH07XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIHN0YWNrIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBTdGFja1xyXG4gICAgICogQGNsYXNzZGVzYyBBIHN0YWNrIGludGVyZmFjZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU3RhY2soKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQdXNoIGEgdmFsdWUgb250byB0aGUgc3RhY2suXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgc3RhY2sgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggdmFsdWUgKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goIHZhbHVlICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUG9wIGEgdmFsdWUgb2ZmIHRoZSBzdGFjay4gUmV0dXJucyBgdW5kZWZpbmVkYCBpZiB0aGVyZSBpcyBubyB2YWx1ZSBvblxyXG4gICAgICogdGhlIHN0YWNrLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdmFsdWUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIHBvcHBlZCBvZmYgdGhlIHN0YWNrLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5wb3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRvcCBvZiB0aGUgc3RhY2ssIHdpdGhvdXQgcmVtb3ZpbmcgaXQuIFJldHVybnNcclxuICAgICAqIGB1bmRlZmluZWRgIGlmIHRoZXJlIGlzIG5vIHZhbHVlIG9uIHRoZSBzdGFjay5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKi9cclxuICAgIFN0YWNrLnByb3RvdHlwZS50b3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmRhdGEubGVuZ3RoIC0gMTtcclxuICAgICAgICBpZiAoIGluZGV4IDwgMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWyBpbmRleCBdO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFN0YWNrID0gcmVxdWlyZSgnLi9TdGFjaycpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgbWFwIG9mIHN0YWNrIG9iamVjdHMuXHJcbiAgICAgKiBAY2xhc3MgU3RhY2tNYXBcclxuICAgICAqIEBjbGFzc2Rlc2MgQSBoYXNobWFwIG9mIHN0YWNrcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU3RhY2tNYXAoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFja3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFB1c2ggYSB2YWx1ZSBvbnRvIHRoZSBzdGFjayB1bmRlciBhIGdpdmVuIGtleS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleS5cclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gcHVzaCBvbnRvIHRoZSBzdGFjay5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgc3RhY2sgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgU3RhY2tNYXAucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcclxuICAgICAgICBpZiAoICF0aGlzLnN0YWNrc1sga2V5IF0gKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2tzWyBrZXkgXSA9IG5ldyBTdGFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YWNrc1sga2V5IF0ucHVzaCggdmFsdWUgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3AgYSB2YWx1ZSBvZmYgdGhlIHN0YWNrLiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIHRoZXJlIGlzIG5vIHZhbHVlIG9uXHJcbiAgICAgKiB0aGUgc3RhY2ssIG9yIHRoZXJlIGlzIG5vIHN0YWNrIGZvciB0aGUga2V5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBUaGUga2V5LlxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBwdXNoIG9udG8gdGhlIHN0YWNrLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBwb3BwZWQgb2ZmIHRoZSBzdGFjay5cclxuICAgICAqL1xyXG4gICAgU3RhY2tNYXAucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCBrZXkgKSB7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5zdGFja3NbIGtleSBdICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrc1sga2V5IF0ucG9wKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudCB0b3Agb2YgdGhlIHN0YWNrLCB3aXRob3V0IHJlbW92aW5nIGl0LiBSZXR1cm5zXHJcbiAgICAgKiBgdW5kZWZpbmVkYCBpZiB0aGVyZSBpcyBubyB2YWx1ZSBvbiB0aGUgc3RhY2sgb3Igbm8gc3RhY2sgZm9yIHRoZSBrZXkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIFRoZSBrZXkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrLlxyXG4gICAgICovXHJcbiAgICBTdGFja01hcC5wcm90b3R5cGUudG9wID0gZnVuY3Rpb24oIGtleSApIHtcclxuICAgICAgICBpZiAoICF0aGlzLnN0YWNrc1sga2V5IF0gKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tzWyBrZXkgXS50b3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTdGFja01hcDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyIGFuZCBpcyBhbiBpbnRlZ2VyLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBudW0gLSBUaGUgbnVtYmVyIHRvIHRlc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgdmFsdWUgaXMgYSBudW1iZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNJbnRlZ2VyOiBmdW5jdGlvbiggbnVtICkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIG51bSA9PT0gJ251bWJlcicgJiYgKCBudW0gJSAxICkgPT09IDA7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBpbnRlZ2VyIGlzIGEgcG93ZXIgb2YgdHdvLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBudW0gLSBUaGUgbnVtYmVyIHRvIHRlc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgbnVtYmVyIGlzIGEgcG93ZXIgb2YgdHdvLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzUG93ZXJPZlR3bzogZnVuY3Rpb24oIG51bSApIHtcclxuICAgICAgICAgICAgcmV0dXJuICggbnVtICE9PSAwICkgPyAoIG51bSAmICggbnVtIC0gMSApICkgPT09IDAgOiBmYWxzZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvIGZvciBhIG51bWJlci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEV4LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogICAgIDIwMCAtPiAyNTZcclxuICAgICAgICAgKiAgICAgMjU2IC0+IDI1NlxyXG4gICAgICAgICAqICAgICAyNTcgLT4gNTEyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG51bSAtIFRoZSBudW1iZXIgdG8gbW9kaWZ5LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2ludGVnZXJ9IC0gTmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3by5cclxuICAgICAgICAgKi9cclxuICAgICAgICBuZXh0SGlnaGVzdFBvd2VyT2ZUd286IGZ1bmN0aW9uKCBudW0gKSB7XHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICBpZiAoIG51bSAhPT0gMCApIHtcclxuICAgICAgICAgICAgICAgIG51bSA9IG51bS0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoIGk9MTsgaTwzMjsgaTw8PTEgKSB7XHJcbiAgICAgICAgICAgICAgICBudW0gPSBudW0gfCBudW0gPj4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVtICsgMTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIFhNTEh0dHBSZXF1ZXN0IEdFVCByZXF1ZXN0IHRvIHRoZSBzdXBwbGllZCB1cmwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuc3VjY2VzcyAtIFRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmVycm9yIC0gVGhlIGVycm9yIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnJlc3BvbnNlVHlwZSAtIFRoZSByZXNwb25zZVR5cGUgb2YgdGhlIFhIUi5cbiAgICAgICAgICovXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4oICdHRVQnLCBvcHRpb25zLnVybCwgdHJ1ZSApO1xuICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCByZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggcmVxdWVzdC5zdGF0dXMgPT09IDIwMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5zdWNjZXNzICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyggcmVxdWVzdC5yZXNwb25zZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLmVycm9yICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoICdHRVQgJyArIHJlcXVlc3QucmVzcG9uc2VVUkwgKyAnICcgKyByZXF1ZXN0LnN0YXR1cyArICcgKCcgKyByZXF1ZXN0LnN0YXR1c1RleHQgKyAnKScgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0oKSk7XG4iXX0=
