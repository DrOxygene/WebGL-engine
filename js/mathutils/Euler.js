/**
 * Créée un angle eulerien
 * @param yaw {number} cap
 * @param pitch {number} tanguage
 * @param roll {number} roulis
 * @constructor
 */
ENGINE.Euler = function(yaw, pitch, roll) {
    this.yaw = yaw || 0;
    this.pitch = pitch || 0;
    this.roll = roll || 0;
};

ENGINE.Euler.prototype = {
    constructor: ENGINE.Euler,

    /**
     * Additionne deux angles eulériens
     * @param euler {ENGINE.Euler} seconde opérande
     * @returns {ENGINE.Euler}
     */
    add: function (euler) {
        this.yaw += euler.yaw;
        this.pitch += euler.pitch;
        this.roll += euler.roll;
        return this;
    },

    /**
     * Restreint la rotation à :
     * 2PI pour le cap
     * PI/2 et -PI/2 pour le tanguage
     * 2PI pour le roulis
     */
    restrictRotation: function () {
        this.yaw = this.yaw % (Math.PI * 2);
        this.pitch = Math.max(-PIUNDER2, Math.min(PIUNDER2, this.pitch));
        this.roll = this.roll % (Math.PI * 2);
    },

    /**
     * Affiche l'angle
     * @returns {string}
     */
    toString: function () {
        return this.yaw + " " + this.pitch + " " + this.roll;
    }
};