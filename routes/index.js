var express = require('express');
var router = express.Router();
var path = require('path');
var handlebars = require('handlebars');
var fs = require('fs');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	var template = fs.readFile(path.join(__dirname, '../views/index.handlebars'), 'utf8', function(err, source){
		var templateScript = handlebars.compile(source);
		foursquare_venues(function(venues){
			var context = {'venues' : venues};
			var html = templateScript(context);
			res.render('index', {
				venues:venues
			});
		});
	});
});




function foursquare_venues(callback)
{
	https = require("https")
	var lat = -33.4196897;
	var long = -70.6075518;

	var body = [];
	var venues;

	var options = {
		host: 'api.foursquare.com',
		path: '/v2/venues/search?client_id=D0K5YSWBYXG44A5D3KUUSBADW2GH23KYFEISDJH1GO4YIYWJ&client_secret=XXYJGWDDSSHIMR4AJM13K4SS3IYTSKWSMQGA4N0ZEOJF0ARN&v=20130815&ll='+lat+','+long
	};

	https.request(options, function(res){
		res.on('data', function(chunk){
			body.push(chunk);
		});
		res.on('end', function(){
			body = Buffer.concat(body).toString();
			venues = JSON.parse(body)['response']['venues'];
			callback(venues);
		});
	}).end();
}

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
