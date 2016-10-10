# esper.js

[![npm version](https://badge.fury.io/js/esper.svg)](http://badge.fury.io/js/esper)
[![Bower version](https://badge.fury.io/bo/esper.svg)](http://badge.fury.io/bo/esper)
[![Build Status](https://travis-ci.org/kbirk/esper.svg?branch=master)](https://travis-ci.org/kbirk/esper)
[![Coverage Status](https://coveralls.io/repos/kbirk/esper/badge.svg)](https://coveralls.io/r/kbirk/esper)
[![Dependency Status](https://david-dm.org/kbirk/esper.svg)](https://david-dm.org/kbirk/esper)

A low-level ES6 WebGL rendering framework.

## Table of Contents

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [Documentation](#documentation)
- [Example](#example)
- [Usage](#usage)
	- [WebGLContexts](#webglcontexts)
	- [Shaders](#shaders)
	- [Viewports](#viewports)
	- [VertexBuffers](#vertexbuffers)
	- [VertexPackages](#vertexpackages)
	- [IndexBuffers](#indexbuffers)
	- [Renderables](#renderables)
	- [Textures](#textures)
	- [ColorTextures](#colortextures)
	- [DepthTextures](#depthtextures)
	- [TextureCubeMaps](#texturecubemaps)
	- [RenderTargets](#rendertargets)

<!-- /TOC -->


## Installation

Requires [node](http://nodejs.org/) or [bower](http://bower.io/).

```bash
npm install esper
```
or
```bash
bower install esper
```

## Documentation

* [API Documentation](https://kbirk.github.io/esper/)

## Example

* [Full JSFiddle Example](https://jsfiddle.net/ppvv2x03/)

```javascript

let shader;
let viewport;
let renderable;
let texture;

function render() {
	// setup
	viewport.push();
	shader.use();
	shader.setUniform('uLightPosition', light);
	shader.setUniform('uModelMatrix', model);
	shader.setUniform('uViewMatrix', view);
	shader.setUniform('uProjectionMatrix', projection);
	shader.setUniform('uTextureSampler', 0);
	texture.bind(0);
	// draw
	renderable.draw();
	// teardown
	texture.unbind();
	viewport.pop();
	// queue next frame
	requestAnimationFrame(render);
}

// create webgl context
try {
	gl = esper.WebGLContext.get("glcanvas");
} catch(err) {
	console.err(err.message);
}

// only continue if WebGL is available
if (gl) {
	// viewport
	viewport = new esper.Viewport({
		width: window.innerWidth,
		height: window.innerHeight
	});
	// shader
	shader = new esper.Shader({
		vert: phong.vert,
		frag: phong.frag
	});
	// texture
	texture = new esper.ColorTexture2D({
		src: [
			255, 0, 0, 255,
			0, 255, 0, 255,
			0, 0, 255, 255,
			255, 255, 0, 255
		],
		width: 2,
		height: 2,
		wrap: 'CLAMP_TO_EDGE',
		filter: 'NEAREST'
	})
	// renderable
	renderable = new esper.Renderable({
		vertices: {
			0: cube.positions,
			1: cube.normals,
			2: cube.uvs
		},
		indices: cube.indices
	});
	// enable depth testing
	gl.enable(gl.DEPTH_TEST);
	// start render loop
	render();
}
```

## Usage

### WebGLContexts

In order to access the WebGL API you first need a canvas element from which a WebGL rendering context can be created. The `esper.WebGLContext` namespace streamlines the typical process of instantiating a context and provides facilities for handling multiple contexts within a single application. The object returned is a native WebGLRenderingContext object.

```javascript
// Get WebGL context and load all available extensions.
let gl;
try {
	gl = esper.WebGLContext.get('canvas-id');
} catch(err) {
	console.error(err.message);
}
```

Options can be provided via the second parameter.

```javascript
let gl;
try {
	gl = esper.WebGLContext.get(canvasDOMElement, {
		antialias: false
		depth: false
	});
} catch(err) {
	console.error(err.message);
}
```

Once a context has been created, it is bound internally and can be accessed throughout the application by calling `esper.WebGLContext.get`. It is important to note that all `esper` classes will use the context bound during their instantiation. This is only important if you are intending to use multiple WebGL contexts. In most cases this is discouraged as WebGL constructs cannot be shared between contexts and result in redundant buffers and textures.

```javascript
let gl = esper.WebGLContext.get();
```

The `esper.WebGLContext.bind` method can be used to manually bind a context. Once again, if only one context is ever used, this is unnecessary as the context is bound upon creation.

```javascript
esper.WebGLContext.bind('canvas-id');
esper.WebGLContext.bind(canvasDOMElement);
```

During the creation of the context, esper will automatically attempt to load all known WebGL extensions. To check whether or not a specific extension has been successfully loaded use `esper.WebGLContext.checkExtension`.

```javascript
// Check if the bound WebGL context supports depth textures.
if (esper.WebGLContext.checkExtension('WEBGL_depth_texture')) {
	console.log('Depth textures are supported');
}
```

All supported or unsupported extensions can also be queried.

```javascript
esper.WebGLContext.supportedExtensions().forEach( extension => {
	console.log(extensions + ' is supported.');
});

esper.WebGLContext.unsupportedExtensions().forEach( extension => {
	console.log(extensions + ' is not supported.');
});
```

Contexts can be removed via the `esper.WebGLContext.remove` method.

```javascript
esper.WebGLContext.remove('canvas-id');
```

### Shaders

Shaders are programs that execute on the GPU and are essential to 3D programming. WebGL currently supports two types of shaders: vertex and fragment. Vertex shaders execute on each vertex of the primitive being rendered while fragment shaders execute for each rasterized fragment. The `esper.Shader` constructor accepts both URLs to source files and source code as strings.

```javascript
// Create shader object and using source URLs (also supports source code strings).
let shader = new esper.Shader({
	vert: 'shaders/phong.vert',
	frag: 'shaders/phong.frag'
}, (err, shader) => {
	if (err) {
		console.error(err);
		return;
	}
	// Shader completion callback.
	console.log('Shader sources loaded and program instantiated');
});
```

Multiple source arguments can be provided as arrays and are concatenated together in the respective order. Common code can also be shared between shader types and is appended at the top of the source.

```javascript
// Create shader object and using source URLs (also supports source code strings).
let shader = new esper.Shader({
	common: 'uniform highp float uTime;',
	vert:
		`
		shaders/noise.vert
		attribute highp vec3 aVertexPosition;
		void main() {
			gl_Position = vec4(aVertexPosition * noise(uTime), 1.0);
			vPosition = aVertexPosition.xyz;
		}
		`,
	frag:
		`
		void main() {
			gl_FragColor = vec4(1*uTime, 1*uTime, 1*uTime, 1.0);
		}
		`
}, (err, shader) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('Shader sources loaded and program instantiated');
});
```

During shader initialization the shader source code is parsed and analyzed. All vertex attribute locations are bound in the order in which they are declared and all uniform types and locations are retrieved and stored based upon name. This is used to greatly simplify the process of uploading uniforms to the GPU.

When uploading uniforms to the GPU, arguments are automatically casted (within reason) into the appropriate format.

```javascript
// Upload uniforms to the GPU
shader.setUniform('uProjectionMatrix', projectionMatrixArray);
shader.setUniform('uAlpha', 0.25);
shader.setUniform('uHasTexture', false); // booleans are converted to float
```

### Viewports

An `esper.Viewport` defines a rendering resolution within the canvas element. By default, the viewport will be set to the current dimensions of the canvas element.

```javascript
// Create the viewport.
let viewport = new esper.Viewport({
	width: window.innerWidth,
	height: window.innerHeight
});

// Have the viewport always fit to the window.
window.addEventListener('resize', () => {
	viewport.resize(window.innerWidth, window.innerHeight);
}

// Push the viewport onto the stack at its current size.
viewport.push();

// Push viewport overrides onto the stack, this will give a 10px border.
viewport.push(10, 10, canvas.height - 20, canvas.width - 20);

// Pop the override off the stack.
viewport.pop();
```

Using the `resize` method will resize the underlying canvas element along with the implicit dimensions of the viewport.

```javascript
// Resize the viewport. This resizes the underlying canvas.
viewport.resize(460, 460);
```

Modifying the viewport is the recommended way to mimic multiple rendering contexts as it requires no duplication of WebGL constructs.

```javascript
let viewport = new esper.Viewport({
	width: 1000,
	height: 500
});
viewport.push(0, 0, 500, 500);

// ... render to left half of canvas

viewport.pop();
viewport.push(500, 0, 500, 500);

// .. render to right half of canvas

viewport.pop();
```

### VertexBuffers

An `esper.VertexBuffer` is used to store vertex attribute information. Common attributes include positions, normals, texture coordinates, skeletal animation joint ids and skinning weights. Attributes can be stored in separate isolated buffers or together in a single buffer either accessed at byte offsets or interleaved with each other to take advantage of cache locality (recommended).

```javascript
// Create separate vertex buffers for each attributes.
let positionBuffer = new esper.VertexBuffer(positions, {
	0: {
		size: 3,
		type: 'FLOAT'
	}
});
let normalBuffer = new esper.VertexBuffer(normals, {
	1: {
		size: 3,
		type: 'FLOAT'
	}
});
let uvBuffer = new esper.VertexBuffer(uvs, {
	2: {
		size: 2,
		type: 'FLOAT'
	}
});

// Create interleaved buffer from an existing Array or Float32Array.
let vertexBuffer = new esper.VertexBuffer(array, {
	0: {
		size: 3,
		type: 'FLOAT',
		byteOffset: 0
	},
	1: {
		size: 3,
		type: 'FLOAT',
		byteOffset: 12
	},
	2: {
		size: 2,
		type: 'FLOAT',
		byteOffset: 26
	}
);
```

Drawing with `esper.VertexBuffers` is easy, simply bind it, and draw.

```javascript
// Bind vertex buffer.
vertexBuffer.bind();

// Draw triangles.
vertexBuffer.draw({
	mode: TRIANGLES
});

// Draw points from an index offset.
vertexBuffer.draw({
	mode: POINTS,
	indexOffset: 100
});

// Draw n lines.
vertexBuffer.draw({
	mode: LINES,
	count: n * 2
});

// Unbind
vertexBuffer.unbind();
```

### VertexPackages

Interleaving vertex attributes and manually defining the attribute pointers is tedious and prone to frustrating user error. The `esper.VertexPackage` class simplifies this and coalesces multiple arrays into a single interleaved Float32Array while calculating the correct attribute pointers.

```javascript
// Create interleaved vertex buffers using vertex packages.
let vertexPackage = new esper.VertexPackage({
	0: positions,
	1: normals,
	2: uvs
});
```

An instantiated `esper.VertexPackage` can then be passed to a `esper.VertexBuffer` constructor for simple instantiation.

```javascript
let vertexBuffer = new esper.VertexBuffer(vertexPackage);
```

### IndexBuffers

Due to the nature of tessellation, single vertices may referenced by multiple geometric primitives. Solely using vertex buffers can result in a large amount of redundancy as these vertices may be repeated within the buffer. For example a simple cube is composed of 12 triangles, requiring 36 vertices if only using a vertex buffer. With flat shading this cube be represented with only 8 vertices when using an index buffer. The `esper.IndexBuffer` class allows the user to specify the ordering of vertex attributes inside a vertex buffer, which allows re-use of vertices and smaller, more efficient buffers.

```javascript
// Create index buffer from an array of indices.
let indexBuffer = new esper.IndexBuffer(indices);
```

Rendering using an `esper.IndexBuffer` is easy as well, simply bind any referenced vertex buffers, then bind the index buffer and draw.

```javascript
// Bind vertex buffer.
vertexBuffer.bind();

// Draw triangles.
indexBuffer.draw({
	mode: TRIANGLES
});

// Draw n lines.
indexBuffer.draw({
	mode: LINES,
	count: n * 2
});

// Draw points from an offset.
indexBuffer.draw({
	mode: POINTS,
	byteOffset: 100 * (4 * 3),
	count: n - (100)
});

vertexBuffer.unbind();
```

### Renderables

While working at the level of `esper.VertexBuffer` and `esper.IndexBuffer` can give you low level control, it is often tedious and unnecessary. The `esper.Renderable` class encapsulates this behavior with a simplified interface while still retaining the same low level control.

```javascript
// Create a renderable from vertex and index arrays.
let renderable = new esper.Renderable({
	vertices: {
		0: positions,
		1: normals,
		2: uvs
	},
	indices: indices
});

// Create a renderable without an index buffer
let renderable = new esper.Renderable({
	vertices: {
		0: positions,
		1: normals,
		2: uvs
	}
});

// Draw the renderable.
renderable.draw({
	mode: 'LINES', // render lines instead of triangles
	byteOffset: 100 * (4 * 3) * 2, // exclude the first 100 lines
	count: 500 * 2 // only render 500 lines
});
```

### Textures

Textures can be used to store and sample many different types of information. Typically a texture stores color values but can also be used to store depth values or any other types of encoded information. An `esper.Texture2D` is a low level construct for interfacing directly with the WebGL texture API.

```javascript
// Create texture from image URL.
let texture = new esper.Texture2D({
	src: new Uint8Array([
		255, 0, 0, 255,
		0, 255, 0, 255,
		0, 0, 255, 255,
		0, 255, 0, 255,
	]),
	width: 2,
	height: 2,
	format: 'RGBA',
	type: 'UNSIGNED_BYTE',
	wrapS: 'REPEAT',
	wrapT: 'REPEAT',
	minFlter: 'LINEAR',
	magFilter: 'LINEAR',
	invertY: false,
	premultiplyAlpha: false,
	mipMap: false
});
```

Using textures is easy, simply bind the texture, providing the texture unit number, then set the texture sampler unit in the shader.

```javascript
// Bind to texture unit 0
texture.bind(0);

// Bind texture sampler to the same unit.
shader.setUniform('uTextureSampler', 0);

// .. draw using texture

// Unbind from texture unit 0.
texture.unbind();
```

### ColorTextures

Color textures are the most common type of texture and are used to store RGB or RGBA values. An `esper.ColorTexture2D` can be created from existing HTMLImageElements, URLs containing HTMLImageElement supported image formats, ArrayBufferViews, or null data.

```javascript
// Create texture from image URL.
let texture = new esper.ColorTexture2D({
	src: 'images/checkerboard.png'
}, (err, texture) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('Texture2D image successfully created.');
});

// Create empty color texture buffer to be written to.
let colorTexture = new esper.Texture2D({
	height: 256,
	width: 256
});
```

WebGL 1.0 requires that any texture with mipmapping enabled or repeating wrap modes (`REPEAT` or `MIRRORED_REPEAT`), _must_ have dimensions that are powers of two. `esper.ColorTexture2D` will automatically resize any non power of two textures to the next highest power of two. Ex. 129 becomes 256, 15 becomes 16, etc.

### DepthTextures

Depth textures can be used to store depth values and are commonly used in conjunction with RenderTargets. The `esper.DepthTexture2D` class is only available if the `WEBGL_depth_texture` extension is supported.

```javascript
// Create a depth texture. (Only works if depth texture extension is supported).
let depthTexture = new esper.DepthTexture2D({
	width: 1024,
	height: 1024
});
```

### TextureCubeMaps

Cubemap textures are a specific type of texture typically used for skyboxes and reflections. An `esper.TextureCubeMap` can be created from existing HTMLImageElements, URLs containing HTMLImageElement supported image formats, ArrayBufferViews, or null data. The faces of the cube are specified during instantiation.

```javascript
// Create cube map from image URLs.
let cubeMapTexture = new esper.TextureCubeMap({
	faces: {
		'+x': 'images/sky/posx.png',
		'-x': 'images/sky/negx.png',
		'+y': 'images/sky/posy.png',
		'-y': 'images/sky/negy.png',
		'+z': 'images/sky/posz.png',
		'-z': 'images/sky/negz.png'
	}
}, (err, texture) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('TextureCubeMap successfully created.');
});

// Create empty cube map to be written to.
let cubeMapTexture = new TextureCubeMap({
	width: 512,
	height: 512
});
```

Using cubemap textures is easy, simply bind the texture, providing the texture unit number, then set the texture sampler unit in the shader.

```javascript
// Bind to texture unit 0.
cubeMapTexture.bind(0);
// Bind texture sampler to the same unit.
shader.setUniform('uTextureSampler', 0);

// .. draw using cubemap texture

// Unbind from texture unit 0.
cubeMapTexture.unbind();
```

### RenderTargets

When compositing more complex scenes, intermediate render states may need to be written to an additional buffer. The `esper.RenderTarget` class provides an interface to allow you to draw to textures.

```javascript
// Create a shadow map texture.
let shadowTexture = new esper.ColorTexture2D({
	width: 512,
	height: 512
});

// Create a depth texture for the render target.
let depthTexture = new esper.DepthTexture2D({
	width: 512,
	height: 512
});

// Create a render target and attach the textures.
let renderTarget = new esper.RenderTarget();
renderTarget.setColorTarget(shadowTexture, 0); // Bind to color attachment 0
renderTarget.setDepthTarget(depthTexture);
```

Drawing to the texture unit is simple:

```javascript
// Bind the render target.
renderTarget.bind();

// Clear the bound color and depth textures.
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// .. render to the render target

// Unbind the the render target.
renderTarget.unbind();

// Now use the bound textures as you would normally.

// Bind shadow map to texture unit 0.
shadowTexture.bind(0);

// Bind texture sampler to the same unit.
shader.setUniform('uShadowTextureSampler', 0);

// ... render using the texture

// Unbind from texture unit 0.
shadowTexture.unbind();
```
