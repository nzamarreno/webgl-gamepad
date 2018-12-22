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
program.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
program.uMatrix = gl.getUniformLocation(program, "uMatrix");
program.uSampler = gl.getUniformLocation(program, "texture");
program.pMatrix = gl.getUniformLocation(program, "pMatrix");
program.uOffset = gl.getUniformLocation(program, "uOffset");

const texture = loadTexture("./texture/texture1.jpg");
let parameters = { offset: 0.0 };

document.addEventListener("scroll", function(event) {
    const height = window.innerHeight;
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    value = scroll > 0 ? scroll / height / 100 + 0.01 : 0;
    TweenMax.to(parameters, 1, {
        offset: value
    });
});

function draw() {
    gl.clearColor(0.5, 0.6, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, width, height);
    const vertex = [
        -1.0,
        1.0,
        0.0,
        -1.0,
        -1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        -1.0,
        0.0
    ];
    const vertexTest = [
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
    createBuffer("vertex", vertex);

    gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aPosition);

    createBuffer("texture", [0, 0, 0, 1, 1, 0, 1, 1]);
    gl.vertexAttribPointer(program.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aTextureCoord);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Bind the texture to texture unit 0

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(program.uSampler, 0);

    // const pMatrix = mat4.create();
    // const uMatrix = mat4.create();

    // mat4.translate(uMatrix, uMatrix, [0, 0, -10]);
    // mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 1000);

    // gl.uniformMatrix4fv(program.uMatrix, false, uMatrix);
    // gl.uniformMatrix4fv(program.pMatrix, false, pMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.uniform1f(program.uOffset, parameters.offset);
    // gl.drawElements(gl.TRIANGLE_STRIP, indices.length, type, offset);

    requestAnimationFrame(draw);
}

draw();
