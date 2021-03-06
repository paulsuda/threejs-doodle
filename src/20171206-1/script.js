
const THREE = require('three');
const { initRenderCanvas } = require('../shared/util');
const TextHelper = require('../shared/text-helper');
const OrbitControls = require('../shared/OrbitControls');

function handleResize(camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function initMaterials(){
  var matDark = new THREE.LineBasicMaterial( {
    color: 0x000000,
    side: THREE.DoubleSide // TODO maybe not needed?
  } );
  var matLite = new THREE.MeshPhongMaterial( {
    color: 0xFFD700,
    specular: 0x888888,
    shininess: 9
  }  );
  return [matDark, matLite];
}

function main(rootEl, [w,h]) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, w / h, 1, 10000 );
  var renderer;
  [w, h, renderer] = initRenderCanvas(
    rootEl, null, (rw, rh) => { return handleResize(camera, rw, rh) }
  );
  const windowScale = new THREE.Vector3(w / 1440.0, h / 759.0, Math.max(w / 1440.0, h / 759.0) );
  camera.position.set(
    771.2857887174272 * windowScale.x,
    0,
    256.4159882863828 * windowScale.z
  );
  var controls = new OrbitControls( camera );
  controls.target.set( 0, 0, 0 );
  controls.minAzimuthAngle = 0.1;
  controls.maxAzimuthAngle = 1.5;
  controls.minPolarAngle = 1.1;
  controls.maxPolarAngle = 1.8;
  controls.update();

  scene.background = new THREE.Color( 0xCCF2FF );
  var loader = new THREE.FontLoader();
  loader.load( './fonts/helvetiker_regular.typeface.json', function ( font ) {
    var [shapes, textShape, xMid] = TextHelper.textShape(font, message, 120);
    var text = new THREE.Mesh( textShape, matLite );
    text.position.z = 5;
    scene.add( text );

    // make line shape ( N.B. edge view remains visible )
    var holeShapes = TextHelper.holeShapes(shapes);
    shapes.push.apply( shapes, holeShapes );

    var lineText = TextHelper.lineText(shapes, matDark, xMid);
    scene.add( lineText );
  });

  var d = new Date();
  var message = d.toLocaleDateString('en-US');
  var [matDark, matLite] = initMaterials();

  {
    const light = new THREE.PointLight( 0xcccccc, 2, 1500 );
    light.position.set( -120, 10, 300 );
    scene.add( light );
  }

  function render() {
    renderer.render( scene, camera );
  }

  return render;
}

main.src = __filename;

main.description = `
## Date
Type, gold material, single light source. Rendering text is complicated,
shapes, holes. TextHelper.
`;

module.exports = main;
