/**
 * Créée un lumière de la couleur à la position indiquée
 * @param [position] {ENGINE.Vec3} position
 * @param [color] {ENGINE.Color} couleur
 * @constructor
 */
ENGINE.Light = function(position, color) {
    this.position = position || new ENGINE.Vec3();
    this.color = color || new ENGINE.Color();
};