'use strict';

const assert = require('assert');
const WebGLContext = require('../../src/core/WebGLContext');
const TextureCubeMap = require('../../src/core/TextureCubeMap');
const ImageLoader = require('../../src/util/ImageLoader');
require('webgl-mock');

const potImage = new HTMLImageElement(256, 256);
const npotImage = new HTMLImageElement(300, 300);

let _load;
let canvas;
let width;
let height;
let faces;

describe('TextureCubeMap', function() {

	before(function() {
		canvas = new HTMLCanvasElement();
		WebGLContext.get(canvas);
		_load = ImageLoader.load;
		ImageLoader.load = function(opts) {
			setTimeout(function() {
				opts.success(potImage);
			}, 100);
		};
		global.document = {
			createElement: function() {
				return new HTMLCanvasElement();
			}
		};
	});

	after(function() {
		WebGLContext.remove(canvas);
		canvas = null;
		ImageLoader.load = _load;
		global.document = undefined;
	});

	beforeEach(function() {
		const dim = Math.pow(2, Math.floor(Math.random() * 4) + 1);
		const data = new Array(dim * dim * 4);
		for (let i = 0; i<dim * dim * 4; i++) {
			data[i] = 255;
		}
		width = dim;
		height = dim;
		faces = {};
		faces['+x'] = data;
		faces['+y'] = data;
		faces['+z'] = data;
		faces['-x'] = data;
		faces['-y'] = data;
		faces['-z'] = data;
	});

	afterEach(function() {
		width = null;
		height = null;
		faces = null;
	});

	describe('#constructor()', function() {
		it('should be accept a null `faces` argument complimented with `width` and `height` arguments', function() {
			new TextureCubeMap({
				width: width,
				height: height,
				faces: null
			});
		});
		it('should throw an exception if `faces` argument is not complimented with a valid `width` argument', function() {
			let result = false;
			try {
				new TextureCubeMap();
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new TextureCubeMap({
					width: null,
					height: height
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new TextureCubeMap({
					width: -23,
					height: height
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new TextureCubeMap({
					width: 'invalid',
					height: height
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should throw an exception if null `faces` argument is not complimented with a valid `height` argument', function() {
			let result = false;
			try {
				new TextureCubeMap({
					width: width
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new TextureCubeMap({
					width: width,
					height: null
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new TextureCubeMap({
					width: width,
					height: -23
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				new TextureCubeMap({
					width: width,
					height: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should accept a `faces` object argument with URL strings', function(done) {
			new TextureCubeMap({
				faces: {
					'+x': 'path/to/x-pos',
					'+y': 'path/to/y-pos',
					'+z': 'path/to/z-pos',
					'-x': 'path/to/x-neg',
					'-y': 'path/to/y-neg',
					'-z': 'path/to/z-neg'
				}
			}, function() {
				done();
			});
		});
		it('should execute callback function passing an error as first argument if a URL `faces` string results in an error', function(done) {
			const load = ImageLoader.load;
			const err = new Error('error');
			ImageLoader.load = function(opts) {
				setTimeout(function() {
					opts.error(err);
				}, 100);
			};
			// coverage, for no supplied callback branch
			new TextureCubeMap({
				faces: {
					'+x': 'path/to/x-pos',
					'+y': 'path/to/y-pos',
					'+z': 'path/to/z-pos',
					'-x': 'path/to/x-neg',
					'-y': 'path/to/y-neg',
					'-z': 'path/to/z-neg'
				}
			});
			new TextureCubeMap({
				faces: {
					'+x': 'path/to/x-pos',
					'+y': 'path/to/y-pos',
					'+z': 'path/to/z-pos',
					'-x': 'path/to/x-neg',
					'-y': 'path/to/y-neg',
					'-z': 'path/to/z-neg'
				}
			}, function(e) {
				ImageLoader.load = load;
				assert(e === err);
				done();
			});
		});
		it('should accept a `faces` object with canvas type object arguments', function() {
			new TextureCubeMap({
				faces: {
					'+x': potImage,
					'+y': potImage,
					'+z': potImage,
					'-x': potImage,
					'-y': potImage,
					'-z': potImage
				}
			});
		});
		it('should accept non-POT images if POT texture is not required', function() {
			new TextureCubeMap({
				faces: {
					'+x': npotImage,
					'+y': npotImage,
					'+z': npotImage,
					'-x': npotImage,
					'-y': npotImage,
					'-z': npotImage
				},
				mipMap: false,
				wrap: 'CLAMP_TO_EDGE'
			});
		});
		it('should convert non-POT images to POT images if POT texture is required', function() {
			new TextureCubeMap({
				faces: {
					'+x': npotImage,
					'+y': npotImage,
					'+z': npotImage,
					'-x': npotImage,
					'-y': npotImage,
					'-z': npotImage
				}
			});
		});
		it('should accept generic `wrap` and `filter` parameters', function() {
			new TextureCubeMap({
				faces: faces,
				width: width,
				height: height,
				filter: 'LINEAR',
				wrap: 'REPEAT'
			});
		});
		it('should accept `wrapS`, `wrapT`, `minFilter`, and `magFilter` parameters', function() {
			new TextureCubeMap({
				width: width,
				height: height,
				minFilter: 'LINEAR',
				magFilter: 'LINEAR',
				wrapS: 'REPEAT',
				wrapT: 'REPEAT'
			});
		});
		it('should default `wrapS` and `wrapT` parameters to `CLAMP_TO_EDGE`', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			assert(tex.wrapS === 'CLAMP_TO_EDGE');
			assert(tex.wrapT === 'CLAMP_TO_EDGE');
		});
		it('should default `minFilter` and `magFilter` parameters to `LINEAR` with mip-mapping disabled', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height,
				mipMap: false
			});
			assert(tex.minFilter === 'LINEAR');
			assert(tex.magFilter === 'LINEAR');
		});
		it('should default `minFilter` to `LINEAR_MIPMAP_LINEAR` and `magFilter` to `LINEAR` with mip-mapping enabled', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			assert(tex.minFilter === 'LINEAR_MIPMAP_LINEAR');
			assert(tex.magFilter === 'LINEAR');
		});
		it('should accept `mipMap`, `invertY`, and `premultiplyAlpha` boolean parameters`', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height,
				mipMap: false,
				invertY: false,
				premultiplyAlpha: false
			});
			assert(tex.mipMap === false);
			assert(tex.invertY === false);
			assert(tex.premultiplyAlpha === false);
		});
		it('should default `mipMap` to `true`', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			assert(tex.mipMap);
		});
		it('should default `invertY` to `true`', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			assert(tex.invertY);
		});
		it('should default `premultiplyAlpha` to `true`', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			assert(tex.premultiplyAlpha);
		});
		it('should accept `format`, and `type` options`', function() {
			new TextureCubeMap({
				faces: null,
				width: width,
				height: height,
				format: 'RGBA',
				type: 'UNSIGNED_BYTE',
				premultiplyAlpha: false
			});
		});
		it('should default `format` to `RGBA`', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			assert(tex.format === 'RGBA');
		});
		it('should default `type` to `UNSIGNED_BYTE`', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			assert(tex.type === 'UNSIGNED_BYTE');
		});
		it('should throw an exception if the `width` argument is invalid', function() {
			let result = false;
			try {
				new TextureCubeMap({
					width: 'invalid',
					height: height
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should throw an exception if the `height` argument is invalid', function() {
			let result = false;
			try {
				new TextureCubeMap({
					width: 'invalid',
					height: height
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should throw an exception if the `width` and `height` arguments are not equal', function() {
			let result = false;
			try {
				new TextureCubeMap({
					width: width * 2,
					height: height
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should throw an exception if the `width` argument is not a POT and requires being a POT', function() {
			let result = false;
			try {
				new TextureCubeMap({
					width: 123,
					height: 123
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should throw exception if `type` is `FLOAT` but not supported by extension', function() {
			const check = WebGLContext.checkExtension;
			WebGLContext.checkExtension = function() {
				return false;
			};
			let result = false;
			try {
				new TextureCubeMap({
					width: width,
					height: height,
					type: 'FLOAT'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			WebGLContext.checkExtension = check;
		});
	});

	describe('#bufferData()', function() {
		it('should accept a `target` and `data` argument', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', faces['+z']);
		});
		it('should accept a null `data` argument', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', null);
		});
		it('should accept an Array `data` argument', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', faces['+z']);
		});
		it('should cast an Array to the corresponding ArrayBufferView based on the `type`', function() {
			const tex0 = new TextureCubeMap({
				width: width,
				height: height,
				type: 'UNSIGNED_SHORT'
			});
			tex0.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', faces['+z']);
			const tex1 = new TextureCubeMap({
				width: width,
				height: height,
				type: 'UNSIGNED_INT'
			});
			tex1.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', faces['+z']);
			const tex2 = new TextureCubeMap({
				width: width,
				height: height,
				type: 'FLOAT'
			});
			tex2.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', faces['+z']);
		});
		it('should accept a Uint8Array `data` argument', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z',  new Uint8Array(faces['+z']));
		});
		it('should accept a Uint16Array `data` argument', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z',  new Uint16Array(faces['+z']));
		});
		it('should accept a Uint32Array `data` argument', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z',  new Uint32Array(faces['+z']));
		});
		it('should accept a Float32Array `data` argument', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', new Float32Array(faces['+z']));
		});
		it('should throw an exception if the `target` argument is invalid', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			let result = false;
			try {
				tex.bufferData('invalid', faces['+z']);
			} catch(err) {
				result = true;
			}
			assert(result);
		});
		it('should throw an exception if the argument is not an Array, ArrayBuffer, ArrayBufferView, ImageData, HTMLImageElement, HTMLCanvasElement, HTMLVideoElement or null', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			let result = false;
			try {
				tex.bufferData('TEXTURE_CUBE_MAP_POSITIVE_Z', 'invalid');
			} catch(err) {
				result = true;
			}
			assert(result);
		});
	});

	describe('#setParameters()', function() {
		it('should accept `wrap`, `wrapS`, and `wrapT` parameters', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.setParameters({
				wrap: 'CLAMP_TO_EDGE'
			});
			assert(tex.wrapS === 'CLAMP_TO_EDGE');
			assert(tex.wrapT === 'CLAMP_TO_EDGE');
			tex.setParameters({
				wrapS: 'REPEAT',
				wrapT: 'REPEAT'
			});
			assert(tex.wrapS === 'REPEAT');
			assert(tex.wrapT === 'REPEAT');
		});
		it('should accept `filter`, `minFilter`, and `magFilter` parameters', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height,
				mipMap: false
			});
			tex.setParameters({
				filter: 'NEAREST'
			});
			assert(tex.minFilter === 'NEAREST');
			assert(tex.magFilter === 'NEAREST');
			tex.setParameters({
				minFilter: 'LINEAR',
				magFilter: 'LINEAR'
			});
			assert(tex.minFilter === 'LINEAR');
			assert(tex.minFilter === 'LINEAR');
		});
		it('should default `minFilter` suffix to `_MIPMAP_LINEAR` if mip-mapping enabled', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.setParameters({
				filter: 'NEAREST'
			});
			assert(tex.minFilter === 'NEAREST_MIPMAP_LINEAR');
			tex.setParameters({
				minFilter: 'LINEAR'
			});
			assert(tex.minFilter === 'LINEAR_MIPMAP_LINEAR');
		});
		it('should throw an exception if parameter values are invalid', function() {
			let tex = new TextureCubeMap({
				width: width,
				height: height
			});
			let result = false;
			try {
				tex.setParameters({
					filter: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				tex.setParameters({
					minFilter: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			result = false;
			tex = new TextureCubeMap({
				width: width,
				height: height,
				mipMap: false
			});
			try {
				tex.setParameters({
					minFilter: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				tex.setParameters({
					magFilter: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				tex.setParameters({
					wrap: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				tex.setParameters({
					wrapS: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				tex.setParameters({
					wrapT: 'invalid'
				});
			} catch(err) {
				result = true;
			}
			assert(result);
		});
	});

	describe('#bind()', function() {
		it('should bind the texture to a provided unit', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bind(0);
			tex.unbind();
		});
		it('should default unit to 0 if not provided', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bind();
			tex.unbind();
		});
		it('should throw an exception if unit is not valid', function() {
			var tex = new TextureCubeMap({
				width: width,
				height: height
			});
			var result = false;
			try {
				tex.bind('invalid');
			} catch(err) {
				result = true;
			}
			assert(result);
			result = false;
			try {
				tex.bind(-1);
			} catch(err) {
				result = true;
			}
			assert(result);
		});
	});

	describe('#unbind()', function() {
		it('should unbind the texture', function() {
			const tex = new TextureCubeMap({
				width: width,
				height: height
			});
			tex.bind(0);
			tex.unbind();
		});
	});

});
