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
     * Instantiates a ColorTexture2D object.
     * @class ColorTexture2D
     * @classdesc A texture class to represent a 2D color texture.
     * @augments Texture2D
     *
     * @param {Object} spec - The specification arguments.
     * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.image - The HTMLImageElement to buffer.
     * @param {String} spec.url - The HTMLImageElement URL to load and buffer.
     * @param {Uint8Array|Float32Array} spec.src - The data to buffer.
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
    function ColorTexture2D( spec, callback ) {
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
        if ( typeof spec.src === 'string' ) {
            // request source from url
            // TODO: put extension handling for arraybuffer / image / video differentiation
            var that = this;
            ImageLoader.load({
                url: spec.src,
                success: function( image ) {
                    // set to unsigned byte type
                    spec.type = 'UNSIGNED_BYTE';
                    spec.src = Util.resizeCanvas( spec, image );
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
        } else if ( Util.isCanvasType( spec.src ) ) {
            // is image / canvas / video type
            // set to unsigned byte type
            spec.type = 'UNSIGNED_BYTE';
            spec.src = Util.resizeCanvas( spec, spec.src );
            Texture2D.call( this, spec );
        } else {
            // array, arraybuffer, or null
            if ( spec.src === undefined ) {
                // if no data is provided, assume this texture will be rendered
                // to. In this case disable mipmapping, there is no need and it
                // will only introduce very peculiar and difficult to discern
                // rendering phenomena in which the texture 'transforms' at
                // certain angles / distances to the mipmapped (empty) portions.
                spec.mipMap = false;
            }
            // buffer from arg
            spec.type = TYPES[ spec.type ] ? spec.type : DEFAULT_TYPE;
            Texture2D.call( this, spec );
        }
    }

    ColorTexture2D.prototype = Object.create( Texture2D.prototype );

    module.exports = ColorTexture2D;

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
     * @augments Texture2D
     *
     * @param {Object} spec - The specification arguments.
     * @param {Uint8Array|Uint16Array|Uint32Array} spec.src - The data to buffer.
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
     * The default byte offset to render from.
     */
    var DEFAULT_BYTE_OFFSET = 0;

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
     * @param {String} options.byteOffset - The byte offset into the drawn buffer.
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
        this.byteOffset = ( options.byteOffset !== undefined ) ? options.byteOffset : DEFAULT_BYTE_OFFSET;
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
        if ( this.count * BYTES_PER_TYPE[ this.type ] + this.byteOffset > this.byteLength ) {
            throw 'IndexBuffer `count` of ' + this.count + ' and `byteOffset` of ' + this.byteOffset + ' overflows the length of the buffer (' + this.byteLength + ')';
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
        byteOffset = ( byteOffset !== undefined ) ? byteOffset : DEFAULT_BYTE_OFFSET;
        // get the total number of attribute components from pointers
        var byteLength = array.length * BYTES_PER_TYPE[ this.type ];
        if ( byteOffset + byteLength > this.byteLength ) {
            throw 'Argument of length ' + byteLength + ' bytes and byte offset of ' + byteOffset + ' bytes overflows the buffer length of ' + this.byteLength + ' bytes';
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
     * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.draw = function( options ) {
        options = options || {};
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode ];
        var type = gl[ this.type ];
        var byteOffset = ( options.byteOffset !== undefined ) ? options.byteOffset : this.byteOffset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        if ( count === 0 ) {
            throw 'Attempting to draw with a count of 0';
        }
        if ( byteOffset + count * BYTES_PER_TYPE[ this.type ] > this.byteLength ) {
            throw 'Attempting to draw with `count` of ' + count + ' and `byteOffset` of ' + byteOffset + ' which overflows the total byte length of the buffer (' + this.byteLength + ')';
        }
        // if this buffer is already bound, exit early
        if ( this.state.boundIndexBuffer !== this.buffer ) {
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
            this.state.boundIndexBuffer = this.buffer;
        }
        // draw elements
        gl.drawElements( mode, count, type, byteOffset );
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
     * @param {String} spec.byteOffset - The byte offset into the drawn buffer.
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
            byteOffset: spec.byteOffset,
            count: spec.count
        };
    }

    /**
     * Execute the draw command for the underlying buffers.
     * @memberof Renderable
     *
     * @param {Object} options - The options to pass to 'drawElements'. Optional.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     *
     * @returns {Renderable} Returns the renderable object for chaining.
     */
    Renderable.prototype.draw = function( options ) {
        var overrides = options || {};
        // override options if provided
        overrides.mode = overrides.mode || this.options.mode;
        overrides.byteOffset = ( overrides.byteOffset !== undefined ) ? overrides.byteOffset : this.options.byteOffset;
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
            var tasks = [];
            sources = sources || [];
            sources = ( !( sources instanceof Array ) ) ? [ sources ] : sources;
            sources.forEach( function( source ) {
                if ( ShaderParser.isGLSL( source ) ) {
                    tasks.push( passThroughSource( source ) );
                } else {
                    tasks.push( loadShaderSource( source ) );
                }
            });
            Async.parallel( tasks, done );
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
        // check value
        if ( value === undefined || value === null ) {
            // ensure that the uniform argument is defined
            throw 'Argument passed for uniform `' + name + '` is undefined';
        } else if ( value instanceof Array ) {
            // convert Array to Float32Array
            value = new Float32Array( value );
        } else if ( typeof value === 'boolean' ) {
            // convert boolean's to 0 or 1
            value = value ? 1 : 0;
        }
        // pass the arguments depending on the type
        if ( uniform.type === 'mat2' || uniform.type === 'mat3' || uniform.type === 'mat4' ) {
            this.gl[ uniform.func ]( uniform.location, false, value );
        } else {
            this.gl[ uniform.func ]( uniform.location, value );
        }
        return this;
    };

    /**
     * Buffer a map of uniform values.
     * @memberof Shader
     *
     * @param {Object} uniforms - The map of uniforms keyed by name.
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.setUniforms = function( args ) {
        // ensure shader is bound
        if ( this !== this.state.shaders.top() ) {
            throw 'Attempting to set uniform `' + name + '` for an unbound shader';
        }
        var gl = this.gl;
        var uniforms = this.uniforms;
        Object.keys( args ).forEach( function( name ) {
            var value = args[name];
            var uniform = uniforms[name];
            // ensure that the uniform exists for the name
            if ( !uniform ) {
                throw 'No uniform found under name `' + name + '`';
            }
            if ( value === undefined || value === null ) {
                // ensure that the uniform argument is defined
                throw 'Argument passed for uniform `' + name + '` is undefined';
            } else if ( value instanceof Array ) {
                // convert Array to Float32Array
                value = new Float32Array( value );
            } else if ( typeof value === 'boolean' ) {
                // convert boolean's to 0 or 1
                value = value ? 1 : 0;
            }
            // pass the arguments depending on the type
            if ( uniform.type === 'mat2' || uniform.type === 'mat3' || uniform.type === 'mat4' ) {
                gl[ uniform.func ]( uniform.location, false, value );
            } else {
                gl[ uniform.func ]( uniform.location, value );
            }
        });
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
     * @returns {String} The commentless string.
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
     * @returns {String} The normalized string.
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
     *
     * @returns {Object} The declaration object.
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
     * @param {Uint8Array|Uint16Array|Uint32Array|Float32Array|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.src - The data to buffer.
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
        var gl = this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( gl );
        // create texture object
        this.texture = gl.createTexture();
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
     * @param {Array|ArrayBufferView|null} data - The data array to buffer.
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
     * Resize the underlying texture. This clears the texture data.
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
        this.bufferData( null, width, height );
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
    var TARGETS = {
        TEXTURE_CUBE_MAP_POSITIVE_Z: true,
        TEXTURE_CUBE_MAP_NEGATIVE_Z: true,
        TEXTURE_CUBE_MAP_POSITIVE_X: true,
        TEXTURE_CUBE_MAP_NEGATIVE_X: true,
        TEXTURE_CUBE_MAP_POSITIVE_Y: true,
        TEXTURE_CUBE_MAP_NEGATIVE_Y: true
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
     * Checks the width and height of the cubemap and throws an exception if
     * it does not meet requirements.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map texture object.
     */
    function checkDimensions( cubeMap ) {
        if ( typeof cubeMap.width !== 'number' || cubeMap.width <= 0 ) {
            throw '`width` argument is missing or invalid';
        }
        if ( typeof cubeMap.height !== 'number' || cubeMap.height <= 0 ) {
            throw '`height` argument is missing or invalid';
        }
        if ( cubeMap.width !== cubeMap.height ) {
            throw 'Provided `width` must be equal to `height`';
        }
        if ( Util.mustBePowerOfTwo( cubeMap ) && !Util.isPowerOfTwo( cubeMap.width ) ) {
            throw 'Parameters require a power-of-two texture, yet provided size of ' + cubeMap.width + ' is not a power of two';
        }
    }

    /**
     * Returns a function to load a face from a url.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map texture object.
     * @param {string} target - The texture target.
     * @param {string} url - The url to load the face from.
     *
     * @returns {function} The loader function.
     */
    function loadFaceURL( cubeMap, target, url ) {
        return function( done ) {
            // TODO: put extension handling for arraybuffer / image / video differentiation
            ImageLoader.load({
                url: url,
                success: function( image ) {
                    image = Util.resizeCanvas( cubeMap, image );
                    cubeMap.bufferData( target, image );
                    done( null );
                },
                error: function( err ) {
                    done( err, null );
                }
            });
        };
    }

    /**
     * Returns a function to load a face from a canvas type object.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map texture object.
     * @param {string} target - The texture target.
     * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} canvas - The canvas type object.
     *
     * @returns {function} The loader function.
     */
    function loadFaceCanvas( cubeMap, target, canvas ) {
        return function( done ) {
            canvas = Util.resizeCanvas( cubeMap, canvas );
            cubeMap.bufferData( target, canvas );
            done( null );
        };
    }

    /**
     * Returns a function to load a face from an array type object.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map texture object.
     * @param {string} target - The texture target.
     * @param {Array|ArrayBuffer|ArrayBufferView} arr - The array type object.
     *
     * @returns {function} The loader function.
     */
    function loadFaceArray( cubeMap, target, arr ) {
        checkDimensions( cubeMap );
        return function( done ) {
            cubeMap.bufferData( target, arr );
            done( null );
        };
    }

    /**
     * Instantiates a TextureCubeMap object.
     * @class TextureCubeMap
     * @classdesc A texture class to represent a cube map texture.
     *
     * @param {Object} spec - The specification arguments
     * @param {Object} spec.faces - The faces to buffer, under keys '+x', '+y', '+z', '-x', '-y', and '-z'.
     * @param {number} spec.width - The width of the faces.
     * @param {number} spec.height - The height of the faces.
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
        // set dimensions if provided
        this.width = spec.width;
        this.height = spec.height;
        // set buffered faces
        this.bufferedFaces = [];
        // create cube map based on input
        if ( spec.faces ) {
            var tasks = [];
            FACES.forEach( function( id ) {
                var face = spec.faces[ id ];
                var target = FACE_TARGETS[ id ];
                // load based on type
                if ( typeof face === 'string' ) {
                    // url
                    tasks.push( loadFaceURL( that, target, face ) );
                } else if ( Util.isCanvasType( face ) ) {
                    // canvas
                    tasks.push( loadFaceCanvas( that, target, face ) );
                } else {
                    // array / arraybuffer or null
                    tasks.push( loadFaceArray( that, target, face ) );
                }
            });
            Async.parallel( tasks, function( err ) {
                if ( err ) {
                    if ( callback ) {
                        callback( err, null );
                    }
                    return;
                }
                // set parameters
                that.setParameters( that );
                if ( callback ) {
                    callback( null, that );
                }
            });
        } else {
            // null
            checkDimensions( this );
            FACES.forEach( function( id ) {
                that.bufferData( FACE_TARGETS[ id ], null );
            });
            // set parameters
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
     * @param {string} target - The face target.
     * @param {Object|null} data - The face data.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.bufferData = function( target, data ) {
        if ( !TARGETS[ target ] ) {
            throw 'Provided `target` of ' + target + ' is invalid';
        }
        var gl = this.gl;
        // buffer face texture
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
        // buffer the data
        if ( Util.isCanvasType( data ) ) {
            // store width and height
            this.width = data.width;
            this.height = data.height;
            // buffer the texture
            gl.texImage2D(
                gl[ target ],
                0, // mip-map level,
                gl[ this.format ], // webgl requires format === internalFormat
                gl[ this.format ],
                gl[ this.type ],
                data );
        } else {
            // buffer the texture data
            gl.texImage2D(
                gl[ target ],
                0, // mip-map level
                gl[ this.format ], // webgl requires format === internalFormat
                this.width,
                this.height,
                0, // border, must be 0
                gl[ this.format ],
                gl[ this.type ],
                data );
        }
        // track that face was buffered
        if ( this.bufferedFaces.indexOf( target ) < 0 ) {
            this.bufferedFaces.push( target );
        }
        // if all faces buffered, generate mipmaps
        if ( this.mipMap && this.bufferedFaces.length === 6 ) {
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

    /**
     * The default render mode (primitive type).
     */
    var DEFAULT_MODE = 'TRIANGLES';

    /**
     * The default byte offset to render from.
     */
    var DEFAULT_BYTE_OFFSET = 0;

    /**
     * The default count of indices to render.
     */
    var DEFAULT_COUNT = 0;

    /**
     * Parse the attribute pointers and determine the byte stride of the buffer.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @returns {number} - The byte stride of the buffer.
     */
    function getStride( attributePointers ) {
        // if there is only one attribute pointer assigned to this buffer,
        // there is no need for stride, set to default of 0
        var indices = Object.keys( attributePointers );
        if ( indices.length === 1 ) {
            return 0;
        }
        var maxByteOffset = 0;
        var byteSizeSum = 0;
        var byteStride = 0;
        indices.forEach( function( index ) {
            var pointer = attributePointers[ index ];
            var byteOffset = pointer.byteOffset;
            var size = pointer.size;
            var type = pointer.type;
            // track the sum of each attribute size
            byteSizeSum += size * BYTES_PER_TYPE[ type ];
            // track the largest offset to determine the byte stride of the buffer
            if ( byteOffset > maxByteOffset ) {
                maxByteOffset = byteOffset;
                byteStride = byteOffset + ( size * BYTES_PER_TYPE[ type ] );
            }
        });
        // check if the max byte offset is greater than or equal to the the sum of
        // the sizes. If so this buffer is not interleaved and does not need a
        // stride.
        if ( maxByteOffset >= byteSizeSum ) {
            // TODO: test what stride === 0 does for an interleaved buffer of
            // length === 1.
            return 0;
        }
        return byteStride;
    }

    /**
     * Parse the attribute pointers to ensure they are valid.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @returns {Object} - The validated attribute pointer map.
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
            var byteOffset = pointer.byteOffset;
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
                byteOffset: ( byteOffset !== undefined ) ? byteOffset : DEFAULT_BYTE_OFFSET
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
     * @returns {number} - The number of components in the buffer.
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
     * @param {String} options.byteOffset - The byte offset into the drawn buffer.
     * @param {String} options.count - The number of indices to draw.
     */
    function VertexBuffer( arg, attributePointers, options ) {
        options = options || {};
        var gl = this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( gl );
        this.buffer = gl.createBuffer();
        this.mode = MODES[ options.mode ] ? options.mode : DEFAULT_MODE;
        this.count = ( options.count !== undefined ) ? options.count : DEFAULT_COUNT;
        this.byteOffset = ( options.byteOffset !== undefined ) ? options.byteOffset : DEFAULT_BYTE_OFFSET;
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
        // set the byte stride
        this.byteStride = getStride( this.pointers );
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
        var bytesPerCount = BYTES_PER_COMPONENT * getNumComponents( this.pointers );
        if ( this.count * bytesPerCount + this.byteOffset > this.byteLength ) {
            throw 'VertexBuffer `count` of ' + this.count + ' and `byteOffset` of ' + this.byteOffset + ' overflows the total byte length of the buffer (' + this.byteLength + ')';
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
        byteOffset = ( byteOffset !== undefined ) ? byteOffset : DEFAULT_BYTE_OFFSET;
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
        var byteStride = this.byteStride;
        Object.keys( pointers ).forEach( function( index ) {
            var pointer = pointers[ index ];
            // set attribute pointer
            gl.vertexAttribPointer(
                index,
                pointer.size,
                gl[ pointer.type ],
                false,
                byteStride,
                pointer.byteOffset );
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
     * @param {String} options.byteOffset - The byte offset into the drawn buffer.
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
        var byteOffset = ( options.byteOffset !== undefined ) ? options.byteOffset : this.byteOffset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        if ( count === 0 ) {
            throw 'Attempting to draw with a count of 0';
        }
        var bytesPerCount = BYTES_PER_COMPONENT * getNumComponents( this.pointers );
        if ( count * bytesPerCount + byteOffset > this.byteLength ) {
            throw 'Attempting to draw with `count` of ' + count + ' and `offset` of ' + byteOffset + ' overflows the total byte length of the buffer (' + this.byteLength + ')';
        }
        // draw elements
        gl.drawArrays( mode, byteOffset, count );
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
                byteOffset : offset * BYTES_PER_COMPONENT
            };
            // accumulate attribute offset
            offset += size;
        });
        // set stride to total offset
        vertexPackage.byteStride = offset * BYTES_PER_COMPONENT;
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
     * @memberof VertexPackage
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
        var stride = this.byteStride / BYTES_PER_COMPONENT;
        var pointers = this.pointers;
        var buffer = this.buffer = new Float32Array( length * stride );
        // for each vertex attribute array
        attributes.forEach( function( vertices ) {
            // get the pointer
            var pointer = pointers[ vertices.index ];
            // get the pointers offset
            var offset = pointer.byteOffset / BYTES_PER_COMPONENT;
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

    var Util = {};

    /**
     * Returns true if the argument is an Array, ArrayBuffer, or ArrayBufferView.
     * @private
     *
     * @param {*} arg - The argument to test.
     *
     * @returns {bool} - Whether or not it is a canvas type.
     */
    Util.isArrayType = function( arg ) {
        return arg instanceof Array ||
            arg instanceof ArrayBuffer ||
            ArrayBuffer.isView( arg );
    };

    /**
     * Returns true if the argument is one of the WebGL `texImage2D` overridden
     * canvas types.
     *
     * @param {*} arg - The argument to test.
     *
     * @returns {bool} - Whether or not it is a canvas type.
     */
    Util.isCanvasType = function( arg ) {
        return arg instanceof ImageData ||
            arg instanceof HTMLImageElement ||
            arg instanceof HTMLCanvasElement ||
            arg instanceof HTMLVideoElement;
    };

    /**
     * Returns true if the texture MUST be a power-of-two. Otherwise return false.
     *
     * @param {Object} spec - The texture specification object.
     *
     * @returns {bool} - Whether or not the texture must be a power of two.
     */
    Util.mustBePowerOfTwo = function( spec ) {
        // According to:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL#Non_power-of-two_textures
        // NPOT textures cannot be used with mipmapping and they must not "repeat"
        return spec.mipMap ||
            spec.wrapS === 'REPEAT' ||
            spec.wrapS === 'MIRRORED_REPEAT' ||
            spec.wrapT === 'REPEAT' ||
            spec.wrapT === 'MIRRORED_REPEAT';
    };

    /**
     * Returns true if the value is a number and is an integer.
     *
     * @param {integer} num - The number to test.
     *
     * @returns {boolean} - Whether or not the value is a number.
     */
    Util.isInteger = function( num ) {
        return typeof num === 'number' && ( num % 1 ) === 0;
    };

    /**
     * Returns true if the provided integer is a power of two.
     *
     * @param {integer} num - The number to test.
     *
     * @returns {boolean} - Whether or not the number is a power of two.
     */
    Util.isPowerOfTwo = function( num ) {
        return ( num !== 0 ) ? ( num & ( num - 1 ) ) === 0 : false;
    };

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
    Util.nextHighestPowerOfTwo = function( num ) {
        var i;
        if ( num !== 0 ) {
            num = num-1;
        }
        for ( i=1; i<32; i<<=1 ) {
            num = num | num >> i;
        }
        return num + 1;
    };

    /**
     * If the texture must be a POT, resizes and returns the image.
     * @private
     *
     * @param {Object} spec - The texture specification object.
     * @param {HTMLImageElement} img - The image object.
     */
    Util.resizeCanvas = function( spec, img ) {
        if ( !Util.mustBePowerOfTwo( spec ) ||
            ( Util.isPowerOfTwo( img.width ) && Util.isPowerOfTwo( img.height ) ) ) {
            return img;
        }
        // create an empty canvas element
        var canvas = document.createElement( 'canvas' );
        canvas.width = Util.nextHighestPowerOfTwo( img.width );
        canvas.height = Util.nextHighestPowerOfTwo( img.height );
        // copy the image contents to the canvas
        var ctx = canvas.getContext( '2d' );
        ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height );
        return canvas;
    };

    module.exports = Util;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db2xvclRleHR1cmUyRC5qcyIsInNyYy9jb3JlL0RlcHRoVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvSW5kZXhCdWZmZXIuanMiLCJzcmMvY29yZS9SZW5kZXJUYXJnZXQuanMiLCJzcmMvY29yZS9SZW5kZXJhYmxlLmpzIiwic3JjL2NvcmUvU2hhZGVyLmpzIiwic3JjL2NvcmUvU2hhZGVyUGFyc2VyLmpzIiwic3JjL2NvcmUvVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvVGV4dHVyZUN1YmVNYXAuanMiLCJzcmMvY29yZS9WZXJ0ZXhCdWZmZXIuanMiLCJzcmMvY29yZS9WZXJ0ZXhQYWNrYWdlLmpzIiwic3JjL2NvcmUvVmlld3BvcnQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHRTdGF0ZS5qcyIsInNyYy9leHBvcnRzLmpzIiwic3JjL3V0aWwvQXN5bmMuanMiLCJzcmMvdXRpbC9JbWFnZUxvYWRlci5qcyIsInNyYy91dGlsL1N0YWNrLmpzIiwic3JjL3V0aWwvU3RhY2tNYXAuanMiLCJzcmMvdXRpbC9VdGlsLmpzIiwic3JjL3V0aWwvWEhSTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBUZXh0dXJlMkQgPSByZXF1aXJlKCcuL1RleHR1cmUyRCcpO1xyXG4gICAgdmFyIEltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi4vdXRpbC9JbWFnZUxvYWRlcicpO1xyXG4gICAgdmFyIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcclxuICAgIHZhciBNQUdfRklMVEVSUyA9IHtcclxuICAgICAgICBORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHZhciBNSU5fRklMVEVSUyA9IHtcclxuICAgICAgICBORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUjogdHJ1ZSxcclxuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXHJcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgV1JBUF9NT0RFUyA9IHtcclxuICAgICAgICBSRVBFQVQ6IHRydWUsXHJcbiAgICAgICAgTUlSUk9SRURfUkVQRUFUOiB0cnVlLFxyXG4gICAgICAgIENMQU1QX1RPX0VER0U6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgVFlQRVMgPSB7XHJcbiAgICAgICAgVU5TSUdORURfQllURTogdHJ1ZSxcclxuICAgICAgICBGTE9BVDogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHZhciBGT1JNQVRTID0ge1xyXG4gICAgICAgIFJHQjogdHJ1ZSxcclxuICAgICAgICBSR0JBOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRlZmF1bHQgdHlwZSBmb3IgY29sb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIGNvbG9yIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIGNvbG9yIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9XUkFQID0gJ1JFUEVBVCc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciBjb2xvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX01JUE1BUCA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9JTlZFUlRfWSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBDb2xvclRleHR1cmUyRCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgQ29sb3JUZXh0dXJlMkRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIGNvbG9yIHRleHR1cmUuXHJcbiAgICAgKiBAYXVnbWVudHMgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgKiBAcGFyYW0ge0ltYWdlRGF0YXxIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fEhUTUxWaWRlb0VsZW1lbnR9IHNwZWMuaW1hZ2UgLSBUaGUgSFRNTEltYWdlRWxlbWVudCB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy51cmwgLSBUaGUgSFRNTEltYWdlRWxlbWVudCBVUkwgdG8gbG9hZCBhbmQgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtVaW50OEFycmF5fEZsb2F0MzJBcnJheX0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMubWlwTWFwIC0gV2hldGhlciBvciBub3QgbWlwLW1hcHBpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVNdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIGlmIHRoZSBkYXRhIGlzIGxvYWRlZCBhc3luY2hyb25vdXNseSB2aWEgYSBVUkwuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIENvbG9yVGV4dHVyZTJEKCBzcGVjLCBjYWxsYmFjayApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICAvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXHJcbiAgICAgICAgc3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xyXG4gICAgICAgIHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcclxuICAgICAgICBzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xyXG4gICAgICAgIHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XHJcbiAgICAgICAgLy8gc2V0IHRleHR1cmUgcGFyYW1zXHJcbiAgICAgICAgc3BlYy53cmFwUyA9IFdSQVBfTU9ERVNbIHNwZWMud3JhcFMgXSA/IHNwZWMud3JhcFMgOiBERUZBVUxUX1dSQVA7XHJcbiAgICAgICAgc3BlYy53cmFwVCA9IFdSQVBfTU9ERVNbIHNwZWMud3JhcFQgXSA/IHNwZWMud3JhcFQgOiBERUZBVUxUX1dSQVA7XHJcbiAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBNSU5fRklMVEVSU1sgc3BlYy5taW5GaWx0ZXIgXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XHJcbiAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1sgc3BlYy5tYWdGaWx0ZXIgXSA/IHNwZWMubWFnRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XHJcbiAgICAgICAgLy8gc2V0IG90aGVyIHByb3BlcnRpZXNcclxuICAgICAgICBzcGVjLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IERFRkFVTFRfTUlQTUFQO1xyXG4gICAgICAgIHNwZWMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogREVGQVVMVF9JTlZFUlRfWTtcclxuICAgICAgICBzcGVjLnByZU11bHRpcGx5QWxwaGEgPSBzcGVjLnByZU11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCA/IHNwZWMucHJlTXVsdGlwbHlBbHBoYSA6IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEE7XHJcbiAgICAgICAgLy8gc2V0IGZvcm1hdFxyXG4gICAgICAgIHNwZWMuZm9ybWF0ID0gRk9STUFUU1sgc3BlYy5mb3JtYXQgXSA/IHNwZWMuZm9ybWF0IDogREVGQVVMVF9GT1JNQVQ7XHJcbiAgICAgICAgLy8gYnVmZmVyIHRoZSB0ZXh0dXJlIGJhc2VkIG9uIGFyZ3VtZW50IHR5cGVcclxuICAgICAgICBpZiAoIHR5cGVvZiBzcGVjLnNyYyA9PT0gJ3N0cmluZycgKSB7XHJcbiAgICAgICAgICAgIC8vIHJlcXVlc3Qgc291cmNlIGZyb20gdXJsXHJcbiAgICAgICAgICAgIC8vIFRPRE86IHB1dCBleHRlbnNpb24gaGFuZGxpbmcgZm9yIGFycmF5YnVmZmVyIC8gaW1hZ2UgLyB2aWRlbyBkaWZmZXJlbnRpYXRpb25cclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICBJbWFnZUxvYWRlci5sb2FkKHtcclxuICAgICAgICAgICAgICAgIHVybDogc3BlYy5zcmMsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggaW1hZ2UgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHRvIHVuc2lnbmVkIGJ5dGUgdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcclxuICAgICAgICAgICAgICAgICAgICBzcGVjLnNyYyA9IFV0aWwucmVzaXplQ2FudmFzKCBzcGVjLCBpbWFnZSApO1xyXG4gICAgICAgICAgICAgICAgICAgIFRleHR1cmUyRC5jYWxsKCB0aGF0LCBzcGVjICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIG51bGwsIHRoYXQgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBlcnIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIGVyciwgbnVsbCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggVXRpbC5pc0NhbnZhc1R5cGUoIHNwZWMuc3JjICkgKSB7XHJcbiAgICAgICAgICAgIC8vIGlzIGltYWdlIC8gY2FudmFzIC8gdmlkZW8gdHlwZVxyXG4gICAgICAgICAgICAvLyBzZXQgdG8gdW5zaWduZWQgYnl0ZSB0eXBlXHJcbiAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcclxuICAgICAgICAgICAgc3BlYy5zcmMgPSBVdGlsLnJlc2l6ZUNhbnZhcyggc3BlYywgc3BlYy5zcmMgKTtcclxuICAgICAgICAgICAgVGV4dHVyZTJELmNhbGwoIHRoaXMsIHNwZWMgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBhcnJheSwgYXJyYXlidWZmZXIsIG9yIG51bGxcclxuICAgICAgICAgICAgaWYgKCBzcGVjLnNyYyA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgbm8gZGF0YSBpcyBwcm92aWRlZCwgYXNzdW1lIHRoaXMgdGV4dHVyZSB3aWxsIGJlIHJlbmRlcmVkXHJcbiAgICAgICAgICAgICAgICAvLyB0by4gSW4gdGhpcyBjYXNlIGRpc2FibGUgbWlwbWFwcGluZywgdGhlcmUgaXMgbm8gbmVlZCBhbmQgaXRcclxuICAgICAgICAgICAgICAgIC8vIHdpbGwgb25seSBpbnRyb2R1Y2UgdmVyeSBwZWN1bGlhciBhbmQgZGlmZmljdWx0IHRvIGRpc2Nlcm5cclxuICAgICAgICAgICAgICAgIC8vIHJlbmRlcmluZyBwaGVub21lbmEgaW4gd2hpY2ggdGhlIHRleHR1cmUgJ3RyYW5zZm9ybXMnIGF0XHJcbiAgICAgICAgICAgICAgICAvLyBjZXJ0YWluIGFuZ2xlcyAvIGRpc3RhbmNlcyB0byB0aGUgbWlwbWFwcGVkIChlbXB0eSkgcG9ydGlvbnMuXHJcbiAgICAgICAgICAgICAgICBzcGVjLm1pcE1hcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlciBmcm9tIGFyZ1xyXG4gICAgICAgICAgICBzcGVjLnR5cGUgPSBUWVBFU1sgc3BlYy50eXBlIF0gPyBzcGVjLnR5cGUgOiBERUZBVUxUX1RZUEU7XHJcbiAgICAgICAgICAgIFRleHR1cmUyRC5jYWxsKCB0aGlzLCBzcGVjICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIENvbG9yVGV4dHVyZTJELnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFRleHR1cmUyRC5wcm90b3R5cGUgKTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENvbG9yVGV4dHVyZTJEO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyk7XHJcbiAgICB2YXIgTUFHX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVI6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgTUlOX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVI6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgV1JBUF9NT0RFUyA9IHtcclxuICAgICAgICBSRVBFQVQ6IHRydWUsXHJcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZSxcclxuICAgICAgICBNSVJST1JFRF9SRVBFQVQ6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgREVQVEhfVFlQRVMgPSB7XHJcbiAgICAgICAgVU5TSUdORURfQllURTogdHJ1ZSxcclxuICAgICAgICBVTlNJR05FRF9TSE9SVDogdHJ1ZSxcclxuICAgICAgICBVTlNJR05FRF9JTlQ6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgRk9STUFUUyA9IHtcclxuICAgICAgICBERVBUSF9DT01QT05FTlQ6IHRydWUsXHJcbiAgICAgICAgREVQVEhfU1RFTkNJTDogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIGRlcHRoIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0lOVCc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIGRlcHRoIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9GT1JNQVQgPSAnREVQVEhfQ09NUE9ORU5UJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgZGVwdGggdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciBkZXB0aCB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBEZXB0aFRleHR1cmUyRCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgRGVwdGhUZXh0dXJlMkRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIGRlcHRoIHRleHR1cmUuXHJcbiAgICAgKiBAYXVnbWVudHMgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl9IHNwZWMuc3JjIC0gVGhlIGRhdGEgdG8gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudHlwZSAtIFRoZSB0ZXh0dXJlIHBpeGVsIGNvbXBvbmVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgaWYgdGhlIGRhdGEgaXMgbG9hZGVkIGFzeW5jaHJvbm91c2x5IHZpYSBhIFVSTC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRGVwdGhUZXh0dXJlMkQoIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgLy8gZ2V0IHNwZWNpZmljIHBhcmFtc1xyXG4gICAgICAgIHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcclxuICAgICAgICBzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XHJcbiAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcclxuICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xyXG4gICAgICAgIC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xyXG4gICAgICAgIHNwZWMud3JhcFMgPSBXUkFQX01PREVTWyBzcGVjLndyYXBTIF0gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xyXG4gICAgICAgIHNwZWMud3JhcFQgPSBXUkFQX01PREVTWyBzcGVjLndyYXBUIF0gPyBzcGVjLndyYXBUIDogREVGQVVMVF9XUkFQO1xyXG4gICAgICAgIHNwZWMubWluRmlsdGVyID0gTUlOX0ZJTFRFUlNbIHNwZWMubWluRmlsdGVyIF0gPyBzcGVjLm1pbkZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xyXG4gICAgICAgIHNwZWMubWFnRmlsdGVyID0gTUFHX0ZJTFRFUlNbIHNwZWMubWFnRmlsdGVyIF0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xyXG4gICAgICAgIC8vIHNldCBtaXAtbWFwcGluZyBhbmQgZm9ybWF0XHJcbiAgICAgICAgc3BlYy5taXBNYXAgPSBmYWxzZTsgLy8gZGlzYWJsZSBtaXAtbWFwcGluZ1xyXG4gICAgICAgIHNwZWMuaW52ZXJ0WSA9IGZhbHNlOyAvLyBubyBuZWVkIHRvIGludmVydC15XHJcbiAgICAgICAgc3BlYy5wcmVNdWx0aXBseUFscGhhID0gZmFsc2U7IC8vIG5vIGFscGhhIHRvIHByZS1tdWx0aXBseVxyXG4gICAgICAgIHNwZWMuZm9ybWF0ID0gRk9STUFUU1sgc3BlYy5mb3JtYXQgXSA/IHNwZWMuZm9ybWF0IDogREVGQVVMVF9GT1JNQVQ7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgc3RlbmNpbC1kZXB0aCwgb3IganVzdCBkZXB0aFxyXG4gICAgICAgIGlmICggc3BlYy5mb3JtYXQgPT09ICdERVBUSF9TVEVOQ0lMJyApIHtcclxuICAgICAgICAgICAgc3BlYy50eXBlID0gJ1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzcGVjLnR5cGUgPSBERVBUSF9UWVBFU1sgc3BlYy50eXBlIF0gPyBzcGVjLnR5cGUgOiBERUZBVUxUX1RZUEU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFRleHR1cmUyRC5jYWxsKCB0aGlzLCBzcGVjICk7XHJcbiAgICB9XHJcblxyXG4gICAgRGVwdGhUZXh0dXJlMkQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVGV4dHVyZTJELnByb3RvdHlwZSApO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gRGVwdGhUZXh0dXJlMkQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcclxuICAgIHZhciBXZWJHTENvbnRleHRTdGF0ZSA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0U3RhdGUnKTtcclxuICAgIHZhciBUWVBFUyA9IHtcclxuICAgICAgICBVTlNJR05FRF9TSE9SVDogdHJ1ZSxcclxuICAgICAgICBVTlNJR05FRF9JTlQ6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgTU9ERVMgPSB7XHJcbiAgICAgICAgUE9JTlRTOiB0cnVlLFxyXG4gICAgICAgIExJTkVTOiB0cnVlLFxyXG4gICAgICAgIExJTkVfU1RSSVA6IHRydWUsXHJcbiAgICAgICAgTElORV9MT09QOiB0cnVlLFxyXG4gICAgICAgIFRSSUFOR0xFUzogdHJ1ZSxcclxuICAgICAgICBUUklBTkdMRV9TVFJJUDogdHJ1ZSxcclxuICAgICAgICBUUklBTkdMRV9GQU46IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgQllURVNfUEVSX1RZUEUgPSB7XHJcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IDIsXHJcbiAgICAgICAgVU5TSUdORURfSU5UOiA0XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRlZmF1bHQgY29tcG9uZW50IHR5cGUuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfU0hPUlQnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyIG1vZGUgKHByaW1pdGl2ZSB0eXBlKS5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfTU9ERSA9ICdUUklBTkdMRVMnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRlZmF1bHQgYnl0ZSBvZmZzZXQgdG8gcmVuZGVyIGZyb20uXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX0JZVEVfT0ZGU0VUID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGNvdW50IG9mIGluZGljZXMgdG8gcmVuZGVyLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9DT1VOVCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW4gSW5kZXhCdWZmZXIgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIEluZGV4QnVmZmVyXHJcbiAgICAgKiBAY2xhc3NkZXNjIEFuIGluZGV4IGJ1ZmZlciBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtVaW50MTZBcnJheXxVaW4zMkFycmF5fEFycmF5fSBhcmcgLSBUaGUgaW5kZXggZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSByZW5kZXJpbmcgb3B0aW9ucy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5ieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBJbmRleEJ1ZmZlciggYXJnLCBvcHRpb25zICkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFdlYkdMQ29udGV4dFN0YXRlLmdldCggZ2wgKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IFRZUEVTWyBvcHRpb25zLnR5cGUgXSA/IG9wdGlvbnMudHlwZSA6IERFRkFVTFRfVFlQRTtcclxuICAgICAgICAvLyBjaGVjayBpZiB0eXBlIGlzIHN1cHBvcnRlZFxyXG4gICAgICAgIGlmICggdGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJyAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCAnT0VTX2VsZW1lbnRfaW5kZXhfdWludCcgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgSW5kZXhCdWZmZXIgb2YgdHlwZSBgVU5TSUdORURfSU5UYCBhcyBleHRlbnNpb24gYE9FU19lbGVtZW50X2luZGV4X3VpbnRgIGlzIG5vdCBzdXBwb3J0ZWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vZGUgPSBNT0RFU1sgb3B0aW9ucy5tb2RlIF0gPyBvcHRpb25zLm1vZGUgOiBERUZBVUxUX01PREU7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9ICggb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmNvdW50IDogREVGQVVMVF9DT1VOVDtcclxuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSAoIG9wdGlvbnMuYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmJ5dGVPZmZzZXQgOiBERUZBVUxUX0JZVEVfT0ZGU0VUO1xyXG4gICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IDA7XHJcbiAgICAgICAgaWYgKCBhcmcgKSB7XHJcbiAgICAgICAgICAgIGlmICggYXJnIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZWJHTEJ1ZmZlciBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLmJ5dGVMZW5ndGggPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBgV2ViR0xCdWZmZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLmJ5dGVMZW5ndGhgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IG9wdGlvbnMuYnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gYXJnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGJ5dGUgbGVuZ3RoIGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBudW1iZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJnICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyICkge1xyXG4gICAgICAgICAgICAgICAgLy8gQXJyYXlCdWZmZXIgYXJnXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBBcnJheUJ1ZmZlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMudHlwZWAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBhcmcgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEFycmF5IG9yIEFycmF5QnVmZmVyVmlldyBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBhcmcgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICggb3B0aW9ucy50eXBlID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnRW1wdHkgYnVmZmVyIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbnN1cmUgdGhlcmUgaXNuJ3QgYW4gb3ZlcmZsb3dcclxuICAgICAgICBpZiAoIHRoaXMuY291bnQgKiBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF0gKyB0aGlzLmJ5dGVPZmZzZXQgPiB0aGlzLmJ5dGVMZW5ndGggKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJbmRleEJ1ZmZlciBgY291bnRgIG9mICcgKyB0aGlzLmNvdW50ICsgJyBhbmQgYGJ5dGVPZmZzZXRgIG9mICcgKyB0aGlzLmJ5dGVPZmZzZXQgKyAnIG92ZXJmbG93cyB0aGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgKCcgKyB0aGlzLmJ5dGVMZW5ndGggKyAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBsb2FkIGluZGV4IGRhdGEgdG8gdGhlIEdQVS5cclxuICAgICAqIEBtZW1iZXJvZiBJbmRleEJ1ZmZlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fG51bWJlcn0gYXJnIC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBJbmRleEJ1ZmZlci5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKCBhcmcgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICAvLyBjYXN0IGFycmF5IHRvIEFycmF5QnVmZmVyVmlldyBiYXNlZCBvbiBwcm92aWRlZCB0eXBlXHJcbiAgICAgICAgaWYgKCBhcmcgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHR5cGUgc3VwcG9ydFxyXG4gICAgICAgICAgICBpZiAoIHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1aW50MzIgaXMgc3VwcG9ydGVkXHJcbiAgICAgICAgICAgICAgICBhcmcgPSBuZXcgVWludDMyQXJyYXkoIGFyZyApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRvIHVpbnQxNlxyXG4gICAgICAgICAgICAgICAgYXJnID0gbmV3IFVpbnQxNkFycmF5KCBhcmcgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxyXG4gICAgICAgIGlmICggYXJnIGluc3RhbmNlb2YgVWludDE2QXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9TSE9SVCc7XHJcbiAgICAgICAgfSBlbHNlIGlmICggYXJnIGluc3RhbmNlb2YgVWludDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9JTlQnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoICEoIGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyICkgJiYgdHlwZW9mIGFyZyAhPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgYEFycmF5QnVmZmVyVmlld2AsIG9yIGBudW1iZXJgJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZG9uJ3Qgb3ZlcndyaXRlIHRoZSBjb3VudCBpZiBpdCBpcyBhbHJlYWR5IHNldFxyXG4gICAgICAgIGlmICggdGhpcy5jb3VudCA9PT0gREVGQVVMVF9DT1VOVCApIHtcclxuICAgICAgICAgICAgaWYgKCB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY291bnQgPSAoIGFyZyAvIEJZVEVTX1BFUl9UWVBFWyB0aGlzLnR5cGUgXSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IGFyZy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IGJ5dGUgbGVuZ3RoXHJcbiAgICAgICAgaWYgKCB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgaWYgKCBhcmcgJSBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF0gKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnQnl0ZSBsZW5ndGggbXVzdCBiZSBtdWx0aXBsZSBvZiAnICsgQllURVNfUEVSX1RZUEVbIHRoaXMudHlwZSBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IGFyZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBhcmcubGVuZ3RoICogQllURVNfUEVSX1RZUEVbIHRoaXMudHlwZSBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBidWZmZXIgdGhlIGRhdGFcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYXJnLCBnbC5TVEFUSUNfRFJBVyApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwbG9hZCBwYXJ0aWFsIGluZGV4IGRhdGEgdG8gdGhlIEdQVS5cclxuICAgICAqIEBtZW1iZXJvZiBJbmRleEJ1ZmZlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGF0IHdoaWNoIHRvIGJ1ZmZlci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7SW5kZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJTdWJEYXRhID0gZnVuY3Rpb24oIGFycmF5LCBieXRlT2Zmc2V0ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgaWYgKCB0aGlzLmJ5dGVMZW5ndGggPT09IDAgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdCdWZmZXIgaGFzIG5vdCBiZWVuIGFsbG9jYXRlZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhc3QgYXJyYXkgdG8gQXJyYXlCdWZmZXJWaWV3IGJhc2VkIG9uIHByb3ZpZGVkIHR5cGVcclxuICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciB0eXBlIHN1cHBvcnRcclxuICAgICAgICAgICAgaWYgKCB0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnICkge1xyXG4gICAgICAgICAgICAgICAgLy8gdWludDMyIGlzIHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgVWludDMyQXJyYXkoIGFycmF5ICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDE2XHJcbiAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50MTZBcnJheSggYXJyYXkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICEoIGFycmF5IGluc3RhbmNlb2YgVWludDE2QXJyYXkgKSAmJlxyXG4gICAgICAgICAgICAhKCBhcnJheSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5ICkgJiZcclxuICAgICAgICAgICAgISggYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIG9yIGBBcnJheUJ1ZmZlclZpZXdgJztcclxuICAgICAgICB9XHJcbiAgICAgICAgYnl0ZU9mZnNldCA9ICggYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkICkgPyBieXRlT2Zmc2V0IDogREVGQVVMVF9CWVRFX09GRlNFVDtcclxuICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIG51bWJlciBvZiBhdHRyaWJ1dGUgY29tcG9uZW50cyBmcm9tIHBvaW50ZXJzXHJcbiAgICAgICAgdmFyIGJ5dGVMZW5ndGggPSBhcnJheS5sZW5ndGggKiBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF07XHJcbiAgICAgICAgaWYgKCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCA+IHRoaXMuYnl0ZUxlbmd0aCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG9mIGxlbmd0aCAnICsgYnl0ZUxlbmd0aCArICcgYnl0ZXMgYW5kIGJ5dGUgb2Zmc2V0IG9mICcgKyBieXRlT2Zmc2V0ICsgJyBieXRlcyBvdmVyZmxvd3MgdGhlIGJ1ZmZlciBsZW5ndGggb2YgJyArIHRoaXMuYnl0ZUxlbmd0aCArICcgYnl0ZXMnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcclxuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYnl0ZU9mZnNldCwgYXJyYXkgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSBib3VuZCBidWZmZXIuXHJcbiAgICAgKiBAbWVtYmVyb2YgSW5kZXhCdWZmZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIHBhc3MgdG8gJ2RyYXdFbGVtZW50cycuIE9wdGlvbmFsLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmJ5dGVPZmZzZXQgLSBUaGUgYnl0ZU9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgdmVydGljZXMgdG8gZHJhdy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7SW5kZXhCdWZmZXJ9IFJldHVybnMgdGhlIGluZGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBJbmRleEJ1ZmZlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdmFyIG1vZGUgPSBnbFsgb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSBdO1xyXG4gICAgICAgIHZhciB0eXBlID0gZ2xbIHRoaXMudHlwZSBdO1xyXG4gICAgICAgIHZhciBieXRlT2Zmc2V0ID0gKCBvcHRpb25zLmJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5ieXRlT2Zmc2V0IDogdGhpcy5ieXRlT2Zmc2V0O1xyXG4gICAgICAgIHZhciBjb3VudCA9ICggb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmNvdW50IDogdGhpcy5jb3VudDtcclxuICAgICAgICBpZiAoIGNvdW50ID09PSAwICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQXR0ZW1wdGluZyB0byBkcmF3IHdpdGggYSBjb3VudCBvZiAwJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBieXRlT2Zmc2V0ICsgY291bnQgKiBCWVRFU19QRVJfVFlQRVsgdGhpcy50eXBlIF0gPiB0aGlzLmJ5dGVMZW5ndGggKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdBdHRlbXB0aW5nIHRvIGRyYXcgd2l0aCBgY291bnRgIG9mICcgKyBjb3VudCArICcgYW5kIGBieXRlT2Zmc2V0YCBvZiAnICsgYnl0ZU9mZnNldCArICcgd2hpY2ggb3ZlcmZsb3dzIHRoZSB0b3RhbCBieXRlIGxlbmd0aCBvZiB0aGUgYnVmZmVyICgnICsgdGhpcy5ieXRlTGVuZ3RoICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiB0aGlzIGJ1ZmZlciBpcyBhbHJlYWR5IGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCB0aGlzLnN0YXRlLmJvdW5kSW5kZXhCdWZmZXIgIT09IHRoaXMuYnVmZmVyICkge1xyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5ib3VuZEluZGV4QnVmZmVyID0gdGhpcy5idWZmZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRyYXcgZWxlbWVudHNcclxuICAgICAgICBnbC5kcmF3RWxlbWVudHMoIG1vZGUsIGNvdW50LCB0eXBlLCBieXRlT2Zmc2V0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gSW5kZXhCdWZmZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcclxuICAgIHZhciBXZWJHTENvbnRleHRTdGF0ZSA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0U3RhdGUnKTtcclxuICAgIHZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XHJcblxyXG4gICAgdmFyIFRFWFRVUkVfVEFSR0VUUyA9IHtcclxuICAgICAgICBURVhUVVJFXzJEOiB0cnVlLFxyXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVA6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdmFyIERFUFRIX0ZPUk1BVFMgPSB7XHJcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxyXG4gICAgICAgIERFUFRIX1NURU5DSUw6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBSZW5kZXJUYXJnZXQgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFJlbmRlclRhcmdldFxyXG4gICAgICogQGNsYXNzZGVzYyBBIHJlbmRlclRhcmdldCBjbGFzcyB0byBhbGxvdyByZW5kZXJpbmcgdG8gdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFJlbmRlclRhcmdldCgpIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBXZWJHTENvbnRleHRTdGF0ZS5nZXQoIGdsICk7XHJcbiAgICAgICAgdGhpcy5mcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlcyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIHN0YWNrLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICggdGhpcy5zdGF0ZS5yZW5kZXJUYXJnZXRzLnRvcCgpICE9PSB0aGlzICkge1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCB0aGlzLmZyYW1lYnVmZmVyICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdGUucmVuZGVyVGFyZ2V0cy5wdXNoKCB0aGlzICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdCBhbmQgYmluZHMgdGhlIHJlbmRlclRhcmdldCBiZW5lYXRoIGl0IG9uIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgcmVuZGVyVGFyZ2V0LCBiaW5kIHRoZSBiYWNrYnVmZmVyLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyByZW5kZXIgdGFyZ2V0IGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBzdGF0ZS5yZW5kZXJUYXJnZXRzLnRvcCgpICE9PSB0aGlzICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnVGhlIGN1cnJlbnQgcmVuZGVyIHRhcmdldCBpcyBub3QgdGhlIHRvcCBtb3N0IGVsZW1lbnQgb24gdGhlIHN0YWNrJztcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhdGUucmVuZGVyVGFyZ2V0cy5wb3AoKTtcclxuICAgICAgICB2YXIgdG9wID0gc3RhdGUucmVuZGVyVGFyZ2V0cy50b3AoKTtcclxuICAgICAgICB2YXIgZ2w7XHJcbiAgICAgICAgaWYgKCB0b3AgKSB7XHJcbiAgICAgICAgICAgIGdsID0gdG9wLmdsO1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCB0b3AuZnJhbWVidWZmZXIgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgdGV4dHVyZSB0byBhdHRhY2guXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgYXR0YWNobWVudCBpbmRleC4gKG9wdGlvbmFsKVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldCAtIFRoZSB0ZXh0dXJlIHRhcmdldCB0eXBlLiAob3B0aW9uYWwpXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5zZXRDb2xvclRhcmdldCA9IGZ1bmN0aW9uKCB0ZXh0dXJlLCBpbmRleCwgdGFyZ2V0ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgaWYgKCAhdGV4dHVyZSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgYXJndW1lbnQgaXMgbWlzc2luZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggVEVYVFVSRV9UQVJHRVRTWyBpbmRleCBdICYmIHRhcmdldCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSBpbmRleDtcclxuICAgICAgICAgICAgaW5kZXggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIGluZGV4ID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKCAhVXRpbC5pc0ludGVnZXIoIGluZGV4ICkgfHwgaW5kZXggPCAwICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBjb2xvciBhdHRhY2htZW50IGluZGV4IGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRhcmdldCAmJiAhVEVYVFVSRV9UQVJHRVRTWyB0YXJnZXQgXSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgdGFyZ2V0IGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRleHR1cmVzWyAnY29sb3InICsgaW5kZXggXSA9IHRleHR1cmU7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXHJcbiAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxyXG4gICAgICAgICAgICBnbFsgJ0NPTE9SX0FUVEFDSE1FTlQnICsgaW5kZXggXSxcclxuICAgICAgICAgICAgZ2xbIHRhcmdldCB8fCAnVEVYVFVSRV8yRCcgXSxcclxuICAgICAgICAgICAgdGV4dHVyZS50ZXh0dXJlLFxyXG4gICAgICAgICAgICAwICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyB0aGUgcHJvdmlkZWQgdGV4dHVyZSB0byB0aGUgcHJvdmlkZWQgYXR0YWNobWVudCBsb2NhdGlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZSAtIFRoZSB0ZXh0dXJlIHRvIGF0dGFjaC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnNldERlcHRoVGFyZ2V0ID0gZnVuY3Rpb24oIHRleHR1cmUgKSB7XHJcbiAgICAgICAgaWYgKCAhdGV4dHVyZSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgYXJndW1lbnQgaXMgbWlzc2luZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIURFUFRIX0ZPUk1BVFNbIHRleHR1cmUuZm9ybWF0IF0gKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCB0ZXh0dXJlIGlzIG5vdCBvZiBmb3JtYXQgYERFUFRIX0NPTVBPTkVOVGAgb3IgYERFUFRIX1NURU5DSUxgJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzLmRlcHRoID0gdGV4dHVyZTtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcclxuICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXHJcbiAgICAgICAgICAgIGdsLkRFUFRIX0FUVEFDSE1FTlQsXHJcbiAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgIHRleHR1cmUudGV4dHVyZSxcclxuICAgICAgICAgICAgMCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzaXplcyB0aGUgcmVuZGVyVGFyZ2V0IGFuZCBhbGwgYXR0YWNoZWQgdGV4dHVyZXMgYnkgdGhlIHByb3ZpZGVkIGhlaWdodCBhbmQgd2lkdGguXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIG5ldyB3aWR0aCBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSByZW5kZXJUYXJnZXQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICBpZiAoIHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgKCB3aWR0aCA8PSAwICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgd2lkdGhgIG9mICcgKyB3aWR0aCArICcgaXMgaW52YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgKCBoZWlnaHQgPD0gMCApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYGhlaWdodGAgb2YgJyArIGhlaWdodCArICcgaXMgaW52YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0ZXh0dXJlcyA9IHRoaXMudGV4dHVyZXM7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoIHRleHR1cmVzICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcclxuICAgICAgICAgICAgdGV4dHVyZXNbIGtleSBdLnJlc2l6ZSggd2lkdGgsIGhlaWdodCApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlclRhcmdldDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBWZXJ0ZXhQYWNrYWdlID0gcmVxdWlyZSgnLi4vY29yZS9WZXJ0ZXhQYWNrYWdlJyk7XHJcbiAgICB2YXIgVmVydGV4QnVmZmVyID0gcmVxdWlyZSgnLi4vY29yZS9WZXJ0ZXhCdWZmZXInKTtcclxuICAgIHZhciBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uL2NvcmUvSW5kZXhCdWZmZXInKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBhbiBpbmRleFxyXG4gICAgICogb2NjdXJzIG1yb2UgdGhhbiBvbmNlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2ZXJ0ZXhCdWZmZXJzIC0gVGhlIGFycmF5IG9mIHZlcnRleEJ1ZmZlcnMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNoZWNrSW5kZXhDb2xsaXNpb25zKCB2ZXJ0ZXhCdWZmZXJzICkge1xyXG4gICAgICAgIHZhciBpbmRpY2VzID0ge307XHJcbiAgICAgICAgdmVydGV4QnVmZmVycy5mb3JFYWNoKCBmdW5jdGlvbiggYnVmZmVyICkge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyggYnVmZmVyLnBvaW50ZXJzICkuZm9yRWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1sgaW5kZXggXSA9IGluZGljZXNbIGluZGV4IF0gfHwgMDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbIGluZGV4IF0rKztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoIGluZGljZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgICAgIGlmICggaW5kaWNlc1sgaW5kZXggXSA+IDEgKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnTW9yZSB0aGFuIG9uZSBhdHRyaWJ1dGUgcG9pbnRlciBleGlzdHMgZm9yIGluZGV4ICcgKyBpbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGFuIFJlbmRlcmFibGUgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFJlbmRlcmFibGVcclxuICAgICAqIEBjbGFzc2Rlc2MgQSBjb250YWluZXIgZm9yIG9uZSBvciBtb3JlIFZlcnRleEJ1ZmZlcnMgYW5kIGFuIG9wdGlvbmFsIEluZGV4QnVmZmVyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHJlbmRlcmFibGUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fEZsb2F0MzJBcnJheX0gc3BlYy52ZXJ0aWNlcyAtIFRoZSB2ZXJ0aWNlcyB0byBpbnRlcmxlYXZlIGFuZCBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0ge1ZlcnRleEJ1ZmZlcn0gc3BlYy52ZXJ0ZXhCdWZmZXIgLSBBbiBleGlzdGluZyB2ZXJ0ZXggYnVmZmVyIHRvIHVzZS5cclxuICAgICAqIEBwYXJhbSB7VmVydGV4QnVmZmVyW119IHNwZWMudmVydGV4QnVmZmVycyAtIE11bHRpcGxlIHZlcnRleCBidWZmZXJzIHRvIHVzZS5cclxuICAgICAqIEBwYXJhbSB7QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl9IHNwZWMuaW5kaWNlcyAtIFRoZSBpbmRpY2VzIHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7SW5kZXhCdWZmZXJ9IHNwZWMuaW5kZXhidWZmZXIgLSBBbiBleGlzdGluZyBpbmRleCBidWZmZXIgdG8gdXNlLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFJlbmRlcmFibGUoIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgaWYgKCBzcGVjLnZlcnRleEJ1ZmZlciB8fCBzcGVjLnZlcnRleEJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSBleGlzdGluZyB2ZXJ0ZXggYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IHNwZWMudmVydGV4QnVmZmVycyB8fCBbIHNwZWMudmVydGV4QnVmZmVyIF07XHJcbiAgICAgICAgfSBlbHNlIGlmICggc3BlYy52ZXJ0aWNlcyApIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBwYWNrYWdlXHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhQYWNrYWdlID0gbmV3IFZlcnRleFBhY2thZ2UoIHNwZWMudmVydGljZXMgKTtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gWyBuZXcgVmVydGV4QnVmZmVyKCB2ZXJ0ZXhQYWNrYWdlICkgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLmluZGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgaW5kZXggYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBzcGVjLmluZGV4QnVmZmVyO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNwZWMuaW5kaWNlcyApIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGluZGV4IGJ1ZmZlclxyXG4gICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbmV3IEluZGV4QnVmZmVyKCBzcGVjLmluZGljZXMgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2hlY2sgdGhhdCBubyBhdHRyaWJ1dGUgaW5kaWNlcyBjbGFzaFxyXG4gICAgICAgIGNoZWNrSW5kZXhDb2xsaXNpb25zKCB0aGlzLnZlcnRleEJ1ZmZlcnMgKTtcclxuICAgICAgICAvLyBzdG9yZSByZW5kZXJpbmcgb3B0aW9uc1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbW9kZTogc3BlYy5tb2RlLFxyXG4gICAgICAgICAgICBieXRlT2Zmc2V0OiBzcGVjLmJ5dGVPZmZzZXQsXHJcbiAgICAgICAgICAgIGNvdW50OiBzcGVjLmNvdW50XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIHVuZGVybHlpbmcgYnVmZmVycy5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJhYmxlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5ieXRlT2Zmc2V0IC0gVGhlIGJ5dGVPZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlcmFibGV9IFJldHVybnMgdGhlIHJlbmRlcmFibGUgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyYWJsZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG4gICAgICAgIHZhciBvdmVycmlkZXMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIC8vIG92ZXJyaWRlIG9wdGlvbnMgaWYgcHJvdmlkZWRcclxuICAgICAgICBvdmVycmlkZXMubW9kZSA9IG92ZXJyaWRlcy5tb2RlIHx8IHRoaXMub3B0aW9ucy5tb2RlO1xyXG4gICAgICAgIG92ZXJyaWRlcy5ieXRlT2Zmc2V0ID0gKCBvdmVycmlkZXMuYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkICkgPyBvdmVycmlkZXMuYnl0ZU9mZnNldCA6IHRoaXMub3B0aW9ucy5ieXRlT2Zmc2V0O1xyXG4gICAgICAgIG92ZXJyaWRlcy5jb3VudCA9ICggb3ZlcnJpZGVzLmNvdW50ICE9PSB1bmRlZmluZWQgKSA/IG92ZXJyaWRlcy5jb3VudCA6IHRoaXMub3B0aW9ucy5jb3VudDtcclxuICAgICAgICAvLyBkcmF3IHRoZSByZW5kZXJhYmxlXHJcbiAgICAgICAgaWYgKCB0aGlzLmluZGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgaW5kZXggYnVmZmVyIHRvIGRyYXcgZWxlbWVudHNcclxuICAgICAgICAgICAgLy8gYmluZCB2ZXJ0ZXggYnVmZmVycyBhbmQgZW5hYmxlIGF0dHJpYnV0ZSBwb2ludGVyc1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCggZnVuY3Rpb24oIHZlcnRleEJ1ZmZlciApIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5iaW5kKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBkcmF3IHByaW1pdGl2ZXMgdXNpbmcgaW5kZXggYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuZHJhdyggb3ZlcnJpZGVzICk7XHJcbiAgICAgICAgICAgIC8vIGRpc2FibGUgYXR0cmlidXRlIHBvaW50ZXJzXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLnVuYmluZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gbm8gYWR2YW50YWdlIHRvIHVuYmluZGluZyBhcyB0aGVyZSBpcyBubyBzdGFjayB1c2VkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gbm8gaW5kZXggYnVmZmVyLCB1c2UgZHJhdyBhcnJheXNcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzLmZvckVhY2goIGZ1bmN0aW9uKCB2ZXJ0ZXhCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLmRyYXcoIG92ZXJyaWRlcyApO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLnVuYmluZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVuZGVyYWJsZTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcbiAgICB2YXIgU2hhZGVyUGFyc2VyID0gcmVxdWlyZSgnLi9TaGFkZXJQYXJzZXInKTtcbiAgICB2YXIgV2ViR0xDb250ZXh0U3RhdGUgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dFN0YXRlJyk7XG4gICAgdmFyIEFzeW5jID0gcmVxdWlyZSgnLi4vdXRpbC9Bc3luYycpO1xuICAgIHZhciBYSFJMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL1hIUkxvYWRlcicpO1xuICAgIHZhciBVTklGT1JNX0ZVTkNUSU9OUyA9IHtcbiAgICAgICAgJ2Jvb2wnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ2Jvb2xbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ2Zsb2F0JzogJ3VuaWZvcm0xZicsXG4gICAgICAgICdmbG9hdFtdJzogJ3VuaWZvcm0xZnYnLFxuICAgICAgICAnaW50JzogJ3VuaWZvcm0xaScsXG4gICAgICAgICdpbnRbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ3VpbnQnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ3VpbnRbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ3ZlYzInOiAndW5pZm9ybTJmdicsXG4gICAgICAgICd2ZWMyW10nOiAndW5pZm9ybTJmdicsXG4gICAgICAgICdpdmVjMic6ICd1bmlmb3JtMml2JyxcbiAgICAgICAgJ2l2ZWMyW10nOiAndW5pZm9ybTJpdicsXG4gICAgICAgICd2ZWMzJzogJ3VuaWZvcm0zZnYnLFxuICAgICAgICAndmVjM1tdJzogJ3VuaWZvcm0zZnYnLFxuICAgICAgICAnaXZlYzMnOiAndW5pZm9ybTNpdicsXG4gICAgICAgICdpdmVjM1tdJzogJ3VuaWZvcm0zaXYnLFxuICAgICAgICAndmVjNCc6ICd1bmlmb3JtNGZ2JyxcbiAgICAgICAgJ3ZlYzRbXSc6ICd1bmlmb3JtNGZ2JyxcbiAgICAgICAgJ2l2ZWM0JzogJ3VuaWZvcm00aXYnLFxuICAgICAgICAnaXZlYzRbXSc6ICd1bmlmb3JtNGl2JyxcbiAgICAgICAgJ21hdDInOiAndW5pZm9ybU1hdHJpeDJmdicsXG4gICAgICAgICdtYXQyW10nOiAndW5pZm9ybU1hdHJpeDJmdicsXG4gICAgICAgICdtYXQzJzogJ3VuaWZvcm1NYXRyaXgzZnYnLFxuICAgICAgICAnbWF0M1tdJzogJ3VuaWZvcm1NYXRyaXgzZnYnLFxuICAgICAgICAnbWF0NCc6ICd1bmlmb3JtTWF0cml4NGZ2JyxcbiAgICAgICAgJ21hdDRbXSc6ICd1bmlmb3JtTWF0cml4NGZ2JyxcbiAgICAgICAgJ3NhbXBsZXIyRCc6ICd1bmlmb3JtMWknLFxuICAgICAgICAnc2FtcGxlckN1YmUnOiAndW5pZm9ybTFpJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIG1hcCBvZiBleGlzdGluZyBhdHRyaWJ1dGVzLCBmaW5kIHRoZSBsb3dlc3QgaW5kZXggdGhhdCBpcyBub3RcbiAgICAgKiBhbHJlYWR5IHVzZWQuIElmIHRoZSBhdHRyaWJ1dGUgb3JkZXJpbmcgd2FzIGFscmVhZHkgcHJvdmlkZWQsIHVzZSB0aGF0XG4gICAgICogaW5zdGVhZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgZXhpc3RpbmcgYXR0cmlidXRlcyBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRlY2xhcmF0aW9uIC0gVGhlIGF0dHJpYnV0ZSBkZWNsYXJhdGlvbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYXR0cmlidXRlIGluZGV4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZUluZGV4KCBhdHRyaWJ1dGVzLCBkZWNsYXJhdGlvbiApIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgYXR0cmlidXRlIGlzIGFscmVhZHkgZGVjbGFyZWQsIGlmIHNvLCB1c2UgdGhhdCBpbmRleFxuICAgICAgICBpZiAoIGF0dHJpYnV0ZXNbIGRlY2xhcmF0aW9uLm5hbWUgXSApIHtcbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzWyBkZWNsYXJhdGlvbi5uYW1lIF0uaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIG5leHQgYXZhaWxhYmxlIGluZGV4XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyggYXR0cmlidXRlcyApLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlciBzb3VyY2UsIHBhcnNlcyB0aGUgZGVjbGFyYXRpb25zIGFuZCBhcHBlbmRzIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdG8gdGhlIHVuaWZvcm1zIGFuZCBhdHRyaWJ0dWVzIGRlY2xhcmVkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIHNoYWRlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZlcnRTb3VyY2UgLSBUaGUgdmVydGV4IHNoYWRlciBzb3VyY2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZyYWdTb3VyY2UgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0QXR0cmlidXRlc0FuZFVuaWZvcm1zKCBzaGFkZXIsIHZlcnRTb3VyY2UsIGZyYWdTb3VyY2UgKSB7XG4gICAgICAgIHZhciBkZWNsYXJhdGlvbnMgPSBTaGFkZXJQYXJzZXIucGFyc2VEZWNsYXJhdGlvbnMoXG4gICAgICAgICAgICBbIHZlcnRTb3VyY2UsIGZyYWdTb3VyY2UgXSxcbiAgICAgICAgICAgIFsgJ3VuaWZvcm0nLCAnYXR0cmlidXRlJyBdXG4gICAgICAgICk7XG4gICAgICAgIC8vIGZvciBlYWNoIGRlY2xhcmF0aW9uIGluIHRoZSBzaGFkZXJcbiAgICAgICAgZGVjbGFyYXRpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBkZWNsYXJhdGlvbiApIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0cyBhbiBhdHRyaWJ1dGUgb3IgdW5pZm9ybVxuICAgICAgICAgICAgaWYgKCBkZWNsYXJhdGlvbi5xdWFsaWZpZXIgPT09ICdhdHRyaWJ1dGUnICkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGF0dHJpYnV0ZSwgc3RvcmUgdHlwZSBhbmQgaW5kZXhcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBnZXRBdHRyaWJ1dGVJbmRleCggc2hhZGVyLmF0dHJpYnV0ZXMsIGRlY2xhcmF0aW9uICk7XG4gICAgICAgICAgICAgICAgc2hhZGVyLmF0dHJpYnV0ZXNbIGRlY2xhcmF0aW9uLm5hbWUgXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ3VuaWZvcm0nICkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHVuaWZvcm0sIHN0b3JlIHR5cGUgYW5kIGJ1ZmZlciBmdW5jdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgc2hhZGVyLnVuaWZvcm1zWyBkZWNsYXJhdGlvbi5uYW1lIF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlY2xhcmF0aW9uLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IFVOSUZPUk1fRlVOQ1RJT05TWyBkZWNsYXJhdGlvbi50eXBlICsgKGRlY2xhcmF0aW9uLmNvdW50ID4gMSA/ICdbXScgOiAnJykgXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgc2hhZGVyIHNvdXJjZSBzdHJpbmcgYW5kIHNoYWRlciB0eXBlLCBjb21waWxlcyB0aGUgc2hhZGVyIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgV2ViR0xTaGFkZXIgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gZ2wgLSBUaGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNoYWRlclNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHNoYWRlciB0eXBlLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1dlYkdMU2hhZGVyfSBUaGUgY29tcGlsZWQgc2hhZGVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb21waWxlU2hhZGVyKCBnbCwgc2hhZGVyU291cmNlLCB0eXBlICkge1xuICAgICAgICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKCBnbFsgdHlwZSBdICk7XG4gICAgICAgIGdsLnNoYWRlclNvdXJjZSggc2hhZGVyLCBzaGFkZXJTb3VyY2UgKTtcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlciggc2hhZGVyICk7XG4gICAgICAgIGlmICggIWdsLmdldFNoYWRlclBhcmFtZXRlciggc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyApICkge1xuICAgICAgICAgICAgdGhyb3cgJ0FuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczpcXG4nICsgZ2wuZ2V0U2hhZGVySW5mb0xvZyggc2hhZGVyICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgYXR0cmlidXRlIGxvY2F0aW9ucyBmb3IgdGhlIFNoYWRlciBvYmplY3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiaW5kQXR0cmlidXRlTG9jYXRpb25zKCBzaGFkZXIgKSB7XG4gICAgICAgIHZhciBnbCA9IHNoYWRlci5nbDtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBzaGFkZXIuYXR0cmlidXRlcztcbiAgICAgICAgT2JqZWN0LmtleXMoIGF0dHJpYnV0ZXMgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xuICAgICAgICAgICAgLy8gYmluZCB0aGUgYXR0cmlidXRlIGxvY2F0aW9uXG4gICAgICAgICAgICBnbC5iaW5kQXR0cmliTG9jYXRpb24oXG4gICAgICAgICAgICAgICAgc2hhZGVyLnByb2dyYW0sXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1sga2V5IF0uaW5kZXgsXG4gICAgICAgICAgICAgICAga2V5ICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFF1ZXJpZXMgdGhlIHdlYmdsIHJlbmRlcmluZyBjb250ZXh0IGZvciB0aGUgdW5pZm9ybSBsb2NhdGlvbnMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRVbmlmb3JtTG9jYXRpb25zKCBzaGFkZXIgKSB7XG4gICAgICAgIHZhciBnbCA9IHNoYWRlci5nbDtcbiAgICAgICAgdmFyIHVuaWZvcm1zID0gc2hhZGVyLnVuaWZvcm1zO1xuICAgICAgICBPYmplY3Qua2V5cyggdW5pZm9ybXMgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSB1bmlmb3JtIGxvY2F0aW9uXG4gICAgICAgICAgICB1bmlmb3Jtc1sga2V5IF0ubG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oIHNoYWRlci5wcm9ncmFtLCBrZXkgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgc2hhZGVyIHNvdXJjZSBmcm9tIGEgdXJsLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCB0byBsb2FkIHRoZSByZXNvdXJjZSBmcm9tLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gbG9hZCB0aGUgc2hhZGVyIHNvdXJjZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkU2hhZGVyU291cmNlKCB1cmwgKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcbiAgICAgICAgICAgIFhIUkxvYWRlci5sb2FkKHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggcmVzICkge1xuICAgICAgICAgICAgICAgICAgICBkb25lKCBudWxsLCByZXMgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggZXJyICkge1xuICAgICAgICAgICAgICAgICAgICBkb25lKCBlcnIsIG51bGwgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNvdXJjZSBvZiB0aGUgc2hhZGVyLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhc3NUaHJvdWdoU291cmNlKCBzb3VyY2UgKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcbiAgICAgICAgICAgIGRvbmUoIG51bGwsIHNvdXJjZSApO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGFuIGFycmF5IG9mIEdMU0wgc291cmNlIHN0cmluZ3MgYW5kIFVSTHMsIGFuZCByZXNvbHZlcyB0aGVtIGludG8gYW5kIGFycmF5IG9mIEdMU0wgc291cmNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2VzIC0gVGhlIHNoYWRlciBzb3VyY2VzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgLSBBIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIHNoYWRlciBzb3VyY2VzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc29sdmVTb3VyY2VzKCBzb3VyY2VzICkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGRvbmUgKSB7XG4gICAgICAgICAgICB2YXIgdGFza3MgPSBbXTtcbiAgICAgICAgICAgIHNvdXJjZXMgPSBzb3VyY2VzIHx8IFtdO1xuICAgICAgICAgICAgc291cmNlcyA9ICggISggc291cmNlcyBpbnN0YW5jZW9mIEFycmF5ICkgKSA/IFsgc291cmNlcyBdIDogc291cmNlcztcbiAgICAgICAgICAgIHNvdXJjZXMuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcbiAgICAgICAgICAgICAgICBpZiAoIFNoYWRlclBhcnNlci5pc0dMU0woIHNvdXJjZSApICkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKCBwYXNzVGhyb3VnaFNvdXJjZSggc291cmNlICkgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKCBsb2FkU2hhZGVyU291cmNlKCBzb3VyY2UgKSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQXN5bmMucGFyYWxsZWwoIHRhc2tzLCBkb25lICk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgc2hhZGVyIHByb2dyYW0gb2JqZWN0IGZyb20gc291cmNlIHN0cmluZ3MuIFRoaXMgaW5jbHVkZXM6XG4gICAgICogICAgMSkgQ29tcGlsaW5nIGFuZCBsaW5raW5nIHRoZSBzaGFkZXIgcHJvZ3JhbS5cbiAgICAgKiAgICAyKSBQYXJzaW5nIHNoYWRlciBzb3VyY2UgZm9yIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbi5cbiAgICAgKiAgICAzKSBCaW5kaW5nIGF0dHJpYnV0ZSBsb2NhdGlvbnMsIGJ5IG9yZGVyIG9mIGRlbGNhcmF0aW9uLlxuICAgICAqICAgIDQpIFF1ZXJ5aW5nIGFuZCBzdG9yaW5nIHVuaWZvcm0gbG9jYXRpb24uXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlcyAtIEEgbWFwIGNvbnRhaW5pbmcgc291cmNlcyB1bmRlciAndmVydCcgYW5kICdmcmFnJyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVQcm9ncmFtKCBzaGFkZXIsIHNvdXJjZXMgKSB7XG4gICAgICAgIHZhciBnbCA9IHNoYWRlci5nbDtcbiAgICAgICAgdmFyIGNvbW1vbiA9IHNvdXJjZXMuY29tbW9uLmpvaW4oICcnICk7XG4gICAgICAgIHZhciB2ZXJ0ID0gc291cmNlcy52ZXJ0LmpvaW4oICcnICk7XG4gICAgICAgIHZhciBmcmFnID0gc291cmNlcy5mcmFnLmpvaW4oICcnICk7XG4gICAgICAgIC8vIGNvbXBpbGUgc2hhZGVyc1xuICAgICAgICB2YXIgdmVydGV4U2hhZGVyID0gY29tcGlsZVNoYWRlciggZ2wsIGNvbW1vbiArIHZlcnQsICdWRVJURVhfU0hBREVSJyApO1xuICAgICAgICB2YXIgZnJhZ21lbnRTaGFkZXIgPSBjb21waWxlU2hhZGVyKCBnbCwgY29tbW9uICsgZnJhZywgJ0ZSQUdNRU5UX1NIQURFUicgKTtcbiAgICAgICAgLy8gcGFyc2Ugc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm1zXG4gICAgICAgIHNldEF0dHJpYnV0ZXNBbmRVbmlmb3Jtcyggc2hhZGVyLCB2ZXJ0LCBmcmFnICk7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgc2hhZGVyIHByb2dyYW1cbiAgICAgICAgc2hhZGVyLnByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgICAgIC8vIGF0dGFjaCB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlcnNcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKCBzaGFkZXIucHJvZ3JhbSwgdmVydGV4U2hhZGVyICk7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlciggc2hhZGVyLnByb2dyYW0sIGZyYWdtZW50U2hhZGVyICk7XG4gICAgICAgIC8vIGJpbmQgdmVydGV4IGF0dHJpYnV0ZSBsb2NhdGlvbnMgQkVGT1JFIGxpbmtpbmdcbiAgICAgICAgYmluZEF0dHJpYnV0ZUxvY2F0aW9ucyggc2hhZGVyICk7XG4gICAgICAgIC8vIGxpbmsgc2hhZGVyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKCBzaGFkZXIucHJvZ3JhbSApO1xuICAgICAgICAvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxuICAgICAgICBpZiAoICFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKCBzaGFkZXIucHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMgKSApIHtcbiAgICAgICAgICAgIHRocm93ICdBbiBlcnJvciBvY2N1cmVkIGxpbmtpbmcgdGhlIHNoYWRlcjpcXG4nICsgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coIHNoYWRlci5wcm9ncmFtICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IHNoYWRlciB1bmlmb3JtIGxvY2F0aW9uc1xuICAgICAgICBnZXRVbmlmb3JtTG9jYXRpb25zKCBzaGFkZXIgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBTaGFkZXIgb2JqZWN0LlxuICAgICAqIEBjbGFzcyBTaGFkZXJcbiAgICAgKiBAY2xhc3NkZXNjIEEgc2hhZGVyIGNsYXNzIHRvIGFzc2lzdCBpbiBjb21waWxpbmcgYW5kIGxpbmtpbmcgd2ViZ2xcbiAgICAgKiBzaGFkZXJzLCBzdG9yaW5nIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBsb2NhdGlvbnMsIGFuZCBidWZmZXJpbmcgdW5pZm9ybXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSBzaGFkZXIgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmNvbW1vbiAtIFNvdXJjZXMgLyBVUkxzIHRvIGJlIHNoYXJlZCBieSBib3RoIHZ2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlcnMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLnZlcnQgLSBUaGUgdmVydGV4IHNoYWRlciBzb3VyY2VzIC8gVVJMcy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xTdHJpbmdbXXxPYmplY3R9IHNwZWMuZnJhZyAtIFRoZSBmcmFnbWVudCBzaGFkZXIgc291cmNlcyAvIFVSTHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmdbXX0gc3BlYy5hdHRyaWJ1dGVzIC0gVGhlIGF0dHJpYnV0ZSBpbmRleCBvcmRlcmluZ3MuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbmNlIHRoZSBzaGFkZXJcbiAgICAgKiAgICAgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNvbXBpbGVkIGFuZCBsaW5rZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gU2hhZGVyKCBzcGVjLCBjYWxsYmFjayApIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcbiAgICAgICAgLy8gY2hlY2sgc291cmNlIGFyZ3VtZW50c1xuICAgICAgICBpZiAoICFzcGVjLnZlcnQgKSB7XG4gICAgICAgICAgICB0aHJvdyAnVmVydGV4IHNoYWRlciBhcmd1bWVudCBoYXMgbm90IGJlZW4gcHJvdmlkZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICggIXNwZWMuZnJhZyApIHtcbiAgICAgICAgICAgIHRocm93ICdGcmFnbWVudCBzaGFkZXIgYXJndW1lbnQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2dyYW0gPSAwO1xuICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICB0aGlzLnN0YXRlID0gV2ViR0xDb250ZXh0U3RhdGUuZ2V0KCB0aGlzLmdsICk7XG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHNwZWMudmVyc2lvbiB8fCAnMS4wMCc7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgICAgICB0aGlzLnVuaWZvcm1zID0ge307XG4gICAgICAgIC8vIGlmIGF0dHJpYnV0ZSBvcmRlcmluZyBpcyBwcm92aWRlZCwgdXNlIHRob3NlIGluZGljZXNcbiAgICAgICAgaWYgKCBzcGVjLmF0dHJpYnV0ZXMgKSB7XG4gICAgICAgICAgICBzcGVjLmF0dHJpYnV0ZXMuZm9yRWFjaCggZnVuY3Rpb24oIGF0dHIsIGluZGV4ICkge1xuICAgICAgICAgICAgICAgIHRoYXQuYXR0cmlidXRlc1sgYXR0ciBdID0ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY3JlYXRlIHRoZSBzaGFkZXJcbiAgICAgICAgQXN5bmMucGFyYWxsZWwoe1xuICAgICAgICAgICAgY29tbW9uOiByZXNvbHZlU291cmNlcyggc3BlYy5jb21tb24gKSxcbiAgICAgICAgICAgIHZlcnQ6IHJlc29sdmVTb3VyY2VzKCBzcGVjLnZlcnQgKSxcbiAgICAgICAgICAgIGZyYWc6IHJlc29sdmVTb3VyY2VzKCBzcGVjLmZyYWcgKSxcbiAgICAgICAgfSwgZnVuY3Rpb24oIGVyciwgc291cmNlcyApIHtcbiAgICAgICAgICAgIGlmICggZXJyICkge1xuICAgICAgICAgICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBlcnIsIG51bGwgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gb25jZSBhbGwgc2hhZGVyIHNvdXJjZXMgYXJlIGxvYWRlZFxuICAgICAgICAgICAgY3JlYXRlUHJvZ3JhbSggdGhhdCwgc291cmNlcyApO1xuICAgICAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggbnVsbCwgdGhhdCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgc2hhZGVyIG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxuICAgICAqXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBTaGFkZXIucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaWYgdGhpcyBzaGFkZXIgaXMgYWxyZWFkeSBib3VuZCwgbm8gbmVlZCB0byByZWJpbmRcbiAgICAgICAgaWYgKCB0aGlzLnN0YXRlLnNoYWRlcnMudG9wKCkgIT09IHRoaXMgKSB7XG4gICAgICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0oIHRoaXMucHJvZ3JhbSApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUuc2hhZGVycy5wdXNoKCB0aGlzICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVbmJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0IGFuZCBiaW5kcyB0aGUgc2hhZGVyIGJlbmVhdGggaXQgb24gdGhpcyBzdGFjay4gSWYgdGhlcmUgaXMgbm8gdW5kZXJseWluZyBzaGFkZXIsIGJpbmQgdGhlIGJhY2tidWZmZXIuXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxuICAgICAqXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBTaGFkZXIucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBzaGFkZXIgYm91bmQsIGV4aXQgZWFybHlcbiAgICAgICAgaWYgKCBzdGF0ZS5zaGFkZXJzLnRvcCgpICE9PSB0aGlzICkge1xuICAgICAgICAgICAgdGhyb3cgJ1NoYWRlciBpcyBub3QgdGhlIHRvcCBtb3N0IGVsZW1lbnQgb24gdGhlIHN0YWNrJztcbiAgICAgICAgfVxuICAgICAgICAvLyBwb3Agc2hhZGVyIG9mZiBzdGFja1xuICAgICAgICBzdGF0ZS5zaGFkZXJzLnBvcCgpO1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbiB1bmRlcmx5aW5nIHNoYWRlciwgYmluZCBpdFxuICAgICAgICB2YXIgdG9wID0gc3RhdGUuc2hhZGVycy50b3AoKTtcbiAgICAgICAgaWYgKCB0b3AgJiYgdG9wICE9PSB0aGlzICkge1xuICAgICAgICAgICAgdG9wLmdsLnVzZVByb2dyYW0oIHRvcC5wcm9ncmFtICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGhlIHNoYWRlclxuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKCBudWxsICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEJ1ZmZlciBhIHVuaWZvcm0gdmFsdWUgYnkgbmFtZS5cbiAgICAgKiBAbWVtYmVyb2YgU2hhZGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSB1bmlmb3JtIG5hbWUgaW4gdGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB1bmlmb3JtIHZhbHVlIHRvIGJ1ZmZlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtID0gZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuICAgICAgICAvLyBlbnN1cmUgc2hhZGVyIGlzIGJvdW5kXG4gICAgICAgIGlmICggdGhpcyAhPT0gdGhpcy5zdGF0ZS5zaGFkZXJzLnRvcCgpICkge1xuICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gc2V0IHVuaWZvcm0gYCcgKyBuYW1lICsgJ2AgZm9yIGFuIHVuYm91bmQgc2hhZGVyJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgdW5pZm9ybSA9IHRoaXMudW5pZm9ybXNbIG5hbWUgXTtcbiAgICAgICAgLy8gZW5zdXJlIHRoYXQgdGhlIHVuaWZvcm0gc3BlYyBleGlzdHMgZm9yIHRoZSBuYW1lXG4gICAgICAgIGlmICggIXVuaWZvcm0gKSB7XG4gICAgICAgICAgICB0aHJvdyAnTm8gdW5pZm9ybSBmb3VuZCB1bmRlciBuYW1lIGAnICsgbmFtZSArICdgJztcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayB2YWx1ZVxuICAgICAgICBpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgKSB7XG4gICAgICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBhcmd1bWVudCBpcyBkZWZpbmVkXG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgcGFzc2VkIGZvciB1bmlmb3JtIGAnICsgbmFtZSArICdgIGlzIHVuZGVmaW5lZCc7XG4gICAgICAgIH0gZWxzZSBpZiAoIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IEFycmF5IHRvIEZsb2F0MzJBcnJheVxuICAgICAgICAgICAgdmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KCB2YWx1ZSApO1xuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyApIHtcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgYm9vbGVhbidzIHRvIDAgb3IgMVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA/IDEgOiAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIHBhc3MgdGhlIGFyZ3VtZW50cyBkZXBlbmRpbmcgb24gdGhlIHR5cGVcbiAgICAgICAgaWYgKCB1bmlmb3JtLnR5cGUgPT09ICdtYXQyJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQzJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQ0JyApIHtcbiAgICAgICAgICAgIHRoaXMuZ2xbIHVuaWZvcm0uZnVuYyBdKCB1bmlmb3JtLmxvY2F0aW9uLCBmYWxzZSwgdmFsdWUgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2xbIHVuaWZvcm0uZnVuYyBdKCB1bmlmb3JtLmxvY2F0aW9uLCB2YWx1ZSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBCdWZmZXIgYSBtYXAgb2YgdW5pZm9ybSB2YWx1ZXMuXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVuaWZvcm1zIC0gVGhlIG1hcCBvZiB1bmlmb3JtcyBrZXllZCBieSBuYW1lLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBTaGFkZXIucHJvdG90eXBlLnNldFVuaWZvcm1zID0gZnVuY3Rpb24oIGFyZ3MgKSB7XG4gICAgICAgIC8vIGVuc3VyZSBzaGFkZXIgaXMgYm91bmRcbiAgICAgICAgaWYgKCB0aGlzICE9PSB0aGlzLnN0YXRlLnNoYWRlcnMudG9wKCkgKSB7XG4gICAgICAgICAgICB0aHJvdyAnQXR0ZW1wdGluZyB0byBzZXQgdW5pZm9ybSBgJyArIG5hbWUgKyAnYCBmb3IgYW4gdW5ib3VuZCBzaGFkZXInO1xuICAgICAgICB9XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIHZhciB1bmlmb3JtcyA9IHRoaXMudW5pZm9ybXM7XG4gICAgICAgIE9iamVjdC5rZXlzKCBhcmdzICkuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzW25hbWVdO1xuICAgICAgICAgICAgdmFyIHVuaWZvcm0gPSB1bmlmb3Jtc1tuYW1lXTtcbiAgICAgICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZSB1bmlmb3JtIGV4aXN0cyBmb3IgdGhlIG5hbWVcbiAgICAgICAgICAgIGlmICggIXVuaWZvcm0gKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ05vIHVuaWZvcm0gZm91bmQgdW5kZXIgbmFtZSBgJyArIG5hbWUgKyAnYCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgLy8gZW5zdXJlIHRoYXQgdGhlIHVuaWZvcm0gYXJndW1lbnQgaXMgZGVmaW5lZFxuICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBwYXNzZWQgZm9yIHVuaWZvcm0gYCcgKyBuYW1lICsgJ2AgaXMgdW5kZWZpbmVkJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udmVydCBBcnJheSB0byBGbG9hdDMyQXJyYXlcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ldyBGbG9hdDMyQXJyYXkoIHZhbHVlICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyApIHtcbiAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IGJvb2xlYW4ncyB0byAwIG9yIDFcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID8gMSA6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwYXNzIHRoZSBhcmd1bWVudHMgZGVwZW5kaW5nIG9uIHRoZSB0eXBlXG4gICAgICAgICAgICBpZiAoIHVuaWZvcm0udHlwZSA9PT0gJ21hdDInIHx8IHVuaWZvcm0udHlwZSA9PT0gJ21hdDMnIHx8IHVuaWZvcm0udHlwZSA9PT0gJ21hdDQnICkge1xuICAgICAgICAgICAgICAgIGdsWyB1bmlmb3JtLmZ1bmMgXSggdW5pZm9ybS5sb2NhdGlvbiwgZmFsc2UsIHZhbHVlICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdsWyB1bmlmb3JtLmZ1bmMgXSggdW5pZm9ybS5sb2NhdGlvbiwgdmFsdWUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNoYWRlcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBQUkVDSVNJT05fUVVBTElGSUVSUyA9IHtcclxuICAgICAgICBoaWdocDogdHJ1ZSxcclxuICAgICAgICBtZWRpdW1wOiB0cnVlLFxyXG4gICAgICAgIGxvd3A6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFBSRUNJU0lPTl9UWVBFUyA9IHtcclxuICAgICAgICBmbG9hdDogJ2Zsb2F0JyxcclxuICAgICAgICB2ZWMyOiAnZmxvYXQnLFxyXG4gICAgICAgIHZlYzM6ICdmbG9hdCcsXHJcbiAgICAgICAgdmVjNDogJ2Zsb2F0JyxcclxuICAgICAgICBpdmVjMjogJ2ludCcsXHJcbiAgICAgICAgaXZlYzM6ICdpbnQnLFxyXG4gICAgICAgIGl2ZWM0OiAnaW50JyxcclxuICAgICAgICBpbnQ6ICdpbnQnLFxyXG4gICAgICAgIHVpbnQ6ICdpbnQnLFxyXG4gICAgICAgIHNhbXBsZXIyRDogJ3NhbXBsZXIyRCcsXHJcbiAgICAgICAgc2FtcGxlckN1YmU6ICdzYW1wbGVyQ3ViZScsXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBDT01NRU5UU19SRUdFWFAgPSAvKFxcL1xcKihbXFxzXFxTXSo/KVxcKlxcLyl8KFxcL1xcLyguKikkKS9nbTtcclxuICAgIHZhciBFTkRMSU5FX1JFR0VYUCA9IC8oXFxyXFxufFxcbnxcXHIpL2dtO1xyXG4gICAgdmFyIFdISVRFU1BBQ0VfUkVHRVhQID0gL1xcc3syLH0vZztcclxuICAgIHZhciBCUkFDS0VUX1dISVRFU1BBQ0VfUkVHRVhQID0gLyhcXHMqKShcXFspKFxccyopKFxcZCspKFxccyopKFxcXSkoXFxzKikvZztcclxuICAgIHZhciBOQU1FX0NPVU5UX1JFR0VYUCA9IC8oW2EtekEtWl9dW2EtekEtWjAtOV9dKikoPzpcXFsoXFxkKylcXF0pPy87XHJcbiAgICB2YXIgUFJFQ0lTSU9OX1JFR0VYID0gL1xcYihwcmVjaXNpb24pXFxzKyhcXHcrKVxccysoXFx3KykvO1xyXG4gICAgdmFyIEdMU0xfUkVHRVhQID0gIC92b2lkXFxzK21haW5cXHMqXFwoXFxzKih2b2lkKSpcXHMqXFwpXFxzKi9taTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgc3RhbmRhcmQgY29tbWVudHMgZnJvbSB0aGUgcHJvdmlkZWQgc3RyaW5nLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzdHJpcCBjb21tZW50cyBmcm9tLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBjb21tZW50bGVzcyBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHN0cmlwQ29tbWVudHMoIHN0ciApIHtcclxuICAgICAgICAvLyByZWdleCBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb2Fncml1cy9zdHJpcGNvbW1lbnRzXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKCBDT01NRU5UU19SRUdFWFAsICcnICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbGwgd2hpdGVzcGFjZSBpbnRvIGEgc2luZ2xlICcgJyBzcGFjZSBjaGFyYWN0ZXIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgc3RyaW5nIHRvIG5vcm1hbGl6ZSB3aGl0ZXNwYWNlIGZyb20uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBub3JtYWxpemVXaGl0ZXNwYWNlKCBzdHIgKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKCBFTkRMSU5FX1JFR0VYUCwgJyAnICkgLy8gcmVtb3ZlIGxpbmUgZW5kaW5nc1xyXG4gICAgICAgICAgICAucmVwbGFjZSggV0hJVEVTUEFDRV9SRUdFWFAsICcgJyApIC8vIG5vcm1hbGl6ZSB3aGl0ZXNwYWNlIHRvIHNpbmdsZSAnICdcclxuICAgICAgICAgICAgLnJlcGxhY2UoIEJSQUNLRVRfV0hJVEVTUEFDRV9SRUdFWFAsICckMiQ0JDYnICk7IC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGluIGJyYWNrZXRzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzZXMgdGhlIG5hbWUgYW5kIGNvdW50IG91dCBvZiBhIG5hbWUgc3RhdGVtZW50LCByZXR1cm5pbmcgdGhlXHJcbiAgICAgKiBkZWNsYXJhdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBxdWFsaWZpZXIgLSBUaGUgcXVhbGlmaWVyIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcmVjaXNpb24gLSBUaGUgcHJlY2lzaW9uIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgc3RyaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVudHJ5IC0gVGhlIHZhcmlhYmxlIGRlY2xhcmF0aW9uIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGVjbGFyYXRpb24gb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZU5hbWVBbmRDb3VudCggcXVhbGlmaWVyLCBwcmVjaXNpb24sIHR5cGUsIGVudHJ5ICkge1xyXG4gICAgICAgIC8vIGRldGVybWluZSBuYW1lIGFuZCBzaXplIG9mIHZhcmlhYmxlXHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBlbnRyeS5tYXRjaCggTkFNRV9DT1VOVF9SRUdFWFAgKTtcclxuICAgICAgICB2YXIgbmFtZSA9IG1hdGNoZXNbMV07XHJcbiAgICAgICAgdmFyIGNvdW50ID0gKCBtYXRjaGVzWzJdID09PSB1bmRlZmluZWQgKSA/IDEgOiBwYXJzZUludCggbWF0Y2hlc1syXSwgMTAgKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBxdWFsaWZpZXI6IHF1YWxpZmllcixcclxuICAgICAgICAgICAgcHJlY2lzaW9uOiBwcmVjaXNpb24sXHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgIGNvdW50OiBjb3VudFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzZXMgYSBzaW5nbGUgJ3N0YXRlbWVudCcuIEEgJ3N0YXRlbWVudCcgaXMgY29uc2lkZXJlZCBhbnkgc2VxdWVuY2Ugb2ZcclxuICAgICAqIGNoYXJhY3RlcnMgZm9sbG93ZWQgYnkgYSBzZW1pLWNvbG9uLiBUaGVyZWZvcmUsIGEgc2luZ2xlICdzdGF0ZW1lbnQnIGluXHJcbiAgICAgKiB0aGlzIHNlbnNlIGNvdWxkIGNvbnRhaW4gc2V2ZXJhbCBjb21tYSBzZXBhcmF0ZWQgZGVjbGFyYXRpb25zLiBSZXR1cm5zXHJcbiAgICAgKiBhbGwgcmVzdWx0aW5nIGRlY2xhcmF0aW9ucy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlbWVudCAtIFRoZSBzdGF0ZW1lbnQgdG8gcGFyc2UuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJlY2lzaW9ucyAtIFRoZSBjdXJyZW50IHN0YXRlIG9mIGdsb2JhbCBwcmVjaXNpb25zLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIHBhcnNlZCBkZWNsYXJhdGlvbiBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZVN0YXRlbWVudCggc3RhdGVtZW50LCBwcmVjaXNpb25zICkge1xyXG4gICAgICAgIC8vIHNwbGl0IHN0YXRlbWVudCBvbiBjb21tYXNcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIFsgJ3VuaWZvcm0gaGlnaHAgbWF0NCBBWzEwXScsICdCJywgJ0NbMl0nIF1cclxuICAgICAgICAvL1xyXG4gICAgICAgIHZhciBjb21tYVNwbGl0ID0gc3RhdGVtZW50LnNwbGl0KCcsJykubWFwKCBmdW5jdGlvbiggZWxlbSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW0udHJpbSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBzcGxpdCBkZWNsYXJhdGlvbiBoZWFkZXIgZnJvbSBzdGF0ZW1lbnRcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIFsgJ3VuaWZvcm0nLCAnaGlnaHAnLCAnbWF0NCcsICdBWzEwXScgXVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdmFyIGhlYWRlciA9IGNvbW1hU3BsaXQuc2hpZnQoKS5zcGxpdCgnICcpO1xyXG5cclxuICAgICAgICAvLyBxdWFsaWZpZXIgaXMgYWx3YXlzIGZpcnN0IGVsZW1lbnRcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICd1bmlmb3JtJ1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdmFyIHF1YWxpZmllciA9IGhlYWRlci5zaGlmdCgpO1xyXG5cclxuICAgICAgICAvLyBwcmVjaXNpb24gbWF5IG9yIG1heSBub3QgYmUgZGVjbGFyZWRcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICdoaWdocCcgfHwgKGlmIGl0IHdhcyBvbWl0ZWQpICdtYXQ0J1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdmFyIHByZWNpc2lvbiA9IGhlYWRlci5zaGlmdCgpO1xyXG4gICAgICAgIHZhciB0eXBlO1xyXG4gICAgICAgIC8vIGlmIG5vdCBhIHByZWNpc2lvbiBrZXl3b3JkIGl0IGlzIHRoZSB0eXBlIGluc3RlYWRcclxuICAgICAgICBpZiAoICFQUkVDSVNJT05fUVVBTElGSUVSU1sgcHJlY2lzaW9uIF0gKSB7XHJcbiAgICAgICAgICAgIHR5cGUgPSBwcmVjaXNpb247XHJcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbnNbIFBSRUNJU0lPTl9UWVBFU1sgdHlwZSBdIF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdHlwZSA9IGhlYWRlci5zaGlmdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbGFzdCBwYXJ0IG9mIGhlYWRlciB3aWxsIGJlIHRoZSBmaXJzdCwgYW5kIHBvc3NpYmxlIG9ubHkgdmFyaWFibGUgbmFtZVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gWyAnQVsxMF0nLCAnQicsICdDWzJdJyBdXHJcbiAgICAgICAgLy9cclxuICAgICAgICB2YXIgbmFtZXMgPSBoZWFkZXIuY29uY2F0KCBjb21tYVNwbGl0ICk7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG90aGVyIG5hbWVzIGFmdGVyIGEgJywnIGFkZCB0aGVtIGFzIHdlbGxcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIG5hbWVzLmZvckVhY2goIGZ1bmN0aW9uKCBuYW1lICkge1xyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goIHBhcnNlTmFtZUFuZENvdW50KCBxdWFsaWZpZXIsIHByZWNpc2lvbiwgdHlwZSwgbmFtZSApICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTcGxpdHMgdGhlIHNvdXJjZSBzdHJpbmcgYnkgc2VtaS1jb2xvbnMgYW5kIGNvbnN0cnVjdHMgYW4gYXJyYXkgb2ZcclxuICAgICAqIGRlY2xhcmF0aW9uIG9iamVjdHMgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHF1YWxpZmllciBrZXl3b3Jkcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBrZXl3b3JkcyAtIFRoZSBxdWFsaWZpZXIgZGVjbGFyYXRpb24ga2V5d29yZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlU291cmNlKCBzb3VyY2UsIGtleXdvcmRzICkge1xyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgY29tbWVudHMgZnJvbSBzb3VyY2VcclxuICAgICAgICB2YXIgY29tbWVudGxlc3NTb3VyY2UgPSBzdHJpcENvbW1lbnRzKCBzb3VyY2UgKTtcclxuICAgICAgICAvLyBub3JtYWxpemUgYWxsIHdoaXRlc3BhY2UgaW4gdGhlIHNvdXJjZVxyXG4gICAgICAgIHZhciBub3JtYWxpemVkID0gbm9ybWFsaXplV2hpdGVzcGFjZSggY29tbWVudGxlc3NTb3VyY2UgKTtcclxuICAgICAgICAvLyBnZXQgaW5kaXZpZHVhbCBzdGF0ZW1lbnRzICggYW55IHNlcXVlbmNlIGVuZGluZyBpbiA7IClcclxuICAgICAgICB2YXIgc3RhdGVtZW50cyA9IG5vcm1hbGl6ZWQuc3BsaXQoJzsnKTtcclxuICAgICAgICAvLyBidWlsZCByZWdleCBmb3IgcGFyc2luZyBzdGF0ZW1lbnRzIHdpdGggdGFyZ2V0dGVkIGtleXdvcmRzXHJcbiAgICAgICAgdmFyIGtleXdvcmRTdHIgPSBrZXl3b3Jkcy5qb2luKCd8Jyk7XHJcbiAgICAgICAgdmFyIGtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAoICcuKlxcXFxiKCcgKyBrZXl3b3JkU3RyICsgJylcXFxcYi4qJyApO1xyXG4gICAgICAgIC8vIHBhcnNlIGFuZCBzdG9yZSBnbG9iYWwgcHJlY2lzaW9uIHN0YXRlbWVudHMgYW5kIGFueSBkZWNsYXJhdGlvbnNcclxuICAgICAgICB2YXIgcHJlY2lzaW9ucyA9IHt9O1xyXG4gICAgICAgIHZhciBtYXRjaGVkID0gW107XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggc3RhdGVtZW50XHJcbiAgICAgICAgc3RhdGVtZW50cy5mb3JFYWNoKCBmdW5jdGlvbiggc3RhdGVtZW50ICkge1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwcmVjaXNpb24gc3RhdGVtZW50XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIFsgJ3ByZWNpc2lvbiBoaWdocCBmbG9hdCcsICdwcmVjaXNpb24nLCAnaGlnaHAnLCAnZmxvYXQnIF1cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgdmFyIHBtYXRjaCA9IHN0YXRlbWVudC5tYXRjaCggUFJFQ0lTSU9OX1JFR0VYICk7XHJcbiAgICAgICAgICAgIGlmICggcG1hdGNoICkge1xyXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uc1sgcG1hdGNoWzNdIF0gPSBwbWF0Y2hbMl07XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGtleXdvcmRzXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIFsgJ3VuaWZvcm0gZmxvYXQgdGltZScgXVxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB2YXIga21hdGNoID0gc3RhdGVtZW50Lm1hdGNoKCBrZXl3b3JkUmVnZXggKTtcclxuICAgICAgICAgICAgaWYgKCBrbWF0Y2ggKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBzdGF0ZW1lbnQgYW5kIGFkZCB0byBhcnJheVxyXG4gICAgICAgICAgICAgICAgbWF0Y2hlZCA9IG1hdGNoZWQuY29uY2F0KCBwYXJzZVN0YXRlbWVudCgga21hdGNoWzBdLCBwcmVjaXNpb25zICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBtYXRjaGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmlsdGVycyBvdXQgZHVwbGljYXRlIGRlY2xhcmF0aW9ucyBwcmVzZW50IGJldHdlZW4gc2hhZGVycy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gZGVjbGFyYXRpb25zIC0gVGhlIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmaWx0ZXJlZCBhcnJheSBvZiBkZWNsYXJhdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZpbHRlckR1cGxpY2F0ZXNCeU5hbWUoIGRlY2xhcmF0aW9ucyApIHtcclxuICAgICAgICAvLyBpbiBjYXNlcyB3aGVyZSB0aGUgc2FtZSBkZWNsYXJhdGlvbnMgYXJlIHByZXNlbnQgaW4gbXVsdGlwbGVcclxuICAgICAgICAvLyBzb3VyY2VzLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSB0aGUgcmVzdWx0c1xyXG4gICAgICAgIHZhciBzZWVuID0ge307XHJcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBkZWNsYXJhdGlvbiApIHtcclxuICAgICAgICAgICAgaWYgKCBzZWVuWyBkZWNsYXJhdGlvbi5uYW1lIF0gKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VlblsgZGVjbGFyYXRpb24ubmFtZSBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyB0aGUgcHJvdmlkZWQgR0xTTCBzb3VyY2UsIGFuZCByZXR1cm5zIGFsbCBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzIHRoYXQgY29udGFpbiB0aGUgcHJvdmlkZWQgcXVhbGlmaWVyIHR5cGUuIFRoaXMgY2FuIGJlIHVzZWQgdG8gZXh0cmFjdCBhbGwgYXR0cmlidXRlcyBhbmQgdW5pZm9ybSBuYW1lcyBhbmQgdHlwZXMgZnJvbSBhIHNoYWRlci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEZvciBleGFtcGxlLCB3aGVuIHByb3ZpZGVkIGEgJ3VuaWZvcm0nIHF1YWxpZmllcnMsIHRoZSBkZWNsYXJhdGlvbjpcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAgICAndW5pZm9ybSBoaWdocCB2ZWMzIHVTcGVjdWxhckNvbG9yOydcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFdvdWxkIGJlIHBhcnNlZCB0bzpcclxuICAgICAgICAgKiAgICAge1xyXG4gICAgICAgICAqICAgICAgICAgcXVhbGlmaWVyOiAndW5pZm9ybScsXHJcbiAgICAgICAgICogICAgICAgICB0eXBlOiAndmVjMycsXHJcbiAgICAgICAgICogICAgICAgICBuYW1lOiAndVNwZWN1bGFyQ29sb3InLFxyXG4gICAgICAgICAqICAgICAgICAgY291bnQ6IDFcclxuICAgICAgICAgKiAgICAgfVxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBzb3VyY2VzIC0gVGhlIHNoYWRlciBzb3VyY2VzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBxdWFsaWZpZXJzIC0gVGhlIHF1YWxpZmllcnMgdG8gZXh0cmFjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIHF1YWxpZmllciBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHBhcnNlRGVjbGFyYXRpb25zOiBmdW5jdGlvbiggc291cmNlcywgcXVhbGlmaWVycyApIHtcclxuICAgICAgICAgICAgLy8gaWYgbm8gc291cmNlcyBvciBxdWFsaWZpZXJzIGFyZSBwcm92aWRlZCwgcmV0dXJuIGVtcHR5IGFycmF5XHJcbiAgICAgICAgICAgIGlmICggIXF1YWxpZmllcnMgfHwgcXVhbGlmaWVycy5sZW5ndGggPT09IDAgfHxcclxuICAgICAgICAgICAgICAgICFzb3VyY2VzIHx8IHNvdXJjZXMubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNvdXJjZXMgPSAoIHNvdXJjZXMgaW5zdGFuY2VvZiBBcnJheSApID8gc291cmNlcyA6IFsgc291cmNlcyBdO1xyXG4gICAgICAgICAgICBxdWFsaWZpZXJzID0gKCBxdWFsaWZpZXJzIGluc3RhbmNlb2YgQXJyYXkgKSA/IHF1YWxpZmllcnMgOiBbIHF1YWxpZmllcnMgXTtcclxuICAgICAgICAgICAgLy8gcGFyc2Ugb3V0IHRhcmdldHRlZCBkZWNsYXJhdGlvbnNcclxuICAgICAgICAgICAgdmFyIGRlY2xhcmF0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICBzb3VyY2VzLmZvckVhY2goIGZ1bmN0aW9uKCBzb3VyY2UgKSB7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnMuY29uY2F0KCBwYXJzZVNvdXJjZSggc291cmNlLCBxdWFsaWZpZXJzICkgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBkdXBsaWNhdGVzIGFuZCByZXR1cm5cclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlckR1cGxpY2F0ZXNCeU5hbWUoIGRlY2xhcmF0aW9ucyApO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERldGVjdHMgYmFzZWQgb24gdGhlIGV4aXN0ZW5jZSBvZiBhICd2b2lkIG1haW4oKSB7JyBzdGF0ZW1lbnQsIGlmIHRoZSBzdHJpbmcgaXMgZ2xzbCBzb3VyY2UgY29kZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIHRlc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgZ2xzbCBjb2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzR0xTTDogZnVuY3Rpb24oIHN0ciApIHtcclxuICAgICAgICAgICAgcmV0dXJuIEdMU0xfUkVHRVhQLnRlc3QoIHN0ciApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XHJcbiAgICB2YXIgV2ViR0xDb250ZXh0U3RhdGUgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dFN0YXRlJyk7XHJcbiAgICB2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xyXG4gICAgdmFyIE1BR19GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIE1JTl9GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHZhciBOT05fTUlQTUFQX01JTl9GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIHZhciBNSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIFdSQVBfTU9ERVMgPSB7XHJcbiAgICAgICAgUkVQRUFUOiB0cnVlLFxyXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcclxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIERFUFRIX1RZUEVTID0ge1xyXG4gICAgICAgIERFUFRIX0NPTVBPTkVOVDogdHJ1ZSxcclxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRlZmF1bHQgdHlwZSBmb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9XUkFQID0gJ1JFUEVBVCc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX01JUE1BUCA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9JTlZFUlRfWSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaXAtbWFwcGluZyBmaWx0ZXIgc3VmZml4LlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVggPSAnX01JUE1BUF9MSU5FQVInO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVGV4dHVyZTJEIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBUZXh0dXJlMkRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIHRleHR1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtVaW50OEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEZsb2F0MzJBcnJheXxJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBzcGVjLnNyYyAtIFRoZSBkYXRhIHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5taXBNYXAgLSBXaGV0aGVyIG9yIG5vdCBtaXAtbWFwcGluZyBpcyBlbmFibGVkLlxyXG4gICAgICogQHBhcmFtIHtib29sfSBzcGVjLmludmVydFkgLSBXaGV0aGVyIG9yIG5vdCBpbnZlcnQteSBpcyBlbmFibGVkLlxyXG4gICAgICogQHBhcmFtIHtib29sfSBzcGVjLnByZU11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudHlwZSAtIFRoZSB0ZXh0dXJlIHBpeGVsIGNvbXBvbmVudCB0eXBlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBUZXh0dXJlMkQoIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgLy8gZ2V0IHNwZWNpZmljIHBhcmFtc1xyXG4gICAgICAgIHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcclxuICAgICAgICBzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XHJcbiAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcclxuICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xyXG4gICAgICAgIC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xyXG4gICAgICAgIHRoaXMud3JhcFMgPSBzcGVjLndyYXBTIHx8IERFRkFVTFRfV1JBUDtcclxuICAgICAgICB0aGlzLndyYXBUID0gc3BlYy53cmFwVCB8fCBERUZBVUxUX1dSQVA7XHJcbiAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IERFRkFVTFRfRklMVEVSO1xyXG4gICAgICAgIC8vIHNldCBvdGhlciBwcm9wZXJ0aWVzXHJcbiAgICAgICAgdGhpcy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBERUZBVUxUX01JUE1BUDtcclxuICAgICAgICB0aGlzLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IERFRkFVTFRfSU5WRVJUX1k7XHJcbiAgICAgICAgdGhpcy5wcmVNdWx0aXBseUFscGhhID0gc3BlYy5wcmVNdWx0aXBseUFscGhhICE9PSB1bmRlZmluZWQgPyBzcGVjLnByZU11bHRpcGx5QWxwaGEgOiBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBO1xyXG4gICAgICAgIC8vIHNldCBmb3JtYXRcclxuICAgICAgICB0aGlzLmZvcm1hdCA9IHNwZWMuZm9ybWF0IHx8IERFRkFVTFRfRk9STUFUO1xyXG4gICAgICAgIGlmICggREVQVEhfVFlQRVNbIHRoaXMuZm9ybWF0IF0gJiYgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbiggJ1dFQkdMX2RlcHRoX3RleHR1cmUnICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY3JlYXRlIFRleHR1cmUyRCBvZiBmb3JtYXQgYCcgKyB0aGlzLmZvcm1hdCArICdgIGFzIGBXRUJHTF9kZXB0aF90ZXh0dXJlYCBleHRlbnNpb24gaXMgdW5zdXBwb3J0ZWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgdHlwZVxyXG4gICAgICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZSB8fCBERUZBVUxUX1RZUEU7XHJcbiAgICAgICAgaWYgKCB0aGlzLnR5cGUgPT09ICdGTE9BVCcgJiYgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbiggJ09FU190ZXh0dXJlX2Zsb2F0JyApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgdHlwZSBgRkxPQVRgIGFzIGBPRVNfdGV4dHVyZV9mbG9hdGAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2hlY2sgc2l6ZVxyXG4gICAgICAgIGlmICggIVV0aWwuaXNDYW52YXNUeXBlKCBzcGVjLnNyYyApICkge1xyXG4gICAgICAgICAgICAvLyBpZiBub3QgYSBjYW52YXMgdHlwZSwgZGltZW5zaW9ucyBNVVNUIGJlIHNwZWNpZmllZFxyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzcGVjLndpZHRoICE9PSAnbnVtYmVyJyB8fCBzcGVjLndpZHRoIDw9IDAgKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnYHdpZHRoYCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNwZWMuaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCBzcGVjLmhlaWdodCA8PSAwICkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ2BoZWlnaHRgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCBVdGlsLm11c3RCZVBvd2VyT2ZUd28oIHRoaXMgKSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggIVV0aWwuaXNQb3dlck9mVHdvKCBzcGVjLndpZHRoICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ1BhcmFtZXRlcnMgcmVxdWlyZSBhIHBvd2VyLW9mLXR3byB0ZXh0dXJlLCB5ZXQgcHJvdmlkZWQgd2lkdGggb2YgJyArIHNwZWMud2lkdGggKyAnIGlzIG5vdCBhIHBvd2VyIG9mIHR3byc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoICFVdGlsLmlzUG93ZXJPZlR3byggc3BlYy5oZWlnaHQgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnUGFyYW1ldGVycyByZXF1aXJlIGEgcG93ZXItb2YtdHdvIHRleHR1cmUsIHlldCBwcm92aWRlZCBoZWlnaHQgb2YgJyArIHNwZWMuaGVpZ2h0ICsgJyBpcyBub3QgYSBwb3dlciBvZiB0d28nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFdlYkdMQ29udGV4dFN0YXRlLmdldCggZ2wgKTtcclxuICAgICAgICAvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3RcclxuICAgICAgICB0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXHJcbiAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBzcGVjLnNyYyB8fCBudWxsLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCApO1xyXG4gICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IGFuZCBwdXNoZXMgaXQgb250byB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC4gRGVmYXVsdCB0byAwLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XHJcbiAgICAgICAgaWYgKCBsb2NhdGlvbiA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICggIVV0aWwuaXNJbnRlZ2VyKCBsb2NhdGlvbiApIHx8IGxvY2F0aW9uIDwgMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgdW5pdCBsb2NhdGlvbiBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgdGhpcyB0ZXh0dXJlIGlzIGFscmVhZHkgYm91bmQsIG5vIG5lZWQgdG8gcmViaW5kXHJcbiAgICAgICAgaWYgKCB0aGlzLnN0YXRlLnRleHR1cmUyRHMudG9wKCBsb2NhdGlvbiApICE9PSB0aGlzICkge1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKCBnbFsgJ1RFWFRVUkUnICsgbG9jYXRpb24gXSApO1xyXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCB0byBzdGFjayB1bmRlciB0aGUgdGV4dHVyZSB1bml0XHJcbiAgICAgICAgdGhpcy5zdGF0ZS50ZXh0dXJlMkRzLnB1c2goIGxvY2F0aW9uLCB0aGlzICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIGJpbmRzIHRoZSB0ZXh0dXJlIGJlbmVhdGggaXQgb24gdGhpcyBzdGFjay4gSWYgdGhlcmUgaXMgbm8gdW5kZXJseWluZyB0ZXh0dXJlLCB1bmJpbmRzIHRoZSB1bml0LlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmUyRFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguIERlZmF1bHQgdG8gMC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XHJcbiAgICAgICAgaWYgKCBsb2NhdGlvbiA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICggIVV0aWwuaXNJbnRlZ2VyKCBsb2NhdGlvbiApIHx8IGxvY2F0aW9uIDwgMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgdW5pdCBsb2NhdGlvbiBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBpZiAoIHN0YXRlLnRleHR1cmUyRHMudG9wKCBsb2NhdGlvbiApICE9PSB0aGlzICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnVGV4dHVyZTJEIGlzIG5vdCB0aGUgdG9wIG1vc3QgZWxlbWVudCBvbiB0aGUgc3RhY2snO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGF0ZS50ZXh0dXJlMkRzLnBvcCggbG9jYXRpb24gKTtcclxuICAgICAgICB2YXIgZ2w7XHJcbiAgICAgICAgdmFyIHRvcCA9IHN0YXRlLnRleHR1cmUyRHMudG9wKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBpZiAoIHRvcCAhPT0gdGhpcyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGJpbmQgdW5kZXJseWluZyB0ZXh0dXJlXHJcbiAgICAgICAgICAgICAgICBnbCA9IHRvcC5nbDtcclxuICAgICAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoIGdsWyAnVEVYVFVSRScgKyBsb2NhdGlvbiBdICk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgdG9wLnRleHR1cmUgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHVuYmluZFxyXG4gICAgICAgICAgICBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1ZmZlciBkYXRhIGludG8gdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlclZpZXd8bnVsbH0gZGF0YSAtIFRoZSBkYXRhIGFycmF5IHRvIGJ1ZmZlci5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLmJ1ZmZlckRhdGEgPSBmdW5jdGlvbiggZGF0YSwgd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIC8vIGludmVydCB5IGlmIHNwZWNpZmllZFxyXG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKCBnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkgKTtcclxuICAgICAgICAvLyBwcmVtdWx0aXBseSBhbHBoYSBpZiBzcGVjaWZpZWRcclxuICAgICAgICBnbC5waXhlbFN0b3JlaSggZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCB0aGlzLnByZU11bHRpcGx5QWxwaGEgKTtcclxuICAgICAgICAvLyBjYXN0IGFycmF5IGFyZ1xyXG4gICAgICAgIGlmICggZGF0YSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICBpZiAoIHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJyApIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDE2QXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJyApIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDMyQXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy50eXBlID09PSAnRkxPQVQnICkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoIGRhdGEgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDhBcnJheSggZGF0YSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBlbnN1cmUgdHlwZSBjb3JyZXNwb25kcyB0byBkYXRhXHJcbiAgICAgICAgaWYgKCBkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGRhdGEgaW5zdGFuY2VvZiBVaW50MTZBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcclxuICAgICAgICB9IGVsc2UgaWYgKCBkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9JTlQnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdGTE9BVCc7XHJcbiAgICAgICAgfSBlbHNlIGlmICggZGF0YSAmJiAhKCBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgKSAmJiAhVXRpbC5pc0NhbnZhc1R5cGUoIGRhdGEgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBgQXJyYXlCdWZmZXJWaWV3YCwgYEltYWdlRGF0YWAsIGBIVE1MSW1hZ2VFbGVtZW50YCwgYEhUTUxDYW52YXNFbGVtZW50YCwgYEhUTUxWaWRlb0VsZW1lbnRgLCBvciBudWxsJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBVdGlsLmlzQ2FudmFzVHlwZSggZGF0YSApICkge1xyXG4gICAgICAgICAgICAvLyBzdG9yZSB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBkYXRhLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xyXG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmVcclxuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICAwLCAvLyBtaXAtbWFwIGxldmVsLFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuZm9ybWF0IF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmZvcm1hdCBdLFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMudHlwZSBdLFxyXG4gICAgICAgICAgICAgICAgZGF0YSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHN0b3JlIHdpZHRoIGFuZCBoZWlnaHRcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmUgZGF0YVxyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIDAsIC8vIG1pcC1tYXAgbGV2ZWxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmZvcm1hdCBdLCAvLyB3ZWJnbCByZXF1aXJlcyBmb3JtYXQgPT09IGludGVybmFsRm9ybWF0XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAwLCAvLyBib3JkZXIsIG11c3QgYmUgMFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuZm9ybWF0IF0sXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy50eXBlIF0sXHJcbiAgICAgICAgICAgICAgICBkYXRhICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGdlbmVyYXRlIG1pcCBtYXBzXHJcbiAgICAgICAgaWYgKCB0aGlzLm1pcE1hcCApIHtcclxuICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoIGdsLlRFWFRVUkVfMkQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIHRleHR1cmUgcGFyYW1ldGVycy5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgYnkgbmFtZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmUyRC5wcm90b3R5cGUuc2V0UGFyYW1ldGVycyA9IGZ1bmN0aW9uKCBwYXJhbXMgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICAvLyBzZXQgd3JhcCBTIHBhcmFtZXRlclxyXG4gICAgICAgIHZhciBwYXJhbSA9IHBhcmFtcy53cmFwUyB8fCBwYXJhbXMud3JhcDtcclxuICAgICAgICBpZiAoIHBhcmFtICkge1xyXG4gICAgICAgICAgICBpZiAoIFdSQVBfTU9ERVNbIHBhcmFtIF0gKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBTID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbIHRoaXMud3JhcFMgXSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgcGFyYW1ldGVyIGAnICsgcGFyYW0gKyAnYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgYFRFWFRVUkVfV1JBUF9TYCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHdyYXAgVCBwYXJhbWV0ZXJcclxuICAgICAgICBwYXJhbSA9IHBhcmFtcy53cmFwVCB8fCBwYXJhbXMud3JhcDtcclxuICAgICAgICBpZiAoIHBhcmFtICkge1xyXG4gICAgICAgICAgICBpZiAoIFdSQVBfTU9ERVNbIHBhcmFtIF0gKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBUID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbIHRoaXMud3JhcFQgXSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgcGFyYW1ldGVyIGAnICsgcGFyYW0gKyAnYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgYFRFWFRVUkVfV1JBUF9UYCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IG1hZyBmaWx0ZXIgcGFyYW1ldGVyXHJcbiAgICAgICAgcGFyYW0gPSBwYXJhbXMubWFnRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XHJcbiAgICAgICAgaWYgKCBwYXJhbSApIHtcclxuICAgICAgICAgICAgaWYgKCBNQUdfRklMVEVSU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFnRmlsdGVyID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsWyB0aGlzLm1hZ0ZpbHRlciBdICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBwYXJhbWV0ZXIgYCcgKyBwYXJhbSArICdgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBgVEVYVFVSRV9NQUdfRklMVEVSYCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IG1pbiBmaWx0ZXIgcGFyYW1ldGVyXHJcbiAgICAgICAgcGFyYW0gPSBwYXJhbXMubWluRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XHJcbiAgICAgICAgaWYgKCBwYXJhbSApIHtcclxuICAgICAgICAgICAgaWYgKCB0aGlzLm1pcE1hcCApIHtcclxuICAgICAgICAgICAgICAgIGlmICggTk9OX01JUE1BUF9NSU5fRklMVEVSU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cGdyYWRlIHRvIG1pcC1tYXAgbWluIGZpbHRlclxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtICs9IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCBNSVBNQVBfTUlOX0ZJTFRFUlNbIHBhcmFtIF0gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsWyB0aGlzLm1pbkZpbHRlciBdICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBwYXJhbWV0ZXIgYCcgKyBwYXJhbSArICdgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBgVEVYVFVSRV9NSU5fRklMVEVSYCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIE1JTl9GSUxURVJTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFsgdGhpcy5taW5GaWx0ZXIgXSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBwYXJhbWV0ZXIgYCcgKyBwYXJhbSArICdgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBgVEVYVFVSRV9NSU5fRklMVEVSYCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemUgdGhlIHVuZGVybHlpbmcgdGV4dHVyZS4gVGhpcyBjbGVhcnMgdGhlIHRleHR1cmUgZGF0YS5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgbmV3IHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAoIHdpZHRoIDw9IDAgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGB3aWR0aGAgb2YgJyArIHdpZHRoICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCAoIGhlaWdodCA8PSAwICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgaGVpZ2h0YCBvZiAnICsgaGVpZ2h0ICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBudWxsLCB3aWR0aCwgaGVpZ2h0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTJEO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XHJcbiAgICB2YXIgV2ViR0xDb250ZXh0U3RhdGUgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dFN0YXRlJyk7XHJcbiAgICB2YXIgQXN5bmMgPSByZXF1aXJlKCcuLi91dGlsL0FzeW5jJyk7XHJcbiAgICB2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xyXG4gICAgdmFyIEltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi4vdXRpbC9JbWFnZUxvYWRlcicpO1xyXG4gICAgdmFyIEZBQ0VTID0gW1xyXG4gICAgICAgICcteCcsICcreCcsXHJcbiAgICAgICAgJy15JywgJyt5JyxcclxuICAgICAgICAnLXonLCAnK3onXHJcbiAgICBdO1xyXG4gICAgdmFyIEZBQ0VfVEFSR0VUUyA9IHtcclxuICAgICAgICAnK3onOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9aJyxcclxuICAgICAgICAnLXonOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aJyxcclxuICAgICAgICAnK3gnOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YJyxcclxuICAgICAgICAnLXgnOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9YJyxcclxuICAgICAgICAnK3knOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZJyxcclxuICAgICAgICAnLXknOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZJ1xyXG4gICAgfTtcclxuICAgIHZhciBUQVJHRVRTID0ge1xyXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWjogdHJ1ZSxcclxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1o6IHRydWUsXHJcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YOiB0cnVlLFxyXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWDogdHJ1ZSxcclxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1k6IHRydWUsXHJcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIE1BR19GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIE1JTl9GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxyXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHZhciBOT05fTUlQTUFQX01JTl9GSUxURVJTID0ge1xyXG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTElORUFSOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIHZhciBNSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcclxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXHJcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxyXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIFdSQVBfTU9ERVMgPSB7XHJcbiAgICAgICAgUkVQRUFUOiB0cnVlLFxyXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcclxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdmFyIEZPUk1BVFMgPSB7XHJcbiAgICAgICAgUkdCOiB0cnVlLFxyXG4gICAgICAgIFJHQkE6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCB0eXBlIGZvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9CWVRFJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgdmFyIERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBERUZBVUxUX01JUE1BUCA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9JTlZFUlRfWSA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZGVmYXVsdCBtaXAtbWFwcGluZyBmaWx0ZXIgc3VmZml4LlxyXG4gICAgICovXHJcbiAgICB2YXIgREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVggPSAnX01JUE1BUF9MSU5FQVInO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjdWJlbWFwIGFuZCB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmXHJcbiAgICAgKiBpdCBkb2VzIG5vdCBtZWV0IHJlcXVpcmVtZW50cy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2hlY2tEaW1lbnNpb25zKCBjdWJlTWFwICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIGN1YmVNYXAud2lkdGggIT09ICdudW1iZXInIHx8IGN1YmVNYXAud2lkdGggPD0gMCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ2B3aWR0aGAgYXJndW1lbnQgaXMgbWlzc2luZyBvciBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgY3ViZU1hcC5oZWlnaHQgIT09ICdudW1iZXInIHx8IGN1YmVNYXAuaGVpZ2h0IDw9IDAgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdgaGVpZ2h0YCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIGN1YmVNYXAud2lkdGggIT09IGN1YmVNYXAuaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHdpZHRoYCBtdXN0IGJlIGVxdWFsIHRvIGBoZWlnaHRgJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBVdGlsLm11c3RCZVBvd2VyT2ZUd28oIGN1YmVNYXAgKSAmJiAhVXRpbC5pc1Bvd2VyT2ZUd28oIGN1YmVNYXAud2lkdGggKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1BhcmFtZXRlcnMgcmVxdWlyZSBhIHBvd2VyLW9mLXR3byB0ZXh0dXJlLCB5ZXQgcHJvdmlkZWQgc2l6ZSBvZiAnICsgY3ViZU1hcC53aWR0aCArICcgaXMgbm90IGEgcG93ZXIgb2YgdHdvJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIHVybC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIHVybCB0byBsb2FkIHRoZSBmYWNlIGZyb20uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9ufSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsb2FkRmFjZVVSTCggY3ViZU1hcCwgdGFyZ2V0LCB1cmwgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBwdXQgZXh0ZW5zaW9uIGhhbmRsaW5nIGZvciBhcnJheWJ1ZmZlciAvIGltYWdlIC8gdmlkZW8gZGlmZmVyZW50aWF0aW9uXHJcbiAgICAgICAgICAgIEltYWdlTG9hZGVyLmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggaW1hZ2UgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2UgPSBVdGlsLnJlc2l6ZUNhbnZhcyggY3ViZU1hcCwgaW1hZ2UgKTtcclxuICAgICAgICAgICAgICAgICAgICBjdWJlTWFwLmJ1ZmZlckRhdGEoIHRhcmdldCwgaW1hZ2UgKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCBudWxsICk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBlcnIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSggZXJyLCBudWxsICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIGNhbnZhcyB0eXBlIG9iamVjdC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0ge0ltYWdlRGF0YXxIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fEhUTUxWaWRlb0VsZW1lbnR9IGNhbnZhcyAtIFRoZSBjYW52YXMgdHlwZSBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9ufSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsb2FkRmFjZUNhbnZhcyggY3ViZU1hcCwgdGFyZ2V0LCBjYW52YXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICBjYW52YXMgPSBVdGlsLnJlc2l6ZUNhbnZhcyggY3ViZU1hcCwgY2FudmFzICk7XHJcbiAgICAgICAgICAgIGN1YmVNYXAuYnVmZmVyRGF0YSggdGFyZ2V0LCBjYW52YXMgKTtcclxuICAgICAgICAgICAgZG9uZSggbnVsbCApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhbiBhcnJheSB0eXBlIG9iamVjdC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlld30gYXJyIC0gVGhlIGFycmF5IHR5cGUgb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn0gVGhlIGxvYWRlciBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbG9hZEZhY2VBcnJheSggY3ViZU1hcCwgdGFyZ2V0LCBhcnIgKSB7XHJcbiAgICAgICAgY2hlY2tEaW1lbnNpb25zKCBjdWJlTWFwICk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICBjdWJlTWFwLmJ1ZmZlckRhdGEoIHRhcmdldCwgYXJyICk7XHJcbiAgICAgICAgICAgIGRvbmUoIG51bGwgKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVGV4dHVyZUN1YmVNYXAgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFRleHR1cmVDdWJlTWFwXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSBjdWJlIG1hcCB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNwZWNpZmljYXRpb24gYXJndW1lbnRzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYy5mYWNlcyAtIFRoZSBmYWNlcyB0byBidWZmZXIsIHVuZGVyIGtleXMgJyt4JywgJyt5JywgJyt6JywgJy14JywgJy15JywgYW5kICcteicuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZmFjZXMuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBmYWNlcy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMubWlwTWFwIC0gV2hldGhlciBvciBub3QgbWlwLW1hcHBpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVNdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVGV4dHVyZUN1YmVNYXAoIHNwZWMsIGNhbGxiYWNrICkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBXZWJHTENvbnRleHRTdGF0ZS5nZXQoIGdsICk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcclxuICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XHJcbiAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xyXG4gICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XHJcbiAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcclxuICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcclxuICAgICAgICB0aGlzLndyYXBTID0gV1JBUF9NT0RFU1sgc3BlYy53cmFwUyBdID8gc3BlYy53cmFwUyA6IERFRkFVTFRfV1JBUDtcclxuICAgICAgICB0aGlzLndyYXBUID0gV1JBUF9NT0RFU1sgc3BlYy53cmFwVCBdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcclxuICAgICAgICB0aGlzLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTWyBzcGVjLm1pbkZpbHRlciBdID8gc3BlYy5taW5GaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IE1BR19GSUxURVJTWyBzcGVjLm1hZ0ZpbHRlciBdID8gc3BlYy5tYWdGaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcclxuICAgICAgICAvLyBzZXQgb3RoZXIgcHJvcGVydGllc1xyXG4gICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogREVGQVVMVF9NSVBNQVA7XHJcbiAgICAgICAgdGhpcy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBERUZBVUxUX0lOVkVSVF9ZO1xyXG4gICAgICAgIHRoaXMucHJlTXVsdGlwbHlBbHBoYSA9IHNwZWMucHJlTXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkID8gc3BlYy5wcmVNdWx0aXBseUFscGhhIDogREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQTtcclxuICAgICAgICAvLyBzZXQgZm9ybWF0IGFuZCB0eXBlXHJcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBGT1JNQVRTWyBzcGVjLmZvcm1hdCBdID8gc3BlYy5mb3JtYXQgOiBERUZBVUxUX0ZPUk1BVDtcclxuICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgREVGQVVMVF9UWVBFO1xyXG4gICAgICAgIGlmICggdGhpcy50eXBlID09PSAnRkxPQVQnICYmICFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oICdPRVNfdGV4dHVyZV9mbG9hdCcgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgVGV4dHVyZTJEIG9mIHR5cGUgYEZMT0FUYCBhcyBgT0VTX3RleHR1cmVfZmxvYXRgIGV4dGVuc2lvbiBpcyB1bnN1cHBvcnRlZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBkaW1lbnNpb25zIGlmIHByb3ZpZGVkXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHNwZWMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBzcGVjLmhlaWdodDtcclxuICAgICAgICAvLyBzZXQgYnVmZmVyZWQgZmFjZXNcclxuICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXMgPSBbXTtcclxuICAgICAgICAvLyBjcmVhdGUgY3ViZSBtYXAgYmFzZWQgb24gaW5wdXRcclxuICAgICAgICBpZiAoIHNwZWMuZmFjZXMgKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrcyA9IFtdO1xyXG4gICAgICAgICAgICBGQUNFUy5mb3JFYWNoKCBmdW5jdGlvbiggaWQgKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmFjZSA9IHNwZWMuZmFjZXNbIGlkIF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gRkFDRV9UQVJHRVRTWyBpZCBdO1xyXG4gICAgICAgICAgICAgICAgLy8gbG9hZCBiYXNlZCBvbiB0eXBlXHJcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBmYWNlID09PSAnc3RyaW5nJyApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cmxcclxuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKCBsb2FkRmFjZVVSTCggdGhhdCwgdGFyZ2V0LCBmYWNlICkgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIFV0aWwuaXNDYW52YXNUeXBlKCBmYWNlICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FudmFzXHJcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaCggbG9hZEZhY2VDYW52YXMoIHRoYXQsIHRhcmdldCwgZmFjZSApICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFycmF5IC8gYXJyYXlidWZmZXIgb3IgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2goIGxvYWRGYWNlQXJyYXkoIHRoYXQsIHRhcmdldCwgZmFjZSApICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBBc3luYy5wYXJhbGxlbCggdGFza3MsIGZ1bmN0aW9uKCBlcnIgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGVyciApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggZXJyLCBudWxsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHNldCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAgICB0aGF0LnNldFBhcmFtZXRlcnMoIHRoYXQgKTtcclxuICAgICAgICAgICAgICAgIGlmICggY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIG51bGwsIHRoYXQgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gbnVsbFxyXG4gICAgICAgICAgICBjaGVja0RpbWVuc2lvbnMoIHRoaXMgKTtcclxuICAgICAgICAgICAgRkFDRVMuZm9yRWFjaCggZnVuY3Rpb24oIGlkICkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5idWZmZXJEYXRhKCBGQUNFX1RBUkdFVFNbIGlkIF0sIG51bGwgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHNldCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIG9udG8gdGhlIHN0YWNrLlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmVDdWJlTWFwXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlQ3ViZU1hcC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICBpZiAoIGxvY2F0aW9uID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKCAhVXRpbC5pc0ludGVnZXIoIGxvY2F0aW9uICkgfHwgbG9jYXRpb24gPCAwICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiB0aGlzIHRleHR1cmUgaXMgYWxyZWFkeSBib3VuZCwgbm8gbmVlZCB0byByZWJpbmRcclxuICAgICAgICBpZiAoIHRoaXMuc3RhdGUudGV4dHVyZUN1YmVNYXBzLnRvcCggbG9jYXRpb24gKSAhPT0gdGhpcyApIHtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZSggZ2xbICdURVhUVVJFJyArIGxvY2F0aW9uIF0gKTtcclxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMudGV4dHVyZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGQgdG8gc3RhY2sgdW5kZXIgdGhlIHRleHR1cmUgdW5pdFxyXG4gICAgICAgIHRoaXMuc3RhdGUudGV4dHVyZUN1YmVNYXBzLnB1c2goIGxvY2F0aW9uLCB0aGlzICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIGJpbmRzIHRoZSB0ZXh0dXJlIGJlbmVhdGggaXQgb25cclxuICAgICAqIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgdGV4dHVyZSwgdW5iaW5kcyB0aGUgdW5pdC5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlQ3ViZU1hcFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZUN1YmVNYXAucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICBpZiAoIGxvY2F0aW9uID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKCAhVXRpbC5pc0ludGVnZXIoIGxvY2F0aW9uICkgfHwgbG9jYXRpb24gPCAwICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGlmICggc3RhdGUudGV4dHVyZUN1YmVNYXBzLnRvcCggbG9jYXRpb24gKSAhPT0gdGhpcyApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1RoZSBjdXJyZW50IHRleHR1cmUgaXMgbm90IHRoZSB0b3AgbW9zdCBlbGVtZW50IG9uIHRoZSBzdGFjayc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlLnRleHR1cmVDdWJlTWFwcy5wb3AoIGxvY2F0aW9uICk7XHJcbiAgICAgICAgdmFyIGdsO1xyXG4gICAgICAgIHZhciB0b3AgPSBzdGF0ZS50ZXh0dXJlQ3ViZU1hcHMudG9wKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBpZiAoIHRvcCAhPT0gdGhpcyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGJpbmQgdW5kZXJseWluZyB0ZXh0dXJlXHJcbiAgICAgICAgICAgICAgICBnbCA9IHRvcC5nbDtcclxuICAgICAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoIGdsWyAnVEVYVFVSRScgKyBsb2NhdGlvbiBdICk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgdG9wLnRleHR1cmUgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHVuYmluZFxyXG4gICAgICAgICAgICBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1ZmZlciBkYXRhIGludG8gdGhlIHJlc3BlY3RpdmUgY3ViZSBtYXAgZmFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlQ3ViZU1hcFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgLSBUaGUgZmFjZSB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdHxudWxsfSBkYXRhIC0gVGhlIGZhY2UgZGF0YS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlQ3ViZU1hcC5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKCB0YXJnZXQsIGRhdGEgKSB7XHJcbiAgICAgICAgaWYgKCAhVEFSR0VUU1sgdGFyZ2V0IF0gKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgdGFyZ2V0YCBvZiAnICsgdGFyZ2V0ICsgJyBpcyBpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICAvLyBidWZmZXIgZmFjZSB0ZXh0dXJlXHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgLy8gaW52ZXJ0IHkgaWYgc3BlY2lmaWVkXHJcbiAgICAgICAgZ2wucGl4ZWxTdG9yZWkoIGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRoaXMuaW52ZXJ0WSApO1xyXG4gICAgICAgIC8vIHByZW11bHRpcGx5IGFscGhhIGlmIHNwZWNpZmllZFxyXG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKCBnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIHRoaXMucHJlTXVsdGlwbHlBbHBoYSApO1xyXG4gICAgICAgIC8vIGNhc3QgYXJyYXkgYXJnXHJcbiAgICAgICAgaWYgKCBkYXRhIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnICkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MTZBcnJheSggZGF0YSApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnICkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MzJBcnJheSggZGF0YSApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnR5cGUgPT09ICdGTE9BVCcgKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gbmV3IEZsb2F0MzJBcnJheSggZGF0YSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KCBkYXRhICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IGVuc3VyZSB0eXBlIGNvcnJlc3BvbmRzIHRvIGRhdGFcclxuICAgICAgICBpZiAoIGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5ICkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfQllURSc7XHJcbiAgICAgICAgfSBlbHNlIGlmICggZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5ICkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGRhdGEgaW5zdGFuY2VvZiBVaW50MzJBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0lOVCc7XHJcbiAgICAgICAgfSBlbHNlIGlmICggZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gJ0ZMT0FUJztcclxuICAgICAgICB9IGVsc2UgaWYgKCBkYXRhICYmICEoIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciApICYmICFVdGlsLmlzQ2FudmFzVHlwZSggZGF0YSApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIGBBcnJheUJ1ZmZlclZpZXdgLCBgSW1hZ2VEYXRhYCwgYEhUTUxJbWFnZUVsZW1lbnRgLCBgSFRNTENhbnZhc0VsZW1lbnRgLCBgSFRNTFZpZGVvRWxlbWVudGAsIG9yIG51bGwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBidWZmZXIgdGhlIGRhdGFcclxuICAgICAgICBpZiAoIFV0aWwuaXNDYW52YXNUeXBlKCBkYXRhICkgKSB7XHJcbiAgICAgICAgICAgIC8vIHN0b3JlIHdpZHRoIGFuZCBoZWlnaHRcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZVxyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRhcmdldCBdLFxyXG4gICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbCxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmZvcm1hdCBdLCAvLyB3ZWJnbCByZXF1aXJlcyBmb3JtYXQgPT09IGludGVybmFsRm9ybWF0XHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5mb3JtYXQgXSxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLnR5cGUgXSxcclxuICAgICAgICAgICAgICAgIGRhdGEgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmUgZGF0YVxyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRhcmdldCBdLFxyXG4gICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuZm9ybWF0IF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5mb3JtYXQgXSxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLnR5cGUgXSxcclxuICAgICAgICAgICAgICAgIGRhdGEgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdHJhY2sgdGhhdCBmYWNlIHdhcyBidWZmZXJlZFxyXG4gICAgICAgIGlmICggdGhpcy5idWZmZXJlZEZhY2VzLmluZGV4T2YoIHRhcmdldCApIDwgMCApIHtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzLnB1c2goIHRhcmdldCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiBhbGwgZmFjZXMgYnVmZmVyZWQsIGdlbmVyYXRlIG1pcG1hcHNcclxuICAgICAgICBpZiAoIHRoaXMubWlwTWFwICYmIHRoaXMuYnVmZmVyZWRGYWNlcy5sZW5ndGggPT09IDYgKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgZ2VuZXJhdGUgbWlwbWFwcyBpZiBhbGwgZmFjZXMgYXJlIGJ1ZmZlcmVkXHJcbiAgICAgICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKCBnbC5URVhUVVJFX0NVQkVfTUFQICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSB0ZXh0dXJlIHBhcmFtZXRlcnMuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZUN1YmVNYXBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgYnkgbmFtZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZUN1YmVNYXAucHJvdG90eXBlLnNldFBhcmFtZXRlcnMgPSBmdW5jdGlvbiggcGFyYW1zICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgLy8gc2V0IHdyYXAgUyBwYXJhbWV0ZXJcclxuICAgICAgICB2YXIgcGFyYW0gPSBwYXJhbXMud3JhcFMgfHwgcGFyYW1zLndyYXA7XHJcbiAgICAgICAgaWYgKCBwYXJhbSApIHtcclxuICAgICAgICAgICAgaWYgKCBXUkFQX01PREVTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwUyA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsWyB0aGlzLndyYXBTIF0gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX1dSQVBfU2AnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCB3cmFwIFQgcGFyYW1ldGVyXHJcbiAgICAgICAgcGFyYW0gPSBwYXJhbXMud3JhcFQgfHwgcGFyYW1zLndyYXA7XHJcbiAgICAgICAgaWYgKCBwYXJhbSApIHtcclxuICAgICAgICAgICAgaWYgKCBXUkFQX01PREVTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwVCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsWyB0aGlzLndyYXBUIF0gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHBhcmFtZXRlciBgJyArIHBhcmFtICsgJ2AgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGBURVhUVVJFX1dSQVBfVGAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBtYWcgZmlsdGVyIHBhcmFtZXRlclxyXG4gICAgICAgIHBhcmFtID0gcGFyYW1zLm1hZ0ZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xyXG4gICAgICAgIGlmICggcGFyYW0gKSB7XHJcbiAgICAgICAgICAgIGlmICggTUFHX0ZJTFRFUlNbIHBhcmFtIF0gKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFsgdGhpcy5tYWdGaWx0ZXIgXSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgcGFyYW1ldGVyIGAnICsgcGFyYW0gKyAnYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgYFRFWFRVUkVfTUFHX0ZJTFRFUmAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBtaW4gZmlsdGVyIHBhcmFtZXRlclxyXG4gICAgICAgIHBhcmFtID0gcGFyYW1zLm1pbkZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xyXG4gICAgICAgIGlmICggcGFyYW0gKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhpcy5taXBNYXAgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlNbIHBhcmFtIF0gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBncmFkZSB0byBtaXAtbWFwIG1pbiBmaWx0ZXJcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbSArPSBERUZBVUxUX01JUE1BUF9NSU5fRklMVEVSX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICggTUlQTUFQX01JTl9GSUxURVJTWyBwYXJhbSBdICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFsgdGhpcy5taW5GaWx0ZXIgXSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgcGFyYW1ldGVyIGAnICsgcGFyYW0gKyAnYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgYFRFWFRVUkVfTUlOX0ZJTFRFUmAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBNSU5fRklMVEVSU1sgcGFyYW0gXSApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbIHRoaXMubWluRmlsdGVyIF0gKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgcGFyYW1ldGVyIGAnICsgcGFyYW0gKyAnYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgYFRFWFRVUkVfTUlOX0ZJTFRFUmAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVGV4dHVyZUN1YmVNYXA7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG4gICAgdmFyIFdlYkdMQ29udGV4dFN0YXRlID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHRTdGF0ZScpO1xuICAgIHZhciBWZXJ0ZXhQYWNrYWdlID0gcmVxdWlyZSgnLi9WZXJ0ZXhQYWNrYWdlJyk7XG4gICAgdmFyIE1PREVTID0ge1xuICAgICAgICBQT0lOVFM6IHRydWUsXG4gICAgICAgIExJTkVTOiB0cnVlLFxuICAgICAgICBMSU5FX1NUUklQOiB0cnVlLFxuICAgICAgICBMSU5FX0xPT1A6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFUzogdHJ1ZSxcbiAgICAgICAgVFJJQU5HTEVfU1RSSVA6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX0ZBTjogdHJ1ZVxuICAgIH07XG4gICAgdmFyIFRZUEVTID0ge1xuICAgICAgICBGTE9BVDogdHJ1ZVxuICAgIH07XG4gICAgdmFyIEJZVEVTX1BFUl9UWVBFID0ge1xuICAgICAgICBGTE9BVDogNFxuICAgIH07XG4gICAgdmFyIEJZVEVTX1BFUl9DT01QT05FTlQgPSBCWVRFU19QRVJfVFlQRS5GTE9BVDtcbiAgICB2YXIgU0laRVMgPSB7XG4gICAgICAgIDE6IHRydWUsXG4gICAgICAgIDI6IHRydWUsXG4gICAgICAgIDM6IHRydWUsXG4gICAgICAgIDQ6IHRydWVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyIG1vZGUgKHByaW1pdGl2ZSB0eXBlKS5cbiAgICAgKi9cbiAgICB2YXIgREVGQVVMVF9NT0RFID0gJ1RSSUFOR0xFUyc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBieXRlIG9mZnNldCB0byByZW5kZXIgZnJvbS5cbiAgICAgKi9cbiAgICB2YXIgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBjb3VudCBvZiBpbmRpY2VzIHRvIHJlbmRlci5cbiAgICAgKi9cbiAgICB2YXIgREVGQVVMVF9DT1VOVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSB0aGUgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCBkZXRlcm1pbmUgdGhlIGJ5dGUgc3RyaWRlIG9mIHRoZSBidWZmZXIuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVQb2ludGVycyAtIFRoZSBhdHRyaWJ1dGUgcG9pbnRlciBtYXAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBieXRlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFN0cmlkZSggYXR0cmlidXRlUG9pbnRlcnMgKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGF0dHJpYnV0ZSBwb2ludGVyIGFzc2lnbmVkIHRvIHRoaXMgYnVmZmVyLFxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZWVkIGZvciBzdHJpZGUsIHNldCB0byBkZWZhdWx0IG9mIDBcbiAgICAgICAgdmFyIGluZGljZXMgPSBPYmplY3Qua2V5cyggYXR0cmlidXRlUG9pbnRlcnMgKTtcbiAgICAgICAgaWYgKCBpbmRpY2VzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXhCeXRlT2Zmc2V0ID0gMDtcbiAgICAgICAgdmFyIGJ5dGVTaXplU3VtID0gMDtcbiAgICAgICAgdmFyIGJ5dGVTdHJpZGUgPSAwO1xuICAgICAgICBpbmRpY2VzLmZvckVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcbiAgICAgICAgICAgIHZhciBwb2ludGVyID0gYXR0cmlidXRlUG9pbnRlcnNbIGluZGV4IF07XG4gICAgICAgICAgICB2YXIgYnl0ZU9mZnNldCA9IHBvaW50ZXIuYnl0ZU9mZnNldDtcbiAgICAgICAgICAgIHZhciBzaXplID0gcG9pbnRlci5zaXplO1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBwb2ludGVyLnR5cGU7XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgc3VtIG9mIGVhY2ggYXR0cmlidXRlIHNpemVcbiAgICAgICAgICAgIGJ5dGVTaXplU3VtICs9IHNpemUgKiBCWVRFU19QRVJfVFlQRVsgdHlwZSBdO1xuICAgICAgICAgICAgLy8gdHJhY2sgdGhlIGxhcmdlc3Qgb2Zmc2V0IHRvIGRldGVybWluZSB0aGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlclxuICAgICAgICAgICAgaWYgKCBieXRlT2Zmc2V0ID4gbWF4Qnl0ZU9mZnNldCApIHtcbiAgICAgICAgICAgICAgICBtYXhCeXRlT2Zmc2V0ID0gYnl0ZU9mZnNldDtcbiAgICAgICAgICAgICAgICBieXRlU3RyaWRlID0gYnl0ZU9mZnNldCArICggc2l6ZSAqIEJZVEVTX1BFUl9UWVBFWyB0eXBlIF0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBtYXggYnl0ZSBvZmZzZXQgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB0aGUgc3VtIG9mXG4gICAgICAgIC8vIHRoZSBzaXplcy4gSWYgc28gdGhpcyBidWZmZXIgaXMgbm90IGludGVybGVhdmVkIGFuZCBkb2VzIG5vdCBuZWVkIGFcbiAgICAgICAgLy8gc3RyaWRlLlxuICAgICAgICBpZiAoIG1heEJ5dGVPZmZzZXQgPj0gYnl0ZVNpemVTdW0gKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiB0ZXN0IHdoYXQgc3RyaWRlID09PSAwIGRvZXMgZm9yIGFuIGludGVybGVhdmVkIGJ1ZmZlciBvZlxuICAgICAgICAgICAgLy8gbGVuZ3RoID09PSAxLlxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ5dGVTdHJpZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIGF0dHJpYnV0ZSBwb2ludGVycyB0byBlbnN1cmUgdGhleSBhcmUgdmFsaWQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVQb2ludGVycyAtIFRoZSBhdHRyaWJ1dGUgcG9pbnRlciBtYXAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIFRoZSB2YWxpZGF0ZWQgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZVBvaW50ZXJzKCBhdHRyaWJ1dGVQb2ludGVycyApIHtcbiAgICAgICAgLy8gZW5zdXJlIHRoZXJlIGFyZSBwb2ludGVycyBwcm92aWRlZFxuICAgICAgICBpZiAoICFhdHRyaWJ1dGVQb2ludGVycyB8fCBPYmplY3Qua2V5cyggYXR0cmlidXRlUG9pbnRlcnMgKS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICB0aHJvdyAnVmVydGV4QnVmZmVyIHJlcXVpcmVzIGF0dHJpYnV0ZSBwb2ludGVycyB0byBiZSBzcGVjaWZpZWQgdXBvbiBpbnN0YW50aWF0aW9uJztcbiAgICAgICAgfVxuICAgICAgICAvLyBwYXJzZSBwb2ludGVycyB0byBlbnN1cmUgdGhleSBhcmUgdmFsaWRcbiAgICAgICAgdmFyIHBvaW50ZXJzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKCBhdHRyaWJ1dGVQb2ludGVycyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCgga2V5LCAxMCApO1xuICAgICAgICAgICAgLy8gY2hlY2sgdGhhdCBrZXkgaXMgYW4gdmFsaWQgaW50ZWdlclxuICAgICAgICAgICAgaWYgKCBpc05hTiggaW5kZXggKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0cmlidXRlIGluZGV4IGAnICsga2V5ICsgJ2AgZG9lcyBub3QgcmVwcmVzZW50IGFuIGludGVnZXInO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBvaW50ZXIgPSBhdHRyaWJ1dGVQb2ludGVyc1trZXldO1xuICAgICAgICAgICAgdmFyIHNpemUgPSBwb2ludGVyLnNpemU7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IHBvaW50ZXIudHlwZTtcbiAgICAgICAgICAgIHZhciBieXRlT2Zmc2V0ID0gcG9pbnRlci5ieXRlT2Zmc2V0O1xuICAgICAgICAgICAgLy8gY2hlY2sgc2l6ZVxuICAgICAgICAgICAgaWYgKCAhU0laRVNbIHNpemUgXSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0cmlidXRlIHBvaW50ZXIgYHNpemVgIHBhcmFtZXRlciBpcyBpbnZhbGlkLCBtdXN0IGJlIG9uZSBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoIE9iamVjdC5rZXlzKCBTSVpFUyApICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0eXBlXG4gICAgICAgICAgICBpZiAoICFUWVBFU1sgdHlwZSBdICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdBdHRyaWJ1dGUgcG9pbnRlciBgdHlwZWAgcGFyYW1ldGVyIGlzIGludmFsaWQsIG11c3QgYmUgb25lIG9mICcgK1xuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSggT2JqZWN0LmtleXMoIFRZUEVTICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvaW50ZXJzWyBpbmRleCBdID0ge1xuICAgICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICBieXRlT2Zmc2V0OiAoIGJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCApID8gYnl0ZU9mZnNldCA6IERFRkFVTFRfQllURV9PRkZTRVRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcG9pbnRlcnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBudW1iZXIgb2YgY29tcG9uZW50cyBpbiB0aGUgYnVmZmVyLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlUG9pbnRlcnMgLSBUaGUgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqXG4gICAgICogQHJldHVybnMge251bWJlcn0gLSBUaGUgbnVtYmVyIG9mIGNvbXBvbmVudHMgaW4gdGhlIGJ1ZmZlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXROdW1Db21wb25lbnRzKCBhdHRyaWJ1dGVQb2ludGVycyApIHtcbiAgICAgICAgdmFyIHNpemUgPSAwO1xuICAgICAgICBPYmplY3Qua2V5cyggYXR0cmlidXRlUG9pbnRlcnMgKS5mb3JFYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG4gICAgICAgICAgICBzaXplICs9IGF0dHJpYnV0ZVBvaW50ZXJzWyBpbmRleCBdLnNpemU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW4gVmVydGV4QnVmZmVyIG9iamVjdC5cbiAgICAgKiBAY2xhc3MgVmVydGV4QnVmZmVyXG4gICAgICogQGNsYXNzZGVzYyBBIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl8VmVydGV4UGFja2FnZXxudW1iZXJ9IGFyZyAtIFRoZSBidWZmZXIgb3IgbGVuZ3RoIG9mIHRoZSBidWZmZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGFycmF5IHBvaW50ZXIgbWFwLCBvciBpbiB0aGUgY2FzZSBvZiBhIHZlcnRleCBwYWNrYWdlIGFyZywgdGhlIG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgcmVuZGVyaW5nIG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5ieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZlcnRleEJ1ZmZlciggYXJnLCBhdHRyaWJ1dGVQb2ludGVycywgb3B0aW9ucyApIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBXZWJHTENvbnRleHRTdGF0ZS5nZXQoIGdsICk7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIHRoaXMubW9kZSA9IE1PREVTWyBvcHRpb25zLm1vZGUgXSA/IG9wdGlvbnMubW9kZSA6IERFRkFVTFRfTU9ERTtcbiAgICAgICAgdGhpcy5jb3VudCA9ICggb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmNvdW50IDogREVGQVVMVF9DT1VOVDtcbiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gKCBvcHRpb25zLmJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5ieXRlT2Zmc2V0IDogREVGQVVMVF9CWVRFX09GRlNFVDtcbiAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gMDtcbiAgICAgICAgLy8gZmlyc3QsIHNldCB0aGUgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgIGlmICggYXJnIGluc3RhbmNlb2YgVmVydGV4UGFja2FnZSApIHtcbiAgICAgICAgICAgIC8vIFZlcnRleFBhY2thZ2UgYXJndW1lbnQsIHVzZSBpdHMgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0gYXJnLnBvaW50ZXJzO1xuICAgICAgICAgICAgLy8gc2hpZnQgb3B0aW9ucyBhcmcgc2luY2UgdGhlcmUgd2lsbCBiZSBubyBhdHRyaWIgcG9pbnRlcnMgYXJnXG4gICAgICAgICAgICBvcHRpb25zID0gYXR0cmlidXRlUG9pbnRlcnMgfHwge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0gZ2V0QXR0cmlidXRlUG9pbnRlcnMoIGF0dHJpYnV0ZVBvaW50ZXJzICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IHRoZSBieXRlIHN0cmlkZVxuICAgICAgICB0aGlzLmJ5dGVTdHJpZGUgPSBnZXRTdHJpZGUoIHRoaXMucG9pbnRlcnMgKTtcbiAgICAgICAgLy8gdGhlbiBidWZmZXIgdGhlIGRhdGFcbiAgICAgICAgaWYgKCBhcmcgKSB7XG4gICAgICAgICAgICBpZiAoIGFyZyBpbnN0YW5jZW9mIFZlcnRleFBhY2thZ2UgKSB7XG4gICAgICAgICAgICAgICAgLy8gVmVydGV4UGFja2FnZSBhcmd1bWVudFxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJnLmJ1ZmZlciApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggYXJnIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIgKSB7XG4gICAgICAgICAgICAgICAgLy8gV2ViR0xCdWZmZXIgYXJndW1lbnRcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMuYnl0ZUxlbmd0aCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBgV2ViR0xCdWZmZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLmJ5dGVMZW5ndGhgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gb3B0aW9ucy5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gYXJnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBBcnJheSBvciBBcnJheUJ1ZmZlciBvciBudW1iZXIgYXJndW1lbnRcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoIGFyZyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGVuc3VyZSB0aGVyZSBpc24ndCBhbiBvdmVyZmxvd1xuICAgICAgICB2YXIgYnl0ZXNQZXJDb3VudCA9IEJZVEVTX1BFUl9DT01QT05FTlQgKiBnZXROdW1Db21wb25lbnRzKCB0aGlzLnBvaW50ZXJzICk7XG4gICAgICAgIGlmICggdGhpcy5jb3VudCAqIGJ5dGVzUGVyQ291bnQgKyB0aGlzLmJ5dGVPZmZzZXQgPiB0aGlzLmJ5dGVMZW5ndGggKSB7XG4gICAgICAgICAgICB0aHJvdyAnVmVydGV4QnVmZmVyIGBjb3VudGAgb2YgJyArIHRoaXMuY291bnQgKyAnIGFuZCBgYnl0ZU9mZnNldGAgb2YgJyArIHRoaXMuYnl0ZU9mZnNldCArICcgb3ZlcmZsb3dzIHRoZSB0b3RhbCBieXRlIGxlbmd0aCBvZiB0aGUgYnVmZmVyICgnICsgdGhpcy5ieXRlTGVuZ3RoICsgJyknO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBsb2FkIHZlcnRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIsIG9yIHNpemUgb2YgdGhlIGJ1ZmZlciBpbiBieXRlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24oIGFyZyApIHtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICAgICAgaWYgKCBhcmcgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgaW50byBBcnJheUJ1ZmZlclZpZXdcbiAgICAgICAgICAgIGFyZyA9IG5ldyBGbG9hdDMyQXJyYXkoIGFyZyApO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgISggYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgKSAmJlxuICAgICAgICAgICAgISggYXJnIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ICkgJiZcbiAgICAgICAgICAgIHR5cGVvZiBhcmcgIT09ICdudW1iZXInICkge1xuICAgICAgICAgICAgLy8gaWYgbm90IGFycmF5YnVmZmVyIG9yIGEgbnVtZXJpYyBzaXplXG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIGBBcnJheUJ1ZmZlclZpZXdgLCBvciBgbnVtYmVyYCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG9uJ3Qgb3ZlcndyaXRlIHRoZSBjb3VudCBpZiBpdCBpcyBhbHJlYWR5IHNldFxuICAgICAgICBpZiAoIHRoaXMuY291bnQgPT09IERFRkFVTFRfQ09VTlQgKSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIG51bWJlciBvZiBhdHRyaWJ1dGUgY29tcG9uZW50cyBmcm9tIHBvaW50ZXJzXG4gICAgICAgICAgICB2YXIgbnVtQ29tcG9uZW50cyA9IGdldE51bUNvbXBvbmVudHMoIHRoaXMucG9pbnRlcnMgKTtcbiAgICAgICAgICAgIC8vIHNldCBjb3VudCBiYXNlZCBvbiBzaXplIG9mIGJ1ZmZlciBhbmQgbnVtYmVyIG9mIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9ICggYXJnIC8gQllURVNfUEVSX0NPTVBPTkVOVCApIC8gbnVtQ29tcG9uZW50cztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IGFyZy5sZW5ndGggLyBudW1Db21wb25lbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBieXRlIGxlbmd0aFxuICAgICAgICBpZiAoIHR5cGVvZiBhcmcgPT09ICdudW1iZXInICkge1xuICAgICAgICAgICAgaWYgKCBhcmcgJSBCWVRFU19QRVJfQ09NUE9ORU5UICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdCeXRlIGxlbmd0aCBtdXN0IGJlIG11bHRpcGxlIG9mICcgKyBCWVRFU19QRVJfQ09NUE9ORU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnLmxlbmd0aCAqIEJZVEVTX1BFUl9DT01QT05FTlQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcbiAgICAgICAgZ2wuYnVmZmVyRGF0YSggZ2wuQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXICk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwbG9hZCBwYXJ0aWFsIHZlcnRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGFycmF5IC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGF0IHdoaWNoIHRvIGJ1ZmZlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJTdWJEYXRhID0gZnVuY3Rpb24oIGFycmF5LCBieXRlT2Zmc2V0ICkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBpZiAoIHRoaXMuYnl0ZUxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHRocm93ICdCdWZmZXIgaGFzIG5vdCB5ZXQgYmVlbiBhbGxvY2F0ZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgICAgICAgIGFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSggYXJyYXkgKTtcbiAgICAgICAgfSBlbHNlIGlmICggISggYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciApICYmICFBcnJheUJ1ZmZlci5pc1ZpZXcoIGFycmF5ICkgKSB7XG4gICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIG9yIGBBcnJheUJ1ZmZlclZpZXdgJztcbiAgICAgICAgfVxuICAgICAgICBieXRlT2Zmc2V0ID0gKCBieXRlT2Zmc2V0ICE9PSB1bmRlZmluZWQgKSA/IGJ5dGVPZmZzZXQgOiBERUZBVUxUX0JZVEVfT0ZGU0VUO1xuICAgICAgICAvLyBnZXQgdGhlIHRvdGFsIG51bWJlciBvZiBhdHRyaWJ1dGUgY29tcG9uZW50cyBmcm9tIHBvaW50ZXJzXG4gICAgICAgIHZhciBieXRlTGVuZ3RoID0gYXJyYXkubGVuZ3RoICogQllURVNfUEVSX0NPTVBPTkVOVDtcbiAgICAgICAgaWYgKCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCA+IHRoaXMuYnl0ZUxlbmd0aCApIHtcbiAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiBsZW5ndGggJyArIGJ5dGVMZW5ndGggKyAnIGJ5dGVzIGFuZCBvZmZzZXQgb2YgJyArIGJ5dGVPZmZzZXQgKyAnIGJ5dGVzIG92ZXJmbG93cyB0aGUgYnVmZmVyIGxlbmd0aCBvZiAnICsgdGhpcy5ieXRlTGVuZ3RoICsgJyBieXRlcyc7XG4gICAgICAgIH1cbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlciApO1xuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKCBnbC5BUlJBWV9CVUZGRVIsIGJ5dGVPZmZzZXQsIGFycmF5ICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHJldHVybnMge1ZlcnRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICAvLyBjYWNoZSB0aGlzIHZlcnRleCBidWZmZXJcbiAgICAgICAgaWYgKCBzdGF0ZS5ib3VuZFZlcnRleEJ1ZmZlciAhPT0gdGhpcy5idWZmZXIgKSB7XG4gICAgICAgICAgICAvLyBiaW5kIGJ1ZmZlclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlciApO1xuICAgICAgICAgICAgc3RhdGUuYm91bmRWZXJ0ZXhCdWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9pbnRlcnMgPSB0aGlzLnBvaW50ZXJzO1xuICAgICAgICB2YXIgYnl0ZVN0cmlkZSA9IHRoaXMuYnl0ZVN0cmlkZTtcbiAgICAgICAgT2JqZWN0LmtleXMoIHBvaW50ZXJzICkuZm9yRWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuICAgICAgICAgICAgdmFyIHBvaW50ZXIgPSBwb2ludGVyc1sgaW5kZXggXTtcbiAgICAgICAgICAgIC8vIHNldCBhdHRyaWJ1dGUgcG9pbnRlclxuICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBwb2ludGVyLnNpemUsXG4gICAgICAgICAgICAgICAgZ2xbIHBvaW50ZXIudHlwZSBdLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIGJ5dGVTdHJpZGUsXG4gICAgICAgICAgICAgICAgcG9pbnRlci5ieXRlT2Zmc2V0ICk7XG4gICAgICAgICAgICAvLyBlbmFibGUgYXR0cmlidXRlIGluZGV4XG4gICAgICAgICAgICBpZiAoICFzdGF0ZS5lbmFibGVkVmVydGV4QXR0cmlidXRlc1sgaW5kZXggXSApIHtcbiAgICAgICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSggaW5kZXggKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5lbmFibGVkVmVydGV4QXR0cmlidXRlc1sgaW5kZXggXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVW5iaW5kcyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHJldHVybnMge1ZlcnRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIC8vIG9ubHkgYmluZCBpZiBpdCBhbHJlYWR5IGlzbid0IGJvdW5kXG4gICAgICAgIGlmICggc3RhdGUuYm91bmRWZXJ0ZXhCdWZmZXIgIT09IHRoaXMuYnVmZmVyICkge1xuICAgICAgICAgICAgLy8gYmluZCBidWZmZXJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIgKTtcbiAgICAgICAgICAgIHN0YXRlLmJvdW5kVmVydGV4QnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMucG9pbnRlcnMgKS5mb3JFYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG4gICAgICAgICAgICAvLyBkaXNhYmxlIGF0dHJpYnV0ZSBpbmRleFxuICAgICAgICAgICAgaWYgKCBzdGF0ZS5lbmFibGVkVmVydGV4QXR0cmlidXRlc1sgaW5kZXggXSApIHtcbiAgICAgICAgICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoIGluZGV4ICk7XG4gICAgICAgICAgICAgICAgc3RhdGUuZW5hYmxlZFZlcnRleEF0dHJpYnV0ZXNbIGluZGV4IF0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSBib3VuZCBidWZmZXIuXG4gICAgICogQG1lbWJlcm9mIFZlcnRleEJ1ZmZlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3QXJyYXlzJy4gT3B0aW9uYWwuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5ieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1ZlcnRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgaWYgKCB0aGlzLnN0YXRlLmJvdW5kVmVydGV4QnVmZmVyICE9PSB0aGlzLmJ1ZmZlciApIHtcbiAgICAgICAgICAgIHRocm93ICdBdHRlbXB0aW5nIHRvIGRyYXcgYW4gdW5ib3VuZCBWZXJ0ZXhCdWZmZXInO1xuICAgICAgICB9XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIHZhciBtb2RlID0gZ2xbIG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgXTtcbiAgICAgICAgdmFyIGJ5dGVPZmZzZXQgPSAoIG9wdGlvbnMuYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmJ5dGVPZmZzZXQgOiB0aGlzLmJ5dGVPZmZzZXQ7XG4gICAgICAgIHZhciBjb3VudCA9ICggb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmNvdW50IDogdGhpcy5jb3VudDtcbiAgICAgICAgaWYgKCBjb3VudCA9PT0gMCApIHtcbiAgICAgICAgICAgIHRocm93ICdBdHRlbXB0aW5nIHRvIGRyYXcgd2l0aCBhIGNvdW50IG9mIDAnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBieXRlc1BlckNvdW50ID0gQllURVNfUEVSX0NPTVBPTkVOVCAqIGdldE51bUNvbXBvbmVudHMoIHRoaXMucG9pbnRlcnMgKTtcbiAgICAgICAgaWYgKCBjb3VudCAqIGJ5dGVzUGVyQ291bnQgKyBieXRlT2Zmc2V0ID4gdGhpcy5ieXRlTGVuZ3RoICkge1xuICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGBjb3VudGAgb2YgJyArIGNvdW50ICsgJyBhbmQgYG9mZnNldGAgb2YgJyArIGJ5dGVPZmZzZXQgKyAnIG92ZXJmbG93cyB0aGUgdG90YWwgYnl0ZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciAoJyArIHRoaXMuYnl0ZUxlbmd0aCArICcpJztcbiAgICAgICAgfVxuICAgICAgICAvLyBkcmF3IGVsZW1lbnRzXG4gICAgICAgIGdsLmRyYXdBcnJheXMoIG1vZGUsIGJ5dGVPZmZzZXQsIGNvdW50ICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleEJ1ZmZlcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XHJcbiAgICB2YXIgQ09NUE9ORU5UX1RZUEUgPSAnRkxPQVQnO1xyXG4gICAgdmFyIEJZVEVTX1BFUl9DT01QT05FTlQgPSA0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBsZW5ndGggPiAwIGtleSBieSBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gaW50LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBtYXAgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgdmFsaWQgYXJyYXkgb2YgYXJndW1lbnRzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZUF0dHJpYnV0ZU1hcCggYXR0cmlidXRlcyApIHtcclxuICAgICAgICB2YXIgZ29vZEF0dHJpYnV0ZXMgPSBbXTtcclxuICAgICAgICBPYmplY3Qua2V5cyggYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHBhcnNlRmxvYXQoIGtleSApO1xyXG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IGtleSBpcyBhbiB2YWxpZCBpbnRlZ2VyXHJcbiAgICAgICAgICAgIGlmICggIVV0aWwuaXNJbnRlZ2VyKCBpbmRleCApIHx8IGluZGV4IDwgMCApIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdBdHRyaWJ1dGUgaW5kZXggYCcgKyBrZXkgKyAnYCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWxpZCBpbnRlZ2VyJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdmVydGljZXMgPSBhdHRyaWJ1dGVzW2tleV07XHJcbiAgICAgICAgICAgIC8vIGVuc3VyZSBhdHRyaWJ1dGUgaXMgdmFsaWRcclxuICAgICAgICAgICAgaWYgKCB2ZXJ0aWNlcyAmJlxyXG4gICAgICAgICAgICAgICAgdmVydGljZXMgaW5zdGFuY2VvZiBBcnJheSAmJlxyXG4gICAgICAgICAgICAgICAgdmVydGljZXMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGFkZCBhdHRyaWJ1dGUgZGF0YSBhbmQgaW5kZXhcclxuICAgICAgICAgICAgICAgIGdvb2RBdHRyaWJ1dGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2ZXJ0aWNlc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnRXJyb3IgcGFyc2luZyBhdHRyaWJ1dGUgb2YgaW5kZXggYCcgKyBrZXkgKyAnYCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzb3J0IGF0dHJpYnV0ZXMgYXNjZW5kaW5nIGJ5IGluZGV4XHJcbiAgICAgICAgZ29vZEF0dHJpYnV0ZXMuc29ydChmdW5jdGlvbihhLGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnb29kQXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBjb21wb25lbnQncyBieXRlIHNpemUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50IHRvIG1lYXN1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2ludGVnZXJ9IFRoZSBieXRlIHNpemUgb2YgdGhlIGNvbXBvbmVudC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50U2l6ZSggY29tcG9uZW50ICkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIHZlY3RvclxyXG4gICAgICAgIGlmICggY29tcG9uZW50LnggIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgLy8gMSBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgIGlmICggY29tcG9uZW50LnkgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIC8vIDIgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgaWYgKCBjb21wb25lbnQueiAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDMgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggY29tcG9uZW50LncgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNCBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjaGVjayBpZiBhcnJheVxyXG4gICAgICAgIGlmICggY29tcG9uZW50IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkZWZhdWx0IHRvIDEgb3RoZXJ3aXNlXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSB0eXBlLCBzaXplLCBhbmQgb2Zmc2V0IGZvciBlYWNoIGF0dHJpYnV0ZSBpbiB0aGUgYXR0cmlidXRlIGFycmF5IGFsb25nIHdpdGggdGhlIGxlbmd0aCBhbmQgc3RyaWRlIG9mIHRoZSBwYWNrYWdlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlcnRleFBhY2thZ2V9IHZlcnRleFBhY2thZ2UgLSBUaGUgVmVydGV4UGFja2FnZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIC0gVGhlIGFycmF5IG9mIHZlcnRleCBhdHRyaWJ1dGVzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRQb2ludGVyc0FuZFN0cmlkZSggdmVydGV4UGFja2FnZSwgYXR0cmlidXRlcyApIHtcclxuICAgICAgICB2YXIgc2hvcnRlc3RBcnJheSA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IDA7XHJcbiAgICAgICAgLy8gY2xlYXIgcG9pbnRlcnNcclxuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzID0ge307XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggYXR0cmlidXRlXHJcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGljZXMgKSB7XHJcbiAgICAgICAgICAgIC8vIHNldCBzaXplIHRvIG51bWJlciBvZiBjb21wb25lbnRzIGluIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgdmFyIHNpemUgPSBnZXRDb21wb25lbnRTaXplKCB2ZXJ0aWNlcy5kYXRhWzBdICk7XHJcbiAgICAgICAgICAgIC8vIGxlbmd0aCBvZiB0aGUgcGFja2FnZSB3aWxsIGJlIHRoZSBzaG9ydGVzdCBhdHRyaWJ1dGUgYXJyYXkgbGVuZ3RoXHJcbiAgICAgICAgICAgIHNob3J0ZXN0QXJyYXkgPSBNYXRoLm1pbiggc2hvcnRlc3RBcnJheSwgdmVydGljZXMuZGF0YS5sZW5ndGggKTtcclxuICAgICAgICAgICAgLy8gc3RvcmUgcG9pbnRlciB1bmRlciBpbmRleFxyXG4gICAgICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzWyB2ZXJ0aWNlcy5pbmRleCBdID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA6IENPTVBPTkVOVF9UWVBFLFxyXG4gICAgICAgICAgICAgICAgc2l6ZSA6IHNpemUsXHJcbiAgICAgICAgICAgICAgICBieXRlT2Zmc2V0IDogb2Zmc2V0ICogQllURVNfUEVSX0NPTVBPTkVOVFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBhY2N1bXVsYXRlIGF0dHJpYnV0ZSBvZmZzZXRcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IHNpemU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gc2V0IHN0cmlkZSB0byB0b3RhbCBvZmZzZXRcclxuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLmJ5dGVTdHJpZGUgPSBvZmZzZXQgKiBCWVRFU19QRVJfQ09NUE9ORU5UO1xyXG4gICAgICAgIC8vIHNldCBsZW5ndGggb2YgcGFja2FnZSB0byB0aGUgc2hvcnRlc3QgYXR0cmlidXRlIGFycmF5IGxlbmd0aFxyXG4gICAgICAgIHZlcnRleFBhY2thZ2UubGVuZ3RoID0gc2hvcnRlc3RBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbGwgdGhlIGFycmF5YnVmZmVyIHdpdGggYSBzaW5nbGUgY29tcG9uZW50IGF0dHJpYnV0ZS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RyaWRlIC0gVGhlIG9mIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXQxQ29tcG9uZW50QXR0ciggYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSApIHtcclxuICAgICAgICB2YXIgdmVydGV4LCBpLCBqO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxsZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdmVydGV4ID0gdmVydGljZXNbaV07XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcclxuICAgICAgICAgICAgaiA9IG9mZnNldCArICggc3RyaWRlICogaSApO1xyXG4gICAgICAgICAgICBpZiAoIHZlcnRleC54ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbal0gPSB2ZXJ0ZXgueDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdmVydGV4WzBdICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbal0gPSB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbal0gPSB2ZXJ0ZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgZG91YmxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0cmlkZSAtIFRoZSBvZiBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V0MkNvbXBvbmVudEF0dHIoIGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUgKSB7XHJcbiAgICAgICAgdmFyIHZlcnRleCwgaSwgajtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHZlcnRleCA9IHZlcnRpY2VzW2ldO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XHJcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoIHN0cmlkZSAqIGkgKTtcclxuICAgICAgICAgICAgYnVmZmVyW2pdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgYnVmZmVyW2orMV0gPSAoIHZlcnRleC55ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbGwgdGhlIGFycmF5YnVmZmVyIHdpdGggYSB0cmlwbGUgY29tcG9uZW50IGF0dHJpYnV0ZS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RyaWRlIC0gVGhlIG9mIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXQzQ29tcG9uZW50QXR0ciggYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSApIHtcclxuICAgICAgICB2YXIgdmVydGV4LCBpLCBqO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxsZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdmVydGV4ID0gdmVydGljZXNbaV07XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcclxuICAgICAgICAgICAgaiA9IG9mZnNldCArICggc3RyaWRlICogaSApO1xyXG4gICAgICAgICAgICBidWZmZXJbal0gPSAoIHZlcnRleC54ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC54IDogdmVydGV4WzBdO1xyXG4gICAgICAgICAgICBidWZmZXJbaisxXSA9ICggdmVydGV4LnkgIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XHJcbiAgICAgICAgICAgIGJ1ZmZlcltqKzJdID0gKCB2ZXJ0ZXgueiAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueiA6IHZlcnRleFsyXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgcXVhZHJ1cGxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0cmlkZSAtIFRoZSBvZiBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V0NENvbXBvbmVudEF0dHIoIGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUgKSB7XHJcbiAgICAgICAgdmFyIHZlcnRleCwgaSwgajtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHZlcnRleCA9IHZlcnRpY2VzW2ldO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XHJcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoIHN0cmlkZSAqIGkgKTtcclxuICAgICAgICAgICAgYnVmZmVyW2pdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgYnVmZmVyW2orMV0gPSAoIHZlcnRleC55ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xyXG4gICAgICAgICAgICBidWZmZXJbaisyXSA9ICggdmVydGV4LnogIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnogOiB2ZXJ0ZXhbMl07XHJcbiAgICAgICAgICAgIGJ1ZmZlcltqKzNdID0gKCB2ZXJ0ZXgudyAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgudyA6IHZlcnRleFszXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW4gVmVydGV4UGFja2FnZSBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVmVydGV4UGFja2FnZVxyXG4gICAgICogQGNsYXNzZGVzYyBBIHZlcnRleCBwYWNrYWdlIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBhdHRyaWJ1dGVzIHRvIGludGVybGVhdmUga2V5ZWQgYnkgaW5kZXguXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFZlcnRleFBhY2thZ2UoIGF0dHJpYnV0ZXMgKSB7XHJcbiAgICAgICAgaWYgKCBhdHRyaWJ1dGVzICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCBhdHRyaWJ1dGVzICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KDApO1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBkYXRhIHRvIGJlIGludGVybGVhdmVkIGluc2lkZSB0aGUgcGFja2FnZS4gVGhpcyBjbGVhcnMgYW55IHByZXZpb3VzbHkgZXhpc3RpbmcgZGF0YS5cclxuICAgICAqIEBtZW1iZXJvZiBWZXJ0ZXhQYWNrYWdlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlcyB0byBpbnRlcmxlYXZlZCwga2V5ZWQgYnkgaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlcnRleFBhY2thZ2V9IC0gVGhlIHZlcnRleCBwYWNrYWdlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBWZXJ0ZXhQYWNrYWdlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiggYXR0cmlidXRlcyApIHtcclxuICAgICAgICAvLyByZW1vdmUgYmFkIGF0dHJpYnV0ZXNcclxuICAgICAgICBhdHRyaWJ1dGVzID0gcGFyc2VBdHRyaWJ1dGVNYXAoIGF0dHJpYnV0ZXMgKTtcclxuICAgICAgICAvLyBzZXQgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCBzdHJpZGVcclxuICAgICAgICBzZXRQb2ludGVyc0FuZFN0cmlkZSggdGhpcywgYXR0cmlidXRlcyApO1xyXG4gICAgICAgIC8vIHNldCBzaXplIG9mIGRhdGEgdmVjdG9yXHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBzdHJpZGUgPSB0aGlzLmJ5dGVTdHJpZGUgLyBCWVRFU19QRVJfQ09NUE9ORU5UO1xyXG4gICAgICAgIHZhciBwb2ludGVycyA9IHRoaXMucG9pbnRlcnM7XHJcbiAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSggbGVuZ3RoICogc3RyaWRlICk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggdmVydGV4IGF0dHJpYnV0ZSBhcnJheVxyXG4gICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCggZnVuY3Rpb24oIHZlcnRpY2VzICkge1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHBvaW50ZXJcclxuICAgICAgICAgICAgdmFyIHBvaW50ZXIgPSBwb2ludGVyc1sgdmVydGljZXMuaW5kZXggXTtcclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBwb2ludGVycyBvZmZzZXRcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHBvaW50ZXIuYnl0ZU9mZnNldCAvIEJZVEVTX1BFUl9DT01QT05FTlQ7XHJcbiAgICAgICAgICAgIC8vIGNvcHkgdmVydGV4IGRhdGEgaW50byBhcnJheWJ1ZmZlclxyXG4gICAgICAgICAgICBzd2l0Y2ggKCBwb2ludGVyLnNpemUgKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0MkNvbXBvbmVudEF0dHIoIGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHNldDNDb21wb25lbnRBdHRyKCBidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICBzZXQ0Q29tcG9uZW50QXR0ciggYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHNldDFDb21wb25lbnRBdHRyKCBidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleFBhY2thZ2U7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xyXG4gICAgdmFyIFdlYkdMQ29udGV4dFN0YXRlID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHRTdGF0ZScpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZCB0aGUgdmlld3BvcnQgdG8gdGhlIHJlbmRlcmluZyBjb250ZXh0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Vmlld3BvcnR9IHZpZXdwb3J0IC0gVGhlIHZpZXdwb3J0IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG92ZXJyaWRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgaG9yaXpvbnRhbCBvZmZzZXQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldCggdmlld3BvcnQsIHgsIHksIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdmlld3BvcnQuZ2w7XHJcbiAgICAgICAgeCA9ICggeCAhPT0gdW5kZWZpbmVkICkgPyB4IDogMDtcclxuICAgICAgICB5ID0gKCB5ICE9PSB1bmRlZmluZWQgKSA/IHkgOiAwO1xyXG4gICAgICAgIHdpZHRoID0gKCB3aWR0aCAhPT0gdW5kZWZpbmVkICkgPyB3aWR0aCA6IHZpZXdwb3J0LndpZHRoO1xyXG4gICAgICAgIGhlaWdodCA9ICggaGVpZ2h0ICE9PSB1bmRlZmluZWQgKSA/IGhlaWdodCA6IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICBnbC52aWV3cG9ydCggeCwgeSwgd2lkdGgsIGhlaWdodCApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGFuIFZpZXdwb3J0IG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBWaWV3cG9ydFxyXG4gICAgICogQGNsYXNzZGVzYyBBIHZpZXdwb3J0IG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB2aWV3cG9ydCBzcGVjaWZpY2F0aW9uIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWaWV3cG9ydCggc3BlYyApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBXZWJHTENvbnRleHRTdGF0ZS5nZXQoIHRoaXMuZ2wgKTtcclxuICAgICAgICAvLyBzZXQgc2l6ZVxyXG4gICAgICAgIHRoaXMucmVzaXplKFxyXG4gICAgICAgICAgICBzcGVjLndpZHRoIHx8IHRoaXMuZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBzcGVjLmhlaWdodCB8fCB0aGlzLmdsLmNhbnZhcy5oZWlnaHQgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHZpZXdwb3J0cyB3aWR0aCBhbmQgaGVpZ2h0LiBUaGlzIHJlc2l6ZXMgdGhlIHVuZGVybHlpbmcgY2FudmFzIGVsZW1lbnQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmlld3BvcnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBWaWV3cG9ydC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgaWYgKCB0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8ICggd2lkdGggPD0gMCApICkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHdpZHRoYCBvZiAnICsgd2lkdGggKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8ICggaGVpZ2h0IDw9IDAgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGBoZWlnaHRgIG9mICcgKyBoZWlnaHQgKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5nbC5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmdsLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWN0aXZhdGVzIHRoZSB2aWV3cG9ydCBhbmQgcHVzaGVzIGl0IG9udG8gdGhlIHN0YWNrIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50cy4gVGhlIHVuZGVybHlpbmcgY2FudmFzIGVsZW1lbnQgaXMgbm90IGFmZmVjdGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZpZXdwb3J0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG92ZXJyaWRlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb3ZlcnJpZGUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBob3Jpem9udGFsIG9mZnNldCBvdmVycmlkZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHZlcnRpY2FsIG9mZnNldCBvdmVycmlkZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVmlld3BvcnQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggeCwgeSwgd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICBpZiAoIHggIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgeCAhPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgeGAgb2YgJyArIHggKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHkgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgeSAhPT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgeWAgb2YgJyArIHkgKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHdpZHRoICE9PSB1bmRlZmluZWQgJiYgKCB0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8ICggd2lkdGggPD0gMCApICkgKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCBgd2lkdGhgIG9mICcgKyB3aWR0aCArICcgaXMgaW52YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggaGVpZ2h0ICE9PSB1bmRlZmluZWQgJiYgKCB0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCAoIGhlaWdodCA8PSAwICkgKSApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGBoZWlnaHRgIG9mICcgKyBoZWlnaHQgKyAnIGlzIGludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlLnZpZXdwb3J0cy5wdXNoKHtcclxuICAgICAgICAgICAgdmlld3BvcnQ6IHRoaXMsXHJcbiAgICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICAgIHk6IHksXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXQoIHRoaXMsIHgsIHksIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3BzIGN1cnJlbnQgdGhlIHZpZXdwb3J0IG9iamVjdCBhbmQgYWN0aXZhdGVzIHRoZSB2aWV3cG9ydCBiZW5lYXRoIGl0LlxyXG4gICAgICogQG1lbWJlcm9mIFZpZXdwb3J0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZpZXdwb3J0fSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFZpZXdwb3J0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHZhciB0b3AgPSBzdGF0ZS52aWV3cG9ydHMudG9wKCk7XHJcbiAgICAgICAgaWYgKCAhdG9wIHx8IHRoaXMgIT09IHRvcC52aWV3cG9ydCApIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1ZpZXdwb3J0IGlzIG5vdCB0aGUgdG9wIG1vc3QgZWxlbWVudCBvbiB0aGUgc3RhY2snO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGF0ZS52aWV3cG9ydHMucG9wKCk7XHJcbiAgICAgICAgdG9wID0gc3RhdGUudmlld3BvcnRzLnRvcCgpO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBzZXQoIHRvcC52aWV3cG9ydCwgdG9wLngsIHRvcC55LCB0b3Aud2lkdGgsIHRvcC5oZWlnaHQgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXQoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVmlld3BvcnQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgRVhURU5TSU9OUyA9IFtcbiAgICAgICAgLy8gcmF0aWZpZWRcbiAgICAgICAgJ09FU190ZXh0dXJlX2Zsb2F0JyxcbiAgICAgICAgJ09FU190ZXh0dXJlX2hhbGZfZmxvYXQnLFxuICAgICAgICAnV0VCR0xfbG9zZV9jb250ZXh0JyxcbiAgICAgICAgJ09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAgICdPRVNfdmVydGV4X2FycmF5X29iamVjdCcsXG4gICAgICAgICdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJyxcbiAgICAgICAgJ1dFQkdMX2RlYnVnX3NoYWRlcnMnLFxuICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMnLFxuICAgICAgICAnV0VCR0xfZGVwdGhfdGV4dHVyZScsXG4gICAgICAgICdPRVNfZWxlbWVudF9pbmRleF91aW50JyxcbiAgICAgICAgJ0VYVF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYycsXG4gICAgICAgICdFWFRfZnJhZ19kZXB0aCcsXG4gICAgICAgICdXRUJHTF9kcmF3X2J1ZmZlcnMnLFxuICAgICAgICAnQU5HTEVfaW5zdGFuY2VkX2FycmF5cycsXG4gICAgICAgICdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInLFxuICAgICAgICAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdF9saW5lYXInLFxuICAgICAgICAnRVhUX2JsZW5kX21pbm1heCcsXG4gICAgICAgICdFWFRfc2hhZGVyX3RleHR1cmVfbG9kJyxcbiAgICAgICAgLy8gY29tbXVuaXR5XG4gICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfYXRjJyxcbiAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YycsXG4gICAgICAgICdFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQnLFxuICAgICAgICAnV0VCR0xfY29sb3JfYnVmZmVyX2Zsb2F0JyxcbiAgICAgICAgJ0VYVF9zUkdCJyxcbiAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxJ1xuICAgIF07XG4gICAgdmFyIF9ib3VuZENvbnRleHQgPSBudWxsO1xuICAgIHZhciBfY29udGV4dHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gcmZjNDEyMiB2ZXJzaW9uIDQgY29tcGxpYW50IFVVSUQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBVVUlEIHN0cmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRVVUlEKCkge1xuICAgICAgICB2YXIgcmVwbGFjZSA9IGZ1bmN0aW9uKCBjICkge1xuICAgICAgICAgICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgICAgICAgICAgdmFyIHYgPSAoIGMgPT09ICd4JyApID8gciA6ICggciAmIDB4MyB8IDB4OCApO1xuICAgICAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoIDE2ICk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKCAvW3h5XS9nLCByZXBsYWNlICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIEhUTUxDYW52YXNFbGVtZW50IGVsZW1lbnQuIElmIHRoZXJlIGlzIG5vIGlkLCBpdFxuICAgICAqIGdlbmVyYXRlcyBvbmUgYW5kIGFwcGVuZHMgaXQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhcyAtIFRoZSBDYW52YXMgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIENhbnZhcyBpZCBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0SWQoIGNhbnZhcyApIHtcbiAgICAgICAgaWYgKCAhY2FudmFzLmlkICkge1xuICAgICAgICAgICAgY2FudmFzLmlkID0gZ2V0VVVJRCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYW52YXMuaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIENhbnZhcyBlbGVtZW50IG9iamVjdCBmcm9tIGVpdGhlciBhbiBleGlzdGluZyBvYmplY3QsIG9yIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZCBvciBzZWxlY3RvciBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7SFRNTENhbnZhc0VsZW1lbnR9IFRoZSBDYW52YXMgZWxlbWVudCBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0Q2FudmFzKCBhcmcgKSB7XG4gICAgICAgIGlmICggYXJnIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQgKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggYXJnICkgfHxcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBhcmcgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byByZXRyZWl2ZSBhIHdyYXBwZWQgV2ViR0xSZW5kZXJpbmdDb250ZXh0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IHRvIGNyZWF0ZSB0aGUgY29udGV4dCB1bmRlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBjb250ZXh0IHdyYXBwZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0Q29udGV4dFdyYXBwZXIoIGFyZyApIHtcbiAgICAgICAgaWYgKCBhcmcgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIGlmICggX2JvdW5kQ29udGV4dCApIHtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gbGFzdCBib3VuZCBjb250ZXh0XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9ib3VuZENvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZ2V0Q2FudmFzKCBhcmcgKTtcbiAgICAgICAgICAgIGlmICggY2FudmFzICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dHNbIGdldElkKCBjYW52YXMgKSBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG5vIGJvdW5kIGNvbnRleHQgb3IgYXJndW1lbnRcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhbGwga25vd24gZXh0ZW5zaW9ucyBmb3IgYSBwcm92aWRlZCBXZWJHTFJlbmRlcmluZ0NvbnRleHQuIFN0b3JlcyB0aGUgcmVzdWx0cyBpbiB0aGUgY29udGV4dCB3cmFwcGVyIGZvciBsYXRlciBxdWVyaWVzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFdyYXBwZXIgLSBUaGUgY29udGV4dCB3cmFwcGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRFeHRlbnNpb25zKCBjb250ZXh0V3JhcHBlciApIHtcbiAgICAgICAgdmFyIGdsID0gY29udGV4dFdyYXBwZXIuZ2w7XG4gICAgICAgIEVYVEVOU0lPTlMuZm9yRWFjaCggZnVuY3Rpb24oIGlkICkge1xuICAgICAgICAgICAgY29udGV4dFdyYXBwZXIuZXh0ZW5zaW9uc1sgaWQgXSA9IGdsLmdldEV4dGVuc2lvbiggaWQgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gY3JlYXRlIGEgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdyYXBwZWQgaW5zaWRlIGFuIG9iamVjdCB3aGljaCB3aWxsIGFsc28gc3RvcmUgdGhlIGV4dGVuc2lvbiBxdWVyeSByZXN1bHRzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IHRvIGNyZWF0ZSB0aGUgY29udGV4dCB1bmRlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH19IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuICAgICAqXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250ZXh0V3JhcHBlciggY2FudmFzLCBvcHRpb25zICkge1xuICAgICAgICB2YXIgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCggJ3dlYmdsJywgb3B0aW9ucyApIHx8IGNhbnZhcy5nZXRDb250ZXh0KCAnZXhwZXJpbWVudGFsLXdlYmdsJywgb3B0aW9ucyApO1xuICAgICAgICAvLyB3cmFwIGNvbnRleHRcbiAgICAgICAgdmFyIGNvbnRleHRXcmFwcGVyID0ge1xuICAgICAgICAgICAgaWQ6IGdldElkKCBjYW52YXMgKSxcbiAgICAgICAgICAgIGdsOiBnbCxcbiAgICAgICAgICAgIGV4dGVuc2lvbnM6IHt9XG4gICAgICAgIH07XG4gICAgICAgIC8vIGxvYWQgV2ViR0wgZXh0ZW5zaW9uc1xuICAgICAgICBsb2FkRXh0ZW5zaW9ucyggY29udGV4dFdyYXBwZXIgKTtcbiAgICAgICAgLy8gYWRkIGNvbnRleHQgd3JhcHBlciB0byBtYXBcbiAgICAgICAgX2NvbnRleHRzWyBnZXRJZCggY2FudmFzICkgXSA9IGNvbnRleHRXcmFwcGVyO1xuICAgICAgICAvLyBiaW5kIHRoZSBjb250ZXh0XG4gICAgICAgIF9ib3VuZENvbnRleHQgPSBjb250ZXh0V3JhcHBlcjtcbiAgICAgICAgcmV0dXJuIGNvbnRleHRXcmFwcGVyO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRyaWV2ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50IGFuZCBiaW5kcyBpdC4gV2hpbGUgYm91bmQsIHRoZSBhY3RpdmUgY29udGV4dCB3aWxsIGJlIHVzZWQgaW1wbGljaXRseSBieSBhbnkgaW5zdGFudGlhdGVkIGBlc3BlcmAgY29uc3RydWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtXZWJHTENvbnRleHR9IFRoaXMgbmFtZXNwYWNlLCB1c2VkIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uKCBhcmcgKSB7XG4gICAgICAgICAgICB2YXIgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKCBhcmcgKTtcbiAgICAgICAgICAgIGlmICggd3JhcHBlciApIHtcbiAgICAgICAgICAgICAgICBfYm91bmRDb250ZXh0ID0gd3JhcHBlcjtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93ICdObyBjb250ZXh0IGV4aXN0cyBmb3IgcHJvdmlkZWQgYXJndW1lbnQgYCcgKyBhcmcgKyAnYCc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQuIElmIG5vIGNvbnRleHQgZXhpc3RzLCBvbmUgaXMgY3JlYXRlZC5cbiAgICAgICAgICogRHVyaW5nIGNyZWF0aW9uIGF0dGVtcHRzIHRvIGxvYWQgYWxsIGV4dGVuc2lvbnMgZm91bmQgYXQ6IGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fX0gb3B0aW9ucyAtIFBhcmFtZXRlcnMgdG8gdGhlIHdlYmdsIGNvbnRleHQsIG9ubHkgdXNlZCBkdXJpbmcgaW5zdGFudGlhdGlvbi4gT3B0aW9uYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiggYXJnLCBvcHRpb25zICkge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlciggYXJnICk7XG4gICAgICAgICAgICBpZiAoIHdyYXBwZXIgKSB7XG4gICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIG5hdGl2ZSBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmdsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZ2V0IGNhbnZhcyBlbGVtZW50XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZ2V0Q2FudmFzKCBhcmcgKTtcbiAgICAgICAgICAgIC8vIHRyeSB0byBmaW5kIG9yIGNyZWF0ZSBjb250ZXh0XG4gICAgICAgICAgICBpZiAoICFjYW52YXMgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NvbnRleHQgY291bGQgbm90IGJlIGFzc29jaWF0ZWQgd2l0aCBhcmd1bWVudCBvZiB0eXBlIGAnICsgKCB0eXBlb2YgYXJnICkgKyAnYCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjcmVhdGUgY29udGV4dFxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbnRleHRXcmFwcGVyKCBjYW52YXMsIG9wdGlvbnMgKS5nbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IG9iamVjdCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gVGhlIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKCBhcmcgKSB7XG4gICAgICAgICAgICB2YXIgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKCBhcmcgKTtcbiAgICAgICAgICAgIGlmICggd3JhcHBlciApIHtcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAgICBkZWxldGUgX2NvbnRleHRzWyB3cmFwcGVyLmlkIF07XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGlmIGN1cnJlbnRseSBib3VuZFxuICAgICAgICAgICAgICAgIGlmICggd3JhcHBlciA9PT0gX2JvdW5kQ29udGV4dCApIHtcbiAgICAgICAgICAgICAgICAgICAgX2JvdW5kQ29udGV4dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ29udGV4dCBjb3VsZCBub3QgYmUgZm91bmQgb3IgZGVsZXRlZCBmb3IgYXJndW1lbnQgb2YgdHlwZSBgJyArICggdHlwZW9mIGFyZyApICsgJ2AnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBzdXBwb3J0ZWQgZXh0ZW5zaW9ucyBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC4gSWYgbm8gY29udGV4dCBpcyBib3VuZCwgaXQgd2lsbCByZXR1cm4gYW4gZW1wdHkgYXJyYXkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBBbGwgc3VwcG9ydGVkIGV4dGVuc2lvbnMuXG4gICAgICAgICAqL1xuICAgICAgICBzdXBwb3J0ZWRFeHRlbnNpb25zOiBmdW5jdGlvbiggYXJnICkge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlciggYXJnICk7XG4gICAgICAgICAgICBpZiAoIHdyYXBwZXIgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgdmFyIHN1cHBvcnRlZCA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKCBleHRlbnNpb25zICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBleHRlbnNpb25zWyBrZXkgXSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cHBvcnRlZC5wdXNoKCBrZXkgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBwb3J0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyAnTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudCc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHVuc3VwcG9ydGVkIGV4dGVuc2lvbnMgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuIElmIG5vIGNvbnRleHQgaXMgYm91bmQsIGl0IHdpbGwgcmV0dXJuIGFuIGVtcHR5IGFycmF5LlxuICAgICAgICAgKiBhbiBlbXB0eSBhcnJheS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IEFsbCB1bnN1cHBvcnRlZCBleHRlbnNpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgdW5zdXBwb3J0ZWRFeHRlbnNpb25zOiBmdW5jdGlvbiggYXJnICkge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlciggYXJnICk7XG4gICAgICAgICAgICBpZiAoIHdyYXBwZXIgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgdmFyIHVuc3VwcG9ydGVkID0gW107XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoIGV4dGVuc2lvbnMgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFleHRlbnNpb25zWyBrZXkgXSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuc3VwcG9ydGVkLnB1c2goIGtleSApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuc3VwcG9ydGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgJ05vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQnO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgYW4gZXh0ZW5zaW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBsb2FkZWQgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuXG4gICAgICAgICAqICdmYWxzZScuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvbiAtIFRoZSBleHRlbnNpb24gbmFtZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBwcm92aWRlZCBleHRlbnNpb24gaGFzIGJlZW4gbG9hZGVkIHN1Y2Nlc3NmdWxseS5cbiAgICAgICAgICovXG4gICAgICAgIGNoZWNrRXh0ZW5zaW9uOiBmdW5jdGlvbiggYXJnLCBleHRlbnNpb24gKSB7XG4gICAgICAgICAgICBpZiAoICFleHRlbnNpb24gKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gYXJnO1xuICAgICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoIGFyZyApO1xuICAgICAgICAgICAgaWYgKCB3cmFwcGVyICkge1xuICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuICAgICAgICAgICAgICAgIHJldHVybiBleHRlbnNpb25zWyBleHRlbnNpb24gXSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93ICdObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50JztcbiAgICAgICAgfVxuICAgIH07XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBTdGFjayA9IHJlcXVpcmUoJy4uL3V0aWwvU3RhY2snKTtcclxuICAgIHZhciBTdGFja01hcCA9IHJlcXVpcmUoJy4uL3V0aWwvU3RhY2tNYXAnKTtcclxuICAgIHZhciBfc3RhdGVzID0ge307XHJcblxyXG4gICAgZnVuY3Rpb24gV2ViR0xDb250ZXh0U3RhdGUoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIGN1cnJlbnRseSBib3VuZCB2ZXJ0ZXggYnVmZmVyLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5ib3VuZFZlcnRleEJ1ZmZlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBjdXJyZW50bHkgZW5hYmxlZCB2ZXJ0ZXggYXR0cmlidXRlcy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZW5hYmxlZFZlcnRleEF0dHJpYnV0ZXMgPSB7XHJcbiAgICAgICAgICAgICcwJzogZmFsc2UsXHJcbiAgICAgICAgICAgICcxJzogZmFsc2UsXHJcbiAgICAgICAgICAgICcyJzogZmFsc2UsXHJcbiAgICAgICAgICAgICczJzogZmFsc2UsXHJcbiAgICAgICAgICAgICc0JzogZmFsc2UsXHJcbiAgICAgICAgICAgICc1JzogZmFsc2VcclxuICAgICAgICAgICAgLy8gLi4uIG90aGVycyB3aWxsIGJlIGFkZGVkIGFzIG5lZWRlZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBjdXJyZW50bHkgYm91bmQgaW5kZXggYnVmZmVyLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5ib3VuZEluZGV4QnVmZmVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIHN0YWNrIG9mIHB1c2hlZCBzaGFkZXJzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzID0gbmV3IFN0YWNrKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBzdGFjayBvZiBwdXNoZWQgdmlld3BvcnRzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy52aWV3cG9ydHMgPSBuZXcgU3RhY2soKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIHN0YWNrIG9mIHB1c2hlZCByZW5kZXIgdGFyZ2V0cy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0cyA9IG5ldyBTdGFjaygpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbWFwIG9mIHN0YWNrcyBwdXNoZWQgdGV4dHVyZTJEcywga2V5ZWQgYnkgdGV4dHVyZSB1bml0IGluZGV4LlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZXh0dXJlMkRzID0gbmV3IFN0YWNrTWFwKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBtYXAgb2YgcHVzaGVkIHRleHR1cmUyRHMsLCBrZXllZCBieSB0ZXh0dXJlIHVuaXQgaW5kZXguXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRleHR1cmVDdWJlTWFwcyA9IG5ldyBTdGFja01hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCBnbCApIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gZ2wuY2FudmFzLmlkO1xyXG4gICAgICAgICAgICBpZiAoICFfc3RhdGVzWyBpZCBdICkge1xyXG4gICAgICAgICAgICAgICAgX3N0YXRlc1sgaWQgXSA9IG5ldyBXZWJHTENvbnRleHRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBfc3RhdGVzWyBpZCBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAgICAgSW5kZXhCdWZmZXI6IHJlcXVpcmUoJy4vY29yZS9JbmRleEJ1ZmZlcicpLFxyXG4gICAgICAgIFJlbmRlcmFibGU6IHJlcXVpcmUoJy4vY29yZS9SZW5kZXJhYmxlJyksXHJcbiAgICAgICAgUmVuZGVyVGFyZ2V0OiByZXF1aXJlKCcuL2NvcmUvUmVuZGVyVGFyZ2V0JyksXHJcbiAgICAgICAgU2hhZGVyOiByZXF1aXJlKCcuL2NvcmUvU2hhZGVyJyksXHJcbiAgICAgICAgVGV4dHVyZTJEOiByZXF1aXJlKCcuL2NvcmUvVGV4dHVyZTJEJyksXHJcbiAgICAgICAgQ29sb3JUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9Db2xvclRleHR1cmUyRCcpLFxyXG4gICAgICAgIERlcHRoVGV4dHVyZTJEOiByZXF1aXJlKCcuL2NvcmUvRGVwdGhUZXh0dXJlMkQnKSxcclxuICAgICAgICBUZXh0dXJlQ3ViZU1hcDogcmVxdWlyZSgnLi9jb3JlL1RleHR1cmVDdWJlTWFwJyksXHJcbiAgICAgICAgVmVydGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvVmVydGV4QnVmZmVyJyksXHJcbiAgICAgICAgVmVydGV4UGFja2FnZTogcmVxdWlyZSgnLi9jb3JlL1ZlcnRleFBhY2thZ2UnKSxcclxuICAgICAgICBWaWV3cG9ydDogcmVxdWlyZSgnLi9jb3JlL1ZpZXdwb3J0JyksXHJcbiAgICAgICAgV2ViR0xDb250ZXh0OiByZXF1aXJlKCcuL2NvcmUvV2ViR0xDb250ZXh0JylcclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJdGVyYXRvciggYXJnICkge1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcbiAgICAgICAgdmFyIGxlbjtcclxuICAgICAgICBpZiAoIEFycmF5LmlzQXJyYXkoIGFyZyApICkge1xyXG4gICAgICAgICAgICBsZW4gPSBhcmcubGVuZ3RoO1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGkgOiBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKCBhcmcgKTtcclxuICAgICAgICBsZW4gPSBrZXlzLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBrZXlzW2ldIDogbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uY2UoIGZuICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCBmbiA9PT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcbiAgICAgICAgICAgIGZuID0gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVhY2goIG9iamVjdCwgaXRlcmF0b3IsIGNhbGxiYWNrICkge1xyXG4gICAgICAgIGNhbGxiYWNrID0gb25jZSggY2FsbGJhY2sgKTtcclxuICAgICAgICB2YXIga2V5O1xyXG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBkb25lKCBlcnIgKSB7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlZC0tO1xyXG4gICAgICAgICAgICBpZiAoIGVyciApIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBlcnIgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgga2V5ID09PSBudWxsICYmIGNvbXBsZXRlZCA8PSAwICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYga2V5IGlzIG51bGwgaW4gY2FzZSBpdGVyYXRvciBpc24ndCBleGhhdXN0ZWQgYW5kIGRvbmVcclxuICAgICAgICAgICAgICAgIC8vIHdhcyByZXNvbHZlZCBzeW5jaHJvbm91c2x5LlxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIG51bGwgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGl0ZXIgPSBnZXRJdGVyYXRvcihvYmplY3QpO1xyXG4gICAgICAgIHdoaWxlICggKCBrZXkgPSBpdGVyKCkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgY29tcGxldGVkICs9IDE7XHJcbiAgICAgICAgICAgIGl0ZXJhdG9yKCBvYmplY3RbIGtleSBdLCBrZXksIGRvbmUgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBjb21wbGV0ZWQgPT09IDAgKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCBudWxsICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFeGVjdXRlIGEgc2V0IG9mIGZ1bmN0aW9ucyBhc3luY2hyb25vdXNseSwgb25jZSBhbGwgaGF2ZSBiZWVuXHJcbiAgICAgICAgICogY29tcGxldGVkLCBleGVjdXRlIHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi4gSm9icyBtYXkgYmUgcGFzc2VkXHJcbiAgICAgICAgICogYXMgYW4gYXJyYXkgb3Igb2JqZWN0LiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gd2lsbCBiZSBwYXNzZWQgdGhlXHJcbiAgICAgICAgICogcmVzdWx0cyBpbiB0aGUgc2FtZSBmb3JtYXQgYXMgdGhlIHRhc2tzLiBBbGwgdGFza3MgbXVzdCBoYXZlIGFjY2VwdFxyXG4gICAgICAgICAqIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IHRhc2tzIC0gVGhlIHNldCBvZiBmdW5jdGlvbnMgdG8gZXhlY3V0ZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB1cG9uIGNvbXBsZXRpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcGFyYWxsZWw6IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBBcnJheS5pc0FycmF5KCB0YXNrcyApID8gW10gOiB7fTtcclxuICAgICAgICAgICAgZWFjaCggdGFza3MsIGZ1bmN0aW9uKCB0YXNrLCBrZXksIGRvbmUgKSB7XHJcbiAgICAgICAgICAgICAgICB0YXNrKCBmdW5jdGlvbiggZXJyLCByZXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1sga2V5IF0gPSByZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSggZXJyICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oIGVyciApIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBlcnIsIHJlc3VsdHMgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZHMgYW4gR0VUIHJlcXVlc3QgY3JlYXRlIGFuIEltYWdlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgWEhSIG9wdGlvbnMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCAtIFRoZSBVUkwgZm9yIHRoZSByZXNvdXJjZS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICBsb2FkOiBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5zdWNjZXNzICkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MoIGltYWdlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLm9uZXJyb3IgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLmVycm9yICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyID0gJ1VuYWJsZSB0byBsb2FkIGltYWdlIGZyb20gVVJMOiBgJyArIGV2ZW50LnBhdGhbMF0uY3VycmVudFNyYyArICdgJztcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvciggZXJyICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IG9wdGlvbnMudXJsO1xuICAgICAgICB9XG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgc3RhY2sgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFN0YWNrXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgc3RhY2sgaW50ZXJmYWNlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBTdGFjaygpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFB1c2ggYSB2YWx1ZSBvbnRvIHRoZSBzdGFjay5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVGhlIHZhbHVlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIFRoZSBzdGFjayBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLmRhdGEucHVzaCggdmFsdWUgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3AgYSB2YWx1ZSBvZmYgdGhlIHN0YWNrLiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIHRoZXJlIGlzIG5vIHZhbHVlIG9uXHJcbiAgICAgKiB0aGUgc3RhY2suXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgcG9wcGVkIG9mZiB0aGUgc3RhY2suXHJcbiAgICAgKi9cclxuICAgIFN0YWNrLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnBvcCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdG9wIG9mIHRoZSBzdGFjaywgd2l0aG91dCByZW1vdmluZyBpdC4gUmV0dXJuc1xyXG4gICAgICogYHVuZGVmaW5lZGAgaWYgdGhlcmUgaXMgbm8gdmFsdWUgb24gdGhlIHN0YWNrLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBhdCB0aGUgdG9wIG9mIHRoZSBzdGFjay5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnRvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZGF0YS5sZW5ndGggLSAxO1xyXG4gICAgICAgIGlmICggaW5kZXggPCAwICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbIGluZGV4IF07XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gU3RhY2s7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgU3RhY2sgPSByZXF1aXJlKCcuL1N0YWNrJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBtYXAgb2Ygc3RhY2sgb2JqZWN0cy5cclxuICAgICAqIEBjbGFzcyBTdGFja01hcFxyXG4gICAgICogQGNsYXNzZGVzYyBBIGhhc2htYXAgb2Ygc3RhY2tzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBTdGFja01hcCgpIHtcclxuICAgICAgICB0aGlzLnN0YWNrcyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHVzaCBhIHZhbHVlIG9udG8gdGhlIHN0YWNrIHVuZGVyIGEgZ2l2ZW4ga2V5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBUaGUga2V5LlxyXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBwdXNoIG9udG8gdGhlIHN0YWNrLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIFRoZSBzdGFjayBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBTdGFja01hcC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xyXG4gICAgICAgIGlmICggIXRoaXMuc3RhY2tzWyBrZXkgXSApIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFja3NbIGtleSBdID0gbmV3IFN0YWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhY2tzWyBrZXkgXS5wdXNoKCB2YWx1ZSApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBvcCBhIHZhbHVlIG9mZiB0aGUgc3RhY2suIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgdGhlcmUgaXMgbm8gdmFsdWUgb25cclxuICAgICAqIHRoZSBzdGFjaywgb3IgdGhlcmUgaXMgbm8gc3RhY2sgZm9yIHRoZSBrZXkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIFRoZSBrZXkuXHJcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHB1c2ggb250byB0aGUgc3RhY2suXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIHBvcHBlZCBvZmYgdGhlIHN0YWNrLlxyXG4gICAgICovXHJcbiAgICBTdGFja01hcC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oIGtleSApIHtcclxuICAgICAgICBpZiAoICF0aGlzLnN0YWNrc1sga2V5IF0gKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tzWyBrZXkgXS5wb3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRvcCBvZiB0aGUgc3RhY2ssIHdpdGhvdXQgcmVtb3ZpbmcgaXQuIFJldHVybnNcclxuICAgICAqIGB1bmRlZmluZWRgIGlmIHRoZXJlIGlzIG5vIHZhbHVlIG9uIHRoZSBzdGFjayBvciBubyBzdGFjayBmb3IgdGhlIGtleS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKi9cclxuICAgIFN0YWNrTWFwLnByb3RvdHlwZS50b3AgPSBmdW5jdGlvbigga2V5ICkge1xyXG4gICAgICAgIGlmICggIXRoaXMuc3RhY2tzWyBrZXkgXSApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFja3NbIGtleSBdLnRvcCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFN0YWNrTWFwO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFV0aWwgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYXJndW1lbnQgaXMgYW4gQXJyYXksIEFycmF5QnVmZmVyLCBvciBBcnJheUJ1ZmZlclZpZXcuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Kn0gYXJnIC0gVGhlIGFyZ3VtZW50IHRvIHRlc3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2x9IC0gV2hldGhlciBvciBub3QgaXQgaXMgYSBjYW52YXMgdHlwZS5cclxuICAgICAqL1xyXG4gICAgVXRpbC5pc0FycmF5VHlwZSA9IGZ1bmN0aW9uKCBhcmcgKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIEFycmF5IHx8XHJcbiAgICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8XHJcbiAgICAgICAgICAgIEFycmF5QnVmZmVyLmlzVmlldyggYXJnICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBhcmd1bWVudCBpcyBvbmUgb2YgdGhlIFdlYkdMIGB0ZXhJbWFnZTJEYCBvdmVycmlkZGVuXHJcbiAgICAgKiBjYW52YXMgdHlwZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHsqfSBhcmcgLSBUaGUgYXJndW1lbnQgdG8gdGVzdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbH0gLSBXaGV0aGVyIG9yIG5vdCBpdCBpcyBhIGNhbnZhcyB0eXBlLlxyXG4gICAgICovXHJcbiAgICBVdGlsLmlzQ2FudmFzVHlwZSA9IGZ1bmN0aW9uKCBhcmcgKSB7XHJcbiAgICAgICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIEltYWdlRGF0YSB8fFxyXG4gICAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50IHx8XHJcbiAgICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50IHx8XHJcbiAgICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXh0dXJlIE1VU1QgYmUgYSBwb3dlci1vZi10d28uIE90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdGV4dHVyZSBzcGVjaWZpY2F0aW9uIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbH0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgdGV4dHVyZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvLlxyXG4gICAgICovXHJcbiAgICBVdGlsLm11c3RCZVBvd2VyT2ZUd28gPSBmdW5jdGlvbiggc3BlYyApIHtcclxuICAgICAgICAvLyBBY2NvcmRpbmcgdG86XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMX0FQSS9UdXRvcmlhbC9Vc2luZ190ZXh0dXJlc19pbl9XZWJHTCNOb25fcG93ZXItb2YtdHdvX3RleHR1cmVzXHJcbiAgICAgICAgLy8gTlBPVCB0ZXh0dXJlcyBjYW5ub3QgYmUgdXNlZCB3aXRoIG1pcG1hcHBpbmcgYW5kIHRoZXkgbXVzdCBub3QgXCJyZXBlYXRcIlxyXG4gICAgICAgIHJldHVybiBzcGVjLm1pcE1hcCB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBTID09PSAnUkVQRUFUJyB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBTID09PSAnTUlSUk9SRURfUkVQRUFUJyB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBUID09PSAnUkVQRUFUJyB8fFxyXG4gICAgICAgICAgICBzcGVjLndyYXBUID09PSAnTUlSUk9SRURfUkVQRUFUJztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyIGFuZCBpcyBhbiBpbnRlZ2VyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbnVtIC0gVGhlIG51bWJlciB0byB0ZXN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSB2YWx1ZSBpcyBhIG51bWJlci5cclxuICAgICAqL1xyXG4gICAgVXRpbC5pc0ludGVnZXIgPSBmdW5jdGlvbiggbnVtICkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJyAmJiAoIG51bSAlIDEgKSA9PT0gMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHByb3ZpZGVkIGludGVnZXIgaXMgYSBwb3dlciBvZiB0d28uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtpbnRlZ2VyfSBudW0gLSBUaGUgbnVtYmVyIHRvIHRlc3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIG51bWJlciBpcyBhIHBvd2VyIG9mIHR3by5cclxuICAgICAqL1xyXG4gICAgVXRpbC5pc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbiggbnVtICkge1xyXG4gICAgICAgIHJldHVybiAoIG51bSAhPT0gMCApID8gKCBudW0gJiAoIG51bSAtIDEgKSApID09PSAwIDogZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3byBmb3IgYSBudW1iZXIuXHJcbiAgICAgKlxyXG4gICAgICogRXguXHJcbiAgICAgKlxyXG4gICAgICogICAgIDIwMCAtPiAyNTZcclxuICAgICAqICAgICAyNTYgLT4gMjU2XHJcbiAgICAgKiAgICAgMjU3IC0+IDUxMlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbnVtIC0gVGhlIG51bWJlciB0byBtb2RpZnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2ludGVnZXJ9IC0gTmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3by5cclxuICAgICAqL1xyXG4gICAgVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28gPSBmdW5jdGlvbiggbnVtICkge1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIGlmICggbnVtICE9PSAwICkge1xyXG4gICAgICAgICAgICBudW0gPSBudW0tMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICggaT0xOyBpPDMyOyBpPDw9MSApIHtcclxuICAgICAgICAgICAgbnVtID0gbnVtIHwgbnVtID4+IGk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudW0gKyAxO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSB0ZXh0dXJlIG11c3QgYmUgYSBQT1QsIHJlc2l6ZXMgYW5kIHJldHVybnMgdGhlIGltYWdlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB0ZXh0dXJlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWcgLSBUaGUgaW1hZ2Ugb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBVdGlsLnJlc2l6ZUNhbnZhcyA9IGZ1bmN0aW9uKCBzcGVjLCBpbWcgKSB7XHJcbiAgICAgICAgaWYgKCAhVXRpbC5tdXN0QmVQb3dlck9mVHdvKCBzcGVjICkgfHxcclxuICAgICAgICAgICAgKCBVdGlsLmlzUG93ZXJPZlR3byggaW1nLndpZHRoICkgJiYgVXRpbC5pc1Bvd2VyT2ZUd28oIGltZy5oZWlnaHQgKSApICkge1xyXG4gICAgICAgICAgICByZXR1cm4gaW1nO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYW4gZW1wdHkgY2FudmFzIGVsZW1lbnRcclxuICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKTtcclxuICAgICAgICBjYW52YXMud2lkdGggPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byggaW1nLndpZHRoICk7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKCBpbWcuaGVpZ2h0ICk7XHJcbiAgICAgICAgLy8gY29weSB0aGUgaW1hZ2UgY29udGVudHMgdG8gdGhlIGNhbnZhc1xyXG4gICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoIGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0LCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcclxuICAgICAgICByZXR1cm4gY2FudmFzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFV0aWw7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZHMgYW4gWE1MSHR0cFJlcXVlc3QgR0VUIHJlcXVlc3QgdG8gdGhlIHN1cHBsaWVkIHVybC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgWEhSIG9wdGlvbnMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCAtIFRoZSBVUkwgZm9yIHRoZSByZXNvdXJjZS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMucmVzcG9uc2VUeXBlIC0gVGhlIHJlc3BvbnNlVHlwZSBvZiB0aGUgWEhSLlxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZDogZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbiggJ0dFVCcsIG9wdGlvbnMudXJsLCB0cnVlICk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCByZXF1ZXN0LnN0YXR1cyA9PT0gMjAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLnN1Y2Nlc3MgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKCByZXF1ZXN0LnJlc3BvbnNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMuZXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvciggJ0dFVCAnICsgcmVxdWVzdC5yZXNwb25zZVVSTCArICcgJyArIHJlcXVlc3Quc3RhdHVzICsgJyAoJyArIHJlcXVlc3Quc3RhdHVzVGV4dCArICcpJyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9XG4gICAgfTtcblxufSgpKTtcbiJdfQ==
