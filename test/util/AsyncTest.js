(function() {

    'use strict';

    var assert = require('assert');
    var Async = require( '../../src/util/Async' );

    describe('Async', function() {
        describe('#parallel()', function() {
            it('should execute all jobs asynchronously', function( done ) {
                var asyncResults = [];
                Async.parallel([
                    function( done ) {
                        setTimeout( function() {
                            asyncResults.push( 0 );
                            done();
                        }, 150 );
                    },
                    function( done ) {
                        setTimeout( function() {
                            asyncResults.push( 1 );
                            done();
                        }, 100 );
                    },
                    function( done ) {
                        setTimeout( function() {
                            asyncResults.push( 2 );
                            done();
                        }, 50 );
                    }
                ], function() {
                    assert( asyncResults[0] === 2 );
                    assert( asyncResults[1] === 1 );
                    assert( asyncResults[2] === 0 );
                    done();
                });
            });
            it('should return results in the order they are queued', function( done ) {
                Async.parallel([
                    function( done ) {
                        setTimeout( function() {
                            done( null, 0 );
                        }, 150 );
                    },
                    function( done ) {
                        setTimeout( function() {
                            done( null, 1 );
                        }, 100 );
                    },
                    function( done ) {
                        setTimeout( function() {
                            done( null, 2 );
                        }, 50 );
                    }
                ], function( err, results ) {
                    assert( !err );
                    assert( results[0] === 0 );
                    assert( results[1] === 1 );
                    assert( results[2] === 2 );
                    done();
                });
            });
            it('should accept an array of jobs, returning results in a corresponding array', function( done ) {
                Async.parallel([
                    function( done ) {
                        done( null, 0 );
                    },
                    function( done ) {
                        done( null, 1 );
                    },
                    function( done ) {
                        done( null, 2 );
                    }
                ], function( err, results ) {
                    assert( !err );
                    assert( results[0] === 0 );
                    assert( results[1] === 1 );
                    assert( results[2] === 2 );
                    done();
                });
            });
            it('should accept a map of jobs, returning results in a corresponding map, ignoring prototypical attributes', function( done ) {
                function Obj() {
                    this.a = function( done ) {
                        done( null, 'a' );
                    };
                    this.b = function( done ) {
                        done( null, 'b' );
                    };
                    this.c = function( done ) {
                        done( null, 'c' );
                    };
                }
                Obj.prototype.d = function( done ) {
                    assert( false );
                    done( null, 'd' );
                };
                Async.parallel( new Obj(), function( err, results ) {
                    assert( !err );
                    assert( results.a === 'a' );
                    assert( results.b === 'b' );
                    assert( results.c === 'c' );
                    assert( results.d === undefined );
                    done();
                });
            });
            it('should accept empty object and return empty object of results', function( done ) {
                Async.parallel({}, function( err, results ) {
                    assert( !err );
                    for( var prop in results ) {
                        if( results.hasOwnProperty( prop ) ) {
                            assert( false );
                        }
                    }
                    done();
                });
            });
            it('should accept empty array and return empty array of results', function( done ) {
                Async.parallel( [], function( err, results ) {
                    assert( !err );
                    assert( results.length === 0 );
                    done();
                });
            });
            it('should execute the callback upon first indication of error, ignoring other success results for objects', function( done ) {
                Async.parallel({
                    a: function( done ) {
                        setTimeout( function() {
                            done( {} );
                        }, 100 );
                    },
                    b: function( done ) {
                        setTimeout( function() {
                            done( null, 1 );
                        }, 200 );
                    },
                    c: function( done ) {
                        done( null, 2 );
                    }
                }, function( err, results ) {
                    assert( err );
                    assert( results === undefined );
                    done();
                });
            });
            it('should execute the callback upon first indication of error, ignoring other success results for arrays', function( done ) {
                Async.parallel([
                    function( done ) {
                        setTimeout( function() {
                            done( {} );
                        }, 100 );
                    },
                    function( done ) {
                        setTimeout( function() {
                            done( null, 1 );
                        }, 200 );
                    },
                    function( done ) {
                        done( null, 2 );
                    }
                ], function( err, results ) {
                    assert( err );
                    assert( results === undefined );
                    done();
                });
            });
        });
    });

}());
