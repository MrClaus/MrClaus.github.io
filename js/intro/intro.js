// Запускает скрипт только после полной загрузки страницы (кода)
window.onload = initApplication;



// Добавляем поддежку плавного обновления экрана (requestAnimationFrame) в разных браузерах 
var requestAF = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame;



// Инициализируем прочие глобальные переменные
var container, scene, camera, render3D, cameraS;
var particleSystem, options_particleSystem, spawn_particleSystem;
var tick_particle = 0;
var width = window.innerWidth;
var height = window.innerHeight;			
var controls;			
var texFlare, texFlare1245, texFlare3, texFlare6, texFlare7;

var skyBox, mapSky;	
var stats, delta;			
var composer_alpha, composer, effectFilm, effectVignette, glitchPass, effectFilm, bloomPass;			
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

var spriteRes, sprite, sceneOrtho, cameraOrtho;
var objectP, uniforms, shader;
var colorMatrixLeft, colorMatrixRight;
var _renderTargetL, _renderTargetR;

	
	
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
	var count_res = 7;
	
	mapSky = loadIMG("tex.png");
	mapSky.mapping = THREE.EquirectangularReflectionMapping;
	mapSky.magFilter = THREE.LinearFilter;
	mapSky.minFilter = THREE.LinearMipMapLinearFilter;
	
	spriteRes = loadIMG("res/intro/testDevice.png");
	
	texFlare = loadIMG("res/flare/flare0.png");
	texFlare1245 = loadIMG("res/flare/flare1245.png");
	texFlare3 = loadIMG("res/flare/flare3.png");
	texFlare6 = loadIMG("res/flare/flare6.png");
	texFlare7 = loadIMG("res/flare/flare7.png");
	
	
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
	
}



// Инициализация сцены заставки
function initScene() {	
	
	// *** Основной код ***	
	
	initScene3D(); // инициализация 3д сцены
	initScene2D(); // инициализация 2д сцены - геймплэй	
	initObject3D(); // инициализация объектов 3д сцены
	initObject2D(); // инициализация объектов 2д сцены - геймплэй
	initEffectRender(); // добавление эффектов рендера при отображении (2д и 3д)
	renderIntro(); // рендер сцены
	
}



// Инициализация 3D сцены
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
	camera.position.z = 100;
	cameraS = new THREE.StereoCamera();
					
	// создаем рендерный движок и задаем ему параметры
	//render3D = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
	render3D = new THREE.WebGLRenderer( { antialias: false } );
	render3D.setPixelRatio(window.devicePixelRatio);
	render3D.setSize(width, height);				
	render3D.autoClear = false; //
	//render3D.autoClearDepth = true; //
	//render3D.autoClearStencil = true; //
	render3D.gammaInput = true;
	render3D.gammaOutput = true;
	render3D.shadowMap.enabled = true; // желателен для эффекта bloom
	container.appendChild(render3D.domElement);
					
}



// инициализация 2д сцены - геймплэй
function initScene2D() {
	
	// *** Основной код ***
	
	// создаём камеру для 2д спрайтовой сцены
	cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
	cameraOrtho.position.z = 10;
	
	// создаём сцену для 2д геймплэя
	sceneOrtho = new THREE.Scene();
}



// Инициализация объектов 3д сцены
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
	// создаём кубическую текстуру скайбокса для шейдеров
	var path = "res/";
	var format = '.png';
	var urls = [
		path + 'nnx' + format, path + 'ppx' + format,
		path + 'ppyy' + format, path + 'nnyy' + format,
		path + 'nnz' + format, path + 'ppz' + format
	];
	var textureCube = new THREE.CubeTextureLoader().load( urls );
	textureCube.format = THREE.RGBFormat;
	//scene.background = textureCube;
	
	
	
	/* //HAUPT
	var shader = THREE.FresnelShader;		
	var material = new THREE.ShaderMaterial( {
		uniforms: shader.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader
	} );
	material.uniforms[ "tCube" ].value = textureCube;
	//objectP = new THREE.Mesh( new THREE.SphereGeometry( 80, 32, 16 ), material );
	*/
	
	colorMatrixLeft = new THREE.Matrix3().fromArray( [

			1.5, 	-0.005,		 0.0005, // r out
			-0.05,	-0.001,	-0.001, // g out
			-0.1,	 0.00005,	-0.0005 // b out

	] );

	//		red						green 						blue  						in

	colorMatrixRight = new THREE.Matrix3().fromArray( [

			-0.05,	-0.1,		 0.05,	// r out
			-0.5,	 1.0,		-0.05,	// g out
			0.001,	-0.01,		 0.5		// b out

	] );
	var _params = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };
	_renderTargetL = new THREE.WebGLRenderTarget( width, height, _params );
	_renderTargetR = new THREE.WebGLRenderTarget( width, height, _params );
	
	
	
	var material = new THREE.ShaderMaterial( {

		uniforms: {

			"mapLeft": { value: _renderTargetL.texture },
			"mapRight": { value: _renderTargetR.texture },

			"colorMatrixLeft": { value: colorMatrixLeft },
			"colorMatrixRight": { value: colorMatrixRight }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

			"	vUv = vec2( uv.x, uv.y );",
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"uniform sampler2D mapLeft;",
			"uniform sampler2D mapRight;",
			"varying vec2 vUv;",

			"uniform mat3 colorMatrixLeft;",
			"uniform mat3 colorMatrixRight;",

			// These functions implement sRGB linearization and gamma correction

			"float lin( float c ) {",
			"	return c <= 0.04045 ? c * 0.0773993808 :",
			"			pow( c * 0.9478672986 + 0.0521327014, 2.4 );",
			"}",

			"vec4 lin( vec4 c ) {",
			"	return vec4( lin( c.r ), lin( c.g ), lin( c.b ), c.a );",
			"}",

			"float dev( float c ) {",
			"	return c <= 0.0031308 ? c * 12.92",
			"			: pow( c, 0.41666 ) * 1.055 - 0.055;",
			"}",


			"void main() {",

			"	vec2 uv = vUv;",

			"	vec4 colorL = lin( texture2D( mapLeft, uv ) );",
			"	vec4 colorR = lin( texture2D( mapRight, uv ) );",

			"	vec3 color = clamp(",
			"			colorMatrixLeft * colorL.rgb +",
			"			colorMatrixRight * colorR.rgb, 0., 1. );",

			"	gl_FragColor = vec4(",
			"			dev( color.r ), dev( color.g ), dev( color.b ),",
			"			max( colorL.a, colorR.a ) );",

			"}"

		].join( "\n" )

	} );

	//var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), _material );
	
	
	//objectP = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 4, 4 ), material );
	objectP = new THREE.Mesh( new THREE.PlaneBufferGeometry( 121, 81 ), material );
	objectP.position.set( 0, 0, 0 );
	scene.add( objectP );
	
	// создаём систему частиц
	particleSystem = new THREE.GPUParticleSystem( {
		maxParticles: 250000
	} );
	//scene.add( particleSystem );
	// настойки общих и параметров движения системы частиц
	options_particleSystem = {
		position: new THREE.Vector3(),
		positionRandomness: .3,
		velocity: new THREE.Vector3(),
		velocityRandomness: .5,
		color: 0xaa88ff,
		colorRandomness: .2,
		turbulence: .5,
		lifetime: 2,
		size: 5,
		sizeRandomness: 1
	};
	spawn_particleSystem = {
		spawnRate: 15000,
		horizontalSpeed: 1.5,
		verticalSpeed: 1.33,
		timeScale: 1
	};
	
	
	
	
	
	
	
	
	/*var shader = THREE.ShaderLib[ "equirect" ];
	var material = new THREE.ShaderMaterial( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );
	material.uniforms[ "tEquirect" ].value = mapSky;*/
	
	
	
	
	
	
			
	// добавляем в контейнер параметры отображения статистики (фпс, миллисекунды на кадр и ...)
	stats = new Stats();
	container.appendChild(stats.domElement);
	
	
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
	
}



// инициализация объектов 2д сцены - геймплэй
function initObject2D() {
	
	// *** Основной код ***
	
	// создаём спрайт и добавляем его на сцену геймплэя
	var material = new THREE.SpriteMaterial( {
		map: spriteRes,
		transparent: true
		//blending: THREE.AdditiveBlending
	} );
	var width = material.map.image.width;
	var height = material.map.image.height;
	sprite = new THREE.Sprite( material );
	sprite.scale.set( width, height, 1 );
	sprite.position.set( 0, 0, 1 ); // center
	sceneOrtho.add( sprite );
	
}



// Инициализации используемых эффектов постпроцессинга (после рендера) (2д и 3д)
function initEffectRender() {

	// *** Основной код ***
	
	// задаём параметры EffectComposer-а
	var rtParameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: true
	};
	
	// создаем композёр (для добавления различных эффектов)
	composer_alpha = new THREE.EffectComposer(render3D, new THREE.WebGLRenderTarget(width, height, rtParameters));
	composer = new THREE.EffectComposer(render3D, new THREE.WebGLRenderTarget(width, height, rtParameters));
					
	// создаём эффект для композёра Vignette
	var shaderVignette = THREE.VignetteShader;
	effectVignette = new THREE.ShaderPass(shaderVignette);
	effectVignette.uniforms["offset"].value = 0.95;
	effectVignette.uniforms["darkness"].value = 1.6;
	effectVignette.renderToScreen = true;
	
	// создаём эффект для композёра Film
	effectFilm = new THREE.FilmPass(0.35, 0.75, 2048, false);
	effectFilm.renderToScreen = true;				
					
	// создаём эффект для композёра Glitch
	glitchPass = new THREE.GlitchPass();
	glitchPass.goWild = false;
	glitchPass.renderToScreen = true; // истина задается последнему отрисовываему эффекту, который рендрит все предыдущие
	
	// создаём эффект для композера Bloom
	bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
	bloomPass.renderToScreen = false;
	
	// добавляем созданные эффекты в композёр, начиная с рендринга сцены
	// Пробуем добавить размазывающий эффект как ночью в гта3
	//composer_alpha.setSize(width, height);
	var renderPass = new THREE.RenderPass(scene, camera);
	
	 
	composer_alpha.addPass(renderPass);
	composer_alpha.addPass(bloomPass);
	//composer_alpha.addPass( new THREE.RenderPass(scene, cameraS.cameraL) );
	//composer_alpha.addPass( new THREE.RenderPass(scene, cameraS.cameraR) );
	
	
	//var renderScene = new THREE.TexturePass(composer_alpha.renderTarget2.texture);
	var renderScene = new THREE.TexturePass(composer_alpha.readBuffer.texture);
	renderScene.opacity = 0.618;
	
	
	
	
	//composer.addPass(new THREE.RenderPass(scene, camera));
	composer.addPass(renderScene);
	composer.addPass(bloomPass);
	composer.addPass(effectFilm);
	//composer.addPass(new THREE.RenderPass(sceneOrtho, cameraOrtho)); // добавляем 2д слой "геймплэй"
			
	//composer.addPass(effectVignette);				
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
		//composerAlpha.render(delta);
		render3D.toneMappingExposure = Math.pow(paramsBloom.exposure, 4.0);
		
		// итоговый рендер сцены
		//render3D.clear();
		cameraS.update( camera );
		render3D.render( scene, cameraS.cameraL, _renderTargetL, true );
		render3D.render( scene, cameraS.cameraR, _renderTargetR, true );
		composer_alpha.render(delta);
		composer.render(delta); // рендрид 3д слой
		//render3D.clearDepth();
		//render3D.render( sceneOrtho, cameraOrtho );
	}
	
	function animate(delta) {
		stats.update();
		//controls.update(delta);
		
		// анимируем движение системы частиц
		/*
		var particlesDelta = delta * spawn_particleSystem.timeScale;
		tick_particle += particlesDelta;
		if ( tick_particle < 0 ) tick_particle = 0;
		if ( particlesDelta > 0 ) {
			options_particleSystem.position.x = Math.sin( tick_particle * spawn_particleSystem.horizontalSpeed ) * 20;
			options_particleSystem.position.y = Math.sin( tick_particle * spawn_particleSystem.verticalSpeed ) * 10;
			options_particleSystem.position.z = Math.sin( tick_particle * spawn_particleSystem.horizontalSpeed + spawn_particleSystem.verticalSpeed ) * 5;
			for ( var x = 0; x < spawn_particleSystem.spawnRate * particlesDelta; x++ ) {				
				particleSystem.spawnParticle( options_particleSystem );
			}
		}
		particleSystem.update( tick_particle );*/
				
		// эффект камеры - рыбий глаз
		ControlsMove(); // контроль поворота камеры - рыбий глаз
		lat = Math.max(-89.99999999, Math.min(89.99999999, lat));
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
		// 2д слой
		cameraOrtho.left = - width / 2;
		cameraOrtho.right = width / 2;
		cameraOrtho.top = height / 2;
		cameraOrtho.bottom = - height / 2;
		cameraOrtho.updateProjectionMatrix();
		// ***
		render3D.setSize(width, height); 
		composer.setSize(width, height); 					
	}
	
	function onDocumentMouseMove(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;		
	}
	
	function onDocumentMouseWheel(event) {
		distance += event.deltaY * 0.05;
		//console.log('X(',options_particleSystem.position.x,') Y(',options_particleSystem.position.y,') Z(',options_particleSystem.position.z,')');
		//console.log('>> delta ', delta,' / tick ', tick_particle, ' /');
	}
	
	function ControlsMove() {
		lon += 0.618 * (mouseX - width / 2)/(width / 2);
		lat += 0.618 * (mouseY - height / 2)/(height / 2);
		
		//camera.position.x+=lon*0.01;
		//camera.position.y+=lat*0.01;
	}
	
	// *** Конец неосновного кода ***
	
}
