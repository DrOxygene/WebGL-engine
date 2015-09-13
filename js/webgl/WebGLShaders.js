ENGINE.WebGLShader = {
    buildVertex: function (vertexVariables) {
        var head = "";
        var core = "void main() {\n#ifdef MAX_LIGHT\n    vPosition = vec3(uMVMatrix * vec4(aVertexPosition, 1.0));\n    vNormal = vec3(uMVMatrix * vec4(aVertexNormal, 0.0));\n#endif\n    gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0);\n}";

        for(var prep of vertexVariables.preprocessor) {
            if(prep == '') continue;
            head += "#define " + prep + "\n";
        }

        for(var attrib of vertexVariables.attributes) {
            if(!ENGINE.isEnabled(attrib.implementWhen)) continue;
            head += "attribute " + attrib.type + " " + attrib.shaderName + ";\n";
        }

        for(var uniform of vertexVariables.uniforms) {
            if(!ENGINE.isEnabled(uniform.implementWhen)) continue;
            head += "uniform " + uniform.type + " " + uniform.shaderName + ((uniform.isArray) ? "[" + uniform.arrayLength + "];\n" : ";\n");
        }

        for(var varying of vertexVariables.varying) {
            if(!ENGINE.isEnabled(varying.implementWhen)) continue;
            head += "varying " + varying.type + " " + varying.shaderName + ";\n";
        }

        return head += core;
    },

    buildFragment: function (fragmentVariables) {
        var head = "precision mediump float;\n\n";
        var core = "#ifdef MAX_LIGHT\nvec4 lighting() {\n    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n        \n    for(int i = 0; i < MAX_LIGHT; i++) {\n        float dist = length(uLights[i].position - vPosition);\n        vec3 lightDir = normalize(uLights[i].position - vPosition);\n        \n        float diffuse = max(dot(vNormal, lightDir), 0.1) * (1.0 / (0.25 * dist * dist));\n        \n        color = color + vec4(uLights[i].color.rgb * diffuse, uLights[0].color.a);\n    }\n    return color;\n}\n#endif\n\nvoid main() {\n#ifdef MAX_LIGHT\n    gl_FragColor = lighting();\n#else\n    gl_FragColor = vec4(1.0);\n#endif\n}";

        for(var prep of fragmentVariables.preprocessor) {
            if(prep == '') continue;
            head += "#define " + prep + "\n";
        }

        for(var struct in fragmentVariables.struct) {
            var structData = fragmentVariables.struct[struct];
            if(!ENGINE.isEnabled(structData.implementWhen)) continue;

            head += "struct " + struct + " {\n";
            for(var param of structData.data) head += "   " + param.type + " " + param.name + ";\n";
            head += "};\n";
        }

        for(var uniform of fragmentVariables.uniforms) {
            if(!ENGINE.isEnabled(uniform.implementWhen)) continue;
            head += "uniform " + uniform.type + " " + uniform.shaderName + ((uniform.isArray) ? "[" + uniform.arrayLength + "];\n" : ";\n");
        }

        for(var varying of fragmentVariables.varying) {
            if(!ENGINE.isEnabled(varying.implementWhen)) continue;
            head += "varying " + varying.type + " " + varying.shaderName + ";\n";
        }

        return head += core;
    }
};