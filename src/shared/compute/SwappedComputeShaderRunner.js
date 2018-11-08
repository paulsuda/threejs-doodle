
const ComputeArrayBufferGeometry = require('./ComputeArrayBufferGeometry');
const ComputeShaderRunner = require('./ComputeShaderRunner')

class SwappedComputeShaderRunner extends ComputeShaderRunner{
  constructor(renderer, textureWidth, uniformInfoList, fragmentShaderCode, setInitialValuesFn = null){
    super(renderer, textureWidth, uniformInfoList, fragmentShaderCode);
    this.setInitialValuesFn = setInitialValuesFn;
    this.computed = this.createComputeReturnBuffer();
    this.bufferGeometry = this.createBufferGeometry();
    this.geometryVertices = this.bufferGeometry.attributes.position;
    this.old = this.geometryVertices.array;
  }

  createBufferGeometry() {
    const geometry = new ComputeArrayBufferGeometry(this.textureWidth);
    if(this.setInitialValuesFn){
      geometry.setInitialValues(this.setInitialValuesFn);
    }
    return geometry;
  }

}

module.exports = SwappedComputeShaderRunner;
