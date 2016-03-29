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
            it('should throw exception if `type` of `UNSIGNED_INT` is not supported by extension', function() {
                var check = WebGLContext.checkExtension;
                WebGLContext.checkExtension = function() {
                    return false;
                };
                var result = false;
                try {
                    new IndexBuffer( indices, {
                        type: 'UNSIGNED_INT'
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                WebGLContext.checkExtension = check;
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
            it('should use override provided `type` option to based on ArrayBufferView type', function() {
                try {
                    var ib0 = new IndexBuffer( new Uint32Array( indices ), {
                        type: 'UNSIGNED_SHORT'
                    });
                    assert( ib0.type === 'UNSIGNED_INT' );
                    var ib1 = new IndexBuffer( new Uint16Array( indices ), {
                        type: 'UNSIGNED_INT'
                    });
                    assert( ib1.type === 'UNSIGNED_SHORT' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a numeric byte length argument', function() {
                try {
                    new IndexBuffer( indices.length * shortBytes, {
                        type: 'UNSIGNED_SHORT'
                    });
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
            it('should accept a null value as argument', function() {
                try {
                    new IndexBuffer( null, {
                        type: 'UNSIGNED_INT'
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if a null value is not complimented with a corresponding `type` option', function() {
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
                } catch( err ) {
                    assert( false );
                }
            });
            it('should not overwrite count if count is not zero', function() {
                var ib = new IndexBuffer( indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT',
                    count: indices.length / 2
                });
                ib.bufferData( indices );
                assert( ib.count === indices.length / 2 );
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
            it('should throw an exception if byte length is not multiple of component byte size', function() {
                var ib0 = new IndexBuffer( null, {
                    type: 'UNSIGNED_INT'
                });
                var result = false;
                try {
                    ib0.bufferData( indices.length * intBytes + 1 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                var ib1 = new IndexBuffer( null, {
                    type: 'UNSIGNED_SHORT'
                });
                result = false;
                try {
                    ib1.bufferData( indices.length * shortBytes + 1 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
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

        describe('#bufferSubData()', function() {
            it('should accept an Array argument', function() {
                var ib = new IndexBuffer( indices.length * intBytes, {
                    type: 'UNSIGNED_INT'
                });
                try {
                    ib.bufferSubData( indices );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBufferView argument', function() {
                var ib = new IndexBuffer( indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
                try {
                    ib.bufferSubData( new Uint16Array( indices ) );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBuffer argument', function() {
                var ib = new IndexBuffer( indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
                try {
                    ib.bufferSubData( new ArrayBuffer( indices.length ) );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a second numberic byte offset argument', function() {
                var ib = new IndexBuffer( indices.length * shortBytes * 2, {
                    type: 'UNSIGNED_SHORT'
                });
                try {
                    ib.bufferSubData( indices, indices.length * shortBytes );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if the buffer has not been initialized', function() {
                var ib = new IndexBuffer( null, {
                    type: 'UNSIGNED_SHORT'
                });
                var result = false;
                try {
                    ib.bufferSubData( new ArrayBuffer( indices.length * shortBytes ) );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception when given an invalid argument', function() {
                var ib = new IndexBuffer( indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
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
                var ib = new IndexBuffer( indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
                var result = false;
                try {
                    ib.bufferSubData( indices, 10 * shortBytes );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#draw()', function() {
            it('should draw the buffer', function() {
                var ib = new IndexBuffer( indices );
                ib.draw();
                ib.draw();
            });
            it('should accept mode, count, and offset overrides', function() {
                var ib = new IndexBuffer( indices );
                ib.draw({
                    mode: 'POINTS',
                    count: indices.length / 2,
                    offset: indices.length / 2
                });
            });
            it('should throw an exception if the count is zero', function() {
                var ib = new IndexBuffer( indices );
                var result = false;
                try {
                    ib.draw({
                        count: 0
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the count and offset overflow the buffer', function() {
                var ib = new IndexBuffer( indices );
                var result = false;
                try {
                    ib.draw({
                        count: indices.length,
                        offset: 1
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

    });

}());
