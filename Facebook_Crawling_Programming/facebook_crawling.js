/**
 * http://usejsdoc.org/
 */

var access_token = 'CAACEdEose0cBAO6A12oB8aw0BbNJCxyGK1aZAurjsGpbjFNeKeEcFoEeAaEN6YyUXPJMAF7ns2PoCmRs5U5vJhZASyWIYhnfZCHXFmdyoQmJ8GCi4kbKUSnlaHNKsXC1ucSCIZAgZAxfD7gvlGVJuLa7MJriTxBvDBZB7kVGqPY3zV8cCTY5wT3P20opucpcIojf6njaredQZDZD';
var myId = '734230706698657';//'1400166580254734';
var FB = require('fb');
var url = require('url');

FB.setAccessToken(access_token);

function getWallFeeds(feedLink, args) {

	FB.api(feedLink, 'get', args, function (res) {
		if (!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		}

		processMessage(res.data);

		var nextLinkParts = url.parse(res.paging.next, true);

		var args = {
				limit: nextLinkParts.query.limit,
				until: nextLinkParts.query.until,
				access_token: nextLinkParts.query.access_token
		}


		getWallFeeds(feedLink, args);
	});
}


function processMessage(data) {
	for (i in data) {
		/*if (data[i].from.id!=myId) {
			name = data[i].from.name;
			message = data[i].message;
			console.log(name+':::::::::::::::: '+message);
		}else{
			name = data[i].from.name;
			message = data[i].message;
			console.log(name+': '+message);
		}*/
		console.log(data[i].comments);
	}
}

feedLink = '734230706698657/posts'; // me/feed

getWallFeeds(feedLink, {});