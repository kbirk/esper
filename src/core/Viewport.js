(function() {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var WebGLContextState = require('./WebGLContextState');

    /**
     * Bind the viewport to the rendering context.
     *
     * @param {Viewport} viewport - The viewport object.
     * @param {number} width - The width override.
     * @param {number} height - The height override.
     * @param {number} x - The horizontal offset override.
     * @param {number} y - The vertical offset override.
     */
    function set( viewport, x, y, width, height ) {
        var gl = viewport.gl;
        x = ( x !== undefined ) ? x : viewport.x;
        y = ( y !== undefined ) ? y : viewport.y;
        width = ( width !== undefined ) ? width : viewport.width;
        height = ( height !== undefined ) ? height : viewport.height;
        gl.viewport( x, y, width, height );
    }

    /**
     * Instantiates an Viewport object.
     * @class Viewport
     * @classdesc A viewport object.
     *
     * @param {Object} spec - The viewport specification object.
     * @param {number} spec.width - The width of the viewport.
     * @param {number} spec.height - The height of the viewport.
     * @param {number} spec.x - The horizontal offset of the viewport.
     * @param {number} spec.y - The vertical offset of the viewport.
     */
    function Viewport( spec ) {
        spec = spec || {};
        this.gl = WebGLContext.get();
        this.state = WebGLContextState.get( this.gl );
        // set size
        this.resize(
            spec.width || this.gl.canvas.width,
            spec.height || this.gl.canvas.height );
        // set offset
        this.offset(
            spec.x !== undefined ? spec.x : 0,
            spec.y !== undefined ? spec.y : 0 );
    }

    /**
     * Updates the viewport objects width and height.
     * @memberof Viewport
     *
     * @param {number} width - The width of the viewport.
     * @param {number} height - The height of the viewport.
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.resize = function( width, height ) {
        if ( typeof width !== 'number' || ( width <= 0 ) ) {
            throw '`width` value is invalid';
        }
        if ( typeof height !== 'number' || ( height <= 0 ) ) {
            throw '`height` value is invalid';
        }
        this.width = width;
        this.height = height;
        this.gl.canvas.width = width + this.x;
        this.gl.canvas.height = height + this.y;
        return this;
    };

    /**
     * Updates the viewport objects x and y offsets.
     * @memberof Viewport
     *
     * @param {number} x - The horizontal offset of the viewport.
     * @param {number} y - The vertical offset of the viewport.
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.offset = function( x, y ) {
        if ( typeof x !== 'number' ) {
            throw '`x` value is invalid';
        }
        if (  typeof y !== 'number' ) {
            throw '`y` value is invalid';
        }
        this.x = x;
        this.y = y;
        this.gl.canvas.width = this.width + x;
        this.gl.canvas.height = this.height + y;
        return this;
    };

    /**
     * Sets the viewport object and pushes it to the front of the stack. Any provided overrides are only temporarily pushed onto the stack.
     * @memberof Viewport
     *
     * @param {number} width - The width override.
     * @param {number} height - The height override.
     * @param {number} x - The horizontal offset override.
     * @param {number} y - The vertical offset override.
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.push = function( x, y, width, height ) {
        if ( x !== undefined && typeof x !== 'number' ) {
            throw '`x` value is invalid';
        }
        if ( y !== undefined && typeof y !== 'number' ) {
            throw '`y` value is invalid';
        }
        if ( width !== undefined && ( typeof width !== 'number' || ( width <= 0 ) ) ) {
            throw '`width` value is invalid';
        }
        if ( height !== undefined && ( typeof height !== 'number' || ( height <= 0 ) ) ) {
            throw '`height` value is invalid';
        }
        this.state.viewports.push({
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
        var state = this.state;
        var top = state.viewports.top();
        if ( !top || this !== top.viewport ) {
            throw 'Viewport is not the top most element on the stack';
        }
        state.viewports.pop();
        top = state.viewports.top();
        if ( top ) {
            set( top.viewport, top.x, top.y, top.width, top.height );
        } else {
            set( this );
        }
        return this;
    };

    module.exports = Viewport;

}());
