// ��������� ������ ������ ����� ������ �������� �������� (����)
window.onload = initApplication;



// ��������� �������� �������� ���������� ������ (requestAnimationFrame) � ������ ��������� 
var requestAF = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame;



// �������������� ������ ���������� ����������
var container, scene, camera, render3D;
var width = window.innerWidth;
var height = window.innerHeight;			
var controls;			
var texFlare, texFlare1245, texFlare3, texFlare6, texFlare7;
var sphere, i_earth, i_bump, i_specular;
var clouds, i_clouds;
var luna, moon, m_bump, m_specular;
var skyBox, mapSky;	
var stats;			
var composer, effectFilm, effectVignette, glitchPass, effectFilm;			
var mouseX = 0, mouseY = 0, mouseRad = 999;			

	
	
// ��������� �������, ������� �������������� ������� iFrame ���������� ��� VK
function initApplication() {	
	VK.init(function() {
		console.log('VK Application inited');
		start();					
	}, function() {
		console.log('Error inited VK application');
		start();
	}, '5.58');
}



// ������������� �������� �� ��������� WebGL ������� ���������
function start() {
	if (!Detector.webgl) Detector.addGetWebGLMessage();
	resLoad();	
}



// ����� ��������� ����������� ���������� ���� � ������������ ���������, ������� ������� �������� ���� ��������, � ����� - ��������� ������
function resLoad() {
	
	// *** �������� ��� ***
	
	var count = 0;
	var count_res = 13;
	
	i_clouds = loadIMG("res/intro/earth_clouds.png");				
	i_earth = loadIMG("res/intro/earth_map.jpg");				
	i_bump = loadIMG("res/intro/earth_bump.jpg");				
	i_specular = loadIMG("res/intro/earth_specular.jpg");
	moon = loadIMG("res/intro/moon_map.jpg");
	m_bump = loadIMG("res/intro/moon_bump.jpg");
	m_specular = loadIMG("res/intro/moon_specular.jpg");	
	texFlare = loadIMG("res/flare/flare0.png");
	texFlare1245 = loadIMG("res/flare/flare1245.png");
	texFlare3 = loadIMG("res/flare/flare3.png");
	texFlare6 = loadIMG("res/flare/flare6.png");
	texFlare7 = loadIMG("res/flare/flare7.png");
	mapSky = loadIMG("res/intro/skybox.jpg");
	
	// *** ����� ��������� ���� ***
	
	
	// *** ���������� ���, ���������� ������������ ������� � ������ ��������� ***	
	
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
	
	// *** ����� ����������� ���� ***
	
}



// ������������� ����� ��������
function initScene() {
	
	// *** �������� ��� ***
	
	// ������ ����������� ������� ��������� � ��������� ��� � html ��������
	container = document.createElement('div');
	document.body.appendChild(container);				
	
	// ������ �����
	scene = new THREE.Scene();
	
	// ������ ������
	camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 101000);
	camera.position.x = 0;
	camera.position.y = 800;
	camera.position.z = 4180;				
	
	// ��������� ���������� �������
	controls = new THREE.OrbitControls(camera);
	controls.enabled = false;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 1;
	controls.minPolarAngle=1.322675;
	controls.maxPolarAngle=1.322675;
	controls.maxDistance=4256;
	controls.minDistance=3600;
					
	// ������� ��������� ������ � ������ ��� ���������
	render3D = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	render3D.setPixelRatio(window.devicePixelRatio);
	render3D.setSize(width, height);				
	render3D.autoClear = false;
	render3D.gammaInput = true;
	render3D.gammaOutput = true;
	container.appendChild(render3D.domElement);
					
	initObject(); // ������������� �������� �����
	initEffect(); // ���������� �������� ������� ��� �����������
	renderIntro(); // ������ �����
	
	// *** ����� ��������� ���� ***
					
}



// ������������� �������� �����
function initObject() {
	
	// *** �������� ��� ***
	
	// ������� �������� ��������� DirectionalLight
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, -30000);
	light.color.setHSL(0.618, 0.45, 1.0);
	scene.add(light);
	
	// ������� �������� ��������� AmbientLight
	var ambient = new THREE.AmbientLight(0x101010);
	scene.add(ambient);				
	
	// ������ ����� ������
	flare = addFlare(0.618, 0.45, 1.0, 0, 0, -30000);
	scene.add(flare);
	
	// ������ ����� �����				
	sphere = createSphere(600, 64, i_earth, i_bump, i_specular, 100, '#343434');
	sphere.rotation.y = 6; 
	scene.add(sphere);
	
	// ������ ����� ������
	clouds = createClouds(600, 64, i_clouds);
	clouds.rotation.y = 6;
	scene.add(clouds);
	
	// ������� ����
	luna = createSphere(250, 64, moon, m_bump, m_specular, 10, '#000000');
	luna.position.set(0, 500, 3400);
	scene.add(luna);
	
	// ������ ��������
	skyBox = addSkyBox(62000, 7, 'sphere', null, mapSky, mapSky, mapSky, mapSky, mapSky, mapSky);
	scene.add(skyBox);
	
	// ��������� � ��������� ��������� ����������� ���������� (���, ������������ �� ���� � ...)
	stats = new Stats();
	container.appendChild(stats.domElement);
	
	// *** ����� ��������� ���� ***
	
	
	// *** ���������� ���, ���������� ������������ ������� � ������ ��������� ***
	
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
	
	// *** ����� ����������� ���� ***
	
}



// ������������� ������������ �������� ��������������� (����� �������)
function initEffect() {

	// *** �������� ��� ***
	
	// ����� ��������� EffectComposer-�
	var rtParameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: true
	};
	
	// ������� ������� (��� ���������� ��������� ��������)
	composer = new THREE.EffectComposer(render3D, new THREE.WebGLRenderTarget(width, height, rtParameters));
					
	// ������ ������ ��� �������� Vignette
	var shaderVignette = THREE.VignetteShader;
	effectVignette = new THREE.ShaderPass(shaderVignette);
	effectVignette.uniforms["offset"].value = 0.95;
	effectVignette.uniforms["darkness"].value = 1.6;
	effectVignette.renderToScreen = false;
	
	// ������ ������ ��� �������� Film
	effectFilm = new THREE.FilmPass(0.35, 0.75, 2048, false);
	effectFilm.renderToScreen = false;				
					
	// ������ ������ ��� �������� Glitch
	glitchPass = new THREE.GlitchPass();
	glitchPass.goWild = false;
	glitchPass.renderToScreen = true; // ������ �������� ���������� ������������� �������, ������� ������� ��� ����������
	
	// ��������� ��������� ������� � �������, ������� � ��������� �����
	composer.addPass(new THREE.RenderPass(scene, camera));				
	composer.addPass(effectFilm);	
	composer.addPass(effectVignette);				
	composer.addPass(glitchPass);
	
	// *** ����� ��������� ���� ***
	
}



// ������� ����������� ����� �� �������
function renderIntro() {
	
	// *** �������� ��� ***
	
	// ��������� �������
	document.addEventListener('mousemove', onDocumentMouseMove, false); // - �������� ����
	window.addEventListener('resize', onWindowResize, false); // - ��������� ������� ������ �����������
		
	// �������� ������� - ������ - ������� ��������� ������ ����� � ��������� � ���				
	render();
	
	// *** ����� ��������� ���� ***
	
	
	// *** ���������� ���, ���������� ������������ ������� � ������ ��������� ***
	
	function render() {
		requestAF(render);
		animate(); // ��� �����, ������� ����������� �� ����� ���������
		composer.render(0.01);					
	}
	
	function animate() {
		controls.update();		
		stats.update();
		if (mouseRad < 122) {						
			controls.maxDistance = 3600 + 656 * (mouseRad / 122);
			controls.minDistance = controls.maxDistance;
		}
		sphere.rotation.y += 0.0003;
		clouds.rotation.y += 0.0006;
		skyBox.rotation.z += 0.0003;
		skyBox.rotation.x += 0.0002;
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
	}
	
	// *** ����� ����������� ���� ***
	
}