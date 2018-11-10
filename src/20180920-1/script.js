const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');
const positionShaderCode = require('./position.glsl');
const velocityShaderCode = require('./velocity.glsl');
const SwappedComputeShaderRunner = require('../shared/compute/SwappedComputeShaderRunner');

function main(rootEl) {
  const textureWidth = 128;
  var material = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: THREE.VertexColors,
    sizeAttenuation: true,
  });

  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 45, w / h, 1.0, 5.0 );
	camera.position.z = 2.0;
  camera.position.x = 0.0;
  camera.position.y = 0.0;
	const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  function generateColorRange(vertices, n){
    const colors = new Float32Array(n * 3);
    const red = new THREE.Color(0xeeFFcc);
    const blue = new THREE.Color(0xFFddcc);
    for(let i = 0; i < n; i += 1){
      const x = vertices[i * 4];
      const newColor = x > 0.0 ? red : blue;
      colors[i * 3] = newColor.r;
      colors[i * 3 + 1] = newColor.g;
      colors[i * 3 + 2] = newColor.b;
    }
    return colors;
  }

  const uniforms = [
    {name: 'positionTexture', format: THREE.RGBAFormat},
    {name: 'velocityTexture', format: THREE.RGBAFormat},
    {name: 'frameTimeSec', format: THREE.FloatType},
  ];

  const velocityRunner = new SwappedComputeShaderRunner(
    renderer, textureWidth, uniforms, velocityShaderCode, (_) => [0.0, 0.0, 0.0, 1.0]);

  const r = (_) => Math.random() - 0.5;

  // const seedConst = 500000.0;
  // const seed = 0.9235;
  // function r(x){
  //   return ((Math.sin(x) * seedConst * seed) % 1) - 0.5;
  // }

  const positionRunner = new SwappedComputeShaderRunner(
    renderer, textureWidth, uniforms, positionShaderCode, (i) => [
      r((Math.floor(i % textureWidth)) / textureWidth),
      r((Math.floor(i / textureWidth)) / textureWidth),
      0.0, 1.0]);

  positionRunner.bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute(
    generateColorRange(positionRunner.geometryVertices.array, textureWidth * textureWidth), 3 ) );

	const points = new THREE.Points( positionRunner.bufferGeometry, material );
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  function animate(frameTimeSec){
    /* Calculate updated velocity vectors. */
    velocityRunner.computeRun({
      positionTexture: positionRunner.old,
      velocityTexture: velocityRunner.old,
      frameTimeSec: frameTimeSec,
    });

    /* Move positions by their respective velocities. */
    positionRunner.computeRun({
      positionTexture: positionRunner.old,
      velocityTexture: velocityRunner.computed,
      frameTimeSec: frameTimeSec,
    });

    /* Double buffer swap old and new */
    velocityRunner.swapBuffers();
    positionRunner.swapBuffers();

    renderer.render( scene, camera );
  }

  return animate;
}

main.src = __filename;

main.description = `
## 2D Circle w Dots
Randomized Brownian motion, collision with a circle.
`;

module.exports = main;
