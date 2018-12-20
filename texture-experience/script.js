let program;
let gl;
const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.querySelector("#canvas");
canvas.width = width;
canvas.height = height;

gl = canvas.getContext("webgl");

// Get context color
gl.clearColor(0.5, 0.6, 0.4, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, width, height);

const vertexShader = createShader("vertex", "vertex");
const fragmentShader = createShader("fragment", "fragment");
createProgram(vertexShader, fragmentShader);

