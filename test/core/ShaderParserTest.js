'use strict';

const assert = require('assert');
const ShaderParser = require('../../src/core/ShaderParser');

describe('ShaderParser', function() {

	describe('#parseDeclarations()', function() {
		it('should return declarations in the order they are found in the source arguments', function() {
			const source =
				`
				attribute highp vec3 A;
				attribute highp vec3 B;
				attribute highp vec3 C;
				void main() {}
				`;
			const declarations = ShaderParser.parseDeclarations(source, 'attribute');
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
		});
		it('should return the each unique declaration only once', function() {
			const sourceA =
				`
				attribute highp vec3 A;
				attribute highp vec3 A;
				uniform highp mat4 B;
				void main() {}
				`;
			const sourceB =
				`
				attribute highp vec3 A;
				uniform highp mat4 B;
				uniform highp mat4 C;
				void main() {}
				`;
			const declarations = ShaderParser.parseDeclarations([sourceA, sourceB], ['uniform', 'attribute']);
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
		});
		it('should return an empty array if no qualifiers are passed', function() {
			const source =
				`
				attribute highp vec3 A;
				uniform highp mat4 B;
				uniform highp mat4 C;
				void main() {}
				`;
			let declarations = ShaderParser.parseDeclarations(source);
			assert(declarations.length === 0);
			declarations = ShaderParser.parseDeclarations(source, []);
			assert(declarations.length === 0);
		});
		it('should return an empty array if no source strings are passed', function() {
			let declarations = ShaderParser.parseDeclarations([]);
			assert(declarations.length === 0);
			declarations = ShaderParser.parseDeclarations();
			assert(declarations.length === 0);
		});
		it('should ignore comments', function() {
			const source =
				`
				// single line comment // uniform Bad1
				/* single line block comment uniform Bad2 */
				/* multi-line block
				   comment uniform Bad3 */
				   /*   random white ... attribute Bad3 ... space comment
				  across // uniform Bad4 / * multiple
				 lines*/attribute highp vec3 A;
				// /* */ nested attribute Bad5
				/*	*/  // after block attribute Bad6 / *
				uniform highp mat4 B;
				uniform highp mat4 C;
				void main() {}
				`;
			const declarations = ShaderParser.parseDeclarations(source, ['uniform', 'attribute']);
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
		});
		it('should accept declarations broken across multiple lines', function() {
			const source =
				`
				attribute
				highp vec3
				A;
				uniform highp
				mat4 B
				;
				uniform highp mat4
				 C
				;
				void main() {}
				`;
			const declarations = ShaderParser.parseDeclarations(source, ['uniform', 'attribute']);
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
		});
		it('should accept declarations using comma shorthand', function() {
			const source =
				`
				attribute highp vec3 A, B;
				uniform highp mat4 C,
				 D;
				uniform highp mat4 E
				   ,
				 F;
				void main() {}
				`;
			const declarations = ShaderParser.parseDeclarations(source, ['uniform', 'attribute']);
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
			assert(declarations[3].name === 'D');
			assert(declarations[4].name === 'E');
			assert(declarations[5].name === 'F');
		});
		it('should parse source arguments in the order they are passed', function() {
			const sourceAB =
				`
				attribute highp vec3 A;
				uniform highp mat4 B;
				void main() {}
				`;
			const sourceCD =
				`
				attribute highp vec3 C;
				uniform highp mat4 D;
				void main() {}
				`;
			let declarations = ShaderParser.parseDeclarations([sourceAB, sourceCD], ['uniform', 'attribute']);
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
			assert(declarations[3].name === 'D');
			declarations = ShaderParser.parseDeclarations([sourceCD, sourceAB], ['uniform', 'attribute']);
			assert(declarations[0].name === 'C');
			assert(declarations[1].name === 'D');
			assert(declarations[2].name === 'A');
			assert(declarations[3].name === 'B');
		});
		it('should not take into account what order the qualifer arguments are passed', function() {
			const source =
				`
				'attribute highp vec3 A;',
				'uniform highp mat4 B;',
				'uniform sampler2D C;',
				'void main() { ... }'].join('\n');
				`;
			let declarations = ShaderParser.parseDeclarations(source, ['uniform', 'attribute']);
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
			declarations = ShaderParser.parseDeclarations(source, ['attribute', 'uniform']);
			assert(declarations[0].name === 'A');
			assert(declarations[1].name === 'B');
			assert(declarations[2].name === 'C');
		});
		it('should parse the count from array and non-array declarations', function() {
			const source =
				`
				uniform highp mat4 A[10], B, C [2];
				uniform highp mat4 D;
				float func() {
				return 5.0;
				}
				uniform highp mat4 E ,
				F
				[11] ;
				void main() {}
				`;
			const declarations = ShaderParser.parseDeclarations(source, ['uniform', 'attribute']);
			assert(declarations[0].count === 10);
			assert(declarations[1].count === 1);
			assert(declarations[2].count === 2);
			assert(declarations[3].count === 1);
			assert(declarations[4].count === 1);
			assert(declarations[5].count === 11);
		});
		it('should handle preprocessor statements', function() {
			const source =
				`
				precision highp float;
				#define TEST_0
				#DEFINE TEST_1 1

				#ifdef TEST_0
					uniform float uUniform;
				#else
					uniform vec4 uUniform;
				#ENDIF

				#if TEST_1 == 0
					uniform mat4 uOptionalUniform;
				#endif
				`;
			const declarations = ShaderParser.parseDeclarations(source, ['uniform', 'attribute']);
			assert(declarations.length === 1);
			assert(declarations[0].name === 'uUniform');
			assert(declarations[0].type === 'float');
		});
	});

	describe('#isGLSL()', function() {
		it('should return true if the argument string contains a `void main(...) {}`', function() {
			const source0 =
				`
				uniform highp mat4 A[10], B, C[2];
				uniform highp mat4 D;
				varying highp vec4 v;
				void main() {
					// comment
					highp mat4 m = A * D;
					v = vec4(1.0, 1.0, 1.0, 1.0);
				}
				`;
			const source1 =
				`
				attribute highp vec3 aVertexPosition;
				attribute highp vec3 aVertexNormal;
				uniform highp mat4 uModelMatrix;
				uniform highp mat4 uViewMatrix;
				uniform highp mat4 uProjectionMatrix;
				varying highp vec3 vMVPosition;
				varying highp vec3 vMVNormal;
				void main(void) {
					highp vec4 mvPos = uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
					gl_Position = uProjectionMatrix * mvPos;
					vMVPosition = vec3(mvPos) / mvPos.w;
					vMVNormal = mat3(uViewMatrix * uModelMatrix) * aVertexNormal;
				}
				`;
			const source2 =
				`
				uniform highp mat4 uViewMatrix;
				uniform highp vec3 uLightPosition;
				varying highp vec3 vMVPosition;
				varying highp vec3 vMVNormal;
				void main(void) {
					highp vec4 texelColor = vec4(0.8, 0.6, 0.3, 1.0);
					highp vec3 normal = normalize(vMVNormal);
					highp vec3 vLight = vec3(uViewMatrix * vec4(uLightPosition, 1.0));
					highp vec3 lightDir = normalize(vLight - vMVPosition);
					highp vec3 reflectDir = reflect(-lightDir, normal);
					highp vec3 viewDir = normalize(-vMVPosition);
					highp float diffuse = max(dot(lightDir, normal), 0.0);
					gl_FragColor = vec4(texelColor.rgb * 0.1 + diffuse * texelColor.rgb, texelColor.a);
				}
				`;
			assert(ShaderParser.isGLSL(source0));
			assert(ShaderParser.isGLSL(source1));
			assert(ShaderParser.isGLSL(source2));
		});
		it('should return false if the argument string does not contain a `void main(...) {}`', function() {
			const url0 = 'shaders/vert.glsl';
			const url1 = 'shaders/main.vert';
			const url3 = 'shaders/void/main.frag';
			const url4 = 'shaders/voidmain(void).frag';
			const url5 = 'shaders/voidmain(){}.frag';
			const url6 = 'shaders/voidmain(void){}.frag';
			const url7 = 'shaders/voidmain(){}.frag';
			const url8 = 'shaders/voidmain(){}.frag';
			assert(!ShaderParser.isGLSL(url0));
			assert(!ShaderParser.isGLSL(url1));
			assert(!ShaderParser.isGLSL(url3));
			assert(!ShaderParser.isGLSL(url4));
			assert(!ShaderParser.isGLSL(url5));
			assert(!ShaderParser.isGLSL(url6));
			assert(!ShaderParser.isGLSL(url7));
			assert(!ShaderParser.isGLSL(url8));
		});
	});
});
