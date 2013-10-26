Math.seedrandom("hello.");
var ballCount = 30;

var ballWidth = 23;
var ballHeight = 26;
var radius = 9;
var diameter = 2 * radius;
var diameterPowerOfTwo = diameter * diameter;
var speed = 1;

function areColliding(point1, point2){
    var xs = point2.x - point1.x;
    xs *= xs;
    var ys = point2.y - point1.y;
    ys *= ys;
    return  xs + ys  < diameterPowerOfTwo;
}

function normalize(x,y){ 
	var length = Math.sqrt(x * x + y * y);
	if (length === 0) return {x:1,y:0};
	return {x:(x / length), y:(y / length)};
}

function onCollision(a, b){
	var normal = normalize(a.x-b.x,a.y-b.y);

 	b.x = a.x - (normal.x * diameter);
 	b.y = a.y - (normal.y * diameter);	
	
	var aF = a.xSpeed * normal.x + a.ySpeed * normal.y;
	var bF = b.xSpeed * normal.x + b.ySpeed * normal.y;
	var fDelta = aF - bF;
	a.xSpeed -=  fDelta * normal.x;
	a.ySpeed -=  fDelta * normal.y;
	b.xSpeed +=  fDelta * normal.x;
	b.ySpeed +=  fDelta * normal.y;
}

function isCollidingWithAny(a){
	for(var i in elements){
		if(areColliding(elements[i],a)){
			return true;
		}
	}
	return false;
}

var canvas= document.getElementById("game-canvas");
var context= canvas.getContext("2d");


var m_canvas = document.createElement('canvas');
m_canvas.width = ballWidth;
m_canvas.height = ballHeight;
var m_context = m_canvas.getContext('2d');
	

var elements = new Array();
for(var i = 0; i < ballCount; i++){
	var newBall = {
                                x: Math.random()*canvas.width,
                                y: Math.random()*canvas.height,
                                xSpeed:Math.random()*speed,
                                ySpeed:Math.random()*speed
                        };
	while(isCollidingWithAny(newBall)){
		newBall = {
                                x: Math.random()*canvas.width,
                                y: Math.random()*canvas.height,
                                xSpeed:Math.random()*speed,
                                ySpeed:Math.random()*speed
                        };
	}
	elements.push(newBall);
}

function loop(){
	for(var i in elements){
		context.clearRect(elements[i].x-1, elements[i].y-1, m_canvas.width+2, m_canvas.height+2);
	}
	for(var i in elements){
		elements[i].x+=elements[i].xSpeed;
		elements[i].y+=elements[i].ySpeed;
		
		if(elements[i].x + diameter > canvas.width)
			elements[i].xSpeed = -Math.abs(elements[i].xSpeed);
		if(elements[i].x < 0)
			elements[i].xSpeed = Math.abs(elements[i].xSpeed);
		if(elements[i].y + diameter > canvas.height)
			elements[i].ySpeed = -Math.abs(elements[i].ySpeed);
		if(elements[i].y < 0)
			elements[i].ySpeed = Math.abs(elements[i].ySpeed);
	}
	for(var i=0;i<elements.length;i++){
		for(var j=i+1;j<elements.length;j++){
			if(areColliding(elements[i],elements[j])){
				onCollision(elements[i],elements[j]);
				break;
			}
		}
	}
	for(var i in elements){
		context.drawImage(m_canvas, elements[i].x, elements[i].y);
	}
	requestAnimationFrame(loop);			
}

var image = new Image();
image.onload = function(){
	m_context.drawImage(image, 0, 0);
	requestAnimationFrame(loop);
};

image.src = "images/single-ball.png";	
