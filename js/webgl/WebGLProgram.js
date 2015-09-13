/**
 * Créée le programme d'affichage WebGL
 * @param canvas {HTMLCanvasElement} le canvas de dessin
 * @constructor
 */
ENGINE.WebGLProgram = function (canvas) {
    try {
        GL = canvas.getContext("webgl");
        GL.viewportWidth = canvas.width;
        GL.viewportHeight = canvas.height;
    } catch (e) {
        alert("Impossible d'initialiser le contexte WebGL");
    }
};

ENGINE.WebGLProgram.prototype = {
    /**
     * Initialise le programme WebGL
     */
    initGL: function () {
        this.variables = new ENGINE.WebGLVariable();
        var shaders = this.getShaders();

        var shaderProgram = ENGINE.shaderProgram = GL.createProgram();
        GL.attachShader(shaderProgram, shaders[0]);
        GL.attachShader(shaderProgram, shaders[1]);
        GL.linkProgram(shaderProgram);

        if (!GL.getProgramParameter(shaderProgram, GL.LINK_STATUS)) alert(GL.getProgramInfoLog(shaderProgram));

        GL.useProgram(shaderProgram);

        this.loadAttributesLocation(shaderProgram, this.variables.vertex.attributes);
        this.loadUniformsLocation(shaderProgram, this.variables.vertex.uniforms);
        this.loadUniformsLocation(shaderProgram, this.variables.fragment.uniforms);
    },

    /**
     * Retourne les shaders (vertex et fragment) du programme
     * @returns {Array}
     */
    getShaders: function () {
        var shaderVertex, shaderFragment;

        shaderFragment = GL.createShader(GL.FRAGMENT_SHADER);
        shaderVertex = GL.createShader(GL.VERTEX_SHADER);

        GL.shaderSource(shaderVertex, ENGINE.WebGLShader.buildVertex(this.variables.vertex));
        GL.compileShader(shaderVertex);

        if (!GL.getShaderParameter(shaderVertex, GL.COMPILE_STATUS)) {
            alert(GL.getShaderInfoLog(shaderVertex));
            return null;
        }

        GL.shaderSource(shaderFragment, ENGINE.WebGLShader.buildFragment(this.variables.fragment));
        GL.compileShader(shaderFragment);

        if (!GL.getShaderParameter(shaderFragment, GL.COMPILE_STATUS)) {
            alert(GL.getShaderInfoLog(shaderFragment));
            return null;
        }

        return [shaderVertex, shaderFragment];
    },

    /**
     * Initialise les pointeurs des attributs
     * @param shaderProgram {WebGLProgram} le programme de dessin
     * @param attributes {Array} le tableau d'attribut
     */
    loadAttributesLocation: function(shaderProgram, attributes) {
        for(var attrib of attributes) {
            if(!ENGINE.isEnabled(attrib.implementWhen)) continue;

            shaderProgram[attrib.name] = GL.getAttribLocation(shaderProgram, attrib.shaderName);
            if(attrib.isArray) GL.enableVertexAttribArray(shaderProgram[attrib.name]);
        }
    },

    /**
     * Initialise les pointeurs des uniforms
     * @param shaderProgram {WebGLProgram} le programme de dessin
     * @param uniforms {Array} le tableau d'uniform
     */
    loadUniformsLocation: function(shaderProgram, uniforms) {
        for(var uniform of uniforms) {
            if(!ENGINE.isEnabled(uniform.implementWhen)) continue;

            if(uniform.isArray) {
                var struct = this.getStructByName(uniform.type);
                this.createUniformStructArrayPointer(shaderProgram, uniform, struct);
            } else shaderProgram[uniform.name] = GL.getUniformLocation(shaderProgram, uniform.shaderName);
        }
    },

    /**
     * Retourne la structure correspondant au nom passé en paramètre
     * @param name {String} nom du struct
     * @returns {Object} la structure
     */
    getStructByName: function (name) {
        return (this.variables.vertex.struct) ? this.variables.vertex.struct[name] : this.variables.fragment.struct[name];
    },

    /**
     * Créée les pointeurs d'un uniform dans le cas ou celui-ci
     * est un tableau, et dont le type est une structure personnalisée
     * @param shaderProgram {WebGLProgram} le programme de dessin
     * @param uniform {Object} la variable uniform
     * @param struct {Object} la structure
     */
    createUniformStructArrayPointer: function (shaderProgram, uniform, struct) {
        shaderProgram[uniform.name] = [];
        for(var i = 0; i < uniform.arrayLength; i++) {
            shaderProgram[uniform.name][i] = {};
            for(var j = 0; j < struct.data.length; j++) {
                shaderProgram[uniform.name][i][struct.data[j].name] = GL.getUniformLocation(shaderProgram, uniform.shaderName + "[" + i + "]." + struct.data[j].name);
            }
        }
    }
};