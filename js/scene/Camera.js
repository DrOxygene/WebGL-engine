/**
 * Créée une camera
 * @param type {String} type de camera : ortho ou perspective
 */
ENGINE.Camera = function(type) {
    this.position = new ENGINE.Vec3();
    this.eRotation = new ENGINE.Euler();
    this.qRotation = new ENGINE.Quat().fromEuler(this.eRotation);

    this.vMatrix = new ENGINE.Mat4();

    if(type == "ortho") {
        var w = GL.viewportWidth / 100;
        var h = GL.viewportHeight / 100;
        this.pMatrix = new ENGINE.Mat4().ortho(-w, w, -h, h, 1, 100);
    } else if(type == "perspective") this.pMatrix = new ENGINE.Mat4().perspective(Math.PI / 2, GL.viewportWidth / GL.viewportHeight, -0.01, 1);
};

ENGINE.Camera.prototype = {
    constructor: ENGINE.Camera,

    /**
     * Définie la rotation de la camera
     * @param pos {ENGINE.Vec3} position de la camera
     * @param rot {ENGINE.Euler} rotation de la camera
     */
    setPositionRotation: function(pos, rot) {
        this.position = pos;
        this.eRotation = rot;
        this.qRotation.fromEuler(this.eRotation);
        return this;
    },

    /**
     * Pivote la camera
     * @param rot {ENGINE.Euler} rotation
     */
    rotate: function (rot) {
        this.eRotation.add(rot);
        this.eRotation.restrictRotation();
        this.qRotation.fromEuler(this.eRotation);
    },

    /**
     * Translate la camera
     * @param trans {ENGINE.Vec3} translation
     */
    translate: function (trans) {
        this.position.add(ENGINE.Vec3.quatTransform(trans, this.qRotation));
    },

    /**
     * Retourne la matrice de perspective
     * @returns {ENGINE.Mat4}
     */
    getPerspectiveMatrix: function () {
        return this.pMatrix.clone();
    },

    /**
     * Retourne la matrice de vue
     * @returns {ENGINE.Mat4}
     */
    getViewMatrix: function () {
        return this.vMatrix.setTranslation(this.position).rotateFromQuaternion(this.qRotation).inverse().clone();
    }
};