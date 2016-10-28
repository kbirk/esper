'use strict';

const assert = require('assert');
const VertexPackage = require('../../src/core/VertexPackage');

describe('VertexPackage', function() {

	describe('#constructor()', function() {
		it('should accept an object of vertex attribute arrays', function() {
			const p = new VertexPackage({
				0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
				1: [[1,1,1], [1,1,1], [1,1,1], [1,1,1]]
			});
			assert(p.buffer.length === 4*3*2);
		});
		it('should accept a single attribute array', function() {
			const p = new VertexPackage({
				0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
			});
			assert(p.buffer.length === 4*3);
		});
		it('should accept no arguments', function() {
			const p = new VertexPackage();
			assert(p.buffer === null);
		});
	});

	describe('#set()', function() {
		it('should build a new buffer and attribute pointers from the new data', function() {
			const p = new VertexPackage({
				0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
			});
			p.set({
				0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
				1: [[1,1,1], [1,1,1], [1,1,1], [1,1,1]]
			});
			assert(p.buffer.length === 4*3*2);
		});
		it('should handle 1 component attributes', function() {
			const p = new VertexPackage({
				0: [[0], [0], [0], [0]]
			});
			assert(p.buffer.length === 4);
		});
		it('should accept 2 component attributes', function() {
			const p = new VertexPackage({
				0: [[0,0], [0,0], [0,0], [0,0]]
			});
			assert(p.buffer.length === 4*2);
		});
		it('should accept 3 component attributes', function() {
			const p = new VertexPackage({
				0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
			});
			assert(p.buffer.length === 4*3);
		});
		it('should accept 4 component attributes', function() {
			const p = new VertexPackage({
				0: [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
			});
			assert(p.buffer.length === 4*4);
		});
		it('should accept non array or vector args for single component attribtues', function() {
			const p0 = new VertexPackage({
				0: [[0], [0], [0], [0]]
			});
			const p1 = new VertexPackage({
				0: [0, 0, 0, 0]
			});
			assert(p0.buffer.length === 4);
			assert(p1.buffer.length === 4);
		});
		it('should accept mixed component attributes', function() {
			const p = new VertexPackage({
				0: [[0], [0], [0], [0]],
				1: [[0,0], [0,0], [0,0], [0,0]],
				2: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
				3: [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
			});
			assert(p.buffer.length === 4 + 4*2 + 4*3 + 4*4);
		});
		it('should accept array attributes', function() {
			const p = new VertexPackage({
				0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
			});
			assert(p.buffer.length === 4*3);
		});
		it('should accept object attributes with x,y,z,w components', function() {
			const p0 = new VertexPackage({
				0: [
					{ x: 0 },
					{ x: 0 },
					{ x: 0 },
					{ x: 0 }
				]
			});
			const p1 = new VertexPackage({
				0: [
					{ x: 0, y: 0 },
					{ x: 0, y: 0 },
					{ x: 0, y: 0 },
					{ x: 0, y: 0 }
				]
			});
			const p2 = new VertexPackage({
				0: [
					{ x: 0, y: 0, z: 0 },
					{ x: 0, y: 0, z: 0 },
					{ x: 0, y: 0, z: 0 },
					{ x: 0, y: 0, z: 0 }
				]
			});
			const p3 = new VertexPackage({
				0: [
					{ x: 0, y: 0, z: 0, w: 0 },
					{ x: 0, y: 0, z: 0, w: 0 },
					{ x: 0, y: 0, z: 0, w: 0 },
					{ x: 0, y: 0, z: 0, w: 0 }
				]
			});
			assert(p0.buffer.length === 4);
			assert(p1.buffer.length === 4*2);
			assert(p2.buffer.length === 4*3);
			assert(p3.buffer.length === 4*4);
		});
		it('should use the element of smallest size when sizing an attribute array', function() {
			const p0 = new VertexPackage({
				0: [[0], [0,0], [0,0,0], [0,0,0,0]]
			});
			const p1 = new VertexPackage({
				0: [
					{ x: 0 },
					{ x: 0, y: 0 },
					{ x: 0, y: 0, z: 0 },
					{ x: 0, y: 0, z: 0, w: 0 }
				]
			});
			assert(p0.buffer.length === 4);
			assert(p1.buffer.length === 4);
		});
		it('should use the attribute of shortest length when sizing the unified array', function() {
			const p = new VertexPackage({
				0: [0, 0, 0, 0, 0, 0, 0],
				1: [0, 0, 0, 0, 0, 0],
				2: [0, 0, 0, 0, 0],
				3: [0, 0, 0],
			});
			assert(p.buffer.length === 3 * 4);
		});
		it('should throw exception on invalid or erroneous attribute values', function() {
			let result = false;
			try {
				new VertexPackage({
					0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
					1: [],
					2: null,
					3: 5,
					sadfasd: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should throw exception on invalid or erroneous attribute indices', function() {
			let result = false;
			try {
				new VertexPackage({
					0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
					'error': [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
				});
			} catch(err) {
				result = true;
			}
			result = false;
			try {
				new VertexPackage({
					0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
					'a3f': [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
				});
			} catch(err) {
				result = true;
			}
			result = false;
			try {
				new VertexPackage({
					0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
					'true': [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new VertexPackage({
					0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
					'1.3': [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new VertexPackage({
					0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
					'-1': [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
	});

	describe('#pointers', function() {
		it('should be all attribute pointers, as an object, keyed by the attribute index', function() {
			const p = new VertexPackage({
				0: [[0], [0], [0], [0]],
				1: [[0,0], [0,0], [0,0], [0,0]],
				2: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
				3: [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
			});
			const bytesPerComponent = 4;
			const pointers = p.pointers;
			const type = 'FLOAT';
			// first
			assert(pointers[0].size === 1);
			assert(pointers[0].type === type);
			assert(pointers[0].byteOffset === 0);
			// second
			assert(pointers[1].size === 2);
			assert(pointers[1].type === type);
			assert(pointers[1].byteOffset === 1 * bytesPerComponent);
			// third
			assert(pointers[2].size === 3);
			assert(pointers[2].type === type);
			assert(pointers[2].byteOffset === (1 + 2) * bytesPerComponent);
			// fourth
			assert(pointers[3].size === 4);
			assert(pointers[3].type === type);
			assert(pointers[3].byteOffset === (1 + 2 + 3) * bytesPerComponent);
		});
		it('should be an empty object if no data as been set', function() {
			const p = new VertexPackage();
			assert(Object.keys(p.pointers).length === 0);
		});
	});

	describe('#buffer', function() {
		it('should be a Float32Array', function() {
			const p0 = new VertexPackage({
				0: [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
				1: [[1,1,1], [1,1,1], [1,1,1], [1,1,1]]
			});
			assert(p0.buffer instanceof Float32Array);
		});
		it('should be the interleaved vertex attributes', function() {
			const p = new VertexPackage({
				0: [[0,0,0], [2,2,2], [4,4,4], [6,6,6]],
				1: [[1,1,1], [3,3,3], [5,5,5], [7,7,7]]
			});
			const buffer = p.buffer;
			for (let i=0; i<buffer.length; i++) {
				assert(buffer[i] === Math.floor(i/3));
			}
		});
		it('should be null if no data has been set', function() {
			const p = new VertexPackage();
			assert(p.buffer === null);
		});
	});
});
