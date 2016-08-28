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
                    this.vertexBuffers.forEach(function (vertexBuffer) {
                        vertexBuffer.bind();
                        vertexBuffer.draw(options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9Db2xvclRleHR1cmUyRC5qcyIsInNyYy9jb3JlL0RlcHRoVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvSW5kZXhCdWZmZXIuanMiLCJzcmMvY29yZS9SZW5kZXJUYXJnZXQuanMiLCJzcmMvY29yZS9SZW5kZXJhYmxlLmpzIiwic3JjL2NvcmUvU2hhZGVyLmpzIiwic3JjL2NvcmUvU2hhZGVyUGFyc2VyLmpzIiwic3JjL2NvcmUvVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvVGV4dHVyZUN1YmVNYXAuanMiLCJzcmMvY29yZS9WZXJ0ZXhCdWZmZXIuanMiLCJzcmMvY29yZS9WZXJ0ZXhQYWNrYWdlLmpzIiwic3JjL2NvcmUvVmlld3BvcnQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHQuanMiLCJzcmMvZXhwb3J0cy5qcyIsInNyYy91dGlsL0FzeW5jLmpzIiwic3JjL3V0aWwvSW1hZ2VMb2FkZXIuanMiLCJzcmMvdXRpbC9VdGlsLmpzIiwic3JjL3V0aWwvWEhSTG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQyxhQUFZOztBQUVUOztBQUVBLFFBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7QUFDQSxRQUFJLGNBQWMsUUFBUSxxQkFBUixDQUFsQjtBQUNBLFFBQUksT0FBTyxRQUFRLGNBQVIsQ0FBWDs7QUFFQSxRQUFJLGNBQWM7QUFDZCxpQkFBUyxJQURLO0FBRWQsZ0JBQVE7QUFGTSxLQUFsQjtBQUlBLFFBQUksY0FBYztBQUNkLGlCQUFTLElBREs7QUFFZCxnQkFBUSxJQUZNO0FBR2QsZ0NBQXdCLElBSFY7QUFJZCwrQkFBdUIsSUFKVDtBQUtkLCtCQUF1QixJQUxUO0FBTWQsOEJBQXNCO0FBTlIsS0FBbEI7QUFRQSxRQUFJLGFBQWE7QUFDYixnQkFBUSxJQURLO0FBRWIseUJBQWlCLElBRko7QUFHYix1QkFBZTtBQUhGLEtB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LEVBQTRCO0FBQ3hCLDRCQUFJLFFBQVEsT0FBWixFQUFxQjtBQUNqQixvQ0FBUSxPQUFSLENBQWdCLFFBQVEsUUFBeEI7QUFDSDtBQUNKLHFCQUpELE1BSU87QUFDSCw0QkFBSSxRQUFRLEtBQVosRUFBbUI7QUFDZixvQ0FBUSxLQUFSLENBQWMsU0FBUyxRQUFRLFdBQWpCLEdBQStCLEdBQS9CLEdBQXFDLFFBQVEsTUFBN0MsR0FBc0QsSUFBdEQsR0FBNkQsUUFBUSxVQUFyRSxHQUFrRixHQUFoRztBQUNIO0FBQ0o7QUFDSjtBQUNKLGFBWkQ7QUFhQSxvQkFBUSxJQUFSO0FBQ0g7QUE3QlksS0FBakI7QUFnQ0gsQ0FwQ0EsR0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyk7XG4gICAgbGV0IEltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi4vdXRpbC9JbWFnZUxvYWRlcicpO1xuICAgIGxldCBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XG5cbiAgICBsZXQgTUFHX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IE1JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTElORUFSOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX0xJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IFdSQVBfTU9ERVMgPSB7XG4gICAgICAgIFJFUEVBVDogdHJ1ZSxcbiAgICAgICAgTUlSUk9SRURfUkVQRUFUOiB0cnVlLFxuICAgICAgICBDTEFNUF9UT19FREdFOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgVFlQRVMgPSB7XG4gICAgICAgIFVOU0lHTkVEX0JZVEU6IHRydWUsXG4gICAgICAgIEZMT0FUOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgRk9STUFUUyA9IHtcbiAgICAgICAgUkdCOiB0cnVlLFxuICAgICAgICBSR0JBOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIGNvbG9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIGNvbG9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgY29sb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfV1JBUCA9ICdSRVBFQVQnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgbWluIC8gbWFnIGZpbHRlciBmb3IgY29sb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIG1pcG1hcHBpbmcgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9NSVBNQVAgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9JTlZFUlRfWSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgQ29sb3JUZXh0dXJlMkRcbiAgICAgKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCBjb2xvciB0ZXh0dXJlLlxuICAgICAqIEBhdWdtZW50cyBUZXh0dXJlMkRcbiAgICAgKi9cbiAgICBjbGFzcyBDb2xvclRleHR1cmUyRCBleHRlbmRzIFRleHR1cmUyRCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIENvbG9yVGV4dHVyZTJEIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgc3BlY2lmaWNhdGlvbiBhcmd1bWVudHMuXG4gICAgICAgICAqIEBwYXJhbSB7SW1hZ2VEYXRhfEhUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gc3BlYy5pbWFnZSAtIFRoZSBIVE1MSW1hZ2VFbGVtZW50IHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMudXJsIC0gVGhlIEhUTUxJbWFnZUVsZW1lbnQgVVJMIHRvIGxvYWQgYW5kIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtVaW50OEFycmF5fEZsb2F0MzJBcnJheX0gc3BlYy5zcmMgLSBUaGUgZGF0YSB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciBib3RoIFMgYW5kIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5maWx0ZXIgLSBUaGUgbWluIC8gbWFnIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLm1pcE1hcCAtIFdoZXRoZXIgb3Igbm90IG1pcC1tYXBwaW5nIGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5pbnZlcnRZIC0gV2hldGhlciBvciBub3QgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtib29sfSBzcGVjLnByZU11bHRpcGx5QWxwaGEgLSBXaGV0aGVyIG9yIG5vdCBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgaWYgdGhlIGRhdGEgaXMgbG9hZGVkIGFzeW5jaHJvbm91c2x5IHZpYSBhIFVSTC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHNwZWMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG4gICAgICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xuICAgICAgICAgICAgc3BlYy53cmFwUyA9IFdSQVBfTU9ERVNbc3BlYy53cmFwU10gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgc3BlYy53cmFwVCA9IFdSQVBfTU9ERVNbc3BlYy53cmFwVF0gPyBzcGVjLndyYXBUIDogREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBNSU5fRklMVEVSU1tzcGVjLm1pbkZpbHRlcl0gPyBzcGVjLm1pbkZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1tzcGVjLm1hZ0ZpbHRlcl0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgLy8gc2V0IG90aGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHNwZWMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogREVGQVVMVF9NSVBNQVA7XG4gICAgICAgICAgICBzcGVjLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IERFRkFVTFRfSU5WRVJUX1k7XG4gICAgICAgICAgICBzcGVjLnByZU11bHRpcGx5QWxwaGEgPSBzcGVjLnByZU11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCA/IHNwZWMucHJlTXVsdGlwbHlBbHBoYSA6IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEE7XG4gICAgICAgICAgICAvLyBzZXQgZm9ybWF0XG4gICAgICAgICAgICBzcGVjLmZvcm1hdCA9IEZPUk1BVFNbc3BlYy5mb3JtYXRdID8gc3BlYy5mb3JtYXQgOiBERUZBVUxUX0ZPUk1BVDtcbiAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBiYXNlZCBvbiBhcmd1bWVudCB0eXBlXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwZWMuc3JjID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIHJlcXVlc3Qgc291cmNlIGZyb20gdXJsXG4gICAgICAgICAgICAgICAgc3BlYy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuICAgICAgICAgICAgICAgIC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgIHN1cGVyKHNwZWMpO1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHB1dCBleHRlbnNpb24gaGFuZGxpbmcgZm9yIGFycmF5YnVmZmVyIC8gaW1hZ2UgLyB2aWRlbyBkaWZmZXJlbnRpYXRpb25cbiAgICAgICAgICAgICAgICBJbWFnZUxvYWRlci5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzcGVjLnNyYyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHRvIHVuc2lnbmVkIGJ5dGUgdHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UgPSBVdGlsLnJlc2l6ZUNhbnZhcyhzcGVjLCBpbWFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub3cgYnVmZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoaW1hZ2UsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV4ZWN1dGUgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVXRpbC5pc0NhbnZhc1R5cGUoc3BlYy5zcmMpKSB7XG4gICAgICAgICAgICAgICAgLy8gaXMgaW1hZ2UgLyBjYW52YXMgLyB2aWRlbyB0eXBlXG4gICAgICAgICAgICAgICAgLy8gc2V0IHRvIHVuc2lnbmVkIGJ5dGUgdHlwZVxuICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcbiAgICAgICAgICAgICAgICBzcGVjLnNyYyA9IFV0aWwucmVzaXplQ2FudmFzKHNwZWMsIHNwZWMuc3JjKTtcbiAgICAgICAgICAgICAgICAvLyBjYWxsIGJhc2UgY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICBzdXBlcihzcGVjKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYXJyYXksIGFycmF5YnVmZmVyLCBvciBudWxsXG4gICAgICAgICAgICAgICAgaWYgKHNwZWMuc3JjID09PSB1bmRlZmluZWQgfHwgc3BlYy5zcmMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm8gZGF0YSBpcyBwcm92aWRlZCwgYXNzdW1lIHRoaXMgdGV4dHVyZSB3aWxsIGJlIHJlbmRlcmVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvLiBJbiB0aGlzIGNhc2UgZGlzYWJsZSBtaXBtYXBwaW5nLCB0aGVyZSBpcyBubyBuZWVkIGFuZCBpdFxuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIG9ubHkgaW50cm9kdWNlIHZlcnkgcGVjdWxpYXIgYW5kIGRpZmZpY3VsdCB0byBkaXNjZXJuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbmRlcmluZyBwaGVub21lbmEgaW4gd2hpY2ggdGhlIHRleHR1cmUgJ3RyYW5zZm9ybXMnIGF0XG4gICAgICAgICAgICAgICAgICAgIC8vIGNlcnRhaW4gYW5nbGVzIC8gZGlzdGFuY2VzIHRvIHRoZSBtaXBtYXBwZWQgKGVtcHR5KSBwb3J0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgc3BlYy5taXBNYXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIGZyb20gYXJnXG4gICAgICAgICAgICAgICAgc3BlYy50eXBlID0gVFlQRVNbc3BlYy50eXBlXSA/IHNwZWMudHlwZSA6IERFRkFVTFRfVFlQRTtcbiAgICAgICAgICAgICAgICAvLyBjYWxsIGJhc2UgY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICBzdXBlcihzcGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gQ29sb3JUZXh0dXJlMkQ7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyk7XG5cbiAgICBsZXQgTUFHX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IE1JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBXUkFQX01PREVTID0ge1xuICAgICAgICBSRVBFQVQ6IHRydWUsXG4gICAgICAgIENMQU1QX1RPX0VER0U6IHRydWUsXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZVxuICAgIH07XG4gICAgbGV0IERFUFRIX1RZUEVTID0ge1xuICAgICAgICBVTlNJR05FRF9CWVRFOiB0cnVlLFxuICAgICAgICBVTlNJR05FRF9TSE9SVDogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfSU5UOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgRk9STUFUUyA9IHtcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIGRlcHRoIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfSU5UJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvcm1hdCBmb3IgZGVwdGggdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfRk9STUFUID0gJ0RFUFRIX0NPTVBPTkVOVCc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIGRlcHRoIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciBkZXB0aCB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBEZXB0aFRleHR1cmUyRFxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIGRlcHRoIHRleHR1cmUuXG4gICAgICogQGF1Z21lbnRzIFRleHR1cmUyRFxuICAgICAqL1xuICAgIGNsYXNzIERlcHRoVGV4dHVyZTJEIGV4dGVuZHMgVGV4dHVyZTJEIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zdGFudGlhdGVzIGEgRGVwdGhUZXh0dXJlMkQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSBzcGVjaWZpY2F0aW9uIGFyZ3VtZW50cy5cbiAgICAgICAgICogQHBhcmFtIHtVaW50OEFycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fSBzcGVjLnNyYyAtIFRoZSBkYXRhIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMud2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHRleHR1cmUuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBTIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgUyBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1pbkZpbHRlciAtIFRoZSBtaW5pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy5mb3JtYXQgLSBUaGUgdGV4dHVyZSBwaXhlbCBmb3JtYXQuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcGVjLnR5cGUgLSBUaGUgdGV4dHVyZSBwaXhlbCBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHNwZWMgPSB7fSkge1xuICAgICAgICAgICAgLy8gZ2V0IHNwZWNpZmljIHBhcmFtc1xuICAgICAgICAgICAgc3BlYy53cmFwUyA9IHNwZWMud3JhcFMgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy53cmFwVCA9IHNwZWMud3JhcFQgfHwgc3BlYy53cmFwO1xuICAgICAgICAgICAgc3BlYy5taW5GaWx0ZXIgPSBzcGVjLm1pbkZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIHNwZWMubWFnRmlsdGVyID0gc3BlYy5tYWdGaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICAvLyBzZXQgdGV4dHVyZSBwYXJhbXNcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPSBXUkFQX01PREVTW3NwZWMud3JhcFNdID8gc3BlYy53cmFwUyA6IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPSBXUkFQX01PREVTW3NwZWMud3JhcFRdID8gc3BlYy53cmFwVCA6IERFRkFVTFRfV1JBUDtcbiAgICAgICAgICAgIHNwZWMubWluRmlsdGVyID0gTUlOX0ZJTFRFUlNbc3BlYy5taW5GaWx0ZXJdID8gc3BlYy5taW5GaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIHNwZWMubWFnRmlsdGVyID0gTUFHX0ZJTFRFUlNbc3BlYy5tYWdGaWx0ZXJdID8gc3BlYy5tYWdGaWx0ZXIgOiBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIC8vIHNldCBtaXAtbWFwcGluZyBhbmQgZm9ybWF0XG4gICAgICAgICAgICBzcGVjLm1pcE1hcCA9IGZhbHNlOyAvLyBkaXNhYmxlIG1pcC1tYXBwaW5nXG4gICAgICAgICAgICBzcGVjLmludmVydFkgPSBmYWxzZTsgLy8gbm8gbmVlZCB0byBpbnZlcnQteVxuICAgICAgICAgICAgc3BlYy5wcmVNdWx0aXBseUFscGhhID0gZmFsc2U7IC8vIG5vIGFscGhhIHRvIHByZS1tdWx0aXBseVxuICAgICAgICAgICAgc3BlYy5mb3JtYXQgPSBGT1JNQVRTW3NwZWMuZm9ybWF0XSA/IHNwZWMuZm9ybWF0IDogREVGQVVMVF9GT1JNQVQ7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBzdGVuY2lsLWRlcHRoLCBvciBqdXN0IGRlcHRoXG4gICAgICAgICAgICBpZiAoc3BlYy5mb3JtYXQgPT09ICdERVBUSF9TVEVOQ0lMJykge1xuICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9ICdVTlNJR05FRF9JTlRfMjRfOF9XRUJHTCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9IERFUFRIX1RZUEVTW3NwZWMudHlwZV0gPyBzcGVjLnR5cGUgOiBERUZBVUxUX1RZUEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjYWxsIGJhc2UgY29uc3RydWN0b3JcbiAgICAgICAgICAgIHN1cGVyKHNwZWMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBEZXB0aFRleHR1cmUyRDtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKTtcblxuICAgIGxldCBUWVBFUyA9IHtcbiAgICAgICAgVU5TSUdORURfQllURTogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfU0hPUlQ6IHRydWUsXG4gICAgICAgIFVOU0lHTkVEX0lOVDogdHJ1ZVxuICAgIH07XG4gICAgbGV0IE1PREVTID0ge1xuICAgICAgICBQT0lOVFM6IHRydWUsXG4gICAgICAgIExJTkVTOiB0cnVlLFxuICAgICAgICBMSU5FX1NUUklQOiB0cnVlLFxuICAgICAgICBMSU5FX0xPT1A6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFUzogdHJ1ZSxcbiAgICAgICAgVFJJQU5HTEVfU1RSSVA6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX0ZBTjogdHJ1ZVxuICAgIH07XG4gICAgbGV0IEJZVEVTX1BFUl9UWVBFID0ge1xuICAgICAgICBVTlNJR05FRF9CWVRFOiAxLFxuICAgICAgICBVTlNJR05FRF9TSE9SVDogMixcbiAgICAgICAgVU5TSUdORURfSU5UOiA0XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGNvbXBvbmVudCB0eXBlLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfU0hPUlQnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyIG1vZGUgKHByaW1pdGl2ZSB0eXBlKS5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9NT0RFID0gJ1RSSUFOR0xFUyc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBieXRlIG9mZnNldCB0byByZW5kZXIgZnJvbS5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9CWVRFX09GRlNFVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBjb3VudCBvZiBpbmRpY2VzIHRvIHJlbmRlci5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9DT1VOVCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgSW5kZXhCdWZmZXJcbiAgICAgKiBAY2xhc3NkZXNjIEFuIGluZGV4IGJ1ZmZlciBjbGFzcyB0byBob2xlIGluZGV4aW5nIGluZm9ybWF0aW9uLlxuICAgICAqL1xuICAgIGNsYXNzIEluZGV4QnVmZmVyIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zdGFudGlhdGVzIGFuIEluZGV4QnVmZmVyIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtXZWJHTEJ1ZmZlcnxVaW50OEFycmF5fFVpbnQxNkFycmF5fFVpbjMyQXJyYXl8QXJyYXl8TnVtYmVyfSBhcmcgLSBUaGUgaW5kZXggZGF0YSB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIHJlbmRlcmluZyBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5tb2RlIC0gVGhlIGRyYXcgbW9kZSAvIHByaW1pdGl2ZSB0eXBlLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5ieXRlT2Zmc2V0IC0gVGhlIGJ5dGUgb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihhcmcsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFRZUEVTW29wdGlvbnMudHlwZV0gPyBvcHRpb25zLnR5cGUgOiBERUZBVUxUX1RZUEU7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSBNT0RFU1tvcHRpb25zLm1vZGVdID8gb3B0aW9ucy5tb2RlIDogREVGQVVMVF9NT0RFO1xuICAgICAgICAgICAgdGhpcy5jb3VudCA9IChvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jb3VudCA6IERFRkFVTFRfQ09VTlQ7XG4gICAgICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSAob3B0aW9ucy5ieXRlT2Zmc2V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5ieXRlT2Zmc2V0IDogREVGQVVMVF9CWVRFX09GRlNFVDtcbiAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IDA7XG4gICAgICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlYkdMQnVmZmVyIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmJ5dGVMZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG9mIHR5cGUgV2ViR0xCdWZmZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLmJ5dGVMZW5ndGhgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBvcHRpb25zLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gYXJnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyLmlzSW50ZWdlcihhcmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJ5dGUgbGVuZ3RoIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG9mIHR5cGUgYG51bWJlcmAgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMudHlwZWAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXlCdWZmZXIgYXJnXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG9mIHR5cGUgYEFycmF5QnVmZmVyYCBtdXN0IGJlIGNvbXBsaW1lbnRlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBgb3B0aW9ucy50eXBlYCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb3IgQXJyYXlCdWZmZXJWaWV3IGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdFbXB0eSBidWZmZXIgbXVzdCBiZSBjb21wbGltZW50ZWQgd2l0aCBhIGNvcnJlc3BvbmRpbmcgYG9wdGlvbnMudHlwZWAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgaW5kZXggZGF0YSB0byB0aGUgR1BVLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fEFycmF5QnVmZmVyfEFycmF5QnVmZmVyVmlld3xudW1iZXJ9IGFyZyAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7SW5kZXhCdWZmZXJ9IFRoZSBpbmRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBidWZmZXJEYXRhKGFyZykge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgdG8gQXJyYXlCdWZmZXJWaWV3IGJhc2VkIG9uIHByb3ZpZGVkIHR5cGVcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgdHlwZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0byB1aW50MzJcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gbmV3IFVpbnQzMkFycmF5KGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9TSE9SVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRvIHVpbnQxNlxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBuZXcgVWludDE2QXJyYXkoYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDhcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gbmV3IFVpbnQ4QXJyYXkoYXJnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHNldCBlbnN1cmUgdHlwZSBjb3JyZXNwb25kcyB0byBkYXRhXG4gICAgICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9JTlQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgVWludDE2QXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0JZVEUnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICEoYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmXG4gICAgICAgICAgICAgICAgICAgICEoTnVtYmVyLmlzSW50ZWdlcihhcmcpKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCBgQXJyYXlCdWZmZXJWaWV3YCwgb3IgYG51bWJlcmAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgdGhlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IGV4dGVuc2lvblxuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcgJiZcbiAgICAgICAgICAgICAgICAhV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCdPRVNfZWxlbWVudF9pbmRleF91aW50JykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBJbmRleEJ1ZmZlciBvZiB0eXBlIGBVTlNJR05FRF9JTlRgIGFzIGV4dGVuc2lvbiBgT0VTX2VsZW1lbnRfaW5kZXhfdWludGAgaXMgbm90IHN1cHBvcnRlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBvdmVyd3JpdGUgdGhlIGNvdW50IGlmIGl0IGlzIGFscmVhZHkgc2V0XG4gICAgICAgICAgICBpZiAodGhpcy5jb3VudCA9PT0gREVGQVVMVF9DT1VOVCkge1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFyZykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IChhcmcgLyBCWVRFU19QRVJfVFlQRVt0aGlzLnR5cGVdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50ID0gYXJnLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgYnl0ZSBsZW5ndGhcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFyZykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBhcmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IGFyZy5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3JlYXRlIGJ1ZmZlciBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcbiAgICAgICAgICAgIGlmICghdGhpcy5idWZmZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBhcmcsIGdsLlNUQVRJQ19EUkFXKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwbG9hZCBwYXJ0aWFsIGluZGV4IGRhdGEgdG8gdGhlIEdQVS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlcnxBcnJheUJ1ZmZlclZpZXd9IGFycmF5IC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gYnl0ZU9mZnNldCAtIFRoZSBieXRlIG9mZnNldCBhdCB3aGljaCB0byBidWZmZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0luZGV4QnVmZmVyfSBUaGUgaW5kZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYnVmZmVyU3ViRGF0YShhcnJheSwgYnl0ZU9mZnNldCA9IERFRkFVTFRfQllURV9PRkZTRVQpIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0J1ZmZlciBoYXMgbm90IHlldCBiZWVuIGFsbG9jYXRlZCwgYWxsb2NhdGUgd2l0aCBgYnVmZmVyRGF0YWAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2FzdCBhcnJheSB0byBBcnJheUJ1ZmZlclZpZXcgYmFzZWQgb24gcHJvdmlkZWQgdHlwZVxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHR5cGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfSU5UJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDMyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KGFycmF5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX1NIT1JUJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDE2XG4gICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQxNkFycmF5KGFycmF5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgdG8gdWludDhcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhKGFycmF5IGluc3RhbmNlb2YgVWludDhBcnJheSkgJiZcbiAgICAgICAgICAgICAgICAhKGFycmF5IGluc3RhbmNlb2YgVWludDE2QXJyYXkpICYmXG4gICAgICAgICAgICAgICAgIShhcnJheSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSAmJlxuICAgICAgICAgICAgICAgICEoYXJyYXkgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIG9yIGBBcnJheUJ1ZmZlclZpZXdgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgd2UgYXJlbid0IG92ZXJmbG93aW5nIHRoZSBidWZmZXJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0ICsgYXJyYXkuYnl0ZUxlbmd0aCA+IHRoaXMuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBBcmd1bWVudCBvZiBsZW5ndGggJHthcnJheS5ieXRlTGVuZ3RofSBieXRlcyB3aXRoIGAgK1xuICAgICAgICAgICAgICAgICAgICBgb2Zmc2V0IG9mICR7Ynl0ZU9mZnNldH0gYnl0ZXMgb3ZlcmZsb3dzIHRoZSBidWZmZXIgYCArXG4gICAgICAgICAgICAgICAgICAgIGBsZW5ndGggb2YgJHt0aGlzLmJ5dGVMZW5ndGh9IGJ5dGVzYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ5dGVPZmZzZXQsIGFycmF5KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIGJvdW5kIGJ1ZmZlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlT2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIHZlcnRpY2VzIHRvIGRyYXcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0luZGV4QnVmZmVyfSBUaGUgaW5kZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgZHJhdyhvcHRpb25zID0ge30pIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBsZXQgbW9kZSA9IGdsW29wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGVdO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBnbFt0aGlzLnR5cGVdO1xuICAgICAgICAgICAgbGV0IGJ5dGVPZmZzZXQgPSAob3B0aW9ucy5ieXRlT2Zmc2V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5ieXRlT2Zmc2V0IDogdGhpcy5ieXRlT2Zmc2V0O1xuICAgICAgICAgICAgbGV0IGNvdW50ID0gKG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmNvdW50IDogdGhpcy5jb3VudDtcbiAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93ICdBdHRlbXB0aW5nIHRvIGRyYXcgd2l0aCBhIGNvdW50IG9mIDAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYmluZCBidWZmZXJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIC8vIGRyYXcgZWxlbWVudHNcbiAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyhtb2RlLCBjb3VudCwgdHlwZSwgYnl0ZU9mZnNldCk7XG4gICAgICAgICAgICAvLyBubyBuZWVkIHRvIHVuYmluZFxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEluZGV4QnVmZmVyO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuXG4gICAgbGV0IFRFWFRVUkVfVEFSR0VUUyA9IHtcbiAgICAgICAgVEVYVFVSRV8yRDogdHJ1ZSxcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUDogdHJ1ZVxuICAgIH07XG5cbiAgICBsZXQgREVQVEhfRk9STUFUUyA9IHtcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBSZW5kZXJUYXJnZXRcbiAgICAgKiBAY2xhc3NkZXNjIEEgcmVuZGVyVGFyZ2V0IGNsYXNzIHRvIGFsbG93IHJlbmRlcmluZyB0byB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBjbGFzcyBSZW5kZXJUYXJnZXQge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBSZW5kZXJUYXJnZXQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVidWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJpbmQoKSB7XG4gICAgICAgICAgICAvLyBiaW5kIGZyYW1lYnVmZmVyXG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCB0aGlzLmZyYW1lYnVmZmVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVuYmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHVuYmluZCgpIHtcbiAgICAgICAgICAgIC8vIHVuYmluZCBmcmFtZWJ1ZmZlclxuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdHRhY2hlcyB0aGUgcHJvdmlkZWQgdGV4dHVyZSB0byB0aGUgcHJvdmlkZWQgYXR0YWNobWVudCBsb2NhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgdGV4dHVyZSB0byBhdHRhY2guXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIFRoZSBhdHRhY2htZW50IGluZGV4LiAob3B0aW9uYWwpXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQgdHlwZS4gKG9wdGlvbmFsKVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRDb2xvclRhcmdldCh0ZXh0dXJlLCBpbmRleCwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgYXJndW1lbnQgaXMgbWlzc2luZyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoVEVYVFVSRV9UQVJHRVRTW2luZGV4XSAmJiB0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgY29sb3IgYXR0YWNobWVudCBpbmRleCBpcyBpbnZhbGlkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgIVRFWFRVUkVfVEFSR0VUU1t0YXJnZXRdKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RleHR1cmUgdGFyZ2V0IGlzIGludmFsaWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1snY29sb3InICsgaW5kZXhdID0gdGV4dHVyZTtcbiAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuICAgICAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG4gICAgICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXG4gICAgICAgICAgICAgICAgZ2xbJ0NPTE9SX0FUVEFDSE1FTlQnICsgaW5kZXhdLFxuICAgICAgICAgICAgICAgIGdsW3RhcmdldCB8fCAnVEVYVFVSRV8yRCddLFxuICAgICAgICAgICAgICAgIHRleHR1cmUudGV4dHVyZSxcbiAgICAgICAgICAgICAgICAwKTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdHRhY2hlcyB0aGUgcHJvdmlkZWQgdGV4dHVyZSB0byB0aGUgcHJvdmlkZWQgYXR0YWNobWVudCBsb2NhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgdGV4dHVyZSB0byBhdHRhY2guXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHNldERlcHRoVGFyZ2V0KHRleHR1cmUpIHtcbiAgICAgICAgICAgIGlmICghdGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdUZXh0dXJlIGFyZ3VtZW50IGlzIG1pc3NpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFERVBUSF9GT1JNQVRTW3RleHR1cmUuZm9ybWF0XSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdQcm92aWRlZCB0ZXh0dXJlIGlzIG5vdCBvZiBmb3JtYXQgYERFUFRIX0NPTVBPTkVOVGAgb3IgYERFUFRIX1NURU5DSUxgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzLmRlcHRoID0gdGV4dHVyZTtcbiAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuICAgICAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG4gICAgICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXG4gICAgICAgICAgICAgICAgZ2wuREVQVEhfQVRUQUNITUVOVCxcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxuICAgICAgICAgICAgICAgIHRleHR1cmUudGV4dHVyZSxcbiAgICAgICAgICAgICAgICAwKTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNpemVzIHRoZSByZW5kZXJUYXJnZXQgYW5kIGFsbCBhdHRhY2hlZCB0ZXh0dXJlcyBieSB0aGUgcHJvdmlkZWQgaGVpZ2h0IGFuZCB3aWR0aC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIG5ldyB3aWR0aCBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIG5ldyBoZWlnaHQgb2YgdGhlIHJlbmRlclRhcmdldC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8ICh3aWR0aCA8PSAwKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGB3aWR0aFxcYCBvZiAke3dpZHRofSBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCAoaGVpZ2h0IDw9IDApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIFxcYGhlaWdodFxcYCBvZiAke2hlaWdodH0gaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdGV4dHVyZXMgPSB0aGlzLnRleHR1cmVzO1xuICAgICAgICAgICAgT2JqZWN0LmtleXModGV4dHVyZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlc1trZXldLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlclRhcmdldDtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgVmVydGV4UGFja2FnZSA9IHJlcXVpcmUoJy4uL2NvcmUvVmVydGV4UGFja2FnZScpO1xuICAgIGxldCBWZXJ0ZXhCdWZmZXIgPSByZXF1aXJlKCcuLi9jb3JlL1ZlcnRleEJ1ZmZlcicpO1xuICAgIGxldCBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uL2NvcmUvSW5kZXhCdWZmZXInKTtcblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBhbiBpbmRleFxuICAgICAqIG9jY3VycyBtb3JlIHRoYW4gb25jZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGV4QnVmZmVycyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXhCdWZmZXJzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoZWNrSW5kZXhDb2xsaXNpb25zKHZlcnRleEJ1ZmZlcnMpIHtcbiAgICAgICAgbGV0IGluZGljZXMgPSB7fTtcbiAgICAgICAgdmVydGV4QnVmZmVycy5mb3JFYWNoKGJ1ZmZlciA9PiB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhidWZmZXIucG9pbnRlcnMpLmZvckVhY2goaW5kZXggPT4ge1xuICAgICAgICAgICAgICAgIGluZGljZXNbaW5kZXhdID0gaW5kaWNlc1tpbmRleF0gfHwgMDtcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2luZGV4XSsrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3Qua2V5cyhpbmRpY2VzKS5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgICAgICAgIGlmIChpbmRpY2VzW2luZGV4XSA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgTW9yZSB0aGFuIG9uZSBhdHRyaWJ1dGUgcG9pbnRlciBleGlzdHMgZm9yIGluZGV4IFxcYCR7aW5kZXh9XFxgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFJlbmRlcmFibGVcbiAgICAgKiBAY2xhc3NkZXNjIEEgY29udGFpbmVyIGZvciBvbmUgb3IgbW9yZSBWZXJ0ZXhCdWZmZXJzIGFuZCBhbiBvcHRpb25hbCBJbmRleEJ1ZmZlci5cbiAgICAgKi9cbiAgICBjbGFzcyBSZW5kZXJhYmxlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zdGFudGlhdGVzIGFuIFJlbmRlcmFibGUgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSByZW5kZXJhYmxlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fEZsb2F0MzJBcnJheX0gc3BlYy52ZXJ0aWNlcyAtIFRoZSB2ZXJ0aWNlcyB0byBpbnRlcmxlYXZlIGFuZCBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7VmVydGV4QnVmZmVyfSBzcGVjLnZlcnRleEJ1ZmZlciAtIEFuIGV4aXN0aW5nIHZlcnRleCBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7VmVydGV4QnVmZmVyW119IHNwZWMudmVydGV4QnVmZmVycyAtIE11bHRpcGxlIGV4aXN0aW5nIHZlcnRleCBidWZmZXJzLlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fSBzcGVjLmluZGljZXMgLSBUaGUgaW5kaWNlcyB0byBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7SW5kZXhCdWZmZXJ9IHNwZWMuaW5kZXhidWZmZXIgLSBBbiBleGlzdGluZyBpbmRleCBidWZmZXIuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcbiAgICAgICAgICAgIGlmIChzcGVjLnZlcnRleEJ1ZmZlciB8fCBzcGVjLnZlcnRleEJ1ZmZlcnMpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgdmVydGV4IGJ1ZmZlclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IHNwZWMudmVydGV4QnVmZmVycyB8fCBbc3BlYy52ZXJ0ZXhCdWZmZXJdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGVjLnZlcnRpY2VzKSB7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBwYWNrYWdlXG4gICAgICAgICAgICAgICAgbGV0IHZlcnRleFBhY2thZ2UgPSBuZXcgVmVydGV4UGFja2FnZShzcGVjLnZlcnRpY2VzKTtcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdmVydGV4IGJ1ZmZlclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IFtuZXcgVmVydGV4QnVmZmVyKHZlcnRleFBhY2thZ2UpXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BlYy5pbmRleEJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIC8vIHVzZSBleGlzdGluZyBpbmRleCBidWZmZXJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gc3BlYy5pbmRleEJ1ZmZlcjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlYy5pbmRpY2VzKSB7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGluZGV4IGJ1ZmZlclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBuZXcgSW5kZXhCdWZmZXIoc3BlYy5pbmRpY2VzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IG5vIGF0dHJpYnV0ZSBpbmRpY2VzIGNsYXNoXG4gICAgICAgICAgICBjaGVja0luZGV4Q29sbGlzaW9ucyh0aGlzLnZlcnRleEJ1ZmZlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIHVuZGVybHlpbmcgYnVmZmVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBwYXNzIHRvICdkcmF3RWxlbWVudHMnLiBPcHRpb25hbC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYnl0ZU9mZnNldCAtIFRoZSBieXRlT2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuaW5kZXhPZmZzZXQgLSBUaGUgaW5kZXhPZmZzZXQgaW50byB0aGUgZHJhd24gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb3VudCAtIFRoZSBudW1iZXIgb2YgdmVydGljZXMgdG8gZHJhdy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7UmVuZGVyYWJsZX0gLSBUaGUgcmVuZGVyYWJsZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGRyYXcob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICAvLyBkcmF3IHRoZSByZW5kZXJhYmxlXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleEJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIC8vIHVzZSBpbmRleCBidWZmZXIgdG8gZHJhdyBlbGVtZW50c1xuICAgICAgICAgICAgICAgIC8vIGJpbmQgdmVydGV4IGJ1ZmZlcnMgYW5kIGVuYWJsZSBhdHRyaWJ1dGUgcG9pbnRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIGRyYXcgcHJpbWl0aXZlcyB1c2luZyBpbmRleCBidWZmZXJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmRyYXcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgLy8gZGlzYWJsZSBhdHRyaWJ1dGUgcG9pbnRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMuZm9yRWFjaCh2ZXJ0ZXhCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIudW5iaW5kKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gbm8gYWR2YW50YWdlIHRvIHVuYmluZGluZyBhcyB0aGVyZSBpcyBubyBzdGFjayB1c2VkXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vIGluZGV4IGJ1ZmZlciwgdXNlIGRyYXcgYXJyYXlzXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzLmZvckVhY2godmVydGV4QnVmZmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLmJpbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLmRyYXcob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci51bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJhYmxlO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuICAgIGxldCBTaGFkZXJQYXJzZXIgPSByZXF1aXJlKCcuL1NoYWRlclBhcnNlcicpO1xuICAgIGxldCBBc3luYyA9IHJlcXVpcmUoJy4uL3V0aWwvQXN5bmMnKTtcbiAgICBsZXQgWEhSTG9hZGVyID0gcmVxdWlyZSgnLi4vdXRpbC9YSFJMb2FkZXInKTtcblxuICAgIGxldCBVTklGT1JNX0ZVTkNUSU9OUyA9IHtcbiAgICAgICAgJ2Jvb2wnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ2Jvb2xbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ2Zsb2F0JzogJ3VuaWZvcm0xZicsXG4gICAgICAgICdmbG9hdFtdJzogJ3VuaWZvcm0xZnYnLFxuICAgICAgICAnaW50JzogJ3VuaWZvcm0xaScsXG4gICAgICAgICdpbnRbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ3VpbnQnOiAndW5pZm9ybTFpJyxcbiAgICAgICAgJ3VpbnRbXSc6ICd1bmlmb3JtMWl2JyxcbiAgICAgICAgJ3ZlYzInOiAndW5pZm9ybTJmdicsXG4gICAgICAgICd2ZWMyW10nOiAndW5pZm9ybTJmdicsXG4gICAgICAgICdpdmVjMic6ICd1bmlmb3JtMml2JyxcbiAgICAgICAgJ2l2ZWMyW10nOiAndW5pZm9ybTJpdicsXG4gICAgICAgICd2ZWMzJzogJ3VuaWZvcm0zZnYnLFxuICAgICAgICAndmVjM1tdJzogJ3VuaWZvcm0zZnYnLFxuICAgICAgICAnaXZlYzMnOiAndW5pZm9ybTNpdicsXG4gICAgICAgICdpdmVjM1tdJzogJ3VuaWZvcm0zaXYnLFxuICAgICAgICAndmVjNCc6ICd1bmlmb3JtNGZ2JyxcbiAgICAgICAgJ3ZlYzRbXSc6ICd1bmlmb3JtNGZ2JyxcbiAgICAgICAgJ2l2ZWM0JzogJ3VuaWZvcm00aXYnLFxuICAgICAgICAnaXZlYzRbXSc6ICd1bmlmb3JtNGl2JyxcbiAgICAgICAgJ21hdDInOiAndW5pZm9ybU1hdHJpeDJmdicsXG4gICAgICAgICdtYXQyW10nOiAndW5pZm9ybU1hdHJpeDJmdicsXG4gICAgICAgICdtYXQzJzogJ3VuaWZvcm1NYXRyaXgzZnYnLFxuICAgICAgICAnbWF0M1tdJzogJ3VuaWZvcm1NYXRyaXgzZnYnLFxuICAgICAgICAnbWF0NCc6ICd1bmlmb3JtTWF0cml4NGZ2JyxcbiAgICAgICAgJ21hdDRbXSc6ICd1bmlmb3JtTWF0cml4NGZ2JyxcbiAgICAgICAgJ3NhbXBsZXIyRCc6ICd1bmlmb3JtMWknLFxuICAgICAgICAnc2FtcGxlckN1YmUnOiAndW5pZm9ybTFpJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIG1hcCBvZiBleGlzdGluZyBhdHRyaWJ1dGVzLCBmaW5kIHRoZSBsb3dlc3QgaW5kZXggdGhhdCBpcyBub3RcbiAgICAgKiBhbHJlYWR5IHVzZWQuIElmIHRoZSBhdHRyaWJ1dGUgb3JkZXJpbmcgd2FzIGFscmVhZHkgcHJvdmlkZWQsIHVzZSB0aGF0XG4gICAgICogaW5zdGVhZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgZXhpc3RpbmcgYXR0cmlidXRlcyBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRlY2xhcmF0aW9uIC0gVGhlIGF0dHJpYnV0ZSBkZWNsYXJhdGlvbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBhdHRyaWJ1dGUgaW5kZXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QXR0cmlidXRlSW5kZXgoYXR0cmlidXRlcywgZGVjbGFyYXRpb24pIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgYXR0cmlidXRlIGlzIGFscmVhZHkgZGVjbGFyZWQsIGlmIHNvLCB1c2UgdGhhdCBpbmRleFxuICAgICAgICBpZiAoYXR0cmlidXRlc1tkZWNsYXJhdGlvbi5uYW1lXSkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNbZGVjbGFyYXRpb24ubmFtZV0uaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIG5leHQgYXZhaWxhYmxlIGluZGV4XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXIgc291cmNlLCBwYXJzZXMgdGhlIGRlY2xhcmF0aW9ucyBhbmQgYXBwZW5kcyBpbmZvcm1hdGlvbiBwZXJ0YWluaW5nIHRvIHRoZSB1bmlmb3JtcyBhbmQgYXR0cmlidHVlcyBkZWNsYXJlZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBzaGFkZXIgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2ZXJ0U291cmNlIC0gVGhlIHZlcnRleCBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmcmFnU291cmNlIC0gVGhlIGZyYWdtZW50IHNoYWRlciBzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0QXR0cmlidXRlc0FuZFVuaWZvcm1zKHNoYWRlciwgdmVydFNvdXJjZSwgZnJhZ1NvdXJjZSkge1xuICAgICAgICBsZXQgZGVjbGFyYXRpb25zID0gU2hhZGVyUGFyc2VyLnBhcnNlRGVjbGFyYXRpb25zKFxuICAgICAgICAgICAgW3ZlcnRTb3VyY2UsIGZyYWdTb3VyY2VdLFxuICAgICAgICAgICAgWyd1bmlmb3JtJywgJ2F0dHJpYnV0ZSddKTtcbiAgICAgICAgLy8gZm9yIGVhY2ggZGVjbGFyYXRpb24gaW4gdGhlIHNoYWRlclxuICAgICAgICBkZWNsYXJhdGlvbnMuZm9yRWFjaChkZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBpdHMgYW4gYXR0cmlidXRlIG9yIHVuaWZvcm1cbiAgICAgICAgICAgIGlmIChkZWNsYXJhdGlvbi5xdWFsaWZpZXIgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgYXR0cmlidXRlLCBzdG9yZSB0eXBlIGFuZCBpbmRleFxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGdldEF0dHJpYnV0ZUluZGV4KHNoYWRlci5hdHRyaWJ1dGVzLCBkZWNsYXJhdGlvbik7XG4gICAgICAgICAgICAgICAgc2hhZGVyLmF0dHJpYnV0ZXNbZGVjbGFyYXRpb24ubmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlY2xhcmF0aW9uLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBpZiAoZGVjbGFyYXRpb24ucXVhbGlmaWVyID09PSAndW5pZm9ybScpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB1bmlmb3JtLCBzdG9yZSB0eXBlIGFuZCBidWZmZXIgZnVuY3Rpb24gbmFtZVxuICAgICAgICAgICAgICAgIHNoYWRlci51bmlmb3Jtc1tkZWNsYXJhdGlvbi5uYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZnVuYzogVU5JRk9STV9GVU5DVElPTlNbZGVjbGFyYXRpb24udHlwZSArIChkZWNsYXJhdGlvbi5jb3VudCA+IDEgPyAnW10nIDogJycpXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgc2hhZGVyIHNvdXJjZSBzdHJpbmcgYW5kIHNoYWRlciB0eXBlLCBjb21waWxlcyB0aGUgc2hhZGVyIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgV2ViR0xTaGFkZXIgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gZ2wgLSBUaGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNoYWRlclNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHNoYWRlciB0eXBlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7V2ViR0xTaGFkZXJ9IFRoZSBjb21waWxlZCBzaGFkZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBpbGVTaGFkZXIoZ2wsIHNoYWRlclNvdXJjZSwgdHlwZSkge1xuICAgICAgICBsZXQgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsW3R5cGVdKTtcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc2hhZGVyU291cmNlKTtcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuICAgICAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgICAgICAgdGhyb3cgJ0FuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczpcXG4nICsgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaGFkZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgdGhlIGF0dHJpYnV0ZSBsb2NhdGlvbnMgZm9yIHRoZSBTaGFkZXIgb2JqZWN0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmluZEF0dHJpYnV0ZUxvY2F0aW9ucyhzaGFkZXIpIHtcbiAgICAgICAgbGV0IGdsID0gc2hhZGVyLmdsO1xuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IHNoYWRlci5hdHRyaWJ1dGVzO1xuICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAvLyBiaW5kIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25cbiAgICAgICAgICAgIGdsLmJpbmRBdHRyaWJMb2NhdGlvbihcbiAgICAgICAgICAgICAgICBzaGFkZXIucHJvZ3JhbSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzW2tleV0uaW5kZXgsXG4gICAgICAgICAgICAgICAga2V5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVlcmllcyB0aGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQgZm9yIHRoZSB1bmlmb3JtIGxvY2F0aW9ucy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFVuaWZvcm1Mb2NhdGlvbnMoc2hhZGVyKSB7XG4gICAgICAgIGxldCBnbCA9IHNoYWRlci5nbDtcbiAgICAgICAgbGV0IHVuaWZvcm1zID0gc2hhZGVyLnVuaWZvcm1zO1xuICAgICAgICBPYmplY3Qua2V5cyh1bmlmb3JtcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSB1bmlmb3JtIGxvY2F0aW9uXG4gICAgICAgICAgICBsZXQgbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyLnByb2dyYW0sIGtleSk7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBudWxsLCBwYXJzZSBtYXkgZGV0ZWN0IHVuaWZvcm0gdGhhdCBpcyBjb21waWxlZCBvdXRcbiAgICAgICAgICAgIC8vIGR1ZSB0byBhIHByZXByb2Nlc3NvciBldmFsdWF0aW9uLlxuICAgICAgICAgICAgLy8gVE9ETzogZml4IHBhcnNlciBzbyB0aGF0IGl0IGV2YWx1YXRlcyB0aGVzZSBjb3JyZWN0bHkuXG4gICAgICAgICAgICBpZiAobG9jYXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdW5pZm9ybXNba2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdW5pZm9ybXNba2V5XS5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBzaGFkZXIgc291cmNlIGZyb20gYSB1cmwuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIGxvYWQgdGhlIHJlc291cmNlIGZyb20uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIHRvIGxvYWQgdGhlIHNoYWRlciBzb3VyY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9hZFNoYWRlclNvdXJjZSh1cmwpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgICAgIFhIUkxvYWRlci5sb2FkKHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZShudWxsLCByZXMpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkb25lKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHBhc3MgdGhyb3VnaCB0aGUgc2hhZGVyIHNvdXJjZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZSAtIFRoZSBzb3VyY2Ugb2YgdGhlIHNoYWRlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhc3NUaHJvdWdoU291cmNlKHNvdXJjZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgZG9uZShudWxsLCBzb3VyY2UpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGFuIGFycmF5IG9mIEdMU0wgc291cmNlIHN0cmluZ3MgYW5kIFVSTHMsIGFuZCByZXNvbHZlcyB0aGVtIGludG8gYW5kIGFycmF5IG9mIEdMU0wgc291cmNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2VzIC0gVGhlIHNoYWRlciBzb3VyY2VzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgc2hhZGVyIHNvdXJjZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVNvdXJjZXMoc291cmNlcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgbGV0IHRhc2tzID0gW107XG4gICAgICAgICAgICBzb3VyY2VzID0gc291cmNlcyB8fCBbXTtcbiAgICAgICAgICAgIHNvdXJjZXMgPSAhQXJyYXkuaXNBcnJheShzb3VyY2VzKSA/IFtzb3VyY2VzXSA6IHNvdXJjZXM7XG4gICAgICAgICAgICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoU2hhZGVyUGFyc2VyLmlzR0xTTChzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2gocGFzc1Rocm91Z2hTb3VyY2Uoc291cmNlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChsb2FkU2hhZGVyU291cmNlKHNvdXJjZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQXN5bmMucGFyYWxsZWwodGFza3MsIGRvbmUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIHNoYWRlciBwcm9ncmFtIG9iamVjdCBmcm9tIHNvdXJjZSBzdHJpbmdzLiBUaGlzIGluY2x1ZGVzOlxuICAgICAqICAgIDEpIENvbXBpbGluZyBhbmQgbGlua2luZyB0aGUgc2hhZGVyIHByb2dyYW0uXG4gICAgICogICAgMikgUGFyc2luZyBzaGFkZXIgc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXG4gICAgICogICAgMykgQmluZGluZyBhdHRyaWJ1dGUgbG9jYXRpb25zLCBieSBvcmRlciBvZiBkZWxjYXJhdGlvbi5cbiAgICAgKiAgICA0KSBRdWVyeWluZyBhbmQgc3RvcmluZyB1bmlmb3JtIGxvY2F0aW9uLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZXMgLSBBIG1hcCBjb250YWluaW5nIHNvdXJjZXMgdW5kZXIgJ3ZlcnQnIGFuZCAnZnJhZycgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVQcm9ncmFtKHNoYWRlciwgc291cmNlcykge1xuICAgICAgICBsZXQgZ2wgPSBzaGFkZXIuZ2w7XG4gICAgICAgIGxldCBjb21tb24gPSBzb3VyY2VzLmNvbW1vbi5qb2luKCcnKTtcbiAgICAgICAgbGV0IHZlcnQgPSBzb3VyY2VzLnZlcnQuam9pbignJyk7XG4gICAgICAgIGxldCBmcmFnID0gc291cmNlcy5mcmFnLmpvaW4oJycpO1xuICAgICAgICAvLyBjb21waWxlIHNoYWRlcnNcbiAgICAgICAgbGV0IHZlcnRleFNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGNvbW1vbiArIHZlcnQsICdWRVJURVhfU0hBREVSJyk7XG4gICAgICAgIGxldCBmcmFnbWVudFNoYWRlciA9IGNvbXBpbGVTaGFkZXIoZ2wsIGNvbW1vbiArIGZyYWcsICdGUkFHTUVOVF9TSEFERVInKTtcbiAgICAgICAgLy8gcGFyc2Ugc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm1zXG4gICAgICAgIHNldEF0dHJpYnV0ZXNBbmRVbmlmb3JtcyhzaGFkZXIsIHZlcnQsIGZyYWcpO1xuICAgICAgICAvLyBjcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXG4gICAgICAgIHNoYWRlci5wcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgICAgICAvLyBhdHRhY2ggdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXJzXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXIucHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlci5wcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG4gICAgICAgIC8vIGJpbmQgdmVydGV4IGF0dHJpYnV0ZSBsb2NhdGlvbnMgQkVGT1JFIGxpbmtpbmdcbiAgICAgICAgYmluZEF0dHJpYnV0ZUxvY2F0aW9ucyhzaGFkZXIpO1xuICAgICAgICAvLyBsaW5rIHNoYWRlclxuICAgICAgICBnbC5saW5rUHJvZ3JhbShzaGFkZXIucHJvZ3JhbSk7XG4gICAgICAgIC8vIElmIGNyZWF0aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbSBmYWlsZWQsIGFsZXJ0XG4gICAgICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXIucHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICAgICAgICB0aHJvdyAnQW4gZXJyb3Igb2NjdXJlZCBsaW5raW5nIHRoZSBzaGFkZXI6XFxuJyArIGdsLmdldFByb2dyYW1JbmZvTG9nKHNoYWRlci5wcm9ncmFtKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnZXQgc2hhZGVyIHVuaWZvcm0gbG9jYXRpb25zXG4gICAgICAgIGdldFVuaWZvcm1Mb2NhdGlvbnMoc2hhZGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgU2hhZGVyXG4gICAgICogQGNsYXNzZGVzYyBBIHNoYWRlciBjbGFzcyB0byBhc3Npc3QgaW4gY29tcGlsaW5nIGFuZCBsaW5raW5nIHdlYmdsIHNoYWRlcnMsIHN0b3JpbmcgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGxvY2F0aW9ucywgYW5kIGJ1ZmZlcmluZyB1bmlmb3Jtcy5cbiAgICAgKi9cbiAgICBjbGFzcyBTaGFkZXIge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBTaGFkZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSBzaGFkZXIgc3BlY2lmaWNhdGlvbiBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfE9iamVjdH0gc3BlYy5jb21tb24gLSBTb3VyY2VzIC8gVVJMcyB0byBiZSBzaGFyZWQgYnkgYm90aCB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlcnMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfE9iamVjdH0gc3BlYy52ZXJ0IC0gVGhlIHZlcnRleCBzaGFkZXIgc291cmNlcyAvIFVSTHMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfE9iamVjdH0gc3BlYy5mcmFnIC0gVGhlIGZyYWdtZW50IHNoYWRlciBzb3VyY2VzIC8gVVJMcy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmdbXX0gc3BlYy5hdHRyaWJ1dGVzIC0gVGhlIGF0dHJpYnV0ZSBpbmRleCBvcmRlcmluZ3MuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb25jZSB0aGUgc2hhZGVyIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBjb21waWxlZCBhbmQgbGlua2VkLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Ioc3BlYyA9IHt9LCBjYWxsYmFjayA9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIHNvdXJjZSBhcmd1bWVudHNcbiAgICAgICAgICAgIGlmICghc3BlYy52ZXJ0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ1ZlcnRleCBzaGFkZXIgYXJndW1lbnQgYHZlcnRgIGhhcyBub3QgYmVlbiBwcm92aWRlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXNwZWMuZnJhZykge1xuICAgICAgICAgICAgICAgIHRocm93ICdGcmFnbWVudCBzaGFkZXIgYXJndW1lbnQgYGZyYWdgIGhhcyBub3QgYmVlbiBwcm92aWRlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2dyYW0gPSAwO1xuICAgICAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgICAgIHRoaXMudmVyc2lvbiA9IHNwZWMudmVyc2lvbiB8fCAnMS4wMCc7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMgPSB7fTtcbiAgICAgICAgICAgIC8vIGlmIGF0dHJpYnV0ZSBvcmRlcmluZyBpcyBwcm92aWRlZCwgdXNlIHRob3NlIGluZGljZXNcbiAgICAgICAgICAgIGlmIChzcGVjLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBzcGVjLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW2F0dHJdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHNoYWRlclxuICAgICAgICAgICAgQXN5bmMucGFyYWxsZWwoe1xuICAgICAgICAgICAgICAgIGNvbW1vbjogcmVzb2x2ZVNvdXJjZXMoc3BlYy5jb21tb24pLFxuICAgICAgICAgICAgICAgIHZlcnQ6IHJlc29sdmVTb3VyY2VzKHNwZWMudmVydCksXG4gICAgICAgICAgICAgICAgZnJhZzogcmVzb2x2ZVNvdXJjZXMoc3BlYy5mcmFnKSxcbiAgICAgICAgICAgIH0sIChlcnIsIHNvdXJjZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gb25jZSBhbGwgc2hhZGVyIHNvdXJjZXMgYXJlIGxvYWRlZFxuICAgICAgICAgICAgICAgIGNyZWF0ZVByb2dyYW0odGhpcywgc291cmNlcyk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSBzaGFkZXIgcHJvZ3JhbSBmb3IgdXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB1c2UoKSB7XG4gICAgICAgICAgICAvLyB1c2UgdGhlIHNoYWRlclxuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWZmZXIgYSB1bmlmb3JtIHZhbHVlIGJ5IG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIHVuaWZvcm0gbmFtZSBpbiB0aGUgc2hhZGVyIHNvdXJjZS5cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB1bmlmb3JtIHZhbHVlIHRvIGJ1ZmZlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7U2hhZGVyfSAtIFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRVbmlmb3JtKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgdW5pZm9ybSA9IHRoaXMudW5pZm9ybXNbbmFtZV07XG4gICAgICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBzcGVjIGV4aXN0cyBmb3IgdGhlIG5hbWVcbiAgICAgICAgICAgIGlmICghdW5pZm9ybSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBObyB1bmlmb3JtIGZvdW5kIHVuZGVyIG5hbWUgXFxgJHtuYW1lfVxcYGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB2YWx1ZVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBhcmd1bWVudCBpcyBkZWZpbmVkXG4gICAgICAgICAgICAgICAgdGhyb3cgYFZhbHVlIHBhc3NlZCBmb3IgdW5pZm9ybSBcXGAke25hbWV9XFxgIGlzIHVuZGVmaW5lZCBvciBudWxsYDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IGJvb2xlYW4ncyB0byAwIG9yIDFcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBpcyB0aGlzIG5lY2Vzc2FyeT9cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID8gMSA6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwYXNzIHRoZSBhcmd1bWVudHMgZGVwZW5kaW5nIG9uIHRoZSB0eXBlXG4gICAgICAgICAgICAvLyBUT0RPOiByZW1vdmUgc3RyaW5nIGNvbXBhcmlvbnMgZnJvbSBoZXJlLi4uXG4gICAgICAgICAgICBpZiAodW5pZm9ybS50eXBlID09PSAnbWF0MicgfHwgdW5pZm9ybS50eXBlID09PSAnbWF0MycgfHwgdW5pZm9ybS50eXBlID09PSAnbWF0NCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdsW3VuaWZvcm0uZnVuY10odW5pZm9ybS5sb2NhdGlvbiwgZmFsc2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nbFt1bmlmb3JtLmZ1bmNdKHVuaWZvcm0ubG9jYXRpb24sIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJ1ZmZlciBhIG1hcCBvZiB1bmlmb3JtIHZhbHVlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHVuaWZvcm1zIC0gVGhlIG1hcCBvZiB1bmlmb3JtcyBrZXllZCBieSBuYW1lLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRVbmlmb3JtcyhhcmdzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcmdzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VW5pZm9ybShuYW1lLCBhcmdzW25hbWVdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNoYWRlcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBsZXQgQ09NTUVOVFNfUkVHRVhQID0gLyhcXC9cXCooW1xcc1xcU10qPylcXCpcXC8pfChcXC9cXC8oLiopJCkvZ207XG4gICAgbGV0IEVORExJTkVfUkVHRVhQID0gLyhcXHJcXG58XFxufFxccikvZ207XG4gICAgbGV0IFdISVRFU1BBQ0VfUkVHRVhQID0gL1xcc3syLH0vZztcbiAgICBsZXQgQlJBQ0tFVF9XSElURVNQQUNFX1JFR0VYUCA9IC8oXFxzKikoXFxbKShcXHMqKShcXGQrKShcXHMqKShcXF0pKFxccyopL2c7XG4gICAgbGV0IE5BTUVfQ09VTlRfUkVHRVhQID0gLyhbYS16QS1aX11bYS16QS1aMC05X10qKSg/OlxcWyhcXGQrKVxcXSk/LztcbiAgICBsZXQgUFJFQ0lTSU9OX1JFR0VYID0gL1xcYnByZWNpc2lvblxccytcXHcrXFxzK1xcdys7L2c7XG4gICAgbGV0IElOTElORV9QUkVDSVNJT05fUkVHRVggPSAvXFxiKGhpZ2hwfG1lZGl1bXB8bG93cClcXHMrL2c7XG4gICAgbGV0IEdMU0xfUkVHRVhQID0gL3ZvaWRcXHMrbWFpblxccypcXChcXHMqKHZvaWQpKlxccypcXClcXHMqL21pO1xuICAgIGxldCBQUkVQX1JFR0VYUCA9IC8jKFtcXFdcXHdcXHNcXGRdKSg/Oi4qXFxcXHI/XFxuKSouKiQvZ207XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHN0YW5kYXJkIGNvbW1lbnRzIGZyb20gdGhlIHByb3ZpZGVkIHN0cmluZy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc3RyaXAgY29tbWVudHMgZnJvbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGNvbW1lbnRsZXNzIHN0cmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdHJpcENvbW1lbnRzKHN0cikge1xuICAgICAgICAvLyByZWdleCBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb2Fncml1cy9zdHJpcGNvbW1lbnRzXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShDT01NRU5UU19SRUdFWFAsICcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFuIHByZWNpc2lvbiBzdGF0ZW1lbnRzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHVucHJvY2Vzc2VkIHNvdXJjZSBjb2RlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgcHJvY2Vzc2VkIHNvdXJjZSBjb2RlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0cmlwUHJlY2lzaW9uKHNvdXJjZSkge1xuICAgICAgICAvLyByZW1vdmUgZ2xvYmFsIHByZWNpc2lvbiBkZWNsYXJhdGlvbnNcbiAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoUFJFQ0lTSU9OX1JFR0VYLCAnJyk7XG4gICAgICAgIC8vIHJlbW92ZSBpbmxpbmUgcHJlY2lzaW9uIGRlY2xhcmF0aW9uc1xuICAgICAgICByZXR1cm4gc291cmNlLnJlcGxhY2UoSU5MSU5FX1BSRUNJU0lPTl9SRUdFWCwgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGFsbCB3aGl0ZXNwYWNlIGludG8gYSBzaW5nbGUgJyAnIHNwYWNlIGNoYXJhY3Rlci5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gbm9ybWFsaXplIHdoaXRlc3BhY2UgZnJvbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVdoaXRlc3BhY2Uoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShFTkRMSU5FX1JFR0VYUCwgJyAnKSAvLyByZW1vdmUgbGluZSBlbmRpbmdzXG4gICAgICAgICAgICAucmVwbGFjZShXSElURVNQQUNFX1JFR0VYUCwgJyAnKSAvLyBub3JtYWxpemUgd2hpdGVzcGFjZSB0byBzaW5nbGUgJyAnXG4gICAgICAgICAgICAucmVwbGFjZShCUkFDS0VUX1dISVRFU1BBQ0VfUkVHRVhQLCAnJDIkNCQ2Jyk7IC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGluIGJyYWNrZXRzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2VzIHRoZSBuYW1lIGFuZCBjb3VudCBvdXQgb2YgYSBuYW1lIHN0YXRlbWVudCwgcmV0dXJuaW5nIHRoZSBkZWNsYXJhdGlvbiBvYmplY3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBxdWFsaWZpZXIgLSBUaGUgcXVhbGlmaWVyIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZW50cnkgLSBUaGUgdmFyaWFibGUgZGVjbGFyYXRpb24gc3RyaW5nLlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZGVjbGFyYXRpb24gb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlTmFtZUFuZENvdW50KHF1YWxpZmllciwgdHlwZSwgZW50cnkpIHtcbiAgICAgICAgLy8gZGV0ZXJtaW5lIG5hbWUgYW5kIHNpemUgb2YgdmFyaWFibGVcbiAgICAgICAgbGV0IG1hdGNoZXMgPSBlbnRyeS5tYXRjaChOQU1FX0NPVU5UX1JFR0VYUCk7XG4gICAgICAgIGxldCBuYW1lID0gbWF0Y2hlc1sxXTtcbiAgICAgICAgbGV0IGNvdW50ID0gKG1hdGNoZXNbMl0gPT09IHVuZGVmaW5lZCkgPyAxIDogcGFyc2VJbnQobWF0Y2hlc1syXSwgMTApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcXVhbGlmaWVyOiBxdWFsaWZpZXIsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlcyBhIHNpbmdsZSAnc3RhdGVtZW50Jy4gQSAnc3RhdGVtZW50JyBpcyBjb25zaWRlcmVkIGFueSBzZXF1ZW5jZSBvZlxuICAgICAqIGNoYXJhY3RlcnMgZm9sbG93ZWQgYnkgYSBzZW1pLWNvbG9uLiBUaGVyZWZvcmUsIGEgc2luZ2xlICdzdGF0ZW1lbnQnIGluXG4gICAgICogdGhpcyBzZW5zZSBjb3VsZCBjb250YWluIHNldmVyYWwgY29tbWEgc2VwYXJhdGVkIGRlY2xhcmF0aW9ucy4gUmV0dXJuc1xuICAgICAqIGFsbCByZXN1bHRpbmcgZGVjbGFyYXRpb25zLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGVtZW50IC0gVGhlIHN0YXRlbWVudCB0byBwYXJzZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2YgcGFyc2VkIGRlY2xhcmF0aW9uIG9iamVjdHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnQoc3RhdGVtZW50KSB7XG4gICAgICAgIC8vIHNwbGl0IHN0YXRlbWVudCBvbiBjb21tYXNcbiAgICAgICAgLy9cbiAgICAgICAgLy8gWyd1bmlmb3JtIG1hdDQgQVsxMF0nLCAnQicsICdDWzJdJ11cbiAgICAgICAgLy9cbiAgICAgICAgbGV0IHNwbGl0ID0gc3RhdGVtZW50LnNwbGl0KCcsJykubWFwKGVsZW0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0udHJpbSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzcGxpdCBkZWNsYXJhdGlvbiBoZWFkZXIgZnJvbSBzdGF0ZW1lbnRcbiAgICAgICAgLy9cbiAgICAgICAgLy8gWyd1bmlmb3JtJywgJ21hdDQnLCAnQVsxMF0nXVxuICAgICAgICAvL1xuICAgICAgICBsZXQgaGVhZGVyID0gc3BsaXQuc2hpZnQoKS5zcGxpdCgnICcpO1xuXG4gICAgICAgIC8vIHF1YWxpZmllciBpcyBhbHdheXMgZmlyc3QgZWxlbWVudFxuICAgICAgICAvL1xuICAgICAgICAvLyAndW5pZm9ybSdcbiAgICAgICAgLy9cbiAgICAgICAgbGV0IHF1YWxpZmllciA9IGhlYWRlci5zaGlmdCgpO1xuXG4gICAgICAgIC8vIHR5cGUgd2lsbCBiZSB0aGUgc2Vjb25kIGVsZW1lbnRcbiAgICAgICAgLy9cbiAgICAgICAgLy8gJ21hdDQnXG4gICAgICAgIC8vXG4gICAgICAgIGxldCB0eXBlID0gaGVhZGVyLnNoaWZ0KCk7XG5cbiAgICAgICAgLy8gbGFzdCBwYXJ0IG9mIGhlYWRlciB3aWxsIGJlIHRoZSBmaXJzdCwgYW5kIHBvc3NpYmxlIG9ubHkgdmFyaWFibGUgbmFtZVxuICAgICAgICAvL1xuICAgICAgICAvLyBbJ0FbMTBdJywgJ0InLCAnQ1syXSddXG4gICAgICAgIC8vXG4gICAgICAgIGxldCBuYW1lcyA9IGhlYWRlci5jb25jYXQoc3BsaXQpO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBvdGhlciBuYW1lcyBhZnRlciBhICcsJyBhZGQgdGhlbSBhcyB3ZWxsXG4gICAgICAgIHJldHVybiBuYW1lcy5tYXAobmFtZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VOYW1lQW5kQ291bnQocXVhbGlmaWVyLCB0eXBlLCBuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3BsaXRzIHRoZSBzb3VyY2Ugc3RyaW5nIGJ5IHNlbWktY29sb25zIGFuZCBjb25zdHJ1Y3RzIGFuIGFycmF5IG9mXG4gICAgICogZGVjbGFyYXRpb24gb2JqZWN0cyBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgcXVhbGlmaWVyIGtleXdvcmRzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2Ugc3RyaW5nLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBrZXl3b3JkcyAtIFRoZSBxdWFsaWZpZXIgZGVjbGFyYXRpb24ga2V5d29yZHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGFycmF5IG9mIHF1YWxpZmllciBkZWNsYXJhdGlvbiBvYmplY3RzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlU291cmNlKHNvdXJjZSwga2V5d29yZHMpIHtcbiAgICAgICAgLy8gZ2V0IGluZGl2aWR1YWwgc3RhdGVtZW50cyAoYW55IHNlcXVlbmNlIGVuZGluZyBpbiA7KVxuICAgICAgICBsZXQgc3RhdGVtZW50cyA9IHNvdXJjZS5zcGxpdCgnOycpO1xuICAgICAgICAvLyBidWlsZCByZWdleCBmb3IgcGFyc2luZyBzdGF0ZW1lbnRzIHdpdGggdGFyZ2V0dGVkIGtleXdvcmRzXG4gICAgICAgIGxldCBrZXl3b3JkU3RyID0ga2V5d29yZHMuam9pbignfCcpO1xuICAgICAgICBsZXQga2V5d29yZFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXGIoJyArIGtleXdvcmRTdHIgKyAnKVxcXFxiLionKTtcbiAgICAgICAgLy8gcGFyc2UgYW5kIHN0b3JlIGdsb2JhbCBwcmVjaXNpb24gc3RhdGVtZW50cyBhbmQgYW55IGRlY2xhcmF0aW9uc1xuICAgICAgICBsZXQgbWF0Y2hlZCA9IFtdO1xuICAgICAgICAvLyBmb3IgZWFjaCBzdGF0ZW1lbnRcbiAgICAgICAgc3RhdGVtZW50cy5mb3JFYWNoKHN0YXRlbWVudCA9PiB7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3Iga2V5d29yZHNcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBbJ3VuaWZvcm0gZmxvYXQgdVRpbWUnXVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGxldCBrbWF0Y2ggPSBzdGF0ZW1lbnQubWF0Y2goa2V5d29yZFJlZ2V4KTtcbiAgICAgICAgICAgIGlmIChrbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBzdGF0ZW1lbnQgYW5kIGFkZCB0byBhcnJheVxuICAgICAgICAgICAgICAgIG1hdGNoZWQgPSBtYXRjaGVkLmNvbmNhdChwYXJzZVN0YXRlbWVudChrbWF0Y2hbMF0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbHRlcnMgb3V0IGR1cGxpY2F0ZSBkZWNsYXJhdGlvbnMgcHJlc2VudCBiZXR3ZWVuIHNoYWRlcnMuIEN1cnJlbnRseVxuICAgICAqIGp1c3QgcmVtb3ZlcyBhbGwgIyBzdGF0ZW1lbnRzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBkZWNsYXJhdGlvbnMgLSBUaGUgYXJyYXkgb2YgZGVjbGFyYXRpb25zLlxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBmaWx0ZXJlZCBhcnJheSBvZiBkZWNsYXJhdGlvbnMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyRHVwbGljYXRlc0J5TmFtZShkZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgLy8gaW4gY2FzZXMgd2hlcmUgdGhlIHNhbWUgZGVjbGFyYXRpb25zIGFyZSBwcmVzZW50IGluIG11bHRpcGxlXG4gICAgICAgIC8vIHNvdXJjZXMsIHRoaXMgZnVuY3Rpb24gd2lsbCByZW1vdmUgZHVwbGljYXRlcyBmcm9tIHRoZSByZXN1bHRzXG4gICAgICAgIGxldCBzZWVuID0ge307XG4gICAgICAgIHJldHVybiBkZWNsYXJhdGlvbnMuZmlsdGVyKGRlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgICAgIGlmIChzZWVuW2RlY2xhcmF0aW9uLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VlbltkZWNsYXJhdGlvbi5uYW1lXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVucyB0aGUgcHJlcHJvY2Vzc29yIG9uIHRoZSBnbHNsIGNvZGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgdW5wcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBwcm9jZXNzZWQgc291cmNlIGNvZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcHJlcHJvY2Vzcyhzb3VyY2UpIHtcbiAgICAgICAgLy8gVE9ETzogaW1wbGVtZW50IHRoaXMgY29ycmVjdGx5Li4uXG4gICAgICAgIHJldHVybiBzb3VyY2UucmVwbGFjZShQUkVQX1JFR0VYUCwgJycpO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQYXJzZXMgdGhlIHByb3ZpZGVkIEdMU0wgc291cmNlLCBhbmQgcmV0dXJucyBhbGwgZGVjbGFyYXRpb24gc3RhdGVtZW50cyB0aGF0IGNvbnRhaW4gdGhlIHByb3ZpZGVkIHF1YWxpZmllciB0eXBlLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGV4dHJhY3QgYWxsIGF0dHJpYnV0ZXMgYW5kIHVuaWZvcm0gbmFtZXMgYW5kIHR5cGVzIGZyb20gYSBzaGFkZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEZvciBleGFtcGxlLCB3aGVuIHByb3ZpZGVkIGEgJ3VuaWZvcm0nIHF1YWxpZmllcnMsIHRoZSBkZWNsYXJhdGlvbjpcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICd1bmlmb3JtIGhpZ2hwIHZlYzMgdVNwZWN1bGFyQ29sb3I7J1xuICAgICAgICAgKlxuICAgICAgICAgKiBXb3VsZCBiZSBwYXJzZWQgdG86XG4gICAgICAgICAqICAgICB7XG4gICAgICAgICAqICAgICAgICAgcXVhbGlmaWVyOiAndW5pZm9ybScsXG4gICAgICAgICAqICAgICAgICAgdHlwZTogJ3ZlYzMnLFxuICAgICAgICAgKiAgICAgICAgIG5hbWU6ICd1U3BlY3VsYXJDb2xvcicsXG4gICAgICAgICAqICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gc291cmNlcyAtIFRoZSBzaGFkZXIgc291cmNlcy5cbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gcXVhbGlmaWVycyAtIFRoZSBxdWFsaWZpZXJzIHRvIGV4dHJhY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIHN0YXRlbWVudHMuXG4gICAgICAgICAqL1xuICAgICAgICBwYXJzZURlY2xhcmF0aW9uczogZnVuY3Rpb24oc291cmNlcyA9IFtdLCBxdWFsaWZpZXJzID0gW10pIHtcbiAgICAgICAgICAgIC8vIGlmIG5vIHNvdXJjZXMgb3IgcXVhbGlmaWVycyBhcmUgcHJvdmlkZWQsIHJldHVybiBlbXB0eSBhcnJheVxuICAgICAgICAgICAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAwIHx8IHF1YWxpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc291cmNlcyA9IEFycmF5LmlzQXJyYXkoc291cmNlcykgPyBzb3VyY2VzIDogW3NvdXJjZXNdO1xuICAgICAgICAgICAgcXVhbGlmaWVycyA9IEFycmF5LmlzQXJyYXkocXVhbGlmaWVycykgPyBxdWFsaWZpZXJzIDogW3F1YWxpZmllcnNdO1xuICAgICAgICAgICAgLy8gcGFyc2Ugb3V0IHRhcmdldHRlZCBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgIGxldCBkZWNsYXJhdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIHNvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHJ1biBwcmVwcm9jZXNzb3JcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBwcmVwcm9jZXNzKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHByZWNpc2lvbiBzdGF0ZW1lbnRzXG4gICAgICAgICAgICAgICAgc291cmNlID0gc3RyaXBQcmVjaXNpb24oc291cmNlKTtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgY29tbWVudHNcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBzdHJpcENvbW1lbnRzKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgLy8gZmluYWxseSwgbm9ybWFsaXplIHRoZSB3aGl0ZXNwYWNlXG4gICAgICAgICAgICAgICAgc291cmNlID0gbm9ybWFsaXplV2hpdGVzcGFjZShzb3VyY2UpO1xuICAgICAgICAgICAgICAgIC8vIHBhcnNlIG91dCBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnMuY29uY2F0KHBhcnNlU291cmNlKHNvdXJjZSwgcXVhbGlmaWVycykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyByZW1vdmUgZHVwbGljYXRlcyBhbmQgcmV0dXJuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyRHVwbGljYXRlc0J5TmFtZShkZWNsYXJhdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlY3RzIGJhc2VkIG9uIHRoZSBleGlzdGVuY2Ugb2YgYSAndm9pZCBtYWluKCkgeycgc3RhdGVtZW50LCBpZiB0aGUgc3RyaW5nIGlzIGdsc2wgc291cmNlIGNvZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIHRlc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBzdHJpbmcgaXMgZ2xzbCBjb2RlLlxuICAgICAgICAgKi9cbiAgICAgICAgaXNHTFNMOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBHTFNMX1JFR0VYUC50ZXN0KHN0cik7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG4gICAgbGV0IFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKTtcblxuICAgIGxldCBNQUdfRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgTUlOX0ZJTFRFUlMgPSB7XG4gICAgICAgIE5FQVJFU1Q6IHRydWUsXG4gICAgICAgIExJTkVBUjogdHJ1ZSxcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgTk9OX01JUE1BUF9NSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlLFxuICAgIH07XG4gICAgbGV0IE1JUE1BUF9NSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBORUFSRVNUX01JUE1BUF9MSU5FQVI6IHRydWUsXG4gICAgICAgIExJTkVBUl9NSVBNQVBfTElORUFSOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgV1JBUF9NT0RFUyA9IHtcbiAgICAgICAgUkVQRUFUOiB0cnVlLFxuICAgICAgICBNSVJST1JFRF9SRVBFQVQ6IHRydWUsXG4gICAgICAgIENMQU1QX1RPX0VER0U6IHRydWVcbiAgICB9O1xuICAgIGxldCBERVBUSF9UWVBFUyA9IHtcbiAgICAgICAgREVQVEhfQ09NUE9ORU5UOiB0cnVlLFxuICAgICAgICBERVBUSF9TVEVOQ0lMOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHR5cGUgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1RZUEUgPSAnVU5TSUdORURfQllURSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3JtYXQgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0ZPUk1BVCA9ICdSR0JBJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHdyYXAgbW9kZSBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfV1JBUCA9ICdSRVBFQVQnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgbWluIC8gbWFnIGZpbHRlciBmb3IgdGV4dHVyZXMuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfRklMVEVSID0gJ0xJTkVBUic7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBhbHBoYSBwcmVtdWx0aXBseWluZyBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIG1pcG1hcHBpbmcgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9NSVBNQVAgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgaW52ZXJ0LXkgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9JTlZFUlRfWSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBtaXAtbWFwcGluZyBmaWx0ZXIgc3VmZml4LlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX01JUE1BUF9NSU5fRklMVEVSX1NVRkZJWCA9ICdfTUlQTUFQX0xJTkVBUic7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgVGV4dHVyZTJEXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgMkQgdGV4dHVyZS5cbiAgICAgKi9cbiAgICBjbGFzcyBUZXh0dXJlMkQge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBUZXh0dXJlMkQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1VpbnQ4QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl8RmxvYXQzMkFycmF5fEltYWdlRGF0YXxIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fEhUTUxWaWRlb0VsZW1lbnR9IHNwZWMuc3JjIC0gVGhlIGRhdGEgdG8gYnVmZmVyLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5taXBNYXAgLSBXaGV0aGVyIG9yIG5vdCBtaXAtbWFwcGluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMuaW52ZXJ0WSAtIFdoZXRoZXIgb3Igbm90IGludmVydC15IGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVNdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30pIHtcbiAgICAgICAgICAgIC8vIGdldCBzcGVjaWZpYyBwYXJhbXNcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPSBzcGVjLndyYXBTIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMud3JhcFQgPSBzcGVjLndyYXBUIHx8IHNwZWMud3JhcDtcbiAgICAgICAgICAgIHNwZWMubWluRmlsdGVyID0gc3BlYy5taW5GaWx0ZXIgfHwgc3BlYy5maWx0ZXI7XG4gICAgICAgICAgICBzcGVjLm1hZ0ZpbHRlciA9IHNwZWMubWFnRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgLy8gc2V0IGNvbnRleHRcbiAgICAgICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgICAgICAvLyBlbXB0eSB0ZXh0dXJlXG4gICAgICAgICAgICB0aGlzLnRleHR1cmUgPSBudWxsO1xuICAgICAgICAgICAgLy8gc2V0IHRleHR1cmUgcGFyYW1zXG4gICAgICAgICAgICB0aGlzLndyYXBTID0gc3BlYy53cmFwUyB8fCBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICB0aGlzLndyYXBUID0gc3BlYy53cmFwVCB8fCBERUZBVUxUX1dSQVA7XG4gICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgdGhpcy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBERUZBVUxUX0ZJTFRFUjtcbiAgICAgICAgICAgIC8vIHNldCBvdGhlciBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB0aGlzLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IERFRkFVTFRfTUlQTUFQO1xuICAgICAgICAgICAgdGhpcy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBERUZBVUxUX0lOVkVSVF9ZO1xuICAgICAgICAgICAgdGhpcy5wcmVNdWx0aXBseUFscGhhID0gc3BlYy5wcmVNdWx0aXBseUFscGhhICE9PSB1bmRlZmluZWQgPyBzcGVjLnByZU11bHRpcGx5QWxwaGEgOiBERUZBVUxUX1BSRU1VTFRJUExZX0FMUEhBO1xuICAgICAgICAgICAgLy8gc2V0IGZvcm1hdFxuICAgICAgICAgICAgdGhpcy5mb3JtYXQgPSBzcGVjLmZvcm1hdCB8fCBERUZBVUxUX0ZPUk1BVDtcbiAgICAgICAgICAgIGlmIChERVBUSF9UWVBFU1t0aGlzLmZvcm1hdF0gJiYgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbignV0VCR0xfZGVwdGhfdGV4dHVyZScpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYENhbm5vdCBjcmVhdGUgVGV4dHVyZTJEIG9mIGZvcm1hdCBcXGAke3RoaXMuZm9ybWF0fVxcYCBhcyBcXGBXRUJHTF9kZXB0aF90ZXh0dXJlXFxgIGV4dGVuc2lvbiBpcyB1bnN1cHBvcnRlZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgdHlwZVxuICAgICAgICAgICAgdGhpcy50eXBlID0gc3BlYy50eXBlIHx8IERFRkFVTFRfVFlQRTtcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdGTE9BVCcgJiYgIVdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbignT0VTX3RleHR1cmVfZmxvYXQnKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBDYW5ub3QgY3JlYXRlIFRleHR1cmUyRCBvZiB0eXBlIFxcYEZMT0FUXFxgIGFzIFxcYE9FU190ZXh0dXJlX2Zsb2F0XFxgIGV4dGVuc2lvbiBpcyB1bnN1cHBvcnRlZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cmwgd2lsbCBub3QgYmUgcmVzb2x2ZWQgeWV0LCBzbyBkb24ndCBidWZmZXIgaW4gdGhhdCBjYXNlXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwZWMuc3JjICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHNpemVcbiAgICAgICAgICAgICAgICBpZiAoIVV0aWwuaXNDYW52YXNUeXBlKHNwZWMuc3JjKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBub3QgYSBjYW52YXMgdHlwZSwgZGltZW5zaW9ucyBNVVNUIGJlIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNwZWMud2lkdGggIT09ICdudW1iZXInIHx8IHNwZWMud2lkdGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ2B3aWR0aGAgYXJndW1lbnQgaXMgbWlzc2luZyBvciBpbnZhbGlkJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNwZWMuaGVpZ2h0ICE9PSAnbnVtYmVyJyB8fCBzcGVjLmhlaWdodCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnYGhlaWdodGAgYXJndW1lbnQgaXMgbWlzc2luZyBvciBpbnZhbGlkJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoVXRpbC5tdXN0QmVQb3dlck9mVHdvKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVV0aWwuaXNQb3dlck9mVHdvKHNwZWMud2lkdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFBhcmFtZXRlcnMgcmVxdWlyZSBhIHBvd2VyLW9mLXR3byB0ZXh0dXJlLCB5ZXQgcHJvdmlkZWQgd2lkdGggb2YgXFxgJHtzcGVjLndpZHRofVxcYCBpcyBub3QgYSBwb3dlciBvZiB0d29gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzUG93ZXJPZlR3byhzcGVjLmhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgUGFyYW1ldGVycyByZXF1aXJlIGEgcG93ZXItb2YtdHdvIHRleHR1cmUsIHlldCBwcm92aWRlZCBoZWlnaHQgb2YgXFxgJHtzcGVjLmhlaWdodH1cXGAgaXMgbm90IGEgcG93ZXIgb2YgdHdvYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBidWZmZXIgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoc3BlYy5zcmMgfHwgbnVsbCwgc3BlYy53aWR0aCwgc3BlYy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgdG8gdGhlIHByb3ZpZGVkIHRleHR1cmUgdW5pdCBsb2NhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC4gRGVmYXVsdHMgdG8gMC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJpbmQobG9jYXRpb24gPSAwKSB7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobG9jYXRpb24pIHx8IGxvY2F0aW9uIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHVuaXQgbG9jYXRpb24gaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBiaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsWydURVhUVVJFJyArIGxvY2F0aW9uXSk7XG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQnVmZmVyIGRhdGEgaW50byB0aGUgdGV4dHVyZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtBcnJheXxBcnJheUJ1ZmZlclZpZXd8bnVsbH0gZGF0YSAtIFRoZSBkYXRhIGFycmF5IHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBkYXRhLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJ1ZmZlckRhdGEoZGF0YSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0ZXh0dXJlIG9iamVjdCBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3RcbiAgICAgICAgICAgIGlmICghdGhpcy50ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYmluZCB0ZXh0dXJlXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuICAgICAgICAgICAgLy8gaW52ZXJ0IHkgaWYgc3BlY2lmaWVkXG4gICAgICAgICAgICBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkpO1xuICAgICAgICAgICAgLy8gcHJlbXVsdGlwbHkgYWxwaGEgaWYgc3BlY2lmaWVkXG4gICAgICAgICAgICBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIHRoaXMucHJlTXVsdGlwbHlBbHBoYSk7XG4gICAgICAgICAgICAvLyBjYXN0IGFycmF5IGFyZ1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnVU5TSUdORURfU0hPUlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDE2QXJyYXkoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9JTlQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDMyQXJyYXkoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdGTE9BVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBlbnN1cmUgdHlwZSBjb3JyZXNwb25kcyB0byBkYXRhXG4gICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnVU5TSUdORURfQllURSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50MTZBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9TSE9SVCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50MzJBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9JTlQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ0ZMT0FUJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSAmJiAhKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgJiYgIVV0aWwuaXNDYW52YXNUeXBlKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2BBcnJheUJ1ZmZlclZpZXdgLCBgSW1hZ2VEYXRhYCwgYEhUTUxJbWFnZUVsZW1lbnRgLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2BIVE1MQ2FudmFzRWxlbWVudGAsIGBIVE1MVmlkZW9FbGVtZW50YCwgb3IgbnVsbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAvLyBzdG9yZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgICAgICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmVcbiAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxuICAgICAgICAgICAgICAgICAgICAwLCAvLyBtaXAtbWFwIGxldmVsLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLnR5cGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgd2lkdGggYW5kIGhlaWdodFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCB0aGlzLndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG4gICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcbiAgICAgICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSxcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy50eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBtaXAgbWFwc1xuICAgICAgICAgICAgaWYgKHRoaXMubWlwTWFwKSB7XG4gICAgICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHRleHR1cmUgcGFyYW1ldGVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbWV0ZXJzIGJ5IG5hbWUuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwUyAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFMgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXBUIC0gVGhlIHdyYXBwaW5nIHR5cGUgb3ZlciB0aGUgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5taW5GaWx0ZXIgLSBUaGUgbWluaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLm1hZ0ZpbHRlciAtIFRoZSBtYWduaWZpY2F0aW9uIGZpbHRlciB1c2VkIGR1cmluZyBzY2FsaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0UGFyYW1ldGVycyhwYXJhbXMpIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBiaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG4gICAgICAgICAgICAvLyBzZXQgd3JhcCBTIHBhcmFtZXRlclxuICAgICAgICAgICAgbGV0IHBhcmFtID0gcGFyYW1zLndyYXBTIHx8IHBhcmFtcy53cmFwO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3JhcFMgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbdGhpcy53cmFwU10pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9XUkFQX1NcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCB3cmFwIFQgcGFyYW1ldGVyXG4gICAgICAgICAgICBwYXJhbSA9IHBhcmFtcy53cmFwVCB8fCBwYXJhbXMud3JhcDtcbiAgICAgICAgICAgIGlmIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmIChXUkFQX01PREVTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndyYXBUID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsW3RoaXMud3JhcFRdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfV1JBUF9UXFxgYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgbWFnIGZpbHRlciBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHBhcmFtID0gcGFyYW1zLm1hZ0ZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1BR19GSUxURVJTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbdGhpcy5tYWdGaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yICdURVhUVVJFX01BR19GSUxURVJcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBtaW4gZmlsdGVyIHBhcmFtZXRlclxuICAgICAgICAgICAgcGFyYW0gPSBwYXJhbXMubWluRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taXBNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGdyYWRlIHRvIG1pcC1tYXAgbWluIGZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW0gKz0gREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1JUE1BUF9NSU5fRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2l6ZSB0aGUgdW5kZXJseWluZyB0ZXh0dXJlLiBUaGlzIGNsZWFycyB0aGUgdGV4dHVyZSBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgbmV3IHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIG5ldyBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICByZXNpemUod2lkdGgsIGhlaWdodCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgKHdpZHRoIDw9IDApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIHdpZHRoIG9mIFxcYCR7d2lkdGh9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IChoZWlnaHQgPD0gMCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgaGVpZ2h0IG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YShudWxsLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlMkQ7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG4gICAgbGV0IEFzeW5jID0gcmVxdWlyZSgnLi4vdXRpbC9Bc3luYycpO1xuICAgIGxldCBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyk7XG4gICAgbGV0IEltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi4vdXRpbC9JbWFnZUxvYWRlcicpO1xuXG4gICAgbGV0IEZBQ0VTID0gW1xuICAgICAgICAnLXgnLCAnK3gnLFxuICAgICAgICAnLXknLCAnK3knLFxuICAgICAgICAnLXonLCAnK3onXG4gICAgXTtcbiAgICBsZXQgRkFDRV9UQVJHRVRTID0ge1xuICAgICAgICAnK3onOiAnVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9aJyxcbiAgICAgICAgJy16JzogJ1RFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWicsXG4gICAgICAgICcreCc6ICdURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gnLFxuICAgICAgICAnLXgnOiAnVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9YJyxcbiAgICAgICAgJyt5JzogJ1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWScsXG4gICAgICAgICcteSc6ICdURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1knXG4gICAgfTtcbiAgICBsZXQgVEFSR0VUUyA9IHtcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9aOiB0cnVlLFxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1o6IHRydWUsXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWDogdHJ1ZSxcbiAgICAgICAgVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9YOiB0cnVlLFxuICAgICAgICBURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1k6IHRydWUsXG4gICAgICAgIFRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWTogdHJ1ZVxuICAgIH07XG4gICAgbGV0IE1BR19GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBNSU5fRklMVEVSUyA9IHtcbiAgICAgICAgTkVBUkVTVDogdHJ1ZSxcbiAgICAgICAgTElORUFSOiB0cnVlLFxuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBOT05fTUlQTUFQX01JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVI6IHRydWUsXG4gICAgfTtcbiAgICBsZXQgTUlQTUFQX01JTl9GSUxURVJTID0ge1xuICAgICAgICBORUFSRVNUX01JUE1BUF9ORUFSRVNUOiB0cnVlLFxuICAgICAgICBMSU5FQVJfTUlQTUFQX05FQVJFU1Q6IHRydWUsXG4gICAgICAgIE5FQVJFU1RfTUlQTUFQX0xJTkVBUjogdHJ1ZSxcbiAgICAgICAgTElORUFSX01JUE1BUF9MSU5FQVI6IHRydWVcbiAgICB9O1xuICAgIGxldCBXUkFQX01PREVTID0ge1xuICAgICAgICBSRVBFQVQ6IHRydWUsXG4gICAgICAgIE1JUlJPUkVEX1JFUEVBVDogdHJ1ZSxcbiAgICAgICAgQ0xBTVBfVE9fRURHRTogdHJ1ZVxuICAgIH07XG4gICAgbGV0IEZPUk1BVFMgPSB7XG4gICAgICAgIFJHQjogdHJ1ZSxcbiAgICAgICAgUkdCQTogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCB0eXBlIGZvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9UWVBFID0gJ1VOU0lHTkVEX0JZVEUnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9ybWF0IGZvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9GT1JNQVQgPSAnUkdCQSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCB3cmFwIG1vZGUgZm9yIHRleHR1cmVzLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX1dSQVAgPSAnQ0xBTVBfVE9fRURHRSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBtaW4gLyBtYWcgZmlsdGVyIGZvciB0ZXh0dXJlcy5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9GSUxURVIgPSAnTElORUFSJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGZvciB3aGV0aGVyIGFscGhhIHByZW11bHRpcGx5aW5nIGlzIGVuYWJsZWQuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEEgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yIHdoZXRoZXIgbWlwbWFwcGluZyBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX01JUE1BUCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBmb3Igd2hldGhlciBpbnZlcnQteSBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0lOVkVSVF9ZID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG1pcC1tYXBwaW5nIGZpbHRlciBzdWZmaXguXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfTUlQTUFQX01JTl9GSUxURVJfU1VGRklYID0gJ19NSVBNQVBfTElORUFSJztcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY3ViZW1hcCBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZlxuICAgICAqIGl0IGRvZXMgbm90IG1lZXQgcmVxdWlyZW1lbnRzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIHRleHR1cmUgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoZWNrRGltZW5zaW9ucyhjdWJlTWFwKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY3ViZU1hcC53aWR0aCAhPT0gJ251bWJlcicgfHwgY3ViZU1hcC53aWR0aCA8PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnYHdpZHRoYCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY3ViZU1hcC5oZWlnaHQgIT09ICdudW1iZXInIHx8IGN1YmVNYXAuaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgIHRocm93ICdgaGVpZ2h0YCBhcmd1bWVudCBpcyBtaXNzaW5nIG9yIGludmFsaWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdWJlTWFwLndpZHRoICE9PSBjdWJlTWFwLmhlaWdodCkge1xuICAgICAgICAgICAgdGhyb3cgJ1Byb3ZpZGVkIGB3aWR0aGAgbXVzdCBiZSBlcXVhbCB0byBgaGVpZ2h0YCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFV0aWwubXVzdEJlUG93ZXJPZlR3byhjdWJlTWFwKSAmJiAhVXRpbC5pc1Bvd2VyT2ZUd28oY3ViZU1hcC53aWR0aCkpIHtcbiAgICAgICAgICAgIHRocm93IGBQYXJhbWV0ZXJzIHJlcXVpcmUgYSBwb3dlci1vZi10d28gdGV4dHVyZSwgeWV0IHByb3ZpZGVkIHNpemUgb2YgJHtjdWJlTWFwLndpZHRofSBpcyBub3QgYSBwb3dlciBvZiB0d29gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgYSBmYWNlIGZyb20gYSB1cmwuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IGN1YmVNYXAgLSBUaGUgY3ViZSBtYXAgdGV4dHVyZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldCAtIFRoZSB0ZXh0dXJlIHRhcmdldC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCB0byBsb2FkIHRoZSBmYWNlIGZyb20uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGxvYWRlciBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkRmFjZVVSTChjdWJlTWFwLCB0YXJnZXQsIHVybCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgLy8gVE9ETzogcHV0IGV4dGVuc2lvbiBoYW5kbGluZyBmb3IgYXJyYXlidWZmZXIgLyBpbWFnZSAvIHZpZGVvIGRpZmZlcmVudGlhdGlvblxuICAgICAgICAgICAgSW1hZ2VMb2FkZXIubG9hZCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbWFnZSA9IFV0aWwucmVzaXplQ2FudmFzKGN1YmVNYXAsIGltYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgY3ViZU1hcC5idWZmZXJEYXRhKHRhcmdldCwgaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICBkb25lKG51bGwpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhIGNhbnZhcyB0eXBlIG9iamVjdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0LlxuICAgICAqIEBwYXJhbSB7SW1hZ2VEYXRhfEhUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gY2FudmFzIC0gVGhlIGNhbnZhcyB0eXBlIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIFRoZSBsb2FkZXIgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9hZEZhY2VDYW52YXMoY3ViZU1hcCwgdGFyZ2V0LCBjYW52YXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgICAgIGNhbnZhcyA9IFV0aWwucmVzaXplQ2FudmFzKGN1YmVNYXAsIGNhbnZhcyk7XG4gICAgICAgICAgICBjdWJlTWFwLmJ1ZmZlckRhdGEodGFyZ2V0LCBjYW52YXMpO1xuICAgICAgICAgICAgZG9uZShudWxsKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhIGZhY2UgZnJvbSBhbiBhcnJheSB0eXBlIG9iamVjdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCB0ZXh0dXJlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0LlxuICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBhcnIgLSBUaGUgYXJyYXkgdHlwZSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGxvYWRlciBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkRmFjZUFycmF5KGN1YmVNYXAsIHRhcmdldCwgYXJyKSB7XG4gICAgICAgIGNoZWNrRGltZW5zaW9ucyhjdWJlTWFwKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgICAgIGN1YmVNYXAuYnVmZmVyRGF0YSh0YXJnZXQsIGFycik7XG4gICAgICAgICAgICBkb25lKG51bGwpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBUZXh0dXJlQ3ViZU1hcFxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIGN1YmUgbWFwIHRleHR1cmUuXG4gICAgICovXG4gICAgY2xhc3MgVGV4dHVyZUN1YmVNYXAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBUZXh0dXJlQ3ViZU1hcCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHNwZWNpZmljYXRpb24gYXJndW1lbnRzXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjLmZhY2VzIC0gVGhlIGZhY2VzIHRvIGJ1ZmZlciwgdW5kZXIga2V5cyAnK3gnLCAnK3knLCAnK3onLCAnLXgnLCAnLXknLCBhbmQgJy16Jy5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWMud2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGZhY2VzLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBmYWNlcy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgYm90aCBTIGFuZCBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMud3JhcFQgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBUIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZmlsdGVyIC0gVGhlIG1pbiAvIG1hZyBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMubWFnRmlsdGVyIC0gVGhlIG1hZ25pZmljYXRpb24gZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5taXBNYXAgLSBXaGV0aGVyIG9yIG5vdCBtaXAtbWFwcGluZyBpcyBlbmFibGVkLlxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2x9IHNwZWMuaW52ZXJ0WSAtIFdoZXRoZXIgb3Igbm90IGludmVydC15IGlzIGVuYWJsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gc3BlYy5wcmVNdWx0aXBseUFscGhhIC0gV2hldGhlciBvciBub3QgYWxwaGEgcHJlbXVsdGlwbHlpbmcgaXMgZW5hYmxlZC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNwZWMuZm9ybWF0IC0gVGhlIHRleHR1cmUgcGl4ZWwgZm9ybWF0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3BlYy50eXBlIC0gVGhlIHRleHR1cmUgcGl4ZWwgY29tcG9uZW50IHR5cGUuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihzcGVjID0ge30sIGNhbGxiYWNrID0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZSA9IG51bGw7XG4gICAgICAgICAgICAvLyBnZXQgc3BlY2lmaWMgcGFyYW1zXG4gICAgICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwUyB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLndyYXBUID0gc3BlYy53cmFwVCB8fCBzcGVjLndyYXA7XG4gICAgICAgICAgICBzcGVjLm1pbkZpbHRlciA9IHNwZWMubWluRmlsdGVyIHx8IHNwZWMuZmlsdGVyO1xuICAgICAgICAgICAgc3BlYy5tYWdGaWx0ZXIgPSBzcGVjLm1hZ0ZpbHRlciB8fCBzcGVjLmZpbHRlcjtcbiAgICAgICAgICAgIC8vIHNldCB0ZXh0dXJlIHBhcmFtc1xuICAgICAgICAgICAgdGhpcy53cmFwUyA9IFdSQVBfTU9ERVNbc3BlYy53cmFwU10gPyBzcGVjLndyYXBTIDogREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgdGhpcy53cmFwVCA9IFdSQVBfTU9ERVNbc3BlYy53cmFwVF0gPyBzcGVjLndyYXBUIDogREVGQVVMVF9XUkFQO1xuICAgICAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBNSU5fRklMVEVSU1tzcGVjLm1pbkZpbHRlcl0gPyBzcGVjLm1pbkZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgdGhpcy5tYWdGaWx0ZXIgPSBNQUdfRklMVEVSU1tzcGVjLm1hZ0ZpbHRlcl0gPyBzcGVjLm1hZ0ZpbHRlciA6IERFRkFVTFRfRklMVEVSO1xuICAgICAgICAgICAgLy8gc2V0IG90aGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogREVGQVVMVF9NSVBNQVA7XG4gICAgICAgICAgICB0aGlzLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IERFRkFVTFRfSU5WRVJUX1k7XG4gICAgICAgICAgICB0aGlzLnByZU11bHRpcGx5QWxwaGEgPSBzcGVjLnByZU11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCA/IHNwZWMucHJlTXVsdGlwbHlBbHBoYSA6IERFRkFVTFRfUFJFTVVMVElQTFlfQUxQSEE7XG4gICAgICAgICAgICAvLyBzZXQgZm9ybWF0IGFuZCB0eXBlXG4gICAgICAgICAgICB0aGlzLmZvcm1hdCA9IEZPUk1BVFNbc3BlYy5mb3JtYXRdID8gc3BlYy5mb3JtYXQgOiBERUZBVUxUX0ZPUk1BVDtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZSB8fCBERUZBVUxUX1RZUEU7XG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnRkxPQVQnICYmICFXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oJ09FU190ZXh0dXJlX2Zsb2F0JykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgdHlwZSBgRkxPQVRgIGFzIGBPRVNfdGV4dHVyZV9mbG9hdGAgZXh0ZW5zaW9uIGlzIHVuc3VwcG9ydGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBkaW1lbnNpb25zIGlmIHByb3ZpZGVkXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gc3BlYy53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gc3BlYy5oZWlnaHQ7XG4gICAgICAgICAgICAvLyBzZXQgYnVmZmVyZWQgZmFjZXNcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyZWRGYWNlcyA9IFtdO1xuICAgICAgICAgICAgLy8gY3JlYXRlIGN1YmUgbWFwIGJhc2VkIG9uIGlucHV0XG4gICAgICAgICAgICBpZiAoc3BlYy5mYWNlcykge1xuICAgICAgICAgICAgICAgIGxldCB0YXNrcyA9IFtdO1xuICAgICAgICAgICAgICAgIEZBQ0VTLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmFjZSA9IHNwZWMuZmFjZXNbaWRdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0ID0gRkFDRV9UQVJHRVRTW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9hZCBiYXNlZCBvbiB0eXBlXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVybFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChsb2FkRmFjZVVSTCh0aGlzLCB0YXJnZXQsIGZhY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChVdGlsLmlzQ2FudmFzVHlwZShmYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKGxvYWRGYWNlQ2FudmFzKHRoaXMsIHRhcmdldCwgZmFjZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJyYXkgLyBhcnJheWJ1ZmZlciBvciBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKGxvYWRGYWNlQXJyYXkodGhpcywgdGFyZ2V0LCBmYWNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBBc3luYy5wYXJhbGxlbCh0YXNrcywgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHBhcmFtZXRlcnNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbnVsbFxuICAgICAgICAgICAgICAgIGNoZWNrRGltZW5zaW9ucyh0aGlzKTtcbiAgICAgICAgICAgICAgICBGQUNFUy5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKEZBQ0VfVEFSR0VUU1tpZF0sIG51bGwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIHNldCBwYXJhbWV0ZXJzXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCB0byB0aGUgcHJvdmlkZWQgdGV4dHVyZSB1bml0IGxvY2F0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LiBEZWZhdWx0cyB0byAwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBiaW5kKGxvY2F0aW9uID0gMCkge1xuICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxvY2F0aW9uKSB8fCBsb2NhdGlvbiA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnVGV4dHVyZSB1bml0IGxvY2F0aW9uIGlzIGludmFsaWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYmluZCBjdWJlIG1hcCB0ZXh0dXJlXG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbFsnVEVYVFVSRScgKyBsb2NhdGlvbl0pO1xuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy50ZXh0dXJlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gLSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHVuYmluZCgpIHtcbiAgICAgICAgICAgIC8vIHVuYmluZCBjdWJlIG1hcCB0ZXh0dXJlXG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSByZXNwZWN0aXZlIGN1YmUgbWFwIGZhY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgZmFjZSB0YXJnZXQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fG51bGx9IGRhdGEgLSBUaGUgZmFjZSBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBidWZmZXJEYXRhKHRhcmdldCwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKCFUQVJHRVRTW3RhcmdldF0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgdGFyZ2V0XFxgIG9mICR7dGFyZ2V0fSAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRleHR1cmUgb2JqZWN0IGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdFxuICAgICAgICAgICAgaWYgKCF0aGlzLnRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBiaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMudGV4dHVyZSk7XG4gICAgICAgICAgICAvLyBpbnZlcnQgeSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRoaXMuaW52ZXJ0WSk7XG4gICAgICAgICAgICAvLyBwcmVtdWx0aXBseSBhbHBoYSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgdGhpcy5wcmVNdWx0aXBseUFscGhhKTtcbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgYXJnXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdVTlNJR05FRF9TSE9SVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MTZBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ1VOU0lHTkVEX0lOVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50MzJBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ0ZMT0FUJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0IGVuc3VyZSB0eXBlIGNvcnJlc3BvbmRzIHRvIGRhdGFcbiAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9ICdVTlNJR05FRF9CWVRFJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX1NIT1JUJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gJ1VOU0lHTkVEX0lOVCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSAnRkxPQVQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhICYmICEoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJiAhVXRpbC5pc0NhbnZhc1R5cGUoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsICcgK1xuICAgICAgICAgICAgICAgICAgICAnYEFycmF5QnVmZmVyVmlld2AsIGBJbWFnZURhdGFgLCBgSFRNTEltYWdlRWxlbWVudGAsICcgK1xuICAgICAgICAgICAgICAgICAgICAnYEhUTUxDYW52YXNFbGVtZW50YCwgYEhUTUxWaWRlb0VsZW1lbnRgLCBvciBudWxsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YVxuICAgICAgICAgICAgaWYgKFV0aWwuaXNDYW52YXNUeXBlKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgd2lkdGggYW5kIGhlaWdodFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSB0ZXh0dXJlXG4gICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGFyZ2V0XSxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbCxcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy5mb3JtYXRdLCAvLyB3ZWJnbCByZXF1aXJlcyBmb3JtYXQgPT09IGludGVybmFsRm9ybWF0XG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSxcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy50eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBkYXRhXG4gICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGFyZ2V0XSxcbiAgICAgICAgICAgICAgICAgICAgMCwgLy8gbWlwLW1hcCBsZXZlbFxuICAgICAgICAgICAgICAgICAgICBnbFt0aGlzLmZvcm1hdF0sIC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXG4gICAgICAgICAgICAgICAgICAgIGdsW3RoaXMuZm9ybWF0XSxcbiAgICAgICAgICAgICAgICAgICAgZ2xbdGhpcy50eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0cmFjayB0aGUgZmFjZSB0aGF0IHdhcyBidWZmZXJlZFxuICAgICAgICAgICAgaWYgKHRoaXMuYnVmZmVyZWRGYWNlcy5pbmRleE9mKHRhcmdldCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzLnB1c2godGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGFsbCBmYWNlcyBidWZmZXJlZCwgZ2VuZXJhdGUgbWlwbWFwc1xuICAgICAgICAgICAgaWYgKHRoaXMubWlwTWFwICYmIHRoaXMuYnVmZmVyZWRGYWNlcy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGdlbmVyYXRlIG1pcG1hcHMgaWYgYWxsIGZhY2VzIGFyZSBidWZmZXJlZFxuICAgICAgICAgICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfQ1VCRV9NQVApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdW5iaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSB0ZXh0dXJlIHBhcmFtZXRlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1ldGVycyBieSBuYW1lLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLndyYXAgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIGJvdGggUyBhbmQgVCBkaW1lbnNpb24uXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMud3JhcFMgLSBUaGUgd3JhcHBpbmcgdHlwZSBvdmVyIHRoZSBTIGRpbWVuc2lvbi5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy53cmFwVCAtIFRoZSB3cmFwcGluZyB0eXBlIG92ZXIgdGhlIFQgZGltZW5zaW9uLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmZpbHRlciAtIFRoZSBtaW4gLyBtYWcgZmlsdGVyIHVzZWQgZHVyaW5nIHNjYWxpbmcuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubWluRmlsdGVyIC0gVGhlIG1pbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5tYWdGaWx0ZXIgLSBUaGUgbWFnbmlmaWNhdGlvbiBmaWx0ZXIgdXNlZCBkdXJpbmcgc2NhbGluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0UGFyYW1ldGVycyhwYXJhbXMpIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBiaW5kIHRleHR1cmVcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRoaXMudGV4dHVyZSk7XG4gICAgICAgICAgICAvLyBzZXQgd3JhcCBTIHBhcmFtZXRlclxuICAgICAgICAgICAgbGV0IHBhcmFtID0gcGFyYW1zLndyYXBTIHx8IHBhcmFtcy53cmFwO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKFdSQVBfTU9ERVNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3JhcFMgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbdGhpcy53cmFwU10pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBUZXh0dXJlIHBhcmFtZXRlciBcXGAke3BhcmFtfVxcYCBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXFxgVEVYVFVSRV9XUkFQX1NcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCB3cmFwIFQgcGFyYW1ldGVyXG4gICAgICAgICAgICBwYXJhbSA9IHBhcmFtcy53cmFwVCB8fCBwYXJhbXMud3JhcDtcbiAgICAgICAgICAgIGlmIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmIChXUkFQX01PREVTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndyYXBUID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsW3RoaXMud3JhcFRdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfV1JBUF9UXFxgYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgbWFnIGZpbHRlciBwYXJhbWV0ZXJcbiAgICAgICAgICAgIHBhcmFtID0gcGFyYW1zLm1hZ0ZpbHRlciB8fCBwYXJhbXMuZmlsdGVyO1xuICAgICAgICAgICAgaWYgKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1BR19GSUxURVJTW3BhcmFtXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hZ0ZpbHRlciA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbdGhpcy5tYWdGaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yICdURVhUVVJFX01BR19GSUxURVJcXGBgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldCBtaW4gZmlsdGVyIHBhcmFtZXRlclxuICAgICAgICAgICAgcGFyYW0gPSBwYXJhbXMubWluRmlsdGVyIHx8IHBhcmFtcy5maWx0ZXI7XG4gICAgICAgICAgICBpZiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taXBNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE5PTl9NSVBNQVBfTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGdyYWRlIHRvIG1pcC1tYXAgbWluIGZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW0gKz0gREVGQVVMVF9NSVBNQVBfTUlOX0ZJTFRFUl9TVUZGSVg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1JUE1BUF9NSU5fRklMVEVSU1twYXJhbV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWluRmlsdGVyID0gcGFyYW07XG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTUlOX0ZJTFRFUlNbcGFyYW1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbkZpbHRlciA9IHBhcmFtO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgVGV4dHVyZSBwYXJhbWV0ZXIgXFxgJHtwYXJhbX1cXGAgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFxcYFRFWFRVUkVfTUlOX0ZJTFRFUlxcYGA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1bmJpbmQgdGV4dHVyZVxuICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVGV4dHVyZUN1YmVNYXA7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0Jyk7XG4gICAgbGV0IFZlcnRleFBhY2thZ2UgPSByZXF1aXJlKCcuL1ZlcnRleFBhY2thZ2UnKTtcblxuICAgIGxldCBNT0RFUyA9IHtcbiAgICAgICAgUE9JTlRTOiB0cnVlLFxuICAgICAgICBMSU5FUzogdHJ1ZSxcbiAgICAgICAgTElORV9TVFJJUDogdHJ1ZSxcbiAgICAgICAgTElORV9MT09QOiB0cnVlLFxuICAgICAgICBUUklBTkdMRVM6IHRydWUsXG4gICAgICAgIFRSSUFOR0xFX1NUUklQOiB0cnVlLFxuICAgICAgICBUUklBTkdMRV9GQU46IHRydWVcbiAgICB9O1xuICAgIGxldCBUWVBFUyA9IHtcbiAgICAgICAgQllURTogdHJ1ZSxcbiAgICAgICAgVU5TSUdORURfQllURTogdHJ1ZSxcbiAgICAgICAgU0hPUlQ6IHRydWUsXG4gICAgICAgIFVOU0lHTkVEX1NIT1JUOiB0cnVlLFxuICAgICAgICBGSVhFRDogdHJ1ZSxcbiAgICAgICAgRkxPQVQ6IHRydWVcbiAgICB9O1xuICAgIGxldCBCWVRFU19QRVJfVFlQRSA9IHtcbiAgICAgICAgQllURTogMSxcbiAgICAgICAgVU5TSUdORURfQllURTogMSxcbiAgICAgICAgU0hPUlQ6IDIsXG4gICAgICAgIFVOU0lHTkVEX1NIT1JUOiAyLFxuICAgICAgICBGSVhFRDogNCxcbiAgICAgICAgRkxPQVQ6IDRcbiAgICB9O1xuICAgIGxldCBTSVpFUyA9IHtcbiAgICAgICAgMTogdHJ1ZSxcbiAgICAgICAgMjogdHJ1ZSxcbiAgICAgICAgMzogdHJ1ZSxcbiAgICAgICAgNDogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBhdHRyaWJ1dGUgcG9pbnQgYnl0ZSBvZmZzZXQuXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfQllURV9PRkZTRVQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyIG1vZGUgKHByaW1pdGl2ZSB0eXBlKS5cbiAgICAgKi9cbiAgICBsZXQgREVGQVVMVF9NT0RFID0gJ1RSSUFOR0xFUyc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBpbmRleCBvZmZzZXQgdG8gcmVuZGVyIGZyb20uXG4gICAgICovXG4gICAgbGV0IERFRkFVTFRfSU5ERVhfT0ZGU0VUID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGNvdW50IG9mIGluZGljZXMgdG8gcmVuZGVyLlxuICAgICAqL1xuICAgIGxldCBERUZBVUxUX0NPVU5UID0gMDtcblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHRoZSBhdHRyaWJ1dGUgcG9pbnRlcnMgYW5kIGRldGVybWluZSB0aGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlci5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZVBvaW50ZXJzIC0gVGhlIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGJ5dGUgc3RyaWRlIG9mIHRoZSBidWZmZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U3RyaWRlKGF0dHJpYnV0ZVBvaW50ZXJzKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGF0dHJpYnV0ZSBwb2ludGVyIGFzc2lnbmVkIHRvIHRoaXMgYnVmZmVyLFxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZWVkIGZvciBzdHJpZGUsIHNldCB0byBkZWZhdWx0IG9mIDBcbiAgICAgICAgbGV0IGluZGljZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVQb2ludGVycyk7XG4gICAgICAgIGlmIChpbmRpY2VzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1heEJ5dGVPZmZzZXQgPSAwO1xuICAgICAgICBsZXQgYnl0ZVNpemVTdW0gPSAwO1xuICAgICAgICBsZXQgYnl0ZVN0cmlkZSA9IDA7XG4gICAgICAgIGluZGljZXMuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICAgICAgICBsZXQgcG9pbnRlciA9IGF0dHJpYnV0ZVBvaW50ZXJzW2luZGV4XTtcbiAgICAgICAgICAgIGxldCBieXRlT2Zmc2V0ID0gcG9pbnRlci5ieXRlT2Zmc2V0O1xuICAgICAgICAgICAgbGV0IHNpemUgPSBwb2ludGVyLnNpemU7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IHBvaW50ZXIudHlwZTtcbiAgICAgICAgICAgIC8vIHRyYWNrIHRoZSBzdW0gb2YgZWFjaCBhdHRyaWJ1dGUgc2l6ZVxuICAgICAgICAgICAgYnl0ZVNpemVTdW0gKz0gc2l6ZSAqIEJZVEVTX1BFUl9UWVBFW3R5cGVdO1xuICAgICAgICAgICAgLy8gdHJhY2sgdGhlIGxhcmdlc3Qgb2Zmc2V0IHRvIGRldGVybWluZSB0aGUgYnl0ZSBzdHJpZGUgb2YgdGhlIGJ1ZmZlclxuICAgICAgICAgICAgaWYgKGJ5dGVPZmZzZXQgPiBtYXhCeXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgbWF4Qnl0ZU9mZnNldCA9IGJ5dGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgYnl0ZVN0cmlkZSA9IGJ5dGVPZmZzZXQgKyAoc2l6ZSAqIEJZVEVTX1BFUl9UWVBFW3R5cGVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBtYXggYnl0ZSBvZmZzZXQgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB0aGUgc3VtIG9mXG4gICAgICAgIC8vIHRoZSBzaXplcy4gSWYgc28gdGhpcyBidWZmZXIgaXMgbm90IGludGVybGVhdmVkIGFuZCBkb2VzIG5vdCBuZWVkIGFcbiAgICAgICAgLy8gc3RyaWRlLlxuICAgICAgICBpZiAobWF4Qnl0ZU9mZnNldCA+PSBieXRlU2l6ZVN1bSkge1xuICAgICAgICAgICAgLy8gVE9ETzogdGVzdCB3aGF0IHN0cmlkZSA9PT0gMCBkb2VzIGZvciBhbiBpbnRlcmxlYXZlZCBidWZmZXIgb2ZcbiAgICAgICAgICAgIC8vIGxlbmd0aCA9PT0gMS5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBieXRlU3RyaWRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHRoZSBhdHRyaWJ1dGUgcG9pbnRlcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHZhbGlkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlUG9pbnRlcnMgLSBUaGUgYXR0cmlidXRlIHBvaW50ZXIgbWFwLlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdmFsaWRhdGVkIGF0dHJpYnV0ZSBwb2ludGVyIG1hcC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVQb2ludGVycyhhdHRyaWJ1dGVQb2ludGVycykge1xuICAgICAgICAvLyBwYXJzZSBwb2ludGVycyB0byBlbnN1cmUgdGhleSBhcmUgdmFsaWRcbiAgICAgICAgbGV0IHBvaW50ZXJzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZVBvaW50ZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBwYXJzZUludChrZXksIDEwKTtcbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQga2V5IGlzIGFuIHZhbGlkIGludGVnZXJcbiAgICAgICAgICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgQXR0cmlidXRlIGluZGV4IFxcYCR7a2V5fVxcYCBkb2VzIG5vdCByZXByZXNlbnQgYW4gaW50ZWdlcmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcG9pbnRlciA9IGF0dHJpYnV0ZVBvaW50ZXJzW2tleV07XG4gICAgICAgICAgICBsZXQgc2l6ZSA9IHBvaW50ZXIuc2l6ZTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gcG9pbnRlci50eXBlO1xuICAgICAgICAgICAgbGV0IGJ5dGVPZmZzZXQgPSBwb2ludGVyLmJ5dGVPZmZzZXQ7XG4gICAgICAgICAgICAvLyBjaGVjayBzaXplXG4gICAgICAgICAgICBpZiAoIVNJWkVTW3NpemVdKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0F0dHJpYnV0ZSBwb2ludGVyIGBzaXplYCBwYXJhbWV0ZXIgaXMgaW52YWxpZCwgbXVzdCBiZSBvbmUgb2YgJyArXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKFNJWkVTKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayB0eXBlXG4gICAgICAgICAgICBpZiAoIVRZUEVTW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0F0dHJpYnV0ZSBwb2ludGVyIGB0eXBlYCBwYXJhbWV0ZXIgaXMgaW52YWxpZCwgbXVzdCBiZSBvbmUgb2YgJyArXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKFRZUEVTKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludGVyc1tpbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQ6IChieXRlT2Zmc2V0ICE9PSB1bmRlZmluZWQpID8gYnl0ZU9mZnNldCA6IERFRkFVTFRfQllURV9PRkZTRVRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcG9pbnRlcnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFZlcnRleEJ1ZmZlclxuICAgICAqIEBjbGFzc2Rlc2MgQSB2ZXJ0ZXggYnVmZmVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBjbGFzcyBWZXJ0ZXhCdWZmZXIge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYW4gVmVydGV4QnVmZmVyIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtXZWJHTEJ1ZmZlcnxWZXJ0ZXhQYWNrYWdlfEZsb2F0MzJBcnJheXxBcnJheXxOdW1iZXJ9IGFyZyAtIFRoZSBidWZmZXIgb3IgbGVuZ3RoIG9mIHRoZSBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVQb2ludGVycyAtIFRoZSBhcnJheSBwb2ludGVyIG1hcCwgb3IgaW4gdGhlIGNhc2Ugb2YgYSB2ZXJ0ZXggcGFja2FnZSBhcmcsIHRoZSBvcHRpb25zLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSByZW5kZXJpbmcgb3B0aW9ucy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuaW5kZXhPZmZzZXQgLSBUaGUgaW5kZXggb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIGluZGljZXMgdG8gZHJhdy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKGFyZywgYXR0cmlidXRlUG9pbnRlcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gTU9ERVNbb3B0aW9ucy5tb2RlXSA/IG9wdGlvbnMubW9kZSA6IERFRkFVTFRfTU9ERTtcbiAgICAgICAgICAgIHRoaXMuY291bnQgPSAob3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY291bnQgOiBERUZBVUxUX0NPVU5UO1xuICAgICAgICAgICAgdGhpcy5pbmRleE9mZnNldCA9IChvcHRpb25zLmluZGV4T2Zmc2V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5pbmRleE9mZnNldCA6IERFRkFVTFRfSU5ERVhfT0ZGU0VUO1xuICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIC8vIGZpcnN0LCBzZXQgdGhlIGF0dHJpYnV0ZSBwb2ludGVyc1xuICAgICAgICAgICAgaWYgKGFyZyAmJiBhcmcuYnVmZmVyICYmIGFyZy5wb2ludGVycykge1xuICAgICAgICAgICAgICAgIC8vIFZlcnRleFBhY2thZ2UgYXJndW1lbnQsIHVzZSBpdHMgYXR0cmlidXRlIHBvaW50ZXJzXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVycyA9IGFyZy5wb2ludGVycztcbiAgICAgICAgICAgICAgICAvLyBzaGlmdCBvcHRpb25zIGFyZyBzaW5jZSB0aGVyZSB3aWxsIGJlIG5vIGF0dHJpYiBwb2ludGVycyBhcmdcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gYXR0cmlidXRlUG9pbnRlcnM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlcnMgPSBnZXRBdHRyaWJ1dGVQb2ludGVycyhhdHRyaWJ1dGVQb2ludGVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgdGhlIGJ5dGUgc3RyaWRlXG4gICAgICAgICAgICB0aGlzLmJ5dGVTdHJpZGUgPSBnZXRTdHJpZGUodGhpcy5wb2ludGVycyk7XG4gICAgICAgICAgICAvLyB0aGVuIGJ1ZmZlciB0aGUgZGF0YVxuICAgICAgICAgICAgaWYgKGFyZykge1xuICAgICAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBWZXJ0ZXhQYWNrYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFZlcnRleFBhY2thZ2UgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKGFyZy5idWZmZXIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2ViR0xCdWZmZXIgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYnl0ZUxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgb2YgdHlwZSBgV2ViR0xCdWZmZXJgIG11c3QgYmUgY29tcGxpbWVudGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGBvcHRpb25zLmJ5dGVMZW5ndGhgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IGFyZztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gb3B0aW9ucy5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFycmF5IG9yIEFycmF5QnVmZmVyIG9yIG51bWJlciBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoYXJnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBsb2FkIHZlcnRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fG51bWJlcn0gYXJnIC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLCBvciBzaXplIG9mIHRoZSBidWZmZXIgaW4gYnl0ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZlcnRleEJ1ZmZlcn0gVGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBidWZmZXJEYXRhKGFyZykge1xuICAgICAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgICAgIC8vIGVuc3VyZSBhcmd1bWVudCBpcyB2YWxpZFxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICAgICAgICAgIC8vIGNhc3QgYXJyYXkgaW50byBGbG9hdDMyQXJyYXlcbiAgICAgICAgICAgICAgICBhcmcgPSBuZXcgRmxvYXQzMkFycmF5KGFyZyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICEoYXJnIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpICYmXG4gICAgICAgICAgICAgICAgIShBcnJheUJ1ZmZlci5pc1ZpZXcoYXJnKSkgJiZcbiAgICAgICAgICAgICAgICAhKE51bWJlci5pc0ludGVnZXIoYXJnKSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBub3QgYXJyYXlidWZmZXIgb3IgYSBudW1lcmljIHNpemVcbiAgICAgICAgICAgICAgICB0aHJvdyAnQXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIGBBcnJheWAsIGBBcnJheUJ1ZmZlcmAsIGBBcnJheUJ1ZmZlclZpZXdgLCBvciBgTnVtYmVyYCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZXQgYnl0ZSBsZW5ndGhcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFyZykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSBhcmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IGFyZy5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY3JlYXRlIGJ1ZmZlciBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcbiAgICAgICAgICAgIGlmICghdGhpcy5idWZmZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYnVmZmVyIHRoZSBkYXRhXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5idWZmZXIpO1xuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGFyZywgZ2wuU1RBVElDX0RSQVcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwbG9hZCBwYXJ0aWFsIHZlcnRleCBkYXRhIHRvIHRoZSBHUFUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8QXJyYXlCdWZmZXJ8QXJyYXlCdWZmZXJWaWV3fSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGJ5dGVPZmZzZXQgLSBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYnVmZmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IFRoZSB2ZXJ0ZXggYnVmZmVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYnVmZmVyU3ViRGF0YShhcnJheSwgYnl0ZU9mZnNldCA9IERFRkFVTFRfQllURV9PRkZTRVQpIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBlbnN1cmUgdGhlIGJ1ZmZlciBleGlzdHNcbiAgICAgICAgICAgIGlmICghdGhpcy5idWZmZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQnVmZmVyIGhhcyBub3QgeWV0IGJlZW4gYWxsb2NhdGVkLCBhbGxvY2F0ZSB3aXRoICcgK1xuICAgICAgICAgICAgICAgICAgICAnYGJ1ZmZlckRhdGFgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVuc3VyZSBhcmd1bWVudCBpcyB2YWxpZFxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGFycmF5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgIShhcnJheSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxuICAgICAgICAgICAgICAgICFBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYXkpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0FyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBgQXJyYXlgLCBgQXJyYXlCdWZmZXJgLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ29yIGBBcnJheUJ1ZmZlclZpZXdgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgd2UgYXJlbid0IG92ZXJmbG93aW5nIHRoZSBidWZmZXJcbiAgICAgICAgICAgIGlmIChieXRlT2Zmc2V0ICsgYXJyYXkuYnl0ZUxlbmd0aCA+IHRoaXMuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBBcmd1bWVudCBvZiBsZW5ndGggJHthcnJheS5ieXRlTGVuZ3RofSBieXRlcyB3aXRoIGAgK1xuICAgICAgICAgICAgICAgICAgICBgb2Zmc2V0IG9mICR7Ynl0ZU9mZnNldH0gYnl0ZXMgb3ZlcmZsb3dzIHRoZSBidWZmZXIgYCArXG4gICAgICAgICAgICAgICAgICAgIGBsZW5ndGggb2YgJHt0aGlzLmJ5dGVMZW5ndGh9IGJ5dGVzYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgYnl0ZU9mZnNldCwgYXJyYXkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZHMgdGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWZXJ0ZXhCdWZmZXJ9IC0gUmV0dXJucyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYmluZCgpIHtcbiAgICAgICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgICAgICAvLyBiaW5kIGJ1ZmZlclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIGF0dHJpYnV0ZSBwb2ludGVyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnBvaW50ZXJzKS5mb3JFYWNoKGluZGV4ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRlciA9IHRoaXMucG9pbnRlcnNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIC8vIHNldCBhdHRyaWJ1dGUgcG9pbnRlclxuICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXG4gICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICBwb2ludGVyLnNpemUsXG4gICAgICAgICAgICAgICAgICAgIGdsW3BvaW50ZXIudHlwZV0sXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ5dGVTdHJpZGUsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXIuYnl0ZU9mZnNldCk7XG4gICAgICAgICAgICAgICAgLy8gZW5hYmxlIGF0dHJpYnV0ZSBpbmRleFxuICAgICAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVW5iaW5kcyB0aGUgdmVydGV4IGJ1ZmZlciBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZlcnRleEJ1ZmZlcn0gVGhlIHZlcnRleCBidWZmZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgLy8gdW5iaW5kIGJ1ZmZlclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMucG9pbnRlcnMpLmZvckVhY2goaW5kZXggPT4ge1xuICAgICAgICAgICAgICAgIC8vIGRpc2FibGUgYXR0cmlidXRlIGluZGV4XG4gICAgICAgICAgICAgICAgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSB0aGUgZHJhdyBjb21tYW5kIGZvciB0aGUgYm91bmQgYnVmZmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIHBhc3MgdG8gJ2RyYXdBcnJheXMnLiBPcHRpb25hbC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubW9kZSAtIFRoZSBkcmF3IG1vZGUgLyBwcmltaXRpdmUgdHlwZS5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuaW5kZXhPZmZzZXQgLSBUaGUgaW5kZXggb2Zmc2V0IGludG8gdGhlIGRyYXduIGJ1ZmZlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY291bnQgLSBUaGUgbnVtYmVyIG9mIGluZGljZXMgdG8gZHJhdy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7VmVydGV4QnVmZmVyfSBUaGUgdmVydGV4IGJ1ZmZlciBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGRyYXcob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAgICAgbGV0IG1vZGUgPSBnbFtvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlXTtcbiAgICAgICAgICAgIGxldCBpbmRleE9mZnNldCA9IChvcHRpb25zLmluZGV4T2Zmc2V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5pbmRleE9mZnNldCA6IHRoaXMuaW5kZXhPZmZzZXQ7XG4gICAgICAgICAgICBsZXQgY291bnQgPSAob3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY291bnQgOiB0aGlzLmNvdW50O1xuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0F0dGVtcHRpbmcgdG8gZHJhdyB3aXRoIGEgY291bnQgb2YgMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkcmF3IGVsZW1lbnRzXG4gICAgICAgICAgICBnbC5kcmF3QXJyYXlzKG1vZGUsIGluZGV4T2Zmc2V0LCBjb3VudCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4QnVmZmVyO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBDT01QT05FTlRfVFlQRSA9ICdGTE9BVCc7XG4gICAgbGV0IEJZVEVTX1BFUl9DT01QT05FTlQgPSA0O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBsZW5ndGggPiAwIGtleSBieSBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gaW50LlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAtIFRoZSBtYXAgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIHZhbGlkIGFycmF5IG9mIGFyZ3VtZW50cy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZUF0dHJpYnV0ZU1hcChhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGxldCBnb29kQXR0cmlidXRlcyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBwYXJzZUZsb2F0KGtleSk7XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IGtleSBpcyBhbiB2YWxpZCBpbnRlZ2VyXG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IGBBdHRyaWJ1dGUgaW5kZXggXFxgJHtrZXl9XFxgIGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbGlkIGludGVnZXJgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHZlcnRpY2VzID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgLy8gZW5zdXJlIGF0dHJpYnV0ZSBpcyB2YWxpZFxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmVydGljZXMpICYmIHZlcnRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgYXR0cmlidXRlIGRhdGEgYW5kIGluZGV4XG4gICAgICAgICAgICAgICAgZ29vZEF0dHJpYnV0ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdmVydGljZXNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYEVycm9yIHBhcnNpbmcgYXR0cmlidXRlIG9mIGluZGV4IFxcYCR7aW5kZXh9XFxgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHNvcnQgYXR0cmlidXRlcyBhc2NlbmRpbmcgYnkgaW5kZXhcbiAgICAgICAgZ29vZEF0dHJpYnV0ZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGdvb2RBdHRyaWJ1dGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBjb21wb25lbnQncyBieXRlIHNpemUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50IHRvIG1lYXN1cmUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBieXRlIHNpemUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRTaXplKGNvbXBvbmVudCkge1xuICAgICAgICAvLyBjaGVjayBpZiBhcnJheVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBpZiB2ZWN0b3JcbiAgICAgICAgaWYgKGNvbXBvbmVudC54ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIDEgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC55ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyAyIGNvbXBvbmVudCB2ZWN0b3JcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAzIGNvbXBvbmVudCB2ZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC53ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2luZ2xlIGNvbXBvbmVudFxuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSB0eXBlLCBzaXplLCBhbmQgb2Zmc2V0IGZvciBlYWNoIGF0dHJpYnV0ZSBpbiB0aGUgYXR0cmlidXRlIGFycmF5IGFsb25nIHdpdGggdGhlIGxlbmd0aCBhbmQgc3RyaWRlIG9mIHRoZSBwYWNrYWdlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1ZlcnRleFBhY2thZ2V9IHZlcnRleFBhY2thZ2UgLSBUaGUgVmVydGV4UGFja2FnZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXR0cmlidXRlcyBUaGUgYXJyYXkgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0UG9pbnRlcnNBbmRTdHJpZGUodmVydGV4UGFja2FnZSwgYXR0cmlidXRlcykge1xuICAgICAgICBsZXQgc2hvcnRlc3RBcnJheSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xuICAgICAgICAvLyBjbGVhciBwb2ludGVyc1xuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzID0ge307XG4gICAgICAgIC8vIGZvciBlYWNoIGF0dHJpYnV0ZVxuICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2godmVydGljZXMgPT4ge1xuICAgICAgICAgICAgLy8gc2V0IHNpemUgdG8gbnVtYmVyIG9mIGNvbXBvbmVudHMgaW4gdGhlIGF0dHJpYnV0ZVxuICAgICAgICAgICAgbGV0IHNpemUgPSBnZXRDb21wb25lbnRTaXplKHZlcnRpY2VzLmRhdGFbMF0pO1xuICAgICAgICAgICAgLy8gbGVuZ3RoIG9mIHRoZSBwYWNrYWdlIHdpbGwgYmUgdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcbiAgICAgICAgICAgIHNob3J0ZXN0QXJyYXkgPSBNYXRoLm1pbihzaG9ydGVzdEFycmF5LCB2ZXJ0aWNlcy5kYXRhLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBzdG9yZSBwb2ludGVyIHVuZGVyIGluZGV4XG4gICAgICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnBvaW50ZXJzW3ZlcnRpY2VzLmluZGV4XSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBDT01QT05FTlRfVFlQRSxcbiAgICAgICAgICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQ6IG9mZnNldCAqIEJZVEVTX1BFUl9DT01QT05FTlRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBhY2N1bXVsYXRlIGF0dHJpYnV0ZSBvZmZzZXRcbiAgICAgICAgICAgIG9mZnNldCArPSBzaXplO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gc2V0IHN0cmlkZSB0byB0b3RhbCBvZmZzZXRcbiAgICAgICAgdmVydGV4UGFja2FnZS5zdHJpZGUgPSBvZmZzZXQ7IC8vIG5vdCBpbiBieXRlc1xuICAgICAgICAvLyBzZXQgbGVuZ3RoIG9mIHBhY2thZ2UgdG8gdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcbiAgICAgICAgdmVydGV4UGFja2FnZS5sZW5ndGggPSBzaG9ydGVzdEFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbGwgdGhlIGFycmF5YnVmZmVyIHdpdGggYSBzaW5nbGUgY29tcG9uZW50IGF0dHJpYnV0ZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUsIG5vdCBpbiBieXRlcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIC0gVGhlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLCBub3QgaW4gYnl0ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0MUNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSkge1xuICAgICAgICBsZXQgdmVydGV4LCBpLCBqO1xuICAgICAgICBmb3IgKGk9MDsgaTxsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmVydGV4ID0gdmVydGljZXNbaV07XG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XG4gICAgICAgICAgICBqID0gb2Zmc2V0ICsgKHN0cmlkZSAqIGkpO1xuICAgICAgICAgICAgaWYgKHZlcnRleC54ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBidWZmZXJbal0gPSB2ZXJ0ZXgueDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmVydGV4WzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBidWZmZXJbal0gPSB2ZXJ0ZXhbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1ZmZlcltqXSA9IHZlcnRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbGwgdGhlIGFycmF5YnVmZmVyIHdpdGggYSBkb3VibGUgY29tcG9uZW50IGF0dHJpYnV0ZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGJ1ZmZlciAtIFRoZSBhcnJheWJ1ZmZlciB0byBmaWxsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZlcnRpY2VzIC0gVGhlIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXkgdG8gY29weSBmcm9tLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBidWZmZXIgdG8gY29weSBmcm9tLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgLSBUaGUgb2Zmc2V0IHRvIHRoZSBhdHRyaWJ1dGUsIG5vdCBpbiBieXRlcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIC0gVGhlIHN0cmlkZSBvZiB0aGUgYnVmZmVyLCBub3QgaW4gYnl0ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0MkNvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcywgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSkge1xuICAgICAgICBsZXQgdmVydGV4LCBpLCBqO1xuICAgICAgICBmb3IgKGk9MDsgaTxsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmVydGV4ID0gdmVydGljZXNbaV07XG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4IGluIHRoZSBidWZmZXIgdG8gdGhlIHBhcnRpY3VsYXIgdmVydGV4XG4gICAgICAgICAgICBqID0gb2Zmc2V0ICsgKHN0cmlkZSAqIGkpO1xuICAgICAgICAgICAgYnVmZmVyW2pdID0gKHZlcnRleC54ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XG4gICAgICAgICAgICBidWZmZXJbaisxXSA9ICh2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHRyaXBsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQzQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG4gICAgICAgIGxldCB2ZXJ0ZXgsIGksIGo7XG4gICAgICAgIGZvciAoaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoc3RyaWRlICogaSk7XG4gICAgICAgICAgICBidWZmZXJbal0gPSAodmVydGV4LnggIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG4gICAgICAgICAgICBidWZmZXJbaisyXSA9ICh2ZXJ0ZXgueiAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsbCB0aGUgYXJyYXlidWZmZXIgd2l0aCBhIHF1YWRydXBsZSBjb21wb25lbnQgYXR0cmlidXRlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gVGhlIGFycmF5YnVmZmVyIHRvIGZpbGwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gdmVydGljZXMgLSBUaGUgdmVydGV4IGF0dHJpYnV0ZSBhcnJheSB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGJ1ZmZlciB0byBjb3B5IGZyb20uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIFRoZSBvZmZzZXQgdG8gdGhlIGF0dHJpYnV0ZSwgbm90IGluIGJ5dGVzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgLSBUaGUgc3RyaWRlIG9mIHRoZSBidWZmZXIsIG5vdCBpbiBieXRlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQ0Q29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKSB7XG4gICAgICAgIGxldCB2ZXJ0ZXgsIGksIGo7XG4gICAgICAgIGZvciAoaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2ZXJ0ZXggPSB2ZXJ0aWNlc1tpXTtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciB2ZXJ0ZXhcbiAgICAgICAgICAgIGogPSBvZmZzZXQgKyAoc3RyaWRlICogaSk7XG4gICAgICAgICAgICBidWZmZXJbal0gPSAodmVydGV4LnggIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcbiAgICAgICAgICAgIGJ1ZmZlcltqKzFdID0gKHZlcnRleC55ICE9PSB1bmRlZmluZWQpID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XG4gICAgICAgICAgICBidWZmZXJbaisyXSA9ICh2ZXJ0ZXgueiAhPT0gdW5kZWZpbmVkKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xuICAgICAgICAgICAgYnVmZmVyW2orM10gPSAodmVydGV4LncgIT09IHVuZGVmaW5lZCkgPyB2ZXJ0ZXgudyA6IHZlcnRleFszXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBWZXJ0ZXhQYWNrYWdlXG4gICAgICogQGNsYXNzZGVzYyBBIHZlcnRleCBwYWNrYWdlIHRvIGFzc2lzdCBpbiBpbnRlcmxlYXZpbmcgdmVydGV4IGRhdGEgYW5kIGJ1aWxkaW5nIHRoZSBhc3NvY2lhdGVkIHZlcnRleCBhdHRyaWJ1dGUgcG9pbnRlcnMuXG4gICAgICovXG4gICAgY2xhc3MgVmVydGV4UGFja2FnZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc3RhbnRpYXRlcyBhIFZlcnRleFBhY2thZ2Ugb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgLSBUaGUgYXR0cmlidXRlcyB0byBpbnRlcmxlYXZlIGtleWVkIGJ5IGluZGV4LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVycyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgZGF0YSB0byBiZSBpbnRlcmxlYXZlZCBpbnNpZGUgdGhlIHBhY2thZ2UuIFRoaXMgY2xlYXJzIGFueSBwcmV2aW91c2x5IGV4aXN0aW5nIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIC0gVGhlIGF0dHJpYnV0ZXMgdG8gaW50ZXJsZWF2ZWQsIGtleWVkIGJ5IGluZGV4LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWZXJ0ZXhQYWNrYWdlfSBUaGUgdmVydGV4IHBhY2thZ2Ugb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzZXQoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIGJhZCBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gcGFyc2VBdHRyaWJ1dGVNYXAoYXR0cmlidXRlcyk7XG4gICAgICAgICAgICAvLyBzZXQgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCBzdHJpZGVcbiAgICAgICAgICAgIHNldFBvaW50ZXJzQW5kU3RyaWRlKHRoaXMsIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgLy8gc2V0IHNpemUgb2YgZGF0YSB2ZWN0b3JcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBzdHJpZGUgPSB0aGlzLnN0cmlkZTsgLy8gbm90IGluIGJ5dGVzXG4gICAgICAgICAgICBsZXQgcG9pbnRlcnMgPSB0aGlzLnBvaW50ZXJzO1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGggKiBzdHJpZGUpO1xuICAgICAgICAgICAgLy8gZm9yIGVhY2ggdmVydGV4IGF0dHJpYnV0ZSBhcnJheVxuICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKHZlcnRpY2VzID0+IHtcbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIHBvaW50ZXJcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRlciA9IHBvaW50ZXJzW3ZlcnRpY2VzLmluZGV4XTtcbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIHBvaW50ZXJzIG9mZnNldFxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBwb2ludGVyLmJ5dGVPZmZzZXQgLyBCWVRFU19QRVJfQ09NUE9ORU5UO1xuICAgICAgICAgICAgICAgIC8vIGNvcHkgdmVydGV4IGRhdGEgaW50byBhcnJheWJ1ZmZlclxuICAgICAgICAgICAgICAgIHN3aXRjaCAocG9pbnRlci5zaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldDJDb21wb25lbnRBdHRyKGJ1ZmZlciwgdmVydGljZXMuZGF0YSwgbGVuZ3RoLCBvZmZzZXQsIHN0cmlkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0M0NvbXBvbmVudEF0dHIoYnVmZmVyLCB2ZXJ0aWNlcy5kYXRhLCBsZW5ndGgsIG9mZnNldCwgc3RyaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQ0Q29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQxQ29tcG9uZW50QXR0cihidWZmZXIsIHZlcnRpY2VzLmRhdGEsIGxlbmd0aCwgb2Zmc2V0LCBzdHJpZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4UGFja2FnZTtcblxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpO1xuXG4gICAgLyoqXG4gICAgICogQmluZCB0aGUgdmlld3BvcnQgdG8gdGhlIHJlbmRlcmluZyBjb250ZXh0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtWaWV3cG9ydH0gdmlld3BvcnQgLSBUaGUgdmlld3BvcnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvdmVycmlkZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvdmVycmlkZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBob3Jpem9udGFsIG9mZnNldCBvdmVycmlkZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB2ZXJ0aWNhbCBvZmZzZXQgb3ZlcnJpZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0KHZpZXdwb3J0LCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGxldCBnbCA9IHZpZXdwb3J0LmdsO1xuICAgICAgICB4ID0gKHggIT09IHVuZGVmaW5lZCkgPyB4IDogdmlld3BvcnQueDtcbiAgICAgICAgeSA9ICh5ICE9PSB1bmRlZmluZWQpID8geSA6IHZpZXdwb3J0Lnk7XG4gICAgICAgIHdpZHRoID0gKHdpZHRoICE9PSB1bmRlZmluZWQpID8gd2lkdGggOiB2aWV3cG9ydC53aWR0aDtcbiAgICAgICAgaGVpZ2h0ID0gKGhlaWdodCAhPT0gdW5kZWZpbmVkKSA/IGhlaWdodCA6IHZpZXdwb3J0LmhlaWdodDtcbiAgICAgICAgZ2wudmlld3BvcnQoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFZpZXdwb3J0XG4gICAgICogQGNsYXNzZGVzYyBBIHZpZXdwb3J0IGNsYXNzIGZvciBtYW5hZ2luZyBXZWJHTCB2aWV3cG9ydHMuXG4gICAgICovXG4gICAgY2xhc3MgVmlld3BvcnQge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0YW50aWF0ZXMgYSBWaWV3cG9ydCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjIC0gVGhlIHZpZXdwb3J0IHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlYy53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVjLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Ioc3BlYyA9IHt9KSB7XG4gICAgICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xuICAgICAgICAgICAgLy8gc2V0IHNpemVcbiAgICAgICAgICAgIHRoaXMucmVzaXplKFxuICAgICAgICAgICAgICAgIHNwZWMud2lkdGggfHwgdGhpcy5nbC5jYW52YXMud2lkdGgsXG4gICAgICAgICAgICAgICAgc3BlYy5oZWlnaHQgfHwgdGhpcy5nbC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIHRoZSB2aWV3cG9ydHMgd2lkdGggYW5kIGhlaWdodC4gVGhpcyByZXNpemVzIHRoZSB1bmRlcmx5aW5nIGNhbnZhcyBlbGVtZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZpZXdwb3J0fSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICByZXNpemUod2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpZHRoICE9PSAnbnVtYmVyJyB8fCB3aWR0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIFxcYHdpZHRoXFxgIG9mIFxcYCR7d2lkdGh9XFxgIGlzIGludmFsaWRgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInIHx8IGhlaWdodCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIFxcYGhlaWdodFxcYCBvZiBcXGAke2hlaWdodH1cXGAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuZ2wuY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0aGlzLmdsLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSB2aWV3cG9ydCBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbi4gVGhlIHVuZGVybHlpbmcgY2FudmFzIGVsZW1lbnQgaXMgbm90IGFmZmVjdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb3ZlcnJpZGUuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG92ZXJyaWRlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBob3Jpem9udGFsIG9mZnNldCBvdmVycmlkZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgdmVydGljYWwgb2Zmc2V0IG92ZXJyaWRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtWaWV3cG9ydH0gLSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBwdXNoKHggPSAwLCB5ID0gMCwgd2lkdGggPSB0aGlzLndpZHRoLCBoZWlnaHQgPSB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRocm93IGBQcm92aWRlZCBcXGB4XFxgIG9mIFxcYCR7eH1cXGAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHkgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFByb3ZpZGVkIFxcYHlcXGAgb2YgXFxgJHt5fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHdpZHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgd2lkdGhcXGAgb2YgXFxgJHt3aWR0aH1cXGAgaXMgaW52YWxpZGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgfHwgaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgUHJvdmlkZWQgXFxgaGVpZ2h0XFxgIG9mIFxcYCR7aGVpZ2h0fVxcYCBpcyBpbnZhbGlkYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHB1c2ggb250byBzdGFja1xuICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHNldCB2aWV3cG9ydFxuICAgICAgICAgICAgc2V0KHRoaXMsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUG9wcyBjdXJyZW50IHRoZSB2aWV3cG9ydCBvYmplY3QgYW5kIHNldHMgdGhlIHZpZXdwb3J0IGJlbmVhdGggaXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1ZpZXdwb3J0fSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICBwb3AoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnVmlld3BvcnQgc3RhY2sgaXMgZW1wdHknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHNldCh0aGlzLCB0b3AueCwgdG9wLnksIHRvcC53aWR0aCwgdG9wLmhlaWdodCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWaWV3cG9ydDtcblxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGxldCBFWFRFTlNJT05TID0gW1xuICAgICAgICAvLyByYXRpZmllZFxuICAgICAgICAnT0VTX3RleHR1cmVfZmxvYXQnLFxuICAgICAgICAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCcsXG4gICAgICAgICdXRUJHTF9sb3NlX2NvbnRleHQnLFxuICAgICAgICAnT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICAgJ09FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0JyxcbiAgICAgICAgJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nLFxuICAgICAgICAnV0VCR0xfZGVidWdfc2hhZGVycycsXG4gICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YycsXG4gICAgICAgICdXRUJHTF9kZXB0aF90ZXh0dXJlJyxcbiAgICAgICAgJ09FU19lbGVtZW50X2luZGV4X3VpbnQnLFxuICAgICAgICAnRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJyxcbiAgICAgICAgJ0VYVF9mcmFnX2RlcHRoJyxcbiAgICAgICAgJ1dFQkdMX2RyYXdfYnVmZmVycycsXG4gICAgICAgICdBTkdMRV9pbnN0YW5jZWRfYXJyYXlzJyxcbiAgICAgICAgJ09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhcicsXG4gICAgICAgICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhcicsXG4gICAgICAgICdFWFRfYmxlbmRfbWlubWF4JyxcbiAgICAgICAgJ0VYVF9zaGFkZXJfdGV4dHVyZV9sb2QnLFxuICAgICAgICAvLyBjb21tdW5pdHlcbiAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hdGMnLFxuICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjJyxcbiAgICAgICAgJ0VYVF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCcsXG4gICAgICAgICdXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQnLFxuICAgICAgICAnRVhUX3NSR0InLFxuICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnLFxuICAgICAgICAnRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5JyxcbiAgICAgICAgJ0VYVF9jb2xvcl9idWZmZXJfZmxvYXQnXG4gICAgXTtcblxuICAgIGxldCBfYm91bmRDb250ZXh0ID0gbnVsbDtcbiAgICBsZXQgX2NvbnRleHRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIHJmYzQxMjIgdmVyc2lvbiA0IGNvbXBsaWFudCBVVUlELlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gVGhlIFVVSUQgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFVVSUQoKSB7XG4gICAgICAgIGxldCByZXBsYWNlID0gZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgICAgICAgICAgbGV0IHYgPSAoYyA9PT0gJ3gnKSA/IHIgOiAociAmIDB4MyB8IDB4OCk7XG4gICAgICAgICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIHJlcGxhY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBIVE1MQ2FudmFzRWxlbWVudCBlbGVtZW50LiBJZiB0aGVyZSBpcyBubyBpZCwgaXQgZ2VuZXJhdGVzIG9uZSBhbmQgYXBwZW5kcyBpdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gY2FudmFzIC0gVGhlIENhbnZhcyBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBDYW52YXMgaWQgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldElkKGNhbnZhcykge1xuICAgICAgICBpZiAoIWNhbnZhcy5pZCkge1xuICAgICAgICAgICAgY2FudmFzLmlkID0gZ2V0VVVJRCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYW52YXMuaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIENhbnZhcyBlbGVtZW50IG9iamVjdCBmcm9tIGVpdGhlciBhbiBleGlzdGluZyBvYmplY3QsIG9yIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZCBvciBzZWxlY3RvciBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRDYW52YXMoYXJnKSB7XG4gICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFyZykgfHxcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gcmV0cmlldmUgYSB3cmFwcGVkIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdCB0byBjcmVhdGUgdGhlIGNvbnRleHQgdW5kZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjb250ZXh0IHdyYXBwZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKSB7XG4gICAgICAgIGlmIChhcmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKF9ib3VuZENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gbGFzdCBib3VuZCBjb250ZXh0XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9ib3VuZENvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgY2FudmFzID0gZ2V0Q2FudmFzKGFyZyk7XG4gICAgICAgICAgICBpZiAoY2FudmFzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0c1tnZXRJZChjYW52YXMpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBubyBib3VuZCBjb250ZXh0IG9yIGFyZ3VtZW50XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYWxsIGtub3duIGV4dGVuc2lvbnMgZm9yIGEgcHJvdmlkZWQgV2ViR0xSZW5kZXJpbmdDb250ZXh0LiBTdG9yZXMgdGhlIHJlc3VsdHMgaW4gdGhlIGNvbnRleHQgd3JhcHBlciBmb3IgbGF0ZXIgcXVlcmllcy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRXcmFwcGVyIC0gVGhlIGNvbnRleHQgd3JhcHBlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkRXh0ZW5zaW9ucyhjb250ZXh0V3JhcHBlcikge1xuICAgICAgICBsZXQgZ2wgPSBjb250ZXh0V3JhcHBlci5nbDtcbiAgICAgICAgRVhURU5TSU9OUy5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnRleHRXcmFwcGVyLmV4dGVuc2lvbnNbaWRdID0gZ2wuZ2V0RXh0ZW5zaW9uKGlkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gY3JlYXRlIGEgV2ViR0xSZW5kZXJpbmdDb250ZXh0IGFuZCBsb2FkIGFsbCBleHRlbnNpb25zLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSAtIFRoZSBDYW52YXMgZWxlbWVudCBvYmplY3QgdG8gY3JlYXRlIHRoZSBjb250ZXh0IHVuZGVyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fX0gb3B0aW9ucyAtIFBhcmFtZXRlcnMgdG8gdGhlIHdlYmdsIGNvbnRleHQsIG9ubHkgdXNlZCBkdXJpbmcgaW5zdGFudGlhdGlvbi4gT3B0aW9uYWwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjb250ZXh0IHdyYXBwZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udGV4dFdyYXBwZXIoY2FudmFzLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdGlvbnMpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnLCBvcHRpb25zKTtcbiAgICAgICAgLy8gd3JhcCBjb250ZXh0XG4gICAgICAgIGxldCBjb250ZXh0V3JhcHBlciA9IHtcbiAgICAgICAgICAgIGlkOiBnZXRJZChjYW52YXMpLFxuICAgICAgICAgICAgZ2w6IGdsLFxuICAgICAgICAgICAgZXh0ZW5zaW9uczoge31cbiAgICAgICAgfTtcbiAgICAgICAgLy8gbG9hZCBXZWJHTCBleHRlbnNpb25zXG4gICAgICAgIGxvYWRFeHRlbnNpb25zKGNvbnRleHRXcmFwcGVyKTtcbiAgICAgICAgLy8gYWRkIGNvbnRleHQgd3JhcHBlciB0byBtYXBcbiAgICAgICAgX2NvbnRleHRzW2dldElkKGNhbnZhcyldID0gY29udGV4dFdyYXBwZXI7XG4gICAgICAgIC8vIGJpbmQgdGhlIGNvbnRleHRcbiAgICAgICAgX2JvdW5kQ29udGV4dCA9IGNvbnRleHRXcmFwcGVyO1xuICAgICAgICByZXR1cm4gY29udGV4dFdyYXBwZXI7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnQgYW5kIGJpbmRzIGl0LiBXaGlsZSBib3VuZCwgdGhlIGFjdGl2ZSBjb250ZXh0IHdpbGwgYmUgdXNlZCBpbXBsaWNpdGx5IGJ5IGFueSBpbnN0YW50aWF0ZWQgYGVzcGVyYCBjb25zdHJ1Y3RzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7V2ViR0xDb250ZXh0fSBUaGUgbmFtZXNwYWNlLCB1c2VkIGZvciBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICBfYm91bmRDb250ZXh0ID0gd3JhcHBlcjtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGV4aXN0cyBmb3IgcHJvdmlkZWQgYXJndW1lbnQgJyR7YXJnfSdgO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRyaWV2ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50LiBJZiBubyBjb250ZXh0IGV4aXN0cywgb25lIGlzIGNyZWF0ZWQuXG4gICAgICAgICAqIER1cmluZyBjcmVhdGlvbiBhdHRlbXB0cyB0byBsb2FkIGFsbCBleHRlbnNpb25zIGZvdW5kIGF0OiBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS93ZWJnbC9leHRlbnNpb25zLy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFBhcmFtZXRlcnMgdG8gdGhlIHdlYmdsIGNvbnRleHQsIG9ubHkgdXNlZCBkdXJpbmcgaW5zdGFudGlhdGlvbi4gT3B0aW9uYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gVGhlIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGFyZywgb3B0aW9ucykge1xuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSBnZXRDb250ZXh0V3JhcHBlcihhcmcpO1xuICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgIC8vIHJldHVybiB0aGUgbmF0aXZlIFdlYkdMUmVuZGVyaW5nQ29udGV4dFxuICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXIuZ2w7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnZXQgY2FudmFzIGVsZW1lbnRcbiAgICAgICAgICAgIGxldCBjYW52YXMgPSBnZXRDYW52YXMoYXJnKTtcbiAgICAgICAgICAgIC8vIHRyeSB0byBmaW5kIG9yIGNyZWF0ZSBjb250ZXh0XG4gICAgICAgICAgICBpZiAoIWNhbnZhcykge1xuICAgICAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBjb250ZXh0XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29udGV4dFdyYXBwZXIoY2FudmFzLCBvcHRpb25zKS5nbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IG9iamVjdCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH19IG9wdGlvbnMgLSBQYXJhbWV0ZXJzIHRvIHRoZSB3ZWJnbCBjb250ZXh0LCBvbmx5IHVzZWQgZHVyaW5nIGluc3RhbnRpYXRpb24uIE9wdGlvbmFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICAgIGxldCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcbiAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgZGVsZXRlIF9jb250ZXh0c1t3cmFwcGVyLmlkXTtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaWYgY3VycmVudGx5IGJvdW5kXG4gICAgICAgICAgICAgICAgaWYgKHdyYXBwZXIgPT09IF9ib3VuZENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgX2JvdW5kQ29udGV4dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBgTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHByb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgJHt0eXBlb2YgYXJnfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHN1cHBvcnRlZCBleHRlbnNpb25zIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBBbGwgc3VwcG9ydGVkIGV4dGVuc2lvbnMuXG4gICAgICAgICAqL1xuICAgICAgICBzdXBwb3J0ZWRFeHRlbnNpb25zOiBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICAgIGxldCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcbiAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgbGV0IHN1cHBvcnRlZCA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGV4dGVuc2lvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cHBvcnRlZC5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwcG9ydGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgYE5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIGNvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBwcm92aWRlZCBhcmd1bWVudCBvZiB0eXBlICR7dHlwZW9mIGFyZ31gO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB1bnN1cHBvcnRlZCBleHRlbnNpb25zIGZvciB0aGUgcHJvdmlkZWQgb3IgY3VycmVudGx5IGJvdW5kIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBBbGwgdW5zdXBwb3J0ZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIHVuc3VwcG9ydGVkRXh0ZW5zaW9uczogZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgICBsZXQgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG4gICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuICAgICAgICAgICAgICAgIGxldCB1bnN1cHBvcnRlZCA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGV4dGVuc2lvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZXh0ZW5zaW9uc1trZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bnN1cHBvcnRlZC5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5zdXBwb3J0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBgTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgY291bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHByb3ZpZGVkIGFyZ3VtZW50IG9mIHR5cGUgJHt0eXBlb2YgYXJnfWA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBpZiBhbiBleHRlbnNpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXh0ZW5zaW9uIC0gVGhlIGV4dGVuc2lvbiBuYW1lLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvdmlkZWQgZXh0ZW5zaW9uIGhhcyBiZWVuIGxvYWRlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAqL1xuICAgICAgICBjaGVja0V4dGVuc2lvbjogZnVuY3Rpb24oYXJnLCBleHRlbnNpb24pIHtcbiAgICAgICAgICAgIGlmICghZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hpZnQgcGFyYW1ldGVycyBpZiBubyBjYW52YXMgYXJnIGlzIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gYXJnO1xuICAgICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB3cmFwcGVyID0gZ2V0Q29udGV4dFdyYXBwZXIoYXJnKTtcbiAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV4dGVuc2lvbnMgPSB3cmFwcGVyLmV4dGVuc2lvbnM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4dGVuc2lvbnNbZXh0ZW5zaW9uXSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhbiBleHRlbnNpb24gaWYgaXQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBmb3IgdGhlIHByb3ZpZGVkIG9yIGN1cnJlbnRseSBib3VuZCBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXh0ZW5zaW9uIC0gVGhlIGV4dGVuc2lvbiBuYW1lLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvdmlkZWQgZXh0ZW5zaW9uIGhhcyBiZWVuIGxvYWRlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAqL1xuICAgICAgICBnZXRFeHRlbnNpb246IGZ1bmN0aW9uKGFyZywgZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICBpZiAoIWV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgIC8vIHNoaWZ0IHBhcmFtZXRlcnMgaWYgbm8gY2FudmFzIGFyZyBpcyBwcm92aWRlZFxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IGFyZztcbiAgICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgd3JhcHBlciA9IGdldENvbnRleHRXcmFwcGVyKGFyZyk7XG4gICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb25zID0gd3JhcHBlci5leHRlbnNpb25zO1xuICAgICAgICAgICAgICAgIHJldHVybiBleHRlbnNpb25zW2V4dGVuc2lvbl0gfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGBObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggcHJvdmlkZWQgYXJndW1lbnQgb2YgdHlwZSAke3R5cGVvZiBhcmd9YDtcbiAgICAgICAgfVxuICAgIH07XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICAgICBJbmRleEJ1ZmZlcjogcmVxdWlyZSgnLi9jb3JlL0luZGV4QnVmZmVyJyksXHJcbiAgICAgICAgUmVuZGVyYWJsZTogcmVxdWlyZSgnLi9jb3JlL1JlbmRlcmFibGUnKSxcclxuICAgICAgICBSZW5kZXJUYXJnZXQ6IHJlcXVpcmUoJy4vY29yZS9SZW5kZXJUYXJnZXQnKSxcclxuICAgICAgICBTaGFkZXI6IHJlcXVpcmUoJy4vY29yZS9TaGFkZXInKSxcclxuICAgICAgICBUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlMkQnKSxcclxuICAgICAgICBDb2xvclRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL0NvbG9yVGV4dHVyZTJEJyksXHJcbiAgICAgICAgRGVwdGhUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9EZXB0aFRleHR1cmUyRCcpLFxyXG4gICAgICAgIFRleHR1cmVDdWJlTWFwOiByZXF1aXJlKCcuL2NvcmUvVGV4dHVyZUN1YmVNYXAnKSxcclxuICAgICAgICBWZXJ0ZXhCdWZmZXI6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcclxuICAgICAgICBWZXJ0ZXhQYWNrYWdlOiByZXF1aXJlKCcuL2NvcmUvVmVydGV4UGFja2FnZScpLFxyXG4gICAgICAgIFZpZXdwb3J0OiByZXF1aXJlKCcuL2NvcmUvVmlld3BvcnQnKSxcclxuICAgICAgICBXZWJHTENvbnRleHQ6IHJlcXVpcmUoJy4vY29yZS9XZWJHTENvbnRleHQnKVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBnZXRJdGVyYXRvcihhcmcpIHtcbiAgICAgICAgbGV0IGkgPSAtMTtcbiAgICAgICAgbGV0IGxlbjtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICAgICAgbGVuID0gYXJnLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBpIDogbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhhcmcpO1xuICAgICAgICBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBrZXlzW2ldIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChmbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBmbiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZWFjaChvYmplY3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2spO1xuICAgICAgICBsZXQga2V5O1xuICAgICAgICBsZXQgY29tcGxldGVkID0gMDtcblxuICAgICAgICBmdW5jdGlvbiBkb25lKGVycikge1xuICAgICAgICAgICAgY29tcGxldGVkLS07XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBudWxsICYmIGNvbXBsZXRlZCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYga2V5IGlzIG51bGwgaW4gY2FzZSBpdGVyYXRvciBpc24ndCBleGhhdXN0ZWQgYW5kIGRvbmVcbiAgICAgICAgICAgICAgICAvLyB3YXMgcmVzb2x2ZWQgc3luY2hyb25vdXNseS5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpdGVyID0gZ2V0SXRlcmF0b3Iob2JqZWN0KTtcbiAgICAgICAgd2hpbGUgKChrZXkgPSBpdGVyKCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb21wbGV0ZWQgKz0gMTtcbiAgICAgICAgICAgIGl0ZXJhdG9yKG9iamVjdFtrZXldLCBrZXksIGRvbmUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wbGV0ZWQgPT09IDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgYSBzZXQgb2YgZnVuY3Rpb25zIGFzeW5jaHJvbm91c2x5LCBvbmNlIGFsbCBoYXZlIGJlZW5cbiAgICAgICAgICogY29tcGxldGVkLCBleGVjdXRlIHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi4gSm9icyBtYXkgYmUgcGFzc2VkXG4gICAgICAgICAqIGFzIGFuIGFycmF5IG9yIG9iamVjdC4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgcGFzc2VkIHRoZVxuICAgICAgICAgKiByZXN1bHRzIGluIHRoZSBzYW1lIGZvcm1hdCBhcyB0aGUgdGFza3MuIEFsbCB0YXNrcyBtdXN0IGhhdmUgYWNjZXB0XG4gICAgICAgICAqIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdXBvbiBjb21wbGV0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gdGFza3MgLSBUaGUgc2V0IG9mIGZ1bmN0aW9ucyB0byBleGVjdXRlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB1cG9uIGNvbXBsZXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBwYXJhbGxlbDogZnVuY3Rpb24odGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IEFycmF5LmlzQXJyYXkodGFza3MpID8gW10gOiB7fTtcbiAgICAgICAgICAgIGVhY2godGFza3MsIGZ1bmN0aW9uKHRhc2ssIGtleSwgZG9uZSkge1xuICAgICAgICAgICAgICAgIHRhc2soZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trZXldID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICBkb25lKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZHMgYW4gR0VUIHJlcXVlc3QgY3JlYXRlIGFuIEltYWdlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgWEhSIG9wdGlvbnMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCAtIFRoZSBVUkwgZm9yIHRoZSByZXNvdXJjZS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5zdWNjZXNzIC0gVGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuZXJyb3IgLSBUaGUgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICBsb2FkOiBmdW5jdGlvbiAob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhpbWFnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyID0gJ1VuYWJsZSB0byBsb2FkIGltYWdlIGZyb20gVVJMOiBgJyArIGV2ZW50LnBhdGhbMF0uY3VycmVudFNyYyArICdgJztcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSBvcHRpb25zLnVybDtcbiAgICAgICAgfVxuICAgIH07XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgbGV0IFV0aWwgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYXJndW1lbnQgaXMgb25lIG9mIHRoZSBXZWJHTCBgdGV4SW1hZ2UyRGAgb3ZlcnJpZGRlblxuICAgICAqIGNhbnZhcyB0eXBlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gYXJnIC0gVGhlIGFyZ3VtZW50IHRvIHRlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sfSAtIFdoZXRoZXIgb3Igbm90IGl0IGlzIGEgY2FudmFzIHR5cGUuXG4gICAgICovXG4gICAgVXRpbC5pc0NhbnZhc1R5cGUgPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIEltYWdlRGF0YSB8fFxuICAgICAgICAgICAgYXJnIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCB8fFxuICAgICAgICAgICAgYXJnIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQgfHxcbiAgICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdGV4dHVyZSBNVVNUIGJlIGEgcG93ZXItb2YtdHdvLiBPdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgLSBUaGUgdGV4dHVyZSBzcGVjaWZpY2F0aW9uIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2x9IC0gV2hldGhlciBvciBub3QgdGhlIHRleHR1cmUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3by5cbiAgICAgKi9cbiAgICBVdGlsLm11c3RCZVBvd2VyT2ZUd28gPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgICAgIC8vIEFjY29yZGluZyB0bzpcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYkdMX0FQSS9UdXRvcmlhbC9Vc2luZ190ZXh0dXJlc19pbl9XZWJHTCNOb25fcG93ZXItb2YtdHdvX3RleHR1cmVzXG4gICAgICAgIC8vIE4tUE9UIHRleHR1cmVzIGNhbm5vdCBiZSB1c2VkIHdpdGggbWlwbWFwcGluZyBhbmQgdGhleSBtdXN0IG5vdCBcIlJFUEVBVFwiXG4gICAgICAgIHJldHVybiBzcGVjLm1pcE1hcCB8fFxuICAgICAgICAgICAgc3BlYy53cmFwUyA9PT0gJ1JFUEVBVCcgfHxcbiAgICAgICAgICAgIHNwZWMud3JhcFMgPT09ICdNSVJST1JFRF9SRVBFQVQnIHx8XG4gICAgICAgICAgICBzcGVjLndyYXBUID09PSAnUkVQRUFUJyB8fFxuICAgICAgICAgICAgc3BlYy53cmFwVCA9PT0gJ01JUlJPUkVEX1JFUEVBVCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcHJvdmlkZWQgaW50ZWdlciBpcyBhIHBvd2VyIG9mIHR3by5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW0gLSBUaGUgbnVtYmVyIHRvIHRlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBudW1iZXIgaXMgYSBwb3dlciBvZiB0d28uXG4gICAgICovXG4gICAgVXRpbC5pc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgcmV0dXJuIChudW0gIT09IDApID8gKG51bSAmIChudW0gLSAxKSkgPT09IDAgOiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3byBmb3IgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBFeC5cbiAgICAgKlxuICAgICAqICAgICAyMDAgLT4gMjU2XG4gICAgICogICAgIDI1NiAtPiAyNTZcbiAgICAgKiAgICAgMjU3IC0+IDUxMlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bSAtIFRoZSBudW1iZXIgdG8gbW9kaWZ5LlxuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAtIE5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28uXG4gICAgICovXG4gICAgVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28gPSBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgbGV0IGk7XG4gICAgICAgIGlmIChudW0gIT09IDApIHtcbiAgICAgICAgICAgIG51bSA9IG51bS0xO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaT0xOyBpPDMyOyBpPDw9MSkge1xuICAgICAgICAgICAgbnVtID0gbnVtIHwgbnVtID4+IGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bSArIDE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSB0ZXh0dXJlIG11c3QgYmUgYSBQT1QsIHJlc2l6ZXMgYW5kIHJldHVybnMgdGhlIGltYWdlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyAtIFRoZSB0ZXh0dXJlIHNwZWNpZmljYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1nIC0gVGhlIGltYWdlIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0hUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR9IC0gVGhlIG9yaWdpbmFsIGltYWdlLCBvciB0aGUgcmVzaXplZCBjYW52YXMgZWxlbWVudC5cbiAgICAgKi9cbiAgICBVdGlsLnJlc2l6ZUNhbnZhcyA9IGZ1bmN0aW9uKHNwZWMsIGltZykge1xuICAgICAgICBpZiAoIVV0aWwubXVzdEJlUG93ZXJPZlR3byhzcGVjKSB8fFxuICAgICAgICAgICAgKFV0aWwuaXNQb3dlck9mVHdvKGltZy53aWR0aCkgJiYgVXRpbC5pc1Bvd2VyT2ZUd28oaW1nLmhlaWdodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW1nO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNyZWF0ZSBhbiBlbXB0eSBjYW52YXMgZWxlbWVudFxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKGltZy53aWR0aCk7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byhpbWcuaGVpZ2h0KTtcbiAgICAgICAgLy8gY29weSB0aGUgaW1hZ2UgY29udGVudHMgdG8gdGhlIGNhbnZhc1xuICAgICAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gVXRpbDtcblxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kcyBhbiBYTUxIdHRwUmVxdWVzdCBHRVQgcmVxdWVzdCB0byB0aGUgc3VwcGxpZWQgdXJsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBYSFIgb3B0aW9ucy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudXJsIC0gVGhlIFVSTCBmb3IgdGhlIHJlc291cmNlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnN1Y2Nlc3MgLSBUaGUgc3VjY2VzcyBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5lcnJvciAtIFRoZSBlcnJvciBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5yZXNwb25zZVR5cGUgLSBUaGUgcmVzcG9uc2VUeXBlIG9mIHRoZSBYSFIuXG4gICAgICAgICAqL1xuICAgICAgICBsb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgb3B0aW9ucy51cmwsIHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MocmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoJ0dFVCAnICsgcmVxdWVzdC5yZXNwb25zZVVSTCArICcgJyArIHJlcXVlc3Quc3RhdHVzICsgJyAoJyArIHJlcXVlc3Quc3RhdHVzVGV4dCArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KCkpO1xuIl19
