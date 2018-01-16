const THREE = require('three');
const { cubeFrame, initRenderCanvas } = require('../shared/util');
const positionShaderCode = require('./position.glsl');
const velocityShaderCode = require('./velocity.glsl');
const ComputeShaderRunner = require('../shared/compute/ComputeShaderRunner');
const ComputeArrayBufferGeometry = require('../shared/compute/ComputeArrayBufferGeometry');


function pointsBufferGeometry(textureWidth) {
  const bufferGeometry = new ComputeArrayBufferGeometry(textureWidth);
  const r = () => Math.random() - 0.5;
  bufferGeometry.setInitialValues((_) => [r(), r(), r(), 1.0]);
  return bufferGeometry;
}

function velocitiesBufferGeometry(textureWidth) {
  const bufferGeometry = new ComputeArrayBufferGeometry(textureWidth);
  bufferGeometry.setInitialValues((_) => [0.0, 0.0, 0.0, 1.0]);
  return bufferGeometry;
}

function main(rootEl) {
  const textureWidth = 128;
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

  var velocityBufferGeometry = velocitiesBufferGeometry(textureWidth);
  var velocityGeometryVertices = velocityBufferGeometry.attributes.position;

	var positionBufferGeometry = pointsBufferGeometry(textureWidth);
  var positionGeometryVertices = positionBufferGeometry.attributes.position;

	const points = new THREE.Points( positionBufferGeometry, material );

  const group = new THREE.Group();
  group.add(points);
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
## Dot Physics
Compute shaders and dots. Bounding box
rebounds collisions and changes velocities now.
Not as cool as the less real
one before this.
`;

module.exports = main;
