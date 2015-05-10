(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        _boundBuffer = null;

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
     * Binds the framebuffer object.
     * @memberof Framebuffer
     *
     * @returns {Framebuffer} Returns the framebuffer object for chaining.
     */
    Framebuffer.prototype.bind = function() {
        // if this buffer is already bound, exit early
        if ( _boundBuffer === this ) {
            return;
        }
        var gl = this.gl;
        gl.bindFramebuffer( gl.FRAMEBUFFER, this.id );
        _boundBuffer = this;
        return this;
    };

    /**
     * Unbinds the framebuffer object.
     * @memberof Framebuffer
     *
     * @returns {Framebuffer} Returns the framebuffer object for chaining.
     */
    Framebuffer.prototype.unbind = function() {
        // if there is no buffer bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = this.gl;
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        _boundBuffer = null;
        return this;
    };

    /**
     * Attaches the provided texture to the provided attachment location.
     * @memberof Framebuffer
     *
     * @params {Texture2D} texture - The texture to attach.
     * @params {String} attachment - The attachment location.
     *
     * @returns {Framebuffer} Returns the framebuffer object for chaining.
     */
    Framebuffer.prototype.attach = function( texture, attachment ) {
        var gl = this.gl;
        this.textures.push( texture );
        gl.bindFramebuffer( gl.FRAMEBUFFER, this.id );
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl[ attachment ],
            gl.TEXTURE_2D,
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
     * @returns {Framebuffer} Returns the framebuffer object for chaining.
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
