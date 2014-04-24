/**
 *
 * @param game
 * @constructor
 */
function Village(game, data) {
    this.name = 'village';
    Entity.call(this, game);
    this.pos = data.pos;
    this.destination = this.pos.clone();
}


Village.prototype = new Entity();
Village.prototype.constructor = Village;


Village.prototype.create = function() {
    if (objects['village']) {
        objects['village'].scale.set(1, 1, 1);
        objects['village'].castShadow = true;
        this.mesh = objects['village'].clone();
        for (var i = 0; i < this.mesh.geometry.vertices.length; i++) {
            this.mesh.geometry.vertices[i].y += 3;
        }
    }
};