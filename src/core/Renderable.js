(function () {

    'use strict';

    var VertexPackage = require('../core/VertexPackage');
    var VertexBuffer = require('../core/VertexBuffer');
    var IndexBuffer = require('../core/IndexBuffer');

    /**
     * Instantiates an Renderable object.
     * @class Renderable
     * @classdesc A container for one or more VertexBuffers and an optional IndexBuffer.
     *
     * @param {Object} spec - The renderable specification object.
     * <pre>
     *     vertices - The vertices to interleave and buffer.
     *     vertexBuffer - An existing vertex buffer to use.
     *     vertexBuffers - Multiple vertex buffers to use.
     *     indices - The indices to buffer.
     *     indexbuffer - An existing index buffer to use.
     * </pre>
     * @param {Object} options - The rendering options.
     * <pre>
     *     mode - The draw mode / primitive type.
     *     offset - The offset into the drawn buffer.
     *     count - The number of vertices to draw.
     * </pre>
     */
    function Renderable( spec, options ) {
        spec = spec || {};
        options = options || {};
        if ( spec.vertexBuffer || spec.vertexBuffers ) {
            // use existing vertex buffer
            this.vertexBuffers = spec.vertexBuffers || [ spec.vertexBuffer ];
        } else {
            // create vertex package
            var vertexPackage = new VertexPackage( spec.vertices );
            // create vertex buffer
            this.vertexBuffers = [ new VertexBuffer( vertexPackage ) ];
        }
        if ( spec.indexBuffer ) {
            // use existing index buffer
            this.indexBuffer = spec.indexBuffer;
        } else {
            if ( spec.indices ) {
                // create index buffer
                this.indexBuffer = new IndexBuffer( spec.indices );
            }
        }
        // store rendering options
        this.options = {
            mode: options.mode,
            offset: options.offset,
            count: options.count
        };
    }

    /**
     * Execute the draw command for the bound buffer.
     * @memberof Renderable
     *
     * @param {Object} options - The options to pass to 'drawElements'. Optional.
     * <pre>
     *     mode - The draw mode / primitive type.
     *     offset - The offset into the drawn buffer.
     *     count - The number of vertices to draw.
     * </pre>
     *
     * @returns {Renderable} Returns the renderable object for chaining.
     */
    Renderable.prototype.draw = function( options ) {
        var overrides = options || {};
        // override options if provided
        overrides.mode = overrides.mode || this.options.mode;
        overrides.offset = ( overrides.offset !== undefined ) ? overrides.offset : this.options.offset;
        overrides.count = ( overrides.count !== undefined ) ? overrides.count : this.options.count;
        // draw the renderable
        if ( this.indexBuffer ) {
            // use index buffer to draw elements
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
                // no advantage to unbinding as there is no stack used
            });
            this.indexBuffer.bind();
            this.indexBuffer.draw( overrides );
            // no advantage to unbinding as there is no stack used
        } else {
            // no index buffer, use draw arrays
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
                vertexBuffer.draw( overrides );
                // no advantage to unbinding as there is no stack used
            });
        }
        return this;
    };

    module.exports = Renderable;

}());
