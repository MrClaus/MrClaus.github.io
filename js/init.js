// Запускает скрипт только после полной загрузки страницы (кода)
window.onload = initApplication;


// Добавляем поддежку плавного обновления экрана (requestAnimationFrame) в разных браузерах
var requestAF = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame;


var scene, camera, renderer, geometry, texture, material, cube;
var user = {
	photo : '',
};


function initApplication() {	
	VK.init(function() {
		console.log('Application start');
		VK.api('users.get', {'fields':'photo_50'}, function(data) {
			user['photo'] = String(data.response[0].photo_50);
			console.log(user['photo']);
			if (user['photo'].substr(0, 5)!='https') user['photo'] = 'js/ich.jpg';
			console.log('1');
			texture=resLoaded(user['photo']);
			console.log('9');
			startGame();
		});
	}, function() {
		console.log('Error starting application');
	}, '5.58');
}


function resLoaded( getURL ) {
	// Загружаем текстуру и пихаем её в материал
	console.log('2');
	var gel = new THREE.TextureLoader().load(
		getURL,
		function ( gel ) {
			console.log('4');
			return gel;
		},
		function ( xhr ) {
			console.log('5');
			console.log((xhr.loaded / xhr.total * 100) +'% texture load...');
		},
		function ( xhr ) {
			console.log('6');
			console.log('Texture not loading');
			return;
		}
		console.log('7');
	);
	console.log('8');
}


function startGame() {
	console.log('10');
	initScene();
	initStaticData();
	window.addEventListener( 'resize', screenResize, false );
	startLoopApp();
}


function initScene() {
	// Создаем объект - Сцена
	scene = new THREE.Scene();
	// Создаем объект - Камера, тип - Перспективная камера (угол обзора| соотношение сторон| расстояния, где начинается обзор и где он заканчивается)
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	
	// Создается объект - рендерный движок, который будет рендрить нашу сцену
	renderer = new THREE.WebGLRenderer();
	// Задается пиксельное отображаемое разрешение
	renderer.setPixelRatio( window.devicePixelRatio );
	// Задаются параметры рендерного движка как размеры вьюпорта - экрна/сетчатки (попиксельно), на котором будет отображаться 2д проекция рендера
	renderer.setSize( window.innerWidth, window.innerHeight );
	// Добавляем что-то наподобие канваса в наш АхТэЭмЭль документ, чтобы юзер узрел сие творение в окне браузера
	document.body.appendChild( renderer.domElement );	
	
	// Создаем куб
	// Сначала создаем геометрический скелет куба <т.к. задали соотношение сторон 1:1:1> (вершинно-полигональная модель)
	geometry = new THREE.BoxGeometry( 1, 1, 1 );
	material = new THREE.MeshBasicMaterial( { map: texture } );

	// Теперь создаем объект куб путем натягивания материала на геометрический скелет куба
	cube = new THREE.Mesh( geometry, material );
	// Добавляем созданный объект куб на сцену, которую будет видеть камера
	scene.add( cube );
}


function initStaticData() {
	// Задаем объекту камера координату ЗЕТ, равную 5
	camera.position.z = 5;
}


// Изменяет пропорционально отображаемый размер экрана	
function screenResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


// Основная функция, где находиться ваш быдлокод игры/программки
function startLoopApp() {
	// Прежде, чем рендер даст нам картинку, мы должны дать ему доступ к визуализации в браузере
	requestAF( startLoopApp );
	
	// Собственно ваш основной быдлокод
	// Поворачиваем наш объект - куб - вокруг оси Х и У (точнее ХУи)
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	
	// И уже далее совершить процедуру рендринга по передаваемым атрибутам - сцена и камера
	renderer.render( scene, camera );
}
	
	

