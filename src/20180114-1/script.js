const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');
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
  var material = new THREE.PointsMaterial({
    size: 0.02,
    // color: 0xFF0000,
    vertexColors: THREE.VertexColors,
    // alphaTest: 0.9,
    // transparent: true,
    sizeAttenuation: true,
  });
  // material.color.setHSL( 1.0, 0.2, 0.7 );

  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 45, w / h, 1.0, 5.0 );
	camera.position.z = 3.0;
  camera.position.y = -0.3;
	const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF8F8F8);

  var velocityBufferGeometry = velocitiesBufferGeometry(textureWidth);
  const velocityGeometryVertices = velocityBufferGeometry.attributes.position;

  function generateColorRange(vertices, n){
    const colors = new Float32Array(n * 3);
    for(let i = 0; i < n; i += 1){
      const x = vertices[i * 4];
      const z = vertices[i * 4 + 2];
      const newColor = new THREE.Color();
      var hue = (Math.atan( x / z ) / (1.0 * Math.PI) ) + 0.5;
      if(x < 0.0){
        hue += 1.0;
      }
      hue = hue / 2.0;
      newColor.setHSL(hue, 0.96, 0.48);
      colors[i * 3] = newColor.r;
      colors[i * 3 + 1] = newColor.g;
      colors[i * 3 + 2] = newColor.b;
    }
    return colors;
  }

	var positionBufferGeometry = pointsBufferGeometry(textureWidth);
  const positionGeometryVertices = positionBufferGeometry.attributes.position;

  positionBufferGeometry.addAttribute( 'color', new THREE.BufferAttribute(
    generateColorRange(positionGeometryVertices.array, textureWidth * textureWidth), 3 ) );


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
## Confetti Dot Physics
More dot physics, party version.
`;

module.exports = main;
