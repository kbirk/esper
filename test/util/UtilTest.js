(function() {

    'use strict';

    var assert = require('assert');
    var Util = require( '../../src/util/Util' );

    describe('Util', function() {
        describe('#isArrayType()', function() {
            it('should return true argument is of type Array, ArrayBuffer, or ArrayBufferView', function() {
                assert( Util.isArrayType( new Array( 32 ) ) );
                assert( Util.isArrayType( new ArrayBuffer( 32 ) ) );
                assert( Util.isArrayType( new Float32Array( new ArrayBuffer( 32 ) ) ) );
                assert( Util.isArrayType( new Uint32Array( new ArrayBuffer( 32 ) ) ) );
                assert( Util.isArrayType( new Uint8Array( new ArrayBuffer( 32 ) ) ) );
            });
            it('should return false if the argument is not type ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement', function() {
                assert( !Util.isArrayType( undefined ) );
                assert( !Util.isArrayType( null ) );
                assert( !Util.isArrayType( NaN ) );
                assert( !Util.isArrayType( true ) );
                assert( !Util.isArrayType( false ) );
                assert( !Util.isArrayType( 1.23 ) );
                assert( !Util.isArrayType( '12.33' ) );
                assert( !Util.isArrayType( '123' ) );
            });
        });
        describe('#isCanvasType()', function() {
            it('should return true argument is of type ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement', function() {
                assert( Util.isCanvasType( new ImageData() ) );
                assert( Util.isCanvasType( new HTMLImageElement() ) );
                assert( Util.isCanvasType( new HTMLCanvasElement() ) );
                assert( Util.isCanvasType( new HTMLVideoElement() ) );
            });
            it('should return false if the argument is not type ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement', function() {
                assert( !Util.isCanvasType( undefined ) );
                assert( !Util.isCanvasType( null ) );
                assert( !Util.isCanvasType( NaN ) );
                assert( !Util.isCanvasType( true ) );
                assert( !Util.isCanvasType( false ) );
                assert( !Util.isCanvasType( 1.23 ) );
                assert( !Util.isCanvasType( '12.33' ) );
                assert( !Util.isCanvasType( '123' ) );
            });
        });
        describe('#isInteger()', function() {
            it('should return true if the valid is an integer', function() {
                assert( Util.isInteger( 0 ) );
                assert( Util.isInteger( 1 ) );
                assert( Util.isInteger( 123 ) );
                assert( Util.isInteger( -123 ) );
            });
            it('should return false if the valid is not an integer', function() {
                assert( !Util.isInteger( undefined ) );
                assert( !Util.isInteger( null ) );
                assert( !Util.isInteger( NaN ) );
                assert( !Util.isInteger( true ) );
                assert( !Util.isInteger( false ) );
                assert( !Util.isInteger( 1.23 ) );
                assert( !Util.isInteger( '12.33' ) );
                assert( !Util.isInteger( '123' ) );
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
                for ( i=0; i<257; i++ ) {
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
