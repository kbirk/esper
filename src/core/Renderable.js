(function() {

    'use strict';

    const VertexPackage = require('../core/VertexPackage');
    const VertexBuffer = require('../core/VertexBuffer');
    const IndexBuffer = require('../core/IndexBuffer');

    /**
     * Iterates over all vertex buffers and throws an exception if the counts
     * are not equal.
     * @private
     *
     * @param {Array} vertexBuffers - The array of vertexBuffers.
     */
    function checkVertexBufferCounts(vertexBuffers) {
        let count = null;
        vertexBuffers.forEach(buffer => {
            if (count === null) {
                count = buffer.count;
            } else {
                if (count !== buffer.count) {
                    throw `VertexBuffers must all have the same count to be ` +
                        `rendered without an IndexBuffer, mismatch of ` +
                        `${count} and ${buffer.count} found`;
                }
            }
        });
    }

    /**
     * Iterates over all attribute pointers and throws an exception if an index
     * occurs more than once.
     * @private
     *
     * @param {Array} vertexBuffers - The array of vertexBuffers.
     */
    function checkIndexCollisions(vertexBuffers) {
        const indices = new Map();
        vertexBuffers.forEach(buffer => {
            buffer.pointers.forEach((pointer, index) => {
                const count = indices.get(index) || 0;
                indices.set(index, count + 1);
            });
        });
        indices.forEach(index => {
            if (index > 1) {
                throw `More than one attribute pointer exists for index \`${index}\``;
            }
        });
    }

    /**
     * @class Renderable
     * @classdesc A container for one or more VertexBuffers and an optional IndexBuffer.
     */
    class Renderable {

        /**
         * Instantiates an Renderable object.
         *
         * @param {Object} spec - The renderable specification object.
         * @param {Array|Float32Array} spec.vertices - The vertices to interleave and buffer.
         * @param {VertexBuffer} spec.vertexBuffer - An existing vertex buffer.
         * @param {VertexBuffer[]} spec.vertexBuffers - Multiple existing vertex buffers.
         * @param {Array|Uint16Array|Uint32Array} spec.indices - The indices to buffer.
         * @param {IndexBuffer} spec.indexbuffer - An existing index buffer.
         */
        constructor(spec = {}) {
            if (spec.vertexBuffer || spec.vertexBuffers) {
                // use existing vertex buffer
                this.vertexBuffers = spec.vertexBuffers || [spec.vertexBuffer];
            } else if (spec.vertices) {
                // create vertex package
                const vertexPackage = new VertexPackage(spec.vertices);
                // create vertex buffer
                this.vertexBuffers = [
                    new VertexBuffer(vertexPackage)
                ];
            } else {
                this.vertexBuffers = [];
            }
            if (spec.indexBuffer) {
                // use existing index buffer
                this.indexBuffer = spec.indexBuffer;
            } else if (spec.indices) {
                // create index buffer
                this.indexBuffer = new IndexBuffer(spec.indices);
            } else {
                this.indexBuffer = null;
            }
            // if there is no index buffer, check that vertex buffers all have
            // the same count
            if (!this.indexBuffer) {
                checkVertexBufferCounts(this.vertexBuffers);
            }
            // check that no attribute indices clash
            checkIndexCollisions(this.vertexBuffers);
        }

        /**
         * Execute the draw command for the underlying buffers.
         *
         * @param {Object} options - The options to pass to 'drawElements'. Optional.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
         * @param {String} options.indexOffset - The indexOffset into the drawn buffer.
         * @param {String} options.count - The number of vertices to draw.
         *
         * @return {Renderable} - The renderable object, for chaining.
         */
        draw(options = {}) {
            // draw the renderable
            if (this.indexBuffer) {
                // use index buffer to draw elements
                // bind vertex buffers and enable attribute pointers
                this.vertexBuffers.forEach(vertexBuffer => {
                    vertexBuffer.bind();
                });
                // draw primitives using index buffer
                this.indexBuffer.draw(options);
                // disable attribute pointers
                this.vertexBuffers.forEach(vertexBuffer => {
                    vertexBuffer.unbind();
                });
                // no advantage to unbinding as there is no stack used
            } else {
                // no index buffer, use draw arrays
                // set all attribute pointers
                this.vertexBuffers.forEach(vertexBuffer => {
                    vertexBuffer.bind();
                });
                if (this.vertexBuffers.length > 0) {
                    // draw the buffer
                    this.vertexBuffers[0].draw(options);
                }
                // disable all attribute pointers
                this.vertexBuffers.forEach(vertexBuffer => {
                    vertexBuffer.unbind();
                });
            }
            return this;
        }
    }

    module.exports = Renderable;

}());
