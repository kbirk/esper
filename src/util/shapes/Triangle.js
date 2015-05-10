(function () {

    "use strict";

    var Vec3 = require('alfador').Vec3;

    function Triangle( spec ) {
        this.positions = [
            new Vec3( spec.positions[0] || spec[0] ),
            new Vec3( spec.positions[1] || spec[1] ),
            new Vec3( spec.positions[2] || spec[2] )
        ];
    }

    Triangle.prototype.getRadius = function() {
        if ( !this.radius ) {
            var positions = this.positions,
                centroid = this.getCentroid(),
                aDist = positions[0].sub( centroid ).length(),
                bDist = positions[1].sub( centroid ).length(),
                cDist = positions[2].sub( centroid ).length();
            this.radius = Math.max( aDist, Math.max( bDist, cDist ) );
        }
        return this.radius;
    };

    Triangle.prototype.getCentroid = function() {
        if ( !this.centroid ) {
            var positions = this.positions;
            this.centroid = positions[0]
                .add( positions[1] )
                .add( positions[2] )
                .div( 3 );
        }
        return this.centroid;
    };

    Triangle.prototype.getNormal = function() {
        if ( !this.normal ) {
            var positions = this.positions,
                ab = positions[0].sub( positions[1] ),
                ac = positions[0].sub( positions[2] );
            this.normal = ab.cross( ac ).normalize();
        }
        return this.normal;
    };

    module.exports = Triangle;

}());
