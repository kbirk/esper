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
