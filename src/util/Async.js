(function () {

    'use strict';

    function getIterator( arg ) {
        var i = -1;
        var len;
        if ( Array.isArray( arg ) ) {
            len = arg.length;
            return function() {
                i++;
                return i < len ? i : null;
            };
        }
        var keys = Object.keys( arg );
        len = keys.length;
        return function() {
            i++;
            return i < len ? keys[i] : null;
        };
    }

    function each( object, iterator, callback ) {
        var key;
        var completed = 0;

        function done( err ) {
            completed--;
            if ( err ) {
                callback(err);
            } else if ( key === null && completed <= 0 ) {
                // check if key is null in case iterator isn't exhausted and done
                // was resolved synchronously.
                callback(null);
            }
        }

        var iter = getIterator(object);
        while ( (key = iter()) !== null ) {
            completed += 1;
            iterator( object[ key ], key, done );
        }
        if ( completed === 0 ) {
            callback( null );
        }
    }

    module.exports = {

        /**
         * Execute a set of functions asynchronously, once all have been
         * completed, execute the provided callback function. Jobs may be passed
         * as an array or object. The callback function will be passed the
         * results in the same format as the tasks. All tasks must have accept
         * and execute a callback function upon completion.
         *
         * @param {Array|Object} tasks - The set of functions to execute.
         * @param {Function} callback - The callback function to be executed upon completion.
         */
        parallel: function (tasks, callback) {
            var results = Array.isArray( tasks ) ? [] : {};
            each( tasks, function( task, key, callback ) {
                task( function( err, res ) {
                    results[ key ] = res;
                    callback( err );
                });
            }, function( err ) {
                callback( err, results );
            });
        }

    };

}());
