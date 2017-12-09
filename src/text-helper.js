const THREE = require('three');

const TextHelper = {
  lineText: initLineText,
  textShape: initTextShape,
  holeShapes: initHoleShapes,
};

/* line outline of the letter shapes */
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

/* for each letter shape, accumulate the hole shapes. */
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

/* returns shapes that represent letters of the message */
function initTextShape(font, message, size, divisions){
  divisions = divisions || 2;
  var textShape = new THREE.BufferGeometry();
  var shapes = font.generateShapes( message, size, divisions );
  var geometry = new THREE.ShapeGeometry( shapes );
  geometry.computeBoundingBox(); // TODO maybe not needed?
  var translateX = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  geometry.translate( translateX, 0, 0 );
  textShape.fromGeometry( geometry );
  return [shapes, textShape, translateX];
}

module.exports = TextHelper;
