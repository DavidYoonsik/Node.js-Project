/**
 * http://usejsdoc.org/
 */

var mongo = require('mongodb').MongoClient;
var server = require('mongodb').Server;
var objectId = require('mongodb').ObjectID;
var http = require('http');
var express = require('express');

var app = express();

app.use(app.router);

var run = http.createServer(app);

var mongoclient = new mongo(new server('localhost',27017,{'native_parser':true}));

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

app.get('/', function(req,res) {

		
	db.collection('mapreduce').aggregate([
	                                      {$match:{status:"A"}}, 
	                                      {$group:{_id:"$cust_id", total:{$sum:"$amount"}}}], 
	                                      function(err, result){
		console.log(result);
		console.log('---' + result.length);
	});

	// Join using manual reference
	/*var original_id = new objectId();
	
	db.collection('ref_main').save({"_id":original_id, "name":"Google", "url":"http://www.google.com"}, function(err, result){
		if(!err){
			console.log('save!');
		}
	});
	db.collection('ref_sub').save({"name":"Google", "sub_id":original_id ,"location":"America"}, function(err, result){
		if(!err){
			console.log('save!');
		}
	});*/
	
	// Using aggregation
	/*db.collection('ref_main', 'ref_sub').aggregate([{$match:{_id:sub_id}}], function(err, result){
		console.log(result);
	});*/
	
	db.collection('ref_main').find({}, {_id:1}).toArray(function(err, result){
		for(var i = 0; i < result.length; i++){
			db.collection('ref_sub').find({sub_id:result[i]._id}).toArray(function(err, result){
				console.log(result);
			});
		}
		
	});
	
	
	res.send('Hello world');
	
});
