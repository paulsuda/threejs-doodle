
const THREE = require('three');
const { initRenderCanvas, htmlMessage } = require('./shared/util');

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var material = new THREE.MeshPhongMaterial( {
    color: 0x66cc44,
    specular: 0xffffff,
    shininess: 50
  }  );
  {
    const light = new THREE.PointLight( 0xcccccc, 2, 1500 );
    light.position.set( 200, 250, 300 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x333333, 2, 800 );
    light.position.set( -350, -350, -100 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x333333, 2, 1200 );
    light.position.set( 200, -650, 100 );
    scene.add( light );
  }

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

  mesh.rotation.x += 0.55;
  mesh.rotation.y += 1.1;
  /* No animate(), single frame render */
  renderer.render( scene, camera );
  htmlMessage(rootEl, 'Stopped');
}


module.exports = main;
