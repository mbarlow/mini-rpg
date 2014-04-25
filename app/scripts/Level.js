var Terrain = {};


Terrain.PlaneGeometry = function (width, height, widthSegments, heightSegments) {

    THREE.Geometry.call(this);

    this.width = width;
    this.height = height;

    this.widthSegments = widthSegments || 1;
    this.heightSegments = heightSegments || 1;

    var ix, iz;
    var width_half = width / 2;
    var height_half = height / 2;

    var gridX = this.widthSegments;
    var gridZ = this.heightSegments;

    var gridX1 = gridX + 1;
    var gridZ1 = gridZ + 1;

    var segment_width = this.width / gridX;
    var segment_height = this.height / gridZ;

    var normal = new THREE.Vector3(0, 0, 1);

    for (iz = 0; iz < gridZ1; iz++) {

        for (ix = 0; ix < gridX1; ix++) {

            var x = ix * segment_width - width_half;
            var y = iz * segment_height - height_half;

            this.vertices.push(new THREE.Vector3(x, -y, 0));

        }

    }

    for (iz = 0; iz < gridZ; iz++) {

        for (ix = 0; ix < gridX; ix++) {

            var a = ix + gridX1 * iz;
            var b = ix + gridX1 * ( iz + 1 );
            var c = ( ix + 1 ) + gridX1 * ( iz + 1 );
            var d = ( ix + 1 ) + gridX1 * iz;

            var uva = new THREE.Vector2(ix / gridX, 1 - iz / gridZ);
            var uvb = new THREE.Vector2(ix / gridX, 1 - ( iz + 1 ) / gridZ);
            var uvc = new THREE.Vector2(( ix + 1 ) / gridX, 1 - ( iz + 1 ) / gridZ);
            var uvd = new THREE.Vector2(( ix + 1 ) / gridX, 1 - iz / gridZ);

            var face = new THREE.Face3(a, b, d);
            face.normal.copy(normal);
            face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());

            this.faces.push(face);
            this.faceVertexUvs[ 0 ].push([ uva, uvb, uvd ]);

            face = new THREE.Face3(b, c, d);
            face.normal.copy(normal);
            face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone());

            this.faces.push(face);
            this.faceVertexUvs[ 0 ].push([ uvb.clone(), uvc, uvd.clone() ]);

        }

    }

    this.computeCentroids();

};

Terrain.PlaneGeometry.prototype = Object.create(THREE.Geometry.prototype);


Terrain.heightMapToVertexColor = function (heightMap, geometry) {
    // get heightMap dimensions
    var width = heightMap.length
    var depth = heightMap[0].length
    // loop on each vertex of the geometry
    var color = new THREE.Color()
    for (var i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[i]
        if (face instanceof THREE.Face4) {
            console.assert(face instanceof THREE.Face4)
            face.vertexColors.push(vertexIdxToColor(face.a).clone())
            face.vertexColors.push(vertexIdxToColor(face.b).clone())
            face.vertexColors.push(vertexIdxToColor(face.c).clone())
            face.vertexColors.push(vertexIdxToColor(face.d).clone())
        } else if (face instanceof THREE.Face3) {
            console.assert(face instanceof THREE.Face3)
            face.vertexColors.push(vertexIdxToColor(face.a).clone())
            face.vertexColors.push(vertexIdxToColor(face.b).clone())
            face.vertexColors.push(vertexIdxToColor(face.c).clone())
        } else    console.assert(false)
    }
    geometry.colorsNeedUpdate = true;
    return;

    function vertexIdxToColor(vertexIdx) {
        var x = Math.floor(vertexIdx % width);
        var z = Math.floor(vertexIdx / width);
        var height = heightMap[x][z];
        return Terrain.heightToColor(height);
    }
};

Terrain.simplexHeightMap = function (heightMap) {
    var width = heightMap.length;
    var depth = heightMap[0].length;
    var simplex = new SimplexNoise();

    for (var x = 0; x < width; x++) {
        for (var z = 0; z < depth; z++) {
            // compute the height
            var height = 0;
            var level = 8;
            height += (simplex.noise(x / level, z / level) / 2 + 0.5) * 0.125;
            level *= 3;
            height += (simplex.noise(x / level, z / level) / 2 + 0.5) * 0.25;
            level *= 2;
            height += (simplex.noise(x / level, z / level) / 2 + 0.5) * 0.5;
            level *= 2;
            height += (simplex.noise(x / level, z / level) / 2 + 0.5) * 1.0;
            height /= 1 + 0.5 + 0.25 + 0.125;
            // put the height in the heightMap
            heightMap[x][z] = height;
        }
    }
};


Terrain.allocateHeightMap = function (width, depth) {
    var ArrayClass = window.Float64Array || window.Array;
    var heightMap = new Array(width);
    for (var x = 0; x < width; x++) {
        heightMap[x] = new ArrayClass(depth);
    }
    return heightMap;
};


Terrain.heightMapToCanvas = function (heightMap, canvas) {
    // get heightMap dimensions
    var width = heightMap.length;
    var depth = heightMap[0].length;
    // create canvas
    canvas = canvas || document.createElement('canvas');
    canvas.width = width;
    canvas.height = depth;
    var context = canvas.getContext("2d");
    // loop on each pixel of the canvas
    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            var height = heightMap[x][y];
            var color = Terrain.heightToColor(height);
            context.fillStyle = color.getStyle();
            context.fillRect(x, y, 1, 1);
        }
    }
    // return the just built canvas
    return canvas;
};


Terrain.heightToColor = (function () {
    var color = new THREE.Color();
    return function (height) {
        // compute color based on height
        if (height < 0.45) { //water
            height = (height * 2) * 0.5 + 0.2;
            color.setRGB(height / 2.5, height / 2.5, height / 2);
        } else if (height < 0.525) { //beach
            color.setHex(0xEED6AF);
        } else if (height < 0.675) { //grass
            height = (height - 0.5) / 0.2;
            height = height * 0.5 + 0.2;
            //color.setRGB(height/2, height, height/2)
            color.setHex(0x33aa33);
        } else { // mountains
            height = (height - 0.7) / 0.3;
            height = height * 0.5 + 0.5;
            //color.setRGB(height, height, height);
            color.setHex(0x777777);
        }
        return color;
    }
})();

Terrain.heightMapToPlaneGeometry = function (heightMap) {
    // get heightMap dimensions
    var width = heightMap.length;
    var depth = heightMap[0].length;
    // build geometry
    var geometry = new Terrain.PlaneGeometry(1, 1, width - 1, depth - 1);
    // loop on each vertex of the geometry
    for (var x = 0; x < width; x++) {
        for (var z = 0; z < depth; z++) {
            // get the height from heightMap
            var height = heightMap[x][z];
            // set the vertex.z to a normalized height
            var vertex = geometry.vertices[x + z * width];
            vertex.z = (height - 0.5) * 2;
        }
    }
    // notify the geometry need to update vertices
    geometry.verticesNeedUpdate = true;
    // notify the geometry need to update normals
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;
    // return the just built geometry
    return geometry;
}


Terrain.heightMapToHeight = function (heightMap, x, z) {
    // get heightMap dimensions
    var width = heightMap.length;
    var depth = heightMap[0].length;
    // sanity check - boundaries
    console.assert(x >= 0 && x < width, 'x' + x)
    console.assert(z >= 0 && z < depth, 'z' + z)

    // get the delta within a single segment
    var deltaX = x - Math.floor(x)
    var deltaZ = z - Math.floor(z)

    // get the height of each corner of the segment
    var heightNW = heightMap[Math.floor(x)][Math.floor(z)]
    var heightNE = heightMap[Math.ceil(x)][Math.floor(z)]
    var heightSW = heightMap[Math.floor(x)][Math.ceil(z)]
    var heightSE = heightMap[Math.ceil(x)][Math.ceil(z)]

    // test in which triangle the point is. north-east or south-west
    var inTriangleNE = deltaX > deltaZ ? true : false
    if (inTriangleNE) {
        var height = heightNE
            + (heightNW - heightNE) * (1 - deltaX)
            + (heightSE - heightNE) * deltaZ
    } else {
        var height = heightSW
            + (heightSE - heightSW) * deltaX
            + (heightNW - heightSW) * (1 - deltaZ)
    }
    // return the height
    return height
}


Terrain.planeToHeightMapCoords = function (heightMap, planeMesh, x, z) {

    // TODO assert no rotation in planeMesh
    // - how can i check that ? with euler ?

    var position = new THREE.Vector3(x, 0, z)

    // set position relative to planeMesh position
    position.sub(planeMesh.position)

    // heightMap origin is at its top-left, while planeMesh origin is at its center
    position.x += planeMesh.geometry.width / 2 * planeMesh.scale.x
    position.z += planeMesh.geometry.height / 2 * planeMesh.scale.y

    // normalize it from [0,1] for the heightmap
    position.x /= planeMesh.geometry.width * planeMesh.scale.x
    position.z /= planeMesh.geometry.height * planeMesh.scale.y

    // get heightMap dimensions
    var width = heightMap.length
    var depth = heightMap[0].length

    // convert it in heightMap coordinate
    position.x *= (width - 1)
    position.z *= (depth - 1)

    position.y = Terrain.heightMapToHeight(heightMap, position.x, position.z)
    position.y = (position.y - 0.5) * 2
    position.y *= planeMesh.scale.z

    return position.y
}


function Level() {
    this.resolution = 40;
}

Level.prototype.constructor = Level;

Level.prototype.generate = function () {

    //var material = new THREE.MeshLambertMaterial({ color: 0x33aa33, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, overdraw: true});
    var material = new THREE.MeshPhongMaterial({
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors,
    });
    Terrain.simplexHeightMap(heightMap);
    var geometry = Terrain.heightMapToPlaneGeometry(heightMap);
    Terrain.heightMapToVertexColor(heightMap, geometry);

    var land = new THREE.Mesh(geometry, material);
    land.receiveShadow = true;
    land.name = 'land';
    land.rotateX(-Math.PI / 2);
    land.scale.y = 20 * 10;
    land.scale.x = 20 * 10;
    land.scale.z = 2 * 10;
    //land.scale.multiplyScalar(10)

    var water_material = new THREE.MeshLambertMaterial({color: 0x6699ff, transparent: true, opacity: 0.75, vertexColors: THREE.FaceColors, shading: THREE.FlatShading});
    var water_geometry = new THREE.PlaneGeometry(200, 200, this.resolution, this.resolution);
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
