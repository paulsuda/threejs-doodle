
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

  swapBuffers() {
    const s = this.old;
    this.old = this.computed;
    this.computed = s;
  }

  computeRun(uniformValues) {
    super.computeRun(uniformValues, this.computed);
    this.geometryVertices.setArray(this.computed);
    this.geometryVertices.needsUpdate = true;
  }

}

module.exports = SwappedComputeShaderRunner;
