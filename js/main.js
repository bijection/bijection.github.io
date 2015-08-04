var lasttime,
	timescale = 1,
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');
	

var params = {
	bounce: 0.1,
	dots: true,
	fric: 1,
	initialinset: 500,
	lines: true,
	mult: 0.0006933874625807412,
	nump: 200,
	pull: 68,
	push: 112,
	pushratio: 0.76,
	visc: 54,
	wfric: 0.5,
	xgrav: 0,
	ygrav: 0,
}

var particles = particle_system(canvas, params);

function init (time) {
	fixdim()


	particles.reset()


	lasttime = time
	requestAnimationFrame(main)
}

function fixdim() {
	if(dimensions.update()){
		canvas.width = dimensions.width*2
		canvas.style.width = dimensions.width
		canvas.height = dimensions.height*2 -20
		canvas.style.height = dimensions.height -40
	}	
}


function main (time) {
  	document.title = "\u200b"

	fixdim()


	var dt = (time - lasttime)

	particles.nextframe(dt * timescale)

	lasttime = time
	requestAnimationFrame(main)
}

requestAnimationFrame(init)


function scrollhandle() {

	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

	var r = doc.getBoundingClientRect()

	// 1 - (r.bottom - window.innerHeight)/(r.height - window.innerHeight)
	
	var rect = canvas.getBoundingClientRect()

	coolnewheight = 1 - (r.bottom - window.innerHeight)/(r.height - window.innerHeight)//-rect.top/rect.height


	document.querySelector('.down').style.opacity = 1-coolnewheight/.05

	push = 60 * (coolnewheight/rect.height+1)
	timescale = 1 - coolnewheight
}

// addEventListener('scroll', scrollhandle)