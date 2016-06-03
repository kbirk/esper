(function () {

    'use strict';

    var VertexPackage = require('../core/VertexPackage');
    var VertexBuffer = require('../core/VertexBuffer');
    var IndexBuffer = require('../core/IndexBuffer');

    /**
     * Iterates over all attribute pointers and throws an exception if an index
     * occurs mroe than once.
     * @private
     *
     * @param {Array} vertexBuffers - The array of vertexBuffers.
     */
    function checkIndexCollisions( vertexBuffers ) {
        var indices = {};
        vertexBuffers.forEach( function( buffer ) {
            Object.keys( buffer.pointers ).forEach( function( index ) {
                indices[ index ] = indices[ index ] || 0;
                indices[ index ]++;
            });
        });
        Object.keys( indices ).forEach( function( index ) {
            if ( indices[ index ] > 1 ) {
                throw 'More than one attribute pointer exists for index ' + index;
            }
        });
    }

    /**
     * Instantiates an Renderable object.
     * @class Renderable
     * @classdesc A container for one or more VertexBuffers and an optional IndexBuffer.
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
    function Renderable( spec ) {
        spec = spec || {};
        if ( spec.vertexBuffer || spec.vertexBuffers ) {
            // use existing vertex buffer
            this.vertexBuffers = spec.vertexBuffers || [ spec.vertexBuffer ];
        } else if ( spec.vertices ) {
            // create vertex package
            var vertexPackage = new VertexPackage( spec.vertices );
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
    Renderable.prototype.draw = function( options ) {
        var overrides = options || {};
        // override options if provided
        overrides.mode = overrides.mode || this.options.mode;
        overrides.byteOffset = ( overrides.byteOffset !== undefined ) ? overrides.byteOffset : this.options.byteOffset;
        overrides.indexOffset = ( overrides.indexOffset !== undefined ) ? overrides.indexOffset : this.options.indexOffset;
        overrides.count = ( overrides.count !== undefined ) ? overrides.count : this.options.count;
        // draw the renderable
        if ( this.indexBuffer ) {
            // use index buffer to draw elements
            // bind vertex buffers and enable attribute pointers
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
            });
            // draw primitives using index buffer
            this.indexBuffer.draw( overrides );
            // disable attribute pointers
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.unbind();
            });
            // no advantage to unbinding as there is no stack used
        } else {
            // no index buffer, use draw arrays
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
                vertexBuffer.draw( overrides );
                vertexBuffer.unbind();
            });
        }
        return this;
    };

    module.exports = Renderable;

}());
