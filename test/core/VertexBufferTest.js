(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let VertexBuffer = require('../../src/core/VertexBuffer');
    let VertexPackage = require('../../src/core/VertexPackage');
    require('webgl-mock');
    let canvas;
    let gl;

    let bytesPerComponent = 4;
    let positions;
    let normals;
    let uvs;
    let pointers;
    let separate;
    let interleaved;

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
            let maxTriangles = 256;
            let numTriangles = Math.floor( Math.random() * maxTriangles ) + 1;
            let numVertices = numTriangles * 3;
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
                        byteOffset: 0
                    },
                    1: {
                        size: 3,
                        type: 'FLOAT',
                        byteOffset: ( 3 * bytesPerComponent )
                    },
                    2: {
                        size: 2,
                        type: 'FLOAT',
                        byteOffset: ( 3 * bytesPerComponent ) + ( 3 * bytesPerComponent )
                    }
                }
            };
            for ( let i=0; i<numVertices; i++ ) {
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
                        byteOffset: 0
                    },
                    1: {
                        size: 3,
                        type: 'FLOAT',
                        byteOffset: ( positions.length * 3 ) * bytesPerComponent
                    },
                    2: {
                        size: 2,
                        type: 'FLOAT',
                        byteOffset: ( positions.length * 3 ) + ( normals.length * 3 ) * bytesPerComponent
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
                let pkg = new VertexPackage({
                    0: positions,
                    1: normals,
                    2: uvs
                });
                new VertexBuffer( pkg );
            });
            it('should accept a WebGLBuffer and attribute pointers as arguments', function() {
                new VertexBuffer( new WebGLBuffer(), separate.pointers, {
                    byteLength: 4
                });
            });
            it('should throw an exception if WebGLBuffer argument is not complimented with a corresponding `byteLength` option', function() {
                let result = false;
                try {
                    new VertexBuffer( new WebGLBuffer(), separate.pointers );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept an Array and attribute pointers as arguments', function() {
                new VertexBuffer( separate.buffer, separate.pointers );
            });
            it('should accept a numeric byte length and attribute pointers as arguments', function() {
                new VertexBuffer( separate.buffer.length * bytesPerComponent, separate.pointers );
            });
            it('should accept a null value and attribute pointers as arguments', function() {
                new VertexBuffer( null, separate.pointers );
            });
            it('should set byteStride to 0 for a buffer with separate attributes', function() {
                let vb = new VertexBuffer( separate.buffer, separate.pointers );
                assert( vb.byteStride === 0 );
            });
            it('should set byteStride to 0 for a buffer with separate attributes', function() {
                let vb = new VertexBuffer( separate.buffer, separate.pointers );
                assert( vb.byteStride === 0 );
            });
            it('should set byteStride to 0 if given only a single attribute', function() {
                let vb = new VertexBuffer( positions, pointers );
                assert( vb.byteStride === 0 );
            });
            it('should calculate byteStride from an interleaved buffer', function() {
                let vb = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb.byteStride === (( 3 * bytesPerComponent ) + ( 3 * bytesPerComponent ) + ( 2 * bytesPerComponent )) );
            });
            it('should calculate the byteLength from an Array or ArrayBuffer argument', function() {
                let vb0 = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb0.byteLength === interleaved.buffer.length * bytesPerComponent );
                let vb1 = new VertexBuffer( separate.buffer, separate.pointers );
                assert( vb1.byteLength === separate.buffer.length * bytesPerComponent );
            });
            it('should default mode to TRIANGLES', function() {
                let vb = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb.mode === 'TRIANGLES' );
            });
            it('should default `indexOffset` to 0', function() {
                let vb = new VertexBuffer( interleaved.buffer, interleaved.pointers );
                assert( vb.indexOffset === 0 );
            });
            it('should accept `mode`, `count`, and `indexOffset` options for drawing', function() {
                let vb = new VertexBuffer( positions, pointers, {
                    mode: 'POINTS',
                    count: ( positions.length / 3 ) / 2,
                    indexOffset: ( positions.length / 3 ) / 2
                });
                assert( vb.mode === 'POINTS' );
                assert( vb.count === ( positions.length / 3 ) / 2 );
                assert( vb.indexOffset === ( positions.length / 3 ) / 2 );
            });
            it('should throw an exception if attribute pointer indices are invalid ', function() {
                let result = false;
                try {
                    new VertexBuffer( positions, {
                        'invalid': {
                            size: 3,
                            type: 'FLOAT',
                            byteOffset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if attribute pointer size is missing or invalid', function() {
                let result = false;
                try {
                    new VertexBuffer( positions, {
                        0: {
                            size: 12,
                            type: 'FLOAT',
                            byteOffset: 0
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
                            byteOffset: 0
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
                            byteOffset: 0
                        }
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception if attribute pointer type is missing or invalid ', function() {
                let result = false;
                try {
                    new VertexBuffer( positions, {
                        0: {
                            size: 3,
                            type: 'invalid',
                            byteOffset: 0
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
                            byteOffset: 0
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
                let vb = new VertexBuffer( null, pointers );
                vb.bufferData( positions );
            });
            it('should accept an ArrayBufferView argument', function() {
                let vb = new VertexBuffer( null, pointers );
                vb.bufferData( new Float32Array( positions ) );
            });
            it('should accept an ArrayBuffer argument', function() {
                let vb = new VertexBuffer( null, pointers );
                vb.bufferData( new ArrayBuffer( positions.length * bytesPerComponent ) );
            });
            it('should accept numeric byte length argument', function() {
                let vb = new VertexBuffer( null, pointers );
                vb.bufferData( positions.length * bytesPerComponent );
            });
            it('should throw an exception when given an invalid argument', function() {
                let vb = new VertexBuffer( null, pointers );
                let result = false;
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
                let vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                vb.bufferSubData( positions );
            });
            it('should accept an ArrayBufferView argument', function() {
                let vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                vb.bufferSubData( new Float32Array( positions ) );
            });
            it('should accept an ArrayBuffer argument', function() {
                let vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                vb.bind(); // code coverage to ensure next call re-binds after
                vb.bufferSubData( new ArrayBuffer( positions.length ) );
            });
            it('should accept a second numberic byte offset argument', function() {
                let vb = new VertexBuffer( positions.length * bytesPerComponent * 2, pointers );
                vb.bufferSubData( positions, positions.length * bytesPerComponent );
            });
            it('should throw an exception if the buffer has not been initialized', function() {
                let vb = new VertexBuffer( null, pointers );
                let result = false;
                try {
                    vb.bufferSubData( new ArrayBuffer( positions.length * bytesPerComponent ) );
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should throw an exception when given an invalid argument', function() {
                let vb = new VertexBuffer( positions.length * bytesPerComponent, pointers );
                let result = false;
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
            it('should throw an exception when provided byte offset and argument length overflow the buffer size', function() {
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
                let vb = new VertexBuffer( positions, pointers );
                vb.bind();
                vb.unbind();
            });
        });

        describe('#unbind()', function() {
            it('should unbind the attribute pointers', function() {
                let vb = new VertexBuffer( positions, pointers );
                vb.bind();
                vb.unbind();
            });
        });

        describe('#draw()', function() {
            it('should draw the buffer', function() {
                let vb = new VertexBuffer( positions, pointers, {
                    count: ( positions.length / 3 )
                });
                vb.bind();
                vb.draw();
                vb.unbind();
            });
            it('should accept `mode`, `count`, and `byteOffset` overrides', function() {
                let vb = new VertexBuffer( positions, pointers );
                vb.bind();
                vb.draw({
                    mode: 'POINTS',
                    count: ( positions.length / 3 ) / 2,
                    byteOffset: ( positions.length / 3 ) / 2 * bytesPerComponent
                });
                vb.unbind();
            });
            it('should throw an exception if the count is zero', function() {
                let vb = new VertexBuffer( positions, pointers );
                let result = false;
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
        });

    });

}());
