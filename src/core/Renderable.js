(function () {

    'use strict';

    let VertexPackage = require('../core/VertexPackage');
    let VertexBuffer = require('../core/VertexBuffer');
    let IndexBuffer = require('../core/IndexBuffer');

    /**
     * Iterates over all attribute pointers and throws an exception if an index
     * occurs more than once.
     * @private
     *
     * @param {Array} vertexBuffers - The array of vertexBuffers.
     */
    function checkIndexCollisions( vertexBuffers ) {
        let indices = {};
        vertexBuffers.forEach( buffer => {
            Object.keys( buffer.pointers ).forEach( index => {
                indices[ index ] = indices[ index ] || 0;
                indices[ index ]++;
            });
        });
        Object.keys( indices ).forEach( index => {
            if ( indices[ index ] > 1 ) {
                throw 'More than one attribute pointer exists for index ' + index;
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
         * @memberof Renderable
         *
         * @param {Object} spec - The renderable specification object.
         * @param {Array|Float32Array} spec.vertices - The vertices to interleave and buffer.
         * @param {VertexBuffer} spec.vertexBuffer - An existing vertex buffer to use.
         * @param {VertexBuffer[]} spec.vertexBuffers - Multiple vertex buffers to use.
         * @param {Array|Uint16Array|Uint32Array} spec.indices - The indices to buffer.
         * @param {IndexBuffer} spec.indexbuffer - An existing index buffer to use.
         * @param {String} spec.mode - The draw mode / primitive type.
         * @param {String} spec.byteOffset - The byte offset into the drawn index buffer.
         * @param {String} spec.indexOffset - The byte offset into the drawn vertex buffer.
         * @param {String} spec.count - The number of vertices to draw.
         */
        constructor( spec = {} ) {
            if ( spec.vertexBuffer || spec.vertexBuffers ) {
                // use existing vertex buffer
                this.vertexBuffers = spec.vertexBuffers || [ spec.vertexBuffer ];
            } else if ( spec.vertices ) {
                // create vertex package
                let vertexPackage = new VertexPackage( spec.vertices );
                // create vertex buffer
                this.vertexBuffers = [ new VertexBuffer( vertexPackage ) ];
            } else {
                this.vertexBuffers = [];
            }
            if ( spec.indexBuffer ) {
                // use existing index buffer
                this.indexBuffer = spec.indexBuffer;
            } else if ( spec.indices ) {
                // create index buffer
                this.indexBuffer = new IndexBuffer( spec.indices );
            } else {
                this.indexBuffer = null;
            }
            // check that no attribute indices clash
            checkIndexCollisions( this.vertexBuffers );
            // store rendering options
            this.options = {
                mode: spec.mode,
                byteOffset: spec.byteOffset,
                indexOffset: spec.indexOffset,
                count: spec.count
            };
        }

        /**
         * Execute the draw command for the underlying buffers.
         * @memberof Renderable
         *
         * @param {Object} options - The options to pass to 'drawElements'. Optional.
         * @param {String} options.mode - The draw mode / primitive type.
         * @param {String} options.byteOffset - The byteOffset into the drawn buffer.
         * @param {String} options.indexOffset - The indexOffset into the drawn buffer.
         * @param {String} options.count - The number of vertices to draw.
         *
         * @returns {Renderable} Returns the renderable object for chaining.
         */
        draw( options = {} ) {
            // override options if provided
            options.mode = options.mode || this.options.mode;
            options.byteOffset = ( options.byteOffset !== undefined ) ? options.byteOffset : this.options.byteOffset;
            options.indexOffset = ( options.indexOffset !== undefined ) ? options.indexOffset : this.options.indexOffset;
            options.count = ( options.count !== undefined ) ? options.count : this.options.count;
            // draw the renderable
            if ( this.indexBuffer ) {
                // use index buffer to draw elements
                // bind vertex buffers and enable attribute pointers
                this.vertexBuffers.forEach( vertexBuffer => {
                    vertexBuffer.bind();
                });
                // draw primitives using index buffer
                this.indexBuffer.draw( options );
                // disable attribute pointers
                this.vertexBuffers.forEach( vertexBuffer => {
                    vertexBuffer.unbind();
                });
                // no advantage to unbinding as there is no stack used
            } else {
                // no index buffer, use draw arrays
                this.vertexBuffers.forEach( vertexBuffer => {
                    vertexBuffer.bind();
                    vertexBuffer.draw( options );
                    vertexBuffer.unbind();
                });
            }
            return this;
        }
    }

    module.exports = Renderable;

}());
