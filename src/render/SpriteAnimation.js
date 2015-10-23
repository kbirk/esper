(function () {

    "use strict";

    function getFrameTimestamp( frames, frameIndex ) {
        var frame = frames[ frameIndex ];
        if ( frame ) {
            return frame.timestamp || ( frameIndex / frames.length );
        }
        return null;
    }

    function SpriteAnimation( spec ) {
        spec = spec || {};
        var that = this;
        this.frames = [];
        if ( spec.frames ) {
            spec.frames.forEach( function( frame ) {
                that.addFrame( frame );
            });
        }
        this.shouldLoop = spec.shouldLoop !== undefined ? spec.shouldLoop : false;
        return this;
    }

    SpriteAnimation.prototype.addFrame = function( frame ) {
        var that = this;
        this.frames.push({
            channels: [],
            timestamp: frame.timestamp
        });
        if ( frame.channels ) {
            frame.channels.forEach( function( channel ) {
                that.addChannel( channel, that.frames.length - 1 );
            });
        } else if ( frame.texture ) {
            this.addChannel( frame, that.frames.length - 1 );
        }
    };

    SpriteAnimation.prototype.addChannel = function( channel, frameIndex ) {
        this.frames[ frameIndex ].channels.push({
            texture: channel.texture,
            x: channel.x !== undefined ? channel.x : 0,
            y: channel.y !== undefined ? channel.y : 0,
            width: channel.width !== undefined ? channel.width : channel.texture.width,
            height: channel.height !== undefined ? channel.height : channel.texture.height,
            origin: {
                x: channel.origin.x,
                y: channel.origin.y
            },
            flipX: channel.flipX !== undefined ? channel.flipX : false,
            scale: channel.scale || { x: 1, y: 1 },
            rotation: channel.rotation !== undefined ? channel.rotation : 0
        });
    };

    SpriteAnimation.prototype.getFrame = function( timestamp ) {
        if ( this.shouldLoop ) {
            timestamp = timestamp % 1;
        }
        var frameTimestamp = getFrameTimestamp( this.frames, 0 ),
            i = 0;
        while ( frameTimestamp !== null && frameTimestamp <= timestamp ) {
            frameTimestamp = getFrameTimestamp( this.frames, ++i );
        }
        return this.frames[ i - 1 ];
    };

    module.exports = SpriteAnimation;

}());
