var ENGINE = {};
var GL;
var PIUNDER2 = Math.PI / 2;

ENGINE.init = function(canvas) {
    ENGINE.initGL(canvas);
};

// TODO implémenter des variables sur le type de rendu voulu (ombre, lumière, ...)
