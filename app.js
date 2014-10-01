'use strict';
var express=require('express');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./Gruntfile.js');
// configuration
require('./config')(app);

// models
require('./models')(app);

//routes
require('./routes')(app,io);

//controller
require('./controller')(app);


app.use(function(req,res,next){
    res.status(404)
    var render='<body style="background-color:#1F2F3F "><h1 style="color:#ffffff;position:absolute;left: 0;top:0;right: 0;bottom: 0;height:37px;text-align: center;margin: auto 0 ">' +
        'Sorry<br>This page is not found</h1></body>'
    res.end(render);
});



//server.listen(80);
// mongodb://igor:igorpass@ds041177.mongolab.com:41177/valorkin_test_mdb
//mongodb://localhost/test

var mongoose =require('mongoose');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://igor:igorpass@ds041177.mongolab.com:41177/valorkin_test_mdb';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('open', function () {
  console.log('iam connect test db');
});

var port = Number(process.env.PORT || 4000);
server.listen(port);
console.log("start server"+port);

io.on("connection",function(socket){
    socket.emit("notify",{hellow:"client"});
    socket.on('my other event', function (data) {
        console.log(data);
    });
})