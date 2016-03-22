(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var State = require('./State');
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
        FLOAT: true
    };
    var SIZES = {
        1: true,
        2: true,
        3: true,
        4: true
    };
    var DEFAULT_MODE = 'TRIANGLES';
    var DEFAULT_OFFSET = 0;
    var DEFAULT_COUNT = 0;

    /**
     * Parse the attribute pointers and determine the stride of the buffer.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {number} - The stride of the buffer.
     */
    function getStride( attributePointers ) {
        // if there is only one attribute pointer assigned to this buffer,
        // there is no need for stride, set to default of 0
        var indices = Object.keys( attributePointers );
        if ( indices.length === 1 ) {
            return 0;
        }
        var BYTES_PER_COMPONENT = 4;
        var maxOffset = 0;
        var sizeSum = 0;
        var stride = 0;
        indices.forEach( function( index ) {
            var pointer = attributePointers[ index ];
            var offset = pointer.offset;
            var size = pointer.size;
            // track the sum of each attribute size
            sizeSum += size;
            // track the largest offset to determine the stride of the buffer
            if ( offset > maxOffset ) {
                maxOffset = offset;
                stride = offset + ( size * BYTES_PER_COMPONENT );
            }
        });
        // check if the max offset is greater than or equal to the the sum of
        // the sizes. If so this buffer is not interleaved and does not need a
        // stride.
        if ( maxOffset >= sizeSum ) {
            // TODO: test what stride === 0 does for an interleaved buffer of
            // length === 1.
            return 0;
        }
        return stride;
    }

    /**
     * Parse the attribute pointers to ensure they are valid.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {Object} - The validated attribute pointer map.
     */
    function getAttributePointers( attributePointers ) {
        // ensure there are pointers provided
        if ( !attributePointers || Object.keys( attributePointers ).length === 0 ) {
            console.warning( 'VertexBuffer requires attribute pointers to be specified upon instantiation, this buffer will not draw correctly.' );
            return {};
        }
        // parse pointers to ensure they are valid
        var pointers = {};
        Object.keys( attributePointers ).forEach( function( key ) {
            var index = parseInt( key, 10 );
            // check that key is an valid integer
            if ( isNaN( index ) ) {
                console.warn( 'Attribute index `' + key + '` does not represent an integer, discarding attribute pointer.' );
                return;
            }
            var pointer = attributePointers[key];
            var size = pointer.size;
            var type = pointer.type;
            var offset = pointer.offset;
            // check size
            if ( !SIZES[ size ] ) {
                console.warn( 'Attribute pointer `size` parameter is invalid, defaulting to 4.' );
                size = 4;
            }
            // check type
            if ( !TYPES[ type ] ) {
                console.warn( 'Attribute pointer `type` parameter is invalid, defaulting to `FLOAT`.' );
                type = 'FLOAT';
            }
            pointers[ index ] = {
                size: size,
                type: type,
                offset: ( offset !== undefined ) ? offset : 0
            };
        });
        return pointers;
    }

    /**
     * Return the number of components in the buffer.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {number} - The number of components in the buffer.
     */
    function getNumComponents( attributePointers ) {
        var size = 0;
        Object.keys( attributePointers ).forEach( function( index ) {
            size += attributePointers[ index ].size;
        });
        return size;
    }

    /**
     * Instantiates an VertexBuffer object.
     * @class VertexBuffer
     * @classdesc A vertex buffer object.
     *
     * @param {Array|Float32Array|VertexPackage|number} arg - The buffer or length of the buffer.
     * @param {Object} attributePointers - The array pointer map, or in the case of a vertex package arg, the options.
     * @param {Object} options - The rendering options.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The offset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     */
    function VertexBuffer( arg, attributePointers, options ) {
        options = options || {};
        this.buffer = 0;
        this.gl = WebGLContext.get();
        this.mode = MODES[ options.mode ] ? options : DEFAULT_MODE;
        this.count = ( options.count !== undefined ) ? options.count : DEFAULT_COUNT;
        this.offset = ( options.offset !== undefined ) ? options.offset : DEFAULT_OFFSET;
        // first, set the attribute pointers
        if ( arg instanceof VertexPackage ) {
            // VertexPackage argument, use its attribute pointers
            this.pointers = arg.pointers;
            // shift options arg since there will be no attrib pointers arg
            options = attributePointers || {};
        } else {
            this.pointers = getAttributePointers( attributePointers );
        }
        // then buffer the data
        if ( arg ) {
            if ( arg instanceof VertexPackage ) {
                // VertexPackage argument
                this.bufferData( arg.buffer );
            } else if ( arg instanceof WebGLBuffer ) {
                // WebGLBuffer argument
                this.buffer = arg;
            } else {
                // Array or ArrayBuffer or number argument
                this.bufferData( arg );
            }
        }
        // finally, set stride
        this.stride = getStride( this.pointers );
    }

    /**
     * Upload vertex data to the GPU.
     * @memberof VertexBuffer
     *
     * @param {Array|Float32Array|number} arg - The array of data to buffer, or size of the buffer.
     *
     * @returns {VertexBuffer} The vertex buffer object for chaining.
     */
    VertexBuffer.prototype.bufferData = function( arg ) {
        var gl = this.gl;
        if ( arg instanceof Array ) {
            // cast arrays into bufferview
            arg = new Float32Array( arg );
        } else if ( !ArrayBuffer.isView( arg ) && typeof arg !== 'number' ) {
            // if not arraybuffer or a numeric size
            console.error( 'VertexBuffer requires an Array, ArrayBuffer, or number argument, command ignored.' );
            return this;
        }
        if ( !this.buffer ) {
            this.buffer = gl.createBuffer();
        }
        // don't overwrite the count if it is already set
        if ( this.count === DEFAULT_COUNT ) {
            // get the total number of attribute components from pointers
            var numComponents = getNumComponents(this.pointers);
            // set count based on size of buffer and number of components
            if ( typeof arg === 'number' ) {
                this.count = arg / numComponents;
            } else {
                this.count = arg.length / numComponents;
            }
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, arg, gl.STATIC_DRAW );
    };

    /**
     * Upload partial vertex data to the GPU.
     * @memberof VertexBuffer
     *
     * @param {Array|Float32Array} array - The array of data to buffer.
     * @param {number} offset - The offset at which to buffer.
     *
     * @returns {VertexBuffer} The vertex buffer object for chaining.
     */
    VertexBuffer.prototype.bufferSubData = function( array, offset ) {
        var gl = this.gl;
        if ( !this.buffer ) {
            console.error( 'VertexBuffer has not been initially buffered, command ignored.' );
            return this;
        }
        if ( array instanceof Array ) {
            array = new Float32Array( array );
        } else if ( !ArrayBuffer.isView( array ) ) {
            console.error( 'VertexBuffer requires an Array or ArrayBuffer argument, command ignored.' );
            return this;
        }
        offset = ( offset !== undefined ) ? offset : DEFAULT_OFFSET;
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
        gl.bufferSubData( gl.ARRAY_BUFFER, offset, array );
    };

    /**
     * Binds the vertex buffer object.
     * @memberof VertexBuffer
     *
     * @returns {VertexBuffer} Returns the vertex buffer object for chaining.
     */
    VertexBuffer.prototype.bind = function() {
        var gl = this.gl;
        // cache this vertex buffer
        if ( State.boundVertexBuffer !== this.buffer ) {
            // bind buffer
            gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
            State.boundVertexBuffer = this.buffer;
        }
        var pointers = this.pointers;
        var stride = this.stride;
        Object.keys( pointers ).forEach( function( index ) {
            var pointer = pointers[ index ];
            // set attribute pointer
            gl.vertexAttribPointer(
                index,
                pointer.size,
                gl[ pointer.type ],
                false,
                stride,
                pointer.offset );
            // enable attribute index
            if ( !State.enabledVertexAttributes[ index ] ) {
                gl.enableVertexAttribArray( index );
                State.enabledVertexAttributes[ index ] = true;
            }
        });
    };

    /**
     * Unbinds the vertex buffer object.
     * @memberof VertexBuffer
     *
     * @returns {VertexBuffer} Returns the vertex buffer object for chaining.
     */
    VertexBuffer.prototype.unbind = function() {
        var gl = this.gl;
        // only bind if it already isn't bound
        if ( State.boundVertexBuffer !== this.buffer ) {
            // bind buffer
            gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
            State.boundVertexBuffer = this.buffer;
        }
        Object.keys( this.pointers ).forEach( function( index ) {
            // disable attribute index
            if ( State.enabledVertexAttributes[ index ] ) {
                gl.disableVertexAttribArray( index );
                State.enabledVertexAttributes[ index ] = false;
            }
        });
    };

    /**
     * Execute the draw command for the bound buffer.
     * @memberof VertexBuffer
     *
     * @param {Object} options - The options to pass to 'drawArrays'. Optional.
     * @param {String} options.mode - The draw mode / primitive type.
     * @param {String} options.offset - The offset into the drawn buffer.
     * @param {String} options.count - The number of vertices to draw.
     *
     * @returns {VertexBuffer} Returns the vertex buffer object for chaining.
     */
    VertexBuffer.prototype.draw = function( options ) {
        options = options || {};
        if ( State.boundVertexBuffer !== this.buffer ) {
            console.warn( 'The current VertexBuffer is not bound. Command ignored.' );
            return this;
        }
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode ];
        var offset = ( options.offset !== undefined ) ? options.offset : this.offset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        // draw elements
        gl.drawArrays( mode, offset, count );
        return this;
    };

    module.exports = VertexBuffer;

}());
