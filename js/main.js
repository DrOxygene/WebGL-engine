var GL;
var canvas;
var shaderProgram;
var scene;
var keyPressed = [];
var dragData = {};
var toRad = Math.PI / 180;
var camera;

// FPS
var start, fps = 0;

function init() {
    canvas = document.getElementById("canvas");
    ENGINE.enableOption(ENGINE.FRAGMENT_LIGHT_MASK);
    //ENGINE.enableOption(ENGINE.TEXTURE_MASK);
    ENGINE.init(canvas);

    camera = new ENGINE.Camera("perspective");
    scene = new ENGINE.Scene(camera);

    var randX, randY, randZ;
    var mat = new ENGINE.Material().bindDiffuse("img/metalic_diffuse.png", 2).bindNormal("img/metalic_normal.png", 2);

    for(var i = 0; i < 200; i++) {
        randX = Math.random() * 5 - 2.5;
        randY = Math.random() * 5 - 2.5;
        randZ = Math.random() * 5 + 2.5;

        var box = new ENGINE.Box(new ENGINE.Vec3(randX, randY, randZ), new ENGINE.Euler(0, 0, 0), 0.2, 0.2, 0.2);
        box.bindMaterial(mat);
        scene.addShape(box);
    }

    camera.setPositionRotation(new ENGINE.Vec3(), new ENGINE.Euler());

    for(var j = 0; j < 8; j++) {
        randX = Math.random() * 5 - 2.5;
        randY = Math.random() * 5 - 2.5;
        randZ = Math.random() * 5 + 2.5;

        var randR = Math.random();
        var randG = Math.random();
        var randB = Math.random();

        var light = new ENGINE.Light(new ENGINE.Vec3(randX, randY, randZ), new ENGINE.Color(randR, randG, randB, 1.0), 1.0);
        scene.addLight(light);
    }

    /*camera = new ENGINE.Camera("perspective");
    camera.setPositionRotation(new ENGINE.Vec3(0.0, 0.0, 0.0), new ENGINE.Euler());
    scene = new ENGINE.Scene(camera);

    var pos1 = new ENGINE.Vec3(0, 0, 1);
    var pos2 = new ENGINE.Vec3(0.75, 0, 1);

    var rot1 = new ENGINE.Euler(0, 0.3, 0.0);
    var rot2 = new ENGINE.Euler(0, 0, 0.75);

    var mat1 = new ENGINE.Material().bindDiffuse("img/metalic_diffuse.png", 2).bindNormal("img/metalic_normal.png", 2);

    var b1 = new ENGINE.Box(pos1, rot1, 0.2, 0.2, 0.2);
    var b2 = new ENGINE.Box(pos2, rot2, 0.3, 0.3, 0.3);
    b1.bindMaterial(mat1);
    b2.bindMaterial(mat1);
    scene.addShape(b1);
    scene.addShape(b2);

    var lpos = new ENGINE.Vec3(0, 0, 0.0);
    var lcol = new ENGINE.Color(1.0, 1.0, 1.0, 1.0);
    var l = new ENGINE.Light(lpos, lcol, 2.0);
    scene.addLight(l);*/

    initEvents();

    start = Date.now();
    loop();
}

function initEvents() {
    document.addEventListener("keydown", function(e) {
        if(((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 97 || e.keyCode == 98) && keyPressed.indexOf(e.keyCode) == -1) keyPressed.push(e.keyCode);
    }, false);

    document.addEventListener("keyup", function(e) {
        if((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 97 || e.keyCode == 98) keyPressed.splice(keyPressed.indexOf(e.keyCode), 1);
    }, false);

    canvas.onmousedown = function(e) {
        dragData["mousePressed"] = true;
        dragData["ox"] = e.clientX;
        dragData["oy"] = e.clientY;
        dragData["dx"] = 0;
        dragData["dy"] = 0;
    };

    canvas.onmouseup = function(e) {
        dragData["mousePressed"] = false;
        dragData["dx"] = 0;
        dragData["dy"] = 0;
    };

    canvas.onmousemove = function(e) {
        if(dragData["mousePressed"]) {
            dragData["dx"] = e.clientX - dragData["ox"];
            dragData["dy"] = e.clientY - dragData["oy"];
            dragData["ox"] = e.clientX;
            dragData["oy"] = e.clientY;
        }
    };

    canvas.onmouseout = function(e) {
        dragData["mousePressed"] = false;
    }
}

function loop() {
    countFPS();

    handleKeyboardEvent();
    handleMouseDrag();

    dragData["dx"] = 0;
    dragData["dy"] = 0;

    scene.drawScene();

    for(var shape of scene.shapes) shape.rotate(new ENGINE.Euler(0.0025, 0.0025, 0.0025));
    window.requestAnimationFrame(loop);
}

function countFPS() {
    fps++;
    if(Date.now() - start >= 1000) {
        document.getElementById("output").innerHTML = "" + fps;
        fps = 0;
        start = Date.now();
    }
}

/**
 * Execute les actions qui découlent des touches du clavier activées
 */
function handleKeyboardEvent() {
    for(var key of keyPressed) {
        if(key == 97 || key == 98) {
            var dy = -((key - 97.5) * 0.05);
            camera.translate(new ENGINE.Vec3(0, dy, 0));
        } else {
            var dz = -((key - 39) % 2) * 0.025;
            var dx = ((key - 38) % 2) * 0.025;

            camera.translate(new ENGINE.Vec3(dx, 0, dz));
        }
    }
}

/**
 * Execute les actions qui découlent des drag effectués par les souris
 */
function handleMouseDrag() {
    if(dragData["mousePressed"]) {
        var yaw = dragData["dx"] * toRad * 0.35;
        var pitch = dragData["dy"] * toRad * 0.35;

        camera.rotate(new ENGINE.Euler(yaw, pitch, 0));
    }
}