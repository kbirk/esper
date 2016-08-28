(function () {

    'use strict';

    let COMPONENT_TYPE = 'FLOAT';
    let BYTES_PER_COMPONENT = 4;

    /**
     * Removes invalid attribute arguments. A valid argument must be an Array of length > 0 key by a string representing an int.
     * @private
     *
     * @param {Object} attributes - The map of vertex attributes.
     *
     * @return {Array} The valid array of arguments.
     */
    function parseAttributeMap(attributes) {
        let goodAttributes = [];
        Object.keys(attributes).forEach(key => {
            let index = parseFloat(key);
            // check that key is an valid integer
            if (!Number.isInteger(index) || index < 0) {
                throw `Attribute index \`${key}\` does not represent a valid integer`;
            }
            let vertices = attributes[key];
            // ensure attribute is valid
            if (Array.isArray(vertices) && vertices.length > 0) {
                // add attribute data and index
                goodAttributes.push({
                    index: index,
                    data: vertices
                });
            } else {
                throw `Error parsing attribute of index \`${index}\``;
            }
        });
        // sort attributes ascending by index
        goodAttributes.sort((a, b) => {
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
     * @return {Number} The byte size of the component.
     */
    function getComponentSize(component) {
        // check if array
        if (Array.isArray(component)) {
            return component.length;
        }
        // check if vector
        if (component.x !== undefined) {
            // 1 component vector
            if (component.y !== undefined) {
                // 2 component vector
                if (component.z !== undefined) {
                    // 3 component vector
                    if (component.w !== undefined) {
                        // 4 component vector
                        return 4;
                    }
                    return 3;
                }
                return 2;
            }
            return 1;
        }
        // single component
        return 1;
    }

    /**
     * Calculates the type, size, and offset for each attribute in the attribute array along with the length and stride of the package.
     * @private
     *
     * @param {VertexPackage} vertexPackage - The VertexPackage object.
     * @param {Array} attributes The array of vertex attributes.
     */
    function setPointersAndStride(vertexPackage, attributes) {
        let shortestArray = Number.MAX_VALUE;
        let offset = 0;
        // clear pointers
        vertexPackage.pointers = {};
        // for each attribute
        attributes.forEach(vertices => {
            // set size to number of components in the attribute
            let size = getComponentSize(vertices.data[0]);
            // length of the package will be the shortest attribute array length
            shortestArray = Math.min(shortestArray, vertices.data.length);
            // store pointer under index
            vertexPackage.pointers[vertices.index] = {
                type: COMPONENT_TYPE,
                size: size,
                byteOffset: offset * BYTES_PER_COMPONENT
            };
            // accumulate attribute offset
            offset += size;
        });
        // set stride to total offset
        vertexPackage.stride = offset; // not in bytes
        // set length of package to the shortest attribute array length
        vertexPackage.length = shortestArray;
    }

    /**
     * Fill the arraybuffer with a single component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set1ComponentAttr(buffer, vertices, length, offset, stride) {
        let vertex, i, j;
        for (i=0; i<length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + (stride * i);
            if (vertex.x !== undefined) {
                buffer[j] = vertex.x;
            } else if (vertex[0] !== undefined) {
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
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set2ComponentAttr(buffer, vertices, length, offset, stride) {
        let vertex, i, j;
        for (i=0; i<length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + (stride * i);
            buffer[j] = (vertex.x !== undefined) ? vertex.x : vertex[0];
            buffer[j+1] = (vertex.y !== undefined) ? vertex.y : vertex[1];
        }
    }

    /**
     * Fill the arraybuffer with a triple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set3ComponentAttr(buffer, vertices, length, offset, stride) {
        let vertex, i, j;
        for (i=0; i<length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + (stride * i);
            buffer[j] = (vertex.x !== undefined) ? vertex.x : vertex[0];
            buffer[j+1] = (vertex.y !== undefined) ? vertex.y : vertex[1];
            buffer[j+2] = (vertex.z !== undefined) ? vertex.z : vertex[2];
        }
    }

    /**
     * Fill the arraybuffer with a quadruple component attribute.
     * @private
     *
     * @param {Float32Array} buffer - The arraybuffer to fill.
     * @param {Array} vertices - The vertex attribute array to copy from.
     * @param {Number} length - The length of the buffer to copy from.
     * @param {Number} offset - The offset to the attribute, not in bytes.
     * @param {Number} stride - The stride of the buffer, not in bytes.
     */
    function set4ComponentAttr(buffer, vertices, length, offset, stride) {
        let vertex, i, j;
        for (i=0; i<length; i++) {
            vertex = vertices[i];
            // get the index in the buffer to the particular vertex
            j = offset + (stride * i);
            buffer[j] = (vertex.x !== undefined) ? vertex.x : vertex[0];
            buffer[j+1] = (vertex.y !== undefined) ? vertex.y : vertex[1];
            buffer[j+2] = (vertex.z !== undefined) ? vertex.z : vertex[2];
            buffer[j+3] = (vertex.w !== undefined) ? vertex.w : vertex[3];
        }
    }

    /**
     * @class VertexPackage
     * @classdesc A vertex package to assist in interleaving vertex data and building the associated vertex attribute pointers.
     */
    class VertexPackage {

        /**
         * Instantiates a VertexPackage object.
          *
         * @param {Object} attributes - The attributes to interleave keyed by index.
         */
        constructor(attributes) {
            if (attributes !== undefined) {
                this.set(attributes);
            } else {
                this.buffer = new Float32Array(0);
                this.pointers = {};
            }
        }

        /**
         * Set the data to be interleaved inside the package. This clears any previously existing data.
         *
         * @param {Object} attributes - The attributes to interleaved, keyed by index.
         *
         * @return {VertexPackage} The vertex package object, for chaining.
         */
        set(attributes) {
            // remove bad attributes
            attributes = parseAttributeMap(attributes);
            // set attribute pointers and stride
            setPointersAndStride(this, attributes);
            // set size of data vector
            let length = this.length;
            let stride = this.stride; // not in bytes
            let pointers = this.pointers;
            let buffer = this.buffer = new Float32Array(length * stride);
            // for each vertex attribute array
            attributes.forEach(vertices => {
                // get the pointer
                let pointer = pointers[vertices.index];
                // get the pointers offset
                let offset = pointer.byteOffset / BYTES_PER_COMPONENT;
                // copy vertex data into arraybuffer
                switch (pointer.size) {
                    case 2:
                        set2ComponentAttr(buffer, vertices.data, length, offset, stride);
                        break;
                    case 3:
                        set3ComponentAttr(buffer, vertices.data, length, offset, stride);
                        break;
                    case 4:
                        set4ComponentAttr(buffer, vertices.data, length, offset, stride);
                        break;
                    default:
                        set1ComponentAttr(buffer, vertices.data, length, offset, stride);
                        break;
                }
            });
            return this;
        }
    }

    module.exports = VertexPackage;

}());
