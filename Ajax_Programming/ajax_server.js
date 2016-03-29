/**
 * http://usejsdoc.org/
 */

var http = require('http');
var express = require('express');
var fs = require('fs');
var sql = require('mysql');
var query = require('querystring');

var app = express();

app.use(express.cookieParser());
app.use(express.session({
	// `secret` option required for sessions
	secret : 'my key'
}));
app.use(express.limit('1mb'));
app.use(express.bodyParser());
app.use(app.router);


var client = sql.createConnection({
	user:'root', password:'admin', database:'test'
});

var server = http.createServer(app);
server.listen(30000, function(){
	//console.log('Server is running at the localhost:30000/');
});

// File upload
app.get('/', function (request, response) {
    fs.readFile('ajax_test.html', function (error, data) {
    	
    	var logsPath = __dirname + '/logstash/';
    	filePath = logsPath + 'log'; //+ Date.now();
    	
    	var y = parseInt((Math.random()*10)) + 1;
   
    	//console.log(logsPath);
    	
    	//var x = '{"name":"david", "position":"king", "number":' + y + '}';
    	//var obj = JSON.parse(x);
    	//console.log(obj.name);
    	fs.exists(logsPath, function(exists) {
    		if(exists){
    			fs.appendFile(filePath+'.txt', '\n'+y, 'utf-8', function(err){
    				if(err){
    					throw err;
    				}
    			});
    		}else{
    			fs.mkdir(logsPath, function(err){
    				fs.appendFile(filePath+'.txt', 'log information test!', 'utf-8', function(err){
        				if(err){
        					throw err;
        				}
        			});
    			});
    		}
    	});
    	
        response.send(data.toString());
    });
});

app.post('/', function (request, response) {

    var comment = request.param('comment');
    var imageFile = request.files.image;

    if (imageFile) {

        var name = imageFile.name;
        var path = imageFile.path;
        var type = imageFile.type;

        if (type.indexOf('image') != -1) {
        	
        	var outputPath = __dirname + '/multipart/';
        	var filePath = outputPath + Date.now() + '_' + name;
        	
        	console.log(outputPath);
        	
        	fs.exists(outputPath, function(exists) {
        		if(exists){
        			fs.rename(path, filePath, function (error) {
                        response.redirect('/');
                    });
        		}else{
        			fs.mkdir(outputPath, function(err){
        				fs.rename(path, filePath, function (error) {
                            response.redirect('/');
                        });
        			});
        		}
        	});
            
        } else {

            fs.unlink(path, function (error) {
                response.send(400);
            });
        }
    } else {

        response.send(404);
    }
});



app.get('/ajax', function(req, res){
	fs.readFile('ajax_test.html', 'utf8', function(error, data){
		res.send(data);
	});
});

app.post('/ajax', function(req, res){
	req.session.name = req.body.name;
	req.session.city = req.body.city;
	console.log(req.session);
	client.query('select * from products', function(error, result){
		res.send(result);
	});
});

app.post('/ajax_cookie', function(req, res){
	res.cookie('name', req.body.name);
	res.cookie('city', req.body.city);
	//console.log(req.cookies);
	var x = req.cookies.name;
	//console.log(x);
	for(var i in x){
		var half = x[i].length / 2;
		if(x[i].length % 2 == 0){
			var front = x[i].substring(0, half);
			var tail = x[i].substring(half, x[i].length);
			console.log(front + ', ' + tail);
		}else{
			var front = x[i].substring(0, half);
			var tail = x[i].substring(half+1, x[i].length);
			console.log(front + ', ' + tail);
		}
		//console.log(i + ' : ' + x[i]);
	}
	/*client.query('select * from products', function(error, result){
		res.send(result);
	});*/
	var x = [{
		id : "No 1",
		name : "Beatiful",
		modelnumber : "123456"
	}];
	
	res.send(x);
});

app.get('/mysql_test', function(req, res){
	/*client.query('insert into chat_table (name, email, cp, address) values (?, ?, ?, ?)', 
			['alex', 'alex@email.com', '0100123456', 'london'], 
			function(error, result, field){
				//query statement should be included in quotation.
				res.send("<h1>success</h1>");
	});*/
	
	client.query('select * from chat_table', 
			function(error, result, field){
				//query statement should be included in quotation.
				console.log(result[0].id);
				console.log(field[0].name);
	});
});


app.get('/park', function(req, res){
	fs.readFile('parking.html', 'utf8', function(error, data){
		res.send(data);
	});
});

app.post('/insert_park', function(req, res){
	var car_no = req.body.car;
	client.query('insert into parking (car_no, in_time) values (?, now())', 
			[car_no], 
			function(error, result, field){
				if(error){
					
				}else{
					client.query("select id, car_no, DATE_FORMAT(in_time,'%Y.%m.%d %h:%i') in_time, pay from parking where car_no = ?",
							[car_no],
							function(error, result){
								console.log(result);
								res.send(result);
					});
				}
	});
});

app.post('/select_park', function(req, res){
	client.query("select id, car_no, ifnull(DATE_FORMAT(in_time,'%Y.%m.%d %H:%i'), '') in_time, ifnull(DATE_FORMAT(out_time,'%Y.%m.%d %H:%i'), '') out_time, ifnull(pay, '') pay from parking",
			function(error, result){
				console.log(result);
				res.send(result);
	});
});

app.post('/detail_park', function(req, res){
	client.query("select id, car_no, ifnull(DATE_FORMAT(in_time,'%Y.%m.%d %H:%i'), '') in_time, ifnull(DATE_FORMAT(out_time,'%Y.%m.%d %H:%i'), '') out_time, ifnull(pay, '') pay from parking",
			function(error, result){
				console.log(result);
				res.send(result);
	});
});
