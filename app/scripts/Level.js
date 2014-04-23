var Terrain = {};

Terrain.allocateHeightMap = function(width, depth) {
  var ArrayClass = window.Float64Array || window.Array;
  var heightmap = new Array(width);
  for(var x = 0; x < width; x++) {
    heightMap[x] = new ArrayClass(depth);
  }
  return heightMap;
};

Terrain.simplexHeightmap = function(heightmap) {
};


function Level() {
    this.resolution = 20;
}

Level.prototype.constructor = Level;

Level.prototype.generate = function () {

    var material = new THREE.MeshLambertMaterial({ color: 0x33aa33, shading: THREE.FlatShading, vertexColors: THREE.FaceColors, overdraw: true});
    var geometry = new THREE.PlaneGeometry(1200, 1200, this.resolution, this.resolution);
    geometry.dynamic = true;
    geometry.verticesNeedUpdate = true;
    geometry.computeCentroids();

    var noise = new SimplexNoise();
    var n;

    var factorX = 50;
    var factorY = 25;
    var factorZ = 60;

    for (var i = 0; i < geometry.vertices.length; i++) {
        n = noise.noise(geometry.vertices[i].x / this.resolution / factorX, geometry.vertices[i].y / this.resolution / factorY);
        n -= 0.25;
        geometry.vertices[i].z = n * factorZ;
    }

    for (var f = 0; f < geometry.faces.length; f++) {
        var color = geometry.faces[f].color;
        var rand = Math.random() / 5;
        geometry.faces[f].color.setRGB(color.r + rand, color.g + rand, color.b + rand);
    }
    //THREE.GeometryUtils.triangulateQuads( geometry );

    var land = new THREE.Mesh(geometry, material);
    land.receiveShadow = true;
    land.name = 'land';
    land.rotateX(-Math.PI / 2);
    land.position.set(0, 30, 0);

    var water_material = new THREE.MeshLambertMaterial({color: 0x6699ff, transparent: true, opacity: 0.75,vertexColors: THREE.FaceColors, shading: THREE.FlatShading});
    var water_geometry = new THREE.PlaneGeometry(1200, 1200, this.resolution, this.resolution);
    water_geometry.dynamic = true;
    water_geometry.verticesNeedUpdate = true;
    for (var i = 0; i < water_geometry.faces.length; i++) {
        var color = water_geometry.faces[i].color;
        var rand = Math.random();
        water_geometry.faces[i].color.setRGB(color.r + rand, color.g + rand, color.b + rand);
    }

    var water = new THREE.Mesh(water_geometry, water_material);
    water.receiveShadow = true;
    water.name = 'water';
    water.rotateX(-Math.PI / 2);

    var terrain = new THREE.Object3D();
    terrain.name = 'terrain';

    terrain.add(land);
    terrain.add(water);


    //terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;

    return terrain;
};
