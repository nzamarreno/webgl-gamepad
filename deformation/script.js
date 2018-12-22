let program;
let gl;
const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.querySelector("#canvas");
canvas.width = width;
canvas.height = height;

gl = canvas.getContext("webgl");

// Get context color

const vertexShader = createShader("vertex", "vertex");
const fragmentShader = createShader("fragment", "fragment");
createProgram(vertexShader, fragmentShader);

//create Position
program.aPosition = gl.getAttribLocation(program, "aPosition");
let vertexTest = [
    -0.5,
    0.5,
    0.0,
    -0.5,
    -0.5,
    0.0,
    0.5,
    0.5,
    0.0,
    0.5,
    -0.5,
    0.0
];

program.aNormal = gl.getAttribLocation(program, "aNormal");

program.uAmplitude = gl.getUniformLocation(program, "uAmplitude");
program.uMatrix = gl.getUniformLocation(program, "uMatrix");
program.pMatrix = gl.getUniformLocation(program, "pMatrix");
program.uTime = gl.getUniformLocation(program, "uTime");
program.uNoise = gl.getUniformLocation(program, "uNoise");

document.addEventListener("mousemove", function(event) {
    amplitude = event.clientX.toFixed(2);
});

const pMatrix = mat4.create();
const uMatrix = mat4.create();

let angle = 0.0;
let amplitude = 0.0;
let  = 0.0;

let start = Date.now();

function generateCoordinates() {
    const noiseFramework = new Noise();

    Sphere = Sphere.map(
        (x, index) => x + Math.sin(noiseFramework.simplex2(uTime, index) * 0.002)
    );
}

function draw() {
    angle = angle + 0.01;
    uTime = 0.0025 * (Date.now() - start);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, width, height);

    mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 1000);
    mat4.translate(uMatrix, mat4.create(), [0, 0, -3]);
    mat4.rotateY(uMatrix, uMatrix, angle);

    generateCoordinates();

    createBuffer("vertex", Sphere);
    gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aPosition);

    createBuffer("vertex", Sphere_normals);
    gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aNormal);

    gl.uniformMatrix4fv(program.uMatrix, false, uMatrix);
    gl.uniformMatrix4fv(program.pMatrix, false, pMatrix);

    gl.uniform1f(program.uTime, uTime);
    gl.uniform1f(program.uAmplitude, amplitude);

    createBuffer("indices", Sphere_indices);
    gl.drawElements(gl.LINES, Sphere_indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(draw);
}

draw();
