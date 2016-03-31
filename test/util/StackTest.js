(function() {

    'use strict';

    var assert = require('assert');
    var Stack = require( '../../src/util/Stack' );

    describe('Stack', function() {
        describe('#constructor()', function() {
            it('should an empty stack object', function() {
                var s = new Stack();
                assert( s.top() === undefined );
            });
        });
        describe('#push()', function() {
            it('should add data to the top of the stack', function() {
                var s = new Stack();
                s.push( 1 );
                assert( s.top() === 1 );
                s.push( 'test' );
                assert( s.top() === 'test' );
                var obj = {
                    test: 'test'
                };
                s.push( obj );
                assert( s.top() === obj );
            });
        });
        describe('#pop()', function() {
            it('should remove the top element of the stack', function() {
                var s = new Stack();
                s.push( 1 );
                s.push( 'test' );
                assert( s.top() === 'test' );
                s.pop();
                assert( s.top() === 1 );
                s.pop();
            });
            it('should return the popped element', function() {
                var s = new Stack();
                s.push( 1 );
                s.push( 'test' );
                assert( s.pop() === 'test' );
                assert( s.pop() === 1 );
            });
            it('should return undefined if there are no elements on the stack', function() {
                var s = new Stack();
                assert( s.pop() === undefined );
                assert( s.pop() === undefined );
                assert( s.pop() === undefined );
            });
        });
        describe('#top()', function() {
            it('should return the current top of the stack', function() {
                var s = new Stack();
                s.push( 1 );
                s.push( 'test' );
                assert( s.top() === 'test' );
                s.pop();
                assert( s.top() === 1 );
                s.pop();
            });
            it('should return undefined if there are no elements on the stack', function() {
                var s = new Stack();
                assert( s.top() === undefined );
            });
        });
    });

}());
