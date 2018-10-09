// Запускает скрипт только после полной загрузки страницы (кода)
window.onload = initApplication;


// Добавляем поддежку плавного обновления экрана (requestAnimationFrame) в разных браузерах 
var requestAF = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame;


var renderer, composer;
var texturePass;



init();
animate();

function init() {
  var container = document.getElementById( "container" );
  var width = window.innerWidth || 1;
  var height = window.innerHeight || 1;
  var aspect = width / height;
  var devicePixelRatio = window.devicePixelRatio || 1;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( devicePixelRatio );
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );        

  // postprocessing        
  composer = new THREE.EffectComposer( renderer );
  texturePass = new THREE.TexturePass();
  texturePass.enabled = true;
  texturePass.opacity = 1.0;
  composer.addPass( texturePass );
  var textureLoader = new THREE.TextureLoader();
  textureLoader.load( "textures/hardwood2_diffuse.jpg", function( map ) {
    texturePass.map = map;
  });

  var copyPass = new THREE.ShaderPass( THREE.CopyShader );
  copyPass.renderToScreen = true;
  composer.addPass( copyPass );        

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;
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
