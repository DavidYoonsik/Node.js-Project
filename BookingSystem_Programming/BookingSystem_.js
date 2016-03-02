var socketio = require('socket.io');
var mongo = require('mongodb').MongoClient;
var server = require('mongodb').Server;
var express = require('express');
var http = require('http');
var fs = require('fs');
var objectId = require('mongodb').ObjectID;

var app = express();

app.use(app.router);

var mongoclient = new mongo(new server('localhost',27017,{'native_parser':true}));

//Running web server
var run = http.createServer(app);

run.listen(30000, function(error){	
	if(!error){
		mongoclient.open(function(err, mongoclient) {
			if(err) throw err;
			console.log('MongoDB client connected on port 27017');
		});
	}
	console.log('Express server listening on port 30000');
});

var db = mongoclient.db('node'); // What you want to use for database

var seats = [];

app.get('/', function (request, response, next) {
    fs.readFile('HTMLPage.html', function (error, data) {
    	console.log(seats);
    	seats = [];
    	// seats initialize, data from mongoDB, movie collection
    	db.collection('movie').find({}, {_id:1, seat:1}).toArray(function(err, result){
    		for(var i = 0; i < result.length; i++){
    			console.log(result[i]);
    			seats.push(result[i]);
    		}
    	});
        response.send(data.toString());
    });
});

app.get('/seats', function (request, response, next) {
	console.log(seats);
	response.send(seats);
});



// Running socket server
var io = socketio.listen(run);
io.sockets.on('connection', function (socket) {
    socket.on('reserve', function (data) {
    	//console.log('id : ' + data.id + ', ' + data.x);
    	var x = data.id;
    	var y = data.x;
    	//console.log(x);
    	
    	db.collection('movie').find({_id:objectId(x)}, {_id:0, seat:1}).toArray(function(err, result){    		
    		console.log(result[0].seat[data.x]);    		
    	});
    	
    	var set = {};
    	set['seat.' + y] = 2;
    	
    	console.log(set);
    	
    	// Update seat's value 1 to 2 meaning it is booked.
    	db.collection('movie').update({ _id:objectId(x)}, {$set:set}, function(err, result){
    		console.log('Update Succeed!');
    	});
    	
        seats[data.y][data.x] = 2;
        io.sockets.emit('reserve', data);
    });
});
