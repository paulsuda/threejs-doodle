
const THREE = require('three');
const { cubeFrame, initRenderCanvas } = require('../shared/util');
const positionShaderCode = require('./position.glsl');
const velocityShaderCode = require('./velocity.glsl');
const ComputeShaderRunner = require('../shared/compute/ComputeShaderRunner');

function pointsBufferGeometry(textureWidth) {
  const scaleFactor = 3.2;
  const pointCount = textureWidth * textureWidth;
  const bufferGeometry = new THREE.BufferGeometry();
  const vertexFloatArray = new Float32Array( pointCount * 4 );
	const vertices = new THREE.BufferAttribute( vertexFloatArray, 4 );
  for(var i = 0; i < pointCount; i++){
    vertices.array[i * 4] =  Math.random() - 0.5;
    vertices.array[i * 4 + 1] = Math.random() - 0.5;
    vertices.array[i * 4 + 2] = Math.random() - 0.5;
    vertices.array[i * 4 + 3] = 1.0;
  }
  bufferGeometry.addAttribute('position', vertices);
  bufferGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
  return [bufferGeometry, vertices];
}

function main(rootEl) {
  const textureWidth = 64;

  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 0.1, 5.0 );
	camera.position.z = 3.0;
	const scene = new THREE.Scene();
	var [bufferGeometry, geometryVertices] = pointsBufferGeometry(textureWidth);
  var material = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0x5555AA,
    opacity: 0.5,
    transparent: true,
  }  );
  var material2 = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0x3322ff,
    opacity: 0.75,
    transparent: true,
  }  );

	const points = new THREE.Points( bufferGeometry, material );
  bufferGeometry.dynamic = true;

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

  const uniforms = [
    {name: 'positionTexture', format: THREE.RGBAFormat},
    {name: 'velocityTexture', format: THREE.RGBAFormat},
    {name: 'frameTimeSec', format: THREE.FloatType},
  ];


  var velocitiesArray = new Float32Array(geometryVertices.array.length);
  const velocities = new THREE.BufferAttribute( velocitiesArray, 4 );

  for(var i = 0; i < velocitiesArray.length; i += 4){
    velocities.array[i] = 0.0;
    velocities.array[i + 1] = -1.9;
    velocities.array[i + 2] = 0.0;
    velocities.array[i + 3] = 1.0;
  }

  const velocityRunner = new ComputeShaderRunner(
    renderer, textureWidth, uniforms, velocityShaderCode);
  var computedVelocities = velocityRunner.createComputeReturnBuffer();
  var oldVelocities = velocitiesArray;
  const positionRunner = new ComputeShaderRunner(
    renderer, textureWidth, uniforms, positionShaderCode);
  var computedVertices = positionRunner.createComputeReturnBuffer();
  var oldVertices = geometryVertices.array;


  function animate(frameTimeSec){
    console.log(frameTimeSec);

    velocityRunner.computeRun({
      positionTexture: oldVertices,
      velocityTexture: oldVelocities,
      frameTimeSec: frameTimeSec,
    }, computedVelocities);
    /* Double buffer swap old and new */
    [oldVelocities, computedVelocities] = [computedVelocities, oldVelocities];

    positionRunner.computeRun({
      positionTexture: oldVertices,
      velocityTexture: computedVelocities,
      frameTimeSec: frameTimeSec,
    }, computedVertices);
    geometryVertices.setArray(computedVertices);
    geometryVertices.needsUpdate = true;
    /* Double buffer swap old and new */
    [oldVertices, computedVertices] = [computedVertices, oldVertices];



    renderer.render( scene, camera );
  }

  return animate;
}

module.exports = main;
