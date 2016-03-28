(function() {

    'use strict';

    var assert = require('assert');
    var WebGLContext = require('../../src/core/WebGLContext');
    var DepthTexture2D = require('../../src/core/DepthTexture2D');
    require('webgl-mock');
    var canvas;
    var gl;
    var data;
    var width;
    var height;

    describe('DepthTexture2D', function() {

        before( function() {
            canvas = new HTMLCanvasElement();
            gl = WebGLContext.get( canvas );
        });

        after( function() {
            WebGLContext.remove( canvas );
            canvas = null;
            gl = null;
        });

        beforeEach( function() {
            var dim = Math.pow(2, Math.floor( Math.random() * 4 ) + 1 );
            data = new Uint8Array( dim * dim * 4 );
            for ( var i = 0; i<dim * dim * 4; i++ ) {
                data[i] = 255;
            }
            width = dim;
            height = dim;
        });

        afterEach( function() {
            data = null;
            width = null;
            height = null;
        });

        describe('#constructor()', function() {
            it('should be provided `width` and `height` arguments', function() {
                try {
                    new DepthTexture2D({
                        width: width,
                        height: height
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept generic `wrap` and `filter` parameters', function() {
                try {
                    new DepthTexture2D({
                        width: width,
                        height: height,
                        filter: 'LINEAR',
                        wrap: 'REPEAT'
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should accept `wrapS`, `wrapT`, `minFilter`, and `magFilter` parameters', function() {
                try {
                    var tex = new DepthTexture2D({
                        width: width,
                        height: height,
                        minFilter: 'LINEAR',
                        magFilter: 'LINEAR',
                        wrapS: 'REPEAT',
                        wrapT: 'REPEAT'
                    });
                    assert( tex.minFilter === 'LINEAR' );
                    assert( tex.magFilter === 'LINEAR' );
                    assert( tex.wrapS === 'REPEAT' );
                    assert( tex.wrapT === 'REPEAT' );
                } catch( err ) {
                    assert( false );
                }
            });
            it('should default `wrapS` and `wrapT` parameters to `CLAMP_TO_EDGE`', function() {
                var tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.wrapS === 'CLAMP_TO_EDGE' );
                assert( tex.wrapT === 'CLAMP_TO_EDGE' );
            });
            it('should default `minFilter` and `magFilter` parameters to `LINEAR`', function() {
                var tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.minFilter === 'LINEAR' );
                assert( tex.magFilter === 'LINEAR' );
            });
            it('should accept `format`, and `type` options`', function() {
                try {
                    new DepthTexture2D({
                        width: width,
                        height: height,
                        format: 'RGBA',
                        type: 'UNSIGNED_BYTE'
                    });
                } catch( err ) {
                    assert( false );
                }
            });
            it('should set `type` to `UNSIGNED_INT_24_8_WEBGL` if `format` is `DEPTH_STENCIL`', function() {
                var tex = new DepthTexture2D({
                    width: width,
                    height: height,
                    format: 'DEPTH_STENCIL'
                });
                assert( tex.type === 'UNSIGNED_INT_24_8_WEBGL' );
            });
            it('should default `format` to `DEPTH_COMPONENT`', function() {
                var tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.format === 'DEPTH_COMPONENT' );
            });
            it('should default `type` to `UNSIGNED_BYTE`', function() {
                var tex = new DepthTexture2D({
                    width: width,
                    height: height
                });
                assert( tex.type === 'UNSIGNED_INT' );
            });
        });

    });

}());
