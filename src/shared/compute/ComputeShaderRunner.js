
const THREE = require('three');
const { computeTextureSupportCheck } = require('../../shared/util');
const computeVertexPassPositionCode = require('./computeVertexPassPosition.glsl');

class ComputeShaderRunner {
  constructor(renderer, textureWidth, uniformInfoList, fragmentShaderCode) {
    this.renderer = renderer;
    this.textureWidth = textureWidth;
    /* Deep clone uniformInfoList so we don't wind up sharing with other
     * runners. */
    this.uniformInfoList = uniformInfoList.map(uniformInfo => ({
      name: uniformInfo.name,
      format: uniformInfo.format,
      _uniformValue: null
    }));
    this.vertexShaderCode = computeVertexPassPositionCode;
    this.fragmentShaderCode = fragmentShaderCode;
    computeTextureSupportCheck(renderer);
    this.renderTarget = this.makeRenderTarget();
    [this.scene, this.camera] = this.makeSceneCamera();
    [this.shaderMaterial, this.shaderUniforms] = this.makeComputeShaderMaterial();
    this.computeMesh = this.makeComputeMesh();
    this.scene.add(this.computeMesh);
  }

  makeComputeMesh(){
    const computePlane = new THREE.PlaneBufferGeometry( 2, 2 );
    const computeMesh = new THREE.Mesh(computePlane, this.shaderMaterial);
    return computeMesh;
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
      stencilBuffer: false,
      depthBuffer: false
    };
    return new THREE.WebGLRenderTarget(
      this.textureWidth, this.textureWidth, options
    );
  }

  makeComputeShaderMaterial(){
    var passThruUniforms = {};
    this.uniformInfoList.forEach((uniformInfo) => {
      const initValue = (uniformInfo.format == THREE.RGBAFormat) ? null : 0.03333;
      const uniformValue = { value: initValue };
      passThruUniforms[uniformInfo.name] = uniformValue;
      uniformInfo._uniformValue = uniformValue;
    });
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: passThruUniforms,
      vertexShader: this.vertexShaderCode,
      fragmentShader: this.fragmentShaderCode,
    });
    this.passThruUniforms = passThruUniforms;
    shaderMaterial.defines.resolution =
      'vec2( ' + this.textureWidth.toFixed( 1 ) + ', ' + this.textureWidth.toFixed( 1 ) + " )";
    return [shaderMaterial, passThruUniforms];
  }

  createComputeReturnBuffer() {
    const returnValuesArray =
      new Float32Array( this.textureWidth * this.textureWidth * 4 );
    return returnValuesArray;
  }

  dataTextureFromArray(uniformInfo, dataArray){
    const texFormat = uniformInfo.format ? uniformInfo.format : THREE.RGBAFormat;
    const tex = new THREE.DataTexture(
      dataArray,
      this.textureWidth, this.textureWidth,
      texFormat, THREE.FloatType );
    tex.needsUpdate = true;
    uniformInfo._uniformValue.value = tex;
  }

  computeRun(uniformValues, returnValuesArray) {
    this.uniformInfoList.forEach((uniformInfo) => {
      if(uniformInfo.format == THREE.RGBAFormat){
        this.dataTextureFromArray(uniformInfo, uniformValues[uniformInfo.name]);
      }
      else{
        uniformInfo._uniformValue.value = uniformValues[uniformInfo.name];
      }
    });
    this.renderer.render( this.scene, this.camera, this.renderTarget );
    this.renderer.readRenderTargetPixels( this.renderTarget,
      0, 0, this.textureWidth, this.textureWidth, returnValuesArray );
  }
}

module.exports = ComputeShaderRunner;
