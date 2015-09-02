/**
 * Construit un vecteur en 3 dimmension
 * @param x
 * @param y
 * @param z
 * @constructor
 */
ENGINE.Vec3 = function Vec3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

ENGINE.Vec3.prototype = {
    /**
     * Définie les nouvelles coordonnées du vecteur
     * @param x
     * @param y
     * @param z
     * @returns {ENGINE.Vec3}
     */
    set:function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    /**
     * Retourne l'abscisse du vecteur
     * @returns {number}
     */
    getX: function () {
        return this.x;
    },

    /**
     * Retourne l'ordonnée du vecteur
     * @returns {number}
     */
    getY: function () {
        return this.y;
    },

    /**
     * Retourne la profondeur du vecteur
     * @returns {number}
     */
    getZ: function () {
        return this.z;
    },

    /**
     * Ajoute les coordonnées d'un vecteur à celui-ci
     * @param vec
     * @returns {ENGINE.Vec3}
     */
    add: function (vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    },

    /**
     * Soustrait les coordonnées d'un vecteur à celui-ci
     * @param vec
     * @returns {ENGINE.Vec3}
     */
    sub: function (vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    },

    /**
     * Multiplie les coordonnées du vecteur par un scalaire
     * @param scalar
     * @returns {ENGINE.Vec3}
     */
    multiply: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    },

    /**
     * Divise les coordonnées du vecteur par un scalaire
     * @param scalar
     * @returns {ENGINE.Vec3}
     */
    divide: function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    },

    /**
     * Réalise le produit scalaire
     * @param vec
     * @returns {number}
     */
    dot: function (vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    },

    /**
     * Donne la longueur du vecteur
     * @returns {number}
     */
    length: function () {
        return Math.sqrt(this.dot(this));
    },

    /**
     * Normalise le vecteur
     * @returns {ENGINE.Vec3}
     */
    normalize: function () {
        return this.divide(this.length());
    }
}


/**
 * Réalise le produit vectoriel de deux vecteurs
 * @param vec1
 * @param vec2
 * @returns {ENGINE.Vec3}
 */
function cross(vec1, vec2) {
    return new Vec3(vec1.y * vec2.z - vec2.y * vec1.z, vec1.z * vec2.x - vec2.z * vec1.x, vec1.x * vec2.y - vec2.x * vec1.y);
}