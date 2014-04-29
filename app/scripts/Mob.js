function Mob(game) {
    this.name = 'mob';
    this.vision = 30;
    Entity.call(this, game);
    this.pos = this.game.getCloseEntity("village", this.pos, MAX).pos.clone();
    this.destination = this.pos.clone();
    this.target = null;
    this.speed = 150;
    this.log = false;
    this.fps = false;
    this.state = this.game.machine.generate(mobJson, this, Mob.states);
    this.carryEntity = undefined;
    this.shootCooldown = 10;
}


Mob.prototype = new Entity();
Mob.prototype.constructor = Mob;


Mob.prototype.update = function () {
    this.game.place(this.pos);
    this.shootCooldown--;

    this.state = this.state.tick();
    // Mob is carrying a resource.
    if (this.carryEntity) {
        this.carryEntity.pos.x = this.pos.x - 4;
        this.carryEntity.pos.y = this.pos.y;
        this.carryEntity.pos.z = this.pos.z - 4;
    }
    Entity.prototype.update.call(this);
    if (this.fps) {
        this.game.cameraFPS.lookAt(this.destination);
    }
};


Mob.prototype.create = function () {
    var mob = new THREE.Object3D();
    var geometry = new THREE.BoxGeometry(1, 2, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0xecc2a7, shading: THREE.SmoothShading });
    var body = new THREE.Mesh(geometry, material);
    for (var i = 0; i < body.geometry.vertices.length; i++) {
        body.geometry.vertices[i].y += 1.5;
    }
    body.castShadow = true;
    var circleGeometry = new THREE.CircleGeometry(this.vision, 6);
    var circle = new THREE.Mesh(circleGeometry, new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, wireframe: true, opacity: 0.75}));
    circle.rotateX(-Math.PI / 2);
    mob.add(body);
    mob.add(circle);
    this.mesh = mob;
    this.mesh.name = this.name;
};


Mob.prototype.carry = function ( entity ) {
    if (entity.name !== 'rabbit') {
        if (entity.units > 0) {
            entity.units -= 1;
            var resource = new Resource(this.game, entity.name, this.pos.clone());
            this.game.addEntity(resource);
            this.carryEntity = resource;
        }
    } else {
        this.carryEntity = entity;
    }
};


Mob.prototype.drop = function () {
    console.log('drop')
    if (this.carryEntity) {
        this.carryEntity.pos = new THREE.Vector3(this.pos.x, 0, this.pos.z);
        this.carryEntity = undefined;
    }

    if (this.prey) {
        this.prey = undefined;
    }
};


Mob.prototype.shoot = function(destination) {
    if (this.shootCooldown <= 0) {
        this.game.addEntity(
            new Arrow(
                this.game,
                {
                    pos: this.pos.clone(),
                    destination: destination,
                    lifeSpan: 300,
                    speed: 600,
                    offset: 10
                }
            )
        );
        this.shootCooldown = 10;
    }
};


Mob.prototype.getPrey = function() {
    var rabbit = this.game.getCloseEntity("rabbit", this.pos, MAX/3);
    //var bird = this.game.getCloseEntity("bird", this.pos, this.vision);
    //var prey = [rabbit, bird];
    //this.prey = prey[roll(2)];
    this.prey = rabbit;
};


Mob.prototype.hasPrey = function() {
    if (this.prey) {
        return true;
    }
    return false;
}


Mob.prototype.track = function() {
    this.destination = this.prey.pos.clone();
};


Mob.prototype.goRandom = function() {
    var rndPoint = new THREE.Vector3(rndInt(MAX), 0, rndInt(MAX));
    this.game.place(rndPoint);
    if (rndPoint.y > 5) {
        this.destination = rndPoint;
    }


};


Mob.prototype.attack = function() {
    this.shoot(this.prey.pos.clone());
    if (roll(5) === 1) {
        this.prey.attacked();
    }
};

Mob.prototype.goMine = function() {
    var mine = this.game.getCloseEntity("mine", this.pos, this.vision);
    this.destination = mine.pos.clone();
};


var mobJson = {
    id: "idle", strategy: "prioritised",
    children: [
        { id: "explore", strategy: "sequential",
            children: [
                //{ id: "getRandomDestination" },
                { id: "hunt", strategy: "sequential",
                    children: [
                        { id: "getPrey" },
                        { id: "trackPrey"},
                        { id: "attack" },
                        { id: "getKill" },
                        { id: "deliverKill" },
                        { id: "dropKill"}
                    ]
                }
//                { id: "mine", strategy: "sequential",
//                    children: [
//                        { id: "goToMine" },
//                        { id: "mine"},
//                        { id: "deliverResource" },
//                        { id: "dropResource"}
//                    ]
//                }
            ]
        }
    ]
};


Mob.states = {
    idle: function() { },
    explore: function() { },
    hunt: function() { },
    mine: function() { },
    getRandomDestination: function() {
        this.goRandom();
    },
    canGetRandomDestination: function() {
        return Math.random() > 0.95 && this.destination.distanceTo(this.pos) < 10;
    },
    canExplore: function() {
        return Math.random() > 0.95 && !this.carryEntity;
    },
    canHunt: function() {
        return !this.carryEntity;
    },
    canMine: function() {
        return !this.carryEntity;
    },
    getPrey: function() {
        if (!this.hasPrey()) {
            this.getPrey();
        }
    },
    canGetPrey: function() {
        return !this.hasPrey() && !this.carryEntity;
    },
    trackPrey: function() {
        this.track();
    },
    canTrackPrey: function() {
        return this.hasPrey();
    },
    attack: function() {
        this.attack();
    },
    canAttack: function() {
        return this.hasPrey() && this.prey.pos.distanceTo(this.pos) < 500 && this.prey.health > 0;
    },
    getKill: function() {
        this.destination = this.prey.pos.clone();
    },
    canGetKill: function() {
        return this.hasPrey() && this.prey.health <= 0 && !this.carryEntity;
    },
    deliverKill: function() {
        this.carry(this.prey);
        this.destination = this.game.getCloseEntity("village", this.pos, MAX).pos.clone();
    },
    canDeliverKill: function() {
        return this.hasPrey() && this.prey.pos.distanceTo(this.pos) < 50 && this.prey.health <= 0;
    },
    dropKill: function() {
        this.drop();
    },
    canDropKill: function() {
        return this.hasPrey() && this.prey.health <= 0 && this.carryEntity && this.game.getCloseEntity("village", this.pos, 1500).pos.distanceTo(this.pos) < 100;
    }
};
