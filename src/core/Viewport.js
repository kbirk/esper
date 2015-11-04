(function() {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Stack = require('../util/Stack'),
        _stack = new Stack();

    function set( viewport, x, y, width, height ) {
        var gl = viewport.gl;
        x = ( x !== undefined ) ? x : viewport.x;
        y = ( y !== undefined ) ? y : viewport.y;
        width = ( width !== undefined ) ? width : viewport.width;
        height = ( height !== undefined ) ? height : viewport.height;
        gl.viewport( x, y, width, height );
    }

    function Viewport( spec ) {
        spec = spec || {};
        this.gl = WebGLContext.get();
        // set size
        this.resize(
            spec.width || this.gl.canvas.height,
            spec.height || this.gl.canvas.width );
        // set offset
        this.offset(
            spec.x,
            spec.y );
    }

    /**
     * Updates the viewport objects width and height.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.resize = function( width, height ) {
        if ( width !== undefined && height !== undefined ) {
            this.width = width;
            this.height = height;
            this.gl.canvas.height = height;
            this.gl.canvas.width = width;
        }
        return this;
    };

    /**
     * Updates the viewport objects x and y offsets.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.offset = function( x, y ) {
        if ( x !== undefined && y !== undefined ) {
            this.x = x;
            this.y = y;
        }
        return this;
    };

    /**
     * Sets the viewport object and pushes it to the front of the stack.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
     Viewport.prototype.push = function( x, y, width, height ) {
        _stack.push({
            viewport: this,
            x: x,
            y: y,
            width: width,
            height: height
        });
        set( this, x, y, width, height );
        return this;
    };

    /**
     * Pops current the viewport object and sets the viewport beneath it.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
     Viewport.prototype.pop = function() {
        var top;
        _stack.pop();
        top = _stack.top();
        if ( top ) {
            set( top.viewport, top.x, top.y, top.width, top.height );
        } else {
            set( this );
        }
        return this;
    };

    module.exports = Viewport;

}());
