(function () {

    'use strict';

    var COMPONENT_TYPE = 'FLOAT';
    var BYTES_PER_COMPONENT = 4;

    /**
     * Removes invalid attribute arguments. A valid argument
     * must be an Array of length > 0 key by a string representing an int.
     *
     * @param {Object} attributes - The map of vertex attributes.
     *
     * @returns {Array} The valid array of arguments.
     */
    function parseAttributeMap( attributes ) {
        var goodAttributes = [];
        Object.keys( attributes ).forEach( function( key ) {
            var index = parseInt( key, 10 );
            // check that key is an valid integer
            if ( isNaN( index ) ) {
                console.warn('Attribute index `' + key + '` does not ' +
                    'represent an integer, discarding attribute pointer.');
                return;
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
                console.warn( 'Error parsing attribute of index `' + key +
                    '`, attribute discarded.' );
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
        return 1;
    }

    /**
     * Calculates the type, size, and offset for each attribute in the
     * attribute array along with the length and stride of the package.
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

    function VertexPackage( attributes ) {
        if ( attributes !== undefined ) {
            return this.set( attributes );
        } else {
            this.data = new Float32Array(0);
            this.pointers = {};
        }
    }

    VertexPackage.prototype.set = function( attributeMap ) {
        var that = this;
        // remove bad attributes
        var attributes = parseAttributeMap( attributeMap );
        // set attribute pointers and stride
        setPointersAndStride( this, attributes );
        // set size of data vector
        this.data = new Float32Array( this.length * ( this.stride / BYTES_PER_COMPONENT ) );
        // for each vertex attribute array
        attributes.forEach( function( vertices ) {
            // get the pointer
            var pointer = that.pointers[ vertices.index ];
            // get the pointers offset
            var offset = pointer.offset / BYTES_PER_COMPONENT;
            // get the package stride
            var stride = that.stride / BYTES_PER_COMPONENT;
            // for each vertex
            var vertex, i, j;
            for ( i=0; i<that.length; i++ ) {
                vertex = vertices.data[i];
                // get the index in the buffer to the particular vertex
                j = offset + ( stride * i );
                switch ( pointer.size ) {
                    case 2:
                        that.data[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
                        that.data[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
                        break;
                    case 3:
                        that.data[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
                        that.data[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
                        that.data[j+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
                        break;
                    case 4:
                        that.data[j] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
                        that.data[j+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
                        that.data[j+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
                        that.data[j+3] = ( vertex.w !== undefined ) ? vertex.w : vertex[3];
                        break;
                    default:
                        if ( vertex.x !== undefined ) {
                            that.data[j] = vertex.x;
                        } else if ( vertex[0] !== undefined ) {
                            that.data[j] = vertex[0];
                        } else {
                            that.data[j] = vertex;
                        }
                        break;
                }
            }
        });
        return this;
    };

    VertexPackage.prototype.buffer = function() {
        return this.data;
    };

    VertexPackage.prototype.attributePointers = function() {
        return this.pointers;
    };

    module.exports = VertexPackage;

}());
