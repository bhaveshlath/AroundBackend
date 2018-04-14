var http = require('http');
var url = require('url');
var dt = require('./RegisterUser');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhavesh.lath@gmail.com',
    pass: 'KeepMoving'
  }
});

var mailOptions = {
  from: 'bhavesh.lath@gmail.com',
  to: 'bhavesh.lath@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

var v = '';
http.createServer(function (req, res) {
        if(req.url != '/favicon.ico' && req.method == 'POST'){
                var jsonString = '';
                var q = url.parse(req.url, true);
                req.on('data', function (data) {
                        jsonString += data;
                        dt.loadUserData(JSON.parse(jsonString), function(resp){
                        console.log("finally:" + resp);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        if(resp == "Success"){
                                res.end("{'ASResponse': {'status':'success', 'body':" + jsonString + "}}");
                        }else{
                                res.end("{'ASResponse': {'status': 'error', 'body':{}}}");
                        }
                        });

                });

                req.on('end', function () {
                        console.log(JSON.parse(jsonString));
                });
                res.writeHead(200, {'Content-Type': 'application/json'});

        }
}).listen(8080);
