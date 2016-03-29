/**
 * http://usejsdoc.org/
 */

var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(express.bodyParser());
app.use(app.router);
app.use(express.logger());
app.use(express.static(__dirname + '/public'));

//Running web server
var run = http.createServer(app);

run.listen(30000, function(error){	
	console.log('Express server listening on port 30000');
});

app.get('/', function (request, response, next) {
    fs.readFile('./d3_select.html', function (error, data) {
        response.sendfile('d3_select.html');
    });
});