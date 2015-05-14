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
