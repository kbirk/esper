(function () {

    "use strict";

    var PROJ_MATRIX = "uProjectionMatrix",
        MODEL_MATRIX = "uModelMatrix",
        VIEW_MATRIX = "uViewMatrix",
        POS_ATTRIB = "aPosition",
        USE_ATTRIB_COLOR = "uUseAttribColor",
        COL_ATTRIB = "aColor",
        COL_UNIFORM = "uColor";

    var VERT_SRC = [
            "attribute highp vec3 " + POS_ATTRIB + ";",
            "attribute highp vec3 " + COL_ATTRIB + ";",
            "uniform highp mat4 " + MODEL_MATRIX + ";",
            "uniform highp mat4 " + VIEW_MATRIX + ";",
            "uniform highp mat4 " + PROJ_MATRIX + ";",
            "uniform bool " + USE_ATTRIB_COLOR + ";",
            "uniform highp vec3 " + COL_UNIFORM + ";",
            "varying highp vec3 vColor;",
            "void main() {",
                "if ( " + USE_ATTRIB_COLOR + " ) {",
                    "vColor = " + COL_ATTRIB + ";",
                "} else {",
                    "vColor = " + COL_UNIFORM + ";",
                "}",
                "gl_Position = " + PROJ_MATRIX +
                    " * " + VIEW_MATRIX +
                    " * " + MODEL_MATRIX +
                    " * vec4( " + POS_ATTRIB + ", 1.0 );",
            "}"
        ].join('\n');

    var FRAG_SRC = [
            "varying highp vec3 vColor;",
            "void main() {",
                "gl_FragColor = vec4( vColor, 1.0 );",
            "}"
        ].join('\n');

    var DEBUG_SHADER = null;

    var Shader = require('../../core/Shader'),
        Mesh = require('../../render/Mesh'),
        Renderer = require('../../render/Renderer'),
        RenderTechnique = require('../../render/RenderTechnique'),
        RenderPass = require('../../render/RenderPass'),
        _debugUUID = 1,
        _renderMap = {},
        _camera = null;

    function getFuncName( func ) {
      var name = func.toString();
      name = name.substr( 'function '.length );
      name = name.substr( 0, name.indexOf('(') );
      return name;
    }

    function createDebugEntity( entity, func ) {
        entity.$$DEBUG_UUID = entity.$$DEBUG_UUID || _debugUUID++;
        var debugHash = entity.$$DEBUG_UUID + "-" + getFuncName( func );
        if ( !_renderMap[ debugHash ] ) {
            _renderMap[ debugHash ] = func( entity );
        }
        return _renderMap[ debugHash ];
    }

    function convertArrayToColors( array ) {
        var colors = new Array( array.length ),
            attrib,
            i;
        for ( i=0; i<array.length; i++ ) {
            attrib = array[i];
            colors[i] = [
                ( ( attrib.x || attrib[0] ) + 1 ) / 2,
                ( ( attrib.y || attrib[1] )  + 1 ) / 2,
                ( ( attrib.z || attrib[2] || 0 ) + 1 ) / 2
            ];
        }
        return colors;
    }

    function createWireFrameEntity( entity ) {
        var copy = entity.copy();
        copy.forEach( function( entity ) {
            var meshes = entity.meshes,
                geometry,
                positions,
                material,
                triIndices,
                lines,
                indices,
                a, b, c,
                i, j;
            entity.meshes = [];
            for ( i=0; i<meshes.length; i++ ) {
                geometry = meshes[i].geometry;
                positions = geometry.positions;
                triIndices = geometry.indices;
                lines = new Array( triIndices.length * 2 );
                indices = new Array( triIndices.length * 2 );
                for ( j=0; j<triIndices.length; j+=3 ) {
                    a = triIndices[j];
                    b = triIndices[j+1];
                    c = triIndices[j+2];
                    lines[j*2] = positions[a];
                    lines[j*2+1] = positions[b];
                    lines[j*2+2] = positions[b];
                    lines[j*2+3] = positions[c];
                    lines[j*2+4] = positions[c];
                    lines[j*2+5] = positions[a];
                    indices[j*2] = j*2;
                    indices[j*2+1] = j*2+1;
                    indices[j*2+2] = j*2+2;
                    indices[j*2+3] = j*2+3;
                    indices[j*2+4] = j*2+4;
                    indices[j*2+5] = j*2+5;
                }
                entity.meshes.push( new Mesh({
                    positions: lines,
                    indices: indices,
                    options: {
                        mode: "LINES"
                    },
                    material: material
                }));
            }
            entity.$$DEBUG_USE_COLOR = false;
        });
        return copy;
    }

    function createColorEntity( entity, attribute ) {
        var copy = entity.copy();
        copy.forEach( function( entity ) {
            var meshes = entity.meshes,
                geometry,
                i;
            entity.meshes = [];
            for ( i=0; i<meshes.length; i++ ) {
                geometry = meshes[i].geometry;
                entity.meshes.push( new Mesh({
                    positions: geometry.positions,
                    colors: convertArrayToColors( geometry[ attribute ] ),
                    indices: geometry.indices
                }));
            }
            entity.$$DEBUG_USE_COLOR = true;
        });
        return copy;
    }

    function createUVColorEntity( entity ) {
        return createColorEntity( entity, "uvs" );
    }

    function createNormalColorEntity( entity ) {
        return createColorEntity( entity, "normals" );
    }

    function createTangentColorEntity( entity ) {
        return createColorEntity( entity, "tangents" );
    }

    function createBiTangentColorEntity( entity ) {
        return createColorEntity( entity, "bitangents" );
    }

    function createLinesEntity( entity, type ) {
        var copy = entity.copy();
        copy.forEach( function( entity ) {
            var meshes = entity.meshes,
                attributes,
                attribute,
                positions,
                position,
                lines,
                indices,
                i,
                j;
            entity.meshes = [];
            for ( i=0; i<meshes.length; i++ ) {
                positions = meshes[i].geometry.positions;
                attributes = meshes[i].geometry[ type ];
                lines = new Array( positions.length * 2 );
                indices = new Array( positions.length * 2 );
                for ( j=0; j<positions.length; j++ ) {
                    position = positions[j];
                    attribute = attributes[j];
                    lines[j*2] = position;
                    lines[j*2+1] = [
                        ( position.x || position[0] || 0 ) + ( attribute.x || attribute[0] || 0 ),
                        ( position.y || position[1] || 0 ) + ( attribute.y || attribute[1] || 0 ),
                        ( position.z || position[2] || 0 ) + ( attribute.z || attribute[2] || 0 )
                    ];
                    indices[j*2] = j*2;
                    indices[j*2+1] = j*2+1;
                }
                entity.meshes.push( new Mesh({
                    positions: lines,
                    indices: indices,
                    options: {
                        mode: "LINES"
                    }
                }));
                entity.$$DEBUG_USE_COLOR = false;
            }
        });
        return copy;
    }

    function createUVVectorEntity( entity ) {
        return createLinesEntity( entity, "uvs" );
    }

    function createNormalVectorEntity( entity ) {
        return createLinesEntity( entity, "normals" );
    }

    function createTangentVectorEntity( entity ) {
        return createLinesEntity( entity, "tangents" );
    }

    function createBiTangentVectorEntity( entity ) {
        return createLinesEntity( entity, "bitangents" );
    }

    var _useColor = false,
        _color = [1,1,0];

    var debugPass = new RenderPass({
        before: function() {
            if ( !DEBUG_SHADER ) {
                // create shader if it does not exist yet
                DEBUG_SHADER = new Shader({
                    vert: VERT_SRC,
                    frag: FRAG_SRC
                });
            }
            DEBUG_SHADER.bind();
            DEBUG_SHADER.setUniform( PROJ_MATRIX, _camera.projectionMatrix() );
            DEBUG_SHADER.setUniform( VIEW_MATRIX, _camera.globalViewMatrix() );
        },
        forEachEntity: function( entity ) {
            _useColor = entity.$$DEBUG_USE_COLOR;
            DEBUG_SHADER.setUniform( MODEL_MATRIX, entity.globalMatrix() );
        },
        forEachMesh: function( mesh ) {
            DEBUG_SHADER.setUniform( USE_ATTRIB_COLOR, _useColor );
            DEBUG_SHADER.setUniform( COL_UNIFORM, _color );
            mesh.draw();
        }
    });

    var debugTechnique = new RenderTechnique({
        id: "debug",
        passes: [ debugPass ]
    });

    var debugRenderer = new Renderer([ debugTechnique ]);


    module.exports = {

        setCamera: function( camera ) {
            _camera = camera;
        },

        drawWireFrame: function( entity ) {
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createWireFrameEntity ) ]
            });
        },

        drawUVsAsColor: function( entity ) {
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createUVColorEntity ) ]
            });
        },

        drawUVsAsVectors: function( entity, color ) {
            _color = color;
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createUVVectorEntity ) ]
            });
        },

        drawNormalsAsColor: function( entity ) {
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createNormalColorEntity ) ]
            });
        },

        drawNormalsAsVectors: function( entity, color ) {
            _color = color;
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createNormalVectorEntity ) ]
            });
        },

        drawTangentsAsColor: function( entity ) {
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createTangentColorEntity ) ]
            });
        },

        drawTangentsAsVectors: function( entity, color  ) {
            _color = color;
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createTangentVectorEntity ) ]
            });
        },

        drawBiTangentsAsColor: function( entity ) {
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createBiTangentColorEntity ) ]
            });
        },

        drawBiTangentsAsVectors: function( entity, color  ) {
            _color = color;
            debugRenderer.render({
                debug: [ createDebugEntity( entity, createBiTangentVectorEntity ) ]
            });
        }
    };

}());
