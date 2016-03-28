(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var VertexBuffer = require('../../src/core/VertexBuffer');
    var VertexPackage = require('../../src/core/VertexPackage');
    require('webgl-mock');
    var canvas;
    var gl;

    var bytesPerComponent = 4;
    var positions;
    var normals;
    var uvs;
    var pointers;
    var separate;
    var interleaved;

    describe('VertexBuffer', function() {

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
            positions = [];
            normals = [];
            uvs = [];
            pointers = {
                0: {
                    size: 3,
                    type: 'FLOAT'
                }
            };
            interleaved = {
                buffer: [],
                pointers: {
                    0: {
                        size: 3,
                        type: 'FLOAT',
                        offset: 0
                    },
                    1: {
                        size: 3,
                        type: 'FLOAT',
                        offset: ( 3 * bytesPerComponent )
                    },
                    2: {
                        size: 2,
                        type: 'FLOAT',
                        offset: ( 3 * bytesPerComponent ) + ( 3 * bytesPerComponent )
                    }
                }
            };
            for ( var i=0; i<numVertices; i++ ) {
                // separate
                // positions
                positions.push( 0 );
                positions.push( 0 );
                positions.push( 0 );
                // normals
                normals.push( 0 );
                normals.push( 0 );
                normals.push( 0 );
                // uvs
                uvs.push( 0 );
                uvs.push( 0 );
                // interleaved
                // pos
                interleaved.buffer.push( 0 );
                interleaved.buffer.push( 0 );
                interleaved.buffer.push( 0 );
                // normal
                interleaved.buffer.push( 0 );
                interleaved.buffer.push( 0 );
                interleaved.buffer.push( 0 );
                // uv
                interleaved.buffer.push( 0 );
                interleaved.buffer.push( 0 );
            }
            separate = {
                buffer: positions.concat( normals ).concat( uvs ),
                pointers: {
                    0: {
                        size: 3,
                        type: 'FLOAT',
                        offset: 0
                    },
                    1: {
                        size: 3,
                        type: 'FLOAT',
                        offset: ( positions.length * 3 )
                    },
                    2: {
                        size: 2,
                        type: 'FLOAT',
                        offset: ( positions.length * 3 ) + ( normals.length * 3 )
                    }
                }
            };
        });

        afterEach( function() {
            positions = null;
            normals = null;
            uvs = null;
            pointers = null;
            separate = null;
            interleaved = null;
        });

        describe('#constructor()', function() {
            it('should accept a VertexPackage as an argument', function() {
                var pkg = new VertexPackage({
                    0: positions,
                    1: normals,
                    2: uvs
                });
                try {
                    new VertexBuffer( pkg );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a WebGLBuffer and attribute pointers as arguments', function() {
                try {
                    new VertexBuffer( new WebGLBuffer(), separate.pointers, {
                        byteLength: 4
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if WebGLBuffer argument is not complimented with a corresponding `byteLength` option', function() {
                var result = false;
                try {
                    new VertexBuffer( new WebGLBuffer(), separate.pointers );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept an Array and attribute pointers as arguments', function() {
                try {
                    new VertexBuffer( separate.buffer, separate.pointers );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a numeric byte length and attribute pointers as arguments', function() {
                try {
                    new VertexBuffer( separate.buffer.length * bytesPerComponent, separate.pointers );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a falsey value and attribute pointers as arguments', function() {
                try {
                    new VertexBuffer( null, separate.pointers );
                    new VertexBuffer( undefined, separate.pointers );
                    new VertexBuffer( false, separate.pointers );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should set stride to 0 for a buffer with separate attributes', function() {
                var vb = new VertexBuffer( separate.buffer, separate.pointers );
                assert( vb.stride === 0 );
            });
            it('should set stride to 0 for a buffer with separate attributes', function() {
                var vb = new VertexBuffer( separate.buffer, separate.pointers );
                assert( vb.stride === 0 );
            });
            it('should set stride to 0 if given only a single attribute', function() {
                var vb = new VertexBuffer( positions, pointers );
                assert( vb.stride === 0 );
            });
            it('should calculate stride from an interleaved buffer', function() {
                var vb = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb.stride === (( 3 * bytesPerComponent ) + ( 3 * bytesPerComponent ) + ( 2 * bytesPerComponent )) );
            });
            it('should calculate the byteLength from an Array or ArrayBuffer argument', function() {
                var vb0 = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb0.byteLength === interleaved.buffer.length * bytesPerComponent );
                var vb1 = new VertexBuffer( separate.buffer, separate.pointers );
                assert( vb1.byteLength === separate.buffer.length * bytesPerComponent );
            });
            it('should default mode to TRIANGLES', function() {
                var vb = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb.mode === 'TRIANGLES' );
            });
            it('should default offset to 0', function() {
                var vb = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb.offset === 0 );
            });
            it('should default count to length of the attribute arrays, or 0', function() {
                var vb0 = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb0.count === ( positions.length / 3 ) );
                var vb1 = new VertexBuffer( null, pointers );
                assert( vb1.count === 0 );
            });
            it('should accept `mode`, `count`, and `offset` options for drawing', function() {
                var vb = new VertexBuffer( positions, pointers, {
                    mode: 'POINTS',
                    count: ( positions.length / 3 ) / 2,
                    offset: ( positions.length / 3 ) / 2
                });
                assert( vb.mode === 'POINTS' );
                assert( vb.count === ( positions.length / 3 ) / 2 );
                assert( vb.offset === ( positions.length / 3 ) / 2 );
            });
            it('should throw an exception if count + offset overflows the buffer', function() {
                var result = false;
                try {
                    new VertexBuffer( positions, pointers, {
                        count: positions.length / 3,
                        offset: 1
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if no attribute pointers are provided', function() {
                var result = false;
                try {
                    new VertexBuffer( interleaved.buffer );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if no attribute pointer indices are invalid ', function() {
                var result = false;
                try {
                    new VertexBuffer( positions, {
                        'invalid': {
                            size: 3,
                            type: 'FLOAT',
                            offset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if attribute pointer size is missing or invalid', function() {
                var result = false;
                try {
                    new VertexBuffer( positions, {
                        0: {
                            size: 12,
                            type: 'FLOAT',
                            offset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new VertexBuffer( positions, {
                        0: {
                            size: 'str',
                            type: 'FLOAT',
                            offset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new VertexBuffer( positions, {
                        0: {
                            type: 'FLOAT',
                            offset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if attribute pointer type is missing or invalid ', function() {
                var result = false;
                try {
                    new VertexBuffer( positions, {
                        0: {
                            size: 3,
                            type: 'invalid',
                            offset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    new VertexBuffer( positions, {
                        0: {
                            size: 3,
                            offset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#bufferData()', function() {
            it('should accept an Array argument', function() {
                var vb = new VertexBuffer( null, pointers );
                try {
                    vb.bufferData( positions );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBufferView argument', function() {
                var vb = new VertexBuffer( null, pointers );
                try {
                    vb.bufferData( new Float32Array( positions ) );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBuffer argument', function() {
                var vb = new VertexBuffer( null, pointers );
                try {
                    vb.bufferData( new ArrayBuffer( positions.length ) );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept numeric byte length argument', function() {
                var vb = new VertexBuffer( null, pointers );
                try {
                    vb.bufferData( positions.length * bytesPerComponent );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if byte length is not multiple of component byte size', function() {
                var vb = new VertexBuffer( null, pointers );
                var result = false;
                try {
                    vb.bufferData( positions.length * bytesPerComponent + 1 );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should not overwrite count if count is not zero', function() {
                var vb = new VertexBuffer( positions.length * bytesPerComponent, pointers, {
                    count: ( positions.length / 3 ) / 2
                });
                vb.bufferData( positions );
                assert( vb.count === ( positions.length / 3 ) / 2 );
            });
            it('should throw an exception when given an invalid argument', function() {
                var vb = new VertexBuffer( null, pointers );
                var result = false;
                try {
                    vb.bufferData( 'str' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    vb.bufferData( {} );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#bufferSubData()', function() {
            it('should accept an Array argument', function() {
                var vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                try {
                    vb.bufferSubData( positions );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBufferView argument', function() {
                var vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                try {
                    vb.bufferSubData( new Float32Array( positions ) );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an ArrayBuffer argument', function() {
                var vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                try {
                    vb.bufferSubData( new ArrayBuffer( positions.length ) );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a second numberic byte offset argument', function() {
                var vb = new VertexBuffer( positions.length * bytesPerComponent * 2, pointers );
                try {
                    vb.bufferSubData( positions, positions.length * bytesPerComponent );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if the buffer has not been initialized', function() {
                var vb = new VertexBuffer( null, pointers );
                var result = false;
                try {
                    vb.bufferSubData( new ArrayBuffer( positions.length * bytesPerComponent ) );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception when given an invalid argument', function() {
                var vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                var result = false;
                try {
                    vb.bufferSubData( 'str' );
                } catch( err ) {
                    result = true;
                }
                assert( result );
                result = false;
                try {
                    vb.bufferData( {} );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception when provided offset and argument length overflow the buffer size', function() {
                var vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                var result = false;
                try {
                    vb.bufferSubData( positions, 10 * bytesPerComponent );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

        describe('#bind()', function() {
            it('should bind the attribute pointers', function() {
                var vb = new VertexBuffer( positions, pointers );
                vb.bind();
                vb.unbind();
            });
        });

        describe('#unbind()', function() {
            it('should unbind the attribute pointers', function() {
                var vb0 = new VertexBuffer( positions, pointers );
                var vb1 = new VertexBuffer( positions, pointers );
                vb0.bind();
                vb1.bind();
                vb0.unbind();
                vb1.unbind();
            });
        });

        describe('#draw()', function() {
            it('should draw the buffer', function() {
                var vb = new VertexBuffer( positions, pointers );
                vb.bind();
                vb.bind();
                vb.draw();
                vb.unbind();
            });
            it('should accept `mode`, `count`, and `offset` overrides', function() {
                var vb = new VertexBuffer( positions, pointers );
                vb.bind();
                vb.draw({
                    mode: 'POINTS',
                    count: ( positions.length / 3 ) / 2,
                    offset: ( positions.length / 3 ) / 2
                });
                vb.unbind();
            });
            it('should throw an exception if the buffer is not bound', function() {
                var vb = new VertexBuffer( positions, pointers );
                var result = false;
                try {
                    vb.draw();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if the count is zero', function() {
                var vb = new VertexBuffer( positions, pointers );
                var result = false;
                try {
                    vb.bind();
                    vb.draw({
                        count: 0
                    });
                } catch( err ) {
                    result = true;
                }
                vb.unbind();
                assert( result );
            });
            it('should throw an exception if the count and offset overflow the buffer', function() {
                var vb = new VertexBuffer( positions, pointers );
                var result = false;
                try {
                    vb.bind();
                    vb.draw({
                        count: positions.length,
                        offset: 1
                    });
                    vb.unbind();
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
        });

    });

}());
