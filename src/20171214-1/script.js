
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
//
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
// function computeInit(textureWidth, renderer){
//
//   if ( ! renderer.extensions.get( "OES_texture_float" ) ) {
//     return "No OES_texture_float support for float textures.";
//   }
//
//   if ( renderer.capabilities.maxVertexTextures === 0 ) {
//     return "No support for vertex shader textures.";
//   }
//
//
//   var scene = new THREE.Scene();
//   var camera = new THREE.Camera();
//   camera.position.z = 1;
//   var passThruUniforms = {
//     texture: { value: null }
//   };
//
//
//   const computeFragmentShader = '';
//   const passThroughVertexShader = "void main() { gl_Position = vec4( position, 1.0 ); }\n";
//   const shaderMaterial = new THREE.ShaderMaterial({
//     uniforms: passThruUniforms,
//     vertexShader: passThroughVertexShader,
//     fragmentShader: computeFragmentShader,
//   });
//   shaderMaterial.defines.resolution = 'vec2( ' + textureWidth.toFixed( 1 ) + ', ' + textureWidth.toFixed( 1 ) + " )";
//
//
//
//   // var passThruShader = createShaderMaterial( getPassThroughFragmentShader(), passThruUniforms );
//   var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), shaderMaterial );
//   scene.add(mesh);
//
//   var currentTargetIndex = 0;
//   function nextTargetIndex(){
//     return (currentTargetIndex == 0 ? 1 : 0);
//   }
//
//   const renderTargets = [
//     makeRenderTarget(textureWidth), makeRenderTarget(textureWidth)
//   ];
//
//   var a = new Float32Array( textureWidth * textureWidth * 4 );
//   for(var i = 0; i < pointCount; i++){
//     a[i] =
//   }
//   const initialValueTexture = new THREE.DataTexture(
//     a, textureWidth, textureWidth, THREE.RGBAFormat, THREE.FloatType );
//   initialValueTexture.needsUpdate = true;
//
//   passThruUniforms.texture.value = initialValueTexture;
//   // mesh.material = shaderMaterial;
//   renderer.render( scene, camera, renderTargets[ currentTargetIndex ] );
//   passThruUniforms.texture.value = renderTargets[ currentTargetIndex ];
//   currentTargetIndex = nextTargetIndex();
//
// }
//
// function makeRenderTarget(textureWidth){
//   return new THREE.WebGLRenderTarget(
//     textureWidth, textureWidth, {
//       wrapS: THREE.ClampToEdgeWrapping,
//       wrapT: THREE.ClampToEdgeWrapping,
//       minFilter: THREE.NearestFilter,
//       magFilter: THREE.NearestFilter,
//       format: THREE.RGBAFormat,
//       type: THREE.FloatType,
//       stencilBuffer: false
//     }
//   );
// }

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
  console.log(bufferGeometry)
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
  }  );
  var material2 = new THREE.PointsMaterial( {
    size: 0.06,
    color: 0x3322ff,
    opacity: 0.75,
    transparent: true,
  }  );

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

  // geometry.computeFlatVertexNormals();

  group.rotation.x += -0.1;
  group.rotation.y += 0.1;

  // initVelocity(points);

  // const c = new THREE.Clock();
  // c.getDelta();

  const animate = function(){
    // let frameTimeSec = c.getDelta();
    // if(frameTimeSec < 0 || frameTimeSec > 0.5){
    //   console.log('Bad frametimesec', frameTimeSec);
    //   frameTimeSec = 0.05;
    // }
    // updateVelocity(points, frameTimeSec);
    // updatePositions(points, frameTimeSec);
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
  };
  renderer.render( scene, camera );
  requestAnimationFrame( animate );
}

module.exports = main;
