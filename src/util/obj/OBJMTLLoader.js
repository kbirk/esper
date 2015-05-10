(function() {

    "use strict";

    var path = require('path'),
        Util = require('../Util'),
        OBJLoader = require('./OBJLoader'),
        MTLLoader = require('./MTLLoader');

    /**
     * Returns a function to load an MTL file, and execute a callback upon
     * completion.
     *
     * @param {String} url - The url for the MTL file to load.
     *
     * @returns {Function} The function to load the MTL file.
     */
    function loadMtl( url ) {
        return function( done ) {
            MTLLoader.load( url, done );
        };
    }

    /**
     * Iterates through the mitlib attribute of the model and loads materials
     * from all associated .mtl files. Passes the material specification objects
     * to the callback function.
     *
     * @param {Object} model - The model information object.
     * @param {String baseUrl - The base URL of the folder containing the material dependency files.
     * @param {Function} callback - The callback function executed upon completion.
     */
    function loadMaterials( model, baseUrl, callback ) {
        var jobs = [],
            i;
        // if not material, exit early
        if ( !model.mtllib ) {
            callback( model );
            return;
        }
        // set up the material loading job
        for ( i=0; i<model.mtllib.length; i++ ) {
            jobs.push( loadMtl( baseUrl + '/' + model.mtllib[ i ] ) );
        }
        // dispatch all material loading jobs
        Util.async( jobs, function( materials ) {
            var materialsByName = {},
                i;
            for ( i=0; i<materials.length; i++ ) {
                Util.extend( materialsByName, materials[i] );
            }
            callback( materialsByName );
        });
    }

    module.exports = {

        /**
         * Loads a wavefront .obj file, generates a model specification object,
         * and passes it to the callback function upon completion.This also
         * involves loading and generating the associated material specification
         * objects from the respective wavefront .mtl files.
         *
         * @param {String} url - The url to the .obj file.
         * @param {Function} callback - The callback functione executed upon completion.
         */
        load: function( url, callback ) {
            // load and parse OBJ file
            OBJLoader.load( url, function( model ) {
                // then load and parse MTL file
                loadMaterials( model, path.dirname( url ), function( materialsById ) {
                    // add each material to the associated mesh
                    var meshes = model.meshes,
                        i;
                    for ( i=0; i<meshes.length; i++ ) {
                        meshes[i].material = materialsById[ meshes[i].material ];
                    }
                    callback( model );
                });
            });
        }

     };

}());
