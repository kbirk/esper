(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var VertexPackage = require('./VertexPackage');
    var Util = require('../util/Util');
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
    var _boundBuffer = null;
    var _enabledAttributes = {};

    /**
     * Parse the attribute pointers and determine the stride of the buffer.
     * @private
     *
     * @param {Object} attributePointers - The attribute pointer map.
     *
     * @return {number} - The stride of the buffer.
     */
    function getStride( attributePointers ) {
        var BYTES_PER_COMPONENT = 4;
        var maxOffset = 0;
        var stride = 0;
        Object.keys( attributePointers ).forEach( function( key ) {
            // track the largest offset to determine the stride of the buffer
            var pointer = attributePointers[ key ];
            var offset = pointer.offset;
            if ( offset > maxOffset ) {
                maxOffset = offset;
                stride = offset + ( pointer.size * BYTES_PER_COMPONENT );
            }
        });
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
     * @param {Object} arg - The array pointer map, or in the case of a vertex package arg, the options.
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
        } else if ( !Util.isTypedArray( arg ) && typeof arg !== 'number' ) {
            // if not arraybuffer or a numeric size
            console.error( 'VertexBuffer requires an Array or ArrayBuffer, or a size argument, command ignored.' );
            return;
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
            return;
        }
        if ( array instanceof Array ) {
            array = new Float32Array( array );
        } else if ( !Util.isTypedArray( array ) ) {
            console.error( 'VertexBuffer requires an Array or ArrayBuffer argument, command ignored.' );
            return;
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
        // if this buffer is already bound, exit early
        if ( _boundBuffer === this ) {
            return;
        }
        var gl = this.gl;
        var pointers = this.pointers;
        var stride = this.stride;
        var prevEnabledAttributes = _enabledAttributes;
        // cache this vertex buffer
        _boundBuffer = this;
        _enabledAttributes = {};
        // bind buffer
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
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
            // enabled attribute array
            gl.enableVertexAttribArray( index );
            // cache attribute
            _enabledAttributes[ index ] = true;
            // remove from previous list
            delete prevEnabledAttributes[ index ];
        });
        // ensure leaked attribute arrays are disabled
        Object.keys( prevEnabledAttributes ).forEach( function( index ) {
            gl.disableVertexAttribArray( index );
        });
    };

    /**
     * Unbinds the vertex buffer object.
     * @memberof VertexBuffer
     *
     * @returns {VertexBuffer} Returns the vertex buffer object for chaining.
     */
    VertexBuffer.prototype.unbind = function() {
        // if no buffer is bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = this.gl;
        Object.keys( this.pointers ).forEach( function( index ) {
            gl.disableVertexAttribArray( index );
        });
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
        _boundBuffer = null;
        _enabledAttributes = {};
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
        if ( _boundBuffer === null ) {
            console.warn( 'No VertexBuffer is bound, command ignored.' );
            return;
        }
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode ];
        var offset = ( options.offset !== undefined ) ? options.offset : this.offset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        gl.drawArrays( mode, offset, count );
    };

    module.exports = VertexBuffer;

}());
