'use strict';

const WebGLContext = require('./WebGLContext');

const TEXTURE_TARGETS = {
	TEXTURE_2D: true,
	TEXTURE_CUBE_MAP: true
};
const DEPTH_FORMATS = {
	DEPTH_COMPONENT: true,
	DEPTH_STENCIL: true
};

/**
 * @class RenderTarget
 * @classdesc A renderTarget class to allow rendering to textures.
 */
class RenderTarget {

	/**
	 * Instantiates a RenderTarget object.
	 */
	 constructor() {
		this.gl = WebGLContext.get();
		this.framebuffer = this.gl.createFramebuffer();
		this.textures = new Map();
	}

	/**
	 * Binds the renderTarget object.
	 *
	 * @return {RenderTarget} The renderTarget object, for chaining.
	 */
	bind() {
		// bind framebuffer
		const gl = this.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		return this;
	}

	/**
	 * Unbinds the renderTarget object.
	 *
	 * @return {RenderTarget} The renderTarget object, for chaining.
	 */
	unbind() {
		// unbind framebuffer
		const gl = this.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return this;
	}

	/**
	 * Attaches the provided texture to the provided attachment location.
	 *
	 * @param {Texture2D} texture - The texture to attach.
	 * @param {Number} index - The attachment index. (optional)
	 * @param {String} target - The texture target type. (optional)
	 *
	 * @return {RenderTarget} The renderTarget object, for chaining.
	 */
	setColorTarget(texture, index, target) {
		const gl = this.gl;
		if (!texture) {
			throw 'Texture argument is missing';
		}
		if (TEXTURE_TARGETS[index] && target === undefined) {
			target = index;
			index = 0;
		}
		if (index === undefined) {
			index = 0;
		} else if (!Number.isInteger(index) || index < 0) {
			throw 'Texture color attachment index is invalid';
		}
		if (target && !TEXTURE_TARGETS[target]) {
			throw 'Texture target is invalid';
		}
		this.textures.set(`color_${index}`, texture);
		this.bind();
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl['COLOR_ATTACHMENT' + index],
			gl[target || 'TEXTURE_2D'],
			texture.texture,
			0);
		this.unbind();
		return this;
	}

	/**
	 * Attaches the provided texture to the provided attachment location.
	 *
	 * @param {Texture2D} texture - The texture to attach.
	 *
	 * @return {RenderTarget} The renderTarget object, for chaining.
	 */
	setDepthTarget(texture) {
		if (!texture) {
			throw 'Texture argument is missing';
		}
		if (!DEPTH_FORMATS[texture.format]) {
			throw 'Provided texture is not of format `DEPTH_COMPONENT` or `DEPTH_STENCIL`';
		}
		const gl = this.gl;
		this.textures.set('depth', texture);
		this.bind();
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.DEPTH_ATTACHMENT,
			gl.TEXTURE_2D,
			texture.texture,
			0);
		this.unbind();
		return this;
	}

	/**
	 * Resizes the renderTarget and all attached textures by the provided height and width.
	 *
	 * @param {Number} width - The new width of the renderTarget.
	 * @param {Number} height - The new height of the renderTarget.
	 *
	 * @return {RenderTarget} The renderTarget object, for chaining.
	 */
	resize(width, height) {
		if (typeof width !== 'number' || (width <= 0)) {
			throw `Provided \`width\` of ${width} is invalid`;
		}
		if (typeof height !== 'number' || (height <= 0)) {
			throw `Provided \`height\` of ${height} is invalid`;
		}
		this.textures.forEach(texture => {
			texture.resize(width, height);
		});
		return this;
	}
}

module.exports = RenderTarget;
