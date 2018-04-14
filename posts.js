var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var ObjectId = require('mongodb').ObjectId;
var http = require('http');
var url = require('url');

var createPointLoc = function (lng, lat) {
    return {
        loc : {
            type : "Point",
            coordinates : [lng, lat]
        }
    };
};

var milesToRadian = function(miles){
    var earthRadiusInMiles = 3959;
    return miles / earthRadiusInMiles;
};

router.post('/submitPost', function(req, res){
        var db = req.db;
        var collection = db.get('posts');
        collection.insert(req.body, function(err, doc){
                if(err){
                        res.json({status: 'error', message: 'Some error occurred. Please try again in sometime.'});
                }else{
                        res.json({status: 'success', message: 'Your request has been succesfully posted.'});
                }
        });
});

router.post('/submitComment', function(req, res){
        var db = req.db;
        var collection = db.get('posts');
        console.log("submitComment reqBody:" + req.body.displayName);
        console.log("submitComment reqBody:" + req.body.userID);
        console.log("submitComment reqBody:" + req.body.content);
        var q = url.parse(req.url, true).query;
        console.log("submitComment:" + req.query.post_id);
        collection.update({"_id": q.post_id},{$push: {"comments": req.body}}, function(err, doc){
                if(err){
                        res.json({status: 'error', message: 'Some error occurred. Please try again in sometime.'});
                }else{
                        res.json({status: 'success', message: 'Your request has been succesfully posted.'});
                }
        });
});


router.get('/getPosts',function(req, res){
        var db = req.db;
        var q = url.parse(req.url, true).query;
        var userID = new ObjectId(q.userID);
        var centerSphereObject = [[parseFloat(q.longitude), parseFloat(q.latitude)], parseFloat(milesToRadian(q.searchRadiusLength))];
        console.log(centerSphereObject);
        var query = {
                "status": "ACTIVE",
                "user._id": { $ne: userID},
                "location.loc" : {
                        $geoWithin : {
                                 $centerSphere : centerSphereObject
                        }
                }
        };
        db.collection('posts').find(query, function(err, result) {
        if(err){
                 res.json({status: 'error', message: 'Some error occurred. Please try again in sometime.'});
        }else{
                res.json({status: 'success', message: 'Successfully received posts values', body: result});
        }
  });
});

router.get('/searchPosts', function(req, res){
        var db = req.db;
        db.collection('posts').find({})
});

module.exports = router;