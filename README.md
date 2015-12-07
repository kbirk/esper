# esper.js

[![npm version](https://badge.fury.io/js/esper.svg)](http://badge.fury.io/js/esper) [![Bower version](https://badge.fury.io/bo/esper.svg)](http://badge.fury.io/bo/esper) [![Dependency Status](https://david-dm.org/kbirk/esper.svg)](https://david-dm.org/kbirk/esper)

A low-level WebGL rendering framework.

## Installation

Requires [bower](http://bower.io/) or [node](http://nodejs.org/).

```bash
bower install esper
```
or
```bash
npm install esper
```

## Documentation

### WebGLContext

In order to access the WebGL API you need a canvas element from which a WebGL rendering context can be created. The `esper.WebGLContext` namespace wraps the typical process of instantiating a context and provides facilities for handling multiple contexts within a single application. The object returned is a native WebGLRenderingContext object.

    // Get WebGL context and load all available extensions.
    var gl = esper.WebGLContext.get( 'canvas-id' );
    // Check if context creation was successful.
    if ( !gl ) {
        console.log( 'Failure to create context, the browser may not support it.' );  
    }

    // Get a WebGL context with options and load all available extensions.
    var gl = esper.WebGLContext.get( canvasDOMElement, {
        antialias: false
        depth: false
    });

Once a context has been created, it is bound internally and can be accessed throughout the application by calling `esper.WebGLContext.get`. It is important to note that all esper classes will use the context bound *during their instantiation*. This is only important if you are intending to use multiple WebGL contexts. In most cases this is discouraged as WebGL constructs cannot be shared between contexts and result in redundant buffers and textures.

    var gl = esper.WebGLContext.get();

The `esper.WebGLContext.bind` method can be used to manually bind a context. Once again, if only one context is ever used, this is unnecessary as the context is bound upon creation.

    esper.WebGLContext.bind( 'canvas-id' );
    esper.WebGLContext.bind( canvasDOMElement );

During the creation of the context, esper will automatically attempt to load all known WebGL extensions. To check whether or not a specific extension has been successfully loaded use `esper.WebGLContext.checkExtension`.

    // Check if the bound WebGL context supports depth textures.
    if ( esper.WebGLContext.checkExtension( 'WEBGL_depth_texture' ) ) {
        console.log( 'Depth textures are supported' );
    }

All supported or unsupported extensions can also be queried.

    esper.WebGLContext.supportedExtensions().forEach( function( extension ) {
        console.log( extensions + ' is supported.');
    });

    esper.WebGLContext.unsupportedExtensions().forEach( function( extension ) {
        console.log( extensions + ' is not supported.');
    });

### Shaders

Shaders are programs that execute on the GPU and are essential to 3D programming. WebGL currently supports two types of shaders: vertex and fragment. Vertex shaders execute on each vertex of the primitive being rendered while fragment shaders execute for each rasterized fragment. The `esper.Shader` constructor accepts both URLs to source files and source code as strings.

    // Create shader object and using source URLs (also supports source code strings).
    var shader = new esper.Shader({
        vert: 'shaders/phong.vert',
        frag: 'shaders/phong.frag'
    }, function( shader ) {
        // Shader completion callback.
        console.log( 'Shader sources loaded and program instantiated' );
    });

Multiple source arguments can be provided as arrays and are concatenated together in the respective order. Common code can also be shared between shader types and is appended at the top of the source.

    // Create shader object and using source URLs (also supports source code strings).
    var shader = new esper.Shader({
        common: 'uniform highp float uTime;'
        vert: [
            'shaders/noise.vert',
            'attribute highp vec3 aVertexPosition;' +
            'void main() {' +
            '    gl_Position = vec4( aVertexPosition * noise( uTime ), 1.0 );' +
            '    vPosition = aVertexPosition.xyz;' +
            '}'
        ],
        frag:
            'void main() {' +
            '    gl_FragColor = vec4( 1*uTime, 1*uTime, 1*uTime, 1.0 );' +
            '}'
    }, function( shader ) {
        // Shader completion callback.
        console.log( 'Shader sources loaded and program instantiated' );
    });

During shader initialization the shader source code is parsed and analyzed. All vertex attribute locations are bound in the order in which they are declared and all uniform types and locations are retrieved and stored based upon name. This is used to greatly simplify the process of uploading uniforms to the GPU.

When uploading uniforms to the GPU, arguments are automatically casted (within reason) into the appropriate format.

    // Upload uniforms to the GPU
    shader.setUniform( 'uProjectionMatrix', projectionMatrixArray );
    shader.setUniform( 'uAlpha', 0.25 );
    shader.setUniform( 'uHasTexture', false ); // booleans are converted to float

### Viewports

An `esper.Viewport` defines a rendering resolution and pixel offset within the canvas element. By default, the viewport will be set to the size and resolution of the canvas element with no offset.

    // Create the viewport.
    var viewport = new esper.Viewport();

    // Push the viewport dimensions and offsets onto the stack.
    viewport.push();

    // Push a viewport override onto the stack, this will give a 10px border.
    viewport.push( 10, 10, canvas.height - 20, canvas.width - 20 );

    // Pop the override off the stack.
    viewport.pop();

    // Set the viewport to the window dimensions.
    window.addEventListener( 'resize', function() {
        viewport.resize( window.innerWidth, window.innerHeight );
    }

    // Set the x and y offset.
    viewport.offset( 100, 200 );

Modifying the viewport is the recommended way to mimic multiple rendering contexts as it requires no duplication of WebGL constructs.

    var viewport = new esper.Viewport({
        width: 1000,
        height: 500
    });
    viewport.push( 0, 0, 500, 500 );

    // ... render to left half of canvas

    viewport.pop();
    viewport.push( 500, 0, 500, 500 );

    // .. render to right half of canvas

    viewport.pop();

### VertexBuffers

An `esper.VertexBuffer` is used to store vertex attribute information. Common attributes include positions, normals, texture coordinates, skeletal animation joint ids and skinning weights. Attributes can be stored in separate isolated buffers or together in a single buffer either accessed at offsets or interleaved with each other to take advantage of cache locality (recommended).

    // Create separate vertex buffers for each attributes.
    var positionBuffer = new esper.VertexBuffer( positions, {
        0: {
            size: 3,
            type: 'FLOAT'
        }
    });
    var normalBuffer = new esper.VertexBuffer( normals, {
        1: {
            size: 3,
            type: 'FLOAT'
        }
    });
    var uvBuffer = new esper.VertexBuffer( uvs, {
        2: {
            size: 2,
            type: 'FLOAT'
        }
    });

    // Create interleaved buffer from an existing Array or Float32Array.
    var vertexBuffer = new esper.VertexBuffer( array, {
        0: {
            size: 3,
            type: 'FLOAT',
            stride: 32
            offset: 0
        },
        1: {
            size: 3,
            type: 'FLOAT',
            stride: 32
            offset: 12
        },
        2: {
            size: 2,
            type: 'FLOAT',
            stride: 32
            offset: 26
        }
    );

Drawing with `esper.VertexBuffers` is easy, simply bind it, and draw.

    // Bind vertex buffer.
    vertexBuffer.bind();

    // Draw triangles.
    vertexBuffer.draw({
        mode: TRIANGLES
    });

    // Draw points from an offset.
    vertexBuffer.draw({
        mode: POINTS,
        offset: 100
    });

    // Draw n lines.
    vertexBuffer.draw({
        mode: LINES,
        count: n * 2
    });

### VertexPackages

Interleaving vertex attributes and manually defining the attribute pointers is tedious and prone to frustrating user error. The `esper.VertexPackage` class simplifies this and coalesces multiple arrays into a single interleaved Float32Array while calculating the correct attribute pointers.

    // Create interleaved vertex buffers using vertex packages.
    var vertexPackage = new esper.VertexPackage({
        0: positions,
        1: normals,
        2: uvs
    });

An instantiated `esper.VertexPackage` can then be passed to a `esper.VertexBuffer` constructor for simple instantiation.

    var vertexBuffer = new esper.VertexBuffer( vertexPackage );

### IndexBuffers

Due to the nature of tessellation, single vertices may referenced by multiple geometric primitives. Solely using vertex buffers can result in a large amount of redundancy as these vertices may be repeated within the buffer. For example a simple cube is composed of 12 triangles, requiring 36 vertices if only using a vertex buffer. With flat shading this cube be represented with only 8 vertices when using an index buffer. The `esper.IndexBuffer` class allows the user to specify the ordering of vertex attributes inside a vertex buffer, which allows re-use of vertices and smaller, more efficient buffers.

    // Create index buffer from an array of indices.
    var indexBuffer = new esper.IndexBuffer( indices );

Rendering using an `esper.IndexBuffer` is easy as well, simply bind any referenced vertex buffers, then bind the index buffer and draw.

    // Bind vertex buffer.
    vertexBuffer.bind();

    // Bind index buffer.
    indexBuffer.bind();

    // Draw triangles.
    indexBuffer.draw({
        mode: TRIANGLES
    });

    // Draw points from an offset.
    indexBuffer.draw({
        mode: POINTS,
        offset: 100
    });

    // Draw n lines.
    indexBuffer.draw({
        mode: LINES,
        count: n * 2
    });

### Renderables

While working at the level of `esper.VertexBuffers` and `esper.IndexBuffers` can give you low level control, it is often tedious and unnecessary. The `esper.Renderable` class encapsulates this behavior with a simplified interface while still retaining the same low level control.

    // Create a renderable from vertex and index arrays.
    var renderable = new esper.Renderable({
        vertices: {
            0: positions,
            1: normals,
            2: uvs
        },
        indices: indices
    });

    // Create a renderable without an index buffer
    var renderable = new esper.Renderable({
        vertices: {
            0: positions,
            1: normals,
            2: uvs
        }
    });

    // Draw the renderable.
    renderable.draw({
        mode: 'LINES', // render lines instead of triangles
        offset: 100 * 2, // exclude the first 100 lines
        count: 500 * 2 // only render 500 lines
    });

### Textures

Textures can be used to store and sample many different types of information. Typically a texture stores color values but can also be used to store depth values or any other types of encoded information. An `esper.Texture` can be created from existing HTMLImageElements, URLs containing HTMLImageElement supported image formats, or buffered with no data at all.

    // Create texture from image URL.
    var texture = new esper.Texture2D({
        url: 'images/checkerboard.png',    
        wrap: 'REPEAT',
        filter: 'LINEAR',
        invertY: true
    }, function( texture ) {
        console.log( 'Texture2D image successfully created.' );
    });

    // Create empty color texture buffer to be written to.
    var colorTexture = new esper.Texture2D({
        height: 256,
        width: 256,
        format: 'RGBA',
        type: 'UNSIGNED_BYTE'
    }, function( texture ) {
        console.log( 'Empty Texture2D successfully created.' );
    });

    // Create a depth texture. (Only works if depth texture extension is supported).
    var depthTexture = new esper.Texture2D({
        width: 1024,
        height: 1024,
        format: 'DEPTH_COMPONENT',
        type: 'UNSIGNED_INT'
    });

Using textures is easy, simply push the texture onto the stack, providing the texture unit number, then set the texture sampler unit in the shader.

    // Bind to texture unit 0
    texture.push( 0 );

    // Bind texture sampler to the same unit.
    shader.setUniform( 'uTextureSampler', 0 );

    // .. draw using texture

    // Unbind from texture unit 0.
    texture.pop( 0 );

All images or image dimensions that are not a power of two are resized to the next highest power of two. For example 129 becomes 256, 15 becomes 16, etc. All textures that are created from an image are automatically mip-mapped.

### TextureCubeMaps

Cubemap textures are a specific type of texture typically used for skyboxes and reflections. An `esper.TextureCubeMap` can be created from existing HTMLImageElements, URLs containing HTMLImageElement supported image formats, buffered with no data at all. The faces of the cube are specified during instantiation.

    // Create cube map from image URLs.
    var cubeMapTexture = new esper.TextureCubeMap({
        urls: {
            '+x': 'images/sky/posx.png',
            '-x': 'images/sky/negx.png',
            '+y': 'images/sky/posy.png',
            '-y': 'images/sky/negy.png',
            '+z': 'images/sky/posz.png',
            '-z': 'images/sky/negz.png'
        }
    }, function() {
        console.log( 'TextureCubeMap successfully created.' );
    });

    // Create empty cube map to be written to.
    var cubeMapTexture = new TextureCubeMap({
        width: 512,
        height: 512
    });

Using cubemap textures is easy, simply push the texture onto the stack, providing the texture unit number, then set the texture sampler unit in the shader.

    // Bind to texture unit 0.
    cubeMapTexture.push( 0 );
    // Bind texture sampler to the same unit.
    shader.setUniform( 'uTextureSampler', 0 );

    // .. draw using cubemap texture

    // Unbind from texture unit 0.
    cubeMapTexture.pop( 0 );

### RenderTargets

When compositing more complex scenes, intermediate render states may need to be written to an additional buffer. The `esper.RenderTarget` class provides an interface to allow you to draw to textures.

    // Create a shadow map texture.
    var shadowMapTexture = new esper.Texture2D({
        width: 512,
        height: 512,
        format: 'RGBA',
        type: 'UNSIGNED_BYTE'
    });

    // Create a depth texture for the render target.
    var depthTexture = new esper.Texture2D({
        width: 512,
        height: 512,
        format: 'DEPTH_COMPONENT',
        type: 'UNSIGNED_INT'
    });

    // Create a render target and attach the textures.
    var renderTarget = new esper.RenderTarget();
    renderTarget.setColorTarget( shadowMapTexture, 0 ); // Bind to color attachment 0
    renderTarget.setDepthTarget( depthTexture );

Drawing to the texture unit is simple:

    // Bind the render target.
    renderTarget.push();

    // Clear the bound color and depth textures.
    renderTarget.clear();

    // .. render to the render target

    // Unbind the the render target.
    renderTarget.pop();

    // Now use the bound textures as you would normally.

    // Bind shadow map to texture unit 0.
    shadowMapTexture.push( 0 );

    // Bind texture sampler to the same unit.
    shader.setUniform( 'uShadowTextureSampler', 0 );

    // ... render using the texture

    // Unbind from texture unit 0.
    shadowMapTexture.pop( 0 );
