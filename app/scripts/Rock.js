/**
 * Rocks constructed from primitives.
 * @param game
 * @constructor
 */
function Rock(game, data) {
    this.name = 'rock';
    Entity.call(this, game);
    this.pos = data.pos;
    this.destination = this.pos.clone();
}


Rock.prototype = new Entity();
Rock.prototype.constructor = Rock;


Rock.prototype.create = function() {
  var geometry = new THREE.SphereGeometry(12, 4, 4);
  var material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, shading: THREE.FlatShading });

  this.mesh = new THREE.Mesh(geometry, material);
  for (var i = 0; i < this.mesh.geometry.vertices.length; i++) {
    this.mesh.geometry.vertices[i].x += rndInt(2);
    this.mesh.geometry.vertices[i].z += rndInt(2);
    this.mesh.geometry.vertices[i].y += rndInt(4);

    this.mesh.geometry.vertices[i].y += 1.5;
  }
    var randScale = Math.random();
    this.mesh.scale.set(randScale, randScale, randScale);
};
