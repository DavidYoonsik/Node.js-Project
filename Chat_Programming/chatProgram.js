/**
 * http://usejsdoc.org/
 */
var http = require('http');
var express = require('express');
var sql = require('mysql');
var socket = require('socket.io');
var fs = require('fs');
var ejs = require('ejs');
var url = require('url');

var app = express();

app.use(express.cookieParser());
app.use(express.session({
	secret : 'secret'
}));
app.use(express.bodyParser());
app.use(app.router);

var client = sql.createConnection({
	user:'root', password:'admin', database:'company'
});

var server = http.createServer(app);
server.listen(30000, function(error){
	console.log(error);
});

//Chat_login
app.get('/chat_login', function(req, res){
	fs.readFile('chat_login.html', 'utf8', function(error, data){
		res.send(data);
	});
});

app.post('/chat_login', function(req, res){
	console.log(req.body);
	var name = req.body.name;
	var pw = req.body.pw;
	client.query('select * from chat_user where user_name = ? and user_pw = ?', [name, pw], function(error, result){
		if(result.length !== 0){
			req.session.result = result;
			res.redirect('/friend');
		}else{
			res.redirect('/chat_login');
		}
	});
});

//Friends List
app.get('/friend', function(req, res){
	fs.readFile('chat_friend.html', 'utf8', function(error, data){
		res.send(data);
	});
});

app.post('/friend', function(req, res){
	fs.readFile('friend.html', 'utf8', function(error, data){
		console.log(req.session.result);
		client.query('select * from chat_user where user_id != ?', [parseInt(req.session.result[0].user_id)], function(error, result){
			console.log(result);
			res.send(result);
		});
	});

});

//Chat Start
app.get('/chat_start', function(req, res){
	fs.readFile('chat_start.html', 'utf8', function(error, data){
		res.send(data);
	});
});

app.post('/chat_start', function(req, res){
	var my_id = req.session.result[0].user_id;
	var other_id = req.body.user_id;
	var room_id = (parseInt(my_id) + parseInt(other_id)) * (my_id * other_id);
	req.session.other_id = other_id;
	req.session.room_id = room_id;
	fs.readFile('chat_start.html', 'utf8', function(error, data){
		res.send(data);
	});
});

//Chat Message
app.post('/message', function(req, res){
	console.log(req.session);

	var my_id = req.session.result[0].user_id;
	var room_id = req.session.room_id;
	var user_info = {user_id:my_id, room_id:room_id};

	client.query('select * from chat_room where room_id = ?', [
	                                                           room_id
	                                                           ], function(error, result){
		console.log(result);
		if(result.length != 0){
			console.log('result is exist!');
			user_info.flag = 1;

			console.log(user_info);
			res.send(user_info);
		}else{
			console.log('result is not exist!');
			var user_id = [req.session.result[0].user_id, req.session.other_id];
			var date = new Date().toDateString();
			for(var i = 0; i < user_id.length; i++){
				client.query('insert into chat_room (room_id, user_id) values (?, ?)',
						[
						 room_id, user_id[i]
						 ], function(error, result){
					console.log(error);
				});
			}
			user_info.flag = '2';
			res.send(user_info);
		}

	});
});

app.post('/get_msg', function(req, res){
	var room_id = req.session.room_id;

	client.query('select * from chat_msg where room_id = ? order by msg_id',
			[
			 room_id
			 ], function(err, result, field){
		res.send(result);
	});
});


var io = socket.listen(server);
io.sockets.on('connection', function(sockets){

	sockets.on('join_server', function(data){
		sockets.join(data);
		sockets.name = data;
		console.log(sockets.name);
	});

	sockets.on('message', function(data) {
		if(data.flag == '1'){
			client.query('insert into chat_msg (room_id, user_id, msg_talk) values (?, ?, ?)',
					[
					 data.room_id, data.user_id, data.message
					 ], function(err, result, field){
				console.log(err);
				io.sockets.in(sockets.name).emit('message', data);
			});
		}

	});



	sockets.on('get_message', function(data) {
		console.log('----------------------' + data);
		client.query('select * from chat_msg where room_id = ? ',
				[
				 data.room_id
				 ], function(err, result, field){
			console.log('the result is : ' + result);
			io.sockets.emit('get_message', result);
		});
	});
});