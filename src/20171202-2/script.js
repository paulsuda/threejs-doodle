
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');


function main(rootEl) {
  console.log('hello world', rootEl);
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.SphereGeometry( 200, 13, 9 );
  var material = new THREE.PointsMaterial( {
    size: 3,
    color: 0xee8833,
    opacity: 0.75,
    transparent: true,
  }  );
  var material2 = new THREE.PointsMaterial( {
    size: 3,
    color: 0x3388ee,
    opacity: 0.75,
    transparent: true,
  }  );

	const points = new THREE.Points( geometry, material );

  const geometry2 = geometry.clone();
  const points2 = new THREE.Points( geometry2, material2 );
  points2.rotation.x += 0.124;
  points2.rotation.y += 0.1;

  const group = new THREE.Group();
  group.add(points);
  group.add(points2);

  scene.add( group );

  geometry.computeFlatVertexNormals();

  const animate = () => {
    requestAnimationFrame( animate );
    group.rotation.x += 0.00005;
    group.rotation.y += 0.001;
    renderer.render( scene, camera );
  };
  animate();
}

module.exports = main;
