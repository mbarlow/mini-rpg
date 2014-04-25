
function GameEngine() {
    this.entityId = 0;
    this.fps = false;
    this.paused = false;
    this.entities = {};
    this.clock = new THREE.Clock();
    this.delta = 0;
    this.elapsed = 0;
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
    this.camera.position.y = 50;
    this.camera.position.z = 100;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.cameraFPS = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 5000 );
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true, maxLights: 100, alpha: true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.gammaInput             = true;
    this.renderer.gammaOutput            = true;
    this.renderer.physicallyBasedShading = true;
    this.renderer.shadowMapEnabled       = true;
    this.renderer.shadowMapCullFace      = THREE.CullFaceBack;
    this.renderer.shadowMapAutoUpdate    = true;
    this.renderer.shadowMapType          = THREE.PCFSoftShadowMap;
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    document.body.appendChild( this.renderer.domElement );
}


GameEngine.prototype.addEntity = function(entity) {
    this.entities[this.entityId] = entity;
    entity.id = this.entityId;
    this.entityId++;
    this.scene.add(entity.mesh);
};


GameEngine.prototype.removeEntity = function(entity) {
    this.entities[entity.id].remove = true;
    this.scene.remove(entity.mesh);
};


GameEngine.prototype.getCloseEntity = function(name, position, range) {
    var i, distance, entity;
    for (i in this.entities) {
        entity = this.entities[i];
        if (entity.name === name && !entity.remove) {
            distance = position.distanceTo(entity.pos);
            if (distance < range) {
                return entity;
            }
        }
    }
    return false;
};


GameEngine.prototype.loop = function() {
    this.delta = this.clock.getDelta();
    this.update();
};


GameEngine.prototype.update = function() {
    var i, entity;
    for (i in this.entities) {
        entity = this.entities[i];
        if (!entity.remove) {
            entity.update();
        }
    }
    this.controls.update();
    if (this.trackingEntity) {
        this.cameraFPS.position = this.trackingEntity.pos.clone();
        this.cameraFPS.position.y += 1.5;
        this.cameraFPS.position.x -= 2;
        this.cameraFPS.position.z -= 2;
        this.cameraFPS.lookAt(this.trackingEntity.pos);
    }
};


GameEngine.prototype.init = function() {
    console.log('MiniRPG init!');

    this.machine = new Machine();
    this.terrain = new Level();
    this.scene.add(this.terrain.generate());

    for (var i = 0; i < RABBITS; i++) {
        this.addEntity(new Rabbit(this));
    }
    for (var i = 0; i < CLOUDS; i++) {
        this.addEntity(new Cloud(this));
    }

    for (var i = 0; i < BIRDS; i++) {
        this.addEntity(new Bird(this));
    }

    this.initLighting();
};


GameEngine.prototype.start = function() {
    console.log('MiniRPG is go!');
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimationFrame(gameLoop);
        if (!that.fps) {
            that.renderer.render( that.scene, that.camera );
        } else {
            that.renderer.render( that.scene, that.cameraFPS );

        }
        that.elapsed = that.clock.getElapsedTime();
    })();
};

GameEngine.prototype.initLighting = function () {
    var d = 500;
    var ambient = new THREE.AmbientLight(0x111111);
    var dirLight = new THREE.DirectionalLight(0xffffcc, 0.5, 500);
    var hemiLight = new THREE.HemisphereLight(0xffffcc, 0xffffcc, 0.6);
    var pointLight = new THREE.PointLight(0xffffcc);

    // light for shadows
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(100);
    dirLight.position = this.camera.position;
    dirLight.castShadow = true;
    dirLight.shadowMapWidth = 2048;
    dirLight.shadowMapHeight = 2048;
    dirLight.shadowCameraLeft = -d;
    dirLight.shadowCameraRight = d;
    dirLight.shadowCameraTop = d;
    dirLight.shadowCameraBottom = -d;
    dirLight.shadowCameraFar = 3500;
    dirLight.shadowBias = -0.0001;
    dirLight.shadowDarkness = 0.35;

    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 300, 0);

    pointLight.intensity = 0.75;
    pointLight.position = new THREE.Vector3(100, 80, -100);

    this.scene.add(dirLight);
    //this.scene.add(ambient);
    this.scene.add(hemiLight);
    this.scene.add(pointLight);
};


GameEngine.prototype.pause = function () {
    this.paused = this.paused ? false : true;
};


GameEngine.prototype.getEntity = function (id) {
    return this.entities[id] || false;
};


GameEngine.prototype.plantTrees = function() {
    for (var i = 0; i < TREES; i++) {
        for (var t = 0; t < 500; t++) {
            var rndPoint = new THREE.Vector3(rndInt(200), 0, rndInt(200));
            this.place(rndPoint);
            if (rndPoint.y > 1) {
                break;
            }
        }
        this.addEntity(new Tree(MiniRPG, {pos: rndPoint}));

    }
};


GameEngine.prototype.place = function(position) {
    position.y = Terrain.planeToHeightMapCoords(heightMap, MiniRPG.scene.getObjectByName('terrain').children[0], position.x, position.z)
};


GameEngine.prototype.switchCam = function() {
    if (this.fps) {
        this.fps = false;
        this.trackingEntity = undefined;
    } else {
        var mob = this.getCloseEntity('mob', new THREE.Vector3(0, 0, 0), 2000);
        mob.fps = true;
        mob.log = true;
        this.fps = true;
        this.trackingEntity = mob;
    }
};