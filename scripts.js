var CookieModel = function(data){
	var count = count || 0;
	count++;

	this.id = count;
	this.name = data.name;
	this.bakeTime = data.bakeTime;
	this.totalTime = 0;
};

CookieModel.prototype.bake = function(){
	this.totalTime++;
};

CookieModel.prototype.status = function(){
	if (this.totalTime === 0) {
		return "raw";
	} else if (this.totalTime < this.bakeTime) {
		return "still_gooey";
	} else if (this.totalTime == this.bakeTime) {
		return "just_right";
	} else {
		return "crispy";
	}
};

var CookiePrepView = function(model){
	this.$elem = $("<li></li>");
};


$(document).ready(function(){


});