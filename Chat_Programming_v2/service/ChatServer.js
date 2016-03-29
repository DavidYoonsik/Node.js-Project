/**
 * Chat Server Source
 */
io.sockets.on('connection',function(socket){
	
	socket.on('roommake',function(data){

		socket.join(data.roomname);
		socket.set('room',data.roomname);
		socket.set('nickname',data.nickname);
		
		//规 格废 傈价
		socket.get('nickname',function(err,name){
			io.sockets.emit('roomlist',{"roomdata":io.sockets.manager.rooms,"clientid":socket.id,"nickname":name});
			socket.get("room",function(err,room){
				io.sockets.in(room).emit('intro',name);
			});
		});
	
	});
	
	//message 贸府
	socket.on('message',function(data){
		socket.get('nickname',function(err,name){
			socket.get('room',function(err,room){
				io.sockets.in(room).emit('message_send',{'msg':data.msg,'from':name});
			});
		});
	});
	
	socket.on('disconnect', function () {
		//规 格废 傈价
		socket.get('nickname',function(err,nickname){
			socket.get('room',function(err,room){
				io.sockets.in(room).emit('message_send_disconnect',{'msg':'','from':nickname});
			});
		});
		io.sockets.emit('room_research',null);
		
	});
	
});

