/**
 * Créée une couleur
 * @param [r] {number} rouge
 * @param [g] {number} vert
 * @param [b] {number} bleu
 * @param [a] {number} transparence
 * @constructor
 */
ENGINE.Color = function(r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;
};

ENGINE.Color.prototype = {
    /**
     * Affiche la couleur
     * @returns {string}
     */
    toString: function () {
        return "[r:" + this.r + ", g:" + this.g + ", b:" + this.b + ", a:" + this.a + "]";
    }
}