(function () {

    "use strict";

    var Renderable = require('./Renderable'),
        Geometry = require('./Geometry'),
        Quad = require('../util/shapes/Quad'),
        Material = require('./Material'),
        _geometry,
        _renderable;

    function getGeometry() {
        if ( !_geometry ) {
            _geometry = new Geometry({
                positions: Quad.positions(),
                indices: Quad.indices()
            });
        }
        return _geometry;
    }

    function getRenderable() {
        if ( !_renderable ) {
            _renderable = new Renderable({
                positions: Quad.positions(),
                indices: Quad.indices()
            });
        }
        return _renderable;
    }

    function Sprite( spec ) {
        spec = spec || {};
        this.renderable = getRenderable();
        this.geometry = getGeometry();
        this.material = new Material( spec );
        this.width = spec.width || this.material.diffuseTexture.width;
        this.height = spec.height || this.material.diffuseTexture.height;
    }

    Sprite.prototype.draw = function() {
        this.renderable.draw();
        return this;
    };

    module.exports = Sprite;

}());
