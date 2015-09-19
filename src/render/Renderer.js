(function () {

    "use strict";

    function Renderer( techniques ) {
        if ( !( techniques instanceof Array ) ) {
            techniques = [ techniques ];
        }
        this.techniques = techniques || [];
        return this;
    }

    Renderer.prototype.render = function( camera, entitiesByTechnique ) {
        this.techniques.forEach( function( technique ) {
            var entities = entitiesByTechnique[ technique.id ];
            if ( entities && entities.length > 0 ) {
                technique.execute( camera, entities );
            }
        });
    };

    module.exports = Renderer;

}());
