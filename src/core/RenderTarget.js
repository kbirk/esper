(function () {

    'use strict';

    let WebGLContext = require('./WebGLContext');
    let WebGLContextState = require('./WebGLContextState');

    let TEXTURE_TARGETS = {
        TEXTURE_2D: true,
        TEXTURE_CUBE_MAP: true
    };

    let DEPTH_FORMATS = {
        DEPTH_COMPONENT: true,
        DEPTH_STENCIL: true
    };


    class RenderTarget {

        /**
         * Instantiates a RenderTarget object.
         * @class RenderTarget
         * @classdesc A renderTarget class to allow rendering to textures.
         */
         constructor() {
            let gl = this.gl = WebGLContext.get();
            this.state = WebGLContextState.get( gl );
            this.framebuffer = gl.createFramebuffer();
            this.textures = {};
        }

        /**
         * Binds the renderTarget object and pushes it to the front of the stack.
         * @memberof RenderTarget
         *
         * @returns {RenderTarget} - The renderTarget object, for chaining.
         */
         push() {
            if ( this.state.renderTargets.top() !== this ) {
                let gl = this.gl;
                gl.bindFramebuffer( gl.FRAMEBUFFER, this.framebuffer );
            }
            this.state.renderTargets.push( this );
            return this;
        }

        /**
         * Unbinds the renderTarget object and binds the renderTarget beneath it on this stack. If there is no underlying renderTarget, bind the backbuffer.
         * @memberof RenderTarget
         *
         * @returns {RenderTarget} - The renderTarget object, for chaining.
         */
        pop() {
            let state = this.state;
            // if there is no render target bound, exit early
            if ( state.renderTargets.top() !== this ) {
                throw 'The current render target is not the top most element on the stack';
            }
            state.renderTargets.pop();
            let top = state.renderTargets.top();
            let gl;
            if ( top ) {
                gl = top.gl;
                gl.bindFramebuffer( gl.FRAMEBUFFER, top.framebuffer );
            } else {
                gl = this.gl;
                gl.bindFramebuffer( gl.FRAMEBUFFER, null );
            }
            return this;
        }

        /**
         * Attaches the provided texture to the provided attachment location.
         * @memberof RenderTarget
         *
         * @param {Texture2D} texture - The texture to attach.
         * @param {number} index - The attachment index. (optional)
         * @param {String} target - The texture target type. (optional)
         *
         * @returns {RenderTarget} - The renderTarget object, for chaining.
         */
        setColorTarget( texture, index, target ) {
            let gl = this.gl;
            if ( !texture ) {
                throw 'Texture argument is missing';
            }
            if ( TEXTURE_TARGETS[ index ] && target === undefined ) {
                target = index;
                index = 0;
            }
            if ( index === undefined ) {
                index = 0;
            } else if ( !Number.isInteger( index ) || index < 0 ) {
                throw 'Texture color attachment index is invalid';
            }
            if ( target && !TEXTURE_TARGETS[ target ] ) {
                throw 'Texture target is invalid';
            }
            this.textures[ 'color' + index ] = texture;
            this.push();
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl[ 'COLOR_ATTACHMENT' + index ],
                gl[ target || 'TEXTURE_2D' ],
                texture.texture,
                0 );
            this.pop();
            return this;
        }

        /**
         * Attaches the provided texture to the provided attachment location.
         * @memberof RenderTarget
         *
         * @param {Texture2D} texture - The texture to attach.
         *
         * @returns {RenderTarget} - The renderTarget object, for chaining.
         */
        setDepthTarget( texture ) {
            if ( !texture ) {
                throw 'Texture argument is missing';
            }
            if ( !DEPTH_FORMATS[ texture.format ] ) {
                throw 'Provided texture is not of format `DEPTH_COMPONENT` or `DEPTH_STENCIL`';
            }
            let gl = this.gl;
            this.textures.depth = texture;
            this.push();
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.DEPTH_ATTACHMENT,
                gl.TEXTURE_2D,
                texture.texture,
                0 );
            this.pop();
            return this;
        }

        /**
         * Resizes the renderTarget and all attached textures by the provided height and width.
         * @memberof RenderTarget
         *
         * @param {number} width - The new width of the renderTarget.
         * @param {number} height - The new height of the renderTarget.
         *
         * @returns {RenderTarget} - The renderTarget object, for chaining.
         */
        resize( width, height ) {
            if ( typeof width !== 'number' || ( width <= 0 ) ) {
                throw 'Provided `width` of ' + width + ' is invalid';
            }
            if ( typeof height !== 'number' || ( height <= 0 ) ) {
                throw 'Provided `height` of ' + height + ' is invalid';
            }
            let textures = this.textures;
            Object.keys( textures ).forEach( key => {
                textures[ key ].resize( width, height );
            });
            return this;
        }
    }

    module.exports = RenderTarget;

}());
