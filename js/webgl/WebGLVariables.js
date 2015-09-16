ENGINE.WebGLVariable = function () {
    this.vertex = {
        preprocessor: [
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK) || ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'MAX_LIGHT ' + ENGINE.MAX_LIGHT : '',
            (ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'VERTEX_LIGHTING' : '',
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK)) ? 'FRAGMENT_LIGHTING' : ''
        ],

        attributes: [
            {name:"vertexPositionAttribute", shaderName:"aVertexPosition", type:"vec3", isArray:true, implementWhen:[ENGINE.DEFAULT_MASK]},
            {name:"vertexNormalAttribute", shaderName:"aVertexNormal", type:"vec3", isArray:true, implementWhen:[ENGINE.DEFAULT_MASK]}
        ],

        uniforms: [
            {name:"mvMatrixUniform", shaderName:"uMVMatrix", type:"mat4", isArray:false, implementWhen:[ENGINE.DEFAULT_MASK]},
            {name:"mvpMatrixUniform", shaderName:"uMVPMatrix", type:"mat4", isArray:false, implementWhen:[ENGINE.DEFAULT_MASK]},
            {name:"lightsUniform", shaderName:"uLights", type:"Light", isArray:true, arrayLength:ENGINE.MAX_LIGHT, implementWhen:[ENGINE.VERTEX_LIGHT_MASK]}
        ],

        varying: [
            {shaderName:"vNormal", type:"vec3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vPosition", type:"vec3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vColor", type:"vec4", implementWhen:[ENGINE.VERTEX_LIGHT_MASK]}
        ],

        struct: {
            Light:{implementWhen:[ENGINE.VERTEX_LIGHT_MASK], data: [
                {name:"position", type:"vec3"},
                {name:"color", type:"vec4"},
                {name:"brightness", type:"float"}
            ]}
        }
    };

    this.fragment = {
        preprocessor: [
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK) || ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'MAX_LIGHT ' + ENGINE.MAX_LIGHT : '',
            (ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'VERTEX_LIGHTING' : '',
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK)) ? 'FRAGMENT_LIGHTING' : ''
        ],

        uniforms: [
            {name:"lightsUniform", shaderName:"uLights", type:"Light", isArray:true, arrayLength:ENGINE.MAX_LIGHT, implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]}
        ],

        varying: [
            {shaderName:"vNormal", type:"vec3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vPosition", type:"vec3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vColor", type:"vec4", implementWhen:[ENGINE.VERTEX_LIGHT_MASK]}
        ],

        struct: {
            Light:{implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK], data: [
                {name:"position", type:"vec3"},
                {name:"color", type:"vec4"},
                {name:"brightness", type:"float"}
            ]}
        }
    };
};