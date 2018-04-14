var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var http = require('http');
var url = require('url');

transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'around170690@gmail.com',
    pass: 'around123'
  }
});

router.post('/registerUser', function(req, res) {
        console.log('registerUser-router');
        var db = req.db;
        var collection = db.get('users');
        var queryCount = false;
        collection.count({"userPersonalInformation.emailID": req.body.userPersonalInformation.emailID}, function(err, result) {
                if (err){
                        res.json({status: 'error', message: 'Some error occurred. Please try again in sometime.'});
                }
                if(result > 0){
                        queryCount = true;
                        res.json({status: 'error', message: 'User with this email ID already exists.Please use different emailID to register.'});
                }
                else{
                        collection.insert(req.body, function (err, doc) {
                                 if (err) {
                                         res.json({status: 'error', message: 'Some error occurred. Please try again in sometime.'});
                                }
                                 else {
                                        var emailText = 'http://ec2-13-59-88-123.us-east-2.compute.amazonaws.com/register/verifyUser' + '?id=' + doc._id;
                                        var emailTo = req.body.userPersonalInformation.emailID;
                                        console.log(req.body.userPersonalInformation.emailID);
                                        console.log(emailTo);
                                        var mailOptions = {
                                                from: 'around170690@gmail.com',
                                                to: req.body.userPersonalInformation.emailID,
                                                subject: 'Verify account',
                                                text: emailText
                                        };
                                        transporter.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                        console.log(error);
                                                } else {
                                                        console.log('Email sent: ' + info.response);
                                                }
                                        });
                                        res.json({status: 'success', message: 'User successfully created.'});
                                }
                        });

                }
        });
});

router.post('/loginUser', function(req, res){
        var db = req.db;
        var collection = db.get('users');
        console.log(req.body.emailID);
        collection.findOne({"userPersonalInformation.emailID": req.body.emailID}, function(err, result) {
                if (err){
                        res.json({status: 'error', message: 'Some error occurred. Please try again in sometime.'});
                }
                if(result){
                        console.log(result._id);
                        console.log(result.userPersonalInformation);
                        if(result.userPersonalInformation.password != req.body.password){
                                console.log("wrong password");
                                res.json({status: 'error', message: 'Wrong Password.!! Please try again.'})
                        }else if(result.profileStatus == 'Pending-Verification'){
                                console.log("Pending-Verification");
                                res.json({status: 'error', message: 'EmailID is still not verified. Please use the link sent to your email ID to verify your account and then try again later.'});
                        }else{
                                res.json({"status": "success", "message": "Login successful!!", "body": result});
                        }
                }
                else{
                        console.log("Invalid Email Error");
                        res.json({status: 'error', message: 'Invalid EmailID!! Please try again.'})
                }
        });
});

router.get('/verifyUser', function(req, res){
        var db = req.db;
        var collection = db.get('users');
        res.writeHead(200, {'Content-Type': 'text/html'});
        var q = url.parse(req.url, true).query;
        collection.update({'_id' :q.id},{$set: {'profileStatus': 'Email-Verified'}}, function(err, result){
                res.end("Successfully verified !! Hurray. Please go to mobile application and explore the world Around you.!!")
        });
});

module.exports = router;