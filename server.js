var express = require('express');
var app = express();
var id;
var keyword;
var mongodb = require('mongodb');
var d = new Date();
var request = require('request');
var output = [];


app.get('*',function(req, res, next) {
  keyword = req.originalUrl.slice(1,req.originalUrl.length);
/*mongodb.MongoClient.connect('mongodb:/', function(err,db) {
  if (err) throw err;
  var imgsearch = db.collection('imgsearch');
  imgsearch.count({}, function(err, count) {
        if (err) throw err;
        console.log(count);
        id = count + 1;
        imgsearch.insert({
            _id: id,
            keyword: keyword,
            date: d.toLocaleDateString() + " " + d.toLocaleTimeString()
            })
        db.close();
  })
  res.end();
  next();
})*/

request({
    url: 'http://api.duckduckgo.com/?q=simpsons+characters&format=json&pretty=1', //URL to hit
    method: 'GET',
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        for (var i = 0; i < JSON.parse(body)["RelatedTopics"].length; i++) {
          output[i] = {
            icon: JSON.parse(body)["RelatedTopics"][i]["Icon"]["URL"],
            URL: JSON.parse(body)["RelatedTopics"][i]["FirstURL"]
          };
        }
        res.write("query string: " + keyword);
        res.write(JSON.stringify(output)); 
        console.log(response.statusCode);
        console.log(JSON.parse(body)["RelatedTopics"][1]);   
    }
res.end();
  
});


});

app.listen(process.env.PORT || 8080);
