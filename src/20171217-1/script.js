
const THREE = require('three');
const { cubeFrame, initRenderCanvas, computeTextureSupportCheck } = require('../shared/util');

class ComputeShaderRunner {
  constructor(renderer, textureWidth) {
    computeTextureSupportCheck(renderer);
    this.renderer = renderer;
    this.textureWidth = textureWidth;
    this.renderTarget = this.makeRenderTarget();
    [this.scene, this.camera] = this.makeSceneCamera();
    [this.shaderMaterial, this.passThruUniforms] = this.makeComputeShaderMaterial();
    this.computePlane = new THREE.PlaneBufferGeometry( 2, 2 );
    this.computeMesh = new THREE.Mesh( this.computePlane, this.shaderMaterial );
    this.scene.add(this.computeMesh);
  }

  makeSceneCamera() {
    var scene = new THREE.Scene();
    var camera = new THREE.Camera();
    camera.position.z = 1;
    return [scene, camera];
  }

  makeRenderTarget() {
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
      this.textureWidth, this.textureWidth, options
    );
  }

  makeComputeShaderMaterial(){
    var passThruUniforms = {
      positionTexture: { value: null }
    };
    const computeFragmentShader = require('./computeFragment.glsl');
    const passThroughVertexShader = require('./computeVertex.glsl');
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: passThruUniforms,
      vertexShader: passThroughVertexShader,
      fragmentShader: computeFragmentShader,
    });
    shaderMaterial.defines.resolution =
      'vec2( ' + this.textureWidth.toFixed( 1 ) + ', ' + this.textureWidth.toFixed( 1 ) + " )";
    return [shaderMaterial, passThruUniforms];
  }

  computeReturnBuffer() {
    const returnValuesArray =
      new Float32Array( this.textureWidth * this.textureWidth * 4 );
    return returnValuesArray;
  }

  computeTextureFromArray(uniformInfo, dataArray){
    console.log(arguments);
    const texFormat = uniformInfo.format ? uniformInfo.format : THREE.RGBAFormat;
    const tex = new THREE.DataTexture(
      dataArray,
      this.textureWidth, this.textureWidth,
      texFormat, THREE.FloatType );
    tex.needsUpdate = true;
    this.passThruUniforms[uniformInfo.name].value = tex;
  }

  computeRun(verticesArray, returnValuesArray) {
    const textureUniformInfo = [
      {name: 'positionTexture', format: THREE.RGBAFormat}
    ];
    textureUniformInfo.forEach((uniformInfo) => {
      this.computeTextureFromArray(uniformInfo, verticesArray[uniformInfo.name]);
    });
    this.renderer.render( this.scene, this.camera, this.renderTarget );
    this.renderer.readRenderTargetPixels( this.renderTarget,
      0, 0, this.textureWidth, this.textureWidth, returnValuesArray );
    return returnValuesArray;
  }
}

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

  const shaderRunner = new ComputeShaderRunner(renderer, textureWidth);
  var returnValuesArray = shaderRunner.computeReturnBuffer();

  function updatePositions(inArray, outArray, frameTimeSec){
    shaderRunner.computeRun({positionTexture: inArray}, outArray);
  }

  function animate(frameTimeSec){
    const oldVertices = geometryVertices.array;
    updatePositions(geometryVertices.array, returnValuesArray, frameTimeSec);
    geometryVertices.setArray(returnValuesArray);
    geometryVertices.needsUpdate = true;
    returnValuesArray = oldVertices;
    renderer.render( scene, camera );
  }

  return animate;
}

module.exports = main;
