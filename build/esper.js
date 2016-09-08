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
         * @param {bool} spec.preMultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
         */
        function ColorTexture2D() {
            var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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
            spec.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
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
            var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
            spec.preMultiplyAlpha = false; // no alpha to pre-multiply
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
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
                var byteOffset = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_BYTE_OFFSET : arguments[1];

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
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
            this.textures = {};
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
                this.textures['color' + index] = texture;
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
                this.textures.depth = texture;
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
                var textures = this.textures;
                Object.keys(textures).forEach(function (key) {
                    textures[key].resize(width, height);
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
                    throw 'VertexBuffers must all have the same count to be rendered without an IndexBuffer, mismatch of ' + count + ' and ' + buffer.count + ' found';
                } else {
                    console.log('count ' + count + ' === ' + buffer.count);
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
        var indices = {};
        vertexBuffers.forEach(function (buffer) {
            Object.keys(buffer.pointers).forEach(function (index) {
                indices[index] = indices[index] || 0;
                indices[index]++;
            });
        });
        Object.keys(indices).forEach(function (index) {
            if (indices[index] > 1) {
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
            var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
        var declarations = ShaderParser.parseDeclarations([vertSource, fragSource], ['uniform', 'attribute']);
        // for each declaration in the shader
        declarations.forEach(function (declaration) {
            // check if its an attribute or uniform
            if (declaration.qualifier === 'attribute') {
                // if attribute, store type and index
                var index = getAttributeIndex(shader.attributes, declaration);
                shader.attributes[declaration.name] = {
                    type: declaration.type,
                    index: index
                };
            } else {
                // if (declaration.qualifier === 'uniform') {
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
        var attributes = shader.attributes;
        Object.keys(attributes).forEach(function (key) {
            // bind the attribute location
            gl.bindAttribLocation(shader.program, attributes[key].index, key);
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
        Object.keys(uniforms).forEach(function (key) {
            // get the uniform location
            var location = gl.getUniformLocation(shader.program, key);
            // check if null, parse may detect uniform that is compiled out
            // due to a preprocessor evaluation.
            // TODO: fix parser so that it evaluates these correctly.
            if (location === null) {
                delete uniforms[key];
            } else {
                uniforms[key].location = location;
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

            var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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
            this.attributes = {};
            this.uniforms = {};
            // if attribute ordering is provided, use those indices
            if (spec.attributes) {
                spec.attributes.forEach(function (attr, index) {
                    _this.attributes[attr] = {
                        index: index
                    };
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
                var uniform = this.uniforms[name];
                // ensure that the uniform spec exists for the name
                if (!uniform) {
                    throw 'No uniform found under name `' + name + '`';
                }
                // check value
                if (value === undefined || value === null) {
                    // ensure that the uniform argument is defined
                    throw 'Value passed for uniform `' + name + '` is undefined or null';
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
            var sources = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
            var qualifiers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

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
         * @param {bool} spec.preMultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         */
        function Texture2D() {
            var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
            this.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
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
                var location = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

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
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.preMultiplyAlpha);
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
                    gl.texImage2D(gl.TEXTURE_2D, 0, // mip-map level,
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
         * @param {bool} spec.preMultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         */
        function TextureCubeMap() {
            var _this = this;

            var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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
            this.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
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
                var location = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

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
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.preMultiplyAlpha);
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
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {Number} The byte stride of the buffer.
     */
    function getStride(attributePointers) {
        // if there is only one attribute pointer assigned to this buffer,
        // there is no need for stride, set to default of 0
        var indices = Object.keys(attributePointers);
        if (indices.length === 1) {
            return 0;
        }
        var maxByteOffset = 0;
        var byteSizeSum = 0;
        var byteStride = 0;
        indices.forEach(function (index) {
            var pointer = attributePointers[index];
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
        var pointers = {};
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
            pointers[index] = {
                size: size,
                type: type,
                byteOffset: byteOffset !== undefined ? byteOffset : DEFAULT_BYTE_OFFSET
            };
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
            var attributePointers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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
                var byteOffset = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_BYTE_OFFSET : arguments[1];

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
                Object.keys(this.pointers).forEach(function (index) {
                    var pointer = _this.pointers[index];
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
                Object.keys(this.pointers).forEach(function (index) {
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
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
        // clear pointers
        vertexPackage.pointers = {};
        // for each attribute
        attributes.forEach(function (vertices) {
            // set size to number of components in the attribute
            var size = getComponentSize(vertices.data[0]);
            // length of the package will be the shortest attribute array length
            shortestArray = Math.min(shortestArray, vertices.data.length);
            // store pointer under index
            vertexPackage.pointers[vertices.index] = {
                type: COMPONENT_TYPE,
                size: size,
                byteOffset: offset * BYTES_PER_COMPONENT
            };
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
        var vertex = void 0,
            i = void 0,
            j = void 0;
        for (i = 0; i < length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + stride * i;
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
        var vertex = void 0,
            i = void 0,
            j = void 0;
        for (i = 0; i < length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + stride * i;
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
        var vertex = void 0,
            i = void 0,
            j = void 0;
        for (i = 0; i < length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + stride * i;
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
        var vertex = void 0,
            i = void 0,
            j = void 0;
        for (i = 0; i < length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + stride * i;
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

            if (attributes !== undefined) {
                this.set(attributes);
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
                    var pointer = pointers[vertices.index];
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
            var spec = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
                var width = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
                var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

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
                var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
                var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
                var width = arguments.length <= 2 || arguments[2] === undefined ? this.width : arguments[2];
                var height = arguments.length <= 3 || arguments[3] === undefined ? this.height : arguments[3];

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

    var _boundContext = null;
    var _contexts = {};

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
                return _contexts[getId(canvas)];
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
            contextWrapper.extensions[id] = gl.getExtension(id);
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
            extensions: {}
        };
        // load WebGL extensions
        loadExtensions(contextWrapper);
        // add context wrapper to map
        _contexts[getId(canvas)] = contextWrapper;
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
                delete _contexts[wrapper.id];
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
                    Object.keys(extensions).forEach(function (key) {
                        if (extensions[key]) {
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
                    Object.keys(extensions).forEach(function (key) {
                        if (!extensions[key]) {
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
                return extensions[extension] ? true : false;
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
                return extensions[extension] || null;
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
         * @param {Function} options.success - The success callback function.
         * @param {Function} options.error - The error callback function.
         */
        load: function load() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
        var i = void 0;
        if (num !== 0) {
            num = num - 1;
        }
        for (i = 1; i < 32; i <<= 1) {
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
            request.send();
        }
    };
})();

},{}]},{},[14])(14)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db2xvclRleHR1cmUyRC5qcyIsInNyYy9jb3JlL0RlcHRoVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvSW5kZXhCdWZmZXIuanMiLCJzcmMvY29yZS9SZW5kZXJUYXJnZXQuanMiLCJzcmMvY29yZS9SZW5kZXJhYmxlLmpzIiwic3JjL2NvcmUvU2hhZGVyLmpzIiwic3JjL2NvcmUvU2hhZGVyUGFyc2VyLmpzIiwic3JjL2NvcmUvVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvVGV4dHVyZUN1YmVNYXAuanMiLCJzcmMvY29yZS9WZXJ0ZXhCdWZmZXIuanMiLCJzcmMvY29yZS9WZXJ0ZXhQYWNrYWdlLmpzIiwic3JjL2NvcmUvVmlld3BvcnQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHQuanMiLCJzcmMvZXhwb3J0cy5qcyIsInNyYy91dGlsL0FzeW5jLmpzIiwic3JjL3V0aWwvSW1hZ2VMb2FkZXIuanMiLCJzcmMvdXRpbC9VdGlsLmpzIiwic3JjL3V0aWwvWEhSTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQyxhQUFZOztBQUVUOztBQUVBLFFBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7QUFDQSxRQUFJLGNBQWMsUUFBUSxxQkFBUixDQUFsQjtBQUNBLFFBQUksT0FBTyxRQUFRLGNBQVIsQ0FBWDs7QUFFQSxRQUFJLGNBQWM7QUFDZCxpQkFBUyxJQURLO0FBRWQsZ0JBQVE7QUFGTSxLQUFsQjtBQUlBLFFBQUksY0FBYztBQUNkLGlCQUFTLElBREs7QUFFZCxnQkFBUSxJQUZNO0FBR2QsZ0NBQXdCLElBSFY7QUFJZCwrQkFBdUIsSUFKVDtBQUtkLCtCQUF1QixJQUxUO0FBTWQsOEJBQXNCO0FBTlIsS0FBbEI7QUFRQSxRQUFJLGFBQWE7QUFDYixnQkFBUSxJQURLO0FBRWIseUJBQWlCLElBRko7QUFHYix1QkFBZTtBQUhGLEtB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ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBUZXh0dXJlMkQgPSByZXF1aXJlKCcuL1RleHR1cmUyRCcpO1xuICAgIGxldCBJbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvSW1hZ2VMb2FkZXInKTtcbiAgICBsZXQgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG4gICAgbGV0IE1BR19GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBNSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlLFxuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBXUkFQX01PREVTID0ge1xuICAgICAgICBSRVBFQVQ6IHRydWUsXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZVxuICAgIH07XG4gICAgbGV0IFRZUEVTID0ge1xuICAgICAgICBVTlNJR05FRF9CWVRFOiB0cnVlLFxuICAgICAgICBGTE9BVDogdHJ1ZVxuICAgIH07XG4gICAgbGV0IEZPUk1BVFMgPSB7XG4gICAgICAgIFJHQjogdHJ1ZSxcbiAgICAgICAgUkdCQTogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCB0eXBlIGZvciBjb2xvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0JZVEUnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciBjb2xvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIGNvbG9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1dSQVAgPSAnUkVQRUFUJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIGNvbG9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfTUlQTUFQID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGludmVydC15IGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfSU5WRVJUX1kgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIENvbG9yVGV4dHVyZTJEXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgMkQgY29sb3IgdGV4dHVyZS5cbiAgICAgKiBAYXVnbWVudHMgVGV4dHVyZTJEXG4gICAgICovXG4gICAgY2xhc3MgQ29sb3JUZXh0dXJlMkQgZXh0ZW5kcyBUZXh0dXJlMkQge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBDb2xvclRleHR1cmUyRCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNwZWNpZmljYXRpb24gYXJndW1lbnRzLlxuICAgICAgICAgKiBAcGFyYW0ge0ltYWdlRGF0YXxIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fEhUTUxWaWRlb0VsZW1lbnR9IHNwZWMuaW1hZ2UgLSBUaGUgSFRNTEltYWdlRWxlbWVudCB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnVybCAtIFRoZSBIVE1MSW1hZ2VFbGVtZW50IFVSTCB0byBsb2FkIGFuZCBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7VWludDhBcnJheXxGbG9hdDMyQXJyYXl9IHNwZWMuc3JjIC0gVGhlIGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5taXBNYXAgLSBXaGV0aGVyIG9yIG5vdCBtaXAtbWFwcGluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMuaW52ZXJ0WSAtIFdoZXRoZXIgb3Igbm90IGludmVydC15IGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVNdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIGlmIHRoZSBkYXRhIGlzIGxvYWRlZCBhc3luY2hyb25vdXNseSB2aWEgYSBVUkwuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30sIGNhbGxiYWNrID0gbnVsbCkge1xuICAgICAgICAgICAgLy8gZ2V0IHNwZWNpZmljIHBhcmFtc1xuICAgICAgICAgICAgc3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPSBXUkFQX01PREVTW3NwZWMud3JhcFNdID8gc3BlYy53cmFwUyA6IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPSBXUkFQX01PREVTW3NwZWMud3JhcFRdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHNwZWMubWluRmlsdGVyID0gTUlOX0ZJTFRFUlNbc3BlYy5taW5GaWx0ZXJdID8gc3BlYy5taW5GaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIHNwZWMubWFnRmlsdGVyID0gTUFHX0ZJTFRFUlNbc3BlYy5tYWdGaWx0ZXJdID8gc3BlYy5tYWdGaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIC8vIHNldCBvdGhlciBwcm9wZXJ0aWVzXG4gICAgICAgICAgICBzcGVjLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IERFRkFVTFRfTUlQTUFQO1xuICAgICAgICAgICAgc3BlYy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBERUZBVUxUX0lOVkVSVF9ZO1xuICAgICAgICAgICAgc3BlYy5wcmVNdWx0aXBseUFscGhhID0gc3BlYy5wcmVNdWx0aXBseUFscGhhICE9PSB1bmRlZmluZWQgPyBzcGVjLnByZU11bHRpcGx5QWxwaGEgOiBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBO1xuICAgICAgICAgICAgLy8gc2V0IGZvcm1hdFxuICAgICAgICAgICAgc3BlYy5mb3JtYXQgPSBGT1JNQVRTW3NwZWMuZm9ybWF0XSA/IHNwZWMuZm9ybWF0IDogREVGQVVMVF9GT1JNQVQ7XG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmUgYmFzZWQgb24gYXJndW1lbnQgdHlwZVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGVjLnNyYyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyByZXF1ZXN0IHNvdXJjZSBmcm9tIHVybFxuICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcbiAgICAgICAgICAgICAgICAvLyBjYWxsIGJhc2UgY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICBzdXBlcihzcGVjKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBwdXQgZXh0ZW5zaW9uIGhhbmRsaW5nIGZvciBhcnJheWJ1ZmZlciAvIGltYWdlIC8gdmlkZW8gZGlmZmVyZW50aWF0aW9uXG4gICAgICAgICAgICAgICAgSW1hZ2VMb2FkZXIubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogc3BlYy5zcmMsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldCB0byB1bnNpZ25lZCBieXRlIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlID0gVXRpbC5yZXNpemVDYW52YXMoc3BlYywgaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm93IGJ1ZmZlclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKGltYWdlLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBleGVjdXRlIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWwuaXNDYW52YXNUeXBlKHNwZWMuc3JjKSkge1xuICAgICAgICAgICAgICAgIC8vIGlzIGltYWdlIC8gY2FudmFzIC8gdmlkZW8gdHlwZVxuICAgICAgICAgICAgICAgIC8vIHNldCB0byB1bnNpZ25lZCBieXRlIHR5cGVcbiAgICAgICAgICAgICAgICBzcGVjLnR5cGUgPSAnVU5TSUdORURfQllURSc7XG4gICAgICAgICAgICAgICAgc3BlYy5zcmMgPSBVdGlsLnJlc2l6ZUNhbnZhcyhzcGVjLCBzcGVjLnNyYyk7XG4gICAgICAgICAgICAgICAgLy8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgc3VwZXIoc3BlYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFycmF5LCBhcnJheWJ1ZmZlciwgb3IgbnVsbFxuICAgICAgICAgICAgICAgIGlmIChzcGVjLnNyYyA9PT0gdW5kZWZpbmVkIHx8IHNwZWMuc3JjID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQsIGFzc3VtZSB0aGlzIHRleHR1cmUgd2lsbCBiZSByZW5kZXJlZFxuICAgICAgICAgICAgICAgICAgICAvLyB0by4gSW4gdGhpcyBjYXNlIGRpc2FibGUgbWlwbWFwcGluZywgdGhlcmUgaXMgbm8gbmVlZCBhbmQgaXRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBvbmx5IGludHJvZHVjZSB2ZXJ5IHBlY3VsaWFyIGFuZCBkaWZmaWN1bHQgdG8gZGlzY2VyblxuICAgICAgICAgICAgICAgICAgICAvLyByZW5kZXJpbmcgcGhlbm9tZW5hIGluIHdoaWNoIHRoZSB0ZXh0dXJlICd0cmFuc2Zvcm1zJyBhdFxuICAgICAgICAgICAgICAgICAgICAvLyBjZXJ0YWluIGFuZ2xlcyAvIGRpc3RhbmNlcyB0byB0aGUgbWlwbWFwcGVkIChlbXB0eSkgcG9ydGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHNwZWMubWlwTWFwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciBmcm9tIGFyZ1xuICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9IFRZUEVTW3NwZWMudHlwZV0gPyBzcGVjLnR5cGUgOiBERUZBVUxUX1RZUEU7XG4gICAgICAgICAgICAgICAgLy8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgc3VwZXIoc3BlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENvbG9yVGV4dHVyZTJEO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBUZXh0dXJlMkQgPSByZXF1aXJlKCcuL1RleHR1cmUyRCcpO1xuXG4gICAgbGV0IE1BR19GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBNSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgV1JBUF9NT0RFUyA9IHtcbiAgICAgICAgUkVQRUFUOiB0cnVlLFxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlLFxuICAgICAgICBNSVJST1JFRF9SRVBFQVQ6IHRydWVcbiAgICB9O1xuICAgIGxldCBERVBUSF9UWVBFUyA9IHtcbiAgICAgICAgVU5TSUdORURfQllURTogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IHRydWUsXG4gICAgICAgIFVOU0lHTkVEX0lOVDogdHJ1ZVxuICAgIH07XG4gICAgbGV0IEZPUk1BVFMgPSB7XG4gICAgICAgIERFUFRIX0NPTVBPTkVOVDogdHJ1ZSxcbiAgICAgICAgREVQVEhfU1RFTkNJTDogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCB0eXBlIGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0lOVCc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIGRlcHRoIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0ZPUk1BVCA9ICdERVBUSF9DT01QT05FTlQnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgd3JhcCBtb2RlIGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9XUkFQID0gJ0NMQU1QX1RPX0VER0UnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgbWluIC8gbWFnIGZpbHRlciBmb3IgZGVwdGggdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgRGVwdGhUZXh0dXJlMkRcbiAgICAgKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCBkZXB0aCB0ZXh0dXJlLlxuICAgICAqIEBhdWdtZW50cyBUZXh0dXJlMkRcbiAgICAgKi9cbiAgICBjbGFzcyBEZXB0aFRleHR1cmUyRCBleHRlbmRzIFRleHR1cmUyRCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIERlcHRoVGV4dHVyZTJEIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXG4gICAgICAgICAqIEBwYXJhbSB7VWludDhBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheX0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcbiAgICAgICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgLy8gc2V0IHRleHR1cmUgcGFyYW1zXG4gICAgICAgICAgICBzcGVjLndyYXBTID0gV1JBUF9NT0RFU1tzcGVjLndyYXBTXSA/IHNwZWMud3JhcFMgOiBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICBzcGVjLndyYXBUID0gV1JBUF9NT0RFU1tzcGVjLndyYXBUXSA/IHNwZWMud3JhcFQgOiBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICBzcGVjLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTW3NwZWMubWluRmlsdGVyXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IE1BR19GSUxURVJTW3NwZWMubWFnRmlsdGVyXSA/IHNwZWMubWFnRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICAvLyBzZXQgbWlwLW1hcHBpbmcgYW5kIGZvcm1hdFxuICAgICAgICAgICAgc3BlYy5taXBNYXAgPSBmYWxzZTsgLy8gZGlzYWJsZSBtaXAtbWFwcGluZ1xuICAgICAgICAgICAgc3BlYy5pbnZlcnRZID0gZmFsc2U7IC8vIG5vIG5lZWQgdG8gaW52ZXJ0LXlcbiAgICAgICAgICAgIHNwZWMucHJlTXVsdGlwbHlBbHBoYSA9IGZhbHNlOyAvLyBubyBhbHBoYSB0byBwcmUtbXVsdGlwbHlcbiAgICAgICAgICAgIHNwZWMuZm9ybWF0ID0gRk9STUFUU1tzcGVjLmZvcm1hdF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgc3RlbmNpbC1kZXB0aCwgb3IganVzdCBkZXB0aFxuICAgICAgICAgICAgaWYgKHNwZWMuZm9ybWF0ID09PSAnREVQVEhfU1RFTkNJTCcpIHtcbiAgICAgICAgICAgICAgICBzcGVjLnR5cGUgPSAnVU5TSUdORURfSU5UXzI0XzhfV0VCR0wnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzcGVjLnR5cGUgPSBERVBUSF9UWVBFU1tzcGVjLnR5cGVdID8gc3BlYy50eXBlIDogREVGQVVMVF9UWVBFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICBzdXBlcihzcGVjKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gRGVwdGhUZXh0dXJlMkQ7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG5cbiAgICBsZXQgVFlQRVMgPSB7XG4gICAgICAgIFVOU0lHTkVEX0JZVEU6IHRydWUsXG4gICAgICAgIFVOU0lHTkVEX1NIT1JUOiB0cnVlLFxuICAgICAgICBVTlNJR05FRF9JTlQ6IHRydWVcbiAgICB9O1xuICAgIGxldCBNT0RFUyA9IHtcbiAgICAgICAgUE9JTlRTOiB0cnVlLFxuICAgICAgICBMSU5FUzogdHJ1ZSxcbiAgICAgICAgTElORV9TVFJJUDogdHJ1ZSxcbiAgICAgICAgTElORV9MT09QOiB0cnVlLFxuICAgICAgICBUUklBTkdMRVM6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX1NUUklQOiB0cnVlLFxuICAgICAgICBUUklBTkdMRV9GQU46IHRydWVcbiAgICB9O1xuICAgIGxldCBCWVRFU19QRVJfVFlQRSA9IHtcbiAgICAgICAgVU5TSUdORURfQllURTogMSxcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IDIsXG4gICAgICAgIFVOU0lHTkVEX0lOVDogNFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBjb21wb25lbnQgdHlwZS5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX1NIT1JUJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHJlbmRlciBtb2RlIChwcmltaXRpdmUgdHlwZSkuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfTU9ERSA9ICdUUklBTkdMRVMnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgYnl0ZSBvZmZzZXQgdG8gcmVuZGVyIGZyb20uXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfQllURV9PRkZTRVQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgY291bnQgb2YgaW5kaWNlcyB0byByZW5kZXIuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfQ09VTlQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIEluZGV4QnVmZmVyXG4gICAgICogQGNsYXNzZGVzYyBBbiBpbmRleCBidWZmZXIgY2xhc3MgdG8gaG9sZSBpbmRleGluZyBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBjbGFzcyBJbmRleEJ1ZmZlciB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhbiBJbmRleEJ1ZmZlciBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7V2ViR0xCdWZmZXJ8VWludDhBcnJheXxVaW50MTZBcnJheXxVaW4zMkFycmF5fEFycmF5fE51bWJlcn0gYXJnIC0gVGhlIGluZGV4IGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSByZW5kZXJpbmcgb3B0aW9ucy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlIG9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoYXJnLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBUWVBFU1tvcHRpb25zLnR5cGVdID8gb3B0aW9ucy50eXBlIDogREVGQVVMVF9UWVBFO1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gTU9ERVNbb3B0aW9ucy5tb2RlXSA/IG9wdGlvbnMubW9kZSA6IERFRkFVTFRfTU9ERTtcbiAgICAgICAgICAgIHRoaXMuY291bnQgPSAob3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY291bnQgOiBERUZBVUxUX0NPVU5UO1xuICAgICAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gKG9wdGlvbnMuYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuYnl0ZU9mZnNldCA6IERFRkFVTFRfQllURV9PRkZTRVQ7XG4gICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSAwO1xuICAgICAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZWJHTEJ1ZmZlciBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5ieXRlTGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIFdlYkdMQnVmZmVyYCBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy5ieXRlTGVuZ3RoYCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gb3B0aW9ucy5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IGFyZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKE51bWJlci5pc0ludGVnZXIoYXJnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBieXRlIGxlbmd0aCBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBudW1iZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFycmF5QnVmZmVyIGFyZ1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBBcnJheUJ1ZmZlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMudHlwZWAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFycmF5IG9yIEFycmF5QnVmZmVyVmlldyBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoYXJnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnRW1wdHkgYnVmZmVyIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLnR5cGVgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBsb2FkIGluZGV4IGRhdGEgdG8gdGhlIEdQVS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0luZGV4QnVmZmVyfSBUaGUgaW5kZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYnVmZmVyRGF0YShhcmcpIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBjYXN0IGFycmF5IHRvIEFycmF5QnVmZmVyVmlldyBiYXNlZCBvbiBwcm92aWRlZCB0eXBlXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHR5cGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDMyXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IG5ldyBVaW50MzJBcnJheShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0byB1aW50MTZcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gbmV3IFVpbnQxNkFycmF5KGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRvIHVpbnQ4XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IG5ldyBVaW50OEFycmF5KGFyZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuICAgICAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9TSE9SVCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhKGFyZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuICAgICAgICAgICAgICAgICAgICAhKE51bWJlci5pc0ludGVnZXIoYXJnKSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgYEFycmF5QnVmZmVyVmlld2AsIG9yIGBudW1iZXJgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB0eXBlIGlzIHN1cHBvcnRlZCBieSBleHRlbnNpb25cbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnICYmXG4gICAgICAgICAgICAgICAgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbignT0VTX2VsZW1lbnRfaW5kZXhfdWludCcpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgSW5kZXhCdWZmZXIgb2YgdHlwZSBgVU5TSUdORURfSU5UYCBhcyBleHRlbnNpb24gYE9FU19lbGVtZW50X2luZGV4X3VpbnRgIGlzIG5vdCBzdXBwb3J0ZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9uJ3Qgb3ZlcndyaXRlIHRoZSBjb3VudCBpZiBpdCBpcyBhbHJlYWR5IHNldFxuICAgICAgICAgICAgaWYgKHRoaXMuY291bnQgPT09IERFRkFVTFRfQ09VTlQpIHtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihhcmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnQgPSAoYXJnIC8gQllURVNfUEVSX1RZUEVbdGhpcy50eXBlXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IGFyZy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGJ5dGUgbGVuZ3RoXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihhcmcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBhcmcuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBidWZmZXIgaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5XG4gICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYXJnLCBnbC5TVEFUSUNfRFJBVyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgcGFydGlhbCBpbmRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlclN1YkRhdGEoYXJyYXksIGJ5dGVPZmZzZXQgPSBERUZBVUxUX0JZVEVfT0ZGU0VUKSB7XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIHRocm93ICdCdWZmZXIgaGFzIG5vdCB5ZXQgYmVlbiBhbGxvY2F0ZWQsIGFsbG9jYXRlIHdpdGggYGJ1ZmZlckRhdGFgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgdG8gQXJyYXlCdWZmZXJWaWV3IGJhc2VkIG9uIHByb3ZpZGVkIHR5cGVcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciB0eXBlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRvIHVpbnQzMlxuICAgICAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50MzJBcnJheShhcnJheSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9TSE9SVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRvIHVpbnQxNlxuICAgICAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50MTZBcnJheShhcnJheSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRvIHVpbnQ4XG4gICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgIShhcnJheSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpICYmXG4gICAgICAgICAgICAgICAgIShhcnJheSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSAmJlxuICAgICAgICAgICAgICAgICEoYXJyYXkgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkgJiZcbiAgICAgICAgICAgICAgICAhKGFycmF5IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBvciBgQXJyYXlCdWZmZXJWaWV3YCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IHdlIGFyZW4ndCBvdmVyZmxvd2luZyB0aGUgYnVmZmVyXG4gICAgICAgICAgICBpZiAoYnl0ZU9mZnNldCArIGFycmF5LmJ5dGVMZW5ndGggPiB0aGlzLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgQXJndW1lbnQgb2YgbGVuZ3RoICR7YXJyYXkuYnl0ZUxlbmd0aH0gYnl0ZXMgd2l0aCBgICtcbiAgICAgICAgICAgICAgICAgICAgYG9mZnNldCBvZiAke2J5dGVPZmZzZXR9IGJ5dGVzIG92ZXJmbG93cyB0aGUgYnVmZmVyIGAgK1xuICAgICAgICAgICAgICAgICAgICBgbGVuZ3RoIG9mICR7dGhpcy5ieXRlTGVuZ3RofSBieXRlc2A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBieXRlT2Zmc2V0LCBhcnJheSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSBib3VuZCBidWZmZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gcGFzcyB0byAnZHJhd0VsZW1lbnRzJy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm1vZGUgLSBUaGUgZHJhdyBtb2RlIC8gcHJpbWl0aXZlIHR5cGUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmJ5dGVPZmZzZXQgLSBUaGUgYnl0ZU9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGRyYXcob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgbGV0IG1vZGUgPSBnbFtvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlXTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gZ2xbdGhpcy50eXBlXTtcbiAgICAgICAgICAgIGxldCBieXRlT2Zmc2V0ID0gKG9wdGlvbnMuYnl0ZU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuYnl0ZU9mZnNldCA6IHRoaXMuYnl0ZU9mZnNldDtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IHRoaXMuY291bnQ7XG4gICAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0ZW1wdGluZyB0byBkcmF3IHdpdGggYSBjb3VudCBvZiAwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJpbmQgYnVmZmVyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgICAgICAvLyBkcmF3IGVsZW1lbnRzXG4gICAgICAgICAgICBnbC5kcmF3RWxlbWVudHMobW9kZSwgY291bnQsIHR5cGUsIGJ5dGVPZmZzZXQpO1xuICAgICAgICAgICAgLy8gbm8gbmVlZCB0byB1bmJpbmRcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbmRleEJ1ZmZlcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcblxuICAgIGxldCBURVhUVVJFX1RBUkdFVFMgPSB7XG4gICAgICAgIFRFWFRVUkVfMkQ6IHRydWUsXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVA6IHRydWVcbiAgICB9O1xuXG4gICAgbGV0IERFUFRIX0ZPUk1BVFMgPSB7XG4gICAgICAgIERFUFRIX0NPTVBPTkVOVDogdHJ1ZSxcbiAgICAgICAgREVQVEhfU1RFTkNJTDogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUmVuZGVyVGFyZ2V0XG4gICAgICogQGNsYXNzZGVzYyBBIHJlbmRlclRhcmdldCBjbGFzcyB0byBhbGxvdyByZW5kZXJpbmcgdG8gdGV4dHVyZXMuXG4gICAgICovXG4gICAgY2xhc3MgUmVuZGVyVGFyZ2V0IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zdGFudGlhdGVzIGEgUmVuZGVyVGFyZ2V0IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lYnVmZmVyID0gdGhpcy5nbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuICAgICAgICAgICAgdGhpcy50ZXh0dXJlcyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBiaW5kKCkge1xuICAgICAgICAgICAgLy8gYmluZCBmcmFtZWJ1ZmZlclxuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgdGhpcy5mcmFtZWJ1ZmZlcik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVbmJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICAvLyB1bmJpbmQgZnJhbWVidWZmZXJcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBUaGUgYXR0YWNobWVudCBpbmRleC4gKG9wdGlvbmFsKVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0IHR5cGUuIChvcHRpb25hbClcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0Q29sb3JUYXJnZXQodGV4dHVyZSwgaW5kZXgsIHRhcmdldCkge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGlmICghdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIGFyZ3VtZW50IGlzIG1pc3NpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFRFWFRVUkVfVEFSR0VUU1tpbmRleF0gJiYgdGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIGNvbG9yIGF0dGFjaG1lbnQgaW5kZXggaXMgaW52YWxpZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFyZ2V0ICYmICFURVhUVVJFX1RBUkdFVFNbdGFyZ2V0XSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHRhcmdldCBpcyBpbnZhbGlkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbJ2NvbG9yJyArIGluZGV4XSA9IHRleHR1cmU7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxuICAgICAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxuICAgICAgICAgICAgICAgIGdsWydDT0xPUl9BVFRBQ0hNRU5UJyArIGluZGV4XSxcbiAgICAgICAgICAgICAgICBnbFt0YXJnZXQgfHwgJ1RFWFRVUkVfMkQnXSxcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLnRleHR1cmUsXG4gICAgICAgICAgICAgICAgMCk7XG4gICAgICAgICAgICB0aGlzLnVuYmluZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXREZXB0aFRhcmdldCh0ZXh0dXJlKSB7XG4gICAgICAgICAgICBpZiAoIXRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSBhcmd1bWVudCBpcyBtaXNzaW5nJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghREVQVEhfRk9STUFUU1t0ZXh0dXJlLmZvcm1hdF0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgdGV4dHVyZSBpcyBub3Qgb2YgZm9ybWF0IGBERVBUSF9DT01QT05FTlRgIG9yIGBERVBUSF9TVEVOQ0lMYCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgdGhpcy50ZXh0dXJlcy5kZXB0aCA9IHRleHR1cmU7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxuICAgICAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxuICAgICAgICAgICAgICAgIGdsLkRFUFRIX0FUVEFDSE1FTlQsXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLnRleHR1cmUsXG4gICAgICAgICAgICAgICAgMCk7XG4gICAgICAgICAgICB0aGlzLnVuYmluZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzaXplcyB0aGUgcmVuZGVyVGFyZ2V0IGFuZCBhbGwgYXR0YWNoZWQgdGV4dHVyZXMgYnkgdGhlIHByb3ZpZGVkIGhlaWdodCBhbmQgd2lkdGguXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSBuZXcgd2lkdGggb2YgdGhlIHJlbmRlclRhcmdldC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSByZW5kZXJUYXJnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAod2lkdGggPD0gMCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgd2lkdGhcXGAgb2YgJHt3aWR0aH0gaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgKGhlaWdodCA8PSAwKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGBoZWlnaHRcXGAgb2YgJHtoZWlnaHR9IGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRleHR1cmVzID0gdGhpcy50ZXh0dXJlcztcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRleHR1cmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dHVyZXNba2V5XS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJUYXJnZXQ7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFZlcnRleFBhY2thZ2UgPSByZXF1aXJlKCcuLi9jb3JlL1ZlcnRleFBhY2thZ2UnKTtcbiAgICBsZXQgVmVydGV4QnVmZmVyID0gcmVxdWlyZSgnLi4vY29yZS9WZXJ0ZXhCdWZmZXInKTtcbiAgICBsZXQgSW5kZXhCdWZmZXIgPSByZXF1aXJlKCcuLi9jb3JlL0luZGV4QnVmZmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCB2ZXJ0ZXggYnVmZmVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgY291bnRzXG4gICAgICogYXJlIG5vdCBlcXVhbC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGV4QnVmZmVycyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXhCdWZmZXJzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoZWNrVmVydGV4QnVmZmVyQ291bnRzKHZlcnRleEJ1ZmZlcnMpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gbnVsbDtcbiAgICAgICAgdmVydGV4QnVmZmVycy5mb3JFYWNoKGJ1ZmZlciA9PiB7XG4gICAgICAgICAgICBpZiAoY291bnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb3VudCA9IGJ1ZmZlci5jb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ICE9PSBidWZmZXIuY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFZlcnRleEJ1ZmZlcnMgbXVzdCBhbGwgaGF2ZSB0aGUgc2FtZSBjb3VudCB0byBiZSByZW5kZXJlZCB3aXRob3V0IGFuIEluZGV4QnVmZmVyLCBtaXNtYXRjaCBvZiAke2NvdW50fSBhbmQgJHtidWZmZXIuY291bnR9IGZvdW5kYDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY291bnQgJyArIGNvdW50ICsgJyA9PT0gJyArIGJ1ZmZlci5jb3VudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCBhdHRyaWJ1dGUgcG9pbnRlcnMgYW5kIHRocm93cyBhbiBleGNlcHRpb24gaWYgYW4gaW5kZXhcbiAgICAgKiBvY2N1cnMgbW9yZSB0aGFuIG9uY2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRleEJ1ZmZlcnMgLSBUaGUgYXJyYXkgb2YgdmVydGV4QnVmZmVycy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGVja0luZGV4Q29sbGlzaW9ucyh2ZXJ0ZXhCdWZmZXJzKSB7XG4gICAgICAgIGxldCBpbmRpY2VzID0ge307XG4gICAgICAgIHZlcnRleEJ1ZmZlcnMuZm9yRWFjaChidWZmZXIgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYnVmZmVyLnBvaW50ZXJzKS5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2luZGV4XSA9IGluZGljZXNbaW5kZXhdIHx8IDA7XG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpbmRleF0rKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmtleXMoaW5kaWNlcykuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICAgICAgICBpZiAoaW5kaWNlc1tpbmRleF0gPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYE1vcmUgdGhhbiBvbmUgYXR0cmlidXRlIHBvaW50ZXIgZXhpc3RzIGZvciBpbmRleCBcXGAke2luZGV4fVxcYGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBSZW5kZXJhYmxlXG4gICAgICogQGNsYXNzZGVzYyBBIGNvbnRhaW5lciBmb3Igb25lIG9yIG1vcmUgVmVydGV4QnVmZmVycyBhbmQgYW4gb3B0aW9uYWwgSW5kZXhCdWZmZXIuXG4gICAgICovXG4gICAgY2xhc3MgUmVuZGVyYWJsZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhbiBSZW5kZXJhYmxlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgcmVuZGVyYWJsZSBzcGVjaWZpY2F0aW9uIG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl9IHNwZWMudmVydGljZXMgLSBUaGUgdmVydGljZXMgdG8gaW50ZXJsZWF2ZSBhbmQgYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1ZlcnRleEJ1ZmZlcn0gc3BlYy52ZXJ0ZXhCdWZmZXIgLSBBbiBleGlzdGluZyB2ZXJ0ZXggYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1ZlcnRleEJ1ZmZlcltdfSBzcGVjLnZlcnRleEJ1ZmZlcnMgLSBNdWx0aXBsZSBleGlzdGluZyB2ZXJ0ZXggYnVmZmVycy5cbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheX0gc3BlYy5pbmRpY2VzIC0gVGhlIGluZGljZXMgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge0luZGV4QnVmZmVyfSBzcGVjLmluZGV4YnVmZmVyIC0gQW4gZXhpc3RpbmcgaW5kZXggYnVmZmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Ioc3BlYyA9IHt9KSB7XG4gICAgICAgICAgICBpZiAoc3BlYy52ZXJ0ZXhCdWZmZXIgfHwgc3BlYy52ZXJ0ZXhCdWZmZXJzKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIGV4aXN0aW5nIHZlcnRleCBidWZmZXJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBzcGVjLnZlcnRleEJ1ZmZlcnMgfHwgW3NwZWMudmVydGV4QnVmZmVyXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlYy52ZXJ0aWNlcykge1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB2ZXJ0ZXggcGFja2FnZVxuICAgICAgICAgICAgICAgIGxldCB2ZXJ0ZXhQYWNrYWdlID0gbmV3IFZlcnRleFBhY2thZ2Uoc3BlYy52ZXJ0aWNlcyk7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBidWZmZXJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBbbmV3IFZlcnRleEJ1ZmZlcih2ZXJ0ZXhQYWNrYWdlKV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNwZWMuaW5kZXhCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgaW5kZXggYnVmZmVyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IHNwZWMuaW5kZXhCdWZmZXI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWMuaW5kaWNlcykge1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBpbmRleCBidWZmZXJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbmV3IEluZGV4QnVmZmVyKHNwZWMuaW5kaWNlcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gaW5kZXggYnVmZmVyLCBjaGVjayB0aGF0IHZlcnRleCBidWZmZXJzIGFsbCBoYXZlXG4gICAgICAgICAgICAvLyB0aGUgc2FtZSBjb3VudFxuICAgICAgICAgICAgaWYgKCF0aGlzLmluZGV4QnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tWZXJ0ZXhCdWZmZXJDb3VudHModGhpcy52ZXJ0ZXhCdWZmZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgbm8gYXR0cmlidXRlIGluZGljZXMgY2xhc2hcbiAgICAgICAgICAgIGNoZWNrSW5kZXhDb2xsaXNpb25zKHRoaXMudmVydGV4QnVmZmVycyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSB0aGUgZHJhdyBjb21tYW5kIGZvciB0aGUgdW5kZXJseWluZyBidWZmZXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIHBhc3MgdG8gJ2RyYXdFbGVtZW50cycuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5ieXRlT2Zmc2V0IC0gVGhlIGJ5dGVPZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pbmRleE9mZnNldCAtIFRoZSBpbmRleE9mZnNldCBpbnRvIHRoZSBkcmF3biBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNvdW50IC0gVGhlIG51bWJlciBvZiB2ZXJ0aWNlcyB0byBkcmF3LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtSZW5kZXJhYmxlfSAtIFRoZSByZW5kZXJhYmxlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgZHJhdyhvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIC8vIGRyYXcgdGhlIHJlbmRlcmFibGVcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4QnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIGluZGV4IGJ1ZmZlciB0byBkcmF3IGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgLy8gYmluZCB2ZXJ0ZXggYnVmZmVycyBhbmQgZW5hYmxlIGF0dHJpYnV0ZSBwb2ludGVyc1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5mb3JFYWNoKHZlcnRleEJ1ZmZlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5iaW5kKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gZHJhdyBwcmltaXRpdmVzIHVzaW5nIGluZGV4IGJ1ZmZlclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuZHJhdyhvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAvLyBkaXNhYmxlIGF0dHJpYnV0ZSBwb2ludGVyc1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5mb3JFYWNoKHZlcnRleEJ1ZmZlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci51bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBubyBhZHZhbnRhZ2UgdG8gdW5iaW5kaW5nIGFzIHRoZXJlIGlzIG5vIHN0YWNrIHVzZWRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbm8gaW5kZXggYnVmZmVyLCB1c2UgZHJhdyBhcnJheXNcbiAgICAgICAgICAgICAgICAvLyBzZXQgYWxsIGF0dHJpYnV0ZSBwb2ludGVyc1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5mb3JFYWNoKHZlcnRleEJ1ZmZlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5iaW5kKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4QnVmZmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgdGhlIGJ1ZmZlclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbMF0uZHJhdyhvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZGlzYWJsZSBhbGwgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzLmZvckVhY2godmVydGV4QnVmZmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLnVuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmFibGU7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG4gICAgbGV0IFNoYWRlclBhcnNlciA9IHJlcXVpcmUoJy4vU2hhZGVyUGFyc2VyJyk7XG4gICAgbGV0IEFzeW5jID0gcmVxdWlyZSgnLi4vdXRpbC9Bc3luYycpO1xuICAgIGxldCBYSFJMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL1hIUkxvYWRlcicpO1xuXG4gICAgbGV0IFVOSUZPUk1fRlVOQ1RJT05TID0ge1xuICAgICAgICAnYm9vbCc6ICd1bmlmb3JtMWknLFxuICAgICAgICAnYm9vbFtdJzogJ3VuaWZvcm0xaXYnLFxuICAgICAgICAnZmxvYXQnOiAndW5pZm9ybTFmJyxcbiAgICAgICAgJ2Zsb2F0W10nOiAndW5pZm9ybTFmdicsXG4gICAgICAgICdpbnQnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ2ludFtdJzogJ3VuaWZvcm0xaXYnLFxuICAgICAgICAndWludCc6ICd1bmlmb3JtMWknLFxuICAgICAgICAndWludFtdJzogJ3VuaWZvcm0xaXYnLFxuICAgICAgICAndmVjMic6ICd1bmlmb3JtMmZ2JyxcbiAgICAgICAgJ3ZlYzJbXSc6ICd1bmlmb3JtMmZ2JyxcbiAgICAgICAgJ2l2ZWMyJzogJ3VuaWZvcm0yaXYnLFxuICAgICAgICAnaXZlYzJbXSc6ICd1bmlmb3JtMml2JyxcbiAgICAgICAgJ3ZlYzMnOiAndW5pZm9ybTNmdicsXG4gICAgICAgICd2ZWMzW10nOiAndW5pZm9ybTNmdicsXG4gICAgICAgICdpdmVjMyc6ICd1bmlmb3JtM2l2JyxcbiAgICAgICAgJ2l2ZWMzW10nOiAndW5pZm9ybTNpdicsXG4gICAgICAgICd2ZWM0JzogJ3VuaWZvcm00ZnYnLFxuICAgICAgICAndmVjNFtdJzogJ3VuaWZvcm00ZnYnLFxuICAgICAgICAnaXZlYzQnOiAndW5pZm9ybTRpdicsXG4gICAgICAgICdpdmVjNFtdJzogJ3VuaWZvcm00aXYnLFxuICAgICAgICAnbWF0Mic6ICd1bmlmb3JtTWF0cml4MmZ2JyxcbiAgICAgICAgJ21hdDJbXSc6ICd1bmlmb3JtTWF0cml4MmZ2JyxcbiAgICAgICAgJ21hdDMnOiAndW5pZm9ybU1hdHJpeDNmdicsXG4gICAgICAgICdtYXQzW10nOiAndW5pZm9ybU1hdHJpeDNmdicsXG4gICAgICAgICdtYXQ0JzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuICAgICAgICAnbWF0NFtdJzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxuICAgICAgICAnc2FtcGxlcjJEJzogJ3VuaWZvcm0xaScsXG4gICAgICAgICdzYW1wbGVyQ3ViZSc6ICd1bmlmb3JtMWknXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgbWFwIG9mIGV4aXN0aW5nIGF0dHJpYnV0ZXMsIGZpbmQgdGhlIGxvd2VzdCBpbmRleCB0aGF0IGlzIG5vdFxuICAgICAqIGFscmVhZHkgdXNlZC4gSWYgdGhlIGF0dHJpYnV0ZSBvcmRlcmluZyB3YXMgYWxyZWFkeSBwcm92aWRlZCwgdXNlIHRoYXRcbiAgICAgKiBpbnN0ZWFkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBleGlzdGluZyBhdHRyaWJ1dGVzIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVjbGFyYXRpb24gLSBUaGUgYXR0cmlidXRlIGRlY2xhcmF0aW9uIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGF0dHJpYnV0ZSBpbmRleC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVJbmRleChhdHRyaWJ1dGVzLCBkZWNsYXJhdGlvbikge1xuICAgICAgICAvLyBjaGVjayBpZiBhdHRyaWJ1dGUgaXMgYWxyZWFkeSBkZWNsYXJlZCwgaWYgc28sIHVzZSB0aGF0IGluZGV4XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzW2RlY2xhcmF0aW9uLm5hbWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlc1tkZWNsYXJhdGlvbi5uYW1lXS5pbmRleDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gbmV4dCBhdmFpbGFibGUgaW5kZXhcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlciBzb3VyY2UsIHBhcnNlcyB0aGUgZGVjbGFyYXRpb25zIGFuZCBhcHBlbmRzIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdG8gdGhlIHVuaWZvcm1zIGFuZCBhdHRyaWJ0dWVzIGRlY2xhcmVkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIHNoYWRlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZlcnRTb3VyY2UgLSBUaGUgdmVydGV4IHNoYWRlciBzb3VyY2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZyYWdTb3VyY2UgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXMoc2hhZGVyLCB2ZXJ0U291cmNlLCBmcmFnU291cmNlKSB7XG4gICAgICAgIGxldCBkZWNsYXJhdGlvbnMgPSBTaGFkZXJQYXJzZXIucGFyc2VEZWNsYXJhdGlvbnMoXG4gICAgICAgICAgICBbdmVydFNvdXJjZSwgZnJhZ1NvdXJjZV0sXG4gICAgICAgICAgICBbJ3VuaWZvcm0nLCAnYXR0cmlidXRlJ10pO1xuICAgICAgICAvLyBmb3IgZWFjaCBkZWNsYXJhdGlvbiBpbiB0aGUgc2hhZGVyXG4gICAgICAgIGRlY2xhcmF0aW9ucy5mb3JFYWNoKGRlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0cyBhbiBhdHRyaWJ1dGUgb3IgdW5pZm9ybVxuICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ2F0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBhdHRyaWJ1dGUsIHN0b3JlIHR5cGUgYW5kIGluZGV4XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gZ2V0QXR0cmlidXRlSW5kZXgoc2hhZGVyLmF0dHJpYnV0ZXMsIGRlY2xhcmF0aW9uKTtcbiAgICAgICAgICAgICAgICBzaGFkZXIuYXR0cmlidXRlc1tkZWNsYXJhdGlvbi5uYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIGlmIChkZWNsYXJhdGlvbi5xdWFsaWZpZXIgPT09ICd1bmlmb3JtJykge1xuICAgICAgICAgICAgICAgIC8vIGlmIHVuaWZvcm0sIHN0b3JlIHR5cGUgYW5kIGJ1ZmZlciBmdW5jdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgc2hhZGVyLnVuaWZvcm1zW2RlY2xhcmF0aW9uLm5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBkZWNsYXJhdGlvbi50eXBlLFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBVTklGT1JNX0ZVTkNUSU9OU1tkZWNsYXJhdGlvbi50eXBlICsgKGRlY2xhcmF0aW9uLmNvdW50ID4gMSA/ICdbXScgOiAnJyldXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBzaGFkZXIgc291cmNlIHN0cmluZyBhbmQgc2hhZGVyIHR5cGUsIGNvbXBpbGVzIHRoZSBzaGFkZXIgYW5kIHJldHVybnMgdGhlIHJlc3VsdGluZyBXZWJHTFNoYWRlciBvYmplY3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBnbCAtIFRoZSB3ZWJnbCByZW5kZXJpbmcgY29udGV4dC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2hhZGVyU291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgc2hhZGVyIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFNoYWRlcn0gVGhlIGNvbXBpbGVkIHNoYWRlciBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29tcGlsZVNoYWRlcihnbCwgc2hhZGVyU291cmNlLCB0eXBlKSB7XG4gICAgICAgIGxldCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2xbdHlwZV0pO1xuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJTb3VyY2UpO1xuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICAgICAgICB0aHJvdyAnQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOlxcbicgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgYXR0cmlidXRlIGxvY2F0aW9ucyBmb3IgdGhlIFNoYWRlciBvYmplY3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiaW5kQXR0cmlidXRlTG9jYXRpb25zKHNoYWRlcikge1xuICAgICAgICBsZXQgZ2wgPSBzaGFkZXIuZ2w7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVzID0gc2hhZGVyLmF0dHJpYnV0ZXM7XG4gICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIC8vIGJpbmQgdGhlIGF0dHJpYnV0ZSBsb2NhdGlvblxuICAgICAgICAgICAgZ2wuYmluZEF0dHJpYkxvY2F0aW9uKFxuICAgICAgICAgICAgICAgIHNoYWRlci5wcm9ncmFtLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNba2V5XS5pbmRleCxcbiAgICAgICAgICAgICAgICBrZXkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWVyaWVzIHRoZSB3ZWJnbCByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHVuaWZvcm0gbG9jYXRpb25zLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VW5pZm9ybUxvY2F0aW9ucyhzaGFkZXIpIHtcbiAgICAgICAgbGV0IGdsID0gc2hhZGVyLmdsO1xuICAgICAgICBsZXQgdW5pZm9ybXMgPSBzaGFkZXIudW5pZm9ybXM7XG4gICAgICAgIE9iamVjdC5rZXlzKHVuaWZvcm1zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIHVuaWZvcm0gbG9jYXRpb25cbiAgICAgICAgICAgIGxldCBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXIucHJvZ3JhbSwga2V5KTtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIG51bGwsIHBhcnNlIG1heSBkZXRlY3QgdW5pZm9ybSB0aGF0IGlzIGNvbXBpbGVkIG91dFxuICAgICAgICAgICAgLy8gZHVlIHRvIGEgcHJlcHJvY2Vzc29yIGV2YWx1YXRpb24uXG4gICAgICAgICAgICAvLyBUT0RPOiBmaXggcGFyc2VyIHNvIHRoYXQgaXQgZXZhbHVhdGVzIHRoZXNlIGNvcnJlY3RseS5cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB1bmlmb3Jtc1trZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bmlmb3Jtc1trZXldLmxvY2F0aW9uID0gbG9jYXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIHNoYWRlciBzb3VyY2UgZnJvbSBhIHVybC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gbG9hZCB0aGUgcmVzb3VyY2UgZnJvbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gbG9hZCB0aGUgc2hhZGVyIHNvdXJjZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkU2hhZGVyU291cmNlKHVybCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgWEhSTG9hZGVyLmxvYWQoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBkb25lKG51bGwsIHJlcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNvdXJjZSBvZiB0aGUgc2hhZGVyLlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBwYXNzIHRocm91Z2ggdGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFzc1Rocm91Z2hTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICBkb25lKG51bGwsIHNvdXJjZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYW4gYXJyYXkgb2YgR0xTTCBzb3VyY2Ugc3RyaW5ncyBhbmQgVVJMcywgYW5kIHJlc29sdmVzIHRoZW0gaW50byBhbmQgYXJyYXkgb2YgR0xTTCBzb3VyY2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZXMgLSBUaGUgc2hhZGVyIHNvdXJjZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBzaGFkZXIgc291cmNlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlU291cmNlcyhzb3VyY2VzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICBsZXQgdGFza3MgPSBbXTtcbiAgICAgICAgICAgIHNvdXJjZXMgPSBzb3VyY2VzIHx8IFtdO1xuICAgICAgICAgICAgc291cmNlcyA9ICFBcnJheS5pc0FycmF5KHNvdXJjZXMpID8gW3NvdXJjZXNdIDogc291cmNlcztcbiAgICAgICAgICAgIHNvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChTaGFkZXJQYXJzZXIuaXNHTFNMKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChwYXNzVGhyb3VnaFNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKGxvYWRTaGFkZXJTb3VyY2Uoc291cmNlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBBc3luYy5wYXJhbGxlbCh0YXNrcywgZG9uZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgc2hhZGVyIHByb2dyYW0gb2JqZWN0IGZyb20gc291cmNlIHN0cmluZ3MuIFRoaXMgaW5jbHVkZXM6XG4gICAgICogICAgMSkgQ29tcGlsaW5nIGFuZCBsaW5raW5nIHRoZSBzaGFkZXIgcHJvZ3JhbS5cbiAgICAgKiAgICAyKSBQYXJzaW5nIHNoYWRlciBzb3VyY2UgZm9yIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbi5cbiAgICAgKiAgICAzKSBCaW5kaW5nIGF0dHJpYnV0ZSBsb2NhdGlvbnMsIGJ5IG9yZGVyIG9mIGRlbGNhcmF0aW9uLlxuICAgICAqICAgIDQpIFF1ZXJ5aW5nIGFuZCBzdG9yaW5nIHVuaWZvcm0gbG9jYXRpb24uXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlcyAtIEEgbWFwIGNvbnRhaW5pbmcgc291cmNlcyB1bmRlciAndmVydCcgYW5kICdmcmFnJyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0oc2hhZGVyLCBzb3VyY2VzKSB7XG4gICAgICAgIGxldCBnbCA9IHNoYWRlci5nbDtcbiAgICAgICAgbGV0IGNvbW1vbiA9IHNvdXJjZXMuY29tbW9uLmpvaW4oJycpO1xuICAgICAgICBsZXQgdmVydCA9IHNvdXJjZXMudmVydC5qb2luKCcnKTtcbiAgICAgICAgbGV0IGZyYWcgPSBzb3VyY2VzLmZyYWcuam9pbignJyk7XG4gICAgICAgIC8vIGNvbXBpbGUgc2hhZGVyc1xuICAgICAgICBsZXQgdmVydGV4U2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgY29tbW9uICsgdmVydCwgJ1ZFUlRFWF9TSEFERVInKTtcbiAgICAgICAgbGV0IGZyYWdtZW50U2hhZGVyID0gY29tcGlsZVNoYWRlcihnbCwgY29tbW9uICsgZnJhZywgJ0ZSQUdNRU5UX1NIQURFUicpO1xuICAgICAgICAvLyBwYXJzZSBzb3VyY2UgZm9yIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybXNcbiAgICAgICAgc2V0QXR0cmlidXRlc0FuZFVuaWZvcm1zKHNoYWRlciwgdmVydCwgZnJhZyk7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgc2hhZGVyIHByb2dyYW1cbiAgICAgICAgc2hhZGVyLnByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgICAgIC8vIGF0dGFjaCB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlcnNcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlci5wcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyLnByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcbiAgICAgICAgLy8gYmluZCB2ZXJ0ZXggYXR0cmlidXRlIGxvY2F0aW9ucyBCRUZPUkUgbGlua2luZ1xuICAgICAgICBiaW5kQXR0cmlidXRlTG9jYXRpb25zKHNoYWRlcik7XG4gICAgICAgIC8vIGxpbmsgc2hhZGVyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHNoYWRlci5wcm9ncmFtKTtcbiAgICAgICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcbiAgICAgICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlci5wcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgICAgICAgIHRocm93ICdBbiBlcnJvciBvY2N1cmVkIGxpbmtpbmcgdGhlIHNoYWRlcjpcXG4nICsgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coc2hhZGVyLnByb2dyYW0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGdldCBzaGFkZXIgdW5pZm9ybSBsb2NhdGlvbnNcbiAgICAgICAgZ2V0VW5pZm9ybUxvY2F0aW9ucyhzaGFkZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBTaGFkZXJcbiAgICAgKiBAY2xhc3NkZXNjIEEgc2hhZGVyIGNsYXNzIHRvIGFzc2lzdCBpbiBjb21waWxpbmcgYW5kIGxpbmtpbmcgd2ViZ2wgc2hhZGVycywgc3RvcmluZyBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gbG9jYXRpb25zLCBhbmQgYnVmZmVyaW5nIHVuaWZvcm1zLlxuICAgICAqL1xuICAgIGNsYXNzIFNoYWRlciB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIFNoYWRlciBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNoYWRlciBzcGVjaWZpY2F0aW9uIG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmNvbW1vbiAtIFNvdXJjZXMgLyBVUkxzIHRvIGJlIHNoYXJlZCBieSBib3RoIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVycy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLnZlcnQgLSBUaGUgdmVydGV4IHNoYWRlciBzb3VyY2VzIC8gVVJMcy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSBzcGVjLmZyYWcgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZXMgLyBVUkxzLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBzcGVjLmF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlIGluZGV4IG9yZGVyaW5ncy5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbmNlIHRoZSBzaGFkZXIgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNvbXBpbGVkIGFuZCBsaW5rZWQuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30sIGNhbGxiYWNrID0gbnVsbCkge1xuICAgICAgICAgICAgLy8gY2hlY2sgc291cmNlIGFyZ3VtZW50c1xuICAgICAgICAgICAgaWYgKCFzcGVjLnZlcnQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnVmVydGV4IHNoYWRlciBhcmd1bWVudCBgdmVydGAgaGFzIG5vdCBiZWVuIHByb3ZpZGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3BlYy5mcmFnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0ZyYWdtZW50IHNoYWRlciBhcmd1bWVudCBgZnJhZ2AgaGFzIG5vdCBiZWVuIHByb3ZpZGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvZ3JhbSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICAgICAgdGhpcy52ZXJzaW9uID0gc3BlYy52ZXJzaW9uIHx8ICcxLjAwJztcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy51bmlmb3JtcyA9IHt9O1xuICAgICAgICAgICAgLy8gaWYgYXR0cmlidXRlIG9yZGVyaW5nIGlzIHByb3ZpZGVkLCB1c2UgdGhvc2UgaW5kaWNlc1xuICAgICAgICAgICAgaWYgKHNwZWMuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIHNwZWMuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbYXR0cl0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgc2hhZGVyXG4gICAgICAgICAgICBBc3luYy5wYXJhbGxlbCh7XG4gICAgICAgICAgICAgICAgY29tbW9uOiByZXNvbHZlU291cmNlcyhzcGVjLmNvbW1vbiksXG4gICAgICAgICAgICAgICAgdmVydDogcmVzb2x2ZVNvdXJjZXMoc3BlYy52ZXJ0KSxcbiAgICAgICAgICAgICAgICBmcmFnOiByZXNvbHZlU291cmNlcyhzcGVjLmZyYWcpLFxuICAgICAgICAgICAgfSwgKGVyciwgc291cmNlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBvbmNlIGFsbCBzaGFkZXIgc291cmNlcyBhcmUgbG9hZGVkXG4gICAgICAgICAgICAgICAgY3JlYXRlUHJvZ3JhbSh0aGlzLCBzb3VyY2VzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZHMgdGhlIHNoYWRlciBwcm9ncmFtIGZvciB1c2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHVzZSgpIHtcbiAgICAgICAgICAgIC8vIHVzZSB0aGUgc2hhZGVyXG4gICAgICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5wcm9ncmFtKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJ1ZmZlciBhIHVuaWZvcm0gdmFsdWUgYnkgbmFtZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgdW5pZm9ybSBuYW1lIGluIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVGhlIHVuaWZvcm0gdmFsdWUgdG8gYnVmZmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTaGFkZXJ9IC0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHNldFVuaWZvcm0obmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGxldCB1bmlmb3JtID0gdGhpcy51bmlmb3Jtc1tuYW1lXTtcbiAgICAgICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZSB1bmlmb3JtIHNwZWMgZXhpc3RzIGZvciB0aGUgbmFtZVxuICAgICAgICAgICAgaWYgKCF1bmlmb3JtKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYE5vIHVuaWZvcm0gZm91bmQgdW5kZXIgbmFtZSBcXGAke25hbWV9XFxgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHZhbHVlXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZSB1bmlmb3JtIGFyZ3VtZW50IGlzIGRlZmluZWRcbiAgICAgICAgICAgICAgICB0aHJvdyBgVmFsdWUgcGFzc2VkIGZvciB1bmlmb3JtIFxcYCR7bmFtZX1cXGAgaXMgdW5kZWZpbmVkIG9yIG51bGxgO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgYm9vbGVhbidzIHRvIDAgb3IgMVxuICAgICAgICAgICAgICAgIC8vIFRPRE86IGlzIHRoaXMgbmVjZXNzYXJ5P1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPyAxIDogMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHBhc3MgdGhlIGFyZ3VtZW50cyBkZXBlbmRpbmcgb24gdGhlIHR5cGVcbiAgICAgICAgICAgIC8vIFRPRE86IHJlbW92ZSBzdHJpbmcgY29tcGFyaW9ucyBmcm9tIGhlcmUuLi5cbiAgICAgICAgICAgIGlmICh1bmlmb3JtLnR5cGUgPT09ICdtYXQyJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQzJyB8fCB1bmlmb3JtLnR5cGUgPT09ICdtYXQ0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2xbdW5pZm9ybS5mdW5jXSh1bmlmb3JtLmxvY2F0aW9uLCBmYWxzZSwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdsW3VuaWZvcm0uZnVuY10odW5pZm9ybS5sb2NhdGlvbiwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQnVmZmVyIGEgbWFwIG9mIHVuaWZvcm0gdmFsdWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdW5pZm9ybXMgLSBUaGUgbWFwIG9mIHVuaWZvcm1zIGtleWVkIGJ5IG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHNldFVuaWZvcm1zKGFyZ3MpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFyZ3MpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVbmlmb3JtKG5hbWUsIGFyZ3NbbmFtZV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gU2hhZGVyO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBDT01NRU5UU19SRUdFWFAgPSAvKFxcL1xcKihbXFxzXFxTXSo/KVxcKlxcLyl8KFxcL1xcLyguKikkKS9nbTtcbiAgICBsZXQgRU5ETElORV9SRUdFWFAgPSAvKFxcclxcbnxcXG58XFxyKS9nbTtcbiAgICBsZXQgV0hJVEVTUEFDRV9SRUdFWFAgPSAvXFxzezIsfS9nO1xuICAgIGxldCBCUkFDS0VUX1dISVRFU1BBQ0VfUkVHRVhQID0gLyhcXHMqKShcXFspKFxccyopKFxcZCspKFxccyopKFxcXSkoXFxzKikvZztcbiAgICBsZXQgTkFNRV9DT1VOVF9SRUdFWFAgPSAvKFthLXpBLVpfXVthLXpBLVowLTlfXSopKD86XFxbKFxcZCspXFxdKT8vO1xuICAgIGxldCBQUkVDSVNJT05fUkVHRVggPSAvXFxicHJlY2lzaW9uXFxzK1xcdytcXHMrXFx3KzsvZztcbiAgICBsZXQgSU5MSU5FX1BSRUNJU0lPTl9SRUdFWCA9IC9cXGIoaGlnaHB8bWVkaXVtcHxsb3dwKVxccysvZztcbiAgICBsZXQgR0xTTF9SRUdFWFAgPSAvdm9pZFxccyttYWluXFxzKlxcKFxccyoodm9pZCkqXFxzKlxcKVxccyovbWk7XG4gICAgbGV0IFBSRVBfUkVHRVhQID0gLyMoW1xcV1xcd1xcc1xcZF0pKD86LipcXFxccj9cXG4pKi4qJC9nbTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgc3RhbmRhcmQgY29tbWVudHMgZnJvbSB0aGUgcHJvdmlkZWQgc3RyaW5nLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzdHJpcCBjb21tZW50cyBmcm9tLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgY29tbWVudGxlc3Mgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0cmlwQ29tbWVudHMoc3RyKSB7XG4gICAgICAgIC8vIHJlZ2V4IHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL21vYWdyaXVzL3N0cmlwY29tbWVudHNcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKENPTU1FTlRTX1JFR0VYUCwgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYW4gcHJlY2lzaW9uIHN0YXRlbWVudHMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgdW5wcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBwcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RyaXBQcmVjaXNpb24oc291cmNlKSB7XG4gICAgICAgIC8vIHJlbW92ZSBnbG9iYWwgcHJlY2lzaW9uIGRlY2xhcmF0aW9uc1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZShQUkVDSVNJT05fUkVHRVgsICcnKTtcbiAgICAgICAgLy8gcmVtb3ZlIGlubGluZSBwcmVjaXNpb24gZGVjbGFyYXRpb25zXG4gICAgICAgIHJldHVybiBzb3VyY2UucmVwbGFjZShJTkxJTkVfUFJFQ0lTSU9OX1JFR0VYLCAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYWxsIHdoaXRlc3BhY2UgaW50byBhIHNpbmdsZSAnICcgc3BhY2UgY2hhcmFjdGVyLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBub3JtYWxpemUgd2hpdGVzcGFjZSBmcm9tLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgbm9ybWFsaXplZCBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplV2hpdGVzcGFjZShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKEVORExJTkVfUkVHRVhQLCAnICcpIC8vIHJlbW92ZSBsaW5lIGVuZGluZ3NcbiAgICAgICAgICAgIC5yZXBsYWNlKFdISVRFU1BBQ0VfUkVHRVhQLCAnICcpIC8vIG5vcm1hbGl6ZSB3aGl0ZXNwYWNlIHRvIHNpbmdsZSAnICdcbiAgICAgICAgICAgIC5yZXBsYWNlKEJSQUNLRVRfV0hJVEVTUEFDRV9SRUdFWFAsICckMiQ0JDYnKTsgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgaW4gYnJhY2tldHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgdGhlIG5hbWUgYW5kIGNvdW50IG91dCBvZiBhIG5hbWUgc3RhdGVtZW50LCByZXR1cm5pbmcgdGhlIGRlY2xhcmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHF1YWxpZmllciAtIFRoZSBxdWFsaWZpZXIgc3RyaW5nLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgc3RyaW5nLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbnRyeSAtIFRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBkZWNsYXJhdGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFyc2VOYW1lQW5kQ291bnQocXVhbGlmaWVyLCB0eXBlLCBlbnRyeSkge1xuICAgICAgICAvLyBkZXRlcm1pbmUgbmFtZSBhbmQgc2l6ZSBvZiB2YXJpYWJsZVxuICAgICAgICBsZXQgbWF0Y2hlcyA9IGVudHJ5Lm1hdGNoKE5BTUVfQ09VTlRfUkVHRVhQKTtcbiAgICAgICAgbGV0IG5hbWUgPSBtYXRjaGVzWzFdO1xuICAgICAgICBsZXQgY291bnQgPSAobWF0Y2hlc1syXSA9PT0gdW5kZWZpbmVkKSA/IDEgOiBwYXJzZUludChtYXRjaGVzWzJdLCAxMCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBxdWFsaWZpZXI6IHF1YWxpZmllcixcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgY291bnQ6IGNvdW50XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2VzIGEgc2luZ2xlICdzdGF0ZW1lbnQnLiBBICdzdGF0ZW1lbnQnIGlzIGNvbnNpZGVyZWQgYW55IHNlcXVlbmNlIG9mXG4gICAgICogY2hhcmFjdGVycyBmb2xsb3dlZCBieSBhIHNlbWktY29sb24uIFRoZXJlZm9yZSwgYSBzaW5nbGUgJ3N0YXRlbWVudCcgaW5cbiAgICAgKiB0aGlzIHNlbnNlIGNvdWxkIGNvbnRhaW4gc2V2ZXJhbCBjb21tYSBzZXBhcmF0ZWQgZGVjbGFyYXRpb25zLiBSZXR1cm5zXG4gICAgICogYWxsIHJlc3VsdGluZyBkZWNsYXJhdGlvbnMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZW1lbnQgLSBUaGUgc3RhdGVtZW50IHRvIHBhcnNlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBhcnJheSBvZiBwYXJzZWQgZGVjbGFyYXRpb24gb2JqZWN0cy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVN0YXRlbWVudChzdGF0ZW1lbnQpIHtcbiAgICAgICAgLy8gc3BsaXQgc3RhdGVtZW50IG9uIGNvbW1hc1xuICAgICAgICAvL1xuICAgICAgICAvLyBbJ3VuaWZvcm0gbWF0NCBBWzEwXScsICdCJywgJ0NbMl0nXVxuICAgICAgICAvL1xuICAgICAgICBsZXQgc3BsaXQgPSBzdGF0ZW1lbnQuc3BsaXQoJywnKS5tYXAoZWxlbSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS50cmltKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNwbGl0IGRlY2xhcmF0aW9uIGhlYWRlciBmcm9tIHN0YXRlbWVudFxuICAgICAgICAvL1xuICAgICAgICAvLyBbJ3VuaWZvcm0nLCAnbWF0NCcsICdBWzEwXSddXG4gICAgICAgIC8vXG4gICAgICAgIGxldCBoZWFkZXIgPSBzcGxpdC5zaGlmdCgpLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgLy8gcXVhbGlmaWVyIGlzIGFsd2F5cyBmaXJzdCBlbGVtZW50XG4gICAgICAgIC8vXG4gICAgICAgIC8vICd1bmlmb3JtJ1xuICAgICAgICAvL1xuICAgICAgICBsZXQgcXVhbGlmaWVyID0gaGVhZGVyLnNoaWZ0KCk7XG5cbiAgICAgICAgLy8gdHlwZSB3aWxsIGJlIHRoZSBzZWNvbmQgZWxlbWVudFxuICAgICAgICAvL1xuICAgICAgICAvLyAnbWF0NCdcbiAgICAgICAgLy9cbiAgICAgICAgbGV0IHR5cGUgPSBoZWFkZXIuc2hpZnQoKTtcblxuICAgICAgICAvLyBsYXN0IHBhcnQgb2YgaGVhZGVyIHdpbGwgYmUgdGhlIGZpcnN0LCBhbmQgcG9zc2libGUgb25seSB2YXJpYWJsZSBuYW1lXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFsnQVsxMF0nLCAnQicsICdDWzJdJ11cbiAgICAgICAgLy9cbiAgICAgICAgbGV0IG5hbWVzID0gaGVhZGVyLmNvbmNhdChzcGxpdCk7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG90aGVyIG5hbWVzIGFmdGVyIGEgJywnIGFkZCB0aGVtIGFzIHdlbGxcbiAgICAgICAgcmV0dXJuIG5hbWVzLm1hcChuYW1lID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZU5hbWVBbmRDb3VudChxdWFsaWZpZXIsIHR5cGUsIG5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGxpdHMgdGhlIHNvdXJjZSBzdHJpbmcgYnkgc2VtaS1jb2xvbnMgYW5kIGNvbnN0cnVjdHMgYW4gYXJyYXkgb2ZcbiAgICAgKiBkZWNsYXJhdGlvbiBvYmplY3RzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIga2V5d29yZHMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgc2hhZGVyIHNvdXJjZSBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGtleXdvcmRzIC0gVGhlIHF1YWxpZmllciBkZWNsYXJhdGlvbiBrZXl3b3Jkcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIG9iamVjdHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFyc2VTb3VyY2Uoc291cmNlLCBrZXl3b3Jkcykge1xuICAgICAgICAvLyBnZXQgaW5kaXZpZHVhbCBzdGF0ZW1lbnRzIChhbnkgc2VxdWVuY2UgZW5kaW5nIGluIDspXG4gICAgICAgIGxldCBzdGF0ZW1lbnRzID0gc291cmNlLnNwbGl0KCc7Jyk7XG4gICAgICAgIC8vIGJ1aWxkIHJlZ2V4IGZvciBwYXJzaW5nIHN0YXRlbWVudHMgd2l0aCB0YXJnZXR0ZWQga2V5d29yZHNcbiAgICAgICAgbGV0IGtleXdvcmRTdHIgPSBrZXl3b3Jkcy5qb2luKCd8Jyk7XG4gICAgICAgIGxldCBrZXl3b3JkUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcYignICsga2V5d29yZFN0ciArICcpXFxcXGIuKicpO1xuICAgICAgICAvLyBwYXJzZSBhbmQgc3RvcmUgZ2xvYmFsIHByZWNpc2lvbiBzdGF0ZW1lbnRzIGFuZCBhbnkgZGVjbGFyYXRpb25zXG4gICAgICAgIGxldCBtYXRjaGVkID0gW107XG4gICAgICAgIC8vIGZvciBlYWNoIHN0YXRlbWVudFxuICAgICAgICBzdGF0ZW1lbnRzLmZvckVhY2goc3RhdGVtZW50ID0+IHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBrZXl3b3Jkc1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFsndW5pZm9ybSBmbG9hdCB1VGltZSddXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgbGV0IGttYXRjaCA9IHN0YXRlbWVudC5tYXRjaChrZXl3b3JkUmVnZXgpO1xuICAgICAgICAgICAgaWYgKGttYXRjaCkge1xuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHN0YXRlbWVudCBhbmQgYWRkIHRvIGFycmF5XG4gICAgICAgICAgICAgICAgbWF0Y2hlZCA9IG1hdGNoZWQuY29uY2F0KHBhcnNlU3RhdGVtZW50KGttYXRjaFswXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsdGVycyBvdXQgZHVwbGljYXRlIGRlY2xhcmF0aW9ucyBwcmVzZW50IGJldHdlZW4gc2hhZGVycy4gQ3VycmVudGx5XG4gICAgICoganVzdCByZW1vdmVzIGFsbCAjIHN0YXRlbWVudHMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRlY2xhcmF0aW9ucyAtIFRoZSBhcnJheSBvZiBkZWNsYXJhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGZpbHRlcmVkIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXJEdXBsaWNhdGVzQnlOYW1lKGRlY2xhcmF0aW9ucykge1xuICAgICAgICAvLyBpbiBjYXNlcyB3aGVyZSB0aGUgc2FtZSBkZWNsYXJhdGlvbnMgYXJlIHByZXNlbnQgaW4gbXVsdGlwbGVcbiAgICAgICAgLy8gc291cmNlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20gdGhlIHJlc3VsdHNcbiAgICAgICAgbGV0IHNlZW4gPSB7fTtcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucy5maWx0ZXIoZGVjbGFyYXRpb24gPT4ge1xuICAgICAgICAgICAgaWYgKHNlZW5bZGVjbGFyYXRpb24ubmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWVuW2RlY2xhcmF0aW9uLm5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIHRoZSBwcmVwcm9jZXNzb3Igb24gdGhlIGdsc2wgY29kZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZSAtIFRoZSB1bnByb2Nlc3NlZCBzb3VyY2UgY29kZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHByb2Nlc3NlZCBzb3VyY2UgY29kZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwcmVwcm9jZXNzKHNvdXJjZSkge1xuICAgICAgICAvLyBUT0RPOiBpbXBsZW1lbnQgdGhpcyBjb3JyZWN0bHkuLi5cbiAgICAgICAgcmV0dXJuIHNvdXJjZS5yZXBsYWNlKFBSRVBfUkVHRVhQLCAnJyk7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlcyB0aGUgcHJvdmlkZWQgR0xTTCBzb3VyY2UsIGFuZCByZXR1cm5zIGFsbCBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzIHRoYXQgY29udGFpbiB0aGUgcHJvdmlkZWQgcXVhbGlmaWVyIHR5cGUuIFRoaXMgY2FuIGJlIHVzZWQgdG8gZXh0cmFjdCBhbGwgYXR0cmlidXRlcyBhbmQgdW5pZm9ybSBuYW1lcyBhbmQgdHlwZXMgZnJvbSBhIHNoYWRlci5cbiAgICAgICAgICpcbiAgICAgICAgICogRm9yIGV4YW1wbGUsIHdoZW4gcHJvdmlkZWQgYSAndW5pZm9ybScgcXVhbGlmaWVycywgdGhlIGRlY2xhcmF0aW9uOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgJ3VuaWZvcm0gaGlnaHAgdmVjMyB1U3BlY3VsYXJDb2xvcjsnXG4gICAgICAgICAqXG4gICAgICAgICAqIFdvdWxkIGJlIHBhcnNlZCB0bzpcbiAgICAgICAgICogICAgIHtcbiAgICAgICAgICogICAgICAgICBxdWFsaWZpZXI6ICd1bmlmb3JtJyxcbiAgICAgICAgICogICAgICAgICB0eXBlOiAndmVjMycsXG4gICAgICAgICAqICAgICAgICAgbmFtZTogJ3VTcGVjdWxhckNvbG9yJyxcbiAgICAgICAgICogICAgICAgICBjb3VudDogMVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2VzIC0gVGhlIHNoYWRlciBzb3VyY2VzLlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBxdWFsaWZpZXJzIC0gVGhlIHF1YWxpZmllcnMgdG8gZXh0cmFjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBhcnJheSBvZiBxdWFsaWZpZXIgZGVjbGFyYXRpb24gc3RhdGVtZW50cy5cbiAgICAgICAgICovXG4gICAgICAgIHBhcnNlRGVjbGFyYXRpb25zOiBmdW5jdGlvbihzb3VyY2VzID0gW10sIHF1YWxpZmllcnMgPSBbXSkge1xuICAgICAgICAgICAgLy8gaWYgbm8gc291cmNlcyBvciBxdWFsaWZpZXJzIGFyZSBwcm92aWRlZCwgcmV0dXJuIGVtcHR5IGFycmF5XG4gICAgICAgICAgICBpZiAoc291cmNlcy5sZW5ndGggPT09IDAgfHwgcXVhbGlmaWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb3VyY2VzID0gQXJyYXkuaXNBcnJheShzb3VyY2VzKSA/IHNvdXJjZXMgOiBbc291cmNlc107XG4gICAgICAgICAgICBxdWFsaWZpZXJzID0gQXJyYXkuaXNBcnJheShxdWFsaWZpZXJzKSA/IHF1YWxpZmllcnMgOiBbcXVhbGlmaWVyc107XG4gICAgICAgICAgICAvLyBwYXJzZSBvdXQgdGFyZ2V0dGVkIGRlY2xhcmF0aW9uc1xuICAgICAgICAgICAgbGV0IGRlY2xhcmF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gcnVuIHByZXByb2Nlc3NvclxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHByZXByb2Nlc3Moc291cmNlKTtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgcHJlY2lzaW9uIHN0YXRlbWVudHNcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBzdHJpcFByZWNpc2lvbihzb3VyY2UpO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBjb21tZW50c1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHN0cmlwQ29tbWVudHMoc291cmNlKTtcbiAgICAgICAgICAgICAgICAvLyBmaW5hbGx5LCBub3JtYWxpemUgdGhlIHdoaXRlc3BhY2VcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBub3JtYWxpemVXaGl0ZXNwYWNlKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2Ugb3V0IGRlY2xhcmF0aW9uc1xuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucyA9IGRlY2xhcmF0aW9ucy5jb25jYXQocGFyc2VTb3VyY2Uoc291cmNlLCBxdWFsaWZpZXJzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBkdXBsaWNhdGVzIGFuZCByZXR1cm5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJEdXBsaWNhdGVzQnlOYW1lKGRlY2xhcmF0aW9ucyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVjdHMgYmFzZWQgb24gdGhlIGV4aXN0ZW5jZSBvZiBhICd2b2lkIG1haW4oKSB7JyBzdGF0ZW1lbnQsIGlmIHRoZSBzdHJpbmcgaXMgZ2xzbCBzb3VyY2UgY29kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBpbnB1dCBzdHJpbmcgdG8gdGVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHN0cmluZyBpcyBnbHNsIGNvZGUuXG4gICAgICAgICAqL1xuICAgICAgICBpc0dMU0w6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIEdMU0xfUkVHRVhQLnRlc3Qoc3RyKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcbiAgICBsZXQgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpO1xuXG4gICAgbGV0IE1BR19GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBNSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlLFxuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBOT05fTUlQTUFQX01JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWUsXG4gICAgfTtcbiAgICBsZXQgTUlQTUFQX01JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBXUkFQX01PREVTID0ge1xuICAgICAgICBSRVBFQVQ6IHRydWUsXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZVxuICAgIH07XG4gICAgbGV0IERFUFRIX1RZUEVTID0ge1xuICAgICAgICBERVBUSF9DT01QT05FTlQ6IHRydWUsXG4gICAgICAgIERFUFRIX1NURU5DSUw6IHRydWVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgdHlwZSBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfVFlQRSA9ICdVTlNJR05FRF9CWVRFJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfRk9STUFUID0gJ1JHQkEnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgd3JhcCBtb2RlIGZvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9XUkFQID0gJ1JFUEVBVCc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEEgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgbWlwbWFwcGluZyBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX01JUE1BUCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0lOVkVSVF9ZID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYID0gJ19NSVBNQVBfTElORUFSJztcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBUZXh0dXJlMkRcbiAgICAgKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCB0ZXh0dXJlLlxuICAgICAqL1xuICAgIGNsYXNzIFRleHR1cmUyRCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmUyRCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7VWludDhBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheXxGbG9hdDMyQXJyYXl8SW1hZ2VEYXRhfEhUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLnByZU11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHNwZWMgPSB7fSkge1xuICAgICAgICAgICAgLy8gZ2V0IHNwZWNpZmljIHBhcmFtc1xuICAgICAgICAgICAgc3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICAvLyBzZXQgY29udGV4dFxuICAgICAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgICAgIC8vIGVtcHR5IHRleHR1cmVcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZSA9IG51bGw7XG4gICAgICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcbiAgICAgICAgICAgIHRoaXMud3JhcFMgPSBzcGVjLndyYXBTIHx8IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHRoaXMud3JhcFQgPSBzcGVjLndyYXBUIHx8IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgLy8gc2V0IG90aGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogREVGQVVMVF9NSVBNQVA7XG4gICAgICAgICAgICB0aGlzLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IERFRkFVTFRfSU5WRVJUX1k7XG4gICAgICAgICAgICB0aGlzLnByZU11bHRpcGx5QWxwaGEgPSBzcGVjLnByZU11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCA/IHNwZWMucHJlTXVsdGlwbHlBbHBoYSA6IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEE7XG4gICAgICAgICAgICAvLyBzZXQgZm9ybWF0XG4gICAgICAgICAgICB0aGlzLmZvcm1hdCA9IHNwZWMuZm9ybWF0IHx8IERFRkFVTFRfRk9STUFUO1xuICAgICAgICAgICAgaWYgKERFUFRIX1RZUEVTW3RoaXMuZm9ybWF0XSAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdXRUJHTF9kZXB0aF90ZXh0dXJlJykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgZm9ybWF0IFxcYCR7dGhpcy5mb3JtYXR9XFxgIGFzIFxcYFdFQkdMX2RlcHRoX3RleHR1cmVcXGAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCB0eXBlXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgREVGQVVMVF9UWVBFO1xuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJyAmJiAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdCcpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYENhbm5vdCBjcmVhdGUgVGV4dHVyZTJEIG9mIHR5cGUgXFxgRkxPQVRcXGAgYXMgXFxgT0VTX3RleHR1cmVfZmxvYXRcXGAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVybCB3aWxsIG5vdCBiZSByZXNvbHZlZCB5ZXQsIHNvIGRvbid0IGJ1ZmZlciBpbiB0aGF0IGNhc2VcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BlYy5zcmMgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgc2l6ZVxuICAgICAgICAgICAgICAgIGlmICghVXRpbC5pc0NhbnZhc1R5cGUoc3BlYy5zcmMpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBhIGNhbnZhcyB0eXBlLCBkaW1lbnNpb25zIE1VU1QgYmUgc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BlYy53aWR0aCAhPT0gJ251bWJlcicgfHwgc3BlYy53aWR0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnYHdpZHRoYCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BlYy5oZWlnaHQgIT09ICdudW1iZXInIHx8IHNwZWMuaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdgaGVpZ2h0YCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChVdGlsLm11c3RCZVBvd2VyT2ZUd28odGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghVXRpbC5pc1Bvd2VyT2ZUd28oc3BlYy53aWR0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgUGFyYW1ldGVycyByZXF1aXJlIGEgcG93ZXItb2YtdHdvIHRleHR1cmUsIHlldCBwcm92aWRlZCB3aWR0aCBvZiBcXGAke3NwZWMud2lkdGh9XFxgIGlzIG5vdCBhIHBvd2VyIG9mIHR3b2A7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVV0aWwuaXNQb3dlck9mVHdvKHNwZWMuaGVpZ2h0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBQYXJhbWV0ZXJzIHJlcXVpcmUgYSBwb3dlci1vZi10d28gdGV4dHVyZSwgeWV0IHByb3ZpZGVkIGhlaWdodCBvZiBcXGAke3NwZWMuaGVpZ2h0fVxcYCBpcyBub3QgYSBwb3dlciBvZiB0d29gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShzcGVjLnNyYyB8fCBudWxsLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCB0byB0aGUgcHJvdmlkZWQgdGV4dHVyZSB1bml0IGxvY2F0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LiBEZWZhdWx0cyB0byAwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYmluZChsb2NhdGlvbiA9IDApIHtcbiAgICAgICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihsb2NhdGlvbikgfHwgbG9jYXRpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFRleHR1cmUgdW5pdCBsb2NhdGlvbiBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2xbJ1RFWFRVUkUnICsgbG9jYXRpb25dKTtcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHVuYmluZCgpIHtcbiAgICAgICAgICAgIC8vIHVuYmluZCB0ZXh0dXJlXG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyVmlld3xudWxsfSBkYXRhIC0gVGhlIGRhdGEgYXJyYXkgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYnVmZmVyRGF0YShkYXRhLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRleHR1cmUgb2JqZWN0IGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdFxuICAgICAgICAgICAgaWYgKCF0aGlzLnRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBiaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG4gICAgICAgICAgICAvLyBpbnZlcnQgeSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRoaXMuaW52ZXJ0WSk7XG4gICAgICAgICAgICAvLyBwcmVtdWx0aXBseSBhbHBoYSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdGhpcy5wcmVNdWx0aXBseUFscGhhKTtcbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgYXJnXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9TSE9SVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MTZBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MzJBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGVuc3VyZSB0eXBlIGNvcnJlc3BvbmRzIHRvIGRhdGFcbiAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0lOVCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnRkxPQVQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhICYmICEoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJiAhVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsICcgK1xuICAgICAgICAgICAgICAgICAgICAnYEFycmF5QnVmZmVyVmlld2AsIGBJbWFnZURhdGFgLCBgSFRNTEltYWdlRWxlbWVudGAsICcgK1xuICAgICAgICAgICAgICAgICAgICAnYEhUTUxDYW52YXNFbGVtZW50YCwgYEhUTUxWaWRlb0VsZW1lbnRgLCBvciBudWxsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChVdGlsLmlzQ2FudmFzVHlwZShkYXRhKSkge1xuICAgICAgICAgICAgICAgIC8vIHN0b3JlIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gZGF0YS53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZVxuICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQoXG4gICAgICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXG4gICAgICAgICAgICAgICAgICAgIDAsIC8vIG1pcC1tYXAgbGV2ZWwsXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMudHlwZV0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IHRoaXMud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSB0ZXh0dXJlIGRhdGFcbiAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxuICAgICAgICAgICAgICAgICAgICAwLCAvLyBtaXAtbWFwIGxldmVsXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIG1pcCBtYXBzXG4gICAgICAgICAgICBpZiAodGhpcy5taXBNYXApIHtcbiAgICAgICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVuYmluZCB0ZXh0dXJlXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgYnkgbmFtZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRQYXJhbWV0ZXJzKHBhcmFtcykge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIC8vIHNldCB3cmFwIFMgcGFyYW1ldGVyXG4gICAgICAgICAgICBsZXQgcGFyYW0gPSBwYXJhbXMud3JhcFMgfHwgcGFyYW1zLndyYXA7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoV1JBUF9NT0RFU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwUyA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFt0aGlzLndyYXBTXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX1dSQVBfU1xcYGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IHdyYXAgVCBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHBhcmFtID0gcGFyYW1zLndyYXBUIHx8IHBhcmFtcy53cmFwO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3JhcFQgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbdGhpcy53cmFwVF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9XUkFQX1RcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBtYWcgZmlsdGVyIHBhcmFtZXRlclxuICAgICAgICAgICAgcGFyYW0gPSBwYXJhbXMubWFnRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoTUFHX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFnRmlsdGVyID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFt0aGlzLm1hZ0ZpbHRlcl0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgJ1RFWFRVUkVfTUFHX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IG1pbiBmaWx0ZXIgcGFyYW1ldGVyXG4gICAgICAgICAgICBwYXJhbSA9IHBhcmFtcy5taW5GaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcbiAgICAgICAgICAgIGlmIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pcE1hcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTk9OX01JUE1BUF9NSU5fRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZ3JhZGUgdG8gbWlwLW1hcCBtaW4gZmlsdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbSArPSBERUZBVUxUX01JUE1BUF9NSU5fRklMVEVSX1NVRkZJWDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoTUlQTUFQX01JTl9GSUxURVJTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9NSU5fRklMVEVSXFxgYDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNSU5fRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9NSU5fRklMVEVSXFxgYDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVuYmluZCB0ZXh0dXJlXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzaXplIHRoZSB1bmRlcmx5aW5nIHRleHR1cmUuIFRoaXMgY2xlYXJzIHRoZSB0ZXh0dXJlIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSBuZXcgd2lkdGggb2YgdGhlIHRleHR1cmUuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgbmV3IGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCAod2lkdGggPD0gMCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgd2lkdGggb2YgXFxgJHt3aWR0aH1cXGAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgKGhlaWdodCA8PSAwKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKG51bGwsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRleHR1cmUyRDtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcbiAgICBsZXQgQXN5bmMgPSByZXF1aXJlKCcuLi91dGlsL0FzeW5jJyk7XG4gICAgbGV0IFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcbiAgICBsZXQgSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL0ltYWdlTG9hZGVyJyk7XG5cbiAgICBsZXQgRkFDRVMgPSBbXG4gICAgICAgICcteCcsICcreCcsXG4gICAgICAgICcteScsICcreScsXG4gICAgICAgICcteicsICcreidcbiAgICBdO1xuICAgIGxldCBGQUNFX1RBUkdFVFMgPSB7XG4gICAgICAgICcreic6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1onLFxuICAgICAgICAnLXonOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aJyxcbiAgICAgICAgJyt4JzogJ1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCcsXG4gICAgICAgICcteCc6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1gnLFxuICAgICAgICAnK3knOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZJyxcbiAgICAgICAgJy15JzogJ1RFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWSdcbiAgICB9O1xuICAgIGxldCBUQVJHRVRTID0ge1xuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1o6IHRydWUsXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWjogdHJ1ZSxcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YOiB0cnVlLFxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1g6IHRydWUsXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWTogdHJ1ZSxcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgTUFHX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IE1JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUjogdHJ1ZSxcbiAgICB9O1xuICAgIGxldCBNSVBNQVBfTUlOX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IFdSQVBfTU9ERVMgPSB7XG4gICAgICAgIFJFUEVBVDogdHJ1ZSxcbiAgICAgICAgTUlSUk9SRURfUkVQRUFUOiB0cnVlLFxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgRk9STUFUUyA9IHtcbiAgICAgICAgUkdCOiB0cnVlLFxuICAgICAgICBSR0JBOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfV1JBUCA9ICdDTEFNUF9UT19FREdFJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG1pbiAvIG1hZyBmaWx0ZXIgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0ZJTFRFUiA9ICdMSU5FQVInO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBtaXBtYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfTUlQTUFQID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGludmVydC15IGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfSU5WRVJUX1kgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgbWlwLW1hcHBpbmcgZmlsdGVyIHN1ZmZpeC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVggPSAnX01JUE1BUF9MSU5FQVInO1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjdWJlbWFwIGFuZCB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmXG4gICAgICogaXQgZG9lcyBub3QgbWVldCByZXF1aXJlbWVudHMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IGN1YmVNYXAgLSBUaGUgY3ViZSBtYXAgdGV4dHVyZSBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hlY2tEaW1lbnNpb25zKGN1YmVNYXApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjdWJlTWFwLndpZHRoICE9PSAnbnVtYmVyJyB8fCBjdWJlTWFwLndpZHRoIDw9IDApIHtcbiAgICAgICAgICAgIHRocm93ICdgd2lkdGhgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjdWJlTWFwLmhlaWdodCAhPT0gJ251bWJlcicgfHwgY3ViZU1hcC5oZWlnaHQgPD0gMCkge1xuICAgICAgICAgICAgdGhyb3cgJ2BoZWlnaHRgIGFyZ3VtZW50IGlzIG1pc3Npbmcgb3IgaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1YmVNYXAud2lkdGggIT09IGN1YmVNYXAuaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aHJvdyAnUHJvdmlkZWQgYHdpZHRoYCBtdXN0IGJlIGVxdWFsIHRvIGBoZWlnaHRgJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoVXRpbC5tdXN0QmVQb3dlck9mVHdvKGN1YmVNYXApICYmICFVdGlsLmlzUG93ZXJPZlR3byhjdWJlTWFwLndpZHRoKSkge1xuICAgICAgICAgICAgdGhyb3cgYFBhcmFtZXRlcnMgcmVxdWlyZSBhIHBvd2VyLW9mLXR3byB0ZXh0dXJlLCB5ZXQgcHJvdmlkZWQgc2l6ZSBvZiAke2N1YmVNYXAud2lkdGh9IGlzIG5vdCBhIHBvd2VyIG9mIHR3b2A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIHVybC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIGxvYWQgdGhlIGZhY2UgZnJvbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRGYWNlVVJMKGN1YmVNYXAsIHRhcmdldCwgdXJsKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBwdXQgZXh0ZW5zaW9uIGhhbmRsaW5nIGZvciBhcnJheWJ1ZmZlciAvIGltYWdlIC8gdmlkZW8gZGlmZmVyZW50aWF0aW9uXG4gICAgICAgICAgICBJbWFnZUxvYWRlci5sb2FkKHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlID0gVXRpbC5yZXNpemVDYW52YXMoY3ViZU1hcCwgaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICBjdWJlTWFwLmJ1ZmZlckRhdGEodGFyZ2V0LCBpbWFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUobnVsbCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZShlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIGEgZmFjZSBmcm9tIGEgY2FudmFzIHR5cGUgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIHRleHR1cmUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gICAgICogQHBhcmFtIHtJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBjYW52YXMgLSBUaGUgY2FudmFzIHR5cGUgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGxvYWRlciBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkRmFjZUNhbnZhcyhjdWJlTWFwLCB0YXJnZXQsIGNhbnZhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgY2FudmFzID0gVXRpbC5yZXNpemVDYW52YXMoY3ViZU1hcCwgY2FudmFzKTtcbiAgICAgICAgICAgIGN1YmVNYXAuYnVmZmVyRGF0YSh0YXJnZXQsIGNhbnZhcyk7XG4gICAgICAgICAgICBkb25lKG51bGwpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIGEgZmFjZSBmcm9tIGFuIGFycmF5IHR5cGUgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIHRleHR1cmUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQuXG4gICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGFyciAtIFRoZSBhcnJheSB0eXBlIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgbG9hZGVyIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRGYWNlQXJyYXkoY3ViZU1hcCwgdGFyZ2V0LCBhcnIpIHtcbiAgICAgICAgY2hlY2tEaW1lbnNpb25zKGN1YmVNYXApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgY3ViZU1hcC5idWZmZXJEYXRhKHRhcmdldCwgYXJyKTtcbiAgICAgICAgICAgIGRvbmUobnVsbCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFRleHR1cmVDdWJlTWFwXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgY3ViZSBtYXAgdGV4dHVyZS5cbiAgICAgKi9cbiAgICBjbGFzcyBUZXh0dXJlQ3ViZU1hcCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmVDdWJlTWFwIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHNcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMuZmFjZXMgLSBUaGUgZmFjZXMgdG8gYnVmZmVyLCB1bmRlciBrZXlzICcreCcsICcreScsICcreicsICcteCcsICcteScsIGFuZCAnLXonLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZmFjZXMuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGZhY2VzLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLnByZU11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICAgICAgdGhpcy50ZXh0dXJlID0gbnVsbDtcbiAgICAgICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgLy8gc2V0IHRleHR1cmUgcGFyYW1zXG4gICAgICAgICAgICB0aGlzLndyYXBTID0gV1JBUF9NT0RFU1tzcGVjLndyYXBTXSA/IHNwZWMud3JhcFMgOiBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICB0aGlzLndyYXBUID0gV1JBUF9NT0RFU1tzcGVjLndyYXBUXSA/IHNwZWMud3JhcFQgOiBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IE1JTl9GSUxURVJTW3NwZWMubWluRmlsdGVyXSA/IHNwZWMubWluRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IE1BR19GSUxURVJTW3NwZWMubWFnRmlsdGVyXSA/IHNwZWMubWFnRmlsdGVyIDogREVGQVVMVF9GSUxURVI7XG4gICAgICAgICAgICAvLyBzZXQgb3RoZXIgcHJvcGVydGllc1xuICAgICAgICAgICAgdGhpcy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBERUZBVUxUX01JUE1BUDtcbiAgICAgICAgICAgIHRoaXMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogREVGQVVMVF9JTlZFUlRfWTtcbiAgICAgICAgICAgIHRoaXMucHJlTXVsdGlwbHlBbHBoYSA9IHNwZWMucHJlTXVsdGlwbHlBbHBoYSAhPT0gdW5kZWZpbmVkID8gc3BlYy5wcmVNdWx0aXBseUFscGhhIDogREVGQVVMVF9QUkVNVUxUSVBMWV9BTFBIQTtcbiAgICAgICAgICAgIC8vIHNldCBmb3JtYXQgYW5kIHR5cGVcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gRk9STUFUU1tzcGVjLmZvcm1hdF0gPyBzcGVjLmZvcm1hdCA6IERFRkFVTFRfRk9STUFUO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gc3BlYy50eXBlIHx8IERFRkFVTFRfVFlQRTtcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdGTE9BVCcgJiYgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbignT0VTX3RleHR1cmVfZmxvYXQnKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY3JlYXRlIFRleHR1cmUyRCBvZiB0eXBlIGBGTE9BVGAgYXMgYE9FU190ZXh0dXJlX2Zsb2F0YCBleHRlbnNpb24gaXMgdW5zdXBwb3J0ZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGRpbWVuc2lvbnMgaWYgcHJvdmlkZWRcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBzcGVjLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBzcGVjLmhlaWdodDtcbiAgICAgICAgICAgIC8vIHNldCBidWZmZXJlZCBmYWNlc1xuICAgICAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzID0gW107XG4gICAgICAgICAgICAvLyBjcmVhdGUgY3ViZSBtYXAgYmFzZWQgb24gaW5wdXRcbiAgICAgICAgICAgIGlmIChzcGVjLmZhY2VzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRhc2tzID0gW107XG4gICAgICAgICAgICAgICAgRkFDRVMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmYWNlID0gc3BlYy5mYWNlc1tpZF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBGQUNFX1RBUkdFVFNbaWRdO1xuICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIGJhc2VkIG9uIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXJsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKGxvYWRGYWNlVVJMKHRoaXMsIHRhcmdldCwgZmFjZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWwuaXNDYW52YXNUeXBlKGZhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW52YXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2gobG9hZEZhY2VDYW52YXModGhpcywgdGFyZ2V0LCBmYWNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcnJheSAvIGFycmF5YnVmZmVyIG9yIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2gobG9hZEZhY2VBcnJheSh0aGlzLCB0YXJnZXQsIGZhY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIEFzeW5jLnBhcmFsbGVsKHRhc2tzLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgcGFyYW1ldGVyc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBudWxsXG4gICAgICAgICAgICAgICAgY2hlY2tEaW1lbnNpb25zKHRoaXMpO1xuICAgICAgICAgICAgICAgIEZBQ0VTLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoRkFDRV9UQVJHRVRTW2lkXSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHBhcmFtZXRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnModGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguIERlZmF1bHRzIHRvIDAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJpbmQobG9jYXRpb24gPSAwKSB7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobG9jYXRpb24pIHx8IGxvY2F0aW9uIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIHVuaXQgbG9jYXRpb24gaXMgaW52YWxpZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBiaW5kIGN1YmUgbWFwIHRleHR1cmVcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsWydURVhUVVJFJyArIGxvY2F0aW9uXSk7XG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0aGlzLnRleHR1cmUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmVDdWJlTWFwfSAtIFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgdW5iaW5kKCkge1xuICAgICAgICAgICAgLy8gdW5iaW5kIGN1YmUgbWFwIHRleHR1cmVcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJ1ZmZlciBkYXRhIGludG8gdGhlIHJlc3BlY3RpdmUgY3ViZSBtYXAgZmFjZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldCAtIFRoZSBmYWNlIHRhcmdldC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R8bnVsbH0gZGF0YSAtIFRoZSBmYWNlIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlckRhdGEodGFyZ2V0LCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoIVRBUkdFVFNbdGFyZ2V0XSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGB0YXJnZXRcXGAgb2YgJHt0YXJnZXR9ICBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3QgaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0XG4gICAgICAgICAgICBpZiAoIXRoaXMudGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIC8vIGludmVydCB5IGlmIHNwZWNpZmllZFxuICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdGhpcy5pbnZlcnRZKTtcbiAgICAgICAgICAgIC8vIHByZW11bHRpcGx5IGFscGhhIGlmIHNwZWNpZmllZFxuICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCB0aGlzLnByZU11bHRpcGx5QWxwaGEpO1xuICAgICAgICAgICAgLy8gY2FzdCBhcnJheSBhcmdcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQxNkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQzMkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgZW5zdXJlIHR5cGUgY29ycmVzcG9uZHMgdG8gZGF0YVxuICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDE2QXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfU0hPUlQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfSU5UJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdGTE9BVCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEgJiYgIShkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmICFVdGlsLmlzQ2FudmFzVHlwZShkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgJyArXG4gICAgICAgICAgICAgICAgICAgICdgQXJyYXlCdWZmZXJWaWV3YCwgYEltYWdlRGF0YWAsIGBIVE1MSW1hZ2VFbGVtZW50YCwgJyArXG4gICAgICAgICAgICAgICAgICAgICdgSFRNTENhbnZhc0VsZW1lbnRgLCBgSFRNTFZpZGVvRWxlbWVudGAsIG9yIG51bGwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgICAgICBpZiAoVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmVcbiAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgICAgICBnbFt0YXJnZXRdLFxuICAgICAgICAgICAgICAgICAgICAwLCAvLyBtaXAtbWFwIGxldmVsLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSB0ZXh0dXJlIGRhdGFcbiAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgICAgICBnbFt0YXJnZXRdLFxuICAgICAgICAgICAgICAgICAgICAwLCAvLyBtaXAtbWFwIGxldmVsXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSwgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRyYWNrIHRoZSBmYWNlIHRoYXQgd2FzIGJ1ZmZlcmVkXG4gICAgICAgICAgICBpZiAodGhpcy5idWZmZXJlZEZhY2VzLmluZGV4T2YodGFyZ2V0KSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXMucHVzaCh0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgYWxsIGZhY2VzIGJ1ZmZlcmVkLCBnZW5lcmF0ZSBtaXBtYXBzXG4gICAgICAgICAgICBpZiAodGhpcy5taXBNYXAgJiYgdGhpcy5idWZmZXJlZEZhY2VzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgICAgIC8vIG9ubHkgZ2VuZXJhdGUgbWlwbWFwcyBpZiBhbGwgZmFjZXMgYXJlIGJ1ZmZlcmVkXG4gICAgICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV9DVUJFX01BUCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHRleHR1cmUgcGFyYW1ldGVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIGJ5IG5hbWUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRQYXJhbWV0ZXJzKHBhcmFtcykge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIC8vIHNldCB3cmFwIFMgcGFyYW1ldGVyXG4gICAgICAgICAgICBsZXQgcGFyYW0gPSBwYXJhbXMud3JhcFMgfHwgcGFyYW1zLndyYXA7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoV1JBUF9NT0RFU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwUyA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFt0aGlzLndyYXBTXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFRleHR1cmUgcGFyYW1ldGVyIFxcYCR7cGFyYW19XFxgIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBcXGBURVhUVVJFX1dSQVBfU1xcYGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IHdyYXAgVCBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHBhcmFtID0gcGFyYW1zLndyYXBUIHx8IHBhcmFtcy53cmFwO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3JhcFQgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbdGhpcy53cmFwVF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9XUkFQX1RcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBtYWcgZmlsdGVyIHBhcmFtZXRlclxuICAgICAgICAgICAgcGFyYW0gPSBwYXJhbXMubWFnRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoTUFHX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFnRmlsdGVyID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFt0aGlzLm1hZ0ZpbHRlcl0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgJ1RFWFRVUkVfTUFHX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IG1pbiBmaWx0ZXIgcGFyYW1ldGVyXG4gICAgICAgICAgICBwYXJhbSA9IHBhcmFtcy5taW5GaWx0ZXIgfHwgcGFyYW1zLmZpbHRlcjtcbiAgICAgICAgICAgIGlmIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pcE1hcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTk9OX01JUE1BUF9NSU5fRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZ3JhZGUgdG8gbWlwLW1hcCBtaW4gZmlsdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbSArPSBERUZBVUxUX01JUE1BUF9NSU5fRklMVEVSX1NVRkZJWDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoTUlQTUFQX01JTl9GSUxURVJTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9NSU5fRklMVEVSXFxgYDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNSU5fRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9NSU5fRklMVEVSXFxgYDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVuYmluZCB0ZXh0dXJlXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlQ3ViZU1hcDtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcbiAgICBsZXQgVmVydGV4UGFja2FnZSA9IHJlcXVpcmUoJy4vVmVydGV4UGFja2FnZScpO1xuXG4gICAgbGV0IE1PREVTID0ge1xuICAgICAgICBQT0lOVFM6IHRydWUsXG4gICAgICAgIExJTkVTOiB0cnVlLFxuICAgICAgICBMSU5FX1NUUklQOiB0cnVlLFxuICAgICAgICBMSU5FX0xPT1A6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFUzogdHJ1ZSxcbiAgICAgICAgVFJJQU5HTEVfU1RSSVA6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX0ZBTjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IFRZUEVTID0ge1xuICAgICAgICBCWVRFOiB0cnVlLFxuICAgICAgICBVTlNJR05FRF9CWVRFOiB0cnVlLFxuICAgICAgICBTSE9SVDogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IHRydWUsXG4gICAgICAgIEZJWEVEOiB0cnVlLFxuICAgICAgICBGTE9BVDogdHJ1ZVxuICAgIH07XG4gICAgbGV0IEJZVEVTX1BFUl9UWVBFID0ge1xuICAgICAgICBCWVRFOiAxLFxuICAgICAgICBVTlNJR05FRF9CWVRFOiAxLFxuICAgICAgICBTSE9SVDogMixcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IDIsXG4gICAgICAgIEZJWEVEOiA0LFxuICAgICAgICBGTE9BVDogNFxuICAgIH07XG4gICAgbGV0IFNJWkVTID0ge1xuICAgICAgICAxOiB0cnVlLFxuICAgICAgICAyOiB0cnVlLFxuICAgICAgICAzOiB0cnVlLFxuICAgICAgICA0OiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGF0dHJpYnV0ZSBwb2ludCBieXRlIG9mZnNldC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCByZW5kZXIgbW9kZSAocHJpbWl0aXZlIHR5cGUpLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX01PREUgPSAnVFJJQU5HTEVTJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGluZGV4IG9mZnNldCB0byByZW5kZXIgZnJvbS5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9JTkRFWF9PRkZTRVQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgY291bnQgb2YgaW5kaWNlcyB0byByZW5kZXIuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfQ09VTlQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgZGV0ZXJtaW5lIHRoZSBieXRlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlUG9pbnRlcnMgLSBUaGUgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTdHJpZGUoYXR0cmlidXRlUG9pbnRlcnMpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUgYXR0cmlidXRlIHBvaW50ZXIgYXNzaWduZWQgdG8gdGhpcyBidWZmZXIsXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIG5lZWQgZm9yIHN0cmlkZSwgc2V0IHRvIGRlZmF1bHQgb2YgMFxuICAgICAgICBsZXQgaW5kaWNlcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZVBvaW50ZXJzKTtcbiAgICAgICAgaWYgKGluZGljZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF4Qnl0ZU9mZnNldCA9IDA7XG4gICAgICAgIGxldCBieXRlU2l6ZVN1bSA9IDA7XG4gICAgICAgIGxldCBieXRlU3RyaWRlID0gMDtcbiAgICAgICAgaW5kaWNlcy5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgICAgICAgIGxldCBwb2ludGVyID0gYXR0cmlidXRlUG9pbnRlcnNbaW5kZXhdO1xuICAgICAgICAgICAgbGV0IGJ5dGVPZmZzZXQgPSBwb2ludGVyLmJ5dGVPZmZzZXQ7XG4gICAgICAgICAgICBsZXQgc2l6ZSA9IHBvaW50ZXIuc2l6ZTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gcG9pbnRlci50eXBlO1xuICAgICAgICAgICAgLy8gdHJhY2sgdGhlIHN1bSBvZiBlYWNoIGF0dHJpYnV0ZSBzaXplXG4gICAgICAgICAgICBieXRlU2l6ZVN1bSArPSBzaXplICogQllURVNfUEVSX1RZUEVbdHlwZV07XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgbGFyZ2VzdCBvZmZzZXQgdG8gZGV0ZXJtaW5lIHRoZSBieXRlIHN0cmlkZSBvZiB0aGUgYnVmZmVyXG4gICAgICAgICAgICBpZiAoYnl0ZU9mZnNldCA+IG1heEJ5dGVPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICBtYXhCeXRlT2Zmc2V0ID0gYnl0ZU9mZnNldDtcbiAgICAgICAgICAgICAgICBieXRlU3RyaWRlID0gYnl0ZU9mZnNldCArIChzaXplICogQllURVNfUEVSX1RZUEVbdHlwZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIG1heCBieXRlIG9mZnNldCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHRoZSBzdW0gb2ZcbiAgICAgICAgLy8gdGhlIHNpemVzLiBJZiBzbyB0aGlzIGJ1ZmZlciBpcyBub3QgaW50ZXJsZWF2ZWQgYW5kIGRvZXMgbm90IG5lZWQgYVxuICAgICAgICAvLyBzdHJpZGUuXG4gICAgICAgIGlmIChtYXhCeXRlT2Zmc2V0ID49IGJ5dGVTaXplU3VtKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiB0ZXN0IHdoYXQgc3RyaWRlID09PSAwIGRvZXMgZm9yIGFuIGludGVybGVhdmVkIGJ1ZmZlciBvZlxuICAgICAgICAgICAgLy8gbGVuZ3RoID09PSAxLlxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ5dGVTdHJpZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIGF0dHJpYnV0ZSBwb2ludGVycyB0byBlbnN1cmUgdGhleSBhcmUgdmFsaWQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVQb2ludGVycyAtIFRoZSBhdHRyaWJ1dGUgcG9pbnRlciBtYXAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB2YWxpZGF0ZWQgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZVBvaW50ZXJzKGF0dHJpYnV0ZVBvaW50ZXJzKSB7XG4gICAgICAgIC8vIHBhcnNlIHBvaW50ZXJzIHRvIGVuc3VyZSB0aGV5IGFyZSB2YWxpZFxuICAgICAgICBsZXQgcG9pbnRlcnMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlUG9pbnRlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHBhcnNlSW50KGtleSwgMTApO1xuICAgICAgICAgICAgLy8gY2hlY2sgdGhhdCBrZXkgaXMgYW4gdmFsaWQgaW50ZWdlclxuICAgICAgICAgICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBBdHRyaWJ1dGUgaW5kZXggXFxgJHtrZXl9XFxgIGRvZXMgbm90IHJlcHJlc2VudCBhbiBpbnRlZ2VyYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBwb2ludGVyID0gYXR0cmlidXRlUG9pbnRlcnNba2V5XTtcbiAgICAgICAgICAgIGxldCBzaXplID0gcG9pbnRlci5zaXplO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBwb2ludGVyLnR5cGU7XG4gICAgICAgICAgICBsZXQgYnl0ZU9mZnNldCA9IHBvaW50ZXIuYnl0ZU9mZnNldDtcbiAgICAgICAgICAgIC8vIGNoZWNrIHNpemVcbiAgICAgICAgICAgIGlmICghU0laRVNbc2l6ZV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0cmlidXRlIHBvaW50ZXIgYHNpemVgIHBhcmFtZXRlciBpcyBpbnZhbGlkLCBtdXN0IGJlIG9uZSBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmtleXMoU0laRVMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHR5cGVcbiAgICAgICAgICAgIGlmICghVFlQRVNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0cmlidXRlIHBvaW50ZXIgYHR5cGVgIHBhcmFtZXRlciBpcyBpbnZhbGlkLCBtdXN0IGJlIG9uZSBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmtleXMoVFlQRVMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvaW50ZXJzW2luZGV4XSA9IHtcbiAgICAgICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgYnl0ZU9mZnNldDogKGJ5dGVPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBieXRlT2Zmc2V0IDogREVGQVVMVF9CWVRFX09GRlNFVFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwb2ludGVycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgVmVydGV4QnVmZmVyXG4gICAgICogQGNsYXNzZGVzYyBBIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGNsYXNzIFZlcnRleEJ1ZmZlciB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhbiBWZXJ0ZXhCdWZmZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1dlYkdMQnVmZmVyfFZlcnRleFBhY2thZ2V8RmxvYXQzMkFycmF5fEFycmF5fE51bWJlcn0gYXJnIC0gVGhlIGJ1ZmZlciBvciBsZW5ndGggb2YgdGhlIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGFycmF5IHBvaW50ZXIgbWFwLCBvciBpbiB0aGUgY2FzZSBvZiBhIHZlcnRleCBwYWNrYWdlIGFyZywgdGhlIG9wdGlvbnMuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIHJlbmRlcmluZyBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pbmRleE9mZnNldCAtIFRoZSBpbmRleCBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoYXJnLCBhdHRyaWJ1dGVQb2ludGVycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSBNT0RFU1tvcHRpb25zLm1vZGVdID8gb3B0aW9ucy5tb2RlIDogREVGQVVMVF9NT0RFO1xuICAgICAgICAgICAgdGhpcy5jb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IERFRkFVTFRfQ09VTlQ7XG4gICAgICAgICAgICB0aGlzLmluZGV4T2Zmc2V0ID0gKG9wdGlvbnMuaW5kZXhPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmluZGV4T2Zmc2V0IDogREVGQVVMVF9JTkRFWF9PRkZTRVQ7XG4gICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSAwO1xuICAgICAgICAgICAgLy8gZmlyc3QsIHNldCB0aGUgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgICAgICBpZiAoYXJnICYmIGFyZy5idWZmZXIgJiYgYXJnLnBvaW50ZXJzKSB7XG4gICAgICAgICAgICAgICAgLy8gVmVydGV4UGFja2FnZSBhcmd1bWVudCwgdXNlIGl0cyBhdHRyaWJ1dGUgcG9pbnRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0gYXJnLnBvaW50ZXJzO1xuICAgICAgICAgICAgICAgIC8vIHNoaWZ0IG9wdGlvbnMgYXJnIHNpbmNlIHRoZXJlIHdpbGwgYmUgbm8gYXR0cmliIHBvaW50ZXJzIGFyZ1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBhdHRyaWJ1dGVQb2ludGVycztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVycyA9IGdldEF0dHJpYnV0ZVBvaW50ZXJzKGF0dHJpYnV0ZVBvaW50ZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCB0aGUgYnl0ZSBzdHJpZGVcbiAgICAgICAgICAgIHRoaXMuYnl0ZVN0cmlkZSA9IGdldFN0cmlkZSh0aGlzLnBvaW50ZXJzKTtcbiAgICAgICAgICAgIC8vIHRoZW4gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFZlcnRleFBhY2thZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVmVydGV4UGFja2FnZSBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoYXJnLmJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZWJHTEJ1ZmZlciBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5ieXRlTGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBvZiB0eXBlIGBXZWJHTEJ1ZmZlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMuYnl0ZUxlbmd0aGAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gYXJnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBvcHRpb25zLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb3IgQXJyYXlCdWZmZXIgb3IgbnVtYmVyIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgdmVydGV4IGRhdGEgdG8gdGhlIEdQVS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd8bnVtYmVyfSBhcmcgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIsIG9yIHNpemUgb2YgdGhlIGJ1ZmZlciBpbiBieXRlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VmVydGV4QnVmZmVyfSBUaGUgdmVydGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlckRhdGEoYXJnKSB7XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgLy8gZW5zdXJlIGFyZ3VtZW50IGlzIHZhbGlkXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2FzdCBhcnJheSBpbnRvIEZsb2F0MzJBcnJheVxuICAgICAgICAgICAgICAgIGFyZyA9IG5ldyBGbG9hdDMyQXJyYXkoYXJnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgIShhcmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgJiZcbiAgICAgICAgICAgICAgICAhKEFycmF5QnVmZmVyLmlzVmlldyhhcmcpKSAmJlxuICAgICAgICAgICAgICAgICEoTnVtYmVyLmlzSW50ZWdlcihhcmcpKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBhcnJheWJ1ZmZlciBvciBhIG51bWVyaWMgc2l6ZVxuICAgICAgICAgICAgICAgIHRocm93ICdBcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYEFycmF5YCwgYEFycmF5QnVmZmVyYCwgYEFycmF5QnVmZmVyVmlld2AsIG9yIGBOdW1iZXJgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBieXRlIGxlbmd0aFxuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIoYXJnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IGFyZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gYXJnLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjcmVhdGUgYnVmZmVyIGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxuICAgICAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIGRhdGFcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgYXJnLCBnbC5TVEFUSUNfRFJBVyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBsb2FkIHBhcnRpYWwgdmVydGV4IGRhdGEgdG8gdGhlIEdQVS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGFycmF5IC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gYnl0ZU9mZnNldCAtIFRoZSBieXRlIG9mZnNldCBhdCB3aGljaCB0byBidWZmZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZlcnRleEJ1ZmZlcn0gVGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBidWZmZXJTdWJEYXRhKGFycmF5LCBieXRlT2Zmc2V0ID0gREVGQVVMVF9CWVRFX09GRlNFVCkge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGVuc3VyZSB0aGUgYnVmZmVyIGV4aXN0c1xuICAgICAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIHRocm93ICdCdWZmZXIgaGFzIG5vdCB5ZXQgYmVlbiBhbGxvY2F0ZWQsIGFsbG9jYXRlIHdpdGggJyArXG4gICAgICAgICAgICAgICAgICAgICdgYnVmZmVyRGF0YWAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZW5zdXJlIGFyZ3VtZW50IGlzIHZhbGlkXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnJheSkpIHtcbiAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoYXJyYXkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhKGFycmF5IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmXG4gICAgICAgICAgICAgICAgIUFycmF5QnVmZmVyLmlzVmlldyhhcnJheSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsICcgK1xuICAgICAgICAgICAgICAgICAgICAnb3IgYEFycmF5QnVmZmVyVmlld2AnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2hlY2sgdGhhdCB3ZSBhcmVuJ3Qgb3ZlcmZsb3dpbmcgdGhlIGJ1ZmZlclxuICAgICAgICAgICAgaWYgKGJ5dGVPZmZzZXQgKyBhcnJheS5ieXRlTGVuZ3RoID4gdGhpcy5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYEFyZ3VtZW50IG9mIGxlbmd0aCAke2FycmF5LmJ5dGVMZW5ndGh9IGJ5dGVzIHdpdGggYCArXG4gICAgICAgICAgICAgICAgICAgIGBvZmZzZXQgb2YgJHtieXRlT2Zmc2V0fSBieXRlcyBvdmVyZmxvd3MgdGhlIGJ1ZmZlciBgICtcbiAgICAgICAgICAgICAgICAgICAgYGxlbmd0aCBvZiAke3RoaXMuYnl0ZUxlbmd0aH0gYnl0ZXNgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBieXRlT2Zmc2V0LCBhcnJheSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCaW5kcyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZlcnRleEJ1ZmZlcn0gLSBSZXR1cm5zIHRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBiaW5kKCkge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGJpbmQgYnVmZmVyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuICAgICAgICAgICAgLy8gZm9yIGVhY2ggYXR0cmlidXRlIHBvaW50ZXJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMucG9pbnRlcnMpLmZvckVhY2goaW5kZXggPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwb2ludGVyID0gdGhpcy5wb2ludGVyc1tpbmRleF07XG4gICAgICAgICAgICAgICAgLy8gc2V0IGF0dHJpYnV0ZSBwb2ludGVyXG4gICAgICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXIuc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgZ2xbcG9pbnRlci50eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnl0ZVN0cmlkZSxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlci5ieXRlT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAvLyBlbmFibGUgYXR0cmlidXRlIGluZGV4XG4gICAgICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVbmJpbmRzIHRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VmVydGV4QnVmZmVyfSBUaGUgdmVydGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHVuYmluZCgpIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyB1bmJpbmQgYnVmZmVyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5wb2ludGVycykuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZGlzYWJsZSBhdHRyaWJ1dGUgaW5kZXhcbiAgICAgICAgICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSBib3VuZCBidWZmZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gcGFzcyB0byAnZHJhd0FycmF5cycuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pbmRleE9mZnNldCAtIFRoZSBpbmRleCBvZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgaW5kaWNlcyB0byBkcmF3LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgZHJhdyhvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBsZXQgbW9kZSA9IGdsW29wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGVdO1xuICAgICAgICAgICAgbGV0IGluZGV4T2Zmc2V0ID0gKG9wdGlvbnMuaW5kZXhPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmluZGV4T2Zmc2V0IDogdGhpcy5pbmRleE9mZnNldDtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IHRoaXMuY291bnQ7XG4gICAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXR0ZW1wdGluZyB0byBkcmF3IHdpdGggYSBjb3VudCBvZiAwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRyYXcgZWxlbWVudHNcbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMobW9kZSwgaW5kZXhPZmZzZXQsIGNvdW50KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhCdWZmZXI7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IENPTVBPTkVOVF9UWVBFID0gJ0ZMT0FUJztcbiAgICBsZXQgQllURVNfUEVSX0NPTVBPTkVOVCA9IDQ7XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGludmFsaWQgYXR0cmlidXRlIGFyZ3VtZW50cy4gQSB2YWxpZCBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIGxlbmd0aCA+IDAga2V5IGJ5IGEgc3RyaW5nIHJlcHJlc2VudGluZyBhbiBpbnQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIC0gVGhlIG1hcCBvZiB2ZXJ0ZXggYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgdmFsaWQgYXJyYXkgb2YgYXJndW1lbnRzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlQXR0cmlidXRlTWFwKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgbGV0IGdvb2RBdHRyaWJ1dGVzID0gW107XG4gICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHBhcnNlRmxvYXQoa2V5KTtcbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQga2V5IGlzIGFuIHZhbGlkIGludGVnZXJcbiAgICAgICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYEF0dHJpYnV0ZSBpbmRleCBcXGAke2tleX1cXGAgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsaWQgaW50ZWdlcmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmVydGljZXMgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICAvLyBlbnN1cmUgYXR0cmlidXRlIGlzIHZhbGlkXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2ZXJ0aWNlcykgJiYgdmVydGljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIGFkZCBhdHRyaWJ1dGUgZGF0YSBhbmQgaW5kZXhcbiAgICAgICAgICAgICAgICBnb29kQXR0cmlidXRlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2ZXJ0aWNlc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgRXJyb3IgcGFyc2luZyBhdHRyaWJ1dGUgb2YgaW5kZXggXFxgJHtpbmRleH1cXGBgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gc29ydCBhdHRyaWJ1dGVzIGFzY2VuZGluZyBieSBpbmRleFxuICAgICAgICBnb29kQXR0cmlidXRlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZ29vZEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGNvbXBvbmVudCdzIGJ5dGUgc2l6ZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbXBvbmVudCAtIFRoZSBjb21wb25lbnQgdG8gbWVhc3VyZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGJ5dGUgc2l6ZSBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudFNpemUoY29tcG9uZW50KSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIGFycmF5XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIGlmIHZlY3RvclxuICAgICAgICBpZiAoY29tcG9uZW50LnggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gMSBjb21wb25lbnQgdmVjdG9yXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIDIgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQueiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDMgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LncgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNCBjb21wb25lbnQgdmVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzaW5nbGUgY29tcG9uZW50XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIHR5cGUsIHNpemUsIGFuZCBvZmZzZXQgZm9yIGVhY2ggYXR0cmlidXRlIGluIHRoZSBhdHRyaWJ1dGUgYXJyYXkgYWxvbmcgd2l0aCB0aGUgbGVuZ3RoIGFuZCBzdHJpZGUgb2YgdGhlIHBhY2thZ2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VmVydGV4UGFja2FnZX0gdmVydGV4UGFja2FnZSAtIFRoZSBWZXJ0ZXhQYWNrYWdlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIFRoZSBhcnJheSBvZiB2ZXJ0ZXggYXR0cmlidXRlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRQb2ludGVyc0FuZFN0cmlkZSh2ZXJ0ZXhQYWNrYWdlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGxldCBzaG9ydGVzdEFycmF5ID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICAgIC8vIGNsZWFyIHBvaW50ZXJzXG4gICAgICAgIHZlcnRleFBhY2thZ2UucG9pbnRlcnMgPSB7fTtcbiAgICAgICAgLy8gZm9yIGVhY2ggYXR0cmlidXRlXG4gICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCh2ZXJ0aWNlcyA9PiB7XG4gICAgICAgICAgICAvLyBzZXQgc2l6ZSB0byBudW1iZXIgb2YgY29tcG9uZW50cyBpbiB0aGUgYXR0cmlidXRlXG4gICAgICAgICAgICBsZXQgc2l6ZSA9IGdldENvbXBvbmVudFNpemUodmVydGljZXMuZGF0YVswXSk7XG4gICAgICAgICAgICAvLyBsZW5ndGggb2YgdGhlIHBhY2thZ2Ugd2lsbCBiZSB0aGUgc2hvcnRlc3QgYXR0cmlidXRlIGFycmF5IGxlbmd0aFxuICAgICAgICAgICAgc2hvcnRlc3RBcnJheSA9IE1hdGgubWluKHNob3J0ZXN0QXJyYXksIHZlcnRpY2VzLmRhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vIHN0b3JlIHBvaW50ZXIgdW5kZXIgaW5kZXhcbiAgICAgICAgICAgIHZlcnRleFBhY2thZ2UucG9pbnRlcnNbdmVydGljZXMuaW5kZXhdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IENPTVBPTkVOVF9UWVBFLFxuICAgICAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICAgICAgYnl0ZU9mZnNldDogb2Zmc2V0ICogQllURVNfUEVSX0NPTVBPTkVOVFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGFjY3VtdWxhdGUgYXR0cmlidXRlIG9mZnNldFxuICAgICAgICAgICAgb2Zmc2V0ICs9IHNpemU7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBzZXQgc3RyaWRlIHRvIHRvdGFsIG9mZnNldFxuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnN0cmlkZSA9IG9mZnNldDsgLy8gbm90IGluIGJ5dGVzXG4gICAgICAgIC8vIHNldCBsZW5ndGggb2YgcGFja2FnZSB0byB0aGUgc2hvcnRlc3QgYXR0cmlidXRlIGFycmF5IGxlbmd0aFxuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLmxlbmd0aCA9IHNob3J0ZXN0QXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHNpbmdsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQxQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG4gICAgICAgIGxldCB2ZXJ0ZXgsIGksIGo7XG4gICAgICAgIGZvciAoaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoc3RyaWRlICogaSk7XG4gICAgICAgICAgICBpZiAodmVydGV4LnggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGJ1ZmZlcltqXSA9IHZlcnRleC54O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2ZXJ0ZXhbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGJ1ZmZlcltqXSA9IHZlcnRleFswXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyW2pdID0gdmVydGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIGRvdWJsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQyQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG4gICAgICAgIGxldCB2ZXJ0ZXgsIGksIGo7XG4gICAgICAgIGZvciAoaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoc3RyaWRlICogaSk7XG4gICAgICAgICAgICBidWZmZXJbal0gPSAodmVydGV4LnggIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgdHJpcGxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLCBub3QgaW4gYnl0ZXMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlciwgbm90IGluIGJ5dGVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldDNDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpIHtcbiAgICAgICAgbGV0IHZlcnRleCwgaSwgajtcbiAgICAgICAgZm9yIChpPTA7IGk8bGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZlcnRleCA9IHZlcnRpY2VzW2ldO1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiB0aGUgYnVmZmVyIHRvIHRoZSBwYXJ0aWN1bGFyIHZlcnRleFxuICAgICAgICAgICAgaiA9IG9mZnNldCArIChzdHJpZGUgKiBpKTtcbiAgICAgICAgICAgIGJ1ZmZlcltqXSA9ICh2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC54IDogdmVydGV4WzBdO1xuICAgICAgICAgICAgYnVmZmVyW2orMV0gPSAodmVydGV4LnkgIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzJdID0gKHZlcnRleC56ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnogOiB2ZXJ0ZXhbMl07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWxsIHRoZSBhcnJheWJ1ZmZlciB3aXRoIGEgcXVhZHJ1cGxlIGNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBidWZmZXIgLSBUaGUgYXJyYXlidWZmZXIgdG8gZmlsbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2ZXJ0aWNlcyAtIFRoZSB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5IHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYnVmZmVyIHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gVGhlIG9mZnNldCB0byB0aGUgYXR0cmlidXRlLCBub3QgaW4gYnl0ZXMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSAtIFRoZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlciwgbm90IGluIGJ5dGVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldDRDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpIHtcbiAgICAgICAgbGV0IHZlcnRleCwgaSwgajtcbiAgICAgICAgZm9yIChpPTA7IGk8bGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZlcnRleCA9IHZlcnRpY2VzW2ldO1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiB0aGUgYnVmZmVyIHRvIHRoZSBwYXJ0aWN1bGFyIHZlcnRleFxuICAgICAgICAgICAgaiA9IG9mZnNldCArIChzdHJpZGUgKiBpKTtcbiAgICAgICAgICAgIGJ1ZmZlcltqXSA9ICh2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC54IDogdmVydGV4WzBdO1xuICAgICAgICAgICAgYnVmZmVyW2orMV0gPSAodmVydGV4LnkgIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzJdID0gKHZlcnRleC56ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnogOiB2ZXJ0ZXhbMl07XG4gICAgICAgICAgICBidWZmZXJbaiszXSA9ICh2ZXJ0ZXgudyAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC53IDogdmVydGV4WzNdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFZlcnRleFBhY2thZ2VcbiAgICAgKiBAY2xhc3NkZXNjIEEgdmVydGV4IHBhY2thZ2UgdG8gYXNzaXN0IGluIGludGVybGVhdmluZyB2ZXJ0ZXggZGF0YSBhbmQgYnVpbGRpbmcgdGhlIGFzc29jaWF0ZWQgdmVydGV4IGF0dHJpYnV0ZSBwb2ludGVycy5cbiAgICAgKi9cbiAgICBjbGFzcyBWZXJ0ZXhQYWNrYWdlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zdGFudGlhdGVzIGEgVmVydGV4UGFja2FnZSBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBhdHRyaWJ1dGVzIHRvIGludGVybGVhdmUga2V5ZWQgYnkgaW5kZXguXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSgwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJzID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBkYXRhIHRvIGJlIGludGVybGVhdmVkIGluc2lkZSB0aGUgcGFja2FnZS4gVGhpcyBjbGVhcnMgYW55IHByZXZpb3VzbHkgZXhpc3RpbmcgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlcyB0byBpbnRlcmxlYXZlZCwga2V5ZWQgYnkgaW5kZXguXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZlcnRleFBhY2thZ2V9IFRoZSB2ZXJ0ZXggcGFja2FnZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHNldChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgYmFkIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBwYXJzZUF0dHJpYnV0ZU1hcChhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIC8vIHNldCBhdHRyaWJ1dGUgcG9pbnRlcnMgYW5kIHN0cmlkZVxuICAgICAgICAgICAgc2V0UG9pbnRlcnNBbmRTdHJpZGUodGhpcywgYXR0cmlidXRlcyk7XG4gICAgICAgICAgICAvLyBzZXQgc2l6ZSBvZiBkYXRhIHZlY3RvclxuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IHN0cmlkZSA9IHRoaXMuc3RyaWRlOyAvLyBub3QgaW4gYnl0ZXNcbiAgICAgICAgICAgIGxldCBwb2ludGVycyA9IHRoaXMucG9pbnRlcnM7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIHN0cmlkZSk7XG4gICAgICAgICAgICAvLyBmb3IgZWFjaCB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2godmVydGljZXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlclxuICAgICAgICAgICAgICAgIGxldCBwb2ludGVyID0gcG9pbnRlcnNbdmVydGljZXMuaW5kZXhdO1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlcnMgb2Zmc2V0XG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IHBvaW50ZXIuYnl0ZU9mZnNldCAvIEJZVEVTX1BFUl9DT01QT05FTlQ7XG4gICAgICAgICAgICAgICAgLy8gY29weSB2ZXJ0ZXggZGF0YSBpbnRvIGFycmF5YnVmZmVyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwb2ludGVyLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0MkNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQzQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldDRDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldDFDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhQYWNrYWdlO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG5cbiAgICAvKipcbiAgICAgKiBCaW5kIHRoZSB2aWV3cG9ydCB0byB0aGUgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1ZpZXdwb3J0fSB2aWV3cG9ydCAtIFRoZSB2aWV3cG9ydCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG92ZXJyaWRlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG92ZXJyaWRlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIGhvcml6b250YWwgb2Zmc2V0IG92ZXJyaWRlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVGhlIHZlcnRpY2FsIG9mZnNldCBvdmVycmlkZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQodmlld3BvcnQsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgbGV0IGdsID0gdmlld3BvcnQuZ2w7XG4gICAgICAgIHggPSAoeCAhPT0gdW5kZWZpbmVkKSA/IHggOiB2aWV3cG9ydC54O1xuICAgICAgICB5ID0gKHkgIT09IHVuZGVmaW5lZCkgPyB5IDogdmlld3BvcnQueTtcbiAgICAgICAgd2lkdGggPSAod2lkdGggIT09IHVuZGVmaW5lZCkgPyB3aWR0aCA6IHZpZXdwb3J0LndpZHRoO1xuICAgICAgICBoZWlnaHQgPSAoaGVpZ2h0ICE9PSB1bmRlZmluZWQpID8gaGVpZ2h0IDogdmlld3BvcnQuaGVpZ2h0O1xuICAgICAgICBnbC52aWV3cG9ydCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgVmlld3BvcnRcbiAgICAgKiBAY2xhc3NkZXNjIEEgdmlld3BvcnQgY2xhc3MgZm9yIG1hbmFnaW5nIFdlYkdMIHZpZXdwb3J0cy5cbiAgICAgKi9cbiAgICBjbGFzcyBWaWV3cG9ydCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIFZpZXdwb3J0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdmlld3BvcnQgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgICAgICAvLyBzZXQgc2l6ZVxuICAgICAgICAgICAgdGhpcy5yZXNpemUoXG4gICAgICAgICAgICAgICAgc3BlYy53aWR0aCB8fCB0aGlzLmdsLmNhbnZhcy53aWR0aCxcbiAgICAgICAgICAgICAgICBzcGVjLmhlaWdodCB8fCB0aGlzLmdsLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgdGhlIHZpZXdwb3J0cyB3aWR0aCBhbmQgaGVpZ2h0LiBUaGlzIHJlc2l6ZXMgdGhlIHVuZGVybHlpbmcgY2FudmFzIGVsZW1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZSh3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHdpZHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgd2lkdGhcXGAgb2YgXFxgJHt3aWR0aH1cXGAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5nbC5jYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuZ2wuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHZpZXdwb3J0IGRpbWVuc2lvbnMgYW5kIHBvc2l0aW9uLiBUaGUgdW5kZXJseWluZyBjYW52YXMgZWxlbWVudCBpcyBub3QgYWZmZWN0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb3ZlcnJpZGUuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIGhvcml6b250YWwgb2Zmc2V0IG92ZXJyaWRlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZpZXdwb3J0fSAtIFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHB1c2goeCA9IDAsIHkgPSAwLCB3aWR0aCA9IHRoaXMud2lkdGgsIGhlaWdodCA9IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHggIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIFxcYHhcXGAgb2YgXFxgJHt4fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgeSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgeVxcYCBvZiBcXGAke3l9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgd2lkdGggPD0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGB3aWR0aFxcYCBvZiBcXGAke3dpZHRofVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCBoZWlnaHQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGBoZWlnaHRcXGAgb2YgXFxgJHtoZWlnaHR9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcHVzaCBvbnRvIHN0YWNrXG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gc2V0IHZpZXdwb3J0XG4gICAgICAgICAgICBzZXQodGhpcywgeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQb3BzIGN1cnJlbnQgdGhlIHZpZXdwb3J0IG9iamVjdCBhbmQgc2V0cyB0aGUgdmlld3BvcnQgYmVuZWF0aCBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHBvcCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdWaWV3cG9ydCBzdGFjayBpcyBlbXB0eSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCB0b3AgPSB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgc2V0KHRoaXMsIHRvcC54LCB0b3AueSwgdG9wLndpZHRoLCB0b3AuaGVpZ2h0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZpZXdwb3J0O1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IEVYVEVOU0lPTlMgPSBbXG4gICAgICAgIC8vIHJhdGlmaWVkXG4gICAgICAgICdPRVNfdGV4dHVyZV9mbG9hdCcsXG4gICAgICAgICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0JyxcbiAgICAgICAgJ1dFQkdMX2xvc2VfY29udGV4dCcsXG4gICAgICAgICdPRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgICAnT0VTX3ZlcnRleF9hcnJheV9vYmplY3QnLFxuICAgICAgICAnV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycsXG4gICAgICAgICdXRUJHTF9kZWJ1Z19zaGFkZXJzJyxcbiAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjJyxcbiAgICAgICAgJ1dFQkdMX2RlcHRoX3RleHR1cmUnLFxuICAgICAgICAnT0VTX2VsZW1lbnRfaW5kZXhfdWludCcsXG4gICAgICAgICdFWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMnLFxuICAgICAgICAnRVhUX2ZyYWdfZGVwdGgnLFxuICAgICAgICAnV0VCR0xfZHJhd19idWZmZXJzJyxcbiAgICAgICAgJ0FOR0xFX2luc3RhbmNlZF9hcnJheXMnLFxuICAgICAgICAnT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyJyxcbiAgICAgICAgJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJyxcbiAgICAgICAgJ0VYVF9ibGVuZF9taW5tYXgnLFxuICAgICAgICAnRVhUX3NoYWRlcl90ZXh0dXJlX2xvZCcsXG4gICAgICAgIC8vIGNvbW11bml0eVxuICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2F0YycsXG4gICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMnLFxuICAgICAgICAnRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0JyxcbiAgICAgICAgJ1dFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCcsXG4gICAgICAgICdFWFRfc1JHQicsXG4gICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMScsXG4gICAgICAgICdFWFRfZGlzam9pbnRfdGltZXJfcXVlcnknLFxuICAgICAgICAnRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdCdcbiAgICBdO1xuXG4gICAgbGV0IF9ib3VuZENvbnRleHQgPSBudWxsO1xuICAgIGxldCBfY29udGV4dHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gcmZjNDEyMiB2ZXJzaW9uIDQgY29tcGxpYW50IFVVSUQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gLSBUaGUgVVVJRCBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VVVJRCgpIHtcbiAgICAgICAgbGV0IHJlcGxhY2UgPSBmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICBsZXQgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgICAgICAgICBsZXQgdiA9IChjID09PSAneCcpID8gciA6IChyICYgMHgzIHwgMHg4KTtcbiAgICAgICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIEhUTUxDYW52YXNFbGVtZW50IGVsZW1lbnQuIElmIHRoZXJlIGlzIG5vIGlkLCBpdCBnZW5lcmF0ZXMgb25lIGFuZCBhcHBlbmRzIGl0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBUaGUgQ2FudmFzIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIENhbnZhcyBpZCBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0SWQoY2FudmFzKSB7XG4gICAgICAgIGlmICghY2FudmFzLmlkKSB7XG4gICAgICAgICAgICBjYW52YXMuaWQgPSBnZXRVVUlEKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbnZhcy5pZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IGZyb20gZWl0aGVyIGFuIGV4aXN0aW5nIG9iamVjdCwgb3IgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkIG9yIHNlbGVjdG9yIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENhbnZhcyhhcmcpIHtcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXJnKSB8fFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYXJnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byByZXRyaWV2ZSBhIHdyYXBwZWQgV2ViR0xSZW5kZXJpbmdDb250ZXh0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IHRvIGNyZWF0ZSB0aGUgY29udGV4dCB1bmRlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRDb250ZXh0V3JhcHBlcihhcmcpIHtcbiAgICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoX2JvdW5kQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBsYXN0IGJvdW5kIGNvbnRleHRcbiAgICAgICAgICAgICAgICByZXR1cm4gX2JvdW5kQ29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBnZXRDYW52YXMoYXJnKTtcbiAgICAgICAgICAgIGlmIChjYW52YXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHRzW2dldElkKGNhbnZhcyldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG5vIGJvdW5kIGNvbnRleHQgb3IgYXJndW1lbnRcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhbGwga25vd24gZXh0ZW5zaW9ucyBmb3IgYSBwcm92aWRlZCBXZWJHTFJlbmRlcmluZ0NvbnRleHQuIFN0b3JlcyB0aGUgcmVzdWx0cyBpbiB0aGUgY29udGV4dCB3cmFwcGVyIGZvciBsYXRlciBxdWVyaWVzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFdyYXBwZXIgLSBUaGUgY29udGV4dCB3cmFwcGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRFeHRlbnNpb25zKGNvbnRleHRXcmFwcGVyKSB7XG4gICAgICAgIGxldCBnbCA9IGNvbnRleHRXcmFwcGVyLmdsO1xuICAgICAgICBFWFRFTlNJT05TLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgY29udGV4dFdyYXBwZXIuZXh0ZW5zaW9uc1tpZF0gPSBnbC5nZXRFeHRlbnNpb24oaWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byBjcmVhdGUgYSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgYW5kIGxvYWQgYWxsIGV4dGVuc2lvbnMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IC0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdCB0byBjcmVhdGUgdGhlIGNvbnRleHQgdW5kZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R9fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVDb250ZXh0V3JhcHBlcihjYW52YXMsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJywgb3B0aW9ucykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdGlvbnMpO1xuICAgICAgICAvLyB3cmFwIGNvbnRleHRcbiAgICAgICAgbGV0IGNvbnRleHRXcmFwcGVyID0ge1xuICAgICAgICAgICAgaWQ6IGdldElkKGNhbnZhcyksXG4gICAgICAgICAgICBnbDogZ2wsXG4gICAgICAgICAgICBleHRlbnNpb25zOiB7fVxuICAgICAgICB9O1xuICAgICAgICAvLyBsb2FkIFdlYkdMIGV4dGVuc2lvbnNcbiAgICAgICAgbG9hZEV4dGVuc2lvbnMoY29udGV4dFdyYXBwZXIpO1xuICAgICAgICAvLyBhZGQgY29udGV4dCB3cmFwcGVyIHRvIG1hcFxuICAgICAgICBfY29udGV4dHNbZ2V0SWQoY2FudmFzKV0gPSBjb250ZXh0V3JhcHBlcjtcbiAgICAgICAgLy8gYmluZCB0aGUgY29udGV4dFxuICAgICAgICBfYm91bmRDb250ZXh0ID0gY29udGV4dFdyYXBwZXI7XG4gICAgICAgIHJldHVybiBjb250ZXh0V3JhcHBlcjtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0cmlldmVzIGFuIGV4aXN0aW5nIFdlYkdMIGNvbnRleHQgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudCBhbmQgYmluZHMgaXQuIFdoaWxlIGJvdW5kLCB0aGUgYWN0aXZlIGNvbnRleHQgd2lsbCBiZSB1c2VkIGltcGxpY2l0bHkgYnkgYW55IGluc3RhbnRpYXRlZCBgZXNwZXJgIGNvbnN0cnVjdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtXZWJHTENvbnRleHR9IFRoZSBuYW1lc3BhY2UsIHVzZWQgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYmluZDogZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgICBsZXQgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG4gICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgIF9ib3VuZENvbnRleHQgPSB3cmFwcGVyO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgYE5vIGNvbnRleHQgZXhpc3RzIGZvciBwcm92aWRlZCBhcmd1bWVudCAnJHthcmd9J2A7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQuIElmIG5vIGNvbnRleHQgZXhpc3RzLCBvbmUgaXMgY3JlYXRlZC5cbiAgICAgICAgICogRHVyaW5nIGNyZWF0aW9uIGF0dGVtcHRzIHRvIGxvYWQgYWxsIGV4dGVuc2lvbnMgZm91bmQgYXQ6IGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBUaGUgV2ViR0xSZW5kZXJpbmdDb250ZXh0IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24oYXJnLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBsZXQgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG4gICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBuYXRpdmUgV2ViR0xSZW5kZXJpbmdDb250ZXh0XG4gICAgICAgICAgICAgICByZXR1cm4gd3JhcHBlci5nbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGdldCBjYW52YXMgZWxlbWVudFxuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGdldENhbnZhcyhhcmcpO1xuICAgICAgICAgICAgLy8gdHJ5IHRvIGZpbmQgb3IgY3JlYXRlIGNvbnRleHRcbiAgICAgICAgICAgIGlmICghY2FudmFzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3JlYXRlIGNvbnRleHRcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb250ZXh0V3JhcHBlcihjYW52YXMsIG9wdGlvbnMpLmdsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIGFuIGV4aXN0aW5nIFdlYkdMIGNvbnRleHQgb2JqZWN0IGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fX0gb3B0aW9ucyAtIFBhcmFtZXRlcnMgdG8gdGhlIHdlYmdsIGNvbnRleHQsIG9ubHkgdXNlZCBkdXJpbmcgaW5zdGFudGlhdGlvbi4gT3B0aW9uYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gVGhlIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgdGhlIGNvbnRleHRcbiAgICAgICAgICAgICAgICBkZWxldGUgX2NvbnRleHRzW3dyYXBwZXIuaWRdO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpZiBjdXJyZW50bHkgYm91bmRcbiAgICAgICAgICAgICAgICBpZiAod3JhcHBlciA9PT0gX2JvdW5kQ29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBfYm91bmRDb250ZXh0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc3VwcG9ydGVkIGV4dGVuc2lvbnMgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IEFsbCBzdXBwb3J0ZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIHN1cHBvcnRlZEV4dGVuc2lvbnM6IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXh0ZW5zaW9ucyA9IHdyYXBwZXIuZXh0ZW5zaW9ucztcbiAgICAgICAgICAgICAgICBsZXQgc3VwcG9ydGVkID0gW107XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZXh0ZW5zaW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnNba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VwcG9ydGVkLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBwb3J0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBgTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHByb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgJHt0eXBlb2YgYXJnfWA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHVuc3VwcG9ydGVkIGV4dGVuc2lvbnMgZm9yIHRoZSBwcm92aWRlZCBvciBjdXJyZW50bHkgYm91bmQgY29udGV4dCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IEFsbCB1bnN1cHBvcnRlZCBleHRlbnNpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgdW5zdXBwb3J0ZWRFeHRlbnNpb25zOiBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICAgIGxldCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcbiAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgbGV0IHVuc3VwcG9ydGVkID0gW107XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZXh0ZW5zaW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFleHRlbnNpb25zW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuc3VwcG9ydGVkLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB1bnN1cHBvcnRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIGFuIGV4dGVuc2lvbiBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb24gLSBUaGUgZXh0ZW5zaW9uIG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBwcm92aWRlZCBleHRlbnNpb24gaGFzIGJlZW4gbG9hZGVkIHN1Y2Nlc3NmdWxseS5cbiAgICAgICAgICovXG4gICAgICAgIGNoZWNrRXh0ZW5zaW9uOiBmdW5jdGlvbihhcmcsIGV4dGVuc2lvbikge1xuICAgICAgICAgICAgaWYgKCFleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAvLyBzaGlmdCBwYXJhbWV0ZXJzIGlmIG5vIGNhbnZhcyBhcmcgaXMgcHJvdmlkZWRcbiAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBhcmc7XG4gICAgICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXh0ZW5zaW9ucyA9IHdyYXBwZXIuZXh0ZW5zaW9ucztcbiAgICAgICAgICAgICAgICByZXR1cm4gZXh0ZW5zaW9uc1tleHRlbnNpb25dID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBpZiBpdCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb24gLSBUaGUgZXh0ZW5zaW9uIG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBwcm92aWRlZCBleHRlbnNpb24gaGFzIGJlZW4gbG9hZGVkIHN1Y2Nlc3NmdWxseS5cbiAgICAgICAgICovXG4gICAgICAgIGdldEV4dGVuc2lvbjogZnVuY3Rpb24oYXJnLCBleHRlbnNpb24pIHtcbiAgICAgICAgICAgIGlmICghZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gYXJnO1xuICAgICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcbiAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4dGVuc2lvbnNbZXh0ZW5zaW9uXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuICAgICAgICB9XG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgIEluZGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvSW5kZXhCdWZmZXInKSxcclxuICAgICAgICBSZW5kZXJhYmxlOiByZXF1aXJlKCcuL2NvcmUvUmVuZGVyYWJsZScpLFxyXG4gICAgICAgIFJlbmRlclRhcmdldDogcmVxdWlyZSgnLi9jb3JlL1JlbmRlclRhcmdldCcpLFxyXG4gICAgICAgIFNoYWRlcjogcmVxdWlyZSgnLi9jb3JlL1NoYWRlcicpLFxyXG4gICAgICAgIFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL1RleHR1cmUyRCcpLFxyXG4gICAgICAgIENvbG9yVGV4dHVyZTJEOiByZXF1aXJlKCcuL2NvcmUvQ29sb3JUZXh0dXJlMkQnKSxcclxuICAgICAgICBEZXB0aFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL0RlcHRoVGV4dHVyZTJEJyksXHJcbiAgICAgICAgVGV4dHVyZUN1YmVNYXA6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlQ3ViZU1hcCcpLFxyXG4gICAgICAgIFZlcnRleEJ1ZmZlcjogcmVxdWlyZSgnLi9jb3JlL1ZlcnRleEJ1ZmZlcicpLFxyXG4gICAgICAgIFZlcnRleFBhY2thZ2U6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhQYWNrYWdlJyksXHJcbiAgICAgICAgVmlld3BvcnQ6IHJlcXVpcmUoJy4vY29yZS9WaWV3cG9ydCcpLFxyXG4gICAgICAgIFdlYkdMQ29udGV4dDogcmVxdWlyZSgnLi9jb3JlL1dlYkdMQ29udGV4dCcpXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIGdldEl0ZXJhdG9yKGFyZykge1xuICAgICAgICBsZXQgaSA9IC0xO1xuICAgICAgICBsZXQgbGVuO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICBsZW4gPSBhcmcubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGkgOiBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGFyZyk7XG4gICAgICAgIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGtleXNbaV0gOiBudWxsO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGZuID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGZuID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlYWNoKG9iamVjdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gb25jZShjYWxsYmFjayk7XG4gICAgICAgIGxldCBrZXk7XG4gICAgICAgIGxldCBjb21wbGV0ZWQgPSAwO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRvbmUoZXJyKSB7XG4gICAgICAgICAgICBjb21wbGV0ZWQtLTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IG51bGwgJiYgY29tcGxldGVkIDw9IDApIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBrZXkgaXMgbnVsbCBpbiBjYXNlIGl0ZXJhdG9yIGlzbid0IGV4aGF1c3RlZCBhbmQgZG9uZVxuICAgICAgICAgICAgICAgIC8vIHdhcyByZXNvbHZlZCBzeW5jaHJvbm91c2x5LlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGl0ZXIgPSBnZXRJdGVyYXRvcihvYmplY3QpO1xuICAgICAgICB3aGlsZSAoKGtleSA9IGl0ZXIoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgaXRlcmF0b3Iob2JqZWN0W2tleV0sIGtleSwgZG9uZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBsZXRlZCA9PT0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBhIHNldCBvZiBmdW5jdGlvbnMgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIGhhdmUgYmVlblxuICAgICAgICAgKiBjb21wbGV0ZWQsIGV4ZWN1dGUgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLiBKb2JzIG1heSBiZSBwYXNzZWRcbiAgICAgICAgICogYXMgYW4gYXJyYXkgb3Igb2JqZWN0LiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gd2lsbCBiZSBwYXNzZWQgdGhlXG4gICAgICAgICAqIHJlc3VsdHMgaW4gdGhlIHNhbWUgZm9ybWF0IGFzIHRoZSB0YXNrcy4gQWxsIHRhc2tzIG11c3QgaGF2ZSBhY2NlcHRcbiAgICAgICAgICogYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSB0YXNrcyAtIFRoZSBzZXQgb2YgZnVuY3Rpb25zIHRvIGV4ZWN1dGUuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHVwb24gY29tcGxldGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHBhcmFsbGVsOiBmdW5jdGlvbih0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gQXJyYXkuaXNBcnJheSh0YXNrcykgPyBbXSA6IHt9O1xuICAgICAgICAgICAgZWFjaCh0YXNrcywgZnVuY3Rpb24odGFzaywga2V5LCBkb25lKSB7XG4gICAgICAgICAgICAgICAgdGFzayhmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2tleV0gPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kcyBhbiBHRVQgcmVxdWVzdCBjcmVhdGUgYW4gSW1hZ2Ugb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBYSFIgb3B0aW9ucy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudXJsIC0gVGhlIFVSTCBmb3IgdGhlIHJlc291cmNlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnN1Y2Nlc3MgLSBUaGUgc3VjY2VzcyBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5lcnJvciAtIFRoZSBlcnJvciBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKGltYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1hZ2Uub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnIgPSAnVW5hYmxlIHRvIGxvYWQgaW1hZ2UgZnJvbSBVUkw6IGAnICsgZXZlbnQucGF0aFswXS5jdXJyZW50U3JjICsgJ2AnO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IG9wdGlvbnMudXJsO1xuICAgICAgICB9XG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgVXRpbCA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBhcmd1bWVudCBpcyBvbmUgb2YgdGhlIFdlYkdMIGB0ZXhJbWFnZTJEYCBvdmVycmlkZGVuXG4gICAgICogY2FudmFzIHR5cGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBhcmcgLSBUaGUgYXJndW1lbnQgdG8gdGVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2x9IC0gV2hldGhlciBvciBub3QgaXQgaXMgYSBjYW52YXMgdHlwZS5cbiAgICAgKi9cbiAgICBVdGlsLmlzQ2FudmFzVHlwZSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gYXJnIGluc3RhbmNlb2YgSW1hZ2VEYXRhIHx8XG4gICAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50IHx8XG4gICAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCB8fFxuICAgICAgICAgICAgYXJnIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXh0dXJlIE1VU1QgYmUgYSBwb3dlci1vZi10d28uIE90aGVyd2lzZSByZXR1cm4gZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB0ZXh0dXJlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbH0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgdGV4dHVyZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvLlxuICAgICAqL1xuICAgIFV0aWwubXVzdEJlUG93ZXJPZlR3byA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvOlxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViR0xfQVBJL1R1dG9yaWFsL1VzaW5nX3RleHR1cmVzX2luX1dlYkdMI05vbl9wb3dlci1vZi10d29fdGV4dHVyZXNcbiAgICAgICAgLy8gTi1QT1QgdGV4dHVyZXMgY2Fubm90IGJlIHVzZWQgd2l0aCBtaXBtYXBwaW5nIGFuZCB0aGV5IG11c3Qgbm90IFwiUkVQRUFUXCJcbiAgICAgICAgcmV0dXJuIHNwZWMubWlwTWFwIHx8XG4gICAgICAgICAgICBzcGVjLndyYXBTID09PSAnUkVQRUFUJyB8fFxuICAgICAgICAgICAgc3BlYy53cmFwUyA9PT0gJ01JUlJPUkVEX1JFUEVBVCcgfHxcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPT09ICdSRVBFQVQnIHx8XG4gICAgICAgICAgICBzcGVjLndyYXBUID09PSAnTUlSUk9SRURfUkVQRUFUJztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBpbnRlZ2VyIGlzIGEgcG93ZXIgb2YgdHdvLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bSAtIFRoZSBudW1iZXIgdG8gdGVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIG51bWJlciBpcyBhIHBvd2VyIG9mIHR3by5cbiAgICAgKi9cbiAgICBVdGlsLmlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICByZXR1cm4gKG51bSAhPT0gMCkgPyAobnVtICYgKG51bSAtIDEpKSA9PT0gMCA6IGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvIGZvciBhIG51bWJlci5cbiAgICAgKlxuICAgICAqIEV4LlxuICAgICAqXG4gICAgICogICAgIDIwMCAtPiAyNTZcbiAgICAgKiAgICAgMjU2IC0+IDI1NlxuICAgICAqICAgICAyNTcgLT4gNTEyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtIC0gVGhlIG51bWJlciB0byBtb2RpZnkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gTmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3by5cbiAgICAgKi9cbiAgICBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICBsZXQgaTtcbiAgICAgICAgaWYgKG51bSAhPT0gMCkge1xuICAgICAgICAgICAgbnVtID0gbnVtLTE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpPTE7IGk8MzI7IGk8PD0xKSB7XG4gICAgICAgICAgICBudW0gPSBudW0gfCBudW0gPj4gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVtICsgMTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHRleHR1cmUgbXVzdCBiZSBhIFBPVCwgcmVzaXplcyBhbmQgcmV0dXJucyB0aGUgaW1hZ2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHRleHR1cmUgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWcgLSBUaGUgaW1hZ2Ugb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudH0gLSBUaGUgb3JpZ2luYWwgaW1hZ2UsIG9yIHRoZSByZXNpemVkIGNhbnZhcyBlbGVtZW50LlxuICAgICAqL1xuICAgIFV0aWwucmVzaXplQ2FudmFzID0gZnVuY3Rpb24oc3BlYywgaW1nKSB7XG4gICAgICAgIGlmICghVXRpbC5tdXN0QmVQb3dlck9mVHdvKHNwZWMpIHx8XG4gICAgICAgICAgICAoVXRpbC5pc1Bvd2VyT2ZUd28oaW1nLndpZHRoKSAmJiBVdGlsLmlzUG93ZXJPZlR3byhpbWcuaGVpZ2h0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbWc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IGNhbnZhcyBlbGVtZW50XG4gICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY2FudmFzLndpZHRoID0gVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28oaW1nLndpZHRoKTtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKGltZy5oZWlnaHQpO1xuICAgICAgICAvLyBjb3B5IHRoZSBpbWFnZSBjb250ZW50cyB0byB0aGUgY2FudmFzXG4gICAgICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBVdGlsO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIFhNTEh0dHBSZXF1ZXN0IEdFVCByZXF1ZXN0IHRvIHRoZSBzdXBwbGllZCB1cmwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIFhIUiBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuc3VjY2VzcyAtIFRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmVycm9yIC0gVGhlIGVycm9yIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnJlc3BvbnNlVHlwZSAtIFRoZSByZXNwb25zZVR5cGUgb2YgdGhlIFhIUi5cbiAgICAgICAgICovXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBvcHRpb25zLnVybCwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhyZXF1ZXN0LnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvcignR0VUICcgKyByZXF1ZXN0LnJlc3BvbnNlVVJMICsgJyAnICsgcmVxdWVzdC5zdGF0dXMgKyAnICgnICsgcmVxdWVzdC5zdGF0dXNUZXh0ICsgJyknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0oKSk7XG4iXX0=
