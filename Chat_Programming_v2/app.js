//����� ������ ����
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var fs = require('fs');
var path = require('path');

//��Ʈ ���� 
app.set('port', 30000);
//favicon ���� 
app.use(express.favicon());
//POST body �б� 
app.use(express.bodyParser());
//static ���� ��� ����
app.use(express.static(path.join(__dirname, 'public')));

//App ����
app.start = app.listen = app.aaa = function(){
	return server.listen.apply(server, arguments)
}
app.aaa(app.get('port'),function(){
	console.log("Server Start");
});

// ���� ���� include �Լ� 
function include(file_) {
	with (global) {
		eval(fs.readFileSync(file_) + '');
	};
};

// config ���� �߰�
include(__dirname + "/config/include.js")

// ���� ���� �߰�
for(var i = 0 ; i < servicefile.length ; i++){
	include(__dirname + "/service/" + servicefile[i] );
}

// ��� http ��û ó�� 
app.all('*', function(req, res, next){
	next();
});
 