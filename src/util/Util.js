(function () {

    'use strict';

    let Util = {};

    /**
     * Returns true if the argument is one of the WebGL `texImage2D` overridden
     * canvas types.
     *
     * @param {*} arg - The argument to test.
     *
     * @return {bool} - Whether or not it is a canvas type.
     */
    Util.isCanvasType = function(arg) {
        return arg instanceof ImageData ||
            arg instanceof HTMLImageElement ||
            arg instanceof HTMLCanvasElement ||
            arg instanceof HTMLVideoElement;
    };

    /**
     * Returns true if the texture MUST be a power-of-two. Otherwise return false.
     *
     * @param {Object} spec - The texture specification object.
     *
     * @return {bool} - Whether or not the texture must be a power of two.
     */
    Util.mustBePowerOfTwo = function(spec) {
        // According to:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL#Non_power-of-two_textures
        // N-POT textures cannot be used with mipmapping and they must not "REPEAT"
        return spec.mipMap ||
            spec.wrapS === 'REPEAT' ||
            spec.wrapS === 'MIRRORED_REPEAT' ||
            spec.wrapT === 'REPEAT' ||
            spec.wrapT === 'MIRRORED_REPEAT';
    };

    /**
     * Returns true if the provided integer is a power of two.
     *
     * @param {Number} num - The number to test.
     *
     * @return {boolean} - Whether or not the number is a power of two.
     */
    Util.isPowerOfTwo = function(num) {
        return (num !== 0) ? (num & (num - 1)) === 0 : false;
    };

    /**
     * Returns the next highest power of two for a number.
     *
     * Ex.
     *
     *     200 -> 256
     *     256 -> 256
     *     257 -> 512
     *
     * @param {Number} num - The number to modify.
     *
     * @return {Number} - Next highest power of two.
     */
    Util.nextHighestPowerOfTwo = function(num) {
        let i;
        if (num !== 0) {
            num = num-1;
        }
        for (i=1; i<32; i<<=1) {
            num = num | num >> i;
        }
        return num + 1;
    };

    /**
     * If the texture must be a POT, resizes and returns the image.
     * @private
     *
     * @param {Object} spec - The texture specification object.
     * @param {HTMLImageElement} img - The image object.
     *
     * @return {HTMLImageElement|HTMLCanvasElement} - The original image, or the resized canvas element.
     */
    Util.resizeCanvas = function(spec, img) {
        if (!Util.mustBePowerOfTwo(spec) ||
            (Util.isPowerOfTwo(img.width) && Util.isPowerOfTwo(img.height))) {
            return img;
        }
        // create an empty canvas element
        let canvas = document.createElement('canvas');
        canvas.width = Util.nextHighestPowerOfTwo(img.width);
        canvas.height = Util.nextHighestPowerOfTwo(img.height);
        // copy the image contents to the canvas
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        return canvas;
    };

    module.exports = Util;

}());
