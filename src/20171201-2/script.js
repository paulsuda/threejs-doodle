
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');

function makeLineMesh(){
  const geometry = new THREE.Geometry(); //THREE.LineSegments();
  const size = 400;
  const z = 150;
  const material = new THREE.LineBasicMaterial({ color: 0xFF3333 });
  geometry.vertices.push((new THREE.Vector3(-size, 0, z)));
  geometry.vertices.push((new THREE.Vector3(size, 0, z)));
  const mesh = new THREE.Line(geometry, material);
  return mesh;
}

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

  const lineMesh = makeLineMesh();
  scene.add( lineMesh );

  geometry.computeFlatVertexNormals();

  const animate = () => {
    mesh.rotation.x += 0.00005;
    mesh.rotation.y += 0.001;
    renderer.render( scene, camera );
  };
  return animate;
}

module.exports = main;
