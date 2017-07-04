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

var skyBox, mapSky, px, nx, py, ny, pz, nz;	
var stats, delta;			
var composer, effectFilm, effectVignette, glitchPass, effectFilm;			
var mouseX = 0, mouseY = 0, mouseRad = 999, mouseSt = -1, process = 0;

var clock = new THREE.Clock();
var isUserInteracting = false,			
			lon = 90, 
			lat = 0, 
			phi = 0, theta = 0,
    			distance = 500,
			target = new THREE.Vector3();
var onMouseDownMouseX, onMouseDownMouseY, onMouseDownLon, onMouseDownLat;


	
	
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
	var count_res = 12;
		
	nx = loadIMG("res/intro/room_nx.png");				
	ny = loadIMG("res/intro/room_ny.png");				
	nz = loadIMG("res/intro/room_nz.png");				
	px = loadIMG("res/intro/room_px.png");
	py = loadIMG("res/intro/room_py.png");
	pz = loadIMG("res/intro/room_pz.png");
	room = loadIMG("res/intro/simple_room_sphere.png");
	
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
	
	// добавляем управление камерой
	/*
	controls = new THREE.OrbitControls(camera);
	controls.enabled = true;
	controls.autoRotate = false;
	controls.autoRotateSpeed = 1;
	controls.minPolarAngle=0;
	controls.maxPolarAngle=1.322675;
	controls.maxDistance=1000;
	controls.minDistance=0;
	*/
	
	controls = new THREE.FlyControls(camera);
	controls.movementSpeed = 1000;
	controls.domElement = container;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
					
	// создаем рендерный движок и задаем ему параметры
	render3D = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	render3D.setPixelRatio(window.devicePixelRatio);
	render3D.setSize(width, height);				
	render3D.autoClear = false;
	render3D.gammaInput = true;
	render3D.gammaOutput = true;
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
	/*
	// создем сферу Земли				
	sphere = createSphere(600, 64, i_earth, i_bump, i_specular, 100, '#343434');
	sphere.rotation.y = 6; 
	scene.add(sphere);
	
	// создем сферу облков
	clouds = createClouds(600, 64, i_clouds);
	clouds.rotation.y = 6;
	scene.add(clouds);
	
	// создаем Луну
	luna = createSphere(250, 64, moon, m_bump, m_specular, 10, '#000000');
	luna.position.set(0, 500, 3400);
	scene.add(luna);
	*/
	// создаём скайбокс
	skyBox = addSkyBox(300, 7, 'sphere', null, px, nx, py, ny, pz, nz);
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
					
	function createSphere(radius, segments, map, bump, specular, b, colory) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map: map,
				bumpMap: bump,
				bumpScale: b,
				specularMap: specular,
				specular: new THREE.Color(colory)				
			})
		);
	}
	
	function createClouds(radius, segments, map) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 2, segments, segments),			
			new THREE.MeshLambertMaterial({
				map: map,
				color: 0xffffff,
				blending: THREE.NormalBlending,
				transparent: true,
				depthTest: false,							
				needsUpdate: true
			})
		);		
	}
	
	function addSkyBox(zoom, segment, type, colory, px, nx, py, ny, pz, nz) {
		var skyMat = [px, nx, py, ny, pz, nz];
		var materials = [];
		if (colory == null) colory = 0xffffff;
		for (var i = 0; i < 6; i ++) {
			materials.push( new THREE.MeshBasicMaterial( {
				map: skyMat[i],
				color: colory
			} ) );
		}				
		var skyBox = new THREE.Mesh(new THREE.CubeGeometry(zoom, zoom, zoom, segment, segment, segment), new THREE.MeshFaceMaterial(materials));
		skyBox.applyMatrix(new THREE.Matrix4().makeScale(1, 1, - 1));
		if (type == 'cube') return skyBox;
		if (type == 'sphere') {
			for (var i = 0, l = skyBox.geometry.vertices.length; i < l; i ++) {
				var vertex = skyBox.geometry.vertices[i];
				vertex.normalize();
				vertex.multiplyScalar(zoom);
			}
			return skyBox;
		}
		return null;				
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
	
	// добавляем созданные эффекты в композёр, начиная с рендринга сцены
	composer.addPass(new THREE.RenderPass(scene, camera));				
	composer.addPass(effectFilm);	
	composer.addPass(effectVignette);				
	//composer.addPass(glitchPass);
	
	// *** Конец основного кода ***
	
}



// Функция отображение сцены на вьюпорт
function renderIntro() {
	
	// *** Основной код ***
	
	// слушатели события
	document.addEventListener('mousemove', onDocumentMouseMove, false); // - движение мыши
	document.addEventListener('click', onDocumentMouseClick, false); // - клик мыши
	document.addEventListener( 'wheel', onDocumentMouseWheel, false ); // - колёсико мыши
	window.addEventListener('resize', onWindowResize, false); // - изменения размера экрана отображения

		
	// вызывает функцию - рендер - которая запускает рендер сцены и исполняет её код				
	render();
	
	// *** Конец основного кода ***
	
	
	// *** Неосновной код, содержащий используемые функции в данной процедуре ***
	
	function render() {
		delta = clock.getDelta();
		requestAF(render);		
		animate(delta); // код сцены, который исполняется во время рендринга
		
		
		/*if ( isUserInteracting === false ) {lon += 0.1;}*/
		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon );
		target.x = distance * Math.sin( phi ) * Math.cos( theta );
		target.y = distance * Math.cos( phi );
		target.z = distance * Math.sin( phi ) * Math.sin( theta );
		camera.position.copy( target ).negate();
		camera.lookAt( target );
				
		
		composer.render(delta); // рендрид 3д слой
		
	}
	
	function animate(delta) {		
		//controls.movementSpeed = 0.33 * d;
		controls.update(delta);		
		stats.update();
		
		/*button.on('pointerdown', onButtonDown);
		button.on('pointerup', onButtonUp);
		button.on('pointerupoutside', onButtonUp);
		button.on('pointerover', onButtonOver);
		button.on('pointerout', onButtonOut);*/
		
		/*if (process != 0 && process != 1600) {			
			process = process + mouseSt * (7);
			if (mouseSt == 1 && process >= 1600) process = 1600;
			if (mouseSt == -1 && process <= 1) process = 0;
			controls.maxDistance = 4256 - process;
			controls.minDistance = controls.maxDistance;	
		}*/		
		//if (mouseRad < 122) {						
		//	controls.maxDistance = 3600 + 656 * (mouseRad / 122);
		//	controls.minDistance = controls.maxDistance;
		//}
		
				
		//sphere.rotation.y += 0.0003;
		//clouds.rotation.y += 0.0006;
		//skyBox.rotation.y += 0.003;
		//skyBox.rotation.x += 0.0022;
	}
	
	function onWindowResize() {
		width = window.innerWidth;
		height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		render3D.setSize(width, height); 
		composer.setSize(width, height); 					
	}
	
	function onDocumentMouseMove( event ) {
		mouseX = (event.clientX - width / 2) / 2;
		mouseY = (event.clientY - height / 2) / 2;
		mouseRad = Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2));
		
		onPointerDownPointerX = width / 2;
		onPointerDownPointerY = height / 2;
		onPointerDownLon = lon;
		onPointerDownLat = lat;
		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;
	}
	
	function onDocumentMouseClick( event ) {		
		if (mouseSt == 1) mouseSt = -1;
		else mouseSt = 1;
		if (process == 1600) process = 1599;
		if (process == 0) process = 1;		
	}
	
	
	function onDocumentMouseWheel( event ) {
		distance += event.deltaY * 0.05;
	}
	
	// *** Конец неосновного кода ***
	
}
