var markerModel = (function(){
    var markerData = {
        geom: {
            trunk: new THREE.BoxGeometry(25, 512, 25)
        },
        materials: {
            trunk: new THREE.MeshLambertMaterial({ color: 0xff0000, shading: THREE.FlatShading })
        }
    };
    var marker = new THREE.Object3D();
    var box = new THREE.Mesh(markerData.geom.trunk, markerData.materials.trunk);
    marker.add(box);
    return marker;
})();

/**
 * MArkers constructed from primitives.
 * @param game
 * @constructor
 */
function Marker(game, data) {
    this.name = 'marker';
    Entity.call(this, game);
    this.pos = data.pos;
    this.destination = this.pos.clone();
}


Marker.prototype = new Entity();
Marker.prototype.constructor = Marker;


Marker.prototype.create = function() {
  this.mesh = markerModel.clone();
};
