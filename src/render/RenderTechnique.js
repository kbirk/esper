(function () {

    "use strict";

    function RenderTechnique( spec ) {
        this.id = spec.id;
        this.passes = spec.passes || [];
        return this;
    }

    RenderTechnique.prototype.execute = function( camera, entities ) {
        var passes = this.passes,
            pass,
            i;
        for ( i=0; i<passes.length; i++ ) {
            pass = passes[i];
            pass.execute( camera, entities );
        }
    };

    module.exports = RenderTechnique;

}());
