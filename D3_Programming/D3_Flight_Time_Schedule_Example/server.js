/**
 * http://usejsdoc.org/
 */

var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');

//var db_config = require('./db_connection.js')

var app = express();

app.use(app.router);
app.use(express.logger());
app.use(express.static(__dirname + '/public'));

//Running web server
var run = http.createServer(app);

run.listen(30001, function(error){	
	if(!error){
		//db_config.get_open();
	}
	console.log('Express server listening on port 30001');
});

//var db = db_config.get_db('flight');

app.get('/', function (request, response, next) {
    fs.readFile('./index2.html', function (error, data) {
        response.sendfile('index2.html');
    });
});

app.get('/data', function(req, res){
	db.collection('time_schedule').find({}).toArray(function(err, result){    		
		res.json(result);
	});
});
