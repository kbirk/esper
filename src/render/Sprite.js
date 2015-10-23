(function () {

    "use strict";

    var Renderable = require('./Renderable'),
        Geometry = require('./Geometry'),
        SpriteAnimation = require('./SpriteAnimation'),
        Quad = require('../util/shapes/Quad'),
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
        this.animations = {};
        if ( spec.animations ) {
            for ( var key in spec.animations ) {
                if ( spec.animations.hasOwnProperty( key ) ) {
                    this.addAnimation( key, spec.animations[ key ] );
                }
            }
        }
    }

    Sprite.prototype.addAnimation = function( animationId, animation ) {
        if ( animation instanceof SpriteAnimation ) {
            this.animations[ animationId ] = animation;
        } else {
            this.animations[ animationId ] = new SpriteAnimation( animation );
        }
    };

    Sprite.prototype.getFrame = function( animationId, timestamp ) {
        var animation = this.animations[ animationId ];
        if ( !animation ) {
            console.warn( 'Animation of id"' + animationId + '" does not exist, returning null.' );
            return null;
        }
        return animation.getFrame( timestamp );
    };

    Sprite.prototype.draw = function() {
        this.renderable.draw();
        return this;
    };

    module.exports = Sprite;

}());
