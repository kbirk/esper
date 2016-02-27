(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext'),
        VertexPackage = require('./VertexPackage'),
        Util = require('../util/Util'),
        _boundBuffer = null,
        _enabledAttributes = null;

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

    function getAttributePointers( attributePointers ) {
        // ensure there are pointers provided
        if ( !attributePointers || Object.keys( attributePointers ).length === 0 ) {
            console.warning( 'VertexBuffer requires attribute pointers to be ' +
                'specified upon instantiation, this buffer will not draw correctly.' );
            return {};
        }
        // parse pointers to ensure they are valid
        var pointers = {};
        Object.keys( attributePointers ).forEach( function( key ) {
            var index = parseInt( key, 10 );
            // check that key is an valid integer
            if ( isNaN( index ) ) {
                console.warn('Attribute index `' + key + '` does not represent an integer, discarding attribute pointer.');
                return;
            }
            var pointer = attributePointers[key];
            var size = pointer.size;
            var type = pointer.type;
            var offset = pointer.offset;
            // check size
            if ( !size || size < 1 || size > 4 ) {
                console.warn('Attribute pointer `size` parameter is invalid, ' +
                    'defaulting to 4.');
                size = 4;
            }
            // check type
            if ( !type || type !== 'FLOAT' ) {
                console.warn('Attribute pointer `type` parameter is invalid, ' +
                    'defaulting to `FLOAT`.');
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

    function getNumComponents( pointers ) {
        var size = 0;
        Object.keys( pointers ).forEach( function( index ) {
            size += pointers[ index ].size;
        });
        return size;
    }

    function VertexBuffer( arg, attributePointers, options ) {
        options = options || {};
        this.buffer = 0;
        this.gl = WebGLContext.get();
        // first, set the attribute pointers
        if ( arg instanceof VertexPackage ) {
            // VertexPackage argument, use its attribute pointers
            this.pointers = arg.attributePointers();
            // shift options arg since there will be no attrib pointers arg
            options = attributePointers || {};
        } else {
            this.pointers = getAttributePointers( attributePointers );
        }
        // then buffer the data
        if ( arg ) {
            if ( arg instanceof VertexPackage ) {
                // VertexPackage argument
                this.bufferData( arg.buffer() );
            } else if ( arg instanceof WebGLBuffer ) {
                // WebGLBuffer argument
                this.buffer = arg;
                this.count = ( options.count !== undefined ) ? options.count : 0;
            } else {
                // Array or ArrayBuffer or number argument
                this.bufferData( arg );
            }
        }
        // set stride
        this.stride = getStride( this.pointers );
        // set draw offset and mode
        this.offset = ( options.offset !== undefined ) ? options.offset : 0;
        this.mode = ( options.mode !== undefined ) ? options.mode : 'TRIANGLES';
    }

    VertexBuffer.prototype.bufferData = function( arg ) {
        var gl = this.gl;
        if ( arg instanceof Array ) {
            // cast arrays into bufferview
            arg = new Float32Array( arg );
        } else if ( !Util.isTypedArray( arg ) && typeof arg !== 'number' ) {
            console.error( 'VertexBuffer requires an Array or ArrayBuffer, ' +
                'or a size argument, command ignored.' );
            return;
        }
        if ( !this.buffer ) {
            this.buffer = gl.createBuffer();
        }
        // get the total number of attribute components from pointers
        var numComponents = getNumComponents(this.pointers);
        // set count based on size of buffer and number of components
        if (typeof arg === 'number') {
            this.count = arg / numComponents;
        } else {
            this.count = arg.length / numComponents;
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, arg, gl.STATIC_DRAW );
    };

    VertexBuffer.prototype.bufferSubData = function( array, offset ) {
        var gl = this.gl;
        if ( !this.buffer ) {
            console.error( 'VertexBuffer has not been initially buffered, ' +
                'command ignored.' );
            return;
        }
        if ( array instanceof Array ) {
            array = new Float32Array( array );
        } else if ( !Util.isTypedArray( array ) ) {
            console.error( 'VertexBuffer requires an Array or ArrayBuffer ' +
                'argument, command ignored.' );
            return;
        }
        offset = ( offset !== undefined ) ? offset : 0;
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
        gl.bufferSubData( gl.ARRAY_BUFFER, offset, array );
    };

    VertexBuffer.prototype.bind = function() {
        // if this buffer is already bound, exit early
        if ( _boundBuffer === this ) {
            return;
        }
        var gl = this.gl;
        var pointers = this.pointers;
        var stride = this.stride;
        var previouslyEnabledAttributes = _enabledAttributes || {};
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
            delete previouslyEnabledAttributes[ index ];
        });
        // ensure leaked attribute arrays are disabled
        Object.keys( previouslyEnabledAttributes ).forEach( function( index ) {
            gl.disableVertexAttribArray( index );
        });
    };

    VertexBuffer.prototype.draw = function( options ) {
        options = options || {};
        if ( _boundBuffer === null ) {
            console.warn( 'No VertexBuffer is bound, command ignored.' );
            return;
        }
        var gl = this.gl;
        var mode = gl[ options.mode || this.mode || 'TRIANGLES' ];
        var offset = ( options.offset !== undefined ) ? options.offset : this.offset;
        var count = ( options.count !== undefined ) ? options.count : this.count;
        gl.drawArrays(
            mode, // primitive type
            offset, // offset
            count ); // count
    };

    VertexBuffer.prototype.unbind = function() {
        // if no buffer is bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = this.gl;
        var pointers = this.pointers;
        Object.keys( pointers ).forEach( function( index ) {
            gl.disableVertexAttribArray( index );
        });
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
        _boundBuffer = null;
        _enabledAttributes = {};
    };

    module.exports = VertexBuffer;

}());
