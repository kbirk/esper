(function () {

    "use strict";

    var Transform = require('alfador').Transform,
        Mesh = require('./Mesh'),
        Sprite = require('./Sprite'),
        Skeleton = require('./Skeleton'),
        Animation = require('./Animation');

    function Entity( spec ) {
        var that = this;
        spec = spec || {};
        // call base constructor for transform
        Transform.call( this, spec );
        // set id if there is one
        if ( spec.id ) {
            this.id = spec.id;
        }
        // set parent
        this.parent = spec.parent || null;
        // set children
        this.children = [];
        if ( spec.children ) {
            spec.children.forEach( function( child ) {
                that.addChild( child );
            });
        }
        // set meshes
        this.meshes = [];
        if ( spec.meshes ) {
            spec.meshes.forEach( function( mesh ) {
                if ( mesh instanceof Mesh ) {
                    that.meshes.push( mesh );
                } else {
                    that.meshes.push( new Mesh( mesh ) );
                }
            });
        }
        // set sprites
        this.sprites = [];
        if ( spec.sprites ) {
            spec.sprites.forEach( function( sprite ) {
                if ( sprite instanceof Sprite ) {
                    that.sprites.push( sprite );
                } else {
                    that.sprites.push( new Sprite( sprite ) );
                }
            });
        }
        // set skeleton, if it exists
        this.skeleton = null;
        if ( spec.skeleton ) {
            if ( spec.skeleton instanceof Skeleton ) {
                this.skeleton = spec.skeleton;
            } else {
                this.skeleton = new Skeleton( spec.skeleton );
            }
        }
        // set animations, if they exist
        this.animations = {};
        if ( spec.animations ) {
            for ( var key in spec.animations ) {
                if ( spec.animations.hasOwnProperty( key ) ) {
                    if ( spec.animations[ key ] instanceof Animation ) {
                        this.animations[ key ] = spec.animations;
                    } else {
                        this.animations[ key ] = new Animation( spec.animations );
                    }
                }
            }
        }
    }

    Entity.prototype = Object.create( Transform.prototype );

    Entity.prototype.globalMatrix = function() {
        if ( this.parent ) {
            return this.parent.globalMatrix().mult( this.matrix() );
        }
        return this.matrix();
    };

    Entity.prototype.globalViewMatrix = function() {
        if ( this.parent ) {
            return this.parent.mult( this.matrix() ).viewMatrix();
        }
        return this.viewMatrix();
    };

    Entity.prototype.addChild = function( child ) {
        if ( !( child instanceof Entity ) ) {
            child = new Entity( child );
        }
        child.parent = this;
        this.children.push( child );
        return this;
    };

    Entity.prototype.removeChild = function( child ) {
        var index = this.children.indexOf( child );
        if ( index !== -1 ) {
            this.children.splice( index, 1 );
            child.parent = null;
        }
        return this;
    };

    Entity.prototype.depthFirst = function( callback ) {
        callback( this );
        this.children.forEach( function( child ) {
            child.depthFirst( callback );
        });
    };

    Entity.prototype.breadthFirst = function( callback ) {
        var queue = [ this ];
        while ( queue.length > 0 ) {
            var top = queue.shift();
            queue = queue.concat( queue, top.children );
            callback( top );
        }
    };

    Entity.prototype.copy = function() {
        var that = new Entity({
                up: this.up(),
                forward: this.forward(),
                origin: this.origin(),
                scale: this.scale(),
                meshes: this.meshes, // copy by reference
                sprites: this.sprites, // copy by reference
                skeleton: this.skeleton, // copy by reference
                animations: this.animations // copy by reference
            });
        // copy children by value
        this.children.forEach( function( child ) {
            that.addChild( child.copy() );
        });
        return that;
    };

    module.exports = Entity;

}());
