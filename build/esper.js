(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.esper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {

    "use strict";

    module.exports = {
        // core
        CubeMapRenderTarget: require('./core/CubeMapRenderTarget'),
        RenderTarget: require('./core/RenderTarget'),
        Shader: require('./core/Shader'),
        Texture2D: require('./core/Texture2D'),
        TextureCubeMap: require('./core/TextureCubeMap'),
        VertexBuffer: require('./core/VertexBuffer'),
        VertexPackage: require('./core/VertexPackage'),
        IndexBuffer: require('./core/IndexBuffer'),
        Viewport: require('./core/Viewport'),
        WebGLContext: require('./core/WebGLContext'),
        // render
        Camera: require('./render/Camera'),
        Entity: require('./render/Entity'),
        Geometry: require('./render/Geometry'),
        Material: require('./render/Material'),
        Mesh: require('./render/Mesh'),
        Joint: require('./render/Joint'),
        Octree: require('./render/Octree'),
        Renderable: require('./render/Renderable'),
        Renderer: require('./render/Renderer'),
        RenderPass: require('./render/RenderPass'),
        RenderTechnique: require('./render/RenderTechnique'),
        Skeleton: require('./render/Skeleton'),
        Sprite: require('./render/Sprite'),
        // shapes
        Cube: require('./util/shapes/Cube'),
        Cylinder: require('./util/shapes/Cylinder'),
        Quad: require('./util/shapes/Quad'),
        ShapeUtil: require('./util/shapes/ShapeUtil'),
        Sphere: require('./util/shapes/Sphere'),
        // util
        glTFLoader: require('./util/gltf/glTFLoader'),
        OBJMTLLoader: require('./util/obj/OBJMTLLoader'),
        Util: require('./util/Util'),
        // debug
        Debug: require('./util/debug/Debug'),
        // math
        Mat33: require('alfador').Mat33,
        Mat44: require('alfador').Mat44,
        Vec2: require('alfador').Vec2,
        Vec3: require('alfador').Vec3,
        Vec4: require('alfador').Vec4,
        Quaternion: require('alfador').Quaternion,
        Transform: require('alfador').Transform,
        Triangle: require('alfador').Triangle
    };


}());

},{"./core/CubeMapRenderTarget":14,"./core/IndexBuffer":15,"./core/RenderTarget":16,"./core/Shader":17,"./core/Texture2D":19,"./core/TextureCubeMap":20,"./core/VertexBuffer":21,"./core/VertexPackage":22,"./core/Viewport":23,"./core/WebGLContext":24,"./render/Camera":26,"./render/Entity":27,"./render/Geometry":28,"./render/Joint":29,"./render/Material":30,"./render/Mesh":31,"./render/Octree":32,"./render/RenderPass":33,"./render/RenderTechnique":34,"./render/Renderable":35,"./render/Renderer":36,"./render/Skeleton":37,"./render/Sprite":38,"./util/Util":40,"./util/debug/Debug":42,"./util/gltf/glTFLoader":44,"./util/obj/OBJMTLLoader":52,"./util/shapes/Cube":53,"./util/shapes/Cylinder":54,"./util/shapes/Quad":55,"./util/shapes/ShapeUtil":56,"./util/shapes/Sphere":57,"alfador":10}],2:[function(require,module,exports){
(function() {

    "use strict";

    var Vec3 = require( './Vec3' ),
        Vec4 = require( './Vec4' );

    /**
     * Instantiates a Mat33 object.
     * @class Mat33
     * @classdesc A 3x3 column-major matrix.
     */
    function Mat33( that ) {
        if ( that ) {
            if ( that.data instanceof Array ) {
                if ( that.data.length === 9 ) {
                    // copy Mat33 data by value
                    this.data = that.data.slice( 0 );
                } else {
                    // copy Mat44 data by value, account for index differences
                    this.data = [
                        that.data[0], that.data[1], that.data[2],
                        that.data[4], that.data[5], that.data[6],
                        that.data[8], that.data[9], that.data[10] ];
                }
            } else if ( that.length === 9 ) {
                // copy array by value, use prototype to cast array buffers
                this.data = Array.prototype.slice.call( that );
            } else {
                return Mat33.identity();
            }
        } else {
            return Mat33.identity();
        }
    }

    /**
     * Returns a column of the matrix as a Vec3 object.
     * @memberof Mat33
     *
     * @param {number} index - The 0-based column index.
     *
     * @returns {Vec3} The column vector.
     */
    Mat33.prototype.row = function( index ) {
        return new Vec3(
            this.data[0+index],
            this.data[3+index],
            this.data[6+index] );
    };

    /**
     * Returns a row of the matrix as a Vec3 object.
     * @memberof Mat33
     *
     * @param {number} index - The 0-based row index.
     *
     * @returns {Vec3} The column vector.
     */
    Mat33.prototype.col = function( index ) {
        return new Vec3(
            this.data[0+index*3],
            this.data[1+index*3],
            this.data[2+index*3] );
    };

    /**
     * Returns the identity matrix.
     * @memberof Mat33
     *
     * @returns {Mat33} The identiy matrix.
     */
    Mat33.identity = function() {
        return new Mat33([ 1, 0, 0,
            0, 1, 0,
            0, 0, 1 ]);
    };

    /**
     * Returns a scale matrix.
     * @memberof Mat33
     *
     * @param {Vec3|Array|number} scale - The scalar or vector scaling factor.
     *
     * @returns {Mat33} The scale matrix.
     */
    Mat33.scale = function( scale ) {
        if ( typeof scale === "number" ) {
            return new Mat33([
                scale, 0, 0,
                0, scale, 0,
                0, 0, scale ]);
        } else if ( scale instanceof Array ) {
            return new Mat33([
                scale[0], 0, 0,
                0, scale[1], 0,
                0, 0, scale[2] ]);
        }
        return new Mat33([
            scale.x, 0, 0,
            0, scale.y, 0,
            0, 0, scale.z ]);
    };

    /**
     * Returns a rotation matrix defined by an axis and an angle.
     * @memberof Mat33
     *
     * @param {number} angle - The angle of the rotation, in degrees.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Mat33} The rotation matrix.
     */
    Mat33.rotationDegrees = function( angle, axis ) {
        return this.rotationRadians( angle*Math.PI/180, axis );
    };

    /**
     * Returns a rotation matrix defined by an axis and an angle.
     * @memberof Mat33
     *
     * @param {number} angle - The angle of the rotation, in radians.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Mat33} The rotation matrix.
     */
    Mat33.rotationRadians = function( angle, axis ) {
        if ( axis instanceof Array ) {
            axis = new Vec3( axis );
        }
        // zero vector, return identity
        if ( axis.lengthSquared() === 0 ) {
            return this.identity();
        }
        var normAxis = axis.normalize(),
            x = normAxis.x,
            y = normAxis.y,
            z = normAxis.z,
            modAngle = ( angle > 0 ) ? angle % (2*Math.PI) : angle % (-2*Math.PI),
            s = Math.sin( modAngle ),
            c = Math.cos( modAngle ),
            xx = x * x,
            yy = y * y,
            zz = z * z,
            xy = x * y,
            yz = y * z,
            zx = z * x,
            xs = x * s,
            ys = y * s,
            zs = z * s,
            one_c = 1.0 - c;
        return new Mat33([
            (one_c * xx) + c, (one_c * xy) + zs, (one_c * zx) - ys,
            (one_c * xy) - zs, (one_c * yy) + c, (one_c * yz) + xs,
            (one_c * zx) + ys, (one_c * yz) - xs, (one_c * zz) + c
        ]);
    };

    /**
     * Returns a rotation matrix to rotate a vector from one direction to
     * another.
     * @memberof Mat33
     *
     * @param {Vec3} from - The starting direction.
     * @param {Vec3} to - The ending direction.
     *
     * @returns {Mat33} The matrix representing the rotation.
     */
    Mat33.rotationFromTo = function( fromVec, toVec ) {
        /*Builds the rotation matrix that rotates one vector into another.

        The generated rotation matrix will rotate the vector from into
        the Vector3<var> to. from and to must be unit Vector3<var>s!

        This method is based on the code from:

        Tomas Mller, John Hughes
        Efficiently Building a Matrix to Rotate One Vector to Another
        Journal of Graphics Tools, 4(4):1-4, 1999
        */
        var EPSILON = 0.000001,
            from = new Vec3( fromVec ).normalize(),
            to = new Vec3( toVec ).normalize(),
            e = from.dot( to ),
            f = Math.abs( e ),
            that = new Mat33(),
            x, u, v,
            fx, fy, fz,
            ux, uz,
            c1, c2, c3;
        if ( f > ( 1.0-EPSILON ) ) {
            // "from" and "to" almost parallel
            // nearly orthogonal
            fx = Math.abs( from.x );
            fy = Math.abs( from.y );
            fz = Math.abs( from.z );
            if (fx < fy) {
                if (fx<fz) {
                    x = new Vec3( 1, 0, 0 );
                } else {
                    x = new Vec3( 0, 0, 1 );
                }
            } else {
                if (fy < fz) {
                    x = new Vec3( 0, 1, 0 );
                } else {
                    x = new Vec3( 0, 0, 1 );
                }
            }
            u = x.sub( from );
            v = x.sub( to );
            c1 = 2.0 / u.dot( u );
            c2 = 2.0 / v.dot( v );
            c3 = c1*c2 * u.dot( v );
            // set matrix entries
            that.data[0] = - c1*u.x*u.x - c2*v.x*v.x + c3*v.x*u.x;
            that.data[3] = - c1*u.x*u.y - c2*v.x*v.y + c3*v.x*u.y;
            that.data[6] = - c1*u.x*u.z - c2*v.x*v.z + c3*v.x*u.z;
            that.data[1] = - c1*u.y*u.x - c2*v.y*v.x + c3*v.y*u.x;
            that.data[4] = - c1*u.y*u.y - c2*v.y*v.y + c3*v.y*u.y;
            that.data[7] = - c1*u.y*u.z - c2*v.y*v.z + c3*v.y*u.z;
            that.data[2] = - c1*u.z*u.x - c2*v.z*v.x + c3*v.z*u.x;
            that.data[5] = - c1*u.z*u.y - c2*v.z*v.y + c3*v.z*u.y;
            that.data[8] = - c1*u.z*u.z - c2*v.z*v.z + c3*v.z*u.z;
            that.data[0] += 1.0;
            that.data[4] += 1.0;
            that.data[8] += 1.0;
        } else {
            // the most common case, unless "from"="to", or "to"=-"from"
            v = from.cross( to );
            u = 1.0 / ( 1.0 + e );    // optimization by Gottfried Chen
            ux = u * v.x;
            uz = u * v.z;
            c1 = ux * v.y;
            c2 = ux * v.z;
            c3 = uz * v.y;
            that.data[0] = e + ux * v.x;
            that.data[3] = c1 - v.z;
            that.data[6] = c2 + v.y;
            that.data[1] = c1 + v.z;
            that.data[4] = e + u * v.y * v.y;
            that.data[7] = c3 - v.x;
            that.data[2] = c2 - v.y;
            that.data[5] = c3 + v.x;
            that.data[8] = e + uz * v.z;
        }
        return that;
    };

    /**
     * Adds the matrix with the provided matrix argument, returning a new Ma33
     * object.
     * @memberof Mat33
     *
     * @param {Mat33|Mat44|Array} that - The matrix to add.
     *
     * @returns {Mat33} The sum of the two matrices.
     */
    Mat33.prototype.add = function( that ) {
        var mat = new Mat33( that ),
            i;
        for ( i=0; i<9; i++ ) {
            mat.data[i] += this.data[i];
        }
        return mat;
    };

    /**
     * Subtracts the provided matrix argument from the matrix, returning a new
     * Mat33 object.
     * @memberof Mat33
     *
     * @param {Mat33|Mat44|Array} that - The matrix to add.
     *
     * @returns {Mat33} The difference of the two matrices.
     */
    Mat33.prototype.sub = function( that ) {
        var mat = new Mat33( that ),
            i;
        for ( i=0; i<9; i++ ) {
            mat.data[i] = this.data[i] - mat.data[i];
        }
        return mat;
    };

    /**
     * Multiplies the provded vector argument by the matrix, returning a new
     * Vec3 object.
     * @memberof Mat33
     *
     * @param {Vec3|Vec4|Array} - The vector to be multiplied by the matrix.
     *
     * @returns {Vec3} The resulting vector.
     */
    Mat33.prototype.multVector = function( that ) {
        // ensure 'that' is a Vec3
        // it is safe to only cast if Array since the .w of a Vec4 is not used
        that = ( that instanceof Array ) ? new Vec3( that ) : that;
        return new Vec3({
            x: this.data[0] * that.x + this.data[3] * that.y + this.data[6] * that.z,
            y: this.data[1] * that.x + this.data[4] * that.y + this.data[7] * that.z,
            z: this.data[2] * that.x + this.data[5] * that.y + this.data[8] * that.z
        });
    };

    /**
     * Multiplies all components of the matrix by the provded scalar argument,
     * returning a new Mat33 object.
     * @memberof Mat33
     *
     * @param {number} - The scalar to multiply the matrix by.
     *
     * @returns {Mat33} The resulting matrix.
     */
    Mat33.prototype.multScalar = function( that ) {
        var mat = new Mat33(),
            i;
        for ( i=0; i<9; i++ ) {
            mat.data[i] = this.data[i] * that;
        }
        return mat;
    };

    /**
     * Multiplies the provded matrix argument by the matrix, returning a new
     * Mat33 object.
     * @memberof Mat33
     *
     * @param {Mat33|Mat44} - The matrix to be multiplied by the matrix.
     *
     * @returns {Mat33} The resulting matrix.
     */
    Mat33.prototype.multMatrix = function( that ) {
        var mat = new Mat33(),
            i;
        // ensure 'that' is a Mat33
        // must check if Array or Mat33
        if ( ( that.data && that.data.length === 16 ) ||
            that instanceof Array ) {
            that = new Mat33( that );
        }
        for ( i=0; i<3; i++ ) {
            mat.data[i] = this.data[i] * that.data[0] + this.data[i+3] * that.data[1] + this.data[i+6] * that.data[2];
            mat.data[i+3] = this.data[i] * that.data[3] + this.data[i+3] * that.data[4] + this.data[i+6] * that.data[5];
            mat.data[i+6] = this.data[i] * that.data[6] + this.data[i+3] * that.data[7] + this.data[i+6] * that.data[8];
        }
        return mat;
    };

    /**
     * Multiplies the provded argument by the matrix.
     * @memberof Mat33
     *
     * @param {Vec3|Vec4|Mat33|Mat44|Array|number} - The argument to be multiplied by the matrix.
     *
     * @returns {Mat33|Vec3} The resulting product.
     */
    Mat33.prototype.mult = function( that ) {
        if ( typeof that === "number" ) {
            // scalar
            return this.multScalar( that );
        } else if ( that instanceof Array ) {
            // array
            if ( that.length === 3 || that.length === 4 ) {
                return this.multVector( that );
            } else {
                return this.multMatrix( that );
            }
        }
        // vector
        if ( that.x !== undefined &&
            that.y !== undefined &&
            that.z !== undefined ) {
            return this.multVector( that );
        }
        // matrix
        return this.multMatrix( that );
    };

    /**
     * Divides all components of the matrix by the provded scalar argument,
     * returning a new Mat33 object.
     * @memberof Mat33
     *
     * @param {number} - The scalar to divide the matrix by.
     *
     * @returns {Mat33} The resulting matrix.
     */
    Mat33.prototype.div = function( that ) {
        var mat = new Mat33(),
            i;
        for ( i=0; i<9; i++ ) {
            mat.data[i] = this.data[i] / that;
        }
        return mat;
    };

    /**
     * Returns true if the all components match those of a provided matrix.
     * An optional epsilon value may be provided.
     * @memberof Mat33
     *
     * @param {Mat33|Array} that - The matrix to test equality with.
     * @param {number} epsilon - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the matrix components match.
     */
    Mat33.prototype.equals = function( that, epsilon ) {
        var i;
        epsilon = epsilon === undefined ? 0 : epsilon;
        for ( i=0; i<9; i++ ) {
            // awkward comparison logic is required to ensure equality passes if
            // corresponding are both undefined, NaN, or Infinity
            if ( !(
                ( this.data[i] === that.data[i] ) ||
                ( Math.abs( this.data[i] - that.data[i] ) <= epsilon )
               ) ) {
                return false;
            }
        }
        return true;
    };

    /**
     * Returns the transpose of the matrix.
     * @memberof Mat33
     *
     * @returns {Mat33} The transposed matrix.
     */
    Mat33.prototype.transpose = function() {
        var trans = new Mat33(), i;
        for ( i = 0; i < 3; i++ ) {
            trans.data[i*3]     = this.data[i];
            trans.data[(i*3)+1] = this.data[i+3];
            trans.data[(i*3)+2] = this.data[i+6];
        }
        return trans;
    };

    /**
     * Returns the inverse of the matrix.
     * @memberof Mat33
     *
     * @returns {Mat33} The inverted matrix.
     */
    Mat33.prototype.inverse = function() {
        var inv = new Mat33(), det;
        // compute inverse
        // row 1
        inv.data[0] = this.data[4]*this.data[8] - this.data[7]*this.data[5];
        inv.data[3] = -this.data[3]*this.data[8] + this.data[6]*this.data[5];
        inv.data[6] = this.data[3]*this.data[7] - this.data[6]*this.data[4];
        // row 2
        inv.data[1] = -this.data[1]*this.data[8] + this.data[7]*this.data[2];
        inv.data[4] = this.data[0]*this.data[8] - this.data[6]*this.data[2];
        inv.data[7] = -this.data[0]*this.data[7] + this.data[6]*this.data[1];
        // row 3
        inv.data[2] = this.data[1]*this.data[5] - this.data[4]*this.data[2];
        inv.data[5] = -this.data[0]*this.data[5] + this.data[3]*this.data[2];
        inv.data[8] = this.data[0]*this.data[4] - this.data[3]*this.data[1];
        // calculate determinant
        det = this.data[0]*inv.data[0] + this.data[1]*inv.data[3] + this.data[2]*inv.data[6];
        // return
        return inv.mult( 1 / det );
    };

    /**
     * Decomposes the matrix into the corresponding x, y, and z axes, along with
     * a scale.
     * @memberof Mat33
     *
     * @returns {Object} The decomposed components of the matrix.
     */
    Mat33.prototype.decompose = function() {
        var col0 = this.col( 0 ),
            col1 = this.col( 1 ),
            col2 = this.col( 2 );
        return {
            left: col0.normalize(),
            up: col1.normalize(),
            forward: col2.normalize(),
            scale: new Vec3( col0.length(), col1.length(), col2.length() )
        };
    };

    /**
     * Returns a random transform matrix composed of a rotation and scale.
     * @memberof Mat33
     *
     * @returns {Mat33} A random transform matrix.
     */
    Mat33.random = function() {
        var rot = Mat33.rotationRadians( Math.random() * 360, Vec3.random() ),
            scale = Mat33.scale( Math.random() * 10 );
        return rot.mult( scale );
    };

    /**
     * Returns a string representation of the matrix.
     * @memberof Mat33
     *
     * @returns {String} The string representation of the matrix.
     */
    Mat33.prototype.toString = function() {
        return this.data[0] +", "+ this.data[3] +", "+ this.data[6] +",\n" +
            this.data[1] +", "+ this.data[4] +", "+ this.data[7] +",\n" +
            this.data[2] +", "+ this.data[5] +", "+ this.data[8];
    };

    /**
     * Returns an array representation of the matrix.
     * @memberof Mat33
     *
     * @returns {Array} The matrix as an array.
     */
    Mat33.prototype.toArray = function() {
        return this.data.slice( 0 );
    };

    module.exports = Mat33;

}());

},{"./Vec3":8,"./Vec4":9}],3:[function(require,module,exports){
(function() {

    "use strict";

    var Vec3 = require( './Vec3' ),
        Vec4 = require( './Vec4' ),
        Mat33 = require( './Mat33' );

    /**
     * Instantiates a Mat44 object.
     * @class Mat44
     * @classdesc A 4x4 column-major matrix.
     */
    function Mat44( that ) {
        if ( that ) {
            if ( that.data instanceof Array ) {
                if ( that.data.length === 16 ) {
                    // copy Mat44 data by value
                    this.data = that.data.slice( 0 );
                } else {
                    // copy Mat33 data by value, account for index differences
                    this.data = [
                        that.data[0], that.data[1], that.data[2], 0,
                        that.data[3], that.data[4], that.data[5], 0,
                        that.data[6], that.data[7], that.data[8], 0,
                        0, 0, 0, 1 ];
                }
            } else if ( that.length === 16 ) {
                 // copy array by value, use prototype to cast array buffers
                this.data = Array.prototype.slice.call( that );
            } else {
                return Mat44.identity();
            }
        } else {
            return Mat44.identity();
        }
    }

    /**
     * Returns a column of the matrix as a Vec4 object.
     * @memberof Mat44
     *
     * @param {number} index - The 0-based column index.
     *
     * @returns {Vec4} The column vector.
     */
    Mat44.prototype.row = function( index ) {
        return new Vec4(
            this.data[0+index],
            this.data[4+index],
            this.data[8+index],
            this.data[12+index] );
    };

    /**
     * Returns a row of the matrix as a Vec4 object.
     * @memberof Mat44
     *
     * @param {number} index - The 0-based row index.
     *
     * @returns {Vec4} The column vector.
     */
    Mat44.prototype.col = function( index ) {
        return new Vec4(
            this.data[0+index*4],
            this.data[1+index*4],
            this.data[2+index*4],
            this.data[3+index*4] );
    };

    /**
     * Returns the identity matrix.
     * @memberof Mat44
     *
     * @returns {Mat44} The identiy matrix.
     */
    Mat44.identity = function() {
        return new Mat44([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1 ]);
    };

    /**
     * Returns a scale matrix.
     * @memberof Mat44
     *
     * @param {Vec3|Array|number} scale - The scalar or vector scaling factor.
     *
     * @returns {Mat44} The scale matrix.
     */
    Mat44.scale = function( scale ) {
        if ( typeof scale === "number" ) {
            return new Mat44([
                scale, 0, 0, 0,
                0, scale, 0, 0,
                0, 0, scale, 0,
                0, 0, 0, 1 ]);
        } else if ( scale instanceof Array ) {
            return new Mat44([
                scale[0], 0, 0, 0,
                0, scale[1], 0, 0,
                0, 0, scale[2], 0,
                0, 0, 0, 1 ]);
        }
        return new Mat44([
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1 ]);
    };

    /**
     * Returns a translation matrix.
     * @memberof Mat44
     *
     * @param {Vec3|Array} translation - The translation vector.
     *
     * @returns {Mat44} The translation matrix.
     */
    Mat44.translation = function( translation ) {
        if ( translation instanceof Array ) {
            return new Mat44([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                translation[0], translation[1], translation[2], 1 ]);
        }
        return new Mat44([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            translation.x, translation.y, translation.z, 1 ]);
    };

    /**
     * Returns a rotation matrix defined by an axis and an angle.
     * @memberof Mat44
     *
     * @param {number} angle - The angle of the rotation, in degrees.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Mat44} The rotation matrix.
     */
    Mat44.rotationDegrees = function( angle, axis ) {
        return new Mat44( Mat33.rotationDegrees( angle, axis ) );
    };

    /**
     * Returns a rotation matrix defined by an axis and an angle.
     * @memberof Mat44
     *
     * @param {number} angle - The angle of the rotation, in radians.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Mat44} The rotation matrix.
     */
    Mat44.rotationRadians = function( angle, axis ) {
        return new Mat44( Mat33.rotationRadians( angle, axis ) );
    };

    /**
     * Returns a rotation matrix to rotate a vector from one direction to
     * another.
     * @memberof Mat44
     *
     * @param {Vec3} from - The starting direction.
     * @param {Vec3} to - The ending direction.
     *
     * @returns {Mat44} The matrix representing the rotation.
     */
    Mat44.rotationFromTo = function( fromVec, toVec ) {
        return new Mat44( Mat33.rotationFromTo( fromVec, toVec ) );
    };

    /**
     * Adds the matrix with the provided matrix argument, returning a new Ma33
     * object.
     * @memberof Mat44
     *
     * @param {Mat33|Mat44|Array} that - The matrix to add.
     *
     * @returns {Mat44} The sum of the two matrices.
     */
    Mat44.prototype.add = function( that ) {
        var mat = new Mat44( that ),
            i;
        for ( i=0; i<16; i++ ) {
            mat.data[i] += this.data[i];
        }
        return mat;
    };

    /**
     * Subtracts the provided matrix argument from the matrix, returning a new
     * Mat44 object.
     * @memberof Mat44
     *
     * @param {Mat33|Mat44|Array} that - The matrix to add.
     *
     * @returns {Mat44} The difference of the two matrices.
     */
    Mat44.prototype.sub = function( that ) {
        var mat = new Mat44( that ),
            i;
        for ( i=0; i<16; i++ ) {
            mat.data[i] = this.data[i] - mat.data[i];
        }
        return mat;
    };

    /**
     * Multiplies the provded vector argument by the matrix, returning a new
     * Vec3 object.
     * @memberof Mat44
     *
     * @param {Vec3|Vec4|Array} - The vector to be multiplied by the matrix.
     *
     * @returns {Vec3} The resulting vector.
     */
    Mat44.prototype.multVector3 = function( that ) {
        // ensure 'that' is a Vec3
        // it is safe to only cast if Array since Vec4 has own method
        that = ( that instanceof Array ) ? new Vec3( that ) : that;
        return new Vec3({
            x: this.data[0] * that.x +
                this.data[4] * that.y +
                this.data[8] * that.z + this.data[12],
            y: this.data[1] * that.x +
                this.data[5] * that.y +
                this.data[9] * that.z + this.data[13],
            z: this.data[2] * that.x +
                this.data[6] * that.y +
                this.data[10] * that.z + this.data[14]
        });
    };

    /**
     * Multiplies the provded vector argument by the matrix, returning a new
     * Vec3 object.
     * @memberof Mat44
     *
     * @param {Vec3|Vec4|Array} - The vector to be multiplied by the matrix.
     *
     * @returns {Vec4} The resulting vector.
     */
    Mat44.prototype.multVector4 = function( that ) {
        // ensure 'that' is a Vec4
        // it is safe to only cast if Array since Vec3 has own method
        that = ( that instanceof Array ) ? new Vec4( that ) : that;
        return new Vec4({
            x: this.data[0] * that.x +
                this.data[4] * that.y +
                this.data[8] * that.z +
                this.data[12] * that.w,
            y: this.data[1] * that.x +
                this.data[5] * that.y +
                this.data[9] * that.z +
                this.data[13] * that.w,
            z: this.data[2] * that.x +
                this.data[6] * that.y +
                this.data[10] * that.z +
                this.data[14] * that.w,
            w: this.data[3] * that.x +
                this.data[7] * that.y +
                this.data[11] * that.z +
                this.data[15] * that.w
        });
    };

    /**
     * Multiplies all components of the matrix by the provded scalar argument,
     * returning a new Mat44 object.
     * @memberof Mat44
     *
     * @param {number} - The scalar to multiply the matrix by.
     *
     * @returns {Mat44} The resulting matrix.
     */
    Mat44.prototype.multScalar = function( that ) {
        var mat = new Mat44(),
            i;
        for ( i=0; i<16; i++ ) {
            mat.data[i] = this.data[i] * that;
        }
        return mat;
    };

    /**
     * Multiplies the provded matrix argument by the matrix, returning a new
     * Mat44 object.
     * @memberof Mat44
     *
     * @param {Mat33|Mat44|Array} - The matrix to be multiplied by the matrix.
     *
     * @returns {Mat44} The resulting matrix.
     */
    Mat44.prototype.multMatrix = function( that ) {
        var mat = new Mat44(),
            i;
        // ensure 'that' is a Mat44
        // must check if Array or Mat44
        if ( ( that.data && that.data.length === 9 ) ||
            that instanceof Array ) {
            that = new Mat44( that );
        }
        for ( i=0; i<4; i++ ) {
            mat.data[i] = this.data[i] * that.data[0] +
                this.data[i+4] * that.data[1] +
                this.data[i+8] * that.data[2] +
                this.data[i+12] * that.data[3];
            mat.data[i+4] = this.data[i] * that.data[4] +
                this.data[i+4] * that.data[5] +
                this.data[i+8] * that.data[6] +
                this.data[i+12] * that.data[7];
            mat.data[i+8] = this.data[i] * that.data[8] +
                this.data[i+4] * that.data[9] +
                this.data[i+8] * that.data[10] +
                this.data[i+12] * that.data[11];
            mat.data[i+12] = this.data[i] * that.data[12] +
                this.data[i+4] * that.data[13] +
                this.data[i+8] * that.data[14] +
                this.data[i+12] * that.data[15];
        }
        return mat;
    };

    /**
     * Multiplies the provded argument by the matrix.
     * @memberof Mat44
     *
     * @param {Vec3|Vec4|Mat33|Mat44|Array|number} - The argument to be multiplied by the matrix.
     *
     * @returns {Mat44|Vec4} The resulting product.
     */
    Mat44.prototype.mult = function( that ) {
        if ( typeof that === "number" ) {
            // scalar
            return this.multScalar( that );
        } else if ( that instanceof Array ) {
            // array
            if ( that.length === 3 ) {
                return this.multVector3( that );
            } else if ( that.length === 4 ) {
                return this.multVector4( that );
            } else {
                return this.multMatrix( that );
            }
        }
        // vector
        if ( that.x !== undefined &&
            that.y !== undefined &&
            that.z !== undefined ) {
            if ( that.w !== undefined ) {
                // vec4
                return this.multVector4( that );
            }
            //vec3
            return this.multVector3( that );
        }
        // matrix
        return this.multMatrix( that );
    };

    /**
     * Divides all components of the matrix by the provded scalar argument,
     * returning a new Mat44 object.
     * @memberof Mat44
     *
     * @param {number} - The scalar to divide the matrix by.
     *
     * @returns {Mat44} The resulting matrix.
     */
    Mat44.prototype.div = function( that ) {
        var mat = new Mat44(), i;
        for ( i=0; i<16; i++ ) {
            mat.data[i] = this.data[i] / that;
        }
        return mat;
    };

    /**
     * Returns true if the all components match those of a provided matrix.
     * An optional epsilon value may be provided.
     * @memberof Mat44
     *
     * @param {Mat44|Array} that - The matrix to test equality with.
     * @param {number} epsilon - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the matrix components match.
     */
    Mat44.prototype.equals = function( that, epsilon ) {
        var i;
        epsilon = epsilon === undefined ? 0 : epsilon;
        for ( i=0; i<16; i++ ) {
            // awkward comparison logic is required to ensure equality passes if
            // corresponding are both undefined, NaN, or Infinity
            if ( !(
                ( this.data[i] === that.data[i] ) ||
                ( Math.abs( this.data[i] - that.data[i] ) <= epsilon )
               ) ) {
                return false;
            }
        }
        return true;
    };

    /**
     * Returns an othrographic projection matrix.
     *
     * @param {number} xMin - The minimum x extent of the projection.
     * @param {number} xMax - The maximum x extent of the projection.
     * @param {number} xMin - The minimum y extent of the projection.
     * @param {number} xMax - The maximum y extent of the projection.
     * @param {number} xMin - The minimum z extent of the projection.
     * @param {number} xMin - The maximum z extent of the projection.
     *
     * @returns {Mat44} The orthographic projection matrix.
     */
    Mat44.ortho = function( xMin, xMax, yMin, yMax, zMin, zMax ) {
        var mat = Mat44.identity();
        mat.data[0] = 2 / (xMax - xMin);
        mat.data[5] = 2 / (yMax - yMin);
        mat.data[10] = -2 / (zMax - zMin);
        mat.data[12] = -((xMax + xMin)/(xMax - xMin));
        mat.data[13] = -((yMax + yMin)/(yMax - yMin));
        mat.data[14] = -((zMax + zMin)/(zMax - zMin));
        return mat;
    };

    /**
     * Returns a perspective projection matrix.
     *
     * @param {number} fov - The field of view.
     * @param {number} aspect - The aspect ratio.
     * @param {number} zMin - The minimum y extent of the frustum.
     * @param {number} zMax - The maximum y extent of the frustum.
     *
     * @returns {Mat44} The perspective projection matrix.
     */
    Mat44.perspective = function( fov, aspect, zMin, zMax ) {
        var yMax = zMin * Math.tan( fov * ( Math.PI / 360.0 ) ),
            yMin = -yMax,
            xMin = yMin * aspect,
            xMax = -xMin,
            mat = Mat44.identity();
        mat.data[0] = (2 * zMin) / (xMax - xMin);
        mat.data[5] = (2 * zMin) / (yMax - yMin);
        mat.data[8] = (xMax + xMin) / (xMax - xMin);
        mat.data[9] = (yMax + yMin) / (yMax - yMin);
        mat.data[10] = -((zMax + zMin) / (zMax - zMin));
        mat.data[11] = -1;
        mat.data[14] = -( ( 2 * (zMax*zMin) )/(zMax - zMin));
        mat.data[15] = 0;
        return mat;
    };

    /**
     * Returns the transpose of the matrix.
     * @memberof Mat44
     *
     * @returns {Mat44} The transposed matrix.
     */
    Mat44.prototype.transpose = function() {
        var trans = new Mat44(), i;
        for ( i = 0; i < 4; i++ ) {
            trans.data[i*4] = this.data[i];
            trans.data[(i*4)+1] = this.data[i+4];
            trans.data[(i*4)+2] = this.data[i+8];
            trans.data[(i*4)+3] = this.data[i+12];
        }
        return trans;
    };

    /**
     * Returns the inverse of the matrix.
     * @memberof Mat44
     *
     * @returns {Mat44} The inverted matrix.
     */
    Mat44.prototype.inverse = function() {
        var inv = new Mat44(), det;
        // compute inverse
        // row 1
        inv.data[0] = this.data[5]*this.data[10]*this.data[15] -
            this.data[5]*this.data[11]*this.data[14] -
            this.data[9]*this.data[6]*this.data[15] +
            this.data[9]*this.data[7]*this.data[14] +
            this.data[13]*this.data[6]*this.data[11] -
            this.data[13]*this.data[7]*this.data[10];
        inv.data[4] = -this.data[4]*this.data[10]*this.data[15] +
            this.data[4]*this.data[11]*this.data[14] +
            this.data[8]*this.data[6]*this.data[15] -
            this.data[8]*this.data[7]*this.data[14] -
            this.data[12]*this.data[6]*this.data[11] +
            this.data[12]*this.data[7]*this.data[10];
        inv.data[8] = this.data[4]*this.data[9]*this.data[15] -
            this.data[4]*this.data[11]*this.data[13] -
            this.data[8]*this.data[5]*this.data[15] +
            this.data[8]*this.data[7]*this.data[13] +
            this.data[12]*this.data[5]*this.data[11] -
            this.data[12]*this.data[7]*this.data[9];
        inv.data[12] = -this.data[4]*this.data[9]*this.data[14] +
            this.data[4]*this.data[10]*this.data[13] +
            this.data[8]*this.data[5]*this.data[14] -
            this.data[8]*this.data[6]*this.data[13] -
            this.data[12]*this.data[5]*this.data[10] +
            this.data[12]*this.data[6]*this.data[9];
        // row 2
        inv.data[1] = -this.data[1]*this.data[10]*this.data[15] +
            this.data[1]*this.data[11]*this.data[14] +
            this.data[9]*this.data[2]*this.data[15] -
            this.data[9]*this.data[3]*this.data[14] -
            this.data[13]*this.data[2]*this.data[11] +
            this.data[13]*this.data[3]*this.data[10];
        inv.data[5] = this.data[0]*this.data[10]*this.data[15] -
            this.data[0]*this.data[11]*this.data[14] -
            this.data[8]*this.data[2]*this.data[15] +
            this.data[8]*this.data[3]*this.data[14] +
            this.data[12]*this.data[2]*this.data[11] -
            this.data[12]*this.data[3]*this.data[10];
        inv.data[9] = -this.data[0]*this.data[9]*this.data[15] +
            this.data[0]*this.data[11]*this.data[13] +
            this.data[8]*this.data[1]*this.data[15] -
            this.data[8]*this.data[3]*this.data[13] -
            this.data[12]*this.data[1]*this.data[11] +
            this.data[12]*this.data[3]*this.data[9];
        inv.data[13] = this.data[0]*this.data[9]*this.data[14] -
            this.data[0]*this.data[10]*this.data[13] -
            this.data[8]*this.data[1]*this.data[14] +
            this.data[8]*this.data[2]*this.data[13] +
            this.data[12]*this.data[1]*this.data[10] -
            this.data[12]*this.data[2]*this.data[9];
        // row 3
        inv.data[2] = this.data[1]*this.data[6]*this.data[15] -
            this.data[1]*this.data[7]*this.data[14] -
            this.data[5]*this.data[2]*this.data[15] +
            this.data[5]*this.data[3]*this.data[14] +
            this.data[13]*this.data[2]*this.data[7] -
            this.data[13]*this.data[3]*this.data[6];
        inv.data[6] = -this.data[0]*this.data[6]*this.data[15] +
            this.data[0]*this.data[7]*this.data[14] +
            this.data[4]*this.data[2]*this.data[15] -
            this.data[4]*this.data[3]*this.data[14] -
            this.data[12]*this.data[2]*this.data[7] +
            this.data[12]*this.data[3]*this.data[6];
        inv.data[10] = this.data[0]*this.data[5]*this.data[15] -
            this.data[0]*this.data[7]*this.data[13] -
            this.data[4]*this.data[1]*this.data[15] +
            this.data[4]*this.data[3]*this.data[13] +
            this.data[12]*this.data[1]*this.data[7] -
            this.data[12]*this.data[3]*this.data[5];
        inv.data[14] = -this.data[0]*this.data[5]*this.data[14] +
            this.data[0]*this.data[6]*this.data[13] +
            this.data[4]*this.data[1]*this.data[14] -
            this.data[4]*this.data[2]*this.data[13] -
            this.data[12]*this.data[1]*this.data[6] +
            this.data[12]*this.data[2]*this.data[5];
        // row 4
        inv.data[3] = -this.data[1]*this.data[6]*this.data[11] +
            this.data[1]*this.data[7]*this.data[10] +
            this.data[5]*this.data[2]*this.data[11] -
            this.data[5]*this.data[3]*this.data[10] -
            this.data[9]*this.data[2]*this.data[7] +
            this.data[9]*this.data[3]*this.data[6];
        inv.data[7] = this.data[0]*this.data[6]*this.data[11] -
            this.data[0]*this.data[7]*this.data[10] -
            this.data[4]*this.data[2]*this.data[11] +
            this.data[4]*this.data[3]*this.data[10] +
            this.data[8]*this.data[2]*this.data[7] -
            this.data[8]*this.data[3]*this.data[6];
        inv.data[11] = -this.data[0]*this.data[5]*this.data[11] +
            this.data[0]*this.data[7]*this.data[9] +
            this.data[4]*this.data[1]*this.data[11] -
            this.data[4]*this.data[3]*this.data[9] -
            this.data[8]*this.data[1]*this.data[7] +
            this.data[8]*this.data[3]*this.data[5];
        inv.data[15] = this.data[0]*this.data[5]*this.data[10] -
            this.data[0]*this.data[6]*this.data[9] -
            this.data[4]*this.data[1]*this.data[10] +
            this.data[4]*this.data[2]*this.data[9] +
            this.data[8]*this.data[1]*this.data[6] -
            this.data[8]*this.data[2]*this.data[5];
        // calculate determinant
        det = this.data[0]*inv.data[0] +
            this.data[1]*inv.data[4] +
            this.data[2]*inv.data[8] +
            this.data[3]*inv.data[12];
        return inv.mult( 1 / det );
    };

    /**
     * Decomposes the matrix into the corresponding x, y, and z axes, along with
     * a scale.
     * @memberof Mat44
     *
     * @returns {Object} The decomposed components of the matrix.
     */
    Mat44.prototype.decompose = function() {
        // extract transform components
        var col0 = new Vec3( this.col( 0 ) ),
            col1 = new Vec3( this.col( 1 ) ),
            col2 = new Vec3( this.col( 2 ) ),
            col3 = new Vec3( this.col( 3 ) );
        return {
            left: col0.normalize(),
            up: col1.normalize(),
            forward: col2.normalize(),
            origin: col3,
            scale: new Vec3( col0.length(), col1.length(), col2.length() )
        };
    };

    /**
     * Returns a random transform matrix composed of a rotation and scale.
     * @memberof Mat44
     *
     * @returns {Mat44} A random transform matrix.
     */
    Mat44.random = function() {
        var rot = Mat44.rotationRadians( Math.random() * 360, Vec3.random() ),
            scale = Mat44.scale( Math.random() * 10 ),
            translation = Mat44.translation( Vec3.random() );
        return translation.mult( rot.mult( scale ) );
    };

    /**
     * Returns a string representation of the matrix.
     * @memberof Mat44
     *
     * @returns {String} The string representation of the matrix.
     */
    Mat44.prototype.toString = function() {
        return this.data[0] +", "+ this.data[4] +", "+ this.data[8] +", "+ this.data[12] +",\n" +
            this.data[1] +", "+ this.data[5] +", "+ this.data[9] +", "+ this.data[13] +",\n" +
            this.data[2] +", "+ this.data[6] +", "+ this.data[10] +", "+ this.data[14] +",\n" +
            this.data[3] +", "+ this.data[7] +", "+ this.data[11] +", "+ this.data[15];
    };

    /**
     * Returns an array representation of the matrix.
     * @memberof Mat44
     *
     * @returns {Array} The matrix as an array.
     */
    Mat44.prototype.toArray = function() {
        return this.data.slice( 0 );
    };

    module.exports = Mat44;

}());

},{"./Mat33":2,"./Vec3":8,"./Vec4":9}],4:[function(require,module,exports){
(function() {

    "use strict";

    var Vec3 = require('./Vec3'),
        Mat33 = require('./Mat33');

    /**
     * Instantiates a Quaternion object.
     * @class Quaternion
     * @classdesc A quaternion representing an orientation.
     */
    function Quaternion() {
        switch ( arguments.length ) {
            case 1:
                // array or Quaternion argument
                var argument = arguments[0];
                if ( argument.w !== undefined ) {
                    this.w = argument.w;
                } else if ( argument[0] !== undefined ) {
                    this.w = argument[0];
                } else {
                    this.w = 1.0;
                }
                this.x = argument.x || argument[1] || 0.0;
                this.y = argument.y || argument[2] || 0.0;
                this.z = argument.z || argument[3] || 0.0;
                break;
            case 4:
                // individual component arguments
                this.w = arguments[0];
                this.x = arguments[1];
                this.y = arguments[2];
                this.z = arguments[3];
                break;
            default:
                this.w = 1;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                break;
        }
        return this;
    }

    /**
     * Returns a quaternion that represents an oreintation matching
     * the identity matrix.
     * @memberof Quaternion
     *
     * @returns {Quaternion} The identity quaternion.
     */
    Quaternion.identity = function() {
        return new Quaternion( 1, 0, 0, 0 );
    };

    /**
     * Returns a new Quaternion with each component negated.
     * @memberof Quaternion
     *
     * @returns {Quaternion} The negated quaternion.
     */
     Quaternion.prototype.negate = function() {
        return new Quaternion( -this.w, -this.x, -this.y, -this.z );
    };

    /**
     * Concatenates the rotations of the two quaternions, returning
     * a new Quaternion object.
     * @memberof Quaternion
     *
     * @param {Quaternion|Array} that - The quaterion to concatenate.
     *
     * @returns {Quaternion} The resulting concatenated quaternion.
     */
    Quaternion.prototype.mult = function( that ) {
        that = ( that instanceof Array ) ? new Quaternion( that ) : that;
        var w = (that.w * this.w) - (that.x * this.x) - (that.y * this.y) - (that.z * this.z),
            x = this.y*that.z - this.z*that.y + this.w*that.x + this.x*that.w,
            y = this.z*that.x - this.x*that.z + this.w*that.y + this.y*that.w,
            z = this.x*that.y - this.y*that.x + this.w*that.z + this.z*that.w;
        return new Quaternion( w, x, y, z );
    };

    /**
     * Applies the orientation of the quaternion as a rotation
     * matrix to the provided vector, returning a new Vec3 object.
     * @memberof Quaternion
     *
     * @param {Vec3|Vec4|Array} that - The vector to rotate.
     *
     * @returns {Vec3} The resulting rotated vector.
     */
    Quaternion.prototype.rotate = function( that ) {
        that = ( that instanceof Array ) ? new Vec3( that ) : that;
        var vq = new Quaternion( 0, that.x, that.y, that.z ),
            r = this.mult( vq ).mult( this.inverse() );
        return new Vec3( r.x, r.y, r.z );
    };

    /**
     * Returns the rotation matrix that the quaternion represents.
     * @memberof Quaternion
     *
     * @returns {Mat33} The rotation matrix represented by the quaternion.
     */
    Quaternion.prototype.matrix = function() {
        var xx = this.x*this.x,
            yy = this.y*this.y,
            zz = this.z*this.z,
            xy = this.x*this.y,
            xz = this.x*this.z,
            xw = this.x*this.w,
            yz = this.y*this.z,
            yw = this.y*this.w,
            zw = this.z*this.w;
        return new Mat33([
            1 - 2*yy - 2*zz, 2*xy + 2*zw, 2*xz - 2*yw,
            2*xy - 2*zw, 1 - 2*xx - 2*zz, 2*yz + 2*xw,
            2*xz + 2*yw, 2*yz - 2*xw, 1 - 2*xx - 2*yy ]);
    };

    /**
     * Returns a quaternion representing the rotation defined by an axis
     * and an angle.
     * @memberof Quaternion
     *
     * @param {number} angle - The angle of the rotation, in degrees.
     * @param {Vec3|Array} axis - The axis of the rotation.
     *
     * @returns {Quaternion} The quaternion representing the rotation.
     */
    Quaternion.rotationDegrees = function( angle, axis ) {
        return Quaternion.rotationRadians( angle * ( Math.PI/180 ), axis );
    };

    /**
     * Returns a quaternion representing the rotation defined by an axis
     * and an angle.
     * @memberof Quaternion
     *
     * @param {number} angle - The angle of the rotation, in radians.
     * @param {Vec3|Array} axis - The axis of the rotation.
     *
     * @returns {Quaternion} The quaternion representing the rotation.
     */
    Quaternion.rotationRadians = function( angle, axis ) {
        if ( axis instanceof Array ) {
            axis = new Vec3( axis );
        }
        // normalize arguments
        axis = axis.normalize();
        // set quaternion for the equivolent rotation
        var modAngle = ( angle > 0 ) ? angle % (2*Math.PI) : angle % (-2*Math.PI),
            sina = Math.sin( modAngle/2 ),
            cosa = Math.cos( modAngle/2 );
        return new Quaternion(
            cosa,
            axis.x * sina,
            axis.y * sina,
            axis.z * sina ).normalize();
    };

    /**
     * Returns a quaternion that has been spherically interpolated between
     * two provided quaternions for a given t value.
     * @memberof Quaternion
     *
     * @param {Quaternion} fromRot - The rotation at t = 0.
     * @param {Quaternion} toRot - The rotation at t = 1.
     * @param {number} t - The t value, from 0 to 1.
     *
     * @returns {Quaternion} The quaternion representing the interpolated rotation.
     */
    Quaternion.slerp = function( fromRot, toRot, t ) {
        if ( fromRot instanceof Array ) {
            fromRot = new Quaternion( fromRot );
        }
        if ( toRot instanceof Array ) {
            toRot = new Quaternion( toRot );
        }
        // calculate angle between
        var cosHalfTheta = ( fromRot.w * toRot.w ) +
            ( fromRot.x * toRot.x ) +
            ( fromRot.y * toRot.y ) +
            ( fromRot.z * toRot.z );
        // if fromRot=toRot or fromRot=-toRot then theta = 0 and we can return from
        if ( Math.abs( cosHalfTheta ) >= 1 ) {
            return new Quaternion(
                fromRot.w,
                fromRot.x,
                fromRot.y,
                fromRot.z );
        }
        // cosHalfTheta musty be positive to return the shortest angle
        if ( cosHalfTheta < 0 ) {
            fromRot = fromRot.negate();
            cosHalfTheta = -cosHalfTheta;
        }
        var halfTheta = Math.acos( cosHalfTheta );
        var sinHalfTheta = Math.sqrt( 1 - cosHalfTheta * cosHalfTheta );

        var scaleFrom = Math.sin( ( 1.0 - t ) * halfTheta ) / sinHalfTheta;
        var scaleTo = Math.sin( t * halfTheta ) / sinHalfTheta;
        return new Quaternion(
            fromRot.w * scaleFrom + toRot.w * scaleTo,
            fromRot.x * scaleFrom + toRot.x * scaleTo,
            fromRot.y * scaleFrom + toRot.y * scaleTo,
            fromRot.z * scaleFrom + toRot.z * scaleTo );
        /*
        // calculate angle between
        var cosHalfTheta = ( fromRot.w * toRot.w ) +
            ( fromRot.x * toRot.x ) +
            ( fromRot.y * toRot.y ) +
            ( fromRot.z * toRot.z );
        // cosHalfTheta musty be positive to return the shortest angle
        if ( cosHalfTheta < 0 ) {
            fromRot = fromRot.negate();
            cosHalfTheta = -cosHalfTheta;
        }
        // if fromRot=toRot or fromRot=-toRot then theta = 0 and we can return from
        if ( Math.abs( cosHalfTheta ) >= 1 ) {
            return new Quaternion(
                fromRot.w,
                fromRot.x,
                fromRot.y,
                fromRot.z );
        }
        // calculate temporary values.
        var halfTheta = Math.acos( cosHalfTheta );
        var sinHalfTheta = Math.sqrt( 1 - cosHalfTheta * cosHalfTheta );
        // if theta = 180 degrees then result is not fully defined
        // we could rotate around any axis normal to 'fromRot' or 'toRot'
        if ( Math.abs( sinHalfTheta ) < 0.0001 ) {
            return new Quaternion(
                0.5 * ( fromRot.w + toRot.w ),
                0.5 * ( fromRot.x + toRot.x ),
                0.5 * ( fromRot.y + toRot.y ),
                0.5 * ( fromRot.z + toRot.z ) );
        }
        var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta;
        var ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;
        return new Quaternion(
            fromRot.w * ratioA + toRot.w * ratioB,
            fromRot.x * ratioA + toRot.x * ratioB,
            fromRot.y * ratioA + toRot.y * ratioB,
            fromRot.z * ratioA + toRot.z * ratioB );
        */
    };

    /**
     * Returns true if the vector components match those of a provided vector.
     * An optional epsilon value may be provided.
     * @memberof Quaternion
     *
     * @param {Quaternion|Array} - The vector to calculate the dot product with.
     * @param {number} - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the vector components match.
     */
    Quaternion.prototype.equals = function( that, epsilon ) {
        var w = that.w !== undefined ? that.w : that[0],
            x = that.x !== undefined ? that.x : that[1],
            y = that.y !== undefined ? that.y : that[2],
            z = that.z !== undefined ? that.z : that[3];
        epsilon = epsilon === undefined ? 0 : epsilon;
        return ( this.w === w || Math.abs( this.w - w ) <= epsilon ) &&
            ( this.x === x || Math.abs( this.x - x ) <= epsilon ) &&
            ( this.y === y || Math.abs( this.y - y ) <= epsilon ) &&
            ( this.z === z || Math.abs( this.z - z ) <= epsilon );
    };

    /**
     * Returns a new Quaternion of unit length.
     * @memberof Quaternion
     *
     * @returns {Quaternion} The quaternion of unit length.
     */
    Quaternion.prototype.normalize = function() {
        var mag = Math.sqrt(
                this.x*this.x +
                this.y*this.y +
                this.z*this.z +
                this.w*this.w );
        if ( mag !== 0 ) {
            return new Quaternion(
                this.w / mag,
                this.x / mag,
                this.y / mag,
                this.z / mag );
        }
        return new Quaternion();
    };

    /**
     * Returns the conjugate of the quaternion.
     * @memberof Quaternion
     *
     * @returns {Quaternion} The conjugate of the quaternion.
     */
    Quaternion.prototype.conjugate = function() {
         return new Quaternion( this.w, -this.x, -this.y, -this.z );
    };

    /**
     * Returns the inverse of the quaternion.
     * @memberof Quaternion
     *
     * @returns {Quaternion} The inverse of the quaternion.
     */
    Quaternion.prototype.inverse = function() {
        return this.conjugate();
    };

    /**
     * Returns a random Quaternion of unit length.
     * @memberof Quaternion
     *
     * @returns {Quaternion} A random vector of unit length.
     */
    Quaternion.random = function() {
        var axis = Vec3.random().normalize(),
            angle = Math.random();
        return Quaternion.rotationRadians( angle, axis );
    };

    /**
     * Returns a string representation of the quaternion.
     * @memberof Quaternion
     *
     * @returns {String} The string representation of the quaternion.
     */
    Quaternion.prototype.toString = function() {
        return this.x + ", " + this.y + ", " + this.z + ", " + this.w;
    };

    /**
     * Returns an array representation of the quaternion.
     * @memberof Quaternion
     *
     * @returns {Array} The quaternion as an array.
     */
    Quaternion.prototype.toArray = function() {
        return [  this.w, this.x, this.y, this.z ];
    };

    module.exports = Quaternion;

}());

},{"./Mat33":2,"./Vec3":8}],5:[function(require,module,exports){
(function() {

    "use strict";

    var Vec3 = require( './Vec3' ),
        Mat33 = require( './Mat33' ),
        Mat44 = require( './Mat44' );

    /**
     * Instantiates a Transform object.
     * @class Transform
     * @classdesc A transform representing an orientation, position, and scale.
     */
    function Transform( that ) {
        that = that || {};
        if ( that._up &&
            that._forward &&
            that._left &&
            that._origin &&
            that._scale ) {
            // copy Transform by value
            this._up = that.up();
            this._forward = that.forward();
            this._left = that.left();
            this._origin = that.origin();
            this._scale = that.scale();
        } else if ( that.data && that.data instanceof Array ) {
            // Mat33 or Mat44, extract transform components from Mat44
            that = that.decompose();
            this._up = that.up;
            this._forward = that.forward;
            this._left = that.left;
            this._scale = that.scale;
            this._origin = that.origin || new Vec3( 0, 0, 0 );
        } else {
            // default to identity
            this._up = that.up ? new Vec3( that.up ).normalize() : new Vec3( 0, 1, 0 );
            this._forward = that.forward ? new Vec3( that.forward ).normalize() : new Vec3( 0, 0, 1 );
            this._left = that.left ? new Vec3( that.left ).normalize() : this._up.cross( this._forward ).normalize();
            this.origin( that.origin || new Vec3( 0, 0, 0 ) );
            this.scale( that.scale || new Vec3( 1, 1, 1 ) );
        }
        return this;
    }

    /**
     * Returns an identity transform.
     * @memberof Transform
     *
     * @returns {Transform} An identity transform.
     */
    Transform.identity = function() {
        return new Transform({
            up: new Vec3( 0, 1, 0 ),
            forward: new Vec3( 0, 0, 1 ),
            left: new Vec3( 1, 0, 0 ),
            origin: new Vec3( 0, 0, 0 ),
            scale: new Vec3( 1, 1, 1 )
        });
    };

    /**
     * If an argument is provided, sets the origin, otherwise returns the
     * origin by value.
     * @memberof Transform
     *
     * @param {Vec3|Array} origin - The origin. Optional.
     *
     * @returns {Vec3|Transform} The origin, or the transform for chaining.
     */
    Transform.prototype.origin = function( origin ) {
        if ( origin ) {
            this._origin = new Vec3( origin );
            return this;
        }
        return new Vec3( this._origin );
    };

    /**
     * If an argument is provided, sets the forward vector, otherwise returns
     * the forward vector by value. While setting, a rotation matrix from the
     * orignal forward vector to the new is used to rotate all other axes.
     * @memberof Transform
     *
     * @param {Vec3|Array} origin - The forward vector. Optional.
     *
     * @returns {Vec3|Transform} The forward vector, or the transform for chaining.
     */
    Transform.prototype.forward = function( forward ) {
        if ( forward ) {
            if ( forward instanceof Array ) {
                forward = new Vec3( forward ).normalize();
            } else {
                forward = forward.normalize();
            }
            var rot = Mat33.rotationFromTo( this._forward, forward );
            this._forward = forward;
            this._up = rot.mult( this._up ).normalize();
            this._left = rot.mult( this._left ).normalize();
            return this;
        }
        return new Vec3( this._forward );
    };

    /**
     * If an argument is provided, sets the up vector, otherwise returns
     * the up vector by value. While setting, a rotation matrix from the
     * orignal up vector to the new is used to rotate all other axes.
     * @memberof Transform
     *
     * @param {Vec3|Array} origin - The up vector. Optional.
     *
     * @returns {Vec3|Transform} The up vector, or the transform for chaining.
     */
    Transform.prototype.up = function( up ) {
        if ( up ) {
            if ( up instanceof Array ) {
                up = new Vec3( up ).normalize();
            } else {
                up = up.normalize();
            }
            var rot = Mat33.rotationFromTo( this._up, up );
            this._forward = rot.mult( this._forward ).normalize();
            this._up = up;
            this._left = rot.mult( this._left ).normalize();
            return this;
        }
        return new Vec3( this._up );
    };

    /**
     * If an argument is provided, sets the left vector, otherwise returns
     * the left vector by value. While setting, a rotation matrix from the
     * orignal left vector to the new is used to rotate all other axes.
     * @memberof Transform
     *
     * @param {Vec3|Array} origin - The left vector. Optional.
     *
     * @returns {Vec3|Transform} The left vector, or the transform for chaining.
     */
    Transform.prototype.left = function( left ) {
        if ( left ) {
            if ( left instanceof Array ) {
                left = new Vec3( left ).normalize();
            } else {
                left = left.normalize();
            }
            var rot = Mat33.rotationFromTo( this._left, left );
            this._forward = rot.mult( this._forward ).normalize();
            this._up = rot.mult( this._up ).normalize();
            this._left = left;
            return this;
        }
        return new Vec3( this._left );
    };

    /**
     * If an argument is provided, sets the sacle, otherwise returns the
     * scale by value.
     * @memberof Transform
     *
     * @param {Vec3|Array|number} scale - The scale. Optional.
     *
     * @returns {Vec3|Transform} The scale, or the transform for chaining.
     */
    Transform.prototype.scale = function( scale ) {
        if ( scale ) {
            if ( typeof scale === "number" ) {
                this._scale = new Vec3( scale, scale, scale );
            } else {
                this._scale = new Vec3( scale );
            }
            return this;
        }
        return this._scale;
    };

    /**
     * Multiplies the transform by another transform or matrix.
     * @memberof Transform
     *
     * @param {Mat33|Mat44|Transform|Array} that - The transform to multiply with.
     *
     * @returns {Transform} The resulting transform.
     */
    Transform.prototype.mult = function( that ) {
        if ( that instanceof Array ||
            that.data instanceof Array ) {
            // matrix or array
            return new Transform( this.matrix().mult( that ) );
        }
        // transform
        return new Transform( this.matrix().mult( that.matrix() ) );
    };

    /**
     * Returns the transform's scale matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The scale matrix.
     */
    Transform.prototype.scaleMatrix = function() {
        return Mat44.scale( this._scale );
    };

    /**
     * Returns the transform's rotation matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The rotation matrix.
     */
    Transform.prototype.rotationMatrix = function() {
        return new Mat44([
            this._left.x, this._left.y, this._left.z, 0,
            this._up.x, this._up.y, this._up.z, 0,
            this._forward.x, this._forward.y, this._forward.z, 0,
            0, 0, 0, 1 ]);
    };

    /**
     * Returns the transform's translation matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The translation matrix.
     */
    Transform.prototype.translationMatrix = function() {
        return Mat44.translation( this._origin );
    };

    /**
     * Returns the transform's affine-transformation matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The affine-transformation matrix.
     */
    Transform.prototype.matrix = function() {
        // T * R * S
        return this.translationMatrix()
            .mult( this.rotationMatrix() )
            .mult( this.scaleMatrix() );
    };

    /**
     * Returns the inverse of the transform's scale matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The inverse scale matrix.
     */
    Transform.prototype.inverseScaleMatrix = function() {
        return Mat44.scale( new Vec3(
            1/this._scale.x,
            1/this._scale.y,
            1/this._scale.z ) );
    };

    /**
     * Returns the inverse of the transform's rotation matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The inverse rotation matrix.
     */
    Transform.prototype.inverseRotationMatrix = function() {
        return new Mat44([
            this._left.x, this._up.x, this._forward.x, 0,
            this._left.y, this._up.y, this._forward.y, 0,
            this._left.z, this._up.z, this._forward.z, 0,
            0, 0, 0, 1 ]);
    };

    /**
     * Returns the inverse of the transform's translation matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The inverse translation matrix.
     */
    Transform.prototype.inverseTranslationMatrix = function() {
        return Mat44.translation( this._origin.negate() );
    };

    /**
     * Returns the inverse of the transform's affine-transformation matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The inverse affine-transformation matrix.
     */
    Transform.prototype.inverseMatrix = function() {
        // S^-1 * R^-1 * T^-1
        return this.inverseScaleMatrix()
            .mult( this.inverseRotationMatrix() )
            .mult( this.inverseTranslationMatrix() );
    };

    /**
     * Returns the transform's view matrix.
     * @memberof Transform
     *
     * @returns {Mat44} The view matrix.
     */
    Transform.prototype.viewMatrix = function() {
        var nOrigin = this._origin.negate(),
            right = this._left.negate(),
            backward = this._forward.negate();
        return new Mat44([
            right.x, this._up.x, backward.x, 0,
            right.y, this._up.y, backward.y, 0,
            right.z, this._up.z, backward.z, 0,
            nOrigin.dot( right ), nOrigin.dot( this._up ), nOrigin.dot( backward ), 1 ]);
    };

    /**
     * Translates the transform in world space.
     * @memberof Transform
     *
     * @param {Vec3} translation - The translation vector.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.translateWorld = function( translation ) {
        this._origin = this._origin.add( translation );
        return this;
    };

    /**
     * Translates the transform in local space.
     * @memberof Transform
     *
     * @param {Vec3} translation - The translation vector.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.translateLocal = function( translation ) {
        if ( translation instanceof Array ) {
            translation = new Vec3( translation );
        }
        this._origin = this._origin.add( this._left.mult( translation.x ) )
            .add( this._up.mult( translation.y ) )
            .add( this._forward.mult( translation.z ) );
        return this;
    };

    /**
     * Rotates the transform by an angle around an axis in world space.
     * @memberof Transform
     *
     * @param {number} angle - The angle of the rotation, in degrees.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.rotateWorldDegrees = function( angle, axis ) {
        return this.rotateWorldRadians( angle * Math.PI / 180, axis );
    };

    /**
     * Rotates the transform by an angle around an axis in world space.
     * @memberof Transform
     *
     * @param {number} angle - The angle of the rotation, in radians.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.rotateWorldRadians = function( angle, axis ) {
        var rot = Mat33.rotationRadians( angle, axis );
        this._up = rot.mult( this._up );
        this._forward = rot.mult( this._forward );
        this._left = rot.mult( this._left );
        return this;
    };

    /**
     * Rotates the transform by an angle around an axis in local space.
     * @memberof Transform
     *
     * @param {number} angle - The angle of the rotation, in degrees.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.rotateLocalDegrees = function( angle, axis ) {
        return this.rotateWorldDegrees( angle, this.rotationMatrix().mult( axis ) );
    };

    /**
     * Rotates the transform by an angle around an axis in local space.
     * @memberof Transform
     *
     * @param {number} angle - The angle of the rotation, in radians.
     * @param {Vec3} axis - The axis of the rotation.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.rotateLocalRadians = function( angle, axis ) {
        return this.rotateWorldRadians( angle, this.rotationMatrix().mult( axis ) );
    };

    /**
     * Transforms the vector or matrix argument from the transforms local space
     * to the world space.
     * @memberof Transform
     *
     * @param {Vec3|Vec4|Mat33|Mat44} that - The argument to transform.
     * @param {boolean} ignoreScale - Whether or not to include the scale in the transform.
     * @param {boolean} ignoreRotation - Whether or not to include the rotation in the transform.
     * @param {boolean} ignoreTranslation - Whether or not to include the translation in the transform.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.localToWorld = function( that, ignoreScale, ignoreRotation, ignoreTranslation ) {
        var mat = new Mat44();
        if ( !ignoreScale ) {
            mat = this.scaleMatrix().mult( mat );
        }
        if ( !ignoreRotation ) {
            mat = this.rotationMatrix().mult( mat );
        }
        if ( !ignoreTranslation ) {
            mat = this.translationMatrix().mult( mat );
        }
        return mat.mult( that );
    };

    /**
     * Transforms the vector or matrix argument from world space to the
     * transforms local space.
     * @memberof Transform
     *
     * @param {Vec3|Vec4|Mat33|Mat44} that - The argument to transform.
     * @param {boolean} ignoreScale - Whether or not to include the scale in the transform.
     * @param {boolean} ignoreRotation - Whether or not to include the rotation in the transform.
     * @param {boolean} ignoreTranslation - Whether or not to include the translation in the transform.
     *
     * @returns {Transform} The transform for chaining.
     */
    Transform.prototype.worldToLocal = function( that, ignoreScale, ignoreRotation, ignoreTranslation ) {
        var mat = new Mat44();
        if ( !ignoreTranslation ) {
            mat = this.inverseTranslationMatrix().mult( mat );
        }
        if ( !ignoreRotation ) {
            mat = this.inverseRotationMatrix().mult( mat );
        }
        if ( !ignoreScale ) {
            mat = this.inverseScaleMatrix().mult( mat );
        }
        return mat.mult( that );
    };

    /**
     * Returns true if the all components match those of a provided transform.
     * An optional epsilon value may be provided.
     * @memberof Transform
     *
     * @param {Transform} that - The matrix to test equality with.
     * @param {number} epsilon - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the transform components match.
     */
    Transform.prototype.equals = function( that, epsilon ) {
        return this._origin.equals( that.origin(), epsilon ) &&
            this._forward.equals( that.forward(), epsilon ) &&
            this._up.equals( that.up(), epsilon ) &&
            this._left.equals( that.left(), epsilon ) &&
            this._scale.equals( that.scale(), epsilon );
    };

    /**
     * Returns a transform with a random origin, orientation, and scale.
     * @memberof Transform
     *
     * @returns {Transform} The random transform.
     */
    Transform.random = function() {
        return new Transform()
            .origin( Vec3.random() )
            .forward( Vec3.random() )
            .scale( Vec3.random() );
    };

    /**
     * Returns a string representation of the transform.
     * @memberof Transform
     *
     * @returns {String} The string representation of the transform.
     */
    Transform.prototype.toString = function() {
        return this.matrix().toString();
    };

    module.exports = Transform;

}());

},{"./Mat33":2,"./Mat44":3,"./Vec3":8}],6:[function(require,module,exports){
(function () {

    "use strict";

    var Vec3 = require('./Vec3');

    /**
     * Instantiates a Triangle object.
     * @class Triangle
     * @classdesc A CCW-winded triangle object.
     */
    function Triangle() {
        switch ( arguments.length ) {
            case 1:
                // array or object argument
                var arg = arguments[0];
                this.a = new Vec3( arg[0] || arg.a );
                this.b = new Vec3( arg[1] || arg.b );
                this.c = new Vec3( arg[2] || arg.c );
                break;
            case 3:
                // individual vector arguments
                this.a = new Vec3( arguments[0] );
                this.b = new Vec3( arguments[1] );
                this.c = new Vec3( arguments[2] );
                break;
            default:
                this.a = new Vec3( 0, 0, 0 );
                this.b = new Vec3( 1, 0, 0 );
                this.c = new Vec3( 1, 1, 0 );
                break;
        }
    }

    /**
     * Returns the radius of the bounding sphere of the triangle.
     * @memberof Triangle
     *
     * @returns {number} The radius of the bounding sphere.
     */
    Triangle.prototype.radius = function() {
        var centroid = this.centroid(),
            aDist = this.a.sub( centroid ).length(),
            bDist = this.b.sub( centroid ).length(),
            cDist = this.c.sub( centroid ).length();
        return Math.max( aDist, Math.max( bDist, cDist ) );
    };

    /**
     * Returns the centroid of the triangle.
     * @memberof Triangle
     *
     * @returns {number} The centroid of the triangle.
     */
    Triangle.prototype.centroid = function() {
        return this.a
            .add( this.b )
            .add( this.c )
            .div( 3 );
    };

    /**
     * Returns the normal of the triangle.
     * @memberof Triangle
     *
     * @returns {number} The normal of the triangle.
     */
    Triangle.prototype.normal = function() {
        var ab = this.b.sub( this.a ),
            ac = this.c.sub( this.a );
        return ab.cross( ac ).normalize();
    };

    /**
     * Returns a random Triangle of unit length.
     * @memberof Triangle
     *
     * @returns {Triangle} A random triangle of unit radius.
     */
    Triangle.random = function() {
        var a = Vec3.random(),
            b = Vec3.random(),
            c = Vec3.random(),
            centroid = a.add( b ).add( c ).div( 3 ),
            aCent = a.sub( centroid ),
            bCent = b.sub( centroid ),
            cCent = c.sub( centroid ),
            aDist = aCent.length(),
            bDist = bCent.length(),
            cDist = cCent.length(),
            maxDist = Math.max( Math.max( aDist, bDist ), cDist ),
            scale = 1 / maxDist;
        return new Triangle(
            aCent.mult( scale ),
            bCent.mult( scale ),
            cCent.mult( scale ) );
    };

    /**
     * Returns true if the vector components match those of a provided triangle.
     * An optional epsilon value may be provided.
     * @memberof Triangle
     *
     * @param {Triangle} that - The vector to test equality with.
     * @param {number} epsilon - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the vector components match.
     */
    Triangle.prototype.equals = function( that, epsilon ) {
        epsilon = epsilon === undefined ? 0 : epsilon;
        return this.a.equals( that.a, epsilon ) &&
            this.b.equals( that.b, epsilon ) &&
            this.c.equals( that.c, epsilon );
    };

    /**
     * Returns a string representation of the vector.
     * @memberof Triangle
     *
     * @returns {String} The string representation of the vector.
     */
    Triangle.prototype.toString = function() {
        return this.a.toString() + ", " +
            this.b.toString() + ", " +
            this.c.toString();
    };

    module.exports = Triangle;

}());

},{"./Vec3":8}],7:[function(require,module,exports){
(function() {

    "use strict";

    /**
     * Instantiates a Vec2 object.
     * @class Vec2
     * @classdesc A two component vector.
     */
    function Vec2() {
        switch ( arguments.length ) {
            case 1:
                // array or VecN argument
                var argument = arguments[0];
                this.x = argument.x || argument[0] || 0.0;
                this.y = argument.y || argument[1] || 0.0;
                break;
            case 2:
                // individual component arguments
                this.x = arguments[0];
                this.y = arguments[1];
                break;
            default:
                this.x = 0;
                this.y = 0;
                break;
        }
        return this;
    }

    /**
     * Returns a new Vec2 with each component negated.
     * @memberof Vec2
     *
     * @returns {Vec2} The negated vector.
     */
    Vec2.prototype.negate = function() {
        return new Vec2( -this.x, -this.y );
    };

    /**
     * Adds the vector with the provided vector argument, returning a new Vec2
     * object representing the sum.
     * @memberof Vec2
     *
     * @param {Vec2|Vec3|Vec4|Array} that - The vector to add.
     *
     * @returns {Vec2} The sum of the two vectors.
     */
    Vec2.prototype.add = function( that ) {
        if ( that instanceof Array ) {
            return new Vec2( this.x + that[0], this.y + that[1] );
        }
        return new Vec2( this.x + that.x, this.y + that.y );
    };

    /**
     * Subtracts the provided vector argument from the vector, returning a new Vec2
     * object representing the difference.
     * @memberof Vec2
     *
     * @param {Vec2|Vec3|Vec4|Array} - The vector to subtract.
     *
     * @returns {Vec2} The difference of the two vectors.
     */
    Vec2.prototype.sub = function( that ) {
        if ( that instanceof Array ) {
            return new Vec2( this.x - that[0], this.y - that[1] );
        }
        return new Vec2( this.x - that.x, this.y - that.y );
    };

    /**
     * Multiplies the vector with the provided scalar argument, returning a new Vec2
     * object representing the scaled vector.
     * @memberof Vec2
     *
     * @param {number} - The scalar to multiply the vector by.
     *
     * @returns {Vec2} The scaled vector.
     */
    Vec2.prototype.mult = function( that ) {
        return new Vec2( this.x * that, this.y * that );
    };

    /**
     * Divides the vector with the provided scalar argument, returning a new Vec2
     * object representing the scaled vector.
     * @memberof Vec2
     *
     * @param {number} - The scalar to divide the vector by.
     *
     * @returns {Vec2} The scaled vector.
     */
    Vec2.prototype.div = function( that ) {
        return new Vec2( this.x / that, this.y / that );
    };

    /**
     * Calculates and returns the dot product of the vector and the provided
     * vector argument.
     * @memberof Vec2
     *
     * @param {Vec2|Vec3|Vec4|Array} - The other vector argument.
     *
     * @returns {number} The dot product.
     */
    Vec2.prototype.dot = function( that ) {
        if ( that instanceof Array ) {
            return ( this.x * that[0] ) + ( this.y * that[1] );
        }
        return ( this.x * that.x ) + ( this.y * that.y );
    };

    /**
     * Calculates and returns 2D cross product of the vector and the provided
     * vector argument. This value represents the magnitude of the vector that
     * would result from a regular 3D cross product of the input vectors,
     * taking their Z values as 0.
     * @memberof Vec2
     *
     * @param {Vec2|Vec3|Vec4|Array} - The other vector argument.
     *
     * @returns {number} The 2D cross product.
     */
    Vec2.prototype.cross = function( that ) {
        if ( that instanceof Array ) {
            return ( this.x * that[1] ) - ( this.y * that[0] );
        }
         return ( this.x * that.y ) - ( this.y * that.x );
    };

    /**
     * If no argument is provided, this function returns the scalar length of
     * the vector. If an argument is provided, this method will return a new
     * Vec2 scaled to the provided length.
     * @memberof Vec2
     *
     * @param {number} - The length to scale the vector to. Optional.
     *
     * @returns {number|Vec2} Either the length, or new scaled vector.
     */
    Vec2.prototype.length = function( length ) {
        if ( length === undefined ) {
            return Math.sqrt( this.dot( this ) );
        }
        return this.normalize().mult( length );
    };

    /**
     * Returns the squared length of the vector.
     * @memberof Vec2
     *
     * @returns {number} The squared length of the vector.
     */
    Vec2.prototype.lengthSquared = function() {
        return this.dot( this );
    };

    /**
     * Returns true if the vector components match those of a provided vector.
     * An optional epsilon value may be provided.
     * @memberof Vec2
     *
     * @param {Vec2|Vec3|Vec4|Array} that - The vector to test equality with.
     * @param {number} epsilon - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the vector components match.
     */
    Vec2.prototype.equals = function( that, epsilon ) {
        var x = that.x !== undefined ? that.x : that[0],
            y = that.y !== undefined ? that.y : that[1];
        epsilon = epsilon === undefined ? 0 : epsilon;
        return ( this.x === x || Math.abs( this.x - x ) <= epsilon ) &&
            ( this.y === y || Math.abs( this.y - y ) <= epsilon );
    };

    /**
     * Returns a new Vec2 of unit length.
     * @memberof Vec2
     *
     * @returns {Vec2} The vector of unit length.
     */
    Vec2.prototype.normalize = function() {
        var mag = this.length();
        if ( mag !== 0 ) {
            return new Vec2(
                this.x / mag,
                this.y / mag );
        }
        return new Vec2();
    };

    /**
     * Returns a random Vec2 of unit length.
     * @memberof Vec2
     *
     * @returns {Vec2} A random vector of unit length.
     */
    Vec2.random = function() {
        return new Vec2(
            Math.random(),
            Math.random() ).normalize();
    };

    /**
     * Returns a string representation of the vector.
     * @memberof Vec2
     *
     * @returns {String} The string representation of the vector.
     */
    Vec2.prototype.toString = function() {
        return this.x + ", " + this.y;
    };

    /**
     * Returns an array representation of the vector.
     * @memberof Vec2
     *
     * @returns {Array} The vector as an array.
     */
    Vec2.prototype.toArray = function() {
        return [ this.x, this.y ];
    };

    module.exports = Vec2;

}());

},{}],8:[function(require,module,exports){
(function() {

    "use strict";

    /**
     * Instantiates a Vec3 object.
     * @class Vec3
     * @classdesc A three component vector.
     */
    function Vec3() {
        switch ( arguments.length ) {
            case 1:
                // array or VecN argument
                var argument = arguments[0];
                this.x = argument.x || argument[0] || 0.0;
                this.y = argument.y || argument[1] || 0.0;
                this.z = argument.z || argument[2] || 0.0;
                break;
            case 3:
                // individual component arguments
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
                break;
            default:
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                break;
        }
        return this;
    }

    /**
     * Returns a new Vec3 with each component negated.
     * @memberof Vec3
     *
     * @returns {Vec3} The negated vector.
     */
    Vec3.prototype.negate = function() {
        return new Vec3( -this.x, -this.y, -this.z );
    };

    /**
     * Adds the vector with the provided vector argument, returning a new Vec3
     * object representing the sum.
     * @memberof Vec3
     *
     * @param {Vec3|Vec4|Array} that - The vector to add.
     *
     * @returns {Vec3} The sum of the two vectors.
     */
    Vec3.prototype.add = function( that ) {
        if ( that instanceof Array ) {
            return new Vec3( this.x + that[0], this.y + that[1], this.z + that[2] );
        }
        return new Vec3( this.x + that.x, this.y + that.y, this.z + that.z );
    };

    /**
     * Subtracts the provided vector argument from the vector, returning a new
     * Vec3 object representing the difference.
     * @memberof Vec3
     *
     * @param {Vec3|Vec4|Array} - The vector to subtract.
     *
     * @returns {Vec3} The difference of the two vectors.
     */
    Vec3.prototype.sub = function( that ) {
        if ( that instanceof Array ) {
            return new Vec3( this.x - that[0], this.y - that[1], this.z - that[2] );
        }
        return new Vec3( this.x - that.x, this.y - that.y, this.z - that.z );
    };

    /**
     * Multiplies the vector with the provided scalar argument, returning a new Vec3
     * object representing the scaled vector.
     * @memberof Vec3
     *
     * @param {number} - The scalar to multiply the vector by.
     *
     * @returns {Vec3} The scaled vector.
     */
    Vec3.prototype.mult = function( that ) {
        return new Vec3( this.x * that, this.y * that, this.z * that );
    };

    /**
     * Divides the vector with the provided scalar argument, returning a new Vec3
     * object representing the scaled vector.
     * @memberof Vec3
     *
     * @param {number} - The scalar to divide the vector by.
     *
     * @returns {Vec3} The scaled vector.
     */
    Vec3.prototype.div = function( that ) {
        return new Vec3( this.x / that, this.y / that, this.z / that );
    };

    /**
     * Calculates and returns the dot product of the vector and the provided
     * vector argument.
     * @memberof Vec3
     *
     * @param {Vec3|Vec4|Array} - The other vector argument.
     *
     * @returns {number} The dot product.
     */
    Vec3.prototype.dot = function( that ) {
        if ( that instanceof Array ) {
            return ( this.x * that[0] ) + ( this.y * that[1] ) + ( this.z * that[2] );
        }
        return ( this.x * that.x ) + ( this.y * that.y ) + ( this.z * that.z );
    };

    /**
     * Calculates and returns the cross product of the vector and the provided
     * vector argument.
     * @memberof Vec3
     *
     * @param {Vec3|Vec4|Array} - The other vector argument.
     *
     * @returns {number} The 2D cross product.
     */
    Vec3.prototype.cross = function( that ) {
        if ( that instanceof Array ) {
            return new Vec3(
                ( this.y * that[2] ) - ( that[1] * this.z ),
                (-this.x * that[2] ) + ( that[0] * this.z ),
                ( this.x * that[1] ) - ( that[0] * this.y ) );
        }
        return new Vec3(
            ( this.y * that.z ) - ( that.y * this.z ),
            (-this.x * that.z ) + ( that.x * this.z ),
            ( this.x * that.y ) - ( that.x * this.y ) );
    };

    /**
     * If no argument is provided, this function returns the scalar length of
     * the vector. If an argument is provided, this method will return a new
     * Vec3 scaled to the provided length.
     * @memberof Vec3
     *
     * @param {number} - The length to scale the vector to. Optional.
     *
     * @returns {number|Vec3} Either the length, or new scaled vector.
     */
    Vec3.prototype.length = function( length ) {
        if ( length === undefined ) {
            return Math.sqrt( this.dot( this ) );
        }
        return this.normalize().mult( length );
    };

    /**
     * Returns the squared length of the vector.
     * @memberof Vec3
     *
     * @returns {number} The squared length of the vector.
     */
    Vec3.prototype.lengthSquared = function() {
        return this.dot( this );
    };

    /**
     * Returns true if the vector components match those of a provided vector.
     * An optional epsilon value may be provided.
     * @memberof Vec3
     *
     * @param {Vec3|Vec4|Array} that - The vector to test equality with.
     * @param {number} epsilon - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the vector components match.
     */
    Vec3.prototype.equals = function( that, epsilon ) {
        var x = that.x !== undefined ? that.x : that[0],
            y = that.y !== undefined ? that.y : that[1],
            z = that.z !== undefined ? that.z : that[2];
        epsilon = epsilon === undefined ? 0 : epsilon;
        return ( this.x === x || Math.abs( this.x - x ) <= epsilon ) &&
            ( this.y === y || Math.abs( this.y - y ) <= epsilon ) &&
            ( this.z === z || Math.abs( this.z - z ) <= epsilon );
    };

    /**
     * Returns a new Vec3 of unit length.
     * @memberof Vec3
     *
     * @returns {Vec3} The vector of unit length.
     */
    Vec3.prototype.normalize = function() {
        var mag = this.length();
        if ( mag !== 0 ) {
            return new Vec3(
                this.x / mag,
                this.y / mag,
                this.z / mag );
        }
        return new Vec3();
    };

    /**
     * Returns a random Vec3 of unit length.
     * @memberof Vec3
     *
     * @returns {Vec3} A random vector of unit length.
     */
    Vec3.random = function() {
        return new Vec3(
            Math.random(),
            Math.random(),
            Math.random() ).normalize();
    };

    /**
     * Returns a string representation of the vector.
     * @memberof Vec3
     *
     * @returns {String} The string representation of the vector.
     */
    Vec3.prototype.toString = function() {
        return this.x + ", " + this.y + ", " + this.z;
    };

    /**
     * Returns an array representation of the vector.
     * @memberof Vec3
     *
     * @returns {Array} The vector as an array.
     */
    Vec3.prototype.toArray = function() {
        return [ this.x, this.y, this.z ];
    };

    module.exports = Vec3;

}());

},{}],9:[function(require,module,exports){
(function() {

    "use strict";

    /**
     * Instantiates a Vec4 object.
     * @class Vec4
     * @classdesc A four component vector.
     */
    function Vec4() {
        switch ( arguments.length ) {
            case 1:
                // array or VecN argument
                var argument = arguments[0];
                this.x = argument.x || argument[0] || 0.0;
                this.y = argument.y || argument[1] || 0.0;
                this.z = argument.z || argument[2] || 0.0;
                this.w = argument.w || argument[3] || 0.0;
                break;
            case 4:
                // individual component arguments
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
                this.w = arguments[3];
                break;
            default:
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                this.w = 0.0;
                break;
        }
        return this;
    }

    /**
     * Returns a new Vec4 with each component negated.
     * @memberof Vec4
     *
     * @returns {Vec4} The negated vector.
     */
    Vec4.prototype.negate = function() {
        return new Vec4( -this.x, -this.y, -this.z, -this.w );
    };

    /**
     * Adds the vector with the provided vector argument, returning a new Vec4
     * object representing the sum.
     * @memberof Vec4
     *
     * @param {Vec4|Array} that - The vector to add.
     *
     * @returns {Vec4} The sum of the two vectors.
     */
    Vec4.prototype.add = function( that ) {
        if ( that instanceof Array ) {
            return new Vec4(
                this.x + that[0],
                this.y + that[1],
                this.z + that[2],
                this.w + that[3] );
        }
        return new Vec4(
            this.x + that.x,
            this.y + that.y,
            this.z + that.z,
            this.w + that.w );
    };

    /**
     * Subtracts the provided vector argument from the vector, returning a new Vec4
     * object representing the difference.
     * @memberof Vec4
     *
     * @param {Vec4|Array} - The vector to subtract.
     *
     * @returns {Vec4} The difference of the two vectors.
     */
    Vec4.prototype.sub = function( that ) {
        if ( that instanceof Array ) {
            return new Vec4(
                this.x - that[0],
                this.y - that[1],
                this.z - that[2],
                this.w - that[3] );
        }
        return new Vec4(
            this.x - that.x,
            this.y - that.y,
            this.z - that.z,
            this.w - that.w );
    };

    /**
     * Multiplies the vector with the provided scalar argument, returning a new Vec4
     * object representing the scaled vector.
     * @memberof Vec4
     *
     * @param {number} - The scalar to multiply the vector by.
     *
     * @returns {Vec4} The scaled vector.
     */
    Vec4.prototype.mult = function( that ) {
        return new Vec4(
            this.x * that,
            this.y * that,
            this.z * that,
            this.w * that );
    };

    /**
     * Divides the vector with the provided scalar argument, returning a new Vec4
     * object representing the scaled vector.
     * @memberof Vec4
     *
     * @param {number} - The scalar to divide the vector by.
     *
     * @returns {Vec4} The scaled vector.
     */
    Vec4.prototype.div = function( that ) {
        return new Vec4(
            this.x / that,
            this.y / that,
            this.z / that,
            this.w / that );
    };

    /**
     * Calculates and returns the dot product of the vector and the provided
     * vector argument.
     * @memberof Vec4
     *
     * @param {Vec4|Array} - The other vector argument.
     *
     * @returns {number} The dot product.
     */
    Vec4.prototype.dot = function( that ) {
        if ( that instanceof Array ) {
            return ( this.x * that[0] ) +
                ( this.y * that[1] ) +
                ( this.z * that[2] ) +
                ( this.w * that[3] );
        }
        return ( this.x * that.x ) +
            ( this.y * that.y ) +
            ( this.z * that.z ) +
            ( this.w * that.w );
    };

    /**
     * If no argument is provided, this function returns the scalar length of
     * the vector. If an argument is provided, this method will return a new
     * Vec4 scaled to the provided length.
     * @memberof Vec4
     *
     * @param {number} - The length to scale the vector to. Optional.
     *
     * @returns {number|Vec4} Either the length, or new scaled vector.
     */
    Vec4.prototype.length = function( length ) {
        if ( length === undefined ) {
            return Math.sqrt( this.dot( this ) );
        }
        return this.normalize().mult( length );
    };

    /**
     * Returns the squared length of the vector.
     * @memberof Vec4
     *
     * @returns {number} The squared length of the vector.
     */
    Vec4.prototype.lengthSquared = function() {
        return this.dot( this );
    };

    /**
     * Returns true if the vector components match those of a provided vector.
     * An optional epsilon value may be provided.
     * @memberof Vec4
     *
     * @param {Vec4|Array} that - The vector to test equality with.
     * @param {number} epsilon - The epsilon value. Optional.
     *
     * @returns {boolean} Whether or not the vector components match.
     */
    Vec4.prototype.equals = function( that, epsilon ) {
        var x = that.x !== undefined ? that.x : that[0],
            y = that.y !== undefined ? that.y : that[1],
            z = that.z !== undefined ? that.z : that[2],
            w = that.w !== undefined ? that.w : that[3];
        epsilon = epsilon === undefined ? 0 : epsilon;
        return ( this.x === x || Math.abs( this.x - x ) <= epsilon ) &&
            ( this.y === y || Math.abs( this.y - y ) <= epsilon ) &&
            ( this.z === z || Math.abs( this.z - z ) <= epsilon ) &&
            ( this.w === w || Math.abs( this.w - w ) <= epsilon );
    };

    /**
     * Returns a new Vec4 of unit length.
     * @memberof Vec4
     *
     * @returns {Vec4} The vector of unit length.
     */
    Vec4.prototype.normalize = function() {
        var mag = this.length();
        if ( mag !== 0 ) {
            return new Vec4(
                this.x / mag,
                this.y / mag,
                this.z / mag,
                this.w / mag );
        }
        return new Vec4();
    };

    /**
     * Returns a random Vec4 of unit length.
     * @memberof Vec4
     *
     * @returns {Vec4} A random vector of unit length.
     */
    Vec4.random = function() {
        return new Vec4(
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random() ).normalize();
    };

    /**
     * Returns a string representation of the vector.
     * @memberof Vec4
     *
     * @returns {String} The string representation of the vector.
     */
    Vec4.prototype.toString = function() {
        return this.x + ", " + this.y + ", " + this.z + ", " + this.w;
    };

    /**
     * Returns an array representation of the vector.
     * @memberof Vec4
     *
     * @returns {Array} The vector as an array.
     */
    Vec4.prototype.toArray = function() {
        return [ this.x, this.y, this.z, this.w ];
    };

    module.exports = Vec4;

}());

},{}],10:[function(require,module,exports){
(function () {

    "use strict";

    module.exports = {
        Mat33: require('./Mat33'),
        Mat44: require('./Mat44'),
        Vec2: require('./Vec2'),
        Vec3: require('./Vec3'),
        Vec4: require('./Vec3'),
        Quaternion: require('./Quaternion'),
        Transform: require('./Transform'),
        Triangle: require('./Triangle')
    };

}());

},{"./Mat33":2,"./Mat44":3,"./Quaternion":4,"./Transform":5,"./Triangle":6,"./Vec2":7,"./Vec3":8}],11:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iXX0=
},{"_process":12}],12:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Deferred, PENDING, REJECTED, RESOLVED, VERSION, after, execute, flatten, has, installInto, isArguments, isPromise, wrap, _when,
    __slice = [].slice;

  VERSION = '3.0.0';

  PENDING = "pending";

  RESOLVED = "resolved";

  REJECTED = "rejected";

  has = function(obj, prop) {
    return obj != null ? obj.hasOwnProperty(prop) : void 0;
  };

  isArguments = function(obj) {
    return has(obj, 'length') && has(obj, 'callee');
  };

  isPromise = function(obj) {
    return has(obj, 'promise') && typeof (obj != null ? obj.promise : void 0) === 'function';
  };

  flatten = function(array) {
    if (isArguments(array)) {
      return flatten(Array.prototype.slice.call(array));
    }
    if (!Array.isArray(array)) {
      return [array];
    }
    return array.reduce(function(memo, value) {
      if (Array.isArray(value)) {
        return memo.concat(flatten(value));
      }
      memo.push(value);
      return memo;
    }, []);
  };

  after = function(times, func) {
    if (times <= 0) {
      return func();
    }
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  wrap = function(func, wrapper) {
    return function() {
      var args;
      args = [func].concat(Array.prototype.slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  execute = function(callbacks, args, context) {
    var callback, _i, _len, _ref, _results;
    _ref = flatten(callbacks);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback.call.apply(callback, [context].concat(__slice.call(args))));
    }
    return _results;
  };

  Deferred = function() {
    var candidate, close, closingArguments, doneCallbacks, failCallbacks, progressCallbacks, state;
    state = PENDING;
    doneCallbacks = [];
    failCallbacks = [];
    progressCallbacks = [];
    closingArguments = {
      'resolved': {},
      'rejected': {},
      'pending': {}
    };
    this.promise = function(candidate) {
      var pipe, storeCallbacks;
      candidate = candidate || {};
      candidate.state = function() {
        return state;
      };
      storeCallbacks = function(shouldExecuteImmediately, holder, holderState) {
        return function() {
          if (state === PENDING) {
            holder.push.apply(holder, flatten(arguments));
          }
          if (shouldExecuteImmediately()) {
            execute(arguments, closingArguments[holderState]);
          }
          return candidate;
        };
      };
      candidate.done = storeCallbacks((function() {
        return state === RESOLVED;
      }), doneCallbacks, RESOLVED);
      candidate.fail = storeCallbacks((function() {
        return state === REJECTED;
      }), failCallbacks, REJECTED);
      candidate.progress = storeCallbacks((function() {
        return state !== PENDING;
      }), progressCallbacks, PENDING);
      candidate.always = function() {
        var _ref;
        return (_ref = candidate.done.apply(candidate, arguments)).fail.apply(_ref, arguments);
      };
      pipe = function(doneFilter, failFilter, progressFilter) {
        var filter, master;
        master = new Deferred();
        filter = function(source, funnel, callback) {
          if (!callback) {
            return candidate[source](master[funnel]);
          }
          return candidate[source](function() {
            var args, value;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            value = callback.apply(null, args);
            if (isPromise(value)) {
              return value.done(master.resolve).fail(master.reject).progress(master.notify);
            } else {
              return master[funnel](value);
            }
          });
        };
        filter('done', 'resolve', doneFilter);
        filter('fail', 'reject', failFilter);
        filter('progress', 'notify', progressFilter);
        return master;
      };
      candidate.pipe = pipe;
      candidate.then = pipe;
      if (candidate.promise == null) {
        candidate.promise = function() {
          return candidate;
        };
      }
      return candidate;
    };
    this.promise(this);
    candidate = this;
    close = function(finalState, callbacks, context) {
      return function() {
        if (state === PENDING) {
          state = finalState;
          closingArguments[finalState] = arguments;
          execute(callbacks, closingArguments[finalState], context);
          return candidate;
        }
        return this;
      };
    };
    this.resolve = close(RESOLVED, doneCallbacks);
    this.reject = close(REJECTED, failCallbacks);
    this.notify = close(PENDING, progressCallbacks);
    this.resolveWith = function(context, args) {
      return close(RESOLVED, doneCallbacks, context).apply(null, args);
    };
    this.rejectWith = function(context, args) {
      return close(REJECTED, failCallbacks, context).apply(null, args);
    };
    this.notifyWith = function(context, args) {
      return close(PENDING, progressCallbacks, context).apply(null, args);
    };
    return this;
  };

  _when = function() {
    var def, defs, finish, resolutionArgs, trigger, _i, _len;
    defs = flatten(arguments);
    if (defs.length === 1) {
      if (isPromise(defs[0])) {
        return defs[0];
      } else {
        return (new Deferred()).resolve(defs[0]).promise();
      }
    }
    trigger = new Deferred();
    if (!defs.length) {
      return trigger.resolve().promise();
    }
    resolutionArgs = [];
    finish = after(defs.length, function() {
      return trigger.resolve.apply(trigger, resolutionArgs);
    });
    defs.forEach(function(def, index) {
      if (isPromise(def)) {
        return def.done(function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          resolutionArgs[index] = args.length > 1 ? args : args[0];
          return finish();
        });
      } else {
        resolutionArgs[index] = def;
        return finish();
      }
    });
    for (_i = 0, _len = defs.length; _i < _len; _i++) {
      def = defs[_i];
      isPromise(def) && def.fail(trigger.reject);
    }
    return trigger.promise();
  };

  installInto = function(fw) {
    fw.Deferred = function() {
      return new Deferred();
    };
    fw.ajax = wrap(fw.ajax, function(ajax, options) {
      var createWrapper, def, promise, xhr;
      if (options == null) {
        options = {};
      }
      def = new Deferred();
      createWrapper = function(wrapped, finisher) {
        return wrap(wrapped, function() {
          var args, func;
          func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (func) {
            func.apply(null, args);
          }
          return finisher.apply(null, args);
        });
      };
      options.success = createWrapper(options.success, def.resolve);
      options.error = createWrapper(options.error, def.reject);
      xhr = ajax(options);
      promise = def.promise();
      promise.abort = function() {
        return xhr.abort();
      };
      return promise;
    });
    return fw.when = _when;
  };

  if (typeof exports !== 'undefined') {
    exports.Deferred = function() {
      return new Deferred();
    };
    exports.when = _when;
    exports.installInto = installInto;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      if (typeof Zepto !== 'undefined') {
        return installInto(Zepto);
      } else {
        Deferred.when = _when;
        Deferred.installInto = installInto;
        return Deferred;
      }
    });
  } else if (typeof Zepto !== 'undefined') {
    installInto(Zepto);
  } else {
    this.Deferred = function() {
      return new Deferred();
    };
    this.Deferred.when = _when;
    this.Deferred.installInto = installInto;
  }

}).call(this);

},{}],14:[function(require,module,exports){
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

},{"../render/Camera":26,"./RenderTarget":16,"./Texture2D":19,"./TextureCubeMap":20,"./Viewport":23,"./WebGLContext":24}],15:[function(require,module,exports){
(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        _boundBuffer = null;

    /**
     * Instantiates an IndexBuffer object.
     * @class IndexBuffer
     * @classdesc An index buffer object.
     */
    function IndexBuffer( array, options ) {
        options = options || {};
        this.gl = WebGLContext.get();
        this.id = 0;
        this.count = 0;
        this.offset = ( options.offset !== undefined ) ? options.offset : 0;
        this.mode = options.mode || "TRIANGLES";
        if ( array instanceof WebGLBuffer ) {
            // if the argument is already a webglbuffer, simply wrap it
            this.id = array;
            this.type = options.type || "UNSIGNED_SHORT";
            this.count = ( options.count !== undefined ) ? options.count : 0;
        } else {
            // otherwise, buffer it
            this.bufferData( array );
        }
    }

    /**
     * Upload index data to the GPU.
     * @memberof IndexBuffer
     *
     * @param {Array|Uint16Array|Uint32Array} array - The array of data to buffer.
     *
     * @returns {IndexBuffer} The index buffer object for chaining.
     */
    IndexBuffer.prototype.bufferData = function( array ) {
        var gl = this.gl;
        // check for type support
        var uint32support = WebGLContext.checkExtension( "OES_element_index_uint" );
        if( !uint32support ) {
            // no support for uint32
            if ( array instanceof Array ) {
                // if array, buffer to uint16
                array = new Uint16Array( array );
            } else if ( array instanceof Uint32Array ) {
                // if uint32, downgrade to uint16
                console.warn( "Cannot create IndexBuffer of format " +
                    "gl.UNSIGNED_INT as OES_element_index_uint is not " +
                    "supported, defaulting to gl.UNSIGNED_SHORT" );
                array = new Uint16Array( array );
            }
        } else {
            // uint32 is supported
            if ( array instanceof Array ) {
                // if array, buffer to uint32
                array = new Uint32Array( array );
            }
        }
        // set data type based on array
        if ( array instanceof Uint16Array ) {
            this.type = "UNSIGNED_SHORT";
        } else if ( array instanceof Uint32Array ) {
            this.type = "UNSIGNED_INT";
        } else {
            console.error( "IndexBuffer requires an Array or " +
                "ArrayBuffer argument, command ignored" );
            return;
        }
        // create buffer, store count
        this.id = gl.createBuffer();
        this.count = array.length;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.id );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW );
        return this;
    };

    /**
     * Binds the index buffer object.
     * @memberof IndexBuffer
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.bind = function() {
        // if this buffer is already bound, exit early
        if ( _boundBuffer === this ) {
            return;
        }
        var gl = this.gl;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.id );
        _boundBuffer = this;
        return this;
    };

    /**
     * Unbinds the index buffer object.
     * @memberof IndexBuffer
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.unbind = function() {
        // if there is no buffer bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = this.gl;
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
        _boundBuffer = null;
        return this;
    };

    /**
     * Execute the draw command for the bound buffer.
     * @memberof IndexBuffer
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.draw = function() {
        if ( _boundBuffer === null ) {
            console.warn( "No IndexBuffer is bound, command ignored." );
            return;
        }
        var gl = this.gl;
        gl.drawElements(
            gl[ this.mode ],
            this.count,
            gl[ this.type ],
            this.offset );
        return this;
    };

    module.exports = IndexBuffer;

}());

},{"./WebGLContext":24}],16:[function(require,module,exports){
(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Stack = require('../util/Stack'),
        _stack = new Stack(),
        _boundBuffer = null;

    /**
     * Binds the renderTarget object, caching it to prevent unnecessary rebinds.
     *
     * @param {RenderTarget} renderTarget - The RenderTarget object to bind.
     */
     function bind( renderTarget ) {
        // if this buffer is already bound, exit early
        if ( _boundBuffer === renderTarget ) {
            return;
        }
        var gl = renderTarget.gl;
        gl.bindFramebuffer( gl.FRAMEBUFFER, renderTarget.id );
        _boundBuffer = renderTarget;
    }

    /**
     * Unbinds the renderTarget object. Prevents unnecessary unbinding.
     *
     * @param {RenderTarget} renderTarget - The RenderTarget object to unbind.
     */
     function unbind( renderTarget ) {
        // if there is no buffer bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = renderTarget.gl;
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        _boundBuffer = null;
    }

    /**
     * Instantiates a RenderTarget object.
     * @class RenderTarget
     * @classdesc A renderTarget class to allow rendering to textures.
     */
    function RenderTarget() {
        var gl = this.gl = WebGLContext.get();
        this.id = gl.createFramebuffer();
        this.textures = {};
        return this;
    }

    /**
     * Binds the renderTarget object and pushes it to the front of the stack.
     * @memberof RenderTarget
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.push = function() {
        _stack.push( this );
        bind( this );
        return this;
    };

    /**
     * Unbinds the renderTarget object and binds the renderTarget beneath it on
     * this stack. If there is no underlying renderTarget, bind the backbuffer.
     * @memberof RenderTarget
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.pop = function() {
        var top;
        _stack.pop();
        top = _stack.top();
        if ( top ) {
            bind( top );
        } else {
            unbind( this );
        }
        return this;
    };

    /**
     * Attaches the provided texture to the provided attachment location.
     * @memberof RenderTarget
     *
     * @param {Texture2D} texture - The texture to attach.
     * @param {number} index - The attachment index. (optional)
     * @param {String} target - The texture target type. (optional)
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.setColorTarget = function( texture, index, target ) {
        var gl = this.gl;
        if ( typeof index === "string" ) {
            target = index;
            index = undefined;
        }
        index = ( index !== undefined ) ? index : 0;
        this.textures[ 'color' + index ] = texture;
        this.push();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl[ 'COLOR_ATTACHMENT' + index ],
            gl[ target || "TEXTURE_2D" ],
            texture.id,
            0 );
        this.pop();
        return this;
    };

    /**
     * Attaches the provided texture to the provided attachment location.
     * @memberof RenderTarget
     *
     * @param {Texture2D} texture - The texture to attach.
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.setDepthTarget = function( texture ) {
        var gl = this.gl;
        this.textures.depth = texture;
        this.push();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.TEXTURE_2D,
            texture.id,
            0 );
        this.pop();
        return this;
    };

    /**
     * Clears the color bits of the renderTarget.
     * @memberof RenderTarget
     *
     * @param {number} r - The red value.
     * @param {number} g - The green value.
     * @param {number} b - The blue value.
     * @param {number} a - The alpha value.
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.clearColor = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.COLOR_BUFFER_BIT );
        this.pop();
        return this;
    };

    /**
     * Clears the depth bits of the renderTarget.
     * @memberof RenderTarget
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.clearDepth = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.DEPTH_BUFFER_BIT );
        this.pop();
        return this;
    };

    /**
     * Clears the stencil bits of the renderTarget.
     * @memberof RenderTarget
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.clearStencil = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.STENCIL_BUFFER_BIT );
        this.pop();
        return this;
    };

    /**
     * Clears all the bits of the renderTarget.
     * @memberof RenderTarget
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.clear = function( r, g, b, a ) {
        var gl = this.gl;
        r = ( r !== undefined ) ? r : 0;
        g = ( g !== undefined ) ? g : 0;
        b = ( b !== undefined ) ? b : 0;
        a = ( a !== undefined ) ? a : 0;
        this.push();
        gl.clearColor( r, g, b, a );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
        this.pop();
        return this;
    };

    /**
     * Resizes the renderTarget and all attached textures by the provided height
     * and width.
     * @memberof RenderTarget
     *
     * @param {number} width - The new width of the renderTarget.
     * @param {number} height - The new height of the renderTarget.
     *
     * @returns {RenderTarget} The renderTarget object, for chaining.
     */
    RenderTarget.prototype.resize = function( width, height ) {
        var key;
        if ( !width || !height ) {
            console.warn( "Width or height arguments missing, command ignored." );
            return this;
        }
        for ( key in this.textures ) {
            if ( this.textures.hasOwnProperty( key ) ) {
                this.textures[ key ].resize( width, height );
            }
        }
        return this;
    };

    module.exports = RenderTarget;

}());

},{"../util/Stack":39,"./WebGLContext":24}],17:[function(require,module,exports){
(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        ShaderParser = require('./ShaderParser'),
        Util = require('../util/Util'),
        XHRLoader = require('../util/XHRLoader'),
        Stack = require('../util/Stack'),
        UNIFORM_FUNCTIONS = {
            'bool': 'uniform1i',
            'float': 'uniform1f',
            'int': 'uniform1i',
            'uint': 'unfirom1i',
            'vec2': 'uniform2fv',
            'ivec2': 'uniform2iv',
            'vec3': 'uniform3fv',
            'ivec3': 'uniform3iv',
            'vec4': 'uniform4fv',
            'ivec4': 'uniform4iv',
            'mat2': 'uniformMatrix2fv',
            'mat3': 'uniformMatrix3fv',
            'mat4': 'uniformMatrix4fv',
            'sampler2D': 'uniform1i',
            'samplerCube': 'uniform1i'
        },
        _stack = new Stack(),
        _boundShader = null;

    /**
     * Given vertex and fragment shader source, returns an object containing
     * information pertaining to the uniforms and attribtues declared.
     *
     * @param {String} vertSource - The vertex shader source.
     * @param {String} fragSource - The fragment shader source.
     *
     * @returns {Object} The attribute and uniform information.
     */
    function getAttributesAndUniformsFromSource( vertSource, fragSource ) {
        var declarations = ShaderParser.parseDeclarations(
                [ vertSource, fragSource ],
                [ 'uniform', 'attribute' ]),
            attributes = {},
            uniforms = {},
            attrCount = 0,
            declaration,
            i;
        // for each declaration in the shader
        for ( i=0; i<declarations.length; i++ ) {
            declaration = declarations[i];
            // check if its an attribute or uniform
            if ( declaration.qualifier === 'attribute' ) {
                // if attribute, store type and index
                attributes[ declaration.name ] = {
                    type: declaration.type,
                    index: attrCount++
                };
            } else if ( declaration.qualifier === 'uniform' ) {
                // if uniform, store type and buffer function name
                uniforms[ declaration.name ] = {
                    type: declaration.type,
                    func: UNIFORM_FUNCTIONS[ declaration.type ]
                };
            }
        }
        return {
            attributes: attributes,
            uniforms: uniforms
        };
    }

    /*
     * Given a shader source string and shader type, compiles the shader and
     * returns the resulting WebGLShader object.
     *
     * @param {WebGLRenderingContext} gl - The webgl rendering context.
     * @param {String} shaderSource - The shader source.
     * @param {String} type - The shader type.
     *
     * @returns {WebGLShader} The compiled shader object.
     */
    function compileShader( gl, shaderSource, type ) {
        var shader = gl.createShader( gl[ type ] );
        gl.shaderSource( shader, shaderSource );
        gl.compileShader( shader );
        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            console.error( "An error occurred compiling the shaders: " +
                gl.getShaderInfoLog( shader ) );
            return null;
        }
        return shader;
    }

    /**
     * Binds the attribute locations for the Shader object.
     *
     * @param {Shader} shader - The Shader object.
     */
    function bindAttributeLocations( shader ) {
        var gl = shader.gl,
            attributes = shader.attributes,
            name;
        for ( name in attributes ) {
            if ( attributes.hasOwnProperty( name ) ) {
                // bind the attribute location
                gl.bindAttribLocation(
                    shader.id,
                    attributes[ name ].index,
                    name );
                /*
                console.log( 'Bound vertex attribute \'' + name +
                    '\' to location ' + attributes[ name ].index );
                */
            }
        }
    }

    /**
     * Queries the webgl rendering context for the uniform locations.
     *
     * @param {Shader} shader - The Shader object.
     */
    function getUniformLocations( shader ) {
        var gl = shader.gl,
            uniforms = shader.uniforms,
            uniform,
            name;
        for ( name in uniforms ) {
            if ( uniforms.hasOwnProperty( name ) ) {
                uniform = uniforms[ name ];
                // get the uniform location
                uniform.location = gl.getUniformLocation( shader.id, name );
                /*
                console.log( name + ", " +
                    gl.getUniformLocation( shader.id, name ) + "," );
                */
            }
        }
    }

    /**
     * Returns a function to load shader source from a url.
     *
     * @param {String} url - The url to load the resource from.
     *
     * @returns {Function} The function to load the shader source.
     */
    function loadShaderSource( url ) {
        return function( done ) {
            XHRLoader.load(
                url,
                {
                    responseType: "text",
                    success: done
                });
        };
    }

    /**
     * Returns a function to pass through the shader source.
     *
     * @param {String} source - The source of the shader.
     *
     * @returns {Function} The function to pass through the shader source.
     */
    function passThroughSource( source ) {
        return function( done ) {
            done( source );
        };
    }

    /**
     * Returns a function that takes an array of GLSL source strings and URLs,
     * and resolves them into and array of GLSL source.
     */
    function resolveSources( sources ) {
        return function( done ) {
            var jobs = [];
            sources = sources || [];
            sources = ( !( sources instanceof Array ) ) ? [ sources ] : sources;
            sources.forEach( function( source ) {
                if ( ShaderParser.isGLSL( source ) ) {
                    jobs.push( passThroughSource( source ) );
                } else {
                    jobs.push( loadShaderSource( source ) );
                }
            });
            Util.async( jobs, function( results ) {
                done( results );
            });
        };
    }

    /**
     * Binds the shader object, caching it to prevent unnecessary rebinds.
     *
     * @param {Shader} shader - The Shader object to bind.
     */
    function bind( shader ) {
        // if this shader is already bound, exit early
        if ( _boundShader === shader ) {
            return;
        }
        shader.gl.useProgram( shader.id );
        _boundShader = shader;
    }

    /**
     * Unbinds the shader object. Prevents unnecessary unbinding.
     *
     * @param {Shader} shader - The Shader object to unbind.
     */
    function unbind( shader ) {
        // if there is no shader bound, exit early
        if ( _boundShader === null ) {
            return;
        }
        shader.gl.useProgram( null );
        _boundShader = null;
    }

    /**
     * Clears the shader attributes due to aborting of initialization.
     *
     * @param {Shader} shader - The Shader object.
     */
    function abortShader( shader ) {
        shader.id = null;
        shader.attributes = null;
        shader.uniforms = null;
        return shader;
    }

    /**
     * Instantiates a Shader object.
     * @class Shader
     * @classdesc A shader class to assist in compiling and linking webgl
     * shaders, storing attribute and uniform locations, and buffering uniforms.
     */
    function Shader( spec, callback ) {
        var that = this;
        spec = spec || {};
        this.id = 0;
        this.gl = WebGLContext.get();
        this.version = spec.version || '1.00';
        // check source arguments
        if ( !spec.vert ) {
            console.error( "Vertex shader argument has not been provided, " +
                "shader initialization aborted." );
        }
        if ( !spec.frag ) {
            console.error( "Fragment shader argument has not been provided, " +
                "shader initialization aborted." );
        }
        // create the shader
        Util.async({
            common: resolveSources( spec.common ),
            vert: resolveSources( spec.vert ),
            frag: resolveSources( spec.frag ),
        }, function( shaders ) {
            that.create( shaders );
            if ( callback ) {
                callback( that );
            }
        });
    }

    /**
     * Creates the shader object from source strings. This includes:
     *    1) Compiling and linking the shader program.
     *    2) Parsing shader source for attribute and uniform information.
     *    3) Binding attribute locations, by order of delcaration.
     *    4) Querying and storing uniform location.
     * @memberof Shader
     *
     * @param {Object} shaders - A map containing sources under 'vert' and
     *     'frag' attributes.
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.create = function( shaders ) {
        // once all shader sources are loaded
        var gl = this.gl,
            common = shaders.common.join( "" ),
            vert = shaders.vert.join( "" ),
            frag = shaders.frag.join( "" ),
            vertexShader,
            fragmentShader,
            attributesAndUniforms;
        // compile shaders
        vertexShader = compileShader( gl, common + vert, "VERTEX_SHADER" );
        fragmentShader = compileShader( gl, common + frag, "FRAGMENT_SHADER" );
        if ( !vertexShader || !fragmentShader ) {
            console.error( "Aborting instantiation of shader due to compilation errors." );
            return abortShader( this );
        }
        // parse source for attribute and uniforms
        attributesAndUniforms = getAttributesAndUniformsFromSource( vert, frag );
        // set member attributes
        this.attributes = attributesAndUniforms.attributes;
        this.uniforms = attributesAndUniforms.uniforms;
        // create the shader program
        this.id = gl.createProgram();
        // attach vertex and fragment shaders
        gl.attachShader( this.id, vertexShader );
        gl.attachShader( this.id, fragmentShader );
        // bind vertex attribute locations BEFORE linking
        bindAttributeLocations( this );
        // link shader
        gl.linkProgram( this.id );
        // If creating the shader program failed, alert
        if ( !gl.getProgramParameter( this.id, gl.LINK_STATUS ) ) {
            console.error( "An error occured linking the shader: " +
                gl.getProgramInfoLog( this.id ) );
            console.error( "Aborting instantiation of shader due to linking errors." );
            return abortShader( this );
        }
        // get shader uniform locations
        getUniformLocations( this );
        return this;
    };

    /**
     * Binds the shader object and pushes it to the front of the stack.
     * @memberof Shader
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.push = function() {
        _stack.push( this );
        bind( this );
        return this;
    };

    /**
     * Unbinds the shader object and binds the shader beneath it on
     * this stack. If there is no underlying shader, bind the backbuffer.
     * @memberof Shader
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.pop = function() {
        var top;
        _stack.pop();
        top = _stack.top();
        if ( top ) {
            bind( top );
        } else {
            unbind( this );
        }
        return this;
    };

    /**
     * Buffer a uniform value by name.
     * @memberof Shader
     *
     * @param {String} uniformName - The uniform name in the shader source.
     * @param {*} uniform - The uniform value to buffer.
     *
     * @returns {Shader} The shader object, for chaining.
     */
    Shader.prototype.setUniform = function( uniformName, uniform ) {
        if ( !this.id ) {
            console.warn("Attempting to use an incomplete shader, ignoring command.");
            return;
        }
        var uniformSpec = this.uniforms[ uniformName ],
            func,
            type,
            location,
            value;
        // ensure that the uniform spec exists for the name
        if ( !uniformSpec ) {
            console.warn( 'No uniform found under name "' + uniformName +
                '", command ignored' );
            return;
        }
        // ensure that the uniform argument is defined
        if ( uniform === undefined ) {
            console.warn( 'Argument passed for uniform "' + uniformName +
                '" is undefined, command ignored' );
            return;
        }
        // get the uniform location, type, and buffer function
        func = uniformSpec.func;
        type = uniformSpec.type;
        location = uniformSpec.location;
        value = uniform.toArray ? uniform.toArray() : uniform;
        value = ( value instanceof Array ) ? new Float32Array( value ) : value;
        // convert boolean's to 0 or 1
        value = ( typeof value === "boolean" ) ? ( value ? 1 : 0 ) : value;
        // pass the arguments depending on the type
        switch ( type ) {
            case 'mat2':
            case 'mat3':
            case 'mat4':
                this.gl[ func ]( location, false, value );
                break;
            default:
                this.gl[ func ]( location, value );
                break;
        }
        return this;
    };

    module.exports = Shader;

}());

},{"../util/Stack":39,"../util/Util":40,"../util/XHRLoader":41,"./ShaderParser":18,"./WebGLContext":24}],18:[function(require,module,exports){
(function () {

    "use strict";

    var PRECISION_QUALIFIERS = {
        highp: true,
        mediump: true,
        lowp: true
    };

    /**
     * Removes standard comments from the provided string.
     *
     * @param {String} str - The string to strip comments from.
     *
     * @return {String} The commentless string.
     */
    function stripComments( str ) {
        // regex source: https://github.com/moagrius/stripcomments
        return str.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
    }

    /**
     * Converts all whitespace into a single ' ' space character.
     *
     * @param {String} str - The string to normalize whitespace from.
     *
     * @return {String} The normalized string.
     */
    function normalizeWhitespace( str ) {
        // remove all end lines, replace all whitespace with a single ' ' space
        return str.replace(/(\r\n|\n|\r)/gm,"").replace(/\s{2,}/g, ' ');
    }

    /**
     * Parses a single 'statement'. A 'statement' is considered any sequence of
     * characters followed by a semi-colon. Therefore, a single 'statement' in
     * this sense could contain several comma separated declarations. Returns
     * all resulting declarations.
     *
     * @param {String} statement - The statement to parse.
     *
     * @returns {Array} The array of parsed declaration objects.
     */
    function parseStatement( statement ) {

        function parseNameAndCount( entry ) {
            // split on '[]' and trim whitespce to check for arrays
            var split = entry.split(/[\[\]]/).map( function( elem ) {
                return elem.trim();
            });
            return {
                qualifier: qualifier,
                precision: precision,
                type: type,
                name: split[0],
                count: ( split[1] === undefined ) ? 1 : parseInt( split[1], 10 )
            };
        }

        var results = [],
            commaSplit,
            header,
            qualifier,
            precision,
            type,
            names,
            i;
        // split statement on commas
        commaSplit = statement.split(',').map( function( elem ) {
            return elem.trim();
        });
        // split declaration header from statement
        header = commaSplit.shift().split(' ');
        // qualifier is always first element
        qualifier = header.shift();
        // precision may or may not be declared
        precision = header.shift();
        // if not a precision keyword it is the type instead
        if ( !PRECISION_QUALIFIERS[ precision ] ) {
            type = precision;
            precision = null;
        } else {
            type = header.shift();
        }
        // split remaining names by commas and trim whitespace
        names = header.concat( commaSplit );
        // if there are other names after a ',' add them as well
        for ( i=0; i<names.length; i++ ) {
            results.push( parseNameAndCount( names[i] ) );
        }
        return results;
    }

    /**
     * Splits the source string by semi-colons and constructs an array of
     * declaration objects based on the provided qualifier keywords.
     *
     * @param {String} source - The shader source string.
     * @param {String|Array} keyword - The qualifier declaration keyword.
     *
     * @returns {Array} The array of qualifier declaration objects.
     */
    function parseSource( source, keyword ) {
        // get statements ( any sequence ending in ; ) containing any
        // of the given keywords
        var keywordStr = ( keyword instanceof Array ) ? keyword.join('|') : keyword,
            keywordRegex = new RegExp( "^.*\\b("+keywordStr+")\\b.*", 'gm' ),
            commentlessSource = stripComments( source ),
            normalized = normalizeWhitespace( commentlessSource ),
            statements = normalized.split(';'),
            matched = [],
            match, i;
        // for each statement
        for ( i=0; i<statements.length; i++ ) {
            // look for keywords
            match = statements[i].trim().match( keywordRegex );
            if ( match ) {
                // parse statement and add to array
                matched = matched.concat( parseStatement( match[0] ) );
            }
        }
        return matched;
    }

    /**
     * Filters out duplicate declarations present between shaders.
     *
     * @param {Array} declarations - The array of declarations.
     *
     * @returns {Array} The filtered array of declarations.
     */
    function filterDuplicatesByName( declarations ) {
        // in cases where the same declarations are present in multiple
        // sources, this function will remove duplicates from the results
        var seen = {};
        return declarations.filter( function( declaration ) {
            if ( seen[ declaration.name ] ) {
                return false;
            }
            seen[ declaration.name ] = true;
            return true;
        });
    }

    module.exports = {

        /**
         * Parses the provided GLSL source, and returns all declaration statements
         * that contain the provided qualifier type. This can be used to extract
         * all attributes and uniform names and types from a shader.
         *
         * For example, when provided a "uniform" qualifiers, the declaration:
         * <pre>
         *     "uniform highp vec3 uSpecularColor;"
         * </pre>
         * Would be parsed to:
         * <pre>
         *     {
         *         qualifier: "uniform",
         *         type: "vec3",
         *         name: "uSpecularColor",
         *         count: 1
         *     }
         * </pre>
         * @param {String|Array} source - The shader sources.
         * @param {String|Array} qualifiers - The qualifiers to extract.
         *
         * @returns {Array} The array of qualifier declaration statements.
         */
        parseDeclarations: function( source, qualifiers ) {
            // if no qualifiers are provided, return empty array
            if ( !qualifiers || qualifiers.length === 0 ) {
                return [];
            }
            var sources = ( source instanceof Array ) ? source : [ source ],
                declarations = [],
                i;
            for ( i=0; i<sources.length; i++ ) {
                declarations = declarations.concat( parseSource( sources[i], qualifiers ) );
            }
            // remove duplicates and return
            return filterDuplicatesByName( declarations );
        },

        /**
         * Detects based on the existence of a 'void main() {' statement, if
         * the string is glsl source code.
         *
         * @param {String} str - The input string to test.
         *
         * @returns {boolean} - True if the string is glsl code.
         */
        isGLSL: function( str ) {
            return /void\s+main\s*\(\s*\)\s*/.test( str );
        }

    };

}());

},{}],19:[function(require,module,exports){
(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Util = require('../util/Util'),
        Stack = require('../util/Stack'),
        _stack = {},
        _boundTexture = null;

    /**
     * If the provided image dimensions are not powers of two, it will redraw
     * the image to the next highest power of two.
     *
     * @param {HTMLImageElement} image - The image object.
     *
     * @returns {HTMLImageElement} The new image object.
     */
    function ensurePowerOfTwo( image ) {
        if ( !Util.isPowerOfTwo( image.width ) ||
            !Util.isPowerOfTwo( image.height ) ) {
            var canvas = document.createElement( "canvas" );
            canvas.width = Util.nextHighestPowerOfTwo( image.width );
            canvas.height = Util.nextHighestPowerOfTwo( image.height );
            var ctx = canvas.getContext("2d");
            ctx.drawImage(
                image,
                0, 0,
                image.width, image.height,
                0, 0,
                canvas.width, canvas.height );
            return canvas;
        }
        return image;
    }

    /**
     * Binds the texture object to a location and activates the texture unit
     * while caching it to prevent unnecessary rebinds.
     *
     * @param {Texture2D} texture - The Texture2D object to bind.
     * @param {number} location - The texture unit location index.
     */
    function bind( texture, location ) {
        // if this buffer is already bound, exit early
        if ( _boundTexture === texture ) {
            return;
        }
        var gl = texture.gl;
        location = gl[ 'TEXTURE' + location ] || gl.TEXTURE0;
        gl.activeTexture( location );
        gl.bindTexture( gl.TEXTURE_2D, texture.id );
        _boundTexture = texture;
    }

    /**
     * Unbinds the texture object. Prevents unnecessary unbinding.
     *
     * @param {Texture2D} texture - The Texture2D object to unbind.
     */
    function unbind( texture ) {
        // if no buffer is bound, exit early
        if ( _boundTexture === null ) {
            return;
        }
        var gl = texture.gl;
        gl.bindTexture( gl.TEXTURE_2D, null );
        _boundTexture = null;
    }

    /**
     * Instantiates a Texture2D object.
     * @class Texture2D
     * @classdesc A texture class to represent a 2D texture.
     */
    function Texture2D( spec, callback ) {
        var that = this;
        // default
        spec = spec || {};
        this.gl = WebGLContext.get();
        // create texture object
        this.id = this.gl.createTexture();
        this.wrap = spec.wrap || "REPEAT";
        this.filter = spec.filter || "LINEAR";
        this.invertY = spec.invertY !== undefined ? spec.invertY : true;
        // buffer the texture based on arguments
        if ( spec.image ) {
            // use existing Image object
            this.bufferData( spec.image );
            this.setParameters( this );
        } else if ( spec.url ) {
            // request image source from url
            var image = new Image();
            image.onload = function() {
                that.bufferData( image );
                that.setParameters( that );
                callback( that );
            };
            image.src = spec.url;
        } else {
            // buffer data
            if ( spec.format === "DEPTH_COMPONENT" ) {
                // depth texture
                var depthTextureExt = WebGLContext.checkExtension( "WEBGL_depth_texture" );
                if( !depthTextureExt ) {
                    console.log( "Cannot create Texture2D of format " +
                        "gl.DEPTH_COMPONENT as WEBGL_depth_texture is " +
                        "unsupported by this browser, command ignored" );
                    return;
                }
                this.format = spec.format;
                if ( !spec.type ||
                    spec.type === "UNSIGNED_SHORT" ||
                    spec.type === "UNSIGNED_INT" ) {
                    this.type = spec.type;
                } else {
                    console.log( "Depth textures do not support type'" +
                        spec.type + "', defaulting to 'UNSIGNED_SHORT'.");
                    this.type = "UNSIGNED_SHORT";
                }
            } else {
                // other
                this.format = spec.format || "RGBA";
                this.type = spec.type || "UNSIGNED_BYTE";
            }
            this.internalFormat = this.format; // webgl requires format === internalFormat
            this.mipMap = spec.mipMap !== undefined ? spec.mipMap : false;
            this.bufferData( spec.data || null, spec.width, spec.height );
            this.setParameters( this );
        }
    }

    /**
     * Binds the texture object and pushes it to the front of the stack.
     * @memberof Texture2D
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.push = function( location ) {
        _stack[ location ] = _stack[ location ] || new Stack();
        _stack[ location ].push( this );
        bind( this, location );
        return this;
    };

    /**
     * Unbinds the texture object and binds the texture beneath it on
     * this stack. If there is no underlying texture, unbinds the unit.
     * @memberof Texture2D
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.pop = function( location ) {
        var top;
        if ( !_stack[ location ] ) {
            console.warn( "No texture was bound to texture unit '" + location +
                "'. Command ignored." );
        }
        _stack[ location ].pop();
        top = _stack[ location ].top();
        if ( top ) {
            bind( top, location );
        } else {
            unbind( this );
        }
        return this;
    };

    /**
     * Buffer data into the texture.
     * @memberof Texture2D
     *
     * @param {ImageData|ArrayBufferView|HTMLImageElement} data - The data.
     * @param {number} width - The width of the data.
     * @param {number} height - The height of the data.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.bufferData = function( data, width, height ) {
        var gl = this.gl;
        this.push();
        if ( data instanceof HTMLImageElement ) {
            // set dimensions before resizing
            this.width = data.width;
            this.height = data.height;
            data = ensurePowerOfTwo( data );
            this.image = data;
            //this.filter = "LINEAR"; // must be linear for mipmapping
            this.mipMap = true;
            gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, this.invertY );
            gl.texImage2D(
                gl.TEXTURE_2D,
                0, // level
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                data );
        } else {
            this.data = data;
            this.width = width || this.width;
            this.height = height || this.height;
            gl.texImage2D(
                gl.TEXTURE_2D,
                0, // level
                gl[ this.internalFormat ],
                this.width,
                this.height,
                0, // border, must be 0
                gl[ this.format ],
                gl[ this.type ],
                this.data );
        }
        if ( this.mipMap ) {
            gl.generateMipmap( gl.TEXTURE_2D );
        }
        this.pop();
        return this;
    };

    /**
     * Set the texture parameters.
     * @memberof Texture2D
     *
     * @param {Object} parameters - The parameters by name.
     * <pre>
     *     wrap | wrap.s | wrap.t - The wrapping type.
     *     filter | filter.min | filter.mag - The filter type.
     * </pre>
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.setParameters = function( parameters ) {
        var gl = this.gl;
        this.push();
        if ( parameters.wrap ) {
            // set wrap parameters
            this.wrap = parameters.wrap;
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl[ this.wrap.s || this.wrap ] );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl[ this.wrap.t || this.wrap ] );
        }
        if ( parameters.filter ) {
            // set filter parameters
            this.filter = parameters.filter;
            var minFilter = this.filter.min || this.filter;
            if ( this.mipMap ) {
                // append min mpa suffix to min filter
                minFilter += "_MIPMAP_LINEAR";
            }
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MAG_FILTER,
                gl[ this.filter.mag || this.filter ] );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MIN_FILTER,
                gl[ minFilter] );
        }
        this.pop();
        return this;
    };

    /**
     * Resize the texture.
     * @memberof Texture2D
     *
     * @param {number} width - The new width of the texture.
     * @param {number} height - The new height of the texture.
     *
     * @returns {Texture2D} The texture object, for chaining.
     */
    Texture2D.prototype.resize = function( width, height ) {
        if ( this.image ) {
            console.error( "Cannot resize image based Texture2D" );
            return;
        }
        if ( !width || !height ) {
            console.warn( "Width or height arguments missing, command ignored." );
            return;
        }
        this.bufferData( this.data, width, height );
        return this;
    };

    module.exports = Texture2D;

}());

},{"../util/Stack":39,"../util/Util":40,"./WebGLContext":24}],20:[function(require,module,exports){
(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Util = require('../util/Util'),
        Stack = require('../util/Stack'),
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
        _stack = {},
        _boundTexture = null;

    /**
     * If the provided image dimensions are not powers of two, it will redraw
     * the image to the next highest power of two.
     *
     * @param {HTMLImageElement} image - The image object.
     *
     * @returns {HTMLImageElement} The new image object.
     */
    function ensurePowerOfTwo( image ) {
        if ( !Util.isPowerOfTwo( image.width ) ||
            !Util.isPowerOfTwo( image.height ) ) {
            var canvas = document.createElement( "canvas" );
            canvas.width = Util.nextHighestPowerOfTwo( image.width );
            canvas.height = Util.nextHighestPowerOfTwo( image.height );
            var ctx = canvas.getContext("2d");
            ctx.drawImage(
                image,
                0, 0,
                image.width, image.height,
                0, 0,
                canvas.width, canvas.height );
            return canvas;
        }
        return image;
    }

    /**
     * Binds the texture object to a location and activates the texture unit
     * while caching it to prevent unnecessary rebinds.
     *
     * @param {TextureCubeMap} texture - The TextureCubeMap object to bind.
     * @param {number} location - The texture unit location index.
     */
    function bind( texture, location ) {
        // if this buffer is already bound, exit early
        if ( _boundTexture === texture ) {
            return;
        }
        var gl = texture.gl;
        location = gl[ 'TEXTURE' + location ] || gl.TEXTURE0;
        gl.activeTexture( location );
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, texture.id );
        _boundTexture = texture;
    }

    /**
     * Unbinds the texture object. Prevents unnecessary unbinding.
     *
     * @param {TextureCubeMap} texture - The TextureCubeMap object to unbind.
     */
    function unbind( texture ) {
        // if no buffer is bound, exit early
        if ( _boundTexture === null ) {
            return;
        }
        var gl = texture.gl;
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, null );
        _boundTexture = null;
    }

    /**
     * Returns a function to load and buffer a given cube map face.
     *
     * @param {TextureCubeMap} cubeMap - The cube map object.
     * @param {String} url - The url to load the image.
     * @param {String} face - The face identification string.
     *
     * @returns {Function} The resulting function.
     */
    function loadAndBufferImage( cubeMap, url, face ) {
        return function( done ) {
            var image = new Image();
            image.onload = function() {
                // buffer face texture
                cubeMap.bufferFaceData( face, image );
                done();
            };
            image.src = url;
        };
    }

    /**
     * Instantiates a TextureCubeMap object.
     * @class TextureCubeMap
     * @classdesc A texture class to represent a cube map texture.
     */
    function TextureCubeMap( spec, callback ) {
        var that = this,
            face,
            jobs;
        // store gl context
        this.gl = WebGLContext.get();
        this.id = this.gl.createTexture();
        this.wrap = spec.wrap || "CLAMP_TO_EDGE";
        this.filter = spec.filter || "LINEAR";
        this.invertY = spec.invertY !== undefined ? spec.invertY : false;
        // create cube map based on input
        if ( spec.images ) {
            // multiple Image objects
            for ( face in spec.images ) {
                if ( spec.images.hasOwnProperty( face ) ) {
                    // buffer face texture
                    this.bufferFaceData( face, spec.images[ face ] );
                }
            }
            this.setParameters( this );
        } else if ( spec.urls ) {
            // multiple urls
            jobs = {};
            for ( face in spec.urls ) {
                if ( spec.urls.hasOwnProperty( face ) ) {
                    // add job to map
                    jobs[ face ] = loadAndBufferImage(
                        this,
                        spec.urls[ face ],
                        face );
                }
            }
            Util.async( jobs, function() {
                that.setParameters( that );
                callback( that );
            });
        } else {
            // empty cube map
            this.format = spec.format || "RGBA";
            this.internalFormat = this.format; // webgl requires format === internalFormat
            this.type = spec.type || "UNSIGNED_BYTE";
            this.mipMap = spec.mipMap !== undefined ? spec.mipMap : false;
            FACES.forEach( function( face ) {
                var data = ( spec.data ? spec.data[face] : spec.data ) || null;
                that.bufferFaceData( face, data, spec.width, spec.height );
            });
            this.setParameters( this );
        }
    }

    /**
     * Binds the texture object and pushes it to the front of the stack.
     * @memberof TextureCubeMap
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
     TextureCubeMap.prototype.push = function( location ) {
        _stack[ location ] = _stack[ location ] || new Stack();
        _stack[ location ].push( this );
        bind( this, location );
        return this;
    };

    /**
     * Unbinds the texture object and binds the texture beneath it on
     * this stack. If there is no underlying texture, unbinds the unit.
     * @memberof TextureCubeMap
     *
     * @param {number} location - The texture unit location index.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
     TextureCubeMap.prototype.pop = function( location ) {
        var top;
        if ( !_stack[ location ] ) {
            console.log("No texture was bound to texture unit '" + location +
                "'. Command ignored.");
        }
        _stack[ location ].pop();
        top = _stack[ location ].top();
        if ( top ) {
            bind( top, location );
        } else {
            unbind( this );
        }
        return this;
    };

    /**
     * Buffer data into the respective cube map face.
     * @memberof TextureCubeMap
     *
     * @param {String} face - The face identification string.
     * @param {ImageData|ArrayBufferView|HTMLImageElement} data - The data.
     * @param {number} width - The width of the data.
     * @param {number} height - The height of the data.
     *
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.bufferFaceData = function( face, data, width, height ) {
        var gl = this.gl,
            faceTarget = gl[ FACE_TARGETS[ face ] ];
        if ( !faceTarget ) {
            console.log("Invalid face enumeration '"+ face +"' provided, " +
                "ignoring command.");
        }
        // buffer face texture
        this.push();
        if ( data instanceof HTMLImageElement ) {
            this.images = this.images || {};
            this.images[ face ] = ensurePowerOfTwo( data );
            this.filter = "LINEAR"; // must be linear for mipmapping
            this.mipMap = true;
            gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, this.invertY );
            gl.texImage2D(
                faceTarget,
                0, // level
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                this.images[ face ] );
        } else {
            this.data = this.data || {};
            this.data[ face ] = data;
            this.width = width || this.width;
            this.height = height || this.height;
            gl.texImage2D(
                faceTarget,
                0, // level
                gl[ this.internalFormat ],
                this.width,
                this.height,
                0, // border, must be 0
                gl[ this.format ],
                gl[ this.type ],
                data );
        }
        // only generate mipmaps if all faces are buffered
        this.bufferedFaces = this.bufferedFaces || {};
        this.bufferedFaces[ face ] = true;
        // once all faces are buffered
        if ( this.mipMap &&
            this.bufferedFaces['-x'] && this.bufferedFaces['+x'] &&
            this.bufferedFaces['-y'] && this.bufferedFaces['+y'] &&
            this.bufferedFaces['-z'] && this.bufferedFaces['+z'] ) {
            // generate mipmaps once all faces are buffered
            gl.generateMipmap( gl.TEXTURE_CUBE_MAP );
        }
        this.pop();
        return this;
    };

    /**
     * Set the texture parameters.
     * @memberof TextureCubeMap
     *
     * @param {Object} parameters - The parameters by name.
     * <pre>
     *     wrap | wrap.s | wrap.t - The wrapping type.
     *     filter | filter.min | filter.mag - The filter type.
     * </pre>
     * @returns {TextureCubeMap} The texture object, for chaining.
     */
    TextureCubeMap.prototype.setParameters = function( parameters ) {
        var gl = this.gl;
        this.push();
        if ( parameters.wrap ) {
            // set wrap parameters
            this.wrap = parameters.wrap;
            gl.texParameteri(
                gl.TEXTURE_CUBE_MAP,
                gl.TEXTURE_WRAP_S,
                gl[ this.wrap.s || this.wrap ] );
            gl.texParameteri(
                gl.TEXTURE_CUBE_MAP,
                gl.TEXTURE_WRAP_T,
                gl[ this.wrap.t || this.wrap ] );
            /* not supported in webgl 1.0
            gl.texParameteri(
                gl.TEXTURE_CUBE_MAP,
                gl.TEXTURE_WRAP_R,
                gl[ this.wrap.r || this.wrap ] );
            */
        }
        if ( parameters.filter ) {
            // set filter parameters
            this.filter = parameters.filter;
            var minFilter = this.filter.min || this.filter;
            if ( this.minMap ) {
                // append min mpa suffix to min filter
                minFilter += "_MIPMAP_LINEAR";
            }
            gl.texParameteri(
                gl.TEXTURE_CUBE_MAP,
                gl.TEXTURE_MAG_FILTER,
                gl[ this.filter.mag || this.filter ] );
            gl.texParameteri(
                gl.TEXTURE_CUBE_MAP,
                gl.TEXTURE_MIN_FILTER,
                gl[ minFilter] );
        }
        this.pop();
        return this;
    };

    module.exports = TextureCubeMap;

}());

},{"../util/Stack":39,"../util/Util":40,"./WebGLContext":24}],21:[function(require,module,exports){
(function () {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        VertexPackage = require('./VertexPackage'),
        Util = require('../util/Util'),
        _boundBuffer = null,
        _enabledAttributes = null;

    function setAttributePointers( vertexBuffer, attributePointers ) {
        if ( !attributePointers ) {
            console.error( "VertexBuffer requires attribute pointers to be " +
                "specified, command ignored" );
            return;
        }
        vertexBuffer.pointers = attributePointers;
    }

    function VertexBuffer( array, attributePointers ) {
        this.id = 0;
        this.pointers = {};
        this.gl = WebGLContext.get();
        if ( array ) {
            if ( array instanceof VertexPackage ) {
                // VertexPackage argument
                this.bufferData( array.buffer() );
                setAttributePointers( this, array.attributePointers() );
            } else if ( array instanceof WebGLBuffer ) {
                // WebGLBuffer argument
                this.id = array;
                setAttributePointers( this, attributePointers );
            } else {
                // Array or ArrayBuffer argument
               this.bufferData( array );
               setAttributePointers( this, attributePointers );
            }
        }
    }

    VertexBuffer.prototype.bufferData = function( array ) {
        var gl = this.gl;
        if ( array instanceof Array ) {
            // cast arrays into bufferview
            array = new Float32Array( array );
        } else if ( !Util.isTypedArray( array ) && typeof array !== "number" ) {
            console.error( "VertexBuffer requires an Array or ArrayBuffer, " +
                "or a size argument, command ignored" );
            return;
        }
        if ( !this.id ) {
            this.id = gl.createBuffer();
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, this.id );
        gl.bufferData( gl.ARRAY_BUFFER, array, gl.STATIC_DRAW );
    };

    VertexBuffer.prototype.bufferSubData = function( array, offset ) {
        var gl = this.gl;
        if ( !this.id ) {
            console.error( "VertexBuffer has not been initially buffered, " +
                "command ignored" );
            return;
        }
        if ( array instanceof Array ) {
            array = new Float32Array( array );
        } else if ( !Util.isTypedArray( array ) ) {
            console.error( "VertexBuffer requires an Array or ArrayBuffer " +
                "argument, command ignored" );
            return;
        }
        offset = ( offset !== undefined ) ? offset : 0;
        gl.bindBuffer( gl.ARRAY_BUFFER, this.id );
        gl.bufferSubData( gl.ARRAY_BUFFER, offset, array );
    };

    VertexBuffer.prototype.bind = function() {
        // if this buffer is already bound, exit early
        if ( _boundBuffer === this ) {
            return;
        }
        var gl = this.gl,
            pointers = this.pointers,
            previouslyEnabledAttributes = _enabledAttributes || {},
            pointer,
            index;
        // cache this vertex buffer
        _boundBuffer = this;
        _enabledAttributes = {};
        // bind buffer
        gl.bindBuffer( gl.ARRAY_BUFFER, this.id );
        for ( index in pointers ) {
            if ( pointers.hasOwnProperty( index ) ) {
                pointer = this.pointers[ index ];
                // set attribute pointer
                gl.vertexAttribPointer( index,
                    pointer.size,
                    gl[ pointer.type ],
                    false,
                    pointer.stride,
                    pointer.offset );
                // enabled attribute array
                gl.enableVertexAttribArray( index );
                // cache attribute
                _enabledAttributes[ index ] = true;
                // remove from previous list
                delete previouslyEnabledAttributes[ index ];
            }
        }
        // ensure leaked attribute arrays are disabled
        for ( index in previouslyEnabledAttributes ) {
            if ( previouslyEnabledAttributes.hasOwnProperty( index ) ) {
                gl.disableVertexAttribArray( index );
            }
        }
    };

    VertexBuffer.prototype.unbind = function() {
        // if no buffer is bound, exit early
        if ( _boundBuffer === null ) {
            return;
        }
        var gl = this.gl,
            pointers = this.pointers,
            index;
        for ( index in pointers ) {
            if ( pointers.hasOwnProperty( index ) ) {
                gl.disableVertexAttribArray( index );
            }
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
        _boundBuffer = null;
        _enabledAttributes = {};
    };

    module.exports = VertexBuffer;

}());

},{"../util/Util":40,"./VertexPackage":22,"./WebGLContext":24}],22:[function(require,module,exports){
(function () {

    "use strict";

    /**
     * Removes invalid attribute arguments. A valid argument
     * must be an Array of length > 0.
     *
     * @param {Array} attributes - The array of vertex attributes.
     *
     * @returns {Array} The valid array of arguments.
     */
    function removeBadArguments( attributes ) {
        var goodAttributes = [],
            attribute,
            i;
        for ( i=0; i<attributes.length; i++ ) {
            attribute = attributes[i];
            if ( attribute &&
                 attribute instanceof Array &&
                 attribute.length > 0 ) {
                goodAttributes.push( attribute );
            } else {
                console.error( "Error parsing attribute of index " + i +
                    ", attribute discarded" );
            }
        }
        return goodAttributes;
    }

    /**
     * Returns a component's byte size.
     *
     * @param {Object|Array} component - The component to measure.
     *
     * @returns {integer} The byte size of the component.
     */
    function getComponentSize( component ) {
        // check if vector
        if ( component.x !== undefined ) {
            // 1 component vector
            if ( component.y !== undefined ) {
                // 2 component vector
                if ( component.z !== undefined ) {
                    // 3 component vector
                    if ( component.w !== undefined ) {
                        // 4 component vector
                        return 4;
                    }
                    return 3;
                }
                return 2;
            }
            return 1;
        }
        // check if array
        if ( component instanceof Array ) {
            return component.length;
        }
        return 1;
    }

    /**
     * Calculates the type, size, and offset for each attribute in the
     * attribute array along with the length and stride of the package.
     *
     * @param {VertexPackage} vertexPackage - The VertexPackage object.
     * @param {Array} attributes - The array of vertex attributes.
     */
    function setPointersAndStride( vertexPackage, attributes ) {
        var shortestArray = Number.MAX_VALUE,
            offset = 0,
            attribute,
            size,
            i;
        vertexPackage.pointers = {};
        for ( i=0; i<attributes.length; i++ ) {
            attribute = attributes[i];
            // set size to number of components in the attribute
            size = getComponentSize( attribute[0] );
            // length of the package will be the shortest attribute array length
            shortestArray = Math.min( shortestArray, attribute.length );
            // store pointer under index
            vertexPackage.pointers[ i ] = {
                type : "FLOAT",
                size : size,
                offset : offset
            };
            // accumulate attribute offset
            offset += size;
        }
        // set stride to total offset
        vertexPackage.stride = offset;
        // set size of package to the shortest attribute array length
        vertexPackage.size = shortestArray;
    }

    function VertexPackage( attributes ) {
        // ensure attributes is an array of arrays
        if ( !( attributes[0] instanceof Array ) ) {
            attributes = [ attributes ];
        }
        return this.set( attributes );
    }

    VertexPackage.prototype.set = function( attributes ) {
        var BYTES_PER_COMPONENT = 4,
            attribute,
            pointer,
            vertex,
            offset,
            i, j, k;
        // remove bad attributes
        attributes = removeBadArguments( attributes );
        // set attribute pointers and stride
        setPointersAndStride( this, attributes );
        // set size of data vector
        this.data = new Float32Array( this.size * this.stride );
        // for each vertex attribute array
        for ( i=0; i<attributes.length; i++ ) {
            attribute = attributes[i];
            // get the pointer
            pointer = this.pointers[i];
            // get the pointers offset
            offset = pointer.offset;
            // for each vertex attribute
            for ( j=0; j<this.size; j++ ) {
                vertex = attribute[j];
                // get the index in the buffer to the particular attribute
                k = offset + ( this.stride * j );
                switch ( pointer.size ) {
                    case 2:
                        this.data[k] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
                        this.data[k+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
                        break;
                    case 3:
                        this.data[k] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
                        this.data[k+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
                        this.data[k+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
                        break;
                    case 4:
                        this.data[k] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
                        this.data[k+1] = ( vertex.y !== undefined ) ? vertex.y : vertex[1];
                        this.data[k+2] = ( vertex.z !== undefined ) ? vertex.z : vertex[2];
                        this.data[k+3] = ( vertex.w !== undefined ) ? vertex.w : vertex[3];
                        break;
                    default:
                        this.data[k] = ( vertex.x !== undefined ) ? vertex.x : vertex[0];
                        break;
                }
            }
            // scale offset and stride by bytes per attribute
            // it is done here as above logic uses stride and offset
            // as component counts rather than number of byte
            pointer.stride = this.stride * BYTES_PER_COMPONENT;
            pointer.offset = pointer.offset * BYTES_PER_COMPONENT;
        }
        return this;
    };

    VertexPackage.prototype.buffer = function() {
        return this.data;
    };

    VertexPackage.prototype.attributePointers = function() {
        return this.pointers;
    };

    module.exports = VertexPackage;

}());

},{}],23:[function(require,module,exports){
(function() {

    "use strict";

    var WebGLContext = require('./WebGLContext'),
        Stack = require('../util/Stack'),
        _stack = new Stack();

    function set( viewport, width, height ) {
        var gl = viewport.gl;
        if ( width && height ) {
            gl.viewport( 0, 0, width, height );
        } else {
            gl.viewport( 0, 0, viewport.width, viewport.height );
        }
    }

    function Viewport( spec ) {
        spec = spec || {};
        this.width = spec.width || window.innerWidth;
        this.height = spec.height || window.innerHeight;
        this.gl = WebGLContext.get();
    }

    /**
     * Updates the viewport objects width and height.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
    Viewport.prototype.resize = function( width, height ) {
        if ( width && height ) {
            this.width = width;
            this.height = height;
            this.gl.canvas.height = height;
            this.gl.canvas.width = width;
        }
        return this;
    };

    /**
     * Sets the viewport object and pushes it to the front of the stack.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
     Viewport.prototype.push = function( width, height ) {
        _stack.push({
            viewport: this,
            width: width,
            height: height
        });
        set( this, width, height );
        return this;
    };

    /**
     * Pops current the viewport object and sets the viewport beneath it.
     * @memberof Viewport
     *
     * @returns {Viewport} The viewport object, for chaining.
     */
     Viewport.prototype.pop = function() {
        var top;
        _stack.pop();
        top = _stack.top();
        if ( top ) {
            set( top.viewport, top.width, top.height );
        } else {
            set( this );
        }
        return this;
    };

    module.exports = Viewport;

}());

},{"../util/Stack":39,"./WebGLContext":24}],24:[function(require,module,exports){
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
     * @param {HTMLCanvasElement} The Canvas element object to
     *     create the context under.
     *
     * @returns {Object} contextWrapper - The context wrapper.
     */
    function createContextWrapper( canvas ) {
        var contextWrapper,
            gl;
        try {
            // get WebGL context, fallback to experimental
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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
            alert( "Unable to initialize WebGL. Your browser may not " +
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
                    "type '"+( typeof arg )+"', command ignored." );
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
         *
         * @returns {WebGLRenderingContext} The WebGLRenderingContext context object.
         */
        get: function( arg ) {
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
            if ( !canvas || ( !_contextsById[ canvas.id ] && !createContextWrapper( canvas ) ) ) {
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

},{}],25:[function(require,module,exports){
(function () {

    "use strict";

    function Animation( spec ) {
        this.targets = spec.targets;
        return this;
    }

    module.exports = Animation;

}());

},{}],26:[function(require,module,exports){
(function () {

    "use strict";

    var alfador = require('alfador'),
        Transform = alfador.Transform,
        Mat44 = alfador.Mat44,
        Entity = require('./Entity');

    function Camera( spec ) {
        var i;
        spec = spec || {};
        // call base constructor for transform
        Transform.call( this, spec );
        // set id if there is one
        if ( spec.id ) {
            this.id = spec.id;
        }
        if ( spec.projection ) {
            this.projectionMatrix( spec.projection );
        } else {
            this.projectionMatrix({
                fov: 45,
                aspect: 4/3,
                minZ: 0.1,
                maxZ: 1000
            });
        }
        // set parent
        this.parent = spec.parent || null;
        // set children
        this.children = [];
        if ( spec.children ) {
            for ( i=0; i<spec.children.length; i++ ) {
                this.addChild( spec.children[i] );
            }
        }
        return this;
    }

    Camera.prototype = Object.create( Entity.prototype );

    Camera.prototype.projectionMatrix = function( projection ) {
        if ( projection ) {
            if ( projection instanceof Array ) {
                this.projection = new Mat44( projection );
            } else if ( projection instanceof Mat44 ) {
                this.projection = projection;
            } else {
                this.projection = Mat44.perspective(
                    projection.fov || 45,
                    projection.aspect || 4/3,
                    projection.zMin || 0.1,
                    projection.zMax || 1000 );
            }
            return this;
        }
        return this.projection;
    };

    Camera.prototype.copy = function() {
        var that = new Camera({
                up: this.up(),
                forward: this.forward(),
                origin: this.origin(),
                projection: new Mat44( this.projection )
            }),
            i;
        // copy children by value
        for ( i=0; i<this.children.length; i++ ) {
            that.addChild( this.children[i].copy() );
        }
        return that;
    };

    module.exports = Camera;

}());

},{"./Entity":27,"alfador":10}],27:[function(require,module,exports){
(function () {

    "use strict";

    var Transform = require('alfador').Transform,
        Mesh = require('./Mesh'),
        Sprite = require('./Sprite'),
        Skeleton = require('./Skeleton'),
        Animation = require('./Animation');

    function Entity( spec ) {
        var that = this;
        spec = spec || {};
        // call base constructor for transform
        Transform.call( this, spec );
        // set id if there is one
        if ( spec.id ) {
            this.id = spec.id;
        }
        // set parent
        this.parent = spec.parent || null;
        // set children
        this.children = [];
        if ( spec.children ) {
            spec.children.forEach( function( child ) {
                that.addChild( child );
            });
        }
        // set meshes
        this.meshes = [];
        if ( spec.meshes ) {
            spec.meshes.forEach( function( mesh ) {
                if ( mesh instanceof Mesh ) {
                    that.meshes.push( mesh );
                } else {
                    that.meshes.push( new Mesh( mesh ) );
                }
            });
        }
        // set sprites
        this.sprites = [];
        if ( spec.sprites ) {
            spec.sprites.forEach( function( sprite ) {
                if ( sprite instanceof Sprite ) {
                    that.sprites.push( sprite );
                } else {
                    that.sprites.push( new Sprite( sprite ) );
                }
            });
        }
        // set skeleton, if it exists
        this.skeleton = null;
        if ( spec.skeleton ) {
            if ( spec.skeleton instanceof Skeleton ) {
                this.skeleton = spec.skeleton;
            } else {
                this.skeleton = new Skeleton( spec.skeleton );
            }
        }
        // set animations, if they exist
        this.animations = {};
        if ( spec.animations ) {
            for ( var key in spec.animations ) {
                if ( spec.animations.hasOwnProperty( key ) ) {
                    if ( spec.animations[ key ] instanceof Animation ) {
                        this.animations[ key ] = spec.animations;
                    } else {
                        this.animations[ key ] = new Animation( spec.animations );
                    }
                }
            }
        }
    }

    Entity.prototype = Object.create( Transform.prototype );

    Entity.prototype.globalMatrix = function() {
        if ( this.parent ) {
            return this.parent.globalMatrix().mult( this.matrix() );
        }
        return this.matrix();
    };

    Entity.prototype.globalViewMatrix = function() {
        if ( this.parent ) {
            return this.parent.mult( this.matrix() ).viewMatrix();
        }
        return this.viewMatrix();
    };

    Entity.prototype.addChild = function( child ) {
        if ( !( child instanceof Entity ) ) {
            child = new Entity( child );
        }
        child.parent = this;
        this.children.push( child );
        return this;
    };

    Entity.prototype.removeChild = function( child ) {
        var index = this.children.indexOf( child );
        if ( index !== -1 ) {
            this.children.splice( index, 1 );
            child.parent = null;
        }
        return this;
    };

    Entity.prototype.depthFirst = function( callback ) {
        callback( this );
        this.children.forEach( function( child ) {
            child.depthFirst( callback );
        });
    };

    Entity.prototype.breadthFirst = function( callback ) {
        var queue = [ this ];
        while ( queue.length > 0 ) {
            var top = queue.shift();
            queue = queue.concat( queue, top.children );
            callback( top );
        }
    };

    Entity.prototype.copy = function() {
        var that = new Entity({
                up: this.up(),
                forward: this.forward(),
                origin: this.origin(),
                scale: this.scale(),
                meshes: this.meshes, // copy by reference
                sprites: this.sprites, // copy by reference
                skeleton: this.skeleton, // copy by reference
                animations: this.animations // copy by reference
            });
        // copy children by value
        this.children.forEach( function( child ) {
            that.addChild( child.copy() );
        });
        return that;
    };

    module.exports = Entity;

}());

},{"./Animation":25,"./Mesh":31,"./Skeleton":37,"./Sprite":38,"alfador":10}],28:[function(require,module,exports){
(function () {

    "use strict";

    function Geometry( spec ) {
        this.positions = spec.positions;
        this.uvs = spec.uvs;
        this.normals = spec.normals;
        this.tangents = spec.tangents;
        this.bitangents = spec.bitangents;
        this.indices = spec.indices;
    }

    module.exports = Geometry;

}());

},{}],29:[function(require,module,exports){
(function () {

    "use strict";

    function Joint( spec ) {
        this.id = spec.id;
        this.name = spec.name;
        this.bindMatrix = spec.bindMatrix;
        this.inverseBindMatrix = spec.inverseBindMatrix;
        this.parent = spec.parent;
        this.children = spec.children;
        this.index = spec.index;
        return this;
    }

    Joint.prototype.skinningMatrix = function( bindShapeMatrix, poseMatrix ) {
        // if no pose matrix is provided, default to bind position
        poseMatrix = poseMatrix || this.bindMatrix;
        // update globalTransform, children will rely on these
        if ( this.parent ) {
            this.globalMatrix = this.parent.globalMatrix.mult( poseMatrix );
        } else {
            this.globalMatrix = poseMatrix;
        }
        // return skinning matrix
        return this.globalMatrix.mult( this.inverseBindMatrix.mult( bindShapeMatrix ) );
    };

    module.exports = Joint;

}());

},{}],30:[function(require,module,exports){
(function () {

    "use strict";

    var Texture2D = require('../core/Texture2D');

    function createTexture( texture ) {
        if ( !texture ) {
            return null;
        }
        if ( !( texture instanceof Texture2D ) ) {
            return new Texture2D({
                image: texture
            });
        }
        return texture;
    }

    function parseColor( color ) {
        if ( color instanceof Array ) {
            return [ color[0], color[1], color[2], color[3] || 1.0 ];
        }
        return color;
    }

    function Material( spec ) {
        spec = spec || {};
        this.id = spec.id;
        this.diffuseColor = parseColor( spec.diffuseColor ) || [ 1, 0, 1, 1 ];
        this.diffuseTexture = createTexture( spec.diffuseTexture ) || null;
        this.ambientColor = parseColor( spec.ambientColor ) || [ 0, 0, 0, 1 ];
        this.ambientTexture = createTexture( spec.ambientTexture ) || null;
        this.specularColor = parseColor( spec.specularColor ) || [ 1, 1, 1, 1 ];
        this.specularTexture = createTexture( spec.specularTexture ) || null;
        this.specularComponent = spec.specularComponent || 10;
        this.reflection = ( spec.reflection !== undefined ) ? spec.reflection : 0;
        this.refraction = ( spec.refraction !== undefined ) ? spec.refraction : 0;
        return this;
    }

    module.exports = Material;

}());

},{"../core/Texture2D":19}],31:[function(require,module,exports){
(function () {

    "use strict";

    var Geometry = require('./Geometry'),
        Renderable = require('./Renderable'),
        Material = require('./Material');

    function Mesh( spec ) {
        spec = spec || {};
        // set geometry
        if ( spec.geometry ) {
            if ( spec.geometry instanceof Geometry ) {
                this.geometry = spec.geometry;
            } else {
                this.geometry = new Geometry( spec.geometry );
            }
        } else {
            this.geometry = new Geometry( spec );
        }
        // set renderable
        if ( spec.renderable ) {
            if ( spec.renderable instanceof Renderable ) {
                this.renderable = spec.renderable;
            } else {
                this.renderable = new Renderable( spec.renderable );
            }
        } else {
            this.renderable = new Renderable( spec );
        }
        // set material
        if ( spec.material ) {
            if ( spec.material instanceof Material ) {
                this.material = spec.material;
            } else {
                this.material = new Material( spec.material );
            }
        } else {
            this.material = new Material( spec );
        }
    }

    Mesh.prototype.draw = function() {
        this.renderable.draw();
        return this;
    };

    module.exports = Mesh;

}());

},{"./Geometry":28,"./Material":30,"./Renderable":35}],32:[function(require,module,exports){
(function () {

    'use strict';

    var alfador = require('alfador'),
        Triangle = alfador.Triangle,
        Vec3 = alfador.Vec3,
        Entity = require('./Entity'),
        Mesh = require('./Mesh'),
        DEFAULT_DEPTH = 4,
        MIN_VEC = new Vec3(
            Number.MIN_VALUE,
            Number.MIN_VALUE,
            Number.MIN_VALUE ),
        MAX_VEC = new Vec3(
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            Number.MAX_VALUE ),
        _cube;

    /**
     * Finds the mininum and maximum bounding extents within a set of triangles.
     *
     * @param {Array} triangles - The array of triangles.
     *
     * @returns {Object} The minimum and maximum points.
     */
    function minMax( triangles ) {
        var min = MAX_VEC,
            max = MIN_VEC,
            triangle,
            a, b, c,
            i;
        for ( i=0; i<triangles.length; i++ ) {
            triangle = triangles[i];
            a = triangle.a;
            b = triangle.b;
            c = triangle.c;
            // get min
            min.x = Math.min( min.x, Math.min( Math.min( a.x, b.x ), c.x ) );
            min.y = Math.min( min.y, Math.min( Math.min( a.y, b.y ), c.y ) );
            min.z = Math.min( min.z, Math.min( Math.min( a.z, b.z ), c.z ) );
            // get max
            max.x = Math.max( max.x, Math.max( Math.max( a.x, b.x ), c.x ) );
            max.y = Math.max( max.y, Math.max( Math.max( a.y, b.y ), c.y ) );
            max.z = Math.max( max.z, Math.max( Math.max( a.z, b.z ), c.z ) );
        }
        return {
            min: min,
            max: max
        };
    }

    /**
     * Inserts a triangle into the octrees child depending on its position
     * within the node.
     *
     * @param {Octree} octree - The octree object.
     * @param {integer} index - The child index from 0-7
     * @param {Object} triangle - The triangle object to be inserted.
     */
    function insertIntoChild( octree, index, triangle ) {
        var offset = new Vec3( 0, 0, 0 ),
            step;
        if ( octree.children[ index ] ) {
            // child already exists, recursively insert
            octree.children[ index ].insert( triangle );
        } else {
            // child does not exist
            // if terminal depth has not been reached, create child node
            if ( octree.depth > 0 ) {
                step = octree.halfWidth / 2;
                offset.x = ( (index & 1) ? step : -step );
                offset.y = ( (index & 2) ? step : -step );
                offset.z = ( (index & 4) ? step : -step );
                // pass null triangles arg to force else in constructor
                octree.children[ index ] = new Octree( null, {
                   center: octree.center.add( offset ),
                   halfWidth: step,
                   depth : octree.depth-1
                });
                octree.children[ index ].insert( triangle );
            }
        }
    }

    /**
     * Calculates and returns the squared distance between a point and
     * an octree's child's AABB.
     *
     * @param {Octree} octree - The octree object.
     * @param {Object} point - The point to measure from.
     * @param {integer} child - The AABB child index.
     *
     * @returns {number} The squared distance.
     */
    function sqrDistFromPoint( octree, point, child ) {
        // shift AABB dimesions based on which child cell is begin tested
        var offsetCenter = new Vec3( octree.center ),
            step = octree.halfWidth / 2,
            sqrDist = 0,
            minAABB,
            maxAABB;
        offsetCenter.x += ( (child & 1) ? step : -step );
        offsetCenter.y += ( (child & 2) ? step : -step );
        offsetCenter.z += ( (child & 4) ? step : -step );
        minAABB = new Vec3(
            offsetCenter.x - step,
            offsetCenter.y - step,
            offsetCenter.z - step );
        maxAABB = new Vec3(
            offsetCenter.x + step,
            offsetCenter.y + step,
            offsetCenter.z + step );
        // For each axis count any excess distance outside box extents
        // x
        if (point.x < minAABB.x) { sqrDist += (minAABB.x - point.x) * (minAABB.x - point.x); }
        if (point.x > maxAABB.x) { sqrDist += (point.x - maxAABB.x) * (point.x - maxAABB.x); }
        // y
        if (point.y < minAABB.y) { sqrDist += (minAABB.y - point.y) * (minAABB.y - point.y); }
        if (point.y > maxAABB.y) { sqrDist += (point.y - maxAABB.y) * (point.y - maxAABB.y); }
        // z
        if (point.z < minAABB.z) { sqrDist += (minAABB.z - point.z) * (minAABB.z - point.z); }
        if (point.z > maxAABB.z) { sqrDist += (point.z - maxAABB.z) * (point.z - maxAABB.z); }
        return sqrDist;
    }

    /**
     * Check if a sphere defined by a point and radius intersects an octree's
     * child's AABB.
     *
     * @param {Octree} octree - The octree object.
     * @param {Object} center - The center of the sphere to measure from.
     * @param {number} radius - The radius of the sphere.
     * @param {integer} child - The AABB child index.
     *
     * @returns {boolean} Whether or not it interects the AABB child.
     */
    function sphereCheck( octree, center, radius, child ) {
        // compute squared distance between sphere centre and AABB
        var dist = sqrDistFromPoint( octree, center, child );
        // sphere and AABB intersect if the distance is less than the radius
        return dist <= radius*radius;
    }

    /**
     * Creates the singleton cube Mesh object for the octree.
     *
     * @returns {Mesh} The singleton cube.
     */
    function getCubeMesh() {
        if ( !_cube ) {
            var positions = [
                    // front face
                    [ -1, -1, 1 ],
                    [ 1, -1, 1 ],
                    [ 1, 1, 1 ],
                    [ -1, 1, 1 ],
                    // back face
                    [ -1, -1, -1 ],
                    [ 1, -1, -1 ],
                    [ 1, 1, -1 ],
                    [ -1, 1, -1 ]
                ],
                indices = [
                    // front
                    0, 1, 1, 2, 2, 3, 3, 0,
                    // sides
                    0, 4, 1, 5, 2, 6, 3, 7,
                    // back
                    4, 5, 5, 6, 6, 7, 7, 4
                ];
            _cube = new Mesh({
                positions: positions,
                indices: indices,
                options: {
                    mode: "LINES"
                }
            });
        }
        return _cube;
    }

    /**
     * Generates an array of Entity objects with a Mesh component for the
     * octree.
     *
     * @param {Octree} octree - The octree object.
     *
     * @returns {Array} The array of entities.
     */
   function generateSubEntities( octree ) {
        var entities = [],
            count = 0,
            entity,
            i;
        // create entity for octree
        entity = new Entity({
            meshes: [ getCubeMesh() ],
            origin: octree.center,
            scale: octree.halfWidth
        });
        // for each child
        for ( i=0; i<8; i++ ) {
            // if child exists
            if ( octree.children[i] ) {
                entities = entities.concat(
                    generateSubEntities( octree.children[i] ) );
                count++;
            }
        }
        // only create if this octree contains objects, or has children that
        // contain objects
        if ( octree.contained.length > 0 || count > 0 ) {
            entities.push( new Entity({
                meshes: [ getCubeMesh() ],
                origin: octree.center,
                scale: octree.halfWidth
            }));
        }
        // create and return entity
        return entities;
    }

    /**
     * Ensures that the provided triangles are of type Triangle.
     *
     * @param {Array} triangles - The array of triangles.
     *
     * @returns {Array} The array of Triangle objects.
     */
    function parseTriangles( triangles ) {
        var i;
        for ( i=0; i<triangles.length; i++ ) {
            if ( !( triangles[i] instanceof Triangle ) ) {
                triangles[i] = new Triangle( triangles[i].positions );
            }
        }
        return triangles;
    }

    function Octree( triangles, options ) {
        options = options || {};
        if ( triangles ) {
            // if triangles are given, build the octree
            this.build( triangles, options.depth || DEFAULT_DEPTH );
        } else {
            // else case is for recursion during building
            this.center = options.center;
            this.halfWidth = options.halfWidth;
            this.depth = options.depth;
            // call clear to initialize attributes
            this.clear();
        }
        return this;
    }

    /**
     * Builds the octree from an array of triangles to a specified depth.
     *
     * @param {Array} triangles - The array of triangles to contain.
     * @param {integer} depth - The levels of depth for the octree.
     */
    Octree.prototype.build = function( triangles, depth ) {
        var mm,
            minDiff,
            maxDiff,
            largestMin,
            largestMax,
            i;
        // convert triangles into proper format if need be
        triangles = parseTriangles( triangles );
        // get min max extents
        mm = minMax( triangles );
        // call clear to initialize attributes
        this.clear();
        // centre point of octree
        this.center = mm.min.add( mm.max ).div( 2 );
        this.depth = depth || DEFAULT_DEPTH;
        // find largest distance component, becomes half width
        minDiff = mm.min.sub( this.center );
        maxDiff = mm.max.sub( this.center );
        largestMin = Math.max(
            Math.abs( minDiff.x ),
            Math.max( Math.abs( minDiff.y ),
            Math.abs( minDiff.z ) ) );
        largestMax = Math.max(
            Math.abs( maxDiff.x ),
            Math.max( Math.abs( maxDiff.y ),
            Math.abs( maxDiff.z ) ) );
        // half width of octree cell
        this.halfWidth = Math.max( largestMin, largestMax );
        // insert triangles into octree
        for ( i=0; i<triangles.length; i++ ) {
            this.insert( triangles[i] );
        }
    };

    /**
     * Clears and initializes the octree.
     */
    Octree.prototype.clear = function() {
        this.entity = null;
        this.contained = [];
        this.children = [
            null, null, null, null,
            null, null, null, null ];
    };

    /**
     * Insert a triangle into the octree structure. This method with recursively
     * insert it into child nodes to the depth of the tree.
     *
     * @param {Object} triangle - The triangle to be inserted into the octree.
     */
    Octree.prototype.insert = function( triangle ) {
        var centroid = triangle.centroid(),
            radius = triangle.radius(),
            // distance from each axis
            dx = centroid.x - this.center.x,
            dy = centroid.y - this.center.y,
            dz = centroid.z - this.center.z,
            child;
        // only add triangle if leaf node
        if ( this.depth === 0 ) {
            this.contained.push( triangle );
        }
        // if distance is less than radius, then the triangle straddles a
        // boundary
        if ( Math.abs( dx ) < radius ||
             Math.abs( dy ) < radius ||
             Math.abs( dz ) < radius ) {
            // straddles a boundary try to add to intersected children
            for ( child=0; child<8; child++ ) {
                // check if triangle bounding sphere intersects this child
                if ( sphereCheck( this, centroid, radius, child ) ) {
                    // part of bounding sphere intersects child, insert
                    insertIntoChild( this, child, triangle );
                }
            }
        } else {
            // fully contained in a single child, find child index
            // contains the 0-7 index of the child, determined using bit wise
            // addition
            child = 0;
            if ( dx > 0 ) { child += 1; }
            if ( dy > 0 ) { child += 2; }
            if ( dz > 0 ) { child += 4; }
            insertIntoChild( this, child, triangle );
        }
    };

    /**
     * Generate and return an renderable entity object representing the octree
     * structure. Shares a single global mesh instance for all nodes.
     *
     * @returns {Array} - The array of mesh objects
     */
    Octree.prototype.getEntity = function() {
        if ( !this.entity ) {
            this.entity = new Entity({
                children: generateSubEntities( this )
            });
        }
        return this.entity;
    };

    module.exports = Octree;

}());

},{"./Entity":27,"./Mesh":31,"alfador":10}],33:[function(require,module,exports){
(function () {

    "use strict";

    /**
     * Traverses the entity hierarchy depth-first and executes the
     * forEach function on each entity.
     *
     * @param {Entity} entity - The Entity object.
     * @param {Function} forEachEntity - The RenderPass forEachEntity function.
     * @param {Function} forEachMesh - The RenderPass forEachMesh function.
     * @param {Function} forEachSprite - The RenderPass forEachSprite function.
     */
    function forEachRecursive( entity, forEachEntity, forEachMesh, forEachSprite ) {
        // for each entity
        if ( forEachEntity ) {
            forEachEntity( entity );
        }
        // for each mesh
        if ( forEachMesh && entity.meshes ) {
            entity.meshes.forEach( function( mesh ) {
                forEachMesh( mesh, entity );
            });
        }
        // for each sprite
        if ( forEachSprite && entity.sprites ) {
            entity.sprites.forEach( function( sprite ) {
                forEachSprite( sprite, entity );
            });
        }
        // depth first traversal
        entity.children.forEach( function( child ) {
            forEachRecursive( child, forEachEntity, forEachMesh, forEachSprite );
        });
    }

    function RenderPass( spec ) {
        if ( typeof spec === 'object' ) {
            this.before = spec.before || null;
            this.forEachEntity = spec.forEachEntity || null;
            this.forEachMesh = spec.forEachMesh || null;
            this.forEachSprite = spec.forEachSprite || null;
            this.after = spec.after || null;
        } else if ( typeof spec === 'function' ) {
            this.before = spec;
        }
        return this;
    }

    RenderPass.prototype.execute = function( camera, entities ) {
        var before = this.before,
            forEachEntity = this.forEachEntity,
            forEachMesh = this.forEachMesh,
            forEachSprite = this.forEachSprite,
            after = this.after;
        // setup function
        if ( before ) {
            before( camera );
        }
        // rendering functions
        entities.forEach( function( entity ) {
            if ( entity ) {
                forEachRecursive(
                    entity,
                    forEachEntity,
                    forEachMesh,
                    forEachSprite );
            }
        });
        // teardown function
        if ( after ) {
            after();
        }
    };

    module.exports = RenderPass;

}());

},{}],34:[function(require,module,exports){
(function () {

    "use strict";

    function RenderTechnique( spec ) {
        this.id = spec.id;
        this.passes = spec.passes || [];
        return this;
    }

    RenderTechnique.prototype.execute = function( camera, entities ) {
        this.passes.forEach( function( pass ) {
            pass.execute( camera, entities );
        });
    };

    module.exports = RenderTechnique;

}());

},{}],35:[function(require,module,exports){
(function () {

    "use strict";

    var VertexPackage = require('../core/VertexPackage'),
        VertexBuffer = require('../core/VertexBuffer'),
        IndexBuffer = require('../core/IndexBuffer');

    function parseVertexAttributes( spec ) {
        var attributes = [];
        if ( spec.positions ) {
            attributes.push( spec.positions );
        }
        if ( spec.normals ) {
            attributes.push( spec.normals );
        }
        if ( spec.uvs ) {
            attributes.push( spec.uvs );
        }
        if ( spec.tangents ) {
            attributes.push( spec.tangents );
        }
        if ( spec.bitangents ) {
            attributes.push( spec.bitangents );
        }
        if ( spec.colors ) {
            attributes.push( spec.colors );
        }
        if ( spec.joints ) {
            attributes.push( spec.joints );
        }
        if ( spec.weights ) {
            attributes.push( spec.weights );
        }
        return attributes;
    }

    function createIndices( n ) {
        var indices = new Array( n ),
            i;
        for ( i=0; i<n; i++ ) {
            indices[i] = i;
        }
        return indices;
    }

    function Renderable( spec ) {
        spec = spec || {};
        if ( spec.vertexBuffer || spec.vertexBuffers ) {
            // use existing vertex buffer
            this.vertexBuffers = spec.vertexBuffers || [ spec.vertexBuffer ];
        } else {
            // create vertex package
            var vertexPackage = new VertexPackage( parseVertexAttributes( spec ) );
            // create vertex buffer
            this.vertexBuffers = [ new VertexBuffer( vertexPackage ) ];
        }
        if ( spec.indexBuffer ) {
            // use existing element array buffer
            this.indexBuffer = spec.indexBuffer;
        } else {
            // create element array buffer
            this.indexBuffer = new IndexBuffer( spec.indices || createIndices( this.vertexPackage ), spec.options );
        }
        return this;
    }

    Renderable.prototype.draw = function() {
        var vertexBuffers = this.vertexBuffers,
            i;
        for ( i=0; i<vertexBuffers.length; i++ ) {
            vertexBuffers[i].bind();
        }
        this.indexBuffer.bind();
        this.indexBuffer.draw();
        return this;
    };

    module.exports = Renderable;

}());

},{"../core/IndexBuffer":15,"../core/VertexBuffer":21,"../core/VertexPackage":22}],36:[function(require,module,exports){
(function () {

    "use strict";

    function Renderer( techniques ) {
        if ( !( techniques instanceof Array ) ) {
            techniques = [ techniques ];
        }
        this.techniques = techniques || [];
        return this;
    }

    Renderer.prototype.render = function( camera, entitiesByTechnique ) {
        this.techniques.forEach( function( technique ) {
            var entities = entitiesByTechnique[ technique.id ];
            if ( entities && entities.length > 0 ) {
                technique.execute( camera, entities );
            }
        });
    };

    module.exports = Renderer;

}());

},{}],37:[function(require,module,exports){
(function () {

    "use strict";

    var Mat44 = require('alfador').Mat44;

    function getJointCount( jointsById, joints ) {
        var count = joints.length,
            i;
        for ( i=0; i<joints.length; i++ ) {
            jointsById[ joints[i].id ] = joints[i];
            count += getJointCount( jointsById, joints[i].children );
        }
        return count;
    }

    function Skeleton( that ) {
        // root can be either a single node, or an array of root nodes
        this.root = ( that.root instanceof Array ) ? that.root : [ that.root ];
        this.bindShapeMatrix = that.bindShapeMatrix || Mat44.identity();
        this.jointsById = {};
        this.jointCount = getJointCount( this.jointsById, this.root );
        return this;
    }

    Skeleton.prototype.toFloat32Array = function() {
        var bindShapeMatrix = this.bindShapeMatrix,
            jointsById = this.jointsById,
            arraybuffer,
            skinningMatrix,
            joint,
            key;
        // allocate arraybuffer to store all joint matrices
        arraybuffer = new Float32Array( new ArrayBuffer( 4*16*this.jointCount ) );
        // for each joint, get the skinning matrix
        for ( key in jointsById ) {
            if ( jointsById.hasOwnProperty( key ) ) {
                joint = jointsById[ key ];
                skinningMatrix = joint.skinningMatrix( bindShapeMatrix );
                arraybuffer.set( skinningMatrix.data, joint.index*16 );
            }
        }
        // return array as arraybuffer object
        return arraybuffer;
    };

    module.exports = Skeleton;

}());

},{"alfador":10}],38:[function(require,module,exports){
(function () {

    "use strict";

    var Renderable = require('./Renderable'),
        Geometry = require('./Geometry'),
        Quad = require('../util/shapes/Quad'),
        Material = require('./Material'),
        _geometry,
        _renderable;

    function getGeometry() {
        if ( !_geometry ) {
            _geometry = new Geometry({
                positions: Quad.positions(),
                indices: Quad.indices()
            });
        }
        return _geometry;
    }

    function getRenderable() {
        if ( !_renderable ) {
            _renderable = new Renderable({
                positions: Quad.positions(),
                indices: Quad.indices()
            });
        }
        return _renderable;
    }

    function Sprite( spec ) {
        spec = spec || {};
        this.renderable = getRenderable();
        this.geometry = getGeometry();
        this.material = new Material( spec );
        this.width = spec.width || this.material.diffuseTexture.width;
        this.height = spec.height || this.material.diffuseTexture.height;
    }

    Sprite.prototype.draw = function() {
        this.renderable.draw();
        return this;
    };

    module.exports = Sprite;

}());

},{"../util/shapes/Quad":55,"./Geometry":28,"./Material":30,"./Renderable":35}],39:[function(require,module,exports){
(function () {

    "use strict";

    function Stack() {
        this.data = [];
    }

    Stack.prototype.push = function( value ) {
        this.data.push( value );
        return this;
    };

    Stack.prototype.pop = function() {
        this.data.pop();
        return this;
    };

    Stack.prototype.top = function() {
        var index = this.data.length - 1;
        if ( index < 0 ) {
            return null;
        }
        return this.data[ index ];
    };

    module.exports = Stack;

}());

},{}],40:[function(require,module,exports){
(function () {

    "use strict";

    var simplyDeferred = require('simply-deferred'),
        Deferred = simplyDeferred.Deferred,
        when = simplyDeferred.when;

    /**
     * Returns a function that resolves the provided deferred.
     *
     * @param {Deferred} deferred - The deferred object.
     *
     * @returns {Function} The function to resolve the deferred.
     */
    function resolveDeferred( deferred ) {
        return function( result ) {
            deferred.resolve( result );
        };
    }

    /**
     * Dispatches an array of jobs, accumulating the results and
     * passing them to the callback function in corresponding indices.
     *
     * @param {Array} jobs - The job array.
     * @param {Function} callback - The callback function.
     */
     function asyncArray( jobs, callback ) {
        var deferreds = [],
            deferred,
            i;
        for ( i=0; i<jobs.length; i++ ) {
            deferred = new Deferred();
            deferreds.push( deferred );
            jobs[i]( resolveDeferred( deferred ) );
        }
        when.apply( when, deferreds ).then( function() {
            var results = Array.prototype.slice.call( arguments, 0 );
            callback( results );
        });
    }

    /**
     * Dispatches a map of jobs, accumulating the results and
     * passing them to the callback function under corresponding
     * keys.
     *
     * @param {Object} jobs - The job map.
     * @param {Function} callback - The callback function.
     */
     function asyncObj( jobs, callback ) {
        var jobsByIndex = [],
            deferreds = [],
            deferred,
            key;
        for ( key in jobs ) {
            if ( jobs.hasOwnProperty( key ) ) {
                deferred = new Deferred();
                deferreds.push( deferred );
                jobsByIndex.push( key );
                jobs[ key ]( resolveDeferred( deferred ) );
            }
        }
        when.apply( when, deferreds ).done( function() {
            var results = Array.prototype.slice.call( arguments, 0 ),
                resultsByKey = {},
                i;
            for ( i=0; i<jobsByIndex.length; i++ ) {
                resultsByKey[ jobsByIndex[i] ] = results[i];
            }
            callback( resultsByKey );
        });
    }

    module.exports = {

        /**
         * Execute a set of functions asynchronously, once all have been
         * completed, execute the provided callback function. Jobs may be passed
         * as an array or object. The callback function will be passed the
         * results in the same format as the jobs. All jobs must have accept and
         * execute a callback function upon completion.
         *
         * @param {Array|Object} jobs - The set of functions to execute.
         * @param {Function} callback - The callback function to be executed upon completion.
         */
        async: function( jobs, callback ) {
            if ( jobs instanceof Array ) {
                asyncArray( jobs, callback );
            } else {
                asyncObj( jobs, callback );
            }
        },

        /**
         * Extend class a by class b. Does not recurse, simply overlays top
         * attributes.
         *
         * @param {Object} a - Object a which is extended.
         * @param {Object} b - Object b which extends a.
         *
         * @returns {Object} The extended object.
         */
        extend: function( a, b ) {
            var key;
            for( key in b ) {
                if( b.hasOwnProperty( key ) ) {
                    a[ key ] = b[ key ];
                }
            }
            return a;
        },

        /**
         * Deep copies the provided object. Object cannot be circular.
         *
         * @param {Object} json - The object to copy.
         *
         * @returns {Object} a deep copy of the provided object.
         */
        copy: function( json ) {
            return JSON.parse( JSON.stringify( json ) );
        },

        /**
         * Returns whether or not the object has no attributes.
         *
         * @param {Object} obj - The object to test.
         *
         * @returns {boolean} true if the object has keys, false if not.
         */
        isEmpty: function( obj ) {
            for( var prop in obj ) {
                if( obj.hasOwnProperty( prop ) ) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Returns true if a provided array is a javscript TypedArray.
         *
         * @param {*} array - The variable to test.
         *
         * @returns {boolean} - Whether or not the variable is a TypedArray.
         */
        isTypedArray: function( array ) {
            return array &&
                array.buffer instanceof ArrayBuffer &&
                array.byteLength !== undefined;
        },

        /**
         * Returns true if the provided integer is a power of two.
         *
         * @param {integer} num - The number to test.
         *
         * @returns {boolean} - Whether or not the number is a power of two.
         */
        isPowerOfTwo: function( num ) {
            return ( num !== 0 ) ? ( num & ( num - 1 ) ) === 0 : false;
        },

        /**
         * Returns the next highest power of two for a number.
         *
         * Ex.
         *
         *     200 -> 256
         *     256 -> 256
         *     257 -> 512
         *
         * @param {integer} num - The number to modify.
         *
         * @returns {integer} - Next highest power of two.
         */
        nextHighestPowerOfTwo: function( num ) {
            var i;
            if ( num !== 0 ) {
                num = num-1;
            }
            for ( i=1; i<32; i<<=1 ) {
                num = num | num >> i;
            }
            return num + 1;
        }
    };

}());

},{"simply-deferred":13}],41:[function(require,module,exports){
(function() {

    "use strict";

    module.exports = {

        /**
         * Sends an XMLHttpRequest GET request to the supplied url.
         *
         * @param {String} url - The URL for the resource.
         * @param {Object} options - Contains the following options:
         * <pre>
         *     {
         *         {String} success - The success callback function.
         *         {String} error - The error callback function.
         *         {String} progress - The progress callback function.
         *         {String} responseType - The responseType of the XHR.
         *     }
         * </pre>
         */
        load: function ( url, options ) {
            var request = new XMLHttpRequest();
            request.open( 'GET', url, true );
            request.responseType = options.responseType;
            request.addEventListener( 'load', function () {
                if ( options.success ) {
                    options.success( this.response );
                }
            });
            if ( options.progress ) {
                request.addEventListener( 'progress', function ( event ) {
                    options.progress( event );
                });
            }
            if ( options.error ) {
                request.addEventListener( 'error', function ( event ) {
                    options.error( event );
                });
            }
            request.send();
        }
    };

}());

},{}],42:[function(require,module,exports){
(function () {

    "use strict";

    var PROJ_MATRIX = "uProjectionMatrix",
        MODEL_MATRIX = "uModelMatrix",
        VIEW_MATRIX = "uViewMatrix",
        POS_ATTRIB = "aPosition",
        UV_ATTRIB = "aTexCoord",
        USE_ATTRIB_COLOR = "uUseAttribColor",
        COL_ATTRIB = "aColor",
        COL_UNIFORM = "uColor",
        TEX_SAMPLER = "uDiffuseSampler";

    var FLAT_VERT_SRC = [
            "attribute highp vec3 " + POS_ATTRIB + ";",
            "attribute highp vec3 " + COL_ATTRIB + ";",
            "uniform highp mat4 " + MODEL_MATRIX + ";",
            "uniform highp mat4 " + VIEW_MATRIX + ";",
            "uniform highp mat4 " + PROJ_MATRIX + ";",
            "uniform bool " + USE_ATTRIB_COLOR + ";",
            "uniform highp vec3 " + COL_UNIFORM + ";",
            "varying highp vec3 vColor;",
            "void main() {",
                "if ( " + USE_ATTRIB_COLOR + " ) {",
                    "vColor = " + COL_ATTRIB + ";",
                "} else {",
                    "vColor = " + COL_UNIFORM + ";",
                "}",
                "gl_Position = " + PROJ_MATRIX +
                    " * " + VIEW_MATRIX +
                    " * " + MODEL_MATRIX +
                    " * vec4( " + POS_ATTRIB + ", 1.0 );",
            "}"
        ].join('\n');

    var FLAT_FRAG_SRC = [
            "varying highp vec3 vColor;",
            "void main() {",
                "gl_FragColor = vec4( vColor, 1.0 );",
            "}"
        ].join('\n');

    var TEX_VERT_SRC = [
            "attribute highp vec3 " + POS_ATTRIB + ";",
            "attribute highp vec2 " + UV_ATTRIB + ";",
            "uniform highp mat4 " + MODEL_MATRIX + ";",
            "varying highp vec2 vTexCoord;",
            "void main() {",
                "gl_Position = " + MODEL_MATRIX +
                    " * vec4( " + POS_ATTRIB + ", 1.0 );",
                "vTexCoord = " + UV_ATTRIB + ";",
            "}"
        ].join('\n');

    var TEX_FRAG_SRC = [
            "varying highp vec3 vColor;",
            "uniform sampler2D " + TEX_SAMPLER + ";",
            "varying highp vec2 vTexCoord;",
            "void main() {",
                "gl_FragColor = texture2D( " + TEX_SAMPLER + ", vTexCoord );",
            "}"
        ].join('\n');

    var FLAT_DEBUG_SHADER = null;
    var TEX_DEBUG_SHADER = null;

    var Shader = require('../../core/Shader'),
        Mesh = require('../../render/Mesh'),
        Entity = require('../../render/Entity'),
        Renderer = require('../../render/Renderer'),
        RenderTechnique = require('../../render/RenderTechnique'),
        RenderPass = require('../../render/RenderPass'),
        Quad = require('../shapes/Quad'),
        _debugUUID = 1,
        _renderMap = {},
        _camera = null;

    function getFuncName( func ) {
      var name = func.toString();
      name = name.substr( 'function '.length );
      name = name.substr( 0, name.indexOf('(') );
      return name;
    }

    function createDebugEntity( entity, func ) {
        entity.$$DEBUG_UUID = entity.$$DEBUG_UUID || _debugUUID++;
        var debugHash = entity.$$DEBUG_UUID + "-" + getFuncName( func );
        if ( !_renderMap[ debugHash ] ) {
            _renderMap[ debugHash ] = func( entity );
        }
        return _renderMap[ debugHash ];
    }

    function convertArrayToColors( array ) {
        var colors = new Array( array.length ),
            attrib,
            i;
        for ( i=0; i<array.length; i++ ) {
            attrib = array[i];
            colors[i] = [
                ( ( attrib.x || attrib[0] ) + 1 ) / 2,
                ( ( attrib.y || attrib[1] )  + 1 ) / 2,
                ( ( attrib.z || attrib[2] || 0 ) + 1 ) / 2
            ];
        }
        return colors;
    }

    function createWireFrameEntity( entity ) {
        var copy = entity.copy();
        copy.forEach( function( entity ) {
            var meshes = entity.meshes,
                geometry,
                positions,
                material,
                triIndices,
                lines,
                indices,
                a, b, c,
                i, j;
            entity.meshes = [];
            for ( i=0; i<meshes.length; i++ ) {
                geometry = meshes[i].geometry;
                positions = geometry.positions;
                triIndices = geometry.indices;
                lines = new Array( triIndices.length * 2 );
                indices = new Array( triIndices.length * 2 );
                for ( j=0; j<triIndices.length; j+=3 ) {
                    a = triIndices[j];
                    b = triIndices[j+1];
                    c = triIndices[j+2];
                    lines[j*2] = positions[a];
                    lines[j*2+1] = positions[b];
                    lines[j*2+2] = positions[b];
                    lines[j*2+3] = positions[c];
                    lines[j*2+4] = positions[c];
                    lines[j*2+5] = positions[a];
                    indices[j*2] = j*2;
                    indices[j*2+1] = j*2+1;
                    indices[j*2+2] = j*2+2;
                    indices[j*2+3] = j*2+3;
                    indices[j*2+4] = j*2+4;
                    indices[j*2+5] = j*2+5;
                }
                entity.meshes.push( new Mesh({
                    positions: lines,
                    indices: indices,
                    options: {
                        mode: "LINES"
                    },
                    material: material
                }));
            }
            entity.$$DEBUG_USE_COLOR = false;
        });
        return copy;
    }

    function createColorEntity( entity, attribute ) {
        var copy = entity.copy();
        copy.forEach( function( entity ) {
            var meshes = entity.meshes,
                geometry,
                i;
            entity.meshes = [];
            for ( i=0; i<meshes.length; i++ ) {
                geometry = meshes[i].geometry;
                entity.meshes.push( new Mesh({
                    positions: geometry.positions,
                    colors: convertArrayToColors( geometry[ attribute ] ),
                    indices: geometry.indices
                }));
            }
            entity.$$DEBUG_USE_COLOR = true;
        });
        return copy;
    }

    function createUVColorEntity( entity ) {
        return createColorEntity( entity, "uvs" );
    }

    function createNormalColorEntity( entity ) {
        return createColorEntity( entity, "normals" );
    }

    function createTangentColorEntity( entity ) {
        return createColorEntity( entity, "tangents" );
    }

    function createBiTangentColorEntity( entity ) {
        return createColorEntity( entity, "bitangents" );
    }

    function createLinesEntity( entity, type ) {
        var copy = entity.copy();
        copy.forEach( function( entity ) {
            var meshes = entity.meshes,
                attributes,
                attribute,
                positions,
                position,
                lines,
                indices,
                i,
                j;
            entity.meshes = [];
            for ( i=0; i<meshes.length; i++ ) {
                positions = meshes[i].geometry.positions;
                attributes = meshes[i].geometry[ type ];
                lines = new Array( positions.length * 2 );
                indices = new Array( positions.length * 2 );
                for ( j=0; j<positions.length; j++ ) {
                    position = positions[j];
                    attribute = attributes[j];
                    lines[j*2] = position;
                    lines[j*2+1] = [
                        ( position.x || position[0] || 0 ) + ( attribute.x || attribute[0] || 0 ),
                        ( position.y || position[1] || 0 ) + ( attribute.y || attribute[1] || 0 ),
                        ( position.z || position[2] || 0 ) + ( attribute.z || attribute[2] || 0 )
                    ];
                    indices[j*2] = j*2;
                    indices[j*2+1] = j*2+1;
                }
                entity.meshes.push( new Mesh({
                    positions: lines,
                    indices: indices,
                    options: {
                        mode: "LINES"
                    }
                }));
                entity.$$DEBUG_USE_COLOR = false;
            }
        });
        return copy;
    }

    function createUVVectorEntity( entity ) {
        return createLinesEntity( entity, "uvs" );
    }

    function createNormalVectorEntity( entity ) {
        return createLinesEntity( entity, "normals" );
    }

    function createTangentVectorEntity( entity ) {
        return createLinesEntity( entity, "tangents" );
    }

    function createBiTangentVectorEntity( entity ) {
        return createLinesEntity( entity, "bitangents" );
    }

    var _useColor = false,
        _color = [1,1,0];

    var debugFlatPass = new RenderPass({
        before: function( camera ) {
            if ( !FLAT_DEBUG_SHADER ) {
                // create shader if it does not exist yet
                FLAT_DEBUG_SHADER = new Shader({
                    vert: FLAT_VERT_SRC,
                    frag: FLAT_FRAG_SRC
                });
            }
            FLAT_DEBUG_SHADER.push();
            FLAT_DEBUG_SHADER.setUniform( PROJ_MATRIX, camera.projectionMatrix() );
            FLAT_DEBUG_SHADER.setUniform( VIEW_MATRIX, camera.globalViewMatrix() );
        },
        forEachEntity: function( entity ) {
            _useColor = entity.$$DEBUG_USE_COLOR;
            FLAT_DEBUG_SHADER.setUniform( MODEL_MATRIX, entity.globalMatrix() );
        },
        forEachMesh: function( mesh ) {
            FLAT_DEBUG_SHADER.setUniform( USE_ATTRIB_COLOR, _useColor );
            FLAT_DEBUG_SHADER.setUniform( COL_UNIFORM, _color );
            mesh.draw();
        },
        after: function() {
            FLAT_DEBUG_SHADER.pop();
        }
    });

    var debugTexPass = new RenderPass({
        before: function() {
            if ( !TEX_DEBUG_SHADER ) {
                // create shader if it does not exist yet
                TEX_DEBUG_SHADER = new Shader({
                    vert: TEX_VERT_SRC,
                    frag: TEX_FRAG_SRC
                });
            }
            TEX_DEBUG_SHADER.gl.disable( TEX_DEBUG_SHADER.gl.DEPTH_TEST );
            TEX_DEBUG_SHADER.push();
            TEX_DEBUG_SHADER.setUniform( TEX_SAMPLER, 0 );
        },
        forEachEntity: function( entity ) {
            TEX_DEBUG_SHADER.setUniform( MODEL_MATRIX, entity.globalMatrix() );
        },
        forEachMesh: function( mesh ) {
            mesh.material.diffuseTexture.push( 0 );
            mesh.draw();
            mesh.material.diffuseTexture.pop( 0 );
        },
        after: function() {
            TEX_DEBUG_SHADER.gl.enable( TEX_DEBUG_SHADER.gl.DEPTH_TEST );
            TEX_DEBUG_SHADER.pop();
        }
    });

    var debugFlatTechnique = new RenderTechnique({
        id: "debug",
        passes: [ debugFlatPass ]
    });

    var debugTexTechnique = new RenderTechnique({
        id: "tex",
        passes: [ debugTexPass ]
    });

    var debugRenderer = new Renderer([ debugFlatTechnique, debugTexTechnique ]);

    module.exports = {

        setCamera: function( camera ) {
            _camera = camera;
        },

        drawTexture: function( texture ) {
            var geometry = {
                    positions: Quad.positions(),
                    uvs: Quad.uvs(),
                    indices:  Quad.indices()
                },
                entity = new Entity({
                meshes: [ new Mesh({
                    renderable: geometry,
                    geomertry: geometry,
                    material: {
                        diffuseTexture: texture
                    }
                }) ],
                origin: [ -0.75, 0.75, 0 ],
                scale: 0.5
            });
            debugRenderer.render( null, {
                tex: [ entity ]
            });
        },

        drawWireFrame: function( entity ) {
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createWireFrameEntity ) ]
            });
        },

        drawUVsAsColor: function( entity ) {
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createUVColorEntity ) ]
            });
        },

        drawUVsAsVectors: function( entity, color ) {
            _color = color;
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createUVVectorEntity ) ]
            });
        },

        drawNormalsAsColor: function( entity ) {
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createNormalColorEntity ) ]
            });
        },

        drawNormalsAsVectors: function( entity, color ) {
            _color = color;
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createNormalVectorEntity ) ]
            });
        },

        drawTangentsAsColor: function( entity ) {
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createTangentColorEntity ) ]
            });
        },

        drawTangentsAsVectors: function( entity, color  ) {
            _color = color;
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createTangentVectorEntity ) ]
            });
        },

        drawBiTangentsAsColor: function( entity ) {
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createBiTangentColorEntity ) ]
            });
        },

        drawBiTangentsAsVectors: function( entity, color  ) {
            _color = color;
            debugRenderer.render( _camera, {
                debug: [ createDebugEntity( entity, createBiTangentVectorEntity ) ]
            });
        }
    };

}());

},{"../../core/Shader":17,"../../render/Entity":27,"../../render/Mesh":31,"../../render/RenderPass":33,"../../render/RenderTechnique":34,"../../render/Renderer":36,"../shapes/Quad":55}],43:[function(require,module,exports){
(function () {

    "use strict";

    var alfador = require('alfador'),
        Quaternion = alfador.Quaternion,
        Mat33 = alfador.Mat33,
        Mat44 = alfador.Mat44,
        Vec2 = alfador.Vec2,
        Vec3 = alfador.Vec3;

    var COMPONENT_TYPES_TO_BUFFERVIEWS = {
        "5120": Int8Array,
        "5121": Uint8Array,
        "5122": Int16Array,
        "5123": Uint16Array,
        "5126": Float32Array
    };

    var TYPES_TO_NUM_COMPONENTS = {
        "SCALAR": 1,
        "VEC2": 2,
        "VEC3": 3,
        "VEC4": 4,
        "MAT2": 4,
        "MAT3": 9,
        "MAT4": 16
    };

    var TYPES_TO_CLASS = {
        "SCALAR": Number,
        "VEC2": Vec2,
        "VEC3": Vec3,
        "VEC4": Quaternion,
        "MAT3": Mat33,
        "MAT4": Mat44
    };

    function createAnimationParameter( parametersByAccessor, json, parameterName, accessorName, buffers ) {

        if ( parametersByAccessor[ accessorName ] ) {
            // if already created, no need to re-creat eit
            return;
        }

        var accessor = json.accessors[ accessorName ],
            bufferView = json.bufferViews[ accessor.bufferView ],
            buffer = buffers[ bufferView.buffer ],
            TypedArray = COMPONENT_TYPES_TO_BUFFERVIEWS[ accessor.componentType ],
            numComponents = TYPES_TO_NUM_COMPONENTS[ accessor.type ],
            TypeClass = TYPES_TO_CLASS[ accessor.type ],
            accessorArrayCount = accessor.count * numComponents,
            arrayBuffer = new TypedArray( buffer, bufferView.byteOffset + accessor.byteOffset, accessorArrayCount ),
            values = [],
            beginIndex,
            endIndex,
            i;

        if ( TypeClass === Number ) {

            // if the type is a scalar, return the buffer
            values = arrayBuffer;

        } else {

            if ( parameterName === "rotation" ) {

                // for each component in the accessor
                for ( i=0; i<accessor.count; i++ ) {
                    // calc the begin and end in arraybuffer
                    beginIndex = i * numComponents;
                    endIndex = beginIndex + numComponents;
                    // get the subarray that composes the matrix
                    values.push({
                        axis: new Vec3( arrayBuffer.subarray( beginIndex, endIndex-1 ) ),
                        angle: arrayBuffer.subarray( endIndex-1, endIndex )[0]
                    });
                }

            } else {

                // for each component in the accessor
                for ( i=0; i<accessor.count; i++ ) {
                    // calc the begin and end in arraybuffer
                    beginIndex = i * numComponents;
                    endIndex = beginIndex + numComponents;
                    // get the subarray that composes the matrix
                    values.push(
                        new TypeClass( arrayBuffer.subarray( beginIndex, endIndex ) )
                    );
                }
            }

        }
        parametersByAccessor[ accessorName ] = values;
    }

    /*
    function resolveAnimationTarget( json, targetId, targetPath ) {
        // As per 0.8 spec, animation targets can be:
        //     nodes
        //     materials ( instanceTechniques )
        //     techniques
        //     cameras
        //     lights
        // first check nodes
        if ( json.nodes[ targetId] ) {
            // node
            if ( json.nodes[ targetId ].jointName ) {
                // joint
            } else {
                // node
            }
        } else if ( json.materials[ targetId ] ) {
            // material

        } else {
            // ignore for now
        }
    }
    */

    function createAnimation( animationsByTarget, parametersByAccessor, json, animation, buffers ) {
        var parameters = animation.parameters,
            channel,
            target,
            sampler,
            inputAccessor,
            outputAccessor,
            i;
        // for each channel in the animation
        for ( i=0; i<animation.channels.length; i++ ) {
            // get the animation channel
            channel = animation.channels[i];
            // get the target of the animation
            target = channel.target;
            // get sampler for the channel
            sampler = animation.samplers[ channel.sampler ];
            // get accessor to channel input
            inputAccessor = parameters[ sampler.input ];
            // get accessor to channel output
            outputAccessor = parameters[ sampler.output ];
            // cast input parameter
            createAnimationParameter(
                parametersByAccessor,
                json,
                sampler.input, // parameter name
                inputAccessor,
                buffers );
            // cast output parameter
            createAnimationParameter(
                parametersByAccessor,
                json,
                sampler.output, // parameter name
                outputAccessor,
                buffers );
            // save input
            animationsByTarget[ target.id ] = animationsByTarget[ target.id ] || [];
            animationsByTarget[ target.id ].push({
                path: target.path,
                input: parametersByAccessor[ inputAccessor ],
                output: parametersByAccessor[ outputAccessor ]
            });
        }
    }

    module.exports = {

        createAnimations: function( json, buffers ) {
            var animationsByTarget = {},
                parametersByAccessor = {},
                key;
            for ( key in json.animations ) {
                if ( json.animations.hasOwnProperty( key ) ) {
                    createAnimation(
                        animationsByTarget,
                        parametersByAccessor,
                        json,
                        json.animations[ key ],
                        buffers );
                }
            }
            return animationsByTarget;
        }

    };

}());

},{"alfador":10}],44:[function(require,module,exports){
(function () {

    "use strict";

    var path = require('path'),
        glTFUtil = require('./glTFUtil'),
        glTFMaterial = require('./glTFMaterial'),
        glTFAnimation = require('./glTFAnimation'),
        glTFMesh = require('./glTFMesh'),
        glTFParser = require('./glTFParser'),
        glTFSkeleton = require('./glTFSkeleton'),
        Util = require('../Util'),
        Entity = require('../../render/Entity');

    function createEntityRecursive( json, meshes, buffers, nodeName ) {
        var node = json.nodes[ nodeName ],
            nodeMeshes = [],
            children = [],
            skeleton = null,
            animations = null,
            transform,
            child,
            i;
        // check type of node
        if ( node.jointName || node.camera || node.light ) {
            // node is either a joint, camera, or light, so ignore it as an entity
            return null;
        }
        // get the nodes transform
        transform = glTFUtil.getNodeMatrix( node ).decompose();
        // recursively assemble the skeleton joint tree
        for ( i=0; i<node.children.length; i++ ) {
            child = createEntityRecursive( json, meshes, buffers, node.children[i] );
            // entity can be null since we ignore cameras, joints, and lights
            if ( child ) {
                children.push( child );
            }
        }
        // if node has a mesh, add it,
        if ( node.meshes ) {
            for ( i=0; i<node.meshes.length; i++ ) {
                nodeMeshes = nodeMeshes.concat( meshes[ node.meshes[i] ] );
            }
        }
        // if node has an instanceSkin, create skeleton / animations
        if ( node.instanceSkin ) {
            // skeleton
            skeleton = glTFSkeleton.createSkeleton( json, node.instanceSkin, buffers );
            for ( i=0; i<node.instanceSkin.meshes.length; i++ ) {
                nodeMeshes = nodeMeshes.concat( meshes[ node.instanceSkin.meshes[i] ] );
            }
            // animations
            // NOTE: animations technically may not require a skeleton
            animations = glTFAnimation.createAnimations( json, buffers );
        }
        return new Entity({
            id: nodeName,
            up: transform.up,
            forward: transform.forward,
            left: transform.left,
            origin: transform.origin,
            scale: transform.scale,
            children: children,
            meshes: nodeMeshes,
            skeleton: skeleton,
            animations: animations
        });
    }

    function createEntities( json, meshes, buffers ) {
        var rootNodes = json.scenes[ json.scene ].nodes,
            entities = [],
            entity,
            i;
        // for each node
        for ( i=0; i<rootNodes.length; i++ ) {
            entity = createEntityRecursive( json, meshes, buffers, rootNodes[i] );
            // entity can be null since we ignore cameras, joints, and lights
            if ( entity ) {

                entities.push( entity );
            }
        }
        return entities;
    }

    function loadEntity( json, callback ) {
        // wait for arraybuffers and materials
        Util.async(
            {
                buffers: function( done ) {
                    // send requests for buffers
                    glTFUtil.requestBuffers( json.buffers, function( buffers ) {
                        done( buffers );
                    });
                },
                materials: function( done ) {
                    // load material objects
                    glTFMaterial.loadMaterials( json, function( materials ) {
                        done( materials );
                    });
                }
            },
            function( result ) {
                // create meshes, then entities
                var meshes = glTFMesh.createMeshes( json, result.buffers, result.materials );
                callback( createEntities( json, meshes, result.buffers ) );
            });
    }

    module.exports = {

        /**
         * Loads a glTF JSON file, generates a Model object, and passes it to
         * the callback function upon completion. This also involves loading and
         * generating the associated Material objects.
         *
         * @param {String} url - The url to the JSON file.
         * @param {Function} callback - The callback functione executed upon completion.
         */
        load: function( url, callback ) {

            var modelName = path.basename( url, path.extname( url ) ),
                parser = Object.create( glTFParser, {
                    handleLoadCompleted: {
                        value: function() {
                            loadEntity( this.json, function( children ) {
                                var model = new Entity({
                                        id: modelName,
                                        children: children
                                    });
                                callback( model );
                            });
                        }
                    }
                });
            parser.initWithPath( url );
            parser.load( null, null );
        }

    };

}());

},{"../../render/Entity":27,"../Util":40,"./glTFAnimation":43,"./glTFMaterial":45,"./glTFMesh":46,"./glTFParser":47,"./glTFSkeleton":48,"./glTFUtil":49,"path":11}],45:[function(require,module,exports){
(function () {

    "use strict";

    var Util = require('../Util'),
        glTFUtil = require('./glTFUtil'),
        Texture2D = require('../../core/Texture2D'),
        Material = require('../../render/Material');

    var TEXTURE_FORMATS = {
        "6406": "ALPHA",
        "6407": "RGB",
        "6408": "RGBA",
        "6409": "LUMINANCE",
        "6410": "LUMINANCE_ALPHA",
        "default": "RGBA"
    };

    var TEXTURE_INTERNAL_FORMATS = {
        "6406": "ALPHA",
        "6407": "RGB",
        "6408": "RGBA",
        "6409": "LUMINANCE",
        "6410": "LUMINANCE_ALPHA",
        "default": "RGBA"
    };

    var TEXTURE_TYPES = {
        "5121": "UNSIGNED_BYTE",
        "33635": "UNSIGNED_SHORT_5_6_5",
        "32819": "UNSIGNED_SHORT_4_4_4_4",
        "32820": "UNSIGNED_SHORT_5_5_5_1",
        "default": "UNSIGNED_BYTE"
    };

    var TECHNIQUE_PARAMETER_TYPES = {
        "5122": "SHORT",
        "5123": "UNSIGNED_SHORT",
        "5124": "INT",
        "5125": "UNSIGNED_INT",
        "5126": "FLOAT",
        "35664": "FLOAT_VEC2",
        "35665": "FLOAT_VEC3",
        "35666": "FLOAT_VEC4",
        "35667": "INT_VEC2",
        "35668": "INT_VEC3",
        "35669": "INT_VEC4",
        "35670": "BOOL",
        "35671": "BOOL_VEC2",
        "35672": "BOOL_VEC3",
        "35673": "BOOL_VEC4",
        "35674": "FLOAT_MAT2",
        "35675": "FLOAT_MAT3",
        "35676": "FLOAT_MAT4",
        "35678": "SAMPLER_2D"
    };

    /**
     * Set a property for the material based on its name. If there is no value,
     * assign it a default color.
     *
     * @param {Object} material - The current material object.
     * @param {String} parameterName - The material parameters name.
     * @param {Object} instanceTechnique - The instanceTechnique object.
     * @param {Object} textures - The map of Texture2D objects.
     */
    function setMaterialAttribute( material, parameterName, instanceTechnique, textures ) {
        var parameter = instanceTechnique[ parameterName ];
        if ( parameter ) {
            if ( TECHNIQUE_PARAMETER_TYPES[ parameter.type ] === "SAMPLER_2D" ) {
                // set texture
                material[ parameterName + "Texture" ] = textures[ parameter.value ];
            } else {
                // set color
                material[ parameterName + "Color" ] = parameter.value;
            }
        }
    }

    /**
     * Instantiate a Material object from the instanceTechnique.
     *
     * @param {String} materialId - The materials unique id;
     * @param {Object} instanceTechnique - The instanceTechnique object.
     * @param {Object} textures - The map of Texture2D objects.
     *
     * @returns {Object} The instantiated Material object.
     */
    function createMaterial( materialId, instanceTechnique, textures ) {
        var material = {
            id: materialId
        };
        // set ambient texture or color
        setMaterialAttribute(
            material,
            'ambient',
            instanceTechnique,
            textures
        );
        // set diffuse texture or color
        setMaterialAttribute(
            material,
            'diffuse',
            instanceTechnique,
            textures
        );
        // set specular texture or color
        setMaterialAttribute(
            material,
            'specular',
            instanceTechnique,
            textures
        );
        // set specular component
        if ( instanceTechnique.shininess ) {
            material.specularComponent = instanceTechnique.shininess.value;
        }
        return new Material( material );
    }

    /**
     * A glTF 'material' has an 'instanceTechnique' attribute that references
     * the 'technique' to override. This function overlays the values from the
     * instanceTechnique onto the technique and returns it.
     *
     * @param {Object} technique - The technique to override.
     * @param {Object} instanceTechnique - The instanceTechnique that contains the overrides.
     *
     * @returns {Object} The overrided technique.
     */
    function overrideTechniqueWithInstance( technique, instanceTechnique ) {
        var techniqueParameters =  Util.copy( technique.parameters ),
            instanceValues = Util.copy( instanceTechnique.values ),
            key;
        // for each parameter in the 'technique' node, override with
        // 'instanceTechnique' value, if it exists
        for ( key in instanceValues ) {
            if ( instanceValues.hasOwnProperty( key ) ) {
                // set or override the techniques value
                techniqueParameters[ key ].value = instanceValues[ key ];
            }
        }
        return techniqueParameters;
    }

    /**
     * Instantiates and returns a map of all Material objects defined in the
     * glTF JSON.
     *
     * @param {Object} json - The glTF JSON.
     * @param {Object} textures - The map of Texture2D objects.
     *
     * @returns {Object} The map of Material objects.
     */
    function createMaterials( json, textures ) {
        var materials = json.materials,
            techniques = json.techniques,
            results = {},
            instanceTechnique,
            overriddenTechnique,
            key;
        // for each material
        for ( key in materials ) {
            if ( materials.hasOwnProperty( key ) ) {
                instanceTechnique = materials[ key ].instanceTechnique;
                // overide the technique values with instance technique values
                overriddenTechnique = overrideTechniqueWithInstance(
                    techniques[ instanceTechnique.technique ],
                    instanceTechnique );
                // connect texture image sources
                results[ key ] = createMaterial( key, overriddenTechnique, textures );
            }
        }
        return results;
    }

    /**
     * Instantiates and returns a map of all Texture2D objects defined in the
     * glTF JSON.
     *
     * @param {Object} json - The glTF JSON.
     * @param {Object} images - The map of Image objects.
     *
     * @returns {Object} The map of Texture2D objects.
     */
    function createTextures( json, images ) {
        var textures = json.textures,
            texture,
            results = {},
            key;
        // for each texture
        for ( key in textures ) {
            if ( textures.hasOwnProperty( key ) ) {
                texture = textures[ key ];
                // create Texture2D object from image
                results[ key ] = new Texture2D({
                    image: images[ texture.source ],
                    format: TEXTURE_FORMATS[ texture.format ] || TEXTURE_FORMATS.default,
                    internalFormat: TEXTURE_INTERNAL_FORMATS[ texture.internalFormat ] || TEXTURE_INTERNAL_FORMATS.default,
                    type: TEXTURE_TYPES[ texture.type ] || TEXTURE_TYPES.default,
                    wrap: "REPEAT",
                    invertY: false
                });
            }
        }
        return results;
    }

    module.exports = {

        /**
         * Load and create all Material objects stored in the glTF JSON. Upon
         * completion, executes callback function passing material map as first
         * argument.
         *
         * @param {Object} json - The glTF JSON.
         * @param {Function} callback - The callback function.
         */
        loadMaterials: function( json, callback ) {
            // send requests for images
            glTFUtil.requestImages( json.images, function( images ) {
                // create textures from images, then create materials
                var textures = createTextures( json, images ),
                    materials = createMaterials( json, textures );
                callback( materials );
            });
        }

    };

}());

},{"../../core/Texture2D":19,"../../render/Material":30,"../Util":40,"./glTFUtil":49}],46:[function(require,module,exports){
(function () {

    "use strict";

    var VertexBuffer = require('../../core/VertexBuffer'),
        IndexBuffer = require('../../core/IndexBuffer'),
        WebGLContext = require('../../core/WebGLContext'),
        Mesh = require('../../render/Mesh');

    var ACCESSOR_COMPONENT_TYPES = {
        "5120": "BYTE",
        "5121": "UNSIGNED_BYTE",
        "5122": "SHORT",
        "5123": "UNSIGNED_SHORT",
        "5126": "FLOAT"
    };

    var PRIMITIVE_MODES = {
        "0": "POINTS",
        "1": "LINES",
        "2": "LINE_LOOP",
        "3": "LINE_STRIP",
        "4": "TRIANGLES",
        "5": "TRIANGLE_STRIP",
        "6": "TRIANGLE_FAN",
        "default": "TRIANGLES"
    };

    var BUFFERVIEW_TARGETS = {
        "34962": "ARRAY_BUFFER",
        "34963": "ELEMENT_ARRAY_BUFFER"
    };

    var COMPONENT_TYPES_TO_TYPED_ARRAYS = {
        "5120": Int8Array,
        "5121": Uint8Array,
        "5122": Int16Array,
        "5123": Uint16Array,
        "5126": Float32Array
    };

    var TYPES_TO_NUM_COMPONENTS = {
        "SCALAR": 1,
        "VEC2": 2,
        "VEC3": 3,
        "VEC4": 4,
        "MAT2": 4,
        "MAT3": 9,
        "MAT4": 16
    };

    function bufferAttributeData( webglBuffers, accessorName, json, buffers ) {

        if ( !accessorName ) {
            return null;
        }

        var gl = WebGLContext.get(),
            accessor = json.accessors[ accessorName ],
            bufferViewName = accessor.bufferView,
            bufferView = json.bufferViews[ bufferViewName ],
            bufferTarget = BUFFERVIEW_TARGETS[ bufferView.target ],
            accessorArrayCount = accessor.count * TYPES_TO_NUM_COMPONENTS[ accessor.type ],
            TypedArray = COMPONENT_TYPES_TO_TYPED_ARRAYS[ accessor.componentType ];

        if ( !webglBuffers[ bufferViewName ] ) {
            // create the buffer if it doesnt exist
            webglBuffers[ bufferViewName ] = gl.createBuffer();
            // get the type of buffer target
            bufferTarget = BUFFERVIEW_TARGETS[ bufferView.target ];
            // bind and set buffers byte length
            gl.bindBuffer( gl[ bufferTarget ], webglBuffers[ bufferViewName ] );
            gl.bufferData( gl[ bufferTarget ], bufferView.byteLength, gl.STATIC_DRAW );
        }

        // TODO: cache accessors so that their data isn't buffered multiple times?
        // buffer the accessors sub data
        gl.bufferSubData( gl[ bufferTarget ],
            // buffer the data from the accessors offset into the WebGLBuffer
            accessor.byteOffset,
            new TypedArray(
                // use the respective ArrayBuffer
                buffers[ bufferView.buffer ],
                // combine the bufferViews offset and the accessors offset
                bufferView.byteOffset + accessor.byteOffset,
                // only "view" the accessors count ( taking into account the number of components per type )
                accessorArrayCount ) );
        // return attributePointer
        return {
            bufferView: bufferViewName,
            size: TYPES_TO_NUM_COMPONENTS[ accessor.type ],
            type: ACCESSOR_COMPONENT_TYPES[ accessor.componentType ],
            stride: accessor.byteStride,
            offset: accessor.byteOffset,
            count: accessor.count
        };
    }

    function setPointerByBufferView( pointersByBufferView, index, attributePointer ) {
        if ( !attributePointer ) {
            // ignore if undefined
            return;
        }
        // add vertex attribute pointer under the correct webglbuffer
        pointersByBufferView[ attributePointer.bufferView ] = pointersByBufferView[ attributePointer.bufferView ] || {};
        pointersByBufferView[ attributePointer.bufferView ][ index ] = attributePointer;
    }

    function createMeshFromPrimitive( webglBuffers, primitive, json, buffers, materials ) {

        var attributes = primitive.attributes,
            indices = primitive.indices,
            material = primitive.material,
            pointersByBufferView = {},
            vertexBuffers = [],
            indexBuffer,
            positionsPointer,
            normalsPointer,
            uvsPointer,
            colorsPointer,
            jointsPointer,
            weightsPointer,
            indicesPointer,
            attributePointers,
            key;
        // buffer attribute data and store resulting attribute pointers
        positionsPointer = bufferAttributeData( webglBuffers, attributes.POSITION || attributes.POSITION_0, json, buffers );
        normalsPointer = bufferAttributeData( webglBuffers, attributes.NORMAL || attributes.NORMAL_0, json, buffers );
        uvsPointer = bufferAttributeData( webglBuffers, attributes.TEXCOORD || attributes.TEXCOORD_0, json, buffers );
        jointsPointer = bufferAttributeData( webglBuffers, attributes.JOINT || attributes.JOINT_0, json, buffers );
        weightsPointer = bufferAttributeData( webglBuffers, attributes.WEIGHT || attributes.WEIGHT_0, json, buffers );
        colorsPointer = bufferAttributeData( webglBuffers, attributes.COLOR || attributes.COLOR_0, json, buffers );
        // create map of pointers keyed by bufferview
        setPointerByBufferView( pointersByBufferView, "0", positionsPointer );
        setPointerByBufferView( pointersByBufferView, "1", normalsPointer );
        setPointerByBufferView( pointersByBufferView, "2", uvsPointer );
        //setPointerByBufferView( pointersByBufferView, "3", colorsPointer );
        setPointerByBufferView( pointersByBufferView, "3", jointsPointer );
        setPointerByBufferView( pointersByBufferView, "4", weightsPointer );
        // for each bufferview create a VertexBuffer object, and
        // pass the pointers for the attributes that use it
        for ( key in pointersByBufferView ) {
            if ( pointersByBufferView.hasOwnProperty( key ) ) {
                attributePointers = pointersByBufferView[ key ];
                // create VertexBuffer that references the WebGLBuffer for the bufferview
                vertexBuffers.push( new VertexBuffer( webglBuffers[ key ], attributePointers ) );
            }
        }
        // create similar pointer for indices
        indicesPointer = bufferAttributeData( webglBuffers, indices, json, buffers );
        // set primiive mode
        indicesPointer.mode = PRIMITIVE_MODES[ primitive.primitive ] || PRIMITIVE_MODES.default;
        // create IndexBuffer that references the WebGLBuffer for the bufferview
        indexBuffer = new IndexBuffer(
            webglBuffers[ indicesPointer.bufferView ],
            indicesPointer );
        // instantiate the Mesh object
        return new Mesh({
            vertexBuffers: vertexBuffers,
            indexBuffer: indexBuffer,
            material: materials[ material ]
        });
    }

    function createMeshes( webglBuffers, mesh, json, buffers, materials ) {
        var primitives = mesh.primitives,
            meshes = [],
            i;
        // for each primitive
        for ( i=0; i<primitives.length; i++ ) {
            // create a new mesh for the primitive set
            meshes.push(
                createMeshFromPrimitive(
                    webglBuffers,
                    primitives[i],
                    json,
                    buffers,
                    materials
                )
            );
        }
        return meshes;
    }

    module.exports = {

        createMeshes: function( json, buffers, materials ) {
            var meshes = json.meshes,
                webglBuffers = {},
                results = {},
                key;
            // for each mesh
            for ( key in json.meshes ) {
                if ( json.meshes.hasOwnProperty( key ) ) {
                    // create the array of meshes for the mesh
                    results[ key ] = createMeshes(
                        webglBuffers,
                        meshes[ key ],
                        json,
                        buffers,
                        materials );
                }
            }
            return results;
        }

    };

}());

},{"../../core/IndexBuffer":15,"../../core/VertexBuffer":21,"../../core/WebGLContext":24,"../../render/Mesh":31}],47:[function(require,module,exports){
// Copyright (c) 2013 Fabrice Robinet
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//  * Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
//  * Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/*
    The Abstract Loader has two modes:
        #1: [static] load all the JSON at once [as of now]
        #2: [stream] stream and parse JSON progressively [not yet supported]

    Whatever is the mechanism used to parse the JSON (#1 or #2),
    The loader starts by resolving the paths to binaries and referenced json files (by replace the value of the path property with an absolute path if it was relative).

    In case #1: it is guaranteed to call the concrete loader implementation methods in a order that solves the dependencies between the entries.
    only the nodes requires an extra pass to set up the hirerarchy.
    In case #2: the concrete implementation will have to solve the dependencies. no order is guaranteed.

    When case #1 is used the followed dependency order is:

    scenes -> nodes -> meshes -> materials -> techniques -> shaders
                    -> buffers
                    -> cameras
                    -> lights

    The readers starts with the leafs, i.e:
        shaders, techniques, materials, meshes, buffers, cameras, lights, nodes, scenes

    For each called handle method called the client should return true if the next handle can be call right after returning,
    or false if a callback on client side will notify the loader that the next handle method can be called.

*/
(function() {
    
    "use strict";

    var categoriesDepsOrder = ["buffers", 
                               "bufferViews", 
                               "images",  
                               "videos", 
                               "samplers", 
                               "textures", 
                               "shaders", 
                               "programs", 
                               "techniques", 
                               "materials", 
                               "accessors", 
                               "meshes", 
                               "cameras", 
                               "lights", 
                               "skins", 
                               "nodes", 
                               "scenes", 
                               "animations"];

    var glTFParser = Object.create(Object.prototype, {

        _rootDescription: { value: null, writable: true },

        rootDescription: {
            set: function(value) {
                this._rootDescription = value;
            },
            get: function() {
                return this._rootDescription;
            }
        },

        baseURL: { value: null, writable: true },

        //detect absolute path following the same protocol than window.location
        _isAbsolutePath: {
            value: function(path) {
                var isAbsolutePathRegExp = new RegExp("^"+window.location.protocol, "i");

                return path.match(isAbsolutePathRegExp) ? true : false;
            }
        },

        resolvePathIfNeeded: {
            value: function(path) {
                if (this._isAbsolutePath(path)) {
                    return path;
                }

                return this.baseURL + path;
            }
        },

        _resolvePathsForCategories: {
            value: function(categories) {
                categories.forEach( function(category) {
                    var descriptions = this.json[category];
                    if (descriptions) {
                        var descriptionKeys = Object.keys(descriptions);
                        descriptionKeys.forEach( function(descriptionKey) {
                            var description = descriptions[descriptionKey];
                            description.path = this.resolvePathIfNeeded(description.path || description.uri);
                        }, this);
                    }
                }, this);
            }
        },

        _json: {
            value: null,
            writable: true
        },

        json: {
            enumerable: true,
            get: function() {
                return this._json;
            },
            set: function(value) {
                if (this._json !== value) {
                    this._json = value;
                    this._resolvePathsForCategories(["buffers", "shaders", "images", "videos"]);
                }
            }
        },

        _path: {
            value: null,
            writable: true
        },

        getEntryDescription: {
            value: function (entryID, entryType) {
                var entries = null;

                var category = entryType;
                entries = this.rootDescription[category];
                if (!entries) {
                    console.log("ERROR:CANNOT find expected category named:"+category);
                    return null;
                }

                return entries ? entries[entryID] : null;
            }
        },

        _stepToNextCategory: {
            value: function() {
                this._state.categoryIndex = this.getNextCategoryIndex(this._state.categoryIndex + 1);
                if (this._state.categoryIndex !== -1) {
                    this._state.categoryState.index = 0;
                    return true;
                }

                return false;
            }
        },

        _stepToNextDescription: {
            enumerable: false,
            value: function() {
                var categoryState = this._state.categoryState;
                var keys = categoryState.keys;
                if (!keys) {
                    console.log("INCONSISTENCY ERROR");
                    return false;
                }

                categoryState.index++;
                categoryState.keys = null;
                if (categoryState.index >= keys.length) {
                    return this._stepToNextCategory();
                }
                return false;
            }
        },

        hasCategory: {
            value: function(category) {
                return this.rootDescription[category] ? true : false;
            }
        },

        _handleState: {
            value: function() {

                var methodForType = {
                    "buffers" : this.handleBuffer,
                    "bufferViews" : this.handleBufferView,
                    "shaders" : this.handleShader,
                    "programs" : this.handleProgram,
                    "techniques" : this.handleTechnique,
                    "materials" : this.handleMaterial,
                    "meshes" : this.handleMesh,
                    "cameras" : this.handleCamera,
                    "lights" : this.handleLight,
                    "nodes" : this.handleNode,
                    "scenes" : this.handleScene,
                    "images" : this.handleImage,
                    "animations" : this.handleAnimation,
                    "accessors" : this.handleAccessor,
                    "skins" : this.handleSkin,
                    "samplers" : this.handleSampler,
                    "textures" : this.handleTexture,
                    "videos" : this.handleVideo

                };

                var success = true;
                while (this._state.categoryIndex !== -1) {
                    var category = categoriesDepsOrder[this._state.categoryIndex];
                    var categoryState = this._state.categoryState;
                    var keys = categoryState.keys;
                    if (!keys) {
                        categoryState.keys = keys = Object.keys(this.rootDescription[category]);
                        if (keys) {
                            if (keys.length === 0) {
                                this._stepToNextDescription();
                                continue;
                            }
                        }
                    }

                    var type = category;
                    var entryID = keys[categoryState.index];
                    var description = this.getEntryDescription(entryID, type);
                    if (!description) {
                        if (this.handleError) {
                            this.handleError("INCONSISTENCY ERROR: no description found for entry "+entryID);
                            success = false;
                            break;
                        }
                    } else {

                        if (methodForType[type]) {
                            if (methodForType[type].call(this, entryID, description, this._state.userInfo) === false) {
                                success = false;
                                break;
                            }
                        }

                        this._stepToNextDescription();
                    }
                }

                if (this.handleLoadCompleted) {
                    this.handleLoadCompleted(success);
                }

            }
        },

        _loadJSONIfNeeded: {
            enumerable: true,
            value: function(callback) {
                var self = this;
                //FIXME: handle error
                if (!this._json)  {
                    var jsonPath = this._path;
                    var i = jsonPath.lastIndexOf("/");
                    this.baseURL = (i !== 0) ? jsonPath.substring(0, i + 1) : '';
                    var jsonfile = new XMLHttpRequest();
                    jsonfile.open("GET", jsonPath, true);
                    jsonfile.addEventListener( 'load', function () {
                            self.json = JSON.parse(jsonfile.responseText);
                            if (callback) {
                                callback(self.json);
                            }
                    }, false );

                    jsonfile.send(null);
               } else {
                    if (callback) {
                        callback(this.json);
                    }
                }
            }
        },

        /* load JSON and assign it as description to the reader */
        _buildLoader: {
            value: function(callback) {
                var self = this;
                function JSONReady(json) {
                    self.rootDescription = json;
                    if (callback) {
                        callback(this);
                    }                       
                }

                this._loadJSONIfNeeded(JSONReady);
            }
        },

        _state: { value: null, writable: true },

        _getEntryType: {
            value: function() {
                var rootKeys = categoriesDepsOrder;
                for (var i = 0 ;  i < rootKeys.length ; i++) {
                    var rootValues = this.rootDescription[rootKeys[i]];
                    if (rootValues) {
                        return rootKeys[i];
                    }
                }
                return null;
            }
        },

        getNextCategoryIndex: {
            value: function(currentIndex) {
                for (var i = currentIndex ; i < categoriesDepsOrder.length ; i++) {
                    if (this.hasCategory(categoriesDepsOrder[i])) {
                        return i;
                    }
                }

                return -1;
            }
        },

        load: {
            enumerable: true,
            value: function(userInfo, options) {
                var self = this;
                this._buildLoader(function loaderReady() {
                    var startCategory = self.getNextCategoryIndex.call(self,0);
                    if (startCategory !== -1) {
                        self._state = { "userInfo" : userInfo,
                                        "options" : options,
                                        "categoryIndex" : startCategory,
                                        "categoryState" : { "index" : "0" } };
                        self._handleState();
                    }
                });
            }
        },

        initWithPath: {
            value: function(path) {
                this._path = path;
                this._json = null;
                return this;
            }
        },

        //this is meant to be global and common for all instances
        _knownURLs: { writable: true, value: {} },

        //to be invoked by subclass, so that ids can be ensured to not overlap
        loaderContext: {
            value: function() {
                if (typeof this._knownURLs[this._path] === "undefined") {
                    this._knownURLs[this._path] = Object.keys(this._knownURLs).length;
                }
                return "__" + this._knownURLs[this._path];
            }
        },

        initWithJSON: {
            value: function(json, baseURL) {
                this.json = json;
                this.baseURL = baseURL;
                if (!baseURL) {
                    console.log("WARNING: no base URL passed to Reader:initWithJSON");
                }
                return this;
            }
        }

    });

    module.exports = glTFParser;

}());

},{}],48:[function(require,module,exports){
(function () {

    "use strict";

    var alfador = require('alfador'),
        Mat33 = alfador.Mat33,
        Mat44 = alfador.Mat44,
        glTFUtil = require('./glTFUtil'),
        Joint = require('../../render/Joint'),
        Skeleton = require('../../render/Skeleton');

    var COMPONENT_TYPES_TO_BUFFERVIEWS = {
        "5120": Int8Array,
        "5121": Uint8Array,
        "5122": Int16Array,
        "5123": Uint16Array,
        "5126": Float32Array
    };

    var TYPES_TO_NUM_COMPONENTS = {
        "SCALAR": 1,
        "VEC2": 2,
        "VEC3": 3,
        "VEC4": 4,
        "MAT2": 4,
        "MAT3": 9,
        "MAT4": 16
    };

    var TYPES_TO_CLASS = {
        "MAT3": Mat33,
        "MAT4": Mat44
    };

    function getInverseBindMatrices( json, skin, buffers ) {
        var accessor = json.accessors[ skin.inverseBindMatrices ],
            bufferView = json.bufferViews[ accessor.bufferView ],
            buffer = buffers[ bufferView.buffer ],
            TypedArray = COMPONENT_TYPES_TO_BUFFERVIEWS[ accessor.componentType ],
            numComponents = TYPES_TO_NUM_COMPONENTS[ accessor.type ],
            MatrixClass = TYPES_TO_CLASS[ accessor.type ],
            accessorArrayCount = accessor.count * numComponents,
            arrayBuffer = new TypedArray( buffer, bufferView.byteOffset + accessor.byteOffset, accessorArrayCount ),
            inverseBindMatrices = [],
            beginIndex,
            endIndex,
            i;
        // for each matrix in the accessor
        for ( i=0; i<accessor.count; i++ ) {
            // calc the begin and end in arraybuffer
            beginIndex = i * numComponents;
            endIndex = beginIndex + numComponents;
            // get the subarray that composes the matrix
            inverseBindMatrices.push(
                new MatrixClass( arrayBuffer.subarray( beginIndex, endIndex ) )
            );
        }
        return inverseBindMatrices;
    }

    function createJointHierarchy( json, nodeName, parent, skin, inverseBindMatrices ) {
        var node = json.nodes[ nodeName ],
            jointIndex = skin.jointNames.indexOf( node.jointName ),
            bindMatrix,
            inverseBindMatrix,
            child,
            joint,
            i;
        // if joint does not exist in the skins jointNames, ignore
        if ( jointIndex === -1 ) {
            return null;
        }
        // get the bind / inverse bind matrices
        bindMatrix = glTFUtil.getNodeMatrix( node );
        inverseBindMatrix = inverseBindMatrices[ jointIndex ];
        // create joint here first, in order to pass as parent to recursions
        joint = new Joint({
            id: nodeName,
            name: node.jointName,
            bindMatrix: bindMatrix,
            inverseBindMatrix: inverseBindMatrix,
            parent: parent,
            children: [], // array will be empty here, but populated subsequently
            index: jointIndex
        });
        // fill in children array
        for ( i=0; i<node.children.length; i++ ) {
            child = createJointHierarchy( json, node.children[i], joint, skin, inverseBindMatrices );
            if ( child ) {
                // only add if joint exists in jointNames
                joint.children.push( child );
            }
        }
        return joint;
    }

    module.exports = {

        /**
         * For each skeleton root node in an instanceSkin, build the joint
         * hierarchies and return a single Skeleton object.
         *
         * @param {Object} json - The glTF JSON.
         * @param {Object} instanceSkin - The instanceSkin object for the node.
         * @param {Object} buffers - The map of loaded buffers.
         *
         * @returns {Skeleton} The Skeleton object.
         */
        createSkeleton: function( json, instanceSkin, buffers ) {
            // first find nodes with the names in the instanceSkin.skeletons
            // then search only those nodes and their sub trees for nodes with
            // jointId equal to the strings in skin.joints
            var skeletons = instanceSkin.skeletons,
                skin = json.skins[ instanceSkin.skin ],
                inverseBindMatrices = getInverseBindMatrices( json, skin, buffers ),
                rootNodes = [],
                i;
            // for each root node, create hierarchy of Joint objects
            for ( i=0; i<skeletons.length; i++ ) {
                rootNodes.push( createJointHierarchy( json, skeletons[i], null, skin, inverseBindMatrices ) );
            }
            // return Skeleton object
            return new Skeleton({
                root: rootNodes,
                bindShapeMatrix: new Mat44( skin.bindShapeMatrix || [] )
            });
        }

    };

}());

},{"../../render/Joint":29,"../../render/Skeleton":37,"./glTFUtil":49,"alfador":10}],49:[function(require,module,exports){
(function () {

    "use strict";

    var alfador = require('alfador'),
        Quaternion = alfador.Quaternion,
        Mat44 = alfador.Mat44,
        Vec2 = alfador.Vec2,
        Vec3 = alfador.Vec3,
        Vec4 = alfador.Vec4,
        Util = require('../Util'),
        XHRLoader = require('../XHRLoader');

    module.exports = {

        /**
         * Converts an arraybuffer object to an array of Vec4 objects.
         *
         * @param {ArrayBuffer} array - The ArrayBuffer object to convert.
         *
         * @param {Array} - The converted array.
         */
        convertVec4Array: function( array ) {
            var result = new Array( array.length / 4 ),
                i;
            for ( i=0; i<array.length; i+=4 ) {
                result[ i/4 ] = new Vec4( array[i], array[i+1], array[i+2], array[i+3] );
            }
            return result;
        },

        /**
         * Converts an arraybuffer object to an array of Vec3 objects.
         *
         * @param {ArrayBuffer} array - The ArrayBuffer object to convert.
         *
         * @param {Array} - The converted array.
         */
        convertVec3Array: function( array ) {
            var result = new Array( array.length / 3 ),
                i;
            for ( i=0; i<array.length; i+=3 ) {
                result[ i/3 ] = new Vec3( array[i], array[i+1], array[i+2] );
            }
            return result;
        },

        /**
         * Converts an arraybuffer object to an array of Vec2 objects.
         *
         * @param {ArrayBuffer} array - The ArrayBuffer object to convert.
         *
         * @param {Array} - The converted array.
         */
        convertVec2Array: function( array ) {
            var result = new Array( array.length / 2 ),
                i;
            for ( i=0; i<array.length; i+=2 ) {
                result[ i/2 ] = new Vec2( array[i], array[i+1] );
            }
            return result;
        },

        /**
         * Returns a nodes matrix from either an array or translation,
         * rotation, and scale components.
         *
         * @param {Object} node - A node from the glTF JSON.
         *
         * @returns {Object} The transform matrix.
         *
         */
        getNodeMatrix: function( node ) {
            var translation, rotation, scale;
            // decompose transform components from matrix
            if ( node.matrix ) {
                return new Mat44( node.matrix );
            }

            // get translation
            if ( node.translation ) {
                translation = Mat44.translation( node.translation );
            } else {
                translation = Mat44.identity();
            }

            // get rotation
            if ( node.rotation ) {
                rotation = Mat44.rotationRadians( node.rotation[3], node.rotation );
            } else {
                rotation = Mat44.identity();
            }

            // get orientation
            if ( node.orientation ) {
                rotation = new Quaternion( node.orientation ).matrix();
            }

            // get scale
            if ( node.scale ) {
                scale = Mat44.scale( node.scale );
            } else {
                scale = Mat44.identity();
            }

            return translation.mult( rotation ).mult( scale );
        },

        /**
         * Request a map of arraybuffers from the server. Executes callback
         * function passing a map of loaded arraybuffers keyed by id.
         *
         * @param {Object} buffers - The map of buffers.
         * @param {Function} callback - The callback function.
         */
        requestBuffers: function( buffers, callback ) {
            var jobs = {},
                key;
            function loadBuffer( path ) {
                return function( done ) {
                    XHRLoader.load(
                        path,
                        {
                            responseType: "arraybuffer",
                            success: function( arrayBuffer ) {
                                done( arrayBuffer );
                            }
                        });
                };
            }
            for ( key in buffers ) {
                if ( buffers.hasOwnProperty( key ) ) {
                    jobs[ key ] = loadBuffer( buffers[ key ].path );
                }
            }
            Util.async( jobs, function( buffersById ) {
                callback( buffersById );
            });
        },

        /**
         * Request a map of images from the server. Executes callback
         * function passing a map of Image objects keyed by path.
         *
         * @param {Object} images - The map of images.
         * @param {Function} callback - The callback function.
         */
        requestImages: function( images, callback ) {
            var jobs = {},
                key;
            function loadImage( path ) {
                return function( done ) {
                    var image = new Image();
                    image.onload = function() {
                        done( image );
                    };
                    image.src = path;
                };
            }
            for ( key in images ) {
                if ( images.hasOwnProperty( key ) ) {
                    jobs[ key ] = loadImage( images[ key ].path );
                }
            }
            Util.async( jobs, function( imagesByPath ) {
                callback( imagesByPath );
            });
        }

    };

}());

},{"../Util":40,"../XHRLoader":41,"alfador":10}],50:[function(require,module,exports){
(function() {

    "use strict";

    var path = require('path'),
        Util = require('../Util'),
        XHRLoader = require('../XHRLoader');

    /**
     * Returns a function to load an image, and execute a callback upon
     * completion.
     *
     * @param {String} url - The url for the image to load.
     *
     * @returns {Function} The function to load the image.
     */
    function loadImage( url ) {
        return function( done ) {
            var image = new Image();
            image.onload = function() {
                done( image );
            };
            image.src = url;
        };
    }

    /**
     * Returns a function that generates a material object from the provided
     * material information.
     *
     * @param {Object} materialInfo - The material information object.
     * @param {String} baseUrl - The url containing the texture files.
     * @param {Function} callback - The callback to execute upon completion.
     */
    function generateMaterial( materialInfo, baseUrl ) {
        return function( done ) {
            var material = {
                    id: materialInfo.name
                },
                jobs = {},
                value,
                key;
            for ( key in materialInfo ) {
                if ( materialInfo.hasOwnProperty( key ) ) {
                    value = materialInfo[ key ];
                    switch ( key ) {
                        case 'kd':
                            // diffuse color (color under white light) using RGB
                            // values
                            material.diffuseColor = value;
                            break;
                        case 'ka':
                            // ambient color (color under shadow) using RGB values
                            material.ambientColor = value;
                            break;
                        case 'ks':
                            // Sspecular color (color when light is reflected from
                            // shiny surface) using RGB values
                            material.specularColor = value;
                            break;
                        case 'ns':
                            // specular component
                            // a high exponent results in a tight, concentrated
                            // highlight.
                            // Ns values normally range from 0 to 1000.
                            material.specularComponent = value;
                            break;
                        case 'map_kd':
                            // diffuse texture map
                            jobs.diffuse = loadImage( baseUrl + "/" + value );
                            //material.diffuseTexture = baseUrl + "/" + value;
                            break;
                        case 'd':
                            // d is dissolve for current material
                            // factor of 1.0 is fully opaque, a factor of 0 is
                            // fully transparent
                            if ( value < 1 ) {
                                material.alpha = value;
                            }
                            break;
                        case 'illum':
                            if ( value > 2 && value < 10 ) {
                                material.reflection = 0.3;
                            }
                            if ( value === 6 || value === 7 ) {
                                material.refraction = 0.8;
                            }
                            break;
                    }
                }
            }
            // load all images asynchronously
            Util.async( jobs, function( imagesByType ) {
                var key;
                for ( key in imagesByType ) {
                    if ( imagesByType.hasOwnProperty( key ) ) {
                        material[ key + "Texture" ] = imagesByType[ key ];
                    }
                }
                done( material );
            });
        };
    }

    /**
     * Iterates through the individual material infos and generates
     * the respective Material objects.
     *
     * @param {Object} materialInfos - The map of material information, keyed by name.
     * @param {String baseUrl - The base URL of the folder containing the material dependency files.
     * @param {Function} callback - The callback to execute upon completion.
     */
    function generateMaterials( materialInfos, baseUrl, callback ) {
        var jobs = {},
            key;
        for ( key in materialInfos ) {
            if ( materialInfos.hasOwnProperty( key ) ) {
                jobs[ key ] = generateMaterial( materialInfos[ key ], baseUrl );
            }
        }
        Util.async( jobs, function( materials ) {
            callback( materials );
        });
    }

    /**
     * Parses the source text of a wavefront .mtl file and returns a map
     * of the relevant material information, keyed by name.
     *
     * @author angelxuanchang
     *
     * @param {String} src - The source text of a .mtl file to be parsed.
     *
     * @returns {Object} The parsed source containing all materials keyed by name.
     */
    function parseMTLSource( src ) {
        var lines = src.split( '\n' ),
            materialInfos = {},
            info = {},
            vector,
            line,
            pos,
            key,
            value,
            i;
        for ( i=0; i<lines.length; i++ ) {
            line = lines[ i ].trim();
            if ( line.length === 0 || line.charAt( 0 ) === '#' ) {
                // blank line or comment ignore
                continue;
            }
            pos = line.indexOf( ' ' );
            if ( pos >= 0 ) {
                key = line.substring( 0, pos ).toLowerCase();
                value = line.substring( pos + 1 ).trim();
            } else {
                key = line;
                value = "";
            }
            if ( key === "newmtl" ) {
                // new material
                info = {
                    name: value
                };
                materialInfos[ value ] = info;
            } else if ( info ) {
                if ( key === "ka" ||
                    key === "kd" ||
                    key === "ks" ||
                    key === "ke" ) {
                    // vector value
                    vector = value.split( /\s+/, 3 );
                    info[ key ] = [
                        parseFloat( vector[0] ),
                        parseFloat( vector[1] ),
                        parseFloat( vector[2] ) ];
                } else if ( key === "ns" || key === "d" ) {
                    // scalar value
                    info[ key ] = parseFloat( value );
                } else {
                    // other
                    info[ key ] = value;
                }
            }
        }
        return materialInfos;
    }

    module.exports = {

        /**
         * Loads a wavefront .mtl file, generates a map of material specification
         * objects, keyed by name, and passes it to the callback function upon
         * completion. All textures remain as fully qualified urls.
         *
         * @param {String} url - The url to the .mtl file.
         * @param {Function} callback - The callback functione executed upon completion.
         */
        load: function ( url, callback ) {
            var baseUrl = path.dirname( url );
            XHRLoader.load(
                url,
                {
                    responseType: "text",
                    success: function( src ) {
                        var parsed = parseMTLSource( src );
                        generateMaterials( parsed, baseUrl, callback );
                    }
                });
        }
    };

}());

},{"../Util":40,"../XHRLoader":41,"path":11}],51:[function(require,module,exports){
(function() {

    "use strict";

    var XHRLoader = require('../XHRLoader');

    /**
     * A triangle hashing function used to remove duplicates from
     * the unified array generation process.
     *
     * @param {Object} triangle - The triangle.
     * @param {integer} index - The triangle vertex index.
     *
     * @returns {String} The triangles hash.
     */
    function triHash( triangle, index ) {
        var hash = triangle.positions[ index ].toString();
        if ( triangle.normals ) {
            hash += "-" + triangle.normals[ index ].toString();
        }
        if ( triangle.uvs ) {
            hash += "-" + triangle.uvs[ index ].toString();
        }
        return hash;
    }

    /**
     * Generates unified vertex attribute arrays from triangles. Unified arrays
     * are arrays of vertex attributes organized such that all indices
     * correspond across attributes. Unified arrays are not memory efficient,
     * for example a cube is composed of 8 positions and 6 normals. this would
     * be organized into two unified arrays each consisting of 24 elements.
     * WebGL vertex buffers only accepts unified arrays.
     *
     * @param {Object} mesh - The mesh information object.
     *
     * @returns {Object} The object containing attribute and index arrays.
     */
    function convertToUnifiedArrays( mesh ) {
        var positions = [],
            normals = [],
            uvs = [],
            indices = [],
            count = 0,
            hashes = {},
            hash,
            arrays,
            triangle,
            index,
            i, j;
        for ( i=0; i<mesh.triangles.length; i++ ) {
            // for each triangle
            triangle = mesh.triangles[i];
            for ( j=0; j<3; j++ ) {
                // hash its values
                hash = triHash( triangle, j );
                //index = hashes[ hash ];
                if ( index === undefined ) {
                    // if doesn't exist, add attributes to array
                    positions.push( triangle.positions[j] );
                    if ( triangle.normals ) {
                        normals.push( triangle.normals[j] );
                    }
                    if ( triangle.uvs ) {
                        uvs.push( triangle.uvs[j] );
                    }
                    indices.push( count );
                    hashes[ hash ] = count;
                    count++;
                } else {
                    // if does, reference existing attributes
                    indices.push( index );
                }
            }
        }
        arrays = {
            triangles: mesh.triangles,
            positions: positions,
            indices: indices,
            normals: normals,
            material: mesh.material // material name, not actual material set
        };
        if ( uvs.length > 0 ) {
            arrays.uvs = uvs;
        }
        return arrays;
    }

    /**
     * Iterate through the model information meshes and create all vertex
     * attribute arrays from triangles. Replaces existing 'mesh' attributes.
     *
     * @param {Object} model - The model information object.
     *
     * @returns {Object} The Model information object with meshes appended.
     */
    function convertTrianglesToArrays( model ) {
        var meshes = model.meshes,
            i;
        for ( i=0; i<meshes.length; i++ ) {
            meshes[i] = convertToUnifiedArrays( meshes[i] );
        }
        return model;
    }

    /**
     * Parses the source text of a wavefront .obj file and returns a model
     * information object containing the relevant information.
     *
     * @param {String} src - The source text of a .obj file to be parsed.
     *
     * @returns {Object} The parsed .obj file.
     */
    function parseOBJSource( src ) {

        function addEmptyMesh( groupName, objName, materialName ) {
            var mesh;
            // create fresh triangles
            triangles = [];
            // assign it to the new empty mesh
            mesh = {
                triangles: triangles
            };
            // if mesh group is provided, add it
            if ( groupName ) {
                mesh.group = groupName;
            }
            // if object name is provided, add it
            if ( objName ) {
                mesh.name = objName;
            }
            // if a material name is provided, add it
            if ( materialName ) {
                mesh.material = materialName;
            }
            // append empty mesh to model
            model.meshes.push( mesh );
            // clear group and object names
            nextGroup = null;
            nextObject = null;
        }

        function addMtlLib( line ) {
            var mtllib = line.substring( 7 ).trim();
            model.mtllib = model.mtllib || [];
            if ( model.mtllib.indexOf( mtllib ) === -1 ) {
                // only add if it already isn't there
                model.mtllib.push( mtllib );
            }
        }

        function getPosition( value ) {
			var index = parseInt( value, 10 );
			if ( index >= 0  ) {
                return positions[ index - 1 ];
            }
            return positions[ index + positions.length ];
		}

        function getUV( value ) {
			var index = parseInt( value, 10 );
			if ( index >= 0  ) {
                return uvs[ index - 1 ];
            }
            return uvs[ index + uvs.length ];
		}

        function getNormal( value ) {
			var index = parseInt( value, 10 );
			if ( index >= 0  ) {
                return normals[ index - 1 ];
            }
            return normals[ index + normals.length ];
		}

        function buildTriangleFromIndices( posIndices, uvIndices, normIndices ) {
            var triangle = {},
                a, b, c, u, v,
                normal, mag;
            // add positions to the triangle
            triangle.positions = [
                getPosition( posIndices[0] ),
                getPosition( posIndices[1] ),
                getPosition( posIndices[2] ) ];
            // if uvs are provided, add them to the triangle
            if ( uvIndices ) {
                triangle.uvs = [
                    getUV( uvIndices[0] ),
                    getUV( uvIndices[1] ),
                    getUV( uvIndices[2] ) ];
            }
            // if normals are provided, add them to the triangle
            if ( normIndices ) {
                triangle.normals = [
                    getNormal( normIndices[0] ),
                    getNormal( normIndices[1] ),
                    getNormal( normIndices[2] ) ];
            } else {
                // if normals are not provided, generate them
                a = triangle.positions[0];
                b = triangle.positions[1];
                c = triangle.positions[2];
                u = [ b[0]-a[0], b[1]-a[1], b[2]-a[2] ]; // b - a
                v = [ c[0]-a[0], c[1]-a[1], c[2]-a[2] ]; // c - a
                // cross product
                normal = [
                    ( u[1] * v[2] ) - ( v[1] * u[2] ),
                    (-u[0] * v[2] ) + ( v[0] * u[2] ),
                    ( u[0] * v[1] ) - ( v[0] * u[1] )
                ];
                // normalize
                mag = Math.sqrt(
                    normal[0]*normal[0] +
                    normal[1]*normal[1] +
                    normal[2]*normal[2] );
                normal = [
                    normal[0] / mag,
                    normal[1] / mag,
                    normal[2] / mag ];
                triangle.normals = [
                    normal,
                    normal,
                    normal
                ];
            }
            // add triangle to array
            triangles.push( triangle );
        }

        function parseFaceInput( posIndices, uvIndices, normIndices ) {
            buildTriangleFromIndices( posIndices, uvIndices, normIndices );
            if ( posIndices[ 3 ] !== undefined ) {
                posIndices = [ posIndices[ 0 ], posIndices[ 2 ], posIndices[ 3 ] ];
                if ( uvIndices ) {
                    uvIndices = [ uvIndices[ 0 ], uvIndices[ 2 ], uvIndices[ 3 ] ];
                }
                if ( normIndices ) {
                    normIndices = [ normIndices[ 0 ], normIndices[ 2 ], normIndices[ 3 ] ];
                }
                buildTriangleFromIndices( posIndices, uvIndices, normIndices );
            }
        }

            // v float float float
        var POSITION_REGEX = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/,
            // vn float float float
            NORMAL_REGEX = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/,
            // vt float float
            UV_REGEX = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/,
            // f vertex vertex vertex ...
            FACE_V_REGEX = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/,
    		// f vertex/uv vertex/uv vertex/uv ...
    		FACE_V_UV_REGEX = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/,
    		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
    		FACE_V_UV_N_REGEX = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/,
    		// f vertex//normal vertex//normal vertex//normal ...
    		FACE_V_N_REGEX = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/,
            model = {
                meshes: []
            },
            positions = [],
            uvs = [],
            normals = [],
            triangles = [],
            nextGroup = null,
            nextObject = null,
            lines = src.split( "\n" ),
            line,
            result,
            i;
        // parse lines
        for ( i=0; i<lines.length; i++ ) {
            line = lines[ i ].trim();
            if ( line.length === 0 || line.charAt( 0 ) === '#' ) {
                // # comment or blank line
                continue;
            } else if ( ( result = POSITION_REGEX.exec( line ) ) !== null ) {
                // position
                // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                positions.push([
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] ),
                    parseFloat( result[ 3 ] )
                ]);
            } else if ( ( result = NORMAL_REGEX.exec( line ) ) !== null ) {
                // normal
                // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                normals.push([
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] ),
                    parseFloat( result[ 3 ] )
                ]);
            } else if ( ( result = UV_REGEX.exec( line ) ) !== null ) {
                // uvs
                // ["vt 0.1 0.2", "0.1", "0.2"]
                uvs.push([
                    parseFloat( result[ 1 ] ),
                    parseFloat( result[ 2 ] )
                ]);
            } else if ( ( result = FACE_V_REGEX.exec( line ) ) !== null ) {
                // face of positions
                // ["f 1 2 3", "1", "2", "3", undefined]
                parseFaceInput(
                    [ // positions
                        result[ 1 ],
                        result[ 2 ],
                        result[ 3 ],
                        result[ 4 ]
                    ],
                    null, // uvs
                    null ); // normals
            } else if ( ( result = FACE_V_UV_REGEX.exec( line ) ) !== null ) {
                // face of positions and uvs
                // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]
                parseFaceInput(
                    [ // positions
                        result[ 2 ],
                        result[ 5 ],
                        result[ 8 ],
                        result[ 11 ]
                    ],
                    [ // uvs
                        result[ 3 ],
                        result[ 6 ],
                        result[ 9 ],
                        result[ 12 ]
                    ],
                    null ); // normals
            } else if ( ( result = FACE_V_UV_N_REGEX.exec( line ) ) !== null ) {
                // face of positions, uvs, and normals
                // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
                parseFaceInput(
                    [ // positions
                        result[ 2 ],
                        result[ 6 ],
                        result[ 10 ],
                        result[ 14 ]
                    ],
                    [ // uvs
                        result[ 3 ],
                        result[ 7 ],
                        result[ 11 ],
                        result[ 15 ]
                    ],
                    [ // normals
                        result[ 4 ],
                        result[ 8 ],
                        result[ 12 ],
                        result[ 16 ]
                    ]);
            } else if ( ( result = FACE_V_N_REGEX.exec( line ) ) !== null ) {
                // face of positions and normals
                // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]
                parseFaceInput(
                    [ // positions
                        result[ 2 ],
                        result[ 5 ],
                        result[ 8 ],
                        result[ 11 ]
                    ],
                    null, // uvs
                    [ // normals
                        result[ 3 ],
                        result[ 6 ],
                        result[ 9 ],
                        result[ 12 ]
                    ]);
            } else if ( /^o /.test( line ) ) {
                // object
                nextObject = line.substring( 2 ).trim();
            } else if ( /^g /.test( line ) ) {
                // group
                nextGroup = line.substring( 2 ).trim();
            } else if ( /^usemtl /.test( line ) ) {
                // material
                addEmptyMesh( nextGroup, nextObject, line.substring( 7 ).trim() );
            } else if ( /^mtllib /.test( line ) ) {
                // mtl file
                addMtlLib( line );
            }
        }
        if ( model.meshes.length === 0 ) {
            // no mtls, assemble all under a single mesh
            model.meshes.push({
                triangles: triangles
            });
        }
        return model;
    }

    module.exports = {

        /**
         * Loads a wavefront .obj file, generates a model specification object
         * and passes it to the callback function upon completion.
         *
         * @param {String} url - The url to the .obj file.
         * @param {Function} callback - The callback function.
         */
        load: function( url, callback ) {
            XHRLoader.load(
                url,
                {
                    responseType: "text",
                    success: function( src ) {
                        var parsed = parseOBJSource( src ),
                            model = convertTrianglesToArrays( parsed );
                            callback( model );
                    }
                });
        }

     };

}());

},{"../XHRLoader":41}],52:[function(require,module,exports){
(function() {

    "use strict";

    var path = require('path'),
        Util = require('../Util'),
        OBJLoader = require('./OBJLoader'),
        MTLLoader = require('./MTLLoader');

    /**
     * Iterates through the mitlib attribute of the model and loads materials
     * from all associated .mtl files. Passes the material specification objects
     * to the callback function.
     *
     * @param {Object} model - The model information object.
     * @param {String baseUrl - The base URL of the folder containing the material dependency files.
     * @param {Function} callback - The callback function executed upon completion.
     */
    function loadMaterials( model, baseUrl, callback ) {
        var jobs = [];
        // if no material, exit early
        if ( !model.mtllib ) {
            callback( model );
            return;
        }
        // set up the material loading job
        model.mtllib.forEach( function( mtllib ) {
            jobs.push( function( done ) {
                MTLLoader.load( baseUrl + '/' + mtllib, done );
            });
        });
        // dispatch all material loading jobs
        Util.async( jobs, function( materials ) {
            var materialsByName = {};
            materials.forEach( function( material ) {
                Util.extend( materialsByName, material );
            });
            callback( materialsByName );
        });
    }

    module.exports = {

        /**
         * Loads a wavefront .obj file, generates a model specification object,
         * and passes it to the callback function upon completion.This also
         * involves loading and generating the associated material specification
         * objects from the respective wavefront .mtl files.
         *
         * @param {String} url - The url to the .obj file.
         * @param {Function} callback - The callback functione executed upon completion.
         */
        load: function( url, callback ) {
            // load and parse OBJ file
            OBJLoader.load( url, function( model ) {
                // then load and parse MTL file
                loadMaterials( model, path.dirname( url ), function( materialsById ) {
                    // add each material to the associated mesh
                    model.meshes.forEach( function( mesh ) {
                        mesh.material = materialsById[ mesh.material ];
                    });
                    callback( model );
                });
            });
        }

     };

}());

},{"../Util":40,"./MTLLoader":50,"./OBJLoader":51,"path":11}],53:[function(require,module,exports){
(function () {

    "use strict";

    var SIZE = 1;

    module.exports = {

        positions: function( size ) {
            size = size || SIZE;
            return [
                // front face
                [ -size/2, -size/2,  size/2 ],
                [ size/2, -size/2,  size/2 ],
                [  size/2,  size/2,  size/2 ],
                [ -size/2,  size/2,  size/2 ],
                // back face
                [ -size/2, -size/2, -size/2 ],
                [ -size/2,  size/2, -size/2 ],
                [  size/2,  size/2, -size/2 ],
                [  size/2, -size/2, -size/2 ],
                // top face
                [ -size/2,  size/2, -size/2 ],
                [ -size/2,  size/2,  size/2 ],
                [  size/2,  size/2,  size/2 ],
                [  size/2,  size/2, -size/2 ],
                // bottom face
                [ -size/2, -size/2, -size/2 ],
                [  size/2, -size/2, -size/2 ],
                [  size/2, -size/2,  size/2 ],
                [ -size/2, -size/2,  size/2 ],
                // right face
                [  size/2, -size/2, -size/2 ],
                [  size/2,  size/2, -size/2 ],
                [  size/2,  size/2,  size/2 ],
                [  size/2, -size/2,  size/2 ],
                // left face
                [ -size/2, -size/2, -size/2 ],
                [ -size/2, -size/2,  size/2 ],
                [ -size/2,  size/2,  size/2 ],
                [ -size/2,  size/2, -size/2 ]
            ];
        },

        normals: function() {
            return [
                // front face
                [ 0.0,  0.0,  1.0 ],
                [ 0.0,  0.0,  1.0 ],
                [ 0.0,  0.0,  1.0 ],
                [ 0.0,  0.0,  1.0 ],
                // back face
                [ 0.0,  0.0, -1.0 ],
                [ 0.0,  0.0, -1.0 ],
                [ 0.0,  0.0, -1.0 ],
                [ 0.0,  0.0, -1.0 ],
                // top face
                [ 0.0,  1.0,  0.0 ],
                [ 0.0,  1.0,  0.0 ],
                [ 0.0,  1.0,  0.0 ],
                [ 0.0,  1.0,  0.0 ],
                // bottom face
                [ 0.0, -1.0,  0.0 ],
                [ 0.0, -1.0,  0.0 ],
                [ 0.0, -1.0,  0.0 ],
                [ 0.0, -1.0,  0.0 ],
                // right face
                [ 1.0,  0.0,  0.0 ],
                [ 1.0,  0.0,  0.0 ],
                [ 1.0,  0.0,  0.0 ],
                [ 1.0,  0.0,  0.0 ],
                // left face
                [ -1.0,  0.0,  0.0 ],
                [ -1.0,  0.0,  0.0 ],
                [ -1.0,  0.0,  0.0 ],
                [ -1.0,  0.0,  0.0 ]
            ];
        },

        uvs: function() {
            return [
                // front face
                [ 0.0, 0.0 ],
                [ 1.0, 0.0 ],
                [ 1.0, 1.0 ],
                [ 0.0, 1.0 ],
                // back face
                [ 1.0, 0.0 ],
                [ 1.0, 1.0 ],
                [ 0.0, 1.0 ],
                [ 0.0, 0.0 ],
                // top face
                [ 0.0, 1.0 ],
                [ 0.0, 0.0 ],
                [ 1.0, 0.0 ],
                [ 1.0, 1.0 ],
                // bottom face
                [ 1.0, 1.0 ],
                [ 0.0, 1.0 ],
                [ 0.0, 0.0 ],
                [ 1.0, 0.0 ],
                // right face
                [ 1.0, 0.0 ],
                [ 1.0, 1.0 ],
                [ 0.0, 1.0 ],
                [ 0.0, 0.0 ],
                // left face
                [ 0.0, 0.0 ],
                [ 1.0, 0.0 ],
                [ 1.0, 1.0 ],
                [ 0.0, 1.0 ]
            ];
        },

        indices: function() {
            return [
                0, 1, 2, 0, 2, 3, // front face
                4, 5, 6, 4, 6, 7, // back face
                8, 9, 10, 8, 10, 11, // top face
                12, 13, 14, 12, 14, 15, // bottom face
                16, 17, 18, 16, 18, 19, // right face
                20, 21, 22, 20, 22, 23  // left face
            ];
        },

        geometry: function( size ) {
            return {
                positions: this.positions( size ),
                normals: this.normals(),
                uvs: this.uvs(),
                indices: this.indices(),
            };
        }
    };

}());

},{}],54:[function(require,module,exports){
(function () {

    "use strict";

    var SLICES = 20,
        HEIGHT = 1,
        RADIUS = 1;

    module.exports = {

        positions: function( slices, height, radius ) {
            var positions = [],
                sliceAngle,
                x0, z0,
                i;
            slices = slices || SLICES;
            height = height || HEIGHT;
            radius = radius || RADIUS;
            sliceAngle = 2 * Math.PI / slices;
    		for ( i=0; i<=slices; i++ ) {
    			x0 = radius * Math.sin( i * sliceAngle );
    			z0 = radius * Math.cos( i * sliceAngle );
                positions.push([ x0, height, z0 ]);
    		}
            for ( i=0; i<=slices; i++ ) {
    			x0 = radius * Math.sin( i * sliceAngle );
    			z0 = radius * Math.cos( i * sliceAngle );
                positions.push([ x0, 0, z0 ]);
    		}
            return positions;
        },

        normals: function( slices ) {
            var normals = [],
                sliceAngle,
                x0, z0,
                i;
            slices = slices || SLICES;
            sliceAngle = 2 * Math.PI / slices;
    		for ( i=0; i<=slices; i++ ) {
    			x0 = Math.sin( i * sliceAngle );
    			z0 = Math.cos( i * sliceAngle );
                normals.push([ x0, 0, z0 ]);
    		}
            for ( i=0; i<=slices; i++ ) {
    			x0 = Math.sin( i * sliceAngle );
    			z0 = Math.cos( i * sliceAngle );
                normals.push([ x0, 0, z0 ]);
    		}
            return normals;
        },

        uvs: function( slices ) {
            var uvs = [],
                i;
            slices = slices || SLICES;
    		for ( i=0; i<=slices; i++ ) {
                uvs.push([ i / slices, 1 ]);
    		}
            for ( i=0; i<=slices; i++ ) {
                uvs.push([ i / slices, 0 ]);
    		}
            return uvs;
        },

        indices: function( slices ) {
        	var vertexIndex = 0,
                indices = [],
                i;
            slices = slices || SLICES;
    		for ( i=0; i<=slices; i++ ) {
                indices.push( vertexIndex + slices + 1 );
                indices.push( vertexIndex );
                indices.push( vertexIndex + slices );
                indices.push( vertexIndex + slices + 1 );
                indices.push( vertexIndex + 1 );
                indices.push( vertexIndex );
                vertexIndex++;
    		}
            return indices;
        },

        geometry: function( stacks, radius ) {
            return {
                positions: this.positions( stacks, radius ),
                normals: this.normals( stacks ),
                uvs: this.uvs( stacks ),
                indices: this.indices( stacks ),
            };
        }

    };

}());

},{}],55:[function(require,module,exports){
(function () {

    "use strict";

    var SIZE = 1;

    module.exports = {

        positions: function( size ) {
            size = size || SIZE;
            return [
                [ -size/2, -size/2,  0 ],
                [ size/2, -size/2,  0 ],
                [  size/2,  size/2,  0 ],
                [ -size/2,  size/2,  0 ]
            ];
        },

        normals: function() {
            return [
                [ 0.0,  0.0,  1.0 ],
                [ 0.0,  0.0,  1.0 ],
                [ 0.0,  0.0,  1.0 ],
                [ 0.0,  0.0,  1.0 ]
            ];
        },

        uvs: function() {
            return [
                [ 0.0, 0.0 ],
                [ 1.0, 0.0 ],
                [ 1.0, 1.0 ],
                [ 0.0, 1.0 ]
            ];
        },

        indices: function() {
            return [
                0, 1, 2, 0, 2, 3
            ];
        },

        geometry: function( size ) {
            return {
                positions: this.positions( size ),
                normals: this.normals(),
                uvs: this.uvs(),
                indices: this.indices(),
            };
        }
    };

}());

},{}],56:[function(require,module,exports){
(function () {

    "use strict";

    var alfador = require('alfador'),
        Vec3 = alfador.Vec3,
        Vec2 = alfador.Vec2;

    function orthogonalizeTangent( normal, tangent, bitangent ) {
        normal = new Vec3( normal );
        // Gram-Schmidt orthogonalize
        var nt = normal.dot( tangent );
        tangent = tangent.sub( normal.mult( nt ) ).normalize();
        // calculate handedness
        if ( normal.cross( tangent ).dot( bitangent ) < 0 ) {
            return tangent.negate();
        }
        return tangent;
    }

    function setOrAdd( array, index, entry ) {
        if ( array[ index ] ) {
            // if entry exists, add it to it
            array[ index ].add( entry );
        } else {
            // otherwise, set the entry
            array[ index ] = new Vec3( entry );
        }
    }

    module.exports = {

        computeNormals: function( positions, indices ) {
            var normals = new Array( positions.length ),
                normal,
                a, b, c,
                p0, p1, p2,
                u, v,
                i;
            for ( i=0; i<indices.length; i+=3 ) {
                a = indices[i];
                b = indices[i+1];
                c = indices[i+2];
                p0 = new Vec3( positions[ a ] );
                p1 = new Vec3( positions[ b ] );
                p2 = new Vec3( positions[ c ] );
                u = p1.sub( p0 );
                v = p2.sub( p0 );
                normal = u.cross( v ).normalize();
                normals[a] = normal;
                normals[b] = normal;
                normals[c] = normal;
            }
            return normals;
        },

        computeTangents: function( positions, normals, uvs, indices ) {

            var tangents = new Array( positions.length ),
                bitangents = new Array( positions.length ),
                a, b, c, r,
                p0, p1, p2,
                uv0, uv1, uv2,
                deltaPos1, deltaPos2,
                deltaUV1, deltaUV2,
                p1uv2y, p2uv1y,
                p2uv1x, p1uv2x,
                tangent,
                tangent0,
                tangent1,
                tangent2,
                bitangent,
                i;

            for ( i=0; i<indices.length; i+=3 ) {
                a = indices[i];
                b = indices[i+1];
                c = indices[i+2];

                p0 = new Vec3( positions[ a ] );
                p1 = new Vec3( positions[ b ] );
                p2 = new Vec3( positions[ c ] );

                uv0 = new Vec2( uvs[ a ] );
                uv1 = new Vec2( uvs[ b ] );
                uv2 = new Vec2( uvs[ c ] );

                deltaPos1 = p1.sub( p0 );
                deltaPos2 = p2.sub( p0 );

                deltaUV1 = uv1.sub( uv0 );
                deltaUV2 = uv2.sub( uv0 );

                r = 1 / ( deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x );

                p1uv2y = deltaPos1.mult( deltaUV2.y );
                p2uv1y = deltaPos2.mult( deltaUV1.y );
                tangent = ( ( p1uv2y ).sub( p2uv1y ) ).mult( r );

                p2uv1x = deltaPos2.mult( deltaUV1.x );
                p1uv2x = deltaPos1.mult( deltaUV2.x );
                bitangent = ( ( p2uv1x ).sub( p1uv2x ) ).mult( r );

                // ensure the tangent is orthogonal with the normal
                tangent0 = orthogonalizeTangent( normals[ a ], tangent, bitangent );
                tangent1 = orthogonalizeTangent( normals[ b ], tangent, bitangent );
                tangent2 = orthogonalizeTangent( normals[ c ], tangent, bitangent );

                // tangents or bi-tangents may be shared by multiple triangles,
                // in this case add it to the current tangent. We don't
                // normalize here as it gives more weight to larger triangles.
                setOrAdd( tangents, a, tangent0 );
                setOrAdd( tangents, b, tangent1 );
                setOrAdd( tangents, c, tangent2 );

                setOrAdd( bitangents, a, bitangent );
                setOrAdd( bitangents, b, bitangent );
                setOrAdd( bitangents, c, bitangent );
            }

            // now we normalize the tangents and bi-tangents
            for ( i=0; i<tangents.length; i++ ) {
                tangents[i] = tangents[i].normalize();
                bitangents[i] = bitangents[i].normalize();
            }

            return {
                tangents: tangents,
                bitangents: bitangents
            };
        }

    };

}());

},{"alfador":10}],57:[function(require,module,exports){
(function () {

    "use strict";

    var SLICES = 20,
        STACKS = 20,
        RADIUS = 1;

    module.exports = {

        positions: function( slices, stacks, radius ) {
            var positions = [],
                stackAngle,
                sliceAngle,
                r0, y0, x0, z0,
                i, j;
            slices = slices || SLICES;
            stacks = stacks || STACKS;
            radius = radius || RADIUS;
            stackAngle = Math.PI / stacks;
        	sliceAngle = 2 * Math.PI / slices;
        	for ( i=0; i<=stacks; i++ ) {
        		r0 = radius * Math.sin( i * stackAngle );
        		y0 = radius * Math.cos( i * stackAngle );
        		for ( j=0; j<=slices; j++ ) {
        			x0 = r0 * Math.sin( j * sliceAngle );
        			z0 = r0 * Math.cos( j * sliceAngle );
                    positions.push([ x0, y0, z0 ]);
        		}
        	}
            return positions;
        },

        normals: function( slices, stacks ) {
            var normals = [],
                stackAngle,
                sliceAngle,
                r0, y0, x0, z0,
                i, j;
            slices = slices || SLICES;
            stacks = stacks || STACKS;
            stackAngle = Math.PI / stacks;
        	sliceAngle = 2 * Math.PI / slices;
        	for ( i=0; i<=stacks; i++ ) {
        		r0 = Math.sin( i * stackAngle );
        		y0 = Math.cos( i * stackAngle );
        		for ( j=0; j<=slices; j++ ) {
        			x0 = r0 * Math.sin( j * sliceAngle );
        			z0 = r0 * Math.cos( j * sliceAngle );
                    normals.push([ x0, y0, z0 ]);
        		}
        	}
            return normals;
        },

        uvs: function( slices, stacks ) {
            var uvs = [],
                i, j;
            slices = slices || SLICES;
            stacks = stacks || STACKS;
            for ( i=0; i<=stacks; i++ ) {
        		for ( j=0; j<=slices; j++ ) {
                    uvs.push([ j / slices, 1-(i / stacks) ]);
        		}
        	}
            return uvs;
        },

        indices: function( slices, stacks ) {
        	var vertexIndex = 0,
                indices = [],
                i, j;
            slices = slices || SLICES;
            stacks = stacks || STACKS;
        	for ( i=0; i<=stacks; i++ ) {
        		for ( j=0; j<=slices; j++ ) {
        			if ( i !== stacks ) {
                        indices.push( vertexIndex + slices + 1 );
                        indices.push( vertexIndex );
                        indices.push( vertexIndex + slices );
                        indices.push( vertexIndex + slices + 1 );
                        indices.push( vertexIndex + 1 );
                        indices.push( vertexIndex );
                        vertexIndex++;
        			}
        		}
        	}
            return indices;
        },

        geometry: function( slices, stacks, radius ) {
            return {
                positions: this.positions( slices, stacks, radius ),
                normals: this.normals( slices, stacks ),
                uvs: this.uvs( slices, stacks ),
                indices: this.indices( slices, stacks ),
            };
        }
    };

}());

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZXhwb3J0cy5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9NYXQzMy5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9NYXQ0NC5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9RdWF0ZXJuaW9uLmpzIiwibm9kZV9tb2R1bGVzL2FsZmFkb3Ivc3JjL1RyYW5zZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9UcmlhbmdsZS5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9WZWMyLmpzIiwibm9kZV9tb2R1bGVzL2FsZmFkb3Ivc3JjL1ZlYzMuanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvVmVjNC5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9leHBvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc2ltcGx5LWRlZmVycmVkL2RlZmVycmVkLmpzIiwic3JjL2NvcmUvQ3ViZU1hcFJlbmRlclRhcmdldC5qcyIsInNyYy9jb3JlL0luZGV4QnVmZmVyLmpzIiwic3JjL2NvcmUvUmVuZGVyVGFyZ2V0LmpzIiwic3JjL2NvcmUvU2hhZGVyLmpzIiwic3JjL2NvcmUvU2hhZGVyUGFyc2VyLmpzIiwic3JjL2NvcmUvVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvVGV4dHVyZUN1YmVNYXAuanMiLCJzcmMvY29yZS9WZXJ0ZXhCdWZmZXIuanMiLCJzcmMvY29yZS9WZXJ0ZXhQYWNrYWdlLmpzIiwic3JjL2NvcmUvVmlld3BvcnQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHQuanMiLCJzcmMvcmVuZGVyL0FuaW1hdGlvbi5qcyIsInNyYy9yZW5kZXIvQ2FtZXJhLmpzIiwic3JjL3JlbmRlci9FbnRpdHkuanMiLCJzcmMvcmVuZGVyL0dlb21ldHJ5LmpzIiwic3JjL3JlbmRlci9Kb2ludC5qcyIsInNyYy9yZW5kZXIvTWF0ZXJpYWwuanMiLCJzcmMvcmVuZGVyL01lc2guanMiLCJzcmMvcmVuZGVyL09jdHJlZS5qcyIsInNyYy9yZW5kZXIvUmVuZGVyUGFzcy5qcyIsInNyYy9yZW5kZXIvUmVuZGVyVGVjaG5pcXVlLmpzIiwic3JjL3JlbmRlci9SZW5kZXJhYmxlLmpzIiwic3JjL3JlbmRlci9SZW5kZXJlci5qcyIsInNyYy9yZW5kZXIvU2tlbGV0b24uanMiLCJzcmMvcmVuZGVyL1Nwcml0ZS5qcyIsInNyYy91dGlsL1N0YWNrLmpzIiwic3JjL3V0aWwvVXRpbC5qcyIsInNyYy91dGlsL1hIUkxvYWRlci5qcyIsInNyYy91dGlsL2RlYnVnL0RlYnVnLmpzIiwic3JjL3V0aWwvZ2x0Zi9nbFRGQW5pbWF0aW9uLmpzIiwic3JjL3V0aWwvZ2x0Zi9nbFRGTG9hZGVyLmpzIiwic3JjL3V0aWwvZ2x0Zi9nbFRGTWF0ZXJpYWwuanMiLCJzcmMvdXRpbC9nbHRmL2dsVEZNZXNoLmpzIiwic3JjL3V0aWwvZ2x0Zi9nbFRGUGFyc2VyLmpzIiwic3JjL3V0aWwvZ2x0Zi9nbFRGU2tlbGV0b24uanMiLCJzcmMvdXRpbC9nbHRmL2dsVEZVdGlsLmpzIiwic3JjL3V0aWwvb2JqL01UTExvYWRlci5qcyIsInNyYy91dGlsL29iai9PQkpMb2FkZXIuanMiLCJzcmMvdXRpbC9vYmovT0JKTVRMTG9hZGVyLmpzIiwic3JjL3V0aWwvc2hhcGVzL0N1YmUuanMiLCJzcmMvdXRpbC9zaGFwZXMvQ3lsaW5kZXIuanMiLCJzcmMvdXRpbC9zaGFwZXMvUXVhZC5qcyIsInNyYy91dGlsL3NoYXBlcy9TaGFwZVV0aWwuanMiLCJzcmMvdXRpbC9zaGFwZXMvU3BoZXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN29CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgIC8vIGNvcmVcclxuICAgICAgICBDdWJlTWFwUmVuZGVyVGFyZ2V0OiByZXF1aXJlKCcuL2NvcmUvQ3ViZU1hcFJlbmRlclRhcmdldCcpLFxyXG4gICAgICAgIFJlbmRlclRhcmdldDogcmVxdWlyZSgnLi9jb3JlL1JlbmRlclRhcmdldCcpLFxyXG4gICAgICAgIFNoYWRlcjogcmVxdWlyZSgnLi9jb3JlL1NoYWRlcicpLFxyXG4gICAgICAgIFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL1RleHR1cmUyRCcpLFxyXG4gICAgICAgIFRleHR1cmVDdWJlTWFwOiByZXF1aXJlKCcuL2NvcmUvVGV4dHVyZUN1YmVNYXAnKSxcclxuICAgICAgICBWZXJ0ZXhCdWZmZXI6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcclxuICAgICAgICBWZXJ0ZXhQYWNrYWdlOiByZXF1aXJlKCcuL2NvcmUvVmVydGV4UGFja2FnZScpLFxyXG4gICAgICAgIEluZGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvSW5kZXhCdWZmZXInKSxcclxuICAgICAgICBWaWV3cG9ydDogcmVxdWlyZSgnLi9jb3JlL1ZpZXdwb3J0JyksXHJcbiAgICAgICAgV2ViR0xDb250ZXh0OiByZXF1aXJlKCcuL2NvcmUvV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgLy8gcmVuZGVyXHJcbiAgICAgICAgQ2FtZXJhOiByZXF1aXJlKCcuL3JlbmRlci9DYW1lcmEnKSxcclxuICAgICAgICBFbnRpdHk6IHJlcXVpcmUoJy4vcmVuZGVyL0VudGl0eScpLFxyXG4gICAgICAgIEdlb21ldHJ5OiByZXF1aXJlKCcuL3JlbmRlci9HZW9tZXRyeScpLFxyXG4gICAgICAgIE1hdGVyaWFsOiByZXF1aXJlKCcuL3JlbmRlci9NYXRlcmlhbCcpLFxyXG4gICAgICAgIE1lc2g6IHJlcXVpcmUoJy4vcmVuZGVyL01lc2gnKSxcclxuICAgICAgICBKb2ludDogcmVxdWlyZSgnLi9yZW5kZXIvSm9pbnQnKSxcclxuICAgICAgICBPY3RyZWU6IHJlcXVpcmUoJy4vcmVuZGVyL09jdHJlZScpLFxyXG4gICAgICAgIFJlbmRlcmFibGU6IHJlcXVpcmUoJy4vcmVuZGVyL1JlbmRlcmFibGUnKSxcclxuICAgICAgICBSZW5kZXJlcjogcmVxdWlyZSgnLi9yZW5kZXIvUmVuZGVyZXInKSxcclxuICAgICAgICBSZW5kZXJQYXNzOiByZXF1aXJlKCcuL3JlbmRlci9SZW5kZXJQYXNzJyksXHJcbiAgICAgICAgUmVuZGVyVGVjaG5pcXVlOiByZXF1aXJlKCcuL3JlbmRlci9SZW5kZXJUZWNobmlxdWUnKSxcclxuICAgICAgICBTa2VsZXRvbjogcmVxdWlyZSgnLi9yZW5kZXIvU2tlbGV0b24nKSxcclxuICAgICAgICBTcHJpdGU6IHJlcXVpcmUoJy4vcmVuZGVyL1Nwcml0ZScpLFxyXG4gICAgICAgIC8vIHNoYXBlc1xyXG4gICAgICAgIEN1YmU6IHJlcXVpcmUoJy4vdXRpbC9zaGFwZXMvQ3ViZScpLFxyXG4gICAgICAgIEN5bGluZGVyOiByZXF1aXJlKCcuL3V0aWwvc2hhcGVzL0N5bGluZGVyJyksXHJcbiAgICAgICAgUXVhZDogcmVxdWlyZSgnLi91dGlsL3NoYXBlcy9RdWFkJyksXHJcbiAgICAgICAgU2hhcGVVdGlsOiByZXF1aXJlKCcuL3V0aWwvc2hhcGVzL1NoYXBlVXRpbCcpLFxyXG4gICAgICAgIFNwaGVyZTogcmVxdWlyZSgnLi91dGlsL3NoYXBlcy9TcGhlcmUnKSxcclxuICAgICAgICAvLyB1dGlsXHJcbiAgICAgICAgZ2xURkxvYWRlcjogcmVxdWlyZSgnLi91dGlsL2dsdGYvZ2xURkxvYWRlcicpLFxyXG4gICAgICAgIE9CSk1UTExvYWRlcjogcmVxdWlyZSgnLi91dGlsL29iai9PQkpNVExMb2FkZXInKSxcclxuICAgICAgICBVdGlsOiByZXF1aXJlKCcuL3V0aWwvVXRpbCcpLFxyXG4gICAgICAgIC8vIGRlYnVnXHJcbiAgICAgICAgRGVidWc6IHJlcXVpcmUoJy4vdXRpbC9kZWJ1Zy9EZWJ1ZycpLFxyXG4gICAgICAgIC8vIG1hdGhcclxuICAgICAgICBNYXQzMzogcmVxdWlyZSgnYWxmYWRvcicpLk1hdDMzLFxyXG4gICAgICAgIE1hdDQ0OiByZXF1aXJlKCdhbGZhZG9yJykuTWF0NDQsXHJcbiAgICAgICAgVmVjMjogcmVxdWlyZSgnYWxmYWRvcicpLlZlYzIsXHJcbiAgICAgICAgVmVjMzogcmVxdWlyZSgnYWxmYWRvcicpLlZlYzMsXHJcbiAgICAgICAgVmVjNDogcmVxdWlyZSgnYWxmYWRvcicpLlZlYzQsXHJcbiAgICAgICAgUXVhdGVybmlvbjogcmVxdWlyZSgnYWxmYWRvcicpLlF1YXRlcm5pb24sXHJcbiAgICAgICAgVHJhbnNmb3JtOiByZXF1aXJlKCdhbGZhZG9yJykuVHJhbnNmb3JtLFxyXG4gICAgICAgIFRyaWFuZ2xlOiByZXF1aXJlKCdhbGZhZG9yJykuVHJpYW5nbGVcclxuICAgIH07XHJcblxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSggJy4vVmVjMycgKSxcclxuICAgICAgICBWZWM0ID0gcmVxdWlyZSggJy4vVmVjNCcgKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIE1hdDMzIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBNYXQzM1xyXG4gICAgICogQGNsYXNzZGVzYyBBIDN4MyBjb2x1bW4tbWFqb3IgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBNYXQzMyggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhhdC5kYXRhIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoYXQuZGF0YS5sZW5ndGggPT09IDkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29weSBNYXQzMyBkYXRhIGJ5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhhdC5kYXRhLnNsaWNlKCAwICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgTWF0NDQgZGF0YSBieSB2YWx1ZSwgYWNjb3VudCBmb3IgaW5kZXggZGlmZmVyZW5jZXNcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVswXSwgdGhhdC5kYXRhWzFdLCB0aGF0LmRhdGFbMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVs0XSwgdGhhdC5kYXRhWzVdLCB0aGF0LmRhdGFbNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVs4XSwgdGhhdC5kYXRhWzldLCB0aGF0LmRhdGFbMTBdIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoYXQubGVuZ3RoID09PSA5ICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29weSBhcnJheSBieSB2YWx1ZSwgdXNlIHByb3RvdHlwZSB0byBjYXN0IGFycmF5IGJ1ZmZlcnNcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0MzMuaWRlbnRpdHkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXQzMy5pZGVudGl0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBjb2x1bW4gb2YgdGhlIG1hdHJpeCBhcyBhIFZlYzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIDAtYmFzZWQgY29sdW1uIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgY29sdW1uIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswK2luZGV4XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzMraW5kZXhdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNitpbmRleF0gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcm93IG9mIHRoZSBtYXRyaXggYXMgYSBWZWMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSAwLWJhc2VkIHJvdyBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIGNvbHVtbiB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5jb2wgPSBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMCtpbmRleCozXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEraW5kZXgqM10sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsyK2luZGV4KjNdICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaWRlbnRpdHkgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgaWRlbnRpeSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLmlkZW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQzMyhbIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHNjYWxlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheXxudW1iZXJ9IHNjYWxlIC0gVGhlIHNjYWxhciBvciB2ZWN0b3Igc2NhbGluZyBmYWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgc2NhbGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5zY2FsZSA9IGZ1bmN0aW9uKCBzY2FsZSApIHtcclxuICAgICAgICBpZiAoIHR5cGVvZiBzY2FsZSA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXQzMyhbXHJcbiAgICAgICAgICAgICAgICBzY2FsZSwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIHNjYWxlLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgc2NhbGUgXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggc2NhbGUgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXQzMyhbXHJcbiAgICAgICAgICAgICAgICBzY2FsZVswXSwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIHNjYWxlWzFdLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgc2NhbGVbMl0gXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTWF0MzMoW1xyXG4gICAgICAgICAgICBzY2FsZS54LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCBzY2FsZS55LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCBzY2FsZS56IF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggZGVmaW5lZCBieSBhbiBheGlzIGFuZCBhbiBhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIGRlZ3JlZXMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgcm90YXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5yb3RhdGlvbkRlZ3JlZXMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRpb25SYWRpYW5zKCBhbmdsZSpNYXRoLlBJLzE4MCwgYXhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggZGVmaW5lZCBieSBhbiBheGlzIGFuZCBhbiBhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIHJhZGlhbnMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgcm90YXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5yb3RhdGlvblJhZGlhbnMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgaWYgKCBheGlzIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIGF4aXMgPSBuZXcgVmVjMyggYXhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB6ZXJvIHZlY3RvciwgcmV0dXJuIGlkZW50aXR5XHJcbiAgICAgICAgaWYgKCBheGlzLmxlbmd0aFNxdWFyZWQoKSA9PT0gMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5vcm1BeGlzID0gYXhpcy5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgeCA9IG5vcm1BeGlzLngsXHJcbiAgICAgICAgICAgIHkgPSBub3JtQXhpcy55LFxyXG4gICAgICAgICAgICB6ID0gbm9ybUF4aXMueixcclxuICAgICAgICAgICAgbW9kQW5nbGUgPSAoIGFuZ2xlID4gMCApID8gYW5nbGUgJSAoMipNYXRoLlBJKSA6IGFuZ2xlICUgKC0yKk1hdGguUEkpLFxyXG4gICAgICAgICAgICBzID0gTWF0aC5zaW4oIG1vZEFuZ2xlICksXHJcbiAgICAgICAgICAgIGMgPSBNYXRoLmNvcyggbW9kQW5nbGUgKSxcclxuICAgICAgICAgICAgeHggPSB4ICogeCxcclxuICAgICAgICAgICAgeXkgPSB5ICogeSxcclxuICAgICAgICAgICAgenogPSB6ICogeixcclxuICAgICAgICAgICAgeHkgPSB4ICogeSxcclxuICAgICAgICAgICAgeXogPSB5ICogeixcclxuICAgICAgICAgICAgenggPSB6ICogeCxcclxuICAgICAgICAgICAgeHMgPSB4ICogcyxcclxuICAgICAgICAgICAgeXMgPSB5ICogcyxcclxuICAgICAgICAgICAgenMgPSB6ICogcyxcclxuICAgICAgICAgICAgb25lX2MgPSAxLjAgLSBjO1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0MzMoW1xyXG4gICAgICAgICAgICAob25lX2MgKiB4eCkgKyBjLCAob25lX2MgKiB4eSkgKyB6cywgKG9uZV9jICogengpIC0geXMsXHJcbiAgICAgICAgICAgIChvbmVfYyAqIHh5KSAtIHpzLCAob25lX2MgKiB5eSkgKyBjLCAob25lX2MgKiB5eikgKyB4cyxcclxuICAgICAgICAgICAgKG9uZV9jICogengpICsgeXMsIChvbmVfYyAqIHl6KSAtIHhzLCAob25lX2MgKiB6eikgKyBjXHJcbiAgICAgICAgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdGF0aW9uIG1hdHJpeCB0byByb3RhdGUgYSB2ZWN0b3IgZnJvbSBvbmUgZGlyZWN0aW9uIHRvXHJcbiAgICAgKiBhbm90aGVyLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBmcm9tIC0gVGhlIHN0YXJ0aW5nIGRpcmVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gdG8gLSBUaGUgZW5kaW5nIGRpcmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbi5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucm90YXRpb25Gcm9tVG8gPSBmdW5jdGlvbiggZnJvbVZlYywgdG9WZWMgKSB7XHJcbiAgICAgICAgLypCdWlsZHMgdGhlIHJvdGF0aW9uIG1hdHJpeCB0aGF0IHJvdGF0ZXMgb25lIHZlY3RvciBpbnRvIGFub3RoZXIuXHJcblxyXG4gICAgICAgIFRoZSBnZW5lcmF0ZWQgcm90YXRpb24gbWF0cml4IHdpbGwgcm90YXRlIHRoZSB2ZWN0b3IgZnJvbSBpbnRvXHJcbiAgICAgICAgdGhlIFZlY3RvcjM8dmFyPiB0by4gZnJvbSBhbmQgdG8gbXVzdCBiZSB1bml0IFZlY3RvcjM8dmFyPnMhXHJcblxyXG4gICAgICAgIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uIHRoZSBjb2RlIGZyb206XHJcblxyXG4gICAgICAgIFRvbWFzIE1sbGVyLCBKb2huIEh1Z2hlc1xyXG4gICAgICAgIEVmZmljaWVudGx5IEJ1aWxkaW5nIGEgTWF0cml4IHRvIFJvdGF0ZSBPbmUgVmVjdG9yIHRvIEFub3RoZXJcclxuICAgICAgICBKb3VybmFsIG9mIEdyYXBoaWNzIFRvb2xzLCA0KDQpOjEtNCwgMTk5OVxyXG4gICAgICAgICovXHJcbiAgICAgICAgdmFyIEVQU0lMT04gPSAwLjAwMDAwMSxcclxuICAgICAgICAgICAgZnJvbSA9IG5ldyBWZWMzKCBmcm9tVmVjICkubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIHRvID0gbmV3IFZlYzMoIHRvVmVjICkubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIGUgPSBmcm9tLmRvdCggdG8gKSxcclxuICAgICAgICAgICAgZiA9IE1hdGguYWJzKCBlICksXHJcbiAgICAgICAgICAgIHRoYXQgPSBuZXcgTWF0MzMoKSxcclxuICAgICAgICAgICAgeCwgdSwgdixcclxuICAgICAgICAgICAgZngsIGZ5LCBmeixcclxuICAgICAgICAgICAgdXgsIHV6LFxyXG4gICAgICAgICAgICBjMSwgYzIsIGMzO1xyXG4gICAgICAgIGlmICggZiA+ICggMS4wLUVQU0lMT04gKSApIHtcclxuICAgICAgICAgICAgLy8gXCJmcm9tXCIgYW5kIFwidG9cIiBhbG1vc3QgcGFyYWxsZWxcclxuICAgICAgICAgICAgLy8gbmVhcmx5IG9ydGhvZ29uYWxcclxuICAgICAgICAgICAgZnggPSBNYXRoLmFicyggZnJvbS54ICk7XHJcbiAgICAgICAgICAgIGZ5ID0gTWF0aC5hYnMoIGZyb20ueSApO1xyXG4gICAgICAgICAgICBmeiA9IE1hdGguYWJzKCBmcm9tLnogKTtcclxuICAgICAgICAgICAgaWYgKGZ4IDwgZnkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChmeDxmeikge1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSBuZXcgVmVjMyggMSwgMCwgMCApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gbmV3IFZlYzMoIDAsIDAsIDEgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChmeSA8IGZ6KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IG5ldyBWZWMzKCAwLCAxLCAwICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSBuZXcgVmVjMyggMCwgMCwgMSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHUgPSB4LnN1YiggZnJvbSApO1xyXG4gICAgICAgICAgICB2ID0geC5zdWIoIHRvICk7XHJcbiAgICAgICAgICAgIGMxID0gMi4wIC8gdS5kb3QoIHUgKTtcclxuICAgICAgICAgICAgYzIgPSAyLjAgLyB2LmRvdCggdiApO1xyXG4gICAgICAgICAgICBjMyA9IGMxKmMyICogdS5kb3QoIHYgKTtcclxuICAgICAgICAgICAgLy8gc2V0IG1hdHJpeCBlbnRyaWVzXHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVswXSA9IC0gYzEqdS54KnUueCAtIGMyKnYueCp2LnggKyBjMyp2LngqdS54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbM10gPSAtIGMxKnUueCp1LnkgLSBjMip2Lngqdi55ICsgYzMqdi54KnUueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzZdID0gLSBjMSp1LngqdS56IC0gYzIqdi54KnYueiArIGMzKnYueCp1Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVsxXSA9IC0gYzEqdS55KnUueCAtIGMyKnYueSp2LnggKyBjMyp2LnkqdS54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNF0gPSAtIGMxKnUueSp1LnkgLSBjMip2Lnkqdi55ICsgYzMqdi55KnUueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzddID0gLSBjMSp1LnkqdS56IC0gYzIqdi55KnYueiArIGMzKnYueSp1Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVsyXSA9IC0gYzEqdS56KnUueCAtIGMyKnYueip2LnggKyBjMyp2LnoqdS54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNV0gPSAtIGMxKnUueip1LnkgLSBjMip2Lnoqdi55ICsgYzMqdi56KnUueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzhdID0gLSBjMSp1LnoqdS56IC0gYzIqdi56KnYueiArIGMzKnYueip1Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVswXSArPSAxLjA7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs0XSArPSAxLjA7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs4XSArPSAxLjA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhlIG1vc3QgY29tbW9uIGNhc2UsIHVubGVzcyBcImZyb21cIj1cInRvXCIsIG9yIFwidG9cIj0tXCJmcm9tXCJcclxuICAgICAgICAgICAgdiA9IGZyb20uY3Jvc3MoIHRvICk7XHJcbiAgICAgICAgICAgIHUgPSAxLjAgLyAoIDEuMCArIGUgKTsgICAgLy8gb3B0aW1pemF0aW9uIGJ5IEdvdHRmcmllZCBDaGVuXHJcbiAgICAgICAgICAgIHV4ID0gdSAqIHYueDtcclxuICAgICAgICAgICAgdXogPSB1ICogdi56O1xyXG4gICAgICAgICAgICBjMSA9IHV4ICogdi55O1xyXG4gICAgICAgICAgICBjMiA9IHV4ICogdi56O1xyXG4gICAgICAgICAgICBjMyA9IHV6ICogdi55O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbMF0gPSBlICsgdXggKiB2Lng7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVszXSA9IGMxIC0gdi56O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNl0gPSBjMiArIHYueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzFdID0gYzEgKyB2Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs0XSA9IGUgKyB1ICogdi55ICogdi55O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbN10gPSBjMyAtIHYueDtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzJdID0gYzIgLSB2Lnk7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs1XSA9IGMzICsgdi54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbOF0gPSBlICsgdXogKiB2Lno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIG1hdHJpeCB3aXRoIHRoZSBwcm92aWRlZCBtYXRyaXggYXJndW1lbnQsIHJldHVybmluZyBhIG5ldyBNYTMzXHJcbiAgICAgKiBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgc3VtIG9mIHRoZSB0d28gbWF0cmljZXMuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDMzKCB0aGF0ICksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDk7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gKz0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnRyYWN0cyB0aGUgcHJvdmlkZWQgbWF0cml4IGFyZ3VtZW50IGZyb20gdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIG1hdHJpY2VzLlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQzMyggdGhhdCApLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTw5OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldIC0gbWF0LmRhdGFbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCB2ZWN0b3IgYXJndW1lbnQgYnkgdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBWZWMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fEFycmF5fSAtIFRoZSB2ZWN0b3IgdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgcmVzdWx0aW5nIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLm11bHRWZWN0b3IgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICAvLyBlbnN1cmUgJ3RoYXQnIGlzIGEgVmVjM1xyXG4gICAgICAgIC8vIGl0IGlzIHNhZmUgdG8gb25seSBjYXN0IGlmIEFycmF5IHNpbmNlIHRoZSAudyBvZiBhIFZlYzQgaXMgbm90IHVzZWRcclxuICAgICAgICB0aGF0ID0gKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSA/IG5ldyBWZWMzKCB0aGF0ICkgOiB0aGF0O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh7XHJcbiAgICAgICAgICAgIHg6IHRoaXMuZGF0YVswXSAqIHRoYXQueCArIHRoaXMuZGF0YVszXSAqIHRoYXQueSArIHRoaXMuZGF0YVs2XSAqIHRoYXQueixcclxuICAgICAgICAgICAgeTogdGhpcy5kYXRhWzFdICogdGhhdC54ICsgdGhpcy5kYXRhWzRdICogdGhhdC55ICsgdGhpcy5kYXRhWzddICogdGhhdC56LFxyXG4gICAgICAgICAgICB6OiB0aGlzLmRhdGFbMl0gKiB0aGF0LnggKyB0aGlzLmRhdGFbNV0gKiB0aGF0LnkgKyB0aGlzLmRhdGFbOF0gKiB0aGF0LnpcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIGFsbCBjb21wb25lbnRzIG9mIHRoZSBtYXRyaXggYnkgdGhlIHByb3ZkZWQgc2NhbGFyIGFyZ3VtZW50LFxyXG4gICAgICogcmV0dXJuaW5nIGEgbmV3IE1hdDMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIG1hdHJpeCBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSByZXN1bHRpbmcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUubXVsdFNjYWxhciA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0MzMoKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8OTsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCBtYXRyaXggYXJndW1lbnQgYnkgdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fSAtIFRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5tdWx0TWF0cml4ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQzMygpLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGVuc3VyZSAndGhhdCcgaXMgYSBNYXQzM1xyXG4gICAgICAgIC8vIG11c3QgY2hlY2sgaWYgQXJyYXkgb3IgTWF0MzNcclxuICAgICAgICBpZiAoICggdGhhdC5kYXRhICYmIHRoYXQuZGF0YS5sZW5ndGggPT09IDE2ICkgfHxcclxuICAgICAgICAgICAgdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICB0aGF0ID0gbmV3IE1hdDMzKCB0aGF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTwzOyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldICogdGhhdC5kYXRhWzBdICsgdGhpcy5kYXRhW2krM10gKiB0aGF0LmRhdGFbMV0gKyB0aGlzLmRhdGFbaSs2XSAqIHRoYXQuZGF0YVsyXTtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaSszXSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQuZGF0YVszXSArIHRoaXMuZGF0YVtpKzNdICogdGhhdC5kYXRhWzRdICsgdGhpcy5kYXRhW2krNl0gKiB0aGF0LmRhdGFbNV07XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2krNl0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbNl0gKyB0aGlzLmRhdGFbaSszXSAqIHRoYXQuZGF0YVs3XSArIHRoaXMuZGF0YVtpKzZdICogdGhhdC5kYXRhWzhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHByb3ZkZWQgYXJndW1lbnQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fE1hdDMzfE1hdDQ0fEFycmF5fG51bWJlcn0gLSBUaGUgYXJndW1lbnQgdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM3xWZWMzfSBUaGUgcmVzdWx0aW5nIHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhhdCA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgLy8gc2NhbGFyXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRTY2FsYXIoIHRoYXQgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIC8vIGFycmF5XHJcbiAgICAgICAgICAgIGlmICggdGhhdC5sZW5ndGggPT09IDMgfHwgdGhhdC5sZW5ndGggPT09IDQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yKCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0TWF0cml4KCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdmVjdG9yXHJcbiAgICAgICAgaWYgKCB0aGF0LnggIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGF0LnkgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGF0LnogIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvciggdGhhdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtYXRyaXhcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0TWF0cml4KCB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlcyBhbGwgY29tcG9uZW50cyBvZiB0aGUgbWF0cml4IGJ5IHRoZSBwcm92ZGVkIHNjYWxhciBhcmd1bWVudCxcclxuICAgICAqIHJldHVybmluZyBhIG5ldyBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIGRpdmlkZSB0aGUgbWF0cml4IGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDMzKCksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDk7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gPSB0aGlzLmRhdGFbaV0gLyB0aGF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYWxsIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCBtYXRyaXguXHJcbiAgICAgKiBBbiBvcHRpb25hbCBlcHNpbG9uIHZhbHVlIG1heSBiZSBwcm92aWRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TWF0MzN8QXJyYXl9IHRoYXQgLSBUaGUgbWF0cml4IHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgbWF0cml4IGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiggdGhhdCwgZXBzaWxvbiApIHtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBlcHNpbG9uID0gZXBzaWxvbiA9PT0gdW5kZWZpbmVkID8gMCA6IGVwc2lsb247XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDk7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gYXdrd2FyZCBjb21wYXJpc29uIGxvZ2ljIGlzIHJlcXVpcmVkIHRvIGVuc3VyZSBlcXVhbGl0eSBwYXNzZXMgaWZcclxuICAgICAgICAgICAgLy8gY29ycmVzcG9uZGluZyBhcmUgYm90aCB1bmRlZmluZWQsIE5hTiwgb3IgSW5maW5pdHlcclxuICAgICAgICAgICAgaWYgKCAhKFxyXG4gICAgICAgICAgICAgICAgKCB0aGlzLmRhdGFbaV0gPT09IHRoYXQuZGF0YVtpXSApIHx8XHJcbiAgICAgICAgICAgICAgICAoIE1hdGguYWJzKCB0aGlzLmRhdGFbaV0gLSB0aGF0LmRhdGFbaV0gKSA8PSBlcHNpbG9uIClcclxuICAgICAgICAgICAgICAgKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc3Bvc2Ugb2YgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHRyYW5zcG9zZWQgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRyYW5zID0gbmV3IE1hdDMzKCksIGk7XHJcbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCAzOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbaSozXSAgICAgPSB0aGlzLmRhdGFbaV07XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbKGkqMykrMV0gPSB0aGlzLmRhdGFbaSszXTtcclxuICAgICAgICAgICAgdHJhbnMuZGF0YVsoaSozKSsyXSA9IHRoaXMuZGF0YVtpKzZdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJhbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgaW52ZXJ0ZWQgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbnYgPSBuZXcgTWF0MzMoKSwgZGV0O1xyXG4gICAgICAgIC8vIGNvbXB1dGUgaW52ZXJzZVxyXG4gICAgICAgIC8vIHJvdyAxXHJcbiAgICAgICAgaW52LmRhdGFbMF0gPSB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzhdIC0gdGhpcy5kYXRhWzddKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICBpbnYuZGF0YVszXSA9IC10aGlzLmRhdGFbM10qdGhpcy5kYXRhWzhdICsgdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICBpbnYuZGF0YVs2XSA9IHRoaXMuZGF0YVszXSp0aGlzLmRhdGFbN10gLSB0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzRdO1xyXG4gICAgICAgIC8vIHJvdyAyXHJcbiAgICAgICAgaW52LmRhdGFbMV0gPSAtdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs4XSArIHRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMl07XHJcbiAgICAgICAgaW52LmRhdGFbNF0gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzhdIC0gdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsyXTtcclxuICAgICAgICBpbnYuZGF0YVs3XSA9IC10aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzddICsgdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxXTtcclxuICAgICAgICAvLyByb3cgM1xyXG4gICAgICAgIGludi5kYXRhWzJdID0gdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs1XSAtIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMl07XHJcbiAgICAgICAgaW52LmRhdGFbNV0gPSAtdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs1XSArIHRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMl07XHJcbiAgICAgICAgaW52LmRhdGFbOF0gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzRdIC0gdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxXTtcclxuICAgICAgICAvLyBjYWxjdWxhdGUgZGV0ZXJtaW5hbnRcclxuICAgICAgICBkZXQgPSB0aGlzLmRhdGFbMF0qaW52LmRhdGFbMF0gKyB0aGlzLmRhdGFbMV0qaW52LmRhdGFbM10gKyB0aGlzLmRhdGFbMl0qaW52LmRhdGFbNl07XHJcbiAgICAgICAgLy8gcmV0dXJuXHJcbiAgICAgICAgcmV0dXJuIGludi5tdWx0KCAxIC8gZGV0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVjb21wb3NlcyB0aGUgbWF0cml4IGludG8gdGhlIGNvcnJlc3BvbmRpbmcgeCwgeSwgYW5kIHogYXhlcywgYWxvbmcgd2l0aFxyXG4gICAgICogYSBzY2FsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkZWNvbXBvc2VkIGNvbXBvbmVudHMgb2YgdGhlIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLmRlY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjb2wwID0gdGhpcy5jb2woIDAgKSxcclxuICAgICAgICAgICAgY29sMSA9IHRoaXMuY29sKCAxICksXHJcbiAgICAgICAgICAgIGNvbDIgPSB0aGlzLmNvbCggMiApO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxlZnQ6IGNvbDAubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIHVwOiBjb2wxLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBmb3J3YXJkOiBjb2wyLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBzY2FsZTogbmV3IFZlYzMoIGNvbDAubGVuZ3RoKCksIGNvbDEubGVuZ3RoKCksIGNvbDIubGVuZ3RoKCkgKVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJhbmRvbSB0cmFuc2Zvcm0gbWF0cml4IGNvbXBvc2VkIG9mIGEgcm90YXRpb24gYW5kIHNjYWxlLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBBIHJhbmRvbSB0cmFuc2Zvcm0gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcm90ID0gTWF0MzMucm90YXRpb25SYWRpYW5zKCBNYXRoLnJhbmRvbSgpICogMzYwLCBWZWMzLnJhbmRvbSgpICksXHJcbiAgICAgICAgICAgIHNjYWxlID0gTWF0MzMuc2NhbGUoIE1hdGgucmFuZG9tKCkgKiAxMCApO1xyXG4gICAgICAgIHJldHVybiByb3QubXVsdCggc2NhbGUgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF0gK1wiLCBcIisgdGhpcy5kYXRhWzNdICtcIiwgXCIrIHRoaXMuZGF0YVs2XSArXCIsXFxuXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMV0gK1wiLCBcIisgdGhpcy5kYXRhWzRdICtcIiwgXCIrIHRoaXMuZGF0YVs3XSArXCIsXFxuXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMl0gK1wiLCBcIisgdGhpcy5kYXRhWzVdICtcIiwgXCIrIHRoaXMuZGF0YVs4XTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBtYXRyaXggYXMgYW4gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZSggMCApO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hdDMzO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSggJy4vVmVjMycgKSxcclxuICAgICAgICBWZWM0ID0gcmVxdWlyZSggJy4vVmVjNCcgKSxcclxuICAgICAgICBNYXQzMyA9IHJlcXVpcmUoICcuL01hdDMzJyApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgTWF0NDQgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIE1hdDQ0XHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgNHg0IGNvbHVtbi1tYWpvciBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIE1hdDQ0KCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCApIHtcclxuICAgICAgICAgICAgaWYgKCB0aGF0LmRhdGEgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggdGhhdC5kYXRhLmxlbmd0aCA9PT0gMTYgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29weSBNYXQ0NCBkYXRhIGJ5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhhdC5kYXRhLnNsaWNlKCAwICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgTWF0MzMgZGF0YSBieSB2YWx1ZSwgYWNjb3VudCBmb3IgaW5kZXggZGlmZmVyZW5jZXNcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVswXSwgdGhhdC5kYXRhWzFdLCB0aGF0LmRhdGFbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVszXSwgdGhhdC5kYXRhWzRdLCB0aGF0LmRhdGFbNV0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVs2XSwgdGhhdC5kYXRhWzddLCB0aGF0LmRhdGFbOF0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDEgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhhdC5sZW5ndGggPT09IDE2ICkge1xyXG4gICAgICAgICAgICAgICAgIC8vIGNvcHkgYXJyYXkgYnkgdmFsdWUsIHVzZSBwcm90b3R5cGUgdG8gY2FzdCBhcnJheSBidWZmZXJzXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggdGhhdCApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgY29sdW1uIG9mIHRoZSBtYXRyaXggYXMgYSBWZWM0IG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSAwLWJhc2VkIGNvbHVtbiBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIGNvbHVtbiB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMCtpbmRleF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0K2luZGV4XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzgraW5kZXhdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTIraW5kZXhdICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdyBvZiB0aGUgbWF0cml4IGFzIGEgVmVjNCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgMC1iYXNlZCByb3cgaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBjb2x1bW4gdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuY29sID0gZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzAraW5kZXgqNF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxK2luZGV4KjRdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMitpbmRleCo0XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzMraW5kZXgqNF0gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpZGVudGl0eSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpZGVudGl5IG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQuaWRlbnRpdHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc2NhbGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fG51bWJlcn0gc2NhbGUgLSBUaGUgc2NhbGFyIG9yIHZlY3RvciBzY2FsaW5nIGZhY3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBzY2FsZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnNjYWxlID0gZnVuY3Rpb24oIHNjYWxlICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHNjYWxlID09PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgICAgIHNjYWxlLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgc2NhbGUsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCBzY2FsZSwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIDAsIDEgXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggc2NhbGUgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgICAgICBzY2FsZVswXSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIHNjYWxlWzFdLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgc2NhbGVbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAwLCAxIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgc2NhbGUueCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgc2NhbGUueSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgc2NhbGUueiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSB0cmFuc2xhdGlvbiAtIFRoZSB0cmFuc2xhdGlvbiB2ZWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC50cmFuc2xhdGlvbiA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbiApIHtcclxuICAgICAgICBpZiAoIHRyYW5zbGF0aW9uIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0NDQoW1xyXG4gICAgICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRpb25bMF0sIHRyYW5zbGF0aW9uWzFdLCB0cmFuc2xhdGlvblsyXSwgMSBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uLngsIHRyYW5zbGF0aW9uLnksIHRyYW5zbGF0aW9uLnosIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdGF0aW9uIG1hdHJpeCBkZWZpbmVkIGJ5IGFuIGF4aXMgYW5kIGFuIGFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gZGVncmVlcy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnJvdGF0aW9uRGVncmVlcyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KCBNYXQzMy5yb3RhdGlvbkRlZ3JlZXMoIGFuZ2xlLCBheGlzICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcm90YXRpb24gbWF0cml4IGRlZmluZWQgYnkgYW4gYXhpcyBhbmQgYW4gYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiByYWRpYW5zLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucm90YXRpb25SYWRpYW5zID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoIE1hdDMzLnJvdGF0aW9uUmFkaWFucyggYW5nbGUsIGF4aXMgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggdG8gcm90YXRlIGEgdmVjdG9yIGZyb20gb25lIGRpcmVjdGlvbiB0b1xyXG4gICAgICogYW5vdGhlci5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM30gZnJvbSAtIFRoZSBzdGFydGluZyBkaXJlY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRvIC0gVGhlIGVuZGluZyBkaXJlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24uXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnJvdGF0aW9uRnJvbVRvID0gZnVuY3Rpb24oIGZyb21WZWMsIHRvVmVjICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoIE1hdDMzLnJvdGF0aW9uRnJvbVRvKCBmcm9tVmVjLCB0b1ZlYyApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgbWF0cml4IHdpdGggdGhlIHByb3ZpZGVkIG1hdHJpeCBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IE1hMzNcclxuICAgICAqIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TWF0MzN8TWF0NDR8QXJyYXl9IHRoYXQgLSBUaGUgbWF0cml4IHRvIGFkZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBzdW0gb2YgdGhlIHR3byBtYXRyaWNlcy5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0NDQoIHRoYXQgKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8MTY7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gKz0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnRyYWN0cyB0aGUgcHJvdmlkZWQgbWF0cml4IGFyZ3VtZW50IGZyb20gdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQ0NCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIG1hdHJpY2VzLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCggdGhhdCApLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTwxNjsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAtIG1hdC5kYXRhW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHByb3ZkZWQgdmVjdG9yIGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXgsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogVmVjMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHJlc3VsdGluZyB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5tdWx0VmVjdG9yMyA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIC8vIGVuc3VyZSAndGhhdCcgaXMgYSBWZWMzXHJcbiAgICAgICAgLy8gaXQgaXMgc2FmZSB0byBvbmx5IGNhc3QgaWYgQXJyYXkgc2luY2UgVmVjNCBoYXMgb3duIG1ldGhvZFxyXG4gICAgICAgIHRoYXQgPSAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApID8gbmV3IFZlYzMoIHRoYXQgKSA6IHRoYXQ7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHtcclxuICAgICAgICAgICAgeDogdGhpcy5kYXRhWzBdICogdGhhdC54ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs0XSAqIHRoYXQueSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbOF0gKiB0aGF0LnogKyB0aGlzLmRhdGFbMTJdLFxyXG4gICAgICAgICAgICB5OiB0aGlzLmRhdGFbMV0gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzVdICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs5XSAqIHRoYXQueiArIHRoaXMuZGF0YVsxM10sXHJcbiAgICAgICAgICAgIHo6IHRoaXMuZGF0YVsyXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNl0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzEwXSAqIHRoYXQueiArIHRoaXMuZGF0YVsxNF1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSBwcm92ZGVkIHZlY3RvciBhcmd1bWVudCBieSB0aGUgbWF0cml4LCByZXR1cm5pbmcgYSBuZXdcclxuICAgICAqIFZlYzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIHZlY3RvciB0byBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBtYXRyaXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSByZXN1bHRpbmcgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUubXVsdFZlY3RvcjQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICAvLyBlbnN1cmUgJ3RoYXQnIGlzIGEgVmVjNFxyXG4gICAgICAgIC8vIGl0IGlzIHNhZmUgdG8gb25seSBjYXN0IGlmIEFycmF5IHNpbmNlIFZlYzMgaGFzIG93biBtZXRob2RcclxuICAgICAgICB0aGF0ID0gKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSA/IG5ldyBWZWM0KCB0aGF0ICkgOiB0aGF0O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNCh7XHJcbiAgICAgICAgICAgIHg6IHRoaXMuZGF0YVswXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNF0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzhdICogdGhhdC56ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0gKiB0aGF0LncsXHJcbiAgICAgICAgICAgIHk6IHRoaXMuZGF0YVsxXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNV0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzldICogdGhhdC56ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxM10gKiB0aGF0LncsXHJcbiAgICAgICAgICAgIHo6IHRoaXMuZGF0YVsyXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNl0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzEwXSAqIHRoYXQueiArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbMTRdICogdGhhdC53LFxyXG4gICAgICAgICAgICB3OiB0aGlzLmRhdGFbM10gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzddICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxMV0gKiB0aGF0LnogK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzE1XSAqIHRoYXQud1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgYWxsIGNvbXBvbmVudHMgb2YgdGhlIG1hdHJpeCBieSB0aGUgcHJvdmRlZCBzY2FsYXIgYXJndW1lbnQsXHJcbiAgICAgKiByZXR1cm5pbmcgYSBuZXcgTWF0NDQgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBtdWx0aXBseSB0aGUgbWF0cml4IGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5tdWx0U2NhbGFyID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTwxNjsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCBtYXRyaXggYXJndW1lbnQgYnkgdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQ0NCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSAtIFRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5tdWx0TWF0cml4ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGVuc3VyZSAndGhhdCcgaXMgYSBNYXQ0NFxyXG4gICAgICAgIC8vIG11c3QgY2hlY2sgaWYgQXJyYXkgb3IgTWF0NDRcclxuICAgICAgICBpZiAoICggdGhhdC5kYXRhICYmIHRoYXQuZGF0YS5sZW5ndGggPT09IDkgKSB8fFxyXG4gICAgICAgICAgICB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoYXQgPSBuZXcgTWF0NDQoIHRoYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDQ7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbMF0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krNF0gKiB0aGF0LmRhdGFbMV0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krOF0gKiB0aGF0LmRhdGFbMl0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krMTJdICogdGhhdC5kYXRhWzNdO1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpKzRdID0gdGhpcy5kYXRhW2ldICogdGhhdC5kYXRhWzRdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzRdICogdGhhdC5kYXRhWzVdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzhdICogdGhhdC5kYXRhWzZdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzEyXSAqIHRoYXQuZGF0YVs3XTtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaSs4XSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQuZGF0YVs4XSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs0XSAqIHRoYXQuZGF0YVs5XSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs4XSAqIHRoYXQuZGF0YVsxMF0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krMTJdICogdGhhdC5kYXRhWzExXTtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaSsxMl0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbMTJdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzRdICogdGhhdC5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs4XSAqIHRoYXQuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krMTJdICogdGhhdC5kYXRhWzE1XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSBwcm92ZGVkIGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxNYXQzM3xNYXQ0NHxBcnJheXxudW1iZXJ9IC0gVGhlIGFyZ3VtZW50IHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR8VmVjNH0gVGhlIHJlc3VsdGluZyBwcm9kdWN0LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHRoYXQgPT09IFwibnVtYmVyXCIgKSB7XHJcbiAgICAgICAgICAgIC8vIHNjYWxhclxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0U2NhbGFyKCB0aGF0ICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBhcnJheVxyXG4gICAgICAgICAgICBpZiAoIHRoYXQubGVuZ3RoID09PSAzICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvcjMoIHRoYXQgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhhdC5sZW5ndGggPT09IDQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yNCggdGhhdCApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdE1hdHJpeCggdGhhdCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHZlY3RvclxyXG4gICAgICAgIGlmICggdGhhdC54ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhhdC55ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhhdC56ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhhdC53ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2ZWM0XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yNCggdGhhdCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vdmVjM1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yMyggdGhhdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtYXRyaXhcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0TWF0cml4KCB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlcyBhbGwgY29tcG9uZW50cyBvZiB0aGUgbWF0cml4IGJ5IHRoZSBwcm92ZGVkIHNjYWxhciBhcmd1bWVudCxcclxuICAgICAqIHJldHVybmluZyBhIG5ldyBNYXQ0NCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIGRpdmlkZSB0aGUgbWF0cml4IGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDQ0KCksIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDE2OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldIC8gdGhhdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGFsbCBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgbWF0cml4LlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byB0ZXN0IGVxdWFsaXR5IHdpdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZXBzaWxvbiAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIG1hdHJpeCBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTwxNjsgaSsrICkge1xyXG4gICAgICAgICAgICAvLyBhd2t3YXJkIGNvbXBhcmlzb24gbG9naWMgaXMgcmVxdWlyZWQgdG8gZW5zdXJlIGVxdWFsaXR5IHBhc3NlcyBpZlxyXG4gICAgICAgICAgICAvLyBjb3JyZXNwb25kaW5nIGFyZSBib3RoIHVuZGVmaW5lZCwgTmFOLCBvciBJbmZpbml0eVxyXG4gICAgICAgICAgICBpZiAoICEoXHJcbiAgICAgICAgICAgICAgICAoIHRoaXMuZGF0YVtpXSA9PT0gdGhhdC5kYXRhW2ldICkgfHxcclxuICAgICAgICAgICAgICAgICggTWF0aC5hYnMoIHRoaXMuZGF0YVtpXSAtIHRoYXQuZGF0YVtpXSApIDw9IGVwc2lsb24gKVxyXG4gICAgICAgICAgICAgICApICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gb3Rocm9ncmFwaGljIHByb2plY3Rpb24gbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4TWluIC0gVGhlIG1pbmltdW0geCBleHRlbnQgb2YgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geE1heCAtIFRoZSBtYXhpbXVtIHggZXh0ZW50IG9mIHRoZSBwcm9qZWN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhNaW4gLSBUaGUgbWluaW11bSB5IGV4dGVudCBvZiB0aGUgcHJvamVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4TWF4IC0gVGhlIG1heGltdW0geSBleHRlbnQgb2YgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geE1pbiAtIFRoZSBtaW5pbXVtIHogZXh0ZW50IG9mIHRoZSBwcm9qZWN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhNaW4gLSBUaGUgbWF4aW11bSB6IGV4dGVudCBvZiB0aGUgcHJvamVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBvcnRob2dyYXBoaWMgcHJvamVjdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0Lm9ydGhvID0gZnVuY3Rpb24oIHhNaW4sIHhNYXgsIHlNaW4sIHlNYXgsIHpNaW4sIHpNYXggKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgbWF0LmRhdGFbMF0gPSAyIC8gKHhNYXggLSB4TWluKTtcclxuICAgICAgICBtYXQuZGF0YVs1XSA9IDIgLyAoeU1heCAtIHlNaW4pO1xyXG4gICAgICAgIG1hdC5kYXRhWzEwXSA9IC0yIC8gKHpNYXggLSB6TWluKTtcclxuICAgICAgICBtYXQuZGF0YVsxMl0gPSAtKCh4TWF4ICsgeE1pbikvKHhNYXggLSB4TWluKSk7XHJcbiAgICAgICAgbWF0LmRhdGFbMTNdID0gLSgoeU1heCArIHlNaW4pLyh5TWF4IC0geU1pbikpO1xyXG4gICAgICAgIG1hdC5kYXRhWzE0XSA9IC0oKHpNYXggKyB6TWluKS8oek1heCAtIHpNaW4pKTtcclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZm92IC0gVGhlIGZpZWxkIG9mIHZpZXcuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IC0gVGhlIGFzcGVjdCByYXRpby5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6TWluIC0gVGhlIG1pbmltdW0geSBleHRlbnQgb2YgdGhlIGZydXN0dW0uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gek1heCAtIFRoZSBtYXhpbXVtIHkgZXh0ZW50IG9mIHRoZSBmcnVzdHVtLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCBmb3YsIGFzcGVjdCwgek1pbiwgek1heCApIHtcclxuICAgICAgICB2YXIgeU1heCA9IHpNaW4gKiBNYXRoLnRhbiggZm92ICogKCBNYXRoLlBJIC8gMzYwLjAgKSApLFxyXG4gICAgICAgICAgICB5TWluID0gLXlNYXgsXHJcbiAgICAgICAgICAgIHhNaW4gPSB5TWluICogYXNwZWN0LFxyXG4gICAgICAgICAgICB4TWF4ID0gLXhNaW4sXHJcbiAgICAgICAgICAgIG1hdCA9IE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgbWF0LmRhdGFbMF0gPSAoMiAqIHpNaW4pIC8gKHhNYXggLSB4TWluKTtcclxuICAgICAgICBtYXQuZGF0YVs1XSA9ICgyICogek1pbikgLyAoeU1heCAtIHlNaW4pO1xyXG4gICAgICAgIG1hdC5kYXRhWzhdID0gKHhNYXggKyB4TWluKSAvICh4TWF4IC0geE1pbik7XHJcbiAgICAgICAgbWF0LmRhdGFbOV0gPSAoeU1heCArIHlNaW4pIC8gKHlNYXggLSB5TWluKTtcclxuICAgICAgICBtYXQuZGF0YVsxMF0gPSAtKCh6TWF4ICsgek1pbikgLyAoek1heCAtIHpNaW4pKTtcclxuICAgICAgICBtYXQuZGF0YVsxMV0gPSAtMTtcclxuICAgICAgICBtYXQuZGF0YVsxNF0gPSAtKCAoIDIgKiAoek1heCp6TWluKSApLyh6TWF4IC0gek1pbikpO1xyXG4gICAgICAgIG1hdC5kYXRhWzE1XSA9IDA7XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc3Bvc2Ugb2YgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHRyYW5zcG9zZWQgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRyYW5zID0gbmV3IE1hdDQ0KCksIGk7XHJcbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCA0OyBpKysgKSB7XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbaSo0XSA9IHRoaXMuZGF0YVtpXTtcclxuICAgICAgICAgICAgdHJhbnMuZGF0YVsoaSo0KSsxXSA9IHRoaXMuZGF0YVtpKzRdO1xyXG4gICAgICAgICAgICB0cmFucy5kYXRhWyhpKjQpKzJdID0gdGhpcy5kYXRhW2krOF07XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbKGkqNCkrM10gPSB0aGlzLmRhdGFbaSsxMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cmFucztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpbnZlcnRlZCBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGludiA9IG5ldyBNYXQ0NCgpLCBkZXQ7XHJcbiAgICAgICAgLy8gY29tcHV0ZSBpbnZlcnNlXHJcbiAgICAgICAgLy8gcm93IDFcclxuICAgICAgICBpbnYuZGF0YVswXSA9IHRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTBdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzExXSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzldKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzldKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEzXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzExXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxM10qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxMF07XHJcbiAgICAgICAgaW52LmRhdGFbNF0gPSAtdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxMF0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMTFdKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTFdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzEwXTtcclxuICAgICAgICBpbnYuZGF0YVs4XSA9IHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMTFdKnRoaXMuZGF0YVsxM10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxM10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTFdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzldO1xyXG4gICAgICAgIGludi5kYXRhWzEyXSA9IC10aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzldKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzEwXSp0aGlzLmRhdGFbMTNdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTNdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzEwXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVs5XTtcclxuICAgICAgICAvLyByb3cgMlxyXG4gICAgICAgIGludi5kYXRhWzFdID0gLXRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTBdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzExXSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzldKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzldKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEzXSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzExXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxM10qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxMF07XHJcbiAgICAgICAgaW52LmRhdGFbNV0gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzEwXSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVsxMV0qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxMV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTBdO1xyXG4gICAgICAgIGludi5kYXRhWzldID0gLXRoaXMuZGF0YVswXSp0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbMTFdKnRoaXMuZGF0YVsxM10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxM10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTFdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzldO1xyXG4gICAgICAgIGludi5kYXRhWzEzXSA9IHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbMTBdKnRoaXMuZGF0YVsxM10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxM10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTBdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzldO1xyXG4gICAgICAgIC8vIHJvdyAzXHJcbiAgICAgICAgaW52LmRhdGFbMl0gPSB0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTNdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbN10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTNdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbNl07XHJcbiAgICAgICAgaW52LmRhdGFbNl0gPSAtdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzddICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzZdO1xyXG4gICAgICAgIGludi5kYXRhWzEwXSA9IHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzEzXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs3XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICBpbnYuZGF0YVsxNF0gPSAtdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTNdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTNdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzZdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzVdO1xyXG4gICAgICAgIC8vIHJvdyA0XHJcbiAgICAgICAgaW52LmRhdGFbM10gPSAtdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTFdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTBdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTFdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTBdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzldKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbN10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs2XTtcclxuICAgICAgICBpbnYuZGF0YVs3XSA9IHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzExXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzEwXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzExXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzEwXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzddIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbNl07XHJcbiAgICAgICAgaW52LmRhdGFbMTFdID0gLXRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzExXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzldICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTFdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbOV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs3XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzVdO1xyXG4gICAgICAgIGludi5kYXRhWzE1XSA9IHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzEwXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzldIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTBdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbOV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs2XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzVdO1xyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBkZXRlcm1pbmFudFxyXG4gICAgICAgIGRldCA9IHRoaXMuZGF0YVswXSppbnYuZGF0YVswXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxXSppbnYuZGF0YVs0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsyXSppbnYuZGF0YVs4XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVszXSppbnYuZGF0YVsxMl07XHJcbiAgICAgICAgcmV0dXJuIGludi5tdWx0KCAxIC8gZGV0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVjb21wb3NlcyB0aGUgbWF0cml4IGludG8gdGhlIGNvcnJlc3BvbmRpbmcgeCwgeSwgYW5kIHogYXhlcywgYWxvbmcgd2l0aFxyXG4gICAgICogYSBzY2FsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkZWNvbXBvc2VkIGNvbXBvbmVudHMgb2YgdGhlIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLmRlY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGV4dHJhY3QgdHJhbnNmb3JtIGNvbXBvbmVudHNcclxuICAgICAgICB2YXIgY29sMCA9IG5ldyBWZWMzKCB0aGlzLmNvbCggMCApICksXHJcbiAgICAgICAgICAgIGNvbDEgPSBuZXcgVmVjMyggdGhpcy5jb2woIDEgKSApLFxyXG4gICAgICAgICAgICBjb2wyID0gbmV3IFZlYzMoIHRoaXMuY29sKCAyICkgKSxcclxuICAgICAgICAgICAgY29sMyA9IG5ldyBWZWMzKCB0aGlzLmNvbCggMyApICk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbGVmdDogY29sMC5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgdXA6IGNvbDEubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIGZvcndhcmQ6IGNvbDIubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIG9yaWdpbjogY29sMyxcclxuICAgICAgICAgICAgc2NhbGU6IG5ldyBWZWMzKCBjb2wwLmxlbmd0aCgpLCBjb2wxLmxlbmd0aCgpLCBjb2wyLmxlbmd0aCgpIClcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByYW5kb20gdHJhbnNmb3JtIG1hdHJpeCBjb21wb3NlZCBvZiBhIHJvdGF0aW9uIGFuZCBzY2FsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gQSByYW5kb20gdHJhbnNmb3JtIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJvdCA9IE1hdDQ0LnJvdGF0aW9uUmFkaWFucyggTWF0aC5yYW5kb20oKSAqIDM2MCwgVmVjMy5yYW5kb20oKSApLFxyXG4gICAgICAgICAgICBzY2FsZSA9IE1hdDQ0LnNjYWxlKCBNYXRoLnJhbmRvbSgpICogMTAgKSxcclxuICAgICAgICAgICAgdHJhbnNsYXRpb24gPSBNYXQ0NC50cmFuc2xhdGlvbiggVmVjMy5yYW5kb20oKSApO1xyXG4gICAgICAgIHJldHVybiB0cmFuc2xhdGlvbi5tdWx0KCByb3QubXVsdCggc2NhbGUgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVswXSArXCIsIFwiKyB0aGlzLmRhdGFbNF0gK1wiLCBcIisgdGhpcy5kYXRhWzhdICtcIiwgXCIrIHRoaXMuZGF0YVsxMl0gK1wiLFxcblwiICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzFdICtcIiwgXCIrIHRoaXMuZGF0YVs1XSArXCIsIFwiKyB0aGlzLmRhdGFbOV0gK1wiLCBcIisgdGhpcy5kYXRhWzEzXSArXCIsXFxuXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMl0gK1wiLCBcIisgdGhpcy5kYXRhWzZdICtcIiwgXCIrIHRoaXMuZGF0YVsxMF0gK1wiLCBcIisgdGhpcy5kYXRhWzE0XSArXCIsXFxuXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbM10gK1wiLCBcIisgdGhpcy5kYXRhWzddICtcIiwgXCIrIHRoaXMuZGF0YVsxMV0gK1wiLCBcIisgdGhpcy5kYXRhWzE1XTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBtYXRyaXggYXMgYW4gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZSggMCApO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hdDQ0O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSgnLi9WZWMzJyksXHJcbiAgICAgICAgTWF0MzMgPSByZXF1aXJlKCcuL01hdDMzJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBRdWF0ZXJuaW9uIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBRdWF0ZXJuaW9uXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgYW4gb3JpZW50YXRpb24uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFF1YXRlcm5pb24oKSB7XHJcbiAgICAgICAgc3dpdGNoICggYXJndW1lbnRzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgLy8gYXJyYXkgb3IgUXVhdGVybmlvbiBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCBhcmd1bWVudC53ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnQudztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGFyZ3VtZW50WzBdICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRbMF07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudyA9IDEuMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50LnggfHwgYXJndW1lbnRbMV0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnQueSB8fCBhcmd1bWVudFsyXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudC56IHx8IGFyZ3VtZW50WzNdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGNvbXBvbmVudCBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy53ID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBxdWF0ZXJuaW9uIHRoYXQgcmVwcmVzZW50cyBhbiBvcmVpbnRhdGlvbiBtYXRjaGluZ1xyXG4gICAgICogdGhlIGlkZW50aXR5IG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBpZGVudGl0eSBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLmlkZW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKCAxLCAwLCAwLCAwICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBRdWF0ZXJuaW9uIHdpdGggZWFjaCBjb21wb25lbnQgbmVnYXRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBuZWdhdGVkIHF1YXRlcm5pb24uXHJcbiAgICAgKi9cclxuICAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oIC10aGlzLncsIC10aGlzLngsIC10aGlzLnksIC10aGlzLnogKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25jYXRlbmF0ZXMgdGhlIHJvdGF0aW9ucyBvZiB0aGUgdHdvIHF1YXRlcm5pb25zLCByZXR1cm5pbmdcclxuICAgICAqIGEgbmV3IFF1YXRlcm5pb24gb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1F1YXRlcm5pb258QXJyYXl9IHRoYXQgLSBUaGUgcXVhdGVyaW9uIHRvIGNvbmNhdGVuYXRlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgcmVzdWx0aW5nIGNvbmNhdGVuYXRlZCBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdGhhdCA9ICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkgPyBuZXcgUXVhdGVybmlvbiggdGhhdCApIDogdGhhdDtcclxuICAgICAgICB2YXIgdyA9ICh0aGF0LncgKiB0aGlzLncpIC0gKHRoYXQueCAqIHRoaXMueCkgLSAodGhhdC55ICogdGhpcy55KSAtICh0aGF0LnogKiB0aGlzLnopLFxyXG4gICAgICAgICAgICB4ID0gdGhpcy55KnRoYXQueiAtIHRoaXMueip0aGF0LnkgKyB0aGlzLncqdGhhdC54ICsgdGhpcy54KnRoYXQudyxcclxuICAgICAgICAgICAgeSA9IHRoaXMueip0aGF0LnggLSB0aGlzLngqdGhhdC56ICsgdGhpcy53KnRoYXQueSArIHRoaXMueSp0aGF0LncsXHJcbiAgICAgICAgICAgIHogPSB0aGlzLngqdGhhdC55IC0gdGhpcy55KnRoYXQueCArIHRoaXMudyp0aGF0LnogKyB0aGlzLnoqdGhhdC53O1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbiggdywgeCwgeSwgeiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGxpZXMgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBxdWF0ZXJuaW9uIGFzIGEgcm90YXRpb25cclxuICAgICAqIG1hdHJpeCB0byB0aGUgcHJvdmlkZWQgdmVjdG9yLCByZXR1cm5pbmcgYSBuZXcgVmVjMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fEFycmF5fSB0aGF0IC0gVGhlIHZlY3RvciB0byByb3RhdGUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSByZXN1bHRpbmcgcm90YXRlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHRoYXQgPSAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApID8gbmV3IFZlYzMoIHRoYXQgKSA6IHRoYXQ7XHJcbiAgICAgICAgdmFyIHZxID0gbmV3IFF1YXRlcm5pb24oIDAsIHRoYXQueCwgdGhhdC55LCB0aGF0LnogKSxcclxuICAgICAgICAgICAgciA9IHRoaXMubXVsdCggdnEgKS5tdWx0KCB0aGlzLmludmVyc2UoKSApO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyggci54LCByLnksIHIueiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHJvdGF0aW9uIG1hdHJpeCB0aGF0IHRoZSBxdWF0ZXJuaW9uIHJlcHJlc2VudHMuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHJvdGF0aW9uIG1hdHJpeCByZXByZXNlbnRlZCBieSB0aGUgcXVhdGVybmlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5wcm90b3R5cGUubWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHh4ID0gdGhpcy54KnRoaXMueCxcclxuICAgICAgICAgICAgeXkgPSB0aGlzLnkqdGhpcy55LFxyXG4gICAgICAgICAgICB6eiA9IHRoaXMueip0aGlzLnosXHJcbiAgICAgICAgICAgIHh5ID0gdGhpcy54KnRoaXMueSxcclxuICAgICAgICAgICAgeHogPSB0aGlzLngqdGhpcy56LFxyXG4gICAgICAgICAgICB4dyA9IHRoaXMueCp0aGlzLncsXHJcbiAgICAgICAgICAgIHl6ID0gdGhpcy55KnRoaXMueixcclxuICAgICAgICAgICAgeXcgPSB0aGlzLnkqdGhpcy53LFxyXG4gICAgICAgICAgICB6dyA9IHRoaXMueip0aGlzLnc7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQzMyhbXHJcbiAgICAgICAgICAgIDEgLSAyKnl5IC0gMip6eiwgMip4eSArIDIqencsIDIqeHogLSAyKnl3LFxyXG4gICAgICAgICAgICAyKnh5IC0gMip6dywgMSAtIDIqeHggLSAyKnp6LCAyKnl6ICsgMip4dyxcclxuICAgICAgICAgICAgMip4eiArIDIqeXcsIDIqeXogLSAyKnh3LCAxIC0gMip4eCAtIDIqeXkgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbiBkZWZpbmVkIGJ5IGFuIGF4aXNcclxuICAgICAqIGFuZCBhbiBhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gZGVncmVlcy5cclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5yb3RhdGlvbkRlZ3JlZXMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIFF1YXRlcm5pb24ucm90YXRpb25SYWRpYW5zKCBhbmdsZSAqICggTWF0aC5QSS8xODAgKSwgYXhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24gZGVmaW5lZCBieSBhbiBheGlzXHJcbiAgICAgKiBhbmQgYW4gYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIHJhZGlhbnMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucm90YXRpb25SYWRpYW5zID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIGlmICggYXhpcyBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICBheGlzID0gbmV3IFZlYzMoIGF4aXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbm9ybWFsaXplIGFyZ3VtZW50c1xyXG4gICAgICAgIGF4aXMgPSBheGlzLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8vIHNldCBxdWF0ZXJuaW9uIGZvciB0aGUgZXF1aXZvbGVudCByb3RhdGlvblxyXG4gICAgICAgIHZhciBtb2RBbmdsZSA9ICggYW5nbGUgPiAwICkgPyBhbmdsZSAlICgyKk1hdGguUEkpIDogYW5nbGUgJSAoLTIqTWF0aC5QSSksXHJcbiAgICAgICAgICAgIHNpbmEgPSBNYXRoLnNpbiggbW9kQW5nbGUvMiApLFxyXG4gICAgICAgICAgICBjb3NhID0gTWF0aC5jb3MoIG1vZEFuZ2xlLzIgKTtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oXHJcbiAgICAgICAgICAgIGNvc2EsXHJcbiAgICAgICAgICAgIGF4aXMueCAqIHNpbmEsXHJcbiAgICAgICAgICAgIGF4aXMueSAqIHNpbmEsXHJcbiAgICAgICAgICAgIGF4aXMueiAqIHNpbmEgKS5ub3JtYWxpemUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcXVhdGVybmlvbiB0aGF0IGhhcyBiZWVuIHNwaGVyaWNhbGx5IGludGVycG9sYXRlZCBiZXR3ZWVuXHJcbiAgICAgKiB0d28gcHJvdmlkZWQgcXVhdGVybmlvbnMgZm9yIGEgZ2l2ZW4gdCB2YWx1ZS5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBmcm9tUm90IC0gVGhlIHJvdGF0aW9uIGF0IHQgPSAwLlxyXG4gICAgICogQHBhcmFtIHtRdWF0ZXJuaW9ufSB0b1JvdCAtIFRoZSByb3RhdGlvbiBhdCB0ID0gMS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IC0gVGhlIHQgdmFsdWUsIGZyb20gMCB0byAxLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIGludGVycG9sYXRlZCByb3RhdGlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5zbGVycCA9IGZ1bmN0aW9uKCBmcm9tUm90LCB0b1JvdCwgdCApIHtcclxuICAgICAgICBpZiAoIGZyb21Sb3QgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgZnJvbVJvdCA9IG5ldyBRdWF0ZXJuaW9uKCBmcm9tUm90ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdG9Sb3QgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgdG9Sb3QgPSBuZXcgUXVhdGVybmlvbiggdG9Sb3QgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGFuZ2xlIGJldHdlZW5cclxuICAgICAgICB2YXIgY29zSGFsZlRoZXRhID0gKCBmcm9tUm90LncgKiB0b1JvdC53ICkgK1xyXG4gICAgICAgICAgICAoIGZyb21Sb3QueCAqIHRvUm90LnggKSArXHJcbiAgICAgICAgICAgICggZnJvbVJvdC55ICogdG9Sb3QueSApICtcclxuICAgICAgICAgICAgKCBmcm9tUm90LnogKiB0b1JvdC56ICk7XHJcbiAgICAgICAgLy8gaWYgZnJvbVJvdD10b1JvdCBvciBmcm9tUm90PS10b1JvdCB0aGVuIHRoZXRhID0gMCBhbmQgd2UgY2FuIHJldHVybiBmcm9tXHJcbiAgICAgICAgaWYgKCBNYXRoLmFicyggY29zSGFsZlRoZXRhICkgPj0gMSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC53LFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC54LFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC55LFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC56ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvc0hhbGZUaGV0YSBtdXN0eSBiZSBwb3NpdGl2ZSB0byByZXR1cm4gdGhlIHNob3J0ZXN0IGFuZ2xlXHJcbiAgICAgICAgaWYgKCBjb3NIYWxmVGhldGEgPCAwICkge1xyXG4gICAgICAgICAgICBmcm9tUm90ID0gZnJvbVJvdC5uZWdhdGUoKTtcclxuICAgICAgICAgICAgY29zSGFsZlRoZXRhID0gLWNvc0hhbGZUaGV0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhhbGZUaGV0YSA9IE1hdGguYWNvcyggY29zSGFsZlRoZXRhICk7XHJcbiAgICAgICAgdmFyIHNpbkhhbGZUaGV0YSA9IE1hdGguc3FydCggMSAtIGNvc0hhbGZUaGV0YSAqIGNvc0hhbGZUaGV0YSApO1xyXG5cclxuICAgICAgICB2YXIgc2NhbGVGcm9tID0gTWF0aC5zaW4oICggMS4wIC0gdCApICogaGFsZlRoZXRhICkgLyBzaW5IYWxmVGhldGE7XHJcbiAgICAgICAgdmFyIHNjYWxlVG8gPSBNYXRoLnNpbiggdCAqIGhhbGZUaGV0YSApIC8gc2luSGFsZlRoZXRhO1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihcclxuICAgICAgICAgICAgZnJvbVJvdC53ICogc2NhbGVGcm9tICsgdG9Sb3QudyAqIHNjYWxlVG8sXHJcbiAgICAgICAgICAgIGZyb21Sb3QueCAqIHNjYWxlRnJvbSArIHRvUm90LnggKiBzY2FsZVRvLFxyXG4gICAgICAgICAgICBmcm9tUm90LnkgKiBzY2FsZUZyb20gKyB0b1JvdC55ICogc2NhbGVUbyxcclxuICAgICAgICAgICAgZnJvbVJvdC56ICogc2NhbGVGcm9tICsgdG9Sb3QueiAqIHNjYWxlVG8gKTtcclxuICAgICAgICAvKlxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBhbmdsZSBiZXR3ZWVuXHJcbiAgICAgICAgdmFyIGNvc0hhbGZUaGV0YSA9ICggZnJvbVJvdC53ICogdG9Sb3QudyApICtcclxuICAgICAgICAgICAgKCBmcm9tUm90LnggKiB0b1JvdC54ICkgK1xyXG4gICAgICAgICAgICAoIGZyb21Sb3QueSAqIHRvUm90LnkgKSArXHJcbiAgICAgICAgICAgICggZnJvbVJvdC56ICogdG9Sb3QueiApO1xyXG4gICAgICAgIC8vIGNvc0hhbGZUaGV0YSBtdXN0eSBiZSBwb3NpdGl2ZSB0byByZXR1cm4gdGhlIHNob3J0ZXN0IGFuZ2xlXHJcbiAgICAgICAgaWYgKCBjb3NIYWxmVGhldGEgPCAwICkge1xyXG4gICAgICAgICAgICBmcm9tUm90ID0gZnJvbVJvdC5uZWdhdGUoKTtcclxuICAgICAgICAgICAgY29zSGFsZlRoZXRhID0gLWNvc0hhbGZUaGV0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgZnJvbVJvdD10b1JvdCBvciBmcm9tUm90PS10b1JvdCB0aGVuIHRoZXRhID0gMCBhbmQgd2UgY2FuIHJldHVybiBmcm9tXHJcbiAgICAgICAgaWYgKCBNYXRoLmFicyggY29zSGFsZlRoZXRhICkgPj0gMSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC53LFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC54LFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC55LFxyXG4gICAgICAgICAgICAgICAgZnJvbVJvdC56ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSB0ZW1wb3JhcnkgdmFsdWVzLlxyXG4gICAgICAgIHZhciBoYWxmVGhldGEgPSBNYXRoLmFjb3MoIGNvc0hhbGZUaGV0YSApO1xyXG4gICAgICAgIHZhciBzaW5IYWxmVGhldGEgPSBNYXRoLnNxcnQoIDEgLSBjb3NIYWxmVGhldGEgKiBjb3NIYWxmVGhldGEgKTtcclxuICAgICAgICAvLyBpZiB0aGV0YSA9IDE4MCBkZWdyZWVzIHRoZW4gcmVzdWx0IGlzIG5vdCBmdWxseSBkZWZpbmVkXHJcbiAgICAgICAgLy8gd2UgY291bGQgcm90YXRlIGFyb3VuZCBhbnkgYXhpcyBub3JtYWwgdG8gJ2Zyb21Sb3QnIG9yICd0b1JvdCdcclxuICAgICAgICBpZiAoIE1hdGguYWJzKCBzaW5IYWxmVGhldGEgKSA8IDAuMDAwMSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKFxyXG4gICAgICAgICAgICAgICAgMC41ICogKCBmcm9tUm90LncgKyB0b1JvdC53ICksXHJcbiAgICAgICAgICAgICAgICAwLjUgKiAoIGZyb21Sb3QueCArIHRvUm90LnggKSxcclxuICAgICAgICAgICAgICAgIDAuNSAqICggZnJvbVJvdC55ICsgdG9Sb3QueSApLFxyXG4gICAgICAgICAgICAgICAgMC41ICogKCBmcm9tUm90LnogKyB0b1JvdC56ICkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJhdGlvQSA9IE1hdGguc2luKCAoIDEgLSB0ICkgKiBoYWxmVGhldGEgKSAvIHNpbkhhbGZUaGV0YTtcclxuICAgICAgICB2YXIgcmF0aW9CID0gTWF0aC5zaW4oIHQgKiBoYWxmVGhldGEgKSAvIHNpbkhhbGZUaGV0YTtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oXHJcbiAgICAgICAgICAgIGZyb21Sb3QudyAqIHJhdGlvQSArIHRvUm90LncgKiByYXRpb0IsXHJcbiAgICAgICAgICAgIGZyb21Sb3QueCAqIHJhdGlvQSArIHRvUm90LnggKiByYXRpb0IsXHJcbiAgICAgICAgICAgIGZyb21Sb3QueSAqIHJhdGlvQSArIHRvUm90LnkgKiByYXRpb0IsXHJcbiAgICAgICAgICAgIGZyb21Sb3QueiAqIHJhdGlvQSArIHRvUm90LnogKiByYXRpb0IgKTtcclxuICAgICAgICAqL1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCB2ZWN0b3IuXHJcbiAgICAgKiBBbiBvcHRpb25hbCBlcHNpbG9uIHZhbHVlIG1heSBiZSBwcm92aWRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtRdWF0ZXJuaW9ufEFycmF5fSAtIFRoZSB2ZWN0b3IgdG8gY2FsY3VsYXRlIHRoZSBkb3QgcHJvZHVjdCB3aXRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIHZhciB3ID0gdGhhdC53ICE9PSB1bmRlZmluZWQgPyB0aGF0LncgOiB0aGF0WzBdLFxyXG4gICAgICAgICAgICB4ID0gdGhhdC54ICE9PSB1bmRlZmluZWQgPyB0aGF0LnggOiB0aGF0WzFdLFxyXG4gICAgICAgICAgICB5ID0gdGhhdC55ICE9PSB1bmRlZmluZWQgPyB0aGF0LnkgOiB0aGF0WzJdLFxyXG4gICAgICAgICAgICB6ID0gdGhhdC56ICE9PSB1bmRlZmluZWQgPyB0aGF0LnogOiB0aGF0WzNdO1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICByZXR1cm4gKCB0aGlzLncgPT09IHcgfHwgTWF0aC5hYnMoIHRoaXMudyAtIHcgKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnggPT09IHggfHwgTWF0aC5hYnMoIHRoaXMueCAtIHggKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnkgPT09IHkgfHwgTWF0aC5hYnMoIHRoaXMueSAtIHkgKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnogPT09IHogfHwgTWF0aC5hYnMoIHRoaXMueiAtIHogKSA8PSBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBRdWF0ZXJuaW9uIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIHF1YXRlcm5pb24gb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtYWcgPSBNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLngqdGhpcy54ICtcclxuICAgICAgICAgICAgICAgIHRoaXMueSp0aGlzLnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy56KnRoaXMueiArXHJcbiAgICAgICAgICAgICAgICB0aGlzLncqdGhpcy53ICk7XHJcbiAgICAgICAgaWYgKCBtYWcgIT09IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMudyAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueCAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueSAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueiAvIG1hZyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjb25qdWdhdGUgb2YgdGhlIHF1YXRlcm5pb24uXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgY29uanVnYXRlIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5jb25qdWdhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKCB0aGlzLncsIC10aGlzLngsIC10aGlzLnksIC10aGlzLnogKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIGludmVyc2Ugb2YgdGhlIHF1YXRlcm5pb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25qdWdhdGUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFF1YXRlcm5pb24gb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBBIHJhbmRvbSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGF4aXMgPSBWZWMzLnJhbmRvbSgpLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBhbmdsZSA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgcmV0dXJuIFF1YXRlcm5pb24ucm90YXRpb25SYWRpYW5zKCBhbmdsZSwgYXhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHF1YXRlcm5pb24uXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHF1YXRlcm5pb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiLCBcIiArIHRoaXMudztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBxdWF0ZXJuaW9uIGFzIGFuIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIFsgIHRoaXMudywgdGhpcy54LCB0aGlzLnksIHRoaXMueiBdO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFF1YXRlcm5pb247XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFZlYzMgPSByZXF1aXJlKCAnLi9WZWMzJyApLFxyXG4gICAgICAgIE1hdDMzID0gcmVxdWlyZSggJy4vTWF0MzMnICksXHJcbiAgICAgICAgTWF0NDQgPSByZXF1aXJlKCAnLi9NYXQ0NCcgKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFRyYW5zZm9ybSBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVHJhbnNmb3JtXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgdHJhbnNmb3JtIHJlcHJlc2VudGluZyBhbiBvcmllbnRhdGlvbiwgcG9zaXRpb24sIGFuZCBzY2FsZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVHJhbnNmb3JtKCB0aGF0ICkge1xyXG4gICAgICAgIHRoYXQgPSB0aGF0IHx8IHt9O1xyXG4gICAgICAgIGlmICggdGhhdC5fdXAgJiZcclxuICAgICAgICAgICAgdGhhdC5fZm9yd2FyZCAmJlxyXG4gICAgICAgICAgICB0aGF0Ll9sZWZ0ICYmXHJcbiAgICAgICAgICAgIHRoYXQuX29yaWdpbiAmJlxyXG4gICAgICAgICAgICB0aGF0Ll9zY2FsZSApIHtcclxuICAgICAgICAgICAgLy8gY29weSBUcmFuc2Zvcm0gYnkgdmFsdWVcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSB0aGF0LnVwKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSB0aGF0LmZvcndhcmQoKTtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IHRoYXQubGVmdCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9vcmlnaW4gPSB0aGF0Lm9yaWdpbigpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY2FsZSA9IHRoYXQuc2NhbGUoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCB0aGF0LmRhdGEgJiYgdGhhdC5kYXRhIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIC8vIE1hdDMzIG9yIE1hdDQ0LCBleHRyYWN0IHRyYW5zZm9ybSBjb21wb25lbnRzIGZyb20gTWF0NDRcclxuICAgICAgICAgICAgdGhhdCA9IHRoYXQuZGVjb21wb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gdGhhdC51cDtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZCA9IHRoYXQuZm9yd2FyZDtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IHRoYXQubGVmdDtcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGUgPSB0aGF0LnNjYWxlO1xyXG4gICAgICAgICAgICB0aGlzLl9vcmlnaW4gPSB0aGF0Lm9yaWdpbiB8fCBuZXcgVmVjMyggMCwgMCwgMCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gaWRlbnRpdHlcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSB0aGF0LnVwID8gbmV3IFZlYzMoIHRoYXQudXAgKS5ub3JtYWxpemUoKSA6IG5ldyBWZWMzKCAwLCAxLCAwICk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSB0aGF0LmZvcndhcmQgPyBuZXcgVmVjMyggdGhhdC5mb3J3YXJkICkubm9ybWFsaXplKCkgOiBuZXcgVmVjMyggMCwgMCwgMSApO1xyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gdGhhdC5sZWZ0ID8gbmV3IFZlYzMoIHRoYXQubGVmdCApLm5vcm1hbGl6ZSgpIDogdGhpcy5fdXAuY3Jvc3MoIHRoaXMuX2ZvcndhcmQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4oIHRoYXQub3JpZ2luIHx8IG5ldyBWZWMzKCAwLCAwLCAwICkgKTtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZSggdGhhdC5zY2FsZSB8fCBuZXcgVmVjMyggMSwgMSwgMSApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBpZGVudGl0eSB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gQW4gaWRlbnRpdHkgdHJhbnNmb3JtLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0uaWRlbnRpdHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRyYW5zZm9ybSh7XHJcbiAgICAgICAgICAgIHVwOiBuZXcgVmVjMyggMCwgMSwgMCApLFxyXG4gICAgICAgICAgICBmb3J3YXJkOiBuZXcgVmVjMyggMCwgMCwgMSApLFxyXG4gICAgICAgICAgICBsZWZ0OiBuZXcgVmVjMyggMSwgMCwgMCApLFxyXG4gICAgICAgICAgICBvcmlnaW46IG5ldyBWZWMzKCAwLCAwLCAwICksXHJcbiAgICAgICAgICAgIHNjYWxlOiBuZXcgVmVjMyggMSwgMSwgMSApXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHNldHMgdGhlIG9yaWdpbiwgb3RoZXJ3aXNlIHJldHVybnMgdGhlXHJcbiAgICAgKiBvcmlnaW4gYnkgdmFsdWUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBvcmlnaW4gLSBUaGUgb3JpZ2luLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM3xUcmFuc2Zvcm19IFRoZSBvcmlnaW4sIG9yIHRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLm9yaWdpbiA9IGZ1bmN0aW9uKCBvcmlnaW4gKSB7XHJcbiAgICAgICAgaWYgKCBvcmlnaW4gKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29yaWdpbiA9IG5ldyBWZWMzKCBvcmlnaW4gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyggdGhpcy5fb3JpZ2luICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHNldHMgdGhlIGZvcndhcmQgdmVjdG9yLCBvdGhlcndpc2UgcmV0dXJuc1xyXG4gICAgICogdGhlIGZvcndhcmQgdmVjdG9yIGJ5IHZhbHVlLiBXaGlsZSBzZXR0aW5nLCBhIHJvdGF0aW9uIG1hdHJpeCBmcm9tIHRoZVxyXG4gICAgICogb3JpZ25hbCBmb3J3YXJkIHZlY3RvciB0byB0aGUgbmV3IGlzIHVzZWQgdG8gcm90YXRlIGFsbCBvdGhlciBheGVzLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIGZvcndhcmQgdmVjdG9yLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM3xUcmFuc2Zvcm19IFRoZSBmb3J3YXJkIHZlY3Rvciwgb3IgdGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuZm9yd2FyZCA9IGZ1bmN0aW9uKCBmb3J3YXJkICkge1xyXG4gICAgICAgIGlmICggZm9yd2FyZCApIHtcclxuICAgICAgICAgICAgaWYgKCBmb3J3YXJkIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gbmV3IFZlYzMoIGZvcndhcmQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvcndhcmQgPSBmb3J3YXJkLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBNYXQzMy5yb3RhdGlvbkZyb21UbyggdGhpcy5fZm9yd2FyZCwgZm9yd2FyZCApO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gZm9yd2FyZDtcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSByb3QubXVsdCggdGhpcy5fdXAgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IHJvdC5tdWx0KCB0aGlzLl9sZWZ0ICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMuX2ZvcndhcmQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBhbiBhcmd1bWVudCBpcyBwcm92aWRlZCwgc2V0cyB0aGUgdXAgdmVjdG9yLCBvdGhlcndpc2UgcmV0dXJuc1xyXG4gICAgICogdGhlIHVwIHZlY3RvciBieSB2YWx1ZS4gV2hpbGUgc2V0dGluZywgYSByb3RhdGlvbiBtYXRyaXggZnJvbSB0aGVcclxuICAgICAqIG9yaWduYWwgdXAgdmVjdG9yIHRvIHRoZSBuZXcgaXMgdXNlZCB0byByb3RhdGUgYWxsIG90aGVyIGF4ZXMuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBvcmlnaW4gLSBUaGUgdXAgdmVjdG9yLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM3xUcmFuc2Zvcm19IFRoZSB1cCB2ZWN0b3IsIG9yIHRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnVwID0gZnVuY3Rpb24oIHVwICkge1xyXG4gICAgICAgIGlmICggdXAgKSB7XHJcbiAgICAgICAgICAgIGlmICggdXAgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIHVwID0gbmV3IFZlYzMoIHVwICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cCA9IHVwLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBNYXQzMy5yb3RhdGlvbkZyb21UbyggdGhpcy5fdXAsIHVwICk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSByb3QubXVsdCggdGhpcy5fZm9yd2FyZCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl91cCA9IHVwO1xyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gcm90Lm11bHQoIHRoaXMuX2xlZnQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyggdGhpcy5fdXAgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBhbiBhcmd1bWVudCBpcyBwcm92aWRlZCwgc2V0cyB0aGUgbGVmdCB2ZWN0b3IsIG90aGVyd2lzZSByZXR1cm5zXHJcbiAgICAgKiB0aGUgbGVmdCB2ZWN0b3IgYnkgdmFsdWUuIFdoaWxlIHNldHRpbmcsIGEgcm90YXRpb24gbWF0cml4IGZyb20gdGhlXHJcbiAgICAgKiBvcmlnbmFsIGxlZnQgdmVjdG9yIHRvIHRoZSBuZXcgaXMgdXNlZCB0byByb3RhdGUgYWxsIG90aGVyIGF4ZXMuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBvcmlnaW4gLSBUaGUgbGVmdCB2ZWN0b3IuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfFRyYW5zZm9ybX0gVGhlIGxlZnQgdmVjdG9yLCBvciB0aGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5sZWZ0ID0gZnVuY3Rpb24oIGxlZnQgKSB7XHJcbiAgICAgICAgaWYgKCBsZWZ0ICkge1xyXG4gICAgICAgICAgICBpZiAoIGxlZnQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBuZXcgVmVjMyggbGVmdCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IGxlZnQubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJvdCA9IE1hdDMzLnJvdGF0aW9uRnJvbVRvKCB0aGlzLl9sZWZ0LCBsZWZ0ICk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSByb3QubXVsdCggdGhpcy5fZm9yd2FyZCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl91cCA9IHJvdC5tdWx0KCB0aGlzLl91cCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyggdGhpcy5fbGVmdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCBzZXRzIHRoZSBzYWNsZSwgb3RoZXJ3aXNlIHJldHVybnMgdGhlXHJcbiAgICAgKiBzY2FsZSBieSB2YWx1ZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl8bnVtYmVyfSBzY2FsZSAtIFRoZSBzY2FsZS4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN8VHJhbnNmb3JtfSBUaGUgc2NhbGUsIG9yIHRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24oIHNjYWxlICkge1xyXG4gICAgICAgIGlmICggc2NhbGUgKSB7XHJcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNjYWxlID09PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2NhbGUgPSBuZXcgVmVjMyggc2NhbGUsIHNjYWxlLCBzY2FsZSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2NhbGUgPSBuZXcgVmVjMyggc2NhbGUgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHRyYW5zZm9ybSBieSBhbm90aGVyIHRyYW5zZm9ybSBvciBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNYXQzM3xNYXQ0NHxUcmFuc2Zvcm18QXJyYXl9IHRoYXQgLSBUaGUgdHJhbnNmb3JtIHRvIG11bHRpcGx5IHdpdGguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm0uXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5IHx8XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBtYXRyaXggb3IgYXJyYXlcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm0oIHRoaXMubWF0cml4KCkubXVsdCggdGhhdCApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHRyYW5zZm9ybVxyXG4gICAgICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKCB0aGlzLm1hdHJpeCgpLm11bHQoIHRoYXQubWF0cml4KCkgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSdzIHNjYWxlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBzY2FsZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuc2NhbGVNYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTWF0NDQuc2NhbGUoIHRoaXMuX3NjYWxlICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgdHJhbnNmb3JtJ3Mgcm90YXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5yb3RhdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoW1xyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0LngsIHRoaXMuX2xlZnQueSwgdGhpcy5fbGVmdC56LCAwLFxyXG4gICAgICAgICAgICB0aGlzLl91cC54LCB0aGlzLl91cC55LCB0aGlzLl91cC56LCAwLFxyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkLngsIHRoaXMuX2ZvcndhcmQueSwgdGhpcy5fZm9yd2FyZC56LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxIF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSdzIHRyYW5zbGF0aW9uIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSB0cmFuc2xhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUudHJhbnNsYXRpb25NYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTWF0NDQudHJhbnNsYXRpb24oIHRoaXMuX29yaWdpbiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSdzIGFmZmluZS10cmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgYWZmaW5lLXRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5tYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBUICogUiAqIFNcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbk1hdHJpeCgpXHJcbiAgICAgICAgICAgIC5tdWx0KCB0aGlzLnJvdGF0aW9uTWF0cml4KCkgKVxyXG4gICAgICAgICAgICAubXVsdCggdGhpcy5zY2FsZU1hdHJpeCgpICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgdHJhbnNmb3JtJ3Mgc2NhbGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGludmVyc2Ugc2NhbGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLmludmVyc2VTY2FsZU1hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNYXQ0NC5zY2FsZSggbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIDEvdGhpcy5fc2NhbGUueCxcclxuICAgICAgICAgICAgMS90aGlzLl9zY2FsZS55LFxyXG4gICAgICAgICAgICAxL3RoaXMuX3NjYWxlLnogKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIHRyYW5zZm9ybSdzIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpbnZlcnNlIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlUm90YXRpb25NYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdC54LCB0aGlzLl91cC54LCB0aGlzLl9mb3J3YXJkLngsIDAsXHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQueSwgdGhpcy5fdXAueSwgdGhpcy5fZm9yd2FyZC55LCAwLFxyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0LnosIHRoaXMuX3VwLnosIHRoaXMuX2ZvcndhcmQueiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSB0cmFuc2Zvcm0ncyB0cmFuc2xhdGlvbiBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgaW52ZXJzZSB0cmFuc2xhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zbGF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdDQ0LnRyYW5zbGF0aW9uKCB0aGlzLl9vcmlnaW4ubmVnYXRlKCkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSB0cmFuc2Zvcm0ncyBhZmZpbmUtdHJhbnNmb3JtYXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGludmVyc2UgYWZmaW5lLXRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gU14tMSAqIFJeLTEgKiBUXi0xXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52ZXJzZVNjYWxlTWF0cml4KClcclxuICAgICAgICAgICAgLm11bHQoIHRoaXMuaW52ZXJzZVJvdGF0aW9uTWF0cml4KCkgKVxyXG4gICAgICAgICAgICAubXVsdCggdGhpcy5pbnZlcnNlVHJhbnNsYXRpb25NYXRyaXgoKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSdzIHZpZXcgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHZpZXcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnZpZXdNYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbk9yaWdpbiA9IHRoaXMuX29yaWdpbi5uZWdhdGUoKSxcclxuICAgICAgICAgICAgcmlnaHQgPSB0aGlzLl9sZWZ0Lm5lZ2F0ZSgpLFxyXG4gICAgICAgICAgICBiYWNrd2FyZCA9IHRoaXMuX2ZvcndhcmQubmVnYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgIHJpZ2h0LngsIHRoaXMuX3VwLngsIGJhY2t3YXJkLngsIDAsXHJcbiAgICAgICAgICAgIHJpZ2h0LnksIHRoaXMuX3VwLnksIGJhY2t3YXJkLnksIDAsXHJcbiAgICAgICAgICAgIHJpZ2h0LnosIHRoaXMuX3VwLnosIGJhY2t3YXJkLnosIDAsXHJcbiAgICAgICAgICAgIG5PcmlnaW4uZG90KCByaWdodCApLCBuT3JpZ2luLmRvdCggdGhpcy5fdXAgKSwgbk9yaWdpbi5kb3QoIGJhY2t3YXJkICksIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhbnNsYXRlcyB0aGUgdHJhbnNmb3JtIGluIHdvcmxkIHNwYWNlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM30gdHJhbnNsYXRpb24gLSBUaGUgdHJhbnNsYXRpb24gdmVjdG9yLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnRyYW5zbGF0ZVdvcmxkID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgIHRoaXMuX29yaWdpbiA9IHRoaXMuX29yaWdpbi5hZGQoIHRyYW5zbGF0aW9uICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhbnNsYXRlcyB0aGUgdHJhbnNmb3JtIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM30gdHJhbnNsYXRpb24gLSBUaGUgdHJhbnNsYXRpb24gdmVjdG9yLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnRyYW5zbGF0ZUxvY2FsID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgIGlmICggdHJhbnNsYXRpb24gaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgdHJhbnNsYXRpb24gPSBuZXcgVmVjMyggdHJhbnNsYXRpb24gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luID0gdGhpcy5fb3JpZ2luLmFkZCggdGhpcy5fbGVmdC5tdWx0KCB0cmFuc2xhdGlvbi54ICkgKVxyXG4gICAgICAgICAgICAuYWRkKCB0aGlzLl91cC5tdWx0KCB0cmFuc2xhdGlvbi55ICkgKVxyXG4gICAgICAgICAgICAuYWRkKCB0aGlzLl9mb3J3YXJkLm11bHQoIHRyYW5zbGF0aW9uLnogKSApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJvdGF0ZXMgdGhlIHRyYW5zZm9ybSBieSBhbiBhbmdsZSBhcm91bmQgYW4gYXhpcyBpbiB3b3JsZCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiBkZWdyZWVzLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnJvdGF0ZVdvcmxkRGVncmVlcyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGVXb3JsZFJhZGlhbnMoIGFuZ2xlICogTWF0aC5QSSAvIDE4MCwgYXhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJvdGF0ZXMgdGhlIHRyYW5zZm9ybSBieSBhbiBhbmdsZSBhcm91bmQgYW4gYXhpcyBpbiB3b3JsZCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiByYWRpYW5zLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnJvdGF0ZVdvcmxkUmFkaWFucyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICB2YXIgcm90ID0gTWF0MzMucm90YXRpb25SYWRpYW5zKCBhbmdsZSwgYXhpcyApO1xyXG4gICAgICAgIHRoaXMuX3VwID0gcm90Lm11bHQoIHRoaXMuX3VwICk7XHJcbiAgICAgICAgdGhpcy5fZm9yd2FyZCA9IHJvdC5tdWx0KCB0aGlzLl9mb3J3YXJkICk7XHJcbiAgICAgICAgdGhpcy5fbGVmdCA9IHJvdC5tdWx0KCB0aGlzLl9sZWZ0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUm90YXRlcyB0aGUgdHJhbnNmb3JtIGJ5IGFuIGFuZ2xlIGFyb3VuZCBhbiBheGlzIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIGRlZ3JlZXMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gVGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUucm90YXRlTG9jYWxEZWdyZWVzID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZVdvcmxkRGVncmVlcyggYW5nbGUsIHRoaXMucm90YXRpb25NYXRyaXgoKS5tdWx0KCBheGlzICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSb3RhdGVzIHRoZSB0cmFuc2Zvcm0gYnkgYW4gYW5nbGUgYXJvdW5kIGFuIGF4aXMgaW4gbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gcmFkaWFucy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5yb3RhdGVMb2NhbFJhZGlhbnMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRlV29ybGRSYWRpYW5zKCBhbmdsZSwgdGhpcy5yb3RhdGlvbk1hdHJpeCgpLm11bHQoIGF4aXMgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zZm9ybXMgdGhlIHZlY3RvciBvciBtYXRyaXggYXJndW1lbnQgZnJvbSB0aGUgdHJhbnNmb3JtcyBsb2NhbCBzcGFjZVxyXG4gICAgICogdG8gdGhlIHdvcmxkIHNwYWNlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fE1hdDMzfE1hdDQ0fSB0aGF0IC0gVGhlIGFyZ3VtZW50IHRvIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWdub3JlU2NhbGUgLSBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIHRoZSBzY2FsZSBpbiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZ25vcmVSb3RhdGlvbiAtIFdoZXRoZXIgb3Igbm90IHRvIGluY2x1ZGUgdGhlIHJvdGF0aW9uIGluIHRoZSB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVRyYW5zbGF0aW9uIC0gV2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgdHJhbnNsYXRpb24gaW4gdGhlIHRyYW5zZm9ybS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5sb2NhbFRvV29ybGQgPSBmdW5jdGlvbiggdGhhdCwgaWdub3JlU2NhbGUsIGlnbm9yZVJvdGF0aW9uLCBpZ25vcmVUcmFuc2xhdGlvbiApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDQ0KCk7XHJcbiAgICAgICAgaWYgKCAhaWdub3JlU2NhbGUgKSB7XHJcbiAgICAgICAgICAgIG1hdCA9IHRoaXMuc2NhbGVNYXRyaXgoKS5tdWx0KCBtYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhaWdub3JlUm90YXRpb24gKSB7XHJcbiAgICAgICAgICAgIG1hdCA9IHRoaXMucm90YXRpb25NYXRyaXgoKS5tdWx0KCBtYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhaWdub3JlVHJhbnNsYXRpb24gKSB7XHJcbiAgICAgICAgICAgIG1hdCA9IHRoaXMudHJhbnNsYXRpb25NYXRyaXgoKS5tdWx0KCBtYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdC5tdWx0KCB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhbnNmb3JtcyB0aGUgdmVjdG9yIG9yIG1hdHJpeCBhcmd1bWVudCBmcm9tIHdvcmxkIHNwYWNlIHRvIHRoZVxyXG4gICAgICogdHJhbnNmb3JtcyBsb2NhbCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxNYXQzM3xNYXQ0NH0gdGhhdCAtIFRoZSBhcmd1bWVudCB0byB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVNjYWxlIC0gV2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgc2NhbGUgaW4gdGhlIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWdub3JlUm90YXRpb24gLSBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIHRoZSByb3RhdGlvbiBpbiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZ25vcmVUcmFuc2xhdGlvbiAtIFdoZXRoZXIgb3Igbm90IHRvIGluY2x1ZGUgdGhlIHRyYW5zbGF0aW9uIGluIHRoZSB0cmFuc2Zvcm0uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gVGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUud29ybGRUb0xvY2FsID0gZnVuY3Rpb24oIHRoYXQsIGlnbm9yZVNjYWxlLCBpZ25vcmVSb3RhdGlvbiwgaWdub3JlVHJhbnNsYXRpb24gKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpO1xyXG4gICAgICAgIGlmICggIWlnbm9yZVRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLmludmVyc2VUcmFuc2xhdGlvbk1hdHJpeCgpLm11bHQoIG1hdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoICFpZ25vcmVSb3RhdGlvbiApIHtcclxuICAgICAgICAgICAgbWF0ID0gdGhpcy5pbnZlcnNlUm90YXRpb25NYXRyaXgoKS5tdWx0KCBtYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhaWdub3JlU2NhbGUgKSB7XHJcbiAgICAgICAgICAgIG1hdCA9IHRoaXMuaW52ZXJzZVNjYWxlTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQubXVsdCggdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYWxsIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCB0cmFuc2Zvcm0uXHJcbiAgICAgKiBBbiBvcHRpb25hbCBlcHNpbG9uIHZhbHVlIG1heSBiZSBwcm92aWRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1RyYW5zZm9ybX0gdGhhdCAtIFRoZSBtYXRyaXggdG8gdGVzdCBlcXVhbGl0eSB3aXRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVwc2lsb24gLSBUaGUgZXBzaWxvbiB2YWx1ZS4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB0cmFuc2Zvcm0gY29tcG9uZW50cyBtYXRjaC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiggdGhhdCwgZXBzaWxvbiApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZ2luLmVxdWFscyggdGhhdC5vcmlnaW4oKSwgZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQuZXF1YWxzKCB0aGF0LmZvcndhcmQoKSwgZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3VwLmVxdWFscyggdGhhdC51cCgpLCBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgdGhpcy5fbGVmdC5lcXVhbHMoIHRoYXQubGVmdCgpLCBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGUuZXF1YWxzKCB0aGF0LnNjYWxlKCksIGVwc2lsb24gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgdHJhbnNmb3JtIHdpdGggYSByYW5kb20gb3JpZ2luLCBvcmllbnRhdGlvbiwgYW5kIHNjYWxlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSByYW5kb20gdHJhbnNmb3JtLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm0oKVxyXG4gICAgICAgICAgICAub3JpZ2luKCBWZWMzLnJhbmRvbSgpIClcclxuICAgICAgICAgICAgLmZvcndhcmQoIFZlYzMucmFuZG9tKCkgKVxyXG4gICAgICAgICAgICAuc2NhbGUoIFZlYzMucmFuZG9tKCkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0cml4KCkudG9TdHJpbmcoKTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSgnLi9WZWMzJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBUcmlhbmdsZSBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVHJpYW5nbGVcclxuICAgICAqIEBjbGFzc2Rlc2MgQSBDQ1ctd2luZGVkIHRyaWFuZ2xlIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVHJpYW5nbGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICggYXJndW1lbnRzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgLy8gYXJyYXkgb3Igb2JqZWN0IGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gbmV3IFZlYzMoIGFyZ1swXSB8fCBhcmcuYSApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iID0gbmV3IFZlYzMoIGFyZ1sxXSB8fCBhcmcuYiApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jID0gbmV3IFZlYzMoIGFyZ1syXSB8fCBhcmcuYyApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIC8vIGluZGl2aWR1YWwgdmVjdG9yIGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gbmV3IFZlYzMoIGFyZ3VtZW50c1swXSApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iID0gbmV3IFZlYzMoIGFyZ3VtZW50c1sxXSApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jID0gbmV3IFZlYzMoIGFyZ3VtZW50c1syXSApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmEgPSBuZXcgVmVjMyggMCwgMCwgMCApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iID0gbmV3IFZlYzMoIDEsIDAsIDAgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYyA9IG5ldyBWZWMzKCAxLCAxLCAwICk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSByYWRpdXMgb2YgdGhlIGJvdW5kaW5nIHNwaGVyZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgcmFkaXVzIG9mIHRoZSBib3VuZGluZyBzcGhlcmUuXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS5yYWRpdXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2VudHJvaWQgPSB0aGlzLmNlbnRyb2lkKCksXHJcbiAgICAgICAgICAgIGFEaXN0ID0gdGhpcy5hLnN1YiggY2VudHJvaWQgKS5sZW5ndGgoKSxcclxuICAgICAgICAgICAgYkRpc3QgPSB0aGlzLmIuc3ViKCBjZW50cm9pZCApLmxlbmd0aCgpLFxyXG4gICAgICAgICAgICBjRGlzdCA9IHRoaXMuYy5zdWIoIGNlbnRyb2lkICkubGVuZ3RoKCk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KCBhRGlzdCwgTWF0aC5tYXgoIGJEaXN0LCBjRGlzdCApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY2VudHJvaWQgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyaWFuZ2xlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIGNlbnRyb2lkIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqL1xyXG4gICAgVHJpYW5nbGUucHJvdG90eXBlLmNlbnRyb2lkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYVxyXG4gICAgICAgICAgICAuYWRkKCB0aGlzLmIgKVxyXG4gICAgICAgICAgICAuYWRkKCB0aGlzLmMgKVxyXG4gICAgICAgICAgICAuZGl2KCAzICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9ybWFsIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmlhbmdsZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBub3JtYWwgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUubm9ybWFsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFiID0gdGhpcy5iLnN1YiggdGhpcy5hICksXHJcbiAgICAgICAgICAgIGFjID0gdGhpcy5jLnN1YiggdGhpcy5hICk7XHJcbiAgICAgICAgcmV0dXJuIGFiLmNyb3NzKCBhYyApLm5vcm1hbGl6ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByYW5kb20gVHJpYW5nbGUgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJpYW5nbGV9IEEgcmFuZG9tIHRyaWFuZ2xlIG9mIHVuaXQgcmFkaXVzLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IFZlYzMucmFuZG9tKCksXHJcbiAgICAgICAgICAgIGIgPSBWZWMzLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBjID0gVmVjMy5yYW5kb20oKSxcclxuICAgICAgICAgICAgY2VudHJvaWQgPSBhLmFkZCggYiApLmFkZCggYyApLmRpdiggMyApLFxyXG4gICAgICAgICAgICBhQ2VudCA9IGEuc3ViKCBjZW50cm9pZCApLFxyXG4gICAgICAgICAgICBiQ2VudCA9IGIuc3ViKCBjZW50cm9pZCApLFxyXG4gICAgICAgICAgICBjQ2VudCA9IGMuc3ViKCBjZW50cm9pZCApLFxyXG4gICAgICAgICAgICBhRGlzdCA9IGFDZW50Lmxlbmd0aCgpLFxyXG4gICAgICAgICAgICBiRGlzdCA9IGJDZW50Lmxlbmd0aCgpLFxyXG4gICAgICAgICAgICBjRGlzdCA9IGNDZW50Lmxlbmd0aCgpLFxyXG4gICAgICAgICAgICBtYXhEaXN0ID0gTWF0aC5tYXgoIE1hdGgubWF4KCBhRGlzdCwgYkRpc3QgKSwgY0Rpc3QgKSxcclxuICAgICAgICAgICAgc2NhbGUgPSAxIC8gbWF4RGlzdDtcclxuICAgICAgICByZXR1cm4gbmV3IFRyaWFuZ2xlKFxyXG4gICAgICAgICAgICBhQ2VudC5tdWx0KCBzY2FsZSApLFxyXG4gICAgICAgICAgICBiQ2VudC5tdWx0KCBzY2FsZSApLFxyXG4gICAgICAgICAgICBjQ2VudC5tdWx0KCBzY2FsZSApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaCB0aG9zZSBvZiBhIHByb3ZpZGVkIHRyaWFuZ2xlLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1RyaWFuZ2xlfSB0aGF0IC0gVGhlIHZlY3RvciB0byB0ZXN0IGVxdWFsaXR5IHdpdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZXBzaWxvbiAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmEuZXF1YWxzKCB0aGF0LmEsIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmIuZXF1YWxzKCB0aGF0LmIsIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmMuZXF1YWxzKCB0aGF0LmMsIGVwc2lsb24gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmEudG9TdHJpbmcoKSArIFwiLCBcIiArXHJcbiAgICAgICAgICAgIHRoaXMuYi50b1N0cmluZygpICsgXCIsIFwiICtcclxuICAgICAgICAgICAgdGhpcy5jLnRvU3RyaW5nKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVHJpYW5nbGU7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBWZWMyIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBWZWMyXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgdHdvIGNvbXBvbmVudCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFZlYzIoKSB7XHJcbiAgICAgICAgc3dpdGNoICggYXJndW1lbnRzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgLy8gYXJyYXkgb3IgVmVjTiBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnQueCB8fCBhcmd1bWVudFswXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudC55IHx8IGFyZ3VtZW50WzFdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGNvbXBvbmVudCBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFZlYzIgd2l0aCBlYWNoIGNvbXBvbmVudCBuZWdhdGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gVGhlIG5lZ2F0ZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIC10aGlzLngsIC10aGlzLnkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgdmVjdG9yIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjMlxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3VtLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSB0aGF0IC0gVGhlIHZlY3RvciB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSBzdW0gb2YgdGhlIHR3byB2ZWN0b3JzLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKCB0aGlzLnggKyB0aGF0WzBdLCB0aGlzLnkgKyB0aGF0WzFdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMiggdGhpcy54ICsgdGhhdC54LCB0aGlzLnkgKyB0aGF0LnkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJ0cmFjdHMgdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCBmcm9tIHRoZSB2ZWN0b3IsIHJldHVybmluZyBhIG5ldyBWZWMyXHJcbiAgICAgKiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkaWZmZXJlbmNlLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSAtIFRoZSB2ZWN0b3IgdG8gc3VidHJhY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSBkaWZmZXJlbmNlIG9mIHRoZSB0d28gdmVjdG9ycy5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMiggdGhpcy54IC0gdGhhdFswXSwgdGhpcy55IC0gdGhhdFsxXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIHRoaXMueCAtIHRoYXQueCwgdGhpcy55IC0gdGhhdC55ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzJcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIHRoaXMueCAqIHRoYXQsIHRoaXMueSAqIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgc2NhbGFyIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjMlxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBkaXZpZGUgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMiggdGhpcy54IC8gdGhhdCwgdGhpcy55IC8gdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGRvdCBwcm9kdWN0IG9mIHRoZSB2ZWN0b3IgYW5kIHRoZSBwcm92aWRlZFxyXG4gICAgICogdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSAtIFRoZSBvdGhlciB2ZWN0b3IgYXJndW1lbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIGRvdCBwcm9kdWN0LlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuICggdGhpcy54ICogdGhhdFswXSApICsgKCB0aGlzLnkgKiB0aGF0WzFdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXQueCApICsgKCB0aGlzLnkgKiB0aGF0LnkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIDJEIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIHZlY3RvciBhbmQgdGhlIHByb3ZpZGVkXHJcbiAgICAgKiB2ZWN0b3IgYXJndW1lbnQuIFRoaXMgdmFsdWUgcmVwcmVzZW50cyB0aGUgbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3IgdGhhdFxyXG4gICAgICogd291bGQgcmVzdWx0IGZyb20gYSByZWd1bGFyIDNEIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIGlucHV0IHZlY3RvcnMsXHJcbiAgICAgKiB0YWtpbmcgdGhlaXIgWiB2YWx1ZXMgYXMgMC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN8VmVjNHxBcnJheX0gLSBUaGUgb3RoZXIgdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSAyRCBjcm9zcyBwcm9kdWN0LlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0WzFdICkgLSAoIHRoaXMueSAqIHRoYXRbMF0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXQueSApIC0gKCB0aGlzLnkgKiB0aGF0LnggKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBubyBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBzY2FsYXIgbGVuZ3RoIG9mXHJcbiAgICAgKiB0aGUgdmVjdG9yLiBJZiBhbiBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYSBuZXdcclxuICAgICAqIFZlYzIgc2NhbGVkIHRvIHRoZSBwcm92aWRlZCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBsZW5ndGggdG8gc2NhbGUgdGhlIHZlY3RvciB0by4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcnxWZWMyfSBFaXRoZXIgdGhlIGxlbmd0aCwgb3IgbmV3IHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCBsZW5ndGggKSB7XHJcbiAgICAgICAgaWYgKCBsZW5ndGggPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguc3FydCggdGhpcy5kb3QoIHRoaXMgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0KCBsZW5ndGggKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3F1YXJlZCBsZW5ndGggb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUubGVuZ3RoU3F1YXJlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRvdCggdGhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCB2ZWN0b3IuXHJcbiAgICAgKiBBbiBvcHRpb25hbCBlcHNpbG9uIHZhbHVlIG1heSBiZSBwcm92aWRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN8VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gdGVzdCBlcXVhbGl0eSB3aXRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVwc2lsb24gLSBUaGUgZXBzaWxvbiB2YWx1ZS4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaC5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgdmFyIHggPSB0aGF0LnggIT09IHVuZGVmaW5lZCA/IHRoYXQueCA6IHRoYXRbMF0sXHJcbiAgICAgICAgICAgIHkgPSB0aGF0LnkgIT09IHVuZGVmaW5lZCA/IHRoYXQueSA6IHRoYXRbMV07XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCA9PT0geCB8fCBNYXRoLmFicyggdGhpcy54IC0geCApIDw9IGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICAoIHRoaXMueSA9PT0geSB8fCBNYXRoLmFicyggdGhpcy55IC0geSApIDw9IGVwc2lsb24gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFZlYzIgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfSBUaGUgdmVjdG9yIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZiAoIG1hZyAhPT0gMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy54IC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55IC8gbWFnICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMigpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByYW5kb20gVmVjMiBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IEEgcmFuZG9tIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjMi5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCksXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKS5ub3JtYWxpemUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICsgXCIsIFwiICsgdGhpcy55O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgdmVjdG9yIGFzIGFuIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIFsgdGhpcy54LCB0aGlzLnkgXTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZWMyO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVmVjMyBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVmVjM1xyXG4gICAgICogQGNsYXNzZGVzYyBBIHRocmVlIGNvbXBvbmVudCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFZlYzMoKSB7XHJcbiAgICAgICAgc3dpdGNoICggYXJndW1lbnRzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgLy8gYXJyYXkgb3IgVmVjTiBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnQueCB8fCBhcmd1bWVudFswXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudC55IHx8IGFyZ3VtZW50WzFdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50LnogfHwgYXJndW1lbnRbMl0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIC8vIGluZGl2aWR1YWwgY29tcG9uZW50IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSAwLjA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFZlYzMgd2l0aCBlYWNoIGNvbXBvbmVudCBuZWdhdGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIG5lZ2F0ZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIC10aGlzLngsIC10aGlzLnksIC10aGlzLnogKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgdmVjdG9yIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjM1xyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3VtLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gYWRkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgc3VtIG9mIHRoZSB0d28gdmVjdG9ycy5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMyggdGhpcy54ICsgdGhhdFswXSwgdGhpcy55ICsgdGhhdFsxXSwgdGhpcy56ICsgdGhhdFsyXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMueCArIHRoYXQueCwgdGhpcy55ICsgdGhhdC55LCB0aGlzLnogKyB0aGF0LnogKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJ0cmFjdHMgdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCBmcm9tIHRoZSB2ZWN0b3IsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogVmVjMyBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkaWZmZXJlbmNlLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIHN1YnRyYWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIHZlY3RvcnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMueCAtIHRoYXRbMF0sIHRoaXMueSAtIHRoYXRbMV0sIHRoaXMueiAtIHRoYXRbMl0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLnggLSB0aGF0LngsIHRoaXMueSAtIHRoYXQueSwgdGhpcy56IC0gdGhhdC56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzNcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMueCAqIHRoYXQsIHRoaXMueSAqIHRoYXQsIHRoaXMueiAqIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgc2NhbGFyIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjM1xyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBkaXZpZGUgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyggdGhpcy54IC8gdGhhdCwgdGhpcy55IC8gdGhhdCwgdGhpcy56IC8gdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGRvdCBwcm9kdWN0IG9mIHRoZSB2ZWN0b3IgYW5kIHRoZSBwcm92aWRlZFxyXG4gICAgICogdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gLSBUaGUgb3RoZXIgdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBkb3QgcHJvZHVjdC5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXRbMF0gKSArICggdGhpcy55ICogdGhhdFsxXSApICsgKCB0aGlzLnogKiB0aGF0WzJdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXQueCApICsgKCB0aGlzLnkgKiB0aGF0LnkgKSArICggdGhpcy56ICogdGhhdC56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0aGUgdmVjdG9yIGFuZCB0aGUgcHJvdmlkZWRcclxuICAgICAqIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIG90aGVyIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgMkQgY3Jvc3MgcHJvZHVjdC5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICAgICAgKCB0aGlzLnkgKiB0aGF0WzJdICkgLSAoIHRoYXRbMV0gKiB0aGlzLnogKSxcclxuICAgICAgICAgICAgICAgICgtdGhpcy54ICogdGhhdFsyXSApICsgKCB0aGF0WzBdICogdGhpcy56ICksXHJcbiAgICAgICAgICAgICAgICAoIHRoaXMueCAqIHRoYXRbMV0gKSAtICggdGhhdFswXSAqIHRoaXMueSApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhcclxuICAgICAgICAgICAgKCB0aGlzLnkgKiB0aGF0LnogKSAtICggdGhhdC55ICogdGhpcy56ICksXHJcbiAgICAgICAgICAgICgtdGhpcy54ICogdGhhdC56ICkgKyAoIHRoYXQueCAqIHRoaXMueiApLFxyXG4gICAgICAgICAgICAoIHRoaXMueCAqIHRoYXQueSApIC0gKCB0aGF0LnggKiB0aGlzLnkgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIG5vIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHNjYWxhciBsZW5ndGggb2ZcclxuICAgICAqIHRoZSB2ZWN0b3IuIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBhIG5ld1xyXG4gICAgICogVmVjMyBzY2FsZWQgdG8gdGhlIHByb3ZpZGVkIGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIGxlbmd0aCB0byBzY2FsZSB0aGUgdmVjdG9yIHRvLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfFZlYzN9IEVpdGhlciB0aGUgbGVuZ3RoLCBvciBuZXcgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oIGxlbmd0aCApIHtcclxuICAgICAgICBpZiAoIGxlbmd0aCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCB0aGlzLmRvdCggdGhpcyApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHQoIGxlbmd0aCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5sZW5ndGhTcXVhcmVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG90KCB0aGlzICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaCB0aG9zZSBvZiBhIHByb3ZpZGVkIHZlY3Rvci5cclxuICAgICAqIEFuIG9wdGlvbmFsIGVwc2lsb24gdmFsdWUgbWF5IGJlIHByb3ZpZGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gdGVzdCBlcXVhbGl0eSB3aXRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVwc2lsb24gLSBUaGUgZXBzaWxvbiB2YWx1ZS4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaC5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgdmFyIHggPSB0aGF0LnggIT09IHVuZGVmaW5lZCA/IHRoYXQueCA6IHRoYXRbMF0sXHJcbiAgICAgICAgICAgIHkgPSB0aGF0LnkgIT09IHVuZGVmaW5lZCA/IHRoYXQueSA6IHRoYXRbMV0sXHJcbiAgICAgICAgICAgIHogPSB0aGF0LnogIT09IHVuZGVmaW5lZCA/IHRoYXQueiA6IHRoYXRbMl07XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCA9PT0geCB8fCBNYXRoLmFicyggdGhpcy54IC0geCApIDw9IGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICAoIHRoaXMueSA9PT0geSB8fCBNYXRoLmFicyggdGhpcy55IC0geSApIDw9IGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICAoIHRoaXMueiA9PT0geiB8fCBNYXRoLmFicyggdGhpcy56IC0geiApIDw9IGVwc2lsb24gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFZlYzMgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgdmVjdG9yIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZiAoIG1hZyAhPT0gMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy54IC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55IC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgdGhpcy56IC8gbWFnICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMygpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByYW5kb20gVmVjMyBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IEEgcmFuZG9tIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjMy5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCksXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCksXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKS5ub3JtYWxpemUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIsIFwiICsgdGhpcy56O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgdmVjdG9yIGFzIGFuIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIFsgdGhpcy54LCB0aGlzLnksIHRoaXMueiBdO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlYzM7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBWZWM0IG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBWZWM0XHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgZm91ciBjb21wb25lbnQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWZWM0KCkge1xyXG4gICAgICAgIHN3aXRjaCAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9yIFZlY04gYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHZhciBhcmd1bWVudCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50LnggfHwgYXJndW1lbnRbMF0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnQueSB8fCBhcmd1bWVudFsxXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudC56IHx8IGFyZ3VtZW50WzJdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50LncgfHwgYXJndW1lbnRbM10gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIC8vIGluZGl2aWR1YWwgY29tcG9uZW50IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLncgPSAwLjA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFZlYzQgd2l0aCBlYWNoIGNvbXBvbmVudCBuZWdhdGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIG5lZ2F0ZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoIC10aGlzLngsIC10aGlzLnksIC10aGlzLnosIC10aGlzLncgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgdmVjdG9yIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjNFxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3VtLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIGFkZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIHN1bSBvZiB0aGUgdHdvIHZlY3RvcnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggKyB0aGF0WzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55ICsgdGhhdFsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMueiArIHRoYXRbMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLncgKyB0aGF0WzNdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy54ICsgdGhhdC54LFxyXG4gICAgICAgICAgICB0aGlzLnkgKyB0aGF0LnksXHJcbiAgICAgICAgICAgIHRoaXMueiArIHRoYXQueixcclxuICAgICAgICAgICAgdGhpcy53ICsgdGhhdC53ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3VidHJhY3RzIHRoZSBwcm92aWRlZCB2ZWN0b3IgYXJndW1lbnQgZnJvbSB0aGUgdmVjdG9yLCByZXR1cm5pbmcgYSBuZXcgVmVjNFxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZGlmZmVyZW5jZS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWM0fEFycmF5fSAtIFRoZSB2ZWN0b3IgdG8gc3VidHJhY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBkaWZmZXJlbmNlIG9mIHRoZSB0d28gdmVjdG9ycy5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgICAgIHRoaXMueCAtIHRoYXRbMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgLSB0aGF0WzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy56IC0gdGhhdFsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMudyAtIHRoYXRbM10gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICB0aGlzLnggLSB0aGF0LngsXHJcbiAgICAgICAgICAgIHRoaXMueSAtIHRoYXQueSxcclxuICAgICAgICAgICAgdGhpcy56IC0gdGhhdC56LFxyXG4gICAgICAgICAgICB0aGlzLncgLSB0aGF0LncgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgc2NhbGFyIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjNFxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBtdWx0aXBseSB0aGUgdmVjdG9yIGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBUaGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy54ICogdGhhdCxcclxuICAgICAgICAgICAgdGhpcy55ICogdGhhdCxcclxuICAgICAgICAgICAgdGhpcy56ICogdGhhdCxcclxuICAgICAgICAgICAgdGhpcy53ICogdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpdmlkZXMgdGhlIHZlY3RvciB3aXRoIHRoZSBwcm92aWRlZCBzY2FsYXIgYXJndW1lbnQsIHJldHVybmluZyBhIG5ldyBWZWM0XHJcbiAgICAgKiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIGRpdmlkZSB0aGUgdmVjdG9yIGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBUaGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICB0aGlzLnggLyB0aGF0LFxyXG4gICAgICAgICAgICB0aGlzLnkgLyB0aGF0LFxyXG4gICAgICAgICAgICB0aGlzLnogLyB0aGF0LFxyXG4gICAgICAgICAgICB0aGlzLncgLyB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgZG90IHByb2R1Y3Qgb2YgdGhlIHZlY3RvciBhbmQgdGhlIHByb3ZpZGVkXHJcbiAgICAgKiB2ZWN0b3IgYXJndW1lbnQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjNHxBcnJheX0gLSBUaGUgb3RoZXIgdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBkb3QgcHJvZHVjdC5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXRbMF0gKSArXHJcbiAgICAgICAgICAgICAgICAoIHRoaXMueSAqIHRoYXRbMV0gKSArXHJcbiAgICAgICAgICAgICAgICAoIHRoaXMueiAqIHRoYXRbMl0gKSArXHJcbiAgICAgICAgICAgICAgICAoIHRoaXMudyAqIHRoYXRbM10gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICggdGhpcy54ICogdGhhdC54ICkgK1xyXG4gICAgICAgICAgICAoIHRoaXMueSAqIHRoYXQueSApICtcclxuICAgICAgICAgICAgKCB0aGlzLnogKiB0aGF0LnogKSArXHJcbiAgICAgICAgICAgICggdGhpcy53ICogdGhhdC53ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgbm8gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgc2NhbGFyIGxlbmd0aCBvZlxyXG4gICAgICogdGhlIHZlY3Rvci4gSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGEgbmV3XHJcbiAgICAgKiBWZWM0IHNjYWxlZCB0byB0aGUgcHJvdmlkZWQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgbGVuZ3RoIHRvIHNjYWxlIHRoZSB2ZWN0b3IgdG8uIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ8VmVjNH0gRWl0aGVyIHRoZSBsZW5ndGgsIG9yIG5ldyBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiggbGVuZ3RoICkge1xyXG4gICAgICAgIGlmICggbGVuZ3RoID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoIHRoaXMuZG90KCB0aGlzICkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKCkubXVsdCggbGVuZ3RoICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgdGhlIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmxlbmd0aFNxdWFyZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb3QoIHRoaXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgdmVjdG9yLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gdGVzdCBlcXVhbGl0eSB3aXRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVwc2lsb24gLSBUaGUgZXBzaWxvbiB2YWx1ZS4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaC5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgdmFyIHggPSB0aGF0LnggIT09IHVuZGVmaW5lZCA/IHRoYXQueCA6IHRoYXRbMF0sXHJcbiAgICAgICAgICAgIHkgPSB0aGF0LnkgIT09IHVuZGVmaW5lZCA/IHRoYXQueSA6IHRoYXRbMV0sXHJcbiAgICAgICAgICAgIHogPSB0aGF0LnogIT09IHVuZGVmaW5lZCA/IHRoYXQueiA6IHRoYXRbMl0sXHJcbiAgICAgICAgICAgIHcgPSB0aGF0LncgIT09IHVuZGVmaW5lZCA/IHRoYXQudyA6IHRoYXRbM107XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCA9PT0geCB8fCBNYXRoLmFicyggdGhpcy54IC0geCApIDw9IGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICAoIHRoaXMueSA9PT0geSB8fCBNYXRoLmFicyggdGhpcy55IC0geSApIDw9IGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICAoIHRoaXMueiA9PT0geiB8fCBNYXRoLmFicyggdGhpcy56IC0geiApIDw9IGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICAoIHRoaXMudyA9PT0gdyB8fCBNYXRoLmFicyggdGhpcy53IC0gdyApIDw9IGVwc2lsb24gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFZlYzQgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBUaGUgdmVjdG9yIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZiAoIG1hZyAhPT0gMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy54IC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55IC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgdGhpcy56IC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53IC8gbWFnICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByYW5kb20gVmVjNCBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IEEgcmFuZG9tIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjNC5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCksXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCksXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCksXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKS5ub3JtYWxpemUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICsgXCIsIFwiICsgdGhpcy55ICsgXCIsIFwiICsgdGhpcy56ICsgXCIsIFwiICsgdGhpcy53O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgdmVjdG9yIGFzIGFuIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIFsgdGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53IF07XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVjNDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAgICAgTWF0MzM6IHJlcXVpcmUoJy4vTWF0MzMnKSxcclxuICAgICAgICBNYXQ0NDogcmVxdWlyZSgnLi9NYXQ0NCcpLFxyXG4gICAgICAgIFZlYzI6IHJlcXVpcmUoJy4vVmVjMicpLFxyXG4gICAgICAgIFZlYzM6IHJlcXVpcmUoJy4vVmVjMycpLFxyXG4gICAgICAgIFZlYzQ6IHJlcXVpcmUoJy4vVmVjMycpLFxyXG4gICAgICAgIFF1YXRlcm5pb246IHJlcXVpcmUoJy4vUXVhdGVybmlvbicpLFxyXG4gICAgICAgIFRyYW5zZm9ybTogcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKSxcclxuICAgICAgICBUcmlhbmdsZTogcmVxdWlyZSgnLi9UcmlhbmdsZScpXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlhV1o1TDI1dlpHVmZiVzlrZFd4bGN5OXdZWFJvTFdKeWIzZHpaWEpwWm5rdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVNJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeThnUTI5d2VYSnBaMmgwSUVwdmVXVnVkQ3dnU1c1akxpQmhibVFnYjNSb1pYSWdUbTlrWlNCamIyNTBjbWxpZFhSdmNuTXVYRzR2TDF4dUx5OGdVR1Z5YldsemMybHZiaUJwY3lCb1pYSmxZbmtnWjNKaGJuUmxaQ3dnWm5KbFpTQnZaaUJqYUdGeVoyVXNJSFJ2SUdGdWVTQndaWEp6YjI0Z2IySjBZV2x1YVc1bklHRmNiaTh2SUdOdmNIa2diMllnZEdocGN5QnpiMlowZDJGeVpTQmhibVFnWVhOemIyTnBZWFJsWkNCa2IyTjFiV1Z1ZEdGMGFXOXVJR1pwYkdWeklDaDBhR1ZjYmk4dklGd2lVMjltZEhkaGNtVmNJaWtzSUhSdklHUmxZV3dnYVc0Z2RHaGxJRk52Wm5SM1lYSmxJSGRwZEdodmRYUWdjbVZ6ZEhKcFkzUnBiMjRzSUdsdVkyeDFaR2x1WjF4dUx5OGdkMmwwYUc5MWRDQnNhVzFwZEdGMGFXOXVJSFJvWlNCeWFXZG9kSE1nZEc4Z2RYTmxMQ0JqYjNCNUxDQnRiMlJwWm5rc0lHMWxjbWRsTENCd2RXSnNhWE5vTEZ4dUx5OGdaR2x6ZEhKcFluVjBaU3dnYzNWaWJHbGpaVzV6WlN3Z1lXNWtMMjl5SUhObGJHd2dZMjl3YVdWeklHOW1JSFJvWlNCVGIyWjBkMkZ5WlN3Z1lXNWtJSFJ2SUhCbGNtMXBkRnh1THk4Z2NHVnljMjl1Y3lCMGJ5QjNhRzl0SUhSb1pTQlRiMlowZDJGeVpTQnBjeUJtZFhKdWFYTm9aV1FnZEc4Z1pHOGdjMjhzSUhOMVltcGxZM1FnZEc4Z2RHaGxYRzR2THlCbWIyeHNiM2RwYm1jZ1kyOXVaR2wwYVc5dWN6cGNiaTh2WEc0dkx5QlVhR1VnWVdKdmRtVWdZMjl3ZVhKcFoyaDBJRzV2ZEdsalpTQmhibVFnZEdocGN5QndaWEp0YVhOemFXOXVJRzV2ZEdsalpTQnphR0ZzYkNCaVpTQnBibU5zZFdSbFpGeHVMeThnYVc0Z1lXeHNJR052Y0dsbGN5QnZjaUJ6ZFdKemRHRnVkR2xoYkNCd2IzSjBhVzl1Y3lCdlppQjBhR1VnVTI5bWRIZGhjbVV1WEc0dkwxeHVMeThnVkVoRklGTlBSbFJYUVZKRklFbFRJRkJTVDFaSlJFVkVJRndpUVZNZ1NWTmNJaXdnVjBsVVNFOVZWQ0JYUVZKU1FVNVVXU0JQUmlCQlRsa2dTMGxPUkN3Z1JWaFFVa1ZUVTF4dUx5OGdUMUlnU1UxUVRFbEZSQ3dnU1U1RFRGVkVTVTVISUVKVlZDQk9UMVFnVEVsTlNWUkZSQ0JVVHlCVVNFVWdWMEZTVWtGT1ZFbEZVeUJQUmx4dUx5OGdUVVZTUTBoQlRsUkJRa2xNU1ZSWkxDQkdTVlJPUlZOVElFWlBVaUJCSUZCQlVsUkpRMVZNUVZJZ1VGVlNVRTlUUlNCQlRrUWdUazlPU1U1R1VrbE9SMFZOUlU1VUxpQkpUbHh1THk4Z1RrOGdSVlpGVGxRZ1UwaEJURXdnVkVoRklFRlZWRWhQVWxNZ1QxSWdRMDlRV1ZKSlIwaFVJRWhQVEVSRlVsTWdRa1VnVEVsQlFreEZJRVpQVWlCQlRsa2dRMHhCU1Uwc1hHNHZMeUJFUVUxQlIwVlRJRTlTSUU5VVNFVlNJRXhKUVVKSlRFbFVXU3dnVjBoRlZFaEZVaUJKVGlCQlRpQkJRMVJKVDA0Z1QwWWdRMDlPVkZKQlExUXNJRlJQVWxRZ1QxSmNiaTh2SUU5VVNFVlNWMGxUUlN3Z1FWSkpVMGxPUnlCR1VrOU5MQ0JQVlZRZ1QwWWdUMUlnU1U0Z1EwOU9Ua1ZEVkVsUFRpQlhTVlJJSUZSSVJTQlRUMFpVVjBGU1JTQlBVaUJVU0VWY2JpOHZJRlZUUlNCUFVpQlBWRWhGVWlCRVJVRk1TVTVIVXlCSlRpQlVTRVVnVTA5R1ZGZEJVa1V1WEc1Y2JpOHZJSEpsYzI5c2RtVnpJQzRnWVc1a0lDNHVJR1ZzWlcxbGJuUnpJR2x1SUdFZ2NHRjBhQ0JoY25KaGVTQjNhWFJvSUdScGNtVmpkRzl5ZVNCdVlXMWxjeUIwYUdWeVpWeHVMeThnYlhWemRDQmlaU0J1YnlCemJHRnphR1Z6TENCbGJYQjBlU0JsYkdWdFpXNTBjeXdnYjNJZ1pHVjJhV05sSUc1aGJXVnpJQ2hqT2x4Y0tTQnBiaUIwYUdVZ1lYSnlZWGxjYmk4dklDaHpieUJoYkhOdklHNXZJR3hsWVdScGJtY2dZVzVrSUhSeVlXbHNhVzVuSUhOc1lYTm9aWE1nTFNCcGRDQmtiMlZ6SUc1dmRDQmthWE4wYVc1bmRXbHphRnh1THk4Z2NtVnNZWFJwZG1VZ1lXNWtJR0ZpYzI5c2RYUmxJSEJoZEdoektWeHVablZ1WTNScGIyNGdibTl5YldGc2FYcGxRWEp5WVhrb2NHRnlkSE1zSUdGc2JHOTNRV0p2ZG1WU2IyOTBLU0I3WEc0Z0lDOHZJR2xtSUhSb1pTQndZWFJvSUhSeWFXVnpJSFJ2SUdkdklHRmliM1psSUhSb1pTQnliMjkwTENCZ2RYQmdJR1Z1WkhNZ2RYQWdQaUF3WEc0Z0lIWmhjaUIxY0NBOUlEQTdYRzRnSUdadmNpQW9kbUZ5SUdrZ1BTQndZWEowY3k1c1pXNW5kR2dnTFNBeE95QnBJRDQ5SURBN0lHa3RMU2tnZTF4dUlDQWdJSFpoY2lCc1lYTjBJRDBnY0dGeWRITmJhVjA3WEc0Z0lDQWdhV1lnS0d4aGMzUWdQVDA5SUNjdUp5a2dlMXh1SUNBZ0lDQWdjR0Z5ZEhNdWMzQnNhV05sS0drc0lERXBPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9iR0Z6ZENBOVBUMGdKeTR1SnlrZ2UxeHVJQ0FnSUNBZ2NHRnlkSE11YzNCc2FXTmxLR2tzSURFcE8xeHVJQ0FnSUNBZ2RYQXJLenRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFZ3S1NCN1hHNGdJQ0FnSUNCd1lYSjBjeTV6Y0d4cFkyVW9hU3dnTVNrN1hHNGdJQ0FnSUNCMWNDMHRPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzh2SUdsbUlIUm9aU0J3WVhSb0lHbHpJR0ZzYkc5M1pXUWdkRzhnWjI4Z1lXSnZkbVVnZEdobElISnZiM1FzSUhKbGMzUnZjbVVnYkdWaFpHbHVaeUF1TG5OY2JpQWdhV1lnS0dGc2JHOTNRV0p2ZG1WU2IyOTBLU0I3WEc0Z0lDQWdabTl5SUNnN0lIVndMUzA3SUhWd0tTQjdYRzRnSUNBZ0lDQndZWEowY3k1MWJuTm9hV1owS0NjdUxpY3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQndZWEowY3p0Y2JuMWNibHh1THk4Z1UzQnNhWFFnWVNCbWFXeGxibUZ0WlNCcGJuUnZJRnR5YjI5MExDQmthWElzSUdKaGMyVnVZVzFsTENCbGVIUmRMQ0IxYm1sNElIWmxjbk5wYjI1Y2JpOHZJQ2R5YjI5MEp5QnBjeUJxZFhOMElHRWdjMnhoYzJnc0lHOXlJRzV2ZEdocGJtY3VYRzUyWVhJZ2MzQnNhWFJRWVhSb1VtVWdQVnh1SUNBZ0lDOWVLRnhjTHo5OEtTaGJYRnh6WEZ4VFhTby9LU2dvUHpwY1hDNTdNU3d5Zlh4YlhseGNMMTByUDN3cEtGeGNMbHRlTGx4Y0wxMHFmQ2twS0Q4NlcxeGNMMTBxS1NRdk8xeHVkbUZ5SUhOd2JHbDBVR0YwYUNBOUlHWjFibU4wYVc5dUtHWnBiR1Z1WVcxbEtTQjdYRzRnSUhKbGRIVnliaUJ6Y0d4cGRGQmhkR2hTWlM1bGVHVmpLR1pwYkdWdVlXMWxLUzV6YkdsalpTZ3hLVHRjYm4wN1hHNWNiaTh2SUhCaGRHZ3VjbVZ6YjJ4MlpTaGJabkp2YlNBdUxpNWRMQ0IwYnlsY2JpOHZJSEJ2YzJsNElIWmxjbk5wYjI1Y2JtVjRjRzl5ZEhNdWNtVnpiMngyWlNBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNCMllYSWdjbVZ6YjJ4MlpXUlFZWFJvSUQwZ0p5Y3NYRzRnSUNBZ0lDQnlaWE52YkhabFpFRmljMjlzZFhSbElEMGdabUZzYzJVN1hHNWNiaUFnWm05eUlDaDJZWElnYVNBOUlHRnlaM1Z0Wlc1MGN5NXNaVzVuZEdnZ0xTQXhPeUJwSUQ0OUlDMHhJQ1ltSUNGeVpYTnZiSFpsWkVGaWMyOXNkWFJsT3lCcExTMHBJSHRjYmlBZ0lDQjJZWElnY0dGMGFDQTlJQ2hwSUQ0OUlEQXBJRDhnWVhKbmRXMWxiblJ6VzJsZElEb2djSEp2WTJWemN5NWpkMlFvS1R0Y2JseHVJQ0FnSUM4dklGTnJhWEFnWlcxd2RIa2dZVzVrSUdsdWRtRnNhV1FnWlc1MGNtbGxjMXh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdjR0YwYUNBaFBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJSFJvY205M0lHNWxkeUJVZVhCbFJYSnliM0lvSjBGeVozVnRaVzUwY3lCMGJ5QndZWFJvTG5KbGMyOXNkbVVnYlhWemRDQmlaU0J6ZEhKcGJtZHpKeWs3WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2doY0dGMGFDa2dlMXh1SUNBZ0lDQWdZMjl1ZEdsdWRXVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVnpiMngyWldSUVlYUm9JRDBnY0dGMGFDQXJJQ2N2SnlBcklISmxjMjlzZG1Wa1VHRjBhRHRjYmlBZ0lDQnlaWE52YkhabFpFRmljMjlzZFhSbElEMGdjR0YwYUM1amFHRnlRWFFvTUNrZ1BUMDlJQ2N2Snp0Y2JpQWdmVnh1WEc0Z0lDOHZJRUYwSUhSb2FYTWdjRzlwYm5RZ2RHaGxJSEJoZEdnZ2MyaHZkV3hrSUdKbElISmxjMjlzZG1Wa0lIUnZJR0VnWm5Wc2JDQmhZbk52YkhWMFpTQndZWFJvTENCaWRYUmNiaUFnTHk4Z2FHRnVaR3hsSUhKbGJHRjBhWFpsSUhCaGRHaHpJSFJ2SUdKbElITmhabVVnS0cxcFoyaDBJR2hoY0hCbGJpQjNhR1Z1SUhCeWIyTmxjM011WTNka0tDa2dabUZwYkhNcFhHNWNiaUFnTHk4Z1RtOXliV0ZzYVhwbElIUm9aU0J3WVhSb1hHNGdJSEpsYzI5c2RtVmtVR0YwYUNBOUlHNXZjbTFoYkdsNlpVRnljbUY1S0dacGJIUmxjaWh5WlhOdmJIWmxaRkJoZEdndWMzQnNhWFFvSnk4bktTd2dablZ1WTNScGIyNG9jQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQWhJWEE3WEc0Z0lIMHBMQ0FoY21WemIyeDJaV1JCWW5OdmJIVjBaU2t1YW05cGJpZ25MeWNwTzF4dVhHNGdJSEpsZEhWeWJpQW9LSEpsYzI5c2RtVmtRV0p6YjJ4MWRHVWdQeUFuTHljZ09pQW5KeWtnS3lCeVpYTnZiSFpsWkZCaGRHZ3BJSHg4SUNjdUp6dGNibjA3WEc1Y2JpOHZJSEJoZEdndWJtOXliV0ZzYVhwbEtIQmhkR2dwWEc0dkx5QndiM05wZUNCMlpYSnphVzl1WEc1bGVIQnZjblJ6TG01dmNtMWhiR2w2WlNBOUlHWjFibU4wYVc5dUtIQmhkR2dwSUh0Y2JpQWdkbUZ5SUdselFXSnpiMngxZEdVZ1BTQmxlSEJ2Y25SekxtbHpRV0p6YjJ4MWRHVW9jR0YwYUNrc1hHNGdJQ0FnSUNCMGNtRnBiR2x1WjFOc1lYTm9JRDBnYzNWaWMzUnlLSEJoZEdnc0lDMHhLU0E5UFQwZ0p5OG5PMXh1WEc0Z0lDOHZJRTV2Y20xaGJHbDZaU0IwYUdVZ2NHRjBhRnh1SUNCd1lYUm9JRDBnYm05eWJXRnNhWHBsUVhKeVlYa29abWxzZEdWeUtIQmhkR2d1YzNCc2FYUW9KeThuS1N3Z1puVnVZM1JwYjI0b2NDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBaElYQTdYRzRnSUgwcExDQWhhWE5CWW5OdmJIVjBaU2t1YW05cGJpZ25MeWNwTzF4dVhHNGdJR2xtSUNnaGNHRjBhQ0FtSmlBaGFYTkJZbk52YkhWMFpTa2dlMXh1SUNBZ0lIQmhkR2dnUFNBbkxpYzdYRzRnSUgxY2JpQWdhV1lnS0hCaGRHZ2dKaVlnZEhKaGFXeHBibWRUYkdGemFDa2dlMXh1SUNBZ0lIQmhkR2dnS3owZ0p5OG5PMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJQ2hwYzBGaWMyOXNkWFJsSUQ4Z0p5OG5JRG9nSnljcElDc2djR0YwYUR0Y2JuMDdYRzVjYmk4dklIQnZjMmw0SUhabGNuTnBiMjVjYm1WNGNHOXlkSE11YVhOQlluTnZiSFYwWlNBOUlHWjFibU4wYVc5dUtIQmhkR2dwSUh0Y2JpQWdjbVYwZFhKdUlIQmhkR2d1WTJoaGNrRjBLREFwSUQwOVBTQW5MeWM3WEc1OU8xeHVYRzR2THlCd2IzTnBlQ0IyWlhKemFXOXVYRzVsZUhCdmNuUnpMbXB2YVc0Z1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ2RtRnlJSEJoZEdoeklEMGdRWEp5WVhrdWNISnZkRzkwZVhCbExuTnNhV05sTG1OaGJHd29ZWEpuZFcxbGJuUnpMQ0F3S1R0Y2JpQWdjbVYwZFhKdUlHVjRjRzl5ZEhNdWJtOXliV0ZzYVhwbEtHWnBiSFJsY2lod1lYUm9jeXdnWm5WdVkzUnBiMjRvY0N3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhBZ0lUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0NkQmNtZDFiV1Z1ZEhNZ2RHOGdjR0YwYUM1cWIybHVJRzExYzNRZ1ltVWdjM1J5YVc1bmN5Y3BPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnY0R0Y2JpQWdmU2t1YW05cGJpZ25MeWNwS1R0Y2JuMDdYRzVjYmx4dUx5OGdjR0YwYUM1eVpXeGhkR2wyWlNobWNtOXRMQ0IwYnlsY2JpOHZJSEJ2YzJsNElIWmxjbk5wYjI1Y2JtVjRjRzl5ZEhNdWNtVnNZWFJwZG1VZ1BTQm1kVzVqZEdsdmJpaG1jbTl0TENCMGJ5a2dlMXh1SUNCbWNtOXRJRDBnWlhod2IzSjBjeTV5WlhOdmJIWmxLR1p5YjIwcExuTjFZbk4wY2lneEtUdGNiaUFnZEc4Z1BTQmxlSEJ2Y25SekxuSmxjMjlzZG1Vb2RHOHBMbk4xWW5OMGNpZ3hLVHRjYmx4dUlDQm1kVzVqZEdsdmJpQjBjbWx0S0dGeWNpa2dlMXh1SUNBZ0lIWmhjaUJ6ZEdGeWRDQTlJREE3WEc0Z0lDQWdabTl5SUNnN0lITjBZWEowSUR3Z1lYSnlMbXhsYm1kMGFEc2djM1JoY25Rckt5a2dlMXh1SUNBZ0lDQWdhV1lnS0dGeWNsdHpkR0Z5ZEYwZ0lUMDlJQ2NuS1NCaWNtVmhhenRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjJZWElnWlc1a0lEMGdZWEp5TG14bGJtZDBhQ0F0SURFN1hHNGdJQ0FnWm05eUlDZzdJR1Z1WkNBK1BTQXdPeUJsYm1RdExTa2dlMXh1SUNBZ0lDQWdhV1lnS0dGeWNsdGxibVJkSUNFOVBTQW5KeWtnWW5KbFlXczdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSE4wWVhKMElENGdaVzVrS1NCeVpYUjFjbTRnVzEwN1hHNGdJQ0FnY21WMGRYSnVJR0Z5Y2k1emJHbGpaU2h6ZEdGeWRDd2daVzVrSUMwZ2MzUmhjblFnS3lBeEtUdGNiaUFnZlZ4dVhHNGdJSFpoY2lCbWNtOXRVR0Z5ZEhNZ1BTQjBjbWx0S0daeWIyMHVjM0JzYVhRb0p5OG5LU2s3WEc0Z0lIWmhjaUIwYjFCaGNuUnpJRDBnZEhKcGJTaDBieTV6Y0d4cGRDZ25MeWNwS1R0Y2JseHVJQ0IyWVhJZ2JHVnVaM1JvSUQwZ1RXRjBhQzV0YVc0b1puSnZiVkJoY25SekxteGxibWQwYUN3Z2RHOVFZWEowY3k1c1pXNW5kR2dwTzF4dUlDQjJZWElnYzJGdFpWQmhjblJ6VEdWdVozUm9JRDBnYkdWdVozUm9PMXh1SUNCbWIzSWdLSFpoY2lCcElEMGdNRHNnYVNBOElHeGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdhV1lnS0daeWIyMVFZWEowYzF0cFhTQWhQVDBnZEc5UVlYSjBjMXRwWFNrZ2UxeHVJQ0FnSUNBZ2MyRnRaVkJoY25SelRHVnVaM1JvSUQwZ2FUdGNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhaaGNpQnZkWFJ3ZFhSUVlYSjBjeUE5SUZ0ZE8xeHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ2MyRnRaVkJoY25SelRHVnVaM1JvT3lCcElEd2dabkp2YlZCaGNuUnpMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnYjNWMGNIVjBVR0Z5ZEhNdWNIVnphQ2duTGk0bktUdGNiaUFnZlZ4dVhHNGdJRzkxZEhCMWRGQmhjblJ6SUQwZ2IzVjBjSFYwVUdGeWRITXVZMjl1WTJGMEtIUnZVR0Z5ZEhNdWMyeHBZMlVvYzJGdFpWQmhjblJ6VEdWdVozUm9LU2s3WEc1Y2JpQWdjbVYwZFhKdUlHOTFkSEIxZEZCaGNuUnpMbXB2YVc0b0p5OG5LVHRjYm4wN1hHNWNibVY0Y0c5eWRITXVjMlZ3SUQwZ0p5OG5PMXh1Wlhod2IzSjBjeTVrWld4cGJXbDBaWElnUFNBbk9pYzdYRzVjYm1WNGNHOXlkSE11WkdseWJtRnRaU0E5SUdaMWJtTjBhVzl1S0hCaGRHZ3BJSHRjYmlBZ2RtRnlJSEpsYzNWc2RDQTlJSE53YkdsMFVHRjBhQ2h3WVhSb0tTeGNiaUFnSUNBZ0lISnZiM1FnUFNCeVpYTjFiSFJiTUYwc1hHNGdJQ0FnSUNCa2FYSWdQU0J5WlhOMWJIUmJNVjA3WEc1Y2JpQWdhV1lnS0NGeWIyOTBJQ1ltSUNGa2FYSXBJSHRjYmlBZ0lDQXZMeUJPYnlCa2FYSnVZVzFsSUhkb1lYUnpiMlYyWlhKY2JpQWdJQ0J5WlhSMWNtNGdKeTRuTzF4dUlDQjlYRzVjYmlBZ2FXWWdLR1JwY2lrZ2UxeHVJQ0FnSUM4dklFbDBJR2hoY3lCaElHUnBjbTVoYldVc0lITjBjbWx3SUhSeVlXbHNhVzVuSUhOc1lYTm9YRzRnSUNBZ1pHbHlJRDBnWkdseUxuTjFZbk4wY2lnd0xDQmthWEl1YkdWdVozUm9JQzBnTVNrN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2NtOXZkQ0FySUdScGNqdGNibjA3WEc1Y2JseHVaWGh3YjNKMGN5NWlZWE5sYm1GdFpTQTlJR1oxYm1OMGFXOXVLSEJoZEdnc0lHVjRkQ2tnZTF4dUlDQjJZWElnWmlBOUlITndiR2wwVUdGMGFDaHdZWFJvS1ZzeVhUdGNiaUFnTHk4Z1ZFOUVUem9nYldGclpTQjBhR2x6SUdOdmJYQmhjbWx6YjI0Z1kyRnpaUzFwYm5ObGJuTnBkR2wyWlNCdmJpQjNhVzVrYjNkelAxeHVJQ0JwWmlBb1pYaDBJQ1ltSUdZdWMzVmljM1J5S0MweElDb2daWGgwTG14bGJtZDBhQ2tnUFQwOUlHVjRkQ2tnZTF4dUlDQWdJR1lnUFNCbUxuTjFZbk4wY2lnd0xDQm1MbXhsYm1kMGFDQXRJR1Y0ZEM1c1pXNW5kR2dwTzF4dUlDQjlYRzRnSUhKbGRIVnliaUJtTzF4dWZUdGNibHh1WEc1bGVIQnZjblJ6TG1WNGRHNWhiV1VnUFNCbWRXNWpkR2x2Ymlod1lYUm9LU0I3WEc0Z0lISmxkSFZ5YmlCemNHeHBkRkJoZEdnb2NHRjBhQ2xiTTEwN1hHNTlPMXh1WEc1bWRXNWpkR2x2YmlCbWFXeDBaWElnS0hoekxDQm1LU0I3WEc0Z0lDQWdhV1lnS0hoekxtWnBiSFJsY2lrZ2NtVjBkWEp1SUhoekxtWnBiSFJsY2lobUtUdGNiaUFnSUNCMllYSWdjbVZ6SUQwZ1cxMDdYRzRnSUNBZ1ptOXlJQ2gyWVhJZ2FTQTlJREE3SUdrZ1BDQjRjeTVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvWmloNGMxdHBYU3dnYVN3Z2VITXBLU0J5WlhNdWNIVnphQ2g0YzF0cFhTazdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJ5WlhNN1hHNTlYRzVjYmk4dklGTjBjbWx1Wnk1d2NtOTBiM1I1Y0dVdWMzVmljM1J5SUMwZ2JtVm5ZWFJwZG1VZ2FXNWtaWGdnWkc5dUozUWdkMjl5YXlCcGJpQkpSVGhjYm5aaGNpQnpkV0p6ZEhJZ1BTQW5ZV0luTG5OMVluTjBjaWd0TVNrZ1BUMDlJQ2RpSjF4dUlDQWdJRDhnWm5WdVkzUnBiMjRnS0hOMGNpd2djM1JoY25Rc0lHeGxiaWtnZXlCeVpYUjFjbTRnYzNSeUxuTjFZbk4wY2loemRHRnlkQ3dnYkdWdUtTQjlYRzRnSUNBZ09pQm1kVzVqZEdsdmJpQW9jM1J5TENCemRHRnlkQ3dnYkdWdUtTQjdYRzRnSUNBZ0lDQWdJR2xtSUNoemRHRnlkQ0E4SURBcElITjBZWEowSUQwZ2MzUnlMbXhsYm1kMGFDQXJJSE4wWVhKME8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2MzUnlMbk4xWW5OMGNpaHpkR0Z5ZEN3Z2JHVnVLVHRjYmlBZ0lDQjlYRzQ3WEc0aVhYMD0iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjYuM1xuKGZ1bmN0aW9uKCkge1xuICB2YXIgRGVmZXJyZWQsIFBFTkRJTkcsIFJFSkVDVEVELCBSRVNPTFZFRCwgVkVSU0lPTiwgYWZ0ZXIsIGV4ZWN1dGUsIGZsYXR0ZW4sIGhhcywgaW5zdGFsbEludG8sIGlzQXJndW1lbnRzLCBpc1Byb21pc2UsIHdyYXAsIF93aGVuLFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZTtcblxuICBWRVJTSU9OID0gJzMuMC4wJztcblxuICBQRU5ESU5HID0gXCJwZW5kaW5nXCI7XG5cbiAgUkVTT0xWRUQgPSBcInJlc29sdmVkXCI7XG5cbiAgUkVKRUNURUQgPSBcInJlamVjdGVkXCI7XG5cbiAgaGFzID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIDogdm9pZCAwO1xuICB9O1xuXG4gIGlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGhhcyhvYmosICdsZW5ndGgnKSAmJiBoYXMob2JqLCAnY2FsbGVlJyk7XG4gIH07XG5cbiAgaXNQcm9taXNlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGhhcyhvYmosICdwcm9taXNlJykgJiYgdHlwZW9mIChvYmogIT0gbnVsbCA/IG9iai5wcm9taXNlIDogdm9pZCAwKSA9PT0gJ2Z1bmN0aW9uJztcbiAgfTtcblxuICBmbGF0dGVuID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICBpZiAoaXNBcmd1bWVudHMoYXJyYXkpKSB7XG4gICAgICByZXR1cm4gZmxhdHRlbihBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnJheSkpO1xuICAgIH1cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgICByZXR1cm4gW2FycmF5XTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihtZW1vLCB2YWx1ZSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZW1vLmNvbmNhdChmbGF0dGVuKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICBtZW1vLnB1c2godmFsdWUpO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfSwgW10pO1xuICB9O1xuXG4gIGFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICBpZiAodGltZXMgPD0gMCkge1xuICAgICAgcmV0dXJuIGZ1bmMoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICB3cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzO1xuICAgICAgYXJncyA9IFtmdW5jXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIGV4ZWN1dGUgPSBmdW5jdGlvbihjYWxsYmFja3MsIGFyZ3MsIGNvbnRleHQpIHtcbiAgICB2YXIgY2FsbGJhY2ssIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICBfcmVmID0gZmxhdHRlbihjYWxsYmFja3MpO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBjYWxsYmFjayA9IF9yZWZbX2ldO1xuICAgICAgX3Jlc3VsdHMucHVzaChjYWxsYmFjay5jYWxsLmFwcGx5KGNhbGxiYWNrLCBbY29udGV4dF0uY29uY2F0KF9fc2xpY2UuY2FsbChhcmdzKSkpKTtcbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xuXG4gIERlZmVycmVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhbmRpZGF0ZSwgY2xvc2UsIGNsb3NpbmdBcmd1bWVudHMsIGRvbmVDYWxsYmFja3MsIGZhaWxDYWxsYmFja3MsIHByb2dyZXNzQ2FsbGJhY2tzLCBzdGF0ZTtcbiAgICBzdGF0ZSA9IFBFTkRJTkc7XG4gICAgZG9uZUNhbGxiYWNrcyA9IFtdO1xuICAgIGZhaWxDYWxsYmFja3MgPSBbXTtcbiAgICBwcm9ncmVzc0NhbGxiYWNrcyA9IFtdO1xuICAgIGNsb3NpbmdBcmd1bWVudHMgPSB7XG4gICAgICAncmVzb2x2ZWQnOiB7fSxcbiAgICAgICdyZWplY3RlZCc6IHt9LFxuICAgICAgJ3BlbmRpbmcnOiB7fVxuICAgIH07XG4gICAgdGhpcy5wcm9taXNlID0gZnVuY3Rpb24oY2FuZGlkYXRlKSB7XG4gICAgICB2YXIgcGlwZSwgc3RvcmVDYWxsYmFja3M7XG4gICAgICBjYW5kaWRhdGUgPSBjYW5kaWRhdGUgfHwge307XG4gICAgICBjYW5kaWRhdGUuc3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfTtcbiAgICAgIHN0b3JlQ2FsbGJhY2tzID0gZnVuY3Rpb24oc2hvdWxkRXhlY3V0ZUltbWVkaWF0ZWx5LCBob2xkZXIsIGhvbGRlclN0YXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgICAgIGhvbGRlci5wdXNoLmFwcGx5KGhvbGRlciwgZmxhdHRlbihhcmd1bWVudHMpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNob3VsZEV4ZWN1dGVJbW1lZGlhdGVseSgpKSB7XG4gICAgICAgICAgICBleGVjdXRlKGFyZ3VtZW50cywgY2xvc2luZ0FyZ3VtZW50c1tob2xkZXJTdGF0ZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNhbmRpZGF0ZS5kb25lID0gc3RvcmVDYWxsYmFja3MoKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RhdGUgPT09IFJFU09MVkVEO1xuICAgICAgfSksIGRvbmVDYWxsYmFja3MsIFJFU09MVkVEKTtcbiAgICAgIGNhbmRpZGF0ZS5mYWlsID0gc3RvcmVDYWxsYmFja3MoKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RhdGUgPT09IFJFSkVDVEVEO1xuICAgICAgfSksIGZhaWxDYWxsYmFja3MsIFJFSkVDVEVEKTtcbiAgICAgIGNhbmRpZGF0ZS5wcm9ncmVzcyA9IHN0b3JlQ2FsbGJhY2tzKChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlICE9PSBQRU5ESU5HO1xuICAgICAgfSksIHByb2dyZXNzQ2FsbGJhY2tzLCBQRU5ESU5HKTtcbiAgICAgIGNhbmRpZGF0ZS5hbHdheXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9yZWY7XG4gICAgICAgIHJldHVybiAoX3JlZiA9IGNhbmRpZGF0ZS5kb25lLmFwcGx5KGNhbmRpZGF0ZSwgYXJndW1lbnRzKSkuZmFpbC5hcHBseShfcmVmLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIHBpcGUgPSBmdW5jdGlvbihkb25lRmlsdGVyLCBmYWlsRmlsdGVyLCBwcm9ncmVzc0ZpbHRlcikge1xuICAgICAgICB2YXIgZmlsdGVyLCBtYXN0ZXI7XG4gICAgICAgIG1hc3RlciA9IG5ldyBEZWZlcnJlZCgpO1xuICAgICAgICBmaWx0ZXIgPSBmdW5jdGlvbihzb3VyY2UsIGZ1bm5lbCwgY2FsbGJhY2spIHtcbiAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FuZGlkYXRlW3NvdXJjZV0obWFzdGVyW2Z1bm5lbF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2FuZGlkYXRlW3NvdXJjZV0oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncywgdmFsdWU7XG4gICAgICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoaXNQcm9taXNlKHZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuZG9uZShtYXN0ZXIucmVzb2x2ZSkuZmFpbChtYXN0ZXIucmVqZWN0KS5wcm9ncmVzcyhtYXN0ZXIubm90aWZ5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBtYXN0ZXJbZnVubmVsXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZpbHRlcignZG9uZScsICdyZXNvbHZlJywgZG9uZUZpbHRlcik7XG4gICAgICAgIGZpbHRlcignZmFpbCcsICdyZWplY3QnLCBmYWlsRmlsdGVyKTtcbiAgICAgICAgZmlsdGVyKCdwcm9ncmVzcycsICdub3RpZnknLCBwcm9ncmVzc0ZpbHRlcik7XG4gICAgICAgIHJldHVybiBtYXN0ZXI7XG4gICAgICB9O1xuICAgICAgY2FuZGlkYXRlLnBpcGUgPSBwaXBlO1xuICAgICAgY2FuZGlkYXRlLnRoZW4gPSBwaXBlO1xuICAgICAgaWYgKGNhbmRpZGF0ZS5wcm9taXNlID09IG51bGwpIHtcbiAgICAgICAgY2FuZGlkYXRlLnByb21pc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICB9O1xuICAgIHRoaXMucHJvbWlzZSh0aGlzKTtcbiAgICBjYW5kaWRhdGUgPSB0aGlzO1xuICAgIGNsb3NlID0gZnVuY3Rpb24oZmluYWxTdGF0ZSwgY2FsbGJhY2tzLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChzdGF0ZSA9PT0gUEVORElORykge1xuICAgICAgICAgIHN0YXRlID0gZmluYWxTdGF0ZTtcbiAgICAgICAgICBjbG9zaW5nQXJndW1lbnRzW2ZpbmFsU3RhdGVdID0gYXJndW1lbnRzO1xuICAgICAgICAgIGV4ZWN1dGUoY2FsbGJhY2tzLCBjbG9zaW5nQXJndW1lbnRzW2ZpbmFsU3RhdGVdLCBjb250ZXh0KTtcbiAgICAgICAgICByZXR1cm4gY2FuZGlkYXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9O1xuICAgIHRoaXMucmVzb2x2ZSA9IGNsb3NlKFJFU09MVkVELCBkb25lQ2FsbGJhY2tzKTtcbiAgICB0aGlzLnJlamVjdCA9IGNsb3NlKFJFSkVDVEVELCBmYWlsQ2FsbGJhY2tzKTtcbiAgICB0aGlzLm5vdGlmeSA9IGNsb3NlKFBFTkRJTkcsIHByb2dyZXNzQ2FsbGJhY2tzKTtcbiAgICB0aGlzLnJlc29sdmVXaXRoID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgcmV0dXJuIGNsb3NlKFJFU09MVkVELCBkb25lQ2FsbGJhY2tzLCBjb250ZXh0KS5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9O1xuICAgIHRoaXMucmVqZWN0V2l0aCA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHJldHVybiBjbG9zZShSRUpFQ1RFRCwgZmFpbENhbGxiYWNrcywgY29udGV4dCkuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfTtcbiAgICB0aGlzLm5vdGlmeVdpdGggPSBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgICByZXR1cm4gY2xvc2UoUEVORElORywgcHJvZ3Jlc3NDYWxsYmFja3MsIGNvbnRleHQpLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX3doZW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmLCBkZWZzLCBmaW5pc2gsIHJlc29sdXRpb25BcmdzLCB0cmlnZ2VyLCBfaSwgX2xlbjtcbiAgICBkZWZzID0gZmxhdHRlbihhcmd1bWVudHMpO1xuICAgIGlmIChkZWZzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGlzUHJvbWlzZShkZWZzWzBdKSkge1xuICAgICAgICByZXR1cm4gZGVmc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAobmV3IERlZmVycmVkKCkpLnJlc29sdmUoZGVmc1swXSkucHJvbWlzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0cmlnZ2VyID0gbmV3IERlZmVycmVkKCk7XG4gICAgaWYgKCFkZWZzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRyaWdnZXIucmVzb2x2ZSgpLnByb21pc2UoKTtcbiAgICB9XG4gICAgcmVzb2x1dGlvbkFyZ3MgPSBbXTtcbiAgICBmaW5pc2ggPSBhZnRlcihkZWZzLmxlbmd0aCwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJpZ2dlci5yZXNvbHZlLmFwcGx5KHRyaWdnZXIsIHJlc29sdXRpb25BcmdzKTtcbiAgICB9KTtcbiAgICBkZWZzLmZvckVhY2goZnVuY3Rpb24oZGVmLCBpbmRleCkge1xuICAgICAgaWYgKGlzUHJvbWlzZShkZWYpKSB7XG4gICAgICAgIHJldHVybiBkZWYuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXJncztcbiAgICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgICByZXNvbHV0aW9uQXJnc1tpbmRleF0gPSBhcmdzLmxlbmd0aCA+IDEgPyBhcmdzIDogYXJnc1swXTtcbiAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x1dGlvbkFyZ3NbaW5kZXhdID0gZGVmO1xuICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBkZWZzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBkZWYgPSBkZWZzW19pXTtcbiAgICAgIGlzUHJvbWlzZShkZWYpICYmIGRlZi5mYWlsKHRyaWdnZXIucmVqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRyaWdnZXIucHJvbWlzZSgpO1xuICB9O1xuXG4gIGluc3RhbGxJbnRvID0gZnVuY3Rpb24oZncpIHtcbiAgICBmdy5EZWZlcnJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEZWZlcnJlZCgpO1xuICAgIH07XG4gICAgZncuYWpheCA9IHdyYXAoZncuYWpheCwgZnVuY3Rpb24oYWpheCwgb3B0aW9ucykge1xuICAgICAgdmFyIGNyZWF0ZVdyYXBwZXIsIGRlZiwgcHJvbWlzZSwgeGhyO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcbiAgICAgIGNyZWF0ZVdyYXBwZXIgPSBmdW5jdGlvbih3cmFwcGVkLCBmaW5pc2hlcikge1xuICAgICAgICByZXR1cm4gd3JhcCh3cmFwcGVkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXJncywgZnVuYztcbiAgICAgICAgICBmdW5jID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgICAgICBpZiAoZnVuYykge1xuICAgICAgICAgICAgZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZpbmlzaGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBvcHRpb25zLnN1Y2Nlc3MgPSBjcmVhdGVXcmFwcGVyKG9wdGlvbnMuc3VjY2VzcywgZGVmLnJlc29sdmUpO1xuICAgICAgb3B0aW9ucy5lcnJvciA9IGNyZWF0ZVdyYXBwZXIob3B0aW9ucy5lcnJvciwgZGVmLnJlamVjdCk7XG4gICAgICB4aHIgPSBhamF4KG9wdGlvbnMpO1xuICAgICAgcHJvbWlzZSA9IGRlZi5wcm9taXNlKCk7XG4gICAgICBwcm9taXNlLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB4aHIuYWJvcnQoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9KTtcbiAgICByZXR1cm4gZncud2hlbiA9IF93aGVuO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBleHBvcnRzLkRlZmVycmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERlZmVycmVkKCk7XG4gICAgfTtcbiAgICBleHBvcnRzLndoZW4gPSBfd2hlbjtcbiAgICBleHBvcnRzLmluc3RhbGxJbnRvID0gaW5zdGFsbEludG87XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHR5cGVvZiBaZXB0byAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbGxJbnRvKFplcHRvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERlZmVycmVkLndoZW4gPSBfd2hlbjtcbiAgICAgICAgRGVmZXJyZWQuaW5zdGFsbEludG8gPSBpbnN0YWxsSW50bztcbiAgICAgICAgcmV0dXJuIERlZmVycmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBaZXB0byAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpbnN0YWxsSW50byhaZXB0byk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5EZWZlcnJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEZWZlcnJlZCgpO1xuICAgIH07XG4gICAgdGhpcy5EZWZlcnJlZC53aGVuID0gX3doZW47XG4gICAgdGhpcy5EZWZlcnJlZC5pbnN0YWxsSW50byA9IGluc3RhbGxJbnRvO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIFJlbmRlclRhcmdldCA9IHJlcXVpcmUoJy4vUmVuZGVyVGFyZ2V0JyksXHJcbiAgICAgICAgVGV4dHVyZTJEID0gcmVxdWlyZSgnLi9UZXh0dXJlMkQnKSxcclxuICAgICAgICBUZXh0dXJlQ3ViZU1hcCA9IHJlcXVpcmUoJy4vVGV4dHVyZUN1YmVNYXAnKSxcclxuICAgICAgICBWaWV3cG9ydCA9IHJlcXVpcmUoJy4vVmlld3BvcnQnKSxcclxuICAgICAgICBDYW1lcmEgPSByZXF1aXJlKCcuLi9yZW5kZXIvQ2FtZXJhJyksXHJcbiAgICAgICAgRkFDRVMgPSBbXHJcbiAgICAgICAgICAgICcteCcsICcreCcsXHJcbiAgICAgICAgICAgICcteScsICcreScsXHJcbiAgICAgICAgICAgICcteicsICcreidcclxuICAgICAgICBdLFxyXG4gICAgICAgIEZBQ0VfVEFSR0VUUyA9IHtcclxuICAgICAgICAgICAgJyt6JzogXCJURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1pcIixcclxuICAgICAgICAgICAgJy16JzogXCJURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1pcIixcclxuICAgICAgICAgICAgJyt4JzogXCJURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1hcIixcclxuICAgICAgICAgICAgJy14JzogXCJURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1hcIixcclxuICAgICAgICAgICAgJyt5JzogXCJURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1lcIixcclxuICAgICAgICAgICAgJy15JzogXCJURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1lcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgREVGQVVMVF9TSVpFID0gMjA0ODtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIGEgcGFydGljdWxhciBmYWNlIG9mIHRoZSBjdWJlIG1hcCByZW5kZXJUYXJnZXQgYW5kIHJlYWRpZXMgaXQgZm9yXHJcbiAgICAgKiByZW5kZXJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtDdWJlTWFwUmVuZGVyVGFyZ2V0fSBjdWJlTWFwVGFyZ2V0IC0gVGhlIGN1YmUgbWFwIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmYWNlIC0gVGhlIGZhY2UgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBiaW5kRmFjZVRleHR1cmUoIGN1YmVNYXBUYXJnZXQsIGZhY2UgKSB7XHJcbiAgICAgICAgLy8gYmluZCByZWxldmFudCBmYWNlIG9mIGN1YmUgbWFwXHJcbiAgICAgICAgY3ViZU1hcFRhcmdldC5yZW5kZXJUYXJnZXQuc2V0Q29sb3JUYXJnZXQoXHJcbiAgICAgICAgICAgIGN1YmVNYXBUYXJnZXQuY3ViZU1hcCxcclxuICAgICAgICAgICAgRkFDRV9UQVJHRVRTWyBmYWNlIF0gKTtcclxuICAgICAgICAvLyBjbGVhciB0aGUgZmFjZSB0ZXh0dXJlXHJcbiAgICAgICAgY3ViZU1hcFRhcmdldC5yZW5kZXJUYXJnZXQuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBjYW1lcmEgb2JqZWN0IGZvciB0aGUgcHJvdmlkZWQgZmFjZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmFjZSAtIFRoZSBmYWNlIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIG9yaWdpbiBvZiB0aGUgY3ViZSBtYXAuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0NhbWVyYX0gVGhlIHJlc3VsdGluZyBjYW1lcmEuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldEZhY2VDYW1lcmEoIGZhY2UsIG9yaWdpbiApIHtcclxuICAgICAgICB2YXIgZm9yd2FyZCxcclxuICAgICAgICAgICAgdXA7XHJcbiAgICAgICAgLy8gc2V0dXAgdHJhbnNmb3JtIGRlcGVuZGluZyBvbiBjdXJyZW50IGZhY2VcclxuICAgICAgICBzd2l0Y2ggKCBmYWNlICkge1xyXG4gICAgICAgICAgICBjYXNlICcreCc6XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gWyAxLCAwLCAwIF07XHJcbiAgICAgICAgICAgICAgICB1cCA9IFsgMCwgLTEsIDAgXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICcteCc6XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gWyAtMSwgMCwgMCBdO1xyXG4gICAgICAgICAgICAgICAgdXAgPSBbIDAsIC0xLCAwIF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnK3knOlxyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IFsgMCwgMSwgMCBdO1xyXG4gICAgICAgICAgICAgICAgdXAgPSBbIDAsIDAsIDEgXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICcteSc6XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gWyAwLCAtMSwgMCBdO1xyXG4gICAgICAgICAgICAgICAgdXAgPSBbIDAsIDAsIC0xIF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnK3onOlxyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IFsgMCwgMCwgMSBdO1xyXG4gICAgICAgICAgICAgICAgdXAgPSBbIDAsIC0xLCAwIF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnLXonOlxyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IFsgMCwgMCwgLTEgXTtcclxuICAgICAgICAgICAgICAgIHVwID0gWyAwLCAtMSwgMCBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQ2FtZXJhKHtcclxuICAgICAgICAgICAgb3JpZ2luOiBvcmlnaW4sXHJcbiAgICAgICAgICAgIGZvcndhcmQ6IGZvcndhcmQsXHJcbiAgICAgICAgICAgIHVwOiB1cCxcclxuICAgICAgICAgICAgcHJvamVjdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZm92OiA5MCxcclxuICAgICAgICAgICAgICAgIGFzcGVjdDogMSxcclxuICAgICAgICAgICAgICAgIHpNaW46IDEsXHJcbiAgICAgICAgICAgICAgICB6TWF4OiAxMDAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVE9ETzogdGVzdCBwZXJmb3JtYW5jZSB2cyB1c2luZyA2IEZCTydzLCBlYWNoIHNoYXJpbmcgYSBzaW5nbGUgZGVwdGhcclxuICAgICAqIHRleHR1cmUuXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIEN1YmVNYXBSZW5kZXJUYXJnZXQgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIEN1YmVNYXBSZW5kZXJUYXJnZXRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSByZW5kZXJUYXJnZXQgY2xhc3MgdG8gYWxsb3cgcmVuZGVyaW5nIHRvIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBDdWJlTWFwUmVuZGVyVGFyZ2V0KCBzcGVjICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5pZCA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9uID0gc3BlYy5yZXNvbHV0aW9uIHx8IERFRkFVTFRfU0laRTtcclxuICAgICAgICB0aGlzLmRlcHRoVGV4dHVyZSA9IG5ldyBUZXh0dXJlMkQoe1xyXG4gICAgICAgICAgICBmb3JtYXQ6IFwiREVQVEhfQ09NUE9ORU5UXCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiVU5TSUdORURfU0hPUlRcIixcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucmVzb2x1dGlvbixcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlc29sdXRpb25cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmN1YmVNYXAgPSBuZXcgVGV4dHVyZUN1YmVNYXAoe1xyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucmVzb2x1dGlvblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gbmV3IFJlbmRlclRhcmdldCgpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0LnNldERlcHRoVGFyZ2V0KCB0aGlzLmRlcHRoVGV4dHVyZSApO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQgPSBuZXcgVmlld3BvcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBjdWJlIG1hcCBjb21wb25lbnQgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIHN0YWNrLlxyXG4gICAgICogQG1lbWJlcm9mIEN1YmVNYXBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDdWJlTWFwUmVuZGVyVGFyZ2V0fSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgIEN1YmVNYXBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XHJcbiAgICAgICAgdGhpcy5jdWJlTWFwLnB1c2goIGxvY2F0aW9uICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIGJpbmRzIHRoZSB0ZXh0dXJlIGJlbmVhdGggaXQgb25cclxuICAgICAqIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgdGV4dHVyZSwgdW5iaW5kcyB0aGUgdW5pdC5cclxuICAgICAqIEBtZW1iZXJvZiBDdWJlTWFwUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q3ViZU1hcFJlbmRlclRhcmdldH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgICBDdWJlTWFwUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XHJcbiAgICAgICAgdGhpcy5jdWJlTWFwLnBvcCggbG9jYXRpb24gKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBDdWJlTWFwUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBvcmlnaW4gLSBUaGUgb3JpZ2luIG9mIHRoZSBjdWJlIG1hcC5cclxuICAgICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIGV4ZWN1dGUuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZW50aXRpZXNCeVRlY2huaXF1ZSAtIFRoZSBlbnRpdGllcyBrZXllZCBieSB0ZWNobmlxdWUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0N1YmVNYXBSZW5kZXJUYXJnZXR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBDdWJlTWFwUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiggb3JpZ2luLCByZW5kZXJlciwgZW50aXRpZXNCeVRlY2huaXF1ZSApIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQucHVzaCgpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQucHVzaCggdGhpcy5yZXNvbHV0aW9uLCB0aGlzLnJlc29sdXRpb24gKTtcclxuICAgICAgICBGQUNFUy5mb3JFYWNoKCBmdW5jdGlvbiggZmFjZSApIHtcclxuICAgICAgICAgICAgLy8gYmluZCBmYWNlXHJcbiAgICAgICAgICAgIGJpbmRGYWNlVGV4dHVyZSggdGhhdCwgZmFjZSApO1xyXG4gICAgICAgICAgICAvLyByZW5kZXIgc2NlbmVcclxuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKFxyXG4gICAgICAgICAgICAgICAgZ2V0RmFjZUNhbWVyYSggZmFjZSwgb3JpZ2luICksXHJcbiAgICAgICAgICAgICAgICBlbnRpdGllc0J5VGVjaG5pcXVlICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQucG9wKCk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDdWJlTWFwUmVuZGVyVGFyZ2V0O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGFuIEluZGV4QnVmZmVyIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBJbmRleEJ1ZmZlclxyXG4gICAgICogQGNsYXNzZGVzYyBBbiBpbmRleCBidWZmZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBJbmRleEJ1ZmZlciggYXJyYXksIG9wdGlvbnMgKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICB0aGlzLmlkID0gMDtcclxuICAgICAgICB0aGlzLmNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9ICggb3B0aW9ucy5vZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5vZmZzZXQgOiAwO1xyXG4gICAgICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCBcIlRSSUFOR0xFU1wiO1xyXG4gICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlciApIHtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIGFyZ3VtZW50IGlzIGFscmVhZHkgYSB3ZWJnbGJ1ZmZlciwgc2ltcGx5IHdyYXAgaXRcclxuICAgICAgICAgICAgdGhpcy5pZCA9IGFycmF5O1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgXCJVTlNJR05FRF9TSE9SVFwiO1xyXG4gICAgICAgICAgICB0aGlzLmNvdW50ID0gKCBvcHRpb25zLmNvdW50ICE9PSB1bmRlZmluZWQgKSA/IG9wdGlvbnMuY291bnQgOiAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgYnVmZmVyIGl0XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJyYXkgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGxvYWQgaW5kZXggZGF0YSB0byB0aGUgR1BVLlxyXG4gICAgICogQG1lbWJlcm9mIEluZGV4QnVmZmVyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheXxVaW50MTZBcnJheXxVaW50MzJBcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgZGF0YSB0byBidWZmZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0luZGV4QnVmZmVyfSBUaGUgaW5kZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24oIGFycmF5ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgLy8gY2hlY2sgZm9yIHR5cGUgc3VwcG9ydFxyXG4gICAgICAgIHZhciB1aW50MzJzdXBwb3J0ID0gV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCBcIk9FU19lbGVtZW50X2luZGV4X3VpbnRcIiApO1xyXG4gICAgICAgIGlmKCAhdWludDMyc3VwcG9ydCApIHtcclxuICAgICAgICAgICAgLy8gbm8gc3VwcG9ydCBmb3IgdWludDMyXHJcbiAgICAgICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGFycmF5LCBidWZmZXIgdG8gdWludDE2XHJcbiAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50MTZBcnJheSggYXJyYXkgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggYXJyYXkgaW5zdGFuY2VvZiBVaW50MzJBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHVpbnQzMiwgZG93bmdyYWRlIHRvIHVpbnQxNlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCBcIkNhbm5vdCBjcmVhdGUgSW5kZXhCdWZmZXIgb2YgZm9ybWF0IFwiICtcclxuICAgICAgICAgICAgICAgICAgICBcImdsLlVOU0lHTkVEX0lOVCBhcyBPRVNfZWxlbWVudF9pbmRleF91aW50IGlzIG5vdCBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdXBwb3J0ZWQsIGRlZmF1bHRpbmcgdG8gZ2wuVU5TSUdORURfU0hPUlRcIiApO1xyXG4gICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgVWludDE2QXJyYXkoIGFycmF5ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB1aW50MzIgaXMgc3VwcG9ydGVkXHJcbiAgICAgICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGFycmF5LCBidWZmZXIgdG8gdWludDMyXHJcbiAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50MzJBcnJheSggYXJyYXkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgZGF0YSB0eXBlIGJhc2VkIG9uIGFycmF5XHJcbiAgICAgICAgaWYgKCBhcnJheSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5ICkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcIlVOU0lHTkVEX1NIT1JUXCI7XHJcbiAgICAgICAgfSBlbHNlIGlmICggYXJyYXkgaW5zdGFuY2VvZiBVaW50MzJBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJVTlNJR05FRF9JTlRcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkluZGV4QnVmZmVyIHJlcXVpcmVzIGFuIEFycmF5IG9yIFwiICtcclxuICAgICAgICAgICAgICAgIFwiQXJyYXlCdWZmZXIgYXJndW1lbnQsIGNvbW1hbmQgaWdub3JlZFwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIGJ1ZmZlciwgc3RvcmUgY291bnRcclxuICAgICAgICB0aGlzLmlkID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IGFycmF5Lmxlbmd0aDtcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5pZCApO1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBhcnJheSwgZ2wuU1RBVElDX0RSQVcgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgaW5kZXggYnVmZmVyIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBJbmRleEJ1ZmZlclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgaW5kZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaWYgdGhpcyBidWZmZXIgaXMgYWxyZWFkeSBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSB0aGlzICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuaWQgKTtcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIGluZGV4IGJ1ZmZlciBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgSW5kZXhCdWZmZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7SW5kZXhCdWZmZXJ9IFJldHVybnMgdGhlIGluZGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBJbmRleEJ1ZmZlci5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gYnVmZmVyIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCApO1xyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSB0aGUgZHJhdyBjb21tYW5kIGZvciB0aGUgYm91bmQgYnVmZmVyLlxyXG4gICAgICogQG1lbWJlcm9mIEluZGV4QnVmZmVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0luZGV4QnVmZmVyfSBSZXR1cm5zIHRoZSBpbmRleCBidWZmZXIgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgSW5kZXhCdWZmZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIF9ib3VuZEJ1ZmZlciA9PT0gbnVsbCApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCBcIk5vIEluZGV4QnVmZmVyIGlzIGJvdW5kLCBjb21tYW5kIGlnbm9yZWQuXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyhcclxuICAgICAgICAgICAgZ2xbIHRoaXMubW9kZSBdLFxyXG4gICAgICAgICAgICB0aGlzLmNvdW50LFxyXG4gICAgICAgICAgICBnbFsgdGhpcy50eXBlIF0sXHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gSW5kZXhCdWZmZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIFN0YWNrID0gcmVxdWlyZSgnLi4vdXRpbC9TdGFjaycpLFxyXG4gICAgICAgIF9zdGFjayA9IG5ldyBTdGFjaygpLFxyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgY2FjaGluZyBpdCB0byBwcmV2ZW50IHVubmVjZXNzYXJ5IHJlYmluZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtSZW5kZXJUYXJnZXR9IHJlbmRlclRhcmdldCAtIFRoZSBSZW5kZXJUYXJnZXQgb2JqZWN0IHRvIGJpbmQuXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBiaW5kKCByZW5kZXJUYXJnZXQgKSB7XHJcbiAgICAgICAgLy8gaWYgdGhpcyBidWZmZXIgaXMgYWxyZWFkeSBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSByZW5kZXJUYXJnZXQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gcmVuZGVyVGFyZ2V0LmdsO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIHJlbmRlclRhcmdldC5pZCApO1xyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IHJlbmRlclRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QuIFByZXZlbnRzIHVubmVjZXNzYXJ5IHVuYmluZGluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1JlbmRlclRhcmdldH0gcmVuZGVyVGFyZ2V0IC0gVGhlIFJlbmRlclRhcmdldCBvYmplY3QgdG8gdW5iaW5kLlxyXG4gICAgICovXHJcbiAgICAgZnVuY3Rpb24gdW5iaW5kKCByZW5kZXJUYXJnZXQgKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gYnVmZmVyIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gcmVuZGVyVGFyZ2V0LmdsO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgUmVuZGVyVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBSZW5kZXJUYXJnZXRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSByZW5kZXJUYXJnZXQgY2xhc3MgdG8gYWxsb3cgcmVuZGVyaW5nIHRvIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBSZW5kZXJUYXJnZXQoKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICB0aGlzLmlkID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzID0ge307XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgX3N0YWNrLnB1c2goIHRoaXMgKTtcclxuICAgICAgICBiaW5kKCB0aGlzICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdCBhbmQgYmluZHMgdGhlIHJlbmRlclRhcmdldCBiZW5lYXRoIGl0IG9uXHJcbiAgICAgKiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHJlbmRlclRhcmdldCwgYmluZCB0aGUgYmFja2J1ZmZlci5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0b3A7XHJcbiAgICAgICAgX3N0YWNrLnBvcCgpO1xyXG4gICAgICAgIHRvcCA9IF9zdGFjay50b3AoKTtcclxuICAgICAgICBpZiAoIHRvcCApIHtcclxuICAgICAgICAgICAgYmluZCggdG9wICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdW5iaW5kKCB0aGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHRvIHRoZSBwcm92aWRlZCBhdHRhY2htZW50IGxvY2F0aW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIGF0dGFjaG1lbnQgaW5kZXguIChvcHRpb25hbClcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQgdHlwZS4gKG9wdGlvbmFsKVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUuc2V0Q29sb3JUYXJnZXQgPSBmdW5jdGlvbiggdGV4dHVyZSwgaW5kZXgsIHRhcmdldCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGlmICggdHlwZW9mIGluZGV4ID09PSBcInN0cmluZ1wiICkge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSBpbmRleDtcclxuICAgICAgICAgICAgaW5kZXggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluZGV4ID0gKCBpbmRleCAhPT0gdW5kZWZpbmVkICkgPyBpbmRleCA6IDA7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1sgJ2NvbG9yJyArIGluZGV4IF0gPSB0ZXh0dXJlO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxyXG4gICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcclxuICAgICAgICAgICAgZ2xbICdDT0xPUl9BVFRBQ0hNRU5UJyArIGluZGV4IF0sXHJcbiAgICAgICAgICAgIGdsWyB0YXJnZXQgfHwgXCJURVhUVVJFXzJEXCIgXSxcclxuICAgICAgICAgICAgdGV4dHVyZS5pZCxcclxuICAgICAgICAgICAgMCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgdGV4dHVyZSB0byBhdHRhY2guXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5zZXREZXB0aFRhcmdldCA9IGZ1bmN0aW9uKCB0ZXh0dXJlICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlcy5kZXB0aCA9IHRleHR1cmU7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXHJcbiAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxyXG4gICAgICAgICAgICBnbC5ERVBUSF9BVFRBQ0hNRU5ULFxyXG4gICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICB0ZXh0dXJlLmlkLFxyXG4gICAgICAgICAgICAwICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGNvbG9yIGJpdHMgb2YgdGhlIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gciAtIFRoZSByZWQgdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gVGhlIGJsdWUgdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYSAtIFRoZSBhbHBoYSB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLmNsZWFyQ29sb3IgPSBmdW5jdGlvbiggciwgZywgYiwgYSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHIgPSAoIHIgIT09IHVuZGVmaW5lZCApID8gciA6IDA7XHJcbiAgICAgICAgZyA9ICggZyAhPT0gdW5kZWZpbmVkICkgPyBnIDogMDtcclxuICAgICAgICBiID0gKCBiICE9PSB1bmRlZmluZWQgKSA/IGIgOiAwO1xyXG4gICAgICAgIGEgPSAoIGEgIT09IHVuZGVmaW5lZCApID8gYSA6IDA7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuY2xlYXJDb2xvciggciwgZywgYiwgYSApO1xyXG4gICAgICAgIGdsLmNsZWFyKCBnbC5DT0xPUl9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGRlcHRoIGJpdHMgb2YgdGhlIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLmNsZWFyRGVwdGggPSBmdW5jdGlvbiggciwgZywgYiwgYSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHIgPSAoIHIgIT09IHVuZGVmaW5lZCApID8gciA6IDA7XHJcbiAgICAgICAgZyA9ICggZyAhPT0gdW5kZWZpbmVkICkgPyBnIDogMDtcclxuICAgICAgICBiID0gKCBiICE9PSB1bmRlZmluZWQgKSA/IGIgOiAwO1xyXG4gICAgICAgIGEgPSAoIGEgIT09IHVuZGVmaW5lZCApID8gYSA6IDA7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuY2xlYXJDb2xvciggciwgZywgYiwgYSApO1xyXG4gICAgICAgIGdsLmNsZWFyKCBnbC5ERVBUSF9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIHN0ZW5jaWwgYml0cyBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUuY2xlYXJTdGVuY2lsID0gZnVuY3Rpb24oIHIsIGcsIGIsIGEgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICByID0gKCByICE9PSB1bmRlZmluZWQgKSA/IHIgOiAwO1xyXG4gICAgICAgIGcgPSAoIGcgIT09IHVuZGVmaW5lZCApID8gZyA6IDA7XHJcbiAgICAgICAgYiA9ICggYiAhPT0gdW5kZWZpbmVkICkgPyBiIDogMDtcclxuICAgICAgICBhID0gKCBhICE9PSB1bmRlZmluZWQgKSA/IGEgOiAwO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoIHIsIGcsIGIsIGEgKTtcclxuICAgICAgICBnbC5jbGVhciggZ2wuU1RFTkNJTF9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgYWxsIHRoZSBiaXRzIG9mIHRoZSByZW5kZXJUYXJnZXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCByLCBnLCBiLCBhICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgciA9ICggciAhPT0gdW5kZWZpbmVkICkgPyByIDogMDtcclxuICAgICAgICBnID0gKCBnICE9PSB1bmRlZmluZWQgKSA/IGcgOiAwO1xyXG4gICAgICAgIGIgPSAoIGIgIT09IHVuZGVmaW5lZCApID8gYiA6IDA7XHJcbiAgICAgICAgYSA9ICggYSAhPT0gdW5kZWZpbmVkICkgPyBhIDogMDtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICBnbC5jbGVhckNvbG9yKCByLCBnLCBiLCBhICk7XHJcbiAgICAgICAgZ2wuY2xlYXIoIGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUIHwgZ2wuU1RFTkNJTF9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemVzIHRoZSByZW5kZXJUYXJnZXQgYW5kIGFsbCBhdHRhY2hlZCB0ZXh0dXJlcyBieSB0aGUgcHJvdmlkZWQgaGVpZ2h0XHJcbiAgICAgKiBhbmQgd2lkdGguXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIG5ldyB3aWR0aCBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSByZW5kZXJUYXJnZXQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIga2V5O1xyXG4gICAgICAgIGlmICggIXdpZHRoIHx8ICFoZWlnaHQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggXCJXaWR0aCBvciBoZWlnaHQgYXJndW1lbnRzIG1pc3NpbmcsIGNvbW1hbmQgaWdub3JlZC5cIiApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICgga2V5IGluIHRoaXMudGV4dHVyZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhpcy50ZXh0dXJlcy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzWyBrZXkgXS5yZXNpemUoIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJUYXJnZXQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIFNoYWRlclBhcnNlciA9IHJlcXVpcmUoJy4vU2hhZGVyUGFyc2VyJyksXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxyXG4gICAgICAgIFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvWEhSTG9hZGVyJyksXHJcbiAgICAgICAgU3RhY2sgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrJyksXHJcbiAgICAgICAgVU5JRk9STV9GVU5DVElPTlMgPSB7XHJcbiAgICAgICAgICAgICdib29sJzogJ3VuaWZvcm0xaScsXHJcbiAgICAgICAgICAgICdmbG9hdCc6ICd1bmlmb3JtMWYnLFxyXG4gICAgICAgICAgICAnaW50JzogJ3VuaWZvcm0xaScsXHJcbiAgICAgICAgICAgICd1aW50JzogJ3VuZmlyb20xaScsXHJcbiAgICAgICAgICAgICd2ZWMyJzogJ3VuaWZvcm0yZnYnLFxyXG4gICAgICAgICAgICAnaXZlYzInOiAndW5pZm9ybTJpdicsXHJcbiAgICAgICAgICAgICd2ZWMzJzogJ3VuaWZvcm0zZnYnLFxyXG4gICAgICAgICAgICAnaXZlYzMnOiAndW5pZm9ybTNpdicsXHJcbiAgICAgICAgICAgICd2ZWM0JzogJ3VuaWZvcm00ZnYnLFxyXG4gICAgICAgICAgICAnaXZlYzQnOiAndW5pZm9ybTRpdicsXHJcbiAgICAgICAgICAgICdtYXQyJzogJ3VuaWZvcm1NYXRyaXgyZnYnLFxyXG4gICAgICAgICAgICAnbWF0Myc6ICd1bmlmb3JtTWF0cml4M2Z2JyxcclxuICAgICAgICAgICAgJ21hdDQnOiAndW5pZm9ybU1hdHJpeDRmdicsXHJcbiAgICAgICAgICAgICdzYW1wbGVyMkQnOiAndW5pZm9ybTFpJyxcclxuICAgICAgICAgICAgJ3NhbXBsZXJDdWJlJzogJ3VuaWZvcm0xaSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9zdGFjayA9IG5ldyBTdGFjaygpLFxyXG4gICAgICAgIF9ib3VuZFNoYWRlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHaXZlbiB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlciBzb3VyY2UsIHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmdcclxuICAgICAqIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdG8gdGhlIHVuaWZvcm1zIGFuZCBhdHRyaWJ0dWVzIGRlY2xhcmVkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2ZXJ0U291cmNlIC0gVGhlIHZlcnRleCBzaGFkZXIgc291cmNlLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZyYWdTb3VyY2UgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXNGcm9tU291cmNlKCB2ZXJ0U291cmNlLCBmcmFnU291cmNlICkge1xyXG4gICAgICAgIHZhciBkZWNsYXJhdGlvbnMgPSBTaGFkZXJQYXJzZXIucGFyc2VEZWNsYXJhdGlvbnMoXHJcbiAgICAgICAgICAgICAgICBbIHZlcnRTb3VyY2UsIGZyYWdTb3VyY2UgXSxcclxuICAgICAgICAgICAgICAgIFsgJ3VuaWZvcm0nLCAnYXR0cmlidXRlJyBdKSxcclxuICAgICAgICAgICAgYXR0cmlidXRlcyA9IHt9LFxyXG4gICAgICAgICAgICB1bmlmb3JtcyA9IHt9LFxyXG4gICAgICAgICAgICBhdHRyQ291bnQgPSAwLFxyXG4gICAgICAgICAgICBkZWNsYXJhdGlvbixcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBkZWNsYXJhdGlvbiBpbiB0aGUgc2hhZGVyXHJcbiAgICAgICAgZm9yICggaT0wOyBpPGRlY2xhcmF0aW9ucy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgZGVjbGFyYXRpb24gPSBkZWNsYXJhdGlvbnNbaV07XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0cyBhbiBhdHRyaWJ1dGUgb3IgdW5pZm9ybVxyXG4gICAgICAgICAgICBpZiAoIGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ2F0dHJpYnV0ZScgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBhdHRyaWJ1dGUsIHN0b3JlIHR5cGUgYW5kIGluZGV4XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzWyBkZWNsYXJhdGlvbi5uYW1lIF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogYXR0ckNvdW50KytcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ3VuaWZvcm0nICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdW5pZm9ybSwgc3RvcmUgdHlwZSBhbmQgYnVmZmVyIGZ1bmN0aW9uIG5hbWVcclxuICAgICAgICAgICAgICAgIHVuaWZvcm1zWyBkZWNsYXJhdGlvbi5uYW1lIF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBVTklGT1JNX0ZVTkNUSU9OU1sgZGVjbGFyYXRpb24udHlwZSBdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIHVuaWZvcm1zOiB1bmlmb3Jtc1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdpdmVuIGEgc2hhZGVyIHNvdXJjZSBzdHJpbmcgYW5kIHNoYWRlciB0eXBlLCBjb21waWxlcyB0aGUgc2hhZGVyIGFuZFxyXG4gICAgICogcmV0dXJucyB0aGUgcmVzdWx0aW5nIFdlYkdMU2hhZGVyIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gZ2wgLSBUaGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2hhZGVyU291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2UuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSBzaGFkZXIgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7V2ViR0xTaGFkZXJ9IFRoZSBjb21waWxlZCBzaGFkZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjb21waWxlU2hhZGVyKCBnbCwgc2hhZGVyU291cmNlLCB0eXBlICkge1xyXG4gICAgICAgIHZhciBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoIGdsWyB0eXBlIF0gKTtcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2UoIHNoYWRlciwgc2hhZGVyU291cmNlICk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlciggc2hhZGVyICk7XHJcbiAgICAgICAgaWYgKCAhZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKCBzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTICkgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiBcIiArXHJcbiAgICAgICAgICAgICAgICBnbC5nZXRTaGFkZXJJbmZvTG9nKCBzaGFkZXIgKSApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25zIGZvciB0aGUgU2hhZGVyIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoIHNoYWRlciApIHtcclxuICAgICAgICB2YXIgZ2wgPSBzaGFkZXIuZ2wsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBzaGFkZXIuYXR0cmlidXRlcyxcclxuICAgICAgICAgICAgbmFtZTtcclxuICAgICAgICBmb3IgKCBuYW1lIGluIGF0dHJpYnV0ZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gYmluZCB0aGUgYXR0cmlidXRlIGxvY2F0aW9uXHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQXR0cmliTG9jYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhZGVyLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNbIG5hbWUgXS5pbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lICk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdCb3VuZCB2ZXJ0ZXggYXR0cmlidXRlIFxcJycgKyBuYW1lICtcclxuICAgICAgICAgICAgICAgICAgICAnXFwnIHRvIGxvY2F0aW9uICcgKyBhdHRyaWJ1dGVzWyBuYW1lIF0uaW5kZXggKTtcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBRdWVyaWVzIHRoZSB3ZWJnbCByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHVuaWZvcm0gbG9jYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0VW5pZm9ybUxvY2F0aW9ucyggc2hhZGVyICkge1xyXG4gICAgICAgIHZhciBnbCA9IHNoYWRlci5nbCxcclxuICAgICAgICAgICAgdW5pZm9ybXMgPSBzaGFkZXIudW5pZm9ybXMsXHJcbiAgICAgICAgICAgIHVuaWZvcm0sXHJcbiAgICAgICAgICAgIG5hbWU7XHJcbiAgICAgICAgZm9yICggbmFtZSBpbiB1bmlmb3JtcyApIHtcclxuICAgICAgICAgICAgaWYgKCB1bmlmb3Jtcy5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xyXG4gICAgICAgICAgICAgICAgdW5pZm9ybSA9IHVuaWZvcm1zWyBuYW1lIF07XHJcbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIHVuaWZvcm0gbG9jYXRpb25cclxuICAgICAgICAgICAgICAgIHVuaWZvcm0ubG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oIHNoYWRlci5pZCwgbmFtZSApO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBuYW1lICsgXCIsIFwiICtcclxuICAgICAgICAgICAgICAgICAgICBnbC5nZXRVbmlmb3JtTG9jYXRpb24oIHNoYWRlci5pZCwgbmFtZSApICsgXCIsXCIgKTtcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBzaGFkZXIgc291cmNlIGZyb20gYSB1cmwuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gbG9hZCB0aGUgcmVzb3VyY2UgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBsb2FkIHRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsb2FkU2hhZGVyU291cmNlKCB1cmwgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICBYSFJMb2FkZXIubG9hZChcclxuICAgICAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGRvbmVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgc291cmNlIG9mIHRoZSBzaGFkZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXNzVGhyb3VnaFNvdXJjZSggc291cmNlICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgZG9uZSggc291cmNlICk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGFuIGFycmF5IG9mIEdMU0wgc291cmNlIHN0cmluZ3MgYW5kIFVSTHMsXHJcbiAgICAgKiBhbmQgcmVzb2x2ZXMgdGhlbSBpbnRvIGFuZCBhcnJheSBvZiBHTFNMIHNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVNvdXJjZXMoIHNvdXJjZXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICB2YXIgam9icyA9IFtdO1xyXG4gICAgICAgICAgICBzb3VyY2VzID0gc291cmNlcyB8fCBbXTtcclxuICAgICAgICAgICAgc291cmNlcyA9ICggISggc291cmNlcyBpbnN0YW5jZW9mIEFycmF5ICkgKSA/IFsgc291cmNlcyBdIDogc291cmNlcztcclxuICAgICAgICAgICAgc291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggc291cmNlICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBTaGFkZXJQYXJzZXIuaXNHTFNMKCBzb3VyY2UgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goIHBhc3NUaHJvdWdoU291cmNlKCBzb3VyY2UgKSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goIGxvYWRTaGFkZXJTb3VyY2UoIHNvdXJjZSApICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbiggcmVzdWx0cyApIHtcclxuICAgICAgICAgICAgICAgIGRvbmUoIHJlc3VsdHMgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0LCBjYWNoaW5nIGl0IHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgcmViaW5kcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QgdG8gYmluZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYmluZCggc2hhZGVyICkge1xyXG4gICAgICAgIC8vIGlmIHRoaXMgc2hhZGVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZFNoYWRlciA9PT0gc2hhZGVyICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYWRlci5nbC51c2VQcm9ncmFtKCBzaGFkZXIuaWQgKTtcclxuICAgICAgICBfYm91bmRTaGFkZXIgPSBzaGFkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0LiBQcmV2ZW50cyB1bm5lY2Vzc2FyeSB1bmJpbmRpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0IHRvIHVuYmluZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdW5iaW5kKCBzaGFkZXIgKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gc2hhZGVyIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRTaGFkZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhZGVyLmdsLnVzZVByb2dyYW0oIG51bGwgKTtcclxuICAgICAgICBfYm91bmRTaGFkZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBzaGFkZXIgYXR0cmlidXRlcyBkdWUgdG8gYWJvcnRpbmcgb2YgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhYm9ydFNoYWRlciggc2hhZGVyICkge1xyXG4gICAgICAgIHNoYWRlci5pZCA9IG51bGw7XHJcbiAgICAgICAgc2hhZGVyLmF0dHJpYnV0ZXMgPSBudWxsO1xyXG4gICAgICAgIHNoYWRlci51bmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFNoYWRlciBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgU2hhZGVyXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgc2hhZGVyIGNsYXNzIHRvIGFzc2lzdCBpbiBjb21waWxpbmcgYW5kIGxpbmtpbmcgd2ViZ2xcclxuICAgICAqIHNoYWRlcnMsIHN0b3JpbmcgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGxvY2F0aW9ucywgYW5kIGJ1ZmZlcmluZyB1bmlmb3Jtcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU2hhZGVyKCBzcGVjLCBjYWxsYmFjayApIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5pZCA9IDA7XHJcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICB0aGlzLnZlcnNpb24gPSBzcGVjLnZlcnNpb24gfHwgJzEuMDAnO1xyXG4gICAgICAgIC8vIGNoZWNrIHNvdXJjZSBhcmd1bWVudHNcclxuICAgICAgICBpZiAoICFzcGVjLnZlcnQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiVmVydGV4IHNoYWRlciBhcmd1bWVudCBoYXMgbm90IGJlZW4gcHJvdmlkZWQsIFwiICtcclxuICAgICAgICAgICAgICAgIFwic2hhZGVyIGluaXRpYWxpemF0aW9uIGFib3J0ZWQuXCIgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhc3BlYy5mcmFnICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkZyYWdtZW50IHNoYWRlciBhcmd1bWVudCBoYXMgbm90IGJlZW4gcHJvdmlkZWQsIFwiICtcclxuICAgICAgICAgICAgICAgIFwic2hhZGVyIGluaXRpYWxpemF0aW9uIGFib3J0ZWQuXCIgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBzaGFkZXJcclxuICAgICAgICBVdGlsLmFzeW5jKHtcclxuICAgICAgICAgICAgY29tbW9uOiByZXNvbHZlU291cmNlcyggc3BlYy5jb21tb24gKSxcclxuICAgICAgICAgICAgdmVydDogcmVzb2x2ZVNvdXJjZXMoIHNwZWMudmVydCApLFxyXG4gICAgICAgICAgICBmcmFnOiByZXNvbHZlU291cmNlcyggc3BlYy5mcmFnICksXHJcbiAgICAgICAgfSwgZnVuY3Rpb24oIHNoYWRlcnMgKSB7XHJcbiAgICAgICAgICAgIHRoYXQuY3JlYXRlKCBzaGFkZXJzICk7XHJcbiAgICAgICAgICAgIGlmICggY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggdGhhdCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBzaGFkZXIgb2JqZWN0IGZyb20gc291cmNlIHN0cmluZ3MuIFRoaXMgaW5jbHVkZXM6XHJcbiAgICAgKiAgICAxKSBDb21waWxpbmcgYW5kIGxpbmtpbmcgdGhlIHNoYWRlciBwcm9ncmFtLlxyXG4gICAgICogICAgMikgUGFyc2luZyBzaGFkZXIgc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXHJcbiAgICAgKiAgICAzKSBCaW5kaW5nIGF0dHJpYnV0ZSBsb2NhdGlvbnMsIGJ5IG9yZGVyIG9mIGRlbGNhcmF0aW9uLlxyXG4gICAgICogICAgNCkgUXVlcnlpbmcgYW5kIHN0b3JpbmcgdW5pZm9ybSBsb2NhdGlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2hhZGVycyAtIEEgbWFwIGNvbnRhaW5pbmcgc291cmNlcyB1bmRlciAndmVydCcgYW5kXHJcbiAgICAgKiAgICAgJ2ZyYWcnIGF0dHJpYnV0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgU2hhZGVyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiggc2hhZGVycyApIHtcclxuICAgICAgICAvLyBvbmNlIGFsbCBzaGFkZXIgc291cmNlcyBhcmUgbG9hZGVkXHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCxcclxuICAgICAgICAgICAgY29tbW9uID0gc2hhZGVycy5jb21tb24uam9pbiggXCJcIiApLFxyXG4gICAgICAgICAgICB2ZXJ0ID0gc2hhZGVycy52ZXJ0LmpvaW4oIFwiXCIgKSxcclxuICAgICAgICAgICAgZnJhZyA9IHNoYWRlcnMuZnJhZy5qb2luKCBcIlwiICksXHJcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcixcclxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXIsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNBbmRVbmlmb3JtcztcclxuICAgICAgICAvLyBjb21waWxlIHNoYWRlcnNcclxuICAgICAgICB2ZXJ0ZXhTaGFkZXIgPSBjb21waWxlU2hhZGVyKCBnbCwgY29tbW9uICsgdmVydCwgXCJWRVJURVhfU0hBREVSXCIgKTtcclxuICAgICAgICBmcmFnbWVudFNoYWRlciA9IGNvbXBpbGVTaGFkZXIoIGdsLCBjb21tb24gKyBmcmFnLCBcIkZSQUdNRU5UX1NIQURFUlwiICk7XHJcbiAgICAgICAgaWYgKCAhdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlciApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJBYm9ydGluZyBpbnN0YW50aWF0aW9uIG9mIHNoYWRlciBkdWUgdG8gY29tcGlsYXRpb24gZXJyb3JzLlwiICk7XHJcbiAgICAgICAgICAgIHJldHVybiBhYm9ydFNoYWRlciggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwYXJzZSBzb3VyY2UgZm9yIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybXNcclxuICAgICAgICBhdHRyaWJ1dGVzQW5kVW5pZm9ybXMgPSBnZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXNGcm9tU291cmNlKCB2ZXJ0LCBmcmFnICk7XHJcbiAgICAgICAgLy8gc2V0IG1lbWJlciBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlc0FuZFVuaWZvcm1zLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtcyA9IGF0dHJpYnV0ZXNBbmRVbmlmb3Jtcy51bmlmb3JtcztcclxuICAgICAgICAvLyBjcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICAgICAgdGhpcy5pZCA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICAvLyBhdHRhY2ggdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXJzXHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKCB0aGlzLmlkLCB2ZXJ0ZXhTaGFkZXIgKTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoIHRoaXMuaWQsIGZyYWdtZW50U2hhZGVyICk7XHJcbiAgICAgICAgLy8gYmluZCB2ZXJ0ZXggYXR0cmlidXRlIGxvY2F0aW9ucyBCRUZPUkUgbGlua2luZ1xyXG4gICAgICAgIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoIHRoaXMgKTtcclxuICAgICAgICAvLyBsaW5rIHNoYWRlclxyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKCB0aGlzLmlkICk7XHJcbiAgICAgICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcclxuICAgICAgICBpZiAoICFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKCB0aGlzLmlkLCBnbC5MSU5LX1NUQVRVUyApICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkFuIGVycm9yIG9jY3VyZWQgbGlua2luZyB0aGUgc2hhZGVyOiBcIiArXHJcbiAgICAgICAgICAgICAgICBnbC5nZXRQcm9ncmFtSW5mb0xvZyggdGhpcy5pZCApICk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiQWJvcnRpbmcgaW5zdGFudGlhdGlvbiBvZiBzaGFkZXIgZHVlIHRvIGxpbmtpbmcgZXJyb3JzLlwiICk7XHJcbiAgICAgICAgICAgIHJldHVybiBhYm9ydFNoYWRlciggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgc2hhZGVyIHVuaWZvcm0gbG9jYXRpb25zXHJcbiAgICAgICAgZ2V0VW5pZm9ybUxvY2F0aW9ucyggdGhpcyApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0IGFuZCBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBzdGFjay5cclxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBTaGFkZXIucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBfc3RhY2sucHVzaCggdGhpcyApO1xyXG4gICAgICAgIGJpbmQoIHRoaXMgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0IGFuZCBiaW5kcyB0aGUgc2hhZGVyIGJlbmVhdGggaXQgb25cclxuICAgICAqIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgc2hhZGVyLCBiaW5kIHRoZSBiYWNrYnVmZmVyLlxyXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFNoYWRlci5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRvcDtcclxuICAgICAgICBfc3RhY2sucG9wKCk7XHJcbiAgICAgICAgdG9wID0gX3N0YWNrLnRvcCgpO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBiaW5kKCB0b3AgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1bmJpbmQoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVmZmVyIGEgdW5pZm9ybSB2YWx1ZSBieSBuYW1lLlxyXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1bmlmb3JtTmFtZSAtIFRoZSB1bmlmb3JtIG5hbWUgaW4gdGhlIHNoYWRlciBzb3VyY2UuXHJcbiAgICAgKiBAcGFyYW0geyp9IHVuaWZvcm0gLSBUaGUgdW5pZm9ybSB2YWx1ZSB0byBidWZmZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtID0gZnVuY3Rpb24oIHVuaWZvcm1OYW1lLCB1bmlmb3JtICkge1xyXG4gICAgICAgIGlmICggIXRoaXMuaWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkF0dGVtcHRpbmcgdG8gdXNlIGFuIGluY29tcGxldGUgc2hhZGVyLCBpZ25vcmluZyBjb21tYW5kLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdW5pZm9ybVNwZWMgPSB0aGlzLnVuaWZvcm1zWyB1bmlmb3JtTmFtZSBdLFxyXG4gICAgICAgICAgICBmdW5jLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbixcclxuICAgICAgICAgICAgdmFsdWU7XHJcbiAgICAgICAgLy8gZW5zdXJlIHRoYXQgdGhlIHVuaWZvcm0gc3BlYyBleGlzdHMgZm9yIHRoZSBuYW1lXHJcbiAgICAgICAgaWYgKCAhdW5pZm9ybVNwZWMgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggJ05vIHVuaWZvcm0gZm91bmQgdW5kZXIgbmFtZSBcIicgKyB1bmlmb3JtTmFtZSArXHJcbiAgICAgICAgICAgICAgICAnXCIsIGNvbW1hbmQgaWdub3JlZCcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBhcmd1bWVudCBpcyBkZWZpbmVkXHJcbiAgICAgICAgaWYgKCB1bmlmb3JtID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggJ0FyZ3VtZW50IHBhc3NlZCBmb3IgdW5pZm9ybSBcIicgKyB1bmlmb3JtTmFtZSArXHJcbiAgICAgICAgICAgICAgICAnXCIgaXMgdW5kZWZpbmVkLCBjb21tYW5kIGlnbm9yZWQnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZ2V0IHRoZSB1bmlmb3JtIGxvY2F0aW9uLCB0eXBlLCBhbmQgYnVmZmVyIGZ1bmN0aW9uXHJcbiAgICAgICAgZnVuYyA9IHVuaWZvcm1TcGVjLmZ1bmM7XHJcbiAgICAgICAgdHlwZSA9IHVuaWZvcm1TcGVjLnR5cGU7XHJcbiAgICAgICAgbG9jYXRpb24gPSB1bmlmb3JtU3BlYy5sb2NhdGlvbjtcclxuICAgICAgICB2YWx1ZSA9IHVuaWZvcm0udG9BcnJheSA/IHVuaWZvcm0udG9BcnJheSgpIDogdW5pZm9ybTtcclxuICAgICAgICB2YWx1ZSA9ICggdmFsdWUgaW5zdGFuY2VvZiBBcnJheSApID8gbmV3IEZsb2F0MzJBcnJheSggdmFsdWUgKSA6IHZhbHVlO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgYm9vbGVhbidzIHRvIDAgb3IgMVxyXG4gICAgICAgIHZhbHVlID0gKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiICkgPyAoIHZhbHVlID8gMSA6IDAgKSA6IHZhbHVlO1xyXG4gICAgICAgIC8vIHBhc3MgdGhlIGFyZ3VtZW50cyBkZXBlbmRpbmcgb24gdGhlIHR5cGVcclxuICAgICAgICBzd2l0Y2ggKCB0eXBlICkge1xyXG4gICAgICAgICAgICBjYXNlICdtYXQyJzpcclxuICAgICAgICAgICAgY2FzZSAnbWF0Myc6XHJcbiAgICAgICAgICAgIGNhc2UgJ21hdDQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbFsgZnVuYyBdKCBsb2NhdGlvbiwgZmFsc2UsIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xbIGZ1bmMgXSggbG9jYXRpb24sIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gU2hhZGVyO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgUFJFQ0lTSU9OX1FVQUxJRklFUlMgPSB7XHJcbiAgICAgICAgaGlnaHA6IHRydWUsXHJcbiAgICAgICAgbWVkaXVtcDogdHJ1ZSxcclxuICAgICAgICBsb3dwOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBzdGFuZGFyZCBjb21tZW50cyBmcm9tIHRoZSBwcm92aWRlZCBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc3RyaXAgY29tbWVudHMgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb21tZW50bGVzcyBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHN0cmlwQ29tbWVudHMoIHN0ciApIHtcclxuICAgICAgICAvLyByZWdleCBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb2Fncml1cy9zdHJpcGNvbW1lbnRzXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXFwvXFwqKFtcXHNcXFNdKj8pXFwqXFwvKXwoXFwvXFwvKC4qKSQpL2dtLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbGwgd2hpdGVzcGFjZSBpbnRvIGEgc2luZ2xlICcgJyBzcGFjZSBjaGFyYWN0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gbm9ybWFsaXplIHdoaXRlc3BhY2UgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBub3JtYWxpemVkIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplV2hpdGVzcGFjZSggc3RyICkge1xyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZW5kIGxpbmVzLCByZXBsYWNlIGFsbCB3aGl0ZXNwYWNlIHdpdGggYSBzaW5nbGUgJyAnIHNwYWNlXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vZywgJyAnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyBhIHNpbmdsZSAnc3RhdGVtZW50Jy4gQSAnc3RhdGVtZW50JyBpcyBjb25zaWRlcmVkIGFueSBzZXF1ZW5jZSBvZlxyXG4gICAgICogY2hhcmFjdGVycyBmb2xsb3dlZCBieSBhIHNlbWktY29sb24uIFRoZXJlZm9yZSwgYSBzaW5nbGUgJ3N0YXRlbWVudCcgaW5cclxuICAgICAqIHRoaXMgc2Vuc2UgY291bGQgY29udGFpbiBzZXZlcmFsIGNvbW1hIHNlcGFyYXRlZCBkZWNsYXJhdGlvbnMuIFJldHVybnNcclxuICAgICAqIGFsbCByZXN1bHRpbmcgZGVjbGFyYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZW1lbnQgLSBUaGUgc3RhdGVtZW50IHRvIHBhcnNlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIHBhcnNlZCBkZWNsYXJhdGlvbiBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZVN0YXRlbWVudCggc3RhdGVtZW50ICkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZU5hbWVBbmRDb3VudCggZW50cnkgKSB7XHJcbiAgICAgICAgICAgIC8vIHNwbGl0IG9uICdbXScgYW5kIHRyaW0gd2hpdGVzcGNlIHRvIGNoZWNrIGZvciBhcnJheXNcclxuICAgICAgICAgICAgdmFyIHNwbGl0ID0gZW50cnkuc3BsaXQoL1tcXFtcXF1dLykubWFwKCBmdW5jdGlvbiggZWxlbSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtLnRyaW0oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBxdWFsaWZpZXI6IHF1YWxpZmllcixcclxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogcHJlY2lzaW9uLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHNwbGl0WzBdLFxyXG4gICAgICAgICAgICAgICAgY291bnQ6ICggc3BsaXRbMV0gPT09IHVuZGVmaW5lZCApID8gMSA6IHBhcnNlSW50KCBzcGxpdFsxXSwgMTAgKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXSxcclxuICAgICAgICAgICAgY29tbWFTcGxpdCxcclxuICAgICAgICAgICAgaGVhZGVyLFxyXG4gICAgICAgICAgICBxdWFsaWZpZXIsXHJcbiAgICAgICAgICAgIHByZWNpc2lvbixcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgbmFtZXMsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gc3BsaXQgc3RhdGVtZW50IG9uIGNvbW1hc1xyXG4gICAgICAgIGNvbW1hU3BsaXQgPSBzdGF0ZW1lbnQuc3BsaXQoJywnKS5tYXAoIGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbS50cmltKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gc3BsaXQgZGVjbGFyYXRpb24gaGVhZGVyIGZyb20gc3RhdGVtZW50XHJcbiAgICAgICAgaGVhZGVyID0gY29tbWFTcGxpdC5zaGlmdCgpLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgLy8gcXVhbGlmaWVyIGlzIGFsd2F5cyBmaXJzdCBlbGVtZW50XHJcbiAgICAgICAgcXVhbGlmaWVyID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gcHJlY2lzaW9uIG1heSBvciBtYXkgbm90IGJlIGRlY2xhcmVkXHJcbiAgICAgICAgcHJlY2lzaW9uID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gaWYgbm90IGEgcHJlY2lzaW9uIGtleXdvcmQgaXQgaXMgdGhlIHR5cGUgaW5zdGVhZFxyXG4gICAgICAgIGlmICggIVBSRUNJU0lPTl9RVUFMSUZJRVJTWyBwcmVjaXNpb24gXSApIHtcclxuICAgICAgICAgICAgdHlwZSA9IHByZWNpc2lvbjtcclxuICAgICAgICAgICAgcHJlY2lzaW9uID0gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0eXBlID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNwbGl0IHJlbWFpbmluZyBuYW1lcyBieSBjb21tYXMgYW5kIHRyaW0gd2hpdGVzcGFjZVxyXG4gICAgICAgIG5hbWVzID0gaGVhZGVyLmNvbmNhdCggY29tbWFTcGxpdCApO1xyXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBvdGhlciBuYW1lcyBhZnRlciBhICcsJyBhZGQgdGhlbSBhcyB3ZWxsXHJcbiAgICAgICAgZm9yICggaT0wOyBpPG5hbWVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goIHBhcnNlTmFtZUFuZENvdW50KCBuYW1lc1tpXSApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BsaXRzIHRoZSBzb3VyY2Ugc3RyaW5nIGJ5IHNlbWktY29sb25zIGFuZCBjb25zdHJ1Y3RzIGFuIGFycmF5IG9mXHJcbiAgICAgKiBkZWNsYXJhdGlvbiBvYmplY3RzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIga2V5d29yZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBrZXl3b3JkIC0gVGhlIHF1YWxpZmllciBkZWNsYXJhdGlvbiBrZXl3b3JkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIHF1YWxpZmllciBkZWNsYXJhdGlvbiBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZVNvdXJjZSggc291cmNlLCBrZXl3b3JkICkge1xyXG4gICAgICAgIC8vIGdldCBzdGF0ZW1lbnRzICggYW55IHNlcXVlbmNlIGVuZGluZyBpbiA7ICkgY29udGFpbmluZyBhbnlcclxuICAgICAgICAvLyBvZiB0aGUgZ2l2ZW4ga2V5d29yZHNcclxuICAgICAgICB2YXIga2V5d29yZFN0ciA9ICgga2V5d29yZCBpbnN0YW5jZW9mIEFycmF5ICkgPyBrZXl3b3JkLmpvaW4oJ3wnKSA6IGtleXdvcmQsXHJcbiAgICAgICAgICAgIGtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXi4qXFxcXGIoXCIra2V5d29yZFN0citcIilcXFxcYi4qXCIsICdnbScgKSxcclxuICAgICAgICAgICAgY29tbWVudGxlc3NTb3VyY2UgPSBzdHJpcENvbW1lbnRzKCBzb3VyY2UgKSxcclxuICAgICAgICAgICAgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVdoaXRlc3BhY2UoIGNvbW1lbnRsZXNzU291cmNlICksXHJcbiAgICAgICAgICAgIHN0YXRlbWVudHMgPSBub3JtYWxpemVkLnNwbGl0KCc7JyksXHJcbiAgICAgICAgICAgIG1hdGNoZWQgPSBbXSxcclxuICAgICAgICAgICAgbWF0Y2gsIGk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggc3RhdGVtZW50XHJcbiAgICAgICAgZm9yICggaT0wOyBpPHN0YXRlbWVudHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb2sgZm9yIGtleXdvcmRzXHJcbiAgICAgICAgICAgIG1hdGNoID0gc3RhdGVtZW50c1tpXS50cmltKCkubWF0Y2goIGtleXdvcmRSZWdleCApO1xyXG4gICAgICAgICAgICBpZiAoIG1hdGNoICkge1xyXG4gICAgICAgICAgICAgICAgLy8gcGFyc2Ugc3RhdGVtZW50IGFuZCBhZGQgdG8gYXJyYXlcclxuICAgICAgICAgICAgICAgIG1hdGNoZWQgPSBtYXRjaGVkLmNvbmNhdCggcGFyc2VTdGF0ZW1lbnQoIG1hdGNoWzBdICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0Y2hlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbHRlcnMgb3V0IGR1cGxpY2F0ZSBkZWNsYXJhdGlvbnMgcHJlc2VudCBiZXR3ZWVuIHNoYWRlcnMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gZGVjbGFyYXRpb25zIC0gVGhlIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmaWx0ZXJlZCBhcnJheSBvZiBkZWNsYXJhdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZpbHRlckR1cGxpY2F0ZXNCeU5hbWUoIGRlY2xhcmF0aW9ucyApIHtcclxuICAgICAgICAvLyBpbiBjYXNlcyB3aGVyZSB0aGUgc2FtZSBkZWNsYXJhdGlvbnMgYXJlIHByZXNlbnQgaW4gbXVsdGlwbGVcclxuICAgICAgICAvLyBzb3VyY2VzLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSB0aGUgcmVzdWx0c1xyXG4gICAgICAgIHZhciBzZWVuID0ge307XHJcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBkZWNsYXJhdGlvbiApIHtcclxuICAgICAgICAgICAgaWYgKCBzZWVuWyBkZWNsYXJhdGlvbi5uYW1lIF0gKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VlblsgZGVjbGFyYXRpb24ubmFtZSBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyB0aGUgcHJvdmlkZWQgR0xTTCBzb3VyY2UsIGFuZCByZXR1cm5zIGFsbCBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzXHJcbiAgICAgICAgICogdGhhdCBjb250YWluIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIgdHlwZS4gVGhpcyBjYW4gYmUgdXNlZCB0byBleHRyYWN0XHJcbiAgICAgICAgICogYWxsIGF0dHJpYnV0ZXMgYW5kIHVuaWZvcm0gbmFtZXMgYW5kIHR5cGVzIGZyb20gYSBzaGFkZXIuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBGb3IgZXhhbXBsZSwgd2hlbiBwcm92aWRlZCBhIFwidW5pZm9ybVwiIHF1YWxpZmllcnMsIHRoZSBkZWNsYXJhdGlvbjpcclxuICAgICAgICAgKiA8cHJlPlxyXG4gICAgICAgICAqICAgICBcInVuaWZvcm0gaGlnaHAgdmVjMyB1U3BlY3VsYXJDb2xvcjtcIlxyXG4gICAgICAgICAqIDwvcHJlPlxyXG4gICAgICAgICAqIFdvdWxkIGJlIHBhcnNlZCB0bzpcclxuICAgICAgICAgKiA8cHJlPlxyXG4gICAgICAgICAqICAgICB7XHJcbiAgICAgICAgICogICAgICAgICBxdWFsaWZpZXI6IFwidW5pZm9ybVwiLFxyXG4gICAgICAgICAqICAgICAgICAgdHlwZTogXCJ2ZWMzXCIsXHJcbiAgICAgICAgICogICAgICAgICBuYW1lOiBcInVTcGVjdWxhckNvbG9yXCIsXHJcbiAgICAgICAgICogICAgICAgICBjb3VudDogMVxyXG4gICAgICAgICAqICAgICB9XHJcbiAgICAgICAgICogPC9wcmU+XHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlcy5cclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcXVhbGlmaWVycyAtIFRoZSBxdWFsaWZpZXJzIHRvIGV4dHJhY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBvZiBxdWFsaWZpZXIgZGVjbGFyYXRpb24gc3RhdGVtZW50cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwYXJzZURlY2xhcmF0aW9uczogZnVuY3Rpb24oIHNvdXJjZSwgcXVhbGlmaWVycyApIHtcclxuICAgICAgICAgICAgLy8gaWYgbm8gcXVhbGlmaWVycyBhcmUgcHJvdmlkZWQsIHJldHVybiBlbXB0eSBhcnJheVxyXG4gICAgICAgICAgICBpZiAoICFxdWFsaWZpZXJzIHx8IHF1YWxpZmllcnMubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2VzID0gKCBzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSApID8gc291cmNlIDogWyBzb3VyY2UgXSxcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPHNvdXJjZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnMuY29uY2F0KCBwYXJzZVNvdXJjZSggc291cmNlc1tpXSwgcXVhbGlmaWVycyApICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGR1cGxpY2F0ZXMgYW5kIHJldHVyblxyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyRHVwbGljYXRlc0J5TmFtZSggZGVjbGFyYXRpb25zICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGV0ZWN0cyBiYXNlZCBvbiB0aGUgZXhpc3RlbmNlIG9mIGEgJ3ZvaWQgbWFpbigpIHsnIHN0YXRlbWVudCwgaWZcclxuICAgICAgICAgKiB0aGUgc3RyaW5nIGlzIGdsc2wgc291cmNlIGNvZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIGlucHV0IHN0cmluZyB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGdsc2wgY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc0dMU0w6IGZ1bmN0aW9uKCBzdHIgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvdm9pZFxccyttYWluXFxzKlxcKFxccypcXClcXHMqLy50ZXN0KCBzdHIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxyXG4gICAgICAgIFN0YWNrID0gcmVxdWlyZSgnLi4vdXRpbC9TdGFjaycpLFxyXG4gICAgICAgIF9zdGFjayA9IHt9LFxyXG4gICAgICAgIF9ib3VuZFRleHR1cmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIHByb3ZpZGVkIGltYWdlIGRpbWVuc2lvbnMgYXJlIG5vdCBwb3dlcnMgb2YgdHdvLCBpdCB3aWxsIHJlZHJhd1xyXG4gICAgICogdGhlIGltYWdlIHRvIHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgLSBUaGUgaW1hZ2Ugb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtIVE1MSW1hZ2VFbGVtZW50fSBUaGUgbmV3IGltYWdlIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZW5zdXJlUG93ZXJPZlR3byggaW1hZ2UgKSB7XHJcbiAgICAgICAgaWYgKCAhVXRpbC5pc1Bvd2VyT2ZUd28oIGltYWdlLndpZHRoICkgfHxcclxuICAgICAgICAgICAgIVV0aWwuaXNQb3dlck9mVHdvKCBpbWFnZS5oZWlnaHQgKSApIHtcclxuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiY2FudmFzXCIgKTtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28oIGltYWdlLndpZHRoICk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byggaW1hZ2UuaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgaW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAwLCAwLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIDAsIDAsXHJcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNhbnZhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIGEgbG9jYXRpb24gYW5kIGFjdGl2YXRlcyB0aGUgdGV4dHVyZSB1bml0XHJcbiAgICAgKiB3aGlsZSBjYWNoaW5nIGl0IHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgcmViaW5kcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZSAtIFRoZSBUZXh0dXJlMkQgb2JqZWN0IHRvIGJpbmQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBiaW5kKCB0ZXh0dXJlLCBsb2NhdGlvbiApIHtcclxuICAgICAgICAvLyBpZiB0aGlzIGJ1ZmZlciBpcyBhbHJlYWR5IGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRUZXh0dXJlID09PSB0ZXh0dXJlICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRleHR1cmUuZ2w7XHJcbiAgICAgICAgbG9jYXRpb24gPSBnbFsgJ1RFWFRVUkUnICsgbG9jYXRpb24gXSB8fCBnbC5URVhUVVJFMDtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLmlkICk7XHJcbiAgICAgICAgX2JvdW5kVGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdC4gUHJldmVudHMgdW5uZWNlc3NhcnkgdW5iaW5kaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIFRleHR1cmUyRCBvYmplY3QgdG8gdW5iaW5kLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1bmJpbmQoIHRleHR1cmUgKSB7XHJcbiAgICAgICAgLy8gaWYgbm8gYnVmZmVyIGlzIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRUZXh0dXJlID09PSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRleHR1cmUuZ2w7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcclxuICAgICAgICBfYm91bmRUZXh0dXJlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmUyRCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVGV4dHVyZTJEXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCB0ZXh0dXJlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBUZXh0dXJlMkQoIHNwZWMsIGNhbGxiYWNrICkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAvLyBkZWZhdWx0XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICAvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3RcclxuICAgICAgICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy53cmFwID0gc3BlYy53cmFwIHx8IFwiUkVQRUFUXCI7XHJcbiAgICAgICAgdGhpcy5maWx0ZXIgPSBzcGVjLmZpbHRlciB8fCBcIkxJTkVBUlwiO1xyXG4gICAgICAgIHRoaXMuaW52ZXJ0WSA9IHNwZWMuaW52ZXJ0WSAhPT0gdW5kZWZpbmVkID8gc3BlYy5pbnZlcnRZIDogdHJ1ZTtcclxuICAgICAgICAvLyBidWZmZXIgdGhlIHRleHR1cmUgYmFzZWQgb24gYXJndW1lbnRzXHJcbiAgICAgICAgaWYgKCBzcGVjLmltYWdlICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgSW1hZ2Ugb2JqZWN0XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggc3BlYy5pbWFnZSApO1xyXG4gICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnMoIHRoaXMgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCBzcGVjLnVybCApIHtcclxuICAgICAgICAgICAgLy8gcmVxdWVzdCBpbWFnZSBzb3VyY2UgZnJvbSB1cmxcclxuICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5idWZmZXJEYXRhKCBpbWFnZSApO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zZXRQYXJhbWV0ZXJzKCB0aGF0ICk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggdGhhdCApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpbWFnZS5zcmMgPSBzcGVjLnVybDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBidWZmZXIgZGF0YVxyXG4gICAgICAgICAgICBpZiAoIHNwZWMuZm9ybWF0ID09PSBcIkRFUFRIX0NPTVBPTkVOVFwiICkge1xyXG4gICAgICAgICAgICAgICAgLy8gZGVwdGggdGV4dHVyZVxyXG4gICAgICAgICAgICAgICAgdmFyIGRlcHRoVGV4dHVyZUV4dCA9IFdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbiggXCJXRUJHTF9kZXB0aF90ZXh0dXJlXCIgKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhZGVwdGhUZXh0dXJlRXh0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIkNhbm5vdCBjcmVhdGUgVGV4dHVyZTJEIG9mIGZvcm1hdCBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZ2wuREVQVEhfQ09NUE9ORU5UIGFzIFdFQkdMX2RlcHRoX3RleHR1cmUgaXMgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInVuc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3NlciwgY29tbWFuZCBpZ25vcmVkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdCA9IHNwZWMuZm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCAhc3BlYy50eXBlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgc3BlYy50eXBlID09PSBcIlVOU0lHTkVEX1NIT1JUXCIgfHxcclxuICAgICAgICAgICAgICAgICAgICBzcGVjLnR5cGUgPT09IFwiVU5TSUdORURfSU5UXCIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gc3BlYy50eXBlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJEZXB0aCB0ZXh0dXJlcyBkbyBub3Qgc3VwcG9ydCB0eXBlJ1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BlYy50eXBlICsgXCInLCBkZWZhdWx0aW5nIHRvICdVTlNJR05FRF9TSE9SVCcuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiVU5TSUdORURfU0hPUlRcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG90aGVyXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdCA9IHNwZWMuZm9ybWF0IHx8IFwiUkdCQVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID0gc3BlYy50eXBlIHx8IFwiVU5TSUdORURfQllURVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxGb3JtYXQgPSB0aGlzLmZvcm1hdDsgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxyXG4gICAgICAgICAgICB0aGlzLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoIHNwZWMuZGF0YSB8fCBudWxsLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCApO1xyXG4gICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnMoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIHN0YWNrLlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmUyRFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmUyRC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0gPSBfc3RhY2tbIGxvY2F0aW9uIF0gfHwgbmV3IFN0YWNrKCk7XHJcbiAgICAgICAgX3N0YWNrWyBsb2NhdGlvbiBdLnB1c2goIHRoaXMgKTtcclxuICAgICAgICBiaW5kKCB0aGlzLCBsb2NhdGlvbiApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IGFuZCBiaW5kcyB0aGUgdGV4dHVyZSBiZW5lYXRoIGl0IG9uXHJcbiAgICAgKiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHRleHR1cmUsIHVuYmluZHMgdGhlIHVuaXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XHJcbiAgICAgICAgdmFyIHRvcDtcclxuICAgICAgICBpZiAoICFfc3RhY2tbIGxvY2F0aW9uIF0gKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggXCJObyB0ZXh0dXJlIHdhcyBib3VuZCB0byB0ZXh0dXJlIHVuaXQgJ1wiICsgbG9jYXRpb24gK1xyXG4gICAgICAgICAgICAgICAgXCInLiBDb21tYW5kIGlnbm9yZWQuXCIgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX3N0YWNrWyBsb2NhdGlvbiBdLnBvcCgpO1xyXG4gICAgICAgIHRvcCA9IF9zdGFja1sgbG9jYXRpb24gXS50b3AoKTtcclxuICAgICAgICBpZiAoIHRvcCApIHtcclxuICAgICAgICAgICAgYmluZCggdG9wLCBsb2NhdGlvbiApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHVuYmluZCggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmUyRFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SW1hZ2VEYXRhfEFycmF5QnVmZmVyVmlld3xIVE1MSW1hZ2VFbGVtZW50fSBkYXRhIC0gVGhlIGRhdGEuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGRhdGEuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgZGF0YS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24oIGRhdGEsIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICBpZiAoIGRhdGEgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50ICkge1xyXG4gICAgICAgICAgICAvLyBzZXQgZGltZW5zaW9ucyBiZWZvcmUgcmVzaXppbmdcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IGRhdGEud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGRhdGEgPSBlbnN1cmVQb3dlck9mVHdvKCBkYXRhICk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBkYXRhO1xyXG4gICAgICAgICAgICAvL3RoaXMuZmlsdGVyID0gXCJMSU5FQVJcIjsgLy8gbXVzdCBiZSBsaW5lYXIgZm9yIG1pcG1hcHBpbmdcclxuICAgICAgICAgICAgdGhpcy5taXBNYXAgPSB0cnVlO1xyXG4gICAgICAgICAgICBnbC5waXhlbFN0b3JlaSggZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdGhpcy5pbnZlcnRZICk7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICAgICAgMCwgLy8gbGV2ZWxcclxuICAgICAgICAgICAgICAgIGdsLlJHQkEsXHJcbiAgICAgICAgICAgICAgICBnbC5SR0JBLFxyXG4gICAgICAgICAgICAgICAgZ2wuVU5TSUdORURfQllURSxcclxuICAgICAgICAgICAgICAgIGRhdGEgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgdGhpcy53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICAgICAgMCwgLy8gbGV2ZWxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmludGVybmFsRm9ybWF0IF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAwLCAvLyBib3JkZXIsIG11c3QgYmUgMFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuZm9ybWF0IF0sXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy50eXBlIF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0aGlzLm1pcE1hcCApIHtcclxuICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoIGdsLlRFWFRVUkVfMkQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIHRleHR1cmUgcGFyYW1ldGVycy5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1ldGVycyAtIFRoZSBwYXJhbWV0ZXJzIGJ5IG5hbWUuXHJcbiAgICAgKiA8cHJlPlxyXG4gICAgICogICAgIHdyYXAgfCB3cmFwLnMgfCB3cmFwLnQgLSBUaGUgd3JhcHBpbmcgdHlwZS5cclxuICAgICAqICAgICBmaWx0ZXIgfCBmaWx0ZXIubWluIHwgZmlsdGVyLm1hZyAtIFRoZSBmaWx0ZXIgdHlwZS5cclxuICAgICAqIDwvcHJlPlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmUyRC5wcm90b3R5cGUuc2V0UGFyYW1ldGVycyA9IGZ1bmN0aW9uKCBwYXJhbWV0ZXJzICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgaWYgKCBwYXJhbWV0ZXJzLndyYXAgKSB7XHJcbiAgICAgICAgICAgIC8vIHNldCB3cmFwIHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgdGhpcy53cmFwID0gcGFyYW1ldGVycy53cmFwO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfV1JBUF9TLFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMud3JhcC5zIHx8IHRoaXMud3JhcCBdICk7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9XUkFQX1QsXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy53cmFwLnQgfHwgdGhpcy53cmFwIF0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBwYXJhbWV0ZXJzLmZpbHRlciApIHtcclxuICAgICAgICAgICAgLy8gc2V0IGZpbHRlciBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gcGFyYW1ldGVycy5maWx0ZXI7XHJcbiAgICAgICAgICAgIHZhciBtaW5GaWx0ZXIgPSB0aGlzLmZpbHRlci5taW4gfHwgdGhpcy5maWx0ZXI7XHJcbiAgICAgICAgICAgIGlmICggdGhpcy5taXBNYXAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhcHBlbmQgbWluIG1wYSBzdWZmaXggdG8gbWluIGZpbHRlclxyXG4gICAgICAgICAgICAgICAgbWluRmlsdGVyICs9IFwiX01JUE1BUF9MSU5FQVJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUixcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmZpbHRlci5tYWcgfHwgdGhpcy5maWx0ZXIgXSApO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUixcclxuICAgICAgICAgICAgICAgIGdsWyBtaW5GaWx0ZXJdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzaXplIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmUyRFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSBuZXcgd2lkdGggb2YgdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIG5ldyBoZWlnaHQgb2YgdGhlIHRleHR1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RleHR1cmUyRH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRleHR1cmUyRC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGlzLmltYWdlICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkNhbm5vdCByZXNpemUgaW1hZ2UgYmFzZWQgVGV4dHVyZTJEXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoICF3aWR0aCB8fCAhaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oIFwiV2lkdGggb3IgaGVpZ2h0IGFyZ3VtZW50cyBtaXNzaW5nLCBjb21tYW5kIGlnbm9yZWQuXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoIHRoaXMuZGF0YSwgd2lkdGgsIGhlaWdodCApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRleHR1cmUyRDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXG4gICAgICAgIFN0YWNrID0gcmVxdWlyZSgnLi4vdXRpbC9TdGFjaycpLFxuICAgICAgICBGQUNFUyA9IFtcbiAgICAgICAgICAgICcteCcsICcreCcsXG4gICAgICAgICAgICAnLXknLCAnK3knLFxuICAgICAgICAgICAgJy16JywgJyt6J1xuICAgICAgICBdLFxuICAgICAgICBGQUNFX1RBUkdFVFMgPSB7XG4gICAgICAgICAgICAnK3onOiBcIlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWlwiLFxuICAgICAgICAgICAgJy16JzogXCJURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1pcIixcbiAgICAgICAgICAgICcreCc6IFwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YXCIsXG4gICAgICAgICAgICAnLXgnOiBcIlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWFwiLFxuICAgICAgICAgICAgJyt5JzogXCJURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1lcIixcbiAgICAgICAgICAgICcteSc6IFwiVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZXCJcbiAgICAgICAgfSxcbiAgICAgICAgX3N0YWNrID0ge30sXG4gICAgICAgIF9ib3VuZFRleHR1cmUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHByb3ZpZGVkIGltYWdlIGRpbWVuc2lvbnMgYXJlIG5vdCBwb3dlcnMgb2YgdHdvLCBpdCB3aWxsIHJlZHJhd1xuICAgICAqIHRoZSBpbWFnZSB0byB0aGUgbmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3by5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgLSBUaGUgaW1hZ2Ugb2JqZWN0LlxuICAgICAqXG4gICAgICogQHJldHVybnMge0hUTUxJbWFnZUVsZW1lbnR9IFRoZSBuZXcgaW1hZ2Ugb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVuc3VyZVBvd2VyT2ZUd28oIGltYWdlICkge1xuICAgICAgICBpZiAoICFVdGlsLmlzUG93ZXJPZlR3byggaW1hZ2Uud2lkdGggKSB8fFxuICAgICAgICAgICAgIVV0aWwuaXNQb3dlck9mVHdvKCBpbWFnZS5oZWlnaHQgKSApIHtcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImNhbnZhc1wiICk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byggaW1hZ2Uud2lkdGggKTtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byggaW1hZ2UuaGVpZ2h0ICk7XG4gICAgICAgICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICAgICAgMCwgMCxcbiAgICAgICAgICAgICAgICBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIDAsIDAsXG4gICAgICAgICAgICAgICAgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbWFnZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgdG8gYSBsb2NhdGlvbiBhbmQgYWN0aXZhdGVzIHRoZSB0ZXh0dXJlIHVuaXRcbiAgICAgKiB3aGlsZSBjYWNoaW5nIGl0IHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgcmViaW5kcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IHRleHR1cmUgLSBUaGUgVGV4dHVyZUN1YmVNYXAgb2JqZWN0IHRvIGJpbmQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiaW5kKCB0ZXh0dXJlLCBsb2NhdGlvbiApIHtcbiAgICAgICAgLy8gaWYgdGhpcyBidWZmZXIgaXMgYWxyZWFkeSBib3VuZCwgZXhpdCBlYXJseVxuICAgICAgICBpZiAoIF9ib3VuZFRleHR1cmUgPT09IHRleHR1cmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdsID0gdGV4dHVyZS5nbDtcbiAgICAgICAgbG9jYXRpb24gPSBnbFsgJ1RFWFRVUkUnICsgbG9jYXRpb24gXSB8fCBnbC5URVhUVVJFMDtcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZSggbG9jYXRpb24gKTtcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRleHR1cmUuaWQgKTtcbiAgICAgICAgX2JvdW5kVGV4dHVyZSA9IHRleHR1cmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QuIFByZXZlbnRzIHVubmVjZXNzYXJ5IHVuYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IHRleHR1cmUgLSBUaGUgVGV4dHVyZUN1YmVNYXAgb2JqZWN0IHRvIHVuYmluZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmJpbmQoIHRleHR1cmUgKSB7XG4gICAgICAgIC8vIGlmIG5vIGJ1ZmZlciBpcyBib3VuZCwgZXhpdCBlYXJseVxuICAgICAgICBpZiAoIF9ib3VuZFRleHR1cmUgPT09IG51bGwgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdsID0gdGV4dHVyZS5nbDtcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwgKTtcbiAgICAgICAgX2JvdW5kVGV4dHVyZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgYW5kIGJ1ZmZlciBhIGdpdmVuIGN1YmUgbWFwIGZhY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSBjdWJlTWFwIC0gVGhlIGN1YmUgbWFwIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCB0byBsb2FkIHRoZSBpbWFnZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmFjZSAtIFRoZSBmYWNlIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIHJlc3VsdGluZyBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2FkQW5kQnVmZmVySW1hZ2UoIGN1YmVNYXAsIHVybCwgZmFjZSApIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xuICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBidWZmZXIgZmFjZSB0ZXh0dXJlXG4gICAgICAgICAgICAgICAgY3ViZU1hcC5idWZmZXJGYWNlRGF0YSggZmFjZSwgaW1hZ2UgKTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdXJsO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmVDdWJlTWFwIG9iamVjdC5cbiAgICAgKiBAY2xhc3MgVGV4dHVyZUN1YmVNYXBcbiAgICAgKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSBjdWJlIG1hcCB0ZXh0dXJlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFRleHR1cmVDdWJlTWFwKCBzcGVjLCBjYWxsYmFjayApIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgZmFjZSxcbiAgICAgICAgICAgIGpvYnM7XG4gICAgICAgIC8vIHN0b3JlIGdsIGNvbnRleHRcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcbiAgICAgICAgdGhpcy5pZCA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xuICAgICAgICB0aGlzLndyYXAgPSBzcGVjLndyYXAgfHwgXCJDTEFNUF9UT19FREdFXCI7XG4gICAgICAgIHRoaXMuZmlsdGVyID0gc3BlYy5maWx0ZXIgfHwgXCJMSU5FQVJcIjtcbiAgICAgICAgdGhpcy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiBmYWxzZTtcbiAgICAgICAgLy8gY3JlYXRlIGN1YmUgbWFwIGJhc2VkIG9uIGlucHV0XG4gICAgICAgIGlmICggc3BlYy5pbWFnZXMgKSB7XG4gICAgICAgICAgICAvLyBtdWx0aXBsZSBJbWFnZSBvYmplY3RzXG4gICAgICAgICAgICBmb3IgKCBmYWNlIGluIHNwZWMuaW1hZ2VzICkge1xuICAgICAgICAgICAgICAgIGlmICggc3BlYy5pbWFnZXMuaGFzT3duUHJvcGVydHkoIGZhY2UgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyIGZhY2UgdGV4dHVyZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckZhY2VEYXRhKCBmYWNlLCBzcGVjLmltYWdlc1sgZmFjZSBdICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKCB0aGlzICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIHNwZWMudXJscyApIHtcbiAgICAgICAgICAgIC8vIG11bHRpcGxlIHVybHNcbiAgICAgICAgICAgIGpvYnMgPSB7fTtcbiAgICAgICAgICAgIGZvciAoIGZhY2UgaW4gc3BlYy51cmxzICkge1xuICAgICAgICAgICAgICAgIGlmICggc3BlYy51cmxzLmhhc093blByb3BlcnR5KCBmYWNlICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBqb2IgdG8gbWFwXG4gICAgICAgICAgICAgICAgICAgIGpvYnNbIGZhY2UgXSA9IGxvYWRBbmRCdWZmZXJJbWFnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVjLnVybHNbIGZhY2UgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY2UgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnNldFBhcmFtZXRlcnMoIHRoYXQgKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggdGhhdCApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbXB0eSBjdWJlIG1hcFxuICAgICAgICAgICAgdGhpcy5mb3JtYXQgPSBzcGVjLmZvcm1hdCB8fCBcIlJHQkFcIjtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxGb3JtYXQgPSB0aGlzLmZvcm1hdDsgLy8gd2ViZ2wgcmVxdWlyZXMgZm9ybWF0ID09PSBpbnRlcm5hbEZvcm1hdFxuICAgICAgICAgICAgdGhpcy50eXBlID0gc3BlYy50eXBlIHx8IFwiVU5TSUdORURfQllURVwiO1xuICAgICAgICAgICAgdGhpcy5taXBNYXAgPSBzcGVjLm1pcE1hcCAhPT0gdW5kZWZpbmVkID8gc3BlYy5taXBNYXAgOiBmYWxzZTtcbiAgICAgICAgICAgIEZBQ0VTLmZvckVhY2goIGZ1bmN0aW9uKCBmYWNlICkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gKCBzcGVjLmRhdGEgPyBzcGVjLmRhdGFbZmFjZV0gOiBzcGVjLmRhdGEgKSB8fCBudWxsO1xuICAgICAgICAgICAgICAgIHRoYXQuYnVmZmVyRmFjZURhdGEoIGZhY2UsIGRhdGEsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0ICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IGFuZCBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBzdGFjay5cbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZUN1YmVNYXBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgICBUZXh0dXJlQ3ViZU1hcC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcbiAgICAgICAgX3N0YWNrWyBsb2NhdGlvbiBdID0gX3N0YWNrWyBsb2NhdGlvbiBdIHx8IG5ldyBTdGFjaygpO1xuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0ucHVzaCggdGhpcyApO1xuICAgICAgICBiaW5kKCB0aGlzLCBsb2NhdGlvbiApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIGJpbmRzIHRoZSB0ZXh0dXJlIGJlbmVhdGggaXQgb25cbiAgICAgKiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHRleHR1cmUsIHVuYmluZHMgdGhlIHVuaXQuXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmVDdWJlTWFwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICAgVGV4dHVyZUN1YmVNYXAucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcbiAgICAgICAgdmFyIHRvcDtcbiAgICAgICAgaWYgKCAhX3N0YWNrWyBsb2NhdGlvbiBdICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyB0ZXh0dXJlIHdhcyBib3VuZCB0byB0ZXh0dXJlIHVuaXQgJ1wiICsgbG9jYXRpb24gK1xuICAgICAgICAgICAgICAgIFwiJy4gQ29tbWFuZCBpZ25vcmVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0ucG9wKCk7XG4gICAgICAgIHRvcCA9IF9zdGFja1sgbG9jYXRpb24gXS50b3AoKTtcbiAgICAgICAgaWYgKCB0b3AgKSB7XG4gICAgICAgICAgICBiaW5kKCB0b3AsIGxvY2F0aW9uICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bmJpbmQoIHRoaXMgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQnVmZmVyIGRhdGEgaW50byB0aGUgcmVzcGVjdGl2ZSBjdWJlIG1hcCBmYWNlLlxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlQ3ViZU1hcFxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZhY2UgLSBUaGUgZmFjZSBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtJbWFnZURhdGF8QXJyYXlCdWZmZXJWaWV3fEhUTUxJbWFnZUVsZW1lbnR9IGRhdGEgLSBUaGUgZGF0YS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGRhdGEuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFRleHR1cmVDdWJlTWFwLnByb3RvdHlwZS5idWZmZXJGYWNlRGF0YSA9IGZ1bmN0aW9uKCBmYWNlLCBkYXRhLCB3aWR0aCwgaGVpZ2h0ICkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsLFxuICAgICAgICAgICAgZmFjZVRhcmdldCA9IGdsWyBGQUNFX1RBUkdFVFNbIGZhY2UgXSBdO1xuICAgICAgICBpZiAoICFmYWNlVGFyZ2V0ICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkIGZhY2UgZW51bWVyYXRpb24gJ1wiKyBmYWNlICtcIicgcHJvdmlkZWQsIFwiICtcbiAgICAgICAgICAgICAgICBcImlnbm9yaW5nIGNvbW1hbmQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGJ1ZmZlciBmYWNlIHRleHR1cmVcbiAgICAgICAgdGhpcy5wdXNoKCk7XG4gICAgICAgIGlmICggZGF0YSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQgKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlcyA9IHRoaXMuaW1hZ2VzIHx8IHt9O1xuICAgICAgICAgICAgdGhpcy5pbWFnZXNbIGZhY2UgXSA9IGVuc3VyZVBvd2VyT2ZUd28oIGRhdGEgKTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gXCJMSU5FQVJcIjsgLy8gbXVzdCBiZSBsaW5lYXIgZm9yIG1pcG1hcHBpbmdcbiAgICAgICAgICAgIHRoaXMubWlwTWFwID0gdHJ1ZTtcbiAgICAgICAgICAgIGdsLnBpeGVsU3RvcmVpKCBnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkgKTtcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoXG4gICAgICAgICAgICAgICAgZmFjZVRhcmdldCxcbiAgICAgICAgICAgICAgICAwLCAvLyBsZXZlbFxuICAgICAgICAgICAgICAgIGdsLlJHQkEsXG4gICAgICAgICAgICAgICAgZ2wuUkdCQSxcbiAgICAgICAgICAgICAgICBnbC5VTlNJR05FRF9CWVRFLFxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzWyBmYWNlIF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVsgZmFjZSBdID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCB0aGlzLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgIGZhY2VUYXJnZXQsXG4gICAgICAgICAgICAgICAgMCwgLy8gbGV2ZWxcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5pbnRlcm5hbEZvcm1hdCBdLFxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgMCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5mb3JtYXQgXSxcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy50eXBlIF0sXG4gICAgICAgICAgICAgICAgZGF0YSApO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9ubHkgZ2VuZXJhdGUgbWlwbWFwcyBpZiBhbGwgZmFjZXMgYXJlIGJ1ZmZlcmVkXG4gICAgICAgIHRoaXMuYnVmZmVyZWRGYWNlcyA9IHRoaXMuYnVmZmVyZWRGYWNlcyB8fCB7fTtcbiAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzWyBmYWNlIF0gPSB0cnVlO1xuICAgICAgICAvLyBvbmNlIGFsbCBmYWNlcyBhcmUgYnVmZmVyZWRcbiAgICAgICAgaWYgKCB0aGlzLm1pcE1hcCAmJlxuICAgICAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzWycteCddICYmIHRoaXMuYnVmZmVyZWRGYWNlc1snK3gnXSAmJlxuICAgICAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzWycteSddICYmIHRoaXMuYnVmZmVyZWRGYWNlc1snK3knXSAmJlxuICAgICAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzWycteiddICYmIHRoaXMuYnVmZmVyZWRGYWNlc1snK3onXSApIHtcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIG1pcG1hcHMgb25jZSBhbGwgZmFjZXMgYXJlIGJ1ZmZlcmVkXG4gICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcCggZ2wuVEVYVFVSRV9DVUJFX01BUCApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHRleHR1cmUgcGFyYW1ldGVycy5cbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZUN1YmVNYXBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIC0gVGhlIHBhcmFtZXRlcnMgYnkgbmFtZS5cbiAgICAgKiA8cHJlPlxuICAgICAqICAgICB3cmFwIHwgd3JhcC5zIHwgd3JhcC50IC0gVGhlIHdyYXBwaW5nIHR5cGUuXG4gICAgICogICAgIGZpbHRlciB8IGZpbHRlci5taW4gfCBmaWx0ZXIubWFnIC0gVGhlIGZpbHRlciB0eXBlLlxuICAgICAqIDwvcHJlPlxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgVGV4dHVyZUN1YmVNYXAucHJvdG90eXBlLnNldFBhcmFtZXRlcnMgPSBmdW5jdGlvbiggcGFyYW1ldGVycyApIHtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICAgICAgdGhpcy5wdXNoKCk7XG4gICAgICAgIGlmICggcGFyYW1ldGVycy53cmFwICkge1xuICAgICAgICAgICAgLy8gc2V0IHdyYXAgcGFyYW1ldGVyc1xuICAgICAgICAgICAgdGhpcy53cmFwID0gcGFyYW1ldGVycy53cmFwO1xuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX0NVQkVfTUFQLFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfV1JBUF9TLFxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLndyYXAucyB8fCB0aGlzLndyYXAgXSApO1xuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX0NVQkVfTUFQLFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfV1JBUF9ULFxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLndyYXAudCB8fCB0aGlzLndyYXAgXSApO1xuICAgICAgICAgICAgLyogbm90IHN1cHBvcnRlZCBpbiB3ZWJnbCAxLjBcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9DVUJFX01BUCxcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX1dSQVBfUixcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy53cmFwLnIgfHwgdGhpcy53cmFwIF0gKTtcbiAgICAgICAgICAgICovXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBwYXJhbWV0ZXJzLmZpbHRlciApIHtcbiAgICAgICAgICAgIC8vIHNldCBmaWx0ZXIgcGFyYW1ldGVyc1xuICAgICAgICAgICAgdGhpcy5maWx0ZXIgPSBwYXJhbWV0ZXJzLmZpbHRlcjtcbiAgICAgICAgICAgIHZhciBtaW5GaWx0ZXIgPSB0aGlzLmZpbHRlci5taW4gfHwgdGhpcy5maWx0ZXI7XG4gICAgICAgICAgICBpZiAoIHRoaXMubWluTWFwICkge1xuICAgICAgICAgICAgICAgIC8vIGFwcGVuZCBtaW4gbXBhIHN1ZmZpeCB0byBtaW4gZmlsdGVyXG4gICAgICAgICAgICAgICAgbWluRmlsdGVyICs9IFwiX01JUE1BUF9MSU5FQVJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9DVUJFX01BUCxcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX01BR19GSUxURVIsXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuZmlsdGVyLm1hZyB8fCB0aGlzLmZpbHRlciBdICk7XG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfQ1VCRV9NQVAsXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLFxuICAgICAgICAgICAgICAgIGdsWyBtaW5GaWx0ZXJdICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3AoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gVGV4dHVyZUN1YmVNYXA7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIFZlcnRleFBhY2thZ2UgPSByZXF1aXJlKCcuL1ZlcnRleFBhY2thZ2UnKSxcclxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gbnVsbCxcclxuICAgICAgICBfZW5hYmxlZEF0dHJpYnV0ZXMgPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldEF0dHJpYnV0ZVBvaW50ZXJzKCB2ZXJ0ZXhCdWZmZXIsIGF0dHJpYnV0ZVBvaW50ZXJzICkge1xyXG4gICAgICAgIGlmICggIWF0dHJpYnV0ZVBvaW50ZXJzICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIlZlcnRleEJ1ZmZlciByZXF1aXJlcyBhdHRyaWJ1dGUgcG9pbnRlcnMgdG8gYmUgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzcGVjaWZpZWQsIGNvbW1hbmQgaWdub3JlZFwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmVydGV4QnVmZmVyLnBvaW50ZXJzID0gYXR0cmlidXRlUG9pbnRlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gVmVydGV4QnVmZmVyKCBhcnJheSwgYXR0cmlidXRlUG9pbnRlcnMgKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IDA7XHJcbiAgICAgICAgdGhpcy5wb2ludGVycyA9IHt9O1xyXG4gICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgaWYgKCBhcnJheSApIHtcclxuICAgICAgICAgICAgaWYgKCBhcnJheSBpbnN0YW5jZW9mIFZlcnRleFBhY2thZ2UgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBWZXJ0ZXhQYWNrYWdlIGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoIGFycmF5LmJ1ZmZlcigpICk7XHJcbiAgICAgICAgICAgICAgICBzZXRBdHRyaWJ1dGVQb2ludGVycyggdGhpcywgYXJyYXkuYXR0cmlidXRlUG9pbnRlcnMoKSApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBhcnJheSBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyICkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2ViR0xCdWZmZXIgYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHRoaXMuaWQgPSBhcnJheTtcclxuICAgICAgICAgICAgICAgIHNldEF0dHJpYnV0ZVBvaW50ZXJzKCB0aGlzLCBhdHRyaWJ1dGVQb2ludGVycyApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQXJyYXkgb3IgQXJyYXlCdWZmZXIgYXJndW1lbnRcclxuICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBhcnJheSApO1xyXG4gICAgICAgICAgICAgICBzZXRBdHRyaWJ1dGVQb2ludGVycyggdGhpcywgYXR0cmlidXRlUG9pbnRlcnMgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBWZXJ0ZXhCdWZmZXIucHJvdG90eXBlLmJ1ZmZlckRhdGEgPSBmdW5jdGlvbiggYXJyYXkgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIC8vIGNhc3QgYXJyYXlzIGludG8gYnVmZmVydmlld1xyXG4gICAgICAgICAgICBhcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoIGFycmF5ICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggIVV0aWwuaXNUeXBlZEFycmF5KCBhcnJheSApICYmIHR5cGVvZiBhcnJheSAhPT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJWZXJ0ZXhCdWZmZXIgcmVxdWlyZXMgYW4gQXJyYXkgb3IgQXJyYXlCdWZmZXIsIFwiICtcclxuICAgICAgICAgICAgICAgIFwib3IgYSBzaXplIGFyZ3VtZW50LCBjb21tYW5kIGlnbm9yZWRcIiApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIXRoaXMuaWQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmlkICk7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YSggZ2wuQVJSQVlfQlVGRkVSLCBhcnJheSwgZ2wuU1RBVElDX0RSQVcgKTtcclxuICAgIH07XHJcblxyXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJTdWJEYXRhID0gZnVuY3Rpb24oIGFycmF5LCBvZmZzZXQgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICBpZiAoICF0aGlzLmlkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIlZlcnRleEJ1ZmZlciBoYXMgbm90IGJlZW4gaW5pdGlhbGx5IGJ1ZmZlcmVkLCBcIiArXHJcbiAgICAgICAgICAgICAgICBcImNvbW1hbmQgaWdub3JlZFwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBhcnJheSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICBhcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoIGFycmF5ICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggIVV0aWwuaXNUeXBlZEFycmF5KCBhcnJheSApICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIlZlcnRleEJ1ZmZlciByZXF1aXJlcyBhbiBBcnJheSBvciBBcnJheUJ1ZmZlciBcIiArXHJcbiAgICAgICAgICAgICAgICBcImFyZ3VtZW50LCBjb21tYW5kIGlnbm9yZWRcIiApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9mZnNldCA9ICggb2Zmc2V0ICE9PSB1bmRlZmluZWQgKSA/IG9mZnNldCA6IDA7XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmlkICk7XHJcbiAgICAgICAgZ2wuYnVmZmVyU3ViRGF0YSggZ2wuQVJSQVlfQlVGRkVSLCBvZmZzZXQsIGFycmF5ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGlmIHRoaXMgYnVmZmVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZEJ1ZmZlciA9PT0gdGhpcyApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsLFxyXG4gICAgICAgICAgICBwb2ludGVycyA9IHRoaXMucG9pbnRlcnMsXHJcbiAgICAgICAgICAgIHByZXZpb3VzbHlFbmFibGVkQXR0cmlidXRlcyA9IF9lbmFibGVkQXR0cmlidXRlcyB8fCB7fSxcclxuICAgICAgICAgICAgcG9pbnRlcixcclxuICAgICAgICAgICAgaW5kZXg7XHJcbiAgICAgICAgLy8gY2FjaGUgdGhpcyB2ZXJ0ZXggYnVmZmVyXHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gdGhpcztcclxuICAgICAgICBfZW5hYmxlZEF0dHJpYnV0ZXMgPSB7fTtcclxuICAgICAgICAvLyBiaW5kIGJ1ZmZlclxyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pZCApO1xyXG4gICAgICAgIGZvciAoIGluZGV4IGluIHBvaW50ZXJzICkge1xyXG4gICAgICAgICAgICBpZiAoIHBvaW50ZXJzLmhhc093blByb3BlcnR5KCBpbmRleCApICkge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRlciA9IHRoaXMucG9pbnRlcnNbIGluZGV4IF07XHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgYXR0cmlidXRlIHBvaW50ZXJcclxuICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXIuc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnbFsgcG9pbnRlci50eXBlIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlci5zdHJpZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlci5vZmZzZXQgKTtcclxuICAgICAgICAgICAgICAgIC8vIGVuYWJsZWQgYXR0cmlidXRlIGFycmF5XHJcbiAgICAgICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSggaW5kZXggKTtcclxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgX2VuYWJsZWRBdHRyaWJ1dGVzWyBpbmRleCBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHByZXZpb3VzIGxpc3RcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBwcmV2aW91c2x5RW5hYmxlZEF0dHJpYnV0ZXNbIGluZGV4IF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZW5zdXJlIGxlYWtlZCBhdHRyaWJ1dGUgYXJyYXlzIGFyZSBkaXNhYmxlZFxyXG4gICAgICAgIGZvciAoIGluZGV4IGluIHByZXZpb3VzbHlFbmFibGVkQXR0cmlidXRlcyApIHtcclxuICAgICAgICAgICAgaWYgKCBwcmV2aW91c2x5RW5hYmxlZEF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIGluZGV4ICkgKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoIGluZGV4ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaWYgbm8gYnVmZmVyIGlzIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCxcclxuICAgICAgICAgICAgcG9pbnRlcnMgPSB0aGlzLnBvaW50ZXJzLFxyXG4gICAgICAgICAgICBpbmRleDtcclxuICAgICAgICBmb3IgKCBpbmRleCBpbiBwb2ludGVycyApIHtcclxuICAgICAgICAgICAgaWYgKCBwb2ludGVycy5oYXNPd25Qcm9wZXJ0eSggaW5kZXggKSApIHtcclxuICAgICAgICAgICAgICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSggaW5kZXggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5BUlJBWV9CVUZGRVIsIG51bGwgKTtcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIF9lbmFibGVkQXR0cmlidXRlcyA9IHt9O1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleEJ1ZmZlcjtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGludmFsaWQgYXR0cmlidXRlIGFyZ3VtZW50cy4gQSB2YWxpZCBhcmd1bWVudFxyXG4gICAgICogbXVzdCBiZSBhbiBBcnJheSBvZiBsZW5ndGggPiAwLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGF0dHJpYnV0ZXMgLSBUaGUgYXJyYXkgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgdmFsaWQgYXJyYXkgb2YgYXJndW1lbnRzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZW1vdmVCYWRBcmd1bWVudHMoIGF0dHJpYnV0ZXMgKSB7XHJcbiAgICAgICAgdmFyIGdvb2RBdHRyaWJ1dGVzID0gW10sXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8YXR0cmlidXRlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcclxuICAgICAgICAgICAgaWYgKCBhdHRyaWJ1dGUgJiZcclxuICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgaW5zdGFuY2VvZiBBcnJheSAmJlxyXG4gICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgZ29vZEF0dHJpYnV0ZXMucHVzaCggYXR0cmlidXRlICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkVycm9yIHBhcnNpbmcgYXR0cmlidXRlIG9mIGluZGV4IFwiICsgaSArXHJcbiAgICAgICAgICAgICAgICAgICAgXCIsIGF0dHJpYnV0ZSBkaXNjYXJkZWRcIiApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBnb29kQXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBjb21wb25lbnQncyBieXRlIHNpemUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbXBvbmVudCAtIFRoZSBjb21wb25lbnQgdG8gbWVhc3VyZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7aW50ZWdlcn0gVGhlIGJ5dGUgc2l6ZSBvZiB0aGUgY29tcG9uZW50LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRTaXplKCBjb21wb25lbnQgKSB7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgdmVjdG9yXHJcbiAgICAgICAgaWYgKCBjb21wb25lbnQueCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAvLyAxIGNvbXBvbmVudCB2ZWN0b3JcclxuICAgICAgICAgICAgaWYgKCBjb21wb25lbnQueSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgLy8gMiBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgICAgICBpZiAoIGNvbXBvbmVudC56ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gMyBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjb21wb25lbnQudyAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA0IGNvbXBvbmVudCB2ZWN0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNoZWNrIGlmIGFycmF5XHJcbiAgICAgICAgaWYgKCBjb21wb25lbnQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgdHlwZSwgc2l6ZSwgYW5kIG9mZnNldCBmb3IgZWFjaCBhdHRyaWJ1dGUgaW4gdGhlXHJcbiAgICAgKiBhdHRyaWJ1dGUgYXJyYXkgYWxvbmcgd2l0aCB0aGUgbGVuZ3RoIGFuZCBzdHJpZGUgb2YgdGhlIHBhY2thZ2UuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZXJ0ZXhQYWNrYWdlfSB2ZXJ0ZXhQYWNrYWdlIC0gVGhlIFZlcnRleFBhY2thZ2Ugb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXR0cmlidXRlcyAtIFRoZSBhcnJheSBvZiB2ZXJ0ZXggYXR0cmlidXRlcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V0UG9pbnRlcnNBbmRTdHJpZGUoIHZlcnRleFBhY2thZ2UsIGF0dHJpYnV0ZXMgKSB7XHJcbiAgICAgICAgdmFyIHNob3J0ZXN0QXJyYXkgPSBOdW1iZXIuTUFYX1ZBTFVFLFxyXG4gICAgICAgICAgICBvZmZzZXQgPSAwLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGUsXHJcbiAgICAgICAgICAgIHNpemUsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgdmVydGV4UGFja2FnZS5wb2ludGVycyA9IHt9O1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICAvLyBzZXQgc2l6ZSB0byBudW1iZXIgb2YgY29tcG9uZW50cyBpbiB0aGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgIHNpemUgPSBnZXRDb21wb25lbnRTaXplKCBhdHRyaWJ1dGVbMF0gKTtcclxuICAgICAgICAgICAgLy8gbGVuZ3RoIG9mIHRoZSBwYWNrYWdlIHdpbGwgYmUgdGhlIHNob3J0ZXN0IGF0dHJpYnV0ZSBhcnJheSBsZW5ndGhcclxuICAgICAgICAgICAgc2hvcnRlc3RBcnJheSA9IE1hdGgubWluKCBzaG9ydGVzdEFycmF5LCBhdHRyaWJ1dGUubGVuZ3RoICk7XHJcbiAgICAgICAgICAgIC8vIHN0b3JlIHBvaW50ZXIgdW5kZXIgaW5kZXhcclxuICAgICAgICAgICAgdmVydGV4UGFja2FnZS5wb2ludGVyc1sgaSBdID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA6IFwiRkxPQVRcIixcclxuICAgICAgICAgICAgICAgIHNpemUgOiBzaXplLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0IDogb2Zmc2V0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIGFjY3VtdWxhdGUgYXR0cmlidXRlIG9mZnNldFxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHN0cmlkZSB0byB0b3RhbCBvZmZzZXRcclxuICAgICAgICB2ZXJ0ZXhQYWNrYWdlLnN0cmlkZSA9IG9mZnNldDtcclxuICAgICAgICAvLyBzZXQgc2l6ZSBvZiBwYWNrYWdlIHRvIHRoZSBzaG9ydGVzdCBhdHRyaWJ1dGUgYXJyYXkgbGVuZ3RoXHJcbiAgICAgICAgdmVydGV4UGFja2FnZS5zaXplID0gc2hvcnRlc3RBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBWZXJ0ZXhQYWNrYWdlKCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIC8vIGVuc3VyZSBhdHRyaWJ1dGVzIGlzIGFuIGFycmF5IG9mIGFycmF5c1xyXG4gICAgICAgIGlmICggISggYXR0cmlidXRlc1swXSBpbnN0YW5jZW9mIEFycmF5ICkgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbIGF0dHJpYnV0ZXMgXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KCBhdHRyaWJ1dGVzICk7XHJcbiAgICB9XHJcblxyXG4gICAgVmVydGV4UGFja2FnZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oIGF0dHJpYnV0ZXMgKSB7XHJcbiAgICAgICAgdmFyIEJZVEVTX1BFUl9DT01QT05FTlQgPSA0LFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGUsXHJcbiAgICAgICAgICAgIHBvaW50ZXIsXHJcbiAgICAgICAgICAgIHZlcnRleCxcclxuICAgICAgICAgICAgb2Zmc2V0LFxyXG4gICAgICAgICAgICBpLCBqLCBrO1xyXG4gICAgICAgIC8vIHJlbW92ZSBiYWQgYXR0cmlidXRlc1xyXG4gICAgICAgIGF0dHJpYnV0ZXMgPSByZW1vdmVCYWRBcmd1bWVudHMoIGF0dHJpYnV0ZXMgKTtcclxuICAgICAgICAvLyBzZXQgYXR0cmlidXRlIHBvaW50ZXJzIGFuZCBzdHJpZGVcclxuICAgICAgICBzZXRQb2ludGVyc0FuZFN0cmlkZSggdGhpcywgYXR0cmlidXRlcyApO1xyXG4gICAgICAgIC8vIHNldCBzaXplIG9mIGRhdGEgdmVjdG9yXHJcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IEZsb2F0MzJBcnJheSggdGhpcy5zaXplICogdGhpcy5zdHJpZGUgKTtcclxuICAgICAgICAvLyBmb3IgZWFjaCB2ZXJ0ZXggYXR0cmlidXRlIGFycmF5XHJcbiAgICAgICAgZm9yICggaT0wOyBpPGF0dHJpYnV0ZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaV07XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlclxyXG4gICAgICAgICAgICBwb2ludGVyID0gdGhpcy5wb2ludGVyc1tpXTtcclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBwb2ludGVycyBvZmZzZXRcclxuICAgICAgICAgICAgb2Zmc2V0ID0gcG9pbnRlci5vZmZzZXQ7XHJcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHZlcnRleCBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgZm9yICggaj0wOyBqPHRoaXMuc2l6ZTsgaisrICkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4ID0gYXR0cmlidXRlW2pdO1xyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiB0aGUgYnVmZmVyIHRvIHRoZSBwYXJ0aWN1bGFyIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgayA9IG9mZnNldCArICggdGhpcy5zdHJpZGUgKiBqICk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKCBwb2ludGVyLnNpemUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFba10gPSAoIHZlcnRleC54ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC54IDogdmVydGV4WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaysxXSA9ICggdmVydGV4LnkgIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnkgOiB2ZXJ0ZXhbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2tdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMV0gPSAoIHZlcnRleC55ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaysyXSA9ICggdmVydGV4LnogIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnogOiB2ZXJ0ZXhbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2tdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMV0gPSAoIHZlcnRleC55ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaysyXSA9ICggdmVydGV4LnogIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnogOiB2ZXJ0ZXhbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrKzNdID0gKCB2ZXJ0ZXgudyAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgudyA6IHZlcnRleFszXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2tdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc2NhbGUgb2Zmc2V0IGFuZCBzdHJpZGUgYnkgYnl0ZXMgcGVyIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAvLyBpdCBpcyBkb25lIGhlcmUgYXMgYWJvdmUgbG9naWMgdXNlcyBzdHJpZGUgYW5kIG9mZnNldFxyXG4gICAgICAgICAgICAvLyBhcyBjb21wb25lbnQgY291bnRzIHJhdGhlciB0aGFuIG51bWJlciBvZiBieXRlXHJcbiAgICAgICAgICAgIHBvaW50ZXIuc3RyaWRlID0gdGhpcy5zdHJpZGUgKiBCWVRFU19QRVJfQ09NUE9ORU5UO1xyXG4gICAgICAgICAgICBwb2ludGVyLm9mZnNldCA9IHBvaW50ZXIub2Zmc2V0ICogQllURVNfUEVSX0NPTVBPTkVOVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIFZlcnRleFBhY2thZ2UucHJvdG90eXBlLmJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbiAgICB9O1xyXG5cclxuICAgIFZlcnRleFBhY2thZ2UucHJvdG90eXBlLmF0dHJpYnV0ZVBvaW50ZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRlcnM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4UGFja2FnZTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcclxuICAgICAgICBTdGFjayA9IHJlcXVpcmUoJy4uL3V0aWwvU3RhY2snKSxcclxuICAgICAgICBfc3RhY2sgPSBuZXcgU3RhY2soKTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZXQoIHZpZXdwb3J0LCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHZpZXdwb3J0LmdsO1xyXG4gICAgICAgIGlmICggd2lkdGggJiYgaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICBnbC52aWV3cG9ydCggMCwgMCwgd2lkdGgsIGhlaWdodCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdsLnZpZXdwb3J0KCAwLCAwLCB2aWV3cG9ydC53aWR0aCwgdmlld3BvcnQuaGVpZ2h0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFZpZXdwb3J0KCBzcGVjICkge1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBzcGVjLndpZHRoIHx8IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gc3BlYy5oZWlnaHQgfHwgd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIHRoZSB2aWV3cG9ydCBvYmplY3RzIHdpZHRoIGFuZCBoZWlnaHQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmlld3BvcnRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVmlld3BvcnQucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIGlmICggd2lkdGggJiYgaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLmdsLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHZpZXdwb3J0IG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgVmlld3BvcnRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgIFZpZXdwb3J0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgX3N0YWNrLnB1c2goe1xyXG4gICAgICAgICAgICB2aWV3cG9ydDogdGhpcyxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldCggdGhpcywgd2lkdGgsIGhlaWdodCApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBvcHMgY3VycmVudCB0aGUgdmlld3BvcnQgb2JqZWN0IGFuZCBzZXRzIHRoZSB2aWV3cG9ydCBiZW5lYXRoIGl0LlxyXG4gICAgICogQG1lbWJlcm9mIFZpZXdwb3J0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZpZXdwb3J0fSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgICBWaWV3cG9ydC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRvcDtcclxuICAgICAgICBfc3RhY2sucG9wKCk7XHJcbiAgICAgICAgdG9wID0gX3N0YWNrLnRvcCgpO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBzZXQoIHRvcC52aWV3cG9ydCwgdG9wLndpZHRoLCB0b3AuaGVpZ2h0ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0KCB0aGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZpZXdwb3J0O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBfYm91bmRDb250ZXh0ID0gbnVsbCxcclxuICAgICAgICBfY29udGV4dHNCeUlkID0ge30sXHJcbiAgICAgICAgRVhURU5TSU9OUyA9IFtcclxuICAgICAgICAgICAgLy8gcmF0aWZpZWRcclxuICAgICAgICAgICAgJ09FU190ZXh0dXJlX2Zsb2F0JyxcclxuICAgICAgICAgICAgJ09FU190ZXh0dXJlX2hhbGZfZmxvYXQnLFxyXG4gICAgICAgICAgICAnV0VCR0xfbG9zZV9jb250ZXh0JyxcclxuICAgICAgICAgICAgJ09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXHJcbiAgICAgICAgICAgICdPRVNfdmVydGV4X2FycmF5X29iamVjdCcsXHJcbiAgICAgICAgICAgICdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJyxcclxuICAgICAgICAgICAgJ1dFQkdMX2RlYnVnX3NoYWRlcnMnLFxyXG4gICAgICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMnLFxyXG4gICAgICAgICAgICAnV0VCR0xfZGVwdGhfdGV4dHVyZScsXHJcbiAgICAgICAgICAgICdPRVNfZWxlbWVudF9pbmRleF91aW50JyxcclxuICAgICAgICAgICAgJ0VYVF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYycsXHJcbiAgICAgICAgICAgICdXRUJHTF9kcmF3X2J1ZmZlcnMnLFxyXG4gICAgICAgICAgICAnQU5HTEVfaW5zdGFuY2VkX2FycmF5cycsXHJcbiAgICAgICAgICAgICdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInLFxyXG4gICAgICAgICAgICAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdF9saW5lYXInLFxyXG4gICAgICAgICAgICAvLyBjb21tdW5pdHlcclxuICAgICAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hdGMnLFxyXG4gICAgICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjJyxcclxuICAgICAgICAgICAgJ0VYVF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCcsXHJcbiAgICAgICAgICAgICdXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQnLFxyXG4gICAgICAgICAgICAnRVhUX2ZyYWdfZGVwdGgnLFxyXG4gICAgICAgICAgICAnRVhUX3NSR0InLFxyXG4gICAgICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnLFxyXG4gICAgICAgICAgICAnRVhUX2JsZW5kX21pbm1heCcsXHJcbiAgICAgICAgICAgICdFWFRfc2hhZGVyX3RleHR1cmVfbG9kJ1xyXG4gICAgICAgIF07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IGZyb20gZWl0aGVyIGFuIGV4aXN0aW5nIG9iamVjdCwgb3JcclxuICAgICAqIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhc1xyXG4gICAgICogICAgIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2FudmFzKCBhcmcgKSB7XHJcbiAgICAgICAgaWYgKCBhcmcgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50IHx8XHJcbiAgICAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZztcclxuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGFyZyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYWxsIGtub3duIGV4dGVuc2lvbnMgZm9yIGEgcHJvdmlkZWRcclxuICAgICAqIFdlYkdMUmVuZGVyaW5nQ29udGV4dC4gU3RvcmVzIHRoZSByZXN1bHRzIGluIHRoZSBjb250ZXh0IHdyYXBwZXIgZm9yXHJcbiAgICAgKiBsYXRlciBxdWVyaWVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0V3JhcHBlciAtIFRoZSBjb250ZXh0IHdyYXBwZXIuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxvYWRFeHRlbnNpb25zKCBjb250ZXh0V3JhcHBlciApIHtcclxuICAgICAgICB2YXIgZ2wgPSBjb250ZXh0V3JhcHBlci5nbCxcclxuICAgICAgICAgICAgZXh0ZW5zaW9uLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxFWFRFTlNJT05TLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBleHRlbnNpb24gPSBFWFRFTlNJT05TW2ldO1xyXG4gICAgICAgICAgICBjb250ZXh0V3JhcHBlci5leHRlbnNpb25zWyBleHRlbnNpb24gXSA9IGdsLmdldEV4dGVuc2lvbiggZXh0ZW5zaW9uICk7XHJcbiAgICAgICAgICAgIGlmICggY29udGV4dFdyYXBwZXIuZXh0ZW5zaW9uc1sgZXh0ZW5zaW9uIF0gKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggZXh0ZW5zaW9uICsgXCIgZXh0ZW5zaW9uIGxvYWRlZCBzdWNjZXNzZnVsbHlcIiApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGV4dGVuc2lvbiArIFwiIGV4dGVuc2lvbiBub3Qgc3VwcG9ydGVkXCIgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGVtcHRzIHRvIGNyZWF0ZSBhIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3cmFwcGVkIGluc2lkZSBhbiBvYmplY3Qgd2hpY2hcclxuICAgICAqIHdpbGwgYWxzbyBzdG9yZSB0aGUgZXh0ZW5zaW9uIHF1ZXJ5IHJlc3VsdHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIENhbnZhcyBlbGVtZW50IG9iamVjdCB0b1xyXG4gICAgICogICAgIGNyZWF0ZSB0aGUgY29udGV4dCB1bmRlci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBjb250ZXh0V3JhcHBlciAtIFRoZSBjb250ZXh0IHdyYXBwZXIuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRleHRXcmFwcGVyKCBjYW52YXMgKSB7XHJcbiAgICAgICAgdmFyIGNvbnRleHRXcmFwcGVyLFxyXG4gICAgICAgICAgICBnbDtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBnZXQgV2ViR0wgY29udGV4dCwgZmFsbGJhY2sgdG8gZXhwZXJpbWVudGFsXHJcbiAgICAgICAgICAgIGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKSB8fCBjYW52YXMuZ2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiKTtcclxuICAgICAgICAgICAgLy8gd3JhcCBjb250ZXh0XHJcbiAgICAgICAgICAgIGNvbnRleHRXcmFwcGVyID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGNhbnZhcy5pZCxcclxuICAgICAgICAgICAgICAgIGdsOiBnbCxcclxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbnM6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIGxvYWQgV2ViR0wgZXh0ZW5zaW9uc1xyXG4gICAgICAgICAgICBsb2FkRXh0ZW5zaW9ucyggY29udGV4dFdyYXBwZXIgKTtcclxuICAgICAgICAgICAgLy8gYWRkIGNvbnRleHQgd3JhcHBlciB0byBtYXBcclxuICAgICAgICAgICAgX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF0gPSBjb250ZXh0V3JhcHBlcjtcclxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgYSBib3VuZCBjb250ZXh0IGV4aXN0c1xyXG4gICAgICAgICAgICBpZiAoICFfYm91bmRDb250ZXh0ICkge1xyXG4gICAgICAgICAgICAgICAgLy8gYmluZCBjb250ZXh0IGlmIG5vIG90aGVyIGlzIGJvdW5kXHJcbiAgICAgICAgICAgICAgICBfYm91bmRDb250ZXh0ID0gY29udGV4dFdyYXBwZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoKCBlICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBlLm1lc3NhZ2UgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhZ2wgKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCBcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgbWF5IG5vdCBcIiArXHJcbiAgICAgICAgICAgICAgICBcInN1cHBvcnQgaXQuXCIgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbnRleHRXcmFwcGVyO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCaW5kcyBhIHNwZWNpZmljIFdlYkdMIGNvbnRleHQgYXMgdGhlIGFjdGl2ZSBjb250ZXh0LiBUaGlzIGNvbnRleHRcclxuICAgICAgICAgKiB3aWxsIGJlIHVzZWQgZm9yIGFsbCBjb2RlIC93ZWJnbC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge1dlYkdMQ29udGV4dH0gVGhpcyBuYW1lc3BhY2UsIHVzZWQgZm9yIGNoYWluaW5nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uKCBhcmcgKSB7XHJcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBnZXRDYW52YXMoIGFyZyApO1xyXG4gICAgICAgICAgICBpZiAoICFjYW52YXMgKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkNvbnRleHQgY291bGQgbm90IGJlIGJvdW5kIGZvciBhcmd1bWVudCBvZiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlICdcIisoIHR5cGVvZiBhcmcgKStcIicsIGNvbW1hbmQgaWdub3JlZC5cIiApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCAhX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF0gKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIk5vIGNvbnRleHQgZXhpc3RzIGZvciBwcm92aWRlZCBhcmd1bWVudCAnXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZyArIFwiJywgY29tbWFuZCBpZ25vcmVkLlwiICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2JvdW5kQ29udGV4dCA9IF9jb250ZXh0c0J5SWRbIGNhbnZhcy5pZCBdO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IG9yIHJldHJlaXZlcyBhbiBleGlzdGluZyBXZWJHTCBjb250ZXh0IGZvciBhIHByb3ZpZGVkXHJcbiAgICAgICAgICogY2FudmFzIG9iamVjdC4gRHVyaW5nIGNyZWF0aW9uIGF0dGVtcHRzIHRvIGxvYWQgYWxsIGV4dGVuc2lvbnMgZm91bmRcclxuICAgICAgICAgKiBhdDogaHR0cHM6Ly93d3cua2hyb25vcy5vcmcvcmVnaXN0cnkvd2ViZ2wvZXh0ZW5zaW9ucy8uIElmIG5vXHJcbiAgICAgICAgICogYXJndW1lbnQgaXMgcHJvdmlkZWQgaXQgd2lsbCBhdHRlbXB0IHRvIHJldHVybiB0aGUgY3VycmVudGx5IGJvdW5kXHJcbiAgICAgICAgICogY29udGV4dC4gSWYgbm8gY29udGV4dCBpcyBib3VuZCwgaXQgd2lsbCByZXR1cm4gJ251bGwnLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXMgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuIE9wdGlvbmFsLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gVGhlIFdlYkdMUmVuZGVyaW5nQ29udGV4dCBjb250ZXh0IG9iamVjdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCBhcmcgKSB7XHJcbiAgICAgICAgICAgIGlmICggIWFyZyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggIV9ib3VuZENvbnRleHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm8gYm91bmQgY29udGV4dCBvciBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiTm8gY29udGV4dCBpcyBjdXJyZW50bHkgYm91bmQgb3IgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInByb3ZpZGVkLCByZXR1cm5pbmcgJ251bGwnLlwiICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gbGFzdCBib3VuZCBjb250ZXh0XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2JvdW5kQ29udGV4dC5nbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBnZXQgY2FudmFzIGVsZW1lbnRcclxuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGdldENhbnZhcyggYXJnICk7XHJcbiAgICAgICAgICAgIC8vIHRyeSB0byBmaW5kIG9yIGNyZWF0ZSBjb250ZXh0XHJcbiAgICAgICAgICAgIGlmICggIWNhbnZhcyB8fCAoICFfY29udGV4dHNCeUlkWyBjYW52YXMuaWQgXSAmJiAhY3JlYXRlQ29udGV4dFdyYXBwZXIoIGNhbnZhcyApICkgKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkNvbnRleHQgY291bGQgbm90IGJlIGZvdW5kIG9yIGNyZWF0ZWQgZm9yIFwiICtcclxuICAgICAgICAgICAgICAgICAgICBcImFyZ3VtZW50IG9mIHR5cGUnXCIrKCB0eXBlb2YgYXJnICkrXCInLCByZXR1cm5pbmcgJ251bGwnLlwiICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgICByZXR1cm4gX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF0uZ2w7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2hlY2tzIGlmIGFuIGV4dGVuc2lvbiBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIGJ5IHRoZSBwcm92aWRlZFxyXG4gICAgICAgICAqIGNhbnZhcyBvYmplY3QuIElmIG5vIGFyZ3VtZW50IGlzIHByb3ZpZGVkIGl0IHdpbGwgYXR0ZW1wdCB0byByZXR1cm5cclxuICAgICAgICAgKiB0aGUgY3VycmVudGx5IGJvdW5kIGNvbnRleHQuIElmIG5vIGNvbnRleHQgaXMgYm91bmQsIGl0IHdpbGwgcmV0dXJuXHJcbiAgICAgICAgICogJ2ZhbHNlJy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXh0ZW5zaW9uIC0gVGhlIGV4dGVuc2lvbiBuYW1lLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBwcm92aWRlZCBleHRlbnNpb24gaGFzIGJlZW4gbG9hZGVkIHN1Y2Nlc3NmdWxseS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjaGVja0V4dGVuc2lvbjogZnVuY3Rpb24oIGFyZywgZXh0ZW5zaW9uICkge1xyXG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9ucyxcclxuICAgICAgICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBjYW52YXM7XHJcbiAgICAgICAgICAgIGlmICggIWV4dGVuc2lvbiApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNhbiBjaGVjayBleHRlbnNpb24gd2l0aG91dCBhcmdcclxuICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IGFyZztcclxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBfYm91bmRDb250ZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FudmFzID0gZ2V0Q2FudmFzKCBhcmcgKTtcclxuICAgICAgICAgICAgICAgIGlmICggY2FudmFzICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQgPSBfY29udGV4dHNCeUlkWyBjYW52YXMuaWQgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoICFjb250ZXh0ICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIHByb3ZpZGVkIGFzIFwiICtcclxuICAgICAgICAgICAgICAgICAgICBcImFyZ3VtZW50LCByZXR1cm5pbmcgZmFsc2UuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV4dGVuc2lvbnMgPSBjb250ZXh0LmV4dGVuc2lvbnM7XHJcbiAgICAgICAgICAgIHJldHVybiBleHRlbnNpb25zWyBleHRlbnNpb24gXSA/IGV4dGVuc2lvbnNbIGV4dGVuc2lvbiBdIDogZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQW5pbWF0aW9uKCBzcGVjICkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IHNwZWMudGFyZ2V0cztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbjtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFsZmFkb3IgPSByZXF1aXJlKCdhbGZhZG9yJyksXHJcbiAgICAgICAgVHJhbnNmb3JtID0gYWxmYWRvci5UcmFuc2Zvcm0sXHJcbiAgICAgICAgTWF0NDQgPSBhbGZhZG9yLk1hdDQ0LFxyXG4gICAgICAgIEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XHJcblxyXG4gICAgZnVuY3Rpb24gQ2FtZXJhKCBzcGVjICkge1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvciBmb3IgdHJhbnNmb3JtXHJcbiAgICAgICAgVHJhbnNmb3JtLmNhbGwoIHRoaXMsIHNwZWMgKTtcclxuICAgICAgICAvLyBzZXQgaWQgaWYgdGhlcmUgaXMgb25lXHJcbiAgICAgICAgaWYgKCBzcGVjLmlkICkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gc3BlYy5pZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLnByb2plY3Rpb24gKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdGlvbk1hdHJpeCggc3BlYy5wcm9qZWN0aW9uICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uTWF0cml4KHtcclxuICAgICAgICAgICAgICAgIGZvdjogNDUsXHJcbiAgICAgICAgICAgICAgICBhc3BlY3Q6IDQvMyxcclxuICAgICAgICAgICAgICAgIG1pblo6IDAuMSxcclxuICAgICAgICAgICAgICAgIG1heFo6IDEwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBwYXJlbnRcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHNwZWMucGFyZW50IHx8IG51bGw7XHJcbiAgICAgICAgLy8gc2V0IGNoaWxkcmVuXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGlmICggc3BlYy5jaGlsZHJlbiApIHtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPHNwZWMuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKCBzcGVjLmNoaWxkcmVuW2ldICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgQ2FtZXJhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEVudGl0eS5wcm90b3R5cGUgKTtcclxuXHJcbiAgICBDYW1lcmEucHJvdG90eXBlLnByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbiggcHJvamVjdGlvbiApIHtcclxuICAgICAgICBpZiAoIHByb2plY3Rpb24gKSB7XHJcbiAgICAgICAgICAgIGlmICggcHJvamVjdGlvbiBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gbmV3IE1hdDQ0KCBwcm9qZWN0aW9uICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHByb2plY3Rpb24gaW5zdGFuY2VvZiBNYXQ0NCApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGlvbiA9IHByb2plY3Rpb247XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBNYXQ0NC5wZXJzcGVjdGl2ZShcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLmZvdiB8fCA0NSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLmFzcGVjdCB8fCA0LzMsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbi56TWluIHx8IDAuMSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnpNYXggfHwgMTAwMCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBDYW1lcmEucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IG5ldyBDYW1lcmEoe1xyXG4gICAgICAgICAgICAgICAgdXA6IHRoaXMudXAoKSxcclxuICAgICAgICAgICAgICAgIGZvcndhcmQ6IHRoaXMuZm9yd2FyZCgpLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbigpLFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbjogbmV3IE1hdDQ0KCB0aGlzLnByb2plY3Rpb24gKVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBjb3B5IGNoaWxkcmVuIGJ5IHZhbHVlXHJcbiAgICAgICAgZm9yICggaT0wOyBpPHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHRoYXQuYWRkQ2hpbGQoIHRoaXMuY2hpbGRyZW5baV0uY29weSgpICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENhbWVyYTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2FsZmFkb3InKS5UcmFuc2Zvcm0sXHJcbiAgICAgICAgTWVzaCA9IHJlcXVpcmUoJy4vTWVzaCcpLFxyXG4gICAgICAgIFNwcml0ZSA9IHJlcXVpcmUoJy4vU3ByaXRlJyksXHJcbiAgICAgICAgU2tlbGV0b24gPSByZXF1aXJlKCcuL1NrZWxldG9uJyksXHJcbiAgICAgICAgQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9BbmltYXRpb24nKTtcclxuXHJcbiAgICBmdW5jdGlvbiBFbnRpdHkoIHNwZWMgKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvciBmb3IgdHJhbnNmb3JtXHJcbiAgICAgICAgVHJhbnNmb3JtLmNhbGwoIHRoaXMsIHNwZWMgKTtcclxuICAgICAgICAvLyBzZXQgaWQgaWYgdGhlcmUgaXMgb25lXHJcbiAgICAgICAgaWYgKCBzcGVjLmlkICkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gc3BlYy5pZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHBhcmVudFxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gc3BlYy5wYXJlbnQgfHwgbnVsbDtcclxuICAgICAgICAvLyBzZXQgY2hpbGRyZW5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgaWYgKCBzcGVjLmNoaWxkcmVuICkge1xyXG4gICAgICAgICAgICBzcGVjLmNoaWxkcmVuLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCApIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuYWRkQ2hpbGQoIGNoaWxkICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWVzaGVzXHJcbiAgICAgICAgdGhpcy5tZXNoZXMgPSBbXTtcclxuICAgICAgICBpZiAoIHNwZWMubWVzaGVzICkge1xyXG4gICAgICAgICAgICBzcGVjLm1lc2hlcy5mb3JFYWNoKCBmdW5jdGlvbiggbWVzaCApIHtcclxuICAgICAgICAgICAgICAgIGlmICggbWVzaCBpbnN0YW5jZW9mIE1lc2ggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5tZXNoZXMucHVzaCggbWVzaCApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1lc2hlcy5wdXNoKCBuZXcgTWVzaCggbWVzaCApICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgc3ByaXRlc1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcyA9IFtdO1xyXG4gICAgICAgIGlmICggc3BlYy5zcHJpdGVzICkge1xyXG4gICAgICAgICAgICBzcGVjLnNwcml0ZXMuZm9yRWFjaCggZnVuY3Rpb24oIHNwcml0ZSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggc3ByaXRlIGluc3RhbmNlb2YgU3ByaXRlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc3ByaXRlcy5wdXNoKCBzcHJpdGUgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zcHJpdGVzLnB1c2goIG5ldyBTcHJpdGUoIHNwcml0ZSApICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgc2tlbGV0b24sIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b24gPSBudWxsO1xyXG4gICAgICAgIGlmICggc3BlYy5za2VsZXRvbiApIHtcclxuICAgICAgICAgICAgaWYgKCBzcGVjLnNrZWxldG9uIGluc3RhbmNlb2YgU2tlbGV0b24gKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNrZWxldG9uID0gc3BlYy5za2VsZXRvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2tlbGV0b24gPSBuZXcgU2tlbGV0b24oIHNwZWMuc2tlbGV0b24gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgYW5pbWF0aW9ucywgaWYgdGhleSBleGlzdFxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9ucyA9IHt9O1xyXG4gICAgICAgIGlmICggc3BlYy5hbmltYXRpb25zICkge1xyXG4gICAgICAgICAgICBmb3IgKCB2YXIga2V5IGluIHNwZWMuYW5pbWF0aW9ucyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggc3BlYy5hbmltYXRpb25zLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHNwZWMuYW5pbWF0aW9uc1sga2V5IF0gaW5zdGFuY2VvZiBBbmltYXRpb24gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uc1sga2V5IF0gPSBzcGVjLmFuaW1hdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zWyBrZXkgXSA9IG5ldyBBbmltYXRpb24oIHNwZWMuYW5pbWF0aW9ucyApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBFbnRpdHkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVHJhbnNmb3JtLnByb3RvdHlwZSApO1xyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUuZ2xvYmFsTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCB0aGlzLnBhcmVudCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lmdsb2JhbE1hdHJpeCgpLm11bHQoIHRoaXMubWF0cml4KCkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0cml4KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUuZ2xvYmFsVmlld01hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICggdGhpcy5wYXJlbnQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tdWx0KCB0aGlzLm1hdHJpeCgpICkudmlld01hdHJpeCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy52aWV3TWF0cml4KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiggY2hpbGQgKSB7XHJcbiAgICAgICAgaWYgKCAhKCBjaGlsZCBpbnN0YW5jZW9mIEVudGl0eSApICkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IG5ldyBFbnRpdHkoIGNoaWxkICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKCBjaGlsZCApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBFbnRpdHkucHJvdG90eXBlLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24oIGNoaWxkICkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZiggY2hpbGQgKTtcclxuICAgICAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoIGluZGV4LCAxICk7XHJcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBFbnRpdHkucHJvdG90eXBlLmRlcHRoRmlyc3QgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgY2FsbGJhY2soIHRoaXMgKTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCApIHtcclxuICAgICAgICAgICAgY2hpbGQuZGVwdGhGaXJzdCggY2FsbGJhY2sgKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5icmVhZHRoRmlyc3QgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIHF1ZXVlID0gWyB0aGlzIF07XHJcbiAgICAgICAgd2hpbGUgKCBxdWV1ZS5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICB2YXIgdG9wID0gcXVldWUuc2hpZnQoKTtcclxuICAgICAgICAgICAgcXVldWUgPSBxdWV1ZS5jb25jYXQoIHF1ZXVlLCB0b3AuY2hpbGRyZW4gKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soIHRvcCApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSBuZXcgRW50aXR5KHtcclxuICAgICAgICAgICAgICAgIHVwOiB0aGlzLnVwKCksXHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkOiB0aGlzLmZvcndhcmQoKSxcclxuICAgICAgICAgICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4oKSxcclxuICAgICAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlKCksXHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IHRoaXMubWVzaGVzLCAvLyBjb3B5IGJ5IHJlZmVyZW5jZVxyXG4gICAgICAgICAgICAgICAgc3ByaXRlczogdGhpcy5zcHJpdGVzLCAvLyBjb3B5IGJ5IHJlZmVyZW5jZVxyXG4gICAgICAgICAgICAgICAgc2tlbGV0b246IHRoaXMuc2tlbGV0b24sIC8vIGNvcHkgYnkgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb25zOiB0aGlzLmFuaW1hdGlvbnMgLy8gY29weSBieSByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gY29weSBjaGlsZHJlbiBieSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkICkge1xyXG4gICAgICAgICAgICB0aGF0LmFkZENoaWxkKCBjaGlsZC5jb3B5KCkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhhdDtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBmdW5jdGlvbiBHZW9tZXRyeSggc3BlYyApIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBzcGVjLnBvc2l0aW9ucztcbiAgICAgICAgdGhpcy51dnMgPSBzcGVjLnV2cztcbiAgICAgICAgdGhpcy5ub3JtYWxzID0gc3BlYy5ub3JtYWxzO1xuICAgICAgICB0aGlzLnRhbmdlbnRzID0gc3BlYy50YW5nZW50cztcbiAgICAgICAgdGhpcy5iaXRhbmdlbnRzID0gc3BlYy5iaXRhbmdlbnRzO1xuICAgICAgICB0aGlzLmluZGljZXMgPSBzcGVjLmluZGljZXM7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gSm9pbnQoIHNwZWMgKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IHNwZWMuaWQ7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gc3BlYy5uYW1lO1xyXG4gICAgICAgIHRoaXMuYmluZE1hdHJpeCA9IHNwZWMuYmluZE1hdHJpeDtcclxuICAgICAgICB0aGlzLmludmVyc2VCaW5kTWF0cml4ID0gc3BlYy5pbnZlcnNlQmluZE1hdHJpeDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHNwZWMucGFyZW50O1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBzcGVjLmNoaWxkcmVuO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBzcGVjLmluZGV4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIEpvaW50LnByb3RvdHlwZS5za2lubmluZ01hdHJpeCA9IGZ1bmN0aW9uKCBiaW5kU2hhcGVNYXRyaXgsIHBvc2VNYXRyaXggKSB7XHJcbiAgICAgICAgLy8gaWYgbm8gcG9zZSBtYXRyaXggaXMgcHJvdmlkZWQsIGRlZmF1bHQgdG8gYmluZCBwb3NpdGlvblxyXG4gICAgICAgIHBvc2VNYXRyaXggPSBwb3NlTWF0cml4IHx8IHRoaXMuYmluZE1hdHJpeDtcclxuICAgICAgICAvLyB1cGRhdGUgZ2xvYmFsVHJhbnNmb3JtLCBjaGlsZHJlbiB3aWxsIHJlbHkgb24gdGhlc2VcclxuICAgICAgICBpZiAoIHRoaXMucGFyZW50ICkge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbE1hdHJpeCA9IHRoaXMucGFyZW50Lmdsb2JhbE1hdHJpeC5tdWx0KCBwb3NlTWF0cml4ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxNYXRyaXggPSBwb3NlTWF0cml4O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXR1cm4gc2tpbm5pbmcgbWF0cml4XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsTWF0cml4Lm11bHQoIHRoaXMuaW52ZXJzZUJpbmRNYXRyaXgubXVsdCggYmluZFNoYXBlTWF0cml4ICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBKb2ludDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4uL2NvcmUvVGV4dHVyZTJEJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVGV4dHVyZSggdGV4dHVyZSApIHtcclxuICAgICAgICBpZiAoICF0ZXh0dXJlICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhKCB0ZXh0dXJlIGluc3RhbmNlb2YgVGV4dHVyZTJEICkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVGV4dHVyZTJEKHtcclxuICAgICAgICAgICAgICAgIGltYWdlOiB0ZXh0dXJlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZUNvbG9yKCBjb2xvciApIHtcclxuICAgICAgICBpZiAoIGNvbG9yIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdIHx8IDEuMCBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWwoIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5pZCA9IHNwZWMuaWQ7XHJcbiAgICAgICAgdGhpcy5kaWZmdXNlQ29sb3IgPSBwYXJzZUNvbG9yKCBzcGVjLmRpZmZ1c2VDb2xvciApIHx8IFsgMSwgMCwgMSwgMSBdO1xyXG4gICAgICAgIHRoaXMuZGlmZnVzZVRleHR1cmUgPSBjcmVhdGVUZXh0dXJlKCBzcGVjLmRpZmZ1c2VUZXh0dXJlICkgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmFtYmllbnRDb2xvciA9IHBhcnNlQ29sb3IoIHNwZWMuYW1iaWVudENvbG9yICkgfHwgWyAwLCAwLCAwLCAxIF07XHJcbiAgICAgICAgdGhpcy5hbWJpZW50VGV4dHVyZSA9IGNyZWF0ZVRleHR1cmUoIHNwZWMuYW1iaWVudFRleHR1cmUgKSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuc3BlY3VsYXJDb2xvciA9IHBhcnNlQ29sb3IoIHNwZWMuc3BlY3VsYXJDb2xvciApIHx8IFsgMSwgMSwgMSwgMSBdO1xyXG4gICAgICAgIHRoaXMuc3BlY3VsYXJUZXh0dXJlID0gY3JlYXRlVGV4dHVyZSggc3BlYy5zcGVjdWxhclRleHR1cmUgKSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuc3BlY3VsYXJDb21wb25lbnQgPSBzcGVjLnNwZWN1bGFyQ29tcG9uZW50IHx8IDEwO1xyXG4gICAgICAgIHRoaXMucmVmbGVjdGlvbiA9ICggc3BlYy5yZWZsZWN0aW9uICE9PSB1bmRlZmluZWQgKSA/IHNwZWMucmVmbGVjdGlvbiA6IDA7XHJcbiAgICAgICAgdGhpcy5yZWZyYWN0aW9uID0gKCBzcGVjLnJlZnJhY3Rpb24gIT09IHVuZGVmaW5lZCApID8gc3BlYy5yZWZyYWN0aW9uIDogMDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0dlb21ldHJ5JyksXHJcbiAgICAgICAgUmVuZGVyYWJsZSA9IHJlcXVpcmUoJy4vUmVuZGVyYWJsZScpLFxyXG4gICAgICAgIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9NYXRlcmlhbCcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1lc2goIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgLy8gc2V0IGdlb21ldHJ5XHJcbiAgICAgICAgaWYgKCBzcGVjLmdlb21ldHJ5ICkge1xyXG4gICAgICAgICAgICBpZiAoIHNwZWMuZ2VvbWV0cnkgaW5zdGFuY2VvZiBHZW9tZXRyeSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VvbWV0cnkgPSBzcGVjLmdlb21ldHJ5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSggc3BlYy5nZW9tZXRyeSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSggc3BlYyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgcmVuZGVyYWJsZVxyXG4gICAgICAgIGlmICggc3BlYy5yZW5kZXJhYmxlICkge1xyXG4gICAgICAgICAgICBpZiAoIHNwZWMucmVuZGVyYWJsZSBpbnN0YW5jZW9mIFJlbmRlcmFibGUgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmFibGUgPSBzcGVjLnJlbmRlcmFibGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmFibGUgPSBuZXcgUmVuZGVyYWJsZSggc3BlYy5yZW5kZXJhYmxlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmFibGUgPSBuZXcgUmVuZGVyYWJsZSggc3BlYyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWF0ZXJpYWxcclxuICAgICAgICBpZiAoIHNwZWMubWF0ZXJpYWwgKSB7XHJcbiAgICAgICAgICAgIGlmICggc3BlYy5tYXRlcmlhbCBpbnN0YW5jZW9mIE1hdGVyaWFsICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbCA9IHNwZWMubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCBzcGVjLm1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCBzcGVjICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1lc2gucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmFibGUuZHJhdygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1lc2g7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgYWxmYWRvciA9IHJlcXVpcmUoJ2FsZmFkb3InKSxcclxuICAgICAgICBUcmlhbmdsZSA9IGFsZmFkb3IuVHJpYW5nbGUsXHJcbiAgICAgICAgVmVjMyA9IGFsZmFkb3IuVmVjMyxcclxuICAgICAgICBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpLFxyXG4gICAgICAgIE1lc2ggPSByZXF1aXJlKCcuL01lc2gnKSxcclxuICAgICAgICBERUZBVUxUX0RFUFRIID0gNCxcclxuICAgICAgICBNSU5fVkVDID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIE51bWJlci5NSU5fVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NSU5fVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NSU5fVkFMVUUgKSxcclxuICAgICAgICBNQVhfVkVDID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIE51bWJlci5NQVhfVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NQVhfVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NQVhfVkFMVUUgKSxcclxuICAgICAgICBfY3ViZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmRzIHRoZSBtaW5pbnVtIGFuZCBtYXhpbXVtIGJvdW5kaW5nIGV4dGVudHMgd2l0aGluIGEgc2V0IG9mIHRyaWFuZ2xlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0cmlhbmdsZXMgLSBUaGUgYXJyYXkgb2YgdHJpYW5nbGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHBvaW50cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWluTWF4KCB0cmlhbmdsZXMgKSB7XHJcbiAgICAgICAgdmFyIG1pbiA9IE1BWF9WRUMsXHJcbiAgICAgICAgICAgIG1heCA9IE1JTl9WRUMsXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlLFxyXG4gICAgICAgICAgICBhLCBiLCBjLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTx0cmlhbmdsZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHRyaWFuZ2xlID0gdHJpYW5nbGVzW2ldO1xyXG4gICAgICAgICAgICBhID0gdHJpYW5nbGUuYTtcclxuICAgICAgICAgICAgYiA9IHRyaWFuZ2xlLmI7XHJcbiAgICAgICAgICAgIGMgPSB0cmlhbmdsZS5jO1xyXG4gICAgICAgICAgICAvLyBnZXQgbWluXHJcbiAgICAgICAgICAgIG1pbi54ID0gTWF0aC5taW4oIG1pbi54LCBNYXRoLm1pbiggTWF0aC5taW4oIGEueCwgYi54ICksIGMueCApICk7XHJcbiAgICAgICAgICAgIG1pbi55ID0gTWF0aC5taW4oIG1pbi55LCBNYXRoLm1pbiggTWF0aC5taW4oIGEueSwgYi55ICksIGMueSApICk7XHJcbiAgICAgICAgICAgIG1pbi56ID0gTWF0aC5taW4oIG1pbi56LCBNYXRoLm1pbiggTWF0aC5taW4oIGEueiwgYi56ICksIGMueiApICk7XHJcbiAgICAgICAgICAgIC8vIGdldCBtYXhcclxuICAgICAgICAgICAgbWF4LnggPSBNYXRoLm1heCggbWF4LngsIE1hdGgubWF4KCBNYXRoLm1heCggYS54LCBiLnggKSwgYy54ICkgKTtcclxuICAgICAgICAgICAgbWF4LnkgPSBNYXRoLm1heCggbWF4LnksIE1hdGgubWF4KCBNYXRoLm1heCggYS55LCBiLnkgKSwgYy55ICkgKTtcclxuICAgICAgICAgICAgbWF4LnogPSBNYXRoLm1heCggbWF4LnosIE1hdGgubWF4KCBNYXRoLm1heCggYS56LCBiLnogKSwgYy56ICkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWluOiBtaW4sXHJcbiAgICAgICAgICAgIG1heDogbWF4XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc2VydHMgYSB0cmlhbmdsZSBpbnRvIHRoZSBvY3RyZWVzIGNoaWxkIGRlcGVuZGluZyBvbiBpdHMgcG9zaXRpb25cclxuICAgICAqIHdpdGhpbiB0aGUgbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09jdHJlZX0gb2N0cmVlIC0gVGhlIG9jdHJlZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IGluZGV4IC0gVGhlIGNoaWxkIGluZGV4IGZyb20gMC03XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdHJpYW5nbGUgLSBUaGUgdHJpYW5nbGUgb2JqZWN0IHRvIGJlIGluc2VydGVkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbnNlcnRJbnRvQ2hpbGQoIG9jdHJlZSwgaW5kZXgsIHRyaWFuZ2xlICkge1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSBuZXcgVmVjMyggMCwgMCwgMCApLFxyXG4gICAgICAgICAgICBzdGVwO1xyXG4gICAgICAgIGlmICggb2N0cmVlLmNoaWxkcmVuWyBpbmRleCBdICkge1xyXG4gICAgICAgICAgICAvLyBjaGlsZCBhbHJlYWR5IGV4aXN0cywgcmVjdXJzaXZlbHkgaW5zZXJ0XHJcbiAgICAgICAgICAgIG9jdHJlZS5jaGlsZHJlblsgaW5kZXggXS5pbnNlcnQoIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY2hpbGQgZG9lcyBub3QgZXhpc3RcclxuICAgICAgICAgICAgLy8gaWYgdGVybWluYWwgZGVwdGggaGFzIG5vdCBiZWVuIHJlYWNoZWQsIGNyZWF0ZSBjaGlsZCBub2RlXHJcbiAgICAgICAgICAgIGlmICggb2N0cmVlLmRlcHRoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHN0ZXAgPSBvY3RyZWUuaGFsZldpZHRoIC8gMjtcclxuICAgICAgICAgICAgICAgIG9mZnNldC54ID0gKCAoaW5kZXggJiAxKSA/IHN0ZXAgOiAtc3RlcCApO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0LnkgPSAoIChpbmRleCAmIDIpID8gc3RlcCA6IC1zdGVwICk7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQueiA9ICggKGluZGV4ICYgNCkgPyBzdGVwIDogLXN0ZXAgKTtcclxuICAgICAgICAgICAgICAgIC8vIHBhc3MgbnVsbCB0cmlhbmdsZXMgYXJnIHRvIGZvcmNlIGVsc2UgaW4gY29uc3RydWN0b3JcclxuICAgICAgICAgICAgICAgIG9jdHJlZS5jaGlsZHJlblsgaW5kZXggXSA9IG5ldyBPY3RyZWUoIG51bGwsIHtcclxuICAgICAgICAgICAgICAgICAgIGNlbnRlcjogb2N0cmVlLmNlbnRlci5hZGQoIG9mZnNldCApLFxyXG4gICAgICAgICAgICAgICAgICAgaGFsZldpZHRoOiBzdGVwLFxyXG4gICAgICAgICAgICAgICAgICAgZGVwdGggOiBvY3RyZWUuZGVwdGgtMVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBvY3RyZWUuY2hpbGRyZW5bIGluZGV4IF0uaW5zZXJ0KCB0cmlhbmdsZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgcG9pbnQgYW5kXHJcbiAgICAgKiBhbiBvY3RyZWUncyBjaGlsZCdzIEFBQkIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPY3RyZWV9IG9jdHJlZSAtIFRoZSBvY3RyZWUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIG1lYXN1cmUgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gY2hpbGQgLSBUaGUgQUFCQiBjaGlsZCBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3F1YXJlZCBkaXN0YW5jZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc3FyRGlzdEZyb21Qb2ludCggb2N0cmVlLCBwb2ludCwgY2hpbGQgKSB7XHJcbiAgICAgICAgLy8gc2hpZnQgQUFCQiBkaW1lc2lvbnMgYmFzZWQgb24gd2hpY2ggY2hpbGQgY2VsbCBpcyBiZWdpbiB0ZXN0ZWRcclxuICAgICAgICB2YXIgb2Zmc2V0Q2VudGVyID0gbmV3IFZlYzMoIG9jdHJlZS5jZW50ZXIgKSxcclxuICAgICAgICAgICAgc3RlcCA9IG9jdHJlZS5oYWxmV2lkdGggLyAyLFxyXG4gICAgICAgICAgICBzcXJEaXN0ID0gMCxcclxuICAgICAgICAgICAgbWluQUFCQixcclxuICAgICAgICAgICAgbWF4QUFCQjtcclxuICAgICAgICBvZmZzZXRDZW50ZXIueCArPSAoIChjaGlsZCAmIDEpID8gc3RlcCA6IC1zdGVwICk7XHJcbiAgICAgICAgb2Zmc2V0Q2VudGVyLnkgKz0gKCAoY2hpbGQgJiAyKSA/IHN0ZXAgOiAtc3RlcCApO1xyXG4gICAgICAgIG9mZnNldENlbnRlci56ICs9ICggKGNoaWxkICYgNCkgPyBzdGVwIDogLXN0ZXAgKTtcclxuICAgICAgICBtaW5BQUJCID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIG9mZnNldENlbnRlci54IC0gc3RlcCxcclxuICAgICAgICAgICAgb2Zmc2V0Q2VudGVyLnkgLSBzdGVwLFxyXG4gICAgICAgICAgICBvZmZzZXRDZW50ZXIueiAtIHN0ZXAgKTtcclxuICAgICAgICBtYXhBQUJCID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIG9mZnNldENlbnRlci54ICsgc3RlcCxcclxuICAgICAgICAgICAgb2Zmc2V0Q2VudGVyLnkgKyBzdGVwLFxyXG4gICAgICAgICAgICBvZmZzZXRDZW50ZXIueiArIHN0ZXAgKTtcclxuICAgICAgICAvLyBGb3IgZWFjaCBheGlzIGNvdW50IGFueSBleGNlc3MgZGlzdGFuY2Ugb3V0c2lkZSBib3ggZXh0ZW50c1xyXG4gICAgICAgIC8vIHhcclxuICAgICAgICBpZiAocG9pbnQueCA8IG1pbkFBQkIueCkgeyBzcXJEaXN0ICs9IChtaW5BQUJCLnggLSBwb2ludC54KSAqIChtaW5BQUJCLnggLSBwb2ludC54KTsgfVxyXG4gICAgICAgIGlmIChwb2ludC54ID4gbWF4QUFCQi54KSB7IHNxckRpc3QgKz0gKHBvaW50LnggLSBtYXhBQUJCLngpICogKHBvaW50LnggLSBtYXhBQUJCLngpOyB9XHJcbiAgICAgICAgLy8geVxyXG4gICAgICAgIGlmIChwb2ludC55IDwgbWluQUFCQi55KSB7IHNxckRpc3QgKz0gKG1pbkFBQkIueSAtIHBvaW50LnkpICogKG1pbkFBQkIueSAtIHBvaW50LnkpOyB9XHJcbiAgICAgICAgaWYgKHBvaW50LnkgPiBtYXhBQUJCLnkpIHsgc3FyRGlzdCArPSAocG9pbnQueSAtIG1heEFBQkIueSkgKiAocG9pbnQueSAtIG1heEFBQkIueSk7IH1cclxuICAgICAgICAvLyB6XHJcbiAgICAgICAgaWYgKHBvaW50LnogPCBtaW5BQUJCLnopIHsgc3FyRGlzdCArPSAobWluQUFCQi56IC0gcG9pbnQueikgKiAobWluQUFCQi56IC0gcG9pbnQueik7IH1cclxuICAgICAgICBpZiAocG9pbnQueiA+IG1heEFBQkIueikgeyBzcXJEaXN0ICs9IChwb2ludC56IC0gbWF4QUFCQi56KSAqIChwb2ludC56IC0gbWF4QUFCQi56KTsgfVxyXG4gICAgICAgIHJldHVybiBzcXJEaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgYSBzcGhlcmUgZGVmaW5lZCBieSBhIHBvaW50IGFuZCByYWRpdXMgaW50ZXJzZWN0cyBhbiBvY3RyZWUnc1xyXG4gICAgICogY2hpbGQncyBBQUJCLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2N0cmVlfSBvY3RyZWUgLSBUaGUgb2N0cmVlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZW50ZXIgLSBUaGUgY2VudGVyIG9mIHRoZSBzcGhlcmUgdG8gbWVhc3VyZSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIHNwaGVyZS5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gY2hpbGQgLSBUaGUgQUFCQiBjaGlsZCBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaW50ZXJlY3RzIHRoZSBBQUJCIGNoaWxkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzcGhlcmVDaGVjayggb2N0cmVlLCBjZW50ZXIsIHJhZGl1cywgY2hpbGQgKSB7XHJcbiAgICAgICAgLy8gY29tcHV0ZSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gc3BoZXJlIGNlbnRyZSBhbmQgQUFCQlxyXG4gICAgICAgIHZhciBkaXN0ID0gc3FyRGlzdEZyb21Qb2ludCggb2N0cmVlLCBjZW50ZXIsIGNoaWxkICk7XHJcbiAgICAgICAgLy8gc3BoZXJlIGFuZCBBQUJCIGludGVyc2VjdCBpZiB0aGUgZGlzdGFuY2UgaXMgbGVzcyB0aGFuIHRoZSByYWRpdXNcclxuICAgICAgICByZXR1cm4gZGlzdCA8PSByYWRpdXMqcmFkaXVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgc2luZ2xldG9uIGN1YmUgTWVzaCBvYmplY3QgZm9yIHRoZSBvY3RyZWUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01lc2h9IFRoZSBzaW5nbGV0b24gY3ViZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q3ViZU1lc2goKSB7XHJcbiAgICAgICAgaWYgKCAhX2N1YmUgKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZnJvbnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgICAgIFsgLTEsIC0xLCAxIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAxLCAtMSwgMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgMSwgMSwgMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgLTEsIDEsIDEgXSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBiYWNrIGZhY2VcclxuICAgICAgICAgICAgICAgICAgICBbIC0xLCAtMSwgLTEgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIDEsIC0xLCAtMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgMSwgMSwgLTEgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIC0xLCAxLCAtMSBdXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyBmcm9udFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDEsIDEsIDIsIDIsIDMsIDMsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2lkZXNcclxuICAgICAgICAgICAgICAgICAgICAwLCA0LCAxLCA1LCAyLCA2LCAzLCA3LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhY2tcclxuICAgICAgICAgICAgICAgICAgICA0LCA1LCA1LCA2LCA2LCA3LCA3LCA0XHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBfY3ViZSA9IG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uczogcG9zaXRpb25zLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBcIkxJTkVTXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfY3ViZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhbiBhcnJheSBvZiBFbnRpdHkgb2JqZWN0cyB3aXRoIGEgTWVzaCBjb21wb25lbnQgZm9yIHRoZVxyXG4gICAgICogb2N0cmVlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2N0cmVlfSBvY3RyZWUgLSBUaGUgb2N0cmVlIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBvZiBlbnRpdGllcy5cclxuICAgICAqL1xyXG4gICBmdW5jdGlvbiBnZW5lcmF0ZVN1YkVudGl0aWVzKCBvY3RyZWUgKSB7XHJcbiAgICAgICAgdmFyIGVudGl0aWVzID0gW10sXHJcbiAgICAgICAgICAgIGNvdW50ID0gMCxcclxuICAgICAgICAgICAgZW50aXR5LFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBlbnRpdHkgZm9yIG9jdHJlZVxyXG4gICAgICAgIGVudGl0eSA9IG5ldyBFbnRpdHkoe1xyXG4gICAgICAgICAgICBtZXNoZXM6IFsgZ2V0Q3ViZU1lc2goKSBdLFxyXG4gICAgICAgICAgICBvcmlnaW46IG9jdHJlZS5jZW50ZXIsXHJcbiAgICAgICAgICAgIHNjYWxlOiBvY3RyZWUuaGFsZldpZHRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggY2hpbGRcclxuICAgICAgICBmb3IgKCBpPTA7IGk8ODsgaSsrICkge1xyXG4gICAgICAgICAgICAvLyBpZiBjaGlsZCBleGlzdHNcclxuICAgICAgICAgICAgaWYgKCBvY3RyZWUuY2hpbGRyZW5baV0gKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRpdGllcyA9IGVudGl0aWVzLmNvbmNhdChcclxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVN1YkVudGl0aWVzKCBvY3RyZWUuY2hpbGRyZW5baV0gKSApO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvbmx5IGNyZWF0ZSBpZiB0aGlzIG9jdHJlZSBjb250YWlucyBvYmplY3RzLCBvciBoYXMgY2hpbGRyZW4gdGhhdFxyXG4gICAgICAgIC8vIGNvbnRhaW4gb2JqZWN0c1xyXG4gICAgICAgIGlmICggb2N0cmVlLmNvbnRhaW5lZC5sZW5ndGggPiAwIHx8IGNvdW50ID4gMCApIHtcclxuICAgICAgICAgICAgZW50aXRpZXMucHVzaCggbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IFsgZ2V0Q3ViZU1lc2goKSBdLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luOiBvY3RyZWUuY2VudGVyLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IG9jdHJlZS5oYWxmV2lkdGhcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYW5kIHJldHVybiBlbnRpdHlcclxuICAgICAgICByZXR1cm4gZW50aXRpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmVzIHRoYXQgdGhlIHByb3ZpZGVkIHRyaWFuZ2xlcyBhcmUgb2YgdHlwZSBUcmlhbmdsZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0cmlhbmdsZXMgLSBUaGUgYXJyYXkgb2YgdHJpYW5nbGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIFRyaWFuZ2xlIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlVHJpYW5nbGVzKCB0cmlhbmdsZXMgKSB7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPHRyaWFuZ2xlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgaWYgKCAhKCB0cmlhbmdsZXNbaV0gaW5zdGFuY2VvZiBUcmlhbmdsZSApICkge1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzW2ldID0gbmV3IFRyaWFuZ2xlKCB0cmlhbmdsZXNbaV0ucG9zaXRpb25zICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyaWFuZ2xlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBPY3RyZWUoIHRyaWFuZ2xlcywgb3B0aW9ucyApIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICBpZiAoIHRyaWFuZ2xlcyApIHtcclxuICAgICAgICAgICAgLy8gaWYgdHJpYW5nbGVzIGFyZSBnaXZlbiwgYnVpbGQgdGhlIG9jdHJlZVxyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkKCB0cmlhbmdsZXMsIG9wdGlvbnMuZGVwdGggfHwgREVGQVVMVF9ERVBUSCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGVsc2UgY2FzZSBpcyBmb3IgcmVjdXJzaW9uIGR1cmluZyBidWlsZGluZ1xyXG4gICAgICAgICAgICB0aGlzLmNlbnRlciA9IG9wdGlvbnMuY2VudGVyO1xyXG4gICAgICAgICAgICB0aGlzLmhhbGZXaWR0aCA9IG9wdGlvbnMuaGFsZldpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmRlcHRoID0gb3B0aW9ucy5kZXB0aDtcclxuICAgICAgICAgICAgLy8gY2FsbCBjbGVhciB0byBpbml0aWFsaXplIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkcyB0aGUgb2N0cmVlIGZyb20gYW4gYXJyYXkgb2YgdHJpYW5nbGVzIHRvIGEgc3BlY2lmaWVkIGRlcHRoLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRyaWFuZ2xlcyAtIFRoZSBhcnJheSBvZiB0cmlhbmdsZXMgdG8gY29udGFpbi5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gZGVwdGggLSBUaGUgbGV2ZWxzIG9mIGRlcHRoIGZvciB0aGUgb2N0cmVlLlxyXG4gICAgICovXHJcbiAgICBPY3RyZWUucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oIHRyaWFuZ2xlcywgZGVwdGggKSB7XHJcbiAgICAgICAgdmFyIG1tLFxyXG4gICAgICAgICAgICBtaW5EaWZmLFxyXG4gICAgICAgICAgICBtYXhEaWZmLFxyXG4gICAgICAgICAgICBsYXJnZXN0TWluLFxyXG4gICAgICAgICAgICBsYXJnZXN0TWF4LFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgdHJpYW5nbGVzIGludG8gcHJvcGVyIGZvcm1hdCBpZiBuZWVkIGJlXHJcbiAgICAgICAgdHJpYW5nbGVzID0gcGFyc2VUcmlhbmdsZXMoIHRyaWFuZ2xlcyApO1xyXG4gICAgICAgIC8vIGdldCBtaW4gbWF4IGV4dGVudHNcclxuICAgICAgICBtbSA9IG1pbk1heCggdHJpYW5nbGVzICk7XHJcbiAgICAgICAgLy8gY2FsbCBjbGVhciB0byBpbml0aWFsaXplIGF0dHJpYnV0ZXNcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgLy8gY2VudHJlIHBvaW50IG9mIG9jdHJlZVxyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbW0ubWluLmFkZCggbW0ubWF4ICkuZGl2KCAyICk7XHJcbiAgICAgICAgdGhpcy5kZXB0aCA9IGRlcHRoIHx8IERFRkFVTFRfREVQVEg7XHJcbiAgICAgICAgLy8gZmluZCBsYXJnZXN0IGRpc3RhbmNlIGNvbXBvbmVudCwgYmVjb21lcyBoYWxmIHdpZHRoXHJcbiAgICAgICAgbWluRGlmZiA9IG1tLm1pbi5zdWIoIHRoaXMuY2VudGVyICk7XHJcbiAgICAgICAgbWF4RGlmZiA9IG1tLm1heC5zdWIoIHRoaXMuY2VudGVyICk7XHJcbiAgICAgICAgbGFyZ2VzdE1pbiA9IE1hdGgubWF4KFxyXG4gICAgICAgICAgICBNYXRoLmFicyggbWluRGlmZi54ICksXHJcbiAgICAgICAgICAgIE1hdGgubWF4KCBNYXRoLmFicyggbWluRGlmZi55ICksXHJcbiAgICAgICAgICAgIE1hdGguYWJzKCBtaW5EaWZmLnogKSApICk7XHJcbiAgICAgICAgbGFyZ2VzdE1heCA9IE1hdGgubWF4KFxyXG4gICAgICAgICAgICBNYXRoLmFicyggbWF4RGlmZi54ICksXHJcbiAgICAgICAgICAgIE1hdGgubWF4KCBNYXRoLmFicyggbWF4RGlmZi55ICksXHJcbiAgICAgICAgICAgIE1hdGguYWJzKCBtYXhEaWZmLnogKSApICk7XHJcbiAgICAgICAgLy8gaGFsZiB3aWR0aCBvZiBvY3RyZWUgY2VsbFxyXG4gICAgICAgIHRoaXMuaGFsZldpZHRoID0gTWF0aC5tYXgoIGxhcmdlc3RNaW4sIGxhcmdlc3RNYXggKTtcclxuICAgICAgICAvLyBpbnNlcnQgdHJpYW5nbGVzIGludG8gb2N0cmVlXHJcbiAgICAgICAgZm9yICggaT0wOyBpPHRyaWFuZ2xlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnQoIHRyaWFuZ2xlc1tpXSApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgYW5kIGluaXRpYWxpemVzIHRoZSBvY3RyZWUuXHJcbiAgICAgKi9cclxuICAgIE9jdHJlZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmVudGl0eSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb250YWluZWQgPSBbXTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW1xyXG4gICAgICAgICAgICBudWxsLCBudWxsLCBudWxsLCBudWxsLFxyXG4gICAgICAgICAgICBudWxsLCBudWxsLCBudWxsLCBudWxsIF07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGEgdHJpYW5nbGUgaW50byB0aGUgb2N0cmVlIHN0cnVjdHVyZS4gVGhpcyBtZXRob2Qgd2l0aCByZWN1cnNpdmVseVxyXG4gICAgICogaW5zZXJ0IGl0IGludG8gY2hpbGQgbm9kZXMgdG8gdGhlIGRlcHRoIG9mIHRoZSB0cmVlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmlhbmdsZSAtIFRoZSB0cmlhbmdsZSB0byBiZSBpbnNlcnRlZCBpbnRvIHRoZSBvY3RyZWUuXHJcbiAgICAgKi9cclxuICAgIE9jdHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oIHRyaWFuZ2xlICkge1xyXG4gICAgICAgIHZhciBjZW50cm9pZCA9IHRyaWFuZ2xlLmNlbnRyb2lkKCksXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IHRyaWFuZ2xlLnJhZGl1cygpLFxyXG4gICAgICAgICAgICAvLyBkaXN0YW5jZSBmcm9tIGVhY2ggYXhpc1xyXG4gICAgICAgICAgICBkeCA9IGNlbnRyb2lkLnggLSB0aGlzLmNlbnRlci54LFxyXG4gICAgICAgICAgICBkeSA9IGNlbnRyb2lkLnkgLSB0aGlzLmNlbnRlci55LFxyXG4gICAgICAgICAgICBkeiA9IGNlbnRyb2lkLnogLSB0aGlzLmNlbnRlci56LFxyXG4gICAgICAgICAgICBjaGlsZDtcclxuICAgICAgICAvLyBvbmx5IGFkZCB0cmlhbmdsZSBpZiBsZWFmIG5vZGVcclxuICAgICAgICBpZiAoIHRoaXMuZGVwdGggPT09IDAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVkLnB1c2goIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIGRpc3RhbmNlIGlzIGxlc3MgdGhhbiByYWRpdXMsIHRoZW4gdGhlIHRyaWFuZ2xlIHN0cmFkZGxlcyBhXHJcbiAgICAgICAgLy8gYm91bmRhcnlcclxuICAgICAgICBpZiAoIE1hdGguYWJzKCBkeCApIDwgcmFkaXVzIHx8XHJcbiAgICAgICAgICAgICBNYXRoLmFicyggZHkgKSA8IHJhZGl1cyB8fFxyXG4gICAgICAgICAgICAgTWF0aC5hYnMoIGR6ICkgPCByYWRpdXMgKSB7XHJcbiAgICAgICAgICAgIC8vIHN0cmFkZGxlcyBhIGJvdW5kYXJ5IHRyeSB0byBhZGQgdG8gaW50ZXJzZWN0ZWQgY2hpbGRyZW5cclxuICAgICAgICAgICAgZm9yICggY2hpbGQ9MDsgY2hpbGQ8ODsgY2hpbGQrKyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRyaWFuZ2xlIGJvdW5kaW5nIHNwaGVyZSBpbnRlcnNlY3RzIHRoaXMgY2hpbGRcclxuICAgICAgICAgICAgICAgIGlmICggc3BoZXJlQ2hlY2soIHRoaXMsIGNlbnRyb2lkLCByYWRpdXMsIGNoaWxkICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFydCBvZiBib3VuZGluZyBzcGhlcmUgaW50ZXJzZWN0cyBjaGlsZCwgaW5zZXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0SW50b0NoaWxkKCB0aGlzLCBjaGlsZCwgdHJpYW5nbGUgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGZ1bGx5IGNvbnRhaW5lZCBpbiBhIHNpbmdsZSBjaGlsZCwgZmluZCBjaGlsZCBpbmRleFxyXG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgMC03IGluZGV4IG9mIHRoZSBjaGlsZCwgZGV0ZXJtaW5lZCB1c2luZyBiaXQgd2lzZVxyXG4gICAgICAgICAgICAvLyBhZGRpdGlvblxyXG4gICAgICAgICAgICBjaGlsZCA9IDA7XHJcbiAgICAgICAgICAgIGlmICggZHggPiAwICkgeyBjaGlsZCArPSAxOyB9XHJcbiAgICAgICAgICAgIGlmICggZHkgPiAwICkgeyBjaGlsZCArPSAyOyB9XHJcbiAgICAgICAgICAgIGlmICggZHogPiAwICkgeyBjaGlsZCArPSA0OyB9XHJcbiAgICAgICAgICAgIGluc2VydEludG9DaGlsZCggdGhpcywgY2hpbGQsIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlIGFuZCByZXR1cm4gYW4gcmVuZGVyYWJsZSBlbnRpdHkgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgb2N0cmVlXHJcbiAgICAgKiBzdHJ1Y3R1cmUuIFNoYXJlcyBhIHNpbmdsZSBnbG9iYWwgbWVzaCBpbnN0YW5jZSBmb3IgYWxsIG5vZGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gLSBUaGUgYXJyYXkgb2YgbWVzaCBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIE9jdHJlZS5wcm90b3R5cGUuZ2V0RW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5lbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW50aXR5ID0gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogZ2VuZXJhdGVTdWJFbnRpdGllcyggdGhpcyApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdHk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gT2N0cmVlO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlcyB0aGUgZW50aXR5IGhpZXJhcmNoeSBkZXB0aC1maXJzdCBhbmQgZXhlY3V0ZXMgdGhlXHJcbiAgICAgKiBmb3JFYWNoIGZ1bmN0aW9uIG9uIGVhY2ggZW50aXR5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBUaGUgRW50aXR5IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZvckVhY2hFbnRpdHkgLSBUaGUgUmVuZGVyUGFzcyBmb3JFYWNoRW50aXR5IGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm9yRWFjaE1lc2ggLSBUaGUgUmVuZGVyUGFzcyBmb3JFYWNoTWVzaCBmdW5jdGlvbi5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZvckVhY2hTcHJpdGUgLSBUaGUgUmVuZGVyUGFzcyBmb3JFYWNoU3ByaXRlIGZ1bmN0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmb3JFYWNoUmVjdXJzaXZlKCBlbnRpdHksIGZvckVhY2hFbnRpdHksIGZvckVhY2hNZXNoLCBmb3JFYWNoU3ByaXRlICkge1xyXG4gICAgICAgIC8vIGZvciBlYWNoIGVudGl0eVxyXG4gICAgICAgIGlmICggZm9yRWFjaEVudGl0eSApIHtcclxuICAgICAgICAgICAgZm9yRWFjaEVudGl0eSggZW50aXR5ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciBlYWNoIG1lc2hcclxuICAgICAgICBpZiAoIGZvckVhY2hNZXNoICYmIGVudGl0eS5tZXNoZXMgKSB7XHJcbiAgICAgICAgICAgIGVudGl0eS5tZXNoZXMuZm9yRWFjaCggZnVuY3Rpb24oIG1lc2ggKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JFYWNoTWVzaCggbWVzaCwgZW50aXR5ICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBmb3IgZWFjaCBzcHJpdGVcclxuICAgICAgICBpZiAoIGZvckVhY2hTcHJpdGUgJiYgZW50aXR5LnNwcml0ZXMgKSB7XHJcbiAgICAgICAgICAgIGVudGl0eS5zcHJpdGVzLmZvckVhY2goIGZ1bmN0aW9uKCBzcHJpdGUgKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JFYWNoU3ByaXRlKCBzcHJpdGUsIGVudGl0eSApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZGVwdGggZmlyc3QgdHJhdmVyc2FsXHJcbiAgICAgICAgZW50aXR5LmNoaWxkcmVuLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCApIHtcclxuICAgICAgICAgICAgZm9yRWFjaFJlY3Vyc2l2ZSggY2hpbGQsIGZvckVhY2hFbnRpdHksIGZvckVhY2hNZXNoLCBmb3JFYWNoU3ByaXRlICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gUmVuZGVyUGFzcyggc3BlYyApIHtcclxuICAgICAgICBpZiAoIHR5cGVvZiBzcGVjID09PSAnb2JqZWN0JyApIHtcclxuICAgICAgICAgICAgdGhpcy5iZWZvcmUgPSBzcGVjLmJlZm9yZSB8fCBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmZvckVhY2hFbnRpdHkgPSBzcGVjLmZvckVhY2hFbnRpdHkgfHwgbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoTWVzaCA9IHNwZWMuZm9yRWFjaE1lc2ggfHwgbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoU3ByaXRlID0gc3BlYy5mb3JFYWNoU3ByaXRlIHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXIgPSBzcGVjLmFmdGVyIHx8IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIHNwZWMgPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlID0gc3BlYztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgUmVuZGVyUGFzcy5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKCBjYW1lcmEsIGVudGl0aWVzICkge1xyXG4gICAgICAgIHZhciBiZWZvcmUgPSB0aGlzLmJlZm9yZSxcclxuICAgICAgICAgICAgZm9yRWFjaEVudGl0eSA9IHRoaXMuZm9yRWFjaEVudGl0eSxcclxuICAgICAgICAgICAgZm9yRWFjaE1lc2ggPSB0aGlzLmZvckVhY2hNZXNoLFxyXG4gICAgICAgICAgICBmb3JFYWNoU3ByaXRlID0gdGhpcy5mb3JFYWNoU3ByaXRlLFxyXG4gICAgICAgICAgICBhZnRlciA9IHRoaXMuYWZ0ZXI7XHJcbiAgICAgICAgLy8gc2V0dXAgZnVuY3Rpb25cclxuICAgICAgICBpZiAoIGJlZm9yZSApIHtcclxuICAgICAgICAgICAgYmVmb3JlKCBjYW1lcmEgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVuZGVyaW5nIGZ1bmN0aW9uc1xyXG4gICAgICAgIGVudGl0aWVzLmZvckVhY2goIGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGlmICggZW50aXR5ICkge1xyXG4gICAgICAgICAgICAgICAgZm9yRWFjaFJlY3Vyc2l2ZShcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yRWFjaEVudGl0eSxcclxuICAgICAgICAgICAgICAgICAgICBmb3JFYWNoTWVzaCxcclxuICAgICAgICAgICAgICAgICAgICBmb3JFYWNoU3ByaXRlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyB0ZWFyZG93biBmdW5jdGlvblxyXG4gICAgICAgIGlmICggYWZ0ZXIgKSB7XHJcbiAgICAgICAgICAgIGFmdGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlclBhc3M7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFJlbmRlclRlY2huaXF1ZSggc3BlYyApIHtcclxuICAgICAgICB0aGlzLmlkID0gc3BlYy5pZDtcclxuICAgICAgICB0aGlzLnBhc3NlcyA9IHNwZWMucGFzc2VzIHx8IFtdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIFJlbmRlclRlY2huaXF1ZS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKCBjYW1lcmEsIGVudGl0aWVzICkge1xyXG4gICAgICAgIHRoaXMucGFzc2VzLmZvckVhY2goIGZ1bmN0aW9uKCBwYXNzICkge1xyXG4gICAgICAgICAgICBwYXNzLmV4ZWN1dGUoIGNhbWVyYSwgZW50aXRpZXMgKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJUZWNobmlxdWU7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZXJ0ZXhQYWNrYWdlID0gcmVxdWlyZSgnLi4vY29yZS9WZXJ0ZXhQYWNrYWdlJyksXHJcbiAgICAgICAgVmVydGV4QnVmZmVyID0gcmVxdWlyZSgnLi4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcclxuICAgICAgICBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uL2NvcmUvSW5kZXhCdWZmZXInKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZVZlcnRleEF0dHJpYnV0ZXMoIHNwZWMgKSB7XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuICAgICAgICBpZiAoIHNwZWMucG9zaXRpb25zICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMucG9zaXRpb25zICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy5ub3JtYWxzICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMubm9ybWFscyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMudXZzICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMudXZzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy50YW5nZW50cyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLnRhbmdlbnRzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy5iaXRhbmdlbnRzICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMuYml0YW5nZW50cyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMuY29sb3JzICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMuY29sb3JzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy5qb2ludHMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy5qb2ludHMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLndlaWdodHMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy53ZWlnaHRzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUluZGljZXMoIG4gKSB7XHJcbiAgICAgICAgdmFyIGluZGljZXMgPSBuZXcgQXJyYXkoIG4gKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bjsgaSsrICkge1xyXG4gICAgICAgICAgICBpbmRpY2VzW2ldID0gaTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluZGljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gUmVuZGVyYWJsZSggc3BlYyApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICBpZiAoIHNwZWMudmVydGV4QnVmZmVyIHx8IHNwZWMudmVydGV4QnVmZmVycyApIHtcclxuICAgICAgICAgICAgLy8gdXNlIGV4aXN0aW5nIHZlcnRleCBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gc3BlYy52ZXJ0ZXhCdWZmZXJzIHx8IFsgc3BlYy52ZXJ0ZXhCdWZmZXIgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgdmVydGV4IHBhY2thZ2VcclxuICAgICAgICAgICAgdmFyIHZlcnRleFBhY2thZ2UgPSBuZXcgVmVydGV4UGFja2FnZSggcGFyc2VWZXJ0ZXhBdHRyaWJ1dGVzKCBzcGVjICkgKTtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gWyBuZXcgVmVydGV4QnVmZmVyKCB2ZXJ0ZXhQYWNrYWdlICkgXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLmluZGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgZWxlbWVudCBhcnJheSBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IHNwZWMuaW5kZXhCdWZmZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGVsZW1lbnQgYXJyYXkgYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBuZXcgSW5kZXhCdWZmZXIoIHNwZWMuaW5kaWNlcyB8fCBjcmVhdGVJbmRpY2VzKCB0aGlzLnZlcnRleFBhY2thZ2UgKSwgc3BlYy5vcHRpb25zICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIFJlbmRlcmFibGUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmVydGV4QnVmZmVycyA9IHRoaXMudmVydGV4QnVmZmVycyxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8dmVydGV4QnVmZmVycy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdmVydGV4QnVmZmVyc1tpXS5iaW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuYmluZCgpO1xyXG4gICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuZHJhdygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmFibGU7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFJlbmRlcmVyKCB0ZWNobmlxdWVzICkge1xyXG4gICAgICAgIGlmICggISggdGVjaG5pcXVlcyBpbnN0YW5jZW9mIEFycmF5ICkgKSB7XHJcbiAgICAgICAgICAgIHRlY2huaXF1ZXMgPSBbIHRlY2huaXF1ZXMgXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50ZWNobmlxdWVzID0gdGVjaG5pcXVlcyB8fCBbXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oIGNhbWVyYSwgZW50aXRpZXNCeVRlY2huaXF1ZSApIHtcclxuICAgICAgICB0aGlzLnRlY2huaXF1ZXMuZm9yRWFjaCggZnVuY3Rpb24oIHRlY2huaXF1ZSApIHtcclxuICAgICAgICAgICAgdmFyIGVudGl0aWVzID0gZW50aXRpZXNCeVRlY2huaXF1ZVsgdGVjaG5pcXVlLmlkIF07XHJcbiAgICAgICAgICAgIGlmICggZW50aXRpZXMgJiYgZW50aXRpZXMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHRlY2huaXF1ZS5leGVjdXRlKCBjYW1lcmEsIGVudGl0aWVzICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIE1hdDQ0ID0gcmVxdWlyZSgnYWxmYWRvcicpLk1hdDQ0O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEpvaW50Q291bnQoIGpvaW50c0J5SWQsIGpvaW50cyApIHtcclxuICAgICAgICB2YXIgY291bnQgPSBqb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxqb2ludHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGpvaW50c0J5SWRbIGpvaW50c1tpXS5pZCBdID0gam9pbnRzW2ldO1xyXG4gICAgICAgICAgICBjb3VudCArPSBnZXRKb2ludENvdW50KCBqb2ludHNCeUlkLCBqb2ludHNbaV0uY2hpbGRyZW4gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFNrZWxldG9uKCB0aGF0ICkge1xyXG4gICAgICAgIC8vIHJvb3QgY2FuIGJlIGVpdGhlciBhIHNpbmdsZSBub2RlLCBvciBhbiBhcnJheSBvZiByb290IG5vZGVzXHJcbiAgICAgICAgdGhpcy5yb290ID0gKCB0aGF0LnJvb3QgaW5zdGFuY2VvZiBBcnJheSApID8gdGhhdC5yb290IDogWyB0aGF0LnJvb3QgXTtcclxuICAgICAgICB0aGlzLmJpbmRTaGFwZU1hdHJpeCA9IHRoYXQuYmluZFNoYXBlTWF0cml4IHx8IE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgdGhpcy5qb2ludHNCeUlkID0ge307XHJcbiAgICAgICAgdGhpcy5qb2ludENvdW50ID0gZ2V0Sm9pbnRDb3VudCggdGhpcy5qb2ludHNCeUlkLCB0aGlzLnJvb3QgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBTa2VsZXRvbi5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYmluZFNoYXBlTWF0cml4ID0gdGhpcy5iaW5kU2hhcGVNYXRyaXgsXHJcbiAgICAgICAgICAgIGpvaW50c0J5SWQgPSB0aGlzLmpvaW50c0J5SWQsXHJcbiAgICAgICAgICAgIGFycmF5YnVmZmVyLFxyXG4gICAgICAgICAgICBza2lubmluZ01hdHJpeCxcclxuICAgICAgICAgICAgam9pbnQsXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICAvLyBhbGxvY2F0ZSBhcnJheWJ1ZmZlciB0byBzdG9yZSBhbGwgam9pbnQgbWF0cmljZXNcclxuICAgICAgICBhcnJheWJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoIG5ldyBBcnJheUJ1ZmZlciggNCoxNip0aGlzLmpvaW50Q291bnQgKSApO1xyXG4gICAgICAgIC8vIGZvciBlYWNoIGpvaW50LCBnZXQgdGhlIHNraW5uaW5nIG1hdHJpeFxyXG4gICAgICAgIGZvciAoIGtleSBpbiBqb2ludHNCeUlkICkge1xyXG4gICAgICAgICAgICBpZiAoIGpvaW50c0J5SWQuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgam9pbnQgPSBqb2ludHNCeUlkWyBrZXkgXTtcclxuICAgICAgICAgICAgICAgIHNraW5uaW5nTWF0cml4ID0gam9pbnQuc2tpbm5pbmdNYXRyaXgoIGJpbmRTaGFwZU1hdHJpeCApO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlidWZmZXIuc2V0KCBza2lubmluZ01hdHJpeC5kYXRhLCBqb2ludC5pbmRleCoxNiApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHJldHVybiBhcnJheSBhcyBhcnJheWJ1ZmZlciBvYmplY3RcclxuICAgICAgICByZXR1cm4gYXJyYXlidWZmZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gU2tlbGV0b247XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBSZW5kZXJhYmxlID0gcmVxdWlyZSgnLi9SZW5kZXJhYmxlJyksXHJcbiAgICAgICAgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0dlb21ldHJ5JyksXHJcbiAgICAgICAgUXVhZCA9IHJlcXVpcmUoJy4uL3V0aWwvc2hhcGVzL1F1YWQnKSxcclxuICAgICAgICBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vTWF0ZXJpYWwnKSxcclxuICAgICAgICBfZ2VvbWV0cnksXHJcbiAgICAgICAgX3JlbmRlcmFibGU7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0R2VvbWV0cnkoKSB7XHJcbiAgICAgICAgaWYgKCAhX2dlb21ldHJ5ICkge1xyXG4gICAgICAgICAgICBfZ2VvbWV0cnkgPSBuZXcgR2VvbWV0cnkoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiBRdWFkLnBvc2l0aW9ucygpLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogUXVhZC5pbmRpY2VzKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfZ2VvbWV0cnk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyYWJsZSgpIHtcclxuICAgICAgICBpZiAoICFfcmVuZGVyYWJsZSApIHtcclxuICAgICAgICAgICAgX3JlbmRlcmFibGUgPSBuZXcgUmVuZGVyYWJsZSh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IFF1YWQucG9zaXRpb25zKCksXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiBRdWFkLmluZGljZXMoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF9yZW5kZXJhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFNwcml0ZSggc3BlYyApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICB0aGlzLnJlbmRlcmFibGUgPSBnZXRSZW5kZXJhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5nZW9tZXRyeSA9IGdldEdlb21ldHJ5KCk7XHJcbiAgICAgICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCggc3BlYyApO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBzcGVjLndpZHRoIHx8IHRoaXMubWF0ZXJpYWwuZGlmZnVzZVRleHR1cmUud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBzcGVjLmhlaWdodCB8fCB0aGlzLm1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBTcHJpdGUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmFibGUuZHJhdygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gU3RhY2soKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggdmFsdWUgKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goIHZhbHVlICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIFN0YWNrLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmRhdGEucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIFN0YWNrLnByb3RvdHlwZS50b3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmRhdGEubGVuZ3RoIC0gMTtcclxuICAgICAgICBpZiAoIGluZGV4IDwgMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbIGluZGV4IF07XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gU3RhY2s7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBzaW1wbHlEZWZlcnJlZCA9IHJlcXVpcmUoJ3NpbXBseS1kZWZlcnJlZCcpLFxyXG4gICAgICAgIERlZmVycmVkID0gc2ltcGx5RGVmZXJyZWQuRGVmZXJyZWQsXHJcbiAgICAgICAgd2hlbiA9IHNpbXBseURlZmVycmVkLndoZW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvdmlkZWQgZGVmZXJyZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtEZWZlcnJlZH0gZGVmZXJyZWQgLSBUaGUgZGVmZXJyZWQgb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIGRlZmVycmVkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZXNvbHZlRGVmZXJyZWQoIGRlZmVycmVkICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggcmVzdWx0ICkge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCByZXN1bHQgKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyBhbiBhcnJheSBvZiBqb2JzLCBhY2N1bXVsYXRpbmcgdGhlIHJlc3VsdHMgYW5kXHJcbiAgICAgKiBwYXNzaW5nIHRoZW0gdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGluIGNvcnJlc3BvbmRpbmcgaW5kaWNlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBqb2JzIC0gVGhlIGpvYiBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICovXHJcbiAgICAgZnVuY3Rpb24gYXN5bmNBcnJheSggam9icywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGRlZmVycmVkcyA9IFtdLFxyXG4gICAgICAgICAgICBkZWZlcnJlZCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8am9icy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgZGVmZXJyZWRzLnB1c2goIGRlZmVycmVkICk7XHJcbiAgICAgICAgICAgIGpvYnNbaV0oIHJlc29sdmVEZWZlcnJlZCggZGVmZXJyZWQgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGVuLmFwcGx5KCB3aGVuLCBkZWZlcnJlZHMgKS50aGVuKCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAwICk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCByZXN1bHRzICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIGEgbWFwIG9mIGpvYnMsIGFjY3VtdWxhdGluZyB0aGUgcmVzdWx0cyBhbmRcclxuICAgICAqIHBhc3NpbmcgdGhlbSB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdW5kZXIgY29ycmVzcG9uZGluZ1xyXG4gICAgICoga2V5cy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gam9icyAtIFRoZSBqb2IgbWFwLlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBhc3luY09iaiggam9icywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGpvYnNCeUluZGV4ID0gW10sXHJcbiAgICAgICAgICAgIGRlZmVycmVkcyA9IFtdLFxyXG4gICAgICAgICAgICBkZWZlcnJlZCxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIGZvciAoIGtleSBpbiBqb2JzICkge1xyXG4gICAgICAgICAgICBpZiAoIGpvYnMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkcy5wdXNoKCBkZWZlcnJlZCApO1xyXG4gICAgICAgICAgICAgICAgam9ic0J5SW5kZXgucHVzaCgga2V5ICk7XHJcbiAgICAgICAgICAgICAgICBqb2JzWyBrZXkgXSggcmVzb2x2ZURlZmVycmVkKCBkZWZlcnJlZCApICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2hlbi5hcHBseSggd2hlbiwgZGVmZXJyZWRzICkuZG9uZSggZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMCApLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0c0J5S2V5ID0ge30sXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8am9ic0J5SW5kZXgubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzQnlLZXlbIGpvYnNCeUluZGV4W2ldIF0gPSByZXN1bHRzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCByZXN1bHRzQnlLZXkgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRXhlY3V0ZSBhIHNldCBvZiBmdW5jdGlvbnMgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIGhhdmUgYmVlblxyXG4gICAgICAgICAqIGNvbXBsZXRlZCwgZXhlY3V0ZSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uIEpvYnMgbWF5IGJlIHBhc3NlZFxyXG4gICAgICAgICAqIGFzIGFuIGFycmF5IG9yIG9iamVjdC4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgcGFzc2VkIHRoZVxyXG4gICAgICAgICAqIHJlc3VsdHMgaW4gdGhlIHNhbWUgZm9ybWF0IGFzIHRoZSBqb2JzLiBBbGwgam9icyBtdXN0IGhhdmUgYWNjZXB0IGFuZFxyXG4gICAgICAgICAqIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gam9icyAtIFRoZSBzZXQgb2YgZnVuY3Rpb25zIHRvIGV4ZWN1dGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFzeW5jOiBmdW5jdGlvbiggam9icywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgIGlmICggam9icyBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgYXN5bmNBcnJheSggam9icywgY2FsbGJhY2sgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFzeW5jT2JqKCBqb2JzLCBjYWxsYmFjayApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRXh0ZW5kIGNsYXNzIGEgYnkgY2xhc3MgYi4gRG9lcyBub3QgcmVjdXJzZSwgc2ltcGx5IG92ZXJsYXlzIHRvcFxyXG4gICAgICAgICAqIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYSAtIE9iamVjdCBhIHdoaWNoIGlzIGV4dGVuZGVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBiIC0gT2JqZWN0IGIgd2hpY2ggZXh0ZW5kcyBhLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGV4dGVuZGVkIG9iamVjdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uKCBhLCBiICkge1xyXG4gICAgICAgICAgICB2YXIga2V5O1xyXG4gICAgICAgICAgICBmb3IoIGtleSBpbiBiICkge1xyXG4gICAgICAgICAgICAgICAgaWYoIGIuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFbIGtleSBdID0gYlsga2V5IF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVlcCBjb3BpZXMgdGhlIHByb3ZpZGVkIG9iamVjdC4gT2JqZWN0IGNhbm5vdCBiZSBjaXJjdWxhci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBqc29uIC0gVGhlIG9iamVjdCB0byBjb3B5LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gYSBkZWVwIGNvcHkgb2YgdGhlIHByb3ZpZGVkIG9iamVjdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb3B5OiBmdW5jdGlvbigganNvbiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoIEpTT04uc3RyaW5naWZ5KCBqc29uICkgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBvYmplY3QgaGFzIG5vIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gVGhlIG9iamVjdCB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBoYXMga2V5cywgZmFsc2UgaWYgbm90LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzRW1wdHk6IGZ1bmN0aW9uKCBvYmogKSB7XHJcbiAgICAgICAgICAgIGZvciggdmFyIHByb3AgaW4gb2JqICkge1xyXG4gICAgICAgICAgICAgICAgaWYoIG9iai5oYXNPd25Qcm9wZXJ0eSggcHJvcCApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgYSBwcm92aWRlZCBhcnJheSBpcyBhIGphdnNjcmlwdCBUeXBlZEFycmF5LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheSAtIFRoZSB2YXJpYWJsZSB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIHZhcmlhYmxlIGlzIGEgVHlwZWRBcnJheS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1R5cGVkQXJyYXk6IGZ1bmN0aW9uKCBhcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5ICYmXHJcbiAgICAgICAgICAgICAgICBhcnJheS5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciAmJlxyXG4gICAgICAgICAgICAgICAgYXJyYXkuYnl0ZUxlbmd0aCAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcHJvdmlkZWQgaW50ZWdlciBpcyBhIHBvd2VyIG9mIHR3by5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbnVtIC0gVGhlIG51bWJlciB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIG51bWJlciBpcyBhIHBvd2VyIG9mIHR3by5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1Bvd2VyT2ZUd286IGZ1bmN0aW9uKCBudW0gKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoIG51bSAhPT0gMCApID8gKCBudW0gJiAoIG51bSAtIDEgKSApID09PSAwIDogZmFsc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3byBmb3IgYSBudW1iZXIuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBFeC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAgICAyMDAgLT4gMjU2XHJcbiAgICAgICAgICogICAgIDI1NiAtPiAyNTZcclxuICAgICAgICAgKiAgICAgMjU3IC0+IDUxMlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBudW0gLSBUaGUgbnVtYmVyIHRvIG1vZGlmeS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtpbnRlZ2VyfSAtIE5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbmV4dEhpZ2hlc3RQb3dlck9mVHdvOiBmdW5jdGlvbiggbnVtICkge1xyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgaWYgKCBudW0gIT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBudW0gPSBudW0tMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKCBpPTE7IGk8MzI7IGk8PD0xICkge1xyXG4gICAgICAgICAgICAgICAgbnVtID0gbnVtIHwgbnVtID4+IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bSArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIFhNTEh0dHBSZXF1ZXN0IEdFVCByZXF1ZXN0IHRvIHRoZSBzdXBwbGllZCB1cmwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQ29udGFpbnMgdGhlIGZvbGxvd2luZyBvcHRpb25zOlxuICAgICAgICAgKiA8cHJlPlxuICAgICAgICAgKiAgICAge1xuICAgICAgICAgKiAgICAgICAgIHtTdHJpbmd9IHN1Y2Nlc3MgLSBUaGUgc3VjY2VzcyBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogICAgICAgICB7U3RyaW5nfSBlcnJvciAtIFRoZSBlcnJvciBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogICAgICAgICB7U3RyaW5nfSBwcm9ncmVzcyAtIFRoZSBwcm9ncmVzcyBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogICAgICAgICB7U3RyaW5nfSByZXNwb25zZVR5cGUgLSBUaGUgcmVzcG9uc2VUeXBlIG9mIHRoZSBYSFIuXG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqIDwvcHJlPlxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZDogZnVuY3Rpb24gKCB1cmwsIG9wdGlvbnMgKSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCAnR0VUJywgdXJsLCB0cnVlICk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMuc3VjY2VzcyApIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKCB0aGlzLnJlc3BvbnNlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMucHJvZ3Jlc3MgKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCAncHJvZ3Jlc3MnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnByb2dyZXNzKCBldmVudCApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmVycm9yICkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lciggJ2Vycm9yJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvciggZXZlbnQgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9XG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFBST0pfTUFUUklYID0gXCJ1UHJvamVjdGlvbk1hdHJpeFwiLFxyXG4gICAgICAgIE1PREVMX01BVFJJWCA9IFwidU1vZGVsTWF0cml4XCIsXHJcbiAgICAgICAgVklFV19NQVRSSVggPSBcInVWaWV3TWF0cml4XCIsXHJcbiAgICAgICAgUE9TX0FUVFJJQiA9IFwiYVBvc2l0aW9uXCIsXHJcbiAgICAgICAgVVZfQVRUUklCID0gXCJhVGV4Q29vcmRcIixcclxuICAgICAgICBVU0VfQVRUUklCX0NPTE9SID0gXCJ1VXNlQXR0cmliQ29sb3JcIixcclxuICAgICAgICBDT0xfQVRUUklCID0gXCJhQ29sb3JcIixcclxuICAgICAgICBDT0xfVU5JRk9STSA9IFwidUNvbG9yXCIsXHJcbiAgICAgICAgVEVYX1NBTVBMRVIgPSBcInVEaWZmdXNlU2FtcGxlclwiO1xyXG5cclxuICAgIHZhciBGTEFUX1ZFUlRfU1JDID0gW1xyXG4gICAgICAgICAgICBcImF0dHJpYnV0ZSBoaWdocCB2ZWMzIFwiICsgUE9TX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcImF0dHJpYnV0ZSBoaWdocCB2ZWMzIFwiICsgQ09MX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gaGlnaHAgbWF0NCBcIiArIE1PREVMX01BVFJJWCArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gaGlnaHAgbWF0NCBcIiArIFZJRVdfTUFUUklYICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidW5pZm9ybSBoaWdocCBtYXQ0IFwiICsgUFJPSl9NQVRSSVggKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ1bmlmb3JtIGJvb2wgXCIgKyBVU0VfQVRUUklCX0NPTE9SICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidW5pZm9ybSBoaWdocCB2ZWMzIFwiICsgQ09MX1VOSUZPUk0gKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ2YXJ5aW5nIGhpZ2hwIHZlYzMgdkNvbG9yO1wiLFxyXG4gICAgICAgICAgICBcInZvaWQgbWFpbigpIHtcIixcclxuICAgICAgICAgICAgICAgIFwiaWYgKCBcIiArIFVTRV9BVFRSSUJfQ09MT1IgKyBcIiApIHtcIixcclxuICAgICAgICAgICAgICAgICAgICBcInZDb2xvciA9IFwiICsgQ09MX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ9IGVsc2Uge1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidkNvbG9yID0gXCIgKyBDT0xfVU5JRk9STSArIFwiO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ9XCIsXHJcbiAgICAgICAgICAgICAgICBcImdsX1Bvc2l0aW9uID0gXCIgKyBQUk9KX01BVFJJWCArXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgKiBcIiArIFZJRVdfTUFUUklYICtcclxuICAgICAgICAgICAgICAgICAgICBcIiAqIFwiICsgTU9ERUxfTUFUUklYICtcclxuICAgICAgICAgICAgICAgICAgICBcIiAqIHZlYzQoIFwiICsgUE9TX0FUVFJJQiArIFwiLCAxLjAgKTtcIixcclxuICAgICAgICAgICAgXCJ9XCJcclxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgIHZhciBGTEFUX0ZSQUdfU1JDID0gW1xyXG4gICAgICAgICAgICBcInZhcnlpbmcgaGlnaHAgdmVjMyB2Q29sb3I7XCIsXHJcbiAgICAgICAgICAgIFwidm9pZCBtYWluKCkge1wiLFxyXG4gICAgICAgICAgICAgICAgXCJnbF9GcmFnQ29sb3IgPSB2ZWM0KCB2Q29sb3IsIDEuMCApO1wiLFxyXG4gICAgICAgICAgICBcIn1cIlxyXG4gICAgICAgIF0uam9pbignXFxuJyk7XHJcblxyXG4gICAgdmFyIFRFWF9WRVJUX1NSQyA9IFtcclxuICAgICAgICAgICAgXCJhdHRyaWJ1dGUgaGlnaHAgdmVjMyBcIiArIFBPU19BVFRSSUIgKyBcIjtcIixcclxuICAgICAgICAgICAgXCJhdHRyaWJ1dGUgaGlnaHAgdmVjMiBcIiArIFVWX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gaGlnaHAgbWF0NCBcIiArIE1PREVMX01BVFJJWCArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInZhcnlpbmcgaGlnaHAgdmVjMiB2VGV4Q29vcmQ7XCIsXHJcbiAgICAgICAgICAgIFwidm9pZCBtYWluKCkge1wiLFxyXG4gICAgICAgICAgICAgICAgXCJnbF9Qb3NpdGlvbiA9IFwiICsgTU9ERUxfTUFUUklYICtcclxuICAgICAgICAgICAgICAgICAgICBcIiAqIHZlYzQoIFwiICsgUE9TX0FUVFJJQiArIFwiLCAxLjAgKTtcIixcclxuICAgICAgICAgICAgICAgIFwidlRleENvb3JkID0gXCIgKyBVVl9BVFRSSUIgKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ9XCJcclxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgIHZhciBURVhfRlJBR19TUkMgPSBbXHJcbiAgICAgICAgICAgIFwidmFyeWluZyBoaWdocCB2ZWMzIHZDb2xvcjtcIixcclxuICAgICAgICAgICAgXCJ1bmlmb3JtIHNhbXBsZXIyRCBcIiArIFRFWF9TQU1QTEVSICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidmFyeWluZyBoaWdocCB2ZWMyIHZUZXhDb29yZDtcIixcclxuICAgICAgICAgICAgXCJ2b2lkIG1haW4oKSB7XCIsXHJcbiAgICAgICAgICAgICAgICBcImdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCggXCIgKyBURVhfU0FNUExFUiArIFwiLCB2VGV4Q29vcmQgKTtcIixcclxuICAgICAgICAgICAgXCJ9XCJcclxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgIHZhciBGTEFUX0RFQlVHX1NIQURFUiA9IG51bGw7XHJcbiAgICB2YXIgVEVYX0RFQlVHX1NIQURFUiA9IG51bGw7XHJcblxyXG4gICAgdmFyIFNoYWRlciA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvU2hhZGVyJyksXHJcbiAgICAgICAgTWVzaCA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlci9NZXNoJyksXHJcbiAgICAgICAgRW50aXR5ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL0VudGl0eScpLFxyXG4gICAgICAgIFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL1JlbmRlcmVyJyksXHJcbiAgICAgICAgUmVuZGVyVGVjaG5pcXVlID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL1JlbmRlclRlY2huaXF1ZScpLFxyXG4gICAgICAgIFJlbmRlclBhc3MgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvUmVuZGVyUGFzcycpLFxyXG4gICAgICAgIFF1YWQgPSByZXF1aXJlKCcuLi9zaGFwZXMvUXVhZCcpLFxyXG4gICAgICAgIF9kZWJ1Z1VVSUQgPSAxLFxyXG4gICAgICAgIF9yZW5kZXJNYXAgPSB7fSxcclxuICAgICAgICBfY2FtZXJhID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRGdW5jTmFtZSggZnVuYyApIHtcclxuICAgICAgdmFyIG5hbWUgPSBmdW5jLnRvU3RyaW5nKCk7XHJcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0ciggJ2Z1bmN0aW9uICcubGVuZ3RoICk7XHJcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0ciggMCwgbmFtZS5pbmRleE9mKCcoJykgKTtcclxuICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgZnVuYyApIHtcclxuICAgICAgICBlbnRpdHkuJCRERUJVR19VVUlEID0gZW50aXR5LiQkREVCVUdfVVVJRCB8fCBfZGVidWdVVUlEKys7XHJcbiAgICAgICAgdmFyIGRlYnVnSGFzaCA9IGVudGl0eS4kJERFQlVHX1VVSUQgKyBcIi1cIiArIGdldEZ1bmNOYW1lKCBmdW5jICk7XHJcbiAgICAgICAgaWYgKCAhX3JlbmRlck1hcFsgZGVidWdIYXNoIF0gKSB7XHJcbiAgICAgICAgICAgIF9yZW5kZXJNYXBbIGRlYnVnSGFzaCBdID0gZnVuYyggZW50aXR5ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfcmVuZGVyTWFwWyBkZWJ1Z0hhc2ggXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0QXJyYXlUb0NvbG9ycyggYXJyYXkgKSB7XHJcbiAgICAgICAgdmFyIGNvbG9ycyA9IG5ldyBBcnJheSggYXJyYXkubGVuZ3RoICksXHJcbiAgICAgICAgICAgIGF0dHJpYixcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYiA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICBjb2xvcnNbaV0gPSBbXHJcbiAgICAgICAgICAgICAgICAoICggYXR0cmliLnggfHwgYXR0cmliWzBdICkgKyAxICkgLyAyLFxyXG4gICAgICAgICAgICAgICAgKCAoIGF0dHJpYi55IHx8IGF0dHJpYlsxXSApICArIDEgKSAvIDIsXHJcbiAgICAgICAgICAgICAgICAoICggYXR0cmliLnogfHwgYXR0cmliWzJdIHx8IDAgKSArIDEgKSAvIDJcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVXaXJlRnJhbWVFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICB2YXIgY29weSA9IGVudGl0eS5jb3B5KCk7XHJcbiAgICAgICAgY29weS5mb3JFYWNoKCBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICB2YXIgbWVzaGVzID0gZW50aXR5Lm1lc2hlcyxcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICB0cmlJbmRpY2VzLFxyXG4gICAgICAgICAgICAgICAgbGluZXMsXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLFxyXG4gICAgICAgICAgICAgICAgYSwgYiwgYyxcclxuICAgICAgICAgICAgICAgIGksIGo7XHJcbiAgICAgICAgICAgIGVudGl0eS5tZXNoZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPG1lc2hlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5ID0gbWVzaGVzW2ldLmdlb21ldHJ5O1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zID0gZ2VvbWV0cnkucG9zaXRpb25zO1xyXG4gICAgICAgICAgICAgICAgdHJpSW5kaWNlcyA9IGdlb21ldHJ5LmluZGljZXM7XHJcbiAgICAgICAgICAgICAgICBsaW5lcyA9IG5ldyBBcnJheSggdHJpSW5kaWNlcy5sZW5ndGggKiAyICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzID0gbmV3IEFycmF5KCB0cmlJbmRpY2VzLmxlbmd0aCAqIDIgKTtcclxuICAgICAgICAgICAgICAgIGZvciAoIGo9MDsgajx0cmlJbmRpY2VzLmxlbmd0aDsgais9MyApIHtcclxuICAgICAgICAgICAgICAgICAgICBhID0gdHJpSW5kaWNlc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBiID0gdHJpSW5kaWNlc1tqKzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGMgPSB0cmlJbmRpY2VzW2orMl07XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyXSA9IHBvc2l0aW9uc1thXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjIrMV0gPSBwb3NpdGlvbnNbYl07XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyKzJdID0gcG9zaXRpb25zW2JdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2oqMiszXSA9IHBvc2l0aW9uc1tjXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjIrNF0gPSBwb3NpdGlvbnNbY107XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyKzVdID0gcG9zaXRpb25zW2FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyXSA9IGoqMjtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMisxXSA9IGoqMisxO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyKzJdID0gaioyKzI7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tqKjIrM10gPSBqKjIrMztcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMis0XSA9IGoqMis0O1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyKzVdID0gaioyKzU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkubWVzaGVzLnB1c2goIG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IGxpbmVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXM6IGluZGljZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiBcIkxJTkVTXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVudGl0eS4kJERFQlVHX1VTRV9DT0xPUiA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjb3B5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbG9yRW50aXR5KCBlbnRpdHksIGF0dHJpYnV0ZSApIHtcclxuICAgICAgICB2YXIgY29weSA9IGVudGl0eS5jb3B5KCk7XHJcbiAgICAgICAgY29weS5mb3JFYWNoKCBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICB2YXIgbWVzaGVzID0gZW50aXR5Lm1lc2hlcyxcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZW50aXR5Lm1lc2hlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8bWVzaGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgZ2VvbWV0cnkgPSBtZXNoZXNbaV0uZ2VvbWV0cnk7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkubWVzaGVzLnB1c2goIG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IGdlb21ldHJ5LnBvc2l0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcnM6IGNvbnZlcnRBcnJheVRvQ29sb3JzKCBnZW9tZXRyeVsgYXR0cmlidXRlIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzOiBnZW9tZXRyeS5pbmRpY2VzXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50aXR5LiQkREVCVUdfVVNFX0NPTE9SID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY29weTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVVVkNvbG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbG9yRW50aXR5KCBlbnRpdHksIFwidXZzXCIgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVOb3JtYWxDb2xvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVDb2xvckVudGl0eSggZW50aXR5LCBcIm5vcm1hbHNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRhbmdlbnRDb2xvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVDb2xvckVudGl0eSggZW50aXR5LCBcInRhbmdlbnRzXCIgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVCaVRhbmdlbnRDb2xvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVDb2xvckVudGl0eSggZW50aXR5LCBcImJpdGFuZ2VudHNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxpbmVzRW50aXR5KCBlbnRpdHksIHR5cGUgKSB7XHJcbiAgICAgICAgdmFyIGNvcHkgPSBlbnRpdHkuY29weSgpO1xyXG4gICAgICAgIGNvcHkuZm9yRWFjaCggZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgdmFyIG1lc2hlcyA9IGVudGl0eS5tZXNoZXMsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBsaW5lcyxcclxuICAgICAgICAgICAgICAgIGluZGljZXMsXHJcbiAgICAgICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICAgICAgajtcclxuICAgICAgICAgICAgZW50aXR5Lm1lc2hlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8bWVzaGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zID0gbWVzaGVzW2ldLmdlb21ldHJ5LnBvc2l0aW9ucztcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBtZXNoZXNbaV0uZ2VvbWV0cnlbIHR5cGUgXTtcclxuICAgICAgICAgICAgICAgIGxpbmVzID0gbmV3IEFycmF5KCBwb3NpdGlvbnMubGVuZ3RoICogMiApO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcyA9IG5ldyBBcnJheSggcG9zaXRpb25zLmxlbmd0aCAqIDIgKTtcclxuICAgICAgICAgICAgICAgIGZvciAoIGo9MDsgajxwb3NpdGlvbnMubGVuZ3RoOyBqKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbnNbal07XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjJdID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyKzFdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHBvc2l0aW9uLnggfHwgcG9zaXRpb25bMF0gfHwgMCApICsgKCBhdHRyaWJ1dGUueCB8fCBhdHRyaWJ1dGVbMF0gfHwgMCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHBvc2l0aW9uLnkgfHwgcG9zaXRpb25bMV0gfHwgMCApICsgKCBhdHRyaWJ1dGUueSB8fCBhdHRyaWJ1dGVbMV0gfHwgMCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHBvc2l0aW9uLnogfHwgcG9zaXRpb25bMl0gfHwgMCApICsgKCBhdHRyaWJ1dGUueiB8fCBhdHRyaWJ1dGVbMl0gfHwgMCApXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMl0gPSBqKjI7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tqKjIrMV0gPSBqKjIrMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVudGl0eS5tZXNoZXMucHVzaCggbmV3IE1lc2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogbGluZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU6IFwiTElORVNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIGVudGl0eS4kJERFQlVHX1VTRV9DT0xPUiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGNvcHk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVVZWZWN0b3JFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlTGluZXNFbnRpdHkoIGVudGl0eSwgXCJ1dnNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZU5vcm1hbFZlY3RvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVMaW5lc0VudGl0eSggZW50aXR5LCBcIm5vcm1hbHNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRhbmdlbnRWZWN0b3JFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlTGluZXNFbnRpdHkoIGVudGl0eSwgXCJ0YW5nZW50c1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQmlUYW5nZW50VmVjdG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxpbmVzRW50aXR5KCBlbnRpdHksIFwiYml0YW5nZW50c1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIF91c2VDb2xvciA9IGZhbHNlLFxyXG4gICAgICAgIF9jb2xvciA9IFsxLDEsMF07XHJcblxyXG4gICAgdmFyIGRlYnVnRmxhdFBhc3MgPSBuZXcgUmVuZGVyUGFzcyh7XHJcbiAgICAgICAgYmVmb3JlOiBmdW5jdGlvbiggY2FtZXJhICkge1xyXG4gICAgICAgICAgICBpZiAoICFGTEFUX0RFQlVHX1NIQURFUiApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBzaGFkZXIgaWYgaXQgZG9lcyBub3QgZXhpc3QgeWV0XHJcbiAgICAgICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUiA9IG5ldyBTaGFkZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnQ6IEZMQVRfVkVSVF9TUkMsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJhZzogRkxBVF9GUkFHX1NSQ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRkxBVF9ERUJVR19TSEFERVIucHVzaCgpO1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBQUk9KX01BVFJJWCwgY2FtZXJhLnByb2plY3Rpb25NYXRyaXgoKSApO1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBWSUVXX01BVFJJWCwgY2FtZXJhLmdsb2JhbFZpZXdNYXRyaXgoKSApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaEVudGl0eTogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgX3VzZUNvbG9yID0gZW50aXR5LiQkREVCVUdfVVNFX0NPTE9SO1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBNT0RFTF9NQVRSSVgsIGVudGl0eS5nbG9iYWxNYXRyaXgoKSApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaE1lc2g6IGZ1bmN0aW9uKCBtZXNoICkge1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBVU0VfQVRUUklCX0NPTE9SLCBfdXNlQ29sb3IgKTtcclxuICAgICAgICAgICAgRkxBVF9ERUJVR19TSEFERVIuc2V0VW5pZm9ybSggQ09MX1VOSUZPUk0sIF9jb2xvciApO1xyXG4gICAgICAgICAgICBtZXNoLmRyYXcoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFmdGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRkxBVF9ERUJVR19TSEFERVIucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGRlYnVnVGV4UGFzcyA9IG5ldyBSZW5kZXJQYXNzKHtcclxuICAgICAgICBiZWZvcmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoICFURVhfREVCVUdfU0hBREVSICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHNoYWRlciBpZiBpdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgICAgIFRFWF9ERUJVR19TSEFERVIgPSBuZXcgU2hhZGVyKHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0OiBURVhfVkVSVF9TUkMsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJhZzogVEVYX0ZSQUdfU1JDXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBURVhfREVCVUdfU0hBREVSLmdsLmRpc2FibGUoIFRFWF9ERUJVR19TSEFERVIuZ2wuREVQVEhfVEVTVCApO1xyXG4gICAgICAgICAgICBURVhfREVCVUdfU0hBREVSLnB1c2goKTtcclxuICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBURVhfU0FNUExFUiwgMCApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaEVudGl0eTogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBNT0RFTF9NQVRSSVgsIGVudGl0eS5nbG9iYWxNYXRyaXgoKSApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaE1lc2g6IGZ1bmN0aW9uKCBtZXNoICkge1xyXG4gICAgICAgICAgICBtZXNoLm1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlLnB1c2goIDAgKTtcclxuICAgICAgICAgICAgbWVzaC5kcmF3KCk7XHJcbiAgICAgICAgICAgIG1lc2gubWF0ZXJpYWwuZGlmZnVzZVRleHR1cmUucG9wKCAwICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZnRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFRFWF9ERUJVR19TSEFERVIuZ2wuZW5hYmxlKCBURVhfREVCVUdfU0hBREVSLmdsLkRFUFRIX1RFU1QgKTtcclxuICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUi5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgZGVidWdGbGF0VGVjaG5pcXVlID0gbmV3IFJlbmRlclRlY2huaXF1ZSh7XHJcbiAgICAgICAgaWQ6IFwiZGVidWdcIixcclxuICAgICAgICBwYXNzZXM6IFsgZGVidWdGbGF0UGFzcyBdXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgZGVidWdUZXhUZWNobmlxdWUgPSBuZXcgUmVuZGVyVGVjaG5pcXVlKHtcclxuICAgICAgICBpZDogXCJ0ZXhcIixcclxuICAgICAgICBwYXNzZXM6IFsgZGVidWdUZXhQYXNzIF1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBkZWJ1Z1JlbmRlcmVyID0gbmV3IFJlbmRlcmVyKFsgZGVidWdGbGF0VGVjaG5pcXVlLCBkZWJ1Z1RleFRlY2huaXF1ZSBdKTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgc2V0Q2FtZXJhOiBmdW5jdGlvbiggY2FtZXJhICkge1xyXG4gICAgICAgICAgICBfY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdUZXh0dXJlOiBmdW5jdGlvbiggdGV4dHVyZSApIHtcclxuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogUXVhZC5wb3NpdGlvbnMoKSxcclxuICAgICAgICAgICAgICAgICAgICB1dnM6IFF1YWQudXZzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlczogIFF1YWQuaW5kaWNlcygpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IFsgbmV3IE1lc2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmFibGU6IGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIGdlb21lcnRyeTogZ2VvbWV0cnksXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZnVzZVRleHR1cmU6IHRleHR1cmVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSBdLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luOiBbIC0wLjc1LCAwLjc1LCAwIF0sXHJcbiAgICAgICAgICAgICAgICBzY2FsZTogMC41XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggbnVsbCwge1xyXG4gICAgICAgICAgICAgICAgdGV4OiBbIGVudGl0eSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdXaXJlRnJhbWU6IGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVXaXJlRnJhbWVFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdVVnNBc0NvbG9yOiBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlVVZDb2xvckVudGl0eSApIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd1VWc0FzVmVjdG9yczogZnVuY3Rpb24oIGVudGl0eSwgY29sb3IgKSB7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlVVZWZWN0b3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdOb3JtYWxzQXNDb2xvcjogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgZGVidWdSZW5kZXJlci5yZW5kZXIoIF9jYW1lcmEsIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnOiBbIGNyZWF0ZURlYnVnRW50aXR5KCBlbnRpdHksIGNyZWF0ZU5vcm1hbENvbG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3Tm9ybWFsc0FzVmVjdG9yczogZnVuY3Rpb24oIGVudGl0eSwgY29sb3IgKSB7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlTm9ybWFsVmVjdG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3VGFuZ2VudHNBc0NvbG9yOiBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlVGFuZ2VudENvbG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3VGFuZ2VudHNBc1ZlY3RvcnM6IGZ1bmN0aW9uKCBlbnRpdHksIGNvbG9yICApIHtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVUYW5nZW50VmVjdG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3QmlUYW5nZW50c0FzQ29sb3I6IGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVCaVRhbmdlbnRDb2xvckVudGl0eSApIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd0JpVGFuZ2VudHNBc1ZlY3RvcnM6IGZ1bmN0aW9uKCBlbnRpdHksIGNvbG9yICApIHtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVCaVRhbmdlbnRWZWN0b3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhbGZhZG9yID0gcmVxdWlyZSgnYWxmYWRvcicpLFxyXG4gICAgICAgIFF1YXRlcm5pb24gPSBhbGZhZG9yLlF1YXRlcm5pb24sXHJcbiAgICAgICAgTWF0MzMgPSBhbGZhZG9yLk1hdDMzLFxyXG4gICAgICAgIE1hdDQ0ID0gYWxmYWRvci5NYXQ0NCxcclxuICAgICAgICBWZWMyID0gYWxmYWRvci5WZWMyLFxyXG4gICAgICAgIFZlYzMgPSBhbGZhZG9yLlZlYzM7XHJcblxyXG4gICAgdmFyIENPTVBPTkVOVF9UWVBFU19UT19CVUZGRVJWSUVXUyA9IHtcclxuICAgICAgICBcIjUxMjBcIjogSW50OEFycmF5LFxyXG4gICAgICAgIFwiNTEyMVwiOiBVaW50OEFycmF5LFxyXG4gICAgICAgIFwiNTEyMlwiOiBJbnQxNkFycmF5LFxyXG4gICAgICAgIFwiNTEyM1wiOiBVaW50MTZBcnJheSxcclxuICAgICAgICBcIjUxMjZcIjogRmxvYXQzMkFycmF5XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBUWVBFU19UT19OVU1fQ09NUE9ORU5UUyA9IHtcclxuICAgICAgICBcIlNDQUxBUlwiOiAxLFxyXG4gICAgICAgIFwiVkVDMlwiOiAyLFxyXG4gICAgICAgIFwiVkVDM1wiOiAzLFxyXG4gICAgICAgIFwiVkVDNFwiOiA0LFxyXG4gICAgICAgIFwiTUFUMlwiOiA0LFxyXG4gICAgICAgIFwiTUFUM1wiOiA5LFxyXG4gICAgICAgIFwiTUFUNFwiOiAxNlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVFlQRVNfVE9fQ0xBU1MgPSB7XHJcbiAgICAgICAgXCJTQ0FMQVJcIjogTnVtYmVyLFxyXG4gICAgICAgIFwiVkVDMlwiOiBWZWMyLFxyXG4gICAgICAgIFwiVkVDM1wiOiBWZWMzLFxyXG4gICAgICAgIFwiVkVDNFwiOiBRdWF0ZXJuaW9uLFxyXG4gICAgICAgIFwiTUFUM1wiOiBNYXQzMyxcclxuICAgICAgICBcIk1BVDRcIjogTWF0NDRcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uUGFyYW1ldGVyKCBwYXJhbWV0ZXJzQnlBY2Nlc3NvciwganNvbiwgcGFyYW1ldGVyTmFtZSwgYWNjZXNzb3JOYW1lLCBidWZmZXJzICkge1xyXG5cclxuICAgICAgICBpZiAoIHBhcmFtZXRlcnNCeUFjY2Vzc29yWyBhY2Nlc3Nvck5hbWUgXSApIHtcclxuICAgICAgICAgICAgLy8gaWYgYWxyZWFkeSBjcmVhdGVkLCBubyBuZWVkIHRvIHJlLWNyZWF0IGVpdFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSBqc29uLmFjY2Vzc29yc1sgYWNjZXNzb3JOYW1lIF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlclZpZXcgPSBqc29uLmJ1ZmZlclZpZXdzWyBhY2Nlc3Nvci5idWZmZXJWaWV3IF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlcnNbIGJ1ZmZlclZpZXcuYnVmZmVyIF0sXHJcbiAgICAgICAgICAgIFR5cGVkQXJyYXkgPSBDT01QT05FTlRfVFlQRVNfVE9fQlVGRkVSVklFV1NbIGFjY2Vzc29yLmNvbXBvbmVudFR5cGUgXSxcclxuICAgICAgICAgICAgbnVtQ29tcG9uZW50cyA9IFRZUEVTX1RPX05VTV9DT01QT05FTlRTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIFR5cGVDbGFzcyA9IFRZUEVTX1RPX0NMQVNTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIGFjY2Vzc29yQXJyYXlDb3VudCA9IGFjY2Vzc29yLmNvdW50ICogbnVtQ29tcG9uZW50cyxcclxuICAgICAgICAgICAgYXJyYXlCdWZmZXIgPSBuZXcgVHlwZWRBcnJheSggYnVmZmVyLCBidWZmZXJWaWV3LmJ5dGVPZmZzZXQgKyBhY2Nlc3Nvci5ieXRlT2Zmc2V0LCBhY2Nlc3NvckFycmF5Q291bnQgKSxcclxuICAgICAgICAgICAgdmFsdWVzID0gW10sXHJcbiAgICAgICAgICAgIGJlZ2luSW5kZXgsXHJcbiAgICAgICAgICAgIGVuZEluZGV4LFxyXG4gICAgICAgICAgICBpO1xyXG5cclxuICAgICAgICBpZiAoIFR5cGVDbGFzcyA9PT0gTnVtYmVyICkge1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhlIHR5cGUgaXMgYSBzY2FsYXIsIHJldHVybiB0aGUgYnVmZmVyXHJcbiAgICAgICAgICAgIHZhbHVlcyA9IGFycmF5QnVmZmVyO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYgKCBwYXJhbWV0ZXJOYW1lID09PSBcInJvdGF0aW9uXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGVhY2ggY29tcG9uZW50IGluIHRoZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICAgICAgZm9yICggaT0wOyBpPGFjY2Vzc29yLmNvdW50OyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsYyB0aGUgYmVnaW4gYW5kIGVuZCBpbiBhcnJheWJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luSW5kZXggPSBpICogbnVtQ29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGJlZ2luSW5kZXggKyBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgc3ViYXJyYXkgdGhhdCBjb21wb3NlcyB0aGUgbWF0cml4XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzOiBuZXcgVmVjMyggYXJyYXlCdWZmZXIuc3ViYXJyYXkoIGJlZ2luSW5kZXgsIGVuZEluZGV4LTEgKSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogYXJyYXlCdWZmZXIuc3ViYXJyYXkoIGVuZEluZGV4LTEsIGVuZEluZGV4IClbMF1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGVhY2ggY29tcG9uZW50IGluIHRoZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICAgICAgZm9yICggaT0wOyBpPGFjY2Vzc29yLmNvdW50OyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsYyB0aGUgYmVnaW4gYW5kIGVuZCBpbiBhcnJheWJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luSW5kZXggPSBpICogbnVtQ29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGJlZ2luSW5kZXggKyBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgc3ViYXJyYXkgdGhhdCBjb21wb3NlcyB0aGUgbWF0cml4XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBUeXBlQ2xhc3MoIGFycmF5QnVmZmVyLnN1YmFycmF5KCBiZWdpbkluZGV4LCBlbmRJbmRleCApIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJhbWV0ZXJzQnlBY2Nlc3NvclsgYWNjZXNzb3JOYW1lIF0gPSB2YWx1ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIGZ1bmN0aW9uIHJlc29sdmVBbmltYXRpb25UYXJnZXQoIGpzb24sIHRhcmdldElkLCB0YXJnZXRQYXRoICkge1xyXG4gICAgICAgIC8vIEFzIHBlciAwLjggc3BlYywgYW5pbWF0aW9uIHRhcmdldHMgY2FuIGJlOlxyXG4gICAgICAgIC8vICAgICBub2Rlc1xyXG4gICAgICAgIC8vICAgICBtYXRlcmlhbHMgKCBpbnN0YW5jZVRlY2huaXF1ZXMgKVxyXG4gICAgICAgIC8vICAgICB0ZWNobmlxdWVzXHJcbiAgICAgICAgLy8gICAgIGNhbWVyYXNcclxuICAgICAgICAvLyAgICAgbGlnaHRzXHJcbiAgICAgICAgLy8gZmlyc3QgY2hlY2sgbm9kZXNcclxuICAgICAgICBpZiAoIGpzb24ubm9kZXNbIHRhcmdldElkXSApIHtcclxuICAgICAgICAgICAgLy8gbm9kZVxyXG4gICAgICAgICAgICBpZiAoIGpzb24ubm9kZXNbIHRhcmdldElkIF0uam9pbnROYW1lICkge1xyXG4gICAgICAgICAgICAgICAgLy8gam9pbnRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vZGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIGpzb24ubWF0ZXJpYWxzWyB0YXJnZXRJZCBdICkge1xyXG4gICAgICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBpZ25vcmUgZm9yIG5vd1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICovXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uKCBhbmltYXRpb25zQnlUYXJnZXQsIHBhcmFtZXRlcnNCeUFjY2Vzc29yLCBqc29uLCBhbmltYXRpb24sIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSBhbmltYXRpb24ucGFyYW1ldGVycyxcclxuICAgICAgICAgICAgY2hhbm5lbCxcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICBzYW1wbGVyLFxyXG4gICAgICAgICAgICBpbnB1dEFjY2Vzc29yLFxyXG4gICAgICAgICAgICBvdXRwdXRBY2Nlc3NvcixcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBjaGFubmVsIGluIHRoZSBhbmltYXRpb25cclxuICAgICAgICBmb3IgKCBpPTA7IGk8YW5pbWF0aW9uLmNoYW5uZWxzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGFuaW1hdGlvbiBjaGFubmVsXHJcbiAgICAgICAgICAgIGNoYW5uZWwgPSBhbmltYXRpb24uY2hhbm5lbHNbaV07XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgdGFyZ2V0IG9mIHRoZSBhbmltYXRpb25cclxuICAgICAgICAgICAgdGFyZ2V0ID0gY2hhbm5lbC50YXJnZXQ7XHJcbiAgICAgICAgICAgIC8vIGdldCBzYW1wbGVyIGZvciB0aGUgY2hhbm5lbFxyXG4gICAgICAgICAgICBzYW1wbGVyID0gYW5pbWF0aW9uLnNhbXBsZXJzWyBjaGFubmVsLnNhbXBsZXIgXTtcclxuICAgICAgICAgICAgLy8gZ2V0IGFjY2Vzc29yIHRvIGNoYW5uZWwgaW5wdXRcclxuICAgICAgICAgICAgaW5wdXRBY2Nlc3NvciA9IHBhcmFtZXRlcnNbIHNhbXBsZXIuaW5wdXQgXTtcclxuICAgICAgICAgICAgLy8gZ2V0IGFjY2Vzc29yIHRvIGNoYW5uZWwgb3V0cHV0XHJcbiAgICAgICAgICAgIG91dHB1dEFjY2Vzc29yID0gcGFyYW1ldGVyc1sgc2FtcGxlci5vdXRwdXQgXTtcclxuICAgICAgICAgICAgLy8gY2FzdCBpbnB1dCBwYXJhbWV0ZXJcclxuICAgICAgICAgICAgY3JlYXRlQW5pbWF0aW9uUGFyYW1ldGVyKFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyc0J5QWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICBqc29uLFxyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5pbnB1dCwgLy8gcGFyYW1ldGVyIG5hbWVcclxuICAgICAgICAgICAgICAgIGlucHV0QWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICBidWZmZXJzICk7XHJcbiAgICAgICAgICAgIC8vIGNhc3Qgb3V0cHV0IHBhcmFtZXRlclxyXG4gICAgICAgICAgICBjcmVhdGVBbmltYXRpb25QYXJhbWV0ZXIoXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzQnlBY2Nlc3NvcixcclxuICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm91dHB1dCwgLy8gcGFyYW1ldGVyIG5hbWVcclxuICAgICAgICAgICAgICAgIG91dHB1dEFjY2Vzc29yLFxyXG4gICAgICAgICAgICAgICAgYnVmZmVycyApO1xyXG4gICAgICAgICAgICAvLyBzYXZlIGlucHV0XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbnNCeVRhcmdldFsgdGFyZ2V0LmlkIF0gPSBhbmltYXRpb25zQnlUYXJnZXRbIHRhcmdldC5pZCBdIHx8IFtdO1xyXG4gICAgICAgICAgICBhbmltYXRpb25zQnlUYXJnZXRbIHRhcmdldC5pZCBdLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgcGF0aDogdGFyZ2V0LnBhdGgsXHJcbiAgICAgICAgICAgICAgICBpbnB1dDogcGFyYW1ldGVyc0J5QWNjZXNzb3JbIGlucHV0QWNjZXNzb3IgXSxcclxuICAgICAgICAgICAgICAgIG91dHB1dDogcGFyYW1ldGVyc0J5QWNjZXNzb3JbIG91dHB1dEFjY2Vzc29yIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBjcmVhdGVBbmltYXRpb25zOiBmdW5jdGlvbigganNvbiwgYnVmZmVycyApIHtcclxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvbnNCeVRhcmdldCA9IHt9LFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyc0J5QWNjZXNzb3IgPSB7fSxcclxuICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgZm9yICgga2V5IGluIGpzb24uYW5pbWF0aW9ucyApIHtcclxuICAgICAgICAgICAgICAgIGlmICgganNvbi5hbmltYXRpb25zLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVBbmltYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbnNCeVRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyc0J5QWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uYW5pbWF0aW9uc1sga2V5IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcnMgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc0J5VGFyZ2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcclxuICAgICAgICBnbFRGVXRpbCA9IHJlcXVpcmUoJy4vZ2xURlV0aWwnKSxcclxuICAgICAgICBnbFRGTWF0ZXJpYWwgPSByZXF1aXJlKCcuL2dsVEZNYXRlcmlhbCcpLFxyXG4gICAgICAgIGdsVEZBbmltYXRpb24gPSByZXF1aXJlKCcuL2dsVEZBbmltYXRpb24nKSxcclxuICAgICAgICBnbFRGTWVzaCA9IHJlcXVpcmUoJy4vZ2xURk1lc2gnKSxcclxuICAgICAgICBnbFRGUGFyc2VyID0gcmVxdWlyZSgnLi9nbFRGUGFyc2VyJyksXHJcbiAgICAgICAgZ2xURlNrZWxldG9uID0gcmVxdWlyZSgnLi9nbFRGU2tlbGV0b24nKSxcclxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vVXRpbCcpLFxyXG4gICAgICAgIEVudGl0eSA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlci9FbnRpdHknKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbnRpdHlSZWN1cnNpdmUoIGpzb24sIG1lc2hlcywgYnVmZmVycywgbm9kZU5hbWUgKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBqc29uLm5vZGVzWyBub2RlTmFtZSBdLFxyXG4gICAgICAgICAgICBub2RlTWVzaGVzID0gW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gW10sXHJcbiAgICAgICAgICAgIHNrZWxldG9uID0gbnVsbCxcclxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IG51bGwsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybSxcclxuICAgICAgICAgICAgY2hpbGQsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gY2hlY2sgdHlwZSBvZiBub2RlXHJcbiAgICAgICAgaWYgKCBub2RlLmpvaW50TmFtZSB8fCBub2RlLmNhbWVyYSB8fCBub2RlLmxpZ2h0ICkge1xyXG4gICAgICAgICAgICAvLyBub2RlIGlzIGVpdGhlciBhIGpvaW50LCBjYW1lcmEsIG9yIGxpZ2h0LCBzbyBpZ25vcmUgaXQgYXMgYW4gZW50aXR5XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgdGhlIG5vZGVzIHRyYW5zZm9ybVxyXG4gICAgICAgIHRyYW5zZm9ybSA9IGdsVEZVdGlsLmdldE5vZGVNYXRyaXgoIG5vZGUgKS5kZWNvbXBvc2UoKTtcclxuICAgICAgICAvLyByZWN1cnNpdmVseSBhc3NlbWJsZSB0aGUgc2tlbGV0b24gam9pbnQgdHJlZVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IGNyZWF0ZUVudGl0eVJlY3Vyc2l2ZSgganNvbiwgbWVzaGVzLCBidWZmZXJzLCBub2RlLmNoaWxkcmVuW2ldICk7XHJcbiAgICAgICAgICAgIC8vIGVudGl0eSBjYW4gYmUgbnVsbCBzaW5jZSB3ZSBpZ25vcmUgY2FtZXJhcywgam9pbnRzLCBhbmQgbGlnaHRzXHJcbiAgICAgICAgICAgIGlmICggY2hpbGQgKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKCBjaGlsZCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIG5vZGUgaGFzIGEgbWVzaCwgYWRkIGl0LFxyXG4gICAgICAgIGlmICggbm9kZS5tZXNoZXMgKSB7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxub2RlLm1lc2hlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIG5vZGVNZXNoZXMgPSBub2RlTWVzaGVzLmNvbmNhdCggbWVzaGVzWyBub2RlLm1lc2hlc1tpXSBdICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgbm9kZSBoYXMgYW4gaW5zdGFuY2VTa2luLCBjcmVhdGUgc2tlbGV0b24gLyBhbmltYXRpb25zXHJcbiAgICAgICAgaWYgKCBub2RlLmluc3RhbmNlU2tpbiApIHtcclxuICAgICAgICAgICAgLy8gc2tlbGV0b25cclxuICAgICAgICAgICAgc2tlbGV0b24gPSBnbFRGU2tlbGV0b24uY3JlYXRlU2tlbGV0b24oIGpzb24sIG5vZGUuaW5zdGFuY2VTa2luLCBidWZmZXJzICk7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxub2RlLmluc3RhbmNlU2tpbi5tZXNoZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlTWVzaGVzID0gbm9kZU1lc2hlcy5jb25jYXQoIG1lc2hlc1sgbm9kZS5pbnN0YW5jZVNraW4ubWVzaGVzW2ldIF0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhbmltYXRpb25zXHJcbiAgICAgICAgICAgIC8vIE5PVEU6IGFuaW1hdGlvbnMgdGVjaG5pY2FsbHkgbWF5IG5vdCByZXF1aXJlIGEgc2tlbGV0b25cclxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IGdsVEZBbmltYXRpb24uY3JlYXRlQW5pbWF0aW9ucygganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgIGlkOiBub2RlTmFtZSxcclxuICAgICAgICAgICAgdXA6IHRyYW5zZm9ybS51cCxcclxuICAgICAgICAgICAgZm9yd2FyZDogdHJhbnNmb3JtLmZvcndhcmQsXHJcbiAgICAgICAgICAgIGxlZnQ6IHRyYW5zZm9ybS5sZWZ0LFxyXG4gICAgICAgICAgICBvcmlnaW46IHRyYW5zZm9ybS5vcmlnaW4sXHJcbiAgICAgICAgICAgIHNjYWxlOiB0cmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICAgICAgbWVzaGVzOiBub2RlTWVzaGVzLFxyXG4gICAgICAgICAgICBza2VsZXRvbjogc2tlbGV0b24sXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IGFuaW1hdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbnRpdGllcygganNvbiwgbWVzaGVzLCBidWZmZXJzICkge1xyXG4gICAgICAgIHZhciByb290Tm9kZXMgPSBqc29uLnNjZW5lc1sganNvbi5zY2VuZSBdLm5vZGVzLFxyXG4gICAgICAgICAgICBlbnRpdGllcyA9IFtdLFxyXG4gICAgICAgICAgICBlbnRpdHksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggbm9kZVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxyb290Tm9kZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGVudGl0eSA9IGNyZWF0ZUVudGl0eVJlY3Vyc2l2ZSgganNvbiwgbWVzaGVzLCBidWZmZXJzLCByb290Tm9kZXNbaV0gKTtcclxuICAgICAgICAgICAgLy8gZW50aXR5IGNhbiBiZSBudWxsIHNpbmNlIHdlIGlnbm9yZSBjYW1lcmFzLCBqb2ludHMsIGFuZCBsaWdodHNcclxuICAgICAgICAgICAgaWYgKCBlbnRpdHkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXRpZXMucHVzaCggZW50aXR5ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRFbnRpdHkoIGpzb24sIGNhbGxiYWNrICkge1xyXG4gICAgICAgIC8vIHdhaXQgZm9yIGFycmF5YnVmZmVycyBhbmQgbWF0ZXJpYWxzXHJcbiAgICAgICAgVXRpbC5hc3luYyhcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyczogZnVuY3Rpb24oIGRvbmUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCByZXF1ZXN0cyBmb3IgYnVmZmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIGdsVEZVdGlsLnJlcXVlc3RCdWZmZXJzKCBqc29uLmJ1ZmZlcnMsIGZ1bmN0aW9uKCBidWZmZXJzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCBidWZmZXJzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxzOiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIG1hdGVyaWFsIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBnbFRGTWF0ZXJpYWwubG9hZE1hdGVyaWFscygganNvbiwgZnVuY3Rpb24oIG1hdGVyaWFscyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggbWF0ZXJpYWxzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCByZXN1bHQgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbWVzaGVzLCB0aGVuIGVudGl0aWVzXHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzaGVzID0gZ2xURk1lc2guY3JlYXRlTWVzaGVzKCBqc29uLCByZXN1bHQuYnVmZmVycywgcmVzdWx0Lm1hdGVyaWFscyApO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIGNyZWF0ZUVudGl0aWVzKCBqc29uLCBtZXNoZXMsIHJlc3VsdC5idWZmZXJzICkgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvYWRzIGEgZ2xURiBKU09OIGZpbGUsIGdlbmVyYXRlcyBhIE1vZGVsIG9iamVjdCwgYW5kIHBhc3NlcyBpdCB0b1xyXG4gICAgICAgICAqIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uIFRoaXMgYWxzbyBpbnZvbHZlcyBsb2FkaW5nIGFuZFxyXG4gICAgICAgICAqIGdlbmVyYXRpbmcgdGhlIGFzc29jaWF0ZWQgTWF0ZXJpYWwgb2JqZWN0cy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHRoZSBKU09OIGZpbGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb25lIGV4ZWN1dGVkIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsb2FkOiBmdW5jdGlvbiggdXJsLCBjYWxsYmFjayApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RlbE5hbWUgPSBwYXRoLmJhc2VuYW1lKCB1cmwsIHBhdGguZXh0bmFtZSggdXJsICkgKSxcclxuICAgICAgICAgICAgICAgIHBhcnNlciA9IE9iamVjdC5jcmVhdGUoIGdsVEZQYXJzZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVMb2FkQ29tcGxldGVkOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRFbnRpdHkoIHRoaXMuanNvbiwgZnVuY3Rpb24oIGNoaWxkcmVuICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RlbCA9IG5ldyBFbnRpdHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG1vZGVsTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggbW9kZWwgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHBhcnNlci5pbml0V2l0aFBhdGgoIHVybCApO1xyXG4gICAgICAgICAgICBwYXJzZXIubG9hZCggbnVsbCwgbnVsbCApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL1V0aWwnKSxcclxuICAgICAgICBnbFRGVXRpbCA9IHJlcXVpcmUoJy4vZ2xURlV0aWwnKSxcclxuICAgICAgICBUZXh0dXJlMkQgPSByZXF1aXJlKCcuLi8uLi9jb3JlL1RleHR1cmUyRCcpLFxyXG4gICAgICAgIE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL01hdGVyaWFsJyk7XHJcblxyXG4gICAgdmFyIFRFWFRVUkVfRk9STUFUUyA9IHtcclxuICAgICAgICBcIjY0MDZcIjogXCJBTFBIQVwiLFxyXG4gICAgICAgIFwiNjQwN1wiOiBcIlJHQlwiLFxyXG4gICAgICAgIFwiNjQwOFwiOiBcIlJHQkFcIixcclxuICAgICAgICBcIjY0MDlcIjogXCJMVU1JTkFOQ0VcIixcclxuICAgICAgICBcIjY0MTBcIjogXCJMVU1JTkFOQ0VfQUxQSEFcIixcclxuICAgICAgICBcImRlZmF1bHRcIjogXCJSR0JBXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRFWFRVUkVfSU5URVJOQUxfRk9STUFUUyA9IHtcclxuICAgICAgICBcIjY0MDZcIjogXCJBTFBIQVwiLFxyXG4gICAgICAgIFwiNjQwN1wiOiBcIlJHQlwiLFxyXG4gICAgICAgIFwiNjQwOFwiOiBcIlJHQkFcIixcclxuICAgICAgICBcIjY0MDlcIjogXCJMVU1JTkFOQ0VcIixcclxuICAgICAgICBcIjY0MTBcIjogXCJMVU1JTkFOQ0VfQUxQSEFcIixcclxuICAgICAgICBcImRlZmF1bHRcIjogXCJSR0JBXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRFWFRVUkVfVFlQRVMgPSB7XHJcbiAgICAgICAgXCI1MTIxXCI6IFwiVU5TSUdORURfQllURVwiLFxyXG4gICAgICAgIFwiMzM2MzVcIjogXCJVTlNJR05FRF9TSE9SVF81XzZfNVwiLFxyXG4gICAgICAgIFwiMzI4MTlcIjogXCJVTlNJR05FRF9TSE9SVF80XzRfNF80XCIsXHJcbiAgICAgICAgXCIzMjgyMFwiOiBcIlVOU0lHTkVEX1NIT1JUXzVfNV81XzFcIixcclxuICAgICAgICBcImRlZmF1bHRcIjogXCJVTlNJR05FRF9CWVRFXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRFQ0hOSVFVRV9QQVJBTUVURVJfVFlQRVMgPSB7XHJcbiAgICAgICAgXCI1MTIyXCI6IFwiU0hPUlRcIixcclxuICAgICAgICBcIjUxMjNcIjogXCJVTlNJR05FRF9TSE9SVFwiLFxyXG4gICAgICAgIFwiNTEyNFwiOiBcIklOVFwiLFxyXG4gICAgICAgIFwiNTEyNVwiOiBcIlVOU0lHTkVEX0lOVFwiLFxyXG4gICAgICAgIFwiNTEyNlwiOiBcIkZMT0FUXCIsXHJcbiAgICAgICAgXCIzNTY2NFwiOiBcIkZMT0FUX1ZFQzJcIixcclxuICAgICAgICBcIjM1NjY1XCI6IFwiRkxPQVRfVkVDM1wiLFxyXG4gICAgICAgIFwiMzU2NjZcIjogXCJGTE9BVF9WRUM0XCIsXHJcbiAgICAgICAgXCIzNTY2N1wiOiBcIklOVF9WRUMyXCIsXHJcbiAgICAgICAgXCIzNTY2OFwiOiBcIklOVF9WRUMzXCIsXHJcbiAgICAgICAgXCIzNTY2OVwiOiBcIklOVF9WRUM0XCIsXHJcbiAgICAgICAgXCIzNTY3MFwiOiBcIkJPT0xcIixcclxuICAgICAgICBcIjM1NjcxXCI6IFwiQk9PTF9WRUMyXCIsXHJcbiAgICAgICAgXCIzNTY3MlwiOiBcIkJPT0xfVkVDM1wiLFxyXG4gICAgICAgIFwiMzU2NzNcIjogXCJCT09MX1ZFQzRcIixcclxuICAgICAgICBcIjM1Njc0XCI6IFwiRkxPQVRfTUFUMlwiLFxyXG4gICAgICAgIFwiMzU2NzVcIjogXCJGTE9BVF9NQVQzXCIsXHJcbiAgICAgICAgXCIzNTY3NlwiOiBcIkZMT0FUX01BVDRcIixcclxuICAgICAgICBcIjM1Njc4XCI6IFwiU0FNUExFUl8yRFwiXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgcHJvcGVydHkgZm9yIHRoZSBtYXRlcmlhbCBiYXNlZCBvbiBpdHMgbmFtZS4gSWYgdGhlcmUgaXMgbm8gdmFsdWUsXHJcbiAgICAgKiBhc3NpZ24gaXQgYSBkZWZhdWx0IGNvbG9yLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtYXRlcmlhbCAtIFRoZSBjdXJyZW50IG1hdGVyaWFsIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbWV0ZXJOYW1lIC0gVGhlIG1hdGVyaWFsIHBhcmFtZXRlcnMgbmFtZS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVRlY2huaXF1ZSAtIFRoZSBpbnN0YW5jZVRlY2huaXF1ZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGV4dHVyZXMgLSBUaGUgbWFwIG9mIFRleHR1cmUyRCBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRNYXRlcmlhbEF0dHJpYnV0ZSggbWF0ZXJpYWwsIHBhcmFtZXRlck5hbWUsIGluc3RhbmNlVGVjaG5pcXVlLCB0ZXh0dXJlcyApIHtcclxuICAgICAgICB2YXIgcGFyYW1ldGVyID0gaW5zdGFuY2VUZWNobmlxdWVbIHBhcmFtZXRlck5hbWUgXTtcclxuICAgICAgICBpZiAoIHBhcmFtZXRlciApIHtcclxuICAgICAgICAgICAgaWYgKCBURUNITklRVUVfUEFSQU1FVEVSX1RZUEVTWyBwYXJhbWV0ZXIudHlwZSBdID09PSBcIlNBTVBMRVJfMkRcIiApIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCB0ZXh0dXJlXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbFsgcGFyYW1ldGVyTmFtZSArIFwiVGV4dHVyZVwiIF0gPSB0ZXh0dXJlc1sgcGFyYW1ldGVyLnZhbHVlIF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgY29sb3JcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsWyBwYXJhbWV0ZXJOYW1lICsgXCJDb2xvclwiIF0gPSBwYXJhbWV0ZXIudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZSBhIE1hdGVyaWFsIG9iamVjdCBmcm9tIHRoZSBpbnN0YW5jZVRlY2huaXF1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWF0ZXJpYWxJZCAtIFRoZSBtYXRlcmlhbHMgdW5pcXVlIGlkO1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlVGVjaG5pcXVlIC0gVGhlIGluc3RhbmNlVGVjaG5pcXVlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXh0dXJlcyAtIFRoZSBtYXAgb2YgVGV4dHVyZTJEIG9iamVjdHMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGluc3RhbnRpYXRlZCBNYXRlcmlhbCBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1hdGVyaWFsKCBtYXRlcmlhbElkLCBpbnN0YW5jZVRlY2huaXF1ZSwgdGV4dHVyZXMgKSB7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsID0ge1xyXG4gICAgICAgICAgICBpZDogbWF0ZXJpYWxJZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gc2V0IGFtYmllbnQgdGV4dHVyZSBvciBjb2xvclxyXG4gICAgICAgIHNldE1hdGVyaWFsQXR0cmlidXRlKFxyXG4gICAgICAgICAgICBtYXRlcmlhbCxcclxuICAgICAgICAgICAgJ2FtYmllbnQnLFxyXG4gICAgICAgICAgICBpbnN0YW5jZVRlY2huaXF1ZSxcclxuICAgICAgICAgICAgdGV4dHVyZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIHNldCBkaWZmdXNlIHRleHR1cmUgb3IgY29sb3JcclxuICAgICAgICBzZXRNYXRlcmlhbEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICdkaWZmdXNlJyxcclxuICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUsXHJcbiAgICAgICAgICAgIHRleHR1cmVzXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBzZXQgc3BlY3VsYXIgdGV4dHVyZSBvciBjb2xvclxyXG4gICAgICAgIHNldE1hdGVyaWFsQXR0cmlidXRlKFxyXG4gICAgICAgICAgICBtYXRlcmlhbCxcclxuICAgICAgICAgICAgJ3NwZWN1bGFyJyxcclxuICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUsXHJcbiAgICAgICAgICAgIHRleHR1cmVzXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBzZXQgc3BlY3VsYXIgY29tcG9uZW50XHJcbiAgICAgICAgaWYgKCBpbnN0YW5jZVRlY2huaXF1ZS5zaGluaW5lc3MgKSB7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyQ29tcG9uZW50ID0gaW5zdGFuY2VUZWNobmlxdWUuc2hpbmluZXNzLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IE1hdGVyaWFsKCBtYXRlcmlhbCApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBnbFRGICdtYXRlcmlhbCcgaGFzIGFuICdpbnN0YW5jZVRlY2huaXF1ZScgYXR0cmlidXRlIHRoYXQgcmVmZXJlbmNlc1xyXG4gICAgICogdGhlICd0ZWNobmlxdWUnIHRvIG92ZXJyaWRlLiBUaGlzIGZ1bmN0aW9uIG92ZXJsYXlzIHRoZSB2YWx1ZXMgZnJvbSB0aGVcclxuICAgICAqIGluc3RhbmNlVGVjaG5pcXVlIG9udG8gdGhlIHRlY2huaXF1ZSBhbmQgcmV0dXJucyBpdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVjaG5pcXVlIC0gVGhlIHRlY2huaXF1ZSB0byBvdmVycmlkZS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVRlY2huaXF1ZSAtIFRoZSBpbnN0YW5jZVRlY2huaXF1ZSB0aGF0IGNvbnRhaW5zIHRoZSBvdmVycmlkZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIG92ZXJyaWRlZCB0ZWNobmlxdWUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG92ZXJyaWRlVGVjaG5pcXVlV2l0aEluc3RhbmNlKCB0ZWNobmlxdWUsIGluc3RhbmNlVGVjaG5pcXVlICkge1xyXG4gICAgICAgIHZhciB0ZWNobmlxdWVQYXJhbWV0ZXJzID0gIFV0aWwuY29weSggdGVjaG5pcXVlLnBhcmFtZXRlcnMgKSxcclxuICAgICAgICAgICAgaW5zdGFuY2VWYWx1ZXMgPSBVdGlsLmNvcHkoIGluc3RhbmNlVGVjaG5pcXVlLnZhbHVlcyApLFxyXG4gICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggcGFyYW1ldGVyIGluIHRoZSAndGVjaG5pcXVlJyBub2RlLCBvdmVycmlkZSB3aXRoXHJcbiAgICAgICAgLy8gJ2luc3RhbmNlVGVjaG5pcXVlJyB2YWx1ZSwgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgZm9yICgga2V5IGluIGluc3RhbmNlVmFsdWVzICkge1xyXG4gICAgICAgICAgICBpZiAoIGluc3RhbmNlVmFsdWVzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCBvciBvdmVycmlkZSB0aGUgdGVjaG5pcXVlcyB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgdGVjaG5pcXVlUGFyYW1ldGVyc1sga2V5IF0udmFsdWUgPSBpbnN0YW5jZVZhbHVlc1sga2V5IF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlY2huaXF1ZVBhcmFtZXRlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW5kIHJldHVybnMgYSBtYXAgb2YgYWxsIE1hdGVyaWFsIG9iamVjdHMgZGVmaW5lZCBpbiB0aGVcclxuICAgICAqIGdsVEYgSlNPTi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ganNvbiAtIFRoZSBnbFRGIEpTT04uXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGV4dHVyZXMgLSBUaGUgbWFwIG9mIFRleHR1cmUyRCBvYmplY3RzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtYXAgb2YgTWF0ZXJpYWwgb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlTWF0ZXJpYWxzKCBqc29uLCB0ZXh0dXJlcyApIHtcclxuICAgICAgICB2YXIgbWF0ZXJpYWxzID0ganNvbi5tYXRlcmlhbHMsXHJcbiAgICAgICAgICAgIHRlY2huaXF1ZXMgPSBqc29uLnRlY2huaXF1ZXMsXHJcbiAgICAgICAgICAgIHJlc3VsdHMgPSB7fSxcclxuICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUsXHJcbiAgICAgICAgICAgIG92ZXJyaWRkZW5UZWNobmlxdWUsXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBtYXRlcmlhbFxyXG4gICAgICAgIGZvciAoIGtleSBpbiBtYXRlcmlhbHMgKSB7XHJcbiAgICAgICAgICAgIGlmICggbWF0ZXJpYWxzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlVGVjaG5pcXVlID0gbWF0ZXJpYWxzWyBrZXkgXS5pbnN0YW5jZVRlY2huaXF1ZTtcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJpZGUgdGhlIHRlY2huaXF1ZSB2YWx1ZXMgd2l0aCBpbnN0YW5jZSB0ZWNobmlxdWUgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBvdmVycmlkZGVuVGVjaG5pcXVlID0gb3ZlcnJpZGVUZWNobmlxdWVXaXRoSW5zdGFuY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgdGVjaG5pcXVlc1sgaW5zdGFuY2VUZWNobmlxdWUudGVjaG5pcXVlIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUgKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbm5lY3QgdGV4dHVyZSBpbWFnZSBzb3VyY2VzXHJcbiAgICAgICAgICAgICAgICByZXN1bHRzWyBrZXkgXSA9IGNyZWF0ZU1hdGVyaWFsKCBrZXksIG92ZXJyaWRkZW5UZWNobmlxdWUsIHRleHR1cmVzICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW5kIHJldHVybnMgYSBtYXAgb2YgYWxsIFRleHR1cmUyRCBvYmplY3RzIGRlZmluZWQgaW4gdGhlXHJcbiAgICAgKiBnbFRGIEpTT04uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGpzb24gLSBUaGUgZ2xURiBKU09OLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGltYWdlcyAtIFRoZSBtYXAgb2YgSW1hZ2Ugb2JqZWN0cy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbWFwIG9mIFRleHR1cmUyRCBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVUZXh0dXJlcygganNvbiwgaW1hZ2VzICkge1xyXG4gICAgICAgIHZhciB0ZXh0dXJlcyA9IGpzb24udGV4dHVyZXMsXHJcbiAgICAgICAgICAgIHRleHR1cmUsXHJcbiAgICAgICAgICAgIHJlc3VsdHMgPSB7fSxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIC8vIGZvciBlYWNoIHRleHR1cmVcclxuICAgICAgICBmb3IgKCBrZXkgaW4gdGV4dHVyZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGV4dHVyZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZSA9IHRleHR1cmVzWyBrZXkgXTtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBUZXh0dXJlMkQgb2JqZWN0IGZyb20gaW1hZ2VcclxuICAgICAgICAgICAgICAgIHJlc3VsdHNbIGtleSBdID0gbmV3IFRleHR1cmUyRCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGltYWdlc1sgdGV4dHVyZS5zb3VyY2UgXSxcclxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFRFWFRVUkVfRk9STUFUU1sgdGV4dHVyZS5mb3JtYXQgXSB8fCBURVhUVVJFX0ZPUk1BVFMuZGVmYXVsdCxcclxuICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbEZvcm1hdDogVEVYVFVSRV9JTlRFUk5BTF9GT1JNQVRTWyB0ZXh0dXJlLmludGVybmFsRm9ybWF0IF0gfHwgVEVYVFVSRV9JTlRFUk5BTF9GT1JNQVRTLmRlZmF1bHQsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogVEVYVFVSRV9UWVBFU1sgdGV4dHVyZS50eXBlIF0gfHwgVEVYVFVSRV9UWVBFUy5kZWZhdWx0LFxyXG4gICAgICAgICAgICAgICAgICAgIHdyYXA6IFwiUkVQRUFUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJ0WTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBMb2FkIGFuZCBjcmVhdGUgYWxsIE1hdGVyaWFsIG9iamVjdHMgc3RvcmVkIGluIHRoZSBnbFRGIEpTT04uIFVwb25cclxuICAgICAgICAgKiBjb21wbGV0aW9uLCBleGVjdXRlcyBjYWxsYmFjayBmdW5jdGlvbiBwYXNzaW5nIG1hdGVyaWFsIG1hcCBhcyBmaXJzdFxyXG4gICAgICAgICAqIGFyZ3VtZW50LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGpzb24gLSBUaGUgZ2xURiBKU09OLlxyXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWRNYXRlcmlhbHM6IGZ1bmN0aW9uKCBqc29uLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgLy8gc2VuZCByZXF1ZXN0cyBmb3IgaW1hZ2VzXHJcbiAgICAgICAgICAgIGdsVEZVdGlsLnJlcXVlc3RJbWFnZXMoIGpzb24uaW1hZ2VzLCBmdW5jdGlvbiggaW1hZ2VzICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRleHR1cmVzIGZyb20gaW1hZ2VzLCB0aGVuIGNyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlcyA9IGNyZWF0ZVRleHR1cmVzKCBqc29uLCBpbWFnZXMgKSxcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHMgPSBjcmVhdGVNYXRlcmlhbHMoIGpzb24sIHRleHR1cmVzICk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggbWF0ZXJpYWxzICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVydGV4QnVmZmVyID0gcmVxdWlyZSgnLi4vLi4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcclxuICAgICAgICBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvSW5kZXhCdWZmZXInKSxcclxuICAgICAgICBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuLi8uLi9jb3JlL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIE1lc2ggPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvTWVzaCcpO1xyXG5cclxuICAgIHZhciBBQ0NFU1NPUl9DT01QT05FTlRfVFlQRVMgPSB7XHJcbiAgICAgICAgXCI1MTIwXCI6IFwiQllURVwiLFxyXG4gICAgICAgIFwiNTEyMVwiOiBcIlVOU0lHTkVEX0JZVEVcIixcclxuICAgICAgICBcIjUxMjJcIjogXCJTSE9SVFwiLFxyXG4gICAgICAgIFwiNTEyM1wiOiBcIlVOU0lHTkVEX1NIT1JUXCIsXHJcbiAgICAgICAgXCI1MTI2XCI6IFwiRkxPQVRcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgUFJJTUlUSVZFX01PREVTID0ge1xyXG4gICAgICAgIFwiMFwiOiBcIlBPSU5UU1wiLFxyXG4gICAgICAgIFwiMVwiOiBcIkxJTkVTXCIsXHJcbiAgICAgICAgXCIyXCI6IFwiTElORV9MT09QXCIsXHJcbiAgICAgICAgXCIzXCI6IFwiTElORV9TVFJJUFwiLFxyXG4gICAgICAgIFwiNFwiOiBcIlRSSUFOR0xFU1wiLFxyXG4gICAgICAgIFwiNVwiOiBcIlRSSUFOR0xFX1NUUklQXCIsXHJcbiAgICAgICAgXCI2XCI6IFwiVFJJQU5HTEVfRkFOXCIsXHJcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiVFJJQU5HTEVTXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIEJVRkZFUlZJRVdfVEFSR0VUUyA9IHtcclxuICAgICAgICBcIjM0OTYyXCI6IFwiQVJSQVlfQlVGRkVSXCIsXHJcbiAgICAgICAgXCIzNDk2M1wiOiBcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIENPTVBPTkVOVF9UWVBFU19UT19UWVBFRF9BUlJBWVMgPSB7XHJcbiAgICAgICAgXCI1MTIwXCI6IEludDhBcnJheSxcclxuICAgICAgICBcIjUxMjFcIjogVWludDhBcnJheSxcclxuICAgICAgICBcIjUxMjJcIjogSW50MTZBcnJheSxcclxuICAgICAgICBcIjUxMjNcIjogVWludDE2QXJyYXksXHJcbiAgICAgICAgXCI1MTI2XCI6IEZsb2F0MzJBcnJheVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVFlQRVNfVE9fTlVNX0NPTVBPTkVOVFMgPSB7XHJcbiAgICAgICAgXCJTQ0FMQVJcIjogMSxcclxuICAgICAgICBcIlZFQzJcIjogMixcclxuICAgICAgICBcIlZFQzNcIjogMyxcclxuICAgICAgICBcIlZFQzRcIjogNCxcclxuICAgICAgICBcIk1BVDJcIjogNCxcclxuICAgICAgICBcIk1BVDNcIjogOSxcclxuICAgICAgICBcIk1BVDRcIjogMTZcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhY2Nlc3Nvck5hbWUsIGpzb24sIGJ1ZmZlcnMgKSB7XHJcblxyXG4gICAgICAgIGlmICggIWFjY2Vzc29yTmFtZSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCksXHJcbiAgICAgICAgICAgIGFjY2Vzc29yID0ganNvbi5hY2Nlc3NvcnNbIGFjY2Vzc29yTmFtZSBdLFxyXG4gICAgICAgICAgICBidWZmZXJWaWV3TmFtZSA9IGFjY2Vzc29yLmJ1ZmZlclZpZXcsXHJcbiAgICAgICAgICAgIGJ1ZmZlclZpZXcgPSBqc29uLmJ1ZmZlclZpZXdzWyBidWZmZXJWaWV3TmFtZSBdLFxyXG4gICAgICAgICAgICBidWZmZXJUYXJnZXQgPSBCVUZGRVJWSUVXX1RBUkdFVFNbIGJ1ZmZlclZpZXcudGFyZ2V0IF0sXHJcbiAgICAgICAgICAgIGFjY2Vzc29yQXJyYXlDb3VudCA9IGFjY2Vzc29yLmNvdW50ICogVFlQRVNfVE9fTlVNX0NPTVBPTkVOVFNbIGFjY2Vzc29yLnR5cGUgXSxcclxuICAgICAgICAgICAgVHlwZWRBcnJheSA9IENPTVBPTkVOVF9UWVBFU19UT19UWVBFRF9BUlJBWVNbIGFjY2Vzc29yLmNvbXBvbmVudFR5cGUgXTtcclxuXHJcbiAgICAgICAgaWYgKCAhd2ViZ2xCdWZmZXJzWyBidWZmZXJWaWV3TmFtZSBdICkge1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGJ1ZmZlciBpZiBpdCBkb2VzbnQgZXhpc3RcclxuICAgICAgICAgICAgd2ViZ2xCdWZmZXJzWyBidWZmZXJWaWV3TmFtZSBdID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgdHlwZSBvZiBidWZmZXIgdGFyZ2V0XHJcbiAgICAgICAgICAgIGJ1ZmZlclRhcmdldCA9IEJVRkZFUlZJRVdfVEFSR0VUU1sgYnVmZmVyVmlldy50YXJnZXQgXTtcclxuICAgICAgICAgICAgLy8gYmluZCBhbmQgc2V0IGJ1ZmZlcnMgYnl0ZSBsZW5ndGhcclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2xbIGJ1ZmZlclRhcmdldCBdLCB3ZWJnbEJ1ZmZlcnNbIGJ1ZmZlclZpZXdOYW1lIF0gKTtcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSggZ2xbIGJ1ZmZlclRhcmdldCBdLCBidWZmZXJWaWV3LmJ5dGVMZW5ndGgsIGdsLlNUQVRJQ19EUkFXICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBjYWNoZSBhY2Nlc3NvcnMgc28gdGhhdCB0aGVpciBkYXRhIGlzbid0IGJ1ZmZlcmVkIG11bHRpcGxlIHRpbWVzP1xyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgYWNjZXNzb3JzIHN1YiBkYXRhXHJcbiAgICAgICAgZ2wuYnVmZmVyU3ViRGF0YSggZ2xbIGJ1ZmZlclRhcmdldCBdLFxyXG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIGRhdGEgZnJvbSB0aGUgYWNjZXNzb3JzIG9mZnNldCBpbnRvIHRoZSBXZWJHTEJ1ZmZlclxyXG4gICAgICAgICAgICBhY2Nlc3Nvci5ieXRlT2Zmc2V0LFxyXG4gICAgICAgICAgICBuZXcgVHlwZWRBcnJheShcclxuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgcmVzcGVjdGl2ZSBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgYnVmZmVyc1sgYnVmZmVyVmlldy5idWZmZXIgXSxcclxuICAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgdGhlIGJ1ZmZlclZpZXdzIG9mZnNldCBhbmQgdGhlIGFjY2Vzc29ycyBvZmZzZXRcclxuICAgICAgICAgICAgICAgIGJ1ZmZlclZpZXcuYnl0ZU9mZnNldCArIGFjY2Vzc29yLmJ5dGVPZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IFwidmlld1wiIHRoZSBhY2Nlc3NvcnMgY291bnQgKCB0YWtpbmcgaW50byBhY2NvdW50IHRoZSBudW1iZXIgb2YgY29tcG9uZW50cyBwZXIgdHlwZSApXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NvckFycmF5Q291bnQgKSApO1xyXG4gICAgICAgIC8vIHJldHVybiBhdHRyaWJ1dGVQb2ludGVyXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYnVmZmVyVmlldzogYnVmZmVyVmlld05hbWUsXHJcbiAgICAgICAgICAgIHNpemU6IFRZUEVTX1RPX05VTV9DT01QT05FTlRTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIHR5cGU6IEFDQ0VTU09SX0NPTVBPTkVOVF9UWVBFU1sgYWNjZXNzb3IuY29tcG9uZW50VHlwZSBdLFxyXG4gICAgICAgICAgICBzdHJpZGU6IGFjY2Vzc29yLmJ5dGVTdHJpZGUsXHJcbiAgICAgICAgICAgIG9mZnNldDogYWNjZXNzb3IuYnl0ZU9mZnNldCxcclxuICAgICAgICAgICAgY291bnQ6IGFjY2Vzc29yLmNvdW50XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgaW5kZXgsIGF0dHJpYnV0ZVBvaW50ZXIgKSB7XHJcbiAgICAgICAgaWYgKCAhYXR0cmlidXRlUG9pbnRlciApIHtcclxuICAgICAgICAgICAgLy8gaWdub3JlIGlmIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCB2ZXJ0ZXggYXR0cmlidXRlIHBvaW50ZXIgdW5kZXIgdGhlIGNvcnJlY3Qgd2ViZ2xidWZmZXJcclxuICAgICAgICBwb2ludGVyc0J5QnVmZmVyVmlld1sgYXR0cmlidXRlUG9pbnRlci5idWZmZXJWaWV3IF0gPSBwb2ludGVyc0J5QnVmZmVyVmlld1sgYXR0cmlidXRlUG9pbnRlci5idWZmZXJWaWV3IF0gfHwge307XHJcbiAgICAgICAgcG9pbnRlcnNCeUJ1ZmZlclZpZXdbIGF0dHJpYnV0ZVBvaW50ZXIuYnVmZmVyVmlldyBdWyBpbmRleCBdID0gYXR0cmlidXRlUG9pbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVNZXNoRnJvbVByaW1pdGl2ZSggd2ViZ2xCdWZmZXJzLCBwcmltaXRpdmUsIGpzb24sIGJ1ZmZlcnMsIG1hdGVyaWFscyApIHtcclxuXHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuYXR0cmlidXRlcyxcclxuICAgICAgICAgICAgaW5kaWNlcyA9IHByaW1pdGl2ZS5pbmRpY2VzLFxyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IHByaW1pdGl2ZS5tYXRlcmlhbCxcclxuICAgICAgICAgICAgcG9pbnRlcnNCeUJ1ZmZlclZpZXcgPSB7fSxcclxuICAgICAgICAgICAgdmVydGV4QnVmZmVycyA9IFtdLFxyXG4gICAgICAgICAgICBpbmRleEJ1ZmZlcixcclxuICAgICAgICAgICAgcG9zaXRpb25zUG9pbnRlcixcclxuICAgICAgICAgICAgbm9ybWFsc1BvaW50ZXIsXHJcbiAgICAgICAgICAgIHV2c1BvaW50ZXIsXHJcbiAgICAgICAgICAgIGNvbG9yc1BvaW50ZXIsXHJcbiAgICAgICAgICAgIGpvaW50c1BvaW50ZXIsXHJcbiAgICAgICAgICAgIHdlaWdodHNQb2ludGVyLFxyXG4gICAgICAgICAgICBpbmRpY2VzUG9pbnRlcixcclxuICAgICAgICAgICAgYXR0cmlidXRlUG9pbnRlcnMsXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICAvLyBidWZmZXIgYXR0cmlidXRlIGRhdGEgYW5kIHN0b3JlIHJlc3VsdGluZyBhdHRyaWJ1dGUgcG9pbnRlcnNcclxuICAgICAgICBwb3NpdGlvbnNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLlBPU0lUSU9OIHx8IGF0dHJpYnV0ZXMuUE9TSVRJT05fMCwganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIG5vcm1hbHNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLk5PUk1BTCB8fCBhdHRyaWJ1dGVzLk5PUk1BTF8wLCBqc29uLCBidWZmZXJzICk7XHJcbiAgICAgICAgdXZzUG9pbnRlciA9IGJ1ZmZlckF0dHJpYnV0ZURhdGEoIHdlYmdsQnVmZmVycywgYXR0cmlidXRlcy5URVhDT09SRCB8fCBhdHRyaWJ1dGVzLlRFWENPT1JEXzAsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICBqb2ludHNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLkpPSU5UIHx8IGF0dHJpYnV0ZXMuSk9JTlRfMCwganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIHdlaWdodHNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLldFSUdIVCB8fCBhdHRyaWJ1dGVzLldFSUdIVF8wLCBqc29uLCBidWZmZXJzICk7XHJcbiAgICAgICAgY29sb3JzUG9pbnRlciA9IGJ1ZmZlckF0dHJpYnV0ZURhdGEoIHdlYmdsQnVmZmVycywgYXR0cmlidXRlcy5DT0xPUiB8fCBhdHRyaWJ1dGVzLkNPTE9SXzAsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICAvLyBjcmVhdGUgbWFwIG9mIHBvaW50ZXJzIGtleWVkIGJ5IGJ1ZmZlcnZpZXdcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIwXCIsIHBvc2l0aW9uc1BvaW50ZXIgKTtcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIxXCIsIG5vcm1hbHNQb2ludGVyICk7XHJcbiAgICAgICAgc2V0UG9pbnRlckJ5QnVmZmVyVmlldyggcG9pbnRlcnNCeUJ1ZmZlclZpZXcsIFwiMlwiLCB1dnNQb2ludGVyICk7XHJcbiAgICAgICAgLy9zZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIzXCIsIGNvbG9yc1BvaW50ZXIgKTtcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIzXCIsIGpvaW50c1BvaW50ZXIgKTtcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCI0XCIsIHdlaWdodHNQb2ludGVyICk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggYnVmZmVydmlldyBjcmVhdGUgYSBWZXJ0ZXhCdWZmZXIgb2JqZWN0LCBhbmRcclxuICAgICAgICAvLyBwYXNzIHRoZSBwb2ludGVycyBmb3IgdGhlIGF0dHJpYnV0ZXMgdGhhdCB1c2UgaXRcclxuICAgICAgICBmb3IgKCBrZXkgaW4gcG9pbnRlcnNCeUJ1ZmZlclZpZXcgKSB7XHJcbiAgICAgICAgICAgIGlmICggcG9pbnRlcnNCeUJ1ZmZlclZpZXcuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlUG9pbnRlcnMgPSBwb2ludGVyc0J5QnVmZmVyVmlld1sga2V5IF07XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgVmVydGV4QnVmZmVyIHRoYXQgcmVmZXJlbmNlcyB0aGUgV2ViR0xCdWZmZXIgZm9yIHRoZSBidWZmZXJ2aWV3XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXJzLnB1c2goIG5ldyBWZXJ0ZXhCdWZmZXIoIHdlYmdsQnVmZmVyc1sga2V5IF0sIGF0dHJpYnV0ZVBvaW50ZXJzICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgc2ltaWxhciBwb2ludGVyIGZvciBpbmRpY2VzXHJcbiAgICAgICAgaW5kaWNlc1BvaW50ZXIgPSBidWZmZXJBdHRyaWJ1dGVEYXRhKCB3ZWJnbEJ1ZmZlcnMsIGluZGljZXMsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICAvLyBzZXQgcHJpbWlpdmUgbW9kZVxyXG4gICAgICAgIGluZGljZXNQb2ludGVyLm1vZGUgPSBQUklNSVRJVkVfTU9ERVNbIHByaW1pdGl2ZS5wcmltaXRpdmUgXSB8fCBQUklNSVRJVkVfTU9ERVMuZGVmYXVsdDtcclxuICAgICAgICAvLyBjcmVhdGUgSW5kZXhCdWZmZXIgdGhhdCByZWZlcmVuY2VzIHRoZSBXZWJHTEJ1ZmZlciBmb3IgdGhlIGJ1ZmZlcnZpZXdcclxuICAgICAgICBpbmRleEJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlcihcclxuICAgICAgICAgICAgd2ViZ2xCdWZmZXJzWyBpbmRpY2VzUG9pbnRlci5idWZmZXJWaWV3IF0sXHJcbiAgICAgICAgICAgIGluZGljZXNQb2ludGVyICk7XHJcbiAgICAgICAgLy8gaW5zdGFudGlhdGUgdGhlIE1lc2ggb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgdmVydGV4QnVmZmVyczogdmVydGV4QnVmZmVycyxcclxuICAgICAgICAgICAgaW5kZXhCdWZmZXI6IGluZGV4QnVmZmVyLFxyXG4gICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWxzWyBtYXRlcmlhbCBdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTWVzaGVzKCB3ZWJnbEJ1ZmZlcnMsIG1lc2gsIGpzb24sIGJ1ZmZlcnMsIG1hdGVyaWFscyApIHtcclxuICAgICAgICB2YXIgcHJpbWl0aXZlcyA9IG1lc2gucHJpbWl0aXZlcyxcclxuICAgICAgICAgICAgbWVzaGVzID0gW10sXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggcHJpbWl0aXZlXHJcbiAgICAgICAgZm9yICggaT0wOyBpPHByaW1pdGl2ZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBtZXNoIGZvciB0aGUgcHJpbWl0aXZlIHNldFxyXG4gICAgICAgICAgICBtZXNoZXMucHVzaChcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU1lc2hGcm9tUHJpbWl0aXZlKFxyXG4gICAgICAgICAgICAgICAgICAgIHdlYmdsQnVmZmVycyxcclxuICAgICAgICAgICAgICAgICAgICBwcmltaXRpdmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVycyxcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHNcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1lc2hlcztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgY3JlYXRlTWVzaGVzOiBmdW5jdGlvbigganNvbiwgYnVmZmVycywgbWF0ZXJpYWxzICkge1xyXG4gICAgICAgICAgICB2YXIgbWVzaGVzID0ganNvbi5tZXNoZXMsXHJcbiAgICAgICAgICAgICAgICB3ZWJnbEJ1ZmZlcnMgPSB7fSxcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSB7fSxcclxuICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggbWVzaFxyXG4gICAgICAgICAgICBmb3IgKCBrZXkgaW4ganNvbi5tZXNoZXMgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGpzb24ubWVzaGVzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGFycmF5IG9mIG1lc2hlcyBmb3IgdGhlIG1lc2hcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzWyBrZXkgXSA9IGNyZWF0ZU1lc2hlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2ViZ2xCdWZmZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoZXNbIGtleSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHMgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMyBGYWJyaWNlIFJvYmluZXRcclxuLy8gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy9cclxuLy8gUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XHJcbi8vIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG4vL1xyXG4vLyAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4vLyAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbi8vICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcclxuLy8gICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuLy9cclxuLy8gIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXHJcbi8vIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcclxuLy8gSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcclxuLy8gQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxyXG4vLyBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xyXG4vLyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XHJcbi8vIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxyXG4vLyBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxyXG4vLyAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0ZcclxuLy8gVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuXHJcbi8qXHJcbiAgICBUaGUgQWJzdHJhY3QgTG9hZGVyIGhhcyB0d28gbW9kZXM6XHJcbiAgICAgICAgIzE6IFtzdGF0aWNdIGxvYWQgYWxsIHRoZSBKU09OIGF0IG9uY2UgW2FzIG9mIG5vd11cclxuICAgICAgICAjMjogW3N0cmVhbV0gc3RyZWFtIGFuZCBwYXJzZSBKU09OIHByb2dyZXNzaXZlbHkgW25vdCB5ZXQgc3VwcG9ydGVkXVxyXG5cclxuICAgIFdoYXRldmVyIGlzIHRoZSBtZWNoYW5pc20gdXNlZCB0byBwYXJzZSB0aGUgSlNPTiAoIzEgb3IgIzIpLFxyXG4gICAgVGhlIGxvYWRlciBzdGFydHMgYnkgcmVzb2x2aW5nIHRoZSBwYXRocyB0byBiaW5hcmllcyBhbmQgcmVmZXJlbmNlZCBqc29uIGZpbGVzIChieSByZXBsYWNlIHRoZSB2YWx1ZSBvZiB0aGUgcGF0aCBwcm9wZXJ0eSB3aXRoIGFuIGFic29sdXRlIHBhdGggaWYgaXQgd2FzIHJlbGF0aXZlKS5cclxuXHJcbiAgICBJbiBjYXNlICMxOiBpdCBpcyBndWFyYW50ZWVkIHRvIGNhbGwgdGhlIGNvbmNyZXRlIGxvYWRlciBpbXBsZW1lbnRhdGlvbiBtZXRob2RzIGluIGEgb3JkZXIgdGhhdCBzb2x2ZXMgdGhlIGRlcGVuZGVuY2llcyBiZXR3ZWVuIHRoZSBlbnRyaWVzLlxyXG4gICAgb25seSB0aGUgbm9kZXMgcmVxdWlyZXMgYW4gZXh0cmEgcGFzcyB0byBzZXQgdXAgdGhlIGhpcmVyYXJjaHkuXHJcbiAgICBJbiBjYXNlICMyOiB0aGUgY29uY3JldGUgaW1wbGVtZW50YXRpb24gd2lsbCBoYXZlIHRvIHNvbHZlIHRoZSBkZXBlbmRlbmNpZXMuIG5vIG9yZGVyIGlzIGd1YXJhbnRlZWQuXHJcblxyXG4gICAgV2hlbiBjYXNlICMxIGlzIHVzZWQgdGhlIGZvbGxvd2VkIGRlcGVuZGVuY3kgb3JkZXIgaXM6XHJcblxyXG4gICAgc2NlbmVzIC0+IG5vZGVzIC0+IG1lc2hlcyAtPiBtYXRlcmlhbHMgLT4gdGVjaG5pcXVlcyAtPiBzaGFkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgLT4gYnVmZmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIC0+IGNhbWVyYXNcclxuICAgICAgICAgICAgICAgICAgICAtPiBsaWdodHNcclxuXHJcbiAgICBUaGUgcmVhZGVycyBzdGFydHMgd2l0aCB0aGUgbGVhZnMsIGkuZTpcclxuICAgICAgICBzaGFkZXJzLCB0ZWNobmlxdWVzLCBtYXRlcmlhbHMsIG1lc2hlcywgYnVmZmVycywgY2FtZXJhcywgbGlnaHRzLCBub2Rlcywgc2NlbmVzXHJcblxyXG4gICAgRm9yIGVhY2ggY2FsbGVkIGhhbmRsZSBtZXRob2QgY2FsbGVkIHRoZSBjbGllbnQgc2hvdWxkIHJldHVybiB0cnVlIGlmIHRoZSBuZXh0IGhhbmRsZSBjYW4gYmUgY2FsbCByaWdodCBhZnRlciByZXR1cm5pbmcsXHJcbiAgICBvciBmYWxzZSBpZiBhIGNhbGxiYWNrIG9uIGNsaWVudCBzaWRlIHdpbGwgbm90aWZ5IHRoZSBsb2FkZXIgdGhhdCB0aGUgbmV4dCBoYW5kbGUgbWV0aG9kIGNhbiBiZSBjYWxsZWQuXHJcblxyXG4qL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICBcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBjYXRlZ29yaWVzRGVwc09yZGVyID0gW1wiYnVmZmVyc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYnVmZmVyVmlld3NcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImltYWdlc1wiLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZpZGVvc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2FtcGxlcnNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHR1cmVzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGFkZXJzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9ncmFtc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGVjaG5pcXVlc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWF0ZXJpYWxzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NvcnNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lc2hlc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FtZXJhc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGlnaHRzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJza2luc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZXNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNjZW5lc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5pbWF0aW9uc1wiXTtcclxuXHJcbiAgICB2YXIgZ2xURlBhcnNlciA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LnByb3RvdHlwZSwge1xyXG5cclxuICAgICAgICBfcm9vdERlc2NyaXB0aW9uOiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxyXG5cclxuICAgICAgICByb290RGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdERlc2NyaXB0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdERlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYmFzZVVSTDogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcclxuXHJcbiAgICAgICAgLy9kZXRlY3QgYWJzb2x1dGUgcGF0aCBmb2xsb3dpbmcgdGhlIHNhbWUgcHJvdG9jb2wgdGhhbiB3aW5kb3cubG9jYXRpb25cclxuICAgICAgICBfaXNBYnNvbHV0ZVBhdGg6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpc0Fic29sdXRlUGF0aFJlZ0V4cCA9IG5ldyBSZWdFeHAoXCJeXCIrd2luZG93LmxvY2F0aW9uLnByb3RvY29sLCBcImlcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGgubWF0Y2goaXNBYnNvbHV0ZVBhdGhSZWdFeHApID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVzb2x2ZVBhdGhJZk5lZWRlZDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzQWJzb2x1dGVQYXRoKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVVSTCArIHBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfcmVzb2x2ZVBhdGhzRm9yQ2F0ZWdvcmllczoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKCBmdW5jdGlvbihjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbnMgPSB0aGlzLmpzb25bY2F0ZWdvcnldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uS2V5cyA9IE9iamVjdC5rZXlzKGRlc2NyaXB0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uS2V5cy5mb3JFYWNoKCBmdW5jdGlvbihkZXNjcmlwdGlvbktleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25zW2Rlc2NyaXB0aW9uS2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLnBhdGggPSB0aGlzLnJlc29sdmVQYXRoSWZOZWVkZWQoZGVzY3JpcHRpb24ucGF0aCB8fCBkZXNjcmlwdGlvbi51cmkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9qc29uOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGpzb246IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9qc29uO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fanNvbiAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qc29uID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZVBhdGhzRm9yQ2F0ZWdvcmllcyhbXCJidWZmZXJzXCIsIFwic2hhZGVyc1wiLCBcImltYWdlc1wiLCBcInZpZGVvc1wiXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfcGF0aDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRFbnRyeURlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoZW50cnlJRCwgZW50cnlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZW50cmllcyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5ID0gZW50cnlUeXBlO1xyXG4gICAgICAgICAgICAgICAgZW50cmllcyA9IHRoaXMucm9vdERlc2NyaXB0aW9uW2NhdGVnb3J5XTtcclxuICAgICAgICAgICAgICAgIGlmICghZW50cmllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6Q0FOTk9UIGZpbmQgZXhwZWN0ZWQgY2F0ZWdvcnkgbmFtZWQ6XCIrY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzID8gZW50cmllc1tlbnRyeUlEXSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfc3RlcFRvTmV4dENhdGVnb3J5OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLmNhdGVnb3J5SW5kZXggPSB0aGlzLmdldE5leHRDYXRlZ29yeUluZGV4KHRoaXMuX3N0YXRlLmNhdGVnb3J5SW5kZXggKyAxKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZS5jYXRlZ29yeUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLmNhdGVnb3J5U3RhdGUuaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9zdGVwVG9OZXh0RGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeVN0YXRlID0gdGhpcy5fc3RhdGUuY2F0ZWdvcnlTdGF0ZTtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gY2F0ZWdvcnlTdGF0ZS5rZXlzO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrZXlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTkNPTlNJU1RFTkNZIEVSUk9SXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVN0YXRlLmluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVN0YXRlLmtleXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5U3RhdGUuaW5kZXggPj0ga2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RlcFRvTmV4dENhdGVnb3J5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBoYXNDYXRlZ29yeToge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJvb3REZXNjcmlwdGlvbltjYXRlZ29yeV0gPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfaGFuZGxlU3RhdGU6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtZXRob2RGb3JUeXBlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYnVmZmVyc1wiIDogdGhpcy5oYW5kbGVCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJidWZmZXJWaWV3c1wiIDogdGhpcy5oYW5kbGVCdWZmZXJWaWV3LFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2hhZGVyc1wiIDogdGhpcy5oYW5kbGVTaGFkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9ncmFtc1wiIDogdGhpcy5oYW5kbGVQcm9ncmFtLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVjaG5pcXVlc1wiIDogdGhpcy5oYW5kbGVUZWNobmlxdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtYXRlcmlhbHNcIiA6IHRoaXMuaGFuZGxlTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXNoZXNcIiA6IHRoaXMuaGFuZGxlTWVzaCxcclxuICAgICAgICAgICAgICAgICAgICBcImNhbWVyYXNcIiA6IHRoaXMuaGFuZGxlQ2FtZXJhLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRzXCIgOiB0aGlzLmhhbmRsZUxpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZXNcIiA6IHRoaXMuaGFuZGxlTm9kZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNjZW5lc1wiIDogdGhpcy5oYW5kbGVTY2VuZSxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlc1wiIDogdGhpcy5oYW5kbGVJbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICBcImFuaW1hdGlvbnNcIiA6IHRoaXMuaGFuZGxlQW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYWNjZXNzb3JzXCIgOiB0aGlzLmhhbmRsZUFjY2Vzc29yLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2tpbnNcIiA6IHRoaXMuaGFuZGxlU2tpbixcclxuICAgICAgICAgICAgICAgICAgICBcInNhbXBsZXJzXCIgOiB0aGlzLmhhbmRsZVNhbXBsZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0dXJlc1wiIDogdGhpcy5oYW5kbGVUZXh0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidmlkZW9zXCIgOiB0aGlzLmhhbmRsZVZpZGVvXHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5fc3RhdGUuY2F0ZWdvcnlJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSBjYXRlZ29yaWVzRGVwc09yZGVyW3RoaXMuX3N0YXRlLmNhdGVnb3J5SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeVN0YXRlID0gdGhpcy5fc3RhdGUuY2F0ZWdvcnlTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5cyA9IGNhdGVnb3J5U3RhdGUua2V5cztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWtleXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlTdGF0ZS5rZXlzID0ga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMucm9vdERlc2NyaXB0aW9uW2NhdGVnb3J5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGVwVG9OZXh0RGVzY3JpcHRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBjYXRlZ29yeTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW50cnlJRCA9IGtleXNbY2F0ZWdvcnlTdGF0ZS5pbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXRFbnRyeURlc2NyaXB0aW9uKGVudHJ5SUQsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoXCJJTkNPTlNJU1RFTkNZIEVSUk9SOiBubyBkZXNjcmlwdGlvbiBmb3VuZCBmb3IgZW50cnkgXCIrZW50cnlJRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kRm9yVHlwZVt0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZEZvclR5cGVbdHlwZV0uY2FsbCh0aGlzLCBlbnRyeUlELCBkZXNjcmlwdGlvbiwgdGhpcy5fc3RhdGUudXNlckluZm8pID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RlcFRvTmV4dERlc2NyaXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhbmRsZUxvYWRDb21wbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWRDb21wbGV0ZWQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2xvYWRKU09OSWZOZWVkZWQ6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvL0ZJWE1FOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fanNvbikgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvblBhdGggPSB0aGlzLl9wYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0ganNvblBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFzZVVSTCA9IChpICE9PSAwKSA/IGpzb25QYXRoLnN1YnN0cmluZygwLCBpICsgMSkgOiAnJztcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbmZpbGUgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS5vcGVuKFwiR0VUXCIsIGpzb25QYXRoLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuanNvbiA9IEpTT04ucGFyc2UoanNvbmZpbGUucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNlbGYuanNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAganNvbmZpbGUuc2VuZChudWxsKTtcclxuICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5qc29uKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiBsb2FkIEpTT04gYW5kIGFzc2lnbiBpdCBhcyBkZXNjcmlwdGlvbiB0byB0aGUgcmVhZGVyICovXHJcbiAgICAgICAgX2J1aWxkTG9hZGVyOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gSlNPTlJlYWR5KGpzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJvb3REZXNjcmlwdGlvbiA9IGpzb247XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRKU09OSWZOZWVkZWQoSlNPTlJlYWR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9zdGF0ZTogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcclxuXHJcbiAgICAgICAgX2dldEVudHJ5VHlwZToge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm9vdEtleXMgPSBjYXRlZ29yaWVzRGVwc09yZGVyO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAgOyAgaSA8IHJvb3RLZXlzLmxlbmd0aCA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb290VmFsdWVzID0gdGhpcy5yb290RGVzY3JpcHRpb25bcm9vdEtleXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb290VmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb290S2V5c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldE5leHRDYXRlZ29yeUluZGV4OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihjdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBjdXJyZW50SW5kZXggOyBpIDwgY2F0ZWdvcmllc0RlcHNPcmRlci5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNDYXRlZ29yeShjYXRlZ29yaWVzRGVwc09yZGVyW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbG9hZDoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24odXNlckluZm8sIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J1aWxkTG9hZGVyKGZ1bmN0aW9uIGxvYWRlclJlYWR5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydENhdGVnb3J5ID0gc2VsZi5nZXROZXh0Q2F0ZWdvcnlJbmRleC5jYWxsKHNlbGYsMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0Q2F0ZWdvcnkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3N0YXRlID0geyBcInVzZXJJbmZvXCIgOiB1c2VySW5mbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiIDogb3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0ZWdvcnlJbmRleFwiIDogc3RhcnRDYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0ZWdvcnlTdGF0ZVwiIDogeyBcImluZGV4XCIgOiBcIjBcIiB9IH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2hhbmRsZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0V2l0aFBhdGg6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fanNvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vdGhpcyBpcyBtZWFudCB0byBiZSBnbG9iYWwgYW5kIGNvbW1vbiBmb3IgYWxsIGluc3RhbmNlc1xyXG4gICAgICAgIF9rbm93blVSTHM6IHsgd3JpdGFibGU6IHRydWUsIHZhbHVlOiB7fSB9LFxyXG5cclxuICAgICAgICAvL3RvIGJlIGludm9rZWQgYnkgc3ViY2xhc3MsIHNvIHRoYXQgaWRzIGNhbiBiZSBlbnN1cmVkIHRvIG5vdCBvdmVybGFwXHJcbiAgICAgICAgbG9hZGVyQ29udGV4dDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2tub3duVVJMc1t0aGlzLl9wYXRoXSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tub3duVVJMc1t0aGlzLl9wYXRoXSA9IE9iamVjdC5rZXlzKHRoaXMuX2tub3duVVJMcykubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiX19cIiArIHRoaXMuX2tub3duVVJMc1t0aGlzLl9wYXRoXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRXaXRoSlNPTjoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oanNvbiwgYmFzZVVSTCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qc29uID0ganNvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJhc2VVUkwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IG5vIGJhc2UgVVJMIHBhc3NlZCB0byBSZWFkZXI6aW5pdFdpdGhKU09OXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbFRGUGFyc2VyO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgYWxmYWRvciA9IHJlcXVpcmUoJ2FsZmFkb3InKSxcclxuICAgICAgICBNYXQzMyA9IGFsZmFkb3IuTWF0MzMsXHJcbiAgICAgICAgTWF0NDQgPSBhbGZhZG9yLk1hdDQ0LFxyXG4gICAgICAgIGdsVEZVdGlsID0gcmVxdWlyZSgnLi9nbFRGVXRpbCcpLFxyXG4gICAgICAgIEpvaW50ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL0pvaW50JyksXHJcbiAgICAgICAgU2tlbGV0b24gPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvU2tlbGV0b24nKTtcclxuXHJcbiAgICB2YXIgQ09NUE9ORU5UX1RZUEVTX1RPX0JVRkZFUlZJRVdTID0ge1xyXG4gICAgICAgIFwiNTEyMFwiOiBJbnQ4QXJyYXksXHJcbiAgICAgICAgXCI1MTIxXCI6IFVpbnQ4QXJyYXksXHJcbiAgICAgICAgXCI1MTIyXCI6IEludDE2QXJyYXksXHJcbiAgICAgICAgXCI1MTIzXCI6IFVpbnQxNkFycmF5LFxyXG4gICAgICAgIFwiNTEyNlwiOiBGbG9hdDMyQXJyYXlcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRZUEVTX1RPX05VTV9DT01QT05FTlRTID0ge1xyXG4gICAgICAgIFwiU0NBTEFSXCI6IDEsXHJcbiAgICAgICAgXCJWRUMyXCI6IDIsXHJcbiAgICAgICAgXCJWRUMzXCI6IDMsXHJcbiAgICAgICAgXCJWRUM0XCI6IDQsXHJcbiAgICAgICAgXCJNQVQyXCI6IDQsXHJcbiAgICAgICAgXCJNQVQzXCI6IDksXHJcbiAgICAgICAgXCJNQVQ0XCI6IDE2XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBUWVBFU19UT19DTEFTUyA9IHtcclxuICAgICAgICBcIk1BVDNcIjogTWF0MzMsXHJcbiAgICAgICAgXCJNQVQ0XCI6IE1hdDQ0XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEludmVyc2VCaW5kTWF0cmljZXMoIGpzb24sIHNraW4sIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29yID0ganNvbi5hY2Nlc3NvcnNbIHNraW4uaW52ZXJzZUJpbmRNYXRyaWNlcyBdLFxyXG4gICAgICAgICAgICBidWZmZXJWaWV3ID0ganNvbi5idWZmZXJWaWV3c1sgYWNjZXNzb3IuYnVmZmVyVmlldyBdLFxyXG4gICAgICAgICAgICBidWZmZXIgPSBidWZmZXJzWyBidWZmZXJWaWV3LmJ1ZmZlciBdLFxyXG4gICAgICAgICAgICBUeXBlZEFycmF5ID0gQ09NUE9ORU5UX1RZUEVTX1RPX0JVRkZFUlZJRVdTWyBhY2Nlc3Nvci5jb21wb25lbnRUeXBlIF0sXHJcbiAgICAgICAgICAgIG51bUNvbXBvbmVudHMgPSBUWVBFU19UT19OVU1fQ09NUE9ORU5UU1sgYWNjZXNzb3IudHlwZSBdLFxyXG4gICAgICAgICAgICBNYXRyaXhDbGFzcyA9IFRZUEVTX1RPX0NMQVNTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIGFjY2Vzc29yQXJyYXlDb3VudCA9IGFjY2Vzc29yLmNvdW50ICogbnVtQ29tcG9uZW50cyxcclxuICAgICAgICAgICAgYXJyYXlCdWZmZXIgPSBuZXcgVHlwZWRBcnJheSggYnVmZmVyLCBidWZmZXJWaWV3LmJ5dGVPZmZzZXQgKyBhY2Nlc3Nvci5ieXRlT2Zmc2V0LCBhY2Nlc3NvckFycmF5Q291bnQgKSxcclxuICAgICAgICAgICAgaW52ZXJzZUJpbmRNYXRyaWNlcyA9IFtdLFxyXG4gICAgICAgICAgICBiZWdpbkluZGV4LFxyXG4gICAgICAgICAgICBlbmRJbmRleCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBtYXRyaXggaW4gdGhlIGFjY2Vzc29yXHJcbiAgICAgICAgZm9yICggaT0wOyBpPGFjY2Vzc29yLmNvdW50OyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGNhbGMgdGhlIGJlZ2luIGFuZCBlbmQgaW4gYXJyYXlidWZmZXJcclxuICAgICAgICAgICAgYmVnaW5JbmRleCA9IGkgKiBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICBlbmRJbmRleCA9IGJlZ2luSW5kZXggKyBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHN1YmFycmF5IHRoYXQgY29tcG9zZXMgdGhlIG1hdHJpeFxyXG4gICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgICBuZXcgTWF0cml4Q2xhc3MoIGFycmF5QnVmZmVyLnN1YmFycmF5KCBiZWdpbkluZGV4LCBlbmRJbmRleCApIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludmVyc2VCaW5kTWF0cmljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSm9pbnRIaWVyYXJjaHkoIGpzb24sIG5vZGVOYW1lLCBwYXJlbnQsIHNraW4sIGludmVyc2VCaW5kTWF0cmljZXMgKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBqc29uLm5vZGVzWyBub2RlTmFtZSBdLFxyXG4gICAgICAgICAgICBqb2ludEluZGV4ID0gc2tpbi5qb2ludE5hbWVzLmluZGV4T2YoIG5vZGUuam9pbnROYW1lICksXHJcbiAgICAgICAgICAgIGJpbmRNYXRyaXgsXHJcbiAgICAgICAgICAgIGludmVyc2VCaW5kTWF0cml4LFxyXG4gICAgICAgICAgICBjaGlsZCxcclxuICAgICAgICAgICAgam9pbnQsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gaWYgam9pbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHNraW5zIGpvaW50TmFtZXMsIGlnbm9yZVxyXG4gICAgICAgIGlmICggam9pbnRJbmRleCA9PT0gLTEgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgdGhlIGJpbmQgLyBpbnZlcnNlIGJpbmQgbWF0cmljZXNcclxuICAgICAgICBiaW5kTWF0cml4ID0gZ2xURlV0aWwuZ2V0Tm9kZU1hdHJpeCggbm9kZSApO1xyXG4gICAgICAgIGludmVyc2VCaW5kTWF0cml4ID0gaW52ZXJzZUJpbmRNYXRyaWNlc1sgam9pbnRJbmRleCBdO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBqb2ludCBoZXJlIGZpcnN0LCBpbiBvcmRlciB0byBwYXNzIGFzIHBhcmVudCB0byByZWN1cnNpb25zXHJcbiAgICAgICAgam9pbnQgPSBuZXcgSm9pbnQoe1xyXG4gICAgICAgICAgICBpZDogbm9kZU5hbWUsXHJcbiAgICAgICAgICAgIG5hbWU6IG5vZGUuam9pbnROYW1lLFxyXG4gICAgICAgICAgICBiaW5kTWF0cml4OiBiaW5kTWF0cml4LFxyXG4gICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpeDogaW52ZXJzZUJpbmRNYXRyaXgsXHJcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW10sIC8vIGFycmF5IHdpbGwgYmUgZW1wdHkgaGVyZSwgYnV0IHBvcHVsYXRlZCBzdWJzZXF1ZW50bHlcclxuICAgICAgICAgICAgaW5kZXg6IGpvaW50SW5kZXhcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBmaWxsIGluIGNoaWxkcmVuIGFycmF5XHJcbiAgICAgICAgZm9yICggaT0wOyBpPG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gY3JlYXRlSm9pbnRIaWVyYXJjaHkoIGpzb24sIG5vZGUuY2hpbGRyZW5baV0sIGpvaW50LCBza2luLCBpbnZlcnNlQmluZE1hdHJpY2VzICk7XHJcbiAgICAgICAgICAgIGlmICggY2hpbGQgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGFkZCBpZiBqb2ludCBleGlzdHMgaW4gam9pbnROYW1lc1xyXG4gICAgICAgICAgICAgICAgam9pbnQuY2hpbGRyZW4ucHVzaCggY2hpbGQgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gam9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBlYWNoIHNrZWxldG9uIHJvb3Qgbm9kZSBpbiBhbiBpbnN0YW5jZVNraW4sIGJ1aWxkIHRoZSBqb2ludFxyXG4gICAgICAgICAqIGhpZXJhcmNoaWVzIGFuZCByZXR1cm4gYSBzaW5nbGUgU2tlbGV0b24gb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGpzb24gLSBUaGUgZ2xURiBKU09OLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVNraW4gLSBUaGUgaW5zdGFuY2VTa2luIG9iamVjdCBmb3IgdGhlIG5vZGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGJ1ZmZlcnMgLSBUaGUgbWFwIG9mIGxvYWRlZCBidWZmZXJzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge1NrZWxldG9ufSBUaGUgU2tlbGV0b24gb2JqZWN0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNyZWF0ZVNrZWxldG9uOiBmdW5jdGlvbigganNvbiwgaW5zdGFuY2VTa2luLCBidWZmZXJzICkge1xyXG4gICAgICAgICAgICAvLyBmaXJzdCBmaW5kIG5vZGVzIHdpdGggdGhlIG5hbWVzIGluIHRoZSBpbnN0YW5jZVNraW4uc2tlbGV0b25zXHJcbiAgICAgICAgICAgIC8vIHRoZW4gc2VhcmNoIG9ubHkgdGhvc2Ugbm9kZXMgYW5kIHRoZWlyIHN1YiB0cmVlcyBmb3Igbm9kZXMgd2l0aFxyXG4gICAgICAgICAgICAvLyBqb2ludElkIGVxdWFsIHRvIHRoZSBzdHJpbmdzIGluIHNraW4uam9pbnRzXHJcbiAgICAgICAgICAgIHZhciBza2VsZXRvbnMgPSBpbnN0YW5jZVNraW4uc2tlbGV0b25zLFxyXG4gICAgICAgICAgICAgICAgc2tpbiA9IGpzb24uc2tpbnNbIGluc3RhbmNlU2tpbi5za2luIF0sXHJcbiAgICAgICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzID0gZ2V0SW52ZXJzZUJpbmRNYXRyaWNlcygganNvbiwgc2tpbiwgYnVmZmVycyApLFxyXG4gICAgICAgICAgICAgICAgcm9vdE5vZGVzID0gW10sXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCByb290IG5vZGUsIGNyZWF0ZSBoaWVyYXJjaHkgb2YgSm9pbnQgb2JqZWN0c1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8c2tlbGV0b25zLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgcm9vdE5vZGVzLnB1c2goIGNyZWF0ZUpvaW50SGllcmFyY2h5KCBqc29uLCBza2VsZXRvbnNbaV0sIG51bGwsIHNraW4sIGludmVyc2VCaW5kTWF0cmljZXMgKSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBTa2VsZXRvbiBvYmplY3RcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTa2VsZXRvbih7XHJcbiAgICAgICAgICAgICAgICByb290OiByb290Tm9kZXMsXHJcbiAgICAgICAgICAgICAgICBiaW5kU2hhcGVNYXRyaXg6IG5ldyBNYXQ0NCggc2tpbi5iaW5kU2hhcGVNYXRyaXggfHwgW10gKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFsZmFkb3IgPSByZXF1aXJlKCdhbGZhZG9yJyksXHJcbiAgICAgICAgUXVhdGVybmlvbiA9IGFsZmFkb3IuUXVhdGVybmlvbixcclxuICAgICAgICBNYXQ0NCA9IGFsZmFkb3IuTWF0NDQsXHJcbiAgICAgICAgVmVjMiA9IGFsZmFkb3IuVmVjMixcclxuICAgICAgICBWZWMzID0gYWxmYWRvci5WZWMzLFxyXG4gICAgICAgIFZlYzQgPSBhbGZhZG9yLlZlYzQsXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL1V0aWwnKSxcclxuICAgICAgICBYSFJMb2FkZXIgPSByZXF1aXJlKCcuLi9YSFJMb2FkZXInKTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydHMgYW4gYXJyYXlidWZmZXIgb2JqZWN0IHRvIGFuIGFycmF5IG9mIFZlYzQgb2JqZWN0cy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5IC0gVGhlIEFycmF5QnVmZmVyIG9iamVjdCB0byBjb252ZXJ0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gLSBUaGUgY29udmVydGVkIGFycmF5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnZlcnRWZWM0QXJyYXk6IGZ1bmN0aW9uKCBhcnJheSApIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSggYXJyYXkubGVuZ3RoIC8gNCApLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPGFycmF5Lmxlbmd0aDsgaSs9NCApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFsgaS80IF0gPSBuZXcgVmVjNCggYXJyYXlbaV0sIGFycmF5W2krMV0sIGFycmF5W2krMl0sIGFycmF5W2krM10gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGFuIGFycmF5YnVmZmVyIG9iamVjdCB0byBhbiBhcnJheSBvZiBWZWMzIG9iamVjdHMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheSAtIFRoZSBBcnJheUJ1ZmZlciBvYmplY3QgdG8gY29udmVydC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IC0gVGhlIGNvbnZlcnRlZCBhcnJheS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb252ZXJ0VmVjM0FycmF5OiBmdW5jdGlvbiggYXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoIGFycmF5Lmxlbmd0aCAvIDMgKSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxhcnJheS5sZW5ndGg7IGkrPTMgKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbIGkvMyBdID0gbmV3IFZlYzMoIGFycmF5W2ldLCBhcnJheVtpKzFdLCBhcnJheVtpKzJdICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhbiBhcnJheWJ1ZmZlciBvYmplY3QgdG8gYW4gYXJyYXkgb2YgVmVjMiBvYmplY3RzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXkgLSBUaGUgQXJyYXlCdWZmZXIgb2JqZWN0IHRvIGNvbnZlcnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSAtIFRoZSBjb252ZXJ0ZWQgYXJyYXkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29udmVydFZlYzJBcnJheTogZnVuY3Rpb24oIGFycmF5ICkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCBhcnJheS5sZW5ndGggLyAyICksXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKz0yICkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0WyBpLzIgXSA9IG5ldyBWZWMyKCBhcnJheVtpXSwgYXJyYXlbaSsxXSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhIG5vZGVzIG1hdHJpeCBmcm9tIGVpdGhlciBhbiBhcnJheSBvciB0cmFuc2xhdGlvbixcclxuICAgICAgICAgKiByb3RhdGlvbiwgYW5kIHNjYWxlIGNvbXBvbmVudHMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbm9kZSAtIEEgbm9kZSBmcm9tIHRoZSBnbFRGIEpTT04uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgdHJhbnNmb3JtIG1hdHJpeC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldE5vZGVNYXRyaXg6IGZ1bmN0aW9uKCBub2RlICkge1xyXG4gICAgICAgICAgICB2YXIgdHJhbnNsYXRpb24sIHJvdGF0aW9uLCBzY2FsZTtcclxuICAgICAgICAgICAgLy8gZGVjb21wb3NlIHRyYW5zZm9ybSBjb21wb25lbnRzIGZyb20gbWF0cml4XHJcbiAgICAgICAgICAgIGlmICggbm9kZS5tYXRyaXggKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KCBub2RlLm1hdHJpeCApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgaWYgKCBub2RlLnRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRpb24gPSBNYXQ0NC50cmFuc2xhdGlvbiggbm9kZS50cmFuc2xhdGlvbiApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRpb24gPSBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgcm90YXRpb25cclxuICAgICAgICAgICAgaWYgKCBub2RlLnJvdGF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgcm90YXRpb24gPSBNYXQ0NC5yb3RhdGlvblJhZGlhbnMoIG5vZGUucm90YXRpb25bM10sIG5vZGUucm90YXRpb24gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvdGF0aW9uID0gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IG9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgIGlmICggbm9kZS5vcmllbnRhdGlvbiApIHtcclxuICAgICAgICAgICAgICAgIHJvdGF0aW9uID0gbmV3IFF1YXRlcm5pb24oIG5vZGUub3JpZW50YXRpb24gKS5tYXRyaXgoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHNjYWxlXHJcbiAgICAgICAgICAgIGlmICggbm9kZS5zY2FsZSApIHtcclxuICAgICAgICAgICAgICAgIHNjYWxlID0gTWF0NDQuc2NhbGUoIG5vZGUuc2NhbGUgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjYWxlID0gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uLm11bHQoIHJvdGF0aW9uICkubXVsdCggc2NhbGUgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXF1ZXN0IGEgbWFwIG9mIGFycmF5YnVmZmVycyBmcm9tIHRoZSBzZXJ2ZXIuIEV4ZWN1dGVzIGNhbGxiYWNrXHJcbiAgICAgICAgICogZnVuY3Rpb24gcGFzc2luZyBhIG1hcCBvZiBsb2FkZWQgYXJyYXlidWZmZXJzIGtleWVkIGJ5IGlkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGJ1ZmZlcnMgLSBUaGUgbWFwIG9mIGJ1ZmZlcnMuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVxdWVzdEJ1ZmZlcnM6IGZ1bmN0aW9uKCBidWZmZXJzLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgdmFyIGpvYnMgPSB7fSxcclxuICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEJ1ZmZlciggcGF0aCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgICAgICAgICBYSFJMb2FkZXIubG9hZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiBcImFycmF5YnVmZmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggYXJyYXlCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggYXJyYXlCdWZmZXIgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoIGtleSBpbiBidWZmZXJzICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBidWZmZXJzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBqb2JzWyBrZXkgXSA9IGxvYWRCdWZmZXIoIGJ1ZmZlcnNbIGtleSBdLnBhdGggKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbiggYnVmZmVyc0J5SWQgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggYnVmZmVyc0J5SWQgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVxdWVzdCBhIG1hcCBvZiBpbWFnZXMgZnJvbSB0aGUgc2VydmVyLiBFeGVjdXRlcyBjYWxsYmFja1xyXG4gICAgICAgICAqIGZ1bmN0aW9uIHBhc3NpbmcgYSBtYXAgb2YgSW1hZ2Ugb2JqZWN0cyBrZXllZCBieSBwYXRoLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGltYWdlcyAtIFRoZSBtYXAgb2YgaW1hZ2VzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlcXVlc3RJbWFnZXM6IGZ1bmN0aW9uKCBpbWFnZXMsIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICB2YXIgam9icyA9IHt9LFxyXG4gICAgICAgICAgICAgICAga2V5O1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkSW1hZ2UoIHBhdGggKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGRvbmUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoIGltYWdlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBwYXRoO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKCBrZXkgaW4gaW1hZ2VzICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBpbWFnZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpvYnNbIGtleSBdID0gbG9hZEltYWdlKCBpbWFnZXNbIGtleSBdLnBhdGggKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbiggaW1hZ2VzQnlQYXRoICkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIGltYWdlc0J5UGF0aCApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcclxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vVXRpbCcpLFxyXG4gICAgICAgIFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL1hIUkxvYWRlcicpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgYW4gaW1hZ2UsIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgdXBvblxyXG4gICAgICogY29tcGxldGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCBmb3IgdGhlIGltYWdlIHRvIGxvYWQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gbG9hZCB0aGUgaW1hZ2UuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZSggdXJsICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZG9uZSggaW1hZ2UgKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdXJsO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBnZW5lcmF0ZXMgYSBtYXRlcmlhbCBvYmplY3QgZnJvbSB0aGUgcHJvdmlkZWRcclxuICAgICAqIG1hdGVyaWFsIGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtYXRlcmlhbEluZm8gLSBUaGUgbWF0ZXJpYWwgaW5mb3JtYXRpb24gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGJhc2VVcmwgLSBUaGUgdXJsIGNvbnRhaW5pbmcgdGhlIHRleHR1cmUgZmlsZXMuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHVwb24gY29tcGxldGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVNYXRlcmlhbCggbWF0ZXJpYWxJbmZvLCBiYXNlVXJsICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBtYXRlcmlhbEluZm8ubmFtZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGpvYnMgPSB7fSxcclxuICAgICAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICAgICAga2V5O1xyXG4gICAgICAgICAgICBmb3IgKCBrZXkgaW4gbWF0ZXJpYWxJbmZvICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRlcmlhbEluZm8uaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWF0ZXJpYWxJbmZvWyBrZXkgXTtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKCBrZXkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2tkJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpZmZ1c2UgY29sb3IgKGNvbG9yIHVuZGVyIHdoaXRlIGxpZ2h0KSB1c2luZyBSR0JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuZGlmZnVzZUNvbG9yID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAna2EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW1iaWVudCBjb2xvciAoY29sb3IgdW5kZXIgc2hhZG93KSB1c2luZyBSR0IgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5hbWJpZW50Q29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdrcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTc3BlY3VsYXIgY29sb3IgKGNvbG9yIHdoZW4gbGlnaHQgaXMgcmVmbGVjdGVkIGZyb21cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNoaW55IHN1cmZhY2UpIHVzaW5nIFJHQiB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyQ29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICducyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzcGVjdWxhciBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgaGlnaCBleHBvbmVudCByZXN1bHRzIGluIGEgdGlnaHQsIGNvbmNlbnRyYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnMgdmFsdWVzIG5vcm1hbGx5IHJhbmdlIGZyb20gMCB0byAxMDAwLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc3BlY3VsYXJDb21wb25lbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdtYXBfa2QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGlmZnVzZSB0ZXh0dXJlIG1hcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9icy5kaWZmdXNlID0gbG9hZEltYWdlKCBiYXNlVXJsICsgXCIvXCIgKyB2YWx1ZSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9tYXRlcmlhbC5kaWZmdXNlVGV4dHVyZSA9IGJhc2VVcmwgKyBcIi9cIiArIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZCBpcyBkaXNzb2x2ZSBmb3IgY3VycmVudCBtYXRlcmlhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFjdG9yIG9mIDEuMCBpcyBmdWxseSBvcGFxdWUsIGEgZmFjdG9yIG9mIDAgaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZ1bGx5IHRyYW5zcGFyZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHZhbHVlIDwgMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5hbHBoYSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2lsbHVtJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgPiAyICYmIHZhbHVlIDwgMTAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwucmVmbGVjdGlvbiA9IDAuMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgPT09IDYgfHwgdmFsdWUgPT09IDcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwucmVmcmFjdGlvbiA9IDAuODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb2FkIGFsbCBpbWFnZXMgYXN5bmNocm9ub3VzbHlcclxuICAgICAgICAgICAgVXRpbC5hc3luYyggam9icywgZnVuY3Rpb24oIGltYWdlc0J5VHlwZSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKCBrZXkgaW4gaW1hZ2VzQnlUeXBlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggaW1hZ2VzQnlUeXBlLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxbIGtleSArIFwiVGV4dHVyZVwiIF0gPSBpbWFnZXNCeVR5cGVbIGtleSBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRvbmUoIG1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBpbmRpdmlkdWFsIG1hdGVyaWFsIGluZm9zIGFuZCBnZW5lcmF0ZXNcclxuICAgICAqIHRoZSByZXNwZWN0aXZlIE1hdGVyaWFsIG9iamVjdHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1hdGVyaWFsSW5mb3MgLSBUaGUgbWFwIG9mIG1hdGVyaWFsIGluZm9ybWF0aW9uLCBrZXllZCBieSBuYW1lLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmcgYmFzZVVybCAtIFRoZSBiYXNlIFVSTCBvZiB0aGUgZm9sZGVyIGNvbnRhaW5pbmcgdGhlIG1hdGVyaWFsIGRlcGVuZGVuY3kgZmlsZXMuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHVwb24gY29tcGxldGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVNYXRlcmlhbHMoIG1hdGVyaWFsSW5mb3MsIGJhc2VVcmwsIGNhbGxiYWNrICkge1xyXG4gICAgICAgIHZhciBqb2JzID0ge30sXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICBmb3IgKCBrZXkgaW4gbWF0ZXJpYWxJbmZvcyApIHtcclxuICAgICAgICAgICAgaWYgKCBtYXRlcmlhbEluZm9zLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgIGpvYnNbIGtleSBdID0gZ2VuZXJhdGVNYXRlcmlhbCggbWF0ZXJpYWxJbmZvc1sga2V5IF0sIGJhc2VVcmwgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbiggbWF0ZXJpYWxzICkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayggbWF0ZXJpYWxzICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzZXMgdGhlIHNvdXJjZSB0ZXh0IG9mIGEgd2F2ZWZyb250IC5tdGwgZmlsZSBhbmQgcmV0dXJucyBhIG1hcFxyXG4gICAgICogb2YgdGhlIHJlbGV2YW50IG1hdGVyaWFsIGluZm9ybWF0aW9uLCBrZXllZCBieSBuYW1lLlxyXG4gICAgICpcclxuICAgICAqIEBhdXRob3IgYW5nZWx4dWFuY2hhbmdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3JjIC0gVGhlIHNvdXJjZSB0ZXh0IG9mIGEgLm10bCBmaWxlIHRvIGJlIHBhcnNlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgcGFyc2VkIHNvdXJjZSBjb250YWluaW5nIGFsbCBtYXRlcmlhbHMga2V5ZWQgYnkgbmFtZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGFyc2VNVExTb3VyY2UoIHNyYyApIHtcclxuICAgICAgICB2YXIgbGluZXMgPSBzcmMuc3BsaXQoICdcXG4nICksXHJcbiAgICAgICAgICAgIG1hdGVyaWFsSW5mb3MgPSB7fSxcclxuICAgICAgICAgICAgaW5mbyA9IHt9LFxyXG4gICAgICAgICAgICB2ZWN0b3IsXHJcbiAgICAgICAgICAgIGxpbmUsXHJcbiAgICAgICAgICAgIHBvcyxcclxuICAgICAgICAgICAga2V5LFxyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bGluZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGxpbmUgPSBsaW5lc1sgaSBdLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYgKCBsaW5lLmxlbmd0aCA9PT0gMCB8fCBsaW5lLmNoYXJBdCggMCApID09PSAnIycgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBibGFuayBsaW5lIG9yIGNvbW1lbnQgaWdub3JlXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb3MgPSBsaW5lLmluZGV4T2YoICcgJyApO1xyXG4gICAgICAgICAgICBpZiAoIHBvcyA+PSAwICkge1xyXG4gICAgICAgICAgICAgICAga2V5ID0gbGluZS5zdWJzdHJpbmcoIDAsIHBvcyApLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGxpbmUuc3Vic3RyaW5nKCBwb3MgKyAxICkudHJpbSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAga2V5ID0gbGluZTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIGtleSA9PT0gXCJuZXdtdGxcIiApIHtcclxuICAgICAgICAgICAgICAgIC8vIG5ldyBtYXRlcmlhbFxyXG4gICAgICAgICAgICAgICAgaW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsSW5mb3NbIHZhbHVlIF0gPSBpbmZvO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpbmZvICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBrZXkgPT09IFwia2FcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9PT0gXCJrZFwiIHx8XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID09PSBcImtzXCIgfHxcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPT09IFwia2VcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2ZWN0b3IgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB2ZWN0b3IgPSB2YWx1ZS5zcGxpdCggL1xccysvLCAzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb1sga2V5IF0gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHZlY3RvclswXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCB2ZWN0b3JbMV0gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggdmVjdG9yWzJdICkgXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGtleSA9PT0gXCJuc1wiIHx8IGtleSA9PT0gXCJkXCIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2NhbGFyIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb1sga2V5IF0gPSBwYXJzZUZsb2F0KCB2YWx1ZSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlclxyXG4gICAgICAgICAgICAgICAgICAgIGluZm9bIGtleSBdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdGVyaWFsSW5mb3M7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvYWRzIGEgd2F2ZWZyb250IC5tdGwgZmlsZSwgZ2VuZXJhdGVzIGEgbWFwIG9mIG1hdGVyaWFsIHNwZWNpZmljYXRpb25cclxuICAgICAgICAgKiBvYmplY3RzLCBrZXllZCBieSBuYW1lLCBhbmQgcGFzc2VzIGl0IHRvIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uXHJcbiAgICAgICAgICogY29tcGxldGlvbi4gQWxsIHRleHR1cmVzIHJlbWFpbiBhcyBmdWxseSBxdWFsaWZpZWQgdXJscy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHRoZSAubXRsIGZpbGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb25lIGV4ZWN1dGVkIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsb2FkOiBmdW5jdGlvbiAoIHVybCwgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgIHZhciBiYXNlVXJsID0gcGF0aC5kaXJuYW1lKCB1cmwgKTtcclxuICAgICAgICAgICAgWEhSTG9hZGVyLmxvYWQoXHJcbiAgICAgICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggc3JjICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VkID0gcGFyc2VNVExTb3VyY2UoIHNyYyApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZU1hdGVyaWFscyggcGFyc2VkLCBiYXNlVXJsLCBjYWxsYmFjayApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL1hIUkxvYWRlcicpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSB0cmlhbmdsZSBoYXNoaW5nIGZ1bmN0aW9uIHVzZWQgdG8gcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbVxyXG4gICAgICogdGhlIHVuaWZpZWQgYXJyYXkgZ2VuZXJhdGlvbiBwcm9jZXNzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmlhbmdsZSAtIFRoZSB0cmlhbmdsZS5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gaW5kZXggLSBUaGUgdHJpYW5nbGUgdmVydGV4IGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0cmlhbmdsZXMgaGFzaC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdHJpSGFzaCggdHJpYW5nbGUsIGluZGV4ICkge1xyXG4gICAgICAgIHZhciBoYXNoID0gdHJpYW5nbGUucG9zaXRpb25zWyBpbmRleCBdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKCB0cmlhbmdsZS5ub3JtYWxzICkge1xyXG4gICAgICAgICAgICBoYXNoICs9IFwiLVwiICsgdHJpYW5nbGUubm9ybWFsc1sgaW5kZXggXS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRyaWFuZ2xlLnV2cyApIHtcclxuICAgICAgICAgICAgaGFzaCArPSBcIi1cIiArIHRyaWFuZ2xlLnV2c1sgaW5kZXggXS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGFzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyB1bmlmaWVkIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXlzIGZyb20gdHJpYW5nbGVzLiBVbmlmaWVkIGFycmF5c1xyXG4gICAgICogYXJlIGFycmF5cyBvZiB2ZXJ0ZXggYXR0cmlidXRlcyBvcmdhbml6ZWQgc3VjaCB0aGF0IGFsbCBpbmRpY2VzXHJcbiAgICAgKiBjb3JyZXNwb25kIGFjcm9zcyBhdHRyaWJ1dGVzLiBVbmlmaWVkIGFycmF5cyBhcmUgbm90IG1lbW9yeSBlZmZpY2llbnQsXHJcbiAgICAgKiBmb3IgZXhhbXBsZSBhIGN1YmUgaXMgY29tcG9zZWQgb2YgOCBwb3NpdGlvbnMgYW5kIDYgbm9ybWFscy4gdGhpcyB3b3VsZFxyXG4gICAgICogYmUgb3JnYW5pemVkIGludG8gdHdvIHVuaWZpZWQgYXJyYXlzIGVhY2ggY29uc2lzdGluZyBvZiAyNCBlbGVtZW50cy5cclxuICAgICAqIFdlYkdMIHZlcnRleCBidWZmZXJzIG9ubHkgYWNjZXB0cyB1bmlmaWVkIGFycmF5cy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWVzaCAtIFRoZSBtZXNoIGluZm9ybWF0aW9uIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgYXR0cmlidXRlIGFuZCBpbmRleCBhcnJheXMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRUb1VuaWZpZWRBcnJheXMoIG1lc2ggKSB7XHJcbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICBub3JtYWxzID0gW10sXHJcbiAgICAgICAgICAgIHV2cyA9IFtdLFxyXG4gICAgICAgICAgICBpbmRpY2VzID0gW10sXHJcbiAgICAgICAgICAgIGNvdW50ID0gMCxcclxuICAgICAgICAgICAgaGFzaGVzID0ge30sXHJcbiAgICAgICAgICAgIGhhc2gsXHJcbiAgICAgICAgICAgIGFycmF5cyxcclxuICAgICAgICAgICAgdHJpYW5nbGUsXHJcbiAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICBpLCBqO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxtZXNoLnRyaWFuZ2xlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggdHJpYW5nbGVcclxuICAgICAgICAgICAgdHJpYW5nbGUgPSBtZXNoLnRyaWFuZ2xlc1tpXTtcclxuICAgICAgICAgICAgZm9yICggaj0wOyBqPDM7IGorKyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGhhc2ggaXRzIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgaGFzaCA9IHRyaUhhc2goIHRyaWFuZ2xlLCBqICk7XHJcbiAgICAgICAgICAgICAgICAvL2luZGV4ID0gaGFzaGVzWyBoYXNoIF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIGluZGV4ID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZG9lc24ndCBleGlzdCwgYWRkIGF0dHJpYnV0ZXMgdG8gYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaCggdHJpYW5nbGUucG9zaXRpb25zW2pdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0cmlhbmdsZS5ub3JtYWxzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxzLnB1c2goIHRyaWFuZ2xlLm5vcm1hbHNbal0gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0cmlhbmdsZS51dnMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2cy5wdXNoKCB0cmlhbmdsZS51dnNbal0gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCBjb3VudCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc2hlc1sgaGFzaCBdID0gY291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZG9lcywgcmVmZXJlbmNlIGV4aXN0aW5nIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIGluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYXJyYXlzID0ge1xyXG4gICAgICAgICAgICB0cmlhbmdsZXM6IG1lc2gudHJpYW5nbGVzLFxyXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHBvc2l0aW9ucyxcclxuICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcclxuICAgICAgICAgICAgbm9ybWFsczogbm9ybWFscyxcclxuICAgICAgICAgICAgbWF0ZXJpYWw6IG1lc2gubWF0ZXJpYWwgLy8gbWF0ZXJpYWwgbmFtZSwgbm90IGFjdHVhbCBtYXRlcmlhbCBzZXRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICggdXZzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgIGFycmF5cy51dnMgPSB1dnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIG1vZGVsIGluZm9ybWF0aW9uIG1lc2hlcyBhbmQgY3JlYXRlIGFsbCB2ZXJ0ZXhcclxuICAgICAqIGF0dHJpYnV0ZSBhcnJheXMgZnJvbSB0cmlhbmdsZXMuIFJlcGxhY2VzIGV4aXN0aW5nICdtZXNoJyBhdHRyaWJ1dGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtb2RlbCAtIFRoZSBtb2RlbCBpbmZvcm1hdGlvbiBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIE1vZGVsIGluZm9ybWF0aW9uIG9iamVjdCB3aXRoIG1lc2hlcyBhcHBlbmRlZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY29udmVydFRyaWFuZ2xlc1RvQXJyYXlzKCBtb2RlbCApIHtcclxuICAgICAgICB2YXIgbWVzaGVzID0gbW9kZWwubWVzaGVzLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxtZXNoZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1lc2hlc1tpXSA9IGNvbnZlcnRUb1VuaWZpZWRBcnJheXMoIG1lc2hlc1tpXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzZXMgdGhlIHNvdXJjZSB0ZXh0IG9mIGEgd2F2ZWZyb250IC5vYmogZmlsZSBhbmQgcmV0dXJucyBhIG1vZGVsXHJcbiAgICAgKiBpbmZvcm1hdGlvbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVsZXZhbnQgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNyYyAtIFRoZSBzb3VyY2UgdGV4dCBvZiBhIC5vYmogZmlsZSB0byBiZSBwYXJzZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHBhcnNlZCAub2JqIGZpbGUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlT0JKU291cmNlKCBzcmMgKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEVtcHR5TWVzaCggZ3JvdXBOYW1lLCBvYmpOYW1lLCBtYXRlcmlhbE5hbWUgKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNoO1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgZnJlc2ggdHJpYW5nbGVzXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlcyA9IFtdO1xyXG4gICAgICAgICAgICAvLyBhc3NpZ24gaXQgdG8gdGhlIG5ldyBlbXB0eSBtZXNoXHJcbiAgICAgICAgICAgIG1lc2ggPSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXM6IHRyaWFuZ2xlc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBpZiBtZXNoIGdyb3VwIGlzIHByb3ZpZGVkLCBhZGQgaXRcclxuICAgICAgICAgICAgaWYgKCBncm91cE5hbWUgKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNoLmdyb3VwID0gZ3JvdXBOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIG9iamVjdCBuYW1lIGlzIHByb3ZpZGVkLCBhZGQgaXRcclxuICAgICAgICAgICAgaWYgKCBvYmpOYW1lICkge1xyXG4gICAgICAgICAgICAgICAgbWVzaC5uYW1lID0gb2JqTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiBhIG1hdGVyaWFsIG5hbWUgaXMgcHJvdmlkZWQsIGFkZCBpdFxyXG4gICAgICAgICAgICBpZiAoIG1hdGVyaWFsTmFtZSApIHtcclxuICAgICAgICAgICAgICAgIG1lc2gubWF0ZXJpYWwgPSBtYXRlcmlhbE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYXBwZW5kIGVtcHR5IG1lc2ggdG8gbW9kZWxcclxuICAgICAgICAgICAgbW9kZWwubWVzaGVzLnB1c2goIG1lc2ggKTtcclxuICAgICAgICAgICAgLy8gY2xlYXIgZ3JvdXAgYW5kIG9iamVjdCBuYW1lc1xyXG4gICAgICAgICAgICBuZXh0R3JvdXAgPSBudWxsO1xyXG4gICAgICAgICAgICBuZXh0T2JqZWN0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE10bExpYiggbGluZSApIHtcclxuICAgICAgICAgICAgdmFyIG10bGxpYiA9IGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpO1xyXG4gICAgICAgICAgICBtb2RlbC5tdGxsaWIgPSBtb2RlbC5tdGxsaWIgfHwgW107XHJcbiAgICAgICAgICAgIGlmICggbW9kZWwubXRsbGliLmluZGV4T2YoIG10bGxpYiApID09PSAtMSApIHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgYWRkIGlmIGl0IGFscmVhZHkgaXNuJ3QgdGhlcmVcclxuICAgICAgICAgICAgICAgIG1vZGVsLm10bGxpYi5wdXNoKCBtdGxsaWIgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UG9zaXRpb24oIHZhbHVlICkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcblx0XHRcdGlmICggaW5kZXggPj0gMCAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zaXRpb25zWyBpbmRleCAtIDEgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcG9zaXRpb25zWyBpbmRleCArIHBvc2l0aW9ucy5sZW5ndGggXTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VVYoIHZhbHVlICkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcblx0XHRcdGlmICggaW5kZXggPj0gMCAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXZzWyBpbmRleCAtIDEgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdXZzWyBpbmRleCArIHV2cy5sZW5ndGggXTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm9ybWFsKCB2YWx1ZSApIHtcclxuXHRcdFx0dmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG5cdFx0XHRpZiAoIGluZGV4ID49IDAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vcm1hbHNbIGluZGV4IC0gMSBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxzWyBpbmRleCArIG5vcm1hbHMubGVuZ3RoIF07XHJcblx0XHR9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkVHJpYW5nbGVGcm9tSW5kaWNlcyggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApIHtcclxuICAgICAgICAgICAgdmFyIHRyaWFuZ2xlID0ge30sXHJcbiAgICAgICAgICAgICAgICBhLCBiLCBjLCB1LCB2LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsLCBtYWc7XHJcbiAgICAgICAgICAgIC8vIGFkZCBwb3NpdGlvbnMgdG8gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlLnBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKCBwb3NJbmRpY2VzWzBdICksXHJcbiAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbiggcG9zSW5kaWNlc1sxXSApLFxyXG4gICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oIHBvc0luZGljZXNbMl0gKSBdO1xyXG4gICAgICAgICAgICAvLyBpZiB1dnMgYXJlIHByb3ZpZGVkLCBhZGQgdGhlbSB0byB0aGUgdHJpYW5nbGVcclxuICAgICAgICAgICAgaWYgKCB1dkluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS51dnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0VVYoIHV2SW5kaWNlc1swXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIGdldFVWKCB1dkluZGljZXNbMV0gKSxcclxuICAgICAgICAgICAgICAgICAgICBnZXRVViggdXZJbmRpY2VzWzJdICkgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiBub3JtYWxzIGFyZSBwcm92aWRlZCwgYWRkIHRoZW0gdG8gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIGlmICggbm9ybUluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS5ub3JtYWxzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIGdldE5vcm1hbCggbm9ybUluZGljZXNbMF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBnZXROb3JtYWwoIG5vcm1JbmRpY2VzWzFdICksXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Tm9ybWFsKCBub3JtSW5kaWNlc1syXSApIF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBub3JtYWxzIGFyZSBub3QgcHJvdmlkZWQsIGdlbmVyYXRlIHRoZW1cclxuICAgICAgICAgICAgICAgIGEgPSB0cmlhbmdsZS5wb3NpdGlvbnNbMF07XHJcbiAgICAgICAgICAgICAgICBiID0gdHJpYW5nbGUucG9zaXRpb25zWzFdO1xyXG4gICAgICAgICAgICAgICAgYyA9IHRyaWFuZ2xlLnBvc2l0aW9uc1syXTtcclxuICAgICAgICAgICAgICAgIHUgPSBbIGJbMF0tYVswXSwgYlsxXS1hWzFdLCBiWzJdLWFbMl0gXTsgLy8gYiAtIGFcclxuICAgICAgICAgICAgICAgIHYgPSBbIGNbMF0tYVswXSwgY1sxXS1hWzFdLCBjWzJdLWFbMl0gXTsgLy8gYyAtIGFcclxuICAgICAgICAgICAgICAgIC8vIGNyb3NzIHByb2R1Y3RcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IFtcclxuICAgICAgICAgICAgICAgICAgICAoIHVbMV0gKiB2WzJdICkgLSAoIHZbMV0gKiB1WzJdICksXHJcbiAgICAgICAgICAgICAgICAgICAgKC11WzBdICogdlsyXSApICsgKCB2WzBdICogdVsyXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICggdVswXSAqIHZbMV0gKSAtICggdlswXSAqIHVbMV0gKVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbGl6ZVxyXG4gICAgICAgICAgICAgICAgbWFnID0gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFswXSpub3JtYWxbMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsxXSpub3JtYWxbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsyXSpub3JtYWxbMl0gKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IFtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWxbMF0gLyBtYWcsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsWzFdIC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsyXSAvIG1hZyBdO1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUubm9ybWFscyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhZGQgdHJpYW5nbGUgdG8gYXJyYXlcclxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2goIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZUZhY2VJbnB1dCggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApIHtcclxuICAgICAgICAgICAgYnVpbGRUcmlhbmdsZUZyb21JbmRpY2VzKCBwb3NJbmRpY2VzLCB1dkluZGljZXMsIG5vcm1JbmRpY2VzICk7XHJcbiAgICAgICAgICAgIGlmICggcG9zSW5kaWNlc1sgMyBdICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NJbmRpY2VzID0gWyBwb3NJbmRpY2VzWyAwIF0sIHBvc0luZGljZXNbIDIgXSwgcG9zSW5kaWNlc1sgMyBdIF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIHV2SW5kaWNlcyApIHtcclxuICAgICAgICAgICAgICAgICAgICB1dkluZGljZXMgPSBbIHV2SW5kaWNlc1sgMCBdLCB1dkluZGljZXNbIDIgXSwgdXZJbmRpY2VzWyAzIF0gXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICggbm9ybUluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybUluZGljZXMgPSBbIG5vcm1JbmRpY2VzWyAwIF0sIG5vcm1JbmRpY2VzWyAyIF0sIG5vcm1JbmRpY2VzWyAzIF0gXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJ1aWxkVHJpYW5nbGVGcm9tSW5kaWNlcyggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdiBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIHZhciBQT1NJVElPTl9SRUdFWCA9IC92KCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspLyxcclxuICAgICAgICAgICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgICAgICAgICAgTk9STUFMX1JFR0VYID0gL3ZuKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspLyxcclxuICAgICAgICAgICAgLy8gdnQgZmxvYXQgZmxvYXRcclxuICAgICAgICAgICAgVVZfUkVHRVggPSAvdnQoICtbXFxkfFxcLnxcXCt8XFwtfGVdKykoICtbXFxkfFxcLnxcXCt8XFwtfGVdKykvLFxyXG4gICAgICAgICAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4IC4uLlxyXG4gICAgICAgICAgICBGQUNFX1ZfUkVHRVggPSAvZiggKy0/XFxkKykoICstP1xcZCspKCArLT9cXGQrKSggKy0/XFxkKyk/LyxcclxuICAgIFx0XHQvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2IC4uLlxyXG4gICAgXHRcdEZBQ0VfVl9VVl9SRUdFWCA9IC9mKCArKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgIFx0XHQvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIC4uLlxyXG4gICAgXHRcdEZBQ0VfVl9VVl9OX1JFR0VYID0gL2YoICsoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICBcdFx0Ly8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCAuLi5cclxuICAgIFx0XHRGQUNFX1ZfTl9SRUdFWCA9IC9mKCArKC0/XFxkKylcXC9cXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcL1xcLygtP1xcZCspKSggKygtP1xcZCspXFwvXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAgICAgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICB1dnMgPSBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyA9IFtdLFxyXG4gICAgICAgICAgICB0cmlhbmdsZXMgPSBbXSxcclxuICAgICAgICAgICAgbmV4dEdyb3VwID0gbnVsbCxcclxuICAgICAgICAgICAgbmV4dE9iamVjdCA9IG51bGwsXHJcbiAgICAgICAgICAgIGxpbmVzID0gc3JjLnNwbGl0KCBcIlxcblwiICksXHJcbiAgICAgICAgICAgIGxpbmUsXHJcbiAgICAgICAgICAgIHJlc3VsdCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBwYXJzZSBsaW5lc1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxsaW5lcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF0udHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAoIGxpbmUubGVuZ3RoID09PSAwIHx8IGxpbmUuY2hhckF0KCAwICkgPT09ICcjJyApIHtcclxuICAgICAgICAgICAgICAgIC8vICMgY29tbWVudCBvciBibGFuayBsaW5lXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBQT1NJVElPTl9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2IDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IE5PUk1BTF9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgLy8gW1widm4gMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuICAgICAgICAgICAgICAgIG5vcm1hbHMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IFVWX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gdXZzXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2dCAwLjEgMC4yXCIsIFwiMC4xXCIsIFwiMC4yXCJdXHJcbiAgICAgICAgICAgICAgICB1dnMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBGQUNFX1ZfUkVHRVguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmYWNlIG9mIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcbiAgICAgICAgICAgICAgICBwYXJzZUZhY2VJbnB1dChcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDQgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbCwgLy8gdXZzXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbCApOyAvLyBub3JtYWxzXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gRkFDRV9WX1VWX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmFjZSBvZiBwb3NpdGlvbnMgYW5kIHV2c1xyXG4gICAgICAgICAgICAgICAgLy8gW1wiZiAxLzEgMi8yIDMvM1wiLCBcIiAxLzFcIiwgXCIxXCIsIFwiMVwiLCBcIiAyLzJcIiwgXCIyXCIsIFwiMlwiLCBcIiAzLzNcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG4gICAgICAgICAgICAgICAgcGFyc2VGYWNlSW5wdXQoXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyBwb3NpdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDggXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxMSBdXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHV2c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA2IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIG51bGwgKTsgLy8gbm9ybWFsc1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IEZBQ0VfVl9VVl9OX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmFjZSBvZiBwb3NpdGlvbnMsIHV2cywgYW5kIG5vcm1hbHNcclxuICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xLzEgMi8yLzIgMy8zLzNcIiwgXCIgMS8xLzFcIiwgXCIxXCIsIFwiMVwiLCBcIjFcIiwgXCIgMi8yLzJcIiwgXCIyXCIsIFwiMlwiLCBcIjJcIiwgXCIgMy8zLzNcIiwgXCIzXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG4gICAgICAgICAgICAgICAgcGFyc2VGYWNlSW5wdXQoXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyBwb3NpdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNiBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEwIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTQgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyB1dnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAzIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTUgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyBub3JtYWxzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDggXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxMiBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDE2IF1cclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBGQUNFX1ZfTl9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGZhY2Ugb2YgcG9zaXRpb25zIGFuZCBub3JtYWxzXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiIDEvLzFcIiwgXCIxXCIsIFwiMVwiLCBcIiAyLy8yXCIsIFwiMlwiLCBcIjJcIiwgXCIgMy8vM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcbiAgICAgICAgICAgICAgICBwYXJzZUZhY2VJbnB1dChcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA1IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDExIF1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIG51bGwsIC8vIHV2c1xyXG4gICAgICAgICAgICAgICAgICAgIFsgLy8gbm9ybWFsc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA2IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggL15vIC8udGVzdCggbGluZSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBuZXh0T2JqZWN0ID0gbGluZS5zdWJzdHJpbmcoIDIgKS50cmltKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIC9eZyAvLnRlc3QoIGxpbmUgKSApIHtcclxuICAgICAgICAgICAgICAgIC8vIGdyb3VwXHJcbiAgICAgICAgICAgICAgICBuZXh0R3JvdXAgPSBsaW5lLnN1YnN0cmluZyggMiApLnRyaW0oKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggL151c2VtdGwgLy50ZXN0KCBsaW5lICkgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXRlcmlhbFxyXG4gICAgICAgICAgICAgICAgYWRkRW1wdHlNZXNoKCBuZXh0R3JvdXAsIG5leHRPYmplY3QsIGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIC9ebXRsbGliIC8udGVzdCggbGluZSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gbXRsIGZpbGVcclxuICAgICAgICAgICAgICAgIGFkZE10bExpYiggbGluZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggbW9kZWwubWVzaGVzLmxlbmd0aCA9PT0gMCApIHtcclxuICAgICAgICAgICAgLy8gbm8gbXRscywgYXNzZW1ibGUgYWxsIHVuZGVyIGEgc2luZ2xlIG1lc2hcclxuICAgICAgICAgICAgbW9kZWwubWVzaGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzOiB0cmlhbmdsZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9hZHMgYSB3YXZlZnJvbnQgLm9iaiBmaWxlLCBnZW5lcmF0ZXMgYSBtb2RlbCBzcGVjaWZpY2F0aW9uIG9iamVjdFxyXG4gICAgICAgICAqIGFuZCBwYXNzZXMgaXQgdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHRoZSAub2JqIGZpbGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbG9hZDogZnVuY3Rpb24oIHVybCwgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgIFhIUkxvYWRlci5sb2FkKFxyXG4gICAgICAgICAgICAgICAgdXJsLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIHNyYyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlZCA9IHBhcnNlT0JKU291cmNlKCBzcmMgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0gY29udmVydFRyaWFuZ2xlc1RvQXJyYXlzKCBwYXJzZWQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBtb2RlbCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcclxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vVXRpbCcpLFxyXG4gICAgICAgIE9CSkxvYWRlciA9IHJlcXVpcmUoJy4vT0JKTG9hZGVyJyksXHJcbiAgICAgICAgTVRMTG9hZGVyID0gcmVxdWlyZSgnLi9NVExMb2FkZXInKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGVzIHRocm91Z2ggdGhlIG1pdGxpYiBhdHRyaWJ1dGUgb2YgdGhlIG1vZGVsIGFuZCBsb2FkcyBtYXRlcmlhbHNcclxuICAgICAqIGZyb20gYWxsIGFzc29jaWF0ZWQgLm10bCBmaWxlcy4gUGFzc2VzIHRoZSBtYXRlcmlhbCBzcGVjaWZpY2F0aW9uIG9iamVjdHNcclxuICAgICAqIHRvIHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbW9kZWwgLSBUaGUgbW9kZWwgaW5mb3JtYXRpb24gb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmcgYmFzZVVybCAtIFRoZSBiYXNlIFVSTCBvZiB0aGUgZm9sZGVyIGNvbnRhaW5pbmcgdGhlIG1hdGVyaWFsIGRlcGVuZGVuY3kgZmlsZXMuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB1cG9uIGNvbXBsZXRpb24uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxvYWRNYXRlcmlhbHMoIG1vZGVsLCBiYXNlVXJsLCBjYWxsYmFjayApIHtcclxuICAgICAgICB2YXIgam9icyA9IFtdO1xyXG4gICAgICAgIC8vIGlmIG5vIG1hdGVyaWFsLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCAhbW9kZWwubXRsbGliICkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayggbW9kZWwgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgdXAgdGhlIG1hdGVyaWFsIGxvYWRpbmcgam9iXHJcbiAgICAgICAgbW9kZWwubXRsbGliLmZvckVhY2goIGZ1bmN0aW9uKCBtdGxsaWIgKSB7XHJcbiAgICAgICAgICAgIGpvYnMucHVzaCggZnVuY3Rpb24oIGRvbmUgKSB7XHJcbiAgICAgICAgICAgICAgICBNVExMb2FkZXIubG9hZCggYmFzZVVybCArICcvJyArIG10bGxpYiwgZG9uZSApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBkaXNwYXRjaCBhbGwgbWF0ZXJpYWwgbG9hZGluZyBqb2JzXHJcbiAgICAgICAgVXRpbC5hc3luYyggam9icywgZnVuY3Rpb24oIG1hdGVyaWFscyApIHtcclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsc0J5TmFtZSA9IHt9O1xyXG4gICAgICAgICAgICBtYXRlcmlhbHMuZm9yRWFjaCggZnVuY3Rpb24oIG1hdGVyaWFsICkge1xyXG4gICAgICAgICAgICAgICAgVXRpbC5leHRlbmQoIG1hdGVyaWFsc0J5TmFtZSwgbWF0ZXJpYWwgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCBtYXRlcmlhbHNCeU5hbWUgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9hZHMgYSB3YXZlZnJvbnQgLm9iaiBmaWxlLCBnZW5lcmF0ZXMgYSBtb2RlbCBzcGVjaWZpY2F0aW9uIG9iamVjdCxcclxuICAgICAgICAgKiBhbmQgcGFzc2VzIGl0IHRvIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uVGhpcyBhbHNvXHJcbiAgICAgICAgICogaW52b2x2ZXMgbG9hZGluZyBhbmQgZ2VuZXJhdGluZyB0aGUgYXNzb2NpYXRlZCBtYXRlcmlhbCBzcGVjaWZpY2F0aW9uXHJcbiAgICAgICAgICogb2JqZWN0cyBmcm9tIHRoZSByZXNwZWN0aXZlIHdhdmVmcm9udCAubXRsIGZpbGVzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gdGhlIC5vYmogZmlsZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uKCB1cmwsIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICAvLyBsb2FkIGFuZCBwYXJzZSBPQkogZmlsZVxyXG4gICAgICAgICAgICBPQkpMb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiggbW9kZWwgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGVuIGxvYWQgYW5kIHBhcnNlIE1UTCBmaWxlXHJcbiAgICAgICAgICAgICAgICBsb2FkTWF0ZXJpYWxzKCBtb2RlbCwgcGF0aC5kaXJuYW1lKCB1cmwgKSwgZnVuY3Rpb24oIG1hdGVyaWFsc0J5SWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGVhY2ggbWF0ZXJpYWwgdG8gdGhlIGFzc29jaWF0ZWQgbWVzaFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLm1lc2hlcy5mb3JFYWNoKCBmdW5jdGlvbiggbWVzaCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzaC5tYXRlcmlhbCA9IG1hdGVyaWFsc0J5SWRbIG1lc2gubWF0ZXJpYWwgXTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggbW9kZWwgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBTSVpFID0gMTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgcG9zaXRpb25zOiBmdW5jdGlvbiggc2l6ZSApIHtcclxuICAgICAgICAgICAgc2l6ZSA9IHNpemUgfHwgU0laRTtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIC8vIGZyb250IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgLXNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyBzaXplLzIsIC1zaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgIHNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAgc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBiYWNrIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgLXNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAgc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsICBzaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgLXNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgLy8gdG9wIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgIHNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAgc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsICBzaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgIHNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgLXNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAtc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsIC1zaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgLXNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgLy8gcmlnaHQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAtc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsICBzaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgIHNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAtc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBsZWZ0IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgLXNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAtc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsICBzaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgIHNpemUvMiwgLXNpemUvMiBdXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbm9ybWFsczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAvLyBmcm9udCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gYmFjayBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgLTEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsIC0xLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAtMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgLTEuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gdG9wIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAxLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBib3R0b20gZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIC0xLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAtMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgLTEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIC0xLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIHJpZ2h0IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAgMC4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgIDAuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsICAwLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAgMC4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBsZWZ0IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgLTEuMCwgIDAuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAtMS4wLCAgMC4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIC0xLjAsICAwLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgLTEuMCwgIDAuMCwgIDAuMCBdXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXZzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIC8vIGZyb250IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIGJhY2sgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gdG9wIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIGJvdHRvbSBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyByaWdodCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBsZWZ0IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAxLjAgXVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluZGljZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgMCwgMSwgMiwgMCwgMiwgMywgLy8gZnJvbnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgNCwgNSwgNiwgNCwgNiwgNywgLy8gYmFjayBmYWNlXHJcbiAgICAgICAgICAgICAgICA4LCA5LCAxMCwgOCwgMTAsIDExLCAvLyB0b3AgZmFjZVxyXG4gICAgICAgICAgICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSwgLy8gYm90dG9tIGZhY2VcclxuICAgICAgICAgICAgICAgIDE2LCAxNywgMTgsIDE2LCAxOCwgMTksIC8vIHJpZ2h0IGZhY2VcclxuICAgICAgICAgICAgICAgIDIwLCAyMSwgMjIsIDIwLCAyMiwgMjMgIC8vIGxlZnQgZmFjZVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdlb21ldHJ5OiBmdW5jdGlvbiggc2l6ZSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5wb3NpdGlvbnMoIHNpemUgKSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbHM6IHRoaXMubm9ybWFscygpLFxyXG4gICAgICAgICAgICAgICAgdXZzOiB0aGlzLnV2cygpLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogdGhpcy5pbmRpY2VzKCksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFNMSUNFUyA9IDIwLFxyXG4gICAgICAgIEhFSUdIVCA9IDEsXHJcbiAgICAgICAgUkFESVVTID0gMTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgcG9zaXRpb25zOiBmdW5jdGlvbiggc2xpY2VzLCBoZWlnaHQsIHJhZGl1cyApIHtcclxuICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgc2xpY2VBbmdsZSxcclxuICAgICAgICAgICAgICAgIHgwLCB6MCxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCB8fCBIRUlHSFQ7XHJcbiAgICAgICAgICAgIHJhZGl1cyA9IHJhZGl1cyB8fCBSQURJVVM7XHJcbiAgICAgICAgICAgIHNsaWNlQW5nbGUgPSAyICogTWF0aC5QSSAvIHNsaWNlcztcclxuICAgIFx0XHRmb3IgKCBpPTA7IGk8PXNsaWNlczsgaSsrICkge1xyXG4gICAgXHRcdFx0eDAgPSByYWRpdXMgKiBNYXRoLnNpbiggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgIFx0XHRcdHowID0gcmFkaXVzICogTWF0aC5jb3MoIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChbIHgwLCBoZWlnaHQsIHowIF0pO1xyXG4gICAgXHRcdH1cclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPD1zbGljZXM7IGkrKyApIHtcclxuICAgIFx0XHRcdHgwID0gcmFkaXVzICogTWF0aC5zaW4oIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICBcdFx0XHR6MCA9IHJhZGl1cyAqIE1hdGguY29zKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnB1c2goWyB4MCwgMCwgejAgXSk7XHJcbiAgICBcdFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gcG9zaXRpb25zO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG5vcm1hbHM6IGZ1bmN0aW9uKCBzbGljZXMgKSB7XHJcbiAgICAgICAgICAgIHZhciBub3JtYWxzID0gW10sXHJcbiAgICAgICAgICAgICAgICBzbGljZUFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgeDAsIHowLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgICAgICAgICAgc2xpY2VBbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2xpY2VzO1xyXG4gICAgXHRcdGZvciAoIGk9MDsgaTw9c2xpY2VzOyBpKysgKSB7XHJcbiAgICBcdFx0XHR4MCA9IE1hdGguc2luKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgXHRcdFx0ejAgPSBNYXRoLmNvcyggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbHMucHVzaChbIHgwLCAwLCB6MCBdKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTw9c2xpY2VzOyBpKysgKSB7XHJcbiAgICBcdFx0XHR4MCA9IE1hdGguc2luKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgXHRcdFx0ejAgPSBNYXRoLmNvcyggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbHMucHVzaChbIHgwLCAwLCB6MCBdKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHV2czogZnVuY3Rpb24oIHNsaWNlcyApIHtcclxuICAgICAgICAgICAgdmFyIHV2cyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgIFx0XHRmb3IgKCBpPTA7IGk8PXNsaWNlczsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgdXZzLnB1c2goWyBpIC8gc2xpY2VzLCAxIF0pO1xyXG4gICAgXHRcdH1cclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPD1zbGljZXM7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIHV2cy5wdXNoKFsgaSAvIHNsaWNlcywgMCBdKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgICAgIHJldHVybiB1dnM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5kaWNlczogZnVuY3Rpb24oIHNsaWNlcyApIHtcclxuICAgICAgICBcdHZhciB2ZXJ0ZXhJbmRleCA9IDAsXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzID0gW10sXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgXHRcdGZvciAoIGk9MDsgaTw9c2xpY2VzOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgc2xpY2VzICsgMSApO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCApO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIHNsaWNlcyApO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIHNsaWNlcyArIDEgKTtcclxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyAxICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRleCsrO1xyXG4gICAgXHRcdH1cclxuICAgICAgICAgICAgcmV0dXJuIGluZGljZXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2VvbWV0cnk6IGZ1bmN0aW9uKCBzdGFja3MsIHJhZGl1cyApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5wb3NpdGlvbnMoIHN0YWNrcywgcmFkaXVzICksXHJcbiAgICAgICAgICAgICAgICBub3JtYWxzOiB0aGlzLm5vcm1hbHMoIHN0YWNrcyApLFxyXG4gICAgICAgICAgICAgICAgdXZzOiB0aGlzLnV2cyggc3RhY2tzICksXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiB0aGlzLmluZGljZXMoIHN0YWNrcyApLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgU0laRSA9IDE7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIHBvc2l0aW9uczogZnVuY3Rpb24oIHNpemUgKSB7XHJcbiAgICAgICAgICAgIHNpemUgPSBzaXplIHx8IFNJWkU7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsIC1zaXplLzIsICAwIF0sXHJcbiAgICAgICAgICAgICAgICBbIHNpemUvMiwgLXNpemUvMiwgIDAgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgIHNpemUvMiwgIDAgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgIHNpemUvMiwgIDAgXVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG5vcm1hbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHV2czogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMS4wIF1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbmRpY2VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIDAsIDEsIDIsIDAsIDIsIDNcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZW9tZXRyeTogZnVuY3Rpb24oIHNpemUgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMucG9zaXRpb25zKCBzaXplICksXHJcbiAgICAgICAgICAgICAgICBub3JtYWxzOiB0aGlzLm5vcm1hbHMoKSxcclxuICAgICAgICAgICAgICAgIHV2czogdGhpcy51dnMoKSxcclxuICAgICAgICAgICAgICAgIGluZGljZXM6IHRoaXMuaW5kaWNlcygpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhbGZhZG9yID0gcmVxdWlyZSgnYWxmYWRvcicpLFxyXG4gICAgICAgIFZlYzMgPSBhbGZhZG9yLlZlYzMsXHJcbiAgICAgICAgVmVjMiA9IGFsZmFkb3IuVmVjMjtcclxuXHJcbiAgICBmdW5jdGlvbiBvcnRob2dvbmFsaXplVGFuZ2VudCggbm9ybWFsLCB0YW5nZW50LCBiaXRhbmdlbnQgKSB7XHJcbiAgICAgICAgbm9ybWFsID0gbmV3IFZlYzMoIG5vcm1hbCApO1xyXG4gICAgICAgIC8vIEdyYW0tU2NobWlkdCBvcnRob2dvbmFsaXplXHJcbiAgICAgICAgdmFyIG50ID0gbm9ybWFsLmRvdCggdGFuZ2VudCApO1xyXG4gICAgICAgIHRhbmdlbnQgPSB0YW5nZW50LnN1Yiggbm9ybWFsLm11bHQoIG50ICkgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAvLyBjYWxjdWxhdGUgaGFuZGVkbmVzc1xyXG4gICAgICAgIGlmICggbm9ybWFsLmNyb3NzKCB0YW5nZW50ICkuZG90KCBiaXRhbmdlbnQgKSA8IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YW5nZW50Lm5lZ2F0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFuZ2VudDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRPckFkZCggYXJyYXksIGluZGV4LCBlbnRyeSApIHtcclxuICAgICAgICBpZiAoIGFycmF5WyBpbmRleCBdICkge1xyXG4gICAgICAgICAgICAvLyBpZiBlbnRyeSBleGlzdHMsIGFkZCBpdCB0byBpdFxyXG4gICAgICAgICAgICBhcnJheVsgaW5kZXggXS5hZGQoIGVudHJ5ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBzZXQgdGhlIGVudHJ5XHJcbiAgICAgICAgICAgIGFycmF5WyBpbmRleCBdID0gbmV3IFZlYzMoIGVudHJ5ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBjb21wdXRlTm9ybWFsczogZnVuY3Rpb24oIHBvc2l0aW9ucywgaW5kaWNlcyApIHtcclxuICAgICAgICAgICAgdmFyIG5vcm1hbHMgPSBuZXcgQXJyYXkoIHBvc2l0aW9ucy5sZW5ndGggKSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbCxcclxuICAgICAgICAgICAgICAgIGEsIGIsIGMsXHJcbiAgICAgICAgICAgICAgICBwMCwgcDEsIHAyLFxyXG4gICAgICAgICAgICAgICAgdSwgdixcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxpbmRpY2VzLmxlbmd0aDsgaSs9MyApIHtcclxuICAgICAgICAgICAgICAgIGEgPSBpbmRpY2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgYiA9IGluZGljZXNbaSsxXTtcclxuICAgICAgICAgICAgICAgIGMgPSBpbmRpY2VzW2krMl07XHJcbiAgICAgICAgICAgICAgICBwMCA9IG5ldyBWZWMzKCBwb3NpdGlvbnNbIGEgXSApO1xyXG4gICAgICAgICAgICAgICAgcDEgPSBuZXcgVmVjMyggcG9zaXRpb25zWyBiIF0gKTtcclxuICAgICAgICAgICAgICAgIHAyID0gbmV3IFZlYzMoIHBvc2l0aW9uc1sgYyBdICk7XHJcbiAgICAgICAgICAgICAgICB1ID0gcDEuc3ViKCBwMCApO1xyXG4gICAgICAgICAgICAgICAgdiA9IHAyLnN1YiggcDAgKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IHUuY3Jvc3MoIHYgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbHNbYV0gPSBub3JtYWw7XHJcbiAgICAgICAgICAgICAgICBub3JtYWxzW2JdID0gbm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsc1tjXSA9IG5vcm1hbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9ybWFscztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjb21wdXRlVGFuZ2VudHM6IGZ1bmN0aW9uKCBwb3NpdGlvbnMsIG5vcm1hbHMsIHV2cywgaW5kaWNlcyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YW5nZW50cyA9IG5ldyBBcnJheSggcG9zaXRpb25zLmxlbmd0aCApLFxyXG4gICAgICAgICAgICAgICAgYml0YW5nZW50cyA9IG5ldyBBcnJheSggcG9zaXRpb25zLmxlbmd0aCApLFxyXG4gICAgICAgICAgICAgICAgYSwgYiwgYywgcixcclxuICAgICAgICAgICAgICAgIHAwLCBwMSwgcDIsXHJcbiAgICAgICAgICAgICAgICB1djAsIHV2MSwgdXYyLFxyXG4gICAgICAgICAgICAgICAgZGVsdGFQb3MxLCBkZWx0YVBvczIsXHJcbiAgICAgICAgICAgICAgICBkZWx0YVVWMSwgZGVsdGFVVjIsXHJcbiAgICAgICAgICAgICAgICBwMXV2MnksIHAydXYxeSxcclxuICAgICAgICAgICAgICAgIHAydXYxeCwgcDF1djJ4LFxyXG4gICAgICAgICAgICAgICAgdGFuZ2VudCxcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQwLFxyXG4gICAgICAgICAgICAgICAgdGFuZ2VudDEsXHJcbiAgICAgICAgICAgICAgICB0YW5nZW50MixcclxuICAgICAgICAgICAgICAgIGJpdGFuZ2VudCxcclxuICAgICAgICAgICAgICAgIGk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8aW5kaWNlcy5sZW5ndGg7IGkrPTMgKSB7XHJcbiAgICAgICAgICAgICAgICBhID0gaW5kaWNlc1tpXTtcclxuICAgICAgICAgICAgICAgIGIgPSBpbmRpY2VzW2krMV07XHJcbiAgICAgICAgICAgICAgICBjID0gaW5kaWNlc1tpKzJdO1xyXG5cclxuICAgICAgICAgICAgICAgIHAwID0gbmV3IFZlYzMoIHBvc2l0aW9uc1sgYSBdICk7XHJcbiAgICAgICAgICAgICAgICBwMSA9IG5ldyBWZWMzKCBwb3NpdGlvbnNbIGIgXSApO1xyXG4gICAgICAgICAgICAgICAgcDIgPSBuZXcgVmVjMyggcG9zaXRpb25zWyBjIF0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICB1djAgPSBuZXcgVmVjMiggdXZzWyBhIF0gKTtcclxuICAgICAgICAgICAgICAgIHV2MSA9IG5ldyBWZWMyKCB1dnNbIGIgXSApO1xyXG4gICAgICAgICAgICAgICAgdXYyID0gbmV3IFZlYzIoIHV2c1sgYyBdICk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVsdGFQb3MxID0gcDEuc3ViKCBwMCApO1xyXG4gICAgICAgICAgICAgICAgZGVsdGFQb3MyID0gcDIuc3ViKCBwMCApO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbHRhVVYxID0gdXYxLnN1YiggdXYwICk7XHJcbiAgICAgICAgICAgICAgICBkZWx0YVVWMiA9IHV2Mi5zdWIoIHV2MCApO1xyXG5cclxuICAgICAgICAgICAgICAgIHIgPSAxIC8gKCBkZWx0YVVWMS54ICogZGVsdGFVVjIueSAtIGRlbHRhVVYxLnkgKiBkZWx0YVVWMi54ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgcDF1djJ5ID0gZGVsdGFQb3MxLm11bHQoIGRlbHRhVVYyLnkgKTtcclxuICAgICAgICAgICAgICAgIHAydXYxeSA9IGRlbHRhUG9zMi5tdWx0KCBkZWx0YVVWMS55ICk7XHJcbiAgICAgICAgICAgICAgICB0YW5nZW50ID0gKCAoIHAxdXYyeSApLnN1YiggcDJ1djF5ICkgKS5tdWx0KCByICk7XHJcblxyXG4gICAgICAgICAgICAgICAgcDJ1djF4ID0gZGVsdGFQb3MyLm11bHQoIGRlbHRhVVYxLnggKTtcclxuICAgICAgICAgICAgICAgIHAxdXYyeCA9IGRlbHRhUG9zMS5tdWx0KCBkZWx0YVVWMi54ICk7XHJcbiAgICAgICAgICAgICAgICBiaXRhbmdlbnQgPSAoICggcDJ1djF4ICkuc3ViKCBwMXV2MnggKSApLm11bHQoIHIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBlbnN1cmUgdGhlIHRhbmdlbnQgaXMgb3J0aG9nb25hbCB3aXRoIHRoZSBub3JtYWxcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQwID0gb3J0aG9nb25hbGl6ZVRhbmdlbnQoIG5vcm1hbHNbIGEgXSwgdGFuZ2VudCwgYml0YW5nZW50ICk7XHJcbiAgICAgICAgICAgICAgICB0YW5nZW50MSA9IG9ydGhvZ29uYWxpemVUYW5nZW50KCBub3JtYWxzWyBiIF0sIHRhbmdlbnQsIGJpdGFuZ2VudCApO1xyXG4gICAgICAgICAgICAgICAgdGFuZ2VudDIgPSBvcnRob2dvbmFsaXplVGFuZ2VudCggbm9ybWFsc1sgYyBdLCB0YW5nZW50LCBiaXRhbmdlbnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0YW5nZW50cyBvciBiaS10YW5nZW50cyBtYXkgYmUgc2hhcmVkIGJ5IG11bHRpcGxlIHRyaWFuZ2xlcyxcclxuICAgICAgICAgICAgICAgIC8vIGluIHRoaXMgY2FzZSBhZGQgaXQgdG8gdGhlIGN1cnJlbnQgdGFuZ2VudC4gV2UgZG9uJ3RcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbGl6ZSBoZXJlIGFzIGl0IGdpdmVzIG1vcmUgd2VpZ2h0IHRvIGxhcmdlciB0cmlhbmdsZXMuXHJcbiAgICAgICAgICAgICAgICBzZXRPckFkZCggdGFuZ2VudHMsIGEsIHRhbmdlbnQwICk7XHJcbiAgICAgICAgICAgICAgICBzZXRPckFkZCggdGFuZ2VudHMsIGIsIHRhbmdlbnQxICk7XHJcbiAgICAgICAgICAgICAgICBzZXRPckFkZCggdGFuZ2VudHMsIGMsIHRhbmdlbnQyICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0T3JBZGQoIGJpdGFuZ2VudHMsIGEsIGJpdGFuZ2VudCApO1xyXG4gICAgICAgICAgICAgICAgc2V0T3JBZGQoIGJpdGFuZ2VudHMsIGIsIGJpdGFuZ2VudCApO1xyXG4gICAgICAgICAgICAgICAgc2V0T3JBZGQoIGJpdGFuZ2VudHMsIGMsIGJpdGFuZ2VudCApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBub3cgd2Ugbm9ybWFsaXplIHRoZSB0YW5nZW50cyBhbmQgYmktdGFuZ2VudHNcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPHRhbmdlbnRzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgdGFuZ2VudHNbaV0gPSB0YW5nZW50c1tpXS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGJpdGFuZ2VudHNbaV0gPSBiaXRhbmdlbnRzW2ldLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdGFuZ2VudHM6IHRhbmdlbnRzLFxyXG4gICAgICAgICAgICAgICAgYml0YW5nZW50czogYml0YW5nZW50c1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgU0xJQ0VTID0gMjAsXHJcbiAgICAgICAgU1RBQ0tTID0gMjAsXHJcbiAgICAgICAgUkFESVVTID0gMTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgcG9zaXRpb25zOiBmdW5jdGlvbiggc2xpY2VzLCBzdGFja3MsIHJhZGl1cyApIHtcclxuICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tBbmdsZSxcclxuICAgICAgICAgICAgICAgIHNsaWNlQW5nbGUsXHJcbiAgICAgICAgICAgICAgICByMCwgeTAsIHgwLCB6MCxcclxuICAgICAgICAgICAgICAgIGksIGo7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICAgICAgICAgIHN0YWNrcyA9IHN0YWNrcyB8fCBTVEFDS1M7XHJcbiAgICAgICAgICAgIHJhZGl1cyA9IHJhZGl1cyB8fCBSQURJVVM7XHJcbiAgICAgICAgICAgIHN0YWNrQW5nbGUgPSBNYXRoLlBJIC8gc3RhY2tzO1xyXG4gICAgICAgIFx0c2xpY2VBbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2xpY2VzO1xyXG4gICAgICAgIFx0Zm9yICggaT0wOyBpPD1zdGFja3M7IGkrKyApIHtcclxuICAgICAgICBcdFx0cjAgPSByYWRpdXMgKiBNYXRoLnNpbiggaSAqIHN0YWNrQW5nbGUgKTtcclxuICAgICAgICBcdFx0eTAgPSByYWRpdXMgKiBNYXRoLmNvcyggaSAqIHN0YWNrQW5nbGUgKTtcclxuICAgICAgICBcdFx0Zm9yICggaj0wOyBqPD1zbGljZXM7IGorKyApIHtcclxuICAgICAgICBcdFx0XHR4MCA9IHIwICogTWF0aC5zaW4oIGogKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgXHRcdFx0ejAgPSByMCAqIE1hdGguY29zKCBqICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKFsgeDAsIHkwLCB6MCBdKTtcclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gcG9zaXRpb25zO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG5vcm1hbHM6IGZ1bmN0aW9uKCBzbGljZXMsIHN0YWNrcyApIHtcclxuICAgICAgICAgICAgdmFyIG5vcm1hbHMgPSBbXSxcclxuICAgICAgICAgICAgICAgIHN0YWNrQW5nbGUsXHJcbiAgICAgICAgICAgICAgICBzbGljZUFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgcjAsIHkwLCB4MCwgejAsXHJcbiAgICAgICAgICAgICAgICBpLCBqO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgICAgICAgICBzdGFja3MgPSBzdGFja3MgfHwgU1RBQ0tTO1xyXG4gICAgICAgICAgICBzdGFja0FuZ2xlID0gTWF0aC5QSSAvIHN0YWNrcztcclxuICAgICAgICBcdHNsaWNlQW5nbGUgPSAyICogTWF0aC5QSSAvIHNsaWNlcztcclxuICAgICAgICBcdGZvciAoIGk9MDsgaTw9c3RhY2tzOyBpKysgKSB7XHJcbiAgICAgICAgXHRcdHIwID0gTWF0aC5zaW4oIGkgKiBzdGFja0FuZ2xlICk7XHJcbiAgICAgICAgXHRcdHkwID0gTWF0aC5jb3MoIGkgKiBzdGFja0FuZ2xlICk7XHJcbiAgICAgICAgXHRcdGZvciAoIGo9MDsgajw9c2xpY2VzOyBqKysgKSB7XHJcbiAgICAgICAgXHRcdFx0eDAgPSByMCAqIE1hdGguc2luKCBqICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgIFx0XHRcdHowID0gcjAgKiBNYXRoLmNvcyggaiAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWxzLnB1c2goWyB4MCwgeTAsIHowIF0pO1xyXG4gICAgICAgIFx0XHR9XHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHV2czogZnVuY3Rpb24oIHNsaWNlcywgc3RhY2tzICkge1xyXG4gICAgICAgICAgICB2YXIgdXZzID0gW10sXHJcbiAgICAgICAgICAgICAgICBpLCBqO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgICAgICAgICBzdGFja3MgPSBzdGFja3MgfHwgU1RBQ0tTO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8PXN0YWNrczsgaSsrICkge1xyXG4gICAgICAgIFx0XHRmb3IgKCBqPTA7IGo8PXNsaWNlczsgaisrICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV2cy5wdXNoKFsgaiAvIHNsaWNlcywgMS0oaSAvIHN0YWNrcykgXSk7XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuICAgICAgICAgICAgcmV0dXJuIHV2cztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbmRpY2VzOiBmdW5jdGlvbiggc2xpY2VzLCBzdGFja3MgKSB7XHJcbiAgICAgICAgXHR2YXIgdmVydGV4SW5kZXggPSAwLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlcyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgaSwgajtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgICAgICAgICAgc3RhY2tzID0gc3RhY2tzIHx8IFNUQUNLUztcclxuICAgICAgICBcdGZvciAoIGk9MDsgaTw9c3RhY2tzOyBpKysgKSB7XHJcbiAgICAgICAgXHRcdGZvciAoIGo9MDsgajw9c2xpY2VzOyBqKysgKSB7XHJcbiAgICAgICAgXHRcdFx0aWYgKCBpICE9PSBzdGFja3MgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyBzbGljZXMgKyAxICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIHNsaWNlcyApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgc2xpY2VzICsgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleEluZGV4Kys7XHJcbiAgICAgICAgXHRcdFx0fVxyXG4gICAgICAgIFx0XHR9XHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2VzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdlb21ldHJ5OiBmdW5jdGlvbiggc2xpY2VzLCBzdGFja3MsIHJhZGl1cyApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5wb3NpdGlvbnMoIHNsaWNlcywgc3RhY2tzLCByYWRpdXMgKSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbHM6IHRoaXMubm9ybWFscyggc2xpY2VzLCBzdGFja3MgKSxcclxuICAgICAgICAgICAgICAgIHV2czogdGhpcy51dnMoIHNsaWNlcywgc3RhY2tzICksXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiB0aGlzLmluZGljZXMoIHNsaWNlcywgc3RhY2tzICksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiJdfQ==
