'use strict';

const WebGLContext = require('./WebGLContext');

const MODES = {
	POINTS: true,
	LINES: true,
	LINE_STRIP: true,
	LINE_LOOP: true,
	TRIANGLES: true,
	TRIANGLE_STRIP: true,
	TRIANGLE_FAN: true
};
const TYPES = {
	BYTE: true,
	UNSIGNED_BYTE: true,
	SHORT: true,
	UNSIGNED_SHORT: true,
	FIXED: true,
	FLOAT: true
};
const BYTES_PER_TYPE = {
	BYTE: 1,
	UNSIGNED_BYTE: 1,
	SHORT: 2,
	UNSIGNED_SHORT: 2,
	FIXED: 4,
	FLOAT: 4
};
const SIZES = {
	1: true,
	2: true,
	3: true,
	4: true
};

/**
 * The default attribute point byte offset.
 * @private
 * @constant {number}
 */
const DEFAULT_BYTE_OFFSET = 0;

/**
 * The default render mode (primitive type).
 * @private
 * @constant {string}
 */
const DEFAULT_MODE = 'TRIANGLES';

/**
 * The default index offset to render from.
 * @private
 * @constant {number}
 */
const DEFAULT_INDEX_OFFSET = 0;

/**
 * The default count of indices to render.
 * @private
 * @constant {number}
 */
const DEFAULT_COUNT = 0;

/**
 * Parse the attribute pointers and determine the byte stride of the buffer.
 *
 * @private
 *
 * @param {Map} attributePointers - The attribute pointer map.
 *
 * @returns {number} The byte stride of the buffer.
 */
function getStride(attributePointers) {
	// if there is only one attribute pointer assigned to this buffer,
	// there is no need for stride, set to default of 0
	if (attributePointers.size === 1) {
		return 0;
	}
	let maxByteOffset = 0;
	let byteSizeSum = 0;
	let byteStride = 0;
	attributePointers.forEach(pointer => {
		const byteOffset = pointer.byteOffset;
		const size = pointer.size;
		const type = pointer.type;
		// track the sum of each attribute size
		byteSizeSum += size * BYTES_PER_TYPE[type];
		// track the largest offset to determine the byte stride of the buffer
		if (byteOffset > maxByteOffset) {
			maxByteOffset = byteOffset;
			byteStride = byteOffset + (size * BYTES_PER_TYPE[type]);
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
 *
 * @private
 *
 * @param {Object} attributePointers - The attribute pointer map.
 *
 * @returns {Object} The validated attribute pointer map.
 */
function getAttributePointers(attributePointers) {
	// parse pointers to ensure they are valid
	const pointers = new Map();
	Object.keys(attributePointers).forEach(key => {
		const index = parseInt(key, 10);
		// check that key is an valid integer
		if (isNaN(index)) {
			throw `Attribute index \`${key}\` does not represent an integer`;
		}
		const pointer = attributePointers[key];
		const size = pointer.size;
		const type = pointer.type;
		const byteOffset = pointer.byteOffset;
		// check size
		if (!SIZES[size]) {
			throw 'Attribute pointer `size` parameter is invalid, must be one of ' +
				JSON.stringify(Object.keys(SIZES));
		}
		// check type
		if (!TYPES[type]) {
			throw 'Attribute pointer `type` parameter is invalid, must be one of ' +
				JSON.stringify(Object.keys(TYPES));
		}
		pointers.set(index, {
			size: size,
			type: type,
			byteOffset: (byteOffset !== undefined) ? byteOffset : DEFAULT_BYTE_OFFSET
		});
	});
	return pointers;
}

/**
 * A vertex buffer object.
 */
class VertexBuffer {

	/**
	 * Instantiates an VertexBuffer object.
	 *
	 * @param {WebGLBuffer|VertexPackage|ArrayBuffer|Array|Number} arg - The buffer or length of the buffer.
	 * @param {Object} attributePointers - The array pointer map, or in the case of a vertex package arg, the options.
	 * @param {Object} options - The rendering options.
	 * @param {string} options.mode - The draw mode / primitive type.
	 * @param {string} options.indexOffset - The index offset into the drawn buffer.
	 * @param {string} options.count - The number of indices to draw.
	 */
	constructor(arg, attributePointers = {}, options = {}) {
		this.gl = WebGLContext.get();
		this.buffer = null;
		this.mode = MODES[options.mode] ? options.mode : DEFAULT_MODE;
		this.count = (options.count !== undefined) ? options.count : DEFAULT_COUNT;
		this.indexOffset = (options.indexOffset !== undefined) ? options.indexOffset : DEFAULT_INDEX_OFFSET;
		// first, set the attribute pointers
		this.pointers = getAttributePointers(attributePointers);
		// set the byte stride
		this.byteStride = getStride(this.pointers);
		// then buffer the data
		if (arg) {
			if (arg instanceof WebGLBuffer) {
				// WebGLBuffer argument
				this.buffer = arg;
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
	 * @returns {VertexBuffer} The vertex buffer object, for chaining.
	 */
	bufferData(arg) {
		const gl = this.gl;
		// ensure argument is valid
		if (Array.isArray(arg)) {
			// cast array into Float32Array
			arg = new Float32Array(arg);
		} else if (
			!(arg instanceof ArrayBuffer) &&
			!(ArrayBuffer.isView(arg)) &&
			!(Number.isInteger(arg))
			) {
			// if not arraybuffer or a numeric size
			throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `Number`';
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
	 * @param {Array|ArrayBuffer} array - The array of data to buffer.
	 * @param {number} byteOffset - The byte offset at which to buffer.
	 *
	 * @returns {VertexBuffer} The vertex buffer object, for chaining.
	 */
	bufferSubData(array, byteOffset = DEFAULT_BYTE_OFFSET) {
		const gl = this.gl;
		// ensure the buffer exists
		if (!this.buffer) {
			throw 'Buffer has not yet been allocated, allocate with `bufferData`';
		}
		// ensure argument is valid
		if (Array.isArray(array)) {
			array = new Float32Array(array);
		} else if (
			!(array instanceof ArrayBuffer) &&
			!ArrayBuffer.isView(array)
			) {
			throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, array);
		return this;
	}

	/**
	 * Binds the vertex buffer object.
	 *
	 * @returns {VertexBuffer} - Returns the vertex buffer object for chaining.
	 */
	bind() {
		const gl = this.gl;
		// bind buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		// for each attribute pointer
		this.pointers.forEach((pointer, index) => {
			// set attribute pointer
			gl.vertexAttribPointer(
				index,
				pointer.size,
				gl[pointer.type],
				false,
				this.byteStride,
				pointer.byteOffset);
			// enable attribute index
			gl.enableVertexAttribArray(index);
		});
		return this;
	}

	/**
	 * Unbinds the vertex buffer object.
	 *
	 * @returns {VertexBuffer} The vertex buffer object, for chaining.
	 */
	unbind() {
		const gl = this.gl;
		// unbind buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.pointers.forEach((pointer, index) => {
			// disable attribute index
			gl.disableVertexAttribArray(index);
		});
		return this;
	}

	/**
	 * Execute the draw command for the bound buffer.
	 *
	 * @param {Object} options - The options to pass to 'drawArrays'. Optional.
	 * @param {string} options.mode - The draw mode / primitive type.
	 * @param {string} options.indexOffset - The index offset into the drawn buffer.
	 * @param {string} options.count - The number of indices to draw.
	 *
	 * @returns {VertexBuffer} The vertex buffer object, for chaining.
	 */
	draw(options = {}) {
		const gl = this.gl;
		const mode = gl[options.mode || this.mode];
		const indexOffset = (options.indexOffset !== undefined) ? options.indexOffset : this.indexOffset;
		const count = (options.count !== undefined) ? options.count : this.count;
		if (count === 0) {
			throw 'Attempting to draw with a count of 0';
		}
		// draw elements
		gl.drawArrays(mode, indexOffset, count);
		return this;
	}
}

module.exports = VertexBuffer;
