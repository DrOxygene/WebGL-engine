ENGINE.WebGLShader = {
    // TODO rendre maxLight variable
    vertex: "attribute vec4 aVertexPosition;\nattribute vec3 aVertexNormal;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uMVPMatrix;\n\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nvoid main() {\n    vPosition = vec3(uMVMatrix * aVertexPosition);\n    vNormal = vec3(uMVMatrix * vec4(aVertexNormal, 0.0));\n    \n    gl_Position = uMVPMatrix * aVertexPosition;\n}",

    fragment: "precision mediump float;\n\nstruct Light {\n    vec3 position;\n    vec4 color;\n};\n\nuniform Light uLights[16];\n\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nvoid main() {\n    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n    \n    for(int i = 0; i < 16; i++) {\n        float dist = length(uLights[i].position - vPosition);\n        vec3 lightDir = normalize(uLights[i].position - vPosition);\n        \n        float diffuse = max(dot(vNormal, lightDir), 0.05) * (1.0 / (0.25 * dist * dist));\n        \n        color = color + vec4(uLights[i].color.rgb * diffuse, uLights[0].color.a);\n    }\n    \n    gl_FragColor = color;\n}"
};