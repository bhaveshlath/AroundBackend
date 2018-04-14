var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var url = require('url');
var formidable = require("formidable");

router.get('/userPosts', function(req, res){
        console.log("userPosts");
        var db = req.db;
        var collection = db.get('posts');
        var q = url.parse(req.url, true).query;
        collection.find({'user.userPersonalInformation.emailID' :q.emailID}, function(err, result){
                if (err){
                        console.log("userPosts, error");
                        res.json({status: 'error', message: 'Some error occurred. Please try again in sometime.'});
                }
                if(result){
                        console.log("userPosts, success");
                        res.json({"status": "success", "message": "call successfull", "body": result});
                }
        });
});

router.post('/uploadProfileImage', function(req, res, next) {
    var form = new formidable.IncomingForm();
    var imageFileName = '';
    var userID = '';
    form.parse(req, function(err, fields, files) {
        if (err) next(err);
    });   
         
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploadsss/' + file.name;
    }); 

    form.on('file', function (name, file){
        imageFileName = String(file.name);
    });

    form.on('field', function(name, value) {
        userID = String(value);
    }) 
    
    form.on('end', function() { 
        var db = req.db;
        var collection = db.get('users');
        var ObjectId = require('mongodb').ObjectId;
        var userObjectId = new ObjectId(String(userID));
        collection.update({_id: userObjectId},{$set: {'profileImage': 'http://ec2-13-59-88-123.us-east-2.compute.amazonaws.com/uploadsss/' + imageFileName}}, function(err, result){
                res.end("Profile image store successfully.")
        });
});

});

module.exports = router;
