(function () {

    'use strict';

    let WebGLContext = require('./WebGLContext');

    let TYPES = {
        UNSIGNED_BYTE: true,
        UNSIGNED_SHORT: true,
        UNSIGNED_INT: true
    };
    let MODES = {
        POINTS: true,
        LINES: true,
        LINE_STRIP: true,
        LINE_LOOP: true,
        TRIANGLES: true,
        TRIANGLE_STRIP: true,
        TRIANGLE_FAN: true
    };
    let BYTES_PER_TYPE = {
        UNSIGNED_BYTE: 1,
        UNSIGNED_SHORT: 2,
        UNSIGNED_INT: 4
    };

    /**
     * The default component type.
     */
    let DEFAULT_TYPE = 'UNSIGNED_SHORT';

    /**
     * The default render mode (primitive type).
     */
    let DEFAULT_MODE = 'TRIANGLES';

    /**
     * The default byte offset to render from.
     */
    let DEFAULT_BYTE_OFFSET = 0;

    /**
     * The default count of indices to render.
     */
    let DEFAULT_COUNT = 0;

    /**
     * @class IndexBuffer
     * @classdesc An index buffer class to hole indexing information.
     */
    class IndexBuffer {

        /**
         * Instantiates an IndexBuffer object.
         *
         * @param {WebGLBuffer|Uint8Array|Uint16Array|Uin32Array|Array|Number} arg - The index data to buffer.
         * @param {Object} options - The rendering options.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.byteOffset - The byte offset into the drawn buffer.
         * @param {String} options.count - The number of vertices to draw.
         */
        constructor(arg, options = {}) {
            this.gl = WebGLContext.get();
            this.buffer = null;
            this.type = TYPES[options.type] ? options.type : DEFAULT_TYPE;
            this.mode = MODES[options.mode] ? options.mode : DEFAULT_MODE;
            this.count = (options.count !== undefined) ? options.count : DEFAULT_COUNT;
            this.byteOffset = (options.byteOffset !== undefined) ? options.byteOffset : DEFAULT_BYTE_OFFSET;
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
        bufferData(arg) {
            let gl = this.gl;
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
                } else if (
                    !(arg instanceof ArrayBuffer) &&
                    !(Number.isInteger(arg))
                    ) {
                    throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `number`';
                }
            }
            // check that the type is supported by extension
            if (this.type === 'UNSIGNED_INT' &&
                !WebGLContext.checkExtension('OES_element_index_uint')) {
                throw 'Cannot create IndexBuffer of type `UNSIGNED_INT` as extension `OES_element_index_uint` is not supported';
            }
            // don't overwrite the count if it is already set
            if (this.count === DEFAULT_COUNT) {
                if (Number.isInteger(arg)) {
                    this.count = (arg / BYTES_PER_TYPE[this.type]);
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
        bufferSubData(array, byteOffset = DEFAULT_BYTE_OFFSET) {
            let gl = this.gl;
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
            } else if (
                !(array instanceof Uint8Array) &&
                !(array instanceof Uint16Array) &&
                !(array instanceof Uint32Array) &&
                !(array instanceof ArrayBuffer)) {
                throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
            }
            // check that we aren't overflowing the buffer
            if (byteOffset + array.byteLength > this.byteLength) {
                throw `Argument of length ${array.byteLength} bytes with ` +
                    `offset of ${byteOffset} bytes overflows the buffer ` +
                    `length of ${this.byteLength} bytes`;
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
        draw(options = {}) {
            let gl = this.gl;
            let mode = gl[options.mode || this.mode];
            let type = gl[this.type];
            let byteOffset = (options.byteOffset !== undefined) ? options.byteOffset : this.byteOffset;
            let count = (options.count !== undefined) ? options.count : this.count;
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
    }

    module.exports = IndexBuffer;

}());
