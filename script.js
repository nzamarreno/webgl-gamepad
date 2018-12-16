// FIXME: Apprendre par coeur <3
// let vertexDatas = [-0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0];
// gl.getAttribLocation(program, "aAttributeName");
// gl.vertexAttribPointer(program.vertex, 3, gl.FLOAT, false, 0, 0);
// gl.enableVertexAttribArray(program.vertex);

window.addEventListener("gamepadconnected", function() {
    gameLoop();
});

function gameLoop() {
    var gamepads = navigator.getGamepads
        ? navigator.getGamepads()
        : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads
        : [];
    if (!gamepads) return;
    const buttons = gamepads[0].buttons;
    const axis = gamepads[0].axes;

    turnAround(axis[0], axis[1]);
    requestAnimationFrame(gameLoop);
}

let gl;
let program;

const canvas = document.querySelector("#canvas");
gl = canvas.getContext("webgl");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create Shader
function getShader(id, type) {
    const shaderText = document.getElementById(id).text;
    const shader =
        type === "vertex"
            ? gl.createShader(gl.VERTEX_SHADER)
            : gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    console.log(type, gl.getShaderParameter(shader, gl.COMPILE_STATUS));
    return shader;
}

// Create Scene
function viewport() {
    gl.clearColor(0.5, 0.5, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

let vertexDatas = [-0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0];
function createAnimation(axisX, axisY) {
    // X
    if (axisX === 1) {
        vertexDatas = vertexDatas.map((item, index) =>
            index === 0 || index === 3 || index === 6 ? item + 0.01 : item
        );

        viewport();
        bindBuffer("vertex", vertexDatas);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else if (axisX === -1) {
        vertexDatas = vertexDatas.map((item, index) =>
            index === 0 || index === 3 || index === 6 ? item - 0.01 : item
        );

        viewport();
        bindBuffer("vertex", vertexDatas);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // Y
    if (axisY > 0.8) {
        vertexDatas = vertexDatas.map((item, index) =>
            index === 1 || index === 4 || index === 7 ? item - 0.01 : item
        );

        viewport();
        bindBuffer("vertex", vertexDatas);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else if (axisY < -0.8) {
        vertexDatas = vertexDatas.map((item, index) =>
            index === 1 || index === 4 || index === 7 ? item + 0.01 : item
        );

        viewport();
        bindBuffer("vertex", vertexDatas);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

function createProgram(vertexShader, fragmentShader) {
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
}

function bindBuffer(type, datas) {
    let buffer = gl.createBuffer();
    if (type === "vertex") {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.STATIC_DRAW);
        gl.vertexAttribPointer(program.vertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.vertex);
    } else if (type === "normal") {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas), gl.STATIC_DRAW);
        gl.vertexAttribPointer(program.normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.normal);
    } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(datas),
            gl.STATIC_DRAW
        );
    }
}

const planeGeometry = makePolyGeometry({
    indices: Icosphere_indices,
    positions: Icosphere_vertices,
    uvs: []
});

Icosphere_vertices = planeGeometry.positions;
Icosphere_indices = planeGeometry.indices;
Icosphere_normals = planeGeometry.normals;

let rotateX = 0;
let rotateY = 0;
function turnAround(X, Y) {
    // X
    if (X === 1) {
        rotateX = rotateX + 0.01;
    } else if (X === -1) {
        rotateX = rotateX - 0.01;
    }

    // Y
    if (Y > 0.8) {
        rotateY = rotateY + 0.01;
    } else if (Y < -0.8) {
        rotateY = rotateY - 0.01;
    }
}

let angle = 0;
function draw() {
    viewport();
    bindBuffer("vertex", Icosphere_vertices);
    bindBuffer("fragment", Icosphere_indices);
    bindBuffer("normal", Icosphere_normals);
    angle = angle + 0.01;
    mat4.translate(MVMatrix, mat4.create(), [0, 0, -5]);
    mat4.rotateY(MVMatrix, MVMatrix, rotateX);
    // mat4.rotateY(MVMatrix, MVMatrix, angle);

    gl.uniform4fv(program.color, [0.8, Math.sin(angle), Math.sin(angle), 1.0]);

    mat4.rotateX(MVMatrix, MVMatrix, rotateY);
    gl.uniformMatrix4fv(program.MVMatrix, false, MVMatrix);

    gl.drawElements(
        gl.TRIANGLES,
        Icosphere_indices.length,
        gl.UNSIGNED_SHORT,
        0
    );

    requestAnimationFrame(draw);
}

const MVMatrix = mat4.create();
const PMatrix = mat4.create();

window.onload = function() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    const vertex = getShader("vertex", "vertex");
    const fragment = getShader("fragment", "fragment");
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    createProgram(vertex, fragment);

    // Vertices
    program.vertex = gl.getAttribLocation(program, "aVertexPosition");

    // Normal
    program.normal = gl.getAttribLocation(program, "aNormal");

    //Direction Color
    program.direction = gl.getUniformLocation(program, "uDirection");
    gl.uniform3fv(program.direction, [1.0, 1.0, 2]);

    program.color = gl.getUniformLocation(program, "uColor");

    // Matrix
    program.MVMatrix = gl.getUniformLocation(program, "MVMatrix");

    mat4.perspective(PMatrix, 45, canvas.width / canvas.height, 0.1, 1000);
    program.PMatrix = gl.getUniformLocation(program, "PMatrix");
    gl.uniformMatrix4fv(program.PMatrix, false, PMatrix);

    draw();
};
