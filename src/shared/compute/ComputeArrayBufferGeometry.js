const THREE = require('three');
const ComputeBufferGeometry = require('./ComputeBufferGeometry');

class ComputeArrayBufferGeometry extends ComputeBufferGeometry {
  constructor(textureWidth, vectorSizeInit) {
    const vectorSize = vectorSizeInit || 4;
    const pointCount = textureWidth * textureWidth;
    const vertexFloatArray = new Float32Array( pointCount * vectorSize );
    const vertices = new THREE.BufferAttribute( vertexFloatArray, vectorSize );
    vertices.dynamic = true;
    super(vertices);
    this.computeTextureWidth = textureWidth;
    this.computeVectorSize = vectorSize;
  }

  setInitialValues(fn) {
    const pointCount = this.computeTextureWidth * this.computeTextureWidth;
    const vertices = this.attributes.position;
    for(var i = 0; i < pointCount; i++){
      const values = fn(i);
      for(var j = 0; j < this.computeVectorSize; j++){
        vertices.array[(i * this.computeVectorSize) + j] = values[j];
      }
    }
    return this;
  }
}

module.exports = ComputeArrayBufferGeometry;
