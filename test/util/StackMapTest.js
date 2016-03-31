(function() {

    'use strict';

    var assert = require('assert');
    var StackMap = require( '../../src/util/StackMap' );

    describe('StackMap', function() {
        describe('#constructor()', function() {
            it('should an empty stack map object', function() {
                var s = new StackMap();
                assert( s.top() === undefined );
            });
        });
        describe('#push()', function() {
            it('should add data to the top of the stack under the given key', function() {
                var s = new StackMap();
                s.push( 'a', 1 );
                assert( s.top( 'a' ) === 1 );
                s.push( 'b', 'test' );
                assert( s.top( 'b' ) === 'test' );
                var obj = {
                    test: 'test'
                };
                s.push( 'a', obj );
                assert( s.top( 'a' ) === obj );
            });
        });
        describe('#pop()', function() {
            it('should remove the top element of the stack under the given key', function() {
                var s = new StackMap();
                s.push( 0, 1 );
                s.push( 0, 'test' );
                assert( s.top( 0 ) === 'test' );
                s.pop( 0 );
                assert( s.top( 0 ) === 1 );
                s.pop( 0 );
            });
            it('should return the popped element under a given key', function() {
                var s = new StackMap();
                s.push( 'key', 1 );
                s.push( 'key', 'test' );
                assert( s.pop( 'key' ) === 'test' );
                assert( s.pop( 'key' ) === 1 );
            });
            it('should return undefined if there are no elements under the given key', function() {
                var s = new StackMap();
                assert( s.pop( 0 ) === undefined );
                assert( s.pop( 0 ) === undefined );
                assert( s.pop( 0 ) === undefined );
            });
        });
        describe('#top()', function() {
            it('should return the current top of the stack under the given key', function() {
                var s = new StackMap();
                s.push( 'b', 1 );
                s.push( 'b', 'test' );
                assert( s.top( 'b' ) === 'test' );
                s.pop( 'b' );
                assert( s.top( 'b' ) === 1 );
                s.pop( 'b' );
            });
            it('should return undefined if there are no elements under the given key', function() {
                var s = new StackMap();
                assert( s.top( 'b' ) === undefined );
            });
        });
    });

}());
