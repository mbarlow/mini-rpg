var MiniRPG = new GameEngine();
var loader = new THREE.JSONLoader();
var objects   = {};
var heightMap = Terrain.allocateHeightMap(128, 128);

var TREES = 300;
var ROCKS = 0;
var BIRDS = 25;
var RABBITS = 25;
var CLOUDS = 15;
var MOBS = 1;
var MAX = 2000;


window.onload = function () {
    var assets = new AssetManager();
    assets.loadMeshes(MESHES, function () {
        MiniRPG.init();
        MiniRPG.start();
        MiniRPG.plantTrees();
        MiniRPG.dropRocks();

        for (var i = 0; i < 1; i++) {
            for (var t = 0; t < 500; t++) {
                var rndPoint = new THREE.Vector3(rndInt(MAX), 0, rndInt(MAX));
                MiniRPG.place(rndPoint);
                if (rndPoint.y > 1) {
                    break;
                }
            }
            MiniRPG.addEntity(new Mine(MiniRPG, {pos: rndPoint}));

            for (var t = 0; t < 500; t++) {
                var rndPoint = new THREE.Vector3(rndInt(MAX), 0, rndInt(MAX));
                MiniRPG.place(rndPoint);
                if (rndPoint.y > 1) {
                    break;
                }
            }
            MiniRPG.addEntity(new Village(MiniRPG, {pos: rndPoint}));
            MiniRPG.camera.position = rndPoint.clone();
            MiniRPG.camera.position.y += 200;
        }

        for (var i = 0; i < MOBS; i++) {
            MiniRPG.addEntity(new Mob(MiniRPG));
        }
    });
};
