var MiniRPG = new GameEngine();
var loader = new THREE.JSONLoader();
var objects   = {};
var heightMap = Terrain.allocateHeightMap(128,128);

var TREES = 500;
var BIRDS = 10;
var RABBITS = 0;
var CLOUDS = 15;
var MOBS = 1;


window.onload = function () {
    var assets = new AssetManager();
    assets.loadMeshes(MESHES, function () {
        MiniRPG.init();
        MiniRPG.start();
        MiniRPG.plantTrees();

        for (var i = 0; i < MOBS; i++) {
            MiniRPG.addEntity(new Mob(MiniRPG));
        }

        for (var i = 0; i < 1; i++) {
            var rndPoint = new THREE.Vector3(rndInt(128), 0, rndInt(128));
            MiniRPG.place(rndPoint);
            MiniRPG.addEntity(new Mine(MiniRPG, {pos: rndPoint}));

            var rndPoint = new THREE.Vector3(rndInt(128), 0, rndInt(128));
            MiniRPG.place(rndPoint);
            MiniRPG.addEntity(new Village(MiniRPG, {pos: rndPoint}));
        }
    });
};
