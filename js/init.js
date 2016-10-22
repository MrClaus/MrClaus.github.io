// Запускает скрипт только после полной загрузки страницы (кода)
window.onload = initApplication;


// Добавляем поддежку плавного обновления экрана (requestAnimationFrame) в разных браузерах 
var requestAF = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame;


var container; // Объявляется контейнер, куда будет отрисовываться экран
var renderer, scene, camera; // Объявляются основные инструменты по работе с 3Д
// Объявляются прочие объекты и инструменты 3Д сцены, которые в дальнейшем понадобятся
var cube, model;


// Объявляется переменная юзер, куда, при старте, будут сохраняться загруженные параметры с VK.api
var user = {
	photo : '',
};


// Функция для загрузки текстуры, глобальная переменная imgResErr сигналит об ошибке в загрузке текстур
var imgResErr = false;
function imgResLoad( getURL ) {
	// Загружаем текстуру и пихаем её в материал
	var gel = new THREE.TextureLoader().load(
		getURL,
		function ( gel ) {},
		function ( xhr ) {},
		function ( xhr ) {
			imgResErr = true;
			return;
		}
	);
	return gel;
}


// Функция для загрузки 3Д объекта *.OBJ, глобальная переменная objResErr сигналит об ошибке в загрузке модели
var objResErr = false;
function objResLoad( getObjUrl, getTexUrl ) {	
	var texModel = imgResLoad( getTexUrl );
	
	var obj = new THREE.OBJLoader();
	obj.load( getObjUrl, function ( object ) {
		object.traverse( function ( child ) {
			//if ( child instanceof THREE.Mesh ) {
			child.material.map = texModel;
			//}
		} );
		object.position.y = - 95;
		//scene.add( object );
	},
	function ( xhr ) {},
	function ( xhr ) {}
	);
	return obj;
}


// Стартовая функция, которая инициализирует текущее iFrame приложение для VK
function initApplication() {	
	VK.init(function() {
		console.log('Application start');
		vk_initUser();					
	}, function() {
		console.log('Error starting application');
	}, '5.58');
}


// Инициализация профиля пользователя
function vk_initUser() {	
	VK.api('users.get', {'fields':'photo_50'}, function(data) {
		user['photo'] = String(data.response[0].photo_50);
		if (user['photo'].substr(0, 5)!='https') user['photo'] = 'js/ich.jpg';
		console.log('User profile inited');
		startGame();
	});
	preLoadingApp();
}
function preLoadingApp() {
	// Код преЛоада
	requestAF(preLoadingApp);
}


// Функция, отвечающая за дальнейшую работу приложения после загрузки
function startGame() {	
	initScene(); // Инициализация сцены
	initObject(); // Инициализация объектов сцены
	initStaticData(); // Инициализация стартовых данных
	window.addEventListener( 'resize', screenResize, false ); // Автоматическое изменение размера экрана приложения под отображаемых размер
	startLoopApp(); // Основной цикл игры
}


function initScene() {
	// Создается объект сцены и камеры
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // Тип - Перспективная камера (угол обзора| соотношение сторон| расстояния, где начинается обзор и где он заканчивается)
			
	// Создается объект - рендерный движок, который будет рендрить нашу сцену
	renderer = new THREE.WebGLRenderer();	
	renderer.setPixelRatio( window.devicePixelRatio ); // Задается пиксельное отображаемое разрешение	
	renderer.setSize( window.innerWidth, window.innerHeight ); // Задаются параметры рендерного движка как размеры вьюпорта - экрна/сетчатки (попиксельно), на котором будет отображаться 2д проекция рендера
	
	// Создается объект - контейнер, куда будет отрисовываться графика, и добавляем его в html -документ
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement ); // Добавляем визуализатор-рендер в контейнер	
}


function initObject() {	
	// Создаем куб
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var texture = imgResLoad(user['photo']);
	var material = new THREE.MeshBasicMaterial( { map: texture } );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube ); // Добавляем куб на сцену
	
	// Загружаем модель	
	model = objResLoad( 'js/male02.obj', 'js/tmale.jpg' );
	scene.add( model );
	
	// Создается источник освещения
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );
}


function initStaticData() {
	// Задаем объекту камера координату ЗЕТ, равную 5
	camera.position.z = 250;
	
	// Задаем объекту модель позицию У = -95	
}


function screenResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function startLoopApp() {
	// Прежде, чем рендер даст нам картинку, мы должны дать ему доступ к визуализации в браузере	
	requestAF( startLoopApp );
	
	// Код игры
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	
	// Процесс рендера сцены и её отображения	
	renderer.render( scene, camera );
}
	
	

