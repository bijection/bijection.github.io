var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
	ctx.globalCompositeOperation = "source-under";
var bg = document.createElement("canvas");
var bgctx = bg.getContext("2d");
var controls = document.getElementById("controls")

var lines = true;
var pichurs = false;
var dots = true;
var opa = 1;
console.log(opa)
var lw = 0;
var lh = 0;
var W = 1900; var H = 700;

var coolnewheight = 0;

var xgrav = .0;
var ygrav = .0;

var visc = .05;
var push = 25;//21
var pull = 25;//24
var mult = 0.000042//.002;
var bounce = .1;
// var dist = push+pull;//console.log(dist);
var fric = 1;
var rad = 4;
var wfric = .5;

var nump = 200;

var mouseX, mouseY;
var times = 0;
var avgtime = 0;

var rdist = 500;
var rectdist = rdist;

var particles = [];
var connections = [];
var drag = [];

// var lol = new Image();
// lol.src = "nogap.png";//ctx.getImageData(0,0,1,1);

//canvas.width = W; 
//canvas.height = H;

function create_particle()
{
	return {
		x:  Math.random()*(W-rectdist)+rectdist/2,
		y:  Math.random()*(H-rectdist)+rectdist/2,

		c:  1,
		c1: 1,
		
		vx:  0,
		vy:  0,
		ax:  0,
		ay:  0,
		mass:  1,//Math.random()*2-,
		
		radius:  4
	}
}

function connection(p1,p2,dx,dy,dvx,dvy,dot,f,d) {
	return {
		p1: p1,
		p2: p2,
		dx: dx,
		dy: dy,
		dvx: dvx,
		dvy: dvy,
		dot: dot,
		f: f,
		d: d
	}
}


function getWidth() {
    if (self.innerWidth) {
       return self.innerWidth;
    }
    if (document.documentElement && document.documentElement.clientHeight){
        return document.documentElement.clientWidth;
    }
    if (document.body) {
        return document.body.clientWidth;
    }
    return 0;
}

function getHeight() {
	var height
    if (self.innerWidth) {
       height = self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight){
        height = document.documentElement.clientHeight;
    }
    else if (document.body) {
        height = document.body.clientHeight;
    }
    else {
    	return 0
    }
	return height - 40;
}


function calc(dt){
	W=getWidth()+2;
	H=getHeight();
	addvels(dt);
	connections = [];

	var dist = push + pull
	var dist2 = dist*dist
	for(var t = 0; t < particles.length; t++){
		var p = particles[t];
		for(var k = t+1; k < particles.length; k++)
		{
			var j = particles[k];
			var dx = (p.x-j.x);
			var dy = (p.y-j.y);
			var d2 = dx*dx+dy*dy;
			if(d2<dist2){
				var d = Math.sqrt(d2)
				var d4 = 1/(d2*d2+10);
				p.c+=d4
				j.c+=d4

				var dvx = p.vx-j.vx;
				var dvy = p.vy-j.vy;
				var dot = (dx*dvx+dy*dvy)/d;
				var f=mult*(dist-d)*(push-d)/d;
				connections.push(connection(p,j,dx,dy,dvx,dvy,dot,f,d));
			}
		}		
	}
}

function addvels(dt) {
	for(var i = 0; i < connections.length; i++)
	{
		var m=connections[i];
		var p1 = m.p1;
		var p2 = m.p2;
		var fx=m.dx*m.f;
		var fy=m.dy*m.f;
		p1.ax+=(fx*p2.c+visc*(m.dvx-m.dot*m.dx)/(m.d))/p1.c;
		p1.ay+=(fy*p2.c+visc*(m.dvy-m.dot*m.dy)/(m.d))/p1.c;
		p2.ax-=(fx*p1.c+visc*(m.dvx-m.dot*m.dx)/(m.d))/p2.c;
		p2.ay-=(fy*p1.c+visc*(m.dvy-m.dot*m.dy)/(m.d))/p2.c;
	}//*/
	for(var i = 0; i < drag.length; i++){
		var m=drag[i];
		var d = (mouseX-m.x)*(mouseX-m.x)+(mouseY-m.y)*(mouseY-m.y);
		m.ax+=.5*(mouseX-m.x)/(1000*m.c);
		m.ay+=.5*(mouseY-m.y)/(1000*m.c);
	}
	for(var i = 0; i<particles.length; i++){
		var p=particles[i];
		p.c1=p.c-1;
		p.c=1;
		p.vx+=p.ax;
		p.vy+=p.ay;
		p.ax=0;
		p.ay=0;
		p.vx*=fric;
		p.vy*=fric;
		p.vy+=ygrav*p.mass;
		p.vx+=xgrav*p.mass;
		p.x += dt*p.vx;
		p.y += dt*p.vy;
		if(p.x < p.radius) {p.x+=1.1*(p.radius-p.x); p.vx *= -bounce; p.vy *= wfric}
		else if(p.x > W-p.radius) {p.x-=1.1*(p.x-(W-p.radius)); p.vx *= -bounce; p.vy *= wfric}
		if(p.y < p.radius) {p.y+=1.1*(p.radius-p.y); p.vy *= -bounce; p.vx *= wfric}
		else if(p.y > H-p.radius) {p.y-=1.1*(p.y-(H-p.radius)); p.vy *= -bounce; p.vx *= wfric}//*/
		
		var inset = p.radius+100;
		var insetacceleration = .05		
		if(p.x < inset) {p.vx += insetacceleration}
		if(p.x > W-inset) {p.vx -= insetacceleration}
		if(p.y < inset) {p.vy += insetacceleration}
		if(p.y > H-inset) {p.vy -= insetacceleration}
	}
}

//var img=document.getElementById("pic");
//img.crossOrigin = '';
//ctx.drawImage(img,10,10);


var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var v;

var isRetina = (
	window.devicePixelRatio > 1 ||
	(window.matchMedia && window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches)
);

function tween_color(c1, c2, r) {
	return 'rgb('+Math.round(c1.r*r+c2.r*(1-r))+','+Math.round(c1.g*r+c2.g*(1-r))+','+Math.round(c1.b*r+c2.b*(1-r))+')'
}


function init() {
  document.title = "\u200b"
  // setfootercolor()

  var lasttime;
  requestAnimationFrame(function(time){
  	lasttime = time
  	console.log('hi')
  	calc()
  	reset()
  	requestAnimationFrame(function run(time){
  		var dt = time - lasttime
  		lasttime = time
  		calc(dt/10)
  		draw()
  		requestAnimationFrame(run)
  	})
  })

  //I swear I have a good reason for using setinterval
	// setInterval(calc, 5);
	// //calc();
	// setInterval(draw, 1000/30);

	// // setInterval(setfootercolor, 10000)

	// setTimeout("reset()",100);

  // v = document.getElementById('v');
  // navigator.webkitGetUserMedia({video:true}, callbackStreamIsReady, function(){console.log('err')});
}


function fixdim() {

	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	
	var rect = canvas.getBoundingClientRect()

	coolnewheight = Math.min(-rect.top,rect.height*49/50)


	document.querySelector('.down').style.opacity = 1-coolnewheight/100
	// document.querySelector('.footer').style['background-color'] = tween_color({r:255, g:0, b:134},{r:255, g:248, b:225},Math.min(Math.max(0,1-coolnewheight/100),1)) 

	mult = .000042 * (coolnewheight/rect.height*3+1)
	push = 25 * (coolnewheight/rect.height*3+1)
	// console.log(bottom)
	// if(bottom < 100){
	// 	document.getElementById('logo').style.left = bottom - 100
	// }
	
}

addEventListener('scroll', fixdim)


function draw()
{	
	var rect = canvas.getBoundingClientRect()
	if(rect.top > -rect.height){
	if(lw != W || lh != H){


		canvas.width = W;
		canvas.height = H;
		
		lw=W;
		lh=H;

		if (isRetina){
			canvas.width = W*2;
			canvas.height = H*2;

			canvas.style.width = W+"px";
			canvas.style.height = H+"px";

			ctx.scale(2,2)

			console.log("wolo", canvas.style.height)

		}
		//console.log(lw+W+lh+H)
	}
//	ctx.fillStyle = "rgba(255, 0, 255, 1)";
	//ctx.drawImage(lol,0,0,W,H);
	//ctx.fillRect(0, 0, W, H);
	//ctx.drawImage(pic,200,400);
//	console.log(pic);
	ctx.fillStyle = "rgba(255, 255, 255, "+opa+")";
	// ctx.fillRect(0, 0, W, H);
	ctx.clearRect(0, 0, W, H);
	if(pichurs){
		for(var t = 0; t < particles.length; t++)
		{
			var p = particles[t];
			//pic = ctx.getImageData(0,0,50,50);
			ctx.drawImage(p.im,p.x-rectdist/2,p.y-rectdist/2);
	//		ctx.beginPath();
	//		ctx.fillStyle = "black";
	//		ctx.moveTo(p.x, p.y);
	//		ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
	//		//console.log(p.c1);
	//		ctx.fill();
		}
	}
	if(dots){
		ctx.fillStyle = "white";
		for(var t = 0; t < particles.length; t++){
			var p = particles[t];
			ctx.moveTo(p.x, p.y);
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
			ctx.fill();
		}
	}
	if(lines){
		ctx.strokeStyle = "white";	
		ctx.beginPath();	
		for(var t = Math.min(connections.length -1,2000); t >= 0; t--)
		{
			m=connections[t];
			var p = m.p1;
			var j = m.p2;
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(j.x, j.y);
		}//*/
		ctx.stroke();	
	}		
	}
	//console.log(pic);

}

function calc1(){
	console.time('calc timer');
	calc();
	console.timeEnd('calc timer');
}

// setTimeout('$( "#controls" ).toggle( "drop" , {}, 500 );',100);



function reset(){
	rectdist = rdist;
	// ctx.drawImage(v,0,0,W,H);
	particles=[];
	for(var i = 0; i < nump; i++)
	{
		particles.push(create_particle());
	}	
}


document.addEventListener("mousedown", startdrag, false);
document.addEventListener("mouseup", enddrag, false);
document.addEventListener("mousemove", mouseMove, false);

document.addEventListener("keypress", showcont, false);

function showcont(e){
	if (e.keyCode == 111){
		controls.toggle( "drop" , {}, 500 );
	}
}


function mouseMove(e)
{
    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}


function startdrag(event)
{
  var x = event.x;
  var y = event.y;
  getdots([x,y], 200);
  console.log(event);
  // setfootercolor()

}

function enddrag(event)
{
	drag=[];
}

function getdots(p,r){
	drag = [];
	for(var k = 0; k < particles.length; k++)
	{
		var j = particles[k];
		var dx = (p[0]-j.x);
		var dy = (p[1]-j.y);
		var d = Math.sqrt(dx*dx+dy*dy);
		if(d<r){
			drag.push(j);
		}
	}
}

