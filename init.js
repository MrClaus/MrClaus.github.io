// ��������� ������ ������ ����� ������ �������� �������� (����)
window.onload = initApplication;


// ��������� �������� �������� ���������� ������ (requestAnimationFrame) � ������ ���������
var requestAF = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame;


function initApplication() {
	
	
	VK.init(function() {
		console.log('Application start');		
		VK.api('users.get', {}, function(data) {});		
		initScene();
		initStaticData();
		window.addEventListener( 'resize', screenResize, false );
		startLoopApp();
	}, function() {
		console.log('Error starting application');
	}, '5.58');
	
	
	function initScene() {	
		// ������� ������ - �����
		var scene = new THREE.Scene();
		// ������� ������ - ������, ��� - ������������� ������ (���� ������| ����������� ������| ����������, ��� ���������� ����� � ��� �� �������������)
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
		// ��������� ������ - ��������� ������, ������� ����� �������� ���� �����
		var renderer = new THREE.WebGLRenderer();
		// �������� ���������� ������������ ����������
		renderer.setPixelRatio( window.devicePixelRatio );
		// �������� ��������� ���������� ������ ��� ������� �������� - �����/�������� (�����������), �� ������� ����� ������������ 2� �������� �������
		renderer.setSize( window.innerWidth, window.innerHeight );
		// ��������� ���-�� ��������� ������� � ��� ��������� ��������, ����� ���� ����� ��� �������� � ���� ��������
		document.body.appendChild( renderer.domElement );	
		
		// ������� ���
		// ������� ������� �������������� ������ ���� <�.�. ������ ����������� ������ 1:1:1> (��������-������������� ������)
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// ��������� �������� � ������ � � ��������
		var texture = new THREE.TextureLoader().load( 'data.response[0].photo_50' );
		var material = new THREE.MeshBasicMaterial( { map: texture } );
		
		// ������ ������� ������ ��� ����� ����������� ��������� �� �������������� ������ ����
		var cube = new THREE.Mesh( geometry, material );
		// ��������� ��������� ������ ��� �� �����, ������� ����� ������ ������
		scene.add( cube );
	}

	
	function initStaticData() {
		// ������ ������� ������ ���������� ���, ������ 5
		camera.position.z = 5;
	}

	
	// �������� ��������������� ������������ ������ ������	
	function screenResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}


	// �������� �������, ��� ���������� ��� �������� ����/����������
	function startLoopApp() {
		// ������, ��� ������ ���� ��� ��������, �� ������ ���� ��� ������ � ������������ � ��������
		requestAF( render );
		
		// ���������� ��� �������� ��������
		// ������������ ��� ������ - ��� - ������ ��� � � � (������ ���)
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
		
		// � ��� ����� ��������� ��������� ��������� �� ������������ ��������� - ����� � ������
		renderer.render( scene, camera );
	}
	
	
}