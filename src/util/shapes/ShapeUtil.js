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
