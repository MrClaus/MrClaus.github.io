// Запускает скрипт только после полной загрузки страницы (кода)
window.onload = start;


// Добавляем поддежку плавного обновления экрана (requestAnimationFrame) в разных браузерах 
var requestAF = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame;


var renderer, composer, texturePass;


function start() {
  init();
  animate();
}


function init() {
  var container = document.getElementById('container');  
  var width = window.innerWidth || 1;
  var height = width / 5;
  var devicePixelRatio = window.devicePixelRatio || 1;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( devicePixelRatio );
  renderer.setSize( width, height );
  container.appendChild(renderer.domElement);      

  // postprocessing        
  composer = new THREE.EffectComposer( renderer );
  texturePass = new THREE.TexturePass();
  texturePass.enabled = true;
  texturePass.opacity = 1.0;
  composer.addPass( texturePass );
  var textureLoader = new THREE.TextureLoader();
  textureLoader.load( "res/logo-min.jpg", function( map ) {
    texturePass.map = map;
  });
	
  var glitchPass = new THREE.GlitchPass();
  glitchPass.renderToScreen = true;
  composer.addPass( glitchPass );       

  window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize() {
  var width = window.innerWidth || 1;
  var height = width / 5;	
  renderer.setSize( width, height );
  var pixelRatio = renderer.getPixelRatio();
  var newWidth  = Math.floor( width / pixelRatio ) || 1;
  var newHeight = Math.floor( height / pixelRatio ) || 1;
  composer.setSize( newWidth, newHeight );
}


function animate() {
  requestAF( animate );
  composer.render();
}
