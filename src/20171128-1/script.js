
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var material = new THREE.MeshPhongMaterial( {
    color: 0xcc3333,
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

  const animate = () => {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
  };
  return animate;
}

main.src = __filename;

main.description = `
## Red Cube
Hello world! Lighting from 3 sources.
`;

module.exports = main;
