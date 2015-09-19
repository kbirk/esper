(function () {

    "use strict";

    /**
     * Traverses the entity hierarchy depth-first and executes the
     * forEach function on each entity.
     *
     * @param {Entity} entity - The Entity object.
     * @param {Function} forEachEntity - The RenderPass forEachEntity function.
     * @param {Function} forEachMesh - The RenderPass forEachMesh function.
     */
    function forEachRecursive( entity, forEachEntity, forEachMesh ) {
        // for each entity
        if ( forEachEntity ) {
            forEachEntity( entity );
        }
        // for each Mesh
        if ( forEachMesh ) {
            entity.meshes.forEach( function( mesh ) {
                forEachMesh( mesh, entity );
            });
        }
        // depth first traversal
        entity.children.forEach( function( child ) {
            forEachRecursive( child, forEachEntity, forEachMesh );
        });
    }

    function RenderPass( spec ) {
        if ( typeof spec === 'object' ) {
            this.before = spec.before || null;
            this.forEachEntity = spec.forEachEntity || null;
            this.forEachMesh = spec.forEachMesh || null;
            this.after = spec.after || null;
        } else if ( typeof spec === 'function' ) {
            this.before = spec;
        }
        return this;
    }

    RenderPass.prototype.execute = function( camera, entities ) {
        var before = this.before,
            forEachEntity = this.forEachEntity,
            forEachMesh = this.forEachMesh,
            after = this.after;
        // setup function
        if ( before ) {
            before( camera );
        }
        // rendering functions
        entities.forEach( function( entity ) {
            if ( entity ) {
                forEachRecursive( entity, forEachEntity, forEachMesh );
            }
        });
        // teardown function
        if ( after ) {
            after();
        }
    };

    module.exports = RenderPass;

}());
