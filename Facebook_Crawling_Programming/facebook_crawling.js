/**
 * http://usejsdoc.org/
 */

var access_token = 'CAAYcyJyyVdYBALecVt8bwyZC2FjEAphNDysxGU2xH6q6fufYbvCJHwKf1b6ONo3hCItXh7ZBiwG05SOczLm9ERsSFSFap8euc7MV3l9jpEZBlXJuEONrLFsqIGIbJzKFdFBgcay8z8eIVZCO7T7Leyn6tTz9QGTxQa3LPjLmyW62fmgXD7ccXVCYw4BLKWq5PqUMn4m1TgZDZD';
var myId = '734230706698657';//'734230706698657';//'1400166580254734';
var FB = require('fb');
var url = require('url');
var fs = require('fs');

FB.setAccessToken(access_token);

var glo = '';

function getWallFeeds(feedLink, args) {

	FB.api(feedLink, 'get', args, function (res) {
		if (!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		}

		//console.log(res);
		processMessage(res.data);

		var nextLinkParts = url.parse(res.paging.next, true);

		//console.log(nextLinkParts);

		var args = {
				limit: nextLinkParts.query.limit,
				until: nextLinkParts.query.until,
				access_token: nextLinkParts.query.access_token
		}


		//getWallFeeds(feedLink, {});
	});
}


function processMessage(data) {
	for (i in data) {

		/*console.log(data[0].from.name); // name, category, id
		console.log(data[0].message);
		console.log(data[0].created_time);

		var x = data[i].from.name;
		x += '\n\n' + data[i].message;
		x += '\n\n' + data[i].created_time + '\n\n';*/

		fs.appendFile('log2.txt', data[i].message + ', ' + data[i].story, 'utf-8', function(err){
			if(err){
				throw err;
			}
		});

		/*if (data[i].from.id!=myId) {
			name = data[i].from.name;
			message = data[i].message;
			console.log(name+':::::::::::::::: '+message);
		}else{
			name = data[i].from.name;
			message = data[i].message;
			console.log(name+': '+message);
		}*/

		//console.log(data[i]);
		/*var loc = data[0].message;
	if(glo.length == 0){
		glo = data[0].message;
		fs.appendFile('log2.txt', data, 'utf-8', function(err){
			if(err){
				throw err;
			}
		});
	}else{
		if(glo.length == loc.length){
			console.log('same result is got from facebook!');
		}else{
			fs.appendFile('log2.txt', data[0].message, 'utf-8', function(err){
				if(err){
					throw err;
				}
			});
		}
	}*/

	}
}

feedLink = '1400166580254734/posts';//'usitnewsinkorea/posts'; // me/feed

getWallFeeds(feedLink, {});
