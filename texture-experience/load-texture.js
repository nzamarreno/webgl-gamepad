function loadTexture(source) {
    const texture = createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // bleu opaque
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);
                  
    let image = new Image();
    image.src = source;
    image.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);
  
      // WebGL1 a des spécifications différentes pour les images puissances de 2
      // par rapport aux images non puissances de 2 ; aussi vérifier si l'image est une
      // puissance de 2 sur chacune de ses dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
         // Oui, c'est une puissance de 2. Générer les mips.
         gl.generateMipmap(gl.TEXTURE_2D);
      } else {
         // Non, ce n'est pas une puissance de 2. Désactiver les mips et définir l'habillage
         // comme "accrocher au bord"
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    
    return texture;
  }
  
  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }