"use strict";

var assert = require("assert"),
    ShaderParser = require( '../../src/core/ShaderParser' );

describe('ShaderParser', function() {
    describe('#parseDeclarations()', function() {
        it('should return declarations in the order they are found in the source arguments', function() {
            var source = [
                    'attribute highp vec3 A;',
                    'attribute highp vec3 B;',
                    'attribute highp vec3 C;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source, "attribute" );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
        });
        it('should return the each unique declaration only once', function() {
            var sourceA = [
                    'attribute highp vec3 A;',
                    'attribute highp vec3 A;',
                    'uniform highp mat4 B;',
                    'void main() { ... }'].join('\n');
            var sourceB = [
                    'attribute highp vec3 A;',
                    'uniform highp mat4 B;',
                    'uniform highp mat4 C;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( [ sourceA, sourceB ], [ "uniform", "attribute" ] );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
        });
        it('should return an empty array if no qualifiers are passed', function() {
            var source = [
                    'attribute highp vec3 A;',
                    'uniform highp mat4 B;',
                    'uniform highp mat4 C;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source );
            assert( declarations.length === 0 );
            declarations = ShaderParser.parseDeclarations( source, [] );
            assert( declarations.length === 0 );
        });
        it('should return an empty array if no source strings are passed', function() {
            var declarations = ShaderParser.parseDeclarations( [] );
            assert( declarations.length === 0 );
            declarations = ShaderParser.parseDeclarations();
            assert( declarations.length === 0 );
        });
        it('should ignore comments', function() {
            var source = [
                    '// single line comment // uniform Bad1',
                    '/* single line block comment uniform Bad2 */',
                    '/* multi-line block',
                    '   comment uniform Bad3 */',
                    '   /*   random white ... attribute Bad3 ... space comment',
                    '  across // uniform Bad4 / * multiple',
                    ' lines*/attribute highp vec3 A;',
                    '// /* */ nested attribute Bad5',
                    '/*    */  // after block attribute Bad6 / *',
                    'uniform highp mat4 B;',
                    'uniform highp mat4 C;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source, [ "uniform", "attribute" ] );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
        });
        it('should accept declarations broken across multiple lines', function() {
            var source = [
                    'attribute ',
                    'highp vec3 ',
                    'A;',
                    'uniform highp ',
                    'mat4 B',
                    ';',
                    'uniform highp mat4',
                    ' C',
                    ';',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source, [ "uniform", "attribute" ] );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
        });
        it('should accept declarations using comma shorthand', function() {
            var source = [
                    'attribute highp vec3 A, B;',
                    'uniform highp mat4 C,',
                    ' D;',
                    'uniform highp mat4 E',
                    '   ,  ',
                    ' F;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source, [ "uniform", "attribute" ] );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
            assert( declarations[3].name === 'D' );
            assert( declarations[4].name === 'E' );
            assert( declarations[5].name === 'F' );
        });
        it('should parse source arguments in the order they are passed', function() {
            var sourceAB = [
                    'attribute highp vec3 A;',
                    'uniform highp mat4 B;',
                    'void main() { ... }'].join('\n'),
                sourceCD = [
                    'attribute highp vec3 C;',
                    'uniform highp mat4 D;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( [ sourceAB, sourceCD ], [ "uniform", "attribute" ] );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
            assert( declarations[3].name === 'D' );
            declarations = ShaderParser.parseDeclarations( [ sourceCD, sourceAB ], [ "uniform", "attribute" ] );
            assert( declarations[0].name === 'C' );
            assert( declarations[1].name === 'D' );
            assert( declarations[2].name === 'A' );
            assert( declarations[3].name === 'B' );
        });
        it('should not take into account what order the qualifer arguments are passed', function() {
            var source = [
                    'attribute highp vec3 A;',
                    'uniform highp mat4 B;',
                    'uniform sampler2D C;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source, [ "uniform", "attribute" ] );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
            declarations = ShaderParser.parseDeclarations( source, [ "attribute", "uniform" ] );
            assert( declarations[0].name === 'A' );
            assert( declarations[1].name === 'B' );
            assert( declarations[2].name === 'C' );
        });
        it('should parse the count from array and non-array declarations', function() {
            var source = [
                    'uniform highp mat4 A[ 10], B, C [2];',
                    'uniform highp mat4 D;',
                    'uniform highp mat4 E ,',
                    'F ',
                    '[11 ] ;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source, [ "uniform", "attribute" ] );
            assert( declarations[0].count === 10 );
            assert( declarations[1].count === 1 );
            assert( declarations[2].count === 2 );
            assert( declarations[3].count === 1 );
            assert( declarations[4].count === 1 );
            assert( declarations[5].count === 11 );
        });
        it('should parse precision statements', function() {
            var source = [
                    'precision highp float;',
                    ' uniform float A;',
                    ' precision',
                    'mediump    ',
                    ' int;',
                    ' uniform uint B;',
                    ' mediump;',
                    'void main() { ... }'].join('\n');
            var declarations = ShaderParser.parseDeclarations( source, [ "uniform", "attribute" ] );
            assert( declarations[0].precision === 'highp' );
            assert( declarations[1].precision === 'mediump' );
        });
    });
    describe('#isGLSL()', function() {
        it('should return true if the argument string contains a "void main() {}"', function() {
            var source = [
                    'uniform highp mat4 A[10], B, C[2];',
                    'uniform highp mat4 D;',
                    'void main() { ... }'].join('\n'),
                url0 = 'shaders/vert.glsl',
                url1 = 'shaders/main.vert',
                url3 = 'shaders/void/main.frag';
            assert( ShaderParser.isGLSL( source ) );
            assert( !ShaderParser.isGLSL( url0 ) );
            assert( !ShaderParser.isGLSL( url1 ) );
            assert( !ShaderParser.isGLSL( url3 ) );
        });
        it('should return true if the argument string contains a "void main() {}"', function() {
            var source0 = [
                    'uniform highp mat4 A[10], B, C[2];',
                    'uniform highp mat4 D;',
                    'varying highp vec4 v;',
                    'void main() {',
                        '// comment',
                        'highp mat4 m = A * D;',
                        'v = vec4(1.0, 1.0, 1.0, 1.0);',
                    '}'].join('\n'),
                source1 = [
                    'attribute highp vec3 aVertexPosition;',
                    'attribute highp vec3 aVertexNormal;',
                    'uniform highp mat4 uModelMatrix;',
            		'uniform highp mat4 uViewMatrix;',
                    'uniform highp mat4 uProjectionMatrix;',
                    'varying highp vec3 vMVPosition;',
                    'varying highp vec3 vMVNormal;',
                    'void main() {',
                        'highp vec4 mvPos = uViewMatrix * uModelMatrix * vec4( aVertexPosition, 1.0 );',
                        'gl_Position = uProjectionMatrix * mvPos;',
                        'vMVPosition = vec3( mvPos ) / mvPos.w;',
                        'vMVNormal = mat3( uViewMatrix * uModelMatrix ) * aVertexNormal;',
                    '}'].join(''),
                source2 = [
            		'uniform highp mat4 uViewMatrix;',
                    'uniform highp vec3 uLightPosition;',
                    'varying highp vec3 vMVPosition;',
                    'varying highp vec3 vMVNormal;',
                    'void main() {',
                        'highp vec4 texelColor = vec4(0.8, 0.6, 0.3, 1.0);',
                        'highp vec3 normal = normalize( vMVNormal );',
                        'highp vec3 vLight = vec3( uViewMatrix * vec4( uLightPosition, 1.0 ) );',
                        'highp vec3 lightDir = normalize( vLight - vMVPosition );',
                        'highp vec3 reflectDir = reflect( -lightDir, normal );',
                        'highp vec3 viewDir = normalize( -vMVPosition );',
                        'highp float diffuse = max( dot( lightDir, normal ), 0.0 );',
                        'gl_FragColor = vec4(texelColor.rgb * 0.1 + diffuse * texelColor.rgb, texelColor.a );',
                	'}'].join(''),
                url0 = 'shaders/vert.glsl',
                url1 = 'shaders/main.vert',
                url3 = 'shaders/void/main.frag';
            assert( ShaderParser.isGLSL( source0 ) );
            assert( ShaderParser.isGLSL( source1 ) );
            assert( ShaderParser.isGLSL( source2 ) );
            assert( !ShaderParser.isGLSL( url0 ) );
            assert( !ShaderParser.isGLSL( url1 ) );
            assert( !ShaderParser.isGLSL( url3 ) );
        });
    });
});
