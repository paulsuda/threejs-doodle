
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');

function cubeFrame(size){
  const geometry = new THREE.BoxBufferGeometry( size, size, size );
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff22,
    wireframe: true,
  });
  const mesh = new THREE.Mesh( geometry, material );
  return mesh;
}


function makeComputeShaderMaterial(textureWidth){
  var passThruUniforms = {
    texture: { value: null }
  };
  const computeFragmentShader = "void main() { gl_FragColor = vec4(1.0, 2.0, 3.0, 4.0); }\n";
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


// function initVelocity(points){
//   const n = points.geometry.vertices.length;
//   points.userData.velocities = new Array(n);
//   for(let i = 0; i < n; i += 1){
//     points.userData.velocities[i] = new THREE.Vector3(0.0, 0.0, 0.0);
//   }
// }
//
// function updateVelocity(points, frameTimeSec){
//   const n = points.userData.velocities.length;
//   const gAcceleration = -1.8;
//   const g = new THREE.Vector3(0.0, gAcceleration * frameTimeSec, 0.0);
//   for(let i = 0; i < n; i += 1){
//     points.userData.velocities[i].add(g);
//   }
// }
//
// function updatePositions(points, frameTimeSec){
//   const groundY = -1.2;
//   const bounceFactor = -0.9;
//   const n = points.userData.velocities.length;
//   for(let i = 0; i < n; i += 1){
//     const v = points.userData.velocities[i];
//     points.geometry.vertices[i].x += frameTimeSec * v.x;
//     points.geometry.vertices[i].y += frameTimeSec * v.y;
//     points.geometry.vertices[i].z += frameTimeSec * v.z;
//     if(points.geometry.vertices[i].y < groundY){
//       points.geometry.vertices[i].y = groundY;
//       /* Bounce! */
//       points.userData.velocities[i].y = points.userData.velocities[i].y * bounceFactor;
//     }
//   }
//   points.geometry.verticesNeedUpdate = true;
// }
//
function computeInit(verticesArray, textureWidth, renderer){

  if ( ! renderer.extensions.get( "OES_texture_float" ) ) {
    return "No OES_texture_float support for float textures.";
  }

  if ( renderer.capabilities.maxVertexTextures === 0 ) {
    return "No support for vertex shader textures.";
  }

  var scene = new THREE.Scene();
  var camera = new THREE.Camera();
  camera.position.z = 1;
  const computePlane = new THREE.PlaneBufferGeometry( 2, 2 );

  const [shaderMaterial, passThruUniforms] = makeComputeShaderMaterial(textureWidth);
  const computeMesh = new THREE.Mesh( computePlane, shaderMaterial );
  scene.add(computeMesh);
  const renderTarget = makeRenderTarget(textureWidth);

  // var a = vertices.array;
        // var a = new Float32Array( textureWidth * textureWidth * 4 );
      //   for(var i = 0; i < pointCount; i++){
      //     a[i] =
      //   }
  const initialValueTexture = new THREE.DataTexture(
    verticesArray, textureWidth, textureWidth, THREE.RGBAFormat, THREE.FloatType );
  initialValueTexture.needsUpdate = true;
  passThruUniforms.texture.value = initialValueTexture;
  console.log('renderer', renderer.render( scene, camera, renderTarget ));
  console.log(renderTarget);

  const returnValuesBuffer = new Float32Array( textureWidth * textureWidth * 4 );
  renderer.readRenderTargetPixels( renderTarget, 0, 0, textureWidth, textureWidth, returnValuesBuffer );
  // passThruUniforms.texture.value = renderTarget;
  debugger;
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
  for(let i = 0; i < n; i += 3){
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
    updatePositions(geometryVertices, frameTimeSec);
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
  };
  renderer.render( scene, camera );
  requestAnimationFrame( animate );
}

module.exports = main;
