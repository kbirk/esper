# esper.js

[![Bower version](https://badge.fury.io/bo/esper.svg)](http://badge.fury.io/bo/esper) [![Dependency Status](https://david-dm.org/kbirk/esper.svg)](https://david-dm.org/kbirk/esper)

A low-level WebGL rendering framework.

## Installation

Requires [bower](http://bower.io/).

```bash
bower install esper
```

## Documentation

### WebGLContext

In order to use WebGL you need a canvas element from which the WebGL rendering context can be created. The WebGLContext namespace wraps the typical process of instantiating one and keeps track of the all WebGL contexts created. The return value is a native WebGLRenderingContext object.

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

Once a context has been created, it is bound internally and can be accessed anywhere by simply calling *esper.WebGLContext.get();*. It is important to note that all esper constructs will use the context bound during their instantiation. This is only important if you are intending to use multiple WebGL contexts. In most cases this is discouraged as WebGL classes cannot be shared between contexts and result in redundant buffers and textures.

    var gl = esper.WebGLContext.get();

The bind method can be used to manually bind a context. Once again, if only one context is ever used, this is unnecessary as the context is bound upon creation.

    esper.WebGLContext.bind( 'canvas-id' );
    esper.WebGLContext.bind( canvasDOMElement );

During the creation of the context, esper will attempt to load all known WebGL extensions. To check whether or not an extension has been successfully loaded.

    // Check if the bound WebGL context supports depth textures.
    if ( esper.WebGLContext.checkExtension( 'WEBGL_depth_texture' ) ) {
        console.log( 'Depth textures are supported' );
    }

All supported or unsupported extensions can be queried as well.

    esper.WebGLContext.supportedExtensions().forEach( function( extension ) {
        console.log( extensions + ' is supported.');
    });
    esper.WebGLContext.unsupportedExtensions().forEach( function( extension ) {
        console.log( extensions + ' is not supported.');
    });

### Shaders

Shaders are programs that execute on the GPU. WebGL currently supports two types of shaders: vertex and fragment. Vertex shaders execute on each vertex of the primitive being rendered while fragment shaders execute for each rasterized fragment. Shaders accept both urls to source files and source code as strings.

    // Create shader object and using source urls (also supports source code strings).
    var shader = new esper.Shader({
        vert: 'shaders/phong.vert',
        frag: 'shaders/phong.frag'
    }, function( shader ) {
        // Shader completion callback.
        console.log( 'Shader sources loaded and program instantiated' );
    });

Multiple sources can be provided as arrays and are concatenated together in the provided order. Common code can also be shared between shaders and is appended at the top of the source.

    // Create shader object and using source urls (also supports source code strings).
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

During shader initialization the shader source code is parsed and analyzed. All vertex attribute locations are bound in the order in which they are declared and all uniform types and locations are retrieved and stored based upon name.

When uploading uniforms to the GPU, arguments are automatically casted (within reason) into the appropriate format.

    // Upload uniforms to the GPU
    shader.setUniform( 'uProjectionMatrix', projectionMatrixArray );
    shader.setUniform( 'uAlpha', 0.25 );
    shader.setUniform( 'uHasTexture', false ); // booleans are converted to float

### Viewport

A viewport defines the rendering resolution and offset wihtin the canvas element. By default, the viewport will be set the size and resolution of the canvas element.

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

Using the viewport is the recommended way to mimic multiple rendering contexts as it requires no duplication of resources.

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

Vertex buffers store vertex attribute information. Common attributes include positions, normals, texture coordinates, skeletal animation joint ids and skinning weights. They can be stored in separate buffers, single buffers accessed at offsets, or interleaved with each other to take advantage of cache locality (recommended).

    // Create separate vertex buffers for each attributes.
    var positionBuffer = new esper.VertexBuffer( positions, {
        size: 3,
        type: 'FLOAT'
    });
    var normalBuffer = new esper.VertexBuffer( normals, {
        size: 3,
        type: 'FLOAT'
    });
    var uvBuffer = new esper.VertexBuffer( uvs, {
        size: 2,
        type: 'FLOAT'
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

Drawing with vertex buffers is simple, simply bind it, and draw.

    // Bind vertex buffer.
    vertexBuffer.bind();
    // Draw triangles.
    vertexBuffer.draw({
        mode: TRIANGLES
    });
    // Draw points from an offsets.
    vertexBuffer.draw({
        mode: POINTS,
        offset: 100
    });
    // Draw only n lines.
    vertexBuffer.draw({
        mode: LINES,
        count: n * 2
    });

### VertexPackages

Interleaving vertex attributes and correctly defining the attribute pointers manually is tedious and prone to frustrating user errors. Vertex packages simplify this and coalesce multiple arrays into a single interleaved Float32Array while providing the correct attribute pointers.

    // Create interleaved vertex buffers using vertex packages.
    var vertexPackage = new esper.VertexPackage([
        positions,
        normals,
        uvs
    ]);

Vertex packages can then be passed to the VertexBuffer constructor for simple instantiation.

    var vertexBuffer = new esper.VertexBuffer( vertexPackage );

### IndexBuffers

Due to the nature of tessellation, single vertices may referenced by multiple geometric primitives. Using only vertex buffers results in a large amount of redundancy as these vertices must be repeated in the buffer. For example a simple cube is composed of 12 triangles, requiring 36 vertices if solely using a vertex buffer. With no shading this cube be represented with only 8 vertices when using an index buffer. Index buffers allow the user to specify the ordering of vertex attributes inside a vertex buffer, which allows re-use and smaller buffers.

    // Create index buffer from an array of indices.
    var indexBuffer = new esper.IndexBuffer( indices );

Rendering with index buffers is also simple, simply bind the vertex buffers, then bind the index buffer and draw.

    // Bind vertex buffer.
    vertexBuffer.bind();
    // Bind index buffer.
    indexBuffer.bind();
    // Draw triangles.
    indexBuffer.draw({
        mode: TRIANGLES
    });
    // Draw points from an offsets.
    indexBuffer.draw({
        mode: POINTS,
        offset: 100
    });
    // Draw only n lines.
    indexBuffer.draw({
        mode: LINES,
        count: n * 2
    });

### Renderables

While working at the level of vertex buffers and index buffers can give you low level control, it is often tedious. Renderables encapsulate this behavior with a simplified interface while still retaining the same low level control.

    // Create a renderable from vertex and index arrays.
    var renderable = new esper.Renderable({
        positions: positionsArray,
        normals: normalsArray,
        uvs: uvsArray,
        indices: indicesArray
    });

    // Draw the renderable.
    renderable.draw({
        mode: 'LINES', // render lines instead of triangles
        offset: 100 * 2, // exclude the first 100 lines
        count: 500 * 2 // only render 500 lines
    });

### Textures

Textures can store many different types of information. Typically a texture stores image RGB or RGBA values, however they can also be used to store depth values or any other types of encoded information. Textures can be created from existing HTMLImageElements, urls containing HTMLImageElement supported image formats, or no data at all.

    // Create texture from image url.
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
        console.log( 'Texture2D image successfully created.' );
    });

    // Create a depth texture. (Only works if depth texture extension is supported).
    var depthTexture = new esper.Texture2D({
        width: 1024,
        height: 1024,
        format: 'DEPTH_COMPONENT',
        type: 'UNSIGNED_INT'
    });

Binding textures for use is simple:

    // Bind to texture unit 0
    texture.push( 0 );
    // Bind texture sampler to the same unit.
    shader.setUniform( 'uTextureSampler', 0 );

    // .. draw using texture

    // Unbind from texture unit 0.
    texture.pop( 0 );

All images or image dimensions that are not a power of two are resized to the next highest power of two. For example 129 becomes 256, 15 becomes 16, etc. All textures that are created from an image are automatically mip-mapped.

### TextureCubeMaps

Cubemap textures are a specific type of texture typically used for skyboxes or reflections. The faces of the cubes are specified during instantiation. Cubemap textures can be created from existing HTMLImageElements, urls containing HTMLImageElement supported image formats, or no data at all.

    // Create cube map from image urls.
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
        cubeTextureDeferred.resolve();
    });

    // create empty cube map to be written to.
    var cubeMapTexture = new TextureCubeMap({
        width: 512,
        height: 512
    });

Binding cubemap textures for use is simple:

    // Bind to texture unit 0.
    cubeMapTexture.push( 0 );
    // Bind texture sampler to the same unit.
    shader.setUniform( 'uTextureSampler', 0 );

    // .. draw using cubemap texture

    // Unbind from texture unit 0.
    cubeMapTexture.pop( 0 );

### RenderTargets

When compositing more complex scenes, intermediate render states may need to be written to an additional buffer. Render targets provide an interface to allow you to draw to multiple textures.

    // Create a shadow map texture.
    var shadowMapTexture = new esper.Texture2D({
        width: 512,
        height: 512,
        format: 'RGBA',
        type: 'UNSIGNED_BYTE'
    });

    // Create a depth texture for the render target.
    var depthTexture = new esper.Texture2D({
        width: SHADOW_MAP_SIZE,
        height: SHADOW_MAP_SIZE,
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
