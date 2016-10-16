// Запускает скрипт только после полной загрузки страницы (кода)
window.onload = init;

var map;
var ctxMap;
var ply;
var ctxPly;
var emy;
var ctxEmy;
var text;
var ctxText;

var drawBtn;
var clearBtn;

var gameWidth = 800;
var gameHeight = 600;

// Загрузка ресурсов - картинок
var bg = new Image();
bg.src = "lol.jpg";
var abg = new Image();
abg.src = "alef.png"
var pl = new Image();
pl.src = "bob.png";

var player = new Player();
var enemes = [];

var isPlaying;
var zagolovok;

// Добавляем поддежку обновления экрана в разных браузерах
var requestAnimaFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						window.msRequestAnimationFrame;


function checkKeyboard1(evnt)
{
	var keyID = evnt.keyCode || evnt.which;
	var keyChar = String.fromCharCode(keyID);
	if(keyChar=="W") player.isUp=true;
	if(keyChar=="S") player.isDown=true;
	if(keyChar=="A") player.isLeft=true;
	if(keyChar=="D") player.isRight=true;
	evnt.preventDefault();
}
function checkKeyboard0(evnt)
{
	var keyID = evnt.keyCode || evnt.which;
	var keyChar = String.fromCharCode(keyID);
	if(keyChar=="W") player.isUp=false;
	if(keyChar=="S") player.isDown=false;
	if(keyChar=="A") player.isLeft=false;
	if(keyChar=="D") player.isRight=false;
	evnt.preventDefault();
}							
						
function init()
{
	// Перенесение объекта - канвас - из html документа в js - скрипт
	map = document.getElementById("map");
	ply = document.getElementById("player");
	emy = document.getElementById("enemy");
	text = document.getElementById("text");
	
	// Задаем параметр отображения графики в перенесенных канвасах
	ctxMap = map.getContext("2d");
	ctxPly = ply.getContext("2d");
	ctxEmy = emy.getContext("2d");
	ctxText = text.getContext("2d");
	
	// Задаем размеры экрана для объектов канваса
	map.width = gameWidth;
	map.height = gameHeight;
	ply.width = gameWidth;
	ply.height = gameHeight;
	emy.width = gameWidth;
	emy.height = gameHeight;
	text.width = gameWidth;
	text.height = gameHeight;
	
	// Переносим из html документа элемент - Кнопка
	drawBtn = document.getElementById("drawBtn");
	clearBtn = document.getElementById("clearBtn");
	
	// Считываем событие нажатие на кнопку и выполняем определенную функцию
	drawBtn.onclick = drawRect;
	clearBtn.onclick = clearRect;
	
	for(var i=0;i<10;i++)
	{
		enemes[i]=new Enemy();
	}
	
	// Выведем надпись на канвас
	ctxText.clearRect(0,0,gameWidth,gameHeight);
	ctxText.fillStyle="#ffffff";
	ctxText.font="bold 15pt Arial";
	ctxText.fillText("Gifo",10,20);
	
	drawBg();
	startLoop();
	document.addEventListener("keydown",checkKeyboard1,false);
	document.addEventListener("keyup",checkKeyboard0,false);
	
	var mouseX;
	var mouseY;
	document.addEventListener("mousemove",mouseMove,false);
	document.addEventListener("click",mouseClick,false);

}

function mouseMove(evnt)
{
	mouseX = evnt.pageX-map.offsetLeft;
	mouseY = evnt.pageY-map.offsetTop;
	//console.log("X="+mouseX+"  Y="+mouseY);
}
function mouseClick()
{
	
}

// Игровой цикл --------------------------------------------- //
function loop()
{
	if(isPlaying)
	{
		draw();
		requestAnimaFrame(loop);
	}
}
function startLoop()
{
	isPlaying = true;
	loop();
}
function stopLoop()
{
	isPlaying = false;
}


// Глобальная фукция рисования кадра ------------------------------ //
function draw()
{
	player.draw();
	player.go();
	
	if(enemes.length<10)
	{
		for(var i=enemes.length;i<10;i++)
		{
			enemes[i]=new Enemy();
		}
	}
	
	for(var i=0;i<enemes.length;i++)
	{		
		enemes[i].draw(i);
		enemes[i].go();
	}
}


// Объект - игрок - имеет встроенные параметры и функцию вызова draw() ------------------------ //
function Player()
{
	this.srcX = 0;
	this.srcY = 0;
	this.drwX = 0;
	this.drwY = 0;
	this.width = 100;
	this.height = 110;
	
	this.isUp = false;
	this.isDown = false;
	this.isLeft = false;
	this.isRight = false;
	
	this.speed = 5;
}
Player.prototype.draw = function()
{
	ctxPly.clearRect(0,0,gameWidth,gameHeight);
	ctxPly.drawImage(pl,this.srcX,this.srcY,this.width,this.height,this.drwX,this.drwY,this.width,this.height);
}
Player.prototype.go = function()
{
	if(this.isUp) this.drwY-=this.speed;
	if(this.isDown) this.drwY+=this.speed;
	if(this.isLeft) this.drwX-=this.speed;
	if(this.isRight) this.drwX+=this.speed;
	
	if(this.drwX<0) this.drwX=0;
	if(this.drwX>gameWidth-this.width) this.drwX=gameWidth-this.width;
	if(this.drwY<0) this.drwY=0;
	if(this.drwY>gameHeight-this.height) this.drwY=gameHeight-this.height;
}


// Объект - враг - имеет встроенные параметры и функцию вызова draw() ---------------- //
function Enemy()
{
	this.srcX = 16;
	this.srcY = 120;
	this.drwX = Math.floor(gameWidth+Math.random()*gameWidth);
	this.drwY = Math.floor(Math.random()*gameHeight);
	this.width = 66;
	this.height = 80;
	
	this.speed = 8;	
}
Enemy.prototype.draw = function(i)
{
	if (i==0) ctxEmy.clearRect(0,0,gameWidth,gameHeight);
	ctxEmy.drawImage(pl,this.srcX,this.srcY,this.width,this.height,this.drwX,this.drwY,this.width,this.height);
}
Enemy.prototype.go = function()
{
	this.drwX-=this.speed;
	
	if(this.drwX<0-this.width)
	{
		enemes.splice(enemes.indexOf(this),1);
	}
}


// Всё, что касает отрисовки фона --------------------------------------------- //
// Функция рисует прямоугольник в канвасе - Мап
function drawRect()
{
	ctxMap.drawImage(abg,0,0,800,600,0,0,800,600);
}
// Функция очищает экран в канвасе - Мап
function clearRect()
{
	ctxMap.clearRect(0,0,gameWidth,gameHeight);
	ctxMap.drawImage(bg,0,0,800,600,0,0,800,600);
}
// Функция выводит гель на экран в канвасе - Мап
function drawBg()
{
	ctxMap.drawImage(bg,0,0,800,600,0,0,800,600);
}
