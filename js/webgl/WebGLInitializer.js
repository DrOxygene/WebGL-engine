ENGINE.initGL = function(canvas) {
    try {
        GL = canvas.getContext("webgl");
        GL.viewportWidth = canvas.width;
        GL.viewportHeight = canvas.height;
    } catch (e) {
        alert("Could not initialise WebGL, sorry :-(");
    }

    initShaders();
};

// TODO faire une classe un peu plus propre

function getShaders() {
    var shaderVertex, shaderFragment;

    shaderFragment = GL.createShader(GL.FRAGMENT_SHADER);
    shaderVertex = GL.createShader(GL.VERTEX_SHADER);

    GL.shaderSource(shaderVertex, ENGINE.WebGLShader.vertex);
    GL.compileShader(shaderVertex);

    if (!GL.getShaderParameter(shaderVertex, GL.COMPILE_STATUS)) {
        alert(GL.getShaderInfoLog(shaderVertex));
        return null;
    }

    GL.shaderSource(shaderFragment, ENGINE.WebGLShader.fragment);
    GL.compileShader(shaderFragment);

    if (!GL.getShaderParameter(shaderFragment, GL.COMPILE_STATUS)) {
        alert(GL.getShaderInfoLog(shaderFragment));
        return null;
    }

    return [shaderVertex, shaderFragment];
}

function initShaders() {
    var shaders = getShaders();

    var shaderProgram = ENGINE.shaderProgram = GL.createProgram();
    GL.attachShader(shaderProgram, shaders[0]);
    GL.attachShader(shaderProgram, shaders[1]);
    GL.linkProgram(shaderProgram);

    if (!GL.getProgramParameter(shaderProgram, GL.LINK_STATUS)) alert(GL.getProgramInfoLog(shaderProgram));

    GL.useProgram(shaderProgram);

    // TODO créer un tableau de rescencement des uniforms
    shaderProgram.vertexPositionAttribute = GL.getAttribLocation(shaderProgram, "aVertexPosition");
    GL.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexNormalAttribute = GL.getAttribLocation(shaderProgram, "aVertexNormal");
    GL.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    shaderProgram.mvMatrixUniform = GL.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.mvpMatrixUniform = GL.getUniformLocation(shaderProgram, "uMVPMatrix");

    shaderProgram.lights = [];
    for(var i = 0; i < 16; i++) {
        shaderProgram.lights[i] = {};
        shaderProgram.lights[i].position = GL.getUniformLocation(shaderProgram, "uLights[" + i + "].position");
        shaderProgram.lights[i].color = GL.getUniformLocation(shaderProgram, "uLights[" + i + "].color");
    }
}