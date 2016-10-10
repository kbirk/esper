(function() {

    'use strict';

    const assert = require('assert');
    const WebGLContext = require('../../src/core/WebGLContext');
    const IndexBuffer = require('../../src/core/IndexBuffer');
    require('webgl-mock');

    const shortBytes = 2;
    const intBytes = 4;

    let canvas;
    let gl;
    let indices;

    describe('IndexBuffer', function() {

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
            const maxTriangles = 64;
            const numTriangles = Math.floor(Math.random() * maxTriangles) + 1;
            const numVertices = numTriangles * 3;
            indices = [];
            for (let i=0; i<numVertices; i++) {
                indices.push(0);
                indices.push(0);
                indices.push(0);
            }
        });

        afterEach(function() {
            indices = null;
        });

        describe('#constructor()', function() {
            it('should accept a WebGLBuffer as argument', function() {
                new IndexBuffer(new WebGLBuffer(), {
                    byteLength: 4
                });
            });
            it('should throw an exception if WebGLBuffer argument is not complimented with a corresponding `byteLength` option', function() {
                let result = false;
                try {
                    new IndexBuffer(new WebGLBuffer());
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should accept an ArrayBuffer as an argument', function() {
                new IndexBuffer(new ArrayBuffer(indices.length * intBytes), {
                    type: 'UNSIGNED_INT'
                });
            });
            it('should throw an exception if ArrayBuffer argument is not complimented with a corresponding `type` option', function() {
                let result = false;
                try {
                    new IndexBuffer(new ArrayBuffer(indices.length * shortBytes));
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should accept an Array as argument', function() {
                new IndexBuffer(indices);
            });
            it('should throw exception if `type` of `UNSIGNED_INT` is not supported by extension', function() {
                const check = WebGLContext.checkExtension;
                WebGLContext.checkExtension = function() {
                    return false;
                };
                let result = false;
                try {
                    new IndexBuffer(indices, {
                        type: 'UNSIGNED_INT'
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
                WebGLContext.checkExtension = check;
            });
            it('should infer `UNSIGNED_BYTE` type from Uint8Array argument', function() {
                const ib = new IndexBuffer(new Uint8Array(indices));
                assert(ib.type === 'UNSIGNED_BYTE');
            });
            it('should infer `UNSIGNED_SHORT` type from Uint16Array argument', function() {
                const ib = new IndexBuffer(new Uint16Array(indices));
                assert(ib.type === 'UNSIGNED_SHORT');
            });
            it('should infer `UNSIGNED_INT` type from Uint32Array argument', function() {
                const ib = new IndexBuffer(new Uint32Array(indices));
                assert(ib.type === 'UNSIGNED_INT');
            });
            it('should ignore the provided `type` option if provided an ArrayBufferView type', function() {
                const ib0 = new IndexBuffer(new Uint32Array(indices), {
                    type: 'UNSIGNED_SHORT'
                });
                assert(ib0.type === 'UNSIGNED_INT');
                const ib1 = new IndexBuffer(new Uint16Array(indices), {
                    type: 'UNSIGNED_INT'
                });
                assert(ib1.type === 'UNSIGNED_SHORT');
                const ib2 = new IndexBuffer(new Uint8Array(indices), {
                    type: 'UNSIGNED_BYTE'
                });
                assert(ib2.type === 'UNSIGNED_BYTE');
            });
            it('should accept a numeric byte length argument', function() {
                new IndexBuffer(indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
            });
            it('should throw an exception if a numeric byte length argument is not complimented with a corresponding `type` option', function() {
                let result = false;
                try {
                    new IndexBuffer(indices.length * shortBytes);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should accept a null value as argument', function() {
                new IndexBuffer(null, {
                    type: 'UNSIGNED_INT'
                });
            });
            it('should throw an exception if a null value is not complimented with a corresponding `type` option', function() {
                let result = false;
                try {
                    new IndexBuffer(null);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should calculate the byteLength from an Array or ArrayBuffer argument', function() {
                const ib0 = new IndexBuffer(indices, {
                    type: 'UNSIGNED_INT'
                });
                assert(ib0.byteLength === indices.length * intBytes);
                const ib1 = new IndexBuffer(indices, {
                    type: 'UNSIGNED_SHORT'
                });
                assert(ib1.byteLength === indices.length * shortBytes);
            });
        });

        describe('#bufferData()', function() {
            it('should accept an Array argument', function() {
                const ib = new IndexBuffer(null, {
                    type: 'UNSIGNED_INT'
                });
                ib.bufferData(indices);
            });
            it('should accept an ArrayBufferView argument', function() {
                const ib = new IndexBuffer(null, {
                    type: 'UNSIGNED_INT'
                });
                ib.bufferData(new Uint32Array(indices));
            });
            it('should accept an ArrayBuffer argument', function() {
                const ib = new IndexBuffer(null, {
                    type: 'UNSIGNED_INT'
                });
                ib.bufferData(new ArrayBuffer(indices.length));
            });
            it('should accept numeric length argument', function() {
                const ib = new IndexBuffer(null, {
                    type: 'UNSIGNED_INT'
                });
                ib.bufferData(indices.length * intBytes);
            });
            it('should cast Array argument using provided `type` option', function() {
                const ib0 = new IndexBuffer(null, {
                    type: 'UNSIGNED_BYTE'
                });
                ib0.bufferData(indices);
                assert(ib0.type === 'UNSIGNED_BYTE');
                const ib1 = new IndexBuffer(null, {
                    type: 'UNSIGNED_SHORT'
                });
                ib1.bufferData(indices);
                assert(ib1.type === 'UNSIGNED_SHORT');
                const ib2 = new IndexBuffer(null, {
                    type: 'UNSIGNED_INT'
                });
                ib2.bufferData(indices);
                assert(ib2.type === 'UNSIGNED_INT');
            });
            it('should not overwrite count if count is not zero', function() {
                const ib = new IndexBuffer(indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT',
                    count: indices.length / 2
                });
                ib.bufferData(indices);
                assert(ib.count === indices.length / 2);
            });
            it('should throw an exception when given an invalid argument', function() {
                const ib = new IndexBuffer(null, {
                    type: 'UNSIGNED_INT'
                });
                let result = false;
                try {
                    ib.bufferData('str');
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    ib.bufferData({});
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should accept `mode`, `count`, and `byteOffset` options for drawing', function() {
                const ib = new IndexBuffer(indices, {
                    mode: 'POINTS',
                    count: indices.length / 2,
                    byteOffset: indices.length / 2 * shortBytes
                });
                assert(ib.mode === 'POINTS');
                assert(ib.count === indices.length / 2);
                assert(ib.byteOffset === indices.length / 2 * shortBytes);
            });
        });

        describe('#bufferSubData()', function() {
            it('should accept an Array argument', function() {
                const ib = new IndexBuffer(indices.length * intBytes, {
                    type: 'UNSIGNED_INT'
                });
                ib.bufferSubData(indices);
            });
            it('should accept an ArrayBufferView argument', function() {
                const ib = new IndexBuffer(indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
                ib.bufferSubData(new Uint16Array(indices));
            });
            it('should accept an ArrayBuffer argument', function() {
                const ib = new IndexBuffer(indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
                ib.bufferSubData(new ArrayBuffer(indices.length));
            });
            it('should accept a second numberic byte offset argument', function() {
                const ib = new IndexBuffer(indices.length * shortBytes * 2, {
                    type: 'UNSIGNED_SHORT'
                });
                ib.bufferSubData(indices, indices.length * shortBytes);
            });
            it('should cast Array argument using provided `type` option', function() {
                const ib0 = new IndexBuffer(indices, {
                    type: 'UNSIGNED_BYTE'
                });
                ib0.bufferSubData(indices);
                assert(ib0.type === 'UNSIGNED_BYTE');
                const ib1 = new IndexBuffer(indices, {
                    type: 'UNSIGNED_SHORT'
                });
                ib1.bufferSubData(indices);
                assert(ib1.type === 'UNSIGNED_SHORT');
                const ib2 = new IndexBuffer(indices, {
                    type: 'UNSIGNED_INT'
                });
                ib2.bufferSubData(indices);
                assert(ib2.type === 'UNSIGNED_INT');
            });
            it('should throw an exception if the buffer has not been initialized', function() {
                const ib = new IndexBuffer(null, {
                    type: 'UNSIGNED_SHORT'
                });
                let result = false;
                try {
                    ib.bufferSubData(new ArrayBuffer(indices.length * shortBytes));
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception when given an invalid argument', function() {
                const ib = new IndexBuffer(indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
                let result = false;
                try {
                    ib.bufferSubData('str');
                } catch(err) {
                    result = true;
                }
                assert(result);
                result = false;
                try {
                    ib.bufferData({});
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
            it('should throw an exception when provided byte offset and argument length overflow the buffer size', function() {
                const ib = new IndexBuffer(indices.length * shortBytes, {
                    type: 'UNSIGNED_SHORT'
                });
                let result = false;
                try {
                    ib.bufferSubData(indices, 10 * shortBytes);
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

        describe('#draw()', function() {
            it('should draw the buffer', function() {
                const ib = new IndexBuffer(indices);
                ib.draw();
                ib.draw();
            });
            it('should accept `mode`, `count`, and `byteOffset` overrides', function() {
                const ib = new IndexBuffer(indices);
                ib.draw({
                    mode: 'POINTS',
                    count: indices.length / 2,
                    byteOffset: indices.length / 2 * shortBytes
                });
            });
            it('should throw an exception if the count is zero', function() {
                const ib = new IndexBuffer(indices);
                let result = false;
                try {
                    ib.draw({
                        count: 0
                    });
                } catch(err) {
                    result = true;
                }
                assert(result);
            });
        });

    });

}());
