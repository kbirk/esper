(function () {

    'use strict';

    var simplyDeferred = require('simply-deferred');
    var Deferred = simplyDeferred.Deferred;
    var when = simplyDeferred.when;

    /**
     * Returns a function that resolves the provided deferred.
     *
     * @param {Deferred} deferred - The deferred object.
     *
     * @returns {Function} The function to resolve the deferred.
     */
    function resolveDeferred( deferred ) {
        return function( result ) {
            deferred.resolve( result );
        };
    }

    /**
     * Dispatches an array of jobs, accumulating the results and
     * passing them to the callback function in corresponding indices.
     *
     * @param {Array} jobs - The job array.
     * @param {Function} callback - The callback function.
     */
     function asyncArray( jobs, callback ) {
        var deferreds = [],
            deferred,
            i;
        for ( i=0; i<jobs.length; i++ ) {
            deferred = new Deferred();
            deferreds.push( deferred );
            jobs[i]( resolveDeferred( deferred ) );
        }
        when.apply( when, deferreds ).then( function() {
            var results = Array.prototype.slice.call( arguments, 0 );
            callback( results );
        });
    }

    /**
     * Dispatches a map of jobs, accumulating the results and
     * passing them to the callback function under corresponding
     * keys.
     *
     * @param {Object} jobs - The job map.
     * @param {Function} callback - The callback function.
     */
     function asyncObj( jobs, callback ) {
        var jobsByIndex = [];
        var deferreds = [];
        Object.keys( jobs ).forEach( function( key ) {
            var deferred = new Deferred();
            deferreds.push( deferred );
            jobsByIndex.push( key );
            jobs[ key ]( resolveDeferred( deferred ) );
        });
        when.apply( when, deferreds ).done( function() {
            var results = Array.prototype.slice.call( arguments, 0 ),
                resultsByKey = {},
                i;
            for ( i=0; i<jobsByIndex.length; i++ ) {
                resultsByKey[ jobsByIndex[i] ] = results[i];
            }
            callback( resultsByKey );
        });
    }

    module.exports = {

        /**
         * Execute a set of functions asynchronously, once all have been
         * completed, execute the provided callback function. Jobs may be passed
         * as an array or object. The callback function will be passed the
         * results in the same format as the jobs. All jobs must have accept and
         * execute a callback function upon completion.
         *
         * @param {Array|Object} jobs - The set of functions to execute.
         * @param {Function} callback - The callback function to be executed upon completion.
         */
        async: function( jobs, callback ) {
            if ( jobs instanceof Array ) {
                asyncArray( jobs, callback );
            } else {
                asyncObj( jobs, callback );
            }
        },

        /**
         * Returns true if a provided array is a javscript TypedArray.
         *
         * @param {*} array - The variable to test.
         *
         * @returns {boolean} - Whether or not the variable is a TypedArray.
         */
        isTypedArray: function( array ) {
            return array &&
                array.buffer instanceof ArrayBuffer &&
                array.byteLength !== undefined;
        },

        /**
         * Returns true if the provided integer is a power of two.
         *
         * @param {integer} num - The number to test.
         *
         * @returns {boolean} - Whether or not the number is a power of two.
         */
        isPowerOfTwo: function( num ) {
            return ( num !== 0 ) ? ( num & ( num - 1 ) ) === 0 : false;
        },

        /**
         * Returns the next highest power of two for a number.
         *
         * Ex.
         *
         *     200 -> 256
         *     256 -> 256
         *     257 -> 512
         *
         * @param {integer} num - The number to modify.
         *
         * @returns {integer} - Next highest power of two.
         */
        nextHighestPowerOfTwo: function( num ) {
            var i;
            if ( num !== 0 ) {
                num = num-1;
            }
            for ( i=1; i<32; i<<=1 ) {
                num = num | num >> i;
            }
            return num + 1;
        }
    };

}());
