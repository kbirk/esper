'use strict';

/**
 * Returns true if the argument is one of the WebGL `texImage2D` overridden
 * canvas types.
 *
 * @param {*} arg - The argument to test.
 *
 * @returns {bool} - Whether or not it is a canvas type.
 */
function isCanvasType(arg) {
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
 * @returns {bool} - Whether or not the texture must be a power of two.
 */
function mustBePowerOfTwo(spec) {
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
 * @param {number} num - The number to test.
 *
 * @returns {boolean} - Whether or not the number is a power of two.
 */
function isPowerOfTwo(num) {
	return (num !== 0) ? (num & (num - 1)) === 0 : false;
};

/**
 * Returns the next highest power of two for a number.
 *
 * Ex.
 *
 *	 200 -> 256
 *	 256 -> 256
 *	 257 -> 512
 *
 * @param {number} num - The number to modify.
 *
 * @returns {number} - Next highest power of two.
 */
function nextHighestPowerOfTwo(num) {
	if (num !== 0) {
		num = num-1;
	}
	num |= num >> 1;
	num |= num >> 2;
	num |= num >> 4;
	num |= num >> 8;
	num |= num >> 16;
	return num + 1;
};

/**
 * If the texture must be a POT, resizes and returns the image.
 *
 * @private
 *
 * @param {Object} spec - The texture specification object.
 * @param {HTMLImageElement} img - The image object.
 *
 * @returns {HTMLImageElement|HTMLCanvasElement} - The original image, or the resized canvas element.
 */
function resizeCanvas(spec, img) {
	if (!mustBePowerOfTwo(spec) ||
		(isPowerOfTwo(img.width) && isPowerOfTwo(img.height))) {
		return img;
	}
	// create an empty canvas element
	const canvas = document.createElement('canvas');
	canvas.width = nextHighestPowerOfTwo(img.width);
	canvas.height = nextHighestPowerOfTwo(img.height);
	// copy the image contents to the canvas
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
	return canvas;
};

module.exports = {
	isCanvasType: isCanvasType,
	mustBePowerOfTwo: mustBePowerOfTwo,
	isPowerOfTwo: isPowerOfTwo,
	nextHighestPowerOfTwo: nextHighestPowerOfTwo,
	resizeCanvas: resizeCanvas
};
