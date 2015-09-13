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
    ENGINE.Shape.call(this, new ENGINE.CubeGeometry(), position, rotation);
    this.width = width;
    this.height = height;
    this.depth = depth;
};

ENGINE.Box.prototype = Object.create(ENGINE.Shape.prototype);
ENGINE.Box.constructor = ENGINE.Box;