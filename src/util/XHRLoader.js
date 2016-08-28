(function() {

    'use strict';

    module.exports = {

        /**
         * Sends an XMLHttpRequest GET request to the supplied url.
         *
         * @param {Object} options - The XHR options.
         * @param {String} options.url - The URL for the resource.
         * @param {Function} options.success - The success callback function.
         * @param {Function} options.error - The error callback function.
         * @param {Function} options.responseType - The responseType of the XHR.
         */
        load: function (options) {
            let request = new XMLHttpRequest();
            request.open('GET', options.url, true);
            request.responseType = options.responseType;
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        if (options.success) {
                            options.success(request.response);
                        }
                    } else {
                        if (options.error) {
                            options.error('GET ' + request.responseURL + ' ' + request.status + ' (' + request.statusText + ')');
                        }
                    }
                }
            };
            request.send();
        }
    };

}());
