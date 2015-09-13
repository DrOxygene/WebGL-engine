ENGINE.WebGLVariable = function () {
    this.vertex = {
        preprocessor: [
            (ENGINE.isEnabled(ENGINE.LIGHT_MASK)) ? 'MAX_LIGHT ' + ENGINE.MAX_LIGHT : ''
        ],

        attributes: [
            {name:"vertexPositionAttribute", shaderName:"aVertexPosition", type:"vec3", isArray:true, implementWhen:ENGINE.DEFAULT_MASK},
            {name:"vertexNormalAttribute", shaderName:"aVertexNormal", type:"vec3", isArray:true, implementWhen:ENGINE.LIGHT_MASK}
        ],

        uniforms: [
            {name:"mvMatrixUniform", shaderName:"uMVMatrix", type:"mat4", isArray:false, implementWhen:ENGINE.DEFAULT_MASK},
            {name:"mvpMatrixUniform", shaderName:"uMVPMatrix", type:"mat4", isArray:false, implementWhen:ENGINE.DEFAULT_MASK}
        ],

        varying: [
            {shaderName:"vNormal", type:"vec3", implementWhen:ENGINE.LIGHT_MASK},
            {shaderName:"vPosition", type:"vec3", implementWhen:ENGINE.LIGHT_MASK}
        ]
    };

    this.fragment = {
        preprocessor: [
            (ENGINE.isEnabled(ENGINE.LIGHT_MASK)) ? 'MAX_LIGHT ' + ENGINE.MAX_LIGHT : ''
        ],

        uniforms: [
            {name:"lightsUniform", shaderName:"uLights", type:"Light", isArray:true, arrayLength:ENGINE.MAX_LIGHT, implementWhen:ENGINE.LIGHT_MASK}
        ],

        varying: [
            {shaderName:"vNormal", type:"vec3", implementWhen:ENGINE.LIGHT_MASK},
            {shaderName:"vPosition", type:"vec3", implementWhen:ENGINE.LIGHT_MASK}
        ],

        struct: {
            Light:{implementWhen:ENGINE.LIGHT_MASK, data: [
                {name:"position", type:"vec3"},
                {name:"color", type:"vec4"}
            ]}
        }
    };
};