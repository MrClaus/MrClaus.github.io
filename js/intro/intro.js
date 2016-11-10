// Çàïóñêàåò ñêðèïò òîëüêî ïîñëå ïîëíîé çàãðóçêè ñòðàíèöû (êîäà)
window.onload = initApplication;



// Äîáàâëÿåì ïîääåæêó ïëàâíîãî îáíîâëåíèÿ ýêðàíà (requestAnimationFrame) â ðàçíûõ áðàóçåðàõ 
var requestAF = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame;



// Èíèöèàëèçèðóåì ïðî÷èå ãëîáàëüíûå ïåðåìåííûå
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

	
	
// Ñòàðòîâàÿ ôóíêöèÿ, êîòîðàÿ èíèöèàëèçèðóåò òåêóùåå iFrame ïðèëîæåíèå äëÿ VK
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



// Ïðåäñòàðòîâàÿ ïðîâåðêà íà ïîääåðæêó WebGL òåêóùèì áðàóçåðîì
function start() {
	if (!Detector.webgl) Detector.addGetWebGLMessage();
	resLoad();	
}



// ×òîáû èñêëþ÷èòü àñèíõðîííîå âûïîëíåíèå êîäà ñ ïàðàëëåëüíîé çàãðóçêîé, ñíà÷àëà îæèäàåì çàãðóçêó âñåõ ðåñóðñîâ, à ïîñëå - ïåðåõîäèì äàëüøå
function resLoad() {
	
	// *** Îñíîâíîé êîä ***
	
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
	
	// *** Êîíåö îñíîâíîãî êîäà ***
	
	
	// *** Íåîñíîâíîé êîä, ñîäåðæàùèé èñïîëüçóåìûå ôóíêöèè â äàííîé ïðîöåäóðå ***	
	
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
	
	// *** Êîíåö íåîñíîâíîãî êîäà ***
	
}



// Èíèöèàëèçàöèÿ ñöåíû çàñòàâêè
function initScene() {
	
	// *** Îñíîâíîé êîä ***
	
	// ñîçäà¸ì èñïîëíÿåìûé ýëåìåíò êîíòåéíåð è äîáàâëÿåì åãî â html äîêóìåíò
	container = document.createElement('div');
	document.body.appendChild(container);				
	
	// ñîçäà¸ì ñöåíó
	scene = new THREE.Scene();
	
	// ñîçäà¸ì êàìåðó
	camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 101000);
	camera.position.x = 0;
	camera.position.y = 800;
	camera.position.z = 4180;				
	
	// äîáàâëÿåì óïðàâëåíèå êàìåðîé
	controls = new THREE.OrbitControls(camera);
	controls.enabled = false;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 1;
	controls.minPolarAngle=1.322675;
	controls.maxPolarAngle=1.322675;
	controls.maxDistance=4256;
	controls.minDistance=3600;
					
	// ñîçäàåì ðåíäåðíûé äâèæîê è çàäàåì åìó ïàðàìåòðû
	render3D = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	render3D.setPixelRatio(window.devicePixelRatio);
	render3D.setSize(width, height);				
	render3D.autoClear = false;
	render3D.gammaInput = true;
	render3D.gammaOutput = true;
	container.appendChild(render3D.domElement);
					
	initObject(); // èíèöèàëèçàöèÿ îáúåêòîâ ñöåíû
	initEffect(); // äîáàâëåíèå ýôôåêòîâ ðåíäåðà ïðè îòîáðàæåíèè
	renderIntro(); // ðåíäåð ñöåíû
	
	// *** Êîíåö îñíîâíîãî êîäà ***
					
}



// Èíèöèàëèçàöèÿ îáúåêòîâ ñöåíû
function initObject() {
	
	// *** Îñíîâíîé êîä ***
	
	// ñîçäàåì èñòî÷íèê îñâåùåíèÿ DirectionalLight
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, -30000);
	light.color.setHSL(0.618, 0.45, 1.0);
	scene.add(light);
	
	// ñîçäàåì èñòî÷íèê îñâåùåíèÿ AmbientLight
	var ambient = new THREE.AmbientLight(0x101010);
	scene.add(ambient);				
	
	// ñîçäà¸ì áëèêè êàìåðû
	flare = addFlare(0.618, 0.45, 1.0, 0, 0, -30000);
	scene.add(flare);
	
	// ñîçäåì ñôåðó Çåìëè				
	sphere = createSphere(600, 64, i_earth, i_bump, i_specular, 100, '#343434');
	sphere.rotation.y = 6; 
	scene.add(sphere);
	
	// ñîçäåì ñôåðó îáëêîâ
	clouds = createClouds(600, 64, i_clouds);
	clouds.rotation.y = 6;
	scene.add(clouds);
	
	// ñîçäàåì ëóíó
	luna = createSphere(250, 64, moon, m_bump, m_specular, 10, '#000000');
	luna.position.set(0, 500, 3400);
	scene.add(luna);
	
	// ñîçäà¸ì ñêàéáîêñ
	skyBox = addSkyBox(62000, 7, 'sphere', null, mapSky, mapSky, mapSky, mapSky, mapSky, mapSky);
	scene.add(skyBox);
	
	// äîáàâëÿåì â êîíòåéíåð ïàðàìåòðû îòîáðàæåíèÿ ñòàòèñòèêè (ôïñ, ìèëëèñåêóíäû íà êàäð è ...)
	stats = new Stats();
	container.appendChild(stats.domElement);
	
	// *** Êîíåö îñíîâíîãî êîäà ***
	
	
	// *** Íåîñíîâíîé êîä, ñîäåðæàùèé èñïîëüçóåìûå ôóíêöèè â äàííîé ïðîöåäóðå ***
	
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
	
	// *** Êîíåö íåîñíîâíîãî êîäà ***
	
}



// Èíèöèàëèçàöèè èñïîëüçóåìûõ ýôôåêòîâ ïîñòïðîöåññèíãà (ïîñëå ðåíäåðà)
function initEffect() {

	// *** Îñíîâíîé êîä ***
	
	// çàäà¸ì ïàðàìåòðû EffectComposer-à
	var rtParameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: true
	};
	
	// ñîçäàåì êîìïîç¸ð (äëÿ äîáàâëåíèÿ ðàçëè÷íûõ ýôôåêòîâ)
	composer = new THREE.EffectComposer(render3D, new THREE.WebGLRenderTarget(width, height, rtParameters));
					
	// ñîçäà¸ì ýôôåêò äëÿ êîìïîç¸ðà Vignette
	var shaderVignette = THREE.VignetteShader;
	effectVignette = new THREE.ShaderPass(shaderVignette);
	effectVignette.uniforms["offset"].value = 0.95;
	effectVignette.uniforms["darkness"].value = 1.6;
	effectVignette.renderToScreen = false;
	
	// ñîçäà¸ì ýôôåêò äëÿ êîìïîç¸ðà Film
	effectFilm = new THREE.FilmPass(0.35, 0.75, 2048, false);
	effectFilm.renderToScreen = false;				
					
	// ñîçäà¸ì ýôôåêò äëÿ êîìïîç¸ðà Glitch
	glitchPass = new THREE.GlitchPass();
	glitchPass.goWild = false;
	glitchPass.renderToScreen = true; // èñòèíà çàäàåòñÿ ïîñëåäíåìó îòðèñîâûâàåìó ýôôåêòó, êîòîðûé ðåíäðèò âñå ïðåäûäóùèå
	
	// äîáàâëÿåì ñîçäàííûå ýôôåêòû â êîìïîç¸ð, íà÷èíàÿ ñ ðåíäðèíãà ñöåíû
	composer.addPass(new THREE.RenderPass(scene, camera));				
	composer.addPass(effectFilm);	
	composer.addPass(effectVignette);				
	composer.addPass(glitchPass);
	
	// *** Êîíåö îñíîâíîãî êîäà ***
	
}



// Ôóíêöèÿ îòîáðàæåíèå ñöåíû íà âüþïîðò
function renderIntro() {
	
	// *** Îñíîâíîé êîä ***
	
	// ñëóøàòåëè ñîáûòèÿ
	document.addEventListener('mousemove', onDocumentMouseMove, false); // - äâèæåíèå ìûøè
	window.addEventListener('resize', onWindowResize, false); // - èçìåíåíèÿ ðàçìåðà ýêðàíà îòîáðàæåíèÿ
		
	// âûçûâàåò ôóíêöèþ - ðåíäåð - êîòîðàÿ çàïóñêàåò ðåíäåð ñöåíû è èñïîëíÿåò å¸ êîä				
	render();
	
	// *** Êîíåö îñíîâíîãî êîäà ***
	
	
	// *** Íåîñíîâíîé êîä, ñîäåðæàùèé èñïîëüçóåìûå ôóíêöèè â äàííîé ïðîöåäóðå ***
	
	function render() {
		requestAF(render);
		animate(); // êîä ñöåíû, êîòîðûé èñïîëíÿåòñÿ âî âðåìÿ ðåíäðèíãà
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
	
	// *** Êîíåö íåîñíîâíîãî êîäà ***
	
}
