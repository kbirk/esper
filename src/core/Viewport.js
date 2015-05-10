(function() {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        ASPECT_RATIO = 1.5;

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

    function Viewport( spec ) {
        spec = spec || {};
        this.gl = WebGLContext.get();
        this.aspectRatio = spec.aspectRatio || ASPECT_RATIO;
        this.callbacks = [];
        this.onResize = getResizeCallback( this );
        window.addEventListener( 'resize', this.onResize );
        this.onResize();
    }

    Viewport.prototype.set = function( x, y, width, height ) {
        if ( x !== undefined &&
            y !== undefined &&
            width === undefined &&
            height === undefined ) {
            width = x;
            x = 0;
            height = y;
            y = x;
        }
        if ( width && height ) {
            this.gl.viewport( x, y, width, height );
        } else {
            this.gl.viewport( 0, 0, this.width, this.height );
        }
    };

    Viewport.prototype.resize = function( callback ) {
        this.callbacks.push( callback );
    };

    module.exports = Viewport;

}());
