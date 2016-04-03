(function () {

    'use strict';

    var Util = require('../util/Util');
    var COMPONENT_TYPE = 'FLOAT';
    var BYTES_PER_COMPONENT = 4;

    /**
     * Removes invalid attribute arguments. A valid argument must be an Array of length > 0 key by a string representing an int.
     * @private
     *
     * @param {Object} attributes - The map of vertex attributes.
     *
     * @returns {Array} The valid array of arguments.
     */
    function parseAttributeMap( attributes ) {
        var goodAttributes = [];
        Object.keys( attributes ).forEach( function( key ) {
            var index = parseFloat( key );
            // check that key is an valid integer
            if ( !Util.isInteger( index ) || index < 0 ) {
                throw 'Attribute index `' + key + '` does not represent a valid integer';
            }
            var vertices = attributes[key];
            // ensure attribute is valid
            if ( vertices &&
                vertices instanceof Array &&
                vertices.length > 0 ) {
                // add attribute data and index
                goodAttributes.push({
                    index: index,
                    data: vertices
                });
            } else {
                throw 'Error parsing attribute of index `' + key + '`';
            }
        });
        // sort attributes ascending by index
        goodAttributes.sort(function(a,b) {
            return a.index - b.index;
        });
        return goodAttributes;
    }

    /**
     * Returns a component's byte size.
     * @private
     *
     * @param {Object|Array} component - The component to measure.
     *
     * @returns {integer} The byte size of the component.
     */
    function getComponentSize( component ) {
        // check if vector
        if ( component.x !== undefined ) {
            // 1 component vector
            if ( component.y !== undefined ) {
                // 2 component vector
                if ( component.z !== undefined ) {
                    // 3 component vector
                    if ( component.w !== undefined ) {
                        // 4 component vector
                        return 4;
                    }
                    return 3;
                }
                return 2;
            }
            return 1;
        }
        // check if array
        if ( component instanceof Array ) {
            return component.length;
        }
        // default to 1 otherwise
        return 1;
    }

    /**
     * Calculates the type, size, and offset for each attribute in the attribute array along with the length and stride of the package.
     * @private
     *
     * @param {VertexPackage} vertexPackage - The VertexPackage object.
     * @param {Array} attributes - The array of vertex attributes.
     */
    function setPointersAndStride( vertexPackage, attributes ) {
        var shortestArray = Number.MAX_VALUE;
        var offset = 0;
        // clear pointers
        vertexPackage.pointers = {};
        // for each attribute
        attributes.forEach( function( vertices ) {
            // set size to number of components in the attribute
            var size = getComponentSize( vertices.data[0] );
            // length of the package will be the shortest attribute array length
            shortestArray = Math.min( shortestArray, vertices.data.length );
            // store pointer under index
            vertexPackage.pointers[ vertices.index ] = {
                type : COMPONENT_TYPE,
                size : size,
                offset : offset * BYTES_PER_COMPONENT
            };
            // accumulate attribute offset
            offset += size;
        });
        // set stride to total offset
        vertexPackage.stride = offset * BYTES_PER_COMPONENT;
        // set length of package to the shortest attribute array length
        vertexPackage.length = shortestArray;
    }

    /**
     * Fill the arraybuffer with a single component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set1ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            if ( vertex.x !== undefined ) {
                buffer[j] = vertex.x;
            } else if ( vertex[0] !== undefined ) {
                buffer[j] = vertex[0];
            } else {
                buffer[j] = vertex;
            }
        }
    }

    /**
     * Fill the arraybuffer with a double component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set2ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            buffer[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
            buffer[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
        }
    }

    /**
     * Fill the arraybuffer with a triple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set3ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            buffer[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
            buffer[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
            buffer[j+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
        }
    }

    /**
     * Fill the arraybuffer with a quadruple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {number} length - The length of the buffer to copy from.
     * @param {number} offset - The offset to the attribute.
     * @param {number} stride - The of stride of the buffer.
     */
    function set4ComponentAttr( buffer, vertices, length, offset, stride ) {
        var vertex, i, j;
        for ( i=0; i<length; i++ ) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + ( stride * i );
            buffer[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
            buffer[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
            buffer[j+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
            buffer[j+3] = ( vertex.w !== undefined ) ? vertex.w : vertex[3];
        }
    }

    /**
     * Instantiates an VertexPackage object.
     * @class VertexPackage
     * @classdesc A vertex package object.
     *
     * @param {Object} attributes - The attributes to interleave keyed by index.
     */
    function VertexPackage( attributes ) {
        if ( attributes !== undefined ) {
            this.set( attributes );
        } else {
            this.buffer = new Float32Array(0);
            this.pointers = {};
        }
    }

    /**
     * Set the data to be interleaved inside the package. This clears any previously existing data.
     * @memberof VertexPackage
     *
     * @param {Object} attributes - The attributes to interleaved, keyed by index.
     *
     * @returns {VertexPackage} - The vertex package object, for chaining.
     */
    VertexPackage.prototype.set = function( attributes ) {
        // remove bad attributes
        attributes = parseAttributeMap( attributes );
        // set attribute pointers and stride
        setPointersAndStride( this, attributes );
        // set size of data vector
        var length = this.length;
        var stride = this.stride / BYTES_PER_COMPONENT;
        var pointers = this.pointers;
        var buffer = this.buffer = new Float32Array( length * stride );
        // for each vertex attribute array
        attributes.forEach( function( vertices ) {
            // get the pointer
            var pointer = pointers[ vertices.index ];
            // get the pointers offset
            var offset = pointer.offset / BYTES_PER_COMPONENT;
            // copy vertex data into arraybuffer
            switch ( pointer.size ) {
                case 2:
                    set2ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
                case 3:
                    set3ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
                case 4:
                    set4ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
                default:
                    set1ComponentAttr( buffer, vertices.data, length, offset, stride );
                    break;
            }
        });
        return this;
    };

    module.exports = VertexPackage;

}());
