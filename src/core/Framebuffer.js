(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Stack = require('../util/Stack'),
        _stack = new Stack(),
        _boundBuffer = null;


    /**
     * Binds the framebuffer object, caching it to prevent unnecessary rebinds.
     *
     * @param {Framebuffer} framebuffer - The Framebuffer object to bind.
     */
     function bind( framebuffer ) {
        // if this buffer is already bound, exit early
        if ( _boundBuffer === framebuffer ) {
            return;
        }
        var gl = framebuffer.gl;
        gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer.id );
        _boundBuffer = framebuffer;
    }

    /**
     * Unbinds the framebuffer object. Prevents unnecessary unbinding.
     *
     * @param {Framebuffer} framebuffer - The Framebuffer object to unbind.
     */
     function unbind( framebuffer ) {
        // if there is no buffer bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = framebuffer.gl;
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        _boundBuffer = null;
    }

    /**
     * Instantiates a Framebuffer object.
     * @class Framebuffer
     * @classdesc A framebuffer class to allow rendering to textures.
     */
    function Framebuffer() {
        var gl = this.gl = WebGLContext.get();
        this.id = gl.createFramebuffer();
        this.textures = [];
        return this;
    }

    /**
     * Binds the framebuffer object and pushes it to the front of the stack.
     * @memberof Framebuffer
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.push = function() {
        _stack.push( this );
        bind( this );
        return this;
    };

    /**
     * Unbinds the framebuffer object and binds the framebuffer beneath it on
     * this stack. If there is no underlying framebuffer, bind the backbuffer.
     * @memberof Framebuffer
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.pop = function() {
        var top;
        _stack.pop();
        top = _stack.top();
        if ( top ) {
            bind( top );
        } else {
            unbind( this );
        }
        return this;
    };

    /**
     * Attaches the provided texture to the provided attachment location.
     * @memberof Framebuffer
     *
     * @param {Texture2D} texture - The texture to attach.
     * @param {String} attachment - The attachment location.
     * @param {String} target - The texture target type.
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.attach = function( texture, attachment, target ) {
        var gl = this.gl;
        this.textures.push( texture );
        gl.bindFramebuffer( gl.FRAMEBUFFER, this.id );
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl[ attachment ],
            gl[ target || "TEXTURE_2D" ],
            texture.id,
            0 );
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        return this;
    };

    /**
     * Resizes the framebuffer and all attached textures by the provided height
     * and width.
     * @memberof Framebuffer
     *
     * @param {number} width - The new width of the framebuffer.
     * @param {number} height - The new height of the framebuffer.
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.resize = function( width, height ) {
        var i;
        if ( !width || !height ) {
            return this;
        }
        for ( i=0; i<this.textures.length; i++ ) {
            this.textures[i].resize( width, height );
        }
        return this;
    };

    module.exports = Framebuffer;

}());
