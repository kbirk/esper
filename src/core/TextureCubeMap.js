(function () {

    'use strict';

    let WebGLContext = require('./WebGLContext');
    let Async = require('../util/Async');
    let Util = require('../util/Util');
    let ImageLoader = require('../util/ImageLoader');

    let FACES = [
        '-x', '+x',
        '-y', '+y',
        '-z', '+z'
    ];
    let FACE_TARGETS = {
        '+z': 'TEXTURE_CUBE_MAP_POSITIVE_Z',
        '-z': 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
        '+x': 'TEXTURE_CUBE_MAP_POSITIVE_X',
        '-x': 'TEXTURE_CUBE_MAP_NEGATIVE_X',
        '+y': 'TEXTURE_CUBE_MAP_POSITIVE_Y',
        '-y': 'TEXTURE_CUBE_MAP_NEGATIVE_Y'
    };
    let TARGETS = {
        TEXTURE_CUBE_MAP_POSITIVE_Z: true,
        TEXTURE_CUBE_MAP_NEGATIVE_Z: true,
        TEXTURE_CUBE_MAP_POSITIVE_X: true,
        TEXTURE_CUBE_MAP_NEGATIVE_X: true,
        TEXTURE_CUBE_MAP_POSITIVE_Y: true,
        TEXTURE_CUBE_MAP_NEGATIVE_Y: true
    };
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
    let FORMATS = {
        RGB: true,
        RGBA: true
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
    let DEFAULT_WRAP = 'CLAMP_TO_EDGE';

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
            throw `Parameters require a power-of-two texture, yet provided size of ${cubeMap.width} is not a power of two`;
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
        return function(done) {
            // TODO: put extension handling for arraybuffer / image / video differentiation
            ImageLoader.load({
                url: url,
                success: image => {
                    image = Util.resizeCanvas(cubeMap, image);
                    cubeMap.bufferData(target, image);
                    done(null);
                },
                error: err => {
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
        return function(done) {
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
        return function(done) {
            cubeMap.bufferData(target, arr);
            done(null);
        };
    }

    /**
     * @class TextureCubeMap
     * @classdesc A texture class to represent a cube map texture.
     */
    class TextureCubeMap {

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
        constructor(spec = {}, callback = null) {
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
                let tasks = [];
                FACES.forEach(id => {
                    let face = spec.faces[id];
                    let target = FACE_TARGETS[id];
                    // load based on type
                    if (typeof face === 'string') {
                        // url
                        tasks.push(loadFaceURL(this, target, face));
                    } else if (Util.isCanvasType(face)) {
                        // canvas
                        tasks.push(loadFaceCanvas(this, target, face));
                    } else {
                        // array / arraybuffer or null
                        tasks.push(loadFaceArray(this, target, face));
                    }
                });
                Async.parallel(tasks, err => {
                    if (err) {
                        if (callback) {
                            setTimeout(() => {
                                callback(err, null);
                            });
                        }
                        return;
                    }
                    // set parameters
                    this.setParameters(this);
                    if (callback) {
                        setTimeout(() => {
                            callback(null, this);
                        });
                    }
                });
            } else {
                // null
                checkDimensions(this);
                FACES.forEach(id => {
                    this.bufferData(FACE_TARGETS[id], null);
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
        bind(location = 0) {
            if (!Number.isInteger(location) || location < 0) {
                throw 'Texture unit location is invalid';
            }
            // bind cube map texture
            let gl = this.gl;
            gl.activeTexture(gl['TEXTURE' + location]);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
            return this;
        }

        /**
         * Unbinds the texture object.
         *
         * @return {TextureCubeMap} - The texture object, for chaining.
         */
        unbind() {
            // unbind cube map texture
            let gl = this.gl;
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
        bufferData(target, data) {
            if (!TARGETS[target]) {
                throw `Provided \`target\` of ${target}  is invalid`;
            }
            let gl = this.gl;
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
                throw 'Argument must be of type `Array`, `ArrayBuffer`, ' +
                    '`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' +
                    '`HTMLCanvasElement`, `HTMLVideoElement`, or null';
            }
            // buffer the data
            if (Util.isCanvasType(data)) {
                // store width and height
                this.width = data.width;
                this.height = data.height;
                // buffer the texture
                gl.texImage2D(
                    gl[target],
                    0, // mip-map level,
                    gl[this.format], // webgl requires format === internalFormat
                    gl[this.format],
                    gl[this.type],
                    data);
            } else {
                // buffer the texture data
                gl.texImage2D(
                    gl[target],
                    0, // mip-map level
                    gl[this.format], // webgl requires format === internalFormat
                    this.width,
                    this.height,
                    0, // border, must be 0
                    gl[this.format],
                    gl[this.type],
                    data);
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
        setParameters(params) {
            let gl = this.gl;
            // bind texture
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
            // set wrap S parameter
            let param = params.wrapS || params.wrap;
            if (param) {
                if (WRAP_MODES[param]) {
                    this.wrapS = param;
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
                } else {
                    throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_WRAP_S\``;
                }
            }
            // set wrap T parameter
            param = params.wrapT || params.wrap;
            if (param) {
                if (WRAP_MODES[param]) {
                    this.wrapT = param;
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
                } else {
                    throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_WRAP_T\``;
                }
            }
            // set mag filter parameter
            param = params.magFilter || params.filter;
            if (param) {
                if (MAG_FILTERS[param]) {
                    this.magFilter = param;
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
                } else {
                    throw `Texture parameter \`${param}\` is not a valid value for 'TEXTURE_MAG_FILTER\``;
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
                    } else  {
                        throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_MIN_FILTER\``;
                    }
                } else {
                    if (MIN_FILTERS[param]) {
                        this.minFilter = param;
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
                    } else {
                        throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_MIN_FILTER\``;
                    }
                }
            }
            // unbind texture
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            return this;
        }
    }

    module.exports = TextureCubeMap;

}());
