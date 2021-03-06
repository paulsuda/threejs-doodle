
const THREE = require('three');
const { cubeFrame, initRenderCanvas } = require('../shared/util');
const fragmentShaderCode = require('./computeFragment.glsl');

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
    color: 0xee3333,
    opacity: 0.75,
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

  const positionRunner = new ComputeShaderRunner(
    renderer, textureWidth, uniforms, fragmentShaderCode);
  var returnValuesArray = positionRunner.createComputeReturnBuffer();

  var velocitiesArray = new Float32Array(geometryVertices.array.length);
  for(var i = 0; i < velocitiesArray.length; i += 4){
    velocitiesArray[i] = 0.0;
    velocitiesArray[i + 1] = -0.05;
    velocitiesArray[i + 2] = 0.0;
    velocitiesArray[i + 3] = 1.0;
  }

  function animate(frameTimeSec){
    const oldVertices = geometryVertices.array;

    positionRunner.computeRun({
      positionTexture: geometryVertices.array,
      velocityTexture: velocitiesArray,
      frameTimeSec: frameTimeSec,
    }, returnValuesArray);

    geometryVertices.setArray(returnValuesArray);
    geometryVertices.needsUpdate = true;
    returnValuesArray = oldVertices;
    renderer.render( scene, camera );
  }

  return animate;
}

main.src = __filename;

main.description = `
## Slow-mo Pink Snow
Dots moving down. Reference object.
First use of ComputeShaderRunner.
`;

module.exports = main;
