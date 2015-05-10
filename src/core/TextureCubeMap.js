(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Util = require('../util/Util'),
        _boundTexture = null;

    /**
     * Creates sixe face textures from a single source image of
     * the format:
     *
     *      |    | +Y |    |    |
     *      | -X | -Z | +X | +Z |
     *      |    | -Y |    |    |
     *
     * @param {TextureCubeMap} that - The TextureCubeMap object.
     * @param {HTMLImageElement} image - The HTMLImageElement object.
     */
    function bufferFacesFromSingleImage( that, image ) {
        var FACES = [ '-x', '+x', '-y', '+y', '-z', '+z' ],
            FACE_COORDS = {
                '+z': { x: 3/4, y: 1/3 },
                '-z': { x: 1/4, y: 1/3 },
                '+x': { x: 2/4, y: 1/3 },
                '-x': { x: 0, y: 1/3 },
                '+y': { x: 1/4, y: 0 },
                '-y': { x: 1/4, y: 2/3 }
            },
            fromWidth = image.width / 4,
            fromHeight = image.height / 3,
            // we round down here because 'nextHighestPowerOfTwo' will round up
            toWidth = Util.nextHighestPowerOfTwo( Math.floor( fromWidth ) ),
            toHeight = Util.nextHighestPowerOfTwo( Math.floor( fromHeight ) ),
            canvas = document.createElement('canvas'),
            context = canvas.getContext("2d"),
            cropX,
            cropY,
            face,
            coords,
            i;
        for ( i=0; i<6; i++ ) {
            face = FACES[ i ];
            coords = FACE_COORDS[ face ];
            canvas.width = toWidth;
            canvas.height = toHeight;
            // get crop top left coords
            cropX = Math.floor( coords.x * image.width );
            cropY = Math.floor( coords.y * image.height );
            // crop face from full image
            context.drawImage(
                image,
                cropX, cropY,
                fromWidth, fromHeight,
                0, 0,
                toWidth, toHeight );
            // buffer webgl texture object
            bufferFaceTexture( that, canvas, face );
        }
        // clear flag
        delete that.imagesToBuffer;
    }

    /**
     * Buffers an image for a specific cube map face.
     *
     * @param {TextureCubeMap} that - The TextureCubeMap object.
     * @param {HTMLImageElement} image - The HTMLImageElement object.
     * @param {String} face - The face to buffer.
     */
    function bufferFaceTexture( that, image, face ) {
        var gl = that.gl,
            FACE_TARGETS = {
                '+z': gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                '-z': gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                '+x': gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                '-x': gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                '+y': gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                '-y': gl.TEXTURE_CUBE_MAP_NEGATIVE_Y
            };
        // create texture if it doesn't exist
        if ( !that.id ) {
            that.id = gl.createTexture();
        }
        // buffer face texture
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, that.id );
        gl.texImage2D( FACE_TARGETS[ face ], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
        gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
        // decrement images to buffer count
        that.imagesToBuffer--;
        if ( that.imagesToBuffer === 0 ) {
            // generate mipmaps once all faces are buffered
            gl.generateMipmap( gl.TEXTURE_CUBE_MAP );
            delete that.imagesToBuffer;
        }
    }

    function TextureCubeMap( spec, callback ) {

        function loadImage( url, face ) {
            return function( done ) {
                var image = new Image();
                image.onload = function() {
                    // buffer face texture
                    bufferFaceTexture( that, image, face );
                    done();
                };
                image.src = url;
            };
        }

        var that = this,
            image,
            face,
            jobs;
        // store gl context
        this.gl = WebGLContext.get();
        this.imagesToBuffer = 6;
        // create cube map based on input
        if ( spec.image ) {
            // Image object
            bufferFacesFromSingleImage( this, spec.image );
        } else if ( spec.url ) {
            // url, load image
            image = new Image();
            image.onload = function() {
                bufferFacesFromSingleImage( that, image );
                callback( that );
            };
            image.src = spec.url;
        } else if ( spec.images ) {
            // multiple images for cube map
            for ( face in spec.images ) {
                if ( spec.images.hasOwnProperty( face ) ) {
                    // buffer face texture
                    bufferFaceTexture( this, spec.images[ face ], face );
                }
            }
        } else if ( spec.urls ) {
            // multiple urls for cube map
            jobs = {};
            for ( face in spec.urls ) {
                if ( spec.urls.hasOwnProperty( face ) ) {
                    // add job to map
                    jobs[ face ] = loadImage( spec.urls[ face ], face );
                }
            }
            Util.async( jobs, function() {
                callback( that );
            });
        }
    }

    TextureCubeMap.prototype.bind = function( location ) {
        // if this buffer is already bound, exit early
        if ( _boundTexture === this ) {
            return;
        }
        var gl = this.gl;
        location = gl[ location ] || gl.TEXTURE0;
        gl.activeTexture( location );
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, this.id );
        _boundTexture = this;
    };

    TextureCubeMap.prototype.unbind = function() {
        // if no buffer is bound, exit bound
        if ( _boundTexture === null ) {
            return;
        }
        var gl = this.gl;
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, null );
        _boundTexture = null;
    };

    module.exports = TextureCubeMap;

}());
