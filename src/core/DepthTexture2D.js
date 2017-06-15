'use strict';

const Texture2D = require('./Texture2D');

const MAG_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
const MIN_FILTERS = {
	NEAREST: true,
	LINEAR: true
};
const WRAP_MODES = {
	REPEAT: true,
	CLAMP_TO_EDGE: true,
	MIRRORED_REPEAT: true
};
const DEPTH_TYPES = {
	UNSIGNED_BYTE: true,
	UNSIGNED_SHORT: true,
	UNSIGNED_INT: true
};
const FORMATS = {
	DEPTH_COMPONENT: true,
	DEPTH_STENCIL: true
};

/**
 * The default type for depth textures.
 * @private
 * @constant {string}
 */
const DEFAULT_TYPE = 'UNSIGNED_INT';

/**
 * The default format for depth textures.
 * @private
 * @constant {string}
 */
const DEFAULT_FORMAT = 'DEPTH_COMPONENT';

/**
 * The default wrap mode for depth textures.
 * @private
 * @constant {string}
 */
const DEFAULT_WRAP = 'CLAMP_TO_EDGE';

/**
 * The default min / mag filter for depth textures.
 * @private
 * @constant {string}
 */
const DEFAULT_FILTER = 'LINEAR';

/**
 * A texture class to represent a 2D depth texture.
 * @augments Texture2D
 */
class DepthTexture2D extends Texture2D {

	/**
	 * Instantiates a DepthTexture2D object.
	 *
	 * @param {Object} spec - The specification arguments.
	 * @param {Uint8Array|Uint16Array|Uint32Array} spec.src - The data to buffer.
	 * @param {number} spec.width - The width of the texture.
	 * @param {number} spec.height - The height of the texture.
	 * @param {string} spec.wrap - The wrapping type over both S and T dimension.
	 * @param {string} spec.wrapS - The wrapping type over the S dimension.
	 * @param {string} spec.wrapT - The wrapping type over the T dimension.
	 * @param {string} spec.filter - The min / mag filter used during scaling.
	 * @param {string} spec.minFilter - The minification filter used during scaling.
	 * @param {string} spec.magFilter - The magnification filter used during scaling.
	 * @param {string} spec.format - The texture pixel format.
	 * @param {string} spec.type - The texture pixel component type.
	 */
	constructor(spec = {}) {
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
		super(spec);
	}
}

module.exports = DepthTexture2D;
