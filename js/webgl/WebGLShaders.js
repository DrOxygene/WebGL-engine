ENGINE.WebGLShader = {
    /**
     * Retourne le vertex shader
     * @param vertexVariables {Object} les variables à implémenter dans le shader
     * @returns {string} le vertex shader
     */
    buildVertex: function (vertexVariables) {
        var head = "";
        var core = "#ifdef FRAGMENT_LIGHTING\nvec3 tangent(vec3 normal) {\n    vec3 c1 = cross(normal, vec3(0.0, 0.0, 1.0));\n    vec3 c2 = cross(normal, vec3(0.0, 1.0, 0.0));\n    \n    vec3 tangent2 = (length(c1) > length(c2)) ? c1 : c2;\n    \n    return normalize(tangent2);\n}\n\nmat3 getTBN() {\n    vec3 wNormal = mat3(uMVMatrix) * aVertexNormal;\n    \n    vec3 normal = normalize(wNormal);\n    vec3 tangent2 = tangent(normal);\n    vec3 bitangent = cross(tangent2, normal);\n    return mat3(tangent2, bitangent, normal);\n}\n#endif\n\n#ifdef VERTEX_LIGHTING\nvec3 diffuse(Light light, vec3 position, vec3 normal) {\n    float dist = length(light.position - position);    \n    float atten = (1.0 / ((1.0 / light.brightness) * dist * dist));\n    \n    vec3 lightDir = normalize(light.position - position);\n    float diffuse2 = max(dot(normal, lightDir), 0.1) * atten;\n    return light.color * diffuse2;\n}\n#endif\n\nvoid main() {\n#ifdef VERTEX_LIGHTING\n    vec3 totalLight = vec3(0.025);\n    for(int i = 0; i < MAX_LIGHT; i++) {\n        vec4 position = uMVMatrix * vec4(aVertexPosition, 1.0);\n        vec3 normal = normalize(mat3(uMVMatrix) * aVertexNormal);\n        totalLight += diffuse(uLights[i], position.xyz, normal); \n    }\n    vColor = vec4(totalLight, 1.0);\n#elif defined(FRAGMENT_LIGHTING)\n    vPosition = vec3(uMVMatrix * vec4(aVertexPosition, 1.0));\n    vTBN = getTBN();\n#endif\n\n#ifdef TEXTURE\n    vTextureCoord = aVertexTextureCoord;\n#endif\n    gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0);\n}";

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
        var core = "#ifdef FRAGMENT_LIGHTING \nvec3 specular(vec3 lightDir, Light light, vec3 normal) {\n    vec3 eyeDir = normalize(-vPosition.xyz);\n    vec3 reflectLight = reflect(-lightDir, normal);\n    \n    return light.color * pow(max(dot(reflectLight, eyeDir), 0.0), 128.0);\n}\n\nvec3 diffuse(vec3 lightDir, Light light, vec3 normal) {\n    float diffuseFactor = max(dot(normal, lightDir), 0.0);\n    \n    return light.color * diffuseFactor;\n}\n\nvec3 calculateNormal() {\n#ifdef TEXTURE\n    return (uMaterial.useNormal) ? vTBN * (texture2D(uMaterial.textureNormal, vTextureCoord).xyz * 2.0 - 1.0) : vTBN * vec3(0.0, 0.0, 1.0);\n#else\n    return vTBN * vec3(0.0, 0.0, 1.0);\n#endif\n}\n\nvec3 calcLight(Light light, vec3 lightDir, vec3 normal) {\n    vec3 diffuse2 = diffuse(lightDir, light, normal);\n    vec3 specular2 = specular(lightDir, light, normal) * 0.1;\n    \n    return diffuse2 + specular2;\n}\n\nvec3 lighting(Light light, vec3 normal) {\n    vec3 lightDir = light.position - vPosition;\n    float dist = length(lightDir);\n    lightDir = normalize(lightDir);\n    \n    vec3 color = calcLight(light, lightDir, normal);\n    float atten = (1.0 / ((1.0 / light.brightness) * dist * dist));\n    return color * atten;\n}\n#endif\n\nvoid main() {\n#ifdef FRAGMENT_LIGHTING\n    vec3 totalLight = vec3(0.025, 0.025, 0.025);\n    vec3 normal = calculateNormal();\n    \n    for(int i = 0; i < MAX_LIGHT; i++) totalLight += lighting(uLights[i], normal);\n    \n    #ifdef TEXTURE\n        gl_FragColor = texture2D(uMaterial.textureDiffuse, vTextureCoord) * vec4(totalLight, 1.0);\n    #else\n        gl_FragColor = vec4(totalLight, 1.0);\n    #endif\n#elif defined(VERTEX_LIGHTING)\n    #ifdef TEXTURE\n        gl_FragColor = texture2D(uMaterial.textureDiffuse, vTextureCoord) * vColor;\n    #else\n        gl_FragColor = vColor;\n    #endif\n#else\n    #ifdef TEXTURE\n        gl_FragColor = texture2D(uMaterial.textureDiffuse, vTextureCoord);\n    #else\n        gl_FragColor = vec4(1.0);\n    #endif\n#endif\n}";

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

    /**
     * Indique si la variable peut être implémentée
     * @param variable {Object} la variable
     * @returns {boolean} true si elle peut être implémentée, false sinon
     */
    canImplement: function (variable) {
        for(var condition of variable.implementWhen) {
            if(!ENGINE.isEnabled(condition)) return false;
        }
        return true;
    }
};