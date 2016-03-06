/**
 * http://usejsdoc.org/
 */

var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');

var db_config = require('./db_connection.js')

var app = express();

app.use(app.router);
app.use(express.logger());
app.use(express.static(__dirname + '/public'));

//Running web server
var run = http.createServer(app);

run.listen(30000, function(error){	
	if(!error){
		db_config.get_open();
	}
	console.log('Express server listening on port 30000');
});

var db = db_config.get_db('node');

var seats = [];

app.get('/', function (request, response, next) {
    fs.readFile('./test.html', function (error, data) {
        response.sendfile('test.html');
    });
});

app.post('/data', function(req, res){
	db.collection('dateFormat').find({},{_id:0, date:1, close:1}).toArray(function(err, result){    		
		console.log(result);
		res.json(result);
	});
});
