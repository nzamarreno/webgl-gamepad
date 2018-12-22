function createShader(id, type) {
    let shaderCreated; 
    const shader = document.getElementById(id).text;
  
    if(type === "vertex") {
      shaderCreated = gl.createShader(gl.VERTEX_SHADER);
    } else {
      shaderCreated = gl.createShader(gl.FRAGMENT_SHADER  );
    }
    
    gl.shaderSource(shaderCreated, shader)
    gl.compileShader(shaderCreated);
    
    const shaderVextexStatus = gl.getShaderParameter(shaderCreated, gl.COMPILE_STATUS);
    console.log(type, shaderVextexStatus);
    
    return shaderCreated;
  }
  
  