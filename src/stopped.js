
const THREE = require('three');
const { initRenderCanvas } = require('./shared/util');

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 50, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var material = new THREE.MeshPhongMaterial( {
    color: 0x66cc44,
    specular: 0xffffff,
    shininess: 50
  }  );
  {
    const light = new THREE.PointLight( 0xFFFFFF, .7, 1500 );
    light.position.set( 200, 250, 300 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0xFFFFFF, .2, 800 );
    light.position.set( -550, -550, 30 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0xFFFFFF, .7, 1200 );
    light.position.set( 200, -650, 100 );
    scene.add( light );
  }

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

  mesh.rotation.x += 0.55;
  mesh.rotation.y += 1.1;
  /* No animate(), single frame render */
  renderer.render( scene, camera );
  return () => {};
}

main.src = __filename;
main.description = 'The End.';

module.exports = main;
