
const THREE = require('three');

function initRenderCanvas(rootEl){
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( w, h );
  rootEl.appendChild( renderer.domElement );
  return [w, h, renderer];
}



function main(rootEl) {
  console.log('hello world', rootEl);
  const [w, h, renderer] = initRenderCanvas(rootEl);
  camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	scene = new THREE.Scene();
	var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
	var material = new THREE.MeshBasicMaterial( { map: texture } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

  function animate() {
  	requestAnimationFrame( animate );
  	mesh.rotation.x += 0.005;
  	mesh.rotation.y += 0.01;
  	renderer.render( scene, camera );
  }
}

module.exports = main;
