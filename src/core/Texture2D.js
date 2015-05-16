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

    function Texture2D( spec, callback ) {
        var that = this;
        // default
        spec = spec || {};
        this.gl = WebGLContext.get();
        // create texture object
        this.id = this.gl.createTexture();
        this.wrap = spec.wrap || "REPEAT";
        this.filter = spec.filter || "LINEAR";
        // buffer the texture based on arguments
        if ( spec.image ) {
            // use existing Image object
            this.bufferData( spec.image );
            this.setParameters( this );
        } else if ( spec.url ) {
            // request image source from url
            var image = new Image();
            image.onload = function() {
                that.bufferData( image );
                that.setParameters( this );
                callback( that );
            };
            image.src = spec.url;
        } else {
            // buffer data
            if ( spec.format === "DEPTH_COMPONENT" ) {
                var depthTextureExt = WebGLContext.checkExtension( "WEBGL_depth_texture" );
                if( !depthTextureExt ) {
                    console.log( "Cannot create Texture2D of format " +
                        "gl.DEPTH_COMPONENT as WEBGL_depth_texture is " +
                        "unsupported by this browser, command ignored" );
                    return;
                }
            }
            this.format = spec.format || "RGBA";
            this.internalFormat = this.format; // webgl requires format === internalFormat
            this.type = spec.type || "UNSIGNED_BYTE";
            this.mipMap = spec.mipMap || false;
            this.bufferData( spec.data || null, spec.width, spec.height );
            this.setParameters( this );
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

    Texture2D.prototype.bufferData = function( data, width, height ) {
        var gl = this.gl;
        gl.bindTexture( gl.TEXTURE_2D, this.id );
        if ( data instanceof HTMLImageElement ) {
            data = ensurePowerOfTwo( data );
            this.image = data;
            this.width = data.width;
            this.height = data.height;
            this.mipMap = true;
            // images are inverted along the y, load them upside down
            gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
            gl.texImage2D(
                gl.TEXTURE_2D,
                0, // level
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                data );
        } else {
            this.data = data;
            this.width = width || this.width;
            this.height = height || this.height;
            gl.texImage2D(
                gl.TEXTURE_2D,
                0, // level
                gl[ this.internalFormat ],
                this.width,
                this.height,
                0, // border, must be 0
                gl[ this.format ],
                gl[ this.type ],
                this.data );
        }
        if ( this.mipMap ) {
            gl.generateMipmap( gl.TEXTURE_2D );
        }
        gl.bindTexture( gl.TEXTURE_2D, null );
        return this;
    };

    Texture2D.prototype.setParameters = function( parameters ) {
        var gl = this.gl;
        gl.bindTexture( gl.TEXTURE_2D, this.id );
        if ( parameters.wrap ) {
            // set wrap parameters
            this.wrap = parameters.wrap;
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl[ this.wrap.s || this.wrap ] );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl[ this.wrap.t || this.wrap ] );
        }
        if ( parameters.filter ) {
            // set filter parameters
            this.filter = parameters.filter;
            var minFilter = this.filter.min || this.filter;
            if ( this.minMap ) {
                // append min mpa suffix to min filter
                minFilter += "_MIPMAP_LINEAR";
            }
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MAG_FILTER,
                gl[ this.filter.mag || this.filter ] );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MIN_FILTER,
                gl[ minFilter] );
        }
        gl.bindTexture( gl.TEXTURE_2D, null );
        return this;
    };

    Texture2D.prototype.resize = function( width, height ) {
        if ( this.image ) {
            console.log( "Cannot resize image based Texture2D" );
            return;
        }
        if ( !width || !height ) {
            console.log("Width or height arguments missing, command ignored.");
            return;
        }
        this.bufferData( this.data, width, height );
        return this;
    };

    module.exports = Texture2D;

}());
