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
program.uSampler2 = gl.getUniformLocation(program, "texture2");
program.uSampler3 = gl.getUniformLocation(program, "disp");
program.pMatrix = gl.getUniformLocation(program, "pMatrix");
program.dispFactor = gl.getUniformLocation(program, "dispFactor");
program.effectFactor = gl.getUniformLocation(program, "effectFactor");

const texture = loadTexture("./texture/texture1.jpg");
const texture2 = loadTexture("./texture/texture2.jpg");
const form = loadTexture("./pattern/10.jpg");

document.addEventListener("scroll", function(event) {
    const height = window.innerHeight;
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const value = scroll / height;
    TweenMax.to(constants, 0.5, {
        value: value
    });

    TweenMax.to(document.querySelector(".baseline"), 0.5, {
        opacity: value
    });
});

const constants = { value: 0 };
// TweenMax.to(constants, 5, {
//     value: 1.5,
//     repeat: -1,
//     ease: Power2.easeIn,
//     yoyo: true
// });

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

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, form);

    // Bind the texture to texture unit 0

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(program.uSampler, 0);
    gl.uniform1i(program.uSampler2, 1);
    gl.uniform1i(program.uSampler3, 2);

    // const pMatrix = mat4.create();
    // const uMatrix = mat4.create();

    // mat4.translate(uMatrix, uMatrix, [0, 0, -10]);
    // mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 1000);

    // gl.uniformMatrix4fv(program.uMatrix, false, uMatrix);
    // gl.uniformMatrix4fv(program.pMatrix, false, pMatrix);

    gl.uniform1f(program.dispFactor, Math.sin(constants.value));
    gl.uniform1f(program.effectFactor, 0.5);

    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    const indices = [2, 0, 1, 1, 3, 2];
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // gl.drawElements(gl.TRIANGLE_STRIP, indices.length, type, offset);

    requestAnimationFrame(draw);
}

draw();
