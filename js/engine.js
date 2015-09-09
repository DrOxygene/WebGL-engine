var ENGINE = {};
var PIUNDER2 = Math.PI / 2;

ENGINE.init = function(canvas) {
    ENGINE.initGL(canvas);
    ENGINE.GeometryUtils.initGeometry();
}

// TODO implémenter des variables sur le type de rendu voulu (ombre, lumière, ...)