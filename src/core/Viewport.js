(function() {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Stack = require('../util/Stack'),
        _stack = new Stack();

    function set( viewport, width, height ) {
        var gl = viewport.gl;
        if ( width && height ) {
            gl.viewport( 0, 0, width, height );
        } else {
            gl.viewport( 0, 0, viewport.width, viewport.height );
        }
    }

    function Viewport( spec ) {
        spec = spec || {};
        this.width = spec.width || window.innerWidth;
        this.height = spec.height || window.innerHeight;
        this.gl = WebGLContext.get();
    }

    /**
     * Updates the viewport objects width and height.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.resize = function( width, height ) {
        if ( width && height ) {
            this.width = width;
            this.height = height;
            this.gl.canvas.height = height;
            this.gl.canvas.width = width;
        }
        return this;
    };

    /**
     * Sets the viewport object and pushes it to the front of the stack.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
     Viewport.prototype.push = function( width, height ) {
        _stack.push({
            viewport: this,
            width: width,
            height: height
        });
        set( this, width, height );
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
            set( top.viewport, top.width, top.height );
        } else {
            set( this );
        }
        return this;
    };

    module.exports = Viewport;

}());
