(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var IndexBuffer = require('../../src/core/IndexBuffer');
    require('webgl-mock');
    var canvas;
    var gl;

    var indices;
    var shortBytes = 2;
    var intBytes = 4;

    describe('IndexBuffer', function() {

        before( function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get( canvas );
        });

        after( function() {
            WebGLContext.remove( canvas );
            canvas = null;
            gl = null;
        });

        beforeEach( function() {
            var maxTriangles = 256;
            var numTriangles = Math.floor( Math.random() * maxTriangles ) + 1;
            var numVertices = numTriangles * 3;
            indices = [];
            for ( var i=0; i<numVertices; i++ ) {
                indices.push( 0 );
                indices.push( 0 );
                indices.push( 0 );
            }
        });

        afterEach( function() {
            indices = null;
        });

        describe('#constructor()', function() {
            it('should accept a WebGLBuffer as argument', function() {
                try {
                    new IndexBuffer( new WebGLBuffer(), {
                        byteLength: 4
                    });
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if WebGLBuffer argument is not complimented with a corresponding `byteLength` option', function() {
                var result = false;
                try {
                    new IndexBuffer( new WebGLBuffer() );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept an ArrayBuffer as an argument', function() {
                try {
                    new IndexBuffer( new ArrayBuffer( indices.length * intBytes ), {
                        type: 'UNSIGNED_INT'
                    });
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if ArrayBuffer argument is not complimented with a corresponding `type` option', function() {
                var result = false;
                try {
                    new IndexBuffer( new ArrayBuffer( indices.length * shortBytes ) );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept an Array as argument', function() {
                try {
                    new IndexBuffer( indices );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should cast Array argument using provided `type` option', function() {
                try {
                    var ib0 = new IndexBuffer( indices, {
                        type: 'UNSIGNED_SHORT'
                    });
                    assert( ib0.type === 'UNSIGNED_SHORT' );
                    var ib1 = new IndexBuffer( indices, {
                        type: 'UNSIGNED_INT'
                    });
                    assert( ib1.type === 'UNSIGNED_INT' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should infer `UNSIGNED_SHORT` type from Uint16Array argument', function() {
                try {
                    var ib = new IndexBuffer( new Uint16Array( indices ) );
                    assert( ib.type === 'UNSIGNED_SHORT' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should infer `UNSIGNED_INT` type from Uint32Array argument', function() {
                try {
                    var ib = new IndexBuffer( new Uint32Array( indices ) );
                    assert( ib.type === 'UNSIGNED_INT' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should use provided `type` option to override ArrayBufferView arg type from Uint32Array argument', function() {
                try {
                    var ib = new IndexBuffer( new Uint32Array( indices ) );
                    assert( ib.type === 'UNSIGNED_INT' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a numeric byte length argument', function() {
                try {
                    new IndexBuffer( indices.length * shortBytes, {
                        type: 'UNSIGNED_SHORT'
                    });
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if a numeric byte length argument is not complimented with a corresponding `type` option', function() {
                var result = false;
                try {
                    new IndexBuffer( indices.length * shortBytes );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept a falsey value as argument', function() {
                try {
                    new IndexBuffer( null, {
                        type: 'UNSIGNED_INT'
                    });
                    new IndexBuffer( undefined, {
                        type: 'UNSIGNED_SHORT'
                    });
                    new IndexBuffer( false, {
                        type: 'UNSIGNED_INT'
                    });
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if a falsey value is not complimented with a corresponding `type` option', function() {
                var result = false;
                try {
                    new IndexBuffer( null );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should calculate the byteLength from an Array or ArrayBuffer argument', function() {
                var ib0 = new IndexBuffer( indices, {
                    type: 'UNSIGNED_INT'
                });
                assert( ib0.byteLength === indices.length * intBytes );
                var ib1 = new IndexBuffer( indices, {
                    type: 'UNSIGNED_SHORT'
                });
                assert( ib1.byteLength === indices.length * shortBytes );
            });
        });


        describe('#bufferData()', function() {
            it('should accept an Array argument', function() {
                var ib = new IndexBuffer( null, {
                    type: 'UNSIGNED_INT'
                });
                try {
                    ib.bufferData( indices );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBufferView argument', function() {
                var ib = new IndexBuffer( null, {
                    type: 'UNSIGNED_INT'
                });
                try {
                    ib.bufferData( new Uint32Array( indices ) );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBuffer argument', function() {
                var ib = new IndexBuffer( null, {
                    type: 'UNSIGNED_INT'
                });
                try {
                    ib.bufferData( new ArrayBuffer( indices.length ) );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept numeric length argument', function() {
                var ib = new IndexBuffer( null, {
                    type: 'UNSIGNED_INT'
                });
                try {
                    ib.bufferData( indices.length * intBytes );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should not overwrite count if count is not zero', function() {
                var ib = new IndexBuffer( indices, {
                    count: 200
                });
                ib.bufferData( indices.length );
                assert( ib.count === 200 );
            });
            it('should throw an exception when given an invalid argument', function() {
                var ib = new IndexBuffer( null, {
                    type: 'UNSIGNED_INT'
                });
                var result = false;
                try {
                    ib.bufferData( 'str' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    ib.bufferData( {} );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept mode, count, and offset options for drawing', function() {
                var ib = new IndexBuffer( indices, {
                    mode: 'POINTS',
                    count: indices.length / 2,
                    offset: indices.length / 2
                });
                assert( ib.mode === 'POINTS' );
                assert( ib.count === indices.length / 2 );
                assert( ib.offset === indices.length / 2 );
            });
            it('should throw an exception if count and offset overflows the buffer', function() {
                var result = false;
                try {
                    new IndexBuffer( indices, {
                        mode: 'POINTS',
                        count: indices.length,
                        offset: 1
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        /*
        describe('#bufferSubData()', function() {
            it('should accept an Array argument', function() {
                var ib = new IndexBuffer( positions.length * bytesPerComponent, pointers );
                try {
                    ib.bufferSubData( positions );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBufferView argument', function() {
                var ib = new IndexBuffer( positions.length * bytesPerComponent, pointers );
                try {
                    ib.bufferSubData( new Float32Array( positions ) );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBuffer argument', function() {
                var ib = new IndexBuffer( positions.length * bytesPerComponent, pointers );
                try {
                    ib.bufferSubData( new ArrayBuffer( positions.length ) );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a second numberic byte offset argument', function() {
                var ib = new IndexBuffer( positions.length * bytesPerComponent * 2, pointers );
                try {
                    ib.bufferSubData( positions, positions.length * bytesPerComponent );
                    assert( true );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if the buffer has not been initialized', function() {
                var ib = new IndexBuffer( null, pointers );
                var result = false;
                try {
                    ib.bufferSubData( new ArrayBuffer( positions.length ) );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception when given an invalid argument', function() {
                var ib = new IndexBuffer( positions.length, pointers );
                var result = false;
                try {
                    ib.bufferSubData( 'str' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    ib.bufferData( {} );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception when provided offset and argument length overflow the buffer size', function() {
                var ib = new IndexBuffer( positions.length, pointers );
                var result = false;
                try {
                    ib.bufferSubData( positions, 10 * bytesPerComponent );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });
        */

        /*
        describe('#draw()', function() {
            it('should draw the buffer', function() {
                var ib = new IndexBuffer( positions, pointers );
                ib.bind();
                ib.bind();
                ib.draw();
                ib.unbind();
            });
            it('should accept mode, count, and offset overrides', function() {
                var ib = new IndexBuffer( positions, pointers );
                ib.bind();
                ib.draw({
                    mode: 'POINTS',
                    count: ( positions.length / 3 ) / 2,
                    offset: ( positions.length / 3 ) / 2
                });
                ib.unbind();
            });
            it('should throw an exception if the buffer is not bound', function() {
                var ib = new IndexBuffer( positions, pointers );
                var result = false;
                try {
                    ib.draw();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the count and offset overflow the buffer', function() {
                var ib = new IndexBuffer( positions, pointers );
                var result = false;
                try {
                    ib.bind();
                    ib.draw({
                        count: positions.length,
                        offset: 1
                    });
                    ib.unbind();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });
        */

    });

}());
