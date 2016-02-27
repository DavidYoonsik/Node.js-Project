var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');

var seats = [
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
];

var app = express();

app.use(app.router);

app.get('/', function (request, response, next) {
    fs.readFile('HTMLPage.html', function (error, data) {
        response.send(data.toString());
    });
});

app.get('/seats', function (request, response, next) {
    response.send(seats);
});

// Running web server
var server = http.createServer(app)
server.listen(30000, function () {
    console.log('Server Running at http://127.0.0.1:30000');
});

// Running socket server
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    socket.on('reserve', function (data) {
        seats[data.y][data.x] = 2;
        io.sockets.emit('reserve', data);
    });
});
