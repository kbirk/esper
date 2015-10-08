(function () {

    "use strict";

    /**
     * Traverses the entity hierarchy depth-first and executes the
     * forEach function on each entity.
     *
     * @param {Entity} entity - The Entity object.
     * @param {Function} forEachEntity - The RenderPass forEachEntity function.
     * @param {Function} forEachMesh - The RenderPass forEachMesh function.
     * @param {Function} forEachSprite - The RenderPass forEachSprite function.
     */
    function forEachRecursive( entity, forEachEntity, forEachMesh, forEachSprite ) {
        // for each entity
        if ( forEachEntity ) {
            forEachEntity( entity );
        }
        // for each mesh
        if ( forEachMesh && entity.meshes ) {
            entity.meshes.forEach( function( mesh ) {
                forEachMesh( mesh, entity );
            });
        }
        // for each sprite
        if ( forEachSprite && entity.sprites ) {
            entity.sprites.forEach( function( sprite ) {
                forEachSprite( sprite, entity );
            });
        }
        // depth first traversal
        entity.children.forEach( function( child ) {
            forEachRecursive( child, forEachEntity, forEachMesh, forEachSprite );
        });
    }

    function RenderPass( spec ) {
        if ( typeof spec === 'object' ) {
            this.before = spec.before || null;
            this.forEachEntity = spec.forEachEntity || null;
            this.forEachMesh = spec.forEachMesh || null;
            this.forEachSprite = spec.forEachSprite || null;
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
            forEachSprite = this.forEachSprite,
            after = this.after;
        // setup function
        if ( before ) {
            before( camera );
        }
        // rendering functions
        entities.forEach( function( entity ) {
            if ( entity ) {
                forEachRecursive(
                    entity,
                    forEachEntity,
                    forEachMesh,
                    forEachSprite );
            }
        });
        // teardown function
        if ( after ) {
            after();
        }
    };

    module.exports = RenderPass;

}());
