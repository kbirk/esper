(function () {

    "use strict";

    var Texture2D = require('../core/Texture2D');

    function createTexture( texture ) {
        if ( !( texture instanceof Texture2D ) ) {
            return new Texture2D({
                image: texture
            });
        }
        return texture;
    }

    function parseColor( color ) {
        if ( color instanceof Array ) {
            return [ color[0], color[1], color[2], color[3] || 1.0 ];
        }
        return color;
    }

    function Material( spec ) {
        spec = spec || {};
        this.id = spec.id;
        this.diffuseColor = parseColor( spec.diffuseColor ) || [ 1, 0, 1, 1 ];
        this.ambientColor = parseColor( spec.ambientColor ) || [ 0, 0, 0, 1 ];
        this.specularColor = parseColor( spec.specularColor ) || [ 1, 1, 1, 1 ];
        this.specularComponent = spec.specularComponent || 10;
        if ( spec.diffuseTexture ) {
            this.diffuseTexture = createTexture( spec.diffuseTexture );
        }
        if ( spec.ambientTexture ) {
            this.ambientTexture = createTexture( spec.ambientTexture );
        }
        if ( spec.specularTexture ) {
            this.specularTexture = createTexture( spec.specularTexture );
        }
        return this;
    }

    module.exports = Material;

}());
