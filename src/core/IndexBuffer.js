(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');
    var TYPES = {
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
     * The default index offset to render from.
     */
    var DEFAULT_OFFSET = 0;

    /**
     * The default count of indices to render.
     */
    var DEFAULT_COUNT = 0;

    /**
     * Instantiates an IndexBuffer object.
     * @class IndexBuffer
     * @classdesc An index buffer object.
     *
     * @param {Uint16Array|Uin32Array|Array} arg - The index data to buffer.
     * @param {Object} options - The rendering options.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The offset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     */
    function IndexBuffer( arg, options ) {
        options = options || {};
        this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( this.gl );
        this.buffer = 0;
        this.type = TYPES[ options.type ] ? options.type : DEFAULT_TYPE;
        // check if type is supported
        if ( this.type === 'UNSIGNED_INT' && !WebGLContext.checkExtension( 'OES_element_index_uint' ) ) {
            throw 'Cannot create IndexBuffer of type gl.UNSIGNED_INT as extension `OES_element_index_uint` is not supported';
        }
        this.mode = MODES[ options.mode ] ? options.mode : DEFAULT_MODE;
        this.count = ( options.count !== undefined ) ? options.count : DEFAULT_COUNT;
        this.offset = ( options.offset !== undefined ) ? options.offset : DEFAULT_OFFSET;
        this.byteLength = 0;
        if ( arg ) {
            if ( arg instanceof WebGLBuffer ) {
                // WebGLBuffer argument
                if ( options.byteLength === undefined ) {
                    throw 'Argument of type `WebGLBuffer` must be complimented with a corresponding `options.byteLength`';
                }
                this.byteLength = options.byteLength;
                this.buffer = arg;
            } else if ( typeof arg === 'number' ) {
                // byte length argument
                if ( options.type === undefined ) {
                    throw 'Argument of type `number` must be complimented with a corresponding `options.type`';
                }
                this.bufferData( arg );
            } else if ( arg instanceof ArrayBuffer ) {
                // ArrayBuffer arg
                if ( options.type === undefined ) {
                    throw 'Argument of type `ArrayBuffer` must be complimented with a corresponding `options.type`';
                }
                this.bufferData( arg );
            } else {
                // Array or ArrayBufferView argument
                this.bufferData( arg );
            }
        } else {
            if ( options.type === undefined ) {
                throw 'Empty buffer must be complimented with a corresponding `options.type`';
            }
        }
        // ensure there isn't an overflow
        var bufferCount = ( this.byteLength / BYTES_PER_TYPE[ this.type ] );
        if ( this.count + this.offset > bufferCount ) {
            throw 'IndexBuffer `count` of ' + this.count + ' and `offset` of ' + this.offset + ' overflows the total count of the buffer ' + bufferCount;
        }
    }

    /**
     * Upload index data to the GPU.
     * @memberof IndexBuffer
     *
     * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer.
     *
     * @returns {IndexBuffer} The index buffer object for chaining.
     */
    IndexBuffer.prototype.bufferData = function( arg ) {
        var gl = this.gl;
        // cast array to ArrayBufferView based on provided type
        if ( arg instanceof Array ) {
            // check for type support
            if ( this.type === 'UNSIGNED_INT' ) {
                // uint32 is supported
                arg = new Uint32Array( arg );
            } else {
                // buffer to uint16
                arg = new Uint16Array( arg );
            }
        }
        // set ensure type corresponds to data
        if ( arg instanceof Uint16Array ) {
            this.type = 'UNSIGNED_SHORT';
        } else if ( arg instanceof Uint32Array ) {
            this.type = 'UNSIGNED_INT';
        } else if ( !( arg instanceof ArrayBuffer ) && typeof arg !== 'number' ) {
            throw '`bufferData` requires an Array, ArrayBuffer, ArrayBufferView or numberic argument';
        }
        // don't overwrite the count if it is already set
        if ( this.count === DEFAULT_COUNT ) {
            if ( typeof arg === 'number' ) {
                this.count = ( arg / BYTES_PER_TYPE[ this.type ] );
            } else {
                this.count = arg.length;
            }
        }
        // set byte length
        if ( typeof arg === 'number' ) {
            if ( arg % BYTES_PER_TYPE[ this.type ] ) {
                throw 'Byte length must be multiple of ' + BYTES_PER_TYPE[ this.type ];
            }
            this.byteLength = arg;
        } else {
            this.byteLength = arg.length * BYTES_PER_TYPE[ this.type ];
        }
        // create buffer
        if ( !this.buffer ) {
            this.buffer = gl.createBuffer();
        }
        // buffer the data
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, arg, gl.STATIC_DRAW );
        return this;
    };

    /**
     * Upload partial index data to the GPU.
     * @memberof IndexBuffer
     *
     * @param {Array|ArrayBuffer|ArrayBufferView} array - The array of data to buffer.
     * @param {number} byteOffset - The byte offset at which to buffer.
     *
     * @returns {IndexBuffer} The vertex buffer object for chaining.
     */
    IndexBuffer.prototype.bufferSubData = function( array, byteOffset ) {
        var gl = this.gl;
        if ( !this.buffer ) {
            throw '`bufferSubData` has not been allocated, use `bufferData`';
        }
        // cast array to ArrayBufferView based on provided type
        if ( array instanceof Array ) {
            // check for type support
            if ( this.type === 'UNSIGNED_INT' ) {
                // uint32 is supported
                array = new Uint32Array( array );
            } else {
                // buffer to uint16
                array = new Uint16Array( array );
            }
        } else if (
            !( array instanceof Uint16Array ) &&
            !( array instanceof Uint32Array ) &&
            !( array instanceof ArrayBuffer ) ) {
            throw '`bufferSubData` requires an Array, ArrayBuffer, or ArrayBufferView argument';
        }
        byteOffset = ( byteOffset !== undefined ) ? byteOffset : DEFAULT_OFFSET;
        // get the total number of attribute components from pointers
        var byteLength = array.length * BYTES_PER_TYPE[ this.type ];
        if ( byteOffset + byteLength > this.byteLength ) {
            throw 'Argument of length ' + byteLength + ' bytes and offset of ' + byteOffset + ' bytes overflows the buffer length of ' + this.byteLength + ' bytes';
        }
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
        gl.bufferSubData( gl.ELEMENT_ARRAY_BUFFER, byteOffset, array );
        return this;
    };

    /**
     * Execute the draw command for the bound buffer.
     * @memberof IndexBuffer
     *
     * @param {Object} options - The options to pass to 'drawElements'. Optional.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The offset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.draw = function( options ) {
        options = options || {};
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode ];
        var type = gl[ this.type ];
        var offset = ( options.offset !== undefined ) ? options.offset : this.offset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        if ( count === 0 ) {
            throw 'Attempting to draw with a count of 0';
        }
        var bufferCount = this.byteLength / BYTES_PER_TYPE[ this.type ];
        if ( offset + count > this.count ) {
            throw 'Attempting to draw with `count` of ' + count + ' and `offset` of ' + offset + ' overflows the total count of the buffer ' + bufferCount;
        }
        // if this buffer is already bound, exit early
        if ( this.state.boundIndexBuffer !== this.buffer ) {
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
            this.state.boundIndexBuffer = this.buffer;
        }
        // draw elements
        gl.drawElements( mode, count, type, offset );
        return this;
    };

    module.exports = IndexBuffer;

}());
