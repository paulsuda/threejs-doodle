
const THREE = require('three');

function initRenderCanvas(rootEl){
  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( w, h );
  rootEl.appendChild( renderer.domElement );
  return [w, h, renderer];
}

module.exports = { initRenderCanvas };
