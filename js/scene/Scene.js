/**
 * Créée une scène de rendu
 * @param camera {ENGINE.Camera} la camera filmant la scène
 * @constructor
 */
ENGINE.Scene = function(camera) {
    this.shapes = [];
    this.lights = [];

    this.camera = camera || new ENGINE.Camera().setPositionRotation(new ENGINE.Vec3(0, 0, 0), new ENGINE.Euler(0, 0, 0));

    this.mMatrixArray = [];
    this.mMatrix = new ENGINE.Mat4();

    GL.clearColor(0.05, 0.05, 0.05, 1.0);
    GL.enable(GL.DEPTH_TEST);
};

ENGINE.Scene.prototype = {
    constructor: ENGINE.Scene,

    /**
     * Dessine la scène avec les éléments qui la
     * compose
     */
    drawScene: function () {
        GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        if(ENGINE.isEnabled(ENGINE.FRAGMENT_LIGHT_MASK) || ENGINE.isEnabled(ENGINE.VERTEX_LIGHT_MASK)) this.renderLights();

        for(var shape of this.shapes) shape.renderShape(this);
    },

    /**
     * Réalise le rendu de la lumière
     */
    renderLights: function () {
        for (var i = 0; i < this.lights.length; i++) {
            var pos = ENGINE.Vec3.matTransform(this.lights[i].position, this.camera.getViewMatrix());
            var col = this.lights[i].color;
            var brightness = this.lights[i].brightness * 1.0;

            GL.uniform1f(ENGINE.shaderProgram["lightsUniform"][i].brightness, brightness);
            GL.uniform3fv(ENGINE.shaderProgram["lightsUniform"][i].position, [pos.x, pos.y, pos.z]);
            GL.uniform3fv(ENGINE.shaderProgram["lightsUniform"][i].color, [col.r, col.g, col.b]);
        }
    },

    /**
     * Empile la matrice modèle
     */
    pushMatrix: function () {
        this.mMatrixArray.push(this.mMatrix.clone());
    },

    /**
     * Dépile la dernière matrice modèle
     */
    popMatrix: function () {
        this.mMatrix = this.mMatrixArray[this.mMatrixArray.length - 1];
        this.mMatrixArray.pop();
    },

    /**
     * Envois la matrice modèle-vue-projection aux shaders
     */
    setMVPMatrix: function () {
        var mvpMatrix = this.camera.getViewMatrix().multiply(this.mMatrix);
        GL.uniformMatrix4fv(ENGINE.shaderProgram["mvMatrixUniform"], false, mvpMatrix.data);
        mvpMatrix = this.camera.getPerspectiveMatrix().multiply(mvpMatrix);
        GL.uniformMatrix4fv(ENGINE.shaderProgram["mvpMatrixUniform"], false, mvpMatrix.data);
    },

    /**
     * Ajoute une forme à la scène
     * @param shape {ENGINE.Shape|ENGINE.Box} la forme à ajouter
     */
    addShape: function (shape) {
        this.shapes.push(shape);
    },

    /**
     * Ajoute une lumière à la scène
     * @param light {ENGINE.Light} la lumière à ajouter
     */
    addLight: function (light) {
        this.lights.push(light);
    }
};