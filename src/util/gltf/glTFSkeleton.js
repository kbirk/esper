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
