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
