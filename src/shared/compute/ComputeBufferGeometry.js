const THREE = require('three');

class ComputeBufferGeometry extends THREE.BufferGeometry {
  constructor(vertices) {
    super();
    this.dynamic = true;
    this.addAttribute('position', vertices);
  }
}

module.exports = ComputeBufferGeometry;
