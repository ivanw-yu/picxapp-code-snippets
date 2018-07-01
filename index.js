var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var port = process.env.PORT || 4000;
var url = require('./config/db').url;


var users = require('./routes/users');
var photos = require('./routes/photos');

mongoose.connect(url);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/client/build'));

app.use(bodyParser.json({limit: '50mb'}));

app.use('/api/users', users);
app.use('/api/photos', photos);

app.listen(port, () => {
  console.log('app listening at', port);
});
