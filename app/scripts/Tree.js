/**
 * Trees constructed from primitives.
 * Provide wood resources.
 * @param game
 * @constructor
 */
function Tree(game) {

    this.name = 'tree';
    Entity.call(this, game);
    this.pos = new THREE.Vector3(rndInt(64) * 8, 0, rndInt(64) * 8);
    this.units = 4;

}


Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;


Tree.prototype.update = function() {

    Entity.prototype.update.call(this);

};


Tree.prototype.create = function() {

    var tree = new THREE.Object3D();
    var leaves = new THREE.Mesh(treeData.geom.leaves, treeData.materials.leaves);
    var trunk = new THREE.Mesh(treeData.geom.trunk, treeData.materials.trunk);

    leaves.castShadow = true;
    trunk.castShadow = true;

    leaves.position.y += 40;
    trunk.position.y += 10;

    tree.add(leaves);
    tree.add(trunk);
    tree.castShadow = true;

    this.rotation.y = roll(180) * (Math.PI / 180);
    this.mesh = tree;
};


var treeData = {
    geom: {
        leaves: new THREE.CylinderGeometry( 0, 25, 60, 4, 1 ),
        trunk: new THREE.BoxGeometry(5, 20, 5)
    },
    materials: {
        leaves: new THREE.MeshLambertMaterial({ color: 0x3EA055, shading: THREE.SmoothShading }),
        trunk: new THREE.MeshLambertMaterial({ color: 0x966F33, shading: THREE.SmoothShading })
    }
};

