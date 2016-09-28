var express = require('express');
var app = express();
var id;
var mongodb = require('mongodb');


app.use('',function(req, res, next) {
var url = req.originalUrl.slice(1,req.originalUrl.length);
mongodb.MongoClient.connect('url', function(err,db) {
  if (err) console.log(err);
  var imgsearch = db.collection('imgsearch');
  
  //id = parseInt(imgsearch.count()) + 1;
 // app.json(imgsearch.count())
  /*imgsearch.insert({
    _id: id,
    url: url
  })*/
  app.("finish");
  db.close();
  next();
})

});

app.listen(process.env.PORT || 8080);
