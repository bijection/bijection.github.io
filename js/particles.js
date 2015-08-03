
// var bg = document.getElementById("bg");
// var bgctx = bg.getContext("2d");

function particle_system(canvas, params){
	var ctx = canvas.getContext("2d");
	var particles = [];
	var drag = [];
	var intervals = []
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
			x: Math.random()*(canvas.width-2*params.initialinset) + params.initialinset,
			y: Math.random()*(canvas.height-2*params.initialinset) + params.initialinset,

			c: 1,
			c1: 1,
			
			vx: 0,
			vy: 0,
			ax: 0,
			ay: 0,
			
			color: "rgba(0,0,0,1)",
			
			radius: 4
		}
	}


	function addvels(dt) {



		var m
		while(typeof (m=connections.pop()) === "object")
		{
			var p1 = particles[m.p1];
			var p2 = particles[m.p2];
			var fx=m.dx*m.f;
			var fy=m.dy*m.f;
			p1.ax+=(fx*p2.c+params.visc*(m.dvx-m.dot*m.dx)/(m.d))/p1.c;
			p1.ay+=(fy*p2.c+params.visc*(m.dvy-m.dot*m.dy)/(m.d))/p1.c;
			p2.ax-=(fx*p1.c+params.visc*(m.dvx-m.dot*m.dx)/(m.d))/p2.c;
			p2.ay-=(fy*p1.c+params.visc*(m.dvy-m.dot*m.dy)/(m.d))/p2.c;
		}//*/
		for(var i = 0; i < drag.length; i++){
			var m=drag[i];
			var d = (mouse.x-m.x)*(mouse.x-m.x)+(mouse.y-m.y)*(mouse.y-m.y);
			m.ax+=(mouse.x-m.x)/(1000*m.c);
			m.ay+=(mouse.y-m.y)/(1000*m.c);
		}
		for(var i = 0; i<particles.length; i++){
			var p=particles[i];
			p.c1=p.c-1;
			p.c=1;

			var oldvx = p.vx
			var oldvy = p.vy

			p.vx+=p.ax;
			p.vy+=p.ay;
			p.ax=0;
			p.ay=0;
			p.vx*=params.fric;
			p.vy*=params.fric;
			p.vy+=params.ygrav;
			p.vx+=params.xgrav;
			p.x += (p.vx+oldvx)/2*dt;
			p.y += (p.vy+oldvy)/2*dt;

			if(p.x < p.radius) {p.x+=1.1*(p.radius-p.x); p.vx *= -params.bounce; p.vy *= params.wfric}
			else if(p.x > canvas.width-p.radius) {p.x-=1.1*(p.x-(canvas.width-p.radius)); p.vx *= -params.bounce; p.vy *= params.wfric}
			if(p.y < p.radius) {p.y+=1.1*(p.radius-p.y); p.vy *= -params.bounce; p.vx *= params.wfric}
			else if(p.y > canvas.height-p.radius) {p.y-=1.1*(p.y-(canvas.height-p.radius)); p.vy *= -params.bounce; p.vx *= params.wfric}//*/

			var inset = p.radius+200;
			var insetacceleration = .08	
			if(p.x < inset) {p.vx += insetacceleration}
			if(p.x > canvas.width-inset) {p.vx -= insetacceleration}
			if(p.y < inset) {p.vy += insetacceleration}
			if(p.y > canvas.height-inset) {p.vy -= insetacceleration}
		}
	}


	function updateconnections(){
		var dist = params.push + params.pull
		particles.forEach(function(p,j){
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
		var particlesincurrentinterval = new Set(),
			curinterval
		while(typeof (curinterval=intervals.pop()) === "object"){
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
							d = Math.sqrt(d)
							p.c+=1/(d*d+10);
							q.c+=1/(d*d+10);
							var dvx = p.vx-q.vx;
							var dvy = p.vy-q.vy;
							var dot = (dx*dvx+dy*dvy)/(d);
							var f=params.mult*(dist-d)*(params.push-d)/d;
							connections.push({
								p1:curinterval.particle,
								p2:index,
								dx:dx,
								dy:dy,
								dvx:dvx,
								dvy:dvy,
								dot:dot,
								f:f,
								d:d
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



	function calc(dt){
		addvels(dt);
		updateconnections()
	}


	function draw()
	{	
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if(params.lines){
			ctx.strokeStyle = "#ffeeee";
			// ctx.lineWidth = 2;
			ctx.beginPath();
			for(var t = 0; t < connections.length; t++)
			{
				m=connections[t];
				var p = particles[m.p1];
				var j = particles[m.p2];
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(j.x, j.y);
			}

				ctx.stroke();

		}
		if(params.dots){
			for(var t = 0; t < particles.length; t++){
				var p = particles[t];
				ctx.drawImage(circle,p.x-8,p.y-8)
			}
		}
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

	return {
		reset: reset,
		draw: draw,
		calc: calc,
		startdragging: startdragging,
		stopdragging: stopdragging
	}
}