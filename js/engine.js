var ENGINE = {
    OPTION: 1,
    DEFAULT_MASK: 1,
    FRAGMENT_LIGHT_MASK: 2,
    VERTEX_LIGHT_MASK: 4,

    MAX_LIGHT: 16
};

var GL;
var PIUNDER2 = Math.PI / 2;

/**
 * Initialise le moteur de rendu WebGL
 * @param canvas {HTMLCanvasElement} le canvas de dessin
 */
ENGINE.init = function(canvas) {
    var initializer = new ENGINE.WebGLProgram(canvas);
    initializer.initGL();
};

/**
 * Active une option de rendu
 * @param option {number} l'option
 */
ENGINE.enableOption = function(option) {
    ENGINE.OPTION |= option;
};

/**
 * Indique si une option est activée ou non
 * @param option {number} l'option
 * @returns {number} 1 si elle est activée, 0 sinon
 */
ENGINE.isEnabled = function(option) {
    return ENGINE.OPTION & option;
};
