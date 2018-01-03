
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.SphereGeometry( 200, 13, 9 );
  var material = new THREE.MeshPhongMaterial( {
    color: 0xFFD700,
    specular: 0x888888,
    shininess: 9
  }  );
  {
    const light = new THREE.PointLight( 0xcccccc, 2, 1500 );
    light.position.set( 200, 250, 300 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x333333, 2, 800 );
    light.position.set( -350, -50, 300 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x333333, 2, 1200 );
    light.position.set( 200, -650, 600 );
    scene.add( light );
  }

	const mesh = new THREE.Mesh( geometry, material );

	scene.add( mesh );

  geometry.computeFlatVertexNormals();

  const animate = () => {
    mesh.rotation.x += 0.00005;
    mesh.rotation.y += 0.001;
    renderer.render( scene, camera );
  };
  return animate;
}

main.src = __filename;

main.description = `
## Gold Sphere
Phong shading and 3 white light sources.
`;

module.exports = main;
