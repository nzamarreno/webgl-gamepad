function makePolyGeometry(vertexData) {
    // Takes vertex data containing {indices,positions,normals,uvs}
    // and duplicates the verticies so that the normals don't get interpolated
    // returns new vertex data

    var indices = vertexData.indices;
    var positions = vertexData.positions;
    var uvs = vertexData.uvs;

    var new_indices = [];
    var new_positions = [];
    var new_uvs = [];

    for (var i = 0; i < indices.length; i++) {
        // Loop over all the verticies
        // Create a new positions for each
        var index = indices[i];
        var x = positions[index * 3];
        var y = positions[index * 3 + 1];
        var z = positions[index * 3 + 2];
        new_positions.push(x, y, z);

        // Do the same for UV's
        var u = uvs[index * 2];
        var v = uvs[index * 2 + 1];
        new_uvs.push(u, v);

        // Use this new position in our index array
        new_indices.push(i);
    }

    var normals = calculateNormals(new_positions, new_indices);

    return {
        indices: new_indices,
        positions: new_positions,
        normals: normals,
        uvs: new_uvs
    };
}

function calculateNormals(vs, ind) {
    var x = 0;
    var y = 1;
    var z = 2;

    var ns = [];
    for (var i = 0; i < vs.length; i++) {
        //for each vertex, initialize normal x, normal y, normal z
        ns[i] = 0.0;
    }

    for (var i = 0; i < ind.length; i = i + 3) {
        //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
        var v1 = [];
        var v2 = [];
        var normal = [];
        //p1 - p0
        v1[x] = vs[3 * ind[i + 1] + x] - vs[3 * ind[i] + x];
        v1[y] = vs[3 * ind[i + 1] + y] - vs[3 * ind[i] + y];
        v1[z] = vs[3 * ind[i + 1] + z] - vs[3 * ind[i] + z];
        // p0 - p1
        v2[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
        v2[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
        v2[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];
        //p2 - p1
        // v1[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
        // v1[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
        // v1[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];
        // p0 - p1
        // v2[x] = vs[3*ind[i]+x] - vs[3*ind[i+1]+x];
        // v2[y] = vs[3*ind[i]+y] - vs[3*ind[i+1]+y];
        // v2[z] = vs[3*ind[i]+z] - vs[3*ind[i+1]+z];
        //cross product by Sarrus Rule
        normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
        normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
        normal[z] = v1[x] * v2[y] - v1[y] * v2[x];

        // ns[3*ind[i]+x] += normal[x];
        // ns[3*ind[i]+y] += normal[y];
        // ns[3*ind[i]+z] += normal[z];
        for (j = 0; j < 3; j++) {
            //update the normals of that triangle: sum of vectors
            ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
            ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
            ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
        }
    }
    //normalize the result
    for (var i = 0; i < vs.length; i = i + 3) {
        //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)

        var nn = [];
        nn[x] = ns[i + x];
        nn[y] = ns[i + y];
        nn[z] = ns[i + z];

        var len = Math.sqrt(nn[x] * nn[x] + nn[y] * nn[y] + nn[z] * nn[z]);
        if (len == 0) len = 0.00001;

        nn[x] = nn[x] / len;
        nn[y] = nn[y] / len;
        nn[z] = nn[z] / len;

        ns[i + x] = nn[x];
        ns[i + y] = nn[y];
        ns[i + z] = nn[z];
    }

    return ns;
}
