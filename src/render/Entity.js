(function () {

    "use strict";

    var Transform = require('alfador').Transform,
        Mesh = require('./Mesh'),
        Skeleton = require('./Skeleton'),
        Animation = require('./Animation');

    function Entity( spec ) {
        var key, i;
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
            for ( i=0; i<spec.children.length; i++ ) {
                this.addChild( spec.children[i] );
            }
        }
        // set meshes
        this.meshes = [];
        if ( spec.meshes ) {
            for ( i=0; i<spec.meshes.length; i++ ) {
                if ( spec.meshes[i] instanceof Mesh ) {
                    this.meshes.push( spec.meshes[i] );
                } else {
                    this.meshes.push( new Mesh( spec.meshes[i] ) );
                }
            }
        }
        // set skeleton, if it exists
        this.skeleton = null;
        if ( spec.skeleton ) {
            if ( spec.skeleton instanceof Skeleton ) {
                this.skeleton = spec.skeleton;
            } else {
                this.skeleton = new Skeleton( spec.meshes[i] );
            }
        }
        // set animations, if they exist
        this.animations = {};
        if ( spec.animations ) {
            for ( key in spec.animations ) {
                if ( spec.animations.hasOwnProperty( key ) ) {
                    if ( spec.animations[ key ] instanceof Animation ) {
                        this.animations[ key ] = spec.animations;
                    } else {
                        this.animations[ key ] = new Animation( spec.animations );
                    }
                }
            }
        }
        return this;
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

    Entity.prototype.forEach = function( callback ) {
        var child,
            i;
        callback( this );
        for ( i=0; i<this.children.length; i++ ) {
            child = this.children[i];
            if ( child.forEach ) {
                child.forEach( callback );
            }
        }
    };

    Entity.prototype.copy = function() {
        var that = new Entity({
                up: this.up(),
                forward: this.forward(),
                origin: this.origin(),
                scale: this.scale(),
                meshes: this.meshes, // copy by reference,
                skeleton: this.skeleton, // copy by reference
                animations: this.animations // copy by reference
            }),
            i;
        // copy children by value
        for ( i=0; i<this.children.length; i++ ) {
            that.addChild( this.children[i].copy() );
        }
        return that;
    };

    module.exports = Entity;

}());
