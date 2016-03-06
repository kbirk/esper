(function() {

    'use strict';

    var _boundContext = null;
    var _contextsById = {};
    var EXTENSIONS = [
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
        'EXT_frag_depth',
        'WEBGL_draw_buffers',
        'ANGLE_instanced_arrays',
        'OES_texture_float_linear',
        'OES_texture_half_float_linear',
        'EXT_blend_minmax',
        'EXT_shader_texture_lod',
        // community
        'WEBGL_compressed_texture_atc',
        'WEBGL_compressed_texture_pvrtc',
        'EXT_color_buffer_half_float',
        'WEBGL_color_buffer_float',
        'EXT_frag_depth',
        'EXT_sRGB',
        'WEBGL_compressed_texture_etc1'
    ];

    /**
     * Returns a Canvas element object from either an existing object, or identification string.
     * @private
     *
     * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas
     *     identification string.
     *
     * @returns {HTMLCanvasElement} The Canvas element object.
     */
    function getCanvas( arg ) {
        if ( arg instanceof HTMLImageElement ||
             arg instanceof HTMLCanvasElement ) {
            return arg;
        } else if ( typeof arg === 'string' ) {
            return document.getElementById( arg );
        }
        return null;
    }

    /**
     * Attempts to retreive a wrapped WebGLRenderingContext.
     * @private
     *
     * @param {HTMLCanvasElement} The Canvas element object to create the context under.
     *
     * @returns {Object} The context wrapper.
     */
    function getContextWrapper( arg ) {
        if ( !arg ) {
            if ( _boundContext ) {
                // return last bound context
                return _boundContext;
            }
        } else {
            var canvas = getCanvas( arg );
            if ( canvas ) {
                return _contextsById[ canvas.id ];
            }
        }
        // no bound context or argument
        return null;
    }

    /**
     * Attempts to load all known extensions for a provided WebGLRenderingContext. Stores the results in the context wrapper for later queries.
     * @private
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
        }
    }

    /**
     * Attempts to create a WebGLRenderingContext wrapped inside an object which will also store the extension query results.
     * @private
     *
     * @param {HTMLCanvasElement} The Canvas element object to create the context under.
     * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
     *
     * @returns {Object} The context wrapper.
     */
    function createContextWrapper( canvas, options ) {
        var contextWrapper;
        var gl;
        try {
            // get WebGL context, fallback to experimental
            gl = canvas.getContext( 'webgl', options ) || canvas.getContext( 'experimental-webgl', options );
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
            // bind the context
            _boundContext = contextWrapper;
        } catch( err ) {
            console.error( err.message );
        }
        if ( !gl ) {
            console.error( 'Unable to initialize WebGL. Your browser may not support it.' );
        }
        return contextWrapper;
    }

    module.exports = {

        /**
         * Binds a specific WebGL context as the active context. This context will be used for all code /webgl.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string.
         *
         * @returns {WebGLContext} This namespace, used for chaining.
         */
        bind: function( arg ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                _boundContext = wrapper;
                return this;
            }
            console.error( 'No context exists for provided argument `' + arg + '`, command ignored.' );
            return this;
        },

        /**
         * Creates a new or retreives an existing WebGL context for the provided or currently bound context object.
         * During creation attempts to load all extensions found at: https://www.khronos.org/registry/webgl/extensions/.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {Object}} options - Parameters to the webgl context, only used during instantiation. Optional.
         *
         * @returns {WebGLRenderingContext} The WebGLRenderingContext context object.
         */
        get: function( arg, options ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                // return the native WebGLRenderingContext
                return wrapper.gl;
            }
            // get canvas element
            var canvas = getCanvas( arg );
            // try to find or create context
            if ( !canvas || !createContextWrapper( canvas, options ) ) {
                console.error( 'Context could not be found or created for argument of type`' + ( typeof arg ) + '`, returning `null`.' );
                return null;
            }
            // return context
            return _contextsById[ canvas.id ].gl;
        },

        /**
         * Returns an array of all supported extensions for the provided or currently bound context object. If no context is bound, it will return an empty array.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         *
         * @returns {Array} All supported extensions.
         */
        supportedExtensions: function( arg ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                var extensions = wrapper.extensions;
                var supported = [];
                Object.keys( extensions ).forEach( function( key ) {
                    if ( extensions[ key ] ) {
                        supported.push( key );
                    }
                });
                return supported;
            }
            console.error( 'No context is currently bound or was provided, returning an empty array.' );
            return [];
        },

        /**
         * Returns an array of all unsupported extensions for the provided or currently bound context object. If no context is bound, it will return an empty array.
         * an empty array.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         *
         * @returns {Array} All unsupported extensions.
         */
        unsupportedExtensions: function( arg ) {
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                var extensions = wrapper.extensions;
                var unsupported = [];
                Object.keys( extensions ).forEach( function( key ) {
                    if ( !extensions[ key ] ) {
                        unsupported.push( key );
                    }
                });
                return unsupported;
            }
            console.error( 'No context is currently bound or was provided, returning an empty array.' );
            return [];
        },

        /**
         * Checks if an extension has been successfully loaded for the provided or currently bound context object.
         * 'false'.
         *
         * @param {HTMLCanvasElement|String} arg - The Canvas object or Canvas identification string. Optional.
         * @param {String} extension - The extension name.
         *
         * @returns {boolean} Whether or not the provided extension has been loaded successfully.
         */
        checkExtension: function( arg, extension ) {
            if ( !extension ) {
                // shift parameters if no canvas arg is provided
                extension = arg;
                arg = null;
            }
            var wrapper = getContextWrapper( arg );
            if ( wrapper ) {
                var extensions = wrapper.extensions;
                return extensions[ extension ] ? extensions[ extension ] : false;
            }
            console.error( 'No context is currently bound or provided as argument, returning false.' );
            return false;
        }
    };

}());
