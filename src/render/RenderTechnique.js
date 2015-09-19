(function () {

    "use strict";

    function RenderTechnique( spec ) {
        this.id = spec.id;
        this.passes = spec.passes || [];
        return this;
    }

    RenderTechnique.prototype.execute = function( camera, entities ) {
        this.passes.forEach( function( pass ) {
            pass.execute( camera, entities );
        });
    };

    module.exports = RenderTechnique;

}());
