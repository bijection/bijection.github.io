/**\
|**|
|**| Snakt double-screen behavior mockup
|**| main.js
|**| Copyright Snakt 2014
|**|
\**/

console.clear()
console.log('Arrow keys to see animation')

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	w,h,
	initialclipwidth = 145,
	initialclipheight = 81,
	clipsleft = [],
	clipsright = [],
	leftwidth = initialclipwidth*2+10,
	rightwidth = initialclipwidth*0,
	detailheight = 200,
	topoffset = 100,
	rightscrolloffset = 0,
	leftscrolloffset = 0,
	images = true,
	logo = new Image();

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (action) {setTimeout(action(new Date().getTime()),10)};

canvas.width = getWidth()*2
canvas.height = getHeight()*2
canvas.style.width = getWidth()
canvas.style.height = getHeight()

logo.src = 'logo.png'

logo.onerror = function(){
	images = false
	console.clear()
	console.log('%cPlease check that logo.png is in the correct directory','color:#f00;font-size:25px')
	console.log('Arrow keys to see animation')
}

var iphone = new Image()
iphone.src = 'iphone.png'

var headerheight = -250


function draw(time){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var curW = getWidth()*2
	var curH = getHeight()*2
	if (curW!=w||curH!=h){
		w=curW
		h=curH
		canvas.height = h
		canvas.width = w
		canvas.style.height = h/2
		canvas.style.width = w/2
	}
	
	var deltat = time-lastframe
	lastframe = time;
	
	if (start.swiping&&mouseisdown){
		leftwidth = (start.leftwidth-start.mouseX+mouseX)||.1
		rightwidth = 2*initialclipwidth-leftwidth||.1
	}
	else{
		if (keywaspressed){
			if (screennum==1){
				leftwidth += deltat/initialclipheight*(initialclipwidth-leftwidth)
			}
			else if(screennum==0){
				leftwidth += deltat/initialclipheight*(-10-leftwidth)
			}
			else{
				leftwidth += deltat/initialclipheight*(10+2*initialclipwidth-leftwidth)
			}
			if (Math.abs(initialclipwidth*screennum-leftwidth)<1){
				keywaspressed=false
			}
		}
		else{
			if (Math.abs(initialclipwidth-leftwidth)<initialclipheight){
				screennum = 1
				leftwidth += deltat/initialclipheight*(initialclipwidth-leftwidth)
			}
			else if(initialclipwidth-leftwidth>initialclipheight){
				screennum = 0
				leftwidth += deltat/initialclipheight*(-10-leftwidth)
			}
			else{
				screennum = 2
				leftwidth += deltat/initialclipheight*(2*initialclipwidth+10-leftwidth)
			}
		}
		rightwidth = (2*initialclipwidth-leftwidth||.1)
	}

	for (var i = 0; i < clipsleft.length; i++) {
		var c = clipsleft[i]
		if (leftwidth>initialclipwidth){
			c.swid(leftwidth)
			var proportion = (leftwidth-initialclipwidth)/initialclipwidth
			var off= leftscrolloffset/100*(c.height+c.rheight+10+proportion*detailheight)
			c.pos(0,c.i*(c.height+c.rheight+10+proportion*detailheight)+off)
		}
		else{
			c.swid(initialclipwidth)
			var off= leftscrolloffset/100*(c.height+10)
			c.pos(leftwidth-initialclipwidth,c.i*(c.height+10)+off)
		}
		c.draw()
	};

	for (var i = 0; i < clipsright.length; i++) {
		var c = clipsright[i]
		c.wid(Math.max(rightwidth,initialclipwidth))
		var off = rightscrolloffset/100*(c.height+10)
		c.pos(leftwidth+10,c.i*(c.height+10)+off)
		c.draw()
	};
	
	var m = 1.29
	/*  code below masks clips outside the iphone image  */




	ctx.fillStyle = '#fff'
	ctx.globalAlpha = 1 //change this value to .5 to see the off screen clips
	ctx.fillRect(0,0,w,h/2-2*m*initialclipwidth+topoffset)
	ctx.fillRect(0,0,w/2- initialclipwidth-15,h)
	ctx.fillRect(w/2+initialclipwidth+15,0,w/2- initialclipwidth-15,h)
	ctx.fillRect(0,h/2+300,w,800)

	ctx.globalAlpha = 1
	ctx.drawImage(iphone,0,0,iphone.width,iphone.height,
		w/2-m*initialclipwidth,
		h/2-2*m*initialclipwidth,
		2*m*initialclipwidth,
		4*m*initialclipwidth)

	var wolo = function(a){return a+w/2 - initialclipwidth - 5}

	ctx.font = "20px arial"

	var title1 = "Home"
	var title2 = "Edit"

	var a = wolo(Math.max((leftwidth<initialclipwidth? leftwidth - initialclipwidth:0) - ctx.measureText(title1).width/2 + (leftwidth>=initialclipwidth? leftwidth/2 : initialclipwidth/2),0))
	var b = wolo(Math.min(- ctx.measureText(title1).width/2 
		+ leftwidth + (leftwidth<=initialclipwidth? rightwidth / 2: initialclipwidth/2) +10,
		initialclipwidth*2 - ctx.measureText(title2).width))

	ctx.fillStyle = '#f50'

	ctx.fillRect(wolo(0) - 10,headerheight - 30 + h/2,initialclipwidth*2+30,40)
	ctx.fillStyle = '#fff'

	ctx.fillText(title1,a,headerheight+h/2)
	ctx.fillText(title2,b,headerheight+h/2)


	requestAnimationFrame(draw)
}


var lastframe

requestAnimationFrame(function(time){
	lastframe = time

	for (var i = 0; i < 15; i++) {
		var m=new clip(-5,(initialclipheight+10)*i,initialclipwidth,initialclipheight,i)
		clipsleft.push(m)
	};
	
	for (var i = 0; i < 15; i++) {
		var m=new clip(initialclipwidth+5,(initialclipheight+10)*i,initialclipwidth,initialclipheight,i)
		clipsright.push(m)
	};

	requestAnimationFrame(draw)				
})
