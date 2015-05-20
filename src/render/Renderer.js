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
        var techniques = this.techniques,
            technique,
            entities,
            i;
        for ( i=0; i<techniques.length; i++ ) {
            technique = techniques[i];
            entities = entitiesByTechnique[ technique.id ];
            if ( entities && entities.length > 0 ) {
                technique.execute( camera, entities );
            }
        }
    };

    module.exports = Renderer;

}());
