
const THREE = require('three');

function cubeFrame(size){
  const geometry = new THREE.BoxBufferGeometry( size, size, size );
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff22,
    wireframe: true,
  });
  const mesh = new THREE.Mesh( geometry, material );
  return mesh;
}

function computeTextureSupportCheck(renderer){
  if ( ! renderer.extensions.get( "OES_texture_float" ) ) {
    throw "No OES_texture_float support for float textures.";
  }
  if ( renderer.capabilities.maxVertexTextures === 0 ) {
    throw "No support for vertex shader textures.";
  }
  return;
}

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

function htmlMessage(rootEl, messageHtml){
  const p = document.createElement('p');
  p.innerHTML = messageHtml;
  p.className = 'float';
  rootEl.appendChild(p);
  return p;
}

module.exports = { computeTextureSupportCheck, cubeFrame, htmlMessage, initRenderCanvas };
