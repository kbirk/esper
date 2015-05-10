(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Util = require('../util/Util'),
        _boundTexture = null;

    function ensurePowerOfTwo( image ) {
        if ( !Util.isPowerOfTwo( image.width ) || !Util.isPowerOfTwo( image.height ) ) {
            var canvas = document.createElement( "canvas" );
            canvas.width = Util.nextHighestPowerOfTwo( image.width );
            canvas.height = Util.nextHighestPowerOfTwo( image.height );
            var ctx = canvas.getContext("2d");
            ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height );
            return canvas;
        }
        return image;
    }

    function bufferImage( gl, spec, image, texture ) {
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, spec.wrap );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, spec.wrap );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.bindTexture( gl.TEXTURE_2D, null );
    }

    function bufferData( gl, spec, texture ) {
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.texImage2D( gl.TEXTURE_2D, 0, spec.internalFormat, spec.width, spec.height, 0, spec.format, spec.type, spec.data );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, spec.filter );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, spec.filter );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, spec.wrap );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, spec.wrap );
        //gl.generateMipmap( gl.TEXTURE_2D );
        gl.bindTexture( gl.TEXTURE_2D, null );
    }

    function Texture2D( spec, callback ) {
        var that = this,
            gl = this.gl = WebGLContext.get();
        // create texture object
        this.id = gl.createTexture();
        this.spec = spec || {};
        this.spec.wrap = gl[ spec.wrap ] || gl.REPEAT;
        // buffer the texture based on arguments
        if ( spec.image ) {
            // use existing Image object
            this.image = spec.image;
            this.image = ensurePowerOfTwo( this.image );
            bufferImage( gl, this.spec, this.image, this.id );
        } else if ( spec.url ) {
            // request image source from url
            this.image = new Image();
            this.image.onload = function() {
                that.image = ensurePowerOfTwo( that.image );
                bufferImage( gl, that.spec, that.image, that.id );
                callback( that );
            };
            this.image.src = spec.url;
        } else {
            // buffer data
            if ( this.spec.format === "DEPTH_COMPONENT" ) {
                var depthTextureExt = WebGLContext.checkExtension( "WEBGL_depth_texture" );
                if( !depthTextureExt ) {
                    console.log( "Cannot create Texture2D of format " +
                        "gl.DEPTH_COMPONENT as WEBGL_depth_texture is " +
                        "unsupported by this browser, command ignored" );
                    return;
                }
            }
            this.spec.format = gl[ spec.format ] || gl.RGBA;
            this.spec.internalFormat = this.spec.format; // webgl requires that format === internalFormat
            this.spec.type = gl[ spec.type ] || gl.UNSIGNED_BYTE;
            this.spec.width = spec.width || 256;
            this.spec.height = spec.height || 256;
            this.spec.data = spec.data || null;
            this.spec.filter = gl[ spec.filter ] || gl.LINEAR;
            bufferData( gl, this.spec, this.id );
        }
    }

    Texture2D.prototype.bind = function( location ) {
        // if this buffer is already bound, exit early
        if ( _boundTexture === this ) {
            return;
        }
        var gl = this.gl;
        location = gl[ location ] || gl.TEXTURE0;
        gl.activeTexture( location );
        gl.bindTexture( gl.TEXTURE_2D, this.id );
        _boundTexture = this;
        return this;
    };

    Texture2D.prototype.unbind = function() {
        // if no buffer is bound, exit early
        if ( _boundTexture === null ) {
            return;
        }
        var gl = this.gl;
        gl.bindTexture( gl.TEXTURE_2D, null );
        _boundTexture = null;
        return this;
    };

    Texture2D.prototype.resize = function( width, height ) {
        if ( this.image ) {
            console.log( "Cannot resize image based Texture2D" );
            return;
        }
        if ( !width || !height ) {
            return;
        }
        this.spec.width = width;
        this.spec.height = height;
        bufferData( this.gl, this.spec, this.id );
        return this;
    };

    module.exports = Texture2D;

}());
