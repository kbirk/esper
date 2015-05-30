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
        this.textures = {};
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
     * @param {number} index - The attachment index. (optional)
     * @param {String} target - The texture target type. (optional)
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.setColorTarget = function( texture, index, target ) {
        var gl = this.gl;
        if ( typeof index === "string" ) {
            target = index;
            index = undefined;
        }
        index = ( index !== undefined ) ? index : 0;
        this.textures[ 'color' + index ] = texture;
        this.push();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl[ 'COLOR_ATTACHMENT' + index ],
            gl[ target || "TEXTURE_2D" ],
            texture.id,
            0 );
        this.pop();
        return this;
    };

    /**
     * Attaches the provided texture to the provided attachment location.
     * @memberof Framebuffer
     *
     * @param {Texture2D} texture - The texture to attach.
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.setDepthTarget = function( texture ) {
        var gl = this.gl;
        this.textures.depth = texture;
        this.push();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.TEXTURE_2D,
            texture.id,
            0 );
        this.pop();
        return this;
    };

    /**
     * Clears the color bits of the framebuffer.
     * @memberof Framebuffer
     *
     * @param {number} r - The red value.
     * @param {number} g - The green value.
     * @param {number} b - The blue value.
     * @param {number} a - The alpha value.
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.clearColor = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.COLOR_BUFFER_BIT );
        this.pop();
        return this;
    };

    /**
     * Clears the depth bits of the framebuffer.
     * @memberof Framebuffer
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.clearDepth = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.DEPTH_BUFFER_BIT );
        this.pop();
        return this;
    };

    /**
     * Clears the stencil bits of the framebuffer.
     * @memberof Framebuffer
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.clearStencil = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.STENCIL_BUFFER_BIT );
        this.pop();
        return this;
    };

    /**
     * Clears all the bits of the framebuffer.
     * @memberof Framebuffer
     *
     * @returns {Framebuffer} The framebuffer object, for chaining.
     */
    Framebuffer.prototype.clear = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
        this.pop();
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
        var key;
        if ( !width || !height ) {
            return this;
        }
        for ( key in this.textures ) {
            if ( this.textures.hasOwnProperty( key ) ) {
                this.textures[ key ].resize( width, height );
            }
        }
        return this;
    };

    module.exports = Framebuffer;

}());
