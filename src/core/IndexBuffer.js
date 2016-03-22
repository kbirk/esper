(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var State = require('./State');
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
        this.buffer = 0;
        this.type = TYPES[ options.type ] ? options.type : DEFAULT_TYPE;
        this.mode = MODES[ options.mode ] ? options.mode : DEFAULT_MODE;
        this.count = ( options.count !== undefined ) ? options.count : DEFAULT_COUNT;
        this.offset = ( options.offset !== undefined ) ? options.offset : DEFAULT_OFFSET;
        if ( arg ) {
            if ( arg instanceof WebGLBuffer ) {
                // if the argument is already a webglbuffer, simply wrap it
                this.buffer = arg;
            } else {
                // otherwise, buffer it
                this.bufferData( arg );
            }
        }
    }

    /**
     * Upload index data to the GPU.
     * @memberof IndexBuffer
     *
     * @param {Array|Uint16Array|Uint32Array} arg - The array of data to buffer.
     *
     * @returns {IndexBuffer} The index buffer object for chaining.
     */
    IndexBuffer.prototype.bufferData = function( arg ) {
        var gl = this.gl;
        // check for type support
        var uint32support = WebGLContext.checkExtension( 'OES_element_index_uint' );
        if( !uint32support ) {
            // no support for uint32
            if ( arg instanceof Array ) {
                // if array, buffer to uint16
                arg = new Uint16Array( arg );
            } else if ( arg instanceof Uint32Array ) {
                // if uint32, downgrade to uint16
                console.warn( 'Cannot create IndexBuffer of format gl.UNSIGNED_INT as OES_element_index_uint is not supported, defaulting to gl.UNSIGNED_SHORT.' );
                arg = new Uint16Array( arg );
            }
        } else {
            // uint32 is supported
            if ( arg instanceof Array ) {
                // if array, buffer to uint32
                arg = new Uint32Array( arg );
            }
        }
        // set data type based on array
        if ( arg instanceof Uint16Array ) {
            this.type = 'UNSIGNED_SHORT';
        } else if ( arg instanceof Uint32Array ) {
            this.type = 'UNSIGNED_INT';
        } else {
            console.error( 'IndexBuffer requires an Array or ArrayBuffer argument, command ignored.' );
            return this;
        }
        // create buffer, store count
        if ( !this.buffer ) {
            this.buffer = gl.createBuffer();
        }
        // don't overwrite the count if it is already set
        if ( this.count === DEFAULT_COUNT ) {
            this.count = arg.length;
        }
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, arg, gl.STATIC_DRAW );
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
            console.warn( 'Attempting to draw an IndexBuffer with a count of 0, command ignored.' );
            return this;
        }
        if ( offset + count > this.count ) {
            console.warn( 'Attempting to draw an IndexBuffer with (offset + count) greater than the count, command ignored.' );
            return this;
        }
        // if this buffer is already bound, exit early
        if ( State.boundIndexBuffer !== this.buffer ) {
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
            State.boundIndexBuffer = this.buffer;
        }
        // draw elements
        gl.drawElements( mode, count, type, offset );
        return this;
    };

    module.exports = IndexBuffer;

}());
