
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

function messageString(){
  const d = new Date();
  return d.toLocaleDateString('en-US') + ' ' + d.toLocaleTimeString('en-US');
}

function main(rootEl, [w,h]) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, w / h, 1, 10000 );
  var renderer;
  [w, h, renderer] = initRenderCanvas(
    rootEl, false, (rw, rh) => { return handleResize(camera, rw, rh) }
  );
  const windowScale = new THREE.Vector3(w / 1440.0, h / 759.0, Math.max(w / 1440.0, h / 759.0) );
  camera.position.set(
    2771.2857887174272 * windowScale.x,
    0,
    1256.4159882863828 * windowScale.z
  );
  var controls = new OrbitControls( camera );
  controls.target.set( 0, 0, 0 );
  controls.minAzimuthAngle = 0.1;
  controls.maxAzimuthAngle = 1.5;
  controls.minPolarAngle = 1.1;
  controls.maxPolarAngle = 1.8;
  controls.update();

  scene.background = new THREE.Color( 0xCCF2FF );
  var [matDark, matLite] = initMaterials();
  var text = new THREE.Mesh( new THREE.Geometry(), matLite );
  text.position.z = 5;
  scene.add( text );
  // make shape ( N.B. edge view not visible )
  var lineText = new THREE.Object3D();
  {
    const light = new THREE.PointLight( 0xcccccc, 2, 1500 );
    light.position.set( -120, 10, 300 );
    scene.add( light );
  }
  var loader = new THREE.FontLoader();
  var font = null;
  function render() {
    if(font == null){ return; }
    var message = messageString();
    var [shapes, textShape, xMid] = TextHelper.textShape(font, message, 120);
    text.geometry = textShape
    // make line shape ( N.B. edge view remains visible )
    var holeShapes = TextHelper.holeShapes(shapes);
    shapes.push.apply( shapes, holeShapes );
    TextHelper.lineText(shapes, matDark, xMid, lineText);
    scene.add( lineText );
    renderer.render( scene, camera );
  }
  loader.load( '/fonts/helvetiker_regular.typeface.json', function ( loadedFont ) {
    font = loadedFont;
  });
  return render;
}

module.exports = main;
