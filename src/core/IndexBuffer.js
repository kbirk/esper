(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        _boundBuffer = null;

    /**
     * Instantiates an IndexBuffer object.
     * @class IndexBuffer
     * @classdesc An index buffer object.
     */
    function IndexBuffer( arg, options ) {
        options = options || {};
        this.gl = WebGLContext.get();
        this.buffer = 0;
        if ( arg ) {
            if ( arg instanceof WebGLBuffer ) {
                // if the argument is already a webglbuffer, simply wrap it
                this.buffer = arg;
                this.type = options.type || "UNSIGNED_SHORT";
                this.count = ( options.count !== undefined ) ? options.count : 0;
            } else {
                // otherwise, buffer it
                this.bufferData( arg );
            }
        }
        this.offset = ( options.offset !== undefined ) ? options.offset : 0;
        this.mode = ( options.mode !== undefined ) ? options.mode : "TRIANGLES";
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
        var uint32support = WebGLContext.checkExtension( "OES_element_index_uint" );
        if( !uint32support ) {
            // no support for uint32
            if ( arg instanceof Array ) {
                // if array, buffer to uint16
                arg = new Uint16Array( arg );
            } else if ( arg instanceof Uint32Array ) {
                // if uint32, downgrade to uint16
                console.warn( "Cannot create IndexBuffer of format " +
                    "gl.UNSIGNED_INT as OES_element_index_uint is not " +
                    "supported, defaulting to gl.UNSIGNED_SHORT." );
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
            this.type = "UNSIGNED_SHORT";
        } else if ( arg instanceof Uint32Array ) {
            this.type = "UNSIGNED_INT";
        } else {
            console.error( "IndexBuffer requires an Array or " +
                "ArrayBuffer argument, command ignored." );
            return;
        }
        // create buffer, store count
        if ( !this.buffer ) {
            this.buffer = gl.createBuffer();
        }
        this.count = arg.length;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, arg, gl.STATIC_DRAW );
        return this;
    };

    /**
     * Binds the index buffer object.
     * @memberof IndexBuffer
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.bind = function() {
        // if this buffer is already bound, exit early
        if ( _boundBuffer === this ) {
            return;
        }
        var gl = this.gl;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.buffer );
        _boundBuffer = this;
        return this;
    };

    /**
     * Unbinds the index buffer object.
     * @memberof IndexBuffer
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.unbind = function() {
        // if there is no buffer bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = this.gl;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
        _boundBuffer = null;
        return this;
    };

    /**
     * Execute the draw command for the bound buffer.
     * @memberof IndexBuffer
     *
     * @param {Object} options - The options to pass to 'drawElements'. Optional.
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.draw = function( options ) {
        options = options || {};
        if ( _boundBuffer === null ) {
            console.warn( "No IndexBuffer is bound, command ignored." );
            return;
        }
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode || 'TRIANGLES' ];
        var offset = ( options.offset !== undefined ) ? options.offset : this.offset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        gl.drawElements(
            mode,
            count,
            gl[ this.type ],
            offset );
        return this;
    };

    module.exports = IndexBuffer;

}());
