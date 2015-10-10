/**\
|**|
|**| Snakt double-screen behavior mockup
|**| clip.js
|**| Copyright Snakt 2014
|**|
\**/

function clip(x,y,width,height,index){
	this.x = x
	this.y = y
	this.width = width
	this.height = height
	this.aspectratio = width/height
	this.rheight = 0
	this.i = index
	this.color = '#'+(16777216+Math.floor(Math.random()*16777215)).toString(16).slice(1);
}

clip.prototype.pos = function(x,y) {
	this.x = x
	this.y = y
}

clip.prototype.swid = function(width){
	var proportion = Math.min((width-initialclipwidth)/initialclipwidth,1)
	this.height = this.height*width/this.width
	this.rheight = proportion*(width-this.height) 
	this.width = width
}

clip.prototype.wid = function(width){
	this.height = this.height*width/this.width
	this.width = width
}

clip.prototype.draw = function(){
	var scale = (this.height+this.rheight)/logo.height
	ctx.globalAlpha = 1
	ctx.fillStyle = this.color
	ctx.fillRect(this.x+w/2- initialclipwidth - 5,this.y+h/2-2.56*initialclipwidth+topoffset+17,this.width,this.height+this.rheight)			
	if(images){
		ctx.drawImage(logo,
			(logo.width-this.width/scale)/2,
			0,
			this.width/scale,
			logo.height,
			this.x+ w/2 - initialclipwidth - 5,
			this.y+h/2-2.56*initialclipwidth+topoffset+17,
			this.width,
			this.height+this.rheight
		)
	}
}