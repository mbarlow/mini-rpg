var rabbitModel = (function(){
    var geometry = new THREE.BoxGeometry(1, 1, 2.5);
    var material = new THREE.MeshLambertMaterial({ color: 0x777777, shading: THREE.SmoothShading, vertexColors: THREE.FaceColors });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    for (var i = 0; i < mesh.geometry.vertices.length; i++) {
        mesh.geometry.vertices[i].y += 1;
    }
    mesh.scale.set(0.25,0.25,0.25)
    return mesh;
})();

function Rabbit(game) {
    this.name = 'rabbit';
    Entity.call(this, game);
    this.pos = new THREE.Vector3(rndInt(200), 0, rndInt(200));
    this.destination = this.pos.clone();
    this.health = 5;
    this.speed = 10 + rndInt(10);
    this.state = this.game.machine.generate(rabbitJson, this, Rabbit.states);
}


Rabbit.prototype = new Entity();
Rabbit.prototype.constructor = Rabbit;


Rabbit.prototype.update = function() {
    this.game.place(this.pos);
    this.state = this.state.tick();
    Entity.prototype.update.call(this);
};


Rabbit.prototype.create = function() {
  this.mesh = rabbitModel.clone();
};


Rabbit.prototype.attacked = function() {
    this.health -= roll(6);
    if (this.health <= 0) {
        this.speed = 0;
        this.remove = true;
    }
    this.speed = 140;
};


Rabbit.states = {
    idle: function() {console.log('idle')},
    getRandomDestination: function() {
        var rndPoint = new THREE.Vector3(rndInt(128), 0, rndInt(128));
        this.game.place(rndPoint);
        if (rndPoint.y > 5) {
            this.destination = rndPoint;
        }
    },
    canExplore: function() {
        return Math.random() > 0.99 && !this.remove && this.health > 0;
    },
    sleep: function() {}
};


var rabbitJson = {
    id: "idle", strategy: "prioritised",
    children: [
        { id: "explore", strategy: "sequential",
            children: [
                { id: "getRandomDestination" }
            ]
        }
    ]
};
