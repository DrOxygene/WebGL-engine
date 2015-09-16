ENGINE.WebGLShader = {
    /**
     * Retourne le vertex shader
     * @param vertexVariables {Object} les variables à implémenter dans le shader
     * @returns {string} le vertex shader
     */
    buildVertex: function (vertexVariables) {
        var head = "";
        var core = "void main() {\n#ifdef VERTEX_LIGHTING\n    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n    for(int i = 0; i < MAX_LIGHT; i++) {\n        vec4 position = uMVMatrix * vec4(aVertexPosition, 1.0);\n        float dist = length(uLights[i].position - position.xyz);\n        \n        vec3 lightDir = normalize(uLights[i].position - position.xyz);\n        vec3 normal = vec3(uMVMatrix * vec4(aVertexNormal, 0.0));\n        float diffuse = max(dot(normal, lightDir), 0.1) * (1.0 / (0.25 * dist * dist));\n        \n        color = color + vec4(uLights[i].color.rgb * diffuse, uLights[0].color.a);\n    }\n    vColor = color;\n#elif defined(FRAGMENT_LIGHTING)\n    vPosition = vec3(uMVMatrix * vec4(aVertexPosition, 1.0));\n    vNormal = normalize(vec3(uMVMatrix * vec4(aVertexNormal, 0.0)));\n#endif\n    gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0);\n}";

        for(var prep of vertexVariables.preprocessor) {
            if(prep == '') continue;
            head += "#define " + prep + "\n";
        }

        for(var struct in vertexVariables.struct) {
            var structData = vertexVariables.struct[struct];
            if(!this.canImplement(structData)) continue;

            head += "struct " + struct + " {\n";
            for(var param of structData.data) head += "   " + param.type + " " + param.name + ";\n";
            head += "};\n";
        }

        for(var attrib of vertexVariables.attributes) {
            if(!this.canImplement(attrib)) continue;
            head += "attribute " + attrib.type + " " + attrib.shaderName + ";\n";
        }

        for(var uniform of vertexVariables.uniforms) {
            if(!this.canImplement(uniform)) continue;
            head += "uniform " + uniform.type + " " + uniform.shaderName + ((uniform.isArray) ? "[" + uniform.arrayLength + "];\n" : ";\n");
        }

        for(var varying of vertexVariables.varying) {
            if(!this.canImplement(varying)) continue;
            head += "varying " + varying.type + " " + varying.shaderName + ";\n";
        }

        return head += core;
    },

    /**
     * Retourne le fragment shader
     * @param fragmentVariables {Object} les variables à implémenter dans le shader
     * @returns {string} le fragment shader
     */
    buildFragment: function (fragmentVariables) {
        var head = "precision mediump float;\n\n";
        var core = "#ifdef FRAGMENT_LIGHTING\nfloat specular(vec3 lightDir, float brightness) {\n    vec3 eyeDir = normalize(-vPosition.xyz);\n    vec3 reflectLight = reflect(-lightDir, vNormal);\n    \n    return pow(max(dot(reflectLight, eyeDir), 0.0), 128.0);\n}\n\nvec4 lighting() {\n    vec4 color = vec4(0.025, 0.025, 0.025, 1.0);\n        \n    for(int i = 0; i < MAX_LIGHT; i++) {\n        float dist = length(uLights[i].position - vPosition);\n        vec3 lightDir = normalize(uLights[i].position - vPosition);\n        \n        float atten = (1.0 / ((1.0 / uLights[i].brightness) * dist * dist));\n        float diffuse = max(dot(vNormal, lightDir), 0.0);\n        float specular = specular(lightDir, uLights[i].brightness);\n        \n        color = color + vec4(uLights[i].color.rgb * (diffuse + specular * 0.1) * atten, uLights[i].color.a);\n    }\n    return color;\n}\n#endif\n\nvoid main() {\n#ifdef FRAGMENT_LIGHTING\n    gl_FragColor = lighting();\n#elif defined(VERTEX_LIGHTING)\n    gl_FragColor = vColor;\n#else\n    gl_FragColor = vec4(1.0);\n#endif\n}";

        for(var prep of fragmentVariables.preprocessor) {
            if(prep == '') continue;
            head += "#define " + prep + "\n";
        }

        for(var struct in fragmentVariables.struct) {
            var structData = fragmentVariables.struct[struct];
            if(!this.canImplement(structData)) continue;

            head += "struct " + struct + " {\n";
            for(var param of structData.data) head += "   " + param.type + " " + param.name + ";\n";
            head += "};\n";
        }

        for(var uniform of fragmentVariables.uniforms) {
            if(!this.canImplement(uniform)) continue;
            head += "uniform " + uniform.type + " " + uniform.shaderName + ((uniform.isArray) ? "[" + uniform.arrayLength + "];\n" : ";\n");
        }

        for(var varying of fragmentVariables.varying) {
            if(!this.canImplement(varying)) continue;
            head += "varying " + varying.type + " " + varying.shaderName + ";\n";
        }

        return head += core;
    },

    canImplement: function (variable) {
        for(var condition of variable.implementWhen) {
            if(ENGINE.isEnabled(condition)) return true;
        }
        return false;
    }
};