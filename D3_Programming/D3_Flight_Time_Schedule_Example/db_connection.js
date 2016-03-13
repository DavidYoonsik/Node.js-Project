/**
 * http://usejsdoc.org/
 */

var mongo = require('mongodb').MongoClient;
var server = require('mongodb').Server;
var objectId = require('mongodb').ObjectID;

var mongoclient = new mongo(new server('localhost',27017,{'native_parser':true}));

exports.get_open = function(){
	mongoclient.open(function(err, mongoclient) {
		if(err) throw err;
		console.log('MongoDB client connected on port 27017');
	});
}

exports.get_db = function(name){
	return mongoclient.db(name);
}
