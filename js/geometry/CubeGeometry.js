/**
 * Contruit les vertex d'un cube
 * @constructor
 */
ENGINE.CubeGeometry = function() {
    ENGINE.Geometry.call(this);

    this.vertexPositionBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexPositionBuffer);
    var cubeVertex = [
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeVertex), GL.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItem = 24;

    // TODO essayer de factoriser ce tas de merde
    this.vertexNormalBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexNormalBuffer);
    var vertexNormals = [
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertexNormals), GL.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = 24;

    this.vertexIndexBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2,    0, 2, 3,
        4, 5, 6,    4, 6, 7,
        8, 9, 10,   8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), GL.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = 36;
};

ENGINE.CubeGeometry.prototype = Object.create(ENGINE.Geometry.prototype);
ENGINE.CubeGeometry.prototype.constructor = ENGINE.CubeGeometry;