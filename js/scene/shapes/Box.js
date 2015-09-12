/**
 * Créée une boite de la dimension passée en paramètre
 * @param position {ENGINE.Vec3} position de la boite
 * @param rotation {ENGINE.Euler} rotation de la boite
 * @param width {number} largeur
 * @param height {number} hauteur
 * @param depth {number} profondeur
 * @constructor
 */
ENGINE.Box = function(position, rotation, width, height, depth) {
    ENGINE.Shape.call(this, position, rotation);
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.geometry = new ENGINE.CubeGeometry();
};

ENGINE.Box.prototype = Object.create(ENGINE.Shape.prototype);
ENGINE.Box.constructor = ENGINE.Box;

/**
 * Affiche la boite
 * @param scene {ENGINE.Scene} la scène d'affichage
 */
ENGINE.Box.prototype.renderShape = function(scene) {
    //TODO voir si code redondant dans les autre classes de formes, pour les regrouper dans la classe shape
    var vertexPositionBuffer = this.geometry.vertexPositionBuffer;
    var vertexIndexBuffer = this.geometry.vertexIndexBuffer;
    var vertexNormalBuffer = this.geometry.vertexNormalBuffer;

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexPositionBuffer);
    GL.vertexAttribPointer(ENGINE.shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexNormalBuffer);
    GL.vertexAttribPointer(ENGINE.shaderProgram.vertexNormalAttribute, vertexNormalBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    scene.pushMatrix();
        scene.mMatrix.translate(this.position);
        scene.mMatrix.rotateFromQuaternion(this.qRotation);
        scene.mMatrix.scale([this.width, this.height, this.depth]);
        GL.drawElements(GL.TRIANGLES, vertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
        scene.setMVPMatrix();
    scene.popMatrix();
};