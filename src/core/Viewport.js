(function() {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Stack = require('../util/Stack'),
        ASPECT_RATIO = 1.5,
        _stack = new Stack();

    function executeCallbacks( callbacks, width, height ) {
        var i;
        for ( i=0; i<callbacks.length; i++ ) {
            callbacks[i]( height, width );
        }
    }

    function getResizeCallback( viewport ) {
        return function() {
            var gl = viewport.gl,
                windowHeight = window.innerHeight,
                windowWidth = window.innerWidth;
            viewport.height = windowWidth / viewport.aspectRatio;
            if ( viewport.height <= windowHeight ) {
                viewport.width = windowWidth;
            } else {
                viewport.width = windowHeight * viewport.aspectRatio;
                viewport.height = windowHeight;
            }
            gl.canvas.height = viewport.height;
            gl.canvas.width = viewport.width;
            executeCallbacks( viewport.callbacks, viewport.height, viewport.width );
        };
    }

    function set( viewport, width, height ) {
        if ( width && height ) {
            viewport.gl.viewport( 0, 0, width, height );
        } else {
            viewport.gl.viewport( 0, 0, viewport.width, viewport.height );
        }
    }

    function Viewport( spec ) {
        spec = spec || {};
        this.gl = WebGLContext.get();
        this.aspectRatio = spec.aspectRatio || ASPECT_RATIO;
        this.callbacks = [];
        this.onResize = getResizeCallback( this );
        window.addEventListener( 'resize', this.onResize );
        this.onResize();
    }

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

    Viewport.prototype.resize = function( callback ) {
        this.callbacks.push( callback );
    };

    module.exports = Viewport;

}());
