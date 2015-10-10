/**\
|**|
|**| Snakt double-screen behavior mockup
|**| input.js
|**| Copyright Snakt 2014
|**|
\**/

document.addEventListener("touchstart", mdown, false);
document.addEventListener("touchend", mup, false);
document.addEventListener("touchmove", mmove, true);

document.addEventListener("mousedown", mdown, false);
document.addEventListener("mouseup", mup, false);
document.addEventListener("mousemove", mmove, false);

document.addEventListener("mousewheel", scroll, false);
document.addEventListener('keydown',checkKey)

var keywaspressed = false,
	screennum = 1,
	mouseX = 0,
	mouseY = 0,
	mouseisdown = false,
	start={
		leftwidth: leftwidth,
		rightwidth: rightwidth,
		mouseX: mouseX,
		mouseY: mouseY,
		leftscrolloffset: leftscrolloffset,
		rightscrolloffset: rightscrolloffset,
		swiping:false,
		scrolling:false
	};

function checkKey(e) {
	e = e || window.event;

	if (e.keyCode == '37') {
		// left
		keywaspressed=true
		if (screennum>0) {screennum--}
	}
	else if (e.keyCode == '39') {
		// right
		keywaspressed=true
		if (screennum<2) {screennum++}
	}
}

function scroll(e){
	if(screennum==0){
		rightscrolloffset+=e.wheelDeltaY/12	
	}
	else if(screennum==2){
		leftscrolloffset+=e.wheelDeltaY/12					
	}
	else{
		if(mouseX>w/2){
			rightscrolloffset+=e.wheelDeltaY/12
		}
		else{
			leftscrolloffset+=e.wheelDeltaY/12
		}					
	}
}

function setmouse(x,y){
	mouseX = x
	mouseY = y
}

function coords(e)
{
	e.preventDefault()
	if(e.pageX){
		setmouse(e.pageX,e.pageY)
	}
	else if(e.offsetX) {
		setmouse(e.offsetX,e.offsetY)
	}
	else if(e.layerX) {
		setmouse(e.layerX,e.layerY)
	}
	else if(e.targetTouches){
		setmouse(e.targetTouches[0].page,e.targetTouches[0].pageY)
	}
}

function mmove(e){
	coords(e)
	var dx = mouseX-start.mouseX
	var dy = mouseY-start.mouseY
	if(mouseisdown){
		if(!start.scrolling&&!start.swiping){
			if(Math.abs(dy)+Math.abs(dx)>10){
				if(Math.abs(dy)>Math.abs(dx)){
					start.scrolling = true
				}
				else{
					start.swiping = true
				}
			}
		}
		if(start.scrolling){
			if(screennum==0){
				rightscrolloffset=start.rightscrolloffset+dy/2
			}
			else if(screennum==2){
				leftscrolloffset=start.leftscrolloffset+dy*(initialclipheight+10)/(2*initialclipwidth+detailheight+20)
			}
			else{
				if(start.mouseX>w/2){
					rightscrolloffset=start.rightscrolloffset+dy
				}
				else{
					leftscrolloffset=start.leftscrolloffset+dy
				}					
			}
		}
	}
}

function mdown(e){
	mouseisdown = true
	coords(e)
	start={
		leftwidth: leftwidth,
		rightwidth: rightwidth,
		mouseX: mouseX,
		mouseY: mouseY,
		leftscrolloffset: leftscrolloffset,
		rightscrolloffset: rightscrolloffset,
		swiping:false,
		scrolling:false
	};
}

function mup(e){
	coords(e)
	mouseisdown = false
}