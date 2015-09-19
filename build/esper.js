(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.esper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {

    "use strict";

    module.exports = {
        // core
        CubeMapRenderTarget: require('./core/CubeMapRenderTarget'),
        ElementArrayBuffer: require('./core/IndexBuffer'),
        RenderTarget: require('./core/RenderTarget'),
        Shader: require('./core/Shader'),
        Texture2D: require('./core/Texture2D'),
        TextureCubeMap: require('./core/TextureCubeMap'),
        VertexBuffer: require('./core/VertexBuffer'),
        VertexPackage: require('./core/VertexPackage'),
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

},{"./core/CubeMapRenderTarget":14,"./core/IndexBuffer":15,"./core/RenderTarget":16,"./core/Shader":17,"./core/Texture2D":19,"./core/TextureCubeMap":20,"./core/VertexBuffer":21,"./core/VertexPackage":22,"./core/Viewport":23,"./core/WebGLContext":24,"./render/Camera":26,"./render/Entity":27,"./render/Geometry":28,"./render/Joint":29,"./render/Material":30,"./render/Mesh":31,"./render/Octree":32,"./render/RenderPass":33,"./render/RenderTechnique":34,"./render/Renderable":35,"./render/Renderer":36,"./render/Skeleton":37,"./util/Util":39,"./util/debug/Debug":41,"./util/gltf/glTFLoader":43,"./util/obj/OBJMTLLoader":51,"./util/shapes/Cube":52,"./util/shapes/Cylinder":53,"./util/shapes/Quad":54,"./util/shapes/ShapeUtil":55,"./util/shapes/Sphere":56,"alfador":10}],2:[function(require,module,exports){
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

},{"../util/Stack":38,"./WebGLContext":24}],17:[function(require,module,exports){
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
            console.warn( 'No uniform found under name"' + uniformName +
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

},{"../util/Stack":38,"../util/Util":39,"../util/XHRLoader":40,"./ShaderParser":18,"./WebGLContext":24}],18:[function(require,module,exports){
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
                that.setParameters( this );
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
            this.mipMap = spec.mipMap || false;
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
            data = ensurePowerOfTwo( data );
            this.image = data;
            this.width = data.width;
            this.height = data.height;
            this.mipMap = true;
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
            if ( this.minMap ) {
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

},{"../util/Stack":38,"../util/Util":39,"./WebGLContext":24}],20:[function(require,module,exports){
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
            this.mipMap = spec.mipMap || false;
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
            this.filter = "LINEAR";
            this.mipMap = true;
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

},{"../util/Stack":38,"../util/Util":39,"./WebGLContext":24}],21:[function(require,module,exports){
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

},{"../util/Util":39,"./VertexPackage":22,"./WebGLContext":24}],22:[function(require,module,exports){
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
            gl.canvas.height = height;
            gl.canvas.width = width;
        } else {
            gl.viewport( 0, 0, viewport.width, viewport.height );
            gl.canvas.height = viewport.height;
            gl.canvas.width = viewport.width;
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

},{"../util/Stack":38,"./WebGLContext":24}],24:[function(require,module,exports){
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
        Skeleton = require('./Skeleton'),
        Animation = require('./Animation');

    function Entity( spec ) {
        var key, i;
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
            for ( i=0; i<spec.children.length; i++ ) {
                this.addChild( spec.children[i] );
            }
        }
        // set meshes
        this.meshes = [];
        if ( spec.meshes ) {
            for ( i=0; i<spec.meshes.length; i++ ) {
                if ( spec.meshes[i] instanceof Mesh ) {
                    this.meshes.push( spec.meshes[i] );
                } else {
                    this.meshes.push( new Mesh( spec.meshes[i] ) );
                }
            }
        }
        // set skeleton, if it exists
        this.skeleton = null;
        if ( spec.skeleton ) {
            if ( spec.skeleton instanceof Skeleton ) {
                this.skeleton = spec.skeleton;
            } else {
                this.skeleton = new Skeleton( spec.meshes[i] );
            }
        }
        // set animations, if they exist
        this.animations = {};
        if ( spec.animations ) {
            for ( key in spec.animations ) {
                if ( spec.animations.hasOwnProperty( key ) ) {
                    if ( spec.animations[ key ] instanceof Animation ) {
                        this.animations[ key ] = spec.animations;
                    } else {
                        this.animations[ key ] = new Animation( spec.animations );
                    }
                }
            }
        }
        return this;
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

    Entity.prototype.forEach = function( callback ) {
        var child,
            i;
        callback( this );
        for ( i=0; i<this.children.length; i++ ) {
            child = this.children[i];
            if ( child.forEach ) {
                child.forEach( callback );
            }
        }
    };

    Entity.prototype.copy = function() {
        var that = new Entity({
                up: this.up(),
                forward: this.forward(),
                origin: this.origin(),
                scale: this.scale(),
                meshes: this.meshes, // copy by reference,
                skeleton: this.skeleton, // copy by reference
                animations: this.animations // copy by reference
            }),
            i;
        // copy children by value
        for ( i=0; i<this.children.length; i++ ) {
            that.addChild( this.children[i].copy() );
        }
        return that;
    };

    module.exports = Entity;

}());

},{"./Animation":25,"./Mesh":31,"./Skeleton":37,"alfador":10}],28:[function(require,module,exports){
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
     */
    function forEachRecursive( entity, forEachEntity, forEachMesh ) {
        // for each entity
        if ( forEachEntity ) {
            forEachEntity( entity );
        }
        // for each Mesh
        if ( forEachMesh ) {
            entity.meshes.forEach( function( mesh ) {
                forEachMesh( mesh, entity );
            });
        }
        // depth first traversal
        entity.children.forEach( function( child ) {
            forEachRecursive( child, forEachEntity, forEachMesh );
        });
    }

    function RenderPass( spec ) {
        if ( typeof spec === 'object' ) {
            this.before = spec.before || null;
            this.forEachEntity = spec.forEachEntity || null;
            this.forEachMesh = spec.forEachMesh || null;
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
            after = this.after;
        // setup function
        if ( before ) {
            before( camera );
        }
        // rendering functions
        entities.forEach( function( entity ) {
            if ( entity ) {
                forEachRecursive( entity, forEachEntity, forEachMesh );
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

},{}],39:[function(require,module,exports){
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

},{"simply-deferred":13}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"../../core/Shader":17,"../../render/Entity":27,"../../render/Mesh":31,"../../render/RenderPass":33,"../../render/RenderTechnique":34,"../../render/Renderer":36,"../shapes/Quad":54}],42:[function(require,module,exports){
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

},{"alfador":10}],43:[function(require,module,exports){
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

},{"../../render/Entity":27,"../Util":39,"./glTFAnimation":42,"./glTFMaterial":44,"./glTFMesh":45,"./glTFParser":46,"./glTFSkeleton":47,"./glTFUtil":48,"path":11}],44:[function(require,module,exports){
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
                    wrap: "REPEAT"
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

},{"../../core/Texture2D":19,"../../render/Material":30,"../Util":39,"./glTFUtil":48}],45:[function(require,module,exports){
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

},{"../../core/IndexBuffer":15,"../../core/VertexBuffer":21,"../../core/WebGLContext":24,"../../render/Mesh":31}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{"../../render/Joint":29,"../../render/Skeleton":37,"./glTFUtil":48,"alfador":10}],48:[function(require,module,exports){
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

},{"../Util":39,"../XHRLoader":40,"alfador":10}],49:[function(require,module,exports){
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

},{"../Util":39,"../XHRLoader":40,"path":11}],50:[function(require,module,exports){
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

        function getPosition( value ) {
			var index = parseInt( value );
			if ( index >= 0  ) {
                return positions[ index - 1 ];
            }
            return positions[ index + positions.length ];
		}

        function getUV( value ) {
			var index = parseInt( value );
			if ( index >= 0  ) {
                return uvs[ index - 1 ];
            }
            return uvs[ index + uvs.length ];
		}

        function getNormal( value ) {
			var index = parseInt( value );
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
                    parseFloat( 1 - result[ 2 ] ) // invert
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
                model.mtllib = model.mtllib || [];
                model.mtllib.push( line.substring( 7 ).trim() );
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

},{"../XHRLoader":40}],51:[function(require,module,exports){
(function() {

    "use strict";

    var path = require('path'),
        Util = require('../Util'),
        OBJLoader = require('./OBJLoader'),
        MTLLoader = require('./MTLLoader');

    /**
     * Returns a function to load an MTL file, and execute a callback upon
     * completion.
     *
     * @param {String} url - The url for the MTL file to load.
     *
     * @returns {Function} The function to load the MTL file.
     */
    function loadMtl( url ) {
        return function( done ) {
            MTLLoader.load( url, done );
        };
    }

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
        var jobs = [],
            i;
        // if not material, exit early
        if ( !model.mtllib ) {
            callback( model );
            return;
        }
        // set up the material loading job
        for ( i=0; i<model.mtllib.length; i++ ) {
            jobs.push( loadMtl( baseUrl + '/' + model.mtllib[ i ] ) );
        }
        // dispatch all material loading jobs
        Util.async( jobs, function( materials ) {
            var materialsByName = {},
                i;
            for ( i=0; i<materials.length; i++ ) {
                Util.extend( materialsByName, materials[i] );
            }
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
                    var meshes = model.meshes,
                        i;
                    for ( i=0; i<meshes.length; i++ ) {
                        meshes[i].material = materialsById[ meshes[i].material ];
                    }
                    callback( model );
                });
            });
        }

     };

}());

},{"../Util":39,"./MTLLoader":49,"./OBJLoader":50,"path":11}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{"alfador":10}],56:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZXhwb3J0cy5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9NYXQzMy5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9NYXQ0NC5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9RdWF0ZXJuaW9uLmpzIiwibm9kZV9tb2R1bGVzL2FsZmFkb3Ivc3JjL1RyYW5zZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9UcmlhbmdsZS5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9WZWMyLmpzIiwibm9kZV9tb2R1bGVzL2FsZmFkb3Ivc3JjL1ZlYzMuanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvVmVjNC5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9leHBvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc2ltcGx5LWRlZmVycmVkL2RlZmVycmVkLmpzIiwic3JjL2NvcmUvQ3ViZU1hcFJlbmRlclRhcmdldC5qcyIsInNyYy9jb3JlL0luZGV4QnVmZmVyLmpzIiwic3JjL2NvcmUvUmVuZGVyVGFyZ2V0LmpzIiwic3JjL2NvcmUvU2hhZGVyLmpzIiwic3JjL2NvcmUvU2hhZGVyUGFyc2VyLmpzIiwic3JjL2NvcmUvVGV4dHVyZTJELmpzIiwic3JjL2NvcmUvVGV4dHVyZUN1YmVNYXAuanMiLCJzcmMvY29yZS9WZXJ0ZXhCdWZmZXIuanMiLCJzcmMvY29yZS9WZXJ0ZXhQYWNrYWdlLmpzIiwic3JjL2NvcmUvVmlld3BvcnQuanMiLCJzcmMvY29yZS9XZWJHTENvbnRleHQuanMiLCJzcmMvcmVuZGVyL0FuaW1hdGlvbi5qcyIsInNyYy9yZW5kZXIvQ2FtZXJhLmpzIiwic3JjL3JlbmRlci9FbnRpdHkuanMiLCJzcmMvcmVuZGVyL0dlb21ldHJ5LmpzIiwic3JjL3JlbmRlci9Kb2ludC5qcyIsInNyYy9yZW5kZXIvTWF0ZXJpYWwuanMiLCJzcmMvcmVuZGVyL01lc2guanMiLCJzcmMvcmVuZGVyL09jdHJlZS5qcyIsInNyYy9yZW5kZXIvUmVuZGVyUGFzcy5qcyIsInNyYy9yZW5kZXIvUmVuZGVyVGVjaG5pcXVlLmpzIiwic3JjL3JlbmRlci9SZW5kZXJhYmxlLmpzIiwic3JjL3JlbmRlci9SZW5kZXJlci5qcyIsInNyYy9yZW5kZXIvU2tlbGV0b24uanMiLCJzcmMvdXRpbC9TdGFjay5qcyIsInNyYy91dGlsL1V0aWwuanMiLCJzcmMvdXRpbC9YSFJMb2FkZXIuanMiLCJzcmMvdXRpbC9kZWJ1Zy9EZWJ1Zy5qcyIsInNyYy91dGlsL2dsdGYvZ2xURkFuaW1hdGlvbi5qcyIsInNyYy91dGlsL2dsdGYvZ2xURkxvYWRlci5qcyIsInNyYy91dGlsL2dsdGYvZ2xURk1hdGVyaWFsLmpzIiwic3JjL3V0aWwvZ2x0Zi9nbFRGTWVzaC5qcyIsInNyYy91dGlsL2dsdGYvZ2xURlBhcnNlci5qcyIsInNyYy91dGlsL2dsdGYvZ2xURlNrZWxldG9uLmpzIiwic3JjL3V0aWwvZ2x0Zi9nbFRGVXRpbC5qcyIsInNyYy91dGlsL29iai9NVExMb2FkZXIuanMiLCJzcmMvdXRpbC9vYmovT0JKTG9hZGVyLmpzIiwic3JjL3V0aWwvb2JqL09CSk1UTExvYWRlci5qcyIsInNyYy91dGlsL3NoYXBlcy9DdWJlLmpzIiwic3JjL3V0aWwvc2hhcGVzL0N5bGluZGVyLmpzIiwic3JjL3V0aWwvc2hhcGVzL1F1YWQuanMiLCJzcmMvdXRpbC9zaGFwZXMvU2hhcGVVdGlsLmpzIiwic3JjL3V0aWwvc2hhcGVzL1NwaGVyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAgICAgLy8gY29yZVxyXG4gICAgICAgIEN1YmVNYXBSZW5kZXJUYXJnZXQ6IHJlcXVpcmUoJy4vY29yZS9DdWJlTWFwUmVuZGVyVGFyZ2V0JyksXHJcbiAgICAgICAgRWxlbWVudEFycmF5QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvSW5kZXhCdWZmZXInKSxcclxuICAgICAgICBSZW5kZXJUYXJnZXQ6IHJlcXVpcmUoJy4vY29yZS9SZW5kZXJUYXJnZXQnKSxcclxuICAgICAgICBTaGFkZXI6IHJlcXVpcmUoJy4vY29yZS9TaGFkZXInKSxcclxuICAgICAgICBUZXh0dXJlMkQ6IHJlcXVpcmUoJy4vY29yZS9UZXh0dXJlMkQnKSxcclxuICAgICAgICBUZXh0dXJlQ3ViZU1hcDogcmVxdWlyZSgnLi9jb3JlL1RleHR1cmVDdWJlTWFwJyksXHJcbiAgICAgICAgVmVydGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvVmVydGV4QnVmZmVyJyksXHJcbiAgICAgICAgVmVydGV4UGFja2FnZTogcmVxdWlyZSgnLi9jb3JlL1ZlcnRleFBhY2thZ2UnKSxcclxuICAgICAgICBWaWV3cG9ydDogcmVxdWlyZSgnLi9jb3JlL1ZpZXdwb3J0JyksXHJcbiAgICAgICAgV2ViR0xDb250ZXh0OiByZXF1aXJlKCcuL2NvcmUvV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgLy8gcmVuZGVyXHJcbiAgICAgICAgQ2FtZXJhOiByZXF1aXJlKCcuL3JlbmRlci9DYW1lcmEnKSxcclxuICAgICAgICBFbnRpdHk6IHJlcXVpcmUoJy4vcmVuZGVyL0VudGl0eScpLFxyXG4gICAgICAgIEdlb21ldHJ5OiByZXF1aXJlKCcuL3JlbmRlci9HZW9tZXRyeScpLFxyXG4gICAgICAgIE1hdGVyaWFsOiByZXF1aXJlKCcuL3JlbmRlci9NYXRlcmlhbCcpLFxyXG4gICAgICAgIE1lc2g6IHJlcXVpcmUoJy4vcmVuZGVyL01lc2gnKSxcclxuICAgICAgICBKb2ludDogcmVxdWlyZSgnLi9yZW5kZXIvSm9pbnQnKSxcclxuICAgICAgICBPY3RyZWU6IHJlcXVpcmUoJy4vcmVuZGVyL09jdHJlZScpLFxyXG4gICAgICAgIFJlbmRlcmFibGU6IHJlcXVpcmUoJy4vcmVuZGVyL1JlbmRlcmFibGUnKSxcclxuICAgICAgICBSZW5kZXJlcjogcmVxdWlyZSgnLi9yZW5kZXIvUmVuZGVyZXInKSxcclxuICAgICAgICBSZW5kZXJQYXNzOiByZXF1aXJlKCcuL3JlbmRlci9SZW5kZXJQYXNzJyksXHJcbiAgICAgICAgUmVuZGVyVGVjaG5pcXVlOiByZXF1aXJlKCcuL3JlbmRlci9SZW5kZXJUZWNobmlxdWUnKSxcclxuICAgICAgICBTa2VsZXRvbjogcmVxdWlyZSgnLi9yZW5kZXIvU2tlbGV0b24nKSxcclxuICAgICAgICAvLyBzaGFwZXNcclxuICAgICAgICBDdWJlOiByZXF1aXJlKCcuL3V0aWwvc2hhcGVzL0N1YmUnKSxcclxuICAgICAgICBDeWxpbmRlcjogcmVxdWlyZSgnLi91dGlsL3NoYXBlcy9DeWxpbmRlcicpLFxyXG4gICAgICAgIFF1YWQ6IHJlcXVpcmUoJy4vdXRpbC9zaGFwZXMvUXVhZCcpLFxyXG4gICAgICAgIFNoYXBlVXRpbDogcmVxdWlyZSgnLi91dGlsL3NoYXBlcy9TaGFwZVV0aWwnKSxcclxuICAgICAgICBTcGhlcmU6IHJlcXVpcmUoJy4vdXRpbC9zaGFwZXMvU3BoZXJlJyksXHJcbiAgICAgICAgLy8gdXRpbFxyXG4gICAgICAgIGdsVEZMb2FkZXI6IHJlcXVpcmUoJy4vdXRpbC9nbHRmL2dsVEZMb2FkZXInKSxcclxuICAgICAgICBPQkpNVExMb2FkZXI6IHJlcXVpcmUoJy4vdXRpbC9vYmovT0JKTVRMTG9hZGVyJyksXHJcbiAgICAgICAgVXRpbDogcmVxdWlyZSgnLi91dGlsL1V0aWwnKSxcclxuICAgICAgICAvLyBkZWJ1Z1xyXG4gICAgICAgIERlYnVnOiByZXF1aXJlKCcuL3V0aWwvZGVidWcvRGVidWcnKSxcclxuICAgICAgICAvLyBtYXRoXHJcbiAgICAgICAgTWF0MzM6IHJlcXVpcmUoJ2FsZmFkb3InKS5NYXQzMyxcclxuICAgICAgICBNYXQ0NDogcmVxdWlyZSgnYWxmYWRvcicpLk1hdDQ0LFxyXG4gICAgICAgIFZlYzI6IHJlcXVpcmUoJ2FsZmFkb3InKS5WZWMyLFxyXG4gICAgICAgIFZlYzM6IHJlcXVpcmUoJ2FsZmFkb3InKS5WZWMzLFxyXG4gICAgICAgIFZlYzQ6IHJlcXVpcmUoJ2FsZmFkb3InKS5WZWM0LFxyXG4gICAgICAgIFF1YXRlcm5pb246IHJlcXVpcmUoJ2FsZmFkb3InKS5RdWF0ZXJuaW9uLFxyXG4gICAgICAgIFRyYW5zZm9ybTogcmVxdWlyZSgnYWxmYWRvcicpLlRyYW5zZm9ybSxcclxuICAgICAgICBUcmlhbmdsZTogcmVxdWlyZSgnYWxmYWRvcicpLlRyaWFuZ2xlXHJcbiAgICB9O1xyXG5cclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVjMyA9IHJlcXVpcmUoICcuL1ZlYzMnICksXHJcbiAgICAgICAgVmVjNCA9IHJlcXVpcmUoICcuL1ZlYzQnICk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgTWF0MzNcclxuICAgICAqIEBjbGFzc2Rlc2MgQSAzeDMgY29sdW1uLW1ham9yIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTWF0MzMoIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0ICkge1xyXG4gICAgICAgICAgICBpZiAoIHRoYXQuZGF0YSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGF0LmRhdGEubGVuZ3RoID09PSA5ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgTWF0MzMgZGF0YSBieSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoYXQuZGF0YS5zbGljZSggMCApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb3B5IE1hdDQ0IGRhdGEgYnkgdmFsdWUsIGFjY291bnQgZm9yIGluZGV4IGRpZmZlcmVuY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmRhdGFbMF0sIHRoYXQuZGF0YVsxXSwgdGhhdC5kYXRhWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmRhdGFbNF0sIHRoYXQuZGF0YVs1XSwgdGhhdC5kYXRhWzZdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmRhdGFbOF0sIHRoYXQuZGF0YVs5XSwgdGhhdC5kYXRhWzEwXSBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGF0Lmxlbmd0aCA9PT0gOSApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvcHkgYXJyYXkgYnkgdmFsdWUsIHVzZSBwcm90b3R5cGUgdG8gY2FzdCBhcnJheSBidWZmZXJzXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggdGhhdCApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdDMzLmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0MzMuaWRlbnRpdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgY29sdW1uIG9mIHRoZSBtYXRyaXggYXMgYSBWZWMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSAwLWJhc2VkIGNvbHVtbiBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIGNvbHVtbiB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMCtpbmRleF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVszK2luZGV4XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzYraW5kZXhdICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdyBvZiB0aGUgbWF0cml4IGFzIGEgVmVjMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgMC1iYXNlZCByb3cgaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBjb2x1bW4gdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuY29sID0gZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzAraW5kZXgqM10sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxK2luZGV4KjNdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMitpbmRleCozXSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGlkZW50aXR5IG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIGlkZW50aXkgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5pZGVudGl0eSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0MzMoWyAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxIF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBzY2FsZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl8bnVtYmVyfSBzY2FsZSAtIFRoZSBzY2FsYXIgb3IgdmVjdG9yIHNjYWxpbmcgZmFjdG9yLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHNjYWxlIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMuc2NhbGUgPSBmdW5jdGlvbiggc2NhbGUgKSB7XHJcbiAgICAgICAgaWYgKCB0eXBlb2Ygc2NhbGUgPT09IFwibnVtYmVyXCIgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0MzMoW1xyXG4gICAgICAgICAgICAgICAgc2NhbGUsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCBzY2FsZSwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIHNjYWxlIF0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNjYWxlIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0MzMoW1xyXG4gICAgICAgICAgICAgICAgc2NhbGVbMF0sIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCBzY2FsZVsxXSwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIHNjYWxlWzJdIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IE1hdDMzKFtcclxuICAgICAgICAgICAgc2NhbGUueCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgc2NhbGUueSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgc2NhbGUueiBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcm90YXRpb24gbWF0cml4IGRlZmluZWQgYnkgYW4gYXhpcyBhbmQgYW4gYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiBkZWdyZWVzLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucm90YXRpb25EZWdyZWVzID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0aW9uUmFkaWFucyggYW5nbGUqTWF0aC5QSS8xODAsIGF4aXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcm90YXRpb24gbWF0cml4IGRlZmluZWQgYnkgYW4gYXhpcyBhbmQgYW4gYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiByYWRpYW5zLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucm90YXRpb25SYWRpYW5zID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIGlmICggYXhpcyBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICBheGlzID0gbmV3IFZlYzMoIGF4aXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gemVybyB2ZWN0b3IsIHJldHVybiBpZGVudGl0eVxyXG4gICAgICAgIGlmICggYXhpcy5sZW5ndGhTcXVhcmVkKCkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBub3JtQXhpcyA9IGF4aXMubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIHggPSBub3JtQXhpcy54LFxyXG4gICAgICAgICAgICB5ID0gbm9ybUF4aXMueSxcclxuICAgICAgICAgICAgeiA9IG5vcm1BeGlzLnosXHJcbiAgICAgICAgICAgIG1vZEFuZ2xlID0gKCBhbmdsZSA+IDAgKSA/IGFuZ2xlICUgKDIqTWF0aC5QSSkgOiBhbmdsZSAlICgtMipNYXRoLlBJKSxcclxuICAgICAgICAgICAgcyA9IE1hdGguc2luKCBtb2RBbmdsZSApLFxyXG4gICAgICAgICAgICBjID0gTWF0aC5jb3MoIG1vZEFuZ2xlICksXHJcbiAgICAgICAgICAgIHh4ID0geCAqIHgsXHJcbiAgICAgICAgICAgIHl5ID0geSAqIHksXHJcbiAgICAgICAgICAgIHp6ID0geiAqIHosXHJcbiAgICAgICAgICAgIHh5ID0geCAqIHksXHJcbiAgICAgICAgICAgIHl6ID0geSAqIHosXHJcbiAgICAgICAgICAgIHp4ID0geiAqIHgsXHJcbiAgICAgICAgICAgIHhzID0geCAqIHMsXHJcbiAgICAgICAgICAgIHlzID0geSAqIHMsXHJcbiAgICAgICAgICAgIHpzID0geiAqIHMsXHJcbiAgICAgICAgICAgIG9uZV9jID0gMS4wIC0gYztcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDMzKFtcclxuICAgICAgICAgICAgKG9uZV9jICogeHgpICsgYywgKG9uZV9jICogeHkpICsgenMsIChvbmVfYyAqIHp4KSAtIHlzLFxyXG4gICAgICAgICAgICAob25lX2MgKiB4eSkgLSB6cywgKG9uZV9jICogeXkpICsgYywgKG9uZV9jICogeXopICsgeHMsXHJcbiAgICAgICAgICAgIChvbmVfYyAqIHp4KSArIHlzLCAob25lX2MgKiB5eikgLSB4cywgKG9uZV9jICogenopICsgY1xyXG4gICAgICAgIF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggdG8gcm90YXRlIGEgdmVjdG9yIGZyb20gb25lIGRpcmVjdGlvbiB0b1xyXG4gICAgICogYW5vdGhlci5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM30gZnJvbSAtIFRoZSBzdGFydGluZyBkaXJlY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRvIC0gVGhlIGVuZGluZyBkaXJlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24uXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnJvdGF0aW9uRnJvbVRvID0gZnVuY3Rpb24oIGZyb21WZWMsIHRvVmVjICkge1xyXG4gICAgICAgIC8qQnVpbGRzIHRoZSByb3RhdGlvbiBtYXRyaXggdGhhdCByb3RhdGVzIG9uZSB2ZWN0b3IgaW50byBhbm90aGVyLlxyXG5cclxuICAgICAgICBUaGUgZ2VuZXJhdGVkIHJvdGF0aW9uIG1hdHJpeCB3aWxsIHJvdGF0ZSB0aGUgdmVjdG9yIGZyb20gaW50b1xyXG4gICAgICAgIHRoZSBWZWN0b3IzPHZhcj4gdG8uIGZyb20gYW5kIHRvIG11c3QgYmUgdW5pdCBWZWN0b3IzPHZhcj5zIVxyXG5cclxuICAgICAgICBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGUgY29kZSBmcm9tOlxyXG5cclxuICAgICAgICBUb21hcyBNbGxlciwgSm9obiBIdWdoZXNcclxuICAgICAgICBFZmZpY2llbnRseSBCdWlsZGluZyBhIE1hdHJpeCB0byBSb3RhdGUgT25lIFZlY3RvciB0byBBbm90aGVyXHJcbiAgICAgICAgSm91cm5hbCBvZiBHcmFwaGljcyBUb29scywgNCg0KToxLTQsIDE5OTlcclxuICAgICAgICAqL1xyXG4gICAgICAgIHZhciBFUFNJTE9OID0gMC4wMDAwMDEsXHJcbiAgICAgICAgICAgIGZyb20gPSBuZXcgVmVjMyggZnJvbVZlYyApLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICB0byA9IG5ldyBWZWMzKCB0b1ZlYyApLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBlID0gZnJvbS5kb3QoIHRvICksXHJcbiAgICAgICAgICAgIGYgPSBNYXRoLmFicyggZSApLFxyXG4gICAgICAgICAgICB0aGF0ID0gbmV3IE1hdDMzKCksXHJcbiAgICAgICAgICAgIHgsIHUsIHYsXHJcbiAgICAgICAgICAgIGZ4LCBmeSwgZnosXHJcbiAgICAgICAgICAgIHV4LCB1eixcclxuICAgICAgICAgICAgYzEsIGMyLCBjMztcclxuICAgICAgICBpZiAoIGYgPiAoIDEuMC1FUFNJTE9OICkgKSB7XHJcbiAgICAgICAgICAgIC8vIFwiZnJvbVwiIGFuZCBcInRvXCIgYWxtb3N0IHBhcmFsbGVsXHJcbiAgICAgICAgICAgIC8vIG5lYXJseSBvcnRob2dvbmFsXHJcbiAgICAgICAgICAgIGZ4ID0gTWF0aC5hYnMoIGZyb20ueCApO1xyXG4gICAgICAgICAgICBmeSA9IE1hdGguYWJzKCBmcm9tLnkgKTtcclxuICAgICAgICAgICAgZnogPSBNYXRoLmFicyggZnJvbS56ICk7XHJcbiAgICAgICAgICAgIGlmIChmeCA8IGZ5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZng8ZnopIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gbmV3IFZlYzMoIDEsIDAsIDAgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IG5ldyBWZWMzKCAwLCAwLCAxICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZnkgPCBmeikge1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSBuZXcgVmVjMyggMCwgMSwgMCApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gbmV3IFZlYzMoIDAsIDAsIDEgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1ID0geC5zdWIoIGZyb20gKTtcclxuICAgICAgICAgICAgdiA9IHguc3ViKCB0byApO1xyXG4gICAgICAgICAgICBjMSA9IDIuMCAvIHUuZG90KCB1ICk7XHJcbiAgICAgICAgICAgIGMyID0gMi4wIC8gdi5kb3QoIHYgKTtcclxuICAgICAgICAgICAgYzMgPSBjMSpjMiAqIHUuZG90KCB2ICk7XHJcbiAgICAgICAgICAgIC8vIHNldCBtYXRyaXggZW50cmllc1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbMF0gPSAtIGMxKnUueCp1LnggLSBjMip2Lngqdi54ICsgYzMqdi54KnUueDtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzNdID0gLSBjMSp1LngqdS55IC0gYzIqdi54KnYueSArIGMzKnYueCp1Lnk7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs2XSA9IC0gYzEqdS54KnUueiAtIGMyKnYueCp2LnogKyBjMyp2LngqdS56O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbMV0gPSAtIGMxKnUueSp1LnggLSBjMip2Lnkqdi54ICsgYzMqdi55KnUueDtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzRdID0gLSBjMSp1LnkqdS55IC0gYzIqdi55KnYueSArIGMzKnYueSp1Lnk7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs3XSA9IC0gYzEqdS55KnUueiAtIGMyKnYueSp2LnogKyBjMyp2LnkqdS56O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbMl0gPSAtIGMxKnUueip1LnggLSBjMip2Lnoqdi54ICsgYzMqdi56KnUueDtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzVdID0gLSBjMSp1LnoqdS55IC0gYzIqdi56KnYueSArIGMzKnYueip1Lnk7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs4XSA9IC0gYzEqdS56KnUueiAtIGMyKnYueip2LnogKyBjMyp2LnoqdS56O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbMF0gKz0gMS4wO1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNF0gKz0gMS4wO1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbOF0gKz0gMS4wO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRoZSBtb3N0IGNvbW1vbiBjYXNlLCB1bmxlc3MgXCJmcm9tXCI9XCJ0b1wiLCBvciBcInRvXCI9LVwiZnJvbVwiXHJcbiAgICAgICAgICAgIHYgPSBmcm9tLmNyb3NzKCB0byApO1xyXG4gICAgICAgICAgICB1ID0gMS4wIC8gKCAxLjAgKyBlICk7ICAgIC8vIG9wdGltaXphdGlvbiBieSBHb3R0ZnJpZWQgQ2hlblxyXG4gICAgICAgICAgICB1eCA9IHUgKiB2Lng7XHJcbiAgICAgICAgICAgIHV6ID0gdSAqIHYuejtcclxuICAgICAgICAgICAgYzEgPSB1eCAqIHYueTtcclxuICAgICAgICAgICAgYzIgPSB1eCAqIHYuejtcclxuICAgICAgICAgICAgYzMgPSB1eiAqIHYueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzBdID0gZSArIHV4ICogdi54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbM10gPSBjMSAtIHYuejtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzZdID0gYzIgKyB2Lnk7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVsxXSA9IGMxICsgdi56O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNF0gPSBlICsgdSAqIHYueSAqIHYueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzddID0gYzMgLSB2Lng7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVsyXSA9IGMyIC0gdi55O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNV0gPSBjMyArIHYueDtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzhdID0gZSArIHV6ICogdi56O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhhdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBtYXRyaXggd2l0aCB0aGUgcHJvdmlkZWQgbWF0cml4IGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgTWEzM1xyXG4gICAgICogb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNYXQzM3xNYXQ0NHxBcnJheX0gdGhhdCAtIFRoZSBtYXRyaXggdG8gYWRkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHN1bSBvZiB0aGUgdHdvIG1hdHJpY2VzLlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQzMyggdGhhdCApLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTw5OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldICs9IHRoaXMuZGF0YVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJ0cmFjdHMgdGhlIHByb3ZpZGVkIG1hdHJpeCBhcmd1bWVudCBmcm9tIHRoZSBtYXRyaXgsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogTWF0MzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNYXQzM3xNYXQ0NHxBcnJheX0gdGhhdCAtIFRoZSBtYXRyaXggdG8gYWRkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIGRpZmZlcmVuY2Ugb2YgdGhlIHR3byBtYXRyaWNlcy5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0MzMoIHRoYXQgKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8OTsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAtIG1hdC5kYXRhW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHByb3ZkZWQgdmVjdG9yIGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXgsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogVmVjMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHJlc3VsdGluZyB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5tdWx0VmVjdG9yID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgLy8gZW5zdXJlICd0aGF0JyBpcyBhIFZlYzNcclxuICAgICAgICAvLyBpdCBpcyBzYWZlIHRvIG9ubHkgY2FzdCBpZiBBcnJheSBzaW5jZSB0aGUgLncgb2YgYSBWZWM0IGlzIG5vdCB1c2VkXHJcbiAgICAgICAgdGhhdCA9ICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkgPyBuZXcgVmVjMyggdGhhdCApIDogdGhhdDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoe1xyXG4gICAgICAgICAgICB4OiB0aGlzLmRhdGFbMF0gKiB0aGF0LnggKyB0aGlzLmRhdGFbM10gKiB0aGF0LnkgKyB0aGlzLmRhdGFbNl0gKiB0aGF0LnosXHJcbiAgICAgICAgICAgIHk6IHRoaXMuZGF0YVsxXSAqIHRoYXQueCArIHRoaXMuZGF0YVs0XSAqIHRoYXQueSArIHRoaXMuZGF0YVs3XSAqIHRoYXQueixcclxuICAgICAgICAgICAgejogdGhpcy5kYXRhWzJdICogdGhhdC54ICsgdGhpcy5kYXRhWzVdICogdGhhdC55ICsgdGhpcy5kYXRhWzhdICogdGhhdC56XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyBhbGwgY29tcG9uZW50cyBvZiB0aGUgbWF0cml4IGJ5IHRoZSBwcm92ZGVkIHNjYWxhciBhcmd1bWVudCxcclxuICAgICAqIHJldHVybmluZyBhIG5ldyBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIG11bHRpcGx5IHRoZSBtYXRyaXggYnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgcmVzdWx0aW5nIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLm11bHRTY2FsYXIgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDMzKCksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDk7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHByb3ZkZWQgbWF0cml4IGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXgsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogTWF0MzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNYXQzM3xNYXQ0NH0gLSBUaGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSByZXN1bHRpbmcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUubXVsdE1hdHJpeCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0MzMoKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBlbnN1cmUgJ3RoYXQnIGlzIGEgTWF0MzNcclxuICAgICAgICAvLyBtdXN0IGNoZWNrIGlmIEFycmF5IG9yIE1hdDMzXHJcbiAgICAgICAgaWYgKCAoIHRoYXQuZGF0YSAmJiB0aGF0LmRhdGEubGVuZ3RoID09PSAxNiApIHx8XHJcbiAgICAgICAgICAgIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgdGhhdCA9IG5ldyBNYXQzMyggdGhhdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKCBpPTA7IGk8MzsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQuZGF0YVswXSArIHRoaXMuZGF0YVtpKzNdICogdGhhdC5kYXRhWzFdICsgdGhpcy5kYXRhW2krNl0gKiB0aGF0LmRhdGFbMl07XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2krM10gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbM10gKyB0aGlzLmRhdGFbaSszXSAqIHRoYXQuZGF0YVs0XSArIHRoaXMuZGF0YVtpKzZdICogdGhhdC5kYXRhWzVdO1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpKzZdID0gdGhpcy5kYXRhW2ldICogdGhhdC5kYXRhWzZdICsgdGhpcy5kYXRhW2krM10gKiB0aGF0LmRhdGFbN10gKyB0aGlzLmRhdGFbaSs2XSAqIHRoYXQuZGF0YVs4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSBwcm92ZGVkIGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxNYXQzM3xNYXQ0NHxBcnJheXxudW1iZXJ9IC0gVGhlIGFyZ3VtZW50IHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN8VmVjM30gVGhlIHJlc3VsdGluZyBwcm9kdWN0LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHRoYXQgPT09IFwibnVtYmVyXCIgKSB7XHJcbiAgICAgICAgICAgIC8vIHNjYWxhclxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0U2NhbGFyKCB0aGF0ICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBhcnJheVxyXG4gICAgICAgICAgICBpZiAoIHRoYXQubGVuZ3RoID09PSAzIHx8IHRoYXQubGVuZ3RoID09PSA0ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvciggdGhhdCApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdE1hdHJpeCggdGhhdCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHZlY3RvclxyXG4gICAgICAgIGlmICggdGhhdC54ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhhdC55ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhhdC56ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRWZWN0b3IoIHRoYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbWF0cml4XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdE1hdHJpeCggdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpdmlkZXMgYWxsIGNvbXBvbmVudHMgb2YgdGhlIG1hdHJpeCBieSB0aGUgcHJvdmRlZCBzY2FsYXIgYXJndW1lbnQsXHJcbiAgICAgKiByZXR1cm5pbmcgYSBuZXcgTWF0MzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBkaXZpZGUgdGhlIG1hdHJpeCBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSByZXN1bHRpbmcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQzMygpLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTw5OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldIC8gdGhhdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGFsbCBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgbWF0cml4LlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byB0ZXN0IGVxdWFsaXR5IHdpdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZXBzaWxvbiAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIG1hdHJpeCBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTw5OyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGF3a3dhcmQgY29tcGFyaXNvbiBsb2dpYyBpcyByZXF1aXJlZCB0byBlbnN1cmUgZXF1YWxpdHkgcGFzc2VzIGlmXHJcbiAgICAgICAgICAgIC8vIGNvcnJlc3BvbmRpbmcgYXJlIGJvdGggdW5kZWZpbmVkLCBOYU4sIG9yIEluZmluaXR5XHJcbiAgICAgICAgICAgIGlmICggIShcclxuICAgICAgICAgICAgICAgICggdGhpcy5kYXRhW2ldID09PSB0aGF0LmRhdGFbaV0gKSB8fFxyXG4gICAgICAgICAgICAgICAgKCBNYXRoLmFicyggdGhpcy5kYXRhW2ldIC0gdGhhdC5kYXRhW2ldICkgPD0gZXBzaWxvbiApXHJcbiAgICAgICAgICAgICAgICkgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgdHJhbnNwb3NlIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSB0cmFuc3Bvc2VkIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmFucyA9IG5ldyBNYXQzMygpLCBpO1xyXG4gICAgICAgIGZvciAoIGkgPSAwOyBpIDwgMzsgaSsrICkge1xyXG4gICAgICAgICAgICB0cmFucy5kYXRhW2kqM10gICAgID0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgICAgICB0cmFucy5kYXRhWyhpKjMpKzFdID0gdGhpcy5kYXRhW2krM107XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbKGkqMykrMl0gPSB0aGlzLmRhdGFbaSs2XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIGludmVydGVkIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaW52ID0gbmV3IE1hdDMzKCksIGRldDtcclxuICAgICAgICAvLyBjb21wdXRlIGludmVyc2VcclxuICAgICAgICAvLyByb3cgMVxyXG4gICAgICAgIGludi5kYXRhWzBdID0gdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVs4XSAtIHRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbNV07XHJcbiAgICAgICAgaW52LmRhdGFbM10gPSAtdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs4XSArIHRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbNV07XHJcbiAgICAgICAgaW52LmRhdGFbNl0gPSB0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzddIC0gdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVs0XTtcclxuICAgICAgICAvLyByb3cgMlxyXG4gICAgICAgIGludi5kYXRhWzFdID0gLXRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbOF0gKyB0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzJdO1xyXG4gICAgICAgIGludi5kYXRhWzRdID0gdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs4XSAtIHRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMl07XHJcbiAgICAgICAgaW52LmRhdGFbN10gPSAtdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs3XSArIHRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMV07XHJcbiAgICAgICAgLy8gcm93IDNcclxuICAgICAgICBpbnYuZGF0YVsyXSA9IHRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbNV0gLSB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzJdO1xyXG4gICAgICAgIGludi5kYXRhWzVdID0gLXRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNV0gKyB0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzJdO1xyXG4gICAgICAgIGludi5kYXRhWzhdID0gdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs0XSAtIHRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMV07XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGRldGVybWluYW50XHJcbiAgICAgICAgZGV0ID0gdGhpcy5kYXRhWzBdKmludi5kYXRhWzBdICsgdGhpcy5kYXRhWzFdKmludi5kYXRhWzNdICsgdGhpcy5kYXRhWzJdKmludi5kYXRhWzZdO1xyXG4gICAgICAgIC8vIHJldHVyblxyXG4gICAgICAgIHJldHVybiBpbnYubXVsdCggMSAvIGRldCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlY29tcG9zZXMgdGhlIG1hdHJpeCBpbnRvIHRoZSBjb3JyZXNwb25kaW5nIHgsIHksIGFuZCB6IGF4ZXMsIGFsb25nIHdpdGhcclxuICAgICAqIGEgc2NhbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGVjb21wb3NlZCBjb21wb25lbnRzIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5kZWNvbXBvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY29sMCA9IHRoaXMuY29sKCAwICksXHJcbiAgICAgICAgICAgIGNvbDEgPSB0aGlzLmNvbCggMSApLFxyXG4gICAgICAgICAgICBjb2wyID0gdGhpcy5jb2woIDIgKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsZWZ0OiBjb2wwLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICB1cDogY29sMS5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgZm9yd2FyZDogY29sMi5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgc2NhbGU6IG5ldyBWZWMzKCBjb2wwLmxlbmd0aCgpLCBjb2wxLmxlbmd0aCgpLCBjb2wyLmxlbmd0aCgpIClcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByYW5kb20gdHJhbnNmb3JtIG1hdHJpeCBjb21wb3NlZCBvZiBhIHJvdGF0aW9uIGFuZCBzY2FsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gQSByYW5kb20gdHJhbnNmb3JtIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJvdCA9IE1hdDMzLnJvdGF0aW9uUmFkaWFucyggTWF0aC5yYW5kb20oKSAqIDM2MCwgVmVjMy5yYW5kb20oKSApLFxyXG4gICAgICAgICAgICBzY2FsZSA9IE1hdDMzLnNjYWxlKCBNYXRoLnJhbmRvbSgpICogMTAgKTtcclxuICAgICAgICByZXR1cm4gcm90Lm11bHQoIHNjYWxlICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdICtcIiwgXCIrIHRoaXMuZGF0YVszXSArXCIsIFwiKyB0aGlzLmRhdGFbNl0gK1wiLFxcblwiICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzFdICtcIiwgXCIrIHRoaXMuZGF0YVs0XSArXCIsIFwiKyB0aGlzLmRhdGFbN10gK1wiLFxcblwiICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzJdICtcIiwgXCIrIHRoaXMuZGF0YVs1XSArXCIsIFwiKyB0aGlzLmRhdGFbOF07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgbWF0cml4IGFzIGFuIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2xpY2UoIDAgKTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXQzMztcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVjMyA9IHJlcXVpcmUoICcuL1ZlYzMnICksXHJcbiAgICAgICAgVmVjNCA9IHJlcXVpcmUoICcuL1ZlYzQnICksXHJcbiAgICAgICAgTWF0MzMgPSByZXF1aXJlKCAnLi9NYXQzMycgKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIE1hdDQ0IG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBNYXQ0NFxyXG4gICAgICogQGNsYXNzZGVzYyBBIDR4NCBjb2x1bW4tbWFqb3IgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBNYXQ0NCggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhhdC5kYXRhIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoYXQuZGF0YS5sZW5ndGggPT09IDE2ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgTWF0NDQgZGF0YSBieSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoYXQuZGF0YS5zbGljZSggMCApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb3B5IE1hdDMzIGRhdGEgYnkgdmFsdWUsIGFjY291bnQgZm9yIGluZGV4IGRpZmZlcmVuY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmRhdGFbMF0sIHRoYXQuZGF0YVsxXSwgdGhhdC5kYXRhWzJdLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmRhdGFbM10sIHRoYXQuZGF0YVs0XSwgdGhhdC5kYXRhWzVdLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmRhdGFbNl0sIHRoYXQuZGF0YVs3XSwgdGhhdC5kYXRhWzhdLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoYXQubGVuZ3RoID09PSAxNiApIHtcclxuICAgICAgICAgICAgICAgICAvLyBjb3B5IGFycmF5IGJ5IHZhbHVlLCB1c2UgcHJvdG90eXBlIHRvIGNhc3QgYXJyYXkgYnVmZmVyc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIHRoYXQgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGNvbHVtbiBvZiB0aGUgbWF0cml4IGFzIGEgVmVjNCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgMC1iYXNlZCBjb2x1bW4gaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBjb2x1bW4gdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUucm93ID0gZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzAraW5kZXhdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNCtpbmRleF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4K2luZGV4XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyK2luZGV4XSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3cgb2YgdGhlIG1hdHJpeCBhcyBhIFZlYzQgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIDAtYmFzZWQgcm93IGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBUaGUgY29sdW1uIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLmNvbCA9IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswK2luZGV4KjRdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMStpbmRleCo0XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzIraW5kZXgqNF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVszK2luZGV4KjRdICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaWRlbnRpdHkgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgaWRlbnRpeSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LmlkZW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHNjYWxlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheXxudW1iZXJ9IHNjYWxlIC0gVGhlIHNjYWxhciBvciB2ZWN0b3Igc2NhbGluZyBmYWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgc2NhbGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5zY2FsZSA9IGZ1bmN0aW9uKCBzY2FsZSApIHtcclxuICAgICAgICBpZiAoIHR5cGVvZiBzY2FsZSA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgICAgICBzY2FsZSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIHNjYWxlLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgc2NhbGUsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAwLCAxIF0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNjYWxlIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0NDQoW1xyXG4gICAgICAgICAgICAgICAgc2NhbGVbMF0sIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCBzY2FsZVsxXSwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIHNjYWxlWzJdLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgIHNjYWxlLngsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIHNjYWxlLnksIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIHNjYWxlLnosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHRyYW5zbGF0aW9uIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gdHJhbnNsYXRpb24gLSBUaGUgdHJhbnNsYXRpb24gdmVjdG9yLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHRyYW5zbGF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQudHJhbnNsYXRpb24gPSBmdW5jdGlvbiggdHJhbnNsYXRpb24gKSB7XHJcbiAgICAgICAgaWYgKCB0cmFuc2xhdGlvbiBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uWzBdLCB0cmFuc2xhdGlvblsxXSwgdHJhbnNsYXRpb25bMl0sIDEgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGlvbi54LCB0cmFuc2xhdGlvbi55LCB0cmFuc2xhdGlvbi56LCAxIF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggZGVmaW5lZCBieSBhbiBheGlzIGFuZCBhbiBhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIGRlZ3JlZXMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgcm90YXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5yb3RhdGlvbkRlZ3JlZXMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NCggTWF0MzMucm90YXRpb25EZWdyZWVzKCBhbmdsZSwgYXhpcyApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdGF0aW9uIG1hdHJpeCBkZWZpbmVkIGJ5IGFuIGF4aXMgYW5kIGFuIGFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gcmFkaWFucy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnJvdGF0aW9uUmFkaWFucyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KCBNYXQzMy5yb3RhdGlvblJhZGlhbnMoIGFuZ2xlLCBheGlzICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcm90YXRpb24gbWF0cml4IHRvIHJvdGF0ZSBhIHZlY3RvciBmcm9tIG9uZSBkaXJlY3Rpb24gdG9cclxuICAgICAqIGFub3RoZXIuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGZyb20gLSBUaGUgc3RhcnRpbmcgZGlyZWN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSB0byAtIFRoZSBlbmRpbmcgZGlyZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIG1hdHJpeCByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5yb3RhdGlvbkZyb21UbyA9IGZ1bmN0aW9uKCBmcm9tVmVjLCB0b1ZlYyApIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KCBNYXQzMy5yb3RhdGlvbkZyb21UbyggZnJvbVZlYywgdG9WZWMgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIG1hdHJpeCB3aXRoIHRoZSBwcm92aWRlZCBtYXRyaXggYXJndW1lbnQsIHJldHVybmluZyBhIG5ldyBNYTMzXHJcbiAgICAgKiBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgc3VtIG9mIHRoZSB0d28gbWF0cmljZXMuXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDQ0KCB0aGF0ICksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDE2OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldICs9IHRoaXMuZGF0YVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJ0cmFjdHMgdGhlIHByb3ZpZGVkIG1hdHJpeCBhcmd1bWVudCBmcm9tIHRoZSBtYXRyaXgsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogTWF0NDQgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNYXQzM3xNYXQ0NHxBcnJheX0gdGhhdCAtIFRoZSBtYXRyaXggdG8gYWRkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGRpZmZlcmVuY2Ugb2YgdGhlIHR3byBtYXRyaWNlcy5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0NDQoIHRoYXQgKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8MTY7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gPSB0aGlzLmRhdGFbaV0gLSBtYXQuZGF0YVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSBwcm92ZGVkIHZlY3RvciBhcmd1bWVudCBieSB0aGUgbWF0cml4LCByZXR1cm5pbmcgYSBuZXdcclxuICAgICAqIFZlYzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIHZlY3RvciB0byBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBtYXRyaXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSByZXN1bHRpbmcgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUubXVsdFZlY3RvcjMgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICAvLyBlbnN1cmUgJ3RoYXQnIGlzIGEgVmVjM1xyXG4gICAgICAgIC8vIGl0IGlzIHNhZmUgdG8gb25seSBjYXN0IGlmIEFycmF5IHNpbmNlIFZlYzQgaGFzIG93biBtZXRob2RcclxuICAgICAgICB0aGF0ID0gKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSA/IG5ldyBWZWMzKCB0aGF0ICkgOiB0aGF0O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh7XHJcbiAgICAgICAgICAgIHg6IHRoaXMuZGF0YVswXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNF0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzhdICogdGhhdC56ICsgdGhpcy5kYXRhWzEyXSxcclxuICAgICAgICAgICAgeTogdGhpcy5kYXRhWzFdICogdGhhdC54ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs1XSAqIHRoYXQueSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbOV0gKiB0aGF0LnogKyB0aGlzLmRhdGFbMTNdLFxyXG4gICAgICAgICAgICB6OiB0aGlzLmRhdGFbMl0gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzZdICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxMF0gKiB0aGF0LnogKyB0aGlzLmRhdGFbMTRdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCB2ZWN0b3IgYXJndW1lbnQgYnkgdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBWZWMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fEFycmF5fSAtIFRoZSB2ZWN0b3IgdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBUaGUgcmVzdWx0aW5nIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLm11bHRWZWN0b3I0ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgLy8gZW5zdXJlICd0aGF0JyBpcyBhIFZlYzRcclxuICAgICAgICAvLyBpdCBpcyBzYWZlIHRvIG9ubHkgY2FzdCBpZiBBcnJheSBzaW5jZSBWZWMzIGhhcyBvd24gbWV0aG9kXHJcbiAgICAgICAgdGhhdCA9ICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkgPyBuZXcgVmVjNCggdGhhdCApIDogdGhhdDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoe1xyXG4gICAgICAgICAgICB4OiB0aGlzLmRhdGFbMF0gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzRdICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs4XSAqIHRoYXQueiArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbMTJdICogdGhhdC53LFxyXG4gICAgICAgICAgICB5OiB0aGlzLmRhdGFbMV0gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzVdICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs5XSAqIHRoYXQueiArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbMTNdICogdGhhdC53LFxyXG4gICAgICAgICAgICB6OiB0aGlzLmRhdGFbMl0gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzZdICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxMF0gKiB0aGF0LnogK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzE0XSAqIHRoYXQudyxcclxuICAgICAgICAgICAgdzogdGhpcy5kYXRhWzNdICogdGhhdC54ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs3XSAqIHRoYXQueSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbMTFdICogdGhhdC56ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxNV0gKiB0aGF0LndcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIGFsbCBjb21wb25lbnRzIG9mIHRoZSBtYXRyaXggYnkgdGhlIHByb3ZkZWQgc2NhbGFyIGFyZ3VtZW50LFxyXG4gICAgICogcmV0dXJuaW5nIGEgbmV3IE1hdDQ0IG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIG1hdHJpeCBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByZXN1bHRpbmcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUubXVsdFNjYWxhciA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0NDQoKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8MTY7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHByb3ZkZWQgbWF0cml4IGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXgsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogTWF0NDQgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNYXQzM3xNYXQ0NHxBcnJheX0gLSBUaGUgbWF0cml4IHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByZXN1bHRpbmcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUubXVsdE1hdHJpeCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0NDQoKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBlbnN1cmUgJ3RoYXQnIGlzIGEgTWF0NDRcclxuICAgICAgICAvLyBtdXN0IGNoZWNrIGlmIEFycmF5IG9yIE1hdDQ0XHJcbiAgICAgICAgaWYgKCAoIHRoYXQuZGF0YSAmJiB0aGF0LmRhdGEubGVuZ3RoID09PSA5ICkgfHxcclxuICAgICAgICAgICAgdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICB0aGF0ID0gbmV3IE1hdDQ0KCB0aGF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTw0OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldICogdGhhdC5kYXRhWzBdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzRdICogdGhhdC5kYXRhWzFdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzhdICogdGhhdC5kYXRhWzJdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzEyXSAqIHRoYXQuZGF0YVszXTtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaSs0XSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQuZGF0YVs0XSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs0XSAqIHRoYXQuZGF0YVs1XSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs4XSAqIHRoYXQuZGF0YVs2XSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSsxMl0gKiB0aGF0LmRhdGFbN107XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2krOF0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbOF0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krNF0gKiB0aGF0LmRhdGFbOV0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krOF0gKiB0aGF0LmRhdGFbMTBdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzEyXSAqIHRoYXQuZGF0YVsxMV07XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2krMTJdID0gdGhpcy5kYXRhW2ldICogdGhhdC5kYXRhWzEyXSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs0XSAqIHRoYXQuZGF0YVsxM10gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krOF0gKiB0aGF0LmRhdGFbMTRdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzEyXSAqIHRoYXQuZGF0YVsxNV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCBhcmd1bWVudCBieSB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8TWF0MzN8TWF0NDR8QXJyYXl8bnVtYmVyfSAtIFRoZSBhcmd1bWVudCB0byBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBtYXRyaXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fFZlYzR9IFRoZSByZXN1bHRpbmcgcHJvZHVjdC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHR5cGVvZiB0aGF0ID09PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgICAgICAvLyBzY2FsYXJcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFNjYWxhciggdGhhdCApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgLy8gYXJyYXlcclxuICAgICAgICAgICAgaWYgKCB0aGF0Lmxlbmd0aCA9PT0gMyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRWZWN0b3IzKCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoYXQubGVuZ3RoID09PSA0ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvcjQoIHRoYXQgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRNYXRyaXgoIHRoYXQgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB2ZWN0b3JcclxuICAgICAgICBpZiAoIHRoYXQueCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoYXQueSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHRoYXQueiAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBpZiAoIHRoYXQudyAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgLy8gdmVjNFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvcjQoIHRoYXQgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL3ZlYzNcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvcjMoIHRoYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbWF0cml4XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdE1hdHJpeCggdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpdmlkZXMgYWxsIGNvbXBvbmVudHMgb2YgdGhlIG1hdHJpeCBieSB0aGUgcHJvdmRlZCBzY2FsYXIgYXJndW1lbnQsXHJcbiAgICAgKiByZXR1cm5pbmcgYSBuZXcgTWF0NDQgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBkaXZpZGUgdGhlIG1hdHJpeCBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByZXN1bHRpbmcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpLCBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTwxNjsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAvIHRoYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBhbGwgY29tcG9uZW50cyBtYXRjaCB0aG9zZSBvZiBhIHByb3ZpZGVkIG1hdHJpeC5cclxuICAgICAqIEFuIG9wdGlvbmFsIGVwc2lsb24gdmFsdWUgbWF5IGJlIHByb3ZpZGVkLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtNYXQ0NHxBcnJheX0gdGhhdCAtIFRoZSBtYXRyaXggdG8gdGVzdCBlcXVhbGl0eSB3aXRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVwc2lsb24gLSBUaGUgZXBzaWxvbiB2YWx1ZS4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBtYXRyaXggY29tcG9uZW50cyBtYXRjaC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8MTY7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gYXdrd2FyZCBjb21wYXJpc29uIGxvZ2ljIGlzIHJlcXVpcmVkIHRvIGVuc3VyZSBlcXVhbGl0eSBwYXNzZXMgaWZcclxuICAgICAgICAgICAgLy8gY29ycmVzcG9uZGluZyBhcmUgYm90aCB1bmRlZmluZWQsIE5hTiwgb3IgSW5maW5pdHlcclxuICAgICAgICAgICAgaWYgKCAhKFxyXG4gICAgICAgICAgICAgICAgKCB0aGlzLmRhdGFbaV0gPT09IHRoYXQuZGF0YVtpXSApIHx8XHJcbiAgICAgICAgICAgICAgICAoIE1hdGguYWJzKCB0aGlzLmRhdGFbaV0gLSB0aGF0LmRhdGFbaV0gKSA8PSBlcHNpbG9uIClcclxuICAgICAgICAgICAgICAgKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIG90aHJvZ3JhcGhpYyBwcm9qZWN0aW9uIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geE1pbiAtIFRoZSBtaW5pbXVtIHggZXh0ZW50IG9mIHRoZSBwcm9qZWN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhNYXggLSBUaGUgbWF4aW11bSB4IGV4dGVudCBvZiB0aGUgcHJvamVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4TWluIC0gVGhlIG1pbmltdW0geSBleHRlbnQgb2YgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geE1heCAtIFRoZSBtYXhpbXVtIHkgZXh0ZW50IG9mIHRoZSBwcm9qZWN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhNaW4gLSBUaGUgbWluaW11bSB6IGV4dGVudCBvZiB0aGUgcHJvamVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4TWluIC0gVGhlIG1heGltdW0geiBleHRlbnQgb2YgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgb3J0aG9ncmFwaGljIHByb2plY3Rpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5vcnRobyA9IGZ1bmN0aW9uKCB4TWluLCB4TWF4LCB5TWluLCB5TWF4LCB6TWluLCB6TWF4ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgIG1hdC5kYXRhWzBdID0gMiAvICh4TWF4IC0geE1pbik7XHJcbiAgICAgICAgbWF0LmRhdGFbNV0gPSAyIC8gKHlNYXggLSB5TWluKTtcclxuICAgICAgICBtYXQuZGF0YVsxMF0gPSAtMiAvICh6TWF4IC0gek1pbik7XHJcbiAgICAgICAgbWF0LmRhdGFbMTJdID0gLSgoeE1heCArIHhNaW4pLyh4TWF4IC0geE1pbikpO1xyXG4gICAgICAgIG1hdC5kYXRhWzEzXSA9IC0oKHlNYXggKyB5TWluKS8oeU1heCAtIHlNaW4pKTtcclxuICAgICAgICBtYXQuZGF0YVsxNF0gPSAtKCh6TWF4ICsgek1pbikvKHpNYXggLSB6TWluKSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXguXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZvdiAtIFRoZSBmaWVsZCBvZiB2aWV3LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdCAtIFRoZSBhc3BlY3QgcmF0aW8uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gek1pbiAtIFRoZSBtaW5pbXVtIHkgZXh0ZW50IG9mIHRoZSBmcnVzdHVtLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpNYXggLSBUaGUgbWF4aW11bSB5IGV4dGVudCBvZiB0aGUgZnJ1c3R1bS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucGVyc3BlY3RpdmUgPSBmdW5jdGlvbiggZm92LCBhc3BlY3QsIHpNaW4sIHpNYXggKSB7XHJcbiAgICAgICAgdmFyIHlNYXggPSB6TWluICogTWF0aC50YW4oIGZvdiAqICggTWF0aC5QSSAvIDM2MC4wICkgKSxcclxuICAgICAgICAgICAgeU1pbiA9IC15TWF4LFxyXG4gICAgICAgICAgICB4TWluID0geU1pbiAqIGFzcGVjdCxcclxuICAgICAgICAgICAgeE1heCA9IC14TWluLFxyXG4gICAgICAgICAgICBtYXQgPSBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgIG1hdC5kYXRhWzBdID0gKDIgKiB6TWluKSAvICh4TWF4IC0geE1pbik7XHJcbiAgICAgICAgbWF0LmRhdGFbNV0gPSAoMiAqIHpNaW4pIC8gKHlNYXggLSB5TWluKTtcclxuICAgICAgICBtYXQuZGF0YVs4XSA9ICh4TWF4ICsgeE1pbikgLyAoeE1heCAtIHhNaW4pO1xyXG4gICAgICAgIG1hdC5kYXRhWzldID0gKHlNYXggKyB5TWluKSAvICh5TWF4IC0geU1pbik7XHJcbiAgICAgICAgbWF0LmRhdGFbMTBdID0gLSgoek1heCArIHpNaW4pIC8gKHpNYXggLSB6TWluKSk7XHJcbiAgICAgICAgbWF0LmRhdGFbMTFdID0gLTE7XHJcbiAgICAgICAgbWF0LmRhdGFbMTRdID0gLSggKCAyICogKHpNYXgqek1pbikgKS8oek1heCAtIHpNaW4pKTtcclxuICAgICAgICBtYXQuZGF0YVsxNV0gPSAwO1xyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgdHJhbnNwb3NlIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSB0cmFuc3Bvc2VkIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmFucyA9IG5ldyBNYXQ0NCgpLCBpO1xyXG4gICAgICAgIGZvciAoIGkgPSAwOyBpIDwgNDsgaSsrICkge1xyXG4gICAgICAgICAgICB0cmFucy5kYXRhW2kqNF0gPSB0aGlzLmRhdGFbaV07XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbKGkqNCkrMV0gPSB0aGlzLmRhdGFbaSs0XTtcclxuICAgICAgICAgICAgdHJhbnMuZGF0YVsoaSo0KSsyXSA9IHRoaXMuZGF0YVtpKzhdO1xyXG4gICAgICAgICAgICB0cmFucy5kYXRhWyhpKjQpKzNdID0gdGhpcy5kYXRhW2krMTJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJhbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgaW52ZXJ0ZWQgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbnYgPSBuZXcgTWF0NDQoKSwgZGV0O1xyXG4gICAgICAgIC8vIGNvbXB1dGUgaW52ZXJzZVxyXG4gICAgICAgIC8vIHJvdyAxXHJcbiAgICAgICAgaW52LmRhdGFbMF0gPSB0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzEwXSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxMV0qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxM10qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxMV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTNdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTBdO1xyXG4gICAgICAgIGludi5kYXRhWzRdID0gLXRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMTBdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzExXSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzExXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxMF07XHJcbiAgICAgICAgaW52LmRhdGFbOF0gPSB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzldKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzExXSp0aGlzLmRhdGFbMTNdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTNdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzExXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVs5XTtcclxuICAgICAgICBpbnYuZGF0YVsxMl0gPSAtdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxMF0qdGhpcy5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzEzXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxMF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbOV07XHJcbiAgICAgICAgLy8gcm93IDJcclxuICAgICAgICBpbnYuZGF0YVsxXSA9IC10aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzEwXSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxMV0qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxM10qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxMV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTNdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTBdO1xyXG4gICAgICAgIGludi5kYXRhWzVdID0gdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVsxMF0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbMTFdKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTFdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzEwXTtcclxuICAgICAgICBpbnYuZGF0YVs5XSA9IC10aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzldKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzExXSp0aGlzLmRhdGFbMTNdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTNdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzExXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs5XTtcclxuICAgICAgICBpbnYuZGF0YVsxM10gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzldKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzEwXSp0aGlzLmRhdGFbMTNdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTNdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzEwXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs5XTtcclxuICAgICAgICAvLyByb3cgM1xyXG4gICAgICAgIGludi5kYXRhWzJdID0gdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEzXSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzddIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEzXSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzZdO1xyXG4gICAgICAgIGludi5kYXRhWzZdID0gLXRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs3XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs2XTtcclxuICAgICAgICBpbnYuZGF0YVsxMF0gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxM10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxM10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbN10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbNV07XHJcbiAgICAgICAgaW52LmRhdGFbMTRdID0gLXRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzEzXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs2XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICAvLyByb3cgNFxyXG4gICAgICAgIGludi5kYXRhWzNdID0gLXRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzExXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzEwXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzExXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzEwXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzddICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzldKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbNl07XHJcbiAgICAgICAgaW52LmRhdGFbN10gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxMV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxMF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxMV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxMF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs3XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzZdO1xyXG4gICAgICAgIGludi5kYXRhWzExXSA9IC10aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxMV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVs5XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzExXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzldIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbN10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICBpbnYuZGF0YVsxNV0gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxMF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVs5XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzEwXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzldICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbNl0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICAvLyBjYWxjdWxhdGUgZGV0ZXJtaW5hbnRcclxuICAgICAgICBkZXQgPSB0aGlzLmRhdGFbMF0qaW52LmRhdGFbMF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMV0qaW52LmRhdGFbNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMl0qaW52LmRhdGFbOF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbM10qaW52LmRhdGFbMTJdO1xyXG4gICAgICAgIHJldHVybiBpbnYubXVsdCggMSAvIGRldCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlY29tcG9zZXMgdGhlIG1hdHJpeCBpbnRvIHRoZSBjb3JyZXNwb25kaW5nIHgsIHksIGFuZCB6IGF4ZXMsIGFsb25nIHdpdGhcclxuICAgICAqIGEgc2NhbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGVjb21wb3NlZCBjb21wb25lbnRzIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5kZWNvbXBvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBleHRyYWN0IHRyYW5zZm9ybSBjb21wb25lbnRzXHJcbiAgICAgICAgdmFyIGNvbDAgPSBuZXcgVmVjMyggdGhpcy5jb2woIDAgKSApLFxyXG4gICAgICAgICAgICBjb2wxID0gbmV3IFZlYzMoIHRoaXMuY29sKCAxICkgKSxcclxuICAgICAgICAgICAgY29sMiA9IG5ldyBWZWMzKCB0aGlzLmNvbCggMiApICksXHJcbiAgICAgICAgICAgIGNvbDMgPSBuZXcgVmVjMyggdGhpcy5jb2woIDMgKSApO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxlZnQ6IGNvbDAubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIHVwOiBjb2wxLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBmb3J3YXJkOiBjb2wyLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBvcmlnaW46IGNvbDMsXHJcbiAgICAgICAgICAgIHNjYWxlOiBuZXcgVmVjMyggY29sMC5sZW5ndGgoKSwgY29sMS5sZW5ndGgoKSwgY29sMi5sZW5ndGgoKSApXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIHRyYW5zZm9ybSBtYXRyaXggY29tcG9zZWQgb2YgYSByb3RhdGlvbiBhbmQgc2NhbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IEEgcmFuZG9tIHRyYW5zZm9ybSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByb3QgPSBNYXQ0NC5yb3RhdGlvblJhZGlhbnMoIE1hdGgucmFuZG9tKCkgKiAzNjAsIFZlYzMucmFuZG9tKCkgKSxcclxuICAgICAgICAgICAgc2NhbGUgPSBNYXQ0NC5zY2FsZSggTWF0aC5yYW5kb20oKSAqIDEwICksXHJcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uID0gTWF0NDQudHJhbnNsYXRpb24oIFZlYzMucmFuZG9tKCkgKTtcclxuICAgICAgICByZXR1cm4gdHJhbnNsYXRpb24ubXVsdCggcm90Lm11bHQoIHNjYWxlICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF0gK1wiLCBcIisgdGhpcy5kYXRhWzRdICtcIiwgXCIrIHRoaXMuZGF0YVs4XSArXCIsIFwiKyB0aGlzLmRhdGFbMTJdICtcIixcXG5cIiArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxXSArXCIsIFwiKyB0aGlzLmRhdGFbNV0gK1wiLCBcIisgdGhpcy5kYXRhWzldICtcIiwgXCIrIHRoaXMuZGF0YVsxM10gK1wiLFxcblwiICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzJdICtcIiwgXCIrIHRoaXMuZGF0YVs2XSArXCIsIFwiKyB0aGlzLmRhdGFbMTBdICtcIiwgXCIrIHRoaXMuZGF0YVsxNF0gK1wiLFxcblwiICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzNdICtcIiwgXCIrIHRoaXMuZGF0YVs3XSArXCIsIFwiKyB0aGlzLmRhdGFbMTFdICtcIiwgXCIrIHRoaXMuZGF0YVsxNV07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgbWF0cml4IGFzIGFuIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2xpY2UoIDAgKTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXQ0NDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVjMyA9IHJlcXVpcmUoJy4vVmVjMycpLFxyXG4gICAgICAgIE1hdDMzID0gcmVxdWlyZSgnLi9NYXQzMycpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgUXVhdGVybmlvbiBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgUXVhdGVybmlvblxyXG4gICAgICogQGNsYXNzZGVzYyBBIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIGFuIG9yaWVudGF0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBRdWF0ZXJuaW9uKCkge1xyXG4gICAgICAgIHN3aXRjaCAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9yIFF1YXRlcm5pb24gYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHZhciBhcmd1bWVudCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIGlmICggYXJndW1lbnQudyAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50Lnc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBhcmd1bWVudFswXSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50WzBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLncgPSAxLjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudC54IHx8IGFyZ3VtZW50WzFdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50LnkgfHwgYXJndW1lbnRbMl0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnQueiB8fCBhcmd1bWVudFszXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgLy8gaW5kaXZpZHVhbCBjb21wb25lbnQgYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudHNbM107XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMudyA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcXVhdGVybmlvbiB0aGF0IHJlcHJlc2VudHMgYW4gb3JlaW50YXRpb24gbWF0Y2hpbmdcclxuICAgICAqIHRoZSBpZGVudGl0eSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgaWRlbnRpdHkgcXVhdGVybmlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5pZGVudGl0eSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbiggMSwgMCwgMCwgMCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBuZXcgUXVhdGVybmlvbiB3aXRoIGVhY2ggY29tcG9uZW50IG5lZ2F0ZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgbmVnYXRlZCBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICAgUXVhdGVybmlvbi5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKCAtdGhpcy53LCAtdGhpcy54LCAtdGhpcy55LCAtdGhpcy56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uY2F0ZW5hdGVzIHRoZSByb3RhdGlvbnMgb2YgdGhlIHR3byBxdWF0ZXJuaW9ucywgcmV0dXJuaW5nXHJcbiAgICAgKiBhIG5ldyBRdWF0ZXJuaW9uIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtRdWF0ZXJuaW9ufEFycmF5fSB0aGF0IC0gVGhlIHF1YXRlcmlvbiB0byBjb25jYXRlbmF0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIHJlc3VsdGluZyBjb25jYXRlbmF0ZWQgcXVhdGVybmlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHRoYXQgPSAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApID8gbmV3IFF1YXRlcm5pb24oIHRoYXQgKSA6IHRoYXQ7XHJcbiAgICAgICAgdmFyIHcgPSAodGhhdC53ICogdGhpcy53KSAtICh0aGF0LnggKiB0aGlzLngpIC0gKHRoYXQueSAqIHRoaXMueSkgLSAodGhhdC56ICogdGhpcy56KSxcclxuICAgICAgICAgICAgeCA9IHRoaXMueSp0aGF0LnogLSB0aGlzLnoqdGhhdC55ICsgdGhpcy53KnRoYXQueCArIHRoaXMueCp0aGF0LncsXHJcbiAgICAgICAgICAgIHkgPSB0aGlzLnoqdGhhdC54IC0gdGhpcy54KnRoYXQueiArIHRoaXMudyp0aGF0LnkgKyB0aGlzLnkqdGhhdC53LFxyXG4gICAgICAgICAgICB6ID0gdGhpcy54KnRoYXQueSAtIHRoaXMueSp0aGF0LnggKyB0aGlzLncqdGhhdC56ICsgdGhpcy56KnRoYXQudztcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oIHcsIHgsIHksIHogKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBsaWVzIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcXVhdGVybmlvbiBhcyBhIHJvdGF0aW9uXHJcbiAgICAgKiBtYXRyaXggdG8gdGhlIHByb3ZpZGVkIHZlY3RvciwgcmV0dXJuaW5nIGEgbmV3IFZlYzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gcm90YXRlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgcmVzdWx0aW5nIHJvdGF0ZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB0aGF0ID0gKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSA/IG5ldyBWZWMzKCB0aGF0ICkgOiB0aGF0O1xyXG4gICAgICAgIHZhciB2cSA9IG5ldyBRdWF0ZXJuaW9uKCAwLCB0aGF0LngsIHRoYXQueSwgdGhhdC56ICksXHJcbiAgICAgICAgICAgIHIgPSB0aGlzLm11bHQoIHZxICkubXVsdCggdGhpcy5pbnZlcnNlKCkgKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHIueCwgci55LCByLnogKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSByb3RhdGlvbiBtYXRyaXggdGhhdCB0aGUgcXVhdGVybmlvbiByZXByZXNlbnRzLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSByb3RhdGlvbiBtYXRyaXggcmVwcmVzZW50ZWQgYnkgdGhlIHF1YXRlcm5pb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLm1hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB4eCA9IHRoaXMueCp0aGlzLngsXHJcbiAgICAgICAgICAgIHl5ID0gdGhpcy55KnRoaXMueSxcclxuICAgICAgICAgICAgenogPSB0aGlzLnoqdGhpcy56LFxyXG4gICAgICAgICAgICB4eSA9IHRoaXMueCp0aGlzLnksXHJcbiAgICAgICAgICAgIHh6ID0gdGhpcy54KnRoaXMueixcclxuICAgICAgICAgICAgeHcgPSB0aGlzLngqdGhpcy53LFxyXG4gICAgICAgICAgICB5eiA9IHRoaXMueSp0aGlzLnosXHJcbiAgICAgICAgICAgIHl3ID0gdGhpcy55KnRoaXMudyxcclxuICAgICAgICAgICAgencgPSB0aGlzLnoqdGhpcy53O1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0MzMoW1xyXG4gICAgICAgICAgICAxIC0gMip5eSAtIDIqenosIDIqeHkgKyAyKnp3LCAyKnh6IC0gMip5dyxcclxuICAgICAgICAgICAgMip4eSAtIDIqencsIDEgLSAyKnh4IC0gMip6eiwgMip5eiArIDIqeHcsXHJcbiAgICAgICAgICAgIDIqeHogKyAyKnl3LCAyKnl6IC0gMip4dywgMSAtIDIqeHggLSAyKnl5IF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24gZGVmaW5lZCBieSBhbiBheGlzXHJcbiAgICAgKiBhbmQgYW4gYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIGRlZ3JlZXMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucm90YXRpb25EZWdyZWVzID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIHJldHVybiBRdWF0ZXJuaW9uLnJvdGF0aW9uUmFkaWFucyggYW5nbGUgKiAoIE1hdGguUEkvMTgwICksIGF4aXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uIGRlZmluZWQgYnkgYW4gYXhpc1xyXG4gICAgICogYW5kIGFuIGFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiByYWRpYW5zLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnJvdGF0aW9uUmFkaWFucyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICBpZiAoIGF4aXMgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgYXhpcyA9IG5ldyBWZWMzKCBheGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIG5vcm1hbGl6ZSBhcmd1bWVudHNcclxuICAgICAgICBheGlzID0gYXhpcy5ub3JtYWxpemUoKTtcclxuICAgICAgICAvLyBzZXQgcXVhdGVybmlvbiBmb3IgdGhlIGVxdWl2b2xlbnQgcm90YXRpb25cclxuICAgICAgICB2YXIgbW9kQW5nbGUgPSAoIGFuZ2xlID4gMCApID8gYW5nbGUgJSAoMipNYXRoLlBJKSA6IGFuZ2xlICUgKC0yKk1hdGguUEkpLFxyXG4gICAgICAgICAgICBzaW5hID0gTWF0aC5zaW4oIG1vZEFuZ2xlLzIgKSxcclxuICAgICAgICAgICAgY29zYSA9IE1hdGguY29zKCBtb2RBbmdsZS8yICk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKFxyXG4gICAgICAgICAgICBjb3NhLFxyXG4gICAgICAgICAgICBheGlzLnggKiBzaW5hLFxyXG4gICAgICAgICAgICBheGlzLnkgKiBzaW5hLFxyXG4gICAgICAgICAgICBheGlzLnogKiBzaW5hICkubm9ybWFsaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHF1YXRlcm5pb24gdGhhdCBoYXMgYmVlbiBzcGhlcmljYWxseSBpbnRlcnBvbGF0ZWQgYmV0d2VlblxyXG4gICAgICogdHdvIHByb3ZpZGVkIHF1YXRlcm5pb25zIGZvciBhIGdpdmVuIHQgdmFsdWUuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7UXVhdGVybmlvbn0gZnJvbVJvdCAtIFRoZSByb3RhdGlvbiBhdCB0ID0gMC5cclxuICAgICAqIEBwYXJhbSB7UXVhdGVybmlvbn0gdG9Sb3QgLSBUaGUgcm90YXRpb24gYXQgdCA9IDEuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCAtIFRoZSB0IHZhbHVlLCBmcm9tIDAgdG8gMS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSBpbnRlcnBvbGF0ZWQgcm90YXRpb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24uc2xlcnAgPSBmdW5jdGlvbiggZnJvbVJvdCwgdG9Sb3QsIHQgKSB7XHJcbiAgICAgICAgaWYgKCBmcm9tUm90IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIGZyb21Sb3QgPSBuZXcgUXVhdGVybmlvbiggZnJvbVJvdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRvUm90IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRvUm90ID0gbmV3IFF1YXRlcm5pb24oIHRvUm90ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBhbmdsZSBiZXR3ZWVuXHJcbiAgICAgICAgdmFyIGNvc0hhbGZUaGV0YSA9ICggZnJvbVJvdC53ICogdG9Sb3QudyApICtcclxuICAgICAgICAgICAgKCBmcm9tUm90LnggKiB0b1JvdC54ICkgK1xyXG4gICAgICAgICAgICAoIGZyb21Sb3QueSAqIHRvUm90LnkgKSArXHJcbiAgICAgICAgICAgICggZnJvbVJvdC56ICogdG9Sb3QueiApO1xyXG4gICAgICAgIC8vIGlmIGZyb21Sb3Q9dG9Sb3Qgb3IgZnJvbVJvdD0tdG9Sb3QgdGhlbiB0aGV0YSA9IDAgYW5kIHdlIGNhbiByZXR1cm4gZnJvbVxyXG4gICAgICAgIGlmICggTWF0aC5hYnMoIGNvc0hhbGZUaGV0YSApID49IDEgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QudyxcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QueCxcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QueSxcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QueiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb3NIYWxmVGhldGEgbXVzdHkgYmUgcG9zaXRpdmUgdG8gcmV0dXJuIHRoZSBzaG9ydGVzdCBhbmdsZVxyXG4gICAgICAgIGlmICggY29zSGFsZlRoZXRhIDwgMCApIHtcclxuICAgICAgICAgICAgZnJvbVJvdCA9IGZyb21Sb3QubmVnYXRlKCk7XHJcbiAgICAgICAgICAgIGNvc0hhbGZUaGV0YSA9IC1jb3NIYWxmVGhldGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoYWxmVGhldGEgPSBNYXRoLmFjb3MoIGNvc0hhbGZUaGV0YSApO1xyXG4gICAgICAgIHZhciBzaW5IYWxmVGhldGEgPSBNYXRoLnNxcnQoIDEgLSBjb3NIYWxmVGhldGEgKiBjb3NIYWxmVGhldGEgKTtcclxuXHJcbiAgICAgICAgdmFyIHNjYWxlRnJvbSA9IE1hdGguc2luKCAoIDEuMCAtIHQgKSAqIGhhbGZUaGV0YSApIC8gc2luSGFsZlRoZXRhO1xyXG4gICAgICAgIHZhciBzY2FsZVRvID0gTWF0aC5zaW4oIHQgKiBoYWxmVGhldGEgKSAvIHNpbkhhbGZUaGV0YTtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oXHJcbiAgICAgICAgICAgIGZyb21Sb3QudyAqIHNjYWxlRnJvbSArIHRvUm90LncgKiBzY2FsZVRvLFxyXG4gICAgICAgICAgICBmcm9tUm90LnggKiBzY2FsZUZyb20gKyB0b1JvdC54ICogc2NhbGVUbyxcclxuICAgICAgICAgICAgZnJvbVJvdC55ICogc2NhbGVGcm9tICsgdG9Sb3QueSAqIHNjYWxlVG8sXHJcbiAgICAgICAgICAgIGZyb21Sb3QueiAqIHNjYWxlRnJvbSArIHRvUm90LnogKiBzY2FsZVRvICk7XHJcbiAgICAgICAgLypcclxuICAgICAgICAvLyBjYWxjdWxhdGUgYW5nbGUgYmV0d2VlblxyXG4gICAgICAgIHZhciBjb3NIYWxmVGhldGEgPSAoIGZyb21Sb3QudyAqIHRvUm90LncgKSArXHJcbiAgICAgICAgICAgICggZnJvbVJvdC54ICogdG9Sb3QueCApICtcclxuICAgICAgICAgICAgKCBmcm9tUm90LnkgKiB0b1JvdC55ICkgK1xyXG4gICAgICAgICAgICAoIGZyb21Sb3QueiAqIHRvUm90LnogKTtcclxuICAgICAgICAvLyBjb3NIYWxmVGhldGEgbXVzdHkgYmUgcG9zaXRpdmUgdG8gcmV0dXJuIHRoZSBzaG9ydGVzdCBhbmdsZVxyXG4gICAgICAgIGlmICggY29zSGFsZlRoZXRhIDwgMCApIHtcclxuICAgICAgICAgICAgZnJvbVJvdCA9IGZyb21Sb3QubmVnYXRlKCk7XHJcbiAgICAgICAgICAgIGNvc0hhbGZUaGV0YSA9IC1jb3NIYWxmVGhldGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIGZyb21Sb3Q9dG9Sb3Qgb3IgZnJvbVJvdD0tdG9Sb3QgdGhlbiB0aGV0YSA9IDAgYW5kIHdlIGNhbiByZXR1cm4gZnJvbVxyXG4gICAgICAgIGlmICggTWF0aC5hYnMoIGNvc0hhbGZUaGV0YSApID49IDEgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QudyxcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QueCxcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QueSxcclxuICAgICAgICAgICAgICAgIGZyb21Sb3QueiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgdGVtcG9yYXJ5IHZhbHVlcy5cclxuICAgICAgICB2YXIgaGFsZlRoZXRhID0gTWF0aC5hY29zKCBjb3NIYWxmVGhldGEgKTtcclxuICAgICAgICB2YXIgc2luSGFsZlRoZXRhID0gTWF0aC5zcXJ0KCAxIC0gY29zSGFsZlRoZXRhICogY29zSGFsZlRoZXRhICk7XHJcbiAgICAgICAgLy8gaWYgdGhldGEgPSAxODAgZGVncmVlcyB0aGVuIHJlc3VsdCBpcyBub3QgZnVsbHkgZGVmaW5lZFxyXG4gICAgICAgIC8vIHdlIGNvdWxkIHJvdGF0ZSBhcm91bmQgYW55IGF4aXMgbm9ybWFsIHRvICdmcm9tUm90JyBvciAndG9Sb3QnXHJcbiAgICAgICAgaWYgKCBNYXRoLmFicyggc2luSGFsZlRoZXRhICkgPCAwLjAwMDEgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihcclxuICAgICAgICAgICAgICAgIDAuNSAqICggZnJvbVJvdC53ICsgdG9Sb3QudyApLFxyXG4gICAgICAgICAgICAgICAgMC41ICogKCBmcm9tUm90LnggKyB0b1JvdC54ICksXHJcbiAgICAgICAgICAgICAgICAwLjUgKiAoIGZyb21Sb3QueSArIHRvUm90LnkgKSxcclxuICAgICAgICAgICAgICAgIDAuNSAqICggZnJvbVJvdC56ICsgdG9Sb3QueiApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYXRpb0EgPSBNYXRoLnNpbiggKCAxIC0gdCApICogaGFsZlRoZXRhICkgLyBzaW5IYWxmVGhldGE7XHJcbiAgICAgICAgdmFyIHJhdGlvQiA9IE1hdGguc2luKCB0ICogaGFsZlRoZXRhICkgLyBzaW5IYWxmVGhldGE7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKFxyXG4gICAgICAgICAgICBmcm9tUm90LncgKiByYXRpb0EgKyB0b1JvdC53ICogcmF0aW9CLFxyXG4gICAgICAgICAgICBmcm9tUm90LnggKiByYXRpb0EgKyB0b1JvdC54ICogcmF0aW9CLFxyXG4gICAgICAgICAgICBmcm9tUm90LnkgKiByYXRpb0EgKyB0b1JvdC55ICogcmF0aW9CLFxyXG4gICAgICAgICAgICBmcm9tUm90LnogKiByYXRpb0EgKyB0b1JvdC56ICogcmF0aW9CICk7XHJcbiAgICAgICAgKi9cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgdmVjdG9yLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7UXVhdGVybmlvbnxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIGNhbGN1bGF0ZSB0aGUgZG90IHByb2R1Y3Qgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiggdGhhdCwgZXBzaWxvbiApIHtcclxuICAgICAgICB2YXIgdyA9IHRoYXQudyAhPT0gdW5kZWZpbmVkID8gdGhhdC53IDogdGhhdFswXSxcclxuICAgICAgICAgICAgeCA9IHRoYXQueCAhPT0gdW5kZWZpbmVkID8gdGhhdC54IDogdGhhdFsxXSxcclxuICAgICAgICAgICAgeSA9IHRoYXQueSAhPT0gdW5kZWZpbmVkID8gdGhhdC55IDogdGhhdFsyXSxcclxuICAgICAgICAgICAgeiA9IHRoYXQueiAhPT0gdW5kZWZpbmVkID8gdGhhdC56IDogdGhhdFszXTtcclxuICAgICAgICBlcHNpbG9uID0gZXBzaWxvbiA9PT0gdW5kZWZpbmVkID8gMCA6IGVwc2lsb247XHJcbiAgICAgICAgcmV0dXJuICggdGhpcy53ID09PSB3IHx8IE1hdGguYWJzKCB0aGlzLncgLSB3ICkgPD0gZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgICggdGhpcy54ID09PSB4IHx8IE1hdGguYWJzKCB0aGlzLnggLSB4ICkgPD0gZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgICggdGhpcy55ID09PSB5IHx8IE1hdGguYWJzKCB0aGlzLnkgLSB5ICkgPD0gZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgICggdGhpcy56ID09PSB6IHx8IE1hdGguYWJzKCB0aGlzLnogLSB6ICkgPD0gZXBzaWxvbiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBuZXcgUXVhdGVybmlvbiBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBxdWF0ZXJuaW9uIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbWFnID0gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy54KnRoaXMueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkqdGhpcy55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMueip0aGlzLnogK1xyXG4gICAgICAgICAgICAgICAgdGhpcy53KnRoaXMudyApO1xyXG4gICAgICAgIGlmICggbWFnICE9PSAwICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLncgLyBtYWcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggLyBtYWcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgLyBtYWcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnogLyBtYWcgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29uanVnYXRlIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIGNvbmp1Z2F0ZSBvZiB0aGUgcXVhdGVybmlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5wcm90b3R5cGUuY29uanVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbiggdGhpcy53LCAtdGhpcy54LCAtdGhpcy55LCAtdGhpcy56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgcXVhdGVybmlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBpbnZlcnNlIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uanVnYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJhbmRvbSBRdWF0ZXJuaW9uIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gQSByYW5kb20gdmVjdG9yIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBheGlzID0gVmVjMy5yYW5kb20oKS5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIHJldHVybiBRdWF0ZXJuaW9uLnJvdGF0aW9uUmFkaWFucyggYW5nbGUsIGF4aXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIiwgXCIgKyB0aGlzLnc7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVhdGVybmlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgcXVhdGVybmlvbiBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbICB0aGlzLncsIHRoaXMueCwgdGhpcy55LCB0aGlzLnogXTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBRdWF0ZXJuaW9uO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSggJy4vVmVjMycgKSxcclxuICAgICAgICBNYXQzMyA9IHJlcXVpcmUoICcuL01hdDMzJyApLFxyXG4gICAgICAgIE1hdDQ0ID0gcmVxdWlyZSggJy4vTWF0NDQnICk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBUcmFuc2Zvcm0gb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFRyYW5zZm9ybVxyXG4gICAgICogQGNsYXNzZGVzYyBBIHRyYW5zZm9ybSByZXByZXNlbnRpbmcgYW4gb3JpZW50YXRpb24sIHBvc2l0aW9uLCBhbmQgc2NhbGUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFRyYW5zZm9ybSggdGhhdCApIHtcclxuICAgICAgICB0aGF0ID0gdGhhdCB8fCB7fTtcclxuICAgICAgICBpZiAoIHRoYXQuX3VwICYmXHJcbiAgICAgICAgICAgIHRoYXQuX2ZvcndhcmQgJiZcclxuICAgICAgICAgICAgdGhhdC5fbGVmdCAmJlxyXG4gICAgICAgICAgICB0aGF0Ll9vcmlnaW4gJiZcclxuICAgICAgICAgICAgdGhhdC5fc2NhbGUgKSB7XHJcbiAgICAgICAgICAgIC8vIGNvcHkgVHJhbnNmb3JtIGJ5IHZhbHVlXHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gdGhhdC51cCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gdGhhdC5mb3J3YXJkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSB0aGF0LmxlZnQoKTtcclxuICAgICAgICAgICAgdGhpcy5fb3JpZ2luID0gdGhhdC5vcmlnaW4oKTtcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGUgPSB0aGF0LnNjYWxlKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdGhhdC5kYXRhICYmIHRoYXQuZGF0YSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBNYXQzMyBvciBNYXQ0NCwgZXh0cmFjdCB0cmFuc2Zvcm0gY29tcG9uZW50cyBmcm9tIE1hdDQ0XHJcbiAgICAgICAgICAgIHRoYXQgPSB0aGF0LmRlY29tcG9zZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl91cCA9IHRoYXQudXA7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSB0aGF0LmZvcndhcmQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSB0aGF0LmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlID0gdGhhdC5zY2FsZTtcclxuICAgICAgICAgICAgdGhpcy5fb3JpZ2luID0gdGhhdC5vcmlnaW4gfHwgbmV3IFZlYzMoIDAsIDAsIDAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGlkZW50aXR5XHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gdGhhdC51cCA/IG5ldyBWZWMzKCB0aGF0LnVwICkubm9ybWFsaXplKCkgOiBuZXcgVmVjMyggMCwgMSwgMCApO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gdGhhdC5mb3J3YXJkID8gbmV3IFZlYzMoIHRoYXQuZm9yd2FyZCApLm5vcm1hbGl6ZSgpIDogbmV3IFZlYzMoIDAsIDAsIDEgKTtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IHRoYXQubGVmdCA/IG5ldyBWZWMzKCB0aGF0LmxlZnQgKS5ub3JtYWxpemUoKSA6IHRoaXMuX3VwLmNyb3NzKCB0aGlzLl9mb3J3YXJkICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luKCB0aGF0Lm9yaWdpbiB8fCBuZXcgVmVjMyggMCwgMCwgMCApICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGUoIHRoYXQuc2NhbGUgfHwgbmV3IFZlYzMoIDEsIDEsIDEgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gaWRlbnRpdHkgdHJhbnNmb3JtLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IEFuIGlkZW50aXR5IHRyYW5zZm9ybS5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLmlkZW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm0oe1xyXG4gICAgICAgICAgICB1cDogbmV3IFZlYzMoIDAsIDEsIDAgKSxcclxuICAgICAgICAgICAgZm9yd2FyZDogbmV3IFZlYzMoIDAsIDAsIDEgKSxcclxuICAgICAgICAgICAgbGVmdDogbmV3IFZlYzMoIDEsIDAsIDAgKSxcclxuICAgICAgICAgICAgb3JpZ2luOiBuZXcgVmVjMyggMCwgMCwgMCApLFxyXG4gICAgICAgICAgICBzY2FsZTogbmV3IFZlYzMoIDEsIDEsIDEgKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCBzZXRzIHRoZSBvcmlnaW4sIG90aGVyd2lzZSByZXR1cm5zIHRoZVxyXG4gICAgICogb3JpZ2luIGJ5IHZhbHVlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIG9yaWdpbi4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN8VHJhbnNmb3JtfSBUaGUgb3JpZ2luLCBvciB0aGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5vcmlnaW4gPSBmdW5jdGlvbiggb3JpZ2luICkge1xyXG4gICAgICAgIGlmICggb3JpZ2luICkge1xyXG4gICAgICAgICAgICB0aGlzLl9vcmlnaW4gPSBuZXcgVmVjMyggb3JpZ2luICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMuX29yaWdpbiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCBzZXRzIHRoZSBmb3J3YXJkIHZlY3Rvciwgb3RoZXJ3aXNlIHJldHVybnNcclxuICAgICAqIHRoZSBmb3J3YXJkIHZlY3RvciBieSB2YWx1ZS4gV2hpbGUgc2V0dGluZywgYSByb3RhdGlvbiBtYXRyaXggZnJvbSB0aGVcclxuICAgICAqIG9yaWduYWwgZm9yd2FyZCB2ZWN0b3IgdG8gdGhlIG5ldyBpcyB1c2VkIHRvIHJvdGF0ZSBhbGwgb3RoZXIgYXhlcy5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IG9yaWdpbiAtIFRoZSBmb3J3YXJkIHZlY3Rvci4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN8VHJhbnNmb3JtfSBUaGUgZm9yd2FyZCB2ZWN0b3IsIG9yIHRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLmZvcndhcmQgPSBmdW5jdGlvbiggZm9yd2FyZCApIHtcclxuICAgICAgICBpZiAoIGZvcndhcmQgKSB7XHJcbiAgICAgICAgICAgIGlmICggZm9yd2FyZCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IG5ldyBWZWMzKCBmb3J3YXJkICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gZm9yd2FyZC5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcm90ID0gTWF0MzMucm90YXRpb25Gcm9tVG8oIHRoaXMuX2ZvcndhcmQsIGZvcndhcmQgKTtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZCA9IGZvcndhcmQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gcm90Lm11bHQoIHRoaXMuX3VwICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSByb3QubXVsdCggdGhpcy5fbGVmdCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLl9mb3J3YXJkICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHNldHMgdGhlIHVwIHZlY3Rvciwgb3RoZXJ3aXNlIHJldHVybnNcclxuICAgICAqIHRoZSB1cCB2ZWN0b3IgYnkgdmFsdWUuIFdoaWxlIHNldHRpbmcsIGEgcm90YXRpb24gbWF0cml4IGZyb20gdGhlXHJcbiAgICAgKiBvcmlnbmFsIHVwIHZlY3RvciB0byB0aGUgbmV3IGlzIHVzZWQgdG8gcm90YXRlIGFsbCBvdGhlciBheGVzLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIHVwIHZlY3Rvci4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN8VHJhbnNmb3JtfSBUaGUgdXAgdmVjdG9yLCBvciB0aGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS51cCA9IGZ1bmN0aW9uKCB1cCApIHtcclxuICAgICAgICBpZiAoIHVwICkge1xyXG4gICAgICAgICAgICBpZiAoIHVwIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICB1cCA9IG5ldyBWZWMzKCB1cCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXAgPSB1cC5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcm90ID0gTWF0MzMucm90YXRpb25Gcm9tVG8oIHRoaXMuX3VwLCB1cCApO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gcm90Lm11bHQoIHRoaXMuX2ZvcndhcmQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSB1cDtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IHJvdC5tdWx0KCB0aGlzLl9sZWZ0ICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMuX3VwICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHNldHMgdGhlIGxlZnQgdmVjdG9yLCBvdGhlcndpc2UgcmV0dXJuc1xyXG4gICAgICogdGhlIGxlZnQgdmVjdG9yIGJ5IHZhbHVlLiBXaGlsZSBzZXR0aW5nLCBhIHJvdGF0aW9uIG1hdHJpeCBmcm9tIHRoZVxyXG4gICAgICogb3JpZ25hbCBsZWZ0IHZlY3RvciB0byB0aGUgbmV3IGlzIHVzZWQgdG8gcm90YXRlIGFsbCBvdGhlciBheGVzLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIGxlZnQgdmVjdG9yLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM3xUcmFuc2Zvcm19IFRoZSBsZWZ0IHZlY3Rvciwgb3IgdGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUubGVmdCA9IGZ1bmN0aW9uKCBsZWZ0ICkge1xyXG4gICAgICAgIGlmICggbGVmdCApIHtcclxuICAgICAgICAgICAgaWYgKCBsZWZ0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbmV3IFZlYzMoIGxlZnQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBsZWZ0Lm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBNYXQzMy5yb3RhdGlvbkZyb21UbyggdGhpcy5fbGVmdCwgbGVmdCApO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gcm90Lm11bHQoIHRoaXMuX2ZvcndhcmQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSByb3QubXVsdCggdGhpcy5fdXAgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMuX2xlZnQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBhbiBhcmd1bWVudCBpcyBwcm92aWRlZCwgc2V0cyB0aGUgc2FjbGUsIG90aGVyd2lzZSByZXR1cm5zIHRoZVxyXG4gICAgICogc2NhbGUgYnkgdmFsdWUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fG51bWJlcn0gc2NhbGUgLSBUaGUgc2NhbGUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfFRyYW5zZm9ybX0gVGhlIHNjYWxlLCBvciB0aGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uKCBzY2FsZSApIHtcclxuICAgICAgICBpZiAoIHNjYWxlICkge1xyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzY2FsZSA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlID0gbmV3IFZlYzMoIHNjYWxlLCBzY2FsZSwgc2NhbGUgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlID0gbmV3IFZlYzMoIHNjYWxlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSB0cmFuc2Zvcm0gYnkgYW5vdGhlciB0cmFuc2Zvcm0gb3IgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TWF0MzN8TWF0NDR8VHJhbnNmb3JtfEFycmF5fSB0aGF0IC0gVGhlIHRyYW5zZm9ybSB0byBtdWx0aXBseSB3aXRoLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSB8fFxyXG4gICAgICAgICAgICB0aGF0LmRhdGEgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgLy8gbWF0cml4IG9yIGFycmF5XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKCB0aGlzLm1hdHJpeCgpLm11bHQoIHRoYXQgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICByZXR1cm4gbmV3IFRyYW5zZm9ybSggdGhpcy5tYXRyaXgoKS5tdWx0KCB0aGF0Lm1hdHJpeCgpICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyBzY2FsZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgc2NhbGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnNjYWxlTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdDQ0LnNjYWxlKCB0aGlzLl9zY2FsZSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSdzIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUucm90YXRpb25NYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdC54LCB0aGlzLl9sZWZ0LnksIHRoaXMuX2xlZnQueiwgMCxcclxuICAgICAgICAgICAgdGhpcy5fdXAueCwgdGhpcy5fdXAueSwgdGhpcy5fdXAueiwgMCxcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZC54LCB0aGlzLl9mb3J3YXJkLnksIHRoaXMuX2ZvcndhcmQueiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyB0cmFuc2xhdGlvbiBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnRyYW5zbGF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdDQ0LnRyYW5zbGF0aW9uKCB0aGlzLl9vcmlnaW4gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyBhZmZpbmUtdHJhbnNmb3JtYXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGFmZmluZS10cmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUubWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gVCAqIFIgKiBTXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25NYXRyaXgoKVxyXG4gICAgICAgICAgICAubXVsdCggdGhpcy5yb3RhdGlvbk1hdHJpeCgpIClcclxuICAgICAgICAgICAgLm11bHQoIHRoaXMuc2NhbGVNYXRyaXgoKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIHRyYW5zZm9ybSdzIHNjYWxlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpbnZlcnNlIHNjYWxlIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlU2NhbGVNYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTWF0NDQuc2NhbGUoIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICAxL3RoaXMuX3NjYWxlLngsXHJcbiAgICAgICAgICAgIDEvdGhpcy5fc2NhbGUueSxcclxuICAgICAgICAgICAgMS90aGlzLl9zY2FsZS56ICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSB0cmFuc2Zvcm0ncyByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgaW52ZXJzZSByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVJvdGF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQueCwgdGhpcy5fdXAueCwgdGhpcy5fZm9yd2FyZC54LCAwLFxyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0LnksIHRoaXMuX3VwLnksIHRoaXMuX2ZvcndhcmQueSwgMCxcclxuICAgICAgICAgICAgdGhpcy5fbGVmdC56LCB0aGlzLl91cC56LCB0aGlzLl9mb3J3YXJkLnosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgdHJhbnNmb3JtJ3MgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGludmVyc2UgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLmludmVyc2VUcmFuc2xhdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNYXQ0NC50cmFuc2xhdGlvbiggdGhpcy5fb3JpZ2luLm5lZ2F0ZSgpICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgdHJhbnNmb3JtJ3MgYWZmaW5lLXRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpbnZlcnNlIGFmZmluZS10cmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZU1hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIFNeLTEgKiBSXi0xICogVF4tMVxyXG4gICAgICAgIHJldHVybiB0aGlzLmludmVyc2VTY2FsZU1hdHJpeCgpXHJcbiAgICAgICAgICAgIC5tdWx0KCB0aGlzLmludmVyc2VSb3RhdGlvbk1hdHJpeCgpIClcclxuICAgICAgICAgICAgLm11bHQoIHRoaXMuaW52ZXJzZVRyYW5zbGF0aW9uTWF0cml4KCkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyB2aWV3IG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSB2aWV3IG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS52aWV3TWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG5PcmlnaW4gPSB0aGlzLl9vcmlnaW4ubmVnYXRlKCksXHJcbiAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5fbGVmdC5uZWdhdGUoKSxcclxuICAgICAgICAgICAgYmFja3dhcmQgPSB0aGlzLl9mb3J3YXJkLm5lZ2F0ZSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoW1xyXG4gICAgICAgICAgICByaWdodC54LCB0aGlzLl91cC54LCBiYWNrd2FyZC54LCAwLFxyXG4gICAgICAgICAgICByaWdodC55LCB0aGlzLl91cC55LCBiYWNrd2FyZC55LCAwLFxyXG4gICAgICAgICAgICByaWdodC56LCB0aGlzLl91cC56LCBiYWNrd2FyZC56LCAwLFxyXG4gICAgICAgICAgICBuT3JpZ2luLmRvdCggcmlnaHQgKSwgbk9yaWdpbi5kb3QoIHRoaXMuX3VwICksIG5PcmlnaW4uZG90KCBiYWNrd2FyZCApLCAxIF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIHRyYW5zZm9ybSBpbiB3b3JsZCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRyYW5zbGF0aW9uIC0gVGhlIHRyYW5zbGF0aW9uIHZlY3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS50cmFuc2xhdGVXb3JsZCA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbiApIHtcclxuICAgICAgICB0aGlzLl9vcmlnaW4gPSB0aGlzLl9vcmlnaW4uYWRkKCB0cmFuc2xhdGlvbiApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIHRyYW5zZm9ybSBpbiBsb2NhbCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRyYW5zbGF0aW9uIC0gVGhlIHRyYW5zbGF0aW9uIHZlY3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS50cmFuc2xhdGVMb2NhbCA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbiApIHtcclxuICAgICAgICBpZiAoIHRyYW5zbGF0aW9uIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uID0gbmV3IFZlYzMoIHRyYW5zbGF0aW9uICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX29yaWdpbiA9IHRoaXMuX29yaWdpbi5hZGQoIHRoaXMuX2xlZnQubXVsdCggdHJhbnNsYXRpb24ueCApIClcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5fdXAubXVsdCggdHJhbnNsYXRpb24ueSApIClcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5fZm9yd2FyZC5tdWx0KCB0cmFuc2xhdGlvbi56ICkgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSb3RhdGVzIHRoZSB0cmFuc2Zvcm0gYnkgYW4gYW5nbGUgYXJvdW5kIGFuIGF4aXMgaW4gd29ybGQgc3BhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gZGVncmVlcy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5yb3RhdGVXb3JsZERlZ3JlZXMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRlV29ybGRSYWRpYW5zKCBhbmdsZSAqIE1hdGguUEkgLyAxODAsIGF4aXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSb3RhdGVzIHRoZSB0cmFuc2Zvcm0gYnkgYW4gYW5nbGUgYXJvdW5kIGFuIGF4aXMgaW4gd29ybGQgc3BhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gcmFkaWFucy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5yb3RhdGVXb3JsZFJhZGlhbnMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgdmFyIHJvdCA9IE1hdDMzLnJvdGF0aW9uUmFkaWFucyggYW5nbGUsIGF4aXMgKTtcclxuICAgICAgICB0aGlzLl91cCA9IHJvdC5tdWx0KCB0aGlzLl91cCApO1xyXG4gICAgICAgIHRoaXMuX2ZvcndhcmQgPSByb3QubXVsdCggdGhpcy5fZm9yd2FyZCApO1xyXG4gICAgICAgIHRoaXMuX2xlZnQgPSByb3QubXVsdCggdGhpcy5fbGVmdCApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJvdGF0ZXMgdGhlIHRyYW5zZm9ybSBieSBhbiBhbmdsZSBhcm91bmQgYW4gYXhpcyBpbiBsb2NhbCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiBkZWdyZWVzLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnJvdGF0ZUxvY2FsRGVncmVlcyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGVXb3JsZERlZ3JlZXMoIGFuZ2xlLCB0aGlzLnJvdGF0aW9uTWF0cml4KCkubXVsdCggYXhpcyApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUm90YXRlcyB0aGUgdHJhbnNmb3JtIGJ5IGFuIGFuZ2xlIGFyb3VuZCBhbiBheGlzIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIHJhZGlhbnMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gVGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUucm90YXRlTG9jYWxSYWRpYW5zID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZVdvcmxkUmFkaWFucyggYW5nbGUsIHRoaXMucm90YXRpb25NYXRyaXgoKS5tdWx0KCBheGlzICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFuc2Zvcm1zIHRoZSB2ZWN0b3Igb3IgbWF0cml4IGFyZ3VtZW50IGZyb20gdGhlIHRyYW5zZm9ybXMgbG9jYWwgc3BhY2VcclxuICAgICAqIHRvIHRoZSB3b3JsZCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxNYXQzM3xNYXQ0NH0gdGhhdCAtIFRoZSBhcmd1bWVudCB0byB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVNjYWxlIC0gV2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgc2NhbGUgaW4gdGhlIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWdub3JlUm90YXRpb24gLSBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIHRoZSByb3RhdGlvbiBpbiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZ25vcmVUcmFuc2xhdGlvbiAtIFdoZXRoZXIgb3Igbm90IHRvIGluY2x1ZGUgdGhlIHRyYW5zbGF0aW9uIGluIHRoZSB0cmFuc2Zvcm0uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gVGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUubG9jYWxUb1dvcmxkID0gZnVuY3Rpb24oIHRoYXQsIGlnbm9yZVNjYWxlLCBpZ25vcmVSb3RhdGlvbiwgaWdub3JlVHJhbnNsYXRpb24gKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpO1xyXG4gICAgICAgIGlmICggIWlnbm9yZVNjYWxlICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLnNjYWxlTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIWlnbm9yZVJvdGF0aW9uICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLnJvdGF0aW9uTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIWlnbm9yZVRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLnRyYW5zbGF0aW9uTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQubXVsdCggdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zZm9ybXMgdGhlIHZlY3RvciBvciBtYXRyaXggYXJndW1lbnQgZnJvbSB3b3JsZCBzcGFjZSB0byB0aGVcclxuICAgICAqIHRyYW5zZm9ybXMgbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8TWF0MzN8TWF0NDR9IHRoYXQgLSBUaGUgYXJndW1lbnQgdG8gdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZ25vcmVTY2FsZSAtIFdoZXRoZXIgb3Igbm90IHRvIGluY2x1ZGUgdGhlIHNjYWxlIGluIHRoZSB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVJvdGF0aW9uIC0gV2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgcm90YXRpb24gaW4gdGhlIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWdub3JlVHJhbnNsYXRpb24gLSBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIHRoZSB0cmFuc2xhdGlvbiBpbiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLndvcmxkVG9Mb2NhbCA9IGZ1bmN0aW9uKCB0aGF0LCBpZ25vcmVTY2FsZSwgaWdub3JlUm90YXRpb24sIGlnbm9yZVRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0NDQoKTtcclxuICAgICAgICBpZiAoICFpZ25vcmVUcmFuc2xhdGlvbiApIHtcclxuICAgICAgICAgICAgbWF0ID0gdGhpcy5pbnZlcnNlVHJhbnNsYXRpb25NYXRyaXgoKS5tdWx0KCBtYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhaWdub3JlUm90YXRpb24gKSB7XHJcbiAgICAgICAgICAgIG1hdCA9IHRoaXMuaW52ZXJzZVJvdGF0aW9uTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIWlnbm9yZVNjYWxlICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLmludmVyc2VTY2FsZU1hdHJpeCgpLm11bHQoIG1hdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0Lm11bHQoIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGFsbCBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgdHJhbnNmb3JtLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUcmFuc2Zvcm19IHRoYXQgLSBUaGUgbWF0cml4IHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdHJhbnNmb3JtIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWdpbi5lcXVhbHMoIHRoYXQub3JpZ2luKCksIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkLmVxdWFscyggdGhhdC5mb3J3YXJkKCksIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLl91cC5lcXVhbHMoIHRoYXQudXAoKSwgZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQuZXF1YWxzKCB0aGF0LmxlZnQoKSwgZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlLmVxdWFscyggdGhhdC5zY2FsZSgpLCBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHRyYW5zZm9ybSB3aXRoIGEgcmFuZG9tIG9yaWdpbiwgb3JpZW50YXRpb24sIGFuZCBzY2FsZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgcmFuZG9tIHRyYW5zZm9ybS5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKClcclxuICAgICAgICAgICAgLm9yaWdpbiggVmVjMy5yYW5kb20oKSApXHJcbiAgICAgICAgICAgIC5mb3J3YXJkKCBWZWMzLnJhbmRvbSgpIClcclxuICAgICAgICAgICAgLnNjYWxlKCBWZWMzLnJhbmRvbSgpICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYW5zZm9ybS5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hdHJpeCgpLnRvU3RyaW5nKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVHJhbnNmb3JtO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVjMyA9IHJlcXVpcmUoJy4vVmVjMycpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVHJpYW5nbGUgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFRyaWFuZ2xlXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgQ0NXLXdpbmRlZCB0cmlhbmdsZSBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFRyaWFuZ2xlKCkge1xyXG4gICAgICAgIHN3aXRjaCAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9yIG9iamVjdCBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYSA9IG5ldyBWZWMzKCBhcmdbMF0gfHwgYXJnLmEgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYiA9IG5ldyBWZWMzKCBhcmdbMV0gfHwgYXJnLmIgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYyA9IG5ldyBWZWMzKCBhcmdbMl0gfHwgYXJnLmMgKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIHZlY3RvciBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMuYSA9IG5ldyBWZWMzKCBhcmd1bWVudHNbMF0gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYiA9IG5ldyBWZWMzKCBhcmd1bWVudHNbMV0gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYyA9IG5ldyBWZWMzKCBhcmd1bWVudHNbMl0gKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gbmV3IFZlYzMoIDAsIDAsIDAgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYiA9IG5ldyBWZWMzKCAxLCAwLCAwICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmMgPSBuZXcgVmVjMyggMSwgMSwgMCApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgcmFkaXVzIG9mIHRoZSBib3VuZGluZyBzcGhlcmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyaWFuZ2xlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHJhZGl1cyBvZiB0aGUgYm91bmRpbmcgc3BoZXJlLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUucmFkaXVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGNlbnRyb2lkID0gdGhpcy5jZW50cm9pZCgpLFxyXG4gICAgICAgICAgICBhRGlzdCA9IHRoaXMuYS5zdWIoIGNlbnRyb2lkICkubGVuZ3RoKCksXHJcbiAgICAgICAgICAgIGJEaXN0ID0gdGhpcy5iLnN1YiggY2VudHJvaWQgKS5sZW5ndGgoKSxcclxuICAgICAgICAgICAgY0Rpc3QgPSB0aGlzLmMuc3ViKCBjZW50cm9pZCApLmxlbmd0aCgpO1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCggYURpc3QsIE1hdGgubWF4KCBiRGlzdCwgY0Rpc3QgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNlbnRyb2lkIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmlhbmdsZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBjZW50cm9pZCBvZiB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS5jZW50cm9pZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5iIClcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5jIClcclxuICAgICAgICAgICAgLmRpdiggMyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbCBvZiB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbm9ybWFsIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqL1xyXG4gICAgVHJpYW5nbGUucHJvdG90eXBlLm5vcm1hbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhYiA9IHRoaXMuYi5zdWIoIHRoaXMuYSApLFxyXG4gICAgICAgICAgICBhYyA9IHRoaXMuYy5zdWIoIHRoaXMuYSApO1xyXG4gICAgICAgIHJldHVybiBhYi5jcm9zcyggYWMgKS5ub3JtYWxpemUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFRyaWFuZ2xlIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFRyaWFuZ2xlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyaWFuZ2xlfSBBIHJhbmRvbSB0cmlhbmdsZSBvZiB1bml0IHJhZGl1cy5cclxuICAgICAqL1xyXG4gICAgVHJpYW5nbGUucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBWZWMzLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBiID0gVmVjMy5yYW5kb20oKSxcclxuICAgICAgICAgICAgYyA9IFZlYzMucmFuZG9tKCksXHJcbiAgICAgICAgICAgIGNlbnRyb2lkID0gYS5hZGQoIGIgKS5hZGQoIGMgKS5kaXYoIDMgKSxcclxuICAgICAgICAgICAgYUNlbnQgPSBhLnN1YiggY2VudHJvaWQgKSxcclxuICAgICAgICAgICAgYkNlbnQgPSBiLnN1YiggY2VudHJvaWQgKSxcclxuICAgICAgICAgICAgY0NlbnQgPSBjLnN1YiggY2VudHJvaWQgKSxcclxuICAgICAgICAgICAgYURpc3QgPSBhQ2VudC5sZW5ndGgoKSxcclxuICAgICAgICAgICAgYkRpc3QgPSBiQ2VudC5sZW5ndGgoKSxcclxuICAgICAgICAgICAgY0Rpc3QgPSBjQ2VudC5sZW5ndGgoKSxcclxuICAgICAgICAgICAgbWF4RGlzdCA9IE1hdGgubWF4KCBNYXRoLm1heCggYURpc3QsIGJEaXN0ICksIGNEaXN0ICksXHJcbiAgICAgICAgICAgIHNjYWxlID0gMSAvIG1heERpc3Q7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmlhbmdsZShcclxuICAgICAgICAgICAgYUNlbnQubXVsdCggc2NhbGUgKSxcclxuICAgICAgICAgICAgYkNlbnQubXVsdCggc2NhbGUgKSxcclxuICAgICAgICAgICAgY0NlbnQubXVsdCggc2NhbGUgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCB0cmlhbmdsZS5cclxuICAgICAqIEFuIG9wdGlvbmFsIGVwc2lsb24gdmFsdWUgbWF5IGJlIHByb3ZpZGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFRyaWFuZ2xlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUcmlhbmdsZX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gdGVzdCBlcXVhbGl0eSB3aXRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVwc2lsb24gLSBUaGUgZXBzaWxvbiB2YWx1ZS4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaC5cclxuICAgICAqL1xyXG4gICAgVHJpYW5nbGUucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICByZXR1cm4gdGhpcy5hLmVxdWFscyggdGhhdC5hLCBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgdGhpcy5iLmVxdWFscyggdGhhdC5iLCBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgdGhpcy5jLmVxdWFscyggdGhhdC5jLCBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFRyaWFuZ2xlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hLnRvU3RyaW5nKCkgKyBcIiwgXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmIudG9TdHJpbmcoKSArIFwiLCBcIiArXHJcbiAgICAgICAgICAgIHRoaXMuYy50b1N0cmluZygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRyaWFuZ2xlO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVmVjMiBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVmVjMlxyXG4gICAgICogQGNsYXNzZGVzYyBBIHR3byBjb21wb25lbnQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWZWMyKCkge1xyXG4gICAgICAgIHN3aXRjaCAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9yIFZlY04gYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHZhciBhcmd1bWVudCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50LnggfHwgYXJndW1lbnRbMF0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnQueSB8fCBhcmd1bWVudFsxXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgLy8gaW5kaXZpZHVhbCBjb21wb25lbnQgYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWMyIHdpdGggZWFjaCBjb21wb25lbnQgbmVnYXRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSBuZWdhdGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKCAtdGhpcy54LCAtdGhpcy55ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzJcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN1bS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN8VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gYWRkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfSBUaGUgc3VtIG9mIHRoZSB0d28gdmVjdG9ycy5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMiggdGhpcy54ICsgdGhhdFswXSwgdGhpcy55ICsgdGhhdFsxXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIHRoaXMueCArIHRoYXQueCwgdGhpcy55ICsgdGhhdC55ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3VidHJhY3RzIHRoZSBwcm92aWRlZCB2ZWN0b3IgYXJndW1lbnQgZnJvbSB0aGUgdmVjdG9yLCByZXR1cm5pbmcgYSBuZXcgVmVjMlxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZGlmZmVyZW5jZS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN8VmVjNHxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIHN1YnRyYWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIHZlY3RvcnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoIHRoaXMueCAtIHRoYXRbMF0sIHRoaXMueSAtIHRoYXRbMV0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKCB0aGlzLnggLSB0aGF0LngsIHRoaXMueSAtIHRoYXQueSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHZlY3RvciB3aXRoIHRoZSBwcm92aWRlZCBzY2FsYXIgYXJndW1lbnQsIHJldHVybmluZyBhIG5ldyBWZWMyXHJcbiAgICAgKiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIG11bHRpcGx5IHRoZSB2ZWN0b3IgYnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKCB0aGlzLnggKiB0aGF0LCB0aGlzLnkgKiB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzJcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gZGl2aWRlIHRoZSB2ZWN0b3IgYnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIHRoaXMueCAvIHRoYXQsIHRoaXMueSAvIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgdmVjdG9yIGFuZCB0aGUgcHJvdmlkZWRcclxuICAgICAqIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN8VmVjNHxBcnJheX0gLSBUaGUgb3RoZXIgdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBkb3QgcHJvZHVjdC5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXRbMF0gKSArICggdGhpcy55ICogdGhhdFsxXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0LnggKSArICggdGhpcy55ICogdGhhdC55ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyAyRCBjcm9zcyBwcm9kdWN0IG9mIHRoZSB2ZWN0b3IgYW5kIHRoZSBwcm92aWRlZFxyXG4gICAgICogdmVjdG9yIGFyZ3VtZW50LiBUaGlzIHZhbHVlIHJlcHJlc2VudHMgdGhlIG1hZ25pdHVkZSBvZiB0aGUgdmVjdG9yIHRoYXRcclxuICAgICAqIHdvdWxkIHJlc3VsdCBmcm9tIGEgcmVndWxhciAzRCBjcm9zcyBwcm9kdWN0IG9mIHRoZSBpbnB1dCB2ZWN0b3JzLFxyXG4gICAgICogdGFraW5nIHRoZWlyIFogdmFsdWVzIGFzIDAuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjMnxWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIG90aGVyIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgMkQgY3Jvc3MgcHJvZHVjdC5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuICggdGhpcy54ICogdGhhdFsxXSApIC0gKCB0aGlzLnkgKiB0aGF0WzBdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0LnkgKSAtICggdGhpcy55ICogdGhhdC54ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgbm8gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgc2NhbGFyIGxlbmd0aCBvZlxyXG4gICAgICogdGhlIHZlY3Rvci4gSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGEgbmV3XHJcbiAgICAgKiBWZWMyIHNjYWxlZCB0byB0aGUgcHJvdmlkZWQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgbGVuZ3RoIHRvIHNjYWxlIHRoZSB2ZWN0b3IgdG8uIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ8VmVjMn0gRWl0aGVyIHRoZSBsZW5ndGgsIG9yIG5ldyBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiggbGVuZ3RoICkge1xyXG4gICAgICAgIGlmICggbGVuZ3RoID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoIHRoaXMuZG90KCB0aGlzICkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKCkubXVsdCggbGVuZ3RoICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgdGhlIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLmxlbmd0aFNxdWFyZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb3QoIHRoaXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgdmVjdG9yLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjMnxWZWMzfFZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIHZhciB4ID0gdGhhdC54ICE9PSB1bmRlZmluZWQgPyB0aGF0LnggOiB0aGF0WzBdLFxyXG4gICAgICAgICAgICB5ID0gdGhhdC55ICE9PSB1bmRlZmluZWQgPyB0aGF0LnkgOiB0aGF0WzFdO1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggPT09IHggfHwgTWF0aC5hYnMoIHRoaXMueCAtIHggKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnkgPT09IHkgfHwgTWF0aC5hYnMoIHRoaXMueSAtIHkgKSA8PSBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWMyIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gVGhlIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYgKCBtYWcgIT09IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMihcclxuICAgICAgICAgICAgICAgIHRoaXMueCAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueSAvIG1hZyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFZlYzIgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfSBBIHJhbmRvbSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFZlYzIucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICkubm9ybWFsaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwiLCBcIiArIHRoaXMueTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZlY3RvciBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55IF07XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVjMjtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFZlYzMgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFZlYzNcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB0aHJlZSBjb21wb25lbnQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWZWMzKCkge1xyXG4gICAgICAgIHN3aXRjaCAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9yIFZlY04gYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHZhciBhcmd1bWVudCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50LnggfHwgYXJndW1lbnRbMF0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnQueSB8fCBhcmd1bWVudFsxXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudC56IHx8IGFyZ3VtZW50WzJdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGNvbXBvbmVudCBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWMzIHdpdGggZWFjaCBjb21wb25lbnQgbmVnYXRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBuZWdhdGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCAtdGhpcy54LCAtdGhpcy55LCAtdGhpcy56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzNcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN1bS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIGFkZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHN1bSBvZiB0aGUgdHdvIHZlY3RvcnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMueCArIHRoYXRbMF0sIHRoaXMueSArIHRoYXRbMV0sIHRoaXMueiArIHRoYXRbMl0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLnggKyB0aGF0LngsIHRoaXMueSArIHRoYXQueSwgdGhpcy56ICsgdGhhdC56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3VidHJhY3RzIHRoZSBwcm92aWRlZCB2ZWN0b3IgYXJndW1lbnQgZnJvbSB0aGUgdmVjdG9yLCByZXR1cm5pbmcgYSBuZXdcclxuICAgICAqIFZlYzMgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZGlmZmVyZW5jZS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIHZlY3RvciB0byBzdWJ0cmFjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIGRpZmZlcmVuY2Ugb2YgdGhlIHR3byB2ZWN0b3JzLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLnggLSB0aGF0WzBdLCB0aGlzLnkgLSB0aGF0WzFdLCB0aGlzLnogLSB0aGF0WzJdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyggdGhpcy54IC0gdGhhdC54LCB0aGlzLnkgLSB0aGF0LnksIHRoaXMueiAtIHRoYXQueiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHZlY3RvciB3aXRoIHRoZSBwcm92aWRlZCBzY2FsYXIgYXJndW1lbnQsIHJldHVybmluZyBhIG5ldyBWZWMzXHJcbiAgICAgKiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIG11bHRpcGx5IHRoZSB2ZWN0b3IgYnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLnggKiB0aGF0LCB0aGlzLnkgKiB0aGF0LCB0aGlzLnogKiB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzNcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gZGl2aWRlIHRoZSB2ZWN0b3IgYnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMueCAvIHRoYXQsIHRoaXMueSAvIHRoYXQsIHRoaXMueiAvIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgdmVjdG9yIGFuZCB0aGUgcHJvdmlkZWRcclxuICAgICAqIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIG90aGVyIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0WzBdICkgKyAoIHRoaXMueSAqIHRoYXRbMV0gKSArICggdGhpcy56ICogdGhhdFsyXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0LnggKSArICggdGhpcy55ICogdGhhdC55ICkgKyAoIHRoaXMueiAqIHRoYXQueiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIHZlY3RvciBhbmQgdGhlIHByb3ZpZGVkXHJcbiAgICAgKiB2ZWN0b3IgYXJndW1lbnQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fEFycmF5fSAtIFRoZSBvdGhlciB2ZWN0b3IgYXJndW1lbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIDJEIGNyb3NzIHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMyhcclxuICAgICAgICAgICAgICAgICggdGhpcy55ICogdGhhdFsyXSApIC0gKCB0aGF0WzFdICogdGhpcy56ICksXHJcbiAgICAgICAgICAgICAgICAoLXRoaXMueCAqIHRoYXRbMl0gKSArICggdGhhdFswXSAqIHRoaXMueiApLFxyXG4gICAgICAgICAgICAgICAgKCB0aGlzLnggKiB0aGF0WzFdICkgLSAoIHRoYXRbMF0gKiB0aGlzLnkgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgICggdGhpcy55ICogdGhhdC56ICkgLSAoIHRoYXQueSAqIHRoaXMueiApLFxyXG4gICAgICAgICAgICAoLXRoaXMueCAqIHRoYXQueiApICsgKCB0aGF0LnggKiB0aGlzLnogKSxcclxuICAgICAgICAgICAgKCB0aGlzLnggKiB0aGF0LnkgKSAtICggdGhhdC54ICogdGhpcy55ICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBubyBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBzY2FsYXIgbGVuZ3RoIG9mXHJcbiAgICAgKiB0aGUgdmVjdG9yLiBJZiBhbiBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYSBuZXdcclxuICAgICAqIFZlYzMgc2NhbGVkIHRvIHRoZSBwcm92aWRlZCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBsZW5ndGggdG8gc2NhbGUgdGhlIHZlY3RvciB0by4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcnxWZWMzfSBFaXRoZXIgdGhlIGxlbmd0aCwgb3IgbmV3IHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCBsZW5ndGggKSB7XHJcbiAgICAgICAgaWYgKCBsZW5ndGggPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguc3FydCggdGhpcy5kb3QoIHRoaXMgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0KCBsZW5ndGggKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3F1YXJlZCBsZW5ndGggb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUubGVuZ3RoU3F1YXJlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRvdCggdGhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCB2ZWN0b3IuXHJcbiAgICAgKiBBbiBvcHRpb25hbCBlcHNpbG9uIHZhbHVlIG1heSBiZSBwcm92aWRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIHZhciB4ID0gdGhhdC54ICE9PSB1bmRlZmluZWQgPyB0aGF0LnggOiB0aGF0WzBdLFxyXG4gICAgICAgICAgICB5ID0gdGhhdC55ICE9PSB1bmRlZmluZWQgPyB0aGF0LnkgOiB0aGF0WzFdLFxyXG4gICAgICAgICAgICB6ID0gdGhhdC56ICE9PSB1bmRlZmluZWQgPyB0aGF0LnogOiB0aGF0WzJdO1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggPT09IHggfHwgTWF0aC5hYnMoIHRoaXMueCAtIHggKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnkgPT09IHkgfHwgTWF0aC5hYnMoIHRoaXMueSAtIHkgKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnogPT09IHogfHwgTWF0aC5hYnMoIHRoaXMueiAtIHogKSA8PSBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWMzIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYgKCBtYWcgIT09IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMyhcclxuICAgICAgICAgICAgICAgIHRoaXMueCAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueSAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueiAvIG1hZyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFZlYzMgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBBIHJhbmRvbSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFZlYzMucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICkubm9ybWFsaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMuejtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZlY3RvciBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55LCB0aGlzLnogXTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZWMzO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVmVjNCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVmVjNFxyXG4gICAgICogQGNsYXNzZGVzYyBBIGZvdXIgY29tcG9uZW50IHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVmVjNCgpIHtcclxuICAgICAgICBzd2l0Y2ggKCBhcmd1bWVudHMubGVuZ3RoICkge1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAvLyBhcnJheSBvciBWZWNOIGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJndW1lbnQgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudC54IHx8IGFyZ3VtZW50WzBdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50LnkgfHwgYXJndW1lbnRbMV0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnQueiB8fCBhcmd1bWVudFsyXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudC53IHx8IGFyZ3VtZW50WzNdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGNvbXBvbmVudCBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWM0IHdpdGggZWFjaCBjb21wb25lbnQgbmVnYXRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBuZWdhdGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KCAtdGhpcy54LCAtdGhpcy55LCAtdGhpcy56LCAtdGhpcy53ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzRcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN1bS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWM0fEFycmF5fSB0aGF0IC0gVGhlIHZlY3RvciB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBzdW0gb2YgdGhlIHR3byB2ZWN0b3JzLlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy54ICsgdGhhdFswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMueSArIHRoYXRbMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnogKyB0aGF0WzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53ICsgdGhhdFszXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgIHRoaXMueCArIHRoYXQueCxcclxuICAgICAgICAgICAgdGhpcy55ICsgdGhhdC55LFxyXG4gICAgICAgICAgICB0aGlzLnogKyB0aGF0LnosXHJcbiAgICAgICAgICAgIHRoaXMudyArIHRoYXQudyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnRyYWN0cyB0aGUgcHJvdmlkZWQgdmVjdG9yIGFyZ3VtZW50IGZyb20gdGhlIHZlY3RvciwgcmV0dXJuaW5nIGEgbmV3IFZlYzRcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGRpZmZlcmVuY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjNHxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIHN1YnRyYWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIHZlY3RvcnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggLSB0aGF0WzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55IC0gdGhhdFsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMueiAtIHRoYXRbMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLncgLSB0aGF0WzNdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy54IC0gdGhhdC54LFxyXG4gICAgICAgICAgICB0aGlzLnkgLSB0aGF0LnksXHJcbiAgICAgICAgICAgIHRoaXMueiAtIHRoYXQueixcclxuICAgICAgICAgICAgdGhpcy53IC0gdGhhdC53ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzRcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgIHRoaXMueCAqIHRoYXQsXHJcbiAgICAgICAgICAgIHRoaXMueSAqIHRoYXQsXHJcbiAgICAgICAgICAgIHRoaXMueiAqIHRoYXQsXHJcbiAgICAgICAgICAgIHRoaXMudyAqIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgc2NhbGFyIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjNFxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBkaXZpZGUgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy54IC8gdGhhdCxcclxuICAgICAgICAgICAgdGhpcy55IC8gdGhhdCxcclxuICAgICAgICAgICAgdGhpcy56IC8gdGhhdCxcclxuICAgICAgICAgICAgdGhpcy53IC8gdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGRvdCBwcm9kdWN0IG9mIHRoZSB2ZWN0b3IgYW5kIHRoZSBwcm92aWRlZFxyXG4gICAgICogdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzR8QXJyYXl9IC0gVGhlIG90aGVyIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0WzBdICkgK1xyXG4gICAgICAgICAgICAgICAgKCB0aGlzLnkgKiB0aGF0WzFdICkgK1xyXG4gICAgICAgICAgICAgICAgKCB0aGlzLnogKiB0aGF0WzJdICkgK1xyXG4gICAgICAgICAgICAgICAgKCB0aGlzLncgKiB0aGF0WzNdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXQueCApICtcclxuICAgICAgICAgICAgKCB0aGlzLnkgKiB0aGF0LnkgKSArXHJcbiAgICAgICAgICAgICggdGhpcy56ICogdGhhdC56ICkgK1xyXG4gICAgICAgICAgICAoIHRoaXMudyAqIHRoYXQudyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIG5vIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHNjYWxhciBsZW5ndGggb2ZcclxuICAgICAqIHRoZSB2ZWN0b3IuIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBhIG5ld1xyXG4gICAgICogVmVjNCBzY2FsZWQgdG8gdGhlIHByb3ZpZGVkIGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIGxlbmd0aCB0byBzY2FsZSB0aGUgdmVjdG9yIHRvLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfFZlYzR9IEVpdGhlciB0aGUgbGVuZ3RoLCBvciBuZXcgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oIGxlbmd0aCApIHtcclxuICAgICAgICBpZiAoIGxlbmd0aCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCB0aGlzLmRvdCggdGhpcyApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHQoIGxlbmd0aCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS5sZW5ndGhTcXVhcmVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG90KCB0aGlzICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaCB0aG9zZSBvZiBhIHByb3ZpZGVkIHZlY3Rvci5cclxuICAgICAqIEFuIG9wdGlvbmFsIGVwc2lsb24gdmFsdWUgbWF5IGJlIHByb3ZpZGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIHZhciB4ID0gdGhhdC54ICE9PSB1bmRlZmluZWQgPyB0aGF0LnggOiB0aGF0WzBdLFxyXG4gICAgICAgICAgICB5ID0gdGhhdC55ICE9PSB1bmRlZmluZWQgPyB0aGF0LnkgOiB0aGF0WzFdLFxyXG4gICAgICAgICAgICB6ID0gdGhhdC56ICE9PSB1bmRlZmluZWQgPyB0aGF0LnogOiB0aGF0WzJdLFxyXG4gICAgICAgICAgICB3ID0gdGhhdC53ICE9PSB1bmRlZmluZWQgPyB0aGF0LncgOiB0aGF0WzNdO1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggPT09IHggfHwgTWF0aC5hYnMoIHRoaXMueCAtIHggKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnkgPT09IHkgfHwgTWF0aC5hYnMoIHRoaXMueSAtIHkgKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnogPT09IHogfHwgTWF0aC5hYnMoIHRoaXMueiAtIHogKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLncgPT09IHcgfHwgTWF0aC5hYnMoIHRoaXMudyAtIHcgKSA8PSBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWM0IG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYgKCBtYWcgIT09IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgICAgIHRoaXMueCAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueSAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueiAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMudyAvIG1hZyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFZlYzQgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBBIHJhbmRvbSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFZlYzQucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICkubm9ybWFsaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiLCBcIiArIHRoaXMudztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZlY3RvciBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyBdO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlYzQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgIE1hdDMzOiByZXF1aXJlKCcuL01hdDMzJyksXHJcbiAgICAgICAgTWF0NDQ6IHJlcXVpcmUoJy4vTWF0NDQnKSxcclxuICAgICAgICBWZWMyOiByZXF1aXJlKCcuL1ZlYzInKSxcclxuICAgICAgICBWZWMzOiByZXF1aXJlKCcuL1ZlYzMnKSxcclxuICAgICAgICBWZWM0OiByZXF1aXJlKCcuL1ZlYzMnKSxcclxuICAgICAgICBRdWF0ZXJuaW9uOiByZXF1aXJlKCcuL1F1YXRlcm5pb24nKSxcclxuICAgICAgICBUcmFuc2Zvcm06IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyksXHJcbiAgICAgICAgVHJpYW5nbGU6IHJlcXVpcmUoJy4vVHJpYW5nbGUnKVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS42LjNcbihmdW5jdGlvbigpIHtcbiAgdmFyIERlZmVycmVkLCBQRU5ESU5HLCBSRUpFQ1RFRCwgUkVTT0xWRUQsIFZFUlNJT04sIGFmdGVyLCBleGVjdXRlLCBmbGF0dGVuLCBoYXMsIGluc3RhbGxJbnRvLCBpc0FyZ3VtZW50cywgaXNQcm9taXNlLCB3cmFwLCBfd2hlbixcbiAgICBfX3NsaWNlID0gW10uc2xpY2U7XG5cbiAgVkVSU0lPTiA9ICczLjAuMCc7XG5cbiAgUEVORElORyA9IFwicGVuZGluZ1wiO1xuXG4gIFJFU09MVkVEID0gXCJyZXNvbHZlZFwiO1xuXG4gIFJFSkVDVEVEID0gXCJyZWplY3RlZFwiO1xuXG4gIGhhcyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCA/IG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSA6IHZvaWQgMDtcbiAgfTtcblxuICBpc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBoYXMob2JqLCAnbGVuZ3RoJykgJiYgaGFzKG9iaiwgJ2NhbGxlZScpO1xuICB9O1xuXG4gIGlzUHJvbWlzZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBoYXMob2JqLCAncHJvbWlzZScpICYmIHR5cGVvZiAob2JqICE9IG51bGwgPyBvYmoucHJvbWlzZSA6IHZvaWQgMCkgPT09ICdmdW5jdGlvbic7XG4gIH07XG5cbiAgZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgaWYgKGlzQXJndW1lbnRzKGFycmF5KSkge1xuICAgICAgcmV0dXJuIGZsYXR0ZW4oQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyYXkpKTtcbiAgICB9XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgICAgcmV0dXJuIFthcnJheV07XG4gICAgfVxuICAgIHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdmFsdWUpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVtby5jb25jYXQoZmxhdHRlbih2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgbWVtby5wdXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH0sIFtdKTtcbiAgfTtcblxuICBhZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgaWYgKHRpbWVzIDw9IDApIHtcbiAgICAgIHJldHVybiBmdW5jKCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgd3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncztcbiAgICAgIGFyZ3MgPSBbZnVuY10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICAgICAgcmV0dXJuIHdyYXBwZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICBleGVjdXRlID0gZnVuY3Rpb24oY2FsbGJhY2tzLCBhcmdzLCBjb250ZXh0KSB7XG4gICAgdmFyIGNhbGxiYWNrLCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgX3JlZiA9IGZsYXR0ZW4oY2FsbGJhY2tzKTtcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgY2FsbGJhY2sgPSBfcmVmW19pXTtcbiAgICAgIF9yZXN1bHRzLnB1c2goY2FsbGJhY2suY2FsbC5hcHBseShjYWxsYmFjaywgW2NvbnRleHRdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKSk7XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICBEZWZlcnJlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYW5kaWRhdGUsIGNsb3NlLCBjbG9zaW5nQXJndW1lbnRzLCBkb25lQ2FsbGJhY2tzLCBmYWlsQ2FsbGJhY2tzLCBwcm9ncmVzc0NhbGxiYWNrcywgc3RhdGU7XG4gICAgc3RhdGUgPSBQRU5ESU5HO1xuICAgIGRvbmVDYWxsYmFja3MgPSBbXTtcbiAgICBmYWlsQ2FsbGJhY2tzID0gW107XG4gICAgcHJvZ3Jlc3NDYWxsYmFja3MgPSBbXTtcbiAgICBjbG9zaW5nQXJndW1lbnRzID0ge1xuICAgICAgJ3Jlc29sdmVkJzoge30sXG4gICAgICAncmVqZWN0ZWQnOiB7fSxcbiAgICAgICdwZW5kaW5nJzoge31cbiAgICB9O1xuICAgIHRoaXMucHJvbWlzZSA9IGZ1bmN0aW9uKGNhbmRpZGF0ZSkge1xuICAgICAgdmFyIHBpcGUsIHN0b3JlQ2FsbGJhY2tzO1xuICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlIHx8IHt9O1xuICAgICAgY2FuZGlkYXRlLnN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH07XG4gICAgICBzdG9yZUNhbGxiYWNrcyA9IGZ1bmN0aW9uKHNob3VsZEV4ZWN1dGVJbW1lZGlhdGVseSwgaG9sZGVyLCBob2xkZXJTdGF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgICAgICAgICBob2xkZXIucHVzaC5hcHBseShob2xkZXIsIGZsYXR0ZW4oYXJndW1lbnRzKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzaG91bGRFeGVjdXRlSW1tZWRpYXRlbHkoKSkge1xuICAgICAgICAgICAgZXhlY3V0ZShhcmd1bWVudHMsIGNsb3NpbmdBcmd1bWVudHNbaG9sZGVyU3RhdGVdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBjYW5kaWRhdGUuZG9uZSA9IHN0b3JlQ2FsbGJhY2tzKChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlID09PSBSRVNPTFZFRDtcbiAgICAgIH0pLCBkb25lQ2FsbGJhY2tzLCBSRVNPTFZFRCk7XG4gICAgICBjYW5kaWRhdGUuZmFpbCA9IHN0b3JlQ2FsbGJhY2tzKChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlID09PSBSRUpFQ1RFRDtcbiAgICAgIH0pLCBmYWlsQ2FsbGJhY2tzLCBSRUpFQ1RFRCk7XG4gICAgICBjYW5kaWRhdGUucHJvZ3Jlc3MgPSBzdG9yZUNhbGxiYWNrcygoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZSAhPT0gUEVORElORztcbiAgICAgIH0pLCBwcm9ncmVzc0NhbGxiYWNrcywgUEVORElORyk7XG4gICAgICBjYW5kaWRhdGUuYWx3YXlzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfcmVmO1xuICAgICAgICByZXR1cm4gKF9yZWYgPSBjYW5kaWRhdGUuZG9uZS5hcHBseShjYW5kaWRhdGUsIGFyZ3VtZW50cykpLmZhaWwuYXBwbHkoX3JlZiwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBwaXBlID0gZnVuY3Rpb24oZG9uZUZpbHRlciwgZmFpbEZpbHRlciwgcHJvZ3Jlc3NGaWx0ZXIpIHtcbiAgICAgICAgdmFyIGZpbHRlciwgbWFzdGVyO1xuICAgICAgICBtYXN0ZXIgPSBuZXcgRGVmZXJyZWQoKTtcbiAgICAgICAgZmlsdGVyID0gZnVuY3Rpb24oc291cmNlLCBmdW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZVtzb3VyY2VdKG1hc3RlcltmdW5uZWxdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZVtzb3VyY2VdKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MsIHZhbHVlO1xuICAgICAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmRvbmUobWFzdGVyLnJlc29sdmUpLmZhaWwobWFzdGVyLnJlamVjdCkucHJvZ3Jlc3MobWFzdGVyLm5vdGlmeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gbWFzdGVyW2Z1bm5lbF0odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBmaWx0ZXIoJ2RvbmUnLCAncmVzb2x2ZScsIGRvbmVGaWx0ZXIpO1xuICAgICAgICBmaWx0ZXIoJ2ZhaWwnLCAncmVqZWN0JywgZmFpbEZpbHRlcik7XG4gICAgICAgIGZpbHRlcigncHJvZ3Jlc3MnLCAnbm90aWZ5JywgcHJvZ3Jlc3NGaWx0ZXIpO1xuICAgICAgICByZXR1cm4gbWFzdGVyO1xuICAgICAgfTtcbiAgICAgIGNhbmRpZGF0ZS5waXBlID0gcGlwZTtcbiAgICAgIGNhbmRpZGF0ZS50aGVuID0gcGlwZTtcbiAgICAgIGlmIChjYW5kaWRhdGUucHJvbWlzZSA9PSBudWxsKSB7XG4gICAgICAgIGNhbmRpZGF0ZS5wcm9taXNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfTtcbiAgICB0aGlzLnByb21pc2UodGhpcyk7XG4gICAgY2FuZGlkYXRlID0gdGhpcztcbiAgICBjbG9zZSA9IGZ1bmN0aW9uKGZpbmFsU3RhdGUsIGNhbGxiYWNrcywgY29udGV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgICBzdGF0ZSA9IGZpbmFsU3RhdGU7XG4gICAgICAgICAgY2xvc2luZ0FyZ3VtZW50c1tmaW5hbFN0YXRlXSA9IGFyZ3VtZW50cztcbiAgICAgICAgICBleGVjdXRlKGNhbGxiYWNrcywgY2xvc2luZ0FyZ3VtZW50c1tmaW5hbFN0YXRlXSwgY29udGV4dCk7XG4gICAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfTtcbiAgICB0aGlzLnJlc29sdmUgPSBjbG9zZShSRVNPTFZFRCwgZG9uZUNhbGxiYWNrcyk7XG4gICAgdGhpcy5yZWplY3QgPSBjbG9zZShSRUpFQ1RFRCwgZmFpbENhbGxiYWNrcyk7XG4gICAgdGhpcy5ub3RpZnkgPSBjbG9zZShQRU5ESU5HLCBwcm9ncmVzc0NhbGxiYWNrcyk7XG4gICAgdGhpcy5yZXNvbHZlV2l0aCA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHJldHVybiBjbG9zZShSRVNPTFZFRCwgZG9uZUNhbGxiYWNrcywgY29udGV4dCkuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfTtcbiAgICB0aGlzLnJlamVjdFdpdGggPSBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgICByZXR1cm4gY2xvc2UoUkVKRUNURUQsIGZhaWxDYWxsYmFja3MsIGNvbnRleHQpLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH07XG4gICAgdGhpcy5ub3RpZnlXaXRoID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgcmV0dXJuIGNsb3NlKFBFTkRJTkcsIHByb2dyZXNzQ2FsbGJhY2tzLCBjb250ZXh0KS5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIF93aGVuID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRlZiwgZGVmcywgZmluaXNoLCByZXNvbHV0aW9uQXJncywgdHJpZ2dlciwgX2ksIF9sZW47XG4gICAgZGVmcyA9IGZsYXR0ZW4oYXJndW1lbnRzKTtcbiAgICBpZiAoZGVmcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChpc1Byb21pc2UoZGVmc1swXSkpIHtcbiAgICAgICAgcmV0dXJuIGRlZnNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKG5ldyBEZWZlcnJlZCgpKS5yZXNvbHZlKGRlZnNbMF0pLnByb21pc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdHJpZ2dlciA9IG5ldyBEZWZlcnJlZCgpO1xuICAgIGlmICghZGVmcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnJlc29sdmUoKS5wcm9taXNlKCk7XG4gICAgfVxuICAgIHJlc29sdXRpb25BcmdzID0gW107XG4gICAgZmluaXNoID0gYWZ0ZXIoZGVmcy5sZW5ndGgsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRyaWdnZXIucmVzb2x2ZS5hcHBseSh0cmlnZ2VyLCByZXNvbHV0aW9uQXJncyk7XG4gICAgfSk7XG4gICAgZGVmcy5mb3JFYWNoKGZ1bmN0aW9uKGRlZiwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1Byb21pc2UoZGVmKSkge1xuICAgICAgICByZXR1cm4gZGVmLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgcmVzb2x1dGlvbkFyZ3NbaW5kZXhdID0gYXJncy5sZW5ndGggPiAxID8gYXJncyA6IGFyZ3NbMF07XG4gICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdXRpb25BcmdzW2luZGV4XSA9IGRlZjtcbiAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZGVmcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgZGVmID0gZGVmc1tfaV07XG4gICAgICBpc1Byb21pc2UoZGVmKSAmJiBkZWYuZmFpbCh0cmlnZ2VyLnJlamVjdCk7XG4gICAgfVxuICAgIHJldHVybiB0cmlnZ2VyLnByb21pc2UoKTtcbiAgfTtcblxuICBpbnN0YWxsSW50byA9IGZ1bmN0aW9uKGZ3KSB7XG4gICAgZncuRGVmZXJyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGVmZXJyZWQoKTtcbiAgICB9O1xuICAgIGZ3LmFqYXggPSB3cmFwKGZ3LmFqYXgsIGZ1bmN0aW9uKGFqYXgsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBjcmVhdGVXcmFwcGVyLCBkZWYsIHByb21pc2UsIHhocjtcbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuICAgICAgZGVmID0gbmV3IERlZmVycmVkKCk7XG4gICAgICBjcmVhdGVXcmFwcGVyID0gZnVuY3Rpb24od3JhcHBlZCwgZmluaXNoZXIpIHtcbiAgICAgICAgcmV0dXJuIHdyYXAod3JhcHBlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFyZ3MsIGZ1bmM7XG4gICAgICAgICAgZnVuYyA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICAgICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmaW5pc2hlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgb3B0aW9ucy5zdWNjZXNzID0gY3JlYXRlV3JhcHBlcihvcHRpb25zLnN1Y2Nlc3MsIGRlZi5yZXNvbHZlKTtcbiAgICAgIG9wdGlvbnMuZXJyb3IgPSBjcmVhdGVXcmFwcGVyKG9wdGlvbnMuZXJyb3IsIGRlZi5yZWplY3QpO1xuICAgICAgeGhyID0gYWpheChvcHRpb25zKTtcbiAgICAgIHByb21pc2UgPSBkZWYucHJvbWlzZSgpO1xuICAgICAgcHJvbWlzZS5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geGhyLmFib3J0KCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZ3LndoZW4gPSBfd2hlbjtcbiAgfTtcblxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy5EZWZlcnJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEZWZlcnJlZCgpO1xuICAgIH07XG4gICAgZXhwb3J0cy53aGVuID0gX3doZW47XG4gICAgZXhwb3J0cy5pbnN0YWxsSW50byA9IGluc3RhbGxJbnRvO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0eXBlb2YgWmVwdG8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBpbnN0YWxsSW50byhaZXB0byk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEZWZlcnJlZC53aGVuID0gX3doZW47XG4gICAgICAgIERlZmVycmVkLmluc3RhbGxJbnRvID0gaW5zdGFsbEludG87XG4gICAgICAgIHJldHVybiBEZWZlcnJlZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgWmVwdG8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaW5zdGFsbEludG8oWmVwdG8pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuRGVmZXJyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGVmZXJyZWQoKTtcbiAgICB9O1xuICAgIHRoaXMuRGVmZXJyZWQud2hlbiA9IF93aGVuO1xuICAgIHRoaXMuRGVmZXJyZWQuaW5zdGFsbEludG8gPSBpbnN0YWxsSW50bztcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcclxuICAgICAgICBSZW5kZXJUYXJnZXQgPSByZXF1aXJlKCcuL1JlbmRlclRhcmdldCcpLFxyXG4gICAgICAgIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4vVGV4dHVyZTJEJyksXHJcbiAgICAgICAgVGV4dHVyZUN1YmVNYXAgPSByZXF1aXJlKCcuL1RleHR1cmVDdWJlTWFwJyksXHJcbiAgICAgICAgVmlld3BvcnQgPSByZXF1aXJlKCcuL1ZpZXdwb3J0JyksXHJcbiAgICAgICAgQ2FtZXJhID0gcmVxdWlyZSgnLi4vcmVuZGVyL0NhbWVyYScpLFxyXG4gICAgICAgIEZBQ0VTID0gW1xyXG4gICAgICAgICAgICAnLXgnLCAnK3gnLFxyXG4gICAgICAgICAgICAnLXknLCAnK3knLFxyXG4gICAgICAgICAgICAnLXonLCAnK3onXHJcbiAgICAgICAgXSxcclxuICAgICAgICBGQUNFX1RBUkdFVFMgPSB7XHJcbiAgICAgICAgICAgICcreic6IFwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9aXCIsXHJcbiAgICAgICAgICAgICcteic6IFwiVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aXCIsXHJcbiAgICAgICAgICAgICcreCc6IFwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YXCIsXHJcbiAgICAgICAgICAgICcteCc6IFwiVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9YXCIsXHJcbiAgICAgICAgICAgICcreSc6IFwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZXCIsXHJcbiAgICAgICAgICAgICcteSc6IFwiVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIERFRkFVTFRfU0laRSA9IDIwNDg7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyBhIHBhcnRpY3VsYXIgZmFjZSBvZiB0aGUgY3ViZSBtYXAgcmVuZGVyVGFyZ2V0IGFuZCByZWFkaWVzIGl0IGZvclxyXG4gICAgICogcmVuZGVyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Q3ViZU1hcFJlbmRlclRhcmdldH0gY3ViZU1hcFRhcmdldCAtIFRoZSBjdWJlIG1hcCByZW5kZXJUYXJnZXQuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmFjZSAtIFRoZSBmYWNlIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYmluZEZhY2VUZXh0dXJlKCBjdWJlTWFwVGFyZ2V0LCBmYWNlICkge1xyXG4gICAgICAgIC8vIGJpbmQgcmVsZXZhbnQgZmFjZSBvZiBjdWJlIG1hcFxyXG4gICAgICAgIGN1YmVNYXBUYXJnZXQucmVuZGVyVGFyZ2V0LnNldENvbG9yVGFyZ2V0KFxyXG4gICAgICAgICAgICBjdWJlTWFwVGFyZ2V0LmN1YmVNYXAsXHJcbiAgICAgICAgICAgIEZBQ0VfVEFSR0VUU1sgZmFjZSBdICk7XHJcbiAgICAgICAgLy8gY2xlYXIgdGhlIGZhY2UgdGV4dHVyZVxyXG4gICAgICAgIGN1YmVNYXBUYXJnZXQucmVuZGVyVGFyZ2V0LmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgY2FtZXJhIG9iamVjdCBmb3IgdGhlIHByb3ZpZGVkIGZhY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZhY2UgLSBUaGUgZmFjZSBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IG9yaWdpbiAtIFRoZSBvcmlnaW4gb2YgdGhlIGN1YmUgbWFwLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDYW1lcmF9IFRoZSByZXN1bHRpbmcgY2FtZXJhLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRGYWNlQ2FtZXJhKCBmYWNlLCBvcmlnaW4gKSB7XHJcbiAgICAgICAgdmFyIGZvcndhcmQsXHJcbiAgICAgICAgICAgIHVwO1xyXG4gICAgICAgIC8vIHNldHVwIHRyYW5zZm9ybSBkZXBlbmRpbmcgb24gY3VycmVudCBmYWNlXHJcbiAgICAgICAgc3dpdGNoICggZmFjZSApIHtcclxuICAgICAgICAgICAgY2FzZSAnK3gnOlxyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IFsgMSwgMCwgMCBdO1xyXG4gICAgICAgICAgICAgICAgdXAgPSBbIDAsIC0xLCAwIF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnLXgnOlxyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IFsgLTEsIDAsIDAgXTtcclxuICAgICAgICAgICAgICAgIHVwID0gWyAwLCAtMSwgMCBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJyt5JzpcclxuICAgICAgICAgICAgICAgIGZvcndhcmQgPSBbIDAsIDEsIDAgXTtcclxuICAgICAgICAgICAgICAgIHVwID0gWyAwLCAwLCAxIF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnLXknOlxyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IFsgMCwgLTEsIDAgXTtcclxuICAgICAgICAgICAgICAgIHVwID0gWyAwLCAwLCAtMSBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJyt6JzpcclxuICAgICAgICAgICAgICAgIGZvcndhcmQgPSBbIDAsIDAsIDEgXTtcclxuICAgICAgICAgICAgICAgIHVwID0gWyAwLCAtMSwgMCBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJy16JzpcclxuICAgICAgICAgICAgICAgIGZvcndhcmQgPSBbIDAsIDAsIC0xIF07XHJcbiAgICAgICAgICAgICAgICB1cCA9IFsgMCwgLTEsIDAgXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IENhbWVyYSh7XHJcbiAgICAgICAgICAgIG9yaWdpbjogb3JpZ2luLFxyXG4gICAgICAgICAgICBmb3J3YXJkOiBmb3J3YXJkLFxyXG4gICAgICAgICAgICB1cDogdXAsXHJcbiAgICAgICAgICAgIHByb2plY3Rpb246IHtcclxuICAgICAgICAgICAgICAgIGZvdjogOTAsXHJcbiAgICAgICAgICAgICAgICBhc3BlY3Q6IDEsXHJcbiAgICAgICAgICAgICAgICB6TWluOiAxLFxyXG4gICAgICAgICAgICAgICAgek1heDogMTAwMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFRPRE86IHRlc3QgcGVyZm9ybWFuY2UgdnMgdXNpbmcgNiBGQk8ncywgZWFjaCBzaGFyaW5nIGEgc2luZ2xlIGRlcHRoXHJcbiAgICAgKiB0ZXh0dXJlLlxyXG4gICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBDdWJlTWFwUmVuZGVyVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBDdWJlTWFwUmVuZGVyVGFyZ2V0XHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgcmVuZGVyVGFyZ2V0IGNsYXNzIHRvIGFsbG93IHJlbmRlcmluZyB0byB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gQ3ViZU1hcFJlbmRlclRhcmdldCggc3BlYyApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuaWQgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMucmVzb2x1dGlvbiA9IHNwZWMucmVzb2x1dGlvbiB8fCBERUZBVUxUX1NJWkU7XHJcbiAgICAgICAgdGhpcy5kZXB0aFRleHR1cmUgPSBuZXcgVGV4dHVyZTJEKHtcclxuICAgICAgICAgICAgZm9ybWF0OiBcIkRFUFRIX0NPTVBPTkVOVFwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcIlVOU0lHTkVEX1NIT1JUXCIsXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlc29sdXRpb24sXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZXNvbHV0aW9uXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jdWJlTWFwID0gbmV3IFRleHR1cmVDdWJlTWFwKHtcclxuICAgICAgICAgICAgZGF0YTogbnVsbCxcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucmVzb2x1dGlvbixcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlc29sdXRpb25cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlclRhcmdldCA9IG5ldyBSZW5kZXJUYXJnZXQoKTtcclxuICAgICAgICB0aGlzLnJlbmRlclRhcmdldC5zZXREZXB0aFRhcmdldCggdGhpcy5kZXB0aFRleHR1cmUgKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0ID0gbmV3IFZpZXdwb3J0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgY3ViZSBtYXAgY29tcG9uZW50IGFuZCBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBzdGFjay5cclxuICAgICAqIEBtZW1iZXJvZiBDdWJlTWFwUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q3ViZU1hcFJlbmRlclRhcmdldH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgICBDdWJlTWFwUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oIGxvY2F0aW9uICkge1xyXG4gICAgICAgIHRoaXMuY3ViZU1hcC5wdXNoKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IGFuZCBiaW5kcyB0aGUgdGV4dHVyZSBiZW5lYXRoIGl0IG9uXHJcbiAgICAgKiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHRleHR1cmUsIHVuYmluZHMgdGhlIHVuaXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgQ3ViZU1hcFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0N1YmVNYXBSZW5kZXJUYXJnZXR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICAgQ3ViZU1hcFJlbmRlclRhcmdldC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oIGxvY2F0aW9uICkge1xyXG4gICAgICAgIHRoaXMuY3ViZU1hcC5wb3AoIGxvY2F0aW9uICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgQ3ViZU1hcFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIG9yaWdpbiBvZiB0aGUgY3ViZSBtYXAuXHJcbiAgICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byBleGVjdXRlLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVudGl0aWVzQnlUZWNobmlxdWUgLSBUaGUgZW50aXRpZXMga2V5ZWQgYnkgdGVjaG5pcXVlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDdWJlTWFwUmVuZGVyVGFyZ2V0fSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgQ3ViZU1hcFJlbmRlclRhcmdldC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oIG9yaWdpbiwgcmVuZGVyZXIsIGVudGl0aWVzQnlUZWNobmlxdWUgKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0LnB1c2goKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LnB1c2goIHRoaXMucmVzb2x1dGlvbiwgdGhpcy5yZXNvbHV0aW9uICk7XHJcbiAgICAgICAgRkFDRVMuZm9yRWFjaCggZnVuY3Rpb24oIGZhY2UgKSB7XHJcbiAgICAgICAgICAgIC8vIGJpbmQgZmFjZVxyXG4gICAgICAgICAgICBiaW5kRmFjZVRleHR1cmUoIHRoYXQsIGZhY2UgKTtcclxuICAgICAgICAgICAgLy8gcmVuZGVyIHNjZW5lXHJcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcihcclxuICAgICAgICAgICAgICAgIGdldEZhY2VDYW1lcmEoIGZhY2UsIG9yaWdpbiApLFxyXG4gICAgICAgICAgICAgICAgZW50aXRpZXNCeVRlY2huaXF1ZSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0LnBvcCgpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gQ3ViZU1hcFJlbmRlclRhcmdldDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhbiBJbmRleEJ1ZmZlciBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgSW5kZXhCdWZmZXJcclxuICAgICAqIEBjbGFzc2Rlc2MgQW4gaW5kZXggYnVmZmVyIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gSW5kZXhCdWZmZXIoIGFycmF5LCBvcHRpb25zICkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5pZCA9IDA7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSAoIG9wdGlvbnMub2Zmc2V0ICE9PSB1bmRlZmluZWQgKSA/IG9wdGlvbnMub2Zmc2V0IDogMDtcclxuICAgICAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgXCJUUklBTkdMRVNcIjtcclxuICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgV2ViR0xCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSBhcmd1bWVudCBpcyBhbHJlYWR5IGEgd2ViZ2xidWZmZXIsIHNpbXBseSB3cmFwIGl0XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBhcnJheTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gb3B0aW9ucy50eXBlIHx8IFwiVU5TSUdORURfU0hPUlRcIjtcclxuICAgICAgICAgICAgdGhpcy5jb3VudCA9ICggb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLmNvdW50IDogMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIGJ1ZmZlciBpdFxyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoIGFycmF5ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBsb2FkIGluZGV4IGRhdGEgdG8gdGhlIEdQVS5cclxuICAgICAqIEBtZW1iZXJvZiBJbmRleEJ1ZmZlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl8VWludDE2QXJyYXl8VWludDMyQXJyYXl9IGFycmF5IC0gVGhlIGFycmF5IG9mIGRhdGEgdG8gYnVmZmVyLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gVGhlIGluZGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBJbmRleEJ1ZmZlci5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKCBhcnJheSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIC8vIGNoZWNrIGZvciB0eXBlIHN1cHBvcnRcclxuICAgICAgICB2YXIgdWludDMyc3VwcG9ydCA9IFdlYkdMQ29udGV4dC5jaGVja0V4dGVuc2lvbiggXCJPRVNfZWxlbWVudF9pbmRleF91aW50XCIgKTtcclxuICAgICAgICBpZiggIXVpbnQzMnN1cHBvcnQgKSB7XHJcbiAgICAgICAgICAgIC8vIG5vIHN1cHBvcnQgZm9yIHVpbnQzMlxyXG4gICAgICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSwgYnVmZmVyIHRvIHVpbnQxNlxyXG4gICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgVWludDE2QXJyYXkoIGFycmF5ICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGFycmF5IGluc3RhbmNlb2YgVWludDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB1aW50MzIsIGRvd25ncmFkZSB0byB1aW50MTZcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybiggXCJDYW5ub3QgY3JlYXRlIEluZGV4QnVmZmVyIG9mIGZvcm1hdCBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCJnbC5VTlNJR05FRF9JTlQgYXMgT0VTX2VsZW1lbnRfaW5kZXhfdWludCBpcyBub3QgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3VwcG9ydGVkLCBkZWZhdWx0aW5nIHRvIGdsLlVOU0lHTkVEX1NIT1JUXCIgKTtcclxuICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQxNkFycmF5KCBhcnJheSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdWludDMyIGlzIHN1cHBvcnRlZFxyXG4gICAgICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSwgYnVmZmVyIHRvIHVpbnQzMlxyXG4gICAgICAgICAgICAgICAgYXJyYXkgPSBuZXcgVWludDMyQXJyYXkoIGFycmF5ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IGRhdGEgdHlwZSBiYXNlZCBvbiBhcnJheVxyXG4gICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBVaW50MTZBcnJheSApIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJVTlNJR05FRF9TSE9SVFwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGFycmF5IGluc3RhbmNlb2YgVWludDMyQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiVU5TSUdORURfSU5UXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJJbmRleEJ1ZmZlciByZXF1aXJlcyBhbiBBcnJheSBvciBcIiArXHJcbiAgICAgICAgICAgICAgICBcIkFycmF5QnVmZmVyIGFyZ3VtZW50LCBjb21tYW5kIGlnbm9yZWRcIiApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBidWZmZXIsIHN0b3JlIGNvdW50XHJcbiAgICAgICAgdGhpcy5pZCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIHRoaXMuY291bnQgPSBhcnJheS5sZW5ndGg7XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuaWQgKTtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYXJyYXksIGdsLlNUQVRJQ19EUkFXICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIGluZGV4IGJ1ZmZlciBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgSW5kZXhCdWZmZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7SW5kZXhCdWZmZXJ9IFJldHVybnMgdGhlIGluZGV4IGJ1ZmZlciBvYmplY3QgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBJbmRleEJ1ZmZlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGlmIHRoaXMgYnVmZmVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZEJ1ZmZlciA9PT0gdGhpcyApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmlkICk7XHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSBpbmRleCBidWZmZXIgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIEluZGV4QnVmZmVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0luZGV4QnVmZmVyfSBSZXR1cm5zIHRoZSBpbmRleCBidWZmZXIgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgSW5kZXhCdWZmZXIucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGJ1ZmZlciBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwgKTtcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgdGhlIGRyYXcgY29tbWFuZCBmb3IgdGhlIGJvdW5kIGJ1ZmZlci5cclxuICAgICAqIEBtZW1iZXJvZiBJbmRleEJ1ZmZlclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgaW5kZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggXCJObyBJbmRleEJ1ZmZlciBpcyBib3VuZCwgY29tbWFuZCBpZ25vcmVkLlwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICBnbC5kcmF3RWxlbWVudHMoXHJcbiAgICAgICAgICAgIGdsWyB0aGlzLm1vZGUgXSxcclxuICAgICAgICAgICAgdGhpcy5jb3VudCxcclxuICAgICAgICAgICAgZ2xbIHRoaXMudHlwZSBdLFxyXG4gICAgICAgICAgICB0aGlzLm9mZnNldCApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEluZGV4QnVmZmVyO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcclxuICAgICAgICBTdGFjayA9IHJlcXVpcmUoJy4uL3V0aWwvU3RhY2snKSxcclxuICAgICAgICBfc3RhY2sgPSBuZXcgU3RhY2soKSxcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGNhY2hpbmcgaXQgdG8gcHJldmVudCB1bm5lY2Vzc2FyeSByZWJpbmRzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7UmVuZGVyVGFyZ2V0fSByZW5kZXJUYXJnZXQgLSBUaGUgUmVuZGVyVGFyZ2V0IG9iamVjdCB0byBiaW5kLlxyXG4gICAgICovXHJcbiAgICAgZnVuY3Rpb24gYmluZCggcmVuZGVyVGFyZ2V0ICkge1xyXG4gICAgICAgIC8vIGlmIHRoaXMgYnVmZmVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZEJ1ZmZlciA9PT0gcmVuZGVyVGFyZ2V0ICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHJlbmRlclRhcmdldC5nbDtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCByZW5kZXJUYXJnZXQuaWQgKTtcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSByZW5kZXJUYXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LiBQcmV2ZW50cyB1bm5lY2Vzc2FyeSB1bmJpbmRpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtSZW5kZXJUYXJnZXR9IHJlbmRlclRhcmdldCAtIFRoZSBSZW5kZXJUYXJnZXQgb2JqZWN0IHRvIHVuYmluZC5cclxuICAgICAqL1xyXG4gICAgIGZ1bmN0aW9uIHVuYmluZCggcmVuZGVyVGFyZ2V0ICkge1xyXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGJ1ZmZlciBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHJlbmRlclRhcmdldC5nbDtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFJlbmRlclRhcmdldCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgcmVuZGVyVGFyZ2V0IGNsYXNzIHRvIGFsbG93IHJlbmRlcmluZyB0byB0ZXh0dXJlcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gUmVuZGVyVGFyZ2V0KCkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5pZCA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlcyA9IHt9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIHN0YWNrLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIF9zdGFjay5wdXNoKCB0aGlzICk7XHJcbiAgICAgICAgYmluZCggdGhpcyApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QgYW5kIGJpbmRzIHRoZSByZW5kZXJUYXJnZXQgYmVuZWF0aCBpdCBvblxyXG4gICAgICogdGhpcyBzdGFjay4gSWYgdGhlcmUgaXMgbm8gdW5kZXJseWluZyByZW5kZXJUYXJnZXQsIGJpbmQgdGhlIGJhY2tidWZmZXIuXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdG9wO1xyXG4gICAgICAgIF9zdGFjay5wb3AoKTtcclxuICAgICAgICB0b3AgPSBfc3RhY2sudG9wKCk7XHJcbiAgICAgICAgaWYgKCB0b3AgKSB7XHJcbiAgICAgICAgICAgIGJpbmQoIHRvcCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHVuYmluZCggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyB0aGUgcHJvdmlkZWQgdGV4dHVyZSB0byB0aGUgcHJvdmlkZWQgYXR0YWNobWVudCBsb2NhdGlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZSAtIFRoZSB0ZXh0dXJlIHRvIGF0dGFjaC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSBhdHRhY2htZW50IGluZGV4LiAob3B0aW9uYWwpXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0IC0gVGhlIHRleHR1cmUgdGFyZ2V0IHR5cGUuIChvcHRpb25hbClcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnNldENvbG9yVGFyZ2V0ID0gZnVuY3Rpb24oIHRleHR1cmUsIGluZGV4LCB0YXJnZXQgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICBpZiAoIHR5cGVvZiBpbmRleCA9PT0gXCJzdHJpbmdcIiApIHtcclxuICAgICAgICAgICAgdGFyZ2V0ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGluZGV4ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbmRleCA9ICggaW5kZXggIT09IHVuZGVmaW5lZCApID8gaW5kZXggOiAwO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbICdjb2xvcicgKyBpbmRleCBdID0gdGV4dHVyZTtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcclxuICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXHJcbiAgICAgICAgICAgIGdsWyAnQ09MT1JfQVRUQUNITUVOVCcgKyBpbmRleCBdLFxyXG4gICAgICAgICAgICBnbFsgdGFyZ2V0IHx8IFwiVEVYVFVSRV8yRFwiIF0sXHJcbiAgICAgICAgICAgIHRleHR1cmUuaWQsXHJcbiAgICAgICAgICAgIDAgKTtcclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHRvIHRoZSBwcm92aWRlZCBhdHRhY2htZW50IGxvY2F0aW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUuc2V0RGVwdGhUYXJnZXQgPSBmdW5jdGlvbiggdGV4dHVyZSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXMuZGVwdGggPSB0ZXh0dXJlO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxyXG4gICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcclxuICAgICAgICAgICAgZ2wuREVQVEhfQVRUQUNITUVOVCxcclxuICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgdGV4dHVyZS5pZCxcclxuICAgICAgICAgICAgMCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBjb2xvciBiaXRzIG9mIHRoZSByZW5kZXJUYXJnZXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgLSBUaGUgcmVkIHZhbHVlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIHZhbHVlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGEgLSBUaGUgYWxwaGEgdmFsdWUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5jbGVhckNvbG9yID0gZnVuY3Rpb24oIHIsIGcsIGIsIGEgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICByID0gKCByICE9PSB1bmRlZmluZWQgKSA/IHIgOiAwO1xyXG4gICAgICAgIGcgPSAoIGcgIT09IHVuZGVmaW5lZCApID8gZyA6IDA7XHJcbiAgICAgICAgYiA9ICggYiAhPT0gdW5kZWZpbmVkICkgPyBiIDogMDtcclxuICAgICAgICBhID0gKCBhICE9PSB1bmRlZmluZWQgKSA/IGEgOiAwO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoIHIsIGcsIGIsIGEgKTtcclxuICAgICAgICBnbC5jbGVhciggZ2wuQ09MT1JfQlVGRkVSX0JJVCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBkZXB0aCBiaXRzIG9mIHRoZSByZW5kZXJUYXJnZXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5jbGVhckRlcHRoID0gZnVuY3Rpb24oIHIsIGcsIGIsIGEgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICByID0gKCByICE9PSB1bmRlZmluZWQgKSA/IHIgOiAwO1xyXG4gICAgICAgIGcgPSAoIGcgIT09IHVuZGVmaW5lZCApID8gZyA6IDA7XHJcbiAgICAgICAgYiA9ICggYiAhPT0gdW5kZWZpbmVkICkgPyBiIDogMDtcclxuICAgICAgICBhID0gKCBhICE9PSB1bmRlZmluZWQgKSA/IGEgOiAwO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoIHIsIGcsIGIsIGEgKTtcclxuICAgICAgICBnbC5jbGVhciggZ2wuREVQVEhfQlVGRkVSX0JJVCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBzdGVuY2lsIGJpdHMgb2YgdGhlIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLmNsZWFyU3RlbmNpbCA9IGZ1bmN0aW9uKCByLCBnLCBiLCBhICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgciA9ICggciAhPT0gdW5kZWZpbmVkICkgPyByIDogMDtcclxuICAgICAgICBnID0gKCBnICE9PSB1bmRlZmluZWQgKSA/IGcgOiAwO1xyXG4gICAgICAgIGIgPSAoIGIgIT09IHVuZGVmaW5lZCApID8gYiA6IDA7XHJcbiAgICAgICAgYSA9ICggYSAhPT0gdW5kZWZpbmVkICkgPyBhIDogMDtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICBnbC5jbGVhckNvbG9yKCByLCBnLCBiLCBhICk7XHJcbiAgICAgICAgZ2wuY2xlYXIoIGdsLlNURU5DSUxfQlVGRkVSX0JJVCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIGFsbCB0aGUgYml0cyBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiggciwgZywgYiwgYSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHIgPSAoIHIgIT09IHVuZGVmaW5lZCApID8gciA6IDA7XHJcbiAgICAgICAgZyA9ICggZyAhPT0gdW5kZWZpbmVkICkgPyBnIDogMDtcclxuICAgICAgICBiID0gKCBiICE9PSB1bmRlZmluZWQgKSA/IGIgOiAwO1xyXG4gICAgICAgIGEgPSAoIGEgIT09IHVuZGVmaW5lZCApID8gYSA6IDA7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuY2xlYXJDb2xvciggciwgZywgYiwgYSApO1xyXG4gICAgICAgIGdsLmNsZWFyKCBnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCB8IGdsLlNURU5DSUxfQlVGRkVSX0JJVCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzaXplcyB0aGUgcmVuZGVyVGFyZ2V0IGFuZCBhbGwgYXR0YWNoZWQgdGV4dHVyZXMgYnkgdGhlIHByb3ZpZGVkIGhlaWdodFxyXG4gICAgICogYW5kIHdpZHRoLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSBuZXcgd2lkdGggb2YgdGhlIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgbmV3IGhlaWdodCBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgdmFyIGtleTtcclxuICAgICAgICBpZiAoICF3aWR0aCB8fCAhaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oIFwiV2lkdGggb3IgaGVpZ2h0IGFyZ3VtZW50cyBtaXNzaW5nLCBjb21tYW5kIGlnbm9yZWQuXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoIGtleSBpbiB0aGlzLnRleHR1cmVzICkge1xyXG4gICAgICAgICAgICBpZiAoIHRoaXMudGV4dHVyZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1sga2V5IF0ucmVzaXplKCB3aWR0aCwgaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVuZGVyVGFyZ2V0O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcclxuICAgICAgICBTaGFkZXJQYXJzZXIgPSByZXF1aXJlKCcuL1NoYWRlclBhcnNlcicpLFxyXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKSxcclxuICAgICAgICBYSFJMb2FkZXIgPSByZXF1aXJlKCcuLi91dGlsL1hIUkxvYWRlcicpLFxyXG4gICAgICAgIFN0YWNrID0gcmVxdWlyZSgnLi4vdXRpbC9TdGFjaycpLFxyXG4gICAgICAgIFVOSUZPUk1fRlVOQ1RJT05TID0ge1xyXG4gICAgICAgICAgICAnYm9vbCc6ICd1bmlmb3JtMWknLFxyXG4gICAgICAgICAgICAnZmxvYXQnOiAndW5pZm9ybTFmJyxcclxuICAgICAgICAgICAgJ2ludCc6ICd1bmlmb3JtMWknLFxyXG4gICAgICAgICAgICAndWludCc6ICd1bmZpcm9tMWknLFxyXG4gICAgICAgICAgICAndmVjMic6ICd1bmlmb3JtMmZ2JyxcclxuICAgICAgICAgICAgJ2l2ZWMyJzogJ3VuaWZvcm0yaXYnLFxyXG4gICAgICAgICAgICAndmVjMyc6ICd1bmlmb3JtM2Z2JyxcclxuICAgICAgICAgICAgJ2l2ZWMzJzogJ3VuaWZvcm0zaXYnLFxyXG4gICAgICAgICAgICAndmVjNCc6ICd1bmlmb3JtNGZ2JyxcclxuICAgICAgICAgICAgJ2l2ZWM0JzogJ3VuaWZvcm00aXYnLFxyXG4gICAgICAgICAgICAnbWF0Mic6ICd1bmlmb3JtTWF0cml4MmZ2JyxcclxuICAgICAgICAgICAgJ21hdDMnOiAndW5pZm9ybU1hdHJpeDNmdicsXHJcbiAgICAgICAgICAgICdtYXQ0JzogJ3VuaWZvcm1NYXRyaXg0ZnYnLFxyXG4gICAgICAgICAgICAnc2FtcGxlcjJEJzogJ3VuaWZvcm0xaScsXHJcbiAgICAgICAgICAgICdzYW1wbGVyQ3ViZSc6ICd1bmlmb3JtMWknXHJcbiAgICAgICAgfSxcclxuICAgICAgICBfc3RhY2sgPSBuZXcgU3RhY2soKSxcclxuICAgICAgICBfYm91bmRTaGFkZXIgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2l2ZW4gdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXIgc291cmNlLCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nXHJcbiAgICAgKiBpbmZvcm1hdGlvbiBwZXJ0YWluaW5nIHRvIHRoZSB1bmlmb3JtcyBhbmQgYXR0cmlidHVlcyBkZWNsYXJlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmVydFNvdXJjZSAtIFRoZSB2ZXJ0ZXggc2hhZGVyIHNvdXJjZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmcmFnU291cmNlIC0gVGhlIGZyYWdtZW50IHNoYWRlciBzb3VyY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QXR0cmlidXRlc0FuZFVuaWZvcm1zRnJvbVNvdXJjZSggdmVydFNvdXJjZSwgZnJhZ1NvdXJjZSApIHtcclxuICAgICAgICB2YXIgZGVjbGFyYXRpb25zID0gU2hhZGVyUGFyc2VyLnBhcnNlRGVjbGFyYXRpb25zKFxyXG4gICAgICAgICAgICAgICAgWyB2ZXJ0U291cmNlLCBmcmFnU291cmNlIF0sXHJcbiAgICAgICAgICAgICAgICBbICd1bmlmb3JtJywgJ2F0dHJpYnV0ZScgXSksXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSB7fSxcclxuICAgICAgICAgICAgdW5pZm9ybXMgPSB7fSxcclxuICAgICAgICAgICAgYXR0ckNvdW50ID0gMCxcclxuICAgICAgICAgICAgZGVjbGFyYXRpb24sXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggZGVjbGFyYXRpb24gaW4gdGhlIHNoYWRlclxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxkZWNsYXJhdGlvbnMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGRlY2xhcmF0aW9uID0gZGVjbGFyYXRpb25zW2ldO1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBpdHMgYW4gYXR0cmlidXRlIG9yIHVuaWZvcm1cclxuICAgICAgICAgICAgaWYgKCBkZWNsYXJhdGlvbi5xdWFsaWZpZXIgPT09ICdhdHRyaWJ1dGUnICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgYXR0cmlidXRlLCBzdG9yZSB0eXBlIGFuZCBpbmRleFxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1sgZGVjbGFyYXRpb24ubmFtZSBdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlY2xhcmF0aW9uLnR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGF0dHJDb3VudCsrXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBkZWNsYXJhdGlvbi5xdWFsaWZpZXIgPT09ICd1bmlmb3JtJyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHVuaWZvcm0sIHN0b3JlIHR5cGUgYW5kIGJ1ZmZlciBmdW5jdGlvbiBuYW1lXHJcbiAgICAgICAgICAgICAgICB1bmlmb3Jtc1sgZGVjbGFyYXRpb24ubmFtZSBdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlY2xhcmF0aW9uLnR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYzogVU5JRk9STV9GVU5DVElPTlNbIGRlY2xhcmF0aW9uLnR5cGUgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICB1bmlmb3JtczogdW5pZm9ybXNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBHaXZlbiBhIHNoYWRlciBzb3VyY2Ugc3RyaW5nIGFuZCBzaGFkZXIgdHlwZSwgY29tcGlsZXMgdGhlIHNoYWRlciBhbmRcclxuICAgICAqIHJldHVybnMgdGhlIHJlc3VsdGluZyBXZWJHTFNoYWRlciBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IGdsIC0gVGhlIHdlYmdsIHJlbmRlcmluZyBjb250ZXh0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNoYWRlclNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgc2hhZGVyIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1dlYkdMU2hhZGVyfSBUaGUgY29tcGlsZWQgc2hhZGVyIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY29tcGlsZVNoYWRlciggZ2wsIHNoYWRlclNvdXJjZSwgdHlwZSApIHtcclxuICAgICAgICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKCBnbFsgdHlwZSBdICk7XHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKCBzaGFkZXIsIHNoYWRlclNvdXJjZSApO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoIHNoYWRlciApO1xyXG4gICAgICAgIGlmICggIWdsLmdldFNoYWRlclBhcmFtZXRlciggc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyApICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkFuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogXCIgK1xyXG4gICAgICAgICAgICAgICAgZ2wuZ2V0U2hhZGVySW5mb0xvZyggc2hhZGVyICkgKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgYXR0cmlidXRlIGxvY2F0aW9ucyBmb3IgdGhlIFNoYWRlciBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBiaW5kQXR0cmlidXRlTG9jYXRpb25zKCBzaGFkZXIgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gc2hhZGVyLmdsLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gc2hhZGVyLmF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIG5hbWU7XHJcbiAgICAgICAgZm9yICggbmFtZSBpbiBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgICAgICBpZiAoIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApIHtcclxuICAgICAgICAgICAgICAgIC8vIGJpbmQgdGhlIGF0dHJpYnV0ZSBsb2NhdGlvblxyXG4gICAgICAgICAgICAgICAgZ2wuYmluZEF0dHJpYkxvY2F0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHNoYWRlci5pZCxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzWyBuYW1lIF0uaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSApO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnQm91bmQgdmVydGV4IGF0dHJpYnV0ZSBcXCcnICsgbmFtZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJ1xcJyB0byBsb2NhdGlvbiAnICsgYXR0cmlidXRlc1sgbmFtZSBdLmluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUXVlcmllcyB0aGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQgZm9yIHRoZSB1bmlmb3JtIGxvY2F0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldFVuaWZvcm1Mb2NhdGlvbnMoIHNoYWRlciApIHtcclxuICAgICAgICB2YXIgZ2wgPSBzaGFkZXIuZ2wsXHJcbiAgICAgICAgICAgIHVuaWZvcm1zID0gc2hhZGVyLnVuaWZvcm1zLFxyXG4gICAgICAgICAgICB1bmlmb3JtLFxyXG4gICAgICAgICAgICBuYW1lO1xyXG4gICAgICAgIGZvciAoIG5hbWUgaW4gdW5pZm9ybXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggdW5pZm9ybXMuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApIHtcclxuICAgICAgICAgICAgICAgIHVuaWZvcm0gPSB1bmlmb3Jtc1sgbmFtZSBdO1xyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSB1bmlmb3JtIGxvY2F0aW9uXHJcbiAgICAgICAgICAgICAgICB1bmlmb3JtLmxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKCBzaGFkZXIuaWQsIG5hbWUgKTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggbmFtZSArIFwiLCBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKCBzaGFkZXIuaWQsIG5hbWUgKSArIFwiLFwiICk7XHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgc2hhZGVyIHNvdXJjZSBmcm9tIGEgdXJsLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIGxvYWQgdGhlIHJlc291cmNlIGZyb20uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gbG9hZCB0aGUgc2hhZGVyIHNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbG9hZFNoYWRlclNvdXJjZSggdXJsICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgWEhSTG9hZGVyLmxvYWQoXHJcbiAgICAgICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBkb25lXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHBhc3MgdGhyb3VnaCB0aGUgc2hhZGVyIHNvdXJjZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNvdXJjZSBvZiB0aGUgc2hhZGVyLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIHRvIHBhc3MgdGhyb3VnaCB0aGUgc2hhZGVyIHNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGFzc1Rocm91Z2hTb3VyY2UoIHNvdXJjZSApIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGRvbmUgKSB7XHJcbiAgICAgICAgICAgIGRvbmUoIHNvdXJjZSApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhbiBhcnJheSBvZiBHTFNMIHNvdXJjZSBzdHJpbmdzIGFuZCBVUkxzLFxyXG4gICAgICogYW5kIHJlc29sdmVzIHRoZW0gaW50byBhbmQgYXJyYXkgb2YgR0xTTCBzb3VyY2UuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlc29sdmVTb3VyY2VzKCBzb3VyY2VzICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgdmFyIGpvYnMgPSBbXTtcclxuICAgICAgICAgICAgc291cmNlcyA9IHNvdXJjZXMgfHwgW107XHJcbiAgICAgICAgICAgIHNvdXJjZXMgPSAoICEoIHNvdXJjZXMgaW5zdGFuY2VvZiBBcnJheSApICkgPyBbIHNvdXJjZXMgXSA6IHNvdXJjZXM7XHJcbiAgICAgICAgICAgIHNvdXJjZXMuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggU2hhZGVyUGFyc2VyLmlzR0xTTCggc291cmNlICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgam9icy5wdXNoKCBwYXNzVGhyb3VnaFNvdXJjZSggc291cmNlICkgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgam9icy5wdXNoKCBsb2FkU2hhZGVyU291cmNlKCBzb3VyY2UgKSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgVXRpbC5hc3luYyggam9icywgZnVuY3Rpb24oIHJlc3VsdHMgKSB7XHJcbiAgICAgICAgICAgICAgICBkb25lKCByZXN1bHRzICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgc2hhZGVyIG9iamVjdCwgY2FjaGluZyBpdCB0byBwcmV2ZW50IHVubmVjZXNzYXJ5IHJlYmluZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0IHRvIGJpbmQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJpbmQoIHNoYWRlciApIHtcclxuICAgICAgICAvLyBpZiB0aGlzIHNoYWRlciBpcyBhbHJlYWR5IGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRTaGFkZXIgPT09IHNoYWRlciApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFkZXIuZ2wudXNlUHJvZ3JhbSggc2hhZGVyLmlkICk7XHJcbiAgICAgICAgX2JvdW5kU2hhZGVyID0gc2hhZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgc2hhZGVyIG9iamVjdC4gUHJldmVudHMgdW5uZWNlc3NhcnkgdW5iaW5kaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdCB0byB1bmJpbmQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVuYmluZCggc2hhZGVyICkge1xyXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHNoYWRlciBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kU2hhZGVyID09PSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYWRlci5nbC51c2VQcm9ncmFtKCBudWxsICk7XHJcbiAgICAgICAgX2JvdW5kU2hhZGVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgc2hhZGVyIGF0dHJpYnV0ZXMgZHVlIHRvIGFib3J0aW5nIG9mIGluaXRpYWxpemF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYWJvcnRTaGFkZXIoIHNoYWRlciApIHtcclxuICAgICAgICBzaGFkZXIuaWQgPSBudWxsO1xyXG4gICAgICAgIHNoYWRlci5hdHRyaWJ1dGVzID0gbnVsbDtcclxuICAgICAgICBzaGFkZXIudW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBTaGFkZXIgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFNoYWRlclxyXG4gICAgICogQGNsYXNzZGVzYyBBIHNoYWRlciBjbGFzcyB0byBhc3Npc3QgaW4gY29tcGlsaW5nIGFuZCBsaW5raW5nIHdlYmdsXHJcbiAgICAgKiBzaGFkZXJzLCBzdG9yaW5nIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybSBsb2NhdGlvbnMsIGFuZCBidWZmZXJpbmcgdW5pZm9ybXMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFNoYWRlciggc3BlYywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuaWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICAgICAgdGhpcy52ZXJzaW9uID0gc3BlYy52ZXJzaW9uIHx8ICcxLjAwJztcclxuICAgICAgICAvLyBjaGVjayBzb3VyY2UgYXJndW1lbnRzXHJcbiAgICAgICAgaWYgKCAhc3BlYy52ZXJ0ICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIlZlcnRleCBzaGFkZXIgYXJndW1lbnQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLCBcIiArXHJcbiAgICAgICAgICAgICAgICBcInNoYWRlciBpbml0aWFsaXphdGlvbiBhYm9ydGVkLlwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIXNwZWMuZnJhZyApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJGcmFnbWVudCBzaGFkZXIgYXJndW1lbnQgaGFzIG5vdCBiZWVuIHByb3ZpZGVkLCBcIiArXHJcbiAgICAgICAgICAgICAgICBcInNoYWRlciBpbml0aWFsaXphdGlvbiBhYm9ydGVkLlwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgc2hhZGVyXHJcbiAgICAgICAgVXRpbC5hc3luYyh7XHJcbiAgICAgICAgICAgIGNvbW1vbjogcmVzb2x2ZVNvdXJjZXMoIHNwZWMuY29tbW9uICksXHJcbiAgICAgICAgICAgIHZlcnQ6IHJlc29sdmVTb3VyY2VzKCBzcGVjLnZlcnQgKSxcclxuICAgICAgICAgICAgZnJhZzogcmVzb2x2ZVNvdXJjZXMoIHNwZWMuZnJhZyApLFxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKCBzaGFkZXJzICkge1xyXG4gICAgICAgICAgICB0aGF0LmNyZWF0ZSggc2hhZGVycyApO1xyXG4gICAgICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIHRoYXQgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgc2hhZGVyIG9iamVjdCBmcm9tIHNvdXJjZSBzdHJpbmdzLiBUaGlzIGluY2x1ZGVzOlxyXG4gICAgICogICAgMSkgQ29tcGlsaW5nIGFuZCBsaW5raW5nIHRoZSBzaGFkZXIgcHJvZ3JhbS5cclxuICAgICAqICAgIDIpIFBhcnNpbmcgc2hhZGVyIHNvdXJjZSBmb3IgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uLlxyXG4gICAgICogICAgMykgQmluZGluZyBhdHRyaWJ1dGUgbG9jYXRpb25zLCBieSBvcmRlciBvZiBkZWxjYXJhdGlvbi5cclxuICAgICAqICAgIDQpIFF1ZXJ5aW5nIGFuZCBzdG9yaW5nIHVuaWZvcm0gbG9jYXRpb24uXHJcbiAgICAgKiBAbWVtYmVyb2YgU2hhZGVyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNoYWRlcnMgLSBBIG1hcCBjb250YWluaW5nIHNvdXJjZXMgdW5kZXIgJ3ZlcnQnIGFuZFxyXG4gICAgICogICAgICdmcmFnJyBhdHRyaWJ1dGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFNoYWRlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oIHNoYWRlcnMgKSB7XHJcbiAgICAgICAgLy8gb25jZSBhbGwgc2hhZGVyIHNvdXJjZXMgYXJlIGxvYWRlZFxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wsXHJcbiAgICAgICAgICAgIGNvbW1vbiA9IHNoYWRlcnMuY29tbW9uLmpvaW4oIFwiXCIgKSxcclxuICAgICAgICAgICAgdmVydCA9IHNoYWRlcnMudmVydC5qb2luKCBcIlwiICksXHJcbiAgICAgICAgICAgIGZyYWcgPSBzaGFkZXJzLmZyYWcuam9pbiggXCJcIiApLFxyXG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXIsXHJcbiAgICAgICAgICAgIGZyYWdtZW50U2hhZGVyLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzQW5kVW5pZm9ybXM7XHJcbiAgICAgICAgLy8gY29tcGlsZSBzaGFkZXJzXHJcbiAgICAgICAgdmVydGV4U2hhZGVyID0gY29tcGlsZVNoYWRlciggZ2wsIGNvbW1vbiArIHZlcnQsIFwiVkVSVEVYX1NIQURFUlwiICk7XHJcbiAgICAgICAgZnJhZ21lbnRTaGFkZXIgPSBjb21waWxlU2hhZGVyKCBnbCwgY29tbW9uICsgZnJhZywgXCJGUkFHTUVOVF9TSEFERVJcIiApO1xyXG4gICAgICAgIGlmICggIXZlcnRleFNoYWRlciB8fCAhZnJhZ21lbnRTaGFkZXIgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiQWJvcnRpbmcgaW5zdGFudGlhdGlvbiBvZiBzaGFkZXIgZHVlIHRvIGNvbXBpbGF0aW9uIGVycm9ycy5cIiApO1xyXG4gICAgICAgICAgICByZXR1cm4gYWJvcnRTaGFkZXIoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcGFyc2Ugc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm1zXHJcbiAgICAgICAgYXR0cmlidXRlc0FuZFVuaWZvcm1zID0gZ2V0QXR0cmlidXRlc0FuZFVuaWZvcm1zRnJvbVNvdXJjZSggdmVydCwgZnJhZyApO1xyXG4gICAgICAgIC8vIHNldCBtZW1iZXIgYXR0cmlidXRlc1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNBbmRVbmlmb3Jtcy5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMgPSBhdHRyaWJ1dGVzQW5kVW5pZm9ybXMudW5pZm9ybXM7XHJcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgICAgIHRoaXMuaWQgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICAgICAgLy8gYXR0YWNoIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVyc1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlciggdGhpcy5pZCwgdmVydGV4U2hhZGVyICk7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKCB0aGlzLmlkLCBmcmFnbWVudFNoYWRlciApO1xyXG4gICAgICAgIC8vIGJpbmQgdmVydGV4IGF0dHJpYnV0ZSBsb2NhdGlvbnMgQkVGT1JFIGxpbmtpbmdcclxuICAgICAgICBiaW5kQXR0cmlidXRlTG9jYXRpb25zKCB0aGlzICk7XHJcbiAgICAgICAgLy8gbGluayBzaGFkZXJcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbSggdGhpcy5pZCApO1xyXG4gICAgICAgIC8vIElmIGNyZWF0aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbSBmYWlsZWQsIGFsZXJ0XHJcbiAgICAgICAgaWYgKCAhZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlciggdGhpcy5pZCwgZ2wuTElOS19TVEFUVVMgKSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJBbiBlcnJvciBvY2N1cmVkIGxpbmtpbmcgdGhlIHNoYWRlcjogXCIgK1xyXG4gICAgICAgICAgICAgICAgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coIHRoaXMuaWQgKSApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkFib3J0aW5nIGluc3RhbnRpYXRpb24gb2Ygc2hhZGVyIGR1ZSB0byBsaW5raW5nIGVycm9ycy5cIiApO1xyXG4gICAgICAgICAgICByZXR1cm4gYWJvcnRTaGFkZXIoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZ2V0IHNoYWRlciB1bmlmb3JtIGxvY2F0aW9uc1xyXG4gICAgICAgIGdldFVuaWZvcm1Mb2NhdGlvbnMoIHRoaXMgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgc2hhZGVyIG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgU2hhZGVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgU2hhZGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgX3N0YWNrLnB1c2goIHRoaXMgKTtcclxuICAgICAgICBiaW5kKCB0aGlzICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgc2hhZGVyIG9iamVjdCBhbmQgYmluZHMgdGhlIHNoYWRlciBiZW5lYXRoIGl0IG9uXHJcbiAgICAgKiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHNoYWRlciwgYmluZCB0aGUgYmFja2J1ZmZlci5cclxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBTaGFkZXIucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0b3A7XHJcbiAgICAgICAgX3N0YWNrLnBvcCgpO1xyXG4gICAgICAgIHRvcCA9IF9zdGFjay50b3AoKTtcclxuICAgICAgICBpZiAoIHRvcCApIHtcclxuICAgICAgICAgICAgYmluZCggdG9wICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdW5iaW5kKCB0aGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1ZmZlciBhIHVuaWZvcm0gdmFsdWUgYnkgbmFtZS5cclxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdW5pZm9ybU5hbWUgLSBUaGUgdW5pZm9ybSBuYW1lIGluIHRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICogQHBhcmFtIHsqfSB1bmlmb3JtIC0gVGhlIHVuaWZvcm0gdmFsdWUgdG8gYnVmZmVyLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFNoYWRlci5wcm90b3R5cGUuc2V0VW5pZm9ybSA9IGZ1bmN0aW9uKCB1bmlmb3JtTmFtZSwgdW5pZm9ybSApIHtcclxuICAgICAgICBpZiAoICF0aGlzLmlkICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJBdHRlbXB0aW5nIHRvIHVzZSBhbiBpbmNvbXBsZXRlIHNoYWRlciwgaWdub3JpbmcgY29tbWFuZC5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHVuaWZvcm1TcGVjID0gdGhpcy51bmlmb3Jtc1sgdW5pZm9ybU5hbWUgXSxcclxuICAgICAgICAgICAgZnVuYyxcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgbG9jYXRpb24sXHJcbiAgICAgICAgICAgIHZhbHVlO1xyXG4gICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZSB1bmlmb3JtIHNwZWMgZXhpc3RzIGZvciB0aGUgbmFtZVxyXG4gICAgICAgIGlmICggIXVuaWZvcm1TcGVjICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oICdObyB1bmlmb3JtIGZvdW5kIHVuZGVyIG5hbWVcIicgKyB1bmlmb3JtTmFtZSArXHJcbiAgICAgICAgICAgICAgICAnXCIsIGNvbW1hbmQgaWdub3JlZCcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBhcmd1bWVudCBpcyBkZWZpbmVkXHJcbiAgICAgICAgaWYgKCB1bmlmb3JtID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggJ0FyZ3VtZW50IHBhc3NlZCBmb3IgdW5pZm9ybSBcIicgKyB1bmlmb3JtTmFtZSArXHJcbiAgICAgICAgICAgICAgICAnXCIgaXMgdW5kZWZpbmVkLCBjb21tYW5kIGlnbm9yZWQnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZ2V0IHRoZSB1bmlmb3JtIGxvY2F0aW9uLCB0eXBlLCBhbmQgYnVmZmVyIGZ1bmN0aW9uXHJcbiAgICAgICAgZnVuYyA9IHVuaWZvcm1TcGVjLmZ1bmM7XHJcbiAgICAgICAgdHlwZSA9IHVuaWZvcm1TcGVjLnR5cGU7XHJcbiAgICAgICAgbG9jYXRpb24gPSB1bmlmb3JtU3BlYy5sb2NhdGlvbjtcclxuICAgICAgICB2YWx1ZSA9IHVuaWZvcm0udG9BcnJheSA/IHVuaWZvcm0udG9BcnJheSgpIDogdW5pZm9ybTtcclxuICAgICAgICB2YWx1ZSA9ICggdmFsdWUgaW5zdGFuY2VvZiBBcnJheSApID8gbmV3IEZsb2F0MzJBcnJheSggdmFsdWUgKSA6IHZhbHVlO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgYm9vbGVhbidzIHRvIDAgb3IgMVxyXG4gICAgICAgIHZhbHVlID0gKCB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiICkgPyAoIHZhbHVlID8gMSA6IDAgKSA6IHZhbHVlO1xyXG4gICAgICAgIC8vIHBhc3MgdGhlIGFyZ3VtZW50cyBkZXBlbmRpbmcgb24gdGhlIHR5cGVcclxuICAgICAgICBzd2l0Y2ggKCB0eXBlICkge1xyXG4gICAgICAgICAgICBjYXNlICdtYXQyJzpcclxuICAgICAgICAgICAgY2FzZSAnbWF0Myc6XHJcbiAgICAgICAgICAgIGNhc2UgJ21hdDQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbFsgZnVuYyBdKCBsb2NhdGlvbiwgZmFsc2UsIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xbIGZ1bmMgXSggbG9jYXRpb24sIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gU2hhZGVyO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgUFJFQ0lTSU9OX1FVQUxJRklFUlMgPSB7XHJcbiAgICAgICAgaGlnaHA6IHRydWUsXHJcbiAgICAgICAgbWVkaXVtcDogdHJ1ZSxcclxuICAgICAgICBsb3dwOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBzdGFuZGFyZCBjb21tZW50cyBmcm9tIHRoZSBwcm92aWRlZCBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gc3RyaXAgY29tbWVudHMgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb21tZW50bGVzcyBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHN0cmlwQ29tbWVudHMoIHN0ciApIHtcclxuICAgICAgICAvLyByZWdleCBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb2Fncml1cy9zdHJpcGNvbW1lbnRzXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXFwvXFwqKFtcXHNcXFNdKj8pXFwqXFwvKXwoXFwvXFwvKC4qKSQpL2dtLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbGwgd2hpdGVzcGFjZSBpbnRvIGEgc2luZ2xlICcgJyBzcGFjZSBjaGFyYWN0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gbm9ybWFsaXplIHdoaXRlc3BhY2UgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBub3JtYWxpemVkIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplV2hpdGVzcGFjZSggc3RyICkge1xyXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZW5kIGxpbmVzLCByZXBsYWNlIGFsbCB3aGl0ZXNwYWNlIHdpdGggYSBzaW5nbGUgJyAnIHNwYWNlXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpLnJlcGxhY2UoL1xcc3syLH0vZywgJyAnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyBhIHNpbmdsZSAnc3RhdGVtZW50Jy4gQSAnc3RhdGVtZW50JyBpcyBjb25zaWRlcmVkIGFueSBzZXF1ZW5jZSBvZlxyXG4gICAgICogY2hhcmFjdGVycyBmb2xsb3dlZCBieSBhIHNlbWktY29sb24uIFRoZXJlZm9yZSwgYSBzaW5nbGUgJ3N0YXRlbWVudCcgaW5cclxuICAgICAqIHRoaXMgc2Vuc2UgY291bGQgY29udGFpbiBzZXZlcmFsIGNvbW1hIHNlcGFyYXRlZCBkZWNsYXJhdGlvbnMuIFJldHVybnNcclxuICAgICAqIGFsbCByZXN1bHRpbmcgZGVjbGFyYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZW1lbnQgLSBUaGUgc3RhdGVtZW50IHRvIHBhcnNlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIHBhcnNlZCBkZWNsYXJhdGlvbiBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZVN0YXRlbWVudCggc3RhdGVtZW50ICkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZU5hbWVBbmRDb3VudCggZW50cnkgKSB7XHJcbiAgICAgICAgICAgIC8vIHNwbGl0IG9uICdbXScgYW5kIHRyaW0gd2hpdGVzcGNlIHRvIGNoZWNrIGZvciBhcnJheXNcclxuICAgICAgICAgICAgdmFyIHNwbGl0ID0gZW50cnkuc3BsaXQoL1tcXFtcXF1dLykubWFwKCBmdW5jdGlvbiggZWxlbSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtLnRyaW0oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBxdWFsaWZpZXI6IHF1YWxpZmllcixcclxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogcHJlY2lzaW9uLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHNwbGl0WzBdLFxyXG4gICAgICAgICAgICAgICAgY291bnQ6ICggc3BsaXRbMV0gPT09IHVuZGVmaW5lZCApID8gMSA6IHBhcnNlSW50KCBzcGxpdFsxXSwgMTAgKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXSxcclxuICAgICAgICAgICAgY29tbWFTcGxpdCxcclxuICAgICAgICAgICAgaGVhZGVyLFxyXG4gICAgICAgICAgICBxdWFsaWZpZXIsXHJcbiAgICAgICAgICAgIHByZWNpc2lvbixcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgbmFtZXMsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gc3BsaXQgc3RhdGVtZW50IG9uIGNvbW1hc1xyXG4gICAgICAgIGNvbW1hU3BsaXQgPSBzdGF0ZW1lbnQuc3BsaXQoJywnKS5tYXAoIGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbS50cmltKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gc3BsaXQgZGVjbGFyYXRpb24gaGVhZGVyIGZyb20gc3RhdGVtZW50XHJcbiAgICAgICAgaGVhZGVyID0gY29tbWFTcGxpdC5zaGlmdCgpLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgLy8gcXVhbGlmaWVyIGlzIGFsd2F5cyBmaXJzdCBlbGVtZW50XHJcbiAgICAgICAgcXVhbGlmaWVyID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gcHJlY2lzaW9uIG1heSBvciBtYXkgbm90IGJlIGRlY2xhcmVkXHJcbiAgICAgICAgcHJlY2lzaW9uID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gaWYgbm90IGEgcHJlY2lzaW9uIGtleXdvcmQgaXQgaXMgdGhlIHR5cGUgaW5zdGVhZFxyXG4gICAgICAgIGlmICggIVBSRUNJU0lPTl9RVUFMSUZJRVJTWyBwcmVjaXNpb24gXSApIHtcclxuICAgICAgICAgICAgdHlwZSA9IHByZWNpc2lvbjtcclxuICAgICAgICAgICAgcHJlY2lzaW9uID0gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0eXBlID0gaGVhZGVyLnNoaWZ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNwbGl0IHJlbWFpbmluZyBuYW1lcyBieSBjb21tYXMgYW5kIHRyaW0gd2hpdGVzcGFjZVxyXG4gICAgICAgIG5hbWVzID0gaGVhZGVyLmNvbmNhdCggY29tbWFTcGxpdCApO1xyXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBvdGhlciBuYW1lcyBhZnRlciBhICcsJyBhZGQgdGhlbSBhcyB3ZWxsXHJcbiAgICAgICAgZm9yICggaT0wOyBpPG5hbWVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goIHBhcnNlTmFtZUFuZENvdW50KCBuYW1lc1tpXSApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3BsaXRzIHRoZSBzb3VyY2Ugc3RyaW5nIGJ5IHNlbWktY29sb25zIGFuZCBjb25zdHJ1Y3RzIGFuIGFycmF5IG9mXHJcbiAgICAgKiBkZWNsYXJhdGlvbiBvYmplY3RzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIga2V5d29yZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBrZXl3b3JkIC0gVGhlIHF1YWxpZmllciBkZWNsYXJhdGlvbiBrZXl3b3JkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIHF1YWxpZmllciBkZWNsYXJhdGlvbiBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZVNvdXJjZSggc291cmNlLCBrZXl3b3JkICkge1xyXG4gICAgICAgIC8vIGdldCBzdGF0ZW1lbnRzICggYW55IHNlcXVlbmNlIGVuZGluZyBpbiA7ICkgY29udGFpbmluZyBhbnlcclxuICAgICAgICAvLyBvZiB0aGUgZ2l2ZW4ga2V5d29yZHNcclxuICAgICAgICB2YXIga2V5d29yZFN0ciA9ICgga2V5d29yZCBpbnN0YW5jZW9mIEFycmF5ICkgPyBrZXl3b3JkLmpvaW4oJ3wnKSA6IGtleXdvcmQsXHJcbiAgICAgICAgICAgIGtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXi4qXFxcXGIoXCIra2V5d29yZFN0citcIilcXFxcYi4qXCIsICdnbScgKSxcclxuICAgICAgICAgICAgY29tbWVudGxlc3NTb3VyY2UgPSBzdHJpcENvbW1lbnRzKCBzb3VyY2UgKSxcclxuICAgICAgICAgICAgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVdoaXRlc3BhY2UoIGNvbW1lbnRsZXNzU291cmNlICksXHJcbiAgICAgICAgICAgIHN0YXRlbWVudHMgPSBub3JtYWxpemVkLnNwbGl0KCc7JyksXHJcbiAgICAgICAgICAgIG1hdGNoZWQgPSBbXSxcclxuICAgICAgICAgICAgbWF0Y2gsIGk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggc3RhdGVtZW50XHJcbiAgICAgICAgZm9yICggaT0wOyBpPHN0YXRlbWVudHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGxvb2sgZm9yIGtleXdvcmRzXHJcbiAgICAgICAgICAgIG1hdGNoID0gc3RhdGVtZW50c1tpXS50cmltKCkubWF0Y2goIGtleXdvcmRSZWdleCApO1xyXG4gICAgICAgICAgICBpZiAoIG1hdGNoICkge1xyXG4gICAgICAgICAgICAgICAgLy8gcGFyc2Ugc3RhdGVtZW50IGFuZCBhZGQgdG8gYXJyYXlcclxuICAgICAgICAgICAgICAgIG1hdGNoZWQgPSBtYXRjaGVkLmNvbmNhdCggcGFyc2VTdGF0ZW1lbnQoIG1hdGNoWzBdICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0Y2hlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbHRlcnMgb3V0IGR1cGxpY2F0ZSBkZWNsYXJhdGlvbnMgcHJlc2VudCBiZXR3ZWVuIHNoYWRlcnMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gZGVjbGFyYXRpb25zIC0gVGhlIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBmaWx0ZXJlZCBhcnJheSBvZiBkZWNsYXJhdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZpbHRlckR1cGxpY2F0ZXNCeU5hbWUoIGRlY2xhcmF0aW9ucyApIHtcclxuICAgICAgICAvLyBpbiBjYXNlcyB3aGVyZSB0aGUgc2FtZSBkZWNsYXJhdGlvbnMgYXJlIHByZXNlbnQgaW4gbXVsdGlwbGVcclxuICAgICAgICAvLyBzb3VyY2VzLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSB0aGUgcmVzdWx0c1xyXG4gICAgICAgIHZhciBzZWVuID0ge307XHJcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBkZWNsYXJhdGlvbiApIHtcclxuICAgICAgICAgICAgaWYgKCBzZWVuWyBkZWNsYXJhdGlvbi5uYW1lIF0gKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VlblsgZGVjbGFyYXRpb24ubmFtZSBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyB0aGUgcHJvdmlkZWQgR0xTTCBzb3VyY2UsIGFuZCByZXR1cm5zIGFsbCBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzXHJcbiAgICAgICAgICogdGhhdCBjb250YWluIHRoZSBwcm92aWRlZCBxdWFsaWZpZXIgdHlwZS4gVGhpcyBjYW4gYmUgdXNlZCB0byBleHRyYWN0XHJcbiAgICAgICAgICogYWxsIGF0dHJpYnV0ZXMgYW5kIHVuaWZvcm0gbmFtZXMgYW5kIHR5cGVzIGZyb20gYSBzaGFkZXIuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBGb3IgZXhhbXBsZSwgd2hlbiBwcm92aWRlZCBhIFwidW5pZm9ybVwiIHF1YWxpZmllcnMsIHRoZSBkZWNsYXJhdGlvbjpcclxuICAgICAgICAgKiA8cHJlPlxyXG4gICAgICAgICAqICAgICBcInVuaWZvcm0gaGlnaHAgdmVjMyB1U3BlY3VsYXJDb2xvcjtcIlxyXG4gICAgICAgICAqIDwvcHJlPlxyXG4gICAgICAgICAqIFdvdWxkIGJlIHBhcnNlZCB0bzpcclxuICAgICAgICAgKiA8cHJlPlxyXG4gICAgICAgICAqICAgICB7XHJcbiAgICAgICAgICogICAgICAgICBxdWFsaWZpZXI6IFwidW5pZm9ybVwiLFxyXG4gICAgICAgICAqICAgICAgICAgdHlwZTogXCJ2ZWMzXCIsXHJcbiAgICAgICAgICogICAgICAgICBuYW1lOiBcInVTcGVjdWxhckNvbG9yXCIsXHJcbiAgICAgICAgICogICAgICAgICBjb3VudDogMVxyXG4gICAgICAgICAqICAgICB9XHJcbiAgICAgICAgICogPC9wcmU+XHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHNvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlcy5cclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcXVhbGlmaWVycyAtIFRoZSBxdWFsaWZpZXJzIHRvIGV4dHJhY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBvZiBxdWFsaWZpZXIgZGVjbGFyYXRpb24gc3RhdGVtZW50cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwYXJzZURlY2xhcmF0aW9uczogZnVuY3Rpb24oIHNvdXJjZSwgcXVhbGlmaWVycyApIHtcclxuICAgICAgICAgICAgLy8gaWYgbm8gcXVhbGlmaWVycyBhcmUgcHJvdmlkZWQsIHJldHVybiBlbXB0eSBhcnJheVxyXG4gICAgICAgICAgICBpZiAoICFxdWFsaWZpZXJzIHx8IHF1YWxpZmllcnMubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2VzID0gKCBzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSApID8gc291cmNlIDogWyBzb3VyY2UgXSxcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPHNvdXJjZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnMuY29uY2F0KCBwYXJzZVNvdXJjZSggc291cmNlc1tpXSwgcXVhbGlmaWVycyApICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGR1cGxpY2F0ZXMgYW5kIHJldHVyblxyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyRHVwbGljYXRlc0J5TmFtZSggZGVjbGFyYXRpb25zICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGV0ZWN0cyBiYXNlZCBvbiB0aGUgZXhpc3RlbmNlIG9mIGEgJ3ZvaWQgbWFpbigpIHsnIHN0YXRlbWVudCwgaWZcclxuICAgICAgICAgKiB0aGUgc3RyaW5nIGlzIGdsc2wgc291cmNlIGNvZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIGlucHV0IHN0cmluZyB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gVHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGdsc2wgY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc0dMU0w6IGZ1bmN0aW9uKCBzdHIgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAvdm9pZFxccyttYWluXFxzKlxcKFxccypcXClcXHMqLy50ZXN0KCBzdHIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxyXG4gICAgICAgIFN0YWNrID0gcmVxdWlyZSgnLi4vdXRpbC9TdGFjaycpLFxyXG4gICAgICAgIF9zdGFjayA9IHt9LFxyXG4gICAgICAgIF9ib3VuZFRleHR1cmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIHByb3ZpZGVkIGltYWdlIGRpbWVuc2lvbnMgYXJlIG5vdCBwb3dlcnMgb2YgdHdvLCBpdCB3aWxsIHJlZHJhd1xyXG4gICAgICogdGhlIGltYWdlIHRvIHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgLSBUaGUgaW1hZ2Ugb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtIVE1MSW1hZ2VFbGVtZW50fSBUaGUgbmV3IGltYWdlIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZW5zdXJlUG93ZXJPZlR3byggaW1hZ2UgKSB7XHJcbiAgICAgICAgaWYgKCAhVXRpbC5pc1Bvd2VyT2ZUd28oIGltYWdlLndpZHRoICkgfHxcclxuICAgICAgICAgICAgIVV0aWwuaXNQb3dlck9mVHdvKCBpbWFnZS5oZWlnaHQgKSApIHtcclxuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiY2FudmFzXCIgKTtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28oIGltYWdlLndpZHRoICk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byggaW1hZ2UuaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgaW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAwLCAwLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIDAsIDAsXHJcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNhbnZhcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIGEgbG9jYXRpb24gYW5kIGFjdGl2YXRlcyB0aGUgdGV4dHVyZSB1bml0XHJcbiAgICAgKiB3aGlsZSBjYWNoaW5nIGl0IHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgcmViaW5kcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZSAtIFRoZSBUZXh0dXJlMkQgb2JqZWN0IHRvIGJpbmQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBiaW5kKCB0ZXh0dXJlLCBsb2NhdGlvbiApIHtcclxuICAgICAgICAvLyBpZiB0aGlzIGJ1ZmZlciBpcyBhbHJlYWR5IGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRUZXh0dXJlID09PSB0ZXh0dXJlICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRleHR1cmUuZ2w7XHJcbiAgICAgICAgbG9jYXRpb24gPSBnbFsgJ1RFWFRVUkUnICsgbG9jYXRpb24gXSB8fCBnbC5URVhUVVJFMDtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlLmlkICk7XHJcbiAgICAgICAgX2JvdW5kVGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdC4gUHJldmVudHMgdW5uZWNlc3NhcnkgdW5iaW5kaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIFRleHR1cmUyRCBvYmplY3QgdG8gdW5iaW5kLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1bmJpbmQoIHRleHR1cmUgKSB7XHJcbiAgICAgICAgLy8gaWYgbm8gYnVmZmVyIGlzIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRUZXh0dXJlID09PSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRleHR1cmUuZ2w7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcclxuICAgICAgICBfYm91bmRUZXh0dXJlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFRleHR1cmUyRCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVGV4dHVyZTJEXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgdGV4dHVyZSBjbGFzcyB0byByZXByZXNlbnQgYSAyRCB0ZXh0dXJlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBUZXh0dXJlMkQoIHNwZWMsIGNhbGxiYWNrICkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAvLyBkZWZhdWx0XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICAvLyBjcmVhdGUgdGV4dHVyZSBvYmplY3RcclxuICAgICAgICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy53cmFwID0gc3BlYy53cmFwIHx8IFwiUkVQRUFUXCI7XHJcbiAgICAgICAgdGhpcy5maWx0ZXIgPSBzcGVjLmZpbHRlciB8fCBcIkxJTkVBUlwiO1xyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBiYXNlZCBvbiBhcmd1bWVudHNcclxuICAgICAgICBpZiAoIHNwZWMuaW1hZ2UgKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSBleGlzdGluZyBJbWFnZSBvYmplY3RcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBzcGVjLmltYWdlICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNwZWMudXJsICkge1xyXG4gICAgICAgICAgICAvLyByZXF1ZXN0IGltYWdlIHNvdXJjZSBmcm9tIHVybFxyXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmJ1ZmZlckRhdGEoIGltYWdlICk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnNldFBhcmFtZXRlcnMoIHRoaXMgKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHNwZWMudXJsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICAgIGlmICggc3BlYy5mb3JtYXQgPT09IFwiREVQVEhfQ09NUE9ORU5UXCIgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkZXB0aCB0ZXh0dXJlXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVwdGhUZXh0dXJlRXh0ID0gV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCBcIldFQkdMX2RlcHRoX3RleHR1cmVcIiApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFkZXB0aFRleHR1cmVFeHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgZm9ybWF0IFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnbC5ERVBUSF9DT01QT05FTlQgYXMgV0VCR0xfZGVwdGhfdGV4dHVyZSBpcyBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidW5zdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyLCBjb21tYW5kIGlnbm9yZWRcIiApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFzcGVjLnR5cGUgfHxcclxuICAgICAgICAgICAgICAgICAgICBzcGVjLnR5cGUgPT09IFwiVU5TSUdORURfU0hPUlRcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9PT0gXCJVTlNJR05FRF9JTlRcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIkRlcHRoIHRleHR1cmVzIGRvIG5vdCBzdXBwb3J0IHR5cGUnXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVjLnR5cGUgKyBcIicsIGRlZmF1bHRpbmcgdG8gJ1VOU0lHTkVEX1NIT1JUJy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gXCJVTlNJR05FRF9TSE9SVFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gb3RoZXJcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQgfHwgXCJSR0JBXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgXCJVTlNJR05FRF9CWVRFXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbEZvcm1hdCA9IHRoaXMuZm9ybWF0OyAvLyB3ZWJnbCByZXF1aXJlcyBmb3JtYXQgPT09IGludGVybmFsRm9ybWF0XHJcbiAgICAgICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgfHwgZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggc3BlYy5kYXRhIHx8IG51bGwsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oIGxvY2F0aW9uICkge1xyXG4gICAgICAgIF9zdGFja1sgbG9jYXRpb24gXSA9IF9zdGFja1sgbG9jYXRpb24gXSB8fCBuZXcgU3RhY2soKTtcclxuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0ucHVzaCggdGhpcyApO1xyXG4gICAgICAgIGJpbmQoIHRoaXMsIGxvY2F0aW9uICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIGJpbmRzIHRoZSB0ZXh0dXJlIGJlbmVhdGggaXQgb25cclxuICAgICAqIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgdGV4dHVyZSwgdW5iaW5kcyB0aGUgdW5pdC5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICB2YXIgdG9wO1xyXG4gICAgICAgIGlmICggIV9zdGFja1sgbG9jYXRpb24gXSApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCBcIk5vIHRleHR1cmUgd2FzIGJvdW5kIHRvIHRleHR1cmUgdW5pdCAnXCIgKyBsb2NhdGlvbiArXHJcbiAgICAgICAgICAgICAgICBcIicuIENvbW1hbmQgaWdub3JlZC5cIiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0ucG9wKCk7XHJcbiAgICAgICAgdG9wID0gX3N0YWNrWyBsb2NhdGlvbiBdLnRvcCgpO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBiaW5kKCB0b3AsIGxvY2F0aW9uICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdW5iaW5kKCB0aGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1ZmZlciBkYXRhIGludG8gdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtJbWFnZURhdGF8QXJyYXlCdWZmZXJWaWV3fEhUTUxJbWFnZUVsZW1lbnR9IGRhdGEgLSBUaGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLmJ1ZmZlckRhdGEgPSBmdW5jdGlvbiggZGF0YSwgd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGlmICggZGF0YSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQgKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBlbnN1cmVQb3dlck9mVHdvKCBkYXRhICk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gZGF0YS53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5taXBNYXAgPSB0cnVlO1xyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIDAsIC8vIGxldmVsXHJcbiAgICAgICAgICAgICAgICBnbC5SR0JBLFxyXG4gICAgICAgICAgICAgICAgZ2wuUkdCQSxcclxuICAgICAgICAgICAgICAgIGdsLlVOU0lHTkVEX0JZVEUsXHJcbiAgICAgICAgICAgICAgICBkYXRhICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIDAsIC8vIGxldmVsXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5pbnRlcm5hbEZvcm1hdCBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgMCwgLy8gYm9yZGVyLCBtdXN0IGJlIDBcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmZvcm1hdCBdLFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMudHlwZSBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdGhpcy5taXBNYXAgKSB7XHJcbiAgICAgICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKCBnbC5URVhUVVJFXzJEICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSB0ZXh0dXJlIHBhcmFtZXRlcnMuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgLSBUaGUgcGFyYW1ldGVycyBieSBuYW1lLlxyXG4gICAgICogPHByZT5cclxuICAgICAqICAgICB3cmFwIHwgd3JhcC5zIHwgd3JhcC50IC0gVGhlIHdyYXBwaW5nIHR5cGUuXHJcbiAgICAgKiAgICAgZmlsdGVyIHwgZmlsdGVyLm1pbiB8IGZpbHRlci5tYWcgLSBUaGUgZmlsdGVyIHR5cGUuXHJcbiAgICAgKiA8L3ByZT5cclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnNldFBhcmFtZXRlcnMgPSBmdW5jdGlvbiggcGFyYW1ldGVycyApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGlmICggcGFyYW1ldGVycy53cmFwICkge1xyXG4gICAgICAgICAgICAvLyBzZXQgd3JhcCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIHRoaXMud3JhcCA9IHBhcmFtZXRlcnMud3JhcDtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX1dSQVBfUyxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLndyYXAucyB8fCB0aGlzLndyYXAgXSApO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfV1JBUF9ULFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMud3JhcC50IHx8IHRoaXMud3JhcCBdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggcGFyYW1ldGVycy5maWx0ZXIgKSB7XHJcbiAgICAgICAgICAgIC8vIHNldCBmaWx0ZXIgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlciA9IHBhcmFtZXRlcnMuZmlsdGVyO1xyXG4gICAgICAgICAgICB2YXIgbWluRmlsdGVyID0gdGhpcy5maWx0ZXIubWluIHx8IHRoaXMuZmlsdGVyO1xyXG4gICAgICAgICAgICBpZiAoIHRoaXMubWluTWFwICkge1xyXG4gICAgICAgICAgICAgICAgLy8gYXBwZW5kIG1pbiBtcGEgc3VmZml4IHRvIG1pbiBmaWx0ZXJcclxuICAgICAgICAgICAgICAgIG1pbkZpbHRlciArPSBcIl9NSVBNQVBfTElORUFSXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX01BR19GSUxURVIsXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5maWx0ZXIubWFnIHx8IHRoaXMuZmlsdGVyIF0gKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX01JTl9GSUxURVIsXHJcbiAgICAgICAgICAgICAgICBnbFsgbWluRmlsdGVyXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2l6ZSB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgbmV3IHdpZHRoIG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIGlmICggdGhpcy5pbWFnZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJDYW5ub3QgcmVzaXplIGltYWdlIGJhc2VkIFRleHR1cmUyRFwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhd2lkdGggfHwgIWhlaWdodCApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCBcIldpZHRoIG9yIGhlaWdodCBhcmd1bWVudHMgbWlzc2luZywgY29tbWFuZCBpZ25vcmVkLlwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idWZmZXJEYXRhKCB0aGlzLmRhdGEsIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlMkQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxuICAgICAgICBTdGFjayA9IHJlcXVpcmUoJy4uL3V0aWwvU3RhY2snKSxcbiAgICAgICAgRkFDRVMgPSBbXG4gICAgICAgICAgICAnLXgnLCAnK3gnLFxuICAgICAgICAgICAgJy15JywgJyt5JyxcbiAgICAgICAgICAgICcteicsICcreidcbiAgICAgICAgXSxcbiAgICAgICAgRkFDRV9UQVJHRVRTID0ge1xuICAgICAgICAgICAgJyt6JzogXCJURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1pcIixcbiAgICAgICAgICAgICcteic6IFwiVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aXCIsXG4gICAgICAgICAgICAnK3gnOiBcIlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWFwiLFxuICAgICAgICAgICAgJy14JzogXCJURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1hcIixcbiAgICAgICAgICAgICcreSc6IFwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZXCIsXG4gICAgICAgICAgICAnLXknOiBcIlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWVwiXG4gICAgICAgIH0sXG4gICAgICAgIF9zdGFjayA9IHt9LFxuICAgICAgICBfYm91bmRUZXh0dXJlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBwcm92aWRlZCBpbWFnZSBkaW1lbnNpb25zIGFyZSBub3QgcG93ZXJzIG9mIHR3bywgaXQgd2lsbCByZWRyYXdcbiAgICAgKiB0aGUgaW1hZ2UgdG8gdGhlIG5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIC0gVGhlIGltYWdlIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtIVE1MSW1hZ2VFbGVtZW50fSBUaGUgbmV3IGltYWdlIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbnN1cmVQb3dlck9mVHdvKCBpbWFnZSApIHtcbiAgICAgICAgaWYgKCAhVXRpbC5pc1Bvd2VyT2ZUd28oIGltYWdlLndpZHRoICkgfHxcbiAgICAgICAgICAgICFVdGlsLmlzUG93ZXJPZlR3byggaW1hZ2UuaGVpZ2h0ICkgKSB7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJjYW52YXNcIiApO1xuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28oIGltYWdlLndpZHRoICk7XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gVXRpbC5uZXh0SGlnaGVzdFBvd2VyT2ZUd28oIGltYWdlLmhlaWdodCApO1xuICAgICAgICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgICAgIDAsIDAsXG4gICAgICAgICAgICAgICAgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCxcbiAgICAgICAgICAgICAgICAwLCAwLFxuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApO1xuICAgICAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW1hZ2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IHRvIGEgbG9jYXRpb24gYW5kIGFjdGl2YXRlcyB0aGUgdGV4dHVyZSB1bml0XG4gICAgICogd2hpbGUgY2FjaGluZyBpdCB0byBwcmV2ZW50IHVubmVjZXNzYXJ5IHJlYmluZHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSB0ZXh0dXJlIC0gVGhlIFRleHR1cmVDdWJlTWFwIG9iamVjdCB0byBiaW5kLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmluZCggdGV4dHVyZSwgbG9jYXRpb24gKSB7XG4gICAgICAgIC8vIGlmIHRoaXMgYnVmZmVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcbiAgICAgICAgaWYgKCBfYm91bmRUZXh0dXJlID09PSB0ZXh0dXJlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBnbCA9IHRleHR1cmUuZ2w7XG4gICAgICAgIGxvY2F0aW9uID0gZ2xbICdURVhUVVJFJyArIGxvY2F0aW9uIF0gfHwgZ2wuVEVYVFVSRTA7XG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoIGxvY2F0aW9uICk7XG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFX0NVQkVfTUFQLCB0ZXh0dXJlLmlkICk7XG4gICAgICAgIF9ib3VuZFRleHR1cmUgPSB0ZXh0dXJlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0LiBQcmV2ZW50cyB1bm5lY2Vzc2FyeSB1bmJpbmRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHR1cmVDdWJlTWFwfSB0ZXh0dXJlIC0gVGhlIFRleHR1cmVDdWJlTWFwIG9iamVjdCB0byB1bmJpbmQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5iaW5kKCB0ZXh0dXJlICkge1xuICAgICAgICAvLyBpZiBubyBidWZmZXIgaXMgYm91bmQsIGV4aXQgZWFybHlcbiAgICAgICAgaWYgKCBfYm91bmRUZXh0dXJlID09PSBudWxsICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBnbCA9IHRleHR1cmUuZ2w7XG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsICk7XG4gICAgICAgIF9ib3VuZFRleHR1cmUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBsb2FkIGFuZCBidWZmZXIgYSBnaXZlbiBjdWJlIG1hcCBmYWNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gY3ViZU1hcCAtIFRoZSBjdWJlIG1hcCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gbG9hZCB0aGUgaW1hZ2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZhY2UgLSBUaGUgZmFjZSBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSByZXN1bHRpbmcgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9hZEFuZEJ1ZmZlckltYWdlKCBjdWJlTWFwLCB1cmwsIGZhY2UgKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcbiAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gYnVmZmVyIGZhY2UgdGV4dHVyZVxuICAgICAgICAgICAgICAgIGN1YmVNYXAuYnVmZmVyRmFjZURhdGEoIGZhY2UsIGltYWdlICk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHVybDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBUZXh0dXJlQ3ViZU1hcCBvYmplY3QuXG4gICAgICogQGNsYXNzIFRleHR1cmVDdWJlTWFwXG4gICAgICogQGNsYXNzZGVzYyBBIHRleHR1cmUgY2xhc3MgdG8gcmVwcmVzZW50IGEgY3ViZSBtYXAgdGV4dHVyZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBUZXh0dXJlQ3ViZU1hcCggc3BlYywgY2FsbGJhY2sgKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGZhY2UsXG4gICAgICAgICAgICBqb2JzO1xuICAgICAgICAvLyBzdG9yZSBnbCBjb250ZXh0XG4gICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XG4gICAgICAgIHRoaXMuaWQgPSB0aGlzLmdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICAgICAgdGhpcy53cmFwID0gc3BlYy53cmFwIHx8IFwiQ0xBTVBfVE9fRURHRVwiO1xuICAgICAgICB0aGlzLmZpbHRlciA9IHNwZWMuZmlsdGVyIHx8IFwiTElORUFSXCI7XG4gICAgICAgIC8vIGNyZWF0ZSBjdWJlIG1hcCBiYXNlZCBvbiBpbnB1dFxuICAgICAgICBpZiAoIHNwZWMuaW1hZ2VzICkge1xuICAgICAgICAgICAgLy8gbXVsdGlwbGUgSW1hZ2Ugb2JqZWN0c1xuICAgICAgICAgICAgZm9yICggZmFjZSBpbiBzcGVjLmltYWdlcyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNwZWMuaW1hZ2VzLmhhc093blByb3BlcnR5KCBmYWNlICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciBmYWNlIHRleHR1cmVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJGYWNlRGF0YSggZmFjZSwgc3BlYy5pbWFnZXNbIGZhY2UgXSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xuICAgICAgICB9IGVsc2UgaWYgKCBzcGVjLnVybHMgKSB7XG4gICAgICAgICAgICAvLyBtdWx0aXBsZSB1cmxzXG4gICAgICAgICAgICBqb2JzID0ge307XG4gICAgICAgICAgICBmb3IgKCBmYWNlIGluIHNwZWMudXJscyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNwZWMudXJscy5oYXNPd25Qcm9wZXJ0eSggZmFjZSApICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgam9iIHRvIG1hcFxuICAgICAgICAgICAgICAgICAgICBqb2JzWyBmYWNlIF0gPSBsb2FkQW5kQnVmZmVySW1hZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BlYy51cmxzWyBmYWNlIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWNlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVXRpbC5hc3luYyggam9icywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5zZXRQYXJhbWV0ZXJzKCB0aGF0ICk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIHRoYXQgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZW1wdHkgY3ViZSBtYXBcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQgfHwgXCJSR0JBXCI7XG4gICAgICAgICAgICB0aGlzLmludGVybmFsRm9ybWF0ID0gdGhpcy5mb3JtYXQ7IC8vIHdlYmdsIHJlcXVpcmVzIGZvcm1hdCA9PT0gaW50ZXJuYWxGb3JtYXRcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZSB8fCBcIlVOU0lHTkVEX0JZVEVcIjtcbiAgICAgICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgfHwgZmFsc2U7XG4gICAgICAgICAgICBGQUNFUy5mb3JFYWNoKCBmdW5jdGlvbiggZmFjZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9ICggc3BlYy5kYXRhID8gc3BlYy5kYXRhW2ZhY2VdIDogc3BlYy5kYXRhICkgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICB0aGF0LmJ1ZmZlckZhY2VEYXRhKCBmYWNlLCBkYXRhLCBzcGVjLndpZHRoLCBzcGVjLmhlaWdodCApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnMoIHRoaXMgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmVDdWJlTWFwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICAgVGV4dHVyZUN1YmVNYXAucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XG4gICAgICAgIF9zdGFja1sgbG9jYXRpb24gXSA9IF9zdGFja1sgbG9jYXRpb24gXSB8fCBuZXcgU3RhY2soKTtcbiAgICAgICAgX3N0YWNrWyBsb2NhdGlvbiBdLnB1c2goIHRoaXMgKTtcbiAgICAgICAgYmluZCggdGhpcywgbG9jYXRpb24gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0IGFuZCBiaW5kcyB0aGUgdGV4dHVyZSBiZW5lYXRoIGl0IG9uXG4gICAgICogdGhpcyBzdGFjay4gSWYgdGhlcmUgaXMgbm8gdW5kZXJseWluZyB0ZXh0dXJlLCB1bmJpbmRzIHRoZSB1bml0LlxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlQ3ViZU1hcFxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgIFRleHR1cmVDdWJlTWFwLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiggbG9jYXRpb24gKSB7XG4gICAgICAgIHZhciB0b3A7XG4gICAgICAgIGlmICggIV9zdGFja1sgbG9jYXRpb24gXSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gdGV4dHVyZSB3YXMgYm91bmQgdG8gdGV4dHVyZSB1bml0ICdcIiArIGxvY2F0aW9uICtcbiAgICAgICAgICAgICAgICBcIicuIENvbW1hbmQgaWdub3JlZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgX3N0YWNrWyBsb2NhdGlvbiBdLnBvcCgpO1xuICAgICAgICB0b3AgPSBfc3RhY2tbIGxvY2F0aW9uIF0udG9wKCk7XG4gICAgICAgIGlmICggdG9wICkge1xuICAgICAgICAgICAgYmluZCggdG9wLCBsb2NhdGlvbiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5iaW5kKCB0aGlzICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEJ1ZmZlciBkYXRhIGludG8gdGhlIHJlc3BlY3RpdmUgY3ViZSBtYXAgZmFjZS5cbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZUN1YmVNYXBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmYWNlIC0gVGhlIGZhY2UgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxuICAgICAqIEBwYXJhbSB7SW1hZ2VEYXRhfEFycmF5QnVmZmVyVmlld3xIVE1MSW1hZ2VFbGVtZW50fSBkYXRhIC0gVGhlIGRhdGEuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBkYXRhLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBUZXh0dXJlQ3ViZU1hcC5wcm90b3R5cGUuYnVmZmVyRmFjZURhdGEgPSBmdW5jdGlvbiggZmFjZSwgZGF0YSwgd2lkdGgsIGhlaWdodCApIHtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCxcbiAgICAgICAgICAgIGZhY2VUYXJnZXQgPSBnbFsgRkFDRV9UQVJHRVRTWyBmYWNlIF0gXTtcbiAgICAgICAgaWYgKCAhZmFjZVRhcmdldCApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCBmYWNlIGVudW1lcmF0aW9uICdcIisgZmFjZSArXCInIHByb3ZpZGVkLCBcIiArXG4gICAgICAgICAgICAgICAgXCJpZ25vcmluZyBjb21tYW5kLlwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBidWZmZXIgZmFjZSB0ZXh0dXJlXG4gICAgICAgIHRoaXMucHVzaCgpO1xuICAgICAgICBpZiAoIGRhdGEgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50ICkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZXMgPSB0aGlzLmltYWdlcyB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzWyBmYWNlIF0gPSBlbnN1cmVQb3dlck9mVHdvKCBkYXRhICk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlciA9IFwiTElORUFSXCI7XG4gICAgICAgICAgICB0aGlzLm1pcE1hcCA9IHRydWU7XG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgICAgICAgIGZhY2VUYXJnZXQsXG4gICAgICAgICAgICAgICAgMCwgLy8gbGV2ZWxcbiAgICAgICAgICAgICAgICBnbC5SR0JBLFxuICAgICAgICAgICAgICAgIGdsLlJHQkEsXG4gICAgICAgICAgICAgICAgZ2wuVU5TSUdORURfQllURSxcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1sgZmFjZSBdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmRhdGEgfHwge307XG4gICAgICAgICAgICB0aGlzLmRhdGFbIGZhY2UgXSA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgdGhpcy53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcbiAgICAgICAgICAgICAgICBmYWNlVGFyZ2V0LFxuICAgICAgICAgICAgICAgIDAsIC8vIGxldmVsXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuaW50ZXJuYWxGb3JtYXQgXSxcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuZm9ybWF0IF0sXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMudHlwZSBdLFxuICAgICAgICAgICAgICAgIGRhdGEgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbmx5IGdlbmVyYXRlIG1pcG1hcHMgaWYgYWxsIGZhY2VzIGFyZSBidWZmZXJlZFxuICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXMgPSB0aGlzLmJ1ZmZlcmVkRmFjZXMgfHwge307XG4gICAgICAgIHRoaXMuYnVmZmVyZWRGYWNlc1sgZmFjZSBdID0gdHJ1ZTtcbiAgICAgICAgLy8gb25jZSBhbGwgZmFjZXMgYXJlIGJ1ZmZlcmVkXG4gICAgICAgIGlmICggdGhpcy5taXBNYXAgJiZcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyZWRGYWNlc1snLXgnXSAmJiB0aGlzLmJ1ZmZlcmVkRmFjZXNbJyt4J10gJiZcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyZWRGYWNlc1snLXknXSAmJiB0aGlzLmJ1ZmZlcmVkRmFjZXNbJyt5J10gJiZcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyZWRGYWNlc1snLXonXSAmJiB0aGlzLmJ1ZmZlcmVkRmFjZXNbJyt6J10gKSB7XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBtaXBtYXBzIG9uY2UgYWxsIGZhY2VzIGFyZSBidWZmZXJlZFxuICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoIGdsLlRFWFRVUkVfQ1VCRV9NQVAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSB0ZXh0dXJlIHBhcmFtZXRlcnMuXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmVDdWJlTWFwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1ldGVycyAtIFRoZSBwYXJhbWV0ZXJzIGJ5IG5hbWUuXG4gICAgICogPHByZT5cbiAgICAgKiAgICAgd3JhcCB8IHdyYXAucyB8IHdyYXAudCAtIFRoZSB3cmFwcGluZyB0eXBlLlxuICAgICAqICAgICBmaWx0ZXIgfCBmaWx0ZXIubWluIHwgZmlsdGVyLm1hZyAtIFRoZSBmaWx0ZXIgdHlwZS5cbiAgICAgKiA8L3ByZT5cbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIFRleHR1cmVDdWJlTWFwLnByb3RvdHlwZS5zZXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24oIHBhcmFtZXRlcnMgKSB7XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIHRoaXMucHVzaCgpO1xuICAgICAgICBpZiAoIHBhcmFtZXRlcnMud3JhcCApIHtcbiAgICAgICAgICAgIC8vIHNldCB3cmFwIHBhcmFtZXRlcnNcbiAgICAgICAgICAgIHRoaXMud3JhcCA9IHBhcmFtZXRlcnMud3JhcDtcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9DVUJFX01BUCxcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX1dSQVBfUyxcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy53cmFwLnMgfHwgdGhpcy53cmFwIF0gKTtcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9DVUJFX01BUCxcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX1dSQVBfVCxcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy53cmFwLnQgfHwgdGhpcy53cmFwIF0gKTtcbiAgICAgICAgICAgIC8qIG5vdCBzdXBwb3J0ZWQgaW4gd2ViZ2wgMS4wXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfQ1VCRV9NQVAsXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9XUkFQX1IsXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMud3JhcC5yIHx8IHRoaXMud3JhcCBdICk7XG4gICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgICAgIGlmICggcGFyYW1ldGVycy5maWx0ZXIgKSB7XG4gICAgICAgICAgICAvLyBzZXQgZmlsdGVyIHBhcmFtZXRlcnNcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gcGFyYW1ldGVycy5maWx0ZXI7XG4gICAgICAgICAgICB2YXIgbWluRmlsdGVyID0gdGhpcy5maWx0ZXIubWluIHx8IHRoaXMuZmlsdGVyO1xuICAgICAgICAgICAgaWYgKCB0aGlzLm1pbk1hcCApIHtcbiAgICAgICAgICAgICAgICAvLyBhcHBlbmQgbWluIG1wYSBzdWZmaXggdG8gbWluIGZpbHRlclxuICAgICAgICAgICAgICAgIG1pbkZpbHRlciArPSBcIl9NSVBNQVBfTElORUFSXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfQ1VCRV9NQVAsXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLFxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmZpbHRlci5tYWcgfHwgdGhpcy5maWx0ZXIgXSApO1xuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX0NVQkVfTUFQLFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUixcbiAgICAgICAgICAgICAgICBnbFsgbWluRmlsdGVyXSApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRleHR1cmVDdWJlTWFwO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcclxuICAgICAgICBWZXJ0ZXhQYWNrYWdlID0gcmVxdWlyZSgnLi9WZXJ0ZXhQYWNrYWdlJyksXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IG51bGwsXHJcbiAgICAgICAgX2VuYWJsZWRBdHRyaWJ1dGVzID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVQb2ludGVycyggdmVydGV4QnVmZmVyLCBhdHRyaWJ1dGVQb2ludGVycyApIHtcclxuICAgICAgICBpZiAoICFhdHRyaWJ1dGVQb2ludGVycyApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJWZXJ0ZXhCdWZmZXIgcmVxdWlyZXMgYXR0cmlidXRlIHBvaW50ZXJzIHRvIGJlIFwiICtcclxuICAgICAgICAgICAgICAgIFwic3BlY2lmaWVkLCBjb21tYW5kIGlnbm9yZWRcIiApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZlcnRleEJ1ZmZlci5wb2ludGVycyA9IGF0dHJpYnV0ZVBvaW50ZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFZlcnRleEJ1ZmZlciggYXJyYXksIGF0dHJpYnV0ZVBvaW50ZXJzICkge1xyXG4gICAgICAgIHRoaXMuaWQgPSAwO1xyXG4gICAgICAgIHRoaXMucG9pbnRlcnMgPSB7fTtcclxuICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIGlmICggYXJyYXkgKSB7XHJcbiAgICAgICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBWZXJ0ZXhQYWNrYWdlICkge1xyXG4gICAgICAgICAgICAgICAgLy8gVmVydGV4UGFja2FnZSBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBhcnJheS5idWZmZXIoKSApO1xyXG4gICAgICAgICAgICAgICAgc2V0QXR0cmlidXRlUG9pbnRlcnMoIHRoaXMsIGFycmF5LmF0dHJpYnV0ZVBvaW50ZXJzKCkgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggYXJyYXkgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlciApIHtcclxuICAgICAgICAgICAgICAgIC8vIFdlYkdMQnVmZmVyIGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlkID0gYXJyYXk7XHJcbiAgICAgICAgICAgICAgICBzZXRBdHRyaWJ1dGVQb2ludGVycyggdGhpcywgYXR0cmlidXRlUG9pbnRlcnMgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEFycmF5IG9yIEFycmF5QnVmZmVyIGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJyYXkgKTtcclxuICAgICAgICAgICAgICAgc2V0QXR0cmlidXRlUG9pbnRlcnMoIHRoaXMsIGF0dHJpYnV0ZVBvaW50ZXJzICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24oIGFycmF5ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgaWYgKCBhcnJheSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBjYXN0IGFycmF5cyBpbnRvIGJ1ZmZlcnZpZXdcclxuICAgICAgICAgICAgYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KCBhcnJheSApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoICFVdGlsLmlzVHlwZWRBcnJheSggYXJyYXkgKSAmJiB0eXBlb2YgYXJyYXkgIT09IFwibnVtYmVyXCIgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiVmVydGV4QnVmZmVyIHJlcXVpcmVzIGFuIEFycmF5IG9yIEFycmF5QnVmZmVyLCBcIiArXHJcbiAgICAgICAgICAgICAgICBcIm9yIGEgc2l6ZSBhcmd1bWVudCwgY29tbWFuZCBpZ25vcmVkXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoICF0aGlzLmlkICkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pZCApO1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoIGdsLkFSUkFZX0JVRkZFUiwgYXJyYXksIGdsLlNUQVRJQ19EUkFXICk7XHJcbiAgICB9O1xyXG5cclxuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUuYnVmZmVyU3ViRGF0YSA9IGZ1bmN0aW9uKCBhcnJheSwgb2Zmc2V0ICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5pZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJWZXJ0ZXhCdWZmZXIgaGFzIG5vdCBiZWVuIGluaXRpYWxseSBidWZmZXJlZCwgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJjb21tYW5kIGlnbm9yZWRcIiApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KCBhcnJheSApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoICFVdGlsLmlzVHlwZWRBcnJheSggYXJyYXkgKSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJWZXJ0ZXhCdWZmZXIgcmVxdWlyZXMgYW4gQXJyYXkgb3IgQXJyYXlCdWZmZXIgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJhcmd1bWVudCwgY29tbWFuZCBpZ25vcmVkXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvZmZzZXQgPSAoIG9mZnNldCAhPT0gdW5kZWZpbmVkICkgPyBvZmZzZXQgOiAwO1xyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pZCApO1xyXG4gICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoIGdsLkFSUkFZX0JVRkZFUiwgb2Zmc2V0LCBhcnJheSApO1xyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhCdWZmZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBpZiB0aGlzIGJ1ZmZlciBpcyBhbHJlYWR5IGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IHRoaXMgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCxcclxuICAgICAgICAgICAgcG9pbnRlcnMgPSB0aGlzLnBvaW50ZXJzLFxyXG4gICAgICAgICAgICBwcmV2aW91c2x5RW5hYmxlZEF0dHJpYnV0ZXMgPSBfZW5hYmxlZEF0dHJpYnV0ZXMgfHwge30sXHJcbiAgICAgICAgICAgIHBvaW50ZXIsXHJcbiAgICAgICAgICAgIGluZGV4O1xyXG4gICAgICAgIC8vIGNhY2hlIHRoaXMgdmVydGV4IGJ1ZmZlclxyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IHRoaXM7XHJcbiAgICAgICAgX2VuYWJsZWRBdHRyaWJ1dGVzID0ge307XHJcbiAgICAgICAgLy8gYmluZCBidWZmZXJcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaWQgKTtcclxuICAgICAgICBmb3IgKCBpbmRleCBpbiBwb2ludGVycyApIHtcclxuICAgICAgICAgICAgaWYgKCBwb2ludGVycy5oYXNPd25Qcm9wZXJ0eSggaW5kZXggKSApIHtcclxuICAgICAgICAgICAgICAgIHBvaW50ZXIgPSB0aGlzLnBvaW50ZXJzWyBpbmRleCBdO1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGF0dHJpYnV0ZSBwb2ludGVyXHJcbiAgICAgICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKCBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVyLnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xbIHBvaW50ZXIudHlwZSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXIuc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50ZXIub2Zmc2V0ICk7XHJcbiAgICAgICAgICAgICAgICAvLyBlbmFibGVkIGF0dHJpYnV0ZSBhcnJheVxyXG4gICAgICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoIGluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIF9lbmFibGVkQXR0cmlidXRlc1sgaW5kZXggXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZnJvbSBwcmV2aW91cyBsaXN0XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcHJldmlvdXNseUVuYWJsZWRBdHRyaWJ1dGVzWyBpbmRleCBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVuc3VyZSBsZWFrZWQgYXR0cmlidXRlIGFycmF5cyBhcmUgZGlzYWJsZWRcclxuICAgICAgICBmb3IgKCBpbmRleCBpbiBwcmV2aW91c2x5RW5hYmxlZEF0dHJpYnV0ZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggcHJldmlvdXNseUVuYWJsZWRBdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBpbmRleCApICkge1xyXG4gICAgICAgICAgICAgICAgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KCBpbmRleCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhCdWZmZXIucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGlmIG5vIGJ1ZmZlciBpcyBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wsXHJcbiAgICAgICAgICAgIHBvaW50ZXJzID0gdGhpcy5wb2ludGVycyxcclxuICAgICAgICAgICAgaW5kZXg7XHJcbiAgICAgICAgZm9yICggaW5kZXggaW4gcG9pbnRlcnMgKSB7XHJcbiAgICAgICAgICAgIGlmICggcG9pbnRlcnMuaGFzT3duUHJvcGVydHkoIGluZGV4ICkgKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoIGluZGV4ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCBudWxsICk7XHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gbnVsbDtcclxuICAgICAgICBfZW5hYmxlZEF0dHJpYnV0ZXMgPSB7fTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhCdWZmZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnRcclxuICAgICAqIG11c3QgYmUgYW4gQXJyYXkgb2YgbGVuZ3RoID4gMC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIC0gVGhlIGFycmF5IG9mIHZlcnRleCBhdHRyaWJ1dGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZhbGlkIGFycmF5IG9mIGFyZ3VtZW50cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVtb3ZlQmFkQXJndW1lbnRzKCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIHZhciBnb29kQXR0cmlidXRlcyA9IFtdLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGUsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPGF0dHJpYnV0ZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaV07XHJcbiAgICAgICAgICAgIGlmICggYXR0cmlidXRlICYmXHJcbiAgICAgICAgICAgICAgICAgYXR0cmlidXRlIGluc3RhbmNlb2YgQXJyYXkgJiZcclxuICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIGdvb2RBdHRyaWJ1dGVzLnB1c2goIGF0dHJpYnV0ZSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJFcnJvciBwYXJzaW5nIGF0dHJpYnV0ZSBvZiBpbmRleCBcIiArIGkgK1xyXG4gICAgICAgICAgICAgICAgICAgIFwiLCBhdHRyaWJ1dGUgZGlzY2FyZGVkXCIgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ29vZEF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgY29tcG9uZW50J3MgYnl0ZSBzaXplLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50IHRvIG1lYXN1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2ludGVnZXJ9IFRoZSBieXRlIHNpemUgb2YgdGhlIGNvbXBvbmVudC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50U2l6ZSggY29tcG9uZW50ICkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIHZlY3RvclxyXG4gICAgICAgIGlmICggY29tcG9uZW50LnggIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgLy8gMSBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgIGlmICggY29tcG9uZW50LnkgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIC8vIDIgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgaWYgKCBjb21wb25lbnQueiAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDMgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggY29tcG9uZW50LncgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNCBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjaGVjayBpZiBhcnJheVxyXG4gICAgICAgIGlmICggY29tcG9uZW50IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIHR5cGUsIHNpemUsIGFuZCBvZmZzZXQgZm9yIGVhY2ggYXR0cmlidXRlIGluIHRoZVxyXG4gICAgICogYXR0cmlidXRlIGFycmF5IGFsb25nIHdpdGggdGhlIGxlbmd0aCBhbmQgc3RyaWRlIG9mIHRoZSBwYWNrYWdlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVydGV4UGFja2FnZX0gdmVydGV4UGFja2FnZSAtIFRoZSBWZXJ0ZXhQYWNrYWdlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGF0dHJpYnV0ZXMgLSBUaGUgYXJyYXkgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldFBvaW50ZXJzQW5kU3RyaWRlKCB2ZXJ0ZXhQYWNrYWdlLCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIHZhciBzaG9ydGVzdEFycmF5ID0gTnVtYmVyLk1BWF9WQUxVRSxcclxuICAgICAgICAgICAgb2Zmc2V0ID0gMCxcclxuICAgICAgICAgICAgYXR0cmlidXRlLFxyXG4gICAgICAgICAgICBzaXplLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIHZlcnRleFBhY2thZ2UucG9pbnRlcnMgPSB7fTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8YXR0cmlidXRlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcclxuICAgICAgICAgICAgLy8gc2V0IHNpemUgdG8gbnVtYmVyIG9mIGNvbXBvbmVudHMgaW4gdGhlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICBzaXplID0gZ2V0Q29tcG9uZW50U2l6ZSggYXR0cmlidXRlWzBdICk7XHJcbiAgICAgICAgICAgIC8vIGxlbmd0aCBvZiB0aGUgcGFja2FnZSB3aWxsIGJlIHRoZSBzaG9ydGVzdCBhdHRyaWJ1dGUgYXJyYXkgbGVuZ3RoXHJcbiAgICAgICAgICAgIHNob3J0ZXN0QXJyYXkgPSBNYXRoLm1pbiggc2hvcnRlc3RBcnJheSwgYXR0cmlidXRlLmxlbmd0aCApO1xyXG4gICAgICAgICAgICAvLyBzdG9yZSBwb2ludGVyIHVuZGVyIGluZGV4XHJcbiAgICAgICAgICAgIHZlcnRleFBhY2thZ2UucG9pbnRlcnNbIGkgXSA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGUgOiBcIkZMT0FUXCIsXHJcbiAgICAgICAgICAgICAgICBzaXplIDogc2l6ZSxcclxuICAgICAgICAgICAgICAgIG9mZnNldCA6IG9mZnNldFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBhY2N1bXVsYXRlIGF0dHJpYnV0ZSBvZmZzZXRcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IHNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBzdHJpZGUgdG8gdG90YWwgb2Zmc2V0XHJcbiAgICAgICAgdmVydGV4UGFja2FnZS5zdHJpZGUgPSBvZmZzZXQ7XHJcbiAgICAgICAgLy8gc2V0IHNpemUgb2YgcGFja2FnZSB0byB0aGUgc2hvcnRlc3QgYXR0cmlidXRlIGFycmF5IGxlbmd0aFxyXG4gICAgICAgIHZlcnRleFBhY2thZ2Uuc2l6ZSA9IHNob3J0ZXN0QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gVmVydGV4UGFja2FnZSggYXR0cmlidXRlcyApIHtcclxuICAgICAgICAvLyBlbnN1cmUgYXR0cmlidXRlcyBpcyBhbiBhcnJheSBvZiBhcnJheXNcclxuICAgICAgICBpZiAoICEoIGF0dHJpYnV0ZXNbMF0gaW5zdGFuY2VvZiBBcnJheSApICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gWyBhdHRyaWJ1dGVzIF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnNldCggYXR0cmlidXRlcyApO1xyXG4gICAgfVxyXG5cclxuICAgIFZlcnRleFBhY2thZ2UucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIHZhciBCWVRFU19QRVJfQ09NUE9ORU5UID0gNCxcclxuICAgICAgICAgICAgYXR0cmlidXRlLFxyXG4gICAgICAgICAgICBwb2ludGVyLFxyXG4gICAgICAgICAgICB2ZXJ0ZXgsXHJcbiAgICAgICAgICAgIG9mZnNldCxcclxuICAgICAgICAgICAgaSwgaiwgaztcclxuICAgICAgICAvLyByZW1vdmUgYmFkIGF0dHJpYnV0ZXNcclxuICAgICAgICBhdHRyaWJ1dGVzID0gcmVtb3ZlQmFkQXJndW1lbnRzKCBhdHRyaWJ1dGVzICk7XHJcbiAgICAgICAgLy8gc2V0IGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgc3RyaWRlXHJcbiAgICAgICAgc2V0UG9pbnRlcnNBbmRTdHJpZGUoIHRoaXMsIGF0dHJpYnV0ZXMgKTtcclxuICAgICAgICAvLyBzZXQgc2l6ZSBvZiBkYXRhIHZlY3RvclxyXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoIHRoaXMuc2l6ZSAqIHRoaXMuc3RyaWRlICk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggdmVydGV4IGF0dHJpYnV0ZSBhcnJheVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHBvaW50ZXJcclxuICAgICAgICAgICAgcG9pbnRlciA9IHRoaXMucG9pbnRlcnNbaV07XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlcnMgb2Zmc2V0XHJcbiAgICAgICAgICAgIG9mZnNldCA9IHBvaW50ZXIub2Zmc2V0O1xyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCB2ZXJ0ZXggYXR0cmlidXRlXHJcbiAgICAgICAgICAgIGZvciAoIGo9MDsgajx0aGlzLnNpemU7IGorKyApIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleCA9IGF0dHJpYnV0ZVtqXTtcclxuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIGsgPSBvZmZzZXQgKyAoIHRoaXMuc3RyaWRlICogaiApO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICggcG9pbnRlci5zaXplICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2tdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMV0gPSAoIHZlcnRleC55ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrKzFdID0gKCB2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMl0gPSAoIHZlcnRleC56ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrKzFdID0gKCB2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMl0gPSAoIHZlcnRleC56ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbayszXSA9ICggdmVydGV4LncgIT09IHVuZGVmaW5lZCApID8gdmVydGV4LncgOiB2ZXJ0ZXhbM107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHNjYWxlIG9mZnNldCBhbmQgc3RyaWRlIGJ5IGJ5dGVzIHBlciBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgLy8gaXQgaXMgZG9uZSBoZXJlIGFzIGFib3ZlIGxvZ2ljIHVzZXMgc3RyaWRlIGFuZCBvZmZzZXRcclxuICAgICAgICAgICAgLy8gYXMgY29tcG9uZW50IGNvdW50cyByYXRoZXIgdGhhbiBudW1iZXIgb2YgYnl0ZVxyXG4gICAgICAgICAgICBwb2ludGVyLnN0cmlkZSA9IHRoaXMuc3RyaWRlICogQllURVNfUEVSX0NPTVBPTkVOVDtcclxuICAgICAgICAgICAgcG9pbnRlci5vZmZzZXQgPSBwb2ludGVyLm9mZnNldCAqIEJZVEVTX1BFUl9DT01QT05FTlQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhQYWNrYWdlLnByb3RvdHlwZS5idWZmZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhQYWNrYWdlLnByb3RvdHlwZS5hdHRyaWJ1dGVQb2ludGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleFBhY2thZ2U7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgU3RhY2sgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrJyksXHJcbiAgICAgICAgX3N0YWNrID0gbmV3IFN0YWNrKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0KCB2aWV3cG9ydCwgd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB2aWV3cG9ydC5nbDtcclxuICAgICAgICBpZiAoIHdpZHRoICYmIGhlaWdodCApIHtcclxuICAgICAgICAgICAgZ2wudmlld3BvcnQoIDAsIDAsIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2wudmlld3BvcnQoIDAsIDAsIHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQgKTtcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoID0gdmlld3BvcnQud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFZpZXdwb3J0KCBzcGVjICkge1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBzcGVjLndpZHRoIHx8IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gc3BlYy5oZWlnaHQgfHwgd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIHRoZSB2aWV3cG9ydCBvYmplY3RzIHdpZHRoIGFuZCBoZWlnaHQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmlld3BvcnRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVmlld3BvcnQucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIGlmICggd2lkdGggJiYgaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB2aWV3cG9ydCBvYmplY3QgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIHN0YWNrLlxyXG4gICAgICogQG1lbWJlcm9mIFZpZXdwb3J0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZpZXdwb3J0fSBUaGUgdmlld3BvcnQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgICBWaWV3cG9ydC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xyXG4gICAgICAgIF9zdGFjay5wdXNoKHtcclxuICAgICAgICAgICAgdmlld3BvcnQ6IHRoaXMsXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXQoIHRoaXMsIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQb3BzIGN1cnJlbnQgdGhlIHZpZXdwb3J0IG9iamVjdCBhbmQgc2V0cyB0aGUgdmlld3BvcnQgYmVuZWF0aCBpdC5cclxuICAgICAqIEBtZW1iZXJvZiBWaWV3cG9ydFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICAgVmlld3BvcnQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0b3A7XHJcbiAgICAgICAgX3N0YWNrLnBvcCgpO1xyXG4gICAgICAgIHRvcCA9IF9zdGFjay50b3AoKTtcclxuICAgICAgICBpZiAoIHRvcCApIHtcclxuICAgICAgICAgICAgc2V0KCB0b3Audmlld3BvcnQsIHRvcC53aWR0aCwgdG9wLmhlaWdodCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldCggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWaWV3cG9ydDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgX2JvdW5kQ29udGV4dCA9IG51bGwsXHJcbiAgICAgICAgX2NvbnRleHRzQnlJZCA9IHt9LFxyXG4gICAgICAgIEVYVEVOU0lPTlMgPSBbXHJcbiAgICAgICAgICAgIC8vIHJhdGlmaWVkXHJcbiAgICAgICAgICAgICdPRVNfdGV4dHVyZV9mbG9hdCcsXHJcbiAgICAgICAgICAgICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0JyxcclxuICAgICAgICAgICAgJ1dFQkdMX2xvc2VfY29udGV4dCcsXHJcbiAgICAgICAgICAgICdPRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxyXG4gICAgICAgICAgICAnT0VTX3ZlcnRleF9hcnJheV9vYmplY3QnLFxyXG4gICAgICAgICAgICAnV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbycsXHJcbiAgICAgICAgICAgICdXRUJHTF9kZWJ1Z19zaGFkZXJzJyxcclxuICAgICAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjJyxcclxuICAgICAgICAgICAgJ1dFQkdMX2RlcHRoX3RleHR1cmUnLFxyXG4gICAgICAgICAgICAnT0VTX2VsZW1lbnRfaW5kZXhfdWludCcsXHJcbiAgICAgICAgICAgICdFWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMnLFxyXG4gICAgICAgICAgICAnV0VCR0xfZHJhd19idWZmZXJzJyxcclxuICAgICAgICAgICAgJ0FOR0xFX2luc3RhbmNlZF9hcnJheXMnLFxyXG4gICAgICAgICAgICAnT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyJyxcclxuICAgICAgICAgICAgJ09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJyxcclxuICAgICAgICAgICAgLy8gY29tbXVuaXR5XHJcbiAgICAgICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfYXRjJyxcclxuICAgICAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YycsXHJcbiAgICAgICAgICAgICdFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQnLFxyXG4gICAgICAgICAgICAnV0VCR0xfY29sb3JfYnVmZmVyX2Zsb2F0JyxcclxuICAgICAgICAgICAgJ0VYVF9mcmFnX2RlcHRoJyxcclxuICAgICAgICAgICAgJ0VYVF9zUkdCJyxcclxuICAgICAgICAgICAgJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxJyxcclxuICAgICAgICAgICAgJ0VYVF9ibGVuZF9taW5tYXgnLFxyXG4gICAgICAgICAgICAnRVhUX3NoYWRlcl90ZXh0dXJlX2xvZCdcclxuICAgICAgICBdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIENhbnZhcyBlbGVtZW50IG9iamVjdCBmcm9tIGVpdGhlciBhbiBleGlzdGluZyBvYmplY3QsIG9yXHJcbiAgICAgKiBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxTdHJpbmd9IGFyZyAtIFRoZSBDYW52YXNcclxuICAgICAqICAgICBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7SFRNTENhbnZhc0VsZW1lbnR9IFRoZSBDYW52YXMgZWxlbWVudCBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldENhbnZhcyggYXJnICkge1xyXG4gICAgICAgIGlmICggYXJnIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgYXJnIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmc7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGFyZyA9PT0gXCJzdHJpbmdcIiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBhcmcgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRlbXB0cyB0byBsb2FkIGFsbCBrbm93biBleHRlbnNpb25zIGZvciBhIHByb3ZpZGVkXHJcbiAgICAgKiBXZWJHTFJlbmRlcmluZ0NvbnRleHQuIFN0b3JlcyB0aGUgcmVzdWx0cyBpbiB0aGUgY29udGV4dCB3cmFwcGVyIGZvclxyXG4gICAgICogbGF0ZXIgcXVlcmllcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFdyYXBwZXIgLSBUaGUgY29udGV4dCB3cmFwcGVyLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsb2FkRXh0ZW5zaW9ucyggY29udGV4dFdyYXBwZXIgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gY29udGV4dFdyYXBwZXIuZ2wsXHJcbiAgICAgICAgICAgIGV4dGVuc2lvbixcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8RVhURU5TSU9OUy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgZXh0ZW5zaW9uID0gRVhURU5TSU9OU1tpXTtcclxuICAgICAgICAgICAgY29udGV4dFdyYXBwZXIuZXh0ZW5zaW9uc1sgZXh0ZW5zaW9uIF0gPSBnbC5nZXRFeHRlbnNpb24oIGV4dGVuc2lvbiApO1xyXG4gICAgICAgICAgICBpZiAoIGNvbnRleHRXcmFwcGVyLmV4dGVuc2lvbnNbIGV4dGVuc2lvbiBdICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGV4dGVuc2lvbiArIFwiIGV4dGVuc2lvbiBsb2FkZWQgc3VjY2Vzc2Z1bGx5XCIgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBleHRlbnNpb24gKyBcIiBleHRlbnNpb24gbm90IHN1cHBvcnRlZFwiICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRlbXB0cyB0byBjcmVhdGUgYSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd3JhcHBlZCBpbnNpZGUgYW4gb2JqZWN0IHdoaWNoXHJcbiAgICAgKiB3aWxsIGFsc28gc3RvcmUgdGhlIGV4dGVuc2lvbiBxdWVyeSByZXN1bHRzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IFRoZSBDYW52YXMgZWxlbWVudCBvYmplY3QgdG9cclxuICAgICAqICAgICBjcmVhdGUgdGhlIGNvbnRleHQgdW5kZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gY29udGV4dFdyYXBwZXIgLSBUaGUgY29udGV4dCB3cmFwcGVyLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVDb250ZXh0V3JhcHBlciggY2FudmFzICkge1xyXG4gICAgICAgIHZhciBjb250ZXh0V3JhcHBlcixcclxuICAgICAgICAgICAgZ2w7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gZ2V0IFdlYkdMIGNvbnRleHQsIGZhbGxiYWNrIHRvIGV4cGVyaW1lbnRhbFxyXG4gICAgICAgICAgICBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIikgfHwgY2FudmFzLmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIik7XHJcbiAgICAgICAgICAgIC8vIHdyYXAgY29udGV4dFxyXG4gICAgICAgICAgICBjb250ZXh0V3JhcHBlciA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiBjYW52YXMuaWQsXHJcbiAgICAgICAgICAgICAgICBnbDogZ2wsXHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zOiB7fVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBsb2FkIFdlYkdMIGV4dGVuc2lvbnNcclxuICAgICAgICAgICAgbG9hZEV4dGVuc2lvbnMoIGNvbnRleHRXcmFwcGVyICk7XHJcbiAgICAgICAgICAgIC8vIGFkZCBjb250ZXh0IHdyYXBwZXIgdG8gbWFwXHJcbiAgICAgICAgICAgIF9jb250ZXh0c0J5SWRbIGNhbnZhcy5pZCBdID0gY29udGV4dFdyYXBwZXI7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGEgYm91bmQgY29udGV4dCBleGlzdHNcclxuICAgICAgICAgICAgaWYgKCAhX2JvdW5kQ29udGV4dCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGJpbmQgY29udGV4dCBpZiBubyBvdGhlciBpcyBib3VuZFxyXG4gICAgICAgICAgICAgICAgX2JvdW5kQ29udGV4dCA9IGNvbnRleHRXcmFwcGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCggZSApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggZS5tZXNzYWdlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIWdsICkge1xyXG4gICAgICAgICAgICBhbGVydCggXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG1heSBub3QgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzdXBwb3J0IGl0LlwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb250ZXh0V3JhcHBlcjtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmluZHMgYSBzcGVjaWZpYyBXZWJHTCBjb250ZXh0IGFzIHRoZSBhY3RpdmUgY29udGV4dC4gVGhpcyBjb250ZXh0XHJcbiAgICAgICAgICogd2lsbCBiZSB1c2VkIGZvciBhbGwgY29kZSAvd2ViZ2wuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtXZWJHTENvbnRleHR9IFRoaXMgbmFtZXNwYWNlLCB1c2VkIGZvciBjaGFpbmluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBiaW5kOiBmdW5jdGlvbiggYXJnICkge1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZ2V0Q2FudmFzKCBhcmcgKTtcclxuICAgICAgICAgICAgaWYgKCAhY2FudmFzICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJDb250ZXh0IGNvdWxkIG5vdCBiZSBib3VuZCBmb3IgYXJndW1lbnQgb2YgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZSAnXCIrKCB0eXBlb2YgYXJnICkrXCInLCBjb21tYW5kIGlnbm9yZWQuXCIgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICggIV9jb250ZXh0c0J5SWRbIGNhbnZhcy5pZCBdICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJObyBjb250ZXh0IGV4aXN0cyBmb3IgcHJvdmlkZWQgYXJndW1lbnQgJ1wiICtcclxuICAgICAgICAgICAgICAgICAgICBhcmcgKyBcIicsIGNvbW1hbmQgaWdub3JlZC5cIiApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9ib3VuZENvbnRleHQgPSBfY29udGV4dHNCeUlkWyBjYW52YXMuaWQgXTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBvciByZXRyZWl2ZXMgYW4gZXhpc3RpbmcgV2ViR0wgY29udGV4dCBmb3IgYSBwcm92aWRlZFxyXG4gICAgICAgICAqIGNhbnZhcyBvYmplY3QuIER1cmluZyBjcmVhdGlvbiBhdHRlbXB0cyB0byBsb2FkIGFsbCBleHRlbnNpb25zIGZvdW5kXHJcbiAgICAgICAgICogYXQ6IGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL2V4dGVuc2lvbnMvLiBJZiBub1xyXG4gICAgICAgICAqIGFyZ3VtZW50IGlzIHByb3ZpZGVkIGl0IHdpbGwgYXR0ZW1wdCB0byByZXR1cm4gdGhlIGN1cnJlbnRseSBib3VuZFxyXG4gICAgICAgICAqIGNvbnRleHQuIElmIG5vIGNvbnRleHQgaXMgYm91bmQsIGl0IHdpbGwgcmV0dXJuICdudWxsJy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzIG9iamVjdCBvciBDYW52YXMgaWRlbnRpZmljYXRpb24gc3RyaW5nLiBPcHRpb25hbC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgY29udGV4dCBvYmplY3QuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiggYXJnICkge1xyXG4gICAgICAgICAgICBpZiAoICFhcmcgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFfYm91bmRDb250ZXh0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vIGJvdW5kIGNvbnRleHQgb3IgYXJndW1lbnRcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIk5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm92aWRlZCwgcmV0dXJuaW5nICdudWxsJy5cIiApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGxhc3QgYm91bmQgY29udGV4dFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9ib3VuZENvbnRleHQuZ2w7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZ2V0IGNhbnZhcyBlbGVtZW50XHJcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBnZXRDYW52YXMoIGFyZyApO1xyXG4gICAgICAgICAgICAvLyB0cnkgdG8gZmluZCBvciBjcmVhdGUgY29udGV4dFxyXG4gICAgICAgICAgICBpZiAoICFjYW52YXMgfHwgKCAhX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF0gJiYgIWNyZWF0ZUNvbnRleHRXcmFwcGVyKCBjYW52YXMgKSApICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJDb250ZXh0IGNvdWxkIG5vdCBiZSBmb3VuZCBvciBjcmVhdGVkIGZvciBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhcmd1bWVudCBvZiB0eXBlJ1wiKyggdHlwZW9mIGFyZyApK1wiJywgcmV0dXJuaW5nICdudWxsJy5cIiApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0c0J5SWRbIGNhbnZhcy5pZCBdLmdsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENoZWNrcyBpZiBhbiBleHRlbnNpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBieSB0aGUgcHJvdmlkZWRcclxuICAgICAgICAgKiBjYW52YXMgb2JqZWN0LiBJZiBubyBhcmd1bWVudCBpcyBwcm92aWRlZCBpdCB3aWxsIGF0dGVtcHQgdG8gcmV0dXJuXHJcbiAgICAgICAgICogdGhlIGN1cnJlbnRseSBib3VuZCBjb250ZXh0LiBJZiBubyBjb250ZXh0IGlzIGJvdW5kLCBpdCB3aWxsIHJldHVyblxyXG4gICAgICAgICAqICdmYWxzZScuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvbiAtIFRoZSBleHRlbnNpb24gbmFtZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvdmlkZWQgZXh0ZW5zaW9uIGhhcyBiZWVuIGxvYWRlZCBzdWNjZXNzZnVsbHkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2hlY2tFeHRlbnNpb246IGZ1bmN0aW9uKCBhcmcsIGV4dGVuc2lvbiApIHtcclxuICAgICAgICAgICAgdmFyIGV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2FudmFzO1xyXG4gICAgICAgICAgICBpZiAoICFleHRlbnNpb24gKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjYW4gY2hlY2sgZXh0ZW5zaW9uIHdpdGhvdXQgYXJnXHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBhcmc7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gX2JvdW5kQ29udGV4dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbnZhcyA9IGdldENhbnZhcyggYXJnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGNhbnZhcyApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCAhY29udGV4dCApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBwcm92aWRlZCBhcyBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhcmd1bWVudCwgcmV0dXJuaW5nIGZhbHNlLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBleHRlbnNpb25zID0gY29udGV4dC5leHRlbnNpb25zO1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5zaW9uc1sgZXh0ZW5zaW9uIF0gPyBleHRlbnNpb25zWyBleHRlbnNpb24gXSA6IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEFuaW1hdGlvbiggc3BlYyApIHtcclxuICAgICAgICB0aGlzLnRhcmdldHMgPSBzcGVjLnRhcmdldHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb247XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhbGZhZG9yID0gcmVxdWlyZSgnYWxmYWRvcicpLFxyXG4gICAgICAgIFRyYW5zZm9ybSA9IGFsZmFkb3IuVHJhbnNmb3JtLFxyXG4gICAgICAgIE1hdDQ0ID0gYWxmYWRvci5NYXQ0NCxcclxuICAgICAgICBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpO1xyXG5cclxuICAgIGZ1bmN0aW9uIENhbWVyYSggc3BlYyApIHtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICAvLyBjYWxsIGJhc2UgY29uc3RydWN0b3IgZm9yIHRyYW5zZm9ybVxyXG4gICAgICAgIFRyYW5zZm9ybS5jYWxsKCB0aGlzLCBzcGVjICk7XHJcbiAgICAgICAgLy8gc2V0IGlkIGlmIHRoZXJlIGlzIG9uZVxyXG4gICAgICAgIGlmICggc3BlYy5pZCApIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IHNwZWMuaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy5wcm9qZWN0aW9uICkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3Rpb25NYXRyaXgoIHNwZWMucHJvamVjdGlvbiApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdGlvbk1hdHJpeCh7XHJcbiAgICAgICAgICAgICAgICBmb3Y6IDQ1LFxyXG4gICAgICAgICAgICAgICAgYXNwZWN0OiA0LzMsXHJcbiAgICAgICAgICAgICAgICBtaW5aOiAwLjEsXHJcbiAgICAgICAgICAgICAgICBtYXhaOiAxMDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgcGFyZW50XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBzcGVjLnBhcmVudCB8fCBudWxsO1xyXG4gICAgICAgIC8vIHNldCBjaGlsZHJlblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBpZiAoIHNwZWMuY2hpbGRyZW4gKSB7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxzcGVjLmNoaWxkcmVuLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCggc3BlYy5jaGlsZHJlbltpXSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIENhbWVyYS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBFbnRpdHkucHJvdG90eXBlICk7XHJcblxyXG4gICAgQ2FtZXJhLnByb3RvdHlwZS5wcm9qZWN0aW9uTWF0cml4ID0gZnVuY3Rpb24oIHByb2plY3Rpb24gKSB7XHJcbiAgICAgICAgaWYgKCBwcm9qZWN0aW9uICkge1xyXG4gICAgICAgICAgICBpZiAoIHByb2plY3Rpb24gaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGlvbiA9IG5ldyBNYXQ0NCggcHJvamVjdGlvbiApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBwcm9qZWN0aW9uIGluc3RhbmNlb2YgTWF0NDQgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBwcm9qZWN0aW9uO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gTWF0NDQucGVyc3BlY3RpdmUoXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbi5mb3YgfHwgNDUsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbi5hc3BlY3QgfHwgNC8zLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uek1pbiB8fCAwLjEsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbi56TWF4IHx8IDEwMDAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdGlvbjtcclxuICAgIH07XHJcblxyXG4gICAgQ2FtZXJhLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSBuZXcgQ2FtZXJhKHtcclxuICAgICAgICAgICAgICAgIHVwOiB0aGlzLnVwKCksXHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkOiB0aGlzLmZvcndhcmQoKSxcclxuICAgICAgICAgICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4oKSxcclxuICAgICAgICAgICAgICAgIHByb2plY3Rpb246IG5ldyBNYXQ0NCggdGhpcy5wcm9qZWN0aW9uIClcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gY29weSBjaGlsZHJlbiBieSB2YWx1ZVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTx0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB0aGF0LmFkZENoaWxkKCB0aGlzLmNoaWxkcmVuW2ldLmNvcHkoKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhhdDtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDYW1lcmE7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCdhbGZhZG9yJykuVHJhbnNmb3JtLFxyXG4gICAgICAgIE1lc2ggPSByZXF1aXJlKCcuL01lc2gnKSxcclxuICAgICAgICBTa2VsZXRvbiA9IHJlcXVpcmUoJy4vU2tlbGV0b24nKSxcclxuICAgICAgICBBbmltYXRpb24gPSByZXF1aXJlKCcuL0FuaW1hdGlvbicpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEVudGl0eSggc3BlYyApIHtcclxuICAgICAgICB2YXIga2V5LCBpO1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBjb25zdHJ1Y3RvciBmb3IgdHJhbnNmb3JtXHJcbiAgICAgICAgVHJhbnNmb3JtLmNhbGwoIHRoaXMsIHNwZWMgKTtcclxuICAgICAgICAvLyBzZXQgaWQgaWYgdGhlcmUgaXMgb25lXHJcbiAgICAgICAgaWYgKCBzcGVjLmlkICkge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gc3BlYy5pZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHBhcmVudFxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gc3BlYy5wYXJlbnQgfHwgbnVsbDtcclxuICAgICAgICAvLyBzZXQgY2hpbGRyZW5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgaWYgKCBzcGVjLmNoaWxkcmVuICkge1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8c3BlYy5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoIHNwZWMuY2hpbGRyZW5baV0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWVzaGVzXHJcbiAgICAgICAgdGhpcy5tZXNoZXMgPSBbXTtcclxuICAgICAgICBpZiAoIHNwZWMubWVzaGVzICkge1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8c3BlYy5tZXNoZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHNwZWMubWVzaGVzW2ldIGluc3RhbmNlb2YgTWVzaCApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc2hlcy5wdXNoKCBzcGVjLm1lc2hlc1tpXSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc2hlcy5wdXNoKCBuZXcgTWVzaCggc3BlYy5tZXNoZXNbaV0gKSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBza2VsZXRvbiwgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgdGhpcy5za2VsZXRvbiA9IG51bGw7XHJcbiAgICAgICAgaWYgKCBzcGVjLnNrZWxldG9uICkge1xyXG4gICAgICAgICAgICBpZiAoIHNwZWMuc2tlbGV0b24gaW5zdGFuY2VvZiBTa2VsZXRvbiApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2tlbGV0b24gPSBzcGVjLnNrZWxldG9uO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5za2VsZXRvbiA9IG5ldyBTa2VsZXRvbiggc3BlYy5tZXNoZXNbaV0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgYW5pbWF0aW9ucywgaWYgdGhleSBleGlzdFxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9ucyA9IHt9O1xyXG4gICAgICAgIGlmICggc3BlYy5hbmltYXRpb25zICkge1xyXG4gICAgICAgICAgICBmb3IgKCBrZXkgaW4gc3BlYy5hbmltYXRpb25zICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBzcGVjLmFuaW1hdGlvbnMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc3BlYy5hbmltYXRpb25zWyBrZXkgXSBpbnN0YW5jZW9mIEFuaW1hdGlvbiApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zWyBrZXkgXSA9IHNwZWMuYW5pbWF0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbIGtleSBdID0gbmV3IEFuaW1hdGlvbiggc3BlYy5hbmltYXRpb25zICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBUcmFuc2Zvcm0ucHJvdG90eXBlICk7XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5nbG9iYWxNYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIHRoaXMucGFyZW50ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2xvYmFsTWF0cml4KCkubXVsdCggdGhpcy5tYXRyaXgoKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tYXRyaXgoKTtcclxuICAgIH07XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5nbG9iYWxWaWV3TWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCB0aGlzLnBhcmVudCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm11bHQoIHRoaXMubWF0cml4KCkgKS52aWV3TWF0cml4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdNYXRyaXgoKTtcclxuICAgIH07XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uKCBjaGlsZCApIHtcclxuICAgICAgICBpZiAoICEoIGNoaWxkIGluc3RhbmNlb2YgRW50aXR5ICkgKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gbmV3IEVudGl0eSggY2hpbGQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGNoaWxkICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbiggY2hpbGQgKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKCBjaGlsZCApO1xyXG4gICAgICAgIGlmICggaW5kZXggIT09IC0xICkge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSggaW5kZXgsIDEgKTtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcclxuICAgICAgICB2YXIgY2hpbGQsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgY2FsbGJhY2soIHRoaXMgKTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAoIGNoaWxkLmZvckVhY2ggKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5mb3JFYWNoKCBjYWxsYmFjayApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBFbnRpdHkucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IG5ldyBFbnRpdHkoe1xyXG4gICAgICAgICAgICAgICAgdXA6IHRoaXMudXAoKSxcclxuICAgICAgICAgICAgICAgIGZvcndhcmQ6IHRoaXMuZm9yd2FyZCgpLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbigpLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUoKSxcclxuICAgICAgICAgICAgICAgIG1lc2hlczogdGhpcy5tZXNoZXMsIC8vIGNvcHkgYnkgcmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgc2tlbGV0b246IHRoaXMuc2tlbGV0b24sIC8vIGNvcHkgYnkgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb25zOiB0aGlzLmFuaW1hdGlvbnMgLy8gY29weSBieSByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gY29weSBjaGlsZHJlbiBieSB2YWx1ZVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTx0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB0aGF0LmFkZENoaWxkKCB0aGlzLmNoaWxkcmVuW2ldLmNvcHkoKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhhdDtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBmdW5jdGlvbiBHZW9tZXRyeSggc3BlYyApIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBzcGVjLnBvc2l0aW9ucztcbiAgICAgICAgdGhpcy51dnMgPSBzcGVjLnV2cztcbiAgICAgICAgdGhpcy5ub3JtYWxzID0gc3BlYy5ub3JtYWxzO1xuICAgICAgICB0aGlzLnRhbmdlbnRzID0gc3BlYy50YW5nZW50cztcbiAgICAgICAgdGhpcy5iaXRhbmdlbnRzID0gc3BlYy5iaXRhbmdlbnRzO1xuICAgICAgICB0aGlzLmluZGljZXMgPSBzcGVjLmluZGljZXM7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gSm9pbnQoIHNwZWMgKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IHNwZWMuaWQ7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gc3BlYy5uYW1lO1xyXG4gICAgICAgIHRoaXMuYmluZE1hdHJpeCA9IHNwZWMuYmluZE1hdHJpeDtcclxuICAgICAgICB0aGlzLmludmVyc2VCaW5kTWF0cml4ID0gc3BlYy5pbnZlcnNlQmluZE1hdHJpeDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHNwZWMucGFyZW50O1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBzcGVjLmNoaWxkcmVuO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBzcGVjLmluZGV4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIEpvaW50LnByb3RvdHlwZS5za2lubmluZ01hdHJpeCA9IGZ1bmN0aW9uKCBiaW5kU2hhcGVNYXRyaXgsIHBvc2VNYXRyaXggKSB7XHJcbiAgICAgICAgLy8gaWYgbm8gcG9zZSBtYXRyaXggaXMgcHJvdmlkZWQsIGRlZmF1bHQgdG8gYmluZCBwb3NpdGlvblxyXG4gICAgICAgIHBvc2VNYXRyaXggPSBwb3NlTWF0cml4IHx8IHRoaXMuYmluZE1hdHJpeDtcclxuICAgICAgICAvLyB1cGRhdGUgZ2xvYmFsVHJhbnNmb3JtLCBjaGlsZHJlbiB3aWxsIHJlbHkgb24gdGhlc2VcclxuICAgICAgICBpZiAoIHRoaXMucGFyZW50ICkge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbE1hdHJpeCA9IHRoaXMucGFyZW50Lmdsb2JhbE1hdHJpeC5tdWx0KCBwb3NlTWF0cml4ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxNYXRyaXggPSBwb3NlTWF0cml4O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXR1cm4gc2tpbm5pbmcgbWF0cml4XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsTWF0cml4Lm11bHQoIHRoaXMuaW52ZXJzZUJpbmRNYXRyaXgubXVsdCggYmluZFNoYXBlTWF0cml4ICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBKb2ludDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4uL2NvcmUvVGV4dHVyZTJEJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVGV4dHVyZSggdGV4dHVyZSApIHtcclxuICAgICAgICBpZiAoICF0ZXh0dXJlICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhKCB0ZXh0dXJlIGluc3RhbmNlb2YgVGV4dHVyZTJEICkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVGV4dHVyZTJEKHtcclxuICAgICAgICAgICAgICAgIGltYWdlOiB0ZXh0dXJlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZUNvbG9yKCBjb2xvciApIHtcclxuICAgICAgICBpZiAoIGNvbG9yIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdIHx8IDEuMCBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWwoIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5pZCA9IHNwZWMuaWQ7XHJcbiAgICAgICAgdGhpcy5kaWZmdXNlQ29sb3IgPSBwYXJzZUNvbG9yKCBzcGVjLmRpZmZ1c2VDb2xvciApIHx8IFsgMSwgMCwgMSwgMSBdO1xyXG4gICAgICAgIHRoaXMuZGlmZnVzZVRleHR1cmUgPSBjcmVhdGVUZXh0dXJlKCBzcGVjLmRpZmZ1c2VUZXh0dXJlICkgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmFtYmllbnRDb2xvciA9IHBhcnNlQ29sb3IoIHNwZWMuYW1iaWVudENvbG9yICkgfHwgWyAwLCAwLCAwLCAxIF07XHJcbiAgICAgICAgdGhpcy5hbWJpZW50VGV4dHVyZSA9IGNyZWF0ZVRleHR1cmUoIHNwZWMuYW1iaWVudFRleHR1cmUgKSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuc3BlY3VsYXJDb2xvciA9IHBhcnNlQ29sb3IoIHNwZWMuc3BlY3VsYXJDb2xvciApIHx8IFsgMSwgMSwgMSwgMSBdO1xyXG4gICAgICAgIHRoaXMuc3BlY3VsYXJUZXh0dXJlID0gY3JlYXRlVGV4dHVyZSggc3BlYy5zcGVjdWxhclRleHR1cmUgKSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuc3BlY3VsYXJDb21wb25lbnQgPSBzcGVjLnNwZWN1bGFyQ29tcG9uZW50IHx8IDEwO1xyXG4gICAgICAgIHRoaXMucmVmbGVjdGlvbiA9ICggc3BlYy5yZWZsZWN0aW9uICE9PSB1bmRlZmluZWQgKSA/IHNwZWMucmVmbGVjdGlvbiA6IDA7XHJcbiAgICAgICAgdGhpcy5yZWZyYWN0aW9uID0gKCBzcGVjLnJlZnJhY3Rpb24gIT09IHVuZGVmaW5lZCApID8gc3BlYy5yZWZyYWN0aW9uIDogMDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0dlb21ldHJ5JyksXHJcbiAgICAgICAgUmVuZGVyYWJsZSA9IHJlcXVpcmUoJy4vUmVuZGVyYWJsZScpLFxyXG4gICAgICAgIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9NYXRlcmlhbCcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1lc2goIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgLy8gc2V0IGdlb21ldHJ5XHJcbiAgICAgICAgaWYgKCBzcGVjLmdlb21ldHJ5ICkge1xyXG4gICAgICAgICAgICBpZiAoIHNwZWMuZ2VvbWV0cnkgaW5zdGFuY2VvZiBHZW9tZXRyeSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VvbWV0cnkgPSBzcGVjLmdlb21ldHJ5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSggc3BlYy5nZW9tZXRyeSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSggc3BlYyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgcmVuZGVyYWJsZVxyXG4gICAgICAgIGlmICggc3BlYy5yZW5kZXJhYmxlICkge1xyXG4gICAgICAgICAgICBpZiAoIHNwZWMucmVuZGVyYWJsZSBpbnN0YW5jZW9mIFJlbmRlcmFibGUgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmFibGUgPSBzcGVjLnJlbmRlcmFibGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmFibGUgPSBuZXcgUmVuZGVyYWJsZSggc3BlYy5yZW5kZXJhYmxlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmFibGUgPSBuZXcgUmVuZGVyYWJsZSggc3BlYyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgbWF0ZXJpYWxcclxuICAgICAgICBpZiAoIHNwZWMubWF0ZXJpYWwgKSB7XHJcbiAgICAgICAgICAgIGlmICggc3BlYy5tYXRlcmlhbCBpbnN0YW5jZW9mIE1hdGVyaWFsICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbCA9IHNwZWMubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCBzcGVjLm1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCBzcGVjICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1lc2gucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmFibGUuZHJhdygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1lc2g7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgYWxmYWRvciA9IHJlcXVpcmUoJ2FsZmFkb3InKSxcclxuICAgICAgICBUcmlhbmdsZSA9IGFsZmFkb3IuVHJpYW5nbGUsXHJcbiAgICAgICAgVmVjMyA9IGFsZmFkb3IuVmVjMyxcclxuICAgICAgICBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpLFxyXG4gICAgICAgIE1lc2ggPSByZXF1aXJlKCcuL01lc2gnKSxcclxuICAgICAgICBERUZBVUxUX0RFUFRIID0gNCxcclxuICAgICAgICBNSU5fVkVDID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIE51bWJlci5NSU5fVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NSU5fVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NSU5fVkFMVUUgKSxcclxuICAgICAgICBNQVhfVkVDID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIE51bWJlci5NQVhfVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NQVhfVkFMVUUsXHJcbiAgICAgICAgICAgIE51bWJlci5NQVhfVkFMVUUgKSxcclxuICAgICAgICBfY3ViZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmRzIHRoZSBtaW5pbnVtIGFuZCBtYXhpbXVtIGJvdW5kaW5nIGV4dGVudHMgd2l0aGluIGEgc2V0IG9mIHRyaWFuZ2xlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0cmlhbmdsZXMgLSBUaGUgYXJyYXkgb2YgdHJpYW5nbGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHBvaW50cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWluTWF4KCB0cmlhbmdsZXMgKSB7XHJcbiAgICAgICAgdmFyIG1pbiA9IE1BWF9WRUMsXHJcbiAgICAgICAgICAgIG1heCA9IE1JTl9WRUMsXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlLFxyXG4gICAgICAgICAgICBhLCBiLCBjLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTx0cmlhbmdsZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHRyaWFuZ2xlID0gdHJpYW5nbGVzW2ldO1xyXG4gICAgICAgICAgICBhID0gdHJpYW5nbGUuYTtcclxuICAgICAgICAgICAgYiA9IHRyaWFuZ2xlLmI7XHJcbiAgICAgICAgICAgIGMgPSB0cmlhbmdsZS5jO1xyXG4gICAgICAgICAgICAvLyBnZXQgbWluXHJcbiAgICAgICAgICAgIG1pbi54ID0gTWF0aC5taW4oIG1pbi54LCBNYXRoLm1pbiggTWF0aC5taW4oIGEueCwgYi54ICksIGMueCApICk7XHJcbiAgICAgICAgICAgIG1pbi55ID0gTWF0aC5taW4oIG1pbi55LCBNYXRoLm1pbiggTWF0aC5taW4oIGEueSwgYi55ICksIGMueSApICk7XHJcbiAgICAgICAgICAgIG1pbi56ID0gTWF0aC5taW4oIG1pbi56LCBNYXRoLm1pbiggTWF0aC5taW4oIGEueiwgYi56ICksIGMueiApICk7XHJcbiAgICAgICAgICAgIC8vIGdldCBtYXhcclxuICAgICAgICAgICAgbWF4LnggPSBNYXRoLm1heCggbWF4LngsIE1hdGgubWF4KCBNYXRoLm1heCggYS54LCBiLnggKSwgYy54ICkgKTtcclxuICAgICAgICAgICAgbWF4LnkgPSBNYXRoLm1heCggbWF4LnksIE1hdGgubWF4KCBNYXRoLm1heCggYS55LCBiLnkgKSwgYy55ICkgKTtcclxuICAgICAgICAgICAgbWF4LnogPSBNYXRoLm1heCggbWF4LnosIE1hdGgubWF4KCBNYXRoLm1heCggYS56LCBiLnogKSwgYy56ICkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWluOiBtaW4sXHJcbiAgICAgICAgICAgIG1heDogbWF4XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc2VydHMgYSB0cmlhbmdsZSBpbnRvIHRoZSBvY3RyZWVzIGNoaWxkIGRlcGVuZGluZyBvbiBpdHMgcG9zaXRpb25cclxuICAgICAqIHdpdGhpbiB0aGUgbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09jdHJlZX0gb2N0cmVlIC0gVGhlIG9jdHJlZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IGluZGV4IC0gVGhlIGNoaWxkIGluZGV4IGZyb20gMC03XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdHJpYW5nbGUgLSBUaGUgdHJpYW5nbGUgb2JqZWN0IHRvIGJlIGluc2VydGVkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbnNlcnRJbnRvQ2hpbGQoIG9jdHJlZSwgaW5kZXgsIHRyaWFuZ2xlICkge1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSBuZXcgVmVjMyggMCwgMCwgMCApLFxyXG4gICAgICAgICAgICBzdGVwO1xyXG4gICAgICAgIGlmICggb2N0cmVlLmNoaWxkcmVuWyBpbmRleCBdICkge1xyXG4gICAgICAgICAgICAvLyBjaGlsZCBhbHJlYWR5IGV4aXN0cywgcmVjdXJzaXZlbHkgaW5zZXJ0XHJcbiAgICAgICAgICAgIG9jdHJlZS5jaGlsZHJlblsgaW5kZXggXS5pbnNlcnQoIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY2hpbGQgZG9lcyBub3QgZXhpc3RcclxuICAgICAgICAgICAgLy8gaWYgdGVybWluYWwgZGVwdGggaGFzIG5vdCBiZWVuIHJlYWNoZWQsIGNyZWF0ZSBjaGlsZCBub2RlXHJcbiAgICAgICAgICAgIGlmICggb2N0cmVlLmRlcHRoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHN0ZXAgPSBvY3RyZWUuaGFsZldpZHRoIC8gMjtcclxuICAgICAgICAgICAgICAgIG9mZnNldC54ID0gKCAoaW5kZXggJiAxKSA/IHN0ZXAgOiAtc3RlcCApO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0LnkgPSAoIChpbmRleCAmIDIpID8gc3RlcCA6IC1zdGVwICk7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQueiA9ICggKGluZGV4ICYgNCkgPyBzdGVwIDogLXN0ZXAgKTtcclxuICAgICAgICAgICAgICAgIC8vIHBhc3MgbnVsbCB0cmlhbmdsZXMgYXJnIHRvIGZvcmNlIGVsc2UgaW4gY29uc3RydWN0b3JcclxuICAgICAgICAgICAgICAgIG9jdHJlZS5jaGlsZHJlblsgaW5kZXggXSA9IG5ldyBPY3RyZWUoIG51bGwsIHtcclxuICAgICAgICAgICAgICAgICAgIGNlbnRlcjogb2N0cmVlLmNlbnRlci5hZGQoIG9mZnNldCApLFxyXG4gICAgICAgICAgICAgICAgICAgaGFsZldpZHRoOiBzdGVwLFxyXG4gICAgICAgICAgICAgICAgICAgZGVwdGggOiBvY3RyZWUuZGVwdGgtMVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBvY3RyZWUuY2hpbGRyZW5bIGluZGV4IF0uaW5zZXJ0KCB0cmlhbmdsZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgcG9pbnQgYW5kXHJcbiAgICAgKiBhbiBvY3RyZWUncyBjaGlsZCdzIEFBQkIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPY3RyZWV9IG9jdHJlZSAtIFRoZSBvY3RyZWUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIG1lYXN1cmUgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gY2hpbGQgLSBUaGUgQUFCQiBjaGlsZCBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3F1YXJlZCBkaXN0YW5jZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc3FyRGlzdEZyb21Qb2ludCggb2N0cmVlLCBwb2ludCwgY2hpbGQgKSB7XHJcbiAgICAgICAgLy8gc2hpZnQgQUFCQiBkaW1lc2lvbnMgYmFzZWQgb24gd2hpY2ggY2hpbGQgY2VsbCBpcyBiZWdpbiB0ZXN0ZWRcclxuICAgICAgICB2YXIgb2Zmc2V0Q2VudGVyID0gbmV3IFZlYzMoIG9jdHJlZS5jZW50ZXIgKSxcclxuICAgICAgICAgICAgc3RlcCA9IG9jdHJlZS5oYWxmV2lkdGggLyAyLFxyXG4gICAgICAgICAgICBzcXJEaXN0ID0gMCxcclxuICAgICAgICAgICAgbWluQUFCQixcclxuICAgICAgICAgICAgbWF4QUFCQjtcclxuICAgICAgICBvZmZzZXRDZW50ZXIueCArPSAoIChjaGlsZCAmIDEpID8gc3RlcCA6IC1zdGVwICk7XHJcbiAgICAgICAgb2Zmc2V0Q2VudGVyLnkgKz0gKCAoY2hpbGQgJiAyKSA/IHN0ZXAgOiAtc3RlcCApO1xyXG4gICAgICAgIG9mZnNldENlbnRlci56ICs9ICggKGNoaWxkICYgNCkgPyBzdGVwIDogLXN0ZXAgKTtcclxuICAgICAgICBtaW5BQUJCID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIG9mZnNldENlbnRlci54IC0gc3RlcCxcclxuICAgICAgICAgICAgb2Zmc2V0Q2VudGVyLnkgLSBzdGVwLFxyXG4gICAgICAgICAgICBvZmZzZXRDZW50ZXIueiAtIHN0ZXAgKTtcclxuICAgICAgICBtYXhBQUJCID0gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIG9mZnNldENlbnRlci54ICsgc3RlcCxcclxuICAgICAgICAgICAgb2Zmc2V0Q2VudGVyLnkgKyBzdGVwLFxyXG4gICAgICAgICAgICBvZmZzZXRDZW50ZXIueiArIHN0ZXAgKTtcclxuICAgICAgICAvLyBGb3IgZWFjaCBheGlzIGNvdW50IGFueSBleGNlc3MgZGlzdGFuY2Ugb3V0c2lkZSBib3ggZXh0ZW50c1xyXG4gICAgICAgIC8vIHhcclxuICAgICAgICBpZiAocG9pbnQueCA8IG1pbkFBQkIueCkgeyBzcXJEaXN0ICs9IChtaW5BQUJCLnggLSBwb2ludC54KSAqIChtaW5BQUJCLnggLSBwb2ludC54KTsgfVxyXG4gICAgICAgIGlmIChwb2ludC54ID4gbWF4QUFCQi54KSB7IHNxckRpc3QgKz0gKHBvaW50LnggLSBtYXhBQUJCLngpICogKHBvaW50LnggLSBtYXhBQUJCLngpOyB9XHJcbiAgICAgICAgLy8geVxyXG4gICAgICAgIGlmIChwb2ludC55IDwgbWluQUFCQi55KSB7IHNxckRpc3QgKz0gKG1pbkFBQkIueSAtIHBvaW50LnkpICogKG1pbkFBQkIueSAtIHBvaW50LnkpOyB9XHJcbiAgICAgICAgaWYgKHBvaW50LnkgPiBtYXhBQUJCLnkpIHsgc3FyRGlzdCArPSAocG9pbnQueSAtIG1heEFBQkIueSkgKiAocG9pbnQueSAtIG1heEFBQkIueSk7IH1cclxuICAgICAgICAvLyB6XHJcbiAgICAgICAgaWYgKHBvaW50LnogPCBtaW5BQUJCLnopIHsgc3FyRGlzdCArPSAobWluQUFCQi56IC0gcG9pbnQueikgKiAobWluQUFCQi56IC0gcG9pbnQueik7IH1cclxuICAgICAgICBpZiAocG9pbnQueiA+IG1heEFBQkIueikgeyBzcXJEaXN0ICs9IChwb2ludC56IC0gbWF4QUFCQi56KSAqIChwb2ludC56IC0gbWF4QUFCQi56KTsgfVxyXG4gICAgICAgIHJldHVybiBzcXJEaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgYSBzcGhlcmUgZGVmaW5lZCBieSBhIHBvaW50IGFuZCByYWRpdXMgaW50ZXJzZWN0cyBhbiBvY3RyZWUnc1xyXG4gICAgICogY2hpbGQncyBBQUJCLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2N0cmVlfSBvY3RyZWUgLSBUaGUgb2N0cmVlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZW50ZXIgLSBUaGUgY2VudGVyIG9mIHRoZSBzcGhlcmUgdG8gbWVhc3VyZSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIHNwaGVyZS5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gY2hpbGQgLSBUaGUgQUFCQiBjaGlsZCBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaW50ZXJlY3RzIHRoZSBBQUJCIGNoaWxkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzcGhlcmVDaGVjayggb2N0cmVlLCBjZW50ZXIsIHJhZGl1cywgY2hpbGQgKSB7XHJcbiAgICAgICAgLy8gY29tcHV0ZSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gc3BoZXJlIGNlbnRyZSBhbmQgQUFCQlxyXG4gICAgICAgIHZhciBkaXN0ID0gc3FyRGlzdEZyb21Qb2ludCggb2N0cmVlLCBjZW50ZXIsIGNoaWxkICk7XHJcbiAgICAgICAgLy8gc3BoZXJlIGFuZCBBQUJCIGludGVyc2VjdCBpZiB0aGUgZGlzdGFuY2UgaXMgbGVzcyB0aGFuIHRoZSByYWRpdXNcclxuICAgICAgICByZXR1cm4gZGlzdCA8PSByYWRpdXMqcmFkaXVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgc2luZ2xldG9uIGN1YmUgTWVzaCBvYmplY3QgZm9yIHRoZSBvY3RyZWUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01lc2h9IFRoZSBzaW5nbGV0b24gY3ViZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q3ViZU1lc2goKSB7XHJcbiAgICAgICAgaWYgKCAhX2N1YmUgKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZnJvbnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgICAgIFsgLTEsIC0xLCAxIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAxLCAtMSwgMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgMSwgMSwgMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgLTEsIDEsIDEgXSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBiYWNrIGZhY2VcclxuICAgICAgICAgICAgICAgICAgICBbIC0xLCAtMSwgLTEgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIDEsIC0xLCAtMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgMSwgMSwgLTEgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIC0xLCAxLCAtMSBdXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyBmcm9udFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDEsIDEsIDIsIDIsIDMsIDMsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2lkZXNcclxuICAgICAgICAgICAgICAgICAgICAwLCA0LCAxLCA1LCAyLCA2LCAzLCA3LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhY2tcclxuICAgICAgICAgICAgICAgICAgICA0LCA1LCA1LCA2LCA2LCA3LCA3LCA0XHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBfY3ViZSA9IG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uczogcG9zaXRpb25zLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBcIkxJTkVTXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfY3ViZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhbiBhcnJheSBvZiBFbnRpdHkgb2JqZWN0cyB3aXRoIGEgTWVzaCBjb21wb25lbnQgZm9yIHRoZVxyXG4gICAgICogb2N0cmVlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2N0cmVlfSBvY3RyZWUgLSBUaGUgb2N0cmVlIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBvZiBlbnRpdGllcy5cclxuICAgICAqL1xyXG4gICBmdW5jdGlvbiBnZW5lcmF0ZVN1YkVudGl0aWVzKCBvY3RyZWUgKSB7XHJcbiAgICAgICAgdmFyIGVudGl0aWVzID0gW10sXHJcbiAgICAgICAgICAgIGNvdW50ID0gMCxcclxuICAgICAgICAgICAgZW50aXR5LFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBlbnRpdHkgZm9yIG9jdHJlZVxyXG4gICAgICAgIGVudGl0eSA9IG5ldyBFbnRpdHkoe1xyXG4gICAgICAgICAgICBtZXNoZXM6IFsgZ2V0Q3ViZU1lc2goKSBdLFxyXG4gICAgICAgICAgICBvcmlnaW46IG9jdHJlZS5jZW50ZXIsXHJcbiAgICAgICAgICAgIHNjYWxlOiBvY3RyZWUuaGFsZldpZHRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggY2hpbGRcclxuICAgICAgICBmb3IgKCBpPTA7IGk8ODsgaSsrICkge1xyXG4gICAgICAgICAgICAvLyBpZiBjaGlsZCBleGlzdHNcclxuICAgICAgICAgICAgaWYgKCBvY3RyZWUuY2hpbGRyZW5baV0gKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRpdGllcyA9IGVudGl0aWVzLmNvbmNhdChcclxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVN1YkVudGl0aWVzKCBvY3RyZWUuY2hpbGRyZW5baV0gKSApO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvbmx5IGNyZWF0ZSBpZiB0aGlzIG9jdHJlZSBjb250YWlucyBvYmplY3RzLCBvciBoYXMgY2hpbGRyZW4gdGhhdFxyXG4gICAgICAgIC8vIGNvbnRhaW4gb2JqZWN0c1xyXG4gICAgICAgIGlmICggb2N0cmVlLmNvbnRhaW5lZC5sZW5ndGggPiAwIHx8IGNvdW50ID4gMCApIHtcclxuICAgICAgICAgICAgZW50aXRpZXMucHVzaCggbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IFsgZ2V0Q3ViZU1lc2goKSBdLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luOiBvY3RyZWUuY2VudGVyLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IG9jdHJlZS5oYWxmV2lkdGhcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYW5kIHJldHVybiBlbnRpdHlcclxuICAgICAgICByZXR1cm4gZW50aXRpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmVzIHRoYXQgdGhlIHByb3ZpZGVkIHRyaWFuZ2xlcyBhcmUgb2YgdHlwZSBUcmlhbmdsZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0cmlhbmdsZXMgLSBUaGUgYXJyYXkgb2YgdHJpYW5nbGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIFRyaWFuZ2xlIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlVHJpYW5nbGVzKCB0cmlhbmdsZXMgKSB7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPHRyaWFuZ2xlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgaWYgKCAhKCB0cmlhbmdsZXNbaV0gaW5zdGFuY2VvZiBUcmlhbmdsZSApICkge1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzW2ldID0gbmV3IFRyaWFuZ2xlKCB0cmlhbmdsZXNbaV0ucG9zaXRpb25zICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyaWFuZ2xlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBPY3RyZWUoIHRyaWFuZ2xlcywgb3B0aW9ucyApIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICBpZiAoIHRyaWFuZ2xlcyApIHtcclxuICAgICAgICAgICAgLy8gaWYgdHJpYW5nbGVzIGFyZSBnaXZlbiwgYnVpbGQgdGhlIG9jdHJlZVxyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkKCB0cmlhbmdsZXMsIG9wdGlvbnMuZGVwdGggfHwgREVGQVVMVF9ERVBUSCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGVsc2UgY2FzZSBpcyBmb3IgcmVjdXJzaW9uIGR1cmluZyBidWlsZGluZ1xyXG4gICAgICAgICAgICB0aGlzLmNlbnRlciA9IG9wdGlvbnMuY2VudGVyO1xyXG4gICAgICAgICAgICB0aGlzLmhhbGZXaWR0aCA9IG9wdGlvbnMuaGFsZldpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmRlcHRoID0gb3B0aW9ucy5kZXB0aDtcclxuICAgICAgICAgICAgLy8gY2FsbCBjbGVhciB0byBpbml0aWFsaXplIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkcyB0aGUgb2N0cmVlIGZyb20gYW4gYXJyYXkgb2YgdHJpYW5nbGVzIHRvIGEgc3BlY2lmaWVkIGRlcHRoLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRyaWFuZ2xlcyAtIFRoZSBhcnJheSBvZiB0cmlhbmdsZXMgdG8gY29udGFpbi5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gZGVwdGggLSBUaGUgbGV2ZWxzIG9mIGRlcHRoIGZvciB0aGUgb2N0cmVlLlxyXG4gICAgICovXHJcbiAgICBPY3RyZWUucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oIHRyaWFuZ2xlcywgZGVwdGggKSB7XHJcbiAgICAgICAgdmFyIG1tLFxyXG4gICAgICAgICAgICBtaW5EaWZmLFxyXG4gICAgICAgICAgICBtYXhEaWZmLFxyXG4gICAgICAgICAgICBsYXJnZXN0TWluLFxyXG4gICAgICAgICAgICBsYXJnZXN0TWF4LFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgdHJpYW5nbGVzIGludG8gcHJvcGVyIGZvcm1hdCBpZiBuZWVkIGJlXHJcbiAgICAgICAgdHJpYW5nbGVzID0gcGFyc2VUcmlhbmdsZXMoIHRyaWFuZ2xlcyApO1xyXG4gICAgICAgIC8vIGdldCBtaW4gbWF4IGV4dGVudHNcclxuICAgICAgICBtbSA9IG1pbk1heCggdHJpYW5nbGVzICk7XHJcbiAgICAgICAgLy8gY2FsbCBjbGVhciB0byBpbml0aWFsaXplIGF0dHJpYnV0ZXNcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgLy8gY2VudHJlIHBvaW50IG9mIG9jdHJlZVxyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbW0ubWluLmFkZCggbW0ubWF4ICkuZGl2KCAyICk7XHJcbiAgICAgICAgdGhpcy5kZXB0aCA9IGRlcHRoIHx8IERFRkFVTFRfREVQVEg7XHJcbiAgICAgICAgLy8gZmluZCBsYXJnZXN0IGRpc3RhbmNlIGNvbXBvbmVudCwgYmVjb21lcyBoYWxmIHdpZHRoXHJcbiAgICAgICAgbWluRGlmZiA9IG1tLm1pbi5zdWIoIHRoaXMuY2VudGVyICk7XHJcbiAgICAgICAgbWF4RGlmZiA9IG1tLm1heC5zdWIoIHRoaXMuY2VudGVyICk7XHJcbiAgICAgICAgbGFyZ2VzdE1pbiA9IE1hdGgubWF4KFxyXG4gICAgICAgICAgICBNYXRoLmFicyggbWluRGlmZi54ICksXHJcbiAgICAgICAgICAgIE1hdGgubWF4KCBNYXRoLmFicyggbWluRGlmZi55ICksXHJcbiAgICAgICAgICAgIE1hdGguYWJzKCBtaW5EaWZmLnogKSApICk7XHJcbiAgICAgICAgbGFyZ2VzdE1heCA9IE1hdGgubWF4KFxyXG4gICAgICAgICAgICBNYXRoLmFicyggbWF4RGlmZi54ICksXHJcbiAgICAgICAgICAgIE1hdGgubWF4KCBNYXRoLmFicyggbWF4RGlmZi55ICksXHJcbiAgICAgICAgICAgIE1hdGguYWJzKCBtYXhEaWZmLnogKSApICk7XHJcbiAgICAgICAgLy8gaGFsZiB3aWR0aCBvZiBvY3RyZWUgY2VsbFxyXG4gICAgICAgIHRoaXMuaGFsZldpZHRoID0gTWF0aC5tYXgoIGxhcmdlc3RNaW4sIGxhcmdlc3RNYXggKTtcclxuICAgICAgICAvLyBpbnNlcnQgdHJpYW5nbGVzIGludG8gb2N0cmVlXHJcbiAgICAgICAgZm9yICggaT0wOyBpPHRyaWFuZ2xlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnQoIHRyaWFuZ2xlc1tpXSApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgYW5kIGluaXRpYWxpemVzIHRoZSBvY3RyZWUuXHJcbiAgICAgKi9cclxuICAgIE9jdHJlZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmVudGl0eSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb250YWluZWQgPSBbXTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW1xyXG4gICAgICAgICAgICBudWxsLCBudWxsLCBudWxsLCBudWxsLFxyXG4gICAgICAgICAgICBudWxsLCBudWxsLCBudWxsLCBudWxsIF07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGEgdHJpYW5nbGUgaW50byB0aGUgb2N0cmVlIHN0cnVjdHVyZS4gVGhpcyBtZXRob2Qgd2l0aCByZWN1cnNpdmVseVxyXG4gICAgICogaW5zZXJ0IGl0IGludG8gY2hpbGQgbm9kZXMgdG8gdGhlIGRlcHRoIG9mIHRoZSB0cmVlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmlhbmdsZSAtIFRoZSB0cmlhbmdsZSB0byBiZSBpbnNlcnRlZCBpbnRvIHRoZSBvY3RyZWUuXHJcbiAgICAgKi9cclxuICAgIE9jdHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oIHRyaWFuZ2xlICkge1xyXG4gICAgICAgIHZhciBjZW50cm9pZCA9IHRyaWFuZ2xlLmNlbnRyb2lkKCksXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IHRyaWFuZ2xlLnJhZGl1cygpLFxyXG4gICAgICAgICAgICAvLyBkaXN0YW5jZSBmcm9tIGVhY2ggYXhpc1xyXG4gICAgICAgICAgICBkeCA9IGNlbnRyb2lkLnggLSB0aGlzLmNlbnRlci54LFxyXG4gICAgICAgICAgICBkeSA9IGNlbnRyb2lkLnkgLSB0aGlzLmNlbnRlci55LFxyXG4gICAgICAgICAgICBkeiA9IGNlbnRyb2lkLnogLSB0aGlzLmNlbnRlci56LFxyXG4gICAgICAgICAgICBjaGlsZDtcclxuICAgICAgICAvLyBvbmx5IGFkZCB0cmlhbmdsZSBpZiBsZWFmIG5vZGVcclxuICAgICAgICBpZiAoIHRoaXMuZGVwdGggPT09IDAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVkLnB1c2goIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIGRpc3RhbmNlIGlzIGxlc3MgdGhhbiByYWRpdXMsIHRoZW4gdGhlIHRyaWFuZ2xlIHN0cmFkZGxlcyBhXHJcbiAgICAgICAgLy8gYm91bmRhcnlcclxuICAgICAgICBpZiAoIE1hdGguYWJzKCBkeCApIDwgcmFkaXVzIHx8XHJcbiAgICAgICAgICAgICBNYXRoLmFicyggZHkgKSA8IHJhZGl1cyB8fFxyXG4gICAgICAgICAgICAgTWF0aC5hYnMoIGR6ICkgPCByYWRpdXMgKSB7XHJcbiAgICAgICAgICAgIC8vIHN0cmFkZGxlcyBhIGJvdW5kYXJ5IHRyeSB0byBhZGQgdG8gaW50ZXJzZWN0ZWQgY2hpbGRyZW5cclxuICAgICAgICAgICAgZm9yICggY2hpbGQ9MDsgY2hpbGQ8ODsgY2hpbGQrKyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRyaWFuZ2xlIGJvdW5kaW5nIHNwaGVyZSBpbnRlcnNlY3RzIHRoaXMgY2hpbGRcclxuICAgICAgICAgICAgICAgIGlmICggc3BoZXJlQ2hlY2soIHRoaXMsIGNlbnRyb2lkLCByYWRpdXMsIGNoaWxkICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFydCBvZiBib3VuZGluZyBzcGhlcmUgaW50ZXJzZWN0cyBjaGlsZCwgaW5zZXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0SW50b0NoaWxkKCB0aGlzLCBjaGlsZCwgdHJpYW5nbGUgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGZ1bGx5IGNvbnRhaW5lZCBpbiBhIHNpbmdsZSBjaGlsZCwgZmluZCBjaGlsZCBpbmRleFxyXG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgMC03IGluZGV4IG9mIHRoZSBjaGlsZCwgZGV0ZXJtaW5lZCB1c2luZyBiaXQgd2lzZVxyXG4gICAgICAgICAgICAvLyBhZGRpdGlvblxyXG4gICAgICAgICAgICBjaGlsZCA9IDA7XHJcbiAgICAgICAgICAgIGlmICggZHggPiAwICkgeyBjaGlsZCArPSAxOyB9XHJcbiAgICAgICAgICAgIGlmICggZHkgPiAwICkgeyBjaGlsZCArPSAyOyB9XHJcbiAgICAgICAgICAgIGlmICggZHogPiAwICkgeyBjaGlsZCArPSA0OyB9XHJcbiAgICAgICAgICAgIGluc2VydEludG9DaGlsZCggdGhpcywgY2hpbGQsIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlIGFuZCByZXR1cm4gYW4gcmVuZGVyYWJsZSBlbnRpdHkgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgb2N0cmVlXHJcbiAgICAgKiBzdHJ1Y3R1cmUuIFNoYXJlcyBhIHNpbmdsZSBnbG9iYWwgbWVzaCBpbnN0YW5jZSBmb3IgYWxsIG5vZGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gLSBUaGUgYXJyYXkgb2YgbWVzaCBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIE9jdHJlZS5wcm90b3R5cGUuZ2V0RW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCAhdGhpcy5lbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW50aXR5ID0gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogZ2VuZXJhdGVTdWJFbnRpdGllcyggdGhpcyApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdHk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gT2N0cmVlO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlcyB0aGUgZW50aXR5IGhpZXJhcmNoeSBkZXB0aC1maXJzdCBhbmQgZXhlY3V0ZXMgdGhlXHJcbiAgICAgKiBmb3JFYWNoIGZ1bmN0aW9uIG9uIGVhY2ggZW50aXR5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBUaGUgRW50aXR5IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZvckVhY2hFbnRpdHkgLSBUaGUgUmVuZGVyUGFzcyBmb3JFYWNoRW50aXR5IGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm9yRWFjaE1lc2ggLSBUaGUgUmVuZGVyUGFzcyBmb3JFYWNoTWVzaCBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZm9yRWFjaFJlY3Vyc2l2ZSggZW50aXR5LCBmb3JFYWNoRW50aXR5LCBmb3JFYWNoTWVzaCApIHtcclxuICAgICAgICAvLyBmb3IgZWFjaCBlbnRpdHlcclxuICAgICAgICBpZiAoIGZvckVhY2hFbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGZvckVhY2hFbnRpdHkoIGVudGl0eSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBmb3IgZWFjaCBNZXNoXHJcbiAgICAgICAgaWYgKCBmb3JFYWNoTWVzaCApIHtcclxuICAgICAgICAgICAgZW50aXR5Lm1lc2hlcy5mb3JFYWNoKCBmdW5jdGlvbiggbWVzaCApIHtcclxuICAgICAgICAgICAgICAgIGZvckVhY2hNZXNoKCBtZXNoLCBlbnRpdHkgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRlcHRoIGZpcnN0IHRyYXZlcnNhbFxyXG4gICAgICAgIGVudGl0eS5jaGlsZHJlbi5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQgKSB7XHJcbiAgICAgICAgICAgIGZvckVhY2hSZWN1cnNpdmUoIGNoaWxkLCBmb3JFYWNoRW50aXR5LCBmb3JFYWNoTWVzaCApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFJlbmRlclBhc3MoIHNwZWMgKSB7XHJcbiAgICAgICAgaWYgKCB0eXBlb2Ygc3BlYyA9PT0gJ29iamVjdCcgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlID0gc3BlYy5iZWZvcmUgfHwgbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoRW50aXR5ID0gc3BlYy5mb3JFYWNoRW50aXR5IHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaE1lc2ggPSBzcGVjLmZvckVhY2hNZXNoIHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXIgPSBzcGVjLmFmdGVyIHx8IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIHNwZWMgPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlID0gc3BlYztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgUmVuZGVyUGFzcy5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKCBjYW1lcmEsIGVudGl0aWVzICkge1xyXG4gICAgICAgIHZhciBiZWZvcmUgPSB0aGlzLmJlZm9yZSxcclxuICAgICAgICAgICAgZm9yRWFjaEVudGl0eSA9IHRoaXMuZm9yRWFjaEVudGl0eSxcclxuICAgICAgICAgICAgZm9yRWFjaE1lc2ggPSB0aGlzLmZvckVhY2hNZXNoLFxyXG4gICAgICAgICAgICBhZnRlciA9IHRoaXMuYWZ0ZXI7XHJcbiAgICAgICAgLy8gc2V0dXAgZnVuY3Rpb25cclxuICAgICAgICBpZiAoIGJlZm9yZSApIHtcclxuICAgICAgICAgICAgYmVmb3JlKCBjYW1lcmEgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVuZGVyaW5nIGZ1bmN0aW9uc1xyXG4gICAgICAgIGVudGl0aWVzLmZvckVhY2goIGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGlmICggZW50aXR5ICkge1xyXG4gICAgICAgICAgICAgICAgZm9yRWFjaFJlY3Vyc2l2ZSggZW50aXR5LCBmb3JFYWNoRW50aXR5LCBmb3JFYWNoTWVzaCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gdGVhcmRvd24gZnVuY3Rpb25cclxuICAgICAgICBpZiAoIGFmdGVyICkge1xyXG4gICAgICAgICAgICBhZnRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJQYXNzO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBSZW5kZXJUZWNobmlxdWUoIHNwZWMgKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IHNwZWMuaWQ7XHJcbiAgICAgICAgdGhpcy5wYXNzZXMgPSBzcGVjLnBhc3NlcyB8fCBbXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBSZW5kZXJUZWNobmlxdWUucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiggY2FtZXJhLCBlbnRpdGllcyApIHtcclxuICAgICAgICB0aGlzLnBhc3Nlcy5mb3JFYWNoKCBmdW5jdGlvbiggcGFzcyApIHtcclxuICAgICAgICAgICAgcGFzcy5leGVjdXRlKCBjYW1lcmEsIGVudGl0aWVzICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVuZGVyVGVjaG5pcXVlO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVydGV4UGFja2FnZSA9IHJlcXVpcmUoJy4uL2NvcmUvVmVydGV4UGFja2FnZScpLFxyXG4gICAgICAgIFZlcnRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uL2NvcmUvVmVydGV4QnVmZmVyJyksXHJcbiAgICAgICAgSW5kZXhCdWZmZXIgPSByZXF1aXJlKCcuLi9jb3JlL0luZGV4QnVmZmVyJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VWZXJ0ZXhBdHRyaWJ1dGVzKCBzcGVjICkge1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gW107XHJcbiAgICAgICAgaWYgKCBzcGVjLnBvc2l0aW9ucyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLnBvc2l0aW9ucyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMubm9ybWFscyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLm5vcm1hbHMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLnV2cyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLnV2cyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMudGFuZ2VudHMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy50YW5nZW50cyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMuYml0YW5nZW50cyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLmJpdGFuZ2VudHMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLmNvbG9ycyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLmNvbG9ycyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMuam9pbnRzICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMuam9pbnRzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy53ZWlnaHRzICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMud2VpZ2h0cyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJbmRpY2VzKCBuICkge1xyXG4gICAgICAgIHZhciBpbmRpY2VzID0gbmV3IEFycmF5KCBuICksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPG47IGkrKyApIHtcclxuICAgICAgICAgICAgaW5kaWNlc1tpXSA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbmRpY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFJlbmRlcmFibGUoIHNwZWMgKSB7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgaWYgKCBzcGVjLnZlcnRleEJ1ZmZlciB8fCBzcGVjLnZlcnRleEJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSBleGlzdGluZyB2ZXJ0ZXggYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IHNwZWMudmVydGV4QnVmZmVycyB8fCBbIHNwZWMudmVydGV4QnVmZmVyIF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBwYWNrYWdlXHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhQYWNrYWdlID0gbmV3IFZlcnRleFBhY2thZ2UoIHBhcnNlVmVydGV4QXR0cmlidXRlcyggc3BlYyApICk7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB2ZXJ0ZXggYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IFsgbmV3IFZlcnRleEJ1ZmZlciggdmVydGV4UGFja2FnZSApIF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy5pbmRleEJ1ZmZlciApIHtcclxuICAgICAgICAgICAgLy8gdXNlIGV4aXN0aW5nIGVsZW1lbnQgYXJyYXkgYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBzcGVjLmluZGV4QnVmZmVyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBlbGVtZW50IGFycmF5IGJ1ZmZlclxyXG4gICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbmV3IEluZGV4QnVmZmVyKCBzcGVjLmluZGljZXMgfHwgY3JlYXRlSW5kaWNlcyggdGhpcy52ZXJ0ZXhQYWNrYWdlICksIHNwZWMub3B0aW9ucyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBSZW5kZXJhYmxlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZlcnRleEJ1ZmZlcnMgPSB0aGlzLnZlcnRleEJ1ZmZlcnMsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPHZlcnRleEJ1ZmZlcnMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHZlcnRleEJ1ZmZlcnNbaV0uYmluZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmJpbmQoKTtcclxuICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmRyYXcoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJhYmxlO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBSZW5kZXJlciggdGVjaG5pcXVlcyApIHtcclxuICAgICAgICBpZiAoICEoIHRlY2huaXF1ZXMgaW5zdGFuY2VvZiBBcnJheSApICkge1xyXG4gICAgICAgICAgICB0ZWNobmlxdWVzID0gWyB0ZWNobmlxdWVzIF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGVjaG5pcXVlcyA9IHRlY2huaXF1ZXMgfHwgW107XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCBjYW1lcmEsIGVudGl0aWVzQnlUZWNobmlxdWUgKSB7XHJcbiAgICAgICAgdGhpcy50ZWNobmlxdWVzLmZvckVhY2goIGZ1bmN0aW9uKCB0ZWNobmlxdWUgKSB7XHJcbiAgICAgICAgICAgIHZhciBlbnRpdGllcyA9IGVudGl0aWVzQnlUZWNobmlxdWVbIHRlY2huaXF1ZS5pZCBdO1xyXG4gICAgICAgICAgICBpZiAoIGVudGl0aWVzICYmIGVudGl0aWVzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICB0ZWNobmlxdWUuZXhlY3V0ZSggY2FtZXJhLCBlbnRpdGllcyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBNYXQ0NCA9IHJlcXVpcmUoJ2FsZmFkb3InKS5NYXQ0NDtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRKb2ludENvdW50KCBqb2ludHNCeUlkLCBqb2ludHMgKSB7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gam9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8am9pbnRzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBqb2ludHNCeUlkWyBqb2ludHNbaV0uaWQgXSA9IGpvaW50c1tpXTtcclxuICAgICAgICAgICAgY291bnQgKz0gZ2V0Sm9pbnRDb3VudCggam9pbnRzQnlJZCwgam9pbnRzW2ldLmNoaWxkcmVuICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBTa2VsZXRvbiggdGhhdCApIHtcclxuICAgICAgICAvLyByb290IGNhbiBiZSBlaXRoZXIgYSBzaW5nbGUgbm9kZSwgb3IgYW4gYXJyYXkgb2Ygcm9vdCBub2Rlc1xyXG4gICAgICAgIHRoaXMucm9vdCA9ICggdGhhdC5yb290IGluc3RhbmNlb2YgQXJyYXkgKSA/IHRoYXQucm9vdCA6IFsgdGhhdC5yb290IF07XHJcbiAgICAgICAgdGhpcy5iaW5kU2hhcGVNYXRyaXggPSB0aGF0LmJpbmRTaGFwZU1hdHJpeCB8fCBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgIHRoaXMuam9pbnRzQnlJZCA9IHt9O1xyXG4gICAgICAgIHRoaXMuam9pbnRDb3VudCA9IGdldEpvaW50Q291bnQoIHRoaXMuam9pbnRzQnlJZCwgdGhpcy5yb290ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgU2tlbGV0b24ucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGJpbmRTaGFwZU1hdHJpeCA9IHRoaXMuYmluZFNoYXBlTWF0cml4LFxyXG4gICAgICAgICAgICBqb2ludHNCeUlkID0gdGhpcy5qb2ludHNCeUlkLFxyXG4gICAgICAgICAgICBhcnJheWJ1ZmZlcixcclxuICAgICAgICAgICAgc2tpbm5pbmdNYXRyaXgsXHJcbiAgICAgICAgICAgIGpvaW50LFxyXG4gICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgLy8gYWxsb2NhdGUgYXJyYXlidWZmZXIgdG8gc3RvcmUgYWxsIGpvaW50IG1hdHJpY2VzXHJcbiAgICAgICAgYXJyYXlidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KCBuZXcgQXJyYXlCdWZmZXIoIDQqMTYqdGhpcy5qb2ludENvdW50ICkgKTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBqb2ludCwgZ2V0IHRoZSBza2lubmluZyBtYXRyaXhcclxuICAgICAgICBmb3IgKCBrZXkgaW4gam9pbnRzQnlJZCApIHtcclxuICAgICAgICAgICAgaWYgKCBqb2ludHNCeUlkLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgIGpvaW50ID0gam9pbnRzQnlJZFsga2V5IF07XHJcbiAgICAgICAgICAgICAgICBza2lubmluZ01hdHJpeCA9IGpvaW50LnNraW5uaW5nTWF0cml4KCBiaW5kU2hhcGVNYXRyaXggKTtcclxuICAgICAgICAgICAgICAgIGFycmF5YnVmZmVyLnNldCggc2tpbm5pbmdNYXRyaXguZGF0YSwgam9pbnQuaW5kZXgqMTYgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXR1cm4gYXJyYXkgYXMgYXJyYXlidWZmZXIgb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIGFycmF5YnVmZmVyO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNrZWxldG9uO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBTdGFjaygpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuICAgICAgICB0aGlzLmRhdGEucHVzaCggdmFsdWUgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgU3RhY2sucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgU3RhY2sucHJvdG90eXBlLnRvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZGF0YS5sZW5ndGggLSAxO1xyXG4gICAgICAgIGlmICggaW5kZXggPCAwICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVsgaW5kZXggXTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIHNpbXBseURlZmVycmVkID0gcmVxdWlyZSgnc2ltcGx5LWRlZmVycmVkJyksXHJcbiAgICAgICAgRGVmZXJyZWQgPSBzaW1wbHlEZWZlcnJlZC5EZWZlcnJlZCxcclxuICAgICAgICB3aGVuID0gc2ltcGx5RGVmZXJyZWQud2hlbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm92aWRlZCBkZWZlcnJlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0RlZmVycmVkfSBkZWZlcnJlZCAtIFRoZSBkZWZlcnJlZCBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgZGVmZXJyZWQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlc29sdmVEZWZlcnJlZCggZGVmZXJyZWQgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCByZXN1bHQgKSB7XHJcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHJlc3VsdCApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIGFuIGFycmF5IG9mIGpvYnMsIGFjY3VtdWxhdGluZyB0aGUgcmVzdWx0cyBhbmRcclxuICAgICAqIHBhc3NpbmcgdGhlbSB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaW4gY29ycmVzcG9uZGluZyBpbmRpY2VzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGpvYnMgLSBUaGUgam9iIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBhc3luY0FycmF5KCBqb2JzLCBjYWxsYmFjayApIHtcclxuICAgICAgICB2YXIgZGVmZXJyZWRzID0gW10sXHJcbiAgICAgICAgICAgIGRlZmVycmVkLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxqb2JzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBkZWZlcnJlZHMucHVzaCggZGVmZXJyZWQgKTtcclxuICAgICAgICAgICAgam9ic1tpXSggcmVzb2x2ZURlZmVycmVkKCBkZWZlcnJlZCApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoZW4uYXBwbHkoIHdoZW4sIGRlZmVycmVkcyApLnRoZW4oIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDAgKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soIHJlc3VsdHMgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoZXMgYSBtYXAgb2Ygam9icywgYWNjdW11bGF0aW5nIHRoZSByZXN1bHRzIGFuZFxyXG4gICAgICogcGFzc2luZyB0aGVtIHRvIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB1bmRlciBjb3JyZXNwb25kaW5nXHJcbiAgICAgKiBrZXlzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBqb2JzIC0gVGhlIGpvYiBtYXAuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgIGZ1bmN0aW9uIGFzeW5jT2JqKCBqb2JzLCBjYWxsYmFjayApIHtcclxuICAgICAgICB2YXIgam9ic0J5SW5kZXggPSBbXSxcclxuICAgICAgICAgICAgZGVmZXJyZWRzID0gW10sXHJcbiAgICAgICAgICAgIGRlZmVycmVkLFxyXG4gICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgZm9yICgga2V5IGluIGpvYnMgKSB7XHJcbiAgICAgICAgICAgIGlmICggam9icy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWRzLnB1c2goIGRlZmVycmVkICk7XHJcbiAgICAgICAgICAgICAgICBqb2JzQnlJbmRleC5wdXNoKCBrZXkgKTtcclxuICAgICAgICAgICAgICAgIGpvYnNbIGtleSBdKCByZXNvbHZlRGVmZXJyZWQoIGRlZmVycmVkICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aGVuLmFwcGx5KCB3aGVuLCBkZWZlcnJlZHMgKS5kb25lKCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAwICksXHJcbiAgICAgICAgICAgICAgICByZXN1bHRzQnlLZXkgPSB7fSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxqb2JzQnlJbmRleC5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHNCeUtleVsgam9ic0J5SW5kZXhbaV0gXSA9IHJlc3VsdHNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soIHJlc3VsdHNCeUtleSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFeGVjdXRlIGEgc2V0IG9mIGZ1bmN0aW9ucyBhc3luY2hyb25vdXNseSwgb25jZSBhbGwgaGF2ZSBiZWVuXHJcbiAgICAgICAgICogY29tcGxldGVkLCBleGVjdXRlIHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi4gSm9icyBtYXkgYmUgcGFzc2VkXHJcbiAgICAgICAgICogYXMgYW4gYXJyYXkgb3Igb2JqZWN0LiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gd2lsbCBiZSBwYXNzZWQgdGhlXHJcbiAgICAgICAgICogcmVzdWx0cyBpbiB0aGUgc2FtZSBmb3JtYXQgYXMgdGhlIGpvYnMuIEFsbCBqb2JzIG11c3QgaGF2ZSBhY2NlcHQgYW5kXHJcbiAgICAgICAgICogZXhlY3V0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBqb2JzIC0gVGhlIHNldCBvZiBmdW5jdGlvbnMgdG8gZXhlY3V0ZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB1cG9uIGNvbXBsZXRpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYXN5bmM6IGZ1bmN0aW9uKCBqb2JzLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgaWYgKCBqb2JzIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBhc3luY0FycmF5KCBqb2JzLCBjYWxsYmFjayApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXN5bmNPYmooIGpvYnMsIGNhbGxiYWNrICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFeHRlbmQgY2xhc3MgYSBieSBjbGFzcyBiLiBEb2VzIG5vdCByZWN1cnNlLCBzaW1wbHkgb3ZlcmxheXMgdG9wXHJcbiAgICAgICAgICogYXR0cmlidXRlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhIC0gT2JqZWN0IGEgd2hpY2ggaXMgZXh0ZW5kZWQuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGIgLSBPYmplY3QgYiB3aGljaCBleHRlbmRzIGEuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZXh0ZW5kZWQgb2JqZWN0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4dGVuZDogZnVuY3Rpb24oIGEsIGIgKSB7XHJcbiAgICAgICAgICAgIHZhciBrZXk7XHJcbiAgICAgICAgICAgIGZvcigga2V5IGluIGIgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiggYi5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYVsga2V5IF0gPSBiWyBrZXkgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZWVwIGNvcGllcyB0aGUgcHJvdmlkZWQgb2JqZWN0LiBPYmplY3QgY2Fubm90IGJlIGNpcmN1bGFyLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGpzb24gLSBUaGUgb2JqZWN0IHRvIGNvcHkuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBhIGRlZXAgY29weSBvZiB0aGUgcHJvdmlkZWQgb2JqZWN0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvcHk6IGZ1bmN0aW9uKCBqc29uICkge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSggSlNPTi5zdHJpbmdpZnkoIGpzb24gKSApO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIG9iamVjdCBoYXMgbm8gYXR0cmlidXRlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBUaGUgb2JqZWN0IHRvIHRlc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgb2JqZWN0IGhhcyBrZXlzLCBmYWxzZSBpZiBub3QuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24oIG9iaiApIHtcclxuICAgICAgICAgICAgZm9yKCB2YXIgcHJvcCBpbiBvYmogKSB7XHJcbiAgICAgICAgICAgICAgICBpZiggb2JqLmhhc093blByb3BlcnR5KCBwcm9wICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiBhIHByb3ZpZGVkIGFycmF5IGlzIGEgamF2c2NyaXB0IFR5cGVkQXJyYXkuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0geyp9IGFycmF5IC0gVGhlIHZhcmlhYmxlIHRvIHRlc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgdmFyaWFibGUgaXMgYSBUeXBlZEFycmF5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzVHlwZWRBcnJheTogZnVuY3Rpb24oIGFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXkgJiZcclxuICAgICAgICAgICAgICAgIGFycmF5LmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyICYmXHJcbiAgICAgICAgICAgICAgICBhcnJheS5ieXRlTGVuZ3RoICE9PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBpbnRlZ2VyIGlzIGEgcG93ZXIgb2YgdHdvLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBudW0gLSBUaGUgbnVtYmVyIHRvIHRlc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgbnVtYmVyIGlzIGEgcG93ZXIgb2YgdHdvLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzUG93ZXJPZlR3bzogZnVuY3Rpb24oIG51bSApIHtcclxuICAgICAgICAgICAgcmV0dXJuICggbnVtICE9PSAwICkgPyAoIG51bSAmICggbnVtIC0gMSApICkgPT09IDAgOiBmYWxzZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvIGZvciBhIG51bWJlci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEV4LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogICAgIDIwMCAtPiAyNTZcclxuICAgICAgICAgKiAgICAgMjU2IC0+IDI1NlxyXG4gICAgICAgICAqICAgICAyNTcgLT4gNTEyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG51bSAtIFRoZSBudW1iZXIgdG8gbW9kaWZ5LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2ludGVnZXJ9IC0gTmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3by5cclxuICAgICAgICAgKi9cclxuICAgICAgICBuZXh0SGlnaGVzdFBvd2VyT2ZUd286IGZ1bmN0aW9uKCBudW0gKSB7XHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICBpZiAoIG51bSAhPT0gMCApIHtcclxuICAgICAgICAgICAgICAgIG51bSA9IG51bS0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoIGk9MTsgaTwzMjsgaTw8PTEgKSB7XHJcbiAgICAgICAgICAgICAgICBudW0gPSBudW0gfCBudW0gPj4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVtICsgMTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZHMgYW4gWE1MSHR0cFJlcXVlc3QgR0VUIHJlcXVlc3QgdG8gdGhlIHN1cHBsaWVkIHVybC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSBVUkwgZm9yIHRoZSByZXNvdXJjZS5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBDb250YWlucyB0aGUgZm9sbG93aW5nIG9wdGlvbnM6XG4gICAgICAgICAqIDxwcmU+XG4gICAgICAgICAqICAgICB7XG4gICAgICAgICAqICAgICAgICAge1N0cmluZ30gc3VjY2VzcyAtIFRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiAgICAgICAgIHtTdHJpbmd9IGVycm9yIC0gVGhlIGVycm9yIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiAgICAgICAgIHtTdHJpbmd9IHByb2dyZXNzIC0gVGhlIHByb2dyZXNzIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgKiAgICAgICAgIHtTdHJpbmd9IHJlc3BvbnNlVHlwZSAtIFRoZSByZXNwb25zZVR5cGUgb2YgdGhlIFhIUi5cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICogPC9wcmU+XG4gICAgICAgICAqL1xuICAgICAgICBsb2FkOiBmdW5jdGlvbiAoIHVybCwgb3B0aW9ucyApIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4oICdHRVQnLCB1cmwsIHRydWUgKTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGU7XG4gICAgICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5zdWNjZXNzICkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MoIHRoaXMucmVzcG9uc2UgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICggb3B0aW9ucy5wcm9ncmVzcyApIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoICdwcm9ncmVzcycsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHJvZ3Jlc3MoIGV2ZW50ICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMuZXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCAnZXJyb3InLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmVycm9yKCBldmVudCApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgUFJPSl9NQVRSSVggPSBcInVQcm9qZWN0aW9uTWF0cml4XCIsXHJcbiAgICAgICAgTU9ERUxfTUFUUklYID0gXCJ1TW9kZWxNYXRyaXhcIixcclxuICAgICAgICBWSUVXX01BVFJJWCA9IFwidVZpZXdNYXRyaXhcIixcclxuICAgICAgICBQT1NfQVRUUklCID0gXCJhUG9zaXRpb25cIixcclxuICAgICAgICBVVl9BVFRSSUIgPSBcImFUZXhDb29yZFwiLFxyXG4gICAgICAgIFVTRV9BVFRSSUJfQ09MT1IgPSBcInVVc2VBdHRyaWJDb2xvclwiLFxyXG4gICAgICAgIENPTF9BVFRSSUIgPSBcImFDb2xvclwiLFxyXG4gICAgICAgIENPTF9VTklGT1JNID0gXCJ1Q29sb3JcIixcclxuICAgICAgICBURVhfU0FNUExFUiA9IFwidURpZmZ1c2VTYW1wbGVyXCI7XHJcblxyXG4gICAgdmFyIEZMQVRfVkVSVF9TUkMgPSBbXHJcbiAgICAgICAgICAgIFwiYXR0cmlidXRlIGhpZ2hwIHZlYzMgXCIgKyBQT1NfQVRUUklCICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwiYXR0cmlidXRlIGhpZ2hwIHZlYzMgXCIgKyBDT0xfQVRUUklCICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidW5pZm9ybSBoaWdocCBtYXQ0IFwiICsgTU9ERUxfTUFUUklYICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidW5pZm9ybSBoaWdocCBtYXQ0IFwiICsgVklFV19NQVRSSVggKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ1bmlmb3JtIGhpZ2hwIG1hdDQgXCIgKyBQUk9KX01BVFJJWCArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gYm9vbCBcIiArIFVTRV9BVFRSSUJfQ09MT1IgKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ1bmlmb3JtIGhpZ2hwIHZlYzMgXCIgKyBDT0xfVU5JRk9STSArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInZhcnlpbmcgaGlnaHAgdmVjMyB2Q29sb3I7XCIsXHJcbiAgICAgICAgICAgIFwidm9pZCBtYWluKCkge1wiLFxyXG4gICAgICAgICAgICAgICAgXCJpZiAoIFwiICsgVVNFX0FUVFJJQl9DT0xPUiArIFwiICkge1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidkNvbG9yID0gXCIgKyBDT0xfQVRUUklCICsgXCI7XCIsXHJcbiAgICAgICAgICAgICAgICBcIn0gZWxzZSB7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ2Q29sb3IgPSBcIiArIENPTF9VTklGT1JNICsgXCI7XCIsXHJcbiAgICAgICAgICAgICAgICBcIn1cIixcclxuICAgICAgICAgICAgICAgIFwiZ2xfUG9zaXRpb24gPSBcIiArIFBST0pfTUFUUklYICtcclxuICAgICAgICAgICAgICAgICAgICBcIiAqIFwiICsgVklFV19NQVRSSVggK1xyXG4gICAgICAgICAgICAgICAgICAgIFwiICogXCIgKyBNT0RFTF9NQVRSSVggK1xyXG4gICAgICAgICAgICAgICAgICAgIFwiICogdmVjNCggXCIgKyBQT1NfQVRUUklCICsgXCIsIDEuMCApO1wiLFxyXG4gICAgICAgICAgICBcIn1cIlxyXG4gICAgICAgIF0uam9pbignXFxuJyk7XHJcblxyXG4gICAgdmFyIEZMQVRfRlJBR19TUkMgPSBbXHJcbiAgICAgICAgICAgIFwidmFyeWluZyBoaWdocCB2ZWMzIHZDb2xvcjtcIixcclxuICAgICAgICAgICAgXCJ2b2lkIG1haW4oKSB7XCIsXHJcbiAgICAgICAgICAgICAgICBcImdsX0ZyYWdDb2xvciA9IHZlYzQoIHZDb2xvciwgMS4wICk7XCIsXHJcbiAgICAgICAgICAgIFwifVwiXHJcbiAgICAgICAgXS5qb2luKCdcXG4nKTtcclxuXHJcbiAgICB2YXIgVEVYX1ZFUlRfU1JDID0gW1xyXG4gICAgICAgICAgICBcImF0dHJpYnV0ZSBoaWdocCB2ZWMzIFwiICsgUE9TX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcImF0dHJpYnV0ZSBoaWdocCB2ZWMyIFwiICsgVVZfQVRUUklCICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidW5pZm9ybSBoaWdocCBtYXQ0IFwiICsgTU9ERUxfTUFUUklYICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidmFyeWluZyBoaWdocCB2ZWMyIHZUZXhDb29yZDtcIixcclxuICAgICAgICAgICAgXCJ2b2lkIG1haW4oKSB7XCIsXHJcbiAgICAgICAgICAgICAgICBcImdsX1Bvc2l0aW9uID0gXCIgKyBNT0RFTF9NQVRSSVggK1xyXG4gICAgICAgICAgICAgICAgICAgIFwiICogdmVjNCggXCIgKyBQT1NfQVRUUklCICsgXCIsIDEuMCApO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ2VGV4Q29vcmQgPSBcIiArIFVWX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcIn1cIlxyXG4gICAgICAgIF0uam9pbignXFxuJyk7XHJcblxyXG4gICAgdmFyIFRFWF9GUkFHX1NSQyA9IFtcclxuICAgICAgICAgICAgXCJ2YXJ5aW5nIGhpZ2hwIHZlYzMgdkNvbG9yO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gc2FtcGxlcjJEIFwiICsgVEVYX1NBTVBMRVIgKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ2YXJ5aW5nIGhpZ2hwIHZlYzIgdlRleENvb3JkO1wiLFxyXG4gICAgICAgICAgICBcInZvaWQgbWFpbigpIHtcIixcclxuICAgICAgICAgICAgICAgIFwiZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKCBcIiArIFRFWF9TQU1QTEVSICsgXCIsIHZUZXhDb29yZCApO1wiLFxyXG4gICAgICAgICAgICBcIn1cIlxyXG4gICAgICAgIF0uam9pbignXFxuJyk7XHJcblxyXG4gICAgdmFyIEZMQVRfREVCVUdfU0hBREVSID0gbnVsbDtcclxuICAgIHZhciBURVhfREVCVUdfU0hBREVSID0gbnVsbDtcclxuXHJcbiAgICB2YXIgU2hhZGVyID0gcmVxdWlyZSgnLi4vLi4vY29yZS9TaGFkZXInKSxcclxuICAgICAgICBNZXNoID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL01lc2gnKSxcclxuICAgICAgICBFbnRpdHkgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvRW50aXR5JyksXHJcbiAgICAgICAgUmVuZGVyZXIgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvUmVuZGVyZXInKSxcclxuICAgICAgICBSZW5kZXJUZWNobmlxdWUgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvUmVuZGVyVGVjaG5pcXVlJyksXHJcbiAgICAgICAgUmVuZGVyUGFzcyA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlci9SZW5kZXJQYXNzJyksXHJcbiAgICAgICAgUXVhZCA9IHJlcXVpcmUoJy4uL3NoYXBlcy9RdWFkJyksXHJcbiAgICAgICAgX2RlYnVnVVVJRCA9IDEsXHJcbiAgICAgICAgX3JlbmRlck1hcCA9IHt9LFxyXG4gICAgICAgIF9jYW1lcmEgPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEZ1bmNOYW1lKCBmdW5jICkge1xyXG4gICAgICB2YXIgbmFtZSA9IGZ1bmMudG9TdHJpbmcoKTtcclxuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKCAnZnVuY3Rpb24gJy5sZW5ndGggKTtcclxuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKCAwLCBuYW1lLmluZGV4T2YoJygnKSApO1xyXG4gICAgICByZXR1cm4gbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBmdW5jICkge1xyXG4gICAgICAgIGVudGl0eS4kJERFQlVHX1VVSUQgPSBlbnRpdHkuJCRERUJVR19VVUlEIHx8IF9kZWJ1Z1VVSUQrKztcclxuICAgICAgICB2YXIgZGVidWdIYXNoID0gZW50aXR5LiQkREVCVUdfVVVJRCArIFwiLVwiICsgZ2V0RnVuY05hbWUoIGZ1bmMgKTtcclxuICAgICAgICBpZiAoICFfcmVuZGVyTWFwWyBkZWJ1Z0hhc2ggXSApIHtcclxuICAgICAgICAgICAgX3JlbmRlck1hcFsgZGVidWdIYXNoIF0gPSBmdW5jKCBlbnRpdHkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF9yZW5kZXJNYXBbIGRlYnVnSGFzaCBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRBcnJheVRvQ29sb3JzKCBhcnJheSApIHtcclxuICAgICAgICB2YXIgY29sb3JzID0gbmV3IEFycmF5KCBhcnJheS5sZW5ndGggKSxcclxuICAgICAgICAgICAgYXR0cmliLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxhcnJheS5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgYXR0cmliID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgIGNvbG9yc1tpXSA9IFtcclxuICAgICAgICAgICAgICAgICggKCBhdHRyaWIueCB8fCBhdHRyaWJbMF0gKSArIDEgKSAvIDIsXHJcbiAgICAgICAgICAgICAgICAoICggYXR0cmliLnkgfHwgYXR0cmliWzFdICkgICsgMSApIC8gMixcclxuICAgICAgICAgICAgICAgICggKCBhdHRyaWIueiB8fCBhdHRyaWJbMl0gfHwgMCApICsgMSApIC8gMlxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVdpcmVGcmFtZUVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHZhciBjb3B5ID0gZW50aXR5LmNvcHkoKTtcclxuICAgICAgICBjb3B5LmZvckVhY2goIGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNoZXMgPSBlbnRpdHkubWVzaGVzLFxyXG4gICAgICAgICAgICAgICAgZ2VvbWV0cnksXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgIHRyaUluZGljZXMsXHJcbiAgICAgICAgICAgICAgICBsaW5lcyxcclxuICAgICAgICAgICAgICAgIGluZGljZXMsXHJcbiAgICAgICAgICAgICAgICBhLCBiLCBjLFxyXG4gICAgICAgICAgICAgICAgaSwgajtcclxuICAgICAgICAgICAgZW50aXR5Lm1lc2hlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8bWVzaGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgZ2VvbWV0cnkgPSBtZXNoZXNbaV0uZ2VvbWV0cnk7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMgPSBnZW9tZXRyeS5wb3NpdGlvbnM7XHJcbiAgICAgICAgICAgICAgICB0cmlJbmRpY2VzID0gZ2VvbWV0cnkuaW5kaWNlcztcclxuICAgICAgICAgICAgICAgIGxpbmVzID0gbmV3IEFycmF5KCB0cmlJbmRpY2VzLmxlbmd0aCAqIDIgKTtcclxuICAgICAgICAgICAgICAgIGluZGljZXMgPSBuZXcgQXJyYXkoIHRyaUluZGljZXMubGVuZ3RoICogMiApO1xyXG4gICAgICAgICAgICAgICAgZm9yICggaj0wOyBqPHRyaUluZGljZXMubGVuZ3RoOyBqKz0zICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGEgPSB0cmlJbmRpY2VzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGIgPSB0cmlJbmRpY2VzW2orMV07XHJcbiAgICAgICAgICAgICAgICAgICAgYyA9IHRyaUluZGljZXNbaisyXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjJdID0gcG9zaXRpb25zW2FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2oqMisxXSA9IHBvc2l0aW9uc1tiXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjIrMl0gPSBwb3NpdGlvbnNbYl07XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyKzNdID0gcG9zaXRpb25zW2NdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2oqMis0XSA9IHBvc2l0aW9uc1tjXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjIrNV0gPSBwb3NpdGlvbnNbYV07XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tqKjJdID0gaioyO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyKzFdID0gaioyKzE7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tqKjIrMl0gPSBqKjIrMjtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMiszXSA9IGoqMiszO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyKzRdID0gaioyKzQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tqKjIrNV0gPSBqKjIrNTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVudGl0eS5tZXNoZXMucHVzaCggbmV3IE1lc2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogbGluZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU6IFwiTElORVNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50aXR5LiQkREVCVUdfVVNFX0NPTE9SID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGNvcHk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29sb3JFbnRpdHkoIGVudGl0eSwgYXR0cmlidXRlICkge1xyXG4gICAgICAgIHZhciBjb3B5ID0gZW50aXR5LmNvcHkoKTtcclxuICAgICAgICBjb3B5LmZvckVhY2goIGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNoZXMgPSBlbnRpdHkubWVzaGVzLFxyXG4gICAgICAgICAgICAgICAgZ2VvbWV0cnksXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBlbnRpdHkubWVzaGVzID0gW107XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxtZXNoZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBnZW9tZXRyeSA9IG1lc2hlc1tpXS5nZW9tZXRyeTtcclxuICAgICAgICAgICAgICAgIGVudGl0eS5tZXNoZXMucHVzaCggbmV3IE1lc2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogZ2VvbWV0cnkucG9zaXRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yczogY29udmVydEFycmF5VG9Db2xvcnMoIGdlb21ldHJ5WyBhdHRyaWJ1dGUgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXM6IGdlb21ldHJ5LmluZGljZXNcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbnRpdHkuJCRERUJVR19VU0VfQ09MT1IgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjb3B5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVWQ29sb3JFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlQ29sb3JFbnRpdHkoIGVudGl0eSwgXCJ1dnNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZU5vcm1hbENvbG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbG9yRW50aXR5KCBlbnRpdHksIFwibm9ybWFsc1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVGFuZ2VudENvbG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbG9yRW50aXR5KCBlbnRpdHksIFwidGFuZ2VudHNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJpVGFuZ2VudENvbG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbG9yRW50aXR5KCBlbnRpdHksIFwiYml0YW5nZW50c1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTGluZXNFbnRpdHkoIGVudGl0eSwgdHlwZSApIHtcclxuICAgICAgICB2YXIgY29weSA9IGVudGl0eS5jb3B5KCk7XHJcbiAgICAgICAgY29weS5mb3JFYWNoKCBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICB2YXIgbWVzaGVzID0gZW50aXR5Lm1lc2hlcyxcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIGxpbmVzLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlcyxcclxuICAgICAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgICAgICBqO1xyXG4gICAgICAgICAgICBlbnRpdHkubWVzaGVzID0gW107XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxtZXNoZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMgPSBtZXNoZXNbaV0uZ2VvbWV0cnkucG9zaXRpb25zO1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcyA9IG1lc2hlc1tpXS5nZW9tZXRyeVsgdHlwZSBdO1xyXG4gICAgICAgICAgICAgICAgbGluZXMgPSBuZXcgQXJyYXkoIHBvc2l0aW9ucy5sZW5ndGggKiAyICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzID0gbmV3IEFycmF5KCBwb3NpdGlvbnMubGVuZ3RoICogMiApO1xyXG4gICAgICAgICAgICAgICAgZm9yICggaj0wOyBqPHBvc2l0aW9ucy5sZW5ndGg7IGorKyApIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2oqMl0gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjIrMV0gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICggcG9zaXRpb24ueCB8fCBwb3NpdGlvblswXSB8fCAwICkgKyAoIGF0dHJpYnV0ZS54IHx8IGF0dHJpYnV0ZVswXSB8fCAwICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICggcG9zaXRpb24ueSB8fCBwb3NpdGlvblsxXSB8fCAwICkgKyAoIGF0dHJpYnV0ZS55IHx8IGF0dHJpYnV0ZVsxXSB8fCAwICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICggcG9zaXRpb24ueiB8fCBwb3NpdGlvblsyXSB8fCAwICkgKyAoIGF0dHJpYnV0ZS56IHx8IGF0dHJpYnV0ZVsyXSB8fCAwIClcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyXSA9IGoqMjtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMisxXSA9IGoqMisxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZW50aXR5Lm1lc2hlcy5wdXNoKCBuZXcgTWVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBsaW5lcyxcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzOiBpbmRpY2VzLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogXCJMSU5FU1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgZW50aXR5LiQkREVCVUdfVVNFX0NPTE9SID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY29weTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVVVlZlY3RvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVMaW5lc0VudGl0eSggZW50aXR5LCBcInV2c1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTm9ybWFsVmVjdG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxpbmVzRW50aXR5KCBlbnRpdHksIFwibm9ybWFsc1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVGFuZ2VudFZlY3RvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVMaW5lc0VudGl0eSggZW50aXR5LCBcInRhbmdlbnRzXCIgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVCaVRhbmdlbnRWZWN0b3JFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlTGluZXNFbnRpdHkoIGVudGl0eSwgXCJiaXRhbmdlbnRzXCIgKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgX3VzZUNvbG9yID0gZmFsc2UsXHJcbiAgICAgICAgX2NvbG9yID0gWzEsMSwwXTtcclxuXHJcbiAgICB2YXIgZGVidWdGbGF0UGFzcyA9IG5ldyBSZW5kZXJQYXNzKHtcclxuICAgICAgICBiZWZvcmU6IGZ1bmN0aW9uKCBjYW1lcmEgKSB7XHJcbiAgICAgICAgICAgIGlmICggIUZMQVRfREVCVUdfU0hBREVSICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHNoYWRlciBpZiBpdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgICAgIEZMQVRfREVCVUdfU0hBREVSID0gbmV3IFNoYWRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydDogRkxBVF9WRVJUX1NSQyxcclxuICAgICAgICAgICAgICAgICAgICBmcmFnOiBGTEFUX0ZSQUdfU1JDXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5wdXNoKCk7XHJcbiAgICAgICAgICAgIEZMQVRfREVCVUdfU0hBREVSLnNldFVuaWZvcm0oIFBST0pfTUFUUklYLCBjYW1lcmEucHJvamVjdGlvbk1hdHJpeCgpICk7XHJcbiAgICAgICAgICAgIEZMQVRfREVCVUdfU0hBREVSLnNldFVuaWZvcm0oIFZJRVdfTUFUUklYLCBjYW1lcmEuZ2xvYmFsVmlld01hdHJpeCgpICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JFYWNoRW50aXR5OiBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICBfdXNlQ29sb3IgPSBlbnRpdHkuJCRERUJVR19VU0VfQ09MT1I7XHJcbiAgICAgICAgICAgIEZMQVRfREVCVUdfU0hBREVSLnNldFVuaWZvcm0oIE1PREVMX01BVFJJWCwgZW50aXR5Lmdsb2JhbE1hdHJpeCgpICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JFYWNoTWVzaDogZnVuY3Rpb24oIG1lc2ggKSB7XHJcbiAgICAgICAgICAgIEZMQVRfREVCVUdfU0hBREVSLnNldFVuaWZvcm0oIFVTRV9BVFRSSUJfQ09MT1IsIF91c2VDb2xvciApO1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBDT0xfVU5JRk9STSwgX2NvbG9yICk7XHJcbiAgICAgICAgICAgIG1lc2guZHJhdygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWZ0ZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgZGVidWdUZXhQYXNzID0gbmV3IFJlbmRlclBhc3Moe1xyXG4gICAgICAgIGJlZm9yZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICggIVRFWF9ERUJVR19TSEFERVIgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgc2hhZGVyIGlmIGl0IGRvZXMgbm90IGV4aXN0IHlldFxyXG4gICAgICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUiA9IG5ldyBTaGFkZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnQ6IFRFWF9WRVJUX1NSQyxcclxuICAgICAgICAgICAgICAgICAgICBmcmFnOiBURVhfRlJBR19TUkNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFRFWF9ERUJVR19TSEFERVIuZ2wuZGlzYWJsZSggVEVYX0RFQlVHX1NIQURFUi5nbC5ERVBUSF9URVNUICk7XHJcbiAgICAgICAgICAgIFRFWF9ERUJVR19TSEFERVIucHVzaCgpO1xyXG4gICAgICAgICAgICBURVhfREVCVUdfU0hBREVSLnNldFVuaWZvcm0oIFRFWF9TQU1QTEVSLCAwICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JFYWNoRW50aXR5OiBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICBURVhfREVCVUdfU0hBREVSLnNldFVuaWZvcm0oIE1PREVMX01BVFJJWCwgZW50aXR5Lmdsb2JhbE1hdHJpeCgpICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JFYWNoTWVzaDogZnVuY3Rpb24oIG1lc2ggKSB7XHJcbiAgICAgICAgICAgIG1lc2gubWF0ZXJpYWwuZGlmZnVzZVRleHR1cmUucHVzaCggMCApO1xyXG4gICAgICAgICAgICBtZXNoLmRyYXcoKTtcclxuICAgICAgICAgICAgbWVzaC5tYXRlcmlhbC5kaWZmdXNlVGV4dHVyZS5wb3AoIDAgKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFmdGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUi5nbC5lbmFibGUoIFRFWF9ERUJVR19TSEFERVIuZ2wuREVQVEhfVEVTVCApO1xyXG4gICAgICAgICAgICBURVhfREVCVUdfU0hBREVSLnBvcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBkZWJ1Z0ZsYXRUZWNobmlxdWUgPSBuZXcgUmVuZGVyVGVjaG5pcXVlKHtcclxuICAgICAgICBpZDogXCJkZWJ1Z1wiLFxyXG4gICAgICAgIHBhc3NlczogWyBkZWJ1Z0ZsYXRQYXNzIF1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBkZWJ1Z1RleFRlY2huaXF1ZSA9IG5ldyBSZW5kZXJUZWNobmlxdWUoe1xyXG4gICAgICAgIGlkOiBcInRleFwiLFxyXG4gICAgICAgIHBhc3NlczogWyBkZWJ1Z1RleFBhc3MgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGRlYnVnUmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoWyBkZWJ1Z0ZsYXRUZWNobmlxdWUsIGRlYnVnVGV4VGVjaG5pcXVlIF0pO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBzZXRDYW1lcmE6IGZ1bmN0aW9uKCBjYW1lcmEgKSB7XHJcbiAgICAgICAgICAgIF9jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd1RleHR1cmU6IGZ1bmN0aW9uKCB0ZXh0dXJlICkge1xyXG4gICAgICAgICAgICB2YXIgZ2VvbWV0cnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBRdWFkLnBvc2l0aW9ucygpLFxyXG4gICAgICAgICAgICAgICAgICAgIHV2czogUXVhZC51dnMoKSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzOiAgUXVhZC5pbmRpY2VzKClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkgPSBuZXcgRW50aXR5KHtcclxuICAgICAgICAgICAgICAgIG1lc2hlczogWyBuZXcgTWVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyYWJsZTogZ2VvbWV0cnksXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWVydHJ5OiBnZW9tZXRyeSxcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmdXNlVGV4dHVyZTogdGV4dHVyZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pIF0sXHJcbiAgICAgICAgICAgICAgICBvcmlnaW46IFsgLTAuNzUsIDAuNzUsIDAgXSxcclxuICAgICAgICAgICAgICAgIHNjYWxlOiAwLjVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBudWxsLCB7XHJcbiAgICAgICAgICAgICAgICB0ZXg6IFsgZW50aXR5IF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd1dpcmVGcmFtZTogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgZGVidWdSZW5kZXJlci5yZW5kZXIoIF9jYW1lcmEsIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnOiBbIGNyZWF0ZURlYnVnRW50aXR5KCBlbnRpdHksIGNyZWF0ZVdpcmVGcmFtZUVudGl0eSApIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd1VWc0FzQ29sb3I6IGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVVVkNvbG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3VVZzQXNWZWN0b3JzOiBmdW5jdGlvbiggZW50aXR5LCBjb2xvciApIHtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVVVlZlY3RvckVudGl0eSApIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd05vcm1hbHNBc0NvbG9yOiBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlTm9ybWFsQ29sb3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdOb3JtYWxzQXNWZWN0b3JzOiBmdW5jdGlvbiggZW50aXR5LCBjb2xvciApIHtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVOb3JtYWxWZWN0b3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdUYW5nZW50c0FzQ29sb3I6IGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVUYW5nZW50Q29sb3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdUYW5nZW50c0FzVmVjdG9yczogZnVuY3Rpb24oIGVudGl0eSwgY29sb3IgICkge1xyXG4gICAgICAgICAgICBfY29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgZGVidWdSZW5kZXJlci5yZW5kZXIoIF9jYW1lcmEsIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnOiBbIGNyZWF0ZURlYnVnRW50aXR5KCBlbnRpdHksIGNyZWF0ZVRhbmdlbnRWZWN0b3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdCaVRhbmdlbnRzQXNDb2xvcjogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgZGVidWdSZW5kZXJlci5yZW5kZXIoIF9jYW1lcmEsIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnOiBbIGNyZWF0ZURlYnVnRW50aXR5KCBlbnRpdHksIGNyZWF0ZUJpVGFuZ2VudENvbG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3QmlUYW5nZW50c0FzVmVjdG9yczogZnVuY3Rpb24oIGVudGl0eSwgY29sb3IgICkge1xyXG4gICAgICAgICAgICBfY29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgZGVidWdSZW5kZXJlci5yZW5kZXIoIF9jYW1lcmEsIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnOiBbIGNyZWF0ZURlYnVnRW50aXR5KCBlbnRpdHksIGNyZWF0ZUJpVGFuZ2VudFZlY3RvckVudGl0eSApIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFsZmFkb3IgPSByZXF1aXJlKCdhbGZhZG9yJyksXHJcbiAgICAgICAgUXVhdGVybmlvbiA9IGFsZmFkb3IuUXVhdGVybmlvbixcclxuICAgICAgICBNYXQzMyA9IGFsZmFkb3IuTWF0MzMsXHJcbiAgICAgICAgTWF0NDQgPSBhbGZhZG9yLk1hdDQ0LFxyXG4gICAgICAgIFZlYzIgPSBhbGZhZG9yLlZlYzIsXHJcbiAgICAgICAgVmVjMyA9IGFsZmFkb3IuVmVjMztcclxuXHJcbiAgICB2YXIgQ09NUE9ORU5UX1RZUEVTX1RPX0JVRkZFUlZJRVdTID0ge1xyXG4gICAgICAgIFwiNTEyMFwiOiBJbnQ4QXJyYXksXHJcbiAgICAgICAgXCI1MTIxXCI6IFVpbnQ4QXJyYXksXHJcbiAgICAgICAgXCI1MTIyXCI6IEludDE2QXJyYXksXHJcbiAgICAgICAgXCI1MTIzXCI6IFVpbnQxNkFycmF5LFxyXG4gICAgICAgIFwiNTEyNlwiOiBGbG9hdDMyQXJyYXlcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRZUEVTX1RPX05VTV9DT01QT05FTlRTID0ge1xyXG4gICAgICAgIFwiU0NBTEFSXCI6IDEsXHJcbiAgICAgICAgXCJWRUMyXCI6IDIsXHJcbiAgICAgICAgXCJWRUMzXCI6IDMsXHJcbiAgICAgICAgXCJWRUM0XCI6IDQsXHJcbiAgICAgICAgXCJNQVQyXCI6IDQsXHJcbiAgICAgICAgXCJNQVQzXCI6IDksXHJcbiAgICAgICAgXCJNQVQ0XCI6IDE2XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBUWVBFU19UT19DTEFTUyA9IHtcclxuICAgICAgICBcIlNDQUxBUlwiOiBOdW1iZXIsXHJcbiAgICAgICAgXCJWRUMyXCI6IFZlYzIsXHJcbiAgICAgICAgXCJWRUMzXCI6IFZlYzMsXHJcbiAgICAgICAgXCJWRUM0XCI6IFF1YXRlcm5pb24sXHJcbiAgICAgICAgXCJNQVQzXCI6IE1hdDMzLFxyXG4gICAgICAgIFwiTUFUNFwiOiBNYXQ0NFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVBbmltYXRpb25QYXJhbWV0ZXIoIHBhcmFtZXRlcnNCeUFjY2Vzc29yLCBqc29uLCBwYXJhbWV0ZXJOYW1lLCBhY2Nlc3Nvck5hbWUsIGJ1ZmZlcnMgKSB7XHJcblxyXG4gICAgICAgIGlmICggcGFyYW1ldGVyc0J5QWNjZXNzb3JbIGFjY2Vzc29yTmFtZSBdICkge1xyXG4gICAgICAgICAgICAvLyBpZiBhbHJlYWR5IGNyZWF0ZWQsIG5vIG5lZWQgdG8gcmUtY3JlYXQgZWl0XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhY2Nlc3NvciA9IGpzb24uYWNjZXNzb3JzWyBhY2Nlc3Nvck5hbWUgXSxcclxuICAgICAgICAgICAgYnVmZmVyVmlldyA9IGpzb24uYnVmZmVyVmlld3NbIGFjY2Vzc29yLmJ1ZmZlclZpZXcgXSxcclxuICAgICAgICAgICAgYnVmZmVyID0gYnVmZmVyc1sgYnVmZmVyVmlldy5idWZmZXIgXSxcclxuICAgICAgICAgICAgVHlwZWRBcnJheSA9IENPTVBPTkVOVF9UWVBFU19UT19CVUZGRVJWSUVXU1sgYWNjZXNzb3IuY29tcG9uZW50VHlwZSBdLFxyXG4gICAgICAgICAgICBudW1Db21wb25lbnRzID0gVFlQRVNfVE9fTlVNX0NPTVBPTkVOVFNbIGFjY2Vzc29yLnR5cGUgXSxcclxuICAgICAgICAgICAgVHlwZUNsYXNzID0gVFlQRVNfVE9fQ0xBU1NbIGFjY2Vzc29yLnR5cGUgXSxcclxuICAgICAgICAgICAgYWNjZXNzb3JBcnJheUNvdW50ID0gYWNjZXNzb3IuY291bnQgKiBudW1Db21wb25lbnRzLFxyXG4gICAgICAgICAgICBhcnJheUJ1ZmZlciA9IG5ldyBUeXBlZEFycmF5KCBidWZmZXIsIGJ1ZmZlclZpZXcuYnl0ZU9mZnNldCArIGFjY2Vzc29yLmJ5dGVPZmZzZXQsIGFjY2Vzc29yQXJyYXlDb3VudCApLFxyXG4gICAgICAgICAgICB2YWx1ZXMgPSBbXSxcclxuICAgICAgICAgICAgYmVnaW5JbmRleCxcclxuICAgICAgICAgICAgZW5kSW5kZXgsXHJcbiAgICAgICAgICAgIGk7XHJcblxyXG4gICAgICAgIGlmICggVHlwZUNsYXNzID09PSBOdW1iZXIgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdHlwZSBpcyBhIHNjYWxhciwgcmV0dXJuIHRoZSBidWZmZXJcclxuICAgICAgICAgICAgdmFsdWVzID0gYXJyYXlCdWZmZXI7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHBhcmFtZXRlck5hbWUgPT09IFwicm90YXRpb25cIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgZWFjaCBjb21wb25lbnQgaW4gdGhlIGFjY2Vzc29yXHJcbiAgICAgICAgICAgICAgICBmb3IgKCBpPTA7IGk8YWNjZXNzb3IuY291bnQ7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjIHRoZSBiZWdpbiBhbmQgZW5kIGluIGFycmF5YnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgYmVnaW5JbmRleCA9IGkgKiBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gYmVnaW5JbmRleCArIG51bUNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBzdWJhcnJheSB0aGF0IGNvbXBvc2VzIHRoZSBtYXRyaXhcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXM6IG5ldyBWZWMzKCBhcnJheUJ1ZmZlci5zdWJhcnJheSggYmVnaW5JbmRleCwgZW5kSW5kZXgtMSApICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBhcnJheUJ1ZmZlci5zdWJhcnJheSggZW5kSW5kZXgtMSwgZW5kSW5kZXggKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgZWFjaCBjb21wb25lbnQgaW4gdGhlIGFjY2Vzc29yXHJcbiAgICAgICAgICAgICAgICBmb3IgKCBpPTA7IGk8YWNjZXNzb3IuY291bnQ7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjIHRoZSBiZWdpbiBhbmQgZW5kIGluIGFycmF5YnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgYmVnaW5JbmRleCA9IGkgKiBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gYmVnaW5JbmRleCArIG51bUNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBzdWJhcnJheSB0aGF0IGNvbXBvc2VzIHRoZSBtYXRyaXhcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFR5cGVDbGFzcyggYXJyYXlCdWZmZXIuc3ViYXJyYXkoIGJlZ2luSW5kZXgsIGVuZEluZGV4ICkgKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmFtZXRlcnNCeUFjY2Vzc29yWyBhY2Nlc3Nvck5hbWUgXSA9IHZhbHVlcztcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgZnVuY3Rpb24gcmVzb2x2ZUFuaW1hdGlvblRhcmdldCgganNvbiwgdGFyZ2V0SWQsIHRhcmdldFBhdGggKSB7XHJcbiAgICAgICAgLy8gQXMgcGVyIDAuOCBzcGVjLCBhbmltYXRpb24gdGFyZ2V0cyBjYW4gYmU6XHJcbiAgICAgICAgLy8gICAgIG5vZGVzXHJcbiAgICAgICAgLy8gICAgIG1hdGVyaWFscyAoIGluc3RhbmNlVGVjaG5pcXVlcyApXHJcbiAgICAgICAgLy8gICAgIHRlY2huaXF1ZXNcclxuICAgICAgICAvLyAgICAgY2FtZXJhc1xyXG4gICAgICAgIC8vICAgICBsaWdodHNcclxuICAgICAgICAvLyBmaXJzdCBjaGVjayBub2Rlc1xyXG4gICAgICAgIGlmICgganNvbi5ub2Rlc1sgdGFyZ2V0SWRdICkge1xyXG4gICAgICAgICAgICAvLyBub2RlXHJcbiAgICAgICAgICAgIGlmICgganNvbi5ub2Rlc1sgdGFyZ2V0SWQgXS5qb2ludE5hbWUgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBqb2ludFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gbm9kZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICgganNvbi5tYXRlcmlhbHNbIHRhcmdldElkIF0gKSB7XHJcbiAgICAgICAgICAgIC8vIG1hdGVyaWFsXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGlnbm9yZSBmb3Igbm93XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVBbmltYXRpb24oIGFuaW1hdGlvbnNCeVRhcmdldCwgcGFyYW1ldGVyc0J5QWNjZXNzb3IsIGpzb24sIGFuaW1hdGlvbiwgYnVmZmVycyApIHtcclxuICAgICAgICB2YXIgcGFyYW1ldGVycyA9IGFuaW1hdGlvbi5wYXJhbWV0ZXJzLFxyXG4gICAgICAgICAgICBjaGFubmVsLFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgIHNhbXBsZXIsXHJcbiAgICAgICAgICAgIGlucHV0QWNjZXNzb3IsXHJcbiAgICAgICAgICAgIG91dHB1dEFjY2Vzc29yLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGZvciBlYWNoIGNoYW5uZWwgaW4gdGhlIGFuaW1hdGlvblxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxhbmltYXRpb24uY2hhbm5lbHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYW5pbWF0aW9uIGNoYW5uZWxcclxuICAgICAgICAgICAgY2hhbm5lbCA9IGFuaW1hdGlvbi5jaGFubmVsc1tpXTtcclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSB0YXJnZXQgb2YgdGhlIGFuaW1hdGlvblxyXG4gICAgICAgICAgICB0YXJnZXQgPSBjaGFubmVsLnRhcmdldDtcclxuICAgICAgICAgICAgLy8gZ2V0IHNhbXBsZXIgZm9yIHRoZSBjaGFubmVsXHJcbiAgICAgICAgICAgIHNhbXBsZXIgPSBhbmltYXRpb24uc2FtcGxlcnNbIGNoYW5uZWwuc2FtcGxlciBdO1xyXG4gICAgICAgICAgICAvLyBnZXQgYWNjZXNzb3IgdG8gY2hhbm5lbCBpbnB1dFxyXG4gICAgICAgICAgICBpbnB1dEFjY2Vzc29yID0gcGFyYW1ldGVyc1sgc2FtcGxlci5pbnB1dCBdO1xyXG4gICAgICAgICAgICAvLyBnZXQgYWNjZXNzb3IgdG8gY2hhbm5lbCBvdXRwdXRcclxuICAgICAgICAgICAgb3V0cHV0QWNjZXNzb3IgPSBwYXJhbWV0ZXJzWyBzYW1wbGVyLm91dHB1dCBdO1xyXG4gICAgICAgICAgICAvLyBjYXN0IGlucHV0IHBhcmFtZXRlclxyXG4gICAgICAgICAgICBjcmVhdGVBbmltYXRpb25QYXJhbWV0ZXIoXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzQnlBY2Nlc3NvcixcclxuICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLmlucHV0LCAvLyBwYXJhbWV0ZXIgbmFtZVxyXG4gICAgICAgICAgICAgICAgaW5wdXRBY2Nlc3NvcixcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcnMgKTtcclxuICAgICAgICAgICAgLy8gY2FzdCBvdXRwdXQgcGFyYW1ldGVyXHJcbiAgICAgICAgICAgIGNyZWF0ZUFuaW1hdGlvblBhcmFtZXRlcihcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnNCeUFjY2Vzc29yLFxyXG4gICAgICAgICAgICAgICAganNvbixcclxuICAgICAgICAgICAgICAgIHNhbXBsZXIub3V0cHV0LCAvLyBwYXJhbWV0ZXIgbmFtZVxyXG4gICAgICAgICAgICAgICAgb3V0cHV0QWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICBidWZmZXJzICk7XHJcbiAgICAgICAgICAgIC8vIHNhdmUgaW5wdXRcclxuICAgICAgICAgICAgYW5pbWF0aW9uc0J5VGFyZ2V0WyB0YXJnZXQuaWQgXSA9IGFuaW1hdGlvbnNCeVRhcmdldFsgdGFyZ2V0LmlkIF0gfHwgW107XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbnNCeVRhcmdldFsgdGFyZ2V0LmlkIF0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiB0YXJnZXQucGF0aCxcclxuICAgICAgICAgICAgICAgIGlucHV0OiBwYXJhbWV0ZXJzQnlBY2Nlc3NvclsgaW5wdXRBY2Nlc3NvciBdLFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBwYXJhbWV0ZXJzQnlBY2Nlc3Nvclsgb3V0cHV0QWNjZXNzb3IgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIGNyZWF0ZUFuaW1hdGlvbnM6IGZ1bmN0aW9uKCBqc29uLCBidWZmZXJzICkge1xyXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uc0J5VGFyZ2V0ID0ge30sXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzQnlBY2Nlc3NvciA9IHt9LFxyXG4gICAgICAgICAgICAgICAga2V5O1xyXG4gICAgICAgICAgICBmb3IgKCBrZXkgaW4ganNvbi5hbmltYXRpb25zICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBqc29uLmFuaW1hdGlvbnMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUFuaW1hdGlvbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uc0J5VGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzQnlBY2Nlc3NvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5hbmltYXRpb25zWyBrZXkgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVycyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25zQnlUYXJnZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxyXG4gICAgICAgIGdsVEZVdGlsID0gcmVxdWlyZSgnLi9nbFRGVXRpbCcpLFxyXG4gICAgICAgIGdsVEZNYXRlcmlhbCA9IHJlcXVpcmUoJy4vZ2xURk1hdGVyaWFsJyksXHJcbiAgICAgICAgZ2xURkFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vZ2xURkFuaW1hdGlvbicpLFxyXG4gICAgICAgIGdsVEZNZXNoID0gcmVxdWlyZSgnLi9nbFRGTWVzaCcpLFxyXG4gICAgICAgIGdsVEZQYXJzZXIgPSByZXF1aXJlKCcuL2dsVEZQYXJzZXInKSxcclxuICAgICAgICBnbFRGU2tlbGV0b24gPSByZXF1aXJlKCcuL2dsVEZTa2VsZXRvbicpLFxyXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCcuLi9VdGlsJyksXHJcbiAgICAgICAgRW50aXR5ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL0VudGl0eScpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVudGl0eVJlY3Vyc2l2ZSgganNvbiwgbWVzaGVzLCBidWZmZXJzLCBub2RlTmFtZSApIHtcclxuICAgICAgICB2YXIgbm9kZSA9IGpzb24ubm9kZXNbIG5vZGVOYW1lIF0sXHJcbiAgICAgICAgICAgIG5vZGVNZXNoZXMgPSBbXSxcclxuICAgICAgICAgICAgY2hpbGRyZW4gPSBbXSxcclxuICAgICAgICAgICAgc2tlbGV0b24gPSBudWxsLFxyXG4gICAgICAgICAgICBhbmltYXRpb25zID0gbnVsbCxcclxuICAgICAgICAgICAgdHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBjaGlsZCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBjaGVjayB0eXBlIG9mIG5vZGVcclxuICAgICAgICBpZiAoIG5vZGUuam9pbnROYW1lIHx8IG5vZGUuY2FtZXJhIHx8IG5vZGUubGlnaHQgKSB7XHJcbiAgICAgICAgICAgIC8vIG5vZGUgaXMgZWl0aGVyIGEgam9pbnQsIGNhbWVyYSwgb3IgbGlnaHQsIHNvIGlnbm9yZSBpdCBhcyBhbiBlbnRpdHlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGdldCB0aGUgbm9kZXMgdHJhbnNmb3JtXHJcbiAgICAgICAgdHJhbnNmb3JtID0gZ2xURlV0aWwuZ2V0Tm9kZU1hdHJpeCggbm9kZSApLmRlY29tcG9zZSgpO1xyXG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGFzc2VtYmxlIHRoZSBza2VsZXRvbiBqb2ludCB0cmVlXHJcbiAgICAgICAgZm9yICggaT0wOyBpPG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gY3JlYXRlRW50aXR5UmVjdXJzaXZlKCBqc29uLCBtZXNoZXMsIGJ1ZmZlcnMsIG5vZGUuY2hpbGRyZW5baV0gKTtcclxuICAgICAgICAgICAgLy8gZW50aXR5IGNhbiBiZSBudWxsIHNpbmNlIHdlIGlnbm9yZSBjYW1lcmFzLCBqb2ludHMsIGFuZCBsaWdodHNcclxuICAgICAgICAgICAgaWYgKCBjaGlsZCApIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goIGNoaWxkICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgbm9kZSBoYXMgYSBtZXNoLCBhZGQgaXQsXHJcbiAgICAgICAgaWYgKCBub2RlLm1lc2hlcyApIHtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPG5vZGUubWVzaGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgbm9kZU1lc2hlcyA9IG5vZGVNZXNoZXMuY29uY2F0KCBtZXNoZXNbIG5vZGUubWVzaGVzW2ldIF0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiBub2RlIGhhcyBhbiBpbnN0YW5jZVNraW4sIGNyZWF0ZSBza2VsZXRvbiAvIGFuaW1hdGlvbnNcclxuICAgICAgICBpZiAoIG5vZGUuaW5zdGFuY2VTa2luICkge1xyXG4gICAgICAgICAgICAvLyBza2VsZXRvblxyXG4gICAgICAgICAgICBza2VsZXRvbiA9IGdsVEZTa2VsZXRvbi5jcmVhdGVTa2VsZXRvbigganNvbiwgbm9kZS5pbnN0YW5jZVNraW4sIGJ1ZmZlcnMgKTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPG5vZGUuaW5zdGFuY2VTa2luLm1lc2hlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIG5vZGVNZXNoZXMgPSBub2RlTWVzaGVzLmNvbmNhdCggbWVzaGVzWyBub2RlLmluc3RhbmNlU2tpbi5tZXNoZXNbaV0gXSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbnNcclxuICAgICAgICAgICAgLy8gTk9URTogYW5pbWF0aW9ucyB0ZWNobmljYWxseSBtYXkgbm90IHJlcXVpcmUgYSBza2VsZXRvblxyXG4gICAgICAgICAgICBhbmltYXRpb25zID0gZ2xURkFuaW1hdGlvbi5jcmVhdGVBbmltYXRpb25zKCBqc29uLCBidWZmZXJzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgRW50aXR5KHtcclxuICAgICAgICAgICAgaWQ6IG5vZGVOYW1lLFxyXG4gICAgICAgICAgICB1cDogdHJhbnNmb3JtLnVwLFxyXG4gICAgICAgICAgICBmb3J3YXJkOiB0cmFuc2Zvcm0uZm9yd2FyZCxcclxuICAgICAgICAgICAgbGVmdDogdHJhbnNmb3JtLmxlZnQsXHJcbiAgICAgICAgICAgIG9yaWdpbjogdHJhbnNmb3JtLm9yaWdpbixcclxuICAgICAgICAgICAgc2NhbGU6IHRyYW5zZm9ybS5zY2FsZSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgICAgICAgICBtZXNoZXM6IG5vZGVNZXNoZXMsXHJcbiAgICAgICAgICAgIHNrZWxldG9uOiBza2VsZXRvbixcclxuICAgICAgICAgICAgYW5pbWF0aW9uczogYW5pbWF0aW9uc1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVudGl0aWVzKCBqc29uLCBtZXNoZXMsIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgdmFyIHJvb3ROb2RlcyA9IGpzb24uc2NlbmVzWyBqc29uLnNjZW5lIF0ubm9kZXMsXHJcbiAgICAgICAgICAgIGVudGl0aWVzID0gW10sXHJcbiAgICAgICAgICAgIGVudGl0eSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBub2RlXHJcbiAgICAgICAgZm9yICggaT0wOyBpPHJvb3ROb2Rlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgZW50aXR5ID0gY3JlYXRlRW50aXR5UmVjdXJzaXZlKCBqc29uLCBtZXNoZXMsIGJ1ZmZlcnMsIHJvb3ROb2Rlc1tpXSApO1xyXG4gICAgICAgICAgICAvLyBlbnRpdHkgY2FuIGJlIG51bGwgc2luY2Ugd2UgaWdub3JlIGNhbWVyYXMsIGpvaW50cywgYW5kIGxpZ2h0c1xyXG4gICAgICAgICAgICBpZiAoIGVudGl0eSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdGllcy5wdXNoKCBlbnRpdHkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZW50aXRpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZEVudGl0eSgganNvbiwgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgLy8gd2FpdCBmb3IgYXJyYXlidWZmZXJzIGFuZCBtYXRlcmlhbHNcclxuICAgICAgICBVdGlsLmFzeW5jKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXJzOiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZW5kIHJlcXVlc3RzIGZvciBidWZmZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xURlV0aWwucmVxdWVzdEJ1ZmZlcnMoIGpzb24uYnVmZmVycywgZnVuY3Rpb24oIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoIGJ1ZmZlcnMgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbHM6IGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvYWQgbWF0ZXJpYWwgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGdsVEZNYXRlcmlhbC5sb2FkTWF0ZXJpYWxzKCBqc29uLCBmdW5jdGlvbiggbWF0ZXJpYWxzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCBtYXRlcmlhbHMgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oIHJlc3VsdCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBtZXNoZXMsIHRoZW4gZW50aXRpZXNcclxuICAgICAgICAgICAgICAgIHZhciBtZXNoZXMgPSBnbFRGTWVzaC5jcmVhdGVNZXNoZXMoIGpzb24sIHJlc3VsdC5idWZmZXJzLCByZXN1bHQubWF0ZXJpYWxzICk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggY3JlYXRlRW50aXRpZXMoIGpzb24sIG1lc2hlcywgcmVzdWx0LmJ1ZmZlcnMgKSApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9hZHMgYSBnbFRGIEpTT04gZmlsZSwgZ2VuZXJhdGVzIGEgTW9kZWwgb2JqZWN0LCBhbmQgcGFzc2VzIGl0IHRvXHJcbiAgICAgICAgICogdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHVwb24gY29tcGxldGlvbi4gVGhpcyBhbHNvIGludm9sdmVzIGxvYWRpbmcgYW5kXHJcbiAgICAgICAgICogZ2VuZXJhdGluZyB0aGUgYXNzb2NpYXRlZCBNYXRlcmlhbCBvYmplY3RzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gdGhlIEpTT04gZmlsZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uKCB1cmwsIGNhbGxiYWNrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG1vZGVsTmFtZSA9IHBhdGguYmFzZW5hbWUoIHVybCwgcGF0aC5leHRuYW1lKCB1cmwgKSApLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VyID0gT2JqZWN0LmNyZWF0ZSggZ2xURlBhcnNlciwge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZUxvYWRDb21wbGV0ZWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEVudGl0eSggdGhpcy5qc29uLCBmdW5jdGlvbiggY2hpbGRyZW4gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGVsID0gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogbW9kZWxOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBtb2RlbCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcGFyc2VyLmluaXRXaXRoUGF0aCggdXJsICk7XHJcbiAgICAgICAgICAgIHBhcnNlci5sb2FkKCBudWxsLCBudWxsICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBVdGlsID0gcmVxdWlyZSgnLi4vVXRpbCcpLFxyXG4gICAgICAgIGdsVEZVdGlsID0gcmVxdWlyZSgnLi9nbFRGVXRpbCcpLFxyXG4gICAgICAgIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvVGV4dHVyZTJEJyksXHJcbiAgICAgICAgTWF0ZXJpYWwgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvTWF0ZXJpYWwnKTtcclxuXHJcbiAgICB2YXIgVEVYVFVSRV9GT1JNQVRTID0ge1xyXG4gICAgICAgIFwiNjQwNlwiOiBcIkFMUEhBXCIsXHJcbiAgICAgICAgXCI2NDA3XCI6IFwiUkdCXCIsXHJcbiAgICAgICAgXCI2NDA4XCI6IFwiUkdCQVwiLFxyXG4gICAgICAgIFwiNjQwOVwiOiBcIkxVTUlOQU5DRVwiLFxyXG4gICAgICAgIFwiNjQxMFwiOiBcIkxVTUlOQU5DRV9BTFBIQVwiLFxyXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcIlJHQkFcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVEVYVFVSRV9JTlRFUk5BTF9GT1JNQVRTID0ge1xyXG4gICAgICAgIFwiNjQwNlwiOiBcIkFMUEhBXCIsXHJcbiAgICAgICAgXCI2NDA3XCI6IFwiUkdCXCIsXHJcbiAgICAgICAgXCI2NDA4XCI6IFwiUkdCQVwiLFxyXG4gICAgICAgIFwiNjQwOVwiOiBcIkxVTUlOQU5DRVwiLFxyXG4gICAgICAgIFwiNjQxMFwiOiBcIkxVTUlOQU5DRV9BTFBIQVwiLFxyXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcIlJHQkFcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVEVYVFVSRV9UWVBFUyA9IHtcclxuICAgICAgICBcIjUxMjFcIjogXCJVTlNJR05FRF9CWVRFXCIsXHJcbiAgICAgICAgXCIzMzYzNVwiOiBcIlVOU0lHTkVEX1NIT1JUXzVfNl81XCIsXHJcbiAgICAgICAgXCIzMjgxOVwiOiBcIlVOU0lHTkVEX1NIT1JUXzRfNF80XzRcIixcclxuICAgICAgICBcIjMyODIwXCI6IFwiVU5TSUdORURfU0hPUlRfNV81XzVfMVwiLFxyXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcIlVOU0lHTkVEX0JZVEVcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVEVDSE5JUVVFX1BBUkFNRVRFUl9UWVBFUyA9IHtcclxuICAgICAgICBcIjUxMjJcIjogXCJTSE9SVFwiLFxyXG4gICAgICAgIFwiNTEyM1wiOiBcIlVOU0lHTkVEX1NIT1JUXCIsXHJcbiAgICAgICAgXCI1MTI0XCI6IFwiSU5UXCIsXHJcbiAgICAgICAgXCI1MTI1XCI6IFwiVU5TSUdORURfSU5UXCIsXHJcbiAgICAgICAgXCI1MTI2XCI6IFwiRkxPQVRcIixcclxuICAgICAgICBcIjM1NjY0XCI6IFwiRkxPQVRfVkVDMlwiLFxyXG4gICAgICAgIFwiMzU2NjVcIjogXCJGTE9BVF9WRUMzXCIsXHJcbiAgICAgICAgXCIzNTY2NlwiOiBcIkZMT0FUX1ZFQzRcIixcclxuICAgICAgICBcIjM1NjY3XCI6IFwiSU5UX1ZFQzJcIixcclxuICAgICAgICBcIjM1NjY4XCI6IFwiSU5UX1ZFQzNcIixcclxuICAgICAgICBcIjM1NjY5XCI6IFwiSU5UX1ZFQzRcIixcclxuICAgICAgICBcIjM1NjcwXCI6IFwiQk9PTFwiLFxyXG4gICAgICAgIFwiMzU2NzFcIjogXCJCT09MX1ZFQzJcIixcclxuICAgICAgICBcIjM1NjcyXCI6IFwiQk9PTF9WRUMzXCIsXHJcbiAgICAgICAgXCIzNTY3M1wiOiBcIkJPT0xfVkVDNFwiLFxyXG4gICAgICAgIFwiMzU2NzRcIjogXCJGTE9BVF9NQVQyXCIsXHJcbiAgICAgICAgXCIzNTY3NVwiOiBcIkZMT0FUX01BVDNcIixcclxuICAgICAgICBcIjM1Njc2XCI6IFwiRkxPQVRfTUFUNFwiLFxyXG4gICAgICAgIFwiMzU2NzhcIjogXCJTQU1QTEVSXzJEXCJcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBwcm9wZXJ0eSBmb3IgdGhlIG1hdGVyaWFsIGJhc2VkIG9uIGl0cyBuYW1lLiBJZiB0aGVyZSBpcyBubyB2YWx1ZSxcclxuICAgICAqIGFzc2lnbiBpdCBhIGRlZmF1bHQgY29sb3IuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1hdGVyaWFsIC0gVGhlIGN1cnJlbnQgbWF0ZXJpYWwgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtZXRlck5hbWUgLSBUaGUgbWF0ZXJpYWwgcGFyYW1ldGVycyBuYW1lLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlVGVjaG5pcXVlIC0gVGhlIGluc3RhbmNlVGVjaG5pcXVlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXh0dXJlcyAtIFRoZSBtYXAgb2YgVGV4dHVyZTJEIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldE1hdGVyaWFsQXR0cmlidXRlKCBtYXRlcmlhbCwgcGFyYW1ldGVyTmFtZSwgaW5zdGFuY2VUZWNobmlxdWUsIHRleHR1cmVzICkge1xyXG4gICAgICAgIHZhciBwYXJhbWV0ZXIgPSBpbnN0YW5jZVRlY2huaXF1ZVsgcGFyYW1ldGVyTmFtZSBdO1xyXG4gICAgICAgIGlmICggcGFyYW1ldGVyICkge1xyXG4gICAgICAgICAgICBpZiAoIFRFQ0hOSVFVRV9QQVJBTUVURVJfVFlQRVNbIHBhcmFtZXRlci50eXBlIF0gPT09IFwiU0FNUExFUl8yRFwiICkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0IHRleHR1cmVcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsWyBwYXJhbWV0ZXJOYW1lICsgXCJUZXh0dXJlXCIgXSA9IHRleHR1cmVzWyBwYXJhbWV0ZXIudmFsdWUgXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCBjb2xvclxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxbIHBhcmFtZXRlck5hbWUgKyBcIkNvbG9yXCIgXSA9IHBhcmFtZXRlci52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlIGEgTWF0ZXJpYWwgb2JqZWN0IGZyb20gdGhlIGluc3RhbmNlVGVjaG5pcXVlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtYXRlcmlhbElkIC0gVGhlIG1hdGVyaWFscyB1bmlxdWUgaWQ7XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VUZWNobmlxdWUgLSBUaGUgaW5zdGFuY2VUZWNobmlxdWUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRleHR1cmVzIC0gVGhlIG1hcCBvZiBUZXh0dXJlMkQgb2JqZWN0cy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgaW5zdGFudGlhdGVkIE1hdGVyaWFsIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlTWF0ZXJpYWwoIG1hdGVyaWFsSWQsIGluc3RhbmNlVGVjaG5pcXVlLCB0ZXh0dXJlcyApIHtcclxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgIGlkOiBtYXRlcmlhbElkXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBzZXQgYW1iaWVudCB0ZXh0dXJlIG9yIGNvbG9yXHJcbiAgICAgICAgc2V0TWF0ZXJpYWxBdHRyaWJ1dGUoXHJcbiAgICAgICAgICAgIG1hdGVyaWFsLFxyXG4gICAgICAgICAgICAnYW1iaWVudCcsXHJcbiAgICAgICAgICAgIGluc3RhbmNlVGVjaG5pcXVlLFxyXG4gICAgICAgICAgICB0ZXh0dXJlc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gc2V0IGRpZmZ1c2UgdGV4dHVyZSBvciBjb2xvclxyXG4gICAgICAgIHNldE1hdGVyaWFsQXR0cmlidXRlKFxyXG4gICAgICAgICAgICBtYXRlcmlhbCxcclxuICAgICAgICAgICAgJ2RpZmZ1c2UnLFxyXG4gICAgICAgICAgICBpbnN0YW5jZVRlY2huaXF1ZSxcclxuICAgICAgICAgICAgdGV4dHVyZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIHNldCBzcGVjdWxhciB0ZXh0dXJlIG9yIGNvbG9yXHJcbiAgICAgICAgc2V0TWF0ZXJpYWxBdHRyaWJ1dGUoXHJcbiAgICAgICAgICAgIG1hdGVyaWFsLFxyXG4gICAgICAgICAgICAnc3BlY3VsYXInLFxyXG4gICAgICAgICAgICBpbnN0YW5jZVRlY2huaXF1ZSxcclxuICAgICAgICAgICAgdGV4dHVyZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIHNldCBzcGVjdWxhciBjb21wb25lbnRcclxuICAgICAgICBpZiAoIGluc3RhbmNlVGVjaG5pcXVlLnNoaW5pbmVzcyApIHtcclxuICAgICAgICAgICAgbWF0ZXJpYWwuc3BlY3VsYXJDb21wb25lbnQgPSBpbnN0YW5jZVRlY2huaXF1ZS5zaGluaW5lc3MudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTWF0ZXJpYWwoIG1hdGVyaWFsICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIGdsVEYgJ21hdGVyaWFsJyBoYXMgYW4gJ2luc3RhbmNlVGVjaG5pcXVlJyBhdHRyaWJ1dGUgdGhhdCByZWZlcmVuY2VzXHJcbiAgICAgKiB0aGUgJ3RlY2huaXF1ZScgdG8gb3ZlcnJpZGUuIFRoaXMgZnVuY3Rpb24gb3ZlcmxheXMgdGhlIHZhbHVlcyBmcm9tIHRoZVxyXG4gICAgICogaW5zdGFuY2VUZWNobmlxdWUgb250byB0aGUgdGVjaG5pcXVlIGFuZCByZXR1cm5zIGl0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZWNobmlxdWUgLSBUaGUgdGVjaG5pcXVlIHRvIG92ZXJyaWRlLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlVGVjaG5pcXVlIC0gVGhlIGluc3RhbmNlVGVjaG5pcXVlIHRoYXQgY29udGFpbnMgdGhlIG92ZXJyaWRlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgb3ZlcnJpZGVkIHRlY2huaXF1ZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gb3ZlcnJpZGVUZWNobmlxdWVXaXRoSW5zdGFuY2UoIHRlY2huaXF1ZSwgaW5zdGFuY2VUZWNobmlxdWUgKSB7XHJcbiAgICAgICAgdmFyIHRlY2huaXF1ZVBhcmFtZXRlcnMgPSAgVXRpbC5jb3B5KCB0ZWNobmlxdWUucGFyYW1ldGVycyApLFxyXG4gICAgICAgICAgICBpbnN0YW5jZVZhbHVlcyA9IFV0aWwuY29weSggaW5zdGFuY2VUZWNobmlxdWUudmFsdWVzICksXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBwYXJhbWV0ZXIgaW4gdGhlICd0ZWNobmlxdWUnIG5vZGUsIG92ZXJyaWRlIHdpdGhcclxuICAgICAgICAvLyAnaW5zdGFuY2VUZWNobmlxdWUnIHZhbHVlLCBpZiBpdCBleGlzdHNcclxuICAgICAgICBmb3IgKCBrZXkgaW4gaW5zdGFuY2VWYWx1ZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggaW5zdGFuY2VWYWx1ZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0IG9yIG92ZXJyaWRlIHRoZSB0ZWNobmlxdWVzIHZhbHVlXHJcbiAgICAgICAgICAgICAgICB0ZWNobmlxdWVQYXJhbWV0ZXJzWyBrZXkgXS52YWx1ZSA9IGluc3RhbmNlVmFsdWVzWyBrZXkgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVjaG5pcXVlUGFyYW1ldGVycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhbmQgcmV0dXJucyBhIG1hcCBvZiBhbGwgTWF0ZXJpYWwgb2JqZWN0cyBkZWZpbmVkIGluIHRoZVxyXG4gICAgICogZ2xURiBKU09OLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBqc29uIC0gVGhlIGdsVEYgSlNPTi5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXh0dXJlcyAtIFRoZSBtYXAgb2YgVGV4dHVyZTJEIG9iamVjdHMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIG1hcCBvZiBNYXRlcmlhbCBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVNYXRlcmlhbHMoIGpzb24sIHRleHR1cmVzICkge1xyXG4gICAgICAgIHZhciBtYXRlcmlhbHMgPSBqc29uLm1hdGVyaWFscyxcclxuICAgICAgICAgICAgdGVjaG5pcXVlcyA9IGpzb24udGVjaG5pcXVlcyxcclxuICAgICAgICAgICAgcmVzdWx0cyA9IHt9LFxyXG4gICAgICAgICAgICBpbnN0YW5jZVRlY2huaXF1ZSxcclxuICAgICAgICAgICAgb3ZlcnJpZGRlblRlY2huaXF1ZSxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIC8vIGZvciBlYWNoIG1hdGVyaWFsXHJcbiAgICAgICAgZm9yICgga2V5IGluIG1hdGVyaWFscyApIHtcclxuICAgICAgICAgICAgaWYgKCBtYXRlcmlhbHMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUgPSBtYXRlcmlhbHNbIGtleSBdLmluc3RhbmNlVGVjaG5pcXVlO1xyXG4gICAgICAgICAgICAgICAgLy8gb3ZlcmlkZSB0aGUgdGVjaG5pcXVlIHZhbHVlcyB3aXRoIGluc3RhbmNlIHRlY2huaXF1ZSB2YWx1ZXNcclxuICAgICAgICAgICAgICAgIG92ZXJyaWRkZW5UZWNobmlxdWUgPSBvdmVycmlkZVRlY2huaXF1ZVdpdGhJbnN0YW5jZShcclxuICAgICAgICAgICAgICAgICAgICB0ZWNobmlxdWVzWyBpbnN0YW5jZVRlY2huaXF1ZS50ZWNobmlxdWUgXSxcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVRlY2huaXF1ZSApO1xyXG4gICAgICAgICAgICAgICAgLy8gY29ubmVjdCB0ZXh0dXJlIGltYWdlIHNvdXJjZXNcclxuICAgICAgICAgICAgICAgIHJlc3VsdHNbIGtleSBdID0gY3JlYXRlTWF0ZXJpYWwoIGtleSwgb3ZlcnJpZGRlblRlY2huaXF1ZSwgdGV4dHVyZXMgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhbmQgcmV0dXJucyBhIG1hcCBvZiBhbGwgVGV4dHVyZTJEIG9iamVjdHMgZGVmaW5lZCBpbiB0aGVcclxuICAgICAqIGdsVEYgSlNPTi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ganNvbiAtIFRoZSBnbFRGIEpTT04uXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VzIC0gVGhlIG1hcCBvZiBJbWFnZSBvYmplY3RzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtYXAgb2YgVGV4dHVyZTJEIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRleHR1cmVzKCBqc29uLCBpbWFnZXMgKSB7XHJcbiAgICAgICAgdmFyIHRleHR1cmVzID0ganNvbi50ZXh0dXJlcyxcclxuICAgICAgICAgICAgdGV4dHVyZSxcclxuICAgICAgICAgICAgcmVzdWx0cyA9IHt9LFxyXG4gICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggdGV4dHVyZVxyXG4gICAgICAgIGZvciAoIGtleSBpbiB0ZXh0dXJlcyApIHtcclxuICAgICAgICAgICAgaWYgKCB0ZXh0dXJlcy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlID0gdGV4dHVyZXNbIGtleSBdO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIFRleHR1cmUyRCBvYmplY3QgZnJvbSBpbWFnZVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0c1sga2V5IF0gPSBuZXcgVGV4dHVyZTJEKHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2VzWyB0ZXh0dXJlLnNvdXJjZSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogVEVYVFVSRV9GT1JNQVRTWyB0ZXh0dXJlLmZvcm1hdCBdIHx8IFRFWFRVUkVfRk9STUFUUy5kZWZhdWx0LFxyXG4gICAgICAgICAgICAgICAgICAgIGludGVybmFsRm9ybWF0OiBURVhUVVJFX0lOVEVSTkFMX0ZPUk1BVFNbIHRleHR1cmUuaW50ZXJuYWxGb3JtYXQgXSB8fCBURVhUVVJFX0lOVEVSTkFMX0ZPUk1BVFMuZGVmYXVsdCxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBURVhUVVJFX1RZUEVTWyB0ZXh0dXJlLnR5cGUgXSB8fCBURVhUVVJFX1RZUEVTLmRlZmF1bHQsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcDogXCJSRVBFQVRcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvYWQgYW5kIGNyZWF0ZSBhbGwgTWF0ZXJpYWwgb2JqZWN0cyBzdG9yZWQgaW4gdGhlIGdsVEYgSlNPTi4gVXBvblxyXG4gICAgICAgICAqIGNvbXBsZXRpb24sIGV4ZWN1dGVzIGNhbGxiYWNrIGZ1bmN0aW9uIHBhc3NpbmcgbWF0ZXJpYWwgbWFwIGFzIGZpcnN0XHJcbiAgICAgICAgICogYXJndW1lbnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0ganNvbiAtIFRoZSBnbFRGIEpTT04uXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbG9hZE1hdGVyaWFsczogZnVuY3Rpb24oIGpzb24sIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICAvLyBzZW5kIHJlcXVlc3RzIGZvciBpbWFnZXNcclxuICAgICAgICAgICAgZ2xURlV0aWwucmVxdWVzdEltYWdlcygganNvbi5pbWFnZXMsIGZ1bmN0aW9uKCBpbWFnZXMgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdGV4dHVyZXMgZnJvbSBpbWFnZXMsIHRoZW4gY3JlYXRlIG1hdGVyaWFsc1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmVzID0gY3JlYXRlVGV4dHVyZXMoIGpzb24sIGltYWdlcyApLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFscyA9IGNyZWF0ZU1hdGVyaWFscygganNvbiwgdGV4dHVyZXMgKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBtYXRlcmlhbHMgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZXJ0ZXhCdWZmZXIgPSByZXF1aXJlKCcuLi8uLi9jb3JlL1ZlcnRleEJ1ZmZlcicpLFxyXG4gICAgICAgIEluZGV4QnVmZmVyID0gcmVxdWlyZSgnLi4vLi4vY29yZS9JbmRleEJ1ZmZlcicpLFxyXG4gICAgICAgIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgTWVzaCA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlci9NZXNoJyk7XHJcblxyXG4gICAgdmFyIEFDQ0VTU09SX0NPTVBPTkVOVF9UWVBFUyA9IHtcclxuICAgICAgICBcIjUxMjBcIjogXCJCWVRFXCIsXHJcbiAgICAgICAgXCI1MTIxXCI6IFwiVU5TSUdORURfQllURVwiLFxyXG4gICAgICAgIFwiNTEyMlwiOiBcIlNIT1JUXCIsXHJcbiAgICAgICAgXCI1MTIzXCI6IFwiVU5TSUdORURfU0hPUlRcIixcclxuICAgICAgICBcIjUxMjZcIjogXCJGTE9BVFwiXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBQUklNSVRJVkVfTU9ERVMgPSB7XHJcbiAgICAgICAgXCIwXCI6IFwiUE9JTlRTXCIsXHJcbiAgICAgICAgXCIxXCI6IFwiTElORVNcIixcclxuICAgICAgICBcIjJcIjogXCJMSU5FX0xPT1BcIixcclxuICAgICAgICBcIjNcIjogXCJMSU5FX1NUUklQXCIsXHJcbiAgICAgICAgXCI0XCI6IFwiVFJJQU5HTEVTXCIsXHJcbiAgICAgICAgXCI1XCI6IFwiVFJJQU5HTEVfU1RSSVBcIixcclxuICAgICAgICBcIjZcIjogXCJUUklBTkdMRV9GQU5cIixcclxuICAgICAgICBcImRlZmF1bHRcIjogXCJUUklBTkdMRVNcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgQlVGRkVSVklFV19UQVJHRVRTID0ge1xyXG4gICAgICAgIFwiMzQ5NjJcIjogXCJBUlJBWV9CVUZGRVJcIixcclxuICAgICAgICBcIjM0OTYzXCI6IFwiRUxFTUVOVF9BUlJBWV9CVUZGRVJcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgQ09NUE9ORU5UX1RZUEVTX1RPX1RZUEVEX0FSUkFZUyA9IHtcclxuICAgICAgICBcIjUxMjBcIjogSW50OEFycmF5LFxyXG4gICAgICAgIFwiNTEyMVwiOiBVaW50OEFycmF5LFxyXG4gICAgICAgIFwiNTEyMlwiOiBJbnQxNkFycmF5LFxyXG4gICAgICAgIFwiNTEyM1wiOiBVaW50MTZBcnJheSxcclxuICAgICAgICBcIjUxMjZcIjogRmxvYXQzMkFycmF5XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBUWVBFU19UT19OVU1fQ09NUE9ORU5UUyA9IHtcclxuICAgICAgICBcIlNDQUxBUlwiOiAxLFxyXG4gICAgICAgIFwiVkVDMlwiOiAyLFxyXG4gICAgICAgIFwiVkVDM1wiOiAzLFxyXG4gICAgICAgIFwiVkVDNFwiOiA0LFxyXG4gICAgICAgIFwiTUFUMlwiOiA0LFxyXG4gICAgICAgIFwiTUFUM1wiOiA5LFxyXG4gICAgICAgIFwiTUFUNFwiOiAxNlxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBidWZmZXJBdHRyaWJ1dGVEYXRhKCB3ZWJnbEJ1ZmZlcnMsIGFjY2Vzc29yTmFtZSwganNvbiwgYnVmZmVycyApIHtcclxuXHJcbiAgICAgICAgaWYgKCAhYWNjZXNzb3JOYW1lICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBnbCA9IFdlYkdMQ29udGV4dC5nZXQoKSxcclxuICAgICAgICAgICAgYWNjZXNzb3IgPSBqc29uLmFjY2Vzc29yc1sgYWNjZXNzb3JOYW1lIF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlclZpZXdOYW1lID0gYWNjZXNzb3IuYnVmZmVyVmlldyxcclxuICAgICAgICAgICAgYnVmZmVyVmlldyA9IGpzb24uYnVmZmVyVmlld3NbIGJ1ZmZlclZpZXdOYW1lIF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlclRhcmdldCA9IEJVRkZFUlZJRVdfVEFSR0VUU1sgYnVmZmVyVmlldy50YXJnZXQgXSxcclxuICAgICAgICAgICAgYWNjZXNzb3JBcnJheUNvdW50ID0gYWNjZXNzb3IuY291bnQgKiBUWVBFU19UT19OVU1fQ09NUE9ORU5UU1sgYWNjZXNzb3IudHlwZSBdLFxyXG4gICAgICAgICAgICBUeXBlZEFycmF5ID0gQ09NUE9ORU5UX1RZUEVTX1RPX1RZUEVEX0FSUkFZU1sgYWNjZXNzb3IuY29tcG9uZW50VHlwZSBdO1xyXG5cclxuICAgICAgICBpZiAoICF3ZWJnbEJ1ZmZlcnNbIGJ1ZmZlclZpZXdOYW1lIF0gKSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgYnVmZmVyIGlmIGl0IGRvZXNudCBleGlzdFxyXG4gICAgICAgICAgICB3ZWJnbEJ1ZmZlcnNbIGJ1ZmZlclZpZXdOYW1lIF0gPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSB0eXBlIG9mIGJ1ZmZlciB0YXJnZXRcclxuICAgICAgICAgICAgYnVmZmVyVGFyZ2V0ID0gQlVGRkVSVklFV19UQVJHRVRTWyBidWZmZXJWaWV3LnRhcmdldCBdO1xyXG4gICAgICAgICAgICAvLyBiaW5kIGFuZCBzZXQgYnVmZmVycyBieXRlIGxlbmd0aFxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbFsgYnVmZmVyVGFyZ2V0IF0sIHdlYmdsQnVmZmVyc1sgYnVmZmVyVmlld05hbWUgXSApO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKCBnbFsgYnVmZmVyVGFyZ2V0IF0sIGJ1ZmZlclZpZXcuYnl0ZUxlbmd0aCwgZ2wuU1RBVElDX0RSQVcgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IGNhY2hlIGFjY2Vzc29ycyBzbyB0aGF0IHRoZWlyIGRhdGEgaXNuJ3QgYnVmZmVyZWQgbXVsdGlwbGUgdGltZXM/XHJcbiAgICAgICAgLy8gYnVmZmVyIHRoZSBhY2Nlc3NvcnMgc3ViIGRhdGFcclxuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKCBnbFsgYnVmZmVyVGFyZ2V0IF0sXHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlciB0aGUgZGF0YSBmcm9tIHRoZSBhY2Nlc3NvcnMgb2Zmc2V0IGludG8gdGhlIFdlYkdMQnVmZmVyXHJcbiAgICAgICAgICAgIGFjY2Vzc29yLmJ5dGVPZmZzZXQsXHJcbiAgICAgICAgICAgIG5ldyBUeXBlZEFycmF5KFxyXG4gICAgICAgICAgICAgICAgLy8gdXNlIHRoZSByZXNwZWN0aXZlIEFycmF5QnVmZmVyXHJcbiAgICAgICAgICAgICAgICBidWZmZXJzWyBidWZmZXJWaWV3LmJ1ZmZlciBdLFxyXG4gICAgICAgICAgICAgICAgLy8gY29tYmluZSB0aGUgYnVmZmVyVmlld3Mgb2Zmc2V0IGFuZCB0aGUgYWNjZXNzb3JzIG9mZnNldFxyXG4gICAgICAgICAgICAgICAgYnVmZmVyVmlldy5ieXRlT2Zmc2V0ICsgYWNjZXNzb3IuYnl0ZU9mZnNldCxcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgXCJ2aWV3XCIgdGhlIGFjY2Vzc29ycyBjb3VudCAoIHRha2luZyBpbnRvIGFjY291bnQgdGhlIG51bWJlciBvZiBjb21wb25lbnRzIHBlciB0eXBlIClcclxuICAgICAgICAgICAgICAgIGFjY2Vzc29yQXJyYXlDb3VudCApICk7XHJcbiAgICAgICAgLy8gcmV0dXJuIGF0dHJpYnV0ZVBvaW50ZXJcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBidWZmZXJWaWV3OiBidWZmZXJWaWV3TmFtZSxcclxuICAgICAgICAgICAgc2l6ZTogVFlQRVNfVE9fTlVNX0NPTVBPTkVOVFNbIGFjY2Vzc29yLnR5cGUgXSxcclxuICAgICAgICAgICAgdHlwZTogQUNDRVNTT1JfQ09NUE9ORU5UX1RZUEVTWyBhY2Nlc3Nvci5jb21wb25lbnRUeXBlIF0sXHJcbiAgICAgICAgICAgIHN0cmlkZTogYWNjZXNzb3IuYnl0ZVN0cmlkZSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBhY2Nlc3Nvci5ieXRlT2Zmc2V0LFxyXG4gICAgICAgICAgICBjb3VudDogYWNjZXNzb3IuY291bnRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldFBvaW50ZXJCeUJ1ZmZlclZpZXcoIHBvaW50ZXJzQnlCdWZmZXJWaWV3LCBpbmRleCwgYXR0cmlidXRlUG9pbnRlciApIHtcclxuICAgICAgICBpZiAoICFhdHRyaWJ1dGVQb2ludGVyICkge1xyXG4gICAgICAgICAgICAvLyBpZ25vcmUgaWYgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYWRkIHZlcnRleCBhdHRyaWJ1dGUgcG9pbnRlciB1bmRlciB0aGUgY29ycmVjdCB3ZWJnbGJ1ZmZlclxyXG4gICAgICAgIHBvaW50ZXJzQnlCdWZmZXJWaWV3WyBhdHRyaWJ1dGVQb2ludGVyLmJ1ZmZlclZpZXcgXSA9IHBvaW50ZXJzQnlCdWZmZXJWaWV3WyBhdHRyaWJ1dGVQb2ludGVyLmJ1ZmZlclZpZXcgXSB8fCB7fTtcclxuICAgICAgICBwb2ludGVyc0J5QnVmZmVyVmlld1sgYXR0cmlidXRlUG9pbnRlci5idWZmZXJWaWV3IF1bIGluZGV4IF0gPSBhdHRyaWJ1dGVQb2ludGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1lc2hGcm9tUHJpbWl0aXZlKCB3ZWJnbEJ1ZmZlcnMsIHByaW1pdGl2ZSwganNvbiwgYnVmZmVycywgbWF0ZXJpYWxzICkge1xyXG5cclxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHByaW1pdGl2ZS5hdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICBpbmRpY2VzID0gcHJpbWl0aXZlLmluZGljZXMsXHJcbiAgICAgICAgICAgIG1hdGVyaWFsID0gcHJpbWl0aXZlLm1hdGVyaWFsLFxyXG4gICAgICAgICAgICBwb2ludGVyc0J5QnVmZmVyVmlldyA9IHt9LFxyXG4gICAgICAgICAgICB2ZXJ0ZXhCdWZmZXJzID0gW10sXHJcbiAgICAgICAgICAgIGluZGV4QnVmZmVyLFxyXG4gICAgICAgICAgICBwb3NpdGlvbnNQb2ludGVyLFxyXG4gICAgICAgICAgICBub3JtYWxzUG9pbnRlcixcclxuICAgICAgICAgICAgdXZzUG9pbnRlcixcclxuICAgICAgICAgICAgY29sb3JzUG9pbnRlcixcclxuICAgICAgICAgICAgam9pbnRzUG9pbnRlcixcclxuICAgICAgICAgICAgd2VpZ2h0c1BvaW50ZXIsXHJcbiAgICAgICAgICAgIGluZGljZXNQb2ludGVyLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVQb2ludGVycyxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIC8vIGJ1ZmZlciBhdHRyaWJ1dGUgZGF0YSBhbmQgc3RvcmUgcmVzdWx0aW5nIGF0dHJpYnV0ZSBwb2ludGVyc1xyXG4gICAgICAgIHBvc2l0aW9uc1BvaW50ZXIgPSBidWZmZXJBdHRyaWJ1dGVEYXRhKCB3ZWJnbEJ1ZmZlcnMsIGF0dHJpYnV0ZXMuUE9TSVRJT04gfHwgYXR0cmlidXRlcy5QT1NJVElPTl8wLCBqc29uLCBidWZmZXJzICk7XHJcbiAgICAgICAgbm9ybWFsc1BvaW50ZXIgPSBidWZmZXJBdHRyaWJ1dGVEYXRhKCB3ZWJnbEJ1ZmZlcnMsIGF0dHJpYnV0ZXMuTk9STUFMIHx8IGF0dHJpYnV0ZXMuTk9STUFMXzAsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICB1dnNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLlRFWENPT1JEIHx8IGF0dHJpYnV0ZXMuVEVYQ09PUkRfMCwganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIGpvaW50c1BvaW50ZXIgPSBidWZmZXJBdHRyaWJ1dGVEYXRhKCB3ZWJnbEJ1ZmZlcnMsIGF0dHJpYnV0ZXMuSk9JTlQgfHwgYXR0cmlidXRlcy5KT0lOVF8wLCBqc29uLCBidWZmZXJzICk7XHJcbiAgICAgICAgd2VpZ2h0c1BvaW50ZXIgPSBidWZmZXJBdHRyaWJ1dGVEYXRhKCB3ZWJnbEJ1ZmZlcnMsIGF0dHJpYnV0ZXMuV0VJR0hUIHx8IGF0dHJpYnV0ZXMuV0VJR0hUXzAsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICBjb2xvcnNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLkNPTE9SIHx8IGF0dHJpYnV0ZXMuQ09MT1JfMCwganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBtYXAgb2YgcG9pbnRlcnMga2V5ZWQgYnkgYnVmZmVydmlld1xyXG4gICAgICAgIHNldFBvaW50ZXJCeUJ1ZmZlclZpZXcoIHBvaW50ZXJzQnlCdWZmZXJWaWV3LCBcIjBcIiwgcG9zaXRpb25zUG9pbnRlciApO1xyXG4gICAgICAgIHNldFBvaW50ZXJCeUJ1ZmZlclZpZXcoIHBvaW50ZXJzQnlCdWZmZXJWaWV3LCBcIjFcIiwgbm9ybWFsc1BvaW50ZXIgKTtcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIyXCIsIHV2c1BvaW50ZXIgKTtcclxuICAgICAgICAvL3NldFBvaW50ZXJCeUJ1ZmZlclZpZXcoIHBvaW50ZXJzQnlCdWZmZXJWaWV3LCBcIjNcIiwgY29sb3JzUG9pbnRlciApO1xyXG4gICAgICAgIHNldFBvaW50ZXJCeUJ1ZmZlclZpZXcoIHBvaW50ZXJzQnlCdWZmZXJWaWV3LCBcIjNcIiwgam9pbnRzUG9pbnRlciApO1xyXG4gICAgICAgIHNldFBvaW50ZXJCeUJ1ZmZlclZpZXcoIHBvaW50ZXJzQnlCdWZmZXJWaWV3LCBcIjRcIiwgd2VpZ2h0c1BvaW50ZXIgKTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBidWZmZXJ2aWV3IGNyZWF0ZSBhIFZlcnRleEJ1ZmZlciBvYmplY3QsIGFuZFxyXG4gICAgICAgIC8vIHBhc3MgdGhlIHBvaW50ZXJzIGZvciB0aGUgYXR0cmlidXRlcyB0aGF0IHVzZSBpdFxyXG4gICAgICAgIGZvciAoIGtleSBpbiBwb2ludGVyc0J5QnVmZmVyVmlldyApIHtcclxuICAgICAgICAgICAgaWYgKCBwb2ludGVyc0J5QnVmZmVyVmlldy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVQb2ludGVycyA9IHBvaW50ZXJzQnlCdWZmZXJWaWV3WyBrZXkgXTtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBWZXJ0ZXhCdWZmZXIgdGhhdCByZWZlcmVuY2VzIHRoZSBXZWJHTEJ1ZmZlciBmb3IgdGhlIGJ1ZmZlcnZpZXdcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlcnMucHVzaCggbmV3IFZlcnRleEJ1ZmZlciggd2ViZ2xCdWZmZXJzWyBrZXkgXSwgYXR0cmlidXRlUG9pbnRlcnMgKSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBzaW1pbGFyIHBvaW50ZXIgZm9yIGluZGljZXNcclxuICAgICAgICBpbmRpY2VzUG9pbnRlciA9IGJ1ZmZlckF0dHJpYnV0ZURhdGEoIHdlYmdsQnVmZmVycywgaW5kaWNlcywganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIC8vIHNldCBwcmltaWl2ZSBtb2RlXHJcbiAgICAgICAgaW5kaWNlc1BvaW50ZXIubW9kZSA9IFBSSU1JVElWRV9NT0RFU1sgcHJpbWl0aXZlLnByaW1pdGl2ZSBdIHx8IFBSSU1JVElWRV9NT0RFUy5kZWZhdWx0O1xyXG4gICAgICAgIC8vIGNyZWF0ZSBJbmRleEJ1ZmZlciB0aGF0IHJlZmVyZW5jZXMgdGhlIFdlYkdMQnVmZmVyIGZvciB0aGUgYnVmZmVydmlld1xyXG4gICAgICAgIGluZGV4QnVmZmVyID0gbmV3IEluZGV4QnVmZmVyKFxyXG4gICAgICAgICAgICB3ZWJnbEJ1ZmZlcnNbIGluZGljZXNQb2ludGVyLmJ1ZmZlclZpZXcgXSxcclxuICAgICAgICAgICAgaW5kaWNlc1BvaW50ZXIgKTtcclxuICAgICAgICAvLyBpbnN0YW50aWF0ZSB0aGUgTWVzaCBvYmplY3RcclxuICAgICAgICByZXR1cm4gbmV3IE1lc2goe1xyXG4gICAgICAgICAgICB2ZXJ0ZXhCdWZmZXJzOiB2ZXJ0ZXhCdWZmZXJzLFxyXG4gICAgICAgICAgICBpbmRleEJ1ZmZlcjogaW5kZXhCdWZmZXIsXHJcbiAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbHNbIG1hdGVyaWFsIF1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVNZXNoZXMoIHdlYmdsQnVmZmVycywgbWVzaCwganNvbiwgYnVmZmVycywgbWF0ZXJpYWxzICkge1xyXG4gICAgICAgIHZhciBwcmltaXRpdmVzID0gbWVzaC5wcmltaXRpdmVzLFxyXG4gICAgICAgICAgICBtZXNoZXMgPSBbXSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBwcmltaXRpdmVcclxuICAgICAgICBmb3IgKCBpPTA7IGk8cHJpbWl0aXZlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgbmV3IG1lc2ggZm9yIHRoZSBwcmltaXRpdmUgc2V0XHJcbiAgICAgICAgICAgIG1lc2hlcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgY3JlYXRlTWVzaEZyb21QcmltaXRpdmUoXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViZ2xCdWZmZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW1pdGl2ZXNbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAganNvbixcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsc1xyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWVzaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBjcmVhdGVNZXNoZXM6IGZ1bmN0aW9uKCBqc29uLCBidWZmZXJzLCBtYXRlcmlhbHMgKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNoZXMgPSBqc29uLm1lc2hlcyxcclxuICAgICAgICAgICAgICAgIHdlYmdsQnVmZmVycyA9IHt9LFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IHt9LFxyXG4gICAgICAgICAgICAgICAga2V5O1xyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCBtZXNoXHJcbiAgICAgICAgICAgIGZvciAoIGtleSBpbiBqc29uLm1lc2hlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICgganNvbi5tZXNoZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgYXJyYXkgb2YgbWVzaGVzIGZvciB0aGUgbWVzaFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbIGtleSBdID0gY3JlYXRlTWVzaGVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJnbEJ1ZmZlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc2hlc1sga2V5IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFscyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzIEZhYnJpY2UgUm9iaW5ldFxyXG4vLyBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vL1xyXG4vLyBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuLy8gbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbi8vXHJcbi8vICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuLy8gICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcclxuLy8gICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxyXG4vLyAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4vL1xyXG4vLyAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcclxuLy8gQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxyXG4vLyBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxyXG4vLyBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgPENPUFlSSUdIVCBIT0xERVI+IEJFIExJQUJMRSBGT1IgQU5ZXHJcbi8vIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXHJcbi8vIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcclxuLy8gTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EXHJcbi8vIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXHJcbi8vIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRlxyXG4vLyBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG5cclxuLypcclxuICAgIFRoZSBBYnN0cmFjdCBMb2FkZXIgaGFzIHR3byBtb2RlczpcclxuICAgICAgICAjMTogW3N0YXRpY10gbG9hZCBhbGwgdGhlIEpTT04gYXQgb25jZSBbYXMgb2Ygbm93XVxyXG4gICAgICAgICMyOiBbc3RyZWFtXSBzdHJlYW0gYW5kIHBhcnNlIEpTT04gcHJvZ3Jlc3NpdmVseSBbbm90IHlldCBzdXBwb3J0ZWRdXHJcblxyXG4gICAgV2hhdGV2ZXIgaXMgdGhlIG1lY2hhbmlzbSB1c2VkIHRvIHBhcnNlIHRoZSBKU09OICgjMSBvciAjMiksXHJcbiAgICBUaGUgbG9hZGVyIHN0YXJ0cyBieSByZXNvbHZpbmcgdGhlIHBhdGhzIHRvIGJpbmFyaWVzIGFuZCByZWZlcmVuY2VkIGpzb24gZmlsZXMgKGJ5IHJlcGxhY2UgdGhlIHZhbHVlIG9mIHRoZSBwYXRoIHByb3BlcnR5IHdpdGggYW4gYWJzb2x1dGUgcGF0aCBpZiBpdCB3YXMgcmVsYXRpdmUpLlxyXG5cclxuICAgIEluIGNhc2UgIzE6IGl0IGlzIGd1YXJhbnRlZWQgdG8gY2FsbCB0aGUgY29uY3JldGUgbG9hZGVyIGltcGxlbWVudGF0aW9uIG1ldGhvZHMgaW4gYSBvcmRlciB0aGF0IHNvbHZlcyB0aGUgZGVwZW5kZW5jaWVzIGJldHdlZW4gdGhlIGVudHJpZXMuXHJcbiAgICBvbmx5IHRoZSBub2RlcyByZXF1aXJlcyBhbiBleHRyYSBwYXNzIHRvIHNldCB1cCB0aGUgaGlyZXJhcmNoeS5cclxuICAgIEluIGNhc2UgIzI6IHRoZSBjb25jcmV0ZSBpbXBsZW1lbnRhdGlvbiB3aWxsIGhhdmUgdG8gc29sdmUgdGhlIGRlcGVuZGVuY2llcy4gbm8gb3JkZXIgaXMgZ3VhcmFudGVlZC5cclxuXHJcbiAgICBXaGVuIGNhc2UgIzEgaXMgdXNlZCB0aGUgZm9sbG93ZWQgZGVwZW5kZW5jeSBvcmRlciBpczpcclxuXHJcbiAgICBzY2VuZXMgLT4gbm9kZXMgLT4gbWVzaGVzIC0+IG1hdGVyaWFscyAtPiB0ZWNobmlxdWVzIC0+IHNoYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICAtPiBidWZmZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgLT4gY2FtZXJhc1xyXG4gICAgICAgICAgICAgICAgICAgIC0+IGxpZ2h0c1xyXG5cclxuICAgIFRoZSByZWFkZXJzIHN0YXJ0cyB3aXRoIHRoZSBsZWFmcywgaS5lOlxyXG4gICAgICAgIHNoYWRlcnMsIHRlY2huaXF1ZXMsIG1hdGVyaWFscywgbWVzaGVzLCBidWZmZXJzLCBjYW1lcmFzLCBsaWdodHMsIG5vZGVzLCBzY2VuZXNcclxuXHJcbiAgICBGb3IgZWFjaCBjYWxsZWQgaGFuZGxlIG1ldGhvZCBjYWxsZWQgdGhlIGNsaWVudCBzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhlIG5leHQgaGFuZGxlIGNhbiBiZSBjYWxsIHJpZ2h0IGFmdGVyIHJldHVybmluZyxcclxuICAgIG9yIGZhbHNlIGlmIGEgY2FsbGJhY2sgb24gY2xpZW50IHNpZGUgd2lsbCBub3RpZnkgdGhlIGxvYWRlciB0aGF0IHRoZSBuZXh0IGhhbmRsZSBtZXRob2QgY2FuIGJlIGNhbGxlZC5cclxuXHJcbiovXHJcbihmdW5jdGlvbigpIHtcclxuICAgIFxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGNhdGVnb3JpZXNEZXBzT3JkZXIgPSBbXCJidWZmZXJzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJidWZmZXJWaWV3c1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW1hZ2VzXCIsICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmlkZW9zXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzYW1wbGVyc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dHVyZXNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNoYWRlcnNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb2dyYW1zXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZWNobmlxdWVzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtYXRlcmlhbHNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFjY2Vzc29yc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWVzaGVzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjYW1lcmFzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsaWdodHNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNraW5zXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJub2Rlc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2NlbmVzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbmltYXRpb25zXCJdO1xyXG5cclxuICAgIHZhciBnbFRGUGFyc2VyID0gT2JqZWN0LmNyZWF0ZShPYmplY3QucHJvdG90eXBlLCB7XHJcblxyXG4gICAgICAgIF9yb290RGVzY3JpcHRpb246IHsgdmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlIH0sXHJcblxyXG4gICAgICAgIHJvb3REZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290RGVzY3JpcHRpb24gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290RGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBiYXNlVVJMOiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxyXG5cclxuICAgICAgICAvL2RldGVjdCBhYnNvbHV0ZSBwYXRoIGZvbGxvd2luZyB0aGUgc2FtZSBwcm90b2NvbCB0aGFuIHdpbmRvdy5sb2NhdGlvblxyXG4gICAgICAgIF9pc0Fic29sdXRlUGF0aDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzQWJzb2x1dGVQYXRoUmVnRXhwID0gbmV3IFJlZ0V4cChcIl5cIit3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wsIFwiaVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aC5tYXRjaChpc0Fic29sdXRlUGF0aFJlZ0V4cCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZXNvbHZlUGF0aElmTmVlZGVkOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNBYnNvbHV0ZVBhdGgocGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iYXNlVVJMICsgcGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9yZXNvbHZlUGF0aHNGb3JDYXRlZ29yaWVzOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihjYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2goIGZ1bmN0aW9uKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9ucyA9IHRoaXMuanNvbltjYXRlZ29yeV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb25LZXlzID0gT2JqZWN0LmtleXMoZGVzY3JpcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25LZXlzLmZvckVhY2goIGZ1bmN0aW9uKGRlc2NyaXB0aW9uS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbnNbZGVzY3JpcHRpb25LZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24ucGF0aCA9IHRoaXMucmVzb2x2ZVBhdGhJZk5lZWRlZChkZXNjcmlwdGlvbi5wYXRoIHx8IGRlc2NyaXB0aW9uLnVyaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2pzb246IHtcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAganNvbjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2pzb247XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qc29uICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pzb24gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlUGF0aHNGb3JDYXRlZ29yaWVzKFtcImJ1ZmZlcnNcIiwgXCJzaGFkZXJzXCIsIFwiaW1hZ2VzXCIsIFwidmlkZW9zXCJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9wYXRoOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEVudHJ5RGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChlbnRyeUlELCBlbnRyeVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbnRyaWVzID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSBlbnRyeVR5cGU7XHJcbiAgICAgICAgICAgICAgICBlbnRyaWVzID0gdGhpcy5yb290RGVzY3JpcHRpb25bY2F0ZWdvcnldO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFlbnRyaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjpDQU5OT1QgZmluZCBleHBlY3RlZCBjYXRlZ29yeSBuYW1lZDpcIitjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJpZXMgPyBlbnRyaWVzW2VudHJ5SURdIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9zdGVwVG9OZXh0Q2F0ZWdvcnk6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUuY2F0ZWdvcnlJbmRleCA9IHRoaXMuZ2V0TmV4dENhdGVnb3J5SW5kZXgodGhpcy5fc3RhdGUuY2F0ZWdvcnlJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlLmNhdGVnb3J5SW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUuY2F0ZWdvcnlTdGF0ZS5pbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX3N0ZXBUb05leHREZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5U3RhdGUgPSB0aGlzLl9zdGF0ZS5jYXRlZ29yeVN0YXRlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBjYXRlZ29yeVN0YXRlLmtleXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWtleXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOQ09OU0lTVEVOQ1kgRVJST1JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5U3RhdGUuaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5U3RhdGUua2V5cyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlTdGF0ZS5pbmRleCA+PSBrZXlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGVwVG9OZXh0Q2F0ZWdvcnkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGhhc0NhdGVnb3J5OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdERlc2NyaXB0aW9uW2NhdGVnb3J5XSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9oYW5kbGVTdGF0ZToge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1ldGhvZEZvclR5cGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJidWZmZXJzXCIgOiB0aGlzLmhhbmRsZUJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICBcImJ1ZmZlclZpZXdzXCIgOiB0aGlzLmhhbmRsZUJ1ZmZlclZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaGFkZXJzXCIgOiB0aGlzLmhhbmRsZVNoYWRlcixcclxuICAgICAgICAgICAgICAgICAgICBcInByb2dyYW1zXCIgOiB0aGlzLmhhbmRsZVByb2dyYW0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZWNobmlxdWVzXCIgOiB0aGlzLmhhbmRsZVRlY2huaXF1ZSxcclxuICAgICAgICAgICAgICAgICAgICBcIm1hdGVyaWFsc1wiIDogdGhpcy5oYW5kbGVNYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgICAgICBcIm1lc2hlc1wiIDogdGhpcy5oYW5kbGVNZXNoLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2FtZXJhc1wiIDogdGhpcy5oYW5kbGVDYW1lcmEsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodHNcIiA6IHRoaXMuaGFuZGxlTGlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2Rlc1wiIDogdGhpcy5oYW5kbGVOb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2NlbmVzXCIgOiB0aGlzLmhhbmRsZVNjZW5lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2VzXCIgOiB0aGlzLmhhbmRsZUltYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYW5pbWF0aW9uc1wiIDogdGhpcy5oYW5kbGVBbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NvcnNcIiA6IHRoaXMuaGFuZGxlQWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJza2luc1wiIDogdGhpcy5oYW5kbGVTa2luLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2FtcGxlcnNcIiA6IHRoaXMuaGFuZGxlU2FtcGxlcixcclxuICAgICAgICAgICAgICAgICAgICBcInRleHR1cmVzXCIgOiB0aGlzLmhhbmRsZVRleHR1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ2aWRlb3NcIiA6IHRoaXMuaGFuZGxlVmlkZW9cclxuXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLl9zdGF0ZS5jYXRlZ29yeUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeSA9IGNhdGVnb3JpZXNEZXBzT3JkZXJbdGhpcy5fc3RhdGUuY2F0ZWdvcnlJbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5U3RhdGUgPSB0aGlzLl9zdGF0ZS5jYXRlZ29yeVN0YXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlzID0gY2F0ZWdvcnlTdGF0ZS5rZXlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgha2V5cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVN0YXRlLmtleXMgPSBrZXlzID0gT2JqZWN0LmtleXModGhpcy5yb290RGVzY3JpcHRpb25bY2F0ZWdvcnldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0ZXBUb05leHREZXNjcmlwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGNhdGVnb3J5O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbnRyeUlEID0ga2V5c1tjYXRlZ29yeVN0YXRlLmluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmdldEVudHJ5RGVzY3JpcHRpb24oZW50cnlJRCwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZXNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYW5kbGVFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcihcIklOQ09OU0lTVEVOQ1kgRVJST1I6IG5vIGRlc2NyaXB0aW9uIGZvdW5kIGZvciBlbnRyeSBcIitlbnRyeUlEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXRob2RGb3JUeXBlW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kRm9yVHlwZVt0eXBlXS5jYWxsKHRoaXMsIGVudHJ5SUQsIGRlc2NyaXB0aW9uLCB0aGlzLl9zdGF0ZS51c2VySW5mbykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGVwVG9OZXh0RGVzY3JpcHRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlTG9hZENvbXBsZXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTG9hZENvbXBsZXRlZChzdWNjZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfbG9hZEpTT05JZk5lZWRlZDoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIC8vRklYTUU6IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9qc29uKSAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uUGF0aCA9IHRoaXMuX3BhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBqc29uUGF0aC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXNlVVJMID0gKGkgIT09IDApID8ganNvblBhdGguc3Vic3RyaW5nKDAsIGkgKyAxKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uZmlsZSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb25maWxlLm9wZW4oXCJHRVRcIiwganNvblBhdGgsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb25maWxlLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5qc29uID0gSlNPTi5wYXJzZShqc29uZmlsZS5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soc2VsZi5qc29uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS5zZW5kKG51bGwpO1xyXG4gICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLmpzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qIGxvYWQgSlNPTiBhbmQgYXNzaWduIGl0IGFzIGRlc2NyaXB0aW9uIHRvIHRoZSByZWFkZXIgKi9cclxuICAgICAgICBfYnVpbGRMb2FkZXI6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBKU09OUmVhZHkoanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucm9vdERlc2NyaXB0aW9uID0ganNvbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZEpTT05JZk5lZWRlZChKU09OUmVhZHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX3N0YXRlOiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxyXG5cclxuICAgICAgICBfZ2V0RW50cnlUeXBlOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciByb290S2V5cyA9IGNhdGVnb3JpZXNEZXBzT3JkZXI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCA7ICBpIDwgcm9vdEtleXMubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvb3RWYWx1ZXMgPSB0aGlzLnJvb3REZXNjcmlwdGlvbltyb290S2V5c1tpXV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvb3RWYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RLZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0TmV4dENhdGVnb3J5SW5kZXg6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGN1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGN1cnJlbnRJbmRleCA7IGkgPCBjYXRlZ29yaWVzRGVwc09yZGVyLmxlbmd0aCA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc0NhdGVnb3J5KGNhdGVnb3JpZXNEZXBzT3JkZXJbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBsb2FkOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbih1c2VySW5mbywgb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYnVpbGRMb2FkZXIoZnVuY3Rpb24gbG9hZGVyUmVhZHkoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0Q2F0ZWdvcnkgPSBzZWxmLmdldE5leHRDYXRlZ29yeUluZGV4LmNhbGwoc2VsZiwwKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRDYXRlZ29yeSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fc3RhdGUgPSB7IFwidXNlckluZm9cIiA6IHVzZXJJbmZvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvcHRpb25zXCIgOiBvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjYXRlZ29yeUluZGV4XCIgOiBzdGFydENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjYXRlZ29yeVN0YXRlXCIgOiB7IFwiaW5kZXhcIiA6IFwiMFwiIH0gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5faGFuZGxlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRXaXRoUGF0aDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9qc29uID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy90aGlzIGlzIG1lYW50IHRvIGJlIGdsb2JhbCBhbmQgY29tbW9uIGZvciBhbGwgaW5zdGFuY2VzXHJcbiAgICAgICAgX2tub3duVVJMczogeyB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IHt9IH0sXHJcblxyXG4gICAgICAgIC8vdG8gYmUgaW52b2tlZCBieSBzdWJjbGFzcywgc28gdGhhdCBpZHMgY2FuIGJlIGVuc3VyZWQgdG8gbm90IG92ZXJsYXBcclxuICAgICAgICBsb2FkZXJDb250ZXh0OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5fa25vd25VUkxzW3RoaXMuX3BhdGhdID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa25vd25VUkxzW3RoaXMuX3BhdGhdID0gT2JqZWN0LmtleXModGhpcy5fa25vd25VUkxzKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJfX1wiICsgdGhpcy5fa25vd25VUkxzW3RoaXMuX3BhdGhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdFdpdGhKU09OOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihqc29uLCBiYXNlVVJMKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb24gPSBqc29uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iYXNlVVJMID0gYmFzZVVSTDtcclxuICAgICAgICAgICAgICAgIGlmICghYmFzZVVSTCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORzogbm8gYmFzZSBVUkwgcGFzc2VkIHRvIFJlYWRlcjppbml0V2l0aEpTT05cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsVEZQYXJzZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhbGZhZG9yID0gcmVxdWlyZSgnYWxmYWRvcicpLFxyXG4gICAgICAgIE1hdDMzID0gYWxmYWRvci5NYXQzMyxcclxuICAgICAgICBNYXQ0NCA9IGFsZmFkb3IuTWF0NDQsXHJcbiAgICAgICAgZ2xURlV0aWwgPSByZXF1aXJlKCcuL2dsVEZVdGlsJyksXHJcbiAgICAgICAgSm9pbnQgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvSm9pbnQnKSxcclxuICAgICAgICBTa2VsZXRvbiA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlci9Ta2VsZXRvbicpO1xyXG5cclxuICAgIHZhciBDT01QT05FTlRfVFlQRVNfVE9fQlVGRkVSVklFV1MgPSB7XHJcbiAgICAgICAgXCI1MTIwXCI6IEludDhBcnJheSxcclxuICAgICAgICBcIjUxMjFcIjogVWludDhBcnJheSxcclxuICAgICAgICBcIjUxMjJcIjogSW50MTZBcnJheSxcclxuICAgICAgICBcIjUxMjNcIjogVWludDE2QXJyYXksXHJcbiAgICAgICAgXCI1MTI2XCI6IEZsb2F0MzJBcnJheVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVFlQRVNfVE9fTlVNX0NPTVBPTkVOVFMgPSB7XHJcbiAgICAgICAgXCJTQ0FMQVJcIjogMSxcclxuICAgICAgICBcIlZFQzJcIjogMixcclxuICAgICAgICBcIlZFQzNcIjogMyxcclxuICAgICAgICBcIlZFQzRcIjogNCxcclxuICAgICAgICBcIk1BVDJcIjogNCxcclxuICAgICAgICBcIk1BVDNcIjogOSxcclxuICAgICAgICBcIk1BVDRcIjogMTZcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRZUEVTX1RPX0NMQVNTID0ge1xyXG4gICAgICAgIFwiTUFUM1wiOiBNYXQzMyxcclxuICAgICAgICBcIk1BVDRcIjogTWF0NDRcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0SW52ZXJzZUJpbmRNYXRyaWNlcygganNvbiwgc2tpbiwgYnVmZmVycyApIHtcclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSBqc29uLmFjY2Vzc29yc1sgc2tpbi5pbnZlcnNlQmluZE1hdHJpY2VzIF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlclZpZXcgPSBqc29uLmJ1ZmZlclZpZXdzWyBhY2Nlc3Nvci5idWZmZXJWaWV3IF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlcnNbIGJ1ZmZlclZpZXcuYnVmZmVyIF0sXHJcbiAgICAgICAgICAgIFR5cGVkQXJyYXkgPSBDT01QT05FTlRfVFlQRVNfVE9fQlVGRkVSVklFV1NbIGFjY2Vzc29yLmNvbXBvbmVudFR5cGUgXSxcclxuICAgICAgICAgICAgbnVtQ29tcG9uZW50cyA9IFRZUEVTX1RPX05VTV9DT01QT05FTlRTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIE1hdHJpeENsYXNzID0gVFlQRVNfVE9fQ0xBU1NbIGFjY2Vzc29yLnR5cGUgXSxcclxuICAgICAgICAgICAgYWNjZXNzb3JBcnJheUNvdW50ID0gYWNjZXNzb3IuY291bnQgKiBudW1Db21wb25lbnRzLFxyXG4gICAgICAgICAgICBhcnJheUJ1ZmZlciA9IG5ldyBUeXBlZEFycmF5KCBidWZmZXIsIGJ1ZmZlclZpZXcuYnl0ZU9mZnNldCArIGFjY2Vzc29yLmJ5dGVPZmZzZXQsIGFjY2Vzc29yQXJyYXlDb3VudCApLFxyXG4gICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzID0gW10sXHJcbiAgICAgICAgICAgIGJlZ2luSW5kZXgsXHJcbiAgICAgICAgICAgIGVuZEluZGV4LFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGZvciBlYWNoIG1hdHJpeCBpbiB0aGUgYWNjZXNzb3JcclxuICAgICAgICBmb3IgKCBpPTA7IGk8YWNjZXNzb3IuY291bnQ7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gY2FsYyB0aGUgYmVnaW4gYW5kIGVuZCBpbiBhcnJheWJ1ZmZlclxyXG4gICAgICAgICAgICBiZWdpbkluZGV4ID0gaSAqIG51bUNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIGVuZEluZGV4ID0gYmVnaW5JbmRleCArIG51bUNvbXBvbmVudHM7XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgc3ViYXJyYXkgdGhhdCBjb21wb3NlcyB0aGUgbWF0cml4XHJcbiAgICAgICAgICAgIGludmVyc2VCaW5kTWF0cmljZXMucHVzaChcclxuICAgICAgICAgICAgICAgIG5ldyBNYXRyaXhDbGFzcyggYXJyYXlCdWZmZXIuc3ViYXJyYXkoIGJlZ2luSW5kZXgsIGVuZEluZGV4ICkgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW52ZXJzZUJpbmRNYXRyaWNlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVKb2ludEhpZXJhcmNoeSgganNvbiwgbm9kZU5hbWUsIHBhcmVudCwgc2tpbiwgaW52ZXJzZUJpbmRNYXRyaWNlcyApIHtcclxuICAgICAgICB2YXIgbm9kZSA9IGpzb24ubm9kZXNbIG5vZGVOYW1lIF0sXHJcbiAgICAgICAgICAgIGpvaW50SW5kZXggPSBza2luLmpvaW50TmFtZXMuaW5kZXhPZiggbm9kZS5qb2ludE5hbWUgKSxcclxuICAgICAgICAgICAgYmluZE1hdHJpeCxcclxuICAgICAgICAgICAgaW52ZXJzZUJpbmRNYXRyaXgsXHJcbiAgICAgICAgICAgIGNoaWxkLFxyXG4gICAgICAgICAgICBqb2ludCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBpZiBqb2ludCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc2tpbnMgam9pbnROYW1lcywgaWdub3JlXHJcbiAgICAgICAgaWYgKCBqb2ludEluZGV4ID09PSAtMSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGdldCB0aGUgYmluZCAvIGludmVyc2UgYmluZCBtYXRyaWNlc1xyXG4gICAgICAgIGJpbmRNYXRyaXggPSBnbFRGVXRpbC5nZXROb2RlTWF0cml4KCBub2RlICk7XHJcbiAgICAgICAgaW52ZXJzZUJpbmRNYXRyaXggPSBpbnZlcnNlQmluZE1hdHJpY2VzWyBqb2ludEluZGV4IF07XHJcbiAgICAgICAgLy8gY3JlYXRlIGpvaW50IGhlcmUgZmlyc3QsIGluIG9yZGVyIHRvIHBhc3MgYXMgcGFyZW50IHRvIHJlY3Vyc2lvbnNcclxuICAgICAgICBqb2ludCA9IG5ldyBKb2ludCh7XHJcbiAgICAgICAgICAgIGlkOiBub2RlTmFtZSxcclxuICAgICAgICAgICAgbmFtZTogbm9kZS5qb2ludE5hbWUsXHJcbiAgICAgICAgICAgIGJpbmRNYXRyaXg6IGJpbmRNYXRyaXgsXHJcbiAgICAgICAgICAgIGludmVyc2VCaW5kTWF0cml4OiBpbnZlcnNlQmluZE1hdHJpeCxcclxuICAgICAgICAgICAgcGFyZW50OiBwYXJlbnQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXSwgLy8gYXJyYXkgd2lsbCBiZSBlbXB0eSBoZXJlLCBidXQgcG9wdWxhdGVkIHN1YnNlcXVlbnRseVxyXG4gICAgICAgICAgICBpbmRleDogam9pbnRJbmRleFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGZpbGwgaW4gY2hpbGRyZW4gYXJyYXlcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgY2hpbGQgPSBjcmVhdGVKb2ludEhpZXJhcmNoeSgganNvbiwgbm9kZS5jaGlsZHJlbltpXSwgam9pbnQsIHNraW4sIGludmVyc2VCaW5kTWF0cmljZXMgKTtcclxuICAgICAgICAgICAgaWYgKCBjaGlsZCApIHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgYWRkIGlmIGpvaW50IGV4aXN0cyBpbiBqb2ludE5hbWVzXHJcbiAgICAgICAgICAgICAgICBqb2ludC5jaGlsZHJlbi5wdXNoKCBjaGlsZCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBqb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGVhY2ggc2tlbGV0b24gcm9vdCBub2RlIGluIGFuIGluc3RhbmNlU2tpbiwgYnVpbGQgdGhlIGpvaW50XHJcbiAgICAgICAgICogaGllcmFyY2hpZXMgYW5kIHJldHVybiBhIHNpbmdsZSBTa2VsZXRvbiBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0ganNvbiAtIFRoZSBnbFRGIEpTT04uXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlU2tpbiAtIFRoZSBpbnN0YW5jZVNraW4gb2JqZWN0IGZvciB0aGUgbm9kZS5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYnVmZmVycyAtIFRoZSBtYXAgb2YgbG9hZGVkIGJ1ZmZlcnMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7U2tlbGV0b259IFRoZSBTa2VsZXRvbiBvYmplY3QuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY3JlYXRlU2tlbGV0b246IGZ1bmN0aW9uKCBqc29uLCBpbnN0YW5jZVNraW4sIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgICAgIC8vIGZpcnN0IGZpbmQgbm9kZXMgd2l0aCB0aGUgbmFtZXMgaW4gdGhlIGluc3RhbmNlU2tpbi5za2VsZXRvbnNcclxuICAgICAgICAgICAgLy8gdGhlbiBzZWFyY2ggb25seSB0aG9zZSBub2RlcyBhbmQgdGhlaXIgc3ViIHRyZWVzIGZvciBub2RlcyB3aXRoXHJcbiAgICAgICAgICAgIC8vIGpvaW50SWQgZXF1YWwgdG8gdGhlIHN0cmluZ3MgaW4gc2tpbi5qb2ludHNcclxuICAgICAgICAgICAgdmFyIHNrZWxldG9ucyA9IGluc3RhbmNlU2tpbi5za2VsZXRvbnMsXHJcbiAgICAgICAgICAgICAgICBza2luID0ganNvbi5za2luc1sgaW5zdGFuY2VTa2luLnNraW4gXSxcclxuICAgICAgICAgICAgICAgIGludmVyc2VCaW5kTWF0cmljZXMgPSBnZXRJbnZlcnNlQmluZE1hdHJpY2VzKCBqc29uLCBza2luLCBidWZmZXJzICksXHJcbiAgICAgICAgICAgICAgICByb290Tm9kZXMgPSBbXSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHJvb3Qgbm9kZSwgY3JlYXRlIGhpZXJhcmNoeSBvZiBKb2ludCBvYmplY3RzXHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxza2VsZXRvbnMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICByb290Tm9kZXMucHVzaCggY3JlYXRlSm9pbnRIaWVyYXJjaHkoIGpzb24sIHNrZWxldG9uc1tpXSwgbnVsbCwgc2tpbiwgaW52ZXJzZUJpbmRNYXRyaWNlcyApICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmV0dXJuIFNrZWxldG9uIG9iamVjdFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFNrZWxldG9uKHtcclxuICAgICAgICAgICAgICAgIHJvb3Q6IHJvb3ROb2RlcyxcclxuICAgICAgICAgICAgICAgIGJpbmRTaGFwZU1hdHJpeDogbmV3IE1hdDQ0KCBza2luLmJpbmRTaGFwZU1hdHJpeCB8fCBbXSApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgYWxmYWRvciA9IHJlcXVpcmUoJ2FsZmFkb3InKSxcclxuICAgICAgICBRdWF0ZXJuaW9uID0gYWxmYWRvci5RdWF0ZXJuaW9uLFxyXG4gICAgICAgIE1hdDQ0ID0gYWxmYWRvci5NYXQ0NCxcclxuICAgICAgICBWZWMyID0gYWxmYWRvci5WZWMyLFxyXG4gICAgICAgIFZlYzMgPSBhbGZhZG9yLlZlYzMsXHJcbiAgICAgICAgVmVjNCA9IGFsZmFkb3IuVmVjNCxcclxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vVXRpbCcpLFxyXG4gICAgICAgIFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL1hIUkxvYWRlcicpO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhbiBhcnJheWJ1ZmZlciBvYmplY3QgdG8gYW4gYXJyYXkgb2YgVmVjNCBvYmplY3RzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXkgLSBUaGUgQXJyYXlCdWZmZXIgb2JqZWN0IHRvIGNvbnZlcnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSAtIFRoZSBjb252ZXJ0ZWQgYXJyYXkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29udmVydFZlYzRBcnJheTogZnVuY3Rpb24oIGFycmF5ICkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCBhcnJheS5sZW5ndGggLyA0ICksXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKz00ICkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0WyBpLzQgXSA9IG5ldyBWZWM0KCBhcnJheVtpXSwgYXJyYXlbaSsxXSwgYXJyYXlbaSsyXSwgYXJyYXlbaSszXSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydHMgYW4gYXJyYXlidWZmZXIgb2JqZWN0IHRvIGFuIGFycmF5IG9mIFZlYzMgb2JqZWN0cy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5IC0gVGhlIEFycmF5QnVmZmVyIG9iamVjdCB0byBjb252ZXJ0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gLSBUaGUgY29udmVydGVkIGFycmF5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnZlcnRWZWMzQXJyYXk6IGZ1bmN0aW9uKCBhcnJheSApIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSggYXJyYXkubGVuZ3RoIC8gMyApLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPGFycmF5Lmxlbmd0aDsgaSs9MyApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFsgaS8zIF0gPSBuZXcgVmVjMyggYXJyYXlbaV0sIGFycmF5W2krMV0sIGFycmF5W2krMl0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGFuIGFycmF5YnVmZmVyIG9iamVjdCB0byBhbiBhcnJheSBvZiBWZWMyIG9iamVjdHMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheSAtIFRoZSBBcnJheUJ1ZmZlciBvYmplY3QgdG8gY29udmVydC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IC0gVGhlIGNvbnZlcnRlZCBhcnJheS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb252ZXJ0VmVjMkFycmF5OiBmdW5jdGlvbiggYXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoIGFycmF5Lmxlbmd0aCAvIDIgKSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxhcnJheS5sZW5ndGg7IGkrPTIgKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbIGkvMiBdID0gbmV3IFZlYzIoIGFycmF5W2ldLCBhcnJheVtpKzFdICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIGEgbm9kZXMgbWF0cml4IGZyb20gZWl0aGVyIGFuIGFycmF5IG9yIHRyYW5zbGF0aW9uLFxyXG4gICAgICAgICAqIHJvdGF0aW9uLCBhbmQgc2NhbGUgY29tcG9uZW50cy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIC0gQSBub2RlIGZyb20gdGhlIGdsVEYgSlNPTi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSB0cmFuc2Zvcm0gbWF0cml4LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0Tm9kZU1hdHJpeDogZnVuY3Rpb24oIG5vZGUgKSB7XHJcbiAgICAgICAgICAgIHZhciB0cmFuc2xhdGlvbiwgcm90YXRpb24sIHNjYWxlO1xyXG4gICAgICAgICAgICAvLyBkZWNvbXBvc2UgdHJhbnNmb3JtIGNvbXBvbmVudHMgZnJvbSBtYXRyaXhcclxuICAgICAgICAgICAgaWYgKCBub2RlLm1hdHJpeCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTWF0NDQoIG5vZGUubWF0cml4ICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGdldCB0cmFuc2xhdGlvblxyXG4gICAgICAgICAgICBpZiAoIG5vZGUudHJhbnNsYXRpb24gKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGlvbiA9IE1hdDQ0LnRyYW5zbGF0aW9uKCBub2RlLnRyYW5zbGF0aW9uICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGlvbiA9IE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGdldCByb3RhdGlvblxyXG4gICAgICAgICAgICBpZiAoIG5vZGUucm90YXRpb24gKSB7XHJcbiAgICAgICAgICAgICAgICByb3RhdGlvbiA9IE1hdDQ0LnJvdGF0aW9uUmFkaWFucyggbm9kZS5yb3RhdGlvblszXSwgbm9kZS5yb3RhdGlvbiApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcm90YXRpb24gPSBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgb3JpZW50YXRpb25cclxuICAgICAgICAgICAgaWYgKCBub2RlLm9yaWVudGF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgcm90YXRpb24gPSBuZXcgUXVhdGVybmlvbiggbm9kZS5vcmllbnRhdGlvbiApLm1hdHJpeCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgc2NhbGVcclxuICAgICAgICAgICAgaWYgKCBub2RlLnNjYWxlICkge1xyXG4gICAgICAgICAgICAgICAgc2NhbGUgPSBNYXQ0NC5zY2FsZSggbm9kZS5zY2FsZSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2NhbGUgPSBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRpb24ubXVsdCggcm90YXRpb24gKS5tdWx0KCBzY2FsZSApO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlcXVlc3QgYSBtYXAgb2YgYXJyYXlidWZmZXJzIGZyb20gdGhlIHNlcnZlci4gRXhlY3V0ZXMgY2FsbGJhY2tcclxuICAgICAgICAgKiBmdW5jdGlvbiBwYXNzaW5nIGEgbWFwIG9mIGxvYWRlZCBhcnJheWJ1ZmZlcnMga2V5ZWQgYnkgaWQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYnVmZmVycyAtIFRoZSBtYXAgb2YgYnVmZmVycy5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICByZXF1ZXN0QnVmZmVyczogZnVuY3Rpb24oIGJ1ZmZlcnMsIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICB2YXIgam9icyA9IHt9LFxyXG4gICAgICAgICAgICAgICAga2V5O1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkQnVmZmVyKCBwYXRoICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICAgICAgICAgIFhIUkxvYWRlci5sb2FkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6IFwiYXJyYXlidWZmZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBhcnJheUJ1ZmZlciApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lKCBhcnJheUJ1ZmZlciApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICgga2V5IGluIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGJ1ZmZlcnMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpvYnNbIGtleSBdID0gbG9hZEJ1ZmZlciggYnVmZmVyc1sga2V5IF0ucGF0aCApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCBidWZmZXJzQnlJZCApIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBidWZmZXJzQnlJZCApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXF1ZXN0IGEgbWFwIG9mIGltYWdlcyBmcm9tIHRoZSBzZXJ2ZXIuIEV4ZWN1dGVzIGNhbGxiYWNrXHJcbiAgICAgICAgICogZnVuY3Rpb24gcGFzc2luZyBhIG1hcCBvZiBJbWFnZSBvYmplY3RzIGtleWVkIGJ5IHBhdGguXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VzIC0gVGhlIG1hcCBvZiBpbWFnZXMuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVxdWVzdEltYWdlczogZnVuY3Rpb24oIGltYWdlcywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgIHZhciBqb2JzID0ge30sXHJcbiAgICAgICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRJbWFnZSggcGF0aCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggaW1hZ2UgKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IHBhdGg7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoIGtleSBpbiBpbWFnZXMgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGltYWdlcy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgam9ic1sga2V5IF0gPSBsb2FkSW1hZ2UoIGltYWdlc1sga2V5IF0ucGF0aCApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCBpbWFnZXNCeVBhdGggKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggaW1hZ2VzQnlQYXRoICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxyXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCcuLi9VdGlsJyksXHJcbiAgICAgICAgWEhSTG9hZGVyID0gcmVxdWlyZSgnLi4vWEhSTG9hZGVyJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhbiBpbWFnZSwgYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayB1cG9uXHJcbiAgICAgKiBjb21wbGV0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIGZvciB0aGUgaW1hZ2UgdG8gbG9hZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBsb2FkIHRoZSBpbWFnZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlKCB1cmwgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkb25lKCBpbWFnZSApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyBhIG1hdGVyaWFsIG9iamVjdCBmcm9tIHRoZSBwcm92aWRlZFxyXG4gICAgICogbWF0ZXJpYWwgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1hdGVyaWFsSW5mbyAtIFRoZSBtYXRlcmlhbCBpbmZvcm1hdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZVVybCAtIFRoZSB1cmwgY29udGFpbmluZyB0aGUgdGV4dHVyZSBmaWxlcy5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZU1hdGVyaWFsKCBtYXRlcmlhbEluZm8sIGJhc2VVcmwgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG1hdGVyaWFsSW5mby5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgam9icyA9IHt9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgICAgIGZvciAoIGtleSBpbiBtYXRlcmlhbEluZm8gKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1hdGVyaWFsSW5mby5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRlcmlhbEluZm9bIGtleSBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoIGtleSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAna2QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGlmZnVzZSBjb2xvciAoY29sb3IgdW5kZXIgd2hpdGUgbGlnaHQpIHVzaW5nIFJHQlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5kaWZmdXNlQ29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdrYSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbWJpZW50IGNvbG9yIChjb2xvciB1bmRlciBzaGFkb3cpIHVzaW5nIFJHQiB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLmFtYmllbnRDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNzcGVjdWxhciBjb2xvciAoY29sb3Igd2hlbiBsaWdodCBpcyByZWZsZWN0ZWQgZnJvbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hpbnkgc3VyZmFjZSkgdXNpbmcgUkdCIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc3BlY3VsYXJDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ25zJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNwZWN1bGFyIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBoaWdoIGV4cG9uZW50IHJlc3VsdHMgaW4gYSB0aWdodCwgY29uY2VudHJhdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOcyB2YWx1ZXMgbm9ybWFsbHkgcmFuZ2UgZnJvbSAwIHRvIDEwMDAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5zcGVjdWxhckNvbXBvbmVudCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21hcF9rZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaWZmdXNlIHRleHR1cmUgbWFwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JzLmRpZmZ1c2UgPSBsb2FkSW1hZ2UoIGJhc2VVcmwgKyBcIi9cIiArIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL21hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlID0gYmFzZVVybCArIFwiL1wiICsgdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkIGlzIGRpc3NvbHZlIGZvciBjdXJyZW50IG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWN0b3Igb2YgMS4wIGlzIGZ1bGx5IG9wYXF1ZSwgYSBmYWN0b3Igb2YgMCBpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnVsbHkgdHJhbnNwYXJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgPCAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLmFscGhhID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaWxsdW0nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZSA+IDIgJiYgdmFsdWUgPCAxMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5yZWZsZWN0aW9uID0gMC4zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZSA9PT0gNiB8fCB2YWx1ZSA9PT0gNyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5yZWZyYWN0aW9uID0gMC44O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGxvYWQgYWxsIGltYWdlcyBhc3luY2hyb25vdXNseVxyXG4gICAgICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbiggaW1hZ2VzQnlUeXBlICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleTtcclxuICAgICAgICAgICAgICAgIGZvciAoIGtleSBpbiBpbWFnZXNCeVR5cGUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpbWFnZXNCeVR5cGUuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbFsga2V5ICsgXCJUZXh0dXJlXCIgXSA9IGltYWdlc0J5VHlwZVsga2V5IF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZG9uZSggbWF0ZXJpYWwgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGVzIHRocm91Z2ggdGhlIGluZGl2aWR1YWwgbWF0ZXJpYWwgaW5mb3MgYW5kIGdlbmVyYXRlc1xyXG4gICAgICogdGhlIHJlc3BlY3RpdmUgTWF0ZXJpYWwgb2JqZWN0cy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWF0ZXJpYWxJbmZvcyAtIFRoZSBtYXAgb2YgbWF0ZXJpYWwgaW5mb3JtYXRpb24sIGtleWVkIGJ5IG5hbWUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZyBiYXNlVXJsIC0gVGhlIGJhc2UgVVJMIG9mIHRoZSBmb2xkZXIgY29udGFpbmluZyB0aGUgbWF0ZXJpYWwgZGVwZW5kZW5jeSBmaWxlcy5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZU1hdGVyaWFscyggbWF0ZXJpYWxJbmZvcywgYmFzZVVybCwgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGpvYnMgPSB7fSxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIGZvciAoIGtleSBpbiBtYXRlcmlhbEluZm9zICkge1xyXG4gICAgICAgICAgICBpZiAoIG1hdGVyaWFsSW5mb3MuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgam9ic1sga2V5IF0gPSBnZW5lcmF0ZU1hdGVyaWFsKCBtYXRlcmlhbEluZm9zWyBrZXkgXSwgYmFzZVVybCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCBtYXRlcmlhbHMgKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCBtYXRlcmlhbHMgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyB0aGUgc291cmNlIHRleHQgb2YgYSB3YXZlZnJvbnQgLm10bCBmaWxlIGFuZCByZXR1cm5zIGEgbWFwXHJcbiAgICAgKiBvZiB0aGUgcmVsZXZhbnQgbWF0ZXJpYWwgaW5mb3JtYXRpb24sIGtleWVkIGJ5IG5hbWUuXHJcbiAgICAgKlxyXG4gICAgICogQGF1dGhvciBhbmdlbHh1YW5jaGFuZ1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcmMgLSBUaGUgc291cmNlIHRleHQgb2YgYSAubXRsIGZpbGUgdG8gYmUgcGFyc2VkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBwYXJzZWQgc291cmNlIGNvbnRhaW5pbmcgYWxsIG1hdGVyaWFscyBrZXllZCBieSBuYW1lLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZU1UTFNvdXJjZSggc3JjICkge1xyXG4gICAgICAgIHZhciBsaW5lcyA9IHNyYy5zcGxpdCggJ1xcbicgKSxcclxuICAgICAgICAgICAgbWF0ZXJpYWxJbmZvcyA9IHt9LFxyXG4gICAgICAgICAgICBpbmZvID0ge30sXHJcbiAgICAgICAgICAgIHZlY3RvcixcclxuICAgICAgICAgICAgbGluZSxcclxuICAgICAgICAgICAgcG9zLFxyXG4gICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxsaW5lcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF0udHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAoIGxpbmUubGVuZ3RoID09PSAwIHx8IGxpbmUuY2hhckF0KCAwICkgPT09ICcjJyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGJsYW5rIGxpbmUgb3IgY29tbWVudCBpZ25vcmVcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBvcyA9IGxpbmUuaW5kZXhPZiggJyAnICk7XHJcbiAgICAgICAgICAgIGlmICggcG9zID49IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSBsaW5lLnN1YnN0cmluZyggMCwgcG9zICkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbGluZS5zdWJzdHJpbmcoIHBvcyArIDEgKS50cmltKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSBsaW5lO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgga2V5ID09PSBcIm5ld210bFwiICkge1xyXG4gICAgICAgICAgICAgICAgLy8gbmV3IG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICBpbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxJbmZvc1sgdmFsdWUgXSA9IGluZm87XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGluZm8gKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGtleSA9PT0gXCJrYVwiIHx8XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID09PSBcImtkXCIgfHxcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPT09IFwia3NcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9PT0gXCJrZVwiICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZlY3RvciB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIHZlY3RvciA9IHZhbHVlLnNwbGl0KCAvXFxzKy8sIDMgKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvWyBrZXkgXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggdmVjdG9yWzBdICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHZlY3RvclsxXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCB2ZWN0b3JbMl0gKSBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgga2V5ID09PSBcIm5zXCIgfHwga2V5ID09PSBcImRcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzY2FsYXIgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBpbmZvWyBrZXkgXSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyXHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb1sga2V5IF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0ZXJpYWxJbmZvcztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9hZHMgYSB3YXZlZnJvbnQgLm10bCBmaWxlLCBnZW5lcmF0ZXMgYSBtYXAgb2YgbWF0ZXJpYWwgc3BlY2lmaWNhdGlvblxyXG4gICAgICAgICAqIG9iamVjdHMsIGtleWVkIGJ5IG5hbWUsIGFuZCBwYXNzZXMgaXQgdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHVwb25cclxuICAgICAgICAgKiBjb21wbGV0aW9uLiBBbGwgdGV4dHVyZXMgcmVtYWluIGFzIGZ1bGx5IHF1YWxpZmllZCB1cmxzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gdGhlIC5tdGwgZmlsZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgdmFyIGJhc2VVcmwgPSBwYXRoLmRpcm5hbWUoIHVybCApO1xyXG4gICAgICAgICAgICBYSFJMb2FkZXIubG9hZChcclxuICAgICAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBzcmMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWQgPSBwYXJzZU1UTFNvdXJjZSggc3JjICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlTWF0ZXJpYWxzKCBwYXJzZWQsIGJhc2VVcmwsIGNhbGxiYWNrICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgWEhSTG9hZGVyID0gcmVxdWlyZSgnLi4vWEhSTG9hZGVyJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIHRyaWFuZ2xlIGhhc2hpbmcgZnVuY3Rpb24gdXNlZCB0byByZW1vdmUgZHVwbGljYXRlcyBmcm9tXHJcbiAgICAgKiB0aGUgdW5pZmllZCBhcnJheSBnZW5lcmF0aW9uIHByb2Nlc3MuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRyaWFuZ2xlIC0gVGhlIHRyaWFuZ2xlLlxyXG4gICAgICogQHBhcmFtIHtpbnRlZ2VyfSBpbmRleCAtIFRoZSB0cmlhbmdsZSB2ZXJ0ZXggaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHRyaWFuZ2xlcyBoYXNoLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0cmlIYXNoKCB0cmlhbmdsZSwgaW5kZXggKSB7XHJcbiAgICAgICAgdmFyIGhhc2ggPSB0cmlhbmdsZS5wb3NpdGlvbnNbIGluZGV4IF0udG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoIHRyaWFuZ2xlLm5vcm1hbHMgKSB7XHJcbiAgICAgICAgICAgIGhhc2ggKz0gXCItXCIgKyB0cmlhbmdsZS5ub3JtYWxzWyBpbmRleCBdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggdHJpYW5nbGUudXZzICkge1xyXG4gICAgICAgICAgICBoYXNoICs9IFwiLVwiICsgdHJpYW5nbGUudXZzWyBpbmRleCBdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoYXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIHVuaWZpZWQgdmVydGV4IGF0dHJpYnV0ZSBhcnJheXMgZnJvbSB0cmlhbmdsZXMuIFVuaWZpZWQgYXJyYXlzXHJcbiAgICAgKiBhcmUgYXJyYXlzIG9mIHZlcnRleCBhdHRyaWJ1dGVzIG9yZ2FuaXplZCBzdWNoIHRoYXQgYWxsIGluZGljZXNcclxuICAgICAqIGNvcnJlc3BvbmQgYWNyb3NzIGF0dHJpYnV0ZXMuIFVuaWZpZWQgYXJyYXlzIGFyZSBub3QgbWVtb3J5IGVmZmljaWVudCxcclxuICAgICAqIGZvciBleGFtcGxlIGEgY3ViZSBpcyBjb21wb3NlZCBvZiA4IHBvc2l0aW9ucyBhbmQgNiBub3JtYWxzLiB0aGlzIHdvdWxkXHJcbiAgICAgKiBiZSBvcmdhbml6ZWQgaW50byB0d28gdW5pZmllZCBhcnJheXMgZWFjaCBjb25zaXN0aW5nIG9mIDI0IGVsZW1lbnRzLlxyXG4gICAgICogV2ViR0wgdmVydGV4IGJ1ZmZlcnMgb25seSBhY2NlcHRzIHVuaWZpZWQgYXJyYXlzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtZXNoIC0gVGhlIG1lc2ggaW5mb3JtYXRpb24gb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBvYmplY3QgY29udGFpbmluZyBhdHRyaWJ1dGUgYW5kIGluZGV4IGFycmF5cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY29udmVydFRvVW5pZmllZEFycmF5cyggbWVzaCApIHtcclxuICAgICAgICB2YXIgcG9zaXRpb25zID0gW10sXHJcbiAgICAgICAgICAgIG5vcm1hbHMgPSBbXSxcclxuICAgICAgICAgICAgdXZzID0gW10sXHJcbiAgICAgICAgICAgIGluZGljZXMgPSBbXSxcclxuICAgICAgICAgICAgY291bnQgPSAwLFxyXG4gICAgICAgICAgICBoYXNoZXMgPSB7fSxcclxuICAgICAgICAgICAgaGFzaCxcclxuICAgICAgICAgICAgYXJyYXlzLFxyXG4gICAgICAgICAgICB0cmlhbmdsZSxcclxuICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgIGksIGo7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPG1lc2gudHJpYW5nbGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCB0cmlhbmdsZVxyXG4gICAgICAgICAgICB0cmlhbmdsZSA9IG1lc2gudHJpYW5nbGVzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKCBqPTA7IGo8MzsgaisrICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaGFzaCBpdHMgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBoYXNoID0gdHJpSGFzaCggdHJpYW5nbGUsIGogKTtcclxuICAgICAgICAgICAgICAgIC8vaW5kZXggPSBoYXNoZXNbIGhhc2ggXTtcclxuICAgICAgICAgICAgICAgIGlmICggaW5kZXggPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBkb2Vzbid0IGV4aXN0LCBhZGQgYXR0cmlidXRlcyB0byBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKCB0cmlhbmdsZS5wb3NpdGlvbnNbal0gKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRyaWFuZ2xlLm5vcm1hbHMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbHMucHVzaCggdHJpYW5nbGUubm9ybWFsc1tqXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRyaWFuZ2xlLnV2cyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXZzLnB1c2goIHRyaWFuZ2xlLnV2c1tqXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIGNvdW50ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzaGVzWyBoYXNoIF0gPSBjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBkb2VzLCByZWZlcmVuY2UgZXhpc3RpbmcgYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggaW5kZXggKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhcnJheXMgPSB7XHJcbiAgICAgICAgICAgIHRyaWFuZ2xlczogbWVzaC50cmlhbmdsZXMsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uczogcG9zaXRpb25zLFxyXG4gICAgICAgICAgICBpbmRpY2VzOiBpbmRpY2VzLFxyXG4gICAgICAgICAgICBub3JtYWxzOiBub3JtYWxzLFxyXG4gICAgICAgICAgICBtYXRlcmlhbDogbWVzaC5tYXRlcmlhbCAvLyBtYXRlcmlhbCBuYW1lLCBub3QgYWN0dWFsIG1hdGVyaWFsIHNldFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCB1dnMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgYXJyYXlzLnV2cyA9IHV2cztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGUgdGhyb3VnaCB0aGUgbW9kZWwgaW5mb3JtYXRpb24gbWVzaGVzIGFuZCBjcmVhdGUgYWxsIHZlcnRleFxyXG4gICAgICogYXR0cmlidXRlIGFycmF5cyBmcm9tIHRyaWFuZ2xlcy4gUmVwbGFjZXMgZXhpc3RpbmcgJ21lc2gnIGF0dHJpYnV0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1vZGVsIC0gVGhlIG1vZGVsIGluZm9ybWF0aW9uIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgTW9kZWwgaW5mb3JtYXRpb24gb2JqZWN0IHdpdGggbWVzaGVzIGFwcGVuZGVkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0VHJpYW5nbGVzVG9BcnJheXMoIG1vZGVsICkge1xyXG4gICAgICAgIHZhciBtZXNoZXMgPSBtb2RlbC5tZXNoZXMsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPG1lc2hlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgbWVzaGVzW2ldID0gY29udmVydFRvVW5pZmllZEFycmF5cyggbWVzaGVzW2ldICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyB0aGUgc291cmNlIHRleHQgb2YgYSB3YXZlZnJvbnQgLm9iaiBmaWxlIGFuZCByZXR1cm5zIGEgbW9kZWxcclxuICAgICAqIGluZm9ybWF0aW9uIG9iamVjdCBjb250YWluaW5nIHRoZSByZWxldmFudCBpbmZvcm1hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3JjIC0gVGhlIHNvdXJjZSB0ZXh0IG9mIGEgLm9iaiBmaWxlIHRvIGJlIHBhcnNlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgcGFyc2VkIC5vYmogZmlsZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGFyc2VPQkpTb3VyY2UoIHNyYyApIHtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkRW1wdHlNZXNoKCBncm91cE5hbWUsIG9iak5hbWUsIG1hdGVyaWFsTmFtZSApIHtcclxuICAgICAgICAgICAgdmFyIG1lc2g7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBmcmVzaCB0cmlhbmdsZXNcclxuICAgICAgICAgICAgdHJpYW5nbGVzID0gW107XHJcbiAgICAgICAgICAgIC8vIGFzc2lnbiBpdCB0byB0aGUgbmV3IGVtcHR5IG1lc2hcclxuICAgICAgICAgICAgbWVzaCA9IHtcclxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlczogdHJpYW5nbGVzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIGlmIG1lc2ggZ3JvdXAgaXMgcHJvdmlkZWQsIGFkZCBpdFxyXG4gICAgICAgICAgICBpZiAoIGdyb3VwTmFtZSApIHtcclxuICAgICAgICAgICAgICAgIG1lc2guZ3JvdXAgPSBncm91cE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaWYgb2JqZWN0IG5hbWUgaXMgcHJvdmlkZWQsIGFkZCBpdFxyXG4gICAgICAgICAgICBpZiAoIG9iak5hbWUgKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNoLm5hbWUgPSBvYmpOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIGEgbWF0ZXJpYWwgbmFtZSBpcyBwcm92aWRlZCwgYWRkIGl0XHJcbiAgICAgICAgICAgIGlmICggbWF0ZXJpYWxOYW1lICkge1xyXG4gICAgICAgICAgICAgICAgbWVzaC5tYXRlcmlhbCA9IG1hdGVyaWFsTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhcHBlbmQgZW1wdHkgbWVzaCB0byBtb2RlbFxyXG4gICAgICAgICAgICBtb2RlbC5tZXNoZXMucHVzaCggbWVzaCApO1xyXG4gICAgICAgICAgICAvLyBjbGVhciBncm91cCBhbmQgb2JqZWN0IG5hbWVzXHJcbiAgICAgICAgICAgIG5leHRHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgIG5leHRPYmplY3QgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UG9zaXRpb24oIHZhbHVlICkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUgKTtcclxuXHRcdFx0aWYgKCBpbmRleCA+PSAwICApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbnNbIGluZGV4IC0gMSBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbnNbIGluZGV4ICsgcG9zaXRpb25zLmxlbmd0aCBdO1xyXG5cdFx0fVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVViggdmFsdWUgKSB7XHJcblx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSApO1xyXG5cdFx0XHRpZiAoIGluZGV4ID49IDAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHV2c1sgaW5kZXggLSAxIF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHV2c1sgaW5kZXggKyB1dnMubGVuZ3RoIF07XHJcblx0XHR9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vcm1hbCggdmFsdWUgKSB7XHJcblx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSApO1xyXG5cdFx0XHRpZiAoIGluZGV4ID49IDAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vcm1hbHNbIGluZGV4IC0gMSBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxzWyBpbmRleCArIG5vcm1hbHMubGVuZ3RoIF07XHJcblx0XHR9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkVHJpYW5nbGVGcm9tSW5kaWNlcyggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApIHtcclxuICAgICAgICAgICAgdmFyIHRyaWFuZ2xlID0ge30sXHJcbiAgICAgICAgICAgICAgICBhLCBiLCBjLCB1LCB2LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsLCBtYWc7XHJcbiAgICAgICAgICAgIC8vIGFkZCBwb3NpdGlvbnMgdG8gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlLnBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKCBwb3NJbmRpY2VzWzBdICksXHJcbiAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbiggcG9zSW5kaWNlc1sxXSApLFxyXG4gICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oIHBvc0luZGljZXNbMl0gKSBdO1xyXG4gICAgICAgICAgICAvLyBpZiB1dnMgYXJlIHByb3ZpZGVkLCBhZGQgdGhlbSB0byB0aGUgdHJpYW5nbGVcclxuICAgICAgICAgICAgaWYgKCB1dkluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS51dnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0VVYoIHV2SW5kaWNlc1swXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIGdldFVWKCB1dkluZGljZXNbMV0gKSxcclxuICAgICAgICAgICAgICAgICAgICBnZXRVViggdXZJbmRpY2VzWzJdICkgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiBub3JtYWxzIGFyZSBwcm92aWRlZCwgYWRkIHRoZW0gdG8gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIGlmICggbm9ybUluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS5ub3JtYWxzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIGdldE5vcm1hbCggbm9ybUluZGljZXNbMF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBnZXROb3JtYWwoIG5vcm1JbmRpY2VzWzFdICksXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Tm9ybWFsKCBub3JtSW5kaWNlc1syXSApIF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBub3JtYWxzIGFyZSBub3QgcHJvdmlkZWQsIGdlbmVyYXRlIHRoZW1cclxuICAgICAgICAgICAgICAgIGEgPSB0cmlhbmdsZS5wb3NpdGlvbnNbMF07XHJcbiAgICAgICAgICAgICAgICBiID0gdHJpYW5nbGUucG9zaXRpb25zWzFdO1xyXG4gICAgICAgICAgICAgICAgYyA9IHRyaWFuZ2xlLnBvc2l0aW9uc1syXTtcclxuICAgICAgICAgICAgICAgIHUgPSBbIGJbMF0tYVswXSwgYlsxXS1hWzFdLCBiWzJdLWFbMl0gXTsgLy8gYiAtIGFcclxuICAgICAgICAgICAgICAgIHYgPSBbIGNbMF0tYVswXSwgY1sxXS1hWzFdLCBjWzJdLWFbMl0gXTsgLy8gYyAtIGFcclxuICAgICAgICAgICAgICAgIC8vIGNyb3NzIHByb2R1Y3RcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IFtcclxuICAgICAgICAgICAgICAgICAgICAoIHVbMV0gKiB2WzJdICkgLSAoIHZbMV0gKiB1WzJdICksXHJcbiAgICAgICAgICAgICAgICAgICAgKC11WzBdICogdlsyXSApICsgKCB2WzBdICogdVsyXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICggdVswXSAqIHZbMV0gKSAtICggdlswXSAqIHVbMV0gKVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbGl6ZVxyXG4gICAgICAgICAgICAgICAgbWFnID0gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFswXSpub3JtYWxbMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsxXSpub3JtYWxbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsyXSpub3JtYWxbMl0gKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IFtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWxbMF0gLyBtYWcsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsWzFdIC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsyXSAvIG1hZyBdO1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUubm9ybWFscyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhZGQgdHJpYW5nbGUgdG8gYXJyYXlcclxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2goIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZUZhY2VJbnB1dCggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApIHtcclxuICAgICAgICAgICAgYnVpbGRUcmlhbmdsZUZyb21JbmRpY2VzKCBwb3NJbmRpY2VzLCB1dkluZGljZXMsIG5vcm1JbmRpY2VzICk7XHJcbiAgICAgICAgICAgIGlmICggcG9zSW5kaWNlc1sgMyBdICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NJbmRpY2VzID0gWyBwb3NJbmRpY2VzWyAwIF0sIHBvc0luZGljZXNbIDIgXSwgcG9zSW5kaWNlc1sgMyBdIF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIHV2SW5kaWNlcyApIHtcclxuICAgICAgICAgICAgICAgICAgICB1dkluZGljZXMgPSBbIHV2SW5kaWNlc1sgMCBdLCB1dkluZGljZXNbIDIgXSwgdXZJbmRpY2VzWyAzIF0gXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICggbm9ybUluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybUluZGljZXMgPSBbIG5vcm1JbmRpY2VzWyAwIF0sIG5vcm1JbmRpY2VzWyAyIF0sIG5vcm1JbmRpY2VzWyAzIF0gXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJ1aWxkVHJpYW5nbGVGcm9tSW5kaWNlcyggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdiBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIHZhciBQT1NJVElPTl9SRUdFWCA9IC92KCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspLyxcclxuICAgICAgICAgICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgICAgICAgICAgTk9STUFMX1JFR0VYID0gL3ZuKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspLyxcclxuICAgICAgICAgICAgLy8gdnQgZmxvYXQgZmxvYXRcclxuICAgICAgICAgICAgVVZfUkVHRVggPSAvdnQoICtbXFxkfFxcLnxcXCt8XFwtfGVdKykoICtbXFxkfFxcLnxcXCt8XFwtfGVdKykvLFxyXG4gICAgICAgICAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4IC4uLlxyXG4gICAgICAgICAgICBGQUNFX1ZfUkVHRVggPSAvZiggKy0/XFxkKykoICstP1xcZCspKCArLT9cXGQrKSggKy0/XFxkKyk/LyxcclxuICAgIFx0XHQvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2IC4uLlxyXG4gICAgXHRcdEZBQ0VfVl9VVl9SRUdFWCA9IC9mKCArKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgIFx0XHQvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIC4uLlxyXG4gICAgXHRcdEZBQ0VfVl9VVl9OX1JFR0VYID0gL2YoICsoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICBcdFx0Ly8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCAuLi5cclxuICAgIFx0XHRGQUNFX1ZfTl9SRUdFWCA9IC9mKCArKC0/XFxkKylcXC9cXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcL1xcLygtP1xcZCspKSggKygtP1xcZCspXFwvXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAgICAgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICB1dnMgPSBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyA9IFtdLFxyXG4gICAgICAgICAgICB0cmlhbmdsZXMgPSBbXSxcclxuICAgICAgICAgICAgbmV4dEdyb3VwID0gbnVsbCxcclxuICAgICAgICAgICAgbmV4dE9iamVjdCA9IG51bGwsXHJcbiAgICAgICAgICAgIGxpbmVzID0gc3JjLnNwbGl0KCBcIlxcblwiICksXHJcbiAgICAgICAgICAgIGxpbmUsXHJcbiAgICAgICAgICAgIHJlc3VsdCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBwYXJzZSBsaW5lc1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxsaW5lcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF0udHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAoIGxpbmUubGVuZ3RoID09PSAwIHx8IGxpbmUuY2hhckF0KCAwICkgPT09ICcjJyApIHtcclxuICAgICAgICAgICAgICAgIC8vICMgY29tbWVudCBvciBibGFuayBsaW5lXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBQT1NJVElPTl9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2IDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IE5PUk1BTF9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgLy8gW1widm4gMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuICAgICAgICAgICAgICAgIG5vcm1hbHMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IFVWX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gdXZzXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2dCAwLjEgMC4yXCIsIFwiMC4xXCIsIFwiMC4yXCJdXHJcbiAgICAgICAgICAgICAgICB1dnMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCAxIC0gcmVzdWx0WyAyIF0gKSAvLyBpbnZlcnRcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IEZBQ0VfVl9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGZhY2Ugb2YgcG9zaXRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJmIDEgMiAzXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCIsIHVuZGVmaW5lZF1cclxuICAgICAgICAgICAgICAgIHBhcnNlRmFjZUlucHV0KFxyXG4gICAgICAgICAgICAgICAgICAgIFsgLy8gcG9zaXRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAzIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBudWxsLCAvLyB1dnNcclxuICAgICAgICAgICAgICAgICAgICBudWxsICk7IC8vIG5vcm1hbHNcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBGQUNFX1ZfVVZfUkVHRVguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmYWNlIG9mIHBvc2l0aW9ucyBhbmQgdXZzXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiIDEvMVwiLCBcIjFcIiwgXCIxXCIsIFwiIDIvMlwiLCBcIjJcIiwgXCIyXCIsIFwiIDMvM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcbiAgICAgICAgICAgICAgICBwYXJzZUZhY2VJbnB1dChcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA1IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDExIF1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgLy8gdXZzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDYgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA5IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbCApOyAvLyBub3JtYWxzXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gRkFDRV9WX1VWX05fUkVHRVguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmYWNlIG9mIHBvc2l0aW9ucywgdXZzLCBhbmQgbm9ybWFsc1xyXG4gICAgICAgICAgICAgICAgLy8gW1wiZiAxLzEvMSAyLzIvMiAzLzMvM1wiLCBcIiAxLzEvMVwiLCBcIjFcIiwgXCIxXCIsIFwiMVwiLCBcIiAyLzIvMlwiLCBcIjJcIiwgXCIyXCIsIFwiMlwiLCBcIiAzLzMvM1wiLCBcIjNcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcbiAgICAgICAgICAgICAgICBwYXJzZUZhY2VJbnB1dChcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA2IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxNCBdXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHV2c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTEgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxNSBdXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIG5vcm1hbHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA0IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEyIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTYgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IEZBQ0VfVl9OX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmFjZSBvZiBwb3NpdGlvbnMgYW5kIG5vcm1hbHNcclxuICAgICAgICAgICAgICAgIC8vIFtcImYgMS8vMSAyLy8yIDMvLzNcIiwgXCIgMS8vMVwiLCBcIjFcIiwgXCIxXCIsIFwiIDIvLzJcIiwgXCIyXCIsIFwiMlwiLCBcIiAzLy8zXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuICAgICAgICAgICAgICAgIHBhcnNlRmFjZUlucHV0KFxyXG4gICAgICAgICAgICAgICAgICAgIFsgLy8gcG9zaXRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMiBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDUgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA4IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTEgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbCwgLy8gdXZzXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyBub3JtYWxzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDYgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA5IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAvXm8gLy50ZXN0KCBsaW5lICkgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvYmplY3RcclxuICAgICAgICAgICAgICAgIG5leHRPYmplY3QgPSBsaW5lLnN1YnN0cmluZyggMiApLnRyaW0oKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggL15nIC8udGVzdCggbGluZSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gZ3JvdXBcclxuICAgICAgICAgICAgICAgIG5leHRHcm91cCA9IGxpbmUuc3Vic3RyaW5nKCAyICkudHJpbSgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAvXnVzZW10bCAvLnRlc3QoIGxpbmUgKSApIHtcclxuICAgICAgICAgICAgICAgIC8vIG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICBhZGRFbXB0eU1lc2goIG5leHRHcm91cCwgbmV4dE9iamVjdCwgbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggL15tdGxsaWIgLy50ZXN0KCBsaW5lICkgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtdGwgZmlsZVxyXG4gICAgICAgICAgICAgICAgbW9kZWwubXRsbGliID0gbW9kZWwubXRsbGliIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwubXRsbGliLnB1c2goIGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBtb2RlbC5tZXNoZXMubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgICAvLyBubyBtdGxzLCBhc3NlbWJsZSBhbGwgdW5kZXIgYSBzaW5nbGUgbWVzaFxyXG4gICAgICAgICAgICBtb2RlbC5tZXNoZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXM6IHRyaWFuZ2xlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBMb2FkcyBhIHdhdmVmcm9udCAub2JqIGZpbGUsIGdlbmVyYXRlcyBhIG1vZGVsIHNwZWNpZmljYXRpb24gb2JqZWN0XHJcbiAgICAgICAgICogYW5kIHBhc3NlcyBpdCB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gdGhlIC5vYmogZmlsZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsb2FkOiBmdW5jdGlvbiggdXJsLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgWEhSTG9hZGVyLmxvYWQoXHJcbiAgICAgICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggc3JjICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VkID0gcGFyc2VPQkpTb3VyY2UoIHNyYyApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBjb252ZXJ0VHJpYW5nbGVzVG9BcnJheXMoIHBhcnNlZCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIG1vZGVsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxyXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCcuLi9VdGlsJyksXHJcbiAgICAgICAgT0JKTG9hZGVyID0gcmVxdWlyZSgnLi9PQkpMb2FkZXInKSxcclxuICAgICAgICBNVExMb2FkZXIgPSByZXF1aXJlKCcuL01UTExvYWRlcicpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIGxvYWQgYW4gTVRMIGZpbGUsIGFuZCBleGVjdXRlIGEgY2FsbGJhY2sgdXBvblxyXG4gICAgICogY29tcGxldGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVGhlIHVybCBmb3IgdGhlIE1UTCBmaWxlIHRvIGxvYWQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gbG9hZCB0aGUgTVRMIGZpbGUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxvYWRNdGwoIHVybCApIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGRvbmUgKSB7XHJcbiAgICAgICAgICAgIE1UTExvYWRlci5sb2FkKCB1cmwsIGRvbmUgKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgbWl0bGliIGF0dHJpYnV0ZSBvZiB0aGUgbW9kZWwgYW5kIGxvYWRzIG1hdGVyaWFsc1xyXG4gICAgICogZnJvbSBhbGwgYXNzb2NpYXRlZCAubXRsIGZpbGVzLiBQYXNzZXMgdGhlIG1hdGVyaWFsIHNwZWNpZmljYXRpb24gb2JqZWN0c1xyXG4gICAgICogdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtb2RlbCAtIFRoZSBtb2RlbCBpbmZvcm1hdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZyBiYXNlVXJsIC0gVGhlIGJhc2UgVVJMIG9mIHRoZSBmb2xkZXIgY29udGFpbmluZyB0aGUgbWF0ZXJpYWwgZGVwZW5kZW5jeSBmaWxlcy5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHVwb24gY29tcGxldGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbG9hZE1hdGVyaWFscyggbW9kZWwsIGJhc2VVcmwsIGNhbGxiYWNrICkge1xyXG4gICAgICAgIHZhciBqb2JzID0gW10sXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gaWYgbm90IG1hdGVyaWFsLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCAhbW9kZWwubXRsbGliICkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayggbW9kZWwgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgdXAgdGhlIG1hdGVyaWFsIGxvYWRpbmcgam9iXHJcbiAgICAgICAgZm9yICggaT0wOyBpPG1vZGVsLm10bGxpYi5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgam9icy5wdXNoKCBsb2FkTXRsKCBiYXNlVXJsICsgJy8nICsgbW9kZWwubXRsbGliWyBpIF0gKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkaXNwYXRjaCBhbGwgbWF0ZXJpYWwgbG9hZGluZyBqb2JzXHJcbiAgICAgICAgVXRpbC5hc3luYyggam9icywgZnVuY3Rpb24oIG1hdGVyaWFscyApIHtcclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsc0J5TmFtZSA9IHt9LFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPG1hdGVyaWFscy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIFV0aWwuZXh0ZW5kKCBtYXRlcmlhbHNCeU5hbWUsIG1hdGVyaWFsc1tpXSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCBtYXRlcmlhbHNCeU5hbWUgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9hZHMgYSB3YXZlZnJvbnQgLm9iaiBmaWxlLCBnZW5lcmF0ZXMgYSBtb2RlbCBzcGVjaWZpY2F0aW9uIG9iamVjdCxcclxuICAgICAgICAgKiBhbmQgcGFzc2VzIGl0IHRvIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uVGhpcyBhbHNvXHJcbiAgICAgICAgICogaW52b2x2ZXMgbG9hZGluZyBhbmQgZ2VuZXJhdGluZyB0aGUgYXNzb2NpYXRlZCBtYXRlcmlhbCBzcGVjaWZpY2F0aW9uXHJcbiAgICAgICAgICogb2JqZWN0cyBmcm9tIHRoZSByZXNwZWN0aXZlIHdhdmVmcm9udCAubXRsIGZpbGVzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gdGhlIC5vYmogZmlsZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uKCB1cmwsIGNhbGxiYWNrICkge1xyXG4gICAgICAgICAgICAvLyBsb2FkIGFuZCBwYXJzZSBPQkogZmlsZVxyXG4gICAgICAgICAgICBPQkpMb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiggbW9kZWwgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGVuIGxvYWQgYW5kIHBhcnNlIE1UTCBmaWxlXHJcbiAgICAgICAgICAgICAgICBsb2FkTWF0ZXJpYWxzKCBtb2RlbCwgcGF0aC5kaXJuYW1lKCB1cmwgKSwgZnVuY3Rpb24oIG1hdGVyaWFsc0J5SWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGVhY2ggbWF0ZXJpYWwgdG8gdGhlIGFzc29jaWF0ZWQgbWVzaFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXNoZXMgPSBtb2RlbC5tZXNoZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICggaT0wOyBpPG1lc2hlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzaGVzW2ldLm1hdGVyaWFsID0gbWF0ZXJpYWxzQnlJZFsgbWVzaGVzW2ldLm1hdGVyaWFsIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBtb2RlbCApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFNJWkUgPSAxO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBwb3NpdGlvbnM6IGZ1bmN0aW9uKCBzaXplICkge1xyXG4gICAgICAgICAgICBzaXplID0gc2l6ZSB8fCBTSVpFO1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgLy8gZnJvbnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAtc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIHNpemUvMiwgLXNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAgc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsICBzaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIC8vIGJhY2sgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAtc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsICBzaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgIHNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAtc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICAvLyB0b3AgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAgc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsICBzaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgIHNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAgc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBib3R0b20gZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAtc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsIC1zaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgLXNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAtc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICAvLyByaWdodCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsIC1zaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgIHNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAgc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsIC1zaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIC8vIGxlZnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAtc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsIC1zaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgIHNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAgc2l6ZS8yLCAtc2l6ZS8yIF1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBub3JtYWxzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIC8vIGZyb250IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBiYWNrIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAtMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgLTEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsIC0xLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAtMS4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyB0b3AgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAxLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAxLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIGJvdHRvbSBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgLTEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIC0xLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAtMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgLTEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gcmlnaHQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAxLjAsICAwLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAgMC4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgIDAuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsICAwLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIGxlZnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAtMS4wLCAgMC4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIC0xLjAsICAwLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgLTEuMCwgIDAuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAtMS4wLCAgMC4wLCAgMC4wIF1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1dnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgLy8gZnJvbnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gYmFjayBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyB0b3AgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIHJpZ2h0IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIGxlZnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDEuMCBdXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5kaWNlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAwLCAxLCAyLCAwLCAyLCAzLCAvLyBmcm9udCBmYWNlXHJcbiAgICAgICAgICAgICAgICA0LCA1LCA2LCA0LCA2LCA3LCAvLyBiYWNrIGZhY2VcclxuICAgICAgICAgICAgICAgIDgsIDksIDEwLCA4LCAxMCwgMTEsIC8vIHRvcCBmYWNlXHJcbiAgICAgICAgICAgICAgICAxMiwgMTMsIDE0LCAxMiwgMTQsIDE1LCAvLyBib3R0b20gZmFjZVxyXG4gICAgICAgICAgICAgICAgMTYsIDE3LCAxOCwgMTYsIDE4LCAxOSwgLy8gcmlnaHQgZmFjZVxyXG4gICAgICAgICAgICAgICAgMjAsIDIxLCAyMiwgMjAsIDIyLCAyMyAgLy8gbGVmdCBmYWNlXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2VvbWV0cnk6IGZ1bmN0aW9uKCBzaXplICkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLnBvc2l0aW9ucyggc2l6ZSApLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsczogdGhpcy5ub3JtYWxzKCksXHJcbiAgICAgICAgICAgICAgICB1dnM6IHRoaXMudXZzKCksXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiB0aGlzLmluZGljZXMoKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgU0xJQ0VTID0gMjAsXHJcbiAgICAgICAgSEVJR0hUID0gMSxcclxuICAgICAgICBSQURJVVMgPSAxO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBwb3NpdGlvbnM6IGZ1bmN0aW9uKCBzbGljZXMsIGhlaWdodCwgcmFkaXVzICkge1xyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gW10sXHJcbiAgICAgICAgICAgICAgICBzbGljZUFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgeDAsIHowLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0IHx8IEhFSUdIVDtcclxuICAgICAgICAgICAgcmFkaXVzID0gcmFkaXVzIHx8IFJBRElVUztcclxuICAgICAgICAgICAgc2xpY2VBbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2xpY2VzO1xyXG4gICAgXHRcdGZvciAoIGk9MDsgaTw9c2xpY2VzOyBpKysgKSB7XHJcbiAgICBcdFx0XHR4MCA9IHJhZGl1cyAqIE1hdGguc2luKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgXHRcdFx0ejAgPSByYWRpdXMgKiBNYXRoLmNvcyggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKFsgeDAsIGhlaWdodCwgejAgXSk7XHJcbiAgICBcdFx0fVxyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8PXNsaWNlczsgaSsrICkge1xyXG4gICAgXHRcdFx0eDAgPSByYWRpdXMgKiBNYXRoLnNpbiggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgIFx0XHRcdHowID0gcmFkaXVzICogTWF0aC5jb3MoIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChbIHgwLCAwLCB6MCBdKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbnM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbm9ybWFsczogZnVuY3Rpb24oIHNsaWNlcyApIHtcclxuICAgICAgICAgICAgdmFyIG5vcm1hbHMgPSBbXSxcclxuICAgICAgICAgICAgICAgIHNsaWNlQW5nbGUsXHJcbiAgICAgICAgICAgICAgICB4MCwgejAsXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgICAgICAgICBzbGljZUFuZ2xlID0gMiAqIE1hdGguUEkgLyBzbGljZXM7XHJcbiAgICBcdFx0Zm9yICggaT0wOyBpPD1zbGljZXM7IGkrKyApIHtcclxuICAgIFx0XHRcdHgwID0gTWF0aC5zaW4oIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICBcdFx0XHR6MCA9IE1hdGguY29zKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFscy5wdXNoKFsgeDAsIDAsIHowIF0pO1xyXG4gICAgXHRcdH1cclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPD1zbGljZXM7IGkrKyApIHtcclxuICAgIFx0XHRcdHgwID0gTWF0aC5zaW4oIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICBcdFx0XHR6MCA9IE1hdGguY29zKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFscy5wdXNoKFsgeDAsIDAsIHowIF0pO1xyXG4gICAgXHRcdH1cclxuICAgICAgICAgICAgcmV0dXJuIG5vcm1hbHM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXZzOiBmdW5jdGlvbiggc2xpY2VzICkge1xyXG4gICAgICAgICAgICB2YXIgdXZzID0gW10sXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgXHRcdGZvciAoIGk9MDsgaTw9c2xpY2VzOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICB1dnMucHVzaChbIGkgLyBzbGljZXMsIDEgXSk7XHJcbiAgICBcdFx0fVxyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8PXNsaWNlczsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgdXZzLnB1c2goWyBpIC8gc2xpY2VzLCAwIF0pO1xyXG4gICAgXHRcdH1cclxuICAgICAgICAgICAgcmV0dXJuIHV2cztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbmRpY2VzOiBmdW5jdGlvbiggc2xpY2VzICkge1xyXG4gICAgICAgIFx0dmFyIHZlcnRleEluZGV4ID0gMCxcclxuICAgICAgICAgICAgICAgIGluZGljZXMgPSBbXSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICBcdFx0Zm9yICggaT0wOyBpPD1zbGljZXM7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyBzbGljZXMgKyAxICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgc2xpY2VzICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgc2xpY2VzICsgMSApO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIDEgKTtcclxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKTtcclxuICAgICAgICAgICAgICAgIHZlcnRleEluZGV4Kys7XHJcbiAgICBcdFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gaW5kaWNlcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZW9tZXRyeTogZnVuY3Rpb24oIHN0YWNrcywgcmFkaXVzICkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLnBvc2l0aW9ucyggc3RhY2tzLCByYWRpdXMgKSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbHM6IHRoaXMubm9ybWFscyggc3RhY2tzICksXHJcbiAgICAgICAgICAgICAgICB1dnM6IHRoaXMudXZzKCBzdGFja3MgKSxcclxuICAgICAgICAgICAgICAgIGluZGljZXM6IHRoaXMuaW5kaWNlcyggc3RhY2tzICksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBTSVpFID0gMTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgcG9zaXRpb25zOiBmdW5jdGlvbiggc2l6ZSApIHtcclxuICAgICAgICAgICAgc2l6ZSA9IHNpemUgfHwgU0laRTtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgLXNpemUvMiwgIDAgXSxcclxuICAgICAgICAgICAgICAgIFsgc2l6ZS8yLCAtc2l6ZS8yLCAgMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAgc2l6ZS8yLCAgMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAgc2l6ZS8yLCAgMCBdXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbm9ybWFsczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXZzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAxLjAgXVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluZGljZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgMCwgMSwgMiwgMCwgMiwgM1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdlb21ldHJ5OiBmdW5jdGlvbiggc2l6ZSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5wb3NpdGlvbnMoIHNpemUgKSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbHM6IHRoaXMubm9ybWFscygpLFxyXG4gICAgICAgICAgICAgICAgdXZzOiB0aGlzLnV2cygpLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogdGhpcy5pbmRpY2VzKCksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFsZmFkb3IgPSByZXF1aXJlKCdhbGZhZG9yJyksXHJcbiAgICAgICAgVmVjMyA9IGFsZmFkb3IuVmVjMyxcclxuICAgICAgICBWZWMyID0gYWxmYWRvci5WZWMyO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9ydGhvZ29uYWxpemVUYW5nZW50KCBub3JtYWwsIHRhbmdlbnQsIGJpdGFuZ2VudCApIHtcclxuICAgICAgICBub3JtYWwgPSBuZXcgVmVjMyggbm9ybWFsICk7XHJcbiAgICAgICAgLy8gR3JhbS1TY2htaWR0IG9ydGhvZ29uYWxpemVcclxuICAgICAgICB2YXIgbnQgPSBub3JtYWwuZG90KCB0YW5nZW50ICk7XHJcbiAgICAgICAgdGFuZ2VudCA9IHRhbmdlbnQuc3ViKCBub3JtYWwubXVsdCggbnQgKSApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBoYW5kZWRuZXNzXHJcbiAgICAgICAgaWYgKCBub3JtYWwuY3Jvc3MoIHRhbmdlbnQgKS5kb3QoIGJpdGFuZ2VudCApIDwgMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhbmdlbnQubmVnYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YW5nZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldE9yQWRkKCBhcnJheSwgaW5kZXgsIGVudHJ5ICkge1xyXG4gICAgICAgIGlmICggYXJyYXlbIGluZGV4IF0gKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIGVudHJ5IGV4aXN0cywgYWRkIGl0IHRvIGl0XHJcbiAgICAgICAgICAgIGFycmF5WyBpbmRleCBdLmFkZCggZW50cnkgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIHNldCB0aGUgZW50cnlcclxuICAgICAgICAgICAgYXJyYXlbIGluZGV4IF0gPSBuZXcgVmVjMyggZW50cnkgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIGNvbXB1dGVOb3JtYWxzOiBmdW5jdGlvbiggcG9zaXRpb25zLCBpbmRpY2VzICkge1xyXG4gICAgICAgICAgICB2YXIgbm9ybWFscyA9IG5ldyBBcnJheSggcG9zaXRpb25zLmxlbmd0aCApLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgICAgICAgICAgYSwgYiwgYyxcclxuICAgICAgICAgICAgICAgIHAwLCBwMSwgcDIsXHJcbiAgICAgICAgICAgICAgICB1LCB2LFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPGluZGljZXMubGVuZ3RoOyBpKz0zICkge1xyXG4gICAgICAgICAgICAgICAgYSA9IGluZGljZXNbaV07XHJcbiAgICAgICAgICAgICAgICBiID0gaW5kaWNlc1tpKzFdO1xyXG4gICAgICAgICAgICAgICAgYyA9IGluZGljZXNbaSsyXTtcclxuICAgICAgICAgICAgICAgIHAwID0gbmV3IFZlYzMoIHBvc2l0aW9uc1sgYSBdICk7XHJcbiAgICAgICAgICAgICAgICBwMSA9IG5ldyBWZWMzKCBwb3NpdGlvbnNbIGIgXSApO1xyXG4gICAgICAgICAgICAgICAgcDIgPSBuZXcgVmVjMyggcG9zaXRpb25zWyBjIF0gKTtcclxuICAgICAgICAgICAgICAgIHUgPSBwMS5zdWIoIHAwICk7XHJcbiAgICAgICAgICAgICAgICB2ID0gcDIuc3ViKCBwMCApO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gdS5jcm9zcyggdiApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsc1thXSA9IG5vcm1hbDtcclxuICAgICAgICAgICAgICAgIG5vcm1hbHNbYl0gPSBub3JtYWw7XHJcbiAgICAgICAgICAgICAgICBub3JtYWxzW2NdID0gbm9ybWFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNvbXB1dGVUYW5nZW50czogZnVuY3Rpb24oIHBvc2l0aW9ucywgbm9ybWFscywgdXZzLCBpbmRpY2VzICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhbmdlbnRzID0gbmV3IEFycmF5KCBwb3NpdGlvbnMubGVuZ3RoICksXHJcbiAgICAgICAgICAgICAgICBiaXRhbmdlbnRzID0gbmV3IEFycmF5KCBwb3NpdGlvbnMubGVuZ3RoICksXHJcbiAgICAgICAgICAgICAgICBhLCBiLCBjLCByLFxyXG4gICAgICAgICAgICAgICAgcDAsIHAxLCBwMixcclxuICAgICAgICAgICAgICAgIHV2MCwgdXYxLCB1djIsXHJcbiAgICAgICAgICAgICAgICBkZWx0YVBvczEsIGRlbHRhUG9zMixcclxuICAgICAgICAgICAgICAgIGRlbHRhVVYxLCBkZWx0YVVWMixcclxuICAgICAgICAgICAgICAgIHAxdXYyeSwgcDJ1djF5LFxyXG4gICAgICAgICAgICAgICAgcDJ1djF4LCBwMXV2MngsXHJcbiAgICAgICAgICAgICAgICB0YW5nZW50LFxyXG4gICAgICAgICAgICAgICAgdGFuZ2VudDAsXHJcbiAgICAgICAgICAgICAgICB0YW5nZW50MSxcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQyLFxyXG4gICAgICAgICAgICAgICAgYml0YW5nZW50LFxyXG4gICAgICAgICAgICAgICAgaTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxpbmRpY2VzLmxlbmd0aDsgaSs9MyApIHtcclxuICAgICAgICAgICAgICAgIGEgPSBpbmRpY2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgYiA9IGluZGljZXNbaSsxXTtcclxuICAgICAgICAgICAgICAgIGMgPSBpbmRpY2VzW2krMl07XHJcblxyXG4gICAgICAgICAgICAgICAgcDAgPSBuZXcgVmVjMyggcG9zaXRpb25zWyBhIF0gKTtcclxuICAgICAgICAgICAgICAgIHAxID0gbmV3IFZlYzMoIHBvc2l0aW9uc1sgYiBdICk7XHJcbiAgICAgICAgICAgICAgICBwMiA9IG5ldyBWZWMzKCBwb3NpdGlvbnNbIGMgXSApO1xyXG5cclxuICAgICAgICAgICAgICAgIHV2MCA9IG5ldyBWZWMyKCB1dnNbIGEgXSApO1xyXG4gICAgICAgICAgICAgICAgdXYxID0gbmV3IFZlYzIoIHV2c1sgYiBdICk7XHJcbiAgICAgICAgICAgICAgICB1djIgPSBuZXcgVmVjMiggdXZzWyBjIF0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWx0YVBvczEgPSBwMS5zdWIoIHAwICk7XHJcbiAgICAgICAgICAgICAgICBkZWx0YVBvczIgPSBwMi5zdWIoIHAwICk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVsdGFVVjEgPSB1djEuc3ViKCB1djAgKTtcclxuICAgICAgICAgICAgICAgIGRlbHRhVVYyID0gdXYyLnN1YiggdXYwICk7XHJcblxyXG4gICAgICAgICAgICAgICAgciA9IDEgLyAoIGRlbHRhVVYxLnggKiBkZWx0YVVWMi55IC0gZGVsdGFVVjEueSAqIGRlbHRhVVYyLnggKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwMXV2MnkgPSBkZWx0YVBvczEubXVsdCggZGVsdGFVVjIueSApO1xyXG4gICAgICAgICAgICAgICAgcDJ1djF5ID0gZGVsdGFQb3MyLm11bHQoIGRlbHRhVVYxLnkgKTtcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQgPSAoICggcDF1djJ5ICkuc3ViKCBwMnV2MXkgKSApLm11bHQoIHIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwMnV2MXggPSBkZWx0YVBvczIubXVsdCggZGVsdGFVVjEueCApO1xyXG4gICAgICAgICAgICAgICAgcDF1djJ4ID0gZGVsdGFQb3MxLm11bHQoIGRlbHRhVVYyLnggKTtcclxuICAgICAgICAgICAgICAgIGJpdGFuZ2VudCA9ICggKCBwMnV2MXggKS5zdWIoIHAxdXYyeCApICkubXVsdCggciApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB0aGUgdGFuZ2VudCBpcyBvcnRob2dvbmFsIHdpdGggdGhlIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgdGFuZ2VudDAgPSBvcnRob2dvbmFsaXplVGFuZ2VudCggbm9ybWFsc1sgYSBdLCB0YW5nZW50LCBiaXRhbmdlbnQgKTtcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQxID0gb3J0aG9nb25hbGl6ZVRhbmdlbnQoIG5vcm1hbHNbIGIgXSwgdGFuZ2VudCwgYml0YW5nZW50ICk7XHJcbiAgICAgICAgICAgICAgICB0YW5nZW50MiA9IG9ydGhvZ29uYWxpemVUYW5nZW50KCBub3JtYWxzWyBjIF0sIHRhbmdlbnQsIGJpdGFuZ2VudCApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRhbmdlbnRzIG9yIGJpLXRhbmdlbnRzIG1heSBiZSBzaGFyZWQgYnkgbXVsdGlwbGUgdHJpYW5nbGVzLFxyXG4gICAgICAgICAgICAgICAgLy8gaW4gdGhpcyBjYXNlIGFkZCBpdCB0byB0aGUgY3VycmVudCB0YW5nZW50LiBXZSBkb24ndFxyXG4gICAgICAgICAgICAgICAgLy8gbm9ybWFsaXplIGhlcmUgYXMgaXQgZ2l2ZXMgbW9yZSB3ZWlnaHQgdG8gbGFyZ2VyIHRyaWFuZ2xlcy5cclxuICAgICAgICAgICAgICAgIHNldE9yQWRkKCB0YW5nZW50cywgYSwgdGFuZ2VudDAgKTtcclxuICAgICAgICAgICAgICAgIHNldE9yQWRkKCB0YW5nZW50cywgYiwgdGFuZ2VudDEgKTtcclxuICAgICAgICAgICAgICAgIHNldE9yQWRkKCB0YW5nZW50cywgYywgdGFuZ2VudDIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRPckFkZCggYml0YW5nZW50cywgYSwgYml0YW5nZW50ICk7XHJcbiAgICAgICAgICAgICAgICBzZXRPckFkZCggYml0YW5nZW50cywgYiwgYml0YW5nZW50ICk7XHJcbiAgICAgICAgICAgICAgICBzZXRPckFkZCggYml0YW5nZW50cywgYywgYml0YW5nZW50ICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIG5vdyB3ZSBub3JtYWxpemUgdGhlIHRhbmdlbnRzIGFuZCBiaS10YW5nZW50c1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8dGFuZ2VudHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICB0YW5nZW50c1tpXSA9IHRhbmdlbnRzW2ldLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgYml0YW5nZW50c1tpXSA9IGJpdGFuZ2VudHNbaV0ubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0YW5nZW50czogdGFuZ2VudHMsXHJcbiAgICAgICAgICAgICAgICBiaXRhbmdlbnRzOiBiaXRhbmdlbnRzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBTTElDRVMgPSAyMCxcclxuICAgICAgICBTVEFDS1MgPSAyMCxcclxuICAgICAgICBSQURJVVMgPSAxO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBwb3NpdGlvbnM6IGZ1bmN0aW9uKCBzbGljZXMsIHN0YWNrcywgcmFkaXVzICkge1xyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gW10sXHJcbiAgICAgICAgICAgICAgICBzdGFja0FuZ2xlLFxyXG4gICAgICAgICAgICAgICAgc2xpY2VBbmdsZSxcclxuICAgICAgICAgICAgICAgIHIwLCB5MCwgeDAsIHowLFxyXG4gICAgICAgICAgICAgICAgaSwgajtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgICAgICAgICAgc3RhY2tzID0gc3RhY2tzIHx8IFNUQUNLUztcclxuICAgICAgICAgICAgcmFkaXVzID0gcmFkaXVzIHx8IFJBRElVUztcclxuICAgICAgICAgICAgc3RhY2tBbmdsZSA9IE1hdGguUEkgLyBzdGFja3M7XHJcbiAgICAgICAgXHRzbGljZUFuZ2xlID0gMiAqIE1hdGguUEkgLyBzbGljZXM7XHJcbiAgICAgICAgXHRmb3IgKCBpPTA7IGk8PXN0YWNrczsgaSsrICkge1xyXG4gICAgICAgIFx0XHRyMCA9IHJhZGl1cyAqIE1hdGguc2luKCBpICogc3RhY2tBbmdsZSApO1xyXG4gICAgICAgIFx0XHR5MCA9IHJhZGl1cyAqIE1hdGguY29zKCBpICogc3RhY2tBbmdsZSApO1xyXG4gICAgICAgIFx0XHRmb3IgKCBqPTA7IGo8PXNsaWNlczsgaisrICkge1xyXG4gICAgICAgIFx0XHRcdHgwID0gcjAgKiBNYXRoLnNpbiggaiAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICBcdFx0XHR6MCA9IHIwICogTWF0aC5jb3MoIGogKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zLnB1c2goWyB4MCwgeTAsIHowIF0pO1xyXG4gICAgICAgIFx0XHR9XHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbnM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbm9ybWFsczogZnVuY3Rpb24oIHNsaWNlcywgc3RhY2tzICkge1xyXG4gICAgICAgICAgICB2YXIgbm9ybWFscyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tBbmdsZSxcclxuICAgICAgICAgICAgICAgIHNsaWNlQW5nbGUsXHJcbiAgICAgICAgICAgICAgICByMCwgeTAsIHgwLCB6MCxcclxuICAgICAgICAgICAgICAgIGksIGo7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICAgICAgICAgIHN0YWNrcyA9IHN0YWNrcyB8fCBTVEFDS1M7XHJcbiAgICAgICAgICAgIHN0YWNrQW5nbGUgPSBNYXRoLlBJIC8gc3RhY2tzO1xyXG4gICAgICAgIFx0c2xpY2VBbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2xpY2VzO1xyXG4gICAgICAgIFx0Zm9yICggaT0wOyBpPD1zdGFja3M7IGkrKyApIHtcclxuICAgICAgICBcdFx0cjAgPSBNYXRoLnNpbiggaSAqIHN0YWNrQW5nbGUgKTtcclxuICAgICAgICBcdFx0eTAgPSBNYXRoLmNvcyggaSAqIHN0YWNrQW5nbGUgKTtcclxuICAgICAgICBcdFx0Zm9yICggaj0wOyBqPD1zbGljZXM7IGorKyApIHtcclxuICAgICAgICBcdFx0XHR4MCA9IHIwICogTWF0aC5zaW4oIGogKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgXHRcdFx0ejAgPSByMCAqIE1hdGguY29zKCBqICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbHMucHVzaChbIHgwLCB5MCwgejAgXSk7XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuICAgICAgICAgICAgcmV0dXJuIG5vcm1hbHM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdXZzOiBmdW5jdGlvbiggc2xpY2VzLCBzdGFja3MgKSB7XHJcbiAgICAgICAgICAgIHZhciB1dnMgPSBbXSxcclxuICAgICAgICAgICAgICAgIGksIGo7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICAgICAgICAgIHN0YWNrcyA9IHN0YWNrcyB8fCBTVEFDS1M7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTw9c3RhY2tzOyBpKysgKSB7XHJcbiAgICAgICAgXHRcdGZvciAoIGo9MDsgajw9c2xpY2VzOyBqKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXZzLnB1c2goWyBqIC8gc2xpY2VzLCAxLShpIC8gc3RhY2tzKSBdKTtcclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gdXZzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluZGljZXM6IGZ1bmN0aW9uKCBzbGljZXMsIHN0YWNrcyApIHtcclxuICAgICAgICBcdHZhciB2ZXJ0ZXhJbmRleCA9IDAsXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzID0gW10sXHJcbiAgICAgICAgICAgICAgICBpLCBqO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgICAgICAgICBzdGFja3MgPSBzdGFja3MgfHwgU1RBQ0tTO1xyXG4gICAgICAgIFx0Zm9yICggaT0wOyBpPD1zdGFja3M7IGkrKyApIHtcclxuICAgICAgICBcdFx0Zm9yICggaj0wOyBqPD1zbGljZXM7IGorKyApIHtcclxuICAgICAgICBcdFx0XHRpZiAoIGkgIT09IHN0YWNrcyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIHNsaWNlcyArIDEgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgc2xpY2VzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyBzbGljZXMgKyAxICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyAxICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4SW5kZXgrKztcclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuICAgICAgICAgICAgcmV0dXJuIGluZGljZXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2VvbWV0cnk6IGZ1bmN0aW9uKCBzbGljZXMsIHN0YWNrcywgcmFkaXVzICkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLnBvc2l0aW9ucyggc2xpY2VzLCBzdGFja3MsIHJhZGl1cyApLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsczogdGhpcy5ub3JtYWxzKCBzbGljZXMsIHN0YWNrcyApLFxyXG4gICAgICAgICAgICAgICAgdXZzOiB0aGlzLnV2cyggc2xpY2VzLCBzdGFja3MgKSxcclxuICAgICAgICAgICAgICAgIGluZGljZXM6IHRoaXMuaW5kaWNlcyggc2xpY2VzLCBzdGFja3MgKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIl19
