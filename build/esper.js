(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.esper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
     * @class ColorTexture2D
     * @classdesc A texture class to represent a 2D color texture.
     * @augments Texture2D
     */

    var ColorTexture2D = function (_Texture2D) {
        _inherits(ColorTexture2D, _Texture2D);

        /**
         * Instantiates a ColorTexture2D object.
         *
         * @param {Object} spec - The specification arguments.
         * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.image - The HTMLImageElement to buffer.
         * @param {String} spec.url - The HTMLImageElement URL to load and buffer.
         * @param {Uint8Array|Float32Array} spec.src - The data to buffer.
         * @param {Number} spec.width - The width of the texture.
         * @param {Number} spec.height - The height of the texture.
         * @param {String} spec.wrap - The wrapping type over both S and T dimension.
         * @param {String} spec.wrapS - The wrapping type over the S dimension.
         * @param {String} spec.wrapT - The wrapping type over the T dimension.
         * @param {String} spec.filter - The min / mag filter used during scaling.
         * @param {String} spec.minFilter - The minification filter used during scaling.
         * @param {String} spec.magFilter - The magnification filter used during scaling.
         * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
         * @param {bool} spec.invertY - Whether or not invert-y is enabled.
         * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
         */
        function ColorTexture2D() {
            var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _classCallCheck(this, ColorTexture2D);

            // get specific params
            spec.wrapS = spec.wrapS || spec.wrap;
            spec.wrapT = spec.wrapT || spec.wrap;
            spec.minFilter = spec.minFilter || spec.filter;
            spec.magFilter = spec.magFilter || spec.filter;
            // set texture params
            spec.wrapS = WRAP_MODES[spec.wrapS] ? spec.wrapS : DEFAULT_WRAP;
            spec.wrapT = WRAP_MODES[spec.wrapT] ? spec.wrapT : DEFAULT_WRAP;
            spec.minFilter = MIN_FILTERS[spec.minFilter] ? spec.minFilter : DEFAULT_FILTER;
            spec.magFilter = MAG_FILTERS[spec.magFilter] ? spec.magFilter : DEFAULT_FILTER;
            // set other properties
            spec.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
            spec.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
            spec.premultiplyAlpha = spec.premultiplyAlpha !== undefined ? spec.premultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
            // set format
            spec.format = FORMATS[spec.format] ? spec.format : DEFAULT_FORMAT;
            // buffer the texture based on argument type
            if (typeof spec.src === 'string') {
                // request source from url
                spec.type = 'UNSIGNED_BYTE';
                // call base constructor

                // TODO: put extension handling for arraybuffer / image / video differentiation
                var _this = _possibleConstructorReturn(this, (ColorTexture2D.__proto__ || Object.getPrototypeOf(ColorTexture2D)).call(this, spec));

                ImageLoader.load({
                    url: spec.src,
                    success: function success(image) {
                        // set to unsigned byte type
                        image = Util.resizeCanvas(spec, image);
                        // now buffer
                        _this.bufferData(image, spec.width, spec.height);
                        _this.setParameters(_this);
                        // execute callback
                        if (callback) {
                            callback(null, _this);
                        }
                    },
                    error: function error(err) {
                        if (callback) {
                            callback(err, null);
                        }
                    }
                });
            } else if (Util.isCanvasType(spec.src)) {
                // is image / canvas / video type
                // set to unsigned byte type
                spec.type = 'UNSIGNED_BYTE';
                spec.src = Util.resizeCanvas(spec, spec.src);
                // call base constructor

                var _this = _possibleConstructorReturn(this, (ColorTexture2D.__proto__ || Object.getPrototypeOf(ColorTexture2D)).call(this, spec));
            } else {
                // array, arraybuffer, or null
                if (spec.src === undefined || spec.src === null) {
                    // if no data is provided, assume this texture will be rendered
                    // to. In this case disable mipmapping, there is no need and it
                    // will only introduce very peculiar and difficult to discern
                    // rendering phenomena in which the texture 'transforms' at
                    // certain angles / distances to the mipmapped (empty) portions.
                    spec.mipMap = false;
                }
                // buffer from arg
                spec.type = TYPES[spec.type] ? spec.type : DEFAULT_TYPE;
                // call base constructor

                var _this = _possibleConstructorReturn(this, (ColorTexture2D.__proto__ || Object.getPrototypeOf(ColorTexture2D)).call(this, spec));
            }
            return _possibleConstructorReturn(_this);
        }

        return ColorTexture2D;
    }(Texture2D);

    module.exports = ColorTexture2D;
})();

},{"../util/ImageLoader":16,"../util/Util":17,"./Texture2D":8}],2:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
     * @class DepthTexture2D
     * @classdesc A texture class to represent a 2D depth texture.
     * @augments Texture2D
     */

    var DepthTexture2D = function (_Texture2D) {
        _inherits(DepthTexture2D, _Texture2D);

        /**
         * Instantiates a DepthTexture2D object.
         *
         * @param {Object} spec - The specification arguments.
         * @param {Uint8Array|Uint16Array|Uint32Array} spec.src - The data to buffer.
         * @param {Number} spec.width - The width of the texture.
         * @param {Number} spec.height - The height of the texture.
         * @param {String} spec.wrap - The wrapping type over both S and T dimension.
         * @param {String} spec.wrapS - The wrapping type over the S dimension.
         * @param {String} spec.wrapT - The wrapping type over the T dimension.
         * @param {String} spec.filter - The min / mag filter used during scaling.
         * @param {String} spec.minFilter - The minification filter used during scaling.
         * @param {String} spec.magFilter - The magnification filter used during scaling.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         */
        function DepthTexture2D() {
            var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, DepthTexture2D);

            // get specific params
            spec.wrapS = spec.wrapS || spec.wrap;
            spec.wrapT = spec.wrapT || spec.wrap;
            spec.minFilter = spec.minFilter || spec.filter;
            spec.magFilter = spec.magFilter || spec.filter;
            // set texture params
            spec.wrapS = WRAP_MODES[spec.wrapS] ? spec.wrapS : DEFAULT_WRAP;
            spec.wrapT = WRAP_MODES[spec.wrapT] ? spec.wrapT : DEFAULT_WRAP;
            spec.minFilter = MIN_FILTERS[spec.minFilter] ? spec.minFilter : DEFAULT_FILTER;
            spec.magFilter = MAG_FILTERS[spec.magFilter] ? spec.magFilter : DEFAULT_FILTER;
            // set mip-mapping and format
            spec.mipMap = false; // disable mip-mapping
            spec.invertY = false; // no need to invert-y
            spec.premultiplyAlpha = false; // no alpha to pre-multiply
            spec.format = FORMATS[spec.format] ? spec.format : DEFAULT_FORMAT;
            // check if stencil-depth, or just depth
            if (spec.format === 'DEPTH_STENCIL') {
                spec.type = 'UNSIGNED_INT_24_8_WEBGL';
            } else {
                spec.type = DEPTH_TYPES[spec.type] ? spec.type : DEFAULT_TYPE;
            }
            // call base constructor
            return _possibleConstructorReturn(this, (DepthTexture2D.__proto__ || Object.getPrototypeOf(DepthTexture2D)).call(this, spec));
        }

        return DepthTexture2D;
    }(Texture2D);

    module.exports = DepthTexture2D;
})();

},{"./Texture2D":8}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');

    var TYPES = {
        UNSIGNED_BYTE: true,
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
        UNSIGNED_BYTE: 1,
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
     * @class IndexBuffer
     * @classdesc An index buffer class to hole indexing information.
     */

    var IndexBuffer = function () {

        /**
         * Instantiates an IndexBuffer object.
         *
         * @param {WebGLBuffer|Uint8Array|Uint16Array|Uin32Array|Array|Number} arg - The index data to buffer.
         * @param {Object} options - The rendering options.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.byteOffset - The byte offset into the drawn buffer.
         * @param {String} options.count - The number of vertices to draw.
         */
        function IndexBuffer(arg) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            _classCallCheck(this, IndexBuffer);

            this.gl = WebGLContext.get();
            this.buffer = null;
            this.type = TYPES[options.type] ? options.type : DEFAULT_TYPE;
            this.mode = MODES[options.mode] ? options.mode : DEFAULT_MODE;
            this.count = options.count !== undefined ? options.count : DEFAULT_COUNT;
            this.byteOffset = options.byteOffset !== undefined ? options.byteOffset : DEFAULT_BYTE_OFFSET;
            this.byteLength = 0;
            if (arg) {
                if (arg instanceof WebGLBuffer) {
                    // WebGLBuffer argument
                    if (options.byteLength === undefined) {
                        throw 'Argument of type WebGLBuffer` must be complimented with a corresponding `options.byteLength`';
                    }
                    this.byteLength = options.byteLength;
                    this.buffer = arg;
                } else if (Number.isInteger(arg)) {
                    // byte length argument
                    if (options.type === undefined) {
                        throw 'Argument of type `number` must be complimented with a corresponding `options.type`';
                    }
                    this.bufferData(arg);
                } else if (arg instanceof ArrayBuffer) {
                    // ArrayBuffer arg
                    if (options.type === undefined) {
                        throw 'Argument of type `ArrayBuffer` must be complimented with a corresponding `options.type`';
                    }
                    this.bufferData(arg);
                } else {
                    // Array or ArrayBufferView argument
                    this.bufferData(arg);
                }
            } else {
                if (options.type === undefined) {
                    throw 'Empty buffer must be complimented with a corresponding `options.type`';
                }
            }
        }

        /**
         * Upload index data to the GPU.
         *
         * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer.
         *
         * @return {IndexBuffer} The index buffer object, for chaining.
         */


        _createClass(IndexBuffer, [{
            key: 'bufferData',
            value: function bufferData(arg) {
                var gl = this.gl;
                // cast array to ArrayBufferView based on provided type
                if (Array.isArray(arg)) {
                    // check for type
                    if (this.type === 'UNSIGNED_INT') {
                        // buffer to uint32
                        arg = new Uint32Array(arg);
                    } else if (this.type === 'UNSIGNED_SHORT') {
                        // buffer to uint16
                        arg = new Uint16Array(arg);
                    } else {
                        // buffer to uint8
                        arg = new Uint8Array(arg);
                    }
                } else {
                    // set ensure type corresponds to data
                    if (arg instanceof Uint32Array) {
                        this.type = 'UNSIGNED_INT';
                    } else if (arg instanceof Uint16Array) {
                        this.type = 'UNSIGNED_SHORT';
                    } else if (arg instanceof Uint8Array) {
                        this.type = 'UNSIGNED_BYTE';
                    } else if (!(arg instanceof ArrayBuffer) && !Number.isInteger(arg)) {
                        throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `number`';
                    }
                }
                // check that the type is supported by extension
                if (this.type === 'UNSIGNED_INT' && !WebGLContext.checkExtension('OES_element_index_uint')) {
                    throw 'Cannot create IndexBuffer of type `UNSIGNED_INT` as extension `OES_element_index_uint` is not supported';
                }
                // don't overwrite the count if it is already set
                if (this.count === DEFAULT_COUNT) {
                    if (Number.isInteger(arg)) {
                        this.count = arg / BYTES_PER_TYPE[this.type];
                    } else {
                        this.count = arg.length;
                    }
                }
                // set byte length
                if (Number.isInteger(arg)) {
                    this.byteLength = arg;
                } else {
                    this.byteLength = arg.byteLength;
                }
                // create buffer if it doesn't exist already
                if (!this.buffer) {
                    this.buffer = gl.createBuffer();
                }
                // buffer the data
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arg, gl.STATIC_DRAW);
                return this;
            }

            /**
             * Upload partial index data to the GPU.
             *
             * @param {Array|ArrayBuffer|ArrayBufferView} array - The array of data to buffer.
             * @param {Number} byteOffset - The byte offset at which to buffer.
             *
             * @return {IndexBuffer} The index buffer object, for chaining.
             */

        }, {
            key: 'bufferSubData',
            value: function bufferSubData(array) {
                var byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_BYTE_OFFSET;

                var gl = this.gl;
                if (!this.buffer) {
                    throw 'Buffer has not yet been allocated, allocate with `bufferData`';
                }
                // cast array to ArrayBufferView based on provided type
                if (Array.isArray(array)) {
                    // check for type
                    if (this.type === 'UNSIGNED_INT') {
                        // buffer to uint32
                        array = new Uint32Array(array);
                    } else if (this.type === 'UNSIGNED_SHORT') {
                        // buffer to uint16
                        array = new Uint16Array(array);
                    } else {
                        // buffer to uint8
                        array = new Uint8Array(array);
                    }
                } else if (!(array instanceof Uint8Array) && !(array instanceof Uint16Array) && !(array instanceof Uint32Array) && !(array instanceof ArrayBuffer)) {
                    throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
                }
                // check that we aren't overflowing the buffer
                if (byteOffset + array.byteLength > this.byteLength) {
                    throw 'Argument of length ' + array.byteLength + ' bytes with ' + ('offset of ' + byteOffset + ' bytes overflows the buffer ') + ('length of ' + this.byteLength + ' bytes');
                }
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
                gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, byteOffset, array);
                return this;
            }

            /**
             * Execute the draw command for the bound buffer.
             *
             * @param {Object} options - The options to pass to 'drawElements'. Optional.
             * @param {String} options.mode - The draw mode / primitive type.
             * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
             * @param {String} options.count - The number of vertices to draw.
             *
             * @return {IndexBuffer} The index buffer object, for chaining.
             */

        }, {
            key: 'draw',
            value: function draw() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var gl = this.gl;
                var mode = gl[options.mode || this.mode];
                var type = gl[this.type];
                var byteOffset = options.byteOffset !== undefined ? options.byteOffset : this.byteOffset;
                var count = options.count !== undefined ? options.count : this.count;
                if (count === 0) {
                    throw 'Attempting to draw with a count of 0';
                }
                // bind buffer
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
                // draw elements
                gl.drawElements(mode, count, type, byteOffset);
                // no need to unbind
                return this;
            }
        }]);

        return IndexBuffer;
    }();

    module.exports = IndexBuffer;
})();

},{"./WebGLContext":13}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');

    var TEXTURE_TARGETS = {
        TEXTURE_2D: true,
        TEXTURE_CUBE_MAP: true
    };

    var DEPTH_FORMATS = {
        DEPTH_COMPONENT: true,
        DEPTH_STENCIL: true
    };

    /**
     * @class RenderTarget
     * @classdesc A renderTarget class to allow rendering to textures.
     */

    var RenderTarget = function () {

        /**
         * Instantiates a RenderTarget object.
         */
        function RenderTarget() {
            _classCallCheck(this, RenderTarget);

            this.gl = WebGLContext.get();
            this.framebuffer = this.gl.createFramebuffer();
            this.textures = new Map();
        }

        /**
         * Binds the renderTarget object.
         *
         * @return {RenderTarget} The renderTarget object, for chaining.
         */


        _createClass(RenderTarget, [{
            key: 'bind',
            value: function bind() {
                // bind framebuffer
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
                return this;
            }

            /**
             * Unbinds the renderTarget object.
             *
             * @return {RenderTarget} The renderTarget object, for chaining.
             */

        }, {
            key: 'unbind',
            value: function unbind() {
                // unbind framebuffer
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                return this;
            }

            /**
             * Attaches the provided texture to the provided attachment location.
             *
             * @param {Texture2D} texture - The texture to attach.
             * @param {Number} index - The attachment index. (optional)
             * @param {String} target - The texture target type. (optional)
             *
             * @return {RenderTarget} The renderTarget object, for chaining.
             */

        }, {
            key: 'setColorTarget',
            value: function setColorTarget(texture, index, target) {
                var gl = this.gl;
                if (!texture) {
                    throw 'Texture argument is missing';
                }
                if (TEXTURE_TARGETS[index] && target === undefined) {
                    target = index;
                    index = 0;
                }
                if (index === undefined) {
                    index = 0;
                } else if (!Number.isInteger(index) || index < 0) {
                    throw 'Texture color attachment index is invalid';
                }
                if (target && !TEXTURE_TARGETS[target]) {
                    throw 'Texture target is invalid';
                }
                this.textures.set('color_' + index, texture);
                this.bind();
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl['COLOR_ATTACHMENT' + index], gl[target || 'TEXTURE_2D'], texture.texture, 0);
                this.unbind();
                return this;
            }

            /**
             * Attaches the provided texture to the provided attachment location.
             *
             * @param {Texture2D} texture - The texture to attach.
             *
             * @return {RenderTarget} The renderTarget object, for chaining.
             */

        }, {
            key: 'setDepthTarget',
            value: function setDepthTarget(texture) {
                if (!texture) {
                    throw 'Texture argument is missing';
                }
                if (!DEPTH_FORMATS[texture.format]) {
                    throw 'Provided texture is not of format `DEPTH_COMPONENT` or `DEPTH_STENCIL`';
                }
                var gl = this.gl;
                this.textures.set('depth', texture);
                this.bind();
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture.texture, 0);
                this.unbind();
                return this;
            }

            /**
             * Resizes the renderTarget and all attached textures by the provided height and width.
             *
             * @param {Number} width - The new width of the renderTarget.
             * @param {Number} height - The new height of the renderTarget.
             *
             * @return {RenderTarget} The renderTarget object, for chaining.
             */

        }, {
            key: 'resize',
            value: function resize(width, height) {
                if (typeof width !== 'number' || width <= 0) {
                    throw 'Provided `width` of ' + width + ' is invalid';
                }
                if (typeof height !== 'number' || height <= 0) {
                    throw 'Provided `height` of ' + height + ' is invalid';
                }
                this.textures.forEach(function (texture) {
                    texture.resize(width, height);
                });
                return this;
            }
        }]);

        return RenderTarget;
    }();

    module.exports = RenderTarget;
})();

},{"./WebGLContext":13}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var VertexPackage = require('../core/VertexPackage');
    var VertexBuffer = require('../core/VertexBuffer');
    var IndexBuffer = require('../core/IndexBuffer');

    /**
     * Iterates over all vertex buffers and throws an exception if the counts
     * are not equal.
     * @private
     *
     * @param {Array} vertexBuffers - The array of vertexBuffers.
     */
    function checkVertexBufferCounts(vertexBuffers) {
        var count = null;
        vertexBuffers.forEach(function (buffer) {
            if (count === null) {
                count = buffer.count;
            } else {
                if (count !== buffer.count) {
                    throw 'VertexBuffers must all have the same count to be ' + 'rendered without an IndexBuffer, mismatch of ' + (count + ' and ' + buffer.count + ' found');
                }
            }
        });
    }

    /**
     * Iterates over all attribute pointers and throws an exception if an index
     * occurs more than once.
     * @private
     *
     * @param {Array} vertexBuffers - The array of vertexBuffers.
     */
    function checkIndexCollisions(vertexBuffers) {
        var indices = new Map();
        vertexBuffers.forEach(function (buffer) {
            buffer.pointers.forEach(function (pointer, index) {
                var count = indices.get(index) || 0;
                indices.set(index, count + 1);
            });
        });
        indices.forEach(function (index) {
            if (index > 1) {
                throw 'More than one attribute pointer exists for index `' + index + '`';
            }
        });
    }

    /**
     * @class Renderable
     * @classdesc A container for one or more VertexBuffers and an optional IndexBuffer.
     */

    var Renderable = function () {

        /**
         * Instantiates an Renderable object.
         *
         * @param {Object} spec - The renderable specification object.
         * @param {Array|Float32Array} spec.vertices - The vertices to interleave and buffer.
         * @param {VertexBuffer} spec.vertexBuffer - An existing vertex buffer.
         * @param {VertexBuffer[]} spec.vertexBuffers - Multiple existing vertex buffers.
         * @param {Array|Uint16Array|Uint32Array} spec.indices - The indices to buffer.
         * @param {IndexBuffer} spec.indexbuffer - An existing index buffer.
         */
        function Renderable() {
            var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Renderable);

            if (spec.vertexBuffer || spec.vertexBuffers) {
                // use existing vertex buffer
                this.vertexBuffers = spec.vertexBuffers || [spec.vertexBuffer];
            } else if (spec.vertices) {
                // create vertex package
                var vertexPackage = new VertexPackage(spec.vertices);
                // create vertex buffer
                this.vertexBuffers = [new VertexBuffer(vertexPackage)];
            } else {
                this.vertexBuffers = [];
            }
            if (spec.indexBuffer) {
                // use existing index buffer
                this.indexBuffer = spec.indexBuffer;
            } else if (spec.indices) {
                // create index buffer
                this.indexBuffer = new IndexBuffer(spec.indices);
            } else {
                this.indexBuffer = null;
            }
            // if there is no index buffer, check that vertex buffers all have
            // the same count
            if (!this.indexBuffer) {
                checkVertexBufferCounts(this.vertexBuffers);
            }
            // check that no attribute indices clash
            checkIndexCollisions(this.vertexBuffers);
        }

        /**
         * Execute the draw command for the underlying buffers.
         *
         * @param {Object} options - The options to pass to 'drawElements'. Optional.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
         * @param {String} options.indexOffset - The indexOffset into the drawn buffer.
         * @param {String} options.count - The number of vertices to draw.
         *
         * @return {Renderable} - The renderable object, for chaining.
         */


        _createClass(Renderable, [{
            key: 'draw',
            value: function draw() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                // draw the renderable
                if (this.indexBuffer) {
                    // use index buffer to draw elements
                    // bind vertex buffers and enable attribute pointers
                    this.vertexBuffers.forEach(function (vertexBuffer) {
                        vertexBuffer.bind();
                    });
                    // draw primitives using index buffer
                    this.indexBuffer.draw(options);
                    // disable attribute pointers
                    this.vertexBuffers.forEach(function (vertexBuffer) {
                        vertexBuffer.unbind();
                    });
                    // no advantage to unbinding as there is no stack used
                } else {
                    // no index buffer, use draw arrays
                    // set all attribute pointers
                    this.vertexBuffers.forEach(function (vertexBuffer) {
                        vertexBuffer.bind();
                    });
                    if (this.vertexBuffers.length > 0) {
                        // draw the buffer
                        this.vertexBuffers[0].draw(options);
                    }
                    // disable all attribute pointers
                    this.vertexBuffers.forEach(function (vertexBuffer) {
                        vertexBuffer.unbind();
                    });
                }
                return this;
            }
        }]);

        return Renderable;
    }();

    module.exports = Renderable;
})();

},{"../core/IndexBuffer":3,"../core/VertexBuffer":10,"../core/VertexPackage":11}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var ShaderParser = require('./ShaderParser');
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
     * @param {Map} attributes - The existing attributes map.
     * @param {Object} declaration - The attribute declaration object.
     *
     * @return {Number} The attribute index.
     */
    function getAttributeIndex(attributes, declaration) {
        // check if attribute is already declared, if so, use that index
        if (attributes.has(declaration.name)) {
            return attributes.get(declaration.name).index;
        }
        // return next available index
        return attributes.size;
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
        var declarations = ShaderParser.parseDeclarations([vertSource, fragSource], ['uniform', 'attribute']);
        // for each declaration in the shader
        declarations.forEach(function (declaration) {
            // check if its an attribute or uniform
            if (declaration.qualifier === 'attribute') {
                // if attribute, store type and index
                var index = getAttributeIndex(shader.attributes, declaration);
                shader.attributes.set(declaration.name, {
                    type: declaration.type,
                    index: index
                });
            } else {
                // if (declaration.qualifier === 'uniform') {
                // if uniform, store type and buffer function name
                var type = declaration.type + (declaration.count > 1 ? '[]' : '');
                shader.uniforms.set(declaration.name, {
                    type: declaration.type,
                    func: UNIFORM_FUNCTIONS[type]
                });
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
        var shader = gl.createShader(gl[type]);
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
        var gl = shader.gl;
        shader.attributes.forEach(function (attribute, name) {
            // bind the attribute location
            gl.bindAttribLocation(shader.program, attribute.index, name);
        });
    }

    /**
     * Queries the webgl rendering context for the uniform locations.
     * @private
     *
     * @param {Shader} shader - The Shader object.
     */
    function getUniformLocations(shader) {
        var gl = shader.gl;
        var uniforms = shader.uniforms;
        uniforms.forEach(function (uniform, name) {
            // get the uniform location
            var location = gl.getUniformLocation(shader.program, name);
            // check if null, parse may detect uniform that is compiled out
            // due to a preprocessor evaluation.
            // TODO: fix parser so that it evaluates these correctly.
            if (location === null) {
                uniforms.delete(name);
            } else {
                uniform.location = location;
            }
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
        return function (done) {
            XHRLoader.load({
                url: url,
                responseType: 'text',
                success: function success(res) {
                    done(null, res);
                },
                error: function error(err) {
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
        return function (done) {
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
        return function (done) {
            var tasks = [];
            sources = sources || [];
            sources = !Array.isArray(sources) ? [sources] : sources;
            sources.forEach(function (source) {
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
        var gl = shader.gl;
        var common = sources.common.join('');
        var vert = sources.vert.join('');
        var frag = sources.frag.join('');
        // compile shaders
        var vertexShader = compileShader(gl, common + vert, 'VERTEX_SHADER');
        var fragmentShader = compileShader(gl, common + frag, 'FRAGMENT_SHADER');
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

    var Shader = function () {

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
        function Shader() {
            var _this = this;

            var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _classCallCheck(this, Shader);

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
            this.attributes = new Map();
            this.uniforms = new Map();
            // if attribute ordering is provided, use those indices
            if (spec.attributes) {
                spec.attributes.forEach(function (attr, index) {
                    _this.attributes.set(attr, {
                        index: index
                    });
                });
            }
            // create the shader
            Async.parallel({
                common: resolveSources(spec.common),
                vert: resolveSources(spec.vert),
                frag: resolveSources(spec.frag)
            }, function (err, sources) {
                if (err) {
                    if (callback) {
                        setTimeout(function () {
                            callback(err, null);
                        });
                    }
                    return;
                }
                // once all shader sources are loaded
                createProgram(_this, sources);
                if (callback) {
                    setTimeout(function () {
                        callback(null, _this);
                    });
                }
            });
        }

        /**
         * Binds the shader program for use.
         *
         * @return {Shader} The shader object, for chaining.
         */


        _createClass(Shader, [{
            key: 'use',
            value: function use() {
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

        }, {
            key: 'setUniform',
            value: function setUniform(name, value) {
                var uniform = this.uniforms.get(name);
                // ensure that the uniform spec exists for the name
                if (!uniform) {
                    throw 'No uniform found under name `' + name + '`';
                }
                // check value
                if (value === undefined || value === null) {
                    // ensure that the uniform argument is defined
                    throw 'Value passed for uniform `' + name + '` is undefined or null';
                }
                // set the uniform
                // NOTE: checking type by string comparison is faster than wrapping
                // the functions.
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

        }, {
            key: 'setUniforms',
            value: function setUniforms(args) {
                var _this2 = this;

                Object.keys(args).forEach(function (name) {
                    _this2.setUniform(name, args[name]);
                });
                return this;
            }
        }]);

        return Shader;
    }();

    module.exports = Shader;
})();

},{"../util/Async":15,"../util/XHRLoader":18,"./ShaderParser":7,"./WebGLContext":13}],7:[function(require,module,exports){
'use strict';

(function () {

    'use strict';

    var COMMENTS_REGEXP = /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm;
    var ENDLINE_REGEXP = /(\r\n|\n|\r)/gm;
    var WHITESPACE_REGEXP = /\s{2,}/g;
    var BRACKET_WHITESPACE_REGEXP = /(\s*)(\[)(\s*)(\d+)(\s*)(\])(\s*)/g;
    var NAME_COUNT_REGEXP = /([a-zA-Z_][a-zA-Z0-9_]*)(?:\[(\d+)\])?/;
    var PRECISION_REGEX = /\bprecision\s+\w+\s+\w+;/g;
    var INLINE_PRECISION_REGEX = /\b(highp|mediump|lowp)\s+/g;
    var GLSL_REGEXP = /void\s+main\s*\(\s*(void)*\s*\)\s*/mi;
    var PREP_REGEXP = /#([\W\w\s\d])(?:.*\\r?\n)*.*$/gm;

    /**
     * Removes standard comments from the provided string.
     * @private
     *
     * @param {String} str - The string to strip comments from.
     *
     * @return {String} The commentless string.
     */
    function stripComments(str) {
        // regex source: https://github.com/moagrius/stripcomments
        return str.replace(COMMENTS_REGEXP, '');
    }

    /**
     * Removes an precision statements.
     * @private
     *
     * @param {String} source - The unprocessed source code.
     *
     * @return {String} The processed source code.
     */
    function stripPrecision(source) {
        // remove global precision declarations
        source = source.replace(PRECISION_REGEX, '');
        // remove inline precision declarations
        return source.replace(INLINE_PRECISION_REGEX, '');
    }

    /**
     * Converts all whitespace into a single ' ' space character.
     * @private
     *
     * @param {String} str - The string to normalize whitespace from.
     *
     * @return {String} The normalized string.
     */
    function normalizeWhitespace(str) {
        return str.replace(ENDLINE_REGEXP, ' ') // remove line endings
        .replace(WHITESPACE_REGEXP, ' ') // normalize whitespace to single ' '
        .replace(BRACKET_WHITESPACE_REGEXP, '$2$4$6'); // remove whitespace in brackets
    }

    /**
     * Parses the name and count out of a name statement, returning the declaration object.
     * @private
     *
     * @param {String} qualifier - The qualifier string.
     * @param {String} type - The type string.
     * @param {String} entry - The variable declaration string.
     *
     * @return {Object} The declaration object.
     */
    function parseNameAndCount(qualifier, type, entry) {
        // determine name and size of variable
        var matches = entry.match(NAME_COUNT_REGEXP);
        var name = matches[1];
        var count = matches[2] === undefined ? 1 : parseInt(matches[2], 10);
        return {
            qualifier: qualifier,
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
     *
     * @return {Array} The array of parsed declaration objects.
     */
    function parseStatement(statement) {
        // split statement on commas
        //
        // ['uniform mat4 A[10]', 'B', 'C[2]']
        //
        var split = statement.split(',').map(function (elem) {
            return elem.trim();
        });

        // split declaration header from statement
        //
        // ['uniform', 'mat4', 'A[10]']
        //
        var header = split.shift().split(' ');

        // qualifier is always first element
        //
        // 'uniform'
        //
        var qualifier = header.shift();

        // type will be the second element
        //
        // 'mat4'
        //
        var type = header.shift();

        // last part of header will be the first, and possible only variable name
        //
        // ['A[10]', 'B', 'C[2]']
        //
        var names = header.concat(split);

        // if there are other names after a ',' add them as well
        return names.map(function (name) {
            return parseNameAndCount(qualifier, type, name);
        });
    }

    /**
     * Splits the source string by semi-colons and constructs an array of
     * declaration objects based on the provided qualifier keywords.
     * @private
     *
     * @param {String} source - The shader source string.
     * @param {String|Array} keywords - The qualifier declaration keywords.
     *
     * @return {Array} The array of qualifier declaration objects.
     */
    function parseSource(source, keywords) {
        // get individual statements (any sequence ending in ;)
        var statements = source.split(';');
        // build regex for parsing statements with targetted keywords
        var keywordStr = keywords.join('|');
        var keywordRegex = new RegExp('\\b(' + keywordStr + ')\\b.*');
        // parse and store global precision statements and any declarations
        var matched = [];
        // for each statement
        statements.forEach(function (statement) {
            // check for keywords
            //
            // ['uniform float uTime']
            //
            var kmatch = statement.match(keywordRegex);
            if (kmatch) {
                // parse statement and add to array
                matched = matched.concat(parseStatement(kmatch[0]));
            }
        });
        return matched;
    }

    /**
     * Filters out duplicate declarations present between shaders. Currently
     * just removes all # statements.
     * @private
     *
     * @param {Array} declarations - The array of declarations.
     *
     * @return {Array} The filtered array of declarations.
     */
    function filterDuplicatesByName(declarations) {
        // in cases where the same declarations are present in multiple
        // sources, this function will remove duplicates from the results
        var seen = {};
        return declarations.filter(function (declaration) {
            if (seen[declaration.name]) {
                return false;
            }
            seen[declaration.name] = true;
            return true;
        });
    }

    /**
     * Runs the preprocessor on the glsl code.
     * @private
     *
     * @param {String} source - The unprocessed source code.
     *
     * @return {String} The processed source code.
     */
    function preprocess(source) {
        // TODO: implement this correctly...
        return source.replace(PREP_REGEXP, '');
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
         * @param {Array} sources - The shader sources.
         * @param {Array} qualifiers - The qualifiers to extract.
         *
         * @return {Array} The array of qualifier declaration statements.
         */
        parseDeclarations: function parseDeclarations() {
            var sources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var qualifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            // if no sources or qualifiers are provided, return empty array
            if (sources.length === 0 || qualifiers.length === 0) {
                return [];
            }
            sources = Array.isArray(sources) ? sources : [sources];
            qualifiers = Array.isArray(qualifiers) ? qualifiers : [qualifiers];
            // parse out targetted declarations
            var declarations = [];
            sources.forEach(function (source) {
                // run preprocessor
                source = preprocess(source);
                // remove precision statements
                source = stripPrecision(source);
                // remove comments
                source = stripComments(source);
                // finally, normalize the whitespace
                source = normalizeWhitespace(source);
                // parse out declarations
                declarations = declarations.concat(parseSource(source, qualifiers));
            });
            // remove duplicates and return
            return filterDuplicatesByName(declarations);
        },

        /**
         * Detects based on the existence of a 'void main() {' statement, if the string is glsl source code.
         *
         * @param {String} str - The input string to test.
         *
         * @return {boolean} Whether or not the string is glsl code.
         */
        isGLSL: function isGLSL(str) {
            return GLSL_REGEXP.test(str);
        }

    };
})();

},{}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
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
        LINEAR: true
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
     * @class Texture2D
     * @classdesc A texture class to represent a 2D texture.
     */

    var Texture2D = function () {

        /**
         * Instantiates a Texture2D object.
         *
         * @param {Uint8Array|Uint16Array|Uint32Array|Float32Array|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.src - The data to buffer.
         * @param {Number} spec.width - The width of the texture.
         * @param {Number} spec.height - The height of the texture.
         * @param {String} spec.wrap - The wrapping type over both S and T dimension.
         * @param {String} spec.wrapS - The wrapping type over the S dimension.
         * @param {String} spec.wrapT - The wrapping type over the T dimension.
         * @param {String} spec.filter - The min / mag filter used during scaling.
         * @param {String} spec.minFilter - The minification filter used during scaling.
         * @param {String} spec.magFilter - The magnification filter used during scaling.
         * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
         * @param {bool} spec.invertY - Whether or not invert-y is enabled.
         * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         */
        function Texture2D() {
            var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Texture2D);

            // get specific params
            spec.wrapS = spec.wrapS || spec.wrap;
            spec.wrapT = spec.wrapT || spec.wrap;
            spec.minFilter = spec.minFilter || spec.filter;
            spec.magFilter = spec.magFilter || spec.filter;
            // set context
            this.gl = WebGLContext.get();
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
            this.premultiplyAlpha = spec.premultiplyAlpha !== undefined ? spec.premultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
            // set format
            this.format = spec.format || DEFAULT_FORMAT;
            if (DEPTH_TYPES[this.format] && !WebGLContext.checkExtension('WEBGL_depth_texture')) {
                throw 'Cannot create Texture2D of format `' + this.format + '` as `WEBGL_depth_texture` extension is unsupported';
            }
            // set type
            this.type = spec.type || DEFAULT_TYPE;
            if (this.type === 'FLOAT' && !WebGLContext.checkExtension('OES_texture_float')) {
                throw 'Cannot create Texture2D of type `FLOAT` as `OES_texture_float` extension is unsupported';
            }
            // url will not be resolved yet, so don't buffer in that case
            if (typeof spec.src !== 'string') {
                // check size
                if (!Util.isCanvasType(spec.src)) {
                    // if not a canvas type, dimensions MUST be specified
                    if (typeof spec.width !== 'number' || spec.width <= 0) {
                        throw '`width` argument is missing or invalid';
                    }
                    if (typeof spec.height !== 'number' || spec.height <= 0) {
                        throw '`height` argument is missing or invalid';
                    }
                    if (Util.mustBePowerOfTwo(this)) {
                        if (!Util.isPowerOfTwo(spec.width)) {
                            throw 'Parameters require a power-of-two texture, yet provided width of `' + spec.width + '` is not a power of two';
                        }
                        if (!Util.isPowerOfTwo(spec.height)) {
                            throw 'Parameters require a power-of-two texture, yet provided height of `' + spec.height + '` is not a power of two';
                        }
                    }
                }
                // buffer the data
                this.bufferData(spec.src || null, spec.width, spec.height);
                this.setParameters(this);
            }
        }

        /**
         * Binds the texture object to the provided texture unit location.
         *
         * @param {Number} location - The texture unit location index. Defaults to 0.
         *
         * @return {Texture2D} The texture object, for chaining.
         */


        _createClass(Texture2D, [{
            key: 'bind',
            value: function bind() {
                var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                if (!Number.isInteger(location) || location < 0) {
                    throw 'Texture unit location is invalid';
                }
                // bind texture
                var gl = this.gl;
                gl.activeTexture(gl['TEXTURE' + location]);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                return this;
            }

            /**
             * Unbinds the texture object.
             *
             * @return {Texture2D} The texture object, for chaining.
             */

        }, {
            key: 'unbind',
            value: function unbind() {
                // unbind texture
                var gl = this.gl;
                gl.bindTexture(gl.TEXTURE_2D, null);
                return this;
            }

            /**
             * Buffer data into the texture.
             *
             * @param {Array|ArrayBufferView|null} data - The data array to buffer.
             * @param {Number} width - The width of the data.
             * @param {Number} height - The height of the data.
             *
             * @return {Texture2D} The texture object, for chaining.
             */

        }, {
            key: 'bufferData',
            value: function bufferData(data, width, height) {
                var gl = this.gl;
                // create texture object if it doesn't already exist
                if (!this.texture) {
                    this.texture = gl.createTexture();
                }
                // bind texture
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                // invert y if specified
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.invertY);
                // premultiply alpha if specified
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
                // cast array arg
                if (Array.isArray(data)) {
                    if (this.type === 'UNSIGNED_SHORT') {
                        data = new Uint16Array(data);
                    } else if (this.type === 'UNSIGNED_INT') {
                        data = new Uint32Array(data);
                    } else if (this.type === 'FLOAT') {
                        data = new Float32Array(data);
                    } else {
                        data = new Uint8Array(data);
                    }
                }
                // set ensure type corresponds to data
                if (data instanceof Uint8Array) {
                    this.type = 'UNSIGNED_BYTE';
                } else if (data instanceof Uint16Array) {
                    this.type = 'UNSIGNED_SHORT';
                } else if (data instanceof Uint32Array) {
                    this.type = 'UNSIGNED_INT';
                } else if (data instanceof Float32Array) {
                    this.type = 'FLOAT';
                } else if (data && !(data instanceof ArrayBuffer) && !Util.isCanvasType(data)) {
                    throw 'Argument must be of type `Array`, `ArrayBuffer`, ' + '`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' + '`HTMLCanvasElement`, `HTMLVideoElement`, or null';
                }
                if (Util.isCanvasType(data)) {
                    // store width and height
                    this.width = data.width;
                    this.height = data.height;
                    // buffer the texture
                    gl.texImage2D(gl.TEXTURE_2D, 0, // mip-map level
                    gl[this.format], // webgl requires format === internalFormat
                    gl[this.format], gl[this.type], data);
                } else {
                    // store width and height
                    this.width = width || this.width;
                    this.height = height || this.height;
                    // buffer the texture data
                    gl.texImage2D(gl.TEXTURE_2D, 0, // mip-map level
                    gl[this.format], // webgl requires format === internalFormat
                    this.width, this.height, 0, // border, must be 0
                    gl[this.format], gl[this.type], data);
                }
                // generate mip maps
                if (this.mipMap) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                }
                // unbind texture
                gl.bindTexture(gl.TEXTURE_2D, null);
                return this;
            }

            /**
             * Buffer partial data into the texture.
             *
             * @param {Array|ArrayBufferView|null} data - The data array to buffer.
             * @param {Number} xOffset - The x offset at which to buffer.
             * @param {Number} yOffset - The y offset at which to buffer.
             * @param {Number} width - The width of the data.
             * @param {Number} height - The height of the data.
             *
             * @return {Texture2D} The texture object, for chaining.
             */

        }, {
            key: 'bufferSubData',
            value: function bufferSubData(data) {
                var xOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var yOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

                var gl = this.gl;
                // bind texture
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                // cast array arg
                if (Array.isArray(data)) {
                    if (this.type === 'UNSIGNED_SHORT') {
                        data = new Uint16Array(data);
                    } else if (this.type === 'UNSIGNED_INT') {
                        data = new Uint32Array(data);
                    } else if (this.type === 'FLOAT') {
                        data = new Float32Array(data);
                    } else {
                        data = new Uint8Array(data);
                    }
                }
                // set ensure type corresponds to data
                if (data instanceof Uint8Array) {
                    if (this.type !== 'UNSIGNED_BYTE') {
                        throw 'Provided argument of type `Uint8Array` does not match type of `UNSIGNED_BYTE`';
                    }
                } else if (data instanceof Uint16Array) {
                    if (this.type !== 'UNSIGNED_SHORT') {
                        throw 'Provided argument of type `Uint16Array` does not match type of `UNSIGNED_SHORT`';
                    }
                } else if (data instanceof Uint32Array) {
                    if (this.type !== 'UNSIGNED_INT') {
                        throw 'Provided argument of type `Uint32Array` does not match type of `UNSIGNED_INT`';
                    }
                } else if (data instanceof Float32Array) {
                    if (this.type !== 'FLOAT') {
                        throw 'Provided argument of type `Float32Array` does not match type of `FLOAT`';
                    }
                } else if (!(data instanceof ArrayBuffer) && !Util.isCanvasType(data)) {
                    throw 'Argument must be of type `Array`, `ArrayBuffer`, ' + '`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' + '`HTMLCanvasElement`, or `HTMLVideoElement`';
                }
                if (Util.isCanvasType(data)) {
                    // buffer the texture
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, // mip-map level
                    xOffset, yOffset, gl[this.format], gl[this.type], data);
                } else {
                    // check that width is provided
                    if (!Number.isInteger(width)) {
                        throw 'Provided width of `' + width + '` is invalid';
                    }
                    // check that height is provided
                    if (!Number.isInteger(height)) {
                        throw 'Provided height of `' + height + '` is invalid';
                    }
                    // check that we aren't overflowing the buffer
                    if (width + xOffset > this.width) {
                        throw 'Provided width of `' + width + '` and xOffset of ' + (' `' + xOffset + '` overflows the texture width of ') + ('`' + this.width + '`');
                    }
                    if (height + yOffset > this.height) {
                        throw 'Provided width of `' + height + '` and xOffset of ' + (' `' + yOffset + '` overflows the texture width of ') + ('`' + this.height + '`');
                    }
                    // buffer the texture data
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, // mip-map level
                    xOffset, yOffset, width, height, gl[this.format], gl[this.type], data);
                }
                // generate mip maps
                if (this.mipMap) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                }
                // unbind texture
                gl.bindTexture(gl.TEXTURE_2D, null);
                return this;
            }

            /**
             * Set the texture parameters.
             *
             * @param {Object} params - The parameters by name.
             * @param {String} params.wrap - The wrapping type over both S and T dimension.
             * @param {String} params.wrapS - The wrapping type over the S dimension.
             * @param {String} params.wrapT - The wrapping type over the T dimension.
             * @param {String} params.filter - The min / mag filter used during scaling.
             * @param {String} params.minFilter - The minification filter used during scaling.
             * @param {String} params.magFilter - The magnification filter used during scaling.
             *
             * @return {Texture2D} The texture object, for chaining.
             */

        }, {
            key: 'setParameters',
            value: function setParameters(params) {
                var gl = this.gl;
                // bind texture
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                // set wrap S parameter
                var param = params.wrapS || params.wrap;
                if (param) {
                    if (WRAP_MODES[param]) {
                        this.wrapS = param;
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
                    } else {
                        throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`';
                    }
                }
                // set wrap T parameter
                param = params.wrapT || params.wrap;
                if (param) {
                    if (WRAP_MODES[param]) {
                        this.wrapT = param;
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
                    } else {
                        throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`';
                    }
                }
                // set mag filter parameter
                param = params.magFilter || params.filter;
                if (param) {
                    if (MAG_FILTERS[param]) {
                        this.magFilter = param;
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
                    } else {
                        throw 'Texture parameter `' + param + '` is not a valid value for \'TEXTURE_MAG_FILTER`';
                    }
                }
                // set min filter parameter
                param = params.minFilter || params.filter;
                if (param) {
                    if (this.mipMap) {
                        if (NON_MIPMAP_MIN_FILTERS[param]) {
                            // upgrade to mip-map min filter
                            param += DEFAULT_MIPMAP_MIN_FILTER_SUFFIX;
                        }
                        if (MIPMAP_MIN_FILTERS[param]) {
                            this.minFilter = param;
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
                        } else {
                            throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                        }
                    } else {
                        if (MIN_FILTERS[param]) {
                            this.minFilter = param;
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
                        } else {
                            throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                        }
                    }
                }
                // unbind texture
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                return this;
            }

            /**
             * Resize the underlying texture. This clears the texture data.
             *
             * @param {Number} width - The new width of the texture.
             * @param {Number} height - The new height of the texture.
             *
             * @return {Texture2D} The texture object, for chaining.
             */

        }, {
            key: 'resize',
            value: function resize(width, height) {
                if (typeof width !== 'number' || width <= 0) {
                    throw 'Provided width of `' + width + '` is invalid';
                }
                if (typeof height !== 'number' || height <= 0) {
                    throw 'Provided height of `' + height + '` is invalid';
                }
                this.bufferData(null, width, height);
                return this;
            }
        }]);

        return Texture2D;
    }();

    module.exports = Texture2D;
})();

},{"../util/Util":17,"./WebGLContext":13}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var Async = require('../util/Async');
    var Util = require('../util/Util');
    var ImageLoader = require('../util/ImageLoader');

    var FACES = ['-x', '+x', '-y', '+y', '-z', '+z'];
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
        LINEAR: true
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
    function checkDimensions(cubeMap) {
        if (typeof cubeMap.width !== 'number' || cubeMap.width <= 0) {
            throw '`width` argument is missing or invalid';
        }
        if (typeof cubeMap.height !== 'number' || cubeMap.height <= 0) {
            throw '`height` argument is missing or invalid';
        }
        if (cubeMap.width !== cubeMap.height) {
            throw 'Provided `width` must be equal to `height`';
        }
        if (Util.mustBePowerOfTwo(cubeMap) && !Util.isPowerOfTwo(cubeMap.width)) {
            throw 'Parameters require a power-of-two texture, yet provided size of ' + cubeMap.width + ' is not a power of two';
        }
    }

    /**
     * Returns a function to load a face from a url.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map texture object.
     * @param {String} target - The texture target.
     * @param {String} url - The url to load the face from.
     *
     * @return {Function} The loader function.
     */
    function loadFaceURL(cubeMap, target, url) {
        return function (done) {
            // TODO: put extension handling for arraybuffer / image / video differentiation
            ImageLoader.load({
                url: url,
                success: function success(image) {
                    image = Util.resizeCanvas(cubeMap, image);
                    cubeMap.bufferData(target, image);
                    done(null);
                },
                error: function error(err) {
                    done(err, null);
                }
            });
        };
    }

    /**
     * Returns a function to load a face from a canvas type object.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map texture object.
     * @param {String} target - The texture target.
     * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} canvas - The canvas type object.
     *
     * @return {Function} - The loader function.
     */
    function loadFaceCanvas(cubeMap, target, canvas) {
        return function (done) {
            canvas = Util.resizeCanvas(cubeMap, canvas);
            cubeMap.bufferData(target, canvas);
            done(null);
        };
    }

    /**
     * Returns a function to load a face from an array type object.
     * @private
     *
     * @param {TextureCubeMap} cubeMap - The cube map texture object.
     * @param {String} target - The texture target.
     * @param {Array|ArrayBuffer|ArrayBufferView} arr - The array type object.
     *
     * @return {Function} The loader function.
     */
    function loadFaceArray(cubeMap, target, arr) {
        checkDimensions(cubeMap);
        return function (done) {
            cubeMap.bufferData(target, arr);
            done(null);
        };
    }

    /**
     * @class TextureCubeMap
     * @classdesc A texture class to represent a cube map texture.
     */

    var TextureCubeMap = function () {

        /**
         * Instantiates a TextureCubeMap object.
         *
         * @param {Object} spec - The specification arguments
         * @param {Object} spec.faces - The faces to buffer, under keys '+x', '+y', '+z', '-x', '-y', and '-z'.
         * @param {Number} spec.width - The width of the faces.
         * @param {Number} spec.height - The height of the faces.
         * @param {String} spec.wrap - The wrapping type over both S and T dimension.
         * @param {String} spec.wrapS - The wrapping type over the S dimension.
         * @param {String} spec.wrapT - The wrapping type over the T dimension.
         * @param {String} spec.filter - The min / mag filter used during scaling.
         * @param {String} spec.minFilter - The minification filter used during scaling.
         * @param {String} spec.magFilter - The magnification filter used during scaling.
         * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
         * @param {bool} spec.invertY - Whether or not invert-y is enabled.
         * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         */
        function TextureCubeMap() {
            var _this = this;

            var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            _classCallCheck(this, TextureCubeMap);

            this.gl = WebGLContext.get();
            this.texture = null;
            // get specific params
            spec.wrapS = spec.wrapS || spec.wrap;
            spec.wrapT = spec.wrapT || spec.wrap;
            spec.minFilter = spec.minFilter || spec.filter;
            spec.magFilter = spec.magFilter || spec.filter;
            // set texture params
            this.wrapS = WRAP_MODES[spec.wrapS] ? spec.wrapS : DEFAULT_WRAP;
            this.wrapT = WRAP_MODES[spec.wrapT] ? spec.wrapT : DEFAULT_WRAP;
            this.minFilter = MIN_FILTERS[spec.minFilter] ? spec.minFilter : DEFAULT_FILTER;
            this.magFilter = MAG_FILTERS[spec.magFilter] ? spec.magFilter : DEFAULT_FILTER;
            // set other properties
            this.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
            this.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
            this.premultiplyAlpha = spec.premultiplyAlpha !== undefined ? spec.premultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
            // set format and type
            this.format = FORMATS[spec.format] ? spec.format : DEFAULT_FORMAT;
            this.type = spec.type || DEFAULT_TYPE;
            if (this.type === 'FLOAT' && !WebGLContext.checkExtension('OES_texture_float')) {
                throw 'Cannot create Texture2D of type `FLOAT` as `OES_texture_float` extension is unsupported';
            }
            // set dimensions if provided
            this.width = spec.width;
            this.height = spec.height;
            // set buffered faces
            this.bufferedFaces = [];
            // create cube map based on input
            if (spec.faces) {
                (function () {
                    var tasks = [];
                    FACES.forEach(function (id) {
                        var face = spec.faces[id];
                        var target = FACE_TARGETS[id];
                        // load based on type
                        if (typeof face === 'string') {
                            // url
                            tasks.push(loadFaceURL(_this, target, face));
                        } else if (Util.isCanvasType(face)) {
                            // canvas
                            tasks.push(loadFaceCanvas(_this, target, face));
                        } else {
                            // array / arraybuffer or null
                            tasks.push(loadFaceArray(_this, target, face));
                        }
                    });
                    Async.parallel(tasks, function (err) {
                        if (err) {
                            if (callback) {
                                setTimeout(function () {
                                    callback(err, null);
                                });
                            }
                            return;
                        }
                        // set parameters
                        _this.setParameters(_this);
                        if (callback) {
                            setTimeout(function () {
                                callback(null, _this);
                            });
                        }
                    });
                })();
            } else {
                // null
                checkDimensions(this);
                FACES.forEach(function (id) {
                    _this.bufferData(FACE_TARGETS[id], null);
                });
                // set parameters
                this.setParameters(this);
            }
        }

        /**
         * Binds the texture object to the provided texture unit location.
         *
         * @param {Number} location - The texture unit location index. Defaults to 0.
         *
         * @return {TextureCubeMap} The texture object, for chaining.
         */


        _createClass(TextureCubeMap, [{
            key: 'bind',
            value: function bind() {
                var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                if (!Number.isInteger(location) || location < 0) {
                    throw 'Texture unit location is invalid';
                }
                // bind cube map texture
                var gl = this.gl;
                gl.activeTexture(gl['TEXTURE' + location]);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                return this;
            }

            /**
             * Unbinds the texture object.
             *
             * @return {TextureCubeMap} - The texture object, for chaining.
             */

        }, {
            key: 'unbind',
            value: function unbind() {
                // unbind cube map texture
                var gl = this.gl;
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                return this;
            }

            /**
             * Buffer data into the respective cube map face.
             *
             * @param {String} target - The face target.
             * @param {Object|null} data - The face data.
             *
             * @return {TextureCubeMap} The texture object, for chaining.
             */

        }, {
            key: 'bufferData',
            value: function bufferData(target, data) {
                if (!TARGETS[target]) {
                    throw 'Provided `target` of ' + target + '  is invalid';
                }
                var gl = this.gl;
                // create texture object if it doesn't already exist
                if (!this.texture) {
                    this.texture = gl.createTexture();
                }
                // bind texture
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                // invert y if specified
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.invertY);
                // premultiply alpha if specified
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
                // cast array arg
                if (Array.isArray(data)) {
                    if (this.type === 'UNSIGNED_SHORT') {
                        data = new Uint16Array(data);
                    } else if (this.type === 'UNSIGNED_INT') {
                        data = new Uint32Array(data);
                    } else if (this.type === 'FLOAT') {
                        data = new Float32Array(data);
                    } else {
                        data = new Uint8Array(data);
                    }
                }
                // set ensure type corresponds to data
                if (data instanceof Uint8Array) {
                    this.type = 'UNSIGNED_BYTE';
                } else if (data instanceof Uint16Array) {
                    this.type = 'UNSIGNED_SHORT';
                } else if (data instanceof Uint32Array) {
                    this.type = 'UNSIGNED_INT';
                } else if (data instanceof Float32Array) {
                    this.type = 'FLOAT';
                } else if (data && !(data instanceof ArrayBuffer) && !Util.isCanvasType(data)) {
                    throw 'Argument must be of type `Array`, `ArrayBuffer`, ' + '`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' + '`HTMLCanvasElement`, `HTMLVideoElement`, or null';
                }
                // buffer the data
                if (Util.isCanvasType(data)) {
                    // store width and height
                    this.width = data.width;
                    this.height = data.height;
                    // buffer the texture
                    gl.texImage2D(gl[target], 0, // mip-map level,
                    gl[this.format], // webgl requires format === internalFormat
                    gl[this.format], gl[this.type], data);
                } else {
                    // buffer the texture data
                    gl.texImage2D(gl[target], 0, // mip-map level
                    gl[this.format], // webgl requires format === internalFormat
                    this.width, this.height, 0, // border, must be 0
                    gl[this.format], gl[this.type], data);
                }
                // track the face that was buffered
                if (this.bufferedFaces.indexOf(target) < 0) {
                    this.bufferedFaces.push(target);
                }
                // if all faces buffered, generate mipmaps
                if (this.mipMap && this.bufferedFaces.length === 6) {
                    // only generate mipmaps if all faces are buffered
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                }
                // unbind texture
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                return this;
            }

            /**
             * Set the texture parameters.
             *
             * @param {Object} params - The parameters by name.
             * @param {String} params.wrap - The wrapping type over both S and T dimension.
             * @param {String} params.wrapS - The wrapping type over the S dimension.
             * @param {String} params.wrapT - The wrapping type over the T dimension.
             * @param {String} params.filter - The min / mag filter used during scaling.
             * @param {String} params.minFilter - The minification filter used during scaling.
             * @param {String} params.magFilter - The magnification filter used during scaling.
             *
             * @return {TextureCubeMap} The texture object, for chaining.
             */

        }, {
            key: 'setParameters',
            value: function setParameters(params) {
                var gl = this.gl;
                // bind texture
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                // set wrap S parameter
                var param = params.wrapS || params.wrap;
                if (param) {
                    if (WRAP_MODES[param]) {
                        this.wrapS = param;
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
                    } else {
                        throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_S`';
                    }
                }
                // set wrap T parameter
                param = params.wrapT || params.wrap;
                if (param) {
                    if (WRAP_MODES[param]) {
                        this.wrapT = param;
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
                    } else {
                        throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_WRAP_T`';
                    }
                }
                // set mag filter parameter
                param = params.magFilter || params.filter;
                if (param) {
                    if (MAG_FILTERS[param]) {
                        this.magFilter = param;
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
                    } else {
                        throw 'Texture parameter `' + param + '` is not a valid value for \'TEXTURE_MAG_FILTER`';
                    }
                }
                // set min filter parameter
                param = params.minFilter || params.filter;
                if (param) {
                    if (this.mipMap) {
                        if (NON_MIPMAP_MIN_FILTERS[param]) {
                            // upgrade to mip-map min filter
                            param += DEFAULT_MIPMAP_MIN_FILTER_SUFFIX;
                        }
                        if (MIPMAP_MIN_FILTERS[param]) {
                            this.minFilter = param;
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
                        } else {
                            throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                        }
                    } else {
                        if (MIN_FILTERS[param]) {
                            this.minFilter = param;
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
                        } else {
                            throw 'Texture parameter `' + param + '` is not a valid value for `TEXTURE_MIN_FILTER`';
                        }
                    }
                }
                // unbind texture
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                return this;
            }
        }]);

        return TextureCubeMap;
    }();

    module.exports = TextureCubeMap;
})();

},{"../util/Async":15,"../util/ImageLoader":16,"../util/Util":17,"./WebGLContext":13}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
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
        BYTE: true,
        UNSIGNED_BYTE: true,
        SHORT: true,
        UNSIGNED_SHORT: true,
        FIXED: true,
        FLOAT: true
    };
    var BYTES_PER_TYPE = {
        BYTE: 1,
        UNSIGNED_BYTE: 1,
        SHORT: 2,
        UNSIGNED_SHORT: 2,
        FIXED: 4,
        FLOAT: 4
    };
    var SIZES = {
        1: true,
        2: true,
        3: true,
        4: true
    };

    /**
     * The default attribute point byte offset.
     */
    var DEFAULT_BYTE_OFFSET = 0;

    /**
     * The default render mode (primitive type).
     */
    var DEFAULT_MODE = 'TRIANGLES';

    /**
     * The default index offset to render from.
     */
    var DEFAULT_INDEX_OFFSET = 0;

    /**
     * The default count of indices to render.
     */
    var DEFAULT_COUNT = 0;

    /**
     * Parse the attribute pointers and determine the byte stride of the buffer.
     * @private
     *
     * @param {Map} attributePointers - The attribute pointer map.
     *
     * @return {Number} The byte stride of the buffer.
     */
    function getStride(attributePointers) {
        // if there is only one attribute pointer assigned to this buffer,
        // there is no need for stride, set to default of 0
        if (attributePointers.size === 1) {
            return 0;
        }
        var maxByteOffset = 0;
        var byteSizeSum = 0;
        var byteStride = 0;
        attributePointers.forEach(function (pointer) {
            var byteOffset = pointer.byteOffset;
            var size = pointer.size;
            var type = pointer.type;
            // track the sum of each attribute size
            byteSizeSum += size * BYTES_PER_TYPE[type];
            // track the largest offset to determine the byte stride of the buffer
            if (byteOffset > maxByteOffset) {
                maxByteOffset = byteOffset;
                byteStride = byteOffset + size * BYTES_PER_TYPE[type];
            }
        });
        // check if the max byte offset is greater than or equal to the the sum of
        // the sizes. If so this buffer is not interleaved and does not need a
        // stride.
        if (maxByteOffset >= byteSizeSum) {
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
     * @return {Object} The validated attribute pointer map.
     */
    function getAttributePointers(attributePointers) {
        // parse pointers to ensure they are valid
        var pointers = new Map();
        Object.keys(attributePointers).forEach(function (key) {
            var index = parseInt(key, 10);
            // check that key is an valid integer
            if (isNaN(index)) {
                throw 'Attribute index `' + key + '` does not represent an integer';
            }
            var pointer = attributePointers[key];
            var size = pointer.size;
            var type = pointer.type;
            var byteOffset = pointer.byteOffset;
            // check size
            if (!SIZES[size]) {
                throw 'Attribute pointer `size` parameter is invalid, must be one of ' + JSON.stringify(Object.keys(SIZES));
            }
            // check type
            if (!TYPES[type]) {
                throw 'Attribute pointer `type` parameter is invalid, must be one of ' + JSON.stringify(Object.keys(TYPES));
            }
            pointers.set(index, {
                size: size,
                type: type,
                byteOffset: byteOffset !== undefined ? byteOffset : DEFAULT_BYTE_OFFSET
            });
        });
        return pointers;
    }

    /**
     * @class VertexBuffer
     * @classdesc A vertex buffer object.
     */

    var VertexBuffer = function () {

        /**
         * Instantiates an VertexBuffer object.
         *
         * @param {WebGLBuffer|VertexPackage|Float32Array|Array|Number} arg - The buffer or length of the buffer.
         * @param {Object} attributePointers - The array pointer map, or in the case of a vertex package arg, the options.
         * @param {Object} options - The rendering options.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.indexOffset - The index offset into the drawn buffer.
         * @param {String} options.count - The number of indices to draw.
         */
        function VertexBuffer(arg) {
            var attributePointers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            _classCallCheck(this, VertexBuffer);

            this.gl = WebGLContext.get();
            this.buffer = null;
            this.mode = MODES[options.mode] ? options.mode : DEFAULT_MODE;
            this.count = options.count !== undefined ? options.count : DEFAULT_COUNT;
            this.indexOffset = options.indexOffset !== undefined ? options.indexOffset : DEFAULT_INDEX_OFFSET;
            this.byteLength = 0;
            // first, set the attribute pointers
            if (arg && arg.buffer && arg.pointers) {
                // VertexPackage argument, use its attribute pointers
                this.pointers = arg.pointers;
                // shift options arg since there will be no attrib pointers arg
                options = attributePointers;
            } else {
                this.pointers = getAttributePointers(attributePointers);
            }
            // set the byte stride
            this.byteStride = getStride(this.pointers);
            // then buffer the data
            if (arg) {
                if (arg instanceof VertexPackage) {
                    // VertexPackage argument
                    this.bufferData(arg.buffer);
                } else if (arg instanceof WebGLBuffer) {
                    // WebGLBuffer argument
                    if (options.byteLength === undefined) {
                        throw 'Argument of type `WebGLBuffer` must be complimented with a corresponding `options.byteLength`';
                    }
                    this.buffer = arg;
                    this.byteLength = options.byteLength;
                } else {
                    // Array or ArrayBuffer or number argument
                    this.bufferData(arg);
                }
            }
        }

        /**
         * Upload vertex data to the GPU.
         *
         * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer, or size of the buffer in bytes.
         *
         * @return {VertexBuffer} The vertex buffer object, for chaining.
         */


        _createClass(VertexBuffer, [{
            key: 'bufferData',
            value: function bufferData(arg) {
                var gl = this.gl;
                // ensure argument is valid
                if (Array.isArray(arg)) {
                    // cast array into Float32Array
                    arg = new Float32Array(arg);
                } else if (!(arg instanceof ArrayBuffer) && !ArrayBuffer.isView(arg) && !Number.isInteger(arg)) {
                    // if not arraybuffer or a numeric size
                    throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `Number`';
                }
                // set byte length
                if (Number.isInteger(arg)) {
                    this.byteLength = arg;
                } else {
                    this.byteLength = arg.byteLength;
                }
                // create buffer if it doesn't exist already
                if (!this.buffer) {
                    this.buffer = gl.createBuffer();
                }
                // buffer the data
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, arg, gl.STATIC_DRAW);
            }

            /**
             * Upload partial vertex data to the GPU.
             *
             * @param {Array|ArrayBuffer|ArrayBufferView} array - The array of data to buffer.
             * @param {Number} byteOffset - The byte offset at which to buffer.
             *
             * @return {VertexBuffer} The vertex buffer object, for chaining.
             */

        }, {
            key: 'bufferSubData',
            value: function bufferSubData(array) {
                var byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_BYTE_OFFSET;

                var gl = this.gl;
                // ensure the buffer exists
                if (!this.buffer) {
                    throw 'Buffer has not yet been allocated, allocate with ' + '`bufferData`';
                }
                // ensure argument is valid
                if (Array.isArray(array)) {
                    array = new Float32Array(array);
                } else if (!(array instanceof ArrayBuffer) && !ArrayBuffer.isView(array)) {
                    throw 'Argument must be of type `Array`, `ArrayBuffer`, ' + 'or `ArrayBufferView`';
                }
                // check that we aren't overflowing the buffer
                if (byteOffset + array.byteLength > this.byteLength) {
                    throw 'Argument of length ' + array.byteLength + ' bytes with ' + ('offset of ' + byteOffset + ' bytes overflows the buffer ') + ('length of ' + this.byteLength + ' bytes');
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, array);
                return this;
            }

            /**
             * Binds the vertex buffer object.
             *
             * @return {VertexBuffer} - Returns the vertex buffer object for chaining.
             */

        }, {
            key: 'bind',
            value: function bind() {
                var _this = this;

                var gl = this.gl;
                // bind buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                // for each attribute pointer
                this.pointers.forEach(function (pointer, index) {
                    // set attribute pointer
                    gl.vertexAttribPointer(index, pointer.size, gl[pointer.type], false, _this.byteStride, pointer.byteOffset);
                    // enable attribute index
                    gl.enableVertexAttribArray(index);
                });
                return this;
            }

            /**
             * Unbinds the vertex buffer object.
             *
             * @return {VertexBuffer} The vertex buffer object, for chaining.
             */

        }, {
            key: 'unbind',
            value: function unbind() {
                var gl = this.gl;
                // unbind buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                this.pointers.forEach(function (pointer, index) {
                    // disable attribute index
                    gl.disableVertexAttribArray(index);
                });
                return this;
            }

            /**
             * Execute the draw command for the bound buffer.
             *
             * @param {Object} options - The options to pass to 'drawArrays'. Optional.
             * @param {String} options.mode - The draw mode / primitive type.
             * @param {String} options.indexOffset - The index offset into the drawn buffer.
             * @param {String} options.count - The number of indices to draw.
             *
             * @return {VertexBuffer} The vertex buffer object, for chaining.
             */

        }, {
            key: 'draw',
            value: function draw() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var gl = this.gl;
                var mode = gl[options.mode || this.mode];
                var indexOffset = options.indexOffset !== undefined ? options.indexOffset : this.indexOffset;
                var count = options.count !== undefined ? options.count : this.count;
                if (count === 0) {
                    throw 'Attempting to draw with a count of 0';
                }
                // draw elements
                gl.drawArrays(mode, indexOffset, count);
                return this;
            }
        }]);

        return VertexBuffer;
    }();

    module.exports = VertexBuffer;
})();

},{"./VertexPackage":11,"./WebGLContext":13}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var COMPONENT_TYPE = 'FLOAT';
    var BYTES_PER_COMPONENT = 4;

    /**
     * Removes invalid attribute arguments. A valid argument must be an Array of length > 0 key by a string representing an int.
     * @private
     *
     * @param {Object} attributes - The map of vertex attributes.
     *
     * @return {Array} The valid array of arguments.
     */
    function parseAttributeMap(attributes) {
        var goodAttributes = [];
        Object.keys(attributes).forEach(function (key) {
            var index = parseFloat(key);
            // check that key is an valid integer
            if (!Number.isInteger(index) || index < 0) {
                throw 'Attribute index `' + key + '` does not represent a valid integer';
            }
            var vertices = attributes[key];
            // ensure attribute is valid
            if (Array.isArray(vertices) && vertices.length > 0) {
                // add attribute data and index
                goodAttributes.push({
                    index: index,
                    data: vertices
                });
            } else {
                throw 'Error parsing attribute of index `' + index + '`';
            }
        });
        // sort attributes ascending by index
        goodAttributes.sort(function (a, b) {
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
     * @return {Number} The byte size of the component.
     */
    function getComponentSize(component) {
        // check if array
        if (Array.isArray(component)) {
            return component.length;
        }
        // check if vector
        if (component.x !== undefined) {
            // 1 component vector
            if (component.y !== undefined) {
                // 2 component vector
                if (component.z !== undefined) {
                    // 3 component vector
                    if (component.w !== undefined) {
                        // 4 component vector
                        return 4;
                    }
                    return 3;
                }
                return 2;
            }
            return 1;
        }
        // single component
        return 1;
    }

    /**
     * Calculates the type, size, and offset for each attribute in the attribute array along with the length and stride of the package.
     * @private
     *
     * @param {VertexPackage} vertexPackage - The VertexPackage object.
     * @param {Array} attributes The array of vertex attributes.
     */
    function setPointersAndStride(vertexPackage, attributes) {
        var shortestArray = Number.MAX_VALUE;
        var offset = 0;
        // for each attribute
        attributes.forEach(function (vertices) {
            // set size to number of components in the attribute
            var size = getComponentSize(vertices.data[0]);
            // length of the package will be the shortest attribute array length
            shortestArray = Math.min(shortestArray, vertices.data.length);
            // store pointer under index
            vertexPackage.pointers.set(vertices.index, {
                type: COMPONENT_TYPE,
                size: size,
                byteOffset: offset * BYTES_PER_COMPONENT
            });
            // accumulate attribute offset
            offset += size;
        });
        // set stride to total offset
        vertexPackage.stride = offset; // not in bytes
        // set length of package to the shortest attribute array length
        vertexPackage.length = shortestArray;
    }

    /**
     * Fill the arraybuffer with a single component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set1ComponentAttr(buffer, vertices, length, offset, stride) {
        for (var i = 0; i < length; i++) {
            var vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            var j = offset + stride * i;
            if (vertex.x !== undefined) {
                buffer[j] = vertex.x;
            } else if (vertex[0] !== undefined) {
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
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set2ComponentAttr(buffer, vertices, length, offset, stride) {
        for (var i = 0; i < length; i++) {
            var vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            var j = offset + stride * i;
            buffer[j] = vertex.x !== undefined ? vertex.x : vertex[0];
            buffer[j + 1] = vertex.y !== undefined ? vertex.y : vertex[1];
        }
    }

    /**
     * Fill the arraybuffer with a triple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set3ComponentAttr(buffer, vertices, length, offset, stride) {
        for (var i = 0; i < length; i++) {
            var vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            var j = offset + stride * i;
            buffer[j] = vertex.x !== undefined ? vertex.x : vertex[0];
            buffer[j + 1] = vertex.y !== undefined ? vertex.y : vertex[1];
            buffer[j + 2] = vertex.z !== undefined ? vertex.z : vertex[2];
        }
    }

    /**
     * Fill the arraybuffer with a quadruple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set4ComponentAttr(buffer, vertices, length, offset, stride) {
        for (var i = 0; i < length; i++) {
            var vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            var j = offset + stride * i;
            buffer[j] = vertex.x !== undefined ? vertex.x : vertex[0];
            buffer[j + 1] = vertex.y !== undefined ? vertex.y : vertex[1];
            buffer[j + 2] = vertex.z !== undefined ? vertex.z : vertex[2];
            buffer[j + 3] = vertex.w !== undefined ? vertex.w : vertex[3];
        }
    }

    /**
     * @class VertexPackage
     * @classdesc A vertex package to assist in interleaving vertex data and building the associated vertex attribute pointers.
     */

    var VertexPackage = function () {

        /**
         * Instantiates a VertexPackage object.
          *
         * @param {Object} attributes - The attributes to interleave keyed by index.
         */
        function VertexPackage(attributes) {
            _classCallCheck(this, VertexPackage);

            this.stride = 0;
            this.length = 0;
            this.buffer = null;
            this.pointers = new Map();
            if (attributes) {
                this.set(attributes);
            }
        }

        /**
         * Set the data to be interleaved inside the package. This clears any previously existing data.
         *
         * @param {Object} attributes - The attributes to interleaved, keyed by index.
         *
         * @return {VertexPackage} The vertex package object, for chaining.
         */


        _createClass(VertexPackage, [{
            key: 'set',
            value: function set(attributes) {
                // remove bad attributes
                attributes = parseAttributeMap(attributes);
                // set attribute pointers and stride
                setPointersAndStride(this, attributes);
                // set size of data vector
                var length = this.length;
                var stride = this.stride; // not in bytes
                var pointers = this.pointers;
                var buffer = this.buffer = new Float32Array(length * stride);
                // for each vertex attribute array
                attributes.forEach(function (vertices) {
                    // get the pointer
                    var pointer = pointers.get(vertices.index);
                    // get the pointers offset
                    var offset = pointer.byteOffset / BYTES_PER_COMPONENT;
                    // copy vertex data into arraybuffer
                    switch (pointer.size) {
                        case 2:
                            set2ComponentAttr(buffer, vertices.data, length, offset, stride);
                            break;
                        case 3:
                            set3ComponentAttr(buffer, vertices.data, length, offset, stride);
                            break;
                        case 4:
                            set4ComponentAttr(buffer, vertices.data, length, offset, stride);
                            break;
                        default:
                            set1ComponentAttr(buffer, vertices.data, length, offset, stride);
                            break;
                    }
                });
                return this;
            }
        }]);

        return VertexPackage;
    }();

    module.exports = VertexPackage;
})();

},{}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');

    /**
     * Bind the viewport to the rendering context.
     *
     * @param {Viewport} viewport - The viewport object.
     * @param {Number} width - The width override.
     * @param {Number} height - The height override.
     * @param {Number} x - The horizontal offset override.
     * @param {Number} y - The vertical offset override.
     */
    function set(viewport, x, y, width, height) {
        var gl = viewport.gl;
        x = x !== undefined ? x : viewport.x;
        y = y !== undefined ? y : viewport.y;
        width = width !== undefined ? width : viewport.width;
        height = height !== undefined ? height : viewport.height;
        gl.viewport(x, y, width, height);
    }

    /**
     * @class Viewport
     * @classdesc A viewport class for managing WebGL viewports.
     */

    var Viewport = function () {

        /**
         * Instantiates a Viewport object.
         *
         * @param {Object} spec - The viewport specification object.
         * @param {Number} spec.width - The width of the viewport.
         * @param {Number} spec.height - The height of the viewport.
         */
        function Viewport() {
            var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Viewport);

            this.gl = WebGLContext.get();
            this.stack = [];
            // set size
            this.resize(spec.width || this.gl.canvas.width, spec.height || this.gl.canvas.height);
        }

        /**
         * Updates the viewports width and height. This resizes the underlying canvas element.
         *
         * @param {Number} width - The width of the viewport.
         * @param {Number} height - The height of the viewport.
         *
         * @return {Viewport} The viewport object, for chaining.
         */


        _createClass(Viewport, [{
            key: 'resize',
            value: function resize() {
                var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                if (typeof width !== 'number' || width <= 0) {
                    throw 'Provided `width` of `' + width + '` is invalid';
                }
                if (typeof height !== 'number' || height <= 0) {
                    throw 'Provided `height` of `' + height + '` is invalid';
                }
                this.width = width;
                this.height = height;
                this.gl.canvas.width = width;
                this.gl.canvas.height = height;
                return this;
            }

            /**
             * Sets the viewport dimensions and position. The underlying canvas element is not affected.
             *
             * @param {Number} width - The width override.
             * @param {Number} height - The height override.
             * @param {Number} x - The horizontal offset override.
             * @param {Number} y - The vertical offset override.
             *
             * @return {Viewport} - The viewport object, for chaining.
             */

        }, {
            key: 'push',
            value: function push() {
                var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.width;
                var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.height;

                if (typeof x !== 'number') {
                    throw 'Provided `x` of `' + x + '` is invalid';
                }
                if (typeof y !== 'number') {
                    throw 'Provided `y` of `' + y + '` is invalid';
                }
                if (typeof width !== 'number' || width <= 0) {
                    throw 'Provided `width` of `' + width + '` is invalid';
                }
                if (typeof height !== 'number' || height <= 0) {
                    throw 'Provided `height` of `' + height + '` is invalid';
                }
                // push onto stack
                this.stack.push({
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
                // set viewport
                set(this, x, y, width, height);
                return this;
            }

            /**
             * Pops current the viewport object and sets the viewport beneath it.
             *
             * @return {Viewport} The viewport object, for chaining.
             */

        }, {
            key: 'pop',
            value: function pop() {
                if (this.stack.length === 0) {
                    throw 'Viewport stack is empty';
                }
                this.stack.pop();
                if (this.stack.length > 0) {
                    var top = this.stack[this.stack.length - 1];
                    set(this, top.x, top.y, top.width, top.height);
                } else {
                    set(this);
                }
                return this;
            }
        }]);

        return Viewport;
    }();

    module.exports = Viewport;
})();

},{"./WebGLContext":13}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {

    'use strict';

    var EXTENSIONS = [
    // ratified
    'OES_texture_float', 'OES_texture_half_float', 'WEBGL_lose_context', 'OES_standard_derivatives', 'OES_vertex_array_object', 'WEBGL_debug_renderer_info', 'WEBGL_debug_shaders', 'WEBGL_compressed_texture_s3tc', 'WEBGL_depth_texture', 'OES_element_index_uint', 'EXT_texture_filter_anisotropic', 'EXT_frag_depth', 'WEBGL_draw_buffers', 'ANGLE_instanced_arrays', 'OES_texture_float_linear', 'OES_texture_half_float_linear', 'EXT_blend_minmax', 'EXT_shader_texture_lod',
    // community
    'WEBGL_compressed_texture_atc', 'WEBGL_compressed_texture_pvrtc', 'EXT_color_buffer_half_float', 'WEBGL_color_buffer_float', 'EXT_sRGB', 'WEBGL_compressed_texture_etc1', 'EXT_disjoint_timer_query', 'EXT_color_buffer_float'];

    var _contexts = new Map();

    var _boundContext = null;

    /**
     * Returns an rfc4122 version 4 compliant UUID.
     * @private
     *
     * @return {String} - The UUID string.
     */
    function getUUID() {
        var replace = function replace(c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        };
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replace);
    }

    /**
     * Returns the id of the HTMLCanvasElement element. If there is no id, it generates one and appends it.
     * @private
     *
     * @param {HTMLCanvasElement} canvas - The Canvas object.
     *
     * @return {String} The Canvas id string.
     */
    function getId(canvas) {
        if (!canvas.id) {
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
     * @return {HTMLCanvasElement} The Canvas element object.
     */
    function getCanvas(arg) {
        if (arg instanceof HTMLCanvasElement) {
            return arg;
        } else if (typeof arg === 'string') {
            return document.getElementById(arg) || document.querySelector(arg);
        }
        return null;
    }

    /**
     * Attempts to retrieve a wrapped WebGLRenderingContext.
     * @private
     *
     * @param {HTMLCanvasElement} The Canvas element object to create the context under.
     *
     * @return {Object} The context wrapper.
     */
    function getContextWrapper(arg) {
        if (arg === undefined) {
            if (_boundContext) {
                // return last bound context
                return _boundContext;
            }
        } else {
            var canvas = getCanvas(arg);
            if (canvas) {
                return _contexts.get(getId(canvas));
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
    function loadExtensions(contextWrapper) {
        var gl = contextWrapper.gl;
        EXTENSIONS.forEach(function (id) {
            contextWrapper.extensions.set(id, gl.getExtension(id));
        });
    }

    /**
     * Attempts to create a WebGLRenderingContext and load all extensions.
     * @private
     *
     * @param {HTMLCanvasElement} - The Canvas element object to create the context under.
     * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
     *
     * @return {Object} The context wrapper.
     */
    function createContextWrapper(canvas, options) {
        var gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
        // wrap context
        var contextWrapper = {
            id: getId(canvas),
            gl: gl,
            extensions: new Map()
        };
        // load WebGL extensions
        loadExtensions(contextWrapper);
        // add context wrapper to map
        _contexts.set(getId(canvas), contextWrapper);
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
         * @return {WebGLContext} The namespace, used for chaining.
         */
        bind: function bind(arg) {
            var wrapper = getContextWrapper(arg);
            if (wrapper) {
                _boundContext = wrapper;
                return this;
            }
            throw 'No context exists for provided argument \'' + arg + '\'';
        },

        /**
         * Retrieves an existing WebGL context associated with the provided argument. If no context exists, one is created.
         * During creation attempts to load all extensions found at: https://www.khronos.org/registry/webgl/extensions/.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {Object} options - Parameters to the webgl context, only used during instantiation. Optional.
         *
         * @return {WebGLRenderingContext} The WebGLRenderingContext object.
         */
        get: function get(arg, options) {
            var wrapper = getContextWrapper(arg);
            if (wrapper) {
                // return the native WebGLRenderingContext
                return wrapper.gl;
            }
            // get canvas element
            var canvas = getCanvas(arg);
            // try to find or create context
            if (!canvas) {
                throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
            }
            // create context
            return createContextWrapper(canvas, options).gl;
        },

        /**
         * Removes an existing WebGL context object for the provided or currently bound context object.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
         *
         * @return {WebGLRenderingContext} The WebGLRenderingContext object.
         */
        remove: function remove(arg) {
            var wrapper = getContextWrapper(arg);
            if (wrapper) {
                // delete the context
                _contexts.delete(wrapper.id);
                // remove if currently bound
                if (wrapper === _boundContext) {
                    _boundContext = null;
                }
            } else {
                throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
            }
        },

        /**
         * Returns an array of all supported extensions for the provided or currently bound context object.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         *
         * @return {Array} All supported extensions.
         */
        supportedExtensions: function supportedExtensions(arg) {
            var wrapper = getContextWrapper(arg);
            if (wrapper) {
                var _ret = function () {
                    var extensions = wrapper.extensions;
                    var supported = [];
                    extensions.forEach(function (extension, key) {
                        if (extension) {
                            supported.push(key);
                        }
                    });
                    return {
                        v: supported
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
            throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
        },

        /**
         * Returns an array of all unsupported extensions for the provided or currently bound context object.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         *
         * @return {Array} All unsupported extensions.
         */
        unsupportedExtensions: function unsupportedExtensions(arg) {
            var wrapper = getContextWrapper(arg);
            if (wrapper) {
                var _ret2 = function () {
                    var extensions = wrapper.extensions;
                    var unsupported = [];
                    extensions.forEach(function (extension, key) {
                        if (!extension) {
                            unsupported.push(key);
                        }
                    });
                    return {
                        v: unsupported
                    };
                }();

                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
            }
            throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
        },

        /**
         * Checks if an extension has been successfully loaded for the provided or currently bound context object.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {String} extension - The extension name.
         *
         * @return {boolean} Whether or not the provided extension has been loaded successfully.
         */
        checkExtension: function checkExtension(arg, extension) {
            if (!extension) {
                // shift parameters if no canvas arg is provided
                extension = arg;
                arg = undefined;
            }
            var wrapper = getContextWrapper(arg);
            if (wrapper) {
                var extensions = wrapper.extensions;
                return extensions.get(extension) ? true : false;
            }
            throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
        },

        /**
         * Returns an extension if it has been successfully loaded for the provided or currently bound context object.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {String} extension - The extension name.
         *
         * @return {boolean} Whether or not the provided extension has been loaded successfully.
         */
        getExtension: function getExtension(arg, extension) {
            if (!extension) {
                // shift parameters if no canvas arg is provided
                extension = arg;
                arg = undefined;
            }
            var wrapper = getContextWrapper(arg);
            if (wrapper) {
                var extensions = wrapper.extensions;
                return extensions.get(extension) || null;
            }
            throw 'No context is currently bound or could be associated with provided argument of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
        }
    };
})();

},{}],14:[function(require,module,exports){
'use strict';

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
})();

},{"./core/ColorTexture2D":1,"./core/DepthTexture2D":2,"./core/IndexBuffer":3,"./core/RenderTarget":4,"./core/Renderable":5,"./core/Shader":6,"./core/Texture2D":8,"./core/TextureCubeMap":9,"./core/VertexBuffer":10,"./core/VertexPackage":11,"./core/Viewport":12,"./core/WebGLContext":13}],15:[function(require,module,exports){
'use strict';

(function () {

    'use strict';

    function getIterator(arg) {
        var i = -1;
        var len = void 0;
        if (Array.isArray(arg)) {
            len = arg.length;
            return function () {
                i++;
                return i < len ? i : null;
            };
        }
        var keys = Object.keys(arg);
        len = keys.length;
        return function () {
            i++;
            return i < len ? keys[i] : null;
        };
    }

    function once(fn) {
        return function () {
            if (fn === null) {
                return;
            }
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function each(object, iterator, callback) {
        callback = once(callback);
        var key = void 0;
        var completed = 0;

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            } else if (key === null && completed <= 0) {
                // check if key is null in case iterator isn't exhausted and done
                // was resolved synchronously.
                callback(null);
            }
        }

        var iter = getIterator(object);
        while ((key = iter()) !== null) {
            completed += 1;
            iterator(object[key], key, done);
        }
        if (completed === 0) {
            callback(null);
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
        parallel: function parallel(tasks, callback) {
            var results = Array.isArray(tasks) ? [] : {};
            each(tasks, function (task, key, done) {
                task(function (err, res) {
                    results[key] = res;
                    done(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }

    };
})();

},{}],16:[function(require,module,exports){
'use strict';

(function () {

    'use strict';

    module.exports = {

        /**
         * Sends an GET request create an Image object.
         *
         * @param {Object} options - The XHR options.
         * @param {String} options.url - The URL for the resource.
         * @param {boolean} options.crossOrigin - Enable cross-origin request.
         * @param {Function} options.success - The success callback function.
         * @param {Function} options.error - The error callback function.
         */
        load: function load() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var image = new Image();
            image.onload = function () {
                if (options.success) {
                    options.success(image);
                }
            };
            image.onerror = function (event) {
                if (options.error) {
                    var err = 'Unable to load image from URL: `' + event.path[0].currentSrc + '`';
                    options.error(err);
                }
            };
            image.crossOrigin = options.crossOrigin ? 'anonymous' : undefined;
            image.src = options.url;
        }
    };
})();

},{}],17:[function(require,module,exports){
'use strict';

(function () {

    'use strict';

    var Util = {};

    /**
     * Returns true if the argument is one of the WebGL `texImage2D` overridden
     * canvas types.
     *
     * @param {*} arg - The argument to test.
     *
     * @return {bool} - Whether or not it is a canvas type.
     */
    Util.isCanvasType = function (arg) {
        return arg instanceof ImageData || arg instanceof HTMLImageElement || arg instanceof HTMLCanvasElement || arg instanceof HTMLVideoElement;
    };

    /**
     * Returns true if the texture MUST be a power-of-two. Otherwise return false.
     *
     * @param {Object} spec - The texture specification object.
     *
     * @return {bool} - Whether or not the texture must be a power of two.
     */
    Util.mustBePowerOfTwo = function (spec) {
        // According to:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL#Non_power-of-two_textures
        // N-POT textures cannot be used with mipmapping and they must not "REPEAT"
        return spec.mipMap || spec.wrapS === 'REPEAT' || spec.wrapS === 'MIRRORED_REPEAT' || spec.wrapT === 'REPEAT' || spec.wrapT === 'MIRRORED_REPEAT';
    };

    /**
     * Returns true if the provided integer is a power of two.
     *
     * @param {Number} num - The number to test.
     *
     * @return {boolean} - Whether or not the number is a power of two.
     */
    Util.isPowerOfTwo = function (num) {
        return num !== 0 ? (num & num - 1) === 0 : false;
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
     * @param {Number} num - The number to modify.
     *
     * @return {Number} - Next highest power of two.
     */
    Util.nextHighestPowerOfTwo = function (num) {
        if (num !== 0) {
            num = num - 1;
        }
        num |= num >> 1;
        num |= num >> 2;
        num |= num >> 4;
        num |= num >> 8;
        num |= num >> 16;
        return num + 1;
    };

    /**
     * If the texture must be a POT, resizes and returns the image.
     * @private
     *
     * @param {Object} spec - The texture specification object.
     * @param {HTMLImageElement} img - The image object.
     *
     * @return {HTMLImageElement|HTMLCanvasElement} - The original image, or the resized canvas element.
     */
    Util.resizeCanvas = function (spec, img) {
        if (!Util.mustBePowerOfTwo(spec) || Util.isPowerOfTwo(img.width) && Util.isPowerOfTwo(img.height)) {
            return img;
        }
        // create an empty canvas element
        var canvas = document.createElement('canvas');
        canvas.width = Util.nextHighestPowerOfTwo(img.width);
        canvas.height = Util.nextHighestPowerOfTwo(img.height);
        // copy the image contents to the canvas
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        return canvas;
    };

    module.exports = Util;
})();

},{}],18:[function(require,module,exports){
'use strict';

(function () {

    'use strict';

    module.exports = {

        /**
         * Sends an XMLHttpRequest GET request to the supplied url.
         *
         * @param {Object} options - The XHR options.
         * @param {String} options.url - The URL for the resource.
         * @param {boolean} options.crossOrigin - Enable cross-origin request.
         * @param {Function} options.success - The success callback function.
         * @param {Function} options.error - The error callback function.
         * @param {Function} options.responseType - The responseType of the XHR.
         */
        load: function load(options) {
            var request = new XMLHttpRequest();
            request.open('GET', options.url, true);
            request.responseType = options.responseType;
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        if (options.success) {
                            options.success(request.response);
                        }
                    } else {
                        if (options.error) {
                            options.error('GET ' + request.responseURL + ' ' + request.status + ' (' + request.statusText + ')');
                        }
                    }
                }
            };
            request.withCredentials = options.crossOrigin ? true : false;
            request.send();
        }
    };
})();

},{}]},{},[14])(14)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db2xvclRleHR1cmUyRC5qcyIsInNyYy9jb3JlL0RlcHRoVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvSW5kZXhCdWZmZXIuanMiLCJzcmMvY29yZS9SZW5kZXJUYXJnZXQuanMiLCJzcmMvY29yZS9SZW5kZXJhYmxlLmpzIiwic3JjL2NvcmUvU2hhZGVyLmpzIiwic3JjL2NvcmUvU2hhZGVyUGFyc2VyLmpzIiwic3JjL2NvcmUvVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvVGV4dHVyZUN1YmVNYXAuanMiLCJzcmMvY29yZS9WZXJ0ZXhCdWZmZXIuanMiLCJzcmMvY29yZS9WZXJ0ZXhQYWNrYWdlLmpzIiwic3JjL2NvcmUvVmlld3BvcnQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHQuanMiLCJzcmMvZXhwb3J0cy5qcyIsInNyYy91dGlsL0FzeW5jLmpzIiwic3JjL3V0aWwvSW1hZ2VMb2FkZXIuanMiLCJzcmMvdXRpbC9VdGlsLmpzIiwic3JjL3V0aWwvWEhSTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQyxhQUFXOztBQUVSOztBQUVBLFFBQU0sWUFBWSxRQUFRLGFBQVIsQ0FBbEI7QUFDQSxRQUFNLGNBQWMsUUFBUSxxQkFBUixDQUFwQjtBQUNBLFFBQU0sT0FBTyxRQUFRLGNBQVIsQ0FBYjs7QUFFQSxRQUFNLGNBQWM7QUFDaEIsaUJBQVMsSUFETztBQUVoQixnQkFBUTtBQUZRLEtBQXBCO0FBSUEsUUFBTSxjQUFjO0FBQ2hCLGlCQUFTLElBRE87QUFFaEIsZ0JBQVEsSUFGUTtBQUdoQixnQ0FBd0IsSUFIUjtBQUloQiwrQkFBdUIsSUFKUDtBQUtoQiwrQkFBdUIsSUFMUDtBQU1oQiw4QkFBc0I7QUFOTixLQUFwQjtBQVFBLFFBQU0sYUFBYTtBQUNmLGdCQUFRLElBRE87QUFFZix5QkFBaUIsSUFGRjtBQUdmLHVCQUFlO0FBSEEsS0FBbkI7QUFLQSxRQUFNLFFBQVE7QUFDVix1QkFBZSxJQURMO0FBRVYsZUFBTztBQUZHLEtBQWQ7QUFJQSxRQUFNLFVBQVU7QUFDWixhQUFLLElBRE87QUFFWixjQUFNO0FBRk0sS0FBaEI7O0FBS0E7OztBQUdBLFFBQU0sZUFBZSxlQUFyQjs7QUFFQTs7O0FBR0EsUUFBTSxpQkFBaUIsTUFBdkI7O0FBRUE7OztBQUdBLFFBQU0sZUFBZSxRQUFyQjs7QUFFQTs7O0FBR0EsUUFBTSxpQkFBaUIsUUFBdkI7O0FBRUE7OztBQUdBLFFBQU0sNEJBQTRCLElBQWxDOztBQUVBOzs7QUFHQSxRQUFNLGlCQUFpQixJQUF2Qjs7QUFFQTs7O0FBR0EsUUFBTSxtQkFBbUIsSUFBekI7O0FBRUE7Ozs7OztBQXJFUSxRQTBFRixjQTFFRTtBQUFBOztBQTRFSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxrQ0FBd0M7QUFBQSxnQkFBNUIsSUFBNEIsdUVBQXJCLEVBQXFCO0FBQUEsZ0JBQWpCLFFBQWlCLHVFQUFOLElBQU07O0FBQUE7O0FBQ3BDO0FBQ0EsaUJBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxJQUFjLEtBQUssSUFBaEM7QUFDQSxpQkFBSyxLQUFMLEdBQWEsS0FBSyxLQUFMLElBQWMsS0FBSyxJQUFoQztBQUNBLGlCQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLEtBQUssTUFBeEM7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxJQUFrQixLQUFLLE1BQXhDO0FBQ0E7QUFDQSxpQkFBSyxLQUFMLEdBQWEsV0FBVyxLQUFLLEtBQWhCLElBQXlCLEtBQUssS0FBOUIsR0FBc0MsWUFBbkQ7QUFDQSxpQkFBSyxLQUFMLEdBQWEsV0FBVyxLQUFLLEtBQWhCLElBQXlCLEtBQUssS0FBOUIsR0FBc0MsWUFBbkQ7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLFlBQVksS0FBSyxTQUFqQixJQUE4QixLQUFLLFNBQW5DLEdBQStDLGNBQWhFO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixZQUFZLEtBQUssU0FBakIsSUFBOEIsS0FBSyxTQUFuQyxHQUErQyxjQUFoRTtBQUNBO0FBQ0EsaUJBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxLQUFnQixTQUFoQixHQUE0QixLQUFLLE1BQWpDLEdBQTBDLGNBQXhEO0FBQ0EsaUJBQUssT0FBTCxHQUFlLEtBQUssT0FBTCxLQUFpQixTQUFqQixHQUE2QixLQUFLLE9BQWxDLEdBQTRDLGdCQUEzRDtBQUNBLGlCQUFLLGdCQUFMLEdBQXdCLEtBQUssZ0JBQUwsS0FBMEIsU0FBMUIsR0FBc0MsS0FBSyxnQkFBM0MsR0FBOEQseUJBQXRGO0FBQ0E7QUFDQSxpQkFBSyxNQUFMLEdBQWMsUUFBUSxLQUFLLE1BQWIsSUFBdUIsS0FBSyxNQUE1QixHQUFxQyxjQUFuRDtBQUNBO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLEdBQVosS0FBb0IsUUFBeEIsRUFBa0M7QUFDOUI7QUFDQSxxQkFBSyxJQUFMLEdBQVksZUFBWjtBQUNBOztBQUVBO0FBTDhCLDRJQUl4QixJQUp3Qjs7QUFNOUIsNEJBQVksSUFBWixDQUFpQjtBQUNiLHlCQUFLLEtBQUssR0FERztBQUViLDZCQUFTLHdCQUFTO0FBQ2Q7QUFDQSxnQ0FBUSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsS0FBeEIsQ0FBUjtBQUNBO0FBQ0EsOEJBQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixLQUFLLEtBQTVCLEVBQW1DLEtBQUssTUFBeEM7QUFDQSw4QkFBSyxhQUFMO0FBQ0E7QUFDQSw0QkFBSSxRQUFKLEVBQWM7QUFDVixxQ0FBUyxJQUFUO0FBQ0g7QUFDSixxQkFaWTtBQWFiLDJCQUFPLG9CQUFPO0FBQ1YsNEJBQUksUUFBSixFQUFjO0FBQ1YscUNBQVMsR0FBVCxFQUFjLElBQWQ7QUFDSDtBQUNKO0FBakJZLGlCQUFqQjtBQW1CSCxhQXpCRCxNQXlCTyxJQUFJLEtBQUssWUFBTCxDQUFrQixLQUFLLEdBQXZCLENBQUosRUFBaUM7QUFDcEM7QUFDQTtBQUNBLHFCQUFLLElBQUwsR0FBWSxlQUFaO0FBQ0EscUJBQUssR0FBTCxHQUFXLEtBQUssWUFBTCxDQUFrQixJQUFsQixFQUF3QixLQUFLLEdBQTdCLENBQVg7QUFDQTs7QUFMb0MsNElBTTlCLElBTjhCO0FBT3ZDLGFBUE0sTUFPQTtBQUNIO0FBQ0Esb0JBQUksS0FBSyxHQUFMLEtBQWEsU0FBYixJQUEwQixLQUFLLEdBQUwsS0FBYSxJQUEzQyxFQUFpRDtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQUssTUFBTCxHQUFjLEtBQWQ7QUFDSDtBQUNEO0FBQ0EscUJBQUssSUFBTCxHQUFZLE1BQU0sS0FBSyxJQUFYLElBQW1CLEtBQUssSUFBeEIsR0FBK0IsWUFBM0M7QUFDQTs7QUFaRyw0SUFhRyxJQWJIO0FBY047QUFoRW1DO0FBaUV2Qzs7QUFuS0c7QUFBQSxNQTBFcUIsU0ExRXJCOztBQXNLUixXQUFPLE9BQVAsR0FBaUIsY0FBakI7QUFFSCxDQXhLQSxHQUFEOzs7Ozs7Ozs7OztBQ0FDLGFBQVc7O0FBRVI7O0FBRUEsUUFBTSxZQUFZLFFBQVEsYUFBUixDQUFsQjs7QUFFQSxRQUFNLGNBQWM7QUFDaEIsaUJBQVMsSUFETztBQUVoQixnQkFBUTtBQUZRLEtBQXBCO0FBSUEsUUFBTSxjQUFjO0FBQ2hCLGlCQUFTLElBRE87QUFFaEIsZ0JBQVE7QUFGUSxLQUFwQjtBQUlBLFFBQU0sYUFBYTtBQUNmLGdCQUFRLElBRE87QUFFZix1QkFBZSxJQUZBO0FBR2YseUJBQWlCO0FBSEYsS0FBbkI7QUFLQSxRQUFNLGNBQWM7QUFDaEIsdUJBQWUsSUFEQztBQUVoQix3QkFBZ0IsSUFGQTtBQUdoQixzQkFBYztBQUhFLEtBQXBCO0FBS0EsUUFBTSxVQUFVO0FBQ1oseUJBQWlCLElBREw7QUFFWix1QkFBZTtBQUZILEtBQWhCOztBQUtBOzs7QUFHQSxRQUFNLGVBQWUsY0FBckI7O0FBRUE7OztBQUdBLFFBQU0saUJBQWlCLGlCQUF2Qjs7QUFFQTs7O0FBR0EsUUFBTSxlQUFlLGVBQXJCOztBQUVBOzs7QUFHQSxRQUFNLGlCQUFpQixRQUF2Qjs7QUFFQTs7Ozs7O0FBakRRLFFBc0RGLGNBdERFO0FBQUE7O0FBd0RKOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLGtDQUF1QjtBQUFBLGdCQUFYLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDbkI7QUFDQSxpQkFBSyxLQUFMLEdBQWEsS0FBSyxLQUFMLElBQWMsS0FBSyxJQUFoQztBQUNBLGlCQUFLLEtBQUwsR0FBYSxLQUFLLEtBQUwsSUFBYyxLQUFLLElBQWhDO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsSUFBa0IsS0FBSyxNQUF4QztBQUNBLGlCQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLEtBQUssTUFBeEM7QUFDQTtBQUNBLGlCQUFLLEtBQUwsR0FBYSxXQUFXLEtBQUssS0FBaEIsSUFBeUIsS0FBSyxLQUE5QixHQUFzQyxZQUFuRDtBQUNBLGlCQUFLLEtBQUwsR0FBYSxXQUFXLEtBQUssS0FBaEIsSUFBeUIsS0FBSyxLQUE5QixHQUFzQyxZQUFuRDtBQUNBLGlCQUFLLFNBQUwsR0FBaUIsWUFBWSxLQUFLLFNBQWpCLElBQThCLEtBQUssU0FBbkMsR0FBK0MsY0FBaEU7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLFlBQVksS0FBSyxTQUFqQixJQUE4QixLQUFLLFNBQW5DLEdBQStDLGNBQWhFO0FBQ0E7QUFDQSxpQkFBSyxNQUFMLEdBQWMsS0FBZCxDQVptQixDQVlFO0FBQ3JCLGlCQUFLLE9BQUwsR0FBZSxLQUFmLENBYm1CLENBYUc7QUFDdEIsaUJBQUssZ0JBQUwsR0FBd0IsS0FBeEIsQ0FkbUIsQ0FjWTtBQUMvQixpQkFBSyxNQUFMLEdBQWMsUUFBUSxLQUFLLE1BQWIsSUFBdUIsS0FBSyxNQUE1QixHQUFxQyxjQUFuRDtBQUNBO0FBQ0EsZ0JBQUksS0FBSyxNQUFMLEtBQWdCLGVBQXBCLEVBQXFDO0FBQ2pDLHFCQUFLLElBQUwsR0FBWSx5QkFBWjtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLLElBQUwsR0FBWSxZQUFZLEtBQUssSUFBakIsSUFBeUIsS0FBSyxJQUE5QixHQUFxQyxZQUFqRDtBQUNIO0FBQ0Q7QUF0Qm1CLG1JQXVCYixJQXZCYTtBQXdCdEI7O0FBaEdHO0FBQUEsTUFzRHFCLFNBdERyQjs7QUFtR1IsV0FBTyxPQUFQLEdBQWlCLGNBQWpCO0FBRUgsQ0FyR0EsR0FBRDs7Ozs7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxRQUFNLGVBQWUsUUFBUSxnQkFBUixDQUFyQjs7QUFFQSxRQUFNLFFBQVE7QUFDVix1QkFBZSxJQURMO0FBRVYsd0JBQWdCLElBRk47QUFHVixzQkFBYztBQUhKLEtBQWQ7QUFLQSxRQUFNLFFBQVE7QUFDVixnQkFBUSxJQURFO0FBRVYsZUFBTyxJQUZHO0FBR1Ysb0JBQVksSUFIRjtBQUlWLG1CQUFXLElBSkQ7QUFLVixtQkFBVyxJQUxEO0FBTVYsd0JBQWdCLElBTk47QUFPVixzQkFBYztBQVBKLEtBQWQ7QUFTQSxRQUFNLGlCQUFpQjtBQUNuQix1QkFBZSxDQURJO0FBRW5CLHdCQUFnQixDQUZHO0FBR25CLHNCQUFjO0FBSEssS0FBdkI7O0FBTUE7OztBQUdBLFFBQU0sZUFBZSxnQkFBckI7O0FBRUE7OztBQUdBLFFBQU0sZUFBZSxXQUFyQjs7QUFFQTs7O0FBR0EsUUFBTSxzQkFBc0IsQ0FBNUI7O0FBRUE7OztBQUdBLFFBQU0sZ0JBQWdCLENBQXRCOztBQUVBOzs7OztBQTlDUSxRQWtERixXQWxERTs7QUFvREo7Ozs7Ozs7OztBQVNBLDZCQUFZLEdBQVosRUFBK0I7QUFBQSxnQkFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQzNCLGlCQUFLLEVBQUwsR0FBVSxhQUFhLEdBQWIsRUFBVjtBQUNBLGlCQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsaUJBQUssSUFBTCxHQUFZLE1BQU0sUUFBUSxJQUFkLElBQXNCLFFBQVEsSUFBOUIsR0FBcUMsWUFBakQ7QUFDQSxpQkFBSyxJQUFMLEdBQVksTUFBTSxRQUFRLElBQWQsSUFBc0IsUUFBUSxJQUE5QixHQUFxQyxZQUFqRDtBQUNBLGlCQUFLLEtBQUwsR0FBYyxRQUFRLEtBQVIsS0FBa0IsU0FBbkIsR0FBZ0MsUUFBUSxLQUF4QyxHQUFnRCxhQUE3RDtBQUNBLGlCQUFLLFVBQUwsR0FBbUIsUUFBUSxVQUFSLEtBQXVCLFNBQXhCLEdBQXFDLFFBQVEsVUFBN0MsR0FBMEQsbUJBQTVFO0FBQ0EsaUJBQUssVUFBTCxHQUFrQixDQUFsQjtBQUNBLGdCQUFJLEdBQUosRUFBUztBQUNMLG9CQUFJLGVBQWUsV0FBbkIsRUFBZ0M7QUFDNUI7QUFDQSx3QkFBSSxRQUFRLFVBQVIsS0FBdUIsU0FBM0IsRUFBc0M7QUFDbEMsOEJBQU0sOEZBQU47QUFDSDtBQUNELHlCQUFLLFVBQUwsR0FBa0IsUUFBUSxVQUExQjtBQUNBLHlCQUFLLE1BQUwsR0FBYyxHQUFkO0FBQ0gsaUJBUEQsTUFPTyxJQUFJLE9BQU8sU0FBUCxDQUFpQixHQUFqQixDQUFKLEVBQTJCO0FBQzlCO0FBQ0Esd0JBQUksUUFBUSxJQUFSLEtBQWlCLFNBQXJCLEVBQWdDO0FBQzVCLDhCQUFNLG9GQUFOO0FBQ0g7QUFDRCx5QkFBSyxVQUFMLENBQWdCLEdBQWhCO0FBQ0gsaUJBTk0sTUFNQSxJQUFJLGVBQWUsV0FBbkIsRUFBZ0M7QUFDbkM7QUFDQSx3QkFBSSxRQUFRLElBQVIsS0FBaUIsU0FBckIsRUFBZ0M7QUFDNUIsOEJBQU0seUZBQU47QUFDSDtBQUNELHlCQUFLLFVBQUwsQ0FBZ0IsR0FBaEI7QUFDSCxpQkFOTSxNQU1BO0FBQ0g7QUFDQSx5QkFBSyxVQUFMLENBQWdCLEdBQWhCO0FBQ0g7QUFDSixhQXhCRCxNQXdCTztBQUNILG9CQUFJLFFBQVEsSUFBUixLQUFpQixTQUFyQixFQUFnQztBQUM1QiwwQkFBTSx1RUFBTjtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBcEdJO0FBQUE7QUFBQSx1Q0EyR08sR0EzR1AsRUEyR1k7QUFDWixvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQTtBQUNBLG9CQUFJLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUNwQjtBQUNBLHdCQUFJLEtBQUssSUFBTCxLQUFjLGNBQWxCLEVBQWtDO0FBQzlCO0FBQ0EsOEJBQU0sSUFBSSxXQUFKLENBQWdCLEdBQWhCLENBQU47QUFDSCxxQkFIRCxNQUdPLElBQUksS0FBSyxJQUFMLEtBQWMsZ0JBQWxCLEVBQW9DO0FBQ3ZDO0FBQ0EsOEJBQU0sSUFBSSxXQUFKLENBQWdCLEdBQWhCLENBQU47QUFDSCxxQkFITSxNQUdBO0FBQ0g7QUFDQSw4QkFBTSxJQUFJLFVBQUosQ0FBZSxHQUFmLENBQU47QUFDSDtBQUNKLGlCQVpELE1BWU87QUFDSDtBQUNBLHdCQUFJLGVBQWUsV0FBbkIsRUFBZ0M7QUFDNUIsNkJBQUssSUFBTCxHQUFZLGNBQVo7QUFDSCxxQkFGRCxNQUVPLElBQUksZUFBZSxXQUFuQixFQUFnQztBQUNuQyw2QkFBSyxJQUFMLEdBQVksZ0JBQVo7QUFDSCxxQkFGTSxNQUVBLElBQUksZUFBZSxVQUFuQixFQUErQjtBQUNsQyw2QkFBSyxJQUFMLEdBQVksZUFBWjtBQUNILHFCQUZNLE1BRUEsSUFDSCxFQUFFLGVBQWUsV0FBakIsS0FDQSxDQUFFLE9BQU8sU0FBUCxDQUFpQixHQUFqQixDQUZDLEVBR0Q7QUFDRiw4QkFBTSxpRkFBTjtBQUNIO0FBQ0o7QUFDRDtBQUNBLG9CQUFJLEtBQUssSUFBTCxLQUFjLGNBQWQsSUFDQSxDQUFDLGFBQWEsY0FBYixDQUE0Qix3QkFBNUIsQ0FETCxFQUM0RDtBQUN4RCwwQkFBTSx5R0FBTjtBQUNIO0FBQ0Q7QUFDQSxvQkFBSSxLQUFLLEtBQUwsS0FBZSxhQUFuQixFQUFrQztBQUM5Qix3QkFBSSxPQUFPLFNBQVAsQ0FBaUIsR0FBakIsQ0FBSixFQUEyQjtBQUN2Qiw2QkFBSyxLQUFMLEdBQWMsTUFBTSxlQUFlLEtBQUssSUFBcEIsQ0FBcEI7QUFDSCxxQkFGRCxNQUVPO0FBQ0gsNkJBQUssS0FBTCxHQUFhLElBQUksTUFBakI7QUFDSDtBQUNKO0FBQ0Q7QUFDQSxvQkFBSSxPQUFPLFNBQVAsQ0FBaUIsR0FBakIsQ0FBSixFQUEyQjtBQUN2Qix5QkFBSyxVQUFMLEdBQWtCLEdBQWxCO0FBQ0gsaUJBRkQsTUFFTztBQUNILHlCQUFLLFVBQUwsR0FBa0IsSUFBSSxVQUF0QjtBQUNIO0FBQ0Q7QUFDQSxvQkFBSSxDQUFDLEtBQUssTUFBVixFQUFrQjtBQUNkLHlCQUFLLE1BQUwsR0FBYyxHQUFHLFlBQUgsRUFBZDtBQUNIO0FBQ0Q7QUFDQSxtQkFBRyxVQUFILENBQWMsR0FBRyxvQkFBakIsRUFBdUMsS0FBSyxNQUE1QztBQUNBLG1CQUFHLFVBQUgsQ0FBYyxHQUFHLG9CQUFqQixFQUF1QyxHQUF2QyxFQUE0QyxHQUFHLFdBQS9DO0FBQ0EsdUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7QUF0S0k7QUFBQTtBQUFBLDBDQThLVSxLQTlLVixFQThLbUQ7QUFBQSxvQkFBbEMsVUFBa0MsdUVBQXJCLG1CQUFxQjs7QUFDbkQsb0JBQU0sS0FBSyxLQUFLLEVBQWhCO0FBQ0Esb0JBQUksQ0FBQyxLQUFLLE1BQVYsRUFBa0I7QUFDZCwwQkFBTSwrREFBTjtBQUNIO0FBQ0Q7QUFDQSxvQkFBSSxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQUosRUFBMEI7QUFDdEI7QUFDQSx3QkFBSSxLQUFLLElBQUwsS0FBYyxjQUFsQixFQUFrQztBQUM5QjtBQUNBLGdDQUFRLElBQUksV0FBSixDQUFnQixLQUFoQixDQUFSO0FBQ0gscUJBSEQsTUFHTyxJQUFJLEtBQUssSUFBTCxLQUFjLGdCQUFsQixFQUFvQztBQUN2QztBQUNBLGdDQUFRLElBQUksV0FBSixDQUFnQixLQUFoQixDQUFSO0FBQ0gscUJBSE0sTUFHQTtBQUNIO0FBQ0EsZ0NBQVEsSUFBSSxVQUFKLENBQWUsS0FBZixDQUFSO0FBQ0g7QUFDSixpQkFaRCxNQVlPLElBQ0gsRUFBRSxpQkFBaUIsVUFBbkIsS0FDQSxFQUFFLGlCQUFpQixXQUFuQixDQURBLElBRUEsRUFBRSxpQkFBaUIsV0FBbkIsQ0FGQSxJQUdBLEVBQUUsaUJBQWlCLFdBQW5CLENBSkcsRUFJOEI7QUFDakMsMEJBQU0sdUVBQU47QUFDSDtBQUNEO0FBQ0Esb0JBQUksYUFBYSxNQUFNLFVBQW5CLEdBQWdDLEtBQUssVUFBekMsRUFBcUQ7QUFDakQsMEJBQU0sd0JBQXNCLE1BQU0sVUFBNUIsb0NBQ1csVUFEWCxxREFFVyxLQUFLLFVBRmhCLFlBQU47QUFHSDtBQUNELG1CQUFHLFVBQUgsQ0FBYyxHQUFHLG9CQUFqQixFQUF1QyxLQUFLLE1BQTVDO0FBQ0EsbUJBQUcsYUFBSCxDQUFpQixHQUFHLG9CQUFwQixFQUEwQyxVQUExQyxFQUFzRCxLQUF0RDtBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7QUFsTkk7QUFBQTtBQUFBLG1DQTROZTtBQUFBLG9CQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFDZixvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSxvQkFBTSxPQUFPLEdBQUcsUUFBUSxJQUFSLElBQWdCLEtBQUssSUFBeEIsQ0FBYjtBQUNBLG9CQUFNLE9BQU8sR0FBRyxLQUFLLElBQVIsQ0FBYjtBQUNBLG9CQUFNLGFBQWMsUUFBUSxVQUFSLEtBQXVCLFNBQXhCLEdBQXFDLFFBQVEsVUFBN0MsR0FBMEQsS0FBSyxVQUFsRjtBQUNBLG9CQUFNLFFBQVMsUUFBUSxLQUFSLEtBQWtCLFNBQW5CLEdBQWdDLFFBQVEsS0FBeEMsR0FBZ0QsS0FBSyxLQUFuRTtBQUNBLG9CQUFJLFVBQVUsQ0FBZCxFQUFpQjtBQUNiLDBCQUFNLHNDQUFOO0FBQ0g7QUFDRDtBQUNBLG1CQUFHLFVBQUgsQ0FBYyxHQUFHLG9CQUFqQixFQUF1QyxLQUFLLE1BQTVDO0FBQ0E7QUFDQSxtQkFBRyxZQUFILENBQWdCLElBQWhCLEVBQXNCLEtBQXRCLEVBQTZCLElBQTdCLEVBQW1DLFVBQW5DO0FBQ0E7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUEzT0c7O0FBQUE7QUFBQTs7QUE4T1IsV0FBTyxPQUFQLEdBQWlCLFdBQWpCO0FBRUgsQ0FoUEEsR0FBRDs7Ozs7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxRQUFNLGVBQWUsUUFBUSxnQkFBUixDQUFyQjs7QUFFQSxRQUFNLGtCQUFrQjtBQUNwQixvQkFBWSxJQURRO0FBRXBCLDBCQUFrQjtBQUZFLEtBQXhCOztBQUtBLFFBQU0sZ0JBQWdCO0FBQ2xCLHlCQUFpQixJQURDO0FBRWxCLHVCQUFlO0FBRkcsS0FBdEI7O0FBS0E7Ozs7O0FBaEJRLFFBb0JGLFlBcEJFOztBQXNCSjs7O0FBR0MsZ0NBQWM7QUFBQTs7QUFDWCxpQkFBSyxFQUFMLEdBQVUsYUFBYSxHQUFiLEVBQVY7QUFDQSxpQkFBSyxXQUFMLEdBQW1CLEtBQUssRUFBTCxDQUFRLGlCQUFSLEVBQW5CO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixJQUFJLEdBQUosRUFBaEI7QUFDSDs7QUFFRDs7Ozs7OztBQS9CSTtBQUFBO0FBQUEsbUNBb0NHO0FBQ0g7QUFDQSxvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSxtQkFBRyxlQUFILENBQW1CLEdBQUcsV0FBdEIsRUFBbUMsS0FBSyxXQUF4QztBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7O0FBM0NJO0FBQUE7QUFBQSxxQ0FnREs7QUFDTDtBQUNBLG9CQUFNLEtBQUssS0FBSyxFQUFoQjtBQUNBLG1CQUFHLGVBQUgsQ0FBbUIsR0FBRyxXQUF0QixFQUFtQyxJQUFuQztBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7OztBQXZESTtBQUFBO0FBQUEsMkNBZ0VXLE9BaEVYLEVBZ0VvQixLQWhFcEIsRUFnRTJCLE1BaEUzQixFQWdFbUM7QUFDbkMsb0JBQU0sS0FBSyxLQUFLLEVBQWhCO0FBQ0Esb0JBQUksQ0FBQyxPQUFMLEVBQWM7QUFDViwwQkFBTSw2QkFBTjtBQUNIO0FBQ0Qsb0JBQUksZ0JBQWdCLEtBQWhCLEtBQTBCLFdBQVcsU0FBekMsRUFBb0Q7QUFDaEQsNkJBQVMsS0FBVDtBQUNBLDRCQUFRLENBQVI7QUFDSDtBQUNELG9CQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUNyQiw0QkFBUSxDQUFSO0FBQ0gsaUJBRkQsTUFFTyxJQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLEtBQWpCLENBQUQsSUFBNEIsUUFBUSxDQUF4QyxFQUEyQztBQUM5QywwQkFBTSwyQ0FBTjtBQUNIO0FBQ0Qsb0JBQUksVUFBVSxDQUFDLGdCQUFnQixNQUFoQixDQUFmLEVBQXdDO0FBQ3BDLDBCQUFNLDJCQUFOO0FBQ0g7QUFDRCxxQkFBSyxRQUFMLENBQWMsR0FBZCxZQUEyQixLQUEzQixFQUFvQyxPQUFwQztBQUNBLHFCQUFLLElBQUw7QUFDQSxtQkFBRyxvQkFBSCxDQUNJLEdBQUcsV0FEUCxFQUVJLEdBQUcscUJBQXFCLEtBQXhCLENBRkosRUFHSSxHQUFHLFVBQVUsWUFBYixDQUhKLEVBSUksUUFBUSxPQUpaLEVBS0ksQ0FMSjtBQU1BLHFCQUFLLE1BQUw7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBN0ZJO0FBQUE7QUFBQSwyQ0FvR1csT0FwR1gsRUFvR29CO0FBQ3BCLG9CQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1YsMEJBQU0sNkJBQU47QUFDSDtBQUNELG9CQUFJLENBQUMsY0FBYyxRQUFRLE1BQXRCLENBQUwsRUFBb0M7QUFDaEMsMEJBQU0sd0VBQU47QUFDSDtBQUNELG9CQUFNLEtBQUssS0FBSyxFQUFoQjtBQUNBLHFCQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLE9BQWxCLEVBQTJCLE9BQTNCO0FBQ0EscUJBQUssSUFBTDtBQUNBLG1CQUFHLG9CQUFILENBQ0ksR0FBRyxXQURQLEVBRUksR0FBRyxnQkFGUCxFQUdJLEdBQUcsVUFIUCxFQUlJLFFBQVEsT0FKWixFQUtJLENBTEo7QUFNQSxxQkFBSyxNQUFMO0FBQ0EsdUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7QUF4SEk7QUFBQTtBQUFBLG1DQWdJRyxLQWhJSCxFQWdJVSxNQWhJVixFQWdJa0I7QUFDbEIsb0JBQUksT0FBTyxLQUFQLEtBQWlCLFFBQWpCLElBQThCLFNBQVMsQ0FBM0MsRUFBK0M7QUFDM0MsbURBQStCLEtBQS9CO0FBQ0g7QUFDRCxvQkFBSSxPQUFPLE1BQVAsS0FBa0IsUUFBbEIsSUFBK0IsVUFBVSxDQUE3QyxFQUFpRDtBQUM3QyxvREFBZ0MsTUFBaEM7QUFDSDtBQUNELHFCQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLG1CQUFXO0FBQzdCLDRCQUFRLE1BQVIsQ0FBZSxLQUFmLEVBQXNCLE1BQXRCO0FBQ0gsaUJBRkQ7QUFHQSx1QkFBTyxJQUFQO0FBQ0g7QUEzSUc7O0FBQUE7QUFBQTs7QUE4SVIsV0FBTyxPQUFQLEdBQWlCLFlBQWpCO0FBRUgsQ0FoSkEsR0FBRDs7Ozs7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxRQUFNLGdCQUFnQixRQUFRLHVCQUFSLENBQXRCO0FBQ0EsUUFBTSxlQUFlLFFBQVEsc0JBQVIsQ0FBckI7QUFDQSxRQUFNLGNBQWMsUUFBUSxxQkFBUixDQUFwQjs7QUFFQTs7Ozs7OztBQU9BLGFBQVMsdUJBQVQsQ0FBaUMsYUFBakMsRUFBZ0Q7QUFDNUMsWUFBSSxRQUFRLElBQVo7QUFDQSxzQkFBYyxPQUFkLENBQXNCLGtCQUFVO0FBQzVCLGdCQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNoQix3QkFBUSxPQUFPLEtBQWY7QUFDSCxhQUZELE1BRU87QUFDSCxvQkFBSSxVQUFVLE9BQU8sS0FBckIsRUFBNEI7QUFDeEIsMEJBQU0seUdBRUMsS0FGRCxhQUVjLE9BQU8sS0FGckIsWUFBTjtBQUdIO0FBQ0o7QUFDSixTQVZEO0FBV0g7O0FBRUQ7Ozs7Ozs7QUFPQSxhQUFTLG9CQUFULENBQThCLGFBQTlCLEVBQTZDO0FBQ3pDLFlBQU0sVUFBVSxJQUFJLEdBQUosRUFBaEI7QUFDQSxzQkFBYyxPQUFkLENBQXNCLGtCQUFVO0FBQzVCLG1CQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsQ0FBd0IsVUFBQyxPQUFELEVBQVUsS0FBVixFQUFvQjtBQUN4QyxvQkFBTSxRQUFRLFFBQVEsR0FBUixDQUFZLEtBQVosS0FBc0IsQ0FBcEM7QUFDQSx3QkFBUSxHQUFSLENBQVksS0FBWixFQUFtQixRQUFRLENBQTNCO0FBQ0gsYUFIRDtBQUlILFNBTEQ7QUFNQSxnQkFBUSxPQUFSLENBQWdCLGlCQUFTO0FBQ3JCLGdCQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ1gsNkVBQTRELEtBQTVEO0FBQ0g7QUFDSixTQUpEO0FBS0g7O0FBRUQ7Ozs7O0FBcERRLFFBd0RGLFVBeERFOztBQTBESjs7Ozs7Ozs7OztBQVVBLDhCQUF1QjtBQUFBLGdCQUFYLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDbkIsZ0JBQUksS0FBSyxZQUFMLElBQXFCLEtBQUssYUFBOUIsRUFBNkM7QUFDekM7QUFDQSxxQkFBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxJQUFzQixDQUFDLEtBQUssWUFBTixDQUEzQztBQUNILGFBSEQsTUFHTyxJQUFJLEtBQUssUUFBVCxFQUFtQjtBQUN0QjtBQUNBLG9CQUFNLGdCQUFnQixJQUFJLGFBQUosQ0FBa0IsS0FBSyxRQUF2QixDQUF0QjtBQUNBO0FBQ0EscUJBQUssYUFBTCxHQUFxQixDQUNqQixJQUFJLFlBQUosQ0FBaUIsYUFBakIsQ0FEaUIsQ0FBckI7QUFHSCxhQVBNLE1BT0E7QUFDSCxxQkFBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0g7QUFDRCxnQkFBSSxLQUFLLFdBQVQsRUFBc0I7QUFDbEI7QUFDQSxxQkFBSyxXQUFMLEdBQW1CLEtBQUssV0FBeEI7QUFDSCxhQUhELE1BR08sSUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDckI7QUFDQSxxQkFBSyxXQUFMLEdBQW1CLElBQUksV0FBSixDQUFnQixLQUFLLE9BQXJCLENBQW5CO0FBQ0gsYUFITSxNQUdBO0FBQ0gscUJBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNIO0FBQ0Q7QUFDQTtBQUNBLGdCQUFJLENBQUMsS0FBSyxXQUFWLEVBQXVCO0FBQ25CLHdDQUF3QixLQUFLLGFBQTdCO0FBQ0g7QUFDRDtBQUNBLGlDQUFxQixLQUFLLGFBQTFCO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7QUFwR0k7QUFBQTtBQUFBLG1DQStHZTtBQUFBLG9CQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFDZjtBQUNBLG9CQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNsQjtBQUNBO0FBQ0EseUJBQUssYUFBTCxDQUFtQixPQUFuQixDQUEyQix3QkFBZ0I7QUFDdkMscUNBQWEsSUFBYjtBQUNILHFCQUZEO0FBR0E7QUFDQSx5QkFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLE9BQXRCO0FBQ0E7QUFDQSx5QkFBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLHdCQUFnQjtBQUN2QyxxQ0FBYSxNQUFiO0FBQ0gscUJBRkQ7QUFHQTtBQUNILGlCQWJELE1BYU87QUFDSDtBQUNBO0FBQ0EseUJBQUssYUFBTCxDQUFtQixPQUFuQixDQUEyQix3QkFBZ0I7QUFDdkMscUNBQWEsSUFBYjtBQUNILHFCQUZEO0FBR0Esd0JBQUksS0FBSyxhQUFMLENBQW1CLE1BQW5CLEdBQTRCLENBQWhDLEVBQW1DO0FBQy9CO0FBQ0EsNkJBQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixJQUF0QixDQUEyQixPQUEzQjtBQUNIO0FBQ0Q7QUFDQSx5QkFBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLHdCQUFnQjtBQUN2QyxxQ0FBYSxNQUFiO0FBQ0gscUJBRkQ7QUFHSDtBQUNELHVCQUFPLElBQVA7QUFDSDtBQTlJRzs7QUFBQTtBQUFBOztBQWlKUixXQUFPLE9BQVAsR0FBaUIsVUFBakI7QUFFSCxDQW5KQSxHQUFEOzs7Ozs7Ozs7QUNBQyxhQUFXOztBQUVSOztBQUVBLFFBQU0sZUFBZSxRQUFRLGdCQUFSLENBQXJCO0FBQ0EsUUFBTSxlQUFlLFFBQVEsZ0JBQVIsQ0FBckI7QUFDQSxRQUFNLFFBQVEsUUFBUSxlQUFSLENBQWQ7QUFDQSxRQUFNLFlBQVksUUFBUSxtQkFBUixDQUFsQjs7QUFFQSxRQUFNLG9CQUFvQjtBQUN0QixnQkFBUSxXQURjO0FBRXRCLGtCQUFVLFlBRlk7QUFHdEIsaUJBQVMsV0FIYTtBQUl0QixtQkFBVyxZQUpXO0FBS3RCLGVBQU8sV0FMZTtBQU10QixpQkFBUyxZQU5hO0FBT3RCLGdCQUFRLFdBUGM7QUFRdEIsa0JBQVUsWUFSWTtBQVN0QixnQkFBUSxZQVRjO0FBVXRCLGtCQUFVLFlBVlk7QUFXdEIsaUJBQVMsWUFYYTtBQVl0QixtQkFBVyxZQVpXO0FBYXRCLGdCQUFRLFlBYmM7QUFjdEIsa0JBQVUsWUFkWTtBQWV0QixpQkFBUyxZQWZhO0FBZ0J0QixtQkFBVyxZQWhCVztBQWlCdEIsZ0JBQVEsWUFqQmM7QUFrQnRCLGtCQUFVLFlBbEJZO0FBbUJ0QixpQkFBUyxZQW5CYTtBQW9CdEIsbUJBQVcsWUFwQlc7QUFxQnRCLGdCQUFRLGtCQXJCYztBQXNCdEIsa0JBQVUsa0JBdEJZO0FBdUJ0QixnQkFBUSxrQkF2QmM7QUF3QnRCLGtCQUFVLGtCQXhCWTtBQXlCdEIsZ0JBQVEsa0JBekJjO0FBMEJ0QixrQkFBVSxrQkExQlk7QUEyQnRCLHFCQUFhLFdBM0JTO0FBNEJ0Qix1QkFBZTtBQTVCTyxLQUExQjs7QUErQkE7Ozs7Ozs7Ozs7O0FBV0EsYUFBUyxpQkFBVCxDQUEyQixVQUEzQixFQUF1QyxXQUF2QyxFQUFvRDtBQUNoRDtBQUNBLFlBQUksV0FBVyxHQUFYLENBQWUsWUFBWSxJQUEzQixDQUFKLEVBQXNDO0FBQ2xDLG1CQUFPLFdBQVcsR0FBWCxDQUFlLFlBQVksSUFBM0IsRUFBaUMsS0FBeEM7QUFDSDtBQUNEO0FBQ0EsZUFBTyxXQUFXLElBQWxCO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxhQUFTLHdCQUFULENBQWtDLE1BQWxDLEVBQTBDLFVBQTFDLEVBQXNELFVBQXRELEVBQWtFO0FBQzlELFlBQU0sZUFBZSxhQUFhLGlCQUFiLENBQ2pCLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FEaUIsRUFFakIsQ0FBQyxTQUFELEVBQVksV0FBWixDQUZpQixDQUFyQjtBQUdBO0FBQ0EscUJBQWEsT0FBYixDQUFxQix1QkFBZTtBQUNoQztBQUNBLGdCQUFJLFlBQVksU0FBWixLQUEwQixXQUE5QixFQUEyQztBQUN2QztBQUNBLG9CQUFNLFFBQVEsa0JBQWtCLE9BQU8sVUFBekIsRUFBcUMsV0FBckMsQ0FBZDtBQUNBLHVCQUFPLFVBQVAsQ0FBa0IsR0FBbEIsQ0FBc0IsWUFBWSxJQUFsQyxFQUF3QztBQUNwQywwQkFBTSxZQUFZLElBRGtCO0FBRXBDLDJCQUFPO0FBRjZCLGlCQUF4QztBQUlILGFBUEQsTUFPTztBQUFFO0FBQ0w7QUFDQSxvQkFBTSxPQUFPLFlBQVksSUFBWixJQUFvQixZQUFZLEtBQVosR0FBb0IsQ0FBcEIsR0FBd0IsSUFBeEIsR0FBK0IsRUFBbkQsQ0FBYjtBQUNBLHVCQUFPLFFBQVAsQ0FBZ0IsR0FBaEIsQ0FBb0IsWUFBWSxJQUFoQyxFQUFzQztBQUNsQywwQkFBTSxZQUFZLElBRGdCO0FBRWxDLDBCQUFNLGtCQUFrQixJQUFsQjtBQUY0QixpQkFBdEM7QUFJSDtBQUNKLFNBakJEO0FBa0JIOztBQUVEOzs7Ozs7Ozs7O0FBVUEsYUFBUyxhQUFULENBQXVCLEVBQXZCLEVBQTJCLFlBQTNCLEVBQXlDLElBQXpDLEVBQStDO0FBQzNDLFlBQU0sU0FBUyxHQUFHLFlBQUgsQ0FBZ0IsR0FBRyxJQUFILENBQWhCLENBQWY7QUFDQSxXQUFHLFlBQUgsQ0FBZ0IsTUFBaEIsRUFBd0IsWUFBeEI7QUFDQSxXQUFHLGFBQUgsQ0FBaUIsTUFBakI7QUFDQSxZQUFJLENBQUMsR0FBRyxrQkFBSCxDQUFzQixNQUF0QixFQUE4QixHQUFHLGNBQWpDLENBQUwsRUFBdUQ7QUFDbkQsa0JBQU0sK0NBQStDLEdBQUcsZ0JBQUgsQ0FBb0IsTUFBcEIsQ0FBckQ7QUFDSDtBQUNELGVBQU8sTUFBUDtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTLHNCQUFULENBQWdDLE1BQWhDLEVBQXdDO0FBQ3BDLFlBQU0sS0FBSyxPQUFPLEVBQWxCO0FBQ0EsZUFBTyxVQUFQLENBQWtCLE9BQWxCLENBQTBCLFVBQUMsU0FBRCxFQUFZLElBQVosRUFBcUI7QUFDM0M7QUFDQSxlQUFHLGtCQUFILENBQ0ksT0FBTyxPQURYLEVBRUksVUFBVSxLQUZkLEVBR0ksSUFISjtBQUlILFNBTkQ7QUFPSDs7QUFFRDs7Ozs7O0FBTUEsYUFBUyxtQkFBVCxDQUE2QixNQUE3QixFQUFxQztBQUNqQyxZQUFNLEtBQUssT0FBTyxFQUFsQjtBQUNBLFlBQU0sV0FBVyxPQUFPLFFBQXhCO0FBQ0EsaUJBQVMsT0FBVCxDQUFpQixVQUFDLE9BQUQsRUFBVSxJQUFWLEVBQW1CO0FBQ2hDO0FBQ0EsZ0JBQU0sV0FBVyxHQUFHLGtCQUFILENBQXNCLE9BQU8sT0FBN0IsRUFBc0MsSUFBdEMsQ0FBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBSSxhQUFhLElBQWpCLEVBQXVCO0FBQ25CLHlCQUFTLE1BQVQsQ0FBZ0IsSUFBaEI7QUFDSCxhQUZELE1BRU87QUFDSCx3QkFBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0g7QUFDSixTQVhEO0FBWUg7O0FBRUQ7Ozs7Ozs7O0FBUUEsYUFBUyxnQkFBVCxDQUEwQixHQUExQixFQUErQjtBQUMzQixlQUFPLFVBQVMsSUFBVCxFQUFlO0FBQ2xCLHNCQUFVLElBQVYsQ0FBZTtBQUNYLHFCQUFLLEdBRE07QUFFWCw4QkFBYyxNQUZIO0FBR1gseUJBQVMsaUJBQVMsR0FBVCxFQUFjO0FBQ25CLHlCQUFLLElBQUwsRUFBVyxHQUFYO0FBQ0gsaUJBTFU7QUFNWCx1QkFBTyxlQUFTLEdBQVQsRUFBYztBQUNqQix5QkFBSyxHQUFMLEVBQVUsSUFBVjtBQUNIO0FBUlUsYUFBZjtBQVVILFNBWEQ7QUFZSDs7QUFFRDs7Ozs7Ozs7QUFRQSxhQUFTLGlCQUFULENBQTJCLE1BQTNCLEVBQW1DO0FBQy9CLGVBQU8sVUFBUyxJQUFULEVBQWU7QUFDbEIsaUJBQUssSUFBTCxFQUFXLE1BQVg7QUFDSCxTQUZEO0FBR0g7O0FBRUQ7Ozs7Ozs7O0FBUUEsYUFBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDO0FBQzdCLGVBQU8sVUFBUyxJQUFULEVBQWU7QUFDbEIsZ0JBQU0sUUFBUSxFQUFkO0FBQ0Esc0JBQVUsV0FBVyxFQUFyQjtBQUNBLHNCQUFVLENBQUMsTUFBTSxPQUFOLENBQWMsT0FBZCxDQUFELEdBQTBCLENBQUMsT0FBRCxDQUExQixHQUFzQyxPQUFoRDtBQUNBLG9CQUFRLE9BQVIsQ0FBZ0Isa0JBQVU7QUFDdEIsb0JBQUksYUFBYSxNQUFiLENBQW9CLE1BQXBCLENBQUosRUFBaUM7QUFDN0IsMEJBQU0sSUFBTixDQUFXLGtCQUFrQixNQUFsQixDQUFYO0FBQ0gsaUJBRkQsTUFFTztBQUNILDBCQUFNLElBQU4sQ0FBVyxpQkFBaUIsTUFBakIsQ0FBWDtBQUNIO0FBQ0osYUFORDtBQU9BLGtCQUFNLFFBQU4sQ0FBZSxLQUFmLEVBQXNCLElBQXRCO0FBQ0gsU0FaRDtBQWFIOztBQUVEOzs7Ozs7Ozs7Ozs7O0FBYUEsYUFBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCLE9BQS9CLEVBQXdDO0FBQ3BDLFlBQU0sS0FBSyxPQUFPLEVBQWxCO0FBQ0EsWUFBTSxTQUFTLFFBQVEsTUFBUixDQUFlLElBQWYsQ0FBb0IsRUFBcEIsQ0FBZjtBQUNBLFlBQU0sT0FBTyxRQUFRLElBQVIsQ0FBYSxJQUFiLENBQWtCLEVBQWxCLENBQWI7QUFDQSxZQUFNLE9BQU8sUUFBUSxJQUFSLENBQWEsSUFBYixDQUFrQixFQUFsQixDQUFiO0FBQ0E7QUFDQSxZQUFNLGVBQWUsY0FBYyxFQUFkLEVBQWtCLFNBQVMsSUFBM0IsRUFBaUMsZUFBakMsQ0FBckI7QUFDQSxZQUFNLGlCQUFpQixjQUFjLEVBQWQsRUFBa0IsU0FBUyxJQUEzQixFQUFpQyxpQkFBakMsQ0FBdkI7QUFDQTtBQUNBLGlDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxJQUF2QztBQUNBO0FBQ0EsZUFBTyxPQUFQLEdBQWlCLEdBQUcsYUFBSCxFQUFqQjtBQUNBO0FBQ0EsV0FBRyxZQUFILENBQWdCLE9BQU8sT0FBdkIsRUFBZ0MsWUFBaEM7QUFDQSxXQUFHLFlBQUgsQ0FBZ0IsT0FBTyxPQUF2QixFQUFnQyxjQUFoQztBQUNBO0FBQ0EsK0JBQXVCLE1BQXZCO0FBQ0E7QUFDQSxXQUFHLFdBQUgsQ0FBZSxPQUFPLE9BQXRCO0FBQ0E7QUFDQSxZQUFJLENBQUMsR0FBRyxtQkFBSCxDQUF1QixPQUFPLE9BQTlCLEVBQXVDLEdBQUcsV0FBMUMsQ0FBTCxFQUE2RDtBQUN6RCxrQkFBTSwyQ0FBMkMsR0FBRyxpQkFBSCxDQUFxQixPQUFPLE9BQTVCLENBQWpEO0FBQ0g7QUFDRDtBQUNBLDRCQUFvQixNQUFwQjtBQUNIOztBQUVEOzs7OztBQWhRUSxRQW9RRixNQXBRRTs7QUFzUUo7Ozs7Ozs7Ozs7QUFVQSwwQkFBd0M7QUFBQTs7QUFBQSxnQkFBNUIsSUFBNEIsdUVBQXJCLEVBQXFCO0FBQUEsZ0JBQWpCLFFBQWlCLHVFQUFOLElBQU07O0FBQUE7O0FBQ3BDO0FBQ0EsZ0JBQUksQ0FBQyxLQUFLLElBQVYsRUFBZ0I7QUFDWixzQkFBTSxxREFBTjtBQUNIO0FBQ0QsZ0JBQUksQ0FBQyxLQUFLLElBQVYsRUFBZ0I7QUFDWixzQkFBTSx1REFBTjtBQUNIO0FBQ0QsaUJBQUssT0FBTCxHQUFlLENBQWY7QUFDQSxpQkFBSyxFQUFMLEdBQVUsYUFBYSxHQUFiLEVBQVY7QUFDQSxpQkFBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLElBQWdCLE1BQS9CO0FBQ0EsaUJBQUssVUFBTCxHQUFrQixJQUFJLEdBQUosRUFBbEI7QUFDQSxpQkFBSyxRQUFMLEdBQWdCLElBQUksR0FBSixFQUFoQjtBQUNBO0FBQ0EsZ0JBQUksS0FBSyxVQUFULEVBQXFCO0FBQ2pCLHFCQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBd0IsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFpQjtBQUNyQywwQkFBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLElBQXBCLEVBQTBCO0FBQ3RCLCtCQUFPO0FBRGUscUJBQTFCO0FBR0gsaUJBSkQ7QUFLSDtBQUNEO0FBQ0Esa0JBQU0sUUFBTixDQUFlO0FBQ1gsd0JBQVEsZUFBZSxLQUFLLE1BQXBCLENBREc7QUFFWCxzQkFBTSxlQUFlLEtBQUssSUFBcEIsQ0FGSztBQUdYLHNCQUFNLGVBQWUsS0FBSyxJQUFwQjtBQUhLLGFBQWYsRUFJRyxVQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWtCO0FBQ2pCLG9CQUFJLEdBQUosRUFBUztBQUNMLHdCQUFJLFFBQUosRUFBYztBQUNWLG1DQUFXLFlBQU07QUFDYixxQ0FBUyxHQUFULEVBQWMsSUFBZDtBQUNILHlCQUZEO0FBR0g7QUFDRDtBQUNIO0FBQ0Q7QUFDQSxxQ0FBb0IsT0FBcEI7QUFDQSxvQkFBSSxRQUFKLEVBQWM7QUFDViwrQkFBVyxZQUFNO0FBQ2IsaUNBQVMsSUFBVDtBQUNILHFCQUZEO0FBR0g7QUFDSixhQXBCRDtBQXFCSDs7QUFFRDs7Ozs7OztBQTdUSTtBQUFBO0FBQUEsa0NBa1VFO0FBQ0Y7QUFDQSxxQkFBSyxFQUFMLENBQVEsVUFBUixDQUFtQixLQUFLLE9BQXhCO0FBQ0EsdUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7QUF4VUk7QUFBQTtBQUFBLHVDQWdWTyxJQWhWUCxFQWdWYSxLQWhWYixFQWdWb0I7QUFDcEIsb0JBQU0sVUFBVSxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLElBQWxCLENBQWhCO0FBQ0E7QUFDQSxvQkFBSSxDQUFDLE9BQUwsRUFBYztBQUNWLDREQUF1QyxJQUF2QztBQUNIO0FBQ0Q7QUFDQSxvQkFBSSxVQUFVLFNBQVYsSUFBdUIsVUFBVSxJQUFyQyxFQUEyQztBQUN2QztBQUNBLHlEQUFvQyxJQUFwQztBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0Esb0JBQUksUUFBUSxJQUFSLEtBQWlCLE1BQWpCLElBQTJCLFFBQVEsSUFBUixLQUFpQixNQUE1QyxJQUFzRCxRQUFRLElBQVIsS0FBaUIsTUFBM0UsRUFBbUY7QUFDL0UseUJBQUssRUFBTCxDQUFRLFFBQVEsSUFBaEIsRUFBc0IsUUFBUSxRQUE5QixFQUF3QyxLQUF4QyxFQUErQyxLQUEvQztBQUNILGlCQUZELE1BRU87QUFDSCx5QkFBSyxFQUFMLENBQVEsUUFBUSxJQUFoQixFQUFzQixRQUFRLFFBQTlCLEVBQXdDLEtBQXhDO0FBQ0g7QUFDRCx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBdFdJO0FBQUE7QUFBQSx3Q0E2V1EsSUE3V1IsRUE2V2M7QUFBQTs7QUFDZCx1QkFBTyxJQUFQLENBQVksSUFBWixFQUFrQixPQUFsQixDQUEwQixnQkFBUTtBQUM5QiwyQkFBSyxVQUFMLENBQWdCLElBQWhCLEVBQXNCLEtBQUssSUFBTCxDQUF0QjtBQUNILGlCQUZEO0FBR0EsdUJBQU8sSUFBUDtBQUNIO0FBbFhHOztBQUFBO0FBQUE7O0FBcVhSLFdBQU8sT0FBUCxHQUFpQixNQUFqQjtBQUVILENBdlhBLEdBQUQ7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxRQUFNLGtCQUFrQixvQ0FBeEI7QUFDQSxRQUFNLGlCQUFpQixnQkFBdkI7QUFDQSxRQUFNLG9CQUFvQixTQUExQjtBQUNBLFFBQU0sNEJBQTRCLG9DQUFsQztBQUNBLFFBQU0sb0JBQW9CLHdDQUExQjtBQUNBLFFBQU0sa0JBQWtCLDJCQUF4QjtBQUNBLFFBQU0seUJBQXlCLDRCQUEvQjtBQUNBLFFBQU0sY0FBYyxzQ0FBcEI7QUFDQSxRQUFNLGNBQWMsaUNBQXBCOztBQUVBOzs7Ozs7OztBQVFBLGFBQVMsYUFBVCxDQUF1QixHQUF2QixFQUE0QjtBQUN4QjtBQUNBLGVBQU8sSUFBSSxPQUFKLENBQVksZUFBWixFQUE2QixFQUE3QixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUEsYUFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDO0FBQzVCO0FBQ0EsaUJBQVMsT0FBTyxPQUFQLENBQWUsZUFBZixFQUFnQyxFQUFoQyxDQUFUO0FBQ0E7QUFDQSxlQUFPLE9BQU8sT0FBUCxDQUFlLHNCQUFmLEVBQXVDLEVBQXZDLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7QUFRQSxhQUFTLG1CQUFULENBQTZCLEdBQTdCLEVBQWtDO0FBQzlCLGVBQU8sSUFBSSxPQUFKLENBQVksY0FBWixFQUE0QixHQUE1QixFQUFpQztBQUFqQyxTQUNGLE9BREUsQ0FDTSxpQkFETixFQUN5QixHQUR6QixFQUM4QjtBQUQ5QixTQUVGLE9BRkUsQ0FFTSx5QkFGTixFQUVpQyxRQUZqQyxDQUFQLENBRDhCLENBR3FCO0FBQ3REOztBQUVEOzs7Ozs7Ozs7O0FBVUEsYUFBUyxpQkFBVCxDQUEyQixTQUEzQixFQUFzQyxJQUF0QyxFQUE0QyxLQUE1QyxFQUFtRDtBQUMvQztBQUNBLFlBQU0sVUFBVSxNQUFNLEtBQU4sQ0FBWSxpQkFBWixDQUFoQjtBQUNBLFlBQU0sT0FBTyxRQUFRLENBQVIsQ0FBYjtBQUNBLFlBQU0sUUFBUyxRQUFRLENBQVIsTUFBZSxTQUFoQixHQUE2QixDQUE3QixHQUFpQyxTQUFTLFFBQVEsQ0FBUixDQUFULEVBQXFCLEVBQXJCLENBQS9DO0FBQ0EsZUFBTztBQUNILHVCQUFXLFNBRFI7QUFFSCxrQkFBTSxJQUZIO0FBR0gsa0JBQU0sSUFISDtBQUlILG1CQUFPO0FBSkosU0FBUDtBQU1IOztBQUVEOzs7Ozs7Ozs7OztBQVdBLGFBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQU0sUUFBUSxVQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FBeUIsZ0JBQVE7QUFDM0MsbUJBQU8sS0FBSyxJQUFMLEVBQVA7QUFDSCxTQUZhLENBQWQ7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFNLFNBQVMsTUFBTSxLQUFOLEdBQWMsS0FBZCxDQUFvQixHQUFwQixDQUFmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBTSxZQUFZLE9BQU8sS0FBUCxFQUFsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQU0sT0FBTyxPQUFPLEtBQVAsRUFBYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQU0sUUFBUSxPQUFPLE1BQVAsQ0FBYyxLQUFkLENBQWQ7O0FBRUE7QUFDQSxlQUFPLE1BQU0sR0FBTixDQUFVLGdCQUFRO0FBQ3JCLG1CQUFPLGtCQUFrQixTQUFsQixFQUE2QixJQUE3QixFQUFtQyxJQUFuQyxDQUFQO0FBQ0gsU0FGTSxDQUFQO0FBR0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxhQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkIsUUFBN0IsRUFBdUM7QUFDbkM7QUFDQSxZQUFNLGFBQWEsT0FBTyxLQUFQLENBQWEsR0FBYixDQUFuQjtBQUNBO0FBQ0EsWUFBTSxhQUFhLFNBQVMsSUFBVCxDQUFjLEdBQWQsQ0FBbkI7QUFDQSxZQUFNLGVBQWUsSUFBSSxNQUFKLENBQVcsU0FBUyxVQUFULEdBQXNCLFFBQWpDLENBQXJCO0FBQ0E7QUFDQSxZQUFJLFVBQVUsRUFBZDtBQUNBO0FBQ0EsbUJBQVcsT0FBWCxDQUFtQixxQkFBYTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFNLFNBQVMsVUFBVSxLQUFWLENBQWdCLFlBQWhCLENBQWY7QUFDQSxnQkFBSSxNQUFKLEVBQVk7QUFDUjtBQUNBLDBCQUFVLFFBQVEsTUFBUixDQUFlLGVBQWUsT0FBTyxDQUFQLENBQWYsQ0FBZixDQUFWO0FBQ0g7QUFDSixTQVZEO0FBV0EsZUFBTyxPQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQVNBLGFBQVMsc0JBQVQsQ0FBZ0MsWUFBaEMsRUFBOEM7QUFDMUM7QUFDQTtBQUNBLFlBQU0sT0FBTyxFQUFiO0FBQ0EsZUFBTyxhQUFhLE1BQWIsQ0FBb0IsdUJBQWU7QUFDdEMsZ0JBQUksS0FBSyxZQUFZLElBQWpCLENBQUosRUFBNEI7QUFDeEIsdUJBQU8sS0FBUDtBQUNIO0FBQ0QsaUJBQUssWUFBWSxJQUFqQixJQUF5QixJQUF6QjtBQUNBLG1CQUFPLElBQVA7QUFDSCxTQU5NLENBQVA7QUFPSDs7QUFFRDs7Ozs7Ozs7QUFRQSxhQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEI7QUFDeEI7QUFDQSxlQUFPLE9BQU8sT0FBUCxDQUFlLFdBQWYsRUFBNEIsRUFBNUIsQ0FBUDtBQUNIOztBQUVELFdBQU8sT0FBUCxHQUFpQjs7QUFFYjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSwyQkFBbUIsNkJBQXdDO0FBQUEsZ0JBQS9CLE9BQStCLHVFQUFyQixFQUFxQjtBQUFBLGdCQUFqQixVQUFpQix1RUFBSixFQUFJOztBQUN2RDtBQUNBLGdCQUFJLFFBQVEsTUFBUixLQUFtQixDQUFuQixJQUF3QixXQUFXLE1BQVgsS0FBc0IsQ0FBbEQsRUFBcUQ7QUFDakQsdUJBQU8sRUFBUDtBQUNIO0FBQ0Qsc0JBQVUsTUFBTSxPQUFOLENBQWMsT0FBZCxJQUF5QixPQUF6QixHQUFtQyxDQUFDLE9BQUQsQ0FBN0M7QUFDQSx5QkFBYSxNQUFNLE9BQU4sQ0FBYyxVQUFkLElBQTRCLFVBQTVCLEdBQXlDLENBQUMsVUFBRCxDQUF0RDtBQUNBO0FBQ0EsZ0JBQUksZUFBZSxFQUFuQjtBQUNBLG9CQUFRLE9BQVIsQ0FBZ0Isa0JBQVU7QUFDdEI7QUFDQSx5QkFBUyxXQUFXLE1BQVgsQ0FBVDtBQUNBO0FBQ0EseUJBQVMsZUFBZSxNQUFmLENBQVQ7QUFDQTtBQUNBLHlCQUFTLGNBQWMsTUFBZCxDQUFUO0FBQ0E7QUFDQSx5QkFBUyxvQkFBb0IsTUFBcEIsQ0FBVDtBQUNBO0FBQ0EsK0JBQWUsYUFBYSxNQUFiLENBQW9CLFlBQVksTUFBWixFQUFvQixVQUFwQixDQUFwQixDQUFmO0FBQ0gsYUFYRDtBQVlBO0FBQ0EsbUJBQU8sdUJBQXVCLFlBQXZCLENBQVA7QUFDSCxTQTVDWTs7QUE4Q2I7Ozs7Ozs7QUFPQSxnQkFBUSxnQkFBUyxHQUFULEVBQWM7QUFDbEIsbUJBQU8sWUFBWSxJQUFaLENBQWlCLEdBQWpCLENBQVA7QUFDSDs7QUF2RFksS0FBakI7QUEyREgsQ0FoUUEsR0FBRDs7Ozs7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxRQUFNLGVBQWUsUUFBUSxnQkFBUixDQUFyQjtBQUNBLFFBQU0sT0FBTyxRQUFRLGNBQVIsQ0FBYjs7QUFFQSxRQUFNLGNBQWM7QUFDaEIsaUJBQVMsSUFETztBQUVoQixnQkFBUTtBQUZRLEtBQXBCO0FBSUEsUUFBTSxjQUFjO0FBQ2hCLGlCQUFTLElBRE87QUFFaEIsZ0JBQVEsSUFGUTtBQUdoQixnQ0FBd0IsSUFIUjtBQUloQiwrQkFBdUIsSUFKUDtBQUtoQiwrQkFBdUIsSUFMUDtBQU1oQiw4QkFBc0I7QUFOTixLQUFwQjtBQVFBLFFBQU0seUJBQXlCO0FBQzNCLGlCQUFTLElBRGtCO0FBRTNCLGdCQUFRO0FBRm1CLEtBQS9CO0FBSUEsUUFBTSxxQkFBcUI7QUFDdkIsZ0NBQXdCLElBREQ7QUFFdkIsK0JBQXVCLElBRkE7QUFHdkIsK0JBQXVCLElBSEE7QUFJdkIsOEJBQXNCO0FBSkMsS0FBM0I7QUFNQSxRQUFNLGFBQWE7QUFDZixnQkFBUSxJQURPO0FBRWYseUJBQWlCLElBRkY7QUFHZix1QkFBZTtBQUhBLEtBQW5CO0FBS0EsUUFBTSxjQUFjO0FBQ2hCLHlCQUFpQixJQUREO0FBRWhCLHVCQUFlO0FBRkMsS0FBcEI7O0FBS0E7OztBQUdBLFFBQU0sZUFBZSxlQUFyQjs7QUFFQTs7O0FBR0EsUUFBTSxpQkFBaUIsTUFBdkI7O0FBRUE7OztBQUdBLFFBQU0sZUFBZSxRQUFyQjs7QUFFQTs7O0FBR0EsUUFBTSxpQkFBaUIsUUFBdkI7O0FBRUE7OztBQUdBLFFBQU0sNEJBQTRCLElBQWxDOztBQUVBOzs7QUFHQSxRQUFNLGlCQUFpQixJQUF2Qjs7QUFFQTs7O0FBR0EsUUFBTSxtQkFBbUIsSUFBekI7O0FBRUE7OztBQUdBLFFBQU0sbUNBQW1DLGdCQUF6Qzs7QUFFQTs7Ozs7QUEvRVEsUUFtRkYsU0FuRkU7O0FBcUZKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsNkJBQXVCO0FBQUEsZ0JBQVgsSUFBVyx1RUFBSixFQUFJOztBQUFBOztBQUNuQjtBQUNBLGlCQUFLLEtBQUwsR0FBYSxLQUFLLEtBQUwsSUFBYyxLQUFLLElBQWhDO0FBQ0EsaUJBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxJQUFjLEtBQUssSUFBaEM7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxJQUFrQixLQUFLLE1BQXhDO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsSUFBa0IsS0FBSyxNQUF4QztBQUNBO0FBQ0EsaUJBQUssRUFBTCxHQUFVLGFBQWEsR0FBYixFQUFWO0FBQ0E7QUFDQSxpQkFBSyxPQUFMLEdBQWUsSUFBZjtBQUNBO0FBQ0EsaUJBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxJQUFjLFlBQTNCO0FBQ0EsaUJBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxJQUFjLFlBQTNCO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsSUFBa0IsY0FBbkM7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxJQUFrQixjQUFuQztBQUNBO0FBQ0EsaUJBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxLQUFnQixTQUFoQixHQUE0QixLQUFLLE1BQWpDLEdBQTBDLGNBQXhEO0FBQ0EsaUJBQUssT0FBTCxHQUFlLEtBQUssT0FBTCxLQUFpQixTQUFqQixHQUE2QixLQUFLLE9BQWxDLEdBQTRDLGdCQUEzRDtBQUNBLGlCQUFLLGdCQUFMLEdBQXdCLEtBQUssZ0JBQUwsS0FBMEIsU0FBMUIsR0FBc0MsS0FBSyxnQkFBM0MsR0FBOEQseUJBQXRGO0FBQ0E7QUFDQSxpQkFBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLElBQWUsY0FBN0I7QUFDQSxnQkFBSSxZQUFZLEtBQUssTUFBakIsS0FBNEIsQ0FBQyxhQUFhLGNBQWIsQ0FBNEIscUJBQTVCLENBQWpDLEVBQXFGO0FBQ2pGLDhEQUE2QyxLQUFLLE1BQWxEO0FBQ0g7QUFDRDtBQUNBLGlCQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsSUFBYSxZQUF6QjtBQUNBLGdCQUFJLEtBQUssSUFBTCxLQUFjLE9BQWQsSUFBeUIsQ0FBQyxhQUFhLGNBQWIsQ0FBNEIsbUJBQTVCLENBQTlCLEVBQWdGO0FBQzVFO0FBQ0g7QUFDRDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxHQUFaLEtBQW9CLFFBQXhCLEVBQWtDO0FBQzlCO0FBQ0Esb0JBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsS0FBSyxHQUF2QixDQUFMLEVBQWtDO0FBQzlCO0FBQ0Esd0JBQUksT0FBTyxLQUFLLEtBQVosS0FBc0IsUUFBdEIsSUFBa0MsS0FBSyxLQUFMLElBQWMsQ0FBcEQsRUFBdUQ7QUFDbkQsOEJBQU0sd0NBQU47QUFDSDtBQUNELHdCQUFJLE9BQU8sS0FBSyxNQUFaLEtBQXVCLFFBQXZCLElBQW1DLEtBQUssTUFBTCxJQUFlLENBQXRELEVBQXlEO0FBQ3JELDhCQUFNLHlDQUFOO0FBQ0g7QUFDRCx3QkFBSSxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQUosRUFBaUM7QUFDN0IsNEJBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsS0FBSyxLQUF2QixDQUFMLEVBQW9DO0FBQ2hDLHlHQUE0RSxLQUFLLEtBQWpGO0FBQ0g7QUFDRCw0QkFBSSxDQUFDLEtBQUssWUFBTCxDQUFrQixLQUFLLE1BQXZCLENBQUwsRUFBcUM7QUFDakMsMEdBQTZFLEtBQUssTUFBbEY7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBLHFCQUFLLFVBQUwsQ0FBZ0IsS0FBSyxHQUFMLElBQVksSUFBNUIsRUFBa0MsS0FBSyxLQUF2QyxFQUE4QyxLQUFLLE1BQW5EO0FBQ0EscUJBQUssYUFBTCxDQUFtQixJQUFuQjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7OztBQTlKSTtBQUFBO0FBQUEsbUNBcUtlO0FBQUEsb0JBQWQsUUFBYyx1RUFBSCxDQUFHOztBQUNmLG9CQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQUQsSUFBK0IsV0FBVyxDQUE5QyxFQUFpRDtBQUM3QztBQUNIO0FBQ0Q7QUFDQSxvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSxtQkFBRyxhQUFILENBQWlCLEdBQUcsWUFBWSxRQUFmLENBQWpCO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsVUFBbEIsRUFBOEIsS0FBSyxPQUFuQztBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7O0FBaExJO0FBQUE7QUFBQSxxQ0FxTEs7QUFDTDtBQUNBLG9CQUFNLEtBQUssS0FBSyxFQUFoQjtBQUNBLG1CQUFHLFdBQUgsQ0FBZSxHQUFHLFVBQWxCLEVBQThCLElBQTlCO0FBQ0EsdUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBNUxJO0FBQUE7QUFBQSx1Q0FxTU8sSUFyTVAsRUFxTWEsS0FyTWIsRUFxTW9CLE1Bck1wQixFQXFNNEI7QUFDNUIsb0JBQU0sS0FBSyxLQUFLLEVBQWhCO0FBQ0E7QUFDQSxvQkFBSSxDQUFDLEtBQUssT0FBVixFQUFtQjtBQUNmLHlCQUFLLE9BQUwsR0FBZSxHQUFHLGFBQUgsRUFBZjtBQUNIO0FBQ0Q7QUFDQSxtQkFBRyxXQUFILENBQWUsR0FBRyxVQUFsQixFQUE4QixLQUFLLE9BQW5DO0FBQ0E7QUFDQSxtQkFBRyxXQUFILENBQWUsR0FBRyxtQkFBbEIsRUFBdUMsS0FBSyxPQUE1QztBQUNBO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsOEJBQWxCLEVBQWtELEtBQUssZ0JBQXZEO0FBQ0E7QUFDQSxvQkFBSSxNQUFNLE9BQU4sQ0FBYyxJQUFkLENBQUosRUFBeUI7QUFDckIsd0JBQUksS0FBSyxJQUFMLEtBQWMsZ0JBQWxCLEVBQW9DO0FBQ2hDLCtCQUFPLElBQUksV0FBSixDQUFnQixJQUFoQixDQUFQO0FBQ0gscUJBRkQsTUFFTyxJQUFJLEtBQUssSUFBTCxLQUFjLGNBQWxCLEVBQWtDO0FBQ3JDLCtCQUFPLElBQUksV0FBSixDQUFnQixJQUFoQixDQUFQO0FBQ0gscUJBRk0sTUFFQSxJQUFJLEtBQUssSUFBTCxLQUFjLE9BQWxCLEVBQTJCO0FBQzlCLCtCQUFPLElBQUksWUFBSixDQUFpQixJQUFqQixDQUFQO0FBQ0gscUJBRk0sTUFFQTtBQUNILCtCQUFPLElBQUksVUFBSixDQUFlLElBQWYsQ0FBUDtBQUNIO0FBQ0o7QUFDRDtBQUNBLG9CQUFJLGdCQUFnQixVQUFwQixFQUFnQztBQUM1Qix5QkFBSyxJQUFMLEdBQVksZUFBWjtBQUNILGlCQUZELE1BRU8sSUFBSSxnQkFBZ0IsV0FBcEIsRUFBaUM7QUFDcEMseUJBQUssSUFBTCxHQUFZLGdCQUFaO0FBQ0gsaUJBRk0sTUFFQSxJQUFJLGdCQUFnQixXQUFwQixFQUFpQztBQUNwQyx5QkFBSyxJQUFMLEdBQVksY0FBWjtBQUNILGlCQUZNLE1BRUEsSUFBSSxnQkFBZ0IsWUFBcEIsRUFBa0M7QUFDckMseUJBQUssSUFBTCxHQUFZLE9BQVo7QUFDSCxpQkFGTSxNQUVBLElBQUksUUFBUSxFQUFFLGdCQUFnQixXQUFsQixDQUFSLElBQTBDLENBQUMsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQS9DLEVBQXdFO0FBQzNFLDBCQUFNLHNEQUNGLHNEQURFLEdBRUYsa0RBRko7QUFHSDtBQUNELG9CQUFJLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUFKLEVBQTZCO0FBQ3pCO0FBQ0EseUJBQUssS0FBTCxHQUFhLEtBQUssS0FBbEI7QUFDQSx5QkFBSyxNQUFMLEdBQWMsS0FBSyxNQUFuQjtBQUNBO0FBQ0EsdUJBQUcsVUFBSCxDQUNJLEdBQUcsVUFEUCxFQUVJLENBRkosRUFFTztBQUNILHVCQUFHLEtBQUssTUFBUixDQUhKLEVBR3FCO0FBQ2pCLHVCQUFHLEtBQUssTUFBUixDQUpKLEVBS0ksR0FBRyxLQUFLLElBQVIsQ0FMSixFQU1JLElBTko7QUFPSCxpQkFaRCxNQVlPO0FBQ0g7QUFDQSx5QkFBSyxLQUFMLEdBQWEsU0FBUyxLQUFLLEtBQTNCO0FBQ0EseUJBQUssTUFBTCxHQUFjLFVBQVUsS0FBSyxNQUE3QjtBQUNBO0FBQ0EsdUJBQUcsVUFBSCxDQUNJLEdBQUcsVUFEUCxFQUVJLENBRkosRUFFTztBQUNILHVCQUFHLEtBQUssTUFBUixDQUhKLEVBR3FCO0FBQ2pCLHlCQUFLLEtBSlQsRUFLSSxLQUFLLE1BTFQsRUFNSSxDQU5KLEVBTU87QUFDSCx1QkFBRyxLQUFLLE1BQVIsQ0FQSixFQVFJLEdBQUcsS0FBSyxJQUFSLENBUkosRUFTSSxJQVRKO0FBVUg7QUFDRDtBQUNBLG9CQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNiLHVCQUFHLGNBQUgsQ0FBa0IsR0FBRyxVQUFyQjtBQUNIO0FBQ0Q7QUFDQSxtQkFBRyxXQUFILENBQWUsR0FBRyxVQUFsQixFQUE4QixJQUE5QjtBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7O0FBaFJJO0FBQUE7QUFBQSwwQ0EyUlUsSUEzUlYsRUEyUmlGO0FBQUEsb0JBQWpFLE9BQWlFLHVFQUF2RCxDQUF1RDtBQUFBLG9CQUFwRCxPQUFvRCx1RUFBMUMsQ0FBMEM7QUFBQSxvQkFBdkMsS0FBdUMsdUVBQS9CLFNBQStCO0FBQUEsb0JBQXBCLE1BQW9CLHVFQUFYLFNBQVc7O0FBQ2pGLG9CQUFNLEtBQUssS0FBSyxFQUFoQjtBQUNBO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsVUFBbEIsRUFBOEIsS0FBSyxPQUFuQztBQUNBO0FBQ0Esb0JBQUksTUFBTSxPQUFOLENBQWMsSUFBZCxDQUFKLEVBQXlCO0FBQ3JCLHdCQUFJLEtBQUssSUFBTCxLQUFjLGdCQUFsQixFQUFvQztBQUNoQywrQkFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNILHFCQUZELE1BRU8sSUFBSSxLQUFLLElBQUwsS0FBYyxjQUFsQixFQUFrQztBQUNyQywrQkFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNILHFCQUZNLE1BRUEsSUFBSSxLQUFLLElBQUwsS0FBYyxPQUFsQixFQUEyQjtBQUM5QiwrQkFBTyxJQUFJLFlBQUosQ0FBaUIsSUFBakIsQ0FBUDtBQUNILHFCQUZNLE1BRUE7QUFDSCwrQkFBTyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQVA7QUFDSDtBQUNKO0FBQ0Q7QUFDQSxvQkFBSSxnQkFBZ0IsVUFBcEIsRUFBZ0M7QUFDNUIsd0JBQUksS0FBSyxJQUFMLEtBQWMsZUFBbEIsRUFBbUM7QUFDL0IsOEJBQU0sK0VBQU47QUFDSDtBQUNKLGlCQUpELE1BSU8sSUFBSSxnQkFBZ0IsV0FBcEIsRUFBaUM7QUFDcEMsd0JBQUksS0FBSyxJQUFMLEtBQWMsZ0JBQWxCLEVBQW9DO0FBQ2hDLDhCQUFNLGlGQUFOO0FBQ0g7QUFDSixpQkFKTSxNQUlBLElBQUksZ0JBQWdCLFdBQXBCLEVBQWlDO0FBQ3BDLHdCQUFJLEtBQUssSUFBTCxLQUFjLGNBQWxCLEVBQWtDO0FBQzlCLDhCQUFNLCtFQUFOO0FBQ0g7QUFDSixpQkFKTSxNQUlBLElBQUksZ0JBQWdCLFlBQXBCLEVBQWtDO0FBQ3JDLHdCQUFJLEtBQUssSUFBTCxLQUFjLE9BQWxCLEVBQTJCO0FBQ3ZCLDhCQUFNLHlFQUFOO0FBQ0g7QUFDSixpQkFKTSxNQUlBLElBQUksRUFBRSxnQkFBZ0IsV0FBbEIsS0FBa0MsQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdkMsRUFBZ0U7QUFDbkUsMEJBQU0sc0RBQ0Ysc0RBREUsR0FFRiw0Q0FGSjtBQUdIO0FBQ0Qsb0JBQUksS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQUosRUFBNkI7QUFDekI7QUFDQSx1QkFBRyxhQUFILENBQ0ksR0FBRyxVQURQLEVBRUksQ0FGSixFQUVPO0FBQ0gsMkJBSEosRUFJSSxPQUpKLEVBS0ksR0FBRyxLQUFLLE1BQVIsQ0FMSixFQU1JLEdBQUcsS0FBSyxJQUFSLENBTkosRUFPSSxJQVBKO0FBUUgsaUJBVkQsTUFVTztBQUNIO0FBQ0Esd0JBQUksQ0FBQyxPQUFPLFNBQVAsQ0FBaUIsS0FBakIsQ0FBTCxFQUE4QjtBQUMxQixzREFBNkIsS0FBN0I7QUFDSDtBQUNEO0FBQ0Esd0JBQUksQ0FBQyxPQUFPLFNBQVAsQ0FBaUIsTUFBakIsQ0FBTCxFQUErQjtBQUMzQix1REFBOEIsTUFBOUI7QUFDSDtBQUNEO0FBQ0Esd0JBQUksUUFBUSxPQUFSLEdBQWtCLEtBQUssS0FBM0IsRUFBa0M7QUFDOUIsOEJBQU0sd0JBQXVCLEtBQXZCLGlDQUNJLE9BREosaURBRUcsS0FBSyxLQUZSLE9BQU47QUFHSDtBQUNELHdCQUFJLFNBQVMsT0FBVCxHQUFtQixLQUFLLE1BQTVCLEVBQW9DO0FBQ2hDLDhCQUFNLHdCQUF1QixNQUF2QixpQ0FDSSxPQURKLGlEQUVHLEtBQUssTUFGUixPQUFOO0FBR0g7QUFDRDtBQUNBLHVCQUFHLGFBQUgsQ0FDSSxHQUFHLFVBRFAsRUFFSSxDQUZKLEVBRU87QUFDSCwyQkFISixFQUlJLE9BSkosRUFLSSxLQUxKLEVBTUksTUFOSixFQU9JLEdBQUcsS0FBSyxNQUFSLENBUEosRUFRSSxHQUFHLEtBQUssSUFBUixDQVJKLEVBU0ksSUFUSjtBQVVIO0FBQ0Q7QUFDQSxvQkFBSSxLQUFLLE1BQVQsRUFBaUI7QUFDYix1QkFBRyxjQUFILENBQWtCLEdBQUcsVUFBckI7QUFDSDtBQUNEO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsVUFBbEIsRUFBOEIsSUFBOUI7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0FBcFhJO0FBQUE7QUFBQSwwQ0FpWVUsTUFqWVYsRUFpWWtCO0FBQ2xCLG9CQUFNLEtBQUssS0FBSyxFQUFoQjtBQUNBO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsVUFBbEIsRUFBOEIsS0FBSyxPQUFuQztBQUNBO0FBQ0Esb0JBQUksUUFBUSxPQUFPLEtBQVAsSUFBZ0IsT0FBTyxJQUFuQztBQUNBLG9CQUFJLEtBQUosRUFBVztBQUNQLHdCQUFJLFdBQVcsS0FBWCxDQUFKLEVBQXVCO0FBQ25CLDZCQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsMkJBQUcsYUFBSCxDQUFpQixHQUFHLFVBQXBCLEVBQWdDLEdBQUcsY0FBbkMsRUFBbUQsR0FBRyxLQUFLLEtBQVIsQ0FBbkQ7QUFDSCxxQkFIRCxNQUdPO0FBQ0gsc0RBQTZCLEtBQTdCO0FBQ0g7QUFDSjtBQUNEO0FBQ0Esd0JBQVEsT0FBTyxLQUFQLElBQWdCLE9BQU8sSUFBL0I7QUFDQSxvQkFBSSxLQUFKLEVBQVc7QUFDUCx3QkFBSSxXQUFXLEtBQVgsQ0FBSixFQUF1QjtBQUNuQiw2QkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLDJCQUFHLGFBQUgsQ0FBaUIsR0FBRyxVQUFwQixFQUFnQyxHQUFHLGNBQW5DLEVBQW1ELEdBQUcsS0FBSyxLQUFSLENBQW5EO0FBQ0gscUJBSEQsTUFHTztBQUNILHNEQUE2QixLQUE3QjtBQUNIO0FBQ0o7QUFDRDtBQUNBLHdCQUFRLE9BQU8sU0FBUCxJQUFvQixPQUFPLE1BQW5DO0FBQ0Esb0JBQUksS0FBSixFQUFXO0FBQ1Asd0JBQUksWUFBWSxLQUFaLENBQUosRUFBd0I7QUFDcEIsNkJBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLDJCQUFHLGFBQUgsQ0FBaUIsR0FBRyxVQUFwQixFQUFnQyxHQUFHLGtCQUFuQyxFQUF1RCxHQUFHLEtBQUssU0FBUixDQUF2RDtBQUNILHFCQUhELE1BR087QUFDSCxzREFBNkIsS0FBN0I7QUFDSDtBQUNKO0FBQ0Q7QUFDQSx3QkFBUSxPQUFPLFNBQVAsSUFBb0IsT0FBTyxNQUFuQztBQUNBLG9CQUFJLEtBQUosRUFBVztBQUNQLHdCQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNiLDRCQUFJLHVCQUF1QixLQUF2QixDQUFKLEVBQW1DO0FBQy9CO0FBQ0EscUNBQVMsZ0NBQVQ7QUFDSDtBQUNELDRCQUFJLG1CQUFtQixLQUFuQixDQUFKLEVBQStCO0FBQzNCLGlDQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSwrQkFBRyxhQUFILENBQWlCLEdBQUcsVUFBcEIsRUFBZ0MsR0FBRyxrQkFBbkMsRUFBdUQsR0FBRyxLQUFLLFNBQVIsQ0FBdkQ7QUFDSCx5QkFIRCxNQUdRO0FBQ0osMERBQTZCLEtBQTdCO0FBQ0g7QUFDSixxQkFYRCxNQVdPO0FBQ0gsNEJBQUksWUFBWSxLQUFaLENBQUosRUFBd0I7QUFDcEIsaUNBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLCtCQUFHLGFBQUgsQ0FBaUIsR0FBRyxVQUFwQixFQUFnQyxHQUFHLGtCQUFuQyxFQUF1RCxHQUFHLEtBQUssU0FBUixDQUF2RDtBQUNILHlCQUhELE1BR087QUFDSCwwREFBNkIsS0FBN0I7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBLG1CQUFHLFdBQUgsQ0FBZSxHQUFHLFVBQWxCLEVBQThCLEtBQUssT0FBbkM7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQS9iSTtBQUFBO0FBQUEsbUNBdWNHLEtBdmNILEVBdWNVLE1BdmNWLEVBdWNrQjtBQUNsQixvQkFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBakIsSUFBOEIsU0FBUyxDQUEzQyxFQUErQztBQUMzQyxrREFBNkIsS0FBN0I7QUFDSDtBQUNELG9CQUFJLE9BQU8sTUFBUCxLQUFrQixRQUFsQixJQUErQixVQUFVLENBQTdDLEVBQWlEO0FBQzdDLG1EQUE4QixNQUE5QjtBQUNIO0FBQ0QscUJBQUssVUFBTCxDQUFnQixJQUFoQixFQUFzQixLQUF0QixFQUE2QixNQUE3QjtBQUNBLHVCQUFPLElBQVA7QUFDSDtBQWhkRzs7QUFBQTtBQUFBOztBQW1kUixXQUFPLE9BQVAsR0FBaUIsU0FBakI7QUFFSCxDQXJkQSxHQUFEOzs7Ozs7Ozs7QUNBQyxhQUFXOztBQUVSOztBQUVBLFFBQU0sZUFBZSxRQUFRLGdCQUFSLENBQXJCO0FBQ0EsUUFBTSxRQUFRLFFBQVEsZUFBUixDQUFkO0FBQ0EsUUFBTSxPQUFPLFFBQVEsY0FBUixDQUFiO0FBQ0EsUUFBTSxjQUFjLFFBQVEscUJBQVIsQ0FBcEI7O0FBRUEsUUFBTSxRQUFRLENBQ1YsSUFEVSxFQUNKLElBREksRUFFVixJQUZVLEVBRUosSUFGSSxFQUdWLElBSFUsRUFHSixJQUhJLENBQWQ7QUFLQSxRQUFNLGVBQWU7QUFDakIsY0FBTSw2QkFEVztBQUVqQixjQUFNLDZCQUZXO0FBR2pCLGNBQU0sNkJBSFc7QUFJakIsY0FBTSw2QkFKVztBQUtqQixjQUFNLDZCQUxXO0FBTWpCLGNBQU07QUFOVyxLQUFyQjtBQVFBLFFBQU0sVUFBVTtBQUNaLHFDQUE2QixJQURqQjtBQUVaLHFDQUE2QixJQUZqQjtBQUdaLHFDQUE2QixJQUhqQjtBQUlaLHFDQUE2QixJQUpqQjtBQUtaLHFDQUE2QixJQUxqQjtBQU1aLHFDQUE2QjtBQU5qQixLQUFoQjtBQVFBLFFBQU0sY0FBYztBQUNoQixpQkFBUyxJQURPO0FBRWhCLGdCQUFRO0FBRlEsS0FBcEI7QUFJQSxRQUFNLGNBQWM7QUFDaEIsaUJBQVMsSUFETztBQUVoQixnQkFBUSxJQUZRO0FBR2hCLGdDQUF3QixJQUhSO0FBSWhCLCtCQUF1QixJQUpQO0FBS2hCLCtCQUF1QixJQUxQO0FBTWhCLDhCQUFzQjtBQU5OLEtBQXBCO0FBUUEsUUFBTSx5QkFBeUI7QUFDM0IsaUJBQVMsSUFEa0I7QUFFM0IsZ0JBQVE7QUFGbUIsS0FBL0I7QUFJQSxRQUFNLHFCQUFxQjtBQUN2QixnQ0FBd0IsSUFERDtBQUV2QiwrQkFBdUIsSUFGQTtBQUd2QiwrQkFBdUIsSUFIQTtBQUl2Qiw4QkFBc0I7QUFKQyxLQUEzQjtBQU1BLFFBQU0sYUFBYTtBQUNmLGdCQUFRLElBRE87QUFFZix5QkFBaUIsSUFGRjtBQUdmLHVCQUFlO0FBSEEsS0FBbkI7QUFLQSxRQUFNLFVBQVU7QUFDWixhQUFLLElBRE87QUFFWixjQUFNO0FBRk0sS0FBaEI7O0FBS0E7OztBQUdBLFFBQU0sZUFBZSxlQUFyQjs7QUFFQTs7O0FBR0EsUUFBTSxpQkFBaUIsTUFBdkI7O0FBRUE7OztBQUdBLFFBQU0sZUFBZSxlQUFyQjs7QUFFQTs7O0FBR0EsUUFBTSxpQkFBaUIsUUFBdkI7O0FBRUE7OztBQUdBLFFBQU0sNEJBQTRCLElBQWxDOztBQUVBOzs7QUFHQSxRQUFNLGlCQUFpQixJQUF2Qjs7QUFFQTs7O0FBR0EsUUFBTSxtQkFBbUIsSUFBekI7O0FBRUE7OztBQUdBLFFBQU0sbUNBQW1DLGdCQUF6Qzs7QUFFQTs7Ozs7OztBQU9BLGFBQVMsZUFBVCxDQUF5QixPQUF6QixFQUFrQztBQUM5QixZQUFJLE9BQU8sUUFBUSxLQUFmLEtBQXlCLFFBQXpCLElBQXFDLFFBQVEsS0FBUixJQUFpQixDQUExRCxFQUE2RDtBQUN6RCxrQkFBTSx3Q0FBTjtBQUNIO0FBQ0QsWUFBSSxPQUFPLFFBQVEsTUFBZixLQUEwQixRQUExQixJQUFzQyxRQUFRLE1BQVIsSUFBa0IsQ0FBNUQsRUFBK0Q7QUFDM0Qsa0JBQU0seUNBQU47QUFDSDtBQUNELFlBQUksUUFBUSxLQUFSLEtBQWtCLFFBQVEsTUFBOUIsRUFBc0M7QUFDbEMsa0JBQU0sNENBQU47QUFDSDtBQUNELFlBQUksS0FBSyxnQkFBTCxDQUFzQixPQUF0QixLQUFrQyxDQUFDLEtBQUssWUFBTCxDQUFrQixRQUFRLEtBQTFCLENBQXZDLEVBQXlFO0FBQ3JFLHVGQUF5RSxRQUFRLEtBQWpGO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7OztBQVVBLGFBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QixNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN2QyxlQUFPLFVBQVMsSUFBVCxFQUFlO0FBQ2xCO0FBQ0Esd0JBQVksSUFBWixDQUFpQjtBQUNiLHFCQUFLLEdBRFE7QUFFYix5QkFBUyx3QkFBUztBQUNkLDRCQUFRLEtBQUssWUFBTCxDQUFrQixPQUFsQixFQUEyQixLQUEzQixDQUFSO0FBQ0EsNEJBQVEsVUFBUixDQUFtQixNQUFuQixFQUEyQixLQUEzQjtBQUNBLHlCQUFLLElBQUw7QUFDSCxpQkFOWTtBQU9iLHVCQUFPLG9CQUFPO0FBQ1YseUJBQUssR0FBTCxFQUFVLElBQVY7QUFDSDtBQVRZLGFBQWpCO0FBV0gsU0FiRDtBQWNIOztBQUVEOzs7Ozs7Ozs7O0FBVUEsYUFBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLE1BQWpDLEVBQXlDLE1BQXpDLEVBQWlEO0FBQzdDLGVBQU8sVUFBUyxJQUFULEVBQWU7QUFDbEIscUJBQVMsS0FBSyxZQUFMLENBQWtCLE9BQWxCLEVBQTJCLE1BQTNCLENBQVQ7QUFDQSxvQkFBUSxVQUFSLENBQW1CLE1BQW5CLEVBQTJCLE1BQTNCO0FBQ0EsaUJBQUssSUFBTDtBQUNILFNBSkQ7QUFLSDs7QUFFRDs7Ozs7Ozs7OztBQVVBLGFBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQyxNQUFoQyxFQUF3QyxHQUF4QyxFQUE2QztBQUN6Qyx3QkFBZ0IsT0FBaEI7QUFDQSxlQUFPLFVBQVMsSUFBVCxFQUFlO0FBQ2xCLG9CQUFRLFVBQVIsQ0FBbUIsTUFBbkIsRUFBMkIsR0FBM0I7QUFDQSxpQkFBSyxJQUFMO0FBQ0gsU0FIRDtBQUlIOztBQUVEOzs7OztBQTNMUSxRQStMRixjQS9MRTs7QUFpTUo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsa0NBQXdDO0FBQUE7O0FBQUEsZ0JBQTVCLElBQTRCLHVFQUFyQixFQUFxQjtBQUFBLGdCQUFqQixRQUFpQix1RUFBTixJQUFNOztBQUFBOztBQUNwQyxpQkFBSyxFQUFMLEdBQVUsYUFBYSxHQUFiLEVBQVY7QUFDQSxpQkFBSyxPQUFMLEdBQWUsSUFBZjtBQUNBO0FBQ0EsaUJBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxJQUFjLEtBQUssSUFBaEM7QUFDQSxpQkFBSyxLQUFMLEdBQWEsS0FBSyxLQUFMLElBQWMsS0FBSyxJQUFoQztBQUNBLGlCQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLEtBQUssTUFBeEM7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxJQUFrQixLQUFLLE1BQXhDO0FBQ0E7QUFDQSxpQkFBSyxLQUFMLEdBQWEsV0FBVyxLQUFLLEtBQWhCLElBQXlCLEtBQUssS0FBOUIsR0FBc0MsWUFBbkQ7QUFDQSxpQkFBSyxLQUFMLEdBQWEsV0FBVyxLQUFLLEtBQWhCLElBQXlCLEtBQUssS0FBOUIsR0FBc0MsWUFBbkQ7QUFDQSxpQkFBSyxTQUFMLEdBQWlCLFlBQVksS0FBSyxTQUFqQixJQUE4QixLQUFLLFNBQW5DLEdBQStDLGNBQWhFO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixZQUFZLEtBQUssU0FBakIsSUFBOEIsS0FBSyxTQUFuQyxHQUErQyxjQUFoRTtBQUNBO0FBQ0EsaUJBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxLQUFnQixTQUFoQixHQUE0QixLQUFLLE1BQWpDLEdBQTBDLGNBQXhEO0FBQ0EsaUJBQUssT0FBTCxHQUFlLEtBQUssT0FBTCxLQUFpQixTQUFqQixHQUE2QixLQUFLLE9BQWxDLEdBQTRDLGdCQUEzRDtBQUNBLGlCQUFLLGdCQUFMLEdBQXdCLEtBQUssZ0JBQUwsS0FBMEIsU0FBMUIsR0FBc0MsS0FBSyxnQkFBM0MsR0FBOEQseUJBQXRGO0FBQ0E7QUFDQSxpQkFBSyxNQUFMLEdBQWMsUUFBUSxLQUFLLE1BQWIsSUFBdUIsS0FBSyxNQUE1QixHQUFxQyxjQUFuRDtBQUNBLGlCQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsSUFBYSxZQUF6QjtBQUNBLGdCQUFJLEtBQUssSUFBTCxLQUFjLE9BQWQsSUFBeUIsQ0FBQyxhQUFhLGNBQWIsQ0FBNEIsbUJBQTVCLENBQTlCLEVBQWdGO0FBQzVFLHNCQUFNLHlGQUFOO0FBQ0g7QUFDRDtBQUNBLGlCQUFLLEtBQUwsR0FBYSxLQUFLLEtBQWxCO0FBQ0EsaUJBQUssTUFBTCxHQUFjLEtBQUssTUFBbkI7QUFDQTtBQUNBLGlCQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQTtBQUNBLGdCQUFJLEtBQUssS0FBVCxFQUFnQjtBQUFBO0FBQ1osd0JBQU0sUUFBUSxFQUFkO0FBQ0EsMEJBQU0sT0FBTixDQUFjLGNBQU07QUFDaEIsNEJBQU0sT0FBTyxLQUFLLEtBQUwsQ0FBVyxFQUFYLENBQWI7QUFDQSw0QkFBTSxTQUFTLGFBQWEsRUFBYixDQUFmO0FBQ0E7QUFDQSw0QkFBSSxPQUFPLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDMUI7QUFDQSxrQ0FBTSxJQUFOLENBQVcsbUJBQWtCLE1BQWxCLEVBQTBCLElBQTFCLENBQVg7QUFDSCx5QkFIRCxNQUdPLElBQUksS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQUosRUFBNkI7QUFDaEM7QUFDQSxrQ0FBTSxJQUFOLENBQVcsc0JBQXFCLE1BQXJCLEVBQTZCLElBQTdCLENBQVg7QUFDSCx5QkFITSxNQUdBO0FBQ0g7QUFDQSxrQ0FBTSxJQUFOLENBQVcscUJBQW9CLE1BQXBCLEVBQTRCLElBQTVCLENBQVg7QUFDSDtBQUNKLHFCQWREO0FBZUEsMEJBQU0sUUFBTixDQUFlLEtBQWYsRUFBc0IsZUFBTztBQUN6Qiw0QkFBSSxHQUFKLEVBQVM7QUFDTCxnQ0FBSSxRQUFKLEVBQWM7QUFDViwyQ0FBVyxZQUFNO0FBQ2IsNkNBQVMsR0FBVCxFQUFjLElBQWQ7QUFDSCxpQ0FGRDtBQUdIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0EsOEJBQUssYUFBTDtBQUNBLDRCQUFJLFFBQUosRUFBYztBQUNWLHVDQUFXLFlBQU07QUFDYix5Q0FBUyxJQUFUO0FBQ0gsNkJBRkQ7QUFHSDtBQUNKLHFCQWhCRDtBQWpCWTtBQWtDZixhQWxDRCxNQWtDTztBQUNIO0FBQ0EsZ0NBQWdCLElBQWhCO0FBQ0Esc0JBQU0sT0FBTixDQUFjLGNBQU07QUFDaEIsMEJBQUssVUFBTCxDQUFnQixhQUFhLEVBQWIsQ0FBaEIsRUFBa0MsSUFBbEM7QUFDSCxpQkFGRDtBQUdBO0FBQ0EscUJBQUssYUFBTCxDQUFtQixJQUFuQjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7OztBQTlSSTtBQUFBO0FBQUEsbUNBcVNlO0FBQUEsb0JBQWQsUUFBYyx1RUFBSCxDQUFHOztBQUNmLG9CQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQUQsSUFBK0IsV0FBVyxDQUE5QyxFQUFpRDtBQUM3QywwQkFBTSxrQ0FBTjtBQUNIO0FBQ0Q7QUFDQSxvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSxtQkFBRyxhQUFILENBQWlCLEdBQUcsWUFBWSxRQUFmLENBQWpCO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsZ0JBQWxCLEVBQW9DLEtBQUssT0FBekM7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7OztBQWhUSTtBQUFBO0FBQUEscUNBcVRLO0FBQ0w7QUFDQSxvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSxtQkFBRyxXQUFILENBQWUsR0FBRyxnQkFBbEIsRUFBb0MsSUFBcEM7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQTVUSTtBQUFBO0FBQUEsdUNBb1VPLE1BcFVQLEVBb1VlLElBcFVmLEVBb1VxQjtBQUNyQixvQkFBSSxDQUFDLFFBQVEsTUFBUixDQUFMLEVBQXNCO0FBQ2xCLG9EQUFnQyxNQUFoQztBQUNIO0FBQ0Qsb0JBQU0sS0FBSyxLQUFLLEVBQWhCO0FBQ0E7QUFDQSxvQkFBSSxDQUFDLEtBQUssT0FBVixFQUFtQjtBQUNmLHlCQUFLLE9BQUwsR0FBZSxHQUFHLGFBQUgsRUFBZjtBQUNIO0FBQ0Q7QUFDQSxtQkFBRyxXQUFILENBQWUsR0FBRyxnQkFBbEIsRUFBb0MsS0FBSyxPQUF6QztBQUNBO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsbUJBQWxCLEVBQXVDLEtBQUssT0FBNUM7QUFDQTtBQUNBLG1CQUFHLFdBQUgsQ0FBZSxHQUFHLDhCQUFsQixFQUFrRCxLQUFLLGdCQUF2RDtBQUNBO0FBQ0Esb0JBQUksTUFBTSxPQUFOLENBQWMsSUFBZCxDQUFKLEVBQXlCO0FBQ3JCLHdCQUFJLEtBQUssSUFBTCxLQUFjLGdCQUFsQixFQUFvQztBQUNoQywrQkFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNILHFCQUZELE1BRU8sSUFBSSxLQUFLLElBQUwsS0FBYyxjQUFsQixFQUFrQztBQUNyQywrQkFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNILHFCQUZNLE1BRUEsSUFBSSxLQUFLLElBQUwsS0FBYyxPQUFsQixFQUEyQjtBQUM5QiwrQkFBTyxJQUFJLFlBQUosQ0FBaUIsSUFBakIsQ0FBUDtBQUNILHFCQUZNLE1BRUE7QUFDSCwrQkFBTyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQVA7QUFDSDtBQUNKO0FBQ0Q7QUFDQSxvQkFBSSxnQkFBZ0IsVUFBcEIsRUFBZ0M7QUFDNUIseUJBQUssSUFBTCxHQUFZLGVBQVo7QUFDSCxpQkFGRCxNQUVPLElBQUksZ0JBQWdCLFdBQXBCLEVBQWlDO0FBQ3BDLHlCQUFLLElBQUwsR0FBWSxnQkFBWjtBQUNILGlCQUZNLE1BRUEsSUFBSSxnQkFBZ0IsV0FBcEIsRUFBaUM7QUFDcEMseUJBQUssSUFBTCxHQUFZLGNBQVo7QUFDSCxpQkFGTSxNQUVBLElBQUksZ0JBQWdCLFlBQXBCLEVBQWtDO0FBQ3JDLHlCQUFLLElBQUwsR0FBWSxPQUFaO0FBQ0gsaUJBRk0sTUFFQSxJQUFJLFFBQVEsRUFBRSxnQkFBZ0IsV0FBbEIsQ0FBUixJQUEwQyxDQUFDLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUEvQyxFQUF3RTtBQUMzRSwwQkFBTSxzREFDRixzREFERSxHQUVGLGtEQUZKO0FBR0g7QUFDRDtBQUNBLG9CQUFJLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUFKLEVBQTZCO0FBQ3pCO0FBQ0EseUJBQUssS0FBTCxHQUFhLEtBQUssS0FBbEI7QUFDQSx5QkFBSyxNQUFMLEdBQWMsS0FBSyxNQUFuQjtBQUNBO0FBQ0EsdUJBQUcsVUFBSCxDQUNJLEdBQUcsTUFBSCxDQURKLEVBRUksQ0FGSixFQUVPO0FBQ0gsdUJBQUcsS0FBSyxNQUFSLENBSEosRUFHcUI7QUFDakIsdUJBQUcsS0FBSyxNQUFSLENBSkosRUFLSSxHQUFHLEtBQUssSUFBUixDQUxKLEVBTUksSUFOSjtBQU9ILGlCQVpELE1BWU87QUFDSDtBQUNBLHVCQUFHLFVBQUgsQ0FDSSxHQUFHLE1BQUgsQ0FESixFQUVJLENBRkosRUFFTztBQUNILHVCQUFHLEtBQUssTUFBUixDQUhKLEVBR3FCO0FBQ2pCLHlCQUFLLEtBSlQsRUFLSSxLQUFLLE1BTFQsRUFNSSxDQU5KLEVBTU87QUFDSCx1QkFBRyxLQUFLLE1BQVIsQ0FQSixFQVFJLEdBQUcsS0FBSyxJQUFSLENBUkosRUFTSSxJQVRKO0FBVUg7QUFDRDtBQUNBLG9CQUFJLEtBQUssYUFBTCxDQUFtQixPQUFuQixDQUEyQixNQUEzQixJQUFxQyxDQUF6QyxFQUE0QztBQUN4Qyx5QkFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLE1BQXhCO0FBQ0g7QUFDRDtBQUNBLG9CQUFJLEtBQUssTUFBTCxJQUFlLEtBQUssYUFBTCxDQUFtQixNQUFuQixLQUE4QixDQUFqRCxFQUFvRDtBQUNoRDtBQUNBLHVCQUFHLGNBQUgsQ0FBa0IsR0FBRyxnQkFBckI7QUFDSDtBQUNEO0FBQ0EsbUJBQUcsV0FBSCxDQUFlLEdBQUcsZ0JBQWxCLEVBQW9DLElBQXBDO0FBQ0EsdUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7OztBQXJaSTtBQUFBO0FBQUEsMENBa2FVLE1BbGFWLEVBa2FrQjtBQUNsQixvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQTtBQUNBLG1CQUFHLFdBQUgsQ0FBZSxHQUFHLGdCQUFsQixFQUFvQyxLQUFLLE9BQXpDO0FBQ0E7QUFDQSxvQkFBSSxRQUFRLE9BQU8sS0FBUCxJQUFnQixPQUFPLElBQW5DO0FBQ0Esb0JBQUksS0FBSixFQUFXO0FBQ1Asd0JBQUksV0FBVyxLQUFYLENBQUosRUFBdUI7QUFDbkIsNkJBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSwyQkFBRyxhQUFILENBQWlCLEdBQUcsZ0JBQXBCLEVBQXNDLEdBQUcsY0FBekMsRUFBeUQsR0FBRyxLQUFLLEtBQVIsQ0FBekQ7QUFDSCxxQkFIRCxNQUdPO0FBQ0gsc0RBQTZCLEtBQTdCO0FBQ0g7QUFDSjtBQUNEO0FBQ0Esd0JBQVEsT0FBTyxLQUFQLElBQWdCLE9BQU8sSUFBL0I7QUFDQSxvQkFBSSxLQUFKLEVBQVc7QUFDUCx3QkFBSSxXQUFXLEtBQVgsQ0FBSixFQUF1QjtBQUNuQiw2QkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLDJCQUFHLGFBQUgsQ0FBaUIsR0FBRyxnQkFBcEIsRUFBc0MsR0FBRyxjQUF6QyxFQUF5RCxHQUFHLEtBQUssS0FBUixDQUF6RDtBQUNILHFCQUhELE1BR087QUFDSCxzREFBNkIsS0FBN0I7QUFDSDtBQUNKO0FBQ0Q7QUFDQSx3QkFBUSxPQUFPLFNBQVAsSUFBb0IsT0FBTyxNQUFuQztBQUNBLG9CQUFJLEtBQUosRUFBVztBQUNQLHdCQUFJLFlBQVksS0FBWixDQUFKLEVBQXdCO0FBQ3BCLDZCQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSwyQkFBRyxhQUFILENBQWlCLEdBQUcsZ0JBQXBCLEVBQXNDLEdBQUcsa0JBQXpDLEVBQTZELEdBQUcsS0FBSyxTQUFSLENBQTdEO0FBQ0gscUJBSEQsTUFHTztBQUNILHNEQUE2QixLQUE3QjtBQUNIO0FBQ0o7QUFDRDtBQUNBLHdCQUFRLE9BQU8sU0FBUCxJQUFvQixPQUFPLE1BQW5DO0FBQ0Esb0JBQUksS0FBSixFQUFXO0FBQ1Asd0JBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2IsNEJBQUksdUJBQXVCLEtBQXZCLENBQUosRUFBbUM7QUFDL0I7QUFDQSxxQ0FBUyxnQ0FBVDtBQUNIO0FBQ0QsNEJBQUksbUJBQW1CLEtBQW5CLENBQUosRUFBK0I7QUFDM0IsaUNBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLCtCQUFHLGFBQUgsQ0FBaUIsR0FBRyxnQkFBcEIsRUFBc0MsR0FBRyxrQkFBekMsRUFBNkQsR0FBRyxLQUFLLFNBQVIsQ0FBN0Q7QUFDSCx5QkFIRCxNQUdRO0FBQ0osMERBQTZCLEtBQTdCO0FBQ0g7QUFDSixxQkFYRCxNQVdPO0FBQ0gsNEJBQUksWUFBWSxLQUFaLENBQUosRUFBd0I7QUFDcEIsaUNBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLCtCQUFHLGFBQUgsQ0FBaUIsR0FBRyxnQkFBcEIsRUFBc0MsR0FBRyxrQkFBekMsRUFBNkQsR0FBRyxLQUFLLFNBQVIsQ0FBN0Q7QUFDSCx5QkFIRCxNQUdPO0FBQ0gsMERBQTZCLEtBQTdCO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQSxtQkFBRyxXQUFILENBQWUsR0FBRyxnQkFBbEIsRUFBb0MsSUFBcEM7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUE5ZEc7O0FBQUE7QUFBQTs7QUFpZVIsV0FBTyxPQUFQLEdBQWlCLGNBQWpCO0FBRUgsQ0FuZUEsR0FBRDs7Ozs7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxRQUFNLGVBQWUsUUFBUSxnQkFBUixDQUFyQjtBQUNBLFFBQU0sZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBdEI7O0FBRUEsUUFBTSxRQUFRO0FBQ1YsZ0JBQVEsSUFERTtBQUVWLGVBQU8sSUFGRztBQUdWLG9CQUFZLElBSEY7QUFJVixtQkFBVyxJQUpEO0FBS1YsbUJBQVcsSUFMRDtBQU1WLHdCQUFnQixJQU5OO0FBT1Ysc0JBQWM7QUFQSixLQUFkO0FBU0EsUUFBTSxRQUFRO0FBQ1YsY0FBTSxJQURJO0FBRVYsdUJBQWUsSUFGTDtBQUdWLGVBQU8sSUFIRztBQUlWLHdCQUFnQixJQUpOO0FBS1YsZUFBTyxJQUxHO0FBTVYsZUFBTztBQU5HLEtBQWQ7QUFRQSxRQUFNLGlCQUFpQjtBQUNuQixjQUFNLENBRGE7QUFFbkIsdUJBQWUsQ0FGSTtBQUduQixlQUFPLENBSFk7QUFJbkIsd0JBQWdCLENBSkc7QUFLbkIsZUFBTyxDQUxZO0FBTW5CLGVBQU87QUFOWSxLQUF2QjtBQVFBLFFBQU0sUUFBUTtBQUNWLFdBQUcsSUFETztBQUVWLFdBQUcsSUFGTztBQUdWLFdBQUcsSUFITztBQUlWLFdBQUc7QUFKTyxLQUFkOztBQU9BOzs7QUFHQSxRQUFNLHNCQUFzQixDQUE1Qjs7QUFFQTs7O0FBR0EsUUFBTSxlQUFlLFdBQXJCOztBQUVBOzs7QUFHQSxRQUFNLHVCQUF1QixDQUE3Qjs7QUFFQTs7O0FBR0EsUUFBTSxnQkFBZ0IsQ0FBdEI7O0FBRUE7Ozs7Ozs7O0FBUUEsYUFBUyxTQUFULENBQW1CLGlCQUFuQixFQUFzQztBQUNsQztBQUNBO0FBQ0EsWUFBSSxrQkFBa0IsSUFBbEIsS0FBMkIsQ0FBL0IsRUFBa0M7QUFDOUIsbUJBQU8sQ0FBUDtBQUNIO0FBQ0QsWUFBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxZQUFJLGNBQWMsQ0FBbEI7QUFDQSxZQUFJLGFBQWEsQ0FBakI7QUFDQSwwQkFBa0IsT0FBbEIsQ0FBMEIsbUJBQVc7QUFDakMsZ0JBQU0sYUFBYSxRQUFRLFVBQTNCO0FBQ0EsZ0JBQU0sT0FBTyxRQUFRLElBQXJCO0FBQ0EsZ0JBQU0sT0FBTyxRQUFRLElBQXJCO0FBQ0E7QUFDQSwyQkFBZSxPQUFPLGVBQWUsSUFBZixDQUF0QjtBQUNBO0FBQ0EsZ0JBQUksYUFBYSxhQUFqQixFQUFnQztBQUM1QixnQ0FBZ0IsVUFBaEI7QUFDQSw2QkFBYSxhQUFjLE9BQU8sZUFBZSxJQUFmLENBQWxDO0FBQ0g7QUFDSixTQVhEO0FBWUE7QUFDQTtBQUNBO0FBQ0EsWUFBSSxpQkFBaUIsV0FBckIsRUFBa0M7QUFDOUI7QUFDQTtBQUNBLG1CQUFPLENBQVA7QUFDSDtBQUNELGVBQU8sVUFBUDtBQUNIOztBQUVEOzs7Ozs7OztBQVFBLGFBQVMsb0JBQVQsQ0FBOEIsaUJBQTlCLEVBQWlEO0FBQzdDO0FBQ0EsWUFBTSxXQUFXLElBQUksR0FBSixFQUFqQjtBQUNBLGVBQU8sSUFBUCxDQUFZLGlCQUFaLEVBQStCLE9BQS9CLENBQXVDLGVBQU87QUFDMUMsZ0JBQU0sUUFBUSxTQUFTLEdBQVQsRUFBYyxFQUFkLENBQWQ7QUFDQTtBQUNBLGdCQUFJLE1BQU0sS0FBTixDQUFKLEVBQWtCO0FBQ2QsNENBQTJCLEdBQTNCO0FBQ0g7QUFDRCxnQkFBTSxVQUFVLGtCQUFrQixHQUFsQixDQUFoQjtBQUNBLGdCQUFNLE9BQU8sUUFBUSxJQUFyQjtBQUNBLGdCQUFNLE9BQU8sUUFBUSxJQUFyQjtBQUNBLGdCQUFNLGFBQWEsUUFBUSxVQUEzQjtBQUNBO0FBQ0EsZ0JBQUksQ0FBQyxNQUFNLElBQU4sQ0FBTCxFQUFrQjtBQUNkLHNCQUFNLG1FQUNGLEtBQUssU0FBTCxDQUFlLE9BQU8sSUFBUCxDQUFZLEtBQVosQ0FBZixDQURKO0FBRUg7QUFDRDtBQUNBLGdCQUFJLENBQUMsTUFBTSxJQUFOLENBQUwsRUFBa0I7QUFDZCxzQkFBTSxtRUFDRixLQUFLLFNBQUwsQ0FBZSxPQUFPLElBQVAsQ0FBWSxLQUFaLENBQWYsQ0FESjtBQUVIO0FBQ0QscUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0I7QUFDaEIsc0JBQU0sSUFEVTtBQUVoQixzQkFBTSxJQUZVO0FBR2hCLDRCQUFhLGVBQWUsU0FBaEIsR0FBNkIsVUFBN0IsR0FBMEM7QUFIdEMsYUFBcEI7QUFLSCxTQXpCRDtBQTBCQSxlQUFPLFFBQVA7QUFDSDs7QUFFRDs7Ozs7QUEzSVEsUUErSUYsWUEvSUU7O0FBaUpKOzs7Ozs7Ozs7O0FBVUEsOEJBQVksR0FBWixFQUF1RDtBQUFBLGdCQUF0QyxpQkFBc0MsdUVBQWxCLEVBQWtCO0FBQUEsZ0JBQWQsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUNuRCxpQkFBSyxFQUFMLEdBQVUsYUFBYSxHQUFiLEVBQVY7QUFDQSxpQkFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLGlCQUFLLElBQUwsR0FBWSxNQUFNLFFBQVEsSUFBZCxJQUFzQixRQUFRLElBQTlCLEdBQXFDLFlBQWpEO0FBQ0EsaUJBQUssS0FBTCxHQUFjLFFBQVEsS0FBUixLQUFrQixTQUFuQixHQUFnQyxRQUFRLEtBQXhDLEdBQWdELGFBQTdEO0FBQ0EsaUJBQUssV0FBTCxHQUFvQixRQUFRLFdBQVIsS0FBd0IsU0FBekIsR0FBc0MsUUFBUSxXQUE5QyxHQUE0RCxvQkFBL0U7QUFDQSxpQkFBSyxVQUFMLEdBQWtCLENBQWxCO0FBQ0E7QUFDQSxnQkFBSSxPQUFPLElBQUksTUFBWCxJQUFxQixJQUFJLFFBQTdCLEVBQXVDO0FBQ25DO0FBQ0EscUJBQUssUUFBTCxHQUFnQixJQUFJLFFBQXBCO0FBQ0E7QUFDQSwwQkFBVSxpQkFBVjtBQUNILGFBTEQsTUFLTztBQUNILHFCQUFLLFFBQUwsR0FBZ0IscUJBQXFCLGlCQUFyQixDQUFoQjtBQUNIO0FBQ0Q7QUFDQSxpQkFBSyxVQUFMLEdBQWtCLFVBQVUsS0FBSyxRQUFmLENBQWxCO0FBQ0E7QUFDQSxnQkFBSSxHQUFKLEVBQVM7QUFDTCxvQkFBSSxlQUFlLGFBQW5CLEVBQWtDO0FBQzlCO0FBQ0EseUJBQUssVUFBTCxDQUFnQixJQUFJLE1BQXBCO0FBQ0gsaUJBSEQsTUFHTyxJQUFJLGVBQWUsV0FBbkIsRUFBZ0M7QUFDbkM7QUFDQSx3QkFBSSxRQUFRLFVBQVIsS0FBdUIsU0FBM0IsRUFBc0M7QUFDbEMsOEJBQU0sK0ZBQU47QUFDSDtBQUNELHlCQUFLLE1BQUwsR0FBYyxHQUFkO0FBQ0EseUJBQUssVUFBTCxHQUFrQixRQUFRLFVBQTFCO0FBQ0gsaUJBUE0sTUFPQTtBQUNIO0FBQ0EseUJBQUssVUFBTCxDQUFnQixHQUFoQjtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBaE1JO0FBQUE7QUFBQSx1Q0F1TU8sR0F2TVAsRUF1TVk7QUFDWixvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQTtBQUNBLG9CQUFJLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUNwQjtBQUNBLDBCQUFNLElBQUksWUFBSixDQUFpQixHQUFqQixDQUFOO0FBQ0gsaUJBSEQsTUFHTyxJQUNILEVBQUUsZUFBZSxXQUFqQixLQUNBLENBQUUsWUFBWSxNQUFaLENBQW1CLEdBQW5CLENBREYsSUFFQSxDQUFFLE9BQU8sU0FBUCxDQUFpQixHQUFqQixDQUhDLEVBSUQ7QUFDRjtBQUNBLDBCQUFNLGlGQUFOO0FBQ0g7QUFDRDtBQUNBLG9CQUFJLE9BQU8sU0FBUCxDQUFpQixHQUFqQixDQUFKLEVBQTJCO0FBQ3ZCLHlCQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDSCxpQkFGRCxNQUVPO0FBQ0gseUJBQUssVUFBTCxHQUFrQixJQUFJLFVBQXRCO0FBQ0g7QUFDRDtBQUNBLG9CQUFJLENBQUMsS0FBSyxNQUFWLEVBQWtCO0FBQ2QseUJBQUssTUFBTCxHQUFjLEdBQUcsWUFBSCxFQUFkO0FBQ0g7QUFDRDtBQUNBLG1CQUFHLFVBQUgsQ0FBYyxHQUFHLFlBQWpCLEVBQStCLEtBQUssTUFBcEM7QUFDQSxtQkFBRyxVQUFILENBQWMsR0FBRyxZQUFqQixFQUErQixHQUEvQixFQUFvQyxHQUFHLFdBQXZDO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQXBPSTtBQUFBO0FBQUEsMENBNE9VLEtBNU9WLEVBNE9tRDtBQUFBLG9CQUFsQyxVQUFrQyx1RUFBckIsbUJBQXFCOztBQUNuRCxvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQTtBQUNBLG9CQUFJLENBQUMsS0FBSyxNQUFWLEVBQWtCO0FBQ2QsMEJBQU0sc0RBQ0YsY0FESjtBQUVIO0FBQ0Q7QUFDQSxvQkFBSSxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQUosRUFBMEI7QUFDdEIsNEJBQVEsSUFBSSxZQUFKLENBQWlCLEtBQWpCLENBQVI7QUFDSCxpQkFGRCxNQUVPLElBQ0gsRUFBRSxpQkFBaUIsV0FBbkIsS0FDQSxDQUFDLFlBQVksTUFBWixDQUFtQixLQUFuQixDQUZFLEVBR0Q7QUFDRiwwQkFBTSxzREFDRixzQkFESjtBQUVIO0FBQ0Q7QUFDQSxvQkFBSSxhQUFhLE1BQU0sVUFBbkIsR0FBZ0MsS0FBSyxVQUF6QyxFQUFxRDtBQUNqRCwwQkFBTSx3QkFBc0IsTUFBTSxVQUE1QixvQ0FDVyxVQURYLHFEQUVXLEtBQUssVUFGaEIsWUFBTjtBQUdIO0FBQ0QsbUJBQUcsVUFBSCxDQUFjLEdBQUcsWUFBakIsRUFBK0IsS0FBSyxNQUFwQztBQUNBLG1CQUFHLGFBQUgsQ0FBaUIsR0FBRyxZQUFwQixFQUFrQyxVQUFsQyxFQUE4QyxLQUE5QztBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7O0FBeFFJO0FBQUE7QUFBQSxtQ0E2UUc7QUFBQTs7QUFDSCxvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQTtBQUNBLG1CQUFHLFVBQUgsQ0FBYyxHQUFHLFlBQWpCLEVBQStCLEtBQUssTUFBcEM7QUFDQTtBQUNBLHFCQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFVBQUMsT0FBRCxFQUFVLEtBQVYsRUFBb0I7QUFDdEM7QUFDQSx1QkFBRyxtQkFBSCxDQUNJLEtBREosRUFFSSxRQUFRLElBRlosRUFHSSxHQUFHLFFBQVEsSUFBWCxDQUhKLEVBSUksS0FKSixFQUtJLE1BQUssVUFMVCxFQU1JLFFBQVEsVUFOWjtBQU9BO0FBQ0EsdUJBQUcsdUJBQUgsQ0FBMkIsS0FBM0I7QUFDSCxpQkFYRDtBQVlBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7O0FBalNJO0FBQUE7QUFBQSxxQ0FzU0s7QUFDTCxvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQTtBQUNBLG1CQUFHLFVBQUgsQ0FBYyxHQUFHLFlBQWpCLEVBQStCLEtBQUssTUFBcEM7QUFDQSxxQkFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFDLE9BQUQsRUFBVSxLQUFWLEVBQW9CO0FBQ3RDO0FBQ0EsdUJBQUcsd0JBQUgsQ0FBNEIsS0FBNUI7QUFDSCxpQkFIRDtBQUlBLHVCQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7QUFqVEk7QUFBQTtBQUFBLG1DQTJUZTtBQUFBLG9CQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFDZixvQkFBTSxLQUFLLEtBQUssRUFBaEI7QUFDQSxvQkFBTSxPQUFPLEdBQUcsUUFBUSxJQUFSLElBQWdCLEtBQUssSUFBeEIsQ0FBYjtBQUNBLG9CQUFNLGNBQWUsUUFBUSxXQUFSLEtBQXdCLFNBQXpCLEdBQXNDLFFBQVEsV0FBOUMsR0FBNEQsS0FBSyxXQUFyRjtBQUNBLG9CQUFNLFFBQVMsUUFBUSxLQUFSLEtBQWtCLFNBQW5CLEdBQWdDLFFBQVEsS0FBeEMsR0FBZ0QsS0FBSyxLQUFuRTtBQUNBLG9CQUFJLFVBQVUsQ0FBZCxFQUFpQjtBQUNiLDBCQUFNLHNDQUFOO0FBQ0g7QUFDRDtBQUNBLG1CQUFHLFVBQUgsQ0FBYyxJQUFkLEVBQW9CLFdBQXBCLEVBQWlDLEtBQWpDO0FBQ0EsdUJBQU8sSUFBUDtBQUNIO0FBdFVHOztBQUFBO0FBQUE7O0FBeVVSLFdBQU8sT0FBUCxHQUFpQixZQUFqQjtBQUVILENBM1VBLEdBQUQ7Ozs7Ozs7OztBQ0FDLGFBQVc7O0FBRVI7O0FBRUEsUUFBTSxpQkFBaUIsT0FBdkI7QUFDQSxRQUFNLHNCQUFzQixDQUE1Qjs7QUFFQTs7Ozs7Ozs7QUFRQSxhQUFTLGlCQUFULENBQTJCLFVBQTNCLEVBQXVDO0FBQ25DLFlBQU0saUJBQWlCLEVBQXZCO0FBQ0EsZUFBTyxJQUFQLENBQVksVUFBWixFQUF3QixPQUF4QixDQUFnQyxlQUFPO0FBQ25DLGdCQUFNLFFBQVEsV0FBVyxHQUFYLENBQWQ7QUFDQTtBQUNBLGdCQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLEtBQWpCLENBQUQsSUFBNEIsUUFBUSxDQUF4QyxFQUEyQztBQUN2Qyw0Q0FBMkIsR0FBM0I7QUFDSDtBQUNELGdCQUFNLFdBQVcsV0FBVyxHQUFYLENBQWpCO0FBQ0E7QUFDQSxnQkFBSSxNQUFNLE9BQU4sQ0FBYyxRQUFkLEtBQTJCLFNBQVMsTUFBVCxHQUFrQixDQUFqRCxFQUFvRDtBQUNoRDtBQUNBLCtCQUFlLElBQWYsQ0FBb0I7QUFDaEIsMkJBQU8sS0FEUztBQUVoQiwwQkFBTTtBQUZVLGlCQUFwQjtBQUlILGFBTkQsTUFNTztBQUNILDZEQUE0QyxLQUE1QztBQUNIO0FBQ0osU0FqQkQ7QUFrQkE7QUFDQSx1QkFBZSxJQUFmLENBQW9CLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUMxQixtQkFBTyxFQUFFLEtBQUYsR0FBVSxFQUFFLEtBQW5CO0FBQ0gsU0FGRDtBQUdBLGVBQU8sY0FBUDtBQUNIOztBQUVEOzs7Ozs7OztBQVFBLGFBQVMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUM7QUFDakM7QUFDQSxZQUFJLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBSixFQUE4QjtBQUMxQixtQkFBTyxVQUFVLE1BQWpCO0FBQ0g7QUFDRDtBQUNBLFlBQUksVUFBVSxDQUFWLEtBQWdCLFNBQXBCLEVBQStCO0FBQzNCO0FBQ0EsZ0JBQUksVUFBVSxDQUFWLEtBQWdCLFNBQXBCLEVBQStCO0FBQzNCO0FBQ0Esb0JBQUksVUFBVSxDQUFWLEtBQWdCLFNBQXBCLEVBQStCO0FBQzNCO0FBQ0Esd0JBQUksVUFBVSxDQUFWLEtBQWdCLFNBQXBCLEVBQStCO0FBQzNCO0FBQ0EsK0JBQU8sQ0FBUDtBQUNIO0FBQ0QsMkJBQU8sQ0FBUDtBQUNIO0FBQ0QsdUJBQU8sQ0FBUDtBQUNIO0FBQ0QsbUJBQU8sQ0FBUDtBQUNIO0FBQ0Q7QUFDQSxlQUFPLENBQVA7QUFDSDs7QUFFRDs7Ozs7OztBQU9BLGFBQVMsb0JBQVQsQ0FBOEIsYUFBOUIsRUFBNkMsVUFBN0MsRUFBeUQ7QUFDckQsWUFBSSxnQkFBZ0IsT0FBTyxTQUEzQjtBQUNBLFlBQUksU0FBUyxDQUFiO0FBQ0E7QUFDQSxtQkFBVyxPQUFYLENBQW1CLG9CQUFZO0FBQzNCO0FBQ0EsZ0JBQU0sT0FBTyxpQkFBaUIsU0FBUyxJQUFULENBQWMsQ0FBZCxDQUFqQixDQUFiO0FBQ0E7QUFDQSw0QkFBZ0IsS0FBSyxHQUFMLENBQVMsYUFBVCxFQUF3QixTQUFTLElBQVQsQ0FBYyxNQUF0QyxDQUFoQjtBQUNBO0FBQ0EsMEJBQWMsUUFBZCxDQUF1QixHQUF2QixDQUEyQixTQUFTLEtBQXBDLEVBQTJDO0FBQ3ZDLHNCQUFNLGNBRGlDO0FBRXZDLHNCQUFNLElBRmlDO0FBR3ZDLDRCQUFZLFNBQVM7QUFIa0IsYUFBM0M7QUFLQTtBQUNBLHNCQUFVLElBQVY7QUFDSCxTQWJEO0FBY0E7QUFDQSxzQkFBYyxNQUFkLEdBQXVCLE1BQXZCLENBbkJxRCxDQW1CdEI7QUFDL0I7QUFDQSxzQkFBYyxNQUFkLEdBQXVCLGFBQXZCO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxhQUFTLGlCQUFULENBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTZDLE1BQTdDLEVBQXFELE1BQXJELEVBQTZELE1BQTdELEVBQXFFO0FBQ2pFLGFBQUssSUFBSSxJQUFFLENBQVgsRUFBYyxJQUFFLE1BQWhCLEVBQXdCLEdBQXhCLEVBQTZCO0FBQ3pCLGdCQUFNLFNBQVMsU0FBUyxDQUFULENBQWY7QUFDQTtBQUNBLGdCQUFNLElBQUksU0FBVSxTQUFTLENBQTdCO0FBQ0EsZ0JBQUksT0FBTyxDQUFQLEtBQWEsU0FBakIsRUFBNEI7QUFDeEIsdUJBQU8sQ0FBUCxJQUFZLE9BQU8sQ0FBbkI7QUFDSCxhQUZELE1BRU8sSUFBSSxPQUFPLENBQVAsTUFBYyxTQUFsQixFQUE2QjtBQUNoQyx1QkFBTyxDQUFQLElBQVksT0FBTyxDQUFQLENBQVo7QUFDSCxhQUZNLE1BRUE7QUFDSCx1QkFBTyxDQUFQLElBQVksTUFBWjtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7OztBQVVBLGFBQVMsaUJBQVQsQ0FBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNkMsTUFBN0MsRUFBcUQsTUFBckQsRUFBNkQsTUFBN0QsRUFBcUU7QUFDakUsYUFBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUUsTUFBaEIsRUFBd0IsR0FBeEIsRUFBNkI7QUFDekIsZ0JBQU0sU0FBUyxTQUFTLENBQVQsQ0FBZjtBQUNBO0FBQ0EsZ0JBQU0sSUFBSSxTQUFVLFNBQVMsQ0FBN0I7QUFDQSxtQkFBTyxDQUFQLElBQWEsT0FBTyxDQUFQLEtBQWEsU0FBZCxHQUEyQixPQUFPLENBQWxDLEdBQXNDLE9BQU8sQ0FBUCxDQUFsRDtBQUNBLG1CQUFPLElBQUUsQ0FBVCxJQUFlLE9BQU8sQ0FBUCxLQUFhLFNBQWQsR0FBMkIsT0FBTyxDQUFsQyxHQUFzQyxPQUFPLENBQVAsQ0FBcEQ7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7O0FBVUEsYUFBUyxpQkFBVCxDQUEyQixNQUEzQixFQUFtQyxRQUFuQyxFQUE2QyxNQUE3QyxFQUFxRCxNQUFyRCxFQUE2RCxNQUE3RCxFQUFxRTtBQUNqRSxhQUFLLElBQUksSUFBRSxDQUFYLEVBQWMsSUFBRSxNQUFoQixFQUF3QixHQUF4QixFQUE2QjtBQUN6QixnQkFBTSxTQUFTLFNBQVMsQ0FBVCxDQUFmO0FBQ0E7QUFDQSxnQkFBTSxJQUFJLFNBQVUsU0FBUyxDQUE3QjtBQUNBLG1CQUFPLENBQVAsSUFBYSxPQUFPLENBQVAsS0FBYSxTQUFkLEdBQTJCLE9BQU8sQ0FBbEMsR0FBc0MsT0FBTyxDQUFQLENBQWxEO0FBQ0EsbUJBQU8sSUFBRSxDQUFULElBQWUsT0FBTyxDQUFQLEtBQWEsU0FBZCxHQUEyQixPQUFPLENBQWxDLEdBQXNDLE9BQU8sQ0FBUCxDQUFwRDtBQUNBLG1CQUFPLElBQUUsQ0FBVCxJQUFlLE9BQU8sQ0FBUCxLQUFhLFNBQWQsR0FBMkIsT0FBTyxDQUFsQyxHQUFzQyxPQUFPLENBQVAsQ0FBcEQ7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7O0FBVUEsYUFBUyxpQkFBVCxDQUEyQixNQUEzQixFQUFtQyxRQUFuQyxFQUE2QyxNQUE3QyxFQUFxRCxNQUFyRCxFQUE2RCxNQUE3RCxFQUFxRTtBQUNqRSxhQUFLLElBQUksSUFBRSxDQUFYLEVBQWMsSUFBRSxNQUFoQixFQUF3QixHQUF4QixFQUE2QjtBQUN6QixnQkFBTSxTQUFTLFNBQVMsQ0FBVCxDQUFmO0FBQ0E7QUFDQSxnQkFBTSxJQUFJLFNBQVUsU0FBUyxDQUE3QjtBQUNBLG1CQUFPLENBQVAsSUFBYSxPQUFPLENBQVAsS0FBYSxTQUFkLEdBQTJCLE9BQU8sQ0FBbEMsR0FBc0MsT0FBTyxDQUFQLENBQWxEO0FBQ0EsbUJBQU8sSUFBRSxDQUFULElBQWUsT0FBTyxDQUFQLEtBQWEsU0FBZCxHQUEyQixPQUFPLENBQWxDLEdBQXNDLE9BQU8sQ0FBUCxDQUFwRDtBQUNBLG1CQUFPLElBQUUsQ0FBVCxJQUFlLE9BQU8sQ0FBUCxLQUFhLFNBQWQsR0FBMkIsT0FBTyxDQUFsQyxHQUFzQyxPQUFPLENBQVAsQ0FBcEQ7QUFDQSxtQkFBTyxJQUFFLENBQVQsSUFBZSxPQUFPLENBQVAsS0FBYSxTQUFkLEdBQTJCLE9BQU8sQ0FBbEMsR0FBc0MsT0FBTyxDQUFQLENBQXBEO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7QUFuTVEsUUF1TUYsYUF2TUU7O0FBeU1KOzs7OztBQUtBLCtCQUFZLFVBQVosRUFBd0I7QUFBQTs7QUFDcEIsaUJBQUssTUFBTCxHQUFjLENBQWQ7QUFDQSxpQkFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGlCQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixJQUFJLEdBQUosRUFBaEI7QUFDQSxnQkFBSSxVQUFKLEVBQWdCO0FBQ1oscUJBQUssR0FBTCxDQUFTLFVBQVQ7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7QUF4Tkk7QUFBQTtBQUFBLGdDQStOQSxVQS9OQSxFQStOWTtBQUNaO0FBQ0EsNkJBQWEsa0JBQWtCLFVBQWxCLENBQWI7QUFDQTtBQUNBLHFDQUFxQixJQUFyQixFQUEyQixVQUEzQjtBQUNBO0FBQ0Esb0JBQU0sU0FBUyxLQUFLLE1BQXBCO0FBQ0Esb0JBQU0sU0FBUyxLQUFLLE1BQXBCLENBUFksQ0FPZ0I7QUFDNUIsb0JBQU0sV0FBVyxLQUFLLFFBQXRCO0FBQ0Esb0JBQU0sU0FBUyxLQUFLLE1BQUwsR0FBYyxJQUFJLFlBQUosQ0FBaUIsU0FBUyxNQUExQixDQUE3QjtBQUNBO0FBQ0EsMkJBQVcsT0FBWCxDQUFtQixvQkFBWTtBQUMzQjtBQUNBLHdCQUFNLFVBQVUsU0FBUyxHQUFULENBQWEsU0FBUyxLQUF0QixDQUFoQjtBQUNBO0FBQ0Esd0JBQU0sU0FBUyxRQUFRLFVBQVIsR0FBcUIsbUJBQXBDO0FBQ0E7QUFDQSw0QkFBUSxRQUFRLElBQWhCO0FBQ0ksNkJBQUssQ0FBTDtBQUNJLDhDQUFrQixNQUFsQixFQUEwQixTQUFTLElBQW5DLEVBQXlDLE1BQXpDLEVBQWlELE1BQWpELEVBQXlELE1BQXpEO0FBQ0E7QUFDSiw2QkFBSyxDQUFMO0FBQ0ksOENBQWtCLE1BQWxCLEVBQTBCLFNBQVMsSUFBbkMsRUFBeUMsTUFBekMsRUFBaUQsTUFBakQsRUFBeUQsTUFBekQ7QUFDQTtBQUNKLDZCQUFLLENBQUw7QUFDSSw4Q0FBa0IsTUFBbEIsRUFBMEIsU0FBUyxJQUFuQyxFQUF5QyxNQUF6QyxFQUFpRCxNQUFqRCxFQUF5RCxNQUF6RDtBQUNBO0FBQ0o7QUFDSSw4Q0FBa0IsTUFBbEIsRUFBMEIsU0FBUyxJQUFuQyxFQUF5QyxNQUF6QyxFQUFpRCxNQUFqRCxFQUF5RCxNQUF6RDtBQUNBO0FBWlI7QUFjSCxpQkFwQkQ7QUFxQkEsdUJBQU8sSUFBUDtBQUNIO0FBaFFHOztBQUFBO0FBQUE7O0FBbVFSLFdBQU8sT0FBUCxHQUFpQixhQUFqQjtBQUVILENBclFBLEdBQUQ7Ozs7Ozs7OztBQ0FDLGFBQVc7O0FBRVI7O0FBRUEsUUFBTSxlQUFlLFFBQVEsZ0JBQVIsQ0FBckI7O0FBRUE7Ozs7Ozs7OztBQVNBLGFBQVMsR0FBVCxDQUFhLFFBQWIsRUFBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsS0FBN0IsRUFBb0MsTUFBcEMsRUFBNEM7QUFDeEMsWUFBTSxLQUFLLFNBQVMsRUFBcEI7QUFDQSxZQUFLLE1BQU0sU0FBUCxHQUFvQixDQUFwQixHQUF3QixTQUFTLENBQXJDO0FBQ0EsWUFBSyxNQUFNLFNBQVAsR0FBb0IsQ0FBcEIsR0FBd0IsU0FBUyxDQUFyQztBQUNBLGdCQUFTLFVBQVUsU0FBWCxHQUF3QixLQUF4QixHQUFnQyxTQUFTLEtBQWpEO0FBQ0EsaUJBQVUsV0FBVyxTQUFaLEdBQXlCLE1BQXpCLEdBQWtDLFNBQVMsTUFBcEQ7QUFDQSxXQUFHLFFBQUgsQ0FBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixLQUFsQixFQUF5QixNQUF6QjtBQUNIOztBQUVEOzs7OztBQXhCUSxRQTRCRixRQTVCRTs7QUE4Qko7Ozs7Ozs7QUFPQSw0QkFBdUI7QUFBQSxnQkFBWCxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ25CLGlCQUFLLEVBQUwsR0FBVSxhQUFhLEdBQWIsRUFBVjtBQUNBLGlCQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0E7QUFDQSxpQkFBSyxNQUFMLENBQ0ksS0FBSyxLQUFMLElBQWMsS0FBSyxFQUFMLENBQVEsTUFBUixDQUFlLEtBRGpDLEVBRUksS0FBSyxNQUFMLElBQWUsS0FBSyxFQUFMLENBQVEsTUFBUixDQUFlLE1BRmxDO0FBR0g7O0FBRUQ7Ozs7Ozs7Ozs7QUE5Q0k7QUFBQTtBQUFBLHFDQXNEMEI7QUFBQSxvQkFBdkIsS0FBdUIsdUVBQWYsQ0FBZTtBQUFBLG9CQUFaLE1BQVksdUVBQUgsQ0FBRzs7QUFDMUIsb0JBQUksT0FBTyxLQUFQLEtBQWlCLFFBQWpCLElBQTZCLFNBQVMsQ0FBMUMsRUFBNkM7QUFDekMsb0RBQWlDLEtBQWpDO0FBQ0g7QUFDRCxvQkFBSSxPQUFPLE1BQVAsS0FBa0IsUUFBbEIsSUFBOEIsVUFBVSxDQUE1QyxFQUErQztBQUMzQyxxREFBa0MsTUFBbEM7QUFDSDtBQUNELHFCQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EscUJBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxxQkFBSyxFQUFMLENBQVEsTUFBUixDQUFlLEtBQWYsR0FBdUIsS0FBdkI7QUFDQSxxQkFBSyxFQUFMLENBQVEsTUFBUixDQUFlLE1BQWYsR0FBd0IsTUFBeEI7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7O0FBcEVJO0FBQUE7QUFBQSxtQ0E4RXlEO0FBQUEsb0JBQXhELENBQXdELHVFQUFwRCxDQUFvRDtBQUFBLG9CQUFqRCxDQUFpRCx1RUFBN0MsQ0FBNkM7QUFBQSxvQkFBMUMsS0FBMEMsdUVBQWxDLEtBQUssS0FBNkI7QUFBQSxvQkFBdEIsTUFBc0IsdUVBQWIsS0FBSyxNQUFROztBQUN6RCxvQkFBSSxPQUFPLENBQVAsS0FBYSxRQUFqQixFQUEyQjtBQUN2QixnREFBNkIsQ0FBN0I7QUFDSDtBQUNELG9CQUFJLE9BQU8sQ0FBUCxLQUFhLFFBQWpCLEVBQTJCO0FBQ3ZCLGdEQUE2QixDQUE3QjtBQUNIO0FBQ0Qsb0JBQUksT0FBTyxLQUFQLEtBQWlCLFFBQWpCLElBQTZCLFNBQVMsQ0FBMUMsRUFBNkM7QUFDekMsb0RBQWlDLEtBQWpDO0FBQ0g7QUFDRCxvQkFBSSxPQUFPLE1BQVAsS0FBa0IsUUFBbEIsSUFBOEIsVUFBVSxDQUE1QyxFQUErQztBQUMzQyxxREFBa0MsTUFBbEM7QUFDSDtBQUNEO0FBQ0EscUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0I7QUFDWix1QkFBRyxDQURTO0FBRVosdUJBQUcsQ0FGUztBQUdaLDJCQUFPLEtBSEs7QUFJWiw0QkFBUTtBQUpJLGlCQUFoQjtBQU1BO0FBQ0Esb0JBQUksSUFBSixFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLEtBQWhCLEVBQXVCLE1BQXZCO0FBQ0EsdUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7QUF2R0k7QUFBQTtBQUFBLGtDQTRHRTtBQUNGLG9CQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsS0FBc0IsQ0FBMUIsRUFBNkI7QUFDekIsMEJBQU0seUJBQU47QUFDSDtBQUNELHFCQUFLLEtBQUwsQ0FBVyxHQUFYO0FBQ0Esb0JBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN2Qix3QkFBTSxNQUFNLEtBQUssS0FBTCxDQUFXLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsQ0FBL0IsQ0FBWjtBQUNBLHdCQUFJLElBQUosRUFBVSxJQUFJLENBQWQsRUFBaUIsSUFBSSxDQUFyQixFQUF3QixJQUFJLEtBQTVCLEVBQW1DLElBQUksTUFBdkM7QUFDSCxpQkFIRCxNQUdPO0FBQ0gsd0JBQUksSUFBSjtBQUNIO0FBQ0QsdUJBQU8sSUFBUDtBQUNIO0FBeEhHOztBQUFBO0FBQUE7O0FBMkhSLFdBQU8sT0FBUCxHQUFpQixRQUFqQjtBQUVILENBN0hBLEdBQUQ7Ozs7Ozs7QUNBQyxhQUFXOztBQUVSOztBQUVBLFFBQU0sYUFBYTtBQUNmO0FBQ0EsdUJBRmUsRUFHZix3QkFIZSxFQUlmLG9CQUplLEVBS2YsMEJBTGUsRUFNZix5QkFOZSxFQU9mLDJCQVBlLEVBUWYscUJBUmUsRUFTZiwrQkFUZSxFQVVmLHFCQVZlLEVBV2Ysd0JBWGUsRUFZZixnQ0FaZSxFQWFmLGdCQWJlLEVBY2Ysb0JBZGUsRUFlZix3QkFmZSxFQWdCZiwwQkFoQmUsRUFpQmYsK0JBakJlLEVBa0JmLGtCQWxCZSxFQW1CZix3QkFuQmU7QUFvQmY7QUFDQSxrQ0FyQmUsRUFzQmYsZ0NBdEJlLEVBdUJmLDZCQXZCZSxFQXdCZiwwQkF4QmUsRUF5QmYsVUF6QmUsRUEwQmYsK0JBMUJlLEVBMkJmLDBCQTNCZSxFQTRCZix3QkE1QmUsQ0FBbkI7O0FBK0JBLFFBQU0sWUFBWSxJQUFJLEdBQUosRUFBbEI7O0FBRUEsUUFBSSxnQkFBZ0IsSUFBcEI7O0FBRUE7Ozs7OztBQU1BLGFBQVMsT0FBVCxHQUFtQjtBQUNmLFlBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBUyxDQUFULEVBQVk7QUFDeEIsZ0JBQU0sSUFBSSxLQUFLLE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBL0I7QUFDQSxnQkFBTSxJQUFLLE1BQU0sR0FBUCxHQUFjLENBQWQsR0FBbUIsSUFBSSxHQUFKLEdBQVUsR0FBdkM7QUFDQSxtQkFBTyxFQUFFLFFBQUYsQ0FBVyxFQUFYLENBQVA7QUFDSCxTQUpEO0FBS0EsZUFBTyx1Q0FBdUMsT0FBdkMsQ0FBK0MsT0FBL0MsRUFBd0QsT0FBeEQsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7OztBQVFBLGFBQVMsS0FBVCxDQUFlLE1BQWYsRUFBdUI7QUFDbkIsWUFBSSxDQUFDLE9BQU8sRUFBWixFQUFnQjtBQUNaLG1CQUFPLEVBQVAsR0FBWSxTQUFaO0FBQ0g7QUFDRCxlQUFPLE9BQU8sRUFBZDtBQUNIOztBQUVEOzs7Ozs7OztBQVFBLGFBQVMsU0FBVCxDQUFtQixHQUFuQixFQUF3QjtBQUNwQixZQUFJLGVBQWUsaUJBQW5CLEVBQXNDO0FBQ2xDLG1CQUFPLEdBQVA7QUFDSCxTQUZELE1BRU8sSUFBSSxPQUFPLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUNoQyxtQkFBTyxTQUFTLGNBQVQsQ0FBd0IsR0FBeEIsS0FDSCxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FESjtBQUVIO0FBQ0QsZUFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUEsYUFBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQztBQUM1QixZQUFJLFFBQVEsU0FBWixFQUF1QjtBQUNuQixnQkFBSSxhQUFKLEVBQW1CO0FBQ2Y7QUFDQSx1QkFBTyxhQUFQO0FBQ0g7QUFDSixTQUxELE1BS087QUFDSCxnQkFBTSxTQUFTLFVBQVUsR0FBVixDQUFmO0FBQ0EsZ0JBQUksTUFBSixFQUFZO0FBQ1IsdUJBQU8sVUFBVSxHQUFWLENBQWMsTUFBTSxNQUFOLENBQWQsQ0FBUDtBQUNIO0FBQ0o7QUFDRDtBQUNBLGVBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0M7QUFDcEMsWUFBTSxLQUFLLGVBQWUsRUFBMUI7QUFDQSxtQkFBVyxPQUFYLENBQW1CLGNBQU07QUFDckIsMkJBQWUsVUFBZixDQUEwQixHQUExQixDQUE4QixFQUE5QixFQUFrQyxHQUFHLFlBQUgsQ0FBZ0IsRUFBaEIsQ0FBbEM7QUFDSCxTQUZEO0FBR0g7O0FBRUQ7Ozs7Ozs7OztBQVNBLGFBQVMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsT0FBdEMsRUFBK0M7QUFDM0MsWUFBTSxLQUFLLE9BQU8sVUFBUCxDQUFrQixPQUFsQixFQUEyQixPQUEzQixLQUF1QyxPQUFPLFVBQVAsQ0FBa0Isb0JBQWxCLEVBQXdDLE9BQXhDLENBQWxEO0FBQ0E7QUFDQSxZQUFNLGlCQUFpQjtBQUNuQixnQkFBSSxNQUFNLE1BQU4sQ0FEZTtBQUVuQixnQkFBSSxFQUZlO0FBR25CLHdCQUFZLElBQUksR0FBSjtBQUhPLFNBQXZCO0FBS0E7QUFDQSx1QkFBZSxjQUFmO0FBQ0E7QUFDQSxrQkFBVSxHQUFWLENBQWMsTUFBTSxNQUFOLENBQWQsRUFBNkIsY0FBN0I7QUFDQTtBQUNBLHdCQUFnQixjQUFoQjtBQUNBLGVBQU8sY0FBUDtBQUNIOztBQUVELFdBQU8sT0FBUCxHQUFpQjs7QUFFYjs7Ozs7OztBQU9BLGNBQU0sY0FBUyxHQUFULEVBQWM7QUFDaEIsZ0JBQU0sVUFBVSxrQkFBa0IsR0FBbEIsQ0FBaEI7QUFDQSxnQkFBSSxPQUFKLEVBQWE7QUFDVCxnQ0FBZ0IsT0FBaEI7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxpRUFBa0QsR0FBbEQ7QUFDSCxTQWhCWTs7QUFrQmI7Ozs7Ozs7OztBQVNBLGFBQUssYUFBUyxHQUFULEVBQWMsT0FBZCxFQUF1QjtBQUN4QixnQkFBTSxVQUFVLGtCQUFrQixHQUFsQixDQUFoQjtBQUNBLGdCQUFJLE9BQUosRUFBYTtBQUNWO0FBQ0EsdUJBQU8sUUFBUSxFQUFmO0FBQ0Y7QUFDRDtBQUNBLGdCQUFNLFNBQVMsVUFBVSxHQUFWLENBQWY7QUFDQTtBQUNBLGdCQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1QsdUhBQW9HLEdBQXBHLHlDQUFvRyxHQUFwRztBQUNIO0FBQ0Q7QUFDQSxtQkFBTyxxQkFBcUIsTUFBckIsRUFBNkIsT0FBN0IsRUFBc0MsRUFBN0M7QUFDSCxTQXpDWTs7QUEyQ2I7Ozs7Ozs7O0FBUUEsZ0JBQVEsZ0JBQVMsR0FBVCxFQUFjO0FBQ2xCLGdCQUFNLFVBQVUsa0JBQWtCLEdBQWxCLENBQWhCO0FBQ0EsZ0JBQUksT0FBSixFQUFhO0FBQ1Q7QUFDQSwwQkFBVSxNQUFWLENBQWlCLFFBQVEsRUFBekI7QUFDQTtBQUNBLG9CQUFJLFlBQVksYUFBaEIsRUFBK0I7QUFDM0Isb0NBQWdCLElBQWhCO0FBQ0g7QUFDSixhQVBELE1BT087QUFDSCx1SEFBb0csR0FBcEcseUNBQW9HLEdBQXBHO0FBQ0g7QUFDSixTQS9EWTs7QUFpRWI7Ozs7Ozs7QUFPQSw2QkFBcUIsNkJBQVMsR0FBVCxFQUFjO0FBQy9CLGdCQUFNLFVBQVUsa0JBQWtCLEdBQWxCLENBQWhCO0FBQ0EsZ0JBQUksT0FBSixFQUFhO0FBQUE7QUFDVCx3QkFBTSxhQUFhLFFBQVEsVUFBM0I7QUFDQSx3QkFBTSxZQUFZLEVBQWxCO0FBQ0EsK0JBQVcsT0FBWCxDQUFtQixVQUFDLFNBQUQsRUFBWSxHQUFaLEVBQW9CO0FBQ25DLDRCQUFJLFNBQUosRUFBZTtBQUNYLHNDQUFVLElBQVYsQ0FBZSxHQUFmO0FBQ0g7QUFDSixxQkFKRDtBQUtBO0FBQUEsMkJBQU87QUFBUDtBQVJTOztBQUFBO0FBU1o7QUFDRCxtSEFBb0csR0FBcEcseUNBQW9HLEdBQXBHO0FBQ0gsU0FyRlk7O0FBdUZiOzs7Ozs7O0FBT0EsK0JBQXVCLCtCQUFTLEdBQVQsRUFBYztBQUNqQyxnQkFBTSxVQUFVLGtCQUFrQixHQUFsQixDQUFoQjtBQUNBLGdCQUFJLE9BQUosRUFBYTtBQUFBO0FBQ1Qsd0JBQU0sYUFBYSxRQUFRLFVBQTNCO0FBQ0Esd0JBQU0sY0FBYyxFQUFwQjtBQUNBLCtCQUFXLE9BQVgsQ0FBbUIsVUFBQyxTQUFELEVBQVksR0FBWixFQUFvQjtBQUNuQyw0QkFBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDWix3Q0FBWSxJQUFaLENBQWlCLEdBQWpCO0FBQ0g7QUFDSixxQkFKRDtBQUtBO0FBQUEsMkJBQU87QUFBUDtBQVJTOztBQUFBO0FBU1o7QUFDRCxtSEFBb0csR0FBcEcseUNBQW9HLEdBQXBHO0FBQ0gsU0EzR1k7O0FBNkdiOzs7Ozs7OztBQVFBLHdCQUFnQix3QkFBUyxHQUFULEVBQWMsU0FBZCxFQUF5QjtBQUNyQyxnQkFBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDWjtBQUNBLDRCQUFZLEdBQVo7QUFDQSxzQkFBTSxTQUFOO0FBQ0g7QUFDRCxnQkFBTSxVQUFVLGtCQUFrQixHQUFsQixDQUFoQjtBQUNBLGdCQUFJLE9BQUosRUFBYTtBQUNULG9CQUFNLGFBQWEsUUFBUSxVQUEzQjtBQUNBLHVCQUFPLFdBQVcsR0FBWCxDQUFlLFNBQWYsSUFBNEIsSUFBNUIsR0FBbUMsS0FBMUM7QUFDSDtBQUNELG1IQUFvRyxHQUFwRyx5Q0FBb0csR0FBcEc7QUFDSCxTQWpJWTs7QUFtSWI7Ozs7Ozs7O0FBUUEsc0JBQWMsc0JBQVMsR0FBVCxFQUFjLFNBQWQsRUFBeUI7QUFDbkMsZ0JBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ1o7QUFDQSw0QkFBWSxHQUFaO0FBQ0Esc0JBQU0sU0FBTjtBQUNIO0FBQ0QsZ0JBQU0sVUFBVSxrQkFBa0IsR0FBbEIsQ0FBaEI7QUFDQSxnQkFBSSxPQUFKLEVBQWE7QUFDVCxvQkFBTSxhQUFhLFFBQVEsVUFBM0I7QUFDQSx1QkFBTyxXQUFXLEdBQVgsQ0FBZSxTQUFmLEtBQTZCLElBQXBDO0FBQ0g7QUFDRCxtSEFBb0csR0FBcEcseUNBQW9HLEdBQXBHO0FBQ0g7QUF2SlksS0FBakI7QUEwSkgsQ0FoVEEsR0FBRDs7Ozs7QUNBQyxhQUFXOztBQUVSOztBQUVBLFdBQU8sT0FBUCxHQUFpQjtBQUNiLHFCQUFhLFFBQVEsb0JBQVIsQ0FEQTtBQUViLG9CQUFZLFFBQVEsbUJBQVIsQ0FGQztBQUdiLHNCQUFjLFFBQVEscUJBQVIsQ0FIRDtBQUliLGdCQUFRLFFBQVEsZUFBUixDQUpLO0FBS2IsbUJBQVcsUUFBUSxrQkFBUixDQUxFO0FBTWIsd0JBQWdCLFFBQVEsdUJBQVIsQ0FOSDtBQU9iLHdCQUFnQixRQUFRLHVCQUFSLENBUEg7QUFRYix3QkFBZ0IsUUFBUSx1QkFBUixDQVJIO0FBU2Isc0JBQWMsUUFBUSxxQkFBUixDQVREO0FBVWIsdUJBQWUsUUFBUSxzQkFBUixDQVZGO0FBV2Isa0JBQVUsUUFBUSxpQkFBUixDQVhHO0FBWWIsc0JBQWMsUUFBUSxxQkFBUjtBQVpELEtBQWpCO0FBZUgsQ0FuQkEsR0FBRDs7Ozs7QUNBQyxhQUFXOztBQUVSOztBQUVBLGFBQVMsV0FBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN0QixZQUFJLElBQUksQ0FBQyxDQUFUO0FBQ0EsWUFBSSxZQUFKO0FBQ0EsWUFBSSxNQUFNLE9BQU4sQ0FBYyxHQUFkLENBQUosRUFBd0I7QUFDcEIsa0JBQU0sSUFBSSxNQUFWO0FBQ0EsbUJBQU8sWUFBVztBQUNkO0FBQ0EsdUJBQU8sSUFBSSxHQUFKLEdBQVUsQ0FBVixHQUFjLElBQXJCO0FBQ0gsYUFIRDtBQUlIO0FBQ0QsWUFBSSxPQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosQ0FBWDtBQUNBLGNBQU0sS0FBSyxNQUFYO0FBQ0EsZUFBTyxZQUFXO0FBQ2Q7QUFDQSxtQkFBTyxJQUFJLEdBQUosR0FBVSxLQUFLLENBQUwsQ0FBVixHQUFvQixJQUEzQjtBQUNILFNBSEQ7QUFJSDs7QUFFRCxhQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCO0FBQ2QsZUFBTyxZQUFXO0FBQ2QsZ0JBQUksT0FBTyxJQUFYLEVBQWlCO0FBQ2I7QUFDSDtBQUNELGVBQUcsS0FBSCxDQUFTLElBQVQsRUFBZSxTQUFmO0FBQ0EsaUJBQUssSUFBTDtBQUNILFNBTkQ7QUFPSDs7QUFFRCxhQUFTLElBQVQsQ0FBYyxNQUFkLEVBQXNCLFFBQXRCLEVBQWdDLFFBQWhDLEVBQTBDO0FBQ3RDLG1CQUFXLEtBQUssUUFBTCxDQUFYO0FBQ0EsWUFBSSxZQUFKO0FBQ0EsWUFBSSxZQUFZLENBQWhCOztBQUVBLGlCQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CO0FBQ2Y7QUFDQSxnQkFBSSxHQUFKLEVBQVM7QUFDTCx5QkFBUyxHQUFUO0FBQ0gsYUFGRCxNQUVPLElBQUksUUFBUSxJQUFSLElBQWdCLGFBQWEsQ0FBakMsRUFBb0M7QUFDdkM7QUFDQTtBQUNBLHlCQUFTLElBQVQ7QUFDSDtBQUNKOztBQUVELFlBQUksT0FBTyxZQUFZLE1BQVosQ0FBWDtBQUNBLGVBQU8sQ0FBQyxNQUFNLE1BQVAsTUFBbUIsSUFBMUIsRUFBZ0M7QUFDNUIseUJBQWEsQ0FBYjtBQUNBLHFCQUFTLE9BQU8sR0FBUCxDQUFULEVBQXNCLEdBQXRCLEVBQTJCLElBQTNCO0FBQ0g7QUFDRCxZQUFJLGNBQWMsQ0FBbEIsRUFBcUI7QUFDakIscUJBQVMsSUFBVDtBQUNIO0FBQ0o7O0FBRUQsV0FBTyxPQUFQLEdBQWlCOztBQUViOzs7Ozs7Ozs7O0FBVUEsa0JBQVUsa0JBQVMsS0FBVCxFQUFnQixRQUFoQixFQUEwQjtBQUNoQyxnQkFBSSxVQUFVLE1BQU0sT0FBTixDQUFjLEtBQWQsSUFBdUIsRUFBdkIsR0FBNEIsRUFBMUM7QUFDQSxpQkFBSyxLQUFMLEVBQVksVUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQixJQUFwQixFQUEwQjtBQUNsQyxxQkFBSyxVQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CO0FBQ3BCLDRCQUFRLEdBQVIsSUFBZSxHQUFmO0FBQ0EseUJBQUssR0FBTDtBQUNILGlCQUhEO0FBSUgsYUFMRCxFQUtHLFVBQVMsR0FBVCxFQUFjO0FBQ2IseUJBQVMsR0FBVCxFQUFjLE9BQWQ7QUFDSCxhQVBEO0FBUUg7O0FBdEJZLEtBQWpCO0FBMEJILENBcEZBLEdBQUQ7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxXQUFPLE9BQVAsR0FBaUI7O0FBRWI7Ozs7Ozs7OztBQVNBLGNBQU0sZ0JBQXdCO0FBQUEsZ0JBQWQsT0FBYyx1RUFBSixFQUFJOztBQUMxQixnQkFBTSxRQUFRLElBQUksS0FBSixFQUFkO0FBQ0Esa0JBQU0sTUFBTixHQUFlLFlBQU07QUFDakIsb0JBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ2pCLDRCQUFRLE9BQVIsQ0FBZ0IsS0FBaEI7QUFDSDtBQUNKLGFBSkQ7QUFLQSxrQkFBTSxPQUFOLEdBQWdCLFVBQUMsS0FBRCxFQUFXO0FBQ3ZCLG9CQUFJLFFBQVEsS0FBWixFQUFtQjtBQUNmLHdCQUFNLDJDQUEwQyxNQUFNLElBQU4sQ0FBVyxDQUFYLEVBQWMsVUFBeEQsTUFBTjtBQUNBLDRCQUFRLEtBQVIsQ0FBYyxHQUFkO0FBQ0g7QUFDSixhQUxEO0FBTUEsa0JBQU0sV0FBTixHQUFvQixRQUFRLFdBQVIsR0FBc0IsV0FBdEIsR0FBb0MsU0FBeEQ7QUFDQSxrQkFBTSxHQUFOLEdBQVksUUFBUSxHQUFwQjtBQUNIO0FBMUJZLEtBQWpCO0FBNkJILENBakNBLEdBQUQ7Ozs7O0FDQUMsYUFBVzs7QUFFUjs7QUFFQSxRQUFNLE9BQU8sRUFBYjs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFLLFlBQUwsR0FBb0IsVUFBUyxHQUFULEVBQWM7QUFDOUIsZUFBTyxlQUFlLFNBQWYsSUFDSCxlQUFlLGdCQURaLElBRUgsZUFBZSxpQkFGWixJQUdILGVBQWUsZ0JBSG5CO0FBSUgsS0FMRDs7QUFPQTs7Ozs7OztBQU9BLFNBQUssZ0JBQUwsR0FBd0IsVUFBUyxJQUFULEVBQWU7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsZUFBTyxLQUFLLE1BQUwsSUFDSCxLQUFLLEtBQUwsS0FBZSxRQURaLElBRUgsS0FBSyxLQUFMLEtBQWUsaUJBRlosSUFHSCxLQUFLLEtBQUwsS0FBZSxRQUhaLElBSUgsS0FBSyxLQUFMLEtBQWUsaUJBSm5CO0FBS0gsS0FURDs7QUFXQTs7Ozs7OztBQU9BLFNBQUssWUFBTCxHQUFvQixVQUFTLEdBQVQsRUFBYztBQUM5QixlQUFRLFFBQVEsQ0FBVCxHQUFjLENBQUMsTUFBTyxNQUFNLENBQWQsTUFBc0IsQ0FBcEMsR0FBd0MsS0FBL0M7QUFDSCxLQUZEOztBQUlBOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBSyxxQkFBTCxHQUE2QixVQUFTLEdBQVQsRUFBYztBQUN2QyxZQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ1gsa0JBQU0sTUFBSSxDQUFWO0FBQ0g7QUFDRCxlQUFPLE9BQU8sQ0FBZDtBQUNBLGVBQU8sT0FBTyxDQUFkO0FBQ0EsZUFBTyxPQUFPLENBQWQ7QUFDQSxlQUFPLE9BQU8sQ0FBZDtBQUNBLGVBQU8sT0FBTyxFQUFkO0FBQ0EsZUFBTyxNQUFNLENBQWI7QUFDSCxLQVZEOztBQVlBOzs7Ozs7Ozs7QUFTQSxTQUFLLFlBQUwsR0FBb0IsVUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQjtBQUNwQyxZQUFJLENBQUMsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUFELElBQ0MsS0FBSyxZQUFMLENBQWtCLElBQUksS0FBdEIsS0FBZ0MsS0FBSyxZQUFMLENBQWtCLElBQUksTUFBdEIsQ0FEckMsRUFDcUU7QUFDakUsbUJBQU8sR0FBUDtBQUNIO0FBQ0Q7QUFDQSxZQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQSxlQUFPLEtBQVAsR0FBZSxLQUFLLHFCQUFMLENBQTJCLElBQUksS0FBL0IsQ0FBZjtBQUNBLGVBQU8sTUFBUCxHQUFnQixLQUFLLHFCQUFMLENBQTJCLElBQUksTUFBL0IsQ0FBaEI7QUFDQTtBQUNBLFlBQU0sTUFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWjtBQUNBLFlBQUksU0FBSixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsSUFBSSxLQUE3QixFQUFvQyxJQUFJLE1BQXhDLEVBQWdELENBQWhELEVBQW1ELENBQW5ELEVBQXNELE9BQU8sS0FBN0QsRUFBb0UsT0FBTyxNQUEzRTtBQUNBLGVBQU8sTUFBUDtBQUNILEtBYkQ7O0FBZUEsV0FBTyxPQUFQLEdBQWlCLElBQWpCO0FBRUgsQ0FyR0EsR0FBRDs7Ozs7QUNBQyxhQUFXOztBQUVSOztBQUVBLFdBQU8sT0FBUCxHQUFpQjs7QUFFYjs7Ozs7Ozs7OztBQVVBLGNBQU0sY0FBVSxPQUFWLEVBQW1CO0FBQ3JCLGdCQUFNLFVBQVUsSUFBSSxjQUFKLEVBQWhCO0FBQ0Esb0JBQVEsSUFBUixDQUFhLEtBQWIsRUFBb0IsUUFBUSxHQUE1QixFQUFpQyxJQUFqQztBQUNBLG9CQUFRLFlBQVIsR0FBdUIsUUFBUSxZQUEvQjtBQUNBLG9CQUFRLGtCQUFSLEdBQTZCLFlBQU07QUFDL0Isb0JBQUksUUFBUSxVQUFSLEtBQXVCLENBQTNCLEVBQThCO0FBQzFCLHdCQUFJLFFBQVEsTUFBUixLQUFtQixHQUF2QixFQUE0QjtBQUN4Qiw0QkFBSSxRQUFRLE9BQVosRUFBcUI7QUFDakIsb0NBQVEsT0FBUixDQUFnQixRQUFRLFFBQXhCO0FBQ0g7QUFDSixxQkFKRCxNQUlPO0FBQ0gsNEJBQUksUUFBUSxLQUFaLEVBQW1CO0FBQ2Ysb0NBQVEsS0FBUixVQUFxQixRQUFRLFdBQTdCLFNBQTRDLFFBQVEsTUFBcEQsVUFBK0QsUUFBUSxVQUF2RTtBQUNIO0FBQ0o7QUFDSjtBQUNKLGFBWkQ7QUFhQSxvQkFBUSxlQUFSLEdBQTBCLFFBQVEsV0FBUixHQUFzQixJQUF0QixHQUE2QixLQUF2RDtBQUNBLG9CQUFRLElBQVI7QUFDSDtBQS9CWSxLQUFqQjtBQWtDSCxDQXRDQSxHQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGNvbnN0IFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyk7XG4gICAgY29uc3QgSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL0ltYWdlTG9hZGVyJyk7XG4gICAgY29uc3QgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG4gICAgY29uc3QgTUFHX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgY29uc3QgTUlOX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUjogdHJ1ZSxcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCBXUkFQX01PREVTID0ge1xuICAgICAgICBSRVBFQVQ6IHRydWUsXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZVxuICAgIH07XG4gICAgY29uc3QgVFlQRVMgPSB7XG4gICAgICAgIFVOU0lHTkVEX0JZVEU6IHRydWUsXG4gICAgICAgIEZMT0FUOiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCBGT1JNQVRTID0ge1xuICAgICAgICBSR0I6IHRydWUsXG4gICAgICAgIFJHQkE6IHRydWVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgdHlwZSBmb3IgY29sb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0JZVEUnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciBjb2xvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgY29sb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9XUkFQID0gJ1JFUEVBVCc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciBjb2xvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIG1pcG1hcHBpbmcgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX01JUE1BUCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfSU5WRVJUX1kgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIENvbG9yVGV4dHVyZTJEXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgMkQgY29sb3IgdGV4dHVyZS5cbiAgICAgKiBAYXVnbWVudHMgVGV4dHVyZTJEXG4gICAgICovXG4gICAgY2xhc3MgQ29sb3JUZXh0dXJlMkQgZXh0ZW5kcyBUZXh0dXJlMkQge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBDb2xvclRleHR1cmUyRCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNwZWNpZmljYXRpb24gYXJndW1lbnRzLlxuICAgICAgICAgKiBAcGFyYW0ge0ltYWdlRGF0YXxIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fEhUTUxWaWRlb0VsZW1lbnR9IHNwZWMuaW1hZ2UgLSBUaGUgSFRNTEltYWdlRWxlbWVudCB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnVybCAtIFRoZSBIVE1MSW1hZ2VFbGVtZW50IFVSTCB0byBsb2FkIGFuZCBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7VWludDhBcnJheXxGbG9hdDMyQXJyYXl9IHNwZWMuc3JjIC0gVGhlIGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5taXBNYXAgLSBXaGV0aGVyIG9yIG5vdCBtaXAtbWFwcGluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMuaW52ZXJ0WSAtIFdoZXRoZXIgb3Igbm90IGludmVydC15IGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVtdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIGlmIHRoZSBkYXRhIGlzIGxvYWRlZCBhc3luY2hyb25vdXNseSB2aWEgYSBVUkwuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30sIGNhbGxiYWNrID0gbnVsbCkge1xuICAgICAgICAgICAgLy8gZ2V0IHNwZWNpZmljIHBhcmFtc1xuICAgICAgICAgICAgc3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPSBXUkFQX01PREVTW3NwZWMud3JhcFNdID8gc3BlYy53cmFwUyA6IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPSBXUkFQX01PREVTW3NwZWMud3JhcFRdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHNwZWMubWluRmlsdGVyID0gTUlOX0ZJTFRFUlNbc3BlYy5taW5GaWx0ZXJdID8gc3BlYy5taW5GaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIHNwZWMubWFnRmlsdGVyID0gTUFHX0ZJTFRFUlNbc3BlYy5tYWdGaWx0ZXJdID8gc3BlYy5tYWdGaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIC8vIHNldCBvdGhlciBwcm9wZXJ0aWVzXG4gICAgICAgICAgICBzcGVjLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IERFRkFVTFRfTUlQTUFQO1xuICAgICAgICAgICAgc3BlYy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBERUZBVUxUX0lOVkVSVF9ZO1xuICAgICAgICAgICAgc3BlYy5wcmVtdWx0aXBseUFscGhhID0gc3BlYy5wcmVtdWx0aXBseUFscGhhICE9PSB1bmRlZmluZWQgPyBzcGVjLnByZW11bHRpcGx5QWxwaGEgOiBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBO1xuICAgICAgICAgICAgLy8gc2V0IGZvcm1hdFxuICAgICAgICAgICAgc3BlYy5mb3JtYXQgPSBGT1JNQVRTW3NwZWMuZm9ybWF0XSA/IHNwZWMuZm9ybWF0IDogREVGQVVMVF9GT1JNQVQ7XG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmUgYmFzZWQgb24gYXJndW1lbnQgdHlwZVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGVjLnNyYyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyByZXF1ZXN0IHNvdXJjZSBmcm9tIHVybFxuICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcbiAgICAgICAgICAgICAgICAvLyBjYWxsIGJhc2UgY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICBzdXBlcihzcGVjKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBwdXQgZXh0ZW5zaW9uIGhhbmRsaW5nIGZvciBhcnJheWJ1ZmZlciAvIGltYWdlIC8gdmlkZW8gZGlmZmVyZW50aWF0aW9uXG4gICAgICAgICAgICAgICAgSW1hZ2VMb2FkZXIubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogc3BlYy5zcmMsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldCB0byB1bnNpZ25lZCBieXRlIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlID0gVXRpbC5yZXNpemVDYW52YXMoc3BlYywgaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm93IGJ1ZmZlclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKGltYWdlLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBleGVjdXRlIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWwuaXNDYW52YXNUeXBlKHNwZWMuc3JjKSkge1xuICAgICAgICAgICAgICAgIC8vIGlzIGltYWdlIC8gY2FudmFzIC8gdmlkZW8gdHlwZVxuICAgICAgICAgICAgICAgIC8vIHNldCB0byB1bnNpZ25lZCBieXRlIHR5cGVcbiAgICAgICAgICAgICAgICBzcGVjLnR5cGUgPSAnVU5TSUdORURfQllURSc7XG4gICAgICAgICAgICAgICAgc3BlYy5zcmMgPSBVdGlsLnJlc2l6ZUNhbnZhcyhzcGVjLCBzcGVjLnNyYyk7XG4gICAgICAgICAgICAgICAgLy8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgc3VwZXIoc3BlYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFycmF5LCBhcnJheWJ1ZmZlciwgb3IgbnVsbFxuICAgICAgICAgICAgICAgIGlmIChzcGVjLnNyYyA9PT0gdW5kZWZpbmVkIHx8IHNwZWMuc3JjID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQsIGFzc3VtZSB0aGlzIHRleHR1cmUgd2lsbCBiZSByZW5kZXJlZFxuICAgICAgICAgICAgICAgICAgICAvLyB0by4gSW4gdGhpcyBjYXNlIGRpc2FibGUgbWlwbWFwcGluZywgdGhlcmUgaXMgbm8gbmVlZCBhbmQgaXRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBvbmx5IGludHJvZHVjZSB2ZXJ5IHBlY3VsaWFyIGFuZCBkaWZmaWN1bHQgdG8gZGlzY2VyblxuICAgICAgICAgICAgICAgICAgICAvLyByZW5kZXJpbmcgcGhlbm9tZW5hIGluIHdoaWNoIHRoZSB0ZXh0dXJlICd0cmFuc2Zvcm1zJyBhdFxuICAgICAgICAgICAgICAgICAgICAvLyBjZXJ0YWluIGFuZ2xlcyAvIGRpc3RhbmNlcyB0byB0aGUgbWlwbWFwcGVkIChlbXB0eSkgcG9ydGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHNwZWMubWlwTWFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciBmcm9tIGFyZ1xuICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9IFRZUEVTW3NwZWMudHlwZV0gPyBzcGVjLnR5cGUgOiBERUZBVUxUX1RZUEU7XG4gICAgICAgICAgICAgICAgLy8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgc3VwZXIoc3BlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENvbG9yVGV4dHVyZTJEO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgVGV4dHVyZTJEID0gcmVxdWlyZSgnLi9UZXh0dXJlMkQnKTtcblxuICAgIGNvbnN0IE1BR19GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IE1JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IFdSQVBfTU9ERVMgPSB7XG4gICAgICAgIFJFUEVBVDogdHJ1ZSxcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZSxcbiAgICAgICAgTUlSUk9SRURfUkVQRUFUOiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCBERVBUSF9UWVBFUyA9IHtcbiAgICAgICAgVU5TSUdORURfQllURTogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IHRydWUsXG4gICAgICAgIFVOU0lHTkVEX0lOVDogdHJ1ZVxuICAgIH07XG4gICAgY29uc3QgRk9STUFUUyA9IHtcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIGRlcHRoIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9JTlQnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0ZPUk1BVCA9ICdERVBUSF9DT01QT05FTlQnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgd3JhcCBtb2RlIGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIERlcHRoVGV4dHVyZTJEXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgMkQgZGVwdGggdGV4dHVyZS5cbiAgICAgKiBAYXVnbWVudHMgVGV4dHVyZTJEXG4gICAgICovXG4gICAgY2xhc3MgRGVwdGhUZXh0dXJlMkQgZXh0ZW5kcyBUZXh0dXJlMkQge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBEZXB0aFRleHR1cmUyRCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNwZWNpZmljYXRpb24gYXJndW1lbnRzLlxuICAgICAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl9IHNwZWMuc3JjIC0gVGhlIGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudHlwZSAtIFRoZSB0ZXh0dXJlIHBpeGVsIGNvbXBvbmVudCB0eXBlLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Ioc3BlYyA9IHt9KSB7XG4gICAgICAgICAgICAvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG4gICAgICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xuICAgICAgICAgICAgc3BlYy53cmFwUyA9IFdSQVBfTU9ERVNbc3BlYy53cmFwU10gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgc3BlYy53cmFwVCA9IFdSQVBfTU9ERVNbc3BlYy53cmFwVF0gPyBzcGVjLndyYXBUIDogREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBNSU5fRklMVEVSU1tzcGVjLm1pbkZpbHRlcl0gPyBzcGVjLm1pbkZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1tzcGVjLm1hZ0ZpbHRlcl0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgLy8gc2V0IG1pcC1tYXBwaW5nIGFuZCBmb3JtYXRcbiAgICAgICAgICAgIHNwZWMubWlwTWFwID0gZmFsc2U7IC8vIGRpc2FibGUgbWlwLW1hcHBpbmdcbiAgICAgICAgICAgIHNwZWMuaW52ZXJ0WSA9IGZhbHNlOyAvLyBubyBuZWVkIHRvIGludmVydC15XG4gICAgICAgICAgICBzcGVjLnByZW11bHRpcGx5QWxwaGEgPSBmYWxzZTsgLy8gbm8gYWxwaGEgdG8gcHJlLW11bHRpcGx5XG4gICAgICAgICAgICBzcGVjLmZvcm1hdCA9IEZPUk1BVFNbc3BlYy5mb3JtYXRdID8gc3BlYy5mb3JtYXQgOiBERUZBVUxUX0ZPUk1BVDtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHN0ZW5jaWwtZGVwdGgsIG9yIGp1c3QgZGVwdGhcbiAgICAgICAgICAgIGlmIChzcGVjLmZvcm1hdCA9PT0gJ0RFUFRIX1NURU5DSUwnKSB7XG4gICAgICAgICAgICAgICAgc3BlYy50eXBlID0gJ1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3BlYy50eXBlID0gREVQVEhfVFlQRVNbc3BlYy50eXBlXSA/IHNwZWMudHlwZSA6IERFRkFVTFRfVFlQRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgc3VwZXIoc3BlYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IERlcHRoVGV4dHVyZTJEO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcblxuICAgIGNvbnN0IFRZUEVTID0ge1xuICAgICAgICBVTlNJR05FRF9CWVRFOiB0cnVlLFxuICAgICAgICBVTlNJR05FRF9TSE9SVDogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfSU5UOiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCBNT0RFUyA9IHtcbiAgICAgICAgUE9JTlRTOiB0cnVlLFxuICAgICAgICBMSU5FUzogdHJ1ZSxcbiAgICAgICAgTElORV9TVFJJUDogdHJ1ZSxcbiAgICAgICAgTElORV9MT09QOiB0cnVlLFxuICAgICAgICBUUklBTkdMRVM6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX1NUUklQOiB0cnVlLFxuICAgICAgICBUUklBTkdMRV9GQU46IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IEJZVEVTX1BFUl9UWVBFID0ge1xuICAgICAgICBVTlNJR05FRF9CWVRFOiAxLFxuICAgICAgICBVTlNJR05FRF9TSE9SVDogMixcbiAgICAgICAgVU5TSUdORURfSU5UOiA0XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGNvbXBvbmVudCB0eXBlLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9TSE9SVCc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCByZW5kZXIgbW9kZSAocHJpbWl0aXZlIHR5cGUpLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfTU9ERSA9ICdUUklBTkdMRVMnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgYnl0ZSBvZmZzZXQgdG8gcmVuZGVyIGZyb20uXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBjb3VudCBvZiBpbmRpY2VzIHRvIHJlbmRlci5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0NPVU5UID0gMDtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBJbmRleEJ1ZmZlclxuICAgICAqIEBjbGFzc2Rlc2MgQW4gaW5kZXggYnVmZmVyIGNsYXNzIHRvIGhvbGUgaW5kZXhpbmcgaW5mb3JtYXRpb24uXG4gICAgICovXG4gICAgY2xhc3MgSW5kZXhCdWZmZXIge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYW4gSW5kZXhCdWZmZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1dlYkdMQnVmZmVyfFVpbnQ4QXJyYXl8VWludDE2QXJyYXl8VWluMzJBcnJheXxBcnJheXxOdW1iZXJ9IGFyZyAtIFRoZSBpbmRleCBkYXRhIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgcmVuZGVyaW5nIG9wdGlvbnMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgdmVydGljZXMgdG8gZHJhdy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKGFyZywgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gVFlQRVNbb3B0aW9ucy50eXBlXSA/IG9wdGlvbnMudHlwZSA6IERFRkFVTFRfVFlQRTtcbiAgICAgICAgICAgIHRoaXMubW9kZSA9IE1PREVTW29wdGlvbnMubW9kZV0gPyBvcHRpb25zLm1vZGUgOiBERUZBVUxUX01PREU7XG4gICAgICAgICAgICB0aGlzLmNvdW50ID0gKG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmNvdW50IDogREVGQVVMVF9DT1VOVDtcbiAgICAgICAgICAgIHRoaXMuYnl0ZU9mZnNldCA9IChvcHRpb25zLmJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmJ5dGVPZmZzZXQgOiBERUZBVUxUX0JZVEVfT0ZGU0VUO1xuICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2ViR0xCdWZmZXIgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYnl0ZUxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBXZWJHTEJ1ZmZlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMuYnl0ZUxlbmd0aGAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IG9wdGlvbnMuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBhcmc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFyZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnl0ZSBsZW5ndGggYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBgbnVtYmVyYCBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy50eXBlYCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBBcnJheUJ1ZmZlciBhcmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBgQXJyYXlCdWZmZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBBcnJheSBvciBBcnJheUJ1ZmZlclZpZXcgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKGFyZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0VtcHR5IGJ1ZmZlciBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy50eXBlYCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwbG9hZCBpbmRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fG51bWJlcn0gYXJnIC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlckRhdGEoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBjYXN0IGFycmF5IHRvIEFycmF5QnVmZmVyVmlldyBiYXNlZCBvbiBwcm92aWRlZCB0eXBlXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHR5cGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDMyXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IG5ldyBVaW50MzJBcnJheShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0byB1aW50MTZcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gbmV3IFVpbnQxNkFycmF5KGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRvIHVpbnQ4XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IG5ldyBVaW50OEFycmF5KGFyZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuICAgICAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9TSE9SVCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhKGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuICAgICAgICAgICAgICAgICAgICAhKE51bWJlci5pc0ludGVnZXIoYXJnKSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgYEFycmF5QnVmZmVyVmlld2AsIG9yIGBudW1iZXJgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB0eXBlIGlzIHN1cHBvcnRlZCBieSBleHRlbnNpb25cbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnICYmXG4gICAgICAgICAgICAgICAgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbignT0VTX2VsZW1lbnRfaW5kZXhfdWludCcpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgSW5kZXhCdWZmZXIgb2YgdHlwZSBgVU5TSUdORURfSU5UYCBhcyBleHRlbnNpb24gYE9FU19lbGVtZW50X2luZGV4X3VpbnRgIGlzIG5vdCBzdXBwb3J0ZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9uJ3Qgb3ZlcndyaXRlIHRoZSBjb3VudCBpZiBpdCBpcyBhbHJlYWR5IHNldFxuICAgICAgICAgICAgaWYgKHRoaXMuY291bnQgPT09IERFRkFVTFRfQ09VTlQpIHtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihhcmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnQgPSAoYXJnIC8gQllURVNfUEVSX1RZUEVbdGhpcy50eXBlXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IGFyZy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGJ5dGUgbGVuZ3RoXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihhcmcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBhcmcuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBidWZmZXIgaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5XG4gICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYXJnLCBnbC5TVEFUSUNfRFJBVyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgcGFydGlhbCBpbmRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlclN1YkRhdGEoYXJyYXksIGJ5dGVPZmZzZXQgPSBERUZBVUxUX0JZVEVfT0ZGU0VUKSB7XG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0J1ZmZlciBoYXMgbm90IHlldCBiZWVuIGFsbG9jYXRlZCwgYWxsb2NhdGUgd2l0aCBgYnVmZmVyRGF0YWAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2FzdCBhcnJheSB0byBBcnJheUJ1ZmZlclZpZXcgYmFzZWQgb24gcHJvdmlkZWQgdHlwZVxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHR5cGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDMyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KGFycmF5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDE2XG4gICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQxNkFycmF5KGFycmF5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDhcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhKGFycmF5IGluc3RhbmNlb2YgVWludDhBcnJheSkgJiZcbiAgICAgICAgICAgICAgICAhKGFycmF5IGluc3RhbmNlb2YgVWludDE2QXJyYXkpICYmXG4gICAgICAgICAgICAgICAgIShhcnJheSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSAmJlxuICAgICAgICAgICAgICAgICEoYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIG9yIGBBcnJheUJ1ZmZlclZpZXdgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgd2UgYXJlbid0IG92ZXJmbG93aW5nIHRoZSBidWZmZXJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0ICsgYXJyYXkuYnl0ZUxlbmd0aCA+IHRoaXMuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBBcmd1bWVudCBvZiBsZW5ndGggJHthcnJheS5ieXRlTGVuZ3RofSBieXRlcyB3aXRoIGAgK1xuICAgICAgICAgICAgICAgICAgICBgb2Zmc2V0IG9mICR7Ynl0ZU9mZnNldH0gYnl0ZXMgb3ZlcmZsb3dzIHRoZSBidWZmZXIgYCArXG4gICAgICAgICAgICAgICAgICAgIGBsZW5ndGggb2YgJHt0aGlzLmJ5dGVMZW5ndGh9IGJ5dGVzYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ5dGVPZmZzZXQsIGFycmF5KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIGJvdW5kIGJ1ZmZlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlT2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0luZGV4QnVmZmVyfSBUaGUgaW5kZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgZHJhdyhvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGNvbnN0IG1vZGUgPSBnbFtvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlXTtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBnbFt0aGlzLnR5cGVdO1xuICAgICAgICAgICAgY29uc3QgYnl0ZU9mZnNldCA9IChvcHRpb25zLmJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmJ5dGVPZmZzZXQgOiB0aGlzLmJ5dGVPZmZzZXQ7XG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IHRoaXMuY291bnQ7XG4gICAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0ZW1wdGluZyB0byBkcmF3IHdpdGggYSBjb3VudCBvZiAwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJpbmQgYnVmZmVyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgICAgICAvLyBkcmF3IGVsZW1lbnRzXG4gICAgICAgICAgICBnbC5kcmF3RWxlbWVudHMobW9kZSwgY291bnQsIHR5cGUsIGJ5dGVPZmZzZXQpO1xuICAgICAgICAgICAgLy8gbm8gbmVlZCB0byB1bmJpbmRcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbmRleEJ1ZmZlcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGNvbnN0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG5cbiAgICBjb25zdCBURVhUVVJFX1RBUkdFVFMgPSB7XG4gICAgICAgIFRFWFRVUkVfMkQ6IHRydWUsXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVA6IHRydWVcbiAgICB9O1xuXG4gICAgY29uc3QgREVQVEhfRk9STUFUUyA9IHtcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBSZW5kZXJUYXJnZXRcbiAgICAgKiBAY2xhc3NkZXNjIEEgcmVuZGVyVGFyZ2V0IGNsYXNzIHRvIGFsbG93IHJlbmRlcmluZyB0byB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjbGFzcyBSZW5kZXJUYXJnZXQge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBSZW5kZXJUYXJnZXQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVidWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzID0gbmV3IE1hcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBiaW5kKCkge1xuICAgICAgICAgICAgLy8gYmluZCBmcmFtZWJ1ZmZlclxuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCB0aGlzLmZyYW1lYnVmZmVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVuYmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHVuYmluZCgpIHtcbiAgICAgICAgICAgIC8vIHVuYmluZCBmcmFtZWJ1ZmZlclxuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHRvIHRoZSBwcm92aWRlZCBhdHRhY2htZW50IGxvY2F0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZSAtIFRoZSB0ZXh0dXJlIHRvIGF0dGFjaC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIGF0dGFjaG1lbnQgaW5kZXguIChvcHRpb25hbClcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldCAtIFRoZSB0ZXh0dXJlIHRhcmdldCB0eXBlLiAob3B0aW9uYWwpXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHNldENvbG9yVGFyZ2V0KHRleHR1cmUsIGluZGV4LCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGlmICghdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIGFyZ3VtZW50IGlzIG1pc3NpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFRFWFRVUkVfVEFSR0VUU1tpbmRleF0gJiYgdGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIGNvbG9yIGF0dGFjaG1lbnQgaW5kZXggaXMgaW52YWxpZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFyZ2V0ICYmICFURVhUVVJFX1RBUkdFVFNbdGFyZ2V0XSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHRhcmdldCBpcyBpbnZhbGlkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXMuc2V0KGBjb2xvcl8ke2luZGV4fWAsIHRleHR1cmUpO1xuICAgICAgICAgICAgdGhpcy5iaW5kKCk7XG4gICAgICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcbiAgICAgICAgICAgICAgICBnbFsnQ09MT1JfQVRUQUNITUVOVCcgKyBpbmRleF0sXG4gICAgICAgICAgICAgICAgZ2xbdGFyZ2V0IHx8ICdURVhUVVJFXzJEJ10sXG4gICAgICAgICAgICAgICAgdGV4dHVyZS50ZXh0dXJlLFxuICAgICAgICAgICAgICAgIDApO1xuICAgICAgICAgICAgdGhpcy51bmJpbmQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHRvIHRoZSBwcm92aWRlZCBhdHRhY2htZW50IGxvY2F0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZSAtIFRoZSB0ZXh0dXJlIHRvIGF0dGFjaC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0RGVwdGhUYXJnZXQodGV4dHVyZSkge1xuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgYXJndW1lbnQgaXMgbWlzc2luZyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIURFUFRIX0ZPUk1BVFNbdGV4dHVyZS5mb3JtYXRdKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIHRleHR1cmUgaXMgbm90IG9mIGZvcm1hdCBgREVQVEhfQ09NUE9ORU5UYCBvciBgREVQVEhfU1RFTkNJTGAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgdGhpcy50ZXh0dXJlcy5zZXQoJ2RlcHRoJywgdGV4dHVyZSk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxuICAgICAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxuICAgICAgICAgICAgICAgIGdsLkRFUFRIX0FUVEFDSE1FTlQsXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLnRleHR1cmUsXG4gICAgICAgICAgICAgICAgMCk7XG4gICAgICAgICAgICB0aGlzLnVuYmluZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzaXplcyB0aGUgcmVuZGVyVGFyZ2V0IGFuZCBhbGwgYXR0YWNoZWQgdGV4dHVyZXMgYnkgdGhlIHByb3ZpZGVkIGhlaWdodCBhbmQgd2lkdGguXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSBuZXcgd2lkdGggb2YgdGhlIHJlbmRlclRhcmdldC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSByZW5kZXJUYXJnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAod2lkdGggPD0gMCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgd2lkdGhcXGAgb2YgJHt3aWR0aH0gaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgKGhlaWdodCA8PSAwKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGBoZWlnaHRcXGAgb2YgJHtoZWlnaHR9IGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlcy5mb3JFYWNoKHRleHR1cmUgPT4ge1xuICAgICAgICAgICAgICAgIHRleHR1cmUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVuZGVyVGFyZ2V0O1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgVmVydGV4UGFja2FnZSA9IHJlcXVpcmUoJy4uL2NvcmUvVmVydGV4UGFja2FnZScpO1xuICAgIGNvbnN0IFZlcnRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uL2NvcmUvVmVydGV4QnVmZmVyJyk7XG4gICAgY29uc3QgSW5kZXhCdWZmZXIgPSByZXF1aXJlKCcuLi9jb3JlL0luZGV4QnVmZmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCB2ZXJ0ZXggYnVmZmVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgY291bnRzXG4gICAgICogYXJlIG5vdCBlcXVhbC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGV4QnVmZmVycyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXhCdWZmZXJzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoZWNrVmVydGV4QnVmZmVyQ291bnRzKHZlcnRleEJ1ZmZlcnMpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gbnVsbDtcbiAgICAgICAgdmVydGV4QnVmZmVycy5mb3JFYWNoKGJ1ZmZlciA9PiB7XG4gICAgICAgICAgICBpZiAoY291bnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb3VudCA9IGJ1ZmZlci5jb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ICE9PSBidWZmZXIuY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFZlcnRleEJ1ZmZlcnMgbXVzdCBhbGwgaGF2ZSB0aGUgc2FtZSBjb3VudCB0byBiZSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGByZW5kZXJlZCB3aXRob3V0IGFuIEluZGV4QnVmZmVyLCBtaXNtYXRjaCBvZiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2NvdW50fSBhbmQgJHtidWZmZXIuY291bnR9IGZvdW5kYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBhbiBpbmRleFxuICAgICAqIG9jY3VycyBtb3JlIHRoYW4gb25jZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGV4QnVmZmVycyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXhCdWZmZXJzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoZWNrSW5kZXhDb2xsaXNpb25zKHZlcnRleEJ1ZmZlcnMpIHtcbiAgICAgICAgY29uc3QgaW5kaWNlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdmVydGV4QnVmZmVycy5mb3JFYWNoKGJ1ZmZlciA9PiB7XG4gICAgICAgICAgICBidWZmZXIucG9pbnRlcnMuZm9yRWFjaCgocG9pbnRlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudCA9IGluZGljZXMuZ2V0KGluZGV4KSB8fCAwO1xuICAgICAgICAgICAgICAgIGluZGljZXMuc2V0KGluZGV4LCBjb3VudCArIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpbmRpY2VzLmZvckVhY2goaW5kZXggPT4ge1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBNb3JlIHRoYW4gb25lIGF0dHJpYnV0ZSBwb2ludGVyIGV4aXN0cyBmb3IgaW5kZXggXFxgJHtpbmRleH1cXGBgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUmVuZGVyYWJsZVxuICAgICAqIEBjbGFzc2Rlc2MgQSBjb250YWluZXIgZm9yIG9uZSBvciBtb3JlIFZlcnRleEJ1ZmZlcnMgYW5kIGFuIG9wdGlvbmFsIEluZGV4QnVmZmVyLlxuICAgICAqL1xuICAgIGNsYXNzIFJlbmRlcmFibGUge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYW4gUmVuZGVyYWJsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHJlbmRlcmFibGUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8RmxvYXQzMkFycmF5fSBzcGVjLnZlcnRpY2VzIC0gVGhlIHZlcnRpY2VzIHRvIGludGVybGVhdmUgYW5kIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtWZXJ0ZXhCdWZmZXJ9IHNwZWMudmVydGV4QnVmZmVyIC0gQW4gZXhpc3RpbmcgdmVydGV4IGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtWZXJ0ZXhCdWZmZXJbXX0gc3BlYy52ZXJ0ZXhCdWZmZXJzIC0gTXVsdGlwbGUgZXhpc3RpbmcgdmVydGV4IGJ1ZmZlcnMuXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl9IHNwZWMuaW5kaWNlcyAtIFRoZSBpbmRpY2VzIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtJbmRleEJ1ZmZlcn0gc3BlYy5pbmRleGJ1ZmZlciAtIEFuIGV4aXN0aW5nIGluZGV4IGJ1ZmZlci5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHNwZWMgPSB7fSkge1xuICAgICAgICAgICAgaWYgKHNwZWMudmVydGV4QnVmZmVyIHx8IHNwZWMudmVydGV4QnVmZmVycykge1xuICAgICAgICAgICAgICAgIC8vIHVzZSBleGlzdGluZyB2ZXJ0ZXggYnVmZmVyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gc3BlYy52ZXJ0ZXhCdWZmZXJzIHx8IFtzcGVjLnZlcnRleEJ1ZmZlcl07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWMudmVydGljZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdmVydGV4IHBhY2thZ2VcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhQYWNrYWdlID0gbmV3IFZlcnRleFBhY2thZ2Uoc3BlYy52ZXJ0aWNlcyk7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBidWZmZXJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZXJ0ZXhCdWZmZXIodmVydGV4UGFja2FnZSlcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGVjLmluZGV4QnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIGV4aXN0aW5nIGluZGV4IGJ1ZmZlclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBzcGVjLmluZGV4QnVmZmVyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGVjLmluZGljZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgaW5kZXggYnVmZmVyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlcihzcGVjLmluZGljZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGluZGV4IGJ1ZmZlciwgY2hlY2sgdGhhdCB2ZXJ0ZXggYnVmZmVycyBhbGwgaGF2ZVxuICAgICAgICAgICAgLy8gdGhlIHNhbWUgY291bnRcbiAgICAgICAgICAgIGlmICghdGhpcy5pbmRleEJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIGNoZWNrVmVydGV4QnVmZmVyQ291bnRzKHRoaXMudmVydGV4QnVmZmVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IG5vIGF0dHJpYnV0ZSBpbmRpY2VzIGNsYXNoXG4gICAgICAgICAgICBjaGVja0luZGV4Q29sbGlzaW9ucyh0aGlzLnZlcnRleEJ1ZmZlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIHVuZGVybHlpbmcgYnVmZmVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlT2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuaW5kZXhPZmZzZXQgLSBUaGUgaW5kZXhPZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgdmVydGljZXMgdG8gZHJhdy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7UmVuZGVyYWJsZX0gLSBUaGUgcmVuZGVyYWJsZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGRyYXcob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICAvLyBkcmF3IHRoZSByZW5kZXJhYmxlXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleEJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIC8vIHVzZSBpbmRleCBidWZmZXIgdG8gZHJhdyBlbGVtZW50c1xuICAgICAgICAgICAgICAgIC8vIGJpbmQgdmVydGV4IGJ1ZmZlcnMgYW5kIGVuYWJsZSBhdHRyaWJ1dGUgcG9pbnRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIGRyYXcgcHJpbWl0aXZlcyB1c2luZyBpbmRleCBidWZmZXJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmRyYXcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgLy8gZGlzYWJsZSBhdHRyaWJ1dGUgcG9pbnRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIudW5iaW5kKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gbm8gYWR2YW50YWdlIHRvIHVuYmluZGluZyBhcyB0aGVyZSBpcyBubyBzdGFjayB1c2VkXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vIGluZGV4IGJ1ZmZlciwgdXNlIGRyYXcgYXJyYXlzXG4gICAgICAgICAgICAgICAgLy8gc2V0IGFsbCBhdHRyaWJ1dGUgcG9pbnRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleEJ1ZmZlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkcmF3IHRoZSBidWZmZXJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzWzBdLmRyYXcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRpc2FibGUgYWxsIGF0dHJpYnV0ZSBwb2ludGVyc1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5mb3JFYWNoKHZlcnRleEJ1ZmZlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci51bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJhYmxlO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcbiAgICBjb25zdCBTaGFkZXJQYXJzZXIgPSByZXF1aXJlKCcuL1NoYWRlclBhcnNlcicpO1xuICAgIGNvbnN0IEFzeW5jID0gcmVxdWlyZSgnLi4vdXRpbC9Bc3luYycpO1xuICAgIGNvbnN0IFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvWEhSTG9hZGVyJyk7XG5cbiAgICBjb25zdCBVTklGT1JNX0ZVTkNUSU9OUyA9IHtcbiAgICAgICAgJ2Jvb2wnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ2Jvb2xbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ2Zsb2F0JzogJ3VuaWZvcm0xZicsXG4gICAgICAgICdmbG9hdFtdJzogJ3VuaWZvcm0xZnYnLFxuICAgICAgICAnaW50JzogJ3VuaWZvcm0xaScsXG4gICAgICAgICdpbnRbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ3VpbnQnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ3VpbnRbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ3ZlYzInOiAndW5pZm9ybTJmdicsXG4gICAgICAgICd2ZWMyW10nOiAndW5pZm9ybTJmdicsXG4gICAgICAgICdpdmVjMic6ICd1bmlmb3JtMml2JyxcbiAgICAgICAgJ2l2ZWMyW10nOiAndW5pZm9ybTJpdicsXG4gICAgICAgICd2ZWMzJzogJ3VuaWZvcm0zZnYnLFxuICAgICAgICAndmVjM1tdJzogJ3VuaWZvcm0zZnYnLFxuICAgICAgICAnaXZlYzMnOiAndW5pZm9ybTNpdicsXG4gICAgICAgICdpdmVjM1tdJzogJ3VuaWZvcm0zaXYnLFxuICAgICAgICAndmVjNCc6ICd1bmlmb3JtNGZ2JyxcbiAgICAgICAgJ3ZlYzRbXSc6ICd1bmlmb3JtNGZ2JyxcbiAgICAgICAgJ2l2ZWM0JzogJ3VuaWZvcm00aXYnLFxuICAgICAgICAnaXZlYzRbXSc6ICd1bmlmb3JtNGl2JyxcbiAgICAgICAgJ21hdDInOiAndW5pZm9ybU1hdHJpeDJmdicsXG4gICAgICAgICdtYXQyW10nOiAndW5pZm9ybU1hdHJpeDJmdicsXG4gICAgICAgICdtYXQzJzogJ3VuaWZvcm1NYXRyaXgzZnYnLFxuICAgICAgICAnbWF0M1tdJzogJ3VuaWZvcm1NYXRyaXgzZnYnLFxuICAgICAgICAnbWF0NCc6ICd1bmlmb3JtTWF0cml4NGZ2JyxcbiAgICAgICAgJ21hdDRbXSc6ICd1bmlmb3JtTWF0cml4NGZ2JyxcbiAgICAgICAgJ3NhbXBsZXIyRCc6ICd1bmlmb3JtMWknLFxuICAgICAgICAnc2FtcGxlckN1YmUnOiAndW5pZm9ybTFpJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIG1hcCBvZiBleGlzdGluZyBhdHRyaWJ1dGVzLCBmaW5kIHRoZSBsb3dlc3QgaW5kZXggdGhhdCBpcyBub3RcbiAgICAgKiBhbHJlYWR5IHVzZWQuIElmIHRoZSBhdHRyaWJ1dGUgb3JkZXJpbmcgd2FzIGFscmVhZHkgcHJvdmlkZWQsIHVzZSB0aGF0XG4gICAgICogaW5zdGVhZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXB9IGF0dHJpYnV0ZXMgLSBUaGUgZXhpc3RpbmcgYXR0cmlidXRlcyBtYXAuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRlY2xhcmF0aW9uIC0gVGhlIGF0dHJpYnV0ZSBkZWNsYXJhdGlvbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBhdHRyaWJ1dGUgaW5kZXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXR0cmlidXRlSW5kZXgoYXR0cmlidXRlcywgZGVjbGFyYXRpb24pIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgYXR0cmlidXRlIGlzIGFscmVhZHkgZGVjbGFyZWQsIGlmIHNvLCB1c2UgdGhhdCBpbmRleFxuICAgICAgICBpZiAoYXR0cmlidXRlcy5oYXMoZGVjbGFyYXRpb24ubmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmdldChkZWNsYXJhdGlvbi5uYW1lKS5pbmRleDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gbmV4dCBhdmFpbGFibGUgaW5kZXhcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMuc2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlciBzb3VyY2UsIHBhcnNlcyB0aGUgZGVjbGFyYXRpb25zIGFuZCBhcHBlbmRzIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdG8gdGhlIHVuaWZvcm1zIGFuZCBhdHRyaWJ0dWVzIGRlY2xhcmVkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIHNoYWRlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZlcnRTb3VyY2UgLSBUaGUgdmVydGV4IHNoYWRlciBzb3VyY2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZyYWdTb3VyY2UgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXMoc2hhZGVyLCB2ZXJ0U291cmNlLCBmcmFnU291cmNlKSB7XG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9ucyA9IFNoYWRlclBhcnNlci5wYXJzZURlY2xhcmF0aW9ucyhcbiAgICAgICAgICAgIFt2ZXJ0U291cmNlLCBmcmFnU291cmNlXSxcbiAgICAgICAgICAgIFsndW5pZm9ybScsICdhdHRyaWJ1dGUnXSk7XG4gICAgICAgIC8vIGZvciBlYWNoIGRlY2xhcmF0aW9uIGluIHRoZSBzaGFkZXJcbiAgICAgICAgZGVjbGFyYXRpb25zLmZvckVhY2goZGVjbGFyYXRpb24gPT4ge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXRzIGFuIGF0dHJpYnV0ZSBvciB1bmlmb3JtXG4gICAgICAgICAgICBpZiAoZGVjbGFyYXRpb24ucXVhbGlmaWVyID09PSAnYXR0cmlidXRlJykge1xuICAgICAgICAgICAgICAgIC8vIGlmIGF0dHJpYnV0ZSwgc3RvcmUgdHlwZSBhbmQgaW5kZXhcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGdldEF0dHJpYnV0ZUluZGV4KHNoYWRlci5hdHRyaWJ1dGVzLCBkZWNsYXJhdGlvbik7XG4gICAgICAgICAgICAgICAgc2hhZGVyLmF0dHJpYnV0ZXMuc2V0KGRlY2xhcmF0aW9uLm5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBpZiAoZGVjbGFyYXRpb24ucXVhbGlmaWVyID09PSAndW5pZm9ybScpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB1bmlmb3JtLCBzdG9yZSB0eXBlIGFuZCBidWZmZXIgZnVuY3Rpb24gbmFtZVxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBkZWNsYXJhdGlvbi50eXBlICsgKGRlY2xhcmF0aW9uLmNvdW50ID4gMSA/ICdbXScgOiAnJyk7XG4gICAgICAgICAgICAgICAgc2hhZGVyLnVuaWZvcm1zLnNldChkZWNsYXJhdGlvbi5uYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlY2xhcmF0aW9uLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IFVOSUZPUk1fRlVOQ1RJT05TW3R5cGVdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgc2hhZGVyIHNvdXJjZSBzdHJpbmcgYW5kIHNoYWRlciB0eXBlLCBjb21waWxlcyB0aGUgc2hhZGVyIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgV2ViR0xTaGFkZXIgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gZ2wgLSBUaGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNoYWRlclNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHNoYWRlciB0eXBlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7V2ViR0xTaGFkZXJ9IFRoZSBjb21waWxlZCBzaGFkZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBpbGVTaGFkZXIoZ2wsIHNoYWRlclNvdXJjZSwgdHlwZSkge1xuICAgICAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2xbdHlwZV0pO1xuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJTb3VyY2UpO1xuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICAgICAgICB0aHJvdyAnQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOlxcbicgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgYXR0cmlidXRlIGxvY2F0aW9ucyBmb3IgdGhlIFNoYWRlciBvYmplY3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiaW5kQXR0cmlidXRlTG9jYXRpb25zKHNoYWRlcikge1xuICAgICAgICBjb25zdCBnbCA9IHNoYWRlci5nbDtcbiAgICAgICAgc2hhZGVyLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICAvLyBiaW5kIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25cbiAgICAgICAgICAgIGdsLmJpbmRBdHRyaWJMb2NhdGlvbihcbiAgICAgICAgICAgICAgICBzaGFkZXIucHJvZ3JhbSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuaW5kZXgsXG4gICAgICAgICAgICAgICAgbmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFF1ZXJpZXMgdGhlIHdlYmdsIHJlbmRlcmluZyBjb250ZXh0IGZvciB0aGUgdW5pZm9ybSBsb2NhdGlvbnMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRVbmlmb3JtTG9jYXRpb25zKHNoYWRlcikge1xuICAgICAgICBjb25zdCBnbCA9IHNoYWRlci5nbDtcbiAgICAgICAgY29uc3QgdW5pZm9ybXMgPSBzaGFkZXIudW5pZm9ybXM7XG4gICAgICAgIHVuaWZvcm1zLmZvckVhY2goKHVuaWZvcm0sIG5hbWUpID0+IHtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgdW5pZm9ybSBsb2NhdGlvblxuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyLnByb2dyYW0sIG5hbWUpO1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgbnVsbCwgcGFyc2UgbWF5IGRldGVjdCB1bmlmb3JtIHRoYXQgaXMgY29tcGlsZWQgb3V0XG4gICAgICAgICAgICAvLyBkdWUgdG8gYSBwcmVwcm9jZXNzb3IgZXZhbHVhdGlvbi5cbiAgICAgICAgICAgIC8vIFRPRE86IGZpeCBwYXJzZXIgc28gdGhhdCBpdCBldmFsdWF0ZXMgdGhlc2UgY29ycmVjdGx5LlxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdW5pZm9ybXMuZGVsZXRlKG5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bmlmb3JtLmxvY2F0aW9uID0gbG9jYXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIHNoYWRlciBzb3VyY2UgZnJvbSBhIHVybC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gbG9hZCB0aGUgcmVzb3VyY2UgZnJvbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gbG9hZCB0aGUgc2hhZGVyIHNvdXJjZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkU2hhZGVyU291cmNlKHVybCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgWEhSTG9hZGVyLmxvYWQoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBkb25lKG51bGwsIHJlcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNvdXJjZSBvZiB0aGUgc2hhZGVyLlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBwYXNzIHRocm91Z2ggdGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFzc1Rocm91Z2hTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICBkb25lKG51bGwsIHNvdXJjZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYW4gYXJyYXkgb2YgR0xTTCBzb3VyY2Ugc3RyaW5ncyBhbmQgVVJMcywgYW5kIHJlc29sdmVzIHRoZW0gaW50byBhbmQgYXJyYXkgb2YgR0xTTCBzb3VyY2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZXMgLSBUaGUgc2hhZGVyIHNvdXJjZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBzaGFkZXIgc291cmNlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlU291cmNlcyhzb3VyY2VzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICBjb25zdCB0YXNrcyA9IFtdO1xuICAgICAgICAgICAgc291cmNlcyA9IHNvdXJjZXMgfHwgW107XG4gICAgICAgICAgICBzb3VyY2VzID0gIUFycmF5LmlzQXJyYXkoc291cmNlcykgPyBbc291cmNlc10gOiBzb3VyY2VzO1xuICAgICAgICAgICAgc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFNoYWRlclBhcnNlci5pc0dMU0woc291cmNlKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKHBhc3NUaHJvdWdoU291cmNlKHNvdXJjZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2gobG9hZFNoYWRlclNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEFzeW5jLnBhcmFsbGVsKHRhc2tzLCBkb25lKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBzaGFkZXIgcHJvZ3JhbSBvYmplY3QgZnJvbSBzb3VyY2Ugc3RyaW5ncy4gVGhpcyBpbmNsdWRlczpcbiAgICAgKiAgICAxKSBDb21waWxpbmcgYW5kIGxpbmtpbmcgdGhlIHNoYWRlciBwcm9ncmFtLlxuICAgICAqICAgIDIpIFBhcnNpbmcgc2hhZGVyIHNvdXJjZSBmb3IgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uLlxuICAgICAqICAgIDMpIEJpbmRpbmcgYXR0cmlidXRlIGxvY2F0aW9ucywgYnkgb3JkZXIgb2YgZGVsY2FyYXRpb24uXG4gICAgICogICAgNCkgUXVlcnlpbmcgYW5kIHN0b3JpbmcgdW5pZm9ybSBsb2NhdGlvbi5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2VzIC0gQSBtYXAgY29udGFpbmluZyBzb3VyY2VzIHVuZGVyICd2ZXJ0JyBhbmQgJ2ZyYWcnIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlUHJvZ3JhbShzaGFkZXIsIHNvdXJjZXMpIHtcbiAgICAgICAgY29uc3QgZ2wgPSBzaGFkZXIuZ2w7XG4gICAgICAgIGNvbnN0IGNvbW1vbiA9IHNvdXJjZXMuY29tbW9uLmpvaW4oJycpO1xuICAgICAgICBjb25zdCB2ZXJ0ID0gc291cmNlcy52ZXJ0LmpvaW4oJycpO1xuICAgICAgICBjb25zdCBmcmFnID0gc291cmNlcy5mcmFnLmpvaW4oJycpO1xuICAgICAgICAvLyBjb21waWxlIHNoYWRlcnNcbiAgICAgICAgY29uc3QgdmVydGV4U2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgY29tbW9uICsgdmVydCwgJ1ZFUlRFWF9TSEFERVInKTtcbiAgICAgICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBjb21waWxlU2hhZGVyKGdsLCBjb21tb24gKyBmcmFnLCAnRlJBR01FTlRfU0hBREVSJyk7XG4gICAgICAgIC8vIHBhcnNlIHNvdXJjZSBmb3IgYXR0cmlidXRlIGFuZCB1bmlmb3Jtc1xuICAgICAgICBzZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXMoc2hhZGVyLCB2ZXJ0LCBmcmFnKTtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBzaGFkZXIgcHJvZ3JhbVxuICAgICAgICBzaGFkZXIucHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICAgICAgLy8gYXR0YWNoIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVyc1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyLnByb2dyYW0sIHZlcnRleFNoYWRlcik7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXIucHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuICAgICAgICAvLyBiaW5kIHZlcnRleCBhdHRyaWJ1dGUgbG9jYXRpb25zIEJFRk9SRSBsaW5raW5nXG4gICAgICAgIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoc2hhZGVyKTtcbiAgICAgICAgLy8gbGluayBzaGFkZXJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0oc2hhZGVyLnByb2dyYW0pO1xuICAgICAgICAvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxuICAgICAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIoc2hhZGVyLnByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgICAgICAgdGhyb3cgJ0FuIGVycm9yIG9jY3VyZWQgbGlua2luZyB0aGUgc2hhZGVyOlxcbicgKyBnbC5nZXRQcm9ncmFtSW5mb0xvZyhzaGFkZXIucHJvZ3JhbSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IHNoYWRlciB1bmlmb3JtIGxvY2F0aW9uc1xuICAgICAgICBnZXRVbmlmb3JtTG9jYXRpb25zKHNoYWRlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFNoYWRlclxuICAgICAqIEBjbGFzc2Rlc2MgQSBzaGFkZXIgY2xhc3MgdG8gYXNzaXN0IGluIGNvbXBpbGluZyBhbmQgbGlua2luZyB3ZWJnbCBzaGFkZXJzLCBzdG9yaW5nIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBsb2NhdGlvbnMsIGFuZCBidWZmZXJpbmcgdW5pZm9ybXMuXG4gICAgICovXG4gICAgY2xhc3MgU2hhZGVyIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zdGFudGlhdGVzIGEgU2hhZGVyIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc2hhZGVyIHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xTdHJpbmdbXXxPYmplY3R9IHNwZWMuY29tbW9uIC0gU291cmNlcyAvIFVSTHMgdG8gYmUgc2hhcmVkIGJ5IGJvdGggdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXJzLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xTdHJpbmdbXXxPYmplY3R9IHNwZWMudmVydCAtIFRoZSB2ZXJ0ZXggc2hhZGVyIHNvdXJjZXMgLyBVUkxzLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xTdHJpbmdbXXxPYmplY3R9IHNwZWMuZnJhZyAtIFRoZSBmcmFnbWVudCBzaGFkZXIgc291cmNlcyAvIFVSTHMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nW119IHNwZWMuYXR0cmlidXRlcyAtIFRoZSBhdHRyaWJ1dGUgaW5kZXggb3JkZXJpbmdzLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIG9uY2UgdGhlIHNoYWRlciBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgY29tcGlsZWQgYW5kIGxpbmtlZC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBzb3VyY2UgYXJndW1lbnRzXG4gICAgICAgICAgICBpZiAoIXNwZWMudmVydCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdWZXJ0ZXggc2hhZGVyIGFyZ3VtZW50IGB2ZXJ0YCBoYXMgbm90IGJlZW4gcHJvdmlkZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzcGVjLmZyYWcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRnJhZ21lbnQgc2hhZGVyIGFyZ3VtZW50IGBmcmFnYCBoYXMgbm90IGJlZW4gcHJvdmlkZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9ncmFtID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICB0aGlzLnZlcnNpb24gPSBzcGVjLnZlcnNpb24gfHwgJzEuMDAnO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgdGhpcy51bmlmb3JtcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIC8vIGlmIGF0dHJpYnV0ZSBvcmRlcmluZyBpcyBwcm92aWRlZCwgdXNlIHRob3NlIGluZGljZXNcbiAgICAgICAgICAgIGlmIChzcGVjLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBzcGVjLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnNldChhdHRyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHNoYWRlclxuICAgICAgICAgICAgQXN5bmMucGFyYWxsZWwoe1xuICAgICAgICAgICAgICAgIGNvbW1vbjogcmVzb2x2ZVNvdXJjZXMoc3BlYy5jb21tb24pLFxuICAgICAgICAgICAgICAgIHZlcnQ6IHJlc29sdmVTb3VyY2VzKHNwZWMudmVydCksXG4gICAgICAgICAgICAgICAgZnJhZzogcmVzb2x2ZVNvdXJjZXMoc3BlYy5mcmFnKSxcbiAgICAgICAgICAgIH0sIChlcnIsIHNvdXJjZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gb25jZSBhbGwgc2hhZGVyIHNvdXJjZXMgYXJlIGxvYWRlZFxuICAgICAgICAgICAgICAgIGNyZWF0ZVByb2dyYW0odGhpcywgc291cmNlcyk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSBzaGFkZXIgcHJvZ3JhbSBmb3IgdXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB1c2UoKSB7XG4gICAgICAgICAgICAvLyB1c2UgdGhlIHNoYWRlclxuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWZmZXIgYSB1bmlmb3JtIHZhbHVlIGJ5IG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIHVuaWZvcm0gbmFtZSBpbiB0aGUgc2hhZGVyIHNvdXJjZS5cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB1bmlmb3JtIHZhbHVlIHRvIGJ1ZmZlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7U2hhZGVyfSAtIFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRVbmlmb3JtKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCB1bmlmb3JtID0gdGhpcy51bmlmb3Jtcy5nZXQobmFtZSk7XG4gICAgICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBzcGVjIGV4aXN0cyBmb3IgdGhlIG5hbWVcbiAgICAgICAgICAgIGlmICghdW5pZm9ybSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBObyB1bmlmb3JtIGZvdW5kIHVuZGVyIG5hbWUgXFxgJHtuYW1lfVxcYGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB2YWx1ZVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBhcmd1bWVudCBpcyBkZWZpbmVkXG4gICAgICAgICAgICAgICAgdGhyb3cgYFZhbHVlIHBhc3NlZCBmb3IgdW5pZm9ybSBcXGAke25hbWV9XFxgIGlzIHVuZGVmaW5lZCBvciBudWxsYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCB0aGUgdW5pZm9ybVxuICAgICAgICAgICAgLy8gTk9URTogY2hlY2tpbmcgdHlwZSBieSBzdHJpbmcgY29tcGFyaXNvbiBpcyBmYXN0ZXIgdGhhbiB3cmFwcGluZ1xuICAgICAgICAgICAgLy8gdGhlIGZ1bmN0aW9ucy5cbiAgICAgICAgICAgIGlmICh1bmlmb3JtLnR5cGUgPT09ICdtYXQyJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQzJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQ0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2xbdW5pZm9ybS5mdW5jXSh1bmlmb3JtLmxvY2F0aW9uLCBmYWxzZSwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdsW3VuaWZvcm0uZnVuY10odW5pZm9ybS5sb2NhdGlvbiwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQnVmZmVyIGEgbWFwIG9mIHVuaWZvcm0gdmFsdWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdW5pZm9ybXMgLSBUaGUgbWFwIG9mIHVuaWZvcm1zIGtleWVkIGJ5IG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHNldFVuaWZvcm1zKGFyZ3MpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFyZ3MpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVbmlmb3JtKG5hbWUsIGFyZ3NbbmFtZV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gU2hhZGVyO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgQ09NTUVOVFNfUkVHRVhQID0gLyhcXC9cXCooW1xcc1xcU10qPylcXCpcXC8pfChcXC9cXC8oLiopJCkvZ207XG4gICAgY29uc3QgRU5ETElORV9SRUdFWFAgPSAvKFxcclxcbnxcXG58XFxyKS9nbTtcbiAgICBjb25zdCBXSElURVNQQUNFX1JFR0VYUCA9IC9cXHN7Mix9L2c7XG4gICAgY29uc3QgQlJBQ0tFVF9XSElURVNQQUNFX1JFR0VYUCA9IC8oXFxzKikoXFxbKShcXHMqKShcXGQrKShcXHMqKShcXF0pKFxccyopL2c7XG4gICAgY29uc3QgTkFNRV9DT1VOVF9SRUdFWFAgPSAvKFthLXpBLVpfXVthLXpBLVowLTlfXSopKD86XFxbKFxcZCspXFxdKT8vO1xuICAgIGNvbnN0IFBSRUNJU0lPTl9SRUdFWCA9IC9cXGJwcmVjaXNpb25cXHMrXFx3K1xccytcXHcrOy9nO1xuICAgIGNvbnN0IElOTElORV9QUkVDSVNJT05fUkVHRVggPSAvXFxiKGhpZ2hwfG1lZGl1bXB8bG93cClcXHMrL2c7XG4gICAgY29uc3QgR0xTTF9SRUdFWFAgPSAvdm9pZFxccyttYWluXFxzKlxcKFxccyoodm9pZCkqXFxzKlxcKVxccyovbWk7XG4gICAgY29uc3QgUFJFUF9SRUdFWFAgPSAvIyhbXFxXXFx3XFxzXFxkXSkoPzouKlxcXFxyP1xcbikqLiokL2dtO1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBzdGFuZGFyZCBjb21tZW50cyBmcm9tIHRoZSBwcm92aWRlZCBzdHJpbmcuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgc3RyaW5nIHRvIHN0cmlwIGNvbW1lbnRzIGZyb20uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb21tZW50bGVzcyBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RyaXBDb21tZW50cyhzdHIpIHtcbiAgICAgICAgLy8gcmVnZXggc291cmNlOiBodHRwczovL2dpdGh1Yi5jb20vbW9hZ3JpdXMvc3RyaXBjb21tZW50c1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoQ09NTUVOVFNfUkVHRVhQLCAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbiBwcmVjaXNpb24gc3RhdGVtZW50cy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZSAtIFRoZSB1bnByb2Nlc3NlZCBzb3VyY2UgY29kZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHByb2Nlc3NlZCBzb3VyY2UgY29kZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdHJpcFByZWNpc2lvbihzb3VyY2UpIHtcbiAgICAgICAgLy8gcmVtb3ZlIGdsb2JhbCBwcmVjaXNpb24gZGVjbGFyYXRpb25zXG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKFBSRUNJU0lPTl9SRUdFWCwgJycpO1xuICAgICAgICAvLyByZW1vdmUgaW5saW5lIHByZWNpc2lvbiBkZWNsYXJhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5yZXBsYWNlKElOTElORV9QUkVDSVNJT05fUkVHRVgsICcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhbGwgd2hpdGVzcGFjZSBpbnRvIGEgc2luZ2xlICcgJyBzcGFjZSBjaGFyYWN0ZXIuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgc3RyaW5nIHRvIG5vcm1hbGl6ZSB3aGl0ZXNwYWNlIGZyb20uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBub3JtYWxpemVkIHN0cmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBub3JtYWxpemVXaGl0ZXNwYWNlKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoRU5ETElORV9SRUdFWFAsICcgJykgLy8gcmVtb3ZlIGxpbmUgZW5kaW5nc1xuICAgICAgICAgICAgLnJlcGxhY2UoV0hJVEVTUEFDRV9SRUdFWFAsICcgJykgLy8gbm9ybWFsaXplIHdoaXRlc3BhY2UgdG8gc2luZ2xlICcgJ1xuICAgICAgICAgICAgLnJlcGxhY2UoQlJBQ0tFVF9XSElURVNQQUNFX1JFR0VYUCwgJyQyJDQkNicpOyAvLyByZW1vdmUgd2hpdGVzcGFjZSBpbiBicmFja2V0c1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlcyB0aGUgbmFtZSBhbmQgY291bnQgb3V0IG9mIGEgbmFtZSBzdGF0ZW1lbnQsIHJldHVybmluZyB0aGUgZGVjbGFyYXRpb24gb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcXVhbGlmaWVyIC0gVGhlIHF1YWxpZmllciBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVudHJ5IC0gVGhlIHZhcmlhYmxlIGRlY2xhcmF0aW9uIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGRlY2xhcmF0aW9uIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZU5hbWVBbmRDb3VudChxdWFsaWZpZXIsIHR5cGUsIGVudHJ5KSB7XG4gICAgICAgIC8vIGRldGVybWluZSBuYW1lIGFuZCBzaXplIG9mIHZhcmlhYmxlXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBlbnRyeS5tYXRjaChOQU1FX0NPVU5UX1JFR0VYUCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBtYXRjaGVzWzFdO1xuICAgICAgICBjb25zdCBjb3VudCA9IChtYXRjaGVzWzJdID09PSB1bmRlZmluZWQpID8gMSA6IHBhcnNlSW50KG1hdGNoZXNbMl0sIDEwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHF1YWxpZmllcjogcXVhbGlmaWVyLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBjb3VudDogY291bnRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgYSBzaW5nbGUgJ3N0YXRlbWVudCcuIEEgJ3N0YXRlbWVudCcgaXMgY29uc2lkZXJlZCBhbnkgc2VxdWVuY2Ugb2ZcbiAgICAgKiBjaGFyYWN0ZXJzIGZvbGxvd2VkIGJ5IGEgc2VtaS1jb2xvbi4gVGhlcmVmb3JlLCBhIHNpbmdsZSAnc3RhdGVtZW50JyBpblxuICAgICAqIHRoaXMgc2Vuc2UgY291bGQgY29udGFpbiBzZXZlcmFsIGNvbW1hIHNlcGFyYXRlZCBkZWNsYXJhdGlvbnMuIFJldHVybnNcbiAgICAgKiBhbGwgcmVzdWx0aW5nIGRlY2xhcmF0aW9ucy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlbWVudCAtIFRoZSBzdGF0ZW1lbnQgdG8gcGFyc2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGFycmF5IG9mIHBhcnNlZCBkZWNsYXJhdGlvbiBvYmplY3RzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlU3RhdGVtZW50KHN0YXRlbWVudCkge1xuICAgICAgICAvLyBzcGxpdCBzdGF0ZW1lbnQgb24gY29tbWFzXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFsndW5pZm9ybSBtYXQ0IEFbMTBdJywgJ0InLCAnQ1syXSddXG4gICAgICAgIC8vXG4gICAgICAgIGNvbnN0IHNwbGl0ID0gc3RhdGVtZW50LnNwbGl0KCcsJykubWFwKGVsZW0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0udHJpbSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzcGxpdCBkZWNsYXJhdGlvbiBoZWFkZXIgZnJvbSBzdGF0ZW1lbnRcbiAgICAgICAgLy9cbiAgICAgICAgLy8gWyd1bmlmb3JtJywgJ21hdDQnLCAnQVsxMF0nXVxuICAgICAgICAvL1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBzcGxpdC5zaGlmdCgpLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgLy8gcXVhbGlmaWVyIGlzIGFsd2F5cyBmaXJzdCBlbGVtZW50XG4gICAgICAgIC8vXG4gICAgICAgIC8vICd1bmlmb3JtJ1xuICAgICAgICAvL1xuICAgICAgICBjb25zdCBxdWFsaWZpZXIgPSBoZWFkZXIuc2hpZnQoKTtcblxuICAgICAgICAvLyB0eXBlIHdpbGwgYmUgdGhlIHNlY29uZCBlbGVtZW50XG4gICAgICAgIC8vXG4gICAgICAgIC8vICdtYXQ0J1xuICAgICAgICAvL1xuICAgICAgICBjb25zdCB0eXBlID0gaGVhZGVyLnNoaWZ0KCk7XG5cbiAgICAgICAgLy8gbGFzdCBwYXJ0IG9mIGhlYWRlciB3aWxsIGJlIHRoZSBmaXJzdCwgYW5kIHBvc3NpYmxlIG9ubHkgdmFyaWFibGUgbmFtZVxuICAgICAgICAvL1xuICAgICAgICAvLyBbJ0FbMTBdJywgJ0InLCAnQ1syXSddXG4gICAgICAgIC8vXG4gICAgICAgIGNvbnN0IG5hbWVzID0gaGVhZGVyLmNvbmNhdChzcGxpdCk7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG90aGVyIG5hbWVzIGFmdGVyIGEgJywnIGFkZCB0aGVtIGFzIHdlbGxcbiAgICAgICAgcmV0dXJuIG5hbWVzLm1hcChuYW1lID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZU5hbWVBbmRDb3VudChxdWFsaWZpZXIsIHR5cGUsIG5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGxpdHMgdGhlIHNvdXJjZSBzdHJpbmcgYnkgc2VtaS1jb2xvbnMgYW5kIGNvbnN0cnVjdHMgYW4gYXJyYXkgb2ZcbiAgICAgKiBkZWNsYXJhdGlvbiBvYmplY3RzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIga2V5d29yZHMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgc2hhZGVyIHNvdXJjZSBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGtleXdvcmRzIC0gVGhlIHF1YWxpZmllciBkZWNsYXJhdGlvbiBrZXl3b3Jkcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIG9iamVjdHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFyc2VTb3VyY2Uoc291cmNlLCBrZXl3b3Jkcykge1xuICAgICAgICAvLyBnZXQgaW5kaXZpZHVhbCBzdGF0ZW1lbnRzIChhbnkgc2VxdWVuY2UgZW5kaW5nIGluIDspXG4gICAgICAgIGNvbnN0IHN0YXRlbWVudHMgPSBzb3VyY2Uuc3BsaXQoJzsnKTtcbiAgICAgICAgLy8gYnVpbGQgcmVnZXggZm9yIHBhcnNpbmcgc3RhdGVtZW50cyB3aXRoIHRhcmdldHRlZCBrZXl3b3Jkc1xuICAgICAgICBjb25zdCBrZXl3b3JkU3RyID0ga2V5d29yZHMuam9pbignfCcpO1xuICAgICAgICBjb25zdCBrZXl3b3JkUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcYignICsga2V5d29yZFN0ciArICcpXFxcXGIuKicpO1xuICAgICAgICAvLyBwYXJzZSBhbmQgc3RvcmUgZ2xvYmFsIHByZWNpc2lvbiBzdGF0ZW1lbnRzIGFuZCBhbnkgZGVjbGFyYXRpb25zXG4gICAgICAgIGxldCBtYXRjaGVkID0gW107XG4gICAgICAgIC8vIGZvciBlYWNoIHN0YXRlbWVudFxuICAgICAgICBzdGF0ZW1lbnRzLmZvckVhY2goc3RhdGVtZW50ID0+IHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBrZXl3b3Jkc1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFsndW5pZm9ybSBmbG9hdCB1VGltZSddXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgY29uc3Qga21hdGNoID0gc3RhdGVtZW50Lm1hdGNoKGtleXdvcmRSZWdleCk7XG4gICAgICAgICAgICBpZiAoa21hdGNoKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2Ugc3RhdGVtZW50IGFuZCBhZGQgdG8gYXJyYXlcbiAgICAgICAgICAgICAgICBtYXRjaGVkID0gbWF0Y2hlZC5jb25jYXQocGFyc2VTdGF0ZW1lbnQoa21hdGNoWzBdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWF0Y2hlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWx0ZXJzIG91dCBkdXBsaWNhdGUgZGVjbGFyYXRpb25zIHByZXNlbnQgYmV0d2VlbiBzaGFkZXJzLiBDdXJyZW50bHlcbiAgICAgKiBqdXN0IHJlbW92ZXMgYWxsICMgc3RhdGVtZW50cy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gZGVjbGFyYXRpb25zIC0gVGhlIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgZmlsdGVyZWQgYXJyYXkgb2YgZGVjbGFyYXRpb25zLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlckR1cGxpY2F0ZXNCeU5hbWUoZGVjbGFyYXRpb25zKSB7XG4gICAgICAgIC8vIGluIGNhc2VzIHdoZXJlIHRoZSBzYW1lIGRlY2xhcmF0aW9ucyBhcmUgcHJlc2VudCBpbiBtdWx0aXBsZVxuICAgICAgICAvLyBzb3VyY2VzLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSB0aGUgcmVzdWx0c1xuICAgICAgICBjb25zdCBzZWVuID0ge307XG4gICAgICAgIHJldHVybiBkZWNsYXJhdGlvbnMuZmlsdGVyKGRlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgICAgIGlmIChzZWVuW2RlY2xhcmF0aW9uLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VlbltkZWNsYXJhdGlvbi5uYW1lXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVucyB0aGUgcHJlcHJvY2Vzc29yIG9uIHRoZSBnbHNsIGNvZGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgdW5wcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBwcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcHJlcHJvY2Vzcyhzb3VyY2UpIHtcbiAgICAgICAgLy8gVE9ETzogaW1wbGVtZW50IHRoaXMgY29ycmVjdGx5Li4uXG4gICAgICAgIHJldHVybiBzb3VyY2UucmVwbGFjZShQUkVQX1JFR0VYUCwgJycpO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQYXJzZXMgdGhlIHByb3ZpZGVkIEdMU0wgc291cmNlLCBhbmQgcmV0dXJucyBhbGwgZGVjbGFyYXRpb24gc3RhdGVtZW50cyB0aGF0IGNvbnRhaW4gdGhlIHByb3ZpZGVkIHF1YWxpZmllciB0eXBlLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGV4dHJhY3QgYWxsIGF0dHJpYnV0ZXMgYW5kIHVuaWZvcm0gbmFtZXMgYW5kIHR5cGVzIGZyb20gYSBzaGFkZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEZvciBleGFtcGxlLCB3aGVuIHByb3ZpZGVkIGEgJ3VuaWZvcm0nIHF1YWxpZmllcnMsIHRoZSBkZWNsYXJhdGlvbjpcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICd1bmlmb3JtIGhpZ2hwIHZlYzMgdVNwZWN1bGFyQ29sb3I7J1xuICAgICAgICAgKlxuICAgICAgICAgKiBXb3VsZCBiZSBwYXJzZWQgdG86XG4gICAgICAgICAqICAgICB7XG4gICAgICAgICAqICAgICAgICAgcXVhbGlmaWVyOiAndW5pZm9ybScsXG4gICAgICAgICAqICAgICAgICAgdHlwZTogJ3ZlYzMnLFxuICAgICAgICAgKiAgICAgICAgIG5hbWU6ICd1U3BlY3VsYXJDb2xvcicsXG4gICAgICAgICAqICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gc291cmNlcyAtIFRoZSBzaGFkZXIgc291cmNlcy5cbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gcXVhbGlmaWVycyAtIFRoZSBxdWFsaWZpZXJzIHRvIGV4dHJhY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIHN0YXRlbWVudHMuXG4gICAgICAgICAqL1xuICAgICAgICBwYXJzZURlY2xhcmF0aW9uczogZnVuY3Rpb24oc291cmNlcyA9IFtdLCBxdWFsaWZpZXJzID0gW10pIHtcbiAgICAgICAgICAgIC8vIGlmIG5vIHNvdXJjZXMgb3IgcXVhbGlmaWVycyBhcmUgcHJvdmlkZWQsIHJldHVybiBlbXB0eSBhcnJheVxuICAgICAgICAgICAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAwIHx8IHF1YWxpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc291cmNlcyA9IEFycmF5LmlzQXJyYXkoc291cmNlcykgPyBzb3VyY2VzIDogW3NvdXJjZXNdO1xuICAgICAgICAgICAgcXVhbGlmaWVycyA9IEFycmF5LmlzQXJyYXkocXVhbGlmaWVycykgPyBxdWFsaWZpZXJzIDogW3F1YWxpZmllcnNdO1xuICAgICAgICAgICAgLy8gcGFyc2Ugb3V0IHRhcmdldHRlZCBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgIGxldCBkZWNsYXJhdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIHNvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHJ1biBwcmVwcm9jZXNzb3JcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBwcmVwcm9jZXNzKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHByZWNpc2lvbiBzdGF0ZW1lbnRzXG4gICAgICAgICAgICAgICAgc291cmNlID0gc3RyaXBQcmVjaXNpb24oc291cmNlKTtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgY29tbWVudHNcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBzdHJpcENvbW1lbnRzKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgLy8gZmluYWxseSwgbm9ybWFsaXplIHRoZSB3aGl0ZXNwYWNlXG4gICAgICAgICAgICAgICAgc291cmNlID0gbm9ybWFsaXplV2hpdGVzcGFjZShzb3VyY2UpO1xuICAgICAgICAgICAgICAgIC8vIHBhcnNlIG91dCBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnMuY29uY2F0KHBhcnNlU291cmNlKHNvdXJjZSwgcXVhbGlmaWVycykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyByZW1vdmUgZHVwbGljYXRlcyBhbmQgcmV0dXJuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyRHVwbGljYXRlc0J5TmFtZShkZWNsYXJhdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlY3RzIGJhc2VkIG9uIHRoZSBleGlzdGVuY2Ugb2YgYSAndm9pZCBtYWluKCkgeycgc3RhdGVtZW50LCBpZiB0aGUgc3RyaW5nIGlzIGdsc2wgc291cmNlIGNvZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIHRlc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBzdHJpbmcgaXMgZ2xzbCBjb2RlLlxuICAgICAgICAgKi9cbiAgICAgICAgaXNHTFNMOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBHTFNMX1JFR0VYUC50ZXN0KHN0cik7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuICAgIGNvbnN0IFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuICAgIGNvbnN0IE1BR19GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IE1JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgY29uc3QgTk9OX01JUE1BUF9NSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlLFxuICAgIH07XG4gICAgY29uc3QgTUlQTUFQX01JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IFdSQVBfTU9ERVMgPSB7XG4gICAgICAgIFJFUEVBVDogdHJ1ZSxcbiAgICAgICAgTUlSUk9SRURfUkVQRUFUOiB0cnVlLFxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCBERVBUSF9UWVBFUyA9IHtcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9CWVRFJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfV1JBUCA9ICdSRVBFQVQnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgbWluIC8gbWFnIGZpbHRlciBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9NSVBNQVAgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0lOVkVSVF9ZID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVggPSAnX01JUE1BUF9MSU5FQVInO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFRleHR1cmUyRFxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIHRleHR1cmUuXG4gICAgICovXG4gICAgY2xhc3MgVGV4dHVyZTJEIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zdGFudGlhdGVzIGEgVGV4dHVyZTJEIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtVaW50OEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fEZsb2F0MzJBcnJheXxJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBzcGVjLnNyYyAtIFRoZSBkYXRhIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMud2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHRleHR1cmUuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMubWlwTWFwIC0gV2hldGhlciBvciBub3QgbWlwLW1hcHBpbmcgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLmludmVydFkgLSBXaGV0aGVyIG9yIG5vdCBpbnZlcnQteSBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMucHJlbXVsdGlwbHlBbHBoYSAtIFdoZXRoZXIgb3Igbm90IGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZvcm1hdCAtIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudHlwZSAtIFRoZSB0ZXh0dXJlIHBpeGVsIGNvbXBvbmVudCB0eXBlLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Ioc3BlYyA9IHt9KSB7XG4gICAgICAgICAgICAvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG4gICAgICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIC8vIHNldCBjb250ZXh0XG4gICAgICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICAgICAgLy8gZW1wdHkgdGV4dHVyZVxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlID0gbnVsbDtcbiAgICAgICAgICAgIC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xuICAgICAgICAgICAgdGhpcy53cmFwUyA9IHNwZWMud3JhcFMgfHwgREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgdGhpcy53cmFwVCA9IHNwZWMud3JhcFQgfHwgREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIHRoaXMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICAvLyBzZXQgb3RoZXIgcHJvcGVydGllc1xuICAgICAgICAgICAgdGhpcy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBERUZBVUxUX01JUE1BUDtcbiAgICAgICAgICAgIHRoaXMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogREVGQVVMVF9JTlZFUlRfWTtcbiAgICAgICAgICAgIHRoaXMucHJlbXVsdGlwbHlBbHBoYSA9IHNwZWMucHJlbXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkID8gc3BlYy5wcmVtdWx0aXBseUFscGhhIDogREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQTtcbiAgICAgICAgICAgIC8vIHNldCBmb3JtYXRcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQgfHwgREVGQVVMVF9GT1JNQVQ7XG4gICAgICAgICAgICBpZiAoREVQVEhfVFlQRVNbdGhpcy5mb3JtYXRdICYmICFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oJ1dFQkdMX2RlcHRoX3RleHR1cmUnKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBDYW5ub3QgY3JlYXRlIFRleHR1cmUyRCBvZiBmb3JtYXQgXFxgJHt0aGlzLmZvcm1hdH1cXGAgYXMgXFxgV0VCR0xfZGVwdGhfdGV4dHVyZVxcYCBleHRlbnNpb24gaXMgdW5zdXBwb3J0ZWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IHR5cGVcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZSB8fCBERUZBVUxUX1RZUEU7XG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnICYmICFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oJ09FU190ZXh0dXJlX2Zsb2F0JykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgdHlwZSBcXGBGTE9BVFxcYCBhcyBcXGBPRVNfdGV4dHVyZV9mbG9hdFxcYCBleHRlbnNpb24gaXMgdW5zdXBwb3J0ZWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXJsIHdpbGwgbm90IGJlIHJlc29sdmVkIHlldCwgc28gZG9uJ3QgYnVmZmVyIGluIHRoYXQgY2FzZVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGVjLnNyYyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBzaXplXG4gICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzQ2FudmFzVHlwZShzcGVjLnNyYykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm90IGEgY2FudmFzIHR5cGUsIGRpbWVuc2lvbnMgTVVTVCBiZSBzcGVjaWZpZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGVjLndpZHRoICE9PSAnbnVtYmVyJyB8fCBzcGVjLndpZHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdgd2lkdGhgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGVjLmhlaWdodCAhPT0gJ251bWJlcicgfHwgc3BlYy5oZWlnaHQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ2BoZWlnaHRgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKFV0aWwubXVzdEJlUG93ZXJPZlR3byh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzUG93ZXJPZlR3byhzcGVjLndpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBQYXJhbWV0ZXJzIHJlcXVpcmUgYSBwb3dlci1vZi10d28gdGV4dHVyZSwgeWV0IHByb3ZpZGVkIHdpZHRoIG9mIFxcYCR7c3BlYy53aWR0aH1cXGAgaXMgbm90IGEgcG93ZXIgb2YgdHdvYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghVXRpbC5pc1Bvd2VyT2ZUd28oc3BlYy5oZWlnaHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFBhcmFtZXRlcnMgcmVxdWlyZSBhIHBvd2VyLW9mLXR3byB0ZXh0dXJlLCB5ZXQgcHJvdmlkZWQgaGVpZ2h0IG9mIFxcYCR7c3BlYy5oZWlnaHR9XFxgIGlzIG5vdCBhIHBvd2VyIG9mIHR3b2A7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKHNwZWMuc3JjIHx8IG51bGwsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguIERlZmF1bHRzIHRvIDAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBiaW5kKGxvY2F0aW9uID0gMCkge1xuICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxvY2F0aW9uKSB8fCBsb2NhdGlvbiA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYmluZCB0ZXh0dXJlXG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsWydURVhUVVJFJyArIGxvY2F0aW9uXSk7XG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyVmlld3xudWxsfSBkYXRhIC0gVGhlIGRhdGEgYXJyYXkgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYnVmZmVyRGF0YShkYXRhLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG4gICAgICAgICAgICBpZiAoIXRoaXMudGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIC8vIGludmVydCB5IGlmIHNwZWNpZmllZFxuICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdGhpcy5pbnZlcnRZKTtcbiAgICAgICAgICAgIC8vIHByZW11bHRpcGx5IGFscGhhIGlmIHNwZWNpZmllZFxuICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCB0aGlzLnByZW11bHRpcGx5QWxwaGEpO1xuICAgICAgICAgICAgLy8gY2FzdCBhcnJheSBhcmdcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQxNkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQzMkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDE2QXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdGTE9BVCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEgJiYgIShkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmICFVdGlsLmlzQ2FudmFzVHlwZShkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgJyArXG4gICAgICAgICAgICAgICAgICAgICdgQXJyYXlCdWZmZXJWaWV3YCwgYEltYWdlRGF0YWAsIGBIVE1MSW1hZ2VFbGVtZW50YCwgJyArXG4gICAgICAgICAgICAgICAgICAgICdgSFRNTENhbnZhc0VsZW1lbnRgLCBgSFRNTFZpZGVvRWxlbWVudGAsIG9yIG51bGwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFV0aWwuaXNDYW52YXNUeXBlKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgd2lkdGggYW5kIGhlaWdodFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSB0ZXh0dXJlXG4gICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcbiAgICAgICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgd2lkdGggYW5kIGhlaWdodFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCB0aGlzLndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG4gICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcbiAgICAgICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSxcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy50eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBtaXAgbWFwc1xuICAgICAgICAgICAgaWYgKHRoaXMubWlwTWFwKSB7XG4gICAgICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWZmZXIgcGFydGlhbCBkYXRhIGludG8gdGhlIHRleHR1cmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJWaWV3fG51bGx9IGRhdGEgLSBUaGUgZGF0YSBhcnJheSB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4T2Zmc2V0IC0gVGhlIHggb2Zmc2V0IGF0IHdoaWNoIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHlPZmZzZXQgLSBUaGUgeSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYnVmZmVyU3ViRGF0YShkYXRhLCB4T2Zmc2V0ID0gMCwgeU9mZnNldCA9IDAsIHdpZHRoID0gdW5kZWZpbmVkLCBoZWlnaHQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgYXJnXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9TSE9SVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MTZBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MzJBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGVuc3VyZSB0eXBlIGNvcnJlc3BvbmRzIHRvIGRhdGFcbiAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09ICdVTlNJR05FRF9CWVRFJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSBgVWludDhBcnJheWAgZG9lcyBub3QgbWF0Y2ggdHlwZSBvZiBgVU5TSUdORURfQllURWAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSBgVWludDE2QXJyYXlgIGRvZXMgbm90IG1hdGNoIHR5cGUgb2YgYFVOU0lHTkVEX1NIT1JUYCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSBgVWludDMyQXJyYXlgIGRvZXMgbm90IG1hdGNoIHR5cGUgb2YgYFVOU0lHTkVEX0lOVGAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09ICdGTE9BVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgYEZsb2F0MzJBcnJheWAgZG9lcyBub3QgbWF0Y2ggdHlwZSBvZiBgRkxPQVRgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJiAhVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsICcgK1xuICAgICAgICAgICAgICAgICAgICAnYEFycmF5QnVmZmVyVmlld2AsIGBJbWFnZURhdGFgLCBgSFRNTEltYWdlRWxlbWVudGAsICcgK1xuICAgICAgICAgICAgICAgICAgICAnYEhUTUxDYW52YXNFbGVtZW50YCwgb3IgYEhUTUxWaWRlb0VsZW1lbnRgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChVdGlsLmlzQ2FudmFzVHlwZShkYXRhKSkge1xuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZVxuICAgICAgICAgICAgICAgIGdsLnRleFN1YkltYWdlMkQoXG4gICAgICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXG4gICAgICAgICAgICAgICAgICAgIDAsIC8vIG1pcC1tYXAgbGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgeE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgeU9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgdGhhdCB3aWR0aCBpcyBwcm92aWRlZFxuICAgICAgICAgICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcih3aWR0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIHdpZHRoIG9mIFxcYCR7d2lkdGh9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjaGVjayB0aGF0IGhlaWdodCBpcyBwcm92aWRlZFxuICAgICAgICAgICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihoZWlnaHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjaGVjayB0aGF0IHdlIGFyZW4ndCBvdmVyZmxvd2luZyB0aGUgYnVmZmVyXG4gICAgICAgICAgICAgICAgaWYgKHdpZHRoICsgeE9mZnNldCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIHdpZHRoIG9mIFxcYCR7d2lkdGh9XFxgIGFuZCB4T2Zmc2V0IG9mIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYCBcXGAke3hPZmZzZXR9XFxgIG92ZXJmbG93cyB0aGUgdGV4dHVyZSB3aWR0aCBvZiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcXGAke3RoaXMud2lkdGh9XFxgYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodCArIHlPZmZzZXQgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgd2lkdGggb2YgXFxgJHtoZWlnaHR9XFxgIGFuZCB4T2Zmc2V0IG9mIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYCBcXGAke3lPZmZzZXR9XFxgIG92ZXJmbG93cyB0aGUgdGV4dHVyZSB3aWR0aCBvZiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcXGAke3RoaXMuaGVpZ2h0fVxcYGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG4gICAgICAgICAgICAgICAgZ2wudGV4U3ViSW1hZ2UyRChcbiAgICAgICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbFxuICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMudHlwZV0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZ2VuZXJhdGUgbWlwIG1hcHNcbiAgICAgICAgICAgIGlmICh0aGlzLm1pcE1hcCkge1xuICAgICAgICAgICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdW5iaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSB0ZXh0dXJlIHBhcmFtZXRlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyBieSBuYW1lLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHNldFBhcmFtZXRlcnMocGFyYW1zKSB7XG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBiaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG4gICAgICAgICAgICAvLyBzZXQgd3JhcCBTIHBhcmFtZXRlclxuICAgICAgICAgICAgbGV0IHBhcmFtID0gcGFyYW1zLndyYXBTIHx8IHBhcmFtcy53cmFwO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3JhcFMgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbdGhpcy53cmFwU10pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9XUkFQX1NcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCB3cmFwIFQgcGFyYW1ldGVyXG4gICAgICAgICAgICBwYXJhbSA9IHBhcmFtcy53cmFwVCB8fCBwYXJhbXMud3JhcDtcbiAgICAgICAgICAgIGlmIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmIChXUkFQX01PREVTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndyYXBUID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsW3RoaXMud3JhcFRdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfV1JBUF9UXFxgYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgbWFnIGZpbHRlciBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHBhcmFtID0gcGFyYW1zLm1hZ0ZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1BR19GSUxURVJTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbdGhpcy5tYWdGaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yICdURVhUVVJFX01BR19GSUxURVJcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBtaW4gZmlsdGVyIHBhcmFtZXRlclxuICAgICAgICAgICAgcGFyYW0gPSBwYXJhbXMubWluRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taXBNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGdyYWRlIHRvIG1pcC1tYXAgbWluIGZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW0gKz0gREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1JUE1BUF9NSU5fRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2l6ZSB0aGUgdW5kZXJseWluZyB0ZXh0dXJlLiBUaGlzIGNsZWFycyB0aGUgdGV4dHVyZSBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgbmV3IHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIG5ldyBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICByZXNpemUod2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgKHdpZHRoIDw9IDApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIHdpZHRoIG9mIFxcYCR7d2lkdGh9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IChoZWlnaHQgPD0gMCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgaGVpZ2h0IG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShudWxsLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlMkQ7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuICAgIGNvbnN0IEFzeW5jID0gcmVxdWlyZSgnLi4vdXRpbC9Bc3luYycpO1xuICAgIGNvbnN0IFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcbiAgICBjb25zdCBJbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvSW1hZ2VMb2FkZXInKTtcblxuICAgIGNvbnN0IEZBQ0VTID0gW1xuICAgICAgICAnLXgnLCAnK3gnLFxuICAgICAgICAnLXknLCAnK3knLFxuICAgICAgICAnLXonLCAnK3onXG4gICAgXTtcbiAgICBjb25zdCBGQUNFX1RBUkdFVFMgPSB7XG4gICAgICAgICcreic6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1onLFxuICAgICAgICAnLXonOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aJyxcbiAgICAgICAgJyt4JzogJ1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCcsXG4gICAgICAgICcteCc6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1gnLFxuICAgICAgICAnK3knOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZJyxcbiAgICAgICAgJy15JzogJ1RFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWSdcbiAgICB9O1xuICAgIGNvbnN0IFRBUkdFVFMgPSB7XG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWjogdHJ1ZSxcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aOiB0cnVlLFxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1g6IHRydWUsXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWDogdHJ1ZSxcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZOiB0cnVlLFxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1k6IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IE1BR19GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IE1JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgY29uc3QgTk9OX01JUE1BUF9NSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlLFxuICAgIH07XG4gICAgY29uc3QgTUlQTUFQX01JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IFdSQVBfTU9ERVMgPSB7XG4gICAgICAgIFJFUEVBVDogdHJ1ZSxcbiAgICAgICAgTUlSUk9SRURfUkVQRUFUOiB0cnVlLFxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlXG4gICAgfTtcbiAgICBjb25zdCBGT1JNQVRTID0ge1xuICAgICAgICBSR0I6IHRydWUsXG4gICAgICAgIFJHQkE6IHRydWVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgdHlwZSBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0JZVEUnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9XUkFQID0gJ0NMQU1QX1RPX0VER0UnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgbWluIC8gbWFnIGZpbHRlciBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9NSVBNQVAgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBjb25zdCBERUZBVUxUX0lOVkVSVF9ZID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVggPSAnX01JUE1BUF9MSU5FQVInO1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjdWJlbWFwIGFuZCB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmXG4gICAgICogaXQgZG9lcyBub3QgbWVldCByZXF1aXJlbWVudHMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IGN1YmVNYXAgLSBUaGUgY3ViZSBtYXAgdGV4dHVyZSBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hlY2tEaW1lbnNpb25zKGN1YmVNYXApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjdWJlTWFwLndpZHRoICE9PSAnbnVtYmVyJyB8fCBjdWJlTWFwLndpZHRoIDw9IDApIHtcbiAgICAgICAgICAgIHRocm93ICdgd2lkdGhgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjdWJlTWFwLmhlaWdodCAhPT0gJ251bWJlcicgfHwgY3ViZU1hcC5oZWlnaHQgPD0gMCkge1xuICAgICAgICAgICAgdGhyb3cgJ2BoZWlnaHRgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1YmVNYXAud2lkdGggIT09IGN1YmVNYXAuaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHdpZHRoYCBtdXN0IGJlIGVxdWFsIHRvIGBoZWlnaHRgJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoVXRpbC5tdXN0QmVQb3dlck9mVHdvKGN1YmVNYXApICYmICFVdGlsLmlzUG93ZXJPZlR3byhjdWJlTWFwLndpZHRoKSkge1xuICAgICAgICAgICAgdGhyb3cgYFBhcmFtZXRlcnMgcmVxdWlyZSBhIHBvd2VyLW9mLXR3byB0ZXh0dXJlLCB5ZXQgcHJvdmlkZWQgc2l6ZSBvZiAke2N1YmVNYXAud2lkdGh9IGlzIG5vdCBhIHBvd2VyIG9mIHR3b2A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIHVybC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIGxvYWQgdGhlIGZhY2UgZnJvbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRGYWNlVVJMKGN1YmVNYXAsIHRhcmdldCwgdXJsKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBwdXQgZXh0ZW5zaW9uIGhhbmRsaW5nIGZvciBhcnJheWJ1ZmZlciAvIGltYWdlIC8gdmlkZW8gZGlmZmVyZW50aWF0aW9uXG4gICAgICAgICAgICBJbWFnZUxvYWRlci5sb2FkKHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlID0gVXRpbC5yZXNpemVDYW52YXMoY3ViZU1hcCwgaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICBjdWJlTWFwLmJ1ZmZlckRhdGEodGFyZ2V0LCBpbWFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUobnVsbCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZShlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIGEgZmFjZSBmcm9tIGEgY2FudmFzIHR5cGUgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIHRleHR1cmUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gICAgICogQHBhcmFtIHtJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBjYW52YXMgLSBUaGUgY2FudmFzIHR5cGUgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGxvYWRlciBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkRmFjZUNhbnZhcyhjdWJlTWFwLCB0YXJnZXQsIGNhbnZhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgY2FudmFzID0gVXRpbC5yZXNpemVDYW52YXMoY3ViZU1hcCwgY2FudmFzKTtcbiAgICAgICAgICAgIGN1YmVNYXAuYnVmZmVyRGF0YSh0YXJnZXQsIGNhbnZhcyk7XG4gICAgICAgICAgICBkb25lKG51bGwpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIGEgZmFjZSBmcm9tIGFuIGFycmF5IHR5cGUgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIHRleHR1cmUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGFyciAtIFRoZSBhcnJheSB0eXBlIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRGYWNlQXJyYXkoY3ViZU1hcCwgdGFyZ2V0LCBhcnIpIHtcbiAgICAgICAgY2hlY2tEaW1lbnNpb25zKGN1YmVNYXApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgY3ViZU1hcC5idWZmZXJEYXRhKHRhcmdldCwgYXJyKTtcbiAgICAgICAgICAgIGRvbmUobnVsbCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFRleHR1cmVDdWJlTWFwXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgY3ViZSBtYXAgdGV4dHVyZS5cbiAgICAgKi9cbiAgICBjbGFzcyBUZXh0dXJlQ3ViZU1hcCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmVDdWJlTWFwIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHNcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMuZmFjZXMgLSBUaGUgZmFjZXMgdG8gYnVmZmVyLCB1bmRlciBrZXlzICcreCcsICcreScsICcreicsICcteCcsICcteScsIGFuZCAnLXonLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZmFjZXMuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGZhY2VzLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLnByZW11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICAgICAgdGhpcy50ZXh0dXJlID0gbnVsbDtcbiAgICAgICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgLy8gc2V0IHRleHR1cmUgcGFyYW1zXG4gICAgICAgICAgICB0aGlzLndyYXBTID0gV1JBUF9NT0RFU1tzcGVjLndyYXBTXSA/IHNwZWMud3JhcFMgOiBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICB0aGlzLndyYXBUID0gV1JBUF9NT0RFU1tzcGVjLndyYXBUXSA/IHNwZWMud3JhcFQgOiBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTW3NwZWMubWluRmlsdGVyXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IE1BR19GSUxURVJTW3NwZWMubWFnRmlsdGVyXSA/IHNwZWMubWFnRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICAvLyBzZXQgb3RoZXIgcHJvcGVydGllc1xuICAgICAgICAgICAgdGhpcy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBERUZBVUxUX01JUE1BUDtcbiAgICAgICAgICAgIHRoaXMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogREVGQVVMVF9JTlZFUlRfWTtcbiAgICAgICAgICAgIHRoaXMucHJlbXVsdGlwbHlBbHBoYSA9IHNwZWMucHJlbXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkID8gc3BlYy5wcmVtdWx0aXBseUFscGhhIDogREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQTtcbiAgICAgICAgICAgIC8vIHNldCBmb3JtYXQgYW5kIHR5cGVcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gRk9STUFUU1tzcGVjLmZvcm1hdF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gc3BlYy50eXBlIHx8IERFRkFVTFRfVFlQRTtcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdGTE9BVCcgJiYgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbignT0VTX3RleHR1cmVfZmxvYXQnKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY3JlYXRlIFRleHR1cmUyRCBvZiB0eXBlIGBGTE9BVGAgYXMgYE9FU190ZXh0dXJlX2Zsb2F0YCBleHRlbnNpb24gaXMgdW5zdXBwb3J0ZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGRpbWVuc2lvbnMgaWYgcHJvdmlkZWRcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBzcGVjLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBzcGVjLmhlaWdodDtcbiAgICAgICAgICAgIC8vIHNldCBidWZmZXJlZCBmYWNlc1xuICAgICAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzID0gW107XG4gICAgICAgICAgICAvLyBjcmVhdGUgY3ViZSBtYXAgYmFzZWQgb24gaW5wdXRcbiAgICAgICAgICAgIGlmIChzcGVjLmZhY2VzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFza3MgPSBbXTtcbiAgICAgICAgICAgICAgICBGQUNFUy5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFjZSA9IHNwZWMuZmFjZXNbaWRdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBGQUNFX1RBUkdFVFNbaWRdO1xuICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIGJhc2VkIG9uIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKGxvYWRGYWNlVVJMKHRoaXMsIHRhcmdldCwgZmFjZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWwuaXNDYW52YXNUeXBlKGZhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2gobG9hZEZhY2VDYW52YXModGhpcywgdGFyZ2V0LCBmYWNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcnJheSAvIGFycmF5YnVmZmVyIG9yIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2gobG9hZEZhY2VBcnJheSh0aGlzLCB0YXJnZXQsIGZhY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIEFzeW5jLnBhcmFsbGVsKHRhc2tzLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgcGFyYW1ldGVyc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBudWxsXG4gICAgICAgICAgICAgICAgY2hlY2tEaW1lbnNpb25zKHRoaXMpO1xuICAgICAgICAgICAgICAgIEZBQ0VTLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoRkFDRV9UQVJHRVRTW2lkXSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHBhcmFtZXRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguIERlZmF1bHRzIHRvIDAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJpbmQobG9jYXRpb24gPSAwKSB7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobG9jYXRpb24pIHx8IGxvY2F0aW9uIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHVuaXQgbG9jYXRpb24gaXMgaW52YWxpZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBiaW5kIGN1YmUgbWFwIHRleHR1cmVcbiAgICAgICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2xbJ1RFWFRVUkUnICsgbG9jYXRpb25dKTtcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMudGV4dHVyZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VGV4dHVyZUN1YmVNYXB9IC0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICAvLyB1bmJpbmQgY3ViZSBtYXAgdGV4dHVyZVxuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSByZXNwZWN0aXZlIGN1YmUgbWFwIGZhY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgZmFjZSB0YXJnZXQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fG51bGx9IGRhdGEgLSBUaGUgZmFjZSBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBidWZmZXJEYXRhKHRhcmdldCwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKCFUQVJHRVRTW3RhcmdldF0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgdGFyZ2V0XFxgIG9mICR7dGFyZ2V0fSAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG4gICAgICAgICAgICBpZiAoIXRoaXMudGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIC8vIGludmVydCB5IGlmIHNwZWNpZmllZFxuICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdGhpcy5pbnZlcnRZKTtcbiAgICAgICAgICAgIC8vIHByZW11bHRpcGx5IGFscGhhIGlmIHNwZWNpZmllZFxuICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCB0aGlzLnByZW11bHRpcGx5QWxwaGEpO1xuICAgICAgICAgICAgLy8gY2FzdCBhcnJheSBhcmdcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQxNkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQzMkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDE2QXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdGTE9BVCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEgJiYgIShkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmICFVdGlsLmlzQ2FudmFzVHlwZShkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgJyArXG4gICAgICAgICAgICAgICAgICAgICdgQXJyYXlCdWZmZXJWaWV3YCwgYEltYWdlRGF0YWAsIGBIVE1MSW1hZ2VFbGVtZW50YCwgJyArXG4gICAgICAgICAgICAgICAgICAgICdgSFRNTENhbnZhc0VsZW1lbnRgLCBgSFRNTFZpZGVvRWxlbWVudGAsIG9yIG51bGwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgICAgICBpZiAoVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmVcbiAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgICAgICBnbFt0YXJnZXRdLFxuICAgICAgICAgICAgICAgICAgICAwLCAvLyBtaXAtbWFwIGxldmVsLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSB0ZXh0dXJlIGRhdGFcbiAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgICAgICBnbFt0YXJnZXRdLFxuICAgICAgICAgICAgICAgICAgICAwLCAvLyBtaXAtbWFwIGxldmVsXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRyYWNrIHRoZSBmYWNlIHRoYXQgd2FzIGJ1ZmZlcmVkXG4gICAgICAgICAgICBpZiAodGhpcy5idWZmZXJlZEZhY2VzLmluZGV4T2YodGFyZ2V0KSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXMucHVzaCh0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgYWxsIGZhY2VzIGJ1ZmZlcmVkLCBnZW5lcmF0ZSBtaXBtYXBzXG4gICAgICAgICAgICBpZiAodGhpcy5taXBNYXAgJiYgdGhpcy5idWZmZXJlZEZhY2VzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgICAgIC8vIG9ubHkgZ2VuZXJhdGUgbWlwbWFwcyBpZiBhbGwgZmFjZXMgYXJlIGJ1ZmZlcmVkXG4gICAgICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV9DVUJFX01BUCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHRleHR1cmUgcGFyYW1ldGVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIGJ5IG5hbWUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRQYXJhbWV0ZXJzKHBhcmFtcykge1xuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgLy8gYmluZCB0ZXh0dXJlXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLnRleHR1cmUpO1xuICAgICAgICAgICAgLy8gc2V0IHdyYXAgUyBwYXJhbWV0ZXJcbiAgICAgICAgICAgIGxldCBwYXJhbSA9IHBhcmFtcy53cmFwUyB8fCBwYXJhbXMud3JhcDtcbiAgICAgICAgICAgIGlmIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmIChXUkFQX01PREVTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndyYXBTID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsW3RoaXMud3JhcFNdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfV1JBUF9TXFxgYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgd3JhcCBUIHBhcmFtZXRlclxuICAgICAgICAgICAgcGFyYW0gPSBwYXJhbXMud3JhcFQgfHwgcGFyYW1zLndyYXA7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoV1JBUF9NT0RFU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwVCA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt0aGlzLndyYXBUXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX1dSQVBfVFxcYGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IG1hZyBmaWx0ZXIgcGFyYW1ldGVyXG4gICAgICAgICAgICBwYXJhbSA9IHBhcmFtcy5tYWdGaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcbiAgICAgICAgICAgIGlmIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmIChNQUdfRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWdGaWx0ZXIgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsW3RoaXMubWFnRmlsdGVyXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciAnVEVYVFVSRV9NQUdfRklMVEVSXFxgYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgbWluIGZpbHRlciBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHBhcmFtID0gcGFyYW1zLm1pbkZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWlwTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChOT05fTUlQTUFQX01JTl9GSUxURVJTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXBncmFkZSB0byBtaXAtbWFwIG1pbiBmaWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtICs9IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChNSVBNQVBfTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX01JTl9GSUxURVJcXGBgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1JTl9GSUxURVJTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX01JTl9GSUxURVJcXGBgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdW5iaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRleHR1cmVDdWJlTWFwO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcbiAgICBjb25zdCBWZXJ0ZXhQYWNrYWdlID0gcmVxdWlyZSgnLi9WZXJ0ZXhQYWNrYWdlJyk7XG5cbiAgICBjb25zdCBNT0RFUyA9IHtcbiAgICAgICAgUE9JTlRTOiB0cnVlLFxuICAgICAgICBMSU5FUzogdHJ1ZSxcbiAgICAgICAgTElORV9TVFJJUDogdHJ1ZSxcbiAgICAgICAgTElORV9MT09QOiB0cnVlLFxuICAgICAgICBUUklBTkdMRVM6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX1NUUklQOiB0cnVlLFxuICAgICAgICBUUklBTkdMRV9GQU46IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IFRZUEVTID0ge1xuICAgICAgICBCWVRFOiB0cnVlLFxuICAgICAgICBVTlNJR05FRF9CWVRFOiB0cnVlLFxuICAgICAgICBTSE9SVDogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IHRydWUsXG4gICAgICAgIEZJWEVEOiB0cnVlLFxuICAgICAgICBGTE9BVDogdHJ1ZVxuICAgIH07XG4gICAgY29uc3QgQllURVNfUEVSX1RZUEUgPSB7XG4gICAgICAgIEJZVEU6IDEsXG4gICAgICAgIFVOU0lHTkVEX0JZVEU6IDEsXG4gICAgICAgIFNIT1JUOiAyLFxuICAgICAgICBVTlNJR05FRF9TSE9SVDogMixcbiAgICAgICAgRklYRUQ6IDQsXG4gICAgICAgIEZMT0FUOiA0XG4gICAgfTtcbiAgICBjb25zdCBTSVpFUyA9IHtcbiAgICAgICAgMTogdHJ1ZSxcbiAgICAgICAgMjogdHJ1ZSxcbiAgICAgICAgMzogdHJ1ZSxcbiAgICAgICAgNDogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBhdHRyaWJ1dGUgcG9pbnQgYnl0ZSBvZmZzZXQuXG4gICAgICovXG4gICAgY29uc3QgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCByZW5kZXIgbW9kZSAocHJpbWl0aXZlIHR5cGUpLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfTU9ERSA9ICdUUklBTkdMRVMnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgaW5kZXggb2Zmc2V0IHRvIHJlbmRlciBmcm9tLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfSU5ERVhfT0ZGU0VUID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGNvdW50IG9mIGluZGljZXMgdG8gcmVuZGVyLlxuICAgICAqL1xuICAgIGNvbnN0IERFRkFVTFRfQ09VTlQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgZGV0ZXJtaW5lIHRoZSBieXRlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hcH0gYXR0cmlidXRlUG9pbnRlcnMgLSBUaGUgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTdHJpZGUoYXR0cmlidXRlUG9pbnRlcnMpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUgYXR0cmlidXRlIHBvaW50ZXIgYXNzaWduZWQgdG8gdGhpcyBidWZmZXIsXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIG5lZWQgZm9yIHN0cmlkZSwgc2V0IHRvIGRlZmF1bHQgb2YgMFxuICAgICAgICBpZiAoYXR0cmlidXRlUG9pbnRlcnMuc2l6ZSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1heEJ5dGVPZmZzZXQgPSAwO1xuICAgICAgICBsZXQgYnl0ZVNpemVTdW0gPSAwO1xuICAgICAgICBsZXQgYnl0ZVN0cmlkZSA9IDA7XG4gICAgICAgIGF0dHJpYnV0ZVBvaW50ZXJzLmZvckVhY2gocG9pbnRlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBieXRlT2Zmc2V0ID0gcG9pbnRlci5ieXRlT2Zmc2V0O1xuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHBvaW50ZXIuc2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBwb2ludGVyLnR5cGU7XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgc3VtIG9mIGVhY2ggYXR0cmlidXRlIHNpemVcbiAgICAgICAgICAgIGJ5dGVTaXplU3VtICs9IHNpemUgKiBCWVRFU19QRVJfVFlQRVt0eXBlXTtcbiAgICAgICAgICAgIC8vIHRyYWNrIHRoZSBsYXJnZXN0IG9mZnNldCB0byBkZXRlcm1pbmUgdGhlIGJ5dGUgc3RyaWRlIG9mIHRoZSBidWZmZXJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0ID4gbWF4Qnl0ZU9mZnNldCkge1xuICAgICAgICAgICAgICAgIG1heEJ5dGVPZmZzZXQgPSBieXRlT2Zmc2V0O1xuICAgICAgICAgICAgICAgIGJ5dGVTdHJpZGUgPSBieXRlT2Zmc2V0ICsgKHNpemUgKiBCWVRFU19QRVJfVFlQRVt0eXBlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBjaGVjayBpZiB0aGUgbWF4IGJ5dGUgb2Zmc2V0IGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdGhlIHN1bSBvZlxuICAgICAgICAvLyB0aGUgc2l6ZXMuIElmIHNvIHRoaXMgYnVmZmVyIGlzIG5vdCBpbnRlcmxlYXZlZCBhbmQgZG9lcyBub3QgbmVlZCBhXG4gICAgICAgIC8vIHN0cmlkZS5cbiAgICAgICAgaWYgKG1heEJ5dGVPZmZzZXQgPj0gYnl0ZVNpemVTdW0pIHtcbiAgICAgICAgICAgIC8vIFRPRE86IHRlc3Qgd2hhdCBzdHJpZGUgPT09IDAgZG9lcyBmb3IgYW4gaW50ZXJsZWF2ZWQgYnVmZmVyIG9mXG4gICAgICAgICAgICAvLyBsZW5ndGggPT09IDEuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnl0ZVN0cmlkZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSB0aGUgYXR0cmlidXRlIHBvaW50ZXJzIHRvIGVuc3VyZSB0aGV5IGFyZSB2YWxpZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHZhbGlkYXRlZCBhdHRyaWJ1dGUgcG9pbnRlciBtYXAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXR0cmlidXRlUG9pbnRlcnMoYXR0cmlidXRlUG9pbnRlcnMpIHtcbiAgICAgICAgLy8gcGFyc2UgcG9pbnRlcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHZhbGlkXG4gICAgICAgIGNvbnN0IHBvaW50ZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVQb2ludGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChrZXksIDEwKTtcbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQga2V5IGlzIGFuIHZhbGlkIGludGVnZXJcbiAgICAgICAgICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgQXR0cmlidXRlIGluZGV4IFxcYCR7a2V5fVxcYCBkb2VzIG5vdCByZXByZXNlbnQgYW4gaW50ZWdlcmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwb2ludGVyID0gYXR0cmlidXRlUG9pbnRlcnNba2V5XTtcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBwb2ludGVyLnNpemU7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gcG9pbnRlci50eXBlO1xuICAgICAgICAgICAgY29uc3QgYnl0ZU9mZnNldCA9IHBvaW50ZXIuYnl0ZU9mZnNldDtcbiAgICAgICAgICAgIC8vIGNoZWNrIHNpemVcbiAgICAgICAgICAgIGlmICghU0laRVNbc2l6ZV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0cmlidXRlIHBvaW50ZXIgYHNpemVgIHBhcmFtZXRlciBpcyBpbnZhbGlkLCBtdXN0IGJlIG9uZSBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmtleXMoU0laRVMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHR5cGVcbiAgICAgICAgICAgIGlmICghVFlQRVNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0cmlidXRlIHBvaW50ZXIgYHR5cGVgIHBhcmFtZXRlciBpcyBpbnZhbGlkLCBtdXN0IGJlIG9uZSBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmtleXMoVFlQRVMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvaW50ZXJzLnNldChpbmRleCwge1xuICAgICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICBieXRlT2Zmc2V0OiAoYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IGJ5dGVPZmZzZXQgOiBERUZBVUxUX0JZVEVfT0ZGU0VUXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwb2ludGVycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgVmVydGV4QnVmZmVyXG4gICAgICogQGNsYXNzZGVzYyBBIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGNsYXNzIFZlcnRleEJ1ZmZlciB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhbiBWZXJ0ZXhCdWZmZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1dlYkdMQnVmZmVyfFZlcnRleFBhY2thZ2V8RmxvYXQzMkFycmF5fEFycmF5fE51bWJlcn0gYXJnIC0gVGhlIGJ1ZmZlciBvciBsZW5ndGggb2YgdGhlIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGFycmF5IHBvaW50ZXIgbWFwLCBvciBpbiB0aGUgY2FzZSBvZiBhIHZlcnRleCBwYWNrYWdlIGFyZywgdGhlIG9wdGlvbnMuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIHJlbmRlcmluZyBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pbmRleE9mZnNldCAtIFRoZSBpbmRleCBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoYXJnLCBhdHRyaWJ1dGVQb2ludGVycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSBNT0RFU1tvcHRpb25zLm1vZGVdID8gb3B0aW9ucy5tb2RlIDogREVGQVVMVF9NT0RFO1xuICAgICAgICAgICAgdGhpcy5jb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IERFRkFVTFRfQ09VTlQ7XG4gICAgICAgICAgICB0aGlzLmluZGV4T2Zmc2V0ID0gKG9wdGlvbnMuaW5kZXhPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmluZGV4T2Zmc2V0IDogREVGQVVMVF9JTkRFWF9PRkZTRVQ7XG4gICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSAwO1xuICAgICAgICAgICAgLy8gZmlyc3QsIHNldCB0aGUgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgICAgICBpZiAoYXJnICYmIGFyZy5idWZmZXIgJiYgYXJnLnBvaW50ZXJzKSB7XG4gICAgICAgICAgICAgICAgLy8gVmVydGV4UGFja2FnZSBhcmd1bWVudCwgdXNlIGl0cyBhdHRyaWJ1dGUgcG9pbnRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0gYXJnLnBvaW50ZXJzO1xuICAgICAgICAgICAgICAgIC8vIHNoaWZ0IG9wdGlvbnMgYXJnIHNpbmNlIHRoZXJlIHdpbGwgYmUgbm8gYXR0cmliIHBvaW50ZXJzIGFyZ1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBhdHRyaWJ1dGVQb2ludGVycztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVycyA9IGdldEF0dHJpYnV0ZVBvaW50ZXJzKGF0dHJpYnV0ZVBvaW50ZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCB0aGUgYnl0ZSBzdHJpZGVcbiAgICAgICAgICAgIHRoaXMuYnl0ZVN0cmlkZSA9IGdldFN0cmlkZSh0aGlzLnBvaW50ZXJzKTtcbiAgICAgICAgICAgIC8vIHRoZW4gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFZlcnRleFBhY2thZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVmVydGV4UGFja2FnZSBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoYXJnLmJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZWJHTEJ1ZmZlciBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5ieXRlTGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBXZWJHTEJ1ZmZlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMuYnl0ZUxlbmd0aGAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gYXJnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBvcHRpb25zLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb3IgQXJyYXlCdWZmZXIgb3IgbnVtYmVyIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgdmVydGV4IGRhdGEgdG8gdGhlIEdQVS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIsIG9yIHNpemUgb2YgdGhlIGJ1ZmZlciBpbiBieXRlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VmVydGV4QnVmZmVyfSBUaGUgdmVydGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlckRhdGEoYXJnKSB7XG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBlbnN1cmUgYXJndW1lbnQgaXMgdmFsaWRcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgICAgICAvLyBjYXN0IGFycmF5IGludG8gRmxvYXQzMkFycmF5XG4gICAgICAgICAgICAgICAgYXJnID0gbmV3IEZsb2F0MzJBcnJheShhcmcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhKGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuICAgICAgICAgICAgICAgICEoQXJyYXlCdWZmZXIuaXNWaWV3KGFyZykpICYmXG4gICAgICAgICAgICAgICAgIShOdW1iZXIuaXNJbnRlZ2VyKGFyZykpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgbm90IGFycmF5YnVmZmVyIG9yIGEgbnVtZXJpYyBzaXplXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBgQXJyYXlCdWZmZXJWaWV3YCwgb3IgYE51bWJlcmAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGJ5dGUgbGVuZ3RoXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihhcmcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBhcmcuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBidWZmZXIgaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5XG4gICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgcGFydGlhbCB2ZXJ0ZXggZGF0YSB0byB0aGUgR1BVLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlld30gYXJyYXkgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGF0IHdoaWNoIHRvIGJ1ZmZlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VmVydGV4QnVmZmVyfSBUaGUgdmVydGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlclN1YkRhdGEoYXJyYXksIGJ5dGVPZmZzZXQgPSBERUZBVUxUX0JZVEVfT0ZGU0VUKSB7XG4gICAgICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBlbnN1cmUgdGhlIGJ1ZmZlciBleGlzdHNcbiAgICAgICAgICAgIGlmICghdGhpcy5idWZmZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQnVmZmVyIGhhcyBub3QgeWV0IGJlZW4gYWxsb2NhdGVkLCBhbGxvY2F0ZSB3aXRoICcgK1xuICAgICAgICAgICAgICAgICAgICAnYGJ1ZmZlckRhdGFgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVuc3VyZSBhcmd1bWVudCBpcyB2YWxpZFxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGFycmF5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgIShhcnJheSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuICAgICAgICAgICAgICAgICFBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYXkpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ29yIGBBcnJheUJ1ZmZlclZpZXdgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgd2UgYXJlbid0IG92ZXJmbG93aW5nIHRoZSBidWZmZXJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0ICsgYXJyYXkuYnl0ZUxlbmd0aCA+IHRoaXMuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBBcmd1bWVudCBvZiBsZW5ndGggJHthcnJheS5ieXRlTGVuZ3RofSBieXRlcyB3aXRoIGAgK1xuICAgICAgICAgICAgICAgICAgICBgb2Zmc2V0IG9mICR7Ynl0ZU9mZnNldH0gYnl0ZXMgb3ZlcmZsb3dzIHRoZSBidWZmZXIgYCArXG4gICAgICAgICAgICAgICAgICAgIGBsZW5ndGggb2YgJHt0aGlzLmJ5dGVMZW5ndGh9IGJ5dGVzYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgYnl0ZU9mZnNldCwgYXJyYXkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZHMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IC0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYmluZCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGJpbmQgYnVmZmVyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuICAgICAgICAgICAgLy8gZm9yIGVhY2ggYXR0cmlidXRlIHBvaW50ZXJcbiAgICAgICAgICAgIHRoaXMucG9pbnRlcnMuZm9yRWFjaCgocG9pbnRlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgYXR0cmlidXRlIHBvaW50ZXJcbiAgICAgICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxuICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlci5zaXplLFxuICAgICAgICAgICAgICAgICAgICBnbFtwb2ludGVyLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ieXRlU3RyaWRlLFxuICAgICAgICAgICAgICAgICAgICBwb2ludGVyLmJ5dGVPZmZzZXQpO1xuICAgICAgICAgICAgICAgIC8vIGVuYWJsZSBhdHRyaWJ1dGUgaW5kZXhcbiAgICAgICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShpbmRleCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVuYmluZHMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgdW5iaW5kKCkge1xuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgLy8gdW5iaW5kIGJ1ZmZlclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlcnMuZm9yRWFjaCgocG9pbnRlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBkaXNhYmxlIGF0dHJpYnV0ZSBpbmRleFxuICAgICAgICAgICAgICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShpbmRleCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIGJvdW5kIGJ1ZmZlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3QXJyYXlzJy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmluZGV4T2Zmc2V0IC0gVGhlIGluZGV4IG9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiBpbmRpY2VzIHRvIGRyYXcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZlcnRleEJ1ZmZlcn0gVGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBkcmF3KG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgY29uc3QgbW9kZSA9IGdsW29wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGVdO1xuICAgICAgICAgICAgY29uc3QgaW5kZXhPZmZzZXQgPSAob3B0aW9ucy5pbmRleE9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuaW5kZXhPZmZzZXQgOiB0aGlzLmluZGV4T2Zmc2V0O1xuICAgICAgICAgICAgY29uc3QgY291bnQgPSAob3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY291bnQgOiB0aGlzLmNvdW50O1xuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGEgY291bnQgb2YgMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkcmF3IGVsZW1lbnRzXG4gICAgICAgICAgICBnbC5kcmF3QXJyYXlzKG1vZGUsIGluZGV4T2Zmc2V0LCBjb3VudCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4QnVmZmVyO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgQ09NUE9ORU5UX1RZUEUgPSAnRkxPQVQnO1xuICAgIGNvbnN0IEJZVEVTX1BFUl9DT01QT05FTlQgPSA0O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBsZW5ndGggPiAwIGtleSBieSBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gaW50LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBtYXAgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIHZhbGlkIGFycmF5IG9mIGFyZ3VtZW50cy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZUF0dHJpYnV0ZU1hcChhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGNvbnN0IGdvb2RBdHRyaWJ1dGVzID0gW107XG4gICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VGbG9hdChrZXkpO1xuICAgICAgICAgICAgLy8gY2hlY2sgdGhhdCBrZXkgaXMgYW4gdmFsaWQgaW50ZWdlclxuICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGluZGV4KSB8fCBpbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgQXR0cmlidXRlIGluZGV4IFxcYCR7a2V5fVxcYCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWxpZCBpbnRlZ2VyYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZlcnRpY2VzID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgLy8gZW5zdXJlIGF0dHJpYnV0ZSBpcyB2YWxpZFxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmVydGljZXMpICYmIHZlcnRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgYXR0cmlidXRlIGRhdGEgYW5kIGluZGV4XG4gICAgICAgICAgICAgICAgZ29vZEF0dHJpYnV0ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmVydGljZXNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYEVycm9yIHBhcnNpbmcgYXR0cmlidXRlIG9mIGluZGV4IFxcYCR7aW5kZXh9XFxgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHNvcnQgYXR0cmlidXRlcyBhc2NlbmRpbmcgYnkgaW5kZXhcbiAgICAgICAgZ29vZEF0dHJpYnV0ZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGdvb2RBdHRyaWJ1dGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBjb21wb25lbnQncyBieXRlIHNpemUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50IHRvIG1lYXN1cmUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBieXRlIHNpemUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRTaXplKGNvbXBvbmVudCkge1xuICAgICAgICAvLyBjaGVjayBpZiBhcnJheVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBpZiB2ZWN0b3JcbiAgICAgICAgaWYgKGNvbXBvbmVudC54ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIDEgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC55ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyAyIGNvbXBvbmVudCB2ZWN0b3JcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAzIGNvbXBvbmVudCB2ZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC53ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2luZ2xlIGNvbXBvbmVudFxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSB0eXBlLCBzaXplLCBhbmQgb2Zmc2V0IGZvciBlYWNoIGF0dHJpYnV0ZSBpbiB0aGUgYXR0cmlidXRlIGFycmF5IGFsb25nIHdpdGggdGhlIGxlbmd0aCBhbmQgc3RyaWRlIG9mIHRoZSBwYWNrYWdlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1ZlcnRleFBhY2thZ2V9IHZlcnRleFBhY2thZ2UgLSBUaGUgVmVydGV4UGFja2FnZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXR0cmlidXRlcyBUaGUgYXJyYXkgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0UG9pbnRlcnNBbmRTdHJpZGUodmVydGV4UGFja2FnZSwgYXR0cmlidXRlcykge1xuICAgICAgICBsZXQgc2hvcnRlc3RBcnJheSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xuICAgICAgICAvLyBmb3IgZWFjaCBhdHRyaWJ1dGVcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKHZlcnRpY2VzID0+IHtcbiAgICAgICAgICAgIC8vIHNldCBzaXplIHRvIG51bWJlciBvZiBjb21wb25lbnRzIGluIHRoZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBnZXRDb21wb25lbnRTaXplKHZlcnRpY2VzLmRhdGFbMF0pO1xuICAgICAgICAgICAgLy8gbGVuZ3RoIG9mIHRoZSBwYWNrYWdlIHdpbGwgYmUgdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcbiAgICAgICAgICAgIHNob3J0ZXN0QXJyYXkgPSBNYXRoLm1pbihzaG9ydGVzdEFycmF5LCB2ZXJ0aWNlcy5kYXRhLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBzdG9yZSBwb2ludGVyIHVuZGVyIGluZGV4XG4gICAgICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzLnNldCh2ZXJ0aWNlcy5pbmRleCwge1xuICAgICAgICAgICAgICAgIHR5cGU6IENPTVBPTkVOVF9UWVBFLFxuICAgICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgICAgYnl0ZU9mZnNldDogb2Zmc2V0ICogQllURVNfUEVSX0NPTVBPTkVOVFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBhY2N1bXVsYXRlIGF0dHJpYnV0ZSBvZmZzZXRcbiAgICAgICAgICAgIG9mZnNldCArPSBzaXplO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gc2V0IHN0cmlkZSB0byB0b3RhbCBvZmZzZXRcbiAgICAgICAgdmVydGV4UGFja2FnZS5zdHJpZGUgPSBvZmZzZXQ7IC8vIG5vdCBpbiBieXRlc1xuICAgICAgICAvLyBzZXQgbGVuZ3RoIG9mIHBhY2thZ2UgdG8gdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcbiAgICAgICAgdmVydGV4UGFja2FnZS5sZW5ndGggPSBzaG9ydGVzdEFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbGwgdGhlIGFycmF5YnVmZmVyIHdpdGggYSBzaW5nbGUgY29tcG9uZW50IGF0dHJpYnV0ZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUsIG5vdCBpbiBieXRlcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIC0gVGhlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLCBub3QgaW4gYnl0ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0MUNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSkge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHZlcnRpY2VzW2ldO1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiB0aGUgYnVmZmVyIHRvIHRoZSBwYXJ0aWN1bGFyIHZlcnRleFxuICAgICAgICAgICAgY29uc3QgaiA9IG9mZnNldCArIChzdHJpZGUgKiBpKTtcbiAgICAgICAgICAgIGlmICh2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyW2pdID0gdmVydGV4Lng7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZlcnRleFswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyW2pdID0gdmVydGV4WzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidWZmZXJbal0gPSB2ZXJ0ZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgZG91YmxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLCBub3QgaW4gYnl0ZXMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlciwgbm90IGluIGJ5dGVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldDJDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcbiAgICAgICAgICAgIGNvbnN0IGogPSBvZmZzZXQgKyAoc3RyaWRlICogaSk7XG4gICAgICAgICAgICBidWZmZXJbal0gPSAodmVydGV4LnggIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgdHJpcGxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLCBub3QgaW4gYnl0ZXMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlciwgbm90IGluIGJ5dGVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldDNDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcbiAgICAgICAgICAgIGNvbnN0IGogPSBvZmZzZXQgKyAoc3RyaWRlICogaSk7XG4gICAgICAgICAgICBidWZmZXJbal0gPSAodmVydGV4LnggIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG4gICAgICAgICAgICBidWZmZXJbaisyXSA9ICh2ZXJ0ZXgueiAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHF1YWRydXBsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQ0Q29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gdmVydGljZXNbaV07XG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XG4gICAgICAgICAgICBjb25zdCBqID0gb2Zmc2V0ICsgKHN0cmlkZSAqIGkpO1xuICAgICAgICAgICAgYnVmZmVyW2pdID0gKHZlcnRleC54ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XG4gICAgICAgICAgICBidWZmZXJbaisxXSA9ICh2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xuICAgICAgICAgICAgYnVmZmVyW2orMl0gPSAodmVydGV4LnogIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueiA6IHZlcnRleFsyXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzNdID0gKHZlcnRleC53ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LncgOiB2ZXJ0ZXhbM107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgVmVydGV4UGFja2FnZVxuICAgICAqIEBjbGFzc2Rlc2MgQSB2ZXJ0ZXggcGFja2FnZSB0byBhc3Npc3QgaW4gaW50ZXJsZWF2aW5nIHZlcnRleCBkYXRhIGFuZCBidWlsZGluZyB0aGUgYXNzb2NpYXRlZCB2ZXJ0ZXggYXR0cmlidXRlIHBvaW50ZXJzLlxuICAgICAqL1xuICAgIGNsYXNzIFZlcnRleFBhY2thZ2Uge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBWZXJ0ZXhQYWNrYWdlIG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIC0gVGhlIGF0dHJpYnV0ZXMgdG8gaW50ZXJsZWF2ZSBrZXllZCBieSBpbmRleC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RyaWRlID0gMDtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgZGF0YSB0byBiZSBpbnRlcmxlYXZlZCBpbnNpZGUgdGhlIHBhY2thZ2UuIFRoaXMgY2xlYXJzIGFueSBwcmV2aW91c2x5IGV4aXN0aW5nIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIC0gVGhlIGF0dHJpYnV0ZXMgdG8gaW50ZXJsZWF2ZWQsIGtleWVkIGJ5IGluZGV4LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWZXJ0ZXhQYWNrYWdlfSBUaGUgdmVydGV4IHBhY2thZ2Ugb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXQoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIGJhZCBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gcGFyc2VBdHRyaWJ1dGVNYXAoYXR0cmlidXRlcyk7XG4gICAgICAgICAgICAvLyBzZXQgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCBzdHJpZGVcbiAgICAgICAgICAgIHNldFBvaW50ZXJzQW5kU3RyaWRlKHRoaXMsIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgLy8gc2V0IHNpemUgb2YgZGF0YSB2ZWN0b3JcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3Qgc3RyaWRlID0gdGhpcy5zdHJpZGU7IC8vIG5vdCBpbiBieXRlc1xuICAgICAgICAgICAgY29uc3QgcG9pbnRlcnMgPSB0aGlzLnBvaW50ZXJzO1xuICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIHN0cmlkZSk7XG4gICAgICAgICAgICAvLyBmb3IgZWFjaCB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2godmVydGljZXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50ZXIgPSBwb2ludGVycy5nZXQodmVydGljZXMuaW5kZXgpO1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlcnMgb2Zmc2V0XG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gcG9pbnRlci5ieXRlT2Zmc2V0IC8gQllURVNfUEVSX0NPTVBPTkVOVDtcbiAgICAgICAgICAgICAgICAvLyBjb3B5IHZlcnRleCBkYXRhIGludG8gYXJyYXlidWZmZXJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHBvaW50ZXIuc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQyQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldDNDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0NENvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0MUNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleFBhY2thZ2U7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuXG4gICAgLyoqXG4gICAgICogQmluZCB0aGUgdmlld3BvcnQgdG8gdGhlIHJlbmRlcmluZyBjb250ZXh0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtWaWV3cG9ydH0gdmlld3BvcnQgLSBUaGUgdmlld3BvcnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvdmVycmlkZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBob3Jpem9udGFsIG9mZnNldCBvdmVycmlkZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0KHZpZXdwb3J0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IGdsID0gdmlld3BvcnQuZ2w7XG4gICAgICAgIHggPSAoeCAhPT0gdW5kZWZpbmVkKSA/IHggOiB2aWV3cG9ydC54O1xuICAgICAgICB5ID0gKHkgIT09IHVuZGVmaW5lZCkgPyB5IDogdmlld3BvcnQueTtcbiAgICAgICAgd2lkdGggPSAod2lkdGggIT09IHVuZGVmaW5lZCkgPyB3aWR0aCA6IHZpZXdwb3J0LndpZHRoO1xuICAgICAgICBoZWlnaHQgPSAoaGVpZ2h0ICE9PSB1bmRlZmluZWQpID8gaGVpZ2h0IDogdmlld3BvcnQuaGVpZ2h0O1xuICAgICAgICBnbC52aWV3cG9ydCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgVmlld3BvcnRcbiAgICAgKiBAY2xhc3NkZXNjIEEgdmlld3BvcnQgY2xhc3MgZm9yIG1hbmFnaW5nIFdlYkdMIHZpZXdwb3J0cy5cbiAgICAgKi9cbiAgICBjbGFzcyBWaWV3cG9ydCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIFZpZXdwb3J0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdmlld3BvcnQgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgICAgICAvLyBzZXQgc2l6ZVxuICAgICAgICAgICAgdGhpcy5yZXNpemUoXG4gICAgICAgICAgICAgICAgc3BlYy53aWR0aCB8fCB0aGlzLmdsLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICAgICAgICBzcGVjLmhlaWdodCB8fCB0aGlzLmdsLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgdGhlIHZpZXdwb3J0cyB3aWR0aCBhbmQgaGVpZ2h0LiBUaGlzIHJlc2l6ZXMgdGhlIHVuZGVybHlpbmcgY2FudmFzIGVsZW1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZSh3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHdpZHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgd2lkdGhcXGAgb2YgXFxgJHt3aWR0aH1cXGAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5nbC5jYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuZ2wuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHZpZXdwb3J0IGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uLiBUaGUgdW5kZXJseWluZyBjYW52YXMgZWxlbWVudCBpcyBub3QgYWZmZWN0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb3ZlcnJpZGUuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIGhvcml6b250YWwgb2Zmc2V0IG92ZXJyaWRlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZpZXdwb3J0fSAtIFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHB1c2goeCA9IDAsIHkgPSAwLCB3aWR0aCA9IHRoaXMud2lkdGgsIGhlaWdodCA9IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHggIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIFxcYHhcXGAgb2YgXFxgJHt4fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgeSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgeVxcYCBvZiBcXGAke3l9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgd2lkdGggPD0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGB3aWR0aFxcYCBvZiBcXGAke3dpZHRofVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCBoZWlnaHQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGBoZWlnaHRcXGAgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcHVzaCBvbnRvIHN0YWNrXG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gc2V0IHZpZXdwb3J0XG4gICAgICAgICAgICBzZXQodGhpcywgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQb3BzIGN1cnJlbnQgdGhlIHZpZXdwb3J0IG9iamVjdCBhbmQgc2V0cyB0aGUgdmlld3BvcnQgYmVuZWF0aCBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHBvcCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdWaWV3cG9ydCBzdGFjayBpcyBlbXB0eSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBzZXQodGhpcywgdG9wLngsIHRvcC55LCB0b3Aud2lkdGgsIHRvcC5oZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmlld3BvcnQ7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCBFWFRFTlNJT05TID0gW1xuICAgICAgICAvLyByYXRpZmllZFxuICAgICAgICAnT0VTX3RleHR1cmVfZmxvYXQnLFxuICAgICAgICAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCcsXG4gICAgICAgICdXRUJHTF9sb3NlX2NvbnRleHQnLFxuICAgICAgICAnT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICAgJ09FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0JyxcbiAgICAgICAgJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nLFxuICAgICAgICAnV0VCR0xfZGVidWdfc2hhZGVycycsXG4gICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YycsXG4gICAgICAgICdXRUJHTF9kZXB0aF90ZXh0dXJlJyxcbiAgICAgICAgJ09FU19lbGVtZW50X2luZGV4X3VpbnQnLFxuICAgICAgICAnRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJyxcbiAgICAgICAgJ0VYVF9mcmFnX2RlcHRoJyxcbiAgICAgICAgJ1dFQkdMX2RyYXdfYnVmZmVycycsXG4gICAgICAgICdBTkdMRV9pbnN0YW5jZWRfYXJyYXlzJyxcbiAgICAgICAgJ09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhcicsXG4gICAgICAgICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhcicsXG4gICAgICAgICdFWFRfYmxlbmRfbWlubWF4JyxcbiAgICAgICAgJ0VYVF9zaGFkZXJfdGV4dHVyZV9sb2QnLFxuICAgICAgICAvLyBjb21tdW5pdHlcbiAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hdGMnLFxuICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjJyxcbiAgICAgICAgJ0VYVF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCcsXG4gICAgICAgICdXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQnLFxuICAgICAgICAnRVhUX3NSR0InLFxuICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnLFxuICAgICAgICAnRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5JyxcbiAgICAgICAgJ0VYVF9jb2xvcl9idWZmZXJfZmxvYXQnXG4gICAgXTtcblxuICAgIGNvbnN0IF9jb250ZXh0cyA9IG5ldyBNYXAoKTtcblxuICAgIGxldCBfYm91bmRDb250ZXh0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gcmZjNDEyMiB2ZXJzaW9uIDQgY29tcGxpYW50IFVVSUQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gLSBUaGUgVVVJRCBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VVVJRCgpIHtcbiAgICAgICAgY29uc3QgcmVwbGFjZSA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgICAgICAgICAgY29uc3QgdiA9IChjID09PSAneCcpID8gciA6IChyICYgMHgzIHwgMHg4KTtcbiAgICAgICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIEhUTUxDYW52YXNFbGVtZW50IGVsZW1lbnQuIElmIHRoZXJlIGlzIG5vIGlkLCBpdCBnZW5lcmF0ZXMgb25lIGFuZCBhcHBlbmRzIGl0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBUaGUgQ2FudmFzIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIENhbnZhcyBpZCBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0SWQoY2FudmFzKSB7XG4gICAgICAgIGlmICghY2FudmFzLmlkKSB7XG4gICAgICAgICAgICBjYW52YXMuaWQgPSBnZXRVVUlEKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbnZhcy5pZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IGZyb20gZWl0aGVyIGFuIGV4aXN0aW5nIG9iamVjdCwgb3IgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkIG9yIHNlbGVjdG9yIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENhbnZhcyhhcmcpIHtcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXJnKSB8fFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYXJnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byByZXRyaWV2ZSBhIHdyYXBwZWQgV2ViR0xSZW5kZXJpbmdDb250ZXh0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IHRvIGNyZWF0ZSB0aGUgY29udGV4dCB1bmRlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRDb250ZXh0V3JhcHBlcihhcmcpIHtcbiAgICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoX2JvdW5kQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBsYXN0IGJvdW5kIGNvbnRleHRcbiAgICAgICAgICAgICAgICByZXR1cm4gX2JvdW5kQ29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGdldENhbnZhcyhhcmcpO1xuICAgICAgICAgICAgaWYgKGNhbnZhcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dHMuZ2V0KGdldElkKGNhbnZhcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG5vIGJvdW5kIGNvbnRleHQgb3IgYXJndW1lbnRcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhbGwga25vd24gZXh0ZW5zaW9ucyBmb3IgYSBwcm92aWRlZCBXZWJHTFJlbmRlcmluZ0NvbnRleHQuIFN0b3JlcyB0aGUgcmVzdWx0cyBpbiB0aGUgY29udGV4dCB3cmFwcGVyIGZvciBsYXRlciBxdWVyaWVzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFdyYXBwZXIgLSBUaGUgY29udGV4dCB3cmFwcGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRFeHRlbnNpb25zKGNvbnRleHRXcmFwcGVyKSB7XG4gICAgICAgIGNvbnN0IGdsID0gY29udGV4dFdyYXBwZXIuZ2w7XG4gICAgICAgIEVYVEVOU0lPTlMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICBjb250ZXh0V3JhcHBlci5leHRlbnNpb25zLnNldChpZCwgZ2wuZ2V0RXh0ZW5zaW9uKGlkKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIGNyZWF0ZSBhIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBhbmQgbG9hZCBhbGwgZXh0ZW5zaW9ucy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gLSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IHRvIGNyZWF0ZSB0aGUgY29udGV4dCB1bmRlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH19IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY29udGV4dCB3cmFwcGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRleHRXcmFwcGVyKGNhbnZhcywgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdGlvbnMpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnLCBvcHRpb25zKTtcbiAgICAgICAgLy8gd3JhcCBjb250ZXh0XG4gICAgICAgIGNvbnN0IGNvbnRleHRXcmFwcGVyID0ge1xuICAgICAgICAgICAgaWQ6IGdldElkKGNhbnZhcyksXG4gICAgICAgICAgICBnbDogZ2wsXG4gICAgICAgICAgICBleHRlbnNpb25zOiBuZXcgTWFwKClcbiAgICAgICAgfTtcbiAgICAgICAgLy8gbG9hZCBXZWJHTCBleHRlbnNpb25zXG4gICAgICAgIGxvYWRFeHRlbnNpb25zKGNvbnRleHRXcmFwcGVyKTtcbiAgICAgICAgLy8gYWRkIGNvbnRleHQgd3JhcHBlciB0byBtYXBcbiAgICAgICAgX2NvbnRleHRzLnNldChnZXRJZChjYW52YXMpLCBjb250ZXh0V3JhcHBlcik7XG4gICAgICAgIC8vIGJpbmQgdGhlIGNvbnRleHRcbiAgICAgICAgX2JvdW5kQ29udGV4dCA9IGNvbnRleHRXcmFwcGVyO1xuICAgICAgICByZXR1cm4gY29udGV4dFdyYXBwZXI7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQgYW5kIGJpbmRzIGl0LiBXaGlsZSBib3VuZCwgdGhlIGFjdGl2ZSBjb250ZXh0IHdpbGwgYmUgdXNlZCBpbXBsaWNpdGx5IGJ5IGFueSBpbnN0YW50aWF0ZWQgYGVzcGVyYCBjb25zdHJ1Y3RzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7V2ViR0xDb250ZXh0fSBUaGUgbmFtZXNwYWNlLCB1c2VkIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG4gICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgIF9ib3VuZENvbnRleHQgPSB3cmFwcGVyO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgYE5vIGNvbnRleHQgZXhpc3RzIGZvciBwcm92aWRlZCBhcmd1bWVudCAnJHthcmd9J2A7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQuIElmIG5vIGNvbnRleHQgZXhpc3RzLCBvbmUgaXMgY3JlYXRlZC5cbiAgICAgICAgICogRHVyaW5nIGNyZWF0aW9uIGF0dGVtcHRzIHRvIGxvYWQgYWxsIGV4dGVuc2lvbnMgZm91bmQgYXQ6IGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBUaGUgV2ViR0xSZW5kZXJpbmdDb250ZXh0IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24oYXJnLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcbiAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIG5hdGl2ZSBXZWJHTFJlbmRlcmluZ0NvbnRleHRcbiAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmdsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZ2V0IGNhbnZhcyBlbGVtZW50XG4gICAgICAgICAgICBjb25zdCBjYW52YXMgPSBnZXRDYW52YXMoYXJnKTtcbiAgICAgICAgICAgIC8vIHRyeSB0byBmaW5kIG9yIGNyZWF0ZSBjb250ZXh0XG4gICAgICAgICAgICBpZiAoIWNhbnZhcykge1xuICAgICAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBjb250ZXh0XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29udGV4dFdyYXBwZXIoY2FudmFzLCBvcHRpb25zKS5nbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IG9iamVjdCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH19IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAgICBfY29udGV4dHMuZGVsZXRlKHdyYXBwZXIuaWQpO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpZiBjdXJyZW50bHkgYm91bmRcbiAgICAgICAgICAgICAgICBpZiAod3JhcHBlciA9PT0gX2JvdW5kQ29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBfYm91bmRDb250ZXh0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3VwcG9ydGVkIGV4dGVuc2lvbnMgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IEFsbCBzdXBwb3J0ZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIHN1cHBvcnRlZEV4dGVuc2lvbnM6IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG4gICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VwcG9ydGVkID0gW107XG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5mb3JFYWNoKChleHRlbnNpb24sIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwb3J0ZWQucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cHBvcnRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdW5zdXBwb3J0ZWQgZXh0ZW5zaW9ucyBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX0gQWxsIHVuc3VwcG9ydGVkIGV4dGVuc2lvbnMuXG4gICAgICAgICAqL1xuICAgICAgICB1bnN1cHBvcnRlZEV4dGVuc2lvbnM6IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG4gICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5zdXBwb3J0ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zLmZvckVhY2goKGV4dGVuc2lvbiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bnN1cHBvcnRlZC5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5zdXBwb3J0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBgTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHByb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgJHt0eXBlb2YgYXJnfWA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBpZiBhbiBleHRlbnNpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXh0ZW5zaW9uIC0gVGhlIGV4dGVuc2lvbiBuYW1lLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvdmlkZWQgZXh0ZW5zaW9uIGhhcyBiZWVuIGxvYWRlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAqL1xuICAgICAgICBjaGVja0V4dGVuc2lvbjogZnVuY3Rpb24oYXJnLCBleHRlbnNpb24pIHtcbiAgICAgICAgICAgIGlmICghZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gYXJnO1xuICAgICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuICAgICAgICAgICAgICAgIHJldHVybiBleHRlbnNpb25zLmdldChleHRlbnNpb24pID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBpZiBpdCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb24gLSBUaGUgZXh0ZW5zaW9uIG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBwcm92aWRlZCBleHRlbnNpb24gaGFzIGJlZW4gbG9hZGVkIHN1Y2Nlc3NmdWxseS5cbiAgICAgICAgICovXG4gICAgICAgIGdldEV4dGVuc2lvbjogZnVuY3Rpb24oYXJnLCBleHRlbnNpb24pIHtcbiAgICAgICAgICAgIGlmICghZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gYXJnO1xuICAgICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuICAgICAgICAgICAgICAgIHJldHVybiBleHRlbnNpb25zLmdldChleHRlbnNpb24pIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBgTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHByb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgJHt0eXBlb2YgYXJnfWA7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICAgICBJbmRleEJ1ZmZlcjogcmVxdWlyZSgnLi9jb3JlL0luZGV4QnVmZmVyJyksXHJcbiAgICAgICAgUmVuZGVyYWJsZTogcmVxdWlyZSgnLi9jb3JlL1JlbmRlcmFibGUnKSxcclxuICAgICAgICBSZW5kZXJUYXJnZXQ6IHJlcXVpcmUoJy4vY29yZS9SZW5kZXJUYXJnZXQnKSxcclxuICAgICAgICBTaGFkZXI6IHJlcXVpcmUoJy4vY29yZS9TaGFkZXInKSxcclxuICAgICAgICBUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlMkQnKSxcclxuICAgICAgICBDb2xvclRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL0NvbG9yVGV4dHVyZTJEJyksXHJcbiAgICAgICAgRGVwdGhUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9EZXB0aFRleHR1cmUyRCcpLFxyXG4gICAgICAgIFRleHR1cmVDdWJlTWFwOiByZXF1aXJlKCcuL2NvcmUvVGV4dHVyZUN1YmVNYXAnKSxcclxuICAgICAgICBWZXJ0ZXhCdWZmZXI6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcclxuICAgICAgICBWZXJ0ZXhQYWNrYWdlOiByZXF1aXJlKCcuL2NvcmUvVmVydGV4UGFja2FnZScpLFxyXG4gICAgICAgIFZpZXdwb3J0OiByZXF1aXJlKCcuL2NvcmUvVmlld3BvcnQnKSxcclxuICAgICAgICBXZWJHTENvbnRleHQ6IHJlcXVpcmUoJy4vY29yZS9XZWJHTENvbnRleHQnKVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIGdldEl0ZXJhdG9yKGFyZykge1xuICAgICAgICBsZXQgaSA9IC0xO1xuICAgICAgICBsZXQgbGVuO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICBsZW4gPSBhcmcubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGkgOiBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGFyZyk7XG4gICAgICAgIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGtleXNbaV0gOiBudWxsO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGZuID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGZuID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlYWNoKG9iamVjdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gb25jZShjYWxsYmFjayk7XG4gICAgICAgIGxldCBrZXk7XG4gICAgICAgIGxldCBjb21wbGV0ZWQgPSAwO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRvbmUoZXJyKSB7XG4gICAgICAgICAgICBjb21wbGV0ZWQtLTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IG51bGwgJiYgY29tcGxldGVkIDw9IDApIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBrZXkgaXMgbnVsbCBpbiBjYXNlIGl0ZXJhdG9yIGlzbid0IGV4aGF1c3RlZCBhbmQgZG9uZVxuICAgICAgICAgICAgICAgIC8vIHdhcyByZXNvbHZlZCBzeW5jaHJvbm91c2x5LlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGl0ZXIgPSBnZXRJdGVyYXRvcihvYmplY3QpO1xuICAgICAgICB3aGlsZSAoKGtleSA9IGl0ZXIoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgaXRlcmF0b3Iob2JqZWN0W2tleV0sIGtleSwgZG9uZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBsZXRlZCA9PT0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBhIHNldCBvZiBmdW5jdGlvbnMgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIGhhdmUgYmVlblxuICAgICAgICAgKiBjb21wbGV0ZWQsIGV4ZWN1dGUgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLiBKb2JzIG1heSBiZSBwYXNzZWRcbiAgICAgICAgICogYXMgYW4gYXJyYXkgb3Igb2JqZWN0LiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gd2lsbCBiZSBwYXNzZWQgdGhlXG4gICAgICAgICAqIHJlc3VsdHMgaW4gdGhlIHNhbWUgZm9ybWF0IGFzIHRoZSB0YXNrcy4gQWxsIHRhc2tzIG11c3QgaGF2ZSBhY2NlcHRcbiAgICAgICAgICogYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSB0YXNrcyAtIFRoZSBzZXQgb2YgZnVuY3Rpb25zIHRvIGV4ZWN1dGUuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHVwb24gY29tcGxldGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHBhcmFsbGVsOiBmdW5jdGlvbih0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gQXJyYXkuaXNBcnJheSh0YXNrcykgPyBbXSA6IHt9O1xuICAgICAgICAgICAgZWFjaCh0YXNrcywgZnVuY3Rpb24odGFzaywga2V5LCBkb25lKSB7XG4gICAgICAgICAgICAgICAgdGFzayhmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2tleV0gPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kcyBhbiBHRVQgcmVxdWVzdCBjcmVhdGUgYW4gSW1hZ2Ugb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBYSFIgb3B0aW9ucy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudXJsIC0gVGhlIFVSTCBmb3IgdGhlIHJlc291cmNlLlxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbnMuY3Jvc3NPcmlnaW4gLSBFbmFibGUgY3Jvc3Mtb3JpZ2luIHJlcXVlc3QuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuc3VjY2VzcyAtIFRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmVycm9yIC0gVGhlIGVycm9yIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZDogZnVuY3Rpb24gKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhpbWFnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBgVW5hYmxlIHRvIGxvYWQgaW1hZ2UgZnJvbSBVUkw6IFxcYCR7ZXZlbnQucGF0aFswXS5jdXJyZW50U3JjIH1cXGBgO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLmNyb3NzT3JpZ2luID0gb3B0aW9ucy5jcm9zc09yaWdpbiA/ICdhbm9ueW1vdXMnIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gb3B0aW9ucy51cmw7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgVXRpbCA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBhcmd1bWVudCBpcyBvbmUgb2YgdGhlIFdlYkdMIGB0ZXhJbWFnZTJEYCBvdmVycmlkZGVuXG4gICAgICogY2FudmFzIHR5cGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBhcmcgLSBUaGUgYXJndW1lbnQgdG8gdGVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2x9IC0gV2hldGhlciBvciBub3QgaXQgaXMgYSBjYW52YXMgdHlwZS5cbiAgICAgKi9cbiAgICBVdGlsLmlzQ2FudmFzVHlwZSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gYXJnIGluc3RhbmNlb2YgSW1hZ2VEYXRhIHx8XG4gICAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50IHx8XG4gICAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCB8fFxuICAgICAgICAgICAgYXJnIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXh0dXJlIE1VU1QgYmUgYSBwb3dlci1vZi10d28uIE90aGVyd2lzZSByZXR1cm4gZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB0ZXh0dXJlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbH0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgdGV4dHVyZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvLlxuICAgICAqL1xuICAgIFV0aWwubXVzdEJlUG93ZXJPZlR3byA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvOlxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xfQVBJL1R1dG9yaWFsL1VzaW5nX3RleHR1cmVzX2luX1dlYkdMI05vbl9wb3dlci1vZi10d29fdGV4dHVyZXNcbiAgICAgICAgLy8gTi1QT1QgdGV4dHVyZXMgY2Fubm90IGJlIHVzZWQgd2l0aCBtaXBtYXBwaW5nIGFuZCB0aGV5IG11c3Qgbm90IFwiUkVQRUFUXCJcbiAgICAgICAgcmV0dXJuIHNwZWMubWlwTWFwIHx8XG4gICAgICAgICAgICBzcGVjLndyYXBTID09PSAnUkVQRUFUJyB8fFxuICAgICAgICAgICAgc3BlYy53cmFwUyA9PT0gJ01JUlJPUkVEX1JFUEVBVCcgfHxcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPT09ICdSRVBFQVQnIHx8XG4gICAgICAgICAgICBzcGVjLndyYXBUID09PSAnTUlSUk9SRURfUkVQRUFUJztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBpbnRlZ2VyIGlzIGEgcG93ZXIgb2YgdHdvLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bSAtIFRoZSBudW1iZXIgdG8gdGVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIG51bWJlciBpcyBhIHBvd2VyIG9mIHR3by5cbiAgICAgKi9cbiAgICBVdGlsLmlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICByZXR1cm4gKG51bSAhPT0gMCkgPyAobnVtICYgKG51bSAtIDEpKSA9PT0gMCA6IGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvIGZvciBhIG51bWJlci5cbiAgICAgKlxuICAgICAqIEV4LlxuICAgICAqXG4gICAgICogICAgIDIwMCAtPiAyNTZcbiAgICAgKiAgICAgMjU2IC0+IDI1NlxuICAgICAqICAgICAyNTcgLT4gNTEyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtIC0gVGhlIG51bWJlciB0byBtb2RpZnkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gTmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3by5cbiAgICAgKi9cbiAgICBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICBpZiAobnVtICE9PSAwKSB7XG4gICAgICAgICAgICBudW0gPSBudW0tMTtcbiAgICAgICAgfVxuICAgICAgICBudW0gfD0gbnVtID4+IDE7XG4gICAgICAgIG51bSB8PSBudW0gPj4gMjtcbiAgICAgICAgbnVtIHw9IG51bSA+PiA0O1xuICAgICAgICBudW0gfD0gbnVtID4+IDg7XG4gICAgICAgIG51bSB8PSBudW0gPj4gMTY7XG4gICAgICAgIHJldHVybiBudW0gKyAxO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgdGV4dHVyZSBtdXN0IGJlIGEgUE9ULCByZXNpemVzIGFuZCByZXR1cm5zIHRoZSBpbWFnZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdGV4dHVyZSBzcGVjaWZpY2F0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltZyAtIFRoZSBpbWFnZSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fSAtIFRoZSBvcmlnaW5hbCBpbWFnZSwgb3IgdGhlIHJlc2l6ZWQgY2FudmFzIGVsZW1lbnQuXG4gICAgICovXG4gICAgVXRpbC5yZXNpemVDYW52YXMgPSBmdW5jdGlvbihzcGVjLCBpbWcpIHtcbiAgICAgICAgaWYgKCFVdGlsLm11c3RCZVBvd2VyT2ZUd28oc3BlYykgfHxcbiAgICAgICAgICAgIChVdGlsLmlzUG93ZXJPZlR3byhpbWcud2lkdGgpICYmIFV0aWwuaXNQb3dlck9mVHdvKGltZy5oZWlnaHQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGltZztcbiAgICAgICAgfVxuICAgICAgICAvLyBjcmVhdGUgYW4gZW1wdHkgY2FudmFzIGVsZW1lbnRcbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKGltZy53aWR0aCk7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byhpbWcuaGVpZ2h0KTtcbiAgICAgICAgLy8gY29weSB0aGUgaW1hZ2UgY29udGVudHMgdG8gdGhlIGNhbnZhc1xuICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBVdGlsO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIFhNTEh0dHBSZXF1ZXN0IEdFVCByZXF1ZXN0IHRvIHRoZSBzdXBwbGllZCB1cmwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5jcm9zc09yaWdpbiAtIEVuYWJsZSBjcm9zcy1vcmlnaW4gcmVxdWVzdC5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMucmVzcG9uc2VUeXBlIC0gVGhlIHJlc3BvbnNlVHlwZSBvZiB0aGUgWEhSLlxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgb3B0aW9ucy51cmwsIHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MocmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoYEdFVCAke3JlcXVlc3QucmVzcG9uc2VVUkx9ICR7cmVxdWVzdC5zdGF0dXN9ICgke3JlcXVlc3Quc3RhdHVzVGV4dH0pYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLmNyb3NzT3JpZ2luID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KCkpO1xuIl19
