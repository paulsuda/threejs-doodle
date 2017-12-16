
const THREE = require('three');
const { cubeFrame, initRenderCanvas, computeTextureSupportCheck } = require('../shared/util');

function makeComputeShaderMaterial(textureWidth){
  var passThruUniforms = {
    texture: { value: null }
  };
  const computeFragmentShader = require('./compute.glsl');
  const passThroughVertexShader = "void main() { gl_Position = vec4( position, 1.0 ); }\n";
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: passThruUniforms,
    vertexShader: passThroughVertexShader,
    fragmentShader: computeFragmentShader,
  });
  shaderMaterial.defines.resolution =
    'vec2( ' + textureWidth.toFixed( 1 ) + ', ' + textureWidth.toFixed( 1 ) + " )";
  return [shaderMaterial, passThruUniforms];
}

function computeInit(verticesArray, textureWidth, renderer){
  computeTextureSupportCheck(renderer);
  var scene = new THREE.Scene();
  var camera = new THREE.Camera();
  camera.position.z = 1;
  const computePlane = new THREE.PlaneBufferGeometry( 2, 2 );

  const [shaderMaterial, passThruUniforms] = makeComputeShaderMaterial(textureWidth);
  const computeMesh = new THREE.Mesh( computePlane, shaderMaterial );
  scene.add(computeMesh);
  const renderTarget = makeRenderTarget(textureWidth);

  const initialValueTexture = new THREE.DataTexture(
    verticesArray, textureWidth, textureWidth, THREE.RGBAFormat, THREE.FloatType );
  initialValueTexture.needsUpdate = true;
  passThruUniforms.texture.value = initialValueTexture;
  renderer.render( scene, camera, renderTarget );
  const returnValuesBuffer = new Float32Array( textureWidth * textureWidth * 4 );
  renderer.readRenderTargetPixels( renderTarget, 0, 0, textureWidth, textureWidth, returnValuesBuffer );
  return [renderTarget, returnValuesBuffer];
}

function makeRenderTarget(textureWidth){
  const options = {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    stencilBuffer: false
  };
  return new THREE.WebGLRenderTarget(
    textureWidth, textureWidth, options
  );
}

function updatePositions(vertices, frameTimeSec){
  const groundY = -1.2;
  const n = vertices.array.length;
  const velocity = -0.31;
  for(let i = 0; i < n; i += 4){
    // vertices.array[i] += 0.0;
    vertices.array[i + 1] += frameTimeSec * velocity;
    // vertices.array[i + 2] += 0.0;
    if(vertices.array[i + 1] < groundY){
      vertices.array[i + 1] = groundY;
    }
  }
  vertices.needsUpdate = true;
}

function pointsBufferGeometry(textureWidth) {
  const scaleFactor = 0.9;
  const pointCount = textureWidth * textureWidth;
  const bufferGeometry = new THREE.BufferGeometry();
  const vertexFloatArray = new Float32Array( pointCount * 4 );
	const vertices = new THREE.BufferAttribute( vertexFloatArray, 4 );
  for(var i = 0; i < pointCount; i++){
    const f = parseFloat(i) / parseFloat(pointCount);
    vertices.array[i * 4] =  f - 0.5;
    vertices.array[i * 4 + 1] = f - 0.5;
    vertices.array[i * 4 + 2] = f - 0.5;
    vertices.array[i * 4 + 3] = 1.0;
  }
  bufferGeometry.addAttribute('position', vertices);
  bufferGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
  return [bufferGeometry, vertices];
}

function main(rootEl) {
  const textureWidth = 4;

  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 0.1, 5.0 );
	camera.position.z = 3.0;
	const scene = new THREE.Scene();
	var [bufferGeometry, geometryVertices] = pointsBufferGeometry(textureWidth);
  var material = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0x55ee33,
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

  const c = new THREE.Clock();
  c.getDelta();

  const [renderTarget, returnValuesBuffer] = computeInit(geometryVertices.array, textureWidth, renderer);
  console.log('computeInit run', geometryVertices.array, returnValuesBuffer);

  const animate = function(){
    let frameTimeSec = c.getDelta();
    if(frameTimeSec < 0 || frameTimeSec > 0.5){
      console.log('Bad frametimesec', frameTimeSec);
      frameTimeSec = 0.05;
    }
    // updatePositions(geometryVertices, frameTimeSec);
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
  };
  renderer.render( scene, camera );
  requestAnimationFrame( animate );
}

module.exports = main;
