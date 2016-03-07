(function() {

    'use strict';

    var assert = require('assert');
    var Util = require( '../../src/util/Util' );

    describe('Util', function() {
        describe('#isTypedArray()', function() {
            it('should return true if the argument is instance of TypedArray, false if not', function() {
                var a = new ArrayBuffer(64),
                    b = new Uint8Array( a ),
                    c = new Uint16Array( a ),
                    d = new Uint32Array( a ),
                    e = new Int8Array( a ),
                    f = new Int16Array( a ),
                    g = new Int16Array( a ),
                    h = new Int32Array( a ),
                    i = new Float32Array( a ),
                    j = new Float64Array( a );
                assert( !Util.isTypedArray( a ) );
                assert( Util.isTypedArray( b ) );
                assert( Util.isTypedArray( c ) );
                assert( Util.isTypedArray( d ) );
                assert( Util.isTypedArray( e ) );
                assert( Util.isTypedArray( f ) );
                assert( Util.isTypedArray( g ) );
                assert( Util.isTypedArray( h ) );
                assert( Util.isTypedArray( i ) );
                assert( Util.isTypedArray( j ) );
                assert( !Util.isTypedArray( 4 ) );
                assert( !Util.isTypedArray( {} ) );
                assert( !Util.isTypedArray( [] ) );
                assert( !Util.isTypedArray( 'string' ) );
                assert( !Util.isTypedArray( null ) );
                assert( !Util.isTypedArray( undefined ) );
                assert( !Util.isTypedArray( true ) );
                assert( !Util.isTypedArray( false ) );
            });
        });
        describe('#isPowerOfTwo()', function() {
            it('should return true if the argument is a power of two, false if not', function() {
                assert( Util.isPowerOfTwo( 1 ) );
                assert( Util.isPowerOfTwo( 2 ) );
                assert( Util.isPowerOfTwo( 4 ) );
                assert( Util.isPowerOfTwo( 8 ) );
                assert( Util.isPowerOfTwo( 16 ) );
                assert( Util.isPowerOfTwo( 32 ) );
                assert( !Util.isPowerOfTwo( 0 ) );
                assert( !Util.isPowerOfTwo( 3 ) );
                assert( !Util.isPowerOfTwo( 5 ) );
                assert( !Util.isPowerOfTwo( 6 ) );
                assert( !Util.isPowerOfTwo( 7 ) );
                assert( !Util.isPowerOfTwo( 12 ) );
                assert( !Util.isPowerOfTwo( 31 ) );
            });
        });
        describe('#nextHighestPowerOfTwo()', function() {
            it('should return a power of two', function() {
                var i;
                for ( i=0; i<100; i++ ) {
                    assert( Util.isPowerOfTwo( Util.nextHighestPowerOfTwo( Math.random()*100 ) ) );
                }
            });
            it('should return a power of two, rounding upwards', function() {
                assert( Util.nextHighestPowerOfTwo( 0 ) === 1 );
                assert( Util.nextHighestPowerOfTwo( 3 ) === 4 );
                assert( Util.nextHighestPowerOfTwo( 6 ) === 8 );
                assert( Util.nextHighestPowerOfTwo( 129 ) === 256 );
                assert( Util.nextHighestPowerOfTwo( 800 ) === 1024 );
            });
            it('should, if passed a power of two, return the same power of two', function() {
                assert( Util.nextHighestPowerOfTwo( 1 ) === 1 );
                assert( Util.nextHighestPowerOfTwo( 2 ) === 2 );
                assert( Util.nextHighestPowerOfTwo( 32 ) === 32 );
                assert( Util.nextHighestPowerOfTwo( 128 ) === 128 );
                assert( Util.nextHighestPowerOfTwo( 256 ) === 256 );
                assert( Util.nextHighestPowerOfTwo( 1024 ) === 1024 );
            });
        });
    });

}());
