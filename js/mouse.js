


var mouse = {
	x: 0,
	y: 0,
	direction:0,

	start: {
		x:0,
		y:0
	},

	dragging: false,

	set: function (x,y) {
		mouse.x = x
		mouse.y = y
		mouse.direction = Math.atan2(y-mouse.start.y,x-mouse.start.x)
	},

	coords: function (e) {
		if(e.pageX){
			mouse.set(e.pageX,e.pageY)
		}
		else if(e.offsetX) {
			mouse.set(e.offsetX,e.offsetY)
		}
		else if(e.layerX) {
			mouse.set(e.layerX,e.layerY)
		}
		else if(e.targetTouches){
			mouse.set(e.targetTouches[0].page,e.targetTouches[0].pageY)
		}
	},

	down: function (e) {
		mouse.coords(e)
		mouse.start.x=mouse.x
		mouse.start.y=mouse.y
		mouse.dragging = true
		particles.startdragging([mouse.x,mouse.y],200)
	},

	up: function (e) {
		mouse.coords(e)
		mouse.dragging = false
		particles.stopdragging()
	}
}

document.addEventListener("touchstart", mouse.down, false);
document.addEventListener("touchend", mouse.up, false);
document.addEventListener("touchmove", mouse.coords, true);

document.addEventListener("mousedown", mouse.down, false);
document.addEventListener("mouseup", mouse.up, false);
document.addEventListener("mousemove", mouse.coords, false);