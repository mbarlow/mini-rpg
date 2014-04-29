function Mine(game, data) {
    this.name = 'mine';
    Entity.call(this, game);
    this.pos = data.pos;
    this.destination = this.pos.clone();
    this.units = 100;
}


Mine.prototype = new Entity();
Mine.prototype.constructor = Mine;


Mine.prototype.create = function() {
    if (objects['mine']) {
        objects['mine'].scale.set(8, 8, 8);
        objects['mine'].castShadow = true;
        this.mesh = objects['mine'].clone();
        this.rotation.y = roll(180) * (Math.PI / 180);
    }
};


