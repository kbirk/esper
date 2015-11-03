(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.esper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Vec3":7,"./Vec4":8}],2:[function(require,module,exports){
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
     * Returns an orthographic projection matrix.
     *
     * @param {number} left - The minimum x extent of the projection.
     * @param {number} right - The maximum x extent of the projection.
     * @param {number} bottom - The minimum y extent of the projection.
     * @param {number} top - The maximum y extent of the projection.
     * @param {number} near - The minimum z extent of the projection.
     * @param {number} far - The maximum z extent of the projection.
     *
     * @returns {Mat44} The orthographic projection matrix.
     */
    Mat44.ortho = function( left, right, bottom, top, near, far ) {
        var mat = Mat44.identity();
        mat.data[0] = 2 / ( right - left );
        mat.data[5] = 2 / ( top - bottom );
        mat.data[10] = -2 / ( far - near );
        mat.data[12] = -( ( right + left ) / ( right - left ) );
        mat.data[13] = -( ( top + bottom ) / ( top - bottom ) );
        mat.data[14] = -( ( far + near ) / ( far - near ) );
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

},{"./Mat33":1,"./Vec3":7,"./Vec4":8}],3:[function(require,module,exports){
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
        // cosHalfTheta must be positive to return the shortest angle
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

},{"./Mat33":1,"./Vec3":7}],4:[function(require,module,exports){
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

},{"./Mat33":1,"./Mat44":2,"./Vec3":7}],5:[function(require,module,exports){
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
     * Returns the area of the triangle.
     * @memberof Triangle
     *
     * @returns {number} The area of the triangle.
     */
    Triangle.prototype.area = function() {
        var ab = this.b.sub( this.a ),
            ac = this.c.sub( this.a );
        return ab.cross( ac ).length();
    };

    /**
     * Returns the given edge of the triangle.
     * @memberof Triangle
     *
     * @param {string} edgeId - The id string for the edge. ex 'ab'
     *
     * @returns {number} The specified edge of the triangle.
     */
    Triangle.prototype.edge = function( edgeId ) {
        switch ( edgeId.toLowerCase() ) {
            case "ab":
                return this.b.sub( this.a );
            case "ac":
                return this.c.sub( this.a );
            case "ba":
                return this.a.sub( this.b );
            case "bc":
                return this.c.sub( this.b );
            case "ca":
                return this.a.sub( this.c );
            case "cb":
                return this.b.sub( this.c );
        }
        console.warn( "Unrecognized edge id '" + edgeId + "', returning 'null'." );
        return null;
    };

    /**
     * Returns true if the point is inside the triangle. The point must be
     * coplanar.
     * @memberof Triangle
     *
     * @param {Vec3|Array} point - The point to test.
     *
     * @returns {boolean} Whether or not the point is inside the triangle.
     */
    Triangle.prototype.isInside = function( point ) {
        var p = new Vec3( point ),
            a = this.a,
            b = this.b,
            c = this.c,
            normal = this.normal();
        // compute barycentric coords
        var totalAreaDiv = 1 / b.sub( a ).cross( c.sub( a ) ).dot( normal );
        var u = c.sub( b ).cross( p.sub( b ) ).dot( normal ).mult( totalAreaDiv );
        var v = a.sub( c ).cross( p.sub( c ) ).dot( normal ).mult( totalAreaDiv );
        // reject if outside triangle
        if ( u < 0 || v < 0 || u + v > 1 ) {
            return false;
        }
        return true;
    };

    /**
     * Intersect the triangle and return intersection information.
     * @memberof Triangle
     *
     * @param {Vec3|Array} origin - The origin of the intersection ray
     * @param {Vec3|Array} direction - The direction of the intersection ray.
     * @param {boolean} ignoreBehind - Whether or not to ignore intersections behind the origin of the ray.
     * @param {boolean} ignoreBackface - Whether or not to ignore the backface of the triangle.
     *
     * @returns {Object|boolean} The intersection information, or false if there is no intersection.
     */
    Triangle.prototype.intersect = function( origin, direction, ignoreBehind, ignoreBackface ) {
        // Compute ray/plane intersection
        var o = new Vec3( origin ),
            d = new Vec3( direction ),
            normal = this.normal();
        var dn = new Vec3( d ).dot( normal );
        if ( dn === 0 || ( ignoreBackface && dn > 0 ) ) {
            // ray is parallel to plane, or coming from behind
            return false;
        }
        var t = this.a.sub( o ).dot( normal ) / dn;
        if ( ignoreBehind && t < 0 ) {
            // plane is behind ray
            return false;
        }
        var intersection = o.add( d.mult( t ) );
        // check if point is inside the triangle
        if ( !this.isInside( intersection ) ) {
           return false;
        }
        return {
            intersection: intersection,
            normal: normal,
            t: t
        };
    };

    /**
     * Returns the closest point on the specified edge of the triangle to the
     * specified point.
     * @memberof Triangle
     *
     * @param {string} edge - The edge id to find the closest point on.
     * @param {Vec3|Array} point - The point to test.
     *
     * @returns {Vec3} The closest point on the edge.
     */
    Triangle.prototype.closestPointOnEdge = function( edge, point ) {
        var a = this[ edge[0] ],
            ab = this.edge( edge );
        // project c onto ab, computing parameterized position d(t) = a + t*(b * a)
        var t = new Vec3( point ).sub( a ).dot( ab ) / ab.dot( ab );
        // If outside segment, clamp t (and therefore d) to the closest endpoint
        if ( t < 0 ) {
            t = 0;
        }
        if ( t > 1 ) {
            t = 1;
        }
        // compute projected position from the clamped t
        return a.plus( ab.mult( t ) );
    };

    /**
     * Returns the closest point on the triangle to the specified point.
     * @memberof Triangle
     *
     * @param {Vec3|Array} point - The point to test.
     *
     * @returns {Vec3} The closest point on the edge.
     */
    Triangle.prototype.closestPoint = function( point ) {
        var e0 = this.closestPointOnEdge( 'ab', point );
        var e1 = this.closestPointOnEdge( 'bc', point );
        var e2 = this.closestPointOnEdge( 'ca', point );
        var d0 = ( e0 - point ).lengthSquared();
        var d1 = ( e1 - point ).lengthSquared();
        var d2 = ( e2 - point ).lengthSquared();
        if ( d0 < d1 ) {
            return ( d0 < d2 ) ? e0 : e2;
        } else {
            return ( d1 < d2 ) ? e1 : e2;
        }
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

},{"./Vec3":7}],6:[function(require,module,exports){
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
     * Returns the unsigned angle between this angle and the argument in radians.
     * @memberof Vec2
     *
     * @param {Vec2|Vec3|Vec4|Array} that - The vector to measure the angle from.
     *
     * @returns {number} The unsigned angle in radians.
     */
    Vec2.prototype.unsignedAngleRadians = function( that ) {
        var x = that.x !== undefined ? that.x : that[0];
        var y = that.y !== undefined ? that.y : that[1];
        var angle = Math.atan2( y, x ) - Math.atan2( this.y, this.x );
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    };

    /**
     * Returns the unsigned angle between this angle and the argument in degrees.
     * @memberof Vec2
     *
     * @param {Vec2|Vec3|Vec4|Array} that - The vector to measure the angle from.
     *
     * @returns {number} The unsigned angle in degrees.
     */
    Vec2.prototype.unsignedAngleDegrees = function( that ) {
        return this.unsignedAngleRadians( that ) * ( 180 / Math.PI );
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

},{}],7:[function(require,module,exports){
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
     * Returns the unsigned angle between this angle and the argument in radians.
     * @memberof Vec3
     *
     * @param {Vec3|Vec4|Array} that - The vector to measure the angle from.
     * @param {Vec3|Vec4|Array} normal - The reference vector to measure the
     *                              direction of the angle. If not provided will
     *                              use a.cross( b ). (Optional)
     *
     * @returns {number} The unsigned angle in radians.
     */
    Vec3.prototype.unsignedAngleRadians = function( that, normal ) {
        var a = this.normalize();
        var b = new Vec3( that ).normalize();
        var dot = a.dot( b );
        var ndot = Math.max( -1, Math.min( 1, dot ) );
        var angle = Math.acos( ndot );
        var cross = a.cross( b );
        var n = new Vec3( normal || cross );

        //var cross = this.cross( that );
        //var angle = Math.atan2( cross.length(), this.dot( that ) );

        if ( n.dot( cross ) < 0 ) {
            if ( angle >= Math.PI * 0.5 ) {
                angle = Math.PI + Math.PI - angle;
            } else {
                angle = 2 * Math.PI - angle;
            }
        }
        return angle;
    };

    /**
     * Returns the unsigned angle between this angle and the argument in degrees.
     * @memberof Vec3
     *
     * @param {Vec3|Vec4|Array} that - The vector to measure the angle from.
     *
     * @returns {number} The unsigned angle in degrees.
     */
    Vec3.prototype.unsignedAngleDegrees = function( that, normal ) {
        return this.unsignedAngleRadians( that, normal ) * ( 180 / Math.PI );
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./Mat33":1,"./Mat44":2,"./Quaternion":3,"./Transform":4,"./Triangle":5,"./Vec2":6,"./Vec3":7}],10:[function(require,module,exports){
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

},{"_process":11}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
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

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"../render/Camera":26,"./RenderTarget":15,"./Texture2D":18,"./TextureCubeMap":19,"./Viewport":22,"./WebGLContext":23}],14:[function(require,module,exports){
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
     * @param {Object} options - The options to pass to 'drawElements'. Optional.
     *
     * @returns {IndexBuffer} Returns the index buffer object for chaining.
     */
    IndexBuffer.prototype.draw = function( options ) {
        options = options || {};
        if ( _boundBuffer === null ) {
            console.warn( "No IndexBuffer is bound, command ignored." );
            return;
        }
        var gl = this.gl;
        var mode = gl[ options.mode ] || gl[ this.mode ];
        var offset = options.offset !== undefined ? options.offset : this.offset;
        var count = options.count !== undefined ? options.count : this.count;
        gl.drawElements(
            mode,
            count,
            gl[ this.type ],
            offset );
        return this;
    };

    module.exports = IndexBuffer;

}());

},{"./WebGLContext":23}],15:[function(require,module,exports){
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

},{"../util/Stack":40,"./WebGLContext":23}],16:[function(require,module,exports){
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
                    success: done,
                    error: function(err) {
                        console.error( err );
                        done( null );
                    }
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
            if ( !this.hasLoggedError ) {
                console.warn("Attempting to use an incomplete shader, ignoring command.");
                this.hasLoggedError = true;
            }
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

},{"../util/Stack":40,"../util/Util":41,"../util/XHRLoader":42,"./ShaderParser":17,"./WebGLContext":23}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"../util/Stack":40,"../util/Util":41,"./WebGLContext":23}],19:[function(require,module,exports){
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

},{"../util/Stack":40,"../util/Util":41,"./WebGLContext":23}],20:[function(require,module,exports){
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

    VertexBuffer.prototype.draw = function( options ) {
        options = options || {};
        if ( !options.count ) {
            console.warn('Count must be defined, ignoring command.');
            return;
        }
        var gl = this.gl;
        var mode = gl[ options.mode.toUpperCase() ] || gl.POINTS;
        var offset = options.offset !== undefined ? options.offset : 0;    
        var count = options.count;
        gl.drawArrays(
            mode, // primitive type
            offset, // offset
            count ); // count
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

},{"../util/Util":41,"./VertexPackage":21,"./WebGLContext":23}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
        this.gl = WebGLContext.get();
        this.resize(
            spec.width || window.innerWidth,
            spec.height || window.innerHeight );
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

},{"../util/Stack":40,"./WebGLContext":23}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./core/CubeMapRenderTarget":13,"./core/IndexBuffer":14,"./core/RenderTarget":15,"./core/Shader":16,"./core/Texture2D":18,"./core/TextureCubeMap":19,"./core/VertexBuffer":20,"./core/VertexPackage":21,"./core/Viewport":22,"./core/WebGLContext":23,"./render/Camera":26,"./render/Entity":27,"./render/Geometry":28,"./render/Joint":29,"./render/Material":30,"./render/Mesh":31,"./render/Octree":32,"./render/RenderPass":33,"./render/RenderTechnique":34,"./render/Renderable":35,"./render/Renderer":36,"./render/Skeleton":37,"./render/Sprite":38,"./util/Util":41,"./util/debug/Debug":43,"./util/gltf/glTFLoader":45,"./util/obj/OBJMTLLoader":53,"./util/shapes/Cube":54,"./util/shapes/Cylinder":55,"./util/shapes/Quad":56,"./util/shapes/ShapeUtil":57,"./util/shapes/Sphere":58,"alfador":9}],25:[function(require,module,exports){
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

},{"./Entity":27,"alfador":9}],27:[function(require,module,exports){
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

},{"./Animation":25,"./Mesh":31,"./Skeleton":37,"./Sprite":38,"alfador":9}],28:[function(require,module,exports){
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

},{"../core/Texture2D":18}],31:[function(require,module,exports){
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

},{"./Entity":27,"./Mesh":31,"alfador":9}],33:[function(require,module,exports){
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
            // use existing index buffer
            this.indexBuffer = spec.indexBuffer;
        } else {
            if ( spec.indices ) {
                // create index buffer
                this.indexBuffer = new IndexBuffer( spec.indices, spec.options );
            }
        }
        return this;
    }

    Renderable.prototype.draw = function( options ) {
        if ( this.indexBuffer ) {
            // use index buffer to draw elements
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
                // no advantage to unbinding as there is no stack used
            });
            this.indexBuffer.bind();
            this.indexBuffer.draw( options );
            // no advantage to unbinding as there is no stack used
        } else {
            // no index buffer, use draw arrays
            this.vertexBuffers.forEach( function( vertexBuffer ) {
                vertexBuffer.bind();
                vertexBuffer.draw( options.count, options );
                // no advantage to unbinding as there is no stack used
            });
        }
        return this;
    };

    module.exports = Renderable;

}());

},{"../core/IndexBuffer":14,"../core/VertexBuffer":20,"../core/VertexPackage":21}],36:[function(require,module,exports){
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

},{"alfador":9}],38:[function(require,module,exports){
(function () {

    "use strict";

    var Renderable = require('./Renderable'),
        Geometry = require('./Geometry'),
        SpriteAnimation = require('./SpriteAnimation'),
        Quad = require('../util/shapes/Quad'),
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
        this.animations = {};
        if ( spec.animations ) {
            for ( var key in spec.animations ) {
                if ( spec.animations.hasOwnProperty( key ) ) {
                    this.addAnimation( key, spec.animations[ key ] );
                }
            }
        }
    }

    Sprite.prototype.addAnimation = function( animationId, animation ) {
        if ( animation instanceof SpriteAnimation ) {
            this.animations[ animationId ] = animation;
        } else {
            this.animations[ animationId ] = new SpriteAnimation( animation );
        }
    };

    Sprite.prototype.getFrame = function( animationId, timestamp ) {
        var animation = this.animations[ animationId ];
        if ( !animation ) {
            console.warn( 'Animation of id"' + animationId + '" does not exist, returning null.' );
            return null;
        }
        return animation.getFrame( timestamp );
    };

    Sprite.prototype.draw = function() {
        this.renderable.draw();
        return this;
    };

    module.exports = Sprite;

}());

},{"../util/shapes/Quad":56,"./Geometry":28,"./Renderable":35,"./SpriteAnimation":39}],39:[function(require,module,exports){
(function () {

    "use strict";

    function getFrameTimestamp( frames, frameIndex ) {
        var frame = frames[ frameIndex ];
        if ( frame ) {
            return frame.timestamp || ( frameIndex / frames.length );
        }
        return null;
    }

    function SpriteAnimation( spec ) {
        spec = spec || {};
        var that = this;
        this.frames = [];
        if ( spec.frames ) {
            spec.frames.forEach( function( frame ) {
                that.addFrame( frame );
            });
        }
        this.shouldLoop = spec.shouldLoop !== undefined ? spec.shouldLoop : false;
        return this;
    }

    SpriteAnimation.prototype.addFrame = function( frame ) {
        var that = this;
        this.frames.push({
            channels: [],
            timestamp: frame.timestamp
        });
        if ( frame.channels ) {
            frame.channels.forEach( function( channel ) {
                that.addChannel( channel, that.frames.length - 1 );
            });
        } else if ( frame.texture ) {
            this.addChannel( frame, that.frames.length - 1 );
        }
    };

    SpriteAnimation.prototype.addChannel = function( channel, frameIndex ) {
        this.frames[ frameIndex ].channels.push({
            texture: channel.texture,
            x: channel.x !== undefined ? channel.x : 0,
            y: channel.y !== undefined ? channel.y : 0,
            width: channel.width !== undefined ? channel.width : channel.texture.width,
            height: channel.height !== undefined ? channel.height : channel.texture.height,
            origin: {
                x: channel.origin.x,
                y: channel.origin.y
            },
            flipX: channel.flipX !== undefined ? channel.flipX : false,
            scale: channel.scale || { x: 1, y: 1 },
            rotation: channel.rotation !== undefined ? channel.rotation : 0
        });
    };

    SpriteAnimation.prototype.getFrame = function( timestamp ) {
        if ( this.shouldLoop ) {
            timestamp = timestamp % 1;
        }
        var frameTimestamp = getFrameTimestamp( this.frames, 0 ),
            i = 0;
        while ( frameTimestamp !== null && frameTimestamp <= timestamp ) {
            frameTimestamp = getFrameTimestamp( this.frames, ++i );
        }
        return this.frames[ i - 1 ];
    };

    module.exports = SpriteAnimation;

}());

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"simply-deferred":12}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{"../../core/Shader":16,"../../render/Entity":27,"../../render/Mesh":31,"../../render/RenderPass":33,"../../render/RenderTechnique":34,"../../render/Renderer":36,"../shapes/Quad":56}],44:[function(require,module,exports){
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

},{"alfador":9}],45:[function(require,module,exports){
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

},{"../../render/Entity":27,"../Util":41,"./glTFAnimation":44,"./glTFMaterial":46,"./glTFMesh":47,"./glTFParser":48,"./glTFSkeleton":49,"./glTFUtil":50,"path":10}],46:[function(require,module,exports){
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

},{"../../core/Texture2D":18,"../../render/Material":30,"../Util":41,"./glTFUtil":50}],47:[function(require,module,exports){
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

},{"../../core/IndexBuffer":14,"../../core/VertexBuffer":20,"../../core/WebGLContext":23,"../../render/Mesh":31}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{"../../render/Joint":29,"../../render/Skeleton":37,"./glTFUtil":50,"alfador":9}],50:[function(require,module,exports){
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
                            },
                            error: function(err) {
                                console.error( err );
                                done( null );
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

},{"../Util":41,"../XHRLoader":42,"alfador":9}],51:[function(require,module,exports){
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
                    },
                    error: function(err) {
                        console.error( err );
                        callback( null );
                    }
                });
        }
    };

}());

},{"../Util":41,"../XHRLoader":42,"path":10}],52:[function(require,module,exports){
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
                    },
                    error: function(err) {
                        console.error( err );
                        callback( null );
                    }
                });
        }

     };

}());

},{"../XHRLoader":42}],53:[function(require,module,exports){
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

},{"../Util":41,"./MTLLoader":51,"./OBJLoader":52,"path":10}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{"alfador":9}],58:[function(require,module,exports){
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

},{}]},{},[24])(24)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvTWF0MzMuanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvTWF0NDQuanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvUXVhdGVybmlvbi5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9UcmFuc2Zvcm0uanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvVHJpYW5nbGUuanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvVmVjMi5qcyIsIm5vZGVfbW9kdWxlcy9hbGZhZG9yL3NyYy9WZWMzLmpzIiwibm9kZV9tb2R1bGVzL2FsZmFkb3Ivc3JjL1ZlYzQuanMiLCJub2RlX21vZHVsZXMvYWxmYWRvci9zcmMvZXhwb3J0cy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBseS1kZWZlcnJlZC9kZWZlcnJlZC5qcyIsInNyYy9jb3JlL0N1YmVNYXBSZW5kZXJUYXJnZXQuanMiLCJzcmMvY29yZS9JbmRleEJ1ZmZlci5qcyIsInNyYy9jb3JlL1JlbmRlclRhcmdldC5qcyIsInNyYy9jb3JlL1NoYWRlci5qcyIsInNyYy9jb3JlL1NoYWRlclBhcnNlci5qcyIsInNyYy9jb3JlL1RleHR1cmUyRC5qcyIsInNyYy9jb3JlL1RleHR1cmVDdWJlTWFwLmpzIiwic3JjL2NvcmUvVmVydGV4QnVmZmVyLmpzIiwic3JjL2NvcmUvVmVydGV4UGFja2FnZS5qcyIsInNyYy9jb3JlL1ZpZXdwb3J0LmpzIiwic3JjL2NvcmUvV2ViR0xDb250ZXh0LmpzIiwic3JjL2V4cG9ydHMuanMiLCJzcmMvcmVuZGVyL0FuaW1hdGlvbi5qcyIsInNyYy9yZW5kZXIvQ2FtZXJhLmpzIiwic3JjL3JlbmRlci9FbnRpdHkuanMiLCJzcmMvcmVuZGVyL0dlb21ldHJ5LmpzIiwic3JjL3JlbmRlci9Kb2ludC5qcyIsInNyYy9yZW5kZXIvTWF0ZXJpYWwuanMiLCJzcmMvcmVuZGVyL01lc2guanMiLCJzcmMvcmVuZGVyL09jdHJlZS5qcyIsInNyYy9yZW5kZXIvUmVuZGVyUGFzcy5qcyIsInNyYy9yZW5kZXIvUmVuZGVyVGVjaG5pcXVlLmpzIiwic3JjL3JlbmRlci9SZW5kZXJhYmxlLmpzIiwic3JjL3JlbmRlci9SZW5kZXJlci5qcyIsInNyYy9yZW5kZXIvU2tlbGV0b24uanMiLCJzcmMvcmVuZGVyL1Nwcml0ZS5qcyIsInNyYy9yZW5kZXIvU3ByaXRlQW5pbWF0aW9uLmpzIiwic3JjL3V0aWwvU3RhY2suanMiLCJzcmMvdXRpbC9VdGlsLmpzIiwic3JjL3V0aWwvWEhSTG9hZGVyLmpzIiwic3JjL3V0aWwvZGVidWcvRGVidWcuanMiLCJzcmMvdXRpbC9nbHRmL2dsVEZBbmltYXRpb24uanMiLCJzcmMvdXRpbC9nbHRmL2dsVEZMb2FkZXIuanMiLCJzcmMvdXRpbC9nbHRmL2dsVEZNYXRlcmlhbC5qcyIsInNyYy91dGlsL2dsdGYvZ2xURk1lc2guanMiLCJzcmMvdXRpbC9nbHRmL2dsVEZQYXJzZXIuanMiLCJzcmMvdXRpbC9nbHRmL2dsVEZTa2VsZXRvbi5qcyIsInNyYy91dGlsL2dsdGYvZ2xURlV0aWwuanMiLCJzcmMvdXRpbC9vYmovTVRMTG9hZGVyLmpzIiwic3JjL3V0aWwvb2JqL09CSkxvYWRlci5qcyIsInNyYy91dGlsL29iai9PQkpNVExMb2FkZXIuanMiLCJzcmMvdXRpbC9zaGFwZXMvQ3ViZS5qcyIsInNyYy91dGlsL3NoYXBlcy9DeWxpbmRlci5qcyIsInNyYy91dGlsL3NoYXBlcy9RdWFkLmpzIiwic3JjL3V0aWwvc2hhcGVzL1NoYXBlVXRpbC5qcyIsInNyYy91dGlsL3NoYXBlcy9TcGhlcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSggJy4vVmVjMycgKSxcclxuICAgICAgICBWZWM0ID0gcmVxdWlyZSggJy4vVmVjNCcgKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIE1hdDMzIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBNYXQzM1xyXG4gICAgICogQGNsYXNzZGVzYyBBIDN4MyBjb2x1bW4tbWFqb3IgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBNYXQzMyggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhhdC5kYXRhIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoYXQuZGF0YS5sZW5ndGggPT09IDkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29weSBNYXQzMyBkYXRhIGJ5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhhdC5kYXRhLnNsaWNlKCAwICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgTWF0NDQgZGF0YSBieSB2YWx1ZSwgYWNjb3VudCBmb3IgaW5kZXggZGlmZmVyZW5jZXNcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVswXSwgdGhhdC5kYXRhWzFdLCB0aGF0LmRhdGFbMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVs0XSwgdGhhdC5kYXRhWzVdLCB0aGF0LmRhdGFbNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVs4XSwgdGhhdC5kYXRhWzldLCB0aGF0LmRhdGFbMTBdIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRoYXQubGVuZ3RoID09PSA5ICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29weSBhcnJheSBieSB2YWx1ZSwgdXNlIHByb3RvdHlwZSB0byBjYXN0IGFycmF5IGJ1ZmZlcnNcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0MzMuaWRlbnRpdHkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXQzMy5pZGVudGl0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBjb2x1bW4gb2YgdGhlIG1hdHJpeCBhcyBhIFZlYzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIDAtYmFzZWQgY29sdW1uIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgY29sdW1uIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLnJvdyA9IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVswK2luZGV4XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzMraW5kZXhdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNitpbmRleF0gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcm93IG9mIHRoZSBtYXRyaXggYXMgYSBWZWMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSAwLWJhc2VkIHJvdyBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIGNvbHVtbiB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5jb2wgPSBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMCtpbmRleCozXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEraW5kZXgqM10sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsyK2luZGV4KjNdICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaWRlbnRpdHkgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgaWRlbnRpeSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLmlkZW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQzMyhbIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHNjYWxlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheXxudW1iZXJ9IHNjYWxlIC0gVGhlIHNjYWxhciBvciB2ZWN0b3Igc2NhbGluZyBmYWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgc2NhbGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5zY2FsZSA9IGZ1bmN0aW9uKCBzY2FsZSApIHtcclxuICAgICAgICBpZiAoIHR5cGVvZiBzY2FsZSA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXQzMyhbXHJcbiAgICAgICAgICAgICAgICBzY2FsZSwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIHNjYWxlLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgc2NhbGUgXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggc2NhbGUgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXQzMyhbXHJcbiAgICAgICAgICAgICAgICBzY2FsZVswXSwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIHNjYWxlWzFdLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgc2NhbGVbMl0gXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTWF0MzMoW1xyXG4gICAgICAgICAgICBzY2FsZS54LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCBzY2FsZS55LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCBzY2FsZS56IF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggZGVmaW5lZCBieSBhbiBheGlzIGFuZCBhbiBhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIGRlZ3JlZXMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgcm90YXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5yb3RhdGlvbkRlZ3JlZXMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRpb25SYWRpYW5zKCBhbmdsZSpNYXRoLlBJLzE4MCwgYXhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggZGVmaW5lZCBieSBhbiBheGlzIGFuZCBhbiBhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIHJhZGlhbnMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgcm90YXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5yb3RhdGlvblJhZGlhbnMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgaWYgKCBheGlzIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIGF4aXMgPSBuZXcgVmVjMyggYXhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB6ZXJvIHZlY3RvciwgcmV0dXJuIGlkZW50aXR5XHJcbiAgICAgICAgaWYgKCBheGlzLmxlbmd0aFNxdWFyZWQoKSA9PT0gMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5vcm1BeGlzID0gYXhpcy5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgeCA9IG5vcm1BeGlzLngsXHJcbiAgICAgICAgICAgIHkgPSBub3JtQXhpcy55LFxyXG4gICAgICAgICAgICB6ID0gbm9ybUF4aXMueixcclxuICAgICAgICAgICAgbW9kQW5nbGUgPSAoIGFuZ2xlID4gMCApID8gYW5nbGUgJSAoMipNYXRoLlBJKSA6IGFuZ2xlICUgKC0yKk1hdGguUEkpLFxyXG4gICAgICAgICAgICBzID0gTWF0aC5zaW4oIG1vZEFuZ2xlICksXHJcbiAgICAgICAgICAgIGMgPSBNYXRoLmNvcyggbW9kQW5nbGUgKSxcclxuICAgICAgICAgICAgeHggPSB4ICogeCxcclxuICAgICAgICAgICAgeXkgPSB5ICogeSxcclxuICAgICAgICAgICAgenogPSB6ICogeixcclxuICAgICAgICAgICAgeHkgPSB4ICogeSxcclxuICAgICAgICAgICAgeXogPSB5ICogeixcclxuICAgICAgICAgICAgenggPSB6ICogeCxcclxuICAgICAgICAgICAgeHMgPSB4ICogcyxcclxuICAgICAgICAgICAgeXMgPSB5ICogcyxcclxuICAgICAgICAgICAgenMgPSB6ICogcyxcclxuICAgICAgICAgICAgb25lX2MgPSAxLjAgLSBjO1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0MzMoW1xyXG4gICAgICAgICAgICAob25lX2MgKiB4eCkgKyBjLCAob25lX2MgKiB4eSkgKyB6cywgKG9uZV9jICogengpIC0geXMsXHJcbiAgICAgICAgICAgIChvbmVfYyAqIHh5KSAtIHpzLCAob25lX2MgKiB5eSkgKyBjLCAob25lX2MgKiB5eikgKyB4cyxcclxuICAgICAgICAgICAgKG9uZV9jICogengpICsgeXMsIChvbmVfYyAqIHl6KSAtIHhzLCAob25lX2MgKiB6eikgKyBjXHJcbiAgICAgICAgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdGF0aW9uIG1hdHJpeCB0byByb3RhdGUgYSB2ZWN0b3IgZnJvbSBvbmUgZGlyZWN0aW9uIHRvXHJcbiAgICAgKiBhbm90aGVyLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBmcm9tIC0gVGhlIHN0YXJ0aW5nIGRpcmVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gdG8gLSBUaGUgZW5kaW5nIGRpcmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSBtYXRyaXggcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbi5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucm90YXRpb25Gcm9tVG8gPSBmdW5jdGlvbiggZnJvbVZlYywgdG9WZWMgKSB7XHJcbiAgICAgICAgLypCdWlsZHMgdGhlIHJvdGF0aW9uIG1hdHJpeCB0aGF0IHJvdGF0ZXMgb25lIHZlY3RvciBpbnRvIGFub3RoZXIuXHJcblxyXG4gICAgICAgIFRoZSBnZW5lcmF0ZWQgcm90YXRpb24gbWF0cml4IHdpbGwgcm90YXRlIHRoZSB2ZWN0b3IgZnJvbSBpbnRvXHJcbiAgICAgICAgdGhlIFZlY3RvcjM8dmFyPiB0by4gZnJvbSBhbmQgdG8gbXVzdCBiZSB1bml0IFZlY3RvcjM8dmFyPnMhXHJcblxyXG4gICAgICAgIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uIHRoZSBjb2RlIGZyb206XHJcblxyXG4gICAgICAgIFRvbWFzIE1sbGVyLCBKb2huIEh1Z2hlc1xyXG4gICAgICAgIEVmZmljaWVudGx5IEJ1aWxkaW5nIGEgTWF0cml4IHRvIFJvdGF0ZSBPbmUgVmVjdG9yIHRvIEFub3RoZXJcclxuICAgICAgICBKb3VybmFsIG9mIEdyYXBoaWNzIFRvb2xzLCA0KDQpOjEtNCwgMTk5OVxyXG4gICAgICAgICovXHJcbiAgICAgICAgdmFyIEVQU0lMT04gPSAwLjAwMDAwMSxcclxuICAgICAgICAgICAgZnJvbSA9IG5ldyBWZWMzKCBmcm9tVmVjICkubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIHRvID0gbmV3IFZlYzMoIHRvVmVjICkubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIGUgPSBmcm9tLmRvdCggdG8gKSxcclxuICAgICAgICAgICAgZiA9IE1hdGguYWJzKCBlICksXHJcbiAgICAgICAgICAgIHRoYXQgPSBuZXcgTWF0MzMoKSxcclxuICAgICAgICAgICAgeCwgdSwgdixcclxuICAgICAgICAgICAgZngsIGZ5LCBmeixcclxuICAgICAgICAgICAgdXgsIHV6LFxyXG4gICAgICAgICAgICBjMSwgYzIsIGMzO1xyXG4gICAgICAgIGlmICggZiA+ICggMS4wLUVQU0lMT04gKSApIHtcclxuICAgICAgICAgICAgLy8gXCJmcm9tXCIgYW5kIFwidG9cIiBhbG1vc3QgcGFyYWxsZWxcclxuICAgICAgICAgICAgLy8gbmVhcmx5IG9ydGhvZ29uYWxcclxuICAgICAgICAgICAgZnggPSBNYXRoLmFicyggZnJvbS54ICk7XHJcbiAgICAgICAgICAgIGZ5ID0gTWF0aC5hYnMoIGZyb20ueSApO1xyXG4gICAgICAgICAgICBmeiA9IE1hdGguYWJzKCBmcm9tLnogKTtcclxuICAgICAgICAgICAgaWYgKGZ4IDwgZnkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChmeDxmeikge1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSBuZXcgVmVjMyggMSwgMCwgMCApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gbmV3IFZlYzMoIDAsIDAsIDEgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChmeSA8IGZ6KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IG5ldyBWZWMzKCAwLCAxLCAwICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSBuZXcgVmVjMyggMCwgMCwgMSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHUgPSB4LnN1YiggZnJvbSApO1xyXG4gICAgICAgICAgICB2ID0geC5zdWIoIHRvICk7XHJcbiAgICAgICAgICAgIGMxID0gMi4wIC8gdS5kb3QoIHUgKTtcclxuICAgICAgICAgICAgYzIgPSAyLjAgLyB2LmRvdCggdiApO1xyXG4gICAgICAgICAgICBjMyA9IGMxKmMyICogdS5kb3QoIHYgKTtcclxuICAgICAgICAgICAgLy8gc2V0IG1hdHJpeCBlbnRyaWVzXHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVswXSA9IC0gYzEqdS54KnUueCAtIGMyKnYueCp2LnggKyBjMyp2LngqdS54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbM10gPSAtIGMxKnUueCp1LnkgLSBjMip2Lngqdi55ICsgYzMqdi54KnUueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzZdID0gLSBjMSp1LngqdS56IC0gYzIqdi54KnYueiArIGMzKnYueCp1Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVsxXSA9IC0gYzEqdS55KnUueCAtIGMyKnYueSp2LnggKyBjMyp2LnkqdS54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNF0gPSAtIGMxKnUueSp1LnkgLSBjMip2Lnkqdi55ICsgYzMqdi55KnUueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzddID0gLSBjMSp1LnkqdS56IC0gYzIqdi55KnYueiArIGMzKnYueSp1Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVsyXSA9IC0gYzEqdS56KnUueCAtIGMyKnYueip2LnggKyBjMyp2LnoqdS54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNV0gPSAtIGMxKnUueip1LnkgLSBjMip2Lnoqdi55ICsgYzMqdi56KnUueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzhdID0gLSBjMSp1LnoqdS56IC0gYzIqdi56KnYueiArIGMzKnYueip1Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVswXSArPSAxLjA7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs0XSArPSAxLjA7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs4XSArPSAxLjA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdGhlIG1vc3QgY29tbW9uIGNhc2UsIHVubGVzcyBcImZyb21cIj1cInRvXCIsIG9yIFwidG9cIj0tXCJmcm9tXCJcclxuICAgICAgICAgICAgdiA9IGZyb20uY3Jvc3MoIHRvICk7XHJcbiAgICAgICAgICAgIHUgPSAxLjAgLyAoIDEuMCArIGUgKTsgICAgLy8gb3B0aW1pemF0aW9uIGJ5IEdvdHRmcmllZCBDaGVuXHJcbiAgICAgICAgICAgIHV4ID0gdSAqIHYueDtcclxuICAgICAgICAgICAgdXogPSB1ICogdi56O1xyXG4gICAgICAgICAgICBjMSA9IHV4ICogdi55O1xyXG4gICAgICAgICAgICBjMiA9IHV4ICogdi56O1xyXG4gICAgICAgICAgICBjMyA9IHV6ICogdi55O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbMF0gPSBlICsgdXggKiB2Lng7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVszXSA9IGMxIC0gdi56O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbNl0gPSBjMiArIHYueTtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzFdID0gYzEgKyB2Lno7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs0XSA9IGUgKyB1ICogdi55ICogdi55O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbN10gPSBjMyAtIHYueDtcclxuICAgICAgICAgICAgdGhhdC5kYXRhWzJdID0gYzIgLSB2Lnk7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YVs1XSA9IGMzICsgdi54O1xyXG4gICAgICAgICAgICB0aGF0LmRhdGFbOF0gPSBlICsgdXogKiB2Lno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIG1hdHJpeCB3aXRoIHRoZSBwcm92aWRlZCBtYXRyaXggYXJndW1lbnQsIHJldHVybmluZyBhIG5ldyBNYTMzXHJcbiAgICAgKiBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgc3VtIG9mIHRoZSB0d28gbWF0cmljZXMuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDMzKCB0aGF0ICksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDk7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gKz0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnRyYWN0cyB0aGUgcHJvdmlkZWQgbWF0cml4IGFyZ3VtZW50IGZyb20gdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIG1hdHJpY2VzLlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQzMyggdGhhdCApLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTw5OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldIC0gbWF0LmRhdGFbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCB2ZWN0b3IgYXJndW1lbnQgYnkgdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBWZWMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fEFycmF5fSAtIFRoZSB2ZWN0b3IgdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBUaGUgcmVzdWx0aW5nIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLm11bHRWZWN0b3IgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICAvLyBlbnN1cmUgJ3RoYXQnIGlzIGEgVmVjM1xyXG4gICAgICAgIC8vIGl0IGlzIHNhZmUgdG8gb25seSBjYXN0IGlmIEFycmF5IHNpbmNlIHRoZSAudyBvZiBhIFZlYzQgaXMgbm90IHVzZWRcclxuICAgICAgICB0aGF0ID0gKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSA/IG5ldyBWZWMzKCB0aGF0ICkgOiB0aGF0O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh7XHJcbiAgICAgICAgICAgIHg6IHRoaXMuZGF0YVswXSAqIHRoYXQueCArIHRoaXMuZGF0YVszXSAqIHRoYXQueSArIHRoaXMuZGF0YVs2XSAqIHRoYXQueixcclxuICAgICAgICAgICAgeTogdGhpcy5kYXRhWzFdICogdGhhdC54ICsgdGhpcy5kYXRhWzRdICogdGhhdC55ICsgdGhpcy5kYXRhWzddICogdGhhdC56LFxyXG4gICAgICAgICAgICB6OiB0aGlzLmRhdGFbMl0gKiB0aGF0LnggKyB0aGlzLmRhdGFbNV0gKiB0aGF0LnkgKyB0aGlzLmRhdGFbOF0gKiB0aGF0LnpcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIGFsbCBjb21wb25lbnRzIG9mIHRoZSBtYXRyaXggYnkgdGhlIHByb3ZkZWQgc2NhbGFyIGFyZ3VtZW50LFxyXG4gICAgICogcmV0dXJuaW5nIGEgbmV3IE1hdDMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIG1hdHJpeCBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0MzN9IFRoZSByZXN1bHRpbmcgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUubXVsdFNjYWxhciA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0MzMoKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8OTsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCBtYXRyaXggYXJndW1lbnQgYnkgdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fSAtIFRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5tdWx0TWF0cml4ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQzMygpLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGVuc3VyZSAndGhhdCcgaXMgYSBNYXQzM1xyXG4gICAgICAgIC8vIG11c3QgY2hlY2sgaWYgQXJyYXkgb3IgTWF0MzNcclxuICAgICAgICBpZiAoICggdGhhdC5kYXRhICYmIHRoYXQuZGF0YS5sZW5ndGggPT09IDE2ICkgfHxcclxuICAgICAgICAgICAgdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICB0aGF0ID0gbmV3IE1hdDMzKCB0aGF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTwzOyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldICogdGhhdC5kYXRhWzBdICsgdGhpcy5kYXRhW2krM10gKiB0aGF0LmRhdGFbMV0gKyB0aGlzLmRhdGFbaSs2XSAqIHRoYXQuZGF0YVsyXTtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaSszXSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQuZGF0YVszXSArIHRoaXMuZGF0YVtpKzNdICogdGhhdC5kYXRhWzRdICsgdGhpcy5kYXRhW2krNl0gKiB0aGF0LmRhdGFbNV07XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2krNl0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbNl0gKyB0aGlzLmRhdGFbaSszXSAqIHRoYXQuZGF0YVs3XSArIHRoaXMuZGF0YVtpKzZdICogdGhhdC5kYXRhWzhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHByb3ZkZWQgYXJndW1lbnQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fE1hdDMzfE1hdDQ0fEFycmF5fG51bWJlcn0gLSBUaGUgYXJndW1lbnQgdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM3xWZWMzfSBUaGUgcmVzdWx0aW5nIHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhhdCA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgLy8gc2NhbGFyXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRTY2FsYXIoIHRoYXQgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIC8vIGFycmF5XHJcbiAgICAgICAgICAgIGlmICggdGhhdC5sZW5ndGggPT09IDMgfHwgdGhhdC5sZW5ndGggPT09IDQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yKCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0TWF0cml4KCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdmVjdG9yXHJcbiAgICAgICAgaWYgKCB0aGF0LnggIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGF0LnkgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0aGF0LnogIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvciggdGhhdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtYXRyaXhcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0TWF0cml4KCB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlcyBhbGwgY29tcG9uZW50cyBvZiB0aGUgbWF0cml4IGJ5IHRoZSBwcm92ZGVkIHNjYWxhciBhcmd1bWVudCxcclxuICAgICAqIHJldHVybmluZyBhIG5ldyBNYXQzMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIGRpdmlkZSB0aGUgbWF0cml4IGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDMzKCksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDk7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gPSB0aGlzLmRhdGFbaV0gLyB0aGF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYWxsIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCBtYXRyaXguXHJcbiAgICAgKiBBbiBvcHRpb25hbCBlcHNpbG9uIHZhbHVlIG1heSBiZSBwcm92aWRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TWF0MzN8QXJyYXl9IHRoYXQgLSBUaGUgbWF0cml4IHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgbWF0cml4IGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiggdGhhdCwgZXBzaWxvbiApIHtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBlcHNpbG9uID0gZXBzaWxvbiA9PT0gdW5kZWZpbmVkID8gMCA6IGVwc2lsb247XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDk7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gYXdrd2FyZCBjb21wYXJpc29uIGxvZ2ljIGlzIHJlcXVpcmVkIHRvIGVuc3VyZSBlcXVhbGl0eSBwYXNzZXMgaWZcclxuICAgICAgICAgICAgLy8gY29ycmVzcG9uZGluZyBhcmUgYm90aCB1bmRlZmluZWQsIE5hTiwgb3IgSW5maW5pdHlcclxuICAgICAgICAgICAgaWYgKCAhKFxyXG4gICAgICAgICAgICAgICAgKCB0aGlzLmRhdGFbaV0gPT09IHRoYXQuZGF0YVtpXSApIHx8XHJcbiAgICAgICAgICAgICAgICAoIE1hdGguYWJzKCB0aGlzLmRhdGFbaV0gLSB0aGF0LmRhdGFbaV0gKSA8PSBlcHNpbG9uIClcclxuICAgICAgICAgICAgICAgKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc3Bvc2Ugb2YgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQzM30gVGhlIHRyYW5zcG9zZWQgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRyYW5zID0gbmV3IE1hdDMzKCksIGk7XHJcbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCAzOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbaSozXSAgICAgPSB0aGlzLmRhdGFbaV07XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbKGkqMykrMV0gPSB0aGlzLmRhdGFbaSszXTtcclxuICAgICAgICAgICAgdHJhbnMuZGF0YVsoaSozKSsyXSA9IHRoaXMuZGF0YVtpKzZdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJhbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgaW52ZXJ0ZWQgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbnYgPSBuZXcgTWF0MzMoKSwgZGV0O1xyXG4gICAgICAgIC8vIGNvbXB1dGUgaW52ZXJzZVxyXG4gICAgICAgIC8vIHJvdyAxXHJcbiAgICAgICAgaW52LmRhdGFbMF0gPSB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzhdIC0gdGhpcy5kYXRhWzddKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICBpbnYuZGF0YVszXSA9IC10aGlzLmRhdGFbM10qdGhpcy5kYXRhWzhdICsgdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVs1XTtcclxuICAgICAgICBpbnYuZGF0YVs2XSA9IHRoaXMuZGF0YVszXSp0aGlzLmRhdGFbN10gLSB0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzRdO1xyXG4gICAgICAgIC8vIHJvdyAyXHJcbiAgICAgICAgaW52LmRhdGFbMV0gPSAtdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs4XSArIHRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMl07XHJcbiAgICAgICAgaW52LmRhdGFbNF0gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzhdIC0gdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsyXTtcclxuICAgICAgICBpbnYuZGF0YVs3XSA9IC10aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzddICsgdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxXTtcclxuICAgICAgICAvLyByb3cgM1xyXG4gICAgICAgIGludi5kYXRhWzJdID0gdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVs1XSAtIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMl07XHJcbiAgICAgICAgaW52LmRhdGFbNV0gPSAtdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs1XSArIHRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMl07XHJcbiAgICAgICAgaW52LmRhdGFbOF0gPSB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzRdIC0gdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxXTtcclxuICAgICAgICAvLyBjYWxjdWxhdGUgZGV0ZXJtaW5hbnRcclxuICAgICAgICBkZXQgPSB0aGlzLmRhdGFbMF0qaW52LmRhdGFbMF0gKyB0aGlzLmRhdGFbMV0qaW52LmRhdGFbM10gKyB0aGlzLmRhdGFbMl0qaW52LmRhdGFbNl07XHJcbiAgICAgICAgLy8gcmV0dXJuXHJcbiAgICAgICAgcmV0dXJuIGludi5tdWx0KCAxIC8gZGV0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVjb21wb3NlcyB0aGUgbWF0cml4IGludG8gdGhlIGNvcnJlc3BvbmRpbmcgeCwgeSwgYW5kIHogYXhlcywgYWxvbmcgd2l0aFxyXG4gICAgICogYSBzY2FsZS5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQzM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkZWNvbXBvc2VkIGNvbXBvbmVudHMgb2YgdGhlIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0MzMucHJvdG90eXBlLmRlY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjb2wwID0gdGhpcy5jb2woIDAgKSxcclxuICAgICAgICAgICAgY29sMSA9IHRoaXMuY29sKCAxICksXHJcbiAgICAgICAgICAgIGNvbDIgPSB0aGlzLmNvbCggMiApO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxlZnQ6IGNvbDAubm9ybWFsaXplKCksXHJcbiAgICAgICAgICAgIHVwOiBjb2wxLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBmb3J3YXJkOiBjb2wyLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBzY2FsZTogbmV3IFZlYzMoIGNvbDAubGVuZ3RoKCksIGNvbDEubGVuZ3RoKCksIGNvbDIubGVuZ3RoKCkgKVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJhbmRvbSB0cmFuc2Zvcm0gbWF0cml4IGNvbXBvc2VkIG9mIGEgcm90YXRpb24gYW5kIHNjYWxlLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBBIHJhbmRvbSB0cmFuc2Zvcm0gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQzMy5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcm90ID0gTWF0MzMucm90YXRpb25SYWRpYW5zKCBNYXRoLnJhbmRvbSgpICogMzYwLCBWZWMzLnJhbmRvbSgpICksXHJcbiAgICAgICAgICAgIHNjYWxlID0gTWF0MzMuc2NhbGUoIE1hdGgucmFuZG9tKCkgKiAxMCApO1xyXG4gICAgICAgIHJldHVybiByb3QubXVsdCggc2NhbGUgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF0gK1wiLCBcIisgdGhpcy5kYXRhWzNdICtcIiwgXCIrIHRoaXMuZGF0YVs2XSArXCIsXFxuXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMV0gK1wiLCBcIisgdGhpcy5kYXRhWzRdICtcIiwgXCIrIHRoaXMuZGF0YVs3XSArXCIsXFxuXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMl0gK1wiLCBcIisgdGhpcy5kYXRhWzVdICtcIiwgXCIrIHRoaXMuZGF0YVs4XTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0MzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBtYXRyaXggYXMgYW4gYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIE1hdDMzLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZSggMCApO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1hdDMzO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSggJy4vVmVjMycgKSxcclxuICAgICAgICBWZWM0ID0gcmVxdWlyZSggJy4vVmVjNCcgKSxcclxuICAgICAgICBNYXQzMyA9IHJlcXVpcmUoICcuL01hdDMzJyApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgTWF0NDQgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIE1hdDQ0XHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgNHg0IGNvbHVtbi1tYWpvciBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIE1hdDQ0KCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCApIHtcclxuICAgICAgICAgICAgaWYgKCB0aGF0LmRhdGEgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggdGhhdC5kYXRhLmxlbmd0aCA9PT0gMTYgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29weSBNYXQ0NCBkYXRhIGJ5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhhdC5kYXRhLnNsaWNlKCAwICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgTWF0MzMgZGF0YSBieSB2YWx1ZSwgYWNjb3VudCBmb3IgaW5kZXggZGlmZmVyZW5jZXNcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVswXSwgdGhhdC5kYXRhWzFdLCB0aGF0LmRhdGFbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVszXSwgdGhhdC5kYXRhWzRdLCB0aGF0LmRhdGFbNV0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVs2XSwgdGhhdC5kYXRhWzddLCB0aGF0LmRhdGFbOF0sIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDEgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhhdC5sZW5ndGggPT09IDE2ICkge1xyXG4gICAgICAgICAgICAgICAgIC8vIGNvcHkgYXJyYXkgYnkgdmFsdWUsIHVzZSBwcm90b3R5cGUgdG8gY2FzdCBhcnJheSBidWZmZXJzXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggdGhhdCApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgY29sdW1uIG9mIHRoZSBtYXRyaXggYXMgYSBWZWM0IG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSAwLWJhc2VkIGNvbHVtbiBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIGNvbHVtbiB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5yb3cgPSBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMCtpbmRleF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0K2luZGV4XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzgraW5kZXhdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTIraW5kZXhdICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdyBvZiB0aGUgbWF0cml4IGFzIGEgVmVjNCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgMC1iYXNlZCByb3cgaW5kZXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBjb2x1bW4gdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuY29sID0gZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzAraW5kZXgqNF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxK2luZGV4KjRdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMitpbmRleCo0XSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzMraW5kZXgqNF0gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpZGVudGl0eSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpZGVudGl5IG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQuaWRlbnRpdHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc2NhbGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fG51bWJlcn0gc2NhbGUgLSBUaGUgc2NhbGFyIG9yIHZlY3RvciBzY2FsaW5nIGZhY3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBzY2FsZSBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnNjYWxlID0gZnVuY3Rpb24oIHNjYWxlICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHNjYWxlID09PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgICAgIHNjYWxlLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgc2NhbGUsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCBzY2FsZSwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIDAsIDEgXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggc2NhbGUgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgICAgICBzY2FsZVswXSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIHNjYWxlWzFdLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgc2NhbGVbMl0sIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAwLCAxIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgc2NhbGUueCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgc2NhbGUueSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgc2NhbGUueiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSB0cmFuc2xhdGlvbiAtIFRoZSB0cmFuc2xhdGlvbiB2ZWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC50cmFuc2xhdGlvbiA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbiApIHtcclxuICAgICAgICBpZiAoIHRyYW5zbGF0aW9uIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0NDQoW1xyXG4gICAgICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRpb25bMF0sIHRyYW5zbGF0aW9uWzFdLCB0cmFuc2xhdGlvblsyXSwgMSBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uLngsIHRyYW5zbGF0aW9uLnksIHRyYW5zbGF0aW9uLnosIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJvdGF0aW9uIG1hdHJpeCBkZWZpbmVkIGJ5IGFuIGF4aXMgYW5kIGFuIGFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gZGVncmVlcy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnJvdGF0aW9uRGVncmVlcyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KCBNYXQzMy5yb3RhdGlvbkRlZ3JlZXMoIGFuZ2xlLCBheGlzICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcm90YXRpb24gbWF0cml4IGRlZmluZWQgYnkgYW4gYXhpcyBhbmQgYW4gYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiByYWRpYW5zLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucm90YXRpb25SYWRpYW5zID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoIE1hdDMzLnJvdGF0aW9uUmFkaWFucyggYW5nbGUsIGF4aXMgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByb3RhdGlvbiBtYXRyaXggdG8gcm90YXRlIGEgdmVjdG9yIGZyb20gb25lIGRpcmVjdGlvbiB0b1xyXG4gICAgICogYW5vdGhlci5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM30gZnJvbSAtIFRoZSBzdGFydGluZyBkaXJlY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRvIC0gVGhlIGVuZGluZyBkaXJlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgbWF0cml4IHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24uXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnJvdGF0aW9uRnJvbVRvID0gZnVuY3Rpb24oIGZyb21WZWMsIHRvVmVjICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoIE1hdDMzLnJvdGF0aW9uRnJvbVRvKCBmcm9tVmVjLCB0b1ZlYyApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgbWF0cml4IHdpdGggdGhlIHByb3ZpZGVkIG1hdHJpeCBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IE1hMzNcclxuICAgICAqIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TWF0MzN8TWF0NDR8QXJyYXl9IHRoYXQgLSBUaGUgbWF0cml4IHRvIGFkZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBzdW0gb2YgdGhlIHR3byBtYXRyaWNlcy5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0NDQoIHRoYXQgKSxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8MTY7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gKz0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnRyYWN0cyB0aGUgcHJvdmlkZWQgbWF0cml4IGFyZ3VtZW50IGZyb20gdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQ0NCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIG1hdHJpY2VzLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCggdGhhdCApLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTwxNjsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAtIG1hdC5kYXRhW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHByb3ZkZWQgdmVjdG9yIGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXgsIHJldHVybmluZyBhIG5ld1xyXG4gICAgICogVmVjMyBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHJlc3VsdGluZyB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5tdWx0VmVjdG9yMyA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIC8vIGVuc3VyZSAndGhhdCcgaXMgYSBWZWMzXHJcbiAgICAgICAgLy8gaXQgaXMgc2FmZSB0byBvbmx5IGNhc3QgaWYgQXJyYXkgc2luY2UgVmVjNCBoYXMgb3duIG1ldGhvZFxyXG4gICAgICAgIHRoYXQgPSAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApID8gbmV3IFZlYzMoIHRoYXQgKSA6IHRoYXQ7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHtcclxuICAgICAgICAgICAgeDogdGhpcy5kYXRhWzBdICogdGhhdC54ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs0XSAqIHRoYXQueSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbOF0gKiB0aGF0LnogKyB0aGlzLmRhdGFbMTJdLFxyXG4gICAgICAgICAgICB5OiB0aGlzLmRhdGFbMV0gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzVdICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVs5XSAqIHRoYXQueiArIHRoaXMuZGF0YVsxM10sXHJcbiAgICAgICAgICAgIHo6IHRoaXMuZGF0YVsyXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNl0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzEwXSAqIHRoYXQueiArIHRoaXMuZGF0YVsxNF1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSBwcm92ZGVkIHZlY3RvciBhcmd1bWVudCBieSB0aGUgbWF0cml4LCByZXR1cm5pbmcgYSBuZXdcclxuICAgICAqIFZlYzMgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIHZlY3RvciB0byBiZSBtdWx0aXBsaWVkIGJ5IHRoZSBtYXRyaXguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSByZXN1bHRpbmcgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUubXVsdFZlY3RvcjQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICAvLyBlbnN1cmUgJ3RoYXQnIGlzIGEgVmVjNFxyXG4gICAgICAgIC8vIGl0IGlzIHNhZmUgdG8gb25seSBjYXN0IGlmIEFycmF5IHNpbmNlIFZlYzMgaGFzIG93biBtZXRob2RcclxuICAgICAgICB0aGF0ID0gKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSA/IG5ldyBWZWM0KCB0aGF0ICkgOiB0aGF0O1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNCh7XHJcbiAgICAgICAgICAgIHg6IHRoaXMuZGF0YVswXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNF0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzhdICogdGhhdC56ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0gKiB0aGF0LncsXHJcbiAgICAgICAgICAgIHk6IHRoaXMuZGF0YVsxXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNV0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzldICogdGhhdC56ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxM10gKiB0aGF0LncsXHJcbiAgICAgICAgICAgIHo6IHRoaXMuZGF0YVsyXSAqIHRoYXQueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbNl0gKiB0aGF0LnkgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzEwXSAqIHRoYXQueiArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbMTRdICogdGhhdC53LFxyXG4gICAgICAgICAgICB3OiB0aGlzLmRhdGFbM10gKiB0aGF0LnggK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzddICogdGhhdC55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVsxMV0gKiB0aGF0LnogK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhWzE1XSAqIHRoYXQud1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgYWxsIGNvbXBvbmVudHMgb2YgdGhlIG1hdHJpeCBieSB0aGUgcHJvdmRlZCBzY2FsYXIgYXJndW1lbnQsXHJcbiAgICAgKiByZXR1cm5pbmcgYSBuZXcgTWF0NDQgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBtdWx0aXBseSB0aGUgbWF0cml4IGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5tdWx0U2NhbGFyID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTwxNjsgaSsrICkge1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpXSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgcHJvdmRlZCBtYXRyaXggYXJndW1lbnQgYnkgdGhlIG1hdHJpeCwgcmV0dXJuaW5nIGEgbmV3XHJcbiAgICAgKiBNYXQ0NCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDMzfE1hdDQ0fEFycmF5fSAtIFRoZSBtYXRyaXggdG8gYmUgbXVsdGlwbGllZCBieSB0aGUgbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5tdWx0TWF0cml4ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGVuc3VyZSAndGhhdCcgaXMgYSBNYXQ0NFxyXG4gICAgICAgIC8vIG11c3QgY2hlY2sgaWYgQXJyYXkgb3IgTWF0NDRcclxuICAgICAgICBpZiAoICggdGhhdC5kYXRhICYmIHRoYXQuZGF0YS5sZW5ndGggPT09IDkgKSB8fFxyXG4gICAgICAgICAgICB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoYXQgPSBuZXcgTWF0NDQoIHRoYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDQ7IGkrKyApIHtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaV0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbMF0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krNF0gKiB0aGF0LmRhdGFbMV0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krOF0gKiB0aGF0LmRhdGFbMl0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krMTJdICogdGhhdC5kYXRhWzNdO1xyXG4gICAgICAgICAgICBtYXQuZGF0YVtpKzRdID0gdGhpcy5kYXRhW2ldICogdGhhdC5kYXRhWzRdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzRdICogdGhhdC5kYXRhWzVdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzhdICogdGhhdC5kYXRhWzZdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzEyXSAqIHRoYXQuZGF0YVs3XTtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaSs4XSA9IHRoaXMuZGF0YVtpXSAqIHRoYXQuZGF0YVs4XSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs0XSAqIHRoYXQuZGF0YVs5XSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs4XSAqIHRoYXQuZGF0YVsxMF0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krMTJdICogdGhhdC5kYXRhWzExXTtcclxuICAgICAgICAgICAgbWF0LmRhdGFbaSsxMl0gPSB0aGlzLmRhdGFbaV0gKiB0aGF0LmRhdGFbMTJdICtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpKzRdICogdGhhdC5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaSs4XSAqIHRoYXQuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2krMTJdICogdGhhdC5kYXRhWzE1XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSBwcm92ZGVkIGFyZ3VtZW50IGJ5IHRoZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxNYXQzM3xNYXQ0NHxBcnJheXxudW1iZXJ9IC0gVGhlIGFyZ3VtZW50IHRvIGJlIG11bHRpcGxpZWQgYnkgdGhlIG1hdHJpeC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR8VmVjNH0gVGhlIHJlc3VsdGluZyBwcm9kdWN0LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHRoYXQgPT09IFwibnVtYmVyXCIgKSB7XHJcbiAgICAgICAgICAgIC8vIHNjYWxhclxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0U2NhbGFyKCB0aGF0ICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBhcnJheVxyXG4gICAgICAgICAgICBpZiAoIHRoYXQubGVuZ3RoID09PSAzICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdFZlY3RvcjMoIHRoYXQgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhhdC5sZW5ndGggPT09IDQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yNCggdGhhdCApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdE1hdHJpeCggdGhhdCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHZlY3RvclxyXG4gICAgICAgIGlmICggdGhhdC54ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhhdC55ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgdGhhdC56ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhhdC53ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2ZWM0XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yNCggdGhhdCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vdmVjM1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0VmVjdG9yMyggdGhhdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtYXRyaXhcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0TWF0cml4KCB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlcyBhbGwgY29tcG9uZW50cyBvZiB0aGUgbWF0cml4IGJ5IHRoZSBwcm92ZGVkIHNjYWxhciBhcmd1bWVudCxcclxuICAgICAqIHJldHVybmluZyBhIG5ldyBNYXQ0NCBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIGRpdmlkZSB0aGUgbWF0cml4IGJ5LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIHJlc3VsdGluZyBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgbWF0ID0gbmV3IE1hdDQ0KCksIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPDE2OyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1hdC5kYXRhW2ldID0gdGhpcy5kYXRhW2ldIC8gdGhhdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1hdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGFsbCBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgbWF0cml4LlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgTWF0NDRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge01hdDQ0fEFycmF5fSB0aGF0IC0gVGhlIG1hdHJpeCB0byB0ZXN0IGVxdWFsaXR5IHdpdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZXBzaWxvbiAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIG1hdHJpeCBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTwxNjsgaSsrICkge1xyXG4gICAgICAgICAgICAvLyBhd2t3YXJkIGNvbXBhcmlzb24gbG9naWMgaXMgcmVxdWlyZWQgdG8gZW5zdXJlIGVxdWFsaXR5IHBhc3NlcyBpZlxyXG4gICAgICAgICAgICAvLyBjb3JyZXNwb25kaW5nIGFyZSBib3RoIHVuZGVmaW5lZCwgTmFOLCBvciBJbmZpbml0eVxyXG4gICAgICAgICAgICBpZiAoICEoXHJcbiAgICAgICAgICAgICAgICAoIHRoaXMuZGF0YVtpXSA9PT0gdGhhdC5kYXRhW2ldICkgfHxcclxuICAgICAgICAgICAgICAgICggTWF0aC5hYnMoIHRoaXMuZGF0YVtpXSAtIHRoYXQuZGF0YVtpXSApIDw9IGVwc2lsb24gKVxyXG4gICAgICAgICAgICAgICApICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gb3J0aG9ncmFwaGljIHByb2plY3Rpb24gbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0gVGhlIG1pbmltdW0geCBleHRlbnQgb2YgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmlnaHQgLSBUaGUgbWF4aW11bSB4IGV4dGVudCBvZiB0aGUgcHJvamVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3R0b20gLSBUaGUgbWluaW11bSB5IGV4dGVudCBvZiB0aGUgcHJvamVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgLSBUaGUgbWF4aW11bSB5IGV4dGVudCBvZiB0aGUgcHJvamVjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIC0gVGhlIG1pbmltdW0geiBleHRlbnQgb2YgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmFyIC0gVGhlIG1heGltdW0geiBleHRlbnQgb2YgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgb3J0aG9ncmFwaGljIHByb2plY3Rpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5vcnRobyA9IGZ1bmN0aW9uKCBsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhciApIHtcclxuICAgICAgICB2YXIgbWF0ID0gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICBtYXQuZGF0YVswXSA9IDIgLyAoIHJpZ2h0IC0gbGVmdCApO1xyXG4gICAgICAgIG1hdC5kYXRhWzVdID0gMiAvICggdG9wIC0gYm90dG9tICk7XHJcbiAgICAgICAgbWF0LmRhdGFbMTBdID0gLTIgLyAoIGZhciAtIG5lYXIgKTtcclxuICAgICAgICBtYXQuZGF0YVsxMl0gPSAtKCAoIHJpZ2h0ICsgbGVmdCApIC8gKCByaWdodCAtIGxlZnQgKSApO1xyXG4gICAgICAgIG1hdC5kYXRhWzEzXSA9IC0oICggdG9wICsgYm90dG9tICkgLyAoIHRvcCAtIGJvdHRvbSApICk7XHJcbiAgICAgICAgbWF0LmRhdGFbMTRdID0gLSggKCBmYXIgKyBuZWFyICkgLyAoIGZhciAtIG5lYXIgKSApO1xyXG4gICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmb3YgLSBUaGUgZmllbGQgb2Ygdmlldy5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhc3BlY3QgLSBUaGUgYXNwZWN0IHJhdGlvLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpNaW4gLSBUaGUgbWluaW11bSB5IGV4dGVudCBvZiB0aGUgZnJ1c3R1bS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6TWF4IC0gVGhlIG1heGltdW0geSBleHRlbnQgb2YgdGhlIGZydXN0dW0uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnBlcnNwZWN0aXZlID0gZnVuY3Rpb24oIGZvdiwgYXNwZWN0LCB6TWluLCB6TWF4ICkge1xyXG4gICAgICAgIHZhciB5TWF4ID0gek1pbiAqIE1hdGgudGFuKCBmb3YgKiAoIE1hdGguUEkgLyAzNjAuMCApICksXHJcbiAgICAgICAgICAgIHlNaW4gPSAteU1heCxcclxuICAgICAgICAgICAgeE1pbiA9IHlNaW4gKiBhc3BlY3QsXHJcbiAgICAgICAgICAgIHhNYXggPSAteE1pbixcclxuICAgICAgICAgICAgbWF0ID0gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICBtYXQuZGF0YVswXSA9ICgyICogek1pbikgLyAoeE1heCAtIHhNaW4pO1xyXG4gICAgICAgIG1hdC5kYXRhWzVdID0gKDIgKiB6TWluKSAvICh5TWF4IC0geU1pbik7XHJcbiAgICAgICAgbWF0LmRhdGFbOF0gPSAoeE1heCArIHhNaW4pIC8gKHhNYXggLSB4TWluKTtcclxuICAgICAgICBtYXQuZGF0YVs5XSA9ICh5TWF4ICsgeU1pbikgLyAoeU1heCAtIHlNaW4pO1xyXG4gICAgICAgIG1hdC5kYXRhWzEwXSA9IC0oKHpNYXggKyB6TWluKSAvICh6TWF4IC0gek1pbikpO1xyXG4gICAgICAgIG1hdC5kYXRhWzExXSA9IC0xO1xyXG4gICAgICAgIG1hdC5kYXRhWzE0XSA9IC0oICggMiAqICh6TWF4KnpNaW4pICkvKHpNYXggLSB6TWluKSk7XHJcbiAgICAgICAgbWF0LmRhdGFbMTVdID0gMDtcclxuICAgICAgICByZXR1cm4gbWF0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zcG9zZSBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgdHJhbnNwb3NlZCBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIE1hdDQ0LnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdHJhbnMgPSBuZXcgTWF0NDQoKSwgaTtcclxuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IDQ7IGkrKyApIHtcclxuICAgICAgICAgICAgdHJhbnMuZGF0YVtpKjRdID0gdGhpcy5kYXRhW2ldO1xyXG4gICAgICAgICAgICB0cmFucy5kYXRhWyhpKjQpKzFdID0gdGhpcy5kYXRhW2krNF07XHJcbiAgICAgICAgICAgIHRyYW5zLmRhdGFbKGkqNCkrMl0gPSB0aGlzLmRhdGFbaSs4XTtcclxuICAgICAgICAgICAgdHJhbnMuZGF0YVsoaSo0KSszXSA9IHRoaXMuZGF0YVtpKzEyXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGludmVydGVkIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaW52ID0gbmV3IE1hdDQ0KCksIGRldDtcclxuICAgICAgICAvLyBjb21wdXRlIGludmVyc2VcclxuICAgICAgICAvLyByb3cgMVxyXG4gICAgICAgIGludi5kYXRhWzBdID0gdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxMF0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTFdKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTNdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTFdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEzXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzEwXTtcclxuICAgICAgICBpbnYuZGF0YVs0XSA9IC10aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzEwXSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxMV0qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxMV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTBdO1xyXG4gICAgICAgIGludi5kYXRhWzhdID0gdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxMV0qdGhpcy5kYXRhWzEzXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxMV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbOV07XHJcbiAgICAgICAgaW52LmRhdGFbMTJdID0gLXRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs0XSp0aGlzLmRhdGFbMTBdKnRoaXMuZGF0YVsxM10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxM10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTBdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzldO1xyXG4gICAgICAgIC8vIHJvdyAyXHJcbiAgICAgICAgaW52LmRhdGFbMV0gPSAtdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxMF0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTFdKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTNdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTFdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEzXSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzEwXTtcclxuICAgICAgICBpbnYuZGF0YVs1XSA9IHRoaXMuZGF0YVswXSp0aGlzLmRhdGFbMTBdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzExXSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzExXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxMF07XHJcbiAgICAgICAgaW52LmRhdGFbOV0gPSAtdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVsxMV0qdGhpcy5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzEzXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxMV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbOV07XHJcbiAgICAgICAgaW52LmRhdGFbMTNdID0gdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbMTRdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVsxMF0qdGhpcy5kYXRhWzEzXSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzEzXSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxMl0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxMF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbOV07XHJcbiAgICAgICAgLy8gcm93IDNcclxuICAgICAgICBpbnYuZGF0YVsyXSA9IHRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbNl0qdGhpcy5kYXRhWzE1XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbN10qdGhpcy5kYXRhWzE0XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMl0qdGhpcy5kYXRhWzE1XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzE0XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxM10qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs3XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsxM10qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs2XTtcclxuICAgICAgICBpbnYuZGF0YVs2XSA9IC10aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxNV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxNV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbN10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbNl07XHJcbiAgICAgICAgaW52LmRhdGFbMTBdID0gdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTVdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTNdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbMTVdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTNdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzddIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzEyXSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzVdO1xyXG4gICAgICAgIGludi5kYXRhWzE0XSA9IC10aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzVdKnRoaXMuZGF0YVsxNF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxM10gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxNF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxM10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsxXSp0aGlzLmRhdGFbNl0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMTJdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbNV07XHJcbiAgICAgICAgLy8gcm93IDRcclxuICAgICAgICBpbnYuZGF0YVszXSA9IC10aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzZdKnRoaXMuZGF0YVsxMV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzddKnRoaXMuZGF0YVsxMF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVsxMV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNV0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVsxMF0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOV0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs3XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs5XSp0aGlzLmRhdGFbM10qdGhpcy5kYXRhWzZdO1xyXG4gICAgICAgIGludi5kYXRhWzddID0gdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbMTFdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbMTBdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbMTFdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzRdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbMTBdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbN10gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbOF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs2XTtcclxuICAgICAgICBpbnYuZGF0YVsxMV0gPSAtdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTFdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs3XSp0aGlzLmRhdGFbOV0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxMV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzNdKnRoaXMuZGF0YVs5XSAtXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzddICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVszXSp0aGlzLmRhdGFbNV07XHJcbiAgICAgICAgaW52LmRhdGFbMTVdID0gdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs1XSp0aGlzLmRhdGFbMTBdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdKnRoaXMuZGF0YVs2XSp0aGlzLmRhdGFbOV0gLVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzFdKnRoaXMuZGF0YVsxMF0gK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbNF0qdGhpcy5kYXRhWzJdKnRoaXMuZGF0YVs5XSArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVs4XSp0aGlzLmRhdGFbMV0qdGhpcy5kYXRhWzZdIC1cclxuICAgICAgICAgICAgdGhpcy5kYXRhWzhdKnRoaXMuZGF0YVsyXSp0aGlzLmRhdGFbNV07XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGRldGVybWluYW50XHJcbiAgICAgICAgZGV0ID0gdGhpcy5kYXRhWzBdKmludi5kYXRhWzBdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzFdKmludi5kYXRhWzRdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzJdKmludi5kYXRhWzhdICtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzNdKmludi5kYXRhWzEyXTtcclxuICAgICAgICByZXR1cm4gaW52Lm11bHQoIDEgLyBkZXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWNvbXBvc2VzIHRoZSBtYXRyaXggaW50byB0aGUgY29ycmVzcG9uZGluZyB4LCB5LCBhbmQgeiBheGVzLCBhbG9uZyB3aXRoXHJcbiAgICAgKiBhIHNjYWxlLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGRlY29tcG9zZWQgY29tcG9uZW50cyBvZiB0aGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUuZGVjb21wb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gZXh0cmFjdCB0cmFuc2Zvcm0gY29tcG9uZW50c1xyXG4gICAgICAgIHZhciBjb2wwID0gbmV3IFZlYzMoIHRoaXMuY29sKCAwICkgKSxcclxuICAgICAgICAgICAgY29sMSA9IG5ldyBWZWMzKCB0aGlzLmNvbCggMSApICksXHJcbiAgICAgICAgICAgIGNvbDIgPSBuZXcgVmVjMyggdGhpcy5jb2woIDIgKSApLFxyXG4gICAgICAgICAgICBjb2wzID0gbmV3IFZlYzMoIHRoaXMuY29sKCAzICkgKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsZWZ0OiBjb2wwLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICB1cDogY29sMS5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgZm9yd2FyZDogY29sMi5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgb3JpZ2luOiBjb2wzLFxyXG4gICAgICAgICAgICBzY2FsZTogbmV3IFZlYzMoIGNvbDAubGVuZ3RoKCksIGNvbDEubGVuZ3RoKCksIGNvbDIubGVuZ3RoKCkgKVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJhbmRvbSB0cmFuc2Zvcm0gbWF0cml4IGNvbXBvc2VkIG9mIGEgcm90YXRpb24gYW5kIHNjYWxlLlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBBIHJhbmRvbSB0cmFuc2Zvcm0gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcm90ID0gTWF0NDQucm90YXRpb25SYWRpYW5zKCBNYXRoLnJhbmRvbSgpICogMzYwLCBWZWMzLnJhbmRvbSgpICksXHJcbiAgICAgICAgICAgIHNjYWxlID0gTWF0NDQuc2NhbGUoIE1hdGgucmFuZG9tKCkgKiAxMCApLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGlvbiA9IE1hdDQ0LnRyYW5zbGF0aW9uKCBWZWMzLnJhbmRvbSgpICk7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uLm11bHQoIHJvdC5tdWx0KCBzY2FsZSApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIE1hdDQ0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBNYXQ0NC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdICtcIiwgXCIrIHRoaXMuZGF0YVs0XSArXCIsIFwiKyB0aGlzLmRhdGFbOF0gK1wiLCBcIisgdGhpcy5kYXRhWzEyXSArXCIsXFxuXCIgK1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbMV0gK1wiLCBcIisgdGhpcy5kYXRhWzVdICtcIiwgXCIrIHRoaXMuZGF0YVs5XSArXCIsIFwiKyB0aGlzLmRhdGFbMTNdICtcIixcXG5cIiArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVsyXSArXCIsIFwiKyB0aGlzLmRhdGFbNl0gK1wiLCBcIisgdGhpcy5kYXRhWzEwXSArXCIsIFwiKyB0aGlzLmRhdGFbMTRdICtcIixcXG5cIiArXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVszXSArXCIsIFwiKyB0aGlzLmRhdGFbN10gK1wiLCBcIisgdGhpcy5kYXRhWzExXSArXCIsIFwiKyB0aGlzLmRhdGFbMTVdO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBNYXQ0NFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG1hdHJpeCBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgTWF0NDQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNsaWNlKCAwICk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWF0NDQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFZlYzMgPSByZXF1aXJlKCcuL1ZlYzMnKSxcclxuICAgICAgICBNYXQzMyA9IHJlcXVpcmUoJy4vTWF0MzMnKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFF1YXRlcm5pb24gb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFF1YXRlcm5pb25cclxuICAgICAqIEBjbGFzc2Rlc2MgQSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyBhbiBvcmllbnRhdGlvbi5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gUXVhdGVybmlvbigpIHtcclxuICAgICAgICBzd2l0Y2ggKCBhcmd1bWVudHMubGVuZ3RoICkge1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAvLyBhcnJheSBvciBRdWF0ZXJuaW9uIGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJndW1lbnQgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIGFyZ3VtZW50LncgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudC53O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggYXJndW1lbnRbMF0gIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudFswXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnQueCB8fCBhcmd1bWVudFsxXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudC55IHx8IGFyZ3VtZW50WzJdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50LnogfHwgYXJndW1lbnRbM10gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIC8vIGluZGl2aWR1YWwgY29tcG9uZW50IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnRzWzNdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLncgPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHF1YXRlcm5pb24gdGhhdCByZXByZXNlbnRzIGFuIG9yZWludGF0aW9uIG1hdGNoaW5nXHJcbiAgICAgKiB0aGUgaWRlbnRpdHkgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIGlkZW50aXR5IHF1YXRlcm5pb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24uaWRlbnRpdHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oIDEsIDAsIDAsIDAgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFF1YXRlcm5pb24gd2l0aCBlYWNoIGNvbXBvbmVudCBuZWdhdGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIG5lZ2F0ZWQgcXVhdGVybmlvbi5cclxuICAgICAqL1xyXG4gICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLm5lZ2F0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbiggLXRoaXMudywgLXRoaXMueCwgLXRoaXMueSwgLXRoaXMueiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbmNhdGVuYXRlcyB0aGUgcm90YXRpb25zIG9mIHRoZSB0d28gcXVhdGVybmlvbnMsIHJldHVybmluZ1xyXG4gICAgICogYSBuZXcgUXVhdGVybmlvbiBvYmplY3QuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7UXVhdGVybmlvbnxBcnJheX0gdGhhdCAtIFRoZSBxdWF0ZXJpb24gdG8gY29uY2F0ZW5hdGUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSByZXN1bHRpbmcgY29uY2F0ZW5hdGVkIHF1YXRlcm5pb24uXHJcbiAgICAgKi9cclxuICAgIFF1YXRlcm5pb24ucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB0aGF0ID0gKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSA/IG5ldyBRdWF0ZXJuaW9uKCB0aGF0ICkgOiB0aGF0O1xyXG4gICAgICAgIHZhciB3ID0gKHRoYXQudyAqIHRoaXMudykgLSAodGhhdC54ICogdGhpcy54KSAtICh0aGF0LnkgKiB0aGlzLnkpIC0gKHRoYXQueiAqIHRoaXMueiksXHJcbiAgICAgICAgICAgIHggPSB0aGlzLnkqdGhhdC56IC0gdGhpcy56KnRoYXQueSArIHRoaXMudyp0aGF0LnggKyB0aGlzLngqdGhhdC53LFxyXG4gICAgICAgICAgICB5ID0gdGhpcy56KnRoYXQueCAtIHRoaXMueCp0aGF0LnogKyB0aGlzLncqdGhhdC55ICsgdGhpcy55KnRoYXQudyxcclxuICAgICAgICAgICAgeiA9IHRoaXMueCp0aGF0LnkgLSB0aGlzLnkqdGhhdC54ICsgdGhpcy53KnRoYXQueiArIHRoaXMueip0aGF0Lnc7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKCB3LCB4LCB5LCB6ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwbGllcyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHF1YXRlcm5pb24gYXMgYSByb3RhdGlvblxyXG4gICAgICogbWF0cml4IHRvIHRoZSBwcm92aWRlZCB2ZWN0b3IsIHJldHVybmluZyBhIG5ldyBWZWMzIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIHJvdGF0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHJlc3VsdGluZyByb3RhdGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgdGhhdCA9ICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkgPyBuZXcgVmVjMyggdGhhdCApIDogdGhhdDtcclxuICAgICAgICB2YXIgdnEgPSBuZXcgUXVhdGVybmlvbiggMCwgdGhhdC54LCB0aGF0LnksIHRoYXQueiApLFxyXG4gICAgICAgICAgICByID0gdGhpcy5tdWx0KCB2cSApLm11bHQoIHRoaXMuaW52ZXJzZSgpICk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCByLngsIHIueSwgci56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgcm90YXRpb24gbWF0cml4IHRoYXQgdGhlIHF1YXRlcm5pb24gcmVwcmVzZW50cy5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDMzfSBUaGUgcm90YXRpb24gbWF0cml4IHJlcHJlc2VudGVkIGJ5IHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5tYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgeHggPSB0aGlzLngqdGhpcy54LFxyXG4gICAgICAgICAgICB5eSA9IHRoaXMueSp0aGlzLnksXHJcbiAgICAgICAgICAgIHp6ID0gdGhpcy56KnRoaXMueixcclxuICAgICAgICAgICAgeHkgPSB0aGlzLngqdGhpcy55LFxyXG4gICAgICAgICAgICB4eiA9IHRoaXMueCp0aGlzLnosXHJcbiAgICAgICAgICAgIHh3ID0gdGhpcy54KnRoaXMudyxcclxuICAgICAgICAgICAgeXogPSB0aGlzLnkqdGhpcy56LFxyXG4gICAgICAgICAgICB5dyA9IHRoaXMueSp0aGlzLncsXHJcbiAgICAgICAgICAgIHp3ID0gdGhpcy56KnRoaXMudztcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDMzKFtcclxuICAgICAgICAgICAgMSAtIDIqeXkgLSAyKnp6LCAyKnh5ICsgMip6dywgMip4eiAtIDIqeXcsXHJcbiAgICAgICAgICAgIDIqeHkgLSAyKnp3LCAxIC0gMip4eCAtIDIqenosIDIqeXogKyAyKnh3LFxyXG4gICAgICAgICAgICAyKnh6ICsgMip5dywgMip5eiAtIDIqeHcsIDEgLSAyKnh4IC0gMip5eSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uIGRlZmluZWQgYnkgYW4gYXhpc1xyXG4gICAgICogYW5kIGFuIGFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiBkZWdyZWVzLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnJvdGF0aW9uRGVncmVlcyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICByZXR1cm4gUXVhdGVybmlvbi5yb3RhdGlvblJhZGlhbnMoIGFuZ2xlICogKCBNYXRoLlBJLzE4MCApLCBheGlzICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbiBkZWZpbmVkIGJ5IGFuIGF4aXNcclxuICAgICAqIGFuZCBhbiBhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gcmFkaWFucy5cclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5yb3RhdGlvblJhZGlhbnMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgaWYgKCBheGlzIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIGF4aXMgPSBuZXcgVmVjMyggYXhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBub3JtYWxpemUgYXJndW1lbnRzXHJcbiAgICAgICAgYXhpcyA9IGF4aXMubm9ybWFsaXplKCk7XHJcbiAgICAgICAgLy8gc2V0IHF1YXRlcm5pb24gZm9yIHRoZSBlcXVpdm9sZW50IHJvdGF0aW9uXHJcbiAgICAgICAgdmFyIG1vZEFuZ2xlID0gKCBhbmdsZSA+IDAgKSA/IGFuZ2xlICUgKDIqTWF0aC5QSSkgOiBhbmdsZSAlICgtMipNYXRoLlBJKSxcclxuICAgICAgICAgICAgc2luYSA9IE1hdGguc2luKCBtb2RBbmdsZS8yICksXHJcbiAgICAgICAgICAgIGNvc2EgPSBNYXRoLmNvcyggbW9kQW5nbGUvMiApO1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihcclxuICAgICAgICAgICAgY29zYSxcclxuICAgICAgICAgICAgYXhpcy54ICogc2luYSxcclxuICAgICAgICAgICAgYXhpcy55ICogc2luYSxcclxuICAgICAgICAgICAgYXhpcy56ICogc2luYSApLm5vcm1hbGl6ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBxdWF0ZXJuaW9uIHRoYXQgaGFzIGJlZW4gc3BoZXJpY2FsbHkgaW50ZXJwb2xhdGVkIGJldHdlZW5cclxuICAgICAqIHR3byBwcm92aWRlZCBxdWF0ZXJuaW9ucyBmb3IgYSBnaXZlbiB0IHZhbHVlLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1F1YXRlcm5pb259IGZyb21Sb3QgLSBUaGUgcm90YXRpb24gYXQgdCA9IDAuXHJcbiAgICAgKiBAcGFyYW0ge1F1YXRlcm5pb259IHRvUm90IC0gVGhlIHJvdGF0aW9uIGF0IHQgPSAxLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgLSBUaGUgdCB2YWx1ZSwgZnJvbSAwIHRvIDEuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgaW50ZXJwb2xhdGVkIHJvdGF0aW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnNsZXJwID0gZnVuY3Rpb24oIGZyb21Sb3QsIHRvUm90LCB0ICkge1xyXG4gICAgICAgIGlmICggZnJvbVJvdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICBmcm9tUm90ID0gbmV3IFF1YXRlcm5pb24oIGZyb21Sb3QgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0b1JvdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICB0b1JvdCA9IG5ldyBRdWF0ZXJuaW9uKCB0b1JvdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgYW5nbGUgYmV0d2VlblxyXG4gICAgICAgIHZhciBjb3NIYWxmVGhldGEgPSAoIGZyb21Sb3QudyAqIHRvUm90LncgKSArXHJcbiAgICAgICAgICAgICggZnJvbVJvdC54ICogdG9Sb3QueCApICtcclxuICAgICAgICAgICAgKCBmcm9tUm90LnkgKiB0b1JvdC55ICkgK1xyXG4gICAgICAgICAgICAoIGZyb21Sb3QueiAqIHRvUm90LnogKTtcclxuICAgICAgICAvLyBpZiBmcm9tUm90PXRvUm90IG9yIGZyb21Sb3Q9LXRvUm90IHRoZW4gdGhldGEgPSAwIGFuZCB3ZSBjYW4gcmV0dXJuIGZyb21cclxuICAgICAgICBpZiAoIE1hdGguYWJzKCBjb3NIYWxmVGhldGEgKSA+PSAxICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oXHJcbiAgICAgICAgICAgICAgICBmcm9tUm90LncsXHJcbiAgICAgICAgICAgICAgICBmcm9tUm90LngsXHJcbiAgICAgICAgICAgICAgICBmcm9tUm90LnksXHJcbiAgICAgICAgICAgICAgICBmcm9tUm90LnogKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29zSGFsZlRoZXRhIG11c3QgYmUgcG9zaXRpdmUgdG8gcmV0dXJuIHRoZSBzaG9ydGVzdCBhbmdsZVxyXG4gICAgICAgIGlmICggY29zSGFsZlRoZXRhIDwgMCApIHtcclxuICAgICAgICAgICAgZnJvbVJvdCA9IGZyb21Sb3QubmVnYXRlKCk7XHJcbiAgICAgICAgICAgIGNvc0hhbGZUaGV0YSA9IC1jb3NIYWxmVGhldGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoYWxmVGhldGEgPSBNYXRoLmFjb3MoIGNvc0hhbGZUaGV0YSApO1xyXG4gICAgICAgIHZhciBzaW5IYWxmVGhldGEgPSBNYXRoLnNxcnQoIDEgLSBjb3NIYWxmVGhldGEgKiBjb3NIYWxmVGhldGEgKTtcclxuICAgICAgICB2YXIgc2NhbGVGcm9tID0gTWF0aC5zaW4oICggMS4wIC0gdCApICogaGFsZlRoZXRhICkgLyBzaW5IYWxmVGhldGE7XHJcbiAgICAgICAgdmFyIHNjYWxlVG8gPSBNYXRoLnNpbiggdCAqIGhhbGZUaGV0YSApIC8gc2luSGFsZlRoZXRhO1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihcclxuICAgICAgICAgICAgZnJvbVJvdC53ICogc2NhbGVGcm9tICsgdG9Sb3QudyAqIHNjYWxlVG8sXHJcbiAgICAgICAgICAgIGZyb21Sb3QueCAqIHNjYWxlRnJvbSArIHRvUm90LnggKiBzY2FsZVRvLFxyXG4gICAgICAgICAgICBmcm9tUm90LnkgKiBzY2FsZUZyb20gKyB0b1JvdC55ICogc2NhbGVUbyxcclxuICAgICAgICAgICAgZnJvbVJvdC56ICogc2NhbGVGcm9tICsgdG9Sb3QueiAqIHNjYWxlVG8gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgdmVjdG9yLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgUXVhdGVybmlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7UXVhdGVybmlvbnxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIGNhbGN1bGF0ZSB0aGUgZG90IHByb2R1Y3Qgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiggdGhhdCwgZXBzaWxvbiApIHtcclxuICAgICAgICB2YXIgdyA9IHRoYXQudyAhPT0gdW5kZWZpbmVkID8gdGhhdC53IDogdGhhdFswXSxcclxuICAgICAgICAgICAgeCA9IHRoYXQueCAhPT0gdW5kZWZpbmVkID8gdGhhdC54IDogdGhhdFsxXSxcclxuICAgICAgICAgICAgeSA9IHRoYXQueSAhPT0gdW5kZWZpbmVkID8gdGhhdC55IDogdGhhdFsyXSxcclxuICAgICAgICAgICAgeiA9IHRoYXQueiAhPT0gdW5kZWZpbmVkID8gdGhhdC56IDogdGhhdFszXTtcclxuICAgICAgICBlcHNpbG9uID0gZXBzaWxvbiA9PT0gdW5kZWZpbmVkID8gMCA6IGVwc2lsb247XHJcbiAgICAgICAgcmV0dXJuICggdGhpcy53ID09PSB3IHx8IE1hdGguYWJzKCB0aGlzLncgLSB3ICkgPD0gZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgICggdGhpcy54ID09PSB4IHx8IE1hdGguYWJzKCB0aGlzLnggLSB4ICkgPD0gZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgICggdGhpcy55ID09PSB5IHx8IE1hdGguYWJzKCB0aGlzLnkgLSB5ICkgPD0gZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgICggdGhpcy56ID09PSB6IHx8IE1hdGguYWJzKCB0aGlzLnogLSB6ICkgPD0gZXBzaWxvbiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBuZXcgUXVhdGVybmlvbiBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBxdWF0ZXJuaW9uIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbWFnID0gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy54KnRoaXMueCArXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkqdGhpcy55ICtcclxuICAgICAgICAgICAgICAgIHRoaXMueip0aGlzLnogK1xyXG4gICAgICAgICAgICAgICAgdGhpcy53KnRoaXMudyApO1xyXG4gICAgICAgIGlmICggbWFnICE9PSAwICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLncgLyBtYWcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggLyBtYWcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgLyBtYWcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnogLyBtYWcgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29uanVnYXRlIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gVGhlIGNvbmp1Z2F0ZSBvZiB0aGUgcXVhdGVybmlvbi5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5wcm90b3R5cGUuY29uanVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbiggdGhpcy53LCAtdGhpcy54LCAtdGhpcy55LCAtdGhpcy56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgcXVhdGVybmlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1F1YXRlcm5pb259IFRoZSBpbnZlcnNlIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uanVnYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHJhbmRvbSBRdWF0ZXJuaW9uIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UXVhdGVybmlvbn0gQSByYW5kb20gdmVjdG9yIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBheGlzID0gVmVjMy5yYW5kb20oKS5ub3JtYWxpemUoKSxcclxuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIHJldHVybiBRdWF0ZXJuaW9uLnJvdGF0aW9uUmFkaWFucyggYW5nbGUsIGF4aXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFF1YXRlcm5pb25cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBxdWF0ZXJuaW9uLlxyXG4gICAgICovXHJcbiAgICBRdWF0ZXJuaW9uLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnkgKyBcIiwgXCIgKyB0aGlzLnogKyBcIiwgXCIgKyB0aGlzLnc7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVhdGVybmlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBRdWF0ZXJuaW9uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgcXVhdGVybmlvbiBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgUXVhdGVybmlvbi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbICB0aGlzLncsIHRoaXMueCwgdGhpcy55LCB0aGlzLnogXTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBRdWF0ZXJuaW9uO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBWZWMzID0gcmVxdWlyZSggJy4vVmVjMycgKSxcclxuICAgICAgICBNYXQzMyA9IHJlcXVpcmUoICcuL01hdDMzJyApLFxyXG4gICAgICAgIE1hdDQ0ID0gcmVxdWlyZSggJy4vTWF0NDQnICk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBUcmFuc2Zvcm0gb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFRyYW5zZm9ybVxyXG4gICAgICogQGNsYXNzZGVzYyBBIHRyYW5zZm9ybSByZXByZXNlbnRpbmcgYW4gb3JpZW50YXRpb24sIHBvc2l0aW9uLCBhbmQgc2NhbGUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFRyYW5zZm9ybSggdGhhdCApIHtcclxuICAgICAgICB0aGF0ID0gdGhhdCB8fCB7fTtcclxuICAgICAgICBpZiAoIHRoYXQuX3VwICYmXHJcbiAgICAgICAgICAgIHRoYXQuX2ZvcndhcmQgJiZcclxuICAgICAgICAgICAgdGhhdC5fbGVmdCAmJlxyXG4gICAgICAgICAgICB0aGF0Ll9vcmlnaW4gJiZcclxuICAgICAgICAgICAgdGhhdC5fc2NhbGUgKSB7XHJcbiAgICAgICAgICAgIC8vIGNvcHkgVHJhbnNmb3JtIGJ5IHZhbHVlXHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gdGhhdC51cCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gdGhhdC5mb3J3YXJkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSB0aGF0LmxlZnQoKTtcclxuICAgICAgICAgICAgdGhpcy5fb3JpZ2luID0gdGhhdC5vcmlnaW4oKTtcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGUgPSB0aGF0LnNjYWxlKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdGhhdC5kYXRhICYmIHRoYXQuZGF0YSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAvLyBNYXQzMyBvciBNYXQ0NCwgZXh0cmFjdCB0cmFuc2Zvcm0gY29tcG9uZW50cyBmcm9tIE1hdDQ0XHJcbiAgICAgICAgICAgIHRoYXQgPSB0aGF0LmRlY29tcG9zZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl91cCA9IHRoYXQudXA7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSB0aGF0LmZvcndhcmQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSB0aGF0LmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlID0gdGhhdC5zY2FsZTtcclxuICAgICAgICAgICAgdGhpcy5fb3JpZ2luID0gdGhhdC5vcmlnaW4gfHwgbmV3IFZlYzMoIDAsIDAsIDAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGlkZW50aXR5XHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gdGhhdC51cCA/IG5ldyBWZWMzKCB0aGF0LnVwICkubm9ybWFsaXplKCkgOiBuZXcgVmVjMyggMCwgMSwgMCApO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gdGhhdC5mb3J3YXJkID8gbmV3IFZlYzMoIHRoYXQuZm9yd2FyZCApLm5vcm1hbGl6ZSgpIDogbmV3IFZlYzMoIDAsIDAsIDEgKTtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IHRoYXQubGVmdCA/IG5ldyBWZWMzKCB0aGF0LmxlZnQgKS5ub3JtYWxpemUoKSA6IHRoaXMuX3VwLmNyb3NzKCB0aGlzLl9mb3J3YXJkICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luKCB0aGF0Lm9yaWdpbiB8fCBuZXcgVmVjMyggMCwgMCwgMCApICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGUoIHRoYXQuc2NhbGUgfHwgbmV3IFZlYzMoIDEsIDEsIDEgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gaWRlbnRpdHkgdHJhbnNmb3JtLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IEFuIGlkZW50aXR5IHRyYW5zZm9ybS5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLmlkZW50aXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm0oe1xyXG4gICAgICAgICAgICB1cDogbmV3IFZlYzMoIDAsIDEsIDAgKSxcclxuICAgICAgICAgICAgZm9yd2FyZDogbmV3IFZlYzMoIDAsIDAsIDEgKSxcclxuICAgICAgICAgICAgbGVmdDogbmV3IFZlYzMoIDEsIDAsIDAgKSxcclxuICAgICAgICAgICAgb3JpZ2luOiBuZXcgVmVjMyggMCwgMCwgMCApLFxyXG4gICAgICAgICAgICBzY2FsZTogbmV3IFZlYzMoIDEsIDEsIDEgKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCBzZXRzIHRoZSBvcmlnaW4sIG90aGVyd2lzZSByZXR1cm5zIHRoZVxyXG4gICAgICogb3JpZ2luIGJ5IHZhbHVlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIG9yaWdpbi4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN8VHJhbnNmb3JtfSBUaGUgb3JpZ2luLCBvciB0aGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5vcmlnaW4gPSBmdW5jdGlvbiggb3JpZ2luICkge1xyXG4gICAgICAgIGlmICggb3JpZ2luICkge1xyXG4gICAgICAgICAgICB0aGlzLl9vcmlnaW4gPSBuZXcgVmVjMyggb3JpZ2luICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMuX29yaWdpbiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCBzZXRzIHRoZSBmb3J3YXJkIHZlY3Rvciwgb3RoZXJ3aXNlIHJldHVybnNcclxuICAgICAqIHRoZSBmb3J3YXJkIHZlY3RvciBieSB2YWx1ZS4gV2hpbGUgc2V0dGluZywgYSByb3RhdGlvbiBtYXRyaXggZnJvbSB0aGVcclxuICAgICAqIG9yaWduYWwgZm9yd2FyZCB2ZWN0b3IgdG8gdGhlIG5ldyBpcyB1c2VkIHRvIHJvdGF0ZSBhbGwgb3RoZXIgYXhlcy5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IG9yaWdpbiAtIFRoZSBmb3J3YXJkIHZlY3Rvci4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN8VHJhbnNmb3JtfSBUaGUgZm9yd2FyZCB2ZWN0b3IsIG9yIHRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLmZvcndhcmQgPSBmdW5jdGlvbiggZm9yd2FyZCApIHtcclxuICAgICAgICBpZiAoIGZvcndhcmQgKSB7XHJcbiAgICAgICAgICAgIGlmICggZm9yd2FyZCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgZm9yd2FyZCA9IG5ldyBWZWMzKCBmb3J3YXJkICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gZm9yd2FyZC5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcm90ID0gTWF0MzMucm90YXRpb25Gcm9tVG8oIHRoaXMuX2ZvcndhcmQsIGZvcndhcmQgKTtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZCA9IGZvcndhcmQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gcm90Lm11bHQoIHRoaXMuX3VwICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQgPSByb3QubXVsdCggdGhpcy5fbGVmdCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLl9mb3J3YXJkICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHNldHMgdGhlIHVwIHZlY3Rvciwgb3RoZXJ3aXNlIHJldHVybnNcclxuICAgICAqIHRoZSB1cCB2ZWN0b3IgYnkgdmFsdWUuIFdoaWxlIHNldHRpbmcsIGEgcm90YXRpb24gbWF0cml4IGZyb20gdGhlXHJcbiAgICAgKiBvcmlnbmFsIHVwIHZlY3RvciB0byB0aGUgbmV3IGlzIHVzZWQgdG8gcm90YXRlIGFsbCBvdGhlciBheGVzLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIHVwIHZlY3Rvci4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN8VHJhbnNmb3JtfSBUaGUgdXAgdmVjdG9yLCBvciB0aGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS51cCA9IGZ1bmN0aW9uKCB1cCApIHtcclxuICAgICAgICBpZiAoIHVwICkge1xyXG4gICAgICAgICAgICBpZiAoIHVwIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICB1cCA9IG5ldyBWZWMzKCB1cCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXAgPSB1cC5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcm90ID0gTWF0MzMucm90YXRpb25Gcm9tVG8oIHRoaXMuX3VwLCB1cCApO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gcm90Lm11bHQoIHRoaXMuX2ZvcndhcmQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSB1cDtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IHJvdC5tdWx0KCB0aGlzLl9sZWZ0ICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMuX3VwICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgYW4gYXJndW1lbnQgaXMgcHJvdmlkZWQsIHNldHMgdGhlIGxlZnQgdmVjdG9yLCBvdGhlcndpc2UgcmV0dXJuc1xyXG4gICAgICogdGhlIGxlZnQgdmVjdG9yIGJ5IHZhbHVlLiBXaGlsZSBzZXR0aW5nLCBhIHJvdGF0aW9uIG1hdHJpeCBmcm9tIHRoZVxyXG4gICAgICogb3JpZ25hbCBsZWZ0IHZlY3RvciB0byB0aGUgbmV3IGlzIHVzZWQgdG8gcm90YXRlIGFsbCBvdGhlciBheGVzLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gb3JpZ2luIC0gVGhlIGxlZnQgdmVjdG9yLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM3xUcmFuc2Zvcm19IFRoZSBsZWZ0IHZlY3Rvciwgb3IgdGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUubGVmdCA9IGZ1bmN0aW9uKCBsZWZ0ICkge1xyXG4gICAgICAgIGlmICggbGVmdCApIHtcclxuICAgICAgICAgICAgaWYgKCBsZWZ0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbmV3IFZlYzMoIGxlZnQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBsZWZ0Lm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBNYXQzMy5yb3RhdGlvbkZyb21UbyggdGhpcy5fbGVmdCwgbGVmdCApO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gcm90Lm11bHQoIHRoaXMuX2ZvcndhcmQgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSByb3QubXVsdCggdGhpcy5fdXAgKS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMuX2xlZnQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBhbiBhcmd1bWVudCBpcyBwcm92aWRlZCwgc2V0cyB0aGUgc2FjbGUsIG90aGVyd2lzZSByZXR1cm5zIHRoZVxyXG4gICAgICogc2NhbGUgYnkgdmFsdWUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fG51bWJlcn0gc2NhbGUgLSBUaGUgc2NhbGUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfFRyYW5zZm9ybX0gVGhlIHNjYWxlLCBvciB0aGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uKCBzY2FsZSApIHtcclxuICAgICAgICBpZiAoIHNjYWxlICkge1xyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzY2FsZSA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlID0gbmV3IFZlYzMoIHNjYWxlLCBzY2FsZSwgc2NhbGUgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlID0gbmV3IFZlYzMoIHNjYWxlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSB0cmFuc2Zvcm0gYnkgYW5vdGhlciB0cmFuc2Zvcm0gb3IgbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TWF0MzN8TWF0NDR8VHJhbnNmb3JtfEFycmF5fSB0aGF0IC0gVGhlIHRyYW5zZm9ybSB0byBtdWx0aXBseSB3aXRoLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSB8fFxyXG4gICAgICAgICAgICB0aGF0LmRhdGEgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgLy8gbWF0cml4IG9yIGFycmF5XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKCB0aGlzLm1hdHJpeCgpLm11bHQoIHRoYXQgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICByZXR1cm4gbmV3IFRyYW5zZm9ybSggdGhpcy5tYXRyaXgoKS5tdWx0KCB0aGF0Lm1hdHJpeCgpICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyBzY2FsZSBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgc2NhbGUgbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnNjYWxlTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdDQ0LnNjYWxlKCB0aGlzLl9zY2FsZSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zZm9ybSdzIHJvdGF0aW9uIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUucm90YXRpb25NYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KFtcclxuICAgICAgICAgICAgdGhpcy5fbGVmdC54LCB0aGlzLl9sZWZ0LnksIHRoaXMuX2xlZnQueiwgMCxcclxuICAgICAgICAgICAgdGhpcy5fdXAueCwgdGhpcy5fdXAueSwgdGhpcy5fdXAueiwgMCxcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZC54LCB0aGlzLl9mb3J3YXJkLnksIHRoaXMuX2ZvcndhcmQueiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyB0cmFuc2xhdGlvbiBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnRyYW5zbGF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdDQ0LnRyYW5zbGF0aW9uKCB0aGlzLl9vcmlnaW4gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyBhZmZpbmUtdHJhbnNmb3JtYXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGFmZmluZS10cmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUubWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gVCAqIFIgKiBTXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25NYXRyaXgoKVxyXG4gICAgICAgICAgICAubXVsdCggdGhpcy5yb3RhdGlvbk1hdHJpeCgpIClcclxuICAgICAgICAgICAgLm11bHQoIHRoaXMuc2NhbGVNYXRyaXgoKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIHRyYW5zZm9ybSdzIHNjYWxlIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpbnZlcnNlIHNjYWxlIG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlU2NhbGVNYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTWF0NDQuc2NhbGUoIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICAxL3RoaXMuX3NjYWxlLngsXHJcbiAgICAgICAgICAgIDEvdGhpcy5fc2NhbGUueSxcclxuICAgICAgICAgICAgMS90aGlzLl9zY2FsZS56ICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSB0cmFuc2Zvcm0ncyByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge01hdDQ0fSBUaGUgaW52ZXJzZSByb3RhdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVJvdGF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0NChbXHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQueCwgdGhpcy5fdXAueCwgdGhpcy5fZm9yd2FyZC54LCAwLFxyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0LnksIHRoaXMuX3VwLnksIHRoaXMuX2ZvcndhcmQueSwgMCxcclxuICAgICAgICAgICAgdGhpcy5fbGVmdC56LCB0aGlzLl91cC56LCB0aGlzLl9mb3J3YXJkLnosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgdHJhbnNmb3JtJ3MgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtNYXQ0NH0gVGhlIGludmVyc2UgdHJhbnNsYXRpb24gbWF0cml4LlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLmludmVyc2VUcmFuc2xhdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNYXQ0NC50cmFuc2xhdGlvbiggdGhpcy5fb3JpZ2luLm5lZ2F0ZSgpICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgdHJhbnNmb3JtJ3MgYWZmaW5lLXRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSBpbnZlcnNlIGFmZmluZS10cmFuc2Zvcm1hdGlvbiBtYXRyaXguXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZU1hdHJpeCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIFNeLTEgKiBSXi0xICogVF4tMVxyXG4gICAgICAgIHJldHVybiB0aGlzLmludmVyc2VTY2FsZU1hdHJpeCgpXHJcbiAgICAgICAgICAgIC5tdWx0KCB0aGlzLmludmVyc2VSb3RhdGlvbk1hdHJpeCgpIClcclxuICAgICAgICAgICAgLm11bHQoIHRoaXMuaW52ZXJzZVRyYW5zbGF0aW9uTWF0cml4KCkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0ncyB2aWV3IG1hdHJpeC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NDR9IFRoZSB2aWV3IG1hdHJpeC5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS52aWV3TWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG5PcmlnaW4gPSB0aGlzLl9vcmlnaW4ubmVnYXRlKCksXHJcbiAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5fbGVmdC5uZWdhdGUoKSxcclxuICAgICAgICAgICAgYmFja3dhcmQgPSB0aGlzLl9mb3J3YXJkLm5lZ2F0ZSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NDQoW1xyXG4gICAgICAgICAgICByaWdodC54LCB0aGlzLl91cC54LCBiYWNrd2FyZC54LCAwLFxyXG4gICAgICAgICAgICByaWdodC55LCB0aGlzLl91cC55LCBiYWNrd2FyZC55LCAwLFxyXG4gICAgICAgICAgICByaWdodC56LCB0aGlzLl91cC56LCBiYWNrd2FyZC56LCAwLFxyXG4gICAgICAgICAgICBuT3JpZ2luLmRvdCggcmlnaHQgKSwgbk9yaWdpbi5kb3QoIHRoaXMuX3VwICksIG5PcmlnaW4uZG90KCBiYWNrd2FyZCApLCAxIF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIHRyYW5zZm9ybSBpbiB3b3JsZCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRyYW5zbGF0aW9uIC0gVGhlIHRyYW5zbGF0aW9uIHZlY3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS50cmFuc2xhdGVXb3JsZCA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbiApIHtcclxuICAgICAgICB0aGlzLl9vcmlnaW4gPSB0aGlzLl9vcmlnaW4uYWRkKCB0cmFuc2xhdGlvbiApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIHRyYW5zZm9ybSBpbiBsb2NhbCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHRyYW5zbGF0aW9uIC0gVGhlIHRyYW5zbGF0aW9uIHZlY3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS50cmFuc2xhdGVMb2NhbCA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbiApIHtcclxuICAgICAgICBpZiAoIHRyYW5zbGF0aW9uIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uID0gbmV3IFZlYzMoIHRyYW5zbGF0aW9uICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX29yaWdpbiA9IHRoaXMuX29yaWdpbi5hZGQoIHRoaXMuX2xlZnQubXVsdCggdHJhbnNsYXRpb24ueCApIClcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5fdXAubXVsdCggdHJhbnNsYXRpb24ueSApIClcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5fZm9yd2FyZC5tdWx0KCB0cmFuc2xhdGlvbi56ICkgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSb3RhdGVzIHRoZSB0cmFuc2Zvcm0gYnkgYW4gYW5nbGUgYXJvdW5kIGFuIGF4aXMgaW4gd29ybGQgc3BhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gZGVncmVlcy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5yb3RhdGVXb3JsZERlZ3JlZXMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRlV29ybGRSYWRpYW5zKCBhbmdsZSAqIE1hdGguUEkgLyAxODAsIGF4aXMgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSb3RhdGVzIHRoZSB0cmFuc2Zvcm0gYnkgYW4gYW5nbGUgYXJvdW5kIGFuIGF4aXMgaW4gd29ybGQgc3BhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSByb3RhdGlvbiwgaW4gcmFkaWFucy5cclxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIG9mIHRoZSByb3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgdHJhbnNmb3JtIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS5yb3RhdGVXb3JsZFJhZGlhbnMgPSBmdW5jdGlvbiggYW5nbGUsIGF4aXMgKSB7XHJcbiAgICAgICAgdmFyIHJvdCA9IE1hdDMzLnJvdGF0aW9uUmFkaWFucyggYW5nbGUsIGF4aXMgKTtcclxuICAgICAgICB0aGlzLl91cCA9IHJvdC5tdWx0KCB0aGlzLl91cCApO1xyXG4gICAgICAgIHRoaXMuX2ZvcndhcmQgPSByb3QubXVsdCggdGhpcy5fZm9yd2FyZCApO1xyXG4gICAgICAgIHRoaXMuX2xlZnQgPSByb3QubXVsdCggdGhpcy5fbGVmdCApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJvdGF0ZXMgdGhlIHRyYW5zZm9ybSBieSBhbiBhbmdsZSBhcm91bmQgYW4gYXhpcyBpbiBsb2NhbCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIHJvdGF0aW9uLCBpbiBkZWdyZWVzLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIC0gVGhlIGF4aXMgb2YgdGhlIHJvdGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLnJvdGF0ZUxvY2FsRGVncmVlcyA9IGZ1bmN0aW9uKCBhbmdsZSwgYXhpcyApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGVXb3JsZERlZ3JlZXMoIGFuZ2xlLCB0aGlzLnJvdGF0aW9uTWF0cml4KCkubXVsdCggYXhpcyApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUm90YXRlcyB0aGUgdHJhbnNmb3JtIGJ5IGFuIGFuZ2xlIGFyb3VuZCBhbiBheGlzIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgcm90YXRpb24sIGluIHJhZGlhbnMuXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGF4aXMgLSBUaGUgYXhpcyBvZiB0aGUgcm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gVGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUucm90YXRlTG9jYWxSYWRpYW5zID0gZnVuY3Rpb24oIGFuZ2xlLCBheGlzICkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZVdvcmxkUmFkaWFucyggYW5nbGUsIHRoaXMucm90YXRpb25NYXRyaXgoKS5tdWx0KCBheGlzICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFuc2Zvcm1zIHRoZSB2ZWN0b3Igb3IgbWF0cml4IGFyZ3VtZW50IGZyb20gdGhlIHRyYW5zZm9ybXMgbG9jYWwgc3BhY2VcclxuICAgICAqIHRvIHRoZSB3b3JsZCBzcGFjZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxNYXQzM3xNYXQ0NH0gdGhhdCAtIFRoZSBhcmd1bWVudCB0byB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVNjYWxlIC0gV2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgc2NhbGUgaW4gdGhlIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWdub3JlUm90YXRpb24gLSBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIHRoZSByb3RhdGlvbiBpbiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZ25vcmVUcmFuc2xhdGlvbiAtIFdoZXRoZXIgb3Igbm90IHRvIGluY2x1ZGUgdGhlIHRyYW5zbGF0aW9uIGluIHRoZSB0cmFuc2Zvcm0uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX0gVGhlIHRyYW5zZm9ybSBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUubG9jYWxUb1dvcmxkID0gZnVuY3Rpb24oIHRoYXQsIGlnbm9yZVNjYWxlLCBpZ25vcmVSb3RhdGlvbiwgaWdub3JlVHJhbnNsYXRpb24gKSB7XHJcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBNYXQ0NCgpO1xyXG4gICAgICAgIGlmICggIWlnbm9yZVNjYWxlICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLnNjYWxlTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIWlnbm9yZVJvdGF0aW9uICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLnJvdGF0aW9uTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIWlnbm9yZVRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLnRyYW5zbGF0aW9uTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXQubXVsdCggdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zZm9ybXMgdGhlIHZlY3RvciBvciBtYXRyaXggYXJndW1lbnQgZnJvbSB3b3JsZCBzcGFjZSB0byB0aGVcclxuICAgICAqIHRyYW5zZm9ybXMgbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8TWF0MzN8TWF0NDR9IHRoYXQgLSBUaGUgYXJndW1lbnQgdG8gdHJhbnNmb3JtLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZ25vcmVTY2FsZSAtIFdoZXRoZXIgb3Igbm90IHRvIGluY2x1ZGUgdGhlIHNjYWxlIGluIHRoZSB0cmFuc2Zvcm0uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZVJvdGF0aW9uIC0gV2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgcm90YXRpb24gaW4gdGhlIHRyYW5zZm9ybS5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWdub3JlVHJhbnNsYXRpb24gLSBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIHRoZSB0cmFuc2xhdGlvbiBpbiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19IFRoZSB0cmFuc2Zvcm0gZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUcmFuc2Zvcm0ucHJvdG90eXBlLndvcmxkVG9Mb2NhbCA9IGZ1bmN0aW9uKCB0aGF0LCBpZ25vcmVTY2FsZSwgaWdub3JlUm90YXRpb24sIGlnbm9yZVRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgIHZhciBtYXQgPSBuZXcgTWF0NDQoKTtcclxuICAgICAgICBpZiAoICFpZ25vcmVUcmFuc2xhdGlvbiApIHtcclxuICAgICAgICAgICAgbWF0ID0gdGhpcy5pbnZlcnNlVHJhbnNsYXRpb25NYXRyaXgoKS5tdWx0KCBtYXQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhaWdub3JlUm90YXRpb24gKSB7XHJcbiAgICAgICAgICAgIG1hdCA9IHRoaXMuaW52ZXJzZVJvdGF0aW9uTWF0cml4KCkubXVsdCggbWF0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIWlnbm9yZVNjYWxlICkge1xyXG4gICAgICAgICAgICBtYXQgPSB0aGlzLmludmVyc2VTY2FsZU1hdHJpeCgpLm11bHQoIG1hdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0Lm11bHQoIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGFsbCBjb21wb25lbnRzIG1hdGNoIHRob3NlIG9mIGEgcHJvdmlkZWQgdHJhbnNmb3JtLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJhbnNmb3JtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUcmFuc2Zvcm19IHRoYXQgLSBUaGUgbWF0cml4IHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdHJhbnNmb3JtIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFRyYW5zZm9ybS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWdpbi5lcXVhbHMoIHRoYXQub3JpZ2luKCksIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkLmVxdWFscyggdGhhdC5mb3J3YXJkKCksIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLl91cC5lcXVhbHMoIHRoYXQudXAoKSwgZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnQuZXF1YWxzKCB0aGF0LmxlZnQoKSwgZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlLmVxdWFscyggdGhhdC5zY2FsZSgpLCBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHRyYW5zZm9ybSB3aXRoIGEgcmFuZG9tIG9yaWdpbiwgb3JpZW50YXRpb24sIGFuZCBzY2FsZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmFuc2Zvcm1cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfSBUaGUgcmFuZG9tIHRyYW5zZm9ybS5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKClcclxuICAgICAgICAgICAgLm9yaWdpbiggVmVjMy5yYW5kb20oKSApXHJcbiAgICAgICAgICAgIC5mb3J3YXJkKCBWZWMzLnJhbmRvbSgpIClcclxuICAgICAgICAgICAgLnNjYWxlKCBWZWMzLnJhbmRvbSgpICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhbnNmb3JtLlxyXG4gICAgICogQG1lbWJlcm9mIFRyYW5zZm9ybVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYW5zZm9ybS5cclxuICAgICAqL1xyXG4gICAgVHJhbnNmb3JtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hdHJpeCgpLnRvU3RyaW5nKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVHJhbnNmb3JtO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVjMyA9IHJlcXVpcmUoJy4vVmVjMycpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVHJpYW5nbGUgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFRyaWFuZ2xlXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgQ0NXLXdpbmRlZCB0cmlhbmdsZSBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFRyaWFuZ2xlKCkge1xyXG4gICAgICAgIHN3aXRjaCAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9yIG9iamVjdCBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYSA9IG5ldyBWZWMzKCBhcmdbMF0gfHwgYXJnLmEgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYiA9IG5ldyBWZWMzKCBhcmdbMV0gfHwgYXJnLmIgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYyA9IG5ldyBWZWMzKCBhcmdbMl0gfHwgYXJnLmMgKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIHZlY3RvciBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMuYSA9IG5ldyBWZWMzKCBhcmd1bWVudHNbMF0gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYiA9IG5ldyBWZWMzKCBhcmd1bWVudHNbMV0gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYyA9IG5ldyBWZWMzKCBhcmd1bWVudHNbMl0gKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gbmV3IFZlYzMoIDAsIDAsIDAgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYiA9IG5ldyBWZWMzKCAxLCAwLCAwICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmMgPSBuZXcgVmVjMyggMSwgMSwgMCApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgcmFkaXVzIG9mIHRoZSBib3VuZGluZyBzcGhlcmUgb2YgdGhlIHRyaWFuZ2xlLlxyXG4gICAgICogQG1lbWJlcm9mIFRyaWFuZ2xlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHJhZGl1cyBvZiB0aGUgYm91bmRpbmcgc3BoZXJlLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUucmFkaXVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGNlbnRyb2lkID0gdGhpcy5jZW50cm9pZCgpLFxyXG4gICAgICAgICAgICBhRGlzdCA9IHRoaXMuYS5zdWIoIGNlbnRyb2lkICkubGVuZ3RoKCksXHJcbiAgICAgICAgICAgIGJEaXN0ID0gdGhpcy5iLnN1YiggY2VudHJvaWQgKS5sZW5ndGgoKSxcclxuICAgICAgICAgICAgY0Rpc3QgPSB0aGlzLmMuc3ViKCBjZW50cm9pZCApLmxlbmd0aCgpO1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCggYURpc3QsIE1hdGgubWF4KCBiRGlzdCwgY0Rpc3QgKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNlbnRyb2lkIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmlhbmdsZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBjZW50cm9pZCBvZiB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS5jZW50cm9pZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5iIClcclxuICAgICAgICAgICAgLmFkZCggdGhpcy5jIClcclxuICAgICAgICAgICAgLmRpdiggMyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbCBvZiB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbm9ybWFsIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqL1xyXG4gICAgVHJpYW5nbGUucHJvdG90eXBlLm5vcm1hbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhYiA9IHRoaXMuYi5zdWIoIHRoaXMuYSApLFxyXG4gICAgICAgICAgICBhYyA9IHRoaXMuYy5zdWIoIHRoaXMuYSApO1xyXG4gICAgICAgIHJldHVybiBhYi5jcm9zcyggYWMgKS5ub3JtYWxpemUoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBhcmVhIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqIEBtZW1iZXJvZiBUcmlhbmdsZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhcmVhIG9mIHRoZSB0cmlhbmdsZS5cclxuICAgICAqL1xyXG4gICAgVHJpYW5nbGUucHJvdG90eXBlLmFyZWEgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYWIgPSB0aGlzLmIuc3ViKCB0aGlzLmEgKSxcclxuICAgICAgICAgICAgYWMgPSB0aGlzLmMuc3ViKCB0aGlzLmEgKTtcclxuICAgICAgICByZXR1cm4gYWIuY3Jvc3MoIGFjICkubGVuZ3RoKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZ2l2ZW4gZWRnZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZWRnZUlkIC0gVGhlIGlkIHN0cmluZyBmb3IgdGhlIGVkZ2UuIGV4ICdhYidcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3BlY2lmaWVkIGVkZ2Ugb2YgdGhlIHRyaWFuZ2xlLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUuZWRnZSA9IGZ1bmN0aW9uKCBlZGdlSWQgKSB7XHJcbiAgICAgICAgc3dpdGNoICggZWRnZUlkLnRvTG93ZXJDYXNlKCkgKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJhYlwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYi5zdWIoIHRoaXMuYSApO1xyXG4gICAgICAgICAgICBjYXNlIFwiYWNcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmMuc3ViKCB0aGlzLmEgKTtcclxuICAgICAgICAgICAgY2FzZSBcImJhXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hLnN1YiggdGhpcy5iICk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJiY1wiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYy5zdWIoIHRoaXMuYiApO1xyXG4gICAgICAgICAgICBjYXNlIFwiY2FcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmEuc3ViKCB0aGlzLmMgKTtcclxuICAgICAgICAgICAgY2FzZSBcImNiXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iLnN1YiggdGhpcy5jICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUud2FybiggXCJVbnJlY29nbml6ZWQgZWRnZSBpZCAnXCIgKyBlZGdlSWQgKyBcIicsIHJldHVybmluZyAnbnVsbCcuXCIgKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHBvaW50IGlzIGluc2lkZSB0aGUgdHJpYW5nbGUuIFRoZSBwb2ludCBtdXN0IGJlXHJcbiAgICAgKiBjb3BsYW5hci5cclxuICAgICAqIEBtZW1iZXJvZiBUcmlhbmdsZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdGVzdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHBvaW50IGlzIGluc2lkZSB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS5pc0luc2lkZSA9IGZ1bmN0aW9uKCBwb2ludCApIHtcclxuICAgICAgICB2YXIgcCA9IG5ldyBWZWMzKCBwb2ludCApLFxyXG4gICAgICAgICAgICBhID0gdGhpcy5hLFxyXG4gICAgICAgICAgICBiID0gdGhpcy5iLFxyXG4gICAgICAgICAgICBjID0gdGhpcy5jLFxyXG4gICAgICAgICAgICBub3JtYWwgPSB0aGlzLm5vcm1hbCgpO1xyXG4gICAgICAgIC8vIGNvbXB1dGUgYmFyeWNlbnRyaWMgY29vcmRzXHJcbiAgICAgICAgdmFyIHRvdGFsQXJlYURpdiA9IDEgLyBiLnN1YiggYSApLmNyb3NzKCBjLnN1YiggYSApICkuZG90KCBub3JtYWwgKTtcclxuICAgICAgICB2YXIgdSA9IGMuc3ViKCBiICkuY3Jvc3MoIHAuc3ViKCBiICkgKS5kb3QoIG5vcm1hbCApLm11bHQoIHRvdGFsQXJlYURpdiApO1xyXG4gICAgICAgIHZhciB2ID0gYS5zdWIoIGMgKS5jcm9zcyggcC5zdWIoIGMgKSApLmRvdCggbm9ybWFsICkubXVsdCggdG90YWxBcmVhRGl2ICk7XHJcbiAgICAgICAgLy8gcmVqZWN0IGlmIG91dHNpZGUgdHJpYW5nbGVcclxuICAgICAgICBpZiAoIHUgPCAwIHx8IHYgPCAwIHx8IHUgKyB2ID4gMSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcnNlY3QgdGhlIHRyaWFuZ2xlIGFuZCByZXR1cm4gaW50ZXJzZWN0aW9uIGluZm9ybWF0aW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFRyaWFuZ2xlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBvcmlnaW4gLSBUaGUgb3JpZ2luIG9mIHRoZSBpbnRlcnNlY3Rpb24gcmF5XHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IGRpcmVjdGlvbiAtIFRoZSBkaXJlY3Rpb24gb2YgdGhlIGludGVyc2VjdGlvbiByYXkuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZUJlaGluZCAtIFdoZXRoZXIgb3Igbm90IHRvIGlnbm9yZSBpbnRlcnNlY3Rpb25zIGJlaGluZCB0aGUgb3JpZ2luIG9mIHRoZSByYXkuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlnbm9yZUJhY2tmYWNlIC0gV2hldGhlciBvciBub3QgdG8gaWdub3JlIHRoZSBiYWNrZmFjZSBvZiB0aGUgdHJpYW5nbGUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdHxib29sZWFufSBUaGUgaW50ZXJzZWN0aW9uIGluZm9ybWF0aW9uLCBvciBmYWxzZSBpZiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbiggb3JpZ2luLCBkaXJlY3Rpb24sIGlnbm9yZUJlaGluZCwgaWdub3JlQmFja2ZhY2UgKSB7XHJcbiAgICAgICAgLy8gQ29tcHV0ZSByYXkvcGxhbmUgaW50ZXJzZWN0aW9uXHJcbiAgICAgICAgdmFyIG8gPSBuZXcgVmVjMyggb3JpZ2luICksXHJcbiAgICAgICAgICAgIGQgPSBuZXcgVmVjMyggZGlyZWN0aW9uICksXHJcbiAgICAgICAgICAgIG5vcm1hbCA9IHRoaXMubm9ybWFsKCk7XHJcbiAgICAgICAgdmFyIGRuID0gbmV3IFZlYzMoIGQgKS5kb3QoIG5vcm1hbCApO1xyXG4gICAgICAgIGlmICggZG4gPT09IDAgfHwgKCBpZ25vcmVCYWNrZmFjZSAmJiBkbiA+IDAgKSApIHtcclxuICAgICAgICAgICAgLy8gcmF5IGlzIHBhcmFsbGVsIHRvIHBsYW5lLCBvciBjb21pbmcgZnJvbSBiZWhpbmRcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdCA9IHRoaXMuYS5zdWIoIG8gKS5kb3QoIG5vcm1hbCApIC8gZG47XHJcbiAgICAgICAgaWYgKCBpZ25vcmVCZWhpbmQgJiYgdCA8IDAgKSB7XHJcbiAgICAgICAgICAgIC8vIHBsYW5lIGlzIGJlaGluZCByYXlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW50ZXJzZWN0aW9uID0gby5hZGQoIGQubXVsdCggdCApICk7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgcG9pbnQgaXMgaW5zaWRlIHRoZSB0cmlhbmdsZVxyXG4gICAgICAgIGlmICggIXRoaXMuaXNJbnNpZGUoIGludGVyc2VjdGlvbiApICkge1xyXG4gICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW50ZXJzZWN0aW9uOiBpbnRlcnNlY3Rpb24sXHJcbiAgICAgICAgICAgIG5vcm1hbDogbm9ybWFsLFxyXG4gICAgICAgICAgICB0OiB0XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjbG9zZXN0IHBvaW50IG9uIHRoZSBzcGVjaWZpZWQgZWRnZSBvZiB0aGUgdHJpYW5nbGUgdG8gdGhlXHJcbiAgICAgKiBzcGVjaWZpZWQgcG9pbnQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZWRnZSAtIFRoZSBlZGdlIGlkIHRvIGZpbmQgdGhlIGNsb3Nlc3QgcG9pbnQgb24uXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IHBvaW50IC0gVGhlIHBvaW50IHRvIHRlc3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBjbG9zZXN0IHBvaW50IG9uIHRoZSBlZGdlLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUuY2xvc2VzdFBvaW50T25FZGdlID0gZnVuY3Rpb24oIGVkZ2UsIHBvaW50ICkge1xyXG4gICAgICAgIHZhciBhID0gdGhpc1sgZWRnZVswXSBdLFxyXG4gICAgICAgICAgICBhYiA9IHRoaXMuZWRnZSggZWRnZSApO1xyXG4gICAgICAgIC8vIHByb2plY3QgYyBvbnRvIGFiLCBjb21wdXRpbmcgcGFyYW1ldGVyaXplZCBwb3NpdGlvbiBkKHQpID0gYSArIHQqKGIgKiBhKVxyXG4gICAgICAgIHZhciB0ID0gbmV3IFZlYzMoIHBvaW50ICkuc3ViKCBhICkuZG90KCBhYiApIC8gYWIuZG90KCBhYiApO1xyXG4gICAgICAgIC8vIElmIG91dHNpZGUgc2VnbWVudCwgY2xhbXAgdCAoYW5kIHRoZXJlZm9yZSBkKSB0byB0aGUgY2xvc2VzdCBlbmRwb2ludFxyXG4gICAgICAgIGlmICggdCA8IDAgKSB7XHJcbiAgICAgICAgICAgIHQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHQgPiAxICkge1xyXG4gICAgICAgICAgICB0ID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29tcHV0ZSBwcm9qZWN0ZWQgcG9zaXRpb24gZnJvbSB0aGUgY2xhbXBlZCB0XHJcbiAgICAgICAgcmV0dXJuIGEucGx1cyggYWIubXVsdCggdCApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY2xvc2VzdCBwb2ludCBvbiB0aGUgdHJpYW5nbGUgdG8gdGhlIHNwZWNpZmllZCBwb2ludC5cclxuICAgICAqIEBtZW1iZXJvZiBUcmlhbmdsZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xBcnJheX0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdGVzdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIGNsb3Nlc3QgcG9pbnQgb24gdGhlIGVkZ2UuXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS5jbG9zZXN0UG9pbnQgPSBmdW5jdGlvbiggcG9pbnQgKSB7XHJcbiAgICAgICAgdmFyIGUwID0gdGhpcy5jbG9zZXN0UG9pbnRPbkVkZ2UoICdhYicsIHBvaW50ICk7XHJcbiAgICAgICAgdmFyIGUxID0gdGhpcy5jbG9zZXN0UG9pbnRPbkVkZ2UoICdiYycsIHBvaW50ICk7XHJcbiAgICAgICAgdmFyIGUyID0gdGhpcy5jbG9zZXN0UG9pbnRPbkVkZ2UoICdjYScsIHBvaW50ICk7XHJcbiAgICAgICAgdmFyIGQwID0gKCBlMCAtIHBvaW50ICkubGVuZ3RoU3F1YXJlZCgpO1xyXG4gICAgICAgIHZhciBkMSA9ICggZTEgLSBwb2ludCApLmxlbmd0aFNxdWFyZWQoKTtcclxuICAgICAgICB2YXIgZDIgPSAoIGUyIC0gcG9pbnQgKS5sZW5ndGhTcXVhcmVkKCk7XHJcbiAgICAgICAgaWYgKCBkMCA8IGQxICkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCBkMCA8IGQyICkgPyBlMCA6IGUyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoIGQxIDwgZDIgKSA/IGUxIDogZTI7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSByYW5kb20gVHJpYW5nbGUgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VHJpYW5nbGV9IEEgcmFuZG9tIHRyaWFuZ2xlIG9mIHVuaXQgcmFkaXVzLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5yYW5kb20gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IFZlYzMucmFuZG9tKCksXHJcbiAgICAgICAgICAgIGIgPSBWZWMzLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBjID0gVmVjMy5yYW5kb20oKSxcclxuICAgICAgICAgICAgY2VudHJvaWQgPSBhLmFkZCggYiApLmFkZCggYyApLmRpdiggMyApLFxyXG4gICAgICAgICAgICBhQ2VudCA9IGEuc3ViKCBjZW50cm9pZCApLFxyXG4gICAgICAgICAgICBiQ2VudCA9IGIuc3ViKCBjZW50cm9pZCApLFxyXG4gICAgICAgICAgICBjQ2VudCA9IGMuc3ViKCBjZW50cm9pZCApLFxyXG4gICAgICAgICAgICBhRGlzdCA9IGFDZW50Lmxlbmd0aCgpLFxyXG4gICAgICAgICAgICBiRGlzdCA9IGJDZW50Lmxlbmd0aCgpLFxyXG4gICAgICAgICAgICBjRGlzdCA9IGNDZW50Lmxlbmd0aCgpLFxyXG4gICAgICAgICAgICBtYXhEaXN0ID0gTWF0aC5tYXgoIE1hdGgubWF4KCBhRGlzdCwgYkRpc3QgKSwgY0Rpc3QgKSxcclxuICAgICAgICAgICAgc2NhbGUgPSAxIC8gbWF4RGlzdDtcclxuICAgICAgICByZXR1cm4gbmV3IFRyaWFuZ2xlKFxyXG4gICAgICAgICAgICBhQ2VudC5tdWx0KCBzY2FsZSApLFxyXG4gICAgICAgICAgICBiQ2VudC5tdWx0KCBzY2FsZSApLFxyXG4gICAgICAgICAgICBjQ2VudC5tdWx0KCBzY2FsZSApICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaCB0aG9zZSBvZiBhIHByb3ZpZGVkIHRyaWFuZ2xlLlxyXG4gICAgICogQW4gb3B0aW9uYWwgZXBzaWxvbiB2YWx1ZSBtYXkgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1RyaWFuZ2xlfSB0aGF0IC0gVGhlIHZlY3RvciB0byB0ZXN0IGVxdWFsaXR5IHdpdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZXBzaWxvbiAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBUcmlhbmdsZS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIHRoYXQsIGVwc2lsb24gKSB7XHJcbiAgICAgICAgZXBzaWxvbiA9IGVwc2lsb24gPT09IHVuZGVmaW5lZCA/IDAgOiBlcHNpbG9uO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmEuZXF1YWxzKCB0aGF0LmEsIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmIuZXF1YWxzKCB0aGF0LmIsIGVwc2lsb24gKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmMuZXF1YWxzKCB0aGF0LmMsIGVwc2lsb24gKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVHJpYW5nbGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFRyaWFuZ2xlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmEudG9TdHJpbmcoKSArIFwiLCBcIiArXHJcbiAgICAgICAgICAgIHRoaXMuYi50b1N0cmluZygpICsgXCIsIFwiICtcclxuICAgICAgICAgICAgdGhpcy5jLnRvU3RyaW5nKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVHJpYW5nbGU7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYSBWZWMyIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBWZWMyXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgdHdvIGNvbXBvbmVudCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFZlYzIoKSB7XHJcbiAgICAgICAgc3dpdGNoICggYXJndW1lbnRzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgLy8gYXJyYXkgb3IgVmVjTiBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJndW1lbnQueCB8fCBhcmd1bWVudFswXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmd1bWVudC55IHx8IGFyZ3VtZW50WzFdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGNvbXBvbmVudCBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbmV3IFZlYzIgd2l0aCBlYWNoIGNvbXBvbmVudCBuZWdhdGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gVGhlIG5lZ2F0ZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIC10aGlzLngsIC10aGlzLnkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgdmVjdG9yIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjMlxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3VtLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSB0aGF0IC0gVGhlIHZlY3RvciB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSBzdW0gb2YgdGhlIHR3byB2ZWN0b3JzLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKCB0aGlzLnggKyB0aGF0WzBdLCB0aGlzLnkgKyB0aGF0WzFdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMiggdGhpcy54ICsgdGhhdC54LCB0aGlzLnkgKyB0aGF0LnkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJ0cmFjdHMgdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCBmcm9tIHRoZSB2ZWN0b3IsIHJldHVybmluZyBhIG5ldyBWZWMyXHJcbiAgICAgKiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkaWZmZXJlbmNlLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSAtIFRoZSB2ZWN0b3IgdG8gc3VidHJhY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSBkaWZmZXJlbmNlIG9mIHRoZSB0d28gdmVjdG9ycy5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMiggdGhpcy54IC0gdGhhdFswXSwgdGhpcy55IC0gdGhhdFsxXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIHRoaXMueCAtIHRoYXQueCwgdGhpcy55IC0gdGhhdC55ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzJcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoIHRoaXMueCAqIHRoYXQsIHRoaXMueSAqIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgc2NhbGFyIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjMlxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBkaXZpZGUgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMiggdGhpcy54IC8gdGhhdCwgdGhpcy55IC8gdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGRvdCBwcm9kdWN0IG9mIHRoZSB2ZWN0b3IgYW5kIHRoZSBwcm92aWRlZFxyXG4gICAgICogdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSAtIFRoZSBvdGhlciB2ZWN0b3IgYXJndW1lbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIGRvdCBwcm9kdWN0LlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuICggdGhpcy54ICogdGhhdFswXSApICsgKCB0aGlzLnkgKiB0aGF0WzFdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXQueCApICsgKCB0aGlzLnkgKiB0aGF0LnkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIDJEIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIHZlY3RvciBhbmQgdGhlIHByb3ZpZGVkXHJcbiAgICAgKiB2ZWN0b3IgYXJndW1lbnQuIFRoaXMgdmFsdWUgcmVwcmVzZW50cyB0aGUgbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3IgdGhhdFxyXG4gICAgICogd291bGQgcmVzdWx0IGZyb20gYSByZWd1bGFyIDNEIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIGlucHV0IHZlY3RvcnMsXHJcbiAgICAgKiB0YWtpbmcgdGhlaXIgWiB2YWx1ZXMgYXMgMC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN8VmVjNHxBcnJheX0gLSBUaGUgb3RoZXIgdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSAyRCBjcm9zcyBwcm9kdWN0LlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0WzFdICkgLSAoIHRoaXMueSAqIHRoYXRbMF0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICggdGhpcy54ICogdGhhdC55ICkgLSAoIHRoaXMueSAqIHRoYXQueCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIG5vIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHNjYWxhciBsZW5ndGggb2ZcclxuICAgICAqIHRoZSB2ZWN0b3IuIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBhIG5ld1xyXG4gICAgICogVmVjMiBzY2FsZWQgdG8gdGhlIHByb3ZpZGVkIGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIGxlbmd0aCB0byBzY2FsZSB0aGUgdmVjdG9yIHRvLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfFZlYzJ9IEVpdGhlciB0aGUgbGVuZ3RoLCBvciBuZXcgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oIGxlbmd0aCApIHtcclxuICAgICAgICBpZiAoIGxlbmd0aCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCB0aGlzLmRvdCggdGhpcyApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHQoIGxlbmd0aCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5sZW5ndGhTcXVhcmVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG90KCB0aGlzICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaCB0aG9zZSBvZiBhIHByb3ZpZGVkIHZlY3Rvci5cclxuICAgICAqIEFuIG9wdGlvbmFsIGVwc2lsb24gdmFsdWUgbWF5IGJlIHByb3ZpZGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSB0aGF0IC0gVGhlIHZlY3RvciB0byB0ZXN0IGVxdWFsaXR5IHdpdGguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZXBzaWxvbiAtIFRoZSBlcHNpbG9uIHZhbHVlLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHZlY3RvciBjb21wb25lbnRzIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiggdGhhdCwgZXBzaWxvbiApIHtcclxuICAgICAgICB2YXIgeCA9IHRoYXQueCAhPT0gdW5kZWZpbmVkID8gdGhhdC54IDogdGhhdFswXSxcclxuICAgICAgICAgICAgeSA9IHRoYXQueSAhPT0gdW5kZWZpbmVkID8gdGhhdC55IDogdGhhdFsxXTtcclxuICAgICAgICBlcHNpbG9uID0gZXBzaWxvbiA9PT0gdW5kZWZpbmVkID8gMCA6IGVwc2lsb247XHJcbiAgICAgICAgcmV0dXJuICggdGhpcy54ID09PSB4IHx8IE1hdGguYWJzKCB0aGlzLnggLSB4ICkgPD0gZXBzaWxvbiApICYmXHJcbiAgICAgICAgICAgICggdGhpcy55ID09PSB5IHx8IE1hdGguYWJzKCB0aGlzLnkgLSB5ICkgPD0gZXBzaWxvbiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBuZXcgVmVjMiBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9IFRoZSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtYWcgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmICggbWFnICE9PSAwICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggLyBtYWcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgLyBtYWcgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgdW5zaWduZWQgYW5nbGUgYmV0d2VlbiB0aGlzIGFuZ2xlIGFuZCB0aGUgYXJndW1lbnQgaW4gcmFkaWFucy5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN8VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gbWVhc3VyZSB0aGUgYW5nbGUgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgdW5zaWduZWQgYW5nbGUgaW4gcmFkaWFucy5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUudW5zaWduZWRBbmdsZVJhZGlhbnMgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICB2YXIgeCA9IHRoYXQueCAhPT0gdW5kZWZpbmVkID8gdGhhdC54IDogdGhhdFswXTtcclxuICAgICAgICB2YXIgeSA9IHRoYXQueSAhPT0gdW5kZWZpbmVkID8gdGhhdC55IDogdGhhdFsxXTtcclxuICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKCB5LCB4ICkgLSBNYXRoLmF0YW4yKCB0aGlzLnksIHRoaXMueCApO1xyXG4gICAgICAgIGlmIChhbmdsZSA8IDApIHtcclxuICAgICAgICAgICAgYW5nbGUgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB1bnNpZ25lZCBhbmdsZSBiZXR3ZWVuIHRoaXMgYW5nbGUgYW5kIHRoZSBhcmd1bWVudCBpbiBkZWdyZWVzLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xWZWM0fEFycmF5fSB0aGF0IC0gVGhlIHZlY3RvciB0byBtZWFzdXJlIHRoZSBhbmdsZSBmcm9tLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSB1bnNpZ25lZCBhbmdsZSBpbiBkZWdyZWVzLlxyXG4gICAgICovXHJcbiAgICBWZWMyLnByb3RvdHlwZS51bnNpZ25lZEFuZ2xlRGVncmVlcyA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVuc2lnbmVkQW5nbGVSYWRpYW5zKCB0aGF0ICkgKiAoIDE4MCAvIE1hdGguUEkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFZlYzIgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfSBBIHJhbmRvbSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFZlYzIucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICkubm9ybWFsaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwiLCBcIiArIHRoaXMueTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjMlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZlY3RvciBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgVmVjMi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55IF07XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVjMjtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFZlYzMgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIFZlYzNcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB0aHJlZSBjb21wb25lbnQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWZWMzKCkge1xyXG4gICAgICAgIHN3aXRjaCAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9yIFZlY04gYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHZhciBhcmd1bWVudCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50LnggfHwgYXJndW1lbnRbMF0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJndW1lbnQueSB8fCBhcmd1bWVudFsxXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnogPSBhcmd1bWVudC56IHx8IGFyZ3VtZW50WzJdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGNvbXBvbmVudCBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWMzIHdpdGggZWFjaCBjb21wb25lbnQgbmVnYXRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBuZWdhdGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCAtdGhpcy54LCAtdGhpcy55LCAtdGhpcy56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzNcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN1bS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIGFkZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHN1bSBvZiB0aGUgdHdvIHZlY3RvcnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMueCArIHRoYXRbMF0sIHRoaXMueSArIHRoYXRbMV0sIHRoaXMueiArIHRoYXRbMl0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLnggKyB0aGF0LngsIHRoaXMueSArIHRoYXQueSwgdGhpcy56ICsgdGhhdC56ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3VidHJhY3RzIHRoZSBwcm92aWRlZCB2ZWN0b3IgYXJndW1lbnQgZnJvbSB0aGUgdmVjdG9yLCByZXR1cm5pbmcgYSBuZXdcclxuICAgICAqIFZlYzMgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZGlmZmVyZW5jZS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIHZlY3RvciB0byBzdWJ0cmFjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIGRpZmZlcmVuY2Ugb2YgdGhlIHR3byB2ZWN0b3JzLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLnggLSB0aGF0WzBdLCB0aGlzLnkgLSB0aGF0WzFdLCB0aGlzLnogLSB0aGF0WzJdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyggdGhpcy54IC0gdGhhdC54LCB0aGlzLnkgLSB0aGF0LnksIHRoaXMueiAtIHRoYXQueiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGxpZXMgdGhlIHZlY3RvciB3aXRoIHRoZSBwcm92aWRlZCBzY2FsYXIgYXJndW1lbnQsIHJldHVybmluZyBhIG5ldyBWZWMzXHJcbiAgICAgKiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gLSBUaGUgc2NhbGFyIHRvIG11bHRpcGx5IHRoZSB2ZWN0b3IgYnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKCB0aGlzLnggKiB0aGF0LCB0aGlzLnkgKiB0aGF0LCB0aGlzLnogKiB0aGF0ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRlcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzNcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gZGl2aWRlIHRoZSB2ZWN0b3IgYnkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzN9IFRoZSBzY2FsZWQgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWMzLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoIHRoaXMueCAvIHRoYXQsIHRoaXMueSAvIHRoYXQsIHRoaXMueiAvIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgdmVjdG9yIGFuZCB0aGUgcHJvdmlkZWRcclxuICAgICAqIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IC0gVGhlIG90aGVyIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0WzBdICkgKyAoIHRoaXMueSAqIHRoYXRbMV0gKSArICggdGhpcy56ICogdGhhdFsyXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0LnggKSArICggdGhpcy55ICogdGhhdC55ICkgKyAoIHRoaXMueiAqIHRoYXQueiApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIHZlY3RvciBhbmQgdGhlIHByb3ZpZGVkXHJcbiAgICAgKiB2ZWN0b3IgYXJndW1lbnQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fEFycmF5fSAtIFRoZSBvdGhlciB2ZWN0b3IgYXJndW1lbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIDJEIGNyb3NzIHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24oIHRoYXQgKSB7XHJcbiAgICAgICAgaWYgKCB0aGF0IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMyhcclxuICAgICAgICAgICAgICAgICggdGhpcy55ICogdGhhdFsyXSApIC0gKCB0aGF0WzFdICogdGhpcy56ICksXHJcbiAgICAgICAgICAgICAgICAoLXRoaXMueCAqIHRoYXRbMl0gKSArICggdGhhdFswXSAqIHRoaXMueiApLFxyXG4gICAgICAgICAgICAgICAgKCB0aGlzLnggKiB0aGF0WzFdICkgLSAoIHRoYXRbMF0gKiB0aGlzLnkgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgICggdGhpcy55ICogdGhhdC56ICkgLSAoIHRoYXQueSAqIHRoaXMueiApLFxyXG4gICAgICAgICAgICAoLXRoaXMueCAqIHRoYXQueiApICsgKCB0aGF0LnggKiB0aGlzLnogKSxcclxuICAgICAgICAgICAgKCB0aGlzLnggKiB0aGF0LnkgKSAtICggdGhhdC54ICogdGhpcy55ICkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBubyBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBzY2FsYXIgbGVuZ3RoIG9mXHJcbiAgICAgKiB0aGUgdmVjdG9yLiBJZiBhbiBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYSBuZXdcclxuICAgICAqIFZlYzMgc2NhbGVkIHRvIHRoZSBwcm92aWRlZCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBsZW5ndGggdG8gc2NhbGUgdGhlIHZlY3RvciB0by4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcnxWZWMzfSBFaXRoZXIgdGhlIGxlbmd0aCwgb3IgbmV3IHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCBsZW5ndGggKSB7XHJcbiAgICAgICAgaWYgKCBsZW5ndGggPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguc3FydCggdGhpcy5kb3QoIHRoaXMgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0KCBsZW5ndGggKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3F1YXJlZCBsZW5ndGggb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUubGVuZ3RoU3F1YXJlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRvdCggdGhpcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2ggdGhvc2Ugb2YgYSBwcm92aWRlZCB2ZWN0b3IuXHJcbiAgICAgKiBBbiBvcHRpb25hbCBlcHNpbG9uIHZhbHVlIG1heSBiZSBwcm92aWRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIHZhciB4ID0gdGhhdC54ICE9PSB1bmRlZmluZWQgPyB0aGF0LnggOiB0aGF0WzBdLFxyXG4gICAgICAgICAgICB5ID0gdGhhdC55ICE9PSB1bmRlZmluZWQgPyB0aGF0LnkgOiB0aGF0WzFdLFxyXG4gICAgICAgICAgICB6ID0gdGhhdC56ICE9PSB1bmRlZmluZWQgPyB0aGF0LnogOiB0aGF0WzJdO1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggPT09IHggfHwgTWF0aC5hYnMoIHRoaXMueCAtIHggKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnkgPT09IHkgfHwgTWF0aC5hYnMoIHRoaXMueSAtIHkgKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnogPT09IHogfHwgTWF0aC5hYnMoIHRoaXMueiAtIHogKSA8PSBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWMzIG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjM30gVGhlIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYgKCBtYWcgIT09IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMyhcclxuICAgICAgICAgICAgICAgIHRoaXMueCAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueSAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueiAvIG1hZyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB1bnNpZ25lZCBhbmdsZSBiZXR3ZWVuIHRoaXMgYW5nbGUgYW5kIHRoZSBhcmd1bWVudCBpbiByYWRpYW5zLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjNHxBcnJheX0gdGhhdCAtIFRoZSB2ZWN0b3IgdG8gbWVhc3VyZSB0aGUgYW5nbGUgZnJvbS5cclxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWM0fEFycmF5fSBub3JtYWwgLSBUaGUgcmVmZXJlbmNlIHZlY3RvciB0byBtZWFzdXJlIHRoZVxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gb2YgdGhlIGFuZ2xlLiBJZiBub3QgcHJvdmlkZWQgd2lsbFxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2UgYS5jcm9zcyggYiApLiAoT3B0aW9uYWwpXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHVuc2lnbmVkIGFuZ2xlIGluIHJhZGlhbnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLnVuc2lnbmVkQW5nbGVSYWRpYW5zID0gZnVuY3Rpb24oIHRoYXQsIG5vcm1hbCApIHtcclxuICAgICAgICB2YXIgYSA9IHRoaXMubm9ybWFsaXplKCk7XHJcbiAgICAgICAgdmFyIGIgPSBuZXcgVmVjMyggdGhhdCApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIHZhciBkb3QgPSBhLmRvdCggYiApO1xyXG4gICAgICAgIHZhciBuZG90ID0gTWF0aC5tYXgoIC0xLCBNYXRoLm1pbiggMSwgZG90ICkgKTtcclxuICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmFjb3MoIG5kb3QgKTtcclxuICAgICAgICB2YXIgY3Jvc3MgPSBhLmNyb3NzKCBiICk7XHJcbiAgICAgICAgdmFyIG4gPSBuZXcgVmVjMyggbm9ybWFsIHx8IGNyb3NzICk7XHJcblxyXG4gICAgICAgIC8vdmFyIGNyb3NzID0gdGhpcy5jcm9zcyggdGhhdCApO1xyXG4gICAgICAgIC8vdmFyIGFuZ2xlID0gTWF0aC5hdGFuMiggY3Jvc3MubGVuZ3RoKCksIHRoaXMuZG90KCB0aGF0ICkgKTtcclxuXHJcbiAgICAgICAgaWYgKCBuLmRvdCggY3Jvc3MgKSA8IDAgKSB7XHJcbiAgICAgICAgICAgIGlmICggYW5nbGUgPj0gTWF0aC5QSSAqIDAuNSApIHtcclxuICAgICAgICAgICAgICAgIGFuZ2xlID0gTWF0aC5QSSArIE1hdGguUEkgLSBhbmdsZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFuZ2xlID0gMiAqIE1hdGguUEkgLSBhbmdsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYW5nbGU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgdW5zaWduZWQgYW5nbGUgYmV0d2VlbiB0aGlzIGFuZ2xlIGFuZCB0aGUgYXJndW1lbnQgaW4gZGVncmVlcy5cclxuICAgICAqIEBtZW1iZXJvZiBWZWMzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIG1lYXN1cmUgdGhlIGFuZ2xlIGZyb20uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHVuc2lnbmVkIGFuZ2xlIGluIGRlZ3JlZXMuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLnVuc2lnbmVkQW5nbGVEZWdyZWVzID0gZnVuY3Rpb24oIHRoYXQsIG5vcm1hbCApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51bnNpZ25lZEFuZ2xlUmFkaWFucyggdGhhdCwgbm9ybWFsICkgKiAoIDE4MCAvIE1hdGguUEkgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFZlYzMgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBBIHJhbmRvbSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFZlYzMucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICkubm9ybWFsaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzMucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMuejtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjM1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZlY3RvciBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgVmVjMy5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55LCB0aGlzLnogXTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZWMzO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVmVjNCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgVmVjNFxyXG4gICAgICogQGNsYXNzZGVzYyBBIGZvdXIgY29tcG9uZW50IHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVmVjNCgpIHtcclxuICAgICAgICBzd2l0Y2ggKCBhcmd1bWVudHMubGVuZ3RoICkge1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAvLyBhcnJheSBvciBWZWNOIGFyZ3VtZW50XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJndW1lbnQgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmd1bWVudC54IHx8IGFyZ3VtZW50WzBdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50LnkgfHwgYXJndW1lbnRbMV0gfHwgMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gYXJndW1lbnQueiB8fCBhcmd1bWVudFsyXSB8fCAwLjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLncgPSBhcmd1bWVudC53IHx8IGFyZ3VtZW50WzNdIHx8IDAuMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGNvbXBvbmVudCBhcmd1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMueiA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudyA9IGFyZ3VtZW50c1szXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWM0IHdpdGggZWFjaCBjb21wb25lbnQgbmVnYXRlZC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBuZWdhdGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KCAtdGhpcy54LCAtdGhpcy55LCAtdGhpcy56LCAtdGhpcy53ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHZlY3RvciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzRcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN1bS5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtWZWM0fEFycmF5fSB0aGF0IC0gVGhlIHZlY3RvciB0byBhZGQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1ZlYzR9IFRoZSBzdW0gb2YgdGhlIHR3byB2ZWN0b3JzLlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICBpZiAoIHRoYXQgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy54ICsgdGhhdFswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMueSArIHRoYXRbMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnogKyB0aGF0WzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy53ICsgdGhhdFszXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgIHRoaXMueCArIHRoYXQueCxcclxuICAgICAgICAgICAgdGhpcy55ICsgdGhhdC55LFxyXG4gICAgICAgICAgICB0aGlzLnogKyB0aGF0LnosXHJcbiAgICAgICAgICAgIHRoaXMudyArIHRoYXQudyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnRyYWN0cyB0aGUgcHJvdmlkZWQgdmVjdG9yIGFyZ3VtZW50IGZyb20gdGhlIHZlY3RvciwgcmV0dXJuaW5nIGEgbmV3IFZlYzRcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGRpZmZlcmVuY2UuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVjNHxBcnJheX0gLSBUaGUgdmVjdG9yIHRvIHN1YnRyYWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBUaGUgZGlmZmVyZW5jZSBvZiB0aGUgdHdvIHZlY3RvcnMuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnggLSB0aGF0WzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy55IC0gdGhhdFsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMueiAtIHRoYXRbMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLncgLSB0aGF0WzNdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy54IC0gdGhhdC54LFxyXG4gICAgICAgICAgICB0aGlzLnkgLSB0aGF0LnksXHJcbiAgICAgICAgICAgIHRoaXMueiAtIHRoYXQueixcclxuICAgICAgICAgICAgdGhpcy53IC0gdGhhdC53ICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGllcyB0aGUgdmVjdG9yIHdpdGggdGhlIHByb3ZpZGVkIHNjYWxhciBhcmd1bWVudCwgcmV0dXJuaW5nIGEgbmV3IFZlYzRcclxuICAgICAqIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAtIFRoZSBzY2FsYXIgdG8gbXVsdGlwbHkgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiggdGhhdCApIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoXHJcbiAgICAgICAgICAgIHRoaXMueCAqIHRoYXQsXHJcbiAgICAgICAgICAgIHRoaXMueSAqIHRoYXQsXHJcbiAgICAgICAgICAgIHRoaXMueiAqIHRoYXQsXHJcbiAgICAgICAgICAgIHRoaXMudyAqIHRoYXQgKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3Igd2l0aCB0aGUgcHJvdmlkZWQgc2NhbGFyIGFyZ3VtZW50LCByZXR1cm5pbmcgYSBuZXcgVmVjNFxyXG4gICAgICogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIHNjYWxhciB0byBkaXZpZGUgdGhlIHZlY3RvciBieS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIHNjYWxlZCB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgdGhpcy54IC8gdGhhdCxcclxuICAgICAgICAgICAgdGhpcy55IC8gdGhhdCxcclxuICAgICAgICAgICAgdGhpcy56IC8gdGhhdCxcclxuICAgICAgICAgICAgdGhpcy53IC8gdGhhdCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGRvdCBwcm9kdWN0IG9mIHRoZSB2ZWN0b3IgYW5kIHRoZSBwcm92aWRlZFxyXG4gICAgICogdmVjdG9yIGFyZ3VtZW50LlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzR8QXJyYXl9IC0gVGhlIG90aGVyIHZlY3RvciBhcmd1bWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3QuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKCB0aGF0ICkge1xyXG4gICAgICAgIGlmICggdGhhdCBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gKCB0aGlzLnggKiB0aGF0WzBdICkgK1xyXG4gICAgICAgICAgICAgICAgKCB0aGlzLnkgKiB0aGF0WzFdICkgK1xyXG4gICAgICAgICAgICAgICAgKCB0aGlzLnogKiB0aGF0WzJdICkgK1xyXG4gICAgICAgICAgICAgICAgKCB0aGlzLncgKiB0aGF0WzNdICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoIHRoaXMueCAqIHRoYXQueCApICtcclxuICAgICAgICAgICAgKCB0aGlzLnkgKiB0aGF0LnkgKSArXHJcbiAgICAgICAgICAgICggdGhpcy56ICogdGhhdC56ICkgK1xyXG4gICAgICAgICAgICAoIHRoaXMudyAqIHRoYXQudyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIG5vIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHNjYWxhciBsZW5ndGggb2ZcclxuICAgICAqIHRoZSB2ZWN0b3IuIElmIGFuIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBhIG5ld1xyXG4gICAgICogVmVjNCBzY2FsZWQgdG8gdGhlIHByb3ZpZGVkIGxlbmd0aC5cclxuICAgICAqIEBtZW1iZXJvZiBWZWM0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IC0gVGhlIGxlbmd0aCB0byBzY2FsZSB0aGUgdmVjdG9yIHRvLiBPcHRpb25hbC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfFZlYzR9IEVpdGhlciB0aGUgbGVuZ3RoLCBvciBuZXcgc2NhbGVkIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oIGxlbmd0aCApIHtcclxuICAgICAgICBpZiAoIGxlbmd0aCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCB0aGlzLmRvdCggdGhpcyApICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHQoIGxlbmd0aCApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICBWZWM0LnByb3RvdHlwZS5sZW5ndGhTcXVhcmVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG90KCB0aGlzICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB2ZWN0b3IgY29tcG9uZW50cyBtYXRjaCB0aG9zZSBvZiBhIHByb3ZpZGVkIHZlY3Rvci5cclxuICAgICAqIEFuIG9wdGlvbmFsIGVwc2lsb24gdmFsdWUgbWF5IGJlIHByb3ZpZGVkLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzR8QXJyYXl9IHRoYXQgLSBUaGUgdmVjdG9yIHRvIHRlc3QgZXF1YWxpdHkgd2l0aC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcHNpbG9uIC0gVGhlIGVwc2lsb24gdmFsdWUuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9yIGNvbXBvbmVudHMgbWF0Y2guXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKCB0aGF0LCBlcHNpbG9uICkge1xyXG4gICAgICAgIHZhciB4ID0gdGhhdC54ICE9PSB1bmRlZmluZWQgPyB0aGF0LnggOiB0aGF0WzBdLFxyXG4gICAgICAgICAgICB5ID0gdGhhdC55ICE9PSB1bmRlZmluZWQgPyB0aGF0LnkgOiB0aGF0WzFdLFxyXG4gICAgICAgICAgICB6ID0gdGhhdC56ICE9PSB1bmRlZmluZWQgPyB0aGF0LnogOiB0aGF0WzJdLFxyXG4gICAgICAgICAgICB3ID0gdGhhdC53ICE9PSB1bmRlZmluZWQgPyB0aGF0LncgOiB0aGF0WzNdO1xyXG4gICAgICAgIGVwc2lsb24gPSBlcHNpbG9uID09PSB1bmRlZmluZWQgPyAwIDogZXBzaWxvbjtcclxuICAgICAgICByZXR1cm4gKCB0aGlzLnggPT09IHggfHwgTWF0aC5hYnMoIHRoaXMueCAtIHggKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnkgPT09IHkgfHwgTWF0aC5hYnMoIHRoaXMueSAtIHkgKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLnogPT09IHogfHwgTWF0aC5hYnMoIHRoaXMueiAtIHogKSA8PSBlcHNpbG9uICkgJiZcclxuICAgICAgICAgICAgKCB0aGlzLncgPT09IHcgfHwgTWF0aC5hYnMoIHRoaXMudyAtIHcgKSA8PSBlcHNpbG9uICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyBWZWM0IG9mIHVuaXQgbGVuZ3RoLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjNH0gVGhlIHZlY3RvciBvZiB1bml0IGxlbmd0aC5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYgKCBtYWcgIT09IDAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjNChcclxuICAgICAgICAgICAgICAgIHRoaXMueCAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueSAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMueiAvIG1hZyxcclxuICAgICAgICAgICAgICAgIHRoaXMudyAvIG1hZyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIFZlYzQgb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBBIHJhbmRvbSB2ZWN0b3Igb2YgdW5pdCBsZW5ndGguXHJcbiAgICAgKi9cclxuICAgIFZlYzQucmFuZG9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpLFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICkubm9ybWFsaXplKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICogQG1lbWJlcm9mIFZlYzRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIFZlYzQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIFwiLCBcIiArIHRoaXMueSArIFwiLCBcIiArIHRoaXMueiArIFwiLCBcIiArIHRoaXMudztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmVjNFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZlY3RvciBhcyBhbiBhcnJheS5cclxuICAgICAqL1xyXG4gICAgVmVjNC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyBdO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlYzQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgIE1hdDMzOiByZXF1aXJlKCcuL01hdDMzJyksXHJcbiAgICAgICAgTWF0NDQ6IHJlcXVpcmUoJy4vTWF0NDQnKSxcclxuICAgICAgICBWZWMyOiByZXF1aXJlKCcuL1ZlYzInKSxcclxuICAgICAgICBWZWMzOiByZXF1aXJlKCcuL1ZlYzMnKSxcclxuICAgICAgICBWZWM0OiByZXF1aXJlKCcuL1ZlYzMnKSxcclxuICAgICAgICBRdWF0ZXJuaW9uOiByZXF1aXJlKCcuL1F1YXRlcm5pb24nKSxcclxuICAgICAgICBUcmFuc2Zvcm06IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyksXHJcbiAgICAgICAgVHJpYW5nbGU6IHJlcXVpcmUoJy4vVHJpYW5nbGUnKVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNi4zXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBEZWZlcnJlZCwgUEVORElORywgUkVKRUNURUQsIFJFU09MVkVELCBWRVJTSU9OLCBhZnRlciwgZXhlY3V0ZSwgZmxhdHRlbiwgaGFzLCBpbnN0YWxsSW50bywgaXNBcmd1bWVudHMsIGlzUHJvbWlzZSwgd3JhcCwgX3doZW4sXG4gICAgX19zbGljZSA9IFtdLnNsaWNlO1xuXG4gIFZFUlNJT04gPSAnMy4wLjAnO1xuXG4gIFBFTkRJTkcgPSBcInBlbmRpbmdcIjtcblxuICBSRVNPTFZFRCA9IFwicmVzb2x2ZWRcIjtcblxuICBSRUpFQ1RFRCA9IFwicmVqZWN0ZWRcIjtcblxuICBoYXMgPSBmdW5jdGlvbihvYmosIHByb3ApIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgPyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgOiB2b2lkIDA7XG4gIH07XG5cbiAgaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaGFzKG9iaiwgJ2xlbmd0aCcpICYmIGhhcyhvYmosICdjYWxsZWUnKTtcbiAgfTtcblxuICBpc1Byb21pc2UgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaGFzKG9iaiwgJ3Byb21pc2UnKSAmJiB0eXBlb2YgKG9iaiAhPSBudWxsID8gb2JqLnByb21pc2UgOiB2b2lkIDApID09PSAnZnVuY3Rpb24nO1xuICB9O1xuXG4gIGZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGlmIChpc0FyZ3VtZW50cyhhcnJheSkpIHtcbiAgICAgIHJldHVybiBmbGF0dGVuKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycmF5KSk7XG4gICAgfVxuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcbiAgICAgIHJldHVybiBbYXJyYXldO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHZhbHVlKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGZsYXR0ZW4odmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIG1lbW8ucHVzaCh2YWx1ZSk7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9LCBbXSk7XG4gIH07XG5cbiAgYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIGlmICh0aW1lcyA8PSAwKSB7XG4gICAgICByZXR1cm4gZnVuYygpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHdyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3M7XG4gICAgICBhcmdzID0gW2Z1bmNdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgICAgIHJldHVybiB3cmFwcGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH07XG5cbiAgZXhlY3V0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrcywgYXJncywgY29udGV4dCkge1xuICAgIHZhciBjYWxsYmFjaywgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgIF9yZWYgPSBmbGF0dGVuKGNhbGxiYWNrcyk7XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGNhbGxiYWNrID0gX3JlZltfaV07XG4gICAgICBfcmVzdWx0cy5wdXNoKGNhbGxiYWNrLmNhbGwuYXBwbHkoY2FsbGJhY2ssIFtjb250ZXh0XS5jb25jYXQoX19zbGljZS5jYWxsKGFyZ3MpKSkpO1xuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgRGVmZXJyZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FuZGlkYXRlLCBjbG9zZSwgY2xvc2luZ0FyZ3VtZW50cywgZG9uZUNhbGxiYWNrcywgZmFpbENhbGxiYWNrcywgcHJvZ3Jlc3NDYWxsYmFja3MsIHN0YXRlO1xuICAgIHN0YXRlID0gUEVORElORztcbiAgICBkb25lQ2FsbGJhY2tzID0gW107XG4gICAgZmFpbENhbGxiYWNrcyA9IFtdO1xuICAgIHByb2dyZXNzQ2FsbGJhY2tzID0gW107XG4gICAgY2xvc2luZ0FyZ3VtZW50cyA9IHtcbiAgICAgICdyZXNvbHZlZCc6IHt9LFxuICAgICAgJ3JlamVjdGVkJzoge30sXG4gICAgICAncGVuZGluZyc6IHt9XG4gICAgfTtcbiAgICB0aGlzLnByb21pc2UgPSBmdW5jdGlvbihjYW5kaWRhdGUpIHtcbiAgICAgIHZhciBwaXBlLCBzdG9yZUNhbGxiYWNrcztcbiAgICAgIGNhbmRpZGF0ZSA9IGNhbmRpZGF0ZSB8fCB7fTtcbiAgICAgIGNhbmRpZGF0ZS5zdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9O1xuICAgICAgc3RvcmVDYWxsYmFja3MgPSBmdW5jdGlvbihzaG91bGRFeGVjdXRlSW1tZWRpYXRlbHksIGhvbGRlciwgaG9sZGVyU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gUEVORElORykge1xuICAgICAgICAgICAgaG9sZGVyLnB1c2guYXBwbHkoaG9sZGVyLCBmbGF0dGVuKGFyZ3VtZW50cykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2hvdWxkRXhlY3V0ZUltbWVkaWF0ZWx5KCkpIHtcbiAgICAgICAgICAgIGV4ZWN1dGUoYXJndW1lbnRzLCBjbG9zaW5nQXJndW1lbnRzW2hvbGRlclN0YXRlXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgY2FuZGlkYXRlLmRvbmUgPSBzdG9yZUNhbGxiYWNrcygoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZSA9PT0gUkVTT0xWRUQ7XG4gICAgICB9KSwgZG9uZUNhbGxiYWNrcywgUkVTT0xWRUQpO1xuICAgICAgY2FuZGlkYXRlLmZhaWwgPSBzdG9yZUNhbGxiYWNrcygoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZSA9PT0gUkVKRUNURUQ7XG4gICAgICB9KSwgZmFpbENhbGxiYWNrcywgUkVKRUNURUQpO1xuICAgICAgY2FuZGlkYXRlLnByb2dyZXNzID0gc3RvcmVDYWxsYmFja3MoKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RhdGUgIT09IFBFTkRJTkc7XG4gICAgICB9KSwgcHJvZ3Jlc3NDYWxsYmFja3MsIFBFTkRJTkcpO1xuICAgICAgY2FuZGlkYXRlLmFsd2F5cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3JlZjtcbiAgICAgICAgcmV0dXJuIChfcmVmID0gY2FuZGlkYXRlLmRvbmUuYXBwbHkoY2FuZGlkYXRlLCBhcmd1bWVudHMpKS5mYWlsLmFwcGx5KF9yZWYsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgcGlwZSA9IGZ1bmN0aW9uKGRvbmVGaWx0ZXIsIGZhaWxGaWx0ZXIsIHByb2dyZXNzRmlsdGVyKSB7XG4gICAgICAgIHZhciBmaWx0ZXIsIG1hc3RlcjtcbiAgICAgICAgbWFzdGVyID0gbmV3IERlZmVycmVkKCk7XG4gICAgICAgIGZpbHRlciA9IGZ1bmN0aW9uKHNvdXJjZSwgZnVubmVsLCBjYWxsYmFjaykge1xuICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiBjYW5kaWRhdGVbc291cmNlXShtYXN0ZXJbZnVubmVsXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjYW5kaWRhdGVbc291cmNlXShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzLCB2YWx1ZTtcbiAgICAgICAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgIGlmIChpc1Byb21pc2UodmFsdWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5kb25lKG1hc3Rlci5yZXNvbHZlKS5mYWlsKG1hc3Rlci5yZWplY3QpLnByb2dyZXNzKG1hc3Rlci5ub3RpZnkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1hc3RlcltmdW5uZWxdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZmlsdGVyKCdkb25lJywgJ3Jlc29sdmUnLCBkb25lRmlsdGVyKTtcbiAgICAgICAgZmlsdGVyKCdmYWlsJywgJ3JlamVjdCcsIGZhaWxGaWx0ZXIpO1xuICAgICAgICBmaWx0ZXIoJ3Byb2dyZXNzJywgJ25vdGlmeScsIHByb2dyZXNzRmlsdGVyKTtcbiAgICAgICAgcmV0dXJuIG1hc3RlcjtcbiAgICAgIH07XG4gICAgICBjYW5kaWRhdGUucGlwZSA9IHBpcGU7XG4gICAgICBjYW5kaWRhdGUudGhlbiA9IHBpcGU7XG4gICAgICBpZiAoY2FuZGlkYXRlLnByb21pc2UgPT0gbnVsbCkge1xuICAgICAgICBjYW5kaWRhdGUucHJvbWlzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FuZGlkYXRlO1xuICAgIH07XG4gICAgdGhpcy5wcm9taXNlKHRoaXMpO1xuICAgIGNhbmRpZGF0ZSA9IHRoaXM7XG4gICAgY2xvc2UgPSBmdW5jdGlvbihmaW5hbFN0YXRlLCBjYWxsYmFja3MsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHN0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgICAgICAgc3RhdGUgPSBmaW5hbFN0YXRlO1xuICAgICAgICAgIGNsb3NpbmdBcmd1bWVudHNbZmluYWxTdGF0ZV0gPSBhcmd1bWVudHM7XG4gICAgICAgICAgZXhlY3V0ZShjYWxsYmFja3MsIGNsb3NpbmdBcmd1bWVudHNbZmluYWxTdGF0ZV0sIGNvbnRleHQpO1xuICAgICAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH07XG4gICAgdGhpcy5yZXNvbHZlID0gY2xvc2UoUkVTT0xWRUQsIGRvbmVDYWxsYmFja3MpO1xuICAgIHRoaXMucmVqZWN0ID0gY2xvc2UoUkVKRUNURUQsIGZhaWxDYWxsYmFja3MpO1xuICAgIHRoaXMubm90aWZ5ID0gY2xvc2UoUEVORElORywgcHJvZ3Jlc3NDYWxsYmFja3MpO1xuICAgIHRoaXMucmVzb2x2ZVdpdGggPSBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgICByZXR1cm4gY2xvc2UoUkVTT0xWRUQsIGRvbmVDYWxsYmFja3MsIGNvbnRleHQpLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH07XG4gICAgdGhpcy5yZWplY3RXaXRoID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgcmV0dXJuIGNsb3NlKFJFSkVDVEVELCBmYWlsQ2FsbGJhY2tzLCBjb250ZXh0KS5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9O1xuICAgIHRoaXMubm90aWZ5V2l0aCA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHJldHVybiBjbG9zZShQRU5ESU5HLCBwcm9ncmVzc0NhbGxiYWNrcywgY29udGV4dCkuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfd2hlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWYsIGRlZnMsIGZpbmlzaCwgcmVzb2x1dGlvbkFyZ3MsIHRyaWdnZXIsIF9pLCBfbGVuO1xuICAgIGRlZnMgPSBmbGF0dGVuKGFyZ3VtZW50cyk7XG4gICAgaWYgKGRlZnMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaXNQcm9taXNlKGRlZnNbMF0pKSB7XG4gICAgICAgIHJldHVybiBkZWZzWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIChuZXcgRGVmZXJyZWQoKSkucmVzb2x2ZShkZWZzWzBdKS5wcm9taXNlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRyaWdnZXIgPSBuZXcgRGVmZXJyZWQoKTtcbiAgICBpZiAoIWRlZnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJpZ2dlci5yZXNvbHZlKCkucHJvbWlzZSgpO1xuICAgIH1cbiAgICByZXNvbHV0aW9uQXJncyA9IFtdO1xuICAgIGZpbmlzaCA9IGFmdGVyKGRlZnMubGVuZ3RoLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnJlc29sdmUuYXBwbHkodHJpZ2dlciwgcmVzb2x1dGlvbkFyZ3MpO1xuICAgIH0pO1xuICAgIGRlZnMuZm9yRWFjaChmdW5jdGlvbihkZWYsIGluZGV4KSB7XG4gICAgICBpZiAoaXNQcm9taXNlKGRlZikpIHtcbiAgICAgICAgcmV0dXJuIGRlZi5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzO1xuICAgICAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICAgIHJlc29sdXRpb25BcmdzW2luZGV4XSA9IGFyZ3MubGVuZ3RoID4gMSA/IGFyZ3MgOiBhcmdzWzBdO1xuICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHV0aW9uQXJnc1tpbmRleF0gPSBkZWY7XG4gICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGRlZnMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGRlZiA9IGRlZnNbX2ldO1xuICAgICAgaXNQcm9taXNlKGRlZikgJiYgZGVmLmZhaWwodHJpZ2dlci5yZWplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gdHJpZ2dlci5wcm9taXNlKCk7XG4gIH07XG5cbiAgaW5zdGFsbEludG8gPSBmdW5jdGlvbihmdykge1xuICAgIGZ3LkRlZmVycmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERlZmVycmVkKCk7XG4gICAgfTtcbiAgICBmdy5hamF4ID0gd3JhcChmdy5hamF4LCBmdW5jdGlvbihhamF4LCBvcHRpb25zKSB7XG4gICAgICB2YXIgY3JlYXRlV3JhcHBlciwgZGVmLCBwcm9taXNlLCB4aHI7XG4gICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xuICAgICAgY3JlYXRlV3JhcHBlciA9IGZ1bmN0aW9uKHdyYXBwZWQsIGZpbmlzaGVyKSB7XG4gICAgICAgIHJldHVybiB3cmFwKHdyYXBwZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzLCBmdW5jO1xuICAgICAgICAgIGZ1bmMgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgICBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmluaXNoZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIG9wdGlvbnMuc3VjY2VzcyA9IGNyZWF0ZVdyYXBwZXIob3B0aW9ucy5zdWNjZXNzLCBkZWYucmVzb2x2ZSk7XG4gICAgICBvcHRpb25zLmVycm9yID0gY3JlYXRlV3JhcHBlcihvcHRpb25zLmVycm9yLCBkZWYucmVqZWN0KTtcbiAgICAgIHhociA9IGFqYXgob3B0aW9ucyk7XG4gICAgICBwcm9taXNlID0gZGVmLnByb21pc2UoKTtcbiAgICAgIHByb21pc2UuYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHhoci5hYm9ydCgpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0pO1xuICAgIHJldHVybiBmdy53aGVuID0gX3doZW47XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMuRGVmZXJyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGVmZXJyZWQoKTtcbiAgICB9O1xuICAgIGV4cG9ydHMud2hlbiA9IF93aGVuO1xuICAgIGV4cG9ydHMuaW5zdGFsbEludG8gPSBpbnN0YWxsSW50bztcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodHlwZW9mIFplcHRvICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gaW5zdGFsbEludG8oWmVwdG8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGVmZXJyZWQud2hlbiA9IF93aGVuO1xuICAgICAgICBEZWZlcnJlZC5pbnN0YWxsSW50byA9IGluc3RhbGxJbnRvO1xuICAgICAgICByZXR1cm4gRGVmZXJyZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIFplcHRvICE9PSAndW5kZWZpbmVkJykge1xuICAgIGluc3RhbGxJbnRvKFplcHRvKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLkRlZmVycmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERlZmVycmVkKCk7XG4gICAgfTtcbiAgICB0aGlzLkRlZmVycmVkLndoZW4gPSBfd2hlbjtcbiAgICB0aGlzLkRlZmVycmVkLmluc3RhbGxJbnRvID0gaW5zdGFsbEludG87XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgUmVuZGVyVGFyZ2V0ID0gcmVxdWlyZSgnLi9SZW5kZXJUYXJnZXQnKSxcclxuICAgICAgICBUZXh0dXJlMkQgPSByZXF1aXJlKCcuL1RleHR1cmUyRCcpLFxyXG4gICAgICAgIFRleHR1cmVDdWJlTWFwID0gcmVxdWlyZSgnLi9UZXh0dXJlQ3ViZU1hcCcpLFxyXG4gICAgICAgIFZpZXdwb3J0ID0gcmVxdWlyZSgnLi9WaWV3cG9ydCcpLFxyXG4gICAgICAgIENhbWVyYSA9IHJlcXVpcmUoJy4uL3JlbmRlci9DYW1lcmEnKSxcclxuICAgICAgICBGQUNFUyA9IFtcclxuICAgICAgICAgICAgJy14JywgJyt4JyxcclxuICAgICAgICAgICAgJy15JywgJyt5JyxcclxuICAgICAgICAgICAgJy16JywgJyt6J1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgRkFDRV9UQVJHRVRTID0ge1xyXG4gICAgICAgICAgICAnK3onOiBcIlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWlwiLFxyXG4gICAgICAgICAgICAnLXonOiBcIlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWlwiLFxyXG4gICAgICAgICAgICAnK3gnOiBcIlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWFwiLFxyXG4gICAgICAgICAgICAnLXgnOiBcIlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWFwiLFxyXG4gICAgICAgICAgICAnK3knOiBcIlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWVwiLFxyXG4gICAgICAgICAgICAnLXknOiBcIlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBERUZBVUxUX1NJWkUgPSAyMDQ4O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgYSBwYXJ0aWN1bGFyIGZhY2Ugb2YgdGhlIGN1YmUgbWFwIHJlbmRlclRhcmdldCBhbmQgcmVhZGllcyBpdCBmb3JcclxuICAgICAqIHJlbmRlcmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0N1YmVNYXBSZW5kZXJUYXJnZXR9IGN1YmVNYXBUYXJnZXQgLSBUaGUgY3ViZSBtYXAgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZhY2UgLSBUaGUgZmFjZSBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJpbmRGYWNlVGV4dHVyZSggY3ViZU1hcFRhcmdldCwgZmFjZSApIHtcclxuICAgICAgICAvLyBiaW5kIHJlbGV2YW50IGZhY2Ugb2YgY3ViZSBtYXBcclxuICAgICAgICBjdWJlTWFwVGFyZ2V0LnJlbmRlclRhcmdldC5zZXRDb2xvclRhcmdldChcclxuICAgICAgICAgICAgY3ViZU1hcFRhcmdldC5jdWJlTWFwLFxyXG4gICAgICAgICAgICBGQUNFX1RBUkdFVFNbIGZhY2UgXSApO1xyXG4gICAgICAgIC8vIGNsZWFyIHRoZSBmYWNlIHRleHR1cmVcclxuICAgICAgICBjdWJlTWFwVGFyZ2V0LnJlbmRlclRhcmdldC5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGNhbWVyYSBvYmplY3QgZm9yIHRoZSBwcm92aWRlZCBmYWNlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmYWNlIC0gVGhlIGZhY2UgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxyXG4gICAgICogQHBhcmFtIHtWZWMzfEFycmF5fSBvcmlnaW4gLSBUaGUgb3JpZ2luIG9mIHRoZSBjdWJlIG1hcC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q2FtZXJhfSBUaGUgcmVzdWx0aW5nIGNhbWVyYS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0RmFjZUNhbWVyYSggZmFjZSwgb3JpZ2luICkge1xyXG4gICAgICAgIHZhciBmb3J3YXJkLFxyXG4gICAgICAgICAgICB1cDtcclxuICAgICAgICAvLyBzZXR1cCB0cmFuc2Zvcm0gZGVwZW5kaW5nIG9uIGN1cnJlbnQgZmFjZVxyXG4gICAgICAgIHN3aXRjaCAoIGZhY2UgKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJyt4JzpcclxuICAgICAgICAgICAgICAgIGZvcndhcmQgPSBbIDEsIDAsIDAgXTtcclxuICAgICAgICAgICAgICAgIHVwID0gWyAwLCAtMSwgMCBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJy14JzpcclxuICAgICAgICAgICAgICAgIGZvcndhcmQgPSBbIC0xLCAwLCAwIF07XHJcbiAgICAgICAgICAgICAgICB1cCA9IFsgMCwgLTEsIDAgXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICcreSc6XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gWyAwLCAxLCAwIF07XHJcbiAgICAgICAgICAgICAgICB1cCA9IFsgMCwgMCwgMSBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJy15JzpcclxuICAgICAgICAgICAgICAgIGZvcndhcmQgPSBbIDAsIC0xLCAwIF07XHJcbiAgICAgICAgICAgICAgICB1cCA9IFsgMCwgMCwgLTEgXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICcreic6XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gWyAwLCAwLCAxIF07XHJcbiAgICAgICAgICAgICAgICB1cCA9IFsgMCwgLTEsIDAgXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICcteic6XHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkID0gWyAwLCAwLCAtMSBdO1xyXG4gICAgICAgICAgICAgICAgdXAgPSBbIDAsIC0xLCAwIF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDYW1lcmEoe1xyXG4gICAgICAgICAgICBvcmlnaW46IG9yaWdpbixcclxuICAgICAgICAgICAgZm9yd2FyZDogZm9yd2FyZCxcclxuICAgICAgICAgICAgdXA6IHVwLFxyXG4gICAgICAgICAgICBwcm9qZWN0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBmb3Y6IDkwLFxyXG4gICAgICAgICAgICAgICAgYXNwZWN0OiAxLFxyXG4gICAgICAgICAgICAgICAgek1pbjogMSxcclxuICAgICAgICAgICAgICAgIHpNYXg6IDEwMDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUT0RPOiB0ZXN0IHBlcmZvcm1hbmNlIHZzIHVzaW5nIDYgRkJPJ3MsIGVhY2ggc2hhcmluZyBhIHNpbmdsZSBkZXB0aFxyXG4gICAgICogdGV4dHVyZS5cclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgQ3ViZU1hcFJlbmRlclRhcmdldCBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgQ3ViZU1hcFJlbmRlclRhcmdldFxyXG4gICAgICogQGNsYXNzZGVzYyBBIHJlbmRlclRhcmdldCBjbGFzcyB0byBhbGxvdyByZW5kZXJpbmcgdG8gdGV4dHVyZXMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEN1YmVNYXBSZW5kZXJUYXJnZXQoIHNwZWMgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICB0aGlzLmlkID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICB0aGlzLnJlc29sdXRpb24gPSBzcGVjLnJlc29sdXRpb24gfHwgREVGQVVMVF9TSVpFO1xyXG4gICAgICAgIHRoaXMuZGVwdGhUZXh0dXJlID0gbmV3IFRleHR1cmUyRCh7XHJcbiAgICAgICAgICAgIGZvcm1hdDogXCJERVBUSF9DT01QT05FTlRcIixcclxuICAgICAgICAgICAgdHlwZTogXCJVTlNJR05FRF9TSE9SVFwiLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5yZXNvbHV0aW9uLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucmVzb2x1dGlvblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3ViZU1hcCA9IG5ldyBUZXh0dXJlQ3ViZU1hcCh7XHJcbiAgICAgICAgICAgIGRhdGE6IG51bGwsXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlc29sdXRpb24sXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZXNvbHV0aW9uXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQgPSBuZXcgUmVuZGVyVGFyZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQuc2V0RGVwdGhUYXJnZXQoIHRoaXMuZGVwdGhUZXh0dXJlICk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydCA9IG5ldyBWaWV3cG9ydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZHMgdGhlIGN1YmUgbWFwIGNvbXBvbmVudCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgQ3ViZU1hcFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0N1YmVNYXBSZW5kZXJUYXJnZXR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICAgQ3ViZU1hcFJlbmRlclRhcmdldC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICB0aGlzLmN1YmVNYXAucHVzaCggbG9jYXRpb24gKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCBhbmQgYmluZHMgdGhlIHRleHR1cmUgYmVuZWF0aCBpdCBvblxyXG4gICAgICogdGhpcyBzdGFjay4gSWYgdGhlcmUgaXMgbm8gdW5kZXJseWluZyB0ZXh0dXJlLCB1bmJpbmRzIHRoZSB1bml0LlxyXG4gICAgICogQG1lbWJlcm9mIEN1YmVNYXBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtDdWJlTWFwUmVuZGVyVGFyZ2V0fSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgIEN1YmVNYXBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICB0aGlzLmN1YmVNYXAucG9wKCBsb2NhdGlvbiApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIEN1YmVNYXBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8QXJyYXl9IG9yaWdpbiAtIFRoZSBvcmlnaW4gb2YgdGhlIGN1YmUgbWFwLlxyXG4gICAgICogQHBhcmFtIHtSZW5kZXJlcn0gcmVuZGVyZXIgLSBUaGUgcmVuZGVyZXIgdG8gZXhlY3V0ZS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdGllc0J5VGVjaG5pcXVlIC0gVGhlIGVudGl0aWVzIGtleWVkIGJ5IHRlY2huaXF1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Q3ViZU1hcFJlbmRlclRhcmdldH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEN1YmVNYXBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCBvcmlnaW4sIHJlbmRlcmVyLCBlbnRpdGllc0J5VGVjaG5pcXVlICkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlbmRlclRhcmdldC5wdXNoKCk7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydC5wdXNoKCB0aGlzLnJlc29sdXRpb24sIHRoaXMucmVzb2x1dGlvbiApO1xyXG4gICAgICAgIEZBQ0VTLmZvckVhY2goIGZ1bmN0aW9uKCBmYWNlICkge1xyXG4gICAgICAgICAgICAvLyBiaW5kIGZhY2VcclxuICAgICAgICAgICAgYmluZEZhY2VUZXh0dXJlKCB0aGF0LCBmYWNlICk7XHJcbiAgICAgICAgICAgIC8vIHJlbmRlciBzY2VuZVxyXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIoXHJcbiAgICAgICAgICAgICAgICBnZXRGYWNlQ2FtZXJhKCBmYWNlLCBvcmlnaW4gKSxcclxuICAgICAgICAgICAgICAgIGVudGl0aWVzQnlUZWNobmlxdWUgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlclRhcmdldC5wb3AoKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEN1YmVNYXBSZW5kZXJUYXJnZXQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW4gSW5kZXhCdWZmZXIgb2JqZWN0LlxyXG4gICAgICogQGNsYXNzIEluZGV4QnVmZmVyXHJcbiAgICAgKiBAY2xhc3NkZXNjIEFuIGluZGV4IGJ1ZmZlciBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEluZGV4QnVmZmVyKCBhcnJheSwgb3B0aW9ucyApIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHRoaXMuaWQgPSAwO1xyXG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gKCBvcHRpb25zLm9mZnNldCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLm9mZnNldCA6IDA7XHJcbiAgICAgICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IFwiVFJJQU5HTEVTXCI7XHJcbiAgICAgICAgaWYgKCBhcnJheSBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyICkge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgYXJndW1lbnQgaXMgYWxyZWFkeSBhIHdlYmdsYnVmZmVyLCBzaW1wbHkgd3JhcCBpdFxyXG4gICAgICAgICAgICB0aGlzLmlkID0gYXJyYXk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZSB8fCBcIlVOU0lHTkVEX1NIT1JUXCI7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnQgPSAoIG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy5jb3VudCA6IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBidWZmZXIgaXRcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBhcnJheSApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwbG9hZCBpbmRleCBkYXRhIHRvIHRoZSBHUFUuXHJcbiAgICAgKiBAbWVtYmVyb2YgSW5kZXhCdWZmZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fFVpbnQxNkFycmF5fFVpbnQzMkFycmF5fSBhcnJheSAtIFRoZSBhcnJheSBvZiBkYXRhIHRvIGJ1ZmZlci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7SW5kZXhCdWZmZXJ9IFRoZSBpbmRleCBidWZmZXIgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgSW5kZXhCdWZmZXIucHJvdG90eXBlLmJ1ZmZlckRhdGEgPSBmdW5jdGlvbiggYXJyYXkgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICAvLyBjaGVjayBmb3IgdHlwZSBzdXBwb3J0XHJcbiAgICAgICAgdmFyIHVpbnQzMnN1cHBvcnQgPSBXZWJHTENvbnRleHQuY2hlY2tFeHRlbnNpb24oIFwiT0VTX2VsZW1lbnRfaW5kZXhfdWludFwiICk7XHJcbiAgICAgICAgaWYoICF1aW50MzJzdXBwb3J0ICkge1xyXG4gICAgICAgICAgICAvLyBubyBzdXBwb3J0IGZvciB1aW50MzJcclxuICAgICAgICAgICAgaWYgKCBhcnJheSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgYXJyYXksIGJ1ZmZlciB0byB1aW50MTZcclxuICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQxNkFycmF5KCBhcnJheSApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBhcnJheSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdWludDMyLCBkb3duZ3JhZGUgdG8gdWludDE2XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oIFwiQ2Fubm90IGNyZWF0ZSBJbmRleEJ1ZmZlciBvZiBmb3JtYXQgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZ2wuVU5TSUdORURfSU5UIGFzIE9FU19lbGVtZW50X2luZGV4X3VpbnQgaXMgbm90IFwiICtcclxuICAgICAgICAgICAgICAgICAgICBcInN1cHBvcnRlZCwgZGVmYXVsdGluZyB0byBnbC5VTlNJR05FRF9TSE9SVFwiICk7XHJcbiAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50MTZBcnJheSggYXJyYXkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHVpbnQzMiBpcyBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgaWYgKCBhcnJheSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgYXJyYXksIGJ1ZmZlciB0byB1aW50MzJcclxuICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KCBhcnJheSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBkYXRhIHR5cGUgYmFzZWQgb24gYXJyYXlcclxuICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgVWludDE2QXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiVU5TSUdORURfU0hPUlRcIjtcclxuICAgICAgICB9IGVsc2UgaWYgKCBhcnJheSBpbnN0YW5jZW9mIFVpbnQzMkFycmF5ICkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcIlVOU0lHTkVEX0lOVFwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiSW5kZXhCdWZmZXIgcmVxdWlyZXMgYW4gQXJyYXkgb3IgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJBcnJheUJ1ZmZlciBhcmd1bWVudCwgY29tbWFuZCBpZ25vcmVkXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYnVmZmVyLCBzdG9yZSBjb3VudFxyXG4gICAgICAgIHRoaXMuaWQgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmNvdW50ID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmlkICk7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YSggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGFycmF5LCBnbC5TVEFUSUNfRFJBVyApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBpbmRleCBidWZmZXIgb2JqZWN0LlxyXG4gICAgICogQG1lbWJlcm9mIEluZGV4QnVmZmVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0luZGV4QnVmZmVyfSBSZXR1cm5zIHRoZSBpbmRleCBidWZmZXIgb2JqZWN0IGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgSW5kZXhCdWZmZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBpZiB0aGlzIGJ1ZmZlciBpcyBhbHJlYWR5IGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IHRoaXMgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5pZCApO1xyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgaW5kZXggYnVmZmVyIG9iamVjdC5cclxuICAgICAqIEBtZW1iZXJvZiBJbmRleEJ1ZmZlclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgaW5kZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBidWZmZXIgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZEJ1ZmZlciA9PT0gbnVsbCApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsICk7XHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIHRoZSBkcmF3IGNvbW1hbmQgZm9yIHRoZSBib3VuZCBidWZmZXIuXHJcbiAgICAgKiBAbWVtYmVyb2YgSW5kZXhCdWZmZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIHBhc3MgdG8gJ2RyYXdFbGVtZW50cycuIE9wdGlvbmFsLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtJbmRleEJ1ZmZlcn0gUmV0dXJucyB0aGUgaW5kZXggYnVmZmVyIG9iamVjdCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIEluZGV4QnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggXCJObyBJbmRleEJ1ZmZlciBpcyBib3VuZCwgY29tbWFuZCBpZ25vcmVkLlwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICB2YXIgbW9kZSA9IGdsWyBvcHRpb25zLm1vZGUgXSB8fCBnbFsgdGhpcy5tb2RlIF07XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IG9wdGlvbnMub2Zmc2V0ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm9mZnNldCA6IHRoaXMub2Zmc2V0O1xyXG4gICAgICAgIHZhciBjb3VudCA9IG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY291bnQgOiB0aGlzLmNvdW50O1xyXG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyhcclxuICAgICAgICAgICAgbW9kZSxcclxuICAgICAgICAgICAgY291bnQsXHJcbiAgICAgICAgICAgIGdsWyB0aGlzLnR5cGUgXSxcclxuICAgICAgICAgICAgb2Zmc2V0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gSW5kZXhCdWZmZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIFN0YWNrID0gcmVxdWlyZSgnLi4vdXRpbC9TdGFjaycpLFxyXG4gICAgICAgIF9zdGFjayA9IG5ldyBTdGFjaygpLFxyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgY2FjaGluZyBpdCB0byBwcmV2ZW50IHVubmVjZXNzYXJ5IHJlYmluZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtSZW5kZXJUYXJnZXR9IHJlbmRlclRhcmdldCAtIFRoZSBSZW5kZXJUYXJnZXQgb2JqZWN0IHRvIGJpbmQuXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBiaW5kKCByZW5kZXJUYXJnZXQgKSB7XHJcbiAgICAgICAgLy8gaWYgdGhpcyBidWZmZXIgaXMgYWxyZWFkeSBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSByZW5kZXJUYXJnZXQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gcmVuZGVyVGFyZ2V0LmdsO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIHJlbmRlclRhcmdldC5pZCApO1xyXG4gICAgICAgIF9ib3VuZEJ1ZmZlciA9IHJlbmRlclRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHJlbmRlclRhcmdldCBvYmplY3QuIFByZXZlbnRzIHVubmVjZXNzYXJ5IHVuYmluZGluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1JlbmRlclRhcmdldH0gcmVuZGVyVGFyZ2V0IC0gVGhlIFJlbmRlclRhcmdldCBvYmplY3QgdG8gdW5iaW5kLlxyXG4gICAgICovXHJcbiAgICAgZnVuY3Rpb24gdW5iaW5kKCByZW5kZXJUYXJnZXQgKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gYnVmZmVyIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRCdWZmZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gcmVuZGVyVGFyZ2V0LmdsO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgUmVuZGVyVGFyZ2V0IG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBSZW5kZXJUYXJnZXRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSByZW5kZXJUYXJnZXQgY2xhc3MgdG8gYWxsb3cgcmVuZGVyaW5nIHRvIHRleHR1cmVzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBSZW5kZXJUYXJnZXQoKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICB0aGlzLmlkID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzID0ge307XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgX3N0YWNrLnB1c2goIHRoaXMgKTtcclxuICAgICAgICBiaW5kKCB0aGlzICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgcmVuZGVyVGFyZ2V0IG9iamVjdCBhbmQgYmluZHMgdGhlIHJlbmRlclRhcmdldCBiZW5lYXRoIGl0IG9uXHJcbiAgICAgKiB0aGlzIHN0YWNrLiBJZiB0aGVyZSBpcyBubyB1bmRlcmx5aW5nIHJlbmRlclRhcmdldCwgYmluZCB0aGUgYmFja2J1ZmZlci5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0b3A7XHJcbiAgICAgICAgX3N0YWNrLnBvcCgpO1xyXG4gICAgICAgIHRvcCA9IF9zdGFjay50b3AoKTtcclxuICAgICAgICBpZiAoIHRvcCApIHtcclxuICAgICAgICAgICAgYmluZCggdG9wICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdW5iaW5kKCB0aGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIHRoZSBwcm92aWRlZCB0ZXh0dXJlIHRvIHRoZSBwcm92aWRlZCBhdHRhY2htZW50IGxvY2F0aW9uLlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIHRleHR1cmUgdG8gYXR0YWNoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIGF0dGFjaG1lbnQgaW5kZXguIChvcHRpb25hbClcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgLSBUaGUgdGV4dHVyZSB0YXJnZXQgdHlwZS4gKG9wdGlvbmFsKVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUuc2V0Q29sb3JUYXJnZXQgPSBmdW5jdGlvbiggdGV4dHVyZSwgaW5kZXgsIHRhcmdldCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGlmICggdHlwZW9mIGluZGV4ID09PSBcInN0cmluZ1wiICkge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSBpbmRleDtcclxuICAgICAgICAgICAgaW5kZXggPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluZGV4ID0gKCBpbmRleCAhPT0gdW5kZWZpbmVkICkgPyBpbmRleCA6IDA7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1sgJ2NvbG9yJyArIGluZGV4IF0gPSB0ZXh0dXJlO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxyXG4gICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcclxuICAgICAgICAgICAgZ2xbICdDT0xPUl9BVFRBQ0hNRU5UJyArIGluZGV4IF0sXHJcbiAgICAgICAgICAgIGdsWyB0YXJnZXQgfHwgXCJURVhUVVJFXzJEXCIgXSxcclxuICAgICAgICAgICAgdGV4dHVyZS5pZCxcclxuICAgICAgICAgICAgMCApO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgdGhlIHByb3ZpZGVkIHRleHR1cmUgdG8gdGhlIHByb3ZpZGVkIGF0dGFjaG1lbnQgbG9jYXRpb24uXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgdGV4dHVyZSB0byBhdHRhY2guXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5zZXREZXB0aFRhcmdldCA9IGZ1bmN0aW9uKCB0ZXh0dXJlICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlcy5kZXB0aCA9IHRleHR1cmU7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXHJcbiAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxyXG4gICAgICAgICAgICBnbC5ERVBUSF9BVFRBQ0hNRU5ULFxyXG4gICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICB0ZXh0dXJlLmlkLFxyXG4gICAgICAgICAgICAwICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGNvbG9yIGJpdHMgb2YgdGhlIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gciAtIFRoZSByZWQgdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gVGhlIGJsdWUgdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYSAtIFRoZSBhbHBoYSB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLmNsZWFyQ29sb3IgPSBmdW5jdGlvbiggciwgZywgYiwgYSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHIgPSAoIHIgIT09IHVuZGVmaW5lZCApID8gciA6IDA7XHJcbiAgICAgICAgZyA9ICggZyAhPT0gdW5kZWZpbmVkICkgPyBnIDogMDtcclxuICAgICAgICBiID0gKCBiICE9PSB1bmRlZmluZWQgKSA/IGIgOiAwO1xyXG4gICAgICAgIGEgPSAoIGEgIT09IHVuZGVmaW5lZCApID8gYSA6IDA7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuY2xlYXJDb2xvciggciwgZywgYiwgYSApO1xyXG4gICAgICAgIGdsLmNsZWFyKCBnbC5DT0xPUl9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGRlcHRoIGJpdHMgb2YgdGhlIHJlbmRlclRhcmdldC5cclxuICAgICAqIEBtZW1iZXJvZiBSZW5kZXJUYXJnZXRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UmVuZGVyVGFyZ2V0fSBUaGUgcmVuZGVyVGFyZ2V0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBSZW5kZXJUYXJnZXQucHJvdG90eXBlLmNsZWFyRGVwdGggPSBmdW5jdGlvbiggciwgZywgYiwgYSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHIgPSAoIHIgIT09IHVuZGVmaW5lZCApID8gciA6IDA7XHJcbiAgICAgICAgZyA9ICggZyAhPT0gdW5kZWZpbmVkICkgPyBnIDogMDtcclxuICAgICAgICBiID0gKCBiICE9PSB1bmRlZmluZWQgKSA/IGIgOiAwO1xyXG4gICAgICAgIGEgPSAoIGEgIT09IHVuZGVmaW5lZCApID8gYSA6IDA7XHJcbiAgICAgICAgdGhpcy5wdXNoKCk7XHJcbiAgICAgICAgZ2wuY2xlYXJDb2xvciggciwgZywgYiwgYSApO1xyXG4gICAgICAgIGdsLmNsZWFyKCBnbC5ERVBUSF9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIHN0ZW5jaWwgYml0cyBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICogQG1lbWJlcm9mIFJlbmRlclRhcmdldFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJUYXJnZXR9IFRoZSByZW5kZXJUYXJnZXQgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFJlbmRlclRhcmdldC5wcm90b3R5cGUuY2xlYXJTdGVuY2lsID0gZnVuY3Rpb24oIHIsIGcsIGIsIGEgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICByID0gKCByICE9PSB1bmRlZmluZWQgKSA/IHIgOiAwO1xyXG4gICAgICAgIGcgPSAoIGcgIT09IHVuZGVmaW5lZCApID8gZyA6IDA7XHJcbiAgICAgICAgYiA9ICggYiAhPT0gdW5kZWZpbmVkICkgPyBiIDogMDtcclxuICAgICAgICBhID0gKCBhICE9PSB1bmRlZmluZWQgKSA/IGEgOiAwO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoIHIsIGcsIGIsIGEgKTtcclxuICAgICAgICBnbC5jbGVhciggZ2wuU1RFTkNJTF9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgYWxsIHRoZSBiaXRzIG9mIHRoZSByZW5kZXJUYXJnZXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCByLCBnLCBiLCBhICkge1xyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgciA9ICggciAhPT0gdW5kZWZpbmVkICkgPyByIDogMDtcclxuICAgICAgICBnID0gKCBnICE9PSB1bmRlZmluZWQgKSA/IGcgOiAwO1xyXG4gICAgICAgIGIgPSAoIGIgIT09IHVuZGVmaW5lZCApID8gYiA6IDA7XHJcbiAgICAgICAgYSA9ICggYSAhPT0gdW5kZWZpbmVkICkgPyBhIDogMDtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICBnbC5jbGVhckNvbG9yKCByLCBnLCBiLCBhICk7XHJcbiAgICAgICAgZ2wuY2xlYXIoIGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUIHwgZ2wuU1RFTkNJTF9CVUZGRVJfQklUICk7XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemVzIHRoZSByZW5kZXJUYXJnZXQgYW5kIGFsbCBhdHRhY2hlZCB0ZXh0dXJlcyBieSB0aGUgcHJvdmlkZWQgaGVpZ2h0XHJcbiAgICAgKiBhbmQgd2lkdGguXHJcbiAgICAgKiBAbWVtYmVyb2YgUmVuZGVyVGFyZ2V0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIG5ldyB3aWR0aCBvZiB0aGUgcmVuZGVyVGFyZ2V0LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBuZXcgaGVpZ2h0IG9mIHRoZSByZW5kZXJUYXJnZXQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1JlbmRlclRhcmdldH0gVGhlIHJlbmRlclRhcmdldCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgUmVuZGVyVGFyZ2V0LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIga2V5O1xyXG4gICAgICAgIGlmICggIXdpZHRoIHx8ICFoZWlnaHQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggXCJXaWR0aCBvciBoZWlnaHQgYXJndW1lbnRzIG1pc3NpbmcsIGNvbW1hbmQgaWdub3JlZC5cIiApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICgga2V5IGluIHRoaXMudGV4dHVyZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhpcy50ZXh0dXJlcy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzWyBrZXkgXS5yZXNpemUoIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJUYXJnZXQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIFNoYWRlclBhcnNlciA9IHJlcXVpcmUoJy4vU2hhZGVyUGFyc2VyJyksXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvVXRpbCcpLFxyXG4gICAgICAgIFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL3V0aWwvWEhSTG9hZGVyJyksXHJcbiAgICAgICAgU3RhY2sgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrJyksXHJcbiAgICAgICAgVU5JRk9STV9GVU5DVElPTlMgPSB7XHJcbiAgICAgICAgICAgICdib29sJzogJ3VuaWZvcm0xaScsXHJcbiAgICAgICAgICAgICdmbG9hdCc6ICd1bmlmb3JtMWYnLFxyXG4gICAgICAgICAgICAnaW50JzogJ3VuaWZvcm0xaScsXHJcbiAgICAgICAgICAgICd1aW50JzogJ3VuZmlyb20xaScsXHJcbiAgICAgICAgICAgICd2ZWMyJzogJ3VuaWZvcm0yZnYnLFxyXG4gICAgICAgICAgICAnaXZlYzInOiAndW5pZm9ybTJpdicsXHJcbiAgICAgICAgICAgICd2ZWMzJzogJ3VuaWZvcm0zZnYnLFxyXG4gICAgICAgICAgICAnaXZlYzMnOiAndW5pZm9ybTNpdicsXHJcbiAgICAgICAgICAgICd2ZWM0JzogJ3VuaWZvcm00ZnYnLFxyXG4gICAgICAgICAgICAnaXZlYzQnOiAndW5pZm9ybTRpdicsXHJcbiAgICAgICAgICAgICdtYXQyJzogJ3VuaWZvcm1NYXRyaXgyZnYnLFxyXG4gICAgICAgICAgICAnbWF0Myc6ICd1bmlmb3JtTWF0cml4M2Z2JyxcclxuICAgICAgICAgICAgJ21hdDQnOiAndW5pZm9ybU1hdHJpeDRmdicsXHJcbiAgICAgICAgICAgICdzYW1wbGVyMkQnOiAndW5pZm9ybTFpJyxcclxuICAgICAgICAgICAgJ3NhbXBsZXJDdWJlJzogJ3VuaWZvcm0xaSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9zdGFjayA9IG5ldyBTdGFjaygpLFxyXG4gICAgICAgIF9ib3VuZFNoYWRlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHaXZlbiB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlciBzb3VyY2UsIHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmdcclxuICAgICAqIGluZm9ybWF0aW9uIHBlcnRhaW5pbmcgdG8gdGhlIHVuaWZvcm1zIGFuZCBhdHRyaWJ0dWVzIGRlY2xhcmVkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2ZXJ0U291cmNlIC0gVGhlIHZlcnRleCBzaGFkZXIgc291cmNlLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZyYWdTb3VyY2UgLSBUaGUgZnJhZ21lbnQgc2hhZGVyIHNvdXJjZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXNGcm9tU291cmNlKCB2ZXJ0U291cmNlLCBmcmFnU291cmNlICkge1xyXG4gICAgICAgIHZhciBkZWNsYXJhdGlvbnMgPSBTaGFkZXJQYXJzZXIucGFyc2VEZWNsYXJhdGlvbnMoXHJcbiAgICAgICAgICAgICAgICBbIHZlcnRTb3VyY2UsIGZyYWdTb3VyY2UgXSxcclxuICAgICAgICAgICAgICAgIFsgJ3VuaWZvcm0nLCAnYXR0cmlidXRlJyBdKSxcclxuICAgICAgICAgICAgYXR0cmlidXRlcyA9IHt9LFxyXG4gICAgICAgICAgICB1bmlmb3JtcyA9IHt9LFxyXG4gICAgICAgICAgICBhdHRyQ291bnQgPSAwLFxyXG4gICAgICAgICAgICBkZWNsYXJhdGlvbixcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBkZWNsYXJhdGlvbiBpbiB0aGUgc2hhZGVyXHJcbiAgICAgICAgZm9yICggaT0wOyBpPGRlY2xhcmF0aW9ucy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgZGVjbGFyYXRpb24gPSBkZWNsYXJhdGlvbnNbaV07XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0cyBhbiBhdHRyaWJ1dGUgb3IgdW5pZm9ybVxyXG4gICAgICAgICAgICBpZiAoIGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ2F0dHJpYnV0ZScgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBhdHRyaWJ1dGUsIHN0b3JlIHR5cGUgYW5kIGluZGV4XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzWyBkZWNsYXJhdGlvbi5uYW1lIF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogYXR0ckNvdW50KytcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRlY2xhcmF0aW9uLnF1YWxpZmllciA9PT0gJ3VuaWZvcm0nICkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdW5pZm9ybSwgc3RvcmUgdHlwZSBhbmQgYnVmZmVyIGZ1bmN0aW9uIG5hbWVcclxuICAgICAgICAgICAgICAgIHVuaWZvcm1zWyBkZWNsYXJhdGlvbi5uYW1lIF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVjbGFyYXRpb24udHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBVTklGT1JNX0ZVTkNUSU9OU1sgZGVjbGFyYXRpb24udHlwZSBdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIHVuaWZvcm1zOiB1bmlmb3Jtc1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdpdmVuIGEgc2hhZGVyIHNvdXJjZSBzdHJpbmcgYW5kIHNoYWRlciB0eXBlLCBjb21waWxlcyB0aGUgc2hhZGVyIGFuZFxyXG4gICAgICogcmV0dXJucyB0aGUgcmVzdWx0aW5nIFdlYkdMU2hhZGVyIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMUmVuZGVyaW5nQ29udGV4dH0gZ2wgLSBUaGUgd2ViZ2wgcmVuZGVyaW5nIGNvbnRleHQuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2hhZGVyU291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2UuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSBzaGFkZXIgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7V2ViR0xTaGFkZXJ9IFRoZSBjb21waWxlZCBzaGFkZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjb21waWxlU2hhZGVyKCBnbCwgc2hhZGVyU291cmNlLCB0eXBlICkge1xyXG4gICAgICAgIHZhciBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoIGdsWyB0eXBlIF0gKTtcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2UoIHNoYWRlciwgc2hhZGVyU291cmNlICk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlciggc2hhZGVyICk7XHJcbiAgICAgICAgaWYgKCAhZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKCBzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTICkgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiBcIiArXHJcbiAgICAgICAgICAgICAgICBnbC5nZXRTaGFkZXJJbmZvTG9nKCBzaGFkZXIgKSApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBhdHRyaWJ1dGUgbG9jYXRpb25zIGZvciB0aGUgU2hhZGVyIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoIHNoYWRlciApIHtcclxuICAgICAgICB2YXIgZ2wgPSBzaGFkZXIuZ2wsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBzaGFkZXIuYXR0cmlidXRlcyxcclxuICAgICAgICAgICAgbmFtZTtcclxuICAgICAgICBmb3IgKCBuYW1lIGluIGF0dHJpYnV0ZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gYmluZCB0aGUgYXR0cmlidXRlIGxvY2F0aW9uXHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQXR0cmliTG9jYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhZGVyLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNbIG5hbWUgXS5pbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lICk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdCb3VuZCB2ZXJ0ZXggYXR0cmlidXRlIFxcJycgKyBuYW1lICtcclxuICAgICAgICAgICAgICAgICAgICAnXFwnIHRvIGxvY2F0aW9uICcgKyBhdHRyaWJ1dGVzWyBuYW1lIF0uaW5kZXggKTtcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBRdWVyaWVzIHRoZSB3ZWJnbCByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHVuaWZvcm0gbG9jYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U2hhZGVyfSBzaGFkZXIgLSBUaGUgU2hhZGVyIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0VW5pZm9ybUxvY2F0aW9ucyggc2hhZGVyICkge1xyXG4gICAgICAgIHZhciBnbCA9IHNoYWRlci5nbCxcclxuICAgICAgICAgICAgdW5pZm9ybXMgPSBzaGFkZXIudW5pZm9ybXMsXHJcbiAgICAgICAgICAgIHVuaWZvcm0sXHJcbiAgICAgICAgICAgIG5hbWU7XHJcbiAgICAgICAgZm9yICggbmFtZSBpbiB1bmlmb3JtcyApIHtcclxuICAgICAgICAgICAgaWYgKCB1bmlmb3Jtcy5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xyXG4gICAgICAgICAgICAgICAgdW5pZm9ybSA9IHVuaWZvcm1zWyBuYW1lIF07XHJcbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIHVuaWZvcm0gbG9jYXRpb25cclxuICAgICAgICAgICAgICAgIHVuaWZvcm0ubG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oIHNoYWRlci5pZCwgbmFtZSApO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBuYW1lICsgXCIsIFwiICtcclxuICAgICAgICAgICAgICAgICAgICBnbC5nZXRVbmlmb3JtTG9jYXRpb24oIHNoYWRlci5pZCwgbmFtZSApICsgXCIsXCIgKTtcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBzaGFkZXIgc291cmNlIGZyb20gYSB1cmwuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gbG9hZCB0aGUgcmVzb3VyY2UgZnJvbS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBsb2FkIHRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsb2FkU2hhZGVyU291cmNlKCB1cmwgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICBYSFJMb2FkZXIubG9hZChcclxuICAgICAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGRvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBlcnIgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggbnVsbCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgc291cmNlIG9mIHRoZSBzaGFkZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdG8gcGFzcyB0aHJvdWdoIHRoZSBzaGFkZXIgc291cmNlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXNzVGhyb3VnaFNvdXJjZSggc291cmNlICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgZG9uZSggc291cmNlICk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGFuIGFycmF5IG9mIEdMU0wgc291cmNlIHN0cmluZ3MgYW5kIFVSTHMsXHJcbiAgICAgKiBhbmQgcmVzb2x2ZXMgdGhlbSBpbnRvIGFuZCBhcnJheSBvZiBHTFNMIHNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVNvdXJjZXMoIHNvdXJjZXMgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICB2YXIgam9icyA9IFtdO1xyXG4gICAgICAgICAgICBzb3VyY2VzID0gc291cmNlcyB8fCBbXTtcclxuICAgICAgICAgICAgc291cmNlcyA9ICggISggc291cmNlcyBpbnN0YW5jZW9mIEFycmF5ICkgKSA/IFsgc291cmNlcyBdIDogc291cmNlcztcclxuICAgICAgICAgICAgc291cmNlcy5mb3JFYWNoKCBmdW5jdGlvbiggc291cmNlICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBTaGFkZXJQYXJzZXIuaXNHTFNMKCBzb3VyY2UgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goIHBhc3NUaHJvdWdoU291cmNlKCBzb3VyY2UgKSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBqb2JzLnB1c2goIGxvYWRTaGFkZXJTb3VyY2UoIHNvdXJjZSApICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbiggcmVzdWx0cyApIHtcclxuICAgICAgICAgICAgICAgIGRvbmUoIHJlc3VsdHMgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0LCBjYWNoaW5nIGl0IHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgcmViaW5kcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1NoYWRlcn0gc2hhZGVyIC0gVGhlIFNoYWRlciBvYmplY3QgdG8gYmluZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYmluZCggc2hhZGVyICkge1xyXG4gICAgICAgIC8vIGlmIHRoaXMgc2hhZGVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZFNoYWRlciA9PT0gc2hhZGVyICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYWRlci5nbC51c2VQcm9ncmFtKCBzaGFkZXIuaWQgKTtcclxuICAgICAgICBfYm91bmRTaGFkZXIgPSBzaGFkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0LiBQcmV2ZW50cyB1bm5lY2Vzc2FyeSB1bmJpbmRpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0IHRvIHVuYmluZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdW5iaW5kKCBzaGFkZXIgKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gc2hhZGVyIGJvdW5kLCBleGl0IGVhcmx5XHJcbiAgICAgICAgaWYgKCBfYm91bmRTaGFkZXIgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhZGVyLmdsLnVzZVByb2dyYW0oIG51bGwgKTtcclxuICAgICAgICBfYm91bmRTaGFkZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBzaGFkZXIgYXR0cmlidXRlcyBkdWUgdG8gYWJvcnRpbmcgb2YgaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTaGFkZXJ9IHNoYWRlciAtIFRoZSBTaGFkZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhYm9ydFNoYWRlciggc2hhZGVyICkge1xyXG4gICAgICAgIHNoYWRlci5pZCA9IG51bGw7XHJcbiAgICAgICAgc2hhZGVyLmF0dHJpYnV0ZXMgPSBudWxsO1xyXG4gICAgICAgIHNoYWRlci51bmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbnRpYXRlcyBhIFNoYWRlciBvYmplY3QuXHJcbiAgICAgKiBAY2xhc3MgU2hhZGVyXHJcbiAgICAgKiBAY2xhc3NkZXNjIEEgc2hhZGVyIGNsYXNzIHRvIGFzc2lzdCBpbiBjb21waWxpbmcgYW5kIGxpbmtpbmcgd2ViZ2xcclxuICAgICAqIHNoYWRlcnMsIHN0b3JpbmcgYXR0cmlidXRlIGFuZCB1bmlmb3JtIGxvY2F0aW9ucywgYW5kIGJ1ZmZlcmluZyB1bmlmb3Jtcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU2hhZGVyKCBzcGVjLCBjYWxsYmFjayApIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgdGhpcy5pZCA9IDA7XHJcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICB0aGlzLnZlcnNpb24gPSBzcGVjLnZlcnNpb24gfHwgJzEuMDAnO1xyXG4gICAgICAgIC8vIGNoZWNrIHNvdXJjZSBhcmd1bWVudHNcclxuICAgICAgICBpZiAoICFzcGVjLnZlcnQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiVmVydGV4IHNoYWRlciBhcmd1bWVudCBoYXMgbm90IGJlZW4gcHJvdmlkZWQsIFwiICtcclxuICAgICAgICAgICAgICAgIFwic2hhZGVyIGluaXRpYWxpemF0aW9uIGFib3J0ZWQuXCIgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhc3BlYy5mcmFnICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkZyYWdtZW50IHNoYWRlciBhcmd1bWVudCBoYXMgbm90IGJlZW4gcHJvdmlkZWQsIFwiICtcclxuICAgICAgICAgICAgICAgIFwic2hhZGVyIGluaXRpYWxpemF0aW9uIGFib3J0ZWQuXCIgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBzaGFkZXJcclxuICAgICAgICBVdGlsLmFzeW5jKHtcclxuICAgICAgICAgICAgY29tbW9uOiByZXNvbHZlU291cmNlcyggc3BlYy5jb21tb24gKSxcclxuICAgICAgICAgICAgdmVydDogcmVzb2x2ZVNvdXJjZXMoIHNwZWMudmVydCApLFxyXG4gICAgICAgICAgICBmcmFnOiByZXNvbHZlU291cmNlcyggc3BlYy5mcmFnICksXHJcbiAgICAgICAgfSwgZnVuY3Rpb24oIHNoYWRlcnMgKSB7XHJcbiAgICAgICAgICAgIHRoYXQuY3JlYXRlKCBzaGFkZXJzICk7XHJcbiAgICAgICAgICAgIGlmICggY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggdGhhdCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBzaGFkZXIgb2JqZWN0IGZyb20gc291cmNlIHN0cmluZ3MuIFRoaXMgaW5jbHVkZXM6XHJcbiAgICAgKiAgICAxKSBDb21waWxpbmcgYW5kIGxpbmtpbmcgdGhlIHNoYWRlciBwcm9ncmFtLlxyXG4gICAgICogICAgMikgUGFyc2luZyBzaGFkZXIgc291cmNlIGZvciBhdHRyaWJ1dGUgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24uXHJcbiAgICAgKiAgICAzKSBCaW5kaW5nIGF0dHJpYnV0ZSBsb2NhdGlvbnMsIGJ5IG9yZGVyIG9mIGRlbGNhcmF0aW9uLlxyXG4gICAgICogICAgNCkgUXVlcnlpbmcgYW5kIHN0b3JpbmcgdW5pZm9ybSBsb2NhdGlvbi5cclxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2hhZGVycyAtIEEgbWFwIGNvbnRhaW5pbmcgc291cmNlcyB1bmRlciAndmVydCcgYW5kXHJcbiAgICAgKiAgICAgJ2ZyYWcnIGF0dHJpYnV0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgU2hhZGVyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiggc2hhZGVycyApIHtcclxuICAgICAgICAvLyBvbmNlIGFsbCBzaGFkZXIgc291cmNlcyBhcmUgbG9hZGVkXHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbCxcclxuICAgICAgICAgICAgY29tbW9uID0gc2hhZGVycy5jb21tb24uam9pbiggXCJcIiApLFxyXG4gICAgICAgICAgICB2ZXJ0ID0gc2hhZGVycy52ZXJ0LmpvaW4oIFwiXCIgKSxcclxuICAgICAgICAgICAgZnJhZyA9IHNoYWRlcnMuZnJhZy5qb2luKCBcIlwiICksXHJcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcixcclxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXIsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNBbmRVbmlmb3JtcztcclxuICAgICAgICAvLyBjb21waWxlIHNoYWRlcnNcclxuICAgICAgICB2ZXJ0ZXhTaGFkZXIgPSBjb21waWxlU2hhZGVyKCBnbCwgY29tbW9uICsgdmVydCwgXCJWRVJURVhfU0hBREVSXCIgKTtcclxuICAgICAgICBmcmFnbWVudFNoYWRlciA9IGNvbXBpbGVTaGFkZXIoIGdsLCBjb21tb24gKyBmcmFnLCBcIkZSQUdNRU5UX1NIQURFUlwiICk7XHJcbiAgICAgICAgaWYgKCAhdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlciApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJBYm9ydGluZyBpbnN0YW50aWF0aW9uIG9mIHNoYWRlciBkdWUgdG8gY29tcGlsYXRpb24gZXJyb3JzLlwiICk7XHJcbiAgICAgICAgICAgIHJldHVybiBhYm9ydFNoYWRlciggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwYXJzZSBzb3VyY2UgZm9yIGF0dHJpYnV0ZSBhbmQgdW5pZm9ybXNcclxuICAgICAgICBhdHRyaWJ1dGVzQW5kVW5pZm9ybXMgPSBnZXRBdHRyaWJ1dGVzQW5kVW5pZm9ybXNGcm9tU291cmNlKCB2ZXJ0LCBmcmFnICk7XHJcbiAgICAgICAgLy8gc2V0IG1lbWJlciBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlc0FuZFVuaWZvcm1zLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtcyA9IGF0dHJpYnV0ZXNBbmRVbmlmb3Jtcy51bmlmb3JtcztcclxuICAgICAgICAvLyBjcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICAgICAgdGhpcy5pZCA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICAvLyBhdHRhY2ggdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXJzXHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKCB0aGlzLmlkLCB2ZXJ0ZXhTaGFkZXIgKTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoIHRoaXMuaWQsIGZyYWdtZW50U2hhZGVyICk7XHJcbiAgICAgICAgLy8gYmluZCB2ZXJ0ZXggYXR0cmlidXRlIGxvY2F0aW9ucyBCRUZPUkUgbGlua2luZ1xyXG4gICAgICAgIGJpbmRBdHRyaWJ1dGVMb2NhdGlvbnMoIHRoaXMgKTtcclxuICAgICAgICAvLyBsaW5rIHNoYWRlclxyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKCB0aGlzLmlkICk7XHJcbiAgICAgICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcclxuICAgICAgICBpZiAoICFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKCB0aGlzLmlkLCBnbC5MSU5LX1NUQVRVUyApICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIkFuIGVycm9yIG9jY3VyZWQgbGlua2luZyB0aGUgc2hhZGVyOiBcIiArXHJcbiAgICAgICAgICAgICAgICBnbC5nZXRQcm9ncmFtSW5mb0xvZyggdGhpcy5pZCApICk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiQWJvcnRpbmcgaW5zdGFudGlhdGlvbiBvZiBzaGFkZXIgZHVlIHRvIGxpbmtpbmcgZXJyb3JzLlwiICk7XHJcbiAgICAgICAgICAgIHJldHVybiBhYm9ydFNoYWRlciggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgc2hhZGVyIHVuaWZvcm0gbG9jYXRpb25zXHJcbiAgICAgICAgZ2V0VW5pZm9ybUxvY2F0aW9ucyggdGhpcyApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0IGFuZCBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBzdGFjay5cclxuICAgICAqIEBtZW1iZXJvZiBTaGFkZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7U2hhZGVyfSBUaGUgc2hhZGVyIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBTaGFkZXIucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBfc3RhY2sucHVzaCggdGhpcyApO1xyXG4gICAgICAgIGJpbmQoIHRoaXMgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmRzIHRoZSBzaGFkZXIgb2JqZWN0IGFuZCBiaW5kcyB0aGUgc2hhZGVyIGJlbmVhdGggaXQgb25cclxuICAgICAqIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgc2hhZGVyLCBiaW5kIHRoZSBiYWNrYnVmZmVyLlxyXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIFNoYWRlci5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRvcDtcclxuICAgICAgICBfc3RhY2sucG9wKCk7XHJcbiAgICAgICAgdG9wID0gX3N0YWNrLnRvcCgpO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBiaW5kKCB0b3AgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1bmJpbmQoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVmZmVyIGEgdW5pZm9ybSB2YWx1ZSBieSBuYW1lLlxyXG4gICAgICogQG1lbWJlcm9mIFNoYWRlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1bmlmb3JtTmFtZSAtIFRoZSB1bmlmb3JtIG5hbWUgaW4gdGhlIHNoYWRlciBzb3VyY2UuXHJcbiAgICAgKiBAcGFyYW0geyp9IHVuaWZvcm0gLSBUaGUgdW5pZm9ybSB2YWx1ZSB0byBidWZmZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1NoYWRlcn0gVGhlIHNoYWRlciBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgU2hhZGVyLnByb3RvdHlwZS5zZXRVbmlmb3JtID0gZnVuY3Rpb24oIHVuaWZvcm1OYW1lLCB1bmlmb3JtICkge1xyXG4gICAgICAgIGlmICggIXRoaXMuaWQgKSB7XHJcbiAgICAgICAgICAgIGlmICggIXRoaXMuaGFzTG9nZ2VkRXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJBdHRlbXB0aW5nIHRvIHVzZSBhbiBpbmNvbXBsZXRlIHNoYWRlciwgaWdub3JpbmcgY29tbWFuZC5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhc0xvZ2dlZEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB1bmlmb3JtU3BlYyA9IHRoaXMudW5pZm9ybXNbIHVuaWZvcm1OYW1lIF0sXHJcbiAgICAgICAgICAgIGZ1bmMsXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uLFxyXG4gICAgICAgICAgICB2YWx1ZTtcclxuICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGUgdW5pZm9ybSBzcGVjIGV4aXN0cyBmb3IgdGhlIG5hbWVcclxuICAgICAgICBpZiAoICF1bmlmb3JtU3BlYyApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCAnTm8gdW5pZm9ybSBmb3VuZCB1bmRlciBuYW1lIFwiJyArIHVuaWZvcm1OYW1lICtcclxuICAgICAgICAgICAgICAgICdcIiwgY29tbWFuZCBpZ25vcmVkJyApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZSB1bmlmb3JtIGFyZ3VtZW50IGlzIGRlZmluZWRcclxuICAgICAgICBpZiAoIHVuaWZvcm0gPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCAnQXJndW1lbnQgcGFzc2VkIGZvciB1bmlmb3JtIFwiJyArIHVuaWZvcm1OYW1lICtcclxuICAgICAgICAgICAgICAgICdcIiBpcyB1bmRlZmluZWQsIGNvbW1hbmQgaWdub3JlZCcgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgdGhlIHVuaWZvcm0gbG9jYXRpb24sIHR5cGUsIGFuZCBidWZmZXIgZnVuY3Rpb25cclxuICAgICAgICBmdW5jID0gdW5pZm9ybVNwZWMuZnVuYztcclxuICAgICAgICB0eXBlID0gdW5pZm9ybVNwZWMudHlwZTtcclxuICAgICAgICBsb2NhdGlvbiA9IHVuaWZvcm1TcGVjLmxvY2F0aW9uO1xyXG4gICAgICAgIHZhbHVlID0gdW5pZm9ybS50b0FycmF5ID8gdW5pZm9ybS50b0FycmF5KCkgOiB1bmlmb3JtO1xyXG4gICAgICAgIHZhbHVlID0gKCB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5ICkgPyBuZXcgRmxvYXQzMkFycmF5KCB2YWx1ZSApIDogdmFsdWU7XHJcbiAgICAgICAgLy8gY29udmVydCBib29sZWFuJ3MgdG8gMCBvciAxXHJcbiAgICAgICAgdmFsdWUgPSAoIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIgKSA/ICggdmFsdWUgPyAxIDogMCApIDogdmFsdWU7XHJcbiAgICAgICAgLy8gcGFzcyB0aGUgYXJndW1lbnRzIGRlcGVuZGluZyBvbiB0aGUgdHlwZVxyXG4gICAgICAgIHN3aXRjaCAoIHR5cGUgKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ21hdDInOlxyXG4gICAgICAgICAgICBjYXNlICdtYXQzJzpcclxuICAgICAgICAgICAgY2FzZSAnbWF0NCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsWyBmdW5jIF0oIGxvY2F0aW9uLCBmYWxzZSwgdmFsdWUgKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbFsgZnVuYyBdKCBsb2NhdGlvbiwgdmFsdWUgKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTaGFkZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBQUkVDSVNJT05fUVVBTElGSUVSUyA9IHtcclxuICAgICAgICBoaWdocDogdHJ1ZSxcclxuICAgICAgICBtZWRpdW1wOiB0cnVlLFxyXG4gICAgICAgIGxvd3A6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHN0YW5kYXJkIGNvbW1lbnRzIGZyb20gdGhlIHByb3ZpZGVkIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzdHJpcCBjb21tZW50cyBmcm9tLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGNvbW1lbnRsZXNzIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc3RyaXBDb21tZW50cyggc3RyICkge1xyXG4gICAgICAgIC8vIHJlZ2V4IHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL21vYWdyaXVzL3N0cmlwY29tbWVudHNcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhcXC9cXCooW1xcc1xcU10qPylcXCpcXC8pfChcXC9cXC8oLiopJCkvZ20sICcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGFsbCB3aGl0ZXNwYWNlIGludG8gYSBzaW5nbGUgJyAnIHNwYWNlIGNoYXJhY3Rlci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBub3JtYWxpemUgd2hpdGVzcGFjZSBmcm9tLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBub3JtYWxpemVXaGl0ZXNwYWNlKCBzdHIgKSB7XHJcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBlbmQgbGluZXMsIHJlcGxhY2UgYWxsIHdoaXRlc3BhY2Ugd2l0aCBhIHNpbmdsZSAnICcgc3BhY2VcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sXCJcIikucmVwbGFjZSgvXFxzezIsfS9nLCAnICcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGFyc2VzIGEgc2luZ2xlICdzdGF0ZW1lbnQnLiBBICdzdGF0ZW1lbnQnIGlzIGNvbnNpZGVyZWQgYW55IHNlcXVlbmNlIG9mXHJcbiAgICAgKiBjaGFyYWN0ZXJzIGZvbGxvd2VkIGJ5IGEgc2VtaS1jb2xvbi4gVGhlcmVmb3JlLCBhIHNpbmdsZSAnc3RhdGVtZW50JyBpblxyXG4gICAgICogdGhpcyBzZW5zZSBjb3VsZCBjb250YWluIHNldmVyYWwgY29tbWEgc2VwYXJhdGVkIGRlY2xhcmF0aW9ucy4gUmV0dXJuc1xyXG4gICAgICogYWxsIHJlc3VsdGluZyBkZWNsYXJhdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlbWVudCAtIFRoZSBzdGF0ZW1lbnQgdG8gcGFyc2UuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcGFyc2VkIGRlY2xhcmF0aW9uIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlU3RhdGVtZW50KCBzdGF0ZW1lbnQgKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlTmFtZUFuZENvdW50KCBlbnRyeSApIHtcclxuICAgICAgICAgICAgLy8gc3BsaXQgb24gJ1tdJyBhbmQgdHJpbSB3aGl0ZXNwY2UgdG8gY2hlY2sgZm9yIGFycmF5c1xyXG4gICAgICAgICAgICB2YXIgc3BsaXQgPSBlbnRyeS5zcGxpdCgvW1xcW1xcXV0vKS5tYXAoIGZ1bmN0aW9uKCBlbGVtICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW0udHJpbSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHF1YWxpZmllcjogcXVhbGlmaWVyLFxyXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiBwcmVjaXNpb24sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogc3BsaXRbMF0sXHJcbiAgICAgICAgICAgICAgICBjb3VudDogKCBzcGxpdFsxXSA9PT0gdW5kZWZpbmVkICkgPyAxIDogcGFyc2VJbnQoIHNwbGl0WzFdLCAxMCApXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdLFxyXG4gICAgICAgICAgICBjb21tYVNwbGl0LFxyXG4gICAgICAgICAgICBoZWFkZXIsXHJcbiAgICAgICAgICAgIHF1YWxpZmllcixcclxuICAgICAgICAgICAgcHJlY2lzaW9uLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBuYW1lcyxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBzcGxpdCBzdGF0ZW1lbnQgb24gY29tbWFzXHJcbiAgICAgICAgY29tbWFTcGxpdCA9IHN0YXRlbWVudC5zcGxpdCgnLCcpLm1hcCggZnVuY3Rpb24oIGVsZW0gKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtLnRyaW0oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzcGxpdCBkZWNsYXJhdGlvbiBoZWFkZXIgZnJvbSBzdGF0ZW1lbnRcclxuICAgICAgICBoZWFkZXIgPSBjb21tYVNwbGl0LnNoaWZ0KCkuc3BsaXQoJyAnKTtcclxuICAgICAgICAvLyBxdWFsaWZpZXIgaXMgYWx3YXlzIGZpcnN0IGVsZW1lbnRcclxuICAgICAgICBxdWFsaWZpZXIgPSBoZWFkZXIuc2hpZnQoKTtcclxuICAgICAgICAvLyBwcmVjaXNpb24gbWF5IG9yIG1heSBub3QgYmUgZGVjbGFyZWRcclxuICAgICAgICBwcmVjaXNpb24gPSBoZWFkZXIuc2hpZnQoKTtcclxuICAgICAgICAvLyBpZiBub3QgYSBwcmVjaXNpb24ga2V5d29yZCBpdCBpcyB0aGUgdHlwZSBpbnN0ZWFkXHJcbiAgICAgICAgaWYgKCAhUFJFQ0lTSU9OX1FVQUxJRklFUlNbIHByZWNpc2lvbiBdICkge1xyXG4gICAgICAgICAgICB0eXBlID0gcHJlY2lzaW9uO1xyXG4gICAgICAgICAgICBwcmVjaXNpb24gPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHR5cGUgPSBoZWFkZXIuc2hpZnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc3BsaXQgcmVtYWluaW5nIG5hbWVzIGJ5IGNvbW1hcyBhbmQgdHJpbSB3aGl0ZXNwYWNlXHJcbiAgICAgICAgbmFtZXMgPSBoZWFkZXIuY29uY2F0KCBjb21tYVNwbGl0ICk7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG90aGVyIG5hbWVzIGFmdGVyIGEgJywnIGFkZCB0aGVtIGFzIHdlbGxcclxuICAgICAgICBmb3IgKCBpPTA7IGk8bmFtZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCggcGFyc2VOYW1lQW5kQ291bnQoIG5hbWVzW2ldICkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTcGxpdHMgdGhlIHNvdXJjZSBzdHJpbmcgYnkgc2VtaS1jb2xvbnMgYW5kIGNvbnN0cnVjdHMgYW4gYXJyYXkgb2ZcclxuICAgICAqIGRlY2xhcmF0aW9uIG9iamVjdHMgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHF1YWxpZmllciBrZXl3b3Jkcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2Ugc3RyaW5nLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGtleXdvcmQgLSBUaGUgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIGtleXdvcmQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgcXVhbGlmaWVyIGRlY2xhcmF0aW9uIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlU291cmNlKCBzb3VyY2UsIGtleXdvcmQgKSB7XHJcbiAgICAgICAgLy8gZ2V0IHN0YXRlbWVudHMgKCBhbnkgc2VxdWVuY2UgZW5kaW5nIGluIDsgKSBjb250YWluaW5nIGFueVxyXG4gICAgICAgIC8vIG9mIHRoZSBnaXZlbiBrZXl3b3Jkc1xyXG4gICAgICAgIHZhciBrZXl3b3JkU3RyID0gKCBrZXl3b3JkIGluc3RhbmNlb2YgQXJyYXkgKSA/IGtleXdvcmQuam9pbignfCcpIDoga2V5d29yZCxcclxuICAgICAgICAgICAga2V5d29yZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeLipcXFxcYihcIitrZXl3b3JkU3RyK1wiKVxcXFxiLipcIiwgJ2dtJyApLFxyXG4gICAgICAgICAgICBjb21tZW50bGVzc1NvdXJjZSA9IHN0cmlwQ29tbWVudHMoIHNvdXJjZSApLFxyXG4gICAgICAgICAgICBub3JtYWxpemVkID0gbm9ybWFsaXplV2hpdGVzcGFjZSggY29tbWVudGxlc3NTb3VyY2UgKSxcclxuICAgICAgICAgICAgc3RhdGVtZW50cyA9IG5vcm1hbGl6ZWQuc3BsaXQoJzsnKSxcclxuICAgICAgICAgICAgbWF0Y2hlZCA9IFtdLFxyXG4gICAgICAgICAgICBtYXRjaCwgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBzdGF0ZW1lbnRcclxuICAgICAgICBmb3IgKCBpPTA7IGk8c3RhdGVtZW50cy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gbG9vayBmb3Iga2V5d29yZHNcclxuICAgICAgICAgICAgbWF0Y2ggPSBzdGF0ZW1lbnRzW2ldLnRyaW0oKS5tYXRjaCgga2V5d29yZFJlZ2V4ICk7XHJcbiAgICAgICAgICAgIGlmICggbWF0Y2ggKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBzdGF0ZW1lbnQgYW5kIGFkZCB0byBhcnJheVxyXG4gICAgICAgICAgICAgICAgbWF0Y2hlZCA9IG1hdGNoZWQuY29uY2F0KCBwYXJzZVN0YXRlbWVudCggbWF0Y2hbMF0gKSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXRjaGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmlsdGVycyBvdXQgZHVwbGljYXRlIGRlY2xhcmF0aW9ucyBwcmVzZW50IGJldHdlZW4gc2hhZGVycy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBkZWNsYXJhdGlvbnMgLSBUaGUgYXJyYXkgb2YgZGVjbGFyYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGZpbHRlcmVkIGFycmF5IG9mIGRlY2xhcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZmlsdGVyRHVwbGljYXRlc0J5TmFtZSggZGVjbGFyYXRpb25zICkge1xyXG4gICAgICAgIC8vIGluIGNhc2VzIHdoZXJlIHRoZSBzYW1lIGRlY2xhcmF0aW9ucyBhcmUgcHJlc2VudCBpbiBtdWx0aXBsZVxyXG4gICAgICAgIC8vIHNvdXJjZXMsIHRoaXMgZnVuY3Rpb24gd2lsbCByZW1vdmUgZHVwbGljYXRlcyBmcm9tIHRoZSByZXN1bHRzXHJcbiAgICAgICAgdmFyIHNlZW4gPSB7fTtcclxuICAgICAgICByZXR1cm4gZGVjbGFyYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGRlY2xhcmF0aW9uICkge1xyXG4gICAgICAgICAgICBpZiAoIHNlZW5bIGRlY2xhcmF0aW9uLm5hbWUgXSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWVuWyBkZWNsYXJhdGlvbi5uYW1lIF0gPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIHRoZSBwcm92aWRlZCBHTFNMIHNvdXJjZSwgYW5kIHJldHVybnMgYWxsIGRlY2xhcmF0aW9uIHN0YXRlbWVudHNcclxuICAgICAgICAgKiB0aGF0IGNvbnRhaW4gdGhlIHByb3ZpZGVkIHF1YWxpZmllciB0eXBlLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGV4dHJhY3RcclxuICAgICAgICAgKiBhbGwgYXR0cmlidXRlcyBhbmQgdW5pZm9ybSBuYW1lcyBhbmQgdHlwZXMgZnJvbSBhIHNoYWRlci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEZvciBleGFtcGxlLCB3aGVuIHByb3ZpZGVkIGEgXCJ1bmlmb3JtXCIgcXVhbGlmaWVycywgdGhlIGRlY2xhcmF0aW9uOlxyXG4gICAgICAgICAqIDxwcmU+XHJcbiAgICAgICAgICogICAgIFwidW5pZm9ybSBoaWdocCB2ZWMzIHVTcGVjdWxhckNvbG9yO1wiXHJcbiAgICAgICAgICogPC9wcmU+XHJcbiAgICAgICAgICogV291bGQgYmUgcGFyc2VkIHRvOlxyXG4gICAgICAgICAqIDxwcmU+XHJcbiAgICAgICAgICogICAgIHtcclxuICAgICAgICAgKiAgICAgICAgIHF1YWxpZmllcjogXCJ1bmlmb3JtXCIsXHJcbiAgICAgICAgICogICAgICAgICB0eXBlOiBcInZlYzNcIixcclxuICAgICAgICAgKiAgICAgICAgIG5hbWU6IFwidVNwZWN1bGFyQ29sb3JcIixcclxuICAgICAgICAgKiAgICAgICAgIGNvdW50OiAxXHJcbiAgICAgICAgICogICAgIH1cclxuICAgICAgICAgKiA8L3ByZT5cclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gc291cmNlIC0gVGhlIHNoYWRlciBzb3VyY2VzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBxdWFsaWZpZXJzIC0gVGhlIHF1YWxpZmllcnMgdG8gZXh0cmFjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIHF1YWxpZmllciBkZWNsYXJhdGlvbiBzdGF0ZW1lbnRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHBhcnNlRGVjbGFyYXRpb25zOiBmdW5jdGlvbiggc291cmNlLCBxdWFsaWZpZXJzICkge1xyXG4gICAgICAgICAgICAvLyBpZiBubyBxdWFsaWZpZXJzIGFyZSBwcm92aWRlZCwgcmV0dXJuIGVtcHR5IGFycmF5XHJcbiAgICAgICAgICAgIGlmICggIXF1YWxpZmllcnMgfHwgcXVhbGlmaWVycy5sZW5ndGggPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNvdXJjZXMgPSAoIHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ICkgPyBzb3VyY2UgOiBbIHNvdXJjZSBdLFxyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zID0gW10sXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8c291cmNlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucyA9IGRlY2xhcmF0aW9ucy5jb25jYXQoIHBhcnNlU291cmNlKCBzb3VyY2VzW2ldLCBxdWFsaWZpZXJzICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyByZW1vdmUgZHVwbGljYXRlcyBhbmQgcmV0dXJuXHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJEdXBsaWNhdGVzQnlOYW1lKCBkZWNsYXJhdGlvbnMgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXRlY3RzIGJhc2VkIG9uIHRoZSBleGlzdGVuY2Ugb2YgYSAndm9pZCBtYWluKCkgeycgc3RhdGVtZW50LCBpZlxyXG4gICAgICAgICAqIHRoZSBzdHJpbmcgaXMgZ2xzbCBzb3VyY2UgY29kZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIHRlc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgZ2xzbCBjb2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzR0xTTDogZnVuY3Rpb24oIHN0ciApIHtcclxuICAgICAgICAgICAgcmV0dXJuIC92b2lkXFxzK21haW5cXHMqXFwoXFxzKlxcKVxccyovLnRlc3QoIHN0ciApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgV2ViR0xDb250ZXh0ID0gcmVxdWlyZSgnLi9XZWJHTENvbnRleHQnKSxcclxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9VdGlsJyksXHJcbiAgICAgICAgU3RhY2sgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrJyksXHJcbiAgICAgICAgX3N0YWNrID0ge30sXHJcbiAgICAgICAgX2JvdW5kVGV4dHVyZSA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgcHJvdmlkZWQgaW1hZ2UgZGltZW5zaW9ucyBhcmUgbm90IHBvd2VycyBvZiB0d28sIGl0IHdpbGwgcmVkcmF3XHJcbiAgICAgKiB0aGUgaW1hZ2UgdG8gdGhlIG5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSAtIFRoZSBpbWFnZSBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0hUTUxJbWFnZUVsZW1lbnR9IFRoZSBuZXcgaW1hZ2Ugb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBlbnN1cmVQb3dlck9mVHdvKCBpbWFnZSApIHtcclxuICAgICAgICBpZiAoICFVdGlsLmlzUG93ZXJPZlR3byggaW1hZ2Uud2lkdGggKSB8fFxyXG4gICAgICAgICAgICAhVXRpbC5pc1Bvd2VyT2ZUd28oIGltYWdlLmhlaWdodCApICkge1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJjYW52YXNcIiApO1xyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSBVdGlsLm5leHRIaWdoZXN0UG93ZXJPZlR3byggaW1hZ2Uud2lkdGggKTtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKCBpbWFnZS5oZWlnaHQgKTtcclxuICAgICAgICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgICAgICBpbWFnZSxcclxuICAgICAgICAgICAgICAgIDAsIDAsXHJcbiAgICAgICAgICAgICAgICBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgMCwgMCxcclxuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApO1xyXG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW1hZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgdG8gYSBsb2NhdGlvbiBhbmQgYWN0aXZhdGVzIHRoZSB0ZXh0dXJlIHVuaXRcclxuICAgICAqIHdoaWxlIGNhY2hpbmcgaXQgdG8gcHJldmVudCB1bm5lY2Vzc2FyeSByZWJpbmRzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlIC0gVGhlIFRleHR1cmUyRCBvYmplY3QgdG8gYmluZC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJpbmQoIHRleHR1cmUsIGxvY2F0aW9uICkge1xyXG4gICAgICAgIC8vIGlmIHRoaXMgYnVmZmVyIGlzIGFscmVhZHkgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZFRleHR1cmUgPT09IHRleHR1cmUgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGV4dHVyZS5nbDtcclxuICAgICAgICBsb2NhdGlvbiA9IGdsWyAnVEVYVFVSRScgKyBsb2NhdGlvbiBdIHx8IGdsLlRFWFRVUkUwO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoIGxvY2F0aW9uICk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUuaWQgKTtcclxuICAgICAgICBfYm91bmRUZXh0dXJlID0gdGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZHMgdGhlIHRleHR1cmUgb2JqZWN0LiBQcmV2ZW50cyB1bm5lY2Vzc2FyeSB1bmJpbmRpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmUgLSBUaGUgVGV4dHVyZTJEIG9iamVjdCB0byB1bmJpbmQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVuYmluZCggdGV4dHVyZSApIHtcclxuICAgICAgICAvLyBpZiBubyBidWZmZXIgaXMgYm91bmQsIGV4aXQgZWFybHlcclxuICAgICAgICBpZiAoIF9ib3VuZFRleHR1cmUgPT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGV4dHVyZS5nbDtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xyXG4gICAgICAgIF9ib3VuZFRleHR1cmUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgVGV4dHVyZTJEIG9iamVjdC5cclxuICAgICAqIEBjbGFzcyBUZXh0dXJlMkRcclxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIDJEIHRleHR1cmUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFRleHR1cmUyRCggc3BlYywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIC8vIGRlZmF1bHRcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIC8vIGNyZWF0ZSB0ZXh0dXJlIG9iamVjdFxyXG4gICAgICAgIHRoaXMuaWQgPSB0aGlzLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLndyYXAgPSBzcGVjLndyYXAgfHwgXCJSRVBFQVRcIjtcclxuICAgICAgICB0aGlzLmZpbHRlciA9IHNwZWMuZmlsdGVyIHx8IFwiTElORUFSXCI7XHJcbiAgICAgICAgdGhpcy5pbnZlcnRZID0gc3BlYy5pbnZlcnRZICE9PSB1bmRlZmluZWQgPyBzcGVjLmludmVydFkgOiB0cnVlO1xyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgdGV4dHVyZSBiYXNlZCBvbiBhcmd1bWVudHNcclxuICAgICAgICBpZiAoIHNwZWMuaW1hZ2UgKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSBleGlzdGluZyBJbWFnZSBvYmplY3RcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJEYXRhKCBzcGVjLmltYWdlICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHNwZWMudXJsICkge1xyXG4gICAgICAgICAgICAvLyByZXF1ZXN0IGltYWdlIHNvdXJjZSBmcm9tIHVybFxyXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmJ1ZmZlckRhdGEoIGltYWdlICk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnNldFBhcmFtZXRlcnMoIHRoYXQgKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCB0aGF0ICk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHNwZWMudXJsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICAgIGlmICggc3BlYy5mb3JtYXQgPT09IFwiREVQVEhfQ09NUE9ORU5UXCIgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkZXB0aCB0ZXh0dXJlXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVwdGhUZXh0dXJlRXh0ID0gV2ViR0xDb250ZXh0LmNoZWNrRXh0ZW5zaW9uKCBcIldFQkdMX2RlcHRoX3RleHR1cmVcIiApO1xyXG4gICAgICAgICAgICAgICAgaWYoICFkZXB0aFRleHR1cmVFeHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiQ2Fubm90IGNyZWF0ZSBUZXh0dXJlMkQgb2YgZm9ybWF0IFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJnbC5ERVBUSF9DT01QT05FTlQgYXMgV0VCR0xfZGVwdGhfdGV4dHVyZSBpcyBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidW5zdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyLCBjb21tYW5kIGlnbm9yZWRcIiApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFzcGVjLnR5cGUgfHxcclxuICAgICAgICAgICAgICAgICAgICBzcGVjLnR5cGUgPT09IFwiVU5TSUdORURfU0hPUlRcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWMudHlwZSA9PT0gXCJVTlNJR05FRF9JTlRcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIkRlcHRoIHRleHR1cmVzIGRvIG5vdCBzdXBwb3J0IHR5cGUnXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVjLnR5cGUgKyBcIicsIGRlZmF1bHRpbmcgdG8gJ1VOU0lHTkVEX1NIT1JUJy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gXCJVTlNJR05FRF9TSE9SVFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gb3RoZXJcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gc3BlYy5mb3JtYXQgfHwgXCJSR0JBXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgXCJVTlNJR05FRF9CWVRFXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbEZvcm1hdCA9IHRoaXMuZm9ybWF0OyAvLyB3ZWJnbCByZXF1aXJlcyBmb3JtYXQgPT09IGludGVybmFsRm9ybWF0XHJcbiAgICAgICAgICAgIHRoaXMubWlwTWFwID0gc3BlYy5taXBNYXAgIT09IHVuZGVmaW5lZCA/IHNwZWMubWlwTWFwIDogZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggc3BlYy5kYXRhIHx8IG51bGwsIHNwZWMud2lkdGgsIHNwZWMuaGVpZ2h0ICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1ldGVycyggdGhpcyApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oIGxvY2F0aW9uICkge1xyXG4gICAgICAgIF9zdGFja1sgbG9jYXRpb24gXSA9IF9zdGFja1sgbG9jYXRpb24gXSB8fCBuZXcgU3RhY2soKTtcclxuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0ucHVzaCggdGhpcyApO1xyXG4gICAgICAgIGJpbmQoIHRoaXMsIGxvY2F0aW9uICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIGJpbmRzIHRoZSB0ZXh0dXJlIGJlbmVhdGggaXQgb25cclxuICAgICAqIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgdGV4dHVyZSwgdW5iaW5kcyB0aGUgdW5pdC5cclxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlMkRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCBsb2NhdGlvbiApIHtcclxuICAgICAgICB2YXIgdG9wO1xyXG4gICAgICAgIGlmICggIV9zdGFja1sgbG9jYXRpb24gXSApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCBcIk5vIHRleHR1cmUgd2FzIGJvdW5kIHRvIHRleHR1cmUgdW5pdCAnXCIgKyBsb2NhdGlvbiArXHJcbiAgICAgICAgICAgICAgICBcIicuIENvbW1hbmQgaWdub3JlZC5cIiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0ucG9wKCk7XHJcbiAgICAgICAgdG9wID0gX3N0YWNrWyBsb2NhdGlvbiBdLnRvcCgpO1xyXG4gICAgICAgIGlmICggdG9wICkge1xyXG4gICAgICAgICAgICBiaW5kKCB0b3AsIGxvY2F0aW9uICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdW5iaW5kKCB0aGlzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1ZmZlciBkYXRhIGludG8gdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtJbWFnZURhdGF8QXJyYXlCdWZmZXJWaWV3fEhUTUxJbWFnZUVsZW1lbnR9IGRhdGEgLSBUaGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBkYXRhLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBUZXh0dXJlMkQucHJvdG90eXBlLmJ1ZmZlckRhdGEgPSBmdW5jdGlvbiggZGF0YSwgd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMucHVzaCgpO1xyXG4gICAgICAgIGlmICggZGF0YSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQgKSB7XHJcbiAgICAgICAgICAgIC8vIHNldCBkaW1lbnNpb25zIGJlZm9yZSByZXNpemluZ1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gZGF0YS53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcclxuICAgICAgICAgICAgZGF0YSA9IGVuc3VyZVBvd2VyT2ZUd28oIGRhdGEgKTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGRhdGE7XHJcbiAgICAgICAgICAgIC8vdGhpcy5maWx0ZXIgPSBcIkxJTkVBUlwiOyAvLyBtdXN0IGJlIGxpbmVhciBmb3IgbWlwbWFwcGluZ1xyXG4gICAgICAgICAgICB0aGlzLm1pcE1hcCA9IHRydWU7XHJcbiAgICAgICAgICAgIGdsLnBpeGVsU3RvcmVpKCBnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0aGlzLmludmVydFkgKTtcclxuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICAwLCAvLyBsZXZlbFxyXG4gICAgICAgICAgICAgICAgZ2wuUkdCQSxcclxuICAgICAgICAgICAgICAgIGdsLlJHQkEsXHJcbiAgICAgICAgICAgICAgICBnbC5VTlNJR05FRF9CWVRFLFxyXG4gICAgICAgICAgICAgICAgZGF0YSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCB0aGlzLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCB0aGlzLmhlaWdodDtcclxuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICAwLCAvLyBsZXZlbFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuaW50ZXJuYWxGb3JtYXQgXSxcclxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIDAsIC8vIGJvcmRlciwgbXVzdCBiZSAwXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5mb3JtYXQgXSxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLnR5cGUgXSxcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRoaXMubWlwTWFwICkge1xyXG4gICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcCggZ2wuVEVYVFVSRV8yRCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzLlxyXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmUyRFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIC0gVGhlIHBhcmFtZXRlcnMgYnkgbmFtZS5cclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiAgICAgd3JhcCB8IHdyYXAucyB8IHdyYXAudCAtIFRoZSB3cmFwcGluZyB0eXBlLlxyXG4gICAgICogICAgIGZpbHRlciB8IGZpbHRlci5taW4gfCBmaWx0ZXIubWFnIC0gVGhlIGZpbHRlciB0eXBlLlxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5zZXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24oIHBhcmFtZXRlcnMgKSB7XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnB1c2goKTtcclxuICAgICAgICBpZiAoIHBhcmFtZXRlcnMud3JhcCApIHtcclxuICAgICAgICAgICAgLy8gc2V0IHdyYXAgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICB0aGlzLndyYXAgPSBwYXJhbWV0ZXJzLndyYXA7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9XUkFQX1MsXHJcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy53cmFwLnMgfHwgdGhpcy53cmFwIF0gKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcclxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX1dSQVBfVCxcclxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLndyYXAudCB8fCB0aGlzLndyYXAgXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHBhcmFtZXRlcnMuZmlsdGVyICkge1xyXG4gICAgICAgICAgICAvLyBzZXQgZmlsdGVyIHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXIgPSBwYXJhbWV0ZXJzLmZpbHRlcjtcclxuICAgICAgICAgICAgdmFyIG1pbkZpbHRlciA9IHRoaXMuZmlsdGVyLm1pbiB8fCB0aGlzLmZpbHRlcjtcclxuICAgICAgICAgICAgaWYgKCB0aGlzLm1pcE1hcCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGFwcGVuZCBtaW4gbXBhIHN1ZmZpeCB0byBtaW4gZmlsdGVyXHJcbiAgICAgICAgICAgICAgICBtaW5GaWx0ZXIgKz0gXCJfTUlQTUFQX0xJTkVBUlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLFxyXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMuZmlsdGVyLm1hZyB8fCB0aGlzLmZpbHRlciBdICk7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXHJcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLFxyXG4gICAgICAgICAgICAgICAgZ2xbIG1pbkZpbHRlcl0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNpemUgdGhlIHRleHR1cmUuXHJcbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZTJEXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIG5ldyB3aWR0aCBvZiB0aGUgdGV4dHVyZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgbmV3IGhlaWdodCBvZiB0aGUgdGV4dHVyZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgVGV4dHVyZTJELnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICBpZiAoIHRoaXMuaW1hZ2UgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiQ2Fubm90IHJlc2l6ZSBpbWFnZSBiYXNlZCBUZXh0dXJlMkRcIiApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIXdpZHRoIHx8ICFoZWlnaHQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiggXCJXaWR0aCBvciBoZWlnaHQgYXJndW1lbnRzIG1pc3NpbmcsIGNvbW1hbmQgaWdub3JlZC5cIiApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnVmZmVyRGF0YSggdGhpcy5kYXRhLCB3aWR0aCwgaGVpZ2h0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTJEO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKSxcbiAgICAgICAgU3RhY2sgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrJyksXG4gICAgICAgIEZBQ0VTID0gW1xuICAgICAgICAgICAgJy14JywgJyt4JyxcbiAgICAgICAgICAgICcteScsICcreScsXG4gICAgICAgICAgICAnLXonLCAnK3onXG4gICAgICAgIF0sXG4gICAgICAgIEZBQ0VfVEFSR0VUUyA9IHtcbiAgICAgICAgICAgICcreic6IFwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9aXCIsXG4gICAgICAgICAgICAnLXonOiBcIlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWlwiLFxuICAgICAgICAgICAgJyt4JzogXCJURVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1hcIixcbiAgICAgICAgICAgICcteCc6IFwiVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9YXCIsXG4gICAgICAgICAgICAnK3knOiBcIlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWVwiLFxuICAgICAgICAgICAgJy15JzogXCJURVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1lcIlxuICAgICAgICB9LFxuICAgICAgICBfc3RhY2sgPSB7fSxcbiAgICAgICAgX2JvdW5kVGV4dHVyZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcHJvdmlkZWQgaW1hZ2UgZGltZW5zaW9ucyBhcmUgbm90IHBvd2VycyBvZiB0d28sIGl0IHdpbGwgcmVkcmF3XG4gICAgICogdGhlIGltYWdlIHRvIHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgdHdvLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSAtIFRoZSBpbWFnZSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7SFRNTEltYWdlRWxlbWVudH0gVGhlIG5ldyBpbWFnZSBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW5zdXJlUG93ZXJPZlR3byggaW1hZ2UgKSB7XG4gICAgICAgIGlmICggIVV0aWwuaXNQb3dlck9mVHdvKCBpbWFnZS53aWR0aCApIHx8XG4gICAgICAgICAgICAhVXRpbC5pc1Bvd2VyT2ZUd28oIGltYWdlLmhlaWdodCApICkge1xuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiY2FudmFzXCIgKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKCBpbWFnZS53aWR0aCApO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IFV0aWwubmV4dEhpZ2hlc3RQb3dlck9mVHdvKCBpbWFnZS5oZWlnaHQgKTtcbiAgICAgICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgICAgICAwLCAwLFxuICAgICAgICAgICAgICAgIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgMCwgMCxcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcbiAgICAgICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGltYWdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCB0byBhIGxvY2F0aW9uIGFuZCBhY3RpdmF0ZXMgdGhlIHRleHR1cmUgdW5pdFxuICAgICAqIHdoaWxlIGNhY2hpbmcgaXQgdG8gcHJldmVudCB1bm5lY2Vzc2FyeSByZWJpbmRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gdGV4dHVyZSAtIFRoZSBUZXh0dXJlQ3ViZU1hcCBvYmplY3QgdG8gYmluZC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jYXRpb24gLSBUaGUgdGV4dHVyZSB1bml0IGxvY2F0aW9uIGluZGV4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJpbmQoIHRleHR1cmUsIGxvY2F0aW9uICkge1xuICAgICAgICAvLyBpZiB0aGlzIGJ1ZmZlciBpcyBhbHJlYWR5IGJvdW5kLCBleGl0IGVhcmx5XG4gICAgICAgIGlmICggX2JvdW5kVGV4dHVyZSA9PT0gdGV4dHVyZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2wgPSB0ZXh0dXJlLmdsO1xuICAgICAgICBsb2NhdGlvbiA9IGdsWyAnVEVYVFVSRScgKyBsb2NhdGlvbiBdIHx8IGdsLlRFWFRVUkUwO1xuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKCBsb2NhdGlvbiApO1xuICAgICAgICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGV4dHVyZS5pZCApO1xuICAgICAgICBfYm91bmRUZXh0dXJlID0gdGV4dHVyZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdC4gUHJldmVudHMgdW5uZWNlc3NhcnkgdW5iaW5kaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0dXJlQ3ViZU1hcH0gdGV4dHVyZSAtIFRoZSBUZXh0dXJlQ3ViZU1hcCBvYmplY3QgdG8gdW5iaW5kLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuYmluZCggdGV4dHVyZSApIHtcbiAgICAgICAgLy8gaWYgbm8gYnVmZmVyIGlzIGJvdW5kLCBleGl0IGVhcmx5XG4gICAgICAgIGlmICggX2JvdW5kVGV4dHVyZSA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2wgPSB0ZXh0dXJlLmdsO1xuICAgICAgICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCApO1xuICAgICAgICBfYm91bmRUZXh0dXJlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhbmQgYnVmZmVyIGEgZ2l2ZW4gY3ViZSBtYXAgZmFjZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dHVyZUN1YmVNYXB9IGN1YmVNYXAgLSBUaGUgY3ViZSBtYXAgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIGxvYWQgdGhlIGltYWdlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmYWNlIC0gVGhlIGZhY2UgaWRlbnRpZmljYXRpb24gc3RyaW5nLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgcmVzdWx0aW5nIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRBbmRCdWZmZXJJbWFnZSggY3ViZU1hcCwgdXJsLCBmYWNlICkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGRvbmUgKSB7XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGJ1ZmZlciBmYWNlIHRleHR1cmVcbiAgICAgICAgICAgICAgICBjdWJlTWFwLmJ1ZmZlckZhY2VEYXRhKCBmYWNlLCBpbWFnZSApO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVzIGEgVGV4dHVyZUN1YmVNYXAgb2JqZWN0LlxuICAgICAqIEBjbGFzcyBUZXh0dXJlQ3ViZU1hcFxuICAgICAqIEBjbGFzc2Rlc2MgQSB0ZXh0dXJlIGNsYXNzIHRvIHJlcHJlc2VudCBhIGN1YmUgbWFwIHRleHR1cmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gVGV4dHVyZUN1YmVNYXAoIHNwZWMsIGNhbGxiYWNrICkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBmYWNlLFxuICAgICAgICAgICAgam9icztcbiAgICAgICAgLy8gc3RvcmUgZ2wgY29udGV4dFxuICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xuICAgICAgICB0aGlzLmlkID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgIHRoaXMud3JhcCA9IHNwZWMud3JhcCB8fCBcIkNMQU1QX1RPX0VER0VcIjtcbiAgICAgICAgdGhpcy5maWx0ZXIgPSBzcGVjLmZpbHRlciB8fCBcIkxJTkVBUlwiO1xuICAgICAgICB0aGlzLmludmVydFkgPSBzcGVjLmludmVydFkgIT09IHVuZGVmaW5lZCA/IHNwZWMuaW52ZXJ0WSA6IGZhbHNlO1xuICAgICAgICAvLyBjcmVhdGUgY3ViZSBtYXAgYmFzZWQgb24gaW5wdXRcbiAgICAgICAgaWYgKCBzcGVjLmltYWdlcyApIHtcbiAgICAgICAgICAgIC8vIG11bHRpcGxlIEltYWdlIG9iamVjdHNcbiAgICAgICAgICAgIGZvciAoIGZhY2UgaW4gc3BlYy5pbWFnZXMgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzcGVjLmltYWdlcy5oYXNPd25Qcm9wZXJ0eSggZmFjZSApICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBidWZmZXIgZmFjZSB0ZXh0dXJlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRmFjZURhdGEoIGZhY2UsIHNwZWMuaW1hZ2VzWyBmYWNlIF0gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldFBhcmFtZXRlcnMoIHRoaXMgKTtcbiAgICAgICAgfSBlbHNlIGlmICggc3BlYy51cmxzICkge1xuICAgICAgICAgICAgLy8gbXVsdGlwbGUgdXJsc1xuICAgICAgICAgICAgam9icyA9IHt9O1xuICAgICAgICAgICAgZm9yICggZmFjZSBpbiBzcGVjLnVybHMgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzcGVjLnVybHMuaGFzT3duUHJvcGVydHkoIGZhY2UgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGpvYiB0byBtYXBcbiAgICAgICAgICAgICAgICAgICAgam9ic1sgZmFjZSBdID0gbG9hZEFuZEJ1ZmZlckltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWMudXJsc1sgZmFjZSBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFjZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0UGFyYW1ldGVycyggdGhhdCApO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCB0aGF0ICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVtcHR5IGN1YmUgbWFwXG4gICAgICAgICAgICB0aGlzLmZvcm1hdCA9IHNwZWMuZm9ybWF0IHx8IFwiUkdCQVwiO1xuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbEZvcm1hdCA9IHRoaXMuZm9ybWF0OyAvLyB3ZWJnbCByZXF1aXJlcyBmb3JtYXQgPT09IGludGVybmFsRm9ybWF0XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGUgfHwgXCJVTlNJR05FRF9CWVRFXCI7XG4gICAgICAgICAgICB0aGlzLm1pcE1hcCA9IHNwZWMubWlwTWFwICE9PSB1bmRlZmluZWQgPyBzcGVjLm1pcE1hcCA6IGZhbHNlO1xuICAgICAgICAgICAgRkFDRVMuZm9yRWFjaCggZnVuY3Rpb24oIGZhY2UgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSAoIHNwZWMuZGF0YSA/IHNwZWMuZGF0YVtmYWNlXSA6IHNwZWMuZGF0YSApIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgdGhhdC5idWZmZXJGYWNlRGF0YSggZmFjZSwgZGF0YSwgc3BlYy53aWR0aCwgc3BlYy5oZWlnaHQgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zZXRQYXJhbWV0ZXJzKCB0aGlzICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgdGV4dHVyZSBvYmplY3QgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIHN0YWNrLlxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlQ3ViZU1hcFxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY2F0aW9uIC0gVGhlIHRleHR1cmUgdW5pdCBsb2NhdGlvbiBpbmRleC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgIFRleHR1cmVDdWJlTWFwLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oIGxvY2F0aW9uICkge1xuICAgICAgICBfc3RhY2tbIGxvY2F0aW9uIF0gPSBfc3RhY2tbIGxvY2F0aW9uIF0gfHwgbmV3IFN0YWNrKCk7XG4gICAgICAgIF9zdGFja1sgbG9jYXRpb24gXS5wdXNoKCB0aGlzICk7XG4gICAgICAgIGJpbmQoIHRoaXMsIGxvY2F0aW9uICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVbmJpbmRzIHRoZSB0ZXh0dXJlIG9iamVjdCBhbmQgYmluZHMgdGhlIHRleHR1cmUgYmVuZWF0aCBpdCBvblxuICAgICAqIHRoaXMgc3RhY2suIElmIHRoZXJlIGlzIG5vIHVuZGVybHlpbmcgdGV4dHVyZSwgdW5iaW5kcyB0aGUgdW5pdC5cbiAgICAgKiBAbWVtYmVyb2YgVGV4dHVyZUN1YmVNYXBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2NhdGlvbiAtIFRoZSB0ZXh0dXJlIHVuaXQgbG9jYXRpb24gaW5kZXguXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7VGV4dHVyZUN1YmVNYXB9IFRoZSB0ZXh0dXJlIG9iamVjdCwgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgICBUZXh0dXJlQ3ViZU1hcC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oIGxvY2F0aW9uICkge1xuICAgICAgICB2YXIgdG9wO1xuICAgICAgICBpZiAoICFfc3RhY2tbIGxvY2F0aW9uIF0gKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIHRleHR1cmUgd2FzIGJvdW5kIHRvIHRleHR1cmUgdW5pdCAnXCIgKyBsb2NhdGlvbiArXG4gICAgICAgICAgICAgICAgXCInLiBDb21tYW5kIGlnbm9yZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIF9zdGFja1sgbG9jYXRpb24gXS5wb3AoKTtcbiAgICAgICAgdG9wID0gX3N0YWNrWyBsb2NhdGlvbiBdLnRvcCgpO1xuICAgICAgICBpZiAoIHRvcCApIHtcbiAgICAgICAgICAgIGJpbmQoIHRvcCwgbG9jYXRpb24gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuYmluZCggdGhpcyApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBCdWZmZXIgZGF0YSBpbnRvIHRoZSByZXNwZWN0aXZlIGN1YmUgbWFwIGZhY2UuXG4gICAgICogQG1lbWJlcm9mIFRleHR1cmVDdWJlTWFwXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmFjZSAtIFRoZSBmYWNlIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge0ltYWdlRGF0YXxBcnJheUJ1ZmZlclZpZXd8SFRNTEltYWdlRWxlbWVudH0gZGF0YSAtIFRoZSBkYXRhLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgZGF0YS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgZGF0YS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtUZXh0dXJlQ3ViZU1hcH0gVGhlIHRleHR1cmUgb2JqZWN0LCBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgVGV4dHVyZUN1YmVNYXAucHJvdG90eXBlLmJ1ZmZlckZhY2VEYXRhID0gZnVuY3Rpb24oIGZhY2UsIGRhdGEsIHdpZHRoLCBoZWlnaHQgKSB7XG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wsXG4gICAgICAgICAgICBmYWNlVGFyZ2V0ID0gZ2xbIEZBQ0VfVEFSR0VUU1sgZmFjZSBdIF07XG4gICAgICAgIGlmICggIWZhY2VUYXJnZXQgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgZmFjZSBlbnVtZXJhdGlvbiAnXCIrIGZhY2UgK1wiJyBwcm92aWRlZCwgXCIgK1xuICAgICAgICAgICAgICAgIFwiaWdub3JpbmcgY29tbWFuZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYnVmZmVyIGZhY2UgdGV4dHVyZVxuICAgICAgICB0aGlzLnB1c2goKTtcbiAgICAgICAgaWYgKCBkYXRhIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCApIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzID0gdGhpcy5pbWFnZXMgfHwge307XG4gICAgICAgICAgICB0aGlzLmltYWdlc1sgZmFjZSBdID0gZW5zdXJlUG93ZXJPZlR3byggZGF0YSApO1xuICAgICAgICAgICAgdGhpcy5maWx0ZXIgPSBcIkxJTkVBUlwiOyAvLyBtdXN0IGJlIGxpbmVhciBmb3IgbWlwbWFwcGluZ1xuICAgICAgICAgICAgdGhpcy5taXBNYXAgPSB0cnVlO1xuICAgICAgICAgICAgZ2wucGl4ZWxTdG9yZWkoIGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRoaXMuaW52ZXJ0WSApO1xuICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChcbiAgICAgICAgICAgICAgICBmYWNlVGFyZ2V0LFxuICAgICAgICAgICAgICAgIDAsIC8vIGxldmVsXG4gICAgICAgICAgICAgICAgZ2wuUkdCQSxcbiAgICAgICAgICAgICAgICBnbC5SR0JBLFxuICAgICAgICAgICAgICAgIGdsLlVOU0lHTkVEX0JZVEUsXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbIGZhY2UgXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9O1xuICAgICAgICAgICAgdGhpcy5kYXRhWyBmYWNlIF0gPSBkYXRhO1xuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IHRoaXMud2lkdGg7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoXG4gICAgICAgICAgICAgICAgZmFjZVRhcmdldCxcbiAgICAgICAgICAgICAgICAwLCAvLyBsZXZlbFxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmludGVybmFsRm9ybWF0IF0sXG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICAwLCAvLyBib3JkZXIsIG11c3QgYmUgMFxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLmZvcm1hdCBdLFxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLnR5cGUgXSxcbiAgICAgICAgICAgICAgICBkYXRhICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25seSBnZW5lcmF0ZSBtaXBtYXBzIGlmIGFsbCBmYWNlcyBhcmUgYnVmZmVyZWRcbiAgICAgICAgdGhpcy5idWZmZXJlZEZhY2VzID0gdGhpcy5idWZmZXJlZEZhY2VzIHx8IHt9O1xuICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXNbIGZhY2UgXSA9IHRydWU7XG4gICAgICAgIC8vIG9uY2UgYWxsIGZhY2VzIGFyZSBidWZmZXJlZFxuICAgICAgICBpZiAoIHRoaXMubWlwTWFwICYmXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXNbJy14J10gJiYgdGhpcy5idWZmZXJlZEZhY2VzWycreCddICYmXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXNbJy15J10gJiYgdGhpcy5idWZmZXJlZEZhY2VzWycreSddICYmXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcmVkRmFjZXNbJy16J10gJiYgdGhpcy5idWZmZXJlZEZhY2VzWycreiddICkge1xuICAgICAgICAgICAgLy8gZ2VuZXJhdGUgbWlwbWFwcyBvbmNlIGFsbCBmYWNlcyBhcmUgYnVmZmVyZWRcbiAgICAgICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKCBnbC5URVhUVVJFX0NVQkVfTUFQICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3AoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdGV4dHVyZSBwYXJhbWV0ZXJzLlxuICAgICAqIEBtZW1iZXJvZiBUZXh0dXJlQ3ViZU1hcFxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgLSBUaGUgcGFyYW1ldGVycyBieSBuYW1lLlxuICAgICAqIDxwcmU+XG4gICAgICogICAgIHdyYXAgfCB3cmFwLnMgfCB3cmFwLnQgLSBUaGUgd3JhcHBpbmcgdHlwZS5cbiAgICAgKiAgICAgZmlsdGVyIHwgZmlsdGVyLm1pbiB8IGZpbHRlci5tYWcgLSBUaGUgZmlsdGVyIHR5cGUuXG4gICAgICogPC9wcmU+XG4gICAgICogQHJldHVybnMge1RleHR1cmVDdWJlTWFwfSBUaGUgdGV4dHVyZSBvYmplY3QsIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBUZXh0dXJlQ3ViZU1hcC5wcm90b3R5cGUuc2V0UGFyYW1ldGVycyA9IGZ1bmN0aW9uKCBwYXJhbWV0ZXJzICkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICB0aGlzLnB1c2goKTtcbiAgICAgICAgaWYgKCBwYXJhbWV0ZXJzLndyYXAgKSB7XG4gICAgICAgICAgICAvLyBzZXQgd3JhcCBwYXJhbWV0ZXJzXG4gICAgICAgICAgICB0aGlzLndyYXAgPSBwYXJhbWV0ZXJzLndyYXA7XG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfQ1VCRV9NQVAsXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9XUkFQX1MsXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMud3JhcC5zIHx8IHRoaXMud3JhcCBdICk7XG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfQ1VCRV9NQVAsXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9XUkFQX1QsXG4gICAgICAgICAgICAgICAgZ2xbIHRoaXMud3JhcC50IHx8IHRoaXMud3JhcCBdICk7XG4gICAgICAgICAgICAvKiBub3Qgc3VwcG9ydGVkIGluIHdlYmdsIDEuMFxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX0NVQkVfTUFQLFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfV1JBUF9SLFxuICAgICAgICAgICAgICAgIGdsWyB0aGlzLndyYXAuciB8fCB0aGlzLndyYXAgXSApO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICBpZiAoIHBhcmFtZXRlcnMuZmlsdGVyICkge1xuICAgICAgICAgICAgLy8gc2V0IGZpbHRlciBwYXJhbWV0ZXJzXG4gICAgICAgICAgICB0aGlzLmZpbHRlciA9IHBhcmFtZXRlcnMuZmlsdGVyO1xuICAgICAgICAgICAgdmFyIG1pbkZpbHRlciA9IHRoaXMuZmlsdGVyLm1pbiB8fCB0aGlzLmZpbHRlcjtcbiAgICAgICAgICAgIGlmICggdGhpcy5taW5NYXAgKSB7XG4gICAgICAgICAgICAgICAgLy8gYXBwZW5kIG1pbiBtcGEgc3VmZml4IHRvIG1pbiBmaWx0ZXJcbiAgICAgICAgICAgICAgICBtaW5GaWx0ZXIgKz0gXCJfTUlQTUFQX0xJTkVBUlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX0NVQkVfTUFQLFxuICAgICAgICAgICAgICAgIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUixcbiAgICAgICAgICAgICAgICBnbFsgdGhpcy5maWx0ZXIubWFnIHx8IHRoaXMuZmlsdGVyIF0gKTtcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoXG4gICAgICAgICAgICAgICAgZ2wuVEVYVFVSRV9DVUJFX01BUCxcbiAgICAgICAgICAgICAgICBnbC5URVhUVVJFX01JTl9GSUxURVIsXG4gICAgICAgICAgICAgICAgZ2xbIG1pbkZpbHRlcl0gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlQ3ViZU1hcDtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgVmVydGV4UGFja2FnZSA9IHJlcXVpcmUoJy4vVmVydGV4UGFja2FnZScpLFxyXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL1V0aWwnKSxcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSBudWxsLFxyXG4gICAgICAgIF9lbmFibGVkQXR0cmlidXRlcyA9IG51bGw7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0QXR0cmlidXRlUG9pbnRlcnMoIHZlcnRleEJ1ZmZlciwgYXR0cmlidXRlUG9pbnRlcnMgKSB7XHJcbiAgICAgICAgaWYgKCAhYXR0cmlidXRlUG9pbnRlcnMgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiVmVydGV4QnVmZmVyIHJlcXVpcmVzIGF0dHJpYnV0ZSBwb2ludGVycyB0byBiZSBcIiArXHJcbiAgICAgICAgICAgICAgICBcInNwZWNpZmllZCwgY29tbWFuZCBpZ25vcmVkXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2ZXJ0ZXhCdWZmZXIucG9pbnRlcnMgPSBhdHRyaWJ1dGVQb2ludGVycztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBWZXJ0ZXhCdWZmZXIoIGFycmF5LCBhdHRyaWJ1dGVQb2ludGVycyApIHtcclxuICAgICAgICB0aGlzLmlkID0gMDtcclxuICAgICAgICB0aGlzLnBvaW50ZXJzID0ge307XHJcbiAgICAgICAgdGhpcy5nbCA9IFdlYkdMQ29udGV4dC5nZXQoKTtcclxuICAgICAgICBpZiAoIGFycmF5ICkge1xyXG4gICAgICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgVmVydGV4UGFja2FnZSApIHtcclxuICAgICAgICAgICAgICAgIC8vIFZlcnRleFBhY2thZ2UgYXJndW1lbnRcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyRGF0YSggYXJyYXkuYnVmZmVyKCkgKTtcclxuICAgICAgICAgICAgICAgIHNldEF0dHJpYnV0ZVBvaW50ZXJzKCB0aGlzLCBhcnJheS5hdHRyaWJ1dGVQb2ludGVycygpICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGFycmF5IGluc3RhbmNlb2YgV2ViR0xCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZWJHTEJ1ZmZlciBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pZCA9IGFycmF5O1xyXG4gICAgICAgICAgICAgICAgc2V0QXR0cmlidXRlUG9pbnRlcnMoIHRoaXMsIGF0dHJpYnV0ZVBvaW50ZXJzICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBcnJheSBvciBBcnJheUJ1ZmZlciBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckRhdGEoIGFycmF5ICk7XHJcbiAgICAgICAgICAgICAgIHNldEF0dHJpYnV0ZVBvaW50ZXJzKCB0aGlzLCBhdHRyaWJ1dGVQb2ludGVycyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFZlcnRleEJ1ZmZlci5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKCBhcnJheSApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGlmICggYXJyYXkgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgLy8gY2FzdCBhcnJheXMgaW50byBidWZmZXJ2aWV3XHJcbiAgICAgICAgICAgIGFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSggYXJyYXkgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCAhVXRpbC5pc1R5cGVkQXJyYXkoIGFycmF5ICkgJiYgdHlwZW9mIGFycmF5ICE9PSBcIm51bWJlclwiICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIlZlcnRleEJ1ZmZlciByZXF1aXJlcyBhbiBBcnJheSBvciBBcnJheUJ1ZmZlciwgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJvciBhIHNpemUgYXJndW1lbnQsIGNvbW1hbmQgaWdub3JlZFwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAhdGhpcy5pZCApIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaWQgKTtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKCBnbC5BUlJBWV9CVUZGRVIsIGFycmF5LCBnbC5TVEFUSUNfRFJBVyApO1xyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhCdWZmZXIucHJvdG90eXBlLmJ1ZmZlclN1YkRhdGEgPSBmdW5jdGlvbiggYXJyYXksIG9mZnNldCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGlmICggIXRoaXMuaWQgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiVmVydGV4QnVmZmVyIGhhcyBub3QgYmVlbiBpbml0aWFsbHkgYnVmZmVyZWQsIFwiICtcclxuICAgICAgICAgICAgICAgIFwiY29tbWFuZCBpZ25vcmVkXCIgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIGFycmF5IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIGFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSggYXJyYXkgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCAhVXRpbC5pc1R5cGVkQXJyYXkoIGFycmF5ICkgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiVmVydGV4QnVmZmVyIHJlcXVpcmVzIGFuIEFycmF5IG9yIEFycmF5QnVmZmVyIFwiICtcclxuICAgICAgICAgICAgICAgIFwiYXJndW1lbnQsIGNvbW1hbmQgaWdub3JlZFwiICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2Zmc2V0ID0gKCBvZmZzZXQgIT09IHVuZGVmaW5lZCApID8gb2Zmc2V0IDogMDtcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKCBnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaWQgKTtcclxuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKCBnbC5BUlJBWV9CVUZGRVIsIG9mZnNldCwgYXJyYXkgKTtcclxuICAgIH07XHJcblxyXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaWYgdGhpcyBidWZmZXIgaXMgYWxyZWFkeSBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSB0aGlzICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wsXHJcbiAgICAgICAgICAgIHBvaW50ZXJzID0gdGhpcy5wb2ludGVycyxcclxuICAgICAgICAgICAgcHJldmlvdXNseUVuYWJsZWRBdHRyaWJ1dGVzID0gX2VuYWJsZWRBdHRyaWJ1dGVzIHx8IHt9LFxyXG4gICAgICAgICAgICBwb2ludGVyLFxyXG4gICAgICAgICAgICBpbmRleDtcclxuICAgICAgICAvLyBjYWNoZSB0aGlzIHZlcnRleCBidWZmZXJcclxuICAgICAgICBfYm91bmRCdWZmZXIgPSB0aGlzO1xyXG4gICAgICAgIF9lbmFibGVkQXR0cmlidXRlcyA9IHt9O1xyXG4gICAgICAgIC8vIGJpbmQgYnVmZmVyXHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmlkICk7XHJcbiAgICAgICAgZm9yICggaW5kZXggaW4gcG9pbnRlcnMgKSB7XHJcbiAgICAgICAgICAgIGlmICggcG9pbnRlcnMuaGFzT3duUHJvcGVydHkoIGluZGV4ICkgKSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludGVyID0gdGhpcy5wb2ludGVyc1sgaW5kZXggXTtcclxuICAgICAgICAgICAgICAgIC8vIHNldCBhdHRyaWJ1dGUgcG9pbnRlclxyXG4gICAgICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlciggaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRlci5zaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGdsWyBwb2ludGVyLnR5cGUgXSxcclxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVyLnN0cmlkZSxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludGVyLm9mZnNldCApO1xyXG4gICAgICAgICAgICAgICAgLy8gZW5hYmxlZCBhdHRyaWJ1dGUgYXJyYXlcclxuICAgICAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KCBpbmRleCApO1xyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICBfZW5hYmxlZEF0dHJpYnV0ZXNbIGluZGV4IF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGZyb20gcHJldmlvdXMgbGlzdFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHByZXZpb3VzbHlFbmFibGVkQXR0cmlidXRlc1sgaW5kZXggXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbnN1cmUgbGVha2VkIGF0dHJpYnV0ZSBhcnJheXMgYXJlIGRpc2FibGVkXHJcbiAgICAgICAgZm9yICggaW5kZXggaW4gcHJldmlvdXNseUVuYWJsZWRBdHRyaWJ1dGVzICkge1xyXG4gICAgICAgICAgICBpZiAoIHByZXZpb3VzbHlFbmFibGVkQXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggaW5kZXggKSApIHtcclxuICAgICAgICAgICAgICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSggaW5kZXggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgVmVydGV4QnVmZmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgaWYgKCAhb3B0aW9ucy5jb3VudCApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb3VudCBtdXN0IGJlIGRlZmluZWQsIGlnbm9yaW5nIGNvbW1hbmQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcclxuICAgICAgICB2YXIgbW9kZSA9IGdsWyBvcHRpb25zLm1vZGUudG9VcHBlckNhc2UoKSBdIHx8IGdsLlBPSU5UUztcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMub2Zmc2V0IDogMDsgICAgXHJcbiAgICAgICAgdmFyIGNvdW50ID0gb3B0aW9ucy5jb3VudDtcclxuICAgICAgICBnbC5kcmF3QXJyYXlzKFxyXG4gICAgICAgICAgICBtb2RlLCAvLyBwcmltaXRpdmUgdHlwZVxyXG4gICAgICAgICAgICBvZmZzZXQsIC8vIG9mZnNldFxyXG4gICAgICAgICAgICBjb3VudCApOyAvLyBjb3VudFxyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhCdWZmZXIucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGlmIG5vIGJ1ZmZlciBpcyBib3VuZCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggX2JvdW5kQnVmZmVyID09PSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBnbCA9IHRoaXMuZ2wsXHJcbiAgICAgICAgICAgIHBvaW50ZXJzID0gdGhpcy5wb2ludGVycyxcclxuICAgICAgICAgICAgaW5kZXg7XHJcbiAgICAgICAgZm9yICggaW5kZXggaW4gcG9pbnRlcnMgKSB7XHJcbiAgICAgICAgICAgIGlmICggcG9pbnRlcnMuaGFzT3duUHJvcGVydHkoIGluZGV4ICkgKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoIGluZGV4ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCBudWxsICk7XHJcbiAgICAgICAgX2JvdW5kQnVmZmVyID0gbnVsbDtcclxuICAgICAgICBfZW5hYmxlZEF0dHJpYnV0ZXMgPSB7fTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhCdWZmZXI7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBpbnZhbGlkIGF0dHJpYnV0ZSBhcmd1bWVudHMuIEEgdmFsaWQgYXJndW1lbnRcclxuICAgICAqIG11c3QgYmUgYW4gQXJyYXkgb2YgbGVuZ3RoID4gMC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIC0gVGhlIGFycmF5IG9mIHZlcnRleCBhdHRyaWJ1dGVzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHZhbGlkIGFycmF5IG9mIGFyZ3VtZW50cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVtb3ZlQmFkQXJndW1lbnRzKCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIHZhciBnb29kQXR0cmlidXRlcyA9IFtdLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGUsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPGF0dHJpYnV0ZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaV07XHJcbiAgICAgICAgICAgIGlmICggYXR0cmlidXRlICYmXHJcbiAgICAgICAgICAgICAgICAgYXR0cmlidXRlIGluc3RhbmNlb2YgQXJyYXkgJiZcclxuICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIGdvb2RBdHRyaWJ1dGVzLnB1c2goIGF0dHJpYnV0ZSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJFcnJvciBwYXJzaW5nIGF0dHJpYnV0ZSBvZiBpbmRleCBcIiArIGkgK1xyXG4gICAgICAgICAgICAgICAgICAgIFwiLCBhdHRyaWJ1dGUgZGlzY2FyZGVkXCIgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ29vZEF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgY29tcG9uZW50J3MgYnl0ZSBzaXplLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb21wb25lbnQgLSBUaGUgY29tcG9uZW50IHRvIG1lYXN1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2ludGVnZXJ9IFRoZSBieXRlIHNpemUgb2YgdGhlIGNvbXBvbmVudC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50U2l6ZSggY29tcG9uZW50ICkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIHZlY3RvclxyXG4gICAgICAgIGlmICggY29tcG9uZW50LnggIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgLy8gMSBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgIGlmICggY29tcG9uZW50LnkgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIC8vIDIgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgaWYgKCBjb21wb25lbnQueiAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIDMgY29tcG9uZW50IHZlY3RvclxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggY29tcG9uZW50LncgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNCBjb21wb25lbnQgdmVjdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjaGVjayBpZiBhcnJheVxyXG4gICAgICAgIGlmICggY29tcG9uZW50IGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIHR5cGUsIHNpemUsIGFuZCBvZmZzZXQgZm9yIGVhY2ggYXR0cmlidXRlIGluIHRoZVxyXG4gICAgICogYXR0cmlidXRlIGFycmF5IGFsb25nIHdpdGggdGhlIGxlbmd0aCBhbmQgc3RyaWRlIG9mIHRoZSBwYWNrYWdlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VmVydGV4UGFja2FnZX0gdmVydGV4UGFja2FnZSAtIFRoZSBWZXJ0ZXhQYWNrYWdlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGF0dHJpYnV0ZXMgLSBUaGUgYXJyYXkgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldFBvaW50ZXJzQW5kU3RyaWRlKCB2ZXJ0ZXhQYWNrYWdlLCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIHZhciBzaG9ydGVzdEFycmF5ID0gTnVtYmVyLk1BWF9WQUxVRSxcclxuICAgICAgICAgICAgb2Zmc2V0ID0gMCxcclxuICAgICAgICAgICAgYXR0cmlidXRlLFxyXG4gICAgICAgICAgICBzaXplLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIHZlcnRleFBhY2thZ2UucG9pbnRlcnMgPSB7fTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8YXR0cmlidXRlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcclxuICAgICAgICAgICAgLy8gc2V0IHNpemUgdG8gbnVtYmVyIG9mIGNvbXBvbmVudHMgaW4gdGhlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICBzaXplID0gZ2V0Q29tcG9uZW50U2l6ZSggYXR0cmlidXRlWzBdICk7XHJcbiAgICAgICAgICAgIC8vIGxlbmd0aCBvZiB0aGUgcGFja2FnZSB3aWxsIGJlIHRoZSBzaG9ydGVzdCBhdHRyaWJ1dGUgYXJyYXkgbGVuZ3RoXHJcbiAgICAgICAgICAgIHNob3J0ZXN0QXJyYXkgPSBNYXRoLm1pbiggc2hvcnRlc3RBcnJheSwgYXR0cmlidXRlLmxlbmd0aCApO1xyXG4gICAgICAgICAgICAvLyBzdG9yZSBwb2ludGVyIHVuZGVyIGluZGV4XHJcbiAgICAgICAgICAgIHZlcnRleFBhY2thZ2UucG9pbnRlcnNbIGkgXSA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGUgOiBcIkZMT0FUXCIsXHJcbiAgICAgICAgICAgICAgICBzaXplIDogc2l6ZSxcclxuICAgICAgICAgICAgICAgIG9mZnNldCA6IG9mZnNldFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBhY2N1bXVsYXRlIGF0dHJpYnV0ZSBvZmZzZXRcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IHNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBzdHJpZGUgdG8gdG90YWwgb2Zmc2V0XHJcbiAgICAgICAgdmVydGV4UGFja2FnZS5zdHJpZGUgPSBvZmZzZXQ7XHJcbiAgICAgICAgLy8gc2V0IHNpemUgb2YgcGFja2FnZSB0byB0aGUgc2hvcnRlc3QgYXR0cmlidXRlIGFycmF5IGxlbmd0aFxyXG4gICAgICAgIHZlcnRleFBhY2thZ2Uuc2l6ZSA9IHNob3J0ZXN0QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gVmVydGV4UGFja2FnZSggYXR0cmlidXRlcyApIHtcclxuICAgICAgICAvLyBlbnN1cmUgYXR0cmlidXRlcyBpcyBhbiBhcnJheSBvZiBhcnJheXNcclxuICAgICAgICBpZiAoICEoIGF0dHJpYnV0ZXNbMF0gaW5zdGFuY2VvZiBBcnJheSApICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gWyBhdHRyaWJ1dGVzIF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnNldCggYXR0cmlidXRlcyApO1xyXG4gICAgfVxyXG5cclxuICAgIFZlcnRleFBhY2thZ2UucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzICkge1xyXG4gICAgICAgIHZhciBCWVRFU19QRVJfQ09NUE9ORU5UID0gNCxcclxuICAgICAgICAgICAgYXR0cmlidXRlLFxyXG4gICAgICAgICAgICBwb2ludGVyLFxyXG4gICAgICAgICAgICB2ZXJ0ZXgsXHJcbiAgICAgICAgICAgIG9mZnNldCxcclxuICAgICAgICAgICAgaSwgaiwgaztcclxuICAgICAgICAvLyByZW1vdmUgYmFkIGF0dHJpYnV0ZXNcclxuICAgICAgICBhdHRyaWJ1dGVzID0gcmVtb3ZlQmFkQXJndW1lbnRzKCBhdHRyaWJ1dGVzICk7XHJcbiAgICAgICAgLy8gc2V0IGF0dHJpYnV0ZSBwb2ludGVycyBhbmQgc3RyaWRlXHJcbiAgICAgICAgc2V0UG9pbnRlcnNBbmRTdHJpZGUoIHRoaXMsIGF0dHJpYnV0ZXMgKTtcclxuICAgICAgICAvLyBzZXQgc2l6ZSBvZiBkYXRhIHZlY3RvclxyXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoIHRoaXMuc2l6ZSAqIHRoaXMuc3RyaWRlICk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggdmVydGV4IGF0dHJpYnV0ZSBhcnJheVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHBvaW50ZXJcclxuICAgICAgICAgICAgcG9pbnRlciA9IHRoaXMucG9pbnRlcnNbaV07XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgcG9pbnRlcnMgb2Zmc2V0XHJcbiAgICAgICAgICAgIG9mZnNldCA9IHBvaW50ZXIub2Zmc2V0O1xyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCB2ZXJ0ZXggYXR0cmlidXRlXHJcbiAgICAgICAgICAgIGZvciAoIGo9MDsgajx0aGlzLnNpemU7IGorKyApIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleCA9IGF0dHJpYnV0ZVtqXTtcclxuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gdGhlIGJ1ZmZlciB0byB0aGUgcGFydGljdWxhciBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIGsgPSBvZmZzZXQgKyAoIHRoaXMuc3RyaWRlICogaiApO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICggcG9pbnRlci5zaXplICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2tdID0gKCB2ZXJ0ZXgueCAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueCA6IHZlcnRleFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMV0gPSAoIHZlcnRleC55ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC55IDogdmVydGV4WzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrKzFdID0gKCB2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMl0gPSAoIHZlcnRleC56ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrKzFdID0gKCB2ZXJ0ZXgueSAhPT0gdW5kZWZpbmVkICkgPyB2ZXJ0ZXgueSA6IHZlcnRleFsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2srMl0gPSAoIHZlcnRleC56ICE9PSB1bmRlZmluZWQgKSA/IHZlcnRleC56IDogdmVydGV4WzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbayszXSA9ICggdmVydGV4LncgIT09IHVuZGVmaW5lZCApID8gdmVydGV4LncgOiB2ZXJ0ZXhbM107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtrXSA9ICggdmVydGV4LnggIT09IHVuZGVmaW5lZCApID8gdmVydGV4LnggOiB2ZXJ0ZXhbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHNjYWxlIG9mZnNldCBhbmQgc3RyaWRlIGJ5IGJ5dGVzIHBlciBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgLy8gaXQgaXMgZG9uZSBoZXJlIGFzIGFib3ZlIGxvZ2ljIHVzZXMgc3RyaWRlIGFuZCBvZmZzZXRcclxuICAgICAgICAgICAgLy8gYXMgY29tcG9uZW50IGNvdW50cyByYXRoZXIgdGhhbiBudW1iZXIgb2YgYnl0ZVxyXG4gICAgICAgICAgICBwb2ludGVyLnN0cmlkZSA9IHRoaXMuc3RyaWRlICogQllURVNfUEVSX0NPTVBPTkVOVDtcclxuICAgICAgICAgICAgcG9pbnRlci5vZmZzZXQgPSBwb2ludGVyLm9mZnNldCAqIEJZVEVTX1BFUl9DT01QT05FTlQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhQYWNrYWdlLnByb3RvdHlwZS5idWZmZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfTtcclxuXHJcbiAgICBWZXJ0ZXhQYWNrYWdlLnByb3RvdHlwZS5hdHRyaWJ1dGVQb2ludGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50ZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleFBhY2thZ2U7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFdlYkdMQ29udGV4dCA9IHJlcXVpcmUoJy4vV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgU3RhY2sgPSByZXF1aXJlKCcuLi91dGlsL1N0YWNrJyksXHJcbiAgICAgICAgX3N0YWNrID0gbmV3IFN0YWNrKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0KCB2aWV3cG9ydCwgd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICB2YXIgZ2wgPSB2aWV3cG9ydC5nbDtcclxuICAgICAgICBpZiAoIHdpZHRoICYmIGhlaWdodCApIHtcclxuICAgICAgICAgICAgZ2wudmlld3BvcnQoIDAsIDAsIHdpZHRoLCBoZWlnaHQgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBnbC52aWV3cG9ydCggMCwgMCwgdmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBWaWV3cG9ydCggc3BlYyApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICB0aGlzLmdsID0gV2ViR0xDb250ZXh0LmdldCgpO1xyXG4gICAgICAgIHRoaXMucmVzaXplKFxyXG4gICAgICAgICAgICBzcGVjLndpZHRoIHx8IHdpbmRvdy5pbm5lcldpZHRoLFxyXG4gICAgICAgICAgICBzcGVjLmhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIHZpZXdwb3J0IG9iamVjdHMgd2lkdGggYW5kIGhlaWdodC5cclxuICAgICAqIEBtZW1iZXJvZiBWaWV3cG9ydFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBWaWV3cG9ydC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XHJcbiAgICAgICAgaWYgKCB3aWR0aCAmJiBoZWlnaHQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5nbC5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdmlld3BvcnQgb2JqZWN0IGFuZCBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBzdGFjay5cclxuICAgICAqIEBtZW1iZXJvZiBWaWV3cG9ydFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtWaWV3cG9ydH0gVGhlIHZpZXdwb3J0IG9iamVjdCwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICAgVmlld3BvcnQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcclxuICAgICAgICBfc3RhY2sucHVzaCh7XHJcbiAgICAgICAgICAgIHZpZXdwb3J0OiB0aGlzLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0KCB0aGlzLCB3aWR0aCwgaGVpZ2h0ICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUG9wcyBjdXJyZW50IHRoZSB2aWV3cG9ydCBvYmplY3QgYW5kIHNldHMgdGhlIHZpZXdwb3J0IGJlbmVhdGggaXQuXHJcbiAgICAgKiBAbWVtYmVyb2YgVmlld3BvcnRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Vmlld3BvcnR9IFRoZSB2aWV3cG9ydCBvYmplY3QsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgIFZpZXdwb3J0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdG9wO1xyXG4gICAgICAgIF9zdGFjay5wb3AoKTtcclxuICAgICAgICB0b3AgPSBfc3RhY2sudG9wKCk7XHJcbiAgICAgICAgaWYgKCB0b3AgKSB7XHJcbiAgICAgICAgICAgIHNldCggdG9wLnZpZXdwb3J0LCB0b3Aud2lkdGgsIHRvcC5oZWlnaHQgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXQoIHRoaXMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gVmlld3BvcnQ7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIF9ib3VuZENvbnRleHQgPSBudWxsLFxyXG4gICAgICAgIF9jb250ZXh0c0J5SWQgPSB7fSxcclxuICAgICAgICBFWFRFTlNJT05TID0gW1xyXG4gICAgICAgICAgICAvLyByYXRpZmllZFxyXG4gICAgICAgICAgICAnT0VTX3RleHR1cmVfZmxvYXQnLFxyXG4gICAgICAgICAgICAnT0VTX3RleHR1cmVfaGFsZl9mbG9hdCcsXHJcbiAgICAgICAgICAgICdXRUJHTF9sb3NlX2NvbnRleHQnLFxyXG4gICAgICAgICAgICAnT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcclxuICAgICAgICAgICAgJ09FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0JyxcclxuICAgICAgICAgICAgJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nLFxyXG4gICAgICAgICAgICAnV0VCR0xfZGVidWdfc2hhZGVycycsXHJcbiAgICAgICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YycsXHJcbiAgICAgICAgICAgICdXRUJHTF9kZXB0aF90ZXh0dXJlJyxcclxuICAgICAgICAgICAgJ09FU19lbGVtZW50X2luZGV4X3VpbnQnLFxyXG4gICAgICAgICAgICAnRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJyxcclxuICAgICAgICAgICAgJ1dFQkdMX2RyYXdfYnVmZmVycycsXHJcbiAgICAgICAgICAgICdBTkdMRV9pbnN0YW5jZWRfYXJyYXlzJyxcclxuICAgICAgICAgICAgJ09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhcicsXHJcbiAgICAgICAgICAgICdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhcicsXHJcbiAgICAgICAgICAgIC8vIGNvbW11bml0eVxyXG4gICAgICAgICAgICAnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2F0YycsXHJcbiAgICAgICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMnLFxyXG4gICAgICAgICAgICAnRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0JyxcclxuICAgICAgICAgICAgJ1dFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCcsXHJcbiAgICAgICAgICAgICdFWFRfZnJhZ19kZXB0aCcsXHJcbiAgICAgICAgICAgICdFWFRfc1JHQicsXHJcbiAgICAgICAgICAgICdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMScsXHJcbiAgICAgICAgICAgICdFWFRfYmxlbmRfbWlubWF4JyxcclxuICAgICAgICAgICAgJ0VYVF9zaGFkZXJfdGV4dHVyZV9sb2QnXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBDYW52YXMgZWxlbWVudCBvYmplY3QgZnJvbSBlaXRoZXIgYW4gZXhpc3Rpbmcgb2JqZWN0LCBvclxyXG4gICAgICogaWRlbnRpZmljYXRpb24gc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8U3RyaW5nfSBhcmcgLSBUaGUgQ2FudmFzXHJcbiAgICAgKiAgICAgb2JqZWN0IG9yIENhbnZhcyBpZGVudGlmaWNhdGlvbiBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRDYW52YXMoIGFyZyApIHtcclxuICAgICAgICBpZiAoIGFyZyBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQgfHxcclxuICAgICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggYXJnICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhbGwga25vd24gZXh0ZW5zaW9ucyBmb3IgYSBwcm92aWRlZFxyXG4gICAgICogV2ViR0xSZW5kZXJpbmdDb250ZXh0LiBTdG9yZXMgdGhlIHJlc3VsdHMgaW4gdGhlIGNvbnRleHQgd3JhcHBlciBmb3JcclxuICAgICAqIGxhdGVyIHF1ZXJpZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRXcmFwcGVyIC0gVGhlIGNvbnRleHQgd3JhcHBlci5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbG9hZEV4dGVuc2lvbnMoIGNvbnRleHRXcmFwcGVyICkge1xyXG4gICAgICAgIHZhciBnbCA9IGNvbnRleHRXcmFwcGVyLmdsLFxyXG4gICAgICAgICAgICBleHRlbnNpb24sXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPEVYVEVOU0lPTlMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGV4dGVuc2lvbiA9IEVYVEVOU0lPTlNbaV07XHJcbiAgICAgICAgICAgIGNvbnRleHRXcmFwcGVyLmV4dGVuc2lvbnNbIGV4dGVuc2lvbiBdID0gZ2wuZ2V0RXh0ZW5zaW9uKCBleHRlbnNpb24gKTtcclxuICAgICAgICAgICAgaWYgKCBjb250ZXh0V3JhcHBlci5leHRlbnNpb25zWyBleHRlbnNpb24gXSApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBleHRlbnNpb24gKyBcIiBleHRlbnNpb24gbG9hZGVkIHN1Y2Nlc3NmdWxseVwiICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggZXh0ZW5zaW9uICsgXCIgZXh0ZW5zaW9uIG5vdCBzdXBwb3J0ZWRcIiApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0ZW1wdHMgdG8gY3JlYXRlIGEgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdyYXBwZWQgaW5zaWRlIGFuIG9iamVjdCB3aGljaFxyXG4gICAgICogd2lsbCBhbHNvIHN0b3JlIHRoZSBleHRlbnNpb24gcXVlcnkgcmVzdWx0cy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBUaGUgQ2FudmFzIGVsZW1lbnQgb2JqZWN0IHRvIGNyZWF0ZSB0aGUgY29udGV4dCB1bmRlci5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fX0gb3B0aW9ucyAtIFBhcmFtZXRlcnMgdG8gdGhlIHdlYmdsIGNvbnRleHQsIG9ubHkgdXNlZCBkdXJpbmcgaW5zdGFudGlhdGlvbi4gT3B0aW9uYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gY29udGV4dFdyYXBwZXIgLSBUaGUgY29udGV4dCB3cmFwcGVyLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVDb250ZXh0V3JhcHBlciggY2FudmFzLCBvcHRpb25zICkge1xyXG4gICAgICAgIHZhciBjb250ZXh0V3JhcHBlcixcclxuICAgICAgICAgICAgZ2w7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gZ2V0IFdlYkdMIGNvbnRleHQsIGZhbGxiYWNrIHRvIGV4cGVyaW1lbnRhbFxyXG4gICAgICAgICAgICBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCBcIndlYmdsXCIsIG9wdGlvbnMgKSB8fCBjYW52YXMuZ2V0Q29udGV4dCggXCJleHBlcmltZW50YWwtd2ViZ2xcIiwgb3B0aW9ucyApO1xyXG4gICAgICAgICAgICAvLyB3cmFwIGNvbnRleHRcclxuICAgICAgICAgICAgY29udGV4dFdyYXBwZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogY2FudmFzLmlkLFxyXG4gICAgICAgICAgICAgICAgZ2w6IGdsLFxyXG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uczoge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gbG9hZCBXZWJHTCBleHRlbnNpb25zXHJcbiAgICAgICAgICAgIGxvYWRFeHRlbnNpb25zKCBjb250ZXh0V3JhcHBlciApO1xyXG4gICAgICAgICAgICAvLyBhZGQgY29udGV4dCB3cmFwcGVyIHRvIG1hcFxyXG4gICAgICAgICAgICBfY29udGV4dHNCeUlkWyBjYW52YXMuaWQgXSA9IGNvbnRleHRXcmFwcGVyO1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBhIGJvdW5kIGNvbnRleHQgZXhpc3RzXHJcbiAgICAgICAgICAgIGlmICggIV9ib3VuZENvbnRleHQgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBiaW5kIGNvbnRleHQgaWYgbm8gb3RoZXIgaXMgYm91bmRcclxuICAgICAgICAgICAgICAgIF9ib3VuZENvbnRleHQgPSBjb250ZXh0V3JhcHBlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIGUubWVzc2FnZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoICFnbCApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG1heSBub3QgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzdXBwb3J0IGl0LlwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb250ZXh0V3JhcHBlcjtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmluZHMgYSBzcGVjaWZpYyBXZWJHTCBjb250ZXh0IGFzIHRoZSBhY3RpdmUgY29udGV4dC4gVGhpcyBjb250ZXh0XHJcbiAgICAgICAgICogd2lsbCBiZSB1c2VkIGZvciBhbGwgY29kZSAvd2ViZ2wuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtXZWJHTENvbnRleHR9IFRoaXMgbmFtZXNwYWNlLCB1c2VkIGZvciBjaGFpbmluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBiaW5kOiBmdW5jdGlvbiggYXJnICkge1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZ2V0Q2FudmFzKCBhcmcgKTtcclxuICAgICAgICAgICAgaWYgKCAhY2FudmFzICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJDb250ZXh0IGNvdWxkIG5vdCBiZSBib3VuZCBmb3IgYXJndW1lbnQgb2YgXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZSAnXCIgKyAoIHR5cGVvZiBhcmcgKSArIFwiJywgY29tbWFuZCBpZ25vcmVkLlwiICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoICFfY29udGV4dHNCeUlkWyBjYW52YXMuaWQgXSApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIFwiTm8gY29udGV4dCBleGlzdHMgZm9yIHByb3ZpZGVkIGFyZ3VtZW50ICdcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgYXJnICsgXCInLCBjb21tYW5kIGlnbm9yZWQuXCIgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfYm91bmRDb250ZXh0ID0gX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgb3IgcmV0cmVpdmVzIGFuIGV4aXN0aW5nIFdlYkdMIGNvbnRleHQgZm9yIGEgcHJvdmlkZWRcclxuICAgICAgICAgKiBjYW52YXMgb2JqZWN0LiBEdXJpbmcgY3JlYXRpb24gYXR0ZW1wdHMgdG8gbG9hZCBhbGwgZXh0ZW5zaW9ucyBmb3VuZFxyXG4gICAgICAgICAqIGF0OiBodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS93ZWJnbC9leHRlbnNpb25zLy4gSWYgbm9cclxuICAgICAgICAgKiBhcmd1bWVudCBpcyBwcm92aWRlZCBpdCB3aWxsIGF0dGVtcHQgdG8gcmV0dXJuIHRoZSBjdXJyZW50bHkgYm91bmRcclxuICAgICAgICAgKiBjb250ZXh0LiBJZiBubyBjb250ZXh0IGlzIGJvdW5kLCBpdCB3aWxsIHJldHVybiAnbnVsbCcuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9fSBvcHRpb25zIC0gUGFyYW1ldGVycyB0byB0aGUgd2ViZ2wgY29udGV4dCwgb25seSB1c2VkIGR1cmluZyBpbnN0YW50aWF0aW9uLiBPcHRpb25hbC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSBXZWJHTFJlbmRlcmluZ0NvbnRleHQgY29udGV4dCBvYmplY3QuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiggYXJnLCBvcHRpb25zICkge1xyXG4gICAgICAgICAgICBpZiAoICFhcmcgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoICFfYm91bmRDb250ZXh0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vIGJvdW5kIGNvbnRleHQgb3IgYXJndW1lbnRcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIk5vIGNvbnRleHQgaXMgY3VycmVudGx5IGJvdW5kIG9yIFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm92aWRlZCwgcmV0dXJuaW5nICdudWxsJy5cIiApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGxhc3QgYm91bmQgY29udGV4dFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9ib3VuZENvbnRleHQuZ2w7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZ2V0IGNhbnZhcyBlbGVtZW50XHJcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBnZXRDYW52YXMoIGFyZyApO1xyXG4gICAgICAgICAgICAvLyB0cnkgdG8gZmluZCBvciBjcmVhdGUgY29udGV4dFxyXG4gICAgICAgICAgICBpZiAoICFjYW52YXMgfHwgKCAhX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF0gJiYgIWNyZWF0ZUNvbnRleHRXcmFwcGVyKCBjYW52YXMsIG9wdGlvbnMgKSApICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJDb250ZXh0IGNvdWxkIG5vdCBiZSBmb3VuZCBvciBjcmVhdGVkIGZvciBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhcmd1bWVudCBvZiB0eXBlJ1wiKyggdHlwZW9mIGFyZyApK1wiJywgcmV0dXJuaW5nICdudWxsJy5cIiApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0c0J5SWRbIGNhbnZhcy5pZCBdLmdsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENoZWNrcyBpZiBhbiBleHRlbnNpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBieSB0aGUgcHJvdmlkZWRcclxuICAgICAgICAgKiBjYW52YXMgb2JqZWN0LiBJZiBubyBhcmd1bWVudCBpcyBwcm92aWRlZCBpdCB3aWxsIGF0dGVtcHQgdG8gcmV0dXJuXHJcbiAgICAgICAgICogdGhlIGN1cnJlbnRseSBib3VuZCBjb250ZXh0LiBJZiBubyBjb250ZXh0IGlzIGJvdW5kLCBpdCB3aWxsIHJldHVyblxyXG4gICAgICAgICAqICdmYWxzZScuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fFN0cmluZ30gYXJnIC0gVGhlIENhbnZhcyBvYmplY3Qgb3IgQ2FudmFzIGlkZW50aWZpY2F0aW9uIHN0cmluZy4gT3B0aW9uYWwuXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvbiAtIFRoZSBleHRlbnNpb24gbmFtZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvdmlkZWQgZXh0ZW5zaW9uIGhhcyBiZWVuIGxvYWRlZCBzdWNjZXNzZnVsbHkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2hlY2tFeHRlbnNpb246IGZ1bmN0aW9uKCBhcmcsIGV4dGVuc2lvbiApIHtcclxuICAgICAgICAgICAgdmFyIGV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgY2FudmFzO1xyXG4gICAgICAgICAgICBpZiAoICFleHRlbnNpb24gKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjYW4gY2hlY2sgZXh0ZW5zaW9uIHdpdGhvdXQgYXJnXHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBhcmc7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gX2JvdW5kQ29udGV4dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbnZhcyA9IGdldENhbnZhcyggYXJnICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGNhbnZhcyApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gX2NvbnRleHRzQnlJZFsgY2FudmFzLmlkIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCAhY29udGV4dCApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyBjb250ZXh0IGlzIGN1cnJlbnRseSBib3VuZCBvciBwcm92aWRlZCBhcyBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhcmd1bWVudCwgcmV0dXJuaW5nIGZhbHNlLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBleHRlbnNpb25zID0gY29udGV4dC5leHRlbnNpb25zO1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5zaW9uc1sgZXh0ZW5zaW9uIF0gPyBleHRlbnNpb25zWyBleHRlbnNpb24gXSA6IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgIC8vIGNvcmVcclxuICAgICAgICBDdWJlTWFwUmVuZGVyVGFyZ2V0OiByZXF1aXJlKCcuL2NvcmUvQ3ViZU1hcFJlbmRlclRhcmdldCcpLFxyXG4gICAgICAgIFJlbmRlclRhcmdldDogcmVxdWlyZSgnLi9jb3JlL1JlbmRlclRhcmdldCcpLFxyXG4gICAgICAgIFNoYWRlcjogcmVxdWlyZSgnLi9jb3JlL1NoYWRlcicpLFxyXG4gICAgICAgIFRleHR1cmUyRDogcmVxdWlyZSgnLi9jb3JlL1RleHR1cmUyRCcpLFxyXG4gICAgICAgIFRleHR1cmVDdWJlTWFwOiByZXF1aXJlKCcuL2NvcmUvVGV4dHVyZUN1YmVNYXAnKSxcclxuICAgICAgICBWZXJ0ZXhCdWZmZXI6IHJlcXVpcmUoJy4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcclxuICAgICAgICBWZXJ0ZXhQYWNrYWdlOiByZXF1aXJlKCcuL2NvcmUvVmVydGV4UGFja2FnZScpLFxyXG4gICAgICAgIEluZGV4QnVmZmVyOiByZXF1aXJlKCcuL2NvcmUvSW5kZXhCdWZmZXInKSxcclxuICAgICAgICBWaWV3cG9ydDogcmVxdWlyZSgnLi9jb3JlL1ZpZXdwb3J0JyksXHJcbiAgICAgICAgV2ViR0xDb250ZXh0OiByZXF1aXJlKCcuL2NvcmUvV2ViR0xDb250ZXh0JyksXHJcbiAgICAgICAgLy8gcmVuZGVyXHJcbiAgICAgICAgQ2FtZXJhOiByZXF1aXJlKCcuL3JlbmRlci9DYW1lcmEnKSxcclxuICAgICAgICBFbnRpdHk6IHJlcXVpcmUoJy4vcmVuZGVyL0VudGl0eScpLFxyXG4gICAgICAgIEdlb21ldHJ5OiByZXF1aXJlKCcuL3JlbmRlci9HZW9tZXRyeScpLFxyXG4gICAgICAgIE1hdGVyaWFsOiByZXF1aXJlKCcuL3JlbmRlci9NYXRlcmlhbCcpLFxyXG4gICAgICAgIE1lc2g6IHJlcXVpcmUoJy4vcmVuZGVyL01lc2gnKSxcclxuICAgICAgICBKb2ludDogcmVxdWlyZSgnLi9yZW5kZXIvSm9pbnQnKSxcclxuICAgICAgICBPY3RyZWU6IHJlcXVpcmUoJy4vcmVuZGVyL09jdHJlZScpLFxyXG4gICAgICAgIFJlbmRlcmFibGU6IHJlcXVpcmUoJy4vcmVuZGVyL1JlbmRlcmFibGUnKSxcclxuICAgICAgICBSZW5kZXJlcjogcmVxdWlyZSgnLi9yZW5kZXIvUmVuZGVyZXInKSxcclxuICAgICAgICBSZW5kZXJQYXNzOiByZXF1aXJlKCcuL3JlbmRlci9SZW5kZXJQYXNzJyksXHJcbiAgICAgICAgUmVuZGVyVGVjaG5pcXVlOiByZXF1aXJlKCcuL3JlbmRlci9SZW5kZXJUZWNobmlxdWUnKSxcclxuICAgICAgICBTa2VsZXRvbjogcmVxdWlyZSgnLi9yZW5kZXIvU2tlbGV0b24nKSxcclxuICAgICAgICBTcHJpdGU6IHJlcXVpcmUoJy4vcmVuZGVyL1Nwcml0ZScpLFxyXG4gICAgICAgIC8vIHNoYXBlc1xyXG4gICAgICAgIEN1YmU6IHJlcXVpcmUoJy4vdXRpbC9zaGFwZXMvQ3ViZScpLFxyXG4gICAgICAgIEN5bGluZGVyOiByZXF1aXJlKCcuL3V0aWwvc2hhcGVzL0N5bGluZGVyJyksXHJcbiAgICAgICAgUXVhZDogcmVxdWlyZSgnLi91dGlsL3NoYXBlcy9RdWFkJyksXHJcbiAgICAgICAgU2hhcGVVdGlsOiByZXF1aXJlKCcuL3V0aWwvc2hhcGVzL1NoYXBlVXRpbCcpLFxyXG4gICAgICAgIFNwaGVyZTogcmVxdWlyZSgnLi91dGlsL3NoYXBlcy9TcGhlcmUnKSxcclxuICAgICAgICAvLyB1dGlsXHJcbiAgICAgICAgZ2xURkxvYWRlcjogcmVxdWlyZSgnLi91dGlsL2dsdGYvZ2xURkxvYWRlcicpLFxyXG4gICAgICAgIE9CSk1UTExvYWRlcjogcmVxdWlyZSgnLi91dGlsL29iai9PQkpNVExMb2FkZXInKSxcclxuICAgICAgICBVdGlsOiByZXF1aXJlKCcuL3V0aWwvVXRpbCcpLFxyXG4gICAgICAgIC8vIGRlYnVnXHJcbiAgICAgICAgRGVidWc6IHJlcXVpcmUoJy4vdXRpbC9kZWJ1Zy9EZWJ1ZycpLFxyXG4gICAgICAgIC8vIG1hdGhcclxuICAgICAgICBNYXQzMzogcmVxdWlyZSgnYWxmYWRvcicpLk1hdDMzLFxyXG4gICAgICAgIE1hdDQ0OiByZXF1aXJlKCdhbGZhZG9yJykuTWF0NDQsXHJcbiAgICAgICAgVmVjMjogcmVxdWlyZSgnYWxmYWRvcicpLlZlYzIsXHJcbiAgICAgICAgVmVjMzogcmVxdWlyZSgnYWxmYWRvcicpLlZlYzMsXHJcbiAgICAgICAgVmVjNDogcmVxdWlyZSgnYWxmYWRvcicpLlZlYzQsXHJcbiAgICAgICAgUXVhdGVybmlvbjogcmVxdWlyZSgnYWxmYWRvcicpLlF1YXRlcm5pb24sXHJcbiAgICAgICAgVHJhbnNmb3JtOiByZXF1aXJlKCdhbGZhZG9yJykuVHJhbnNmb3JtLFxyXG4gICAgICAgIFRyaWFuZ2xlOiByZXF1aXJlKCdhbGZhZG9yJykuVHJpYW5nbGVcclxuICAgIH07XHJcblxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBBbmltYXRpb24oIHNwZWMgKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRzID0gc3BlYy50YXJnZXRzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgYWxmYWRvciA9IHJlcXVpcmUoJ2FsZmFkb3InKSxcclxuICAgICAgICBUcmFuc2Zvcm0gPSBhbGZhZG9yLlRyYW5zZm9ybSxcclxuICAgICAgICBNYXQ0NCA9IGFsZmFkb3IuTWF0NDQsXHJcbiAgICAgICAgRW50aXR5ID0gcmVxdWlyZSgnLi9FbnRpdHknKTtcclxuXHJcbiAgICBmdW5jdGlvbiBDYW1lcmEoIHNwZWMgKSB7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgLy8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yIGZvciB0cmFuc2Zvcm1cclxuICAgICAgICBUcmFuc2Zvcm0uY2FsbCggdGhpcywgc3BlYyApO1xyXG4gICAgICAgIC8vIHNldCBpZCBpZiB0aGVyZSBpcyBvbmVcclxuICAgICAgICBpZiAoIHNwZWMuaWQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBzcGVjLmlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMucHJvamVjdGlvbiApIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uTWF0cml4KCBzcGVjLnByb2plY3Rpb24gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3Rpb25NYXRyaXgoe1xyXG4gICAgICAgICAgICAgICAgZm92OiA0NSxcclxuICAgICAgICAgICAgICAgIGFzcGVjdDogNC8zLFxyXG4gICAgICAgICAgICAgICAgbWluWjogMC4xLFxyXG4gICAgICAgICAgICAgICAgbWF4WjogMTAwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHBhcmVudFxyXG4gICAgICAgIHRoaXMucGFyZW50ID0gc3BlYy5wYXJlbnQgfHwgbnVsbDtcclxuICAgICAgICAvLyBzZXQgY2hpbGRyZW5cclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgaWYgKCBzcGVjLmNoaWxkcmVuICkge1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8c3BlYy5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoIHNwZWMuY2hpbGRyZW5baV0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBDYW1lcmEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggRW50aXR5LnByb3RvdHlwZSApO1xyXG5cclxuICAgIENhbWVyYS5wcm90b3R5cGUucHJvamVjdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCBwcm9qZWN0aW9uICkge1xyXG4gICAgICAgIGlmICggcHJvamVjdGlvbiApIHtcclxuICAgICAgICAgICAgaWYgKCBwcm9qZWN0aW9uIGluc3RhbmNlb2YgQXJyYXkgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3Rpb24gPSBuZXcgTWF0NDQoIHByb2plY3Rpb24gKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggcHJvamVjdGlvbiBpbnN0YW5jZW9mIE1hdDQ0ICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uID0gcHJvamVjdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGlvbiA9IE1hdDQ0LnBlcnNwZWN0aXZlKFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uZm92IHx8IDQ1LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uYXNwZWN0IHx8IDQvMyxcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnpNaW4gfHwgMC4xLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uek1heCB8fCAxMDAwICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIENhbWVyYS5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gbmV3IENhbWVyYSh7XHJcbiAgICAgICAgICAgICAgICB1cDogdGhpcy51cCgpLFxyXG4gICAgICAgICAgICAgICAgZm9yd2FyZDogdGhpcy5mb3J3YXJkKCksXHJcbiAgICAgICAgICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luKCksXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uOiBuZXcgTWF0NDQoIHRoaXMucHJvamVjdGlvbiApXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIC8vIGNvcHkgY2hpbGRyZW4gYnkgdmFsdWVcclxuICAgICAgICBmb3IgKCBpPTA7IGk8dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdGhhdC5hZGRDaGlsZCggdGhpcy5jaGlsZHJlbltpXS5jb3B5KCkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoYXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gQ2FtZXJhO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnYWxmYWRvcicpLlRyYW5zZm9ybSxcclxuICAgICAgICBNZXNoID0gcmVxdWlyZSgnLi9NZXNoJyksXHJcbiAgICAgICAgU3ByaXRlID0gcmVxdWlyZSgnLi9TcHJpdGUnKSxcclxuICAgICAgICBTa2VsZXRvbiA9IHJlcXVpcmUoJy4vU2tlbGV0b24nKSxcclxuICAgICAgICBBbmltYXRpb24gPSByZXF1aXJlKCcuL0FuaW1hdGlvbicpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEVudGl0eSggc3BlYyApIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgc3BlYyA9IHNwZWMgfHwge307XHJcbiAgICAgICAgLy8gY2FsbCBiYXNlIGNvbnN0cnVjdG9yIGZvciB0cmFuc2Zvcm1cclxuICAgICAgICBUcmFuc2Zvcm0uY2FsbCggdGhpcywgc3BlYyApO1xyXG4gICAgICAgIC8vIHNldCBpZCBpZiB0aGVyZSBpcyBvbmVcclxuICAgICAgICBpZiAoIHNwZWMuaWQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBzcGVjLmlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzZXQgcGFyZW50XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBzcGVjLnBhcmVudCB8fCBudWxsO1xyXG4gICAgICAgIC8vIHNldCBjaGlsZHJlblxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBpZiAoIHNwZWMuY2hpbGRyZW4gKSB7XHJcbiAgICAgICAgICAgIHNwZWMuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkICkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5hZGRDaGlsZCggY2hpbGQgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBtZXNoZXNcclxuICAgICAgICB0aGlzLm1lc2hlcyA9IFtdO1xyXG4gICAgICAgIGlmICggc3BlYy5tZXNoZXMgKSB7XHJcbiAgICAgICAgICAgIHNwZWMubWVzaGVzLmZvckVhY2goIGZ1bmN0aW9uKCBtZXNoICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBtZXNoIGluc3RhbmNlb2YgTWVzaCApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1lc2hlcy5wdXNoKCBtZXNoICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQubWVzaGVzLnB1c2goIG5ldyBNZXNoKCBtZXNoICkgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBzcHJpdGVzXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzID0gW107XHJcbiAgICAgICAgaWYgKCBzcGVjLnNwcml0ZXMgKSB7XHJcbiAgICAgICAgICAgIHNwZWMuc3ByaXRlcy5mb3JFYWNoKCBmdW5jdGlvbiggc3ByaXRlICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBzcHJpdGUgaW5zdGFuY2VvZiBTcHJpdGUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zcHJpdGVzLnB1c2goIHNwcml0ZSApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNwcml0ZXMucHVzaCggbmV3IFNwcml0ZSggc3ByaXRlICkgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBza2VsZXRvbiwgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgdGhpcy5za2VsZXRvbiA9IG51bGw7XHJcbiAgICAgICAgaWYgKCBzcGVjLnNrZWxldG9uICkge1xyXG4gICAgICAgICAgICBpZiAoIHNwZWMuc2tlbGV0b24gaW5zdGFuY2VvZiBTa2VsZXRvbiApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2tlbGV0b24gPSBzcGVjLnNrZWxldG9uO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5za2VsZXRvbiA9IG5ldyBTa2VsZXRvbiggc3BlYy5za2VsZXRvbiApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBhbmltYXRpb25zLCBpZiB0aGV5IGV4aXN0XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25zID0ge307XHJcbiAgICAgICAgaWYgKCBzcGVjLmFuaW1hdGlvbnMgKSB7XHJcbiAgICAgICAgICAgIGZvciAoIHZhciBrZXkgaW4gc3BlYy5hbmltYXRpb25zICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBzcGVjLmFuaW1hdGlvbnMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc3BlYy5hbmltYXRpb25zWyBrZXkgXSBpbnN0YW5jZW9mIEFuaW1hdGlvbiApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zWyBrZXkgXSA9IHNwZWMuYW5pbWF0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbIGtleSBdID0gbmV3IEFuaW1hdGlvbiggc3BlYy5hbmltYXRpb25zICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBUcmFuc2Zvcm0ucHJvdG90eXBlICk7XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5nbG9iYWxNYXRyaXggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIHRoaXMucGFyZW50ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2xvYmFsTWF0cml4KCkubXVsdCggdGhpcy5tYXRyaXgoKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tYXRyaXgoKTtcclxuICAgIH07XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5nbG9iYWxWaWV3TWF0cml4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCB0aGlzLnBhcmVudCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm11bHQoIHRoaXMubWF0cml4KCkgKS52aWV3TWF0cml4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdNYXRyaXgoKTtcclxuICAgIH07XHJcblxyXG4gICAgRW50aXR5LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uKCBjaGlsZCApIHtcclxuICAgICAgICBpZiAoICEoIGNoaWxkIGluc3RhbmNlb2YgRW50aXR5ICkgKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gbmV3IEVudGl0eSggY2hpbGQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGNoaWxkICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbiggY2hpbGQgKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKCBjaGlsZCApO1xyXG4gICAgICAgIGlmICggaW5kZXggIT09IC0xICkge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSggaW5kZXgsIDEgKTtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIEVudGl0eS5wcm90b3R5cGUuZGVwdGhGaXJzdCA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcclxuICAgICAgICBjYWxsYmFjayggdGhpcyApO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkICkge1xyXG4gICAgICAgICAgICBjaGlsZC5kZXB0aEZpcnN0KCBjYWxsYmFjayApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBFbnRpdHkucHJvdG90eXBlLmJyZWFkdGhGaXJzdCA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcclxuICAgICAgICB2YXIgcXVldWUgPSBbIHRoaXMgXTtcclxuICAgICAgICB3aGlsZSAoIHF1ZXVlLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3AgPSBxdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICBxdWV1ZSA9IHF1ZXVlLmNvbmNhdCggcXVldWUsIHRvcC5jaGlsZHJlbiApO1xyXG4gICAgICAgICAgICBjYWxsYmFjayggdG9wICk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBFbnRpdHkucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IG5ldyBFbnRpdHkoe1xyXG4gICAgICAgICAgICAgICAgdXA6IHRoaXMudXAoKSxcclxuICAgICAgICAgICAgICAgIGZvcndhcmQ6IHRoaXMuZm9yd2FyZCgpLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbigpLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUoKSxcclxuICAgICAgICAgICAgICAgIG1lc2hlczogdGhpcy5tZXNoZXMsIC8vIGNvcHkgYnkgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgICAgICBzcHJpdGVzOiB0aGlzLnNwcml0ZXMsIC8vIGNvcHkgYnkgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgICAgICBza2VsZXRvbjogdGhpcy5za2VsZXRvbiwgLy8gY29weSBieSByZWZlcmVuY2VcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnM6IHRoaXMuYW5pbWF0aW9ucyAvLyBjb3B5IGJ5IHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAvLyBjb3B5IGNoaWxkcmVuIGJ5IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQgKSB7XHJcbiAgICAgICAgICAgIHRoYXQuYWRkQ2hpbGQoIGNoaWxkLmNvcHkoKSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEVudGl0eTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGZ1bmN0aW9uIEdlb21ldHJ5KCBzcGVjICkge1xuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IHNwZWMucG9zaXRpb25zO1xuICAgICAgICB0aGlzLnV2cyA9IHNwZWMudXZzO1xuICAgICAgICB0aGlzLm5vcm1hbHMgPSBzcGVjLm5vcm1hbHM7XG4gICAgICAgIHRoaXMudGFuZ2VudHMgPSBzcGVjLnRhbmdlbnRzO1xuICAgICAgICB0aGlzLmJpdGFuZ2VudHMgPSBzcGVjLmJpdGFuZ2VudHM7XG4gICAgICAgIHRoaXMuaW5kaWNlcyA9IHNwZWMuaW5kaWNlcztcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5O1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBKb2ludCggc3BlYyApIHtcclxuICAgICAgICB0aGlzLmlkID0gc3BlYy5pZDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBzcGVjLm5hbWU7XHJcbiAgICAgICAgdGhpcy5iaW5kTWF0cml4ID0gc3BlYy5iaW5kTWF0cml4O1xyXG4gICAgICAgIHRoaXMuaW52ZXJzZUJpbmRNYXRyaXggPSBzcGVjLmludmVyc2VCaW5kTWF0cml4O1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gc3BlYy5wYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHNwZWMuY2hpbGRyZW47XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHNwZWMuaW5kZXg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgSm9pbnQucHJvdG90eXBlLnNraW5uaW5nTWF0cml4ID0gZnVuY3Rpb24oIGJpbmRTaGFwZU1hdHJpeCwgcG9zZU1hdHJpeCApIHtcclxuICAgICAgICAvLyBpZiBubyBwb3NlIG1hdHJpeCBpcyBwcm92aWRlZCwgZGVmYXVsdCB0byBiaW5kIHBvc2l0aW9uXHJcbiAgICAgICAgcG9zZU1hdHJpeCA9IHBvc2VNYXRyaXggfHwgdGhpcy5iaW5kTWF0cml4O1xyXG4gICAgICAgIC8vIHVwZGF0ZSBnbG9iYWxUcmFuc2Zvcm0sIGNoaWxkcmVuIHdpbGwgcmVseSBvbiB0aGVzZVxyXG4gICAgICAgIGlmICggdGhpcy5wYXJlbnQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsTWF0cml4ID0gdGhpcy5wYXJlbnQuZ2xvYmFsTWF0cml4Lm11bHQoIHBvc2VNYXRyaXggKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbE1hdHJpeCA9IHBvc2VNYXRyaXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHJldHVybiBza2lubmluZyBtYXRyaXhcclxuICAgICAgICByZXR1cm4gdGhpcy5nbG9iYWxNYXRyaXgubXVsdCggdGhpcy5pbnZlcnNlQmluZE1hdHJpeC5tdWx0KCBiaW5kU2hhcGVNYXRyaXggKSApO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEpvaW50O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVGV4dHVyZTJEID0gcmVxdWlyZSgnLi4vY29yZS9UZXh0dXJlMkQnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVUZXh0dXJlKCB0ZXh0dXJlICkge1xyXG4gICAgICAgIGlmICggIXRleHR1cmUgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoICEoIHRleHR1cmUgaW5zdGFuY2VvZiBUZXh0dXJlMkQgKSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUZXh0dXJlMkQoe1xyXG4gICAgICAgICAgICAgICAgaW1hZ2U6IHRleHR1cmVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlQ29sb3IoIGNvbG9yICkge1xyXG4gICAgICAgIGlmICggY29sb3IgaW5zdGFuY2VvZiBBcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIFsgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10gfHwgMS4wIF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbCggc3BlYyApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICB0aGlzLmlkID0gc3BlYy5pZDtcclxuICAgICAgICB0aGlzLmRpZmZ1c2VDb2xvciA9IHBhcnNlQ29sb3IoIHNwZWMuZGlmZnVzZUNvbG9yICkgfHwgWyAxLCAwLCAxLCAxIF07XHJcbiAgICAgICAgdGhpcy5kaWZmdXNlVGV4dHVyZSA9IGNyZWF0ZVRleHR1cmUoIHNwZWMuZGlmZnVzZVRleHR1cmUgKSB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMuYW1iaWVudENvbG9yID0gcGFyc2VDb2xvciggc3BlYy5hbWJpZW50Q29sb3IgKSB8fCBbIDAsIDAsIDAsIDEgXTtcclxuICAgICAgICB0aGlzLmFtYmllbnRUZXh0dXJlID0gY3JlYXRlVGV4dHVyZSggc3BlYy5hbWJpZW50VGV4dHVyZSApIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5zcGVjdWxhckNvbG9yID0gcGFyc2VDb2xvciggc3BlYy5zcGVjdWxhckNvbG9yICkgfHwgWyAxLCAxLCAxLCAxIF07XHJcbiAgICAgICAgdGhpcy5zcGVjdWxhclRleHR1cmUgPSBjcmVhdGVUZXh0dXJlKCBzcGVjLnNwZWN1bGFyVGV4dHVyZSApIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5zcGVjdWxhckNvbXBvbmVudCA9IHNwZWMuc3BlY3VsYXJDb21wb25lbnQgfHwgMTA7XHJcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gKCBzcGVjLnJlZmxlY3Rpb24gIT09IHVuZGVmaW5lZCApID8gc3BlYy5yZWZsZWN0aW9uIDogMDtcclxuICAgICAgICB0aGlzLnJlZnJhY3Rpb24gPSAoIHNwZWMucmVmcmFjdGlvbiAhPT0gdW5kZWZpbmVkICkgPyBzcGVjLnJlZnJhY3Rpb24gOiAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWw7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vR2VvbWV0cnknKSxcclxuICAgICAgICBSZW5kZXJhYmxlID0gcmVxdWlyZSgnLi9SZW5kZXJhYmxlJyksXHJcbiAgICAgICAgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL01hdGVyaWFsJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gTWVzaCggc3BlYyApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICAvLyBzZXQgZ2VvbWV0cnlcclxuICAgICAgICBpZiAoIHNwZWMuZ2VvbWV0cnkgKSB7XHJcbiAgICAgICAgICAgIGlmICggc3BlYy5nZW9tZXRyeSBpbnN0YW5jZW9mIEdlb21ldHJ5ICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW9tZXRyeSA9IHNwZWMuZ2VvbWV0cnk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KCBzcGVjLmdlb21ldHJ5ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KCBzcGVjICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCByZW5kZXJhYmxlXHJcbiAgICAgICAgaWYgKCBzcGVjLnJlbmRlcmFibGUgKSB7XHJcbiAgICAgICAgICAgIGlmICggc3BlYy5yZW5kZXJhYmxlIGluc3RhbmNlb2YgUmVuZGVyYWJsZSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyYWJsZSA9IHNwZWMucmVuZGVyYWJsZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyYWJsZSA9IG5ldyBSZW5kZXJhYmxlKCBzcGVjLnJlbmRlcmFibGUgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyYWJsZSA9IG5ldyBSZW5kZXJhYmxlKCBzcGVjICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBtYXRlcmlhbFxyXG4gICAgICAgIGlmICggc3BlYy5tYXRlcmlhbCApIHtcclxuICAgICAgICAgICAgaWYgKCBzcGVjLm1hdGVyaWFsIGluc3RhbmNlb2YgTWF0ZXJpYWwgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFsID0gc3BlYy5tYXRlcmlhbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoIHNwZWMubWF0ZXJpYWwgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoIHNwZWMgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgTWVzaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyYWJsZS5kcmF3KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gTWVzaDtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBhbGZhZG9yID0gcmVxdWlyZSgnYWxmYWRvcicpLFxyXG4gICAgICAgIFRyaWFuZ2xlID0gYWxmYWRvci5UcmlhbmdsZSxcclxuICAgICAgICBWZWMzID0gYWxmYWRvci5WZWMzLFxyXG4gICAgICAgIEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5JyksXHJcbiAgICAgICAgTWVzaCA9IHJlcXVpcmUoJy4vTWVzaCcpLFxyXG4gICAgICAgIERFRkFVTFRfREVQVEggPSA0LFxyXG4gICAgICAgIE1JTl9WRUMgPSBuZXcgVmVjMyhcclxuICAgICAgICAgICAgTnVtYmVyLk1JTl9WQUxVRSxcclxuICAgICAgICAgICAgTnVtYmVyLk1JTl9WQUxVRSxcclxuICAgICAgICAgICAgTnVtYmVyLk1JTl9WQUxVRSApLFxyXG4gICAgICAgIE1BWF9WRUMgPSBuZXcgVmVjMyhcclxuICAgICAgICAgICAgTnVtYmVyLk1BWF9WQUxVRSxcclxuICAgICAgICAgICAgTnVtYmVyLk1BWF9WQUxVRSxcclxuICAgICAgICAgICAgTnVtYmVyLk1BWF9WQUxVRSApLFxyXG4gICAgICAgIF9jdWJlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZHMgdGhlIG1pbmludW0gYW5kIG1heGltdW0gYm91bmRpbmcgZXh0ZW50cyB3aXRoaW4gYSBzZXQgb2YgdHJpYW5nbGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRyaWFuZ2xlcyAtIFRoZSBhcnJheSBvZiB0cmlhbmdsZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIG1pbmltdW0gYW5kIG1heGltdW0gcG9pbnRzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtaW5NYXgoIHRyaWFuZ2xlcyApIHtcclxuICAgICAgICB2YXIgbWluID0gTUFYX1ZFQyxcclxuICAgICAgICAgICAgbWF4ID0gTUlOX1ZFQyxcclxuICAgICAgICAgICAgdHJpYW5nbGUsXHJcbiAgICAgICAgICAgIGEsIGIsIGMsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgZm9yICggaT0wOyBpPHRyaWFuZ2xlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdHJpYW5nbGUgPSB0cmlhbmdsZXNbaV07XHJcbiAgICAgICAgICAgIGEgPSB0cmlhbmdsZS5hO1xyXG4gICAgICAgICAgICBiID0gdHJpYW5nbGUuYjtcclxuICAgICAgICAgICAgYyA9IHRyaWFuZ2xlLmM7XHJcbiAgICAgICAgICAgIC8vIGdldCBtaW5cclxuICAgICAgICAgICAgbWluLnggPSBNYXRoLm1pbiggbWluLngsIE1hdGgubWluKCBNYXRoLm1pbiggYS54LCBiLnggKSwgYy54ICkgKTtcclxuICAgICAgICAgICAgbWluLnkgPSBNYXRoLm1pbiggbWluLnksIE1hdGgubWluKCBNYXRoLm1pbiggYS55LCBiLnkgKSwgYy55ICkgKTtcclxuICAgICAgICAgICAgbWluLnogPSBNYXRoLm1pbiggbWluLnosIE1hdGgubWluKCBNYXRoLm1pbiggYS56LCBiLnogKSwgYy56ICkgKTtcclxuICAgICAgICAgICAgLy8gZ2V0IG1heFxyXG4gICAgICAgICAgICBtYXgueCA9IE1hdGgubWF4KCBtYXgueCwgTWF0aC5tYXgoIE1hdGgubWF4KCBhLngsIGIueCApLCBjLnggKSApO1xyXG4gICAgICAgICAgICBtYXgueSA9IE1hdGgubWF4KCBtYXgueSwgTWF0aC5tYXgoIE1hdGgubWF4KCBhLnksIGIueSApLCBjLnkgKSApO1xyXG4gICAgICAgICAgICBtYXgueiA9IE1hdGgubWF4KCBtYXgueiwgTWF0aC5tYXgoIE1hdGgubWF4KCBhLnosIGIueiApLCBjLnogKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtaW46IG1pbixcclxuICAgICAgICAgICAgbWF4OiBtYXhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0cyBhIHRyaWFuZ2xlIGludG8gdGhlIG9jdHJlZXMgY2hpbGQgZGVwZW5kaW5nIG9uIGl0cyBwb3NpdGlvblxyXG4gICAgICogd2l0aGluIHRoZSBub2RlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2N0cmVlfSBvY3RyZWUgLSBUaGUgb2N0cmVlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gaW5kZXggLSBUaGUgY2hpbGQgaW5kZXggZnJvbSAwLTdcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmlhbmdsZSAtIFRoZSB0cmlhbmdsZSBvYmplY3QgdG8gYmUgaW5zZXJ0ZWQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluc2VydEludG9DaGlsZCggb2N0cmVlLCBpbmRleCwgdHJpYW5nbGUgKSB7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IG5ldyBWZWMzKCAwLCAwLCAwICksXHJcbiAgICAgICAgICAgIHN0ZXA7XHJcbiAgICAgICAgaWYgKCBvY3RyZWUuY2hpbGRyZW5bIGluZGV4IF0gKSB7XHJcbiAgICAgICAgICAgIC8vIGNoaWxkIGFscmVhZHkgZXhpc3RzLCByZWN1cnNpdmVseSBpbnNlcnRcclxuICAgICAgICAgICAgb2N0cmVlLmNoaWxkcmVuWyBpbmRleCBdLmluc2VydCggdHJpYW5nbGUgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjaGlsZCBkb2VzIG5vdCBleGlzdFxyXG4gICAgICAgICAgICAvLyBpZiB0ZXJtaW5hbCBkZXB0aCBoYXMgbm90IGJlZW4gcmVhY2hlZCwgY3JlYXRlIGNoaWxkIG5vZGVcclxuICAgICAgICAgICAgaWYgKCBvY3RyZWUuZGVwdGggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgc3RlcCA9IG9jdHJlZS5oYWxmV2lkdGggLyAyO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0LnggPSAoIChpbmRleCAmIDEpID8gc3RlcCA6IC1zdGVwICk7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQueSA9ICggKGluZGV4ICYgMikgPyBzdGVwIDogLXN0ZXAgKTtcclxuICAgICAgICAgICAgICAgIG9mZnNldC56ID0gKCAoaW5kZXggJiA0KSA/IHN0ZXAgOiAtc3RlcCApO1xyXG4gICAgICAgICAgICAgICAgLy8gcGFzcyBudWxsIHRyaWFuZ2xlcyBhcmcgdG8gZm9yY2UgZWxzZSBpbiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgb2N0cmVlLmNoaWxkcmVuWyBpbmRleCBdID0gbmV3IE9jdHJlZSggbnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgY2VudGVyOiBvY3RyZWUuY2VudGVyLmFkZCggb2Zmc2V0ICksXHJcbiAgICAgICAgICAgICAgICAgICBoYWxmV2lkdGg6IHN0ZXAsXHJcbiAgICAgICAgICAgICAgICAgICBkZXB0aCA6IG9jdHJlZS5kZXB0aC0xXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG9jdHJlZS5jaGlsZHJlblsgaW5kZXggXS5pbnNlcnQoIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gYSBwb2ludCBhbmRcclxuICAgICAqIGFuIG9jdHJlZSdzIGNoaWxkJ3MgQUFCQi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09jdHJlZX0gb2N0cmVlIC0gVGhlIG9jdHJlZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gbWVhc3VyZSBmcm9tLlxyXG4gICAgICogQHBhcmFtIHtpbnRlZ2VyfSBjaGlsZCAtIFRoZSBBQUJCIGNoaWxkIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzcXVhcmVkIGRpc3RhbmNlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzcXJEaXN0RnJvbVBvaW50KCBvY3RyZWUsIHBvaW50LCBjaGlsZCApIHtcclxuICAgICAgICAvLyBzaGlmdCBBQUJCIGRpbWVzaW9ucyBiYXNlZCBvbiB3aGljaCBjaGlsZCBjZWxsIGlzIGJlZ2luIHRlc3RlZFxyXG4gICAgICAgIHZhciBvZmZzZXRDZW50ZXIgPSBuZXcgVmVjMyggb2N0cmVlLmNlbnRlciApLFxyXG4gICAgICAgICAgICBzdGVwID0gb2N0cmVlLmhhbGZXaWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHNxckRpc3QgPSAwLFxyXG4gICAgICAgICAgICBtaW5BQUJCLFxyXG4gICAgICAgICAgICBtYXhBQUJCO1xyXG4gICAgICAgIG9mZnNldENlbnRlci54ICs9ICggKGNoaWxkICYgMSkgPyBzdGVwIDogLXN0ZXAgKTtcclxuICAgICAgICBvZmZzZXRDZW50ZXIueSArPSAoIChjaGlsZCAmIDIpID8gc3RlcCA6IC1zdGVwICk7XHJcbiAgICAgICAgb2Zmc2V0Q2VudGVyLnogKz0gKCAoY2hpbGQgJiA0KSA/IHN0ZXAgOiAtc3RlcCApO1xyXG4gICAgICAgIG1pbkFBQkIgPSBuZXcgVmVjMyhcclxuICAgICAgICAgICAgb2Zmc2V0Q2VudGVyLnggLSBzdGVwLFxyXG4gICAgICAgICAgICBvZmZzZXRDZW50ZXIueSAtIHN0ZXAsXHJcbiAgICAgICAgICAgIG9mZnNldENlbnRlci56IC0gc3RlcCApO1xyXG4gICAgICAgIG1heEFBQkIgPSBuZXcgVmVjMyhcclxuICAgICAgICAgICAgb2Zmc2V0Q2VudGVyLnggKyBzdGVwLFxyXG4gICAgICAgICAgICBvZmZzZXRDZW50ZXIueSArIHN0ZXAsXHJcbiAgICAgICAgICAgIG9mZnNldENlbnRlci56ICsgc3RlcCApO1xyXG4gICAgICAgIC8vIEZvciBlYWNoIGF4aXMgY291bnQgYW55IGV4Y2VzcyBkaXN0YW5jZSBvdXRzaWRlIGJveCBleHRlbnRzXHJcbiAgICAgICAgLy8geFxyXG4gICAgICAgIGlmIChwb2ludC54IDwgbWluQUFCQi54KSB7IHNxckRpc3QgKz0gKG1pbkFBQkIueCAtIHBvaW50LngpICogKG1pbkFBQkIueCAtIHBvaW50LngpOyB9XHJcbiAgICAgICAgaWYgKHBvaW50LnggPiBtYXhBQUJCLngpIHsgc3FyRGlzdCArPSAocG9pbnQueCAtIG1heEFBQkIueCkgKiAocG9pbnQueCAtIG1heEFBQkIueCk7IH1cclxuICAgICAgICAvLyB5XHJcbiAgICAgICAgaWYgKHBvaW50LnkgPCBtaW5BQUJCLnkpIHsgc3FyRGlzdCArPSAobWluQUFCQi55IC0gcG9pbnQueSkgKiAobWluQUFCQi55IC0gcG9pbnQueSk7IH1cclxuICAgICAgICBpZiAocG9pbnQueSA+IG1heEFBQkIueSkgeyBzcXJEaXN0ICs9IChwb2ludC55IC0gbWF4QUFCQi55KSAqIChwb2ludC55IC0gbWF4QUFCQi55KTsgfVxyXG4gICAgICAgIC8vIHpcclxuICAgICAgICBpZiAocG9pbnQueiA8IG1pbkFBQkIueikgeyBzcXJEaXN0ICs9IChtaW5BQUJCLnogLSBwb2ludC56KSAqIChtaW5BQUJCLnogLSBwb2ludC56KTsgfVxyXG4gICAgICAgIGlmIChwb2ludC56ID4gbWF4QUFCQi56KSB7IHNxckRpc3QgKz0gKHBvaW50LnogLSBtYXhBQUJCLnopICogKHBvaW50LnogLSBtYXhBQUJCLnopOyB9XHJcbiAgICAgICAgcmV0dXJuIHNxckRpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhIHNwaGVyZSBkZWZpbmVkIGJ5IGEgcG9pbnQgYW5kIHJhZGl1cyBpbnRlcnNlY3RzIGFuIG9jdHJlZSdzXHJcbiAgICAgKiBjaGlsZCdzIEFBQkIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPY3RyZWV9IG9jdHJlZSAtIFRoZSBvY3RyZWUgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNlbnRlciAtIFRoZSBjZW50ZXIgb2YgdGhlIHNwaGVyZSB0byBtZWFzdXJlIGZyb20uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgc3BoZXJlLlxyXG4gICAgICogQHBhcmFtIHtpbnRlZ2VyfSBjaGlsZCAtIFRoZSBBQUJCIGNoaWxkIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpbnRlcmVjdHMgdGhlIEFBQkIgY2hpbGQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNwaGVyZUNoZWNrKCBvY3RyZWUsIGNlbnRlciwgcmFkaXVzLCBjaGlsZCApIHtcclxuICAgICAgICAvLyBjb21wdXRlIHNxdWFyZWQgZGlzdGFuY2UgYmV0d2VlbiBzcGhlcmUgY2VudHJlIGFuZCBBQUJCXHJcbiAgICAgICAgdmFyIGRpc3QgPSBzcXJEaXN0RnJvbVBvaW50KCBvY3RyZWUsIGNlbnRlciwgY2hpbGQgKTtcclxuICAgICAgICAvLyBzcGhlcmUgYW5kIEFBQkIgaW50ZXJzZWN0IGlmIHRoZSBkaXN0YW5jZSBpcyBsZXNzIHRoYW4gdGhlIHJhZGl1c1xyXG4gICAgICAgIHJldHVybiBkaXN0IDw9IHJhZGl1cypyYWRpdXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBzaW5nbGV0b24gY3ViZSBNZXNoIG9iamVjdCBmb3IgdGhlIG9jdHJlZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TWVzaH0gVGhlIHNpbmdsZXRvbiBjdWJlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRDdWJlTWVzaCgpIHtcclxuICAgICAgICBpZiAoICFfY3ViZSApIHtcclxuICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyBmcm9udCBmYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgWyAtMSwgLTEsIDEgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIDEsIC0xLCAxIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAxLCAxLCAxIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAtMSwgMSwgMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhY2sgZmFjZVxyXG4gICAgICAgICAgICAgICAgICAgIFsgLTEsIC0xLCAtMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgMSwgLTEsIC0xIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAxLCAxLCAtMSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsgLTEsIDEsIC0xIF1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGZyb250XHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMSwgMSwgMiwgMiwgMywgMywgMCxcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgIDAsIDQsIDEsIDUsIDIsIDYsIDMsIDcsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIDQsIDUsIDUsIDYsIDYsIDcsIDcsIDRcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIF9jdWJlID0gbmV3IE1lc2goe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiBpbmRpY2VzLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IFwiTElORVNcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF9jdWJlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGVzIGFuIGFycmF5IG9mIEVudGl0eSBvYmplY3RzIHdpdGggYSBNZXNoIGNvbXBvbmVudCBmb3IgdGhlXHJcbiAgICAgKiBvY3RyZWUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPY3RyZWV9IG9jdHJlZSAtIFRoZSBvY3RyZWUgb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IG9mIGVudGl0aWVzLlxyXG4gICAgICovXHJcbiAgIGZ1bmN0aW9uIGdlbmVyYXRlU3ViRW50aXRpZXMoIG9jdHJlZSApIHtcclxuICAgICAgICB2YXIgZW50aXRpZXMgPSBbXSxcclxuICAgICAgICAgICAgY291bnQgPSAwLFxyXG4gICAgICAgICAgICBlbnRpdHksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gY3JlYXRlIGVudGl0eSBmb3Igb2N0cmVlXHJcbiAgICAgICAgZW50aXR5ID0gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgIG1lc2hlczogWyBnZXRDdWJlTWVzaCgpIF0sXHJcbiAgICAgICAgICAgIG9yaWdpbjogb2N0cmVlLmNlbnRlcixcclxuICAgICAgICAgICAgc2NhbGU6IG9jdHJlZS5oYWxmV2lkdGhcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBjaGlsZFxyXG4gICAgICAgIGZvciAoIGk9MDsgaTw4OyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIGNoaWxkIGV4aXN0c1xyXG4gICAgICAgICAgICBpZiAoIG9jdHJlZS5jaGlsZHJlbltpXSApIHtcclxuICAgICAgICAgICAgICAgIGVudGl0aWVzID0gZW50aXRpZXMuY29uY2F0KFxyXG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlU3ViRW50aXRpZXMoIG9jdHJlZS5jaGlsZHJlbltpXSApICk7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIG9ubHkgY3JlYXRlIGlmIHRoaXMgb2N0cmVlIGNvbnRhaW5zIG9iamVjdHMsIG9yIGhhcyBjaGlsZHJlbiB0aGF0XHJcbiAgICAgICAgLy8gY29udGFpbiBvYmplY3RzXHJcbiAgICAgICAgaWYgKCBvY3RyZWUuY29udGFpbmVkLmxlbmd0aCA+IDAgfHwgY291bnQgPiAwICkge1xyXG4gICAgICAgICAgICBlbnRpdGllcy5wdXNoKCBuZXcgRW50aXR5KHtcclxuICAgICAgICAgICAgICAgIG1lc2hlczogWyBnZXRDdWJlTWVzaCgpIF0sXHJcbiAgICAgICAgICAgICAgICBvcmlnaW46IG9jdHJlZS5jZW50ZXIsXHJcbiAgICAgICAgICAgICAgICBzY2FsZTogb2N0cmVlLmhhbGZXaWR0aFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBhbmQgcmV0dXJuIGVudGl0eVxyXG4gICAgICAgIHJldHVybiBlbnRpdGllcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgdGhhdCB0aGUgcHJvdmlkZWQgdHJpYW5nbGVzIGFyZSBvZiB0eXBlIFRyaWFuZ2xlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRyaWFuZ2xlcyAtIFRoZSBhcnJheSBvZiB0cmlhbmdsZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgb2YgVHJpYW5nbGUgb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGFyc2VUcmlhbmdsZXMoIHRyaWFuZ2xlcyApIHtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8dHJpYW5nbGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBpZiAoICEoIHRyaWFuZ2xlc1tpXSBpbnN0YW5jZW9mIFRyaWFuZ2xlICkgKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXNbaV0gPSBuZXcgVHJpYW5nbGUoIHRyaWFuZ2xlc1tpXS5wb3NpdGlvbnMgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJpYW5nbGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIE9jdHJlZSggdHJpYW5nbGVzLCBvcHRpb25zICkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIGlmICggdHJpYW5nbGVzICkge1xyXG4gICAgICAgICAgICAvLyBpZiB0cmlhbmdsZXMgYXJlIGdpdmVuLCBidWlsZCB0aGUgb2N0cmVlXHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGQoIHRyaWFuZ2xlcywgb3B0aW9ucy5kZXB0aCB8fCBERUZBVUxUX0RFUFRIICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZWxzZSBjYXNlIGlzIGZvciByZWN1cnNpb24gZHVyaW5nIGJ1aWxkaW5nXHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyID0gb3B0aW9ucy5jZW50ZXI7XHJcbiAgICAgICAgICAgIHRoaXMuaGFsZldpZHRoID0gb3B0aW9ucy5oYWxmV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuZGVwdGggPSBvcHRpb25zLmRlcHRoO1xyXG4gICAgICAgICAgICAvLyBjYWxsIGNsZWFyIHRvIGluaXRpYWxpemUgYXR0cmlidXRlc1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGRzIHRoZSBvY3RyZWUgZnJvbSBhbiBhcnJheSBvZiB0cmlhbmdsZXMgdG8gYSBzcGVjaWZpZWQgZGVwdGguXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdHJpYW5nbGVzIC0gVGhlIGFycmF5IG9mIHRyaWFuZ2xlcyB0byBjb250YWluLlxyXG4gICAgICogQHBhcmFtIHtpbnRlZ2VyfSBkZXB0aCAtIFRoZSBsZXZlbHMgb2YgZGVwdGggZm9yIHRoZSBvY3RyZWUuXHJcbiAgICAgKi9cclxuICAgIE9jdHJlZS5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiggdHJpYW5nbGVzLCBkZXB0aCApIHtcclxuICAgICAgICB2YXIgbW0sXHJcbiAgICAgICAgICAgIG1pbkRpZmYsXHJcbiAgICAgICAgICAgIG1heERpZmYsXHJcbiAgICAgICAgICAgIGxhcmdlc3RNaW4sXHJcbiAgICAgICAgICAgIGxhcmdlc3RNYXgsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gY29udmVydCB0cmlhbmdsZXMgaW50byBwcm9wZXIgZm9ybWF0IGlmIG5lZWQgYmVcclxuICAgICAgICB0cmlhbmdsZXMgPSBwYXJzZVRyaWFuZ2xlcyggdHJpYW5nbGVzICk7XHJcbiAgICAgICAgLy8gZ2V0IG1pbiBtYXggZXh0ZW50c1xyXG4gICAgICAgIG1tID0gbWluTWF4KCB0cmlhbmdsZXMgKTtcclxuICAgICAgICAvLyBjYWxsIGNsZWFyIHRvIGluaXRpYWxpemUgYXR0cmlidXRlc1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICAvLyBjZW50cmUgcG9pbnQgb2Ygb2N0cmVlXHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBtbS5taW4uYWRkKCBtbS5tYXggKS5kaXYoIDIgKTtcclxuICAgICAgICB0aGlzLmRlcHRoID0gZGVwdGggfHwgREVGQVVMVF9ERVBUSDtcclxuICAgICAgICAvLyBmaW5kIGxhcmdlc3QgZGlzdGFuY2UgY29tcG9uZW50LCBiZWNvbWVzIGhhbGYgd2lkdGhcclxuICAgICAgICBtaW5EaWZmID0gbW0ubWluLnN1YiggdGhpcy5jZW50ZXIgKTtcclxuICAgICAgICBtYXhEaWZmID0gbW0ubWF4LnN1YiggdGhpcy5jZW50ZXIgKTtcclxuICAgICAgICBsYXJnZXN0TWluID0gTWF0aC5tYXgoXHJcbiAgICAgICAgICAgIE1hdGguYWJzKCBtaW5EaWZmLnggKSxcclxuICAgICAgICAgICAgTWF0aC5tYXgoIE1hdGguYWJzKCBtaW5EaWZmLnkgKSxcclxuICAgICAgICAgICAgTWF0aC5hYnMoIG1pbkRpZmYueiApICkgKTtcclxuICAgICAgICBsYXJnZXN0TWF4ID0gTWF0aC5tYXgoXHJcbiAgICAgICAgICAgIE1hdGguYWJzKCBtYXhEaWZmLnggKSxcclxuICAgICAgICAgICAgTWF0aC5tYXgoIE1hdGguYWJzKCBtYXhEaWZmLnkgKSxcclxuICAgICAgICAgICAgTWF0aC5hYnMoIG1heERpZmYueiApICkgKTtcclxuICAgICAgICAvLyBoYWxmIHdpZHRoIG9mIG9jdHJlZSBjZWxsXHJcbiAgICAgICAgdGhpcy5oYWxmV2lkdGggPSBNYXRoLm1heCggbGFyZ2VzdE1pbiwgbGFyZ2VzdE1heCApO1xyXG4gICAgICAgIC8vIGluc2VydCB0cmlhbmdsZXMgaW50byBvY3RyZWVcclxuICAgICAgICBmb3IgKCBpPTA7IGk8dHJpYW5nbGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydCggdHJpYW5nbGVzW2ldICk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyBhbmQgaW5pdGlhbGl6ZXMgdGhlIG9jdHJlZS5cclxuICAgICAqL1xyXG4gICAgT2N0cmVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZW50aXR5ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lZCA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXHJcbiAgICAgICAgICAgIG51bGwsIG51bGwsIG51bGwsIG51bGwsXHJcbiAgICAgICAgICAgIG51bGwsIG51bGwsIG51bGwsIG51bGwgXTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYSB0cmlhbmdsZSBpbnRvIHRoZSBvY3RyZWUgc3RydWN0dXJlLiBUaGlzIG1ldGhvZCB3aXRoIHJlY3Vyc2l2ZWx5XHJcbiAgICAgKiBpbnNlcnQgaXQgaW50byBjaGlsZCBub2RlcyB0byB0aGUgZGVwdGggb2YgdGhlIHRyZWUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRyaWFuZ2xlIC0gVGhlIHRyaWFuZ2xlIHRvIGJlIGluc2VydGVkIGludG8gdGhlIG9jdHJlZS5cclxuICAgICAqL1xyXG4gICAgT2N0cmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiggdHJpYW5nbGUgKSB7XHJcbiAgICAgICAgdmFyIGNlbnRyb2lkID0gdHJpYW5nbGUuY2VudHJvaWQoKSxcclxuICAgICAgICAgICAgcmFkaXVzID0gdHJpYW5nbGUucmFkaXVzKCksXHJcbiAgICAgICAgICAgIC8vIGRpc3RhbmNlIGZyb20gZWFjaCBheGlzXHJcbiAgICAgICAgICAgIGR4ID0gY2VudHJvaWQueCAtIHRoaXMuY2VudGVyLngsXHJcbiAgICAgICAgICAgIGR5ID0gY2VudHJvaWQueSAtIHRoaXMuY2VudGVyLnksXHJcbiAgICAgICAgICAgIGR6ID0gY2VudHJvaWQueiAtIHRoaXMuY2VudGVyLnosXHJcbiAgICAgICAgICAgIGNoaWxkO1xyXG4gICAgICAgIC8vIG9ubHkgYWRkIHRyaWFuZ2xlIGlmIGxlYWYgbm9kZVxyXG4gICAgICAgIGlmICggdGhpcy5kZXB0aCA9PT0gMCApIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZWQucHVzaCggdHJpYW5nbGUgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgZGlzdGFuY2UgaXMgbGVzcyB0aGFuIHJhZGl1cywgdGhlbiB0aGUgdHJpYW5nbGUgc3RyYWRkbGVzIGFcclxuICAgICAgICAvLyBib3VuZGFyeVxyXG4gICAgICAgIGlmICggTWF0aC5hYnMoIGR4ICkgPCByYWRpdXMgfHxcclxuICAgICAgICAgICAgIE1hdGguYWJzKCBkeSApIDwgcmFkaXVzIHx8XHJcbiAgICAgICAgICAgICBNYXRoLmFicyggZHogKSA8IHJhZGl1cyApIHtcclxuICAgICAgICAgICAgLy8gc3RyYWRkbGVzIGEgYm91bmRhcnkgdHJ5IHRvIGFkZCB0byBpbnRlcnNlY3RlZCBjaGlsZHJlblxyXG4gICAgICAgICAgICBmb3IgKCBjaGlsZD0wOyBjaGlsZDw4OyBjaGlsZCsrICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgdHJpYW5nbGUgYm91bmRpbmcgc3BoZXJlIGludGVyc2VjdHMgdGhpcyBjaGlsZFxyXG4gICAgICAgICAgICAgICAgaWYgKCBzcGhlcmVDaGVjayggdGhpcywgY2VudHJvaWQsIHJhZGl1cywgY2hpbGQgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBwYXJ0IG9mIGJvdW5kaW5nIHNwaGVyZSBpbnRlcnNlY3RzIGNoaWxkLCBpbnNlcnRcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRJbnRvQ2hpbGQoIHRoaXMsIGNoaWxkLCB0cmlhbmdsZSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZnVsbHkgY29udGFpbmVkIGluIGEgc2luZ2xlIGNoaWxkLCBmaW5kIGNoaWxkIGluZGV4XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSAwLTcgaW5kZXggb2YgdGhlIGNoaWxkLCBkZXRlcm1pbmVkIHVzaW5nIGJpdCB3aXNlXHJcbiAgICAgICAgICAgIC8vIGFkZGl0aW9uXHJcbiAgICAgICAgICAgIGNoaWxkID0gMDtcclxuICAgICAgICAgICAgaWYgKCBkeCA+IDAgKSB7IGNoaWxkICs9IDE7IH1cclxuICAgICAgICAgICAgaWYgKCBkeSA+IDAgKSB7IGNoaWxkICs9IDI7IH1cclxuICAgICAgICAgICAgaWYgKCBkeiA+IDAgKSB7IGNoaWxkICs9IDQ7IH1cclxuICAgICAgICAgICAgaW5zZXJ0SW50b0NoaWxkKCB0aGlzLCBjaGlsZCwgdHJpYW5nbGUgKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGUgYW5kIHJldHVybiBhbiByZW5kZXJhYmxlIGVudGl0eSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBvY3RyZWVcclxuICAgICAqIHN0cnVjdHVyZS4gU2hhcmVzIGEgc2luZ2xlIGdsb2JhbCBtZXNoIGluc3RhbmNlIGZvciBhbGwgbm9kZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSAtIFRoZSBhcnJheSBvZiBtZXNoIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgT2N0cmVlLnByb3RvdHlwZS5nZXRFbnRpdHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoICF0aGlzLmVudGl0eSApIHtcclxuICAgICAgICAgICAgdGhpcy5lbnRpdHkgPSBuZXcgRW50aXR5KHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBnZW5lcmF0ZVN1YkVudGl0aWVzKCB0aGlzIClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0eTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBPY3RyZWU7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2VzIHRoZSBlbnRpdHkgaGllcmFyY2h5IGRlcHRoLWZpcnN0IGFuZCBleGVjdXRlcyB0aGVcclxuICAgICAqIGZvckVhY2ggZnVuY3Rpb24gb24gZWFjaCBlbnRpdHkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAtIFRoZSBFbnRpdHkgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm9yRWFjaEVudGl0eSAtIFRoZSBSZW5kZXJQYXNzIGZvckVhY2hFbnRpdHkgZnVuY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmb3JFYWNoTWVzaCAtIFRoZSBSZW5kZXJQYXNzIGZvckVhY2hNZXNoIGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm9yRWFjaFNwcml0ZSAtIFRoZSBSZW5kZXJQYXNzIGZvckVhY2hTcHJpdGUgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZvckVhY2hSZWN1cnNpdmUoIGVudGl0eSwgZm9yRWFjaEVudGl0eSwgZm9yRWFjaE1lc2gsIGZvckVhY2hTcHJpdGUgKSB7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggZW50aXR5XHJcbiAgICAgICAgaWYgKCBmb3JFYWNoRW50aXR5ICkge1xyXG4gICAgICAgICAgICBmb3JFYWNoRW50aXR5KCBlbnRpdHkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggbWVzaFxyXG4gICAgICAgIGlmICggZm9yRWFjaE1lc2ggJiYgZW50aXR5Lm1lc2hlcyApIHtcclxuICAgICAgICAgICAgZW50aXR5Lm1lc2hlcy5mb3JFYWNoKCBmdW5jdGlvbiggbWVzaCApIHtcclxuICAgICAgICAgICAgICAgIGZvckVhY2hNZXNoKCBtZXNoLCBlbnRpdHkgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciBlYWNoIHNwcml0ZVxyXG4gICAgICAgIGlmICggZm9yRWFjaFNwcml0ZSAmJiBlbnRpdHkuc3ByaXRlcyApIHtcclxuICAgICAgICAgICAgZW50aXR5LnNwcml0ZXMuZm9yRWFjaCggZnVuY3Rpb24oIHNwcml0ZSApIHtcclxuICAgICAgICAgICAgICAgIGZvckVhY2hTcHJpdGUoIHNwcml0ZSwgZW50aXR5ICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkZXB0aCBmaXJzdCB0cmF2ZXJzYWxcclxuICAgICAgICBlbnRpdHkuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkICkge1xyXG4gICAgICAgICAgICBmb3JFYWNoUmVjdXJzaXZlKCBjaGlsZCwgZm9yRWFjaEVudGl0eSwgZm9yRWFjaE1lc2gsIGZvckVhY2hTcHJpdGUgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBSZW5kZXJQYXNzKCBzcGVjICkge1xyXG4gICAgICAgIGlmICggdHlwZW9mIHNwZWMgPT09ICdvYmplY3QnICkge1xyXG4gICAgICAgICAgICB0aGlzLmJlZm9yZSA9IHNwZWMuYmVmb3JlIHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaEVudGl0eSA9IHNwZWMuZm9yRWFjaEVudGl0eSB8fCBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmZvckVhY2hNZXNoID0gc3BlYy5mb3JFYWNoTWVzaCB8fCBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmZvckVhY2hTcHJpdGUgPSBzcGVjLmZvckVhY2hTcHJpdGUgfHwgbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5hZnRlciA9IHNwZWMuYWZ0ZXIgfHwgbnVsbDtcclxuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2Ygc3BlYyA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICAgICAgdGhpcy5iZWZvcmUgPSBzcGVjO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBSZW5kZXJQYXNzLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oIGNhbWVyYSwgZW50aXRpZXMgKSB7XHJcbiAgICAgICAgdmFyIGJlZm9yZSA9IHRoaXMuYmVmb3JlLFxyXG4gICAgICAgICAgICBmb3JFYWNoRW50aXR5ID0gdGhpcy5mb3JFYWNoRW50aXR5LFxyXG4gICAgICAgICAgICBmb3JFYWNoTWVzaCA9IHRoaXMuZm9yRWFjaE1lc2gsXHJcbiAgICAgICAgICAgIGZvckVhY2hTcHJpdGUgPSB0aGlzLmZvckVhY2hTcHJpdGUsXHJcbiAgICAgICAgICAgIGFmdGVyID0gdGhpcy5hZnRlcjtcclxuICAgICAgICAvLyBzZXR1cCBmdW5jdGlvblxyXG4gICAgICAgIGlmICggYmVmb3JlICkge1xyXG4gICAgICAgICAgICBiZWZvcmUoIGNhbWVyYSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZW5kZXJpbmcgZnVuY3Rpb25zXHJcbiAgICAgICAgZW50aXRpZXMuZm9yRWFjaCggZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgaWYgKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JFYWNoUmVjdXJzaXZlKFxyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eSxcclxuICAgICAgICAgICAgICAgICAgICBmb3JFYWNoRW50aXR5LFxyXG4gICAgICAgICAgICAgICAgICAgIGZvckVhY2hNZXNoLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvckVhY2hTcHJpdGUgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHRlYXJkb3duIGZ1bmN0aW9uXHJcbiAgICAgICAgaWYgKCBhZnRlciApIHtcclxuICAgICAgICAgICAgYWZ0ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gUmVuZGVyUGFzcztcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUmVuZGVyVGVjaG5pcXVlKCBzcGVjICkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBzcGVjLmlkO1xyXG4gICAgICAgIHRoaXMucGFzc2VzID0gc3BlYy5wYXNzZXMgfHwgW107XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgUmVuZGVyVGVjaG5pcXVlLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oIGNhbWVyYSwgZW50aXRpZXMgKSB7XHJcbiAgICAgICAgdGhpcy5wYXNzZXMuZm9yRWFjaCggZnVuY3Rpb24oIHBhc3MgKSB7XHJcbiAgICAgICAgICAgIHBhc3MuZXhlY3V0ZSggY2FtZXJhLCBlbnRpdGllcyApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlclRlY2huaXF1ZTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFZlcnRleFBhY2thZ2UgPSByZXF1aXJlKCcuLi9jb3JlL1ZlcnRleFBhY2thZ2UnKSxcclxuICAgICAgICBWZXJ0ZXhCdWZmZXIgPSByZXF1aXJlKCcuLi9jb3JlL1ZlcnRleEJ1ZmZlcicpLFxyXG4gICAgICAgIEluZGV4QnVmZmVyID0gcmVxdWlyZSgnLi4vY29yZS9JbmRleEJ1ZmZlcicpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlVmVydGV4QXR0cmlidXRlcyggc3BlYyApIHtcclxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG4gICAgICAgIGlmICggc3BlYy5wb3NpdGlvbnMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy5wb3NpdGlvbnMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLm5vcm1hbHMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy5ub3JtYWxzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy51dnMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy51dnMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLnRhbmdlbnRzICkge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goIHNwZWMudGFuZ2VudHMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLmJpdGFuZ2VudHMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy5iaXRhbmdlbnRzICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggc3BlYy5jb2xvcnMgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCggc3BlYy5jb2xvcnMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLmpvaW50cyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLmpvaW50cyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHNwZWMud2VpZ2h0cyApIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCBzcGVjLndlaWdodHMgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gUmVuZGVyYWJsZSggc3BlYyApIHtcclxuICAgICAgICBzcGVjID0gc3BlYyB8fCB7fTtcclxuICAgICAgICBpZiAoIHNwZWMudmVydGV4QnVmZmVyIHx8IHNwZWMudmVydGV4QnVmZmVycyApIHtcclxuICAgICAgICAgICAgLy8gdXNlIGV4aXN0aW5nIHZlcnRleCBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gc3BlYy52ZXJ0ZXhCdWZmZXJzIHx8IFsgc3BlYy52ZXJ0ZXhCdWZmZXIgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgdmVydGV4IHBhY2thZ2VcclxuICAgICAgICAgICAgdmFyIHZlcnRleFBhY2thZ2UgPSBuZXcgVmVydGV4UGFja2FnZSggcGFyc2VWZXJ0ZXhBdHRyaWJ1dGVzKCBzcGVjICkgKTtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBidWZmZXJcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gWyBuZXcgVmVydGV4QnVmZmVyKCB2ZXJ0ZXhQYWNrYWdlICkgXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBzcGVjLmluZGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZXhpc3RpbmcgaW5kZXggYnVmZmVyXHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBzcGVjLmluZGV4QnVmZmVyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICggc3BlYy5pbmRpY2VzICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGluZGV4IGJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlciggc3BlYy5pbmRpY2VzLCBzcGVjLm9wdGlvbnMgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBSZW5kZXJhYmxlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcbiAgICAgICAgaWYgKCB0aGlzLmluZGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAvLyB1c2UgaW5kZXggYnVmZmVyIHRvIGRyYXcgZWxlbWVudHNcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzLmZvckVhY2goIGZ1bmN0aW9uKCB2ZXJ0ZXhCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuYmluZCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gbm8gYWR2YW50YWdlIHRvIHVuYmluZGluZyBhcyB0aGVyZSBpcyBubyBzdGFjayB1c2VkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmJpbmQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlci5kcmF3KCBvcHRpb25zICk7XHJcbiAgICAgICAgICAgIC8vIG5vIGFkdmFudGFnZSB0byB1bmJpbmRpbmcgYXMgdGhlcmUgaXMgbm8gc3RhY2sgdXNlZFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIG5vIGluZGV4IGJ1ZmZlciwgdXNlIGRyYXcgYXJyYXlzXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGV4QnVmZmVyICkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLmJpbmQoKTtcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5kcmF3KCBvcHRpb25zLmNvdW50LCBvcHRpb25zICk7XHJcbiAgICAgICAgICAgICAgICAvLyBubyBhZHZhbnRhZ2UgdG8gdW5iaW5kaW5nIGFzIHRoZXJlIGlzIG5vIHN0YWNrIHVzZWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmFibGU7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFJlbmRlcmVyKCB0ZWNobmlxdWVzICkge1xyXG4gICAgICAgIGlmICggISggdGVjaG5pcXVlcyBpbnN0YW5jZW9mIEFycmF5ICkgKSB7XHJcbiAgICAgICAgICAgIHRlY2huaXF1ZXMgPSBbIHRlY2huaXF1ZXMgXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50ZWNobmlxdWVzID0gdGVjaG5pcXVlcyB8fCBbXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oIGNhbWVyYSwgZW50aXRpZXNCeVRlY2huaXF1ZSApIHtcclxuICAgICAgICB0aGlzLnRlY2huaXF1ZXMuZm9yRWFjaCggZnVuY3Rpb24oIHRlY2huaXF1ZSApIHtcclxuICAgICAgICAgICAgdmFyIGVudGl0aWVzID0gZW50aXRpZXNCeVRlY2huaXF1ZVsgdGVjaG5pcXVlLmlkIF07XHJcbiAgICAgICAgICAgIGlmICggZW50aXRpZXMgJiYgZW50aXRpZXMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHRlY2huaXF1ZS5leGVjdXRlKCBjYW1lcmEsIGVudGl0aWVzICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIE1hdDQ0ID0gcmVxdWlyZSgnYWxmYWRvcicpLk1hdDQ0O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEpvaW50Q291bnQoIGpvaW50c0J5SWQsIGpvaW50cyApIHtcclxuICAgICAgICB2YXIgY291bnQgPSBqb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxqb2ludHMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGpvaW50c0J5SWRbIGpvaW50c1tpXS5pZCBdID0gam9pbnRzW2ldO1xyXG4gICAgICAgICAgICBjb3VudCArPSBnZXRKb2ludENvdW50KCBqb2ludHNCeUlkLCBqb2ludHNbaV0uY2hpbGRyZW4gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIFNrZWxldG9uKCB0aGF0ICkge1xyXG4gICAgICAgIC8vIHJvb3QgY2FuIGJlIGVpdGhlciBhIHNpbmdsZSBub2RlLCBvciBhbiBhcnJheSBvZiByb290IG5vZGVzXHJcbiAgICAgICAgdGhpcy5yb290ID0gKCB0aGF0LnJvb3QgaW5zdGFuY2VvZiBBcnJheSApID8gdGhhdC5yb290IDogWyB0aGF0LnJvb3QgXTtcclxuICAgICAgICB0aGlzLmJpbmRTaGFwZU1hdHJpeCA9IHRoYXQuYmluZFNoYXBlTWF0cml4IHx8IE1hdDQ0LmlkZW50aXR5KCk7XHJcbiAgICAgICAgdGhpcy5qb2ludHNCeUlkID0ge307XHJcbiAgICAgICAgdGhpcy5qb2ludENvdW50ID0gZ2V0Sm9pbnRDb3VudCggdGhpcy5qb2ludHNCeUlkLCB0aGlzLnJvb3QgKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBTa2VsZXRvbi5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYmluZFNoYXBlTWF0cml4ID0gdGhpcy5iaW5kU2hhcGVNYXRyaXgsXHJcbiAgICAgICAgICAgIGpvaW50c0J5SWQgPSB0aGlzLmpvaW50c0J5SWQsXHJcbiAgICAgICAgICAgIGFycmF5YnVmZmVyLFxyXG4gICAgICAgICAgICBza2lubmluZ01hdHJpeCxcclxuICAgICAgICAgICAgam9pbnQsXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICAvLyBhbGxvY2F0ZSBhcnJheWJ1ZmZlciB0byBzdG9yZSBhbGwgam9pbnQgbWF0cmljZXNcclxuICAgICAgICBhcnJheWJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoIG5ldyBBcnJheUJ1ZmZlciggNCoxNip0aGlzLmpvaW50Q291bnQgKSApO1xyXG4gICAgICAgIC8vIGZvciBlYWNoIGpvaW50LCBnZXQgdGhlIHNraW5uaW5nIG1hdHJpeFxyXG4gICAgICAgIGZvciAoIGtleSBpbiBqb2ludHNCeUlkICkge1xyXG4gICAgICAgICAgICBpZiAoIGpvaW50c0J5SWQuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgam9pbnQgPSBqb2ludHNCeUlkWyBrZXkgXTtcclxuICAgICAgICAgICAgICAgIHNraW5uaW5nTWF0cml4ID0gam9pbnQuc2tpbm5pbmdNYXRyaXgoIGJpbmRTaGFwZU1hdHJpeCApO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlidWZmZXIuc2V0KCBza2lubmluZ01hdHJpeC5kYXRhLCBqb2ludC5pbmRleCoxNiApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHJldHVybiBhcnJheSBhcyBhcnJheWJ1ZmZlciBvYmplY3RcclxuICAgICAgICByZXR1cm4gYXJyYXlidWZmZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gU2tlbGV0b247XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBSZW5kZXJhYmxlID0gcmVxdWlyZSgnLi9SZW5kZXJhYmxlJyksXHJcbiAgICAgICAgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0dlb21ldHJ5JyksXHJcbiAgICAgICAgU3ByaXRlQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9TcHJpdGVBbmltYXRpb24nKSxcclxuICAgICAgICBRdWFkID0gcmVxdWlyZSgnLi4vdXRpbC9zaGFwZXMvUXVhZCcpLFxyXG4gICAgICAgIF9nZW9tZXRyeSxcclxuICAgICAgICBfcmVuZGVyYWJsZTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRHZW9tZXRyeSgpIHtcclxuICAgICAgICBpZiAoICFfZ2VvbWV0cnkgKSB7XHJcbiAgICAgICAgICAgIF9nZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IFF1YWQucG9zaXRpb25zKCksXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiBRdWFkLmluZGljZXMoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF9nZW9tZXRyeTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJhYmxlKCkge1xyXG4gICAgICAgIGlmICggIV9yZW5kZXJhYmxlICkge1xyXG4gICAgICAgICAgICBfcmVuZGVyYWJsZSA9IG5ldyBSZW5kZXJhYmxlKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uczogUXVhZC5wb3NpdGlvbnMoKSxcclxuICAgICAgICAgICAgICAgIGluZGljZXM6IFF1YWQuaW5kaWNlcygpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3JlbmRlcmFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gU3ByaXRlKCBzcGVjICkge1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIHRoaXMucmVuZGVyYWJsZSA9IGdldFJlbmRlcmFibGUoKTtcclxuICAgICAgICB0aGlzLmdlb21ldHJ5ID0gZ2V0R2VvbWV0cnkoKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbnMgPSB7fTtcclxuICAgICAgICBpZiAoIHNwZWMuYW5pbWF0aW9ucyApIHtcclxuICAgICAgICAgICAgZm9yICggdmFyIGtleSBpbiBzcGVjLmFuaW1hdGlvbnMgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHNwZWMuYW5pbWF0aW9ucy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRBbmltYXRpb24oIGtleSwgc3BlYy5hbmltYXRpb25zWyBrZXkgXSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFNwcml0ZS5wcm90b3R5cGUuYWRkQW5pbWF0aW9uID0gZnVuY3Rpb24oIGFuaW1hdGlvbklkLCBhbmltYXRpb24gKSB7XHJcbiAgICAgICAgaWYgKCBhbmltYXRpb24gaW5zdGFuY2VvZiBTcHJpdGVBbmltYXRpb24gKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uc1sgYW5pbWF0aW9uSWQgXSA9IGFuaW1hdGlvbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbIGFuaW1hdGlvbklkIF0gPSBuZXcgU3ByaXRlQW5pbWF0aW9uKCBhbmltYXRpb24gKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIFNwcml0ZS5wcm90b3R5cGUuZ2V0RnJhbWUgPSBmdW5jdGlvbiggYW5pbWF0aW9uSWQsIHRpbWVzdGFtcCApIHtcclxuICAgICAgICB2YXIgYW5pbWF0aW9uID0gdGhpcy5hbmltYXRpb25zWyBhbmltYXRpb25JZCBdO1xyXG4gICAgICAgIGlmICggIWFuaW1hdGlvbiApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCAnQW5pbWF0aW9uIG9mIGlkXCInICsgYW5pbWF0aW9uSWQgKyAnXCIgZG9lcyBub3QgZXhpc3QsIHJldHVybmluZyBudWxsLicgKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbmltYXRpb24uZ2V0RnJhbWUoIHRpbWVzdGFtcCApO1xyXG4gICAgfTtcclxuXHJcbiAgICBTcHJpdGUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmFibGUuZHJhdygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0RnJhbWVUaW1lc3RhbXAoIGZyYW1lcywgZnJhbWVJbmRleCApIHtcclxuICAgICAgICB2YXIgZnJhbWUgPSBmcmFtZXNbIGZyYW1lSW5kZXggXTtcclxuICAgICAgICBpZiAoIGZyYW1lICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnJhbWUudGltZXN0YW1wIHx8ICggZnJhbWVJbmRleCAvIGZyYW1lcy5sZW5ndGggKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gU3ByaXRlQW5pbWF0aW9uKCBzcGVjICkge1xyXG4gICAgICAgIHNwZWMgPSBzcGVjIHx8IHt9O1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmZyYW1lcyA9IFtdO1xyXG4gICAgICAgIGlmICggc3BlYy5mcmFtZXMgKSB7XHJcbiAgICAgICAgICAgIHNwZWMuZnJhbWVzLmZvckVhY2goIGZ1bmN0aW9uKCBmcmFtZSApIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuYWRkRnJhbWUoIGZyYW1lICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNob3VsZExvb3AgPSBzcGVjLnNob3VsZExvb3AgIT09IHVuZGVmaW5lZCA/IHNwZWMuc2hvdWxkTG9vcCA6IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIFNwcml0ZUFuaW1hdGlvbi5wcm90b3R5cGUuYWRkRnJhbWUgPSBmdW5jdGlvbiggZnJhbWUgKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZnJhbWVzLnB1c2goe1xyXG4gICAgICAgICAgICBjaGFubmVsczogW10sXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcDogZnJhbWUudGltZXN0YW1wXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCBmcmFtZS5jaGFubmVscyApIHtcclxuICAgICAgICAgICAgZnJhbWUuY2hhbm5lbHMuZm9yRWFjaCggZnVuY3Rpb24oIGNoYW5uZWwgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmFkZENoYW5uZWwoIGNoYW5uZWwsIHRoYXQuZnJhbWVzLmxlbmd0aCAtIDEgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggZnJhbWUudGV4dHVyZSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGFubmVsKCBmcmFtZSwgdGhhdC5mcmFtZXMubGVuZ3RoIC0gMSApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgU3ByaXRlQW5pbWF0aW9uLnByb3RvdHlwZS5hZGRDaGFubmVsID0gZnVuY3Rpb24oIGNoYW5uZWwsIGZyYW1lSW5kZXggKSB7XHJcbiAgICAgICAgdGhpcy5mcmFtZXNbIGZyYW1lSW5kZXggXS5jaGFubmVscy5wdXNoKHtcclxuICAgICAgICAgICAgdGV4dHVyZTogY2hhbm5lbC50ZXh0dXJlLFxyXG4gICAgICAgICAgICB4OiBjaGFubmVsLnggIT09IHVuZGVmaW5lZCA/IGNoYW5uZWwueCA6IDAsXHJcbiAgICAgICAgICAgIHk6IGNoYW5uZWwueSAhPT0gdW5kZWZpbmVkID8gY2hhbm5lbC55IDogMCxcclxuICAgICAgICAgICAgd2lkdGg6IGNoYW5uZWwud2lkdGggIT09IHVuZGVmaW5lZCA/IGNoYW5uZWwud2lkdGggOiBjaGFubmVsLnRleHR1cmUud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogY2hhbm5lbC5oZWlnaHQgIT09IHVuZGVmaW5lZCA/IGNoYW5uZWwuaGVpZ2h0IDogY2hhbm5lbC50ZXh0dXJlLmhlaWdodCxcclxuICAgICAgICAgICAgb3JpZ2luOiB7XHJcbiAgICAgICAgICAgICAgICB4OiBjaGFubmVsLm9yaWdpbi54LFxyXG4gICAgICAgICAgICAgICAgeTogY2hhbm5lbC5vcmlnaW4ueVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmbGlwWDogY2hhbm5lbC5mbGlwWCAhPT0gdW5kZWZpbmVkID8gY2hhbm5lbC5mbGlwWCA6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZTogY2hhbm5lbC5zY2FsZSB8fCB7IHg6IDEsIHk6IDEgfSxcclxuICAgICAgICAgICAgcm90YXRpb246IGNoYW5uZWwucm90YXRpb24gIT09IHVuZGVmaW5lZCA/IGNoYW5uZWwucm90YXRpb24gOiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFNwcml0ZUFuaW1hdGlvbi5wcm90b3R5cGUuZ2V0RnJhbWUgPSBmdW5jdGlvbiggdGltZXN0YW1wICkge1xyXG4gICAgICAgIGlmICggdGhpcy5zaG91bGRMb29wICkge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXAgPSB0aW1lc3RhbXAgJSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZnJhbWVUaW1lc3RhbXAgPSBnZXRGcmFtZVRpbWVzdGFtcCggdGhpcy5mcmFtZXMsIDAgKSxcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKCBmcmFtZVRpbWVzdGFtcCAhPT0gbnVsbCAmJiBmcmFtZVRpbWVzdGFtcCA8PSB0aW1lc3RhbXAgKSB7XHJcbiAgICAgICAgICAgIGZyYW1lVGltZXN0YW1wID0gZ2V0RnJhbWVUaW1lc3RhbXAoIHRoaXMuZnJhbWVzLCArK2kgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJhbWVzWyBpIC0gMSBdO1xyXG4gICAgfTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNwcml0ZUFuaW1hdGlvbjtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gU3RhY2soKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiggdmFsdWUgKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goIHZhbHVlICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIFN0YWNrLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmRhdGEucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIFN0YWNrLnByb3RvdHlwZS50b3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmRhdGEubGVuZ3RoIC0gMTtcclxuICAgICAgICBpZiAoIGluZGV4IDwgMCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbIGluZGV4IF07XHJcbiAgICB9O1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gU3RhY2s7XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBzaW1wbHlEZWZlcnJlZCA9IHJlcXVpcmUoJ3NpbXBseS1kZWZlcnJlZCcpLFxyXG4gICAgICAgIERlZmVycmVkID0gc2ltcGx5RGVmZXJyZWQuRGVmZXJyZWQsXHJcbiAgICAgICAgd2hlbiA9IHNpbXBseURlZmVycmVkLndoZW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvdmlkZWQgZGVmZXJyZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtEZWZlcnJlZH0gZGVmZXJyZWQgLSBUaGUgZGVmZXJyZWQgb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIGRlZmVycmVkLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZXNvbHZlRGVmZXJyZWQoIGRlZmVycmVkICkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggcmVzdWx0ICkge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCByZXN1bHQgKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyBhbiBhcnJheSBvZiBqb2JzLCBhY2N1bXVsYXRpbmcgdGhlIHJlc3VsdHMgYW5kXHJcbiAgICAgKiBwYXNzaW5nIHRoZW0gdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGluIGNvcnJlc3BvbmRpbmcgaW5kaWNlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBqb2JzIC0gVGhlIGpvYiBhcnJheS5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICovXHJcbiAgICAgZnVuY3Rpb24gYXN5bmNBcnJheSggam9icywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGRlZmVycmVkcyA9IFtdLFxyXG4gICAgICAgICAgICBkZWZlcnJlZCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8am9icy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgZGVmZXJyZWRzLnB1c2goIGRlZmVycmVkICk7XHJcbiAgICAgICAgICAgIGpvYnNbaV0oIHJlc29sdmVEZWZlcnJlZCggZGVmZXJyZWQgKSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGVuLmFwcGx5KCB3aGVuLCBkZWZlcnJlZHMgKS50aGVuKCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAwICk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCByZXN1bHRzICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIGEgbWFwIG9mIGpvYnMsIGFjY3VtdWxhdGluZyB0aGUgcmVzdWx0cyBhbmRcclxuICAgICAqIHBhc3NpbmcgdGhlbSB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdW5kZXIgY29ycmVzcG9uZGluZ1xyXG4gICAgICoga2V5cy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gam9icyAtIFRoZSBqb2IgbWFwLlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBhc3luY09iaiggam9icywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGpvYnNCeUluZGV4ID0gW10sXHJcbiAgICAgICAgICAgIGRlZmVycmVkcyA9IFtdLFxyXG4gICAgICAgICAgICBkZWZlcnJlZCxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIGZvciAoIGtleSBpbiBqb2JzICkge1xyXG4gICAgICAgICAgICBpZiAoIGpvYnMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkcy5wdXNoKCBkZWZlcnJlZCApO1xyXG4gICAgICAgICAgICAgICAgam9ic0J5SW5kZXgucHVzaCgga2V5ICk7XHJcbiAgICAgICAgICAgICAgICBqb2JzWyBrZXkgXSggcmVzb2x2ZURlZmVycmVkKCBkZWZlcnJlZCApICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2hlbi5hcHBseSggd2hlbiwgZGVmZXJyZWRzICkuZG9uZSggZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMCApLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0c0J5S2V5ID0ge30sXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8am9ic0J5SW5kZXgubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzQnlLZXlbIGpvYnNCeUluZGV4W2ldIF0gPSByZXN1bHRzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCByZXN1bHRzQnlLZXkgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRXhlY3V0ZSBhIHNldCBvZiBmdW5jdGlvbnMgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIGhhdmUgYmVlblxyXG4gICAgICAgICAqIGNvbXBsZXRlZCwgZXhlY3V0ZSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uIEpvYnMgbWF5IGJlIHBhc3NlZFxyXG4gICAgICAgICAqIGFzIGFuIGFycmF5IG9yIG9iamVjdC4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgcGFzc2VkIHRoZVxyXG4gICAgICAgICAqIHJlc3VsdHMgaW4gdGhlIHNhbWUgZm9ybWF0IGFzIHRoZSBqb2JzLiBBbGwgam9icyBtdXN0IGhhdmUgYWNjZXB0IGFuZFxyXG4gICAgICAgICAqIGV4ZWN1dGUgYSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gam9icyAtIFRoZSBzZXQgb2YgZnVuY3Rpb25zIHRvIGV4ZWN1dGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFzeW5jOiBmdW5jdGlvbiggam9icywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgIGlmICggam9icyBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG4gICAgICAgICAgICAgICAgYXN5bmNBcnJheSggam9icywgY2FsbGJhY2sgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFzeW5jT2JqKCBqb2JzLCBjYWxsYmFjayApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRXh0ZW5kIGNsYXNzIGEgYnkgY2xhc3MgYi4gRG9lcyBub3QgcmVjdXJzZSwgc2ltcGx5IG92ZXJsYXlzIHRvcFxyXG4gICAgICAgICAqIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYSAtIE9iamVjdCBhIHdoaWNoIGlzIGV4dGVuZGVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBiIC0gT2JqZWN0IGIgd2hpY2ggZXh0ZW5kcyBhLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGV4dGVuZGVkIG9iamVjdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uKCBhLCBiICkge1xyXG4gICAgICAgICAgICB2YXIga2V5O1xyXG4gICAgICAgICAgICBmb3IoIGtleSBpbiBiICkge1xyXG4gICAgICAgICAgICAgICAgaWYoIGIuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFbIGtleSBdID0gYlsga2V5IF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVlcCBjb3BpZXMgdGhlIHByb3ZpZGVkIG9iamVjdC4gT2JqZWN0IGNhbm5vdCBiZSBjaXJjdWxhci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBqc29uIC0gVGhlIG9iamVjdCB0byBjb3B5LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gYSBkZWVwIGNvcHkgb2YgdGhlIHByb3ZpZGVkIG9iamVjdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb3B5OiBmdW5jdGlvbigganNvbiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoIEpTT04uc3RyaW5naWZ5KCBqc29uICkgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBvYmplY3QgaGFzIG5vIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gVGhlIG9iamVjdCB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBoYXMga2V5cywgZmFsc2UgaWYgbm90LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzRW1wdHk6IGZ1bmN0aW9uKCBvYmogKSB7XHJcbiAgICAgICAgICAgIGZvciggdmFyIHByb3AgaW4gb2JqICkge1xyXG4gICAgICAgICAgICAgICAgaWYoIG9iai5oYXNPd25Qcm9wZXJ0eSggcHJvcCApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgYSBwcm92aWRlZCBhcnJheSBpcyBhIGphdnNjcmlwdCBUeXBlZEFycmF5LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSBhcnJheSAtIFRoZSB2YXJpYWJsZSB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIHZhcmlhYmxlIGlzIGEgVHlwZWRBcnJheS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1R5cGVkQXJyYXk6IGZ1bmN0aW9uKCBhcnJheSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5ICYmXHJcbiAgICAgICAgICAgICAgICBhcnJheS5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciAmJlxyXG4gICAgICAgICAgICAgICAgYXJyYXkuYnl0ZUxlbmd0aCAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcHJvdmlkZWQgaW50ZWdlciBpcyBhIHBvd2VyIG9mIHR3by5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbnVtIC0gVGhlIG51bWJlciB0byB0ZXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIG51bWJlciBpcyBhIHBvd2VyIG9mIHR3by5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1Bvd2VyT2ZUd286IGZ1bmN0aW9uKCBudW0gKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoIG51bSAhPT0gMCApID8gKCBudW0gJiAoIG51bSAtIDEgKSApID09PSAwIDogZmFsc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbmV4dCBoaWdoZXN0IHBvd2VyIG9mIHR3byBmb3IgYSBudW1iZXIuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBFeC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAgICAyMDAgLT4gMjU2XHJcbiAgICAgICAgICogICAgIDI1NiAtPiAyNTZcclxuICAgICAgICAgKiAgICAgMjU3IC0+IDUxMlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBudW0gLSBUaGUgbnVtYmVyIHRvIG1vZGlmeS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtpbnRlZ2VyfSAtIE5leHQgaGlnaGVzdCBwb3dlciBvZiB0d28uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbmV4dEhpZ2hlc3RQb3dlck9mVHdvOiBmdW5jdGlvbiggbnVtICkge1xyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgaWYgKCBudW0gIT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBudW0gPSBudW0tMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKCBpPTE7IGk8MzI7IGk8PD0xICkge1xyXG4gICAgICAgICAgICAgICAgbnVtID0gbnVtIHwgbnVtID4+IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bSArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIFhNTEh0dHBSZXF1ZXN0IEdFVCByZXF1ZXN0IHRvIHRoZSBzdXBwbGllZCB1cmwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIGZvciB0aGUgcmVzb3VyY2UuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQ29udGFpbnMgdGhlIGZvbGxvd2luZyBvcHRpb25zOlxuICAgICAgICAgKiA8cHJlPlxuICAgICAgICAgKiAgICAge1xuICAgICAgICAgKiAgICAgICAgIHtTdHJpbmd9IHN1Y2Nlc3MgLSBUaGUgc3VjY2VzcyBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogICAgICAgICB7U3RyaW5nfSBlcnJvciAtIFRoZSBlcnJvciBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogICAgICAgICB7U3RyaW5nfSBwcm9ncmVzcyAtIFRoZSBwcm9ncmVzcyBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICogICAgICAgICB7U3RyaW5nfSByZXNwb25zZVR5cGUgLSBUaGUgcmVzcG9uc2VUeXBlIG9mIHRoZSBYSFIuXG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqIDwvcHJlPlxuICAgICAgICAgKi9cbiAgICAgICAgbG9hZDogZnVuY3Rpb24gKCB1cmwsIG9wdGlvbnMgKSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCAnR0VUJywgdXJsLCB0cnVlICk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlO1xuICAgICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMuc3VjY2VzcyApIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKCB0aGlzLnJlc3BvbnNlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMucHJvZ3Jlc3MgKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCAncHJvZ3Jlc3MnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnByb2dyZXNzKCBldmVudCApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmVycm9yICkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lciggJ2Vycm9yJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lcnJvciggZXZlbnQgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9XG4gICAgfTtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFBST0pfTUFUUklYID0gXCJ1UHJvamVjdGlvbk1hdHJpeFwiLFxyXG4gICAgICAgIE1PREVMX01BVFJJWCA9IFwidU1vZGVsTWF0cml4XCIsXHJcbiAgICAgICAgVklFV19NQVRSSVggPSBcInVWaWV3TWF0cml4XCIsXHJcbiAgICAgICAgUE9TX0FUVFJJQiA9IFwiYVBvc2l0aW9uXCIsXHJcbiAgICAgICAgVVZfQVRUUklCID0gXCJhVGV4Q29vcmRcIixcclxuICAgICAgICBVU0VfQVRUUklCX0NPTE9SID0gXCJ1VXNlQXR0cmliQ29sb3JcIixcclxuICAgICAgICBDT0xfQVRUUklCID0gXCJhQ29sb3JcIixcclxuICAgICAgICBDT0xfVU5JRk9STSA9IFwidUNvbG9yXCIsXHJcbiAgICAgICAgVEVYX1NBTVBMRVIgPSBcInVEaWZmdXNlU2FtcGxlclwiO1xyXG5cclxuICAgIHZhciBGTEFUX1ZFUlRfU1JDID0gW1xyXG4gICAgICAgICAgICBcImF0dHJpYnV0ZSBoaWdocCB2ZWMzIFwiICsgUE9TX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcImF0dHJpYnV0ZSBoaWdocCB2ZWMzIFwiICsgQ09MX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gaGlnaHAgbWF0NCBcIiArIE1PREVMX01BVFJJWCArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gaGlnaHAgbWF0NCBcIiArIFZJRVdfTUFUUklYICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidW5pZm9ybSBoaWdocCBtYXQ0IFwiICsgUFJPSl9NQVRSSVggKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ1bmlmb3JtIGJvb2wgXCIgKyBVU0VfQVRUUklCX0NPTE9SICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidW5pZm9ybSBoaWdocCB2ZWMzIFwiICsgQ09MX1VOSUZPUk0gKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ2YXJ5aW5nIGhpZ2hwIHZlYzMgdkNvbG9yO1wiLFxyXG4gICAgICAgICAgICBcInZvaWQgbWFpbigpIHtcIixcclxuICAgICAgICAgICAgICAgIFwiaWYgKCBcIiArIFVTRV9BVFRSSUJfQ09MT1IgKyBcIiApIHtcIixcclxuICAgICAgICAgICAgICAgICAgICBcInZDb2xvciA9IFwiICsgQ09MX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ9IGVsc2Uge1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidkNvbG9yID0gXCIgKyBDT0xfVU5JRk9STSArIFwiO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ9XCIsXHJcbiAgICAgICAgICAgICAgICBcImdsX1Bvc2l0aW9uID0gXCIgKyBQUk9KX01BVFJJWCArXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgKiBcIiArIFZJRVdfTUFUUklYICtcclxuICAgICAgICAgICAgICAgICAgICBcIiAqIFwiICsgTU9ERUxfTUFUUklYICtcclxuICAgICAgICAgICAgICAgICAgICBcIiAqIHZlYzQoIFwiICsgUE9TX0FUVFJJQiArIFwiLCAxLjAgKTtcIixcclxuICAgICAgICAgICAgXCJ9XCJcclxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgIHZhciBGTEFUX0ZSQUdfU1JDID0gW1xyXG4gICAgICAgICAgICBcInZhcnlpbmcgaGlnaHAgdmVjMyB2Q29sb3I7XCIsXHJcbiAgICAgICAgICAgIFwidm9pZCBtYWluKCkge1wiLFxyXG4gICAgICAgICAgICAgICAgXCJnbF9GcmFnQ29sb3IgPSB2ZWM0KCB2Q29sb3IsIDEuMCApO1wiLFxyXG4gICAgICAgICAgICBcIn1cIlxyXG4gICAgICAgIF0uam9pbignXFxuJyk7XHJcblxyXG4gICAgdmFyIFRFWF9WRVJUX1NSQyA9IFtcclxuICAgICAgICAgICAgXCJhdHRyaWJ1dGUgaGlnaHAgdmVjMyBcIiArIFBPU19BVFRSSUIgKyBcIjtcIixcclxuICAgICAgICAgICAgXCJhdHRyaWJ1dGUgaGlnaHAgdmVjMiBcIiArIFVWX0FUVFJJQiArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInVuaWZvcm0gaGlnaHAgbWF0NCBcIiArIE1PREVMX01BVFJJWCArIFwiO1wiLFxyXG4gICAgICAgICAgICBcInZhcnlpbmcgaGlnaHAgdmVjMiB2VGV4Q29vcmQ7XCIsXHJcbiAgICAgICAgICAgIFwidm9pZCBtYWluKCkge1wiLFxyXG4gICAgICAgICAgICAgICAgXCJnbF9Qb3NpdGlvbiA9IFwiICsgTU9ERUxfTUFUUklYICtcclxuICAgICAgICAgICAgICAgICAgICBcIiAqIHZlYzQoIFwiICsgUE9TX0FUVFJJQiArIFwiLCAxLjAgKTtcIixcclxuICAgICAgICAgICAgICAgIFwidlRleENvb3JkID0gXCIgKyBVVl9BVFRSSUIgKyBcIjtcIixcclxuICAgICAgICAgICAgXCJ9XCJcclxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgIHZhciBURVhfRlJBR19TUkMgPSBbXHJcbiAgICAgICAgICAgIFwidmFyeWluZyBoaWdocCB2ZWMzIHZDb2xvcjtcIixcclxuICAgICAgICAgICAgXCJ1bmlmb3JtIHNhbXBsZXIyRCBcIiArIFRFWF9TQU1QTEVSICsgXCI7XCIsXHJcbiAgICAgICAgICAgIFwidmFyeWluZyBoaWdocCB2ZWMyIHZUZXhDb29yZDtcIixcclxuICAgICAgICAgICAgXCJ2b2lkIG1haW4oKSB7XCIsXHJcbiAgICAgICAgICAgICAgICBcImdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCggXCIgKyBURVhfU0FNUExFUiArIFwiLCB2VGV4Q29vcmQgKTtcIixcclxuICAgICAgICAgICAgXCJ9XCJcclxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgIHZhciBGTEFUX0RFQlVHX1NIQURFUiA9IG51bGw7XHJcbiAgICB2YXIgVEVYX0RFQlVHX1NIQURFUiA9IG51bGw7XHJcblxyXG4gICAgdmFyIFNoYWRlciA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvU2hhZGVyJyksXHJcbiAgICAgICAgTWVzaCA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlci9NZXNoJyksXHJcbiAgICAgICAgRW50aXR5ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL0VudGl0eScpLFxyXG4gICAgICAgIFJlbmRlcmVyID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL1JlbmRlcmVyJyksXHJcbiAgICAgICAgUmVuZGVyVGVjaG5pcXVlID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL1JlbmRlclRlY2huaXF1ZScpLFxyXG4gICAgICAgIFJlbmRlclBhc3MgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvUmVuZGVyUGFzcycpLFxyXG4gICAgICAgIFF1YWQgPSByZXF1aXJlKCcuLi9zaGFwZXMvUXVhZCcpLFxyXG4gICAgICAgIF9kZWJ1Z1VVSUQgPSAxLFxyXG4gICAgICAgIF9yZW5kZXJNYXAgPSB7fSxcclxuICAgICAgICBfY2FtZXJhID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRGdW5jTmFtZSggZnVuYyApIHtcclxuICAgICAgdmFyIG5hbWUgPSBmdW5jLnRvU3RyaW5nKCk7XHJcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0ciggJ2Z1bmN0aW9uICcubGVuZ3RoICk7XHJcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0ciggMCwgbmFtZS5pbmRleE9mKCcoJykgKTtcclxuICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgZnVuYyApIHtcclxuICAgICAgICBlbnRpdHkuJCRERUJVR19VVUlEID0gZW50aXR5LiQkREVCVUdfVVVJRCB8fCBfZGVidWdVVUlEKys7XHJcbiAgICAgICAgdmFyIGRlYnVnSGFzaCA9IGVudGl0eS4kJERFQlVHX1VVSUQgKyBcIi1cIiArIGdldEZ1bmNOYW1lKCBmdW5jICk7XHJcbiAgICAgICAgaWYgKCAhX3JlbmRlck1hcFsgZGVidWdIYXNoIF0gKSB7XHJcbiAgICAgICAgICAgIF9yZW5kZXJNYXBbIGRlYnVnSGFzaCBdID0gZnVuYyggZW50aXR5ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfcmVuZGVyTWFwWyBkZWJ1Z0hhc2ggXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0QXJyYXlUb0NvbG9ycyggYXJyYXkgKSB7XHJcbiAgICAgICAgdmFyIGNvbG9ycyA9IG5ldyBBcnJheSggYXJyYXkubGVuZ3RoICksXHJcbiAgICAgICAgICAgIGF0dHJpYixcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICBmb3IgKCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYiA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICBjb2xvcnNbaV0gPSBbXHJcbiAgICAgICAgICAgICAgICAoICggYXR0cmliLnggfHwgYXR0cmliWzBdICkgKyAxICkgLyAyLFxyXG4gICAgICAgICAgICAgICAgKCAoIGF0dHJpYi55IHx8IGF0dHJpYlsxXSApICArIDEgKSAvIDIsXHJcbiAgICAgICAgICAgICAgICAoICggYXR0cmliLnogfHwgYXR0cmliWzJdIHx8IDAgKSArIDEgKSAvIDJcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVXaXJlRnJhbWVFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICB2YXIgY29weSA9IGVudGl0eS5jb3B5KCk7XHJcbiAgICAgICAgY29weS5mb3JFYWNoKCBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICB2YXIgbWVzaGVzID0gZW50aXR5Lm1lc2hlcyxcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICB0cmlJbmRpY2VzLFxyXG4gICAgICAgICAgICAgICAgbGluZXMsXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLFxyXG4gICAgICAgICAgICAgICAgYSwgYiwgYyxcclxuICAgICAgICAgICAgICAgIGksIGo7XHJcbiAgICAgICAgICAgIGVudGl0eS5tZXNoZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPG1lc2hlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5ID0gbWVzaGVzW2ldLmdlb21ldHJ5O1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zID0gZ2VvbWV0cnkucG9zaXRpb25zO1xyXG4gICAgICAgICAgICAgICAgdHJpSW5kaWNlcyA9IGdlb21ldHJ5LmluZGljZXM7XHJcbiAgICAgICAgICAgICAgICBsaW5lcyA9IG5ldyBBcnJheSggdHJpSW5kaWNlcy5sZW5ndGggKiAyICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzID0gbmV3IEFycmF5KCB0cmlJbmRpY2VzLmxlbmd0aCAqIDIgKTtcclxuICAgICAgICAgICAgICAgIGZvciAoIGo9MDsgajx0cmlJbmRpY2VzLmxlbmd0aDsgais9MyApIHtcclxuICAgICAgICAgICAgICAgICAgICBhID0gdHJpSW5kaWNlc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBiID0gdHJpSW5kaWNlc1tqKzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGMgPSB0cmlJbmRpY2VzW2orMl07XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyXSA9IHBvc2l0aW9uc1thXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjIrMV0gPSBwb3NpdGlvbnNbYl07XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyKzJdID0gcG9zaXRpb25zW2JdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzW2oqMiszXSA9IHBvc2l0aW9uc1tjXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjIrNF0gPSBwb3NpdGlvbnNbY107XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyKzVdID0gcG9zaXRpb25zW2FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyXSA9IGoqMjtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMisxXSA9IGoqMisxO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyKzJdID0gaioyKzI7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tqKjIrM10gPSBqKjIrMztcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMis0XSA9IGoqMis0O1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNbaioyKzVdID0gaioyKzU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkubWVzaGVzLnB1c2goIG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IGxpbmVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXM6IGluZGljZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiBcIkxJTkVTXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbFxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVudGl0eS4kJERFQlVHX1VTRV9DT0xPUiA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjb3B5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbG9yRW50aXR5KCBlbnRpdHksIGF0dHJpYnV0ZSApIHtcclxuICAgICAgICB2YXIgY29weSA9IGVudGl0eS5jb3B5KCk7XHJcbiAgICAgICAgY29weS5mb3JFYWNoKCBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICB2YXIgbWVzaGVzID0gZW50aXR5Lm1lc2hlcyxcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZW50aXR5Lm1lc2hlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8bWVzaGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgZ2VvbWV0cnkgPSBtZXNoZXNbaV0uZ2VvbWV0cnk7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkubWVzaGVzLnB1c2goIG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IGdlb21ldHJ5LnBvc2l0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcnM6IGNvbnZlcnRBcnJheVRvQ29sb3JzKCBnZW9tZXRyeVsgYXR0cmlidXRlIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzOiBnZW9tZXRyeS5pbmRpY2VzXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZW50aXR5LiQkREVCVUdfVVNFX0NPTE9SID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY29weTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVVVkNvbG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbG9yRW50aXR5KCBlbnRpdHksIFwidXZzXCIgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVOb3JtYWxDb2xvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVDb2xvckVudGl0eSggZW50aXR5LCBcIm5vcm1hbHNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRhbmdlbnRDb2xvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVDb2xvckVudGl0eSggZW50aXR5LCBcInRhbmdlbnRzXCIgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVCaVRhbmdlbnRDb2xvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVDb2xvckVudGl0eSggZW50aXR5LCBcImJpdGFuZ2VudHNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxpbmVzRW50aXR5KCBlbnRpdHksIHR5cGUgKSB7XHJcbiAgICAgICAgdmFyIGNvcHkgPSBlbnRpdHkuY29weSgpO1xyXG4gICAgICAgIGNvcHkuZm9yRWFjaCggZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgdmFyIG1lc2hlcyA9IGVudGl0eS5tZXNoZXMsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBsaW5lcyxcclxuICAgICAgICAgICAgICAgIGluZGljZXMsXHJcbiAgICAgICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICAgICAgajtcclxuICAgICAgICAgICAgZW50aXR5Lm1lc2hlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8bWVzaGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zID0gbWVzaGVzW2ldLmdlb21ldHJ5LnBvc2l0aW9ucztcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBtZXNoZXNbaV0uZ2VvbWV0cnlbIHR5cGUgXTtcclxuICAgICAgICAgICAgICAgIGxpbmVzID0gbmV3IEFycmF5KCBwb3NpdGlvbnMubGVuZ3RoICogMiApO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcyA9IG5ldyBBcnJheSggcG9zaXRpb25zLmxlbmd0aCAqIDIgKTtcclxuICAgICAgICAgICAgICAgIGZvciAoIGo9MDsgajxwb3NpdGlvbnMubGVuZ3RoOyBqKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbnNbal07XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tqKjJdID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXNbaioyKzFdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHBvc2l0aW9uLnggfHwgcG9zaXRpb25bMF0gfHwgMCApICsgKCBhdHRyaWJ1dGUueCB8fCBhdHRyaWJ1dGVbMF0gfHwgMCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHBvc2l0aW9uLnkgfHwgcG9zaXRpb25bMV0gfHwgMCApICsgKCBhdHRyaWJ1dGUueSB8fCBhdHRyaWJ1dGVbMV0gfHwgMCApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIHBvc2l0aW9uLnogfHwgcG9zaXRpb25bMl0gfHwgMCApICsgKCBhdHRyaWJ1dGUueiB8fCBhdHRyaWJ1dGVbMl0gfHwgMCApXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzW2oqMl0gPSBqKjI7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tqKjIrMV0gPSBqKjIrMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVudGl0eS5tZXNoZXMucHVzaCggbmV3IE1lc2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogbGluZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU6IFwiTElORVNcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIGVudGl0eS4kJERFQlVHX1VTRV9DT0xPUiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGNvcHk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVVZWZWN0b3JFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlTGluZXNFbnRpdHkoIGVudGl0eSwgXCJ1dnNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZU5vcm1hbFZlY3RvckVudGl0eSggZW50aXR5ICkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVMaW5lc0VudGl0eSggZW50aXR5LCBcIm5vcm1hbHNcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRhbmdlbnRWZWN0b3JFbnRpdHkoIGVudGl0eSApIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlTGluZXNFbnRpdHkoIGVudGl0eSwgXCJ0YW5nZW50c1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQmlUYW5nZW50VmVjdG9yRW50aXR5KCBlbnRpdHkgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxpbmVzRW50aXR5KCBlbnRpdHksIFwiYml0YW5nZW50c1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIF91c2VDb2xvciA9IGZhbHNlLFxyXG4gICAgICAgIF9jb2xvciA9IFsxLDEsMF07XHJcblxyXG4gICAgdmFyIGRlYnVnRmxhdFBhc3MgPSBuZXcgUmVuZGVyUGFzcyh7XHJcbiAgICAgICAgYmVmb3JlOiBmdW5jdGlvbiggY2FtZXJhICkge1xyXG4gICAgICAgICAgICBpZiAoICFGTEFUX0RFQlVHX1NIQURFUiApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBzaGFkZXIgaWYgaXQgZG9lcyBub3QgZXhpc3QgeWV0XHJcbiAgICAgICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUiA9IG5ldyBTaGFkZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnQ6IEZMQVRfVkVSVF9TUkMsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJhZzogRkxBVF9GUkFHX1NSQ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRkxBVF9ERUJVR19TSEFERVIucHVzaCgpO1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBQUk9KX01BVFJJWCwgY2FtZXJhLnByb2plY3Rpb25NYXRyaXgoKSApO1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBWSUVXX01BVFJJWCwgY2FtZXJhLmdsb2JhbFZpZXdNYXRyaXgoKSApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaEVudGl0eTogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgX3VzZUNvbG9yID0gZW50aXR5LiQkREVCVUdfVVNFX0NPTE9SO1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBNT0RFTF9NQVRSSVgsIGVudGl0eS5nbG9iYWxNYXRyaXgoKSApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaE1lc2g6IGZ1bmN0aW9uKCBtZXNoICkge1xyXG4gICAgICAgICAgICBGTEFUX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBVU0VfQVRUUklCX0NPTE9SLCBfdXNlQ29sb3IgKTtcclxuICAgICAgICAgICAgRkxBVF9ERUJVR19TSEFERVIuc2V0VW5pZm9ybSggQ09MX1VOSUZPUk0sIF9jb2xvciApO1xyXG4gICAgICAgICAgICBtZXNoLmRyYXcoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFmdGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRkxBVF9ERUJVR19TSEFERVIucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGRlYnVnVGV4UGFzcyA9IG5ldyBSZW5kZXJQYXNzKHtcclxuICAgICAgICBiZWZvcmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoICFURVhfREVCVUdfU0hBREVSICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHNoYWRlciBpZiBpdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgICAgIFRFWF9ERUJVR19TSEFERVIgPSBuZXcgU2hhZGVyKHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0OiBURVhfVkVSVF9TUkMsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJhZzogVEVYX0ZSQUdfU1JDXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBURVhfREVCVUdfU0hBREVSLmdsLmRpc2FibGUoIFRFWF9ERUJVR19TSEFERVIuZ2wuREVQVEhfVEVTVCApO1xyXG4gICAgICAgICAgICBURVhfREVCVUdfU0hBREVSLnB1c2goKTtcclxuICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBURVhfU0FNUExFUiwgMCApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaEVudGl0eTogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUi5zZXRVbmlmb3JtKCBNT0RFTF9NQVRSSVgsIGVudGl0eS5nbG9iYWxNYXRyaXgoKSApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yRWFjaE1lc2g6IGZ1bmN0aW9uKCBtZXNoICkge1xyXG4gICAgICAgICAgICBtZXNoLm1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlLnB1c2goIDAgKTtcclxuICAgICAgICAgICAgbWVzaC5kcmF3KCk7XHJcbiAgICAgICAgICAgIG1lc2gubWF0ZXJpYWwuZGlmZnVzZVRleHR1cmUucG9wKCAwICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZnRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFRFWF9ERUJVR19TSEFERVIuZ2wuZW5hYmxlKCBURVhfREVCVUdfU0hBREVSLmdsLkRFUFRIX1RFU1QgKTtcclxuICAgICAgICAgICAgVEVYX0RFQlVHX1NIQURFUi5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgZGVidWdGbGF0VGVjaG5pcXVlID0gbmV3IFJlbmRlclRlY2huaXF1ZSh7XHJcbiAgICAgICAgaWQ6IFwiZGVidWdcIixcclxuICAgICAgICBwYXNzZXM6IFsgZGVidWdGbGF0UGFzcyBdXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgZGVidWdUZXhUZWNobmlxdWUgPSBuZXcgUmVuZGVyVGVjaG5pcXVlKHtcclxuICAgICAgICBpZDogXCJ0ZXhcIixcclxuICAgICAgICBwYXNzZXM6IFsgZGVidWdUZXhQYXNzIF1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBkZWJ1Z1JlbmRlcmVyID0gbmV3IFJlbmRlcmVyKFsgZGVidWdGbGF0VGVjaG5pcXVlLCBkZWJ1Z1RleFRlY2huaXF1ZSBdKTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgc2V0Q2FtZXJhOiBmdW5jdGlvbiggY2FtZXJhICkge1xyXG4gICAgICAgICAgICBfY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdUZXh0dXJlOiBmdW5jdGlvbiggdGV4dHVyZSApIHtcclxuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogUXVhZC5wb3NpdGlvbnMoKSxcclxuICAgICAgICAgICAgICAgICAgICB1dnM6IFF1YWQudXZzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlczogIFF1YWQuaW5kaWNlcygpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW50aXR5ID0gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IFsgbmV3IE1lc2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmFibGU6IGdlb21ldHJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIGdlb21lcnRyeTogZ2VvbWV0cnksXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZnVzZVRleHR1cmU6IHRleHR1cmVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSBdLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luOiBbIC0wLjc1LCAwLjc1LCAwIF0sXHJcbiAgICAgICAgICAgICAgICBzY2FsZTogMC41XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggbnVsbCwge1xyXG4gICAgICAgICAgICAgICAgdGV4OiBbIGVudGl0eSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdXaXJlRnJhbWU6IGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVXaXJlRnJhbWVFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdVVnNBc0NvbG9yOiBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlVVZDb2xvckVudGl0eSApIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd1VWc0FzVmVjdG9yczogZnVuY3Rpb24oIGVudGl0eSwgY29sb3IgKSB7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlVVZWZWN0b3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXdOb3JtYWxzQXNDb2xvcjogZnVuY3Rpb24oIGVudGl0eSApIHtcclxuICAgICAgICAgICAgZGVidWdSZW5kZXJlci5yZW5kZXIoIF9jYW1lcmEsIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnOiBbIGNyZWF0ZURlYnVnRW50aXR5KCBlbnRpdHksIGNyZWF0ZU5vcm1hbENvbG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3Tm9ybWFsc0FzVmVjdG9yczogZnVuY3Rpb24oIGVudGl0eSwgY29sb3IgKSB7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlTm9ybWFsVmVjdG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3VGFuZ2VudHNBc0NvbG9yOiBmdW5jdGlvbiggZW50aXR5ICkge1xyXG4gICAgICAgICAgICBkZWJ1Z1JlbmRlcmVyLnJlbmRlciggX2NhbWVyYSwge1xyXG4gICAgICAgICAgICAgICAgZGVidWc6IFsgY3JlYXRlRGVidWdFbnRpdHkoIGVudGl0eSwgY3JlYXRlVGFuZ2VudENvbG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3VGFuZ2VudHNBc1ZlY3RvcnM6IGZ1bmN0aW9uKCBlbnRpdHksIGNvbG9yICApIHtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVUYW5nZW50VmVjdG9yRW50aXR5ICkgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkcmF3QmlUYW5nZW50c0FzQ29sb3I6IGZ1bmN0aW9uKCBlbnRpdHkgKSB7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVCaVRhbmdlbnRDb2xvckVudGl0eSApIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhd0JpVGFuZ2VudHNBc1ZlY3RvcnM6IGZ1bmN0aW9uKCBlbnRpdHksIGNvbG9yICApIHtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIGRlYnVnUmVuZGVyZXIucmVuZGVyKCBfY2FtZXJhLCB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogWyBjcmVhdGVEZWJ1Z0VudGl0eSggZW50aXR5LCBjcmVhdGVCaVRhbmdlbnRWZWN0b3JFbnRpdHkgKSBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhbGZhZG9yID0gcmVxdWlyZSgnYWxmYWRvcicpLFxyXG4gICAgICAgIFF1YXRlcm5pb24gPSBhbGZhZG9yLlF1YXRlcm5pb24sXHJcbiAgICAgICAgTWF0MzMgPSBhbGZhZG9yLk1hdDMzLFxyXG4gICAgICAgIE1hdDQ0ID0gYWxmYWRvci5NYXQ0NCxcclxuICAgICAgICBWZWMyID0gYWxmYWRvci5WZWMyLFxyXG4gICAgICAgIFZlYzMgPSBhbGZhZG9yLlZlYzM7XHJcblxyXG4gICAgdmFyIENPTVBPTkVOVF9UWVBFU19UT19CVUZGRVJWSUVXUyA9IHtcclxuICAgICAgICBcIjUxMjBcIjogSW50OEFycmF5LFxyXG4gICAgICAgIFwiNTEyMVwiOiBVaW50OEFycmF5LFxyXG4gICAgICAgIFwiNTEyMlwiOiBJbnQxNkFycmF5LFxyXG4gICAgICAgIFwiNTEyM1wiOiBVaW50MTZBcnJheSxcclxuICAgICAgICBcIjUxMjZcIjogRmxvYXQzMkFycmF5XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBUWVBFU19UT19OVU1fQ09NUE9ORU5UUyA9IHtcclxuICAgICAgICBcIlNDQUxBUlwiOiAxLFxyXG4gICAgICAgIFwiVkVDMlwiOiAyLFxyXG4gICAgICAgIFwiVkVDM1wiOiAzLFxyXG4gICAgICAgIFwiVkVDNFwiOiA0LFxyXG4gICAgICAgIFwiTUFUMlwiOiA0LFxyXG4gICAgICAgIFwiTUFUM1wiOiA5LFxyXG4gICAgICAgIFwiTUFUNFwiOiAxNlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVFlQRVNfVE9fQ0xBU1MgPSB7XHJcbiAgICAgICAgXCJTQ0FMQVJcIjogTnVtYmVyLFxyXG4gICAgICAgIFwiVkVDMlwiOiBWZWMyLFxyXG4gICAgICAgIFwiVkVDM1wiOiBWZWMzLFxyXG4gICAgICAgIFwiVkVDNFwiOiBRdWF0ZXJuaW9uLFxyXG4gICAgICAgIFwiTUFUM1wiOiBNYXQzMyxcclxuICAgICAgICBcIk1BVDRcIjogTWF0NDRcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uUGFyYW1ldGVyKCBwYXJhbWV0ZXJzQnlBY2Nlc3NvciwganNvbiwgcGFyYW1ldGVyTmFtZSwgYWNjZXNzb3JOYW1lLCBidWZmZXJzICkge1xyXG5cclxuICAgICAgICBpZiAoIHBhcmFtZXRlcnNCeUFjY2Vzc29yWyBhY2Nlc3Nvck5hbWUgXSApIHtcclxuICAgICAgICAgICAgLy8gaWYgYWxyZWFkeSBjcmVhdGVkLCBubyBuZWVkIHRvIHJlLWNyZWF0IGVpdFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYWNjZXNzb3IgPSBqc29uLmFjY2Vzc29yc1sgYWNjZXNzb3JOYW1lIF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlclZpZXcgPSBqc29uLmJ1ZmZlclZpZXdzWyBhY2Nlc3Nvci5idWZmZXJWaWV3IF0sXHJcbiAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlcnNbIGJ1ZmZlclZpZXcuYnVmZmVyIF0sXHJcbiAgICAgICAgICAgIFR5cGVkQXJyYXkgPSBDT01QT05FTlRfVFlQRVNfVE9fQlVGRkVSVklFV1NbIGFjY2Vzc29yLmNvbXBvbmVudFR5cGUgXSxcclxuICAgICAgICAgICAgbnVtQ29tcG9uZW50cyA9IFRZUEVTX1RPX05VTV9DT01QT05FTlRTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIFR5cGVDbGFzcyA9IFRZUEVTX1RPX0NMQVNTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIGFjY2Vzc29yQXJyYXlDb3VudCA9IGFjY2Vzc29yLmNvdW50ICogbnVtQ29tcG9uZW50cyxcclxuICAgICAgICAgICAgYXJyYXlCdWZmZXIgPSBuZXcgVHlwZWRBcnJheSggYnVmZmVyLCBidWZmZXJWaWV3LmJ5dGVPZmZzZXQgKyBhY2Nlc3Nvci5ieXRlT2Zmc2V0LCBhY2Nlc3NvckFycmF5Q291bnQgKSxcclxuICAgICAgICAgICAgdmFsdWVzID0gW10sXHJcbiAgICAgICAgICAgIGJlZ2luSW5kZXgsXHJcbiAgICAgICAgICAgIGVuZEluZGV4LFxyXG4gICAgICAgICAgICBpO1xyXG5cclxuICAgICAgICBpZiAoIFR5cGVDbGFzcyA9PT0gTnVtYmVyICkge1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhlIHR5cGUgaXMgYSBzY2FsYXIsIHJldHVybiB0aGUgYnVmZmVyXHJcbiAgICAgICAgICAgIHZhbHVlcyA9IGFycmF5QnVmZmVyO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYgKCBwYXJhbWV0ZXJOYW1lID09PSBcInJvdGF0aW9uXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGVhY2ggY29tcG9uZW50IGluIHRoZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICAgICAgZm9yICggaT0wOyBpPGFjY2Vzc29yLmNvdW50OyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsYyB0aGUgYmVnaW4gYW5kIGVuZCBpbiBhcnJheWJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luSW5kZXggPSBpICogbnVtQ29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGJlZ2luSW5kZXggKyBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgc3ViYXJyYXkgdGhhdCBjb21wb3NlcyB0aGUgbWF0cml4XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzOiBuZXcgVmVjMyggYXJyYXlCdWZmZXIuc3ViYXJyYXkoIGJlZ2luSW5kZXgsIGVuZEluZGV4LTEgKSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogYXJyYXlCdWZmZXIuc3ViYXJyYXkoIGVuZEluZGV4LTEsIGVuZEluZGV4IClbMF1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGVhY2ggY29tcG9uZW50IGluIHRoZSBhY2Nlc3NvclxyXG4gICAgICAgICAgICAgICAgZm9yICggaT0wOyBpPGFjY2Vzc29yLmNvdW50OyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsYyB0aGUgYmVnaW4gYW5kIGVuZCBpbiBhcnJheWJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luSW5kZXggPSBpICogbnVtQ29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGJlZ2luSW5kZXggKyBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgc3ViYXJyYXkgdGhhdCBjb21wb3NlcyB0aGUgbWF0cml4XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBUeXBlQ2xhc3MoIGFycmF5QnVmZmVyLnN1YmFycmF5KCBiZWdpbkluZGV4LCBlbmRJbmRleCApIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJhbWV0ZXJzQnlBY2Nlc3NvclsgYWNjZXNzb3JOYW1lIF0gPSB2YWx1ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIGZ1bmN0aW9uIHJlc29sdmVBbmltYXRpb25UYXJnZXQoIGpzb24sIHRhcmdldElkLCB0YXJnZXRQYXRoICkge1xyXG4gICAgICAgIC8vIEFzIHBlciAwLjggc3BlYywgYW5pbWF0aW9uIHRhcmdldHMgY2FuIGJlOlxyXG4gICAgICAgIC8vICAgICBub2Rlc1xyXG4gICAgICAgIC8vICAgICBtYXRlcmlhbHMgKCBpbnN0YW5jZVRlY2huaXF1ZXMgKVxyXG4gICAgICAgIC8vICAgICB0ZWNobmlxdWVzXHJcbiAgICAgICAgLy8gICAgIGNhbWVyYXNcclxuICAgICAgICAvLyAgICAgbGlnaHRzXHJcbiAgICAgICAgLy8gZmlyc3QgY2hlY2sgbm9kZXNcclxuICAgICAgICBpZiAoIGpzb24ubm9kZXNbIHRhcmdldElkXSApIHtcclxuICAgICAgICAgICAgLy8gbm9kZVxyXG4gICAgICAgICAgICBpZiAoIGpzb24ubm9kZXNbIHRhcmdldElkIF0uam9pbnROYW1lICkge1xyXG4gICAgICAgICAgICAgICAgLy8gam9pbnRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vZGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIGpzb24ubWF0ZXJpYWxzWyB0YXJnZXRJZCBdICkge1xyXG4gICAgICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBpZ25vcmUgZm9yIG5vd1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICovXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uKCBhbmltYXRpb25zQnlUYXJnZXQsIHBhcmFtZXRlcnNCeUFjY2Vzc29yLCBqc29uLCBhbmltYXRpb24sIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSBhbmltYXRpb24ucGFyYW1ldGVycyxcclxuICAgICAgICAgICAgY2hhbm5lbCxcclxuICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICBzYW1wbGVyLFxyXG4gICAgICAgICAgICBpbnB1dEFjY2Vzc29yLFxyXG4gICAgICAgICAgICBvdXRwdXRBY2Nlc3NvcixcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBjaGFubmVsIGluIHRoZSBhbmltYXRpb25cclxuICAgICAgICBmb3IgKCBpPTA7IGk8YW5pbWF0aW9uLmNoYW5uZWxzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGFuaW1hdGlvbiBjaGFubmVsXHJcbiAgICAgICAgICAgIGNoYW5uZWwgPSBhbmltYXRpb24uY2hhbm5lbHNbaV07XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgdGFyZ2V0IG9mIHRoZSBhbmltYXRpb25cclxuICAgICAgICAgICAgdGFyZ2V0ID0gY2hhbm5lbC50YXJnZXQ7XHJcbiAgICAgICAgICAgIC8vIGdldCBzYW1wbGVyIGZvciB0aGUgY2hhbm5lbFxyXG4gICAgICAgICAgICBzYW1wbGVyID0gYW5pbWF0aW9uLnNhbXBsZXJzWyBjaGFubmVsLnNhbXBsZXIgXTtcclxuICAgICAgICAgICAgLy8gZ2V0IGFjY2Vzc29yIHRvIGNoYW5uZWwgaW5wdXRcclxuICAgICAgICAgICAgaW5wdXRBY2Nlc3NvciA9IHBhcmFtZXRlcnNbIHNhbXBsZXIuaW5wdXQgXTtcclxuICAgICAgICAgICAgLy8gZ2V0IGFjY2Vzc29yIHRvIGNoYW5uZWwgb3V0cHV0XHJcbiAgICAgICAgICAgIG91dHB1dEFjY2Vzc29yID0gcGFyYW1ldGVyc1sgc2FtcGxlci5vdXRwdXQgXTtcclxuICAgICAgICAgICAgLy8gY2FzdCBpbnB1dCBwYXJhbWV0ZXJcclxuICAgICAgICAgICAgY3JlYXRlQW5pbWF0aW9uUGFyYW1ldGVyKFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyc0J5QWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICBqc29uLFxyXG4gICAgICAgICAgICAgICAgc2FtcGxlci5pbnB1dCwgLy8gcGFyYW1ldGVyIG5hbWVcclxuICAgICAgICAgICAgICAgIGlucHV0QWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICBidWZmZXJzICk7XHJcbiAgICAgICAgICAgIC8vIGNhc3Qgb3V0cHV0IHBhcmFtZXRlclxyXG4gICAgICAgICAgICBjcmVhdGVBbmltYXRpb25QYXJhbWV0ZXIoXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzQnlBY2Nlc3NvcixcclxuICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyLm91dHB1dCwgLy8gcGFyYW1ldGVyIG5hbWVcclxuICAgICAgICAgICAgICAgIG91dHB1dEFjY2Vzc29yLFxyXG4gICAgICAgICAgICAgICAgYnVmZmVycyApO1xyXG4gICAgICAgICAgICAvLyBzYXZlIGlucHV0XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbnNCeVRhcmdldFsgdGFyZ2V0LmlkIF0gPSBhbmltYXRpb25zQnlUYXJnZXRbIHRhcmdldC5pZCBdIHx8IFtdO1xyXG4gICAgICAgICAgICBhbmltYXRpb25zQnlUYXJnZXRbIHRhcmdldC5pZCBdLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgcGF0aDogdGFyZ2V0LnBhdGgsXHJcbiAgICAgICAgICAgICAgICBpbnB1dDogcGFyYW1ldGVyc0J5QWNjZXNzb3JbIGlucHV0QWNjZXNzb3IgXSxcclxuICAgICAgICAgICAgICAgIG91dHB1dDogcGFyYW1ldGVyc0J5QWNjZXNzb3JbIG91dHB1dEFjY2Vzc29yIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBjcmVhdGVBbmltYXRpb25zOiBmdW5jdGlvbigganNvbiwgYnVmZmVycyApIHtcclxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvbnNCeVRhcmdldCA9IHt9LFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyc0J5QWNjZXNzb3IgPSB7fSxcclxuICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgZm9yICgga2V5IGluIGpzb24uYW5pbWF0aW9ucyApIHtcclxuICAgICAgICAgICAgICAgIGlmICgganNvbi5hbmltYXRpb25zLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVBbmltYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbnNCeVRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyc0J5QWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uYW5pbWF0aW9uc1sga2V5IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcnMgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc0J5VGFyZ2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcclxuICAgICAgICBnbFRGVXRpbCA9IHJlcXVpcmUoJy4vZ2xURlV0aWwnKSxcclxuICAgICAgICBnbFRGTWF0ZXJpYWwgPSByZXF1aXJlKCcuL2dsVEZNYXRlcmlhbCcpLFxyXG4gICAgICAgIGdsVEZBbmltYXRpb24gPSByZXF1aXJlKCcuL2dsVEZBbmltYXRpb24nKSxcclxuICAgICAgICBnbFRGTWVzaCA9IHJlcXVpcmUoJy4vZ2xURk1lc2gnKSxcclxuICAgICAgICBnbFRGUGFyc2VyID0gcmVxdWlyZSgnLi9nbFRGUGFyc2VyJyksXHJcbiAgICAgICAgZ2xURlNrZWxldG9uID0gcmVxdWlyZSgnLi9nbFRGU2tlbGV0b24nKSxcclxuICAgICAgICBVdGlsID0gcmVxdWlyZSgnLi4vVXRpbCcpLFxyXG4gICAgICAgIEVudGl0eSA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlci9FbnRpdHknKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbnRpdHlSZWN1cnNpdmUoIGpzb24sIG1lc2hlcywgYnVmZmVycywgbm9kZU5hbWUgKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBqc29uLm5vZGVzWyBub2RlTmFtZSBdLFxyXG4gICAgICAgICAgICBub2RlTWVzaGVzID0gW10sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gW10sXHJcbiAgICAgICAgICAgIHNrZWxldG9uID0gbnVsbCxcclxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IG51bGwsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybSxcclxuICAgICAgICAgICAgY2hpbGQsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gY2hlY2sgdHlwZSBvZiBub2RlXHJcbiAgICAgICAgaWYgKCBub2RlLmpvaW50TmFtZSB8fCBub2RlLmNhbWVyYSB8fCBub2RlLmxpZ2h0ICkge1xyXG4gICAgICAgICAgICAvLyBub2RlIGlzIGVpdGhlciBhIGpvaW50LCBjYW1lcmEsIG9yIGxpZ2h0LCBzbyBpZ25vcmUgaXQgYXMgYW4gZW50aXR5XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgdGhlIG5vZGVzIHRyYW5zZm9ybVxyXG4gICAgICAgIHRyYW5zZm9ybSA9IGdsVEZVdGlsLmdldE5vZGVNYXRyaXgoIG5vZGUgKS5kZWNvbXBvc2UoKTtcclxuICAgICAgICAvLyByZWN1cnNpdmVseSBhc3NlbWJsZSB0aGUgc2tlbGV0b24gam9pbnQgdHJlZVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IGNyZWF0ZUVudGl0eVJlY3Vyc2l2ZSgganNvbiwgbWVzaGVzLCBidWZmZXJzLCBub2RlLmNoaWxkcmVuW2ldICk7XHJcbiAgICAgICAgICAgIC8vIGVudGl0eSBjYW4gYmUgbnVsbCBzaW5jZSB3ZSBpZ25vcmUgY2FtZXJhcywgam9pbnRzLCBhbmQgbGlnaHRzXHJcbiAgICAgICAgICAgIGlmICggY2hpbGQgKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKCBjaGlsZCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIG5vZGUgaGFzIGEgbWVzaCwgYWRkIGl0LFxyXG4gICAgICAgIGlmICggbm9kZS5tZXNoZXMgKSB7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxub2RlLm1lc2hlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIG5vZGVNZXNoZXMgPSBub2RlTWVzaGVzLmNvbmNhdCggbWVzaGVzWyBub2RlLm1lc2hlc1tpXSBdICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgbm9kZSBoYXMgYW4gaW5zdGFuY2VTa2luLCBjcmVhdGUgc2tlbGV0b24gLyBhbmltYXRpb25zXHJcbiAgICAgICAgaWYgKCBub2RlLmluc3RhbmNlU2tpbiApIHtcclxuICAgICAgICAgICAgLy8gc2tlbGV0b25cclxuICAgICAgICAgICAgc2tlbGV0b24gPSBnbFRGU2tlbGV0b24uY3JlYXRlU2tlbGV0b24oIGpzb24sIG5vZGUuaW5zdGFuY2VTa2luLCBidWZmZXJzICk7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxub2RlLmluc3RhbmNlU2tpbi5tZXNoZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlTWVzaGVzID0gbm9kZU1lc2hlcy5jb25jYXQoIG1lc2hlc1sgbm9kZS5pbnN0YW5jZVNraW4ubWVzaGVzW2ldIF0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhbmltYXRpb25zXHJcbiAgICAgICAgICAgIC8vIE5PVEU6IGFuaW1hdGlvbnMgdGVjaG5pY2FsbHkgbWF5IG5vdCByZXF1aXJlIGEgc2tlbGV0b25cclxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IGdsVEZBbmltYXRpb24uY3JlYXRlQW5pbWF0aW9ucygganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEVudGl0eSh7XHJcbiAgICAgICAgICAgIGlkOiBub2RlTmFtZSxcclxuICAgICAgICAgICAgdXA6IHRyYW5zZm9ybS51cCxcclxuICAgICAgICAgICAgZm9yd2FyZDogdHJhbnNmb3JtLmZvcndhcmQsXHJcbiAgICAgICAgICAgIGxlZnQ6IHRyYW5zZm9ybS5sZWZ0LFxyXG4gICAgICAgICAgICBvcmlnaW46IHRyYW5zZm9ybS5vcmlnaW4sXHJcbiAgICAgICAgICAgIHNjYWxlOiB0cmFuc2Zvcm0uc2NhbGUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICAgICAgbWVzaGVzOiBub2RlTWVzaGVzLFxyXG4gICAgICAgICAgICBza2VsZXRvbjogc2tlbGV0b24sXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbnM6IGFuaW1hdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbnRpdGllcygganNvbiwgbWVzaGVzLCBidWZmZXJzICkge1xyXG4gICAgICAgIHZhciByb290Tm9kZXMgPSBqc29uLnNjZW5lc1sganNvbi5zY2VuZSBdLm5vZGVzLFxyXG4gICAgICAgICAgICBlbnRpdGllcyA9IFtdLFxyXG4gICAgICAgICAgICBlbnRpdHksXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggbm9kZVxyXG4gICAgICAgIGZvciAoIGk9MDsgaTxyb290Tm9kZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGVudGl0eSA9IGNyZWF0ZUVudGl0eVJlY3Vyc2l2ZSgganNvbiwgbWVzaGVzLCBidWZmZXJzLCByb290Tm9kZXNbaV0gKTtcclxuICAgICAgICAgICAgLy8gZW50aXR5IGNhbiBiZSBudWxsIHNpbmNlIHdlIGlnbm9yZSBjYW1lcmFzLCBqb2ludHMsIGFuZCBsaWdodHNcclxuICAgICAgICAgICAgaWYgKCBlbnRpdHkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXRpZXMucHVzaCggZW50aXR5ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRFbnRpdHkoIGpzb24sIGNhbGxiYWNrICkge1xyXG4gICAgICAgIC8vIHdhaXQgZm9yIGFycmF5YnVmZmVycyBhbmQgbWF0ZXJpYWxzXHJcbiAgICAgICAgVXRpbC5hc3luYyhcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyczogZnVuY3Rpb24oIGRvbmUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCByZXF1ZXN0cyBmb3IgYnVmZmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIGdsVEZVdGlsLnJlcXVlc3RCdWZmZXJzKCBqc29uLmJ1ZmZlcnMsIGZ1bmN0aW9uKCBidWZmZXJzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCBidWZmZXJzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxzOiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIG1hdGVyaWFsIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBnbFRGTWF0ZXJpYWwubG9hZE1hdGVyaWFscygganNvbiwgZnVuY3Rpb24oIG1hdGVyaWFscyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggbWF0ZXJpYWxzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCByZXN1bHQgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbWVzaGVzLCB0aGVuIGVudGl0aWVzXHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzaGVzID0gZ2xURk1lc2guY3JlYXRlTWVzaGVzKCBqc29uLCByZXN1bHQuYnVmZmVycywgcmVzdWx0Lm1hdGVyaWFscyApO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIGNyZWF0ZUVudGl0aWVzKCBqc29uLCBtZXNoZXMsIHJlc3VsdC5idWZmZXJzICkgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvYWRzIGEgZ2xURiBKU09OIGZpbGUsIGdlbmVyYXRlcyBhIE1vZGVsIG9iamVjdCwgYW5kIHBhc3NlcyBpdCB0b1xyXG4gICAgICAgICAqIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB1cG9uIGNvbXBsZXRpb24uIFRoaXMgYWxzbyBpbnZvbHZlcyBsb2FkaW5nIGFuZFxyXG4gICAgICAgICAqIGdlbmVyYXRpbmcgdGhlIGFzc29jaWF0ZWQgTWF0ZXJpYWwgb2JqZWN0cy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHRoZSBKU09OIGZpbGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb25lIGV4ZWN1dGVkIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsb2FkOiBmdW5jdGlvbiggdXJsLCBjYWxsYmFjayApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RlbE5hbWUgPSBwYXRoLmJhc2VuYW1lKCB1cmwsIHBhdGguZXh0bmFtZSggdXJsICkgKSxcclxuICAgICAgICAgICAgICAgIHBhcnNlciA9IE9iamVjdC5jcmVhdGUoIGdsVEZQYXJzZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVMb2FkQ29tcGxldGVkOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRFbnRpdHkoIHRoaXMuanNvbiwgZnVuY3Rpb24oIGNoaWxkcmVuICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RlbCA9IG5ldyBFbnRpdHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG1vZGVsTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggbW9kZWwgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHBhcnNlci5pbml0V2l0aFBhdGgoIHVybCApO1xyXG4gICAgICAgICAgICBwYXJzZXIubG9hZCggbnVsbCwgbnVsbCApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL1V0aWwnKSxcclxuICAgICAgICBnbFRGVXRpbCA9IHJlcXVpcmUoJy4vZ2xURlV0aWwnKSxcclxuICAgICAgICBUZXh0dXJlMkQgPSByZXF1aXJlKCcuLi8uLi9jb3JlL1RleHR1cmUyRCcpLFxyXG4gICAgICAgIE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL01hdGVyaWFsJyk7XHJcblxyXG4gICAgdmFyIFRFWFRVUkVfRk9STUFUUyA9IHtcclxuICAgICAgICBcIjY0MDZcIjogXCJBTFBIQVwiLFxyXG4gICAgICAgIFwiNjQwN1wiOiBcIlJHQlwiLFxyXG4gICAgICAgIFwiNjQwOFwiOiBcIlJHQkFcIixcclxuICAgICAgICBcIjY0MDlcIjogXCJMVU1JTkFOQ0VcIixcclxuICAgICAgICBcIjY0MTBcIjogXCJMVU1JTkFOQ0VfQUxQSEFcIixcclxuICAgICAgICBcImRlZmF1bHRcIjogXCJSR0JBXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRFWFRVUkVfSU5URVJOQUxfRk9STUFUUyA9IHtcclxuICAgICAgICBcIjY0MDZcIjogXCJBTFBIQVwiLFxyXG4gICAgICAgIFwiNjQwN1wiOiBcIlJHQlwiLFxyXG4gICAgICAgIFwiNjQwOFwiOiBcIlJHQkFcIixcclxuICAgICAgICBcIjY0MDlcIjogXCJMVU1JTkFOQ0VcIixcclxuICAgICAgICBcIjY0MTBcIjogXCJMVU1JTkFOQ0VfQUxQSEFcIixcclxuICAgICAgICBcImRlZmF1bHRcIjogXCJSR0JBXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRFWFRVUkVfVFlQRVMgPSB7XHJcbiAgICAgICAgXCI1MTIxXCI6IFwiVU5TSUdORURfQllURVwiLFxyXG4gICAgICAgIFwiMzM2MzVcIjogXCJVTlNJR05FRF9TSE9SVF81XzZfNVwiLFxyXG4gICAgICAgIFwiMzI4MTlcIjogXCJVTlNJR05FRF9TSE9SVF80XzRfNF80XCIsXHJcbiAgICAgICAgXCIzMjgyMFwiOiBcIlVOU0lHTkVEX1NIT1JUXzVfNV81XzFcIixcclxuICAgICAgICBcImRlZmF1bHRcIjogXCJVTlNJR05FRF9CWVRFXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRFQ0hOSVFVRV9QQVJBTUVURVJfVFlQRVMgPSB7XHJcbiAgICAgICAgXCI1MTIyXCI6IFwiU0hPUlRcIixcclxuICAgICAgICBcIjUxMjNcIjogXCJVTlNJR05FRF9TSE9SVFwiLFxyXG4gICAgICAgIFwiNTEyNFwiOiBcIklOVFwiLFxyXG4gICAgICAgIFwiNTEyNVwiOiBcIlVOU0lHTkVEX0lOVFwiLFxyXG4gICAgICAgIFwiNTEyNlwiOiBcIkZMT0FUXCIsXHJcbiAgICAgICAgXCIzNTY2NFwiOiBcIkZMT0FUX1ZFQzJcIixcclxuICAgICAgICBcIjM1NjY1XCI6IFwiRkxPQVRfVkVDM1wiLFxyXG4gICAgICAgIFwiMzU2NjZcIjogXCJGTE9BVF9WRUM0XCIsXHJcbiAgICAgICAgXCIzNTY2N1wiOiBcIklOVF9WRUMyXCIsXHJcbiAgICAgICAgXCIzNTY2OFwiOiBcIklOVF9WRUMzXCIsXHJcbiAgICAgICAgXCIzNTY2OVwiOiBcIklOVF9WRUM0XCIsXHJcbiAgICAgICAgXCIzNTY3MFwiOiBcIkJPT0xcIixcclxuICAgICAgICBcIjM1NjcxXCI6IFwiQk9PTF9WRUMyXCIsXHJcbiAgICAgICAgXCIzNTY3MlwiOiBcIkJPT0xfVkVDM1wiLFxyXG4gICAgICAgIFwiMzU2NzNcIjogXCJCT09MX1ZFQzRcIixcclxuICAgICAgICBcIjM1Njc0XCI6IFwiRkxPQVRfTUFUMlwiLFxyXG4gICAgICAgIFwiMzU2NzVcIjogXCJGTE9BVF9NQVQzXCIsXHJcbiAgICAgICAgXCIzNTY3NlwiOiBcIkZMT0FUX01BVDRcIixcclxuICAgICAgICBcIjM1Njc4XCI6IFwiU0FNUExFUl8yRFwiXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgcHJvcGVydHkgZm9yIHRoZSBtYXRlcmlhbCBiYXNlZCBvbiBpdHMgbmFtZS4gSWYgdGhlcmUgaXMgbm8gdmFsdWUsXHJcbiAgICAgKiBhc3NpZ24gaXQgYSBkZWZhdWx0IGNvbG9yLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtYXRlcmlhbCAtIFRoZSBjdXJyZW50IG1hdGVyaWFsIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbWV0ZXJOYW1lIC0gVGhlIG1hdGVyaWFsIHBhcmFtZXRlcnMgbmFtZS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVRlY2huaXF1ZSAtIFRoZSBpbnN0YW5jZVRlY2huaXF1ZSBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGV4dHVyZXMgLSBUaGUgbWFwIG9mIFRleHR1cmUyRCBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRNYXRlcmlhbEF0dHJpYnV0ZSggbWF0ZXJpYWwsIHBhcmFtZXRlck5hbWUsIGluc3RhbmNlVGVjaG5pcXVlLCB0ZXh0dXJlcyApIHtcclxuICAgICAgICB2YXIgcGFyYW1ldGVyID0gaW5zdGFuY2VUZWNobmlxdWVbIHBhcmFtZXRlck5hbWUgXTtcclxuICAgICAgICBpZiAoIHBhcmFtZXRlciApIHtcclxuICAgICAgICAgICAgaWYgKCBURUNITklRVUVfUEFSQU1FVEVSX1RZUEVTWyBwYXJhbWV0ZXIudHlwZSBdID09PSBcIlNBTVBMRVJfMkRcIiApIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCB0ZXh0dXJlXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbFsgcGFyYW1ldGVyTmFtZSArIFwiVGV4dHVyZVwiIF0gPSB0ZXh0dXJlc1sgcGFyYW1ldGVyLnZhbHVlIF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgY29sb3JcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsWyBwYXJhbWV0ZXJOYW1lICsgXCJDb2xvclwiIF0gPSBwYXJhbWV0ZXIudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZSBhIE1hdGVyaWFsIG9iamVjdCBmcm9tIHRoZSBpbnN0YW5jZVRlY2huaXF1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWF0ZXJpYWxJZCAtIFRoZSBtYXRlcmlhbHMgdW5pcXVlIGlkO1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlVGVjaG5pcXVlIC0gVGhlIGluc3RhbmNlVGVjaG5pcXVlIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXh0dXJlcyAtIFRoZSBtYXAgb2YgVGV4dHVyZTJEIG9iamVjdHMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGluc3RhbnRpYXRlZCBNYXRlcmlhbCBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1hdGVyaWFsKCBtYXRlcmlhbElkLCBpbnN0YW5jZVRlY2huaXF1ZSwgdGV4dHVyZXMgKSB7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsID0ge1xyXG4gICAgICAgICAgICBpZDogbWF0ZXJpYWxJZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gc2V0IGFtYmllbnQgdGV4dHVyZSBvciBjb2xvclxyXG4gICAgICAgIHNldE1hdGVyaWFsQXR0cmlidXRlKFxyXG4gICAgICAgICAgICBtYXRlcmlhbCxcclxuICAgICAgICAgICAgJ2FtYmllbnQnLFxyXG4gICAgICAgICAgICBpbnN0YW5jZVRlY2huaXF1ZSxcclxuICAgICAgICAgICAgdGV4dHVyZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIHNldCBkaWZmdXNlIHRleHR1cmUgb3IgY29sb3JcclxuICAgICAgICBzZXRNYXRlcmlhbEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICdkaWZmdXNlJyxcclxuICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUsXHJcbiAgICAgICAgICAgIHRleHR1cmVzXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBzZXQgc3BlY3VsYXIgdGV4dHVyZSBvciBjb2xvclxyXG4gICAgICAgIHNldE1hdGVyaWFsQXR0cmlidXRlKFxyXG4gICAgICAgICAgICBtYXRlcmlhbCxcclxuICAgICAgICAgICAgJ3NwZWN1bGFyJyxcclxuICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUsXHJcbiAgICAgICAgICAgIHRleHR1cmVzXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBzZXQgc3BlY3VsYXIgY29tcG9uZW50XHJcbiAgICAgICAgaWYgKCBpbnN0YW5jZVRlY2huaXF1ZS5zaGluaW5lc3MgKSB7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyQ29tcG9uZW50ID0gaW5zdGFuY2VUZWNobmlxdWUuc2hpbmluZXNzLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IE1hdGVyaWFsKCBtYXRlcmlhbCApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBnbFRGICdtYXRlcmlhbCcgaGFzIGFuICdpbnN0YW5jZVRlY2huaXF1ZScgYXR0cmlidXRlIHRoYXQgcmVmZXJlbmNlc1xyXG4gICAgICogdGhlICd0ZWNobmlxdWUnIHRvIG92ZXJyaWRlLiBUaGlzIGZ1bmN0aW9uIG92ZXJsYXlzIHRoZSB2YWx1ZXMgZnJvbSB0aGVcclxuICAgICAqIGluc3RhbmNlVGVjaG5pcXVlIG9udG8gdGhlIHRlY2huaXF1ZSBhbmQgcmV0dXJucyBpdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVjaG5pcXVlIC0gVGhlIHRlY2huaXF1ZSB0byBvdmVycmlkZS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVRlY2huaXF1ZSAtIFRoZSBpbnN0YW5jZVRlY2huaXF1ZSB0aGF0IGNvbnRhaW5zIHRoZSBvdmVycmlkZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIG92ZXJyaWRlZCB0ZWNobmlxdWUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG92ZXJyaWRlVGVjaG5pcXVlV2l0aEluc3RhbmNlKCB0ZWNobmlxdWUsIGluc3RhbmNlVGVjaG5pcXVlICkge1xyXG4gICAgICAgIHZhciB0ZWNobmlxdWVQYXJhbWV0ZXJzID0gIFV0aWwuY29weSggdGVjaG5pcXVlLnBhcmFtZXRlcnMgKSxcclxuICAgICAgICAgICAgaW5zdGFuY2VWYWx1ZXMgPSBVdGlsLmNvcHkoIGluc3RhbmNlVGVjaG5pcXVlLnZhbHVlcyApLFxyXG4gICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggcGFyYW1ldGVyIGluIHRoZSAndGVjaG5pcXVlJyBub2RlLCBvdmVycmlkZSB3aXRoXHJcbiAgICAgICAgLy8gJ2luc3RhbmNlVGVjaG5pcXVlJyB2YWx1ZSwgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgZm9yICgga2V5IGluIGluc3RhbmNlVmFsdWVzICkge1xyXG4gICAgICAgICAgICBpZiAoIGluc3RhbmNlVmFsdWVzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCBvciBvdmVycmlkZSB0aGUgdGVjaG5pcXVlcyB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgdGVjaG5pcXVlUGFyYW1ldGVyc1sga2V5IF0udmFsdWUgPSBpbnN0YW5jZVZhbHVlc1sga2V5IF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlY2huaXF1ZVBhcmFtZXRlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW5kIHJldHVybnMgYSBtYXAgb2YgYWxsIE1hdGVyaWFsIG9iamVjdHMgZGVmaW5lZCBpbiB0aGVcclxuICAgICAqIGdsVEYgSlNPTi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ganNvbiAtIFRoZSBnbFRGIEpTT04uXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGV4dHVyZXMgLSBUaGUgbWFwIG9mIFRleHR1cmUyRCBvYmplY3RzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtYXAgb2YgTWF0ZXJpYWwgb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlTWF0ZXJpYWxzKCBqc29uLCB0ZXh0dXJlcyApIHtcclxuICAgICAgICB2YXIgbWF0ZXJpYWxzID0ganNvbi5tYXRlcmlhbHMsXHJcbiAgICAgICAgICAgIHRlY2huaXF1ZXMgPSBqc29uLnRlY2huaXF1ZXMsXHJcbiAgICAgICAgICAgIHJlc3VsdHMgPSB7fSxcclxuICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUsXHJcbiAgICAgICAgICAgIG92ZXJyaWRkZW5UZWNobmlxdWUsXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBtYXRlcmlhbFxyXG4gICAgICAgIGZvciAoIGtleSBpbiBtYXRlcmlhbHMgKSB7XHJcbiAgICAgICAgICAgIGlmICggbWF0ZXJpYWxzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlVGVjaG5pcXVlID0gbWF0ZXJpYWxzWyBrZXkgXS5pbnN0YW5jZVRlY2huaXF1ZTtcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJpZGUgdGhlIHRlY2huaXF1ZSB2YWx1ZXMgd2l0aCBpbnN0YW5jZSB0ZWNobmlxdWUgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBvdmVycmlkZGVuVGVjaG5pcXVlID0gb3ZlcnJpZGVUZWNobmlxdWVXaXRoSW5zdGFuY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgdGVjaG5pcXVlc1sgaW5zdGFuY2VUZWNobmlxdWUudGVjaG5pcXVlIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VUZWNobmlxdWUgKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbm5lY3QgdGV4dHVyZSBpbWFnZSBzb3VyY2VzXHJcbiAgICAgICAgICAgICAgICByZXN1bHRzWyBrZXkgXSA9IGNyZWF0ZU1hdGVyaWFsKCBrZXksIG92ZXJyaWRkZW5UZWNobmlxdWUsIHRleHR1cmVzICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnN0YW50aWF0ZXMgYW5kIHJldHVybnMgYSBtYXAgb2YgYWxsIFRleHR1cmUyRCBvYmplY3RzIGRlZmluZWQgaW4gdGhlXHJcbiAgICAgKiBnbFRGIEpTT04uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGpzb24gLSBUaGUgZ2xURiBKU09OLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGltYWdlcyAtIFRoZSBtYXAgb2YgSW1hZ2Ugb2JqZWN0cy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbWFwIG9mIFRleHR1cmUyRCBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVUZXh0dXJlcygganNvbiwgaW1hZ2VzICkge1xyXG4gICAgICAgIHZhciB0ZXh0dXJlcyA9IGpzb24udGV4dHVyZXMsXHJcbiAgICAgICAgICAgIHRleHR1cmUsXHJcbiAgICAgICAgICAgIHJlc3VsdHMgPSB7fSxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIC8vIGZvciBlYWNoIHRleHR1cmVcclxuICAgICAgICBmb3IgKCBrZXkgaW4gdGV4dHVyZXMgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGV4dHVyZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZSA9IHRleHR1cmVzWyBrZXkgXTtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBUZXh0dXJlMkQgb2JqZWN0IGZyb20gaW1hZ2VcclxuICAgICAgICAgICAgICAgIHJlc3VsdHNbIGtleSBdID0gbmV3IFRleHR1cmUyRCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGltYWdlc1sgdGV4dHVyZS5zb3VyY2UgXSxcclxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFRFWFRVUkVfRk9STUFUU1sgdGV4dHVyZS5mb3JtYXQgXSB8fCBURVhUVVJFX0ZPUk1BVFMuZGVmYXVsdCxcclxuICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbEZvcm1hdDogVEVYVFVSRV9JTlRFUk5BTF9GT1JNQVRTWyB0ZXh0dXJlLmludGVybmFsRm9ybWF0IF0gfHwgVEVYVFVSRV9JTlRFUk5BTF9GT1JNQVRTLmRlZmF1bHQsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogVEVYVFVSRV9UWVBFU1sgdGV4dHVyZS50eXBlIF0gfHwgVEVYVFVSRV9UWVBFUy5kZWZhdWx0LFxyXG4gICAgICAgICAgICAgICAgICAgIHdyYXA6IFwiUkVQRUFUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJ0WTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBMb2FkIGFuZCBjcmVhdGUgYWxsIE1hdGVyaWFsIG9iamVjdHMgc3RvcmVkIGluIHRoZSBnbFRGIEpTT04uIFVwb25cclxuICAgICAgICAgKiBjb21wbGV0aW9uLCBleGVjdXRlcyBjYWxsYmFjayBmdW5jdGlvbiBwYXNzaW5nIG1hdGVyaWFsIG1hcCBhcyBmaXJzdFxyXG4gICAgICAgICAqIGFyZ3VtZW50LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGpzb24gLSBUaGUgZ2xURiBKU09OLlxyXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWRNYXRlcmlhbHM6IGZ1bmN0aW9uKCBqc29uLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgLy8gc2VuZCByZXF1ZXN0cyBmb3IgaW1hZ2VzXHJcbiAgICAgICAgICAgIGdsVEZVdGlsLnJlcXVlc3RJbWFnZXMoIGpzb24uaW1hZ2VzLCBmdW5jdGlvbiggaW1hZ2VzICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRleHR1cmVzIGZyb20gaW1hZ2VzLCB0aGVuIGNyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlcyA9IGNyZWF0ZVRleHR1cmVzKCBqc29uLCBpbWFnZXMgKSxcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHMgPSBjcmVhdGVNYXRlcmlhbHMoIGpzb24sIHRleHR1cmVzICk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggbWF0ZXJpYWxzICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgVmVydGV4QnVmZmVyID0gcmVxdWlyZSgnLi4vLi4vY29yZS9WZXJ0ZXhCdWZmZXInKSxcclxuICAgICAgICBJbmRleEJ1ZmZlciA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvSW5kZXhCdWZmZXInKSxcclxuICAgICAgICBXZWJHTENvbnRleHQgPSByZXF1aXJlKCcuLi8uLi9jb3JlL1dlYkdMQ29udGV4dCcpLFxyXG4gICAgICAgIE1lc2ggPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvTWVzaCcpO1xyXG5cclxuICAgIHZhciBBQ0NFU1NPUl9DT01QT05FTlRfVFlQRVMgPSB7XHJcbiAgICAgICAgXCI1MTIwXCI6IFwiQllURVwiLFxyXG4gICAgICAgIFwiNTEyMVwiOiBcIlVOU0lHTkVEX0JZVEVcIixcclxuICAgICAgICBcIjUxMjJcIjogXCJTSE9SVFwiLFxyXG4gICAgICAgIFwiNTEyM1wiOiBcIlVOU0lHTkVEX1NIT1JUXCIsXHJcbiAgICAgICAgXCI1MTI2XCI6IFwiRkxPQVRcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgUFJJTUlUSVZFX01PREVTID0ge1xyXG4gICAgICAgIFwiMFwiOiBcIlBPSU5UU1wiLFxyXG4gICAgICAgIFwiMVwiOiBcIkxJTkVTXCIsXHJcbiAgICAgICAgXCIyXCI6IFwiTElORV9MT09QXCIsXHJcbiAgICAgICAgXCIzXCI6IFwiTElORV9TVFJJUFwiLFxyXG4gICAgICAgIFwiNFwiOiBcIlRSSUFOR0xFU1wiLFxyXG4gICAgICAgIFwiNVwiOiBcIlRSSUFOR0xFX1NUUklQXCIsXHJcbiAgICAgICAgXCI2XCI6IFwiVFJJQU5HTEVfRkFOXCIsXHJcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiVFJJQU5HTEVTXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIEJVRkZFUlZJRVdfVEFSR0VUUyA9IHtcclxuICAgICAgICBcIjM0OTYyXCI6IFwiQVJSQVlfQlVGRkVSXCIsXHJcbiAgICAgICAgXCIzNDk2M1wiOiBcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIENPTVBPTkVOVF9UWVBFU19UT19UWVBFRF9BUlJBWVMgPSB7XHJcbiAgICAgICAgXCI1MTIwXCI6IEludDhBcnJheSxcclxuICAgICAgICBcIjUxMjFcIjogVWludDhBcnJheSxcclxuICAgICAgICBcIjUxMjJcIjogSW50MTZBcnJheSxcclxuICAgICAgICBcIjUxMjNcIjogVWludDE2QXJyYXksXHJcbiAgICAgICAgXCI1MTI2XCI6IEZsb2F0MzJBcnJheVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgVFlQRVNfVE9fTlVNX0NPTVBPTkVOVFMgPSB7XHJcbiAgICAgICAgXCJTQ0FMQVJcIjogMSxcclxuICAgICAgICBcIlZFQzJcIjogMixcclxuICAgICAgICBcIlZFQzNcIjogMyxcclxuICAgICAgICBcIlZFQzRcIjogNCxcclxuICAgICAgICBcIk1BVDJcIjogNCxcclxuICAgICAgICBcIk1BVDNcIjogOSxcclxuICAgICAgICBcIk1BVDRcIjogMTZcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhY2Nlc3Nvck5hbWUsIGpzb24sIGJ1ZmZlcnMgKSB7XHJcblxyXG4gICAgICAgIGlmICggIWFjY2Vzc29yTmFtZSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZ2wgPSBXZWJHTENvbnRleHQuZ2V0KCksXHJcbiAgICAgICAgICAgIGFjY2Vzc29yID0ganNvbi5hY2Nlc3NvcnNbIGFjY2Vzc29yTmFtZSBdLFxyXG4gICAgICAgICAgICBidWZmZXJWaWV3TmFtZSA9IGFjY2Vzc29yLmJ1ZmZlclZpZXcsXHJcbiAgICAgICAgICAgIGJ1ZmZlclZpZXcgPSBqc29uLmJ1ZmZlclZpZXdzWyBidWZmZXJWaWV3TmFtZSBdLFxyXG4gICAgICAgICAgICBidWZmZXJUYXJnZXQgPSBCVUZGRVJWSUVXX1RBUkdFVFNbIGJ1ZmZlclZpZXcudGFyZ2V0IF0sXHJcbiAgICAgICAgICAgIGFjY2Vzc29yQXJyYXlDb3VudCA9IGFjY2Vzc29yLmNvdW50ICogVFlQRVNfVE9fTlVNX0NPTVBPTkVOVFNbIGFjY2Vzc29yLnR5cGUgXSxcclxuICAgICAgICAgICAgVHlwZWRBcnJheSA9IENPTVBPTkVOVF9UWVBFU19UT19UWVBFRF9BUlJBWVNbIGFjY2Vzc29yLmNvbXBvbmVudFR5cGUgXTtcclxuXHJcbiAgICAgICAgaWYgKCAhd2ViZ2xCdWZmZXJzWyBidWZmZXJWaWV3TmFtZSBdICkge1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGJ1ZmZlciBpZiBpdCBkb2VzbnQgZXhpc3RcclxuICAgICAgICAgICAgd2ViZ2xCdWZmZXJzWyBidWZmZXJWaWV3TmFtZSBdID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgdHlwZSBvZiBidWZmZXIgdGFyZ2V0XHJcbiAgICAgICAgICAgIGJ1ZmZlclRhcmdldCA9IEJVRkZFUlZJRVdfVEFSR0VUU1sgYnVmZmVyVmlldy50YXJnZXQgXTtcclxuICAgICAgICAgICAgLy8gYmluZCBhbmQgc2V0IGJ1ZmZlcnMgYnl0ZSBsZW5ndGhcclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlciggZ2xbIGJ1ZmZlclRhcmdldCBdLCB3ZWJnbEJ1ZmZlcnNbIGJ1ZmZlclZpZXdOYW1lIF0gKTtcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSggZ2xbIGJ1ZmZlclRhcmdldCBdLCBidWZmZXJWaWV3LmJ5dGVMZW5ndGgsIGdsLlNUQVRJQ19EUkFXICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBjYWNoZSBhY2Nlc3NvcnMgc28gdGhhdCB0aGVpciBkYXRhIGlzbid0IGJ1ZmZlcmVkIG11bHRpcGxlIHRpbWVzP1xyXG4gICAgICAgIC8vIGJ1ZmZlciB0aGUgYWNjZXNzb3JzIHN1YiBkYXRhXHJcbiAgICAgICAgZ2wuYnVmZmVyU3ViRGF0YSggZ2xbIGJ1ZmZlclRhcmdldCBdLFxyXG4gICAgICAgICAgICAvLyBidWZmZXIgdGhlIGRhdGEgZnJvbSB0aGUgYWNjZXNzb3JzIG9mZnNldCBpbnRvIHRoZSBXZWJHTEJ1ZmZlclxyXG4gICAgICAgICAgICBhY2Nlc3Nvci5ieXRlT2Zmc2V0LFxyXG4gICAgICAgICAgICBuZXcgVHlwZWRBcnJheShcclxuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgcmVzcGVjdGl2ZSBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgYnVmZmVyc1sgYnVmZmVyVmlldy5idWZmZXIgXSxcclxuICAgICAgICAgICAgICAgIC8vIGNvbWJpbmUgdGhlIGJ1ZmZlclZpZXdzIG9mZnNldCBhbmQgdGhlIGFjY2Vzc29ycyBvZmZzZXRcclxuICAgICAgICAgICAgICAgIGJ1ZmZlclZpZXcuYnl0ZU9mZnNldCArIGFjY2Vzc29yLmJ5dGVPZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IFwidmlld1wiIHRoZSBhY2Nlc3NvcnMgY291bnQgKCB0YWtpbmcgaW50byBhY2NvdW50IHRoZSBudW1iZXIgb2YgY29tcG9uZW50cyBwZXIgdHlwZSApXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NvckFycmF5Q291bnQgKSApO1xyXG4gICAgICAgIC8vIHJldHVybiBhdHRyaWJ1dGVQb2ludGVyXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYnVmZmVyVmlldzogYnVmZmVyVmlld05hbWUsXHJcbiAgICAgICAgICAgIHNpemU6IFRZUEVTX1RPX05VTV9DT01QT05FTlRTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIHR5cGU6IEFDQ0VTU09SX0NPTVBPTkVOVF9UWVBFU1sgYWNjZXNzb3IuY29tcG9uZW50VHlwZSBdLFxyXG4gICAgICAgICAgICBzdHJpZGU6IGFjY2Vzc29yLmJ5dGVTdHJpZGUsXHJcbiAgICAgICAgICAgIG9mZnNldDogYWNjZXNzb3IuYnl0ZU9mZnNldCxcclxuICAgICAgICAgICAgY291bnQ6IGFjY2Vzc29yLmNvdW50XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgaW5kZXgsIGF0dHJpYnV0ZVBvaW50ZXIgKSB7XHJcbiAgICAgICAgaWYgKCAhYXR0cmlidXRlUG9pbnRlciApIHtcclxuICAgICAgICAgICAgLy8gaWdub3JlIGlmIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCB2ZXJ0ZXggYXR0cmlidXRlIHBvaW50ZXIgdW5kZXIgdGhlIGNvcnJlY3Qgd2ViZ2xidWZmZXJcclxuICAgICAgICBwb2ludGVyc0J5QnVmZmVyVmlld1sgYXR0cmlidXRlUG9pbnRlci5idWZmZXJWaWV3IF0gPSBwb2ludGVyc0J5QnVmZmVyVmlld1sgYXR0cmlidXRlUG9pbnRlci5idWZmZXJWaWV3IF0gfHwge307XHJcbiAgICAgICAgcG9pbnRlcnNCeUJ1ZmZlclZpZXdbIGF0dHJpYnV0ZVBvaW50ZXIuYnVmZmVyVmlldyBdWyBpbmRleCBdID0gYXR0cmlidXRlUG9pbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVNZXNoRnJvbVByaW1pdGl2ZSggd2ViZ2xCdWZmZXJzLCBwcmltaXRpdmUsIGpzb24sIGJ1ZmZlcnMsIG1hdGVyaWFscyApIHtcclxuXHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuYXR0cmlidXRlcyxcclxuICAgICAgICAgICAgaW5kaWNlcyA9IHByaW1pdGl2ZS5pbmRpY2VzLFxyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IHByaW1pdGl2ZS5tYXRlcmlhbCxcclxuICAgICAgICAgICAgcG9pbnRlcnNCeUJ1ZmZlclZpZXcgPSB7fSxcclxuICAgICAgICAgICAgdmVydGV4QnVmZmVycyA9IFtdLFxyXG4gICAgICAgICAgICBpbmRleEJ1ZmZlcixcclxuICAgICAgICAgICAgcG9zaXRpb25zUG9pbnRlcixcclxuICAgICAgICAgICAgbm9ybWFsc1BvaW50ZXIsXHJcbiAgICAgICAgICAgIHV2c1BvaW50ZXIsXHJcbiAgICAgICAgICAgIGNvbG9yc1BvaW50ZXIsXHJcbiAgICAgICAgICAgIGpvaW50c1BvaW50ZXIsXHJcbiAgICAgICAgICAgIHdlaWdodHNQb2ludGVyLFxyXG4gICAgICAgICAgICBpbmRpY2VzUG9pbnRlcixcclxuICAgICAgICAgICAgYXR0cmlidXRlUG9pbnRlcnMsXHJcbiAgICAgICAgICAgIGtleTtcclxuICAgICAgICAvLyBidWZmZXIgYXR0cmlidXRlIGRhdGEgYW5kIHN0b3JlIHJlc3VsdGluZyBhdHRyaWJ1dGUgcG9pbnRlcnNcclxuICAgICAgICBwb3NpdGlvbnNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLlBPU0lUSU9OIHx8IGF0dHJpYnV0ZXMuUE9TSVRJT05fMCwganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIG5vcm1hbHNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLk5PUk1BTCB8fCBhdHRyaWJ1dGVzLk5PUk1BTF8wLCBqc29uLCBidWZmZXJzICk7XHJcbiAgICAgICAgdXZzUG9pbnRlciA9IGJ1ZmZlckF0dHJpYnV0ZURhdGEoIHdlYmdsQnVmZmVycywgYXR0cmlidXRlcy5URVhDT09SRCB8fCBhdHRyaWJ1dGVzLlRFWENPT1JEXzAsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICBqb2ludHNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLkpPSU5UIHx8IGF0dHJpYnV0ZXMuSk9JTlRfMCwganNvbiwgYnVmZmVycyApO1xyXG4gICAgICAgIHdlaWdodHNQb2ludGVyID0gYnVmZmVyQXR0cmlidXRlRGF0YSggd2ViZ2xCdWZmZXJzLCBhdHRyaWJ1dGVzLldFSUdIVCB8fCBhdHRyaWJ1dGVzLldFSUdIVF8wLCBqc29uLCBidWZmZXJzICk7XHJcbiAgICAgICAgY29sb3JzUG9pbnRlciA9IGJ1ZmZlckF0dHJpYnV0ZURhdGEoIHdlYmdsQnVmZmVycywgYXR0cmlidXRlcy5DT0xPUiB8fCBhdHRyaWJ1dGVzLkNPTE9SXzAsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICAvLyBjcmVhdGUgbWFwIG9mIHBvaW50ZXJzIGtleWVkIGJ5IGJ1ZmZlcnZpZXdcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIwXCIsIHBvc2l0aW9uc1BvaW50ZXIgKTtcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIxXCIsIG5vcm1hbHNQb2ludGVyICk7XHJcbiAgICAgICAgc2V0UG9pbnRlckJ5QnVmZmVyVmlldyggcG9pbnRlcnNCeUJ1ZmZlclZpZXcsIFwiMlwiLCB1dnNQb2ludGVyICk7XHJcbiAgICAgICAgLy9zZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIzXCIsIGNvbG9yc1BvaW50ZXIgKTtcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCIzXCIsIGpvaW50c1BvaW50ZXIgKTtcclxuICAgICAgICBzZXRQb2ludGVyQnlCdWZmZXJWaWV3KCBwb2ludGVyc0J5QnVmZmVyVmlldywgXCI0XCIsIHdlaWdodHNQb2ludGVyICk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggYnVmZmVydmlldyBjcmVhdGUgYSBWZXJ0ZXhCdWZmZXIgb2JqZWN0LCBhbmRcclxuICAgICAgICAvLyBwYXNzIHRoZSBwb2ludGVycyBmb3IgdGhlIGF0dHJpYnV0ZXMgdGhhdCB1c2UgaXRcclxuICAgICAgICBmb3IgKCBrZXkgaW4gcG9pbnRlcnNCeUJ1ZmZlclZpZXcgKSB7XHJcbiAgICAgICAgICAgIGlmICggcG9pbnRlcnNCeUJ1ZmZlclZpZXcuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlUG9pbnRlcnMgPSBwb2ludGVyc0J5QnVmZmVyVmlld1sga2V5IF07XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgVmVydGV4QnVmZmVyIHRoYXQgcmVmZXJlbmNlcyB0aGUgV2ViR0xCdWZmZXIgZm9yIHRoZSBidWZmZXJ2aWV3XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdWZmZXJzLnB1c2goIG5ldyBWZXJ0ZXhCdWZmZXIoIHdlYmdsQnVmZmVyc1sga2V5IF0sIGF0dHJpYnV0ZVBvaW50ZXJzICkgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgc2ltaWxhciBwb2ludGVyIGZvciBpbmRpY2VzXHJcbiAgICAgICAgaW5kaWNlc1BvaW50ZXIgPSBidWZmZXJBdHRyaWJ1dGVEYXRhKCB3ZWJnbEJ1ZmZlcnMsIGluZGljZXMsIGpzb24sIGJ1ZmZlcnMgKTtcclxuICAgICAgICAvLyBzZXQgcHJpbWlpdmUgbW9kZVxyXG4gICAgICAgIGluZGljZXNQb2ludGVyLm1vZGUgPSBQUklNSVRJVkVfTU9ERVNbIHByaW1pdGl2ZS5wcmltaXRpdmUgXSB8fCBQUklNSVRJVkVfTU9ERVMuZGVmYXVsdDtcclxuICAgICAgICAvLyBjcmVhdGUgSW5kZXhCdWZmZXIgdGhhdCByZWZlcmVuY2VzIHRoZSBXZWJHTEJ1ZmZlciBmb3IgdGhlIGJ1ZmZlcnZpZXdcclxuICAgICAgICBpbmRleEJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlcihcclxuICAgICAgICAgICAgd2ViZ2xCdWZmZXJzWyBpbmRpY2VzUG9pbnRlci5idWZmZXJWaWV3IF0sXHJcbiAgICAgICAgICAgIGluZGljZXNQb2ludGVyICk7XHJcbiAgICAgICAgLy8gaW5zdGFudGlhdGUgdGhlIE1lc2ggb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNoKHtcclxuICAgICAgICAgICAgdmVydGV4QnVmZmVyczogdmVydGV4QnVmZmVycyxcclxuICAgICAgICAgICAgaW5kZXhCdWZmZXI6IGluZGV4QnVmZmVyLFxyXG4gICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWxzWyBtYXRlcmlhbCBdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTWVzaGVzKCB3ZWJnbEJ1ZmZlcnMsIG1lc2gsIGpzb24sIGJ1ZmZlcnMsIG1hdGVyaWFscyApIHtcclxuICAgICAgICB2YXIgcHJpbWl0aXZlcyA9IG1lc2gucHJpbWl0aXZlcyxcclxuICAgICAgICAgICAgbWVzaGVzID0gW10sXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gZm9yIGVhY2ggcHJpbWl0aXZlXHJcbiAgICAgICAgZm9yICggaT0wOyBpPHByaW1pdGl2ZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBtZXNoIGZvciB0aGUgcHJpbWl0aXZlIHNldFxyXG4gICAgICAgICAgICBtZXNoZXMucHVzaChcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU1lc2hGcm9tUHJpbWl0aXZlKFxyXG4gICAgICAgICAgICAgICAgICAgIHdlYmdsQnVmZmVycyxcclxuICAgICAgICAgICAgICAgICAgICBwcmltaXRpdmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIGpzb24sXHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVycyxcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHNcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1lc2hlcztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgY3JlYXRlTWVzaGVzOiBmdW5jdGlvbigganNvbiwgYnVmZmVycywgbWF0ZXJpYWxzICkge1xyXG4gICAgICAgICAgICB2YXIgbWVzaGVzID0ganNvbi5tZXNoZXMsXHJcbiAgICAgICAgICAgICAgICB3ZWJnbEJ1ZmZlcnMgPSB7fSxcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSB7fSxcclxuICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggbWVzaFxyXG4gICAgICAgICAgICBmb3IgKCBrZXkgaW4ganNvbi5tZXNoZXMgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGpzb24ubWVzaGVzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGFycmF5IG9mIG1lc2hlcyBmb3IgdGhlIG1lc2hcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzWyBrZXkgXSA9IGNyZWF0ZU1lc2hlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2ViZ2xCdWZmZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoZXNbIGtleSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHMgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMyBGYWJyaWNlIFJvYmluZXRcclxuLy8gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy9cclxuLy8gUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XHJcbi8vIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG4vL1xyXG4vLyAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4vLyAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbi8vICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcclxuLy8gICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuLy9cclxuLy8gIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXHJcbi8vIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcclxuLy8gSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcclxuLy8gQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxyXG4vLyBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xyXG4vLyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XHJcbi8vIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxyXG4vLyBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxyXG4vLyAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0ZcclxuLy8gVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuXHJcbi8qXHJcbiAgICBUaGUgQWJzdHJhY3QgTG9hZGVyIGhhcyB0d28gbW9kZXM6XHJcbiAgICAgICAgIzE6IFtzdGF0aWNdIGxvYWQgYWxsIHRoZSBKU09OIGF0IG9uY2UgW2FzIG9mIG5vd11cclxuICAgICAgICAjMjogW3N0cmVhbV0gc3RyZWFtIGFuZCBwYXJzZSBKU09OIHByb2dyZXNzaXZlbHkgW25vdCB5ZXQgc3VwcG9ydGVkXVxyXG5cclxuICAgIFdoYXRldmVyIGlzIHRoZSBtZWNoYW5pc20gdXNlZCB0byBwYXJzZSB0aGUgSlNPTiAoIzEgb3IgIzIpLFxyXG4gICAgVGhlIGxvYWRlciBzdGFydHMgYnkgcmVzb2x2aW5nIHRoZSBwYXRocyB0byBiaW5hcmllcyBhbmQgcmVmZXJlbmNlZCBqc29uIGZpbGVzIChieSByZXBsYWNlIHRoZSB2YWx1ZSBvZiB0aGUgcGF0aCBwcm9wZXJ0eSB3aXRoIGFuIGFic29sdXRlIHBhdGggaWYgaXQgd2FzIHJlbGF0aXZlKS5cclxuXHJcbiAgICBJbiBjYXNlICMxOiBpdCBpcyBndWFyYW50ZWVkIHRvIGNhbGwgdGhlIGNvbmNyZXRlIGxvYWRlciBpbXBsZW1lbnRhdGlvbiBtZXRob2RzIGluIGEgb3JkZXIgdGhhdCBzb2x2ZXMgdGhlIGRlcGVuZGVuY2llcyBiZXR3ZWVuIHRoZSBlbnRyaWVzLlxyXG4gICAgb25seSB0aGUgbm9kZXMgcmVxdWlyZXMgYW4gZXh0cmEgcGFzcyB0byBzZXQgdXAgdGhlIGhpcmVyYXJjaHkuXHJcbiAgICBJbiBjYXNlICMyOiB0aGUgY29uY3JldGUgaW1wbGVtZW50YXRpb24gd2lsbCBoYXZlIHRvIHNvbHZlIHRoZSBkZXBlbmRlbmNpZXMuIG5vIG9yZGVyIGlzIGd1YXJhbnRlZWQuXHJcblxyXG4gICAgV2hlbiBjYXNlICMxIGlzIHVzZWQgdGhlIGZvbGxvd2VkIGRlcGVuZGVuY3kgb3JkZXIgaXM6XHJcblxyXG4gICAgc2NlbmVzIC0+IG5vZGVzIC0+IG1lc2hlcyAtPiBtYXRlcmlhbHMgLT4gdGVjaG5pcXVlcyAtPiBzaGFkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgLT4gYnVmZmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIC0+IGNhbWVyYXNcclxuICAgICAgICAgICAgICAgICAgICAtPiBsaWdodHNcclxuXHJcbiAgICBUaGUgcmVhZGVycyBzdGFydHMgd2l0aCB0aGUgbGVhZnMsIGkuZTpcclxuICAgICAgICBzaGFkZXJzLCB0ZWNobmlxdWVzLCBtYXRlcmlhbHMsIG1lc2hlcywgYnVmZmVycywgY2FtZXJhcywgbGlnaHRzLCBub2Rlcywgc2NlbmVzXHJcblxyXG4gICAgRm9yIGVhY2ggY2FsbGVkIGhhbmRsZSBtZXRob2QgY2FsbGVkIHRoZSBjbGllbnQgc2hvdWxkIHJldHVybiB0cnVlIGlmIHRoZSBuZXh0IGhhbmRsZSBjYW4gYmUgY2FsbCByaWdodCBhZnRlciByZXR1cm5pbmcsXHJcbiAgICBvciBmYWxzZSBpZiBhIGNhbGxiYWNrIG9uIGNsaWVudCBzaWRlIHdpbGwgbm90aWZ5IHRoZSBsb2FkZXIgdGhhdCB0aGUgbmV4dCBoYW5kbGUgbWV0aG9kIGNhbiBiZSBjYWxsZWQuXHJcblxyXG4qL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICBcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBjYXRlZ29yaWVzRGVwc09yZGVyID0gW1wiYnVmZmVyc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYnVmZmVyVmlld3NcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImltYWdlc1wiLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZpZGVvc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2FtcGxlcnNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRleHR1cmVzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaGFkZXJzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9ncmFtc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGVjaG5pcXVlc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWF0ZXJpYWxzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NvcnNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lc2hlc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FtZXJhc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGlnaHRzXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJza2luc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZXNcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNjZW5lc1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5pbWF0aW9uc1wiXTtcclxuXHJcbiAgICB2YXIgZ2xURlBhcnNlciA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LnByb3RvdHlwZSwge1xyXG5cclxuICAgICAgICBfcm9vdERlc2NyaXB0aW9uOiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxyXG5cclxuICAgICAgICByb290RGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdERlc2NyaXB0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdERlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYmFzZVVSTDogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcclxuXHJcbiAgICAgICAgLy9kZXRlY3QgYWJzb2x1dGUgcGF0aCBmb2xsb3dpbmcgdGhlIHNhbWUgcHJvdG9jb2wgdGhhbiB3aW5kb3cubG9jYXRpb25cclxuICAgICAgICBfaXNBYnNvbHV0ZVBhdGg6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpc0Fic29sdXRlUGF0aFJlZ0V4cCA9IG5ldyBSZWdFeHAoXCJeXCIrd2luZG93LmxvY2F0aW9uLnByb3RvY29sLCBcImlcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGgubWF0Y2goaXNBYnNvbHV0ZVBhdGhSZWdFeHApID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVzb2x2ZVBhdGhJZk5lZWRlZDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzQWJzb2x1dGVQYXRoKHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVVSTCArIHBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfcmVzb2x2ZVBhdGhzRm9yQ2F0ZWdvcmllczoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKCBmdW5jdGlvbihjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbnMgPSB0aGlzLmpzb25bY2F0ZWdvcnldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uS2V5cyA9IE9iamVjdC5rZXlzKGRlc2NyaXB0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uS2V5cy5mb3JFYWNoKCBmdW5jdGlvbihkZXNjcmlwdGlvbktleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25zW2Rlc2NyaXB0aW9uS2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLnBhdGggPSB0aGlzLnJlc29sdmVQYXRoSWZOZWVkZWQoZGVzY3JpcHRpb24ucGF0aCB8fCBkZXNjcmlwdGlvbi51cmkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9qc29uOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGpzb246IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9qc29uO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fanNvbiAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qc29uID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZVBhdGhzRm9yQ2F0ZWdvcmllcyhbXCJidWZmZXJzXCIsIFwic2hhZGVyc1wiLCBcImltYWdlc1wiLCBcInZpZGVvc1wiXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfcGF0aDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRFbnRyeURlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoZW50cnlJRCwgZW50cnlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZW50cmllcyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNhdGVnb3J5ID0gZW50cnlUeXBlO1xyXG4gICAgICAgICAgICAgICAgZW50cmllcyA9IHRoaXMucm9vdERlc2NyaXB0aW9uW2NhdGVnb3J5XTtcclxuICAgICAgICAgICAgICAgIGlmICghZW50cmllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6Q0FOTk9UIGZpbmQgZXhwZWN0ZWQgY2F0ZWdvcnkgbmFtZWQ6XCIrY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzID8gZW50cmllc1tlbnRyeUlEXSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfc3RlcFRvTmV4dENhdGVnb3J5OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLmNhdGVnb3J5SW5kZXggPSB0aGlzLmdldE5leHRDYXRlZ29yeUluZGV4KHRoaXMuX3N0YXRlLmNhdGVnb3J5SW5kZXggKyAxKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZS5jYXRlZ29yeUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLmNhdGVnb3J5U3RhdGUuaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9zdGVwVG9OZXh0RGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeVN0YXRlID0gdGhpcy5fc3RhdGUuY2F0ZWdvcnlTdGF0ZTtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gY2F0ZWdvcnlTdGF0ZS5rZXlzO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrZXlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTkNPTlNJU1RFTkNZIEVSUk9SXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVN0YXRlLmluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVN0YXRlLmtleXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5U3RhdGUuaW5kZXggPj0ga2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RlcFRvTmV4dENhdGVnb3J5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBoYXNDYXRlZ29yeToge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJvb3REZXNjcmlwdGlvbltjYXRlZ29yeV0gPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfaGFuZGxlU3RhdGU6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtZXRob2RGb3JUeXBlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYnVmZmVyc1wiIDogdGhpcy5oYW5kbGVCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJidWZmZXJWaWV3c1wiIDogdGhpcy5oYW5kbGVCdWZmZXJWaWV3LFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2hhZGVyc1wiIDogdGhpcy5oYW5kbGVTaGFkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9ncmFtc1wiIDogdGhpcy5oYW5kbGVQcm9ncmFtLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVjaG5pcXVlc1wiIDogdGhpcy5oYW5kbGVUZWNobmlxdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtYXRlcmlhbHNcIiA6IHRoaXMuaGFuZGxlTWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXNoZXNcIiA6IHRoaXMuaGFuZGxlTWVzaCxcclxuICAgICAgICAgICAgICAgICAgICBcImNhbWVyYXNcIiA6IHRoaXMuaGFuZGxlQ2FtZXJhLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRzXCIgOiB0aGlzLmhhbmRsZUxpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZXNcIiA6IHRoaXMuaGFuZGxlTm9kZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNjZW5lc1wiIDogdGhpcy5oYW5kbGVTY2VuZSxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlc1wiIDogdGhpcy5oYW5kbGVJbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICBcImFuaW1hdGlvbnNcIiA6IHRoaXMuaGFuZGxlQW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYWNjZXNzb3JzXCIgOiB0aGlzLmhhbmRsZUFjY2Vzc29yLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2tpbnNcIiA6IHRoaXMuaGFuZGxlU2tpbixcclxuICAgICAgICAgICAgICAgICAgICBcInNhbXBsZXJzXCIgOiB0aGlzLmhhbmRsZVNhbXBsZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0dXJlc1wiIDogdGhpcy5oYW5kbGVUZXh0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidmlkZW9zXCIgOiB0aGlzLmhhbmRsZVZpZGVvXHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5fc3RhdGUuY2F0ZWdvcnlJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSBjYXRlZ29yaWVzRGVwc09yZGVyW3RoaXMuX3N0YXRlLmNhdGVnb3J5SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeVN0YXRlID0gdGhpcy5fc3RhdGUuY2F0ZWdvcnlTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5cyA9IGNhdGVnb3J5U3RhdGUua2V5cztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWtleXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlTdGF0ZS5rZXlzID0ga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMucm9vdERlc2NyaXB0aW9uW2NhdGVnb3J5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGVwVG9OZXh0RGVzY3JpcHRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBjYXRlZ29yeTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW50cnlJRCA9IGtleXNbY2F0ZWdvcnlTdGF0ZS5pbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXRFbnRyeURlc2NyaXB0aW9uKGVudHJ5SUQsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoXCJJTkNPTlNJU1RFTkNZIEVSUk9SOiBubyBkZXNjcmlwdGlvbiBmb3VuZCBmb3IgZW50cnkgXCIrZW50cnlJRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kRm9yVHlwZVt0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZEZvclR5cGVbdHlwZV0uY2FsbCh0aGlzLCBlbnRyeUlELCBkZXNjcmlwdGlvbiwgdGhpcy5fc3RhdGUudXNlckluZm8pID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RlcFRvTmV4dERlc2NyaXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhbmRsZUxvYWRDb21wbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWRDb21wbGV0ZWQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2xvYWRKU09OSWZOZWVkZWQ6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvL0ZJWE1FOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fanNvbikgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvblBhdGggPSB0aGlzLl9wYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0ganNvblBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFzZVVSTCA9IChpICE9PSAwKSA/IGpzb25QYXRoLnN1YnN0cmluZygwLCBpICsgMSkgOiAnJztcclxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbmZpbGUgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS5vcGVuKFwiR0VUXCIsIGpzb25QYXRoLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuanNvbiA9IEpTT04ucGFyc2UoanNvbmZpbGUucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNlbGYuanNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAganNvbmZpbGUuc2VuZChudWxsKTtcclxuICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5qc29uKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiBsb2FkIEpTT04gYW5kIGFzc2lnbiBpdCBhcyBkZXNjcmlwdGlvbiB0byB0aGUgcmVhZGVyICovXHJcbiAgICAgICAgX2J1aWxkTG9hZGVyOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gSlNPTlJlYWR5KGpzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJvb3REZXNjcmlwdGlvbiA9IGpzb247XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRKU09OSWZOZWVkZWQoSlNPTlJlYWR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9zdGF0ZTogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcclxuXHJcbiAgICAgICAgX2dldEVudHJ5VHlwZToge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm9vdEtleXMgPSBjYXRlZ29yaWVzRGVwc09yZGVyO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAgOyAgaSA8IHJvb3RLZXlzLmxlbmd0aCA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb290VmFsdWVzID0gdGhpcy5yb290RGVzY3JpcHRpb25bcm9vdEtleXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb290VmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb290S2V5c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldE5leHRDYXRlZ29yeUluZGV4OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihjdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBjdXJyZW50SW5kZXggOyBpIDwgY2F0ZWdvcmllc0RlcHNPcmRlci5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNDYXRlZ29yeShjYXRlZ29yaWVzRGVwc09yZGVyW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbG9hZDoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24odXNlckluZm8sIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J1aWxkTG9hZGVyKGZ1bmN0aW9uIGxvYWRlclJlYWR5KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydENhdGVnb3J5ID0gc2VsZi5nZXROZXh0Q2F0ZWdvcnlJbmRleC5jYWxsKHNlbGYsMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0Q2F0ZWdvcnkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3N0YXRlID0geyBcInVzZXJJbmZvXCIgOiB1c2VySW5mbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiIDogb3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0ZWdvcnlJbmRleFwiIDogc3RhcnRDYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2F0ZWdvcnlTdGF0ZVwiIDogeyBcImluZGV4XCIgOiBcIjBcIiB9IH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2hhbmRsZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0V2l0aFBhdGg6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fanNvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vdGhpcyBpcyBtZWFudCB0byBiZSBnbG9iYWwgYW5kIGNvbW1vbiBmb3IgYWxsIGluc3RhbmNlc1xyXG4gICAgICAgIF9rbm93blVSTHM6IHsgd3JpdGFibGU6IHRydWUsIHZhbHVlOiB7fSB9LFxyXG5cclxuICAgICAgICAvL3RvIGJlIGludm9rZWQgYnkgc3ViY2xhc3MsIHNvIHRoYXQgaWRzIGNhbiBiZSBlbnN1cmVkIHRvIG5vdCBvdmVybGFwXHJcbiAgICAgICAgbG9hZGVyQ29udGV4dDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2tub3duVVJMc1t0aGlzLl9wYXRoXSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tub3duVVJMc1t0aGlzLl9wYXRoXSA9IE9iamVjdC5rZXlzKHRoaXMuX2tub3duVVJMcykubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiX19cIiArIHRoaXMuX2tub3duVVJMc1t0aGlzLl9wYXRoXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRXaXRoSlNPTjoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oanNvbiwgYmFzZVVSTCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qc29uID0ganNvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJhc2VVUkwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IG5vIGJhc2UgVVJMIHBhc3NlZCB0byBSZWFkZXI6aW5pdFdpdGhKU09OXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbFRGUGFyc2VyO1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgYWxmYWRvciA9IHJlcXVpcmUoJ2FsZmFkb3InKSxcclxuICAgICAgICBNYXQzMyA9IGFsZmFkb3IuTWF0MzMsXHJcbiAgICAgICAgTWF0NDQgPSBhbGZhZG9yLk1hdDQ0LFxyXG4gICAgICAgIGdsVEZVdGlsID0gcmVxdWlyZSgnLi9nbFRGVXRpbCcpLFxyXG4gICAgICAgIEpvaW50ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyL0pvaW50JyksXHJcbiAgICAgICAgU2tlbGV0b24gPSByZXF1aXJlKCcuLi8uLi9yZW5kZXIvU2tlbGV0b24nKTtcclxuXHJcbiAgICB2YXIgQ09NUE9ORU5UX1RZUEVTX1RPX0JVRkZFUlZJRVdTID0ge1xyXG4gICAgICAgIFwiNTEyMFwiOiBJbnQ4QXJyYXksXHJcbiAgICAgICAgXCI1MTIxXCI6IFVpbnQ4QXJyYXksXHJcbiAgICAgICAgXCI1MTIyXCI6IEludDE2QXJyYXksXHJcbiAgICAgICAgXCI1MTIzXCI6IFVpbnQxNkFycmF5LFxyXG4gICAgICAgIFwiNTEyNlwiOiBGbG9hdDMyQXJyYXlcclxuICAgIH07XHJcblxyXG4gICAgdmFyIFRZUEVTX1RPX05VTV9DT01QT05FTlRTID0ge1xyXG4gICAgICAgIFwiU0NBTEFSXCI6IDEsXHJcbiAgICAgICAgXCJWRUMyXCI6IDIsXHJcbiAgICAgICAgXCJWRUMzXCI6IDMsXHJcbiAgICAgICAgXCJWRUM0XCI6IDQsXHJcbiAgICAgICAgXCJNQVQyXCI6IDQsXHJcbiAgICAgICAgXCJNQVQzXCI6IDksXHJcbiAgICAgICAgXCJNQVQ0XCI6IDE2XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBUWVBFU19UT19DTEFTUyA9IHtcclxuICAgICAgICBcIk1BVDNcIjogTWF0MzMsXHJcbiAgICAgICAgXCJNQVQ0XCI6IE1hdDQ0XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEludmVyc2VCaW5kTWF0cmljZXMoIGpzb24sIHNraW4sIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgdmFyIGFjY2Vzc29yID0ganNvbi5hY2Nlc3NvcnNbIHNraW4uaW52ZXJzZUJpbmRNYXRyaWNlcyBdLFxyXG4gICAgICAgICAgICBidWZmZXJWaWV3ID0ganNvbi5idWZmZXJWaWV3c1sgYWNjZXNzb3IuYnVmZmVyVmlldyBdLFxyXG4gICAgICAgICAgICBidWZmZXIgPSBidWZmZXJzWyBidWZmZXJWaWV3LmJ1ZmZlciBdLFxyXG4gICAgICAgICAgICBUeXBlZEFycmF5ID0gQ09NUE9ORU5UX1RZUEVTX1RPX0JVRkZFUlZJRVdTWyBhY2Nlc3Nvci5jb21wb25lbnRUeXBlIF0sXHJcbiAgICAgICAgICAgIG51bUNvbXBvbmVudHMgPSBUWVBFU19UT19OVU1fQ09NUE9ORU5UU1sgYWNjZXNzb3IudHlwZSBdLFxyXG4gICAgICAgICAgICBNYXRyaXhDbGFzcyA9IFRZUEVTX1RPX0NMQVNTWyBhY2Nlc3Nvci50eXBlIF0sXHJcbiAgICAgICAgICAgIGFjY2Vzc29yQXJyYXlDb3VudCA9IGFjY2Vzc29yLmNvdW50ICogbnVtQ29tcG9uZW50cyxcclxuICAgICAgICAgICAgYXJyYXlCdWZmZXIgPSBuZXcgVHlwZWRBcnJheSggYnVmZmVyLCBidWZmZXJWaWV3LmJ5dGVPZmZzZXQgKyBhY2Nlc3Nvci5ieXRlT2Zmc2V0LCBhY2Nlc3NvckFycmF5Q291bnQgKSxcclxuICAgICAgICAgICAgaW52ZXJzZUJpbmRNYXRyaWNlcyA9IFtdLFxyXG4gICAgICAgICAgICBiZWdpbkluZGV4LFxyXG4gICAgICAgICAgICBlbmRJbmRleCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBmb3IgZWFjaCBtYXRyaXggaW4gdGhlIGFjY2Vzc29yXHJcbiAgICAgICAgZm9yICggaT0wOyBpPGFjY2Vzc29yLmNvdW50OyBpKysgKSB7XHJcbiAgICAgICAgICAgIC8vIGNhbGMgdGhlIGJlZ2luIGFuZCBlbmQgaW4gYXJyYXlidWZmZXJcclxuICAgICAgICAgICAgYmVnaW5JbmRleCA9IGkgKiBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICBlbmRJbmRleCA9IGJlZ2luSW5kZXggKyBudW1Db21wb25lbnRzO1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHN1YmFycmF5IHRoYXQgY29tcG9zZXMgdGhlIG1hdHJpeFxyXG4gICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgICBuZXcgTWF0cml4Q2xhc3MoIGFycmF5QnVmZmVyLnN1YmFycmF5KCBiZWdpbkluZGV4LCBlbmRJbmRleCApIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludmVyc2VCaW5kTWF0cmljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSm9pbnRIaWVyYXJjaHkoIGpzb24sIG5vZGVOYW1lLCBwYXJlbnQsIHNraW4sIGludmVyc2VCaW5kTWF0cmljZXMgKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBqc29uLm5vZGVzWyBub2RlTmFtZSBdLFxyXG4gICAgICAgICAgICBqb2ludEluZGV4ID0gc2tpbi5qb2ludE5hbWVzLmluZGV4T2YoIG5vZGUuam9pbnROYW1lICksXHJcbiAgICAgICAgICAgIGJpbmRNYXRyaXgsXHJcbiAgICAgICAgICAgIGludmVyc2VCaW5kTWF0cml4LFxyXG4gICAgICAgICAgICBjaGlsZCxcclxuICAgICAgICAgICAgam9pbnQsXHJcbiAgICAgICAgICAgIGk7XHJcbiAgICAgICAgLy8gaWYgam9pbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHNraW5zIGpvaW50TmFtZXMsIGlnbm9yZVxyXG4gICAgICAgIGlmICggam9pbnRJbmRleCA9PT0gLTEgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgdGhlIGJpbmQgLyBpbnZlcnNlIGJpbmQgbWF0cmljZXNcclxuICAgICAgICBiaW5kTWF0cml4ID0gZ2xURlV0aWwuZ2V0Tm9kZU1hdHJpeCggbm9kZSApO1xyXG4gICAgICAgIGludmVyc2VCaW5kTWF0cml4ID0gaW52ZXJzZUJpbmRNYXRyaWNlc1sgam9pbnRJbmRleCBdO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBqb2ludCBoZXJlIGZpcnN0LCBpbiBvcmRlciB0byBwYXNzIGFzIHBhcmVudCB0byByZWN1cnNpb25zXHJcbiAgICAgICAgam9pbnQgPSBuZXcgSm9pbnQoe1xyXG4gICAgICAgICAgICBpZDogbm9kZU5hbWUsXHJcbiAgICAgICAgICAgIG5hbWU6IG5vZGUuam9pbnROYW1lLFxyXG4gICAgICAgICAgICBiaW5kTWF0cml4OiBiaW5kTWF0cml4LFxyXG4gICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpeDogaW52ZXJzZUJpbmRNYXRyaXgsXHJcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW10sIC8vIGFycmF5IHdpbGwgYmUgZW1wdHkgaGVyZSwgYnV0IHBvcHVsYXRlZCBzdWJzZXF1ZW50bHlcclxuICAgICAgICAgICAgaW5kZXg6IGpvaW50SW5kZXhcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBmaWxsIGluIGNoaWxkcmVuIGFycmF5XHJcbiAgICAgICAgZm9yICggaT0wOyBpPG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gY3JlYXRlSm9pbnRIaWVyYXJjaHkoIGpzb24sIG5vZGUuY2hpbGRyZW5baV0sIGpvaW50LCBza2luLCBpbnZlcnNlQmluZE1hdHJpY2VzICk7XHJcbiAgICAgICAgICAgIGlmICggY2hpbGQgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGFkZCBpZiBqb2ludCBleGlzdHMgaW4gam9pbnROYW1lc1xyXG4gICAgICAgICAgICAgICAgam9pbnQuY2hpbGRyZW4ucHVzaCggY2hpbGQgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gam9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBlYWNoIHNrZWxldG9uIHJvb3Qgbm9kZSBpbiBhbiBpbnN0YW5jZVNraW4sIGJ1aWxkIHRoZSBqb2ludFxyXG4gICAgICAgICAqIGhpZXJhcmNoaWVzIGFuZCByZXR1cm4gYSBzaW5nbGUgU2tlbGV0b24gb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGpzb24gLSBUaGUgZ2xURiBKU09OLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVNraW4gLSBUaGUgaW5zdGFuY2VTa2luIG9iamVjdCBmb3IgdGhlIG5vZGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGJ1ZmZlcnMgLSBUaGUgbWFwIG9mIGxvYWRlZCBidWZmZXJzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge1NrZWxldG9ufSBUaGUgU2tlbGV0b24gb2JqZWN0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNyZWF0ZVNrZWxldG9uOiBmdW5jdGlvbigganNvbiwgaW5zdGFuY2VTa2luLCBidWZmZXJzICkge1xyXG4gICAgICAgICAgICAvLyBmaXJzdCBmaW5kIG5vZGVzIHdpdGggdGhlIG5hbWVzIGluIHRoZSBpbnN0YW5jZVNraW4uc2tlbGV0b25zXHJcbiAgICAgICAgICAgIC8vIHRoZW4gc2VhcmNoIG9ubHkgdGhvc2Ugbm9kZXMgYW5kIHRoZWlyIHN1YiB0cmVlcyBmb3Igbm9kZXMgd2l0aFxyXG4gICAgICAgICAgICAvLyBqb2ludElkIGVxdWFsIHRvIHRoZSBzdHJpbmdzIGluIHNraW4uam9pbnRzXHJcbiAgICAgICAgICAgIHZhciBza2VsZXRvbnMgPSBpbnN0YW5jZVNraW4uc2tlbGV0b25zLFxyXG4gICAgICAgICAgICAgICAgc2tpbiA9IGpzb24uc2tpbnNbIGluc3RhbmNlU2tpbi5za2luIF0sXHJcbiAgICAgICAgICAgICAgICBpbnZlcnNlQmluZE1hdHJpY2VzID0gZ2V0SW52ZXJzZUJpbmRNYXRyaWNlcygganNvbiwgc2tpbiwgYnVmZmVycyApLFxyXG4gICAgICAgICAgICAgICAgcm9vdE5vZGVzID0gW10sXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCByb290IG5vZGUsIGNyZWF0ZSBoaWVyYXJjaHkgb2YgSm9pbnQgb2JqZWN0c1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8c2tlbGV0b25zLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgcm9vdE5vZGVzLnB1c2goIGNyZWF0ZUpvaW50SGllcmFyY2h5KCBqc29uLCBza2VsZXRvbnNbaV0sIG51bGwsIHNraW4sIGludmVyc2VCaW5kTWF0cmljZXMgKSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBTa2VsZXRvbiBvYmplY3RcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTa2VsZXRvbih7XHJcbiAgICAgICAgICAgICAgICByb290OiByb290Tm9kZXMsXHJcbiAgICAgICAgICAgICAgICBiaW5kU2hhcGVNYXRyaXg6IG5ldyBNYXQ0NCggc2tpbi5iaW5kU2hhcGVNYXRyaXggfHwgW10gKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFsZmFkb3IgPSByZXF1aXJlKCdhbGZhZG9yJyksXHJcbiAgICAgICAgUXVhdGVybmlvbiA9IGFsZmFkb3IuUXVhdGVybmlvbixcclxuICAgICAgICBNYXQ0NCA9IGFsZmFkb3IuTWF0NDQsXHJcbiAgICAgICAgVmVjMiA9IGFsZmFkb3IuVmVjMixcclxuICAgICAgICBWZWMzID0gYWxmYWRvci5WZWMzLFxyXG4gICAgICAgIFZlYzQgPSBhbGZhZG9yLlZlYzQsXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL1V0aWwnKSxcclxuICAgICAgICBYSFJMb2FkZXIgPSByZXF1aXJlKCcuLi9YSFJMb2FkZXInKTtcclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydHMgYW4gYXJyYXlidWZmZXIgb2JqZWN0IHRvIGFuIGFycmF5IG9mIFZlYzQgb2JqZWN0cy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5IC0gVGhlIEFycmF5QnVmZmVyIG9iamVjdCB0byBjb252ZXJ0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gLSBUaGUgY29udmVydGVkIGFycmF5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnZlcnRWZWM0QXJyYXk6IGZ1bmN0aW9uKCBhcnJheSApIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSggYXJyYXkubGVuZ3RoIC8gNCApLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPGFycmF5Lmxlbmd0aDsgaSs9NCApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFsgaS80IF0gPSBuZXcgVmVjNCggYXJyYXlbaV0sIGFycmF5W2krMV0sIGFycmF5W2krMl0sIGFycmF5W2krM10gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGFuIGFycmF5YnVmZmVyIG9iamVjdCB0byBhbiBhcnJheSBvZiBWZWMzIG9iamVjdHMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheSAtIFRoZSBBcnJheUJ1ZmZlciBvYmplY3QgdG8gY29udmVydC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IC0gVGhlIGNvbnZlcnRlZCBhcnJheS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb252ZXJ0VmVjM0FycmF5OiBmdW5jdGlvbiggYXJyYXkgKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoIGFycmF5Lmxlbmd0aCAvIDMgKSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTxhcnJheS5sZW5ndGg7IGkrPTMgKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbIGkvMyBdID0gbmV3IFZlYzMoIGFycmF5W2ldLCBhcnJheVtpKzFdLCBhcnJheVtpKzJdICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhbiBhcnJheWJ1ZmZlciBvYmplY3QgdG8gYW4gYXJyYXkgb2YgVmVjMiBvYmplY3RzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXkgLSBUaGUgQXJyYXlCdWZmZXIgb2JqZWN0IHRvIGNvbnZlcnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSAtIFRoZSBjb252ZXJ0ZWQgYXJyYXkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29udmVydFZlYzJBcnJheTogZnVuY3Rpb24oIGFycmF5ICkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCBhcnJheS5sZW5ndGggLyAyICksXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8YXJyYXkubGVuZ3RoOyBpKz0yICkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0WyBpLzIgXSA9IG5ldyBWZWMyKCBhcnJheVtpXSwgYXJyYXlbaSsxXSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhIG5vZGVzIG1hdHJpeCBmcm9tIGVpdGhlciBhbiBhcnJheSBvciB0cmFuc2xhdGlvbixcclxuICAgICAgICAgKiByb3RhdGlvbiwgYW5kIHNjYWxlIGNvbXBvbmVudHMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbm9kZSAtIEEgbm9kZSBmcm9tIHRoZSBnbFRGIEpTT04uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgdHJhbnNmb3JtIG1hdHJpeC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldE5vZGVNYXRyaXg6IGZ1bmN0aW9uKCBub2RlICkge1xyXG4gICAgICAgICAgICB2YXIgdHJhbnNsYXRpb24sIHJvdGF0aW9uLCBzY2FsZTtcclxuICAgICAgICAgICAgLy8gZGVjb21wb3NlIHRyYW5zZm9ybSBjb21wb25lbnRzIGZyb20gbWF0cml4XHJcbiAgICAgICAgICAgIGlmICggbm9kZS5tYXRyaXggKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1hdDQ0KCBub2RlLm1hdHJpeCApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgdHJhbnNsYXRpb25cclxuICAgICAgICAgICAgaWYgKCBub2RlLnRyYW5zbGF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRpb24gPSBNYXQ0NC50cmFuc2xhdGlvbiggbm9kZS50cmFuc2xhdGlvbiApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRpb24gPSBNYXQ0NC5pZGVudGl0eSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBnZXQgcm90YXRpb25cclxuICAgICAgICAgICAgaWYgKCBub2RlLnJvdGF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgcm90YXRpb24gPSBNYXQ0NC5yb3RhdGlvblJhZGlhbnMoIG5vZGUucm90YXRpb25bM10sIG5vZGUucm90YXRpb24gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvdGF0aW9uID0gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IG9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgIGlmICggbm9kZS5vcmllbnRhdGlvbiApIHtcclxuICAgICAgICAgICAgICAgIHJvdGF0aW9uID0gbmV3IFF1YXRlcm5pb24oIG5vZGUub3JpZW50YXRpb24gKS5tYXRyaXgoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHNjYWxlXHJcbiAgICAgICAgICAgIGlmICggbm9kZS5zY2FsZSApIHtcclxuICAgICAgICAgICAgICAgIHNjYWxlID0gTWF0NDQuc2NhbGUoIG5vZGUuc2NhbGUgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjYWxlID0gTWF0NDQuaWRlbnRpdHkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uLm11bHQoIHJvdGF0aW9uICkubXVsdCggc2NhbGUgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXF1ZXN0IGEgbWFwIG9mIGFycmF5YnVmZmVycyBmcm9tIHRoZSBzZXJ2ZXIuIEV4ZWN1dGVzIGNhbGxiYWNrXHJcbiAgICAgICAgICogZnVuY3Rpb24gcGFzc2luZyBhIG1hcCBvZiBsb2FkZWQgYXJyYXlidWZmZXJzIGtleWVkIGJ5IGlkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGJ1ZmZlcnMgLSBUaGUgbWFwIG9mIGJ1ZmZlcnMuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVxdWVzdEJ1ZmZlcnM6IGZ1bmN0aW9uKCBidWZmZXJzLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgdmFyIGpvYnMgPSB7fSxcclxuICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEJ1ZmZlciggcGF0aCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgICAgICAgICBYSFJMb2FkZXIubG9hZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiBcImFycmF5YnVmZmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggYXJyYXlCdWZmZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggYXJyYXlCdWZmZXIgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggZXJyICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggbnVsbCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICgga2V5IGluIGJ1ZmZlcnMgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGJ1ZmZlcnMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpvYnNbIGtleSBdID0gbG9hZEJ1ZmZlciggYnVmZmVyc1sga2V5IF0ucGF0aCApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCBidWZmZXJzQnlJZCApIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBidWZmZXJzQnlJZCApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXF1ZXN0IGEgbWFwIG9mIGltYWdlcyBmcm9tIHRoZSBzZXJ2ZXIuIEV4ZWN1dGVzIGNhbGxiYWNrXHJcbiAgICAgICAgICogZnVuY3Rpb24gcGFzc2luZyBhIG1hcCBvZiBJbWFnZSBvYmplY3RzIGtleWVkIGJ5IHBhdGguXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VzIC0gVGhlIG1hcCBvZiBpbWFnZXMuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVxdWVzdEltYWdlczogZnVuY3Rpb24oIGltYWdlcywgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgIHZhciBqb2JzID0ge30sXHJcbiAgICAgICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRJbWFnZSggcGF0aCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiggZG9uZSApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSggaW1hZ2UgKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IHBhdGg7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoIGtleSBpbiBpbWFnZXMgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGltYWdlcy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgam9ic1sga2V5IF0gPSBsb2FkSW1hZ2UoIGltYWdlc1sga2V5IF0ucGF0aCApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCBpbWFnZXNCeVBhdGggKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayggaW1hZ2VzQnlQYXRoICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxyXG4gICAgICAgIFV0aWwgPSByZXF1aXJlKCcuLi9VdGlsJyksXHJcbiAgICAgICAgWEhSTG9hZGVyID0gcmVxdWlyZSgnLi4vWEhSTG9hZGVyJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gbG9hZCBhbiBpbWFnZSwgYW5kIGV4ZWN1dGUgYSBjYWxsYmFjayB1cG9uXHJcbiAgICAgKiBjb21wbGV0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIGZvciB0aGUgaW1hZ2UgdG8gbG9hZC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0byBsb2FkIHRoZSBpbWFnZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlKCB1cmwgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkb25lKCBpbWFnZSApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyBhIG1hdGVyaWFsIG9iamVjdCBmcm9tIHRoZSBwcm92aWRlZFxyXG4gICAgICogbWF0ZXJpYWwgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1hdGVyaWFsSW5mbyAtIFRoZSBtYXRlcmlhbCBpbmZvcm1hdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZVVybCAtIFRoZSB1cmwgY29udGFpbmluZyB0aGUgdGV4dHVyZSBmaWxlcy5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZU1hdGVyaWFsKCBtYXRlcmlhbEluZm8sIGJhc2VVcmwgKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG1hdGVyaWFsSW5mby5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgam9icyA9IHt9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBrZXk7XHJcbiAgICAgICAgICAgIGZvciAoIGtleSBpbiBtYXRlcmlhbEluZm8gKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIG1hdGVyaWFsSW5mby5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRlcmlhbEluZm9bIGtleSBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoIGtleSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAna2QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGlmZnVzZSBjb2xvciAoY29sb3IgdW5kZXIgd2hpdGUgbGlnaHQpIHVzaW5nIFJHQlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5kaWZmdXNlQ29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdrYSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbWJpZW50IGNvbG9yIChjb2xvciB1bmRlciBzaGFkb3cpIHVzaW5nIFJHQiB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLmFtYmllbnRDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNzcGVjdWxhciBjb2xvciAoY29sb3Igd2hlbiBsaWdodCBpcyByZWZsZWN0ZWQgZnJvbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hpbnkgc3VyZmFjZSkgdXNpbmcgUkdCIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc3BlY3VsYXJDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ25zJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNwZWN1bGFyIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBoaWdoIGV4cG9uZW50IHJlc3VsdHMgaW4gYSB0aWdodCwgY29uY2VudHJhdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOcyB2YWx1ZXMgbm9ybWFsbHkgcmFuZ2UgZnJvbSAwIHRvIDEwMDAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5zcGVjdWxhckNvbXBvbmVudCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21hcF9rZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaWZmdXNlIHRleHR1cmUgbWFwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2JzLmRpZmZ1c2UgPSBsb2FkSW1hZ2UoIGJhc2VVcmwgKyBcIi9cIiArIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL21hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlID0gYmFzZVVybCArIFwiL1wiICsgdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkIGlzIGRpc3NvbHZlIGZvciBjdXJyZW50IG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWN0b3Igb2YgMS4wIGlzIGZ1bGx5IG9wYXF1ZSwgYSBmYWN0b3Igb2YgMCBpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnVsbHkgdHJhbnNwYXJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgPCAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLmFscGhhID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaWxsdW0nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZSA+IDIgJiYgdmFsdWUgPCAxMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5yZWZsZWN0aW9uID0gMC4zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZSA9PT0gNiB8fCB2YWx1ZSA9PT0gNyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5yZWZyYWN0aW9uID0gMC44O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGxvYWQgYWxsIGltYWdlcyBhc3luY2hyb25vdXNseVxyXG4gICAgICAgICAgICBVdGlsLmFzeW5jKCBqb2JzLCBmdW5jdGlvbiggaW1hZ2VzQnlUeXBlICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleTtcclxuICAgICAgICAgICAgICAgIGZvciAoIGtleSBpbiBpbWFnZXNCeVR5cGUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpbWFnZXNCeVR5cGUuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbFsga2V5ICsgXCJUZXh0dXJlXCIgXSA9IGltYWdlc0J5VHlwZVsga2V5IF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZG9uZSggbWF0ZXJpYWwgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGVzIHRocm91Z2ggdGhlIGluZGl2aWR1YWwgbWF0ZXJpYWwgaW5mb3MgYW5kIGdlbmVyYXRlc1xyXG4gICAgICogdGhlIHJlc3BlY3RpdmUgTWF0ZXJpYWwgb2JqZWN0cy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWF0ZXJpYWxJbmZvcyAtIFRoZSBtYXAgb2YgbWF0ZXJpYWwgaW5mb3JtYXRpb24sIGtleWVkIGJ5IG5hbWUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZyBiYXNlVXJsIC0gVGhlIGJhc2UgVVJMIG9mIHRoZSBmb2xkZXIgY29udGFpbmluZyB0aGUgbWF0ZXJpYWwgZGVwZW5kZW5jeSBmaWxlcy5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZU1hdGVyaWFscyggbWF0ZXJpYWxJbmZvcywgYmFzZVVybCwgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGpvYnMgPSB7fSxcclxuICAgICAgICAgICAga2V5O1xyXG4gICAgICAgIGZvciAoIGtleSBpbiBtYXRlcmlhbEluZm9zICkge1xyXG4gICAgICAgICAgICBpZiAoIG1hdGVyaWFsSW5mb3MuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG4gICAgICAgICAgICAgICAgam9ic1sga2V5IF0gPSBnZW5lcmF0ZU1hdGVyaWFsKCBtYXRlcmlhbEluZm9zWyBrZXkgXSwgYmFzZVVybCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCBtYXRlcmlhbHMgKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCBtYXRlcmlhbHMgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyB0aGUgc291cmNlIHRleHQgb2YgYSB3YXZlZnJvbnQgLm10bCBmaWxlIGFuZCByZXR1cm5zIGEgbWFwXHJcbiAgICAgKiBvZiB0aGUgcmVsZXZhbnQgbWF0ZXJpYWwgaW5mb3JtYXRpb24sIGtleWVkIGJ5IG5hbWUuXHJcbiAgICAgKlxyXG4gICAgICogQGF1dGhvciBhbmdlbHh1YW5jaGFuZ1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzcmMgLSBUaGUgc291cmNlIHRleHQgb2YgYSAubXRsIGZpbGUgdG8gYmUgcGFyc2VkLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBwYXJzZWQgc291cmNlIGNvbnRhaW5pbmcgYWxsIG1hdGVyaWFscyBrZXllZCBieSBuYW1lLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZU1UTFNvdXJjZSggc3JjICkge1xyXG4gICAgICAgIHZhciBsaW5lcyA9IHNyYy5zcGxpdCggJ1xcbicgKSxcclxuICAgICAgICAgICAgbWF0ZXJpYWxJbmZvcyA9IHt9LFxyXG4gICAgICAgICAgICBpbmZvID0ge30sXHJcbiAgICAgICAgICAgIHZlY3RvcixcclxuICAgICAgICAgICAgbGluZSxcclxuICAgICAgICAgICAgcG9zLFxyXG4gICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxsaW5lcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF0udHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAoIGxpbmUubGVuZ3RoID09PSAwIHx8IGxpbmUuY2hhckF0KCAwICkgPT09ICcjJyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGJsYW5rIGxpbmUgb3IgY29tbWVudCBpZ25vcmVcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBvcyA9IGxpbmUuaW5kZXhPZiggJyAnICk7XHJcbiAgICAgICAgICAgIGlmICggcG9zID49IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSBsaW5lLnN1YnN0cmluZyggMCwgcG9zICkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbGluZS5zdWJzdHJpbmcoIHBvcyArIDEgKS50cmltKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSBsaW5lO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgga2V5ID09PSBcIm5ld210bFwiICkge1xyXG4gICAgICAgICAgICAgICAgLy8gbmV3IG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICBpbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxJbmZvc1sgdmFsdWUgXSA9IGluZm87XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGluZm8gKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGtleSA9PT0gXCJrYVwiIHx8XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID09PSBcImtkXCIgfHxcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPT09IFwia3NcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9PT0gXCJrZVwiICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZlY3RvciB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIHZlY3RvciA9IHZhbHVlLnNwbGl0KCAvXFxzKy8sIDMgKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvWyBrZXkgXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggdmVjdG9yWzBdICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHZlY3RvclsxXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCB2ZWN0b3JbMl0gKSBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgga2V5ID09PSBcIm5zXCIgfHwga2V5ID09PSBcImRcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzY2FsYXIgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBpbmZvWyBrZXkgXSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyXHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb1sga2V5IF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0ZXJpYWxJbmZvcztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9hZHMgYSB3YXZlZnJvbnQgLm10bCBmaWxlLCBnZW5lcmF0ZXMgYSBtYXAgb2YgbWF0ZXJpYWwgc3BlY2lmaWNhdGlvblxyXG4gICAgICAgICAqIG9iamVjdHMsIGtleWVkIGJ5IG5hbWUsIGFuZCBwYXNzZXMgaXQgdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHVwb25cclxuICAgICAgICAgKiBjb21wbGV0aW9uLiBBbGwgdGV4dHVyZXMgcmVtYWluIGFzIGZ1bGx5IHF1YWxpZmllZCB1cmxzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFRoZSB1cmwgdG8gdGhlIC5tdGwgZmlsZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbmUgZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgdmFyIGJhc2VVcmwgPSBwYXRoLmRpcm5hbWUoIHVybCApO1xyXG4gICAgICAgICAgICBYSFJMb2FkZXIubG9hZChcclxuICAgICAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBzcmMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWQgPSBwYXJzZU1UTFNvdXJjZSggc3JjICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlTWF0ZXJpYWxzKCBwYXJzZWQsIGJhc2VVcmwsIGNhbGxiYWNrICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIGVyciApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayggbnVsbCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFhIUkxvYWRlciA9IHJlcXVpcmUoJy4uL1hIUkxvYWRlcicpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSB0cmlhbmdsZSBoYXNoaW5nIGZ1bmN0aW9uIHVzZWQgdG8gcmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbVxyXG4gICAgICogdGhlIHVuaWZpZWQgYXJyYXkgZ2VuZXJhdGlvbiBwcm9jZXNzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmlhbmdsZSAtIFRoZSB0cmlhbmdsZS5cclxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gaW5kZXggLSBUaGUgdHJpYW5nbGUgdmVydGV4IGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0cmlhbmdsZXMgaGFzaC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdHJpSGFzaCggdHJpYW5nbGUsIGluZGV4ICkge1xyXG4gICAgICAgIHZhciBoYXNoID0gdHJpYW5nbGUucG9zaXRpb25zWyBpbmRleCBdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKCB0cmlhbmdsZS5ub3JtYWxzICkge1xyXG4gICAgICAgICAgICBoYXNoICs9IFwiLVwiICsgdHJpYW5nbGUubm9ybWFsc1sgaW5kZXggXS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIHRyaWFuZ2xlLnV2cyApIHtcclxuICAgICAgICAgICAgaGFzaCArPSBcIi1cIiArIHRyaWFuZ2xlLnV2c1sgaW5kZXggXS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGFzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyB1bmlmaWVkIHZlcnRleCBhdHRyaWJ1dGUgYXJyYXlzIGZyb20gdHJpYW5nbGVzLiBVbmlmaWVkIGFycmF5c1xyXG4gICAgICogYXJlIGFycmF5cyBvZiB2ZXJ0ZXggYXR0cmlidXRlcyBvcmdhbml6ZWQgc3VjaCB0aGF0IGFsbCBpbmRpY2VzXHJcbiAgICAgKiBjb3JyZXNwb25kIGFjcm9zcyBhdHRyaWJ1dGVzLiBVbmlmaWVkIGFycmF5cyBhcmUgbm90IG1lbW9yeSBlZmZpY2llbnQsXHJcbiAgICAgKiBmb3IgZXhhbXBsZSBhIGN1YmUgaXMgY29tcG9zZWQgb2YgOCBwb3NpdGlvbnMgYW5kIDYgbm9ybWFscy4gdGhpcyB3b3VsZFxyXG4gICAgICogYmUgb3JnYW5pemVkIGludG8gdHdvIHVuaWZpZWQgYXJyYXlzIGVhY2ggY29uc2lzdGluZyBvZiAyNCBlbGVtZW50cy5cclxuICAgICAqIFdlYkdMIHZlcnRleCBidWZmZXJzIG9ubHkgYWNjZXB0cyB1bmlmaWVkIGFycmF5cy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWVzaCAtIFRoZSBtZXNoIGluZm9ybWF0aW9uIG9iamVjdC5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgYXR0cmlidXRlIGFuZCBpbmRleCBhcnJheXMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRUb1VuaWZpZWRBcnJheXMoIG1lc2ggKSB7XHJcbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICBub3JtYWxzID0gW10sXHJcbiAgICAgICAgICAgIHV2cyA9IFtdLFxyXG4gICAgICAgICAgICBpbmRpY2VzID0gW10sXHJcbiAgICAgICAgICAgIGNvdW50ID0gMCxcclxuICAgICAgICAgICAgaGFzaGVzID0ge30sXHJcbiAgICAgICAgICAgIGhhc2gsXHJcbiAgICAgICAgICAgIGFycmF5cyxcclxuICAgICAgICAgICAgdHJpYW5nbGUsXHJcbiAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICBpLCBqO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxtZXNoLnRyaWFuZ2xlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggdHJpYW5nbGVcclxuICAgICAgICAgICAgdHJpYW5nbGUgPSBtZXNoLnRyaWFuZ2xlc1tpXTtcclxuICAgICAgICAgICAgZm9yICggaj0wOyBqPDM7IGorKyApIHtcclxuICAgICAgICAgICAgICAgIC8vIGhhc2ggaXRzIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgaGFzaCA9IHRyaUhhc2goIHRyaWFuZ2xlLCBqICk7XHJcbiAgICAgICAgICAgICAgICAvL2luZGV4ID0gaGFzaGVzWyBoYXNoIF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIGluZGV4ID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZG9lc24ndCBleGlzdCwgYWRkIGF0dHJpYnV0ZXMgdG8gYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaCggdHJpYW5nbGUucG9zaXRpb25zW2pdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0cmlhbmdsZS5ub3JtYWxzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxzLnB1c2goIHRyaWFuZ2xlLm5vcm1hbHNbal0gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0cmlhbmdsZS51dnMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2cy5wdXNoKCB0cmlhbmdsZS51dnNbal0gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCBjb3VudCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc2hlc1sgaGFzaCBdID0gY291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZG9lcywgcmVmZXJlbmNlIGV4aXN0aW5nIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIGluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYXJyYXlzID0ge1xyXG4gICAgICAgICAgICB0cmlhbmdsZXM6IG1lc2gudHJpYW5nbGVzLFxyXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHBvc2l0aW9ucyxcclxuICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcclxuICAgICAgICAgICAgbm9ybWFsczogbm9ybWFscyxcclxuICAgICAgICAgICAgbWF0ZXJpYWw6IG1lc2gubWF0ZXJpYWwgLy8gbWF0ZXJpYWwgbmFtZSwgbm90IGFjdHVhbCBtYXRlcmlhbCBzZXRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICggdXZzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgIGFycmF5cy51dnMgPSB1dnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIG1vZGVsIGluZm9ybWF0aW9uIG1lc2hlcyBhbmQgY3JlYXRlIGFsbCB2ZXJ0ZXhcclxuICAgICAqIGF0dHJpYnV0ZSBhcnJheXMgZnJvbSB0cmlhbmdsZXMuIFJlcGxhY2VzIGV4aXN0aW5nICdtZXNoJyBhdHRyaWJ1dGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtb2RlbCAtIFRoZSBtb2RlbCBpbmZvcm1hdGlvbiBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIE1vZGVsIGluZm9ybWF0aW9uIG9iamVjdCB3aXRoIG1lc2hlcyBhcHBlbmRlZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY29udmVydFRyaWFuZ2xlc1RvQXJyYXlzKCBtb2RlbCApIHtcclxuICAgICAgICB2YXIgbWVzaGVzID0gbW9kZWwubWVzaGVzLFxyXG4gICAgICAgICAgICBpO1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxtZXNoZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIG1lc2hlc1tpXSA9IGNvbnZlcnRUb1VuaWZpZWRBcnJheXMoIG1lc2hlc1tpXSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzZXMgdGhlIHNvdXJjZSB0ZXh0IG9mIGEgd2F2ZWZyb250IC5vYmogZmlsZSBhbmQgcmV0dXJucyBhIG1vZGVsXHJcbiAgICAgKiBpbmZvcm1hdGlvbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVsZXZhbnQgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNyYyAtIFRoZSBzb3VyY2UgdGV4dCBvZiBhIC5vYmogZmlsZSB0byBiZSBwYXJzZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHBhcnNlZCAub2JqIGZpbGUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBhcnNlT0JKU291cmNlKCBzcmMgKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEVtcHR5TWVzaCggZ3JvdXBOYW1lLCBvYmpOYW1lLCBtYXRlcmlhbE5hbWUgKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNoO1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgZnJlc2ggdHJpYW5nbGVzXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlcyA9IFtdO1xyXG4gICAgICAgICAgICAvLyBhc3NpZ24gaXQgdG8gdGhlIG5ldyBlbXB0eSBtZXNoXHJcbiAgICAgICAgICAgIG1lc2ggPSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXM6IHRyaWFuZ2xlc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBpZiBtZXNoIGdyb3VwIGlzIHByb3ZpZGVkLCBhZGQgaXRcclxuICAgICAgICAgICAgaWYgKCBncm91cE5hbWUgKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNoLmdyb3VwID0gZ3JvdXBOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIG9iamVjdCBuYW1lIGlzIHByb3ZpZGVkLCBhZGQgaXRcclxuICAgICAgICAgICAgaWYgKCBvYmpOYW1lICkge1xyXG4gICAgICAgICAgICAgICAgbWVzaC5uYW1lID0gb2JqTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiBhIG1hdGVyaWFsIG5hbWUgaXMgcHJvdmlkZWQsIGFkZCBpdFxyXG4gICAgICAgICAgICBpZiAoIG1hdGVyaWFsTmFtZSApIHtcclxuICAgICAgICAgICAgICAgIG1lc2gubWF0ZXJpYWwgPSBtYXRlcmlhbE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYXBwZW5kIGVtcHR5IG1lc2ggdG8gbW9kZWxcclxuICAgICAgICAgICAgbW9kZWwubWVzaGVzLnB1c2goIG1lc2ggKTtcclxuICAgICAgICAgICAgLy8gY2xlYXIgZ3JvdXAgYW5kIG9iamVjdCBuYW1lc1xyXG4gICAgICAgICAgICBuZXh0R3JvdXAgPSBudWxsO1xyXG4gICAgICAgICAgICBuZXh0T2JqZWN0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE10bExpYiggbGluZSApIHtcclxuICAgICAgICAgICAgdmFyIG10bGxpYiA9IGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpO1xyXG4gICAgICAgICAgICBtb2RlbC5tdGxsaWIgPSBtb2RlbC5tdGxsaWIgfHwgW107XHJcbiAgICAgICAgICAgIGlmICggbW9kZWwubXRsbGliLmluZGV4T2YoIG10bGxpYiApID09PSAtMSApIHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgYWRkIGlmIGl0IGFscmVhZHkgaXNuJ3QgdGhlcmVcclxuICAgICAgICAgICAgICAgIG1vZGVsLm10bGxpYi5wdXNoKCBtdGxsaWIgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UG9zaXRpb24oIHZhbHVlICkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcblx0XHRcdGlmICggaW5kZXggPj0gMCAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zaXRpb25zWyBpbmRleCAtIDEgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcG9zaXRpb25zWyBpbmRleCArIHBvc2l0aW9ucy5sZW5ndGggXTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VVYoIHZhbHVlICkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcblx0XHRcdGlmICggaW5kZXggPj0gMCAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXZzWyBpbmRleCAtIDEgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdXZzWyBpbmRleCArIHV2cy5sZW5ndGggXTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm9ybWFsKCB2YWx1ZSApIHtcclxuXHRcdFx0dmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG5cdFx0XHRpZiAoIGluZGV4ID49IDAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vcm1hbHNbIGluZGV4IC0gMSBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxzWyBpbmRleCArIG5vcm1hbHMubGVuZ3RoIF07XHJcblx0XHR9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkVHJpYW5nbGVGcm9tSW5kaWNlcyggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApIHtcclxuICAgICAgICAgICAgdmFyIHRyaWFuZ2xlID0ge30sXHJcbiAgICAgICAgICAgICAgICBhLCBiLCBjLCB1LCB2LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsLCBtYWc7XHJcbiAgICAgICAgICAgIC8vIGFkZCBwb3NpdGlvbnMgdG8gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlLnBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKCBwb3NJbmRpY2VzWzBdICksXHJcbiAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbiggcG9zSW5kaWNlc1sxXSApLFxyXG4gICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oIHBvc0luZGljZXNbMl0gKSBdO1xyXG4gICAgICAgICAgICAvLyBpZiB1dnMgYXJlIHByb3ZpZGVkLCBhZGQgdGhlbSB0byB0aGUgdHJpYW5nbGVcclxuICAgICAgICAgICAgaWYgKCB1dkluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS51dnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0VVYoIHV2SW5kaWNlc1swXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIGdldFVWKCB1dkluZGljZXNbMV0gKSxcclxuICAgICAgICAgICAgICAgICAgICBnZXRVViggdXZJbmRpY2VzWzJdICkgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiBub3JtYWxzIGFyZSBwcm92aWRlZCwgYWRkIHRoZW0gdG8gdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIGlmICggbm9ybUluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS5ub3JtYWxzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIGdldE5vcm1hbCggbm9ybUluZGljZXNbMF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBnZXROb3JtYWwoIG5vcm1JbmRpY2VzWzFdICksXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Tm9ybWFsKCBub3JtSW5kaWNlc1syXSApIF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBub3JtYWxzIGFyZSBub3QgcHJvdmlkZWQsIGdlbmVyYXRlIHRoZW1cclxuICAgICAgICAgICAgICAgIGEgPSB0cmlhbmdsZS5wb3NpdGlvbnNbMF07XHJcbiAgICAgICAgICAgICAgICBiID0gdHJpYW5nbGUucG9zaXRpb25zWzFdO1xyXG4gICAgICAgICAgICAgICAgYyA9IHRyaWFuZ2xlLnBvc2l0aW9uc1syXTtcclxuICAgICAgICAgICAgICAgIHUgPSBbIGJbMF0tYVswXSwgYlsxXS1hWzFdLCBiWzJdLWFbMl0gXTsgLy8gYiAtIGFcclxuICAgICAgICAgICAgICAgIHYgPSBbIGNbMF0tYVswXSwgY1sxXS1hWzFdLCBjWzJdLWFbMl0gXTsgLy8gYyAtIGFcclxuICAgICAgICAgICAgICAgIC8vIGNyb3NzIHByb2R1Y3RcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IFtcclxuICAgICAgICAgICAgICAgICAgICAoIHVbMV0gKiB2WzJdICkgLSAoIHZbMV0gKiB1WzJdICksXHJcbiAgICAgICAgICAgICAgICAgICAgKC11WzBdICogdlsyXSApICsgKCB2WzBdICogdVsyXSApLFxyXG4gICAgICAgICAgICAgICAgICAgICggdVswXSAqIHZbMV0gKSAtICggdlswXSAqIHVbMV0gKVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbGl6ZVxyXG4gICAgICAgICAgICAgICAgbWFnID0gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFswXSpub3JtYWxbMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsxXSpub3JtYWxbMV0gK1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsyXSpub3JtYWxbMl0gKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IFtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWxbMF0gLyBtYWcsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsWzFdIC8gbWFnLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFsyXSAvIG1hZyBdO1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUubm9ybWFscyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhZGQgdHJpYW5nbGUgdG8gYXJyYXlcclxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2goIHRyaWFuZ2xlICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwYXJzZUZhY2VJbnB1dCggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApIHtcclxuICAgICAgICAgICAgYnVpbGRUcmlhbmdsZUZyb21JbmRpY2VzKCBwb3NJbmRpY2VzLCB1dkluZGljZXMsIG5vcm1JbmRpY2VzICk7XHJcbiAgICAgICAgICAgIGlmICggcG9zSW5kaWNlc1sgMyBdICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NJbmRpY2VzID0gWyBwb3NJbmRpY2VzWyAwIF0sIHBvc0luZGljZXNbIDIgXSwgcG9zSW5kaWNlc1sgMyBdIF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIHV2SW5kaWNlcyApIHtcclxuICAgICAgICAgICAgICAgICAgICB1dkluZGljZXMgPSBbIHV2SW5kaWNlc1sgMCBdLCB1dkluZGljZXNbIDIgXSwgdXZJbmRpY2VzWyAzIF0gXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICggbm9ybUluZGljZXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybUluZGljZXMgPSBbIG5vcm1JbmRpY2VzWyAwIF0sIG5vcm1JbmRpY2VzWyAyIF0sIG5vcm1JbmRpY2VzWyAzIF0gXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJ1aWxkVHJpYW5nbGVGcm9tSW5kaWNlcyggcG9zSW5kaWNlcywgdXZJbmRpY2VzLCBub3JtSW5kaWNlcyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdiBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgICAgIHZhciBQT1NJVElPTl9SRUdFWCA9IC92KCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspLyxcclxuICAgICAgICAgICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgICAgICAgICAgTk9STUFMX1JFR0VYID0gL3ZuKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspKCArW1xcZHxcXC58XFwrfFxcLXxlXSspLyxcclxuICAgICAgICAgICAgLy8gdnQgZmxvYXQgZmxvYXRcclxuICAgICAgICAgICAgVVZfUkVHRVggPSAvdnQoICtbXFxkfFxcLnxcXCt8XFwtfGVdKykoICtbXFxkfFxcLnxcXCt8XFwtfGVdKykvLFxyXG4gICAgICAgICAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4IC4uLlxyXG4gICAgICAgICAgICBGQUNFX1ZfUkVHRVggPSAvZiggKy0/XFxkKykoICstP1xcZCspKCArLT9cXGQrKSggKy0/XFxkKyk/LyxcclxuICAgIFx0XHQvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2IC4uLlxyXG4gICAgXHRcdEZBQ0VfVl9VVl9SRUdFWCA9IC9mKCArKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgIFx0XHQvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIC4uLlxyXG4gICAgXHRcdEZBQ0VfVl9VVl9OX1JFR0VYID0gL2YoICsoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICBcdFx0Ly8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCAuLi5cclxuICAgIFx0XHRGQUNFX1ZfTl9SRUdFWCA9IC9mKCArKC0/XFxkKylcXC9cXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcL1xcLygtP1xcZCspKSggKygtP1xcZCspXFwvXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgICAgICAgICAgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXNoZXM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IFtdLFxyXG4gICAgICAgICAgICB1dnMgPSBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyA9IFtdLFxyXG4gICAgICAgICAgICB0cmlhbmdsZXMgPSBbXSxcclxuICAgICAgICAgICAgbmV4dEdyb3VwID0gbnVsbCxcclxuICAgICAgICAgICAgbmV4dE9iamVjdCA9IG51bGwsXHJcbiAgICAgICAgICAgIGxpbmVzID0gc3JjLnNwbGl0KCBcIlxcblwiICksXHJcbiAgICAgICAgICAgIGxpbmUsXHJcbiAgICAgICAgICAgIHJlc3VsdCxcclxuICAgICAgICAgICAgaTtcclxuICAgICAgICAvLyBwYXJzZSBsaW5lc1xyXG4gICAgICAgIGZvciAoIGk9MDsgaTxsaW5lcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgbGluZSA9IGxpbmVzWyBpIF0udHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAoIGxpbmUubGVuZ3RoID09PSAwIHx8IGxpbmUuY2hhckF0KCAwICkgPT09ICcjJyApIHtcclxuICAgICAgICAgICAgICAgIC8vICMgY29tbWVudCBvciBibGFuayBsaW5lXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBQT1NJVElPTl9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2IDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IE5PUk1BTF9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgLy8gW1widm4gMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuICAgICAgICAgICAgICAgIG5vcm1hbHMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IFVWX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gdXZzXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2dCAwLjEgMC4yXCIsIFwiMC4xXCIsIFwiMC4yXCJdXHJcbiAgICAgICAgICAgICAgICB1dnMucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBGQUNFX1ZfUkVHRVguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmYWNlIG9mIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcbiAgICAgICAgICAgICAgICBwYXJzZUZhY2VJbnB1dChcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDQgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbCwgLy8gdXZzXHJcbiAgICAgICAgICAgICAgICAgICAgbnVsbCApOyAvLyBub3JtYWxzXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gRkFDRV9WX1VWX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmFjZSBvZiBwb3NpdGlvbnMgYW5kIHV2c1xyXG4gICAgICAgICAgICAgICAgLy8gW1wiZiAxLzEgMi8yIDMvM1wiLCBcIiAxLzFcIiwgXCIxXCIsIFwiMVwiLCBcIiAyLzJcIiwgXCIyXCIsIFwiMlwiLCBcIiAzLzNcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG4gICAgICAgICAgICAgICAgcGFyc2VGYWNlSW5wdXQoXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyBwb3NpdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDggXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxMSBdXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHV2c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA2IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIG51bGwgKTsgLy8gbm9ybWFsc1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IEZBQ0VfVl9VVl9OX1JFR0VYLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmFjZSBvZiBwb3NpdGlvbnMsIHV2cywgYW5kIG5vcm1hbHNcclxuICAgICAgICAgICAgICAgIC8vIFtcImYgMS8xLzEgMi8yLzIgMy8zLzNcIiwgXCIgMS8xLzFcIiwgXCIxXCIsIFwiMVwiLCBcIjFcIiwgXCIgMi8yLzJcIiwgXCIyXCIsIFwiMlwiLCBcIjJcIiwgXCIgMy8zLzNcIiwgXCIzXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG4gICAgICAgICAgICAgICAgcGFyc2VGYWNlSW5wdXQoXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyBwb3NpdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAyIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNiBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEwIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTQgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyB1dnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAzIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgMTUgXVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWyAvLyBub3JtYWxzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgNCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDggXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyAxMiBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDE2IF1cclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSBGQUNFX1ZfTl9SRUdFWC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIC8vIGZhY2Ugb2YgcG9zaXRpb25zIGFuZCBub3JtYWxzXHJcbiAgICAgICAgICAgICAgICAvLyBbXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiIDEvLzFcIiwgXCIxXCIsIFwiMVwiLCBcIiAyLy8yXCIsIFwiMlwiLCBcIjJcIiwgXCIgMy8vM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcbiAgICAgICAgICAgICAgICBwYXJzZUZhY2VJbnB1dChcclxuICAgICAgICAgICAgICAgICAgICBbIC8vIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDIgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA1IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOCBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDExIF1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIG51bGwsIC8vIHV2c1xyXG4gICAgICAgICAgICAgICAgICAgIFsgLy8gbm9ybWFsc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDMgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0WyA2IF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFsgOSBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggL15vIC8udGVzdCggbGluZSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBuZXh0T2JqZWN0ID0gbGluZS5zdWJzdHJpbmcoIDIgKS50cmltKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIC9eZyAvLnRlc3QoIGxpbmUgKSApIHtcclxuICAgICAgICAgICAgICAgIC8vIGdyb3VwXHJcbiAgICAgICAgICAgICAgICBuZXh0R3JvdXAgPSBsaW5lLnN1YnN0cmluZyggMiApLnRyaW0oKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggL151c2VtdGwgLy50ZXN0KCBsaW5lICkgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXRlcmlhbFxyXG4gICAgICAgICAgICAgICAgYWRkRW1wdHlNZXNoKCBuZXh0R3JvdXAsIG5leHRPYmplY3QsIGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIC9ebXRsbGliIC8udGVzdCggbGluZSApICkge1xyXG4gICAgICAgICAgICAgICAgLy8gbXRsIGZpbGVcclxuICAgICAgICAgICAgICAgIGFkZE10bExpYiggbGluZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggbW9kZWwubWVzaGVzLmxlbmd0aCA9PT0gMCApIHtcclxuICAgICAgICAgICAgLy8gbm8gbXRscywgYXNzZW1ibGUgYWxsIHVuZGVyIGEgc2luZ2xlIG1lc2hcclxuICAgICAgICAgICAgbW9kZWwubWVzaGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzOiB0cmlhbmdsZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTG9hZHMgYSB3YXZlZnJvbnQgLm9iaiBmaWxlLCBnZW5lcmF0ZXMgYSBtb2RlbCBzcGVjaWZpY2F0aW9uIG9iamVjdFxyXG4gICAgICAgICAqIGFuZCBwYXNzZXMgaXQgdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHRoZSAub2JqIGZpbGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbG9hZDogZnVuY3Rpb24oIHVybCwgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgICAgIFhIUkxvYWRlci5sb2FkKFxyXG4gICAgICAgICAgICAgICAgdXJsLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIHNyYyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlZCA9IHBhcnNlT0JKU291cmNlKCBzcmMgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0gY29udmVydFRyaWFuZ2xlc1RvQXJyYXlzKCBwYXJzZWQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBtb2RlbCApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCBlcnIgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIG51bGwgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyksXHJcbiAgICAgICAgVXRpbCA9IHJlcXVpcmUoJy4uL1V0aWwnKSxcclxuICAgICAgICBPQkpMb2FkZXIgPSByZXF1aXJlKCcuL09CSkxvYWRlcicpLFxyXG4gICAgICAgIE1UTExvYWRlciA9IHJlcXVpcmUoJy4vTVRMTG9hZGVyJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBtaXRsaWIgYXR0cmlidXRlIG9mIHRoZSBtb2RlbCBhbmQgbG9hZHMgbWF0ZXJpYWxzXHJcbiAgICAgKiBmcm9tIGFsbCBhc3NvY2lhdGVkIC5tdGwgZmlsZXMuIFBhc3NlcyB0aGUgbWF0ZXJpYWwgc3BlY2lmaWNhdGlvbiBvYmplY3RzXHJcbiAgICAgKiB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1vZGVsIC0gVGhlIG1vZGVsIGluZm9ybWF0aW9uIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nIGJhc2VVcmwgLSBUaGUgYmFzZSBVUkwgb2YgdGhlIGZvbGRlciBjb250YWluaW5nIHRoZSBtYXRlcmlhbCBkZXBlbmRlbmN5IGZpbGVzLlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsb2FkTWF0ZXJpYWxzKCBtb2RlbCwgYmFzZVVybCwgY2FsbGJhY2sgKSB7XHJcbiAgICAgICAgdmFyIGpvYnMgPSBbXTtcclxuICAgICAgICAvLyBpZiBubyBtYXRlcmlhbCwgZXhpdCBlYXJseVxyXG4gICAgICAgIGlmICggIW1vZGVsLm10bGxpYiApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soIG1vZGVsICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IHVwIHRoZSBtYXRlcmlhbCBsb2FkaW5nIGpvYlxyXG4gICAgICAgIG1vZGVsLm10bGxpYi5mb3JFYWNoKCBmdW5jdGlvbiggbXRsbGliICkge1xyXG4gICAgICAgICAgICBqb2JzLnB1c2goIGZ1bmN0aW9uKCBkb25lICkge1xyXG4gICAgICAgICAgICAgICAgTVRMTG9hZGVyLmxvYWQoIGJhc2VVcmwgKyAnLycgKyBtdGxsaWIsIGRvbmUgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gZGlzcGF0Y2ggYWxsIG1hdGVyaWFsIGxvYWRpbmcgam9ic1xyXG4gICAgICAgIFV0aWwuYXN5bmMoIGpvYnMsIGZ1bmN0aW9uKCBtYXRlcmlhbHMgKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbHNCeU5hbWUgPSB7fTtcclxuICAgICAgICAgICAgbWF0ZXJpYWxzLmZvckVhY2goIGZ1bmN0aW9uKCBtYXRlcmlhbCApIHtcclxuICAgICAgICAgICAgICAgIFV0aWwuZXh0ZW5kKCBtYXRlcmlhbHNCeU5hbWUsIG1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjYWxsYmFjayggbWF0ZXJpYWxzQnlOYW1lICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvYWRzIGEgd2F2ZWZyb250IC5vYmogZmlsZSwgZ2VuZXJhdGVzIGEgbW9kZWwgc3BlY2lmaWNhdGlvbiBvYmplY3QsXHJcbiAgICAgICAgICogYW5kIHBhc3NlcyBpdCB0byB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdXBvbiBjb21wbGV0aW9uLlRoaXMgYWxzb1xyXG4gICAgICAgICAqIGludm9sdmVzIGxvYWRpbmcgYW5kIGdlbmVyYXRpbmcgdGhlIGFzc29jaWF0ZWQgbWF0ZXJpYWwgc3BlY2lmaWNhdGlvblxyXG4gICAgICAgICAqIG9iamVjdHMgZnJvbSB0aGUgcmVzcGVjdGl2ZSB3YXZlZnJvbnQgLm10bCBmaWxlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBUaGUgdXJsIHRvIHRoZSAub2JqIGZpbGUuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb25lIGV4ZWN1dGVkIHVwb24gY29tcGxldGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsb2FkOiBmdW5jdGlvbiggdXJsLCBjYWxsYmFjayApIHtcclxuICAgICAgICAgICAgLy8gbG9hZCBhbmQgcGFyc2UgT0JKIGZpbGVcclxuICAgICAgICAgICAgT0JKTG9hZGVyLmxvYWQoIHVybCwgZnVuY3Rpb24oIG1vZGVsICkge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhlbiBsb2FkIGFuZCBwYXJzZSBNVEwgZmlsZVxyXG4gICAgICAgICAgICAgICAgbG9hZE1hdGVyaWFscyggbW9kZWwsIHBhdGguZGlybmFtZSggdXJsICksIGZ1bmN0aW9uKCBtYXRlcmlhbHNCeUlkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBlYWNoIG1hdGVyaWFsIHRvIHRoZSBhc3NvY2lhdGVkIG1lc2hcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbC5tZXNoZXMuZm9yRWFjaCggZnVuY3Rpb24oIG1lc2ggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc2gubWF0ZXJpYWwgPSBtYXRlcmlhbHNCeUlkWyBtZXNoLm1hdGVyaWFsIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIG1vZGVsICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgU0laRSA9IDE7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIHBvc2l0aW9uczogZnVuY3Rpb24oIHNpemUgKSB7XHJcbiAgICAgICAgICAgIHNpemUgPSBzaXplIHx8IFNJWkU7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAvLyBmcm9udCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsIC1zaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgc2l6ZS8yLCAtc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsICBzaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgIHNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgLy8gYmFjayBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsIC1zaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgIHNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAgc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsIC1zaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIC8vIHRvcCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsICBzaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgIHNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAgc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsICBzaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIC8vIGJvdHRvbSBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsIC1zaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgLXNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAtc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsIC1zaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIC8vIHJpZ2h0IGZhY2VcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgLXNpemUvMiwgLXNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAgc2l6ZS8yLCAgc2l6ZS8yLCAtc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsICBzaXplLzIsICBzaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgIHNpemUvMiwgLXNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgLy8gbGVmdCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsIC1zaXplLzIsIC1zaXplLzIgXSxcclxuICAgICAgICAgICAgICAgIFsgLXNpemUvMiwgLXNpemUvMiwgIHNpemUvMiBdLFxyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAgc2l6ZS8yLCAgc2l6ZS8yIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsICBzaXplLzIsIC1zaXplLzIgXVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG5vcm1hbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgLy8gZnJvbnQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIGJhY2sgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsIC0xLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAtMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgLTEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsIC0xLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIHRvcCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAxLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAtMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgLTEuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIC0xLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAtMS4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyByaWdodCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgIDAuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsICAwLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAgMC4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgIDAuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gbGVmdCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIC0xLjAsICAwLjAsICAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgLTEuMCwgIDAuMCwgIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAtMS4wLCAgMC4wLCAgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIC0xLjAsICAwLjAsICAwLjAgXVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHV2czogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAvLyBmcm9udCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBiYWNrIGZhY2VcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMS4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAwLjAgXSxcclxuICAgICAgICAgICAgICAgIC8vIHRvcCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBib3R0b20gZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gcmlnaHQgZmFjZVxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgLy8gbGVmdCBmYWNlXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMC4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDEuMCwgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgMS4wIF1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbmRpY2VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIDAsIDEsIDIsIDAsIDIsIDMsIC8vIGZyb250IGZhY2VcclxuICAgICAgICAgICAgICAgIDQsIDUsIDYsIDQsIDYsIDcsIC8vIGJhY2sgZmFjZVxyXG4gICAgICAgICAgICAgICAgOCwgOSwgMTAsIDgsIDEwLCAxMSwgLy8gdG9wIGZhY2VcclxuICAgICAgICAgICAgICAgIDEyLCAxMywgMTQsIDEyLCAxNCwgMTUsIC8vIGJvdHRvbSBmYWNlXHJcbiAgICAgICAgICAgICAgICAxNiwgMTcsIDE4LCAxNiwgMTgsIDE5LCAvLyByaWdodCBmYWNlXHJcbiAgICAgICAgICAgICAgICAyMCwgMjEsIDIyLCAyMCwgMjIsIDIzICAvLyBsZWZ0IGZhY2VcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZW9tZXRyeTogZnVuY3Rpb24oIHNpemUgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMucG9zaXRpb25zKCBzaXplICksXHJcbiAgICAgICAgICAgICAgICBub3JtYWxzOiB0aGlzLm5vcm1hbHMoKSxcclxuICAgICAgICAgICAgICAgIHV2czogdGhpcy51dnMoKSxcclxuICAgICAgICAgICAgICAgIGluZGljZXM6IHRoaXMuaW5kaWNlcygpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBTTElDRVMgPSAyMCxcclxuICAgICAgICBIRUlHSFQgPSAxLFxyXG4gICAgICAgIFJBRElVUyA9IDE7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIHBvc2l0aW9uczogZnVuY3Rpb24oIHNsaWNlcywgaGVpZ2h0LCByYWRpdXMgKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbnMgPSBbXSxcclxuICAgICAgICAgICAgICAgIHNsaWNlQW5nbGUsXHJcbiAgICAgICAgICAgICAgICB4MCwgejAsXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgfHwgSEVJR0hUO1xyXG4gICAgICAgICAgICByYWRpdXMgPSByYWRpdXMgfHwgUkFESVVTO1xyXG4gICAgICAgICAgICBzbGljZUFuZ2xlID0gMiAqIE1hdGguUEkgLyBzbGljZXM7XHJcbiAgICBcdFx0Zm9yICggaT0wOyBpPD1zbGljZXM7IGkrKyApIHtcclxuICAgIFx0XHRcdHgwID0gcmFkaXVzICogTWF0aC5zaW4oIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICBcdFx0XHR6MCA9IHJhZGl1cyAqIE1hdGguY29zKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnB1c2goWyB4MCwgaGVpZ2h0LCB6MCBdKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTw9c2xpY2VzOyBpKysgKSB7XHJcbiAgICBcdFx0XHR4MCA9IHJhZGl1cyAqIE1hdGguc2luKCBpICogc2xpY2VBbmdsZSApO1xyXG4gICAgXHRcdFx0ejAgPSByYWRpdXMgKiBNYXRoLmNvcyggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKFsgeDAsIDAsIHowIF0pO1xyXG4gICAgXHRcdH1cclxuICAgICAgICAgICAgcmV0dXJuIHBvc2l0aW9ucztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBub3JtYWxzOiBmdW5jdGlvbiggc2xpY2VzICkge1xyXG4gICAgICAgICAgICB2YXIgbm9ybWFscyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgc2xpY2VBbmdsZSxcclxuICAgICAgICAgICAgICAgIHgwLCB6MCxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICAgICAgICAgIHNsaWNlQW5nbGUgPSAyICogTWF0aC5QSSAvIHNsaWNlcztcclxuICAgIFx0XHRmb3IgKCBpPTA7IGk8PXNsaWNlczsgaSsrICkge1xyXG4gICAgXHRcdFx0eDAgPSBNYXRoLnNpbiggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgIFx0XHRcdHowID0gTWF0aC5jb3MoIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWxzLnB1c2goWyB4MCwgMCwgejAgXSk7XHJcbiAgICBcdFx0fVxyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8PXNsaWNlczsgaSsrICkge1xyXG4gICAgXHRcdFx0eDAgPSBNYXRoLnNpbiggaSAqIHNsaWNlQW5nbGUgKTtcclxuICAgIFx0XHRcdHowID0gTWF0aC5jb3MoIGkgKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWxzLnB1c2goWyB4MCwgMCwgejAgXSk7XHJcbiAgICBcdFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gbm9ybWFscztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1dnM6IGZ1bmN0aW9uKCBzbGljZXMgKSB7XHJcbiAgICAgICAgICAgIHZhciB1dnMgPSBbXSxcclxuICAgICAgICAgICAgICAgIGk7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICBcdFx0Zm9yICggaT0wOyBpPD1zbGljZXM7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIHV2cy5wdXNoKFsgaSAvIHNsaWNlcywgMSBdKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTw9c2xpY2VzOyBpKysgKSB7XHJcbiAgICAgICAgICAgICAgICB1dnMucHVzaChbIGkgLyBzbGljZXMsIDAgXSk7XHJcbiAgICBcdFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gdXZzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluZGljZXM6IGZ1bmN0aW9uKCBzbGljZXMgKSB7XHJcbiAgICAgICAgXHR2YXIgdmVydGV4SW5kZXggPSAwLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlcyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgaTtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgIFx0XHRmb3IgKCBpPTA7IGk8PXNsaWNlczsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIHNsaWNlcyArIDEgKTtcclxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKTtcclxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyBzbGljZXMgKTtcclxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyBzbGljZXMgKyAxICk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgMSApO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCApO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4SW5kZXgrKztcclxuICAgIFx0XHR9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2VzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdlb21ldHJ5OiBmdW5jdGlvbiggc3RhY2tzLCByYWRpdXMgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMucG9zaXRpb25zKCBzdGFja3MsIHJhZGl1cyApLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsczogdGhpcy5ub3JtYWxzKCBzdGFja3MgKSxcclxuICAgICAgICAgICAgICAgIHV2czogdGhpcy51dnMoIHN0YWNrcyApLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogdGhpcy5pbmRpY2VzKCBzdGFja3MgKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFNJWkUgPSAxO1xyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgICAgICBwb3NpdGlvbnM6IGZ1bmN0aW9uKCBzaXplICkge1xyXG4gICAgICAgICAgICBzaXplID0gc2l6ZSB8fCBTSVpFO1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgWyAtc2l6ZS8yLCAtc2l6ZS8yLCAgMCBdLFxyXG4gICAgICAgICAgICAgICAgWyBzaXplLzIsIC1zaXplLzIsICAwIF0sXHJcbiAgICAgICAgICAgICAgICBbICBzaXplLzIsICBzaXplLzIsICAwIF0sXHJcbiAgICAgICAgICAgICAgICBbIC1zaXplLzIsICBzaXplLzIsICAwIF1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBub3JtYWxzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF0sXHJcbiAgICAgICAgICAgICAgICBbIDAuMCwgIDAuMCwgIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsICAwLjAsICAxLjAgXSxcclxuICAgICAgICAgICAgICAgIFsgMC4wLCAgMC4wLCAgMS4wIF1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1dnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDAuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAxLjAsIDEuMCBdLFxyXG4gICAgICAgICAgICAgICAgWyAwLjAsIDEuMCBdXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5kaWNlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAwLCAxLCAyLCAwLCAyLCAzXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2VvbWV0cnk6IGZ1bmN0aW9uKCBzaXplICkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLnBvc2l0aW9ucyggc2l6ZSApLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsczogdGhpcy5ub3JtYWxzKCksXHJcbiAgICAgICAgICAgICAgICB1dnM6IHRoaXMudXZzKCksXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiB0aGlzLmluZGljZXMoKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgYWxmYWRvciA9IHJlcXVpcmUoJ2FsZmFkb3InKSxcclxuICAgICAgICBWZWMzID0gYWxmYWRvci5WZWMzLFxyXG4gICAgICAgIFZlYzIgPSBhbGZhZG9yLlZlYzI7XHJcblxyXG4gICAgZnVuY3Rpb24gb3J0aG9nb25hbGl6ZVRhbmdlbnQoIG5vcm1hbCwgdGFuZ2VudCwgYml0YW5nZW50ICkge1xyXG4gICAgICAgIG5vcm1hbCA9IG5ldyBWZWMzKCBub3JtYWwgKTtcclxuICAgICAgICAvLyBHcmFtLVNjaG1pZHQgb3J0aG9nb25hbGl6ZVxyXG4gICAgICAgIHZhciBudCA9IG5vcm1hbC5kb3QoIHRhbmdlbnQgKTtcclxuICAgICAgICB0YW5nZW50ID0gdGFuZ2VudC5zdWIoIG5vcm1hbC5tdWx0KCBudCApICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIGhhbmRlZG5lc3NcclxuICAgICAgICBpZiAoIG5vcm1hbC5jcm9zcyggdGFuZ2VudCApLmRvdCggYml0YW5nZW50ICkgPCAwICkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFuZ2VudC5uZWdhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhbmdlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0T3JBZGQoIGFycmF5LCBpbmRleCwgZW50cnkgKSB7XHJcbiAgICAgICAgaWYgKCBhcnJheVsgaW5kZXggXSApIHtcclxuICAgICAgICAgICAgLy8gaWYgZW50cnkgZXhpc3RzLCBhZGQgaXQgdG8gaXRcclxuICAgICAgICAgICAgYXJyYXlbIGluZGV4IF0uYWRkKCBlbnRyeSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgc2V0IHRoZSBlbnRyeVxyXG4gICAgICAgICAgICBhcnJheVsgaW5kZXggXSA9IG5ldyBWZWMzKCBlbnRyeSApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgICAgICAgY29tcHV0ZU5vcm1hbHM6IGZ1bmN0aW9uKCBwb3NpdGlvbnMsIGluZGljZXMgKSB7XHJcbiAgICAgICAgICAgIHZhciBub3JtYWxzID0gbmV3IEFycmF5KCBwb3NpdGlvbnMubGVuZ3RoICksXHJcbiAgICAgICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgICAgICAgICBhLCBiLCBjLFxyXG4gICAgICAgICAgICAgICAgcDAsIHAxLCBwMixcclxuICAgICAgICAgICAgICAgIHUsIHYsXHJcbiAgICAgICAgICAgICAgICBpO1xyXG4gICAgICAgICAgICBmb3IgKCBpPTA7IGk8aW5kaWNlcy5sZW5ndGg7IGkrPTMgKSB7XHJcbiAgICAgICAgICAgICAgICBhID0gaW5kaWNlc1tpXTtcclxuICAgICAgICAgICAgICAgIGIgPSBpbmRpY2VzW2krMV07XHJcbiAgICAgICAgICAgICAgICBjID0gaW5kaWNlc1tpKzJdO1xyXG4gICAgICAgICAgICAgICAgcDAgPSBuZXcgVmVjMyggcG9zaXRpb25zWyBhIF0gKTtcclxuICAgICAgICAgICAgICAgIHAxID0gbmV3IFZlYzMoIHBvc2l0aW9uc1sgYiBdICk7XHJcbiAgICAgICAgICAgICAgICBwMiA9IG5ldyBWZWMzKCBwb3NpdGlvbnNbIGMgXSApO1xyXG4gICAgICAgICAgICAgICAgdSA9IHAxLnN1YiggcDAgKTtcclxuICAgICAgICAgICAgICAgIHYgPSBwMi5zdWIoIHAwICk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwgPSB1LmNyb3NzKCB2ICkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWxzW2FdID0gbm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsc1tiXSA9IG5vcm1hbDtcclxuICAgICAgICAgICAgICAgIG5vcm1hbHNbY10gPSBub3JtYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5vcm1hbHM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY29tcHV0ZVRhbmdlbnRzOiBmdW5jdGlvbiggcG9zaXRpb25zLCBub3JtYWxzLCB1dnMsIGluZGljZXMgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFuZ2VudHMgPSBuZXcgQXJyYXkoIHBvc2l0aW9ucy5sZW5ndGggKSxcclxuICAgICAgICAgICAgICAgIGJpdGFuZ2VudHMgPSBuZXcgQXJyYXkoIHBvc2l0aW9ucy5sZW5ndGggKSxcclxuICAgICAgICAgICAgICAgIGEsIGIsIGMsIHIsXHJcbiAgICAgICAgICAgICAgICBwMCwgcDEsIHAyLFxyXG4gICAgICAgICAgICAgICAgdXYwLCB1djEsIHV2MixcclxuICAgICAgICAgICAgICAgIGRlbHRhUG9zMSwgZGVsdGFQb3MyLFxyXG4gICAgICAgICAgICAgICAgZGVsdGFVVjEsIGRlbHRhVVYyLFxyXG4gICAgICAgICAgICAgICAgcDF1djJ5LCBwMnV2MXksXHJcbiAgICAgICAgICAgICAgICBwMnV2MXgsIHAxdXYyeCxcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQsXHJcbiAgICAgICAgICAgICAgICB0YW5nZW50MCxcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQxLFxyXG4gICAgICAgICAgICAgICAgdGFuZ2VudDIsXHJcbiAgICAgICAgICAgICAgICBiaXRhbmdlbnQsXHJcbiAgICAgICAgICAgICAgICBpO1xyXG5cclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPGluZGljZXMubGVuZ3RoOyBpKz0zICkge1xyXG4gICAgICAgICAgICAgICAgYSA9IGluZGljZXNbaV07XHJcbiAgICAgICAgICAgICAgICBiID0gaW5kaWNlc1tpKzFdO1xyXG4gICAgICAgICAgICAgICAgYyA9IGluZGljZXNbaSsyXTtcclxuXHJcbiAgICAgICAgICAgICAgICBwMCA9IG5ldyBWZWMzKCBwb3NpdGlvbnNbIGEgXSApO1xyXG4gICAgICAgICAgICAgICAgcDEgPSBuZXcgVmVjMyggcG9zaXRpb25zWyBiIF0gKTtcclxuICAgICAgICAgICAgICAgIHAyID0gbmV3IFZlYzMoIHBvc2l0aW9uc1sgYyBdICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdXYwID0gbmV3IFZlYzIoIHV2c1sgYSBdICk7XHJcbiAgICAgICAgICAgICAgICB1djEgPSBuZXcgVmVjMiggdXZzWyBiIF0gKTtcclxuICAgICAgICAgICAgICAgIHV2MiA9IG5ldyBWZWMyKCB1dnNbIGMgXSApO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbHRhUG9zMSA9IHAxLnN1YiggcDAgKTtcclxuICAgICAgICAgICAgICAgIGRlbHRhUG9zMiA9IHAyLnN1YiggcDAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWx0YVVWMSA9IHV2MS5zdWIoIHV2MCApO1xyXG4gICAgICAgICAgICAgICAgZGVsdGFVVjIgPSB1djIuc3ViKCB1djAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICByID0gMSAvICggZGVsdGFVVjEueCAqIGRlbHRhVVYyLnkgLSBkZWx0YVVWMS55ICogZGVsdGFVVjIueCApO1xyXG5cclxuICAgICAgICAgICAgICAgIHAxdXYyeSA9IGRlbHRhUG9zMS5tdWx0KCBkZWx0YVVWMi55ICk7XHJcbiAgICAgICAgICAgICAgICBwMnV2MXkgPSBkZWx0YVBvczIubXVsdCggZGVsdGFVVjEueSApO1xyXG4gICAgICAgICAgICAgICAgdGFuZ2VudCA9ICggKCBwMXV2MnkgKS5zdWIoIHAydXYxeSApICkubXVsdCggciApO1xyXG5cclxuICAgICAgICAgICAgICAgIHAydXYxeCA9IGRlbHRhUG9zMi5tdWx0KCBkZWx0YVVWMS54ICk7XHJcbiAgICAgICAgICAgICAgICBwMXV2MnggPSBkZWx0YVBvczEubXVsdCggZGVsdGFVVjIueCApO1xyXG4gICAgICAgICAgICAgICAgYml0YW5nZW50ID0gKCAoIHAydXYxeCApLnN1YiggcDF1djJ4ICkgKS5tdWx0KCByICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZW5zdXJlIHRoZSB0YW5nZW50IGlzIG9ydGhvZ29uYWwgd2l0aCB0aGUgbm9ybWFsXHJcbiAgICAgICAgICAgICAgICB0YW5nZW50MCA9IG9ydGhvZ29uYWxpemVUYW5nZW50KCBub3JtYWxzWyBhIF0sIHRhbmdlbnQsIGJpdGFuZ2VudCApO1xyXG4gICAgICAgICAgICAgICAgdGFuZ2VudDEgPSBvcnRob2dvbmFsaXplVGFuZ2VudCggbm9ybWFsc1sgYiBdLCB0YW5nZW50LCBiaXRhbmdlbnQgKTtcclxuICAgICAgICAgICAgICAgIHRhbmdlbnQyID0gb3J0aG9nb25hbGl6ZVRhbmdlbnQoIG5vcm1hbHNbIGMgXSwgdGFuZ2VudCwgYml0YW5nZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdGFuZ2VudHMgb3IgYmktdGFuZ2VudHMgbWF5IGJlIHNoYXJlZCBieSBtdWx0aXBsZSB0cmlhbmdsZXMsXHJcbiAgICAgICAgICAgICAgICAvLyBpbiB0aGlzIGNhc2UgYWRkIGl0IHRvIHRoZSBjdXJyZW50IHRhbmdlbnQuIFdlIGRvbid0XHJcbiAgICAgICAgICAgICAgICAvLyBub3JtYWxpemUgaGVyZSBhcyBpdCBnaXZlcyBtb3JlIHdlaWdodCB0byBsYXJnZXIgdHJpYW5nbGVzLlxyXG4gICAgICAgICAgICAgICAgc2V0T3JBZGQoIHRhbmdlbnRzLCBhLCB0YW5nZW50MCApO1xyXG4gICAgICAgICAgICAgICAgc2V0T3JBZGQoIHRhbmdlbnRzLCBiLCB0YW5nZW50MSApO1xyXG4gICAgICAgICAgICAgICAgc2V0T3JBZGQoIHRhbmdlbnRzLCBjLCB0YW5nZW50MiApO1xyXG5cclxuICAgICAgICAgICAgICAgIHNldE9yQWRkKCBiaXRhbmdlbnRzLCBhLCBiaXRhbmdlbnQgKTtcclxuICAgICAgICAgICAgICAgIHNldE9yQWRkKCBiaXRhbmdlbnRzLCBiLCBiaXRhbmdlbnQgKTtcclxuICAgICAgICAgICAgICAgIHNldE9yQWRkKCBiaXRhbmdlbnRzLCBjLCBiaXRhbmdlbnQgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gbm93IHdlIG5vcm1hbGl6ZSB0aGUgdGFuZ2VudHMgYW5kIGJpLXRhbmdlbnRzXHJcbiAgICAgICAgICAgIGZvciAoIGk9MDsgaTx0YW5nZW50cy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIHRhbmdlbnRzW2ldID0gdGFuZ2VudHNbaV0ubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBiaXRhbmdlbnRzW2ldID0gYml0YW5nZW50c1tpXS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHRhbmdlbnRzOiB0YW5nZW50cyxcclxuICAgICAgICAgICAgICAgIGJpdGFuZ2VudHM6IGJpdGFuZ2VudHNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFNMSUNFUyA9IDIwLFxyXG4gICAgICAgIFNUQUNLUyA9IDIwLFxyXG4gICAgICAgIFJBRElVUyA9IDE7XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgICAgIHBvc2l0aW9uczogZnVuY3Rpb24oIHNsaWNlcywgc3RhY2tzLCByYWRpdXMgKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbnMgPSBbXSxcclxuICAgICAgICAgICAgICAgIHN0YWNrQW5nbGUsXHJcbiAgICAgICAgICAgICAgICBzbGljZUFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgcjAsIHkwLCB4MCwgejAsXHJcbiAgICAgICAgICAgICAgICBpLCBqO1xyXG4gICAgICAgICAgICBzbGljZXMgPSBzbGljZXMgfHwgU0xJQ0VTO1xyXG4gICAgICAgICAgICBzdGFja3MgPSBzdGFja3MgfHwgU1RBQ0tTO1xyXG4gICAgICAgICAgICByYWRpdXMgPSByYWRpdXMgfHwgUkFESVVTO1xyXG4gICAgICAgICAgICBzdGFja0FuZ2xlID0gTWF0aC5QSSAvIHN0YWNrcztcclxuICAgICAgICBcdHNsaWNlQW5nbGUgPSAyICogTWF0aC5QSSAvIHNsaWNlcztcclxuICAgICAgICBcdGZvciAoIGk9MDsgaTw9c3RhY2tzOyBpKysgKSB7XHJcbiAgICAgICAgXHRcdHIwID0gcmFkaXVzICogTWF0aC5zaW4oIGkgKiBzdGFja0FuZ2xlICk7XHJcbiAgICAgICAgXHRcdHkwID0gcmFkaXVzICogTWF0aC5jb3MoIGkgKiBzdGFja0FuZ2xlICk7XHJcbiAgICAgICAgXHRcdGZvciAoIGo9MDsgajw9c2xpY2VzOyBqKysgKSB7XHJcbiAgICAgICAgXHRcdFx0eDAgPSByMCAqIE1hdGguc2luKCBqICogc2xpY2VBbmdsZSApO1xyXG4gICAgICAgIFx0XHRcdHowID0gcjAgKiBNYXRoLmNvcyggaiAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChbIHgwLCB5MCwgejAgXSk7XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuICAgICAgICAgICAgcmV0dXJuIHBvc2l0aW9ucztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBub3JtYWxzOiBmdW5jdGlvbiggc2xpY2VzLCBzdGFja3MgKSB7XHJcbiAgICAgICAgICAgIHZhciBub3JtYWxzID0gW10sXHJcbiAgICAgICAgICAgICAgICBzdGFja0FuZ2xlLFxyXG4gICAgICAgICAgICAgICAgc2xpY2VBbmdsZSxcclxuICAgICAgICAgICAgICAgIHIwLCB5MCwgeDAsIHowLFxyXG4gICAgICAgICAgICAgICAgaSwgajtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgICAgICAgICAgc3RhY2tzID0gc3RhY2tzIHx8IFNUQUNLUztcclxuICAgICAgICAgICAgc3RhY2tBbmdsZSA9IE1hdGguUEkgLyBzdGFja3M7XHJcbiAgICAgICAgXHRzbGljZUFuZ2xlID0gMiAqIE1hdGguUEkgLyBzbGljZXM7XHJcbiAgICAgICAgXHRmb3IgKCBpPTA7IGk8PXN0YWNrczsgaSsrICkge1xyXG4gICAgICAgIFx0XHRyMCA9IE1hdGguc2luKCBpICogc3RhY2tBbmdsZSApO1xyXG4gICAgICAgIFx0XHR5MCA9IE1hdGguY29zKCBpICogc3RhY2tBbmdsZSApO1xyXG4gICAgICAgIFx0XHRmb3IgKCBqPTA7IGo8PXNsaWNlczsgaisrICkge1xyXG4gICAgICAgIFx0XHRcdHgwID0gcjAgKiBNYXRoLnNpbiggaiAqIHNsaWNlQW5nbGUgKTtcclxuICAgICAgICBcdFx0XHR6MCA9IHIwICogTWF0aC5jb3MoIGogKiBzbGljZUFuZ2xlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFscy5wdXNoKFsgeDAsIHkwLCB6MCBdKTtcclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gbm9ybWFscztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1dnM6IGZ1bmN0aW9uKCBzbGljZXMsIHN0YWNrcyApIHtcclxuICAgICAgICAgICAgdmFyIHV2cyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgaSwgajtcclxuICAgICAgICAgICAgc2xpY2VzID0gc2xpY2VzIHx8IFNMSUNFUztcclxuICAgICAgICAgICAgc3RhY2tzID0gc3RhY2tzIHx8IFNUQUNLUztcclxuICAgICAgICAgICAgZm9yICggaT0wOyBpPD1zdGFja3M7IGkrKyApIHtcclxuICAgICAgICBcdFx0Zm9yICggaj0wOyBqPD1zbGljZXM7IGorKyApIHtcclxuICAgICAgICAgICAgICAgICAgICB1dnMucHVzaChbIGogLyBzbGljZXMsIDEtKGkgLyBzdGFja3MpIF0pO1xyXG4gICAgICAgIFx0XHR9XHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgICAgIHJldHVybiB1dnM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5kaWNlczogZnVuY3Rpb24oIHNsaWNlcywgc3RhY2tzICkge1xyXG4gICAgICAgIFx0dmFyIHZlcnRleEluZGV4ID0gMCxcclxuICAgICAgICAgICAgICAgIGluZGljZXMgPSBbXSxcclxuICAgICAgICAgICAgICAgIGksIGo7XHJcbiAgICAgICAgICAgIHNsaWNlcyA9IHNsaWNlcyB8fCBTTElDRVM7XHJcbiAgICAgICAgICAgIHN0YWNrcyA9IHN0YWNrcyB8fCBTVEFDS1M7XHJcbiAgICAgICAgXHRmb3IgKCBpPTA7IGk8PXN0YWNrczsgaSsrICkge1xyXG4gICAgICAgIFx0XHRmb3IgKCBqPTA7IGo8PXNsaWNlczsgaisrICkge1xyXG4gICAgICAgIFx0XHRcdGlmICggaSAhPT0gc3RhY2tzICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICsgc2xpY2VzICsgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goIHZlcnRleEluZGV4ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCggdmVydGV4SW5kZXggKyBzbGljZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIHNsaWNlcyArIDEgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCArIDEgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKCB2ZXJ0ZXhJbmRleCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRleCsrO1xyXG4gICAgICAgIFx0XHRcdH1cclxuICAgICAgICBcdFx0fVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgICAgICByZXR1cm4gaW5kaWNlcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZW9tZXRyeTogZnVuY3Rpb24oIHNsaWNlcywgc3RhY2tzLCByYWRpdXMgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMucG9zaXRpb25zKCBzbGljZXMsIHN0YWNrcywgcmFkaXVzICksXHJcbiAgICAgICAgICAgICAgICBub3JtYWxzOiB0aGlzLm5vcm1hbHMoIHNsaWNlcywgc3RhY2tzICksXHJcbiAgICAgICAgICAgICAgICB1dnM6IHRoaXMudXZzKCBzbGljZXMsIHN0YWNrcyApLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogdGhpcy5pbmRpY2VzKCBzbGljZXMsIHN0YWNrcyApLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KCkpO1xyXG4iXX0=
