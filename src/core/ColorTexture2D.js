(function () {

    'use strict';

    let Texture2D = require('./Texture2D');
    let ImageLoader = require('../util/ImageLoader');
    let Util = require('../util/Util');

    let MAG_FILTERS = {
        NEAREST: true,
        LINEAR: true
    };
    let MIN_FILTERS = {
        NEAREST: true,
        LINEAR: true,
        NEAREST_MIPMAP_NEAREST: true,
        LINEAR_MIPMAP_NEAREST: true,
        NEAREST_MIPMAP_LINEAR: true,
        LINEAR_MIPMAP_LINEAR: true
    };
    let WRAP_MODES = {
        REPEAT: true,
        MIRRORED_REPEAT: true,
        CLAMP_TO_EDGE: true
    };
    let TYPES = {
        UNSIGNED_BYTE: true,
        FLOAT: true
    };
    let FORMATS = {
        RGB: true,
        RGBA: true
    };

    /**
     * The default type for color textures.
     */
    let DEFAULT_TYPE = 'UNSIGNED_BYTE';

    /**
     * The default format for color textures.
     */
    let DEFAULT_FORMAT = 'RGBA';

    /**
     * The default wrap mode for color textures.
     */
    let DEFAULT_WRAP = 'REPEAT';

    /**
     * The default min / mag filter for color textures.
     */
    let DEFAULT_FILTER = 'LINEAR';

    /**
     * The default for whether alpha premultiplying is enabled.
     */
    let DEFAULT_PREMULTIPLY_ALPHA = true;

    /**
     * The default for whether mipmapping is enabled.
     */
    let DEFAULT_MIPMAP = true;

    /**
     * The default for whether invert-y is enabled.
     */
    let DEFAULT_INVERT_Y = true;

    /**
     * @class ColorTexture2D
     * @classdesc A texture class to represent a 2D color texture.
     * @augments Texture2D
     */
    class ColorTexture2D extends Texture2D {

        /**
         * Instantiates a ColorTexture2D object.
         *
         * @param {Object} spec - The specification arguments.
         * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} spec.image - The HTMLImageElement to buffer.
         * @param {String} spec.url - The HTMLImageElement URL to load and buffer.
         * @param {Uint8Array|Float32Array} spec.src - The data to buffer.
         * @param {Number} spec.width - The width of the texture.
         * @param {Number} spec.height - The height of the texture.
         * @param {String} spec.wrap - The wrapping type over both S and T dimension.
         * @param {String} spec.wrapS - The wrapping type over the S dimension.
         * @param {String} spec.wrapT - The wrapping type over the T dimension.
         * @param {String} spec.filter - The min / mag filter used during scaling.
         * @param {String} spec.minFilter - The minification filter used during scaling.
         * @param {String} spec.magFilter - The magnification filter used during scaling.
         * @param {bool} spec.mipMap - Whether or not mip-mapping is enabled.
         * @param {bool} spec.invertY - Whether or not invert-y is enabled.
         * @param {bool} spec.premultiplyAlpha - Whether or not alpha premultiplying is enabled.
         * @param {String} spec.format - The texture pixel format.
         * @param {String} spec.type - The texture pixel component type.
         * @param {Function} callback - The callback to be executed if the data is loaded asynchronously via a URL.
         */
        constructor(spec = {}, callback = null) {
            // get specific params
            spec.wrapS = spec.wrapS || spec.wrap;
            spec.wrapT = spec.wrapT || spec.wrap;
            spec.minFilter = spec.minFilter || spec.filter;
            spec.magFilter = spec.magFilter || spec.filter;
            // set texture params
            spec.wrapS = WRAP_MODES[spec.wrapS] ? spec.wrapS : DEFAULT_WRAP;
            spec.wrapT = WRAP_MODES[spec.wrapT] ? spec.wrapT : DEFAULT_WRAP;
            spec.minFilter = MIN_FILTERS[spec.minFilter] ? spec.minFilter : DEFAULT_FILTER;
            spec.magFilter = MAG_FILTERS[spec.magFilter] ? spec.magFilter : DEFAULT_FILTER;
            // set other properties
            spec.mipMap = spec.mipMap !== undefined ? spec.mipMap : DEFAULT_MIPMAP;
            spec.invertY = spec.invertY !== undefined ? spec.invertY : DEFAULT_INVERT_Y;
            spec.premultiplyAlpha = spec.premultiplyAlpha !== undefined ? spec.premultiplyAlpha : DEFAULT_PREMULTIPLY_ALPHA;
            // set format
            spec.format = FORMATS[spec.format] ? spec.format : DEFAULT_FORMAT;
            // buffer the texture based on argument type
            if (typeof spec.src === 'string') {
                // request source from url
                spec.type = 'UNSIGNED_BYTE';
                // call base constructor
                super(spec);
                // TODO: put extension handling for arraybuffer / image / video differentiation
                ImageLoader.load({
                    url: spec.src,
                    success: image => {
                        // set to unsigned byte type
                        image = Util.resizeCanvas(spec, image);
                        // now buffer
                        this.bufferData(image, spec.width, spec.height);
                        this.setParameters(this);
                        // execute callback
                        if (callback) {
                            callback(null, this);
                        }
                    },
                    error: err => {
                        if (callback) {
                            callback(err, null);
                        }
                    }
                });
            } else if (Util.isCanvasType(spec.src)) {
                // is image / canvas / video type
                // set to unsigned byte type
                spec.type = 'UNSIGNED_BYTE';
                spec.src = Util.resizeCanvas(spec, spec.src);
                // call base constructor
                super(spec);
            } else {
                // array, arraybuffer, or null
                if (spec.src === undefined || spec.src === null) {
                    // if no data is provided, assume this texture will be rendered
                    // to. In this case disable mipmapping, there is no need and it
                    // will only introduce very peculiar and difficult to discern
                    // rendering phenomena in which the texture 'transforms' at
                    // certain angles / distances to the mipmapped (empty) portions.
                    spec.mipMap = false;
                }
                // buffer from arg
                spec.type = TYPES[spec.type] ? spec.type : DEFAULT_TYPE;
                // call base constructor
                super(spec);
            }
        }
    }

    module.exports = ColorTexture2D;

}());
