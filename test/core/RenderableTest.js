(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var VertexPackage = require('../../src/core/VertexPackage');
    var VertexBuffer = require('../../src/core/VertexBuffer');
    var IndexBuffer = require('../../src/core/IndexBuffer');
    var Renderable = require('../../src/core/Renderable');
    require('webgl-mock');
    var canvas;
    var gl;

    var positions;
    var normals;
    var uvs;
    var vertexBuffer;
    var indexBuffer;
    var indices;

    describe('Renderable', function() {

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
            indices = [];
            for ( var i=0; i<numVertices; i++ ) {
                // separate
                // positions
                positions.push([ 0, 0, 0 ]);
                // normals
                normals.push([ 0, 0, 0 ]);
                // uvs
                uvs.push([ 0, 0 ]);
                // indices
                indices.push( i );
            }
            vertexBuffer = new VertexBuffer(
                new VertexPackage({
                    0: positions,
                    1: normals,
                    2: uvs
                })
            );
            indexBuffer = new IndexBuffer( indices );
        });

        afterEach( function() {
            positions = null;
            normals = null;
            uvs = null;
            indices = null;
            vertexBuffer = null;
            indexBuffer = null;
        });

        describe('#constructor()', function() {
            it('should accept no arguments', function() {
                try {
                    new Renderable();
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a `vertices` map argument', function() {
                try {
                    new Renderable({
                        vertices: {
                            0: positions,
                            1: normals,
                            2: uvs
                        }
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a complimentary `indices` array argument', function() {
                try {
                    new Renderable({
                        vertices: {
                            0: positions,
                            1: normals,
                            2: uvs
                        },
                        indices: indices
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an existing VertexBuffer argument', function() {
                try {
                    new Renderable({
                        vertexBuffer: vertexBuffer
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept an multiple VertexBuffer arguments', function() {
                try {
                    new Renderable({
                        vertexBuffers: [ vertexBuffer ]
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept a complimentary IndexBuffer argument', function() {
                try {
                    new Renderable({
                        vertexBuffer: vertexBuffer,
                        indexBuffer: indexBuffer
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should throw an exception if contains multiple attribute pointers for the same index', function() {
                var result = false;
                try {
                    new Renderable({
                        vertexBuffers: [
                            vertexBuffer,
                            new VertexBuffer( null, {
                                0: {
                                    type: 'FLOAT',
                                    size: 3
                                }
                            })
                        ],
                        indexBuffer: indexBuffer
                    });
                } catch( err ) {
                    result = true;
                }
                assert( result );
            });
            it('should accept `mode`, `count`, and `offset` options for drawing', function() {
                var renderable = new Renderable({
                    vertexBuffer: vertexBuffer,
                    mode: 'POINTS',
                    count: ( positions.length / 3 ) / 2,
                    offset: ( positions.length / 3 ) / 2
                });
                assert( renderable.options.mode === 'POINTS' );
                assert( renderable.options.count === ( positions.length / 3 ) / 2 );
                assert( renderable.options.offset === ( positions.length / 3 ) / 2 );
            });
        });

        describe('#draw()', function() {
            it('should draw the buffer', function() {
                var renderable = new Renderable({
                    vertexBuffer: vertexBuffer,
                    indexBuffer: indexBuffer
                });
                renderable.draw();
            });
            it('should accept `mode`, `count`, and `offset` overrides', function() {
                var renderable = new Renderable({
                    vertexBuffer: vertexBuffer
                });
                renderable.draw({
                    mode: 'POINTS',
                    count: ( positions.length / 3 ) / 2,
                    offset: ( positions.length / 3 ) / 2
                });
            });
        });

    });

}());
