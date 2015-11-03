(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        _boundBuffer = null;

    /**
     * Instantiates an IndexBuffer object.
     * @class IndexBuffer
     * @classdesc An index buffer object.
     */
    function IndexBuffer( array, options ) {
        options = options || {};
        this.gl = WebGLContext.get();
        this.id = 0;
        this.offset = ( options.offset !== undefined ) ? options.offset : 0;
        this.mode = options.mode || "TRIANGLES";
        if ( array instanceof WebGLBuffer ) {
            // if the argument is already a webglbuffer, simply wrap it
            this.id = array;
            this.type = options.type || "UNSIGNED_SHORT";
            this.count = ( options.count !== undefined ) ? options.count : 0;
        } else {
            // otherwise, buffer it
            this.bufferData( array );
        }
    }

    /**
     * Upload index data to the GPU.
     * @memberof IndexBuffer
     *
     * @param {Array|Uint16Array|Uint32Array} array - The array of data to buffer.
     *
     * @returns {IndexBuffer} The index buffer object for chaining.
     */
    IndexBuffer.prototype.bufferData = function( array ) {
        var gl = this.gl;
        // check for type support
        var uint32support = WebGLContext.checkExtension( "OES_element_index_uint" );
        if( !uint32support ) {
            // no support for uint32
            if ( array instanceof Array ) {
                // if array, buffer to uint16
                array = new Uint16Array( array );
            } else if ( array instanceof Uint32Array ) {
                // if uint32, downgrade to uint16
                console.warn( "Cannot create IndexBuffer of format " +
                    "gl.UNSIGNED_INT as OES_element_index_uint is not " +
                    "supported, defaulting to gl.UNSIGNED_SHORT" );
                array = new Uint16Array( array );
            }
        } else {
            // uint32 is supported
            if ( array instanceof Array ) {
                // if array, buffer to uint32
                array = new Uint32Array( array );
            }
        }
        // set data type based on array
        if ( array instanceof Uint16Array ) {
            this.type = "UNSIGNED_SHORT";
        } else if ( array instanceof Uint32Array ) {
            this.type = "UNSIGNED_INT";
        } else {
            console.error( "IndexBuffer requires an Array or " +
                "ArrayBuffer argument, command ignored" );
            return;
        }
        // create buffer, store count
        this.id = gl.createBuffer();
        this.count = array.length;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.id );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW );
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
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.id );
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
        var mode = gl[ options.mode ] || gl[ this.mode ] || gl.TRIANGLES;
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
