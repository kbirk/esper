(function() {

    'use strict';

    var Stack = require('../util/Stack');
    var StackMap = require('../util/StackMap');

    module.exports = {

        /**
         * The currently bound WebGL context.
         * @private
         */
        boundWebGLContext: null,

        /**
         * All the current WebGL contexts
         * @private
         */
        webGLContexts: {},

        /**
         * The currently bound vertex buffer.
         * @private
         */
        boundVertexBuffer: null,

        /**
         * The currently enabled vertex attributes.
         * @private
         */
        enabledVertexAttributes: {
            '0': false,
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '5': false
            // ... others will be added as needed
        },

        /**
         * The currently bound index buffer.
         * @private
         */
        boundIndexBuffer: null,

        /**
         * The stack of pushed shaders.
         * @private
         */
        shaders: new Stack(),

        /**
         * The stack of pushed viewports.
         * @private
         */
        viewports: new Stack(),

        /**
         * The stack of pushed render targets.
         * @private
         */
        renderTargets: new Stack(),

        /**
         * The map of stacks pushed texture2Ds, keyed by texture unit index.
         * @private
         */
        texture2Ds: new StackMap(),

        /**
         * The map of pushed texture2Ds,, keyed by texture unit index.
         * @private
         */
        textureCubeMaps: new StackMap()
    };

}());
