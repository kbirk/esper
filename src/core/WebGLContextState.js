(function() {

    'use strict';

    let Stack = require('../util/Stack');
    let StackMap = require('../util/StackMap');
    let _states = {};

    class WebGLContextState {

        constructor() {
            /**
             * The currently bound vertex buffer.
             * @private
             */
            this.boundVertexBuffer = null;

            /**
             * The currently enabled vertex attributes.
             * @private
             */
            this.enabledVertexAttributes = {
                '0': false,
                '1': false,
                '2': false,
                '3': false,
                '4': false,
                '5': false
                // ... others will be added as needed
            };

            /**
             * The currently bound index buffer.
             * @private
             */
            this.boundIndexBuffer = null;

            /**
             * The stack of pushed shaders.
             * @private
             */
            this.shaders = new Stack();

            /**
             * The stack of pushed viewports.
             * @private
             */
            this.viewports = new Stack();

            /**
             * The stack of pushed render targets.
             * @private
             */
            this.renderTargets = new Stack();

            /**
             * The map of stacks pushed texture2Ds, keyed by texture unit index.
             * @private
             */
            this.texture2Ds = new StackMap();

            /**
             * The map of pushed texture2Ds,, keyed by texture unit index.
             * @private
             */
            this.textureCubeMaps = new StackMap();
        }
    }

    module.exports = {

        get: function( gl ) {
            let id = gl.canvas.id;
            if ( !_states[ id ] ) {
                _states[ id ] = new WebGLContextState();
            }
            return _states[ id ];
        }

    };

}());
