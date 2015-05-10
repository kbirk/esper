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
