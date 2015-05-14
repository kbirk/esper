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
