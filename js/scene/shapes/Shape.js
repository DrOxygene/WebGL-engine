/**
 * Construit une forme géométrique
 * @param geometry {ENGINE.CubeGeometry} les données (vertex) de la forme
 * @param [position] {ENGINE.Vec3} la position
 * @param [rotation] {ENGINE.Euler} la rotation
 * @constructor
 */
ENGINE.Shape = function(geometry, position, rotation) {
    this.geometry = geometry;
    this.position = position || new ENGINE.Vec3();
    this.eRotation = rotation || new ENGINE.Euler();
    this.qRotation = new ENGINE.Quat().fromEuler(this.eRotation);
};

ENGINE.Shape.prototype = {
    constructor: ENGINE.Shape,

    /**
     * Affiche la forme
     * @param scene {ENGINE.Scene} la scène de rendu
     */
    renderShape: function(scene) {
        var vertexPositionBuffer = this.geometry.vertexPositionBuffer;
        var vertexIndexBuffer = this.geometry.vertexIndexBuffer;
        var vertexNormalBuffer = this.geometry.vertexNormalBuffer;

        GL.bindBuffer(GL.ARRAY_BUFFER, vertexPositionBuffer);
        GL.vertexAttribPointer(ENGINE.shaderProgram["vertexPositionAttribute"], vertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

        if(ENGINE.isEnabled(ENGINE.LIGHT_MASK)) {
            GL.bindBuffer(GL.ARRAY_BUFFER, vertexNormalBuffer);
            GL.vertexAttribPointer(ENGINE.shaderProgram["vertexNormalAttribute"], vertexNormalBuffer.itemSize, GL.FLOAT, false, 0, 0);
        }

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

        scene.pushMatrix();
        scene.mMatrix.translate(this.position);
        scene.mMatrix.rotateFromQuaternion(this.qRotation);
        scene.mMatrix.scale([this.width, this.height, this.depth]);
        GL.drawElements(GL.TRIANGLES, vertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
        scene.setMVPMatrix();
        scene.popMatrix();
    },

    /**
     * Pivote la forme
     * @param rot {ENGINE.Euler} rotation eulerienne
     */
    rotate: function(rot) {
        this.eRotation.add(rot);
        this.qRotation.fromEuler(this.eRotation);
    }
};