'use strict';

const WebGLContext = require('./WebGLContext');

/**
 * Bind the viewport to the rendering context.
 * @private
 *
 * @param {Viewport} viewport - The viewport object.
 * @param {Number} width - The width override.
 * @param {Number} height - The height override.
 * @param {Number} x - The horizontal offset override.
 * @param {Number} y - The vertical offset override.
 */
function set(viewport, x, y, width, height) {
	const gl = viewport.gl;
	x = (x !== undefined) ? x : viewport.x;
	y = (y !== undefined) ? y : viewport.y;
	width = (width !== undefined) ? width : viewport.width;
	height = (height !== undefined) ? height : viewport.height;
	gl.viewport(x, y, width, height);
}

/**
 * @class Viewport
 * @classdesc A viewport class for managing WebGL viewports.
 */
class Viewport {

	/**
	 * Instantiates a Viewport object.
	 *
	 * @param {Object} spec - The viewport specification object.
	 * @param {Number} spec.width - The width of the viewport.
	 * @param {Number} spec.height - The height of the viewport.
	 */
	constructor(spec = {}) {
		this.gl = WebGLContext.get();
		this.stack = [];
		// set size
		this.resize(
			spec.width || this.gl.canvas.width,
			spec.height || this.gl.canvas.height);
	}

	/**
	 * Updates the viewports width and height. This resizes the underlying canvas element.
	 *
	 * @param {Number} width - The width of the viewport.
	 * @param {Number} height - The height of the viewport.
	 *
	 * @return {Viewport} The viewport object, for chaining.
	 */
	resize(width = 0, height = 0) {
		if (typeof width !== 'number' || width <= 0) {
			throw `Provided \`width\` of \`${width}\` is invalid`;
		}
		if (typeof height !== 'number' || height <= 0) {
			throw `Provided \`height\` of \`${height}\` is invalid`;
		}
		this.width = width;
		this.height = height;
		this.gl.canvas.width = width;
		this.gl.canvas.height = height;
		return this;
	}

	/**
	 * Sets the viewport dimensions and position. The underlying canvas element is not affected.
	 *
	 * @param {Number} width - The width override.
	 * @param {Number} height - The height override.
	 * @param {Number} x - The horizontal offset override.
	 * @param {Number} y - The vertical offset override.
	 *
	 * @return {Viewport} - The viewport object, for chaining.
	 */
	push(x = 0, y = 0, width = this.width, height = this.height) {
		if (typeof x !== 'number') {
			throw `Provided \`x\` of \`${x}\` is invalid`;
		}
		if (typeof y !== 'number') {
			throw `Provided \`y\` of \`${y}\` is invalid`;
		}
		if (typeof width !== 'number' || width <= 0) {
			throw `Provided \`width\` of \`${width}\` is invalid`;
		}
		if (typeof height !== 'number' || height <= 0) {
			throw `Provided \`height\` of \`${height}\` is invalid`;
		}
		// push onto stack
		this.stack.push({
			x: x,
			y: y,
			width: width,
			height: height
		});
		// set viewport
		set(this, x, y, width, height);
		return this;
	}

	/**
	 * Pops current the viewport object and sets the viewport beneath it.
	 *
	 * @return {Viewport} The viewport object, for chaining.
	 */
	pop() {
		if (this.stack.length === 0) {
			throw 'Viewport stack is empty';
		}
		this.stack.pop();
		if (this.stack.length > 0) {
			const top = this.stack[this.stack.length - 1];
			set(this, top.x, top.y, top.width, top.height);
		} else {
			set(this);
		}
		return this;
	}
}

module.exports = Viewport;
