function Entity(game, color) {
    this.game     = game;
    this.pos      = new THREE.Vector3(0, 0, 0);
    this.destination = new THREE.Vector3(0, 0, 0);
    this.vel      = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0);
    this.timeMult = 1;
    this.remove   = false;
    this.shadow   = false;
    this.state = null;
    this.color = color ? color : 0xffffff;
    this.create();
}


Entity.prototype.update = function () {
    var deltaX, deltaY, deltaZ;

        // rotation to target location
        deltaX = this.destination.x - this.pos.x;
        deltaY = this.destination.y - this.pos.y;
        deltaZ = this.destination.z - this.pos.z;

        var dv = new THREE.Vector3();
        dv.subVectors(this.destination, this.pos);
        dv.setLength(this.speed);
        this.vel = dv;

        this.rotation.y = (Math.atan2(deltaX, deltaZ));

        this.pos.x += this.vel.x * this.game.delta * this.timeMult;
        this.pos.y += this.vel.y * this.game.delta * this.timeMult;
        this.pos.z += this.vel.z * this.game.delta * this.timeMult;

        this.mesh.position = this.pos;
        this.mesh.rotation.x = this.rotation.x;
        this.mesh.rotation.y = this.rotation.y;
        this.mesh.rotation.z = this.rotation.z;

};


Entity.prototype.create = function () {
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshLambertMaterial({ color: 0xff0000, shading: THREE.SmoothShading });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
};