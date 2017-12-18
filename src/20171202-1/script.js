
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');

function makeLineMesh(sphereGeometry){
  const geometry = new THREE.Geometry(); //THREE.LineSegments();
  const red = new THREE.Color(0xff0000);
  const blue = new THREE.Color(0x0000FF);
  const material = new THREE.LineBasicMaterial({
    lights: false,
    linewidth: 1,
    vertexColors: THREE.VertexColors,
    opacity: 0.5 });
  sphereGeometry.vertices.forEach((v) => {
    geometry.vertices.push(v.clone());
    geometry.vertices.push(v.clone().multiplyScalar(1.2));
    geometry.colors.push(blue);
    geometry.colors.push(red);
  });
  const mesh = new THREE.LineSegments(geometry, material);
  return mesh;
}

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.SphereGeometry( 200, 13, 9 );
  var material = new THREE.MeshPhongMaterial( {
    color: 0x333333,
    specular: 0x888888,
    shininess: 19,
    opacity: 0.5,
  }  );
  var wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x338888,
    wireframe: true,
  });
  {
    const light = new THREE.PointLight( 0xddcccc, 2, 1500 );
    light.position.set( 200, 250, 300 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x333355, 2, 800 );
    light.position.set( -350, -50, 300 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x336633, 2, 1200 );
    light.position.set( 200, -650, 600 );
    scene.add( light );
  }

	const mesh = new THREE.Mesh( geometry, material );
  const wireframeMesh = new THREE.Mesh( geometry, wireframeMaterial );

  const lineMesh = makeLineMesh(geometry);
  const group = new THREE.Group();
  group.add(mesh);
  group.add(lineMesh);
  group.add(wireframeMesh);

  scene.add( group );

  geometry.computeFlatVertexNormals();

  const animate = () => {
    group.rotation.x += 0.00005;
    group.rotation.y += 0.001;
    renderer.render( scene, camera );
  };
  return animate;
}

module.exports = main;
