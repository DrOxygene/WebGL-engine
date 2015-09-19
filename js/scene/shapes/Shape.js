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
        var vertexTextureCoordBuffer = this.geometry.vertexTextureCoordBuffer;

        GL.bindBuffer(GL.ARRAY_BUFFER, vertexPositionBuffer);
        GL.vertexAttribPointer(ENGINE.shaderProgram["vertexPositionAttribute"], vertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

        if(ENGINE.isEnabled(ENGINE.TEXTURE_MASK)) {
            GL.bindBuffer(GL.ARRAY_BUFFER, vertexTextureCoordBuffer);
            GL.vertexAttribPointer(ENGINE.shaderProgram["vertexTextureCoordAttribute"], vertexTextureCoordBuffer.itemSize, GL.FLOAT, false, 0, 0);

            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, this.material.diffuse);
            GL.uniform1i(ENGINE.shaderProgram["textureDiffuseUniform"], 0);

            if(this.material.normal) {
                GL.activeTexture(GL.TEXTURE1);
                GL.bindTexture(GL.TEXTURE_2D, this.material.normal);
                GL.uniform1i(ENGINE.shaderProgram["textureNormalUniform"], 1);
            }
        }

        GL.bindBuffer(GL.ARRAY_BUFFER, vertexNormalBuffer);
        GL.vertexAttribPointer(ENGINE.shaderProgram["vertexNormalAttribute"], vertexNormalBuffer.itemSize, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

        scene.pushMatrix();
        scene.mMatrix.translate(this.position);
        scene.mMatrix.rotateFromQuaternion(this.qRotation);
        scene.mMatrix.scale([this.width, this.height, this.depth]);
        GL.drawElements(GL.TRIANGLES, vertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
        scene.setMVPMatrix();
        scene.popMatrix();
    },

    // TODO fusionner plusieurs formes

    /**
     * Pivote la forme
     * @param rot {ENGINE.Euler} rotation eulerienne
     */
    rotate: function(rot) {
        this.eRotation.add(rot);
        this.qRotation.fromEuler(this.eRotation);
    },

    /**
     * Défini la texture de la forme
     * @param mat {ENGINE.Material} la texture
     */
    bindMaterial: function(mat) {
        this.material = mat;
    }
};