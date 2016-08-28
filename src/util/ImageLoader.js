(function() {

    'use strict';

    module.exports = {

        /**
         * Sends an GET request create an Image object.
         *
         * @param {Object} options - The XHR options.
         * @param {String} options.url - The URL for the resource.
         * @param {Function} options.success - The success callback function.
         * @param {Function} options.error - The error callback function.
         */
        load: function (options = {}) {
            let image = new Image();
            image.onload = () => {
                if (options.success) {
                    options.success(image);
                }
            };
            image.onerror = (event) => {
                if (options.error) {
                    let err = 'Unable to load image from URL: `' + event.path[0].currentSrc + '`';
                    options.error(err);
                }
            };
            image.src = options.url;
        }
    };

}());
