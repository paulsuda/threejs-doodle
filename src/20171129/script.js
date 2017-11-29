
const THREE = require('three');

function initRenderCanvas(rootEl){
  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( w, h );
  rootEl.appendChild( renderer.domElement );
  return [w, h, renderer];
}

function main(rootEl) {
  console.log('hello world', rootEl);
  const [w, h, renderer] = initRenderCanvas(rootEl);
  const camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
	camera.position.z = 400;
	const scene = new THREE.Scene();
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var material = new THREE.MeshPhongMaterial( {
    color: 0xcc3333,
    specular: 0xffffff,
    shininess: 50
  }  );
  {
    const light = new THREE.PointLight( 0xcccccc, 2, 1500 );
    light.position.set( 200, 250, 300 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x333333, 2, 700 );
    light.position.set( -600, -150, -100 );
    scene.add( light );
  }
  {
    const light = new THREE.PointLight( 0x333333, 2, 900 );
    light.position.set( 300, -850, 100 );
    scene.add( light );
  }
	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

  const animate = () => {
    requestAnimationFrame( animate );
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render( scene, camera );
  };
  animate();
}

module.exports = main;
