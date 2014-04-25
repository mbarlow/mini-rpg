/**
 * Clouds!
 * @param game
 * @constructor
 */
function Cloud(game) {
    this.name = 'cloud';
    Entity.call(this, game);
    this.pos = new THREE.Vector3(rndInt(256), 15 + roll(3), rndInt(256));
    this.destination = new THREE.Vector3(256, this.pos.y, this.pos.z);
    this.speed = 5;
}


Cloud.prototype = new Entity();
Cloud.prototype.constructor = Cloud;


Cloud.prototype.update = function() {
    if (this.pos.x > 256) {
        this.pos.x = -256;
    }
    Entity.prototype.update.call(this);
};


Cloud.prototype.create = function() {
    if (objects['cloud']) {
        objects['cloud'].scale.set(roll(10) + 2, 3, roll(5) + 2);
        objects['cloud'].castShadow = true;
        this.mesh = objects['cloud'].clone();
        this.mesh.name = 'cloud';
    }
};