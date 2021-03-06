var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var url = require('url');

//Mongo Database modules
var mongo = require('mongodb');
var monk = require('monk');

var db = monk('localhost:27017/aroundDB');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) { 
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});          
      
module.exports = app;