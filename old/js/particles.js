
// var bg = document.getElementById("bg");
// var bgctx = bg.getContext("2d");

function particle_system(canvas, params){
	var ctx = canvas.getContext("2d");
	var particles = [];
	var drag = [];
	var connections = []
	var circle = (function(){
		var tmpCanvas = document.createElement('canvas');
		var tmpCtx = tmpCanvas.getContext('2d');
		tmpCanvas.width = 8*2
		tmpCanvas.height = 8*2
		tmpCtx.fillStyle = 'white'
		tmpCtx.moveTo(tmpCanvas.width/2, tmpCanvas.height/2);
		tmpCtx.beginPath();
		tmpCtx.arc(tmpCanvas.width/2, tmpCanvas.height/2, tmpCanvas.width/2, Math.PI*2, false);
		tmpCtx.closePath()
		tmpCtx.fill();
		return tmpCanvas
	})()


	function Particle()
	{
		return {
			x: (Math.random()*(canvas.width-2*params.initialinset) + params.initialinset)/2,
			y: (Math.random()*(canvas.height-2*params.initialinset) + params.initialinset)/2,

			c: 1,
			
			vx: 0,
			vy: 0,
			ax: 0,
			ay: 0,
			
			color: "rgba(0,0,0,1)",
			
			radius: 4
		}
	}


	function updateconnections(){
		var intervals = []
		var dist = params.push + params.pull
		particles.forEach(function(p,j){
			// console.log(p)
			intervals.push({
				particle:j,
				type:"start",
				x:p.x-dist
			})
			intervals.push({
				particle:j,
				type:"end",
				x:p.x+dist
			})
		})
		intervals.sort(function(p,q){
			return p.x - q.x
		})
		var particlesincurrentinterval = new Set();

		var len = intervals.length
		for (var i = 0; i < len; i++) {
			var curinterval=intervals.pop()
			if(curinterval.type === "start"){
				var diameter = 2*dist
				var radiussquared = dist*dist
				// console.log(curpoints.length)
				var p = particles[curinterval.particle]

				particlesincurrentinterval.forEach(function(index){
					var q = particles[index]
					var dy = p.y - q.y
					if(Math.abs(dy)<diameter){
						var dx = p.x - q.x
						var d = dx*dx+dy*dy
						if(d<radiussquared){
							connections.push({
								p1:curinterval.particle,
								p2:index
							})
						}
					}
				})
				particlesincurrentinterval.add(curinterval.particle)
			}
			else {
				particlesincurrentinterval.delete(curinterval.particle)
			}
		}
	}

	function addvels(dt) {
		var dist = params.push + params.pull
		var m
		while(typeof (m=connections.pop()) === "object")
		{

			var p1 = particles[m.p1];
			var p2 = particles[m.p2];

			var dx = (p1.x - p2.x)
			var dy = (p1.y - p2.y)

			var d = Math.sqrt(dx*dx+dy*dy)

			var dvx = (p1.vx-p2.vx);
			var dvy = (p1.vy-p2.vy);

			var dot = (dx*dvx+dy*dvy)/d;
			var f = params.mult*(dist-d)*(params.push-d)/d;

			var fx=dx*f;
			var fy=dy*f;


			// var dvx = p1.vx-p2.vx;
			// var dvy = p1.vy-p2.vy;

			// var dot = (dx*dvx+dy*dvy)/d;

			// var dv = Math.sqrt(dvx*dvx+dvy*dvy)

			// var f = d < params.push ? (params.push - d)*params.pushratio : (d-dist) * (1-params.pushratio)
			// // console.log(f)


			// fxs[m.p1]+= dx/d * f;
			// fys[m.p1]+= dy/d * f;

			// fxs[m.p2]-= dx/d * f;
			// fys[m.p2]-= dy/d * f;


			// var visc = d < params.push ? params.visc : 0

			// fxs[m.p1]-= (dvx - dot*dx/d)*visc;
			// fys[m.p1]-= (dvy - dot*dy/d)*visc;

			// fxs[m.p2]+= (dvx - dot*dx/d)*visc;
			// fys[m.p2]+= (dvy - dot*dy/d)*visc;


			// var visc = m.d < params.push  ? params.visc : 0

			p1.ax+=(fx*p2.c+params.visc*(dvx-dot*dx)/(d))/p1.c;
			p1.ay+=(fy*p2.c+params.visc*(dvy-dot*dy)/(d))/p1.c;
			
			p2.ax-=(fx*p1.c+params.visc*(dvx-dot*dx)/(d))/p2.c;
			p2.ay-=(fy*p1.c+params.visc*(dvy-dot*dy)/(d))/p2.c;
		}//*/
		for(var i = 0; i < drag.length; i++){
			var m=drag[i];
			var d = (mouse.x-m.x)*(mouse.x-m.x)+(mouse.y-m.y)*(mouse.y-m.y);
			m.ax+=.5*(mouse.x-m.x)/(1000*m.c);
			m.ay+=.5*(mouse.y-m.y)/(1000*m.c);

			// fxs[particles.indexOf(m)]+=(mouse.x-m.x)/(10000*m.c)*1000;
			// fys[particles.indexOf(m)]+=(mouse.y-m.y)/(10000*m.c)*1000;
		}
		for(var i = 0; i<particles.length; i++){
			// var p=particles[i], fx=fxs[i]*params.mult, fy = fys[i]*params.mult;

			// // p.c=1;

			// // console.log(fx,fy)

			// var oldvx = p.vx
			// var oldvy = p.vy

			// p.vx+=fx;
			// p.vy+=fy;

			// // p.ax=0;
			// // p.ay=0;
			
			// p.vx*= params.fric;
			// p.vy*= params.fric;
			
			// p.vy+= params.ygrav;
			// p.vx+= params.xgrav;

			// p.x += p.vx*dt;
			// p.y += p.vy*dt;


			var p=particles[i];

			p.c=1;
			p.vx+=p.ax;
			p.vy+=p.ay;
			// console.log(p)

			p.ax=0;
			p.ay=0;
			p.vx*=params.fric;
			p.vy*=params.fric;
			p.vy+=params.ygrav;
			p.vx+=params.xgrav;
			p.x += p.vx;
			p.y += p.vy;
			// console.log(p)



			var bounds = {
				left: (p.radius)/2,
				right: (canvas.width-p.radius)/2,
				top: (p.y < p.radius)/2,
				bottom: (canvas.height-p.radius)/2
			}

			if(p.x < bounds.left) {p.x+=1.1*(bounds.left-p.x); p.vx *= -params.bounce; p.vy *= params.wfric}
			else if(p.x > bounds.right) {p.x-=1.1*(p.x-bounds.right); p.vx *= -params.bounce; p.vy *= params.wfric}
			if(p.y < bounds.top) {p.y+=1.1*(bounds.top-p.y); p.vy *= -params.bounce; p.vx *= params.wfric}
			else if(p.y > bounds.bottom) {p.y-=1.1*(p.y-bounds.bottom); p.vy *= -params.bounce; p.vx *= params.wfric}//*/

			var inset = p.radius+100;
			var insetacceleration = .08	
			if(p.x < inset) {p.vx += insetacceleration}
			if(p.x > bounds.right-inset) {p.vx -= insetacceleration}
			if(p.y < inset) {p.vy += insetacceleration}
			if(p.y > bounds.bottom-inset) {p.vy -= insetacceleration}
		}
	}



	function draw()
	{	
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if(params.lines){
			ctx.strokeStyle = "#ffffff";
			// ctx.lineWidth = 2;
			ctx.beginPath();
			for(var t = 0; t < connections.length; t++)
			{
				m=connections[t];
				var p = particles[m.p1];
				var j = particles[m.p2];
				ctx.moveTo(p.x*2, p.y*2);
				ctx.lineTo(j.x*2, j.y*2);
			}

			ctx.stroke();

		}
		if(params.dots){
			for(var t = 0; t < particles.length; t++){
				var p = particles[t];
				ctx.drawImage(circle,(p.x-4)*2,(p.y-4)*2)
			}
		}
	}

	function matchNump() {
		if(params.nump < particles.length){
				particles.pop()
		}
		else if (params.nump > particles.length){
			particles.push(Particle())
		}
	}

	function nextframe(dt){
		matchNump()
		updateconnections()
		draw()
		addvels(dt)
	}


	function reset(){
		particles=[];
		for(var i = 0; i < params.nump; i++)
		{
			particles.push(Particle());
		}	
	}

	function startdragging(point,radius){
		drag = [];
		var r2 = radius*radius
		for(var k = 0; k < particles.length; k++)
		{
			var j = particles[k];
			var dx = (point[0]-j.x);
			var dy = (point[1]-j.y);
			var d = dx*dx+dy*dy;
			if(d < r2){
				drag.push(j);
			}
		}
	}

	function stopdragging(){
		drag = []
	}

	function getparticles() {
		return particles
	}

	return {
		reset: reset,
		nextframe: nextframe,
		startdragging: startdragging,
		stopdragging: stopdragging,
		getparticles: getparticles
	}
}