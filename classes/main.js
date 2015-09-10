var canvas = document.getElementById('canvas1')
var ctx = canvas.getContext('2d')

var topcanvas = document.getElementById('canvas2')
var topctx = topcanvas.getContext('2d')

var NUM_MOVERS = 500
var NUM_TOPMOVERS = 50
var TAILS = true

var movers = []
var topmovers = []
var last

var links = document.getElementsByTagName('a')

for (var i = 0; i<links.length; i++){
	var link = links[i]
	link.addEventListener('click', function(e) {
		nudgeAll()
		e.preventDefault()
		setTimeout(function(){
	      window.location = e.target.href;
	   }, 300);
	})
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

function gray (lightness) {
	var l = Math.round(lightness)
	return '#fff'
	// return "rgba(255,255,255,"+l+")"
}

function distance (x1,y1,x2,y2) {
	return Math.sqrt(Math.pow(x1-x2,2)+ Math.pow(y1-y2,2))
}

function Mover (x,y,size,direction,context) {
	this.x = x
	this.y = y
	this.context = context
	this.vx = 0//Math.cos(direction)*size/100
	this.vy = 0//Math.sin(direction)*size/100
	this.size = size
	this.color = gray(180-size/12*50)
}

Mover.prototype.update = function (dt) {
	this.x += this.vx*dt
	this.y += this.vy*dt

	if (this.x>canvas.width/2+this.size) {
		this.x=-this.size
	}
	if (this.x<-this.size) {
		this.x=canvas.width/2+this.size
	}

	if (this.y>canvas.height/2+this.size) {
		this.y=-this.size
	}
	if (this.y<-this.size) {
		this.y=canvas.height/2+this.size
	}

	if (mouse.dragging){
		this.nudge(mouse.direction, .01)
	}
}

function nudgeAll() {
	var lol = [topmovers, movers]
	for (var k=0; k<2;k++){
		var moverList = lol[k]
		for (var i = 0; i < moverList.length; i++) {
			var m = moverList[i]
			m.nudgeFast(Math.PI,1)
		}
	}
}

Mover.prototype.draw = function () {

	var direction = Math.atan2(canvas.height/2-this.y,canvas.width/2-this.x)
	var tailLength = -this.size*Math.sqrt(distance(
							this.x,this.y,
							canvas.width/2,canvas.height/2))*.5						

	this.context.fillStyle = this.color
	this.context.strokeStyle = this.color//gray(160-this.size/12*50)



	var distToMouse = distance(this.x,this.y,mouse.x,mouse.y)
	if(distToMouse/this.size<30) {
		//this.context.fillStyle = gray(120)
	}

	this.context.beginPath();
	this.context.arc(this.x,this.y,this.size,0,2*Math.PI);
	this.context.fill();
	this.context.closePath()


	if(TAILS) {
		this.context.beginPath();
		this.context.moveTo(Math.cos(direction)*tailLength+this.x,Math.sin(direction)*tailLength+this.y)
		this.context.lineTo(this.x,this.y)
		this.context.lineWidth = this.size*2;
		this.context.stroke()
		this.context.closePath()

		this.context.beginPath();
		this.context.arc(Math.cos(direction)*tailLength+this.x,Math.sin(direction)*tailLength+this.y,this.size,0,2*Math.PI);
		this.context.fill();
		this.context.closePath()		
	}

}

Mover.prototype.nudge = function (direction, amount) {
	this.vx = this.vx*(1-amount)+amount*Math.cos(direction)*this.size/100
	this.vy = this.vy*(1-amount)+amount*Math.sin(direction)*this.size/100
}

Mover.prototype.nudgeFast = function (direction, amount) {
	this.vx = this.vx*(1-amount)+amount*Math.cos(direction)*this.size/10
	this.vy = this.vy*(1-amount)+amount*Math.sin(direction)*this.size/10
}

function init (time) {
	if(dimensions.update()){
		canvas.height = dimensions.height*2
		canvas.width = dimensions.width*2
		topcanvas.height = dimensions.height*2
		topcanvas.width = dimensions.width*2

		canvas.style.height = dimensions.height
		canvas.style.width = dimensions.width
		topcanvas.style.height = dimensions.height
		topcanvas.style.width = dimensions.width

		ctx.scale(2,2)
		topctx.scale(2,2)
	}

	for (var i = 0; i < NUM_TOPMOVERS; i++) {
		topmovers.push(new Mover(
			Math.random()*dimensions.width,
			Math.random()*dimensions.height,
			Math.pow(Math.random(),2)*9+3,
			0,
			topctx//0
			)
		)
	}

	for (var i = 0; i < NUM_MOVERS; i++) {
		movers.push(new Mover(
			Math.random()*dimensions.width,
			Math.random()*dimensions.height,
			Math.pow(Math.random(),2)*3,
			0,
			ctx
			)
		)
	}

	topmovers.sort(function(m,a){return m.size - a.size})
	movers.sort(function(m,a){return m.size - a.size})

	last = time
	requestAnimationFrame(draw)
}

function updateAndDrawMoverList(moverList, dt) {
	for (var i = 0; i < moverList.length; i++) {
		var m = moverList[i]
		m.update(dt)
		m.draw()
	}
}


function draw(time) {
	//console.log(mouse.direction)

	var dt = time-last
	last = time

	ctx.clearRect(0,0,canvas.width,canvas.height)
	topctx.clearRect(0,0,canvas.width,canvas.height)
	
	if(dimensions.update()){
		canvas.height = dimensions.height*2
		canvas.width = dimensions.width*2
		topcanvas.height = dimensions.height*2
		topcanvas.width = dimensions.width*2

		canvas.style.height = dimensions.height
		canvas.style.width = dimensions.width
		topcanvas.style.height = dimensions.height
		topcanvas.style.width = dimensions.width

		ctx.scale(2,2)
		topctx.scale(2,2)
	}

	updateAndDrawMoverList(movers, dt)
	updateAndDrawMoverList(topmovers, dt)

	requestAnimationFrame(draw)
}

requestAnimationFrame(init)