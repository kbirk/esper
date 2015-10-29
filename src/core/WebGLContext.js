(function() {

    "use strict";

    var _boundContext = null,
        _contextsById = {},
        EXTENSIONS = [
            // ratified
            'OES_texture_float',
            'OES_texture_half_float',
            'WEBGL_lose_context',
            'OES_standard_derivatives',
            'OES_vertex_array_object',
            'WEBGL_debug_renderer_info',
            'WEBGL_debug_shaders',
            'WEBGL_compressed_texture_s3tc',
            'WEBGL_depth_texture',
            'OES_element_index_uint',
            'EXT_texture_filter_anisotropic',
            'WEBGL_draw_buffers',
            'ANGLE_instanced_arrays',
            'OES_texture_float_linear',
            'OES_texture_half_float_linear',
            // community
            'WEBGL_compressed_texture_atc',
            'WEBGL_compressed_texture_pvrtc',
            'EXT_color_buffer_half_float',
            'WEBGL_color_buffer_float',
            'EXT_frag_depth',
            'EXT_sRGB',
            'WEBGL_compressed_texture_etc1',
            'EXT_blend_minmax',
            'EXT_shader_texture_lod'
        ];

    /**
     * Returns a Canvas element object from either an existing object, or
     * identification string.
     *
     * @param {HTMLCanvasElement|String} arg - The Canvas
     *     object or Canvas identification string.
     *
     * @returns {HTMLCanvasElement} The Canvas element object.
     */
    function getCanvas( arg ) {
        if ( arg instanceof HTMLImageElement ||
             arg instanceof HTMLCanvasElement ) {
            return arg;
        } else if ( typeof arg === "string" ) {
            return document.getElementById( arg );
        }
        return null;
    }

    /**
     * Attempts to load all known extensions for a provided
     * WebGLRenderingContext. Stores the results in the context wrapper for
     * later queries.
     *
     * @param {Object} contextWrapper - The context wrapper.
     */
    function loadExtensions( contextWrapper ) {
        var gl = contextWrapper.gl,
            extension,
            i;
        for ( i=0; i<EXTENSIONS.length; i++ ) {
            extension = EXTENSIONS[i];
            contextWrapper.extensions[ extension ] = gl.getExtension( extension );
            if ( contextWrapper.extensions[ extension ] ) {
                console.log( extension + " extension loaded successfully" );
            } else {
                console.log( extension + " extension not supported" );
            }
        }
    }

    /**
     * Attempts to create a WebGLRenderingContext wrapped inside an object which
     * will also store the extension query results.
     *
     * @param {HTMLCanvasElement} The Canvas element object to create the context under.
     * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
     *
     * @returns {Object} contextWrapper - The context wrapper.
     */
    function createContextWrapper( canvas, options ) {
        var contextWrapper,
            gl;
        try {
            // get WebGL context, fallback to experimental
            gl = canvas.getContext( "webgl", options ) || canvas.getContext( "experimental-webgl", options );
            // wrap context
            contextWrapper = {
                id: canvas.id,
                gl: gl,
                extensions: {}
            };
            // load WebGL extensions
            loadExtensions( contextWrapper );
            // add context wrapper to map
            _contextsById[ canvas.id ] = contextWrapper;
            // check if a bound context exists
            if ( !_boundContext ) {
                // bind context if no other is bound
                _boundContext = contextWrapper;
            }
        } catch( e ) {
            console.error( e.message );
        }
        if ( !gl ) {
            console.error( "Unable to initialize WebGL. Your browser may not " +
                "support it." );
        }
        return contextWrapper;
    }

    module.exports = {

        /**
         * Binds a specific WebGL context as the active context. This context
         * will be used for all code /webgl.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string.
         *
         * @returns {WebGLContext} This namespace, used for chaining.
         */
        bind: function( arg ) {
            var canvas = getCanvas( arg );
            if ( !canvas ) {
                console.error( "Context could not be bound for argument of " +
                    "type '" + ( typeof arg ) + "', command ignored." );
                return this;
            }
            if ( !_contextsById[ canvas.id ] ) {
                console.error( "No context exists for provided argument '" +
                    arg + "', command ignored." );
                return;
            }
            _boundContext = _contextsById[ canvas.id ];
            return this;
        },

        /**
         * Creates a new or retreives an existing WebGL context for a provided
         * canvas object. During creation attempts to load all extensions found
         * at: https://www.khronos.org/registry/webgl/extensions/. If no
         * argument is provided it will attempt to return the currently bound
         * context. If no context is bound, it will return 'null'.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
         *
         * @returns {WebGLRenderingContext} The WebGLRenderingContext context object.
         */
        get: function( arg, options ) {
            if ( !arg ) {
                if ( !_boundContext ) {
                    // no bound context or argument
                    console.error( "No context is currently bound or " +
                        "provided, returning 'null'." );
                    return null;
                }
                // return last bound context
                return _boundContext.gl;
            }
            // get canvas element
            var canvas = getCanvas( arg );
            // try to find or create context
            if ( !canvas || ( !_contextsById[ canvas.id ] && !createContextWrapper( canvas, options ) ) ) {
                console.error( "Context could not be found or created for " +
                    "argument of type'"+( typeof arg )+"', returning 'null'." );
                return null;
            }
            // return context
            return _contextsById[ canvas.id ].gl;
        },

        /**
         * Checks if an extension has been successfully loaded by the provided
         * canvas object. If no argument is provided it will attempt to return
         * the currently bound context. If no context is bound, it will return
         * 'false'.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {String} extension - The extension name.
         *
         * @returns {boolean} Whether or not the provided extension has been loaded successfully.
         */
        checkExtension: function( arg, extension ) {
            var extensions,
                context,
                canvas;
            if ( !extension ) {
                // can check extension without arg
                extension = arg;
                context = _boundContext;
            } else {
                canvas = getCanvas( arg );
                if ( canvas ) {
                    context = _contextsById[ canvas.id ];
                }
            }
            if ( !context ) {
                console.error("No context is currently bound or provided as " +
                    "argument, returning false.");
                return false;
            }
            extensions = context.extensions;
            return extensions[ extension ] ? extensions[ extension ] : false;
        }
    };

}());
