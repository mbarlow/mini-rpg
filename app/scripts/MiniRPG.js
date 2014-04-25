var MiniRPG = new GameEngine();
var loader = new THREE.JSONLoader();
var objects   = {};
var heightMap = Terrain.allocateHeightMap(96,96);

var TREES = 250;
var BIRDS = 10;
var RABBITS = 10;
var CLOUDS = 15;
var MOBS = 10;


window.onload = function () {
    var assets = new AssetManager();
    assets.loadMeshes(MESHES, function () {
        MiniRPG.init();
        MiniRPG.start();
        MiniRPG.plantTrees();



        for (var i = 0; i < 1; i++) {
            for (var t = 0; t < 500; t++) {
                var rndPoint = new THREE.Vector3(rndInt(128), 0, rndInt(128));
                MiniRPG.place(rndPoint);
                if (rndPoint.y > 1) {
                    break;
                }
            }
            MiniRPG.addEntity(new Mine(MiniRPG, {pos: rndPoint}));

            for (var t = 0; t < 500; t++) {
                var rndPoint = new THREE.Vector3(rndInt(128), 0, rndInt(128));
                MiniRPG.place(rndPoint);
                if (rndPoint.y > 1) {
                    break;
                }
            }
            MiniRPG.addEntity(new Village(MiniRPG, {pos: rndPoint}));
        }

        for (var i = 0; i < MOBS; i++) {
            MiniRPG.addEntity(new Mob(MiniRPG));
        }
    });
};
