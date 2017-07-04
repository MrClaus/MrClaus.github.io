// Запускает скрипт только после полной загрузки страницы (кода)
window.onload = initApplication;



// Добавляем поддежку плавного обновления экрана (requestAnimationFrame) в разных браузерах 
var requestAF = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame;



// Инициализируем прочие глобальные переменные
var container, scene, camera, render3D;
var width = window.innerWidth;
var height = window.innerHeight;			
var controls;			
var texFlare, texFlare1245, texFlare3, texFlare6, texFlare7;

var skyBox, mapSky;	
var stats, delta;			
var composer, effectFilm, effectVignette, glitchPass, effectFilm, bloomPass;			
var mouseX = 0, mouseY = 0;

var clock = new THREE.Clock();
var lon = 90, lat = 0, phi = 0, theta = 0, distance = 500;

var paramsBloom = {
	projection: 'normal',
	background: false,
	exposure: 1.0,
	bloomStrength: 1.5,
	bloomThreshold: 0.85,
	bloomRadius: 0.4
};

	
	
// Стартовая функция, которая инициализирует текущее iFrame приложение для VK 
function initApplication() {
	/*
	VK.init(function() {
		console.log('VK Application inited');
		start();					
	}, function() {
		console.log('Error inited VK application');		
	}, '5.58'); */
	start(); 
}



// Предстартовая проверка на поддержку WebGL текущим браузером
function start() {
	if (!Detector.webgl) Detector.addGetWebGLMessage();
	resLoad();	
}



// Чтобы исключить асинхронное выполнение кода с параллельной загрузкой, сначала ожидаем загрузку всех ресурсов, а после - переходим дальше
function resLoad() {
	
	// *** Основной код ***
	
	var count = 0;
	var count_res = 6;
	
	mapSky = loadIMG("tex.png");
	
	texFlare = loadIMG("res/flare/flare0.png");
	texFlare1245 = loadIMG("res/flare/flare1245.png");
	texFlare3 = loadIMG("res/flare/flare3.png");
	texFlare6 = loadIMG("res/flare/flare6.png");
	texFlare7 = loadIMG("res/flare/flare7.png");
		
	// *** Конец основного кода ***
	
	
	// *** Неосновной код, содержащий используемые функции в данной процедуре ***	
	
	function loadIMG(url) {					
		return new THREE.TextureLoader().load(
			url,
			function() {
				count++;
				console.log('Img - source load: ', 100 * count / count_res, '%');
				if(count == count_res) initScene();
			}
		);						
	}
	
	// *** Конец неосновного кода ***
	
}



// Инициализация сцены заставки
function initScene() {	
	
	// *** Основной код ***	
	
	initScene3D(); // инициализация 3д сцены
	initObject3D(); // инициализация объектов сцены
	initEffect3D(); // добавление эффектов рендера при отображении
	renderIntro(); // рендер сцены
	
	// *** Конец неосновного кода ***
	
}



// Инициализация 3D сцены заставки на three
function initScene3D() {
	
	// *** Основной код ***
	
	// создаём исполняемый элемент контейнер и добавляем его в html документ
	container = document.createElement('div');
	document.body.appendChild(container);				
	
	// создаём сцену
	scene = new THREE.Scene();
	
	// создаём камеру
	camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 101000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 0;
					
	// создаем рендерный движок и задаем ему параметры
	render3D = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	render3D.setPixelRatio(window.devicePixelRatio);
	render3D.setSize(width, height);				
	render3D.autoClear = false;
	render3D.gammaInput = true;
	render3D.gammaOutput = true;
	render3D.shadowMap.enabled = true; // желателен для эффекта bloom
	container.appendChild(render3D.domElement);
	
	// *** Конец основного кода ***
					
}



// Инициализация объектов сцены
function initObject3D() {
	
	// *** Основной код ***
	
	// создаем источник освещения DirectionalLight
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, -30000);
	light.color.setHSL(0.618, 0.45, 1.0);
	scene.add(light);
	
	// создаем источник освещения AmbientLight
	var ambient = new THREE.AmbientLight(0x101010);
	scene.add(ambient);				
	
	// создаём блики камеры
	flare = addFlare(0.618, 0.45, 1.0, 0, 0, -30000);
	scene.add(flare);
	
	// создаём скайбокс	
	skyBox = createSky(300, 64, mapSky);
	scene.add(skyBox);
	
	// добавляем в контейнер параметры отображения статистики (фпс, миллисекунды на кадр и ...)
	stats = new Stats();
	container.appendChild(stats.domElement);
	
	// *** Конец основного кода ***
	
	
	// *** Неосновной код, содержащий используемые функции в данной процедуре ***
	
	function addFlare(h, s, l, x, y, z) {
		var flareColor = new THREE.Color(0xffffff);
		flareColor.setHSL(h, s, l);
		var lensFlare = new THREE.LensFlare(texFlare, 256, 0.01, THREE.AdditiveBlending, flareColor);
		lensFlare.add(texFlare1245, 160, 0.0, THREE.AdditiveBlending);
		lensFlare.add(texFlare1245, 160, 0.0, THREE.AdditiveBlending);
		lensFlare.add(texFlare3, 1024, 0.0, THREE.AdditiveBlending);
		lensFlare.add(texFlare1245, 196, 0.356, THREE.AdditiveBlending);
		lensFlare.add(texFlare1245, 128, 0.62, THREE.AdditiveBlending);
		lensFlare.add(texFlare6, 320, 0.833, THREE.AdditiveBlending);
		lensFlare.add(texFlare7, 720, 1.0, THREE.AdditiveBlending);
		lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		lensFlare.position.set(x, y, z);
		return lensFlare;					
	}
	
	function lensFlareUpdateCallback(object) {
		var f, fl = object.lensFlares.length;
		var flare;
		var vecX = -object.positionScreen.x * 2;
		var vecY = -object.positionScreen.y * 2;
		for(f = 0; f < fl; f++) {
			flare = object.lensFlares[f];
			flare.x = object.positionScreen.x + vecX * flare.distance;
			flare.y = object.positionScreen.y + vecY * flare.distance;
			flare.rotation = 0;
		}
		object.lensFlares[2].y += 0.025;
		object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad(45);
	}
	
	function createSky(radius, segments, map) {
		var geometry = new THREE.SphereGeometry( radius, segments, segments );
		geometry.scale( - 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( {
			map: map
		} );
		var skyBox = new THREE.Mesh( geometry, material );
		return skyBox;
	}
	
	// *** Конец неосновного кода ***
	
}



// Инициализации используемых эффектов постпроцессинга (после рендера)
function initEffect3D() {

	// *** Основной код ***
	
	// задаём параметры EffectComposer-а
	var rtParameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: true
	};
	
	// создаем композёр (для добавления различных эффектов)
	composer = new THREE.EffectComposer(render3D, new THREE.WebGLRenderTarget(width, height, rtParameters));
					
	// создаём эффект для композёра Vignette
	var shaderVignette = THREE.VignetteShader;
	effectVignette = new THREE.ShaderPass(shaderVignette);
	effectVignette.uniforms["offset"].value = 0.95;
	effectVignette.uniforms["darkness"].value = 1.6;
	effectVignette.renderToScreen = true;
	
	// создаём эффект для композёра Film
	effectFilm = new THREE.FilmPass(0.35, 0.75, 2048, false);
	effectFilm.renderToScreen = false;				
					
	// создаём эффект для композёра Glitch
	glitchPass = new THREE.GlitchPass();
	glitchPass.goWild = false;
	glitchPass.renderToScreen = true; // истина задается последнему отрисовываему эффекту, который рендрит все предыдущие
	
	// создаём эффект для композера Bloom
	bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
	bloomPass.renderToScreen = false;
	
	// добавляем созданные эффекты в композёр, начиная с рендринга сцены
	composer.addPass(new THREE.RenderPass(scene, camera));
	composer.addPass(effectFilm);
	composer.addPass(bloomPass);		
	composer.addPass(effectVignette);				
	//composer.addPass(glitchPass);
	
	// *** Конец основного кода ***
	
}



// Функция отображение сцены на вьюпорт
function renderIntro() {
	
	// *** Основной код ***
	
	// слушатели события
	document.addEventListener('mousemove', onDocumentMouseMove, false); // - движение мыши	
	document.addEventListener( 'wheel', onDocumentMouseWheel, false ); // - колёсико мыши
	window.addEventListener('resize', onWindowResize, false); // - изменения размера экрана отображения		
				
	render(); // вызывает функцию - рендер - которая запускает рендер сцены и исполняет её код
	
	// *** Конец основного кода ***
	
	
	// *** Неосновной код, содержащий используемые функции в данной процедуре ***
	
	function render() {
		delta = clock.getDelta();
		requestAF(render);		
		animate(delta); // код сцены, который исполняется во время рендринга
		
		// bloom шейдер
		render3D.toneMappingExposure = Math.pow(paramsBloom.exposure, 4.0);
		
		// итоговый рендер сцены
		composer.render(delta); // рендрид 3д слой		
	}
	
	function animate(delta) {
		stats.update();
		//controls.update(delta);
		
		// ...
		
		// эффект камеры - рыбий глаз
		ControlsMove(); // контроль поворота камеры - рыбий глаз
		lat = Math.max(-85, Math.min(85, lat));
		phi = THREE.Math.degToRad(90 - lat);
		theta = THREE.Math.degToRad(lon);
		camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
		camera.position.y = distance * Math.cos(phi);
		camera.position.z = distance * Math.sin(phi) * Math.sin(theta);		
		camera.lookAt(scene.position);		
	}
	
	function onWindowResize() {
		width = window.innerWidth;
		height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		render3D.setSize(width, height); 
		composer.setSize(width, height); 					
	}
	
	function onDocumentMouseMove(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;		
	}
	
	function onDocumentMouseWheel(event) {
		distance += event.deltaY * 0.05;
	}
	
	function ControlsMove() {
		lon += 0.618 * (mouseX - width / 2)/(width / 2);
		lat += 0.618 * (mouseY - height / 2)/(height / 2);
	}
	
	// *** Конец неосновного кода ***
	
}
