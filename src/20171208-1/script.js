
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
    color: 0x222288,
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
  var messageText = 'fu';
  var renderer;
  [w, h, renderer] = initRenderCanvas(
    rootEl, false, (rw, rh) => { return handleResize(camera, rw, rh) }
  );
  const windowScale = new THREE.Vector3(w / 1440.0, h / 759.0, Math.max(w / 1440.0, h / 759.0) );
  console.log(window.innerWidth, window.innerHeight)
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

  document.addEventListener('keydown', (event) => {
    if(event.key == 'f'){
      messageText += 'u';
    }
    else if(event.key == 'g'){
      messageText += 'n';
    }
    return false;
  });


  scene.background = new THREE.Color( 0xFFF233  );
  var loader = new THREE.FontLoader();
  loader.load( '/fonts/helvetiker_regular.typeface.json', function ( font ) {
    var [matDark, matLite] = initMaterials();

    // make shape ( N.B. edge view not visible )
    var text = new THREE.Mesh( new THREE.Geometry(), matLite );
    text.position.z = 5;
    scene.add( text );
    var lineText = new THREE.Object3D();

    {
      const light = new THREE.PointLight( 0xcccccc, 2, 1500 );
      light.position.set( -120, 10, 300 );
      scene.add( light );
    }

    animate();

    function animate() {
      requestAnimationFrame( animate );
      render();
    }
    function render() {
      var message = messageText; //messageString();
      var [shapes, textShape, xMid] = TextHelper.textShape(font, message, 120);
      text.geometry = textShape
      // make line shape ( N.B. edge view remains visible )
      var holeShapes = TextHelper.holeShapes(shapes);
      shapes.push.apply( shapes, holeShapes );
      TextHelper.lineText(shapes, matDark, xMid, lineText);
      scene.add( lineText );

      renderer.render( scene, camera );
    }


  });
}

module.exports = main;
