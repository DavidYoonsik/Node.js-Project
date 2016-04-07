/**
 * http://usejsdoc.org/
 * 
 * Use FB module to load data from facebook site
 * 
 * SetInterval() to crawl data periodically
 * 
 * 
 */

var access_token = 'CAAYcyJyyVdYBAHqs5Qs50piDxaWFvDRRmWf6vu94mUMK44qABDC7iRUqVOrdUAlYWQkVSTNzvwUZB2spXJdhdwQa3nz2ZABZCSeG7zDOIi8PDdHZBSTgwhdSUDvdLlvurQZCRJuNPmnbQyYvx5RtgQZBlNVP77F5jvO8GXohcayFJOxoOERqCWFDZCZAMgSt68ENbAL96twRTy5HW07qp7IQ';
var myId = '734230706698657';//'734230706698657';//'1400166580254734';

var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var FB = require('fb');
var url = require('url');
var fs = require('fs');
var es = require('elasticsearch');
var jsonfile = require('jsonfile');
var client = null;

var app = express();

app.use(express.bodyParser());
app.use(app.router);
app.use(express.logger());
app.use(express.static(__dirname + '/public'));

var run = http.createServer(app);

run.listen(30000, function(error){	

	client = new es.Client({
		host:'127.0.0.1:9200',
		log:'trace'
	});
	console.log('Express server listening on port 30000');


});

app.get('/', function (request, response) {
	fs.readFile('./getAccessToken.html', function (error, data) {
		response.sendfile('getAccessToken.html');
	});
});

app.post('/data', function (request, response) {	

	access_token = request.body.access;

	FB.setAccessToken(access_token);

	feedLink = '1400166580254734/posts';	//'usitnewsinkorea/posts'; // me/feed

	getWallFeeds(feedLink, {}, response);

});

var glo = '';

function getAccessToken(){
	FB.api('oauth/access_token', {
		client_id: '1720497808233942',
		client_secret: 'your secret',
		redirect_uri: 'http://ip_address:30000/',
		grant_type: 'user_token located in settings'
	}, function (res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		}

		access_token = res.access_token;
		alert(access_token);
		FB.setAccessToken(access_token);
	});
}

function getWallFeeds(feedLink, args, response) {



	FB.api(feedLink, 'get', args, function (res) {
		if (!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);

			getAccessToken();

		}

		//console.log(res.data);
		processMessage(res.data);

		//response.send(res.data);

		var nextLinkParts = url.parse(res.paging.next, true);

		//console.log(nextLinkParts);

		var args = {
				limit: nextLinkParts.query.limit,
				until: nextLinkParts.query.until,
				access_token: nextLinkParts.query.access_token
		};


		getWallFeeds(feedLink, args, response);
	});
}


function processMessage(data) {

	var arr = [];

	for (i in data) {

		var json = {
				message:data[i].message,
				story:data[i].story
		};

		arr.push(json);

		client.index({
			index:'facebook',
			type:'fb',
			id:data[i].id,
			body:{
				message:data[i].message,
				created_time:data[i].created_time
			}
		}, function(err, res){
			if(err){
				console.log(err);
			}else{
				//console.log(movie);
				//console.log('success');
			};
		});

		//console.log('for : ' + i);

		/*if (data[i].from.id!=myId) {
			name = data[i].from.name;
			message = data[i].message;
			console.log(name+':::::::::::::::: '+message);
		}else{
			name = data[i].from.name;
			message = data[i].message;
			console.log(name+': '+message);
		}*/

		//console.log(data[i]);
		/*var loc = data[0].message;
	if(glo.length == 0){
		glo = data[0].message;
		fs.appendFile('log2.txt', data, 'utf-8', function(err){
			if(err){
				throw err;
			}
		});
	}else{
		if(glo.length == loc.length){
			console.log('same result is got from facebook!');
		}else{
			fs.appendFile('log2.txt', data[0].message, 'utf-8', function(err){
				if(err){
					throw err;
				}
			});
		}
	}*/

	}

	//console.log('end for');

	/*jsonfile.writeFile("log2.txt", arr, function (err) {
		console.error(err);
	});*/

	/*fs.appendFile('log2.json', arr, 'utf-8', function(err){ // data[i].message + ', ' + data[i].story
		if(err){
			throw err;
		}else{

		}
	});*/
}
