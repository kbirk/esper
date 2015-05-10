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
        var meshes = entity.meshes,
            children = entity.children,
            i;
        // for each entity
        if ( forEachEntity ) {
            forEachEntity( entity );
        }
        // for each Mesh
        if ( forEachMesh ) {
            for ( i=0; i<meshes.length; i++ ) {
                forEachMesh( meshes[i] );
            }
        }
        // depth first traversal
        for ( i=0; i<children.length; i++ ) {
            forEachRecursive( children[i], forEachEntity, forEachMesh );
        }
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

    RenderPass.prototype.execute = function( entities ) {
        var before = this.before,
            forEachEntity = this.forEachEntity,
            forEachMesh = this.forEachMesh,
            after = this.after,
            i;
        // setup function
        if ( before ) {
            before();
        }
        // rendering functions
        for ( i=0; i<entities.length; i++ ) {
            forEachRecursive( entities[i], forEachEntity, forEachMesh );
        }
        // teardown function
        if ( after ) {
            after();
        }
    };

    module.exports = RenderPass;

}());
