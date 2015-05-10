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

        function buildTriangleFromIndices( posIndices, uvIndices, normIndices ) {
            var triangle = {},
                a, b, c, u, v,
                normal, mag;
            // add positions to the triangle
            triangle.positions = [
                positions[ parseInt( posIndices[0] ) - 1 ],
                positions[ parseInt( posIndices[1] ) - 1 ],
                positions[ parseInt( posIndices[2] ) - 1 ]
            ];
            // if uvs are provided, add them to the triangle
            if ( uvIndices !== undefined ) {
                triangle.uvs = [
                    uvs[ parseInt( uvIndices[0] ) - 1 ],
                    uvs[ parseInt( uvIndices[1] ) - 1 ],
                    uvs[ parseInt( uvIndices[2] ) - 1 ],
                ];
            }
            // if normals are provided, add them to the triangle
            if ( normIndices !== undefined ) {
                triangle.normals = [
                    normals[ parseInt( normIndices[0] ) - 1 ],
                    normals[ parseInt( normIndices[1] ) - 1 ],
                    normals[ parseInt( normIndices[2] ) - 1 ]
                ];
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
            var posTri0, posTri1,
                normTri0, normTri1,
                uvTri0, uvTri1;
            if ( posIndices[ 3 ] === undefined ) {
                // face is a triangle
                buildTriangleFromIndices( posIndices, uvIndices, normIndices );
            } else {
                // face is a quad, create two triangles
                posTri0 = [ posIndices[ 0 ], posIndices[ 1 ], posIndices[ 2 ] ];
                posTri1 = [ posIndices[ 0 ], posIndices[ 2 ], posIndices[ 3 ] ];
                if ( uvIndices ) {
                    uvTri0 = [ uvIndices[ 0 ], uvIndices[ 1 ], uvIndices[ 2 ] ];
                    uvTri1 = [ uvIndices[ 0 ], uvIndices[ 2 ], uvIndices[ 3 ] ];
                }
                if ( normIndices ) {
                    normTri0 = [ normIndices[ 0 ], normIndices[ 1 ], normIndices[ 2 ] ];
                    normTri1 = [ normIndices[ 0 ], normIndices[ 2 ], normIndices[ 3 ] ];
                }
                buildTriangleFromIndices( posTri0, uvTri0, normTri0 );
                buildTriangleFromIndices( posTri1, uvTri1, normTri1 );
            }
        }

            // v float float float
        var POSITION_REGEX = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/,
            // vn float float float
            NORMAL_REGEX = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/,
            // vt float float
            UV_REGEX = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/,
            // f vertex vertex vertex ...
            FACE_V_REGEX = /f( +\d+)( +\d+)( +\d+)( +\d+)?/,
            // f vertex/uv vertex/uv vertex/uv ...
            FACE_V_UV_REGEX = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/,
            // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
            FACE_V_UV_N_REGEX = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/,
            // f vertex//normal vertex//normal vertex//normal ...
            FACE_V_N_REGEX = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/,
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
                    1-parseFloat( result[ 2 ] ) // invert this uv component...
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
                    ]);
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
                    ]);
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
                    [], // uvs
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
            } else {
                console.log( "OBJLoader: Unhandled line " + line );
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
                    responseType: "text/plain",
                    success: function( src ) {
                        var parsed = parseOBJSource( src ),
                            model = convertTrianglesToArrays( parsed );
                            callback( model );
                    }
                });
        }

     };

}());
