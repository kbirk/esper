(function() {

    'use strict';

    const assert = require('assert');
    const WebGLContext = require('../../src/core/WebGLContext');
    const VertexPackage = require('../../src/core/VertexPackage');
    const VertexBuffer = require('../../src/core/VertexBuffer');
    const IndexBuffer = require('../../src/core/IndexBuffer');
    const Renderable = require('../../src/core/Renderable');
    require('webgl-mock');
    let canvas;
    let gl;
    let positions;
    let normals;
    let uvs;
    let vertexBuffer;
    let indexBuffer;
    let indices;

    const bytesPerComponent = 4;

    describe('Renderable', function() {

        before(function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get(canvas);
        });

        after(function() {
            WebGLContext.remove(canvas);
            canvas = null;
            gl = null;
        });

        beforeEach(function() {
            const maxTriangles = 256;
            const numTriangles = Math.floor(Math.random() * maxTriangles) + 1;
            const numVertices = numTriangles * 3;
            positions = [];
            normals = [];
            uvs = [];
            indices = [];
            for (let i=0; i<numVertices; i++) {
                // separate
                // positions
                positions.push([0, 0, 0]);
                // normals
                normals.push([0, 0, 0]);
                // uvs
                uvs.push([0, 0]);
                // indices
                indices.push(i);
            }
            vertexBuffer = new VertexBuffer(
                new VertexPackage({
                    0: positions,
                    1: normals,
                    2: uvs
                }));
            indexBuffer = new IndexBuffer(indices);
        });

        afterEach(function() {
            positions = null;
            normals = null;
            uvs = null;
            indices = null;
            vertexBuffer = null;
            indexBuffer = null;
        });

        describe('#constructor()', function() {
            it('should accept no arguments', function() {
                new Renderable();
            });
            it('should accept a `vertices` map argument', function() {
                new Renderable({
                    vertices: {
                        0: positions,
                        1: normals,
                        2: uvs
                    }
                });
            });
            it('should accept a complimentary `indices` array argument', function() {
                new Renderable({
                    vertices: {
                        0: positions,
                        1: normals,
                        2: uvs
                    },
                    indices: indices
                });
            });
            it('should accept an existing VertexBuffer argument', function() {
                new Renderable({
                    vertexBuffer: vertexBuffer
                });
            });
            it('should accept an multiple VertexBuffer arguments', function() {
                new Renderable({
                    vertexBuffers: [vertexBuffer]
                });
            });
            it('should accept a complimentary IndexBuffer argument', function() {
                new Renderable({
                    vertexBuffer: vertexBuffer,
                    indexBuffer: indexBuffer
                });
            });
            it('should throw an exception if there is no IndexBuffer and VertexBuffer `counts` do not match', function() {
                let result = false;
                try {
                    new Renderable({
                        vertexBuffers: [
                            new VertexBuffer(null, {
                                0: {
                                    type: 'FLOAT',
                                    size: 3,
                                    count: 36
                                }
                            }, {
                                count: 36
                            }),
                            new VertexBuffer(null, {
                                1: {
                                    type: 'FLOAT',
                                    size: 3,
                                    byteOffset: 36 * 4 * 3
                                }
                            }, {
                                count: 36
                            }),
                            new VertexBuffer(null, {
                                2: {
                                    type: 'FLOAT',
                                    size: 3,
                                    byteOffset: (36 * 4 * 3) * 2
                                }
                            }, {
                                count: 42
                            })
                        ]
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception if contains multiple attribute pointers for the same index', function() {
                let result = false;
                try {
                    new Renderable({
                        vertexBuffers: [
                            vertexBuffer,
                            new VertexBuffer(null, {
                                0: {
                                    type: 'FLOAT',
                                    size: 3
                                }
                            })
                        ],
                        indexBuffer: indexBuffer
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#draw()', function() {
            it('should draw the buffer', function() {
                const renderable = new Renderable({
                    vertexBuffer: vertexBuffer,
                    indexBuffer: indexBuffer
                });
                renderable.draw();
            });
            it('should accept `mode`, `count`, `indexOffset`, and `byteOffset` overrides', function() {
                const renderable = new Renderable({
                    vertexBuffer: vertexBuffer
                });
                renderable.draw({
                    mode: 'POINTS',
                    count: (positions.length / 3) / 2,
                    byteOffset: (positions.length / 3) / 2 * bytesPerComponent,
                    indexOffset: (positions.length / 3) / 2
                });
            });
        });

    });

}());
