
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


function htmlMessage(rootEl, messageText){
  const p = document.createElement('p');
  const t = document.createTextNode(messageText);
  p.className = 'float';
  p.appendChild(t);
  rootEl.appendChild(p);
  return p;
}

module.exports = { initRenderCanvas, htmlMessage };
