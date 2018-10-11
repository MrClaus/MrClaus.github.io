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
  var container = document.getElementById('cul');
  //var width = 950; //window.innerWidth || 1;
  //var height = 190; //window.innerHeight || 1;
  var width = getComputedStyle(container).width;
  var height = getComputedStyle(container).height;
  console.log(width, height, "-zoo");
	
  //var aspect = width / height;
  var devicePixelRatio = window.devicePixelRatio || 1;
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( devicePixelRatio );
  renderer.setSize( width, height );
  container.appendChild(renderer.domElement);
  //document.body.appendChild( renderer.domElement );        

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

  //var copyPass = new THREE.ShaderPass( THREE.CopyShader );
  //copyPass.renderToScreen = true;
  //composer.addPass( copyPass );        

  window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize() {
  //var width = 950; //window.innerWidth;
  //var height = 190; //window.innerHeight;
  var width = container.getBoundingClientRect().width;
  var height = $( container ).height();
  console.log(width, height, "-zoo");
	
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
