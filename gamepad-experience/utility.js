let div = document.createElement("div");
div.setAttribute("id", "fps");
div.style.position = "fixed";
div.style.zIndex = 10;
div.style.top = "10px";
div.style.left = "10px";
document.body.appendChild(div);
const fpsElem = document.querySelector("#fps");

let then = 0;
function render(now) {
  now *= 0.001;                          // convert to seconds
  const deltaTime = now - then;          // compute time since last frame
  then = now;                            // remember time for next frame
  const fps = 1 / deltaTime;             // compute frames per second
  fpsElem.textContent = fps.toFixed(1);  // update fps display
  
  requestAnimationFrame(render);
}

requestAnimationFrame(render);