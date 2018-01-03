
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');

function cubeFrame(size){
  const geometry = new THREE.BoxBufferGeometry( size, size, size );
  const material = new THREE.MeshBasicMaterial({
    color: 0x338888,
    wireframe: true,
  });
  const mesh = new THREE.Mesh( geometry, material );
  return mesh;
}

function pointsBufferGeometry() {
  const textureWidth = 4;
  const scaleFactor = 0.9;
  const pointCount = textureWidth * textureWidth;
  const bufferGeometry = new THREE.BufferGeometry();
  const vertexFloatArray = new Float32Array( pointCount * 3 );
	const vertices = new THREE.BufferAttribute( vertexFloatArray, 3 );
  for(var i = 0; i < pointCount; i++){
    const f = parseFloat(i) / parseFloat(pointCount);
    vertices.array[i * 3] =  f - 0.5;
    vertices.array[i * 3 + 1] = f - 0.5;
    vertices.array[i * 3 + 2] = f - 0.5;
  }
  bufferGeometry.addAttribute('position', vertices);
  bufferGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
  return [bufferGeometry, vertices];
}

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 0.1, 5.0 );
	camera.position.z = 3.0;
	const scene = new THREE.Scene();
	var [geometry, geometryVertices] = pointsBufferGeometry();
  var material = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0x33ff33,
    opacity: 0.75,
    transparent: true,
  });
  var material2 = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0xff2222,
    opacity: 0.75,
    transparent: true,
  });

	const points = new THREE.Points( geometry, material );
  geometry.dynamic = true;

  const geometry2 = new THREE.SphereGeometry( 0.5, 13, 9 );
  const points2 = new THREE.Points( geometry2, material2 );
  points2.rotation.x += 0.124;
  points2.rotation.y += 0.1;

  const group = new THREE.Group();
  group.add(points);
  group.add(points2);
  group.add(cubeFrame(1.0));

  scene.add( group );

  group.rotation.x += -0.1;
  group.rotation.y += 0.1;

  const animate = function(){
    renderer.render( scene, camera );
  };
  return animate;
}

main.src = __filename;

main.description = `
## Geometry Practice
SphereGeometry, with generated geometry points.
`;

module.exports = main;
