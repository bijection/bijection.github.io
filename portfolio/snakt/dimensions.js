/**\
|**|
|**| Snakt double-screen behavior mockup
|**| dimension.js
|**| Copyright Snakt 2014
|**|
\**/


function getWidth() {
	if (window.innerWidth) {
	   return window.innerWidth;
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
	if (window.innerWidth) {
	   return window.innerHeight;
	}
	if (document.documentElement && document.documentElement.clientHeight){
		return document.documentElement.clientHeight;
	}
	if (document.body) {
		return document.body.clientHeight;
	}
	return 0;
}