'use strict';

const EXTENSIONS = [
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
	'WEBGL_compressed_texture_etc1',
	'EXT_disjoint_timer_query',
	'EXT_color_buffer_float'
];

/**
 * All context wrappers.
 * @private
 */
const _contexts = new Map();

/**
 * The currently bound context.
 * @private
 */
let _boundContext = null;

/**
 * Returns an rfc4122 version 4 compliant UUID.
 * @private
 *
 * @return {String} - The UUID string.
 */
function getUUID() {
	const replace = function(c) {
		const r = Math.random() * 16 | 0;
		const v = (c === 'x') ? r : (r & 0x3 | 0x8);
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
		return document.getElementById(arg) ||
			document.querySelector(arg);
	}
	return null;
}

/**
 * Returns a wrapped WebGLRenderingContext from the context itself.
 * @private
 *
 * @param {WebGLRenderingContext} context - The WebGLRenderingContext.
 *
 * @return {Object} The context wrapper.
 */
function getWrapperFromContext(context) {
	let found = null;
	_contexts.forEach(wrapper => {
		if (context === wrapper.gl) {
			found = wrapper;
		}
	});
	return found;
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
	} else if (arg instanceof WebGLRenderingContext) {
		return getWrapperFromContext(arg);
	} else {
		const canvas = getCanvas(arg);
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
	const gl = contextWrapper.gl;
	EXTENSIONS.forEach(id => {
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
	const gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
	// wrap context
	const contextWrapper = {
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
	bind: function(arg) {
		const wrapper = getContextWrapper(arg);
		if (wrapper) {
			_boundContext = wrapper;
			return this;
		}
		throw `No context exists for provided argument '${arg}'`;
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
	get: function(arg, options) {
		const wrapper = getContextWrapper(arg);
		if (wrapper) {
		   // return the native WebGLRenderingContext
		   return wrapper.gl;
		}
		// get canvas element
		const canvas = getCanvas(arg);
		// try to find or create context
		if (!canvas) {
			throw `No context is currently bound or could be associated with provided argument of type ${typeof arg}`;
		}
		// create context
		return createContextWrapper(canvas, options).gl;
	},

	/**
	 * Removes an existing WebGL context object for the provided or currently bound context object.
	 *
	 * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
	 * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
	 *
	 * @return {WebGLRenderingContext} The WebGLRenderingContext object.
	 */
	remove: function(arg) {
		const wrapper = getContextWrapper(arg);
		if (wrapper) {
			// delete the context
			_contexts.delete(wrapper.id);
			// remove if currently bound
			if (wrapper === _boundContext) {
				_boundContext = null;
			}
		} else {
			throw `No context is currently bound or could be associated with provided argument of type ${typeof arg}`;
		}
	},

	/**
	 * Returns an array of all supported extensions for the provided or currently bound context object.
	 *
	 * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
	 *
	 * @return {Array} All supported extensions.
	 */
	supportedExtensions: function(arg) {
		const wrapper = getContextWrapper(arg);
		if (wrapper) {
			const extensions = wrapper.extensions;
			const supported = [];
			extensions.forEach((extension, key) => {
				if (extension) {
					supported.push(key);
				}
			});
			return supported;
		}
		throw `No context is currently bound or could be associated with provided argument of type ${typeof arg}`;
	},

	/**
	 * Returns an array of all unsupported extensions for the provided or currently bound context object.
	 *
	 * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
	 *
	 * @return {Array} All unsupported extensions.
	 */
	unsupportedExtensions: function(arg) {
		const wrapper = getContextWrapper(arg);
		if (wrapper) {
			const extensions = wrapper.extensions;
			const unsupported = [];
			extensions.forEach((extension, key) => {
				if (!extension) {
					unsupported.push(key);
				}
			});
			return unsupported;
		}
		throw `No context is currently bound or could be associated with provided argument of type ${typeof arg}`;
	},

	/**
	 * Checks if an extension has been successfully loaded for the provided or currently bound context object.
	 *
	 * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
	 * @param {String} extension - The extension name.
	 *
	 * @return {boolean} Whether or not the provided extension has been loaded successfully.
	 */
	checkExtension: function(arg, extension) {
		if (!extension) {
			// shift parameters if no canvas arg is provided
			extension = arg;
			arg = undefined;
		}
		const wrapper = getContextWrapper(arg);
		if (wrapper) {
			const extensions = wrapper.extensions;
			return extensions.get(extension) ? true : false;
		}
		throw `No context is currently bound or could be associated with provided argument of type ${typeof arg}`;
	},

	/**
	 * Returns an extension if it has been successfully loaded for the provided or currently bound context object.
	 *
	 * @param {WebGLRenderingContext|HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
	 * @param {String} extension - The extension name.
	 *
	 * @return {boolean} Whether or not the provided extension has been loaded successfully.
	 */
	getExtension: function(arg, extension) {
		if (!extension) {
			// shift parameters if no canvas arg is provided
			extension = arg;
			arg = undefined;
		}
		const wrapper = getContextWrapper(arg);
		if (wrapper) {
			const extensions = wrapper.extensions;
			return extensions.get(extension) || null;
		}
		throw `No context is currently bound or could be associated with provided argument of type ${typeof arg}`;
	}
};
