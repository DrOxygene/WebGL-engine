/**
 * Créée une scène de rendu
 * @param camera {ENGINE.Camera} la camera filmant la scène
 * @constructor
 */
ENGINE.Scene = function(camera) {
    this.shapes = [];

    this.camera = camera || new ENGINE.Camera().setPositionRotation(new ENGINE.Vec3(0, 0, 0), new ENGINE.Euler(0, 0, 0));

    this.mMatrixArray = [];
    this.mMatrix = new ENGINE.Mat4();

    ENGINE.GL.clearColor(0.0, 0.0, 0.0, 1.0);
    ENGINE.GL.enable(ENGINE.GL.DEPTH_TEST);
};

ENGINE.Scene.prototype = {
    constructor: ENGINE.Scene,

    /**
     * Dessine la scène avec les éléments qui la
     * compose
     */
    drawScene: function () {
        var GL = ENGINE.GL;
        GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        for(let shape of this.shapes) {
            shape.renderShape(this);
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
        var mvpMatrix = this.camera.getPerspectiveViewMatrix().multiply(this.mMatrix);
        ENGINE.GL.uniformMatrix4fv(ENGINE.shaderProgram.mvpMatrixUniform, false, mvpMatrix.data);
    },

    /**
     * Ajoute une forme à la scène
     * @param shape {ENGINE.Shape|ENGINE.Box} la forme à ajouter
     */
    addShape: function (shape) {
        this.shapes.push(shape);
    }
};