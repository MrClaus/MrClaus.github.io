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
console.log('1');
function initApplication() {
	console.log('2');
	VK.init(function() {
		console.log('3');
		console.log('Application start');
		console.log('4');
		getUser();
		console.log('5');
		if(user['photo']=='https://pp.vk.me/c627825/v627825072/63562/r4hYBXbhJP8.jpg') console.log('True');
		console.log('6');
		initScene();
		console.log('7');
		initStaticData();
		console.log('8');
		window.addEventListener( 'resize', screenResize, false );
		console.log('9');
		startLoopApp();
	}, function() {
		console.log('Error starting application');
	}, '5.58');
}

function getUser() {
	console.log('4.1/');
	VK.api('users.get', {'fields':'photo_50'}, function(data) {
		console.log('4.2/');
		user['photo'] = String(data.response[0].photo_50);
		console.log('4.3/');
		console.log(user['photo']);
	});
}

function initScene() {
	console.log('6.1/');
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
	// Загружаем текстуру и пихаем её в материал
	texture = new THREE.TextureLoader().load(
		user['photo'],
		function ( texture ) {
			material = new THREE.MeshBasicMaterial( { map: texture } );
			console.log('Texture completed');
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) +'% texture load...');
		},
		function ( xhr ) {
			console.log('Texture not loading');
		}
	);
	
	// Теперь создаем объект куб путем натягивания материала на геометрический скелет куба
	cube = new THREE.Mesh( geometry, material );
	// Добавляем созданный объект куб на сцену, которую будет видеть камера
	scene.add( cube );
}


function initStaticData() {
	console.log('7.1/');
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
	console.log('9.1/');
	// Прежде, чем рендер даст нам картинку, мы должны дать ему доступ к визуализации в браузере
	requestAF( startLoopApp );
	
	// Собственно ваш основной быдлокод
	// Поворачиваем наш объект - куб - вокруг оси Х и У (точнее ХУи)
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	
	// И уже далее совершить процедуру рендринга по передаваемым атрибутам - сцена и камера
	renderer.render( scene, camera );
}
	
	

