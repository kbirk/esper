(function() {

    'use strict';

    let assert = require('assert');
    let WebGLContext = require('../../src/core/WebGLContext');
    let VertexPackage = require('../../src/core/VertexPackage');
    let VertexBuffer = require('../../src/core/VertexBuffer');
    let IndexBuffer = require('../../src/core/IndexBuffer');
    let Renderable = require('../../src/core/Renderable');
    require('webgl-mock');
    let canvas;
    let gl;

    let bytesPerComponent = 4;
    let positions;
    let normals;
    let uvs;
    let vertexBuffer;
    let indexBuffer;
    let indices;

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
            let maxTriangles = 256;
            let numTriangles = Math.floor(Math.random() * maxTriangles) + 1;
            let numVertices = numTriangles * 3;
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
                let renderable = new Renderable({
                    vertexBuffer: vertexBuffer,
                    indexBuffer: indexBuffer
                });
                renderable.draw();
            });
            it('should accept `mode`, `count`, `indexOffset`, and `byteOffset` overrides', function() {
                let renderable = new Renderable({
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
