var lasttime,
	// timescale = 1,
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	animating = true;
	

var params = {
	bounce: 0.1,
	dots: true,
	fric: 1,
	initialinset: 500,
	lines: true,
	mult: 0.000042,
	nump: 10,
	pull: 25,
	push: 25,
	// pushratio: 0.76,
	visc: .05,
	wfric: 0.5,
	xgrav: 0,
	ygrav: 0,
}

var particles = particle_system(canvas, params);

function init (time) {
	fixdim()


	particles.reset()

	lasttime = new Date().getTime()
	setInterval(function() {
		var time = new Date().getTime()
		var dt = (time - lasttime)
		lasttime = time
		// console.log(dt)

		if(dt < 10 && params.nump < 200){
			params.nump++
		}

		fixdim()
		if(animating) particles.nextframe()
	}, 5)


	lasttime = time
	// requestAnimationFrame(main)
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

	// fixdim()


	var dt = (time - lasttime)

	// particles.draw()
	// setInterval(function() {
		// particles.nextframe()
	// }, 5)

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

	var impoerialheight = Math.min(-rect.top,rect.height)/rect.height

	coolnewheight = Math.max(impoerialheight, top/(r.height - window.innerHeight))//1 - (r.bottom - window.innerHeight)/(r.height - window.innerHeight)//-rect.top/rect.height

	document.querySelector('.down').style.opacity = 1-coolnewheight

	params.mult = .000042 * (impoerialheight*3+1)
	params.push = 25 * (impoerialheight*3+1)

	animating = rect.bottom > 0
}

addEventListener('scroll', scrollhandle)