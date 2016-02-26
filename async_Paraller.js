/**
 * http://usejsdoc.org/
 */

var async = require('async');
var mongo = require('mongodb').MongoClient;
var server = require('mongodb').Server;
var http = require('http');
var express = require('express');

var app = express();

app.use(app.router);

var run = http.createServer(app);
var mongoclient = new mongo(new server('192.168.1.1',27017,{'native_parser':true}));

mongoclient.open(function(err, mongoclient) {
    if(err) throw err;
    console.log('mongo client connected');
});

run.listen(30000, function(error){	
	console.log('Express server listening on port 30000');
});


var db = mongoclient.db('node'); // What you want to use for database

app.get('/', function(req,res) {
	var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
	db.collection('products').save(user1, function(err, result){
		if(err){
			console.log(err);
			//db.close();
		}
	});
	
	db.collection('stock').update({name:'Sony'}, {$set:{amount:500}}, true, function(err, result){
		if(err){
			console.log(err);
			//db.close();
		}
	});
	
	//db.collection('products').findOne({price:500000}).toArray(function(err,doc){
	
	db.collection('products').findOne({price:500000}, function(err,doc){
		//if(err) throw err;
		db.collection('stock').find({name:doc.name}).toArray(function(err, result){
			res.send(result);
		});
		
		db.collection('new_stock').save(doc, function(err, result){
			if(err){
				console.log(err);
				db.close();
			}
		});
	});
});



/*mongo.connect('mongodb://localhost/node', function(err, db){
	if(err!=null){
		console.log(err);
	}else{
		var collection = db.collection('products');

		//Find contents
		collection.find().toArray(function (err, result) {
			if (err) {
				console.log(err);
			} else if (result.length) {
				console.log('Found:', result[0].name);
			} else {
				console.log('No document(s) found with defined "find" criteria!');
			}
			//Close connection
			db.close();
		});

		//Create some users
		var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
		var user2 = {name: 'modulus user', age: 22, roles: ['user']};
		var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

		// Insert some users
		collection.insert([user1, user2, user3], function (err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
			}
			//Close connection
			db.close();
		});
	}
});*/



/*async.parallel([
                function(callback){
                	console.log('first');
                	setTimeout(function() {
                		console.log('first end');
                		callback(null, 1);
                	}, 2000);
                },
                function(callback){
                	console.log('second');
                	setTimeout(function() {
                		console.log('second end');
                		callback(null, 2);
                	}, 3000);
                }
                ], function(error, result){
	console.log('Last : ' + result);
});*/