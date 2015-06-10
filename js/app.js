var App= Ember.Application.create({
		LOG_TRANSITIONS: true
});

App.Router.map(function(){
	this.route('about');
	this.route('settings');
	// this.route('index');
});

