function Level(data) {
    this.size = data.size || 64;
    this.tile  = { width: 16, depth: 16 };
}

Level.prototype.constructor = Level;

Level.prototype.generate = function () {
//    var offsetX = -(this.size * this.tile.width) / 2;
//    var offsetY = -(this.size * this.tile.width) / 2;
//    var x, y, floor;
//    var _floor = new THREE.PlaneGeometry(this.tile.width, this.tile.depth);
//    var floor_geometry = new THREE.Geometry();
    var solidMat = new THREE.MeshLambertMaterial({ color: 0x33aa33, shading: THREE.FlatShading, vertexColors: THREE.FaceColors, overdraw: true});
    var wireMat = new THREE.MeshPhongMaterial({ color: 0x55cc55, wireframe: true, shading: THREE.FlatShading });
    wireMat.blending = THREE.AdditiveAlphaBlending;
//
//    var offsetXX = 0;
//    var offsetYY = 0;
//
//    for (y = 0; y < this.size; y++) {
//        for (x = 0; x < this.size; x++) {
//
//            // build tiles
//            offsetXX = offsetX + (x * this.tile.width);
//            offsetYY = offsetY + (y * this.tile.width);
//            floor = new THREE.Mesh(_floor, material);
//            floor.rotation.x = -Math.PI / 2;
//            floor.position.set(offsetXX, -1, offsetYY);
//            THREE.GeometryUtils.merge(floor_geometry, floor);
//
//
//        }
//    }
//
//    floor = new THREE.Mesh(floor_geometry, material);
//    floor.receiveShadow = true;
//    floor.castShadow = false;

    var geometry = new THREE.PlaneGeometry(650, 650, 10, 10);
    for (var i = 0; i < geometry.vertices.length; i++) {
        geometry.vertices[i].z += rndInt(5);
        geometry.vertices[i].x += rndInt(15);
        geometry.vertices[i].y += rndInt(15);
    }

    for (var f = 0; f < geometry.faces.length; f++) {
        var color = geometry.faces[f].color;
        geometry.faces[f].color.setRGB(color.r + Math.random() / 2, color.g + Math.random() / 2, color.b + Math.random() / 2);
    }


    var floor_solid = new THREE.Mesh(geometry, solidMat);
    floor_solid.receiveShadow = true;

    var floor = new THREE.Object3D();

    floor.add(floor_solid);


    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -20, 0);
    floor.receiveShadow = true;

    return floor;
};