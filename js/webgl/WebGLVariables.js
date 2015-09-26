ENGINE.WebGLVariable = function () {
    this.vertex = {
        preprocessor: [
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK) || ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'MAX_LIGHT ' + ENGINE.MAX_LIGHT : '',
            (ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'VERTEX_LIGHTING' : '',
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK)) ? 'FRAGMENT_LIGHTING' : '',
            (ENGINE.isEnabled(ENGINE.TEXTURE_MASK)) ? 'TEXTURE' : ''
        ],

        attributes: [
            {name:"vertexPositionAttribute", shaderName:"aVertexPosition", type:"vec3", isArray:true, implementWhen:[ENGINE.DEFAULT_MASK]},
            {name:"vertexNormalAttribute", shaderName:"aVertexNormal", type:"vec3", isArray:true, implementWhen:[ENGINE.DEFAULT_MASK]},
            {name:"vertexTextureCoordAttribute", shaderName:"aVertexTextureCoord", type:"vec2", isArray:true, implementWhen:[ENGINE.TEXTURE_MASK]}
        ],

        uniforms: [
            {name:"mvMatrixUniform", shaderName:"uMVMatrix", type:"mat4", isArray:false, implementWhen:[ENGINE.DEFAULT_MASK]},
            {name:"mvpMatrixUniform", shaderName:"uMVPMatrix", type:"mat4", isArray:false, implementWhen:[ENGINE.DEFAULT_MASK]},
            {name:"lightsUniform", shaderName:"uLights", custom:true, type:"Light", isArray:true, arrayLength:ENGINE.MAX_LIGHT, implementWhen:[ENGINE.VERTEX_LIGHT_MASK]}
        ],

        varying: [
            {shaderName:"vPosition", type:"vec3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vTBN", type:"mat3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vColor", type:"vec4", implementWhen:[ENGINE.VERTEX_LIGHT_MASK]},
            {shaderName:"vTextureCoord", type:"vec2", implementWhen:[ENGINE.TEXTURE_MASK]}
        ],

        struct: {
            Light:{implementWhen:[ENGINE.VERTEX_LIGHT_MASK], data: [
                {name:"position", type:"vec3"},
                {name:"color", type:"vec3"},
                {name:"brightness", type:"float"}
            ]}
        }
    };

    this.fragment = {
        preprocessor: [
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK) || ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'MAX_LIGHT ' + ENGINE.MAX_LIGHT : '',
            (ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) ? 'VERTEX_LIGHTING' : '',
            (ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK)) ? 'FRAGMENT_LIGHTING' : '',
            (ENGINE.isEnabled(ENGINE.TEXTURE_MASK)) ? 'TEXTURE' : ''
        ],

        uniforms: [
            {name:"lightsUniform", shaderName:"uLights", custom:true, type:"Light", isArray:true, arrayLength:ENGINE.MAX_LIGHT, implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {name:"materialUniform", shaderName:"uMaterial", custom:true, type:"Material", isArray:false, implementWhen:[ENGINE.TEXTURE_MASK]}
        ],

        varying: [
            {shaderName:"vPosition", type:"vec3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vTBN", type:"mat3", implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK]},
            {shaderName:"vColor", type:"vec4", implementWhen:[ENGINE.VERTEX_LIGHT_MASK]},
            {shaderName:"vTextureCoord", type:"vec2", implementWhen:[ENGINE.TEXTURE_MASK]}
        ],

        struct: {
            Light:{implementWhen:[ENGINE.FRAGMENT_LIGHT_MASK], data: [
                {name:"position", type:"vec3"},
                {name:"color", type:"vec3"},
                {name:"brightness", type:"float"}
            ]},
            Material:{implementWhen:[ENGINE.TEXTURE_MASK], data: [
                {name:"textureDiffuse", type:"sampler2D"},
                {name:"textureNormal", type:"sampler2D"},
                {name:"useNormal", type:"bool"}
            ]}
        }
    };
};