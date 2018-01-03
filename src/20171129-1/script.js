
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.SphereGeometry( 200, 6, 6 );
  var material = new THREE.MeshPhongMaterial( {
    color: 0xcc3333,
    specular: 0xee8888,
    shininess: 3.2
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
  const helper = new THREE.FaceNormalsHelper( mesh, 20, 0x3366ff, 5 );

	scene.add( mesh );
  scene.add( helper );

  const animate = () => {
    helper.update();
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
  };
  return animate;
}

main.src = __filename;

main.description = `
## Lumpy Sphere
Little spines are from FaceNormalsHelper. Lighting from 3 sources.
`;

module.exports = main;
