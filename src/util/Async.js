(function () {

    'use strict';

    var simplyDeferred = require('simply-deferred');
    var Deferred = simplyDeferred.Deferred;
    var when = simplyDeferred.when;

    /**
     * Returns a function that resolves the provided deferred.
     * @private
     *
     * @param {Deferred} deferred - The deferred object.
     *
     * @returns {Function} The function to resolve the deferred.
     */
    function resolveDeferred( deferred ) {
        return function( err, result ) {
            if ( err ) {
                deferred.reject( err );
                return;
            }
            deferred.resolve( result );
        };
    }

    /**
     * Dispatches an array of jobs, accumulating the results and
     * passing them to the callback function in corresponding indices.
     * @private
     *
     * @param {Array} jobs - The job array.
     * @param {Function} callback - The callback function.
     */
     function asyncArray( jobs, callback ) {
        var deferreds = [];
        jobs.forEach( function( job ) {
            var deferred = new Deferred();
            deferreds.push( deferred );
            job( resolveDeferred( deferred ) );
        });
        when.apply( when, deferreds )
            .fail( function( err ) {
                callback( err );
            })
            .done( function() {
                var results = Array.prototype.slice.call( arguments, 0 );
                callback( null, results );
            });
    }

    /**
     * Dispatches a map of jobs, accumulating the results and
     * passing them to the callback function under corresponding
     * keys.
     * @private
     *
     * @param {Object} jobs - The job map.
     * @param {Function} callback - The callback function.
     */
     function asyncObj( jobs, callback ) {
        var keys = [];
        var deferreds = [];
        Object.keys( jobs ).forEach( function( key ) {
            var deferred = new Deferred();
            deferreds.push( deferred );
            keys.push( key );
            jobs[ key ]( resolveDeferred( deferred ) );
        });
        when.apply( when, deferreds )
            .fail( function( err ) {
                callback( err );
            })
            .done( function() {
                var results = Array.prototype.slice.call( arguments, 0 );
                var resultsByKey = {};
                keys.forEach( function( key, index ) {
                    resultsByKey[ key ] = results[index];
                });
                callback( null, resultsByKey );
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
        parallel: function( jobs, callback ) {
            if ( jobs instanceof Array ) {
                asyncArray( jobs, callback );
            } else {
                asyncObj( jobs, callback );
            }
        }

    };

}());
