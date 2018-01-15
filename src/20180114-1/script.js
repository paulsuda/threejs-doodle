const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');
const positionShaderCode = require('./position.glsl');
const velocityShaderCode = require('./velocity.glsl');
const ComputeShaderRunner = require('../shared/compute/ComputeShaderRunner');
const ComputeBufferGeometry = require('../shared/compute/ComputeBufferGeometry');

class ComputeArrayBufferGeometry extends ComputeBufferGeometry {
  constructor(textureWidth, vectorSizeInit) {
    const vectorSize = vectorSizeInit || 4;
    const pointCount = textureWidth * textureWidth;
    const vertexFloatArray = new Float32Array( pointCount * vectorSize );
    const vertices = new THREE.BufferAttribute( vertexFloatArray, vectorSize );
    vertices.dynamic = true;
    super(vertices);
    this.computeTextureWidth = textureWidth;
    this.computeVectorSize = vectorSize;
  }

  setInitialValues(fn) {
    const pointCount = this.computeTextureWidth * this.computeTextureWidth;
    const vertices = this.attributes.position;
    for(var i = 0; i < pointCount; i++){
      const values = fn(i);
      for(var j = 0; j < this.vectorSize; j++){
        vertices.array[i * 4 + j] = values[j];
      }
    }
  }
}

function pointsBufferGeometry(textureWidth) {
  const pointCount = textureWidth * textureWidth;
  const bufferGeometry = new ComputeArrayBufferGeometry(textureWidth);
  const vertices = bufferGeometry.attributes.position;
  for(var i = 0; i < pointCount; i++){
    vertices.array[i * 4] =  Math.random() - 0.5;
    vertices.array[i * 4 + 1] = Math.random() - 0.5;
    vertices.array[i * 4 + 2] = Math.random() - 0.5;
    vertices.array[i * 4 + 3] = 1.0;
  }
  return bufferGeometry;
}

function velocitiesBufferGeometry(textureWidth) {
  const pointCount = textureWidth * textureWidth;
  const bufferGeometry = new ComputeArrayBufferGeometry(textureWidth);
  const vertices = bufferGeometry.attributes.position;
  for(var i = 0; i < pointCount; i++){
    vertices.array[i * 4] = 0.0;
    vertices.array[i * 4 + 1] = 0.0;
    vertices.array[i * 4 + 2] = 0.0;
    vertices.array[i * 4 + 3] = 1.0;
  }
  return bufferGeometry;
}

function main(rootEl) {
  const textureWidth = 128;
  var material = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0x448822,
    opacity: 0.5,
    transparent: true,
  }  );

  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 45, w / h, 1.0, 5.0 );
	camera.position.z = 3.0;
  camera.position.y = -0.3;
	const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF8F8F8);

  var velocityBufferGeometry = velocitiesBufferGeometry(textureWidth);
  const velocityGeometryVertices = velocityBufferGeometry.attributes.position;

	var positionBufferGeometry = pointsBufferGeometry(textureWidth);
  const positionGeometryVertices = positionBufferGeometry.attributes.position;
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
## Colors
More dot physics, starting w colored dots.
`;

module.exports = main;
