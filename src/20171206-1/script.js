
const THREE = require('three');
const { initRenderCanvas } = require('../util');

THREE.OrbitControls = require('./OrbitControls');

function initLineText(shapes, material, translateX){
  var lineText = new THREE.Object3D();
  for ( var i = 0; i < shapes.length; i ++ ) {
    var shape = shapes[ i ];
    var points = shape.getPoints();
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var lineMesh = new THREE.Line( geometry, material );
    geometry.translate( translateX, 0, 0 );
    lineText.add( lineMesh );
  }
  return lineText;
}

function initHoleShapes(shapes){
  var holeShapes = [];
  for ( var i = 0; i < shapes.length; i ++ ) {
    var shape = shapes[ i ];
    if ( shape.holes && shape.holes.length > 0 ) {
      for ( var j = 0; j < shape.holes.length; j ++ ) {
        var hole = shape.holes[ j ];
        holeShapes.push( hole );
      }
    }
  }
  return holeShapes;
}

function initTextShape(font, message){
  var textShape = new THREE.BufferGeometry();
  var shapes = font.generateShapes( message, 100, 2 );
  var geometry = new THREE.ShapeGeometry( shapes );
  geometry.computeBoundingBox(); // TODO maybe not needed?
  var translateX = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  geometry.translate( translateX, 0, 0 );
  textShape.fromGeometry( geometry );
  return [shapes, textShape, translateX];
}

function initMaterials(){
  var matDark = new THREE.LineBasicMaterial( {
    color: 0x000000,
    side: THREE.DoubleSide // TODO maybe not needed?
  } );
  var matLite = new THREE.MeshBasicMaterial( {
    color: 0xFFD700,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide // TODO maybe not needed?
  } );
  return [matDark, matLite];
}

function main(rootEl) {
  const [w, h, renderer] = initRenderCanvas(rootEl);
  var camera, scene;
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 0, - 400, 600 );
  var controls = new THREE.OrbitControls( camera );
  controls.target.set( 0, 0, 0 );
  controls.update();
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xCCF2FF );
  var loader = new THREE.FontLoader();
  loader.load( '/fonts/helvetiker_regular.typeface.json', function ( font ) {
    var d = new Date();
    var message = d.toLocaleDateString('en-US');
    var [matDark, matLite] = initMaterials();
    var [shapes, textShape, xMid] = initTextShape(font, message);

    // make shape ( N.B. edge view not visible )
    var text = new THREE.Mesh( textShape, matLite );
    text.position.z = 5;
    scene.add( text );

    // make line shape ( N.B. edge view remains visible )
    var holeShapes = initHoleShapes(shapes);
    shapes.push.apply( shapes, holeShapes );

    var lineText = initLineText(shapes, matDark, xMid);
    scene.add( lineText );


    animate();
    function animate() {
      requestAnimationFrame( animate );
      render();
    }
    function render() {
      renderer.render( scene, camera );
    }
  });
}

// window.addEventListener( 'resize', onWindowResize, false );
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize( window.innerWidth, window.innerHeight );
// }



module.exports = main;
