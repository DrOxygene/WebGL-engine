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

    var GL = ENGINE.GL;

    this.vertexColorBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexColorBuffer);
    var colors = [
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [1.0, 0.5, 0.5, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [0.0, 0.0, 1.0, 1.0]
    ];
    var unpackedColors = [];
    for (var i in colors) {
        var color = colors[i];
        for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
        }
    }
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(unpackedColors), GL.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = 24;
};

ENGINE.Box.prototype = Object.create(ENGINE.Shape.prototype);
ENGINE.Box.constructor = ENGINE.Box;

/**
 * Affiche la boite
 * @param scene {ENGINE.Scene} la scène d'affichage
 */
ENGINE.Box.prototype.renderShape = function(scene) {
    //TODO voir si code redondant dans les autre classes de formes, pour les regrouper dans la classe shape
    var GL = ENGINE.GL;
    var vertexPositionBuffer = ENGINE.GeometryUtils.getCubeVertexPosition();
    var vertexIndexBuffer = ENGINE.GeometryUtils.getCubeVertexIndex();

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexPositionBuffer);
    GL.vertexAttribPointer(ENGINE.shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexColorBuffer);
    GL.vertexAttribPointer(ENGINE.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    scene.pushMatrix();
        scene.mMatrix.translate(this.position);
        scene.mMatrix.rotateFromQuaternion(this.qRotation);
        scene.mMatrix.scale([this.width, this.height, this.depth]);
        GL.drawElements(GL.TRIANGLES, vertexIndexBuffer.numItems, GL.UNSIGNED_SHORT, 0);
        scene.setMVPMatrix();
    scene.popMatrix();
};