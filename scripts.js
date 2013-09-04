var CookieModel = function(data){
	this.id = data.id;
	this.name = data.name;
	this.bakeTime = data.bakeTime;
	this.totalTime = 0;
	this.location = 'prep';
};

CookieModel.prototype.bake = function(){
	this.totalTime++;
	$(this).trigger({
		type: 'bakeCookie',
		model: this
	});
};

CookieModel.prototype.status = function(){
	if (this.totalTime === 0) {
		return "raw";
	} else if (this.totalTime < this.bakeTime) {
		return "still_gooey";
	} else if (this.totalTime == this.bakeTime) {
		return "just_right";
	} else if (this.totalTime <= this.bakeTime + 2) {
		return "crispy";
	} else {
		return "burned";
	}
};

var CookieCollection = function(){
	this.count = 0;
	this.cookies = [];
};

CookieCollection.prototype.add = function(data){
	this.count++;
	var cookie = new CookieModel({
		id: this.count,
		name: data.name,
		bakeTime: data.bakeTime
	});
	this.cookies.push(cookie);
	return cookie;
};

var CookiePrepView = function(model){
	this.model = model;
	this.$elem = $("<li></li>");
	this.template = _.template($('#cookie-prep-template').html());
};

CookiePrepView.prototype.render = function(){
	this.$elem.html(this.template({model:this.model}));
	return this.$elem;
};

CookiePrepView.prototype.createEventHandlers = function(){
	var that = this;
	this.$elem.on('click', 'button', function(e){
			that.model.location = 'oven';
			var view = new CookieOvenView(that.model);
			view.createEventHandlers();
			console.log(view);
			$('#rack_' + that.model.id.toString()).html(view.render());
	});
};

var CookieOvenView = function(model){
	this.model = model;
	this.$elem = $("<div></div>");
	this.template = _.template($('#cookie-oven-template').html());
};

CookieOvenView.prototype.render = function(){
	this.$elem.html(this.template({model:this.model}));
	return this.$elem;
};

CookieOvenView.prototype.createEventHandlers = function(){
	var that = this;
	$(this.model).on('bakeCookie', function(e){
		console.log(e);
		that.render();
	});
};

$(document).ready(function(){
	cookieCollection = new CookieCollection();
	$('#new_batch').on('submit', function(e){
		e.preventDefault();
		var name = $(this).find('input[name=batch_type]').val();
		var time = $(this).find('input[name=bake_time]').val();
		var cookie = cookieCollection.add({
			name: name,
			bakeTime: parseInt(time)
		});
		var view = new CookiePrepView(cookie);
		view.createEventHandlers();
		$('#prep_batches').append(view.render());
	});

	$('#bake').on('click', function(){
		$.each(cookieCollection.cookies, function(key, val){
			if (val.location == "oven") {
				val.bake();
			}
		});
	});
});