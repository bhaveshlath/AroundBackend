var express = require('express');
var connect = require('connect');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://localhost:27017/aroundDB');



var register = require('./register');
var profile = require('./profile');
var posts = require('./posts')
require('./route.js')(app);


app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({'extended': 'true'}));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/register', register);
app.use('/posts', posts);
app.use('/profile', profile);

//For Image upload
app.use('/uploadsss', express.static(__dirname + '/uploadsss'));


app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
