/**
 * Clouds!
 * @param game
 * @constructor
 */
function Cloud(game) {
    this.name = 'cloud';
    Entity.call(this, game);
    this.pos = new THREE.Vector3(rndInt(MAX), 150 + roll(3), rndInt(MAX));
    this.destination = new THREE.Vector3(MAX, this.pos.y, this.pos.z);
    this.speed = 50;
}


Cloud.prototype = new Entity();
Cloud.prototype.constructor = Cloud;


Cloud.prototype.update = function() {
    if (this.pos.x > MAX/2) {
        this.pos.x = -MAX/2;
    }
    Entity.prototype.update.call(this);
};


Cloud.prototype.create = function() {
    if (objects['cloud']) {
        objects['cloud'].scale.set(roll(100) + 50, 30, roll(50) + 50);
        objects['cloud'].castShadow = true;
        this.mesh = objects['cloud'].clone();
        this.mesh.name = 'cloud';
    }
};