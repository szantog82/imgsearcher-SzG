var express = require('express');
var app = express();
var id;
var mongodb = require('mongodb');
var d = new Date();


app.get('*',function(req, res, next) {
var keyword = req.originalUrl.slice(1,req.originalUrl.length);
mongodb.MongoClient.connect('mongodb:/', function(err,db) {
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
})

});

app.listen(process.env.PORT || 8080);
