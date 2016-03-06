(function () {

    'use strict';

    var WebGLContext = require('./WebGLContext');
    var Texture2D = require('./Texture2D');
    var Util = require('../util/Util');
    var MAG_FILTERS = {
        NEAREST: true,
        LINEAR: true
    };
    var MIN_FILTERS = {
        NEAREST: true,
        LINEAR: true,
        NEAREST_MIPMAP_NEAREST: true,
        LINEAR_MIPMAP_NEAREST: true,
        NEAREST_MIPMAP_LINEAR: true,
        LINEAR_MIPMAP_LINEAR: true
    };
    var WRAP_MODES = {
        REPEAT: true,
        MIRRORED_REPEAT: true,
        CLAMP_TO_EDGE: true
    };
    var TYPES = {
        UNSIGNED_BYTE: true,
        FLOAT: true
    };
    var FORMATS = {
        RGB: true,
        RGBA: true
    };
    var DEFAULT_TYPE = 'UNSIGNED_BYTE';
    var DEFAULT_FORMAT = 'RGBA';
    var DEFAULT_WRAP = 'REPEAT';
    var DEFAULT_FILTER = 'LINEAR';
    var DEFAULT_PREMULTIPLY_ALPHA = true;
    var DEFAULT_MIPMAP = true;
    var DEFAULT_INVERT_Y = true;

    function mustBePowerOfTwo( spec ) {
        // According to:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL#Non_power-of-two_textures
        // NPOT textures cannot be used with mipmapping and they must not "repeat"
        return spec.mipMap ||
            spec.wrapS === 'REPEAT' ||
            spec.wrapS === 'MIRRORED_REPEAT' ||
            spec.wrapT === 'REPEAT' ||
            spec.wrapT === 'MIRRORED_REPEAT';
    }

    function setImgData( spec, img ) {
        // create an empty canvas element
        var canvas = document.createElement( 'canvas' );
        if ( mustBePowerOfTwo( spec ) ) {
            canvas.width = Util.nextHighestPowerOfTwo( img.width );
            canvas.height = Util.nextHighestPowerOfTwo( img.height );
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        // Copy the image contents to the canvas
        var ctx = canvas.getContext( '2d' );
        ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height );
        var data = ctx.getImageData( 0, 0, canvas.width, canvas.height ).data;
        spec.data = new Uint8Array( data );
        spec.width = canvas.width;
        spec.height = canvas.height;
    }

    /**
     * Instantiates a ColorRexture2D object.
     * @class ColorRexture2D
     * @classdesc A texture class to represent a 2D color texture.
     */
    function ColorRexture2D( spec, callback ) {
        spec = spec || {};
        // get specific params
        spec.wrapS = spec.wrapS || spec.wrap;
        spec.wrapT = spec.wrapT || spec.wrap;
        spec.minFilter = spec.minFilter || spec.filter;
        spec.magFilter = spec.magFilter || spec.filter;
        // set texture params
        spec.wrapS = WRAP_MODES[ spec.wrapS ] ? spec.wrapS : DEFAULT_WRAP;
        spec.wrapT = WRAP_MODES[ spec.wrapT ] ? spec.wrapT : DEFAULT_WRAP;
        spec.minFilter = MIN_FILTERS[ spec.minFilter ] ? spec.minFilter : DEFAULT_FILTER;
        spec.magFilter = MAG_FILTERS[ spec.magFilter ] ? spec.magFilter : DEFAULT_FILTER;
        // set other properties
        spec.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
        spec.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
        spec.preMultiplyAlpha = spec.preMultiplyAlpha !== undefined ? spec.preMultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
        // set format
        spec.format = FORMATS[ spec.format ] ? spec.format : DEFAULT_FORMAT;
        // buffer the texture based on argument type
        if ( spec.image ) {
            // use existing Image object
            spec.type = 'UNSIGNED_BYTE';
            setImgData( spec, spec.image );
            Texture2D.call( this, spec );
        } else if ( spec.url ) {
            // request image source from url
            var image = new Image();
            var that = this;
            image.onload = function() {
                spec.type = 'UNSIGNED_BYTE';
                setImgData( spec, image );
                Texture2D.call( that, spec );
                if ( callback ) {
                    callback( that );
                }
            };
            image.src = spec.url;
        } else {
            // use arraybuffer
            if ( spec.data === undefined ) {
                // if no data is provided, assume this texture will be rendered
                // to. In this case disable mipmapping, there is no need and it
                // will only introduce very peculiar and difficult to discern
                // rendering phenomena in which the texture 'transforms' at
                // certain angles / distances to the mipmapped (empty) portions.
                spec.mipMap = false;
            }
            if ( spec.type === 'FLOAT' ) {
                // floating point texture
                if( !WebGLContext.checkExtension( 'OES_texture_float' ) ) {
                    console.warn( 'Cannot create ColorTexture2D of type gl.FLOAT as `OES_texture_float` is unsupported by this browser, defaulting to', DEFAULT_TYPE );
                    spec.type = DEFAULT_TYPE;
                }
            }
            spec.type = TYPES[ spec.type ] ? spec.type : DEFAULT_TYPE;
            Texture2D.call( this, spec );
        }
    }

    ColorRexture2D.prototype = Object.create( Texture2D.prototype );

    module.exports = ColorRexture2D;

}());
