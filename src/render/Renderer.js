(function () {

    "use strict";

    function Renderer( techniques ) {
        if ( !( techniques instanceof Array ) ) {
            techniques = [ techniques ];
        }
        this.techniques = techniques || [];
        return this;
    }

    Renderer.prototype.render = function( entities ) {
        var techniques = this.techniques,
            technique,
            i;
        for ( i=0; i<techniques.length; i++ ) {
            technique = techniques[i];
            technique.execute( entities[ technique.id ] || [] );
        }
    };

    module.exports = Renderer;

}());
