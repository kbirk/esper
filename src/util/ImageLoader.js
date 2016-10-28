'use strict';

module.exports = {

	/**
	 * Sends an GET request create an Image object.
	 *
	 * @param {Object} options - The XHR options.
	 * @param {String} options.url - The URL for the resource.
	 * @param {boolean} options.crossOrigin - Enable cross-origin request.
	 * @param {Function} options.success - The success callback function.
	 * @param {Function} options.error - The error callback function.
	 */
	load: function (options = {}) {
		const image = new Image();
		image.onload = () => {
			if (options.success) {
				options.success(image);
			}
		};
		image.onerror = (event) => {
			if (options.error) {
				const err = `Unable to load image from URL: \`${event.path[0].currentSrc }\``;
				options.error(err);
			}
		};
		image.crossOrigin = options.crossOrigin ? 'anonymous' : undefined;
		image.src = options.url;
	}
};
