/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var express = require('express');
var es = require('elasticsearch');

var client = new es.Client({
	host:'127.0.0.1:9200'
		//log:'trace'
});

//웹 서버를 생성합니다.
var app = express();
var server = http.createServer(app);

//웹 서버를 설정합니다.
app.use(app.router);
app.use(express.logger());
app.use(express.static(__dirname + '/public'));

//웹 서버를 실행합니다.
/*server.listen(30000, function () {
    console.log('Server Running at http://127.0.0.1:30000');
});
 */
/*client.ping({
	// ping usually has a 3000ms timeout 
	requestTimeout: Infinity,

	// undocumented params are appended to the query string 
	hello: "elasticsearch!"
}, function (error) {
	if (error) {
		//console.trace('elasticsearch cluster is down!');
	} else {
		//console.log('All is well');
	}
});*/

/*
client.index({
	index: 'sample',
	type: 'document',
	id: '1',
	body: {
		name: 'Reliability2', 
		text: 'Reliability2 is improved if multiple redundant sites are used, which makes well-designed cloud computing suitable for business continuity.'
	}
}, function (error, response) {
	console.log(response);
});*/

client.search({
	index: 'books',
	type: 'book',
	body: {
		/*query: {
			terms:{ // term
				//title:'prince'
				//title:'Prince' // Case-sensitive
				//title:['prince', 'king']
				title : ["the", "and", "of"],
				minimum_number_should_match : 2
			}
		}
		filter: {
			query: {
				bool: {
					must:
					       {
					    	   terms: {
					    		   "title": ['the', 'and', 'of']
					    	   }
					       },
					       "minimum_should_match": 2	// ('the', 'and') ('the', 'of') ('and', 'of')
				}
			}
		}
		query:{
			match:{
				title: 'The And'	// Tokenize 'the' and 'and' then query.
			}
		}
		
		query:{
			match:{
				title:{
					query:'the and',
					operator:'and'	// In this case, both queries should be contained
				}
			}
		}
		
		query:{
			match:{
				title:{
					query:'and the',
					//operator:'and'	// In this case, both queries should be contained
					//analyzer:'whitespace'
					type:'phrase'
				}
			}
		}*/
		
		query:{
			multi_match:{
				fields:['title', 'plot'],
				query:'prince hamlet',
				operator:'and'
			}
		}
		
	}
}).then(function (resp) {
	console.log(resp);
	for(var i = 0; i < resp.hits.hits.length; i++){
		console.log(resp.hits.hits[i]._source);
	}

}, function (err) {
	console.log(err.message);
});

/*var _index = "company";
var _type = 'employee';

app.get('/index', function (req, res) {

    client.indices.delete({index: _index});

    client.indices.create({
        index: _index,
        body: {
            "settings": {
                "analysis": {
                    "filter": {
                        "autocomplete_filter": {
                            "type": "edge_ngram",
                            "min_gram": 1,
                            "max_gram": 10
                        }
                    },
                    "analyzer": {
                        "autocomplete": {
                            "type": "custom",
                            "tokenizer": "standard",
                            "filter": [
                                "lowercase",
                                "autocomplete_filter"
                            ]
                        }
                    }
                }
            },
            "mappings": {
                "employee": {
                    "properties": {
                        "city": {
                            "type": "string",
                            "fields": {
                                "raw": {"type": "string", "index": "not_analyzed"}
                            }
                        },
                        "country": {
                            "type": "string",
                            "fields": {
                                "raw": {"type": "string", "index": "not_analyzed"}
                            }
                        },
                        "first_name": {
                            "type": "string",
                            "fields": {
                                "autocomplete": {"type": "string", "index_analyzer": "autocomplete"}
                            }
                        },
                        "last_name": {
                            "type": "string"
                        },
                        "gender": {
                            "type": "string", "index": "not_analyzed"
                        },
                        "job_title": {
                            "type": "string",
                            "fields": {
                                "raw": {"type": "string", "index": "not_analyzed"}
                            }
                        },
                        "language": {
                            "type": "string",
                            "fields": {
                                "raw": {"type": "string", "index": "not_analyzed"}
                            }
                        }
                    }
                }
            }
        }

    }, function (error, response) {
        fs.readFile('sample_data.json', 'utf8', function (err, data) {
            if (err) throw err;
            var sampleDataSet = JSON.parse(data);

            var body = [];

            sampleDataSet.forEach(function (item) {
                body.push({"index": {"_index": _index, "_type": _type}});
                body.push(item);
            });

            client.bulk({
                body: body
            }, function (err, resp) {
                //res.render('index', {result: 'Indexing Completed!'});
            })
        });
    })
})
;

app.get('/autocomplete', function (req, res) {
    client.search({
        index: _index,
        type: _type,
        body: {
            "query": {
                "filtered": {
                    "query": {
                        "multi_match": {
                            "query": req.query.term,
                            "fields": ["first_name.autocomplete"]
                        }
                    }
                }

            }
        }
    }).then(function (resp) {

        var results = resp.hits.hits.map(function(hit){
            return hit._source.first_name + " " + hit._source.last_name;
        });

        res.send(results);
    }, function (err) {
        console.trace(err.message);
        res.send({response: err.message});
    });
});

app.get('/search', function (req, res) {

    var aggValue = req.query.agg_value;
    var aggField = req.query.agg_field;

    var filter = {};
    filter[aggField] = aggValue;

    client.search({
        index: _index,
        type: _type,
        body: {
            "query": {
                "filtered": {
                    "query": {
                        "multi_match": {
                            "query": req.query.q,
                            "fields": ["first_name^100", "last_name^20", "country^5", "city^3", "language^10", "job_title^50"],
                            "fuzziness": 1
                        }
                    },
                    "filter": {
                        "term": (aggField ? filter : undefined)
                    }
                }

            },
            "aggs": {
                "country": {
                    "terms": {
                        "field": "country.raw"
                    }
                },
                "city": {
                    "terms": {
                        "field": "city.raw"
                    }
                },
                "language": {
                    "terms": {
                        "field": "language.raw"
                    }
                },
                "job_title": {
                    "terms": {
                        "field": "job_title.raw"
                    }
                },
                "gender": {
                    "terms": {
                        "field": "gender"
                    }
                }
            },
            "suggest": {
                "text": req.query.q,
                "simple_phrase": {
                    "phrase": {
                        "field": "first_name",
                        "size": 1,
                        "real_word_error_likelihood": 0.95,
                        "max_errors": 0.5,
                        "gram_size": 2,
                        "direct_generator": [{
                            "field": "first_name",
                            "suggest_mode": "always",
                            "min_word_length": 1
                        }],
                        "highlight": {
                            "pre_tag": "<b><em>",
                            "post_tag": "</em></b>"
                        }
                    }
                }
            }
        }
    }).then(function (resp) {
        res.render('search', {response: resp, query: req.query.q});
    }, function (err) {
        console.trace(err.message);
        res.render('search', {response: err.message});
    });
});*/