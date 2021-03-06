'use strict';

const WebGLContext = require('./WebGLContext');
const Util = require('../util/Util');

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
const DEPTH_TYPES = {
	DEPTH_COMPONENT: true,
	DEPTH_STENCIL: true
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
const DEFAULT_WRAP = 'REPEAT';

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
 * A texture class to represent a 2D texture.
 */
class Texture2D {

	/**
	 * Instantiates a Texture2D object.
	 *
	 * @param {Object} spec - The specification arguments.
	 * @param {ArrayBuffer|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.src - The data to buffer.
	 * @param {number} spec.width - The width of the texture.
	 * @param {number} spec.height - The height of the texture.
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
	 */
	constructor(spec = {}) {
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
			throw `Cannot create Texture2D of format \`${this.format}\` as \`WEBGL_depth_texture\` extension is unsupported`;
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
						throw `Parameters require a power-of-two texture, yet provided width of \`${spec.width}\` is not a power of two`;
					}
					if (!Util.isPowerOfTwo(spec.height)) {
						throw `Parameters require a power-of-two texture, yet provided height of \`${spec.height}\` is not a power of two`;
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
	 * @param {number} location - The texture unit location index. Defaults to 0.
	 *
	 * @returns {Texture2D} The texture object, for chaining.
	 */
	bind(location = 0) {
		if (!Number.isInteger(location) || location < 0) {
			throw 'Texture unit location is invalid';
		}
		// bind texture
		const gl = this.gl;
		gl.activeTexture(gl['TEXTURE' + location]);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		return this;
	}

	/**
	 * Unbinds the texture object.
	 *
	 * @returns {Texture2D} The texture object, for chaining.
	 */
	unbind() {
		// unbind texture
		const gl = this.gl;
		gl.bindTexture(gl.TEXTURE_2D, null);
		return this;
	}

	/**
	 * Buffer data into the texture.
	 *
	 * @param {Array|ArrayBuffer} data - The data array to buffer.
	 * @param {number} width - The width of the data.
	 * @param {number} height - The height of the data.
	 *
	 * @returns {Texture2D} The texture object, for chaining.
	 */
	bufferData(data, width, height) {
		const gl = this.gl;
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
			throw 'Argument must be of type `Array`, `ArrayBuffer`, ' +
				'`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' +
				'`HTMLCanvasElement`, `HTMLVideoElement`, or null';
		}
		if (Util.isCanvasType(data)) {
			// store width and height
			this.width = data.width;
			this.height = data.height;
			// buffer the texture
			gl.texImage2D(
				gl.TEXTURE_2D,
				0, // mip-map level
				gl[this.format], // webgl requires format === internalFormat
				gl[this.format],
				gl[this.type],
				data);
		} else {
			// store width and height
			this.width = width || this.width;
			this.height = height || this.height;
			// buffer the texture data
			gl.texImage2D(
				gl.TEXTURE_2D,
				0, // mip-map level
				gl[this.format], // webgl requires format === internalFormat
				this.width,
				this.height,
				0, // border, must be 0
				gl[this.format],
				gl[this.type],
				data);
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
	 * @param {Array|ArrayBuffer} data - The data array to buffer.
	 * @param {number} xOffset - The x offset at which to buffer.
	 * @param {number} yOffset - The y offset at which to buffer.
	 * @param {number} width - The width of the data.
	 * @param {number} height - The height of the data.
	 *
	 * @returns {Texture2D} The texture object, for chaining.
	 */
	bufferSubData(data, xOffset = 0, yOffset = 0, width = undefined, height = undefined) {
		const gl = this.gl;
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
			throw 'Argument must be of type `Array`, `ArrayBuffer`, ' +
				'`ArrayBufferView`, `ImageData`, `HTMLImageElement`, ' +
				'`HTMLCanvasElement`, or `HTMLVideoElement`';
		}
		if (Util.isCanvasType(data)) {
			// buffer the texture
			gl.texSubImage2D(
				gl.TEXTURE_2D,
				0, // mip-map level
				xOffset,
				yOffset,
				gl[this.format],
				gl[this.type],
				data);
		} else {
			// check that width is provided
			if (!Number.isInteger(width)) {
				throw `Provided width of \`${width}\` is invalid`;
			}
			// check that height is provided
			if (!Number.isInteger(height)) {
				throw `Provided height of \`${height}\` is invalid`;
			}
			// check that we aren't overflowing the buffer
			if (width + xOffset > this.width) {
				throw `Provided width of \`${width}\` and xOffset of ` +
					` \`${xOffset}\` overflows the texture width of ` +
					`\`${this.width}\``;
			}
			if (height + yOffset > this.height) {
				throw `Provided width of \`${height}\` and xOffset of ` +
					` \`${yOffset}\` overflows the texture width of ` +
					`\`${this.height}\``;
			}
			// buffer the texture data
			gl.texSubImage2D(
				gl.TEXTURE_2D,
				0, // mip-map level
				xOffset,
				yOffset,
				width,
				height,
				gl[this.format],
				gl[this.type],
				data);
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
	 * @param {string} params.wrap - The wrapping type over both S and T dimension.
	 * @param {string} params.wrapS - The wrapping type over the S dimension.
	 * @param {string} params.wrapT - The wrapping type over the T dimension.
	 * @param {string} params.filter - The min / mag filter used during scaling.
	 * @param {string} params.minFilter - The minification filter used during scaling.
	 * @param {string} params.magFilter - The magnification filter used during scaling.
	 *
	 * @returns {Texture2D} The texture object, for chaining.
	 */
	setParameters(params) {
		const gl = this.gl;
		// bind texture
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		// set wrap S parameter
		let param = params.wrapS || params.wrap;
		if (param) {
			if (WRAP_MODES[param]) {
				this.wrapS = param;
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
			} else {
				throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_WRAP_S\``;
			}
		}
		// set wrap T parameter
		param = params.wrapT || params.wrap;
		if (param) {
			if (WRAP_MODES[param]) {
				this.wrapT = param;
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
			} else {
				throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_WRAP_T\``;
			}
		}
		// set mag filter parameter
		param = params.magFilter || params.filter;
		if (param) {
			if (MAG_FILTERS[param]) {
				this.magFilter = param;
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
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
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
				} else  {
					throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_MIN_FILTER\``;
				}
			} else {
				if (MIN_FILTERS[param]) {
					this.minFilter = param;
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
				} else {
					throw `Texture parameter \`${param}\` is not a valid value for \`TEXTURE_MIN_FILTER\``;
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
	 * @param {number} width - The new width of the texture.
	 * @param {number} height - The new height of the texture.
	 *
	 * @returns {Texture2D} The texture object, for chaining.
	 */
	resize(width, height) {
		if (typeof width !== 'number' || (width <= 0)) {
			throw `Provided width of \`${width}\` is invalid`;
		}
		if (typeof height !== 'number' || (height <= 0)) {
			throw `Provided height of \`${height}\` is invalid`;
		}
		this.bufferData(null, width, height);
		return this;
	}
}

module.exports = Texture2D;
