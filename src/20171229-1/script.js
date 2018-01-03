const THREE = require('three');
const { cubeFrame, initRenderCanvas } = require('../shared/util');
const positionShaderCode = require('./position.glsl');
const velocityShaderCode = require('./velocity.glsl');
const ComputeShaderRunner = require('../shared/compute/ComputeShaderRunner');

function pointsBufferGeometry(textureWidth) {
  const pointCount = textureWidth * textureWidth;
  const bufferGeometry = new THREE.BufferGeometry();
  const vertexFloatArray = new Float32Array( pointCount * 4 );
	const vertices = new THREE.BufferAttribute( vertexFloatArray, 4 );
  vertices.dynamic = true;
  bufferGeometry.dynamic = true;
  for(var i = 0; i < pointCount; i++){
    vertices.array[i * 4] =  Math.random() - 0.5;
    vertices.array[i * 4 + 1] = Math.random() - 0.5;
    vertices.array[i * 4 + 2] = Math.random() - 0.5;
    vertices.array[i * 4 + 3] = 1.0;
  }
  bufferGeometry.addAttribute('position', vertices);
  return [bufferGeometry, vertices];
}

function velocitiesBufferGeometry(textureWidth) {
  const pointCount = textureWidth * textureWidth;
  const bufferGeometry = new THREE.BufferGeometry();
  const vertexFloatArray = new Float32Array( pointCount * 4 );
	const vertices = new THREE.BufferAttribute( vertexFloatArray, 4 );
  vertices.dynamic = true;
  bufferGeometry.dynamic = true;
  for(var i = 0; i < pointCount; i++){
    vertices.array[i * 4] = 0.0;
    vertices.array[i * 4 + 1] = 0.0;
    vertices.array[i * 4 + 2] = 0.0;
    vertices.array[i * 4 + 3] = 1.0;
  }
  bufferGeometry.addAttribute('position', vertices);
  return [bufferGeometry, vertices];
}

function main(rootEl) {
  const textureWidth = 256;
  var material = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0xccccee,
    opacity: 0.5,
    transparent: true,
  }  );
  var material2 = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0xCCAA33,
    opacity: 0.75,
    transparent: true,
  }  );

  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 45, w / h, 1.0, 5.0 );
	camera.position.z = 3.0;
  camera.position.y = -0.3;
	const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF8F8F8);

  var [velocityBufferGeometry, velocityGeometryVertices] = velocitiesBufferGeometry(textureWidth);
  velocityGeometryVertices.dynamic = true;

	var [positionBufferGeometry, positionGeometryVertices] = pointsBufferGeometry(textureWidth);
	const points = new THREE.Points( positionBufferGeometry, material );
  positionBufferGeometry.dynamic = true;

  const group = new THREE.Group();
  group.add(points);

  // const geometry2 = new THREE.SphereGeometry( 0.5, 13, 9 );
  // const points2 = new THREE.Points( geometry2, material2 );
  // points2.rotation.x += 0.124;
  // points2.rotation.y += 0.1;
  // group.add(points2);
  // group.add(cubeFrame(1.0));

  scene.add( group );

  group.rotation.x += -0.1;
  group.rotation.y += 0.1;

  const uniforms = [
    {name: 'positionTexture', format: THREE.RGBAFormat},
    {name: 'velocityTexture', format: THREE.RGBAFormat},
    {name: 'frameTimeSec', format: THREE.FloatType},
  ];

  const velocityRunner = new ComputeShaderRunner(
    renderer, textureWidth, uniforms, velocityShaderCode);
  var computedVelocities = velocityRunner.createComputeReturnBuffer();
  var oldVelocities = velocityGeometryVertices.array;

  const positionRunner = new ComputeShaderRunner(
    renderer, textureWidth, uniforms, positionShaderCode);
  var computedVertices = positionRunner.createComputeReturnBuffer();
  var oldVertices = positionGeometryVertices.array;

  function animate(frameTimeSec){
    /* Calculate updated velocity vectors. */
    velocityRunner.computeRun({
      positionTexture: oldVertices,
      velocityTexture: oldVelocities,
      frameTimeSec: frameTimeSec,
    }, computedVelocities);
    velocityGeometryVertices.setArray(computedVelocities);
    velocityGeometryVertices.needsUpdate = true;

    /* Move positions by their respective velocities. */
    positionRunner.computeRun({
      positionTexture: oldVertices,
      velocityTexture: computedVelocities,
      frameTimeSec: frameTimeSec,
    }, computedVertices);
    positionGeometryVertices.setArray(computedVertices);
    positionGeometryVertices.needsUpdate = true;

    /* Double buffer swap old and new */
    var s;
    s = oldVelocities;
    oldVelocities = computedVelocities;
    computedVelocities = s;

    s = oldVertices;
    oldVertices = computedVertices;
    computedVertices = s;

    renderer.render( scene, camera );
  }

  return animate;
}

main.src = __filename;

main.description = `
## Fountain
Compute shaders. Modeled gravity, suction, attraction to origin at bottom
turning to repulsion from at top, and a small amount of drag. Positions
clamped to bounding box.
`;

module.exports = main;
