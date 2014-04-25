var treeModel = (function(){
    var treeData = {
        geom: {
            leaves: new THREE.CylinderGeometry( 0, 5, 12, 4, 1 ),
            trunk: new THREE.BoxGeometry(1, 4, 1)
        },
        materials: {
            leaves: new THREE.MeshLambertMaterial({ color: 0x3EA055, shading: THREE.FlatShading }),
            trunk: new THREE.MeshLambertMaterial({ color: 0x966F33, shading: THREE.FlatShading })
        }
    };
    var tree = new THREE.Object3D();
    var leaves = new THREE.Mesh(treeData.geom.leaves, treeData.materials.leaves);
    var trunk = new THREE.Mesh(treeData.geom.trunk, treeData.materials.trunk);
    leaves.name = 'leaves';
    trunk.name= 'trunk';

    leaves.castShadow = true;
    trunk.castShadow = true;
    leaves.receiveShadow = true;
    trunk.receiveShadow = true;

    leaves.position.y += 8;


    tree.add(leaves);
    tree.add(trunk);
    tree.castShadow = true;
    tree.scale.set(0.25,0.25,0.25);

    return tree;
})();

/**
 * Trees constructed from primitives.
 * Provide wood resources.
 * @param game
 * @constructor
 */
function Tree(game, data) {
    this.name = 'tree';
    Entity.call(this, game);
    this.pos = data.pos;
    this.destination = this.pos.clone();
    this.units = 4;
}


Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;


Tree.prototype.create = function() {
  //var randScale = 1 + Math.random();
  this.mesh = treeModel.clone();
  //this.mesh.scale.set(randScale, randScale, randScale);
};
