/**
 * 방목록 조회 API
 */
app.get('/roomlist',function(req,res){

	res.send(io.sockets.manager.rooms);
	
});