
const ComputeArrayBufferGeometry = require('./ComputeArrayBufferGeometry');
const ComputeShaderRunner = require('./ComputeShaderRunner')

class SwappedComputeShaderRunner extends ComputeShaderRunner{
  constructor(renderer, textureWidth, uniformInfoList, fragmentShaderCode, initVertexArray = null){
    super(renderer, textureWidth, uniformInfoList, fragmentShaderCode);
    this.computed = this.createComputeReturnBuffer();
    this.bufferGeometry = this.createBufferGeometry(initVertexArray);
    this.geometryVertices = this.bufferGeometry.attributes.position;
    this.old = this.geometryVertices.array;
  }

  createBufferGeometry(initVertexArray) {
    const geometry = new ComputeArrayBufferGeometry(this.textureWidth, 4, initVertexArray);
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
