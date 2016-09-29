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
  if (keyword === "history") {
        mongodb.MongoClient.connect('mongodb://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.COLL, function(err,db) {
         if (err) throw err;
         var imgsearch = db.collection('imgsearch');
        imgsearch.count({}, function(err, count) {
          console.log(count);
          imgsearch.find({_id: {$gt: count - 12}}).toArray(function(err,data){
            for (var i = count - 1; i > count - 11; i--){
              output[count - i - 1] = {
                keyword: data[i]["keyword"],
                date: data[i]["date"]
              }
            }
            res.send(JSON.stringify(output));
          })
        })
      })
  }
  else if (keyword.length > 0){
        mongodb.MongoClient.connect('mongodb://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.COLL, function(err,db) {
              if (err) throw err;
              var imgsearch = db.collection('imgsearch');
              imgsearch.count({}, function(err, count) {
                  if (err) throw err;
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
        request({
            url: "http://api.duckduckgo.com/?q=" + keyword + "&format=json&pretty=1",
            method: 'GET'
          }, function(error, response, body){
             if(error) {
                 console.log(error);
               } else {
                          for (var i = 0; i < JSON.parse(body).RelatedTopics.length; i++) {
                           output[i] = {
                          icon: JSON.parse(body).RelatedTopics[i].Icon,
                          URL: JSON.parse(body).RelatedTopics[i].FirstURL
                            };
                               }
                      res.write("query string: " + keyword + "\n");
                      res.write(JSON.stringify(output)); 
                      }
        res.end();
  
});

}
else {
  res.sendFile(__dirname + '/public/index.html')
}
});

app.listen(process.env.PORT || 8080);
