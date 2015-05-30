(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        RenderTarget = require('./RenderTarget'),
        Texture2D = require('./Texture2D'),
        TextureCubeMap = require('./TextureCubeMap'),
        Viewport = require('./Viewport'),
        Camera = require('../render/Camera'),
        FACES = [
            '-x', '+x',
            '-y', '+y',
            '-z', '+z'
        ],
        FACE_TARGETS = {
            '+z': "TEXTURE_CUBE_MAP_POSITIVE_Z",
            '-z': "TEXTURE_CUBE_MAP_NEGATIVE_Z",
            '+x': "TEXTURE_CUBE_MAP_POSITIVE_X",
            '-x': "TEXTURE_CUBE_MAP_NEGATIVE_X",
            '+y': "TEXTURE_CUBE_MAP_POSITIVE_Y",
            '-y': "TEXTURE_CUBE_MAP_NEGATIVE_Y"
        },
        DEFAULT_SIZE = 2048;

    /**
     * Binds a particular face of the cube map renderTarget and readies it for
     * rendering.
     *
     * @param {CubeMapRenderTarget} cubeMapTarget - The cube map renderTarget.
     * @param {String} face - The face identification string.
     */
    function bindFaceTexture( cubeMapTarget, face ) {
        // bind relevant face of cube map
        cubeMapTarget.renderTarget.setColorTarget(
            cubeMapTarget.cubeMap,
            FACE_TARGETS[ face ] );
        // clear the face texture
        cubeMapTarget.renderTarget.clear();
    }

    /**
     * Returns a camera object for the provided face.
     *
     * @param {String} face - The face identification string.
     * @param {Vec3|Array} origin - The origin of the cube map.
     *
     * @returns {Camera} The resulting camera.
     */
    function getFaceCamera( face, origin ) {
        var forward,
            up;
        // setup transform depending on current face
        switch ( face ) {
            case '+x':
                forward = [ 1, 0, 0 ];
                up = [ 0, -1, 0 ];
                break;
            case '-x':
                forward = [ -1, 0, 0 ];
                up = [ 0, -1, 0 ];
                break;
            case '+y':
                forward = [ 0, 1, 0 ];
                up = [ 0, 0, 1 ];
                break;
            case '-y':
                forward = [ 0, -1, 0 ];
                up = [ 0, 0, -1 ];
                break;
            case '+z':
                forward = [ 0, 0, 1 ];
                up = [ 0, -1, 0 ];
                break;
            case '-z':
                forward = [ 0, 0, -1 ];
                up = [ 0, -1, 0 ];
                break;
        }
        return new Camera({
            origin: origin,
            forward: forward,
            up: up,
            projection: {
                fov: 90,
                aspect: 1,
                zMin: 1,
                zMax: 1000
            }
        });
    }

    /*
     * TODO: test performance vs using 6 FBO's, each sharing a single depth
     * texture.
     */

    /**
     * Instantiates a CubeMapRenderTarget object.
     * @class CubeMapRenderTarget
     * @classdesc A renderTarget class to allow rendering to textures.
     */
    function CubeMapRenderTarget( spec ) {
        var gl = this.gl = WebGLContext.get();
        spec = spec || {};
        this.id = gl.createFramebuffer();
        this.resolution = spec.resolution || DEFAULT_SIZE;
        this.depthTexture = new Texture2D({
            format: "DEPTH_COMPONENT",
            type: "UNSIGNED_SHORT",
            width: this.resolution,
            height: this.resolution
        });
        this.cubeMap = new TextureCubeMap({
            data: null,
            width: this.resolution,
            height: this.resolution
        });
        this.renderTarget = new RenderTarget();
        this.renderTarget.setDepthTarget( this.depthTexture );
        this.viewport = new Viewport();
    }

    /**
     * Binds the cube map component and pushes it to the front of the stack.
     * @memberof CubeMapRenderTarget
     *
     * @param {String} location - The texture unit location.
     *
     * @returns {CubeMapRenderTarget} The texture object, for chaining.
     */
     CubeMapRenderTarget.prototype.push = function( location ) {
        this.cubeMap.push( location );
        return this;
    };

    /**
     * Unbinds the texture object and binds the texture beneath it on
     * this stack. If there is no underlying texture, unbinds the unit.
     * @memberof CubeMapRenderTarget
     *
     * @param {String} location - The texture unit location.
     *
     * @returns {CubeMapRenderTarget} The texture object, for chaining.
     */
     CubeMapRenderTarget.prototype.pop = function( location ) {
        this.cubeMap.pop( location );
        return this;
    };

    /**
     * Binds the renderTarget object.
     * @memberof CubeMapRenderTarget
     *
     * @param {Vec3|Array} origin - The origin of the cube map.
     * @param {Renderer} renderer - The renderer to execute.
     * @param {Object} entitiesByTechnique - The entities keyed by technique.
     *
     * @returns {CubeMapRenderTarget} The texture object, for chaining.
     */
    CubeMapRenderTarget.prototype.render = function( origin, renderer, entitiesByTechnique ) {
        var that = this;
        this.renderTarget.push();
        this.viewport.push( this.resolution, this.resolution );
        FACES.forEach( function( face ) {
            // bind face
            bindFaceTexture( that, face );
            // render scene
            renderer.render(
                getFaceCamera( face, origin ),
                entitiesByTechnique );
        });
        this.renderTarget.pop();
        this.viewport.pop();
        return this;
    };

    module.exports = CubeMapRenderTarget;

}());
