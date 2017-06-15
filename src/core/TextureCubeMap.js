'use strict';

const parallel = require('async/parallel');
const WebGLContext = require('./WebGLContext');
const ImageLoader = require('../util/ImageLoader');
const Util = require('../util/Util');

const FACES = [
	'-x', '+x',
	'-y', '+y',
	'-z', '+z'
];
const FACE_TARGETS = {
	'+z': 'TEXTURE_CUBE_MAP_POSITIVE_Z',
	'-z': 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
	'+x': 'TEXTURE_CUBE_MAP_POSITIVE_X',
	'-x': 'TEXTURE_CUBE_MAP_NEGATIVE_X',
	'+y': 'TEXTURE_CUBE_MAP_POSITIVE_Y',
	'-y': 'TEXTURE_CUBE_MAP_NEGATIVE_Y'
};
const TARGETS = {
	TEXTURE_CUBE_MAP_POSITIVE_Z: true,
	TEXTURE_CUBE_MAP_NEGATIVE_Z: true,
	TEXTURE_CUBE_MAP_POSITIVE_X: true,
	TEXTURE_CUBE_MAP_NEGATIVE_X: true,
	TEXTURE_CUBE_MAP_POSITIVE_Y: true,
	TEXTURE_CUBE_MAP_NEGATIVE_Y: true
};
const MAG_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
const MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true,
	NEAREST_MIPMAP_NEAREST: true,
	LINEAR_MIPMAP_NEAREST: true,
	NEAREST_MIPMAP_LINEAR: true,
	LINEAR_MIPMAP_LINEAR: true
};
const NON_MIPMAP_MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true,
};
const MIPMAP_MIN_FILTERS = {
	NEAREST_MIPMAP_NEAREST: true,
	LINEAR_MIPMAP_NEAREST: true,
	NEAREST_MIPMAP_LINEAR: true,
	LINEAR_MIPMAP_LINEAR: true
};
const WRAP_MODES = {
	REPEAT: true,
	MIRRORED_REPEAT: true,
	CLAMP_TO_EDGE: true
};
const FORMATS = {
	RGB: true,
	RGBA: true
};

/**
 * The default type for textures.
 * @private
 * @constant {string}
 */
const DEFAULT_TYPE = 'UNSIGNED_BYTE';

/**
 * The default format for textures.
 * @private
 * @constant {string}
 */
const DEFAULT_FORMAT = 'RGBA';

/**
 * The default wrap mode for textures.
 * @private
 * @constant {string}
 */
const DEFAULT_WRAP = 'CLAMP_TO_EDGE';

/**
 * The default min / mag filter for textures.
 * @private
 * @constant {string}
 */
const DEFAULT_FILTER = 'LINEAR';

/**
 * The default for whether alpha premultiplying is enabled.
 * @private
 * @constant {boolean}
 */
const DEFAULT_PREMULTIPLY_ALPHA = true;

/**
 * The default for whether mipmapping is enabled.
 * @private
 * @constant {boolean}
 */
const DEFAULT_MIPMAP = true;

/**
 * The default for whether invert-y is enabled.
 * @private
 * @constant {boolean}
 */
const DEFAULT_INVERT_Y = true;

/**
 * The default mip-mapping filter suffix.
 * @private
 * @constant {string}
 */
const DEFAULT_MIPMAP_MIN_FILTER_SUFFIX = '_MIPMAP_LINEAR';

/**
 * Checks the width and height of the cubemap and throws an exception if it does
 * not meet requirements.
 *
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
 *
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {string} target - The texture target.
 * @param {string} url - The url to load the face from.
 *
 * @returns {Function} The loader function.
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
 *
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {string} target - The texture target.
 * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} canvas - The canvas type object.
 *
 * @returns {Function} - The loader function.
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
 *
 * @private
 *
 * @param {TextureCubeMap} cubeMap - The cube map texture object.
 * @param {string} target - The texture target.
 * @param {Array|ArrayBuffer|ArrayBufferView} arr - The array type object.
 *
 * @returns {Function} The loader function.
 */
function loadFaceArray(cubeMap, target, arr) {
	checkDimensions(cubeMap);
	return function(done) {
		cubeMap.bufferData(target, arr);
		done(null);
	};
}

/**
 * A texture class to represent a cube map texture.
 */
class TextureCubeMap {

	/**
	 * Instantiates a TextureCubeMap object.
	 *
	 * @param {Object} spec - The specification arguments.
	 * @param {Object} spec.faces - The faces to buffer, under keys '+x', '+y', '+z', '-x', '-y', and '-z'.
	 * @param {number} spec.width - The width of the faces.
	 * @param {number} spec.height - The height of the faces.
	 * @param {string} spec.wrap - The wrapping type over both S and T dimension.
	 * @param {string} spec.wrapS - The wrapping type over the S dimension.
	 * @param {string} spec.wrapT - The wrapping type over the T dimension.
	 * @param {string} spec.filter - The min / mag filter used during scaling.
	 * @param {string} spec.minFilter - The minification filter used during scaling.
	 * @param {string} spec.magFilter - The magnification filter used during scaling.
	 * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
	 * @param {bool} spec.invertY - Whether or not invert-y is enabled.
	 * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
	 * @param {string} spec.format - The texture pixel format.
	 * @param {string} spec.type - The texture pixel component type.
	 * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
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
			const tasks = [];
			FACES.forEach(id => {
				const face = spec.faces[id];
				const target = FACE_TARGETS[id];
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
			parallel(tasks, err => {
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
	 * @param {number} location - The texture unit location index. Defaults to 0.
	 *
	 * @returns {TextureCubeMap} The texture object, for chaining.
	 */
	bind(location = 0) {
		if (!Number.isInteger(location) || location < 0) {
			throw 'Texture unit location is invalid';
		}
		// bind cube map texture
		const gl = this.gl;
		gl.activeTexture(gl['TEXTURE' + location]);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
		return this;
	}

	/**
	 * Unbinds the texture object.
	 *
	 * @returns {TextureCubeMap} - The texture object, for chaining.
	 */
	unbind() {
		// unbind cube map texture
		const gl = this.gl;
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		return this;
	}

	/**
	 * Buffer data into the respective cube map face.
	 *
	 * @param {string} target - The face target.
	 * @param {Object|null} data - The face data.
	 *
	 * @returns {TextureCubeMap} The texture object, for chaining.
	 */
	bufferData(target, data) {
		if (!TARGETS[target]) {
			throw `Provided \`target\` of ${target}  is invalid`;
		}
		const gl = this.gl;
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
	 * @param {string} params.wrap - The wrapping type over both S and T dimension.
	 * @param {string} params.wrapS - The wrapping type over the S dimension.
	 * @param {string} params.wrapT - The wrapping type over the T dimension.
	 * @param {string} params.filter - The min / mag filter used during scaling.
	 * @param {string} params.minFilter - The minification filter used during scaling.
	 * @param {string} params.magFilter - The magnification filter used during scaling.
	 *
	 * @returns {TextureCubeMap} The texture object, for chaining.
	 */
	setParameters(params) {
		const gl = this.gl;
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
