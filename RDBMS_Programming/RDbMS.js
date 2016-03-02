/**
 * http://usejsdoc.org/
 */

var mongo = require('mongodb').MongoClient;
var server = require('mongodb').Server;
var objectId = require('mongodb').ObjectID;
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');


// Make connection MongoDB
var mongoClient = new mongo(new server('localhost',27017,{'native_parser':true}));

var express = express();
// Using express router module
express.use(express.router);

// Running express module server
var serverRunning = http.createServer(express);
serverRunning.listen(30000, function(err){
	if(!err){
		mongoClient.open(function(err, mongoclient) {
			if(err) throw err;
			
			console.log('MongoDB client connected on port 27017');
		});
	}
	console.log('Express server listening on port 30000');
});

// Running Socket.io module server
var socketRunning = socketio.listen(serverRunning);
socketRunning.sockets.on('connection', function(socket){
	
});

// Choose MongoDB collection
var db = mongoClient.db('node');


express.get('/', function (request, response, next) {
    
	db.collection('boy').find({'name':'yys'}, {_id:1}).toArray(function(err, result){
		console.log(result[0]._id);
		var id = result[0]._id;
		
		
		
		/* Data input function
		 * 
		 	db.collection('girl').save({'name':'alex', 'boy':id}, function(err, result){
			if(!err){
				console.log(result);
			}else{
				console.log('Fail to save it');
			}
		});*/
		
		/*
		 * 	Data find at the girl collection with using boy collectino's _id value
		 * 
		 */
		db.collection('girl').find({'boy':id}).toArray(function(err, result){
			for(var i = 0; i < result.length; i++){
				console.log(result[i].name);
			}
			// The result is 'sara' , 'alex'
		});
		
		// boy collection has '56d6de41996f4f04705b834a' value as _id
		// girl collection's data has attributes boy with data '56d6de41996f4f04705b834a'
		// RDMS join function is similar with those action on above
	});
	
});


