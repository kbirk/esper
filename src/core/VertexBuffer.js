(function () {

    'use strict';

    let WebGLContext = require('./WebGLContext');
    let WebGLContextState = require('./WebGLContextState');
    let VertexPackage = require('./VertexPackage');
    let MODES = {
        POINTS: true,
        LINES: true,
        LINE_STRIP: true,
        LINE_LOOP: true,
        TRIANGLES: true,
        TRIANGLE_STRIP: true,
        TRIANGLE_FAN: true
    };
    let TYPES = {
        BYTE: true,
        UNSIGNED_BYTE: true,
        SHORT: true,
        UNSIGNED_SHORT: true,
        FIXED: true,
        FLOAT: true
    };
    let BYTES_PER_TYPE = {
        BYTE: 1,
        UNSIGNED_BYTE: 1,
        SHORT: 2,
        UNSIGNED_SHORT: 2,
        FIXED: 4,
        FLOAT: 4
    };
    let SIZES = {
        1: true,
        2: true,
        3: true,
        4: true
    };

    /**
     * The default attribute point byte offset.
     */
    let DEFAULT_BYTE_OFFSET = 0;

    /**
     * The default render mode (primitive type).
     */
    let DEFAULT_MODE = 'TRIANGLES';

    /**
     * The default index offset to render from.
     */
    let DEFAULT_INDEX_OFFSET = 0;

    /**
     * The default count of indices to render.
     */
    let DEFAULT_COUNT = 0;

    /**
     * Parse the attribute pointers and determine the byte stride of the buffer.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @returns {number} - The byte stride of the buffer.
     */
    function getStride( attributePointers ) {
        // if there is only one attribute pointer assigned to this buffer,
        // there is no need for stride, set to default of 0
        let indices = Object.keys( attributePointers );
        if ( indices.length === 1 ) {
            return 0;
        }
        let maxByteOffset = 0;
        let byteSizeSum = 0;
        let byteStride = 0;
        indices.forEach( index => {
            let pointer = attributePointers[ index ];
            let byteOffset = pointer.byteOffset;
            let size = pointer.size;
            let type = pointer.type;
            // track the sum of each attribute size
            byteSizeSum += size * BYTES_PER_TYPE[ type ];
            // track the largest offset to determine the byte stride of the buffer
            if ( byteOffset > maxByteOffset ) {
                maxByteOffset = byteOffset;
                byteStride = byteOffset + ( size * BYTES_PER_TYPE[ type ] );
            }
        });
        // check if the max byte offset is greater than or equal to the the sum of
        // the sizes. If so this buffer is not interleaved and does not need a
        // stride.
        if ( maxByteOffset >= byteSizeSum ) {
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
     * @returns {Object} - The validated attribute pointer map.
     */
    function getAttributePointers( attributePointers ) {
        // parse pointers to ensure they are valid
        let pointers = {};
        Object.keys( attributePointers ).forEach( key => {
            let index = parseInt( key, 10 );
            // check that key is an valid integer
            if ( isNaN( index ) ) {
                throw 'Attribute index `' + key + '` does not represent an integer';
            }
            let pointer = attributePointers[key];
            let size = pointer.size;
            let type = pointer.type;
            let byteOffset = pointer.byteOffset;
            // check size
            if ( !SIZES[ size ] ) {
                throw 'Attribute pointer `size` parameter is invalid, must be one of ' +
                    JSON.stringify( Object.keys( SIZES ) );
            }
            // check type
            if ( !TYPES[ type ] ) {
                throw 'Attribute pointer `type` parameter is invalid, must be one of ' +
                    JSON.stringify( Object.keys( TYPES ) );
            }
            pointers[ index ] = {
                size: size,
                type: type,
                byteOffset: ( byteOffset !== undefined ) ? byteOffset : DEFAULT_BYTE_OFFSET
            };
        });
        return pointers;
    }

    class VertexBuffer {
        
        /**
         * Instantiates an VertexBuffer object.
         * @class VertexBuffer
         * @classdesc A vertex buffer object.
         *
         * @param {Array|Float32Array|VertexPackage|number} arg - The buffer or length of the buffer.
         * @param {Object} attributePointers - The array pointer map, or in the case of a vertex package arg, the options.
         * @param {Object} options - The rendering options.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.indexOffset - The index offset into the drawn buffer.
         * @param {String} options.count - The number of indices to draw.
         */
        constructor( arg, attributePointers, options = {} ) {
            this.gl = WebGLContext.get();
            this.state = WebGLContextState.get( this.gl );
            this.buffer = null;
            this.mode = MODES[ options.mode ] ? options.mode : DEFAULT_MODE;
            this.count = ( options.count !== undefined ) ? options.count : DEFAULT_COUNT;
            this.indexOffset = ( options.indexOffset !== undefined ) ? options.indexOffset : DEFAULT_INDEX_OFFSET;
            this.byteLength = 0;
            // first, set the attribute pointers
            if ( arg instanceof VertexPackage ) {
                // VertexPackage argument, use its attribute pointers
                this.pointers = arg.pointers;
                // shift options arg since there will be no attrib pointers arg
                options = attributePointers || {};
            } else {
                attributePointers = attributePointers || {};
                this.pointers = getAttributePointers( attributePointers );
            }
            // set the byte stride
            this.byteStride = getStride( this.pointers );
            // then buffer the data
            if ( arg ) {
                if ( arg instanceof VertexPackage ) {
                    // VertexPackage argument
                    this.bufferData( arg.buffer );
                } else if ( arg instanceof WebGLBuffer ) {
                    // WebGLBuffer argument
                    if ( options.byteLength === undefined ) {
                        throw 'Argument of type `WebGLBuffer` must be complimented with a corresponding `options.byteLength`';
                    }
                    this.buffer = arg;
                    this.byteLength = options.byteLength;
                } else {
                    // Array or ArrayBuffer or number argument
                    this.bufferData( arg );
                }
            }
        }

        /**
         * Upload vertex data to the GPU.
         * @memberof VertexBuffer
         *
         * @param {Array|ArrayBuffer|ArrayBufferView|number} arg - The array of data to buffer, or size of the buffer in bytes.
         *
         * @returns {VertexBuffer} - The vertex buffer object for chaining.
         */
        bufferData( arg ) {
            let gl = this.gl;
            // ensure argument is valid
            if ( Array.isArray(arg) ) {
                // cast array into Float32Array
                arg = new Float32Array( arg );
            } else if (
                !( arg instanceof ArrayBuffer ) &&
                !( ArrayBuffer.isView(arg) ) &&
                !( Number.isInteger(arg) )
                ) {
                // if not arraybuffer or a numeric size
                throw 'Argument must be of type `Array`, `ArrayBuffer`, `ArrayBufferView`, or `Number`';
            }
            // set byte length
            this.byteLength = arg.byteLength;
            // create buffer if it doesn't exist already
            if ( !this.buffer ) {
                this.buffer = gl.createBuffer();
            }
            // buffer the data
            gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
            gl.bufferData( gl.ARRAY_BUFFER, arg, gl.STATIC_DRAW );
            // rebind prev buffer
            if ( this.state.boundVertexBuffer ) {
                gl.bindBuffer( gl.ARRAY_BUFFER, this.state.boundVertexBuffer );
            }
        }

        /**
         * Upload partial vertex data to the GPU.
         * @memberof VertexBuffer
         *
         * @param {Array|ArrayBuffer|ArrayBufferView} array - The array of data to buffer.
         * @param {number} byteOffset - The byte offset at which to buffer.
         *
         * @returns {VertexBuffer} - The vertex buffer object for chaining.
         */
        bufferSubData( array, byteOffset = DEFAULT_BYTE_OFFSET ) {
            let gl = this.gl;
            // ensure the buffer exists
            if ( !this.buffer ) {
                throw 'Buffer has not yet been allocated, allocate with `bufferData`';
            }
            // ensure argument is valid
            if ( Array.isArray(array) ) {
                array = new Float32Array( array );
            } else if (
                !( array instanceof ArrayBuffer ) &&
                !ArrayBuffer.isView( array )
                ) {
                throw 'Argument must be of type `Array`, `ArrayBuffer`, or `ArrayBufferView`';
            }
            // get the total number of attribute components from pointers
            if ( byteOffset + array.byteLength > this.byteLength ) {
                throw 'Argument of length ' + array.byteLength +
                    ' bytes and offset of ' + byteOffset +
                    ' bytes overflows the buffer length of ' + this.byteLength +
                    ' bytes';
            }
            gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
            gl.bufferSubData( gl.ARRAY_BUFFER, byteOffset, array );
            // rebind prev buffer
            if ( this.state.boundVertexBuffer ) {
                gl.bindBuffer( gl.ARRAY_BUFFER, this.state.boundVertexBuffer );
            }
            return this;
        }

        /**
         * Binds the vertex buffer object.
         * @memberof VertexBuffer
         *
         * @returns {VertexBuffer} - Returns the vertex buffer object for chaining.
         */
        bind() {
            let gl = this.gl;
            let state = this.state;
            // cache this vertex buffer
            if ( state.boundVertexBuffer !== this.buffer ) {
                // bind buffer
                gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
                state.boundVertexBuffer = this.buffer;
            }
            // for each attribute pointer
            Object.keys( this.pointers ).forEach( index => {
                let pointer = this.pointers[ index ];
                // set attribute pointer
                gl.vertexAttribPointer(
                    index,
                    pointer.size,
                    gl[ pointer.type ],
                    false,
                    this.byteStride,
                    pointer.byteOffset );
                // enable attribute index
                if ( !state.enabledVertexAttributes[ index ] ) {
                    gl.enableVertexAttribArray( index );
                    state.enabledVertexAttributes[ index ] = true;
                }
            });
            return this;
        }

        /**
         * Unbinds the vertex buffer object.
         * @memberof VertexBuffer
         *
         * @returns {VertexBuffer} - Returns the vertex buffer object for chaining.
         */
        unbind() {
            let gl = this.gl;
            let state = this.state;
            // only bind if it already isn't bound
            if ( state.boundVertexBuffer !== this.buffer ) {
                // bind buffer
                gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
                state.boundVertexBuffer = this.buffer;
            }
            Object.keys( this.pointers ).forEach( index => {
                // disable attribute index
                if ( state.enabledVertexAttributes[ index ] ) {
                    gl.disableVertexAttribArray( index );
                    state.enabledVertexAttributes[ index ] = false;
                }
            });
            return this;
        }

        /**
         * Execute the draw command for the bound buffer.
         * @memberof VertexBuffer
         *
         * @param {Object} options - The options to pass to 'drawArrays'. Optional.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.indexOffset - The index offset into the drawn buffer.
         * @param {String} options.count - The number of indices to draw.
         *
         * @returns {VertexBuffer} - Returns the vertex buffer object for chaining.
         */
        draw( options = {} ) {
            if ( this.state.boundVertexBuffer !== this.buffer ) {
                throw 'Attempting to draw an unbound VertexBuffer';
            }
            let gl = this.gl;
            let mode = gl[ options.mode || this.mode ];
            let indexOffset = ( options.indexOffset !== undefined ) ? options.indexOffset : this.indexOffset;
            let count = ( options.count !== undefined ) ? options.count : this.count;
            if ( count === 0 ) {
                throw 'Attempting to draw with a count of 0';
            }
            // draw elements
            gl.drawArrays( mode, indexOffset, count );
            return this;
        }
    }

    module.exports = VertexBuffer;

}());
