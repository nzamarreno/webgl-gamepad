function createBuffer(type, datas) {
    const buffer = gl.createBuffer();

    if (type === "indices") {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(datas),
            gl.STATIC_DRAW
        );
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.STATIC_DRAW);
    }

    return buffer;
}
