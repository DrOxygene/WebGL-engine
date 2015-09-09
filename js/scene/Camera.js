/**
 * Créée une camera
 */
ENGINE.Camera = function() {
    this.position = new ENGINE.Vec3();
    this.eRotation = new ENGINE.Euler();
    this.qRotation = new ENGINE.Quat().fromEuler(this.eRotation);

    this.vMatrix = new ENGINE.Mat4();
    this.pMatrix = new ENGINE.Mat4().perspective(Math.PI / 2, ENGINE.GL.viewportWidth / ENGINE.GL.viewportHeight, -0.01, 1); // TODO changer le type de camera grâce aux paramètres de la classe ENGINE
};

ENGINE.Camera.prototype = {

    /**
     * Définie la rotation de la camera
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
     * Retourne la matrice de vue-perspective
     * @returns {ENGINE.Mat4}
     */
    getPerspectiveViewMatrix: function () {
        this.vMatrix.setTranslation(this.position).rotateFromQuaternion(this.qRotation);
        return this.pMatrix.clone().multiply(this.vMatrix.inverse());
    }
};