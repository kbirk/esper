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
