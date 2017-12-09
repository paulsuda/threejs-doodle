
const THREE = require('three');

/**
 * Install each example at rootEl domElement
 * windowSizeCallback - callback(w, h) - called once on init, and when window resizes
 */
function initRenderCanvas(rootEl, renderer, windowSizeCallback){
  renderer = renderer || new THREE.WebGLRenderer();
  windowSizeCallback = windowSizeCallback || function(){};
  let w, h;

  function onWindowResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( w, h );
    windowSizeCallback(w, h);
  }

  onWindowResize();

  rootEl.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );

  return [w, h, renderer];
}

module.exports = { initRenderCanvas };
